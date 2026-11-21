// السبثون + عملات وهدايا TikTok: الطريقة (هدايا أولاً/عملات/هدايا)، الشرائح والمعدّل مع ترحيل الباقي، الزيادة والخصم، القيمة المجهولة، التجربة المنفصلة، وعدم الاحتساب المزدوج — عبر roomEvent (مسار الخادم)
import { newRoom, roomEvent, roomClockOp } from "../arsh-live/src/engine/room.js";
import { newRule, subathonPreview, remaining, giftCoins } from "../arsh-live/src/engine/clock.js";
let pass=0,fail=0; const ok=(c:any,m:string)=>{ c?pass++:(fail++,console.log("FAIL",m)) };
let t=Date.parse("2026-11-21T20:00:00Z"); let n=0;
const R:any=newRoom(); const S=()=>R.C.subathon; const rem=()=>remaining(S(),t);
const op=(m:any)=>roomClockOp(R,{target:"subathon",...m},t);
const gift=(name:string,id:number|null,diamonds:number|undefined,count=1,x:any={})=>roomEvent(R,{type:"gift",id:"g"+(++n),user:{id:"u"+n,name:"مشاهد"+n},gift:name,giftId:id,diamonds,value:diamonds!=null?diamonds*count:0,count,...x},t);
const L=[ newRule("coins",{mode:"rate",coins:100,ms:60_000}), newRule("coins",{mode:"tier",coins:5000,ms:30*60_000}),
 newRule("gift",{giftId:5655,giftName:"وردة",ms:5000}), newRule("gift",{giftId:null,giftName:"أحبني",ms:10_000}), newRule("gift",{giftId:6369,giftName:"أسد",ms:30*60_000}), newRule("gift",{giftId:9999,giftName:"قنبلة",ms:2*60_000,dir:-1}) ];
op({op:"config",config:{initialMs:3600_000,maxMs:0,rules:{list:L,giftMode:"gifts_first"}}}); op({op:"start"});
const base=rem(); ok(base===3600_000,"start 1h");
let d=rem(); gift("Rose",5655,1); ok(rem()-d===5000,"🌹 وردة (by id) +5s");
d=rem(); gift("أحبني",null,1); ok(rem()-d===10_000,"❤️ أحبني (separate gift rule, by name) +10s");
d=rem(); gift("Lion",6369,29999); ok(rem()-d===30*60_000,"🦁 high value Lion: gift rule wins (+30m), coins NOT added on top");
d=rem(); gift("قنبلة",9999,10); ok(rem()-d===-2*60_000,"subtract rule −2m");
// العملات (بدون قاعدة هدية): المعدّل مع ترحيل الباقي
d=rem(); gift("Donut",5879,30,5); ok(rem()-d===60_000,"Donut ×5 = 150 coins → +1m (50 carried)");
d=rem(); gift("Donut",5879,30,2); ok(rem()-d===60_000,"next 60 coins + 50 carried = 110 → +1m");
d=rem(); gift("Galaxy",11046,1000,5); ok(rem()-d===30*60_000,"5000 coins → tier ≥5000 = +30m (tier beats rate, once)");
// هدايا متتالية
d=rem(); for(let i=0;i<10;i++) gift("Rose",5655,1); ok(rem()-d===50_000,"10 consecutive roses = +50s");
d=rem(); gift("Rose",5655,1,7); ok(rem()-d===35_000,"rose streak ×7 = +35s");
// منع التكرار: نفس معرّف الحدث
d=rem(); const ev={type:"gift",id:"same-1",user:{id:"x",name:"x"},gift:"Rose",giftId:5655,diamonds:1,value:1,count:1}; roomEvent(R,ev,t); roomEvent(R,{...ev},t); ok(rem()-d===5000,"same event id counted once");
// طريقة «العملات فقط»
op({op:"config",config:{rules:{giftMode:"coins"}}});
d=rem(); gift("Lion",6369,29999); ok(rem()-d===30*60_000,"coins mode: Lion 29999 coins → tier +30m (gift rule ignored)");
d=rem(); gift("Rose",5655,1); ok(rem()-d===0,"coins mode: 1 coin accumulates (no time yet)");
// «الهدايا فقط»
op({op:"config",config:{rules:{giftMode:"gifts"}}});
d=rem(); gift("Donut",5879,30,10); ok(rem()-d===0,"gifts mode: gift without rule adds nothing");
d=rem(); gift("Rose",5655,1); ok(rem()-d===5000,"gifts mode: rose rule works");
// إيقاف احتساب الهدايا/العملات من الإعدادات المتقدمة
op({op:"config",config:{rules:{giftMode:"gifts_first",giftsOn:false}}}); d=rem(); gift("Rose",5655,100); ok(rem()-d===60_000,"gifts counting off → falls to coins (100 coins = +1m)");
op({op:"config",config:{rules:{giftsOn:true,coinsOn:false}}}); d=rem(); gift("Donut",5879,30,10); ok(rem()-d===0,"coins counting off → no time for gifts without rule");
op({op:"config",config:{rules:{coinsOn:true}}});
// قيمة مجهولة: لا نخترع — تُسجل لصانع المحتوى، وتعمل بعد تحديدها يدوياً
d=rem(); gift("Mystery",777,undefined,3); ok(rem()-d===0&&S().rstate.unknown.Mystery===3,"unknown coin value → no time, recorded for manual value");
op({op:"config",config:{rules:{giftCoins:{"777":100}}}}); d=rem(); gift("Mystery",777,undefined,1); ok(rem()-d===60_000,"manual coin value (100) → +1m");
ok(giftCoins(S().rules,{gift:"Mystery",giftId:777})===100,"manual value read back");
// تغيير القواعد أثناء البث
const L2=S().rules.list.map((r:any)=>r.giftName==="وردة"?{...r,ms:20_000}:r); op({op:"config",config:{rules:{list:L2}}}); d=rem(); gift("Rose",5655,1); ok(rem()-d===20_000,"rule change mid-stream applies immediately (rose +20s)");
// تجربة هدية: لا تلمس العداد
const before=rem(), seq=S().seq; const pv=subathonPreview(S(),{type:"gift",gift:"Lion",giftId:6369,diamonds:29999,value:29999,count:1,user:{name:"تجربة"}},t);
ok(pv.deltaMs===30*60_000&&pv.rule&&pv.rule.label==="أسد","preview shows +30m via Lion rule"); ok(rem()===before&&S().seq===seq,"preview does not change the real counter");
const pv2=subathonPreview(S(),{type:"gift",gift:"Donut",giftId:5879,diamonds:30,value:300,count:10,user:{name:"t"}},t); ok(pv2.coins===300&&pv2.rule&&pv2.rule.kind==="coins","preview reports coins + coins rule");
// الحد الأقصى
op({op:"config",config:{maxMs:rem()+60_000}}); d=rem(); gift("Lion",6369,29999); ok(rem()-d===60_000,"max time cap respected");
// السبثون الموقوف لا يحتسب إذا «احتساب أثناء الإيقاف» معطّل
op({op:"config",config:{maxMs:0,countWhilePaused:false}}); op({op:"pause"}); d=rem(); gift("Rose",5655,1); ok(rem()-d===0,"paused + countWhilePaused=false → nothing");
console.log(`subathon-coins: ${pass} passed, ${fail} failed`); process.exit(fail?1:0);
