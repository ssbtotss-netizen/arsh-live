// إدارة الشات الموحد: إجراءات المشاهدين (محلية داخل B6O6 + أصلية على المنصة حسب الصلاحيات الفعلية) · التثبيت · الإشراف التلقائي
// قاعدة أساسية: المشاهد يُعرَّف بالمنصة + المعرّف معاً (اسم متطابق على منصتين = شخصان مختلفان).
// TikTok: لا توجد واجهة رسمية لإدارة الشات ← الإجراءات «محلية فقط» (تختفي من شاتك وOBS، لا من TikTok).

export const MOD_MUTE_PRESETS = [30, 60, 300, 600, 1800, 3600, 86400];
/** ما تدعمه الواجهات الرسمية لكل منصة (المصدر: توثيق YouTube Data API v3 / Twitch Helix / Kick Public API) */
export const MOD_NATIVE = {
  tiktok: { label: "TikTok", note: "لا توجد واجهة رسمية لإدارة شات TikTok — الإجراءات محلية داخل B6O6 فقط", acts: {} },
  youtube: { label: "YouTube", note: "عبر ربط YouTube الرسمي (صلاحية youtube.force-ssl)", acts: { timeout: { max: 86400 }, ban: {}, unban: {}, delete: {}, mod: {}, unmod: {} } },
  twitch: { label: "Twitch", note: "عبر ربط Twitch الرسمي", acts: { timeout: { max: 1209600 }, ban: {}, unban: {} }, needScope: { delete: "moderator:manage:chat_messages", mod: "channel:manage:moderators", unmod: "channel:manage:moderators" } },
  kick: { label: "Kick", note: "عبر ربط Kick الرسمي (صلاحية moderation:ban)", acts: { ban: {}, unban: {} } },
};
export const MOD_ACT_LABEL = { timeout: "كتم مؤقت", ban: "حظر", unban: "فك الحظر", delete: "حذف الرسالة", mod: "تعيين مشرف", unmod: "إزالة المشرف", pin: "تثبيت" };
export const modKey = (platform, uid) => String(platform || "") + ":" + String(uid || "");
const cl = (v, a, b) => Math.max(a, Math.min(b, v));

export function modState(C) { C.mod = C.mod && typeof C.mod === "object" ? C.mod : {}; const M = C.mod;
  M.u = M.u && typeof M.u === "object" ? M.u : {}; M.hid = Array.isArray(M.hid) ? M.hid : []; M.pin = M.pin || null; M.auto = modAutoCfg(M.auto); M.log = Array.isArray(M.log) ? M.log : []; return M; }
/** إعدادات الإشراف التلقائي — الإجراءات على المنصة الأصلية معطّلة افتراضياً */
export function modAutoCfg(a) { a = a && typeof a === "object" ? a : {}; const act = v => ["warn", "hide", "delete", "timeout", "ban"].includes(v) ? v : "hide";
  const list = v => (Array.isArray(v) ? v : String(v || "").split(/[,،\n]/)).map(s => String(s).trim()).filter(Boolean).slice(0, 500);
  return { on: !!a.on, profanity: a.profanity !== false, words: list(a.words), dup: a.dup !== false, dupSec: cl(+a.dupSec || 30, 5, 600), spam: a.spam !== false, links: !!a.links, allowDomains: list(a.allowDomains),
    rate: { on: !!(a.rate && a.rate.on), n: cl(+(a.rate && a.rate.n) || 5, 1, 50), sec: cl(+(a.rate && a.rate.sec) || 10, 2, 300) }, exemptMods: a.exemptMods !== false, allow: list(a.allow), block: list(a.block),
    action: { profanity: act(a.action?.profanity || "hide"), words: act(a.action?.words || "hide"), dup: act(a.action?.dup || "hide"), spam: act(a.action?.spam || "hide"), links: act(a.action?.links || "hide"), rate: act(a.action?.rate || "hide"), block: act(a.action?.block || "hide") },
    timeoutSec: cl(+a.timeoutSec || 300, 10, 86400), native: !!a.native /* تنفيذ تلقائي على المنصة الأصلية — اختياري، معطّل افتراضياً */ }; }

