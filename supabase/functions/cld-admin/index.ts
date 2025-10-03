// supabase/functions/cld-admin/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const CLOUD_NAME = Deno.env.get("CLOUDINARY_CLOUD_NAME")!;
const API_KEY    = Deno.env.get("CLOUDINARY_API_KEY")!;
const API_SECRET = Deno.env.get("CLOUDINARY_API_SECRET")!;

const cors = {
  "Access-Control-Allow-Origin": "http://localhost:5173", // add your prod origin too
  "Vary": "Origin",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-auth",
  "Access-Control-Max-Age": "86400",
  "Content-Type": "application/json",
};

function b64(s: string) { return btoa(s); }

function toHex(buf: ArrayBuffer) {
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2,"0")).join("");
}
async function sha1Hex(s: string) {
  const d = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(s));
  return toHex(d);
}
async function sign(params: Record<string, any>) {
  const str = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join("&") + API_SECRET;
  return await sha1Hex(str);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { status: 200, headers: cors });

  try {
    // require a Supabase JWT (means user is signed-in)
    const auth = req.headers.get("Authorization") || "";
    if (!auth.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: cors });
    }

    // GET health
    if (req.method === "GET") {
      return new Response(JSON.stringify({ status: "ok" }), { status: 200, headers: cors });
    }

    const body = await req.json();
    const { op } = body || {};

    // 1) Sign upload
    if (op === "sign-upload") {
      const folder = body.folder || "r2blaze";
      const timestamp = Math.floor(Date.now() / 1000);
      const payload: Record<string, any> = { folder, timestamp };
      if (body.public_id) payload.public_id = body.public_id;
      const signature = await sign(payload);
      return new Response(JSON.stringify({
        cloudName: CLOUD_NAME,
        apiKey: API_KEY,
        folder,
        timestamp,
        signature
      }), { status: 200, headers: cors });
    }

    // 2) Delete (one or many)
    if (op === "delete") {
      const public_ids: string[] = body.public_ids ?? (body.public_id ? [body.public_id] : []);
      if (!public_ids.length) {
        return new Response(JSON.stringify({ error: "public_id(s) required" }), { status: 400, headers: cors });
      }
      // Cloudinary Admin delete endpoint (Basic auth)
      const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image/upload/delete_resources`;
      const form = new FormData();
      public_ids.forEach(id => form.append("public_ids[]", id));
      const r = await fetch(url, {
        method: "POST",
        body: form,
        headers: { "Authorization": `Basic ${b64(`${API_KEY}:${API_SECRET}`)}` }
      });
      const j = await r.json();
      return new Response(JSON.stringify(j), { status: r.status, headers: cors });
    }

    // 3) List by folder
    if (op === "list") {
      const folder: string = body.folder || "r2blaze";
      const next_cursor: string | undefined = body.next_cursor;

      // Use resources/search with expression: folder=...
      const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/search`;
      const form = new FormData();
      form.append("expression", `folder="${folder}"`);
      if (next_cursor) form.append("next_cursor", next_cursor);
      form.append("max_results", "100"); // adjust as you like

      const r = await fetch(url, {
        method: "POST",
        body: form,
        headers: { "Authorization": `Basic ${b64(`${API_KEY}:${API_SECRET}`)}` }
      });
      const j = await r.json();
      return new Response(JSON.stringify(j), { status: r.status, headers: cors });
    }

    // 4) Rename (move) public_id -> new public_id
    if (op === "rename") {
      const from_public_id: string = body.from_public_id;
      const to_public_id: string = body.to_public_id;
      if (!from_public_id || !to_public_id) {
        return new Response(JSON.stringify({ error: "from_public_id and to_public_id required" }), { status: 400, headers: cors });
      }
      const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image/upload/rename`;
      const form = new FormData();
      form.append("from_public_id", from_public_id);
      form.append("to_public_id", to_public_id);
      form.append("overwrite", "true");

      const r = await fetch(url, {
        method: "POST",
        body: form,
        headers: { "Authorization": `Basic ${b64(`${API_KEY}:${API_SECRET}`)}` }
      });
      const j = await r.json();
      return new Response(JSON.stringify(j), { status: r.status, headers: cors });
    }

    return new Response(JSON.stringify({ error: "Unknown op" }), { status: 400, headers: cors });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: cors });
  }
});
