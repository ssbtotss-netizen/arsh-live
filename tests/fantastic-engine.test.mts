// اختبارات محرك «Fantastic Subathon»: جذور مشاكل القوانين + الأصوات + احتساب الهدايا (بدون متصفح)
import { newSubathon, subathonOp, subathonOnEvent, subathonTick, defaultRuleList, cleanRuleList, duplicateRules, isEmptyRule, rulesForBoard, remaining } from "../arsh-live/src/engine/clock.js";
import { sndCfg, sndNewState, sndOnLogs, sndRule } from "../arsh-live/src/engine/sounds.js";
import { RB_MOTIONS } from "../arsh-live/src/engine/rbmotion.js";
import { RB50 as RB_DESIGNS } from "../arsh-live/src/engine/rb50.js";
let pass=0, fail=0; const ok=(c:any,m:string)=>{ if(c){pass++;console.log("PASS "+m)} else {fail++;console.log("FAIL "+m);process.exitCode=1} };
const T0=1_700_000_000_000;
const mk=()=>{ const s:any=newSubathon(); s.rules.list=defaultRuleList(); return s };

// 1) الحذف نهائي — لا يرجع من الجدول القديم ولا يتكرر
{ const s=mk(); const rose=s.rules.list.find((r:any)=>r.giftId===5655);
  subathonOp(s,{op:"config",config:{rules:{list:s.rules.list.filter((r:any)=>r.id!==rose.id)}}},T0);
  ok(!s.rules.list.some((r:any)=>r.giftId===5655),"delete: rule removed from settings");
  ok(!rulesForBoard(s).some((x:any)=>x.rid===rose.id),"delete: rule removed from overlay data");
  subathonOp(s,{op:"config",config:{rules:{gifts:{table:[{giftId:5655,name:"وردة",sec:5},{giftId:6369,name:"أسد",sec:1800}]}}}},T0+1);
  ok(!s.rules.list.some((r:any)=>r.giftId===5655),"delete: legacy gifts.table does not resurrect the deleted rule");
  ok(s.rules.list.filter((r:any)=>r.giftId===6369).length===1,"legacy op does not duplicate existing rules");
  ok(!s.rules.gifts.table.some((r:any)=>r.giftId===5655),"legacy table mirrors the rules list"); }
// 2) التنظيف: معرّفات فريدة، عناصر تالفة تُحذف، الفارغ لا يظهر
{ const a:any=defaultRuleList()[0]; const L=cleanRuleList([a,{...a},{kind:"bogus"},null,{kind:"gift",giftId:null,giftName:""}] as any);
  ok(L.length===3&&new Set(L.map((r:any)=>r.id)).size===3,"clean: unique ids, broken items dropped");
  ok(isEmptyRule(L[2]),"empty gift rule detected");
  const s=mk(); s.rules.list=L; ok(rulesForBoard(s).length===2,"empty rules never reach the overlay");
  ok(duplicateRules([a,{...a,id:"x2"}] as any).length===1,"real duplicates detected (same event + same settings)"); }
// 3) الإخفاء ≠ الإيقاف
{ const s=mk(); const f=s.rules.list.find((r:any)=>r.kind==="follow"); f.show=false; f.ms=60000;
  subathonOp(s,{op:"start"},T0); const b=remaining(s,T0); subathonOnEvent(s,{id:"f1",type:"follow",user:{name:"a"}},T0,{});
  ok(remaining(s,T0)-b===60000,"hidden rule still adds time"); ok(!rulesForBoard(s).some((x:any)=>x.rid===f.id),"hidden rule not shown");
  f.enabled=false; f.show=true; const b2=remaining(s,T0); subathonOnEvent(s,{id:"f2",type:"follow",user:{name:"b"}},T0,{});
  ok(remaining(s,T0)===b2,"disabled rule adds nothing"); ok(!rulesForBoard(s).some((x:any)=>x.rid===f.id),"disabled rule not shown"); }
// 4) 30 وردة متتالية: لا عدّ مزدوج ولا فقدان
{ const s=mk(); subathonOp(s,{op:"start"},T0); const b=remaining(s,T0); let n=0;
  for(let i=0;i<30;i++){ n+=subathonOnEvent(s,{id:"g"+i,type:"gift",giftId:5655,gift:"Rose",diamonds:1,count:1,user:{name:"u"+i}},T0+i,{}).length }
  ok(remaining(s,T0+40)-b+40===30*5000&&n===30,"30 consecutive roses → exactly +150s, one log each (no double count, none dropped)"); }
// 5) هدايا مختلفة متزامنة
{ const s=mk(); subathonOp(s,{op:"start"},T0); const b=remaining(s,T0);
  subathonOnEvent(s,{id:"x1",type:"gift",giftId:5655,gift:"Rose",diamonds:1,count:3,user:{name:"a"}},T0,{});
  subathonOnEvent(s,{id:"x2",type:"gift",giftId:6369,gift:"Lion",diamonds:29999,count:1,user:{name:"b"}},T0,{});
  ok(remaining(s,T0)-b===15000+30*60000,"concurrent different gifts each counted (+15s + 30m)"); }
