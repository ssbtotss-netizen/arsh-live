// الاختبارات الإلزامية: B6O6 Streaming – Fantastic Mirror Layout
const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const url='file:///home/claude/najd/demo/index.html';
(async()=>{
 let pass=0, fail=0; const ok=(c,m)=>{ if(c){pass++;console.log('PASS '+m)} else {fail++;console.log('FAIL '+m);process.exitCode=1} };
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:1440,height:900}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto(url); await p.evaluate(()=>localStorage.clear()); await p.goto(url);
 await p.evaluate(()=>{ ["سارة الشمري","Fahad_Gamer","نورة","خالد","ريم عبدالله الطويل جداً جداً"].forEach((x,i)=>{ window.__arsh.send({t:'sim',ev:{id:'g'+i,type:'gift',giftId:5655,gift:'Rose',diamonds:1,count:5+i*7,value:5+i*7,repeatEnd:true,test:true,user:{name:x,id:'u'+i}}}); window.__arsh.send({t:'sim',ev:{id:'l'+i,type:'like',count:1000*(i+1),test:true,user:{name:x,id:'u'+i}}}); window.__arsh.send({t:'sim',ev:{id:'f'+i,type:'follow',test:false,user:{name:x,id:'u'+i}}}) }) });
 // كل التصاميم: الصورة يمين ثم يسار
 const R=await p.evaluate(async()=>{ const sets=[...LB_DESIGNS.map(d=>["lb",{source:"likes",design:d.id}]),...DESIGNS.map(d=>["likes",{design:d.id}]),...LE_DESIGNS.map(d=>["levent",{kind:"follow",mode:"sticky",design:d.id}]),...LE_DESIGNS.slice(0,40).map(d=>["levent",{kind:"follow",mode:"sticky",design:d.id,layout:"row"}]),...RB_DESIGNS.map(d=>["srules",{design:d.id}])];
  const host=document.createElement('div'); host.style.cssText='position:fixed;left:0;top:0;width:960px;height:540px;z-index:-1'; document.body.appendChild(host);
  const out={n:0,flipFail:[],textFlip:[],sizeChange:[],noAv:0,rankFail:[]};
  // المحصلة الأفقية لكل التحويلات من العنصر حتى الجذر: سالبة = محتوى معكوس
  const neg=el=>{ let sign=1; for(let e=el;e&&e!==host;e=e.parentElement){ const t=getComputedStyle(e).transform; if(t&&t!=="none"){ const m=t.match(/matrix\(([^,]+)/); if(m&&+m[1]<0) sign*=-1 } const sc=getComputedStyle(e).scale; if(sc&&sc!=="none"&&/^-/.test(sc)) sign*=-1 } return sign<0 };
  for(const [t,o] of sets){ const w=newWidget(t,{...o,x:0,y:0,w:.5,h:.5,animOn:false,effects:false}); host.innerHTML=""; const v=new View(w,{w:960,h:540},{data:SRC,mute:true}); host.appendChild(v.el); try{ v.refresh(SRC(),true) }catch(e){} await new Promise(r=>requestAnimationFrame(r));
   const r0=v.el.getBoundingClientRect(); const base=v.mirSide(); if(!base||base==="center"){ out.noAv++; (out.noAvL=out.noAvL||{})[t+':'+(base||'none')]=((out.noAvL||{})[t+':'+(base||'none')]||0)+1; continue } out.n++;
   for(const want of ["right","left"]){ w.mir=want; v.mirBase=null; v.mirKey=null; v.apply(w); try{ v.refresh(SRC(),true) }catch(e){} await new Promise(r=>requestAnimationFrame(r)); await new Promise(r=>setTimeout(r,20));
    const on=v.mirOn; v.mirSet(false); const b0=v.mirSide(); v.mirSet(on); const got=v.mirSide();
    if(got!==want) out.flipFail.push(t+"/"+o.design+":"+want+"→"+got);
    const r1=v.el.getBoundingClientRect(); if(Math.abs(r1.width-r0.width)>1||Math.abs(r1.height-r0.height)>1||Math.abs(r1.left-r0.left)>1) out.sizeChange.push(t+"/"+o.design);
    const txt=[...v.el.querySelectorAll('.nm,.lr-nm,.rb-what,.le-name,.lr-vl b,.vl b,img')].filter(e=>e.getBoundingClientRect().width>0); if(txt.some(neg)) out.textFlip.push(t+"/"+o.design);
    if(t==="lb"){ const r1el=v.el.querySelector('.lr.r1 .lr-rk'); if(r1el&&!/^(1|🥇)$/.test(r1el.textContent.trim())) out.rankFail.push(o.design) } } }
  host.remove(); return out });
 ok(R.n>=260,'designs tested with an avatar on a side: '+R.n+' (no avatar or centered avatar: '+R.noAv+' '+JSON.stringify(R.noAvL)+')');
 ok(!R.flipFail.length,'avatar moves right↔left in every design'+(R.flipFail.length?' — '+R.flipFail.slice(0,8).join(', ')+' ('+R.flipFail.length+')':''));
 ok(!R.textFlip.length,'no mirrored text, numbers or user images'+(R.textFlip.length?' — '+R.textFlip.slice(0,5).join(','):''));
 ok(!R.sizeChange.length,'size and position unchanged'+(R.sizeChange.length?' — '+R.sizeChange.slice(0,5).join(','):''));
 ok(!R.rankFail.length,'rank order kept (first place stays #1)');
 // الاستوديو + OBS: تحديث مباشر وحفظ واستمرار البيانات
 await p.evaluate(()=>go('studio')); await p.waitForTimeout(300);
 const wid=await p.evaluate(()=>{ const w=window.__arsh.addWidget('lb',{source:'likes',design:'neonPink'}); save(); pushLayout(); return w.id });
 const href=await p.evaluate(id=>overlayURL(window.__arsh.L(),id),wid); const o=await ctx.newPage(); o.on('pageerror',e=>errs.push('obs '+e.message)); await o.setViewportSize({width:960,height:540}); await o.goto(href); await o.waitForTimeout(800);
 const side=()=>o.evaluate(()=>{ const nm=document.querySelector('.lr.r4 .lr-nm'), av=document.querySelector('.lr.r4 .lr-av'); if(!nm||!av) return '?'; return av.getBoundingClientRect().left>nm.getBoundingClientRect().left?'right':'left' });
 const s0=await side(); await p.evaluate(id=>{ S.sel=id; renderPage(true) },wid); await p.waitForTimeout(300);
 await p.click(`[data-mir="flip"][data-wid="${wid}"]`); await o.waitForTimeout(700); const s1=await side();
 ok(s0!=='?'&&s1!==s0,'Flip Layout in the studio → OBS updates live ('+s0+' → '+s1+')');
 const pod=await o.evaluate(()=>{ const a=document.querySelector('.lr.r2'), c=document.querySelector('.lr.r3'); return a&&c?(a.getBoundingClientRect().left<c.getBoundingClientRect().left?'2-left':'2-right'):'?' });
 await p.click(`[data-mir="undo"][data-wid="${wid}"]`); await o.waitForTimeout(700); ok(await side()===s0,'undo restores the default direction');
 const pod0=await o.evaluate(()=>{ const a=document.querySelector('.lr.r2'), c=document.querySelector('.lr.r3'); return a&&c?(a.getBoundingClientRect().left<c.getBoundingClientRect().left?'2-left':'2-right'):'?' });
 ok(pod!=='?'&&pod!==pod0,'podium slots mirrored (2nd/3rd swap sides, ranks unchanged)');
 await p.click(`[data-mir="left"][data-wid="${wid}"]`); await o.waitForTimeout(600); const sL=await side(); await p.click(`[data-mir="right"][data-wid="${wid}"]`); await o.waitForTimeout(600); const sR=await side();
 ok(sL==='left'&&sR==='right','«الصورة يسار» / «الصورة يمين» buttons ('+sL+','+sR+')');
 const likes0=await p.evaluate(()=>window.__arsh.R().D.tot.likes); await p.evaluate(()=>window.__arsh.send({t:'sim',ev:{id:'lx',type:'like',count:777,test:true,user:{name:'جديد',id:'n1'}}})); await o.waitForTimeout(400);
 ok(await p.evaluate(()=>window.__arsh.R().D.tot.likes)===likes0+777,'counting continues — no reset when changing direction');
 ok(await o.evaluate(()=>/rgba\(0, 0, 0, 0\)|transparent/.test(getComputedStyle(document.body).backgroundColor)),'transparency kept in OBS');
 await p.reload(); await p.waitForTimeout(700); ok(await p.evaluate(id=>window.__arsh.L().widgets.find(w=>w.id===id).mir,wid)==='right','direction saved after closing the platform');
 // عكس الحركة فقط + القوائم المتناوبة
 await p.evaluate(id=>{ const w=window.__arsh.L().widgets.find(x=>x.id===id); w.mirMotion=true; save(); pushLayout() },wid); await o.waitForTimeout(500);
 ok(await o.evaluate(()=>getComputedStyle(document.querySelector('.wd')).getPropertyValue('--mdir').trim())!=='','motion-only reverse option applied');
 await p.evaluate(()=>go('rotations')); await p.click('[data-rotx="new"]'); await p.waitForTimeout(200); await p.selectOption('[data-rotf="addnew"]','likes'); await p.waitForTimeout(200); await p.selectOption('[data-rotf="addnew"]','gifts'); await p.waitForTimeout(200);
 await p.click('[data-rotx="mirall"][data-m="left"]'); await p.waitForTimeout(200);
 ok(await p.evaluate(()=>rotCur().items.every(it=>window.__arsh.L().widgets.find(w=>w.id===it.ref).mir==='left')),'«تطبيق الاتجاه على جميع قوائم المجموعة» in Smart Rotation');
 ok(errs.length===0,'no page errors '+errs.slice(0,3).join(' | '));
 console.log(`mirror: ${pass} passed, ${fail} failed`); await b.close();
})();
