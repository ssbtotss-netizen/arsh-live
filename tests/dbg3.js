const { chromium } = require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1440,height:1000}});
await p.goto('file:///home/claude/najd/demo/index.html');await p.click('.nav [data-go="socials"]');await p.waitForTimeout(300);
console.log(await p.evaluate(()=>{const l=document.querySelector('[data-accpv] .sc .lg');const cs=getComputedStyle(l);return [l.offsetWidth,cs.width,cs.getPropertyValue('--sh'),getComputedStyle(l.closest('.wd')).getPropertyValue('--sh'),cs.display].join(' | ')}));await b.close()})();
