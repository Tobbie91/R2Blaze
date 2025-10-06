import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  // Read raw body to compute HMAC correctly
  const raw = await new Promise<string>((resolve, reject) => {
    let data = ""; req.setEncoding("utf8");
    req.on("data", (c) => (data += c));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });

  const secret = process.env.PAYSTACK_SECRET_KEY!;
  const theirSig = req.headers["x-paystack-signature"] as string | undefined;
  const ourSig = crypto.createHmac("sha512", secret).update(raw).digest("hex");
  if (!theirSig || theirSig !== ourSig) return res.status(401).send("Invalid signature");

  const payload = JSON.parse(raw);
  // TODO: update order in DB if event === "charge.success"
  res.status(200).json({ received: true });
}
