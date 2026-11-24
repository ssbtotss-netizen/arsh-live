// مركز البث: غرفة لكل صانع محتوى. الخادم هو المرجع للوقت والبيانات.
// استقبال الأحداث (tiktok.ts) ← غرفة (engine/room.js: منع التكرار → محرك القوائم + محرك السبثون/المؤقتات) ← العملاء
import type { WebSocketServer, WebSocket } from "ws";
import { newRoom, roomEvent, roomClockOp, roomTick, roomLive, roomSnapshot, roomBots, roomMusicSetLib, roomMusicRequest, roomMusicCfg, roomMusicFound, roomSessionConnect, roomSessionEnd, roomSessionOp, roomStats } from "../lib/core";
import type { Layout, LiveEvent } from "../lib/core";
import { startTikTok, type TikTokHandle, type TkInfo } from "./tiktok";
/** حالة الربط للواجهة وروابط البث — ملاحظة المشرف (اسم المتغير ومكانه) لا تُرسل هنا بل تظهر في لوحة الإدارة */
const tkPublic = (i: TkInfo) => { const { admin, ...rest } = i; return { ...rest, server: !!admin }; };

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
  /** رد بوت يجب إرساله في شات المنصة نفسها (YouTube / Twitch / Kick) */
  onChatReply?(room: string, platform: string, text: string): void;
  /** بحث YouTube لطلب أغنية من الشات (غير متزامن) */
  ytFind?(q: string, opts: { maxDurSec: number; region: string }): Promise<any>;
};

