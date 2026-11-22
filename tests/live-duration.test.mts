// مدة البث (Live Duration): المعادلات وأوضاع العرض + الربط بجلسة البث الحقيقية عبر الخادم (TikTok وهمي)
import { durOf, durText, durSplit } from "../arsh-live/src/engine/duration.js";
import { newRoom, roomSessionConnect, roomSessionEnd, roomSessionOp } from "../arsh-live/src/engine/room.js";
import { createHub } from "../arsh-live/src/server/live-hub.ts";
import { TK_BACKOFF } from "../arsh-live/src/server/tiktok.ts";
import { EventEmitter } from "node:events";
let pass = 0, fail = 0; const ok = (c: any, m: string) => { c ? pass++ : (fail++, process.stdout.write("FAIL " + m + "\n")); };
const T = (h: number, m = 0, s = 0) => ((h * 60 + m) * 60 + s) * 1000;
// 1) المعادلات
{ const s = durSplit(T(53, 20, 15)); ok(s.th === 53 && s.d === 2 && s.h === 5 && s.m === 20 && s.sec === 15, "split 53:20:15 → th=53, d=2, h=5"); }
// 2) العرض التلقائي: الأيام تظهر من 24 ساعة، والساعات لا تُصفّر دون زيادة الأيام
const A = (ms: number, o: any = {}) => durText(ms, o);
ok(A(T(0, 30)) === "00:30:00", "30 min → 00:30:00");
ok(A(T(19, 22, 18)) === "19:22:18", "19h → 19:22:18");
ok(A(T(23, 59, 59)) === "23:59:59", "23:59:59 stays hours");
ok(A(T(24)) === "1 يوم | 00:00:00", "24h → 1 يوم | 00:00:00");
ok(A(T(48)) === "يومان | 00:00:00", "48h → يومان | 00:00:00");
ok(A(T(72)) === "3 أيام | 00:00:00", "72h → 3 أيام");
ok(A(T(74, 15, 30), { lang: "en" }) === "3 Days | 02:15:30" && A(T(26, 15, 30), { lang: "en" }) === "1 Day | 02:15:30", "English Day/Days");
ok(A(T(5), { daysAlways: true }) === "0 يوم | 05:00:00", "days always shown even at zero");
// 3) أوضاع الملف الثاني
const H = (ms: number, mode: string, o: any = {}) => durText(ms, { mode, ...o });
ok(H(T(48, 35, 20), "hours") === "48:35:20" && H(T(120), "hours") === "120:00:00", "hours only: total hours never reset");
for (const [h, s] of [[24, "24 ساعة | يوم واحد"], [48, "48 ساعة | يومان"], [72, "72 ساعة | 3 أيام"], [96, "96 ساعة | 4 أيام"], [120, "120 ساعة | 5 أيام"], [240, "240 ساعة | 10 أيام"]] as [number, string][])
  ok(H(T(h), "hours_days") === s, `hours+days ${h}h → ${s} (got ${H(T(h), "hours_days")})`);
