import type { VercelRequest, VercelResponse } from "@vercel/node";

const list = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

export function applyCORS(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin as string | undefined;
  if (origin && (list.includes("*") || list.includes(origin))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Max-Age", "86400");
  }
}

export function handlePreflight(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    applyCORS(req, res);
    res.status(200).end();
    return true;
  }
  return false;
}
