// الاختبار الطرفي الإلزامي: مشاهد يبحث ويطلب ← لوحة صانع المحتوى ← قائمة الانتظار ← مشغل OBS يشغّل الصوت فعلياً ← التالي تلقائياً ...
const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const { spawn } = require('child_process');
const PORT = 39500 + Math.floor(Math.random() * 400), B = 'http://127.0.0.1:' + PORT, SR = 'sr_PUBLIC_xyz789', OVL = 'ovl_TOKEN_abc123';
(async () => {
 const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) process.exitCode = 1 };
 const srv = spawn('npx', ['tsx', '../tests/music-e2e-server.mts'], { cwd: '/home/claude/najd/arsh-live', detached: true, env: { ...process.env, PORT: String(PORT) } });
 let slog = ''; srv.stdout.on('data', d => slog += d); srv.stderr.on('data', d => slog += d);
 for (let i = 0; i < 80 && !/READY/.test(slog); i++) await new Promise(r => setTimeout(r, 250));
 if (!/READY/.test(slog)) { console.log('FAIL server did not start ' + slog); try { process.kill(-srv.pid) } catch (e) { srv.kill() } process.exit(1) }
 const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
 const errs = [];
 const page = async (url, w = 1280, h = 900) => { const ctx = await b.newContext({ viewport: { width: w, height: h } }); await ctx.grantPermissions(['clipboard-read', 'clipboard-write']); const p = await ctx.newPage(); p.on('pageerror', e => errs.push(url + ': ' + e.message)); await p.goto(B + url); return p };
 const wait = (p, fn, arg, ms = 8000) => p.waitForFunction(fn, arg, { timeout: ms }).then(() => true, () => false);

 // 0) الأمان: لا مفاتيح في الروابط العامة
 const srHtml = await (await fetch(B + '/sr/' + SR)).text(), plHtml = await (await fetch(B + '/music-player/' + OVL)).text();
 ok(!srHtml.includes(OVL) && !srHtml.includes('EDIT_SECRET') && !plHtml.includes('EDIT_SECRET'), 'no edit key in public pages; request page never exposes the OBS token');
 ok((await fetch(B + '/api/music/stream/' + SR + '/trk2')).status === 404 && (await fetch(B + '/api/music/stream/wrong_token_x/trk2')).status === 404, 'audio files only open with the creator OBS link (request token / wrong token → 404)');

 // 1) لوحة صانع المحتوى (اللوحة الحقيقية المبنية) — صفحة الأغاني
 const dash = await page('/dash', 1440, 1000);
 await dash.waitForTimeout(1500); await dash.evaluate(() => { S.page = 'music'; renderPage() }); await dash.waitForTimeout(800);
 ok(await wait(dash, () => wsReady === true), 'dashboard connected to the realtime server (WebSocket)');
 ok(await wait(dash, () => document.querySelectorAll('[data-madd]').length === 4), 'dashboard library loaded from the server (4 tracks)');
 const links = await dash.$$eval('[data-mucopy]', e => e.map(x => x.dataset.mucopy));
 ok(links.some(l => l.endsWith('/sr/' + SR)) && links.some(l => l.endsWith('/music-player/' + OVL)), 'request-page link + independent OBS player link shown');

 // 2) مشغل OBS (Browser Source)
 const obs = await page('/music-player/' + OVL, 800, 200);
 ok(await wait(obs, () => window.__player && window.__player.M && window.__player.mine), 'OBS player connected and owns playback');
 ok(await obs.evaluate(() => getComputedStyle(document.body).backgroundColor === 'rgba(0, 0, 0, 0)'), 'player background transparent (Browser Source)');

 // 3) المشاهد: بحث ← اختيار ← طلب
 const v = await page('/sr/' + SR, 390, 844);
 await v.fill('#nm', 'نورة'); await v.fill('#q', 'محمد عبده'); await v.waitForTimeout(700);
 const res = await v.$$eval('#res .it', e => e.map(x => x.innerText));
 ok(res.length === 2 && res.every(t => /محمد عبده/.test(t)) && res.some(t => /0:20/.test(t)), 'search by artist → results with title, artist, duration');
 await v.fill('#q', 'Second'); await v.waitForTimeout(600);
 ok((await v.$$('#res .it')).length === 1 && /Test Band/.test(await v.textContent('#res')) && await v.$eval('#res .cv', e => /api\/music\/cover/.test(e.style.backgroundImage)), 'search by song name → cover art from the file');
 await v.fill('#q', 'فوق هام'); await v.waitForTimeout(600);
 await v.click('#res [data-id]'); await v.waitForTimeout(600);
 ok(/✅/.test(await v.textContent('#msg')) && /تعمل الآن|رقم/.test(await v.textContent('#msg')), 'request sent → clear success confirmation: ' + (await v.textContent('#msg')));

 // 4) وصل للوحة فوراً بدون تحديث
 ok(await wait(dash, () => R.C.music && R.C.music.current && R.C.music.current.track.title === 'فوق هام السحب' && R.C.music.current.by.name === 'نورة'), 'arrived in the creator dashboard instantly with the requester name');
 ok(await wait(dash, () => /فوق هام السحب/.test(document.querySelector('.mu-now').innerText) && /نورة/.test(document.querySelector('.mu-now').innerText)), 'dashboard UI updated live (no page refresh)');

 // 5) الصوت يخرج فعلياً من مشغل OBS
 ok(await wait(obs, () => { const A = window.__player.A; return !A.paused && A.currentTime > 0.5 }), 'OBS player is actually playing (currentTime advancing)');
 const rms = await obs.evaluate(async () => { const A = window.__player.A; const st = A.captureStream(); const ac = new AudioContext(); await ac.resume(); const src = ac.createMediaStreamSource(st), an = ac.createAnalyser(); an.fftSize = 2048; src.connect(an); const buf = new Float32Array(an.fftSize); let mx = 0; for (let i = 0; i < 20; i++) { await new Promise(r => setTimeout(r, 50)); an.getFloatTimeDomainData(buf); let s = 0; for (const x of buf) s += x * x; mx = Math.max(mx, Math.sqrt(s / buf.length)) } return mx });
 ok(rms > 0.01, 'real audio signal coming out of the player (RMS ' + rms.toFixed(3) + ')');
 ok(await wait(dash, () => R.C.music.status === 'playing' && /يعمل/.test(document.querySelector('.mu-now .tag').textContent)), 'dashboard shows ▶ Playing (confirmed by the player)');
 ok(await obs.evaluate(() => /فوق هام السحب/.test(document.getElementById('ti').textContent)), 'player shows song title/artist');

 // 6) طلب جديد أثناء التشغيل
 const v2 = await page('/sr/' + SR, 390, 844);
 await v2.fill('#nm', 'سعد'); await v2.fill('#q', 'Second'); await v2.waitForTimeout(600); await v2.click('#res [data-id]'); await v2.waitForTimeout(500);
 ok(/رقم 1/.test(await v2.textContent('#msg')), 'new request during playback → queue #1');
 ok(await wait(dash, () => R.C.music.queue.length === 1 && R.C.music.current.track.title === 'فوق هام السحب'), 'current song keeps playing, new one queued');
 ok(await obs.evaluate(() => !window.__player.A.paused), 'player did not stop for the new request');
 // التكرار
 await v2.click('#res [data-id]').catch(() => {}); await v2.waitForTimeout(400);
 const dupR = await (await fetch(B + '/api/sr/' + SR + '/request', { method: 'POST', headers: { 'content-type': 'application/json', 'x-test-ip': '9.9.9.9' }, body: JSON.stringify({ trackId: 'trk2', name: 'سعد' }) })).json();
 ok(!dupR.ok && /موجودة/.test(dupR.message), 'duplicate request refused with a clear message: ' + dupR.message);
 const bad = await (await fetch(B + '/api/sr/' + SR + '/request', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ trackId: 'nope', name: 'x1' }) })).json();
 ok(!bad.ok && bad.message, 'invalid request → clear failure message, nothing queued');

 // 7) الانتقال التلقائي: نقفز لآخر ثانيتين من الأغنية الحالية ونترك المشغل ينهيها بنفسه
 await obs.evaluate(() => { const A = window.__player.A; A.currentTime = Math.max(0, A.duration - 1.5) });
 ok(await wait(dash, () => R.C.music.current && R.C.music.current.track.title === 'Second Song', null, 12000), 'song ended → next song starts automatically');
 ok(await wait(obs, () => { const A = window.__player.A; return !A.paused && /trk2/.test(A.currentSrc) }), 'player switched to the next file by itself');

 // 8) إيقاف مؤقت / استكمال / إعادة من اللوحة
 await dash.click('[data-mop="pause"]'); ok(await wait(obs, () => window.__player.A.paused), 'pause from dashboard → audio paused in OBS');
 ok(await wait(dash, () => R.C.music.status === 'paused'), 'state Paused');
 await dash.click('[data-mop="resume"]'); ok(await wait(obs, () => !window.__player.A.paused), 'resume → audio continues');
 await obs.waitForTimeout(1200); await dash.click('[data-mop="replay"]'); ok(await wait(obs, () => window.__player.A.currentTime < 1 && !window.__player.A.paused), 'replay → song restarts');

 // 9) مشغل ثانٍ (LIVE Studio) لا يشغّل أغنية ثانية
 const studio = await page('/music-player/' + OVL, 800, 200); await studio.waitForTimeout(1500);
 ok(await studio.evaluate(() => !window.__player.mine && window.__player.A.paused), 'second player (LIVE Studio) stays silent → never two songs at once');

 // 10) الحذف والتخطي والمسح + فشل مصدر التشغيل
 for (const [nm, q] of [['هند', 'الأماكن'], ['مها', 'Broken']]) { const vv = await page('/sr/' + SR, 390, 844); await vv.fill('#nm', nm); await vv.fill('#q', q); await vv.waitForTimeout(600); await vv.click('#res [data-id]'); await vv.waitForTimeout(400); await vv.context().close() }
 ok(await wait(dash, () => R.C.music.queue.length === 2), 'two more requests queued');
 await dash.waitForTimeout(400); const qAm = await dash.evaluate(() => R.C.music.queue.find(q => q.track.title === 'الأماكن').qid);
 await dash.click(`[data-mrm="${qAm}"]`); ok(await wait(dash, () => !R.C.music.queue.some(q => q.track.title === 'الأماكن')), 'delete a song from the queue');
 await dash.click('[data-mop="next"]');
 ok(await wait(dash, () => R.C.music.log.some(l => l.step === 'error' && /Broken/.test(l.title))), 'skip → next song has a missing file → player reports the real error');
 ok(await wait(dash, () => /❌/.test(document.querySelector('.mu-log').innerText) && /فشل التشغيل/.test(document.querySelector('.mu-log').innerText)), 'diagnostics log shows the failure reason');
 const steps = await dash.evaluate(() => [...new Set(R.C.music.log.map(l => l.step))]);
 ok(['received', 'queued', 'loading', 'playing', 'ended', 'skip', 'error'].every(s => steps.includes(s)), 'diagnostics: received → queued → loading → playing → ended / skip / error: ' + steps.join(','));
 ok(await wait(dash, () => !R.C.music.current), 'after the failed song, queue empty → idle (no fake playing)');
 await v.fill('#nm', 'ريم'); await v.fill('#q', 'الأماكن'); await v.waitForTimeout(500); await v.click('#res [data-id]'); await v.waitForTimeout(400);
 ok(await wait(dash, () => R.C.music.current && R.C.music.current.track.title === 'الأماكن'), 'new request when idle → plays immediately: ' + await v.textContent('#msg'));
 await dash.waitForTimeout(300); await dash.click('[data-mop="prev"]',{timeout:5000}).catch(e=>console.log('prev click',e.message.slice(0,80))); ok(await wait(dash, () => R.C.music.current && R.C.music.current.track.title !== 'الأماكن'), 'previous → goes back: '+await dash.evaluate(()=>JSON.stringify({c:R.C.music.current&&R.C.music.current.track.title,p:(R.C.music.prev||[]).map(x=>x.track.title)})));

 // 10.5) الطريقة الأساسية: أمر من شات TikTok (بدون رابط ولا تسجيل) → القائمة → يُشغَّل
 await fetch(B + '/test/chat?' + new URLSearchParams({ id: 'chat_fan', name: 'متابع الشات', text: '!شغل فوق هام' }));
 ok(await wait(dash, () => [R.C.music.current, ...R.C.music.queue].some(q => q && q.track.title === 'فوق هام السحب' && q.by.name === 'متابع الشات' && q.by.platform === 'tiktok')), 'TikTok chat «!شغل فوق هام» → queued with the TikTok account name (no link/registration) '+await dash.evaluate(()=>JSON.stringify([R.C.music.log.slice(0,3),S.botFeed.slice(0,2).map(x=>x.text),S.bots.music.noRepeatMin,S.bots.music.cooldownSec])));
 ok(await wait(dash, () => /شات TikTok/.test(document.querySelector('#pg').innerText)), 'dashboard queue shows the request platform (TikTok chat)');
 // 11) الصوت من اللوحة
 await dash.$eval('[data-mvol]', e => { e.value = '30'; e.dispatchEvent(new Event('change', { bubbles: true })) });
 ok(await wait(obs, () => Math.abs(window.__player.A.volume - 0.3) < 0.01), 'volume from dashboard → applied in the OBS player');
 // 12) إعادة تحميل مصدر OBS
 await obs.reload(); ok(await wait(obs, () => window.__player && window.__player.M && window.__player.M.current), 'OBS source reload → resyncs the queue from the server');
 // 13) صفحة المشاهد تتحدث
 await v.waitForTimeout(5500); ok(/طلب/.test(await v.textContent('#now')), 'viewer page shows what is playing now');
 ok(!errs.length, 'no page errors ' + errs.slice(0, 3).join(' | '));
 await obs.screenshot({ path: '/home/claude/najd/tests/shot-music-player.png', omitBackground: true });
 await dash.screenshot({ path: '/home/claude/najd/tests/shot-music-dash.png' }); await v.screenshot({ path: '/home/claude/najd/tests/shot-music-request.png' });
 await b.close(); try { process.kill(-srv.pid) } catch (e) { srv.kill() }
})();
