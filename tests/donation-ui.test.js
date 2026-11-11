const { chromium } = require('/opt/npm-tools/node_modules/playwright');
(async()=>{
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const ctx=await b.newContext({viewport:{width:1440,height:1000}}); await ctx.grantPermissions(['clipboard-read','clipboard-write']);
 const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file:///home/claude/najd/demo/index.html'); await p.evaluate(()=>localStorage.clear()); await p.goto('file:///home/claude/najd/demo/index.html');
 await p.click('.nav [data-go="donalerts"]'); await p.waitForTimeout(400);
 ok((await p.$$('.dn-step')).length===4&&(await p.$$('.dn-step.done')).length===0,'4 step cards, none done initially');
 ok((await p.$$('[data-dnhelp]')).length>=6&&await p.$('[data-dnguide]'),'help (?) buttons + «كيف أضبط الدونيشن؟»');
 await p.click('[data-dnguide]'); await p.waitForTimeout(200); ok((await p.$$('.dn-gs')).length===8,'step-by-step guide (8 steps)'); await p.click('.modal [data-close]');
 for(const v of [2,5,10,50,100]){ await p.click(`[data-dnpreset="${v}"]`); await p.waitForTimeout(120) }
 ok(await p.evaluate(()=>dnTiers().length===5),'5 amount tiers added from presets');
 await p.evaluate(()=>{ window.ask=async()=>"250" }); await p.click('[data-dncustom]'); await p.waitForTimeout(200);
 ok(await p.evaluate(()=>dnTiers().some(r=>r.cond.value===250)),'custom amount $250 added');
 ok(await p.evaluate(()=>(document.querySelectorAll('.dn-step.done').length)===1),'step 2 checked');
 // اختيار آيرت رسمي لـ $10
 const t10=await p.evaluate(()=>dnTiers().find(r=>r.cond.value===10).id);
 await p.click(`[data-dnpick="${t10}"]`); await p.waitForTimeout(400); await p.click('.dn-pick [data-ps="official"]'); await p.waitForTimeout(300);
 ok((await p.$$('.dn-pick .al-card')).length>=90,'library picker opens with platform alerts');
 await (await p.$$('.dn-pick [data-pick]'))[3].click(); await p.waitForTimeout(300);
 ok(await p.evaluate(id=>/^tpl:/.test(dnTiers().find(r=>r.id===id).alertId),t10),'alert chosen for $10');
 // رفع مقطع خاص لـ $50
 const t50=await p.evaluate(()=>dnTiers().find(r=>r.cond.value===50).id);
 await p.setInputFiles(`[data-dnup="${t50}"]`,'/tmp/alfx/mp4_audio.mp4'); for(let i=0;i<40;i++){ if(await p.evaluate(id=>!!dnTiers().find(r=>r.id===id).alertId,t50)) break; await p.waitForTimeout(250) }
 const up=await p.evaluate(id=>{ const r=dnTiers().find(x=>x.id===id); const a=alLocal().find(x=>x.id===r.alertId); return a&&{vis:a.visibility,ev:a.event,dur:a.durationSec,cover:!!a.coverData,name:a.name} },t50);
 ok(up&&up.vis==="private"&&up.ev==="donation"&&up.dur===3&&up.cover,'upload for $50: saved private, duration auto 3s, auto cover, linked: '+JSON.stringify(up));
 // استخدام نفس الآيرت لمبلغ آخر + نسخ
 await p.evaluate(()=>{ window.ask=async()=>"100" }); await p.click(`[data-dncopyto="${t50}"]`); await p.waitForTimeout(250);
 ok(await p.evaluate(id=>{ const a=dnTiers().find(r=>r.id===id), c=dnTiers().find(r=>r.cond.value===100); return c.alertId===a.alertId },t50),'copy settings/alert to $100');
 // تخصيص: سحب النص
 await p.click(`[data-dnedit="${t50}"]`); await p.waitForTimeout(300);
 const cv=await p.$('[data-dncanvas] [data-dnlay="title"]'); const bb=await (await p.$('[data-dncanvas]')).boundingBox(); const tb=await cv.boundingBox();
 await p.mouse.move(tb.x+tb.width/2,tb.y+tb.height/2); await p.mouse.down(); await p.mouse.move(bb.x+bb.width*0.25,bb.y+bb.height*0.2,{steps:6}); await p.mouse.up(); await p.waitForTimeout(200);
 const pos=await p.evaluate(id=>dnTiers().find(r=>r.id===id).over.cfg.title,t50); ok(pos&&Math.abs(pos.x-25)<3&&Math.abs(pos.y-20)<3,'drag the name text on the clip: '+JSON.stringify(pos&&{x:pos.x,y:pos.y}));
 await p.$eval('[data-dncol="sub"]',e=>{ e.value="#00ff88"; e.dispatchEvent(new Event("change",{bubbles:true})) }); await p.waitForTimeout(200);
 ok(await p.evaluate(id=>dnTiers().find(r=>r.id===id).over.cfg.sub.color==="#00ff88",t50),'amount color independent');
 ok(await p.evaluate(id=>dnTiers().find(r=>r.id===id).over.durationSec==null,t50)&&await p.$(`[data-dndur="auto"]:checked`),'duration auto (full clip) by default');
 // الحد الأدنى + التجربة
 await p.fill('[data-dnmin]','2'); await p.dispatchEvent('[data-dnmin]','change');
 await p.fill('[data-dntname]','بطوط'); await p.dispatchEvent('[data-dntname]','input');
 await p.fill('[data-dntcustom]','17'); await p.dispatchEvent('[data-dntcustom]','input'); await p.click('[data-dntest]'); await p.waitForTimeout(900);
 let txt=await p.evaluate(()=>[...document.querySelectorAll('#dn-pv .ab-tx,#dn-pv .fa-l1,#dn-pv .fa-name,#dn-pv [class*=fa-]')].map(e=>e.textContent).join('|'));
 ok(/بطوط/.test(txt)&&/17/.test(txt),'test $17 plays the $10 alert with name & amount: '+txt);
 ok(await p.evaluate(()=>R.DN.list.length===0),'test not counted in donation stats');
 await p.waitForTimeout(6500);
 await p.click('[data-dntamt="50"]'); await p.waitForTimeout(150); await p.click('[data-dntest]'); await p.waitForTimeout(900);
 const v50=await p.evaluate(()=>{ const v=document.querySelector('#dn-pv video'); const t=document.querySelector('#dn-pv .ab-tx'); return {vid:!!v,color:document.querySelector('#dn-pv .ab-tx-sub')&&getComputedStyle(document.querySelector('#dn-pv .ab-tx-sub')).color,left:t&&t.style.left} });
 ok(v50.vid&&v50.color==="rgb(0, 255, 136)"&&v50.left==="25%",'test $50 plays the uploaded clip with customized text position/color');
 await p.waitForTimeout(4500);
 await p.fill('[data-dntcustom]','1'); await p.dispatchEvent('[data-dntcustom]','input'); await p.click('[data-dntest]'); await p.waitForTimeout(500);
 ok(await p.evaluate(()=>/لا توجد شريحة/.test(document.getElementById("toast").textContent)),'below minimum: clear message, no alert');
 // OBS
 await p.click('[data-dnaddbox]'); await p.waitForTimeout(300); await p.click('[data-dncopy]'); await p.waitForTimeout(300);
 const url=await p.evaluate(()=>navigator.clipboard.readText()); ok(/overlay/.test(url)&&await p.evaluate(()=>L().widgets.some(w=>w.type==="abox"&&w.abEvents.join()==="donation")),'Donation Alert Box widget + OBS link copied');
 ok((await p.$$('.dn-step.done')).length===2,'steps 2 & 4 done; step 3 waits for alerts on every tier; step 1 needs a connected account');
 await p.evaluate(()=>{ dnTiers().forEach(r=>{ if(!r.alertId) r.alertId='tpl:duck_classic' }); renderPage(true) }); await p.waitForTimeout(200); ok((await p.$$('.dn-step.done')).length===3,'step 3 checked once every tier has an alert');
 // OBS يعرض الدعم الحقيقي من نفس الرابط (محاكاة حدث مؤكد عبر المحرك)
 const o=await ctx.newPage(); await o.goto(url); await o.waitForTimeout(600);
 ok(await o.evaluate(()=>getComputedStyle(document.body).backgroundColor==="rgba(0, 0, 0, 0)"),'OBS link transparent');
 await p.evaluate(()=>{ const r=roomEvent(R,{type:"donation",verified:true,id:"streamlabs:x1",provider:"streamlabs",amount:120,currency:"USD",name:"سارة"},Date.now()); for(const m of r.out){ receive(m,true); bus&&bus.postMessage(m) } });
 await o.waitForTimeout(1200); const ot=await o.evaluate(()=>[...document.querySelectorAll('.ab-tx')].map(e=>e.textContent).join('|')); ok(/سارة/.test(ot)&&/120/.test(ot),'real $120 donation shows on the OBS box ($100 tier): '+ot);
 // الترتيب بالسحب
 const ids=await p.evaluate(()=>[...document.querySelectorAll('[data-dndrag]')].map(e=>e.dataset.dndrag)); ok(ids.length>=6,'tier cards draggable');
 // الجوال
 const m=await (await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true})).newPage(); await m.goto('file:///home/claude/najd/demo/index.html'); await m.evaluate(()=>{ S.page="donalerts"; renderPage() }); await m.waitForTimeout(400);
 ok(await m.evaluate(()=>getComputedStyle(document.querySelector('.dn-grid')).gridTemplateColumns.split(' ').length===1&&document.documentElement.scrollWidth<=400),'mobile: single column, no horizontal overflow');
 ok(errs.length===0,'no page errors '+errs.slice(0,3).join(' / '));
 await b.close();
})();
