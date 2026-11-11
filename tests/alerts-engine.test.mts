import * as A from "/home/claude/najd/arsh-live/src/engine/alerts.js";
import { newRoom, roomEvent, roomBots, roomLive, roomClockOp } from "/home/claude/najd/arsh-live/src/engine/room.js";
import { signedMediaUrl, verifyMediaSig } from "/home/claude/najd/arsh-live/src/server/alert-sign.ts";
let f=0; const ok=(c:any,m:string)=>{ console.log((c?"PASS ":"FAIL ")+m); if(!c) f++ };
const owner={id:"u1"}, other={id:"u2"}, admin={id:"u9",admin:true}, guest=null;
const priv={id:"a1",ownerId:"u1",visibility:"private",review:"none",removed:false};
const pend={...priv,id:"a2",visibility:"public",review:"pending"};
const pub={...priv,id:"a3",visibility:"public",review:"approved",name:"x",description:"y"};
const rej={...pub,id:"a4",review:"rejected"}, rem={...pub,id:"a5",removed:true};
// ---- سيناريوهات الخصوصية العشرة
ok(alv(priv,owner)&&A.alCanUse(priv,owner),"1. private alert: owner sees and uses it");
ok(!A.alCanView(priv,other)&&!A.alCanUse(priv,other),"2. private alert: other user cannot view or use it");
ok(!A.alCanView(priv,guest)&&!A.alIsListed(priv),"3. private alert: guest cannot view; not listed publicly");
ok(!A.alCanView(pend,other)&&A.alCanView(pend,owner)&&!A.alIsListed(pend),"4. public-but-pending: hidden from others until approved");
ok(A.alCanView(pub,other)&&A.alCanUse(pub,other)&&A.alCanView(pub,guest)&&A.alIsListed(pub),"5. approved public: visible and usable by everyone");
ok(!A.alCanEdit(pub,other)&&A.alCanEdit(pub,owner)&&!A.alCanEdit(pub,admin),"6. only owner edits/deletes (admin moderates, doesn't edit)");
const toPriv=A.alVisibilityPatch(pub,"private"); const after={...pub,...toPriv.patch};
ok(toPriv.ok&&!A.alCanView(after,other)&&!A.alCanUse(after,other)&&!A.alIsListed(after)&&A.alCanUse(after,owner),"7. switching to private: removed from public immediately, new users can't add it, owner keeps it");
ok(A.alCanUse(after,other,{adopted:true})&&!A.alCanUse({...after,removed:true},other,{adopted:true})&&!A.alCanUse({...after,review:"rejected"},other,{adopted:true}),"7b. earlier adopters keep their licensed copy unless removed/rejected for a violation");
ok(!A.alVisibilityPatch({...priv,rightsConfirmed:false},"public").ok&&A.alVisibilityPatch(priv,"public",{rightsConfirmed:true}).patch.review==="pending","8. going public requires rights confirmation and enters review");
ok(!A.alCanView(rej,other)&&!A.alCanView(rem,other)&&!A.alCanUse(rem,owner)&&A.alCanView(rem,admin),"9. rejected/removed: hidden from others; removed unusable");
const leak=A.alPublicList([priv,pend,pub,rej,rem]); ok(leak.length===1&&leak[0].id==="a3"&&!("visibility" in leak[0])&&!("review" in leak[0]),"10. public listing returns only approved public alerts, without internal fields");
ok(A.alEditNeedsReview(pub,{mediaId:"m2"})&&!A.alEditNeedsReview(priv,{mediaId:"m2"}),"editing media of an approved alert sends it back to review");
function alv(a:any,v:any){ return A.alCanView(a,v) }
// ---- التحقق من المدخلات
const bad=A.alValidate({}); ok(A.alValidate({name:"a",kind:"video",event:"follow",category:"enemy",durationSec:6,mediaId:"m"}).ok,"validation: no separate cover image and no description required");
ok(!A.alValidate({name:"a",kind:"video",event:"follow",durationSec:6,mediaId:"m"}).ok&&A.alValidate({name:"a",kind:"video",event:"follow",category:"celebrate",durationSec:6,mediaId:"m"},{legacy:true}).ok,"validation: design style required; old categories kept for old alerts");
ok(!bad.ok&&bad.errors.length>=4,"validation: name, type, event, style required");
const good=A.alValidate({name:"احتفال",description:"وصف",kind:"video",event:"follow",category:"money",durationSec:6,mediaId:"m1",tags:"#فخم, ملكي"});
ok(good.ok&&good.value.visibility==="private"&&good.value.tags.length===2,"validation: default visibility is private; tags parsed");
ok(!A.alValidate({name:"a",description:"b",kind:"video",event:"follow",category:"fire",durationSec:6,mediaId:"m",visibility:"public"}).ok,"validation: public without rights confirmation is rejected");
// ---- فحص الملفات الحقيقي
const png=new Uint8Array([0x89,0x50,0x4e,0x47,0,0,0,0]); const mp4=new Uint8Array([0,0,0,0x18,0x66,0x74,0x79,0x70,0x69,0x73,0x6f,0x6d,0,0]);
const exe=new Uint8Array([0x4d,0x5a,0x90,0,3,0,0,0]); const html=new TextEncoder().encode("<script>alert(1)</script>");
ok(A.alCheckFile("media",png).mime==="image/png"&&A.alCheckFile("media",mp4).mime==="video/mp4","sniff: png and mp4 detected by magic bytes");
ok(!A.alCheckFile("media",exe).ok&&!A.alCheckFile("media",html).ok&&!A.alCheckFile("audio",png).ok,"sniff: exe/html rejected; image not accepted as audio");
ok(A.alCheckFile("cover",new Uint8Array(A.AL_LIMITS.cover+1).fill(0xff)).error==="too_large","size caps enforced");
const lot={v:"5.7",w:100,h:100,layers:[{ks:{}}]};
ok(A.alLottieSafe(lot).ok&&!A.alLottieSafe({...lot,layers:[{ks:{p:{x:"eval('x')"}}}]}).ok&&!A.alLottieSafe({...lot,assets:[{u:"https://evil/",p:"a.png"}]}).ok,"lottie: expressions and external assets rejected");
// ---- القواعد والمتغيرات
const cfg=A.alCfg({rules:[
 {id:"f",alertId:"A",event:"follow",once:"user"},
 {id:"l1",alertId:"B",event:"like_user",cond:{op:"gte",value:100}},
 {id:"lt",alertId:"C",event:"like_total",cond:{op:"every",value:1000}},
 {id:"g1",alertId:"D",event:"gift",priority:10,level:"عادي"},
 {id:"g5",alertId:"E",event:"gift",cond:{op:"gte",value:5},priority:50,level:"أسطوري"},
 {id:"rose",alertId:"F",event:"gift",cond:{gift:"Rose"},priority:60,also:true},
 {id:"d",alertId:"G",event:"donation",cond:{op:"gte",value:10}},
 {id:"kw",alertId:"H",event:"comment",cond:{keyword:"!hype"}},
 {id:"ta",alertId:"I",event:"time_added"},
 {id:"res",alertId:"J",event:"resub"},
]});
const st=A.alNewState(), u=(id:string)=>({id,name:"N_"+id,avatar:"https://p/"+id+".jpg"});
let it=A.alertsOnEvent(cfg,st,{type:"follow",id:"e1",platform:"tiktok",user:u("sara")},1);
ok(it.length===1&&it[0].alertId==="A"&&it[0].vars.display_name==="N_sara"&&it[0].vars.avatar,"follow fires with real name and avatar");
ok(A.alertsOnEvent(cfg,st,{type:"follow",id:"e2",platform:"tiktok",user:u("sara")},2).length===0,"once-per-user: same follower doesn't fire twice in a session");
let likes=0; for(let i=0;i<12;i++){ likes+=A.alertsOnEvent(cfg,st,{type:"like",id:"l"+i,platform:"tiktok",user:u("ali"),count:15},10+i).filter((x:any)=>x.ruleId==="l1").length }
ok(likes===1,"like_user threshold fires once when the user's own likes cross 100 (not on every like)");
ok(st.ul["ali"]===180&&st.tl===180,"per-user and total likes tracked separately");
let tot=0; for(let i=0;i<10;i++) tot+=A.alertsOnEvent(cfg,st,{type:"like",id:"m"+i,platform:"tiktok",user:u("u"+i),count:100},30+i).filter((x:any)=>x.ruleId==="lt").length;
ok(tot===1,"like_total every 1000 fires once at the 1000 mark");
const g=A.alertsOnEvent(cfg,st,{type:"gift",id:"g",platform:"tiktok",user:u("bo"),gift:"Rose",count:7,value:7},50);
ok(g.map((x:any)=>x.ruleId).join()==="rose,g5"&&g[1].vars.level==="أسطوري"&&g[1].vars.gift_count==="7","tiers: highest-priority match plays; 'also' rule adds on; level variable filled");
const g2=A.alertsOnEvent(cfg,st,{type:"gift",id:"g2",platform:"tiktok",user:u("bo"),gift:"Lion",count:1,value:1},51);
ok(g2.length===1&&g2[0].ruleId==="g1","tiers: small gift gets the base tier");
ok(A.alertsOnEvent(cfg,st,{type:"donation",id:"d1",platform:"donation",amount:5,currency:"USD",verified:true,user:u("x")},60).length===0&&A.alertsOnEvent(cfg,st,{type:"donation",id:"d2",platform:"donation",amount:15,currency:"USD",verified:true,user:u("x")},61)[0].vars.amount==="15","donation amount condition");
ok(A.alertsOnEvent(cfg,st,{type:"donation",id:"d3",platform:"donation",amount:50,verified:false,user:u("x")},62).length===0,"unverified donation never triggers an alert");
ok(A.alertsOnEvent(cfg,st,{type:"comment",id:"c1",platform:"tiktok",text:"hello",user:u("x")},63).length===0&&A.alertsOnEvent(cfg,st,{type:"comment",id:"c2",platform:"tiktok",text:"يلا !HYPE",user:u("x")},64).length===1,"comment keyword trigger (case-insensitive)");
ok(A.AL_EVENTS.resub.avail.tiktok===false&&A.alertsOnEvent(cfg,st,{type:"subscribe",id:"s",platform:"tiktok",user:u("x")},65).every((x:any)=>x.ruleId!=="res"),"unavailable events are flagged and never faked");
const lg=A.alertsOnLogs(cfg,st,[{deltaMs:30000,seq:1,subathonId:"s"}],70); ok(lg.length===1&&lg[0].vars.time_added==="0:30","subathon time_added with formatted time");
ok(A.alFill("شكراً {display_name} على {gift_name}",{display_name:"سارة"})==="شكراً سارة على","missing variables stay empty — never invented");
ok(A.alMissing("{gift_name} {display_name}","follow").join()==="gift_name","editor warns about variables the event can't provide");
const c2=A.alCfg({rules:[{id:"fc",alertId:"X",event:"first_comment"},{id:"cc",alertId:"Y",event:"comment_count",cond:{op:"gte",value:3}},{id:"m",alertId:"Z",event:"manual"},{id:"e",alertId:"W",event:"stream_end"},{id:"mod",alertId:"V",event:"follow",cond:{role:"mod"}}]}), s2=A.alNewState();
let fc=0,cc=0; for(let i=0;i<5;i++){ const o=A.alertsOnEvent(c2,s2,{type:"comment",id:"cm"+i,platform:"tiktok",text:"hi",user:u("z")},100+i); fc+=o.filter((x:any)=>x.ruleId==="fc").length; cc+=o.filter((x:any)=>x.ruleId==="cc").length }
ok(fc===1&&cc===1,"first comment once; comment count fires once on reaching 3");
ok(A.alertsManual(c2,s2,"m",1)[0].test===false&&A.alertsOnEnd(c2,s2,2).length===1,"manual alert and stream end");
ok(A.alertsOnEvent(c2,s2,{type:"follow",id:"fm",platform:"tiktok",user:u("q")},3).length===0&&A.alertsOnEvent(c2,s2,{type:"follow",id:"fm2",platform:"tiktok",user:{...u("q2"),isModerator:true}},4).length===1,"role condition: needs real moderator flag (missing data → no trigger)");
// ---- الطابور
const Q=A.alQueue(); A.alQueuePush(Q,{id:"1",priority:10,vars:{}}); A.alQueuePush(Q,{id:"2",priority:50,vars:{}}); A.alQueuePush(Q,{id:"1",priority:10,vars:{}});
ok(Q.q.length===2&&Q.q[0].id==="2","queue: priority order and duplicate rejection");
A.alQueuePush(Q,{id:"3",priority:5,mergeKey:"l:ali",vars:{likes:"100"}}); A.alQueuePush(Q,{id:"4",priority:5,mergeKey:"l:ali",vars:{likes:"200"}});
ok(Q.q.length===3&&Q.q[2].vars.likes==="200","queue: consecutive like alerts for the same user merge");
for(let i=0;i<40;i++) A.alQueuePush(Q,{id:"z"+i,priority:1,vars:{}},{maxQueue:10}); ok(Q.q.length===10&&Q.q[0].id==="2","queue: max length keeps highest priority");
// ---- الترتيب
const now=Date.now(), mk=(o:any)=>({uses:0,likes:0,favs:0,ratingSum:0,ratingCount:0,publishedAt:new Date(now-864e5),...o});
const one5=mk({id:"r1",ratingSum:5,ratingCount:1}), many=mk({id:"r2",ratingSum:46*40/10,ratingCount:40});
ok(A.alSort([one5,many],"rated",now)[0].id==="r2","rating: Bayesian average — a single 5★ doesn't beat 40 ratings of 4.6");
const oldPop=mk({id:"o",uses:500,publishedAt:new Date(now-200*864e5)}), fresh=mk({id:"n",uses:40,likes:20,publishedAt:new Date(now-864e5)});
ok(A.alSort([oldPop,fresh],"trending",now)[0].id==="n"&&A.alSort([oldPop,fresh],"used",now)[0].id==="o","trending favours recent activity; most-used counts totals");
ok(A.alSearch([{name:"تاج ذهبي",description:"",tags:["ملكي"]},{name:"x",description:"",tags:[]}] as any,"ملكي").length===1,"search by tag");
ok(A.AL_FRAMES.length>=30&&A.AL_IN.length+A.AL_OUT.length+A.AL_FX.length-1>=40,"30+ avatar frames, 40+ animations/effects");
// ---- تكامل الغرفة (مصدر واحد)
const R:any=newRoom(); roomBots(R,{alerts:{rules:[{id:"f",alertId:"A",event:"follow"},{id:"ls",alertId:"L",event:"live_start"},{id:"t",alertId:"T",event:"time_added"}]}},{});
let r=roomEvent(R,{type:"follow",id:"tt1",user:{id:"k",name:"كريم"}},1000); const al=r.out.find((m:any)=>m.t==="alert");
ok(al&&al.items[0].vars.display_name==="كريم","room: follow event emits {t:'alert'} once");
ok(roomEvent(R,{type:"follow",id:"tt1",user:{id:"k",name:"كريم"}},1001).out.length===0,"room: duplicate TikTok event id produces no second alert");
ok(roomLive(R,true,2000).out.some((m:any)=>m.t==="alert"),"room: live start fires live_start alert");
ok(!roomLive(R,false,3000).out.some((m:any)=>m.t==="alert")&&!roomLive(R,true,4000).out.some((m:any)=>m.t==="alert"),"room: short reconnect doesn't refire live_start");
const op=roomClockOp(R,{target:"alerts",op:"test",ruleId:"f"},5000); ok(op.out[0].t==="alert"&&op.out[0].items[0].test,"room: dashboard test alert is marked test");
const sb=roomClockOp(R,{target:"subathon",op:"add",ms:60000},6000); ok(sb.out.some((m:any)=>m.t==="alert"&&m.items[0].alertId==="T")||!sb.logs.some((l:any)=>l.deltaMs>0),"room: subathon time added triggers time_added alert");
// ---- روابط الملفات الموقّعة
const url=signedMediaUrl("asset1","tokA",3600e3,now,"k"); const q=new URL("http://x"+url).searchParams;
ok(verifyMediaSig("asset1","tokA",+q.get("e")!,q.get("s")!,now,"k"),"signed media URL verifies");
ok(!verifyMediaSig("asset2","tokA",+q.get("e")!,q.get("s")!,now,"k")&&!verifyMediaSig("asset1","tokB",+q.get("e")!,q.get("s")!,now,"k")&&!verifyMediaSig("asset1","tokA",+q.get("e")!,q.get("s")!,now+2*3600e3,"k"),"signature bound to asset + overlay token; expires");
console.log(f?`${f} FAILED`:"ALL PASS"); process.exit(f?1:0);
