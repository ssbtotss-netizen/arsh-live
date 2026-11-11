// إشراف سوق الآيرتات (ADMIN_EMAILS فقط): قائمة المراجعة والبلاغات، اعتماد/رفض/حذف/استرجاع، توثيق مصمم، وضع المراجعة
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { viewer, toClient, alertsCfg, setAlertsCfg, ownerSel } from "@/server/alerts-svc";

async function guard() { const { user, v } = await viewer(); if (!user) return [null, NextResponse.json({ error: "unauthorized" }, { status: 401 })] as const; if (!v!.admin) return [null, NextResponse.json({ error: "forbidden" }, { status: 403 })] as const; return [user, null] as const; }

export async function GET(req: Request) {
  const [a, err] = await guard(); if (err) return err;
  const tab = new URL(req.url).searchParams.get("tab") || "pending";
  const where: any = tab === "reported" ? { reports: { gt: 0 } } : tab === "removed" ? { removed: true } : tab === "approved" ? { visibility: "public", review: "approved", removed: false } : { visibility: "public", review: "pending", removed: false };
  const [rows, counts, cfg] = await Promise.all([
    prisma.alert.findMany({ where, orderBy: { updatedAt: "desc" }, take: 200, include: { owner: { select: { name: true, email: true, designerVerified: true } }, reportsBy: { where: { status: "open" }, take: 20, orderBy: { createdAt: "desc" } } } }),
    Promise.all([prisma.alert.count({ where: { visibility: "public", review: "pending", removed: false } }), prisma.alert.count({ where: { reports: { gt: 0 } } }), prisma.alert.count({ where: { visibility: "public", review: "approved", removed: false } }), prisma.alert.count()]),
    alertsCfg(),
  ]);
  return NextResponse.json({ cfg, counts: { pending: counts[0], reported: counts[1], approved: counts[2], total: counts[3] }, items: rows.map(r => ({ ...toClient(r, { id: r.ownerId }), ownerEmail: r.owner.email, reports: r.reports, reportList: r.reportsBy })) });
}
export async function PUT(req: Request) {
  const [a, err] = await guard(); if (err) return err;
  const b = await req.json().catch(() => ({})), id = String(b.id || ""), action = String(b.action || ""), note = String(b.note || "").slice(0, 300);
  if (action === "verifyDesigner") { await prisma.user.update({ where: { id: String(b.userId) }, data: { designerVerified: !!b.on } }); await prisma.auditLog.create({ data: { userId: a!.id, kind: "admin.designer", detail: { by: a!.email, userId: b.userId, on: !!b.on } } }); return NextResponse.json({ ok: true }); }
  const x = await prisma.alert.findUnique({ where: { id } }); if (!x) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const data: any = action === "approve" ? { review: "approved", reviewNote: note || null, publishedAt: x.publishedAt || new Date(), removed: false }
    : action === "reject" ? { review: "rejected", reviewNote: note || "لم يُعتمد", publishedAt: null }
    : action === "remove" ? { removed: true, reviewNote: note || "حُذف من الإدارة" }
    : action === "restore" ? { removed: false, review: x.visibility === "public" ? "pending" : "none" }
    : action === "clearReports" ? { reports: 0 } : null;
  if (!data) return NextResponse.json({ error: "bad_action" }, { status: 400 });
  if (action === "approve" && x.visibility !== "public") return NextResponse.json({ error: "private", message: "الآيرت خاص — لا يمكن نشره بدون اختيار صاحبه" }, { status: 400 });
  await prisma.alert.update({ where: { id }, data });
  if (action === "clearReports" || action === "approve" || action === "remove") await prisma.alertReport.updateMany({ where: { alertId: id, status: "open" }, data: { status: "resolved" } });
  await prisma.auditLog.create({ data: { userId: a!.id, kind: "admin.alert", detail: { by: a!.email, id, action, note } } });
  return NextResponse.json({ ok: true });
}
export async function PATCH(req: Request) {
  const [a, err] = await guard(); if (err) return err;
  const cfg = await setAlertsCfg(await req.json().catch(() => ({})));
  await prisma.auditLog.create({ data: { userId: a!.id, kind: "admin.alerts.cfg", detail: { by: a!.email, ...cfg } } });
  return NextResponse.json({ ok: true, cfg });
}
