// ضغط الإكسبلور على المتصفح: لوحة التحكم + طبقة OBS بعدة عناصر — أحداث متتالية بمعدل عالٍ
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const RATE=+(process.argv[2]||300), SEC=+(process.argv[3]||8), EXPLORE=process.argv[4]==='explore';
(async()=>{ const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'}); const ctx=await b.newContext({viewport:{width:1440,height:900}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file:///home/claude/najd/demo/index.html'); await p.evaluate(()=>localStorage.clear()); await p.reload();
 const types=["likes","recentFollows","recentGifts","uchat","subathon","fcount","levent","falert","goal","lb","interact"];
 await p.evaluate(ts=>{ const A=window.__arsh; for(const t of ts) try{ A.addWidget(t,{}) }catch(e){} A.save(); A.pushLayout() },types);
 const url=await p.evaluate(()=>window.__arsh.overlayURL(window.__arsh.L())); const ov=await ctx.newPage(); ov.on('pageerror',e=>errs.push('ov:'+e.message)); await ov.goto(url); await ov.waitForTimeout(1500);
 const LT=`window.__lt={n:0,ms:0,max:0}; new PerformanceObserver(l=>{for(const e of l.getEntries()){__lt.n++;__lt.ms+=e.duration;__lt.max=Math.max(__lt.max,e.duration)}}).observe({entryTypes:["longtask"]}); window.__fr=0; (function f(){__fr++;requestAnimationFrame(f)})();`;
 await p.evaluate(LT); await ov.evaluate(LT); if(EXPLORE){ await p.evaluate(()=>new BroadcastChannel('b6o6-live-v2').postMessage({t:'perf',explore:true})); await ov.waitForTimeout(200); console.log('explore class',await ov.evaluate(()=>document.body.classList.contains('ov-explore'))) }
 const cdp=await ctx.newCDPSession(ov); await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval',{interval:200}); await cdp.send('Profiler.start'); const t0=Date.now();
 const sent=await p.evaluate(async([RATE,SEC])=>{ const A=window.__arsh; let n=0,u=0; const T0=performance.now(); const per=Math.max(1,Math.round(RATE/50));
  while(performance.now()-T0<SEC*1000){ for(let k=0;k<per;k++){ n++; u++; const r=n%10; const user={id:"u"+u,name:"متابع "+u};
    const ev= r<5?{type:"like",id:"l"+n,platform:"tiktok",user,count:15}: r<7?{type:"follow",id:"f"+n,platform:"tiktok",user}: r<9?{type:"comment",id:"c"+n,platform:"tiktok",user,text:"هلا "+n}:{type:"gift",id:"g"+n,platform:"tiktok",user,gift:"Rose",giftId:5655,diamonds:1,value:1,count:1};
    A.send({t:"sim",ev}) } await new Promise(r=>setTimeout(r,20)) } return n },[RATE,SEC]);
 const dt=(Date.now()-t0)/1000; const {profile}=await cdp.send('Profiler.stop'); require('fs').writeFileSync('/tmp/st/ov.cpuprofile',JSON.stringify(profile)); await p.waitForTimeout(1500);
 const pm=await p.evaluate(()=>({lt:__lt,fps:__fr,follows:window.__arsh.R().D.tot.follows,heap:performance.memory?.usedJSHeapSize/1048576|0}));
 const om=await ov.evaluate(()=>({lt:__lt,fps:__fr,dom:document.getElementsByTagName('*').length,heap:performance.memory?.usedJSHeapSize/1048576|0}));
 console.log(`rate≈${(sent/dt)|0}/s for ${dt.toFixed(1)}s sent=${sent}`);
 console.log(`dashboard: fps≈${(pm.fps/(dt+1.5))|0} longtasks=${pm.lt.n} total=${pm.lt.ms|0}ms max=${pm.lt.max|0}ms follows=${pm.follows} heap=${pm.heap}MB`);
 console.log(`overlay:   fps≈${(om.fps/(dt+1.5))|0} longtasks=${om.lt.n} total=${om.lt.ms|0}ms max=${om.lt.max|0}ms dom=${om.dom} heap=${om.heap}MB`);
 console.log('errs',errs.slice(0,3).join('|')); await b.close() })();
