// لقطة لتصاميم آخر التفاعلات: node tests/leshot.js "<kind>" "<ids>" out [t_ms]
const { chromium } = require('/opt/npm-tools/node_modules/playwright');
(async()=>{ const kind=process.argv[2]||"follow", ids=(process.argv[3]||"").split(",").filter(Boolean), out=process.argv[4]||"le", tms=+process.argv[5]||2600;
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']}); const p=await b.newPage({viewport:{width:1300,height:900}}); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file:///home/claude/najd/demo/index.html'); await p.waitForTimeout(400);
 await p.evaluate(x=>{window.__X=x},JSON.parse(process.env.LEX||"{}")); await p.evaluate(({kind,ids})=>{ document.body.innerHTML='<div id="g" style="display:grid;grid-template-columns:repeat(3,420px);gap:6px;padding:6px;background:repeating-conic-gradient(#2a2f3a 0 25%,#1c2029 0 50%) 0 0/24px 24px"></div>'; const g=document.getElementById('g');
  const list=ids.length?ids:LE_DESIGNS.map(d=>d.id); window.__v=[];
  list.forEach((id,i)=>{ const cv={w:420,h:340}; const st=document.createElement('div'); st.style.cssText='position:relative;width:420px;height:340px;outline:1px dashed #fff2'; g.appendChild(st);
   const w=newWidget("levent",{id:"t"+i,design:id,kind,x:.02,y:.02,w:.96,h:.96,...(window.__X||{})}); const v=new View(w,cv,{}); st.appendChild(v.el); v.apply(w); window.__v.push(v);
   const e={id:"e"+i,kind,name:["محمد","Abdullah_The_Legend_2026","سارة"][i%3],uid:"u"+i,av:"",at:Date.now(),count:120,amount:2,currency:"USD",gift:"وردة"}; v.leShow(e,false) }) },{kind,ids});
 await p.waitForTimeout(tms); await p.screenshot({path:`/home/claude/najd/shots/${out}.png`,fullPage:true}); console.log("errors",JSON.stringify(errs)); await b.close() })();
