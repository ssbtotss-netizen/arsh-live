const { chromium } = require('/opt/npm-tools/node_modules/playwright');
(async()=>{
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:1440,height:1000}}); await ctx.grantPermissions(['clipboard-read','clipboard-write']);
 const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file:///home/claude/najd/demo/index.html'); await p.evaluate(()=>localStorage.clear()); await p.goto('file:///home/claude/najd/demo/index.html');
 const st=await p.evaluate(()=>{ const A=LB_ART_DESIGNS; const sig=A.map(d=>[d.arr,d.frame,d.rk,d.nm,d.amb,d.d1].join("|"));
  return {n:A.length,ids:new Set(A.map(d=>d.id)).size,uniq:new Set(sig).size,arrs:new Set(A.map(d=>d.arr)).size,cats:Object.fromEntries(["legRoyal","legFlower","legGaming","legGalaxy","legMinimal","legSaudi"].map(c=>[c,A.filter(d=>d.cat===c).length])),cels:Object.keys(LB_CELS).length,total:LB_DESIGNS.length,
   minDiff:Math.min(...A.flatMap((x,i)=>A.slice(i+1).map(y=>["arr","frame","rk","nm","amb","d1"].filter(k=>x[k]!==y[k]).length)))} });
 ok(st.n===60&&st.ids===60&&st.uniq===60,'60 new unique designs');
 ok(st.minDiff>=2,'every pair differs in ≥2 structural parts (not colour only): min='+st.minDiff);
 ok(st.arrs===15,'15 different arrangements used');
 ok(Object.values(st.cats).every(v=>v===10),'6 collections × 10');
 ok(st.cels===15,'15 first-place celebrations'); ok(st.total>=244,'previous designs kept, total '+st.total);
 // كل ترتيب يعطي أماكن داخل الحدود لكل الأعداد
 const bad=await p.evaluate(()=>{ const out=[]; for(const a of Object.keys(LB_ARRS)) for(const N of [1,3,5,10,15,20]){ const S=lbArtSlots(a,N,600,700,8); for(let i=0;i<N;i++){ const s=S[i]; if(!s||!(s.w>4)||s.x<-2||s.y<-2||s.x+s.w>602||s.y+s.h>702.5) out.push(a+":"+N+":"+i) } } return out });
 ok(bad.length===0,'all arrangements fit for 1/3/5/10/15/20 ('+bad.slice(0,5).join(",")+')');
 // ودجت حقيقي في الاستوديو بتصميم أسطوري
 for(let i=0;i<6;i++) await p.evaluate(i=>window.__arsh.send({t:"sim",ev:{type:"gift",user:{id:"u"+i,name:"داعم "+i},gift:"وردة",giftId:1,count:1,value:(7-i)*100}}),i);
 const id=await p.evaluate(()=>{ const L=window.__arsh.L(); L.widgets=L.widgets.filter(x=>x.type!=="lb"); const w=newWidget("lb",{design:"goldenLion",topN:5,source:"gifts",x:.1,y:.1,w:.8,h:.6}); L.widgets.push(w); return w.id });
 await p.click('.nav [data-go="studio"]'); await p.waitForTimeout(800);
 const v=await p.evaluate(()=>{ const e=document.querySelector('.stage .lbw.lbl-art'); if(!e) return null; const cs=getComputedStyle(e); return {bg:cs.backgroundColor,bgi:cs.backgroundImage,rows:e.querySelectorAll('.lr:not(.emp)').length,tok:e.querySelectorAll('.lr.k-tok').length,d1:!!e.querySelector('.lr.r1 .d1 svg'),amb:e.querySelector('.lbx-amb')!==null,top:e.querySelector('.lr.r1 .lr-nm').textContent} });
 ok(v&&v.bg==='rgba(0, 0, 0, 0)'&&v.bgi==='none','transparent widget background (no big rectangle)');
 ok(v&&v.rows===5&&v.tok===5&&v.d1,'ring layout: 5 supporters as tokens + lion around #1');
 ok(v&&v.top==='داعم 0','correct leader');
 // تغيير المركز الأول → احتفال + انتقال
 await p.evaluate(()=>window.__arsh.send({t:"sim",ev:{type:"gift",user:{id:"u4",name:"داعم 4"},gift:"أسد",giftId:2,count:1,value:2000}})); await p.waitForTimeout(300);
 const c=await p.evaluate(()=>{ const e=document.querySelector('.stage .lbw.lbl-art'); return {top:e.querySelector('.lr.r1 .lr-nm').textContent,cel:e.querySelectorAll('.fxl .lb-celbig,.fxl .lb-cel').length,newtop:!!e.querySelector('.lr.newtop')} });
 ok(c.top==='داعم 4'&&c.newtop,'rank change: new leader moves to #1');
 ok(c.cel>0,'first-place celebration shown ('+c.cel+' parts)');
 // التصميم الخاص
 await p.evaluate(id=>{ const w=window.__arsh.L().widgets.find(x=>x.id===id); Object.assign(w,{design:"lbCustom",cArr:"crescent",cFrame:"hex",cRk:"ribbon",cNm:"glass",cAmb:"butterflies",cD1:"wings"}) },id);
 await p.click('.nav [data-go="home"]'); await p.click('.nav [data-go="studio"]'); await p.waitForTimeout(700);
 const cu=await p.evaluate(()=>{ const e=document.querySelector('.stage .lbw.lbl-art'); return e&&[...e.classList].filter(c=>/^(lba|lbfr|lbrk|lbnm)-/.test(c)).sort().join(" ")+" bf="+e.querySelectorAll('.lbx-amb .am-fly svg .bwl').length });
 ok(/lba-crescent/.test(cu)&&/lbfr-hex/.test(cu)&&/lbrk-ribbon/.test(cu)&&/lbnm-glass/.test(cu)&&/bf=[1-9]/.test(cu),'custom builder applies chosen parts: '+cu);
 // المكتبة: المجموعات + نسخ رابط OBS
 await p.click('.nav [data-go="library"]'); await p.click('[data-libtab="pro"]'); await p.waitForTimeout(500); await p.click('[data-lbcat="legFlower"]'); await p.waitForTimeout(1200);
 ok(await p.locator('#lib .libc').count()===10&&await p.evaluate(()=>[...document.querySelectorAll('#lib .libc .lbx-amb')].length===10),'collection shows 10 live previews');
 ok(await p.evaluate(()=>document.querySelectorAll('#lib .am-fly .bwl').length)>3,'butterflies drawn with independently flapping wings');
 await p.click('[data-lbobs="butterflyGarden"]'); await p.waitForTimeout(300);
 ok(/only=/.test(await p.evaluate(()=>navigator.clipboard.readText())),'OBS link copied for design');
 await p.click('[data-lbt="still"]'); ok(await p.evaluate(()=>document.getElementById('lib').classList.contains('pv-still')),'stop-motion toggle');
 ok(errs.length===0,'no page errors '+errs.join(' | '));
 await b.close();
})();
