// اختبار خادم التبرعات: خدمة التسجيل بدون تكرار + اتصال StreamElements (خادم Astro وهمي محلي) + تأكيد ميسّر
import { WebSocketServer } from "/opt/npm-tools/node_modules/ws/wrapper.mjs";
process.env.APP_SECRET = "x".repeat(40);
process.env.SE_ASTRO_URL = "ws://localhost:4777/";
const { createDonationService } = await import("../arsh-live/src/server/donations/service.ts");
const { createConnectors } = await import("../arsh-live/src/server/donations/connectors.ts");
const { confirmPayment } = await import("../arsh-live/src/server/donations/moyasar.ts");
const { encrypt, decrypt, safeEqual } = await import("../arsh-live/src/lib/secrets.ts");
let f = 0; const ok = (c: any, m: string) => { console.log((c ? "PASS " : "FAIL ") + m); if (!c) f++; };
// prisma وهمي يحاكي القيد الفريد
const db: any = { donations: new Map(), intents: new Map(), providers: new Map(), audit: [] as any[] };
const prisma: any = {
  user: { findUnique: async () => ({ overlayToken: "room1" }) },
  donation: {
    create: async ({ data }: any) => { if ([...db.donations.values()].some((d: any) => d.provider === data.provider && d.providerId === data.providerId)) { const e: any = new Error("dup"); e.code = "P2002"; throw e; } db.donations.set(data.id, { ...data, refunded: 0 }); },
    findUnique: async ({ where }: any) => [...db.donations.values()].find((d: any) => d.provider === where.provider_providerId.provider && d.providerId === where.provider_providerId.providerId) || null,
    update: async ({ where, data }: any) => Object.assign(db.donations.get(where.id), data),
  },
  donationIntent: { findFirst: async ({ where }: any) => db.intents.get(where.id) || null, update: async () => {} },
  donationProvider: { findUnique: async ({ where }: any) => db.providers.get(where.userId_kind.kind) || null, findMany: async () => [...db.providers.values()].filter((p: any) => p.enabled), update: async ({ data }: any) => { db.status = data.status } },
  auditLog: { create: async ({ data }: any) => { db.audit.push(data) } },
};
const sent: any[] = []; const hub = { dispatch: (room: string, ev: any) => sent.push({ room, ev }) };
const svc = createDonationService(prisma, hub);
ok(await svc.record("u1", { provider: "moyasar", providerId: "pay_1", name: "محمد", amount: 50, currency: "sar" }), "first donation recorded");
ok(!(await svc.record("u1", { provider: "moyasar", providerId: "pay_1", name: "محمد", amount: 50, currency: "SAR" })), "same provider transaction rejected (unique)");
ok(sent.length === 1 && sent[0].ev.currency === "SAR" && sent[0].room === "room1", "dispatched once to creator's room");
ok(await svc.refund("moyasar", "pay_1", 20) && sent[1].ev.type === "donation_refund" && sent[1].ev.amount === 20, "partial refund dispatched");
ok(!(await svc.refund("moyasar", "pay_1", 20)), "same refund not applied twice");
ok(db.audit.some((a: any) => a.kind === "donation.refunded"), "refund written to audit log");
// secrets
const enc = encrypt({ secretKey: "sk_live_abc" }); ok(!enc.includes("sk_live") && decrypt(enc).secretKey === "sk_live_abc", "API keys encrypted at rest");
ok(safeEqual("abc", "abc") && !safeEqual("abc", "abd"), "timing-safe webhook secret compare");
// moyasar confirm
db.intents.set("di_1", { id: "di_1", userId: "u1", amount: 2500, currency: "SAR", name: "خالد", anonymous: false, message: "كفو" });
ok((await confirmPayment(prisma, svc, "u1", { id: "pay_2", status: "initiated", amount: 2500, currency: "SAR", metadata: { intent_id: "di_1" } })).ok === false, "unpaid (pending) payment not counted");
ok((await confirmPayment(prisma, svc, "u1", { id: "pay_2", status: "paid", amount: 100, currency: "SAR", metadata: { intent_id: "di_1" } })).reason === "amount-mismatch", "amount tampering rejected");
const c1 = await confirmPayment(prisma, svc, "u1", { id: "pay_2", status: "paid", amount: 2500, currency: "SAR", metadata: { intent_id: "di_1" } });
const c2 = await confirmPayment(prisma, svc, "u1", { id: "pay_2", status: "paid", amount: 2500, currency: "SAR", metadata: { intent_id: "di_1" } });
ok(c1.created === true && c2.created === false && sent.filter(s => s.ev.id === "moyasar:pay_2").length === 1, "callback + webhook for same payment counted once (25 SAR)");
// StreamElements Astro (fake server)
const wss = new WebSocketServer({ port: 4777 }); const subs: any[] = [];
wss.on("connection", (ws: any) => ws.on("message", (m: any) => { const x = JSON.parse(String(m)); subs.push(x); ws.send(JSON.stringify({ type: "response", nonce: x.nonce, data: { message: "ok" } }));
  const tip = (id: string, extra: any = {}) => ws.send(JSON.stringify({ type: "message", topic: "channel.tips", data: { _id: id, status: "success", approved: "allowed", donation: { user: { username: "Styler", email: "secret@x.com" }, amount: 4.2, currency: "USD", message: "hi" }, ...extra } }));
  setTimeout(() => { tip("t1"); tip("t1"); tip("t2", { status: "pending" }); tip("t3", { approved: "denied" }); }, 100); }));
db.providers.set("streamelements", { userId: "u1", kind: "streamelements", enabled: true, publicCfg: { tokenType: "jwt" }, secretEnc: encrypt({ token: "jwt-token" }) });
const conns = createConnectors(prisma, svc); await conns.startAll();
await new Promise(r => setTimeout(r, 700));
ok(subs[0]?.type === "subscribe" && subs[0].data.topic === "channel.tips" && subs[0].data.token_type === "jwt", "subscribed to channel.tips with JWT");
const se = sent.filter(s => s.ev.provider === "streamelements");
ok(se.length === 1 && se[0].ev.amount === 4.2 && se[0].ev.currency === "USD", "only successful, approved tip counted once");
ok(!JSON.stringify(sent).includes("secret@x.com"), "donor email never forwarded to overlays");
ok(db.status === "connected", "provider status = connected");
await conns.restart("u1", "streamelements"); db.providers.get("streamelements").enabled = false; await conns.restart("u1", "streamelements");
wss.close();
console.log(f ? f + " FAILED" : "ALL PASS"); process.exit(f ? 1 : 0);
