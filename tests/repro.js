const { chromium } = require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1440,height:1000}});
await p.goto('file:///home/claude/najd/demo/index.html');
await p.click('.nav [data-go="socials"]'); await p.click('[data-soctab="display"]'); await p.click('[data-soc-addw="rotation"]');
await p.click('.nav [data-go="socials"]'); await p.click('[data-soctab="rotation"]'); await p.click('[data-rot-run="1"]');
await p.click('.nav [data-go="studio"]'); let max=0; for(let i=0;i<80;i++){ await p.waitForTimeout(100); max=Math.max(max,await p.evaluate(()=>document.querySelectorAll('#stage .so-social .scs > .sc').length)); }
console.log('studio max simultaneous chips:',max);
await p.click('.nav [data-go="obs"]'); const href=await p.locator('a[href*="#/overlay"]').first().getAttribute('href'); const o=await b.newPage(); await o.goto(href); let m2=0; for(let i=0;i<120;i++){ await o.waitForTimeout(100); m2=Math.max(m2,await o.evaluate(()=>document.querySelectorAll('.so-social .scs > .sc').length)); } console.log('overlay max:',m2);
console.log(await p.evaluate(()=>[...document.querySelectorAll('[data-canvas]')].map(b=>b.textContent).join(' | ')));
await b.close()})();
