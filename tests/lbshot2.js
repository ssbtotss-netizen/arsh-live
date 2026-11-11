const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{ const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'}); const p=await b.newPage({viewport:{width:1440,height:1000}});
 await p.goto('file:///home/claude/najd/demo/index.html'); await p.evaluate(()=>localStorage.clear()); await p.reload();
 await p.click('.nav [data-go="studio"]'); await p.selectOption('select[data-act="addW"]','@lb5'); await p.waitForTimeout(200); await p.selectOption('select[data-act="addW"]','sgoal');
 for(const k of ['biggift','roses100','supporter','supporter','supporter','like1000']) { await p.evaluate(k=>window.__arsh.SIM[k](),k); await p.waitForTimeout(120) }
 await p.waitForTimeout(1200); await p.screenshot({path:'shots/lb-studio.png'});
 await p.click('.nav [data-go="library"]'); await p.click('[data-libtab="pro"]'); await p.waitForTimeout(700); await p.screenshot({path:'shots/lb-lib-all.png'});
 await b.close() })();
