// خدمة طلبات الأغاني: صفحة الطلب العامة (بحث + طلب) ومصدر التشغيل الفعلي لمشغل OBS.
// مستقلة عن Next/Prisma عبر واجهة تخزين — نفس الكود يعمل في الإنتاج وفي الاختبار الطرفي.
// الأمان: صفحة المشاهد تستخدم songToken (لا تفتح OBS ولا اللوحة). المشغل يستخدم رابط OBS (overlayToken). لا مفاتيح في أي رابط عام.
import { musicSearchAll } from "../engine/music.js";

export type MusicTrackRow = { id: string; ownerId: string; title: string; artist: string; dur: number; assetId: string; coverId: string | null; mime: string; size: number };
export type MusicStore = {
  userBySongToken(tok: string): Promise<{ id: string; name: string; overlayToken: string } | null>;
  userByOverlay(tok: string): Promise<{ id: string } | null>;
  tracks(userId: string): Promise<MusicTrackRow[]>;
  track(id: string): Promise<MusicTrackRow | null>;
  /** جزء [s, e] من ملف الأغنية */
  stream(assetId: string, s: number, e: number): Promise<ReadableStream<Uint8Array> | null>;
  coverBytes(coverId: string): Promise<{ bytes: Uint8Array; mime: string } | null>;
};
export type MusicHub = {
  musicRequest(room: string, trackId: string, user: { id: string; name: string }): Promise<{ ok: boolean; reply: string; position?: number; pending?: boolean; qid?: string }>;
  musicLib(room: string, lib: any[]): void;
  musicInfo(room: string): Promise<{ M: any; cfg: any }>;
};

