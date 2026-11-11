// ====== خدمة ربط المنصات (الخادم فقط) ======
// YouTube: قراءة liveChatMessages بالفاصل الذي تحدده Google (pollingIntervalMillis).
// Twitch: EventSub WebSocket الرسمي + اشتراكات عبر Helix.
// Kick: Webhooks الرسمية (المسار /api/webhooks/kick) + اشتراك في الأحداث عبر API.
// الرموز مشفّرة في قاعدة البيانات (lib/secrets). لا شيء من هذا يصل إلى المتصفح.
import WebSocket from "ws";
import type { PrismaClient } from "@prisma/client";
import { encrypt, decrypt } from "../lib/secrets";
import { OAUTH, twitchToEvent, youtubeToEvents, kickToEvent } from "../engine/platforms.js";

type Hub = { dispatch(room: string, ev: any): void };
type Tok = { access: string; refresh?: string; exp?: number };
const env = process.env as Record<string, string | undefined>;

export function createPlatformService(prisma: PrismaClient, hub: Hub) {
  const running = new Map<string, { stop(): void }>(); // key = userId:platform
  const roomOf = async (userId: string) => (await prisma.user.findUnique({ where: { id: userId }, select: { overlayToken: true } }))?.overlayToken;

  async function setStatus(userId: string, platform: string, data: any) {
    await prisma.platformConnection.update({ where: { userId_platform: { userId, platform } }, data }).catch(() => {});
  }
  async function emit(userId: string, platform: string, ev: any) {
    if (!ev) return; const room = await roomOf(userId); if (!room) return;
    hub.dispatch(room, ev);
    await setStatus(userId, platform, { lastEventAt: new Date() });
  }

  /** تبديل الرمز (code) برمز وصول — يُستدعى من مسار callback */
  async function exchange(platform: string, code: string, redirect: string, verifier?: string): Promise<Tok> {
    const c = (OAUTH as any)[platform]; const body = new URLSearchParams({ client_id: env[c.env[0]]!, client_secret: env[c.env[1]]!, code, grant_type: "authorization_code", redirect_uri: redirect });
    if (verifier) body.set("code_verifier", verifier);
    const r = await fetch(c.token, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body });
    if (!r.ok) throw new Error(`token ${platform} ${r.status}`);
    const j: any = await r.json(); return { access: j.access_token, refresh: j.refresh_token, exp: Date.now() + (j.expires_in || 3600) * 1000 };
  }
  async function refresh(userId: string, platform: string, t: Tok): Promise<Tok> {
    if (!t.refresh || (t.exp && t.exp - Date.now() > 120_000)) return t;
    const c = (OAUTH as any)[platform];
    const r = await fetch(c.token, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: env[c.env[0]]!, client_secret: env[c.env[1]]!, grant_type: "refresh_token", refresh_token: t.refresh }) });
    if (!r.ok) { await setStatus(userId, platform, { status: "error", lastError: "انتهت الصلاحية — أعد الربط" }); throw new Error("refresh failed"); }
    const j: any = await r.json(); const nt = { access: j.access_token, refresh: j.refresh_token || t.refresh, exp: Date.now() + (j.expires_in || 3600) * 1000 };
    await setStatus(userId, platform, { tokenEnc: encrypt(nt), expiresAt: new Date(nt.exp) }); return nt;
  }
  const tokenOf = async (userId: string, platform: string) => {
    const c = await prisma.platformConnection.findUnique({ where: { userId_platform: { userId, platform } } });
    return c?.tokenEnc ? refresh(userId, platform, decrypt<Tok>(c.tokenEnc)!) : null;
  };

  /** حفظ الاتصال بعد نجاح OAuth ثم التحقق بجلب هوية الحساب (لا «متصل» قبل التحقق) */
  async function saveConnection(userId: string, platform: string, t: Tok) {
    let acc: { id: string; name: string; avatar?: string } | null = null;
    if (platform === "twitch") { const r: any = await (await fetch("https://api.twitch.tv/helix/users", { headers: { authorization: `Bearer ${t.access}`, "client-id": env.TWITCH_CLIENT_ID! } })).json(); const u = r.data?.[0]; if (u) acc = { id: u.id, name: u.display_name, avatar: u.profile_image_url }; }
    if (platform === "youtube") { const r: any = await (await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true", { headers: { authorization: `Bearer ${t.access}` } })).json(); const c = r.items?.[0]; if (c) acc = { id: c.id, name: c.snippet.title, avatar: c.snippet.thumbnails?.default?.url }; }
    if (platform === "kick") { const r: any = await (await fetch("https://api.kick.com/public/v1/users", { headers: { authorization: `Bearer ${t.access}` } })).json(); const u = r.data?.[0]; if (u) acc = { id: String(u.user_id), name: u.name, avatar: u.profile_picture }; }
    if (!acc) throw new Error("لم نتمكن من التحقق من الحساب");
    const data = { status: "connected", accountId: acc.id, accountName: acc.name, avatarUrl: acc.avatar || null, tokenEnc: encrypt(t), expiresAt: t.exp ? new Date(t.exp) : null, lastError: null };
    await prisma.platformConnection.upsert({ where: { userId_platform: { userId, platform } }, create: { userId, platform, ...data }, update: data });
    await start(userId, platform);
    return acc;
  }

  // ---------- Twitch: EventSub WebSocket ----------
  function startTwitch(userId: string, accountId: string) {
    let ws: WebSocket | null = null, stopped = false, retry = 0;
    const subs = [["channel.chat.message", "1", { broadcaster_user_id: accountId, user_id: accountId }], ["channel.follow", "2", { broadcaster_user_id: accountId, moderator_user_id: accountId }], ["channel.subscribe", "1", { broadcaster_user_id: accountId }], ["channel.subscription.gift", "1", { broadcaster_user_id: accountId }], ["channel.cheer", "1", { broadcaster_user_id: accountId }], ["channel.raid", "1", { to_broadcaster_user_id: accountId }]] as const;
    const open = (url = "wss://eventsub.wss.twitch.tv/ws") => {
      ws = new WebSocket(url);
      ws.on("message", async raw => {
        const m = JSON.parse(String(raw)); const mt = m.metadata?.message_type;
        if (mt === "session_welcome") { retry = 0; const t = await tokenOf(userId, "twitch"); if (!t) return;
          for (const [type, version, condition] of subs) await fetch("https://api.twitch.tv/helix/eventsub/subscriptions", { method: "POST", headers: { authorization: `Bearer ${t.access}`, "client-id": env.TWITCH_CLIENT_ID!, "content-type": "application/json" }, body: JSON.stringify({ type, version, condition, transport: { method: "websocket", session_id: m.payload.session.id } }) }).catch(() => {});
          await setStatus(userId, "twitch", { status: "connected", lastError: null }); }
        else if (mt === "notification") await emit(userId, "twitch", twitchToEvent(m));
        else if (mt === "session_reconnect") { const old = ws; open(m.payload.session.reconnect_url); setTimeout(() => old?.close(), 2000); }
      });
      ws.on("close", () => { if (!stopped) setTimeout(() => open(), Math.min(30_000, 1000 * 2 ** retry++)); });
      ws.on("error", () => {});
    };
    open(); return { stop() { stopped = true; ws?.close(); } };
  }

  // ---------- YouTube: liveChatMessages ----------
  function startYouTube(userId: string) {
    let stopped = false, timer: any, chatId = "", page = "";
    const tick = async () => {
      if (stopped) return; let wait = 15_000;
      try {
        const t = await tokenOf(userId, "youtube"); if (!t) return;
        if (!chatId) { const r: any = await (await fetch("https://www.googleapis.com/youtube/v3/liveBroadcasts?part=snippet&broadcastStatus=active&mine=true", { headers: { authorization: `Bearer ${t.access}` } })).json(); chatId = r.items?.[0]?.snippet?.liveChatId || ""; page = ""; if (!chatId) wait = 30_000; }
        if (chatId) {
          const r = await fetch(`https://www.googleapis.com/youtube/v3/liveChat/messages?part=snippet,authorDetails&liveChatId=${chatId}${page ? `&pageToken=${page}` : ""}`, { headers: { authorization: `Bearer ${t.access}` } });
          if (r.status === 403 || r.status === 404) { chatId = ""; } else { const j: any = await r.json(); const first = !page; page = j.nextPageToken || page; wait = Math.max(3000, j.pollingIntervalMillis || 5000);
            // أول قراءة: نتجاهل الرسائل القديمة حتى لا تظهر كأنها جديدة
            if (!first) for (const ev of youtubeToEvents(j.items)) await emit(userId, "youtube", ev); }
          await setStatus(userId, "youtube", { status: "connected", lastError: chatId ? null : "لا يوجد بث نشط حالياً" });
        }
      } catch (e: any) { await setStatus(userId, "youtube", { lastError: String(e.message || e).slice(0, 200) }); wait = 30_000; }
      timer = setTimeout(tick, wait);
    };
    tick(); return { stop() { stopped = true; clearTimeout(timer); } };
  }

  // ---------- Kick: اشتراك Webhooks (الاستقبال في /api/webhooks/kick) ----------
  async function startKick(userId: string) {
    const t = await tokenOf(userId, "kick"); if (!t) return { stop() {} };
    const events = ["chat.message.sent", "channel.followed", "channel.subscription.new", "channel.subscription.renewal", "channel.subscription.gifts", "kicks.gifted"].map(name => ({ name, version: 1 }));
    const r = await fetch("https://api.kick.com/public/v1/events/subscriptions", { method: "POST", headers: { authorization: `Bearer ${t.access}`, "content-type": "application/json" }, body: JSON.stringify({ events, method: "webhook" }) }).catch(() => null);
    await setStatus(userId, "kick", r && r.ok ? { status: "connected", lastError: null } : { status: "error", lastError: "تعذر الاشتراك في أحداث Kick — تأكد من ضبط رابط Webhook العام في تطبيق Kick" });
    return { stop() {} };
  }
  /** استقبال Webhook من Kick (التوقيع يُتحقق منه في المسار قبل الوصول هنا) */
  async function kickWebhook(type: string, body: any, messageId: string) {
    const bid = String(body?.broadcaster?.user_id || ""); if (!bid) return;
    const c = await prisma.platformConnection.findFirst({ where: { platform: "kick", accountId: bid, status: "connected" } }); if (!c) return;
    await emit(c.userId, "kick", kickToEvent(type, body, messageId));
  }

  async function start(userId: string, platform: string) {
    const key = userId + ":" + platform; running.get(key)?.stop();
    const c = await prisma.platformConnection.findUnique({ where: { userId_platform: { userId, platform } } }); if (!c || c.status === "disconnected") return;
    const h = platform === "twitch" ? startTwitch(userId, c.accountId!) : platform === "youtube" ? startYouTube(userId) : platform === "kick" ? await startKick(userId) : null;
    if (h) running.set(key, h);
  }
  async function stop(userId: string, platform: string) {
    running.get(userId + ":" + platform)?.stop(); running.delete(userId + ":" + platform);
    await prisma.platformConnection.update({ where: { userId_platform: { userId, platform } }, data: { status: "disconnected", tokenEnc: null, refreshEnc: null } }).catch(() => {});
  }
  async function startAll() {
    const all = await prisma.platformConnection.findMany({ where: { status: "connected", platform: { in: ["youtube", "twitch", "kick"] } } });
    for (const c of all) await start(c.userId, c.platform).catch(() => {});
  }
  return { exchange, saveConnection, start, stop, startAll, kickWebhook };
}
