const { chromium } = require('/opt/npm-tools/node_modules/playwright');
(async()=>{
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const p=await (await b.newContext({viewport:{width:1440,height:1000}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file:///home/claude/najd/demo/index.html'); await p.evaluate(()=>localStorage.clear()); await p.goto('file:///home/claude/najd/demo/index.html');
 await p.click('.nav [data-go="alerts"]'); await p.waitForTimeout(300);
 ok(await p.$('[data-alsec="official"]'),'library page with sections');
 await p.click('[data-alsec="official"]'); await p.waitForTimeout(300);
 ok((await p.$$('.al-card')).length>=90,'official templates listed: '+(await p.$$('.al-card')).length);
 await p.click('[data-altab="create"]'); await p.waitForTimeout(200);
 ok(await p.evaluate(()=>document.querySelector('[data-alff="visibility"][value="private"]').checked),'privacy defaults to private');
 await p.click('[data-alsave]'); await p.waitForTimeout(200);
 ok(await p.evaluate(()=>/الاسم مطلوب/.test(document.body.innerText)),'mandatory fields enforced');
 await p.selectOption('[data-alff="kind"]','image'); await p.waitForTimeout(150);
 await p.setInputFiles('[data-alfile="media"]','/tmp/evil.png'); await p.waitForTimeout(300);
 ok(await p.evaluate(()=>!S.al.form.mediaId),'executable disguised as .png rejected');
 await p.setInputFiles('[data-alfile="media"]','/tmp/al.png'); await p.waitForTimeout(400);
 ok(await p.evaluate(()=>S.al.form.mediaId==="local"&&/^data:image\/png/.test(S.al.form.mediaData)),'real PNG accepted');
 await p.fill('[data-alff="name"]','تاج ذهبي'); await p.dispatchEvent('[data-alff="name"]','change');
 await p.fill('[data-alff="description"]','آيرت متابعة'); await p.dispatchEvent('[data-alff="description"]','change');
 await p.fill('[data-alff="config.title.text"]','شكراً على الفولو يا {display_name} ❤️'); await p.dispatchEvent('[data-alff="config.title.text"]','change');
 await p.click('[data-alsave]'); await p.waitForTimeout(400);
 const loc=await p.evaluate(()=>ls("b6o6.alerts")); ok(loc.length===1&&loc[0].visibility==="private"&&loc[0].name==="تاج ذهبي",'saved privately');
 await p.click('[data-aluse]'); await p.waitForTimeout(400);
 ok(await p.evaluate(()=>S.bots.alerts.rules.length===1&&S.al.tab==="rules"),'use → rule created, rules tab');
 await p.click('[data-aladdbox]'); await p.waitForTimeout(300);
 ok(await p.evaluate(()=>L().widgets.some(w=>w.type==="abox")),'Universal Alert Box widget added');
 await p.fill('[data-altv="display_name"]','سارة'); await p.dispatchEvent('[data-altv="display_name"]','input');
 await p.click('[data-alrtest="0"]'); await p.waitForTimeout(900);
 const t=await p.evaluate(()=>[...document.querySelectorAll('#al-pv .ab-tx')].map(e=>e.textContent).join('|'));
 ok(t.includes('شكراً على الفولو يا سارة ❤️'),'test plays in preview with custom name: '+t);
 ok(await p.evaluate(()=>!!document.querySelector('#al-pv img.ab-media')),'media layer rendered');
 // حدث حقيقي محاكى يمر بالمحرك
 await p.evaluate(()=>{ window.__arsh.send({t:"sim",ev:{type:"follow",id:"x1",platform:"tiktok",user:{id:"k",name:"كريم"}}}) });
 let t2=""; for(let i=0;i<40&&!t2.includes('كريم');i++){ await p.waitForTimeout(250); t2=await p.evaluate(()=>[...document.querySelectorAll('#al-pv .ab-tx')].map(e=>e.textContent).join('|')) }
 ok(t2.includes('كريم'),'follow event → alert with real name: '+t2);
 await p.waitForTimeout(7500); ok(await p.evaluate(()=>!document.querySelector('#al-pv .ab-root')),'transparent/empty after duration');
 await p.click('[data-allv="likes"]'); await p.waitForTimeout(200); ok(await p.evaluate(()=>S.bots.alerts.rules.length===8),'tap levels preset adds 7 levels');
 // OBS (وضع التجربة)
 const url=await p.evaluate(()=>overlayURL(L(),L().widgets.find(w=>w.type==="abox").id));
 const o=await p.context().newPage(); await o.goto(url); await o.waitForTimeout(500);
 ok(await o.evaluate(()=>getComputedStyle(document.body).backgroundColor==="rgba(0, 0, 0, 0)"&&!document.querySelector('.ab-ph')),'OBS link transparent without controls');
 ok(await o.evaluate(()=>Object.keys(AB_DEFS).some(k=>k.startsWith("loc_"))),'OBS knows local alert defs');
 ok(errs.length===0,'no page errors '+errs.slice(0,3).join(' / '));
 await b.close();
})();
