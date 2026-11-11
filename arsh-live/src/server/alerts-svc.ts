// خدمات سوق الآيرتات على الخادم: المشاهد الحالي، إعدادات المراجعة، تحويل الآيرت لعرض آمن
import { prisma } from "@/lib/db";
import { currentUser, isAdmin } from "@/lib/auth";
import { alPublicView, alBadge, alCanEdit, alEventGroup } from "@/engine/alerts.js";

export async function viewer() {
  const u = await currentUser();
  return u ? { user: u, v: { id: u.id, admin: isAdmin(u) } } : { user: null, v: null };
}
let cfgCache: { at: number; v: any } | null = null;
/** إعدادات المراجعة: يدوي (الافتراضي — المشرف يعتمد) أو تلقائي بعد فحص الملفات */
export async function alertsCfg() {
  if (cfgCache && Date.now() - cfgCache.at < 30_000) return cfgCache.v;
  const row = await prisma.appConfig.findUnique({ where: { key: "alerts" } }).catch(() => null);
  const v = { autoApprove: !!(row?.value as any)?.autoApprove }; cfgCache = { at: Date.now(), v }; return v;
}
export async function setAlertsCfg(p: any) {
  const value = { autoApprove: !!p.autoApprove };
  await prisma.appConfig.upsert({ where: { key: "alerts" }, update: { value }, create: { key: "alerts", value } }); cfgCache = null; return value;
}
/** رابط الملف داخل اللوحة/المكتبة (صلاحية الوصول يتحقق منها مسار الملف نفسه) */
export const mediaPath = (id?: string | null) => (id ? `/api/alerts/media/${id}` : "");
/** ما يُرسل للمتصفح: للمالك كل الحقول، ولغيره العرض العام فقط */
export function toClient(a: any, v: any, extra: any = {}) {
  const mine = alCanEdit(a, v);
  const base: any = mine ? { ...a, mine: true, badge: alBadge(a) } : { ...alPublicView(a), mine: false };
  delete base.reports; if (!mine) delete base.reviewNote;
  base.mediaUrl = mediaPath(a.mediaId); base.audioUrl = mediaPath(a.audioId); base.coverUrl = mediaPath(a.coverId); base.previewUrl = mediaPath(a.previewId); base.group = alEventGroup(a.event);
  base.rating = a.ratingCount ? Math.round((a.ratingSum / a.ratingCount) * 10) / 10 : 0;
  base.designer = a.owner ? { id: a.ownerId, name: a.designerName || a.owner.name, verified: !!a.owner.designerVerified } : { id: a.ownerId, name: a.designerName };
  delete base.owner;
  return Object.assign(base, extra);
}
export const ownerSel = { select: { name: true, designerVerified: true } } as const;
