// شارة PRO في مكتبة الأهداف + القفل بعد انتهاء التجربة + عرض رسالة رفض الخادم عند الحفظ
const { chromium } = require('/opt/npm-tools/node_modules/playwright'); const path=require('path');
let pass=0,fail=0; const ok=(c,m)=>{ c?pass++:(fail++,console.log('FAIL',m)) };
async function run(sub,persistErr){ const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']}); const p=await (await b.newContext({viewport:{width:1400,height:900}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.route('**/api/**',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(r.request().url().includes('/api/billing')?{status:sub,cfg:{trialDays:30,priceUsd:7,months:[1,3,12],perks:[],limits:{}}}:{})}));
 await p.addInitScript(([sub,persistErr])=>{ window.B6O6_CONFIG={layouts:null,activeLayoutId:null,settings:{},profile:{name:"اختبار",sub},providers:{},donCfg:{},bots:null,socials:null,wsUrl:"",room:"r1",key:"k",persist:async()=>{ if(persistErr) throw new Error(persistErr); return {ok:true} },api:async()=>({}),overlayURL:()=>"#"} },[sub,persistErr]);
 await p.goto('file://'+path.resolve(__dirname,'../demo/index.html')); await p.waitForTimeout(500); return {b,p,errs} }
(async()=>{
 // 1) منتهي: شارة 🔒 PRO + رفض الاختيار
 { const {b,p,errs}=await run({state:"expired",label:"انتهت فترة التجربة",full:false});
  await p.evaluate(()=>{ const l=S.layouts.find(x=>x.id===S.active)||S.layouts[0]; l.widgets.push(Object.assign(newWidget("sgoal"),{id:"g1"})); });
  await p.click('.nav [data-go="library"]'); await p.click('[data-libtab="goals"]'); await p.waitForTimeout(600);
  const badges=await p.$$eval('#lib .libc.is-pro .probadge',e=>e.map(x=>x.textContent)); ok(badges.length===12&&badges.every(t=>/🔒/.test(t)&&/PRO/.test(t)),'12 locked PRO badges ('+badges.length+')');
  ok(await p.$$eval('#lib .libc:not(.is-pro) .probadge',e=>e.length)===0,'free designs have no badge');
  await p.click('#lib .libc[data-pick="rHeart"]'); await p.waitForTimeout(300);
  ok(await p.evaluate(()=>!JSON.stringify(S.layouts).includes('"rHeart"')),'locked pick not applied'); ok(/PRO/.test(await p.evaluate(()=>document.body.innerText)),'lock toast shown');
  ok(errs.length===0,'no errors '+errs.join('|')); await b.close() }
 // 2) معلّق (لم يبدأ البث): مفتوح + رسالة الاشتراك
 { const {b,p,errs}=await run({state:"pending",label:"التجربة (30 يوماً) تبدأ مع أول بث مباشر",full:true,trialDays:30});
  await p.evaluate(()=>{ const l=S.layouts.find(x=>x.id===S.active)||S.layouts[0]; l.widgets.push(Object.assign(newWidget("sgoal"),{id:"g1"})); S.libTarget="g1" });
  await p.click('.nav [data-go="library"]'); await p.click('[data-libtab="goals"]'); await p.waitForTimeout(600);
  const badges=await p.$$eval('#lib .libc.is-pro .probadge',e=>e.map(x=>x.textContent)); ok(badges.length===12&&badges.every(t=>!/🔒/.test(t)),'pending: unlocked PRO badges');
  await p.click('#lib .libc[data-pick="rHeart"]'); await p.waitForTimeout(300); ok(await p.evaluate(()=>JSON.stringify(S.layouts).includes('"rHeart"')),'pending: pro pick applied');
  await p.click('.nav [data-go="billing"]').catch(()=>{}); await p.waitForTimeout(500); ok(/تبدأ تلقائياً مع أول بث/.test(await p.evaluate(()=>document.body.innerText)),'billing page explains pending trial');
  ok(errs.length===0,'no errors '+errs.join('|')); await b.close() }
 // 3) رسالة رفض الخادم تظهر للمستخدم بدل «تحقق من الاتصال»
 { const {b,p}=await run({state:"trial",full:true,daysLeft:3},"هذا التصميم من PRO — اشترك أو ابدأ تجربتك لاستخدامه (rFox)");
  await p.evaluate(()=>save()); await p.waitForTimeout(900); ok(/هذا التصميم من PRO/.test(await p.evaluate(()=>document.body.innerText)),'server pro_design message surfaced'); await b.close() }
 console.log(`pro-ui: ${pass} passed, ${fail} failed`); process.exit(fail?1:0) })();
