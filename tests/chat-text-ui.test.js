// عرض نص الرسائل في طبقة الشات الموحد (اللوحة + رابط OBS) مع الحفاظ على التصاميم
const {chromium}=require('/opt/npm-tools/node_modules/playwright'); const path=require('path');
let pass=0,fail=0; const ok=(c,m)=>{ c?pass++:(fail++,console.log('FAIL',m)) };
const MSGS=["السلام عليكم يا بطوط","Hello everyone","🔥❤️😂","السلام عليكم جميعاً، كيف حالكم اليوم؟ "+"رسالة طويلة جداً ".repeat(8),"!شغل اسم الأغنية",`<img src=x onerror=alert(1)> & "رموز" <b>x</b>`];
(async()=>{ const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'}); const ctx=await b.newContext({viewport:{width:1440,height:1000}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); let alerted=false; p.on('dialog',d=>{ alerted=true; d.dismiss() });
 await p.goto('file://'+path.resolve(__dirname,'../demo/index.html')); await p.evaluate(()=>localStorage.clear()); await p.reload();
 const wid=await p.evaluate(()=>{ const A=window.__arsh; const w=A.addWidget("uchat",{}); w.max=12; A.save(); A.pushLayout(); return w.id });
 const url=await p.evaluate(id=>window.__arsh.overlayURL(window.__arsh.L(),id),wid);
 const o=await ctx.newPage(); o.on('pageerror',e=>errs.push(e.message)); o.on('dialog',d=>{ alerted=true; d.dismiss() }); await o.goto(url); await o.waitForTimeout(800);
 await p.evaluate(MS=>{ let i=0; for(const s of MS) window.__arsh.send({t:"sim",ev:{type:"comment",id:"c"+(++i),platform:"tiktok",user:{id:"u"+i,name:"أحمد"},text:s}});
  window.__arsh.send({t:"sim",ev:{type:"comment",id:"st",platform:"tiktok",user:{id:"s",name:"ملصق"},text:"",emotes:["https://p16-webcast.tiktokcdn.com/img/x.png"]}}) },MSGS);
 await p.waitForTimeout(400); await o.waitForTimeout(1200);
 await p.click('.nav [data-go="studio"]'); await p.waitForTimeout(900); // الشات يظهر في اللوحة داخل الاستوديو
 for(const [pg,label] of [[p,"dashboard"],[o,"OBS"]]){
  const rows=await pg.evaluate(()=>[...document.querySelectorAll('.uc-m')].map(m=>({n:(m.querySelector('.uc-n')||{}).textContent,t:(m.querySelector('.uc-t')||{}).textContent,em:!!m.querySelector('.uc-em'),vis:(()=>{ const t=m.querySelector('.uc-t'); if(!t) return false; const cs=getComputedStyle(t); return cs.display!=="none"&&cs.visibility!=="hidden"&&+cs.opacity>0&&t.getBoundingClientRect().height>0 })(),clip:(()=>{ const t=m.querySelector('.uc-t'); return t?t.scrollWidth>t.clientWidth+2:true })(),same:(()=>{ const t=m.querySelector('.uc-t'); if(!t) return false; const c=getComputedStyle(t).color, bg=getComputedStyle(m).backgroundColor; return c===bg })()})));
  for(const s of MSGS){ const r=rows.find(x=>x.t===s); ok(r&&r.n==="أحمد",`${label}: name + full text shown: ${s.slice(0,30)}`); if(r){ ok(r.vis,`${label}: text visible (not hidden by CSS): ${s.slice(0,20)}`); ok(!r.clip,`${label}: text not clipped: ${s.slice(0,20)}`); ok(!r.same,`${label}: text colour ≠ background`) } }
  ok(rows.some(x=>x.n==="ملصق"&&x.em),`${label}: sticker-only message shows the sticker`);
 }
 ok(!alerted,'special characters are shown as text, never executed');
 // التصاميم: النص يظهر في كل تصاميم الشات
 const designs=await p.evaluate(()=>UC_DESIGNS?UC_DESIGNS.map(d=>d.id):[]).catch(()=>[]);
 const ids=designs.length?designs:await p.evaluate(()=>window.__arsh.L().widgets.find(w=>w.type==="uchat").design?[window.__arsh.L().widgets.find(w=>w.type==="uchat").design]:[]);
 let bad=[]; for(const d of ids.slice(0,40)){ await p.evaluate(([id,d])=>{ const w=window.__arsh.L().widgets.find(x=>x.id===id); w.design=d; window.__arsh.save(); window.__arsh.pushLayout() },[wid,d]); await o.waitForTimeout(250);
  await o.waitForTimeout(400); const vis=await o.evaluate(()=>{ const t=[...document.querySelectorAll('.uc-t')].find(x=>x.textContent==="Hello everyone"); if(!t) return false; const cs=getComputedStyle(t); return cs.display!=="none"&&cs.visibility!=="hidden"&&+cs.opacity>0&&t.getBoundingClientRect().height>0&&cs.color!=="rgba(0, 0, 0, 0)" }); if(!vis) bad.push(d) }
 ok(ids.length>0&&bad.length===0,`text visible in all ${ids.length} chat designs${bad.length?" — hidden in: "+bad.join(","):""}`);
 // صفحة الربط: زر التشخيص
 await p.click('.nav [data-go="hub"]').catch(()=>{}); await p.waitForTimeout(300);
 const hasDiag=await p.$('[data-ucdiag]'); if(hasDiag){ await p.click('[data-ucdiag]'); await p.waitForTimeout(300); ok(/تشخيص|خادم المنصة/.test(await p.textContent('[data-ucdiagbox]')),'diagnostics panel opens') } else ok(true,'(hub page not in demo nav)');
 ok(errs.length===0,'no page errors '+errs.slice(0,3).join('|')); console.log(`chat-text-ui: ${pass} passed, ${fail} failed`); await b.close(); process.exit(fail?1:0) })();
