// واجهة «قراءة الشات باسم القناة» في مركز ربط البثوث (خادم مُحاكى): ربط، حالات حقيقية، فصل، اسم غير صالح
const { chromium } = require('/opt/npm-tools/node_modules/playwright');
(async()=>{
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const p=await (await b.newContext({viewport:{width:1440,height:1000}})).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.addInitScript(()=>{ window.B6O6_CONFIG={layouts:null,activeLayoutId:null,settings:{},profile:{name:"اختبار",plan:"pro"},providers:{},donCfg:{},bots:null,socials:null,wsUrl:"",room:"r1",key:"k",persist:async()=>({ok:true}),api:async()=>({}),overlayURL:()=>"#"} });
 const st={pub:{twitch:null,youtube:{channel:"@قناة_مغلقة",status:"offline",lastError:"القناة غير مباشرة الآن — سيبدأ الشات تلقائياً عند بدء البث"},kick:{channel:"badname",status:"error",lastError:"قناة Kick غير موجودة — تأكد من الاسم"}},posts:[],dels:[]};
 const conn=p=>({configured:false,status:"disconnected"});
 await p.route('**/api/**',async route=>{ const r=route.request(), u=new URL(r.url()), m=r.method();
  if(u.pathname==='/api/connections'&&m==='GET') return route.fulfill({json:{connections:{tiktok:conn(),youtube:conn(),kick:conn(),twitch:conn()},pub:st.pub}});
  if(u.pathname==='/api/connections/public'&&m==='POST'){ const bd=JSON.parse(r.postData()); st.posts.push(bd); if(bd.channel==='bad name!') return route.fulfill({status:400,json:{ok:false,error:'bad_channel',message:'اسم القناة أو الرابط غير صالح'}});
   st.pub[bd.platform]={channel:bd.channel.replace(/^.*twitch\.tv\//,'').toLowerCase(),status:'connecting',lastError:null}; setTimeout(()=>{ st.pub[bd.platform].status='connected'; st.pub[bd.platform].lastEventAt=new Date().toISOString() },1200); return route.fulfill({json:{ok:true,channel:'ninja'}}) }
  if(u.pathname==='/api/connections/public'&&m==='DELETE'){ const pl=u.searchParams.get('platform'); st.dels.push(pl); st.pub[pl]=null; return route.fulfill({json:{ok:true}}) }
  return route.fulfill({json:{}}) });
 await p.goto('file:///home/claude/najd/demo/index.html'); await p.waitForTimeout(400);
 await p.evaluate(()=>{ S.page="connections"; renderPage(true) }); await p.waitForTimeout(800);
 ok(await p.$('[data-pub="twitch"]')&&await p.$('[data-pub="youtube"]')&&await p.$('[data-pub="kick"]')&&!(await p.$('[data-pub="tiktok"]')),'قسم قراءة الشات لكل من Twitch وYouTube وKick (وليس TikTok)');
 ok((await p.textContent('[data-pubst="twitch"]')).includes('غير مربوط'),'Twitch: «غير مربوط» قبل الربط — لا حالة وهمية');
 ok((await p.textContent('[data-pubst="youtube"]')).includes('غير مباشرة')&&/سيبدأ الشات تلقائياً/.test(await p.textContent('[data-pub="youtube"]')),'YouTube: حالة «القناة غير مباشرة الآن» بصدق');
 ok((await p.textContent('[data-pubst="kick"]')).includes('خطأ')&&/غير موجودة/.test(await p.textContent('[data-pub="kick"]')),'Kick: الخطأ الحقيقي ظاهر');
 ok(/المتابعات والاشتراكات وإرسال الردود تحتاج/.test(await p.textContent('[data-pub="twitch"]')),'يوضح أن القراءة ليست ربطاً كاملاً');
 await p.fill('[data-pubin="twitch"]','bad name!'); await p.click('[data-pubgo="twitch"]'); await p.waitForTimeout(400);
 ok(await p.$('[data-pubin="twitch"]')&&!(await p.$eval('[data-pubgo="twitch"]',b=>b.disabled)),'اسم غير صالح: رسالة خطأ ويبقى الإدخال');
 await p.fill('[data-pubin="twitch"]','https://www.twitch.tv/Ninja'); await p.click('[data-pubgo="twitch"]'); await p.waitForTimeout(2200);
 ok(st.posts.some(x=>x.platform==='twitch'&&x.channel==='https://www.twitch.tv/Ninja'),'الربط يرسل اسم القناة للخادم');
 let tx=await p.textContent('[data-pubst="twitch"]'); if(!/يستقبل/.test(tx)){ await p.waitForTimeout(8500); tx=await p.textContent('[data-pubst="twitch"]') }
 ok(/يستقبل الشات/.test(tx),'الحالة تتحدث تلقائياً من «جاري الاتصال» إلى «يستقبل الشات» بعد الاتصال الفعلي: '+tx);
 ok(/ninja/.test(await p.textContent('[data-pub="twitch"]'))&&/آخر رسالة/.test(await p.textContent('[data-pub="twitch"]')),'اسم القناة ووقت آخر رسالة');
 await p.click('[data-pubdel="twitch"]'); await p.waitForTimeout(700);
 ok(st.dels.includes('twitch')&&(await p.textContent('[data-pubst="twitch"]')).includes('غير مربوط'),'فصل الشات');
 await p.setViewportSize({width:390,height:844}); await p.waitForTimeout(300);
 const fits=await p.evaluate(()=>[...document.querySelectorAll('[data-pub]')].every(e=>e.getBoundingClientRect().right<=window.innerWidth+1));
 ok(fits,'على الجوال: البطاقات داخل عرض الشاشة');
 ok(!errs.length,'no page errors '+errs.join(' | ')); await b.close();
})();
