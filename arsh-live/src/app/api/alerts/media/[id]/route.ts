// تقديم ملفات الآيرتات. يُسمح فقط لـ: المالك (جلسته) · المشرف · ملف آيرت عام معتمد · رابط OBS موقّع لمستخدم يحق له استخدامه.
// الملف الخاص لا يوجد له رابط عام أبداً — وغير المصرّح يحصل على 404 (لا نكشف وجوده).
import { prisma } from "@/lib/db";
import { getAsset } from "@/server/alert-store";
import { viewer } from "@/server/alerts-svc";
import { verifyMediaSig } from "@/server/alert-sign";
import { alIsListed, alCanUse } from "@/engine/alerts.js";

const nf = () => new Response("not found", { status: 404 });
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params; const sp = new URL(req.url).searchParams;
  const meta = await prisma.alertAsset.findUnique({ where: { id }, select: { ownerId: true, mime: true, size: true } }); if (!meta) return nf();
  const refs = await prisma.alert.findMany({ where: { OR: [{ mediaId: id }, { audioId: id }, { coverId: id }] }, select: { id: true, ownerId: true, visibility: true, review: true, removed: true } });
  let allowed = false, isPublic = false;
  if (refs.some(alIsListed)) { allowed = true; isPublic = true; }
  if (!allowed && sp.get("s")) {
    const t = String(sp.get("t") || "");
    if (verifyMediaSig(id, t, +(sp.get("e") || 0), String(sp.get("s")))) {
      const u = await prisma.user.findUnique({ where: { overlayToken: t }, select: { id: true } });
      if (u) { const v = { id: u.id }; if (meta.ownerId === u.id) allowed = true; else { const uses = await prisma.alertUse.findMany({ where: { userId: u.id, alertId: { in: refs.map(r => r.id) } }, select: { alertId: true } }); allowed = refs.some(r => uses.some(x => x.alertId === r.id) && alCanUse(r, v, { adopted: true })); } }
    }
  }
  if (!allowed) { const { v } = await viewer(); if (v && (v.id === meta.ownerId || v.admin)) allowed = true;
    else if (v) { const uses = await prisma.alertUse.findMany({ where: { userId: v.id, alertId: { in: refs.map(r => r.id) } }, select: { alertId: true } }); allowed = refs.some(r => uses.some(x => x.alertId === r.id) && alCanUse(r, v, { adopted: true })); } }
  if (!allowed) return nf();
  const a = await getAsset(id); if (!a) return nf();
  const buf = Buffer.from(a.data), total = buf.length;
  const head: Record<string, string> = { "content-type": a.mime, "x-content-type-options": "nosniff", "x-robots-tag": "noindex, nofollow", "content-security-policy": "default-src 'none'; sandbox", "accept-ranges": "bytes", "cache-control": isPublic ? "public, max-age=3600" : "private, max-age=600", "cross-origin-resource-policy": "same-origin", "access-control-allow-origin": new URL(req.url).origin };
  const range = req.headers.get("range"); const m = range && /^bytes=(\d*)-(\d*)$/.exec(range);
  if (m) { const s = m[1] ? +m[1] : Math.max(0, total - +m[2]), e = m[1] && m[2] ? Math.min(+m[2], total - 1) : total - 1; if (s >= total || s > e) return new Response(null, { status: 416, headers: { "content-range": `bytes */${total}` } });
    return new Response(buf.subarray(s, e + 1), { status: 206, headers: { ...head, "content-range": `bytes ${s}-${e}/${total}`, "content-length": String(e - s + 1) } }); }
  return new Response(buf, { headers: { ...head, "content-length": String(total) } });
}
