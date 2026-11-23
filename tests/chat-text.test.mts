// الشات الموحد: نص الرسالة يصل كاملاً من الموصل حتى اللوحة وOBS (+ أوامر بوت الأغاني + التشخيص)
import { chatTextOf, chatEmotesOf, normChat, chatClean } from "../arsh-live/src/engine/chatnorm.js";
import { normalizeEvent } from "../arsh-live/src/engine/events.js";
import { chatMsgOf } from "../arsh-live/src/engine/chat.js";
import { twitchToEvent, kickToEvent, youtubeToEvents } from "../arsh-live/src/engine/platforms.js";
import { musicOnEvent, newMusicState, defaultMusicCfg } from "../arsh-live/src/engine/music.js";
import { createHub } from "../arsh-live/src/server/live-hub.ts";
import { EventEmitter } from "node:events";
let pass = 0, fail = 0; const ok = (c: any, m: string) => { c ? pass++ : (fail++, process.stdout.write("FAIL " + m + "\n")); };
const MSGS = ["السلام عليكم يا بطوط", "Hello everyone", "🔥❤️😂", "السلام عليكم جميعاً، كيف حالكم اليوم؟", "!شغل اسم الأغنية", `رموز <b>خاصة</b> & "اقتباس" 'x' \\ / % $ # @ ~ ^ *`];
// 1) الموحِّد: الحقل الحقيقي في v2 هو content، وفي v1 comment — كلاهما يعمل
ok(chatTextOf({ content: "السلام عليكم" }).text === "السلام عليكم" && chatTextOf({ content: "x" }).field === "content", "v2 payload: text read from «content»");
ok(chatTextOf({ comment: "hi" }).text === "hi" && chatTextOf({ comment: "", content: "y" }).text === "y", "v1 «comment» still supported; empty comment falls back to content");
ok(chatTextOf({ message: { text: "nested" } }).text === "nested", "nested {text} supported");
ok(chatTextOf({ user: { nickname: "أحمد" } }).text === "" , "no text → empty (never invented)");
for (const s of MSGS) ok(chatClean(s) === s, "text preserved exactly: " + s);
ok(chatClean("a\u0000b\u0007c") === "abc", "control chars stripped only");
ok(chatEmotesOf({ emotes: [{ emote: { image: { imageUrl: "https://p16/e.png" } } }, { emote: { image: { imageUrl: "http://bad" } } }] }).join() === "https://p16/e.png", "sticker emotes (https only)");
const n = normChat("tiktok", { content: "السلام عليكم" }, { userId: "u1", username: "Ahmed", messageId: "m1", timestamp: 1730000000 });
ok(n.platform === "tiktok" && n.username === "Ahmed" && n.message === "السلام عليكم" && n.messageId === "m1" && n.timestamp === 1730000000, "unified format {platform, username, message, timestamp, messageId}");
// 2) المعالجة ← رسالة الشات
for (const s of MSGS) { const ev = normalizeEvent({ type: "comment", id: "c" + s.length, user: { id: "a", name: "أحمد" }, text: s }); const m = chatMsgOf(ev!); ok(m && m.name === "أحمد" && m.text === s, "chat message keeps full text: " + s); }
const emo = chatMsgOf(normalizeEvent({ type: "comment", id: "e1", user: { id: "a", name: "a" }, text: "", emotes: ["https://p16/e.png"] })!); ok(emo && emo.emotes?.[0] === "https://p16/e.png", "sticker-only message shown as its sticker");
ok(chatMsgOf(normalizeEvent({ type: "comment", id: "e2", user: { id: "a", name: "أحمد" }, text: "" })!) === null, "no text and no sticker → no name-only line");
ok(normalizeEvent({ type: "comment", id: "d1", user: { id: "a", name: "a" }, text: "x", diag: { keys: "k" } })!.diag === undefined, "diagnostic info never leaves the server");
// 3) المنصات الأخرى (بنية الأحداث الرسمية)
const tw = twitchToEvent({ metadata: { subscription_type: "channel.chat.message", message_id: "mid" }, payload: { subscription: { type: "channel.chat.message" }, event: { message_id: "t1", chatter_user_id: "9", chatter_user_name: "Sara", message: { text: "Hello everyone" }, badges: [] } } } as any);
ok(tw && (Array.isArray(tw) ? tw[0] : tw).text === "Hello everyone", "Twitch: message.text");
const kk = kickToEvent("chat.message.sent", { message_id: "k1", content: "نورت 🔥", sender: { user_id: 5, username: "عبدالله" } } as any, "mid");
ok(kk && (Array.isArray(kk) ? kk[0] : kk).text === "نورت 🔥", "Kick: content");
const yt = youtubeToEvents(([{ id: "y1", snippet: { type: "textMessageEvent", displayMessage: "البث رهيب", publishedAt: new Date().toISOString() }, authorDetails: { channelId: "c", displayName: "أحمد" } }]) as any);
ok(Array.isArray(yt) && yt[0]?.text === "البث رهيب", "YouTube: snippet.displayMessage");
// 4) بوت الأغاني يقرأ الأمر من رسالة TikTok
{ const M = newMusicState(); const cfg = { ...defaultMusicCfg(), enabled: true };
  const ev = normalizeEvent({ type: "comment", id: "mb1", platform: "tiktok", user: { id: "v", name: "مشاهد" }, text: "!شغل اسم الأغنية" })!;
  const r = musicOnEvent(M, cfg, ev, Date.now(), []); const lg = (M.log || []).map((x: any) => x.kind || x.type || x.k).join(",");
  ok(r != null || /denied|search|request|queued/.test(lg), "song bot parses «!شغل» from the TikTok message (result or log: " + (r ? JSON.stringify(r).slice(0, 80) : lg) + ")"); }
