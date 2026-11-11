// تصميم واحد: العرض لمن يحق له، والتعديل/تغيير الخصوصية/إلغاء الكود/الحذف للمالك فقط
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { LS_CATS } from "@/engine/layoutshare.js";
import { viewer, alertsCfg } from "@/server/alerts-svc";
import { lsCanView, newCode, toClientLayout, sanitizePkg } from "@/server/layouts-svc";

type Ctx = { params: Promise<{ id: string }> };
const nf = () => NextResponse.json({ error: "not_found" }, { status: 404 });
export async function GET(_: Request, ctx: Ctx) {
  const { id } = await ctx.params; const { v } = await viewer();
  const l = await prisma.streamLayout.findUnique({ where: { id }, include: { owner: { select: { name: true, designerVerified: true } } } as any });
  if (!l || !lsCanView(l, v)) return nf();
  return NextResponse.json({ layout: toClientLayout(l, v, { data: true }) });
}
export async function PUT(req: Request, ctx: Ctx) {
  const { id } = await ctx.params; const { user } = await viewer(); if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const l = await prisma.streamLayout.findUnique({ where: { id } }); if (!l || l.ownerId !== user.id) return nf();
  const b = await req.json().catch(() => ({})), data: any = {};
  if (b.revoke) data.code = await newCode(); // إلغاء المشاركة: الكود القديم يتوقف فوراً
  if (typeof b.name === "string") data.name = b.name.trim().slice(0, 60) || l.name;
  if (typeof b.description === "string") data.description = b.description.slice(0, 400);
  if (b.category !== undefined) data.category = (LS_CATS as any)[b.category] ? b.category : "";
  if (b.pkg) { const s: any = await sanitizePkg(b.pkg, user.id); if (!s.ok) return NextResponse.json({ error: s.error }, { status: 400 }); Object.assign(data, { data: s.value, kind: s.value.kind, canvas: s.stats.canvas, shape: s.stats.shape, widgets: s.stats.widgets }); if (l.visibility === "public" && l.review === "approved") data.review = (await alertsCfg()).autoApprove ? "approved" : "pending"; }
  if (b.visibility && b.visibility !== l.visibility) {
    if (!["private", "link", "public"].includes(b.visibility)) return NextResponse.json({ error: "bad_visibility" }, { status: 400 });
    if (b.visibility === "public") { if (!b.rightsConfirmed) return NextResponse.json({ error: "rights_required" }, { status: 400 }); const auto = (await alertsCfg()).autoApprove; Object.assign(data, { visibility: "public", review: auto ? "approved" : "pending", publishedAt: auto ? new Date() : null }); }
    else Object.assign(data, { visibility: b.visibility, review: "none", publishedAt: null });
  }
  const u = await prisma.streamLayout.update({ where: { id }, data, include: { owner: { select: { name: true, designerVerified: true } } } as any });
  return NextResponse.json({ ok: true, layout: toClientLayout(u, { id: user.id }) });
}
export async function DELETE(_: Request, ctx: Ctx) {
  const { id } = await ctx.params; const { user } = await viewer(); if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const d = await prisma.streamLayout.deleteMany({ where: { id, ownerId: user.id } }); return d.count ? NextResponse.json({ ok: true }) : nf();
}
