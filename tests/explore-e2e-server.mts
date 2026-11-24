// خادم اختبار طرفي للإكسبلور: WebSocket حقيقي + مركز البث الحقيقي + اتصال TikTok تجريبي معزول (لا يتصل بـ TikTok ولا بقاعدة بيانات)
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { EventEmitter } from "node:events";
import { WebSocketServer } from "/opt/npm-tools/node_modules/ws/wrapper.mjs";
import { createHub } from "/home/claude/najd/arsh-live/src/server/live-hub.ts";
import { TK_BACKOFF } from "/home/claude/najd/arsh-live/src/server/tiktok.ts";
TK_BACKOFF.dropped = [20, 20, 20];
const ROOM = "room_e2e_explore", KEY = "k_e2e";
const conns: any[] = [];
class FakeConn extends EventEmitter { constructor(public u: string) { super(); conns.push(this); } async connect() { await new Promise(r => setTimeout(r, 5)); return { roomId: "E2E1", roomInfo: { user_count: 3000 } }; } disconnect() {} async fetchRoomInfo() { return {}; } async fetchAvailableGifts() { return []; } }
(globalThis as any).__tkTestMod = { TikTokLiveConnection: FakeConn, WebcastEvent: { LIKE: "like", GIFT: "gift", CHAT: "chat", FOLLOW: "follow", SHARE: "share", MEMBER: "member", SUBSCRIBE: "subscribe", ROOM_USER: "roomUser", STREAM_END: "streamEnd", DISCONNECTED: "disconnected" } };
const wss = new WebSocketServer({ noServer: true });
const hub: any = createHub(wss as any, { authorize: async (r: string, k?: string) => r === ROOM && k === KEY } as any);
let uid = 0, sent = { like: 0, follow: 0, chat: 0, gift: 0, member: 0 } as Record<string, number>;
const http = createServer((req, res) => {
  const u = new URL(req.url || "/", "http://x"); const p = u.pathname;
  if (p === "/dash") { const h = readFileSync("/home/claude/najd/demo/index.html", "utf8");
    const cfg = `<script>window.B6O6_TEST_WS={ws:"ws://"+location.host+"/ws",room:${JSON.stringify(ROOM)},key:${JSON.stringify(KEY)}}</script>`;
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" }); return res.end(h.replace("<script>", cfg + "<script>")); }
  // دفعة أحداث بمعدل محدد عبر اتصال TikTok التجريبي (نفس مسار الأحداث الحقيقي في الخادم)
  if (p === "/test/flood") { const rate = +(u.searchParams.get("rate") || 300), sec = +(u.searchParams.get("sec") || 8); const c = conns[conns.length - 1]; if (!c) { res.writeHead(409); return res.end("no conn"); }
    const per = Math.max(1, Math.round(rate / 50)); const t0 = Date.now();
    const iv = setInterval(() => { if (Date.now() - t0 > sec * 1000) { clearInterval(iv); return; } for (let k = 0; k < per; k++) { uid++; const user = { uniqueId: "u" + uid, nickname: "متابع " + uid, userId: String(uid) }; const r = uid % 20;
      if (r < 9) { c.emit("like", { user, likeCount: 15, common: { msgId: "l" + uid } }); sent.like++; }
      else if (r < 13) { c.emit("follow", { user, common: { msgId: "f" + uid } }); sent.follow++; }
      else if (r < 17) { c.emit("chat", { user, content: "هلا والله " + uid, common: { msgId: "c" + uid } }); sent.chat++; }
      else if (r < 19) { c.emit("member", { user, common: { msgId: "m" + uid } }); sent.member++; }
      else { c.emit("gift", { user, giftId: 5655, repeatCount: 1, repeatEnd: 1, groupId: "g" + uid, gift: { name: "Rose", diamondCount: 1, type: 1 }, common: { msgId: "g" + uid } }); sent.gift++; } } }, 20);
    res.writeHead(200); return res.end("ok"); }
  if (p === "/test/state") { const r = hub.rooms.get(ROOM); res.writeHead(200, { "content-type": "application/json" }); return res.end(JSON.stringify({ sent, tot: r?.D?.tot, coins: r?.C?.stats?.p?.tiktok?.coins, P: r?.P && { recv: r.P.recv, done: r.P.done, dup: r.P.dup, failed: r.P.failed, explore: r.P.explore, lagMax: r.P.lagMax, maxPending: r.P.maxPending, batches: r.P.batches, sent: r.P.sent } })); }
  res.writeHead(404); res.end();
});
http.on("upgrade", (req, sock, head) => { if (req.url === "/ws") wss.handleUpgrade(req, sock as any, head, (ws: any) => wss.emit("connection", ws, req)); else sock.destroy(); });
http.listen(+(process.env.PORT || 39800), "127.0.0.1", () => console.log("READY"));
