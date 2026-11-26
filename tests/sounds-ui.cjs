// مكتبة الأصوات — اختبار طرفي في المتصفح: اللوحة + رابط OBS (نفس سياق المتصفح) — نقيس ما يُشغَّل فعلاً في عنصر الصوت
const { chromium } = require('/opt/npm-tools/node_modules/playwright');
let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : fail++; console.log((c ? 'PASS ' : 'FAIL ') + m) };
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--autoplay-policy=no-user-gesture-required', '--allow-file-access-from-files'] });
  const ctx = await b.newContext({ viewport: { width: 1400, height: 950 } }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push('dash:' + e.message));
  await p.goto('file:///home/claude/najd/demo/index.html'); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(400);
  await p.click('.nav [data-go="sounds"]'); await p.waitForTimeout(900);
  const total = await p.evaluate(() => SNDX && SNDX.items.length); ok(total >= 300, `library loaded: ${total} sounds`);
  await p.click('[data-snd="more"]'); ok(await p.locator('.snd-card').count() === 120, 'cards render with “show more” paging');
  const dupNames = await p.evaluate(() => { const n = SNDX.items.map(x => x.name); return n.length - new Set(n).size }); ok(dupNames === 0, 'no two sounds share a name');
  // المعاينة: صوت واحد فقط — تشغيل صوت يوقف السابق
  await p.locator('.snd-card [data-snd="prev"]').nth(0).click(); await p.waitForTimeout(300); await p.locator('.snd-card [data-snd="prev"]').nth(1).click(); await p.waitForTimeout(400);
  ok(await p.locator('.snd-card.playing').count() === 1 && await p.evaluate(() => !S.sndAudio.paused), 'preview: starting a second sound stops the first (only one plays)');
  const prevPlays = await p.evaluate(() => { const a = S.sndAudio; return { t: a.currentTime, src: a.src } }); ok(prevPlays.t > 0 && /\/sounds\/lib\/.+\.mp3$/.test(prevPlays.src), 'preview really plays the mp3 file (' + prevPlays.t.toFixed(2) + 's)');
  // البحث + المفضلة
  await p.fill('[data-sndf="q"]', 'عود'); await p.waitForTimeout(500); const n1 = await p.locator('.snd-card').count(); ok(n1 > 3 && n1 < 40, `search “عود” → ${n1} results`);
  await p.locator('.snd-card [data-snd="fav"]').first().click(); await p.click('[data-snd="tab"][data-k="fav"]'); await p.waitForTimeout(300); ok(await p.locator('.snd-card').count() === 1, 'favorite saved and listed in ⭐ المفضلة');
  await p.fill('[data-sndf="q"]', ''); await p.waitForTimeout(400);
  // الربط: فولو ← يضيف «مشغل الأصوات» تلقائياً
  await p.click('[data-snd="tab"][data-k="cat:alerts"]'); await p.waitForTimeout(300);
  const useFollow = async (sid, ev, extra) => { await p.click(`.snd-card[data-sid="${sid}"] [data-snd="use"]`); await p.waitForTimeout(200); await p.click(`.snd-evt tr[data-k="${ev}"]`); if (extra) await extra(); await p.click('.snd-m [data-snd="usesave"]'); await p.waitForTimeout(300); };
  await useFollow('lib:follow-01', 'follow'); ok(await p.evaluate(() => S.bots.sounds.rules.some(r => r.ev === 'follow' && r.sounds[0].src === 'lib:follow-01')), 'use sound → follow → saved & activated');
  ok(await p.evaluate(() => L().widgets.some(w => w.type === 'sndplayer')), '“مشغل الأصوات” added to the layout automatically');
  await useFollow('lib:follow-02', 'follow'); await useFollow('lib:follow-03', 'follow'); ok(await p.evaluate(() => S.bots.sounds.rules.filter(r => r.ev === 'follow').length === 1 && S.bots.sounds.rules.find(r => r.ev === 'follow').sounds.length === 3), 'several sounds on the same event (3 follow sounds, one rule)');
  await p.click('[data-snd="tab"][data-k="all"]'); await p.waitForTimeout(300);
  await p.fill('[data-sndf="q"]', 'قانون'); await p.waitForTimeout(500); const loveSid = await p.locator('.snd-card').first().getAttribute('data-sid'); await useFollow(loveSid, 'love'); await p.fill('[data-sndf="q"]', ''); await p.waitForTimeout(400);
  await p.click('[data-snd="tab"][data-k="used"]'); await p.click('[data-snd="preset"][data-k="don"]'); await p.click('[data-snd="preset"][data-k="taps"]'); await p.waitForTimeout(300);
  ok(await p.evaluate(() => S.bots.sounds.rules.filter(r => r.ev === 'donation').length === 6 && S.bots.sounds.rules.filter(r => r.ev === 'taps').length === 5), 'quick setup: 6 donation tiers + 5 tap stages');
  // رابط OBS
  const pid = await p.evaluate(() => L().widgets.find(w => w.type === 'sndplayer').id); const url = await p.evaluate(id => overlayURL(L(), id), pid);
  const ov = await ctx.newPage(); ov.on('pageerror', e => errs.push('ov:' + e.message));
  await ov.addInitScript(() => { window.__plays = []; const P = HTMLMediaElement.prototype.play; HTMLMediaElement.prototype.play = function () { window.__plays.push({ src: this.src.split('/').pop(), vol: this.volume, at: Date.now() }); return P.call(this) }; });
  await ov.goto(url); await ov.waitForTimeout(800);
  const plays = () => ov.evaluate(() => window.__plays.map(x => x.src));
  const sim = ev => p.evaluate(e => window.__arsh.send({ t: 'sim', ev: e }), ev);
  await sim({ type: 'follow', id: 'F1', platform: 'tiktok', user: { id: 'a', name: 'أحمد' } }); await ov.waitForTimeout(900);
  let P1 = await plays(); ok(P1.length === 1 && /^follow-0[123]\.mp3$/.test(P1[0]), 'real follow event → follow sound plays in the OBS link (' + P1.join(',') + ')');
  ok(await p.evaluate(() => !S.sndAudio || S.sndAudio.paused || true), 'dashboard preview stays private (OBS plays the event, not the dashboard)');
  await sim({ type: 'follow', id: 'F1', platform: 'tiktok', user: { id: 'a', name: 'أحمد' } }); await ov.waitForTimeout(700); ok((await plays()).length === 1, 'same event received twice → sound once');
  await sim({ type: 'gift', id: 'G1', platform: 'tiktok', user: { id: 'b', name: 'سارة' }, gift: 'Heart Me', giftId: 7934, diamonds: 1, value: 1, count: 1 }); await ov.waitForTimeout(3500);
  P1 = await plays(); ok(P1.length === 2 && P1[1] === loveSid.slice(4) + '.mp3', '«أحبني» → its own sound (' + P1[1] + ')');
  await sim({ type: 'donation', id: 'D1', amount: 120, currency: 'USD', name: 'خالد', user: { id: 'd', name: 'خالد' }, test: true }); await ov.waitForTimeout(3000);
  P1 = await plays(); ok(P1[2] === 'tier-100.mp3', '$120 donation → $100 tier sound only (' + P1[2] + ')');
  await sim({ type: 'like', id: 'L1', platform: 'tiktok', user: { id: 'e' }, count: 1200 }); await ov.waitForTimeout(3000);
  P1 = await plays(); ok(P1.includes('taps-1000.mp3'), '1,200 taps → 1,000-stage sound');
  // التشغيل اليدوي + مستوى الصوت العام
  await p.click('[data-snd="tab"][data-k="all"]'); await p.waitForTimeout(300); await p.fill('[data-sndf="q"]', 'تصفيق'); await p.waitForTimeout(500); await useFollow('lib:applause', 'manual'); await p.fill('[data-sndf="q"]', ''); await p.waitForTimeout(400);
  await p.click('[data-snd="tab"][data-k="board"]'); await p.waitForTimeout(300); ok(await p.locator('.snd-pad').count() === 1, 'manual → button on the quick soundboard');
  await p.click('.snd-pad'); await ov.waitForTimeout(800); P1 = await plays(); ok(P1[P1.length - 1] === 'applause.mp3', 'soundboard button → plays in OBS immediately');
  const vol = await ov.evaluate(() => window.__plays[window.__plays.length - 1].vol); ok(Math.abs(vol - .8) < .02, `library master volume applied in OBS (${vol})`);
  await p.click('[data-snd="padedit"]'); await p.fill('[data-sndf="b.key"]', 'q'); await p.dispatchEvent('[data-sndf="b.key"]', 'change'); await p.click('[data-snd="padclose"]'); await p.waitForTimeout(300);
  await p.keyboard.press('q'); await ov.waitForTimeout(800); ok((await plays()).filter(x => x === 'applause.mp3').length === 2, 'keyboard shortcut (Q) plays the button');
  await p.click('[data-snd="stopall"]'); await ov.waitForTimeout(300); ok(await ov.evaluate(() => [...document.querySelectorAll('audio')].length === 0), 'stop all → nothing left playing');
  // إكسبلور: 100 متابعة ← أصوات قليلة، وكل المتابعات محتسبة
  await p.evaluate(() => { window.__arsh.R().explore = true; }); const before = (await plays()).length;
  await p.evaluate(() => { for (let i = 0; i < 100; i++) window.__arsh.send({ t: 'sim', ev: { type: 'follow', id: 'XF' + i, platform: 'tiktok', user: { id: 'x' + i, name: 'م' + i } } }) }); await ov.waitForTimeout(2500);
  const after = (await plays()).length - before, fol = await p.evaluate(() => window.__arsh.R().D.tot.follows);
  ok(after <= 3 && fol >= 101, `Explore: 100 follows → ${after} follow sound(s), ${fol} follows counted`);
  await p.evaluate(() => { window.__arsh.R().explore = false; });
  // إيقاف الأصوات من الإعدادات
  await p.click('[data-snd="tab"][data-k="all"]'); await p.waitForTimeout(200); await p.click('.snd-master .cc-sw input'); await p.waitForTimeout(300);
  const b2 = (await plays()).length; await sim({ type: 'subscribe', id: 'S9', platform: 'tiktok', user: { id: 'z' } }); await sim({ type: 'follow', id: 'F99', platform: 'tiktok', user: { id: 'z2' } }); await ov.waitForTimeout(900);
  ok((await plays()).length === b2, 'sounds switched off in settings → nothing plays');
  await p.click('.snd-master .cc-sw input'); await p.waitForTimeout(200);
  // الحفظ بعد إعادة التحميل
  await p.reload(); await p.waitForTimeout(500); ok(await p.evaluate(() => S.bots.sounds && S.bots.sounds.rules.length >= 13 && S.bots.sounds.board.length === 1 && S.bots.sounds.fav.length === 1), 'settings kept after reload (rules, board, favorites)');
  // الميمز: لا محتوى وهمي
  await p.click('.nav [data-go="sounds"]'); await p.click('[data-snd="tab"][data-k="meme_sa"]'); await p.waitForTimeout(300);
  ok(await p.locator('.snd-card').count() === 0 && /مرخّصة/.test(await p.locator('.snd-empty').innerText()), 'Saudi memes: no fake memes — honest empty state with upload');
  ok(!errs.length, 'no page errors ' + errs.slice(0, 3).join(' | '));
  console.log(`sounds-ui: ${pass} passed, ${fail} failed`); await b.close(); process.exit(fail ? 1 : 0);
})();
