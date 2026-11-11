const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const url='file:///home/claude/najd/demo/index.html';
(async()=>{
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const p=await (await b.newContext({viewport:{width:1440,height:1000}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto(url); await p.evaluate(()=>localStorage.clear()); await p.goto(url);
 await p.click('.nav [data-go="poststats"]'); await p.waitForTimeout(300);
 ok(await p.locator('text=لا توجد تقارير بعد').count()===1,'empty archive message (no fake report)');
 const send=ev=>p.evaluate(ev=>window.__arsh.send({t:"sim",ev}),ev);
 for(let i=0;i<12;i++) await send({id:"g"+i,type:"gift",user:{id:"u"+i,name:"داعم رقم "+i+" باسم طويل جداً جداً للتجربة"},gift:"وردة",giftId:1,count:1,value:(i+1)*10});
 await send({id:"lk",type:"like",user:{id:"u1",name:"سارة"},count:800}); await p.waitForTimeout(300);
 await p.click('[data-pstest]'); await p.waitForTimeout(500);
 const cur=await p.evaluate(()=>window.__arsh.psCur()); ok(cur&&cur.test&&cur.totals.likes>=800,'test report built and labeled test');
 for(const [sz,W,H] of [["story",1080,1920],["portrait",1080,1350],["square",1080,1080],["wide",1920,1080]]){
  await p.selectOption('[data-ps="size"]',sz); await p.waitForTimeout(250);
  const r=await p.evaluate(()=>{ const cv=document.getElementById('ps-cv'); return {w:cv.width,h:cv.height} });
  ok(r.w===W&&r.h===H,`size ${sz} → ${r.w}×${r.h}`);
  await p.evaluate(()=>{ window.__arsh.S.ps.lists={supporters:10,donors:10,likers:10,sharers:10,commenters:10}; });
  const fit=await p.evaluate(()=>{ const cv=document.createElement('canvas'); return window.__arsh.psDraw(cv,window.__arsh.psCur(),window.__arsh.S.ps,{}) });
  ok(fit.scale<=1&&fit.scale>0.25,`${sz}: auto-reflow scale ${fit.scale.toFixed(2)}`);
 }
 const n=await p.locator('[data-pst]').count(); ok(n>=35,'templates in studio: '+n);
 await p.click('[data-pst="gold-glass"]'); await p.waitForTimeout(200);
 for(const f of ["png","jpeg","webp"]){ const t=await p.evaluate(f=>window.__arsh.psBlob(f).then(b=>b&&b.type+":"+b.size),f); ok(t&&t.startsWith("image/"+f)&&+t.split(":")[1]>20000,'export '+t) }
 const dl=p.waitForEvent('download'); await p.click('[data-psdl="png"]'); const d=await dl; ok(/b6o6-stats-.*\.png$/.test(d.suggestedFilename()),'download file '+d.suggestedFilename());
 // نص RTL مرسوم (فحص بكسل غير فارغ في منطقة العنوان)
 const px=await p.evaluate(()=>{ const cv=document.getElementById('ps-cv'), x=cv.getContext('2d'); const d=x.getImageData(cv.width*0.5,40,cv.width*0.44,120).data; let v=new Set(); for(let i=0;i<d.length;i+=16) v.add(d[i]); return v.size }); ok(px>8,'header drawn ('+px+' tones)');
 // رسالة تقرير حقيقي من الخادم → نافذة «اكتمل بثك!»
 await p.evaluate(()=>{ const r={id:"real1",test:false,startedAt:Date.now()-7200000,endedAt:Date.now(),durationMs:7200000,totals:{likes:5000,follows:12,views:null},lists:{}}; window.__arsh.R().C.reports=[r]; window.__arsh.receive({t:"report",report:r}) });
 await p.waitForTimeout(200); ok(await p.locator('.modal:has-text("اكتمل بثك")').count()===1,'"اكتمل بثك!" modal');
 await p.click('[data-psopen]'); await p.waitForTimeout(300); ok(await p.evaluate(()=>window.__arsh.psCur().id)==="real1",'opens studio on that report');
 ok(await p.locator('[data-pssel] option').count()===2,'archive lists real + test reports');
 ok(errs.length===0,'no page errors '+errs.join(' | '));
 await p.screenshot({path:'/home/claude/najd/tests/poststats.png'});
 await b.close();
})();
