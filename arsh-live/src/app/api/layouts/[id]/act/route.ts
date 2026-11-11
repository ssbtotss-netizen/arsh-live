// تفاعلات التصاميم: إعجاب/مفضلة/تقييم/استيراد/بلاغ — مرة واحدة لكل مستخدم، والمالك لا يرفع أرقام تصميمه
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { AL_REPORT_REASONS, AL_REPORT_HIDE } from "@/engine/alerts.js";
import { viewer } from "@/server/alerts-svc";
import { lsCanView, lsCanImport } from "@/server/layouts-svc";

const hits = new Map<string, number[]>();
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params; const { user, v } = await viewer(); if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const now = Date.now(), h = (hits.get(user.id) || []).filter(t => now - t < 60_000); h.push(now); hits.set(user.id, h); if (h.length > 40) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  const b = await req.json().catch(() => ({})), act = String(b.act || "");
  const l = await prisma.streamLayout.findUnique({ where: { id } }); if (!l || !(lsCanView(l, v) || lsCanImport(l, v))) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const own = l.ownerId === user.id;
  if (act === "use") { if (!own) { const ex = await prisma.layoutUse.findUnique({ where: { userId_layoutId: { userId: user.id, layoutId: id } } }); if (!ex) { await prisma.layoutUse.create({ data: { userId: user.id, layoutId: id } }); await prisma.streamLayout.update({ where: { id }, data: { uses: { increment: 1 } } }); } } return NextResponse.json({ ok: true }); }
  if (act === "report") { if (own) return NextResponse.json({ error: "own" }, { status: 400 }); const reason = (AL_REPORT_REASONS as any)[b.reason] ? b.reason : "other";
    if (await prisma.layoutReport.findUnique({ where: { layoutId_userId: { layoutId: id, userId: user.id } } })) return NextResponse.json({ ok: true, already: true });
    await prisma.layoutReport.create({ data: { layoutId: id, userId: user.id, reason, note: String(b.note || "").slice(0, 300) } }); const u = await prisma.streamLayout.update({ where: { id }, data: { reports: { increment: 1 } } });
    if (u.reports >= AL_REPORT_HIDE && u.review === "approved") await prisma.streamLayout.update({ where: { id }, data: { review: "pending", reviewNote: "سُحب تلقائياً بسبب البلاغات" } }); return NextResponse.json({ ok: true }); }
  if (!["like", "fav", "rate"].includes(act)) return NextResponse.json({ error: "bad_act" }, { status: 400 });
  if (own && act !== "fav") return NextResponse.json({ error: "own", message: "لا يمكنك تقييم تصميمك أو الإعجاب به" }, { status: 400 });
  const r = (await prisma.layoutReaction.findUnique({ where: { userId_layoutId: { userId: user.id, layoutId: id } } })) || { like: false, fav: false, rating: 0 };
  const next = { like: r.like, fav: r.fav, rating: r.rating };
  if (act === "like") next.like = !r.like; if (act === "fav") next.fav = !r.fav; if (act === "rate") next.rating = Math.max(0, Math.min(5, Math.round(+b.value || 0)));
  const inc: any = {}; if (next.like !== r.like) inc.likes = { increment: next.like ? 1 : -1 }; if (next.fav !== r.fav) inc.favs = { increment: next.fav ? 1 : -1 };
  if (next.rating !== r.rating) { inc.ratingSum = { increment: next.rating - r.rating }; inc.ratingCount = { increment: (next.rating ? 1 : 0) - (r.rating ? 1 : 0) }; }
  await prisma.$transaction([prisma.layoutReaction.upsert({ where: { userId_layoutId: { userId: user.id, layoutId: id } }, update: next, create: { userId: user.id, layoutId: id, ...next } }), ...(Object.keys(inc).length ? [prisma.streamLayout.update({ where: { id }, data: inc })] : [])]);
  return NextResponse.json({ ok: true, my: next });
}
