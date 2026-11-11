import { newSubathon, subathonOp, subathonOnEvent, subathonOnDonation, remaining, migrateRules, newRule, rulesForBoard, presetRules, donationAction } from "../arsh-live/src/engine/clock.js";
import { newRoom, roomEvent } from "../arsh-live/src/engine/room.js";
let f=0; const ok=(c:any,m:string)=>{console.log((c?"PASS ":"FAIL ")+m); if(!c) f++};
const T0=1_000_000; const mk=()=>{ const s=newSubathon(); subathonOp(s,{op:"start"},T0); return s };
const rem=(s:any,t=T0)=>remaining(s,t);
const u={id:"u1",name:"نورة"};
let s=mk(); const base=rem(s);
subathonOnEvent(s,{type:"follow",id:"f1",user:u},T0); ok(rem(s)-base===60000,"follow +1m");
subathonOnEvent(s,{type:"subscribe",id:"s1",user:u},T0); ok(rem(s)-base===60000+600000,"subscribe +10m");
s=mk(); subathonOnEvent(s,{type:"like",user:u,count:600},T0); ok(rem(s)===rem(mk()),"600 likes: nothing yet");
subathonOnEvent(s,{type:"like",user:u,count:500},T0); ok(rem(s)-base===60000,"1100 likes → +1m (carry 100)");
subathonOnEvent(s,{type:"like",user:u,count:900},T0); ok(rem(s)-base===120000,"carry counted → +1m more");
s=mk(); subathonOnEvent(s,{type:"gift",id:"g1",user:u,gift:"وردة",giftId:5655,diamonds:1,value:3,count:3},T0); ok(rem(s)-base===15000,"3 roses streak → +15s");
s=mk(); subathonOnEvent(s,{type:"gift",id:"g2",user:u,gift:"أسد",giftId:6369,diamonds:29999,value:29999,count:1},T0); ok(rem(s)-base===1800000,"lion +30m");
s=mk(); const lg=subathonOnEvent(s,{type:"gift",id:"g3",user:u,gift:"يونيفرس",giftId:7312,diamonds:44999,value:44999,count:1},T0); ok(rem(s)-base===-3600000&&lg[0].ruleId&&lg[0].kind==="gift"&&lg[0].user==="نورة","universe -60m, log has rule id + user");
s=mk(); subathonOnEvent(s,{type:"gift",id:"g4",user:u,gift:"شيء",giftId:999,diamonds:5,value:5,count:1},T0); ok(rem(s)===base,"unknown gift no rule → no change");
// عدد الهدايا المطلوبة
s=mk(); s.rules.list.find((r:any)=>r.giftId===5655).every=10; subathonOnEvent(s,{type:"gift",user:u,giftId:5655,count:7,value:7},T0); ok(rem(s)===base,"rose every 10: 7 → nothing");
subathonOnEvent(s,{type:"gift",user:u,giftId:5655,count:5,value:5},T0); ok(rem(s)-base===5000,"12 roses → 1 unit");
// الحد الأقصى للتأثير + الانتظار
s=mk(); const lion=s.rules.list.find((r:any)=>r.giftId===6369); lion.maxMs=600000; lion.cooldownMs=5000;
subathonOnEvent(s,{type:"gift",id:"a",user:u,giftId:6369,count:1,value:1},T0); ok(rem(s)-base===600000,"max effect cap 10m");
subathonOnEvent(s,{type:"gift",id:"b",user:u,giftId:6369,count:1,value:1},T0+1000); ok(rem(s,T0+1000)-base===599000,"cooldown blocks second (only time passes)");
// أوامر التعليقات + حماية السبام
s=mk(); for(const r of s.rules.list) if(r.kind==="comment") r.enabled=true;
subathonOnEvent(s,{type:"comment",user:u,text:"زيد"},T0); ok(rem(s)-base===10000,"comment «زيد» +10s");
subathonOnEvent(s,{type:"comment",user:u,text:"زيد"},T0); ok(rem(s)-base===10000,"same user cooldown (spam)");
subathonOnEvent(s,{type:"comment",user:{id:"u2",name:"فهد"},text:"نقص"},T0); ok(rem(s)-base===0,"other user «نقص» -10s");
subathonOnEvent(s,{type:"comment",user:{id:"u3",name:"x"},text:"ما ابي زيد"},T0); ok(rem(s)-base===0,"keyword must be the command, not inside a sentence");
const sp=mk(); const cr=sp.rules.list.find((r:any)=>r.kind==="comment"&&r.keyword==="زيد"); cr.enabled=true; cr.userCooldownMs=0; cr.perMin=3;
for(let i=0;i<10;i++) subathonOnEvent(sp,{type:"comment",user:{id:"x"+i,name:"x"},text:"زيد"},T0+i); ok(rem(sp,T0+9)-base+9===30000,"per-minute cap 3 executions");
// الدونيشن
const d=s.rules.list.find((r:any)=>r.kind==="donation");
ok(donationAction(d,{message:"زيد يا وحش"})==="add"&&donationAction(d,{message:"نقص"})==="sub"&&donationAction(d,{message:"شكرا"})==="add","donation words + default add");
s=mk(); subathonOnDonation(s,{type:"donation",amount:10,currency:"SAR",message:"زيد",name:"زيد"},T0); ok(rem(s)-base===1200000,"10 SAR + زيد → +20m");
s=mk(); subathonOnDonation(s,{type:"donation",amount:10,currency:"SAR",message:"نقص"},T0); ok(rem(s)-base===-600000,"10 SAR + نقص → -10m");
s=mk(); s.rules.list.find((r:any)=>r.kind==="donation").defaultAction="none"; subathonOnDonation(s,{type:"donation",amount:10,currency:"SAR",message:"شكرا"},T0); ok(rem(s)===base,"default none → no change");
s=mk(); subathonOnDonation(s,{type:"donation",amount:10,currency:"USD",message:"زيد"},T0); ok(rem(s)===base,"other currency not counted with SAR rule");
// الغرفة: منع التكرار + الدونيشن
const R=newRoom(); subathonOp(R.C.subathon,{op:"start"},T0); const b0=remaining(R.C.subathon,T0);
roomEvent(R,{type:"donation",id:"don1",provider:"test",test:true,name:"a",amount:5,currency:"SAR",message:"زيد"},T0);
roomEvent(R,{type:"donation",id:"don1",provider:"test",test:true,name:"a",amount:5,currency:"SAR",message:"زيد"},T0);
ok(remaining(R.C.subathon,T0)-b0===600000,"room: donation +10m once (duplicate ignored)");
roomEvent(R,{type:"follow",id:"fx",user:u},T0); roomEvent(R,{type:"follow",id:"fx",user:u},T0); ok(remaining(R.C.subathon,T0)-b0===660000,"room: duplicate follow ignored");
// لا ينزل تحت الصفر
s=mk(); subathonOp(s,{op:"add",ms:-(base-1000),source:"manual"},T0); subathonOnEvent(s,{type:"gift",user:u,giftId:7312,count:1,value:1},T0); ok(rem(s)>=0,"never negative");
// الترقية من الإعدادات القديمة
const old:any=newSubathon(); delete old.rules.list; old.rules.gifts.table=[{giftId:1,name:"x",sec:7}]; old.rules.follow.sec=20; migrateRules(old);
ok(old.rules.list.find((r:any)=>r.kind==="follow").ms===20000&&old.rules.list.find((r:any)=>r.giftId===1).ms===7000,"legacy settings migrated without behavior change");
// اللوحة تقرأ الإعدادات تلقائياً
s=mk(); s.rules.list.find((r:any)=>r.kind==="follow").ms=120000; ok(rulesForBoard(s)[0].text==="\u2066+2\u2069 دقيقة","board text updates from settings");
ok(!rulesForBoard(s).some((x:any)=>x.what.includes("مشاركة")),"disabled rules hidden from board");
s.rules.auto=false; subathonOnEvent(s,{type:"follow",user:u},T0); ok(rem(s)===base,"auto rules switch off");
ok(presetRules("gifts").every((r:any)=>r.enabled===(r.kind==="gift")),"preset: gifts only");
s=newSubathon(); subathonOnEvent(s,{type:"follow",user:u},T0); ok(s.status==="idle"&&remaining(s,T0)===s.initialMs,"not running → no change");
console.log(f?`${f} FAILED`:"ALL PASS"); process.exit(f?1:0);