/** هل يُخفى هذا المشاهد/الرسالة محلياً الآن؟ */
export function modHidden(M, m, now) { if (!M || !m) return false; if (m.id && M.hid.includes(m.id)) return true; const u = M.u[modKey(m.platform, m.uid)]; if (!u) return false; return !!(u.ban || (u.mute && u.mute > now)); }
export function modIsMod(M, platform, uid) { const u = M && M.u[modKey(platform, uid)]; return !!(u && u.mod); }

/** تطبيق إجراء محلي (يعيد وصفاً للسجل). الأصلي يُنفَّذ في الخادم عبر الربط الرسمي فقط */
export function modApply(M, a, now) {
  const k = modKey(a.platform, a.uid), u = M.u[k] || (M.u[k] = { name: String(a.name || "").slice(0, 60), platform: a.platform, uid: String(a.uid || "") });
  if (a.name) u.name = String(a.name).slice(0, 60);
  switch (a.act) {
    case "timeout": { const sec = cl(Math.round(+a.sec || 300), 5, 30 * 86400); u.mute = now + sec * 1000; break; }
    case "unmute": u.mute = 0; break;
    case "ban": u.ban = true; break;
    case "unban": u.ban = false; u.mute = 0; break;
    case "mod": u.mod = true; break; case "unmod": u.mod = false; break;
    case "delete": case "hide": if (a.msgId) { if (!M.hid.includes(a.msgId)) M.hid.push(a.msgId); if (M.hid.length > 300) M.hid.splice(0, M.hid.length - 300); } break;
    case "unhide": M.hid = M.hid.filter(x => x !== a.msgId); break;
    default: return null;
  }
  if (!u.mute && !u.ban && !u.mod) delete M.u[k];
  const e = { at: now, act: a.act, platform: a.platform, uid: String(a.uid || ""), name: u.name || a.name || "", sec: a.sec || 0, msgId: a.msgId || "", auto: !!a.auto, reason: String(a.reason || "").slice(0, 80) };
  M.log.unshift(e); if (M.log.length > 100) M.log.length = 100; return e;
}
/** التثبيت داخل B6O6: بطاقة أعلى الشات في اللوحة وOBS والشات العائم (المدة بالثواني، 0 = حتى الإلغاء) */
export function modPin(M, msg, sec, now) { if (!msg || !msg.id) return null; M.pin = { m: { id: msg.id, platform: msg.platform, uid: msg.uid, name: String(msg.name || "").slice(0, 60), av: String(msg.av || msg.avatar || "").slice(0, 400), text: String(msg.text || "").slice(0, 500), kind: msg.kind || "msg" }, at: now, until: sec > 0 ? now + sec * 1000 : 0 }; return M.pin; }
export function modPinActive(M, now) { return M && M.pin && (!M.pin.until || M.pin.until > now) ? M.pin : null; }

