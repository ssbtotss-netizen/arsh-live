// اتصالات رسمية بمزودي التبرعات: Streamlabs (Socket API) و StreamElements (Astro channel.tips)
// تعمل على الخادم فقط — التوكنات مشفّرة في قاعدة البيانات ولا تصل للمتصفح.
import WebSocket from "ws";
import { randomUUID } from "crypto";
import type { PrismaClient } from "@prisma/client";
import { decrypt } from "../../lib/secrets";
import type { DonationService } from "./service";

type Conn = { stop(): void };
export function createConnectors(prisma: PrismaClient, svc: DonationService) {
  const active = new Map<string, Conn>();
  const setStatus = (userId: string, kind: string, status: string) =>
    prisma.donationProvider.update({ where: { userId_kind: { userId, kind } }, data: { status, ...(status === "connected" ? { lastSyncAt: new Date() } : {}) } }).catch(() => {});

  function streamlabs(userId: string, token: string): Conn {
    let sock: any, stopped = false;
    (async () => {
      let io: any;
      try { io = (await import("socket.io-client")).default; } catch { setStatus(userId, "streamlabs", "مكتبة socket.io-client غير مثبتة"); return; }
      sock = io(`https://sockets.streamlabs.com?token=${encodeURIComponent(token)}`, { transports: ["websocket"], reconnection: true });
      sock.on("connect", () => { setStatus(userId, "streamlabs", "connected"); svc.log(userId, { step: "connected", provider: "streamlabs" }); });
      sock.on("disconnect", (why: any) => { if (stopped) return; setStatus(userId, "streamlabs", "disconnected"); svc.log(userId, { step: "disconnected", provider: "streamlabs", detail: String(why || "") }); }); // socket.io يعيد الاتصال تلقائياً
      sock.on("connect_error", (e: any) => { setStatus(userId, "streamlabs", "خطأ: " + String(e?.message || e).slice(0, 80)); svc.log(userId, { step: "error", provider: "streamlabs", detail: "تعذر الاتصال: " + String(e?.message || e).slice(0, 120) }); });
      sock.on("error", (e: any) => { const s = String(e?.message || e); if (/unauth|invalid|token/i.test(s)) setStatus(userId, "streamlabs", "خطأ: الرمز غير صالح — أعد الربط"); svc.log(userId, { step: "error", provider: "streamlabs", detail: s.slice(0, 120) }); });
      sock.on("event", (e: any) => {
        if (e?.type !== "donation" || (e.for && e.for !== "streamlabs")) return;
        for (const m of Array.isArray(e.message) ? e.message : [e.message]) {
          if (!m) continue;
          if (m.isTest) { svc.testEvent(userId, { provider: "streamlabs", providerId: String(m._id ?? m.id ?? Date.now()), name: m.name ?? m.from ?? "", amount: Number(m.amount), currency: m.currency ?? "USD", message: m.message ?? "" }); continue; } // «Test Donation» من Streamlabs: يحرك العناصر كتجربة ولا يُحتسب
          svc.record(userId, { provider: "streamlabs", providerId: String(m._id ?? m.id ?? m.donation_id ?? ""), name: m.name ?? m.from ?? "", amount: Number(m.amount), currency: m.currency ?? "USD", message: m.message ?? "" }).catch(() => {});
        }
      });
    })();
    return { stop() { stopped = true; try { sock?.close(); } catch {} } };
  }

  function streamelements(userId: string, token: string, tokenType: string): Conn {
    let ws: any = null, stopped = false, retry: any, n = 0, reconnectToken = "";
    const open = () => {
      if (stopped) return;
      ws = new WebSocket((process.env.SE_ASTRO_URL || "wss://astro.streamelements.com/") + (reconnectToken ? `?reconnect_token=${encodeURIComponent(reconnectToken)}` : ""));
      ws.on("open", () => {
        n = 0;
        if (!reconnectToken) ws!.send(JSON.stringify({ type: "subscribe", nonce: randomUUID(), data: { topic: "channel.tips", token, token_type: tokenType || "jwt" } }));
        reconnectToken = "";
      });
      ws.on("message", (raw: any) => {
        let m: any; try { m = JSON.parse(String(raw)); } catch { return; }
        if (m.type === "response") setStatus(userId, "streamelements", m.error ? "خطأ: " + (m.data?.message || m.error) : "connected");
        if (m.type === "reconnect" && m.data?.reconnect_token) reconnectToken = m.data.reconnect_token;
        if (m.type !== "message" || m.topic !== "channel.tips") return;
        const d = m.data || {};
        if (d.status && d.status !== "success") return; // غير مكتمل = لا يُحتسب
        if (d.approved && d.approved !== "allowed") return; // مرفوض من الإشراف
        const don = d.donation || {};
        svc.record(userId, { provider: "streamelements", providerId: String(d._id ?? d.transactionId ?? m.id), name: don.user?.username ?? "", amount: Number(don.amount), currency: don.currency ?? "USD", message: don.message ?? "", t: d.createdAt ? Date.parse(d.createdAt) : undefined }).catch(() => {});
      });
      ws.on("close", () => { if (stopped) return; setStatus(userId, "streamelements", "disconnected"); retry = setTimeout(open, Math.min(60000, 2000 * ++n)); });
      ws.on("error", () => {});
    };
    open();
    return { stop() { stopped = true; clearTimeout(retry); try { ws?.close(); } catch {} } };
  }

  async function restart(userId: string, kind: string) {
    const key = userId + ":" + kind;
    active.get(key)?.stop(); active.delete(key);
    const p = await prisma.donationProvider.findUnique({ where: { userId_kind: { userId, kind } } });
    if (!p?.enabled) return;
    const sec = decrypt<any>(p.secretEnc) || {};
    if (kind === "streamlabs" && sec.socketToken) active.set(key, streamlabs(userId, sec.socketToken));
    if (kind === "streamelements" && sec.token) active.set(key, streamelements(userId, sec.token, (p.publicCfg as any)?.tokenType));
  }
  async function startAll() {
    const all = await prisma.donationProvider.findMany({ where: { enabled: true, kind: { in: ["streamlabs", "streamelements"] } } });
    for (const p of all) await restart(p.userId, p.kind);
  }
  return { restart, startAll };
}
