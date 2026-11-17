// تحدي الفريقين: عبر roomEvent/roomClockOp/roomTick (نفس مسار الخادم)
import { newRoom, roomEvent, roomClockOp, roomTick, roomSnapshot } from "../arsh-live/src/engine/room.js";
let pass=0,fail=0; const ok=(c:any,m:string)=>{ c?pass++:(fail++,console.log("FAIL",m)) };
const R:any=newRoom(); let t=Date.parse("2026-11-17T18:00:00Z"); let n=0;
const gift=(u:string,g:string,v:number,x:any={})=>roomEvent(R,{type:"gift",id:"g"+(++n),user:{id:u,name:u,avatar:""},gift:g,value:v,count:1,...x},t);
const op=(m:any)=>roomClockOp(R,{target:"battle",...m},t);
// قبل البدء: لا شيء يُحسب
ok(op({op:"config",config:{durMs:60000}}).out.length===1,"config accepted"); gift("u1","Rose",10); ok(R.C.battle.teams[0].score===0,"idle: gifts ignored");
op({op:"start"}); ok(R.C.battle.status==="running"&&R.C.battle.endsAt===t+60000,"start → running 60s");
const r1=gift("u1","Rose",10); ok(R.C.battle.teams[0].score===10,"Rose → blue +10"); ok(r1.out.some((o:any)=>o.t==="clock"&&o.bt),"gift pushes clock update immediately");
gift("u2","TikTok",1); gift("u3","وردة",5); ok(R.C.battle.teams[1].score===1&&R.C.battle.teams[0].score===15,"Arabic gift name maps too");
gift("u4","Lion",29999); ok(R.C.battle.teams.every((x:any)=>x.score<100),"unmapped gift ignored in gift mode");
ok(R.C.battle.teams[0].top.n==="u1"&&R.C.battle.teams[0].top.v===10,"team top supporter tracked");
gift("u9","Rose",500,{test:true}); ok(R.C.battle.teams[0].score===15,"test event ignored outside test mode");
const before=R.C.battle.teams[0].score; roomEvent(R,{type:"gift",id:"g2",user:{id:"u1",name:"u1"},gift:"Rose",value:10},t); ok(R.C.battle.teams[0].score===before,"duplicate event id not double counted");
// انتهاء الوقت
t+=61000; const tk=roomTick(R,t); ok(R.C.battle.status==="ended"&&R.C.battle.winner==="a","time up → ended, blue wins"); ok(tk.out.some((o:any)=>o.t==="clock"),"tick broadcasts end");
gift("u2","TikTok",999); ok(R.C.battle.teams[1].score===1,"no scoring after end");
ok(roomSnapshot(R,t).C.battle.winner==="a","state in snapshot (survives reconnect)");
// وضع الانضمام بالشات + التكبيس
op({op:"config",config:{mode:"join",likePts:100,teams:[{id:"a",kw:"!أزرق"},{id:"b",kw:"احمر"}]}}); op({op:"start"});
ok(R.C.battle.teams[0].score===0&&R.C.battle.winner===null,"restart resets scores");
roomEvent(R,{type:"comment",id:"c1",user:{id:"v1",name:"v1"},text:"ازرق"},t); roomEvent(R,{type:"comment",id:"c2",user:{id:"v2",name:"v2"},text:"!احمر يلا"},t);
ok(R.C.battle.members.v1==="a"&&R.C.battle.members.v2==="b","join by keyword (normalised أ/ا and !)");
roomEvent(R,{type:"comment",id:"c3",user:{id:"v1",name:"v1"},text:"احمر"},t); ok(R.C.battle.members.v1==="a","cannot switch team");
gift("v1","Lion",300); gift("v2","Rose",1); gift("v3","Rose",50); ok(R.C.battle.teams[0].score===300&&R.C.battle.teams[1].score===1,"join mode: gifts go to member team, non-members ignored");
const lr=roomEvent(R,{type:"like",id:"l1",user:{id:"v2",name:"v2"},count:15},t); ok(R.C.battle.teams[1].score===16,"likes count when enabled");
ok(!lr.out.some((o:any)=>o.t==="clock"&&o.bt),"likes batched (no per-like broadcast)"); ok(roomTick(R,t+500).out.some((o:any)=>o.t==="clock"),"batched like update sent on tick");
op({op:"addTime",ms:30000}); ok(R.C.battle.endsAt===t+60000+30000,"add time"); op({op:"stop"}); ok(R.C.battle.status==="ended","manual stop");
// وضع التجربة يقبل الأحداث التجريبية
op({op:"config",config:{mode:"gift"}}); op({op:"start",test:true}); gift("x","Rose",7,{test:true}); ok(R.C.battle.teams[0].score===7,"test mode counts test events");
op({op:"reset"}); ok(R.C.battle.status==="idle"&&R.C.battle.mode==="gift"&&R.C.battle.durMs===60000,"reset keeps config");
console.log(`battle: ${pass} passed, ${fail} failed`); process.exit(fail?1:0);
