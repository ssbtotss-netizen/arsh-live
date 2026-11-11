// الاستيراد بالكود: يرجع التصميم (الشكل والترتيب فقط). الخاص لا يُفتح لغير مالكه، والملغى/المحذوف 404
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { lsNormCode } from "@/engine/layoutshare.js";
import { viewer } from "@/server/alerts-svc";
import { lsCanImport, toClientLayout } from "@/server/layouts-svc";

const hits = new Map<string, number[]>();
export async function GET(req: Request, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params; const { v } = await viewer();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "x", now = Date.now(), h = (hits.get(ip) || []).filter(t => now - t < 60_000); h.push(now); hits.set(ip, h);
  if (h.length > 30) return NextResponse.json({ error: "rate_limited", message: "محاولات كثيرة — انتظر دقيقة" }, { status: 429 }); // يمنع تخمين الأكواد
  const c = lsNormCode(code); if (!c) return NextResponse.json({ error: "bad_code", message: "صيغة الكود غير صحيحة — مثال: B6O6-7X92KQAB" }, { status: 400 });
  const l = await prisma.streamLayout.findUnique({ where: { code: c }, include: { owner: { select: { name: true, designerVerified: true } } } as any });
  if (!l || !lsCanImport(l, v)) return NextResponse.json({ error: "not_found", message: "الكود غير صالح أو أُلغيت المشاركة أو التصميم خاص" }, { status: 404 });
  return NextResponse.json({ layout: toClientLayout(l, v, { data: true }) }, { headers: { "cache-control": "no-store" } });
}
