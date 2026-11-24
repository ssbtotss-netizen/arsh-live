// اختبار تحمل الضغط (الإكسبلور) على المسار الحقيقي للخادم: TikTok (اتصال تجريبي معزول) → الطابور → المحرك → البث للواجهات
// كل الأحداث هنا تجريبية داخل غرف اختبار — لا تمس بيانات أي مستخدم
import { createHub } from "../arsh-live/src/server/live-hub.ts";
import { TK_BACKOFF } from "../arsh-live/src/server/tiktok.ts";
import { applyEvent } from "../arsh-live/src/engine/leaderboard.js";
import { EventEmitter } from "node:events";
let pass = 0, fail = 0; const W = (s: string) => process.stdout.write(s + "\n");
const ok = (c: any, m: string) => { c ? pass++ : (fail++, W("FAIL " + m)); };
TK_BACKOFF.dropped = [20, 20, 20];
const made: any[] = [];
class FakeConn extends EventEmitter { constructor(public u: string, public o: any) { super(); made.push(this); } async connect() { await new Promise(r => setTimeout(r, 5)); return { roomId: "EX-" + this.u, roomInfo: { user_count: 5000 } }; } disconnect() {} async fetchRoomInfo() { return {}; } async fetchAvailableGifts() { return []; } }
(globalThis as any).__tkTestMod = { TikTokLiveConnection: FakeConn, WebcastEvent: { LIKE: "like", GIFT: "gift", CHAT: "chat", FOLLOW: "follow", SHARE: "share", MEMBER: "member", SUBSCRIBE: "subscribe", ROOM_USER: "roomUser", STREAM_END: "streamEnd", DISCONNECTED: "disconnected" } };
const ol = console.log; console.log = () => {}; const oe = console.error; console.error = () => {};
const sl = (ms: number) => new Promise(r => setTimeout(r, ms));
const until = async (f: () => boolean, ms = 8000) => { const t = Date.now(); while (!f() && Date.now() - t < ms) await sl(10); return f(); };
let saves = 0; const savesBy: Record<string, number> = {};
const wss: any = new EventEmitter(); wss.clients = new Set(); const hub: any = createHub(wss, { authorize: async (_r: string, k?: string) => !!k, saveClock: async (id: string) => { saves++; savesBy[id] = (savesBy[id] || 0) + 1; }, saveLogs: async () => {} } as any);
const cl = (b = false) => { const ws: any = new EventEmitter(); ws.readyState = 1; ws.msgs = []; ws.frames = 0; ws.b = b; ws.send = (s: string) => { ws.frames++; const m = JSON.parse(s); if (m.t === "batch") ws.msgs.push(...m.ms); else ws.msgs.push(m); }; ws.close = () => {}; ws.ping = () => {}; ws.terminate = () => {}; wss.emit("connection", ws); return ws; };
const send = (ws: any, m: any) => ws.emit("message", Buffer.from(JSON.stringify(m)));
async function room(name: string) {
  const d = cl(); send(d, { t: "join", room: name, key: "k", b: 1 }); const obs = cl(true); send(obs, { t: "join", room: name, b: 1 }); const old = cl(); send(old, { t: "join", room: name }); await sl(20);
  send(d, { t: "tiktok", room: name, username: name }); await until(() => made.some(c => c.u === name)); await sl(30); const c = made.filter(x => x.u === name).pop();
  return { d, obs, old, c, R: () => hub.rooms.get(name) };
}
let uid = 0; const U = () => { uid++; return { uniqueId: "u" + uid, nickname: "متابع " + uid, userId: String(uid) }; };
const P = (x: any) => x.R().P;
const evCount = (ws: any, ty: string) => ws.msgs.filter((m: any) => m.t === "event" && m.ev?.type === ty).length;

