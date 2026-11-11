const { chromium } = require('/opt/npm-tools/node_modules/playwright');
(async()=>{
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const p=await (await b.newContext({viewport:{width:1440,height:1000}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file:///home/claude/najd/demo/index.html'); await p.click('.nav [data-go="billing"]'); await p.waitForTimeout(300);
 const t=await p.textContent('#root'); ok(/\$7/.test(t)&&/مجاناً/.test(t)&&/30/.test(t),'shows $7 struck, free for first 30 days');
 await p.click('[data-billm="3"]'); await p.waitForTimeout(200); ok((await p.textContent('[data-billbuy]')).includes('$21'),'3 months = $21');
 await p.click('[data-billbuy]'); await p.waitForTimeout(200); ok((await p.textContent('#toast')).includes('بعد إنشاء حساب'),'guest/demo: no fake payment');
 ok(errs.length===0,'no page errors '+errs.join(' | ')); await b.close();
})();
