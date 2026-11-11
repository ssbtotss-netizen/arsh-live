// ربط Streamlabs عبر OAuth الرسمي (بدون كلمة مرور داخل منصتنا). يعمل فقط إذا ضُبط STREAMLABS_CLIENT_ID و STREAMLABS_CLIENT_SECRET على الخادم.
import { NextResponse } from "next/server";
import { slOAuthReady, slState } from "@/server/streamlabs-oauth";
import { currentUser } from "@/lib/auth";

export async function GET(req: Request) {
  const u = await currentUser(); if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!slOAuthReady()) return NextResponse.json({ error: "oauth_not_configured", message: "ربط Streamlabs بـ OAuth غير مفعّل على الخادم بعد — استخدم Socket API Token" }, { status: 501 });
  const origin = process.env.PUBLIC_URL || new URL(req.url).origin;
  const q = new URLSearchParams({ response_type: "code", client_id: process.env.STREAMLABS_CLIENT_ID!, redirect_uri: `${origin}/api/donations/oauth/streamlabs/callback`, scope: "socket.token donations.read", state: slState(u.id) });
  return NextResponse.redirect(`https://streamlabs.com/api/v2.0/authorize?${q}`);
}
