// ربط TikTok: تصنيف الأخطاء، احترام Retry-After، انتظار تصاعدي محدود، حصة مشتركة، المفتاح المفقود، منع التكرار، الإلغاء أثناء الانتظار، والأحداث بدون تكرار
// يعمل عبر createHub الحقيقي (نفس مسار الخادم) مع مكتبة TikTok وهمية (globalThis.__tkTestMod) — بدون شبكة.
import { createHub } from "../arsh-live/src/server/live-hub.ts";
import { classifyTikTokError, tkDelay, TK_BACKOFF, signQuota, startTikTok } from "../arsh-live/src/server/tiktok.ts";
import { EventEmitter } from "node:events";
let pass = 0, fail = 0; const ok = (c: any, m: string) => { c ? pass++ : (fail++, console.log("FAIL", m)); };
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
const SECRET = "EULER_SECRET_VALUE_123";

// ---- مكتبة وهمية: كل اتصال يأخذ «سيناريو» من الطابور ----
const plan: any[] = []; const made: any[] = [];
class SignatureRateLimitError extends Error { retryAfter?: number; resetTime?: number; constructor(m: string, ra?: number) { super(m); this.name = "SignatureRateLimitError"; if (ra != null) this.retryAfter = ra; } }
class FakeConn extends EventEmitter { opts: any; user: string; constructor(u: string, o: any) { super(); this.user = u; this.opts = o; made.push(this); }
  async connect() { const p = plan.shift() ?? { ok: true }; await sleep(p.delay ?? 5); if (p.err) throw p.err; return { roomId: "R1" }; }
  disconnect() {} async fetchRoomInfo() { return { owner: { follow_info: { follower_count: 1234 } } }; } }
(globalThis as any).__tkTestMod = { TikTokLiveConnection: FakeConn, WebcastEvent: { LIKE: "like", GIFT: "gift", CHAT: "chat", FOLLOW: "follow", SHARE: "share", MEMBER: "member", SUBSCRIBE: "subscribe", STREAM_END: "streamEnd", DISCONNECTED: "disconnected" } };

// ---- 1) تصنيف الأخطاء (نص المزود الحقيقي من الإنتاج) ----
const prodMsg = "[Rate Limited] (rate_limit_account_day) Too many connections started, try again later. | You have reached the rate limit. Sign up for a free API key at https://www.eulerstream.com/pricing.";
let c = classifyTikTokError(new SignatureRateLimitError(prodMsg));
ok(c.kind === "rate_limit" && c.code === "rate_limit_account_day" && c.retryAfterMs === undefined, "production error → rate_limit / account_day / no Retry-After");
c = classifyTikTokError(new SignatureRateLimitError("[Rate Limited] x", 90_000)); ok(c.retryAfterMs === 90_000, "retryAfter (ms) from library");
c = classifyTikTokError(Object.assign(new Error("Request failed with status code 429"), { response: { status: 429, headers: { "retry-after": "45", "x-request-id": "req-77" } } }));
ok(c.kind === "rate_limit" && c.retryAfterMs === 45_000 && c.requestId === "req-77" && c.status === 429, "HTTP 429 + Retry-After header (seconds) + request id");
c = classifyTikTokError(Object.assign(new Error("x"), { name: "UserOfflineError" })); ok(c.kind === "offline", "offline");
c = classifyTikTokError(Object.assign(new Error("Unauthorized: invalid api key"), { response: { status: 401 } })); ok(c.kind === "sign_auth", "invalid key → sign_auth");
ok(tkDelay("rate_limit", 1, 300_000) === 301_000, "Retry-After wins over backoff"); ok(tkDelay("rate_limit", 1) === 60_000 && tkDelay("rate_limit", 3) === 15 * 60_000 && tkDelay("rate_limit", 4) === -1, "backoff 1m → 5m → 15m then stop");

