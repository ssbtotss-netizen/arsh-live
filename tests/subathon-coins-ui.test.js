// واجهة السبثون — عملات وهدايا TikTok: الأقسام، كتالوج الهدايا، قواعد العملات، طريقة الحساب، تجربة هدية منفصلة، أحداث هدايا حقيقية (مسار الغرفة)، تحديث الصفحة، ورابط البث
const {chromium}=require('/opt/npm-tools/node_modules/playwright'); const path=require('path');
let pass=0,fail=0; const ok=(c,m)=>{ c?pass++:(fail++,console.log('FAIL',m)) };
(async()=>{ const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'}); const ctx=await b.newContext({viewport:{width:1440,height:1000}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept());
 await p.goto('file://'+path.resolve(__dirname,'../demo/index.html')); await p.evaluate(()=>localStorage.clear()); await p.reload();
 // قائمة هدايا TikTok الحقيقية كما يرسلها الخادم بعد الاتصال (صور + قيم)
 const CAT=[{id:5655,name:"Rose",diamonds:1,image:"https://p16-webcast.tiktokcdn.com/img/test/rose.png"},{id:5487,name:"أحبني",diamonds:1,image:""},{id:6369,name:"Lion",diamonds:29999,image:""},{id:5879,name:"Doughnut",diamonds:30,image:""},{id:6064,name:"Giraffe",diamonds:500,image:""}];
 await p.evaluate(c=>window.__arsh.receive({t:"gifts",gifts:c}),CAT);
 await p.click('.nav [data-go="subathon"]'); await p.waitForTimeout(500);
 const txt=await p.evaluate(()=>document.body.innerText);
 ok(/التحكم/.test(txt)&&/قواعد العملات/.test(txt)&&/قواعد الهدايا/.test(txt)&&/تصميم عداد السبثون/.test(txt)&&/سجل التفاعلات/.test(txt)&&/طريقة الحساب/.test(txt),'five sections + calculation method');
 ok(/صور حقيقية لـ 1 هدية/.test(txt),'real image count = gifts that have a real image only');
 await p.click('[data-sapick]'); await p.waitForTimeout(300);
 const pk=await p.evaluate(()=>{ const it=[...document.querySelectorAll('.sa2-pi')], f=n=>it.find(e=>e.innerText.includes(n)); const r=f('Rose'), l=f('Lion'); return {n:it.length, rose:!!(r&&(r.querySelector('img[src^="https://"]')||/تعذر تحميل/.test(r.querySelector('.sa-ic').title))), lion:!!(l&&l.querySelector('.sa-fb')&&!l.querySelector('img')&&/لا تتوفر صورة/.test(l.querySelector('.sa-ic').title))} });
 ok(pk.n>=5&&pk.rose&&pk.lion,'gift picker: real image where available (broken → fallback), clear fallback icon otherwise '+JSON.stringify(pk));
 await p.evaluate(()=>{ for(const d of document.querySelectorAll('details.sa2-det')) d.open=true }); await p.waitForTimeout(100);
 ok(/«أحبني» هدية مستقلة/.test(await p.evaluate(()=>document.body.innerText)),'أحبني stated as a separate gift (not donation/taps)');
 // إعداد القواعد من الواجهة
 await p.click('[data-coinadd="examples"]'); await p.waitForTimeout(400);
 const coins=await p.evaluate(()=>window.__arsh.R().C.subathon.rules.list.filter(r=>r.kind==="coins").map(r=>[r.mode,r.coins,r.ms]));
 ok(coins.length===6&&coins[0].join()==="rate,1,1000"&&coins.some(c=>c.join()==="tier,10000,3600000"),'example coins table: 1 coin=1s … 10,000=1h');
 const setEditor=async(sec)=>{ await p.evaluate(sec=>{ const el=document.querySelector('.sa2-edit'); const a=el.querySelector('[data-rk="amt:ms"]'), u=el.querySelector('[data-rk="unit:ms"]'); u.value="1000"; a.value=String(sec); a.dispatchEvent(new Event('change',{bubbles:true})) },sec); await p.waitForTimeout(300) };
 for(const [id,sec] of [[5655,5],[5487,10],[6064,600],[6369,1800]]){
  if(!(await p.$('.sa2-pick'))) { await p.click('[data-sapick]'); await p.waitForTimeout(250) }
  const has=await p.$(`[data-giftadd="${id}"]`);
  if(has){ await p.click(`[data-giftadd="${id}"]`); await p.waitForTimeout(350) }
  else { const rid=await p.evaluate(id=>window.__arsh.R().C.subathon.rules.list.find(r=>r.kind==="gift"&&r.giftId===id).id,id); await p.click(`[data-saedit="${rid}"]`); await p.waitForTimeout(300) }
  ok(!!(await p.$('.sa2-edit')),`editor opens for ${id}`); await setEditor(sec) }
 const gr=await p.evaluate(()=>Object.fromEntries(window.__arsh.R().C.subathon.rules.list.filter(r=>r.kind==="gift"&&[5655,5487,6064,6369].includes(r.giftId)).map(r=>[r.giftId,r.ms])));
 ok(gr[5655]===5000&&gr[5487]===10000&&gr[6064]===600000&&gr[6369]===1800000,'gift rules set from UI: '+JSON.stringify(gr));
 await p.click('[data-saeditclose]'); await p.waitForTimeout(300);
 const cardTxt=await p.evaluate(()=>[...document.querySelectorAll('.sa2-gc')].map(e=>e.innerText.replace(/\s+/g," ")).join(" | "));
 ok(/كل Rose = \+5 ثوانٍ/.test(cardTxt)&&/كل Lion = \+30 دقيقة/.test(cardTxt)&&/29,999 كوين/.test(cardTxt)&&/مفعّلة/.test(cardTxt),'gift cards: name, coin value, rule text, status → '+cardTxt.slice(0,160));
 ok(await p.$$eval('.sa2-gc input:not([type=checkbox])',e=>e.length)===0,'no input fields inside the main gift cards');
 // تجربة هدية من البطاقة — لا تلمس العداد
 await p.click('[data-sa-op="start"]'); await p.waitForTimeout(300);
 const rem=()=>p.evaluate(()=>{ const s=window.__arsh.R().C.subathon; return s.status==="running"?s.endsAt-Date.now():s.remainingMs });
 const lionId=await p.evaluate(()=>window.__arsh.R().C.subathon.rules.list.find(r=>r.giftId===6369).id);
 const r0=await rem(); await p.click(`[data-sagtest="${lionId}"]`); await p.waitForTimeout(300);
 ok(/\+30:00|30 دقيقة|\+30د|30د/.test(await p.textContent('.sa2-gc-t').catch(()=>"")),'card test shows result: '+await p.textContent('.sa2-gc-t').catch(()=>""));
 ok(Math.abs((await rem())-r0)<1500,'card test does not change the real counter');
 // أحداث هدايا حقيقية (نفس مسار الغرفة) + رابط بث مفتوح
 await p.evaluate(()=>{ const l=window.__arsh.L(); if(!l.widgets.some(w=>w.type==="subathon")) window.__arsh.addWidget("subathon"); window.__arsh.save(); window.__arsh.pushLayout() });
 const sw=await p.evaluate(()=>window.__arsh.L().widgets.find(w=>w.type==="subathon").id);
 const url=await p.evaluate(id=>window.__arsh.overlayURL(window.__arsh.L(),id),sw); const o=await ctx.newPage(); await o.goto(url); await o.waitForTimeout(1200);
 const ovTime=()=>o.evaluate(()=>{ const t=document.querySelector('.ck-time'); if(!t) return null; const s=t.textContent.replace(/[^\d:]/g,""), q=s.split(":").map(Number); return q.length===3?q[0]*3600+q[1]*60+q[2]:q[0]*60+q[1] });
 const g=(name,id,dia,count=1)=>p.evaluate(([name,id,dia,count])=>window.__arsh.send({t:"sim",ev:{type:"gift",id:"g"+Math.random(),user:{id:"u"+Math.random(),name:"مشاهد"},gift:name,giftId:id,diamonds:dia,value:dia*count,count}}),[name,id,dia,count]);
 const step=async(fn,label,expMs)=>{ const a=await rem(), t0=Date.now(); await fn(); await p.waitForTimeout(350); const d=(await rem())-a+(Date.now()-t0); ok(Math.abs(d-expMs)<1600,`${label}: ${Math.round(d/1000)}s (expected ${expMs/1000}s)`); };
 await step(()=>g("Rose",5655,1),"🌹 rose",5000);
 await step(()=>g("أحبني",5487,1),"❤️ أحبني",10000);
 await step(()=>g("Lion",6369,29999),"🦁 high value Lion",1800000);
 await step(async()=>{ for(let i=0;i<6;i++) await g("Rose",5655,1) },"6 consecutive roses",30000);
 await step(()=>g("Doughnut",5879,30,5),"coins (no gift rule): Doughnut ×5 = 150 coins → tier ≥100 = 1m (tier beats rate, per the table)",60000);
 await step(()=>g("Rose2",5656,1,7),"coins rate: 7 coins (below every tier) → 1 coin = 1s → 7s",7000);
 await step(()=>g("Planet",99999,15000),"coins tier: 15,000 coins (no gift rule) → ≥10,000 tier = 1h",3600000);
 await step(()=>p.click('[data-sa-add="300000"]'),"manual +5m",300000);
 await step(()=>p.click('[data-sa-add="-60000"]'),"manual −1m",-60000);
 // قاعدة خصم
 { const gid=await p.evaluate(()=>window.__arsh.R().C.subathon.rules.list.find(r=>r.giftId===6064).id); await p.click(`[data-saedit="${gid}"]`); await p.waitForTimeout(300);
  await p.evaluate(()=>{ const s=document.querySelector('.sa2-edit [data-rk="dir"]'); s.value="-1"; s.dispatchEvent(new Event('change',{bubbles:true})) }); await p.waitForTimeout(300);
  const gt=await p.evaluate(()=>document.querySelector('.sa2-gc.sel').innerText.replace(/\s+/g," ")); ok(/كل Giraffe = −10 دقائق/.test(gt),'subtract rule shown with − sign: '+gt); }
 await step(()=>g("Giraffe",6064,500),"🦒 Giraffe set to subtract",-600000);
 // تغيير القواعد أثناء البث + الطريقة
 await p.evaluate(()=>{ for(const d of document.querySelectorAll('details.sa2-det')) d.open=true }); await p.selectOption('select[data-sa="rules.giftMode"]','coins'); await p.waitForTimeout(400);
 await step(()=>g("Lion",6369,29999),"method=coins: Lion → tier 1h (gift rule ignored, not both)",3600000);
 await p.evaluate(()=>{ for(const d of document.querySelectorAll('details.sa2-det')) d.open=true }); await p.selectOption('select[data-sa="rules.giftMode"]','gifts'); await p.waitForTimeout(400);
 await step(()=>g("Doughnut",5879,30,5),"method=gifts: gift without rule adds nothing",0);
 // الرابط المفتوح يتحدث
 await o.waitForTimeout(800); const ot=await ovTime(), dt=Math.round((await rem())/1000); ok(ot!=null&&Math.abs(ot-dt)<=3,`stream link counter matches (${ot}s vs ${dt}s)`);
 // استمرار بعد تحديث الصفحة
 const before=await rem(); await p.reload(); await p.waitForTimeout(800); const after=await rem(); ok(Math.abs(before-after)<4000&&await p.evaluate(()=>window.__arsh.R().C.subathon.status)==="running",'counter + rules persist after refresh');
 ok(await p.evaluate(()=>window.__arsh.R().C.subathon.rules.giftMode)==="gifts",'method persisted');
 ok(errs.length===0,'no page errors '+errs.slice(0,3).join('|')); console.log(`subathon-coins-ui: ${pass} passed, ${fail} failed`); await b.close(); process.exit(fail?1:0) })();
