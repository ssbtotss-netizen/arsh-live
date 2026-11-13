// قراءة الشات العام لـ Twitch/YouTube/Kick باسم القناة — بدون تسجيل دخول ولا رموز
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";

const svc = () => (globalThis as any).__b6o6?.pubchat;
export async function POST(req: Request) {
  const u = await currentUser(); if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  if (!svc()) return NextResponse.json({ error: "unavailable", message: "الخدمة غير جاهزة — حاول بعد لحظات" }, { status: 503 });
  const r = await svc().link(u.id, String(b.platform || ""), String(b.channel || ""));
  if (!r.ok) return NextResponse.json({ ...r, message: r.error === "bad_channel" ? "اسم القناة أو الرابط غير صالح" : "منصة غير مدعومة" }, { status: 400 });
  return NextResponse.json(r);
}
export async function DELETE(req: Request) {
  const u = await currentUser(); if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const p = new URL(req.url).searchParams.get("platform") || "";
  if (!["twitch", "youtube", "kick"].includes(p)) return NextResponse.json({ error: "bad_platform" }, { status: 400 });
  await svc()?.unlink(u.id, p);
  return NextResponse.json({ ok: true });
}
