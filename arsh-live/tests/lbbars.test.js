const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const url='file:///home/claude/najd/demo/index.html';
(async()=>{
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:1440,height:1000}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto(url); await p.evaluate(()=>localStorage.clear()); await p.goto(url); await p.waitForTimeout(300);
 const cats=await p.evaluate(()=>Object.fromEntries(["basic","boys","girls","ptrans","creative"].map(c=>[c,LB_DESIGNS.filter(d=>d.cat===c).length])));
 ok(cats.basic===4&&cats.boys===20&&cats.girls===20&&cats.ptrans===20&&cats.creative===20,'84 new designs: basic 4 + 4 collections × 20 '+JSON.stringify(cats));
 const pairs=await p.evaluate(()=>{ const out={}; for(const d of LB_DESIGNS.filter(x=>x.layout==="bars"&&x.cat!=="basic")){ const k=d.cat+"|"+d.bar+"|"+d.deco; out[k]=(out[k]||0)+1 } return Object.values(out).every(v=>v===1) });
 ok(pairs,'no two designs in a collection share the same bar shape + decoration');
 const wid=await p.evaluate(()=>{ const A=window.__arsh; A.L().widgets.length=0; const w=A.addWidget("lb",{design:"basicColorful",source:"likes",topN:5,title:"أفضل المكبسين",numFmt:"short",x:.05,y:.05,w:.9,h:.4}); A.save(); A.pushLayout(); return w.id });
 await p.click('.nav [data-go="studio"]'); await p.waitForTimeout(400);
 const send=ev=>p.evaluate(ev=>window.__arsh.send({t:"sim",ev}),ev);
 const U=[["a","محمد",24500],["b","Abdullah",14300],["c","سارة",6300],["d","أبو فهد",3100],["e","Nora",1800],["f","زيد",900]];
 for(const [id,n,c] of U) await send({id:"L"+id,type:"like",user:{id,name:n},count:c});
 await p.waitForTimeout(1200);
 const S=`#stage .wd[data-id="${wid}"]`;
 const rows=await p.evaluate(s=>[...document.querySelectorAll(s+' .lr')].sort((x,y)=>(+x.className.match(/r(\d+)/)[1])-(+y.className.match(/r(\d+)/)[1])).map(r=>[r.querySelector('.lr-rk').textContent,r.querySelector('.lr-nm').textContent,r.querySelector('.lr-vl b').textContent]),S);
 ok(rows.length===5&&rows[0][0]==="🥇"&&rows[1][0]==="🥈"&&rows[2][0]==="🥉"&&rows[3][0]==="4"&&rows[0][1]==="محمد"&&rows[0][2]==="24.5K"&&rows[4][2]==="1.8K",'Basic Colorful: 5 bars, medals, names, short numbers '+JSON.stringify(rows[0]));
 ok(await p.evaluate(s=>!!document.querySelector(s+' .lr.r1 .lr-vl .ic svg')&&getComputedStyle(document.querySelector(s+' .lr.r1 .lr-card')).backgroundImage.includes('gradient'),S),'heart SVG icon + gradient bar');
 const ys=await p.evaluate(s=>[...document.querySelectorAll(s+' .lr')].map(r=>r.getBoundingClientRect().height),S); ok(Math.max(...ys)-Math.min(...ys)<1,'all bars same height (thin, equal spacing)');
 // تجاوز المراكز
 const img5=await p.evaluate(s=>document.querySelector(s+' .lr[data-k="e"] img').src,S);
 const y0=await p.evaluate(s=>document.querySelector(s+' .lr[data-k="e"]').getBoundingClientRect().top,S);
 await send({id:"L2e",type:"like",user:{id:"e",name:"Nora"},count:30000}); await p.waitForTimeout(250);
 ok(await p.evaluate(s=>document.querySelector(s+' .lr[data-k="e"]').classList.contains('newtop'),S),'new leader gets highlight');
 await p.waitForTimeout(900);
 const y1=await p.evaluate(s=>document.querySelector(s+' .lr[data-k="e"]').getBoundingClientRect().top,S);
 ok(y1<y0&&await p.evaluate(s=>document.querySelector(s+' .lr.r1').dataset.k,S)==="e"&&await p.evaluate(s=>document.querySelector(s+' .lr[data-k="e"] img').src,S)===img5,'overtake: row moves up smoothly, same avatar element kept');
 ok(await p.evaluate(s=>document.querySelector(s+' .lr.r1 .lr-vl b').textContent,S)==="31.8K",'count updated (31.8K)');
 const setW=async(o)=>{ await p.evaluate(([id,o])=>{ const w=window.__arsh.L().widgets.find(x=>x.id===id); Object.assign(w,o); window.__arsh.save(); window.__arsh.pushLayout() },[wid,o]); await p.click('.nav [data-go="studio"]'); await p.waitForTimeout(500) };
 await setW({numFmt:"full"}); ok(await p.evaluate(s=>document.querySelector(s+' .lr.r1 .lr-vl b').textContent,S)==="31,800",'full number format 31,800');
 await setW({showAv:false,showIcon:false,showRank:false,shine:false});
 ok(await p.evaluate(s=>{ const r=document.querySelector(s+' .lr.r1'); return getComputedStyle(r.querySelector('.lr-av')).display==="none"&&getComputedStyle(r.querySelector('.ic')).display==="none"&&getComputedStyle(r.querySelector('.lr-rk')).display==="none"&&getComputedStyle(r.querySelector('.swp')).display==="none" },S),'hide avatars / icons / ranks / shine');
 await setW({showAv:true,showIcon:true,showRank:true,shine:true,design:"transClean"});
 ok(await p.evaluate(s=>{ const c=getComputedStyle(document.querySelector(s+' .lr.r1 .lr-card')); const w=getComputedStyle(document.querySelector(s)); return c.backgroundImage==="none"&&(c.backgroundColor==="rgba(0, 0, 0, 0)")&&w.backgroundColor==="rgba(0, 0, 0, 0)" },S),'Transparent Clean: no bar background at all');
 await setW({design:"transOutline"}); ok(await p.evaluate(s=>getComputedStyle(document.querySelector(s+' .lr.r1 .lr-card')).borderTopWidth!=="0px",S),'Transparent Outline: thin border only');
 await setW({design:"transGlass",rowOpacity:.3}); ok(await p.evaluate(s=>getComputedStyle(document.querySelector(s+' .lr.r1 .lr-card')).backdropFilter.includes('blur'),S),'Transparent Glass: glass with adjustable opacity');
 for(const n of [3,10,15,20]){ await setW({topN:n,design:"pinkButterfly"}); const r=await p.evaluate(s=>{ const L=[...document.querySelectorAll(s+' .lr')]; const xs=new Set(L.map(e=>Math.round(e.getBoundingClientRect().left))); return [L.length,xs.size] },S); ok(r[0]===n&&r[1]===(n>=15?2:1),`top ${n}: ${r[0]} rows in ${r[1]} column(s)`) }
 ok(await p.evaluate(s=>!!document.querySelector(s+' .lbx-deco .d-bf svg .w.l')&&getComputedStyle(document.querySelector(s+' .lbx-deco .d-bf svg .w.l')).animationName==="bf-flap",S),'Pink Butterfly: animated SVG butterfly (wing flap) in the corner');
 await setW({source:"gifts",topN:5,design:"royalBlack",crown1:true});
 ok(await p.evaluate(s=>getComputedStyle(document.querySelector(s+' .lr.r1 .crw')).display!=="none"&&!!document.querySelector(s+' .lr .ic svg path'),S),'gifters list: diamond icon + optional crown on #1');
 // OBS
 await p.click('.nav [data-go="obs"]'); await p.waitForTimeout(200);
 const href=await p.evaluate(()=>document.querySelector('a[href*="#/overlay"]').href);
 const o=await ctx.newPage(); o.on('pageerror',e=>errs.push('ov '+e.message)); await o.goto(href+'&only='+wid); await o.reload(); await o.waitForTimeout(900);
 ok(await o.evaluate(()=>document.querySelectorAll('.lbl-bars .lr').length)===5&&await o.evaluate(()=>getComputedStyle(document.body).backgroundColor)==='rgba(0, 0, 0, 0)','OBS link renders bars on transparent page');
 // المكتبة
 await p.click('.nav [data-go="library"]'); await p.click('[data-libtab="pro"]'); await p.waitForTimeout(600);
 ok(await p.evaluate(()=>document.body.innerText.includes('الأساسية (ملونة وشفافة)')&&document.body.innerText.includes('الشبابية والألعاب')),'library shows the new categories');
 ok(errs.length===0,'no page errors '+errs.join(' | '));
 await b.close();
})();
