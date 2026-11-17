// 30 تصميماً حصرياً PRO لـ«آخر التفاعلات» + مستويات النشاط (لايكات/هدية/دونيشن) بتصميم لكل مستوى من البيانات الحقيقية
const {chromium}=require('/opt/npm-tools/node_modules/playwright'); const path=require('path');
let pass=0,fail=0; const ok=(c,m)=>{ c?pass++:(fail++,console.log('FAIL',m)) };
(async()=>{ const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'}); const p=await b.newPage({viewport:{width:1500,height:1000}}); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+path.resolve(__dirname,'../demo/index.html')); await p.evaluate(()=>localStorage.clear()); await p.reload();
 const r=await p.evaluate(()=>({n:LE_X_IDS.length, reg:LE_X_IDS.every(id=>{ const d=LE_DESIGNS.find(x=>x.id===id); return d&&d.cat==="excl"&&isProDesign(id)&&typeof d.back==="function" }), uniqN:new Set(LE_DESIGNS.map(d=>d.n)).size===LE_DESIGNS.length, uniqId:new Set(LE_DESIGNS.map(d=>d.id)).size===LE_DESIGNS.length, grp:LE_GROUPS.excl, plan:LE_PLAN.excl&&LE_PLAN.excl.length}));
 ok(r.n===30,'30 exclusive designs'); ok(r.reg,'registered, PRO, own artwork'); ok(r.uniqN&&r.uniqId,'unique ids/numbers'); ok(r.grp&&r.plan===30,'library group "excl" with plan 30');
 // كل تصميم يعمل مع كل نوع نشاط بدون أخطاء
 const all=await p.evaluate(()=>{ const kinds=["follow","gift","like","share","join","donation","subscribe","comment"]; let bad=[];
  for(const id of LE_X_IDS) for(const k of kinds){ const w=Object.assign(newWidget("levent"),{id:"t"+id+k,design:id,kind:k,x:0,y:0,w:1,h:1}); const v=new View(w,{w:300,h:300},{mute:true,data:()=>({D:emptyData(),H:[],C:newClockState(),DN:{list:[]}})}); document.body.appendChild(v.el); v.apply(w);
   try{ v.lePush({type:k,id:"e"+id+k,user:{id:"u",name:"نورة"},gift:"Rose",count:3,value:3,amount:20,currency:"USD",name:"نورة",text:"هلا"}); if(!v.el.querySelector('.le-card .le-back svg')&&!v.el.querySelector('.le-card')) bad.push(id+":"+k) }catch(e){ bad.push(id+":"+k+":"+e.message) } v.el.remove() }
  return bad });
 ok(all.length===0,'every design × every activity renders ('+all.slice(0,3).join(',')+')');
 // المستويات
 const L=await p.evaluate(async()=>{ const src={D:emptyData(),H:[],C:newClockState(),DN:{list:[]}}; const out={};
  const mk=(k,lv)=>{ const w=Object.assign(newWidget("levent"),{id:"lv"+k,design:"butterfly",kind:k,x:0,y:0,w:1,h:1,lvls:lv}); const v=new View(w,{w:300,h:300},{mute:true,data:()=>src}); document.body.appendChild(v.el); v.apply(w); return v };
  const cls=v=>[...v.el.classList].find(c=>c.startsWith("led-"));
  // لايكات: مجموع الشخص في البث من بيانات الغرفة الحقيقية
  const vl=mk("like",[{at:1000,design:"xHeartBurst"},{at:5000,design:"xNeonPulse"}]);
  applyEvent(src.D,src.H,{type:"like",id:"l1",user:{id:"a",name:"أ"},count:300,t:Date.now()}); vl.lePush({type:"like",id:"l1",user:{id:"a",name:"أ"},count:300}); out.l300=cls(vl);
  applyEvent(src.D,src.H,{type:"like",id:"l2",user:{id:"a",name:"أ"},count:900,t:Date.now()}); vl.lePush({type:"like",id:"l2",user:{id:"a",name:"أ"},count:900}); out.l1200=cls(vl);
  applyEvent(src.D,src.H,{type:"like",id:"l3",user:{id:"a",name:"أ"},count:4000,t:Date.now()}); await new Promise(r=>setTimeout(r,700)); vl.lePush({type:"like",id:"l3",user:{id:"a",name:"أ"},count:4000}); await new Promise(r=>setTimeout(r,700)); out.l5200=cls(vl);
  // هدايا: بالاسم (عربي/إنجليزي) أو بالقيمة
  const vg=mk("gift",[{gift:"Lion,أسد",design:"xGoldenLion"},{gift:"I Love You,أحبني",design:"xPinkButterfly"},{at:5000,design:"xGalaxyPortal"}]);
  vg.lePush({type:"gift",id:"g1",user:{id:"b",name:"ب"},gift:"Rose",value:1,count:1}); out.rose=cls(vg); await new Promise(r=>setTimeout(r,700));
  vg.lePush({type:"gift",id:"g2",user:{id:"c",name:"ج"},gift:"Lion",value:29999,count:1}); out.lion=cls(vg); await new Promise(r=>setTimeout(r,700));
  vg.lePush({type:"gift",id:"g3",user:{id:"d",name:"د"},gift:"أحبني",value:10,count:1}); out.love=cls(vg); await new Promise(r=>setTimeout(r,700));
  vg.lePush({type:"gift",id:"g4",user:{id:"e",name:"هـ"},gift:"Universe",value:44999,count:1}); out.big=cls(vg); await new Promise(r=>setTimeout(r,700));
  // دونيشن بالمبلغ + المستوى المعطّل لا يُطبق
  const vd=mk("donation",[{at:20,design:"xGoldRain"},{at:100,design:"xB6o6Legend",on:false}]);
  vd.lePush({type:"donation",id:"d1",name:"ن",amount:5,currency:"USD"}); out.d5=cls(vd); await new Promise(r=>setTimeout(r,700));
  vd.lePush({type:"donation",id:"d2",name:"س",amount:150,currency:"USD"}); out.d150=cls(vd);
  return out });
 ok(L.l300==="led-butterfly",'likes below 1k → base design'); ok(L.l1200==="led-xHeartBurst",'likes 1.2k (session total) → 1k level'); ok(L.l5200==="led-xNeonPulse",'likes 5.2k → 5k level');
 ok(L.rose==="led-butterfly",'unmatched gift → base'); ok(L.lion==="led-xGoldenLion",'Lion by name'); ok(L.love==="led-xPinkButterfly",'أحبني by Arabic name'); ok(L.big==="led-xGalaxyPortal",'Universe by value ≥ 5000');
 ok(L.d5==="led-butterfly",'donation 5 → base'); ok(L.d150==="led-xGoldRain",'donation 150 → 20 level (disabled 100 level ignored)');
 // واجهة المستويات في الاستوديو
 await p.click('.nav [data-go="studio"]'); await p.selectOption('select[data-act="addW"]','levent'); await p.waitForTimeout(400);
 await p.selectOption('select[data-wf="kind"]','like'); await p.waitForTimeout(400);
 await p.click('[data-leladd="1000"]'); await p.waitForTimeout(300); await p.click('[data-leladd="5000"]'); await p.waitForTimeout(300);
 await p.selectOption('select[data-lelv="1"][data-lelf="design"]','xNeonPulse'); await p.waitForTimeout(300);
 const lv=await p.evaluate(()=>{ const w=L().widgets.find(x=>x.type==="levent"&&x.kind==="like"); return w&&w.lvls });
 ok(lv&&lv.length===2&&lv[0].at===1000&&lv[1].design==="xNeonPulse",'levels editor saves (1k + 5k → Neon Pulse)');
 await p.click('[data-leldel="0"]'); await p.waitForTimeout(300); ok(await p.evaluate(()=>L().widgets.find(x=>x.type==="levent"&&x.kind==="like").lvls.length)===1,'delete level');
 // المكتبة: فئة الحصرية
 await p.click('.nav [data-go="library"]'); await p.click('[data-libtab="levent"]'); await p.waitForTimeout(500); await p.click('[data-legrp="excl"]'); await p.waitForTimeout(1200);
 ok(await p.$$eval('#lib .libc',e=>e.length)===30,'library shows 30 exclusive'); ok(await p.$$eval('#lib .libc .probadge',e=>e.length)===30,'all PRO badges');
 ok(errs.length===0,'no page errors '+errs.slice(0,3).join('|')); console.log(`le-excl: ${pass} passed, ${fail} failed`); await b.close(); process.exit(fail?1:0) })();
