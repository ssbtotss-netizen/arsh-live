// خادم اختبار طرفي لطلبات الأغاني: نفس مركز البث (live-hub) ونفس خدمة الأغاني والصفحات ونفس لوحة التحكم المبنية،
// مع ملفات صوتية حقيقية محوّلة بـ FFmpeg. الفرق الوحيد عن الإنتاج: التخزين في الذاكرة بدل PostgreSQL (لا Next/Prisma هنا).
import { createServer } from "http";
import { readFileSync, mkdtempSync, statSync, mkdirSync } from "fs";
import { spawnSync } from "child_process";
import { WebSocketServer } from "/opt/npm-tools/node_modules/ws/wrapper.mjs";
import { createHub } from "/home/claude/najd/arsh-live/src/server/live-hub.ts";
import { createMusicService, libEntry, type MusicTrackRow } from "/home/claude/najd/arsh-live/src/server/music-svc.ts";
import { requestPageHTML, playerPageHTML } from "/home/claude/najd/arsh-live/src/server/music-pages.ts";
import { processMusic } from "/home/claude/najd/arsh-live/src/server/media.ts";
import { alInspect } from "/home/claude/najd/arsh-live/src/engine/alerts.js";
import { userOf } from "/home/claude/najd/arsh-live/src/server/tiktok.ts";

