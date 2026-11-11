// تخزين ملفات الآيرتات: الواجهة ثابتة (put/get/remove) والمشغّل الحالي قاعدة البيانات.
// للانتقال لاحقاً إلى S3/R2: نفّذ نفس الدوال بمشغّل آخر — يحتاج مفاتيح تخزين لم تُضف بعد (لا نخترعها).
import { createHash } from "crypto";
import { prisma } from "@/lib/db";
import { alCheckFile, AL_LIMITS } from "@/engine/alerts.js";

export async function usedBytes(ownerId: string) {
  const r = await prisma.alertAsset.aggregate({ _sum: { size: true }, where: { ownerId } });
  return r._sum.size || 0;
}
export async function putAsset(ownerId: string, slot: string, bytes: Uint8Array) {
  const chk: any = alCheckFile(slot, bytes);
  if (!chk.ok) return { ok: false as const, error: chk.error, max: chk.max };
  const used = await usedBytes(ownerId);
  if (used + bytes.length > AL_LIMITS.quota) return { ok: false as const, error: "quota", used, max: AL_LIMITS.quota };
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  // نفس الملف لنفس المستخدم لا يُخزَّن مرتين
  const dup = await prisma.alertAsset.findFirst({ where: { ownerId, sha256, slot }, select: { id: true, mime: true, size: true } });
  if (dup) return { ok: true as const, id: dup.id, mime: dup.mime, size: dup.size };
  const a = await prisma.alertAsset.create({ data: { ownerId, slot, mime: chk.mime, size: bytes.length, sha256, data: Buffer.from(bytes) }, select: { id: true, mime: true, size: true } });
  return { ok: true as const, ...a };
}
export const getAsset = (id: string) => prisma.alertAsset.findUnique({ where: { id } });
export const getAssetMeta = (id: string) => prisma.alertAsset.findUnique({ where: { id }, select: { id: true, ownerId: true, mime: true, size: true, slot: true } });
/** حذف ملفات لم يعد يستخدمها أي آيرت لنفس المالك */
export async function removeOrphans(ownerId: string, ids: (string | null | undefined)[]) {
  for (const id of ids.filter(Boolean) as string[]) {
    const n = await prisma.alert.count({ where: { ownerId, OR: [{ mediaId: id }, { audioId: id }, { coverId: id }] } });
    if (!n) await prisma.alertAsset.deleteMany({ where: { id, ownerId } });
  }
}
