// رفع ملف آيرت: فحص البايتات الحقيقي + حد الحجم + حصة المستخدم + حد الطلبات — الملف خاص بصاحبه حتى يُنشر آيرته ويُعتمد
import { NextResponse } from "next/server";
import { viewer } from "@/server/alerts-svc";
import { putAsset, usedBytes } from "@/server/alert-store";
import { AL_LIMITS } from "@/engine/alerts.js";

const hits = new Map<string, number[]>();
export async function GET() {
  const { user } = await viewer(); if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ used: await usedBytes(user.id), quota: AL_LIMITS.quota, limits: { media: AL_LIMITS.media, audio: AL_LIMITS.audio, cover: AL_LIMITS.cover } });
}
export async function POST(req: Request) {
  const { user } = await viewer(); if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const now = Date.now(), h = (hits.get(user.id) || []).filter(t => now - t < 60_000); h.push(now); hits.set(user.id, h);
  if (h.length > 20) return NextResponse.json({ error: "rate_limited", message: "رفعت ملفات كثيرة — انتظر دقيقة" }, { status: 429 });
  const len = +(req.headers.get("content-length") || 0); if (len > AL_LIMITS.media + 64 * 1024) return NextResponse.json({ error: "too_large", max: AL_LIMITS.media }, { status: 413 });
  const fd = await req.formData().catch(() => null); if (!fd) return NextResponse.json({ error: "bad_form" }, { status: 400 });
  const slot = String(fd.get("slot") || ""), file = fd.get("file") as File | null;
  if (!["media", "audio", "cover"].includes(slot) || !file || typeof (file as any).arrayBuffer !== "function") return NextResponse.json({ error: "bad_form" }, { status: 400 });
  const bytes = new Uint8Array(await file.arrayBuffer());
  const r = await putAsset(user.id, slot, bytes);
  const msg: Record<string, string> = { bad_type: "نوع الملف غير مدعوم (المسموح: MP4, WebM, GIF, PNG, JPG, WebP, Lottie JSON, MP3, WAV, OGG)", too_large: "الملف أكبر من الحد المسموح", quota: "امتلأت مساحة ملفاتك (200MB) — احذف آيرتات قديمة", bad_lottie: "ملف Lottie غير صالح", lottie_expressions: "ملف Lottie يحتوي تعابير برمجية — غير مسموح لأسباب أمنية", lottie_external: "ملف Lottie يحمّل ملفات خارجية — غير مسموح", too_complex: "ملف Lottie معقد جداً", empty: "الملف فارغ" };
  if (!r.ok) return NextResponse.json({ error: r.error, message: msg[r.error] || "تعذر رفع الملف", max: (r as any).max }, { status: 400 });
  return NextResponse.json({ ok: true, id: r.id, mime: r.mime, size: r.size, url: `/api/alerts/media/${r.id}` });
}
