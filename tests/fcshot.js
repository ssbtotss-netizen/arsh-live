const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'}); const p=await b.newPage({viewport:{width:1100,height:900}});
 const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto('file:///home/claude/najd/demo/index.html'); await p.waitForTimeout(500);
 await p.evaluate(()=>{
  document.body.innerHTML='<div id="g" style="display:grid;grid-template-columns:repeat(2,520px);gap:8px;padding:8px;background:repeating-conic-gradient(#2a3550 0 25%,#1a2236 0 50%) 0 0/24px 24px"></div>';
  FC_DESIGNS.forEach((d,i)=>{ const st=document.createElement('div'); st.style.cssText='position:relative;width:520px;height:230px;outline:1px dashed #fff2'; g.appendChild(st);
   const w=newWidget("fcount",{design:d.id,platform:"tiktok",handle:"@b6o6",x:0,y:0,w:1,h:1,goalOn:i%3!==2,goal:510000,goalStyle:i%3===1?"ring":"bar"});
   const v=new View(w,{w:520,h:230},{}); st.appendChild(v.el); v.refreshFc({C:{followers:{tiktok:{value:500000,session:125,source:"manual"}}},SO:{accounts:[]}},true) });
 });
 await p.waitForTimeout(1500); await p.screenshot({path:'/home/claude/najd/shots/fc10.png',fullPage:true}); console.log('errors',errs); await b.close();
})();
