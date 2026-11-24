// مراقبة أداء البث المباشر (Live Performance Monitor) + وضع الإكسبلور
// أرقام حقيقية من الخادم فقط: استقبال/معالجة/معلق/مكرر/فاشل/تأخير، الذاكرة، المعالج، حلقة الأحداث، قاعدة البيانات
import { monitorEventLoopDelay } from "node:perf_hooks";

/** الأولوية: 0 قصوى (دعم مالي/هدايا) · 1 عالية (متابعة/اشتراك) · 2 عادية (تكبيس/تعليق/مشاركة/دخول) */
const P0 = new Set(["donation", "donation_refund", "gift", "superchat", "supersticker", "cheer", "member_gift"]);
const P1 = new Set(["follow", "subscribe", "resub", "subgift", "raid", "member"]);
export const perfPrio = (type: string) => (P0.has(type) ? 0 : P1.has(type) ? 1 : 2);

/** وضع الإكسبلور: يتفعل تلقائياً عند الضغط ويعود للطبيعي عند انخفاضه — لا يتجاهل أي حدث */
export const EXPLORE = { onRate: 60, onSec: 2, offRate: 20, offSec: 12, onPending: 300 };

export type RoomPerf = ReturnType<typeof perfNew>;
export function perfNew() {
  return { recv: 0, done: 0, dup: 0, failed: 0, win: 0, rate: 0, peak: 0, pending: 0, maxPending: 0, lagSum: 0, lagN: 0, lagMax: 0, lagAvg: 0, lagWinMax: 0,
    explore: false, exploreAt: 0, exploreN: 0, hot: 0, cool: 0, hist: [] as number[], lastErr: "", lastErrAt: 0, by: {} as Record<string, number>, sent: 0, batches: 0, since: Date.now() };
}
/** نبضة كل ثانية: المعدل + قرار وضع الإكسبلور. يعيد true عند تغيّر الوضع */
export function perfTick(P: RoomPerf, pending: number, now: number) {
  P.rate = P.win; P.win = 0; P.peak = Math.max(P.peak, P.rate); P.hist.push(P.rate); if (P.hist.length > 60) P.hist.shift();
  P.pending = pending; P.lagAvg = P.lagN ? Math.round(P.lagSum / P.lagN) : 0; P.lagSum = 0; P.lagN = 0; const lagW = P.lagWinMax; P.lagWinMax = 0;
  const was = P.explore;
  if (!P.explore) { P.hot = P.rate >= EXPLORE.onRate ? P.hot + 1 : 0; if (P.hot >= EXPLORE.onSec || pending >= EXPLORE.onPending || lagW > 2000) { P.explore = true; P.exploreAt = now; P.exploreN++; P.cool = 0; } }
  else { P.cool = P.rate < EXPLORE.offRate && pending < 20 ? P.cool + 1 : 0; if (P.cool >= EXPLORE.offSec) { P.explore = false; P.hot = 0; } }
  return was !== P.explore;
}
export const perfLag = (P: RoomPerf, ms: number) => { P.lagSum += ms; P.lagN++; if (ms > P.lagMax) P.lagMax = ms; if (ms > P.lagWinMax) P.lagWinMax = ms; };

/* ---- مقاييس الخادم العامة ---- */
const eld = (() => { try { const h = monitorEventLoopDelay({ resolution: 20 }); h.enable(); return h; } catch { return null; } })();
export const DB = { ok: 0, fail: 0, lastMs: 0, maxMs: 0, at: 0, err: "", errAt: 0, inFlight: 0 };
/** يقيس عملية حفظ في قاعدة البيانات (المدة/الفشل) دون أن يغيّر نتيجتها */
export function dbTimed<T>(p: Promise<T> | undefined): Promise<T | undefined> {
  if (!p) return Promise.resolve(undefined); const t0 = performance.now(); DB.inFlight++;
  return p.then(v => { const ms = Math.round(performance.now() - t0); DB.ok++; DB.lastMs = ms; DB.maxMs = Math.max(DB.maxMs, ms); DB.at = Date.now(); return v; },
    e => { DB.fail++; DB.err = String(e?.message || e).slice(0, 200); DB.errAt = Date.now(); throw e; }).finally(() => { DB.inFlight--; });
}
let cpuPrev = process.cpuUsage(), cpuAt = performance.now(), cpuPct = 0;
export function perfGlobal() {
  const now = performance.now(); if (now - cpuAt > 900) { const u = process.cpuUsage(cpuPrev); cpuPct = Math.round(((u.user + u.system) / 1000) / (now - cpuAt) * 100); cpuPrev = process.cpuUsage(); cpuAt = now; }
  const m = process.memoryUsage();
  const loop = eld ? { mean: Math.round(eld.mean / 1e6), p99: Math.round(eld.percentile(99) / 1e6), max: Math.round(eld.max / 1e6) } : null; eld?.reset();
  return { heapMB: Math.round(m.heapUsed / 1048576), rssMB: Math.round(m.rss / 1048576), cpu: cpuPct, loop, db: { ...DB }, up: Math.round(process.uptime()) };
}
/** ما يُرسل للوحة التحكم (أرقام فقط — لا نصوص محادثات ولا بيانات مستخدمين) */
export function perfPublic(P: RoomPerf, conn: { state: string; live: boolean; text?: string }, clients: { overlays: number; dashboards: number }, G: ReturnType<typeof perfGlobal>, now: number) {
  const warn: string[] = [];
  if (P.explore) warn.push(`ضغط عالٍ (${P.rate} حدث/ث) — وضع الإكسبلور مفعّل تلقائياً`);
  if (P.pending > 100) warn.push(`أحداث في الانتظار: ${P.pending}`);
  if (P.lagAvg > 1000) warn.push(`تأخير المعالجة ${(P.lagAvg / 1000).toFixed(1)} ث`);
  if (P.lastErr && now - P.lastErrAt < 120000) warn.push(`فشل معالجة حدث: ${P.lastErr}`);
  if (G.loop && G.loop.p99 > 250) warn.push(`الخادم مشغول: تأخر حلقة الأحداث ${G.loop.p99}ms`);
  if (G.db.err && now - G.db.errAt < 120000) warn.push(`تعذر الحفظ في قاعدة البيانات: ${G.db.err}`);
  if (conn.state === "failed" || conn.state === "retry") warn.push(`اتصال TikTok: ${conn.text || conn.state}`);
  return { t: "perf", P: { recv: P.recv, done: P.done, dup: P.dup, failed: P.failed, rate: P.rate, peak: P.peak, pending: P.pending, maxPending: P.maxPending, lagAvg: P.lagAvg, lagMax: P.lagMax,
    explore: P.explore, exploreAt: P.exploreAt, exploreN: P.exploreN, hist: P.hist.slice(-60), by: P.by, sent: P.sent, batches: P.batches, lastErr: P.lastErr, lastErrAt: P.lastErrAt, since: P.since },
    conn, clients, G, warn, at: now };
}
