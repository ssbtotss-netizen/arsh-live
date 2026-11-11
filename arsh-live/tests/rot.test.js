const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const url='file:///home/claude/najd/demo/index.html';
(async()=>{
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:1440,height:1000}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto(url);
 // studio: add rotating accounts element via add menu
 await p.click('.nav [data-go="studio"]'); await p.selectOption('select[data-act="addW"]','@rotation'); await p.waitForTimeout(300);
 const ws=await p.evaluate(()=>window.__arsh.L().widgets.filter(w=>w.type==='social'));
 ok(ws.length===1&&ws[0].mode==='rotation','one element for rotating accounts (no card per account)');
 const label=await p.evaluate(()=>[...document.querySelectorAll('[data-canvas]')].map(b=>b.textContent));
 ok(label[0].includes('1080×1920')&&label[1].includes('1920×1080'),'dimension labels correct: '+label);
 const rendered=await p.evaluate(()=>[...document.querySelectorAll('[data-canvas]')].map(b=>{const r=document.createRange(); r.selectNodeContents(b); return b.innerText}));
 // sample studio for 14s: never more than one account
 const sample=async (pg,sel,ms)=>{ let max=0, seq=[]; const t0=Date.now(); while(Date.now()-t0<ms){ const r=await pg.evaluate(s=>[...document.querySelectorAll(s)].map(e=>e.dataset.acc),sel); max=Math.max(max,r.length); if(r[0]&&seq[seq.length-1]!==r[0]) seq.push(r[0]); await pg.waitForTimeout(60) } return {max,seq} };
 const st=await sample(p,'#stage .so-social .scs > .sc',13500);
 ok(st.max===1,'studio: never more than one account visible (max='+st.max+')');
 ok(st.seq.length>=3&&new Set(st.seq.slice(0,3)).size===3,'studio: accounts rotate TikTok → Instagram → Snapchat ('+st.seq.length+' switches)');
 await p.screenshot({path:'rot-studio.png'});
 // OBS link + second link: same account
 await p.click('.nav [data-go="obs"]'); const href=await p.locator('a[href*="#/overlay"]').first().getAttribute('href');
 const o1=await ctx.newPage(), o2=await ctx.newPage(); for(const o of [o1,o2]){ o.on('pageerror',e=>errs.push('ov '+e.message)); await o.setViewportSize({width:540,height:960}); }
 await o1.goto(href); await p.waitForTimeout(700); await o2.goto(href); await o2.waitForTimeout(500);
 const so=await sample(o1,'.so-social .scs > .sc',7000); ok(so.max===1,'OBS: one account at a time');
 let same=0,tot=0; for(let i=0;i<20;i++){ const a=await o1.evaluate(()=>document.querySelector('.so-social .scs > .sc')?.dataset.acc||null), c=await o2.evaluate(()=>document.querySelector('.so-social .scs > .sc')?.dataset.acc||null); if(a&&c){ tot++; if(a===c) same++ } await o1.waitForTimeout(150) }
 ok(tot>5&&same>=tot-1,`two OBS links in sync (${same}/${tot})`);
 const bgcol=await o1.evaluate(()=>getComputedStyle(document.body).backgroundColor); ok(bgcol==='rgba(0, 0, 0, 0)','OBS background fully transparent');
 // controls: pause / next / resume
 await p.click('.nav [data-go="socials"]'); await p.click('[data-soctab="rotation"]'); await p.waitForTimeout(300);
 await p.click('[data-rot-act="pause"]'); await o1.waitForTimeout(400); const pa=await o1.evaluate(()=>document.querySelector('.so-social .scs > .sc')?.dataset.acc); await o1.waitForTimeout(6500);
 ok(pa&&await o1.evaluate(()=>document.querySelector('.so-social .scs > .sc')?.dataset.acc)===pa,'pause: same account stays on OBS');
 await p.click('[data-rot-act="next"]'); await o1.waitForTimeout(1600); const nx=await o1.evaluate(()=>document.querySelector('.so-social .scs > .sc')?.dataset.acc); ok(nx&&nx!==pa,'next: moves to next account on OBS');
 await p.click('[data-rot-act="resume"]');
 // hide one account → excluded
 const ids=await p.evaluate(()=>window.__arsh.S.socials.accounts.map(a=>a.id));
 await p.uncheck('[data-ri-en="1"]'); await p.waitForTimeout(200);
 const slots=await p.evaluate(()=>{ return null }); 
 const st2=await sample(o1,'.so-social .scs > .sc',14000); ok(!st2.seq.includes(ids[1]),'hidden account no longer shown');
 // reorder via drag
 const before=await p.evaluate(()=>window.__arsh.S.socials.rotation.items.map(i=>i.accountId).join());
 await p.dragAndDrop('[data-ri="0"]','[data-ri="2"]'); await p.waitForTimeout(300);
 const after=await p.evaluate(()=>window.__arsh.S.socials.rotation.items.map(i=>i.accountId).join()); ok(after!==before,'drag & drop reorder: '+after);
 // change duration
 await p.fill('[data-rot="showSec"]','2'); await p.press('[data-rot="showSec"]','Tab'); await p.waitForTimeout(200);
 ok(await p.evaluate(()=>window.__arsh.S.socials.rotation.showSec)===2,'show duration changed');
 // design change while running (no restart of cycle)
 await p.click('[data-soctab="style"]'); await p.waitForTimeout(300);
 const accBefore=await o1.evaluate(()=>document.querySelector('.so-social .scs > .sc')?.dataset.acc); const sa=await p.evaluate(()=>window.__arsh.S.socials.rotation.startedAt);
 await p.click('[data-sdesign="neonPink"]'); let dz=false; for(let i=0;i<40&&!dz;i++){ await o1.waitForTimeout(100); dz=await o1.evaluate(()=>!!document.querySelector('.so-social .ib.sd-neonPink')) }
 ok(dz,'design changed live on OBS');
 ok(await p.evaluate(()=>window.__arsh.S.socials.rotation.startedAt)===sa,'design change did not restart the cycle');
 ok(await p.locator('[data-sdesign]').count()===50,'50 designs in library with previews');
 await p.screenshot({path:'rot-style.png',fullPage:true});
 // sweep present & animated
 ok(await o1.evaluate(()=>{ const i=document.querySelector('.so-social .swp i'); return !!i&&i.getAnimations().length>0 }),'white light sweep running on OBS');
 // anim library
 await p.click('[data-soctab="anim"]'); await p.waitForTimeout(400);
 ok(await p.locator('[data-kind="in"]').count()===30&&await p.locator('[data-kind="out"]').count()===20&&await p.locator('[data-idle-set]').count()===10,'30 entrances, 20 exits, 10 idle animations with previews');
 await p.click('[data-anim-try="letters"] .pv'); await p.waitForTimeout(100); ok(await p.evaluate(()=>document.querySelectorAll('[data-animpv="in:letters"] .un span').length>3),'letter-by-letter entrance plays');
 await p.screenshot({path:'rot-anim.png'});
 // preview window controls
 await p.click('[data-soctab="rotation"]'); await p.waitForTimeout(300); await p.click('[data-pv="next"]'); await p.waitForTimeout(800);
 ok(await p.evaluate(()=>document.querySelectorAll('#rot-pv .so-social .scs > .sc').length)<=1,'preview window: one account, next works');
 // reload: settings saved
 await p.reload(); await p.waitForTimeout(500);
 const pr=await p.evaluate(()=>[window.__arsh.S.socials.rotation.showSec,window.__arsh.L().widgets.filter(w=>w.type==='social').map(w=>w.design+'/'+w.mode).join()]);
 ok(pr[0]===2&&pr[1].includes('neonPink'),'settings persisted after reload '+JSON.stringify(pr));
 // mobile
 const m=await b.newPage({viewport:{width:390,height:844}}); await m.goto(url); await m.click('.mobnav [data-go="socials"]'); await m.click('[data-soctab="rotation"]'); await m.waitForTimeout(500);
 const ms=await sample(m,'#rot-pv .so-social .scs > .sc',3000); ok(ms.max<=1,'mobile: rotation page works');
 await m.screenshot({path:'rot-mobile.png',fullPage:false});
 ok(errs.length===0,'no errors '+errs.join('|'));
 await b.close();
})();
