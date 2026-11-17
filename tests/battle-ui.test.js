// تحدي الفريقين في اللوحة: إضافة العنصر، الإعدادات، تجربة بأحداث تجريبية، العرض على البث، الإنهاء والفائز
const {chromium}=require('/opt/npm-tools/node_modules/playwright'); const path=require('path');
let pass=0,fail=0; const ok=(c,m)=>{ c?pass++:(fail++,console.log('FAIL',m)) };
(async()=>{ const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'}); const p=await b.newPage({viewport:{width:1440,height:1000}}); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept());
 await p.goto('file://'+path.resolve(__dirname,'../demo/index.html')); await p.evaluate(()=>localStorage.clear()); await p.reload();
 await p.click('.nav [data-go="studio"]'); await p.selectOption('select[data-act="addW"]','battle'); await p.waitForTimeout(400);
 ok(await p.evaluate(()=>S.layouts.some(l=>l.widgets.some(w=>w.type==="battle"))),'battle widget added');
 ok(await p.$('[data-btstatus]')!==null,'settings panel shown'); ok(/لم يبدأ/.test(await p.textContent('[data-btstatus]')),'idle status');
 // إعداد: المدة + اسم فريق + هدايا
 await p.fill('[data-btl="dur"]','2'); await p.dispatchEvent('[data-btl="dur"]','change'); await p.waitForTimeout(300);
 await p.fill('[data-btl="name"][data-bteam="a"]','فريق الصقور'); await p.dispatchEvent('[data-btl="name"][data-bteam="a"]','change'); await p.waitForTimeout(300);
 await p.fill('[data-btl="gifts"][data-bteam="b"]','Galaxy، مجرة'); await p.dispatchEvent('[data-btl="gifts"][data-bteam="b"]','change'); await p.waitForTimeout(300);
 const cfg=await p.evaluate(()=>R.C.battle); ok(cfg.durMs===120000&&cfg.teams[0].name==="فريق الصقور"&&cfg.teams[1].gifts.join()==="Galaxy,مجرة",'config saved to room');
 // حدث حقيقي قبل البدء لا يُحسب
 await p.evaluate(()=>send({t:"sim",ev:{type:"gift",id:"pre1",user:{id:"x",name:"x"},gift:"Rose",value:50}})); await p.waitForTimeout(200); ok(await p.evaluate(()=>R.C.battle.teams[0].score)===0,'not counted before start');
 // تجربة
 await p.click('[data-btop="test"]'); await p.waitForTimeout(6500);
 const st=await p.evaluate(()=>({s:R.C.battle.status,t:R.C.battle.testMode,a:R.C.battle.teams[0].score,b:R.C.battle.teams[1].score}));
 ok(st.s==="running"&&st.t,'test battle running'); ok(st.a+st.b>0,'test gifts scored ('+st.a+':'+st.b+')');
 ok(/التحدي يعمل/.test(await p.textContent('[data-btstatus]')),'status updates live');
 // العرض على مسرح الاستوديو
 const ov=await p.evaluate(()=>{ const e=document.querySelector('.wd.t-battle'); return e&&{nm:e.querySelector('.bt-side.a [data-k="nm"]')?.textContent,sc:e.querySelector('.bt-side.a [data-k="sc"]')?.textContent,tm:e.querySelector('[data-k="tm"]')?.textContent,w:e.querySelector('.bt-bar .fa')?.style.width} });
 ok(ov&&ov.nm==="فريق الصقور",'overlay shows team name'); ok(ov&&/^\d\d:\d\d$/.test(ov.tm),'overlay timer '+(ov&&ov.tm)); ok(ov&&parseFloat(ov.w)>0&&parseFloat(ov.w)<100,'tug bar share '+(ov&&ov.w));
 await (await p.$('.wd.t-battle')).screenshot({path:'tests/shot-battle.png'});
 // إنهاء الآن ← فائز
 await p.click('[data-btop="stop"]'); await p.waitForTimeout(600);
 const end=await p.evaluate(()=>({s:R.C.battle.status,w:R.C.battle.winner,win:document.querySelector('.wd.t-battle .bt-win')?.textContent}));
 ok(end.s==="ended"&&end.w,'stopped with winner'); ok(/فاز|تعادل/.test(end.win||''),'winner banner on overlay: '+end.win);
 // تغيير التصميم
 await p.selectOption('select[data-wf="design"]','rVersus'); await p.waitForTimeout(300); ok(await p.evaluate(()=>!!document.querySelector('.wd.t-battle.btd-rVersus .bt-vs')),'VS design renders');
 ok(errs.length===0,'no page errors '+errs.join('|')); console.log(`battle-ui: ${pass} passed, ${fail} failed`); await b.close(); process.exit(fail?1:0) })();
