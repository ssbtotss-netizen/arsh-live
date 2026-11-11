const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'}); const p=await b.newPage({viewport:{width:1400,height:1000}});
 const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto('file:///home/claude/najd/demo/index.html'); await p.waitForTimeout(600);
 const mode=process.argv[2]||'designs';
 await p.evaluate((mode)=>{
  document.body.innerHTML='<div id="g" style="display:flex;flex-wrap:wrap;gap:10px;padding:10px;background:repeating-conic-gradient(#2a3550 0 25%,#1a2236 0 50%) 0 0/24px 24px"></div>';
  const C=newClockState(); const src={C,D:emptyData()};
  const mk=(o,cw,ch)=>{ const st=document.createElement('div'); st.style.cssText=`position:relative;width:${cw}px;height:${ch}px;outline:1px dashed #fff3`; g.appendChild(st);
   const w=newWidget("srules",{x:0,y:0,w:1,h:1,...o}); const v=new View(w,{w:cw,h:ch},{data:()=>src}); st.appendChild(v.el); window.__v=(window.__v||[]); window.__v.push(v); return v };
  if(mode==='designs') RB_DESIGNS.forEach(d=>mk({design:d.id,title:"⏰ "+d.name},330,420));
  else { mk({design:'royalRules',mode:'list'},330,420); mk({design:'b6o6Rules',mode:'rotate'},420,110); mk({design:'luxuryBlackRules',mode:'ticker'},680,70); mk({design:'crystalRules',mode:'cards'},460,420); mk({design:'neonBlueRules',mode:'compact'},560,110); mk({design:'goldenRules',mode:'ticker',tickerDir:'v'},300,300) }
 },mode);
 await p.waitForTimeout(1500);
 await p.screenshot({path:`/home/claude/najd/shots/rb-${mode}.png`,fullPage:true});
 console.log('errors',errs); await b.close();
})();
