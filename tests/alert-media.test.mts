import { readFileSync, writeFileSync } from "fs";
import { processMedia, parseProbe } from "/home/claude/najd/arsh-live/src/server/media.ts";
import { alInspect, alCheckFile } from "/home/claude/najd/arsh-live/src/engine/alerts.js";
let f=0; const ok=(c:any,m:string)=>{ console.log((c?"PASS ":"FAIL ")+m); if(!c) f++ };
const D="/tmp/alfx/"; const rd=(n:string)=>new Uint8Array(readFileSync(D+n));
async function up(n:string){ const b=rd(n); const chk:any=alCheckFile("media",b); if(!chk.ok) return {ok:false,error:chk.error}; const i=alInspect(b); return processMedia(b,i) }
const r1:any=await up("mp4_audio.mp4"); ok(r1.ok&&r1.kind==="video"&&!r1.meta.converted&&r1.meta.hasAudio&&Math.abs(r1.meta.duration-3)<.2&&r1.meta.w===640&&r1.cover?.mime==="image/png","1. MP4 with audio: accepted as-is, duration "+r1.meta?.duration+"s, 640x360, audio, auto cover");
const r2:any=await up("mp4_silent.mp4"); ok(r2.ok&&r2.meta.hasAudio===false&&r2.cover,"2. MP4 without audio: hasAudio=false, cover generated");
const r3:any=await up("webm_alpha.webm"); ok(r3.ok&&r3.meta.alpha===true&&!r3.meta.converted&&r3.cover,"3. transparent WebM: alpha detected, kept as-is");
if(r3.cover){ writeFileSync("/tmp/alfx/_c3.png",r3.cover.bytes); const ins=alInspect(r3.cover.bytes); ok(ins.alpha===true,"3b. auto cover of transparent WebM keeps transparency (RGBA PNG)") }
const r4:any=await up("webm_plain.webm"); ok(r4.ok&&r4.meta.alpha===false&&r4.meta.codec.startsWith("vp8"),"4. normal WebM (vp8)");
const r5:any=await up("mov_alpha.mov"); ok(r5.ok&&r5.meta.converted&&r5.main.mime==="video/webm"&&r5.meta.alpha,"5a. MOV ProRes 4444 with alpha → converted to WebM VP9 keeping transparency");
if(r5.ok){ writeFileSync("/tmp/alfx/_m5.webm",r5.main.bytes) }
const r5b:any=await up("mov_h264.mov"); ok(r5b.ok&&r5b.meta.converted&&r5b.main.mime==="video/mp4"&&r5b.meta.hasAudio,"5b. MOV H.264 → remuxed to MP4 (no quality loss)");
const r6:any=await up("gif_anim.gif"); ok(r6.ok&&r6.kind==="gif"&&r6.cover&&r6.meta.animated,"6. animated GIF: cover from first frame");
const r7:any=await up("png_still.png"); ok(r7.ok&&r7.kind==="image"&&!r7.cover,"7. PNG: image itself is the preview");
const r8:any=await up("webp_anim.webp"); ok(r8.ok&&r8.kind==="gif"&&r8.meta.animated,"8. animated WebP accepted (detected animated)");
const r9:any=await up("mp3_sound.mp3"); ok(r9.ok&&r9.kind==="audio"&&Math.abs(r9.meta.duration-2)<.3,"9. MP3: audio-only alert, duration "+r9.meta?.duration);
const r10:any=await up("corrupt.mp4"); ok(!r10.ok&&r10.error==="bad_type","10a. random bytes named .mp4 rejected: "+r10.error);
const r11:any=await up("broken.mp4"); ok(!r11.ok&&r11.error==="corrupt","10b. truncated/corrupt MP4 rejected with clear error: "+r11.error);
// الفحص الثاني للناتج المحوّل
const re:any=await processMedia(new Uint8Array(readFileSync("/tmp/alfx/_m5.webm")),alInspect(new Uint8Array(readFileSync("/tmp/alfx/_m5.webm")))); ok(re.ok&&re.meta.alpha===true&&!re.meta.converted,"converted WebM is browser-playable and still transparent");
ok(parseProbe("Input #0, mov,mp4,m4a,3gp,3g2,mj2, from 'x':\n  Duration: 00:00:04.50, start\n  Stream #0:0[0x1](und): Video: hevc (Main) (hvc1 / 0x31637668), yuv420p(tv), 1920x1080, 30 fps\n").vcodec==="hevc","probe parser reads codec (HEVC → will be converted)");
console.log(f?f+" FAILED":"ALL PASS"); process.exit(f?1:0);
