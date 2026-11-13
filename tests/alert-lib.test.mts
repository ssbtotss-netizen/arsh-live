// مكتبة مقاطع الدعم: 4 أقسام مستقلة — أحبني / التكبيس / الدونيشن / الهدايا (عبر الغرفة الحقيقية نفسها المستخدمة في البث)
import { newRoom, roomEvent, roomClockOp } from "/home/claude/najd/arsh-live/src/engine/room.js";
import { alLib, alCfg, alLibFromRules, alLibAlertIds, alQueue, alQueuePush, alQueueNext, AL_TAP_LEVELS, alertsOnEvent, alNewState } from "/home/claude/najd/arsh-live/src/engine/alerts.js";
let f=0; const ok=(c:any,m:string)=>{ console.log((c?"PASS ":"FAIL ")+m); if(!c) f++ };
const clip=(id:string,x:any={})=>({alertId:id,...x});
const lib:any={
 love:{clips:[clip("A_love")]},
 taps:{levels:Object.fromEntries(AL_TAP_LEVELS.map(n=>[n,{clips:[clip("A_tap"+n)]}]))},
 don:{currency:"USD",levels:[{id:"simple",label:"بسيط",min:1,max:5,clips:[clip("A_d1")]},{id:"medium",label:"متوسط",min:5,max:20,clips:[clip("A_d2")]},{id:"strong",label:"قوي",min:20,max:50,clips:[clip("A_d3")]},{id:"legend",label:"أسطوري",min:50,max:0,clips:[clip("A_d4")]}]},
 gifts:{items:[{id:"rose",kind:"gift",name:"Rose",giftId:"5655",clips:[clip("A_rose")]},{id:"lion",kind:"gift",name:"Lion",clips:[clip("A_lion")]},{id:"big",kind:"value",label:"هدايا كبيرة",min:1000,max:0,clips:[clip("A_big")]}]}};
const mk=()=>{ const R:any=newRoom(); R.botCfg={alerts:{enabled:true,rules:[{id:"old",event:"follow",alertId:"A_follow"},{id:"oldc",event:"comment",alertId:"A_comment"}],lib}}; R.live=true; return R };
let R=mk(), n=0;
const fire=(ev:any)=>{ const r=roomEvent(R,{id:"e"+(++n),platform:"tiktok",user:{id:"u"+n,name:"مشاهد"+n},...ev},Date.now()); return r.out.filter((m:any)=>m.t==="alert").flatMap((m:any)=>m.items) };
const ids=(it:any[])=>it.map(x=>x.alertId).join(",");

// ❤️ أحبني
let it=fire({type:"gift",gift:"Heart Me",giftId:"7934",count:1,value:1,diamonds:1});
ok(ids(it)==="A_love"&&it[0].sec==="love","هدية Heart Me ← مقطع أحبني فقط");
it=fire({type:"gift",gift:"أحبني",count:3,value:3,diamonds:1}); ok(ids(it)==="A_love","الاسم العربي «أحبني» ← مقطع أحبني");
it=fire({type:"donation",provider:"test",test:true,amount:10,currency:"USD",name:"x"}); ok(!it.some(x=>x.sec==="love"),"دونيشن لا يشغّل مقطع أحبني");
it=fire({type:"gift",gift:"Rose",giftId:"5655",count:1,value:1}); ok(ids(it)==="A_rose","وردة ← مقطعها هي (ليست أحبني)");

// 🎁 الهدايا
it=fire({type:"gift",gift:"Lion",giftId:"6369",count:1,value:29999}); ok(ids(it)==="A_lion","هدية محددة بالاسم تتقدم على فئة القيمة");
it=fire({type:"gift",gift:"Universe",giftId:"7312",count:1,value:44999}); ok(ids(it)==="A_big","هدية غير مخصصة بقيمة ≥1000 ← فئة الهدايا الكبيرة");
it=fire({type:"gift",gift:"Donut",giftId:"5879",count:1,value:30}); ok(it.length===0,"هدية غير مخصصة وقيمتها أقل ← لا شيء");

