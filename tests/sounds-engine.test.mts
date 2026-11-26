// مكتبة الأصوات — المحرك: ربط الأحداث، الدونيشن مقابل الهدايا، التكبيس بالجلسة، الأوضاع، منع التكرار، الطابور
import { sndCfg, sndNewState, sndOnEvent, sndOnLogs, sndSessionReset, sndQueue, sndQueuePush, sndQueueNext, sndUrl, sndUsedRefs } from "../arsh-live/src/engine/sounds.js";
import { newRoom, roomEvent, roomBots, roomClockOp, roomSessionStart } from "../arsh-live/src/engine/room.js";
let pass = 0, fail = 0; const ok = (c: any, m: string) => { c ? pass++ : (fail++, process.stdout.write("FAIL " + m + "\n")); };
const S = (src: string) => ({ src: "lib:" + src });
const cfg = sndCfg({ rules: [
  { id: "fo", ev: "follow", sounds: [S("follow-01"), S("follow-02"), S("follow-03")], mode: "norepeat", cool: 0 },
  { id: "lv", ev: "love", sounds: [S("gift-01")] },
  { id: "lion", ev: "gift", cond: { giftId: "6369", name: "Lion" }, sounds: [S("crown-01")] },
  { id: "rose", ev: "gift", cond: { name: "Rose" }, sounds: [S("gift-02")] },
  { id: "anyg", ev: "gift", cond: { any: true }, sounds: [S("gift-03")] },
  ...[5, 20, 50, 100, 200, 500].map(n => ({ id: "d" + n, ev: "donation", cond: { min: n, cur: "USD" }, sounds: [S("tier-" + n === "tier-20" ? "tier-5" : "tier-" + n)] })),
  { id: "t1k", ev: "taps", cond: { n: 1000 }, sounds: [S("taps-1000")] }, { id: "t5k", ev: "taps", cond: { n: 5000 }, sounds: [S("taps-5000")] },
  { id: "sub", ev: "sub", sounds: [S("sub-01")] }, { id: "sh", ev: "share", sounds: [S("share-11")] }, { id: "jn", ev: "join", sounds: [S("join-11")], cool: 5 },
  { id: "sa", ev: "subathon", cond: { dir: "add" }, sounds: [S("strong-01")] }, { id: "sr", ev: "subathon", cond: { dir: "sub" }, sounds: [S("lose-11")] },
  { id: "gl", ev: "goal", cond: { kind: "any" }, sounds: [S("goal-01")] } ] });
const st = sndNewState(); let n = 0; const now = 1_800_000_000_000;
const E = (o: any, ctx: any = {}) => sndOnEvent(cfg, st, { id: "e" + (++n), platform: "tiktok", user: { id: "u", name: "u" }, ...o }, now + n * 10000, ctx);
// المتابعة + الوضع: بدون تكرار متتالٍ
{ let prev = "", rep = 0; for (let i = 0; i < 40; i++) { const r = E({ type: "follow" }); ok(r.length === 1 && r[0].ev === "follow", "follow → one sound"); if (r[0].s.src === prev) rep++; prev = r[0].s.src; } ok(rep === 0, `norepeat: never the same sound twice in a row (${rep})`); }
// أحبني ≠ أي هدية
{ const a = E({ type: "gift", gift: "Heart Me", giftId: 7934, value: 1 }); ok(a.length === 1 && a[0].rule === "lv", "«أحبني» (Heart Me) → love sound");
  const b = E({ type: "gift", gift: "أحبني", value: 1 }); ok(b[0]?.rule === "lv", "Arabic name «أحبني» → love sound");
  const c = E({ type: "gift", gift: "Lion", giftId: 6369, value: 29999 }); ok(c[0]?.rule === "lion", "specific gift (Lion by id) → its sound");
  const d = E({ type: "gift", gift: "Rose", giftId: 5655, value: 1 }); ok(d[0]?.rule === "rose", "specific gift (Rose by name)");
  const e = E({ type: "gift", gift: "Galaxy", giftId: 1, value: 1000 }); ok(e[0]?.rule === "anyg", "any other gift → «أي هدية أخرى» sound");
  ok(c[0].prio > d[0].prio, "bigger gift → higher priority"); }
