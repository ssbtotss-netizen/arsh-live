// طرفي: شات TikTok «!شغل …» ← بحث YouTube (ردود Data API بالشكل الرسمي) ← القائمة ← مشغل OBS (IFrame API) ← الصوت ← التالي تلقائياً
// ملاحظة صادقة: بيئة الاختبار بلا إنترنت، فـ https://www.youtube.com/iframe_api يُستبدل هنا بمشغل بديل يطبق نفس واجهة YT.Player
// (loadVideoById / onStateChange / onError / setVolume …) ويشغّل نغمة لكل فيديو — يختبر منطق مشغلنا بالكامل، لا خوادم YouTube نفسها.
const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const { spawn } = require('child_process');
const PORT = 39900 + Math.floor(Math.random() * 90), B = 'http://127.0.0.1:' + PORT, OVL = 'ovl_TOKEN_abc123';
const FAKE_YT = `(()=>{ const S={UNSTARTED:-1,ENDED:0,PLAYING:1,PAUSED:2,BUFFERING:3,CUED:5};
 function Player(el,o){ const box=typeof el==="string"?document.getElementById(el):el; const f=document.createElement("div"); f.className="fake-yt"; f.style.cssText="width:"+o.width+"px;height:"+o.height+"px;background:#111"; box.replaceWith(f);
  const a=this.audio=new Audio(); window.__ytAudio=a; this.o=o; this.st=-1; this.vid="";
  const ev=(n,d)=>o.events&&o.events[n]&&o.events[n]({target:this,data:d});
  a.addEventListener("playing",()=>{ this.st=1; ev("onStateChange",1) }); a.addEventListener("pause",()=>{ if(this.st!==0){ this.st=2; ev("onStateChange",2) } }); a.addEventListener("ended",()=>{ this.st=0; ev("onStateChange",0) }); a.addEventListener("waiting",()=>{ this.st=3; ev("onStateChange",3) });
  this.loadVideoById=x=>{ const id=typeof x==="string"?x:x.videoId; this.vid=id; window.__ytLoads=(window.__ytLoads||[]).concat(id); if(/^blocked/.test(id)){ setTimeout(()=>ev("onError",150),60); return } a.src="/test/ytaudio/"+id; if(x.startSeconds) a.currentTime=x.startSeconds; a.play().catch(e=>{ if(e.name==="NotAllowedError") ev("onAutoplayBlocked") }) };
  this.playVideo=()=>{ a.play().catch(()=>{}) }; this.pauseVideo=()=>a.pause(); this.stopVideo=()=>{ a.pause() }; this.seekTo=s=>{ a.currentTime=s }; this.setVolume=v=>{ a.volume=v/100 }; this.getCurrentTime=()=>a.currentTime; this.getPlayerState=()=>this.st; this.getVideoData=()=>({video_id:this.vid});
  setTimeout(()=>{ ev("onReady"); if(o.videoId) this.loadVideoById({videoId:o.videoId,startSeconds:o.playerVars&&o.playerVars.start}) },50) }
 window.YT={Player,PlayerState:S}; setTimeout(()=>window.onYouTubeIframeAPIReady&&window.onYouTubeIframeAPIReady(),20) })();`;
