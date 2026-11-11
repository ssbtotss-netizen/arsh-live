// مكتبة الآيرتات: القوائم العامة (المعتمدة فقط) + آيرتاتي + المفضلة + أستخدمها — الخصوصية مطبّقة في الاستعلام نفسه
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { alValidate, alVisibilityPatch, alSort, alSearch, alCanView, alCanUse, AL_CATS } from "@/engine/alerts.js";
import { viewer, toClient, alertsCfg, ownerSel } from "@/server/alerts-svc";

const LISTED = { visibility: "public", review: "approved", removed: false } as const;
const PUBLIC_SECTIONS = new Set(["all", "community", "new", "used", "rated", "trending", "week", "month"]);

export async function GET(req: Request) {
  const { user, v } = await viewer();
  const sp = new URL(req.url).searchParams, section = sp.get("section") || "all", q = sp.get("q") || "", cat = sp.get("cat") || "", kind = sp.get("kind") || "", event = sp.get("event") || "";
  const page = Math.max(0, +(sp.get("page") || 0)), per = 40;
  let rows: any[] = [];
  const filt: any = {}; if (AL_CATS[cat]) filt.category = cat; if (kind) filt.kind = kind; if (event) filt.event = event;
  if (PUBLIC_SECTIONS.has(section)) rows = await prisma.alert.findMany({ where: { ...LISTED, ...filt }, orderBy: { publishedAt: "desc" }, take: 600, include: { owner: ownerSel } });
  else if (section === "designer") rows = await prisma.alert.findMany({ where: { ...LISTED, ownerId: String(sp.get("id") || "") }, orderBy: { publishedAt: "desc" }, take: 300, include: { owner: ownerSel } });
  else {
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    if (section === "mine") {
      const vis = sp.get("vis") || "all", w: any = { ownerId: user.id, ...filt };
      if (vis === "public") Object.assign(w, { visibility: "public", review: "approved" }); else if (vis === "private") w.visibility = "private"; else if (vis === "pending") Object.assign(w, { visibility: "public", review: "pending" }); else if (vis === "rejected") w.OR = [{ review: "rejected" }, { removed: true }];
      rows = await prisma.alert.findMany({ where: w, orderBy: { updatedAt: "desc" }, take: 500, include: { owner: ownerSel } });
    } else if (section === "favs") {
      const r = await prisma.alertReaction.findMany({ where: { userId: user.id, fav: true }, include: { alert: { include: { owner: ownerSel } } }, take: 500 });
      rows = r.map(x => x.alert).filter(a => alCanView(a, v));
    } else if (section === "using") {
      const r = await prisma.alertUse.findMany({ where: { userId: user.id }, include: { alert: { include: { owner: ownerSel } } }, orderBy: { createdAt: "desc" } });
      // سياسة المنصة: من أضاف آيرتاً عاماً يحتفظ بنسخته المرخصة إن أصبح خاصاً لاحقاً؛ المحذوف لمخالفة أو المرفوض يظهر "غير متاح"
      return NextResponse.json({ items: r.map(x => alCanUse(x.alert, v, { adopted: true }) ? toClient(x.alert, v, { using: true }) : { id: x.alertId, unavailable: true, using: true, name: "آيرت لم يعد متاحاً" }) });
    } else return NextResponse.json({ error: "bad_section" }, { status: 400 });
  }
  rows = alSearch(rows, q);
  const mode = section === "rated" ? "rated" : section === "used" ? "used" : section === "trending" || section === "all" ? "trending" : section === "week" || section === "month" ? section : "new";
  if (section !== "mine") rows = alSort(rows, mode);
  const total = rows.length; rows = rows.slice(page * per, page * per + per);
  let mineR: Record<string, any> = {}, usingS = new Set<string>();
  if (user && rows.length) {
    const ids = rows.map(a => a.id);
    const [rs, us] = await Promise.all([prisma.alertReaction.findMany({ where: { userId: user.id, alertId: { in: ids } } }), prisma.alertUse.findMany({ where: { userId: user.id, alertId: { in: ids } }, select: { alertId: true } })]);
    for (const r of rs) mineR[r.alertId] = { like: r.like, fav: r.fav, rating: r.rating }; usingS = new Set(us.map(u => u.alertId));
  }
  return NextResponse.json({ total, page, per, items: rows.map(a => toClient(a, v, { my: mineR[a.id] || null, using: usingS.has(a.id) })) }, { headers: { "cache-control": "no-store" } });
}

/** إنشاء آيرت: خاص افتراضياً؛ العام يتطلب تأكيد الحقوق ويدخل المراجعة */
export async function POST(req: Request) {
  const { user } = await viewer(); if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const val = alValidate(b); if (!val.ok) return NextResponse.json({ error: "invalid", errors: val.errors }, { status: 400 });
  const x: any = val.value;
  if ((await prisma.alert.count({ where: { ownerId: user.id } })) >= 300) return NextResponse.json({ error: "limit", message: "وصلت للحد الأعلى (300 آيرت)" }, { status: 400 });
  // الملفات يجب أن تكون ملك المستخدم نفسه — لا يمكن ربط ملف شخص آخر
  for (const k of ["mediaId", "audioId", "coverId"]) if (x[k]) { const a = await prisma.alertAsset.findUnique({ where: { id: x[k] }, select: { ownerId: true, slot: true } }); if (!a || a.ownerId !== user.id) return NextResponse.json({ error: "bad_file", field: k }, { status: 400 }); }
  const data: any = { ...x, ownerId: user.id, visibility: "private", review: "none", designerName: x.designerName || user.name };
  if (x.visibility === "public") { const p = alVisibilityPatch(null, "public", { rightsConfirmed: x.rightsConfirmed, autoApprove: (await alertsCfg()).autoApprove }); if (!p.ok) return NextResponse.json({ error: p.error }, { status: 400 }); Object.assign(data, p.patch); }
  const a = await prisma.alert.create({ data, include: { owner: ownerSel } });
  await prisma.alertUse.upsert({ where: { userId_alertId: { userId: user.id, alertId: a.id } }, update: {}, create: { userId: user.id, alertId: a.id } });
  return NextResponse.json({ ok: true, alert: toClient(a, { id: user.id }) });
}
