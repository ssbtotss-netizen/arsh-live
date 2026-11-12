// رفع أغنية للمكتبة: الجسم يُكتب للقرص مباشرة (ذاكرة ثابتة) ← فحص البايتات ← FFmpeg: تحقق أنه صوت، تحويل لـ MP3 إن لزم،
// الغلاف والمدة والوسوم ← الحفظ أجزاء 1MB ← تحديث مكتبة البث فوراً (طلبات الشات وصفحة الطلب)
import { NextResponse } from "next/server";
import { createWriteStream } from "fs";
import { mkdtemp, rm, open as fopen } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { currentUser } from "@/lib/auth";
import { processMusic, serial } from "@/server/media";
import { alInspect } from "@/engine/alerts.js";
import { addTrack, musicSvc, MUSIC_LIMITS } from "@/server/music-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 900;
const MSG: Record<string, string> = { unauthorized: "سجّل الدخول أولاً", too_large: "الملف أكبر من 40MB", empty: "الملف فارغ", network: "انقطع الرفع — حاول مرة أخرى", bad_type: "هذا ليس ملفاً صوتياً مدعوماً (MP3 / M4A / AAC / OGG / OPUS / WAV / FLAC)", no_audio: "الملف لا يحتوي على صوت", no_converter: "التحويل غير متاح على الخادم الآن — ارفع ملف MP3", convert_failed: "تعذر تحويل الملف — قد يكون تالفاً", oom: "الملف ثقيل على الخادم الآن — جرّب ملفاً أصغر", quota: "امتلأت مساحة مكتبة الأغاني", too_many: "وصلت للحد الأقصى لعدد الأغاني", rate_limited: "رفعات كثيرة — انتظر دقيقة", server_error: "خطأ في الخادم أثناء الحفظ" };
const fail = (error: string, status = 400, extra: any = {}) => NextResponse.json({ ok: false, error, message: MSG[error] || "تعذر رفع الأغنية", ...extra }, { status });
const hits = new Map<string, number[]>();
const clean = (s: string, n: number) => s.replace(/[\u0000-\u001f<>]/g, "").replace(/\s+/g, " ").trim().slice(0, n);

export async function POST(req: Request) {
  const u = await currentUser(); if (!u) return fail("unauthorized", 401);
  const now = Date.now(), h = (hits.get(u.id) || []).filter(t => now - t < 60_000); h.push(now); hits.set(u.id, h); if (h.length > 30) return fail("rate_limited", 429);
  const fname = decodeURIComponent(req.headers.get("x-filename") || "song").slice(0, 160);
  if (+(req.headers.get("content-length") || 0) > MUSIC_LIMITS.file) return fail("too_large", 413);
  if (!req.body) return fail("empty");
  const dir = await mkdtemp(join(tmpdir(), "mus-"));
  try {
    const src = join(dir, "src"); const ws = createWriteStream(src); let size = 0; const rd = req.body.getReader();
    try { for (;;) { const { done, value } = await rd.read(); if (done) break; size += value.length; if (size > MUSIC_LIMITS.file) { rd.cancel().catch(() => {}); ws.destroy(); return fail("too_large", 413); } if (!ws.write(value)) await new Promise(r => ws.once("drain", r)); }
      await new Promise<void>((ok, no) => ws.end((e: any) => (e ? no(e) : ok()))); } catch { ws.destroy(); return fail("network"); }
    if (!size) return fail("empty");
    const f = await fopen(src, "r"); const top = Buffer.alloc(Math.min(size, 1 << 20)); await f.read(top, 0, top.length, 0); await f.close();
    const insp: any = alInspect(new Uint8Array(top));
    const p = await serial(() => processMusic(src, dir, insp, size)); if (!p.ok) return fail(p.error, 422, { detail: (p as any).detail || "" });
    // العنوان والفنان: من وسوم الملف، وإلا من اسم الملف «الفنان - العنوان»
    const base = fname.replace(/\.[^.]+$/, ""), parts = base.split(/\s+-\s+/);
    const title = clean(req.headers.get("x-title") ? decodeURIComponent(req.headers.get("x-title")!) : p.tags.title || (parts[1] || parts[0]), 120) || "أغنية";
    const artist = clean(req.headers.get("x-artist") ? decodeURIComponent(req.headers.get("x-artist")!) : p.tags.artist || (parts[1] ? parts[0] : ""), 80);
    const r = await addTrack(u.id, { path: p.path, size: p.size, mime: p.mime, dur: p.dur, title, artist, cover: p.cover });
    if (!r.ok) return fail(r.error, 413);
    await musicSvc.refresh(u.id, u.overlayToken);
    return NextResponse.json({ ok: true, track: { id: r.track.id, title, artist, dur: p.dur, cover: r.track.coverId ? `/api/music/cover/${r.track.id}` : "", size: p.size }, converted: p.converted });
  } catch (e: any) { console.error("[music/upload]", e?.message || e); return fail("server_error", 500); }
  finally { rm(dir, { recursive: true, force: true }).catch(() => {}); }
}
