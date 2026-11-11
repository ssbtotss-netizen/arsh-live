const { chromium } = require('/opt/npm-tools/node_modules/playwright');
(async () => {
  const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) process.exitCode = 1; };
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const dash = await (await b.newContext()).newPage();
  const errs = []; dash.on('pageerror', e => errs.push(e.message));
  await dash.goto('http://localhost:4555/');
  await dash.click('.nav [data-go="settings"]');
  await dash.fill('[data-set="wsUrl"]', 'ws://localhost:4555/ws');
  await dash.click('[data-connect]'); await dash.waitForTimeout(500);
  ok((await dash.textContent('#ctext2')).includes('متصل'), 'dashboard connected to hub');
  await dash.click('.nav [data-go="obs"]');
  const href = await dash.locator('a[href*="#/overlay"]').first().getAttribute('href');
  ok(href.includes('ws='), 'overlay link carries server address');
  // OBS = separate browser context (no shared storage / BroadcastChannel)
  const obs = await (await b.newContext({ viewport: { width: 540, height: 960 } })).newPage();
  obs.on('pageerror', e => errs.push('obs ' + e.message));
  await obs.goto(href); await obs.waitForTimeout(500);
  const read = () => obs.evaluate(() => [...document.querySelectorAll('.wd')].map(e => [...e.querySelectorAll('.r:not(.emp) .vl b')].map(x => x.textContent).join()));
  const r0 = await read();
  await dash.click('.nav [data-go="studio"]');
  await dash.click('#testbar [data-sim="like1000"]'); await obs.waitForTimeout(400);
  const r1 = await read();
  ok(r1[0] !== r0[0] && r1[1] === r0[1], 'OBS (separate browser) got likes only via server');
  await dash.click('#testbar [data-sim="gift"]'); await obs.waitForTimeout(400);
  const r2 = await read();
  ok(r2[1] !== r1[1] && r2[0] === r1[0], 'OBS got gift only in gifts list');
  // move a widget in editor → OBS layout updates live
  await dash.click('#stage .wd.t-gifts'); await dash.click('.posgrid [data-pos="bl"]'); await obs.waitForTimeout(400);
  const top = await obs.evaluate(() => parseFloat(document.querySelector('.wd.t-gifts').style.top));
  ok(top > 1200, 'layout change pushed live to OBS (top=' + top + ')');
  // late joiner receives snapshot
  const late = await (await b.newContext({ viewport: { width: 540, height: 960 } })).newPage();
  await late.goto(href); await late.waitForTimeout(500);
  const rl = await late.evaluate(() => [...document.querySelectorAll('.wd.t-likes .r:not(.emp) .vl b')].map(x => x.textContent).join());
  ok(rl === r2[0], 'late OBS source starts with same ranking (snapshot)');
  ok(errs.length === 0, 'no errors ' + errs.join('|'));
  await b.close();
})();
