import { createHmac, timingSafeEqual } from "crypto";
/** تحقق توقيع Stripe-Signature (HMAC-SHA256 على "t.body") مع مهلة 5 دقائق */
export function verifyStripe(raw: string, header: string | null, secret: string, now = Date.now()) {
  if (!header) return false; const parts = Object.fromEntries(header.split(",").map(x => x.split("=") as [string, string]));
  const t = +parts.t; if (!t || Math.abs(now / 1000 - t) > 300) return false;
  const exp = createHmac("sha256", secret).update(`${t}.${raw}`).digest("hex");
  return header.split(",").filter(x => x.startsWith("v1=")).some(x => { const v = Buffer.from(x.slice(3), "hex"), e = Buffer.from(exp, "hex"); return v.length === e.length && timingSafeEqual(v, e); });
}

