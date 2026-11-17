// قوائم التوب «المرجع»: 14 تصميماً PRO في فئة مستقلة، تُرسم بلا أخطاء، وترتيب السباق يضع الأقوى في المقدمة
const {chromium}=require('/opt/npm-tools/node_modules/playwright'); const path=require('path');
let pass=0,fail=0; const ok=(c,m)=>{ c?pass++:(fail++,console.log('FAIL',m)) };
(async()=>{ const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'}); const p=await b.newPage({viewport:{width:1440,height:1000}}); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+path.resolve(__dirname,'../demo/index.html')); await p.evaluate(()=>localStorage.clear()); await p.reload();
 const reg=await p.evaluate(()=>{ const r=LB_DESIGNS.filter(d=>d.cat==="refTop"); return {n:r.length,ids:r.map(d=>d.id),allPro:r.every(d=>isProDesign(d.id)),uniq:new Set(LB_DESIGNS.map(d=>d.id)).size===LB_DESIGNS.length,nums:new Set(LB_DESIGNS.map(d=>d.n)).size===LB_DESIGNS.length,
   race:(()=>{ const S=lbArtSlots("race",5,400,500,6); return S.every((s,i)=>i===0||s.x>S[i-1].x)&&S.every((s,i)=>i===0||s.y>S[i-1].y) })(), d1:typeof lbD1HTML==="function"&&lbD1HTML("bow").includes("svg")&&lbD1HTML("gate").includes("svg") } });
 ok(reg.n===14,'14 ref designs'); ok(reg.allPro,'all PRO'); ok(reg.uniq,'unique ids'); ok(reg.nums,'unique numbers'); ok(reg.race,'race: leader ahead, one lane each'); ok(reg.d1,'bow + gate decorations');
 await p.click('.nav [data-go="studio"]'); await p.selectOption('select[data-act="addW"]','@lb5'); await p.waitForTimeout(200);
 for(const k of ['biggift','roses100','supporter','supporter','supporter']) { await p.evaluate(k=>window.__arsh.SIM[k](),k); await p.waitForTimeout(100) }
 await p.click('.nav [data-go="library"]'); await p.click('[data-libtab="pro"]'); await p.waitForTimeout(300); await p.click('[data-lbcat="refTop"]'); await p.waitForTimeout(1500);
 const cards=await p.$$eval('#lib .libc',e=>e.map(c=>({pro:!!c.querySelector('.probadge'),rows:c.querySelectorAll('.pv [data-k], .pv .lbr, .pv .lba-tok, .pv .tok').length,txt:c.querySelector('.pv').innerText})));
 ok(cards.length===14,'category shows 14'); ok(cards.every(c=>c.pro),'every card has PRO badge'); ok(cards.every(c=>/52,000|52٬000|52000/.test(c.txt)),'every preview renders the real top supporter');
 await p.click('#lib .libc[data-pick="rObsidianRace"]'); await p.waitForTimeout(300); ok(await p.evaluate(()=>JSON.stringify(S.layouts).includes('"rObsidianRace"')),'pick applies (local/free mode)');
 ok(errs.length===0,'no page errors '+errs.join('|')); console.log(`lb-ref: ${pass} passed, ${fail} failed`); await b.close(); process.exit(fail?1:0) })();
