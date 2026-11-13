// رفع ملف آيرت — مُعاد بناؤه بعد تشخيص HTTP 502:
// السبب: نفاد ذاكرة الخادم (Render: 512MB) — كان الملف يُحمَّل في الذاكرة عدة مرات (formData + arrayBuffer + Buffer + Prisma)
// ثم يعمل FFmpeg بفلتر thumbnail (يحجز عشرات الإطارات) وترميز VP9 متعدد الخيوط، فيُقتل الخادم ويرد البروكسي 502.
// الآن: جسم الطلب يُكتب مباشرة إلى القرص (تيار) ← فحص البايتات من رأس الملف ← FFmpeg على الملف (معالجة واحدة في كل مرة، خيوط قليلة)
// ← الحفظ في قاعدة البيانات أجزاء 1MB. ذروة الذاكرة ثابتة تقريباً مهما كان حجم الملف.
import { NextResponse } from "next/server";
import { createWriteStream } from "fs";
import { mkdtemp, rm, open as fopen, readFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { viewer } from "@/server/alerts-svc";
import { putAssetRaw, putAssetFile, usedBytes, platformStorage, MUSIC_SLOTS } from "@/server/alert-store";
import { prisma } from "@/lib/db";
import { processFile, ffmpegPath, serial } from "@/server/media";
import { AL_LIMITS, AL_ERR, alCheckFile, alInspect, alMeta } from "@/engine/alerts.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 900;
const hits = new Map<string, number[]>();
const fail = (error: string, status = 400, extra: any = {}) => NextResponse.json({ error, message: AL_ERR[error] || "تعذر رفع الملف", ...extra }, { status });
const LIM: Record<string, number> = { media: AL_LIMITS.media, audio: AL_LIMITS.audio, cover: AL_LIMITS.cover };

export async function GET() {
  const { user } = await viewer(); if (!user) return fail("unauthorized", 401);
  const ps = await platformStorage();
  const files = await prisma.alertAsset.count({ where: { ownerId: user.id, slot: { notIn: MUSIC_SLOTS } } });
  return NextResponse.json({ used: await usedBytes(user.id), files, quota: null, platform: { pct: Math.round(ps.pct * 1000) / 10, ok: ps.pct < 0.9 }, limits: LIM, converter: !!ffmpegPath(), maxDuration: null });
}

/** يكتب جسم الطلب إلى ملف مع حد للحجم — بدون تحميل الملف في الذاكرة */
async function saveBody(req: Request, path: string, max: number): Promise<{ ok: true; size: number } | { ok: false; error: string }> {
  if (!req.body) return { ok: false, error: "bad_form" };
  const ws = createWriteStream(path); let size = 0;
  const reader = req.body.getReader();
  try {
    for (;;) {
      const { done, value } = await reader.read(); if (done) break;
      size += value.length; if (size > max) { reader.cancel().catch(() => {}); ws.destroy(); return { ok: false, error: "too_large" }; }
      if (!ws.write(value)) await new Promise(r => ws.once("drain", r));
    }
    await new Promise<void>((ok, no) => ws.end((e: any) => (e ? no(e) : ok())));
    return size ? { ok: true, size } : { ok: false, error: "empty" };
  } catch { ws.destroy(); return { ok: false, error: "network" }; }
}
async function head(path: string, n: number) { const f = await fopen(path, "r"); try { const b = Buffer.alloc(n); const { bytesRead } = await f.read(b, 0, n, 0); return new Uint8Array(b.subarray(0, bytesRead)); } finally { await f.close(); } }

export async function POST(req: Request) {
  const { user } = await viewer(); if (!user) return fail("unauthorized", 401);
  const now = Date.now(), h = (hits.get(user.id) || []).filter(t => now - t < 60_000); h.push(now); hits.set(user.id, h);
  if (h.length > 60) return fail("rate_limited", 429); /* يسمح برفع دفعات كبيرة (20+ ملف) */
  const slot = String(req.headers.get("x-slot") || "media"), name = decodeURIComponent(req.headers.get("x-filename") || "file").slice(0, 120);
  if (!LIM[slot]) return fail("bad_form");
  const len = +(req.headers.get("content-length") || 0); if (len > LIM[slot]) return fail("too_large", 413, { max: LIM[slot] });
  const dir = await mkdtemp(join(tmpdir(), "alu-"));
  try {
    const src = join(dir, "src"), w = await saveBody(req, src, LIM[slot]);
    if (!w.ok) return fail(w.error, w.error === "too_large" ? 413 : 400, { max: LIM[slot] });
    const top = await head(src, 4 * 1024 * 1024);
    let insp: any = alInspect(top);
    // الفحص: النوع الحقيقي من البايتات (Lottie يُقرأ كاملاً ويُتحقق من أمانه — حدّه 5MB)
    if (insp.mime === "application/json") { if (w.size > 5 * 1024 * 1024) return fail("too_complex"); const chk: any = alCheckFile(slot === "media" ? "media" : slot, new Uint8Array(await readFile(src))); if (!chk.ok) return fail(chk.error); }
    else { const chk: any = alCheckFile(slot, top); if (!chk.ok && chk.error !== "too_large") return fail(chk.error, 400, { name }); }
    insp.size = w.size;
    if (slot !== "media") { // غلاف/صوت منفصل: صغير
      if (slot === "cover" && insp.family !== "image") return fail("bad_type");
      if (slot === "audio" && insp.family !== "audio") return fail("bad_type");
      const r = await putAssetRaw(user.id, slot, new Uint8Array(await readFile(src)), insp.mime, {});
      if (!r.ok) return fail((r as any).error); return NextResponse.json({ ok: true, dup: !!(r as any).dup, id: r.id, mime: r.mime, size: r.size, url: `/api/alerts/media/${r.id}` });
    }
    const pr = await serial(() => processFile(src, dir, insp, w.size));
    if (!pr.ok) return fail(pr.error, 422, { detail: (pr as any).detail || "" });
    const meta = alMeta({ ...pr.meta });
    const extra = (pr.cover?.bytes.length || 0) + (pr.preview?.size || 0);
    const mainSlot = pr.kind === "audio" ? "audio" : "media";
    const m = await putAssetFile(user.id, mainSlot, pr.main.path, pr.main.size, pr.main.mime, meta, extra); if (!m.ok) return fail((m as any).error);
    const c = pr.cover ? await putAssetRaw(user.id, "cover", pr.cover.bytes, pr.cover.mime, {}) : null;
    const p = pr.preview ? await putAssetFile(user.id, "preview", pr.preview.path, pr.preview.size, pr.preview.mime, meta) : null;
    const u = (x: any) => (x && x.ok ? `/api/alerts/media/${x.id}` : "");
    return NextResponse.json({ ok: true, dup: !!(m as any).dup, kind: pr.kind, slot: mainSlot, id: m.id, mime: m.mime, size: m.size, url: u(m), meta, coverId: c && c.ok ? c.id : null, coverUrl: u(c), previewId: p && p.ok ? p.id : null, previewUrl: u(p), converted: !!meta.converted });
  } catch (e: any) {
    console.error("[alerts/upload]", e?.message || e);
    return fail("server_error", 500, { detail: String(e?.message || e).slice(0, 160) });
  } finally { rm(dir, { recursive: true, force: true }).catch(() => {}); }
}
