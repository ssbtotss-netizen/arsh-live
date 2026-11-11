// مركز البث: غرفة لكل صانع محتوى. الخادم هو المرجع للوقت والبيانات.
// استقبال الأحداث (tiktok.ts) ← غرفة (engine/room.js: منع التكرار → محرك القوائم + محرك السبثون/المؤقتات) ← العملاء
import type { WebSocketServer, WebSocket } from "ws";
import { newRoom, roomEvent, roomClockOp, roomTick, roomLive, roomSnapshot, roomBots } from "../lib/core";
import type { Layout, LiveEvent } from "../lib/core";
import { startTikTok, type TikTokHandle } from "./tiktok";

type Client = WebSocket & { room?: string; canEdit?: boolean; alive?: boolean };
type Room = ReturnType<typeof newRoom> & { clients: Set<Client>; layouts: Map<string, Layout>; tiktok?: TikTokHandle; gifts?: any[]; dirty?: boolean; closeTimer?: any };

export type HubOptions = {
  authorize(room: string, key: string | undefined): Promise<boolean>;
  /** يعيد حالة الغرفة المحفوظة: السبثون والمؤقتات وسجل الهدايا وآخر العمليات */
  loadRoom?(room: string): Promise<{ C?: any; H?: any[]; logs?: any[]; DN?: any; bots?: { cfg: any; ctx: any } | null } | null>;
  saveClock?(room: string, C: any): Promise<void>;
  saveLogs?(room: string, logs: any[]): Promise<void>;
  persistGift?(room: string, e: { k: string; name: string; av: string; v: number; c: number; t: number }): Promise<void>;
  persistLayout?(room: string, layout: Layout): Promise<void>;
  onLiveStatus?(room: string, live: boolean, text: string): void;
  onNotify?(room: string, m: any): void;
  onReport?(room: string, report: any): void;
};

