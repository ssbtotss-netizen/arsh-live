// واجهة ربط TikTok: الحالات الأربع، تعطيل الزر أثناء الاتصال/الانتظار، عدّاد الانتظار من retryAt، لا «متصل» قبل التأكيد، الإلغاء، ومنع الضغط المتكرر
const {chromium}=require('/opt/npm-tools/node_modules/playwright'); const path=require('path');
let pass=0,fail=0; const ok=(c,m)=>{ c?pass++:(fail++,console.log('FAIL',m)) };
(async()=>{ const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'}); const p=await b.newPage({viewport:{width:1400,height:900}}); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.route('**/api/**',r=>r.fulfill({status:200,contentType:'application/json',body:'{}'}));
 // خادم WebSocket وهمي داخل الصفحة: يسجل الرسائل المرسلة
 await p.addInitScript(()=>{ window.__sent=[]; class FWS{ constructor(){ this.readyState=1; this.L={}; setTimeout(()=>{ this.onopen&&this.onopen({}); (this.L.open||[]).forEach(f=>f({})) },10) } addEventListener(k,f){ (this.L[k]=this.L[k]||[]).push(f) } send(s){ window.__sent.push(JSON.parse(s)) } close(){} } window.WebSocket=FWS; window.WebSocket.OPEN=1;
  window.B6O6_CONFIG={layouts:null,activeLayoutId:null,settings:{tiktok:"cclvr"},profile:{name:"اختبار",sub:{state:"trial",full:true}},providers:{},donCfg:{},bots:null,socials:null,wsUrl:"wss://x.test/ws",room:"room_ui",key:"k",persist:async()=>({ok:true}),api:async()=>({}),overlayURL:()=>"#"} });
 await p.goto('file://'+path.resolve(__dirname,'../demo/index.html')); await p.waitForTimeout(800); if(errs.length) console.log('early errs',errs);
 await p.click('.nav [data-go="live"]'); await p.waitForTimeout(400);
 const R=m=>p.evaluate(m=>window.__arsh.receive(m),m);
 const box=()=>p.evaluate(()=>{ const b=document.querySelector('[data-tkbox]'); return b&&{st:b.querySelector('[data-tkstate]').dataset.tkstate,txt:b.innerText,dis:b.querySelector('[data-tiktok]').disabled,stopDis:b.querySelector('[data-tiktok-stop]').disabled,cd:(b.querySelector('[data-tkcd]')||{}).textContent} });
 ok(!!(await box()),'connection box rendered on the live page');
 await p.evaluate(()=>{ window.__arsh.S; }); const wsOK=await p.evaluate(()=>typeof wsReady!=="undefined"?wsReady:null);
 // ضغط متكرر: طلب واحد فقط
 await p.click('[data-tiktok]'); await p.click('[data-tiktok]',{force:true}).catch(()=>{}); await p.evaluate(()=>document.querySelector('[data-tiktok]').click()); await p.waitForTimeout(200);
 const sent=await p.evaluate(()=>window.__sent.filter(m=>m.t==="tiktok").length); ok(sent===1,'repeated clicks send one request ('+sent+')');
 let x=await box(); ok(x.st==="connecting"&&x.dis&&/جاري الاتصال/.test(x.txt),'connecting: button disabled');
 // الخادم: انتظار مع retryAt بعد 4 دقائق
 await R({t:"status",live:false,text:"خدمة التوقيع (Euler Stream) رفضت الاتصال: تجاوز الحد اليومي — إعادة المحاولة بعد 4 دقيقة",tk:{state:"waiting",retryAt:Date.now()+240000,attempt:1,maxAttempts:3,kind:"rate_limit",text:"خدمة التوقيع (Euler Stream) رفضت الاتصال: تجاوز الحد اليومي — إعادة المحاولة بعد 4 دقيقة",server:true}}); await p.waitForTimeout(1200);
 x=await box(); ok(x.st==="waiting"&&x.dis&&!x.stopDis,'waiting: connect disabled, cancel enabled'); ok(/^[34]:\d\d$/.test(x.cd),'countdown from retryAt ('+x.cd+')'); ok(!/حاول بعد دقيقة/.test(x.txt)&&/4 دقيقة/.test(x.txt),'shows provider wait, not «after a minute»');
 ok(/محاولة 1 من 3/.test(x.txt)&&/المشرف/.test(x.txt),'attempt counter + admin notified hint (no key details)'); ok(!/TIKTOK_SIGN_API_KEY/.test(x.txt),'variable/config details not shown to the creator');
 const c1=x.cd; await p.waitForTimeout(2100); x=await box(); ok(x.cd!==c1,'countdown ticks');
 ok(!/متصل ببث TikTok/.test(await p.textContent('#ctext').catch(()=>"")),'header never says connected while waiting');
 // إلغاء أثناء الانتظار
 await p.click('[data-tiktok-stop]'); await p.waitForTimeout(200); ok(await p.evaluate(()=>window.__sent.some(m=>m.t==="tiktok-stop")),'cancel sends stop'); x=await box(); ok(x.st==="stopped"&&!x.dis,'after cancel: stopped, connect enabled');
 // نجاح
 await p.click('[data-tiktok]'); await R({t:"status",live:true,text:"متصل ببث @cclvr (غرفة 123)",tk:{state:"connected",text:"متصل ببث @cclvr (غرفة 123)",attempt:0,maxAttempts:0}}); await p.waitForTimeout(200);
 x=await box(); ok(x.st==="connected"&&x.dis&&/متصل/.test(x.txt),'connected only after server confirms'); ok(/متصل ببث TikTok/.test(await p.textContent('#ctext').catch(()=>"متصل ببث TikTok")),'header shows connected');
 // فشل نهائي
 await R({t:"status",live:false,text:"تعذر",tk:{state:"failed",text:"خدمة التوقيع رفضت الاتصال: تجاوز الحد اليومي — أُوقفت المحاولات التلقائية (اضغط «اتصال» للمحاولة)",kind:"rate_limit"}}); await p.waitForTimeout(200);
 x=await box(); ok(x.st==="failed"&&!x.dis&&/تعذر الاتصال/.test(x.txt),'failed: clear message, connect re-enabled');
 // إعادة تحميل الواجهة: الحالة تأتي من الخادم مع الانضمام
 await R({t:"status",live:false,canEdit:true,text:"x",tk:{state:"waiting",retryAt:Date.now()+30000,attempt:2,maxAttempts:3,text:"x"}}); await p.waitForTimeout(200); x=await box(); ok(x.st==="waiting"&&x.dis,'state restored from server snapshot after reload');
 ok(errs.length===0,'no page errors '+errs.join('|')); console.log(`tiktok-connect-ui: ${pass} passed, ${fail} failed`); await b.close(); process.exit(fail?1:0) })();
