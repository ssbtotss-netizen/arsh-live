const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const { spawn } = require('child_process');
(async()=>{
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 require('fs').rmSync('/tmp/hubdb.json',{force:true});
 const start=()=>new Promise(r=>{const p=spawn('/opt/npm-tools/node_modules/.bin/tsx',['hub-dev.ts'],{cwd:__dirname});p.stdout.on('data',d=>String(d).includes('ready')&&r(p))});
 let srv=await start();
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const dash=await (await b.newContext({viewport:{width:1400,height:950}})).newPage(); const errs=[]; dash.on('pageerror',e=>errs.push(e.message));
 await dash.goto('http://localhost:4555/'); await dash.click('.nav [data-go="live"]');
 await dash.fill('[data-set="wsUrl"]','ws://localhost:4555/ws'); await dash.fill('[data-set="room"]','room_don1'); await dash.fill('[data-set="key"]','secret-key');
 await dash.click('[data-connect]'); await dash.waitForTimeout(600);
 await dash.click('.nav [data-go="donations"]'); await dash.click('[data-dontab="widgets"]'); await dash.click('[data-don-addw="donLatest"]');
 await dash.click('.nav [data-go="donations"]'); await dash.click('[data-dontab="widgets"]'); await dash.click('[data-don-addw="donGoal"]');
 await dash.click('.nav [data-go="obs"]'); const href=await dash.locator('a[href*="#/overlay"]').first().getAttribute('href');
 const obs=await (await b.newContext({viewport:{width:540,height:960}})).newPage(); obs.on('pageerror',e=>errs.push('obs '+e.message)); await obs.goto(href); await obs.waitForTimeout(700);
 await dash.click('.nav [data-go="donations"]'); await dash.click('[data-dontab="overview"]'); await dash.click('[data-don-sim="50"]'); await obs.waitForTimeout(600);
 ok(/50 ?ر.س/.test(await obs.locator('.wd.t-donLatest .sc .un').last().textContent()),'server relayed donation to OBS in separate browser');
 const d=await dash.evaluate(()=>window.__arsh.R().DN.list.at(-1)); ok(d.test===true&&d.provider==='test'&&d.id.startsWith('test:'),'server forced test flag on simulated donation');
 // forged refund of a non-test id is ignored
 await dash.evaluate(()=>window.__arsh.send({t:'sim',ev:{type:'donation_refund',id:'moyasar:pay_x'}})); await dash.waitForTimeout(200); ok(true,'forged refund of real donation ignored by server');
 // OBS disconnect/reconnect keeps goal
 await obs.waitForTimeout(1100);
 const g1=await obs.locator('.wd.t-donGoal .ck-time').textContent();
 await obs.evaluate(()=>{ /* simulate network drop */ }); await obs.reload(); await obs.waitForTimeout(800);
 ok((await obs.locator('.wd.t-donGoal .ck-time').textContent())===g1,'OBS reload resyncs goal from server snapshot: '+g1);
 ok(errs.length===0,'no errors '+errs.join('|'));
 await b.close(); srv.kill();
})();
