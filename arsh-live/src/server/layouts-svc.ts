// خدمات تصاميم البث على الخادم: الصلاحيات، الكود العشوائي، تنقية الأصول قبل الحفظ
import { randomBytes } from "crypto";
import { prisma } from "@/lib/db";
import { lsValidate, lsCodeFrom, lsStats, lsShape } from "@/engine/layoutshare.js";
import { alIsListed, alIsOfficial } from "@/engine/alerts.js";

export const lsListed = (l: any) => !!l && l.visibility === "public" && l.review === "approved" && !l.removed;
/** من يرى التصميم بالمعرّف: المالك، المشرف، أو العام المعتمد */
export const lsCanView = (l: any, v: any) => !!l && (!!(v && (v.id === l.ownerId || v.admin)) || lsListed(l));
/** الاستيراد بالكود: المالك دائماً؛ غيره إن كان «برابط» أو «عام» وغير محذوف/مرفوض. الخاص لا يُفتح بالكود لغير مالكه */
export const lsCanImport = (l: any, v: any) => !!l && !l.removed && (!!(v && v.id === l.ownerId) || ((l.visibility === "link" || l.visibility === "public") && l.review !== "rejected"));
export async function newCode() { for (let i = 0; i < 8; i++) { const c = lsCodeFrom(randomBytes(8)); if (!(await prisma.streamLayout.findUnique({ where: { code: c }, select: { id: true } }))) return c; } throw new Error("code"); }
/**
 * تنقية التصميم قبل حفظه/مشاركته: التحقق من البنية + إزالة ملفات الآيرتات الخاصة بالمالك (لا تُشارك)
 * يُبقي فقط مراجع ملفات الآيرتات العامة المعتمدة، وقواعد الآيرتات الرسمية أو العامة.
 */
export async function sanitizePkg(raw: any, ownerId: string) {
  const v = lsValidate(raw); if (!v.ok) return v;
  const p: any = v.value, removed: string[] = [];
  const refs = new Set<string>(); const scan = (o: any) => { if (typeof o === "string") { const m = /^\/api\/alerts\/media\/([A-Za-z0-9_-]+)$/.exec(o); if (m) refs.add(m[1]); } else if (o && typeof o === "object") for (const x of Object.values(o)) scan(x); };
  scan(p.scenes);
  const okAssets = new Set<string>();
  if (refs.size) { const al = await prisma.alert.findMany({ where: { OR: [{ mediaId: { in: [...refs] } }, { coverId: { in: [...refs] } }, { audioId: { in: [...refs] } }] }, select: { mediaId: true, coverId: true, audioId: true, visibility: true, review: true, removed: true } }); for (const a of al) if (alIsListed(a)) for (const k of [a.mediaId, a.coverId, a.audioId]) if (k) okAssets.add(k); }
  const strip = (o: any): any => { if (typeof o === "string") { const m = /^\/api\/alerts\/media\/([A-Za-z0-9_-]+)$/.exec(o); if (m && !okAssets.has(m[1])) { removed.push("ملف خاص"); return ""; } return o; } if (Array.isArray(o)) return o.map(strip); if (o && typeof o === "object") return Object.fromEntries(Object.entries(o).map(([k, x]) => [k, strip(x)])); return o; };
  p.scenes = strip(p.scenes);
  const ids = p.alertRules.map((r: any) => r.alertId).filter((x: string) => !alIsOfficial(x));
  const okAlerts = new Set((await prisma.alert.findMany({ where: { id: { in: ids } }, select: { id: true, visibility: true, review: true, removed: true } })).filter(alIsListed).map(a => a.id));
  p.alertRules = p.alertRules.filter((r: any) => { const k = alIsOfficial(r.alertId) || okAlerts.has(r.alertId); if (!k) removed.push("آيرت خاص"); return k; });
  return { ok: true as const, value: p, stats: lsStats(p), removed };
}
export function toClientLayout(l: any, v: any, extra: any = {}) {
  const mine = !!(v && v.id === l.ownerId);
  const o: any = { id: l.id, name: l.name, description: l.description, kind: l.kind, canvas: l.canvas, shape: l.shape, category: l.category, widgets: l.widgets, designerName: l.designerName || l.owner?.name || "", ownerId: l.ownerId, uses: l.uses, likes: l.likes, favs: l.favs, rating: l.ratingCount ? Math.round((l.ratingSum / l.ratingCount) * 10) / 10 : 0, ratingCount: l.ratingCount, publishedAt: l.publishedAt, createdAt: l.createdAt, mine, verified: !!l.owner?.designerVerified };
  if (mine || (v && v.admin)) Object.assign(o, { code: l.code, visibility: l.visibility, review: l.review, reviewNote: l.reviewNote, removed: l.removed });
  else if (l.visibility !== "private" && !l.removed) o.code = l.code; // العام/برابط: الكود جزء من المشاركة
  if (extra.data) o.data = l.data;
  return Object.assign(o, extra.data ? {} : extra);
}
export { lsShape };
