// الاختبارات الإلزامية: B6O6 Streaming – Fantastic Subathon & Premium Identity + Fantastic Motion Engine V2
const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const fs=require('fs');
const url='file:///home/claude/najd/demo/index.html';
(async()=>{
 let pass=0, fail=0; const ok=(c,m)=>{ if(c){pass++;console.log('PASS '+m)} else {fail++;console.log('FAIL '+m);process.exitCode=1} };
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const ctx=await b.newContext({viewport:{width:1440,height:1000}}); await ctx.grantPermissions(['clipboard-read','clipboard-write']);
 const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto(url); await p.evaluate(()=>localStorage.clear()); await p.goto(url);
 const A=()=>p.evaluate(()=>{ const s=window.__arsh.R().C.subathon; return {rem:s.status==="running"?s.endsAt-Date.now():s.remainingMs,list:s.rules.list} });
 const SUB=async()=>{ await p.evaluate(()=>go('subathon')); await p.waitForTimeout(350) };
 await SUB(); await p.click('[data-sa-op="start"]'); await p.waitForTimeout(150);
 await p.evaluate(()=>document.querySelector('[data-add-rb="list"]').click()); await p.waitForTimeout(250);
 const rbId=await p.evaluate(()=>window.__arsh.L().widgets.find(w=>w.type==='srules').id);
 // روابط OBS وTikTok LIVE Studio (نفس رابط الطبقة: أفقي 1920×1080 وعمودي 1080×1920)
 const href=await p.evaluate(id=>overlayURL(window.__arsh.L(),id),rbId);
 const obs=await ctx.newPage(); obs.on('pageerror',e=>errs.push('obs '+e.message)); await obs.setViewportSize({width:960,height:540}); await obs.goto(href); await obs.waitForTimeout(700);
 const tts=await ctx.newPage(); tts.on('pageerror',e=>errs.push('tts '+e.message)); await tts.setViewportSize({width:540,height:960}); await tts.goto(href); await tts.waitForTimeout(700);
 const OV=pg=>pg.evaluate(()=>[...document.querySelectorAll('.rb-row')].map(r=>r.dataset.rid));
 const OVT=pg=>pg.evaluate(()=>document.querySelector('.wd')?document.querySelector('.wd').innerText:'');

 // 1) الحذف
 let L0=(await A()).list; const lion=L0.find(r=>r.giftId===6369);
 ok((await OV(obs)).includes(lion.id),'lion rule visible in OBS before delete');
 p.once('dialog',d=>d.accept()); await p.click(`[data-rbx="del"][data-id="${lion.id}"]`); await p.waitForSelector('.modal .btn.pri',{timeout:2000}).then(x=>x.click()).catch(()=>{}); await p.waitForTimeout(500);
 ok(!(await A()).list.some(r=>r.id===lion.id),'1. delete: removed from settings');
 ok(!(await OV(obs)).includes(lion.id)&&!(await OV(tts)).includes(lion.id),'1. delete: removed from OBS + TikTok LIVE Studio immediately');
 await p.evaluate(()=>window.__arsh.send({t:'clock-op',target:'subathon',op:'config',config:{rules:{gifts:{table:[{giftId:6369,name:'أسد',sec:1800}]}}}})); await p.waitForTimeout(300);
 ok(!(await A()).list.some(r=>r.giftId===6369),'1. deleted rule does not come back (legacy source)');
 // 2) الإخفاء والإظهار
 const fol=(await A()).list.find(r=>r.kind==='follow');
 await SUB(); await p.click(`[data-rbx="show"][data-id="${fol.id}"]`); await p.waitForTimeout(400);
 ok(!(await OV(obs)).includes(fol.id),'2. hide: rule hidden from overlay');
 const b1=(await A()).rem; await p.evaluate(()=>window.__arsh.SIM.follow()); await p.waitForTimeout(250);
 ok((await A()).rem-b1>50000,'2. hidden rule still adds time');
 await p.click(`[data-rbx="show"][data-id="${fol.id}"]`); await p.waitForTimeout(400);
 ok((await OV(obs)).includes(fol.id),'2. show: rule back on overlay');
 // 3) تعديل الوقت
 await p.fill(`.rmg-row[data-rule="${fol.id}"] [data-rk="amt:ms"]`,'7'); await p.dispatchEvent(`.rmg-row[data-rule="${fol.id}"] [data-rk="amt:ms"]`,'change'); await p.waitForTimeout(500);
 ok((await A()).list.find(r=>r.id===fol.id).ms===7*60000,'3. edit time saved');
 ok((await OVT(obs)).includes('+7')&&(await OVT(tts)).includes('+7'),'3. edited time appears in OBS + TikTok LIVE Studio');
 // تعديلات سريعة متتالية لا تضيع (جذر رجوع القوانين القديمة)
 await p.evaluate(id=>{ for(const k of ['color','timeColor']){ const el=document.querySelector(`.rmg-row[data-rule="${id}"] [data-rk="${k}"]`); el.value=k==='color'?'#ffcc00':'#00e5ff'; el.dispatchEvent(new Event('change',{bubbles:true})) } },fol.id); await p.waitForTimeout(500);
 const f2=(await A()).list.find(r=>r.id===fol.id); ok(f2.color==='#ffcc00'&&f2.timeColor==='#00e5ff','rapid consecutive edits both saved (no stale overwrite)');
 await obs.waitForTimeout(1500); ok(await obs.evaluate(id=>{ const r=document.querySelector(`.rb-row[data-rid="${id}"]`); return !!r&&getComputedStyle(r.querySelector('.rb-what')).color==='rgb(255, 204, 0)'&&getComputedStyle(r.querySelector('.rb-val')).color==='rgb(0, 229, 255)' },fol.id),'per-rule text + time colours applied in OBS');
 // 4) الترتيب (سحب وإفلات)
 const ids0=(await A()).list.map(r=>r.id); const from=ids0[3], to=ids0[0];
 await p.evaluate(([a,b])=>{ const dt=new DataTransfer(); const A=document.querySelector(`[data-rbdrag="${a}"]`), B=document.querySelector(`[data-rbdrag="${b}"]`); A.dispatchEvent(new DragEvent('dragstart',{bubbles:true,dataTransfer:dt})); B.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer:dt})); B.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:dt})) },[from,to]); await p.waitForTimeout(500);
 ok((await A()).list[0].id===from,'4. drag & drop reorder saved');
 const ov4=await OV(obs); const vis=(await A()).list.filter(r=>r.enabled&&r.show!==false).map(r=>r.id); ok(ov4[0]===vis[0],'4. overlay order follows');
 // تحديد متعدد: إخفاء وحذف
 await SUB(); const two=(await A()).list.slice(-2).map(r=>r.id); for(const id of two) await p.click(`[data-rbx="sel"][data-id="${id}"]`); await p.waitForTimeout(150);
 await p.click('[data-rbx="bulk"][data-op="hide"]'); await p.waitForTimeout(400); ok((await A()).list.filter(r=>two.includes(r.id)).every(r=>r.show===false),'bulk hide');
 await p.click('[data-rbx="bulk"][data-op="del"]'); await p.waitForSelector('.modal .btn.pri',{timeout:2000}).then(x=>x.click()).catch(()=>{}); await p.waitForTimeout(400);
 ok(!(await A()).list.some(r=>two.includes(r.id)),'bulk delete');
 // نسخ قانون
 const n0=(await A()).list.length; await p.click(`[data-rbx="dup"][data-id="${fol.id}"]`); await p.waitForTimeout(400); const L5=(await A()).list;
 ok(L5.length===n0+1&&new Set(L5.map(r=>r.id)).size===L5.length,'duplicate rule (new unique id)');
 // 5) تغيير التصميم أثناء البث
 await p.evaluate(id=>{ S.rbTarget=id; go('rlib') },rbId); await p.waitForTimeout(600);
 await p.click('[data-rbx="ruse"][data-k="cyberpunk"]'); await p.waitForTimeout(600);
 ok(await obs.evaluate(()=>document.querySelector('.wd').classList.contains('rbd-cyberpunk')),'5. design changed live in OBS');
 ok(await tts.evaluate(()=>document.querySelector('.wd').classList.contains('rbd-cyberpunk')),'5. design changed live in TikTok LIVE Studio');
 // المكتبة: التصنيفات + المفضلة + المعاينة
 ok(await p.$$eval('.rlib-c',e=>e.length)===50,'library shows 50 designs');
 await p.click('[data-rbx="rcat"][data-k="gaming"]'); await p.waitForTimeout(300); const ng=await p.$$eval('.rlib-c',e=>e.length); ok(ng>0&&ng<50,'library category filter ('+ng+' gaming)');
 await p.click('[data-rbx="rfav"]'); await p.waitForTimeout(200); await p.click('[data-rbx="rcat"][data-k="fav"]'); await p.waitForTimeout(300); ok(await p.$$eval('.rlib-c',e=>e.length)===1,'favourites');
 await p.click('[data-rbx="rcat"][data-k=""]'); await p.waitForTimeout(500);
 const before=await p.evaluate(()=>window.__arsh.R().C.subathon.endsAt); await p.click('[data-rbx="rpv"][data-k="fantasticSignature"]'); await p.waitForTimeout(700); await p.click('[data-rbpvm="hit"]'); await p.waitForTimeout(350);
 ok(await p.evaluate(()=>!!document.querySelector('#rbpvm-pv .rb-delta')),'preview: «تجربة وصول هدية» shows the added time');
 ok(await p.evaluate(()=>window.__arsh.R().C.subathon.endsAt)===before,'preview events do not touch the real subathon counter');
 await p.evaluate(()=>document.querySelector('.modal').remove());
 // 6) كل التصاميم الخمسين + 7) الشفافية الحقيقية + 8) أنواع الخط السفلي
 const lay=await p.evaluate(()=>window.__arsh.L().id);
 const D=await p.evaluate(()=>RB_DESIGNS.map(d=>d.id)); let bad=[], opaque=[];
 for(const id of D){ await p.evaluate(([wid,id])=>{ const w=window.__arsh.L().widgets.find(x=>x.id===wid); w.design=id; Object.assign(w,rbPreset('alpha')); w.preset='alpha'; save(); pushLayout() },[rbId,id]); await obs.waitForTimeout(120);
  const r=await obs.evaluate(()=>{ const w=document.querySelector('.wd'); if(!w) return {n:0}; const panel=w.querySelector('.rb-panel'), row=w.querySelector('.rb-row'); const bg=e=>{ const c=getComputedStyle(e); return c.backgroundImage!=='none'||!/rgba\(0, 0, 0, 0\)|transparent/.test(c.backgroundColor) };
   return {n:w.querySelectorAll('.rb-row').length,empty:[...w.querySelectorAll('.rb-row .rb-what')].some(x=>!x.textContent.trim()),opq:bg(panel)||bg(document.body)||(row&&!/none|rgba\(0, 0, 0, 0\)/.test(getComputedStyle(row,'::before').backgroundColor+getComputedStyle(row,'::before').backgroundImage.replace(/^none$/,'none')))&&getComputedStyle(row,'::before').backgroundImage!=='none'} });
  if(!r.n||r.empty) bad.push(id); if(r.opq) opaque.push(id) }
 ok(!bad.length,'6. all 50 designs render with no empty items'+(bad.length?' — '+bad.join(','):''));
 ok(!opaque.length,'7. transparent preset: no forced background/black boxes on any design'+(opaque.length?' — '+opaque.join(','):''));
 const lines=await p.evaluate(()=>Object.keys(RB_LINES)); let lbad=[];
 for(const lt of lines){ await p.evaluate(([wid,lt])=>{ const w=window.__arsh.L().widgets.find(x=>x.id===wid); w.design='minimalUnderline'; w.lineType=lt; w.hideLine=false; save(); pushLayout() },[rbId,lt]); await obs.waitForTimeout(120);
  const vis=await obs.evaluate(()=>{ const l=document.querySelector('.rb-ln'); return l?getComputedStyle(l).display!=='none':false }); if(vis!==(lt!=='none')) lbad.push(lt) }
 ok(!lbad.length,'8. all underline types ('+lines.length+') render; «مخفي» hides it'+(lbad.length?' — '+lbad.join(','):''));
 await p.evaluate(([wid])=>{ const w=window.__arsh.L().widgets.find(x=>x.id===wid); w.lineType='static'; w.lineLen=60; w.lineThick=4; w.lineColor='#ff0000'; save(); pushLayout() },[rbId]); await obs.waitForTimeout(200);
 const ul=await obs.evaluate(()=>{ const l=document.querySelector('.rb-ln'), r=l.parentElement; return {ratio:l.getBoundingClientRect().width/r.getBoundingClientRect().width,h:l.getBoundingClientRect().height,cs:getComputedStyle(l).width+' '+getComputedStyle(l).height+' '+getComputedStyle(l).display} }); ok(Math.abs(ul.ratio-.6)<.05&&Math.round(ul.h)>=3,'underline length + thickness controls '+JSON.stringify(ul));
 // 9) الأصوات: اختيار وتغيير وحذف (حدث + قانون) — من المكتبة بدون رفع
 await SUB(); await p.click('[data-rbx="saspick"][data-ev="sa_start"]'); await p.waitForSelector('.rbp-it',{timeout:4000}); await p.fill('#rbp-q',''); await p.click('.rbp-it [data-rbp-use]'); await p.waitForTimeout(400);
 let rr=await p.evaluate(()=>SC().rules.find(r=>r.ev==='sa_start')); ok(rr&&rr.sounds.length===1,'9. choose sound for «بدء السابثون» from library (no upload)');
 const src1=rr.sounds[0].src; await p.click('[data-rbx="saschg"][data-ev="sa_start"]'); await p.waitForSelector('.rbp-it',{timeout:4000}); await p.locator('.rbp-it [data-rbp-use]').nth(5).click(); await p.waitForTimeout(400);
 rr=await p.evaluate(()=>SC().rules.find(r=>r.ev==='sa_start')); ok(rr.sounds.length===1&&rr.sounds[0].src!==src1,'9. change sound');
 await p.click('[data-rbx="sasdel"][data-ev="sa_start"]'); await p.waitForTimeout(400); ok(!(await p.evaluate(()=>SC().rules.some(r=>r.ev==='sa_start'&&r.sounds.length))),'9. delete sound');
 await p.click(`[data-rbx="rsnd"][data-id="${fol.id}"]`); await p.waitForSelector('.rbp-it',{timeout:4000}); await p.click('[data-rbp-tab="lib"]'); await p.locator('.rbp-it [data-rbp-use]').nth(2).click(); await p.waitForTimeout(400);
 ok(/^lib:/.test((await A()).list.find(r=>r.id===fol.id).soundId),'9. per-rule sound from library');
 await p.click(`[data-rbx="rmute"][data-id="${fol.id}"]`); await p.waitForTimeout(400); ok((await A()).list.find(r=>r.id===fol.id).soundId==='none','9. per-rule «بدون صوت»');
 // 10) سابثون بدون أصوات
 await p.check('[data-sa="soundsOff"]'); await p.waitForTimeout(300); ok(await p.evaluate(()=>window.__arsh.R().C.subathon.soundsOff===true),'10. subathon without sounds saved');
 // 11) 30 وردة متتالية + 12) هدايا مختلفة متزامنة
 await p.evaluate(([wid])=>{ const w=window.__arsh.L().widgets.find(x=>x.id===wid); w.design='royalGold'; Object.assign(w,rbPreset('full')); w.preset='full'; w.mode='list'; save(); pushLayout() },[rbId]); await obs.waitForTimeout(300);
 const rose=(await A()).list.find(r=>r.giftId===5655); const r0=(await A()).rem;
 await p.evaluate(()=>{ for(let i=0;i<30;i++) window.__arsh.send({t:'sim',ev:{id:'rose30_'+i,type:'gift',giftId:5655,gift:'Rose',diamonds:1,count:1,test:true,user:{name:'u'+i,id:'u'+i}}}) }); await p.waitForTimeout(600);
 const added=(await A()).rem-r0; ok(added>30*rose.ms-1500&&added<30*rose.ms+1500,'11. 30 consecutive roses → +'+Math.round(added/1000)+'s (expected '+30*rose.ms/1000+'s)');
 const fx=await obs.evaluate(()=>({deltas:[...document.querySelectorAll('.rb-delta')].map(x=>x.textContent),fx:document.querySelectorAll('.rbx').length}));
 ok(fx.deltas.length>=1&&fx.deltas.length<=3&&fx.deltas.some(t=>/×\d+/.test(t)),'11. hits grouped into one effect with count ('+fx.deltas.join(' | ')+')');
 ok(fx.fx<=95,'11. effects capped (no pile-up): '+fx.fx+' fx nodes');
 const sub=(await A()).list.find(r=>r.kind==='subscribe');
 await p.evaluate(()=>{ window.__arsh.send({t:'sim',ev:{id:'cc1',type:'gift',giftId:5655,gift:'Rose',diamonds:1,count:2,test:true,user:{name:'a',id:'a'}}}); window.__arsh.SIM.follow(); window.__arsh.send({t:'sim',ev:{id:'cc3',type:'subscribe',test:true,user:{name:'c',id:'c'}}}) });
 const hitIds=await obs.evaluate(async ids=>{ const seen=new Set(); for(let i=0;i<40;i++){ document.querySelectorAll('.rb-row.hit').forEach(r=>seen.add(r.dataset.rid)); if(ids.every(x=>seen.has(x))) break; await new Promise(r=>setTimeout(r,50)) } return [...seen] },[rose.id,sub.id]); ok(hitIds.includes(rose.id)&&hitIds.includes(sub.id),'12. concurrent different gifts each light their own rule');
 // محرك المؤثرات: حركة لكل قانون + تغيير أثناء البث + إيقاف كل المؤثرات
 await SUB(); await p.selectOption(`.rmg-row[data-rule="${rose.id}"] [data-rk="anim"]`,'lxDiamond'); await p.waitForTimeout(400);
 ok((await A()).list.find(r=>r.id===rose.id).anim==='lxDiamond','«تخصيص حركة القانون» saved');
 await p.evaluate(()=>window.__arsh.send({t:'sim',ev:{id:'dia1',type:'gift',giftId:5655,gift:'Rose',diamonds:1,count:1,test:true,user:{name:'z',id:'z'}}})); await p.waitForTimeout(450);
 ok(await obs.evaluate(id=>!!document.querySelector(`.rb-row[data-rid="${id}"] .rbx-dia`),rose.id),'per-rule motion plays on gift (diamond particles)');
 await p.evaluate(([wid])=>{ const w=window.__arsh.L().widgets.find(x=>x.id===wid); w.ae={...(w.ae||{}),off:true}; save(); pushLayout() },[rbId]); await obs.waitForTimeout(400);
 await p.evaluate(()=>window.__arsh.send({t:'sim',ev:{id:'off1',type:'gift',giftId:5655,gift:'Rose',diamonds:1,count:1,test:true,user:{name:'y',id:'y'}}})); await p.waitForTimeout(500);
 ok(await obs.evaluate(()=>!document.querySelector('.wd').classList.contains('x')&&document.querySelectorAll('.rbx').length===0||document.querySelector('.wd').classList.contains('rb-still')),'stop all effects → no effect nodes');
 // 13/14) OBS وTikTok LIVE Studio يتحدثان (تم أعلاه) + لا قص في الوضع العمودي
 const clip=await tts.evaluate(()=>{ const w=document.querySelector('.wd').getBoundingClientRect(); return [...document.querySelectorAll('.rb-row')].every(r=>{ const b=r.getBoundingClientRect(); return b.left>=w.left-2&&b.right<=w.right+2 }) }); ok(clip,'14. vertical (TikTok LIVE Studio) layout: rows not clipped');
 // 15) الحفظ بعد إعادة التشغيل
 const snap=await p.evaluate(()=>({ids:window.__arsh.R().C.subathon.rules.list.map(r=>r.id),design:window.__arsh.L().widgets.find(w=>w.type==='srules').design,rem:window.__arsh.R().C.subathon.endsAt}));
 await p.reload(); await p.waitForTimeout(800);
 const after=await p.evaluate(()=>({ids:window.__arsh.R().C.subathon.rules.list.map(r=>r.id),design:window.__arsh.L().widgets.find(w=>w.type==='srules').design,rem:window.__arsh.R().C.subathon.endsAt}));
 ok(JSON.stringify(after.ids)===JSON.stringify(snap.ids)&&after.design===snap.design&&after.rem===snap.rem,'15. rules, design and subathon time persist after restart');
 ok(!after.ids.includes(lion.id),'15. deleted rule still gone after restart');
 // 16) لا بط ولا عناصر طفولية
 const html=fs.readFileSync('/home/claude/najd/demo/index.html','utf8'); const bundle=fs.readFileSync('/home/claude/najd/arsh-live/public/b6o6-dashboard.js','utf8');
 const DK=/🦆|(^|[\s"'«(>])بطة|البطة|البط /; ok(!DK.test(html)&&!DK.test(bundle),'16. no duck emoji/words anywhere in the dashboard + engines');
 ok(!/class="armR"|cartoon duck|Dancing Duck|Cute Cat|Mini Dragon|Floating Ghost/.test(bundle),'16. no cartoon characters (duck/cat/dragon/ghost)');
 // 17) مختبر الحركات: فحص التكرار الفعلي
 await p.evaluate(()=>go('rblab')); await p.waitForTimeout(1500); const rep=await p.evaluate(()=>{ const r=rbScanMotions(); return {d:r.dups.length,max:r.max,u:r.uniqueMotions,pair:r.pair} });
 ok(rep.d===0&&rep.u===50,'17. 50 designs × 50 different main motions (fingerprint scan, 0 identical)');
 ok(rep.max<0.5,'17. no over-similar motions (max similarity '+Math.round(rep.max*100)+'% '+rep.pair.join('↔')+')');
 await p.screenshot({path:'/tmp/ft/lab-final.png'});
 ok(errs.length===0,'no page errors '+errs.slice(0,3).join(' | '));
 console.log(`fantastic-ui: ${pass} passed, ${fail} failed`); await b.close();
})();
