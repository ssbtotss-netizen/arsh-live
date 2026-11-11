import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { runtime } from "@/lib/runtime";
import { safeEqual } from "@/lib/secrets";
import { confirmPayment, fetchPayment, providerSecrets } from "@/server/donations/moyasar";
// Webhook ميسّر: نتحقق من secret_token، ثم نعيد جلب الدفعة من API ميسّر (مصدر الحقيقة) قبل أي تغيير
export async function POST(req: Request, ctx: { params: Promise<{ hook: string }> }) {
  const { hook } = await ctx.params;
  const u = await prisma.user.findUnique({ where: { donateSlug: hook } });
  if (!u) return NextResponse.json({ ok: true }); // لا نكشف وجود الحساب
  const body = await req.json().catch(() => null);
  const ps = await providerSecrets(prisma, u.id);
  if (!body || !ps?.sec.webhookSecret || !safeEqual(String(body.secret_token || ""), ps.sec.webhookSecret)) return NextResponse.json({ error: "invalid" }, { status: 401 });
  const id = body?.data?.id; if (!id) return NextResponse.json({ ok: true });
  const svc = runtime().donations;
  try {
    const pay = await fetchPayment(ps.sec.secretKey, String(id));
    if (body.type === "payment_paid" && pay.status === "paid") await confirmPayment(prisma, svc, u.id, pay);
    if (body.type === "payment_refunded" || body.type === "payment_voided" || pay.status === "refunded" || pay.status === "voided") {
      const dec = 100; // ميسّر يعيد المبالغ بالهللة
      const refunded = pay.status === "voided" ? Number(pay.amount) : Number(pay.refunded ?? pay.amount);
      await svc.refund("moyasar", String(pay.id), refunded / dec);
    }
  } catch { return NextResponse.json({ error: "retry" }, { status: 500 }); } // ميسّر يعيد المحاولة تلقائياً
  return NextResponse.json({ ok: true });
}
