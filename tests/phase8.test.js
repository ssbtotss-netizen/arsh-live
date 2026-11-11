const { chromium } = require('/opt/npm-tools/node_modules/playwright');
(async()=>{
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const p=await (await b.newContext({viewport:{width:1440,height:1000}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file:///home/claude/najd/demo/index.html'); await p.click('.nav [data-go="billing"]'); await p.waitForTimeout(300);
 const prices=await p.$$eval('#root .grid.g3 .card div[style*="font-size:30px"]',e=>e.map(x=>x.textContent.replace(/\s+/g,' ').trim()));
 ok(prices.length===5&&prices[1].startsWith('$5')&&prices[4].startsWith('$60'),'5 plans with $5/$15/$30/$60 '+JSON.stringify(prices));
 await p.click('[data-billm="3"]'); await p.waitForTimeout(200);
 ok((await p.$$eval('#root .grid.g3 .card div[style*="font-size:30px"]',e=>e[2].textContent)).startsWith('$45'),'3-month total = $45 for Pro');
 await p.click('[data-billbuy="pro"]'); await p.waitForTimeout(200);
 ok((await p.textContent('#toast')).includes('بعد إنشاء حساب'),'guest/demo: no fake payment, explains requirement');
 ok(errs.length===0,'no page errors '+errs.join(' | '));
 await b.close();
})();
