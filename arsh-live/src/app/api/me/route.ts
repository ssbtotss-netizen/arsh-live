import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { currentUser, token, isAdmin } from "@/lib/auth";
import { subStatus, planCheck } from "@/engine/plans.js";
import { getBilling } from "@/server/appconfig";

import { canvasValid } from "@/engine/defs.js";

export async function GET() {
  const u = await currentUser();
  if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!u.donateSlug) { u.donateSlug = "d" + token(9).toLowerCase().replace(/[^a-z0-9]/g, "x"); await prisma.user.update({ where: { id: u.id }, data: { donateSlug: u.donateSlug } }); }
  const providers = await prisma.donationProvider.findMany({ where: { userId: u.id }, select: { kind: true, enabled: true, status: true } });
  const layouts = await prisma.layout.findMany({ where: { userId: u.id }, orderBy: { sort: "asc" } });
  return NextResponse.json({
    user: { sub: subStatus(u, await getBilling()), isAdmin: isAdmin(u), name: u.name, email: u.email, overlayToken: u.overlayToken, editKey: u.editKey, settings: u.settings, socials: u.socials, donCfg: u.donCfg, bots: u.bots, bio: (u as any).bio, donateSlug: u.donateSlug, providers: Object.fromEntries(providers.map(p => [p.kind, { enabled: p.enabled, connected: p.status === "connected", status: p.status }])) },
    activeLayoutId: u.activeLayoutId,
    layouts: layouts.map(l => ({ id: l.id, name: l.name, canvas: l.canvas, widgets: l.widgets })),
  });
}

/** يحفظ التخطيطات كاملة (كل عنصر بإعداداته المستقلة) + الإعدادات العامة */
export async function PUT(req: Request) {
  const u = await currentUser();
  if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "bad request" }, { status: 400 });
  const ops: any[] = [];
  // رابط البايو: اسم رابط فريد + تنظيف الروابط (http/https فقط)
  if (body.bio && typeof body.bio === "object") {
    const b = body.bio; const handle = String(b.handle || "").toLowerCase().replace(/[^a-z0-9._-]/g, "").slice(0, 30) || null;
    if (handle) { const taken = await prisma.user.findFirst({ where: { bioHandle: handle, NOT: { id: u.id } }, select: { id: true } }); if (taken) return NextResponse.json({ error: "اسم الرابط مستخدم — اختر اسماً آخر" }, { status: 409 }); }
    const links = (Array.isArray(b.links) ? b.links : []).slice(0, 40).map((l: any) => ({ id: String(l.id || "").slice(0, 20), type: String(l.type || "link").slice(0, 20), label: String(l.label || "").slice(0, 80), url: /^(https?:\/\/|mailto:)/i.test(String(l.url || "")) ? String(l.url).slice(0, 500) : "" }));
    const cur: any = (await prisma.user.findUnique({ where: { id: u.id }, select: { bio: true } }))?.bio || {};
    const clean = { handle, name: String(b.name || "").slice(0, 60), about: String(b.about || "").slice(0, 300), avatar: String(b.avatar || "").slice(0, 300000), logo: String(b.logo || "").slice(0, 300000), design: String(b.design || "b6o6").slice(0, 30), animBg: !!b.animBg, live: !!b.live, liveUrl: /^https?:\/\//.test(String(b.liveUrl || "")) ? String(b.liveUrl).slice(0, 300) : "", showVisits: b.showVisits !== false, links, stats: cur.stats || { visits: 0, clicks: {} } };
    ops.push(prisma.user.update({ where: { id: u.id }, data: { bio: clean as any, bioHandle: handle } }));
  }
  if (Array.isArray(body.layouts)) {
    if (body.layouts.length > 50) return NextResponse.json({ error: "too many layouts" }, { status: 400 });
    // حدود الباقة تُفرض على الخادم (لا يمكن تجاوزها من المتصفح)
    const bc = await getBilling();
    const over = planCheck(u, "layouts", body.layouts.length, bc) || planCheck(u, "widgets", body.layouts.reduce((n: number, l: any) => n + (Array.isArray(l?.widgets) ? l.widgets.length : 0), 0), bc);
    if (over) return NextResponse.json({ error: over, code: "plan_limit" }, { status: 402 });
    const ids: string[] = [];
    body.layouts.forEach((l: any, i: number) => {
      if (typeof l?.id !== "string" || !Array.isArray(l.widgets) || l.widgets.length > 60 || JSON.stringify(l.widgets).length > 200000) return;
      ids.push(l.id);
      const data = { name: String(l.name || "تخطيط").slice(0, 80), canvas: canvasValid(l.canvas) ? l.canvas : "vertical", widgets: l.widgets, sort: i };
      ops.push(prisma.layout.upsert({ where: { id: l.id }, create: { id: l.id, userId: u.id, ...data }, update: data }));
    });
    // لا نعدّل تخطيطات مستخدم آخر بالخطأ: upsert بنفس id لمستخدم مختلف يُرفض
    const foreign = await prisma.layout.count({ where: { id: { in: ids }, NOT: { userId: u.id } } });
    if (foreign) return NextResponse.json({ error: "conflict" }, { status: 409 });
    ops.push(prisma.layout.deleteMany({ where: { userId: u.id, id: { notIn: ids } } }));
  }
  const userData: any = {};
  if (body.settings && typeof body.settings === "object") { if (JSON.stringify(body.settings).length > 5000) return NextResponse.json({ error: "settings too large" }, { status: 400 }); userData.settings = body.settings; }
  if (body.socials && typeof body.socials === "object") {
    if (JSON.stringify(body.socials).length > 600000) return NextResponse.json({ error: "socials too large" }, { status: 400 });
    userData.socials = body.socials;
  }
  if (body.bots && typeof body.bots === "object") {
    if (JSON.stringify(body.bots).length > 200000) return NextResponse.json({ error: "bots too large" }, { status: 400 });
    userData.bots = body.bots;
  }
  if (body.donCfg && typeof body.donCfg === "object") {
    if (JSON.stringify(body.donCfg).length > 50000) return NextResponse.json({ error: "donCfg too large" }, { status: 400 });
    userData.donCfg = body.donCfg;
  }
  if (typeof body.name === "string") userData.name = body.name.slice(0, 60);
  if (typeof body.activeLayoutId === "string") userData.activeLayoutId = body.activeLayoutId;
  if (Object.keys(userData).length) ops.push(prisma.user.update({ where: { id: u.id }, data: userData }));
  await prisma.$transaction(ops);
  return NextResponse.json({ ok: true });
}
