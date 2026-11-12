// خادم B6O6 Streaming: Next.js + WebSocket (/ws) + ربط TikTok LIVE — تشغيل: npm run dev
import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { WebSocketServer } from "ws";
import { PrismaClient } from "@prisma/client";
import { createHub } from "./src/server/live-hub";
import { ffmpegPath } from "./src/server/media";
import { createYouTube } from "./src/server/youtube";
const youtube = createYouTube();
import { createPlatformService } from "./src/server/platforms";
import { createNotifyService } from "./src/server/notify";
import { canvasValid } from "./src/engine/defs.js";
import { createDonationService } from "./src/server/donations/service";
import { createConnectors } from "./src/server/donations/connectors";

const dev = process.env.NODE_ENV !== "production";
const port = Number(process.env.PORT || 3000);
// لا نُسقط الخادم بسبب خطأ اتصال واحد — نسجله فقط
process.on("uncaughtException", e => console.error("[uncaught]", e?.message || e));
process.on("unhandledRejection", e => console.error("[unhandled]", (e as any)?.message || e));
const app = next({ dev });
const handle = app.getRequestHandler();
const prisma = new PrismaClient();
const userIdCache = new Map<string, string>();
async function userIdOf(room: string) {
  if (userIdCache.has(room)) return userIdCache.get(room)!;
  const u = await prisma.user.findUnique({ where: { overlayToken: room }, select: { id: true } });
  if (u) userIdCache.set(room, u.id);
  return u?.id ?? null;
}

