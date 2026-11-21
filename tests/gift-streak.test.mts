// سلاسل هدايا TikTok في السبثون: العدد التراكمي → الزيادة فقط، بدون تكرار، بدون فقدان — عبر roomEvent (مسار الخادم)
import { newRoom, roomEvent, roomClockOp } from "../arsh-live/src/engine/room.js";
import { newRule, remaining } from "../arsh-live/src/engine/clock.js";
let pass=0,fail=0; const ok=(c:any,m:string)=>{ c?pass++:(fail++,console.log("FAIL",m)) };
let t=Date.parse("2026-11-22T00:00:00Z"); let n=0;
const mk=()=>{ const R:any=newRoom(); const op=(m:any)=>roomClockOp(R,{target:"subathon",...m},t);
 op({op:"config",config:{initialMs:3600_000,maxMs:0,rules:{list:[newRule("gift",{giftId:5655,giftName:"وردة",ms:5000}),newRule("gift",{giftId:5487,giftName:"أحبني",ms:10_000}),newRule("gift",{giftId:6369,giftName:"أسد",ms:30*60_000})],giftMode:"gifts_first"}}}); op({op:"start"}); return R };
let R:any=mk(); const rem=()=>remaining(R.C.subathon,t);
// حدث كما يرسله tiktok.ts: كل تحديث يحمل العدد التراكمي في السلسلة + معرّف رسالة مختلف
const upd=(user:string,cum:number,o:any={})=>roomEvent(R,{type:"gift",id:"gift:m"+(++n),user:{id:user,name:user},gift:o.gift||"Rose",giftId:o.giftId??5655,diamonds:o.d??1,value:(o.d??1)*cum,count:cum,
 streak:{cum,gc:o.gc||0,end:!!o.end,type:o.type??1,group:o.group??"g-"+user}},t);
const streak=(user:string,counts:number[],o:any={})=>{ for(const c of counts){ upd(user,c,o); t+=400 } if(o.final!==false){ t+=3000; upd(user,counts[counts.length-1],{...o,end:true}) } };
const step=(label:string,fn:()=>void,expectMs:number)=>{ const d=rem(), t0=t; fn(); const got=rem()-d+(t-t0); ok(got===expectMs,`${label}: expected +${expectMs/1000}s got +${got/1000}s`) };

step("1 وردة",()=>streak("a",[1],{group:"s1"}),5000);
step("5 وردات (1→3→5 + نهائي)",()=>streak("a",[1,3,5],{group:"s2"}),25_000);
step("10 وردات",()=>streak("a",[1,4,7,10],{group:"s3"}),50_000);
step("30 وردة (1→5→10→20→30) = 150 ثانية بالضبط",()=>streak("a",[1,5,10,20,30],{group:"s4"}),150_000);
step("100 وردة",()=>streak("a",[1,10,25,50,75,99,100],{group:"s5"}),500_000);
// جدول المواصفات: الزيادات 1+4+5+10+10 = 30
{ const before=(R.C.glog||[]).length; streak("tbl",[1,5,10,20,30],{group:"s-tbl",final:false}); const g=R.C.glog.slice(0,R.C.glog.length-before).reverse(); ok(g.map((x:any)=>x.counted).join(",")==="1,4,5,10,10","increments 1,4,5,10,10 → "+g.map((x:any)=>x.counted).join(",")); }
t+=60_000;
step("هديتان مختلفتان في نفس اللحظة (وردة ×10 + أسد)",()=>{ upd("b",10,{group:"x1"}); upd("b",1,{gift:"Lion",giftId:6369,d:29999,group:"x2",type:2,end:true}); },50_000+30*60_000);
step("مشاهدان يرسلان ورداً متداخلاً",()=>{ for(const [u,c] of [["p",1],["q",1],["p",5],["q",3],["p",12],["q",8]] as any) upd(u,c,{group:"mix-"+u}); upd("p",12,{group:"mix-p",end:true}); upd("q",8,{group:"mix-q",end:true}); },(12+8)*5000);
step("تكرار الحدث النهائي 3 مرات",()=>{ streak("c",[1,6],{group:"f1"}); upd("c",6,{group:"f1",end:true}); upd("c",6,{group:"f1",end:true}); },30_000);
step("إعادة إرسال نفس الرسالة (نفس المعرّف)",()=>{ const ev={type:"gift",id:"gift:same",user:{id:"d",name:"d"},gift:"Rose",giftId:5655,diamonds:1,value:3,count:3,streak:{cum:3,gc:0,end:false,type:1,group:"z"}}; roomEvent(R,ev,t); roomEvent(R,{...ev},t); },15_000);
step("بدون حدث نهائي (لم يصل) — لا تضيع الهدايا",()=>streak("e",[1,5,9],{group:"nf",final:false}),45_000);
step("تحديث متأخر خارج الترتيب لا يضيف",()=>{ upd("f",10,{group:"oo"}); upd("f",6,{group:"oo"}); upd("f",12,{group:"oo"}); },60_000);
step("إرسال متعدد (groupCount=10 ×3 ضغطات = 30)",()=>{ upd("g",1,{group:"gc",gc:10}); upd("g",2,{group:"gc",gc:10}); upd("g",3,{group:"gc",gc:10}); upd("g",3,{group:"gc",gc:10,end:true}); },150_000);
// بدون معرّف مجموعة (سلسلتان متتاليتان لنفس المشاهد) — بيانات بثك الحقيقية: 1,3,5,6,8,(8 نهائي) ثم 1,2,(2 نهائي)
step("سلسلتان بدون groupId (نمط البث الحقيقي) = 8 + 2",()=>{ for(const c of [1,3,5,6,8]) { upd("turki",c,{group:""}); t+=500 } t+=3000; upd("turki",8,{group:"",end:true}); t+=2000; for(const c of [1,2]) { upd("turki",c,{group:""}); t+=500 } t+=3000; upd("turki",2,{group:"",end:true}); },(8+2)*5000);
t+=60_000;
step("نفس الهدية مرة ثانية بعد مدة (بدون groupId) تُحتسب",()=>{ upd("h",1,{group:"",end:true}); t+=20_000; upd("h",1,{group:"",end:true}); },10_000);
// انقطاع الاتصال وإعادة تشغيل الخادم أثناء السلسلة: الحالة تُحفظ داخل C (مثل saveClock) وتُستعاد مع معرّفات السجل
{ streak("k",[1,5,10],{group:"rs",final:false}); const saved=JSON.parse(JSON.stringify({C:R.C,logs:R.logs})); const d0=rem();
  const R2:any=newRoom(); R2.C=saved.C; R2.logs=saved.logs; for(const l of R2.logs) if(l.eventId) R2.seen.set(l.eventId,l.at); const old=R; R=R2;
  ok(rem()===d0,"restored remaining equal");
  step("بعد إعادة التشغيل: نفس التحديث (10) لا يتكرر، والزيادة 10→30 تُحتسب فقط",()=>{ upd("k",10,{group:"rs"}); upd("k",20,{group:"rs"}); upd("k",30,{group:"rs"}); upd("k",30,{group:"rs",end:true}); },100_000);
  void old; }
