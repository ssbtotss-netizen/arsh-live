const { chromium } = require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1440,height:1000}});
await p.goto('file:///home/claude/najd/demo/index.html');await p.click('.nav [data-go="socials"]');await p.waitForTimeout(300);
console.log(await p.evaluate(()=>{const box=document.querySelector('[data-accpv]');const st=box.querySelector('.stage');const wd=st.querySelector('.wd');const sc=wd.querySelector('.sc');const r=x=>{const q=x.getBoundingClientRect();return Math.round(q.left)+'-'+Math.round(q.right)};return ['box',r(box),'stage',r(st),st.style.left,st.style.transform,'wd',r(wd),'sc',r(sc)].join(' ')}));await b.close()})();
