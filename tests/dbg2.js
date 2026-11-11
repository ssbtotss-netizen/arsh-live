const { chromium } = require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:2});
await p.goto('file:///home/claude/najd/demo/index.html');await p.click('.nav [data-go="library"]');await p.waitForTimeout(300);
await p.locator('[data-pv="royal"]').screenshot({path:'z-royal.png'});
console.log(await p.evaluate(()=>{const n=document.querySelector('[data-pv="royal"] .r .nm');const s=getComputedStyle(n);return [n.textContent,s.color,s.fontSize,s.webkitTextFillColor,s.backgroundClip].join(' | ')}));await b.close()})();
