// عودة OAuth من Streamlabs: نستبدل الكود بتوكن ثم نجلب Socket Token — كلها على الخادم ومشفّرة، ولا يصل أي رمز للمتصفح
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { encrypt, decrypt } from "@/lib/secrets";
import { runtime } from "@/lib/runtime";
import { slOAuthReady, slStateOk } from "@/server/streamlabs-oauth";

export async function GET(req: Request) {
  const url = new URL(req.url), origin = process.env.PUBLIC_URL || url.origin;
  const back = (q: string) => NextResponse.redirect(`${origin}/dashboard#/donalerts?${q}`);
  const u = await currentUser(); if (!u) return NextResponse.redirect(`${origin}/login`);
  if (!slOAuthReady()) return back("sl=not_configured");
  if (url.searchParams.get("error")) return back("sl=denied");
  if (!slStateOk(u.id, url.searchParams.get("state") || "")) return back("sl=bad_state");
  try {
    const tr = await fetch("https://streamlabs.com/api/v2.0/token", { method: "POST", headers: { "content-type": "application/json", accept: "application/json" }, body: JSON.stringify({ grant_type: "authorization_code", client_id: process.env.STREAMLABS_CLIENT_ID, client_secret: process.env.STREAMLABS_CLIENT_SECRET, redirect_uri: `${origin}/api/donations/oauth/streamlabs/callback`, code: url.searchParams.get("code") }) });
    const tj: any = await tr.json().catch(() => ({})); if (!tr.ok || !tj.access_token) return back("sl=token_failed");
    const sr = await fetch("https://streamlabs.com/api/v2.0/socket/token", { headers: { authorization: `Bearer ${tj.access_token}`, accept: "application/json" } });
    const sj: any = await sr.json().catch(() => ({})); if (!sr.ok || !sj.socket_token) return back("sl=socket_failed");
    const prev = await prisma.donationProvider.findUnique({ where: { userId_kind: { userId: u.id, kind: "streamlabs" } } });
    const sec = { ...(decrypt<any>(prev?.secretEnc || "") || {}), socketToken: sj.socket_token, accessToken: tj.access_token, refreshToken: tj.refresh_token || "" };
    await prisma.donationProvider.upsert({ where: { userId_kind: { userId: u.id, kind: "streamlabs" } }, create: { userId: u.id, kind: "streamlabs", enabled: true, publicCfg: { via: "oauth" }, secretEnc: encrypt(sec) }, update: { enabled: true, publicCfg: { via: "oauth" }, secretEnc: encrypt(sec), status: "" } });
    await prisma.auditLog.create({ data: { userId: u.id, kind: "provider.enabled", detail: { kind: "streamlabs", via: "oauth" } } });
    await runtime().connectors.restart(u.id, "streamlabs");
    return back("sl=connected");
  } catch { return back("sl=network"); }
}
