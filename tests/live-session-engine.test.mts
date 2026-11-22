// محرك الجلسات: قرارات الجلسة (مع/بدون roomId)، وما يُصفّر وما لا يُصفّر
import { newRoom, roomEvent, roomSessionConnect, roomSessionEnd, roomSessionOp, roomClockOp } from "../arsh-live/src/engine/room.js";
import { liveState, sessDecide, SESS_NOID_GAP_MS } from "../arsh-live/src/engine/session.js";
import { newActState } from "../arsh-live/src/engine/actions.js";
let pass = 0, fail = 0; const ok = (c: any, m: string) => { c ? pass++ : (fail++, console.log("FAIL", m)); };
let t = Date.parse("2026-11-22T12:00:00Z");
const like = (R: any, u: string, n: number, lr?: string) => roomEvent(R, { type: "like", id: "l" + Math.random(), user: { id: u, name: u }, count: n, ...(lr ? { lr } : {}) }, t);
// قرارات
{ const L: any = liveState({} as any);
  ok(sessDecide(L, "A", t).act === "first", "first session");
  Object.assign(L, { sid: "s1", roomId: "A", startedAt: t, endedAt: null });
  ok(sessDecide(L, "A", t).act === "same", "same roomId while open → same");
  ok(sessDecide(L, "B", t).act === "new", "different roomId → new");
  L.endedAt = t; ok(sessDecide(L, "A", t + 60_000).act === "resume", "same roomId after an end (false end) → resume, no reset");
  // بدون معرّف موثوق
  L.roomId = null; L.endedAt = null; ok(sessDecide(L, null, t).act === "same", "no id, session open → same (disconnect never resets)");
  L.endedAt = t; ok(sessDecide(L, null, t + 60_000).act === "resume", "no id, ended 1 min ago → resume (could be the same stream)");
  ok(sessDecide(L, null, t + SESS_NOID_GAP_MS + 1).act === "new", "no id, ended ≥5 min ago → new stream"); }
// ما يُصفّر
const R: any = newRoom();
roomClockOp(R, { target: "subathon", op: "config", config: { initialMs: 3600_000, rules: { list: [{ id: "rl", kind: "likes", enabled: true, dir: 1, every: 1000, ms: 60_000, cooldownMs: 0, userCooldownMs: 0, perMin: 0, maxMs: 0 }] } } }, t);
roomClockOp(R, { target: "subathon", op: "start" }, t);
roomClockOp(R, { target: "battle", op: "config", config: { likePts: 10 } }, t);
R.botCfg = { actions: [{ id: "a1", enabled: true, trigger: { type: "goal", metric: "likes", target: 500 }, actions: [] }, { id: "a2", enabled: true, trigger: { type: "likes", every: 300 }, actions: [] }] };
R.ACT = Object.assign(newActState(), { acc: { a2: 250 }, goalsHit: { a1: 500 } }); R.AL = { tl: 900, ul: { x: 900 } };
roomSessionConnect(R, "A", t);
like(R, "x", 900, "A"); like(R, "y", 300, "A"); roomEvent(R, { type: "gift", id: "g1", user: { id: "y", name: "y" }, gift: "Rose", giftId: 5655, diamonds: 1, value: 5, count: 5, lr: "A" }, t);
ok(R.D.tot.likes === 1200 && R.C.latest.like, "taps + last tapper recorded");
const endsBefore = R.C.subathon.endsAt, acc = R.C.subathon.rstate.acc.rl; ok(acc === 200, "subathon tap remainder 200 before reset");
t += 3600_000; roomSessionEnd(R, t, "stream_end"); t += 7200_000;
R.ACT.acc.a2 = 250; R.ACT.goalsHit.a1 = 500; R.AL = { tl: 1200, ul: { x: 900 } };
const r = roomSessionConnect(R, "B", t);
ok(r.act === "new" && R.D.tot.likes === 0 && !R.C.latest.like, "new stream: taps + last tapper reset");
ok(R.C.subathon.rstate.acc.rl === undefined && R.C.subathon.endsAt === endsBefore, "subathon: old tap remainder dropped, remaining time untouched");
ok(R.C.battle.likePts === 10 && R.C.battle.teams.every((x: any) => !x.score), "tap challenge: scores reset, settings kept");
ok(R.ACT.goalsHit.a1 === undefined && R.ACT.acc.a2 === undefined, "tap goal stages re-armed (no stale progress)");
ok(R.AL.tl === 0 && Object.keys(R.AL.ul).length === 0, "tap milestone alerts restart (old ones not replayed)");
ok(R.D.tot.gifts === 5 && R.D.tot.giftCount === 5, "gifts not reset by default (only taps)");
ok(liveState(R.C).history[0].likes === 1200 && liveState(R.C).history[0].topLikers[0].name === "x", "previous stream stats saved");
// اختيار تصفير الهدايا أيضاً
roomSessionOp(R, { op: "config", config: { scopes: { gifts: true } } }, t); roomSessionConnect(R, "C", t + 10);
ok(R.D.tot.gifts === 0 && Object.keys(R.D.gifts).length === 0, "gifts reset when the creator opts in");
// بدون حفظ الإحصائيات
roomSessionOp(R, { op: "config", config: { keep: false } }, t); const h = liveState(R.C).history.length; roomSessionConnect(R, "D", t + 20);
ok(liveState(R.C).history.length === h, "keep stats off → nothing archived");
// حدث متأخر بمعرّف قديم
like(R, "z", 50, "C"); ok(R.D.tot.likes === 0, "stale event (old roomId) ignored"); like(R, "z", 50, "D"); ok(R.D.tot.likes === 50, "current roomId counted");
console.log(`live-session-engine: ${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
