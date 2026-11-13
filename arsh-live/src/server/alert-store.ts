// تخزين ملفات الآيرتات: الواجهة ثابتة (put/get/remove) والمشغّل الحالي قاعدة البيانات.
// للانتقال لاحقاً إلى S3/R2: نفّذ نفس الدوال بمشغّل آخر — يحتاج مفاتيح تخزين لم تُضف بعد (لا نخترعها).
import { createHash } from "crypto";
import { createReadStream } from "fs";
import { prisma } from "@/lib/db";
import { alCheckFile, AL_LIMITS } from "@/engine/alerts.js";

export const MUSIC_SLOTS = ["music", "mcover"];
/** مساحة الآيرتات فقط — ملفات الأغاني لها حصتها المستقلة */
export async function usedBytes(ownerId: string) {
  const r = await prisma.alertAsset.aggregate({ _sum: { size: true }, where: { ownerId, slot: { notIn: MUSIC_SLOTS } } });
  return r._sum.size || 0;
}
/**
 * لا حصة ثابتة لكل حساب (كانت 200MB وتوقف صانع المحتوى بلا داعٍ).
 * الحماية الوحيدة على مستوى المنصة: حجم قاعدة البيانات الفعلي مقابل سعتها (Render: 15GB — STORAGE_CAPACITY_MB).
 * عند 90% نرفض الرفع الجديد برسالة صادقة (تخزين المنصة يحتاج توسعة) بدل امتلاء القرص وتوقف المنصة كلها، ونسجّل تنبيهاً للإدارة.
 */
const CAP_MB = () => Math.max(256, +(process.env.STORAGE_CAPACITY_MB || 15360));
let dbSize = { at: 0, bytes: 0 };
export async function platformStorage(force = false) {
  if (force || Date.now() - dbSize.at > 60_000) {
    try { const r: any[] = await prisma.$queryRawUnsafe("SELECT pg_database_size(current_database())::bigint AS b"); dbSize = { at: Date.now(), bytes: Number(r[0]?.b || 0) }; }
    catch (e: any) { console.error("[storage] size query failed", e?.message || e); dbSize = { at: Date.now(), bytes: dbSize.bytes }; }
  }
  const cap = CAP_MB() * 1024 * 1024;
  return { used: dbSize.bytes, capacity: cap, pct: cap ? dbSize.bytes / cap : 0 };
}
async function guard(add: number) {
  const st = await platformStorage();
  if (st.used + add > st.capacity * 0.9) {
    console.error(`[storage] ⚠️ PLATFORM STORAGE HIGH: ${(st.used / 1048576).toFixed(0)}MB / ${(st.capacity / 1048576).toFixed(0)}MB — expand the database disk (Render → b6o6-db → Storage) or enable autoscaling`);
    return { ok: false as const, error: "platform_storage", used: st.used, max: st.capacity };
  }
  return null;
}
export async function putAsset(ownerId: string, slot: string, bytes: Uint8Array) {
  const chk: any = alCheckFile(slot, bytes);
  if (!chk.ok) return { ok: false as const, error: chk.error, max: chk.max };
  return putAssetRaw(ownerId, slot, bytes, chk.mime, {});
}
/** حفظ ملف فحصه الخادم أو أنتجه FFmpeg (النوع معروف) */
export async function putAssetRaw(ownerId: string, slot: string, bytes: Uint8Array, mime: string, meta: any, extra = 0) {
  const g = await guard(bytes.length + extra); if (g) return g;
  return storeRaw(ownerId, slot, bytes, mime, meta);
}
export async function storeRaw(ownerId: string, slot: string, bytes: Uint8Array, mime: string, meta: any) {
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  // نفس الملف لنفس المستخدم لا يُخزَّن مرتين
  const dup = await prisma.alertAsset.findFirst({ where: { ownerId, sha256, slot }, select: { id: true, mime: true, size: true } });
  if (dup) return { ok: true as const, id: dup.id, mime: dup.mime, size: dup.size, dup: true };
  const a = await prisma.alertAsset.create({ data: { ownerId, slot, mime, size: bytes.length, sha256, meta: meta || {}, data: Buffer.from(bytes) }, select: { id: true, mime: true, size: true } });
  return { ok: true as const, ...a };
}
export const getAsset = (id: string) => prisma.alertAsset.findUnique({ where: { id } });
export const getAssetMeta = (id: string) => prisma.alertAsset.findUnique({ where: { id }, select: { id: true, ownerId: true, mime: true, size: true, slot: true } });
/** حذف ملفات لم يعد يستخدمها أي آيرت لنفس المالك */
export async function removeOrphans(ownerId: string, ids: (string | null | undefined)[]) {
  for (const id of ids.filter(Boolean) as string[]) {
    const n = await prisma.alert.count({ where: { ownerId, OR: [{ mediaId: id }, { audioId: id }, { coverId: id }, { previewId: id }] } });
    if (!n) await prisma.alertAsset.deleteMany({ where: { id, ownerId } });
  }
}

