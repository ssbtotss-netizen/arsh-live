// مكتبة الأصوات — المحرك المشترك (الخادم يقرر، رابط OBS يشغّل)
// القرار في الخادم فقط: حدث حقيقي واحد ← قاعدة/مستوى واحد ← صوت واحد. نفس الحدث لا يشغّل الصوت مرتين (معرّف الحدث).
// الدونيشن المالي منفصل تماماً عن هدايا TikTok (كوينز). مراحل التكبيس مرتبطة بجلسة البث الحالية فقط.
import { alConvert, AL_LOVE_NAMES } from "./alerts.js";

const sndLc = s => String(s || "").toLowerCase();
const sndNum = (v, d = 0) => (Number.isFinite(+v) ? +v : d);
const sndClamp = (v, a, b) => Math.max(a, Math.min(b, v));
const sndStr = (v, n) => String(v == null ? "" : v).slice(0, n);

/** أحداث البث التي يمكن ربط صوت بها (الترتيب = ترتيب العرض في «متى تريد تشغيل هذا الصوت؟») */
export const SND_EVENTS = {
  follow: { label: "متابعة جديدة", icon: "➕", hint: "تشغيل عند وصول فولو", prio: 20, low: true },
  love: { label: "هدية أحبني", icon: "❤️", hint: "تشغيل عند وصول «أحبني» (Heart Me) فقط", prio: 60 },
  gift: { label: "هدية محددة", icon: "🎁", hint: "اختر الهدية من TikTok — أو «أي هدية أخرى»", prio: 50 },
  donation: { label: "دونيشن", icon: "💵", hint: "حدد مبلغ الدعم (من هذا المبلغ فأكثر)", prio: 90 },
  sub: { label: "اشتراك جديد", icon: "⭐", hint: "تشغيل عند الاشتراك / العضوية", prio: 55 },
  share: { label: "مشاركة البث", icon: "🔗", hint: "تشغيل عند المشاركة", prio: 15, low: true },
  join: { label: "دخول مشاهد", icon: "👋", hint: "تشغيل عند دخول مشاهد", prio: 5, low: true },
  taps: { label: "التكبيس", icon: "👆", hint: "حدد عدد التكبيسات (مرة واحدة لكل بث)", prio: 45 },
  goal: { label: "تحقيق هدف", icon: "🎯", hint: "تشغيل عند اكتمال هدف الإعجابات أو هدف السبثون", prio: 70 },
  subathon: { label: "السابثون", icon: "⏱️", hint: "تشغيل عند زيادة أو نقص الوقت", prio: 30 },
  manual: { label: "تشغيل يدوي", icon: "🎛️", hint: "يُضاف للوحة التشغيل السريع — تشغّله متى أردت", prio: 80 },
};
export const SND_MODES = { fixed: "صوت ثابت (الأول)", random: "عشوائي", seq: "بالترتيب", norepeat: "عشوائي بدون تكرار متتالٍ" };
export const SND_DON_PRESETS = [5, 20, 50, 100, 200, 500];
export const SND_TAP_PRESETS = [1000, 2000, 5000, 10000, 50000];
export const SND_LIMITS = { rules: 200, sounds: 12, board: 48, fav: 600, user: 300 };

