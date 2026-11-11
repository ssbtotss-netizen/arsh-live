// حالة ربط المنصات الأربع للمستخدم الحالي — لا تُرسل أي رموز للمتصفح
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { oauthMissing } from "@/engine/platforms.js";

export async function GET() {
  const u = await currentUser(); if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const rows = await prisma.platformConnection.findMany({ where: { userId: u.id } });
  const out: any = {};
  for (const p of ["tiktok", "youtube", "kick", "twitch"]) {
    const r = rows.find(x => x.platform === p);
    out[p] = { configured: p === "tiktok" ? true : oauthMissing(p, process.env as any).length === 0, status: r?.status || "disconnected", accountName: r?.accountName || null, avatarUrl: r?.avatarUrl || null, lastEventAt: r?.lastEventAt || null, lastError: r?.lastError || null };
  }
  return NextResponse.json({ connections: out });
}
export async function DELETE(req: Request) {
  const u = await currentUser(); if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const p = new URL(req.url).searchParams.get("platform") || "";
  if (!["youtube", "kick", "twitch"].includes(p)) return NextResponse.json({ error: "bad_platform" }, { status: 400 });
  await (globalThis as any).__b6o6?.platforms?.stop(u.id, p);
  return NextResponse.json({ ok: true });
}
