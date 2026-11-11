// لوحة الإدارة: للمشرفين المحددين في ADMIN_EMAILS فقط. لا تُعرض كلمات المرور أو المفاتيح.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { currentUser, isAdmin, token } from "@/lib/auth";
import { PLANS, planOf, extendPlan, effectivePlan } from "@/engine/plans.js";

async function guard() { const u = await currentUser(); if (!u) return [null, NextResponse.json({ error: "unauthorized" }, { status: 401 })] as const; if (!isAdmin(u)) return [null, NextResponse.json({ error: "forbidden" }, { status: 403 })] as const; return [u, null] as const; }

export async function GET(req: Request) {
  const [a, err] = await guard(); if (err) return err;
  const q = new URL(req.url).searchParams.get("q") || "";
  const where = q ? { OR: [{ email: { contains: q, mode: "insensitive" as const } }, { name: { contains: q, mode: "insensitive" as const } }] } : {};
  const [users, total, disabled, subs, revenue, live] = await Promise.all([
    prisma.user.findMany({ where, orderBy: { createdAt: "desc" }, take: 200, select: { id: true, email: true, name: true, plan: true, planUntil: true, disabled: true, createdAt: true, lastSeenAt: true, bioHandle: true, _count: { select: { layouts: true, connections: true, streamSessions: true } } } }),
    prisma.user.count(), prisma.user.count({ where: { disabled: true } }),
    prisma.subscription.findMany({ orderBy: { createdAt: "desc" }, take: 50, include: { user: { select: { email: true } } } }),
    prisma.subscription.aggregate({ _sum: { amountUsd: true }, where: { provider: "stripe" } }),
    prisma.streamSession.count({ where: { status: "live" } }),
  ]);
  const byPlan: Record<string, number> = {}; for (const p of PLANS) byPlan[p.id] = 0;
  for (const u of await prisma.user.findMany({ select: { plan: true, planUntil: true } })) byPlan[effectivePlan(u).id]++;
  return NextResponse.json({ stats: { total, disabled, liveSessions: live, revenueUsd: revenue._sum.amountUsd || 0, byPlan }, users: users.map(u => ({ ...u, effective: effectivePlan(u).id })), subscriptions: subs });
}
export async function PUT(req: Request) {
  const [a, err] = await guard(); if (err) return err;
  const b = await req.json().catch(() => ({})); const u = await prisma.user.findUnique({ where: { id: String(b.userId) } });
  if (!u) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (b.disabled !== undefined) {
    if (u.id === a!.id) return NextResponse.json({ error: "لا يمكنك إيقاف حسابك" }, { status: 400 });
    await prisma.user.update({ where: { id: u.id }, data: { disabled: !!b.disabled } });
    if (b.disabled) await prisma.session.deleteMany({ where: { userId: u.id } });
  }
  if (b.plan) { // منح/سحب يدوي من الإدارة — يُسجَّل بمبلغ 0 ومصدر admin
    const p = planOf(b.plan); if (p.id !== b.plan) return NextResponse.json({ error: "bad_plan" }, { status: 400 });
    const months = Math.max(1, Math.min(24, +b.months || 1));
    const next = p.id === "free" ? { plan: "free", planUntil: null } : extendPlan(u, p.id, months);
    await prisma.user.update({ where: { id: u.id }, data: { plan: next.plan, planUntil: next.planUntil ? new Date(next.planUntil) : null } });
    if (p.id !== "free") await prisma.subscription.create({ data: { userId: u.id, plan: p.id, months, amountUsd: 0, provider: "admin", providerRef: "admin:" + token(9) } });
  }
  await prisma.auditLog.create({ data: { userId: u.id, kind: "admin.update", detail: { by: a!.email, disabled: b.disabled, plan: b.plan, months: b.months } } });
  return NextResponse.json({ ok: true });
}
