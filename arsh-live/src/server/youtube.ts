// بحث YouTube الرسمي لبوت الأغاني (YouTube Data API v3 — المفتاح على الخادم فقط: YOUTUBE_API_KEY)
// search.list يكلف حصة كبيرة (الافتراضي ~100 بحث يومياً لكل مشروع) ← كاش للطلبات المتكررة + روابط YouTube المباشرة تستخدم videos.list الرخيص.
import { ytVideoIdFromText, ytPlayable, ytTrack, ytCacheKey } from "../engine/youtube.js";

export type YtResult = { ok: true; track: any; cached?: boolean } | { ok: false; error: string; message: string };
type Opt = { key?: string; fetch?: typeof fetch; now?: () => number };

export function createYouTube(o: Opt = {}) {
  const F = o.fetch || fetch, now = o.now || Date.now;
  const key = () => o.key ?? process.env.YOUTUBE_API_KEY ?? "";
  const cache = new Map<string, { at: number; r: YtResult }>(); // نتيجة البحث لأسبوع
  const st = { day: "", searches: 0, lookups: 0, quotaUntil: 0, lastError: "" };
  const dayOf = (t: number) => new Date(t - 8 * 3600e3).toISOString().slice(0, 10); // الحصة تتجدد منتصف الليل بتوقيت المحيط الهادئ تقريباً
  const tick = () => { const d = dayOf(now()); if (d !== st.day) { st.day = d; st.searches = 0; st.lookups = 0; } };
  const fail = (error: string, message: string): YtResult => ({ ok: false, error, message });
  async function api(path: string, params: Record<string, string>) {
    const u = new URL("https://www.googleapis.com/youtube/v3/" + path); for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v); u.searchParams.set("key", key());
    const r = await F(u.toString(), { headers: { accept: "application/json" } });
    const j: any = await r.json().catch(() => ({}));
    if (!r.ok) { const reason = j?.error?.errors?.[0]?.reason || j?.error?.status || String(r.status); throw Object.assign(new Error(reason), { reason, status: r.status }); }
    return j;
  }
  async function details(ids: string[], maxDurSec: number, region: string) {
    st.lookups++;
    const j = await api("videos", { part: "snippet,contentDetails,status", id: ids.join(","), maxResults: String(ids.length) });
    const byId = new Map((j.items || []).map((v: any) => [v.id, v]));
    return ytPlayable(ids.map(id => byId.get(id)).filter(Boolean), { maxDurSec, region });
  }
  /** نص الطلب ← أغنية قابلة للتشغيل في المشغل المضمّن (+ نسخ بديلة) */
  async function find(q: string, opts: { maxDurSec?: number; region?: string } = {}): Promise<YtResult> {
    tick(); if (!key()) return fail("no_key", "البحث في YouTube غير مفعّل على الخادم (يلزم مفتاح YouTube Data API)");
    const maxDurSec = opts.maxDurSec || 0, region = (opts.region || "SA").toUpperCase();
    try {
      const vid = ytVideoIdFromText(q);
      if (vid) { const c = await details([vid], maxDurSec, region); if (!c.length) return fail("not_found", "الرابط لا يشير لفيديو متاح"); if (!c[0].ok) return fail("not_playable", "لا يمكن تشغيله: " + c[0].why); return { ok: true, track: ytTrack(c[0]) }; }
      const k = ytCacheKey(q) + "|" + maxDurSec + "|" + region; const hit = cache.get(k);
      if (hit && now() - hit.at < 7 * 864e5) return { ...(hit.r as any), cached: true };
      if (st.quotaUntil > now()) return fail("quota", "انتهت حصة البحث اليومية في YouTube — اكتب رابط الأغنية بدل اسمها، أو انتظر للغد");
      st.searches++;
      const s = await api("search", { part: "snippet", type: "video", q: String(q).slice(0, 100), maxResults: "6", videoEmbeddable: "true", videoSyndicated: "true", safeSearch: "none", regionCode: region, relevanceLanguage: /[؀-ۿ]/.test(q) ? "ar" : "en" });
      const ids = (s.items || []).map((i: any) => i.id?.videoId).filter(Boolean);
      if (!ids.length) { const r = fail("not_found", "ما لقيت الأغنية في YouTube"); cache.set(k, { at: now(), r }); return r; }
      const c = await details(ids, maxDurSec, region), good = c.filter(x => x.ok);
      const r: YtResult = good.length ? { ok: true, track: ytTrack(good[0], good.slice(1)) } : fail("not_playable", "النتائج لا تسمح بالتشغيل خارج YouTube" + (c[0] ? ` (${c[0].why})` : ""));
      cache.set(k, { at: now(), r }); if (cache.size > 3000) cache.delete(cache.keys().next().value!);
      st.lastError = ""; return r;
    } catch (e: any) {
      st.lastError = String(e?.reason || e?.message || e).slice(0, 120);
      if (/quota|rateLimit|dailyLimit/i.test(st.lastError)) { st.quotaUntil = now() + 3 * 3600e3; return fail("quota", "انتهت حصة البحث اليومية في YouTube — اكتب رابط الأغنية بدل اسمها، أو انتظر للغد"); }
      if (/keyInvalid|API_KEY|forbidden|accessNotConfigured|PERMISSION/i.test(st.lastError)) return fail("bad_key", "مفتاح YouTube غير صالح أو YouTube Data API غير مفعّلة في المشروع");
      return fail("network", "تعذر الاتصال بـ YouTube الآن");
    }
  }
  return { find, status: () => { tick(); return { configured: !!key(), searchesToday: st.searches, lookupsToday: st.lookups, quotaHit: st.quotaUntil > now(), lastError: st.lastError, cacheSize: cache.size }; } };
}
