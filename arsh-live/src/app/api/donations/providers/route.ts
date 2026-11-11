import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { encrypt, decrypt, mask } from "@/lib/secrets";
import { runtime } from "@/lib/runtime";

const KINDS: Record<string, { secret: string[]; pub: string[] }> = {
  moyasar: { secret: ["secretKey", "webhookSecret"], pub: ["publishableKey"] },
  streamlabs: { secret: ["socketToken"], pub: [] },
  streamelements: { secret: ["token"], pub: ["tokenType"] },
};
async function list(userId: string) {
  const rows = await prisma.donationProvider.findMany({ where: { userId } });
  const out: any = {};
  for (const r of rows) {
    const sec = decrypt<any>(r.secretEnc) || {};
    out[r.kind] = { enabled: r.enabled, connected: r.status === "connected", status: r.status, masked: Object.fromEntries(Object.entries({ ...sec, ...(r.publicCfg as any) }).map(([k, v]) => [k, k === "publishableKey" || k === "tokenType" ? String(v) : mask(String(v))])) };
  }
  return out;
}
export async function GET() {
  const u = await currentUser(); if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ providers: await list(u.id) });
}
export async function PUT(req: Request) {
  const u = await currentUser(); if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { kind, enabled, config } = await req.json().catch(() => ({}));
  const K = KINDS[kind]; if (!K) return NextResponse.json({ error: "مزود غير مدعوم" }, { status: 400 });
  const prev = await prisma.donationProvider.findUnique({ where: { userId_kind: { userId: u.id, kind } } });
  const sec = { ...(decrypt<any>(prev?.secretEnc || "") || {}) }, pub: any = { ...((prev?.publicCfg as any) || {}) };
  for (const k of K.secret) if (config?.[k]) sec[k] = String(config[k]).trim().slice(0, 4000);
  for (const k of K.pub) if (config?.[k]) pub[k] = String(config[k]).trim().slice(0, 200);
  if (enabled && K.secret.some(k => !sec[k])) return NextResponse.json({ error: "أكمل الحقول المطلوبة", providers: await list(u.id) }, { status: 400 });
  if (kind === "moyasar" && enabled && !/^pk_(test|live)_/.test(pub.publishableKey || "")) return NextResponse.json({ error: "Publishable Key غير صحيح", providers: await list(u.id) }, { status: 400 });
  await prisma.donationProvider.upsert({ where: { userId_kind: { userId: u.id, kind } }, create: { userId: u.id, kind, enabled: !!enabled, publicCfg: pub, secretEnc: encrypt(sec) }, update: { enabled: !!enabled, publicCfg: pub, secretEnc: encrypt(sec), status: "" } });
  await prisma.auditLog.create({ data: { userId: u.id, kind: "provider." + (enabled ? "enabled" : "disabled"), detail: { kind, changed: Object.keys(config || {}) } } }); // لا نسجّل قيم المفاتيح
  if (kind !== "moyasar") await runtime().connectors.restart(u.id, kind);
  return NextResponse.json({ providers: await list(u.id) });
}
