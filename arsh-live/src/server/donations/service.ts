// خدمة التبرعات: تسجيل التبرع المؤكد مرة واحدة (قيد فريد في قاعدة البيانات) ثم بثه لروابط OBS
import type { PrismaClient } from "@prisma/client";

export type DonationIn = { provider: string; providerId: string; name: string; anonymous?: boolean; avatar?: string; amount: number; currency: string; message?: string; t?: number };
type Hub = { dispatch(room: string, ev: any): void };

export function createDonationService(prisma: PrismaClient, hub: Hub) {
  const roomOf = async (userId: string) => (await prisma.user.findUnique({ where: { id: userId }, select: { overlayToken: true } }))?.overlayToken;
  const audit = (userId: string, kind: string, detail: any) => prisma.auditLog.create({ data: { userId, kind, detail } }).catch(() => {});

  /** تبرع مؤكد فقط. يرجع false إذا كان مسجلاً سابقاً */
  async function record(userId: string, d: DonationIn) {
    const amount = Math.round(Number(d.amount) * 1000) / 1000;
    if (!(amount > 0) || !d.providerId) return false;
    const id = `${d.provider}:${d.providerId}`;
    const currency = String(d.currency || "SAR").toUpperCase().slice(0, 3);
    try {
      await prisma.donation.create({ data: { id, userId, provider: d.provider, providerId: String(d.providerId), name: String(d.name || "").slice(0, 60), anonymous: !!d.anonymous, avatar: String(d.avatar || "").slice(0, 500), amount, currency, message: String(d.message || "").slice(0, 300), status: "confirmed", createdAt: d.t ? new Date(d.t) : undefined } });
    } catch (e: any) { if (e?.code === "P2002") return false; throw e; } // مكرر
    audit(userId, "donation.confirmed", { id, amount, currency, provider: d.provider });
    const room = await roomOf(userId);
    if (room) hub.dispatch(room, { type: "donation", id, provider: d.provider, name: d.name, anonymous: !!d.anonymous, avatar: d.avatar || "", amount, currency, message: d.message || "", t: d.t || Date.now() });
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
  return { record, refund, load, audit };
}
export type DonationService = ReturnType<typeof createDonationService>;
