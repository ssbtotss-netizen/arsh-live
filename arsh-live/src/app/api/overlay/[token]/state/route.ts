// حالة الأهداف لرابط OBS (بديل عند تعذر WebSocket): الدونيشن المؤكدة من قاعدة البيانات + إعدادات الأهداف. قراءة فقط عبر رمز الرابط، بدون أي مفاتيح
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { runtime } from "@/lib/runtime";

// ذاكرة مؤقتة قصيرة لكل رابط: عدة مصادر بث (مشاهد/عناصر) تطلب نفس الحالة — كانت تُرفض بـ 429 فلا يتحدث بعضها
const cache = new Map<string, { at: number; body: any }>();
export async function GET(_: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const u = await prisma.user.findUnique({ where: { overlayToken: token }, select: { id: true, donCfg: true } });
  if (!u) return NextResponse.json({ error: "not found" }, { status: 404 });
  const c = cache.get(token); if (c && Date.now() - c.at < 2000) return NextResponse.json(c.body, { headers: { "cache-control": "no-store" } });
  const list = await runtime().donations.load(u.id);
  // روابط OBS: الاسم والمبلغ والرسالة فقط
  const body = { DN: { list: list.map(d => ({ id: d.id, name: d.anonymous ? "" : d.name, anonymous: d.anonymous, avatar: d.anonymous ? "" : d.avatar, amount: d.amount, currency: d.currency, message: d.message, status: d.status, refunded: d.refunded, test: false, t: d.t })), sessionStart: Date.now() }, donCfg: u.donCfg || {}, now: Date.now() };
  cache.set(token, { at: Date.now(), body }); if (cache.size > 2000) cache.clear();
  return NextResponse.json(body, { headers: { "cache-control": "no-store" } });
}
