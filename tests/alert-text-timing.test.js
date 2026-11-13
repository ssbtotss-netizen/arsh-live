// تحكم صانع المحتوى: إخفاء صورة الداعم + وقت ظهور كلام الداعم ومدته (لكل مستوى) — في المعاينة نفسها المستخدمة في OBS
const { chromium } = require('/opt/npm-tools/node_modules/playwright');
(async()=>{
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const p=await (await b.newContext({viewport:{width:1440,height:1000}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 const U='file:///home/claude/najd/demo/index.html'; await p.goto(U); await p.evaluate(()=>localStorage.clear()); await p.goto(U);
 await p.click('.nav [data-go="alerts"]'); await p.waitForTimeout(300); await p.click('[data-mlsec="don"]'); await p.waitForTimeout(300);
 const k=await p.evaluate(()=>{ const L=mlLib(); const x=L.don.levels.find(l=>l.min===5); x.clips=[{id:"c5",alertId:"tpl:duck_classic",enabled:true}]; mlSave(); return x.id });
 // نستخدم مقطعاً مرفوعاً حتى يمر عبر مسار .ab-tx/.ab-av
 await p.uncheck(`[data-mlf="show.avatar"][data-k="${k}"]`); await p.waitForTimeout(150);
 await p.fill(`[data-mlf="textDelay"][data-k="${k}"]`,'1.5'); await p.dispatchEvent(`[data-mlf="textDelay"][data-k="${k}"]`,'change'); await p.waitForTimeout(150);
 await p.fill(`[data-mlf="textDur"][data-k="${k}"]`,'2'); await p.dispatchEvent(`[data-mlf="textDur"][data-k="${k}"]`,'change'); await p.waitForTimeout(150);
 const L=await p.evaluate(k=>mlLib().don.levels.find(l=>l.id===k),k); ok(L.show.avatar===false&&L.textDelay===1.5&&L.textDur===2,'الإعدادات تُحفظ للمستوى: '+JSON.stringify({a:L.show.avatar,d:L.textDelay,u:L.textDur}));
 await p.click(`[data-ml="test"][data-k="${k}"]`); await p.waitForTimeout(500);
 const st=()=>p.evaluate(()=>{ const r=document.querySelector('#al-pv .ab-root'); return r?r.className:"none" });
 const a=await st(); ok(/ab-hideav/.test(a)&&/ab-txwait/.test(a),'بداية المقطع: الصورة مخفية والكلام ينتظر: '+a);
 await p.waitForTimeout(1500); const c=await st(); ok(/ab-txin/.test(c)&&!/ab-txwait/.test(c),'بعد 1.5 ث: الكلام ظهر: '+c);
 await p.waitForTimeout(2100); const d=await st(); ok(/ab-txgone/.test(d)||d==="none",'بعد ثانيتين من ظهوره: الكلام اختفى: '+d);
 const css=await p.evaluate(()=>{ const r=document.createElement('div'); r.className='ab-root ab-hideav'; const a=document.createElement('div'); a.className='ab-av'; r.appendChild(a); document.body.appendChild(r); const v=getComputedStyle(a).display; r.remove(); return v }); ok(css==="none",'CSS يخفي الصورة فعلياً');
 await p.goto(U); await p.waitForTimeout(300); ok(await p.evaluate(k=>{ const x=S.bots.alerts.lib.don.levels.find(l=>l.id===k); return x.textDelay===1.5&&x.show.avatar===false },k),'يبقى بعد إعادة التحميل');
 // رفع الكلام وتكبيره
 await p.click('.nav [data-go="alerts"]'); await p.waitForTimeout(300); await p.click('[data-mlsec="don"]'); await p.waitForTimeout(300);
 await p.click(`[data-ml="txup"][data-k="${k}"]`); await p.waitForTimeout(150); await p.click(`[data-ml="txup"][data-k="${k}"]`); await p.waitForTimeout(150);
 ok(await p.evaluate(k=>mlLib().don.levels.find(l=>l.id===k).textShift,k)===-10,'زر ⬆️ ارفع مرتين ← الكلام أعلى بـ 10%');
 await p.$eval(`[data-mlf="textScale"][data-k="${k}"]`,e=>{ e.value="150"; e.dispatchEvent(new Event("change",{bubbles:true})) }); await p.waitForTimeout(150);
 await p.evaluate(k=>{ const x=mlLib().don.levels.find(l=>l.id===k); x.textDelay=0; x.textDur=0; mlSave() },k); await p.waitForTimeout(150);
 await p.click(`[data-ml="test"][data-k="${k}"]`); await p.waitForTimeout(900);
 const tx=await p.evaluate(()=>{ const r=document.querySelector('#al-pv .ab-root'); const t=r&&r.querySelector('.ab-tx,.fa-tx'); return r&&{s:r.style.getPropertyValue('--txs'),z:r.style.getPropertyValue('--txz'),tr:t?getComputedStyle(t).translate:"",sc:t?getComputedStyle(t).scale:""} });
 ok(tx&&parseFloat(tx.s)<0&&tx.z==="1.5"&&/-/.test(tx.tr)&&tx.sc==="1.5",'الكلام مرفوع ومكبّر فعلياً في المشغّل: '+JSON.stringify(tx));
 await p.click(`[data-ml="txreset"][data-k="${k}"]`); await p.waitForTimeout(150);
 ok(await p.evaluate(k=>{ const x=mlLib().don.levels.find(l=>l.id===k); return x.textShift===0&&x.textScale===100 },k),'↺ الأصلي يرجّع المكان والحجم');
 ok(!errs.length,'no page errors '+errs.join(' | ')); await b.close();
})();
