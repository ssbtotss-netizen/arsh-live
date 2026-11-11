// أدوات OAuth لـ Streamlabs (حالة موقّعة لمنع CSRF)
import { createHmac, randomBytes } from "crypto";
export const slOAuthReady = () => !!(process.env.STREAMLABS_CLIENT_ID && process.env.STREAMLABS_CLIENT_SECRET);
export function slState(userId: string) { const n = randomBytes(9).toString("base64url"), t = Date.now().toString(36); const sig = createHmac("sha256", process.env.APP_SECRET || "dev").update(`sl:${userId}:${n}:${t}`).digest("base64url").slice(0, 22); return `${n}.${t}.${sig}`; }
export function slStateOk(userId: string, st: string) { const [n, t, sig] = String(st || "").split("."); if (!n || !t || !sig) return false; if (Date.now() - parseInt(t, 36) > 15 * 60e3) return false; return createHmac("sha256", process.env.APP_SECRET || "dev").update(`sl:${userId}:${n}:${t}`).digest("base64url").slice(0, 22) === sig; }
