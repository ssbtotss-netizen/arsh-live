// Webhooks الرسمية من Kick — نتحقق من توقيع RSA-SHA256 بالمفتاح العام لـ Kick قبل قبول أي حدث
import { NextResponse } from "next/server";
import { createVerify } from "crypto";

let pubKey = ""; let pubAt = 0;
async function kickKey() {
  if (pubKey && Date.now() - pubAt < 6 * 3600_000) return pubKey;
  const r: any = await (await fetch("https://api.kick.com/public/v1/public-key")).json(); pubKey = r?.data?.public_key || ""; pubAt = Date.now(); return pubKey;
}
export async function POST(req: Request) {
  const raw = await req.text(); const h = req.headers;
  const id = h.get("kick-event-message-id") || "", ts = h.get("kick-event-message-timestamp") || "", sig = h.get("kick-event-signature") || "", type = h.get("kick-event-type") || "";
  if (!id || !ts || !sig || !type) return NextResponse.json({ error: "missing headers" }, { status: 400 });
  const key = await kickKey().catch(() => ""); if (!key) return NextResponse.json({ error: "no key" }, { status: 503 });
  const v = createVerify("RSA-SHA256"); v.update(`${id}.${ts}.${raw}`);
  if (!v.verify(key, sig, "base64")) return NextResponse.json({ error: "bad signature" }, { status: 401 });
  let body: any = {}; try { body = JSON.parse(raw); } catch { return NextResponse.json({ error: "bad json" }, { status: 400 }); }
  await (globalThis as any).__b6o6?.platforms?.kickWebhook(type, body, "kick:" + id);
  return NextResponse.json({ ok: true });
}
