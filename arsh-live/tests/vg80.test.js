const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const url='file:///home/claude/najd/demo/index.html';
const TEN=["palmSwords","goldenPalm","dallah","falcon","diriyah","royalChest","dragon","reactor","b6o6Cup","goldenDuck"];
(async()=>{
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:1440,height:1000}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto(url); await p.evaluate(()=>localStorage.clear()); await p.goto(url);
 // كل تصميم: الأجزاء/السائل تتبع النسبة فعلياً
 const res=await p.evaluate(TEN=>TEN.map(id=>{ const st=document.createElement('div'); st.style.cssText='position:fixed;left:0;top:0;width:300px;height:300px'; document.body.appendChild(st);
  const w=newWidget("sgoal",{design:id,source:"custom",base:65,target:100,x:0,y:0,w:1,h:1}); const v=new View(w,{w:300,h:300},{}); st.appendChild(v.el); v.refresh({D:emptyData()},true);
  const fc=[...v.el.querySelectorAll('.vg-fc')], lit=fc.filter(e=>e.classList.contains('lit')).length, liq=v.el.querySelector('.vg-liq');
  const r={id,p:+getComputedStyle(v.el).getPropertyValue('--p'),n:fc.length,lit,liq:liq?liq.style.transform:"",cls:v.el.className}; st.remove(); return r }),TEN);
 for(const r of res) ok(Math.abs(r.p-.65)<1e-6&&(r.n?Math.abs(r.lit-Math.floor(r.n*.65))<=1:r.liq.includes('translateY')),`${r.id}: 65% → ${r.n?`${r.lit}/${r.n} parts lit`:"liquid "+r.liq}`);
 ok(res.every(r=>/vst-2/.test(r.cls)),'all 10 at stage 2 (65%)');
 // مكتبة: مجموعة السعودية
 await p.click('.nav [data-go="library"]'); await p.click('[data-libtab="goals"]'); await p.waitForTimeout(400);
 const tag=await p.evaluate(()=>[...document.querySelectorAll('[data-gcat2="saudi"] .tag')].map(t=>t.textContent)[0]); ok(tag==='5/20','Saudi collection shown with real progress ('+tag+')');
 await p.click('[data-gcat2="saudi"]'); await p.waitForTimeout(500); ok(await p.evaluate(()=>document.querySelectorAll('#lib .libc .vgw').length)===5,'5 Saudi designs render live previews');
 // حدث حقيقي يملأ الدلة
 await p.click('.nav [data-go="boards"]'); await p.click('[data-add-vg="goldCup"]'); await p.waitForTimeout(200);
 const gid=await p.evaluate(()=>{ const w=window.__arsh.L().widgets.find(x=>x.type==='sgoal'); w.design='dallah'; w.target=4; return w.id });
 await p.click('.nav [data-go="studio"]'); await p.waitForTimeout(300);
 await p.evaluate(()=>window.__arsh.send({t:"sim",ev:{id:"LL",type:"gift",user:{id:"m",name:"محمد"},gift:"أسد",giftId:6369,diamonds:29999,value:2*29999,count:2,test:true}})); await p.waitForTimeout(400);
 const s=await p.evaluate(id=>{const e=document.querySelector(`#stage .wd[data-id="${id}"]`); return {p:+getComputedStyle(e).getPropertyValue('--p'),pop:e.querySelector('.vg-pop')?.textContent||''}},gid);
 ok(Math.abs(s.p-.5)<1e-6&&s.pop.includes('محمد'),'real gift fills the dallah to 50% + popup');
 ok(errs.length===0,'no page errors '+errs.join(' | '));
 await b.close();
})();
