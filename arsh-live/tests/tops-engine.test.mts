import { topsKeys, topsOnEvent, topsList } from "/home/claude/najd/arsh-live/src/engine/tops.js";
let f=0; const ok=(c:any,m:string)=>{ console.log((c?"PASS ":"FAIL ")+m); if(!c) f++ };
const t0=Date.UTC(2026,10,10,20,0); // الثلاثاء 10 نوفمبر 23:00 بتوقيت السعودية
const K=topsKeys(t0); ok(K.day==="2026-11-10"&&K.week==="2026-11-08"&&K.month==="2026-11","keys: Riyadh day, week starts Sunday, month");
ok(topsKeys(Date.UTC(2026,10,10,21,30)).day==="2026-11-11","day rolls at local midnight (UTC+3)");
const T:any={}; topsOnEvent(T,{type:"gift",user:{id:"a",name:"A"},value:100},t0); topsOnEvent(T,{type:"gift",user:{id:"b",name:"B"},value:300},t0); topsOnEvent(T,{type:"gift",user:{id:"a",name:"A"},value:250},t0);
ok(topsList(T,"day",t0)[0].id==="a"&&topsList(T,"day",t0)[0].v===350,"accumulates per user, sorted");
ok(!topsOnEvent(T,{type:"gift",user:{id:"z",name:"Z"},value:9999,test:true},t0)&&!topsList(T,"day",t0).some((x:any)=>x.id==="z"),"test gifts not counted");
ok(!topsOnEvent(T,{type:"gift",platform:"kick",user:{id:"k",name:"K"},value:500},t0),"non-TikTok gifts not mixed into TikTok gift points");
const next=Date.UTC(2026,10,11,22,0); ok(topsList(T,"day",next).length===0&&topsList(T,"week",next)[0].id==="a"&&topsList(T,"month",next).length===2,"next day: day resets, week/month keep");
ok(topsList(T,"week",Date.UTC(2026,10,15,9,0)).length===0,"new week (Sunday) resets weekly");
topsOnEvent(T,{type:"share",user:{id:"s",name:"S"}},t0); topsOnEvent(T,{type:"share",user:{id:"s",name:"S"}},t0); ok(topsList(T,"shares",t0)[0].v===2,"shares counted per user");
const B:any={}; for(let i=0;i<300;i++) topsOnEvent(B,{type:"gift",user:{id:"u"+i,name:"u"},value:i+1},t0); ok(Object.keys(B.day.u).length<=120,"memory bounded");
console.log(f?`${f} FAILED`:"ALL PASS"); if(f) process.exit(1);