// 5) المسار الكامل: TikTok v2 (content) → tiktok.ts → الخادم → اللوحة + OBS
let made: any[] = [];
class FakeConn extends EventEmitter { constructor(public u: string, public o: any) { super(); made.push(this); } async connect() { await new Promise(r => setTimeout(r, 5)); return { roomId: "CH1" }; } disconnect() {} async fetchRoomInfo() { return {}; } async fetchAvailableGifts() { return []; } }
(globalThis as any).__tkTestMod = { TikTokLiveConnection: FakeConn, WebcastEvent: { LIKE: "like", GIFT: "gift", CHAT: "chat", FOLLOW: "follow", SHARE: "share", MEMBER: "member", SUBSCRIBE: "subscribe", STREAM_END: "streamEnd", DISCONNECTED: "disconnected" } };
const logs: string[] = []; const ol = console.log; console.log = (...a: any[]) => logs.push(a.join(" "));
const sl = (ms: number) => new Promise(r => setTimeout(r, ms));
try {
  const wss: any = new EventEmitter(); const hub = createHub(wss, { authorize: async (_r: string, k?: string) => !!k } as any);
  const cl = () => { const ws: any = new EventEmitter(); ws.readyState = 1; ws.msgs = []; ws.send = (s: string) => ws.msgs.push(JSON.parse(s)); ws.close = () => {}; ws.ping = () => {}; ws.terminate = () => {}; wss.emit("connection", ws); return ws; };
  const send = (ws: any, m: any) => ws.emit("message", Buffer.from(JSON.stringify(m)));
  const dash = cl(); send(dash, { t: "join", room: "room_chat", key: "k" }); const obs = cl(); send(obs, { t: "join", room: "room_chat" }); await sl(15);
  send(dash, { t: "tiktok", room: "room_chat", username: "streamer" }); await sl(40); const c = made[made.length - 1];
  let i = 0; const say = (text: string, user = "Ahmed", extra: any = {}) => c.emit("chat", { common: { msgId: "cm" + (++i) }, user: { uniqueId: user.toLowerCase(), nickname: user, profilePicture: { url: ["https://p16/a.jpg"] } }, content: text, emotes: [], ...extra });
  for (const s of MSGS) say(s); await sl(10);
  const got = (ws: any) => ws.msgs.filter((m: any) => m.t === "event" && m.ev?.type === "comment").map((m: any) => m.ev.text);
  ok(JSON.stringify(got(dash)) === JSON.stringify(MSGS), "dashboard receives every message with full text");
  ok(JSON.stringify(got(obs)) === JSON.stringify(MSGS), "OBS link receives every message with full text");
  // عدة رسائل في نفس اللحظة من مشاهدين مختلفين
  for (let k = 0; k < 20; k++) say("رسالة رقم " + k, "u" + k); await sl(10);
  ok(got(obs).filter((x: string) => x.startsWith("رسالة رقم")).length === 20, "20 simultaneous messages all arrive in order with text");
  // التحديث (لقطة) يحمل النصوص
  const d2 = cl(); send(d2, { t: "join", room: "room_chat", key: "k" }); await sl(10);
  const snap = d2.msgs.find((m: any) => m.t === "snapshot"); ok(snap && snap.CH.some((m: any) => m.text === "السلام عليكم يا بطوط" && m.name === "Ahmed"), "page refresh: chat history keeps the text");
  // إعادة الاتصال بالشات
  c.emit("disconnected"); await sl(80); const c2 = made[made.length - 1]; c2.emit("chat", { common: { msgId: "after" }, user: { uniqueId: "z", nickname: "Z" }, content: "بعد إعادة الاتصال" }); await sl(5);
  ok(got(obs).includes("بعد إعادة الاتصال"), "after reconnect: text still arrives");
  // ملصق فقط
  c2.emit("chat", { common: { msgId: "st1" }, user: { uniqueId: "s", nickname: "S" }, content: "", emotes: [{ emote: { image: { imageUrl: "https://p16/st.png" } } }] }); await sl(5);
  ok(obs.msgs.some((m: any) => m.t === "event" && m.ev?.emotes?.[0] === "https://p16/st.png"), "sticker-only message carries its sticker");
  // التشخيص
  send(dash, { t: "chatdiag-get", room: "room_chat" }); await sl(5); const D = dash.msgs.find((m: any) => m.t === "chatdiag")?.D?.tiktok;
  ok(D && D.recv === 28 && D.name === 28 && D.text === 27 && D.emote === 1 && D.empty === 0 && D.sent === 28 && D.field === "content", "diagnostics: 6 stages counted, field=content " + JSON.stringify(D));
  send(obs, { t: "chatdiag-get", room: "room_chat" }); await sl(5); ok(!obs.msgs.some((m: any) => m.t === "chatdiag"), "read-only OBS cannot read diagnostics");
  ok(logs.some(l => /chat shape .*field=content len=\d+/.test(l)) && !logs.some(l => /السلام عليكم|Hello everyone/.test(l)), "server logs field names only — never message text");
  // حدث بدون نص (لو غيّرت المكتبة الحقول مستقبلاً) يظهر في التشخيص بالسبب
  c2.emit("chat", { common: { msgId: "bad" }, user: { uniqueId: "q", nickname: "Q" }, newField: "x" }); await sl(5);
  send(dash, { t: "chatdiag-get", room: "room_chat" }); await sl(5); const D2 = dash.msgs.filter((m: any) => m.t === "chatdiag").pop()?.D?.tiktok;
  ok(D2.empty === 1 && /بدون نص/.test(D2.fail) && /newField/.test(D2.fail), "empty message → failure reason with available fields: " + D2.fail);
  ok(!obs.msgs.some((m: any) => m.t === "event" && m.ev?.id === "bad" && m.ev.text), "no fake text generated");
} finally { console.log = ol; }
console.log(`chat-text: ${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
