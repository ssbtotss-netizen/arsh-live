// إعدادات الاشتراك العامة (مدة التجربة، السعر، حدود ما بعد التجربة) — يحفظها المشرف في قاعدة البيانات
import { prisma } from "@/lib/db";
import { billingCfg } from "@/engine/plans.js";
let cache: { at: number; v: any } | null = null;
export async function getBilling() {
  if (cache && Date.now() - cache.at < 30_000) return cache.v;
  const row = await prisma.appConfig.findUnique({ where: { key: "billing" } }).catch(() => null);
  const v = billingCfg((row?.value as any) || {}); cache = { at: Date.now(), v }; return v;
}
export async function setBilling(patch: any) {
  const cur = await prisma.appConfig.findUnique({ where: { key: "billing" } }).catch(() => null);
  const raw = { ...((cur?.value as any) || {}), ...patch };
  const clean = billingCfg(raw); // يطبّق الحدود الآمنة
  const value = { trialEnabled: clean.trialEnabled, trialDays: clean.trialDays, priceUsd: clean.priceUsd, expiredLimits: clean.limits.expired, perks: clean.perks };
  await prisma.appConfig.upsert({ where: { key: "billing" }, update: { value }, create: { key: "billing", value } });
  cache = null; return billingCfg(value);
}
