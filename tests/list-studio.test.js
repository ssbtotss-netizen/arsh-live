// «استوديو القائمة»: السيناريو الإلزامي — إنشاء قائمة من قسمها، صور التصاميم، معاينة كبيرة، أفضل 5 ← 3، حفظ، نسخ الرابط،
// فتح الرابط كمصدر بث (صفحة منفصلة)، ثم تغيير التصميم والألوان والمراكز والرابط مفتوح ← يتحدث لحظياً بدون رابط جديد. ثم الهدايا/الترتيب/الدعم.
const {chromium}=require('/opt/npm-tools/node_modules/playwright'); const path=require('path');
let pass=0,fail=0; const ok=(c,m)=>{ c?pass++:(fail++,console.log('FAIL',m)) };
const rows=(pg,sel)=>pg.evaluate(s=>{ const e=document.querySelector(s); if(!e) return -1; const r=e.querySelector('.rows'); if(r) return [...r.children].filter(x=>x.offsetParent!==null&&!x.classList.contains('ghost')).length; return e.querySelectorAll('.lbr,.lba-tok,[data-k="row"]').length },sel);
(async()=>{ const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'}); const ctx=await b.newContext({viewport:{width:1500,height:1000}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('dialog',d=>d.accept());
 await p.addInitScript(()=>{ window.__copied=[]; navigator.clipboard&&(navigator.clipboard.writeText=t=>{ window.__copied.push(t); return Promise.resolve() }) });
 await p.goto('file://'+path.resolve(__dirname,'../demo/index.html')); await p.evaluate(()=>localStorage.clear()); await p.reload();
 // 1-3: القسم ← + قائمة التكبيس ← صور التصاميم
 await p.click('.nav [data-go="likes"]'); await p.waitForTimeout(300); const before=await p.evaluate(()=>L().widgets.length);
 await p.click('[data-lsadd="likes"]'); await p.waitForTimeout(1500);
 const W=await p.evaluate(()=>S.lsOpen); ok(W&&await p.evaluate(()=>L().widgets.length)===before+1,'list created inside the likes section (no studio)');
 ok(await p.evaluate(()=>S.page)==="likes",'stayed in likes section');
 const g=await p.evaluate(()=>({n:document.querySelectorAll('.ls-d').length, ds:designsOf(lsW(S.lsOpen)).length, pv:document.querySelectorAll('.ls-d .ls-pv .wd').length, names:[...document.querySelectorAll('.ls-d .ls-dn')].every(e=>e.textContent.trim().length>1)}));
 ok(g.n===g.ds&&g.n>1,'gallery shows every compatible design ('+g.n+')'); ok(g.pv===g.n,'each card renders the real design (live thumbnail)'); ok(g.names,'name under each image');
 ok(await p.evaluate(()=>!!document.querySelector('.ls-d.on .ls-on')),'current design marked');
 // 4-5: اختيار تصميم من الصور ← معاينة كبيرة ← استخدام
 const target=await p.evaluate(()=>[...document.querySelectorAll('.ls-d:not(.on)')][2].dataset.lsd);
 await p.click(`.ls-d[data-lsd="${target}"]`); await p.waitForTimeout(800);
 ok(await p.evaluate(()=>!!document.querySelector('[data-lsbig] .wd')),'large animated preview opens');
 await p.click('[data-lsuse]'); await p.waitForTimeout(700); ok(await p.evaluate(()=>lsW(S.lsOpen).design)===target,'design applied from preview ('+target+')');
 // 6-8: أفضل 5 ← أفضل 3
 await p.click('[data-lstop="5"]'); await p.waitForTimeout(700); ok(await rows(p,'[data-lslive] .wd')===5,'top 5 → 5 rows in live preview');
 await p.click('[data-lstop="3"]'); await p.waitForTimeout(700); ok(await rows(p,'[data-lslive] .wd')===3,'top 3 → 3 rows in live preview');
 // 9-10: حفظ + نسخ الرابط
 await p.click('[data-lssecn="link"] [data-lssave]'); await p.waitForTimeout(300);
 await p.click(`[data-lssecn="link"] [data-lscopy="${W}"]`); await p.waitForTimeout(300);
 const url=await p.evaluate(()=>window.__copied.slice(-1)[0]||document.querySelector('[data-lsurl]').value);
 ok(/#\/overlay\?/.test(url)&&url.includes('only='+W),'copied link targets this list only');
 // 11-12: فتح الرابط كمصدر بث
 const o=await ctx.newPage(); o.on('pageerror',e=>errs.push('ov '+e.message)); await o.goto(url); await o.waitForTimeout(1500);
 const ov=await o.evaluate(W=>({n:document.querySelectorAll('.wd').length, mine:!!document.querySelector('.wd.t-likes'), bg:getComputedStyle(document.body).backgroundColor, html:getComputedStyle(document.documentElement).backgroundColor, dash:!!document.querySelector('.nav')}),W);
 ok(ov.mine&&ov.n===1,'link shows the list alone'); ok(!ov.dash,'no dashboard in the link'); ok(/rgba\(0, 0, 0, 0\)|transparent/.test(ov.bg)&&/rgba\(0, 0, 0, 0\)|transparent/.test(ov.html),'transparent background ('+ov.bg+')');
 for(const k of ['supporter','supporter','supporter','supporter','supporter']) await p.evaluate(()=>{ for(let i=0;i<6;i++) window.__arsh.SIM.supporter&&window.__arsh.SIM.supporter() });
 await p.evaluate(()=>{ for(let i=0;i<6;i++) sim({type:"like",user:simUser(true),count:50+i}) }); await o.waitForTimeout(900);
 ok(await rows(o,'.wd.t-likes')===3,'overlay shows 3 rows of real likes');
 // 13-14: تغيير التصميم من نفس القسم ← يتحدث في الرابط المفتوح بدون رابط جديد
 const d2=await p.evaluate(()=>[...document.querySelectorAll('.ls-d:not(.on)')][0].dataset.lsd);
 await p.click(`.ls-d[data-lsd="${d2}"]`); await p.waitForTimeout(500); await p.click('[data-lsuse]'); await p.waitForTimeout(900);
 ok(await o.evaluate(d=>!!document.querySelector('.wd.ds-'+d),d2),'open link switched to new design live ('+d2+')');
 const url2=await p.evaluate(()=>document.querySelector('[data-lsurl]').value);
 ok(url2.split('only=')[1].split('&')[0]===W,'same list id in link after design change');
 // 15-16: الألوان وعدد المراكز والرابط مفتوح
 await p.evaluate(W=>{ const w=lsW(W); lsSet(w,"acc","#ff00aa"); },W); await o.waitForTimeout(700);
 ok(await o.evaluate(()=>{ const e=document.querySelector('.wd.t-likes'); return e&&(e.style.cssText.includes('ff00aa')||getComputedStyle(e).getPropertyValue('--acc').includes('ff00aa')||e.outerHTML.includes('ff00aa')) }),'color change reached the open link live');
 await p.click('[data-lstop="5"]'); await o.waitForTimeout(900); ok(await rows(o,'.wd.t-likes')===5,'top 3 → 5 reached the open link live (no reload)');
 // التحكم من البطاقة
 ok(await p.evaluate(W=>!!document.querySelector(`[data-lscard="${W}"] .ls-copy`)&&!!document.querySelector(`[data-lscard="${W}"] [data-lsthumb] .wd`),W),'card: design image + quick copy button');
 // 17: أقسام أخرى — الترتيب (Pro) والهدايا والدعم
 for(const [page,type,sel] of [["boards","lb",".wd.lbw"],["gifts","gifts",".wd.t-gifts"],["donations","donBoard",".wd.t-donBoard"]]){
  await p.click(`.nav [data-go="${page}"]`); await p.waitForTimeout(400); if(page==="donations"){ await p.click('[data-dontab="widgets"]').catch(()=>{}); await p.waitForTimeout(300) }
  await p.click(`[data-lsadd="${type}"]`); await p.waitForTimeout(1500);
  const id=await p.evaluate(()=>S.lsOpen), w=await p.evaluate(()=>{ const w=lsW(S.lsOpen); return {type:w.type,n:designsOf(w).length,shown:document.querySelectorAll('.ls-d').length} });
  ok(w.type===type&&(w.n<=1||w.shown>0),page+': list created with its own designs ('+w.shown+'/'+w.n+')');
  const u=await p.evaluate(()=>document.querySelector('[data-lsurl]').value); const o2=await ctx.newPage(); await o2.goto(u); await o2.waitForTimeout(1200);
  ok(await o2.evaluate(s=>!!document.querySelector(s)&&document.querySelectorAll('.wd').length===1,sel),page+': link shows that list alone');
  if(w.shown>1){ const dn=await p.evaluate(()=>[...document.querySelectorAll('.ls-d:not(.on)')][0].dataset.lsd); await p.click(`.ls-d[data-lsd="${dn}"]`); await p.waitForTimeout(500); await p.click('[data-lsuse]'); await p.waitForTimeout(900);
   ok(await o2.evaluate(([s,d])=>{ const e=document.querySelector(s); return !!e&&(e.className.includes(d)||e.outerHTML.includes(d)) },[sel,dn]),page+': design change reached open link live');
   ok(await p.evaluate(id=>document.querySelector('[data-lsurl]').value.includes('only='+id),id),page+': link unchanged') }
  await o2.close() }
 // إعادة الإصدار عند الطلب فقط
 const old=await p.evaluate(()=>S.lsOpen); await p.click('[data-lsreissue]'); await p.waitForTimeout(500); const nw=await p.evaluate(()=>S.lsOpen); ok(nw&&nw!==old&&await p.evaluate(o=>!lsW(o),old),'reissue creates a new link id only on explicit request');
 // الحذف
 await p.click(`[data-lsdel="${nw}"]`); await p.waitForTimeout(400); ok(await p.evaluate(n=>!lsW(n),nw),'delete removes the list');
 ok(errs.length===0,'no page errors '+errs.slice(0,3).join('|')); console.log(`list-studio: ${pass} passed, ${fail} failed`); await b.close(); process.exit(fail?1:0) })();
