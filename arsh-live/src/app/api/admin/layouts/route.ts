// مراجعة تصاميم البث (ADMIN_EMAILS فقط)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { viewer } from "@/server/alerts-svc";
import { toClientLayout } from "@/server/layouts-svc";

async function guard() { const { user, v } = await viewer(); if (!user) return [null, NextResponse.json({ error: "unauthorized" }, { status: 401 })] as const; if (!v!.admin) return [null, NextResponse.json({ error: "forbidden" }, { status: 403 })] as const; return [user, null] as const; }
export async function GET(req: Request) {
  const [a, err] = await guard(); if (err) return err; const tab = new URL(req.url).searchParams.get("tab") || "pending";
  const where: any = tab === "reported" ? { reports: { gt: 0 } } : tab === "removed" ? { removed: true } : tab === "approved" ? { visibility: "public", review: "approved", removed: false } : { visibility: "public", review: "pending", removed: false };
  const rows = await prisma.streamLayout.findMany({ where, orderBy: { updatedAt: "desc" }, take: 200, include: { owner: { select: { name: true, email: true, designerVerified: true } }, reportsBy: { where: { status: "open" }, take: 20 } } as any });
  return NextResponse.json({ items: rows.map((l: any) => ({ ...toClientLayout(l, { admin: true }, { data: true }), ownerEmail: l.owner.email, reports: l.reports, reportList: l.reportsBy })) });
}
export async function PUT(req: Request) {
  const [a, err] = await guard(); if (err) return err; const b = await req.json().catch(() => ({})), id = String(b.id || ""), action = String(b.action || ""), note = String(b.note || "").slice(0, 300);
  const l = await prisma.streamLayout.findUnique({ where: { id } }); if (!l) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (action === "approve" && l.visibility !== "public") return NextResponse.json({ error: "private", message: "التصميم ليس عاماً — لا يُنشر بدون اختيار صاحبه" }, { status: 400 });
  const data: any = action === "approve" ? { review: "approved", reviewNote: note || null, publishedAt: l.publishedAt || new Date(), removed: false } : action === "reject" ? { review: "rejected", reviewNote: note || "لم يُعتمد", publishedAt: null } : action === "remove" ? { removed: true, reviewNote: note || "حُذف من الإدارة" } : action === "restore" ? { removed: false, review: l.visibility === "public" ? "pending" : "none" } : action === "clearReports" ? { reports: 0 } : null;
  if (!data) return NextResponse.json({ error: "bad_action" }, { status: 400 });
  await prisma.streamLayout.update({ where: { id }, data }); await prisma.layoutReport.updateMany({ where: { layoutId: id, status: "open" }, data: { status: "resolved" } }).catch(() => {});
  await prisma.auditLog.create({ data: { userId: a!.id, kind: "admin.layout", detail: { by: a!.email, id, action, note } } });
  return NextResponse.json({ ok: true });
}
