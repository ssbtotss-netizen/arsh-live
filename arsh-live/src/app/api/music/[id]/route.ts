// تعديل اسم الأغنية/الفنان أو حذفها — تُحدَّث مكتبة البث فوراً
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { musicSvc, removeTrack } from "@/server/music-store";
export const dynamic = "force-dynamic";
const clean = (s: any, n: number) => String(s ?? "").replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, n);
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const u = await currentUser(); if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params; const b = await req.json().catch(() => ({}));
  const title = clean(b.title, 120); if (!title) return NextResponse.json({ error: "title" }, { status: 400 });
  const r = await prisma.musicTrack.updateMany({ where: { id, ownerId: u.id }, data: { title, artist: clean(b.artist, 80) } });
  if (!r.count) return NextResponse.json({ error: "not_found" }, { status: 404 });
  await musicSvc.refresh(u.id, u.overlayToken); return NextResponse.json({ ok: true });
}
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const u = await currentUser(); if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params; if (!(await removeTrack(u.id, id))) return NextResponse.json({ error: "not_found" }, { status: 404 });
  await musicSvc.refresh(u.id, u.overlayToken); return NextResponse.json({ ok: true });
}