/** مرجع صوت مع إعداداته: lib:<id> مكتبة المنصة · up:<assetId> صوت رفعه صانع المحتوى · al:<alertId> صوت مجتمع معتمد */
export function sndRef(x) {
  x = x && typeof x === "object" ? x : { src: x };
  const src = /^(lib:[a-z0-9-]{2,40}|up:[a-z0-9]{8,40}|al:[a-z0-9]{8,40})$/i.test(String(x.src || "")) ? String(x.src) : "";
  const start = sndClamp(sndNum(x.start), 0, 600), end = sndClamp(sndNum(x.end), 0, 600);
  return { src, vol: sndClamp(Math.round(sndNum(x.vol, 100)), 0, 100), start, end: end > start ? end : 0, times: sndClamp(Math.round(sndNum(x.times, 1)), 1, 20), gap: sndClamp(sndNum(x.gap), 0, 30),
    fin: sndClamp(sndNum(x.fin), 0, 10), fout: sndClamp(sndNum(x.fout), 0, 10), rate: sndClamp(sndNum(x.rate, 1), .5, 2) };
}
export function sndRule(r) {
  r = r && typeof r === "object" ? r : {}; const ev = SND_EVENTS[r.ev] ? r.ev : ""; const c = r.cond && typeof r.cond === "object" ? r.cond : {};
  const cond = {};
  if (ev === "gift") { cond.any = !!c.any; cond.giftId = c.giftId == null || c.giftId === "" ? "" : sndStr(c.giftId, 20); cond.name = sndStr(c.name, 60).trim(); cond.image = /^https:\/\//.test(c.image || "") ? sndStr(c.image, 400) : ""; }
  if (ev === "donation") { cond.min = Math.max(0, sndNum(c.min)); cond.cur = /^[A-Z]{3}$/.test(c.cur || "") ? c.cur : "USD"; }
  if (ev === "taps") cond.n = Math.max(1, Math.round(sndNum(c.n, 1000)));
  if (ev === "subathon") cond.dir = ["add", "sub", "any"].includes(c.dir) ? c.dir : "add";
  if (ev === "goal") cond.kind = ["any", "likes", "subathon"].includes(c.kind) ? c.kind : "any";
  const sounds = (Array.isArray(r.sounds) ? r.sounds : []).map(sndRef).filter(s => s.src).slice(0, SND_LIMITS.sounds);
  return { id: /^[a-z0-9_-]{2,40}$/i.test(r.id || "") ? r.id : "r" + Math.random().toString(36).slice(2, 9), ev, on: r.on !== false, cond, sounds,
    mode: SND_MODES[r.mode] ? r.mode : "random", cool: sndClamp(sndNum(r.cool, SND_EVENTS[ev]?.low ? 2 : 0), 0, 600), platform: ["", "tiktok", "youtube", "kick", "twitch"].includes(r.platform) ? r.platform : "" };
}
export function sndBoardItem(b) {
  b = b && typeof b === "object" ? b : {}; const s = sndRef(b.s || b);
  return { id: /^[a-z0-9_-]{2,40}$/i.test(b.id || "") ? b.id : "b" + Math.random().toString(36).slice(2, 9), s, label: sndStr(b.label, 30).trim(), icon: sndStr(b.icon, 8),
    color: /^#[0-9a-f]{6}$/i.test(b.color || "") ? b.color : "", key: /^[a-z0-9]$/i.test(b.key || "") ? sndLc(b.key) : "" };
}
export function sndUserItem(u) {
  u = u && typeof u === "object" ? u : {};
  return { id: /^[a-z0-9]{8,40}$/i.test(u.id || "") ? u.id : "", name: sndStr(u.name, 60).trim() || "صوت خاص", cat: sndStr(u.cat, 20) || "mine", dur: sndClamp(sndNum(u.dur), 0, 900),
    peaks: Array.isArray(u.peaks) ? u.peaks.slice(0, 48).map(v => sndClamp(Math.round(sndNum(v) * 100) / 100, 0, 1)) : [], start: sndClamp(sndNum(u.start), 0, 600), end: sndClamp(sndNum(u.end), 0, 600), vol: sndClamp(Math.round(sndNum(u.vol, 100)), 0, 100),
    shared: ["", "pending", "approved", "rejected"].includes(u.shared) ? u.shared : "", alertId: /^[a-z0-9]{8,40}$/i.test(u.alertId || "") ? u.alertId : "" };
}
/** إعدادات المكتبة كاملة (تُحفظ مع إعدادات صانع المحتوى في الخادم — تبقى بعد تسجيل الخروج) */
export function sndCfg(c) {
  c = c && typeof c === "object" ? c : {};
  return { v: 1, on: c.on !== false, vol: sndClamp(Math.round(sndNum(c.vol, 80)), 0, 100),
    rules: (Array.isArray(c.rules) ? c.rules : []).map(sndRule).filter(r => r.ev && r.ev !== "manual").slice(0, SND_LIMITS.rules),
    board: (Array.isArray(c.board) ? c.board : []).map(sndBoardItem).filter(b => b.s.src).slice(0, SND_LIMITS.board),
    fav: [...new Set((Array.isArray(c.fav) ? c.fav : []).map(x => sndStr(x, 50)).filter(x => /^(lib|up|al):/.test(x)))].slice(0, SND_LIMITS.fav),
    user: (Array.isArray(c.user) ? c.user : []).map(sndUserItem).filter(u => u.id).slice(0, SND_LIMITS.user),
    explore: c.explore === "all" ? "all" : "merge", maxQ: sndClamp(Math.round(sndNum(c.maxQ, 12)), 3, 50) };
}
export function sndNewState() { return { ids: {}, nIds: 0, last: {}, seq: {}, lastPick: {}, taps: {}, goals: {}, sup: {}, tl: 0 } }
/** بداية بث جديد: مراحل التكبيس والأهداف تبدأ من جديد (لا تعاد أصوات مراحل البث السابق) */
export function sndSessionReset(st) { st.taps = {}; st.goals = {}; st.tl = 0; st.last = {}; st.sup = {}; }

function sndPick(rule, st) {
  const L = rule.sounds; if (!L.length) return null; if (L.length === 1 || rule.mode === "fixed") return L[0];
  if (rule.mode === "seq") { const i = (st.seq[rule.id] || 0) % L.length; st.seq[rule.id] = i + 1; return L[i]; }
  let i = Math.floor(Math.random() * L.length);
  if (rule.mode === "norepeat" && L.length > 1 && i === st.lastPick[rule.id]) i = (i + 1 + Math.floor(Math.random() * (L.length - 1))) % L.length;
  st.lastPick[rule.id] = i; return L[i];
}
const sndIsLove = ev => ev && ev.type === "gift" && (AL_LOVE_NAMES.includes(sndLc(ev.gift).trim()) || String(ev.giftId) === "7934");
const sndEvKind = t => ({ follow: "follow", share: "share", join: "join", subscribe: "sub", member: "sub", resub: "sub", subgift: "sub", member_gift: "sub" })[t] || "";

/** الخادم: حدث ← عناصر تشغيل. ctx: {totalLikes, goals:[{id,target,value}], explore} */
export function sndOnEvent(cfg, st, ev, now, ctx = {}) {
  if (!cfg || !cfg.on || !ev || ev.refunded) return [];
  if (ev.id) { if (st.ids[ev.id]) return []; st.ids[ev.id] = 1; if (++st.nIds > 6000) { const ks = Object.keys(st.ids); for (const k of ks.slice(0, 2000)) delete st.ids[k]; st.nIds = ks.length - 2000; } } // نفس الحدث مرتين ← صوت واحد
  const R = cfg.rules.filter(r => r.on && r.sounds.length && (!r.platform || !ev.platform || r.platform === ev.platform));
  const out = [], hit = (rule, extra = {}) => { const it = sndEmit(cfg, st, rule, ev, now, ctx, extra); if (it) out.push(it); };
  if (ev.type === "gift") {
    if (sndIsLove(ev)) { const r = R.find(x => x.ev === "love"); if (r) hit(r); else giftRule(); } else giftRule();
    function giftRule() { const n = sndLc(ev.gift).trim(), id = ev.giftId == null ? "" : String(ev.giftId), G = R.filter(x => x.ev === "gift");
      const ex = G.find(x => !x.cond.any && (x.cond.giftId && x.cond.giftId === id || !x.cond.giftId && x.cond.name && sndLc(x.cond.name) === n)) || G.find(x => x.cond.any); if (ex) hit(ex, { value: +ev.value || 0 }); }
  } else if ((ev.type === "donation" && (ev.verified || ev.test)) || ev.type === "superchat") {
    // مستوى واحد فقط: أعلى حد يصل له المبلغ (بعملة القاعدة بعد التحويل بسعر موثوق — لا تخمين)
    let best = null, bestMin = -1; const cur = String(ev.currency || "USD").toUpperCase();
    for (const r of R.filter(x => x.ev === "donation")) { const amt = cur === r.cond.cur ? +ev.amount : alConvert(ev.amount, cur, r.cond.cur, ctx.rates); if (amt == null || !(amt >= r.cond.min)) continue; const mn = r.cond.min; if (mn > bestMin) { best = r; bestMin = mn; } }
    if (best) hit(best, { amount: +ev.amount, currency: cur });
  } else if (ev.type === "like") {
    const n = Math.max(0, +ev.count || 0); if (!n) return out; const total = ctx.totalLikes > 0 ? +ctx.totalLikes : st.tl + n, prev = Math.max(0, total - n); st.tl = total;
    for (const r of R.filter(x => x.ev === "taps").sort((a, b) => a.cond.n - b.cond.n)) if (prev < r.cond.n && total >= r.cond.n && !st.taps[r.id]) { st.taps[r.id] = 1; hit(r, { taps: r.cond.n }); }
  } else { const k = sndEvKind(ev.type); if (k) { const r = R.find(x => x.ev === k); if (r) hit(r); } }
  // الأهداف (هدف الإعجابات في طبقاتك) — مرة واحدة لكل هدف في كل بث
  for (const g of ctx.goals || []) if (g.value >= g.target && g.target > 0 && !st.goals[g.id]) { st.goals[g.id] = 1; const r = R.find(x => x.ev === "goal" && (x.cond.kind === "any" || x.cond.kind === g.kind)); if (r) hit(r, { goal: g.id }); }
  return out;
}
/** سجلات السبثون (زيادة/نقص الوقت) وأهداف السبثون */
export function sndOnLogs(cfg, st, logs, now) {
  if (!cfg || !cfg.on || !logs || !logs.length) return []; const out = [], R = cfg.rules.filter(r => r.on && r.sounds.length);
  for (const l of logs) {
    const id = "log" + (l.subathonId || "") + ":" + (l.seq || now); if (st.ids[id]) continue; st.ids[id] = 1;
    const d = +l.deltaMs || 0; if (d) { const r = R.find(x => x.ev === "subathon" && (x.cond.dir === "any" || (x.cond.dir === "add") === d > 0)); if (r) { const it = sndEmit(cfg, st, r, { id, type: "subathon", test: !!l.test }, now, {}, { deltaMs: d }); if (it) out.push(it); } }
    if (l.kind === "goal" || l.goal || /^تحقيق الهدف/.test(String(l.reason || ""))) { const gid = "sub:" + (l.subathonId || ""); if (!st.goals[gid]) { st.goals[gid] = 1; const r = R.find(x => x.ev === "goal" && (x.cond.kind === "any" || x.cond.kind === "subathon")); if (r) { const it = sndEmit(cfg, st, r, { id: id + ":g", type: "goal" }, now, {}, {}); if (it) out.push(it); } } }
  }
  return out;
}
function sndEmit(cfg, st, rule, ev, now, ctx, extra) {
  const meta = SND_EVENTS[rule.ev] || {}; const key = rule.id;
  // مدة الانتظار بين أصوات نفس القاعدة (مثل الفولو) + تجميع عند الضغط العالي (وضع الإكسبلور): الأحداث كلها محتسبة، الصوت فقط يُختصر
  const cool = Math.max(rule.cool, ctx.explore && meta.low && cfg.explore !== "all" ? 3 : 0) * 1000;
  if (cool && now - (st.last[key] || 0) < cool) { st.sup[key] = (st.sup[key] || 0) + 1; return null; }
  const s = sndPick(rule, st); if (!s) return null; st.last[key] = now; const merged = st.sup[key] || 0; st.sup[key] = 0;
  const prio = meta.prio + (rule.ev === "donation" ? Math.min(9, Math.floor(Math.log10(1 + (+extra.amount || 0)) * 3)) : rule.ev === "gift" ? Math.min(9, Math.floor(Math.log10(1 + (+extra.value || 0)) * 2)) : 0);
  return { id: String(ev.id || "e" + now) + ":" + rule.id, rule: rule.id, ev: rule.ev, s, prio, at: now, merged, test: !!ev.test, low: !!meta.low };
}
/** تشغيل يدوي من لوحة التشغيل السريع أو «تشغيل الآن» */
export function sndManual(cfg, ref, now, opt = {}) { const s = sndRef(ref); if (!s.src) return null; return { id: "m" + now.toString(36) + Math.random().toString(36).slice(2, 6), rule: "", ev: "manual", s, prio: 85, at: now, merged: 0, manual: true, test: !!opt.test }; }
/** كل مراجع الأصوات المستخدمة (لروابط الملفات الموقّعة في رابط OBS + قسم «الأصوات المستخدمة») */
export function sndUsedRefs(cfg) { const set = new Set(); for (const r of cfg.rules) for (const s of r.sounds) set.add(s.src); for (const b of cfg.board) set.add(b.s.src); return [...set]; }

/* ================= رابط OBS: طابور الصوت (بدون واجهة مرئية) ================= */
/** طابور بأولويات: الدعم القوي أولاً، الأصوات الخفيفة (فولو/دخول) تُختصر عند الامتلاء — العدّ لا يتأثر (العرض الصوتي فقط) */
export function sndQueue() { return { q: [], seen: {}, nSeen: 0, played: 0, dropped: 0 } }
export function sndQueuePush(Q, it, max = 12) {
  if (!it || !it.id || Q.seen[it.id]) return false; Q.seen[it.id] = 1; if (++Q.nSeen > 3000) { Q.seen = { [it.id]: 1 }; Q.nSeen = 1; }
  let i = Q.q.length; while (i > 0 && Q.q[i - 1].prio < it.prio) i--; Q.q.splice(i, 0, it);
  while (Q.q.length > max) { // يُحذف الأقل أهمية (الأقدم بين المتساوين) — لا يُحذف صوت دعم لصالح فولو
    let k = Q.q.length - 1; for (let j = Q.q.length - 1; j >= 0; j--) if (Q.q[j].prio < Q.q[k].prio) k = j; Q.q.splice(k, 1); Q.dropped++; }
  return true;
}
export function sndQueueNext(Q) { const it = Q.q.shift(); if (it) Q.played++; return it || null; }
export const SND_LIB_BASE = "/sounds/lib/";
export function sndUrl(src, urls, base = SND_LIB_BASE) { src = String(src || ""); if (src.startsWith("lib:")) return base + src.slice(4) + ".mp3"; return (urls && urls[src]) || ""; }
