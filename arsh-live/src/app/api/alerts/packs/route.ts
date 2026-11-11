// الحزم: مجموعات آيرتات يصنعها المستخدم. الحزمة العامة لا تعرض إلا الآيرتات العامة المعتمدة داخلها
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { alIsListed } from "@/engine/alerts.js";
import { viewer } from "@/server/alerts-svc";

export async function GET(req: Request) {
  const { user } = await viewer(); const mine = new URL(req.url).searchParams.get("mine") === "1";
  if (mine && !user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const packs = await prisma.alertPack.findMany({ where: mine ? { ownerId: user!.id } : { visibility: "public" }, orderBy: { createdAt: "desc" }, take: 200 });
  const all = [...new Set(packs.flatMap(p => p.alertIds))];
  const rows = await prisma.alert.findMany({ where: { id: { in: all } }, select: { id: true, ownerId: true, visibility: true, review: true, removed: true, name: true } });
  return NextResponse.json({ packs: packs.map(p => ({ ...p, alertIds: p.alertIds.filter(id => { const a = rows.find(r => r.id === id); return a && (alIsListed(a) || (mine && a.ownerId === user!.id)); }) })) });
}
export async function POST(req: Request) {
  const { user } = await viewer(); if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => ({})); const name = String(b.name || "").trim().slice(0, 60); if (!name) return NextResponse.json({ error: "name_required" }, { status: 400 });
  const ids = (Array.isArray(b.alertIds) ? b.alertIds : []).map(String).slice(0, 40);
  // داخل الحزمة: آيرتاتي أو آيرتات عامة معتمدة فقط
  const rows = await prisma.alert.findMany({ where: { id: { in: ids } }, select: { id: true, ownerId: true, visibility: true, review: true, removed: true } });
  const ok = ids.filter((id: string) => rows.some(r => r.id === id && (r.ownerId === user.id || alIsListed(r))));
  const data = { name, description: String(b.description || "").slice(0, 300), alertIds: ok, visibility: b.visibility === "public" ? "public" : "private" };
  const p = b.id ? await prisma.alertPack.updateMany({ where: { id: String(b.id), ownerId: user.id }, data }) : await prisma.alertPack.create({ data: { ...data, ownerId: user.id } });
  return NextResponse.json({ ok: true, pack: p });
}
export async function DELETE(req: Request) {
  const { user } = await viewer(); if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  await prisma.alertPack.deleteMany({ where: { id: String(new URL(req.url).searchParams.get("id") || ""), ownerId: user.id } });
  return NextResponse.json({ ok: true });
}
