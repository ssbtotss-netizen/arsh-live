// رفع ملف آيرت: فحص البايتات الحقيقي ← FFmpeg (قراءة الخصائص + تحويل الترميز غير المدعوم مع حفظ الشفافية) ← غلاف تلقائي ← معاينة خفيفة.
// لا يُحفظ أي شيء إذا فشلت خطوة، والخطأ يرجع برسالة عربية واضحة.
import { NextResponse } from "next/server";
import { viewer } from "@/server/alerts-svc";
import { putAssetRaw, putAsset, usedBytes } from "@/server/alert-store";
import { processMedia, ffmpegPath } from "@/server/media";
import { AL_LIMITS, AL_ERR, alCheckFile, alInspect, alMeta } from "@/engine/alerts.js";

export const runtime = "nodejs";
export const maxDuration = 300;
const hits = new Map<string, number[]>();
const fail = (error: string, status = 400, extra: any = {}) => NextResponse.json({ error, message: AL_ERR[error] || "تعذر رفع الملف", ...extra }, { status });

export async function GET() {
  const { user } = await viewer(); if (!user) return fail("unauthorized", 401);
  return NextResponse.json({ used: await usedBytes(user.id), quota: AL_LIMITS.quota, limits: { media: AL_LIMITS.media, audio: AL_LIMITS.audio, cover: AL_LIMITS.cover }, converter: !!ffmpegPath() });
}
export async function POST(req: Request) {
  const { user } = await viewer(); if (!user) return fail("unauthorized", 401);
  const now = Date.now(), h = (hits.get(user.id) || []).filter(t => now - t < 60_000); h.push(now); hits.set(user.id, h);
  if (h.length > 20) return fail("rate_limited", 429);
  const len = +(req.headers.get("content-length") || 0); if (len > AL_LIMITS.media + 256 * 1024) return fail("too_large", 413, { max: AL_LIMITS.media });
  const fd = await req.formData().catch(() => null); if (!fd) return fail("bad_form");
  const slot = String(fd.get("slot") || ""), file = fd.get("file") as File | null;
  if (!["media", "audio", "cover"].includes(slot) || !file || typeof (file as any).arrayBuffer !== "function") return fail("bad_form");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const chk: any = alCheckFile(slot, bytes);
  if (!chk.ok) return fail(chk.error, 400, { max: chk.max, name: file.name });
  if (slot !== "media") { const r = await putAsset(user.id, slot, bytes); if (!r.ok) return fail(r.error); return NextResponse.json({ ok: true, id: r.id, mime: r.mime, size: r.size, url: `/api/alerts/media/${r.id}` }); }
  const insp = alInspect(bytes);
  const pr = await processMedia(bytes, insp);
  if (!pr.ok) return fail(pr.error, 422, { detail: (pr as any).detail || "" });
  const meta = alMeta({ ...pr.meta });
  const extra = (pr.cover?.bytes.length || 0) + (pr.preview?.bytes.length || 0);
  const mainSlot = pr.kind === "audio" ? "audio" : "media";
  const m = await putAssetRaw(user.id, mainSlot, pr.main.bytes, pr.main.mime, meta, extra); if (!m.ok) return fail((m as any).error);
  const c = pr.cover ? await putAssetRaw(user.id, "cover", pr.cover.bytes, pr.cover.mime, {}) : null;
  const p = pr.preview ? await putAssetRaw(user.id, "preview", pr.preview.bytes, pr.preview.mime, meta) : null;
  const u = (x: any) => (x && x.ok ? `/api/alerts/media/${x.id}` : "");
  return NextResponse.json({ ok: true, kind: pr.kind, slot: mainSlot, id: m.id, mime: m.mime, size: m.size, url: u(m), meta, coverId: c && c.ok ? c.id : null, coverUrl: u(c), previewId: p && p.ok ? p.id : null, previewUrl: u(p), converted: !!meta.converted });
}
