const { chromium } = require('/opt/npm-tools/node_modules/playwright');
(async()=>{
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:1440,height:1000}}); await ctx.grantPermissions(['clipboard-read','clipboard-write']);
 const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file:///home/claude/najd/demo/index.html'); await p.evaluate(()=>localStorage.clear()); await p.goto('file:///home/claude/najd/demo/index.html');
 const n=await p.evaluate(()=>({all:FA_DESIGNS.length,lib:FA_DESIGNS.filter(d=>d.grp!=="duck").length,duck:FA_DESIGNS.filter(d=>d.grp==="duck").length,artsUnique:new Set(FA_DESIGNS.filter(d=>d.art).map(d=>d.art)).size,en:Object.keys(FA_ENTER).length,ex:Object.keys(FA_EXIT).length}));
 ok(n.lib===80&&n.duck===10&&n.artsUnique===80,'80 library designs (each with unique artwork) + 10 duck versions');
 ok(n.en===30&&n.ex===20,'30 enter + 20 exit animations');
 const q=await p.evaluate(()=>{ const Q={}, o={qMax:30,mergeAt:3}, r=[]; for(const id of ["a","b","a","c","d","e"]) r.push(faQueuePush(Q,{id,name:id},o)); return {r,len:Q.q.length,last:Q.q[Q.q.length-1]} });
 ok(q.r[2]==="dup"&&q.len===3&&q.last.merged&&q.last.count===3,'queue: dedupe + merge ('+JSON.stringify(q.r)+')');
 ok(await p.evaluate(()=>faFill("يا {username} من {platform}",{username:"سارة",platform:"TikTok"}))==="يا سارة من TikTok",'message variables');
 await p.click('.nav [data-go="falerts"]'); await p.click('[data-faadd]'); await p.waitForTimeout(400);
 // البطة مرسومة SVG بأجزاء (ليست إيموجي) وتمشي ثم تلوّح
 await p.waitForSelector('#fa-pv .fa-char svg .armR',{timeout:3000});
 const ph=[]; for(const ms of [200,1300,2600]){ await p.waitForTimeout(ms-(ph.length?[200,1300][ph.length-1]:0)); ph.push(await p.evaluate(()=>{ const c=document.querySelector('#fa-pv .fa-char'); return c?c.className:"" })) }
 ok(/fa-walk/.test(ph[0])&&/fa-act-wave/.test(ph[1]),'duck walks in then waves: '+ph.join(' → '));
 ok(await p.evaluate(()=>!/🦆/.test(document.querySelector('#fa-pv .fa-char').innerHTML)),'duck is a drawn SVG character, not an emoji');
 const txt=await p.evaluate(()=>document.querySelector('#fa-pv .fa-l1').textContent); ok(txt==='❤️ شكراً على الفولو يا متابع تجريبي','thank-you message: '+txt);
 await p.screenshot({path:'/tmp/fa-duck.png'});
 await p.waitForTimeout(5200); ok(await p.evaluate(()=>!document.querySelector('#fa-pv .fa-root')),'after exit the area is fully transparent');
 // تصميم من المكتبة + تجربة 6 متابعات (طابور بلا تداخل)
 await p.click('[data-fagrp="royal"]'); await p.click('[data-fadesign="fa_royal_1"]'); await p.waitForTimeout(400);
 await p.click('[data-fatest="6"]'); await p.waitForTimeout(500);
 ok(await p.evaluate(()=>document.querySelectorAll('#fa-pv .fa-root').length)===1,'one alert at a time');
 await p.screenshot({path:'/tmp/fa-royal.png'});
 // TTS مرة واحدة من الغرفة
 await p.selectOption('[data-fatts]','1'); await p.waitForTimeout(200);
 const out=await p.evaluate(()=>{ const R=window.__arsh.R(); R.botCfg={...(R.botCfg||{}),falert:{tts:true,text:"يا هلا بـ {username}"}}; return roomEvent(R,{id:"ft1",type:"follow",user:{id:"z",name:"نورة"}},Date.now()).out.filter(m=>m.t==="bot").flatMap(m=>m.items).filter(i=>i.bot==="falert") });
 ok(out.length===1&&out[0].speech==="يا هلا بـ نورة",'TTS once per follow event (room-level)');
 await p.click('[data-facopy]'); await p.waitForTimeout(200); const url=await p.evaluate(()=>navigator.clipboard.readText()); ok(/only=/.test(url),'independent OBS link');
 const ob=await b.newPage(); const oe=[]; ob.on('pageerror',e=>oe.push(e.message)); await ob.goto(url.replace(/^.*#/,'file:///home/claude/najd/demo/index.html#')); await ob.waitForTimeout(800);
 ok(await ob.evaluate(()=>getComputedStyle(document.body).backgroundColor==='rgba(0, 0, 0, 0)'&&!!document.querySelector('.faw')&&!document.querySelector('.faw .fa-root')),'OBS: transparent, idle until a follow arrives');
 ok(errs.length===0&&oe.length===0,'no page errors '+errs.concat(oe).join(' | '));
 await b.close();
})();