app.prepare().then(() => {
  const server = createServer((req, res) => handle(req, res, parse(req.url!, true)));
  const wss = new WebSocketServer({ noServer: true, maxPayload: 8 * 1024 * 1024 });
  const nextUpgrade = (app as any).getUpgradeHandler?.();
  server.on("upgrade", (req, socket, head) => {
    if (parse(req.url!).pathname === "/ws") wss.handleUpgrade(req, socket, head, ws => wss.emit("connection", ws, req));
    else if (nextUpgrade) nextUpgrade(req, socket, head);
    else socket.destroy();
  });

  const hub = createHub(wss, {
    // إشعارات Discord/Telegram: «أنا لايف» ونهاية البث (منع التكرار داخل الخدمة) + رسائل الإجراءات
    // سجل «فحص اتصال الدونيشن»: هل وصل الدعم للخادم اللحظي وكم رابط بث استلمه
    onDonationDispatch(room: string, ev: any, info: any) { userIdOf(room).then(uid => { if (uid) (globalThis as any).__b6o6?.donations?.log(uid, { step: info.dup ? "duplicate_live" : info.overlays ? "dispatched" : "no_overlays", id: ev.id, amount: ev.amount, currency: ev.currency, test: !!ev.test, overlays: info.overlays, detail: info.dup ? "حدث مكرر — لم يُحتسب مرة ثانية" : info.overlays ? `أُرسل إلى ${info.overlays} رابط بث متصل` : "لا يوجد رابط بث متصل الآن — سيظهر المبلغ عند فتح الرابط (محفوظ في قاعدة البيانات)" }); }).catch(() => {}); },
    // ردود بوت الأغاني في شات YouTube / Twitch / Kick (TikTok لا يسمح بالإرسال)
    // بوت الأغاني: البحث في YouTube Data API الرسمي (المفتاح على الخادم فقط)
    ytFind: (q: string, o: any) => youtube.find(q, o),
    onChatReply(room: string, platform: string, text: string) { userIdOf(room).then(uid => { if (uid) (globalThis as any).__b6o6?.platforms?.sendChat(uid, platform, text); }).catch(() => {}); },
    onNotify(room: string, m: any) { (globalThis as any).__b6o6?.notify?.fromRoom(room, m).catch(() => {}); },
    // تقرير نهاية البث: حفظ الجلسة في الأرشيف + ملخص Discord/Telegram
    async onReport(room: string, rep: any) {
      const userId = await userIdOf(room); if (!userId || rep.test) return;
      await prisma.streamSession.create({ data: { id: rep.id, userId, status: "ended", startedAt: new Date(rep.startedAt), endedAt: new Date(rep.endedAt), stats: rep as any, complete: !!rep.complete } }).catch(() => {});
      const t = rep.totals || {}; const m = Math.round((rep.durationMs || 0) / 60000);
      await (globalThis as any).__b6o6?.notify?.send(userId, "stats", { duration: `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`, likes: t.likes ?? 0, gifts: t.gifts ?? 0, follows: t.follows ?? 0 }).catch(() => {});
    },
    onLiveStatus(room: string, live: boolean) { (globalThis as any).__b6o6?.notify?.live(room, live, process.env.PUBLIC_URL || "").catch(() => {}); },
    // الغرفة = overlayToken (قراءة فقط في روابط OBS). التعديل يحتاج editKey السري لنفس المستخدم.
    async authorize(room, key) {
      if (!key) return false;
      const u = await prisma.user.findUnique({ where: { overlayToken: room }, select: { editKey: true } });
      return !!u && u.editKey === key;
    },
    async loadRoom(room) {
      const userId = await userIdOf(room); if (!userId) return null;
      const [state, gifts, logs, owner] = await Promise.all([
        prisma.roomState.findUnique({ where: { userId } }),
        prisma.giftEvent.findMany({ where: { userId, createdAt: { gte: new Date(Date.now() - 31 * 864e5) } }, orderBy: { createdAt: "asc" }, take: 20000 }),
        prisma.subathonLog.findMany({ where: { userId }, orderBy: { id: "desc" }, take: 300 }),
        prisma.user.findUnique({ where: { id: userId }, select: { bots: true, socials: true, donCfg: true, activeLayoutId: true, layouts: true } }),
      ]);
      return {
        DN: { list: await donations.load(userId), sessionStart: Date.now() }, // التبرعات المؤكدة فقط (التجريبية لا تُحفظ)
        C: state?.clock ?? undefined,
        H: gifts.map(r => ({ k: r.viewerKey, name: r.viewerName, av: r.avatar, v: r.value, c: r.count, t: r.createdAt.getTime() })),
        logs: logs.map(l => ({ ...l, at: l.at.getTime() })),
        // البوتات تعمل على الخادم حتى لو كانت لوحة التحكم مغلقة (مع OBS فقط)
        bots: owner?.bots && (owner.bots as any).commands ? { cfg: owner.bots, ctx: { socials: owner.socials, donCfg: owner.donCfg, layout: (() => { const ls = (owner as any).layouts || []; const l = ls.find((x: any) => x.id === owner.activeLayoutId) || ls[0]; return l ? { id: l.id, widgets: l.widgets } : null; })() } } : null,
      };
    },
    // مكتبة الأغاني (بيانات فقط) — كانت تأتي من متصفح صانع المحتوى فقط فتضيع بعد إعادة التشغيل
    async loadMusic(room) {
      const userId = await userIdOf(room); if (!userId) return [];
      const rows = await prisma.musicTrack.findMany({ where: { ownerId: userId }, orderBy: { createdAt: "desc" }, take: 2000, select: { id: true, title: true, artist: true, dur: true, coverId: true } });
      return rows.map(t => ({ id: t.id, title: t.title, artist: t.artist, dur: t.dur, cover: t.coverId ? `/api/music/cover/${t.id}` : "" }));
    },
    async saveClock(room, C) {
      const userId = await userIdOf(room); if (!userId) return;
      await prisma.roomState.upsert({ where: { userId }, create: { userId, clock: C }, update: { clock: C } });
    },
    async saveLogs(room, logs) {
      const userId = await userIdOf(room); if (!userId) return;
      // skipDuplicates + unique(userId,eventId): نفس الحدث لا يُسجَّل مرتين حتى بعد إعادة التشغيل
      await prisma.subathonLog.createMany({ skipDuplicates: true, data: logs.map(l => ({ userId, subathonId: l.subathonId, seq: l.seq, deltaMs: Math.round(l.deltaMs), requestedMs: Math.round(l.requestedMs), reason: String(l.reason).slice(0, 200), source: l.source, eventId: l.eventId, remainingMs: Math.round(l.remainingMs), at: new Date(l.at) })) });
    },
    async persistGift(room, e) {
      const userId = await userIdOf(room); if (!userId) return;
      await prisma.giftEvent.create({ data: { userId, viewerKey: e.k, viewerName: e.name, avatar: e.av || "", value: Math.round(e.v), count: e.c, createdAt: new Date(e.t) } });
    },
    async persistLayout(room, l) {
      const userId = await userIdOf(room); if (!userId) return;
      await prisma.layout.updateMany({ where: { id: l.id, userId }, data: { name: String(l.name).slice(0, 80), canvas: canvasValid(l.canvas) ? l.canvas : "vertical", widgets: l.widgets as any } });
    },
  });
  // التبرعات: خدمة التسجيل (بدون تكرار) + الاتصالات الرسمية بالمزودين
  const donations = createDonationService(prisma, hub);
  const connectors = createConnectors(prisma, donations);
  // ربط المنصات (YouTube / Twitch / Kick) — يعمل فقط عند ضبط مفاتيح المطوّر على الخادم
  const platforms = createPlatformService(prisma, hub);
  const notify = createNotifyService(prisma);
  (globalThis as any).__b6o6 = { donations, connectors, platforms, notify, hub, youtube };
  platforms.startAll().catch(e => console.error("platforms", e));
  connectors.startAll().catch(e => console.error("donation connectors", e));

  server.listen(port, () => { console.log(`> B6O6 Streaming يعمل على http://localhost:${port}`); console.log(`[media] ffmpeg: ${ffmpegPath() || "غير متوفر — تحويل MOV/HEVC معطّل"}`); });
});
