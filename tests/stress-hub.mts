// قياس الضغط على مسار الخادم: TikTok (FakeConn) → hub → roomEvent → البث للعملاء
import { createHub } from "../arsh-live/src/server/live-hub.ts";
import { TK_BACKOFF } from "../arsh-live/src/server/tiktok.ts";
import { EventEmitter } from "node:events";
TK_BACKOFF.dropped = [20, 20, 20];
const made: any[] = [];
class FakeConn extends EventEmitter { constructor(public u: string, public o: any) { super(); made.push(this); } async connect() { await new Promise(r => setTimeout(r, 5)); return { roomId: "ST1", roomInfo: { user_count: 900 } }; } disconnect() {} async fetchRoomInfo() { return {}; } async fetchAvailableGifts() { return []; } }
(globalThis as any).__tkTestMod = { TikTokLiveConnection: FakeConn, WebcastEvent: { LIKE: "like", GIFT: "gift", CHAT: "chat", FOLLOW: "follow", SHARE: "share", MEMBER: "member", SUBSCRIBE: "subscribe", ROOM_USER: "roomUser", STREAM_END: "streamEnd", DISCONNECTED: "disconnected" } };
const ol = console.log; const W = (s: string) => process.stdout.write(s + "\n"); console.log = () => {};
const sl = (ms: number) => new Promise(r => setTimeout(r, ms));
let saves = 0, saveBytes = 0;
const wss: any = new EventEmitter(); const hub: any = createHub(wss, { authorize: async (_r: string, k?: string) => !!k, saveClock: async (_id: string, C: any) => { saves++; saveBytes += JSON.stringify(C).length; (globalThis as any).lastC = C; }, saveLogs: async () => {} } as any);
const cl = () => { const ws: any = new EventEmitter(); ws.readyState = 1; ws.n = 0; ws.bytes = 0; ws.types = {}; ws.send = (s: string) => { ws.n++; ws.bytes += s.length; const t = JSON.parse(s).t; ws.types[t] = (ws.types[t] || 0) + 1; }; ws.close = () => {}; ws.ping = () => {}; ws.terminate = () => {}; wss.emit("connection", ws); return ws; };
const send = (ws: any, m: any) => ws.emit("message", Buffer.from(JSON.stringify(m)));
const d = cl(); send(d, { t: "join", room: "room_st", key: "k" }); const obs = [cl(), cl(), cl(), cl(), cl()]; obs.forEach(o => send(o, { t: "join", room: "room_st" })); await sl(20);
send(d, { t: "tiktok", room: "room_st", username: "streamer" }); await sl(60); const c = made[made.length - 1];
const reset = () => [d, ...obs].forEach(w => { w.n = 0; w.bytes = 0; w.types = {}; });
let uid = 0; const U = () => ({ uniqueId: "u" + (++uid), nickname: "متابع " + uid, profilePictureUrl: "https://p16.tiktokcdn.com/a/" + uid + ".jpg", userId: String(uid) });
async function run(name: string, n: number, mk: (i: number) => [string, any]) {
  reset(); const t0 = performance.now(); const cpu0 = process.cpuUsage();
  for (let i = 0; i < n; i++) { const [e, p] = mk(i); c.emit(e, p); }
  const t1 = performance.now(); await sl(50); const cpu = process.cpuUsage(cpu0);
  W(`${name.padEnd(22)} n=${n} sync=${(t1 - t0).toFixed(0)}ms (${((t1 - t0) / n * 1000).toFixed(0)}µs/ev) cpu=${((cpu.user + cpu.system) / 1000).toFixed(0)}ms → OBS msgs=${obs[0].n} bytes=${(obs[0].bytes / 1024).toFixed(0)}KB types=${JSON.stringify(obs[0].types)}`);
}
await run("follow x1000", 1000, i => ["follow", { user: U(), common: { msgId: "f" + i } }]);
await run("like x10000", 10000, i => ["like", { user: U(), likeCount: 15, totalLikeCount: 1000 + i * 15, common: { msgId: "l" + i } }]);
await run("chat x2000", 2000, i => ["chat", { user: U(), content: "رسالة " + i, common: { msgId: "c" + i } }]);
await run("gift x100", 100, i => ["gift", { user: U(), giftId: 5655, repeatCount: 1, repeatEnd: 1, groupId: "g" + i, gift: { name: "Rose", diamondCount: 1, type: 1 }, common: { msgId: "g" + i } }]);
await run("member x3000", 3000, i => ["member", { user: U(), common: { msgId: "m" + i } }]);
await sl(1200);
W(`saves=${saves} lastSave≈${saves ? (saveBytes / saves / 1024).toFixed(0) : 0}KB  heap=${(process.memoryUsage().heapUsed / 1048576).toFixed(0)}MB`);
const LC=(globalThis as any).lastC; if(LC) W("save keys: "+Object.entries(LC).map(([k,v])=>k+"="+(JSON.stringify(v)?.length/1024|0)+"KB").filter(s=>!/=0KB/.test(s)).join(" ")+" | liveD.D: "+(LC.liveD?Object.entries(LC.liveD.D).map(([k,v])=>k+"="+(JSON.stringify(v)?.length/1024|0)+"KB").filter(s=>!/=0KB/.test(s)).join(" "):"")+" | C: "+(LC.C?Object.entries(LC.C).map(([k,v])=>k+"="+(JSON.stringify(v)?.length/1024|0)+"KB").filter(s=>!/=0KB/.test(s)).join(" "):""));
console.log = ol; process.exit(0);
