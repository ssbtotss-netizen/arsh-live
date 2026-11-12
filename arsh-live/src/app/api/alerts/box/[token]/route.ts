// تعريفات صندوق الآيرتات لرابط OBS: آيرتات القواعد المفعّلة التي يحق لصاحب الرابط استخدامها فقط، بروابط ملفات موقّعة ومؤقتة
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { alCfg, alCanUse, alBoxDef, alIsOfficial, alOfficialDef, alLibAlertIds } from "@/engine/alerts.js";
import { signedMediaUrl } from "@/server/alert-sign";

export async function GET(_: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const u = await prisma.user.findUnique({ where: { overlayToken: token }, select: { id: true, bots: true } });
  if (!u) return NextResponse.json({ error: "not found" }, { status: 404 });
  const cfg = alCfg((u.bots as any)?.alerts || {}), ids = cfg.lib ? alLibAlertIds(cfg.lib) : [...new Set(cfg.rules.filter(r => r.enabled && r.alertId).map(r => r.alertId))]; // مكتبة الأقسام تحل محل القواعد القديمة
  const defs: Record<string, any> = {}, skipped: string[] = [];
  for (const id of ids.filter(alIsOfficial)) defs[id] = alOfficialDef(id);
  const rows = await prisma.alert.findMany({ where: { id: { in: ids.filter(i => !alIsOfficial(i)) } } });
  const uses = new Set((await prisma.alertUse.findMany({ where: { userId: u.id, alertId: { in: rows.map(r => r.id) } }, select: { alertId: true } })).map(x => x.alertId));
  for (const a of rows) {
    // آيرت غيري: يجب أن يكون عاماً معتمداً وأضفته لقائمتي. آيرتي: يعمل حتى لو كان خاصاً
    // آيرت غيري: يجب أن أكون أضفته (استخدام مرخّص). إن أصبح خاصاً لاحقاً أحتفظ بنسختي ما لم يُحذف لمخالفة أو يُرفض
    if (a.ownerId !== u.id && !uses.has(a.id)) { skipped.push(a.id); continue; }
    if (!alCanUse(a, { id: u.id }, { adopted: uses.has(a.id) })) { skipped.push(a.id); continue; }
    const s = (x?: string | null) => (x ? signedMediaUrl(x, token) : "");
    defs[a.id] = alBoxDef(a, { media: s(a.mediaId), audio: s(a.audioId), cover: s(a.coverId) });
  }
  return NextResponse.json({ defs, skipped, rules: cfg.rules.length }, { headers: { "cache-control": "no-store" } });
}
