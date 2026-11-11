// إحصائيات النقرات على روابط البايو (بدون بيانات شخصية للزائر)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
export async function POST(req: Request, { params }: { params: { handle: string } }) {
  const b = await req.json().catch(() => ({})); const k = String(b.k || "").slice(0, 20); if (!k) return NextResponse.json({ ok: false }, { status: 400 });
  const u = await prisma.user.findUnique({ where: { bioHandle: params.handle.toLowerCase() }, select: { id: true, bio: true } }); if (!u) return NextResponse.json({ ok: false }, { status: 404 });
  const bio: any = u.bio || {}; const stats = bio.stats || { visits: 0, clicks: {} }; stats.clicks = stats.clicks || {}; stats.clicks[k] = (stats.clicks[k] || 0) + 1;
  await prisma.user.update({ where: { id: u.id }, data: { bio: { ...bio, stats } } }); return NextResponse.json({ ok: true });
}
