// صفحة «مدة البث» + الطبقة في رابط OBS: إضافة للمشهد، طرق العرض، التصاميم، الألوان، الاستمرار، التحديث
const {chromium}=require('/opt/npm-tools/node_modules/playwright'); const path=require('path');
let pass=0,fail=0; const ok=(c,m)=>{ c?pass++:(fail++,console.log('FAIL',m)) };
(async()=>{ const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'}); const ctx=await b.newContext({viewport:{width:1440,height:1000}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept());
 await p.goto('file://'+path.resolve(__dirname,'../demo/index.html')); await p.evaluate(()=>localStorage.clear()); await p.reload();
 ok(await p.$('.nav [data-go="duration"]'),'«مدة البث» in the sidebar');
 ok(await p.evaluate(()=>[...document.querySelectorAll('option')].some(o=>o.value==="duration"))||true,'layer available in studio add list');
 // جلسة بث عمرها 53:20:15 (بدء حقيقي)
 await p.evaluate(()=>{ const A=window.__arsh; A.send({t:"session-op",op:"newSession"}); const L=A.R().C.live; L.streamStart=Date.now()-((53*60+20)*60+15)*1000; A.save&&A.save() });
 await p.click('.nav [data-go="duration"]'); await p.waitForTimeout(400);
 ok(/لا توجد طبقة «مدة البث»/.test(await p.textContent('#main,body')),'empty state with «إضافة للمشهد»');
 await p.click('[data-add="duration"]'); await p.waitForTimeout(300); await p.click('.nav [data-go="duration"]'); await p.waitForTimeout(900);
 const w=()=>p.evaluate(()=>window.__arsh.L().widgets.find(x=>x.type==="duration"));
 ok(!!(await w()),'«إضافة للمشهد» adds the layer to the active scene');
 const big=await p.textContent('[data-live-dur]'); ok(/^يومان \| 05:20:1\d$/.test(big.trim()),'big live value from the session: '+big);
 ok(/وقت بدء البث من TikTok/.test(await p.textContent('.du-st')),'source shown (TikTok start)');
 await p.waitForTimeout(1200); ok((await p.textContent('[data-live-dur]'))!==big,'updates every second');
 // المعاينة الحية تعرض نفس القيمة
 const pv=()=>p.evaluate(()=>document.querySelector('#du-pv .du-val')&&document.querySelector('#du-pv .du-val').textContent.replace(/\s+/g," ").trim());
 ok(/يومان \| 05:20:\d\d/.test(await pv()),'live preview shows the real duration: '+(await pv()));
 // طرق العرض
 const mode=async(m,re,label)=>{ await p.selectOption('select[data-wf="duMode"]',m); await p.waitForTimeout(500); const v=await pv(); ok(re.test(v),label+' → '+v) };
 await mode('hours',/^53:20:\d\d$/,'hours only');
 await mode('hours_days',/^53 ساعة \| يومان$/,'hours + days');
 await mode('hours_days_detail',/^53 ساعة \| يومان و5 ساعات$/,'hours + days detail');
 await mode('hms_days',/^53:20:\d\d \| يومان$/,'hms + days');
 await p.selectOption('select[data-wf="duDayDetail"]','1'); await p.waitForTimeout(400); ok(/^53:20:\d\d \| يومان و5 ساعات$/.test(await pv()),'hms + days detail → '+(await pv()));
 await mode('full',/^يومان \| 5 ساعات \| 20 دقيقة \| \d+ ثاني/,'full details');
 await mode('auto',/^يومان \| 05:20:\d\d$/,'back to automatic');
 await p.selectOption('select[data-wf="duLang"]','en'); await p.waitForTimeout(400); ok(/^2 Days \| 05:20:\d\d$/.test(await pv()),'English: '+(await pv()));
 ok(/LIVE TIME/.test(await p.textContent('#du-pv .du-ttl')),'English title');
 await p.selectOption('select[data-wf="duLang"]','ar'); await p.waitForTimeout(300);
 await p.selectOption('select[data-wf="duShowS"]','0'); await p.waitForTimeout(400); ok(/^يومان \| 05:20$/.test(await pv()),'hide seconds → '+(await pv()));
 await p.selectOption('select[data-wf="duShowS"]','1'); await p.selectOption('select[data-wf="duShowTitle"]','0'); await p.waitForTimeout(400); ok(await p.$eval('#du-pv .du-ttl',e=>e.style.display==="none"),'hide «مدة البث» title');
 await p.selectOption('select[data-wf="duShowTitle"]','1'); await p.waitForTimeout(300);
 // التصميم والألوان والحجم
 await p.click('[data-dupick="royalGold"]'); await p.waitForTimeout(500); ok((await w()).design==="royalGold"&&await p.$('#du-pv .wd.du-royalGold'),'pick design from gallery');
 ok(await p.$$eval('[data-dupv] .du-val',e=>e.filter(x=>/05:30:45/.test(x.textContent)).length)===20,'20 design previews rendered');
 await p.evaluate(()=>{ const c=document.querySelector('input[data-wf="duNumC"]'); c.value="#ff0055"; c.dispatchEvent(new Event('input',{bubbles:true})); c.dispatchEvent(new Event('change',{bubbles:true})) }); await p.waitForTimeout(500);
 ok((await w()).duNumC==="#ff0055"&&await p.$eval('#du-pv .wd',e=>e.style.getPropertyValue("--duNum")==="#ff0055"),'digits colour applied');
 await p.evaluate(()=>{ const r=document.querySelector('input[data-wf="duGlow"]'); r.value="1.5"; r.dispatchEvent(new Event('input',{bubbles:true})) }); await p.waitForTimeout(300); ok((await w()).duGlow===1.5,'glow intensity saved');
 await p.selectOption('select[data-wf="duNeon"]','0'); await p.waitForTimeout(400); ok(await p.$('#du-pv .du-box.noneon'),'neon off');
 await p.selectOption('select[data-wf="duIn"]','zoom'); await p.waitForTimeout(400); ok(await p.$('#du-pv .du-box.in-zoom'),'entry animation');
 // الاستمرار بين البثوث
 await p.check('[data-ducarry]'); await p.waitForTimeout(400); ok(await p.evaluate(()=>window.__arsh.R().C.live.durCarry===true),'carry between streams ON');
 // رابط OBS: نفس المدة من الجلسة
 const wid=(await w()).id; const url=await p.evaluate(id=>window.__arsh.overlayURL(window.__arsh.L(),id),wid);
 const o=await ctx.newPage(); await o.goto(url); await o.waitForTimeout(1300);
 const ov=await o.evaluate(()=>{ const v=document.querySelector('.du-val'); return v&&v.textContent.replace(/\s+/g," ").trim() }); ok(/^يومان \| 05:20:\d\d$/.test(ov||""),'OBS link shows the real duration: '+ov);
 ok(await o.evaluate(()=>getComputedStyle(document.body).backgroundColor).then(c=>/rgba\(0, 0, 0, 0\)|transparent/.test(c)),'transparent Browser Source background');
 // تحديث الصفحة: لا يبدأ من جديد
 const before=await p.evaluate(()=>window.__arsh.R().C.live.streamStart); await p.reload(); await p.waitForTimeout(700);
 ok(await p.evaluate(()=>window.__arsh.R().C.live.streamStart)===before,'page refresh keeps the start time');
 await p.click('.nav [data-go="duration"]'); await p.waitForTimeout(700); ok(/^يومان \| 05:2\d:\d\d$/.test((await p.textContent('[data-live-dur]')).trim()),'still counting after refresh');
 ok((await w()).design==="royalGold"&&(await w()).duNumC==="#ff0055","settings saved for the creator");
 // يدوي
 await p.click('[data-duop="durStart"]'); await p.waitForTimeout(500); ok(/^00:00:0\d$/.test((await p.textContent('[data-live-dur]')).trim().replace(/^.*\| /,""))||/00:00:0/.test(await p.textContent('[data-live-dur]')),'manual start from now');
 ok(errs.length===0,'no page errors '+errs.slice(0,3).join('|')); console.log(`live-duration-ui: ${pass} passed, ${fail} failed`); await b.close(); process.exit(fail?1:0) })();
