// ====== خدمة إرسال الإشعارات (الخادم فقط) ======
import type { PrismaClient } from "@prisma/client";
import { encrypt, decrypt } from "../lib/secrets";
import { notifyFill, notifyAllowed, notifyDefaults } from "../engine/notify.js";

const isDiscordHook = (u: string) => /^https:\/\/(discord|discordapp)\.com\/api\/webhooks\/\d+\/[\w-]+$/.test(u);
export function createNotifyService(prisma: PrismaClient) {
  const gate: Record<string, number> = {};
  async function deliver(kind: string, secret: any, text: string, image?: Buffer) {
    if (kind === "discord") {
      if (!isDiscordHook(secret)) throw new Error("رابط Webhook غير صالح");
      let r: Response;
      if (image) { const fd = new FormData(); fd.append("payload_json", JSON.stringify({ content: text })); fd.append("files[0]", new Blob([image], { type: "image/png" }), "b6o6-stats.png"); r = await fetch(secret, { method: "POST", body: fd }); }
      else r = await fetch(secret, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ content: text, allowed_mentions: { parse: [] } }) });
      if (!r.ok) throw new Error("Discord " + r.status);
    } else if (kind === "telegram") {
      const { token, chatId } = secret || {}; if (!/^\d+:[\w-]{30,}$/.test(token || "") || !chatId) throw new Error("رمز البوت أو المعرّف غير صالح");
      let r: Response;
      if (image) { const fd = new FormData(); fd.append("chat_id", String(chatId)); fd.append("caption", text.slice(0, 1000)); fd.append("photo", new Blob([image], { type: "image/png" }), "stats.png"); r = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, { method: "POST", body: fd }); }
      else r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: false }) });
      const j: any = await r.json().catch(() => ({})); if (!r.ok || j.ok === false) throw new Error("Telegram " + (j.description || r.status));
    }
  }
  /** إرسال حدث لكل القنوات المفعّلة لدى المستخدم مع السجل */
  async function send(userId: string, event: string, vars: Record<string, any>, opts: { image?: Buffer; force?: boolean; only?: string } = {}) {
    const chans = await prisma.notifyChannel.findMany({ where: { userId, enabled: true, ...(opts.only ? { kind: opts.only } : {}) } });
    const results: any[] = [];
    for (const c of chans) {
      const ev = { ...notifyDefaults()[event], ...((c.events as any) || {})[event] };
      if (!opts.force && !ev?.on) continue;
      if (!opts.force && !notifyAllowed(gate, `${userId}:${c.kind}:${event}`, Date.now(), +ev.minGapMin || 0)) { results.push({ kind: c.kind, ok: false, error: "مكرر خلال المهلة" }); continue; }
      const text = notifyFill(ev.tpl, vars);
      try { await deliver(c.kind, decrypt(c.secretEnc), text, opts.image); results.push({ kind: c.kind, ok: true }); await prisma.notifyLog.create({ data: { userId, kind: c.kind, event, ok: true } }); }
      catch (e: any) { const error = String(e.message || e).slice(0, 200); results.push({ kind: c.kind, ok: false, error }); await prisma.notifyLog.create({ data: { userId, kind: c.kind, event, ok: false, error } }); }
    }
    return results;
  }
  const userOfRoom = async (room: string) => (await prisma.user.findFirst({ where: { overlayToken: room }, select: { id: true, name: true } }));
  async function fromRoom(room: string, m: any) { if (m.test) return; const u = await userOfRoom(room); if (!u) return; await send(u.id, "custom", { text: m.text, name: u.name }); }
  async function live(room: string, isLive: boolean, url?: string) { const u = await userOfRoom(room); if (!u) return; await send(u.id, isLive ? "live_start" : "live_end", { name: u.name, url: url || "" }); }
  async function save(userId: string, kind: string, data: { secret?: any; label?: string; enabled?: boolean; events?: any }) {
    const cur = await prisma.notifyChannel.findUnique({ where: { userId_kind: { userId, kind } } });
    const secretEnc = data.secret !== undefined ? encrypt(data.secret) : cur?.secretEnc; if (!secretEnc) throw new Error("أدخل بيانات الربط");
    const d = { secretEnc, label: data.label ?? cur?.label ?? null, enabled: data.enabled ?? cur?.enabled ?? true, events: data.events ?? (cur?.events as any) ?? notifyDefaults() };
    await prisma.notifyChannel.upsert({ where: { userId_kind: { userId, kind } }, create: { userId, kind, ...d }, update: d });
  }
  return { send, fromRoom, live, save };
}