// ---- محاكي الخادم ----
const wss: any = new EventEmitter();
const hub = createHub(wss, { authorize: async () => true });
const client = () => { const ws: any = new EventEmitter(); ws.readyState = 1; ws.msgs = [] as any[]; ws.send = (s: string) => ws.msgs.push(JSON.parse(s)); ws.close = () => {}; wss.emit("connection", ws); return ws; };
const msg = (ws: any, m: any) => ws.emit("message", Buffer.from(JSON.stringify(m)));
const last = (ws: any, t = "status") => [...ws.msgs].reverse().find((m: any) => m.t === t);
const ROOM = "room_test_1";
const logs: string[] = []; const ol = console.log, oe = console.error; console.log = (...a: any[]) => logs.push(a.join(" ")); console.error = (...a: any[]) => logs.push(a.join(" "));
try {
  process.env.TIKTOK_SIGN_API_KEY = SECRET;
  // ---- 2) نجاح الربط + الأحداث بدون تكرار ----
  const a = client(); msg(a, { t: "join", room: ROOM, key: "k" }); await sleep(20);
  plan.push({ ok: true, delay: 30 });
  msg(a, { t: "tiktok", room: ROOM, username: "cclvr" }); await sleep(5);
  ok(last(a).tk?.state === "connecting" && last(a).live === false, "state: connecting (not «connected» before success)");
  msg(a, { t: "tiktok", room: ROOM, username: "cclvr" }); msg(a, { t: "tiktok", room: ROOM, username: "@cclvr" }); await sleep(5);
  ok(made.length === 1, "repeated clicks → one sign/connect request (" + made.length + ")"); ok(a.msgs.some((m: any) => m.dup), "duplicate acknowledged with current state");
  await sleep(60);
  ok(last(a).tk?.state === "connected" && last(a).live === true, "connected only after connect() succeeded");
  ok(made[0].opts.signApiKey === SECRET, "TIKTOK_SIGN_API_KEY passed to the library as signApiKey");
  // إعادة تحميل الواجهة: عميل جديد يرى الحالة ولا يعيد الاتصال
  const b = client(); msg(b, { t: "join", room: ROOM, key: "k" }); await sleep(20); msg(b, { t: "tiktok", room: ROOM, username: "cclvr" }); await sleep(10);
  ok(last(b).tk?.state === "connected" && made.length === 1, "reload: state restored, no new request");
  const conn = made[0];
  const u = (id: string) => ({ user: { uniqueId: id, nickname: id } });
  conn.emit("like", { ...u("n1"), likeCount: 15, msgId: "L1" }); conn.emit("like", { ...u("n1"), likeCount: 15, msgId: "L1" });
  conn.emit("follow", { ...u("n2"), msgId: "F1" }); conn.emit("follow", { ...u("n2"), msgId: "F1" });
  conn.emit("gift", { ...u("n3"), giftName: "Rose", giftId: 5655, diamondCount: 1, repeatCount: 3, giftType: 1, repeatEnd: false, msgId: "G0" });
  conn.emit("gift", { ...u("n3"), giftName: "Rose", giftId: 5655, diamondCount: 1, repeatCount: 3, giftType: 1, repeatEnd: true, msgId: "G1" });
  conn.emit("gift", { ...u("n3"), giftName: "Rose", giftId: 5655, diamondCount: 1, repeatCount: 3, giftType: 1, repeatEnd: true, msgId: "G1" });
  await sleep(20);
  const evs = a.msgs.filter((m: any) => m.t === "event").map((m: any) => m.ev ?? m.event ?? m);
  const ofType = (t: string) => evs.filter((e: any) => (e.type ?? e.ev?.type) === t);
  ok(ofType("like").length === 1 && ofType("follow").length === 1 && ofType("gift").length === 1, `events reach overlays once each (like ${ofType("like").length}, follow ${ofType("follow").length}, gift ${ofType("gift").length})`);
  ok(evs.length > 0 && evs.length === b.msgs.filter((m: any) => m.t === "event").length, "same events to every open link");

  // ---- 3) 429 مع Retry-After + حصة مشتركة + إلغاء أثناء الانتظار ----
  const ROOM2 = "room_test_2"; const c2 = client(); msg(c2, { t: "join", room: ROOM2, key: "k" }); await sleep(20);
  plan.push({ err: new SignatureRateLimitError("[Rate Limited] (rate_limit_account_minute) Too many", 200_000) });
  msg(c2, { t: "tiktok", room: ROOM2, username: "other_user" }); await sleep(40);
  const s2 = last(c2); ok(s2.tk?.state === "waiting" && Math.abs(s2.tk.retryAt - (Date.now() + 201_000)) < 3000, "429 + Retry-After 200s → waiting with exact retryAt");
  ok(/4 دقيقة|3 دقيقة/.test(s2.text) && !/حاول بعد دقيقة/.test(s2.text), "message uses the provider wait, not «after a minute»: " + s2.text);
  ok(!("admin" in s2.tk) && s2.tk.server === undefined || s2.tk.server === false || s2.tk.server === true, "admin note not sent to overlays/dashboard (flag only)");
  ok(signQuota.until > Date.now() + 190_000, "shared provider cooldown recorded");
  // اتصال آخر على نفس الخادم أثناء الحصة: لا طلب توقيع
  const ROOM3 = "room_test_3"; const c3 = client(); msg(c3, { t: "join", room: ROOM3, key: "k" }); await sleep(20);
  const n0 = made.length; msg(c3, { t: "tiktok", room: ROOM3, username: "third" }); await sleep(30);
  ok(made.length === n0 && last(c3).tk?.state === "waiting" && last(c3).tk.retryAt >= signQuota.until, "other rooms wait for the shared quota (no request sent)");
  msg(c3, { t: "tiktok-stop", room: ROOM3 }); msg(c2, { t: "tiktok-stop", room: ROOM2 }); await sleep(10);
  ok(last(c2).tk?.state === "stopped" && last(c3).tk?.state === "stopped", "manual stop during waiting → stopped");
  signQuota.until = 0;

  // ---- 4) 429 بدون Retry-After: انتظار تصاعدي بعدد محاولات محدود ثم «تعذر الاتصال» ----
  const saved = TK_BACKOFF.rate_limit.slice(); TK_BACKOFF.rate_limit.splice(0, 3, 30, 30, 30);
  const statuses: any[] = []; const pl = () => plan.push({ err: new SignatureRateLimitError(prodMsg) });
  pl(); pl(); pl(); pl();
  const before = made.length;
  const h = startTikTok("dayuser", { onEvent() {}, onStatus: (l, t, i) => statuses.push(i) });
  await sleep(600);
  const waits = statuses.filter(s => s.state === "waiting"), fin = statuses[statuses.length - 1];
  ok(waits.length === 3 && fin.state === "failed", `limited attempts: 3 waits then failed (${waits.length}, ${fin.state})`);
  ok(made.length - before === 4, "exactly 4 sign requests then stops (" + (made.length - before) + ")");
  ok(/الحد اليومي/.test(fin.text) && /أُوقفت المحاولات التلقائية/.test(fin.text), "failed text explains daily limit + stopped retries");
  ok(/TIKTOK_SIGN_API_KEY/.test(fin.admin) && /مضبوط/.test(fin.admin), "admin note (key set → quota exhausted)");
  h.stop(); TK_BACKOFF.rate_limit.splice(0, 3, ...saved); signQuota.until = 0;

  // ---- 5) المفتاح مفقود: رسالة المشرف تحدد اسم المتغير ومكانه ----
  delete process.env.TIKTOK_SIGN_API_KEY;
  const st2: any[] = []; plan.push({ err: new SignatureRateLimitError(prodMsg) });
  const h2 = startTikTok("nokey", { onEvent() {}, onStatus: (l, t, i) => st2.push(i) }); await sleep(40);
  const w2 = st2.find(s => s.state === "waiting");
  ok(w2 && /غير مضبوط/.test(w2.admin) && /Render/.test(w2.admin) && /Environment/.test(w2.admin) && /TIKTOK_SIGN_API_KEY/.test(w2.admin), "missing key → admin told variable name + where (Render → Environment)");
  ok(made[made.length - 1].opts.signApiKey === undefined, "no fake key injected when missing");
  h2.stop(); await sleep(70); ok(made.length === made.length && st2[st2.length - 1].state !== "connecting", "stop cancels the pending retry");
  signQuota.until = 0;

  // ---- 6) مفتاح مرفوض: لا إعادة محاولة ----
  process.env.TIKTOK_SIGN_API_KEY = SECRET; const st3: any[] = []; const n3 = made.length;
  plan.push({ err: Object.assign(new Error("Unauthorized: invalid api key"), { response: { status: 401 } }) });
  const h3 = startTikTok("badkey", { onEvent() {}, onStatus: (l, t, i) => st3.push(i) }); await sleep(80);
  ok(st3[st3.length - 1].state === "failed" && /غير صالح/.test(st3[st3.length - 1].admin) && made.length - n3 === 1, "invalid key → failed once, admin told to update it");
  h3.stop();
} finally { console.log = ol; console.error = oe; }
// ---- 7) لا تسريب للمفتاح ----
const all = logs.join("\n"); ok(!all.includes(SECRET), "key value never appears in server logs");
ok(/kind=rate_limit status=429 code=rate_limit_account_day retryAfterMs=- reqId=- name=SignatureRateLimitError key=(set|missing)/.test(all), "safe log line: status, code, Retry-After, request id, attempt id");
ok(/id=tk[0-9a-z]+/.test(all), "attempt id logged");
console.log(`tiktok-connect: ${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