export function createHub(wss: WebSocketServer, opt: HubOptions) {
  const rooms = new Map<string, Room>();
  const loading = new Map<string, Promise<Room>>();

  function getRoom(id: string): Promise<Room> {
    const r = rooms.get(id); if (r) return Promise.resolve(r);
    if (!loading.has(id)) loading.set(id, (async () => {
      const room = Object.assign(newRoom(), { clients: new Set<Client>(), layouts: new Map<string, Layout>() }) as Room;
      const saved = await opt.loadRoom?.(id).catch(() => null);
      if (saved?.C) room.C = saved.C;
      if (saved?.H) room.H = saved.H;
      if (saved?.logs) room.logs = saved.logs;
      if (saved?.DN) room.DN = saved.DN;
      if (saved?.bots) roomBots(room as any, saved.bots.cfg, saved.bots.ctx);
      // معرّفات الأحداث المحتسبة سابقاً: تمنع إعادة احتسابها بعد إعادة تشغيل الخادم
      for (const l of room.logs || []) if (l.eventId) room.seen.set(l.eventId, l.at);
      rooms.set(id, room); loading.delete(id); return room;
    })());
    return loading.get(id)!;
  }
  const send = (c: Client, m: unknown) => { if (c.readyState === 1) c.send(JSON.stringify(m)); };
  const broadcast = (r: Room, m: unknown) => { const s = JSON.stringify(m); r.clients.forEach(c => c.readyState === 1 && c.send(s)); };

  /** نشر نتائج المحرك + الحفظ */
  function commit(id: string, r: Room, res: { out: any[]; logs: any[] }) {
    for (const m of res.out) { broadcast(r, m); if (m.t === "notify") opt.onNotify?.(id, m); if (m.t === "report") opt.onReport?.(id, m.report); }
    if (res.out.some(m => m.t === "clock")) { r.dirty = true; }
    if (res.logs.length) opt.saveLogs?.(id, res.logs).catch(() => {});
  }
  function dispatch(id: string, r: Room, ev: LiveEvent) {
    const before = r.H.length;
    const res = roomEvent(r, ev, Date.now());
    if ((res as any).dup) return;
    // أحداث التجربة لا تدخل سجل الهدايا الحقيقي في قاعدة البيانات
    if (ev.type === "gift" && !(ev as any).sim && r.H.length > before) opt.persistGift?.(id, r.H[r.H.length - 1]).catch(() => {});
    commit(id, r, res);
  }

  wss.on("connection", (ws: Client) => {
    ws.alive = true;
    ws.on("pong", () => (ws.alive = true));
    ws.on("message", async raw => {
      let m: any; try { m = JSON.parse(String(raw)); } catch { return; }
      if (!m || typeof m !== "object") return;
      if (m.t === "join" && typeof m.room === "string" && m.room.length >= 6 && m.room.length <= 80) {
        if (ws.room) rooms.get(ws.room)?.clients.delete(ws);
        const r = await getRoom(m.room);
        clearTimeout(r.closeTimer);
        ws.room = m.room;
        ws.canEdit = await opt.authorize(m.room, m.key).catch(() => false);
        r.clients.add(ws);
        send(ws, roomSnapshot(r, Date.now())); // لقطة كاملة: لا تكرار احتساب بعد إعادة الاتصال
        r.layouts.forEach(layout => send(ws, { t: "layout", layout }));
        if (r.gifts) send(ws, { t: "gifts", gifts: r.gifts });
        send(ws, { t: "status", live: !!r.tiktok?.connected, canEdit: ws.canEdit });
        return;
      }
      if (!ws.room) return;
      const id = ws.room, r = rooms.get(id)!;
      if (!ws.canEdit) return send(ws, { t: "status", text: "هذا الاتصال للقراءة فقط" });

      if (m.t === "sim" && m.ev) {
        m.ev.sim = true;
        // التبرعات من لوحة التجربة تُعلَّم تجريبية دائماً ولا تُحفظ في قاعدة البيانات
        if (m.ev.type === "donation") { m.ev.test = true; m.ev.provider = "test"; m.ev.id = "test:" + String(m.ev.id || Date.now()); }
        if (m.ev.type === "donation_refund" && !String(m.ev.id || "").startsWith("test:") && !String(m.ev.id || "").startsWith("sim_")) return;
        return dispatch(id, r, m.ev);
      }
      // عرض فوري (حساب عند الطلب...) يُبث لكل روابط الغرفة
      if (m.t === "fx" && m.fx && typeof m.fx.kind === "string") { const f = m.fx; return broadcast(r, { t: "fx", fx: { kind: String(f.kind).slice(0, 20), accountId: String(f.accountId ?? "").slice(0, 40), at: +f.at || Date.now(), until: Math.min(+f.until || 0, Date.now() + 120000) } }); }
      if (m.t === "clock-op" && typeof m.target === "string" && typeof m.op === "string") return commit(id, r, roomClockOp(r, m, Date.now()));
      if (m.t === "layout" && m.layout && typeof m.layout.id === "string" && Array.isArray(m.layout.widgets)) {
        r.layouts.set(m.layout.id, m.layout);
        // البوتات تعمل هنا فقط (مصدر واحد) — الإعدادات والسياق من آخر تخطيط أرسلته لوحة التحكم
        if (m.layout.bots && typeof m.layout.bots === "object") roomBots(r as any, m.layout.bots, { layout: m.layout, socials: m.layout.socials, donCfg: m.layout.donCfg });
        broadcast(r, { t: "layout", layout: m.layout });
        opt.persistLayout?.(id, m.layout).catch(() => {});
        return;
      }
      if (m.t === "tiktok" && typeof m.username === "string") {
        const username = m.username.replace(/^@/, "").trim();
        if (!/^[\w.]{2,40}$/.test(username)) return send(ws, { t: "status", text: "اسم مستخدم غير صالح" });
        r.tiktok?.stop();
        broadcast(r, { t: "status", text: "جارٍ الاتصال ببث @" + username + " …", live: false });
        r.tiktok = startTikTok(username, {
          onEvent: ev => dispatch(id, r, ev),
          onGifts: gifts => { r.gifts = gifts; broadcast(r, { t: "gifts", gifts }); },
          onStatus: (live, text) => {
            const was = r.live;
            broadcast(r, { t: "status", live, text });
            if (was !== live) commit(id, r, roomLive(r, live, Date.now())); // إيقاف/استكمال السبثون تلقائياً حسب الإعداد
            opt.onLiveStatus?.(id, live, text);
          },
        });
        return;
      }
      if (m.t === "tiktok-stop") {
        r.tiktok?.stop(); r.tiktok = undefined;
        broadcast(r, { t: "status", live: false, text: "تم إيقاف الربط" });
        if (r.live) commit(id, r, roomLive(r, false, Date.now()));
      }
    });
    ws.on("close", () => {
      if (!ws.room) return;
      const id = ws.room, r = rooms.get(id); if (!r) return;
      r.clients.delete(ws);
      if (r.clients.size === 0) r.closeTimer = setTimeout(() => {
        if (r.clients.size) return;
        r.tiktok?.stop();
        if (r.dirty) opt.saveClock?.(id, r.C).catch(() => {});
        rooms.delete(id);
      }, 10 * 60 * 1000);
    });
  });

  // ساعة الخادم: انتهاء السبثون/المؤقتات + البدء المجدول + حفظ الحالة
  const tick = setInterval(() => {
    const now = Date.now();
    rooms.forEach((r, id) => {
      commit(id, r, roomTick(r, now));
      if (r.dirty) { r.dirty = false; opt.saveClock?.(id, r.C).catch(() => {}); }
    });
  }, 1000);
  const ping = setInterval(() => wss.clients.forEach((c: Client) => { if (!c.alive) return c.terminate(); c.alive = false; c.ping(); }), 30000);
  wss.on("close", () => { clearInterval(ping); clearInterval(tick); });

  return { rooms, dispatch: (room: string, ev: LiveEvent) => { const r = rooms.get(room); if (r) dispatch(room, r, ev); } };
}
