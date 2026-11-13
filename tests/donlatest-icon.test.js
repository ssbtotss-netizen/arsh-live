// «آخر داعم»: $ ملاصق للرقم ($21) + الأيقونة: تلقائي/بدون/أشكال جاهزة/مخصصة + لونها، في المحرر و OBS
const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const url='file:///home/claude/najd/demo/index.html';
(async()=>{
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:1440,height:1000}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto(url); await p.evaluate(()=>localStorage.clear()); await p.goto(url);
 await p.click('.nav [data-go="studio"]'); await p.waitForTimeout(300);
 const id=await p.evaluate(()=>{ const w=addWidget("donLatest"); renderPage(); return w.id });
 await p.evaluate(()=>window.__arsh.send({t:"sim",ev:{id:"H1",type:"donation",provider:"streamlabs",name:"حشور",amount:21,currency:"USD",message:"معلممم"}})); await p.waitForTimeout(700);
 const S=`#stage .wd[data-id="${id}"]`;
 const geo=()=>p.evaluate(S=>{ const e=document.querySelector(S); const c=e.querySelector('.tk-c'), a=e.querySelector('.tk-a'), n=e.querySelector('.tk-n'); if(!c||!a) return null; const rc=c.getBoundingClientRect(), ra=a.getBoundingClientRect(), rn=n.getBoundingClientRect();
  return {gap:Math.round(ra.left-rc.right), dollarLeftOfNum:rc.right<=ra.left+1, nameApart:!(rn.left<ra.right&&rn.right>rc.left), un:e.querySelector('.un').innerText.replace(/\s+/g," ")} },S);
 let g=await geo(); ok(g&&g.dollarLeftOfNum&&g.gap<=3&&g.nameApart,'$ ملاصق للرقم ($21) ولا يفصله الاسم: '+JSON.stringify(g));
 const ico=()=>p.evaluate(S=>{ const e=document.querySelector(S+' .lg .emo'); return e?{t:e.textContent,tx:e.classList.contains('emo-tx'),c:getComputedStyle(e).color}:null },S);
 ok((await ico()).t==="💚",'الافتراضي: القلب حسب المبلغ');
 await p.click(S); await p.waitForTimeout(300);
 ok(await p.$(`[data-dnicon="none"][data-wid="${id}"]`),'أزرار الأيقونة ظاهرة في الإعدادات');
 await p.click(`[data-dnicon="none"][data-wid="${id}"]`); await p.waitForTimeout(300); ok((await ico())===null,'⛔ إيقاف القلب');
 await p.click(`[data-dnicon="$"][data-wid="${id}"]`); await p.waitForTimeout(300); let i=await ico(); ok(i&&i.t==="$"&&i.tx,'تغيير الشكل إلى $');
 await p.evaluate(id=>{ const c=document.querySelector(`[data-wf="dnIconC"][data-wid="${id}"]`); c.value="#ffcc00"; c.dispatchEvent(new Event('input',{bubbles:true})); c.dispatchEvent(new Event('change',{bubbles:true})) },id); await p.waitForTimeout(300);
 ok((await ico()).c==='rgb(255, 204, 0)','لون الأيقونة النصية');
 await p.click(`[data-dnicon="👑"][data-wid="${id}"]`); await p.waitForTimeout(300); ok((await ico()).t==="👑",'شكل جاهز 👑');
 await p.click(`[data-dnicon="custom"][data-wid="${id}"]`); await p.waitForTimeout(300);
 await p.fill(`[data-wf="dnIconTx"][data-wid="${id}"]`,'﷼'); await p.waitForTimeout(400); ok((await ico()).t==="﷼",'أيقونة مخصصة يكتبها صانع المحتوى (﷼)');
 g=await geo(); ok(g&&g.dollarLeftOfNum&&g.gap<=3,'بعد تغيير الأيقونة ما زال $21 ملاصق');
 await p.screenshot({path:'/tmp/dl.png',clip:await p.evaluate(S=>{ const r=document.querySelector(S).getBoundingClientRect(); return {x:r.x-10,y:r.y-10,width:r.width+20,height:r.height+20} },S)});
 // OBS
 await p.click('.nav [data-go="obs"]'); await p.waitForTimeout(250);
 const href=await p.evaluate(()=>document.querySelector('a[href*="#/overlay"]').href);
 const o=await ctx.newPage(); await o.goto(href+'&only='+id); await o.reload(); await o.waitForTimeout(900);
 const oi=await o.evaluate(()=>({ico:document.querySelector('.lg .emo')?.textContent,un:document.querySelector('.un')?.innerText}));
 ok(oi.ico==="﷼"&&/حشور/.test(oi.un),'OBS يطبّق الأيقونة المختارة: '+JSON.stringify(oi));
 // ريال: الرمز بعد الرقم
 await p.evaluate(()=>window.__arsh.send({t:"sim",ev:{id:"H2",type:"donation",provider:"streamlabs",name:"Salem",amount:50,currency:"SAR"}})); await o.waitForTimeout(2500);
 const sar=await o.evaluate(()=>{ const a=document.querySelector('.sc:last-child .tk-a')||document.querySelector('.tk-a'), c=a.parentNode.querySelector('.tk-c'); const ra=a.getBoundingClientRect(), rc=c.getBoundingClientRect(); const fs=parseFloat(getComputedStyle(a).fontSize)*(a.getBoundingClientRect().height/a.offsetHeight||1); return {after:rc.left>=ra.right-1,gap:Math.round(rc.left-ra.right),em:+((rc.left-ra.right)/fs).toFixed(2),t:a.parentNode.innerText} });
 ok(sar.after&&sar.em<.5,'الريال: الرقم ثم «ر.س» بجانبه: '+JSON.stringify(sar));
 ok(!errs.length,'no page errors '+errs.join(' | ')); await b.close();
})();
