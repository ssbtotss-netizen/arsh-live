// مكتبة الأصوات لرابط OBS: إعدادات المشغل + روابط موقّعة ومؤقتة للأصوات المستخدمة فقط
// أصوات صانع المحتوى المرفوعة: ملكه فقط · أصوات المجتمع: المعتمدة العامة فقط · مكتبة المنصة: ملفات عامة (/sounds/lib)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sndCfg, sndUsedRefs } from "@/engine/sounds.js";
import { alIsListed } from "@/engine/alerts.js";
import { signedMediaUrl } from "@/server/alert-sign";

export const dynamic = "force-dynamic";
export async function GET(_: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const u = await prisma.user.findUnique({ where: { overlayToken: token }, select: { id: true, bots: true } });
  if (!u) return NextResponse.json({ error: "not found" }, { status: 404 });
  const cfg = sndCfg((u.bots as any)?.sounds || {}), refs = sndUsedRefs(cfg), urls: Record<string, string> = {};
  // أصوات قوانين السابثون (صوت لكل قانون من المكتبة أو من ملفات صانع المحتوى)
  try { const rs = await prisma.roomState.findUnique({ where: { userId: u.id }, select: { clock: true } }); const L = (rs?.clock as any)?.subathon?.rules?.list;
    if (Array.isArray(L)) for (const r of L) { const s = String(r?.soundId || ""); if (/^(up:[a-z0-9]{8,40}|al:[a-z0-9]{8,40})$/i.test(s) && !refs.includes(s)) refs.push(s); } } catch { /* بدون حالة محفوظة */ }
  const up = refs.filter(r => r.startsWith("up:")).map(r => r.slice(3)), al = refs.filter(r => r.startsWith("al:")).map(r => r.slice(3));
  if (up.length) for (const a of await prisma.alertAsset.findMany({ where: { id: { in: up }, ownerId: u.id }, select: { id: true } })) urls["up:" + a.id] = signedMediaUrl(a.id, token);
  if (al.length) for (const a of await prisma.alert.findMany({ where: { id: { in: al }, kind: "audio" } })) if ((alIsListed(a) || a.ownerId === u.id) && (a.audioId || a.mediaId)) urls["al:" + a.id] = signedMediaUrl((a.audioId || a.mediaId)!, token);
  return NextResponse.json({ cfg: { on: cfg.on, vol: cfg.vol, maxQ: cfg.maxQ, explore: cfg.explore }, urls }, { headers: { "cache-control": "no-store" } });
}
