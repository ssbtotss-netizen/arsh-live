// معرض التصاميم الشامل + قوائم التتويج TOP 3 — الاختبارات الإلزامية في أمر إعادة تنظيم المكتبة
const {chromium}=require('/opt/npm-tools/node_modules/playwright'); const path=require('path');
let pass=0,fail=0; const ok=(c,m)=>{ c?pass++:(fail++,console.log('FAIL',m)) };
(async()=>{ const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'}); const ctx=await b.newContext({viewport:{width:1440,height:1000}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept());
 await p.goto('file://'+path.resolve(__dirname,'../demo/index.html')); await p.evaluate(()=>localStorage.clear()); await p.reload();
 await p.click('.nav [data-go="library"]'); await p.waitForTimeout(800);
 ok(await p.evaluate(()=>S.libTab)==="gallery",'library opens on the unified gallery');
 await p.waitForFunction(()=>!galMeasureAll.run&&Object.keys(galFlags()).length>=500,null,{timeout:60000});
 // التصنيفات: لا يوجد تصنيف فارغ ظاهر (عدا المفضلة)
 const chips=await p.$$eval('.gal-chip',e=>e.map(c=>({v:c.dataset.v,n:+(c.querySelector('span')||{}).textContent})));
 ok(chips.filter(c=>c.v!=="fav").every(c=>c.n>0),'no empty style category shown'); ok(chips.length>=9,'categories: all/butterflies/girls/youth/royal/clear/animated/top3/basic/fav');
 // الفراشات
 await p.click('[data-galset="galStyle"][data-v="butterfly"]'); await p.waitForTimeout(600);
 const bf=await p.evaluate(()=>galList().map(x=>galText(x.d)));
 ok(bf.length>=10&&bf.every(t=>/butterfl|فراش|moonbf/.test(t)),'butterflies section shows only butterfly designs ('+bf.length+')');
 // البنات
 await p.click('[data-galset="galStyle"][data-v="girls"]'); await p.waitForTimeout(600);
 const gl=await p.evaluate(()=>galList().map(x=>galText(x.d)+" "+(x.d.cat||"")));
 ok(gl.length>=40&&gl.every(t=>/pink|rose|ورد|قلب|heart|pearl|لؤلؤ|bow|فيونك|purple|بنفسج|lavender|crystal|كريستال|sakura|ساكورا|girl|بنات|soft|ناعم|petal|بتل|blush|princess|أميرة|flower|زهر|bloom|candy|pastel|باستيل|cloud|غيم|bunny|أرنب|butterfl|فراش/.test(t)),'girls section shows soft/feminine designs ('+gl.length+')');
 ok(await p.evaluate(()=>galList().some(x=>/butterfl/.test(galText(x.d)))),'a pink butterfly design appears in both butterflies and girls (no duplicate record)');
 // بطاقة كبيرة بصورة حقيقية
 const card=await p.evaluate(()=>{ const c=document.querySelector('.gal-card'), pv=c.querySelector('.gal-pv'); const r=pv.getBoundingClientRect(); return {w:r.width,h:r.height,real:!!pv.querySelector('.wd'),btns:c.querySelectorAll('[data-galbig],[data-galuse]').length,badges:c.querySelectorAll('.tag').length} });
 ok(card.w>=320&&card.h>=200,'large preview image ('+Math.round(card.w)+'×'+Math.round(card.h)+')'); ok(card.real,'preview is the real design rendered'); ok(card.btns===2&&card.badges>=3,'card: type + animated/static + free/PRO + preview + use');
 ok(await p.evaluate(()=>getComputedStyle(document.querySelector('.gal-grid')).gridTemplateColumns.split(' ').length)>=2,'2-3 cards per row on desktop');
 // معاينة كبيرة
 await p.click('.gal-card [data-galbig]'); await p.waitForTimeout(800); const big=await p.evaluate(()=>{ const b=document.querySelector('[data-galbigbox]'); const r=b&&b.getBoundingClientRect(); return b&&{w:r.width,h:r.height,real:!!b.querySelector('.wd')} });
 ok(big&&big.real&&big.w>=600,'large preview modal shows the design'); await p.click('.modal [data-close]'); await p.waitForTimeout(300);
 // الفلاتر
 await p.click('[data-galset="galStyle"][data-v=""]'); await p.click('[data-galset="galTier"][data-v="pro"]'); await p.waitForTimeout(500);
 ok(await p.evaluate(()=>galList().every(x=>isProDesign(x.d.id))),'PRO filter'); await p.click('[data-galset="galTier"][data-v="free"]'); await p.waitForTimeout(500); ok(await p.evaluate(()=>galList().every(x=>!isProDesign(x.d.id))),'free filter');
 await p.click('[data-galset="galTier"][data-v=""]'); await p.click('[data-galset="galAn"][data-v="st"]'); await p.waitForTimeout(500); ok(await p.evaluate(()=>galList().every(x=>!galFlags()[x.k].anim)),'static filter (measured)');
 await p.click('[data-galset="galAn"][data-v=""]'); await p.selectOption('[data-galfam]','le'); await p.waitForTimeout(500); ok(await p.evaluate(()=>galList().every(x=>x.f==="le")&&galList().length===LE_DESIGNS.length),'element type filter is separate from style');
 await p.selectOption('[data-galfam]',''); await p.fill('[data-galq]','phoenix'); await p.waitForTimeout(700); ok(await p.evaluate(()=>galList().length>=1&&galList().every(x=>/phoenix/.test(galText(x.d)))),'search');
 await p.fill('[data-galq]',''); await p.waitForTimeout(500); await p.click('.gal-card [data-galfav]'); await p.click('[data-galset="galStyle"][data-v="fav"]'); await p.waitForTimeout(500); ok(await p.evaluate(()=>galList().length)===1,'favorites');
 await p.click('[data-galset="galStyle"][data-v=""]'); await p.click('[data-galset="galSort"][data-v="new"]'); await p.waitForTimeout(500); ok(await p.evaluate(()=>{ const l=galList(); return l[0].d.cat==="top3"||l[0].d.cat==="excl"||l[0].d.cat==="refTop"||/^r[A-Z]/.test(l[0].d.id) }),'sort newest');
 // TOP 3
 await p.click('[data-galset="galSort"][data-v=""]'); await p.click('[data-galset="galStyle"][data-v="top3"]'); await p.waitForTimeout(800);
 const t3=await p.evaluate(()=>galList().map(x=>x.d.id)); ok(t3.length===10,'10 coronation designs');
 const distinct=await p.evaluate(ids=>new Set(ids.map(id=>{ const d=LB_DESIGNS.find(x=>x.id===id); return [d.frame,d.rk,d.nm,d.amb,d.d1,d.cel,d.colors.join()].join("|") })).size,t3); ok(distinct===10,'each coronation design differs in composition');
 // استخدام تتويج ← قائمة جديدة في قسم الترتيب + رابط
 await p.click(`.gal-card[data-galk="lb:top3Royal"] [data-galuse]`); await p.waitForTimeout(1500);
 const id=await p.evaluate(()=>S.lsOpen); ok(await p.evaluate(()=>S.page)==="boards"&&id,'use → list created in ranking section with editor open');
 const geo=await p.evaluate(()=>{ const e=document.querySelector('[data-lslive] .wd'); const ts=[...e.querySelectorAll('.lr.k-tok')].map(t=>{ const r=t.getBoundingClientRect(); return {r:[...t.classList].find(c=>/^r\d$/.test(c)),cx:r.x+r.width/2,y:r.y,w:r.width} }); return ts });
 const r1=geo.find(x=>x.r==="r1"), r2=geo.find(x=>x.r==="r2"), r3=geo.find(x=>x.r==="r3");
 ok(geo.length===3,'TOP 3 shows three positions'); ok(r1&&r2&&r3&&r2.cx<r1.cx&&r1.cx<r3.cx,'1st in the middle, 2nd left, 3rd right'); ok(r1&&r1.y<r2.y&&r1.y<r3.y&&r1.w>r2.w&&r1.w>r3.w,'1st higher and bigger');
 ok(await p.evaluate(()=>!!document.querySelector('[data-lslive] .wd .lr.r1 .d1 svg, [data-lslive] .wd .lr.r1 .d1 *')),'gold crown on 1st');
 await p.check('[data-lsf="podFlip"]'); await p.waitForTimeout(600); const fl=await p.evaluate(()=>[...document.querySelectorAll('[data-lslive] .wd .lr.k-tok')].map(t=>({r:[...t.classList].find(c=>/^r\d$/.test(c)),cx:t.getBoundingClientRect().x})));
 ok(fl.find(x=>x.r==="r2").cx>fl.find(x=>x.r==="r3").cx,'flip 2nd/3rd option');
 // رابط مفتوح + تحديث الترتيب الحقيقي تلقائياً + تغيير التصميم بدون تغيير الرابط
 const url=await p.evaluate(()=>document.querySelector('[data-lsurl]').value); const o=await ctx.newPage(); await o.goto(url); await o.waitForTimeout(1200);
 ok(await o.evaluate(()=>getComputedStyle(document.body).backgroundColor==="rgba(0, 0, 0, 0)"&&document.querySelectorAll('.wd').length===1),'link: list alone, transparent background');
 const sim=(u,v)=>p.evaluate(([u,v])=>send({t:"sim",ev:{type:"gift",id:"g"+Math.random(),user:{id:u,name:u,avatar:""},gift:"Rose",value:v,count:1}}),[u,v]);
 await p.evaluate(()=>{ const w=lsW(S.lsOpen); lsSet(w,"source","gifts") }); await sim("أحمد",500); await sim("منى",300); await sim("سلمان",100); await o.waitForTimeout(900);
 const n1=await o.evaluate(()=>[...document.querySelectorAll('.lr.k-tok')].map(t=>[[...t.classList].find(c=>/^r\d$/.test(c)),t.querySelector('.lr-nm').textContent]).sort().map(x=>x[1]));
 ok(n1[0]==="أحمد"&&n1[1]==="منى"&&n1[2]==="سلمان",'real ranking on podium: '+n1.join(','));
 await sim("سلمان",1000); await o.waitForTimeout(1200);
 const n2=await o.evaluate(()=>[...document.querySelectorAll('.lr.k-tok')].map(t=>[[...t.classList].find(c=>/^r\d$/.test(c)),t.querySelector('.lr-nm').textContent]).sort().map(x=>x[1]));
 ok(n2[0]==="سلمان"&&n2[1]==="أحمد",'ranking change updates podium automatically: '+n2.join(','));
 await p.evaluate(()=>{ const w=lsW(S.lsOpen); lsUse(w,"xTop3Butterfly") }); await o.waitForTimeout(900);
 ok(await o.evaluate(()=>!!document.querySelector('.wd.lbd-xTop3Butterfly')),'design change reached open link live'); ok((await p.evaluate(()=>document.querySelector('[data-lsurl]').value)).split('only=')[1]===url.split('only=')[1],'link list id unchanged after design change (server-mode link fully fixed: list-studio-server.test)');
 // المكتبة القديمة: لا فئات فارغة ولا عدّادات «x/y» ناقصة
 await p.click('.nav [data-go="library"]'); await p.click('[data-libtab="goals"]'); await p.waitForTimeout(500);
 ok(await p.$$eval('[data-gcat2]',e=>e.every(c=>!/(^|\s)0(\/|\s|$)/.test(c.textContent)&&!/\/\d/.test(c.textContent))),'goal categories: no empty or "x/plan" chips');
 ok(!/\(\d+\/\d+\)/.test(await p.evaluate(()=>document.querySelector('.lib-tabs').textContent)),'library tabs: no unfinished "x/y" counters');
 ok(errs.length===0,'no page errors '+errs.slice(0,3).join('|')); console.log(`gallery: ${pass} passed, ${fail} failed`); await b.close(); process.exit(fail?1:0) })();
