// فحص تشخيصي: هل يستطيع الخادم الاتصال ببث حساب TikTok الآن؟ (بيانات عامة فقط، اتصال قصير ثم فصل)
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { classifyTikTokError, signQuota } from "@/server/tiktok";
let last = 0;
export async function GET(req: Request) {
  const u = (new URL(req.url).searchParams.get("u") || "").replace(/^@/, "").trim();
  if (!/^[\w.]{2,40}$/.test(u)) return NextResponse.json({ error: "bad_username" }, { status: 400 });
  // الفحص يستهلك حصة خدمة التوقيع المشتركة: للمستخدمين المسجلين فقط، مرة كل دقيقة، ولا يعمل أثناء فترة الانتظار
  if (!(await currentUser())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const q: any = (globalThis as any).__b6o6Sign || signQuota;
  if (q.until > Date.now()) return NextResponse.json({ ok: false, error: "sign_cooldown", retryAfterMs: q.until - Date.now(), code: q.code, signKey: !!process.env.TIKTOK_SIGN_API_KEY }, { status: 429, headers: { "Retry-After": String(Math.ceil((q.until - Date.now()) / 1000)) } });
  if (Date.now() - last < 60000) return NextResponse.json({ error: "wait" }, { status: 429, headers: { "Retry-After": String(Math.ceil((60000 - (Date.now() - last)) / 1000)) } }); last = Date.now();
  const t0 = Date.now();
  try {
    const mod: any = await import("tiktok-live-connector");
    const Conn = mod.TikTokLiveConnection ?? mod.WebcastPushConnection;
    const opts: any = { processInitialData: false }; if (new URL(req.url).searchParams.get("ext") === "1") opts.enableExtendedGiftInfo = true; if (process.env.TIKTOK_SIGN_API_KEY) opts.signApiKey = process.env.TIKTOK_SIGN_API_KEY;
    const c = new Conn(u, opts);
    const st = await Promise.race([c.connect(), new Promise((_, r) => setTimeout(() => r(new Error("timeout 25s")), 25000))]) as any;
    let followers: any = null; try { const info: any = await c.fetchRoomInfo(); const o = info?.owner ?? info?.data?.owner; followers = o?.follow_info?.follower_count ?? o?.followInfo?.followerCount ?? null; } catch (e: any) { followers = "ERR " + String(e?.message || e).slice(0, 160); }
    try { c.disconnect(); } catch {}
    return NextResponse.json({ ok: true, roomId: st?.roomId ?? null, followers, ms: Date.now() - t0, signKey: !!process.env.TIKTOK_SIGN_API_KEY, version: mod.VERSION ?? null });
  } catch (e: any) {
    const c = classifyTikTokError(e);
    if (c.kind === "rate_limit") { const q: any = (globalThis as any).__b6o6Sign || signQuota; q.until = Math.max(q.until || 0, Date.now() + (c.retryAfterMs ?? 60_000)); q.code = c.code || "429"; q.last = { ...c, at: Date.now(), user: u, attemptId: "check" }; } // الحصة مشتركة مع اتصالات البث
    return NextResponse.json({ ok: false, kind: c.kind, code: c.code ?? null, status: c.status ?? null, retryAfterMs: c.retryAfterMs ?? null, requestId: c.requestId ?? null, error: String(e?.message || e).slice(0, 400), name: e?.name, inner: String(e?.exception?.message || e?.cause?.message || "").slice(0, 300), errors: (e?.errors || []).map((x: any) => String(x?.message || x).slice(0, 200)), ms: Date.now() - t0, signKey: !!process.env.TIKTOK_SIGN_API_KEY });
  }
}
