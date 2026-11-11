const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const url='file:///home/claude/najd/demo/index.html';
(async()=>{
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:1440,height:1000}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto(url); await p.evaluate(()=>{localStorage.clear()}); await p.goto(url);
 await p.click('.nav [data-go="studio"]');
 for(const v of ['@lb5','@lbLikes']){ await p.selectOption('select[data-act="addW"]',v); await p.waitForTimeout(200) }
 await p.selectOption('select[data-act="addW"]','sgoal'); await p.waitForTimeout(200);
 const ws=await p.evaluate(()=>window.__arsh.L().widgets.filter(w=>TYPES[w.type].pro).map(w=>({id:w.id,type:w.type,source:w.source,topN:w.topN})));
 ok(ws.length===3&&new Set(ws.map(w=>w.id)).size===3,'3 independent Pro elements with own IDs');
 const lbId=ws[0].id, likesId=ws[1].id, sgId=ws[2].id;
 // props panel for lb
 await p.click(`#stage .wd[data-id="${lbId}"]`,{position:{x:20,y:20}}); await p.waitForTimeout(200);
 const props=await p.evaluate(()=>document.getElementById('props').innerText);
 ok(props.includes('مصدر القائمة')&&props.includes('ألوان المراكز')&&props.includes('شفافية خلفية الصفوف'),'lb settings: source, rank colors, row opacity');
 // events
 const sim=async k=>{ await p.click(`[data-sim="${k}"]`); await p.waitForTimeout(150) };
 await sim('biggift'); await sim('roses100'); await sim('like1000'); await sim('supporter'); await sim('supporter');
 await p.waitForTimeout(900);
 const rows=await p.evaluate(id=>[...document.querySelectorAll(`#stage .wd[data-id="${id}"] .lr`)].map(e=>({k:e.dataset.k,cls:e.className,v:e.querySelector('.lr-vl b').textContent})),lbId);
 const R=await p.evaluate(()=>Object.values(window.__arsh.R().D.gifts).sort((a,b)=>b.v-a.v).map(r=>({k:r.k,v:r.v})));
 const r1=rows.find(r=>/\br1\b/.test(r.cls));
 ok(rows.length===5,'top5 renders 5 slots');
 ok(r1&&r1.k===R[0].k&&r1.v===R[0].v.toLocaleString('en-US'),'first place = top gifter with exact value after count-up ('+(r1&&r1.v)+')');
 ok(await p.evaluate(id=>{const e=document.querySelector(`#stage .wd[data-id="${id}"] .lr.r1 .crw`); return e&&getComputedStyle(e).display!=='none'},lbId),'crown on first place');
 const lk=await p.evaluate(id=>[...document.querySelectorAll(`#stage .wd[data-id="${id}"] .lr:not(.emp)`)].length,likesId);
 const nLikers=await p.evaluate(()=>Object.keys(window.__arsh.R().D.likes).length);
 ok(lk===Math.min(5,nLikers),'likes list only shows likers ('+lk+')');
 // rank change
 const before=R[0].k; await sim('flipTop'); await p.waitForTimeout(250);
 const nt=await p.evaluate(id=>{const e=document.querySelector(`#stage .wd[data-id="${id}"] .lr.r1`); return {k:e.dataset.k,newtop:e.classList.contains('newtop')}},lbId);
 ok(nt.k!==before&&nt.newtop,'new first place gets crown/gold celebration');
 await p.waitForTimeout(800);
 // transparency
 const bg=await p.evaluate(id=>{const e=document.querySelector(`#stage .wd[data-id="${id}"]`); const c=getComputedStyle(e); return c.backgroundColor+'|'+c.backgroundImage+'|'+c.boxShadow},lbId);
 ok(bg==='rgba(0, 0, 0, 0)|none|none','outer box fully transparent');
 // goal: lion goal default
 const g0=await p.evaluate(id=>document.querySelector(`#stage .wd[data-id="${id}"] .sg-vl`).textContent,sgId);
 ok(/^1 \/ 1$/.test(g0.trim()),'lion goal counts the lion gift: '+g0);
 await p.evaluate(id=>{const w=window.__arsh.L().widgets.find(x=>x.id===id); w.target=5},sgId);
 await p.click(`#stage .wd[data-id="${sgId}"]`); await p.waitForTimeout(150);
 await p.fill('input[data-wf="target"]','5'); await p.dispatchEvent('input[data-wf="target"]','change'); await p.waitForTimeout(200);
 await p.click('[data-sg-zero]'); await p.waitForTimeout(200);
 const g1=await p.evaluate(id=>document.querySelector(`#stage .wd[data-id="${id}"] .sg-vl`).textContent,sgId);
 ok(g1.trim()==='0 / 5','start-from-now resets to 0/5: '+g1);
 await sim('goalDone'); await p.waitForTimeout(250);
 const done=await p.evaluate(id=>{const e=document.querySelector(`#stage .wd[data-id="${id}"]`); return {d:e.classList.contains('done'),c:e.classList.contains('celeb')}},sgId);
 ok(done.d&&done.c,'goal complete → done + celebration');
 // OBS link with only=lb
 await p.click('.nav [data-go="obs"]'); await p.waitForTimeout(200);
 const href=await p.evaluate(()=>document.querySelector('a[href*="#/overlay"]').href);
 const o=await ctx.newPage(); o.on('pageerror',e=>errs.push('ov '+e.message)); await o.setViewportSize({width:540,height:960});
 await o.goto(href+'&only='+lbId); await o.waitForTimeout(800);
 const ov=await o.evaluate(()=>({n:document.querySelectorAll('.wd').length,rows:document.querySelectorAll('.wd .lr').length,bg:getComputedStyle(document.body).backgroundColor}));
 ok(ov.n===1&&ov.rows===5,'OBS independent link shows only this list');
 ok(ov.bg==='rgba(0, 0, 0, 0)','OBS page background transparent');
 await p.evaluate(()=>window.__arsh.SIM.biggift()); await o.waitForTimeout(900);
 const ovTop=await o.evaluate(()=>document.querySelector('.lr.r1 .lr-vl b').textContent), stTop=await p.evaluate(()=>{const a=Object.values(window.__arsh.R().D.gifts).sort((x,y)=>y.v-x.v); return a[0].v.toLocaleString('en-US')});
 ok(ovTop===stTop,'OBS updates live ('+ovTop+')');
 await o.goto(href+'&only='+lbId+'&lp=1'); await o.reload(); await o.waitForTimeout(500);
 ok(await o.evaluate(()=>document.querySelector('.wd').classList.contains('lb-lite')),'low performance mode via &lp=1');
 await o.close();
 // library
 await p.click('.nav [data-go="library"]'); await p.click('[data-libtab="pro"]'); await p.waitForTimeout(500);
 ok(await p.evaluate(()=>document.querySelectorAll('#lib .libc').length===LB_DESIGNS.length&&LB_DESIGNS.length===184),'library: 184 designs (100 + 84 bars)');
 ok(await p.evaluate(()=>document.querySelectorAll('[data-lbcat]').length)===13,'library: 12 categories + all');
 ok(await p.evaluate(()=>document.querySelectorAll('#lib .libc .lr').length)>=30,'library previews are live renders');
 await p.fill('input[data-act="lbq"]','galaxy'); await p.waitForTimeout(100);
 ok(await p.evaluate(()=>[...document.querySelectorAll('#lib .libc')].filter(c=>c.style.display!=='none').length===LB_DESIGNS.filter(d=>/galaxy/i.test(d.name+d.desc)).length&&LB_DESIGNS.filter(d=>/galaxy/i.test(d.name+d.desc)).length<5),'search filters');
 await p.fill('input[data-act="lbq"]',''); await p.evaluate(()=>{document.querySelector('input[data-act="lbq"]').dispatchEvent(new Event('input',{bubbles:true}))});
 await p.click('[data-lbfav="royalCrown"]'); await p.waitForTimeout(100);
 ok(await p.evaluate(()=>window.__arsh.S.settings.lbFav.includes('royalCrown')),'favorite saved');
 await p.click('[data-lbfavonly]'); await p.waitForTimeout(300);
 ok(await p.evaluate(()=>document.querySelectorAll('#lib .libc').length)===1,'favorites filter');
 await p.click('#lib .libc[data-pick="royalCrown"] .meta'); await p.waitForTimeout(200);
 ok(await p.evaluate(id=>window.__arsh.L().widgets.find(w=>w.id===id).design,lbId)==='royalCrown','one-click apply to target list only');
 ok(await p.evaluate(id=>window.__arsh.L().widgets.find(w=>w.id===id).design,likesId)==='roseAura','other list keeps its design');
 await p.click('[data-lbfavonly]'); await p.waitForTimeout(200);
 const cats=await p.evaluate(()=>[...document.querySelectorAll('[data-lbcat] .tag')].map(t=>t.textContent));
 ok(cats.length===12&&cats.slice(0,7).join()==='15/15,10/10,15/15,15/15,15/15,15/15,15/15','original 7 categories intact + 5 new: '+cats.join(' '));
 await p.click('[data-lbcat="mini"]'); await p.waitForTimeout(300);
 ok(await p.evaluate(()=>document.querySelectorAll('#lib .libc').length)===15,'category filter shows 15 mini designs');
 await p.screenshot({path:'shots/lb-library.png'});
 // test data not in stats? events in demo are sims; persistence
 await p.reload(); await p.waitForTimeout(400);
 ok(await p.evaluate(id=>!!window.__arsh.L().widgets.find(w=>w.id===id&&w.design==='royalCrown'),lbId),'persists after reload');
 ok(errs.length===0,'no page errors '+errs.join(' | '));
 await b.close();
})();
