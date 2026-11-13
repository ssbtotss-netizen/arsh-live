// واجهة مستويات الدونيشن: «+ إضافة مستوى جديد» (250$)، العملة، اللون، الصوت، الحذف، «أضف المستويات الناقصة»، التمرير، الحفظ، تجربة المبالغ
const { chromium } = require('/opt/npm-tools/node_modules/playwright');
(async()=>{
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const p=await (await b.newContext({viewport:{width:1440,height:1000}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 const U='file:///home/claude/najd/demo/index.html';
 await p.goto(U); await p.evaluate(()=>localStorage.clear()); await p.goto(U);
 // مستخدم قديم بأربعة مستويات (يجب أن تبقى كما هي)
 await p.click('.nav [data-go="alerts"]'); await p.waitForTimeout(300);
 await p.evaluate(()=>{ const L=mlLib(); L.don.levels=[{id:"simple",label:"بسيط",min:1,max:5,clips:[{id:"c1",alertId:"tpl:duck_classic",enabled:true}]},{id:"medium",label:"متوسط",min:5,max:20,clips:[]},{id:"strong",label:"قوي",min:20,max:50,clips:[]},{id:"legend",label:"أسطوري",min:50,max:0,clips:[{id:"c4",alertId:"tpl:duck_classic",enabled:true}]}]; mlSave(false) });
 await p.click('[data-mlsec="don"]'); await p.waitForTimeout(300);
 if(!await p.$('[data-ml="donnew"]')){ await p.click('[data-mlsec="don"]').catch(()=>{}); await p.waitForTimeout(200) }
 ok(await p.$('[data-ml="donnew"]')&&/إضافة مستوى جديد/.test(await p.textContent('[data-ml="donnew"]')),'زر «+ إضافة مستوى جديد» ظاهر');
 ok(await p.$('.ml-scroll'),'قائمة المستويات قابلة للتمرير');
 await p.click('[data-ml="donfill"]'); await p.waitForTimeout(250);
 const lv=await p.evaluate(()=>S.bots.alerts.lib.don.levels.map(l=>l.id+":"+l.min));
 ok(lv.slice(0,4).join()==="simple:1,medium:5,strong:20,legend:50"&&lv.length===9,'«أضف المستويات الناقصة» يضيف 10/100/200/500/1000 ويُبقي الأربعة القديمة: '+lv.join(' '));
 ok(await p.evaluate(()=>S.bots.alerts.lib.don.levels[0].clips[0].alertId==="tpl:duck_classic"),'مقاطع المستخدم القديمة سليمة');
 // ترتيب العرض حسب المبلغ
 const order=await p.$$eval('.ml-dl,.ml-lv[data-lvid]',e=>e.map(x=>x.dataset.lvid).filter(Boolean));
 ok(order.indexOf("legend")<order.findIndex(x=>/^d100/.test(x)),'العرض مرتّب حسب المبلغ');
 // + إضافة 250$
 await p.click('[data-ml="donnew"]'); await p.waitForTimeout(200);
 await p.fill('#mln-amt','250'); await p.fill('#mln-name','دعم ربع ألف'); await p.click('#mln-ok'); await p.waitForTimeout(300);
 const nl=await p.evaluate(()=>S.bots.alerts.lib.don.levels.find(l=>l.min===250)); ok(nl&&nl.label==="دعم ربع ألف"&&nl.max===0,'أُضيف مستوى 250$ مخصص');
 await p.click('[data-ml="donnew"]'); await p.waitForTimeout(200); await p.fill('#mln-amt','250'); await p.click('#mln-ok'); await p.waitForTimeout(200);
 ok(await p.evaluate(()=>S.bots.alerts.lib.don.levels.filter(l=>l.min===250).length===1),'منع تكرار نفس المبلغ والعملة'); await p.click('.modal [data-close]').catch(()=>{});
 const k=nl.id;
 // مقطع + لون + صوت
 await p.evaluate(k=>{ const L=S.bots.alerts.lib.don.levels.find(l=>l.id===k); L.clips.push({id:"c250",alertId:"tpl:duck_classic",enabled:true,volume:.8,size:100,x:50,y:50,enter:"popIn",exit:"fadeOut"}); save(); renderPage(true) },k); await p.waitForTimeout(200);
 await p.$eval(`[data-lvid="${k}"] details.ml-adv`,e=>e.open=true).catch(()=>{});
 await p.check(`[data-mlf="usecolor"][data-k="${k}"]`); await p.waitForTimeout(200);
 await p.$eval(`[data-mlf="color"][data-k="${k}"]`,e=>{ e.value="#00ff88"; e.dispatchEvent(new Event("input",{bubbles:true})); e.dispatchEvent(new Event("change",{bubbles:true})) }); await p.waitForTimeout(150);
 const fxv=await p.$$eval(`[data-mlf="fx"][data-k="${k}"] option`,o=>o.map(x=>x.value).filter(Boolean)[0]); if(fxv) await p.selectOption(`[data-mlf="fx"][data-k="${k}"]`,fxv); await p.waitForTimeout(150);
 const L=await p.evaluate(k=>S.bots.alerts.lib.don.levels.find(l=>l.id===k),k); ok(L.color==="#00ff88"&&(!fxv||L.fx===fxv),'لون ومؤثر خاص بالمستوى: '+L.color+' '+L.fx);
 // تغيير عملة المستوى
 await p.selectOption(`[data-mlf="cur"][data-k="${k}"]`,'SAR').catch(()=>{}); await p.waitForTimeout(150);
 ok(await p.evaluate(k=>S.bots.alerts.lib.don.levels.find(l=>l.id===k).cur,k)==="SAR",'عملة خاصة للمستوى');
 await p.selectOption(`[data-mlf="cur"][data-k="${k}"]`,'USD').catch(()=>{}); await p.waitForTimeout(150);
 // تجربة 250
 await p.evaluate(()=>{ window.__got=[]; const v=alPv; const o=v.aboxPush.bind(v); v.aboxPush=items=>{ window.__got.push(...items.map(i=>i.sec+":"+i.level+":"+(i.test?"t":"r")+":"+(i.over&&i.over.cfg&&i.over.cfg.title.color||""))); return o(items) } });
 await p.click(`[data-ml="test"][data-k="${k}"]`); await p.waitForTimeout(400);
 const g=await p.evaluate(()=>window.__got); ok(g.length===1&&g[0]==="don:"+k+":t:#00ff88",'🧪 تجربة مستوى 250$ ← تنبيه واحد مُعلَّم تجربة: '+g.join());
 // الحذف
 await p.evaluate(()=>{ window.confirm=()=>true });
 const before=await p.evaluate(()=>S.bots.alerts.lib.don.levels.length); const dk=await p.evaluate(()=>S.bots.alerts.lib.don.levels.find(l=>l.min===500).id);
 await p.click(`[data-ml="lvdel"][data-k="${dk}"]`); await p.waitForTimeout(250);
 ok(await p.evaluate(()=>S.bots.alerts.lib.don.levels.length)===before-1,'حذف مستوى 500$');
 // الحفظ
 await p.goto(U); await p.waitForTimeout(400);
 const P=await p.evaluate(()=>S.bots.alerts.lib.don.levels.map(l=>l.min+(l.color?"c":"")).join());
 ok(/250c/.test(P)&&!/(^|,)500(,|$)/.test(P)&&/1000/.test(P),'التعديلات تبقى بعد إعادة التحميل: '+P);
 // صفحة الدونيشن: أزرار مبالغ التجربة
 await p.evaluate(()=>{ S.page="donalerts"; renderPage(true) }); await p.waitForTimeout(300);
 const am=await p.$$eval('[data-dntamt]',e=>e.map(x=>x.dataset.dntamt)); ok(['50','100','200','500','1000'].every(a=>am.includes(a)),'مبالغ التجربة تشمل 50/100/200/500/1000');
 ok(!errs.length,'no page errors '+errs.join(' | '));
 await p.screenshot({path:'/home/claude/najd/tests/shot-don-levels.png'}); await b.close();
})();