const J = (b: any, status = 200) => new Response(JSON.stringify(b), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
/** بيانات الأغنية للمحرك والعرض — بدون مسار الملف (مصدر التشغيل منفصل ويحتاج رابط OBS) */
export const libEntry = (t: MusicTrackRow) => ({ id: t.id, title: t.title, artist: t.artist, dur: t.dur, cover: t.coverId ? `/api/music/cover/${t.id}` : "" });
const pubItem = (q: any) => q && ({ title: q.track.title, artist: q.track.artist, dur: q.track.dur, cover: q.track.cover || "", by: q.by?.name || "" });
export function cleanName(s: any) { return String(s ?? "").replace(/[\u0000-\u001f<>"`]/g, "").replace(/\s+/g, " ").trim().slice(0, 30); }

export function createMusicService(store: MusicStore, hub: () => MusicHub | undefined) {
  const ipHits = new Map<string, number[]>(), recent = new Map<string, number>();
  const H = () => hub();
  async function owner(tok: string) { if (!/^[\w-]{8,80}$/.test(tok || "")) return null; return store.userBySongToken(tok); }

  /** صفحة المشاهد: هل الطلبات مفتوحة + الحالية + القائمة (أسماء فقط) */
  async function info(tok: string) {
    const u = await owner(tok); if (!u) return J({ error: "not_found" }, 404);
    const h = H(); if (!h) return J({ error: "unavailable", message: "الخادم اللحظي غير متاح الآن" }, 503);
    const { M, cfg } = await h.musicInfo(u.overlayToken);
    const open = cfg.enabled !== false && cfg.page !== false;
    return J({ ok: true, name: u.name, open, rules: { maxDurSec: cfg.maxDurSec || 0, perUser: cfg.perUser || 0, cooldownSec: cfg.cooldownSec || 0, manual: cfg.approve === "manual", maxQueue: cfg.maxQueue || 0 },
      now: M && M.current ? { ...pubItem(M.current), paused: !!M.paused, status: M.status || "" } : null, queue: (M?.queue || []).slice(0, 15).map(pubItem), queueLen: M?.queue?.length || 0, pending: M?.pending?.length || 0 });
  }
  /** البحث: مكتبة صانع المحتوى فقط (كل نتيجة لها ملف تشغيل فعلي) — بالاسم أو الفنان */
  async function search(tok: string, q: string) {
    const u = await owner(tok); if (!u) return J({ error: "not_found" }, 404);
    const lib = (await store.tracks(u.id)).map(libEntry);
    const res = musicSearchAll(lib, String(q || "").slice(0, 80), 30);
    return J({ ok: true, total: lib.length, results: res });
  }
  /** إرسال الطلب: يصل للخادم اللحظي → القيود → قائمة الانتظار → يُبث فوراً للوحة و OBS */
  async function request(tok: string, body: any, ip: string) {
    const u = await owner(tok); if (!u) return J({ error: "not_found" }, 404);
    const name = cleanName(body?.name), trackId = String(body?.trackId || "").slice(0, 40);
    if (name.length < 2) return J({ ok: false, error: "name", message: "اكتب اسمك (حرفان على الأقل) ليظهر مع طلبك" }, 400);
    if (!trackId) return J({ ok: false, error: "track", message: "اختر أغنية من نتائج البحث" }, 400);
    const now = Date.now(), k = u.id + ":" + ip, hits = (ipHits.get(k) || []).filter(t => now - t < 60_000);
    if (hits.length >= 8) return J({ ok: false, error: "rate", message: "طلبات كثيرة — انتظر دقيقة" }, 429);
    const dk = k + ":" + name.toLowerCase() + ":" + trackId; /* نفس الشخص ونفس الأغنية خلال دقيقة */ if (recent.has(dk) && now - recent.get(dk)! < 60_000) return J({ ok: false, error: "dup", message: "أرسلت هذا الطلب للتو" }, 429);
    hits.push(now); ipHits.set(k, hits); if (ipHits.size > 5000) ipHits.clear(); if (recent.size > 5000) recent.clear();
    const t = await store.track(trackId); if (!t || t.ownerId !== u.id) return J({ ok: false, error: "track", message: "الأغنية غير موجودة في المكتبة" }, 404);
    const h = H(); if (!h) return J({ ok: false, error: "unavailable", message: "الخادم اللحظي غير متاح الآن — لم يُرسل الطلب" }, 503);
    const r = await h.musicRequest(u.overlayToken, trackId, { id: "page:" + name.toLowerCase(), name });
    if (r.ok) recent.set(dk, now);
    return J({ ok: r.ok, message: r.reply, position: r.position ?? null, pending: !!r.pending, qid: r.qid || null }, r.ok ? 200 : 409);
  }
  /** مصدر التشغيل: الملف الصوتي الحقيقي — يُفتح برابط OBS لصاحب الأغنية فقط، مع دعم Range (تقديم/تأخير) */
  async function stream(overlayTok: string, trackId: string, range: string | null) {
    const u = /^[\w-]{8,80}$/.test(overlayTok || "") ? await store.userByOverlay(overlayTok) : null; if (!u) return new Response("not found", { status: 404 });
    const t = await store.track(trackId); if (!t || t.ownerId !== u.id) return new Response("not found", { status: 404 });
    const size = t.size; let s = 0, e = size - 1, part = false;
    const m = /bytes=(\d*)-(\d*)/.exec(range || "");
    if (m) { part = true; if (m[1]) s = +m[1]; if (m[2]) e = Math.min(size - 1, +m[2]); if (!m[1] && m[2]) { s = Math.max(0, size - +m[2]); e = size - 1; } if (s > e || s >= size) return new Response("", { status: 416, headers: { "content-range": `bytes */${size}` } }); }
    const body = await store.stream(t.assetId, s, e); if (!body) return new Response("not found", { status: 404 });
    return new Response(body as any, { status: part ? 206 : 200, headers: { "content-type": t.mime, "content-length": String(e - s + 1), "accept-ranges": "bytes", ...(part ? { "content-range": `bytes ${s}-${e}/${size}` } : {}), "cache-control": "private, max-age=3600" } });
  }
  async function cover(trackId: string) {
    const t = await store.track(String(trackId).slice(0, 40)); if (!t || !t.coverId) return new Response("not found", { status: 404 });
    const c = await store.coverBytes(t.coverId); if (!c) return new Response("not found", { status: 404 });
    return new Response(c.bytes as any, { headers: { "content-type": c.mime, "cache-control": "public, max-age=86400" } });
  }
  /** بعد رفع/حذف/تعديل: تحديث مكتبة الغرفة فوراً (طلبات الشات وصفحة الطلب) */
  async function refresh(userId: string, overlayToken: string) { const lib = (await store.tracks(userId)).map(libEntry); H()?.musicLib(overlayToken, lib); return lib; }
  return { info, search, request, stream, cover, refresh };
}
