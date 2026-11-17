// السبثون الملكي: أرقام قلّابة + أقوى داعم للوقت من سجل الغرفة الحقيقي (يتجاهل التجريبي وسبثون قديم)
const { chromium } = require('/opt/npm-tools/node_modules/playwright'); const path=require('path');
let pass=0,fail=0; const ok=(c,m)=>{ c?pass++:(fail++,console.log('FAIL',m)) };
(async()=>{ const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']}); const p=await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+path.resolve(__dirname,'../demo/index.html')); await p.waitForTimeout(400);
 const r=await p.evaluate(async()=>{ document.body.innerHTML='<div id="g" style="position:relative;width:900px;height:500px"></div>';
  const C=newClockState(), s=C.subathon; subathonOp(s,{op:"start"},Date.now()); const LG=[];
  LG.push({subathonId:"old",deltaMs:99e6,user:"قديم"}); // سبثون سابق لا يُحسب
  const add=(u,ms,test)=>LG.unshift(...subathonOp(s,{op:"add",ms,source:"rule",reason:"هدية",x:{user:u,avatar:"",test}},Date.now()));
  const w=Object.assign(newWidget("subathon"),{id:"s1",design:"rRoyalSub",x:.2,y:.15,w:.6,h:.4,visible:true}); const src={C,LG,skew:0};
  const v=new View(w,{w:900,h:500},{data:()=>src}); document.getElementById('g').appendChild(v.el); v.apply(w); v.refresh(src);
  const out={empty:v.el.querySelector('.rs-top').hidden, digits:v.el.querySelectorAll('.ck-time.flipd b').length, pro:isProDesign("rRoyalSub")};
  add("نورة",120000); add("فهد",300000); add("نورة",240000); add("تجربة",900000,true); v.refresh(src);
  out.top=v.el.querySelector('.rs-nm').textContent; out.v=v.el.querySelector('.rs-v').textContent; out.shown=!v.el.querySelector('.rs-top').hidden;
  const other=Object.assign(newWidget("subathon"),{id:"s2",design:"royal"}); const v2=new View(other,{w:900,h:500},{data:()=>src}); document.getElementById('g').appendChild(v2.el); v2.apply(other); v2.refresh(src);
  out.plain=!v2.el.querySelector('.rs-top')&&!v2.el.querySelector('.flipd')&&/\d\d:\d\d:\d\d/.test(v2.el.querySelector('.ck-time').textContent);
  return out });
 ok(r.empty,'no banner before any real addition'); ok(r.digits===6,'6 flip digits'); ok(r.pro,'PRO design');
 ok(r.top==="نورة","top time supporter = نورة (6 min > فهد 5 min; test + old ignored)"); ok(/6/.test(r.v),'value +6 min: '+r.v); ok(r.shown,'banner shown');
 ok(r.plain,'other subathon designs unchanged'); ok(errs.length===0,'no errors '+errs.join('|'));
 console.log(`royal-sub: ${pass} passed, ${fail} failed`); await b.close(); process.exit(fail?1:0) })();
