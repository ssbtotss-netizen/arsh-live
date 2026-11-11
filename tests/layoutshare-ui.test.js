const { chromium } = require('/opt/npm-tools/node_modules/playwright');
(async()=>{
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:1440,height:1000},acceptDownloads:true}); await ctx.grantPermissions(['clipboard-read','clipboard-write']);
 const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file:///home/claude/najd/demo/index.html'); await p.evaluate(()=>localStorage.clear()); await p.goto('file:///home/claude/najd/demo/index.html');
 await p.click('.nav [data-go="studio"]'); await p.waitForTimeout(300);
 ok(await p.$('[data-lyshare]')&&await p.$('[data-lyimp]'),'studio: «📤 مشاركة التصميم» + «📥 استيراد تصميم»');
 const orig=await p.evaluate(()=>{ const l=L(); l.widgets.forEach((w,i)=>{ w.x=.05+i*.1; w.y=.1+i*.05; w.nameColor="#ff00aa" }); save(); return {id:l.id,n:l.widgets.length,canvas:l.canvas,pos:l.widgets.map(w=>[w.type,w.x,w.y,w.w,w.h,w.z,w.design])} });
 await p.click('[data-lyshare]'); await p.waitForTimeout(200);
 ok((await p.$$('.ly-scs input')).length>=3,'choose scenes (multi-scene pack possible)');
 await p.click('[data-ly="code"]'); await p.waitForTimeout(400);
 const code=await p.evaluate(()=>document.querySelector('.ly-code').textContent); const clip=await p.evaluate(()=>navigator.clipboard.readText());
 ok(/^B6O6-[A-HJ-NP-Z2-9]{8}$/.test(code)&&clip===code,'share code generated & copied: '+code);
 await p.click('.modal [data-cpfull]'); const full=await p.evaluate(()=>navigator.clipboard.readText()); ok(full.startsWith('B6O6L1:'),'full offline code available');
 const dl=p.waitForEvent('download'); await p.click('[data-ly="file"]'); const f=await dl; const fpath='/tmp/ly_export.json'; await f.saveAs(fpath); const fj=JSON.parse(require('fs').readFileSync(fpath,'utf8'));
 ok(fj.format==='b6o6.layout'&&fj.v===1&&fj.scenes[0].widgets.length===orig.n,'export design file (versioned JSON)');
 ok(!/"id":"w_|accountId":"ac_|"socials"|"bots"/.test(JSON.stringify(fj)),'exported file has no ids/accounts/private settings');
 await p.click('.modal [data-close]'); await p.waitForTimeout(150);
 // استيراد بالكود كمشهد جديد
 const before=await p.evaluate(()=>S.layouts.length);
 await p.click('[data-lyimp]'); await p.fill('#lyin',code); await p.click('[data-li="check"]'); await p.waitForTimeout(700);
 ok(await p.evaluate(()=>document.querySelectorAll('#lypv .wd, #lypv [class*="t-"]').length>0||document.querySelector('#lypv .stage').children.length>0),'preview renders the full scene');
 for(const k of ['gift','follow','likes','subathon','goal']) await p.click(`[data-lt="${k}"]`); await p.waitForTimeout(400);
 ok(await p.evaluate(()=>S.layouts.length)===before&&await p.evaluate(()=>R.D&&Object.keys(R.D.gifts||{}).length===0),'design test events use dummy data (no real data touched)');
 ok(await p.evaluate(()=>document.querySelector('[name="lym"][value="new"]').checked),'«إنشاء مشهد جديد» is the default');
 await p.click('[data-li="use"]'); await p.waitForTimeout(800);
 const imp=await p.evaluate(o=>{ const l=L(); return {n:S.layouts.length,id:l.id,nw:l.widgets.length,canvas:l.canvas,pos:l.widgets.map(w=>[w.type,w.x,w.y,w.w,w.h,w.z,w.design]),ids:l.widgets.map(w=>w.id),color:l.widgets.every(w=>w.nameColor==="#ff00aa")} },orig);
 ok(imp.n===before+1&&imp.id!==orig.id&&imp.nw===orig.n&&imp.canvas===orig.canvas,'imported as a NEW scene, original untouched');
 ok(JSON.stringify([...imp.pos].sort())===JSON.stringify([...orig.pos].sort())&&imp.color,'exact positions, sizes, layers, designs & colors preserved');
 ok(await p.evaluate(ids=>{ const all=S.layouts.flatMap(l=>l.widgets.map(w=>w.id)); return new Set(all).size===all.length },imp.ids),'no duplicate element ids');
 ok(await p.evaluate(()=>/أكمل إعداد تصميمك/.test(document.body.innerText)&&document.querySelectorAll('.ly-st').length>=2),'«أكمل إعداد تصميمك» with setup steps');
 ok(await p.evaluate(()=>[...document.querySelectorAll('[data-lygo]')].some(b=>/ربط الحساب لتفعيل العنصر/.test(b.textContent))),'«ربط الحساب لتفعيل العنصر» buttons');
 await p.click('.modal [data-close]'); await p.waitForTimeout(150);
 // OBS للمشهد المستورد
 const url=await p.evaluate(()=>overlayURL(L())); const o=await ctx.newPage(); await o.goto(url); await o.waitForTimeout(700);
 ok(await o.evaluate(n=>document.querySelectorAll('.stage > *').length>=n,imp.nw),'OBS link of the imported scene renders all elements');
 // الاستبدال + التراجع
 await p.evaluate(()=>{ S.active=S.layouts[0].id; renderPage() }); const prevW=await p.evaluate(()=>JSON.stringify(L().widgets));
 await p.click('[data-lyimp]'); await p.fill('#lyin',require('fs').readFileSync(fpath,'utf8').slice(0,0)+full); await p.click('[data-li="check"]'); await p.waitForTimeout(500);
 p.once('dialog',dg=>dg.accept()); await p.click('[name="lym"][value="replace"]'); await p.click('[data-li="use"]'); await p.waitForTimeout(600); await p.evaluate(()=>document.querySelectorAll('.modal').forEach(m=>m.remove()));
 ok(await p.evaluate(()=>!!LYS().undo&&LYS().undo.kind==="replace")&&await p.$('[data-lyundo]'),'replace: backup kept + «↩ تراجع» button');
 await p.click('[data-lyundo]'); await p.waitForTimeout(300); ok(await p.evaluate(pw=>JSON.stringify(L().widgets)===pw,prevW),'undo restores the previous scene exactly');
 // عنصر واحد
 await p.evaluate(()=>{ S.page="studio"; renderPage(); select(L().widgets[0].id) }); await p.waitForTimeout(300);
 await p.click('[data-lyel="copy"]'); const el=await p.evaluate(()=>navigator.clipboard.readText()); ok(el.startsWith('B6O6L1:')&&await p.evaluate(s=>lsFromInline(s).kind,el)==='element','copy a single element');
 const cnt=await p.evaluate(()=>{ S.active=S.layouts[1].id; renderPage(); return L().widgets.length });
 await p.click('[data-lyimp]'); await p.fill('#lyin',el); await p.click('[data-li="check"]'); await p.waitForTimeout(500);
 ok(await p.evaluate(()=>document.querySelector('[name="lym"][value="add"]').checked),'element import defaults to «add to current scene»');
 await p.click('[data-li="use"]'); await p.waitForTimeout(500); await p.evaluate(()=>document.querySelectorAll('.modal').forEach(m=>m.remove()));
 ok(await p.evaluate(c=>L().widgets.length===c+1,cnt),'single element added without the rest of the scene');
 // مكتبة التصاميم: القوالب الرسمية
 await p.click('.nav [data-go="layouts"]'); await p.waitForTimeout(800);
 ok((await p.$$('.ly-card')).length>=10,'library: official templates listed');
 await p.click('[data-lyshape="horizontal"]'); await p.waitForTimeout(400); const hz=await p.evaluate(()=>LYS().items.every(x=>x.shape==="horizontal")&&LYS().items.length>0); ok(hz,'filter by size: horizontal');
 await p.click('[data-lyshape=""]'); await p.click('[data-lycat="subathon"]'); await p.waitForTimeout(400); ok(await p.evaluate(()=>LYS().items.length>0&&LYS().items.every(x=>x.category==="subathon")),'filter by content type: subathon');
 await p.click('[data-lycat=""]'); await p.waitForTimeout(600); await p.evaluate(()=>scrollTo(0,0)); await p.waitForTimeout(900); ok(await p.evaluate(()=>document.querySelectorAll('.ly-thumb .stage').length>0),'live mini previews rendered');
 const n0=await p.evaluate(()=>S.layouts.length); await (await p.$$('[data-lyuse]'))[0].click(); await p.waitForTimeout(600); await p.click('[data-li="use"]'); await p.waitForTimeout(700);
 ok(await p.evaluate(n=>S.layouts.length===n+1&&L().widgets.length>=3,n0),'one-click install of an official template');
 // الملف
 await p.evaluate(()=>document.querySelectorAll('.modal').forEach(m=>m.remove())); await p.click('[data-lyimp]'); await p.setInputFiles('#lyfile',fpath); await p.waitForTimeout(600);
 ok(await p.evaluate(()=>!!document.querySelector('#lypv .stage')),'import from design file');
 await p.evaluate(()=>document.querySelectorAll('.modal').forEach(m=>m.remove()));
 // أمان: كود خبيث
 const bad=await p.evaluate(()=>{ const r=lsValidate({format:"b6o6.layout",v:1,scenes:[{canvas:"vertical",widgets:[{type:"likes",title:"<img src=x onerror=alert(1)>",design:"javascript:alert(1)",frameImg:"https://evil.x/a.png"}]}]}); const w=r.value.scenes[0].widgets[0]; return {t:w.title,d:w.design,f:w.frameImg} });
 ok(!/onerror|javascript|evil/.test(JSON.stringify(bad)),'malicious code & untrusted links stripped on import');
 // الجوال
 const m=await (await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true})).newPage(); await m.goto('file:///home/claude/najd/demo/index.html'); await m.evaluate(()=>{ S.page="layouts"; renderPage() }); await m.waitForTimeout(600);
 ok(await m.evaluate(()=>document.documentElement.scrollWidth<=400&&document.querySelectorAll('.ly-card').length>0),'mobile: library usable, no overflow');
 ok(errs.length===0,'no page errors '+errs.slice(0,3).join(' / '));
 await b.close();
})();
