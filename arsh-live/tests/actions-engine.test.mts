import { actionsOnEvent, newActState, newActRule } from "/home/claude/najd/arsh-live/src/engine/actions.js";
import { newRoom, roomEvent, roomBots, roomClockOp } from "/home/claude/najd/arsh-live/src/engine/room.js";
let f=0; const ok=(c:any,m:string)=>{ console.log((c?"PASS ":"FAIL ")+m); if(!c) f++ };
const A=newActState(); let now=1e6;
const R=(o:any)=>newActRule(o);
const rules=[R({id:"rose",name:"وردة",trigger:{type:"gift",giftId:"5655"},actions:[{t:"text",text:"شكراً {user} على {gift}"}]}),
 R({id:"big",name:"كبيرة",priority:9,trigger:{type:"giftValue",minValue:1000},actions:[{t:"celebrate",text:"🎉"}]}),
 R({id:"likes",name:"لايكات",trigger:{type:"likes",every:100},actions:[{t:"subAdd",sec:10}]}),
 R({id:"kw",name:"كلمة",trigger:{type:"keyword",text:"زيد, more"},actions:[{t:"reply",text:"تم"}]}),
 R({id:"cmd",name:"أمر",trigger:{type:"command",text:"!رقصة"},conds:{mode:"and",list:[{k:"perm",v:"mods"}]},actions:[{t:"gif",src:"https://x/y.gif"}]}),
 R({id:"don",name:"دعم",trigger:{type:"donation",minAmount:5},actions:[{t:"tts",text:"شكراً {user} على {amount}"}]}),
 R({id:"cd",name:"انتظار",trigger:{type:"follow"},cooldownSec:30,actions:[{t:"sound",src:"https://x/a.mp3"}]}),
 R({id:"or",name:"أو",trigger:{type:"comment"},enabled:false,actions:[]})];
const ev=(o:any)=>({user:{id:"u",name:"محمد"},platform:"tiktok",...o});
let r=actionsOnEvent(A,rules,ev({type:"gift",giftId:5655,gift:"وردة",value:1}),{now});
ok(r.length===1&&r[0].actions[0].text==="شكراً محمد على وردة","specific gift trigger + template filled");
r=actionsOnEvent(A,rules,ev({type:"gift",giftId:5655,gift:"وردة",value:1500}),{now});
ok(r.length===2&&r[0].rule.id==="big","priority: higher priority rule runs first");
r=actionsOnEvent(A,rules,ev({type:"like",count:60}),{now}); ok(r.length===0,"likes: below 100 accumulates");
r=actionsOnEvent(A,rules,ev({type:"like",count:250}),{now}); ok(r.length===1&&r[0].mult===3,"likes: every 100 → multiplier 3 (310 likes)");
ok(actionsOnEvent(A,rules,ev({type:"comment",text:"زيد الوقت"}),{now}).length===1&&actionsOnEvent(A,rules,ev({type:"comment",text:"please MORE"}),{now}).length===1,"keyword trigger (Arabic + English, case-insensitive)");
ok(actionsOnEvent(A,rules,ev({type:"comment",text:"!رقصة"}),{now}).length===0&&A.log[0].reason.includes("الشروط"),"command blocked for viewers (permission) + logged reason");
ok(actionsOnEvent(A,rules,ev({type:"comment",text:"!رقصة",user:{id:"m",name:"مشرف",mod:true}}),{now}).length===1,"command allowed for moderator");
ok(actionsOnEvent(A,rules,ev({type:"donation",name:"نورة",amount:3}),{now}).length===0&&actionsOnEvent(A,rules,ev({type:"donation",name:"نورة",amount:10,user:undefined}),{now})[0].actions[0].text==="شكراً نورة على 10","donation min amount + name");
ok(actionsOnEvent(A,rules,ev({type:"follow"}),{now}).length===1&&actionsOnEvent(A,rules,ev({type:"follow"}),{now:now+5000}).length===0&&A.log[0].reason.includes("الانتظار"),"cooldown enforced + logged");
const lim=[R({id:"lim",trigger:{type:"share"},maxPerMin:2,actions:[{t:"text",text:"x"}]})]; const B=newActState();
ok([1,2,3].map(i=>actionsOnEvent(B,lim,ev({type:"share"}),{now:now+i}).length).join()==="1,1,0","max per minute");
const orR=[R({id:"o",trigger:{type:"gift"},conds:{mode:"or",list:[{k:"minValue",v:500},{k:"users",v:"@vip"}]},actions:[{t:"text",text:"x"}]})];
ok(actionsOnEvent(newActState(),orR,ev({type:"gift",value:1,user:{id:"vip",name:"VIP"}}),{now}).length===1&&actionsOnEvent(newActState(),orR,ev({type:"gift",value:1}),{now}).length===0,"OR conditions (min value OR user list)");
const g=[R({id:"g",trigger:{type:"goal",metric:"likes",target:1000},actions:[{t:"celebrate"}]})]; const G=newActState();
ok(actionsOnEvent(G,g,ev({type:"like"}),{now,totals:{likes:900}}).length===0&&actionsOnEvent(G,g,ev({type:"like"}),{now,totals:{likes:1001}}).length===1&&actionsOnEvent(G,g,ev({type:"like"}),{now,totals:{likes:1500}}).length===0,"goal trigger fires once when crossing target");
// الغرفة
const RM=newRoom(); roomBots(RM,{actions:[R({id:"s",name:"وقت",trigger:{type:"gift",giftId:"5655"},actions:[{t:"subAdd",sec:60},{t:"songSkip"},{t:"text",text:"+1 دقيقة"},{t:"image"}]})]},{});
roomClockOp(RM,{target:"subathon",op:"start"},1e6);
const out=roomEvent(RM,{type:"gift",id:"gg1",user:{id:"a",name:"فهد"},gift:"وردة",giftId:5655,count:1,value:1},1e6+1000).out;
ok(out.some((m:any)=>m.t==="clock"&&m.logs?.some((l:any)=>/⚡/.test(l.reason||l.r||JSON.stringify(l)))),"room: action adds subathon time (logged with rule name)");
ok(out.some((m:any)=>m.t==="act"&&m.items.some((i:any)=>i.kind==="text"&&i.text==="+1 دقيقة")),"room: text shown on media widget");
const lg=out.find((m:any)=>m.t==="actlog").log[0]; ok(lg.ok===false&&/songSkip/.test(lg.reason)&&/image/.test(lg.reason),"execution log: failures with reasons (no song, no image file)");
console.log(f?`${f} FAILED`:"ALL PASS"); if(f) process.exit(1);
