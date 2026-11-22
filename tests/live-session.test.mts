// جلسات البث (Live Session Management) — المسار الكامل: TikTok (مكتبة وهمية) → tiktok.ts → live-hub → الغرفة → رسائل اللوحة وOBS
// السيناريوهات الإلزامية: بث جديد من صفر، 1000 تكبيسة، انتهاء البث، بث جديد = تصفير، انقطاع/إعادة اتصال بنفس البث = استمرار،
// تحديث الصفحة/OBS بدون فقدان، أحداث متأخرة تُتجاهل، حفظ إحصائيات السابق، إعادة تشغيل الخادم أثناء البث، الإعدادات لا تُمس
import { createHub } from "../arsh-live/src/server/live-hub.ts";
import { TK_BACKOFF } from "../arsh-live/src/server/tiktok.ts";
import { EventEmitter } from "node:events";
let pass = 0, fail = 0; const ok = (c: any, m: string) => { c ? pass++ : (fail++, process.stdout.write("FAIL " + m + "\n")); };
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
TK_BACKOFF.dropped = [20, 20, 20, 20, 20]; // إعادة المحاولة بسرعة في الاختبار
let ROOM_ID = "R100"; const made: any[] = [];
class FakeConn extends EventEmitter { constructor(public user: string, public opts: any) { super(); made.push(this); }
  async connect() { await sleep(5); return { roomId: ROOM_ID }; } disconnect() {} async fetchRoomInfo() { return {}; } async fetchAvailableGifts() { return []; } }
