import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).send("Method Not Allowed");
  const reference = String(req.query.reference || "");
  if (!reference) return res.status(400).json({ error: "reference is required" });

  const r = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
  });
  const data = await r.json();
  const status = data?.data?.status;
  const ok = status === "success";
  res.status(200).json({ ok, data: data?.data });
}
