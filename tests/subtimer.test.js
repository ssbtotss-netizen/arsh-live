// الاختبارات الإلزامية: B6O6 Streaming – Fantastic Timer Collection V3 (50 تصميم مؤقت سابثون)
const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const url='file:///home/claude/najd/demo/index.html';
(async()=>{
 let pass=0, fail=0; const ok=(c,m)=>{ if(c){pass++;console.log('PASS '+m)} else {fail++;console.log('FAIL '+m);process.exitCode=1} };
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:1440,height:900}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto(url); await p.evaluate(()=>localStorage.clear()); await p.goto(url);
 const sim=ev=>p.evaluate(ev=>window.__arsh.send({t:'sim',ev}),ev);

 // 1. السجل: 50 تصميماً بأسماء ومجموعات المواصفات
 const R1=await p.evaluate(()=>({n:ST_DESIGNS.length,ids:new Set(ST_DESIGNS.map(d=>d.id)).size,first:ST_DESIGNS[0].name,last:ST_DESIGNS[49].name,grp:Object.keys(ST_GROUPS).map(g=>ST_DESIGNS.filter(d=>d.grp===g).length),combo:new Set(ST_DESIGNS.map(d=>d.lay+"|"+d.dig+"|"+d.add)).size,adds:new Set(ST_DESIGNS.map(d=>d.add)).size,missing:ST_DESIGNS.filter(d=>!ST_ADD[d.add]||!ST_SUB[d.sub]||!ST_NEAR[d.near]).map(d=>d.name)}));
 ok(R1.n===50&&R1.ids===50,'1. 50 designs with unique ids');
 ok(R1.first==='Pure Time'&&R1.last==='B6O6 Signature'&&R1.grp.join()==='10,10,10,10,10','1. names and 5 groups ×10 match the spec');
 ok(R1.combo===50&&R1.adds===50&&!R1.missing.length,'1. every design has its own (layout, digits, add effect) and all effects exist');

 // 2. Animation Registry: بصمة فعلية مختلفة لكل مؤثر زيادة (50) ونقصان
 const R2=await p.evaluate(()=>{ const host=document.createElement('div'); host.style.cssText='position:fixed;left:0;top:0;width:400px;height:200px'; document.body.appendChild(host); const fp={}, sub={};
  for(const d of ST_DESIGNS){ const w=newWidget('subathon',{design:d.id,x:0,y:0,w:1,h:1}); const v=new View(w,{w:400,h:200},{data:SRC}); host.appendChild(v.el); v.refresh(SRC(),true); fp[d.add]=stTrace(v,'add',d.add).join(';'); if(!sub[d.sub]) sub[d.sub]=stTrace(v,'sub',d.sub).join(';'); v.el.remove() }
  host.remove(); const F=Object.values(fp), S2=Object.values(sub); return {n:F.length,u:new Set(F).size,empty:Object.entries(fp).filter(([k,v])=>!v).map(([k])=>k),sn:S2.length,su:new Set(S2).size} });
 ok(R2.n===50&&R2.u===50&&!R2.empty.length,'2. 50 add effects with 50 distinct real motion fingerprints'+(R2.empty.length?' empty:'+R2.empty:''));
 ok(R2.su===R2.sn&&R2.sn>=6,'2. decrease effects are separate and distinct ('+R2.sn+')');

 // 3. التنسيقات الطويلة (بدون تصفير بعد 24 ساعة)
 const H=3600000, M=60000;
 const R3=await p.evaluate(([H,M])=>{ const t=(ms,o)=>{ const u=stUnits(ms,o); return u.words??((u.days?u.days+' | ':'')+u.u.map(x=>x.v+(o&&o.fmt==='units'?x.l:'')).join(':')) };
  return [t(5*H+30*M+25e3),t(48*H+30*M+25e3),t(125*H+30*M+25e3),t(53*H,{fmt:'words'}),t(5*24*H+12*H+30*M+25e3,{fmt:'dhms'}),t(5*24*H+12*H+30*M+25e3,{fmt:'units'}),t(5*H+30*M,{showS:false})] },[H,M]);
 ok(R3[0]==='05:30:25'&&R3[1]==='48:30:25'&&R3[2]==='125:30:25','3. hms: 05:30:25 · 48:30:25 · 125:30:25');
 ok(R3[3]==='يومان و5 ساعات','3. words: '+R3[3]); ok(R3[4]==='5 أيام | 12:30:25','3. days: '+R3[4]); ok(R3[5]==='05D:12H:30M:25S','3. units: '+R3[5]); ok(R3[6]==='05:30','3. hide seconds unit');

 // 4. التشغيل الحقيقي: عنصر بتصميم V3، بدء، 30 وردة ثم 100 وردة → الرقم = المصدر المركزي
 await p.evaluate(()=>go('subathon')); await p.waitForTimeout(300); await p.click('[data-sa-op="start"]'); await p.waitForTimeout(300);
 const wid=await p.evaluate(()=>{ const l=window.__arsh.L(); const w=newWidget('subathon',{design:'st_royalGold',stEvo:true}); l.widgets.push(w); save(); pushLayout(); return w.id });
 const href=await p.evaluate(id=>overlayURL(window.__arsh.L(),id),wid);
 const o=await ctx.newPage(); o.on('pageerror',e=>errs.push('obs '+e.message)); await o.setViewportSize({width:1280,height:720}); await o.goto(href); await o.waitForTimeout(800);
 const shown=()=>o.evaluate(()=>{ const n=document.querySelector('.stw .st-num'); return n?n.textContent.replace(/[^\d:]/g,''):'' });
 const real=()=>p.evaluate(()=>{ const s=window.__arsh.R().C.subathon; const r=Math.ceil(remaining(s,Date.now())/1000); return {end:s.endsAt,txt:String(Math.floor(r/3600)).padStart(2,'0')+':'+String(Math.floor(r/60)%60).padStart(2,'0')+':'+String(r%60).padStart(2,'0'),add:s.totalAddedMs,st:s.status} });
 const setT=ms=>p.evaluate(ms=>{ const s=window.__arsh.R().C.subathon; clockOp('subathon','add',{ms:ms-remaining(s,Date.now()),source:'manual',reason:'test'}) },ms);
 const near=(a,b)=>{ const f=x=>x.split(':').reduce((t,v)=>t*60+ +v,0); return Math.abs(f(a)-f(b))<=2 };
 let r0=await real(), s0=await shown(); ok(r0.st==='running'&&near(s0,r0.txt),'4. OBS shows the central time ('+s0+' vs '+r0.txt+')');
 await sim({id:'g30',type:'gift',giftId:5655,gift:'Rose',diamonds:1,count:30,value:30,repeatEnd:true,user:{name:'سارة',id:'u1'}}); await o.waitForTimeout(900);
 const r1=await real(), s1=await shown(), note1=await o.evaluate(()=>[...document.querySelectorAll('.stw .st-note')].map(n=>n.textContent).join('|'));
 ok(r1.add>r0.add&&near(s1,r1.txt),'4. 30 roses added time and display follows ('+s1+')');
 ok(/\+/.test(note1),'4. add notice shown in OBS ('+note1+')');
 await sim({id:'g100',type:'gift',giftId:5655,gift:'Rose',diamonds:1,count:100,value:100,repeatEnd:true,user:{name:'فهد',id:'u2'}}); await o.waitForTimeout(900);
 const r2=await real(), s2=await shown(); ok(r2.add>r1.add&&near(s2,r2.txt),'4. 100 roses added time ('+s2+')');

 // 5. نقص الوقت
 await p.evaluate(()=>clockOp('subathon','add',{ms:-5*60000,source:'manual'})); await o.waitForTimeout(900);
 const r3=await real(), s3=await shown(), neg=await o.evaluate(()=>!!document.querySelector('.stw .st-note.neg'));
 ok(near(s3,r3.txt)&&neg,'5. subtract time: display follows and negative notice ('+s3+')');

 // 6. تغيير التصميم أثناء البث لا يغيّر الوقت
 const before=await real(); await p.evaluate(id=>{ const w=findW(id); w.design='st_gamingHUD'; save(); pushLayout() },wid); await o.waitForTimeout(900);
 const after=await real(), s4=await shown(), cls=await o.evaluate(()=>document.querySelector('.stw').className);
 ok(/st_gamingHUD/.test(cls)&&near(s4,after.txt)&&after.add===before.add,'6. live design change keeps time and totals ('+s4+')');

 // 7. أكثر من 24/48/100 ساعة (حد أقصى أعلى)
 await p.evaluate(()=>clockOp('subathon','config',{config:{maxMs:0}}));
 for(const h of [30,50,125]){ await setT(h*3600000); await o.waitForTimeout(700); const s=await shown(); ok(s.startsWith(String(h)+':'),'7. '+h+'h shows '+s) }

 // 8. التطور: مراحل بنائية حقيقية
 const ev=await o.evaluate(()=>[...document.querySelector('.stw').classList].filter(c=>/^st-ev\d/.test(c)).length);
 const stage=await o.evaluate(()=>document.querySelector('.stw .st-stage').textContent);
 ok(ev>=7&&stage==='Infinite','8. evolution at 125h: '+ev+' structural layers, stage '+stage);
 await setT(2*3600000); await o.waitForTimeout(700);
 const ev2=await o.evaluate(()=>[...document.querySelector('.stw').classList].filter(c=>/^st-ev\d/.test(c)).length);
 ok(ev2===1,'8. evolution "current" mode drops back (Bronze at 2h → '+ev2+')');
 await p.evaluate(id=>{ const w=findW(id); w.stEvoMode='highest'; save(); pushLayout() },wid); await setT(13*3600000); await o.waitForTimeout(700); await setT(2*3600000); await o.waitForTimeout(700);
 const st3=await o.evaluate(()=>document.querySelector('.stw .st-stage').textContent); ok(st3==='Diamond','8. "keep highest" holds Diamond after dropping ('+st3+')');

 // 9. الشفافية للـ OBS/TikTok
 const tr=await o.evaluate(()=>{ const e=document.querySelector('.stw'); const bg=getComputedStyle(document.body).backgroundColor; const b2=getComputedStyle(e.querySelector('.st-bg')).backgroundColor; return bg+'|'+b2 });
 ok(/rgba\(0, 0, 0, 0\)|transparent/.test(tr.split('|')[0])&&/rgba\(0, 0, 0, 0\)/.test(tr.split('|')[1]),'9. transparent page and design background ('+tr+')');
 await p.evaluate(id=>{ const w=findW(id); Object.assign(w,stPreset('numbers')); save(); pushLayout() },wid); await o.waitForTimeout(600);
 const pn=await o.evaluate(()=>({t:getComputedStyle(document.querySelector('.stw .st-t')).display,f:getComputedStyle(document.querySelector('.stw .st-hudsvg')).display}));
 ok(pn.t==='none'&&pn.f==='none','9. "Numbers Only" preset hides title and frame');

 // 10. العد التنازلي الأخير
 await setT(5*60000); await o.waitForTimeout(600); const fc1=await o.evaluate(()=>document.querySelector('.stw').classList.contains('st-fc-warn'));
 await setT(40000); await o.waitForTimeout(600); const fc2=await o.evaluate(()=>document.querySelector('.stw').classList.contains('st-fc-count'));
 await setT(6000); await o.waitForTimeout(600); const fc3=await o.evaluate(()=>document.querySelector('.stw').classList.contains('st-fc-last'));
 ok(fc1&&fc2&&fc3,'10. final countdown stages warn/count/last ('+[fc1,fc2,fc3]+')');

 // 11. أحداث الأصوات: بقيت 10 دقائق/دقيقة + الوصول لساعة/24
 const L=await p.evaluate(()=>{ const s={status:'running',endsAt:0,remainingMs:0,initialMs:0,totalAddedMs:0,logs:[]}; const now=1e9, out=[]; const at=(ms,t)=>{ s.endsAt=t+ms; out.push(...subathonTick(s,t).map(l=>l.sa)) };
  at(30*60000,now); at(10*60000-500,now+1000); at(59000,now+2000); at(2*3600000,now+3000); at(25*3600000,now+4000); at(9*60000,now+5000); return out.join(',') });
 ok(/left10/.test(L)&&/left1/.test(L)&&/reach1/.test(L)&&/reach24/.test(L),'11. tick emits left10/left1/reach1/reach24 ('+L+')');
 const evs=await p.evaluate(()=>['sa_left60','sa_left10','sa_left1','sa_reach1','sa_reach24'].every(k=>SND_EVENTS[k]));
 ok(evs,'11. new sound events registered in the sound system');

 // 12. المكتبة: 50 بطاقة، المعاينة لا تلمس الوقت الحقيقي، استخدام/مفضلة
 await setT(3600000); await p.waitForTimeout(300);
 await p.evaluate(id=>{ S.stTarget=id },wid); await p.evaluate(()=>go('stlib')); await p.waitForTimeout(900);
 const cards=await p.evaluate(()=>document.querySelectorAll('[data-stcard]').length); ok(cards===50,'12. library shows 50 designs');
 const mounted=await p.evaluate(()=>[...document.querySelectorAll('[data-stpv]')].filter(h=>h.__v).length); ok(mounted>0&&mounted<50,'12. only visible previews are mounted ('+mounted+'/50)');
 const ra=await real(); await p.click('[data-stx="add"][data-id="st_pureTime"]'); await p.click('[data-stx="big"][data-id="st_pureTime"]'); await p.click('[data-stx="sub"][data-id="st_pureTime"]'); await p.click('[data-stx="end"][data-id="st_pureTime"]'); await p.waitForTimeout(400); const rb=await real();
 ok(ra.add===rb.add&&ra.end===rb.end&&rb.st==='running','12. preview add/sub/end do not touch real time '+JSON.stringify([ra,rb]));
 await p.click('[data-stx="fav"][data-id="st_hourglass"]'); await p.waitForTimeout(200); const fav=await p.evaluate(()=>S.settings.stFav.includes('st_hourglass')); ok(fav,'12. favourite saved');
 await p.click('[data-stx="use"][data-id="st_hourglass"]'); await p.waitForTimeout(700); const cls2=await o.evaluate(()=>document.querySelector('.stw').className); const rc=await real();
 ok(/st_hourglass/.test(cls2)&&rc.add===rb.add,'12. "use" applies to OBS without resetting '+cls2.slice(0,60)+JSON.stringify(rc));

 // 13. استعادة الحالة بعد إعادة الاتصال (إعادة تحميل OBS)
 await o.reload(); await o.waitForTimeout(1000); await p.evaluate(()=>pushLayout()); await o.waitForTimeout(600); const rr=await real(), sr=await shown(); ok(near(sr,rr.txt)&&/st_hourglass/.test(await o.evaluate(()=>document.querySelector('.stw').className)),'13. reload restores design and time ('+sr+')');

 // 14. حفظ الإعدادات
 await p.reload(); await p.waitForTimeout(800); const keep=await p.evaluate(id=>{ const w=findW(id); return w&&w.design==='st_hourglass'&&w.stEvoMode==='highest' },wid); ok(keep,'14. settings persist after dashboard reload');

 // 15. العرض الكامل في الاستوديو + لوحة الخصائص
 await p.evaluate(id=>{ S.sel=id; go('studio') },wid); await p.waitForTimeout(800); const props=await p.evaluate(()=>!!document.querySelector('.st-props')&&document.querySelectorAll('.st-props details').length); ok(props>=6,'15. studio props panel with '+props+' sections');

 // 16. وضع الاستكشاف/الخفيف لا يكسر
 const lite=await o.evaluate(()=>{ window.__arshExplore=1; const v=[...document.querySelectorAll('.stw')]; return v.length }); ok(lite===1,'16. explore flag tolerated');

 ok(!errs.length,'no page errors '+errs.slice(0,3).join(' | '));
 console.log(`\n${pass} passed, ${fail} failed`); await b.close() })();
