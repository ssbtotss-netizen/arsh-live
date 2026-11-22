// واجهة «سجل الهدايا» في إعدادات السبثون + احتساب سلسلة 30 وردة داخل حزمة اللوحة (نفس محرك الخادم)
const {chromium}=require('/opt/npm-tools/node_modules/playwright'); const path=require('path');
let pass=0,fail=0; const ok=(c,m)=>{ c?pass++:(fail++,console.log('FAIL',m)) };
(async()=>{ const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'}); const p=await (await b.newContext({viewport:{width:1440,height:1000}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+path.resolve(__dirname,'../demo/index.html')); await p.evaluate(()=>localStorage.clear()); await p.reload();
 await p.click('.nav [data-go="subathon"]'); await p.waitForTimeout(400);
 ok(/سجل التفاعلات/.test(await p.evaluate(()=>document.body.innerText)),'interactions log section exists in subathon page');
 ok(/لا توجد هدايا بعد/.test(await p.evaluate(()=>document.querySelector('[data-saglog]').innerText)),'empty state');
 await p.evaluate(()=>{ const A=window.__arsh; A.clockOp("subathon","config",{config:{initialMs:3600000,maxMs:0,rules:{list:[{id:"r_rose",kind:"gift",enabled:true,dir:1,every:1,giftId:5655,giftName:"وردة",ms:5000,minDiamonds:0,perDiamondMs:0,cooldownMs:0,userCooldownMs:0,perMin:0,maxMs:0}],giftMode:"gifts_first"}}}); A.clockOp("subathon","start") });
 await p.waitForTimeout(200);
 const ends0=await p.evaluate(()=>window.__arsh.R().C.subathon.endsAt);
 await p.evaluate(()=>{ let i=0; const g=(cum,end)=>window.__arsh.send({t:"sim",ev:{type:"gift",id:"gift:ui"+(++i),user:{id:"v1",name:"مشاهد"},gift:"Rose",giftId:5655,diamonds:1,value:cum,count:cum,streak:{cum,gc:0,end,type:1,group:"G1"}}});
  for(const n of [1,5,10,20,30]) g(n,false); g(30,true) });
 await p.waitForTimeout(500);
 const ends1=await p.evaluate(()=>window.__arsh.R().C.subathon.endsAt);
 ok(ends1-ends0===150000,'30 roses → +150s in dashboard engine, got +'+(ends1-ends0)/1000);
 const rows=await p.$$eval('[data-saglog] tr',r=>r.slice(1).map(x=>x.innerText.replace(/\s+/g,' ')));
 ok(rows.length===6,'6 rows (5 updates + final), got '+rows.length);
 ok(/مكرر/.test(rows[0])&&/محتسب مسبقاً/.test(rows[0]),'final event row: duplicate + reason');
 ok(/احتُسبت/.test(rows[1])&&/\+50ث/.test(rows[1])&&/مشاهد/.test(rows[1])&&/Rose/.test(rows[1]),'update row: gift, sender, counted, time added → '+rows[1]);
 // رسالة من الخادم (glog) تظهر مباشرة دون إعادة تحميل
 await p.evaluate(()=>window.__arsh.receive({t:"glog",it:{id:"glX",at:Date.now(),user:"Turki",gift:"Lion",giftId:6369,sent:1,counted:1,ms:0,status:"none",why:"لا توجد قاعدة مطابقة لهذه الهدية"}}));
 await p.waitForTimeout(150);
 const top=await p.$eval('[data-saglog] tr:nth-child(2)',e=>e.innerText);
 ok(/Turki/.test(top)&&/بدون وقت/.test(top)&&/لا توجد قاعدة مطابقة/.test(top),'server glog row live with failure reason');
 ok(!errs.length,'no page errors: '+errs.join(' | '));
 await b.close(); console.log(`gift-streak-ui: ${pass} passed, ${fail} failed`); process.exit(fail?1:0) })();
