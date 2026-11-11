const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const url='file:///home/claude/najd/demo/index.html';
const FAKE=`(()=>{ window.__spoken=[]; class U{constructor(t){this.text=t}} window.SpeechSynthesisUtterance=U;
 Object.defineProperty(window,'speechSynthesis',{value:{speak(u){ window.__spoken.push(u.text); setTimeout(()=>u.onend&&u.onend(),40) },cancel(){},pause(){},resume(){},getVoices(){return [{name:'Maged',lang:'ar-SA',localService:true},{name:'Samantha',lang:'en-US',localService:true}]}}})})()`;
(async()=>{
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:1440,height:1000}}); await ctx.addInitScript(FAKE);
 const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto(url); await p.evaluate(()=>localStorage.clear()); await p.goto(url); await p.waitForTimeout(1500);
 await p.click('.nav [data-go="bots"]'); await p.waitForTimeout(200);
 ok(await p.locator('[data-btab]').count()===9,'bot studio: 9 tabs');
 ok((await p.innerText('#pg')).includes('غير متاحة حالياً')&&(await p.innerText('#pg')).includes('تحتاج مزود'),'honest capability report');
 await p.click('[data-add="botbox"]'); await p.waitForTimeout(200);
 const bb=await p.evaluate(()=>window.__arsh.L().widgets.find(w=>w.type==='botbox').id); ok(!!bb,'bot replies element added');
 const feed=()=>p.evaluate(()=>window.__arsh.S.botFeed.map(x=>x.kind+':'+x.text));
 const spoken=pg=>pg.evaluate(()=>window.__spoken.slice());
 await p.click('[data-btab="test"]'); await p.click('[data-bsim="hi"]'); await p.waitForTimeout(400);
 ok((await feed()).some(x=>x.startsWith('reply:')&&x.includes('وعليكم السلام')),'auto reply generated');
 ok((await spoken(p)).some(x=>x.includes('وعليكم السلام')),'reply spoken by the voice player');
 await p.evaluate(()=>window.__arsh.clockOp("subathon","start")); await p.waitForTimeout(100);
 await p.click('[data-bsim="time"]'); await p.waitForTimeout(300);
 const tm=(await feed()).find(x=>x.startsWith('cmd:')); ok(tm&&/باقي على السبثون/.test(tm)&&/ساع/.test(tm),'!وقت reads the real subathon: '+tm);
 await p.click('[data-bsim="lion"]'); await p.waitForTimeout(300); ok((await feed())[0].startsWith('thanks:'),'gift thanks');
 await p.click('[data-bsim="spam"]'); await p.waitForTimeout(200);
 // القارئ
 await p.click('[data-btab="voice"]'); await p.check('[data-bp="status.reader"]'); await p.waitForTimeout(200);
 await p.click('[data-btab="test"]'); await p.click('[data-bsim="sub"]'); await p.waitForTimeout(500);
 ok((await spoken(p)).some(x=>x.includes('يقول: أنا مشترك')),'reader reads comment with the name');
 await p.click('[data-bsim="spam"]'); await p.waitForTimeout(400); const sp=await spoken(p); ok(!sp.some(x=>x.includes('spam')||x.includes('0551234567')),'links/phones never read');
 // الأمر المخصص
 await p.click('[data-btab="commands"]'); await p.click('[data-badd="commands"]'); await p.waitForTimeout(200);
 const n=await p.evaluate(()=>window.__arsh.S.bots.commands.length-1);
 await p.fill(`[data-bp="commands.${n}.name"]`,'!تجربة'); await p.dispatchEvent(`[data-bp="commands.${n}.name"]`,'change');
 await p.fill(`[data-bp="commands.${n}.text"]`,'أهلاً {username} ✨'); await p.dispatchEvent(`[data-bp="commands.${n}.text"]`,'change'); await p.waitForTimeout(150);
 await p.evaluate(()=>window.__arsh.send({t:'sim',ev:{id:'cx',type:'comment',user:{id:'z',name:'زياد'},text:'!تجربة',test:true}})); await p.waitForTimeout(250);
 ok((await feed())[0]==='cmd:أهلاً زياد ✨','custom command with {username}');
 // عنصر الردود في الاستوديو
 await p.click('.nav [data-go="studio"]'); await p.waitForTimeout(400);
 await p.evaluate(()=>window.__arsh.send({t:'sim',ev:{id:'cy',type:'follow',user:{id:'q',name:'أحمد'},test:true}})); await p.waitForTimeout(300);
 ok((await p.evaluate(id=>document.querySelector(`#stage .wd[data-id="${id}"]`).innerText,bb)).includes('أحمد'),'studio bot element shows follow message');
 // رابط OBS + مشغّل الصوت الوحيد
 await p.click('.nav [data-go="obs"]'); await p.waitForTimeout(200);
 const href=await p.evaluate(()=>document.querySelector('a[href*="#/overlay"]').href);
 const o=await ctx.newPage(); o.on('pageerror',e=>errs.push('ov '+e.message)); await o.goto(href+'&only='+bb+'&voice=1'); await o.reload(); await o.waitForTimeout(2500);
 const before=(await spoken(p)).length, obefore=(await spoken(o)).length;
 await p.evaluate(()=>window.__arsh.send({t:'sim',ev:{id:'cz',type:'comment',user:{id:'w',name:'وليد'},text:'السلام عليكم يا جماعة',test:true}})); await p.waitForTimeout(900);
 const ds=(await spoken(p)).slice(before), os=(await spoken(o)).slice(obefore);
 ok(os.some(x=>x.includes('وعليكم'))&&!ds.some(x=>x.includes('وعليكم')),'one voice source: voice link speaks, dashboard stays silent');
 const ov=await o.evaluate(()=>({n:document.querySelectorAll('.wd').length,bg:getComputedStyle(document.body).backgroundColor,txt:document.querySelector('.wd').innerText}));
 ok(ov.n===1&&ov.bg==='rgba(0, 0, 0, 0)'&&ov.txt.includes('وعليكم'),'OBS bot element: only it, transparent, live');
 await o.close(); await p.waitForTimeout(4500);
 const b2=(await spoken(p)).length; await p.evaluate(()=>window.__arsh.send({t:'sim',ev:{id:'c2',type:'comment',user:{id:'w2',name:'منى'},text:'السلام عليكم',test:true}})); await p.waitForTimeout(800);
 ok((await spoken(p)).slice(b2).some(x=>x.includes('وعليكم')),'when the voice link closes, the dashboard takes over');
 await p.reload(); await p.waitForTimeout(400);
 ok(await p.evaluate(()=>window.__arsh.S.bots.commands.some(c=>c.name==='!تجربة')),'bot settings persist');
 ok(errs.length===0,'no page errors '+errs.join(' | '));
 await b.close();
})();
