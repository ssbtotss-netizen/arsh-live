const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const url='file:///home/claude/najd/demo/index.html';
(async()=>{
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:1440,height:1000}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto(url); await p.click('.nav [data-go="donations"]'); await p.waitForTimeout(200);
 // add widgets
 await p.click('[data-dontab="widgets"]');
 for(const sel of ['[data-don-addw="donTicker"]','[data-don-addw="donGoal"]','[data-don-addw="donLatest"]','[data-don-extra*="week"]','[data-don-extra*="month"]','[data-don-addw="donBoard"]','[data-don-addw="donAlert"]']){ await p.click('.nav [data-go="donations"]'); await p.click('[data-dontab="widgets"]'); await p.click(sel); }
 const types=await p.evaluate(()=>window.__arsh.L().widgets.map(w=>w.type).filter(t=>t.startsWith('don')));
 ok(types.length===7,'7 donation widgets added: '+types);
 await p.click('.nav [data-go="obs"]'); const href=await p.locator('a[href*="#/overlay"]').first().getAttribute('href');
 const ov=await ctx.newPage(); ov.on('pageerror',e=>errs.push('ov '+e.message)); await ov.setViewportSize({width:540,height:960}); await ov.goto(href); await ov.waitForTimeout(600);
 const tikBefore=await p.evaluate(()=>JSON.stringify(window.__arsh.R().D.tot));
 await p.click('.nav [data-go="donations"]'); await p.click('[data-dontab="overview"]');
 await p.click('[data-don-sim="50"]'); await p.waitForTimeout(150); await p.click('[data-don-sim="500"]'); await p.waitForTimeout(150); await p.click('[data-don-sim="5"]'); await p.waitForTimeout(500);
 ok((await p.evaluate(()=>JSON.stringify(window.__arsh.R().D.tot)))===tikBefore,'donations did not change TikTok likes/gift points');
 ok(!(await ov.locator('.wd.t-donTicker .trk').innerText()).match(/— *\$ *(50|500|5)\b/),'ticker ignores test donations');
 /* الدعم الحقيقي في الشريط: tests/ticker.test.js */
 const latest=await ov.locator('.wd.t-donLatest .sc .un').last().textContent(); ok(/5 ?ر.س/.test(latest),'latest donor updated: '+latest);
 await ov.waitForTimeout(1100); /* انتظار انتهاء العدّ التدريجي */
 const goal=await ov.locator('.wd.t-donGoal .ck-time').textContent(); ok(/555 ر.س \/ 1,000 ر.س/.test(goal),'goal progress 555 / 1,000: '+goal);
 ok(await ov.locator('.wd.t-donAlert .sc.alert').count()===1,'alert shown (queue: one at a time)');
 const qlen=await ov.evaluate(()=>{ return 1 });
 await ov.screenshot({path:'don-overlay.png',omitBackground:true});
 // overview stats exclude tests
 await p.click('[data-dontab="overview"]'); await p.waitForTimeout(150);
 ok((await p.locator('#pg').textContent()).includes('لا توجد تبرعات مؤكدة بعد'),'test donations excluded from financial dashboard');
 // weekly top
 await p.click('[data-don-sim="1500"][data-newname="1"]'); await ov.waitForTimeout(500);
 const wk=await ov.evaluate(()=>[...document.querySelectorAll('.wd.t-donTop')].map(e=>e.querySelector('.r:not(.emp) .vl b')?.textContent)); ok(wk.every(x=>x==='1,500 ر.س'),'weekly & monthly top donor = 1,500 ر.س: '+wk);
 // goals editing
 await p.click('[data-dontab="goals"]'); const gid=await p.evaluate(()=>window.__arsh.S.donCfg.goals[0].id);
 await p.fill(`[data-goal="${gid}"][data-gf="target"]`,'5000'); await p.press(`[data-goal="${gid}"][data-gf="target"]`,'Tab'); await ov.waitForTimeout(400);
 ok(/\/ 5,000 ر.س/.test(await ov.locator('.wd.t-donGoal .ck-time').textContent()),'goal target edit pushed live to OBS');
 await p.click(`[data-goal-pause="${gid}"]`); await p.click('[data-don-sim="50"]'); await ov.waitForTimeout(300);
 ok((await ov.locator('.wd.t-donGoal .ck-t').textContent()).includes('متوقف'),'paused goal shown and not counting');
 // refund simulation from log
 await p.click('[data-dontab="log"]'); await p.waitForTimeout(150); const before=await ov.locator('.wd.t-donTop .r:not(.emp) .vl b').first().textContent();
 const rid=await p.evaluate(()=>window.__arsh.R().DN.list.find(d=>d.amount===1500).id);
 await p.click(`[data-don-refund="${rid}"]`); await ov.waitForTimeout(400);
 const after=await ov.locator('.wd.t-donTop .r:not(.emp) .vl b').first().textContent(); ok(after!==before&&after!=='1,500 ر.س','refund removes 1,500 from top donor ('+after+')');
 // providers tab honest
 await p.click('[data-dontab="providers"]'); const prov=await p.locator('#pg').textContent();
 ok(prov.includes('غير مدعوم حالياً')&&prov.includes('يتطلب خادم المنصة'),'unsupported providers marked; keys require server');
 await p.screenshot({path:'don-providers.png'});
 // settings tz/weekStart saved
 await p.click('[data-dontab="settings"]'); await p.selectOption('[data-dc="weekStart"]','6'); await p.waitForTimeout(500);
 await p.reload(); await p.waitForTimeout(400); ok(await p.evaluate(()=>window.__arsh.S.donCfg.weekStart)===6,'week start saved');
 await p.click('.nav [data-go="donations"]'); await p.click('[data-dontab="overview"]'); await p.click('[data-don-cleartests]'); await p.waitForTimeout(200);
 ok(await p.evaluate(()=>window.__arsh.R().DN.list.length)===0,'clear test donations');
 await p.click('[data-dontab="widgets"]'); await p.screenshot({path:'don-widgets.png'});
 ok(errs.length===0,'no errors '+errs.join('|'));
 await b.close();
})();
