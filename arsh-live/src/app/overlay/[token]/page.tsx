"use client";
// رابط OBS / TikTok LIVE Studio: خلفية شفافة، تحديث لحظي من الخادم (أحداث + وقت السبثون/المؤقتات + تعديلات الاستوديو)
import { Suspense, use, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { CANVASES, canvasOf, topsOnEvent, TYPES, View, deliver, migrateWidget, applyEvent, emptyData, newClockState, newWidget, aboxSetDefs, emptyDonations, applyDonation } from "@/lib/core";

export default function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  return <Suspense fallback={null}><Overlay token={token} /></Suspense>;
}

function Overlay({ token }: { token: string }) {
  const q = useSearchParams();
  const layoutId = q.get("layout") ?? "", only = q.get("only"), acc = q.get("acc"), ds = q.get("ds"), pm = q.get("pm") || (q.get("lp") === "1" ? "perf" : "hq"), lowPerf = pm === "perf";
  document.body.classList.add("pm-" + pm);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.style.background = "transparent";
    document.body.className = "ov";
    // الحالة من الخادم فقط (لا LocalStorage): الدونيشن المؤكدة + إعدادات الأهداف — نفس مصدر لوحة التحكم
    const st: any = { D: emptyData(), H: [], C: newClockState(), skew: 0, SO: null, DN: emptyDonations(), DC: null };
    const src = () => st;
    const views = new Map<string, any>();
    let L: any = null, big = 1000, fx = true, ws: WebSocket | null = null, closed = false, retry: any, n = 0, lastMsg = Date.now(), pollT: any = null;
    const DON = new Set(["donation", "donation_refund", "donation_session", "donation_clear_tests"]);
    const stage = stageRef.current!;

    function layout() {
      if (!L) return;
      const base = L.canvas === "acc" ? { w: 900, h: 130 } : canvasOf(L);
      let list = L.widgets, cv = base;
      if (only) { const w = L.widgets.find((x: any) => x.id === only); if (!w) { stage.innerHTML = ""; return; } cv = { w: Math.round(w.w * base.w), h: Math.round(w.h * base.h) }; list = [{ ...w, x: 0, y: 0, w: 1, h: 1 }]; }
      stage.style.width = cv.w + "px"; stage.style.height = cv.h + "px";
      stage.style.transform = `scale(${Math.min(innerWidth / cv.w, innerHeight / cv.h)})`;
      const seen = new Set<string>();
      for (const w of list) {
        seen.add(w.id); let v = views.get(w.id);
        if (v) { v.cv = cv; v.opts.globalFx = fx; v.apply(w); }
        else { v = new (View as any)(w, cv, { data: src, refW: base.w, globalFx: fx, lowPerf }); views.set(w.id, v); stage.appendChild(v.el); v.el.classList.add("w-in"); }
      }
      for (const [id, v] of views) if (!seen.has(id)) { v.el.remove(); views.delete(id); }
    }
    function onMsg(m: any) {
      lastMsg = Date.now();
      if (m.t === "hb") return;
      if (m.t === "snapshot") { st.D = m.D; st.H = m.H || []; st.C = m.C; if (m.DN) st.DN = m.DN; st.skew = (m.now || Date.now()) - Date.now(); }
      else if (m.t === "event") {
        // الإصلاح: أحداث الدونيشن كانت تُتجاهل هنا فلا يتحرك هدف الدعم في OBS/LIVE Studio
        if (DON.has(m.ev.type)) { if (!applyDonation(st.DN, m.ev)) return; if (m.ev.type === "donation") setTimeout(() => { try { const g = stageRef.current?.querySelector("[data-pct]") as HTMLElement | null; ws?.readyState === 1 && ws.send(JSON.stringify({ t: "ack", id: m.ev.id, goal: g ? +(g.dataset.pct || 0) : null })); } catch {} }, 50); }
        else { if (m.ev.type === "gift" && m.ev.big === undefined) m.ev.big = m.ev.value >= big; applyEvent(st.D, st.H, m.ev); if (st.C) { st.C.tops = st.C.tops || {}; topsOnEvent(st.C.tops, m.ev, Date.now(), 180); } }
      }
      else if (m.t === "clock") { st.C = m.C; if (m.now) st.skew = m.now - Date.now(); }
      else if (m.t === "layout") {
        if (m.layout?.socials) st.SO = m.layout.socials; // تعديل الحسابات يظهر فوراً
        if (m.layout?.donCfg) st.DC = m.layout.donCfg; // تعديل الهدف (المبلغ/العملة/التصميم) يظهر فوراً
        if (L && L.canvas !== "acc" && m.layout?.id === L.id) { L = m.layout; L.widgets.forEach(migrateWidget); layout(); }
        if (m.layout?.bots?.alerts) loadBox();
        deliver(views.values(), { t: "snapshot" }, src()); return;
      }
      else if (m.t === "fx") { /* عرض حساب عند الطلب */ }
      else if (m.t === "layout-alerts") { loadBox(); return; }
      else if (!["bot", "act", "alert", "alertctl"].includes(m.t)) return; // ردود البوت، الإجراءات، وصندوق الآيرتات
      deliver(views.values(), m, src());
    }
    // اتصال لحظي + نبضة كل 15 ث لاكتشاف الانقطاع، وبديل بالجلب الدوري إذا تعذر WebSocket (بعض متصفحات البث)
    function connect() {
      try { ws = new WebSocket(`${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/ws`); } catch { n++; startPoll(); retry = setTimeout(connect, 5000); return; }
      const opened = ws; setTimeout(() => { if (!closed && opened.readyState !== 1) startPoll(); }, 5000); // متصفح البث لم يفتح WebSocket خلال 5 ث: نبدأ الجلب الدوري فوراً
      ws.onopen = () => { n = 0; lastMsg = Date.now(); stopPoll(); ws!.send(JSON.stringify({ t: "join", room: token })); };
      ws.onmessage = e => { try { onMsg(JSON.parse(e.data)); } catch {} };
      ws.onclose = () => { if (closed) return; if (++n >= 3) startPoll(); retry = setTimeout(connect, Math.min(15000, 1000 * n)); }; // يعيد الاتصال ويستلم لقطة كاملة بلا تكرار
    }
    const hb = setInterval(() => {
      if (ws && ws.readyState === 1) { ws.send(JSON.stringify({ t: "hb" })); if (Date.now() - lastMsg > 45_000) { try { ws.close(); } catch {} } } // اتصال معلّق: نعيد الاتصال
    }, 15_000);
    function poll() { fetch(`/api/overlay/${token}/state`, { cache: "no-store" }).then(r => r.json()).then(d => { if (!d || d.error) return; st.DN = d.DN; if (d.donCfg) st.DC = d.donCfg; st.skew = (d.now || Date.now()) - Date.now(); deliver(views.values(), { t: "snapshot" }, src()); }).catch(() => {}); }
    function startPoll() { if (!pollT) { poll(); pollT = setInterval(poll, 5000); } }
    function stopPoll() { if (pollT) { clearInterval(pollT); pollT = null; } }
    // صندوق الآيرتات: التعريفات وروابط الملفات الموقّعة من الخادم (الآيرت الخاص لغيري لا يصل أبداً)
    let boxT: any = null;
    function loadBox() { clearTimeout(boxT); boxT = setTimeout(() => fetch(`/api/alerts/box/${token}`).then(r => r.json()).then(d => { if (d?.defs) aboxSetDefs(d.defs); }).catch(() => {}), 400); }
    loadBox(); const boxRe = setInterval(loadBox, 6 * 3600e3);
    fetch(`/api/overlay/${token}?layout=${layoutId}`).then(r => r.json()).then(d => {
      if (!d.layout) return;
      L = d.layout; L.widgets.forEach(migrateWidget); big = d.settings.bigGift; fx = d.settings.fx; st.SO = d.socials; if (d.donCfg && Object.keys(d.donCfg).length) st.DC = d.donCfg;
      if (acc) L = { id: L.id, name: "acc", canvas: "acc", widgets: [newWidget("social", { id: "acc_" + acc, mode: "single", accountId: acc, design: ds || "elite", x: 0, y: 0, w: 1, h: 1 })] };
      layout(); connect();
    });
    // مطابقة دورية مع قاعدة البيانات كل 60 ث حتى مع WebSocket: نفس المبلغ في اللوحة وكل مصادر البث
    const recon = setInterval(() => { if (!pollT) poll(); }, 60_000);
    const tick = setInterval(() => { for (const v of views.values()) if (TYPES[v.w.type]?.tick) v.refresh(src()); }, 250);
    addEventListener("resize", layout);
    return () => { closed = true; clearTimeout(retry); clearInterval(tick); clearInterval(boxRe); clearInterval(hb); clearInterval(recon); stopPoll(); ws?.close(); removeEventListener("resize", layout); };
  }, [token, layoutId, only, acc, ds]);

  return <div ref={stageRef} className="stage" style={{ background: "transparent" }} />;
}
