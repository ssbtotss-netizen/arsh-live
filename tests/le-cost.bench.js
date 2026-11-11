// تكلفة كل تصميم في وضع الخمول: 4 نسخ لكل تصميم، 2.5 ثانية، قياس CPU وFPS
const { chromium } = require('/opt/npm-tools/node_modules/playwright');
(async()=>{ const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']}); const p=await b.newPage({viewport:{width:900,height:700}});
 await p.goto('file:///home/claude/najd/demo/index.html'); await p.waitForTimeout(300); const cdp=await p.context().newCDPSession(p); await cdp.send('Performance.enable');
 const ids=await p.evaluate(()=>LE_DESIGNS.map(d=>d.id)); const out=[];
 for(const id of ids){
  await p.evaluate(id=>{ document.body.innerHTML='<div id="g" style="display:grid;grid-template-columns:repeat(2,420px)"></div>'; const g=document.getElementById('g');
   for(let i=0;i<4;i++){ const st=document.createElement('div'); st.style.cssText='position:relative;width:420px;height:320px'; g.appendChild(st); const w=newWidget("levent",{id:"t"+i,design:id,kind:"follow",x:0,y:0,w:1,h:1}); const v=new View(w,{w:420,h:320},{}); st.appendChild(v.el); v.apply(w); v.leShow({id:"e"+i,kind:"follow",name:"محمد",uid:"u"+i,av:"",at:Date.now()},true) }
   window.__fr=0; const loop=()=>{ window.__fr++; requestAnimationFrame(loop) }; requestAnimationFrame(loop) },id);
  await p.waitForTimeout(500); const m0=Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m=>[m.name,m.value])); const f0=await p.evaluate(()=>window.__fr);
  await p.waitForTimeout(2500); const m1=Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m=>[m.name,m.value])); const f1=await p.evaluate(()=>window.__fr);
  out.push([id,+((m1.TaskDuration-m0.TaskDuration)/2.5*100).toFixed(0),+((f1-f0)/2.5).toFixed(0)]) }
 out.sort((a,b)=>b[1]-a[1]); console.log(out.map(r=>r.join(" ")).join("\n")); await b.close() })();
