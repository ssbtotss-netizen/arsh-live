// مكتبة الأصوات عبر خادم حقيقي (WebSocket + المركز + اتصال TikTok تجريبي معزول): اللوحة تحفظ ← الخادم يقرر ← رابط OBS يشغّل
const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const { spawn } = require('child_process');
const PORT = 39600 + Math.floor(Math.random() * 90), B = 'http://127.0.0.1:' + PORT;
let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : fail++; console.log((c ? 'PASS ' : 'FAIL ') + m) };
(async () => {
  const srv = spawn('npx', ['tsx', '/home/claude/najd/tests/explore-e2e-server.mts'], { cwd: '/home/claude/najd/arsh-live', detached: true, env: { ...process.env, PORT: String(PORT) } });
  let slog = ''; srv.stdout.on('data', d => slog += d); srv.stderr.on('data', d => slog += d);
  for (let i = 0; i < 80 && !/READY/.test(slog); i++) await new Promise(r => setTimeout(r, 250));
  const stop = () => { try { process.kill(-srv.pid) } catch (e) { srv.kill() } };
  try {
    const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--autoplay-policy=no-user-gesture-required'] }); const errs = [];
    const ctx = await b.newContext({ viewport: { width: 1300, height: 900 } }); const dash = await ctx.newPage(); dash.on('pageerror', e => errs.push('dash:' + e.message));
    await dash.goto(B + '/dash'); await dash.evaluate(() => localStorage.clear()); await dash.reload(); await dash.waitForTimeout(600);
    await dash.evaluate(() => { const A = window.__arsh; const T = window.B6O6_TEST_WS; S.settings.wsUrl = T.ws; S.settings.room = T.room; S.settings.key = T.key; startWS() });
    await dash.waitForFunction(() => wsReady === true);
    // الإعداد من الواجهة نفسها: فولو + مستويات الدونيشن + مراحل التكبيس + مشغل الأصوات
    await dash.evaluate(() => { S.page = "sounds"; renderPage() }); await dash.waitForTimeout(800);
    await dash.evaluate(() => { const c = SC(); c.rules.push(sndRule({ ev: "follow", sounds: [{ src: "lib:follow-01" }, { src: "lib:follow-02" }], mode: "norepeat", cool: 0 })); sndPreset("don"); sndPreset("taps"); sndEnsurePlayer(); sndSave(); });
    await dash.evaluate(() => ws.send(JSON.stringify({ t: "tiktok", room: S.settings.room, username: "e2e_streamer" }))); await dash.waitForTimeout(700);
    const pid = await dash.evaluate(() => L().widgets.find(w => w.type === 'sndplayer').id);
    const url = await dash.evaluate(id => { const l = window.__arsh.L(); const q = new URLSearchParams(); q.set("d", b64e({ ...l, widgets: l.widgets.filter(w => w.id === id), bots: { sounds: { on: true, vol: 80 } } })); q.set("ws", S.settings.wsUrl); q.set("room", S.settings.room); return location.origin + location.pathname + "#/overlay?" + q }, pid);
    const octx = await b.newContext(); const ov = await octx.newPage(); ov.on('pageerror', e => errs.push('ov:' + e.message));
    await ov.addInitScript(() => { window.__plays = []; const P = HTMLMediaElement.prototype.play; HTMLMediaElement.prototype.play = function () { window.__plays.push(this.src.split('/').pop()); return P.call(this) }; });
    await ov.goto(url); await ov.waitForTimeout(1500);
    const plays = () => ov.evaluate(() => window.__plays.slice());
    // 1) فولو حقيقي عبر TikTok التجريبي (معدل منخفض)
    await fetch(B + '/test/flood?rate=4&sec=2'); await ov.waitForTimeout(5000);
    const st1 = await (await fetch(B + '/test/state')).json(); const p1 = await plays();
    ok(st1.sent.follow > 0 && p1.filter(x => /^follow-0[12]\.mp3$/.test(x)).length >= 1, `real follow via server → follow sound in OBS (${st1.sent.follow} follows, ${p1.length} sounds)`);
    ok(!p1.some((x, i) => i && x === p1[i - 1] && /^follow/.test(x)), 'no-repeat mode respected');
    // 2) ضغط الإكسبلور: مئات المتابعات ← أصوات قليلة، الأحداث كلها محتسبة
    const before = p1.length; await fetch(B + '/test/flood?rate=400&sec=6'); await ov.waitForTimeout(9000);
    const st2 = await (await fetch(B + '/test/state')).json(), p2 = await plays(), added = p2.length - before;
    console.log(`  flood: ${st2.sent.follow} follows sent, server processed ${st2.P.done} events (failed ${st2.P.failed}), explore=${st2.P.explore}, sounds played during flood: ${added}`);
    ok(st2.P.done === Object.values(st2.sent).reduce((a, b) => a + b, 0) && st2.tot.follows === st2.sent.follow, `every follow counted during the flood (${st2.tot.follows}/${st2.sent.follow})`);
    ok(added < 25, `Audio queue: ${st2.sent.follow - st1.sent.follow} follows in 6 s → only ${added} sounds (merged, no sound flood)`);
    ok(p2.some(x => /^taps-/.test(x)), 'tap-stage sounds from the real stream totals (' + p2.filter(x => /^taps-/.test(x)).join(',') + ')');
    // 3) لوحة التشغيل: تشغيل يدوي عبر الخادم
    await dash.evaluate(() => sndNow({ src: "lib:applause", vol: 100 })); await ov.waitForTimeout(2500);
    ok((await plays()).includes('applause.mp3'), 'soundboard “play now” goes through the server to OBS');
    ok(!errs.length, 'no page errors ' + errs.slice(0, 3).join(' | '));
    await b.close();
  } catch (e) { fail++; console.log('FAIL exception ' + e.message + '\n' + slog.slice(-600)) }
  stop(); console.log(`sounds-e2e: ${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
})();