const PORT = +(process.env.PORT || 39500), OVL = "ovl_TOKEN_abc123", SR = "sr_PUBLIC_xyz789", KEY = "EDIT_SECRET_KEY_1";
// ملفات صوتية حقيقية (نغمات 20/14/16 ث بوسوم وغلاف) تُولَّد بـ FFmpeg
const FX = "/tmp/mfx-e2e/"; mkdirSync(FX, { recursive: true });
const ff = (a: string[]) => spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...a]);
ff(["-f", "lavfi", "-i", "sine=frequency=440:duration=20", "-metadata", "title=x", "-c:a", "aac", FX + "t1.m4a"]);
ff(["-f", "lavfi", "-i", "sine=frequency=660:duration=14", "-f", "lavfi", "-i", "color=c=red:s=200x200:d=1", "-map", "0", "-map", "1", "-c:a", "libmp3lame", "-c:v", "mjpeg", "-disposition:v", "attached_pic", "-metadata", "title=Second Song", "-metadata", "artist=Test Band", FX + "t2.mp3"]);
ff(["-f", "lavfi", "-i", "sine=frequency=550:duration=16", "-c:a", "libopus", FX + "t3.ogg"]);
const user = { id: "u1", name: "بطوط", overlayToken: OVL };
const assets = new Map<string, { bytes: Buffer; mime: string }>(), tracks: MusicTrackRow[] = [];
let n = 0;
async function add(file: string, over: any = {}) {
  const p = FX + file, insp: any = alInspect(new Uint8Array(readFileSync(p).subarray(0, 1 << 20)));
  const r: any = await processMusic(p, mkdtempSync("/tmp/mxe-"), insp, statSync(p).size); if (!r.ok) throw new Error(file + " " + r.error);
  const id = "trk" + (++n), aid = "as" + n; assets.set(aid, { bytes: readFileSync(r.path), mime: r.mime });
  let coverId: string | null = null; if (r.cover) { coverId = "cv" + n; assets.set(coverId, { bytes: Buffer.from(r.cover.bytes), mime: r.cover.mime }); }
  tracks.unshift({ id, ownerId: "u1", title: over.title || r.tags.title || file, artist: over.artist ?? r.tags.artist, dur: r.dur, assetId: over.missing ? "gone" : aid, coverId, mime: r.mime, size: r.size });
}
await add("t1.m4a", { title: "فوق هام السحب", artist: "محمد عبده" });
await add("t2.mp3");
await add("t3.ogg", { title: "الأماكن", artist: "محمد عبده" });
await add("t1.m4a", { title: "Broken Song", artist: "Missing File", missing: true });
const store = {
  userBySongToken: async (t: string) => (t === SR ? user : null),
  userByOverlay: async (t: string) => (t === OVL ? { id: "u1" } : null),
  tracks: async () => tracks, track: async (id: string) => tracks.find(t => t.id === id) || null,
  stream: async (aid: string, s: number, e: number) => { const a = assets.get(aid); if (!a) return null; const b = a.bytes.subarray(s, e + 1); return new ReadableStream({ start(c) { c.enqueue(new Uint8Array(b)); c.close(); } }); },
  coverBytes: async (id: string) => { const a = assets.get(id); return a ? { bytes: new Uint8Array(a.bytes), mime: a.mime } : null; },
};
const http = createServer(async (req, res) => {
  const u = new URL(req.url!, "http://x"), p = u.pathname; let r: Response | null = null;
  const html = (h: string) => new Response(h, { headers: { "content-type": "text/html; charset=utf-8" } });
  try {
    let m;
    if ((m = /^\/sr\/([^/]+)$/.exec(p))) r = html(requestPageHTML(m[1]));
    else if ((m = /^\/music-player\/([^/]+)$/.exec(p))) r = html(playerPageHTML(m[1]));
    else if ((m = /^\/api\/sr\/([^/]+)$/.exec(p))) r = await svc.info(m[1]);
    else if ((m = /^\/api\/sr\/([^/]+)\/search$/.exec(p))) r = await svc.search(m[1], u.searchParams.get("q") || "");
    else if ((m = /^\/api\/sr\/([^/]+)\/request$/.exec(p))) { let b = ""; for await (const c of req) b += c; r = await svc.request(m[1], JSON.parse(b || "null"), String(req.headers["x-test-ip"] || req.socket.remoteAddress)); }
    else if ((m = /^\/api\/music\/stream\/([^/]+)\/([^/]+)$/.exec(p))) r = await svc.stream(m[1], m[2], (req.headers.range as string) || null);
    else if ((m = /^\/api\/music\/cover\/([^/]+)$/.exec(p))) r = await svc.cover(m[1]);
    else if (p === "/api/music") r = new Response(JSON.stringify({ tracks: tracks.map(t => ({ ...libEntry(t), size: t.size })), used: 1e6, quota: 300 * 1048576, links: { request: "/sr/" + SR, player: "/music-player/" + OVL } }), { headers: { "content-type": "application/json" } });
    // محاكاة رسالة شات TikTok حقيقية (نفس تحويل المكتبة userOf) → مركز البث (خاص بخادم الاختبار فقط)
    else if (p === "/test/chat") { const d = { comment: u.searchParams.get("text"), user: { uniqueId: u.searchParams.get("id"), nickname: u.searchParams.get("name") } }; hub.dispatch(OVL, { type: "comment", id: "tt_" + Date.now() + Math.random(), user: userOf(d), text: d.comment }); r = new Response("ok"); }
    else if (p === "/dash") {
      const h = readFileSync("/home/claude/najd/demo/index.html", "utf8");
      const cfg = `<script>window.B6O6_CONFIG={layouts:null,activeLayoutId:null,settings:{},profile:{name:"بطوط"},bots:{music:{page:true,noRepeatMin:0}},socials:null,donCfg:null,providers:{},wsUrl:"ws://"+location.host+"/ws",room:${JSON.stringify(OVL)},key:${JSON.stringify(KEY)},api:(path,o={})=>fetch(path,{method:o.method||"GET",headers:{"content-type":"application/json"},body:o.body?JSON.stringify(o.body):undefined}).then(r=>r.json()),persist:()=>Promise.resolve(),overlayURL:()=>"/overlay",logout:()=>{}};</script>`;
      r = html(h.replace("<script>", cfg + "<script>"));
    }
  } catch (e: any) { console.error("[e2e]", e); r = new Response("err", { status: 500 }); }
  if (!r) { res.writeHead(404); return res.end(); }
  const hd: any = {}; r.headers.forEach((v, k) => (hd[k] = v)); res.writeHead(r.status, hd);
  if (r.body) { const rd = r.body.getReader(); for (;;) { const { done, value } = await rd.read(); if (done) break; res.write(Buffer.from(value)); } }
  res.end();
});
const wss = new WebSocketServer({ noServer: true });
http.on("upgrade", (req, sock, head) => { if (req.url === "/ws") wss.handleUpgrade(req, sock, head, (ws: any) => wss.emit("connection", ws, req)); else sock.destroy(); });
const hub: any = createHub(wss as any, { authorize: async (room: string, key: string) => room === OVL && key === KEY, loadMusic: async () => tracks.map(libEntry), loadRoom: async () => ({ bots: { cfg: { music: { page: true, noRepeatMin: 0 } }, ctx: {} } }) });
const svc = createMusicService(store as any, () => hub);
(globalThis as any).__hub = hub;
http.listen(PORT, () => console.log("READY " + PORT));
