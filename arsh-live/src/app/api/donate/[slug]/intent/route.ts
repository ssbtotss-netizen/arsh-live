import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/db";
// نية تبرع: نثبّت المبلغ والاسم والرسالة على الخادم قبل الدفع، ثم نطابقها مع دفعة ميسّر
export async function POST(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const u = await prisma.user.findUnique({ where: { donateSlug: slug } });
  if (!u) return NextResponse.json({ error: "not found" }, { status: 404 });
  const b = await req.json().catch(() => ({}));
  const sar = Math.round(Number(b.amount) * 100) / 100;
  if (!(sar >= 1 && sar <= 20000)) return NextResponse.json({ error: "المبلغ بين 1 و 20,000 ريال" }, { status: 400 });
  const id = "di_" + randomUUID().replace(/-/g, "");
  await prisma.donationIntent.create({ data: { id, userId: u.id, amount: Math.round(sar * 100), currency: "SAR", name: String(b.name || "").trim().slice(0, 40), anonymous: !!b.anonymous, message: String(b.message || "").trim().slice(0, 200) } });
  return NextResponse.json({ intentId: id, amount: Math.round(sar * 100) });
}
