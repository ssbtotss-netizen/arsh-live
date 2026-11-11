// المصممون: إحصائيات من الآيرتات العامة المعتمدة فقط + متابعة المصمم
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { alDesignerBadges } from "@/engine/alerts.js";
import { viewer } from "@/server/alerts-svc";

export async function GET() {
  const { user } = await viewer();
  const g = await prisma.alert.groupBy({ by: ["ownerId"], where: { visibility: "public", review: "approved", removed: false }, _count: { _all: true }, _sum: { uses: true, likes: true, ratingSum: true, ratingCount: true }, _min: { publishedAt: true } });
  const ids = g.map(x => x.ownerId);
  const [users, fol, mine] = await Promise.all([
    prisma.user.findMany({ where: { id: { in: ids } }, select: { id: true, name: true, designerVerified: true } }),
    prisma.designerFollow.groupBy({ by: ["designerId"], where: { designerId: { in: ids } }, _count: { _all: true } }),
    user ? prisma.designerFollow.findMany({ where: { followerId: user.id }, select: { designerId: true } }) : Promise.resolve([]),
  ]);
  const names = await prisma.alert.findMany({ where: { ownerId: { in: ids }, visibility: "public", review: "approved", removed: false, NOT: { designerName: "" } }, select: { ownerId: true, designerName: true }, distinct: ["ownerId"] });
  const list = g.map(x => { const u = users.find(y => y.id === x.ownerId); const rc = x._sum.ratingCount || 0;
    const d: any = { id: x.ownerId, name: names.find(n => n.ownerId === x.ownerId)?.designerName || u?.name || "مصمم", verified: !!u?.designerVerified, count: x._count._all, uses: x._sum.uses || 0, likes: x._sum.likes || 0, rating: rc ? Math.round(((x._sum.ratingSum || 0) / rc) * 10) / 10 : 0, ratingCount: rc, since: x._min.publishedAt, followers: fol.find(f => f.designerId === x.ownerId)?._count._all || 0, following: (mine as any[]).some(m => m.designerId === x.ownerId) };
    d.badges = alDesignerBadges(d); return d; }).sort((a, b) => b.uses - a.uses || b.count - a.count);
  return NextResponse.json({ designers: list });
}
export async function POST(req: Request) {
  const { user } = await viewer(); if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => ({})), designerId = String(b.designerId || "");
  if (!designerId || designerId === user.id) return NextResponse.json({ error: "bad" }, { status: 400 });
  const ex = await prisma.designerFollow.findUnique({ where: { followerId_designerId: { followerId: user.id, designerId } } });
  if (ex) await prisma.designerFollow.delete({ where: { id: ex.id } }); else await prisma.designerFollow.create({ data: { followerId: user.id, designerId } });
  return NextResponse.json({ ok: true, following: !ex });
}