// 💵 الدونيشن (مؤكد فقط، مستقل)
const don=(amount:number,cur="USD",x:any={})=>fire({type:"donation",provider:"streamlabs",verified:true,amount,currency:cur,name:"داعم",...x});
ok(ids(don(3))==="A_d1","$3 ← بسيط"); ok(ids(don(10))==="A_d2","$10 ← متوسط"); ok(ids(don(20))==="A_d3","$20 ← قوي (الحد الأدنى شامل)"); ok(ids(don(75))==="A_d4","$75 ← أسطوري");
ok(ids(don(0.5)).length===0,"$0.5 أقل من كل المستويات ← لا شيء");
ok(ids(don(37.5,"SAR"))==="A_d2","37.5 ر.س = $10 ← متوسط (تحويل بسعر الربط الرسمي)");
ok(ids(don(10,"XYZ")).length===0,"عملة بلا سعر موثوق ← لا نخمّن المستوى");
ok(fire({type:"donation",provider:"streamlabs",verified:false,amount:10,currency:"USD",name:"x"}).length===0,"دونيشن غير مؤكد ← لا شيء");
ok(!don(10).some(x=>x.sec==="gifts"||x.sec==="taps"),"الدونيشن لا يشغّل الهدايا أو التكبيس");

// 👆 التكبيس: كل مستوى مرة واحدة عند بلوغه (مجموع البث)
it=fire({type:"like",count:999}); ok(it.length===0,"999 تكبيسة ← لا شيء");
it=fire({type:"like",count:1}); ok(ids(it)==="A_tap1000"&&it[0].level==="1000","بلوغ 1,000 ← مقطع 1,000 فقط");
it=fire({type:"like",count:500}); ok(it.length===0,"1,500 ← لا شيء");
it=fire({type:"like",count:3600}); ok(ids(it)==="A_tap2000,A_tap5000","قفزة إلى 5,100 ← مقطعا 2,000 و5,000 بالترتيب");
it=fire({type:"like",count:4900}); ok(ids(it)==="A_tap10000","10,000 ← مقطع 10,000");
it=fire({type:"like",count:90000}); ok(ids(it)==="A_tap20000,A_tap50000,A_tap100000","100,000 ← 20k ثم 50k ثم 100k");
it=fire({type:"like",count:5000}); ok(it.length===0,"لا تكرار للمستويات في نفس البث");

// المحذوفة: متابعة / تعليقات / دخول
ok(fire({type:"follow"}).length===0,"متابعة ← لا آيرت (القسم محذوف)"); ok(fire({type:"comment",text:"hi"}).length===0,"تعليق ← لا آيرت"); ok(fire({type:"join"}).length===0,"دخول مشاهد ← لا آيرت");

// تكرار نفس الحدث
const dupEv={id:"same1",type:"gift",gift:"Lion",count:1,value:29999,user:{id:"z",name:"z"},platform:"tiktok"};
const a1=roomEvent(R,dupEv,Date.now()).out.filter((m:any)=>m.t==="alert"), a2=roomEvent(R,{...dupEv},Date.now()).out.filter((m:any)=>m.t==="alert");
ok(a1.length===1&&a2.length===0,"وصول نفس الحدث مرتين ← مقطع واحد");
const S=alNewState(), C=alCfg({enabled:true,lib}); const g1=alertsOnEvent(C,S,{id:"x1",type:"gift",gift:"Lion",value:1},1), g2=alertsOnEvent(C,S,{id:"x1",type:"gift",gift:"Lion",value:1},2);
ok(g1.length===1&&g2.length===0,"المحرك نفسه يمنع تكرار نفس المعرّف");

// تعطيل المستوى/المقطع
const L2=JSON.parse(JSON.stringify(lib)); L2.love.enabled=false; L2.don.levels[1].clips[0].enabled=false; R=mk(); R.botCfg.alerts.lib=L2;
ok(fire({type:"gift",gift:"Heart Me",count:1,value:1}).length===0,"أحبني معطّل ← لا شيء"); ok(don(10).length===0,"مقطع المتوسط معطّل ← لا شيء");

// أكثر من مقطع: بالترتيب وعشوائي
const L3=JSON.parse(JSON.stringify(lib)); L3.love.clips=[clip("L1"),clip("L2"),clip("L3")]; L3.love.order="seq"; R=mk(); R.botCfg.alerts.lib=L3;
ok([1,2,3,4].map(()=>ids(fire({type:"gift",gift:"Heart Me",count:1,value:1}))).join("|")==="L1|L2|L3|L1","الترتيب المحدد: L1 → L2 → L3 → L1");
L3.love.order="random"; R=mk(); R.botCfg.alerts.lib=L3; const seen=new Set(); for(let i=0;i<60;i++) seen.add(ids(fire({type:"gift",gift:"Heart Me",count:1,value:1}))); ok(seen.size>=2&&[...seen].every(x=>["L1","L2","L3"].includes(x)),"العشوائي: يختار من مقاطع المستوى فقط");

