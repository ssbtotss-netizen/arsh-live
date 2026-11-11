// إعدادات قنوات Discord/Telegram — الأسرار تُحفظ مشفّرة ولا تُعاد للمتصفح
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { notifyDefaults } from "@/engine/notify.js";

export async function GET() {
  const u = await currentUser(); if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const ch = await prisma.notifyChannel.findMany({ where: { userId: u.id } });
  const logs = await prisma.notifyLog.findMany({ where: { userId: u.id }, orderBy: { at: "desc" }, take: 40 });
  return NextResponse.json({ channels: Object.fromEntries(["discord", "telegram"].map(k => { const c = ch.find(x => x.kind === k); return [k, c ? { connected: true, enabled: c.enabled, label: c.label, events: { ...notifyDefaults(), ...(c.events as any) } } : { connected: false, events: notifyDefaults() }]; })), logs });
}
export async function PUT(req: Request) {
  const u = await currentUser(); if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => ({})); if (!["discord", "telegram"].includes(b.kind)) return NextResponse.json({ error: "bad_kind" }, { status: 400 });
  const svc = (globalThis as any).__b6o6?.notify; if (!svc) return NextResponse.json({ error: "server" }, { status: 503 });
  try { await svc.save(u.id, b.kind, { secret: b.secret, label: b.label, enabled: b.enabled, events: b.events }); return NextResponse.json({ ok: true }); }
  catch (e: any) { return NextResponse.json({ error: String(e.message || e) }, { status: 400 }); }
}
export async function POST(req: Request) {
  const u = await currentUser(); if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => ({})); const svc = (globalThis as any).__b6o6?.notify; if (!svc) return NextResponse.json({ error: "server" }, { status: 503 });
  const res = await svc.send(u.id, b.event || "custom", { text: b.text || "رسالة تجربة من B6O6 Streaming ✅", name: u.name, url: b.url || "" }, { force: true, only: b.kind });
  return NextResponse.json({ results: res });
}
