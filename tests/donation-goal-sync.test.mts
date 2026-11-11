import { newRoom, roomEvent } from "/home/claude/najd/arsh-live/src/engine/room.js";
import { goalProgress, newGoal, defaultDonCfg, applyDonation, emptyDonations } from "/home/claude/najd/arsh-live/src/engine/donations.js";
import { sgProgress } from "/home/claude/najd/arsh-live/src/engine/lb.js";
import { newWidget } from "/home/claude/najd/arsh-live/src/engine/defs.js";
let f=0; const ok=(c:any,m:string)=>{ console.log((c?"PASS ":"FAIL ")+m); if(!c) f++ };
const R:any=newRoom(); const g=newGoal({id:"g50",target:50,currency:"USD",base:0}); const DC={...defaultDonCfg(),currency:"SAR",goals:[g]};
let n=0; const don=(amount:number,currency="USD",x:any={})=>roomEvent(R,{type:"donation",verified:true,id:"streamlabs:"+(x.id||++n),provider:"streamlabs",amount,currency,name:"داعم",...x},Date.now());
const P=()=>goalProgress(g,R.DN,Date.now(),DC.fx);
const e1=don(10); ok(e1.out.some((m:any)=>m.t==="event"&&m.ev.type==="donation"),"real donation → broadcast {t:event} to all overlay sources");
ok(P().current===10&&Math.round(P().pct)===20,"$10 / $50 — 20%");
don(5); ok(P().current===15&&Math.round(P().pct)===30,"$15 / $50 — 30%");
don(20); ok(P().current===35&&Math.round(P().pct)===70,"$35 / $50 — 70%");
don(2); ok(P().current===37,"$2 counted");
don(13); ok(P().reached&&P().pct===100,"reaches 100%");
don(20); ok(P().pct===100&&P().over===20&&P().rawPct>100,"over the goal: fill capped at 100%, +$20 shown as over");
const r1=don(7,"USD",{id:"same"}), r2=don(7,"USD",{id:"same"}); ok(r1.out.length>0&&(r2 as any).dup&&P().current===77,"same donation twice (reconnect/resend) counted once");
const before=P().current; don(4,"USD",{id:"a1"}); don(6,"USD",{id:"a2"}); ok(P().current===before+10,"two simultaneous donations both counted");
const t=roomEvent(R,{type:"donation",test:true,id:"test:1",provider:"test",amount:10,currency:"USD",name:"x"},Date.now()); ok(t.out.length>0&&P().tests===10&&P().real===before+10,"test donation moves the bar but is not in the real total");
const sar=P().current; don(37.5,"SAR"); ok(Math.abs(P().current-sar-10)<0.01,"37.5 SAR converted to $10 (not added as 37.5)");
// كل التصاميم من نفس المصدر
const src={DN:R.DN,DC,D:{tot:{}}}; const designs=["miniPill","cup","heart","diamond","box","palm"].map(d=>newWidget("sgoal",{source:"donation",goalId:"g50",design:d}));
const ps=designs.map(w=>sgProgress(w,src)); ok(ps.every(p=>p.cur===ps[0].cur&&p.tgt===50),"all goal designs read the same central goal ($"+ps[0].cur+" / $50)");
// الإصلاح: الهدف المستقل داخل العنصر كان يتجاهل الدولار إذا كانت عملة اللوحة ريال
const own=newWidget("sgoal",{source:"donation",goalId:"own",target:100,currency:""}); const D2=emptyDonations(); applyDonation(D2,{type:"donation",verified:true,id:"x",amount:10,currency:"USD",name:"a",t:Date.now()});
ok(Math.abs(sgProgress(own,{DN:D2,DC,D:{tot:{}}}).cur-37.5)<0.01,"own-goal element (SAR) counts a $10 donation as 37.5 SAR (was 0 before the fix)");
const ownUsd=newWidget("sgoal",{source:"donation",goalId:"own",target:50,currency:"USD"}); ok(sgProgress(ownUsd,{DN:D2,DC,D:{tot:{}}}).cur===10,"own-goal element in USD counts $10");
// إعادة تحميل الرابط: الحالة من قاعدة البيانات (نفس القائمة) تعطي نفس الرقم
const fromDb={list:R.DN.list.filter((d:any)=>!d.test)}; ok(goalProgress(g,fromDb,Date.now(),DC.fx).current===P().real,"reload/poll from DB shows the same real amount (no reset)");
console.log(f?f+" FAILED":"ALL PASS"); process.exit(f?1:0);