/* ===== الإشراف التلقائي ===== */
// قائمة أساسية للألفاظ المسيئة (عربي/إنجليزي) — تُطبَّق بعد توحيد الحروف؛ صانع المحتوى يضيف كلماته
const MOD_BAD = ["كلب", "حمار", "حقير", "زق", "خرا", "منيوك", "شرموط", "قحب", "كس ", "زب ", "طيز", "يلعن", "لعنة الله", "ابن الكلب", "تفو", "وسخ", "متخلف", "حيوان", "fuck", "shit", "bitch", "dick", "pussy", "asshole", "nigger", "faggot", "slut", "whore", "cunt", "bastard", "retard"];
export function modNorm(s) { return " " + String(s || "").toLowerCase().replace(/[ً-ٰٟـ]/g, "").replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/(.)\1{2,}/g, "$1$1").replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ") + " "; }
const MOD_BADN = MOD_BAD.map(w => modNorm(w).trimEnd().replace(/^ /, w.endsWith(" ") ? " " : "")).map(w => w.endsWith(" ") ? w : w.trim());
const MOD_LINK = /(https?:\/\/|www\.)\S+|\b[a-z0-9-]{2,}\.(com|net|org|io|gg|tv|me|ly|link|xyz|sa|app|live)\b/i;
export function modAutoState() { return { seen: new Map(), rate: new Map() } }
/** فحص رسالة: يعيد {rule, action, reason} أو null. لا يمس المشرفين (إن اختير) ولا قائمة المسموح */
export function modCheck(A, S, M, m, now) {
  if (!A || !A.on || !m || m.kind !== "msg") return null; const name = String(m.name || "").toLowerCase(), uid = String(m.uid || "");
  const inList = L => L.some(x => { x = String(x).toLowerCase().replace(/^@/, ""); return x === name || x === uid || x === modKey(m.platform, uid).toLowerCase(); });
  if (inList(A.allow)) return null; if (A.exemptMods && modIsMod(M, m.platform, m.uid)) return null;
  if (inList(A.block)) return { rule: "block", action: A.action.block, reason: "مستخدم في قائمة المحظورين" };
  const t = String(m.text || ""), n = modNorm(t);
  if (A.profanity && MOD_BADN.some(w => w && n.includes(w.length < 4 ? " " + w + " " : w))) return { rule: "profanity", action: A.action.profanity, reason: "ألفاظ مسيئة" };
  if (A.words.length && A.words.some(w => { const x = modNorm(w).trim(); return x && n.includes(x); })) return { rule: "words", action: A.action.words, reason: "كلمة ممنوعة" };
  if (A.links && MOD_LINK.test(t)) { const doms = A.allowDomains.map(d => d.toLowerCase()); if (!doms.length || !doms.some(d => t.toLowerCase().includes(d))) return { rule: "links", action: A.action.links, reason: "رابط غير مصرح" }; }
  if (A.spam && (t.length > 30 && /(.)\1{9,}/u.test(t) || (t.match(/\p{Extended_Pictographic}/gu) || []).length > 15 || t.length > 40 && t.replace(/[^A-Z]/g, "").length / t.replace(/[^A-Za-z]/g, "").length > .8)) return { rule: "spam", action: A.action.spam, reason: "سبام" };
  if (A.dup) { const k = modKey(m.platform, uid) + "|" + n.trim(); const p = S.seen.get(k); S.seen.set(k, now); if (S.seen.size > 3000) S.seen.delete(S.seen.keys().next().value); if (p && now - p < A.dupSec * 1000) return { rule: "dup", action: A.action.dup, reason: "رسالة مكررة" }; }
  if (A.rate.on) { const k = modKey(m.platform, uid), L = (S.rate.get(k) || []).filter(x => now - x < A.rate.sec * 1000); L.push(now); S.rate.set(k, L); if (S.rate.size > 3000) S.rate.delete(S.rate.keys().next().value); if (L.length > A.rate.n) return { rule: "rate", action: A.action.rate, reason: `أكثر من ${A.rate.n} رسائل خلال ${A.rate.sec} ث` }; }
  return null;
}
/** قدرات كل منصة الآن: ربط رسمي مفعّل + صلاحيات ← إجراءات أصلية؛ غير ذلك محلي فقط */
export function modCaps(conn) { const out = {}; for (const [p, d] of Object.entries(MOD_NATIVE)) { const c = conn && conn[p]; const live = !!(c && c.connected); out[p] = { native: live ? Object.keys(d.acts) : [], note: live ? d.note : p === "tiktok" ? d.note : `${d.label}: الربط الرسمي غير مفعّل — الإجراءات محلية داخل B6O6 فقط حتى يُربط الحساب`, max: d.acts.timeout ? d.acts.timeout.max : 0 }; } return out; }