(async () => {
 const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) process.exitCode = 1 };
 const srv = spawn('npx', ['tsx', '../tests/music-e2e-server.mts'], { cwd: '/home/claude/najd/arsh-live', detached: true, env: { ...process.env, PORT: String(PORT), YT: '1' } });
 let slog = ''; srv.stdout.on('data', d => slog += d); srv.stderr.on('data', d => slog += d);
 for (let i = 0; i < 80 && !/READY/.test(slog); i++) await new Promise(r => setTimeout(r, 250));
 if (!/READY/.test(slog)) { console.log('FAIL server ' + slog); try { process.kill(-srv.pid) } catch (e) { srv.kill() } process.exit(1) }
 const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
 const errs = [], ytReq = [];
 const page = async (url, w, h, fake) => { const ctx = await b.newContext({ viewport: { width: w, height: h } }); if (fake) await ctx.route('https://www.youtube.com/iframe_api', r => { ytReq.push(r.request().url()); r.fulfill({ contentType: 'text/javascript', body: FAKE_YT }) }); const p = await ctx.newPage(); p.on('pageerror', e => errs.push(url + ': ' + e.message)); await p.goto(B + url); return p };
 const wait = (p, fn, arg, ms = 10000) => p.waitForFunction(fn, arg, { timeout: ms }).then(() => true, () => false);
 const chat = (id, name, text, x = {}) => fetch(B + '/test/chat?' + new URLSearchParams({ id, name, text, ...x }));
 const rms = p => p.evaluate(async () => { const A = window.__ytAudio; const st = A.captureStream(); const ac = new AudioContext(); await ac.resume(); const an = ac.createAnalyser(); ac.createMediaStreamSource(st).connect(an); const buf = new Float32Array(2048); let mx = 0; for (let i = 0; i < 20; i++) { await new Promise(r => setTimeout(r, 50)); an.getFloatTimeDomainData(buf); let s = 0; for (const x of buf) s += x * x; mx = Math.max(mx, Math.sqrt(s / buf.length)) } return mx });

 const dash = await page('/dash', 1440, 1000); await dash.waitForTimeout(1500); await dash.evaluate(() => { S.page = 'music'; renderPage() });
 ok(await wait(dash, () => wsReady === true && S.bots.music.source === 'youtube'), 'dashboard connected; song source = YouTube');
 const obs = await page('/music-player/' + OVL, 900, 260, true);
 ok(await wait(obs, () => window.__player && window.__player.mine), 'OBS player (Browser Source) connected and owns playback');

 // 1) شات TikTok: !شغل الأماكن
 await chat('fan_1', 'نورة', '!شغل الأماكن');
 ok(await wait(dash, () => R.C.music.current && R.C.music.current.track.src === 'yt'), 'TikTok chat «!شغل الأماكن» → searched on YouTube → added (no clicks)');
 const cur = await dash.evaluate(() => R.C.music.current);
 ok(cur.track.vid === 'yt_amakenA1' && cur.track.title === 'الأماكن' && cur.track.artist === 'محمد عبده' && cur.by.name === 'نورة' && cur.by.platform === 'tiktok', 'found: title «الأماكن», artist «محمد عبده», requester @نورة from TikTok');
 ok(await wait(dash, () => S.botFeed.some(x => /🎵 تمت إضافة «الأماكن» — محمد عبده وتعمل الآن بواسطة @نورة/.test(x.text))), 'bot confirmation message with song name and @requester');
 ok(ytReq.length === 1, 'player loaded the official YouTube IFrame API URL (https://www.youtube.com/iframe_api)');
 ok(await wait(obs, () => window.__ytLoads && window.__ytLoads[0] === 'yt_amakenA1' && !window.__ytAudio.paused && window.__ytAudio.currentTime > 0.5), 'OBS player started the YouTube video automatically (no play button)');
 const r1 = await rms(obs); ok(r1 > 0.01, 'audio signal coming out of the player page (what OBS captures) — RMS ' + r1.toFixed(3));
 ok(await wait(dash, () => R.C.music.status === 'playing'), 'dashboard: ▶ Playing (confirmed by the player)');
 const box = await obs.evaluate(() => { const r = document.getElementById('ytb').getBoundingClientRect(); return { w: r.width, h: r.height, vis: getComputedStyle(document.getElementById('ytb')).display } });
 ok(box.vis === 'block' && box.w >= 200 && box.h >= 200, 'YouTube player visible in the stream at ≥200×200 (YouTube terms): ' + box.w + '×' + box.h);
 ok(await obs.evaluate(() => /الأماكن/.test(document.getElementById('ti').textContent) && /نورة/.test(document.getElementById('ar').textContent) && /YouTube/.test(document.getElementById('src').textContent)), 'player card: song, artist, requester, source');

 // 2) أغنية ثانية أثناء التشغيل — أول نسخة ممنوعة من التضمين
 await chat('fan_2', 'سعد', '!شغل levitating');
 ok(await wait(dash, () => R.C.music.queue.length === 1 && R.C.music.queue[0].track.vid === 'blockedVid1' && R.C.music.current.track.vid === 'yt_amakenA1'), 'second request queued while the first keeps playing');
 // 3) الانتقال التلقائي: نقرب نهاية الأولى
 await obs.evaluate(() => { window.__ytAudio.playbackRate = 16 }); /* تسريع نهاية الأغنية الأولى */
 ok(await wait(dash, () => R.C.music.log.some(l => l.step === 'alt')), 'next song: owner blocked embedding (error 150) → automatically tries the alternative version '+await dash.evaluate(()=>JSON.stringify(R.C.music.log.slice(0,6).map(l=>l.step+':'+(l.title||'')+':'+(l.why||'')))));
 ok(await wait(dash, () => R.C.music.current && R.C.music.current.track.vid === 'yt_levitat2' && R.C.music.current.by.name === 'سعد' && R.C.music.status === 'playing'), 'second song plays automatically after the first, without touching anything');
 ok(await wait(obs, () => /yt_levitat2/.test(window.__ytAudio.currentSrc) && !window.__ytAudio.paused), 'player switched videos by itself');
 const r2 = await rms(obs); ok(r2 > 0.01, 'second song audio — RMS ' + r2.toFixed(3));

 // 4) أوامر التحكم من الشات
 await chat('viewer_x', 'زائر', '!سكب'); await obs.waitForTimeout(400);
 ok(await dash.evaluate(() => R.C.music.current.track.vid === 'yt_levitat2'), 'viewer «!سكب» refused (mods only by default)');
 await chat('host_account', 'صاحب البث', '!وقف'); ok(await wait(obs, () => window.__ytAudio.paused), 'broadcaster «!وقف» → YouTube audio paused');
 await chat('host_account', 'صاحب البث', '!كمل'); ok(await wait(obs, () => !window.__ytAudio.paused), '«!كمل» → resumes');
 await chat('fan_3', 'هند', '!شغل blinding lights'); await obs.waitForTimeout(400);
 await chat('a_mod', 'مشرف', '!سكب', { mod: '1' });
 ok(await wait(dash, () => R.C.music.current && R.C.music.current.track.vid === 'yt_blinding'), 'moderator «!سكب» → skips to the next requested song');
 await chat('ls', 'مستعرض', '!قائمة'); ok(await wait(dash, () => S.botFeed.some(x => /^📋|القائمة فاضية/.test(x.text))), '«!قائمة» answers with the waiting list');
 await chat('fan_9', 'ريم', '!شغل اغنية غير موجودة ابدا'); ok(await wait(dash, () => S.botFeed.some(x => /@ريم ما لقيت الأغنية في YouTube/.test(x.text))), 'not found on YouTube → clear reply, nothing queued');
 await dash.$eval('[data-mvol]', e => { e.value = '35'; e.dispatchEvent(new Event('change', { bubbles: true })) });
 ok(await wait(obs, () => Math.abs(window.__ytAudio.volume - 0.35) < 0.01), 'volume from dashboard → YouTube player volume');
 ok(await wait(dash, () => /▶ YouTube/.test(document.querySelector('.mu-now').innerText) && /بحث YouTube مفعّل/.test(document.querySelector('#pg').innerText)), 'dashboard shows YouTube source + search status');
 ok(['searching', 'found', 'queued', 'loading', 'playing', 'alt'].every(s => true) && await dash.evaluate(() => ['searching', 'found', 'queued', 'loading', 'playing', 'alt', 'ended'].every(s => R.C.music.log.some(l => l.step === s))), 'diagnostics: searching → found → queued → loading → playing → (alt) → ended');
 ok(!errs.length, 'no page errors ' + errs.slice(0, 3).join(' | '));
 await obs.screenshot({ path: '/home/claude/najd/tests/shot-music-yt-player.png' });
 await b.close(); try { process.kill(-srv.pid) } catch (e) { srv.kill() }
})();
