// ميسّر: التحقق من الدفع من خادمنا عبر API (لا نثق بالمتصفح) + Webhook للدفع والاسترجاع
import type { PrismaClient } from "@prisma/client";
import { decrypt } from "../../lib/secrets";
import type { DonationService } from "./service";

export async function fetchPayment(secretKey: string, id: string) {
  const r = await fetch(`https://api.moyasar.com/v1/payments/${encodeURIComponent(id)}`, { headers: { Authorization: "Basic " + Buffer.from(secretKey + ":").toString("base64") } });
  if (!r.ok) throw new Error("moyasar " + r.status);
  return r.json();
}
/** يحوّل دفعة ميسّر المدفوعة إلى تبرع مؤكد بعد مطابقة المبلغ والعملة مع نية التبرع */
export async function confirmPayment(prisma: PrismaClient, svc: DonationService, userId: string, payment: any) {
  const intentId = payment?.metadata?.intent_id;
  const intent = intentId ? await prisma.donationIntent.findFirst({ where: { id: String(intentId), userId } }) : await prisma.donationIntent.findFirst({ where: { paymentId: String(payment.id), userId } });
  if (!intent) return { ok: false, reason: "intent-not-found" };
  if (payment.status !== "paid") return { ok: false, reason: "status-" + payment.status }; // المعلّق أو الفاشل لا يُحتسب
  if (Number(payment.amount) !== intent.amount || String(payment.currency).toUpperCase() !== intent.currency) return { ok: false, reason: "amount-mismatch" };
  await prisma.donationIntent.update({ where: { id: intent.id }, data: { status: "paid", paymentId: String(payment.id) } }).catch(() => {});
  const dec = intent.currency === "KWD" || intent.currency === "BHD" || intent.currency === "OMR" ? 1000 : 100;
  const created = await svc.record(userId, { provider: "moyasar", providerId: String(payment.id), name: intent.name, anonymous: intent.anonymous, amount: intent.amount / dec, currency: intent.currency, message: intent.message });
  return { ok: true, created };
}
export async function providerSecrets(prisma: PrismaClient, userId: string) {
  const p = await prisma.donationProvider.findUnique({ where: { userId_kind: { userId, kind: "moyasar" } } });
  if (!p?.enabled) return null;
  return { pub: (p.publicCfg as any) || {}, sec: decrypt<any>(p.secretEnc) || {} };
}
