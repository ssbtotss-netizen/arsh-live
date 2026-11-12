// مركز البث: غرفة لكل صانع محتوى. الخادم هو المرجع للوقت والبيانات.
// استقبال الأحداث (tiktok.ts) ← غرفة (engine/room.js: منع التكرار → محرك القوائم + محرك السبثون/المؤقتات) ← العملاء
import type { WebSocketServer, WebSocket } from "ws";
import { newRoom, roomEvent, roomClockOp, roomTick, roomLive, roomSnapshot, roomBots, roomMusicSetLib, roomMusicRequest, roomMusicCfg } from "../lib/core";
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
  onDonationDispatch?(room: string, ev: any, info: { dup: boolean; overlays: number }): void;
  /** مكتبة الأغاني (بيانات فقط) من قاعدة البيانات عند تحميل الغرفة */
  loadMusic?(room: string): Promise<any[]>;
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
      // المكتبة من قاعدة البيانات: طلبات الشات وصفحة الطلب تعمل حتى بعد إعادة تشغيل الخادم (كانت تضيع سابقاً)
      const lib = await opt.loadMusic?.(id).catch(() => null); if (lib) roomMusicSetLib(room as any, lib);
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
    if ((res as any).dup) { if (ev.type === "donation") opt.onDonationDispatch?.(id, ev, { dup: true, overlays: 0 }); return; }
    if (ev.type === "donation") { const ov = [...r.clients].filter(c => c.readyState === 1 && !c.canEdit).length; (r as any).lastDon = { id: ev.id, at: Date.now(), test: !!(ev as any).test, overlays: ov, acks: new Set() }; opt.onDonationDispatch?.(id, ev, { dup: false, overlays: ov }); }
    // أحداث التجربة لا تدخل سجل الهدايا الحقيقي في قاعدة البيانات
    if (ev.type === "gift" && !(ev as any).sim && r.H.length > before) opt.persistGift?.(id, r.H[r.H.length - 1]).catch(() => {});
    commit(id, r, res);
  }

  wss.on("connection", (ws: Client) => {
    ws.alive = true;
    ws.on("pong", () => (ws.alive = true));
    ws.on("error", e => console.error("[ws]", (e as any)?.code || e?.message));
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
      if (m.t === "hb") return send(ws, { t: "hb", now: Date.now() }); // نبضة من رابط OBS/LIVE Studio لاكتشاف الانقطاع
      // تأكيد استلام من رابط البث: يثبت أن تحديث الدعم وصل فعلاً للمصدر (لوحة «فحص اتصال الدونيشن»)
      if (m.t === "ack" && ws.room && typeof m.id === "string") { const r = rooms.get(ws.room); if (r && (r as any).lastDon && (r as any).lastDon.id === m.id) { (r as any).lastDon.acks.add(ws); (r as any).lastDon.goal = m.goal ?? (r as any).lastDon.goal; } return; }
      if (!ws.room) return;
      const id = ws.room, r = rooms.get(id)!;
      // مشغل الأغاني (رابط OBS للقراءة فقط): يُسمح فقط بتقارير حالته — تولّي التشغيل، الحالة، الانتهاء، الخطأ
      if (m.t === "mplayer" && ["claim", "pstate", "pended", "perror"].includes(m.op)) { if (r) commit(id, r, roomClockOp(r, { target: "music", op: m.op, pid: m.pid, kind: m.kind, qid: m.qid, status: m.status, pos: m.pos, why: m.why, force: ws.canEdit ? !!m.force : false }, Date.now())); return; }
      if (!ws.canEdit) return send(ws, { t: "status", text: "هذا الاتصال للقراءة فقط" });
      // «مزامنة الهدف»: لقطة كاملة جديدة لكل روابط البث المتصلة (نفس القيمة في كل مكان)
      if (m.t === "resync") { const r = rooms.get(ws.room); if (r) { const snap = roomSnapshot(r, Date.now()); r.clients.forEach(c => send(c, snap)); r.layouts.forEach(layout => r.clients.forEach(c => send(c, { t: "layout", layout }))); send(ws, { t: "status", text: `🔄 تمت المزامنة مع ${[...r.clients].filter(c => !c.canEdit).length} رابط بث` }); } return; }

      if (m.t === "sim" && m.ev) {
        m.ev.sim = true; delete m.ev.verified; // «مؤكد» يأتي من الخادم فقط (خدمة الدونيشن) — لا من المتصفح
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
        console.log(`[tiktok] start @${username} room=${id.slice(0, 6)}… canEdit=${ws.canEdit}`);
        r.tiktok?.stop();
        broadcast(r, { t: "status", text: "جارٍ الاتصال ببث @" + username + " …", live: false });
        r.tiktok = startTikTok(username, {
          onEvent: ev => dispatch(id, r, ev),
          onGifts: gifts => { r.gifts = gifts; broadcast(r, { t: "gifts", gifts }); },
          onFollowers: n => commit(id, r, roomClockOp(r, { target: "followers", op: "official", platform: "tiktok", value: n, source: "tiktok_live" }, Date.now())),
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

  /** للتشخيص: عدد روابط البث (قراءة فقط) واللوحات المتصلة بالغرفة */
  function stats(room: string) { const r = rooms.get(room); if (!r) return { loaded: false, overlays: 0, dashboards: 0 }; const cs = [...r.clients].filter(c => c.readyState === 1); const ld = (r as any).lastDon; return { loaded: true, overlays: cs.filter(c => !c.canEdit).length, dashboards: cs.filter(c => c.canEdit).length, donations: (r.DN?.list || []).filter((d: any) => !d.test).length, lastDon: ld ? { id: ld.id, at: ld.at, test: ld.test, sentTo: ld.overlays, confirmed: [...ld.acks].filter((c: any) => c.readyState === 1).length, goal: ld.goal ?? null } : null }; }
  /** طلب أغنية من صفحة المشاهد: يحمّل الغرفة إن لزم، يطبق القيود، ويبث القائمة لكل الروابط فوراً */
  async function musicRequest(room: string, trackId: string, user: { id: string; name: string }) {
    const r = await getRoom(room); const res = roomMusicRequest(r as any, trackId, user, Date.now());
    commit(room, r, { out: res.out, logs: [] }); return res.res;
  }
  /** تحديث المكتبة بعد رفع/حذف أغنية */
  function musicLib(room: string, lib: any[]) { const r = rooms.get(room); if (r) roomMusicSetLib(r as any, lib); }
  function musicState(room: string) { const r = rooms.get(room); return r ? (r.C as any)?.music || null : null; }
  /** حالة القائمة + الإعدادات الفعلية للغرفة (لصفحة الطلب العامة) */
  async function musicInfo(room: string) { const r = await getRoom(room); return { M: (r.C as any)?.music || null, cfg: roomMusicCfg(r as any) }; }
  return { rooms, stats, musicRequest, musicLib, musicState, musicInfo, dispatch: (room: string, ev: LiveEvent) => { const r = rooms.get(room); if (r) dispatch(room, r, ev); else if (ev.type === "donation") opt.onDonationDispatch?.(room, ev, { dup: false, overlays: 0 }); } };
}
