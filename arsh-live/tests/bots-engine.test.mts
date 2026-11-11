import { defaultBots, newBotState, botsOnEvent, botsTick, normAr, moderate, fillTpl, botVars, vqPush, vqNext } from "../arsh-live/src/engine/bots.js";
import { newRoom, roomEvent, roomBots, roomTick } from "../arsh-live/src/engine/room.js";
import { subathonOp } from "../arsh-live/src/engine/clock.js";
import { newWidget } from "../arsh-live/src/engine/defs.js";
let f=0; const ok=(c:any,m:string)=>{console.log((c?"PASS ":"FAIL ")+m); if(!c) f++};
const T=1_000_000; const u=(n:string,o:any={})=>({id:n,name:n,avatar:"",...o});
const cfg:any=defaultBots(); cfg.status.reader=true;
const R:any=newRoom(); subathonOp(R.C.subathon,{op:"start"},T);
const layout={widgets:[newWidget("goal",{target:5000}),newWidget("sgoal",{source:"gift",giftKey:"6369",title:"هدف الأسد",target:10})]};
roomBots(R,cfg,{layout,socials:{accounts:[{id:"a",kind:"social",platform:"tiktok",username:"btot",enabled:true},{id:"b",kind:"game",platform:"roblox",fields:{username:"btot_rb"},enabled:true}]}});
const ev=(e:any)=>{ const r=roomEvent(R,{id:"e"+Math.random(),...e},T); return (r.out.find((x:any)=>x.t==="bot")||{items:[]}).items };
ok(normAr("إأآ السَّلامُ عليكمـــ")==="ااا السلام عليكم","arabic normalize (hamza, tashkeel, tatweel)");
let o=ev({type:"comment",user:u("محمد"),text:"السلام عليكم"}); ok(o.some((x:any)=>x.kind==="reply"&&x.text.includes("وعليكم السلام")),"greeting auto-reply");
o=ev({type:"comment",user:u("محمد"),text:"السلام عليكم"}); ok(!o.some((x:any)=>x.kind==="reply"),"once per user + duplicate filter");
o=ev({type:"comment",user:u("سارة"),text:"السلامُ عليكم يا شباب"}); ok(o.some((x:any)=>x.kind==="reply"),"match ignores tashkeel");
o=ev({type:"comment",user:u("فهد"),text:"!وقت"}); const t=o.find((x:any)=>x.kind==="cmd"); ok(t&&/ساعت|ساعة/.test(t.text),"!وقت reads the real subathon: "+(t&&t.text));
o=ev({type:"comment",user:u("ريم"),text:"!وقت"}); ok(!o.some((x:any)=>x.kind==="cmd"),"command cooldown");
o=ev({type:"comment",user:u("خالد"),text:"!تكبيس"}); ok(o[0]&&o[0].text.includes("5,000"),"!تكبيس uses real likes goal: "+o[0]?.text);
o=ev({type:"comment",user:u("x1"),text:"!متصدر"}); ok(o[0]&&o[0].text.includes("ما فيه داعمين"),"no data → honest fallback (no fake value)");
ev({type:"gift",user:u("نورة"),gift:"أسد",giftId:6369,diamonds:29999,value:29999,count:1});
o=ev({type:"comment",user:u("x2"),text:"!هدف"}); ok(o[0]&&o[0].text.includes("1 / 10"),"!هدف live: "+o[0]?.text);
o=ev({type:"comment",user:u("x3"),text:"!روبلوكس"}); ok(o[0]&&o[0].text.includes("btot_rb"),"!روبلوكس from socials");
// الشكر
o=ev({type:"gift",user:u("علي"),gift:"وردة",giftId:5655,diamonds:1,value:10,count:10}); ok(o[0]&&o[0].text.includes("10")&&o[0].text.includes("وردة")&&o[0].prio===3,"gift thanks with count + name");
o=ev({type:"gift",user:u("خالد2"),gift:"أسد",giftId:6369,diamonds:29999,value:29999,count:1}); ok(o[0]&&o[0].text.includes("الأسد وصل"),"special lion message");
const R2:any=newRoom(); roomBots(R2,defaultBots(),{}); const o2=(roomEvent(R2,{id:"g",type:"gift",user:u("أ"),giftId:5655,gift:"وردة",value:1,count:1},T).out.find((x:any)=>x.t==="bot")||{items:[]}).items; ok(o2[0]&&o2[0].text.includes("أول دعم"),"first support message");
o=ev({type:"donation",id:"d1",provider:"test",test:true,name:"سلمان",amount:50,currency:"SAR",message:""}); ok(o[0]&&o[0].text.includes("50 ريال")&&o[0].test,"donation thanks (marked test)");
o=ev({type:"follow",user:u("أحمد")}); ok(o[0]&&o[0].text.includes("أحمد"),"follow message");
o=ev({type:"subscribe",user:u("مها")}); ok(o[0]&&o[0].text.includes("مها"),"subscribe message");
// الفلترة
const st=newBotState(); const c2:any=defaultBots(); c2.mod.banned="كلمةسيئة";
ok(!moderate(c2,st,{user:u("a"),text:"هذي كلمةسيئة"},T).ok,"banned word blocked");
ok(moderate(c2,st,{user:u("b"),text:"شوفوا https://x.com/abc الحين"},T).text==="شوفوا الحين","links removed");
ok(moderate(c2,st,{user:u("c"),text:"رقمي 0551234567"},T).text==="رقمي","phone removed");
ok(moderate(c2,st,{user:u("d"),text:"هههههههههه"},T).text==="هه","repeated chars collapsed");
c2.mod.blockedUsers="@troll"; ok(!moderate(c2,st,{user:u("troll"),text:"مرحبا"},T).ok,"blocked user");
// القارئ
o=ev({type:"comment",user:u("قارئ"),text:"كيف الحال 😀 https://a.com"}); const rd=o.find((x:any)=>x.kind==="read"); ok(rd&&rd.speech==="قارئ يقول: كيف الحال","reader: name + clean speech");
o=ev({type:"comment",user:u("مشرف",{mod:true}),text:"تنبيه للجميع"}); ok(o.find((x:any)=>x.kind==="read")?.prio===3,"moderator priority");
// المتغيرات الغائبة
ok(fillTpl("x {likes_level}",{likes_level:null})===null,"missing var → null");
// قائمة الانتظار
const q:any[]=[]; const Q={max:3,expireSec:60,noSameUserRow:true,fair:true};
vqPush(q,{speech:"a",prio:0,at:T,user:{name:"u1"},kind:"read"},Q); vqPush(q,{speech:"b",prio:0,at:T+1,user:{name:"u1"},kind:"read"},Q); vqPush(q,{speech:"c",prio:3,at:T+2,user:{name:"m"},kind:"read"},Q);
vqPush(q,{speech:"d",prio:0,at:T+3,user:{name:"u2"},kind:"read"},Q); ok(q.length===3,"queue max drops lowest priority");
vqPush(q,{speech:"c",prio:3,at:T+4,user:{name:"m"},kind:"read"},Q); ok(q.length===3,"same speech not queued twice");
ok(vqNext(q,Q,null,T+5).speech==="c","highest priority first");
ok(vqNext(q,Q,"u1",T+6).user.name==="u2","fair: avoids same user twice in a row");
const q2:any[]=[{speech:"old",prio:0,at:T,kind:"read",user:{name:"z"}}]; ok(vqNext(q2,Q,null,T+61000)===null,"expired comment dropped");
// الرسائل الدورية
const R3:any=newRoom(); const c3:any=defaultBots(); roomBots(R3,c3,{forceLive:true}); R3.C.timers[0].startedAt=T;
for(let i=0;i<3;i++) roomEvent(R3,{id:"c"+i,type:"comment",user:u("u"+i),text:"هلا "+i},T+5*60000);
let per=(roomTick(R3,T+5*60000+30000).out.find((x:any)=>x.t==="bot")||{items:[]}).items; ok(per[0]&&per[0].text.includes("الفولو"),"periodic: after 5 min with active chat");
per=(roomTick(R3,T+5*60000+40000).out.find((x:any)=>x.t==="bot")||{items:[]}).items; ok(!per.length,"periodic respects gap");
const R4:any=newRoom(); roomBots(R4,defaultBots(),{forceLive:true}); per=(roomTick(R4,T+3600000).out.find((x:any)=>x.t==="bot")||{items:[]}).items; ok(!per.length,"periodic: silent chat → no message");
// الدخول
cfg.status.welcome=true; o=ev({type:"join",user:u("زائر")}); ok(o[0]&&o[0].text.includes("زائر"),"welcome on join"); o=ev({type:"join",user:u("زائر")}); ok(!o.length,"welcome once per user");
// عدم التكرار للحدث نفسه
const R5:any=newRoom(); roomBots(R5,defaultBots(),{}); const a=roomEvent(R5,{id:"same",type:"follow",user:u("p")},T), b=roomEvent(R5,{id:"same",type:"follow",user:u("p")},T);
ok(a.out.some((x:any)=>x.t==="bot")&&!b.out.some((x:any)=>x.t==="bot"),"duplicate event → no second bot output");
console.log(f?`${f} FAILED`:"ALL PASS"); process.exit(f?1:0);
