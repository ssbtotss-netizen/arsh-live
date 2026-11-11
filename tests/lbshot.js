const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'}); const p=await b.newPage({viewport:{width:1400,height:1000}});
 const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto('file:///home/claude/najd/demo/index.html'); await p.waitForTimeout(800);
 const mode=process.argv[2]||'designs';
 await p.evaluate((mode)=>{
  document.body.innerHTML='<div id="g" style="display:flex;flex-wrap:wrap;gap:8px;padding:8px;background:repeating-conic-gradient(#2a3550 0 25%,#1a2236 0 50%) 0 0/24px 24px"></div>';
  const g=document.getElementById('g');
  const names=["نورة","فهد","سارة","عبدالله","ريم","خالد","لمى","سلطان","جود","تركي","مها","ناصر","هيا","بدر","دانة","ماجد","شهد","يزيد","العنود","راكان"];
  const prev=names.map((x,i)=>({k:"s"+i,name:x,av:avatar(x),v:Math.round(52000/(i+1))}));
  const mk=(o,cw,ch)=>{ const cv={w:cw,h:ch}; const st=document.createElement('div'); st.className='stage'; st.style.cssText=`position:relative;width:${cw}px;height:${ch}px;background:none;transform:none;outline:1px dashed #fff3`; g.appendChild(st);
   const w=newWidget(o.type||"lb",{x:0,y:0,w:1,h:1,...o}); const v=new View(w,cv,{}); st.appendChild(v.el); v.refresh({preview:prev,D:emptyData()},true); return v };
  if(mode==='designs'||mode==='b2'||mode==='b3'||mode==='b4'||mode==='b5'||mode==='b6'||mode==='b7') LB_DESIGNS.filter(d=>mode==='designs'?d.n<=10:mode==='b2'?d.n>10&&d.n<=25:mode==='b3'?d.n>25&&d.n<=40:mode==='b4'?d.n>40&&d.n<=55:mode==='b5'?d.n>55&&d.n<=70:mode==='b6'?d.n>70&&d.n<=85:d.n>85).forEach(d=>mk({design:d.id,topN:5,title:d.name},330,470));
  else if(mode==='layouts'){ [1,3,5,10,20].forEach(n=>mk({design:'goldenHalo',topN:n,title:'Top '+n},n>=10?440:330,n>=10?700:470)) }
  else { SG_DESIGNS.forEach(d=>{ const st=mk({type:'sgoal',design:d.id,source:'custom',base:d.shape==='ring'?7:3,target:10,title:d.name},d.shape==='ring'?200:d.shape==='vertical'?120:420,d.shape==='ring'?200:d.shape==='vertical'?300:64) }) }
 },mode);
 await p.waitForTimeout(1500);
 await p.screenshot({path:`/home/claude/najd/shots/lb-${mode}.png`,fullPage:true});
 console.log('errors',errs); await b.close();
})();
