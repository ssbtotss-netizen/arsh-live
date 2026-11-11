const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const url='file:///home/claude/najd/demo/index.html';
(async()=>{
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:1440,height:1000}}); const p=await ctx.newPage();
 const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto(url); await p.click('.nav [data-go="subathon"]'); await p.waitForTimeout(200);
 const rem=()=>p.evaluate(()=>{const s=window.__arsh.R().C.subathon; return s.status==='running'?s.endsAt-Date.now():s.remainingMs});
 await p.click('[data-sa-op="start"]'); await p.waitForTimeout(1200);
 const r0=await rem(); ok(r0<7200000&&r0>7190000,'subathon started and counting ('+r0+')');
 await p.click('[data-sa-add="300000"]'); await p.waitForTimeout(100);
 ok(Math.abs((await rem())-(r0+300000))<1500,'+5 min button');
 await p.click('[data-sa-add="-60000"]'); ok(Math.abs((await rem())-(r0+240000))<1500,'-1 min button');
 const g0=await rem(); await p.evaluate(()=>window.__arsh.send({t:'sim',ev:{id:'dup1',type:'gift',user:{id:'x',name:'x'},gift:'Lion',giftId:6369,diamonds:29999,value:29999,count:1}}));
 await p.evaluate(()=>window.__arsh.send({t:'sim',ev:{id:'dup1',type:'gift',user:{id:'x',name:'x'},gift:'Lion',giftId:6369,diamonds:29999,value:29999,count:1}}));
 ok(Math.abs((await rem())-(g0+1800000))<1500,'lion adds 30 min exactly once (duplicate ignored)');
 // disable gifts method from UI
 await p.uncheck('input[data-sa="rules.auto"]'); await p.waitForTimeout(150);
 const g1=await rem(); await p.click('#testbar [data-sim="gift"]'); await p.waitForTimeout(100);
 ok(Math.abs((await rem())-g1)<1500,'automatic rules switched off from UI → no time added');
 await p.check('input[data-sa="rules.auto"]'); await p.waitForTimeout(150);
 // edit gift table: rose -> 60 sec
 const roseId=await p.evaluate(()=>window.__arsh.R().C.subathon.rules.list.find(r=>r.giftId===5655).id); await p.fill(`[data-rl="${roseId}"][data-rk="amt:ms"]`,'60'); await p.press(`[data-rl="${roseId}"][data-rk="amt:ms"]`,'Tab'); await p.waitForTimeout(250);
 const g2=await rem(); await p.evaluate(()=>window.__arsh.send({t:'sim',ev:{id:'r9',type:'gift',user:{id:'y',name:'y'},gift:'Rose',giftId:5655,diamonds:1,value:3,count:3}}));
 ok(Math.abs((await rem())-(g2+180000))<1500,'edited rose = 60s × streak of 3');
 // overlay shows subathon and +time effect
 await p.click('.nav [data-go="obs"]'); await p.waitForTimeout(150);
 const href=await p.locator('a[href*="#/overlay"]').first().getAttribute('href');
 const ov=await ctx.newPage(); ov.on('pageerror',e=>errs.push('ov '+e.message)); await ov.setViewportSize({width:540,height:960}); await ov.goto(href); await ov.waitForTimeout(600);
 const tOv=await ov.locator('.t-subathon .ck-time').textContent();
 const tExp=await p.evaluate(()=>{const s=window.__arsh.R().C.subathon;const ms=s.endsAt-Date.now();const x=Math.ceil(ms/1000);const z=n=>String(n).padStart(2,'0');return z(Math.floor(x/3600))+':'+z(Math.floor(x/60)%60)+':'+z(x%60)});
 ok(Math.abs(toS(tOv)-toS(tExp))<=2,'overlay subathon shows same time '+tOv+' vs '+tExp);
 await p.evaluate(()=>window.__arsh.SIM.saAdd()); await ov.waitForTimeout(300);
 ok(await ov.locator('.t-subathon .tfx').count()>=1,'overlay shows +5 دقائق effect: '+(await ov.locator('.t-subathon .tfx').first().textContent().catch(()=>'')));
 await ov.screenshot({path:'p2-overlay.png',omitBackground:true});
 // persistence after reload (time keeps going, not lost)
 const before=await rem(); await p.reload(); await p.waitForTimeout(1500);
 const after=await rem(); ok(after<before&&before-after<4000,'subathon survives reload and kept counting');
 // pause freezes
 await p.click('.nav [data-go="subathon"]'); await p.click('[data-sa-op="pause"]'); const pz=await rem(); await p.waitForTimeout(1500); ok((await rem())===pz,'pause freezes time');
 await p.click('[data-sa-op="resume"]');
 // logs recorded
 const logs=await p.evaluate(()=>window.__arsh.R().logs.length); ok(logs>=6,'operations logged ('+logs+')');
 // timers: create + run two simultaneously
 await p.click('.nav [data-go="timers"]'); await p.fill('#tmName','وقت السحب'); await p.fill('#tmMin','3'); await p.click('[data-tm-create]'); await p.waitForTimeout(200);
 const ids=await p.evaluate(()=>window.__arsh.R().C.timers.map(t=>t.id)); ok(ids.length===3,'timer created');
 await p.click(`[data-tm="${ids[2]}"][data-tmop="start"]`); await p.click(`[data-tm="stream"][data-tmop="start"]`); await p.waitForTimeout(1100);
 await p.click(`[data-tm="stream"][data-tmop="pause"]`);
 const st=await p.evaluate(()=>window.__arsh.R().C.timers.map(t=>t.status)); ok(st[0]==='paused'&&st[2]==='running','timers independent '+st);
 await p.click(`[data-tm-add-w="${ids[2]}"]`); await p.waitForTimeout(200);
 ok(await p.evaluate(id=>window.__arsh.L().widgets.some(w=>w.type==='timer'&&w.timerId===id),ids[2]),'timer added to screen bound to its id');
 await p.screenshot({path:'p2-timers.png'});
 // library clocks
 await p.click('.nav [data-go="library"]'); await p.click('[data-libtab="clocks"]'); await p.waitForTimeout(300);
 ok(await p.locator('.libc').count()===21,'21 clock designs');
 await p.screenshot({path:'p2-clocks.png',fullPage:true});
 // smart guides
 await p.click('.nav [data-go="studio"]'); await p.waitForTimeout(200);
 const el=p.locator('#stage .wd.t-likes'); const bb=await el.boundingBox();
 await p.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2); await p.mouse.down(); await p.mouse.move(bb.x+bb.width/2-3,bb.y+bb.height/2+2,{steps:3});
 ok(await p.locator('#stage .guide').count()>0,'smart alignment guide shown while dragging'); await p.mouse.up();
 // topN 20
 await p.click('#stage .wd.t-likes'); await p.selectOption('#props select[data-wf="topN"]','20'); await p.waitForTimeout(150);
 ok(await p.locator('#stage .wd.t-likes .r').count()===20,'20 positions');
 ok(errs.length===0,'no errors '+errs.join('|'));
 await b.close();
 function toS(t){const a=t.split(':').map(Number);return a[0]*3600+a[1]*60+a[2]}
})();