/** الحفظ فقط: حالة الغرفة + قائمة هدايا TikTok (لا تُرسل مع كل تحديث للروابط) */
/** يضيف/يحدّث هدية في كتالوج الغرفة من حدث حقيقي — لا يستبدل بيانات صحيحة بأخرى ناقصة */
function seenGift(r: any, e: any): boolean {
  const name = e.gift && e.gift !== "هدية" ? String(e.gift) : "", img = /^https:\/\//.test(String(e.image || "")) ? String(e.image) : "", dia = +e.diamonds > 0 ? +e.diamonds : 0;
  if (!name && !img) return false;
  r.gifts = Array.isArray(r.gifts) ? r.gifts : [];
  const g = r.gifts.find((x: any) => String(x.id) === String(e.giftId));
  if (!g) { r.gifts.push({ id: e.giftId, name: name || "هدية #" + e.giftId, diamonds: dia, image: img, seen: Date.now() }); }
  else { let ch = false; if (!g.image && img) { g.image = img; ch = true; } if ((!g.name || /^هدية #/.test(g.name)) && name) { g.name = name; ch = true; } if (!(+g.diamonds > 0) && dia) { g.diamonds = dia; ch = true; } if (!ch) return false; }
  r.gifts.sort((a: any, b: any) => (+a.diamonds || 0) - (+b.diamonds || 0)); r.dirty = true;
  return true;
}
/** نسخة مضغوطة من بيانات البث الحالي (أعلى 3000 لكل قائمة) — تُحفظ مع معرّف الجلسة لتُستعاد بعد إعادة تشغيل الخادم */
const topN = (o: any, n = 3000) => { const a = Object.values(o || {}) as any[]; if (a.length <= n) return o || {}; a.sort((x, y) => (y.v || 0) - (x.v || 0)); const m: any = {}; for (const x of a.slice(0, n)) m[x.k] = x; return m; };
const compactD = (D: any) => ({ ...D, likes: topN(D.likes), gifts: topN(D.gifts), comments: topN(D.comments), interact: topN(D.interact), giftBy: {}, feed: (D.feed || []).slice(0, 30) });
const withCatalog = (r: any) => { const live = r.C?.live; const C: any = { ...r.C };
  if (r.gifts?.length) C.giftCatalog = { at: Date.now(), list: r.gifts };
  if (live?.sid) C.liveD = { sid: live.sid, at: Date.now(), D: compactD(r.D) };
  return C; };
export function createHub(wss: WebSocketServer, opt: HubOptions) {
  const rooms = new Map<string, Room>();
  const loading = new Map<string, Promise<Room>>();

  function getRoom(id: string): Promise<Room> {
    const r = rooms.get(id); if (r) return Promise.resolve(r);
    if (!loading.has(id)) loading.set(id, (async () => {
      const room = Object.assign(newRoom(), { clients: new Set<Client>(), layouts: new Map<string, Layout>() }) as Room;
      const saved = await opt.loadRoom?.(id).catch(() => null);
      if (saved?.C) room.C = saved.C;
      if ((room.C as any)?.giftCatalog) { const gc = (room.C as any).giftCatalog; if (gc.list?.length) room.gifts = gc.list; delete (room.C as any).giftCatalog; } // آخر قائمة هدايا من TikTok حتى خارج البث
      // بيانات البث الحالي: تُستعاد فقط إذا كانت لنفس الجلسة (نفس معرّف الجلسة) — بيانات بث سابق لا تنتقل لبث جديد
      if ((room.C as any)?.liveD) { const ld = (room.C as any).liveD; delete (room.C as any).liveD; if (ld?.D && ld.sid && (room.C as any).live?.sid === ld.sid) room.D = { ...room.D, ...ld.D }; }
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
    for (const m of res.out) {
      // طلب أغنية يحتاج بحث YouTube: لا يُبث — يُبحث على الخادم ثم تُضاف النتيجة للقائمة ويُبث الرد
      if (m.t === "musicsearch") { const find = opt.ytFind ? opt.ytFind(m.q, m.cfg) : Promise.resolve({ ok: false, message: "البحث في YouTube غير متاح على هذا الخادم" });
        find.catch(() => ({ ok: false, message: "تعذر البحث في YouTube" })).then(yr => commit(id, r, { out: roomMusicFound(r as any, m, yr, Date.now()).out, logs: [] })); continue; }
      broadcast(r, m); if (m.t === "notify") opt.onNotify?.(id, m); if (m.t === "report") opt.onReport?.(id, m.report); if (m.t === "bot") for (const it of m.items || []) if (it.chat && it.text) opt.onChatReply?.(id, it.chat, it.text); }
    if (res.out.some(m => m.t === "clock" || m.t === "glog" || m.t === "session")) { r.dirty = true; } else if (res.out.some(m => m.t === "stats")) (r as any).dirtyD = true; // glog: حالة سلاسل الهدايا + سجل الهدايا تُحفظ مع حالة السبثون
    if (res.logs.length) opt.saveLogs?.(id, res.logs).catch(() => {});
  }
  /** تشخيص الشات لكل منصة: استقبال ← الاسم ← النص ← الخادم ← البث للواجهات (أعداد وأسباب فقط — بدون نصوص المحادثات) */
  function chatDiagIn(r: any, ev: any) {
    const D = (r.chatDiag ||= {}); const P = (D[ev.platform || "tiktok"] ||= { recv: 0, name: 0, text: 0, emote: 0, empty: 0, sent: 0, dup: 0, field: "", fail: "", failAt: 0, okAt: 0 });
    P.recv++; const nm = String(ev.user?.name ?? ev.user?.id ?? "").trim(); const tx = String(ev.text ?? "").trim(); const em = Array.isArray(ev.emotes) && ev.emotes.length > 0;
    if (nm) P.name++; else { P.fail = "وصل الحدث بدون اسم مرسل"; P.failAt = Date.now(); }
    if (tx) { P.text++; P.field = ev.diag?.field || P.field || "text"; } else if (em) P.emote++;
    else { P.empty++; P.fail = "وصل الحدث بدون نص رسالة" + (ev.diag?.keys ? ` — الحقول المتاحة: ${String(ev.diag.keys).slice(0, 300)}` : ""); P.failAt = Date.now(); console.log(`[chat] ${ev.platform || "tiktok"} empty message keys=${ev.diag?.keys ?? "?"}`); }
    return P;
  }
  function dispatch(id: string, r: Room, ev: LiveEvent) {
    const cd = (ev as any).type === "comment" ? chatDiagIn(r, ev) : null;
    const before = r.H.length;
    // اسم/صورة الهدية من قائمة هدايا TikTok الحقيقية إن لم يرسلها الحدث (بالمعرّف فقط — لا نخمّن)
    if (ev.type === "gift" && r.gifts?.length && (ev as any).giftId != null) { const g = r.gifts.find((x: any) => String(x.id) === String((ev as any).giftId));
      if (g) { const e: any = ev; if (!e.gift || e.gift === "هدية") e.gift = g.name; if (!e.image && g.image) e.image = g.image; if (!(+e.diamonds > 0) && +g.diamonds > 0) { e.diamonds = +g.diamonds; e.value = e.diamonds * Math.max(1, +e.count || 1); } } }
    // كتالوج الصور الحقيقية: كل هدية تصل من TikTok (اتصال حقيقي، ليست تجربة) تُحفظ بصورتها واسمها وقيمتها كما أرسلها TikTok
    if (ev.type === "gift" && !(ev as any).sim && !(ev as any).test && (ev as any).streak && (ev as any).giftId != null && seenGift(r, ev as any)) broadcast(r, { t: "gifts", gifts: r.gifts });
    const res = roomEvent(r, ev, Date.now());
    if (cd) { if (res.out.some((m: any) => m.t === "event" && m.ev?.type === "comment")) { cd.sent++; cd.okAt = Date.now(); } else if ((res as any).dup) cd.dup++; }
    if (!(res as any).dup && !(res as any).stale && !(res as any).bad) (r as any).dirtyD = true;
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
        send(ws, { t: "status", live: !!r.tiktok?.connected, canEdit: ws.canEdit, ...(r.tiktok ? { tk: tkPublic(r.tiktok.info), text: r.tiktok.info.text } : {}) }); // حالة الربط الحالية بعد إعادة تحميل الواجهة
        return;
      }
      if (m.t === "hb") return send(ws, { t: "hb", now: Date.now() }); // نبضة من رابط OBS/LIVE Studio لاكتشاف الانقطاع
      // تأكيد استلام من رابط البث: يثبت أن تحديث الدعم وصل فعلاً للمصدر (لوحة «فحص اتصال الدونيشن»)
      if (m.t === "ack" && ws.room && typeof m.id === "string") { const r = rooms.get(ws.room); if (r && (r as any).lastDon && (r as any).lastDon.id === m.id) { (r as any).lastDon.acks.add(ws); (r as any).lastDon.goal = m.goal ?? (r as any).lastDon.goal; } return; }
      if (!ws.room) return;
      const id = ws.room, r = rooms.get(id)!;
      // مشغل الأغاني (رابط OBS للقراءة فقط): يُسمح فقط بتقارير حالته — تولّي التشغيل، الحالة، الانتهاء، الخطأ
      if (m.t === "mplayer" && ["claim", "pstate", "pended", "perror"].includes(m.op)) { if (r) commit(id, r, roomClockOp(r, { target: "music", op: m.op, pid: m.pid, kind: m.kind, qid: m.qid, status: m.status, pos: m.pos, why: m.why, embed: !!m.embed, force: ws.canEdit ? !!m.force : false }, Date.now())); return; }
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
      // جلسات البث من لوحة التحكم: إعدادات التصفير، «تصفير التكبيس الآن»، «بدء جلسة بث جديدة»
      if (m.t === "chatdiag-get") return send(ws, { t: "chatdiag", D: (r as any).chatDiag || {} });
      if (m.t === "session-op" && typeof m.op === "string") return commit(id, r, roomSessionOp(r as any, m, Date.now()));
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
        // منع التكرار: نفس الحساب قيد الاتصال/الانتظار/متصل ← لا طلب توقيع جديد (ضغط متكرر أو إعادة تحميل الواجهة)
        const cur = r.tiktok;
        if (cur && cur.username.toLowerCase() === username.toLowerCase() && ["connecting", "waiting", "connected"].includes(cur.info.state)) {
          console.log(`[tiktok] duplicate start ignored @${username} room=${id.slice(0, 6)}… state=${cur.info.state}`);
          return send(ws, { t: "status", live: cur.connected, text: cur.info.text, tk: tkPublic(cur.info), dup: true });
        }
        console.log(`[tiktok] start @${username} room=${id.slice(0, 6)}… canEdit=${ws.canEdit}`);
        r.tiktok?.stop();
        let h: TikTokHandle | undefined;
        h = r.tiktok = startTikTok(username, {
          onEvent: ev => { if (h && r.tiktok !== h) return; dispatch(id, r, ev); }, // أحداث اتصال قديم بعد استبداله لا تصل للجلسة الحالية
          onGifts: gifts => { r.gifts = gifts; r.dirty = true; broadcast(r, { t: "gifts", gifts }); }, // قائمة هدايا TikTok الحقيقية: تُحفظ مع حالة الغرفة (خارج البث المرسل للروابط)
          onFollowers: n => commit(id, r, roomClockOp(r, { target: "followers", op: "official", platform: "tiktok", value: n, source: "tiktok_live" }, Date.now())),
          onStats: s => { if (h && r.tiktok !== h) return; commit(id, r, roomStats(r as any, "tiktok", s, Date.now())); },
          onStatus: (live, text, info) => {
            if (h && r.tiktok !== h) return; // اتصال قديم بعد الإيقاف أو الاستبدال
            const was = r.live;
            broadcast(r, { t: "status", live, text, ...(info ? { tk: tkPublic(info) } : {}) });
            // جلسات البث: roomId مختلف = بث جديد (تصفير بيانات الجلسة)، نفس roomId = إعادة اتصال (استمرار) — الانقطاع وحده لا يصفّر شيئاً
            if (info?.state === "connected") { const sr = roomSessionConnect(r as any, info.liveRoomId ?? null, Date.now(), { startAt: info.liveStartAt }); if ((sr as any).act !== "same") console.log(`[session] ${id.slice(0, 6)}… ${(sr as any).act} roomId=${info.liveRoomId ?? "?"}`); commit(id, r, sr); }
            if (info?.ended) commit(id, r, roomSessionEnd(r as any, Date.now(), "stream_end"));
            if (was && !live) commit(id, r, roomStats(r as any, "tiktok", { offline: true }, Date.now()));
            if (was !== live) commit(id, r, roomLive(r, live, Date.now())); // إيقاف/استكمال السبثون تلقائياً حسب الإعداد
            opt.onLiveStatus?.(id, live, text);
          },
        });
        return;
      }
      if (m.t === "tiktok-stop") {
        r.tiktok?.stop(); r.tiktok = undefined; // يلغي أي إعادة محاولة أو انتظار
        broadcast(r, { t: "status", live: false, text: "تم إيقاف الربط", tk: { state: "stopped", username: "", attempt: 0, maxAttempts: 0, text: "تم إيقاف الربط", at: Date.now() } });
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
        if (r.dirty) opt.saveClock?.(id, withCatalog(r)).catch(() => {});
        rooms.delete(id);
      }, 10 * 60 * 1000);
    });
  });

  // ساعة الخادم: انتهاء السبثون/المؤقتات + البدء المجدول + حفظ الحالة
  const tick = setInterval(() => {
    const now = Date.now();
    rooms.forEach((r, id) => {
      commit(id, r, roomTick(r, now));
      // بيانات البث (تكبيس/دعم) تتغير كثيراً: تُحفظ كل 15 ثانية على الأكثر لتتحمل إعادة تشغيل الخادم
      if (!r.dirty && (r as any).dirtyD && now - ((r as any).savedAt || 0) > 15000) r.dirty = true;
      if (r.dirty) { r.dirty = false; (r as any).dirtyD = false; (r as any).savedAt = now; opt.saveClock?.(id, withCatalog(r)).catch(() => {}); }
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
  /** أرقام المشاهدين من موصلات المنصات المصرح بها (YouTube/Twitch/Kick) */
  const liveStats = (room: string, platform: string, data: any) => { const r = rooms.get(room); if (r) commit(room, r, roomStats(r as any, platform, data, Date.now())); };
  return { rooms, stats, liveStats, musicRequest, musicLib, musicState, musicInfo, dispatch: (room: string, ev: LiveEvent) => { const r = rooms.get(room); if (r) dispatch(room, r, ev); else if (ev.type === "donation") opt.onDonationDispatch?.(room, ev, { dup: false, overlays: 0 }); } };
}
