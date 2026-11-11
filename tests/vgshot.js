const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'}); const p=await b.newPage({viewport:{width:1300,height:900}});
 const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto('file:///home/claude/najd/demo/index.html'); await p.waitForTimeout(500);
 await p.evaluate(()=>{
  document.body.innerHTML='<div id="g" style="display:grid;grid-template-columns:repeat(5,250px);gap:6px;padding:8px;background:repeating-conic-gradient(#2a3550 0 25%,#1a2236 0 50%) 0 0/24px 24px"></div>';
  window.__V=[];
  for(const d of ["goldCup","diamondForm","treasureChest","ringGoal"]) for(const pc of [0,25,50,75,100]){
   const st=document.createElement('div'); st.style.cssText='position:relative;width:250px;height:250px;outline:1px dashed #fff2'; g.appendChild(st);
   const w=newWidget("sgoal",{design:d,source:"custom",base:pc,target:100,title:d+" "+pc+"%",x:0,y:0,w:1,h:1});
   const v=new View(w,{w:250,h:250},{}); st.appendChild(v.el); v.refresh({D:emptyData()},true); __V.push(v) }
 });
 await p.waitForTimeout(1500);
 await p.screenshot({path:'/home/claude/najd/shots/vg-4.png',fullPage:true});
 console.log('errors',errs); await b.close();
})();
