// ====== قراءة الشات العام لـ Twitch / YouTube / Kick باسم القناة فقط ======
// الحالة تُحفظ في PlatformConnection بمفتاح <platform>_pub (لا يتعارض مع الربط الرسمي OAuth).
// الحالات: listening = متصل بالشات ويستقبل | offline = القناة غير مباشرة الآن (نعيد المحاولة) | error = فشل مع السبب.
import WebSocket from "ws";
import type { PrismaClient } from "@prisma/client";
import { PC_PLATFORMS, pcNormChannel, pcParseIrc, pcIrcHello, PC_KICK_WS, pcKickSub, pcKickFrame, pcKickRoom, pcYtLiveUrl, pcYtVideoId, pcYtInit, pcYtActions, pcYtPoll } from "../engine/pubchat.js";

type Hub = { dispatch(room: string, ev: any): void };
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const key = (p: string) => p + "_pub";

export function createPubChat(prisma: PrismaClient, hub: Hub) {
  const running = new Map<string, { stop(): void }>();
  const seen = new Map<string, Set<string>>();
  const lastSave = new Map<string, number>();
  const roomOf = async (userId: string) => (await prisma.user.findUnique({ where: { id: userId }, select: { overlayToken: true } }))?.overlayToken;

  async function setStatus(userId: string, p: string, data: any) {
    await prisma.platformConnection.update({ where: { userId_platform: { userId, platform: key(p) } }, data }).catch(() => {});
  }
  async function emit(userId: string, p: string, ev: any) {
    if (!ev || !ev.id) return; const k = userId + ":" + p; let s = seen.get(k); if (!s) seen.set(k, (s = new Set()));
    if (s.has(ev.id)) return; s.add(ev.id); if (s.size > 3000) { const a = [...s].slice(-1500); seen.set(k, new Set(a)); }
    const room = await roomOf(userId); if (!room) return;
    hub.dispatch(room, { ...ev, t: ev.at || Date.now() });
    const now = Date.now(); if (now - (lastSave.get(k) || 0) > 30_000) { lastSave.set(k, now); await setStatus(userId, p, { lastEventAt: new Date(), status: "connected", lastError: null }); }
  }

  // ---------- Twitch: IRC الرسمي بحساب مجهول ----------
  function startTwitch(userId: string, ch: string) {
    let ws: WebSocket | null = null, stopped = false, retry = 0, timer: any = null, alive: any = null;
    const open = () => {
      if (stopped) return; ws = new WebSocket("wss://irc-ws.chat.twitch.tv:443");
      ws.on("open", () => { retry = 0; for (const l of pcIrcHello(ch)) ws!.send(l); setStatus(userId, "twitch", { status: "connected", lastError: null }); });
      ws.on("message", (b: any) => { const r = pcParseIrc(String(b)); if (r.ping) ws!.send(r.ping); for (const e of r.events) emit(userId, "twitch", e); });
      ws.on("close", () => { clearInterval(alive); if (stopped) return; setStatus(userId, "twitch", { status: "connecting", lastError: "انقطع الاتصال بشات Twitch — إعادة المحاولة" }); timer = setTimeout(open, Math.min(60_000, 2000 * 2 ** retry++)); });
      ws.on("error", () => {});
      alive = setInterval(() => { try { ws && ws.readyState === 1 && ws.send("PING :tmi.twitch.tv"); } catch {} }, 240_000);
    };
    open();
    return { stop() { stopped = true; clearTimeout(timer); clearInterval(alive); try { ws?.close(); } catch {} } };
  }

  // ---------- YouTube: صفحة الشات العامة للبث المباشر ----------
  function startYouTube(userId: string, ch: string) {
    let stopped = false, timer: any = null;
    const wait = (ms: number, f: () => void) => { if (!stopped) timer = setTimeout(f, ms); };
    const findLive = async () => {
      if (stopped) return;
      try {
        const page = await fetch(pcYtLiveUrl(ch)!, { headers: { "user-agent": UA, "accept-language": "en-US,en;q=0.9", cookie: "CONSENT=YES+1" } });
        if (!page.ok) { await setStatus(userId, "youtube", { status: "error", lastError: `تعذر فتح القناة (${page.status}) — تأكد من اسم القناة` }); return wait(120_000, findLive); }
        const vid = ch.startsWith("v:") ? ch.slice(2) : pcYtVideoId(await page.text());
        if (!vid) { await setStatus(userId, "youtube", { status: "offline", lastError: "القناة غير مباشرة الآن — سيبدأ الشات تلقائياً عند بدء البث" }); return wait(60_000, findLive); }
        const lc = await fetch(`https://www.youtube.com/live_chat?is_popout=1&v=${vid}`, { headers: { "user-agent": UA, "accept-language": "en-US,en;q=0.9", cookie: "CONSENT=YES+1" } });
        const init = lc.ok ? pcYtInit(await lc.text()) : null;
        if (!init) { await setStatus(userId, "youtube", { status: "offline", lastError: "البث بدون شات مباشر أو الشات مقفل" }); return wait(60_000, findLive); }
        await setStatus(userId, "youtube", { status: "connected", lastError: null, accountId: vid });
        for (const e of pcYtActions(init.initial)) emit(userId, "youtube", { ...e, history: true });
        poll(init.key, init.ver, init.continuation, 0);
      } catch (e: any) { await setStatus(userId, "youtube", { status: "error", lastError: "خطأ شبكة مع YouTube — إعادة المحاولة" }); wait(60_000, findLive); }
    };
    const poll = async (apiKey: string, ver: string, cont: string, fails: number) => {
      if (stopped) return;
      try {
        const r = await fetch(`https://www.youtube.com/youtubei/v1/live_chat/get_live_chat?key=${apiKey}&prettyPrint=false`, { method: "POST", headers: { "content-type": "application/json", "user-agent": UA }, body: JSON.stringify({ context: { client: { clientName: "WEB", clientVersion: ver, hl: "ar" } }, continuation: cont }) });
        if (!r.ok) throw new Error("http " + r.status);
        const p = pcYtPoll(await r.json());
        for (const e of p.events) emit(userId, "youtube", e);
        if (p.ended || !p.continuation) { await setStatus(userId, "youtube", { status: "offline", lastError: "انتهى البث — بانتظار البث القادم" }); return wait(60_000, findLive); }
        wait(p.waitMs, () => poll(apiKey, ver, p.continuation!, 0));
      } catch { if (fails >= 4) return wait(30_000, findLive); wait(4000 * (fails + 1), () => poll(apiKey, ver, cont, fails + 1)); }
    };
    findLive();
    return { stop() { stopped = true; clearTimeout(timer); } };
  }

  // ---------- Kick: قناة Pusher العامة ----------
  function startKick(userId: string, ch: string) {
    let ws: WebSocket | null = null, stopped = false, timer: any = null, retry = 0;
    const open = async () => {
      if (stopped) return;
      let room: string | null = null;
      try { const r = await fetch(`https://kick.com/api/v2/channels/${ch}`, { headers: { "user-agent": UA, accept: "application/json" } }); if (r.ok) room = pcKickRoom(await r.json()); else if (r.status === 404) { await setStatus(userId, "kick", { status: "error", lastError: "قناة Kick غير موجودة — تأكد من الاسم" }); return; } else { await setStatus(userId, "kick", { status: "error", lastError: `Kick رفض الطلب من الخادم (${r.status}) — الربط الرسمي يحل هذا` }); timer = setTimeout(open, 300_000); return; } }
      catch { await setStatus(userId, "kick", { status: "error", lastError: "تعذر الوصول إلى Kick — إعادة المحاولة" }); timer = setTimeout(open, 120_000); return; }
      if (!room) { await setStatus(userId, "kick", { status: "error", lastError: "لم نجد غرفة شات لهذه القناة" }); return; }
      ws = new WebSocket(PC_KICK_WS);
      ws.on("open", () => { retry = 0; ws!.send(pcKickSub(room!)); setStatus(userId, "kick", { status: "connected", lastError: null, accountId: room }); });
      ws.on("message", (b: any) => { const e: any = pcKickFrame(String(b)); if (!e) return; if (e.ping) { ws!.send(JSON.stringify({ event: "pusher:pong", data: {} })); return; } emit(userId, "kick", e); });
      ws.on("close", () => { if (stopped) return; setStatus(userId, "kick", { status: "connecting", lastError: "انقطع الاتصال بشات Kick — إعادة المحاولة" }); timer = setTimeout(open, Math.min(60_000, 2000 * 2 ** retry++)); });
      ws.on("error", () => {});
    };
    open();
    return { stop() { stopped = true; clearTimeout(timer); try { ws?.close(); } catch {} } };
  }

  async function start(userId: string, p: string) {
    const k = userId + ":" + p; running.get(k)?.stop(); running.delete(k);
    const c = await prisma.platformConnection.findUnique({ where: { userId_platform: { userId, platform: key(p) } } });
    if (!c || !c.accountName || c.status === "disconnected") return;
    const h = p === "twitch" ? startTwitch(userId, c.accountName) : p === "youtube" ? startYouTube(userId, c.accountName) : p === "kick" ? startKick(userId, c.accountName) : null;
    if (h) running.set(k, h);
  }
  /** ربط قناة بالاسم (يحفظ ويبدأ) */
  async function link(userId: string, p: string, input: string) {
    if (!PC_PLATFORMS.includes(p)) return { ok: false, error: "bad_platform" };
    const ch = pcNormChannel(p, input); if (!ch) return { ok: false, error: "bad_channel" };
    await prisma.platformConnection.upsert({ where: { userId_platform: { userId, platform: key(p) } }, update: { accountName: ch, status: "connecting", lastError: null, accountId: null }, create: { userId, platform: key(p), accountName: ch, status: "connecting" } });
    await start(userId, p); return { ok: true, channel: ch };
  }
  async function unlink(userId: string, p: string) {
    const k = userId + ":" + p; running.get(k)?.stop(); running.delete(k);
    await prisma.platformConnection.deleteMany({ where: { userId, platform: key(p) } });
  }
  async function startAll() {
    const all = await prisma.platformConnection.findMany({ where: { platform: { in: PC_PLATFORMS.map(key) }, NOT: { status: "disconnected" } } });
    for (const c of all) await start(c.userId, c.platform.replace(/_pub$/, "")).catch(() => {});
  }
  return { link, unlink, start, startAll };
}
