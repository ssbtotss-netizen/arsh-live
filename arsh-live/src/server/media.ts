// معالجة وسائط الآيرتات على الخادم بـ FFmpeg: قراءة الخصائص، تحويل الترميز غير القابل للتشغيل، صورة معاينة تلقائية، ونسخة معاينة خفيفة.
// لا ندّعي النجاح: أي فشل يرجع برمز خطأ واضح (AL_ERR) ولا يُحفظ شيء.
import { spawn, spawnSync } from "child_process";
import { mkdtemp, writeFile, readFile, rm, stat } from "fs/promises";
import { readFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

let FF: string | null | undefined;
/** مسار FFmpeg: متغير FFMPEG_PATH ← حزمة ffmpeg-static ← ffmpeg في النظام */
export function ffmpegPath(): string | null {
  if (FF !== undefined) return FF;
  const cands: string[] = [];
  if (process.env.FFMPEG_PATH) cands.push(process.env.FFMPEG_PATH);
  try { const p = require("ffmpeg-static"); if (typeof p === "string") cands.push(p); } catch {}
  cands.push("ffmpeg");
  for (const c of cands) { try { const r = spawnSync(c, ["-version"], { timeout: 8000 }); if (r.status === 0) return (FF = c); } catch {} }
  return (FF = null);
}

/** حد الذاكرة: من cgroup (Render) أو MEM_LIMIT_MB (افتراضي 512) */
function memLimit(): number {
  for (const f of ["/sys/fs/cgroup/memory.max", "/sys/fs/cgroup/memory/memory.limit_in_bytes"]) { try { const v = +readFileSync(f, "utf8").trim(); if (v > 0 && v < 1e13) return v; } catch {} }
  return (+(process.env.MEM_LIMIT_MB || 512)) * 1048576;
}
/** الذاكرة الفعلية (RSS) للخادم + FFmpeg — لا نعتمد memory.current لأنه يشمل ذاكرة التخزين المؤقت القابلة للتحرير */
function memUsed(pid?: number): number {
  let ff = 0; try { if (pid) ff = +((/VmRSS:\s+(\d+)/.exec(readFileSync(`/proc/${pid}/status`, "utf8")) || [])[1] || 0) * 1024; } catch {}
  return process.memoryUsage().rss + ff;
}
/** حارس الذاكرة: إن اقترب الخادم من حده يُوقف FFmpeg فوراً (بدل أن يُقتل الخادم كله ويظهر 502) */
function run(args: string[], ms = 120_000): Promise<{ code: number; err: string; oom?: boolean }> {
  return new Promise(res => {
    const ff = ffmpegPath(); if (!ff) return res({ code: -1, err: "no ffmpeg" });
    const p = spawn(ff, ["-hide_banner", "-nostdin", "-y", ...args]); let err = "", oom = false;
    const lim = memLimit() * 0.85;
    const t = setTimeout(() => { try { p.kill("SIGKILL"); } catch {} }, ms);
    const g = setInterval(() => { if (memUsed(p.pid) > lim) { oom = true; try { p.kill("SIGKILL"); } catch {} } }, 120);
    p.stderr.on("data", d => { if (err.length < 200_000) err += d; });
    p.on("close", code => { clearTimeout(t); clearInterval(g); res({ code: oom ? -2 : code ?? -1, err, oom }); });
    p.on("error", e => { clearTimeout(t); clearInterval(g); res({ code: -1, err: String(e) }); });
  });
}

export type Probe = { ok: boolean; duration: number | null; w: number | null; h: number | null; fps: number | null; vcodec: string; acodec: string; hasAudio: boolean; alpha: boolean; pix: string; container: string };
/** قراءة خصائص الملف من مخرجات ffmpeg -i (لا يحتاج ffprobe) */
export function parseProbe(err: string): Probe {
  const d = /Duration: (\d+):(\d+):(\d+(?:\.\d+)?)/.exec(err);
  const v = /Stream #\d+:\d+(?:\[[^\]]*\])?(?:\([^)]*\))?: Video: ([a-z0-9_]+)[^\n]*/i.exec(err);
  const a = /Stream #\d+:\d+(?:\[[^\]]*\])?(?:\([^)]*\))?: Audio: ([a-z0-9_]+)/i.exec(err);
  const line = v ? v[0] : "";
  const wh = /, (\d{2,5})x(\d{2,5})/.exec(line), fps = /([\d.]+) fps/.exec(line) || /([\d.]+) tbr/.exec(line);
  const pix = (/Video: [^,]+(?:\([^)]*\))*, ([a-z0-9]+)/i.exec(line) || [])[1] || "";
  const cont = (/Input #0, ([^,]+(?:,[^ ]+)*?), from/.exec(err) || [])[1] || "";
  const alpha = /^(yuva|rgba|argb|bgra|abgr|ya8|ya16|gbrap|pal8)/.test(pix) || /alpha_mode\s*:\s*1/.test(err);
  return { ok: !!(v || a), duration: d ? +d[1] * 3600 + +d[2] * 60 + +d[3] : null, w: wh ? +wh[1] : null, h: wh ? +wh[2] : null, fps: fps ? Math.round(+fps[1] * 100) / 100 : null, vcodec: v ? v[1] : "", acodec: a ? a[1] : "", hasAudio: !!a, alpha, pix, container: cont };
}
export async function probeFile(file: string) { const r = await run(["-i", file], 30_000); return parseProbe(r.err); }

/** هل يشغّله Chrome/OBS (CEF) مباشرة؟ */
export function browserPlayable(p: Probe) {
  const c = p.container, v = p.vcodec, a = p.acodec;
  const aOk = !p.hasAudio || ["aac", "mp3", "opus", "vorbis", "flac"].includes(a);
  if (/matroska|webm/.test(c)) return ["vp8", "vp9", "av1"].includes(v) && aOk && (!p.hasAudio || ["opus", "vorbis"].includes(a));
  if (/mov|mp4/.test(c)) return v === "h264" && aOk && !/yuv4(22|44)|10le|12le/.test(p.pix);
  return false;
}

export type Out = { bytes: Uint8Array; mime: string };
export type FOut = { path: string; mime: string; size: number };
export type ProcessedFile = { ok: true; main: FOut; cover?: Out; preview?: FOut; meta: any; kind: string } | { ok: false; error: string; detail?: string };
export type Processed = { ok: true; main: Out; cover?: Out; preview?: Out; meta: any; kind: string } | { ok: false; error: string; detail?: string };

/** معالجة واحدة في كل مرة: خادم Render (512MB) لا يتحمل أكثر من FFmpeg واحد مع Next */
let chain: Promise<any> = Promise.resolve();
export function serial<T>(fn: () => Promise<T>): Promise<T> { const r = chain.then(fn, fn); chain = r.catch(() => {}); return r; }
// خيوط قليلة = ذاكرة أقل (السبب الحقيقي لخطأ 502 كان نفاد الذاكرة)
const LOW = ["-threads", "1", "-filter_threads", "1"];

/**
 * يعمل على ملف في القرص (لا يحمّل الفيديو في الذاكرة). dir: مجلد مؤقت يملكه المستدعي.
 * family: video | image | audio | lottie. يعيد الملف الأساسي (قد يكون محوَّلاً) + غلاف صغير + معاينة خفيفة.
 */
export async function processFile(src: string, dir: string, insp: any, size: number): Promise<ProcessedFile> {
  const fam = insp.family, keep = (): FOut => ({ path: src, mime: insp.mime, size });
  if (fam === "lottie") return { ok: true, main: keep(), meta: { size, mime: insp.mime, alpha: true, animated: true }, kind: "lottie" };
  const ff = ffmpegPath();
  if (!ff) {
    if (insp.mime === "video/quicktime") return { ok: false, error: "no_converter" };
    return { ok: true, main: keep(), meta: { size, mime: insp.mime, alpha: insp.alpha, animated: insp.animated }, kind: insp.kind };
  }
  const p = await probeFile(src);
  if (!p.ok) return { ok: false, error: fam === "image" ? "bad_type" : "corrupt", detail: p.container };
  const meta: any = { size, mime: insp.mime, w: p.w, h: p.h, duration: p.duration, fps: p.fps, hasAudio: p.hasAudio, alpha: fam === "image" ? !!insp.alpha || p.alpha : p.alpha, codec: [p.vcodec, p.acodec].filter(Boolean).join("+"), animated: fam === "video" || !!insp.animated };
  if (fam === "audio") { if (!p.hasAudio) return { ok: false, error: "corrupt" }; return { ok: true, main: keep(), meta: { ...meta, w: null, h: null }, kind: "audio" }; }
  if (fam === "image") {
    let cover: Out | undefined;
    if (insp.animated && insp.mime !== "image/webp") { const c = join(dir, "c.png"); const r = await run([...LOW, "-i", src, "-vf", "scale='min(360,iw)':-2", "-frames:v", "1", c], 30_000); if (r.code === 0) cover = { bytes: await readFile(c), mime: "image/png" }; }
    return { ok: true, main: keep(), cover, meta, kind: insp.kind };
  }
  // ---------------- الفيديو (بدون حد للمدة)
  if (!p.vcodec) return { ok: false, error: "corrupt" };
  let main: FOut = keep();
  const alpha = p.alpha, dec = p.vcodec === "vp9" && alpha ? ["-c:v", "libvpx-vp9"] : p.vcodec === "vp8" && alpha ? ["-c:v", "libvpx"] : [];
  if (!browserPlayable(p) || insp.mime === "video/quicktime") { // MOV يُحوَّل دائماً لـ MP4/WebM
    const h264Mov = /mov|mp4/.test(p.container) && p.vcodec === "h264" && !/10le|12le|yuv4(22|44)/.test(p.pix) && (!p.hasAudio || ["aac", "mp3"].includes(p.acodec));
    const out = join(dir, alpha ? "m.webm" : "m.mp4");
    const aud = (opus: boolean) => (p.hasAudio ? (opus ? ["-c:a", "libopus", "-b:a", "96k"] : ["-c:a", "aac", "-b:a", "128k"]) : ["-an"]);
    // الشفاف ← WebM VP8 alpha (يشغّله Chrome وOBS، وذاكرته أقل بكثير من VP9 alpha). غير الشفاف ← H.264 بإعدادات ذاكرة منخفضة
    const mk = (maxH: number) => h264Mov ? ["-i", src, "-c", "copy", "-movflags", "+faststart", out]
      : alpha ? [...LOW, ...dec, "-i", src, "-vf", `scale=-2:'min(${maxH},ih)'`, "-c:v", "libvpx", "-threads", "1", "-pix_fmt", "yuva420p", "-b:v", maxH > 720 ? "6M" : "3M", "-crf", "10", "-deadline", "realtime", "-cpu-used", "8", "-lag-in-frames", "0", "-auto-alt-ref", "0", ...aud(true), out]
        : [...LOW, "-i", src, "-vf", `scale=-2:'min(${maxH},ih)',scale=trunc(iw/2)*2:trunc(ih/2)*2`, "-c:v", "libx264", "-preset", "veryfast", "-tune", "zerolatency", "-threads", "1", "-crf", "21", "-pix_fmt", "yuv420p", "-movflags", "+faststart", ...aud(false), out];
    let r = await run(mk(1080), 15 * 60_000);
    if (r.oom && !h264Mov) { meta.downscaled = true; r = await run(mk(720), 15 * 60_000); } // لم تكفِ الذاكرة لـ 1080p: إعادة المحاولة بـ 720p
    const st = await stat(out).catch(() => null);
    if (r.oom) return { ok: false, error: "too_heavy" };
    if (r.code !== 0 || !st?.size) return { ok: false, error: "convert_failed", detail: r.err.split("\n").slice(-3).join(" ").slice(0, 200) };
    main = { path: out, mime: alpha ? "video/webm" : "video/mp4", size: st.size }; meta.converted = true; meta.mime = main.mime;
  }
  // غلاف تلقائي: 3 إطارات صغيرة عند أوقات مختلفة، نختار الأغنى تفاصيلاً (أكبر PNG = ليس أسود/فارغاً). بدون فلتر thumbnail الذي يحجز عشرات الإطارات في الذاكرة
  const mdec = meta.converted && alpha ? ["-c:v", "libvpx"] : dec, d = p.duration || 1;
  let cover: Out | undefined;
  for (const [i, t] of [Math.min(1.5, d * 0.25), d * 0.5, Math.min(0.1, d * 0.05)].entries()) {
    const c = join(dir, `c${i}.png`);
    const r = await run(["-ss", t.toFixed(2), ...LOW, ...mdec, "-i", main.path, "-vf", "scale='min(400,iw)':-2", "-frames:v", "1", c], 60_000);
    if (r.code === 0) { const b = await readFile(c).catch(() => null); if (b && (!cover || b.length > cover.bytes.length)) cover = { bytes: b, mime: "image/png" }; if (b && b.length > 40_000) break; }
  }
  // نسخة معاينة خفيفة للمكتبة: 360p وأول 8 ثوانٍ فقط (الآيرت نفسه يُعرض كاملاً في البث)
  let preview: FOut | undefined;
  // الشفاف (VP9 alpha) لا نصنع له نسخة: فك ترميزه يستهلك ~160MB — المعاينة تستخدم الملف نفسه عبر Range (المتصفح يجلب ما يحتاجه فقط)
  if (!alpha && (main.size > 3 * 1024 * 1024 || (p.w || 0) > 720)) {
    const pv = join(dir, alpha ? "p.webm" : "p.mp4");
    const pa = alpha ? ["-t", "8", ...LOW, ...mdec, "-i", main.path, "-t", "8", "-vf", "scale=-2:'min(360,ih)'", "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "42", "-deadline", "realtime", "-cpu-used", "8", "-lag-in-frames", "0", "-auto-alt-ref", "0", ...(p.hasAudio ? ["-c:a", "libopus", "-b:a", "48k"] : ["-an"]), pv]
      : ["-t", "8", ...LOW, "-i", main.path, "-t", "8", "-vf", "scale=-2:'min(360,ih)'", "-c:v", "libx264", "-preset", "veryfast", "-crf", "30", "-pix_fmt", "yuv420p", "-movflags", "+faststart", ...(p.hasAudio ? ["-c:a", "aac", "-b:a", "64k"] : ["-an"]), pv];
    const q = await run(pa, 5 * 60_000); const st = await stat(pv).catch(() => null);
    if (q.code === 0 && st && st.size < main.size) preview = { path: pv, mime: alpha ? "video/webm" : "video/mp4", size: st.size };
  }
  meta.size = main.size; meta.origSize = size;
  return { ok: true, main, cover, preview, meta, kind: "video" };
}

/** واجهة بالبايتات (للاختبارات وللملفات الصغيرة) */
export async function processMedia(bytes: Uint8Array, insp: any): Promise<Processed> {
  const dir = await mkdtemp(join(tmpdir(), "al-"));
  try {
    const src = join(dir, "src"); await writeFile(src, bytes);
    const r = await processFile(src, dir, insp, bytes.length);
    if (!r.ok) return r;
    const rd = async (f?: FOut) => (f ? { bytes: new Uint8Array(await readFile(f.path)), mime: f.mime } : undefined);
    return { ok: true, main: (await rd(r.main))!, cover: r.cover, preview: await rd(r.preview), meta: r.meta, kind: r.kind };
  } finally { rm(dir, { recursive: true, force: true }).catch(() => {}); }
}

// ---------------- الأغاني: ملف صوتي فعلي يُشغَّل في المتصفح و OBS (CEF) ----------------
/** وسوم الملف (العنوان/الفنان) من مخرجات ffmpeg -i */
export function parseTags(err: string) {
  const sec = (/Input #0[\s\S]*?Metadata:\n([\s\S]*?)\n\s{0,2}Duration:/.exec(err) || [])[1] || "";
  const tag = (k: string) => ((new RegExp(`^\\s+${k}\\s*:\\s*(.+)$`, "im").exec(sec) || [])[1] || "").trim();
  return { title: tag("title").slice(0, 120), artist: (tag("artist") || tag("album_artist")).slice(0, 80) };
}
export type MusicOut = { ok: true; path: string; mime: string; size: number; dur: number; cover?: Out; tags: { title: string; artist: string }; converted: boolean } | { ok: false; error: string; detail?: string };
/**
 * يتحقق أن الملف صوت حقيقي، ويحوّل غير MP3 إلى MP3 (يعمل في Chrome و OBS و TikTok LIVE Studio)،
 * ويستخرج الغلاف المضمّن والمدة والوسوم. بدون FFmpeg: يُقبل MP3 فقط.
 */
export async function processMusic(src: string, dir: string, insp: any, size: number): Promise<MusicOut> {
  if (insp.family !== "audio" && insp.family !== "video") return { ok: false, error: "bad_type" };
  const ff = ffmpegPath();
  if (!ff) return insp.mime === "audio/mpeg" ? { ok: true, path: src, mime: "audio/mpeg", size, dur: 0, tags: { title: "", artist: "" }, converted: false } : { ok: false, error: "no_converter" };
  const pr = await run(["-i", src], 30_000), p = parseProbe(pr.err);
  if (!p.ok || !p.hasAudio) return { ok: false, error: "no_audio" };
  const tags = parseTags(pr.err);
  let path = src, mime = insp.mime, out = size, converted = false;
  if (p.acodec !== "mp3" || !/mp3/.test(p.container)) {
    const o = join(dir, "m.mp3"); const r = await run([...LOW, "-i", src, "-map", "0:a:0", "-vn", "-c:a", "libmp3lame", "-b:a", "160k", "-ar", "44100", o], 600_000);
    if (r.code !== 0) return { ok: false, error: r.oom ? "oom" : "convert_failed", detail: r.err.slice(-200) };
    path = o; mime = "audio/mpeg"; out = (await stat(o)).size; converted = true;
  }
  let cover: Out | undefined;
  if (p.vcodec) { const c = join(dir, "c.jpg"); const r = await run([...LOW, "-i", src, "-an", "-frames:v", "1", "-vf", "scale=300:300:force_original_aspect_ratio=increase,crop=300:300", c], 30_000); if (r.code === 0) { const b = await readFile(c).catch(() => null); if (b && b.length) cover = { bytes: b, mime: "image/jpeg" }; } }
  return { ok: true, path, mime, size: out, dur: Math.round(p.duration || 0), cover, tags, converted };
}
