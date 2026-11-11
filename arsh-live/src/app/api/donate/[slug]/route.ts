import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
// بيانات صفحة التبرع العامة: الاسم ومفتاح ميسّر العام فقط
export async function GET(_: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const u = await prisma.user.findUnique({ where: { donateSlug: slug } });
  if (!u) return NextResponse.json({ error: "not found" }, { status: 404 });
  const p = await prisma.donationProvider.findUnique({ where: { userId_kind: { userId: u.id, kind: "moyasar" } } });
  if (!p?.enabled) return NextResponse.json({ name: u.name, enabled: false });
  return NextResponse.json({ name: u.name, enabled: true, publishableKey: (p.publicCfg as any).publishableKey, currency: "SAR", min: 1, max: 20000,
    formJs: process.env.MOYASAR_FORM_JS, formCss: process.env.MOYASAR_FORM_CSS });
}
