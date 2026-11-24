// إحصائيات البث: الجامع (دعم الجلسة بوحداته، المشاهدون، المتاح/غير المتاح) + المسار الكامل عبر الخادم
import { statsOnEvent, statsViewers, statsSummary, statsState } from "../arsh-live/src/engine/livestats.js";
import { newRoom, roomEvent, roomStats, roomSessionConnect } from "../arsh-live/src/engine/room.js";
import { sbHTML } from "../arsh-live/src/engine/statsview.js";
import { createHub } from "../arsh-live/src/server/live-hub.ts";
import { TK_BACKOFF } from "../arsh-live/src/server/tiktok.ts";
import { EventEmitter } from "node:events";
let pass = 0, fail = 0; const ok = (c: any, m: string) => { c ? pass++ : (fail++, process.stdout.write("FAIL " + m + "\n")); };
const now = Date.now();
// 1) الدعم بوحداته الأصلية — بدون تحويل ولا خلط
{ const R: any = newRoom(); roomSessionConnect(R, "S1", now);
  const ev = (o: any) => roomEvent(R, { user: { id: "u", name: "u" }, ...o }, now);
  ev({ type: "gift", id: "g1", platform: "tiktok", gift: "Rose", giftId: 5655, diamonds: 1, value: 15000, count: 1 });
  ev({ type: "gift", id: "g1", platform: "tiktok", gift: "Rose", giftId: 5655, diamonds: 1, value: 15000, count: 1 }); // نفس المعرّف
  ev({ type: "superchat", id: "s1", platform: "youtube", amount: 50, currency: "USD" });
  ev({ type: "superchat", id: "s2", platform: "youtube", amount: 20, currency: "SAR" });
  ev({ type: "donation", id: "d1", amount: 100, currency: "USD", name: "خالد" });
  ev({ type: "cheer", id: "c1", platform: "twitch", bits: 500 });
  ev({ type: "gift", id: "k1", platform: "kick", gift: "Kicks", value: 100, count: 1 });
  ev({ type: "gift", id: "t1", platform: "tiktok", gift: "Rose", value: 1, count: 1, test: true }); // تجربة
  const S = statsSummary(R.C, now), by = Object.fromEntries(S.rows.map((r: any) => [r.k, r]));
  ok(by.tiktok.coins === 15000, "TikTok coins counted once (duplicate event id ignored, test gift ignored): " + by.tiktok.coins);
  ok(by.youtube.money.USD === 50 && by.youtube.money.SAR === 20, "Super Chat kept per currency (USD 50, SAR 20) — not converted");
  ok(by.donation.money.USD === 100 && by.twitch.bits === 500 && by.kick.kicks === 100, "donation $, Twitch Bits, Kick Kicks each in own unit");
  ok(S.total.money.USD === 150 && S.total.money.SAR === 20 && S.total.coins === 15000, "merged: USD summed only with USD; coins separate from money");
  ok(by.tiktok.money && !by.tiktok.money.USD, "TikTok coins never turned into dollars");
  // 2) المشاهدون + المتاح/غير المتاح
  roomStats(R, "tiktok", { viewers: 1500, views: 20000 }, now); roomStats(R, "youtube", { viewers: 350, views: 3000 }, now); roomStats(R, "kick", { viewers: 200 }, now);
  const S2 = statsSummary(R.C, now), b2 = Object.fromEntries(S2.rows.map((r: any) => [r.k, r]));
  ok(b2.tiktok.viewers === 1500 && b2.tiktok.views === 20000 && b2.youtube.views === 3000, "viewers + total views per platform");
  ok(b2.kick.views === undefined && b2.twitch.views === undefined, "Kick/Twitch total views = not provided by the platform (undefined, never invented)");
  ok(S2.total.viewers === 2050 && S2.total.views === 23000, "merged viewers = sum of platform counts (2050); views only from platforms that provide it");
  const html = sbHTML(S2, { sbMerge: false, sbDesign: "glass", sbUnavail: "show" }, now);
  ok(/غير متاح/.test(html) && /1,500/.test(html) && /\$50/.test(html) && /15,000/.test(html), "bar shows numbers, $ and coins; «غير متاح» for missing stats");
  ok(!/غير متاح/.test(sbHTML(S2, { sbUnavail: "hide" }, now)), "«غير متاح» hidden when the creator chooses");
  ok(!/👁️/.test(sbHTML(S2, { sbViewers: false }, now)) && !/💰/.test(sbHTML(S2, { sbMoney: false }, now)) && !/🪙/.test(sbHTML(S2, { sbCoins: false }, now)), "each stat toggles off independently");
  const merged = sbHTML(S2, { sbMerge: true }, now); ok((merged.match(/lsb-row/g) || []).length === 1 && /2,050/.test(merged) && /ليس عدد أشخاص فريدين/.test(merged), "merged view: one row, sum labelled as platform counts (not unique people)");
  ok((sbHTML(S2, { sbMerge: false }, now).match(/class="lsb-row"/g) || []).length >= 4, "separate view: one row per platform");
  ok(!/👁️/.test(sbHTML(S2, { sbSupport: "coins", sbViewers: false, sbViews: false }, now).replace(/🪙[^]*$/, "")) && !/💰/.test(sbHTML(S2, { sbSupport: "coins" }, now)), "support display: coins only");
  // 3) جلسة بث جديدة: الدعم يبدأ من الصفر — انقطاع لا يصفّر
  roomStats(R, "tiktok", { offline: true }, now); ok(statsSummary(R.C, now).rows.find((r: any) => r.k === "tiktok").viewers === null && statsSummary(R.C, now).rows.find((r: any) => r.k === "tiktok").coins === 15000, "disconnect: viewers unavailable, session support kept");
  roomSessionConnect(R, "S1", now + 1000); ok(statsSummary(R.C, now).total.coins === 15000, "reconnect to the same stream: support kept");
  roomSessionConnect(R, "S2", now + 2000); const S3 = statsSummary(R.C, now); ok(S3.total.coins === 0 && !S3.total.money.USD, "new stream: session support starts from zero");
  // 4) قديم
  roomStats(R, "youtube", { viewers: 10 }, now - 10 * 60_000); ok(statsSummary(R.C, now).rows.find((r: any) => r.k === "youtube").stale, "no update for minutes → marked stale (connection state shown)"); }
