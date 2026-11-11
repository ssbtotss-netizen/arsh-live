const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const url='file:///home/claude/najd/demo/index.html';
(async()=>{
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:1440,height:1000}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto(url); await p.evaluate(()=>localStorage.clear()); await p.goto(url);
 await p.click('.nav [data-go="donations"]'); await p.waitForTimeout(200); await p.click('[data-dontab="widgets"]'); await p.waitForTimeout(200);
 const add=await p.$('[data-don-addw="donText"]'); ok(!!add,'«آخر دعم نصي» available next to donation widgets');
 await add.click(); await p.waitForTimeout(200);
 const id=await p.evaluate(()=>window.__arsh.L().widgets.find(w=>w.type==="donText").id);
 const send=ev=>p.evaluate(ev=>window.__arsh.send({t:"sim",ev}),ev);
 await p.click('.nav [data-go="studio"]'); await p.waitForTimeout(300);
 const T=()=>p.evaluate(id=>{const l=document.querySelector(`#stage .wd[data-id="${id}"] .dt-line`); return l?[...l.children].filter(c=>c.tagName==='SPAN').map(c=>c.textContent).join(" ").replace(/\u00a0/g," ").trim():null},id);
 ok((await T())===null,'nothing shown before any real donation');
 await send({id:"X1",type:"donation",provider:"test",test:true,name:"تجربة",amount:5,currency:"USD"}); await p.waitForTimeout(300);
 ok((await T())===null,'test donation NOT shown');
 await send({id:"D1",type:"donation",provider:"streamlabs",name:"gg4days",amount:30,currency:"USD"}); await p.waitForTimeout(300);
 const t1=await T(); ok(t1&&t1.includes('آخر دعم')&&t1.includes('gg4days')&&t1.includes(':')&&t1.includes('$30'),'shows «آخر دعم gg4days: $30» → '+t1);
 const parts=await p.evaluate(id=>{const q=s=>getComputedStyle(document.querySelector(`#stage .wd[data-id="${id}"] ${s}`)).color; return [q('.dt-title'),q('.dt-name'),q('.dt-sym'),q('.dt-amt')]},id);
 ok(parts[0]==='rgb(255, 255, 255)'&&parts[1]==='rgb(255, 59, 78)'&&parts[2]==='rgb(34, 197, 94)'&&parts[3]==='rgb(246, 201, 74)','independent default colors: title white, name red, $ green, amount gold');
 const bg=await p.evaluate(id=>{const e=document.querySelector(`#stage .wd[data-id="${id}"]`); const s=getComputedStyle(e), l=getComputedStyle(e.querySelector('.dt-line')); return [s.backgroundColor,s.backgroundImage,s.borderTopWidth,l.backgroundColor,e.querySelectorAll('img,svg').length].join('|')},id);
 ok(bg==='rgba(0, 0, 0, 0)|none|0px|rgba(0, 0, 0, 0)|0','100% transparent: no card, border, image or decoration');
 // toggles
 await p.click(`#stage .wd[data-id="${id}"]`); await p.waitForTimeout(250);
 await p.click(`[data-dttog="showSym"][data-wid="${id}"]`); await p.waitForTimeout(200);
 let t=await T(); ok(t&&!t.includes('$')&&t.includes('30'),'hide $ keeps the amount → '+t);
 await p.click(`[data-dttog="showTitle"][data-wid="${id}"]`); await p.waitForTimeout(200);
 await p.click(`[data-dttog="showSym"][data-wid="${id}"]`); await p.waitForTimeout(200);
 t=await T(); ok(t==='gg4days: $30','title hidden → «gg4days: $30» (got '+t+')');
 ok(await p.evaluate(id=>document.querySelector(`#stage .wd[data-id="${id}"] .dt-line`).getAttribute('dir'),id)==='ltr','English line auto LTR when title hidden');
 // color independence
 await p.evaluate(id=>{const i=document.querySelector(`input[data-wf="cName"][data-wid="${id}"]`); i.value="#00ff00"; i.dispatchEvent(new Event('input',{bubbles:true}))},id); await p.waitForTimeout(200);
 const c2=await p.evaluate(id=>[getComputedStyle(document.querySelector(`#stage .wd[data-id="${id}"] .dt-name`)).color,getComputedStyle(document.querySelector(`#stage .wd[data-id="${id}"] .dt-amt`)).color],id);
 ok(c2[0]==='rgb(0, 255, 0)'&&c2[1]==='rgb(246, 201, 74)','changing name color does not change amount color');
 // SAR currency, code mode
 await send({id:"D2",type:"donation",provider:"streamlabs",name:"أحمد",amount:50,currency:"SAR"}); await p.waitForTimeout(300);
 t=await T(); ok(t&&t.includes('أحمد')&&t.includes('50')&&t.includes('ر.س')&&!t.includes('$'),'new donation replaces old with its real currency (SAR, no conversion) → '+t);
 await p.evaluate(id=>{const s=document.querySelector(`select[data-wf="symMode"][data-wid="${id}"]`); s.value="code"; s.dispatchEvent(new Event('change',{bubbles:true}))},id); await p.waitForTimeout(200);
 t=await T(); ok(t&&t.includes('SAR'),'currency code mode → '+t);
 await send({id:"D2",type:"donation",provider:"streamlabs",name:"مكرر",amount:999,currency:"SAR"}); await p.waitForTimeout(300);
 ok(!(await T()).includes('مكرر'),'duplicate donation id ignored');
 // preview + sim
 const pv0=await p.evaluate(()=>document.querySelector('[data-dtpv] .dt-line')?.innerText||"");
 ok(pv0.includes('gg4days'),'live preview inside settings');
 await p.fill('[data-dtpvf="name"]','Nora'); await p.waitForTimeout(150);
 ok((await p.evaluate(()=>document.querySelector('[data-dtpv] .dt-line').innerText)).includes('Nora'),'preview updates instantly from test name field');
 await p.evaluate(id=>{const s=document.querySelector(`select[data-wf="dtAnim"][data-wid="${id}"]`); s.value="slideUp"; s.dispatchEvent(new Event('change',{bubbles:true}))},id); await p.waitForTimeout(250);
 await p.click(`[data-dtsim="${id}"]`); await p.waitForTimeout(80);
 ok(await p.evaluate(()=>!!document.querySelector('[data-dtpv] .dt-line.dt-a-slideUp')),'test arrival animates preview (Slide Up)');
 ok((await T())&&!(await T()).includes('Nora'),'preview test does not affect the real widget');
 // OBS
 await p.click('.nav [data-go="obs"]'); await p.waitForTimeout(200);
 const href=await p.evaluate(()=>document.querySelector('a[href*="#/overlay"]').href);
 const o=await ctx.newPage(); o.on('pageerror',e=>errs.push('ov '+e.message)); await o.goto(href+'&only='+id); await o.reload(); await o.waitForTimeout(700);
 const ot=await o.evaluate(()=>document.querySelector('.dt-line')?.innerText.replace(/\s+/g," ").trim()); ok(ot&&ot.includes('أحمد')&&ot.includes('SAR')&&(await o.evaluate(()=>document.querySelectorAll('.wd').length))===1,'OBS link shows only the text line with saved settings → '+ot);
 ok(await o.evaluate(()=>!document.querySelector('button,input,.rh')),'no dashboard controls in OBS');
 await p.evaluate(()=>window.__arsh.send({t:"sim",ev:{id:"D3",type:"donation",provider:"streamlabs",name:"Ahmed",amount:50,currency:"USD"}})); await o.waitForTimeout(1200);
 ok((await o.evaluate(()=>document.querySelector('.dt-line').innerText)).includes('Ahmed'),'OBS updates live on new donation');
 await p.evaluate(()=>window.__arsh.send({t:"sim",ev:{id:"D3r",type:"donation_refund",ref:"D3"}})); await p.waitForTimeout(100);
 await p.evaluate(()=>window.__arsh.send({t:"sim",ev:{id:"D3",type:"donation_refund"}})); await o.waitForTimeout(1200);
 ok(!(await o.evaluate(()=>document.querySelector('.dt-line')?.innerText||"")).includes('Ahmed'),'fully refunded donation removed, previous one shown');
 ok(errs.length===0,'no page errors '+errs.join(' | '));
 await b.close();
})();
