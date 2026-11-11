import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getBilling } from "@/server/appconfig";
import { checkPassword, createSession, destroySession, hashPassword, token } from "@/lib/auth";
import { defaultLayouts } from "@/lib/core";

export async function POST(req: Request) {
  const { action, email, password, name } = await req.json().catch(() => ({}));
  const em = String(email || "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(em) || String(password || "").length < 8)
    return NextResponse.json({ error: "البريد غير صحيح أو كلمة المرور أقل من 8 أحرف" }, { status: 400 });

  if (action === "register") {
    if (await prisma.user.findUnique({ where: { email: em } }))
      return NextResponse.json({ error: "البريد مسجل مسبقاً" }, { status: 409 });
    const layouts = defaultLayouts();
    const bc = await getBilling();
    const user = await prisma.user.create({
      data: {
        trialEndsAt: bc.trialEnabled && bc.trialDays > 0 ? new Date(Date.now() + bc.trialDays * 864e5) : new Date(),
        email: em, name: String(name || "صانع محتوى").slice(0, 60), passwordHash: hashPassword(password),
        overlayToken: "ov_" + token(12), editKey: "ek_" + token(24), activeLayoutId: layouts[0].id,
        settings: { bigGift: 1000, fx: true, tiktok: "" },
        layouts: { create: layouts.map((l: any, i: number) => ({ id: l.id, name: l.name, canvas: l.canvas, widgets: l.widgets, sort: i })) },
      },
    });
    await createSession(user.id);
    return NextResponse.json({ ok: true });
  }
  const user = await prisma.user.findUnique({ where: { email: em } });
  if (!user || !checkPassword(password, user.passwordHash))
    return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 });
  await createSession(user.id);
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await destroySession();
  return NextResponse.json({ ok: true });
}
