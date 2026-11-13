// شريط الدعم: كل الداعمين الحقيقيين بعملاتهم، حركة متواصلة يسار←يمين بلا فراغ، الدورة تبدأ فوراً، التحديث لا يعيد الحركة، OBS
const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const url='file:///home/claude/najd/demo/index.html';
(async()=>{
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:1440,height:1000}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto(url); await p.evaluate(()=>localStorage.clear()); await p.goto(url);
 await p.click('.nav [data-go="studio"]'); await p.waitForTimeout(300);
 const id=await p.evaluate(()=>{ const w=addWidget("donTicker"); renderPage(); return w.id });
 const send=ev=>p.evaluate(ev=>window.__arsh.send({t:"sim",ev}),ev);
 await send({id:"T0",type:"donation",provider:"test",test:true,name:"تجربة",amount:999,currency:"USD"});
 await send({id:"D1",type:"donation",provider:"streamlabs",name:"أحمد",amount:50,currency:"USD"}); await p.waitForTimeout(500);
 { const S1=`#stage .wd[data-id="${id}"]`; let g=0,bk=0,pv=null,txt=""; for(let i=0;i<20;i++){ const t=await p.evaluate(sel=>{ const e=document.querySelector(sel), trk=e.querySelector('.trk'); const x=parseFloat((trk.style.transform.match(/\(\s*(-?[\d.]+)px/)||[0,0])[1]); const us=[...trk.children], uw=us[0].offsetWidth; return {x,uw,cover:x<=.5&&x+us.length*uw>=e.querySelector('.scs').clientWidth-.5,n:us.length,txt:us[0].innerText} },S1); if(!t.cover) g++; if(pv!==null&&t.x<pv-1&&pv-t.x<t.uw*.5) bk++; pv=t.x; txt=t.txt; await p.waitForTimeout(80) }
  ok(g===0&&bk===0&&/أحمد/.test(txt)&&/\$50/.test(txt.replace(/\s/g,"")),'حالة 1: داعم واحد — يتكرر ليملأ الشريط ويتحرك بلا فراغ ('+txt.replace(/\s+/g," ")+')') }
 for(const [i,n,a,c] of [[2,"محمد",100,"USD"],[3,"خالد",200,"SAR"],[4,"فيصل",500,"USD"]]) await send({id:"D"+i,type:"donation",provider:"streamlabs",name:n,amount:a,currency:c});
 await p.waitForTimeout(600);
 const snap=(pg,sel)=>pg.evaluate(sel=>{ const e=document.querySelector(sel), trk=e.querySelector('.trk'), box=e.querySelector('.scs'); const x=parseFloat((trk.style.transform.match(/\(\s*(-?[\d.]+)px/)||[0,0])[1]);
  const vw=box.clientWidth, us=[...trk.children], uw=us[0].offsetWidth; const left=x, right=x+us.length*uw;
  return {x,uw,vw,n:us.length,cover:left<=0.5&&right>=vw-0.5,txt:us[0].innerText.replace(/\s+/g," ").trim(),anim:getComputedStyle(trk).animationName} },sel);
 const S=`#stage .wd[data-id="${id}"]`;
 let s=await snap(p,S);
 ok(['أحمد','محمد','خالد','فيصل'].every(n=>s.txt.includes(n)),'1. كل أسماء الداعمين ظاهرة: '+s.txt);
 ok(/50 \$|\$50/.test(s.txt)&&/100/.test(s.txt)&&/200 ر\.س/.test(s.txt)&&/500/.test(s.txt),'2. المبالغ ورموز العملات صحيحة (دولار + ريال معاً)');
 ok(!s.txt.includes('تجربة')&&!s.txt.includes('كن أول داعم'),'لا تجربة ولا نص ثابت بدل البيانات');
 ok(s.anim==='none','بدون CSS animation القديمة (الحركة بالـ JS)');
 ok((await p.evaluate(S=>document.querySelector(S+' .tk-u').querySelectorAll('.tk-div').length,`#stage .wd[data-id="${id}"]`))===4,'فاصل ✦ بين كل داعم والآخر (وعند نقطة التكرار)');
 // عيّنات متتالية: الاتجاه + التغطية + الالتفاف
 await p.evaluate(id=>{ window.__arsh.L().widgets.find(w=>w.id===id).speed=400 },id);
 const xs=[]; let gaps=0, wraps=0, back=0; let prev=null;
 for(let i=0;i<60;i++){ const t=await snap(p,S); xs.push(t.x); if(!t.cover) gaps++; if(prev!==null){ if(t.x<prev-1){ if(prev-t.x>t.uw*.5) wraps++; else back++ } } prev=t.x; await p.waitForTimeout(100) }
 ok(back===0,'3/4. يتحرك من اليسار إلى اليمين فقط (x يزيد) — تراجعات: '+back);
 ok(gaps===0,'6. الشريط مغطى بالكامل في كل لحظة (بدون فراغ) — فراغات: '+gaps);
 ok(wraps>=1,'5. الدورة التالية تبدأ فوراً (التفاف سلس بنسخة متطابقة) — مرات الالتفاف: '+wraps);
 ok(xs.every(x=>x<=0.5&&x>=-s.uw-0.5),'المحتوى يبدأ من خارج اليسار (x بين -عرض الوحدة و0)');
 await p.evaluate(id=>{ window.__arsh.L().widgets.find(w=>w.id===id).speed=110 },id);
 // ثبات السرعة بغض النظر عن طول النص
 const speed=async()=>{ const a=await snap(p,S); await p.waitForTimeout(1000); const c=await snap(p,S); let d=c.x-a.x; if(d<0) d+=a.uw; return d };
 const v1=await speed();
 for(const [i,n,a] of [[5,"عبدالرحمن القحطاني",25],[6,"نورة",10],[7,"Abdullah",75]]) await send({id:"D"+i,type:"donation",provider:"streamlabs",name:n,amount:a,currency:"USD"});
 await p.waitForTimeout(400); const v2=await speed();
 ok(Math.abs(v1-v2)<v1*.25,`السرعة ثابتة ولا تتغير مع طول النص (${Math.round(v1)} ≈ ${Math.round(v2)} px/ث)`);
 // 8. التحديث لا يعيد الحركة من البداية
 const before=await snap(p,S); await send({id:"D8",type:"donation",provider:"streamlabs",name:"ريم",amount:40,currency:"EUR"}); await p.waitForTimeout(60); const after=await snap(p,S);
 const frac=(t)=>((t.x+t.uw)/t.uw); ok(after.txt.includes('ريم')&&Math.abs(frac(after)-frac(before))<.15,'8. دعم جديد يظهر فوراً بدون إعادة الحركة من البداية ('+frac(before).toFixed(2)+' → '+frac(after).toFixed(2)+')');
 // الإعدادات
 await p.click(S); await p.waitForTimeout(300);
 const setv=async(f,v)=>{ await p.evaluate(([id,f,v])=>{ const i=document.querySelector(`[data-wf="${f}"][data-wid="${id}"]`); i.value=v; i.dispatchEvent(new Event(i.tagName==='SELECT'?'change':'input',{bubbles:true})); if(i.tagName!=='SELECT') i.dispatchEvent(new Event('change',{bubbles:true})) },[id,f,v]); await p.waitForTimeout(250) };
 await setv('tkDir','rl'); let bk=0, pv=null; for(let i=0;i<15;i++){ const t=await snap(p,S); if(pv!==null&&t.x>pv+1&&t.x-pv<t.uw*.5) bk++; pv=t.x; await p.waitForTimeout(100) } ok(bk===0,'اتجاه عكسي (يمين ← يسار) يعمل');
 await setv('tkDir','lr');
 await setv('tkAnim','0'); const s1=await snap(p,S); await p.waitForTimeout(600); const s2=await snap(p,S); ok(s1.x===s2.x,'إيقاف الحركة');
 await setv('tkAnim','1');
 await setv('tkStyle','text'); await setv('tkNameC','#ff00ff'); await setv('tkAmtC','#00ffff'); await setv('tkTxtC','#ffff00'); await setv('tkBg','#102030'); await setv('tkBgA','0.5');
 const col=await p.evaluate(S=>{ const e=document.querySelector(S); const c=q=>getComputedStyle(e.querySelector(q)).color; return [c('.tk-n'),c('.tk-a'),c('.tk-x'),getComputedStyle(e.querySelector('.scs')).backgroundColor] },S);
 ok(col.join('|')==='rgb(255, 0, 255)|rgb(0, 255, 255)|rgb(255, 255, 0)|rgba(16, 32, 48, 0.5)','ألوان الأسماء/المبالغ/النصوص + الخلفية وشفافيتها: '+col.join(' '));
 const g0=(await snap(p,S)).uw; await setv('tkGap','3'); ok((await snap(p,S)).uw>g0,'المسافة بين الداعمين');
 const h0=await p.evaluate(S=>document.querySelector(S+' .tk-it').offsetHeight,S); await setv('tkFs','1.6'); ok(await p.evaluate(S=>document.querySelector(S+' .tk-it').offsetHeight,S)>h0,'حجم الخط');
 await setv('tkCycleMode','cycle'); await p.waitForTimeout(300); await p.click(S).catch(()=>{}); await p.waitForTimeout(200); await setv('tkCycle','5');
 const c1=await snap(p,S); await p.waitForTimeout(1000); const c2=await snap(p,S); let dd=c2.x-c1.x; if(dd<0) dd+=c1.uw; ok(Math.abs(dd-c1.uw/5)<c1.uw/5*.3,`مدة الدورة 5ث ← ${Math.round(dd)}px/ث ≈ ${Math.round(c1.uw/5)}`);
 await setv('tkCurC','#ff8800'); ok(await p.evaluate(S=>getComputedStyle(document.querySelector(S+' .tk-c')).color,S)==='rgb(255, 136, 0)','لون العملة مستقل عن لون المبلغ');
 // حالة 20 داعم بأسماء طويلة وقصيرة
 await setv('topN','20');
 const names=["سعد","Mohammed Al-Otaibi","نورة","عبدالرحمن بن عبدالعزيز القحطاني","Li","فهد","Abdullah_2026_gaming","ريما","خ","سلمان العتيبي","Omar","هند","يوسف الشمري","Ali","مشاعل","ناصر","Turki","جود"];
 for(let i=0;i<names.length;i++) await send({id:"M"+i,type:"donation",provider:"streamlabs",name:names[i],amount:[5,10,25,100,1000,2.5][i%6],currency:["USD","SAR","EUR","USD","GBP","USD"][i%6]});
 await p.waitForTimeout(700);
 await p.evaluate(id=>{ window.__arsh.L().widgets.find(w=>w.id===id).speed=900 },id);
 { let g=0,bk=0,wr=0,pv=null,t; for(let i=0;i<40;i++){ t=await snap(p,S); if(!t.cover) g++; if(pv!==null){ if(t.x<pv-1){ if(pv-t.x>t.uw*.5) wr++; else bk++ } } pv=t.x; await p.waitForTimeout(90) }
  const all=names.slice(-18).every(n=>t.txt.includes(n)); const cnt=(t.txt.match(/✦/g)||[]).length;
  ok(g===0&&bk===0&&all&&cnt===20,`حالة 20 داعم بأسماء طويلة/قصيرة وعملات مختلفة: بلا فراغ (${g}) ولا رجوع (${bk})، كل الأسماء، ${cnt} فاصل، عرض الوحدة ${Math.round(t.uw)}px`) }
 await p.evaluate(id=>{ window.__arsh.L().widgets.find(w=>w.id===id).speed=110 },id);
 // 7. OBS
 await p.click('.nav [data-go="obs"]'); await p.waitForTimeout(250);
 const href=await p.evaluate(()=>document.querySelector('a[href*="#/overlay"]').href);
 const o=await ctx.newPage(); o.on('pageerror',e=>errs.push('ov '+e.message)); await o.goto(href+'&only='+id); await o.reload(); await o.waitForTimeout(900);
 const OS='.wd[data-id="'+id+'"]'; let og=0, ob=0, op=null; for(let i=0;i<30;i++){ const t=await snap(o,OS); if(!t.cover) og++; if(op!==null&&t.x<op-1&&op-t.x<t.uw*.5) ob++; op=t.x; await o.waitForTimeout(100) }
 const ot=(await snap(o,OS)).txt; ok(og===0&&ob===0&&ot.includes('جود')&&ot.includes('ريم'),'7. داخل رابط OBS: حركة متواصلة بلا فراغ وبالأسماء الحقيقية '+JSON.stringify({og,ob,ot:ot.slice(0,120)}));
 await send({id:"D9",type:"donation",provider:"streamlabs",name:"سلطان",amount:300,currency:"USD"}); await o.waitForTimeout(1200);
 const ox1=await snap(o,OS); ok(ox1.txt.includes('سلطان'),'OBS يتحدّث لحظياً عند وصول دعم جديد');
 await o.reload(); await o.waitForTimeout(1000); const rl=await snap(o,OS); let rg=0; for(let i=0;i<10;i++){ const t=await snap(o,OS); if(!t.cover) rg++; await o.waitForTimeout(80) }
 ok(rl.txt.includes('سلطان')&&rg===0,'تحديث صفحة OBS: الأسماء ترجع والحركة مستمرة بلا فراغ '+rg+' '+rl.txt.slice(0,80));
 ok(!errs.length,'no page errors '+errs.join(' | '));
 await b.close();
})();