// الإعدادات المعروضة على الإشعار
const L4=JSON.parse(JSON.stringify(lib)); L4.don.levels[1].show={name:false,amount:true}; L4.don.levels[1].clips[0]={alertId:"A_d2",volume:.3,size:60,x:20,y:70,enter:"slideUp",exit:"zoomOut"}; R=mk(); R.botCfg.alerts.lib=L4;
const x=don(10)[0]; ok(x.over.cfg.title.show===false&&x.over.sub==="{currency_symbol}{amount}"&&x.vars.amount==="10","إخفاء الاسم وإظهار القيمة");
ok(x.over.volume===.3&&x.over.place.size===60&&x.over.place.x===20&&x.over.cfg.enter==="slideUp"&&x.over.cfg.exit==="zoomOut","الصوت والحجم والمكان والحركات لكل مقطع");

// التجربة: لا تُحسب دعماً
R=mk(); const before=JSON.stringify(R.DN), likes=R.D.tot.likes;
const t=roomClockOp(R,{target:"alerts",op:"libtest",sec:"don",key:"strong"},Date.now()); const ti=t.out.flatMap((m:any)=>m.items||[]);
ok(ti.length===1&&ti[0].test===true&&ti[0].alertId==="A_d3","تجربة مستوى «قوي» ← مقطعه بعلامة تجربة");
ok(JSON.stringify(R.DN)===before&&R.D.tot.likes===likes,"التجربة لا تدخل الدونيشن ولا الإحصائيات");
const tt=roomClockOp(R,{target:"alerts",op:"libtest",sec:"taps",key:"5000"},Date.now()).out.flatMap((m:any)=>m.items||[]); ok(tt[0].alertId==="A_tap5000"&&tt[0].vars.total_likes==="5,000","تجربة مستوى 5,000 تكبيسة");
ok(fire({type:"like",count:5000}).map((i:any)=>i.level).join(",")==="1000,2000,5000","التجربة لا تستهلك مستويات التكبيس الحقيقية");

// الطابور: دعم متزامن بدون تداخل
const Q=alQueue(); R=mk(); const many=[...don(10),...fire({type:"gift",gift:"Heart Me",count:1,value:1}),...don(75),...fire({type:"gift",gift:"Lion",count:1,value:29999})];
many.forEach(i=>alQueuePush(Q,i)); many.forEach(i=>alQueuePush(Q,i)); const order:string[]=[]; let q; while((q=alQueueNext(Q))) order.push(q.alertId);
ok(order.join(",")==="A_d2,A_love,A_d4,A_lion","4 إشعارات متزامنة ← تُشغَّل واحداً تلو الآخر بترتيب الوصول بدون تكرار");

// الترحيل من القواعد القديمة
const mig=alLibFromRules([{id:"a",event:"donation",alertId:"X1",label:"بسيط",cond:{op:"gte",value:1}},{id:"b",event:"donation",alertId:"X2",label:"كبير",cond:{op:"gte",value:10}},{id:"c",event:"like_total",alertId:"X3",cond:{op:"gte",value:5000}},{id:"d",event:"gift",alertId:"X4",cond:{op:"any",gift:"rose"}},{id:"e",event:"follow",alertId:"X5"}]);
ok(mig.don.levels.length===2&&mig.don.levels[0].min===1&&mig.don.levels[0].max===10&&mig.don.levels[1].max===0,"ترحيل شرائح الدونيشن إلى مستويات");
ok(mig.taps.levels[5000].clips[0].alertId==="X3"&&mig.gifts.items[0].name==="rose","ترحيل التكبيس والهدايا");
ok(!alLibAlertIds(mig).includes("X5"),"آيرت المتابعة القديم لا يدخل المكتبة");
ok(alLib({}).don.levels.map((l:any)=>l.min).join(",")==="1,5,10,20,50,100,200,500,1000","9 مستويات افتراضية 1$ → 1,000$");
console.log(f?`\n${f} FAILED`:"\nALL PASS"); process.exit(f?1:0);
