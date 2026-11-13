// واجهة «مكتبتي»: الأقسام الأربعة ← المستويات ← المقاطع، رفع فيديو/صوت داخل المستوى، الربط الفعلي، الحفظ بعد إعادة التحميل
const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const FX='/tmp/alfx/';
(async()=>{
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const ctx=await b.newContext({viewport:{width:1440,height:1000}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 const U='file:///home/claude/najd/demo/index.html';
 await p.goto(U); await p.evaluate(()=>localStorage.clear()); await p.goto(U);
 await p.click('.nav [data-go="alerts"]'); await p.waitForTimeout(400);
 const secs=await p.$$eval('[data-mlsec]',e=>e.map(x=>x.dataset.mlsec).filter(Boolean));
 ok(secs.join(',')==='love,taps,don,gifts','4 main sections shown first: love, taps, donation, gifts');
 const txt=await p.textContent('#pg');
 ok(!/متابعة جديدة|دخول مشاهد|كلمة مفتاحية/.test(txt),'no follow / join / comment sections');
 ok(await p.$('[data-altab="rules"]')===null,'old rules tab removed');

 // ❤️ أحبني: رفع فيديو من داخل القسم
 await p.click('[data-mlsec="love"]'); await p.waitForTimeout(250);
 ok((await p.$$('.ml-lv')).length===1&&/Heart Me/.test(await p.textContent('#pg')),'love section: only the Heart Me level');
 await p.click('[data-ml="upload"][data-s="love"]'); await p.waitForTimeout(250);
 ok(await p.evaluate(()=>S.al.tab==="create"&&S.al.form.event==="love"),'upload from inside love → form preset to the love section');
 const evOpts=await p.$$eval('[data-alff="event"] option',e=>e.map(x=>x.value));
 ok(evOpts.every(v=>["love","like_total","donation","gift"].includes(v)),'upload form offers support sections only: '+evOpts.join(','));
 await p.setInputFiles('#al-file',FX+'mp4_audio.mp4'); for(let i=0;i<60;i++){ if(await p.evaluate(()=>S.al.up&&S.al.up.phase==="done")) break; await p.waitForTimeout(200) }
 await p.evaluate(()=>{ S.al.form.name="قلب طاير"; S.al.form.category="hearts"; });
 await p.click('[data-alsave]'); await p.waitForTimeout(500);
 const lib1=await p.evaluate(()=>S.bots.alerts.lib);
 ok(lib1.love.clips.length===1&&await p.evaluate(()=>S.al.tab==="mylib"&&S.al.mlSec==="love"),'after save: clip added directly to love, back in the section');
 const loveId=lib1.love.clips[0].alertId;

 // صوت فقط في قسم الهدايا (فئة قيمة)
 await p.click('[data-mlsec=""]'); await p.waitForTimeout(150); await p.click('[data-mlsec="gifts"]'); await p.waitForTimeout(150);
 await p.click('[data-ml="valadd"]'); await p.waitForTimeout(200);
 const gk=await p.evaluate(()=>S.bots.alerts.lib.gifts.items[0].id);
 await p.click(`[data-ml="upload"][data-k="${gk}"]`); await p.waitForTimeout(200);
 await p.setInputFiles('#al-file',FX+'mp3_sound.mp3'); for(let i=0;i<60;i++){ if(await p.evaluate(()=>S.al.up&&S.al.up.phase==="done")) break; await p.waitForTimeout(200) }
 await p.evaluate(()=>{ S.al.form.name="صوت هدية"; S.al.form.category="money"; }); await p.click('[data-alsave]'); await p.waitForTimeout(400);
 const g1=await p.evaluate(()=>S.bots.alerts.lib.gifts.items[0]);
 ok(g1.kind==="value"&&g1.clips.length===1&&await p.evaluate(id=>(JSON.parse(localStorage.getItem("b6o6.alerts"))||[]).find(a=>a.id===id).kind,g1.clips[0].alertId)==='audio','gifts: value category with an audio-only clip');
 await p.fill(`[data-mlf="min"][data-k="${gk}"]`,'500'); await p.dispatchEvent(`[data-mlf="min"][data-k="${gk}"]`,'change'); await p.waitForTimeout(150);
 ok(await p.evaluate(()=>S.bots.alerts.lib.gifts.items[0].min)===500,'edit gift value range');

 // 👆 التكبيس: 7 مستويات
 await p.click('[data-mlsec=""]'); await p.click('[data-mlsec="taps"]'); await p.waitForTimeout(200);
 const tl=await p.$$eval('.ml-lv b',e=>e.map(x=>x.textContent.replace(/\D/g,'')).filter(Boolean));
 ok(tl.join(',')==='1000,2000,5000,10000,20000,50000,100000','taps: 7 separate levels 1,000 → 100,000');
 // اختيار مقطع موجود لمستوى 5,000 من «مقاطعي»
 await p.click('[data-ml="pick"][data-k="5000"]'); await p.waitForTimeout(200);
 await p.click(`.modal [data-pick="${loveId}"]`).catch(async()=>{ await p.click('.modal details summary'); await p.click(`.modal [data-pick="${loveId}"]`) }); await p.waitForTimeout(200);
 ok(await p.evaluate(id=>S.bots.alerts.lib.taps.levels[5000].clips[0].alertId===id,loveId),'pick from my clips into the 5,000 level');

 // 💵 الدونيشن: 4 مستويات افتراضية قابلة للتعديل
 await p.click('[data-mlsec=""]'); await p.click('[data-mlsec="don"]'); await p.waitForTimeout(200);
 ok((await p.evaluate(()=>S.bots.alerts.lib.don.levels.map(l=>l.min+"-"+l.max))).join('|')==='1-0|5-0|10-0|20-0|50-0|100-0|200-0|500-0|1000-0','donation: 9 default editable levels 1$ → 1,000$ «وأكثر»');
 await p.click('[data-lvid="d10"] details.ml-adv summary'); await p.waitForTimeout(100); await p.fill('[data-mlf="max"][data-k="d10"]','25'); await p.dispatchEvent('[data-mlf="max"][data-k="d10"]','change'); await p.waitForTimeout(150);
 await p.click('[data-ml="pick"][data-k="d10"]'); await p.waitForTimeout(200);
 const pickHas=await p.$(`.modal [data-pick="${loveId}"]`); if(pickHas){ const vis=await pickHas.isVisible(); if(!vis) await p.click('.modal details summary'); await p.click(`.modal [data-pick="${loveId}"]`) } await p.waitForTimeout(200);
 ok(await p.evaluate(()=>S.bots.alerts.lib.don.levels[2].max===25&&S.bots.alerts.lib.don.levels[2].clips.length===1),'edited medium level (5-25) and assigned a clip');
 await p.click('[data-ml="clipset"][data-k="d10"]'); await p.waitForTimeout(150);
 await p.$eval('[data-mlf="size"][data-k="d10"]',e=>{ e.value="60"; e.dispatchEvent(new Event("input",{bubbles:true})); e.dispatchEvent(new Event("change",{bubbles:true})) });
 await p.selectOption('[data-mlf="enter"][data-k="d10"]','slideUp'); await p.waitForTimeout(150);
 const c=await p.evaluate(()=>S.bots.alerts.lib.don.levels[2].clips[0]); ok(c.size===60&&c.enter==="slideUp",'clip size and enter animation saved');

 // الربط الفعلي عبر الغرفة: كل حدث يشغّل قسمه فقط (نلتقط ما يصل لصندوق المعاينة)
 await p.evaluate(()=>{ window.__got=[]; const v=alPv; const o=v.aboxPush.bind(v); v.aboxPush=items=>{ window.__got.push(...items.map(i=>i.sec+":"+i.level+":"+(i.test?"t":"r"))); return o(items) } });
 let sn=0; const sim=ev=>p.evaluate(ev=>window.__arsh.send({t:"sim",ev}),{id:"t_"+(++sn)+"_"+Date.now(),...ev});
 await sim({type:"gift",user:{id:"a",name:"نورة"},gift:"Heart Me",giftId:7934,count:1,value:1,diamonds:1,test:true}); await p.waitForTimeout(200);
 await sim({type:"donation",provider:"test",test:true,name:"خالد",amount:10,currency:"USD"}); await p.waitForTimeout(200);
 await sim({type:"gift",user:{id:"b",name:"سعد"},gift:"Lion",giftId:6369,count:1,value:29999,diamonds:29999,test:true}); await p.waitForTimeout(200);
 await sim({type:"gift",user:{id:"c",name:"ريم"},gift:"Rose",giftId:5655,count:1,value:1,diamonds:1,test:true}); await p.waitForTimeout(200);
 await sim({type:"like",user:{id:"d",name:"فهد"},count:5200,test:true}); await p.waitForTimeout(200);
 const got=await p.evaluate(()=>window.__got);
 ok(got[0]==="love:love:t",'Heart Me gift → love clip only');
 ok(got[1]==="don:d10:t",'$10 donation → 10$ level only (not love)');
 ok(got[2]&&got[2].startsWith("gifts:")&&got.filter(x=>x.startsWith("gifts:")).length===1,'Lion (29999💎 ≥ 500) → gifts value category; Rose (1💎) → nothing');
 ok(got.includes("taps:5000:t")&&!got.some(x=>x==="taps:1000:t"),'5,200 taps → 5,000 clip (1,000/2,000 levels have no clip → nothing)');
 ok(got.length===4,'exactly 4 alerts for 5 events (no mixing): '+got.join(' | '));

 // التجربة اليدوية: لا تُحسب دعماً
 const dn0=await p.evaluate(()=>JSON.stringify(window.__arsh.R().DN.list.length));
 await p.click('[data-mlsec=""]'); await p.click('[data-mlsec="love"]'); await p.waitForTimeout(200);
 await p.evaluate(()=>{ window.__got=[]; const v=alPv; const o=v.aboxPush.bind(v); v.aboxPush=items=>{ window.__got.push(...items.map(i=>i.sec+":"+i.level+":"+(i.test?"t":"r"))); return o(items) } });
 await p.click('[data-ml="test"][data-s="love"]'); await p.waitForTimeout(500);
 ok((await p.evaluate(()=>window.__got)).join()==="love:love:t",'🧪 test button plays the love clip marked as test');
 ok(await p.evaluate(()=>JSON.stringify(window.__arsh.R().DN.list.length))===dn0,'test not recorded as a donation');
 await p.waitForTimeout(400); ok(await p.evaluate(()=>!!document.querySelector('#al-pv .ab-root')),'clip renders in the live preview (same component as OBS)');

 // تعطيل
 await p.click('[data-ml="lvon"][data-s="love"]'); await p.waitForTimeout(150);
 ok(await p.evaluate(()=>S.bots.alerts.lib.love.enabled===false),'disable the love alert');

 // الحفظ بعد إعادة التحميل
 await p.goto(U); await p.waitForTimeout(300);
 const L2=await p.evaluate(()=>S.bots.alerts.lib);
 ok(L2.love.enabled===false&&L2.love.clips.length===1&&L2.don.levels[2].max===25&&L2.taps.levels[5000].clips.length===1&&L2.gifts.items[0].min===500,'all customizations persist after reload');

 // مكتبة المجتمع: الأقسام نفسها
 await p.click('.nav [data-go="alerts"]'); await p.waitForTimeout(200); await p.click('[data-altab="lib"]'); await p.waitForTimeout(300);
 const grps=await p.$$eval('[data-algrp]',e=>e.map(x=>x.dataset.algrp));
 ok(grps.join(',')===',love,likes,donations,gifts','community library: same 4 sections');
 await p.click('[data-algrp="likes"]'); await p.waitForTimeout(200);
 ok((await p.$$('[data-allvl]')).length===8,'taps → filter by tap count level');
 // الدونيشن (صفحة الدونيشن) تعرض نفس المستويات
 await p.click('.nav [data-go="donalerts"]'); await p.waitForTimeout(300);
 ok((await p.$$('.ml-dl')).length===9&&/2️⃣ مستويات الدونيشن/.test(await p.textContent('#pg')),'donations page shows the same donation levels (single source)');
 await p.click('[data-dnlib]'); await p.waitForTimeout(300);
 ok(await p.evaluate(()=>S.page==="alerts"&&S.al.mlSec==="don"),'«edit levels» opens the donation section');
 ok(!errs.length,'no errors '+errs.join(' | '));
 await p.screenshot({path:'/home/claude/najd/tests/shot-alert-lib.png'});
 await b.close();
})();
