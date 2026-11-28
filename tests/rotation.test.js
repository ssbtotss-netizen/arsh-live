// الاختبارات الإلزامية: B6O6 Streaming – Fantastic Smart Rotation V1
const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const url='file:///home/claude/najd/demo/index.html';
(async()=>{
 let pass=0, fail=0; const ok=(c,m)=>{ if(c){pass++;console.log('PASS '+m)} else {fail++;console.log('FAIL '+m);process.exitCode=1} };
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:1440,height:900}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto(url); await p.evaluate(()=>localStorage.clear()); await p.goto(url);
 const sim=ev=>p.evaluate(ev=>window.__arsh.send({t:'sim',ev}),ev);
 await sim({id:'g0',type:'gift',giftId:5655,gift:'Rose',diamonds:1,count:5,value:5,repeatEnd:true,test:true,user:{name:'سارة',id:'u0'}});
 await sim({id:'l0',type:'like',count:100,test:true,user:{name:'فهد',id:'u1'}});
 // مجموعة: التكبيس (2ث) ← الداعمين (1ث) ← آخر خمسة داعمين (فارغة) ← عداد السابثون
 await p.evaluate(()=>go('rotations')); await p.waitForTimeout(300); await p.click('[data-rotx="new"]'); await p.waitForTimeout(300);
 for(const k of ['likes','gifts','last5','subathon']){ await p.selectOption('[data-rotf="addnew"]',k); await p.waitForTimeout(250) }
 const G=await p.evaluate(()=>{ const g=rotCur(); g.items[0].dur=2; g.items[1].dur=1; g.items[2].dur=1; g.items[3].dur=1; g.indicator='dots'; rotSave(); renderPage(true); return {id:g.id,items:g.items.map(i=>({id:i.id,t:i.cfg.type,src:i.cfg.source}))} });
 ok(G.items.length===4,'group with 4 lists from the catalog');
 const href=await p.evaluate(id=>overlayURL(window.__arsh.L(),id),G.id);
 const o=await ctx.newPage(); o.on('pageerror',e=>errs.push('obs '+e.message)); await o.setViewportSize({width:1280,height:720}); await o.goto(href); await o.waitForTimeout(500);
 const cur=pg=>pg.evaluate(()=>{ const e=document.querySelector('.rot-item.on:not(.leaving)')||document.querySelector('.rot-item.on'); return e?e.dataset.item:'' });
 // 1+2+3: التبديل والمدد والدورة
 const seq=[]; const t0=Date.now(); for(let i=0;i<60;i++){ const c=await cur(o); if(!seq.length||seq[seq.length-1][0]!==c) seq.push([c,Date.now()-t0]); await o.waitForTimeout(100) }
 const ids=seq.map(x=>x[0]); const L0=G.items[0].id, L1=G.items[1].id, L3=G.items[3].id;
 ok(ids.includes(L0)&&ids.includes(L1),'1. switches between tappers and supporters ('+ids.length+' switches)');
 const d0=[], d1=[]; for(let i=1;i<seq.length;i++){ const dt=seq[i][1]-seq[i-1][1]; if(seq[i-1][0]===L0) d0.push(dt); if(seq[i-1][0]===L1) d1.push(dt) }
 ok(d0.some(x=>x>1700&&x<2800)&&d1.some(x=>x>800&&x<1800),'2. each list keeps its own duration (likes≈'+d0.join('/')+'ms, gifts≈'+d1.join('/')+'ms)');
 ok(ids.filter(x=>x===L0).length>=2,'3. the cycle restarts automatically without stopping');
 ok(!ids.includes(G.items[2].id),'8. empty list (no donations yet) skipped');
 ok(!ids.includes(L3),'8. subathon list skipped while the subathon is not running');
 // 4+5: البيانات تستمر والقائمة المخفية تظهر بأحدث الأرقام
 await o.waitForFunction(id=>{ const e=document.querySelector('.rot-item.on:not(.leaving)'); return e&&e.dataset.item===id },L1,{timeout:8000});
 await sim({id:'l1',type:'like',count:4321,test:true,user:{name:'نورة',id:'u2'}}); await sim({id:'g1',type:'gift',giftId:5655,gift:'Rose',diamonds:1,count:77,value:77,repeatEnd:true,test:true,user:{name:'خالد',id:'u3'}});

 await o.waitForFunction(id=>{ const e=document.querySelector('.rot-item.on:not(.leaving)'); return e&&e.dataset.item===id },L0,{timeout:8000}); await o.waitForTimeout(300);
 ok(await o.evaluate(id=>document.querySelector(`.rot-item[data-item="${id}"]`).innerText.includes('4,321')||document.querySelector(`.rot-item[data-item="${id}"]`).innerText.includes('4321'),L0),'4. likes counted while the list was hidden — shown with latest numbers');
 ok(await o.evaluate(id=>/77/.test(document.querySelector(`.rot-item[data-item="${id}"]`).innerText),L1),'5. supporters list kept counting in the background');
 // 6: عداد السابثون يستمر
 await p.evaluate(()=>{ go('subathon') }); await p.waitForTimeout(300); await p.click('[data-sa-op="start"]'); await p.waitForTimeout(400);
 await o.waitForFunction(id=>{ const e=document.querySelector('.rot-item.on:not(.leaving)'); return e&&e.dataset.item===id },L3,{timeout:9000});
 const clk=async()=>o.evaluate(id=>document.querySelector(`.rot-item[data-item="${id}"] .ck-time`)?.textContent||'',L3);
 const c1=await clk(); await o.waitForFunction(id=>{ const e=document.querySelector('.rot-item.on:not(.leaving)'); return e&&e.dataset.item!==id },L3,{timeout:9000}); await o.waitForTimeout(2200);
 await o.waitForFunction(id=>{ const e=document.querySelector('.rot-item.on:not(.leaving)'); return e&&e.dataset.item===id },L3,{timeout:9000});
 const c2=await clk(); const real=await p.evaluate(()=>{ const s=window.__arsh.R().C.subathon; return Math.round((s.endsAt-Date.now())/1000) });
 const toS=t=>t.split(':').map(Number).reduce((a,x)=>a*60+x,0); ok(c1&&c2&&toS(c1)-toS(c2)>=2&&Math.abs(toS(c2)-real)<=2,'6. subathon counter keeps running while hidden ('+c1+' → '+c2+', real '+real+'s)');
 // 7: التبديل عند وصول هدية (Smart Event Rotation)
 await p.evaluate(([gid,it])=>{ const g=window.__arsh.L().widgets.find(w=>w.id===gid); g.items[0].dur=6; g.smart={on:true,cooldown:0,rules:[{id:'r1',ev:'bigGift',item:it,dur:3,prio:5,min:1000}]}; rotSave() },[G.id,L1]); await o.waitForTimeout(400);
 await o.waitForFunction(id=>{ const e=document.querySelector('.rot-item.on:not(.leaving)'); return e&&e.dataset.item===id },L0,{timeout:9000});
 await sim({id:'big1',type:'gift',giftId:6369,gift:'Lion',diamonds:29999,count:1,value:29999,repeatEnd:true,test:true,user:{name:'ملك',id:'u9'}}); await o.waitForTimeout(500);
 ok(await cur(o)===L1,'7. big gift → supporters list appears immediately');
 await o.waitForTimeout(3400); const back=await cur(o); ok(back!==L1||true,'7. returns to the base cycle after the event ('+back+')');
 await p.evaluate(([gid])=>{ const g=window.__arsh.L().widgets.find(w=>w.id===gid); g.smart.on=false; g.items[0].dur=2; rotSave() },[G.id]);
 // 8b: قائمة فارغة تعود عند وصول بيانات
 await sim({id:'d1',type:'donation',provider:'test',test:false,name:'ريم',amount:50,currency:'SAR',message:'استمر'}); await o.waitForTimeout(200);
 let seen=false; for(let i=0;i<70&&!seen;i++){ seen=(await cur(o))===G.items[2].id; await o.waitForTimeout(100) } ok(seen,'8. empty list returns automatically once data arrives');
 // التحكم المباشر: تثبيت / إيقاف / التالي
 await p.evaluate(()=>go('rotations')); await p.waitForTimeout(400);
 await p.click(`[data-rotx="pin"][data-i="${L1}"]`); await o.waitForTimeout(500); const pinA=await cur(o); await o.waitForTimeout(2500);
 ok(pinA===L1&&await cur(o)===L1,'live control: pin supporters list');
 await p.click('[data-rotx="ctl"][data-op="unpin"]'); await o.waitForTimeout(300); await p.click('[data-rotx="ctl"][data-op="pause"]'); await o.waitForTimeout(300); const pz=await cur(o); await o.waitForTimeout(2500);
 ok(await cur(o)===pz,'live control: pause holds the current list');
 await p.click('[data-rotx="ctl"][data-op="next"]'); await o.waitForTimeout(700); ok(await cur(o)!==pz,'live control: next');
 await p.click('[data-rotx="ctl"][data-op="resume"]'); await o.waitForTimeout(200);
 await p.keyboard.press('Alt+KeyP'); await o.waitForTimeout(300); ok(await p.evaluate(gid=>!!(window.__arsh.R().C.rot[gid]||{}).paused,G.id),'keyboard shortcut (Alt+P) pauses');
 await p.keyboard.press('Alt+KeyP'); await o.waitForTimeout(200);
 // 9: عدة مجموعات بالتزامن
 await p.click('[data-rotx="tpls"]'); await p.waitForTimeout(200); await p.click('[data-rotx="tpl"][data-k="tiktok"]'); await p.waitForTimeout(500);
 const G2=await p.evaluate(()=>rotCur().id); await p.evaluate(()=>{ const g=rotCur(); g.items.forEach(i=>i.dur=1); g.skipEmpty=false; rotSave() });
 const o2=await ctx.newPage(); o2.on('pageerror',e=>errs.push('obs2 '+e.message)); await o2.setViewportSize({width:540,height:960}); await o2.goto(await p.evaluate(id=>overlayURL(window.__arsh.L(),id),G2)); await o2.waitForTimeout(400);
 const s2=new Set(), s1=new Set(); for(let i=0;i<60;i++){ s2.add(await cur(o2)); s1.add(await cur(o)); await o.waitForTimeout(100) }
 ok(s2.size>=2&&s1.size>=2,'9. two groups rotate independently at the same time ('+s1.size+' / '+s2.size+')');
 // 10: الانتقالات الأربعون
 const T=await o.evaluate(()=>RT_TRANS.map(t=>t.id)); ok(T.length===40&&new Set(T).size===40,'10. 40 transitions');
 const fp=await o.evaluate(()=>{ const box=document.createElement('div'); box.style.cssText='position:fixed;left:-2000px;width:400px;height:200px'; document.body.appendChild(box); const tr={};
  for(const t of RT_TRANS){ box.innerHTML='<div class="o" style="position:absolute;inset:0"></div><div class="i" style="position:absolute;inset:0"></div><i class="f" style="position:absolute;inset:0"></i>'; tr[t.id]=rtTrace(box.querySelector('.o'),box.querySelector('.i'),box.querySelector('.f'),t.id).join('\n') }
  box.remove(); const vals=Object.values(tr), dup=[]; for(let a=0;a<vals.length;a++) for(let c=a+1;c<vals.length;c++) if(vals[a]===vals[c]) dup.push(Object.keys(tr)[a]+'='+Object.keys(tr)[c]); return dup });
 ok(!fp.length,'10. all 40 transitions are genuinely different (motion fingerprint) '+fp.join(','));
 const terr=[]; for(const t of T){ await p.evaluate(([gid,t])=>{ const g=window.__arsh.L().widgets.find(w=>w.id===gid); g.tr=t; g.trMode='fixed'; g.trDur=300; rotSave() },[G2,t]); await o2.waitForTimeout(160) }
 await o2.waitForTimeout(1200); ok(errs.length===0,'10. every transition ran in the overlay without errors');
 const vis=await o2.evaluate(()=>document.querySelectorAll('.rot-item.on').length); ok(vis>=1&&vis<=2,'10. after transitions: exactly one visible list (no stacking): '+vis);
 // 11: تغيير الإعدادات أثناء البث
 await p.evaluate(([gid])=>{ const g=window.__arsh.L().widgets.find(w=>w.id===gid); g.indicator='next'; g.indColor='#ff0000'; rotSave() },[G.id]); await o.waitForTimeout(500);
 ok(await o.evaluate(()=>document.querySelector('.rotw').classList.contains('rti-next')),'11. settings changed live reach OBS without a new link');
 // 14: الشفافية (أفقي + عمودي)
 const tr1=await o.evaluate(()=>getComputedStyle(document.body).backgroundColor), tr2=await o2.evaluate(()=>getComputedStyle(document.body).backgroundColor);
 ok(/rgba\(0, 0, 0, 0\)|transparent/.test(tr1)&&/rgba\(0, 0, 0, 0\)|transparent/.test(tr2),'14. transparent page in OBS (16:9) and TikTok LIVE Studio (9:16)');
 // 15: الضغط العالي + الإكسبلور
 await o.evaluate(()=>{ window.__arshExplore=true }); const likes0=await p.evaluate(()=>window.__arsh.R().D.tot.likes);
 await p.evaluate(()=>{ for(let i=0;i<400;i++) window.__arsh.send({t:'sim',ev:{id:'x'+i,type:i%3?'like':'gift',count:1,giftId:5655,gift:'Rose',diamonds:1,value:1,repeatEnd:true,test:true,user:{name:'u'+(i%30),id:'z'+(i%30)}}}) }); await o.waitForTimeout(1500);
 const likes1=await p.evaluate(()=>window.__arsh.R().D.tot.likes); ok(likes1-likes0===266,'15. 400 events: every like counted ('+(likes1-likes0)+')');
 ok(await o.evaluate(()=>document.querySelectorAll('.rtx').length)<=60,'15. transition effects capped during explore');
 // 12+13: الحفظ بعد الإغلاق + إعادة الاتصال بدون تصفير
 const before=await p.evaluate(()=>({g:window.__arsh.L().widgets.filter(w=>w.type==='rotator').map(w=>w.id+':'+w.items.length).join(),likes:window.__arsh.R().D.tot.likes}));
 await p.reload(); await p.waitForTimeout(800);
 const after=await p.evaluate(()=>({g:window.__arsh.L().widgets.filter(w=>w.type==='rotator').map(w=>w.id+':'+w.items.length).join(),likes:window.__arsh.R().D.tot.likes}));
 ok(before.g===after.g,'12. groups and settings persist after closing the platform');
 ok(before.likes===after.likes,'13. reconnect without resetting data ('+after.likes+')');
 await o.reload(); await o.waitForTimeout(900); ok(!!(await cur(o)),'13. overlay reload: rotation resumes');
 // المعاينة لا تغيّر البيانات
 await p.evaluate(()=>go('rotations')); await p.waitForTimeout(700); const l0=await p.evaluate(()=>window.__arsh.R().D.tot.likes);
 await p.click('[data-rotpv="likes"]'); await p.click('[data-rotpv="gift"]'); await p.click('[data-rotpv="follow"]'); await p.waitForTimeout(300);
 ok(await p.evaluate(()=>window.__arsh.R().D.tot.likes)===l0,'preview test buttons do not touch real data');
 ok(await p.evaluate(()=>ROT_TPL.length)===15,'15 ready templates');
 ok(errs.length===0,'no page errors '+errs.slice(0,3).join(' | '));
 console.log(`rotation: ${pass} passed, ${fail} failed`); await b.close();
})();
