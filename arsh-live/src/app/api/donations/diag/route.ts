// «فحص اتصال الدونيشن»: أين يتوقف التحديث؟ المزوّد ← الاستقبال ← قاعدة البيانات ← حساب الهدف ← الخادم اللحظي ← روابط البث
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { runtime } from "@/lib/runtime";
import { goalProgress, defaultDonCfg } from "@/engine/donations.js";

export async function GET() {
  const u = await currentUser(); if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const rt = runtime();
  const [prov, last, full] = await Promise.all([
    prisma.donationProvider.findMany({ where: { userId: u.id }, select: { kind: true, enabled: true, status: true, lastEventAt: true, lastSyncAt: true, updatedAt: true } }),
    prisma.donation.findFirst({ where: { userId: u.id }, orderBy: { createdAt: "desc" }, select: { id: true, provider: true, name: true, amount: true, currency: true, createdAt: true, status: true } }),
    prisma.user.findUnique({ where: { id: u.id }, select: { overlayToken: true, donCfg: true } }),
  ]);
  const list = await rt.donations.load(u.id);
  const DC: any = { ...defaultDonCfg(), ...((full?.donCfg as any) || {}) };
  // الهدف محسوباً على الخادم من قاعدة البيانات (التجارب لا تُحفظ فلا تدخل هنا) — للمقارنة مع لوحة التحكم ورابط البث
  const goals = (DC.goals || []).map((g: any) => { const p = goalProgress(g, { list }, Date.now(), DC.fx); return { id: g.id, name: g.name, currency: g.currency, target: p.target, current: p.current, pct: Math.floor(p.pct), converted: p.converted.length, skipped: p.skipped, auto: g.auto, paused: g.paused }; });
  const hub = rt.hub?.stats(full?.overlayToken || "") || { loaded: false, overlays: 0, dashboards: 0 };
  const log = rt.donations.logs(u.id).slice(0, 30);
  const lastError = log.find((e: any) => e.step === "error") || null;
  return NextResponse.json({ providers: prov, lastDonation: last ? { ...last, amount: Number(last.amount) } : null, totalConfirmed: list.length, goals, hub, log, lastError, now: Date.now() }, { headers: { "cache-control": "no-store" } });
}
