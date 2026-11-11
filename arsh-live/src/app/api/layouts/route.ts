// مكتبة تصاميم البث: الأقسام العامة (المعتمدة فقط) + تصاميمي + المفضلة + المصممون، وحفظ/مشاركة تصميم جديد
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { alSort, alSearch, alDesignerBadges } from "@/engine/alerts.js";
import { LS_CATS } from "@/engine/layoutshare.js";
import { viewer, alertsCfg } from "@/server/alerts-svc";
import { sanitizePkg, newCode, toClientLayout, lsCanView } from "@/server/layouts-svc";

const LISTED = { visibility: "public", review: "approved", removed: false } as const;
const own = { select: { name: true, designerVerified: true } } as const;

export async function GET(req: Request) {
  const { user, v } = await viewer(); const sp = new URL(req.url).searchParams;
  const section = sp.get("section") || "all", q = sp.get("q") || "", cat = sp.get("cat") || "", shape = sp.get("shape") || "";
  const filt: any = {}; if ((LS_CATS as any)[cat]) filt.category = cat; if (["horizontal", "vertical", "square"].includes(shape)) filt.shape = shape;
  if (section === "designers") {
    const g = await prisma.streamLayout.groupBy({ by: ["ownerId"], where: LISTED, _count: { _all: true }, _sum: { uses: true, likes: true, ratingSum: true, ratingCount: true }, _min: { publishedAt: true } });
    const users = await prisma.user.findMany({ where: { id: { in: g.map(x => x.ownerId) } }, select: { id: true, name: true, designerVerified: true } });
    // مصمم الشهر: استيرادات حقيقية خلال 30 يوماً (استيراد واحد لكل مستخدم، ولا يُحسب استيراد المالك لنفسه)
    const month = await prisma.layoutUse.findMany({ where: { createdAt: { gte: new Date(Date.now() - 30 * 864e5) } }, select: { userId: true, layout: { select: { ownerId: true } } } });
    const mc: Record<string, number> = {}; for (const u of month) if (u.userId !== u.layout.ownerId) mc[u.layout.ownerId] = (mc[u.layout.ownerId] || 0) + 1;
    const list = g.map(x => { const u = users.find(y => y.id === x.ownerId); const rc = x._sum.ratingCount || 0; const d: any = { id: x.ownerId, name: u?.name || "مصمم", verified: !!u?.designerVerified, count: x._count._all, uses: x._sum.uses || 0, likes: x._sum.likes || 0, rating: rc ? Math.round(((x._sum.ratingSum || 0) / rc) * 10) / 10 : 0, ratingCount: rc, since: x._min.publishedAt, month: mc[x.ownerId] || 0 }; d.badges = alDesignerBadges(d); return d; }).sort((a, b) => b.uses - a.uses);
    const top = [...list].sort((a, b) => b.month - a.month)[0];
    return NextResponse.json({ designers: list, designerOfMonth: top && top.month ? top : null });
  }
  let rows: any[] = [];
  if (section === "mine" || section === "favs") {
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    if (section === "mine") rows = await prisma.streamLayout.findMany({ where: { ownerId: user.id, ...filt }, orderBy: { updatedAt: "desc" }, take: 300, include: { owner: own } as any });
    else rows = (await prisma.layoutReaction.findMany({ where: { userId: user.id, fav: true }, include: { layout: { include: { owner: own } as any } }, take: 300 })).map((r: any) => r.layout).filter(l => lsCanView(l, v));
  } else {
    const where: any = { ...LISTED, ...filt }; if (section === "designer") where.ownerId = String(sp.get("id") || "");
    rows = await prisma.streamLayout.findMany({ where, orderBy: { publishedAt: "desc" }, take: 600, include: { owner: own } as any });
    if (section === "week") { // أفضل تصاميم الأسبوع: استيرادات حقيقية خلال 7 أيام
      const w = await prisma.layoutUse.groupBy({ by: ["layoutId"], where: { createdAt: { gte: new Date(Date.now() - 7 * 864e5) } }, _count: { _all: true } });
      const m = new Map(w.map(x => [x.layoutId, x._count._all])); rows = rows.filter(r => m.get(r.id)).sort((a, b) => (m.get(b.id) || 0) - (m.get(a.id) || 0));
    } else rows = alSort(rows, section === "rated" ? "rated" : section === "used" ? "used" : section === "liked" ? "liked" : section === "new" ? "new" : "trending");
  }
  rows = alSearch(rows.map(r => ({ ...r, designerName: r.designerName || r.owner?.name })), q);
  let my: Record<string, any> = {};
  if (user && rows.length) for (const r of await prisma.layoutReaction.findMany({ where: { userId: user.id, layoutId: { in: rows.map(x => x.id) } } })) my[r.layoutId] = { like: r.like, fav: r.fav, rating: r.rating };
  return NextResponse.json({ items: rows.slice(0, 120).map(l => toClientLayout(l, v, { my: my[l.id] || null })) }, { headers: { "cache-control": "no-store" } });
}

/** حفظ تصميم في مكتبتي (خاص افتراضياً) أو مشاركته برابط أو نشره عاماً بعد المراجعة */
export async function POST(req: Request) {
  const { user } = await viewer(); if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  if ((await prisma.streamLayout.count({ where: { ownerId: user.id } })) >= 200) return NextResponse.json({ error: "limit", message: "وصلت للحد الأعلى (200 تصميم)" }, { status: 400 });
  const s: any = await sanitizePkg(b.pkg, user.id); if (!s.ok) return NextResponse.json({ error: s.error }, { status: 400 });
  const visibility = ["private", "link", "public"].includes(b.visibility) ? b.visibility : "private";
  if (visibility === "public" && !b.rightsConfirmed) return NextResponse.json({ error: "rights_required" }, { status: 400 });
  const auto = visibility === "public" && (await alertsCfg()).autoApprove;
  const name = String(b.name || s.value.name).trim().slice(0, 60) || "تصميم";
  const l = await prisma.streamLayout.create({ data: { code: await newCode(), ownerId: user.id, name, description: String(b.description || "").slice(0, 400), data: { ...s.value, name }, kind: s.value.kind, canvas: s.stats.canvas, shape: s.stats.shape, category: (LS_CATS as any)[b.category] ? b.category : "", widgets: s.stats.widgets, visibility, review: visibility === "public" ? (auto ? "approved" : "pending") : "none", publishedAt: auto ? new Date() : null, designerName: String(b.designerName || user.name || "").slice(0, 40) }, include: { owner: own } as any });
  return NextResponse.json({ ok: true, layout: toClientLayout(l, { id: user.id }), removed: s.removed });
}
