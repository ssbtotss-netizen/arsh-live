// صفحة الدونيشن بعد توحيد المستويات: نفس مستويات «💵 قائمة الدونيشن» في مكتبة الإشعارات (مصدر واحد)
const { chromium } = require('/opt/npm-tools/node_modules/playwright');
(async()=>{
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const ctx=await b.newContext({viewport:{width:1440,height:1000}}); await ctx.grantPermissions(['clipboard-read','clipboard-write']);
 const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file:///home/claude/najd/demo/index.html'); await p.evaluate(()=>localStorage.clear()); await p.goto('file:///home/claude/najd/demo/index.html');
 await p.click('.nav [data-go="donalerts"]'); await p.waitForTimeout(400);
 ok((await p.$$('.dn-step')).length===4&&(await p.$$('.dn-step.done')).length===1,'4 step cards; only «levels defined» done (4 default levels)');
 ok((await p.$$('[data-dnhelp]')).length>=3&&await p.$('[data-dnguide]'),'help (?) buttons + «كيف أضبط الدونيشن؟»');
 await p.click('[data-dnguide]'); await p.waitForTimeout(200); ok((await p.$$('.dn-gs')).length===8,'step-by-step guide (8 steps)'); await p.click('.modal [data-close]');
 ok((await p.$$eval('.ml-dl b',e=>e.map(x=>x.textContent))).join('|')==='💵 دونيشن بسيط|💵 دونيشن متوسط|💵 دونيشن قوي|💵 دونيشن أسطوري','same 4 donation levels as the alerts library');
 // اختيار مقاطع: المتوسط ← قالب رسمي، الأسطوري ← مقطع مرفوع
 await p.click('[data-dnlib]'); await p.waitForTimeout(300);
 ok(await p.evaluate(()=>S.page==="alerts"&&S.al.mlSec==="don"),'«edit levels» opens 💵 donation section');
 await p.click('[data-ml="pick"][data-k="medium"]'); await p.waitForTimeout(200); await p.click('.modal details:last-of-type summary'); await (await p.$$('.modal details:last-of-type [data-pick]'))[3].click(); await p.waitForTimeout(250);
 ok(await p.evaluate(()=>/^tpl:/.test(S.bots.alerts.lib.don.levels[1].clips[0].alertId)),'official template chosen for medium');
 await p.click('[data-ml="upload"][data-k="legend"]'); await p.waitForTimeout(200);
 await p.setInputFiles('#al-file','/tmp/alfx/mp4_audio.mp4'); for(let i=0;i<60;i++){ if(await p.evaluate(()=>S.al.up&&S.al.up.phase==="done")) break; await p.waitForTimeout(200) }
 await p.evaluate(()=>{ S.al.form.name="أسطوري"; S.al.form.category="money" }); await p.click('[data-alsave]'); await p.waitForTimeout(400);
 const up=await p.evaluate(()=>{ const c=S.bots.alerts.lib.don.levels[3].clips[0]; const a=alLocal().find(x=>x.id===c.alertId); return a&&{vis:a.visibility,ev:a.event,dur:a.durationSec,cover:!!a.coverData,lvl:a.config.lvl} });
 ok(up&&up.vis==="private"&&up.ev==="donation"&&up.dur===3&&up.cover&&up.lvl==="legend",'upload for legendary: private, donation section, auto 3s, auto cover: '+JSON.stringify(up));
 await p.click('[data-ml="clipset"][data-k="legend"]'); await p.waitForTimeout(150);
 await p.$eval('[data-mlf="x"][data-k="legend"]',e=>{ e.value="25"; e.dispatchEvent(new Event("change",{bubbles:true})) }); await p.waitForTimeout(150);
 ok(await p.evaluate(()=>S.bots.alerts.lib.don.levels[3].clips[0].x===25),'clip position saved');
 // التجربة من صفحة الدونيشن
 await p.click('.nav [data-go="donalerts"]'); await p.waitForTimeout(300);
 ok((await p.$$('.dn-step.done')).length===1,'step 3 waits until every enabled level has a clip');
 await p.fill('[data-dntname]','بطوط'); await p.dispatchEvent('[data-dntname]','input');
 await p.fill('[data-dntcustom]','17'); await p.dispatchEvent('[data-dntcustom]','input'); await p.click('[data-dntest]'); await p.waitForTimeout(900);
 let txt=await p.evaluate(()=>[...document.querySelectorAll('#dn-pv .ab-tx,#dn-pv [class*=fa-]')].map(e=>e.textContent).join('|'));
 ok(/بطوط/.test(txt)&&/17/.test(txt),'test $17 plays the medium clip with name & amount: '+txt.slice(0,80));
 ok(await p.evaluate(()=>R.DN.list.length===0),'test not counted in donation stats');
 await p.waitForTimeout(6500);
 await p.click('[data-dntamt="50"]'); await p.waitForTimeout(150); await p.click('[data-dntest]'); await p.waitForTimeout(900);
 const v50=await p.evaluate(()=>{ const r=document.querySelector('#dn-pv .ab-root'); return {vid:!!document.querySelector('#dn-pv video'),left:r&&r.style.left} });
 ok(v50.vid&&v50.left==="25%",'test $50 plays the uploaded legendary clip at its saved position');
 await p.waitForTimeout(4500);
 await p.fill('[data-dntcustom]','0.5'); await p.dispatchEvent('[data-dntcustom]','input'); await p.click('[data-dntest]'); await p.waitForTimeout(500);
 ok(await p.evaluate(()=>/لا توجد شريحة/.test(document.getElementById("toast").textContent)),'below every level: clear message, no alert');
 // OBS
 await p.click('[data-dnaddbox]'); await p.waitForTimeout(300); await p.click('[data-dncopy]'); await p.waitForTimeout(300);
 const url=await p.evaluate(()=>navigator.clipboard.readText()); ok(/overlay/.test(url)&&await p.evaluate(()=>L().widgets.some(w=>w.type==="abox"&&w.abEvents.join()==="donation")),'Donation Alert Box widget + OBS link copied');
 await p.evaluate(()=>{ S.bots.alerts.lib.don.levels.forEach(l=>{ if(!l.clips.length) l.clips.push({id:"cx"+l.id,alertId:"tpl:duck_classic",enabled:true,volume:.8,size:100,x:50,y:50,enter:"popIn",exit:"fadeOut"}) }); renderPage(true) }); await p.waitForTimeout(200);
 ok((await p.$$('.dn-step.done')).length===3,'steps 2, 3, 4 done once every level has a clip');
 const o=await ctx.newPage(); await o.goto(url); await o.waitForTimeout(600);
 ok(await o.evaluate(()=>getComputedStyle(document.body).backgroundColor==="rgba(0, 0, 0, 0)"),'OBS link transparent');
 await p.evaluate(()=>{ syncBots(); const r=roomEvent(R,{type:"donation",verified:true,id:"streamlabs:x1",provider:"streamlabs",amount:120,currency:"USD",name:"سارة"},Date.now()); for(const m of r.out){ receive(m,true); bus&&bus.postMessage(m) } });
 await o.waitForTimeout(1200); const ot=await o.evaluate(()=>{ const r=document.querySelector('.ab-root'); return {tx:[...document.querySelectorAll('.ab-tx')].map(e=>e.textContent).join('|'),vid:!!document.querySelector('video'),left:r&&r.style.left} });
 ok(/سارة/.test(ot.tx)&&/120/.test(ot.tx)&&ot.vid&&ot.left==="25%",'real $120 donation shows the legendary clip on the OBS box: '+JSON.stringify(ot));
 // الجوال
 const m=await (await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true})).newPage(); await m.goto('file:///home/claude/najd/demo/index.html'); await m.evaluate(()=>{ S.page="donalerts"; renderPage() }); await m.waitForTimeout(400);
 ok(await m.evaluate(()=>getComputedStyle(document.querySelector('.dn-grid')).gridTemplateColumns.split(' ').length===1&&document.documentElement.scrollWidth<=400),'mobile: single column, no horizontal overflow');
 await m.evaluate(()=>{ S.page="alerts"; renderPage() }); await m.waitForTimeout(300);
 ok(await m.evaluate(()=>document.documentElement.scrollWidth<=400&&document.querySelectorAll('[data-mlsec]').length>=4),'mobile: alerts library sections fit the screen');
 ok(errs.length===0,'no page errors '+errs.slice(0,3).join(' / '));
 await b.close();
})();