ok(H(T(53), "hours_days_detail") === "53 ساعة | يومان و5 ساعات", "detail: 53 ساعة | يومان و5 ساعات");
ok(H(T(48, 35, 20), "hms_days") === "48:35:20 | يومان", "hms + days: 48:35:20 | يومان");
ok(H(T(53, 20, 15), "hms_days", { dayDetail: true }) === "53:20:15 | يومان و5 ساعات", "hms + days detail: 53:20:15 | يومان و5 ساعات");
ok(H(T(53, 20, 15), "days_time") === "يومان | 05:20:15", "days + time: يومان | 05:20:15");
ok(H(T(48), "hours_days", { lang: "en" }) === "48 Hours | 2 Days", "English: 48 Hours | 2 Days");
ok(H(T(53, 30, 45), "full") === "يومان | 5 ساعات | 30 دقيقة | 45 ثانية", "full details");
ok(H(T(53, 30, 45), "minimal", { lang: "en" }) === "2D : 05H : 30M : 45S", "minimal");
ok(H(T(48), "hours_days", { unitH: false, unitD: false }) === "48 | 2", "hide «ساعة» and «يوم» words");
ok(A(T(19, 22, 18), { showS: false }) === "19:22" && A(T(50, 1, 2), { showD: false }) === "50:01:02", "hide seconds; hide days → total hours (no time lost)");
ok(H(T(48), "hours_days", { sep: "•" }) === "48 ساعة • يومان", "custom separator");
// 4) الانتقال السلس 23→24: الساعات الإجمالية تستمر في الزيادة كل ثانية
{ let prev = -1, okInc = true; for (let s = T(23, 59, 55) / 1000; s <= T(24, 0, 5) / 1000; s++) { const th = durSplit(s * 1000).th * 3600 + durSplit(s * 1000).m * 60 + durSplit(s * 1000).sec; if (th <= prev) okInc = false; prev = th; } ok(okInc, "every second increases across 23:59:59 → 24:00:00"); }
// 5) الربط بجلسة البث (المحرك)
{ const R: any = newRoom(); let t = Date.parse("2026-11-22T10:00:00Z");
  ok(durOf(R.C, t).idle && durOf(R.C, t).ms === 0, "no stream yet → idle 00:00:00");
  const start = t - T(19, 22, 18); roomSessionConnect(R, "R1", t, { startAt: start });
  ok(durOf(R.C, t).ms === T(19, 22, 18) && durOf(R.C, t).src === "tiktok", "uses TikTok's real stream start (stream already 19:22:18 old)");
  t += T(4, 37, 42); ok(A(durOf(R.C, t).ms) === "1 يوم | 00:00:00", "reaches 24h → 1 يوم | 00:00:00");
  roomSessionConnect(R, "R1", t + 1000); ok(durOf(R.C, t).ms === T(24), "reconnect to the same stream → no reset");
  t += T(24); roomSessionEnd(R, t, "stream_end"); const fin = durOf(R.C, t + T(5)); ok(fin.ended && fin.ms === T(48), "stream end → counter stops and keeps 48h");
  ok(R.C.live.history[0].durMs === T(48), "final duration saved with the session");
  t += T(10); roomSessionConnect(R, "R2", t, { startAt: t }); ok(durOf(R.C, t + 5000).ms === 5000, "new stream → starts from zero");
  // الاستمرار بين البثوث
  roomSessionOp(R, { op: "durCarry", on: true }, t); t += T(30); roomSessionEnd(R, t, "stream_end");
  t += T(2); roomSessionConnect(R, "R3", t, { startAt: t }); t += T(1);
  ok(durOf(R.C, t).ms === T(31) && durOf(R.C, t).cur === T(1), "carry ON: next stream continues 30h + 1h = 31h");
  // انقطاع ظُنّ نهاية ثم عاد نفس البث: لا تُحتسب مرتين
  roomSessionEnd(R, t, "stream_end"); roomSessionConnect(R, "R3", t + 5000); ok(durOf(R.C, t + 5000).ms === T(31) + 5000, "false end + resume of same stream → not double counted");
  roomSessionOp(R, { op: "durCarry", on: false }, t); ok(durOf(R.C, t + 5000).ms === T(1) + 5000, "carry OFF → current stream only");
  // يدوي
  roomSessionOp(R, { op: "durStart" }, t); ok(durOf(R.C, t + 7000).ms === 7000 && durOf(R.C, t).src === "manual", "manual start");
  roomSessionOp(R, { op: "durStop" }, t + 9000); ok(durOf(R.C, t + 60_000).ms === 9000 && durOf(R.C, t + 60_000).ended, "manual stop freezes");
  roomSessionOp(R, { op: "durAuto" }, t); ok(durOf(R.C, t).src === "tiktok", "back to automatic"); }
