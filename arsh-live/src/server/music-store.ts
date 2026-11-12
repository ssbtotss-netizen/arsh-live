// تخزين مكتبة الأغاني في قاعدة البيانات (الملفات أجزاء 1MB في AlertAsset slot=music — نفس آلية الآيرتات، بحصة مستقلة)
import { randomBytes } from "crypto";
import { prisma } from "@/lib/db";
import { assetStream, storeFile, storeRaw } from "@/server/alert-store";
import { createMusicService, type MusicStore } from "@/server/music-svc";

export const MUSIC_LIMITS = { file: 40 * 1024 * 1024, quota: (+(process.env.MUSIC_QUOTA_MB || 300)) * 1024 * 1024, tracks: 1000 };

export const musicStore: MusicStore = {
  userBySongToken: tok => prisma.user.findFirst({ where: { songToken: tok, disabled: false }, select: { id: true, name: true, overlayToken: true } }),
  userByOverlay: tok => prisma.user.findUnique({ where: { overlayToken: tok }, select: { id: true } }),
  tracks: userId => prisma.musicTrack.findMany({ where: { ownerId: userId }, orderBy: { createdAt: "desc" }, take: MUSIC_LIMITS.tracks }),
  track: id => prisma.musicTrack.findUnique({ where: { id } }),
  stream: (assetId, s, e) => assetStream(assetId, s, e),
  async coverBytes(id) { const a = await prisma.alertAsset.findUnique({ where: { id }, select: { data: true, mime: true } }); return a?.data ? { bytes: new Uint8Array(a.data), mime: a.mime } : null; },
};
export const musicSvc = createMusicService(musicStore, () => (globalThis as any).__b6o6?.hub);

export async function musicUsed(ownerId: string) { const r = await prisma.alertAsset.aggregate({ _sum: { size: true }, where: { ownerId, slot: { in: ["music", "mcover"] } } }); return r._sum.size || 0; }
/** رابط صفحة الطلب: يُنشأ مرة واحدة لكل صانع محتوى */
export async function songTokenOf(userId: string) {
  const u = await prisma.user.findUnique({ where: { id: userId }, select: { songToken: true } });
  if (u?.songToken) return u.songToken;
  const tok = randomBytes(9).toString("base64url");
  await prisma.user.update({ where: { id: userId }, data: { songToken: tok } }); return tok;
}
export async function addTrack(ownerId: string, f: { path: string; size: number; mime: string; dur: number; title: string; artist: string; cover?: { bytes: Uint8Array; mime: string } }) {
  const used = await musicUsed(ownerId);
  if (used + f.size > MUSIC_LIMITS.quota) return { ok: false as const, error: "quota", used, max: MUSIC_LIMITS.quota };
  if (await prisma.musicTrack.count({ where: { ownerId } }) >= MUSIC_LIMITS.tracks) return { ok: false as const, error: "too_many" };
  const a = await storeFile(ownerId, "music", f.path, f.size, f.mime, { duration: f.dur });
  const c = f.cover ? await storeRaw(ownerId, "mcover", f.cover.bytes, f.cover.mime, {}) : null;
  const t = await prisma.musicTrack.create({ data: { ownerId, title: f.title, artist: f.artist, dur: f.dur, assetId: a.id, coverId: c?.id ?? null, mime: f.mime, size: f.size } });
  return { ok: true as const, track: t };
}
/** حذف الأغنية وملفها (إن لم تستخدمه أغنية أخرى بنفس المحتوى) */
export async function removeTrack(ownerId: string, id: string) {
  const t = await prisma.musicTrack.findFirst({ where: { id, ownerId } }); if (!t) return false;
  await prisma.musicTrack.delete({ where: { id } });
  for (const [k, aid] of [["assetId", t.assetId], ["coverId", t.coverId]] as const) {
    if (!aid) continue; const n = await prisma.musicTrack.count({ where: { ownerId, [k]: aid } as any });
    if (!n) await prisma.alertAsset.deleteMany({ where: { id: aid, ownerId, slot: { in: ["music", "mcover"] } } });
  }
  return true;
}
