// الشات المباشر والإدارة + الشات العائم — اختبار في المتصفح (اللوحة + رابط OBS للشات الموحد في نفس السياق)
const { chromium } = require('/opt/npm-tools/node_modules/playwright');
let pass = 0, fail = 0; const ok = (c, m) => { c ? pass++ : fail++; console.log((c ? 'PASS ' : 'FAIL ') + m) };
const SHOT = process.argv[2] === 'shots';
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' }); const ctx = await b.newContext({ viewport: { width: 1400, height: 950 } });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push('dash:' + e.message));
  await p.goto('file:///home/claude/najd/demo/index.html'); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(400);
  const wid = await p.evaluate(() => { const A = window.__arsh; const w = A.addWidget("uchat", {}); A.save(); A.pushLayout(); return w.id });
  const ov = await ctx.newPage(); ov.on('pageerror', e => errs.push('ov:' + e.message)); await ov.goto(await p.evaluate(id => overlayURL(L(), id), wid)); await ov.waitForTimeout(800);
  await p.click('.nav [data-go="livechat"]'); await p.waitForTimeout(400);
  const sim = ev => p.evaluate(e => window.__arsh.send({ t: 'sim', ev: e }), ev);
  const msgs = [["tiktok", "t1", "أحمد", "السلام عليكم يا بطوط"], ["youtube", "y1", "سارة", "بث رهيب"], ["kick", "k1", "أحمد", "أنا من كيك"], ["twitch", "w1", "فهد", "GG"], ["tiktok", "t2", "نورة", "كيف حالكم"]];
  let i = 0; for (const [pl, uid, n, t] of msgs) { await sim({ type: "comment", id: "c" + (++i), platform: pl, user: { id: uid, name: n }, text: t }); await p.waitForTimeout(120); }
  await sim({ type: "gift", id: "g1", platform: "tiktok", user: { id: "t3", name: "خالد" }, gift: "Rose", giftId: 5655, diamonds: 1, value: 1, count: 3 }); await p.waitForTimeout(500);
  ok(await p.locator('#flc-list .flc-m').count() === 6, 'live chat shows messages from all platforms + support (6)');
  ok(await p.locator('#flc-list .flc-m.sup').count() === 1, 'gift appears as a support card');
  const before = await p.evaluateHandle(() => document.getElementById('flc-list').children[0]); // للتأكد من عدم إعادة الرسم الكامل
  await sim({ type: "comment", id: "c9", platform: "youtube", user: { id: "y2", name: "ريم" }, text: "رسالة جديدة" }); await p.waitForTimeout(300);
  ok(await p.evaluate(b => document.getElementById('flc-list').children[0] === b && b.isConnected, before) && await p.locator('#flc-list .flc-m').count() === 7, 'new message appended (existing rows kept — no full redraw)');
  // القائمة على مشاهد TikTok: محلي فقط وبوضوح
  await p.click('#flc-list .flc-m[data-uid="t1"] .flc-n'); await p.waitForTimeout(200);
  const menu = await p.locator('.flc-menu').innerText(); ok(/TikTok لا يوفر|محلية داخل B6O6/.test(menu) && /محلي/.test(menu), 'TikTok menu says clearly: local only (no official API)');
  ok(/30 ثانية/.test(menu) && /24 ساعة/.test(menu) && /مدة مخصصة/.test(menu), 'mute durations 30 s … 24 h + custom');
  await p.click('.flc-menu [data-fm="timeout"][data-sec="60"]'); await p.waitForTimeout(500);
  ok(await p.locator('#flc-list .flc-m[data-uid="t1"]').count() === 0, 'muted viewer hidden from live chat');
  ok(await p.locator('#flc-list .flc-m[data-uid="k1"]').count() === 1, 'same name «أحمد» on Kick is a different viewer (still visible)');
  await ov.waitForTimeout(400); const ovTxt = await ov.locator('.ucw').innerText(); ok(!/السلام عليكم يا بطوط/.test(ovTxt) && /أنا من كيك/.test(ovTxt), 'muted message also removed from the OBS chat');
  // تثبيت
  await p.click('#flc-list .flc-m[data-uid="y1"] .flc-n'); await p.click('.flc-menu [data-fm="pin"][data-sec="0"]'); await p.waitForTimeout(500);
  ok(await p.locator('.flc-root .flc-pin').count() === 1 && /بث رهيب/.test(await p.locator('.flc-root .flc-pin').innerText()), 'pinned message card at the top of the live chat');
  await ov.waitForTimeout(500); ok(await ov.locator('.uc-pin').count() === 1 && /بث رهيب/.test(await ov.locator('.uc-pin').innerText()), 'pinned message shown in OBS too');
  await p.click('.flc-root .flc-pin [data-flc="unpin"]'); await p.waitForTimeout(500); ok(await p.locator('.flc-root .flc-pin').count() === 0 && await ov.locator('.uc-pin').count() === 0, 'unpin removes it everywhere');
  // حذف رسالة + فك الكتم
  await p.click('#flc-list .flc-m[data-uid="w1"] .flc-n'); await p.click('.flc-menu [data-fm="delete"]'); await p.waitForTimeout(400); ok(await p.locator('#flc-list .flc-m[data-uid="w1"]').count() === 0, 'delete message (local for Twitch without official connection)');
  ok(await p.evaluate(() => { const L = window.__arsh.R().C.mod.log.map(e => e.act); return L.includes('timeout') && L.includes('delete') }), 'moderation actions logged (mute + delete)');
  // الإشراف التلقائي
  await p.click('[data-flc="modset"]'); await p.waitForTimeout(200); await p.check('[data-flcf="am.on"]'); await p.waitForTimeout(300);
  await sim({ type: "comment", id: "bad1", platform: "tiktok", user: { id: "t9", name: "مزعج" }, text: "يا حمار" }); await p.waitForTimeout(400);
  ok(await p.locator('#flc-list .flc-m[data-id="bad1"]').count() === 0 && await ov.locator('text=يا حمار').count() === 0, 'auto-moderation hides profanity (dashboard + OBS)');
  ok(await p.evaluate(() => window.__arsh.R().C.mod.auto.native === false), 'auto platform actions stay off by default');
  // التصاميم + الأوضاع + الشفافية
  await p.click('[data-flc="design"]'); await p.waitForTimeout(300); ok(await p.locator('.flc-dg').count() === 25, '25 floating chat designs with live preview');
  const designs = await p.$$eval('.flc-dg', a => a.map(e => e.dataset.k)); const looks = new Set();
  for (const d of ['basic', 'minimal', 'bubble', 'terminal', 'cinema', 'ribbon', 'timeline', 'comic']) { await p.click(`.flc-dg[data-k="${d}"]`); await p.waitForTimeout(120); looks.add(await p.evaluate(() => { const m = document.querySelector('#flc-list .flc-m'); const s = getComputedStyle(m); const l = getComputedStyle(document.getElementById('flc-list')), pb = getComputedStyle(m, '::before'); return [s.display, s.flexDirection, s.borderRadius, s.backgroundColor, getComputedStyle(m.querySelector('.flc-av') || m).display, l.borderInlineStartWidth, pb.content].join('|') })); }
  ok(looks.size === 8, `designs differ in structure (8 sampled → ${looks.size} distinct layouts)`);
  await p.click('.flc-mode[data-k="support"]'); await p.waitForTimeout(200); ok(await p.locator('#flc-list .flc-m:not(.sup)').count() === 0 && await p.locator('#flc-list .flc-m.sup').count() >= 1, 'Support Only mode');
  await p.click('.flc-mode[data-k="full"]'); await p.click('[data-flc="op"]'); await p.click('[data-flc="preset"][data-k="transparent"]'); await p.waitForTimeout(200);
  ok(await p.evaluate(() => getComputedStyle(document.querySelector('.flc-root')).backgroundColor) === 'rgba(8, 10, 20, 0)', 'fully transparent preset: no chat background');
  ok(await p.evaluate(() => S.settings.flc.preset === 'transparent'), 'settings saved');
  // نافذة مستقلة
  const fw = await ctx.newPage(); fw.on('pageerror', e => errs.push('float:' + e.message)); await fw.goto('file:///home/claude/najd/demo/index.html#float'); await fw.waitForTimeout(800);
  ok(await fw.evaluate(() => document.body.classList.contains('flc-only') && !!document.querySelector('.flc-root') && getComputedStyle(document.querySelector('.nav')).display === 'none'), 'floating window (#float): chat only, no dashboard navigation');
  ok(await fw.locator('[data-flc="game"][data-dis]').count() === 1, 'game mode honestly marked as desktop-app only in the browser');
  if (SHOT) { await p.click('[data-flc="design"]'); await p.click('.flc-dg[data-k="glass"]'); await p.click('[data-flc="preset"][data-k="glass"]').catch(() => {}); await p.waitForTimeout(200); await p.screenshot({ path: '/tmp/shots/l1.png' });
    await p.click('#flc-list .flc-m[data-uid="t2"] .flc-n'); await p.waitForTimeout(200); await p.screenshot({ path: '/tmp/shots/l2.png' }); }
  ok(!errs.length, 'no page errors ' + errs.slice(0, 3).join(' | '));
  console.log(`livechat-ui: ${pass} passed, ${fail} failed`); await b.close(); process.exit(fail ? 1 : 0);
})();
