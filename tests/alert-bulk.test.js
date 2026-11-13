// رفع عدة مقاطع دفعة واحدة (خادم مُحاكى): 20 فيديو + صوت + أحجام مختلفة، رفع متوازٍ، انقطاع واستكمال تلقائي، إعادة محاولة الفاشل فقط، كشف المكرر، لا رسالة امتلاء
const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const url='file:///home/claude/najd/demo/index.html';
(async()=>{
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:1440,height:1000}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.addInitScript(()=>{ window.B6O6_CONFIG={layouts:null,activeLayoutId:null,settings:{},profile:{name:"اختبار",plan:"pro"},providers:{},donCfg:{},bots:null,socials:null,wsUrl:"",room:"r1",key:"k",persist:async()=>({ok:true}),api:async()=>({}),overlayURL:()=>"#"} });
 const S={uploads:0,byName:{},netFail:{},created:[],concurrent:0,maxConc:0,stored:new Map()};
 await p.route('**/api/**',async route=>{ const r=route.request(), u=new URL(r.url()), m=r.method();
  if(u.pathname==='/api/alerts/upload'&&m==='GET') return route.fulfill({json:{used:S.uploads*1024*1024,files:S.uploads,quota:null,platform:{pct:3.1,ok:true}}});
  if(u.pathname==='/api/alerts/upload'&&m==='POST'){ const name=decodeURIComponent(r.headers()['x-filename']||''); S.byName[name]=(S.byName[name]||0)+1;
   S.concurrent++; S.maxConc=Math.max(S.maxConc,S.concurrent); await new Promise(x=>setTimeout(x,150)); S.concurrent--;
   if(name.startsWith('net')&&S.byName[name]===1) return route.abort('connectionreset');
   if(name.startsWith('broken')) return route.fulfill({status:422,json:{error:'not_playable',message:'الفيديو بترميز لا يشغّله المتصفح/OBS ولم ينجح تحويله'}});
   const body=r.postDataBuffer()||Buffer.alloc(0); const key=body.slice(0,80).toString('hex')+body.length; let id=S.stored.get(key), dup=!!id; if(!id){ id='as_'+(S.stored.size+1); S.stored.set(key,id) } S.uploads++;
   const audio=/\.(mp3|wav|ogg)$/i.test(name);
   return route.fulfill({json:{ok:true,dup,kind:audio?'audio':'video',slot:audio?'audio':'media',id,mime:audio?'audio/mpeg':'video/webm',size:body.length,url:'/api/alerts/media/'+id,meta:{duration:4.2},coverId:null,previewId:null}}) }
  if(u.pathname==='/api/alerts'&&m==='POST'){ const bd=JSON.parse(r.postData()); const a={id:'al_'+(S.created.length+1),...bd,mine:true}; S.created.push(a); return route.fulfill({json:{ok:true,alert:a}}) }
  if(u.pathname==='/api/alerts'&&m==='GET') return route.fulfill({json:{items:S.created,total:S.created.length}});
  return route.fulfill({json:{}}) });
 await p.goto(url); await p.waitForTimeout(500);
 await p.evaluate(()=>{ S.page="alerts"; ALS().tab="create"; renderPage(true) }); await p.waitForTimeout(400);
 ok(await p.$('#al-bulk')&&await p.$('#al-bulk-file[multiple]'),'بطاقة «رفع عدة مقاطع» مع اختيار ملفات متعددة');
 await p.waitForTimeout(300); ok(/بدون حد ثابت للحساب/.test(await p.textContent('#al-bulk')),'عرض المساحة المستخدمة بشفافية بدون حد للحساب');
 const mp4=(n,sz)=>{ const b=Buffer.alloc(sz); b.write('\x00\x00\x00\x18ftypmp42',0,'binary'); b.writeUInt32BE(n,64); return b };
 const mp3=(n,sz)=>{ const b=Buffer.alloc(sz); b.write('ID3',0); b.writeUInt32BE(n,64); return b };
 const files=[]; for(let i=1;i<=20;i++) files.push({name:`clip${i}.mp4`,mimeType:'video/mp4',buffer:mp4(i,[20000,150000,600000,1200000][i%4])});
 files.push({name:'song1.mp3',mimeType:'audio/mpeg',buffer:mp3(1,90000)},{name:'song2.mp3',mimeType:'audio/mpeg',buffer:mp3(2,300000)},{name:'net-drop.mp4',mimeType:'video/mp4',buffer:mp4(99,50000)},{name:'broken.mp4',mimeType:'video/mp4',buffer:mp4(98,40000)},{name:'copy-of-clip1.mp4',mimeType:'video/mp4',buffer:mp4(1,[20000,150000,600000,1200000][1])});
 await p.setInputFiles('#al-bulk-file',files);
 const t0=Date.now(); for(;;){ const st=await p.evaluate(()=>ALS().bulk.items.map(x=>x.st)); if(!st.some(s=>['wait','upload','process','save','check','retry'].includes(s))||Date.now()-t0>60000) break; await p.waitForTimeout(300) }
 const items=await p.evaluate(()=>ALS().bulk.items.map(x=>({n:x.name,st:x.st,msg:x.msg||''})));
 const st=n=>(items.find(x=>x.n===n)||{}).st;
 ok(items.length===25,'25 ملفاً في القائمة (20 فيديو + صوتان + 3 حالات خاصة)');
 ok(Array.from({length:20},(_,i)=>st(`clip${i+1}.mp4`)).every(s=>s==='done'),'1+2. رفع 20 مقطع فيديو متتالية — كلها جاهزة');
 ok(st('song1.mp3')==='done'&&st('song2.mp3')==='done'&&S.created.filter(a=>a.kind==='audio').length===2,'3. رفع مقاطع صوتية (تُحفظ كصوت)');
 ok(new Set(files.map(f=>f.buffer.length)).size>=4,'4. ملفات بأحجام مختلفة (20KB → 1.2MB)');
 ok(S.maxConc===2,'5. رفع عدة ملفات في الوقت نفسه (ملفان بالتوازي) — '+S.maxConc);
 ok(st('net-drop.mp4')==='done'&&S.byName['net-drop.mp4']===2,'6. انقطاع الاتصال أثناء الرفع ← إعادة محاولة تلقائية واستكمال');
 ok(st('broken.mp4')==='error'&&items.filter(x=>x.st==='done').length===23,'فشل ملف واحد لا يوقف بقية الملفات: '+(items.find(x=>x.n==='broken.mp4')||{}).msg);
 ok(st('copy-of-clip1.mp4')==='dup'&&S.created.length===23,'كشف المكرر: نفس المحتوى باسم مختلف لا يُنشأ مرتين');
 ok(!items.some(x=>/امتلأت|مساحة ملفاتك/.test(x.msg)),'لا رسالة «امتلأت مساحة ملفاتك»');
 ok(S.created.every(a=>a.visibility==='private'&&a.event==='donation'&&a.mediaId!==undefined),'كل مقطع حُفظ خاصاً في قسم الدونيشن');
 ok(await p.$('[data-bki] video')&&await p.$('[data-bki] audio'),'معاينة الفيديو والصوت بعد الرفع');
 // إعادة المحاولة: الفاشل فقط
 const before={...S.byName};
 await p.click('[data-albkretry="all"]').catch(()=>{}); await p.waitForTimeout(1500);
 const again=Object.keys(S.byName).filter(n=>S.byName[n]!==before[n]);
 ok(again.length===1&&again[0]==='broken.mp4','إعادة محاولة الفاشل فقط بدون إعادة رفع الناجح ('+again.join(',')+')');
 // ملف أكبر من حد الملف الواحد يُرفض بوضوح (ليس امتلاء مساحة)
 require('fs').writeFileSync('/tmp/huge.mp4',Buffer.concat([mp4(500,1024),Buffer.alloc(51*1024*1024)])); await p.setInputFiles('#al-bulk-file','/tmp/huge.mp4'); await p.waitForTimeout(1200);
 const hg=await p.evaluate(()=>ALS().bulk.items.find(x=>x.name==='huge.mp4')); ok(hg&&hg.st==='error'&&/أكبر من الحد/.test(hg.msg)&&!/امتلأت/.test(hg.msg),'ملف أكبر من 50MB: رسالة واضحة بحد الملف الواحد');
 ok(!errs.length,'no page errors '+errs.join(' | ')); await p.screenshot({path:'/tmp/bulk.png',fullPage:false}); await b.close();
})();
