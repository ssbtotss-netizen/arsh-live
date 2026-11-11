import { NextResponse } from "next/server";
import { verifyStripe, activate } from "@/server/billing";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET; if (!secret) return NextResponse.json({ error: "not_configured" }, { status: 501 });
  const raw = await req.text();
  if (!verifyStripe(raw, req.headers.get("stripe-signature"), secret)) return NextResponse.json({ error: "bad_signature" }, { status: 400 });
  const ev = JSON.parse(raw);
  if (ev.type === "checkout.session.completed" || ev.type === "checkout.session.async_payment_succeeded") return NextResponse.json({ result: await activate(ev.data.object) });
  return NextResponse.json({ ignored: ev.type });
}
