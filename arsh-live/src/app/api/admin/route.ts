// لوحة الإدارة: للمشرفين في ADMIN_EMAILS فقط. تحكم كامل بالتجربة والسعر والاشتراكات — بدون كشف كلمات مرور أو مفاتيح.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { currentUser, isAdmin, token } from "@/lib/auth";
import { subStatus, extendPlan, trialEnd } from "@/engine/plans.js";
import { getBilling, setBilling } from "@/server/appconfig";

async function guard() { const u = await currentUser(); if (!u) return [null, NextResponse.json({ error: "unauthorized" }, { status: 401 })] as const; if (!isAdmin(u)) return [null, NextResponse.json({ error: "forbidden" }, { status: 403 })] as const; return [u, null] as const; }

export async function GET(req: Request) {
  const [, err] = await guard(); if (err) return err;
  const cfg = await getBilling(), q = new URL(req.url).searchParams.get("q") || "";
  const where = q ? { OR: [{ email: { contains: q, mode: "insensitive" as const } }, { name: { contains: q, mode: "insensitive" as const } }] } : {};
  const [users, total, disabled, subs, revenue, live, all] = await Promise.all([
    prisma.user.findMany({ where, orderBy: { createdAt: "desc" }, take: 200, select: { id: true, email: true, name: true, plan: true, planUntil: true, trialEndsAt: true, disabled: true, createdAt: true, lastSeenAt: true, _count: { select: { layouts: true, connections: true, streamSessions: true } } } }),
    prisma.user.count(), prisma.user.count({ where: { disabled: true } }),
    prisma.subscription.findMany({ orderBy: { createdAt: "desc" }, take: 50, include: { user: { select: { email: true } } } }),
    prisma.subscription.aggregate({ _sum: { amountUsd: true }, where: { provider: "stripe" } }),
    prisma.streamSession.count({ where: { status: "live" } }),
    prisma.user.findMany({ select: { plan: true, planUntil: true, trialEndsAt: true, createdAt: true } }),
  ]);
  const byState: Record<string, number> = { trial: 0, active: 0, comp: 0, expired: 0 }; for (const u of all) byState[subStatus(u, cfg).state]++;
  return NextResponse.json({ cfg, stats: { total, disabled, liveSessions: live, revenueUsd: revenue._sum.amountUsd || 0, byState }, users: users.map(u => ({ ...u, status: subStatus(u, cfg) })), subscriptions: subs });
}
/** إعدادات الاشتراك العامة: مدة التجربة، تفعيلها، السعر الشهري، حدود ما بعد التجربة */
export async function PATCH(req: Request) {
  const [a, err] = await guard(); if (err) return err;
  const b = await req.json().catch(() => ({}));
  const patch: any = {}; if (b.trialEnabled !== undefined) patch.trialEnabled = !!b.trialEnabled; if (b.trialDays !== undefined) patch.trialDays = +b.trialDays; if (b.priceUsd !== undefined) patch.priceUsd = +b.priceUsd;
  if (b.expiredLimits) patch.expiredLimits = b.expiredLimits; if (Array.isArray(b.perks)) patch.perks = b.perks;
  const cfg = await setBilling(patch);
  await prisma.auditLog.create({ data: { userId: a!.id, kind: "admin.billing", detail: { by: a!.email, ...patch } } });
  return NextResponse.json({ ok: true, cfg });
}
/** إجراءات على مستخدم: تمديد/إنهاء التجربة، منح أشهر، إلغاء الاشتراك، إيقاف الحساب */
export async function PUT(req: Request) {
  const [a, err] = await guard(); if (err) return err;
  const cfg = await getBilling(), b = await req.json().catch(() => ({})), u = await prisma.user.findUnique({ where: { id: String(b.userId) } });
  if (!u) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const now = Date.now(), data: any = {};
  if (b.disabled !== undefined) { if (u.id === a!.id) return NextResponse.json({ error: "لا يمكنك إيقاف حسابك" }, { status: 400 }); data.disabled = !!b.disabled; }
  if (b.trialDays !== undefined) { const d = Math.max(0, Math.min(365, +b.trialDays || 0)); const base = Math.max(now, trialEnd(u, cfg)); data.trialEndsAt = new Date(base + d * 864e5); }
  if (b.endTrial) data.trialEndsAt = new Date(now);
  if (b.grantMonths) { const m = Math.max(1, Math.min(24, +b.grantMonths)); const nx = extendPlan(u, m, now, "pro"); data.plan = "pro"; data.planUntil = new Date(nx.planUntil);
    await prisma.subscription.create({ data: { userId: u.id, plan: "pro", months: m, amountUsd: 0, provider: "admin", providerRef: "admin:" + token(9) } }); }
  if (b.cancel) { data.plan = "free"; data.planUntil = new Date(now); }
  await prisma.user.update({ where: { id: u.id }, data });
  if (data.disabled) await prisma.session.deleteMany({ where: { userId: u.id } });
  await prisma.auditLog.create({ data: { userId: u.id, kind: "admin.update", detail: { by: a!.email, ...b, userId: undefined } } });
  return NextResponse.json({ ok: true });
}
