// تفاعلات الآيرت: إعجاب/مفضلة/تقييم/استخدام/بلاغ — تفاعل واحد لكل مستخدم، ولا يمكن تقييم آيرتك أو الإعجاب به (منع التلاعب)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { alCanView, alCanUse, AL_REPORT_REASONS, AL_REPORT_HIDE } from "@/engine/alerts.js";
import { viewer } from "@/server/alerts-svc";

const hits = new Map<string, number[]>();
function limited(k: string, n = 30, ms = 60_000) { const now = Date.now(), a = (hits.get(k) || []).filter(t => now - t < ms); a.push(now); hits.set(k, a); return a.length > n; }

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params; const { user, v } = await viewer(); if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (limited(user.id)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  const b = await req.json().catch(() => ({})), act = String(b.act || "");
  const a = await prisma.alert.findUnique({ where: { id } });
  if (!a || !alCanView(a, v)) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const own = a.ownerId === user.id;
  if (act === "use" || act === "unuse") {
    if (act === "use") {
      if (!alCanUse(a, v)) return NextResponse.json({ error: "not_available" }, { status: 403 });
      const ex = await prisma.alertUse.findUnique({ where: { userId_alertId: { userId: user.id, alertId: id } } });
      if (!ex) { await prisma.alertUse.create({ data: { userId: user.id, alertId: id } }); if (!own) await prisma.alert.update({ where: { id }, data: { uses: { increment: 1 } } }); }
    } else { const d = await prisma.alertUse.deleteMany({ where: { userId: user.id, alertId: id } }); if (d.count && !own && a.uses > 0) await prisma.alert.update({ where: { id }, data: { uses: { decrement: 1 } } }); }
    return NextResponse.json({ ok: true });
  }
  if (act === "report") {
    if (own) return NextResponse.json({ error: "own" }, { status: 400 });
    const reason = AL_REPORT_REASONS[b.reason] ? b.reason : "other";
    const ex = await prisma.alertReport.findUnique({ where: { alertId_userId: { alertId: id, userId: user.id } } });
    if (ex) return NextResponse.json({ ok: true, already: true });
    await prisma.alertReport.create({ data: { alertId: id, userId: user.id, reason, note: String(b.note || "").slice(0, 300) } });
    const u = await prisma.alert.update({ where: { id }, data: { reports: { increment: 1 } } });
    // بلاغات مستقلة كثيرة: يُسحب من العرض العام ويعود للمراجعة حتى يقرر المشرف
    if (u.reports >= AL_REPORT_HIDE && u.review === "approved") await prisma.alert.update({ where: { id }, data: { review: "pending", reviewNote: "سُحب تلقائياً بسبب البلاغات" } });
    return NextResponse.json({ ok: true });
  }
  if (!["like", "fav", "rate"].includes(act)) return NextResponse.json({ error: "bad_act" }, { status: 400 });
  if (own && act !== "fav") return NextResponse.json({ error: "own", message: "لا يمكنك تقييم آيرتك أو الإعجاب به" }, { status: 400 });
  const r = await prisma.alertReaction.findUnique({ where: { userId_alertId: { userId: user.id, alertId: id } } }) || { like: false, fav: false, rating: 0 };
  const next = { like: r.like, fav: r.fav, rating: r.rating };
  if (act === "like") next.like = b.on !== undefined ? !!b.on : !r.like;
  if (act === "fav") next.fav = b.on !== undefined ? !!b.on : !r.fav;
  if (act === "rate") next.rating = Math.max(0, Math.min(5, Math.round(+b.value || 0)));
  const inc: any = {};
  if (next.like !== r.like) inc.likes = { increment: next.like ? 1 : -1 };
  if (next.fav !== r.fav) inc.favs = { increment: next.fav ? 1 : -1 };
  if (next.rating !== r.rating) { inc.ratingSum = { increment: next.rating - r.rating }; inc.ratingCount = { increment: (next.rating ? 1 : 0) - (r.rating ? 1 : 0) }; }
  await prisma.$transaction([
    prisma.alertReaction.upsert({ where: { userId_alertId: { userId: user.id, alertId: id } }, update: next, create: { userId: user.id, alertId: id, ...next } }),
    ...(Object.keys(inc).length ? [prisma.alert.update({ where: { id }, data: inc })] : []),
  ]);
  return NextResponse.json({ ok: true, my: next });
}
