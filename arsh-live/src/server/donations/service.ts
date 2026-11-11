// خدمة التبرعات: تسجيل التبرع المؤكد مرة واحدة (قيد فريد في قاعدة البيانات) ثم بثه لروابط OBS
import type { PrismaClient } from "@prisma/client";

export type DonationIn = { provider: string; providerId: string; name: string; anonymous?: boolean; avatar?: string; amount: number; currency: string; message?: string; t?: number };
type Hub = { dispatch(room: string, ev: any): void };

export function createDonationService(prisma: PrismaClient, hub: Hub) {
  const roomOf = async (userId: string) => (await prisma.user.findUnique({ where: { id: userId }, select: { overlayToken: true } }))?.overlayToken;
  const audit = (userId: string, kind: string, detail: any) => prisma.auditLog.create({ data: { userId, kind, detail } }).catch(() => {});

  /** سجل وصول الأحداث ومعالجتها (آخر 50 لكل مستخدم) — لصفحة «فحص اتصال الدونيشن» */
  const logs = new Map<string, any[]>();
  function log(userId: string, e: any) { const a = logs.get(userId) || []; a.unshift({ at: Date.now(), ...e }); if (a.length > 50) a.length = 50; logs.set(userId, a); if (e.step === "error") console.error("[donation]", userId.slice(0, 6), e.detail); }
  /** تبرع مؤكد فقط. يرجع false إذا كان مسجلاً سابقاً */
  async function record(userId: string, d: DonationIn) {
    const amount = Math.round(Number(d.amount) * 1000) / 1000;
    log(userId, { step: "received", provider: d.provider, id: String(d.providerId || ""), amount, currency: d.currency });
    if (!(amount > 0) || !d.providerId) { log(userId, { step: "rejected", detail: !d.providerId ? "بدون معرّف عملية" : "مبلغ غير صالح", provider: d.provider }); return false; }
    const id = `${d.provider}:${d.providerId}`;
    const currency = String(d.currency || "SAR").toUpperCase().slice(0, 3);
    try {
      await prisma.donation.create({ data: { id, userId, provider: d.provider, providerId: String(d.providerId), name: String(d.name || "").slice(0, 60), anonymous: !!d.anonymous, avatar: String(d.avatar || "").slice(0, 500), amount, currency, message: String(d.message || "").slice(0, 300), status: "confirmed", createdAt: d.t ? new Date(d.t) : undefined } });
    } catch (e: any) { if (e?.code === "P2002") { log(userId, { step: "duplicate", provider: d.provider, id }); return false; } log(userId, { step: "error", detail: String(e?.message || e).slice(0, 160) }); throw e; } // مكرر
    audit(userId, "donation.confirmed", { id, amount, currency, provider: d.provider });
    prisma.donationProvider.updateMany({ where: { userId, kind: d.provider }, data: { lastEventAt: new Date() } }).catch(() => {});
    const room = await roomOf(userId);
    log(userId, { step: "saved", provider: d.provider, id, amount, currency });
    if (!room) log(userId, { step: "error", detail: "لا يوجد رابط بث (overlayToken) للحساب" });
    if (room) hub.dispatch(room, { type: "donation", verified: true, id, provider: d.provider, name: d.name, anonymous: !!d.anonymous, avatar: d.avatar || "", amount, currency, message: d.message || "", t: d.t || Date.now() });
    return true;
  }
  /** استرجاع كلي أو جزئي: يُخصم من الإحصائيات والأهداف والقوائم ويبقى في السجل */
  async function refund(provider: string, providerId: string, refundedAmount: number | null) {
    const d = await prisma.donation.findUnique({ where: { provider_providerId: { provider, providerId: String(providerId) } } });
    if (!d) return false;
    const amount = Number(d.amount), r = refundedAmount == null ? amount : Math.min(amount, Number(refundedAmount));
    if (r <= Number(d.refunded)) return false;
    await prisma.donation.update({ where: { id: d.id }, data: { refunded: r, status: r >= amount ? "refunded" : "partially_refunded" } });
    audit(d.userId, "donation.refunded", { id: d.id, refunded: r });
    const room = await roomOf(d.userId);
    if (room) hub.dispatch(room, { type: "donation_refund", id: d.id, amount: r });
    return true;
  }
  async function load(userId: string) {
    const rows = await prisma.donation.findMany({ where: { userId }, orderBy: { createdAt: "asc" }, take: 20000 });
    return rows.map(r => ({ id: r.id, provider: r.provider, name: r.name, anonymous: r.anonymous, avatar: r.avatar, amount: Number(r.amount), currency: r.currency, message: r.message, status: r.status, refunded: Number(r.refunded), test: false, t: r.createdAt.getTime() }));
  }
  /** تجربة قادمة من المزوّد نفسه (مثل Test Donation في Streamlabs): تُعرض كتجربة ولا تُحفظ ولا تُحتسب */
  async function testEvent(userId: string, d: DonationIn) {
    const amount = Math.round(Number(d.amount) * 1000) / 1000; log(userId, { step: "test", provider: d.provider, amount, currency: d.currency, detail: "تجربة من " + d.provider + " — لا تُحتسب" });
    if (!(amount > 0)) return; const room = await roomOf(userId);
    if (room) hub.dispatch(room, { type: "donation", test: true, id: `test:${d.provider}:${d.providerId}`, provider: "test", name: d.name, amount, currency: String(d.currency || "USD").toUpperCase(), message: d.message || "", t: Date.now() });
  }
  return { record, refund, load, audit, log, testEvent, logs: (userId: string) => logs.get(userId) || [] };
}
export type DonationService = ReturnType<typeof createDonationService>;
