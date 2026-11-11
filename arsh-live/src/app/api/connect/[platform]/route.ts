// بدء الربط عبر OAuth الرسمي. إذا لم يضبط مالك المنصة المفاتيح نرجع 501 مع أسماء المتغيرات الناقصة — بدون اتصال وهمي.
import { NextResponse } from "next/server";
import { randomBytes, createHash } from "crypto";
import { currentUser } from "@/lib/auth";
import { oauthUrl, oauthMissing, OAUTH } from "@/engine/platforms.js";

export async function GET(req: Request, ctx: { params: Promise<{ platform: string }> }) {
  const params = await ctx.params;
  const u = await currentUser(); if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const p = params.platform; if (!(OAUTH as any)[p]) return NextResponse.json({ error: "unknown_platform" }, { status: 404 });
  const env = process.env as any; const missing = oauthMissing(p, env);
  if (missing.length) return NextResponse.json({ error: "not_configured", missing, message: "لم يُضبط تطبيق المطوّر لهذه المنصة على الخادم بعد" }, { status: 501 });
  const origin = env.PUBLIC_URL || new URL(req.url).origin;
  const state = randomBytes(16).toString("hex"), verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  const url = oauthUrl(p, env, { redirect: `${origin}/api/connect/${p}/callback`, state, challenge })!;
  const res = NextResponse.redirect(url);
  res.cookies.set("b6o6_oauth", JSON.stringify({ p, state, verifier }), { httpOnly: true, secure: origin.startsWith("https"), sameSite: "lax", path: "/api/connect", maxAge: 600 });
  return res;
}
