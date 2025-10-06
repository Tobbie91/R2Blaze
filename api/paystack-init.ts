import type { VercelRequest, VercelResponse } from "@vercel/node";

const BASE = "https://api.paystack.co";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
  try {
    const { email, amountNaira, reference, items, metadata } = req.body || {};
    if (!email || !amountNaira || !reference) {
      return res.status(400).json({ error: "email, amountNaira, reference required" });
    }
    const amount_kobo = Math.round(Number(amountNaira) * 100);
    if (!Number.isFinite(amount_kobo) || amount_kobo < 100) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // (Optional) write pending order to Supabase here if you already wired the client.
    // If you saw "no export found", comment out DB writes temporarily to isolate.

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
    if (!r.ok) return res.status(r.status).json({ error: data?.message || "Init failed" });

    res.status(200).json({
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code,
      reference: data.data.reference,
    });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || "Server error" });
  }
}
