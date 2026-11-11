// الدفع عبر Stripe Checkout (REST مباشرة بدون مكتبات). لا تفعيل لأي باقة إلا بعد Webhook موقّع ومطابقة المبلغ.
import { prisma } from "@/lib/db";
import { planOf, extendPlan } from "@/engine/plans.js";
export { verifyStripe } from "./stripe-sig";

export const billingConfigured = () => !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET);
export const MONTH_OPTIONS = [1, 3, 12];

export async function createCheckout(user: { id: string; email: string }, planId: string, months: number, origin: string) {
  const plan = planOf(planId); if (plan.id !== planId || !plan.price) throw new Error("bad_plan");
  if (!MONTH_OPTIONS.includes(months)) throw new Error("bad_months");
  const key = process.env.STRIPE_SECRET_KEY; if (!key) throw new Error("payments_not_configured");
  const f = new URLSearchParams({
    mode: "payment", customer_email: user.email, client_reference_id: user.id,
    success_url: `${origin}/dashboard#billing-ok`, cancel_url: `${origin}/dashboard#billing-cancel`,
    "line_items[0][quantity]": "1", "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][unit_amount]": String(Math.round(plan.price * months * 100)),
    "line_items[0][price_data][product_data][name]": `B6O6 Streaming — ${plan.name} (${months} شهر)`,
    "metadata[userId]": user.id, "metadata[plan]": plan.id, "metadata[months]": String(months),
  });
  const r = await fetch("https://api.stripe.com/v1/checkout/sessions", { method: "POST", headers: { authorization: `Bearer ${key}`, "content-type": "application/x-www-form-urlencoded" }, body: f });
  const j: any = await r.json(); if (!r.ok) throw new Error(j?.error?.message || "stripe_error");
  return j.url as string;
}

/** تفعيل الاشتراك بعد دفع مؤكد — مرة واحدة لكل جلسة دفع */
export async function activate(sess: any) {
  if (sess.payment_status !== "paid") return "not_paid";
  const m = sess.metadata || {}, plan = planOf(m.plan), months = +m.months || 1;
  if (plan.id !== m.plan || !MONTH_OPTIONS.includes(months)) return "bad_meta";
  if (sess.amount_total !== Math.round(plan.price * months * 100) || String(sess.currency).toLowerCase() !== "usd") return "amount_mismatch";
  const u = await prisma.user.findUnique({ where: { id: m.userId } }); if (!u) return "no_user";
  if (await prisma.subscription.findUnique({ where: { providerRef: sess.id } })) return "duplicate";
  const next = extendPlan(u, plan.id, months);
  await prisma.$transaction([
    prisma.subscription.create({ data: { userId: u.id, plan: plan.id, months, amountUsd: sess.amount_total / 100, provider: "stripe", providerRef: sess.id } }),
    prisma.user.update({ where: { id: u.id }, data: { plan: next.plan, planUntil: new Date(next.planUntil) } }),
    prisma.auditLog.create({ data: { userId: u.id, kind: "billing.paid", detail: { plan: plan.id, months, ref: sess.id } } }),
  ]);
  return "activated";
}
