const { chromium } = require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1440,height:1000}});
await p.goto('file:///home/claude/najd/demo/index.html');await p.click('.nav [data-go="library"]');await p.waitForTimeout(300);
console.log(await p.evaluate(()=>{const r=document.querySelector('[data-pv="royal"] .r');return [...r.children].map(c=>c.className+':'+c.offsetWidth+'x'+c.offsetHeight+' '+getComputedStyle(c).display).join('\n')+'\nrow '+r.offsetWidth}));await b.close()})();
