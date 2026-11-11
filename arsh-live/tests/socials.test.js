const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const url='file:///home/claude/najd/demo/index.html';
(async()=>{
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:1440,height:1000}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto(url); await p.click('.nav [data-go="socials"]'); await p.waitForTimeout(300);
 ok(await p.locator('.card [data-accpv]').count()===3,'3 default social accounts with live previews');
 await p.screenshot({path:'so-accounts.png'});
 // add a social account
 await p.click('[data-acc-add="social"]'); await p.waitForTimeout(200);
 const ids=await p.evaluate(()=>window.__arsh.S.socials.accounts.map(a=>a.id)); const nid=ids[ids.length-1];
 await p.selectOption(`select[data-acf="platform"][data-acc="${nid}"]`,'twitch'); await p.waitForTimeout(150);
 await p.fill(`input[data-acf="username"][data-acc="${nid}"]`,'b6o6live'); await p.waitForTimeout(150);
 const acc=await p.evaluate(id=>window.__arsh.S.socials.accounts.find(a=>a.id===id),nid);
 ok(acc.platform==='twitch'&&acc.username==='b6o6live','new Twitch account saved');
 ok((await p.locator(`[data-accpv="${nid}"] .un`).textContent())==='@b6o6live','preview shows @b6o6live');
 // games: valorant + COD formats, two accounts same game
 await p.click('[data-soctab="games"]'); await p.waitForTimeout(200);
 const gtxt=await p.locator('[data-accpv] .un').allTextContents(); ok(gtxt.includes('@B6O6')&&gtxt.includes('B6O6#1234567'),'Roblox and COD id formats: '+gtxt);
 await p.click('[data-acc-add="game"]'); await p.click('[data-acc-add="game"]'); await p.waitForTimeout(200);
 const vals=await p.evaluate(()=>window.__arsh.S.socials.accounts.filter(a=>a.platform==='valorant').length); ok(vals===2,'two accounts for same game (Valorant)');
 ok((await p.locator('[data-accpv] .un').allTextContents()).includes('B6O6#SA1'),'Valorant Riot ID#Tag format');
 await p.screenshot({path:'so-games.png'});
 // entrances tab
 await p.click('[data-soctab="anim"]'); await p.waitForTimeout(300);
 ok(await p.locator('[data-anim-try]').count()>=50,'entrance + exit library with live previews ('+await p.locator('[data-anim-try]').count()+')');
 await p.click('[data-anim-try="flip3d"] .pv'); await p.waitForTimeout(100);
 ok(await p.evaluate(()=>document.querySelector('[data-animpv="in:flip3d"] .sc').getAnimations().length>0),'click replays entrance animation');
 await p.click('[data-anim-set="enter"][data-anim="softBounce"]'); ok(await p.evaluate(()=>window.__arsh.S.socials.rotation.enter)==='softBounce','set default entrance');
 // display: add rotation + ondemand + bar widgets
 await p.click('[data-soctab="display"]'); await p.click('[data-soc-addw="rotation"]'); await p.click('[data-soctab="display"]').catch(()=>{});
 await p.click('.nav [data-go="socials"]'); await p.click('[data-soctab="display"]'); await p.click('[data-soc-addw="bar"]');
 await p.click('.nav [data-go="socials"]'); await p.click('[data-soctab="display"]'); await p.click('[data-soc-addw="panel-game"]');
 const types=await p.evaluate(()=>window.__arsh.L().widgets.map(w=>w.type)); ok(types.filter(t=>t.startsWith('social')).length===3,'social widgets added: '+types);
 // rotation sync across overlays
 await p.click('.nav [data-go="socials"]'); await p.click('[data-soctab="rotation"]'); await p.fill('input[data-rot="showSec"]','3'); await p.press('input[data-rot="showSec"]','Tab'); await p.fill('input[data-rot="gapSec2"]','1'); await p.press('input[data-rot="gapSec2"]','Tab');
 await p.click('[data-rot-run="1"]'); await p.waitForTimeout(200);
 await p.click('.nav [data-go="obs"]'); const href=await p.locator('a[href*="#/overlay"]').first().getAttribute('href');
 const o1=await ctx.newPage(), o2=await ctx.newPage(); for(const o of [o1,o2]){ o.on('pageerror',e=>errs.push('ov '+e.message)); await o.setViewportSize({width:540,height:960}); }
 await o1.goto(href); await p.waitForTimeout(1300); await o2.goto(href); await o2.waitForTimeout(1500);
 const cur=async o=>o.evaluate(()=>{const c=document.querySelector('.so-social .scs > .sc:last-child'); return c?c.dataset.acc:null});
 let a1=null,a2=null; for(let i=0;i<20&&!a1;i++){ await o1.waitForTimeout(150); a1=await cur(o1); a2=await cur(o2) } ok(a1&&a1===a2,'two OBS sources show same account at same moment ('+a1+')');
 await o1.waitForTimeout(5500); const a3=await cur(o1); ok(a3&&a3!==a1,'rotation moved to next account ('+a3+')');
 await o1.screenshot({path:'so-overlay.png',omitBackground:true});
 ok(await o1.locator('.so-socialBar .trk .sc').count()>=10,'social bar marquee renders duplicated track');
 // on-demand
 const ig=await p.evaluate(()=>window.__arsh.S.socials.accounts.find(a=>a.platform==='instagram').id);
 await p.click('.nav [data-go="studio"]'); await p.click('#testbar [data-soc-try="instagram"]'); await o1.waitForTimeout(1300);
 ok((await cur(o1))===ig,'on-demand shows Instagram immediately in overlay (interrupts rotation)');
 // live edit propagates
 await p.click('.nav [data-go="socials"]'); await p.click('[data-soctab="accounts"]'); await p.fill(`input[data-acf="username"][data-acc="${ig}"]`,'newname'); await p.press(`input[data-acf="username"][data-acc="${ig}"]`,'Tab'); await o1.waitForTimeout(500);
 ok(await o1.evaluate(()=>[...document.querySelectorAll('.so-socialBar .un')].some(e=>e.textContent==='@newname')),'edit in dashboard updates OBS immediately');
 // standalone account link
 await p.click('[data-soctab="display"]'); const accHref=await p.evaluate(id=>{let u;const orig=navigator.clipboard.writeText;navigator.clipboard.writeText=t=>{u=t;return Promise.resolve()};document.querySelector(`[data-copy-acc="${id}"]`).click();navigator.clipboard.writeText=orig;return u},ig);
 const o3=await ctx.newPage(); await o3.setViewportSize({width:900,height:130}); await o3.goto(accHref); await o3.waitForTimeout(800);
 ok((await o3.locator('.sc .un').first().textContent())==='@newname','standalone account link renders that account');
 await o3.screenshot({path:'so-single.png',omitBackground:true});
 // persistence
 await p.reload(); await p.waitForTimeout(400); ok(await p.evaluate(()=>window.__arsh.S.socials.accounts.length)===8,'accounts persisted after reload');
 // library tab
 await p.click('.nav [data-go="library"]'); await p.click('[data-libtab="socials"]'); await p.waitForTimeout(300);
 ok(await p.locator('.libc').count()===50,'50 social designs'); await p.screenshot({path:'so-library.png',fullPage:true});
 ok(errs.length===0,'no errors '+errs.join('|'));
 await b.close();
})();