// تحديث OBS أثناء الهدايا: لقطة جديدة لا تعيد الاحتساب
{ const { roomSnapshot } = await import("../arsh-live/src/engine/room.js"); const d=rem(); upd("o",4,{group:"obs"}); const snap=roomSnapshot(R,t); upd("o",9,{group:"obs"}); const snap2=roomSnapshot(R,t);
  ok(rem()-d===45_000,"OBS refresh mid-streak: +45s total"); ok(snap.C.glog&&snap2.C.glog.length>=snap.C.glog.length,"snapshot carries gift log"); }
// السجل التشخيصي
const g=R.C.glog; ok(g.length>0&&g.length<=80,"gift log capped");
const last=g.find((x:any)=>x.status==="dup"); ok(last&&/محتسب/.test(last.why),"duplicate final shows reason");
ok(g.some((x:any)=>x.status==="added"&&x.ms===5000&&x.counted===1),"added row shows counted + time");
// سبب عدم إضافة الوقت: السبثون متوقف
roomClockOp(R,{target:"subathon",op:"pause"},t); R.C.subathon.countWhilePaused=false; upd("z",2,{group:"paused"}); ok(R.C.glog[0].status==="none"&&/متوقف/.test(R.C.glog[0].why),"paused → reason: "+R.C.glog[0].why);
// هدية بدون قاعدة وبدون قيمة كوين
roomClockOp(R,{target:"subathon",op:"resume"},t); roomEvent(R,{type:"gift",id:"gift:unk",user:{id:"y",name:"y"},gift:"Mystery",giftId:1,count:1,value:0,streak:{cum:1,gc:0,end:true,type:2,group:"u1"}},t); ok(R.C.glog[0].status==="none"&&R.C.glog[0].why,"unknown gift → reason: "+R.C.glog[0].why);
// الأحداث بدون معلومات السلسلة (التجربة) تعمل كما كانت
{ const d=rem(); roomEvent(R,{type:"gift",id:"sim1",user:{id:"s",name:"s"},gift:"Rose",giftId:5655,diamonds:1,value:7,count:7,sim:true},t); ok(rem()-d===35_000,"sim gift ×7 unchanged = +35s"); }
// القواعد لم تتغير
ok(R.C.subathon.rules.list.length===3&&R.C.subathon.rules.list[0].ms===5000,"creator rules untouched");
console.log(`gift-streak: ${pass} passed, ${fail} failed`); if(fail) process.exit(1);
