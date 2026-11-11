// قياس أداء فعلي: مشهد 15 عنصراً + ضغط أحداث (30 حدث/ث) لكل وضع أداء
const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const url='file:///home/claude/najd/demo/index.html';
(async()=>{
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--disable-renderer-backgrounding','--disable-background-timer-throttling']});
 const ctx=await b.newContext({viewport:{width:1280,height:900}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto(url); await p.evaluate(()=>localStorage.clear()); await p.goto(url); await p.waitForTimeout(300);
 const types=["likes","gifts","comments","subathon","timer","social","lb","sgoal","srules","botbox","fcount","levent","levent","levent","donText"];
 await p.evaluate(types=>{ const A=window.__arsh; const kinds=["follow","like","donation"]; let k=0; A.L().widgets.length=0;
  types.forEach((t,i)=>{ const w=A.addWidget(t,t==="levent"?{kind:kinds[k++],design:["butterfly","fire","crown"][k-1]}:{}); w.x=(i%3)*.33; w.y=Math.floor(i/3)*.19; w.w=.32; w.h=.18 }); A.save(); A.pushLayout() },types);
 const n=await p.evaluate(()=>window.__arsh.L().widgets.length);
 const results=[];
 for(const pm of (process.env.PMS||"hq,balanced,perf").split(",")){
  await p.evaluate(pm=>{ window.__arsh.S.settings.perfMode=pm; window.__run=pm+Date.now() },pm);
  const href=await p.evaluate(()=>window.__arsh.overlayURL(window.__arsh.L()));
  const o=await ctx.newPage(); o.on('pageerror',e=>errs.push('ov '+e.message)); await o.setViewportSize({width:540,height:960}); await o.goto(href); await o.reload(); await o.waitForTimeout(1500);
  const cdp=await ctx.newCDPSession(o); await cdp.send('Performance.enable');
  const met=async()=>Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m=>[m.name,m.value]));
  await o.evaluate(()=>{ window.__fr=0; window.__lt=[]; window.__pings={}; const loop=()=>{ window.__fr++; requestAnimationFrame(loop) }; requestAnimationFrame(loop);
   try{ new PerformanceObserver(l=>l.getEntries().forEach(e=>window.__lt.push(e.duration))).observe({type:"longtask"}) }catch(e){}
   new MutationObserver(()=>{ const m=document.body.innerText.match(/P(\d{13})/g); if(m) for(const x of m){ if(!window.__pings[x]) window.__pings[x]=Date.now() } }).observe(document.body,{subtree:true,childList:true,characterData:true}) });
  const m0=await met(); const t0=Date.now();
  // 10 ثوانٍ × 30 حدث/ث
  const users=Array.from({length:40},(_,i)=>({id:"u"+i,name:"مستخدم"+i}));
  for(let s=0;s<10;s++){
   await p.evaluate(({s,users})=>{ const A=window.__arsh; for(let i=0;i<30;i++){ const u=users[(s*30+i)%users.length], r=i%6;
     const ev=r<2?{type:"like",count:5,user:u}:r===2?{type:"gift",gift:"وردة",giftId:5655,count:1,value:1,user:u}:r===3?{type:"comment",text:"هلا والله",user:u}:r===4?{type:"follow",user:u}:{type:"share",user:u};
     ev.id=window.__run+"b"+s+"_"+i; A.send({t:"sim",ev}) } },{s,users});
   if(s%3===0) await p.evaluate(s=>window.__arsh.send({t:"sim",ev:{id:window.__run+"don"+s,type:"donation",provider:"streamlabs",name:"داعم"+s,amount:5,currency:"USD"}}),s);
   if(s>=2&&s<8){ const ts=Date.now(); await p.evaluate(ts=>window.__arsh.send({t:"sim",ev:{id:"P"+ts,type:"donation",provider:"streamlabs",name:"P"+ts,amount:1,currency:"USD"}}),ts) }
   await p.waitForTimeout(1000) }
  const t1=Date.now(); const m1=await met();
  const r=await o.evaluate(()=>({fr:window.__fr,lt:window.__lt,pings:window.__pings})); if(process.env.DIAG){ console.log(await o.evaluate(()=>{ const c={}; document.querySelectorAll("*").forEach(e=>{ const k=e.tagName+"."+String(e.className.baseVal??e.className).split(" ")[0]; c[k]=(c[k]||0)+1 }); const per=[...document.querySelectorAll(".wd")].map(w=>w.dataset.id+":"+w.className.split(" ").slice(0,3).join(" ")+"="+w.querySelectorAll("*").length); return JSON.stringify(Object.entries(c).sort((a,b)=>b[1]-a[1]).slice(0,12))+"\n"+per.join("\n") })) }
  const lat=Object.entries(r.pings).map(([k,v])=>v-(+k.slice(1))).sort((a,b)=>a-b);
  const sec=(t1-t0)/1000;
  results.push({mode:pm,widgets:n,events:300+4,fps:+(r.fr/sec).toFixed(1),cpuPct:+((m1.TaskDuration-m0.TaskDuration)/sec*100).toFixed(1),scriptMs:+((m1.ScriptDuration-m0.ScriptDuration)*1000).toFixed(0),layoutCount:m1.LayoutCount-m0.LayoutCount,heapMB:+(m1.JSHeapUsedSize/1048576).toFixed(1),heapGrowMB:+((m1.JSHeapUsedSize-m0.JSHeapUsedSize)/1048576).toFixed(1),nodes:m1.Nodes,longTasks:r.lt.length,longMax:Math.round(Math.max(0,...r.lt)),latP50:lat[Math.floor(lat.length/2)],latMax:lat[lat.length-1],pings:lat.length});
  await o.close() }
 console.log(JSON.stringify(results,null,1)); console.log("errors",JSON.stringify(errs)); await b.close() })();
