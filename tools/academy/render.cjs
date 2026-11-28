// يرسم حلقة: كل إطار بدقة 1080×1920 ← FFmpeg (H.264). الاستخدام: node render.cjs ep.json out.mp4 [fps] [--frames t1,t2,...]
const { chromium } = require('/opt/npm-tools/node_modules/playwright'); const { spawn } = require('child_process'); const fs = require('fs'), path = require('path');
const [, , epPath, out, fpsArg, ...rest] = process.argv; const FPS = +(fpsArg || 60); const DIR = path.dirname(path.resolve(__dirname, 'engine.html'));
const ep = JSON.parse(fs.readFileSync(epPath, 'utf8')); const abs = s => 'file://' + path.join(DIR, s);
ep.logo = abs('assets/logo.png'); for (const s of ep.scenes) { if (s.src) s.src = abs(s.src); if (s.overlay) s.overlay = abs(s.overlay); }
const DUR = Math.max(...ep.scenes.map(s => s.t1)); const fi = rest.indexOf('--frames');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--allow-file-access-from-files'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.join(DIR, 'engine.html')); await p.evaluate(e => window.__build(e), ep); await p.waitForTimeout(800);
  await p.evaluate(() => Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r }))));
  if (fi >= 0) { for (const t of rest[fi + 1].split(',').map(Number)) { await p.evaluate(t => window.__render(t), t); await p.screenshot({ path: out.replace(/\.mp4$/, '') + `_${t}.jpg`, type: 'jpeg', quality: 92 }); } await b.close(); return; }
  const tmp = out.replace(/\.mp4$/, '.part.mp4');
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-movflags', '+faststart', tmp]);
  const N = Math.round(DUR * FPS), t0 = Date.now();
  for (let f = 0; f < N; f++) { await p.evaluate(t => window.__render(t), f / FPS); const buf = await p.screenshot({ type: 'jpeg', quality: 92 }); if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r)); if (f % 600 === 0) process.stdout.write(`frame ${f}/${N} ${((Date.now() - t0) / 1000) | 0}s\n`); }
  ff.stdin.end(); const code = await new Promise(r => ff.on('close', r)); await b.close(); if (code === 0) { fs.renameSync(tmp, out); console.log('OK', out, N, 'frames', ((Date.now() - t0) / 1000) | 0, 's'); } else { console.log('ffmpeg failed', code); process.exit(1); }
})();
