// تشفير المفاتيح السرية لمزودي التبرعات (AES-256-GCM) — المفتاح من APP_SECRET
import { createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual } from "crypto";
const key = () => {
  const s = process.env.APP_SECRET;
  if (!s || s.length < 32) throw new Error("APP_SECRET مفقود أو قصير (32 حرفاً على الأقل)");
  return createHash("sha256").update(s).digest();
};
export function encrypt(obj: unknown) {
  const iv = randomBytes(12), c = createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([c.update(JSON.stringify(obj), "utf8"), c.final()]);
  return [iv, c.getAuthTag(), data].map(b => b.toString("base64")).join(".");
}
export function decrypt<T = any>(s: string): T | null {
  if (!s) return null;
  try {
    const [iv, tag, data] = s.split(".").map(x => Buffer.from(x, "base64"));
    const d = createDecipheriv("aes-256-gcm", key(), iv); d.setAuthTag(tag);
    return JSON.parse(Buffer.concat([d.update(data), d.final()]).toString("utf8"));
  } catch { return null; }
}
export const mask = (v?: string) => (v ? v.slice(0, 4) + "••••" + v.slice(-4) : "");
export function safeEqual(a: string, b: string) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
}
