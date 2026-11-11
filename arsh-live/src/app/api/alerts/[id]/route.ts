// آيرت واحد: العرض لمن يحق له فقط (الخاص يعيد 404 لغير مالكه حتى لا يُكشف وجوده) — التعديل والحذف للمالك فقط
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { alCanView, alCanEdit, alValidate, alVisibilityPatch, alEditNeedsReview, alMeta } from "@/engine/alerts.js";
import { viewer, toClient, alertsCfg, ownerSel } from "@/server/alerts-svc";
import { removeOrphans } from "@/server/alert-store";

type Ctx = { params: Promise<{ id: string }> };
const nf = () => NextResponse.json({ error: "not_found" }, { status: 404 });

export async function GET(_: Request, ctx: Ctx) {
  const { id } = await ctx.params; const { v } = await viewer();
  const a = await prisma.alert.findUnique({ where: { id }, include: { owner: ownerSel } });
  if (!a || !alCanView(a, v)) return nf();
  return NextResponse.json({ alert: toClient(a, v) });
}
export async function PUT(req: Request, ctx: Ctx) {
  const { id } = await ctx.params; const { user, v } = await viewer(); if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const a = await prisma.alert.findUnique({ where: { id } });
  if (!a || !alCanEdit(a, v)) return nf(); // ليس المالك: لا نكشف أن الآيرت موجود
  if (a.removed) return NextResponse.json({ error: "removed", message: "حذفته الإدارة — لا يمكن تعديله" }, { status: 403 });
  const b = await req.json().catch(() => ({}));
  // تغيير الخصوصية فقط
  if (b.visibility && Object.keys(b).every(k => ["visibility", "rightsConfirmed"].includes(k))) {
    const p = alVisibilityPatch(a, b.visibility, { rightsConfirmed: !!b.rightsConfirmed, autoApprove: (await alertsCfg()).autoApprove });
    if (!p.ok) return NextResponse.json({ error: p.error }, { status: 400 });
    const u = await prisma.alert.update({ where: { id }, data: p.patch, include: { owner: ownerSel } });
    return NextResponse.json({ ok: true, alert: toClient(u, v) });
  }
  const merged: any = { ...a, ...b, tags: b.tags ?? a.tags, config: b.config ?? a.config, visibility: b.visibility ?? a.visibility, rightsConfirmed: b.rightsConfirmed ?? a.rightsConfirmed };
  const val = alValidate(merged, { legacy: merged.category === a.category }); if (!val.ok) return NextResponse.json({ error: "invalid", errors: val.errors }, { status: 400 });
  const x: any = val.value;
  for (const k of ["mediaId", "audioId", "coverId", "previewId"]) if (x[k] && x[k] !== (a as any)[k]) { const f = await prisma.alertAsset.findUnique({ where: { id: x[k] }, select: { ownerId: true } }); if (!f || f.ownerId !== user.id) return NextResponse.json({ error: "bad_file", field: k }, { status: 400 }); }
  const data: any = { name: x.name, description: x.description, kind: x.kind, event: x.event, durationSec: x.durationSec, category: x.category, tags: x.tags, designerName: x.designerName || a.designerName, mediaId: x.mediaId, audioId: x.audioId, coverId: x.coverId, previewId: x.previewId, config: x.config };
  if (x.mediaId !== a.mediaId || x.audioId !== a.audioId) { const src = x.mediaId || x.audioId; const f = src ? await prisma.alertAsset.findUnique({ where: { id: src }, select: { meta: true } }) : null; data.meta = alMeta(f?.meta); }
  const changed: any = {}; for (const k of ["mediaId", "audioId", "coverId", "name", "description"]) if ((data as any)[k] !== (a as any)[k]) changed[k] = 1;
  if (x.visibility !== a.visibility) { const p = alVisibilityPatch(a, x.visibility, { rightsConfirmed: x.rightsConfirmed, autoApprove: (await alertsCfg()).autoApprove }); if (!p.ok) return NextResponse.json({ error: p.error }, { status: 400 }); Object.assign(data, p.patch); }
  else if (alEditNeedsReview(a, changed) && !(await alertsCfg()).autoApprove) Object.assign(data, { review: "pending" });
  const u = await prisma.alert.update({ where: { id }, data, include: { owner: ownerSel } });
  await removeOrphans(user.id, [a.mediaId, a.audioId, a.coverId, a.previewId].filter(f => f && ![u.mediaId, u.audioId, u.coverId, u.previewId].includes(f)));
  return NextResponse.json({ ok: true, alert: toClient(u, v) });
}
export async function DELETE(_: Request, ctx: Ctx) {
  const { id } = await ctx.params; const { user, v } = await viewer(); if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const a = await prisma.alert.findUnique({ where: { id } });
  if (!a || !alCanEdit(a, v)) return nf();
  await prisma.alert.delete({ where: { id } }); // الاستخدامات والتفاعلات تُحذف معه (Cascade)
  await removeOrphans(user.id, [a.mediaId, a.audioId, a.coverId, a.previewId]);
  return NextResponse.json({ ok: true });
}
