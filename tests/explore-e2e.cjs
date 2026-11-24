// اختبار طرفي للإكسبلور: خادم حقيقي (WebSocket) + لوحة التحكم + طبقة OBS بعدة عناصر، تدفق أحداث بمعدل عالٍ
// يقيس: هل تتجمد اللوحة/الطبقة؟ هل تتطابق الأرقام مع الخادم؟ هل يتفعل وضع الإكسبلور ويعود؟
const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const { spawn } = require('child_process');
const RATE = +(process.argv[2] || 400), SEC = +(process.argv[3] || 10);
const PORT = 39700 + Math.floor(Math.random() * 90), B = 'http://127.0.0.1:' + PORT;
let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : fail++; console.log((c ? 'PASS ' : 'FAIL ') + m) };
(async () => {
  const srv = spawn('npx', ['tsx', '/home/claude/najd/tests/explore-e2e-server.mts'], { cwd: '/home/claude/najd/arsh-live', detached: true, env: { ...process.env, PORT: String(PORT) } });
  let slog = ''; srv.stdout.on('data', d => slog += d); srv.stderr.on('data', d => slog += d);
  for (let i = 0; i < 80 && !/READY/.test(slog); i++) await new Promise(r => setTimeout(r, 250));
  const stop = () => { try { process.kill(-srv.pid) } catch (e) { srv.kill() } };
  try {
    const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }); const errs = [];
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const dash = await ctx.newPage(); dash.on('pageerror', e => errs.push('dash:' + e.message));
    await dash.goto(B + '/dash'); await dash.evaluate(() => localStorage.clear()); await dash.reload(); await dash.waitForTimeout(800);
    const types = ["likes", "recentFollows", "recentGifts", "uchat", "subathon", "fcount", "levent", "falert", "goal", "lb", "interact"];
    await dash.evaluate(ts => { const A = window.__arsh; for (const t of ts) try { A.addWidget(t, {}) } catch (e) {} A.save(); const T = window.B6O6_TEST_WS; S.settings.wsUrl = T.ws; S.settings.room = T.room; S.settings.key = T.key; startWS() }, types);
    ok(await dash.waitForFunction(() => wsReady === true, null, { timeout: 8000 }).then(() => true, () => false), 'dashboard connected to the real server over WebSocket');
    await dash.evaluate(() => { S.settings.tiktok = "e2e_streamer"; ws.send(JSON.stringify({ t: "tiktok", room: S.settings.room, username: "e2e_streamer" })) }); await dash.waitForTimeout(600);
    const ovURL = await dash.evaluate(() => { const l = window.__arsh.L(); const p = new URLSearchParams(); p.set("d", b64e({ ...l, socials: S.socials, donCfg: S.donCfg })); p.set("ws", S.settings.wsUrl); p.set("room", S.settings.room); return location.origin + location.pathname + "#/overlay?" + p });
    const octx = await b.newContext({ viewport: { width: 1080, height: 1920 } }); const ov = await octx.newPage(); ov.on('pageerror', e => errs.push('ov:' + e.message)); await ov.goto(ovURL); await ov.waitForTimeout(1500);
    const LT = `window.__lt={n:0,ms:0,max:0}; new PerformanceObserver(l=>{for(const e of l.getEntries()){__lt.n++;__lt.ms+=e.duration;__lt.max=Math.max(__lt.max,e.duration)}}).observe({entryTypes:["longtask"]}); window.__gap=0; (()=>{ let t=performance.now(); setInterval(()=>{ const n=performance.now(); __gap=Math.max(__gap,n-t-100); t=n },100) })();`;
    await dash.evaluate(LT); await ov.evaluate(LT);
    let cdp=null; if(process.env.PROF){ cdp=await octx.newCDPSession(ov); await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval',{interval:300}); await cdp.send('Profiler.start') }
    await fetch(B + `/test/flood?rate=${RATE}&sec=${SEC}`);
    let exploreSeen = false, ovExplore = false; for (let i = 0; i < SEC * 2 + 6; i++) { await ov.waitForTimeout(500); const st = await (await fetch(B + '/test/state')).json(); if (st.P?.explore) exploreSeen = true; if (await ov.evaluate(() => document.body.classList.contains('ov-explore'))) ovExplore = true; }
    if(cdp){ const {profile}=await cdp.send('Profiler.stop'); require('fs').writeFileSync('/tmp/st/e2e.cpuprofile',JSON.stringify(profile)) }
    const st = await (await fetch(B + '/test/state')).json();
    const sentAll = Object.values(st.sent).reduce((a, b) => a + b, 0);
    console.log(`  sent ${sentAll} events in ${SEC}s (~${(sentAll / SEC) | 0}/s) → server processed ${st.P.done}, dup ${st.P.dup}, failed ${st.P.failed}, max pending ${st.P.maxPending}, max lag ${st.P.lagMax}ms, ${st.P.sent} msgs in ${st.P.batches} batches`);
    ok(st.P.done === sentAll && st.P.failed === 0, `server processed every event (${st.P.done}/${sentAll})`);
    ok(st.tot.likes === st.sent.like * 15 && st.tot.follows === st.sent.follow && st.tot.comments === st.sent.chat && st.coins === st.sent.gift, `server totals exact (likes ${st.tot.likes}, follows ${st.tot.follows}, comments ${st.tot.comments}, coins ${st.coins})`);
    await dash.waitForTimeout(1500);
    const dT = await dash.evaluate(() => window.__arsh.R().D.tot), oT = await ov.evaluate(() => window.__ov && window.__ov.R().D.tot);
    ok(dT.likes === st.tot.likes && dT.follows === st.tot.follows && dT.comments === st.tot.comments, `dashboard totals = server (likes ${dT.likes}, follows ${dT.follows}, comments ${dT.comments})`);
    ok(oT && oT.likes === st.tot.likes && oT.follows === st.tot.follows, `OBS layer totals = server (likes ${oT && oT.likes}, follows ${oT && oT.follows})`);
    ok(exploreSeen && ovExplore, `Explore Mode switched on automatically on the server (${exploreSeen}) and reached OBS (${ovExplore})`);
    const dm = await dash.evaluate(() => ({ lt: __lt, gap: __gap | 0 })), om = await ov.evaluate(() => ({ lt: __lt, gap: __gap | 0, dom: document.getElementsByTagName('*').length, chat: document.querySelectorAll('.uc-m').length }));
    console.log(`  dashboard: longest freeze ${dm.gap}ms, long tasks ${dm.lt.n} (${dm.lt.ms | 0}ms total, max ${dm.lt.max | 0}ms)`);
    console.log(`  OBS layer: longest freeze ${om.gap}ms, long tasks ${om.lt.n} (${om.lt.ms | 0}ms total, max ${om.lt.max | 0}ms), DOM ${om.dom}, chat rows ${om.chat}`);
    ok(om.gap < 1000 && dm.gap < 1500, `no freeze: OBS longest pause ${om.gap}ms, dashboard ${dm.gap}ms`);
    ok(om.chat > 0 && om.chat <= 30, `chat keeps a bounded number of rows (${om.chat})`);
    // صفحة مراقبة الأداء بأرقام حقيقية
    await dash.evaluate(() => { S.page = "perf"; renderPage() }); await dash.waitForTimeout(2600);
    const pmTxt = await dash.evaluate(() => document.getElementById('pm-body')?.innerText || '');
    ok(/أحداث\/ثانية/.test(pmTxt) && /المستقبلة/.test(pmTxt) && new RegExp(String(st.P.recv).replace(/\B(?=(\d{3})+(?!\d))/g, ",")).test(pmTxt), 'Live Performance Monitor shows the real server numbers');
    ok(!errs.length, 'no page errors: ' + errs.slice(0, 3).join(' | '));
    await b.close();
  } catch (e) { fail++; console.log('FAIL exception ' + e.message + '\n' + slog.slice(-800)) }
  stop(); console.log(`explore-e2e: ${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
})();
