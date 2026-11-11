import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { runtime } from "@/lib/runtime";
import { fetchPayment, confirmPayment, providerSecrets } from "@/server/donations/moyasar";
// بعد الرجوع من ميسّر: نتحقق من الدفعة بأنفسنا عبر API قبل احتساب أي تبرع
export async function POST(req: Request) {
  const { paymentId, intentId } = await req.json().catch(() => ({}));
  if (!paymentId || !intentId) return NextResponse.json({ error: "bad request" }, { status: 400 });
  const intent = await prisma.donationIntent.findUnique({ where: { id: String(intentId) } });
  if (!intent) return NextResponse.json({ error: "not found" }, { status: 404 });
  const ps = await providerSecrets(prisma, intent.userId);
  if (!ps?.sec.secretKey) return NextResponse.json({ error: "provider disabled" }, { status: 400 });
  try {
    const pay = await fetchPayment(ps.sec.secretKey, String(paymentId));
    if (pay?.metadata?.intent_id && pay.metadata.intent_id !== intent.id) return NextResponse.json({ ok: false, reason: "intent-mismatch" });
    const r = await confirmPayment(prisma, runtime().donations, intent.userId, { ...pay, metadata: { ...(pay.metadata || {}), intent_id: intent.id } });
    return NextResponse.json(r);
  } catch { return NextResponse.json({ ok: false, reason: "verify-failed" }, { status: 502 }); }
}
