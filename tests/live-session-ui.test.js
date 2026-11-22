// واجهة «إعدادات إعادة التصفير» في صفحة التكبيس + تحديث طبقة التكبيس المفتوحة كمصدر بث
const {chromium}=require('/opt/npm-tools/node_modules/playwright'); const path=require('path');
let pass=0,fail=0; const ok=(c,m)=>{ c?pass++:(fail++,console.log('FAIL',m)) };
(async()=>{ const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'}); const ctx=await b.newContext({viewport:{width:1440,height:1000}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+path.resolve(__dirname,'../demo/index.html')); await p.evaluate(()=>localStorage.clear()); await p.reload();
 await p.click('.nav [data-go="likes"]'); await p.waitForTimeout(400);
 const txt=await p.textContent('[data-sess]');
 for(const k of ["إعدادات إعادة التصفير","تصفير التكبيس تلقائياً عند بدء بث جديد","تصفير التكبيس الآن","بدء جلسة بث جديدة","الاحتفاظ بإحصائيات البث السابق","بداية الجلسة الحالية","حالة الاتصال بالبث"]) ok(txt.includes(k),'section has: '+k);
 ok(await p.$eval('[data-sessauto]',e=>e.checked)&&await p.$eval('[data-sesskeep]',e=>e.checked),'auto-reset + keep stats ON by default');
 // تكبيس + طبقة مفتوحة
 const lk=(u,n)=>p.evaluate(([u,n])=>window.__arsh.send({t:"sim",ev:{type:"like",id:"l"+Math.random(),user:{id:u,name:u},count:n}}),[u,n]);
 for(let i=0;i<10;i++) await lk("u"+(i%3),100); await p.waitForTimeout(200);
 const tot=()=>p.evaluate(()=>window.__arsh.R().D.tot.likes); ok(await tot()===1000,'1,000 taps');
 await p.evaluate(()=>{ if(!window.__arsh.L().widgets.some(w=>w.type==="likes")) window.__arsh.addWidget("likes"); window.__arsh.save(); window.__arsh.pushLayout() });
 const wid=await p.evaluate(()=>window.__arsh.L().widgets.find(w=>w.type==="likes").id); const url=await p.evaluate(id=>window.__arsh.overlayURL(window.__arsh.L(),id),wid);
 const o=await ctx.newPage(); await o.goto(url); await o.waitForTimeout(900);
 const ovRows=()=>o.evaluate(()=>["u0","u1","u2"].filter(n=>(document.body.innerText||"").includes(n)).length);
 const before=await ovRows(); ok(before===3,'OBS taps layer shows the 3 tappers ('+before+')');
 // تصفير يدوي بتأكيد
 await p.click('[data-sessreset]'); await p.waitForTimeout(200); ok(!!(await p.$('.modal [data-ok]'))&&await tot()===1000,'manual reset asks for confirmation first');
 await p.click('.modal [data-ok]'); await p.waitForTimeout(500); ok(await tot()===0,'reset → 0 taps');
 await o.waitForTimeout(600); ok(await ovRows()===0,'OBS layer cleared live (no page reload) '+before+' → '+(await ovRows()));
 ok(/تكبيس هذه الجلسة\s*0/.test(await p.innerText('[data-sess]')),'section shows 0 taps this session');
 // جلسة جديدة يدوية → الإحصائيات محفوظة
 for(let i=0;i<5;i++) await lk("v"+i,40); await p.waitForTimeout(150);
 await p.click('[data-sessnew]'); await p.waitForTimeout(200); await p.click('.modal [data-ok]'); await p.waitForTimeout(500);
 const L=await p.evaluate(()=>window.__arsh.R().C.live); ok(await tot()===0&&L.sid&&L.source==="manual"&&!L.endedAt,'manual «start new session» → open session, 0 taps');
 await p.click('.nav [data-go="likes"]'); await p.waitForTimeout(300);
 ok(/إحصائيات البثوث السابقة/.test(await p.textContent('[data-sess]'))&&/200/.test(await p.textContent('.ss-hist')),'previous session stats shown (200 taps)');
 // تعطيل التصفير التلقائي يُحفظ
 await p.click('[data-sessauto]'); await p.waitForTimeout(300); ok((await p.evaluate(()=>window.__arsh.R().C.live.auto))===false,'auto-reset toggle saved');
 await p.evaluate(()=>{ const d=document.querySelector('.ss-more'); d.open=true }); await p.check('[data-sessscope="gifts"]'); await p.waitForTimeout(300); ok((await p.evaluate(()=>window.__arsh.R().C.live.scopes.gifts))===true,'extra reset scope saved');
 // تحديث الصفحة: الإعدادات والجلسة باقية
 await p.reload(); await p.waitForTimeout(600); ok((await p.evaluate(()=>{ const L=window.__arsh.R().C.live; return L.auto===false&&L.sid&&L.history.length>=1 })),'settings + session persist after page refresh');
 ok(errs.length===0,'no page errors '+errs.slice(0,3).join('|')); console.log(`live-session-ui: ${pass} passed, ${fail} failed`); await b.close(); process.exit(fail?1:0) })();
