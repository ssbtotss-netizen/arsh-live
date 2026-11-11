const { chromium } = require('/opt/npm-tools/node_modules/playwright'); const { execSync }=require('child_process');
const url='file:///home/claude/najd/demo/index.html';
(async()=>{
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const p=await (await b.newContext({viewport:{width:1440,height:1000},acceptDownloads:true})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto(url); await p.evaluate(()=>localStorage.clear()); await p.goto(url);
 const n=await p.evaluate(()=>({le:LE_DESIGNS.length,uc:UC_DESIGNS.length,np:NP_DESIGNS.length,bio:BIO_DESIGNS.length,ps:PS_TEMPLATES.length,u:[LE_DESIGNS,UC_DESIGNS,NP_DESIGNS,BIO_DESIGNS].every(L=>new Set(L.map(d=>d.id)).size===L.length)}));
 ok(n.le===80&&n.uc===30&&n.np===30&&n.bio===40&&n.ps>=35&&n.u,'design counts '+JSON.stringify(n));
 // كل تصميم بايو له CSS خاص (خلفية مختلفة)
 await p.click('.nav [data-go="bio"]'); await p.waitForTimeout(300);
 const bgs=await p.evaluate(async()=>{ const out=new Set(); for(const d of BIO_DESIGNS){ document.querySelector(`[data-biod="${d.id}"]`).click(); await new Promise(r=>setTimeout(r,20)); const e=document.querySelector('#bio-pv .bio'); out.add(getComputedStyle(e).backgroundImage+getComputedStyle(e).backgroundColor) } return out.size });
 ok(bgs===40,'40 bio designs each with its own background ('+bgs+')');
 await p.fill('[data-bio="handle"]','abdulrahman'); await p.dispatchEvent('[data-bio="handle"]','input'); await p.waitForTimeout(200);
 await p.click('.nav [data-go="home"]'); await p.click('.nav [data-go="bio"]'); await p.waitForTimeout(300);
 ok(await p.locator('#bio-qr svg').count()===1,'QR shown on bio page');
 const dl=p.waitForEvent('download'); await p.click('[data-bioqr="png"]'); const d=await dl; await d.saveAs('/tmp/bioqr.png');
 const want=await p.evaluate(()=>document.querySelector('[data-biocopy]').previousElementSibling.value);
 const got=execSync(`python3 -c "import cv2;print(cv2.QRCodeDetector().detectAndDecode(cv2.imread('/tmp/bioqr.png'))[0])"`).toString().trim();
 ok(got===want,'downloaded QR decodes to the bio link: '+got);
 // اصنع تصميمك
 await p.click('.nav [data-go="latest"]'); await p.click('[data-leall="1"]'); await p.waitForTimeout(300);
 const ids=await p.evaluate(()=>window.__arsh.L().widgets.filter(w=>w.type==="levent").map(w=>w.id));
 await p.evaluate(id=>{ const w=window.__arsh.L().widgets.find(x=>x.id===id); Object.assign(w,{design:"duckUltimate",c1:"#123456",frame:"hex",font:"Changa",animSpeed:1.5}) },ids[0]);
 p.once('dialog',dg=>dg.accept('تصميمي الذهبي')); await p.evaluate(id=>{ const b=document.createElement('button'); b.dataset.lemysave=id; document.querySelector('#le-mine').appendChild(b); b.click() },ids[0]); await p.waitForTimeout(300);
 ok(await p.evaluate(()=>window.__arsh.S.leMine.length===1&&window.__arsh.S.leMine[0].name==='تصميمي الذهبي'),'custom design saved');
 await p.click(`[data-lemyapply="0"][data-wid="${ids[1]}"]`); await p.waitForTimeout(300);
 const w1=await p.evaluate(id=>window.__arsh.L().widgets.find(x=>x.id===id),ids[1]);
 ok(w1.design==="duckUltimate"&&w1.c1==="#123456"&&w1.frame==="hex"&&w1.font==="Changa"&&w1.kind!==undefined,'applied to another element (style only, kind kept)');
 const dl2=p.waitForEvent('download'); await p.click('[data-lemyexp="0"]'); const f2=await dl2; await f2.saveAs('/tmp/myle.json');
 await p.setInputFiles('[data-lemyimp]','/tmp/myle.json'); await p.waitForTimeout(400);
 ok(await p.evaluate(()=>window.__arsh.S.leMine.length===2&&window.__arsh.S.leMine[0].style.design==='duckUltimate'),'export → import round trip');
 ok(errs.length===0,'no page errors '+errs.join(' | '));
 await b.close();
})();