// ---------------- الملفات الكبيرة: من القرص إلى قاعدة البيانات جزءاً جزءاً (ذاكرة ثابتة ~1MB) ----------------
export const CHUNK = 1024 * 1024;
async function sha256File(path: string) { const h = createHash("sha256"); for await (const b of createReadStream(path, { highWaterMark: CHUNK })) h.update(b as Buffer); return h.digest("hex"); }
export async function putAssetFile(ownerId: string, slot: string, path: string, size: number, mime: string, meta: any, extra = 0) {
  const g = await guard(size + extra); if (g) return g;
  return storeFile(ownerId, slot, path, size, mime, meta);
}
/** الحفظ نفسه (بدون فحص الحصة — يفحصها المستدعي) */
export async function storeFile(ownerId: string, slot: string, path: string, size: number, mime: string, meta: any) {
  const sha256 = await sha256File(path);
  const dup = await prisma.alertAsset.findFirst({ where: { ownerId, sha256, slot }, select: { id: true, mime: true, size: true } });
  if (dup) return { ok: true as const, ...dup, dup: true };
  const a = await prisma.alertAsset.create({ data: { ownerId, slot, mime, size, sha256, meta: meta || {}, chunks: 0 }, select: { id: true, mime: true, size: true } });
  try {
    let idx = 0;
    for await (const b of createReadStream(path, { highWaterMark: CHUNK })) await prisma.alertAssetChunk.create({ data: { assetId: a.id, idx: idx++, data: b as Buffer } });
    await prisma.alertAsset.update({ where: { id: a.id }, data: { chunks: idx } });
  } catch (e) { await prisma.alertAsset.delete({ where: { id: a.id } }).catch(() => {}); throw e; }
  return { ok: true as const, ...a };
}
/** قراءة جزء من الملف [s, e] كتيار — للملفات المجزأة والقديمة المخزنة كاملة */
export async function assetStream(id: string, s: number, e: number): Promise<ReadableStream<Uint8Array> | null> {
  const a = await prisma.alertAsset.findUnique({ where: { id }, select: { chunks: true, size: true } }); if (!a) return null;
  if (!a.chunks) { const full = await prisma.alertAsset.findUnique({ where: { id }, select: { data: true } }); const b = full?.data ? Buffer.from(full.data) : Buffer.alloc(0); return new ReadableStream({ start(c) { c.enqueue(new Uint8Array(b.subarray(s, e + 1))); c.close(); } }); }
  let i = Math.floor(s / CHUNK); const last = Math.floor(e / CHUNK);
  return new ReadableStream({
    async pull(c) {
      if (i > last) return c.close();
      const row = await prisma.alertAssetChunk.findUnique({ where: { assetId_idx: { assetId: id, idx: i } }, select: { data: true } });
      if (!row) { c.close(); return; }
      const buf = Buffer.from(row.data), base = i * CHUNK, from = Math.max(0, s - base), to = Math.min(buf.length, e - base + 1);
      c.enqueue(new Uint8Array(buf.subarray(from, to))); i++;
    },
  });
}