// الدونيشن: أعلى مستوى يصل له المبلغ — مستوى واحد — والكوينز ليست دولار
{ const tier = (amt: number, extra: any = {}) => E({ type: "donation", amount: amt, currency: "USD", verified: true, ...extra })[0]?.rule || "";
  ok(tier(5) === "d5" && tier(19.99) === "d5" && tier(20) === "d20" && tier(75) === "d50" && tier(100) === "d100" && tier(250) === "d200" && tier(9999) === "d500", "donation tiers 5/20/50/100/200/500 → highest reached, one tier only");
  ok(tier(3) === "", "below the lowest tier → no sound");
  ok(tier(100, { verified: false }) === "", "unverified donation → no sound (anti-fake)");
  ok(E({ type: "gift", gift: "Universe", value: 44999 })[0]?.ev === "gift", "TikTok coins (Universe 44,999) never treated as $ donation");
  ok(tier(150, { currency: "SAR" }) === "d20", "SAR converted at the official peg (150 SAR = $40 → $20 tier)");
  ok(tier(5000, { currency: "EGP" }) === "", "currency without a trusted rate → no guessed tier"); }
// التكبيس: مرة لكل بث، ولا تعاد عند بث جديد إلا بعد الوصول مجدداً
{ const lk = (count: number, total: number) => E({ type: "like", count }, { totalLikes: total });
  ok(lk(500, 500).length === 0, "500 taps → nothing yet"); const a = lk(600, 1100); ok(a.length === 1 && a[0].rule === "t1k", "crossing 1,000 → 1k sound");
  ok(lk(100, 1200).length === 0, "still above 1,000 → not repeated");
  const b = lk(5000, 6200); ok(b.length === 1 && b[0].rule === "t5k", "crossing 5,000 → 5k sound (once)");
  sndSessionReset(st); ok(lk(100, 100).length === 0, "new stream: stage sounds of the previous stream are not replayed");
  ok(lk(1000, 1100)[0]?.rule === "t1k", "new stream: 1,000 again → plays again"); }
// نفس الحدث مرتين ← صوت واحد
{ const ev = { id: "dup-1", type: "follow", platform: "tiktok", user: { id: "z" } }; const a = sndOnEvent(cfg, st, ev, now + 9e8), b = sndOnEvent(cfg, st, ev, now + 9e8 + 5000); ok(a.length === 1 && b.length === 0, "same event id twice → sound once"); }
// مدة الانتظار + الإكسبلور: تجميع الأصوات الخفيفة فقط — الدعم لا يُختصر
{ const t0 = now + 1e9; let played = 0; for (let i = 0; i < 100; i++) played += sndOnEvent(cfg, st, { id: "j" + i, type: "join", user: { id: "j" + i } }, t0 + i * 100).length;
  ok(played === 2, `join with 5 s wait: 100 joins in 10 s → ${played} sounds (not 100)`);
  let fo = 0; for (let i = 0; i < 100; i++) fo += sndOnEvent(cfg, st, { id: "fx" + i, type: "follow", user: { id: "f" + i } }, t0 + i * 50, { explore: true }).length;
  ok(fo <= 3, `Explore Mode: 100 follows in 5 s → ${fo} follow sounds (merged)`);
  const last = sndOnEvent(cfg, st, { id: "fx-last", type: "follow", user: { id: "fl" } }, t0 + 9000, { explore: true });
  ok(last[0]?.merged > 0, `merged count carried with the next follow sound (+${last[0]?.merged})`);
  let dn = 0; for (let i = 0; i < 5; i++) dn += sndOnEvent(cfg, st, { id: "dd" + i, type: "donation", amount: 50, currency: "USD", verified: true }, t0 + i * 10, { explore: true }).length;
  ok(dn === 5, "Explore Mode never shortens donation sounds (5/5)"); }