// 6) أصوات السابثون: أحداث + صوت لكل قانون + منع التكرار + بدون أصوات
{ const cfg=sndCfg({on:true,rules:[
   sndRule({ev:"subathon",cond:{dir:"add"},sounds:[{src:"lib:hype-01"}]}),
   sndRule({ev:"sa_start",sounds:[{src:"lib:alert-02"}]}),sndRule({ev:"sa_end",sounds:[{src:"lib:alert-03"}]}),sndRule({ev:"sa_near",sounds:[{src:"lib:alert-04"}]}),sndRule({ev:"sa_milestone",sounds:[{src:"lib:alert-05"}]}),sndRule({ev:"sa_pause",sounds:[{src:"lib:alert-06"}]})]});
  const s=mk(); s.nearEndMs=5*60000; s.initialMs=s.remainingMs=6*60000; const st=sndNewState();
  let logs=subathonOp(s,{op:"start"},T0); let out=sndOnLogs(cfg,st,logs,T0,{rules:s.rules.list});
  ok(out.some((x:any)=>x.s.src==="lib:alert-02"),"sound: subathon start");
  logs=subathonOp(s,{op:"pause"},T0+1000); out=sndOnLogs(cfg,st,logs,T0+1000,{rules:s.rules.list}); ok(out.some((x:any)=>x.s.src==="lib:alert-06"),"sound: pause");
  subathonOp(s,{op:"resume"},T0+2000);
  logs=subathonTick(s,T0+2000+90000); out=sndOnLogs(cfg,st,logs,T0+92000,{rules:s.rules.list}); ok(out.some((x:any)=>x.s.src==="lib:alert-04"),"sound: near end (once)");
  ok(subathonTick(s,T0+93000).length===0,"near-end fires only once");
  const rose=s.rules.list.find((r:any)=>r.giftId===5655); rose.soundId="lib:comedy-01";
  logs=subathonOnEvent(s,{id:"r1",type:"gift",giftId:5655,gift:"Rose",diamonds:1,count:1,user:{name:"a"}},T0+95000,{}); out=sndOnLogs(cfg,st,logs,T0+95000,{rules:s.rules.list});
  ok(out.length===1&&out[0].s.src==="lib:comedy-01","rule sound replaces the generic add sound (no double playback)");
  rose.soundId="none"; logs=subathonOnEvent(s,{id:"r2",type:"gift",giftId:5655,gift:"Rose",diamonds:1,count:1,user:{name:"b"}},T0+96000,{}); out=sndOnLogs(cfg,st,logs,T0+96000,{rules:s.rules.list});
  ok(out.length===0,"«بدون صوت» per rule → silent");
  rose.soundId=""; logs=subathonOnEvent(s,{id:"r3",type:"gift",giftId:5655,gift:"Rose",diamonds:1,count:1,user:{name:"c"}},T0+97000,{}); out=sndOnLogs(cfg,st,logs,T0+97000,{rules:s.rules.list,soundsOff:true});
  ok(out.length===0,"subathon without sounds (soundsOff)");
  const cfg2=sndCfg({on:true,rules:[sndRule({ev:"gift",cond:{giftId:"5655"},sounds:[{src:"lib:alert-01"}]})]}); rose.soundId="lib:comedy-01";
  logs=subathonOnEvent(s,{id:"r4",type:"gift",giftId:5655,gift:"Rose",diamonds:1,count:1,user:{name:"d"}},T0+98000,{}); out=sndOnLogs(cfg2,sndNewState(),logs,T0+98000,{rules:s.rules.list});
  ok(out.length===0,"rule sound skipped when the gift already has an alert sound (unless allowed)");
  rose.soundDouble=true; logs=subathonOnEvent(s,{id:"r5",type:"gift",giftId:5655,gift:"Rose",diamonds:1,count:1,user:{name:"e"}},T0+99000,{}); out=sndOnLogs(cfg2,sndNewState(),logs,T0+99000,{rules:s.rules.list});
  ok(out.length===1,"double playback only when explicitly allowed");
  const s3=mk(); s3.milestoneMs=60*60000; subathonOp(s3,{op:"start"},T0); logs=subathonOp(s3,{op:"add",ms:61*60000,source:"manual"},T0+1); ok(logs.some((l:any)=>l.sa==="milestone"),"milestone log after +1h");
  logs=subathonOp(s3,{op:"end"},T0+2); out=sndOnLogs(cfg,sndNewState(),logs,T0+2,{}); ok(out.some((x:any)=>x.s.src==="lib:alert-03"),"sound: end"); }
// 7) 50 تصميماً و50 حركة رئيسية
{ ok(RB_DESIGNS.length===50,"50 designs"); ok(RB_MOTIONS.length===50&&new Set(RB_MOTIONS.map((m:any)=>m.id)).size===50,"50 motions with unique ids");
  ok(new Set(RB_DESIGNS.map((d:any)=>d.motion)).size===50,"each design has its own main motion (no reuse)");
  ok(new Set(RB_MOTIONS.map((m:any)=>m.run.toString().replace(/\d+(\.\d+)?/g,"n"))).size===50,"motion implementations differ (not renamed copies, numbers ignored)");
  const cats:any={}; for(const m of RB_MOTIONS as any) cats[m.cat]=(cats[m.cat]||0)+1; ok(Object.values(cats).every((n:any)=>n===10),"10 motions per category (line/text/lux/tech/creative)"); }
console.log(`fantastic-engine: ${pass} passed, ${fail} failed`);
