// روابط ملفات الآيرتات الموقّعة لرابط OBS: الملف الخاص لا يُفتح إلا بتوقيع مرتبط برمز رابط صاحب الحساب ومدة صلاحية
import { createHmac, timingSafeEqual } from "crypto";

const secret = () => process.env.APP_SECRET || process.env.DATABASE_URL || "dev-only-secret";
export function mediaSig(assetId: string, tok: string, exp: number, key = secret()) {
  return createHmac("sha256", key).update(`alert-media:${assetId}:${tok}:${exp}`).digest("base64url").slice(0, 32);
}
/** رابط صالح لـ 12 ساعة افتراضياً (يُجدَّد تلقائياً عند إعادة تحميل رابط OBS) */
export function signedMediaUrl(assetId: string, tok: string, ttlMs = 12 * 3600e3, now = Date.now(), key = secret()) {
  const exp = Math.floor((now + ttlMs) / 1000);
  return `/api/alerts/media/${assetId}?t=${encodeURIComponent(tok)}&e=${exp}&s=${mediaSig(assetId, tok, exp, key)}`;
}
export function verifyMediaSig(assetId: string, tok: string, exp: number, sig: string, now = Date.now(), key = secret()) {
  if (!tok || !sig || !Number.isFinite(exp) || exp * 1000 < now) return false;
  const a = Buffer.from(mediaSig(assetId, tok, exp, key)), b = Buffer.from(String(sig));
  return a.length === b.length && timingSafeEqual(a, b);
}
