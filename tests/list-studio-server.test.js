// وضع المنصة: رابط القائمة = /overlay/<token>?layout=<id>&only=<listId> — ثابت مهما تغيّر التصميم/المراكز/الألوان، وكل تعديل يُرسل فوراً عبر WebSocket ويُحفظ
const {chromium}=require('/opt/npm-tools/node_modules/playwright'); const path=require('path');
let pass=0,fail=0; const ok=(c,m)=>{ c?pass++:(fail++,console.log('FAIL',m)) };
(async()=>{ const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'}); const p=await (await b.newContext({viewport:{width:1500,height:1000}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept());
 await p.route('**/api/**',r=>r.fulfill({status:200,contentType:'application/json',body:'{}'}));
 await p.addInitScript(()=>{ window.__saved=[]; window.__copied=[]; navigator.clipboard&&(navigator.clipboard.writeText=t=>{ window.__copied.push(t); return Promise.resolve() });
  window.B6O6_CONFIG={layouts:null,activeLayoutId:null,settings:{},profile:{name:"اختبار",sub:{state:"trial",full:true,daysLeft:20}},providers:{},donCfg:{},bots:null,socials:null,wsUrl:"",room:"r1",key:"EDIT_SECRET",persist:async b=>{ window.__saved.push(JSON.parse(JSON.stringify(b))); return {ok:true} },api:async()=>({}),overlayURL:(l,only)=>`https://b6o6.example/overlay/ov_PUBLIC?layout=${l}${only?"&only="+only:""}`} });
 await p.goto('file://'+path.resolve(__dirname,'../demo/index.html')); await p.waitForTimeout(500);
 await p.click('.nav [data-go="likes"]'); await p.waitForTimeout(300); await p.click('[data-lsadd="likes"]'); await p.waitForTimeout(1200);
 const id=await p.evaluate(()=>S.lsOpen), u1=await p.evaluate(()=>document.querySelector('[data-lsurl]').value);
 ok(/^https:\/\/b6o6\.example\/overlay\/ov_PUBLIC\?layout=[^&]+&only=/.test(u1)&&u1.endsWith('only='+id),'link = overlay token + layout + list id');
 ok(!u1.includes('EDIT_SECRET'),'link has no secret edit key');
 const d2=await p.evaluate(()=>[...document.querySelectorAll('.ls-d:not(.on)')][1].dataset.lsd); await p.click(`.ls-d[data-lsd="${d2}"]`); await p.waitForTimeout(400); await p.click('[data-lsuse]'); await p.waitForTimeout(400);
 await p.click('[data-lstop="3"]'); await p.waitForTimeout(400); await p.evaluate(()=>lsSet(lsW(S.lsOpen),"acc","#22e07a"));
 await p.click(`[data-lssecn="link"] [data-lscopy="${id}"]`); await p.waitForTimeout(800);
 const u2=await p.evaluate(()=>window.__copied.slice(-1)[0]); ok(u2===u1,'link identical after design + top N + color changes');
 const last=await p.evaluate(()=>window.__saved.slice(-1)[0]); const sw=last&&last.layouts.flatMap(l=>l.widgets).find(w=>w.id===id);
 ok(sw&&sw.design===d2&&sw.topN===3&&sw.acc==="#22e07a",'latest settings saved to the account (database) under the same list id');
 ok(errs.length===0,'no errors '+errs.join('|')); console.log(`list-studio-server: ${pass} passed, ${fail} failed`); await b.close(); process.exit(fail?1:0) })();
