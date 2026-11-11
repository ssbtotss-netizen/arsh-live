const { chromium } = require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const p=await b.newPage();
p.on('pageerror',e=>console.log('ERR',e.message,e.stack.split('\n')[1]));p.on('console',m=>m.type()==='error'&&console.log('CONSOLE',m.text()));
await p.goto(process.argv[2]||'file:///home/claude/najd/demo/index.html');await p.waitForTimeout(500);await b.close()})();
