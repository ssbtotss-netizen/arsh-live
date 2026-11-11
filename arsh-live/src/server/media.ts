// معالجة وسائط الآيرتات على الخادم بـ FFmpeg: قراءة الخصائص، تحويل الترميز غير القابل للتشغيل، صورة معاينة تلقائية، ونسخة معاينة خفيفة.
// لا ندّعي النجاح: أي فشل يرجع برمز خطأ واضح (AL_ERR) ولا يُحفظ شيء.
import { spawn, spawnSync } from "child_process";
import { mkdtemp, writeFile, readFile, rm, stat } from "fs/promises";
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

function run(args: string[], ms = 120_000): Promise<{ code: number; err: string }> {
  return new Promise(res => {
    const ff = ffmpegPath(); if (!ff) return res({ code: -1, err: "no ffmpeg" });
    const p = spawn(ff, ["-hide_banner", "-nostdin", ...args]); let err = "";
    const t = setTimeout(() => { try { p.kill("SIGKILL"); } catch {} }, ms);
    p.stderr.on("data", d => { if (err.length < 200_000) err += d; });
    p.on("close", code => { clearTimeout(t); res({ code: code ?? -1, err }); });
    p.on("error", e => { clearTimeout(t); res({ code: -1, err: String(e) }); });
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
export type Processed = { ok: true; main: Out; cover?: Out; preview?: Out; meta: any; kind: string } | { ok: false; error: string; detail?: string };

/**
 * family: video | image | audio | lottie (من فحص البايتات). يعيد الملف الأساسي (قد يكون محوَّلاً) + غلاف + معاينة خفيفة.
 */
export async function processMedia(bytes: Uint8Array, insp: any): Promise<Processed> {
  const fam = insp.family;
  if (fam === "lottie") return { ok: true, main: { bytes, mime: insp.mime }, meta: { size: bytes.length, mime: insp.mime, alpha: true, animated: true }, kind: "lottie" };
  const ff = ffmpegPath();
  if (!ff) {
    // بدون محوّل: نقبل فقط ما يشغّله المتصفح مباشرة (الغلاف يولّده المتصفح عند الرفع)
    if (insp.mime === "video/quicktime") return { ok: false, error: "no_converter" };
    return { ok: true, main: { bytes, mime: insp.mime }, meta: { size: bytes.length, mime: insp.mime, alpha: insp.alpha, animated: insp.animated }, kind: insp.kind };
  }
  const dir = await mkdtemp(join(tmpdir(), "al-"));
  try {
    const src = join(dir, "src"); await writeFile(src, bytes);
    const p = await probeFile(src);
    if (!p.ok) return { ok: false, error: fam === "image" ? "bad_type" : "corrupt", detail: p.container };
    const meta: any = { size: bytes.length, mime: insp.mime, w: p.w, h: p.h, duration: p.duration, fps: p.fps, hasAudio: p.hasAudio, alpha: fam === "image" ? !!insp.alpha || p.alpha : p.alpha, codec: [p.vcodec, p.acodec].filter(Boolean).join("+"), animated: fam === "video" || !!insp.animated };
    if (fam === "audio") { if (!p.hasAudio) return { ok: false, error: "corrupt" }; return { ok: true, main: { bytes, mime: insp.mime }, meta: { ...meta, w: null, h: null }, kind: "audio" }; }
    if (fam === "image") {
      // الصور المتحركة: غلاف من أول إطار. (WebP المتحرك لا يفكّه FFmpeg — يولّد المتصفح غلافه)
      let cover: Out | undefined;
      if (insp.animated && insp.mime !== "image/webp") { const c = join(dir, "c.png"); const r = await run(["-i", src, "-vf", "scale='min(360,iw)':-2", "-frames:v", "1", c], 30_000); if (r.code === 0) cover = { bytes: await readFile(c), mime: "image/png" }; }
      return { ok: true, main: { bytes, mime: insp.mime }, cover, meta, kind: insp.kind };
    }
    // ---------------- الفيديو
    if (p.duration != null && p.duration > 60) return { ok: false, error: "too_long" };
    if (!p.vcodec) return { ok: false, error: "corrupt" };
    let main: Out = { bytes, mime: insp.mime }, mainFile = src;
    const alpha = p.alpha, dec = p.vcodec === "vp9" && alpha ? ["-c:v", "libvpx-vp9"] : p.vcodec === "vp8" && alpha ? ["-c:v", "libvpx"] : [];
    if (!browserPlayable(p) || insp.mime === "video/quicktime") { // MOV يُحوَّل دائماً لـ MP4/WebM (نوع quicktime لا يُشغَّل بثبات في المتصفح)
      const h264Mov = /mov|mp4/.test(p.container) && p.vcodec === "h264" && !/10le|12le|yuv4(22|44)/.test(p.pix) && (!p.hasAudio || ["aac", "mp3"].includes(p.acodec));
      const out = join(dir, alpha ? "m.webm" : "m.mp4");
      const args = h264Mov ? ["-i", src, "-c", "copy", "-movflags", "+faststart", out] // MOV بترميز H.264: إعادة تغليف فقط بدون فقد جودة
        : alpha ? [...dec, "-i", src, "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "32", "-deadline", "realtime", "-cpu-used", "8", "-row-mt", "1", "-auto-alt-ref", "0", ...(p.hasAudio ? ["-c:a", "libopus", "-b:a", "96k"] : ["-an"]), out] // الشفافية تُحفظ في WebM VP9
          : ["-i", src, "-c:v", "libx264", "-preset", "veryfast", "-crf", "23", "-pix_fmt", "yuv420p", "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2", "-movflags", "+faststart", ...(p.hasAudio ? ["-c:a", "aac", "-b:a", "128k"] : ["-an"]), out];
      const r = await run(args, 240_000);
      if (r.code !== 0 || !(await stat(out).catch(() => null))?.size) return { ok: false, error: "convert_failed", detail: r.err.split("\n").slice(-3).join(" ").slice(0, 200) };
      main = { bytes: await readFile(out), mime: alpha ? "video/webm" : "video/mp4" }; mainFile = out; meta.converted = true; meta.mime = main.mime;
    }
    // غلاف تلقائي: إطار ممثِّل غير أسود (فلتر thumbnail) بعد بداية المقطع، بحجم صغير — PNG ليحفظ الشفافية
    const c = join(dir, "c.png"), mdec = alpha && main.mime === "video/webm" ? ["-c:v", "libvpx-vp9"] : dec;
    const ss = p.duration ? String(Math.min(1.5, p.duration * 0.25).toFixed(2)) : "0";
    let r = await run(["-ss", ss, ...mdec, "-i", mainFile, "-vf", "thumbnail=40,scale='min(400,iw)':-2", "-frames:v", "1", c], 60_000);
    if (r.code !== 0) r = await run([...mdec, "-i", mainFile, "-vf", "scale='min(400,iw)':-2", "-frames:v", "1", c], 60_000);
    const cover = r.code === 0 ? { bytes: await readFile(c), mime: "image/png" } : undefined;
    // نسخة معاينة خفيفة للمكتبة (عند الحاجة فقط): 360p، 8 ثوانٍ كحد أقصى، مع الصوت لزر «تجربة الصوت»
    let preview: Out | undefined;
    if (main.bytes.length > 2.5 * 1024 * 1024 || (p.w || 0) > 720) {
      const pv = join(dir, alpha ? "p.webm" : "p.mp4");
      const pa = alpha ? [...mdec, "-i", mainFile, "-t", "8", "-vf", "scale=-2:'min(360,ih)'", "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "40", "-deadline", "realtime", "-cpu-used", "8", "-auto-alt-ref", "0", ...(p.hasAudio ? ["-c:a", "libopus", "-b:a", "48k"] : ["-an"]), pv]
        : ["-i", mainFile, "-t", "8", "-vf", "scale=-2:'min(360,ih)'", "-c:v", "libx264", "-preset", "veryfast", "-crf", "30", "-pix_fmt", "yuv420p", "-movflags", "+faststart", ...(p.hasAudio ? ["-c:a", "aac", "-b:a", "64k"] : ["-an"]), pv];
      const q = await run(pa, 120_000); if (q.code === 0) { const b = await readFile(pv); if (b.length < main.bytes.length) preview = { bytes: b, mime: alpha ? "video/webm" : "video/mp4" }; }
    }
    meta.size = main.bytes.length; meta.origSize = bytes.length;
    return { ok: true, main, cover, preview, meta, kind: "video" };
  } finally { rm(dir, { recursive: true, force: true }).catch(() => {}); }
}
