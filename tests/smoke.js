const { chromium } = require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1440,height:1000}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
await p.goto('file:///home/claude/najd/demo/index.html');
for(const g of ['home','live','boards','likes','gifts','comments','library','subathon','timers','stats','studio','obs','settings','account']){await p.click(`.nav [data-go="${g}"]`);await p.waitForTimeout(150);await p.screenshot({path:`s2-${g}.png`})}
console.log(errs.length?'ERR '+errs.join(' | '):'no errors');await b.close()})();
