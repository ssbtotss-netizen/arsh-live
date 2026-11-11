const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const { spawn } = require('child_process');
const start=()=>new Promise(r=>{const p=spawn('/opt/npm-tools/node_modules/.bin/tsx',['hub-dev.ts'],{cwd:__dirname});p.stdout.on('data',d=>String(d).includes('ready')&&r(p));p.stderr.on('data',d=>process.stderr.write(d))});
(async()=>{
 require('fs').rmSync('/tmp/hubdb.json',{force:true});
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 let srv=await start();
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const dash=await (await b.newContext({viewport:{width:1400,height:950}})).newPage(); const errs=[]; dash.on('pageerror',e=>errs.push(e.message));
 await dash.goto('http://localhost:4555/'); await dash.click('.nav [data-go="live"]');
 await dash.fill('[data-set="wsUrl"]','ws://localhost:4555/ws'); await dash.fill('[data-set="room"]','room_test1'); await dash.fill('[data-set="key"]','secret-key');
 await dash.click('[data-connect]'); await dash.waitForTimeout(600);
 const rem=pg=>pg.evaluate(()=>{const s=window.__arsh?window.__arsh.R().C.subathon:null; return s.status==='running'?s.endsAt-Date.now():s.remainingMs});
 await dash.click('.nav [data-go="subathon"]'); await dash.click('[data-sa-op="reset"]'); await dash.click('[data-sa-op="start"]'); await dash.waitForTimeout(400);
 ok((await dash.evaluate(()=>window.__arsh.R().C.subathon.status))==='running','subathon started on server');
 await dash.click('.nav [data-go="obs"]'); const href=await dash.locator('a[href*="#/overlay"]').first().getAttribute('href');
 const obs=await (await b.newContext({viewport:{width:540,height:960}})).newPage(); obs.on('pageerror',e=>errs.push('obs '+e.message));
 await obs.goto(href); await obs.waitForTimeout(700);
 const tObs=()=>obs.locator('.t-subathon .ck-time').textContent(); const toS=t=>{const a=t.split(':').map(Number);return a[0]*3600+a[1]*60+a[2]};
 const r1=await rem(dash); ok(Math.abs(toS(await tObs())-r1/1000)<=2,'OBS (separate browser) shows server subathon time');
 // duplicate gift from server side
 await dash.evaluate(()=>{const ev={id:'G-1',type:'gift',user:{id:'k',name:'خالد'},gift:'Lion',giftId:6369,diamonds:29999,value:29999,count:1}; window.__arsh.send({t:'sim',ev}); window.__arsh.send({t:'sim',ev})});
 await dash.waitForTimeout(500);
 const r2=await rem(dash); ok(Math.abs(r2-r1-1800000)<2500,'server added 30 min once for duplicated gift id');
 ok(Math.abs(toS(await tObs())-r2/1000)<=2,'OBS updated with added time');
 ok(await obs.locator('.t-subathon .tfx').count()>=1,'OBS +time effect');
 // OBS reconnect: kill server, restart → state restored, no double counting
 srv.kill(); await new Promise(r=>setTimeout(r,800)); srv=await start(); await obs.waitForTimeout(2500);
 await dash.click('.nav [data-go="live"]'); await dash.click('[data-connect]'); await dash.waitForTimeout(800);
 const r3=await rem(dash); ok(Math.abs(r3-(r2-3500))<3000,'after server restart subathon restored with correct remaining ('+Math.round((r2-r3)/1000)+'s elapsed)');
 await dash.evaluate(()=>{window.__arsh.send({t:'sim',ev:{id:'G-1',type:'gift',user:{id:'k',name:'خالد'},gift:'Lion',giftId:6369,diamonds:29999,value:29999,count:1}})}); await dash.waitForTimeout(400);
 const r4=await rem(dash); ok(r4<=r3+500,'replayed gift after restart not double-counted in logs/time? '+Math.round((r4-r3)/1000)+'s');
 ok(Math.abs(toS(await tObs())-r4/1000)<=2,'OBS auto-reconnected and resynced');
 // read-only link cannot edit
 const ro=await obs.evaluate(()=>new Promise(res=>{const w=new WebSocket('ws://localhost:4555/ws');w.onopen=()=>{w.send(JSON.stringify({t:'join',room:'room_test1'}));setTimeout(()=>w.send(JSON.stringify({t:'clock-op',target:'subathon',op:'end'})),200)};w.onmessage=e=>{const m=JSON.parse(e.data);if(m.t==='status'&&m.text)res(m.text)};setTimeout(()=>res('none'),1500)}));
 ok(ro.includes('للقراءة فقط'),'OBS link is read-only: '+ro);
 ok((await dash.evaluate(()=>window.__arsh.R().C.subathon.status))==='running','subathon still running');
 ok(errs.length===0,'no errors '+errs.join('|'));
 await b.close(); srv.kill();
})();
