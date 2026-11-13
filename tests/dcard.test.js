// طبقتا «آخر دعم» و«آخر 5 داعمين»: دعم حقيقي، تجربة لا تُعرض، السادس يُخرج الأقدم، بدون تكرار، الحركة المتعرجة، النيون، الألوان، الحفظ، النسخ لمشهد آخر
const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const url='file:///home/claude/najd/demo/index.html';
(async()=>{
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:1440,height:1000}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto(url); await p.evaluate(()=>localStorage.clear()); await p.goto(url);
 await p.click('.nav [data-go="donations"]'); await p.waitForTimeout(200); await p.click('[data-dontab="widgets"]'); await p.waitForTimeout(200);
 ok(await p.$('[data-don-addw="donCard"]')&&await p.$('[data-don-addw="donLast5"]'),'الطبقتان متاحتان في عناصر الدونيشن');
 ok((await p.$$('[data-don-addw="donText"]')).length===1,'زر «آخر دعم نصي» لم يعد مكرراً');
 await p.click('[data-don-addw="donCard"]'); await p.waitForTimeout(200); await p.click('[data-don-addw="donLast5"]'); await p.waitForTimeout(200);
 const ids=await p.evaluate(()=>{ const W=window.__arsh.L().widgets; return {c:W.find(w=>w.type==="donCard").id,f:W.find(w=>w.type==="donLast5").id} });
 const send=ev=>p.evaluate(ev=>window.__arsh.send({t:"sim",ev}),ev);
 await p.click('.nav [data-go="studio"]'); await p.waitForTimeout(400);
 const card=()=>p.evaluate(id=>{ const c=document.querySelector(`#stage .wd[data-id="${id}"] .dc-card:not(.dc-out)`); if(!c) return null; const q=s=>{ const e=c.querySelector(s); return e?e.textContent.replace(/ /g," ").trim():null }; return {ph:c.classList.contains('dc-ph'),badge:q('.dc-badge'),amt:q('.dc-amt'),name:q('.dc-name'),thx:q('.dc-thx')} },ids.c);
 const rows=()=>p.evaluate(id=>[...document.querySelectorAll(`#stage .wd[data-id="${id}"] .d5-row`)].filter(r=>!r.classList.contains('d5-empty')).map(r=>r.querySelector('.d5-rank').textContent+"."+r.querySelector('.d5-name').textContent+"="+r.querySelector('.d5-amt').textContent.replace(/ /g," ").trim()),ids.f);
 let c=await card(); ok(c&&c.ph,'قبل أي دعم: المحرر يعرض «بانتظار أول دعم» فقط (لا بيانات وهمية)');
 ok((await rows()).length===0,'آخر 5: فاضية قبل أي دعم');
 await send({id:"T1",type:"donation",provider:"test",test:true,name:"تجربة",amount:999,currency:"USD"}); await p.waitForTimeout(300);
 c=await card(); ok(c.ph&&(await rows()).length===0,'دعم تجريبي لا يظهر في الطبقتين');
 await send({id:"D1",type:"donation",provider:"streamlabs",name:"أحمد",amount:21,currency:"USD"}); await p.waitForTimeout(400);
 c=await card(); ok(!c.ph&&c.badge==="آخر دعم"&&c.amt==="$21"&&c.name==="أحمد"&&c.thx==="شكراً على دعمك",'دعم حقيقي يحدّث «آخر دعم» لحظياً: '+JSON.stringify(c));
 for(const [i,n,a,cur] of [[2,"محمد",50,"USD"],[3,"خالد",25,"USD"],[4,"فيصل",20,"USD"],[5,"عبدالله",375,"SAR"]]) await send({id:"D"+i,type:"donation",provider:"streamlabs",name:n,amount:a,currency:cur});
 await p.waitForTimeout(500);
 let r=await rows(); ok(r.length===5&&r[0].startsWith("1.عبدالله")&&/375/.test(r[0])&&/ر\.س|SAR/.test(r[0])&&r[4].startsWith("5.أحمد"),'5 داعمين، الأحدث أولاً وبعملته الصحيحة: '+r.join(' | '));
 await send({id:"D5",type:"donation",provider:"streamlabs",name:"عبدالله",amount:375,currency:"SAR"}); await p.waitForTimeout(300);
 ok((await rows()).join()===r.join(),'نفس الحدث مرتين لا يتكرر');
 await send({id:"D6",type:"donation",provider:"streamlabs",name:"نورة",amount:10,currency:"USD"}); await p.waitForTimeout(400);
 r=await rows(); ok(r.length===5&&r[0].startsWith("1.نورة")&&!r.some(x=>x.includes("أحمد")),'الدعم السادس يدخل أولاً ويخرج الأقدم: '+r.join(' | '));
 c=await card(); ok(c.name==="نورة"&&c.amt==="$10",'«آخر دعم» يستبدل الدعم السابق');
 // تخصيص البطاقة
 await p.click(`#stage .wd[data-id="${ids.c}"]`); await p.waitForTimeout(300);
 ok(await p.$(`[data-dcpv="${ids.c}"] .dc-card`),'معاينة مباشرة داخل لوحة التخصيص');
 await p.click(`[data-lctog="lcShowSym"][data-wid="${ids.c}"]`); await p.waitForTimeout(200); c=await card(); ok(c.amt==="10","إخفاء رمز العملة");
 await p.click(`[data-lctog="lcShowName"][data-wid="${ids.c}"]`); await p.waitForTimeout(200); c=await card(); ok(c.name===null,"إخفاء اسم الداعم");
 await p.click(`[data-lctog="lcShowThx"][data-wid="${ids.c}"]`); await p.waitForTimeout(200); c=await card(); ok(c.thx===null,"إخفاء عبارة الشكر");
 await p.click(`[data-lctog="lcShowThx"][data-wid="${ids.c}"]`); await p.click(`[data-lctog="lcShowName"][data-wid="${ids.c}"]`); await p.click(`[data-lctog="lcShowSym"][data-wid="${ids.c}"]`); await p.waitForTimeout(200);
 await p.fill(`[data-wf="lcThx"][data-wid="${ids.c}"]`,'الله يعطيك العافية'); await p.waitForTimeout(250); c=await card(); ok(c.thx==="الله يعطيك العافية","عبارة شكر مخصصة");
 const setv=async(f,v,ev='input')=>{ await p.evaluate(([id,f,v,ev])=>{ const i=document.querySelector(`[data-wf="${f}"][data-wid="${id}"]`); if(i.tagName==='SELECT'){ i.value=v; i.dispatchEvent(new Event('change',{bubbles:true})) } else { i.value=v; i.dispatchEvent(new Event(ev,{bubbles:true})); i.dispatchEvent(new Event('change',{bubbles:true})) } },[ids.c,f,v,ev]); await p.waitForTimeout(200) };
 const css=sel=>p.evaluate(([id,sel])=>{ const e=document.querySelector(`#stage .wd[data-id="${id}"] ${sel}`); const s=getComputedStyle(e); return {color:s.color,bg:s.backgroundColor,bi:s.backgroundImage,filter:s.filter,bc:s.borderTopColor,bw:s.borderTopWidth,rad:s.borderTopLeftRadius,fs:s.fontSize,op:s.opacity} },[ids.c,sel]);
 await p.click('[data-lctab="colors"]'); await p.waitForTimeout(200);
 await setv('lcAmtC','#ff00ff'); await setv('lcNameC','#00ffff'); await setv('lcBgC','#123456'); await setv('lcBgA','0.5'); await setv('lcBorderC','#ff8800'); await setv('lcBw','3'); await setv('lcBadgeBg','#0000ff'); await setv('lcThxC','#ffff00');
 const A=await css('.dc-amt'), N=await css('.dc-name'), C=await css('.dc-card'), B=await css('.dc-badge'), T=await css('.dc-thx');
 ok(A.color==='rgb(255, 0, 255)'&&N.color==='rgb(0, 255, 255)'&&T.color==='rgb(255, 255, 0)','ألوان المبلغ والاسم والشكر مستقلة');
 ok(C.bg==='rgba(18, 52, 86, 0.5)'&&C.bc==='rgb(255, 136, 0)'&&C.bw==='3px'&&B.bg==='rgb(0, 0, 255)','لون وشفافية الخلفية + لون وسمك الإطار + لون الشارة: '+JSON.stringify([C.bg,C.bc,C.bw,B.bg]));
 await setv('lcAmtMode','grad'); await setv('lcAmtC2','#00ff00'); const G=await css('.dc-amt'); ok(/linear-gradient/.test(G.bi)&&G.color==='rgba(0, 0, 0, 0)','لون متدرّج للمبلغ');
 await setv('lcAmtA','0.5'); ok((await css('.dc-amt')).op==='0.5','شفافية المبلغ');
 await p.click('[data-lctab="fx"]'); await p.waitForTimeout(200);
 ok(/drop-shadow/.test((await css('.dc-amt')).filter),'النيون مفعّل افتراضياً على المبلغ');
 await setv('lcNeonC','#ff0000'); ok(/255, 0, 0/.test((await css('.dc-amt')).filter),'لون النيون مستقل عن لون المبلغ');
 const f1=(await css('.dc-amt')).filter; await setv('lcNeonSpread','2.5'); ok((await css('.dc-amt')).filter!==f1,'انتشار الإضاءة يغيّر التوهج');
 await setv('lcNeonStr','1.8'); ok(((await css('.dc-amt')).filter.match(/drop-shadow/g)||[]).length===3,'شدة أعلى = طبقة توهج إضافية');
 await setv('lcNeon','0'); ok((await css('.dc-amt')).filter==='none','إيقاف النيون = نص عادي بدون توهج');
 await setv('lcNeon','1'); await setv('lcFxOff','1'); ok((await css('.dc-amt')).filter==='none','«إيقاف كل المؤثرات» يلغي التوهج');
 await setv('lcFxOff','0');
 await p.click('[data-lctab="fonts"]'); await p.waitForTimeout(200); const fs0=parseFloat((await css('.dc-amt')).fs); await setv('lcAmtS','2'); ok(parseFloat((await css('.dc-amt')).fs)>fs0*1.6,'حجم المبلغ مستقل');
 // العرض والارتفاع والموقع (محرّك الاستوديو العام)
 const box0=await p.evaluate(id=>{ const r=document.querySelector(`#stage .wd[data-id="${id}"]`).getBoundingClientRect(); return [r.width,r.height] },ids.c);
 await p.evaluate(id=>{ const i=document.querySelector(`[data-wf="w"][data-wid="${id}"]`); i.value=.8; i.dispatchEvent(new Event('input',{bubbles:true})) },ids.c); await p.waitForTimeout(200);
 const box1=await p.evaluate(id=>document.querySelector(`#stage .wd[data-id="${id}"]`).getBoundingClientRect().width,ids.c); ok(box1>box0[0]*1.3,'تغيير العرض');
 // آخر 5: الحركة المتعرجة
 await p.click(`#stage .wd[data-id="${ids.f}"]`); await p.waitForTimeout(300);
 await p.click('[data-lctab="anim"]'); await p.waitForTimeout(200);
 const sides=await p.evaluate(id=>{ const v=[...document.querySelectorAll('.d5w')].map(e=>e).length; const el=document.querySelector(`#stage .wd[data-id="${id}"]`); return null },ids.f);
 const zig=await p.evaluate(()=>{ const V=window.S&&S._dcV; return V?[0,1,2,3,4].map(i=>V.d5Side(i)):null });
 ok(zig&&zig.join()==='1,-1,1,-1,1','Zigzag: يمين، يسار، يمين، يسار، يمين: '+zig);
 // تسجيل اتجاه الدخول الفعلي من الأنيميشن
 const dirs=await p.evaluate(async id=>{ const el=document.querySelector(`#stage .wd[data-id="${id}"]`); const out=[]; const orig=Element.prototype.animate; Element.prototype.animate=function(k,o){ if(this.classList.contains('d5-row')&&k[0]&&k[0].transform&&k[1]&&k[1].transform==="none") out.push(this.dataset.i+":"+k[0].transform); return orig.call(this,k,o) };
  const w=window.__arsh.L().widgets.find(x=>x.id===id); w.l5InMs=200; w.l5Stagger=50; window.__arsh.save&&0; const i=document.querySelector(`[data-wf="l5InMs"][data-wid="${id}"]`); i.value=200; i.dispatchEvent(new Event('input',{bubbles:true}));
  await new Promise(r=>setTimeout(r,900)); Element.prototype.animate=orig; return out },ids.f);
 const stageDirs=dirs.filter((x,i,a)=>a.indexOf(x)===i).slice(0,5);
 ok(stageDirs.length>=5&&/translateX\(\d/.test(stageDirs[0])&&/translateX\(-/.test(stageDirs[1])&&/translateX\(\d/.test(stageDirs[2])&&/translateX\(-/.test(stageDirs[3]),'دخول فعلي متبادل يمين/يسار: '+stageDirs.join(' '));
 await p.evaluate(id=>{ const s=document.querySelector(`[data-wf="l5Dir"][data-wid="${id}"]`); s.value="lr"; s.dispatchEvent(new Event('change',{bubbles:true})) },ids.f); await p.waitForTimeout(300);
 ok((await p.evaluate(()=>S._dcV.d5Side(0)))===-1,'اتجاه الدخول قابل للعكس (الأول من اليسار)');
 await p.evaluate(id=>{ const s=document.querySelector(`[data-wf="l5Anim"][data-wid="${id}"]`); s.value="slide"; s.dispatchEvent(new Event('change',{bubbles:true})) },ids.f); await p.waitForTimeout(300);
 ok((await p.evaluate(()=>[0,1,2].map(i=>S._dcV.d5Side(i)).join()))==='-1,-1,-1','Slide: كل الصفوف من جهة واحدة');
 // الدورة: تختفي ثم ترجع
 await p.evaluate(id=>{ const set=(f,v)=>{ const i=document.querySelector(`[data-wf="${f}"][data-wid="${id}"]`); i.value=v; i.dispatchEvent(new Event(i.tagName==='SELECT'?'change':'input',{bubbles:true})) }; set("l5Anim","zigzag") },ids.f); await p.waitForTimeout(300);
 await p.evaluate(id=>{ const set=(f,v)=>{ const i=document.querySelector(`[data-wf="${f}"][data-wid="${id}"]`); i.value=v; i.dispatchEvent(new Event('input',{bubbles:true})) }; set("l5Hold",1); set("l5OutMs",200); set("l5Wait",.5); set("l5InMs",200); set("l5Stagger",0) },ids.f); await p.waitForTimeout(150);
 const op=()=>p.evaluate(id=>getComputedStyle(document.querySelector(`#stage .wd[data-id="${id}"] .d5-row`)).opacity,ids.f);
 await p.waitForTimeout(500); const o1=await op(); await p.waitForTimeout(1000); const o2=await op(); await p.waitForTimeout(1300); const o3=await op();
 ok(+o1>.9&&+o2<.1&&+o3>.9,`دورة متكررة: ظاهر (${o1}) ← مختفي (${o2}) ← يرجع (${o3})`);
 // النيون للمبالغ
 await p.click('[data-lctab="fx"]'); await p.waitForTimeout(200);
 await p.evaluate(id=>{ const s=document.querySelector(`[data-wf="l5Neon"][data-wid="${id}"]`); s.value="1"; s.dispatchEvent(new Event('change',{bubbles:true})) },ids.f); await p.waitForTimeout(250);
 ok(/drop-shadow/.test(await p.evaluate(id=>getComputedStyle(document.querySelector(`#stage .wd[data-id="${id}"] .d5-amt`)).filter,ids.f)),'نيون مبالغ آخر 5');
 await p.click('[data-lctab="content"]'); await p.waitForTimeout(200);
 await p.click(`[data-lctog="l5ShowRank"][data-wid="${ids.f}"]`); await p.waitForTimeout(250);
 ok(await p.evaluate(id=>getComputedStyle(document.querySelector(`#stage .wd[data-id="${id}"] .d5-rank`)).display,ids.f)==='none','إخفاء الترتيب');
 // رابط OBS / LIVE Studio: شفاف، كل طبقة لحالها، وتتحدث لحظياً
 await p.click('.nav [data-go="obs"]'); await p.waitForTimeout(250);
 const href=await p.evaluate(()=>document.querySelector('a[href*="#/overlay"]').href);
 const ob1=await ctx.newPage(); ob1.on('pageerror',e=>errs.push('ov '+e.message)); await ob1.goto(href+'&only='+ids.c); await ob1.reload(); await ob1.waitForTimeout(800);
 const ob2=await ctx.newPage(); ob2.on('pageerror',e=>errs.push('ov2 '+e.message)); await ob2.goto(href+'&only='+ids.f); await ob2.reload(); await ob2.waitForTimeout(800);
 const ov1=await ob1.evaluate(()=>({n:document.querySelectorAll('.wd').length,amt:document.querySelector('.dc-amt')?.textContent,name:document.querySelector('.dc-name')?.textContent,bg:getComputedStyle(document.body).backgroundColor,ctl:!!document.querySelector('button,input,.rh')}));
 ok(ov1.n===1&&ov1.name==="نورة"&&!ov1.ctl&&/rgba\(0, 0, 0, 0\)|transparent/.test(ov1.bg),'رابط «آخر دعم» لوحده، شفاف، بدون أزرار: '+JSON.stringify(ov1));
 const ov2=await ob2.evaluate(()=>[...document.querySelectorAll('.d5-row:not(.d5-empty) .d5-name')].map(e=>e.textContent));
 ok(ov2.length===5&&ov2[0]==="نورة"&&(await ob2.evaluate(()=>document.querySelectorAll('.wd').length))===1,'رابط «آخر 5 داعمين» لوحده: '+ov2.join('،'));
 await send({id:"D7",type:"donation",provider:"streamlabs",name:"ريم",amount:40,currency:"EUR"}); await ob1.waitForTimeout(1500);
 ok((await ob1.evaluate(()=>document.querySelector('.dc-card:not(.dc-out) .dc-name')?.textContent))==="ريم"&&/40/.test(await ob1.evaluate(()=>document.querySelector('.dc-card:not(.dc-out) .dc-amt').textContent)),'OBS: «آخر دعم» يتحدّث لحظياً بدون إعادة تحميل');
 ok((await ob2.evaluate(()=>document.querySelector('.d5-row .d5-name').textContent))==="ريم"&&(await ob2.evaluate(()=>[...document.querySelectorAll('.d5-row:not(.d5-empty)')].length))===5,'OBS: «آخر 5» يتحدّث لحظياً (ريم أولاً، يبقى 5)');
 /* إعادة الاتصال تُختبر على الخادم الحقيقي: الـ hub يرسل حالة DN المحفوظة عند الاتصال */
 await ob1.close(); await ob2.close(); await p.click('.nav [data-go="studio"]'); await p.waitForTimeout(300); await p.click(`#stage .wd[data-id="${ids.f}"]`); await p.waitForTimeout(300);
 // النسخ لمشهد آخر + الحفظ
 const dst=await p.evaluate(()=>S.layouts.find(l=>l.id!==S.active).id);
 await p.evaluate(id=>{ const s=document.querySelector(`[data-lccopy="${id}"]`); s.value=S.layouts.find(l=>l.id!==S.active).id; s.dispatchEvent(new Event('change',{bubbles:true})) },ids.f); await p.waitForTimeout(250);
 ok(await p.evaluate(()=>{ const l=S.layouts.find(x=>x.id!==S.active); return l&&l.widgets.some(w=>w.type==="donLast5"&&w.l5ShowRank===false) }),'نسخ الطبقة بإعداداتها لمشهد آخر');
 await p.goto(url); await p.waitForTimeout(500);
 const kept=await p.evaluate(ids=>{ const W=window.__arsh.L().widgets; const c=W.find(w=>w.id===ids.c), f=W.find(w=>w.id===ids.f); return c&&f&&c.lcThx==="الله يعطيك العافية"&&c.lcAmtMode==="grad"&&c.lcBw===3&&f.l5ShowRank===false&&f.l5Dir==="lr" },ids);
 ok(kept,'كل الإعدادات تبقى بعد إعادة التحميل');
 // reset
 await p.click('.nav [data-go="studio"]'); await p.waitForTimeout(300); await p.click(`#stage .wd[data-id="${ids.c}"]`); await p.waitForTimeout(250);
 await p.click(`[data-lcreset="${ids.c}"]`); await p.waitForTimeout(250);
 ok(await p.evaluate(id=>{ const w=window.__arsh.L().widgets.find(x=>x.id===id); return w.lcThx==="شكراً على دعمك"&&w.lcAmtMode==="solid" },ids.c),'↺ الإعدادات الافتراضية');
 ok(!errs.length,'no page errors '+errs.join(' | '));
 await p.screenshot({path:'/tmp/dcard.png'}); await b.close();
})();