// 1) 100 / 500 / 1000 متابعة متتالية — كلها تُحتسب، آخر متابع صحيح
{ const A = await room("room_follow"); let base = 0;
  for (const n of [100, 500, 1000]) {
    const t0 = performance.now(); let last = ""; for (let i = 0; i < n; i++) { const u = U(); last = u.nickname; A.c.emit("follow", { user: u, common: { msgId: "f" + uid } }); }
    await until(() => A.R().D.tot.follows === base + n); const ms = performance.now() - t0; base += n;
    ok(A.R().D.tot.follows === base, `${n} follows in a burst → all counted (${A.R().D.tot.follows}/${base})`);
    ok(A.R().D.recentFollows?.[0]?.name === last || JSON.stringify(A.R().D.recentFollows?.[0] || {}).includes(last), `${n} follows → latest follower is the real last one (${last})`);
    W(`  ${n} follows processed in ${ms.toFixed(0)}ms`);
  }
  await until(() => evCount(A.obs, "follow") === 1600, 3000);
  ok(evCount(A.obs, "follow") === 1600 && evCount(A.old, "follow") === 1600, "OBS (batch) and old-version links both received every follow event");
  ok(A.obs.frames < 1600 / 5, `batching: ${A.obs.frames} WebSocket frames for 1,600 events (old link: ${A.old.frames})`);
}
// 2) 10,000 تكبيس + ميزانية الوقت (الخادم لا يتجمد)
{ const A = await room("room_likes"); let maxGap = 0, last = performance.now(); const iv = setInterval(() => { const n = performance.now(); maxGap = Math.max(maxGap, n - last); last = n; }, 5);
  const t0 = performance.now(); for (let i = 0; i < 10000; i++) A.c.emit("like", { user: U(), likeCount: 15, totalLikeCount: 0, common: { msgId: "l" + i } });
  await until(() => A.R().D.tot.likes === 150000, 15000); const ms = performance.now() - t0; clearInterval(iv);
  ok(A.R().D.tot.likes === 150000, `10,000 like events (×15) → exactly 150,000 taps (${A.R().D.tot.likes})`);
  W(`  10,000 likes processed in ${ms.toFixed(0)}ms (${(10000 / ms * 1000) | 0}/s), longest server pause while processing ${maxGap.toFixed(0)}ms`);
  ok(P(A).failed === 0 && P(A).done >= 10000, "no failed events");
  // نفس المعرفات مرة ثانية (إعادة إرسال) → لا احتساب مزدوج
  const dup0 = P(A).dup; for (let i = 9500; i < 10000; i++) A.c.emit("like", { user: { uniqueId: "x" }, likeCount: 15, common: { msgId: "l" + i } }); for (let i = 0; i < 500; i++) A.c.emit("like", { user: { uniqueId: "x" }, likeCount: 15, common: { msgId: "l" + i } }); await sl(50);
  ok(A.R().D.tot.likes === 150000 && P(A).dup - dup0 === 1000, `1,000 resent (oldest + newest) like events → 0 double counted, ${P(A).dup - dup0} marked duplicate (likes still ${A.R().D.tot.likes})`);
}
// 3) 100 هدية متتالية + دونيشن أثناء كثافة المتابعات (أولوية قصوى)
{ const A = await room("room_gifts");
  for (let i = 0; i < 100; i++) A.c.emit("gift", { user: U(), giftId: 5655, repeatCount: 1, repeatEnd: 1, groupId: "g" + i, gift: { name: "Rose", diamondCount: 1, type: 1 }, common: { msgId: "g" + i } });
  await until(() => A.R().C.stats?.p?.tiktok?.coins === 100);
  ok(A.R().C.stats?.p?.tiktok?.coins === 100, `100 gifts → 100 coins counted (${A.R().C.stats?.p?.tiktok?.coins})`);
  for (let i = 0; i < 6000; i++) A.c.emit("follow", { user: U(), common: { msgId: "ff" + i } });
  hub.dispatch("room_gifts", { type: "donation", id: "don-1", amount: 25, currency: "USD", name: "داعم", user: { id: "d1", name: "داعم" } });
  const t0 = Date.now(); await until(() => (A.R().DN?.list || []).some((d: any) => d.id === "don-1"), 5000); const donAt = Date.now() - t0;
  const followsWhenDon = A.R().D.tot.follows;
  await until(() => A.R().D.tot.follows === 6000, 10000);
  ok((A.R().DN?.list || []).some((d: any) => d.id === "don-1"), "donation during a 6,000-follow flood → recorded");
  ok(followsWhenDon < 6000, `donation jumped the queue (processed when ${followsWhenDon}/6000 follows were done, after ${donAt}ms)`);
  ok(A.R().D.tot.follows === 6000, "…and every follow still counted (6,000)");
  await until(() => A.d.msgs.some((m: any) => m.t === "event" && m.ev?.id === "don-1"), 2000); ok(A.d.msgs.some((m: any) => m.t === "event" && m.ev?.id === "don-1"), "donation reached the dashboard");
}
// 4) تعليقات + هدايا + تكبيس معاً — والأرقام عند العميل = الخادم (بما فيها عميل انضم وسط الضغط)
{ const A = await room("room_mix"); let late: any = null;
  for (let i = 0; i < 3000; i++) { const k = i % 3; const u = U();
    if (k === 0) A.c.emit("chat", { user: u, content: "رسالة " + i, common: { msgId: "c" + i } });
    else if (k === 1) A.c.emit("like", { user: u, likeCount: 5, common: { msgId: "lm" + i } });
    else A.c.emit("gift", { user: u, giftId: 5655, repeatCount: 1, repeatEnd: 1, groupId: "gm" + i, gift: { name: "Rose", diamondCount: 1, type: 1 }, common: { msgId: "gm" + i } });
    if (i === 1500) { late = cl(true); send(late, { t: "join", room: "room_mix", b: 1 }); } }
  await until(() => P(A).done >= 3000 && !A.R().pumping, 10000); await sl(250);
  const S = A.R().D.tot; ok(S.likes === 1000 * 5 && S.comments === 1000, `mixed 3,000 events → likes ${S.likes}/5000, comments ${S.comments}/1000`);
  // عميل OBS انضم في منتصف الضغط: لقطة + الدفعات اللاحقة = نفس أرقام الخادم (لا مفقود ولا مكرر)
  const snap = late.msgs.find((m: any) => m.t === "snapshot"); const D = JSON.parse(JSON.stringify(snap.D)), H: any[] = [];
  const after = late.msgs.slice(late.msgs.indexOf(snap) + 1).filter((m: any) => m.t === "event");
  for (const m of after) applyEvent(D, H, m.ev);
  ok(D.tot.likes === S.likes && D.tot.comments === S.comments && D.tot.gifts === S.gifts, `OBS joining mid-flood ends with the same totals as the server (likes ${D.tot.likes}=${S.likes}, gifts ${D.tot.gifts}=${S.gifts})`);
  const ids = A.obs.msgs.filter((m: any) => m.t === "event").map((m: any) => m.ev.id); ok(new Set(ids).size === ids.length, "no event delivered twice to OBS");
}
// 5) عدة بثوث لصناع محتوى مختلفين في نفس الوقت — معزولة
{ const rs = await Promise.all(["room_c1", "room_c2", "room_c3"].map(room));
  rs.forEach((A, j) => { for (let i = 0; i < 2000; i++) A.c.emit("like", { user: U(), likeCount: j + 1, common: { msgId: `r${j}-${i}` } }); });
  await until(() => rs.every((A, j) => A.R().D.tot.likes === 2000 * (j + 1)), 10000);
  ok(rs.every((A, j) => A.R().D.tot.likes === 2000 * (j + 1)), `3 creators at once → each room exact & isolated (${rs.map(A => A.R().D.tot.likes).join("/")})`);
}
// 6) انقطاع الاتصال أثناء الضغط ثم إعادة الاتصال — لا تصفير
{ const A = await room("room_drop");
  for (let i = 0; i < 2000; i++) A.c.emit("like", { user: U(), likeCount: 10, common: { msgId: "d" + i } });
  A.c.emit("disconnected"); await until(() => A.R().D.tot.likes === 20000, 5000);
  const before = A.R().D.tot.likes; await until(() => made.filter(x => x.u === "room_drop").length >= 2, 6000); await sl(60);
  const c2 = made.filter(x => x.u === "room_drop").pop();
  ok(c2 !== A.c, "automatic reconnect after the drop (new connection, old one closed)");
  ok(A.R().D.tot.likes === before && before === 20000, `reconnect keeps the stream data (taps ${A.R().D.tot.likes})`);
  for (let i = 0; i < 1000; i++) c2.emit("like", { user: U(), likeCount: 10, common: { msgId: "d2-" + i } });
  A.c.emit("like", { user: U(), likeCount: 999, common: { msgId: "ghost" } }); // المستمع القديم أُزيل/مُعطّل
  await until(() => A.R().D.tot.likes === 30000, 5000);
  ok(A.R().D.tot.likes === 30000, `events after reconnect counted; old connection's events ignored (taps ${A.R().D.tot.likes})`);
}
// 7) فشل حدث واحد لا يوقف البقية
{ const A = await room("room_fail"); const bad: any = { type: "like", id: "bad1", platform: "tiktok", count: 1 }; Object.defineProperty(bad, "user", { get() { throw new Error("broken event"); } });
  hub.dispatch("room_fail", bad); for (let i = 0; i < 200; i++) A.c.emit("like", { user: U(), likeCount: 1, common: { msgId: "ok" + i } }); await sl(50);
  ok(P(A).failed === 1 && A.R().D.tot.likes === 200, `one broken event → failed=1, the next 200 still counted (${A.R().D.tot.likes})`);
  ok(/broken event/.test(P(A).lastErr), "failure reason recorded for the monitor");
}
// 8) وضع الإكسبلور التلقائي + لوحة المراقبة (للوحة فقط) + الحفظ لا يتكرر كل ثانية
{ const A = await room("room_explore"); const s0 = savesBy["room_explore"] || 0; const t0s = Date.now();
  const iv = setInterval(() => { for (let i = 0; i < 40; i++) A.c.emit("like", { user: U(), likeCount: 1, common: { msgId: "e" + uid } }); }, 250); // ~160 حدث/ث
  await until(() => P(A).explore, 6000); ok(P(A).explore, `≥60 events/s for 2 s → Explore Mode on automatically (rate ${P(A).rate}/s)`);
  ok(A.obs.msgs.some((m: any) => m.t === "perf" && m.explore === true), "OBS links told to lighten heavy effects");
  await sl(2200); const pm = A.d.msgs.filter((m: any) => m.t === "perf" && m.P).pop();
  ok(pm && pm.P.recv > 0 && pm.P.rate > 0 && pm.G.heapMB > 0 && pm.warn.some((w: string) => /الإكسبلور/.test(w)), "dashboard monitor gets real numbers (events/s, memory, warning)");
  ok(!A.obs.msgs.some((m: any) => m.t === "perf" && m.P), "monitor numbers are not sent to OBS links");
  const likesBefore = A.R().D.tot.likes; clearInterval(iv); const sentTotal = P(A).recv;
  { const n = (savesBy["room_explore"] || 0) - s0, sec = (Date.now() - t0s) / 1000; ok(n <= Math.ceil(sec / 3) + 1, `saves throttled under load (${n} saves in ${sec.toFixed(0)} s — at most one per 3 s)`); }
  await until(() => !P(A).explore, 16000); ok(!P(A).explore, "quiet again → back to normal mode automatically");
  ok(A.obs.msgs.some((m: any) => m.t === "perf" && m.explore === false), "OBS links told to restore normal effects");
  ok(A.R().D.tot.likes === P(A).done && P(A).done === sentTotal && likesBefore <= A.R().D.tot.likes, `explore mode dropped nothing (${A.R().D.tot.likes} taps = ${sentTotal} events received)`);
}
// 9) تشغيل طويل: 100,000 حدث على دفعات — الذاكرة مستقرة
{ const A = await room("room_long"); [A.d, A.obs, A.old].forEach((w: any) => { const s = w.send; w.send = (x: string) => { s(x); w.msgs.length = 0; }; }); if ((globalThis as any).gc) (globalThis as any).gc(); const h0 = process.memoryUsage().heapUsed;
  for (let b = 0; b < 50; b++) { for (let i = 0; i < 2000; i++) A.c.emit(i % 2 ? "like" : "member", { user: { uniqueId: "r" + (i % 3000), nickname: "مشاهد", userId: "r" + (i % 3000) }, likeCount: 1, common: { msgId: `lg${b}-${i}` } }); await sl(20); }
  await until(() => P(A).done >= 100000, 20000); if ((globalThis as any).gc) (globalThis as any).gc(); await sl(100);
  const grow = (process.memoryUsage().heapUsed - h0) / 1048576;
  ok(P(A).done >= 100000 && A.R().D.tot.likes === 50000, `100,000 events processed (taps ${A.R().D.tot.likes}/50,000)`);
  ok(grow < 150, `memory growth after 100k events: ${grow.toFixed(0)} MB`); W(`  long run: heap +${grow.toFixed(0)}MB, lag avg ${P(A).lagAvg}ms max ${P(A).lagMax}ms`);
}
console.log = ol; console.error = oe;
console.log(`explore-stress: ${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