(globalThis as any).__tkTestMod = { TikTokLiveConnection: FakeConn, WebcastEvent: { LIKE: "like", GIFT: "gift", CHAT: "chat", FOLLOW: "follow", SHARE: "share", MEMBER: "member", SUBSCRIBE: "subscribe", STREAM_END: "streamEnd", DISCONNECTED: "disconnected" } };
const store: any = {};
const mkHub = () => { const wss: any = new EventEmitter(); const hub = createHub(wss, { authorize: async (_r: string, key?: string) => !!key, loadRoom: async (id: string) => store[id] ? JSON.parse(JSON.stringify(store[id])) : null, saveClock: async (id: string, C: any) => { store[id] = { ...(store[id] || {}), C: JSON.parse(JSON.stringify(C)) }; } } as any); return { wss, hub }; };
const client = (wss: any) => { const ws: any = new EventEmitter(); ws.readyState = 1; ws.msgs = [] as any[]; ws.send = (s: string) => ws.msgs.push(JSON.parse(s)); ws.close = () => {}; ws.ping = () => {}; ws.terminate = () => {}; wss.emit("connection", ws); return ws; };
const msg = (ws: any, m: any) => ws.emit("message", Buffer.from(JSON.stringify(m)));
const ol = console.log; const logs: string[] = []; console.log = (...a: any[]) => logs.push(a.join(" "));
const RID = "room_sess_1";
let mid = 0; const like = (c: any, user: string, n: number) => c.emit("like", { common: { msgId: String(++mid) }, user: { uniqueId: user, nickname: user }, likeCount: n });
try {
  let { wss, hub } = mkHub();
  const dash = client(wss); msg(dash, { t: "join", room: RID, key: "k" }); await sleep(20);
  const obs = client(wss); msg(obs, { t: "join", room: RID }); await sleep(20);
  const room = () => hub.rooms.get(RID) as any;
  // إعدادات دائمة + سبثون فيه قاعدة تكبيس (كل 100 لايك = 10 ثوانٍ)
  msg(dash, { t: "layout", room: RID, layout: { id: "L1", name: "تخطيط", widgets: [{ id: "w1", type: "likes", design: "neon", acc: "#ff0055" }, { id: "w2", type: "goal", target: 5000 }] } });
  msg(dash, { t: "clock-op", room: RID, target: "subathon", op: "config", config: { initialMs: 3600_000, rules: { list: [{ id: "rl", kind: "likes", enabled: true, dir: 1, every: 100, ms: 10_000, cooldownMs: 0, userCooldownMs: 0, perMin: 0, maxMs: 0 }] } } });
  msg(dash, { t: "clock-op", room: RID, target: "subathon", op: "start" }); await sleep(10);
  // بيانات «من قبل نظام الجلسات» (مثل الـ 50,000 القديمة) — أول جلسة تصفّرها
  room().D.tot.likes = 50000; room().D.likes = { old: { k: "old", name: "قديم", v: 50000 } };
  // 1) بدء بث جديد → يبدأ من صفر
  msg(dash, { t: "tiktok", room: RID, username: "streamer" }); await sleep(40);
  let c = made[made.length - 1];
  ok(room().C.live?.roomId === "R100" && room().C.live?.sid, "1) session created from TikTok roomId R100");
  ok(room().D.tot.likes === 0 && Object.keys(room().D.likes).length === 0, "1) taps start from zero (old 50,000 cleared)");
  ok(dash.msgs.some((m: any) => m.t === "session" && m.started) && obs.msgs.some((m: any) => m.t === "session" && m.started), "1) session_started sent to dashboard + OBS");
  ok(obs.msgs.some((m: any) => m.t === "event" && m.ev?.type === "reset" && m.ev.scope === "likes"), "1) OBS layers receive the likes reset");
  // 2) 1000 تكبيسة
  const s0 = room().C.subathon.endsAt;
  for (let i = 0; i < 10; i++) like(c, "u" + (i % 3), 100); await sleep(10);
  ok(room().D.tot.likes === 1000 && room().D.likes.u0.v === 400, "2) 1,000 taps counted, top tapper u0=400");
  ok(obs.msgs.filter((m: any) => m.t === "event" && m.ev?.type === "like").length === 10, "2) every tap batch reached OBS");
  ok(room().C.subathon.endsAt - s0 === 100_000, "2) subathon got +100s from the new taps (10 × 100)");
  // 5) انقطاع الإنترنت ثم إعادة الاتصال بنفس البث → لا تصفير
  c.emit("disconnected"); await sleep(80); c = made[made.length - 1];
  ok(room().C.live.roomId === "R100" && !room().C.live.endedAt && room().D.tot.likes === 1000, "5) disconnect + reconnect to the same stream → no reset (1,000 kept)");
  like(c, "u1", 50); await sleep(5); ok(room().D.tot.likes === 1050, "5) counting continues after reconnect");
  // 6) تحديث صفحة المنصة · 7) إغلاق OBS وفتحه
  const dash2 = client(wss); msg(dash2, { t: "join", room: RID, key: "k" }); await sleep(10);
  const snap = dash2.msgs.find((m: any) => m.t === "snapshot"); ok(snap && snap.D.tot.likes === 1050 && snap.C.live.roomId === "R100", "6) page refresh → snapshot keeps current taps (1,050)");
  obs.emit("close"); const obs2 = client(wss); msg(obs2, { t: "join", room: RID }); await sleep(10);
  ok(obs2.msgs.find((m: any) => m.t === "snapshot")?.D.tot.likes === 1050, "7) OBS reopened → still 1,050");
  // إعادة تشغيل الخادم أثناء البث نفسه (نشر جديد): البيانات تُستعاد لنفس الجلسة
  await sleep(1100); // نبضة الحفظ
  ok(store[RID]?.C?.liveD?.D?.tot?.likes === 1050 && store[RID].C.liveD.sid === room().C.live.sid, "server saves current-session taps with the session id");
  const sid1 = room().C.live.sid;
  ({ wss, hub } = mkHub()); const d3 = client(wss); msg(d3, { t: "join", room: RID, key: "k" }); await sleep(20);
  ok(room().D.tot.likes === 1050 && room().C.live.sid === sid1, "after server restart: taps restored for the same session");
  msg(d3, { t: "layout", room: RID, layout: { id: "L1", name: "تخطيط", widgets: [{ id: "w1", type: "likes", design: "neon", acc: "#ff0055" }, { id: "w2", type: "goal", target: 5000 }] } }); // اللوحة ترسل تخطيطها بعد إعادة التشغيل
  msg(d3, { t: "tiktok", room: RID, username: "streamer" }); await sleep(40); c = made[made.length - 1];
  ok(room().D.tot.likes === 1050 && room().C.live.sid === sid1, "reconnect to the same stream after restart → continue (no reset)");
  like(c, "u2", 450); await sleep(5); ok(room().D.tot.likes === 1500, "counting continues (1,500)");
  // 3) إنهاء البث (STREAM_END) → تُغلق الجلسة وتُحفظ إحصائياتها، الأرقام تبقى ظاهرة
  c.emit("streamEnd"); await sleep(10);
  const L = room().C.live; ok(L.endedAt && L.history[0]?.sid === sid1 && L.history[0].likes === 1500 && L.history[0].topLikers[0].v >= 400, "3/9) stream end → session closed, previous stats saved (1,500 taps, top tappers)");
  ok(room().D.tot.likes === 1500, "3) numbers stay visible after the stream ends (until a new stream)");
  // 8) حدث متأخر من البث المنتهي → يُتجاهل
  like(c, "late", 999); await sleep(5); ok(room().D.tot.likes === 1500, "8) late tap from the ended stream ignored");
  // 4) فتح بث جديد (roomId جديد) → تصفير تلقائي
  ROOM_ID = "R200"; await sleep(80); c = made[made.length - 1];
  ok(room().C.live.roomId === "R200" && room().C.live.sid !== sid1, "4) new stream detected from its new roomId");
  ok(room().D.tot.likes === 0 && Object.keys(room().D.likes).length === 0 && !room().C.latest?.like, "4/10) taps, ranking, last tapper reset to zero");
  ok(room().C.subathon.rstate.acc.rl === undefined || room().C.subathon.rstate.acc.rl === 0, "4) leftover taps of the old stream don't carry into the subathon");
  const rem = room().C.subathon.endsAt; ok(rem > Date.now() + 3000_000 && room().C.subathon.status === "running", "subathon time NOT reset (continues across streams)");
  // 8) أحداث متأخرة من البث القديم (roomId قديم) بعد البدء الجديد → تُتجاهل
  const oldConn = made[made.length - 2]; oldConn.emit("like", { common: { msgId: "x1" }, user: { uniqueId: "ghost", nickname: "ghost" }, likeCount: 777 }); await sleep(5);
  ok(room().D.tot.likes === 0, "8) late event from the previous connection ignored");
  ok((hub as any).dispatch && (() => { (hub as any).dispatch(RID, { type: "like", id: "lr-old", lr: "R100", user: { id: "g2", name: "g2" }, count: 555 }); return room().D.tot.likes === 0; })(), "8) event tagged with the old roomId ignored");
  like(c, "new1", 30); await sleep(5); ok(room().D.tot.likes === 30, "only new-stream taps count (30)");
  // الإعدادات الدائمة لم تتغير
  const lay = room().layouts.get("L1"); ok(lay && lay.widgets[0].design === "neon" && lay.widgets[0].acc === "#ff0055" && lay.widgets[1].target === 5000, "designs, colours, tap goal target untouched");
  ok(room().C.subathon.rules.list[0].every === 100, "subathon rules untouched");
  // يدوي: تصفير الآن + بدء جلسة جديدة
  msg(d3, { t: "session-op", room: RID, op: "resetNow" }); await sleep(5); ok(room().D.tot.likes === 0 && room().C.live.roomId === "R200", "manual «reset taps now» → zero, same session");
  like(c, "m", 10); await sleep(5);
  const h0 = room().C.live.history.length; msg(d3, { t: "session-op", room: RID, op: "newSession" }); await sleep(5);
  ok(room().D.tot.likes === 0 && room().C.live.history.length === h0 + 1 && room().C.live.source === "manual", "manual «start new session» → archived + zero");
  // إيقاف التصفير التلقائي
  msg(d3, { t: "session-op", room: RID, op: "config", config: { auto: false } }); await sleep(5); like(c, "k", 20); await sleep(5);
  c.emit("streamEnd"); await sleep(5); ROOM_ID = "R300"; await sleep(80);
  ok(room().C.live.roomId === "R300" && room().D.tot.likes === 20, "auto-reset off → new session recorded but taps kept");
  // قارئ للقراءة فقط لا يستطيع التصفير
  const ro = client(wss); msg(ro, { t: "join", room: RID }); await sleep(5); msg(ro, { t: "session-op", room: RID, op: "resetNow" }); await sleep(5);
  ok(room().D.tot.likes === 20, "read-only (OBS) connection cannot reset");
  ok(logs.some(l => /\[session\].*new roomId=R200/.test(l)), "server log records new-stream detection");
} finally { console.log = ol; }
console.log(`live-session: ${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
