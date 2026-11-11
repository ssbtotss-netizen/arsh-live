import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/** بيانات رابط OBS: عامة عبر رمز الرابط فقط (قراءة) */
export async function GET(req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const u = await prisma.user.findUnique({ where: { overlayToken: token } });
  if (!u) return NextResponse.json({ error: "not found" }, { status: 404 });
  const id = new URL(req.url).searchParams.get("layout") || u.activeLayoutId || "";
  const l = (await prisma.layout.findFirst({ where: { id, userId: u.id } })) ?? (await prisma.layout.findFirst({ where: { userId: u.id }, orderBy: { sort: "asc" } }));
  if (!l) return NextResponse.json({ error: "no layout" }, { status: 404 });
  const s: any = u.settings || {};
  return NextResponse.json(
    { layout: { id: l.id, name: l.name, canvas: l.canvas, widgets: l.widgets }, settings: { bigGift: s.bigGift ?? 1000, fx: s.fx !== false }, socials: u.socials || {} },
    { headers: { "cache-control": "no-store" } }
  );
}
