const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const url='file:///home/claude/najd/demo/index.html';
(async()=>{
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:1440,height:1000}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto(url); await p.evaluate(()=>localStorage.clear()); await p.goto(url);
 const A=()=>p.evaluate(()=>{const s=window.__arsh.R().C.subathon; return {st:s.status,rem:s.status==="running"?s.endsAt-Date.now():s.remainingMs,list:s.rules.list}});
 await p.click('.nav [data-go="subathon"]'); await p.waitForTimeout(300);
 const a0=await A(); ok(a0.list.length===10,'default rules list (10)');
 ok(await p.locator('[data-rule]').count()===10,'editor shows each rule as its own card');
 await p.click('[data-sa-op="start"]'); await p.waitForTimeout(200);
 // تعديل المتابعة: 2 دقيقة
 const fid=a0.list.find(r=>r.kind==='follow').id;
 await p.fill(`[data-rl="${fid}"][data-rk="amt:ms"]`,'2'); await p.dispatchEvent(`[data-rl="${fid}"][data-rk="amt:ms"]`,'change'); await p.waitForTimeout(200);
 ok((await A()).list.find(r=>r.id===fid).ms===120000,'edit follow amount → 2 minutes saved');
 // إضافة لوحة القوانين
 await p.click('[data-add-rb="list"]'); await p.waitForTimeout(300);
 const rbId=await p.evaluate(()=>window.__arsh.L().widgets.find(w=>w.type==='srules').id);
 ok(!!rbId,'rules board added from subathon page');
 await p.click('.nav [data-go="studio"]'); await p.waitForTimeout(400);
 const txt=await p.evaluate(id=>document.querySelector(`#stage .wd[data-id="${id}"]`).innerText,rbId);
 ok(txt.includes('فولو')&&txt.includes('+2')&&txt.includes('أسد'),'board reads the rules automatically (follow now +2)');
 const before=(await A()).rem;
 await p.evaluate(()=>window.__arsh.SIM.follow()); await p.waitForTimeout(250);
 const after=(await A()).rem; ok(after-before>110000&&after-before<125000,'follow event adds 2 minutes ('+Math.round((after-before)/1000)+'s)');
 ok(await p.evaluate(id=>!!document.querySelector(`#stage .wd[data-id="${id}"] .rb-row.hit`),rbId),'the fired rule flashes on the board');
 const logs=await p.evaluate(()=>window.__arsh.R().logs.slice(0,1)); ok(logs[0].ruleId===fid&&logs[0].test===true,'log has rule id + test mark');
 // دونيشن زيد/نقص
 const b2=(await A()).rem;
 await p.evaluate(()=>window.__arsh.send({t:"sim",ev:{id:"dz1",type:"donation",provider:"test",test:true,name:"خالد",amount:5,currency:"SAR",message:"نقص"}})); await p.waitForTimeout(200);
 const d1=(await A()).rem-b2; ok(d1<-290000&&d1>-310000,'donation 5 SAR + نقص → -5m ('+Math.round(d1/1000)+'s)');
 // تعطيل القاعدة يخفيها من اللوحة
 await p.click('.nav [data-go="subathon"]'); await p.waitForTimeout(250);
 const lion=(await A()).list.find(r=>r.giftId===6369).id;
 await p.uncheck(`[data-rl="${lion}"][data-rk="enabled"]`); await p.waitForTimeout(250);
 await p.click('.nav [data-go="studio"]'); await p.waitForTimeout(400);
 ok(!(await p.evaluate(id=>document.querySelector(`#stage .wd[data-id="${id}"]`).innerText,rbId)).includes('أسد'),'disabled rule disappears from board');
 // الأوضاع
 for(const m of ['rotate','ticker','cards','compact']){ await p.evaluate(([id,m])=>{const w=window.__arsh.L().widgets.find(x=>x.id===id); w.mode=m},[rbId,m]); await p.click(`#stage .wd[data-id="${rbId}"]`,{position:{x:15,y:15}}); await p.selectOption('select[data-wf="mode"]',m); await p.waitForTimeout(500);
  const n=await p.evaluate(id=>document.querySelectorAll(`#stage .wd[data-id="${id}"] .rb-row`).length,rbId); ok(n>=1,`mode ${m} renders (${n} rows)`) }
 // الشفافية + OBS
 await p.click('.nav [data-go="obs"]'); await p.waitForTimeout(200);
 const href=await p.evaluate(()=>document.querySelector('a[href*="#/overlay"]').href);
 const o=await ctx.newPage(); o.on('pageerror',e=>errs.push('ov '+e.message)); await o.setViewportSize({width:540,height:960}); await o.goto(href+'&only='+rbId); await o.reload(); await o.waitForTimeout(700);
 const ov=await o.evaluate(()=>({n:document.querySelectorAll('.wd').length,bg:getComputedStyle(document.body).backgroundColor,txt:document.querySelector('.wd').innerText}));
 ok(ov.n===1&&ov.bg==='rgba(0, 0, 0, 0)','OBS link: only the rules board, transparent page');
 ok(ov.txt.includes('+2'),'OBS shows live rules');
 await p.click('.nav [data-go="subathon"]'); await p.waitForTimeout(250);
 await p.fill(`[data-rl="${fid}"][data-rk="amt:ms"]`,'3'); await p.dispatchEvent(`[data-rl="${fid}"][data-rk="amt:ms"]`,'change'); await p.waitForTimeout(700);
 ok((await o.evaluate(()=>document.querySelector('.wd').innerText)).includes('+3'),'OBS board updates live when the rule changes');
 // المكتبة
 await p.click('.nav [data-go="library"]'); await p.click('[data-libtab="rules"]'); await p.waitForTimeout(500);
 ok(await p.evaluate(()=>document.querySelectorAll('#lib .libc').length)===10,'rules library: 10 designs with live previews');
 await p.click('#lib .libc[data-pick="neonBlueRules"] .meta'); await p.waitForTimeout(200);
 ok(await p.evaluate(id=>window.__arsh.L().widgets.find(w=>w.id===id).design,rbId)==='neonBlueRules','apply rules design');
 await p.screenshot({path:'shots/rb-library.png'});
 await p.click('.nav [data-go="subathon"]'); await p.waitForTimeout(300); await p.screenshot({path:'shots/rb-editor.png',fullPage:true});
 ok(errs.length===0,'no page errors '+errs.join(' | '));
 await b.close();
})();
