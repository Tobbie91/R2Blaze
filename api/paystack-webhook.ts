// /api/paystack-webhook.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";

export const config = {
  api: { bodyParser: false }, // important if this runs under Next.js; raw body needed
};

async function readRawBody(req: VercelRequest): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.setEncoding("utf8");
    req.on("data", (c) => (data += c));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  let raw: string;
  try {
    raw = await readRawBody(req);
  } catch {
    // Don't leak details; still 200 to avoid infinite retries
    console.error("Webhook: failed to read body");
    return res.status(200).json({ ok: true });
  }

  // Verify signature
  const secret = process.env.PAYSTACK_SECRET_KEY || "";
  const theirSig = req.headers["x-paystack-signature"] as string | undefined;
  const ourSig = crypto.createHmac("sha512", secret).update(raw).digest("hex");
  if (!theirSig || theirSig !== ourSig) {
    // 401 is fine; Paystack will retry. If you prefer no retries, log and return 200.
    return res.status(401).send("Invalid signature");
  }

  // Parse payload
  let evt: any;
  try {
    evt = JSON.parse(raw);
  } catch {
    console.error("Webhook: invalid JSON");
    return res.status(200).json({ ok: true });
  }

  try {
    // Only handle successful charge events
    if (evt?.event === "charge.success" && evt?.data?.status === "success") {
      const data = evt.data;
      const reference: string = data.reference;
      const amountKobo: number = data.amount; // Paystack sends amounts in kobo
      const currency: string = (data.currency || "").toUpperCase(); // "NGN"
      const metadata = data.metadata || {};
      const orderId: string | undefined = metadata.orderId;

      // 1) Idempotency: skip if we've processed this reference before
      // const already = await db.payments.findOne({ reference });
      // if (already?.processed) return res.status(200).json({ ok: true });

      // 2) (Optional) Validate expected amount/currency against your order
      // const order = await db.orders.findOne({ id: orderId });
      // if (!order) throw new Error("Order not found");
      // if (currency !== "NGN") throw new Error("Unexpected currency");
      // if (amountKobo !== Math.round(order.totalNaira * 100)) throw new Error("Amount mismatch");

      // 3) Mark order as paid + persist payment record atomically
      // await db.tx(async (trx) => {
      //   await trx.orders.update({ id: orderId }, { status: "paid", paidAt: new Date(), reference });
      //   await trx.payments.insert({ reference, amountKobo, currency, orderId, raw: evt, processed: true });
      // });

      // 4) (Optional) trigger email/receipt/fulfillment
    }

    // Always ack fast so Paystack doesn't keep retrying
    return res.status(200).json({ ok: true });
  } catch (e) {
    // Log & still return 200 to stop retries; reconcile later
    console.error("Webhook processing error:", e);
    return res.status(200).json({ ok: true });
  }
}