// 5) المسار الكامل: TikTok roomUser → الخادم → اللوحة وOBS · YouTube عبر liveStats
TK_BACKOFF.dropped = [20, 20, 20];
const made: any[] = [];
class FakeConn extends EventEmitter { constructor(public u: string, public o: any) { super(); made.push(this); } async connect() { await new Promise(r => setTimeout(r, 5)); return { roomId: "LS1", roomInfo: { user_count: 900, stats: { total_user: 12000 } } }; } disconnect() {} async fetchRoomInfo() { return {}; } async fetchAvailableGifts() { return []; } }
(globalThis as any).__tkTestMod = { TikTokLiveConnection: FakeConn, WebcastEvent: { LIKE: "like", GIFT: "gift", CHAT: "chat", FOLLOW: "follow", SHARE: "share", MEMBER: "member", SUBSCRIBE: "subscribe", ROOM_USER: "roomUser", STREAM_END: "streamEnd", DISCONNECTED: "disconnected" } };
const ol = console.log; console.log = () => {}; const sl = (ms: number) => new Promise(r => setTimeout(r, ms));
try {
  const wss: any = new EventEmitter(); const hub: any = createHub(wss, { authorize: async (_r: string, k?: string) => !!k } as any);
  const cl = () => { const ws: any = new EventEmitter(); ws.readyState = 1; ws.msgs = []; ws.send = (s: string) => ws.msgs.push(JSON.parse(s)); ws.close = () => {}; ws.ping = () => {}; ws.terminate = () => {}; wss.emit("connection", ws); return ws; };
  const send = (ws: any, m: any) => ws.emit("message", Buffer.from(JSON.stringify(m)));
  const d = cl(); send(d, { t: "join", room: "room_ls", key: "k" }); const obs = cl(); send(obs, { t: "join", room: "room_ls" }); await sl(10);
  send(d, { t: "tiktok", room: "room_ls", username: "streamer" }); await sl(40); const c = made[made.length - 1];
  const lastST = (ws: any) => ws.msgs.filter((m: any) => m.t === "stats").pop()?.ST;
  ok(lastST(obs)?.p?.tiktok?.viewers === 900 && lastST(obs).p.tiktok.views === 12000, "room info at connect → viewers 900 / total 12,000 reach OBS");
  await sl(5100); c.emit("roomUser", { total: 1250, totalUser: 25600 }); await sl(5);
  ok(lastST(obs)?.p?.tiktok?.viewers === 1250 && lastST(obs).p.tiktok.views === 25600, "TikTok roomUser (v2: total/totalUser) → 1,250 now / 25,600 views");
  c.emit("roomUser", { total: 1300 }); await sl(5); ok(lastST(obs).p.tiktok.viewers === 1250, "roomUser throttled (max once per 5 s)");
  c.emit("gift", { common: { msgId: "gx" }, user: { uniqueId: "a", nickname: "A" }, giftId: 5655, repeatCount: 10, repeatEnd: 1, groupId: "g", gift: { name: "Rose", diamondCount: 1, type: 1 } }); await sl(5);
  ok(lastST(obs)?.p?.tiktok?.coins === 10, "gift streak → session coins update live (10)");
  hub.liveStats("room_ls", "youtube", { viewers: 350, views: 3000 }); await sl(5); ok(lastST(d)?.p?.youtube?.viewers === 350, "YouTube stats via authorized connector reach the dashboard");
  const snap = cl(); send(snap, { t: "join", room: "room_ls" }); await sl(10); ok(snap.msgs.find((m: any) => m.t === "snapshot")?.C?.stats?.p?.tiktok?.viewers === 1250, "page refresh / OBS reopen: stats in snapshot");
  c.emit("disconnected"); await sl(10); ok(lastST(obs).p.tiktok.viewers === null && lastST(obs).p.tiktok.coins === 10, "disconnect: viewers unavailable, coins kept");
} finally { console.log = ol; }
console.log(`live-stats: ${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
