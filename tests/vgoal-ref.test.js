// أهداف المرجع الـ12: تسجيل + امتلاء السائل/الشريط/الكومة حسب التقدم + عدم وجود أخطاء
const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const path=require('path'); let pass=0,fail=0; const ok=(c,m)=>{ c?pass++:(fail++,console.log('FAIL',m)) };
(async()=>{ const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']}); const p=await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+path.resolve(__dirname,'../demo/index.html')); await p.waitForTimeout(400);
 const r=await p.evaluate(async()=>{ const ids=["rPerfume","rRoyalVial","rBunny","rCoinJar","rDragonNeon","rMoonCat","rFox","rHeart","rLove","rLoveStream","rNeonBar","rSpiderLily"]; const out={};
  for(const id of ids){ const reg=VG_DESIGNS.find(d=>d.id===id); const res={reg:!!reg,name:reg&&reg.name,vals:[]};
   for(const pct of [0.2,0.8]){ const w=Object.assign(newWidget("sgoal"),{id:"t"+id+pct,design:id,x:0,y:0,w:1,h:1,visible:true}); const v=new View(w,{w:240,h:200},{mute:true}); document.body.appendChild(v.el); v.apply(w); v.vgFill(pct);
    const liq=v.el.querySelector('.vg-liq'), hf=v.el.querySelector('.vg-hf'), kn=v.el.querySelector('.vg-kn'), pile=v.el.querySelector('.vg-pile');
    res.vals.push({liq:liq?parseFloat((liq.style.transform.match(/translateY\(([-\d.]+)/)||[])[1]):null,hf:hf?+hf.getAttribute('width'):null,kn:kn?parseFloat((kn.style.transform.match(/translateX\(([-\d.]+)/)||[])[1]):null,pile:pile?parseFloat((pile.style.transform.match(/translateY\(([-\d.]+)/)||[])[1]):null,svg:!!v.el.querySelector('svg.vg-svg')}); v.el.remove() }
   out[id]=res }
  return out });
 for(const [id,x] of Object.entries(r)){ ok(x.reg,id+' registered'); ok(/[؀-ۿ]/.test(x.name||''),id+' arabic name'); const [a,c]=x.vals; ok(a.svg&&c.svg,id+' svg');
  const kinds=['liq','hf','pile'].filter(k=>a[k]!=null); ok(kinds.length>=1,id+' has fill element');
  if(a.liq!=null) ok(c.liq<a.liq,id+' liquid rises'); if(a.hf!=null) ok(c.hf>a.hf&&Math.abs(c.hf/a.hf-4)<.01,id+' bar width ∝ p'); if(a.kn!=null) ok(c.kn>a.kn,id+' knob moves'); if(a.pile!=null) ok(c.pile<a.pile,id+' pile rises') }
 ok(!/eevee|pok[eé]mon|pikachu/i.test(JSON.stringify(r)),'no protected IP names');
 ok(errs.length===0,'page errors: '+errs.join('|')); console.log(`vgoal-ref: ${pass} passed, ${fail} failed`); await b.close(); process.exit(fail?1:0) })();
