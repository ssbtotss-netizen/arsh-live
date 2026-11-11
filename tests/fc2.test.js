const { chromium } = require('/opt/npm-tools/node_modules/playwright');
(async()=>{
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:1440,height:1000}}); await ctx.grantPermissions(['clipboard-read','clipboard-write']);
 const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file:///home/claude/najd/demo/index.html'); await p.evaluate(()=>localStorage.clear()); await p.goto('file:///home/claude/najd/demo/index.html');
 const n=await p.evaluate(()=>({all:FC_DESIGNS.length,u:new Set(FC_DESIGNS.map(d=>d.id)).size,prem:FC_DESIGNS.filter(d=>d.cat==="premium").length,css:FC_DESIGNS.filter(d=>d.n>10).every(d=>FC_XCSS.some(c=>c.includes(".fcd-"+d.id+" "))),gs:FC_GOAL_STYLES.filter(x=>x[0]!=="none").length,nums:FC_DESIGNS.map(d=>d.n).sort((a,b)=>a-b).join()===Array.from({length:60},(_,i)=>i+1).join()}));
 ok(n.all===60&&n.u===60&&n.prem===25&&n.nums,'60 unique designs (25 Premium Mini), numbered 1–60');
 ok(n.css,'every new design has its own CSS'); ok(n.gs===20,'20 goal fill styles');
 // حساب الهدف من نقطة البداية
 const g=await p.evaluate(()=>fcGoal({goalOn:true,goal:3000,goalStart:2500},2753)); ok(g.remaining===247&&Math.abs(g.pct-50.6)<.05,'goal progress from start: 247 left, 50.6%');
 const g2=await p.evaluate(()=>fcGoal({goalOn:true,goal:3000,goalStart:2500,goalAuto:true,goalStages:"3500,4000,5000,10000"},3600)); ok(g2.start===3500&&g2.target===4000&&g2.level===2,'auto stages: next stage starts from previous target');
 // عداد بتصميم Premium + شكل تعبئة قلب
 await p.click('.nav [data-go="followers"]'); await p.click('[data-fcadd="tiktok"]'); await p.waitForTimeout(200);
 await p.fill('[data-fcset-in="tiktok"]','2753'); await p.click('[data-fcset="tiktok"]'); await p.waitForTimeout(200);
 const id=await p.evaluate(()=>{ const w=window.__arsh.L().widgets.find(x=>x.type==="fcount"); Object.assign(w,{design:"pmDarkRed",goalOn:true,goal:3000,goalStart:2500,goalStyle:"heart",goalRemain:true,goalAuto:true,goalStep:250,handle:"B6O6",w:.3,h:.3}); window.__arsh.save&&window.__arsh.save(); return w.id });
 await p.click('.nav [data-go="studio"]'); await p.waitForTimeout(600);
 const st=await p.evaluate(id=>{ const e=document.querySelector(`.stage [data-id="${id}"]`)||[...document.querySelectorAll('.stage .fcw')][0]; const gf=e&&e.querySelector('.fc-shape .gf'); return {has:!!gf,tr:gf&&gf.style.transform,txt:e&&e.querySelector('.fc-gt').textContent} },id);
 ok(st.has&&/scaleY\(0\.50/.test(st.tr),'heart fills to real progress ('+st.tr+')');
 ok(/باقي/.test(st.txt)&&/247/.test(st.txt),'remaining shown: '+st.txt);
 await p.screenshot({path:'/tmp/fc-studio.png'});
 // المكتبة: فلاتر + مفضلة + نسخ رابط OBS
 await p.click('.nav [data-go="library"]'); await p.click('[data-libtab="fcount"]'); await p.waitForTimeout(800);
 await p.click('[data-fcf="cat:premium"]'); await p.waitForTimeout(600); ok(await p.locator('#lib .libc').count()===25,'Premium Mini filter = 25');
 await p.screenshot({path:'/tmp/fc-premium.png',fullPage:false});
 await p.click('[data-fcf="transparent"]'); await p.waitForTimeout(400); const tr=await p.locator('#lib .libc').count(); ok(tr>=10&&tr<60,'transparent filter: '+tr);
 await p.click('[data-fcf="transparent"]'); await p.click('[data-fcg="0"]'); await p.waitForTimeout(500); ok(await p.locator('#lib .libc .fc-goal').count()===0,'"بدون هدف" previews compact cards');
 await p.click('[data-fcfav="pmUltimate"]'); await p.click('[data-fcfavonly]'); await p.waitForTimeout(400); ok(await p.locator('#lib .libc').count()===1,'favorites');
 await p.click('[data-fcobs="pmUltimate"]'); await p.waitForTimeout(300);
 const url=await p.evaluate(()=>navigator.clipboard.readText()); const ws=await p.evaluate(()=>window.__arsh.L().widgets.filter(w=>w.type==="fcount").map(w=>w.design));
 ok(/only=/.test(url)&&ws.includes("pmUltimate"),'OBS link per design (independent widget): '+url.slice(-40));
 // OBS: خلفية شفافة
 const ob=await b.newPage(); await ob.goto(url.replace(/^.*#/,'file:///home/claude/najd/demo/index.html#')); await ob.waitForTimeout(900);
 ok(await ob.evaluate(()=>getComputedStyle(document.body).backgroundColor==='rgba(0, 0, 0, 0)'&&!document.querySelector('.nav')),'OBS page: transparent, no dashboard UI');
 ok(errs.length===0,'no page errors '+errs.join(' | '));
 await b.close();
})();
