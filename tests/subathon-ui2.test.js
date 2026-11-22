// واجهة السبثون الجديدة (5 أقسام): لوحة التحكم، قواعد العملات، بطاقات الهدايا، تصميم العداد، سجل التفاعلات + الجوال
const {chromium}=require('/opt/npm-tools/node_modules/playwright'); const path=require('path');
let pass=0,fail=0; const ok=(c,m)=>{ c?pass++:(fail++,console.log('FAIL',m)) };
(async()=>{ const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'}); const ctx=await b.newContext({viewport:{width:1440,height:1000}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept());
 await p.goto('file://'+path.resolve(__dirname,'../demo/index.html')); await p.evaluate(()=>localStorage.clear()); await p.reload();
 await p.evaluate(()=>window.__arsh.receive({t:"gifts",gifts:[{id:5655,name:"Rose",diamonds:1,image:"https://p16-webcast.tiktokcdn.com/img/x/rose.png"},{id:7934,name:"Heart Me",diamonds:1,image:""}]}));
 await p.click('.nav [data-go="subathon"]'); await p.waitForTimeout(500);
 const R=()=>p.evaluate(()=>window.__arsh.R().C.subathon);
 // ترتيب الأقسام: التحكم في الأعلى
 const order=await p.$$eval('.sa2-sec',e=>e.map(x=>x.id)); ok(order.join()==="sa-s1,sa-s2,sa-s3,sa-s4,sa-s5,sa-s6",'section order: '+order.join());
 ok(await p.$$eval('.sa2-nav [data-sajump]',e=>e.length)===6,'quick-jump nav');
 // القسم 1
 const hero=await p.textContent('#sa-s1');
 for(const k of ["الوقت المتبقي","الوقت المضاف أثناء البث","العملات المحتسبة","الهدايا المستقبلة","TikTok LIVE","بدء السبثون","إيقاف مؤقت","استكمال","إنهاء","إضافة وقت","خصم وقت"]) ok(hero.includes(k),'hero has: '+k);
 ok(await p.$eval('#sa-s1 [data-sa-op="pause"]',e=>e.disabled)&&!(await p.$eval('#sa-s1 [data-sa-op="start"]',e=>e.disabled)),'idle: start enabled, pause disabled');
 await p.click('#sa-s1 [data-sa-op="start"]'); await p.waitForTimeout(300);
 ok((await R()).status==="running"&&await p.$eval('#sa-s1 [data-sa-op="start"]',e=>e.disabled),'start → running, start disabled');
 const big1=await p.textContent('.sa2-clock'); await p.waitForTimeout(1300); const big2=await p.textContent('.sa2-clock'); ok(/^\d\d:\d\d:\d\d$/.test(big1.trim())&&big1!==big2,'big live counter ticks: '+big1+' → '+big2);
 // إضافة/خصم يدوي بالوحدات
 const rem=async()=>{ const s=await R(); return s.endsAt-Date.now() };
 const meas=async(fn)=>{ const a=await rem(), t0=Date.now(); await fn(); await p.waitForTimeout(300); return (await rem())-a+(Date.now()-t0) };
 let d=await meas(async()=>{ await p.fill('#saCustom','1'); await p.selectOption('#saCustomU','3600000'); await p.click('[data-sa-custom="1"]') }); ok(Math.abs(d-3600000)<1500,'manual +1 hour: '+Math.round(d/1000));
 d=await meas(async()=>{ await p.fill('#saCustom','30'); await p.selectOption('#saCustomU','1000'); await p.click('[data-sa-custom="-1"]') }); ok(Math.abs(d+30000)<1500,'manual −30 seconds: '+Math.round(d/1000));
 await p.click('#sa-s1 [data-sa-op="pause"]'); await p.waitForTimeout(250); ok((await R()).status==="paused"&&!(await p.$eval('#sa-s1 [data-sa-op="resume"]',e=>e.disabled)),'pause → resume enabled');
 await p.click('#sa-s1 [data-sa-op="resume"]'); await p.waitForTimeout(250); ok((await R()).status==="running",'resume');
 // القسم 2: قاعدة 100 كوين = +5 دقائق
 await p.evaluate(()=>{ const L=window.__arsh.R().C.subathon.rules.list.filter(r=>r.kind!=="coins"); window.__arsh.clockOp("subathon","config",{config:{rules:{list:L}}}) }); await p.waitForTimeout(150);
 await p.evaluate(()=>window.__arsh.go&&0); await p.click('.nav [data-go="subathon"]'); await p.waitForTimeout(300);
 ok(/لا توجد قواعد عملات بعد/.test(await p.textContent('#sa-s2')),'empty coin rules state');
 await p.selectOption('#saCMode','rate'); await p.fill('#saCN','100'); await p.selectOption('#saCDir','1'); await p.fill('#saCAmt','5'); await p.selectOption('#saCUnit','60000'); await p.click('[data-sacoinsave]'); await p.waitForTimeout(350);
 let co=(await R()).rules.list.filter(r=>r.kind==="coins"); ok(co.length===1&&co[0].coins===100&&co[0].ms===300000&&co[0].mode==="rate"&&co[0].dir===1,'coin rule saved: 100 coins = +5 min');
 ok(/كل 100 كوين = \+5 دقائق/.test((await p.textContent('#sa-s2 .sa2-rules')).replace(/\s+/g," ")),'active coin rule shown clearly');
 await p.click(`[data-sacoinedit="${co[0].id}"]`); await p.waitForTimeout(300); ok(await p.$eval('#saCN',e=>e.value)==="100"&&/تعديل القاعدة/.test(await p.textContent('.sa2-form')),'edit loads rule into form');
 await p.fill('#saCN','200'); await p.selectOption('#saCDir','-1'); await p.fill('#saCAmt','1'); await p.selectOption('#saCUnit','3600000'); await p.click('[data-sacoinsave]'); await p.waitForTimeout(350);
 co=(await R()).rules.list.filter(r=>r.kind==="coins"); ok(co.length===1&&co[0].coins===200&&co[0].ms===3600000&&co[0].dir===-1,'edit updates the same rule (no duplicate): 200 coins = −1 hour');
 ok(/كل 200 كوين = −1 ساعة/.test((await p.textContent('#sa-s2 .sa2-rules')).replace(/\s+/g," ")),'edited rule text with − sign');
 await p.click(`#sa-s2 [data-rdel="${co[0].id}"]`); await p.waitForTimeout(350); ok((await R()).rules.list.filter(r=>r.kind==="coins").length===0,'delete coin rule');
 // القسم 3: بطاقة هدية بصورة حقيقية أو أيقونة بديلة
 await p.click('[data-sapick]'); await p.waitForTimeout(250); await p.click('[data-giftadd="7934"]'); await p.waitForTimeout(350);
 ok(!!(await p.$('.sa2-edit'))&&/Heart Me/.test(await p.textContent('.sa2-edit')),'adding a gift opens its rule editor');
 await p.evaluate(()=>{ const el=document.querySelector('.sa2-edit'); el.querySelector('[data-rk="unit:ms"]').value="1000"; const a=el.querySelector('[data-rk="amt:ms"]'); a.value="20"; a.dispatchEvent(new Event('change',{bubbles:true})) }); await p.waitForTimeout(300);
 ok(/النتيجة: كل Heart Me = \+20 ثانية/.test((await p.textContent('.sa2-edit')).replace(/\s+/g," ")),'editor shows the resulting rule live');
 await p.click('[data-saeditclose]'); await p.waitForTimeout(250);
 const hm=await p.evaluate(()=>{ const c=[...document.querySelectorAll('.sa2-gc')].find(e=>e.innerText.includes("Heart Me")); return c&&{txt:c.innerText.replace(/\s+/g," "),fb:!!c.querySelector('.sa-fb'),img:!!c.querySelector('img'),btn:[...c.querySelectorAll('button')].map(b=>b.textContent.trim())} });
 ok(hm&&hm.fb&&!hm.img,'gift without a real image → clear fallback icon (no wrong image)');
 ok(hm&&/1 كوين/.test(hm.txt)&&/كل Heart Me = \+20 ثانية/.test(hm.txt)&&/مفعّلة/.test(hm.txt),'card: name, coins, rule, status → '+(hm&&hm.txt));
 ok(hm&&hm.btn.some(t=>/تعديل القاعدة/.test(t))&&hm.btn.some(t=>/تجربة/.test(t)),'card buttons: edit + test');
 const rose=await p.evaluate(()=>{ const c=[...document.querySelectorAll('.sa2-gc')].find(e=>e.innerText.includes("Rose")); const i=c&&c.querySelector('.sa-ic'); return i&&(i.querySelector('img[src^="https://"]')?"img":/تعذر تحميل/.test(i.title)?"broken→fallback":"none") }); ok(rose==="img"||rose==="broken→fallback",'rose card uses the real TikTok image ('+rose+')');
 // تعطيل القاعدة من البطاقة
 const hmId=await p.evaluate(()=>window.__arsh.R().C.subathon.rules.list.find(r=>r.giftId===7934).id);
 await p.evaluate(id=>{ const c=document.querySelector(`.sa2-gc[data-rule="${id}"] input[data-rk="enabled"]`); c.checked=false; c.dispatchEvent(new Event('change',{bubbles:true})) },hmId); await p.waitForTimeout(350);
 ok((await R()).rules.list.find(r=>r.id===hmId).enabled===false&&/متوقفة/.test(await p.textContent(`.sa2-gc[data-rule="${hmId}"]`)),'toggle off → status «متوقفة»');
 // القسم 4: التصميم
 ok(!!(await p.$('#sa-s4 #sa-pv .stage'))||!!(await p.$('#sa-s4 [data-add="subathon"]')),'live preview mounted (or add-counter prompt)');
 if(!(await p.$('#sa-s4 #sa-pv'))||await p.$('#sa-s4 [data-add="subathon"]')){ await p.click('#sa-s4 [data-add="subathon"]'); await p.waitForTimeout(400); await p.click('.nav [data-go="subathon"]'); await p.waitForTimeout(400) }
 const wid=await p.$eval('#sa-s4 #sa-pv',e=>e.dataset.wid);
 ok(!!(await p.$(`#sa-s4 [data-copylink="${wid}"]`))&&/نسخ رابط OBS/.test(await p.textContent('#sa-s4')),'copy OBS link button');
 const ds=await p.$$eval('#sa-s4 select[data-wf="design"] option',o=>o.map(x=>x.value)); await p.selectOption('#sa-s4 select[data-wf="design"]',ds[3]); await p.waitForTimeout(400);
 await p.selectOption('#sa-s4 select[data-wf="font"]','changa'); await p.waitForTimeout(300);
 await p.evaluate(()=>{ const c=document.querySelector('#sa-s4 input[data-wf="acc"]'); c.value="#ff3366"; c.dispatchEvent(new Event('change',{bubbles:true})); const r=document.querySelector('#sa-s4 input[data-wf="opacity"]'); r.value="0.7"; r.dispatchEvent(new Event('input',{bubbles:true})); r.dispatchEvent(new Event('change',{bubbles:true})); const f=document.querySelector('#sa-s4 input[data-wf="effects"]'); f.checked=false; f.dispatchEvent(new Event('change',{bubbles:true})) }); await p.waitForTimeout(400);
 const w=await p.evaluate(id=>{ const w=window.__arsh.L().widgets.find(x=>x.id===id); return {d:w.design,f:w.font,a:w.acc,o:w.opacity,e:w.effects} },wid);
 ok(w.d===ds[3]&&w.f==="changa"&&w.a==="#ff3366"&&w.o===0.7&&w.e===false,'design/font/color/opacity/effects saved: '+JSON.stringify(w));
 ok(await p.$eval('#sa-s4 #sa-pv .wd',e=>e.className.includes(String(e.className.match(/ck-\S+/)))&&e.style.opacity==="0.7"&&e.className.includes("f-changa")),'live preview reflects the changes');
 // القسم 5: سجل التفاعلات (هدية حقيقية بمسار السلسلة)
 await p.evaluate(()=>{ let i=0; const g=(cum,end)=>window.__arsh.send({t:"sim",ev:{type:"gift",id:"gift:u2"+(++i),user:{id:"v9",name:"سعد"},gift:"Rose",giftId:5655,diamonds:1,value:cum,count:cum,image:"https://p16-webcast.tiktokcdn.com/img/x/rose.png",streak:{cum,gc:0,end,type:1,group:"Q1"}}}); for(const n of [1,5,30]) g(n,false); g(30,true) });
 await p.waitForTimeout(500);
 const last=(await p.textContent('.sa2-last')).replace(/\s+/g," ");
 ok(/آخر هدية وصلت/.test(last)&&/Rose من سعد/.test(last)&&/العدد 25/.test(last)&&/العملات 25/.test(last)&&/احتُسبت/.test(last),'last gift: name, sender, count, coins, time, status → '+last);
 const heads=await p.$$eval('#sa-s5 th',e=>e.map(x=>x.textContent)); ok(["الوقت","الهدية","المرسل","العدد في السلسلة","المحتسب","العملات","الوقت المضاف","الحالة"].every(h=>heads.includes(h)),'log columns: '+heads.join(','));
 const kpi=(await p.innerText('[data-sastats]')).replace(/\s+/g," "); ok(/العملات المحتسبة ?30 كوين/.test(kpi)&&/الهدايا المستقبلة ?30/.test(kpi),'hero totals update live: '+kpi);
 // القفز بين الأقسام
 await p.click('[data-sajump="sa-s5"]'); await p.waitForTimeout(700); ok(await p.$eval('#sa-s5',e=>Math.abs(e.getBoundingClientRect().top)<200),'quick-jump scrolls to section');
 // إنهاء بتأكيد
 await p.click('#sa-s1 [data-sa-end]'); await p.waitForTimeout(250); ok((await R()).status==="running"&&!!(await p.$('.modal [data-ok]')),'end asks for confirmation first'); await p.click('.modal [data-ok]'); await p.waitForTimeout(400); ok((await R()).status==="ended",'end after confirmation');
 // الجوال: بدون تمرير أفقي
 const m=await (await b.newContext({viewport:{width:390,height:844},isMobile:true})).newPage(); m.on('pageerror',e=>errs.push(e.message));
 await m.goto('file://'+path.resolve(__dirname,'../demo/index.html')); await m.evaluate(()=>window.__arsh.go?window.__arsh.go("subathon"):0); await m.evaluate(()=>{ const b=document.querySelector('[data-go="subathon"]'); if(b) b.click() }); await m.waitForTimeout(600);
 const ov=await m.evaluate(()=>{ const s=document.querySelector('.sa2'); return s?[...s.querySelectorAll('.sa2-sec')].map(x=>x.scrollWidth-x.clientWidth).filter(x=>x>2).length:-1 }); ok(ov===0,'mobile: sections fit the screen (overflow count '+ov+')');
 ok(errs.length===0,'no page errors '+errs.slice(0,3).join('|')); console.log(`subathon-ui2: ${pass} passed, ${fail} failed`); await b.close(); process.exit(fail?1:0) })();