// المشاركة / الاشتراك / السبثون / الهدف
{ ok(E({ type: "share" })[0]?.rule === "sh" && E({ type: "subscribe" })[0]?.rule === "sub", "share & subscribe sounds");
  const L = sndOnLogs(cfg, st, [{ subathonId: "s1", seq: 1, deltaMs: 30000 }, { subathonId: "s1", seq: 2, deltaMs: -10000 }, { subathonId: "s1", seq: 3, deltaMs: 600000, reason: "تحقيق الهدف (10000)" }], now);
  ok(L.map(x => x.rule).join(",") === "sa,sr,sa,gl", "subathon: time added / removed / goal reached (" + L.map(x => x.rule).join(",") + ")");
  ok(sndOnLogs(cfg, st, [{ subathonId: "s1", seq: 1, deltaMs: 30000 }], now).length === 0, "same subathon log twice → once");
  const g = E({ type: "like", count: 1 }, { totalLikes: 999999, goals: [{ id: "lk:w1:5000", kind: "likes", target: 5000, value: 6000 }] }); ok(g.some(x => x.rule === "gl"), "likes goal reached → goal sound");
  ok(!E({ type: "like", count: 1 }, { totalLikes: 999999, goals: [{ id: "lk:w1:5000", kind: "likes", target: 5000, value: 7000 }] }).some(x => x.rule === "gl"), "goal sound once per stream"); }
// طابور رابط OBS: أولوية + حد أعلى (لا يُحذف دعم لصالح فولو) + منع تكرار
{ const Q = sndQueue(); for (let i = 0; i < 30; i++) sndQueuePush(Q, { id: "f" + i, prio: 20 }, 10); sndQueuePush(Q, { id: "don", prio: 95 }, 10); sndQueuePush(Q, { id: "don", prio: 95 }, 10);
  ok(Q.q.length === 10 && Q.q[0].id === "don", "queue capped at 10, donation first"); ok(Q.q.filter(x => x.id === "don").length === 1, "same item twice → queued once");
  ok(sndQueueNext(Q).id === "don" && Q.dropped === 21, "light sounds trimmed (21), support kept"); }
ok(sndUrl("lib:follow-01", {}) === "/sounds/lib/follow-01.mp3" && sndUrl("up:abcdefgh12", { "up:abcdefgh12": "https://x/s" }) === "https://x/s" && sndUrl("up:zzzzzzzz99", {}) === "", "file URLs: library public, uploads only via signed link");
ok(sndUsedRefs(cfg).includes("lib:crown-01"), "used sounds list");
// عبر المحرك الحقيقي (roomEvent): الصوت يخرج كرسالة snd، والإيقاف بدون إعدادات، والتشغيل اليدوي
{ const R: any = newRoom(); roomBots(R, { sounds: { rules: [{ id: "fo", ev: "follow", sounds: [S("follow-01")] }, { id: "t1k", ev: "taps", cond: { n: 1000 }, sounds: [S("taps-1000")] }] } }, {});
  const r1 = roomEvent(R, { type: "follow", id: "rf1", platform: "tiktok", user: { id: "a", name: "A" } }, now); const m = r1.out.find((x: any) => x.t === "snd");
  ok(m && m.items[0].s.src === "lib:follow-01", "room engine: follow → {t:snd} for OBS");
  ok(!roomEvent(R, { type: "follow", id: "rf1", platform: "tiktok", user: { id: "a" } }, now).out.some((x: any) => x.t === "snd"), "room engine: duplicate event → no second sound");
  roomEvent(R, { type: "like", id: "rl1", platform: "tiktok", user: { id: "a" }, count: 1200 }, now);
  const p = roomClockOp(R, { target: "sounds", op: "play", s: { src: "lib:rimshot", vol: 70 } }, now); ok(p.out[0]?.t === "snd" && p.out[0].items[0].manual && p.out[0].items[0].s.vol === 70, "manual play from the soundboard");
  ok(roomClockOp(R, { target: "sounds", op: "play", s: { src: "javascript:alert(1)" } }, now).out.length === 0, "invalid sound source rejected");
  ok(roomClockOp(R, { target: "sounds", op: "stopall" }, now).out[0]?.stop === "all", "stop all sounds");
  roomSessionStart(R, now + 1000, { source: "test" }); const again = roomEvent(R, { type: "like", id: "rl2", platform: "tiktok", user: { id: "a" }, count: 1100 }, now + 2000);
  ok(again.out.some((x: any) => x.t === "snd" && x.items.some((i: any) => i.rule === "t1k")), "new stream session → 1,000-tap sound can play again");
  roomBots(R, { sounds: { on: false, rules: [{ id: "fo", ev: "follow", sounds: [S("follow-01")] }] } }, {});
  ok(!roomEvent(R, { type: "follow", id: "rf9", platform: "tiktok", user: { id: "b" } }, now).out.some((x: any) => x.t === "snd"), "library switched off in settings → no sounds"); }
console.log(`sounds-engine: ${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
