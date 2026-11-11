import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { subStatus } from "@/engine/plans.js";
import { billingConfigured, createCheckout } from "@/server/billing";
import { getBilling } from "@/server/appconfig";

export async function GET() {
  const u = await currentUser(); if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const cfg = await getBilling();
  const subs = await prisma.subscription.findMany({ where: { userId: u.id }, orderBy: { createdAt: "desc" }, take: 30 });
  return NextResponse.json({ cfg: { trialEnabled: cfg.trialEnabled, trialDays: cfg.trialDays, priceUsd: cfg.priceUsd, months: cfg.months, perks: cfg.perks }, status: subStatus(u, cfg), configured: billingConfigured(), history: subs });
}
export async function POST(req: Request) {
  const u = await currentUser(); if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!billingConfigured()) return NextResponse.json({ error: "payments_not_configured", message: "بوابة الدفع غير مهيأة على الخادم بعد" }, { status: 501 });
  const b = await req.json().catch(() => ({}));
  try { const url = await createCheckout(u, +b.months || 1, process.env.PUBLIC_URL || new URL(req.url).origin); return NextResponse.json({ url }); }
  catch (e: any) { return NextResponse.json({ error: String(e.message || e) }, { status: 400 }); }
}
