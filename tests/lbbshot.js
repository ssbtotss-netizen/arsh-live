// لقطة لتصاميم الأشرطة: node tests/lbbshot.js <cat> out [source]
const { chromium } = require('/opt/npm-tools/node_modules/playwright');
(async()=>{ const cat=process.argv[2]||"basic", out=process.argv[3]||"lbb", src=process.argv[4]||"likes";
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']}); const p=await b.newPage({viewport:{width:1320,height:900}}); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file:///home/claude/najd/demo/index.html'); await p.waitForTimeout(300);
 await p.evaluate(({cat,src})=>{ document.body.innerHTML='<div id="g" style="display:grid;grid-template-columns:repeat(4,320px);gap:8px;padding:8px;background:linear-gradient(135deg,#2b3a55,#1a1f2b 50%,#3a2b45)"></div>'; const g=document.getElementById('g');
  const pv=[["محمد",24500],["Abdullah_The_Legend",14300],["سارة",6300],["أبو فهد",3100],["Nora",1800]].map(([n,v],i)=>({k:"k"+i,name:n,v}));
  LB_DESIGNS.filter(d=>d.cat===cat).forEach((d,i)=>{ const st=document.createElement('div'); st.style.cssText='position:relative;width:320px;height:200px'; g.appendChild(st);
   const w=newWidget("lb",{id:"t"+i,design:d.id,source:src,topN:5,x:.02,y:.05,w:.96,h:.9,numFmt:"short",crown1:true});
   const v=new View(w,{w:320,h:200},{data:()=>({preview:pv,D:{},H:[]})}); st.appendChild(v.el); v.apply(w);
   const lab=document.createElement('div'); lab.textContent=d.n+". "+d.name; lab.style.cssText='position:absolute;bottom:-2px;left:4px;font:10px sans-serif;color:#fff8;z-index:9'; st.appendChild(lab) }) },{cat,src});
 await p.waitForTimeout(1500); await p.screenshot({path:`/home/claude/najd/shots/${out}.png`,fullPage:true}); console.log("errors",JSON.stringify(errs)); await b.close() })();
