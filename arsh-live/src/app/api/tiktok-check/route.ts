// فحص تشخيصي: هل يستطيع الخادم الاتصال ببث حساب TikTok الآن؟ (بيانات عامة فقط، اتصال قصير ثم فصل)
import { NextResponse } from "next/server";
let last = 0;
export async function GET(req: Request) {
  const u = (new URL(req.url).searchParams.get("u") || "").replace(/^@/, "").trim();
  if (!/^[\w.]{2,40}$/.test(u)) return NextResponse.json({ error: "bad_username" }, { status: 400 });
  if (Date.now() - last < 5000) return NextResponse.json({ error: "wait" }, { status: 429 }); last = Date.now();
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
    return NextResponse.json({ ok: false, error: String(e?.message || e).slice(0, 400), name: e?.name, inner: String(e?.exception?.message || e?.cause?.message || "").slice(0, 300), errors: (e?.errors || []).map((x: any) => String(x?.message || x).slice(0, 200)), ms: Date.now() - t0, signKey: !!process.env.TIKTOK_SIGN_API_KEY });
  }
}