// 6) المسار الكامل عبر الخادم: TikTok يعطي وقت البدء، تحديث الصفحة/OBS، إعادة تشغيل الخادم
TK_BACKOFF.dropped = [20, 20, 20, 20];
const CREATE = Math.floor((Date.now() - T(23, 59, 50)) / 1000); let ROOM = "X1"; const made: any[] = [];
class FakeConn extends EventEmitter { constructor(public u: string, public o: any) { super(); made.push(this); } async connect() { await new Promise(r => setTimeout(r, 5)); return { roomId: ROOM, roomInfo: { create_time: CREATE } }; } disconnect() {} async fetchRoomInfo() { return {}; } async fetchAvailableGifts() { return []; } }
(globalThis as any).__tkTestMod = { TikTokLiveConnection: FakeConn, WebcastEvent: { LIKE: "like", GIFT: "gift", CHAT: "chat", FOLLOW: "follow", SHARE: "share", MEMBER: "member", SUBSCRIBE: "subscribe", STREAM_END: "streamEnd", DISCONNECTED: "disconnected" } };
const store: any = {}; const ol = console.log; console.log = () => {};
const mk = () => { const wss: any = new EventEmitter(); return { wss, hub: createHub(wss, { authorize: async (_r: string, k?: string) => !!k, loadRoom: async (id: string) => store[id] ? JSON.parse(JSON.stringify(store[id])) : null, saveClock: async (id: string, C: any) => { store[id] = { C: JSON.parse(JSON.stringify(C)) }; } } as any) }; };
const cl = (wss: any) => { const ws: any = new EventEmitter(); ws.readyState = 1; ws.msgs = []; ws.send = (s: string) => ws.msgs.push(JSON.parse(s)); ws.close = () => {}; ws.ping = () => {}; ws.terminate = () => {}; wss.emit("connection", ws); return ws; };
const sl = (ms: number) => new Promise(r => setTimeout(r, ms)); const send = (ws: any, m: any) => ws.emit("message", Buffer.from(JSON.stringify(m)));
try {
  let { wss, hub } = mk(); const RID = "room_dur";
  const d = cl(wss); send(d, { t: "join", room: RID, key: "k" }); await sl(10);
  send(d, { t: "tiktok", room: RID, username: "streamer" }); await sl(40);
  const room = () => (hub.rooms.get(RID) as any);
  let D = durOf(room().C, Date.now()); ok(D.src === "tiktok" && Math.abs(D.ms - T(23, 59, 50)) < 3000, "server: start taken from TikTok create_time (23:59:50 in)");
  await sl(10); D = durOf(room().C, Date.now() + 15_000); ok(/^1 يوم \| 00:00:0\d$/.test(durText(D.ms, {})), "server: crosses into 1 يوم | 00:00:0x → " + durText(D.ms, {}));
  const obs = cl(wss); send(obs, { t: "join", room: RID }); await sl(10);
  const snap = obs.msgs.find((m: any) => m.t === "snapshot"); ok(snap && Math.abs(durOf(snap.C, Date.now()).ms - durOf(room().C, Date.now()).ms) < 50, "OBS reopened: same duration from the server snapshot");
  const d2 = cl(wss); send(d2, { t: "join", room: RID, key: "k" }); await sl(10); ok(Math.abs(durOf(d2.msgs.find((m: any) => m.t === "snapshot").C, Date.now()).ms - durOf(room().C, Date.now()).ms) < 50, "page refresh: duration continues");
  made[made.length - 1].emit("disconnected"); await sl(80); ok(Math.abs(durOf(room().C, Date.now()).ms - T(23, 59, 50)) < 5000 && !room().C.live.endedAt, "disconnect + reconnect: no reset");
  await sl(1100); (hub.rooms.get(RID) as any).tiktok?.stop(); ({ wss, hub } = mk()); const d3 = cl(wss); send(d3, { t: "join", room: RID, key: "k" }); await sl(15);
  ok(Math.abs(durOf(room().C, Date.now()).ms - T(23, 59, 50)) < 6000, "server restart: duration preserved");
  send(d3, { t: "tiktok", room: RID, username: "streamer" }); await sl(40); made[made.length - 1].emit("streamEnd"); await sl(5);
  const end = durOf(room().C, Date.now() + 60_000); ok(end.ended && Math.abs(end.ms - T(23, 59, 50)) < 7000, "stream end: frozen and saved");
  ROOM = "X2"; (FakeConn.prototype as any).connect = async function () { return { roomId: "X2", roomInfo: { create_time: Math.floor(Date.now() / 1000) } }; }; await sl(80);
  ok(room().C.live.roomId === "X2" && durOf(room().C, Date.now()).ms < 5000, "new stream: new counter from zero");
  ok(d3.msgs.some((m: any) => m.t === "session" && m.S && m.S.streamStart), "dashboard/OBS get the session (with streamStart)");
} finally { console.log = ol; }
console.log(`live-duration: ${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
