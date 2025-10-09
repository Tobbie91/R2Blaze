import type { VercelRequest, VercelResponse } from "@vercel/node";

const BASE = "https://api.paystack.co";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ---- TEMP: ultra-permissive CORS for preview/local dev ----
  res.setHeader("Access-Control-Allow-Origin", "*");              
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", "86400");
  if (req.method === "OPTIONS") { res.status(200).end(); return; }   
  // ------------------------------------------------------------

  if (req.method !== "POST") { res.status(405).send("Method Not Allowed"); return; }

  try {
    const { email, amountNaira, reference, items, metadata } = (req.body || {}) as any;
    if (!email || !amountNaira || !reference) {
      res.status(400).json({ error: "email, amountNaira, reference required" });
      return;
    }

    const amount_kobo = Math.round(Number(amountNaira) * 100);
    if (!Number.isFinite(amount_kobo) || amount_kobo < 100) {
      res.status(400).json({ error: "Invalid amount" });
      return;
    }

    const r = await fetch(`${BASE}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amount_kobo,
        reference,
        currency: "NGN",
        metadata: metadata || { items },
        callback_url: `${process.env.APP_BASE_URL}/checkout/success?ref=${encodeURIComponent(reference)}`,
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      res.status(r.status).json({ error: data?.message || "Init failed" });
      return;
    }

    res.status(200).json({
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code,
      reference: data.data.reference,
    });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "Server error" });
  }
}
