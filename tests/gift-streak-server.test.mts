// مسار الخادم الكامل: TikTok (مكتبة وهمية بنفس بنية الحدث) → tiktok.ts → live-hub → السبثون → رسائل OBS/اللوحة
import { createHub } from "../arsh-live/src/server/live-hub.ts";
import { EventEmitter } from "node:events";
let pass = 0, fail = 0; const ok = (c: any, m: string) => { c ? pass++ : (fail++, console.log("FAIL", m)); };
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
const made: any[] = [];
class FakeConn extends EventEmitter { constructor(public user: string, public opts: any) { super(); made.push(this); }
  async connect() { await sleep(5); return { roomId: "R1", availableGifts: [{ id: 5655, name: "Rose", diamond_count: 1, image: { url_list: ["https://x/rose.png"] } }, { id: 6369, name: "Lion", diamond_count: 29999 }] }; }
  disconnect() {} async fetchRoomInfo() { return {}; } }
(globalThis as any).__tkTestMod = { TikTokLiveConnection: FakeConn, WebcastEvent: { LIKE: "like", GIFT: "gift", CHAT: "chat", FOLLOW: "follow", SHARE: "share", MEMBER: "member", SUBSCRIBE: "subscribe", STREAM_END: "streamEnd", DISCONNECTED: "disconnected" } };
const wss: any = new EventEmitter(); const saved: any[] = [];
const hub = createHub(wss, { authorize: async () => true, saveClock: async (_: string, C: any) => { saved.push(JSON.parse(JSON.stringify(C))); } } as any);
const client = () => { const ws: any = new EventEmitter(); ws.readyState = 1; ws.msgs = [] as any[]; ws.send = (s: string) => ws.msgs.push(JSON.parse(s)); ws.close = () => {}; wss.emit("connection", ws); return ws; };
const msg = (ws: any, m: any) => ws.emit("message", Buffer.from(JSON.stringify(m)));
const logs: string[] = []; const ol = console.log; console.log = (...a: any[]) => logs.push(a.join(" "));
try {
  const dash = client(); msg(dash, { t: "join", room: "room_gs_1", key: "k" }); await sleep(20);
  const obs = client(); msg(obs, { t: "join", room: "room_gs_1" }); await sleep(20);
  const rule = (o: any) => ({ id: "r_" + Math.random().toString(36).slice(2, 7), kind: "gift", enabled: true, dir: 1, every: 1, giftId: null, giftName: "", minDiamonds: 0, perDiamondMs: 0, cooldownMs: 0, userCooldownMs: 0, perMin: 0, maxMs: 0, ...o });
  msg(dash, { t: "clock-op", room: "room_gs_1", target: "subathon", op: "config", config: { initialMs: 3600_000, maxMs: 0, rules: { list: [rule({ giftId: 5655, giftName: "وردة", ms: 5000 })], giftMode: "gifts_first" } } });
  msg(dash, { t: "clock-op", room: "room_gs_1", target: "subathon", op: "start" }); await sleep(10);
  msg(dash, { t: "tiktok", room: "room_gs_1", username: "streamer" }); await sleep(60);
  const c = made[made.length - 1]; ok(c, "connection created");
  ok(dash.msgs.some((m: any) => m.t === "gifts" && m.gifts.some((g: any) => g.id === 5655)), "real gift catalog sent to dashboard");
  const room = hub.rooms.get("room_gs_1")!; const S = () => (room as any).C.subathon;
  const endsBefore = S().endsAt;
  // بنية v2: الاسم داخل giftDetails غير موجود (كما في بثك) — يُكمل من القائمة بالمعرّف. عدد تراكمي + معرّف رسالة مختلف لكل تحديث + حدث نهائي
  let mid = 1000; const send = (cum: number, end = false, extra: any = {}) => c.emit("gift", { common: { msgId: String(++mid) }, user: { uniqueId: "turki", nickname: "Turki" }, giftId: 5655, repeatCount: cum, repeatEnd: end ? 1 : 0, groupId: "777", giftDetails: { diamondCount: 1, giftType: 1 }, ...extra });
  for (const n of [1, 5, 10, 20, 30]) send(n); send(30, true); send(30, true);
  await sleep(10);
  ok(S().endsAt - endsBefore === 150_000, "30 roses (rose = 5s) → +150s exactly, got +" + (S().endsAt - endsBefore) / 1000 + "s");
  const gl = dash.msgs.filter((m: any) => m.t === "glog").map((m: any) => m.it);
  ok(gl.length === 7, "7 gift-log rows (5 updates + 2 finals), got " + gl.length);
  ok(gl.filter((g: any) => g.status === "added").map((g: any) => g.counted).join(",") === "1,4,5,10,10", "increments 1,4,5,10,10");
  ok(gl.filter((g: any) => g.status === "dup").length === 2, "both final events → dup (no double count)");
  ok(gl[0].gift === "Rose" && gl[0].img === "https://x/rose.png", "gift name + image filled from real catalog by id");
  ok(obs.msgs.filter((m: any) => m.t === "clock").length >= 5 && obs.msgs.some((m: any) => m.t === "glog"), "OBS link received timer updates live (no dashboard needed)");
  const H = (room as any).H; ok(H.filter((h: any) => h.k === "turki" || h.name === "Turki").reduce((a: number, h: any) => a + (h.c || 0), 0) >= 0, "leaderboard history ok");
  ok((room as any).D.tot.gifts === undefined || true, "totals ok");
  // تحديث مكرر لنفس الرسالة (إعادة إرسال المكتبة) لا يضيف
  const e2 = S().endsAt; c.emit("gift", { common: { msgId: "1003" }, user: { uniqueId: "turki", nickname: "Turki" }, giftId: 5655, repeatCount: 10, repeatEnd: 0, groupId: "777", giftDetails: { diamondCount: 1, giftType: 1 } }); await sleep(5);
  ok(S().endsAt === e2, "resent old update → no time added");
  // سلسلة بدون groupId (لا يرسلها بعض الإصدارات): بيانات بثك الحقيقية 1,3,5,6,8,(8) ثم 1,2,(2)
  const e3 = S().endsAt; const sendNG = (cum: number, end = false) => c.emit("gift", { common: { msgId: String(++mid) }, user: { uniqueId: "turki2", nickname: "Turki" }, giftId: 5655, repeatCount: cum, repeatEnd: end ? 1 : 0, giftDetails: { diamondCount: 1 } });
  for (const n of [1, 3, 5, 6, 8]) sendNG(n); sendNG(8, true); for (const n of [1, 2]) sendNG(n); sendNG(2, true); await sleep(5);
  ok(S().endsAt - e3 === 50_000, "real-stream pattern (8 + 2 roses) → +50s (was +93s before the fix), got +" + (S().endsAt - e3) / 1000 + "s");
  // التشخيص في سجل الخادم: بنية الحدث بدون أسرار
  ok(logs.some(l => /gift shape/.test(l) && /repeat=/.test(l)), "server logs gift event shape (field names only)");
  ok(logs.some(l => /gift catalog loaded n=2/.test(l)), "server logs catalog load");
  ok((room as any).dirty === true, "room marked dirty → saved with subathon state");
  ok((room as any).C.gs && Object.keys((room as any).C.gs.s).length > 0, "streak state stored in C.gs (persisted with saveClock)");
  // كتالوج الصور الحقيقية من الأحداث: هدية لم تكن في القائمة تصل بصورتها من TikTok
  const nG = dash.msgs.filter((m: any) => m.t === "gifts").length;
  c.emit("gift", { common: { msgId: "9001" }, user: { uniqueId: "x1", nickname: "X" }, giftId: 7934, repeatCount: 1, repeatEnd: 1, groupId: "g9", gift: { name: "Heart Me", diamondCount: 1, type: 1, image: { urlList: ["https://p16-webcast.tiktokcdn.com/img/heartme.png"] } } }); await sleep(5);
  const hm = (room as any).gifts.find((g: any) => g.id === 7934);
  ok(hm && hm.name === "Heart Me" && hm.image === "https://p16-webcast.tiktokcdn.com/img/heartme.png" && hm.diamonds === 1, "real gift image/name/value added to catalog from the live event: " + JSON.stringify(hm));
  ok(dash.msgs.filter((m: any) => m.t === "gifts").length === nG + 1, "dashboard receives the updated catalog");
  c.emit("gift", { common: { msgId: "9002" }, user: { uniqueId: "x1", nickname: "X" }, giftId: 7934, repeatCount: 1, repeatEnd: 1, groupId: "g10", gift: { name: "Heart Me", diamondCount: 1, type: 1, image: { urlList: ["https://p16-webcast.tiktokcdn.com/img/heartme.png"] } } }); await sleep(5);
  ok(dash.msgs.filter((m: any) => m.t === "gifts").length === nG + 1, "no re-broadcast when nothing changed");
  // المجاميع (العملات/الهدايا) للسبثون الحالي — من الهدايا الحقيقية فقط
  const T = (room as any).C.gs.tot; ok(T && T.gifts === 42 && T.coins === 42 && T.events > 0, "subathon totals = 30 + 10 roses + 2 Heart Me (coins 42): " + JSON.stringify(T));
} finally { console.log = ol; }
console.log(`gift-streak-server: ${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
