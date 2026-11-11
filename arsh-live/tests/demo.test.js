const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const path = require('path');
const url = 'file://' + path.resolve(__dirname, '../demo/index.html');
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(url);
  const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) process.exitCode = 1; };

  // visit every page
  for (const p of ['home','live','boards','likes','gifts','comments','library','subathon','timers','donations','socials','stats','studio','obs','settings','account']) {
    await page.click(`.nav [data-go="${p}"]`);
    await page.waitForTimeout(150);
    await page.screenshot({ path: path.resolve(__dirname, `shot-${p}.png`) });
  }
  ok(errors.length === 0, 'no JS errors while visiting all 16 pages ' + errors.join(' | '));

  await page.click('.nav [data-go="studio"]');
  await page.waitForTimeout(200);
  const pos = () => page.evaluate(() => window.__arsh.L().widgets.map(w => ({ t: w.type, x: w.x, y: w.y, w: w.w, h: w.h, d: w.design })));
  const before = await pos();
  ok(before[0].x > 0.5 && before[1].x < 0.1, 'likes on right, gifts on left at the same time');

  // drag likes widget
  const likesEl = page.locator('#stage .wd.t-likes').first();
  const box = await likesEl.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 - 60, box.y + box.height / 2 + 80, { steps: 6 });
  await page.mouse.up();
  await page.waitForTimeout(400);
  const after = await pos();
  ok(after[0].x !== before[0].x && after[0].y !== before[0].y, 'likes moved by drag');
  ok(JSON.stringify(after.slice(1)) === JSON.stringify(before.slice(1)), 'other widgets untouched after drag');

  // preset + resize via props
  await page.click('.posgrid [data-pos="tr"]');
  const a2 = await pos();
  ok(a2[0].y < 0.05 && a2[0].x > 0.55, 'preset top-right applied to likes only');
  ok(JSON.stringify(a2.slice(1)) === JSON.stringify(before.slice(1)), 'others still untouched after preset');
  await page.selectOption('#props select[data-wf="design"]', 'fire');
  const a3 = await pos();
  ok(a3[0].d === 'fire' && a3[1].d === before[1].d, 'design change isolated');

  // events isolation
  const counts = () => page.evaluate(() => [...document.querySelectorAll('#stage .wd')].map(e => ({ t: [...e.classList].find(c => c.startsWith('t-')), rows: [...e.querySelectorAll('.r:not(.emp)')].map(r => r.querySelector('.nm').textContent + ':' + r.querySelector('.vl b').textContent).join(',') })));
  const c0 = await counts();
  await page.click('#testbar [data-sim="like1000"]');
  await page.waitForTimeout(200);
  const c1 = await counts();
  ok(c1[0].rows !== c0[0].rows && c1[1].rows === c0[1].rows, 'likes event changed only likes list');
  await page.click('#testbar [data-sim="gift"]');
  await page.waitForTimeout(200);
  const c2 = await counts();
  ok(c2[1].rows !== c1[1].rows && c2[0].rows === c1[0].rows, 'gift event changed only gifts list');
  for (let i = 0; i < 6; i++) { await page.click('#testbar [data-sim="like100"]'); await page.click('#testbar [data-sim="supporter"]'); }
  await page.click('#testbar [data-sim="biggift"]');
  await page.waitForTimeout(300);
  ok(await page.locator('#stage .t-gifts .burst').count() > 0, 'big gift effect shown on gifts list');
  ok(await page.locator('#stage .t-likes .burst').count() === 0, 'no big-gift effect on likes list');
  const d = await page.evaluate(() => window.__arsh.R().D.tot);
  ok(d.likes >= 1600 && d.gifts > 0, 'likes and gift points kept separately ' + JSON.stringify(d));
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.resolve(__dirname, 'shot-studio-live.png') });

  // overlay link + live sync in same browser
  await page.click('.nav [data-go="obs"]');
  const href = await page.locator('a[href*="#/overlay"]').first().getAttribute('href');
  const ov = await ctx.newPage();
  ov.on('pageerror', e => errors.push('overlay: ' + e.message));
  await ov.setViewportSize({ width: 540, height: 960 });
  await ov.goto(href);
  await ov.waitForTimeout(500);
  ok(await ov.locator('.wd').count() === 4, 'combined overlay renders all 4 widgets');
  const bg = await ov.evaluate(() => getComputedStyle(document.body).backgroundColor);
  ok(bg === 'rgba(0, 0, 0, 0)', 'overlay background transparent');
  const ovPos = await ov.evaluate(() => [...document.querySelectorAll('.wd')].map(e => e.style.left));
  const exp = await page.evaluate(() => window.__arsh.L().widgets.map(w => w.x * 1080 + 'px'));
  ok(ovPos.every((p,i)=>Math.abs(parseFloat(p)-parseFloat(exp[i]))<0.01), 'overlay positions match editor '+ovPos+' vs '+exp);
  const ovLikesBefore = await ov.locator('.t-likes .vl b').first().textContent();
  await page.click('.nav [data-go="studio"]');
  await page.click('#testbar [data-sim="like1000"]');
  await ov.waitForTimeout(400);
  const ovLikesAfter = await ov.evaluate(() => [...document.querySelectorAll('.t-likes .vl b')].map(b => b.textContent).join());
  ok(ovLikesAfter !== ovLikesBefore, 'overlay updates live from test mode');
  await ov.screenshot({ path: path.resolve(__dirname, 'shot-overlay.png'), omitBackground: true });

  // single-widget link
  await page.click('.nav [data-go="obs"]');
  const single = await page.locator('a[href*="only="]').nth(1).getAttribute('href');
  const ov2 = await ctx.newPage();
  await ov2.setViewportSize({ width: 400, height: 615 });
  await ov2.goto(single); await ov2.waitForTimeout(400);
  ok(await ov2.locator('.wd').count() === 1 && await ov2.locator('.wd.t-gifts').count() === 1, 'single link shows only gifts list');
  await ov2.screenshot({ path: path.resolve(__dirname, 'shot-single.png'), omitBackground: true });

  await page.click('[data-preview=""]'); await page.waitForTimeout(300);
  ok(await page.locator('.modal .wd').count() === 4, 'in-page combined preview');
  const pv0 = await page.locator('.modal .t-gifts .vl b').first().textContent();
  await page.click('.modal [data-sim="biggift"]'); await page.waitForTimeout(300);
  ok(await page.locator('.modal .t-gifts .burst').count() === 1, 'preview reacts to test gift');
  await page.screenshot({ path: path.resolve(__dirname, 'shot-preview.png') });
  await page.click('.modal [data-no]');
  await page.click('.nav [data-go="studio"]');
  await page.click('[data-lay="new"]'); await page.fill('#askv', 'تخطيط اختبار'); await page.click('.modal [data-ok]'); await page.waitForTimeout(200);
  ok(await page.evaluate(() => window.__arsh.L().name) === 'تخطيط اختبار', 'new layout via in-page dialog');
  await page.click('[data-lay="del"]'); await page.click('.modal [data-ok]'); await page.waitForTimeout(200);
  // persistence + layouts
  await page.reload(); await page.waitForTimeout(300);
  await page.click('.nav [data-go="studio"]'); await page.waitForTimeout(200);
  const a4 = await pos();
  ok(a4[0].d === 'fire' && Math.abs(a4[0].y - a2[0].y) < 1e-9, 'settings saved after reload');
  await page.selectOption('.st-bar select[data-act="pickLayout"]', { index: 1 });
  await page.waitForTimeout(200);
  ok(await page.locator('#stage .wd').count() === 4, 'switch to second layout');
  for (const c of ['horizontal', 'square']) { await page.click(`[data-canvas="${c}"]`); await page.waitForTimeout(200); await page.screenshot({ path: path.resolve(__dirname, `shot-canvas-${c}.png`) }); }
  await page.click('.nav [data-go="library"]'); await page.waitForTimeout(300);
  ok(await page.locator('.libc').count() === 11, '11 list designs in library');
  await page.screenshot({ path: path.resolve(__dirname, 'shot-library.png'), fullPage: true });

  // mobile
  const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto(url); await m.waitForTimeout(200);
  await m.click('.mobnav [data-go="studio"]'); await m.waitForTimeout(200);
  await m.screenshot({ path: path.resolve(__dirname, 'shot-mobile.png') });
  ok(errors.length === 0, 'no JS errors overall ' + errors.join(' | '));
  await browser.close();
})();
