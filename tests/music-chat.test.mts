// بوت الأغاني من الشات: رسائل بنفس حمولات المنصات الرسمية ← المحوّلات الحقيقية ← مركز البث ← معالج الأوامر الموحد
import { WebSocketServer } from "/opt/npm-tools/node_modules/ws/wrapper.mjs";
import { createHub } from "/home/claude/najd/arsh-live/src/server/live-hub.ts";
import { userOf } from "/home/claude/najd/arsh-live/src/server/tiktok.ts";
import { twitchToEvent, youtubeToEvents, kickToEvent, chatSendRequest } from "/home/claude/najd/arsh-live/src/engine/platforms.js";
import { musicCmds, musicCmdConflicts, parseMusicCmd, defaultMusicCmds } from "/home/claude/najd/arsh-live/src/engine/music.js";
let f=0; const ok=(c:any,m:string)=>{ console.log((c?"PASS ":"FAIL ")+m); if(!c) f++ };
const lib=[{id:"a",title:"فوق هام السحب",artist:"محمد عبده",dur:240},{id:"b",title:"Blinding Lights",artist:"The Weeknd",dur:200},{id:"c",title:"الأماكن",artist:"محمد عبده",dur:300},{id:"d",title:"Levitating",artist:"Dua Lipa",dur:203},{id:"e",title:"Save Your Tears",artist:"The Weeknd",dur:215},{id:"g",title:"تخيل",artist:"راشد الماجد",dur:250}];
const replies:any[]=[]; const wss=new WebSocketServer({port:39611});
const ROOM="ovl_chatbot_room1";
const hub:any=createHub(wss as any,{ authorize:async()=>false, loadMusic:async()=>lib, onChatReply:(room:string,platform:string,text:string)=>replies.push({room,platform,text}) });
const R=await hub.musicInfo(ROOM).then(()=>hub.rooms.get(ROOM));
const setCfg=(music:any)=>{ R.botCfg={music:{cooldownSec:0,perUser:5,noRepeatMin:0,dupSec:8,skipCooldownSec:5,...music}} };
setCfg({});
const M=()=>R.C.music;
let n=0;
const seen:any[]=[]; const orig=hub.dispatch;
const send=(ev:any)=>{ const before=M()?M().log.length:0; hub.dispatch(ROOM,ev); };
const lastReply=()=>{ const r=replies[replies.length-1]; return r?r.text:"" };
// TikTok: نفس شكل حدث المكتبة (userOf الحقيقي) — صاحب البث يُعرف من اسم الحساب المتصل
const tt=(uniqueId:string,nickname:string,comment:string,extra:any={})=>{ const d={comment,user:{uniqueId,nickname,profilePictureUrl:"https://p/x.jpg",...(extra.user||{})},...extra.d}; const u:any=userOf(d); if(uniqueId==="host_user") u.owner=true; return {type:"comment",id:"tt"+(++n),user:u,text:comment} };
const yt=(id:string,name:string,text:string,a:any={})=>youtubeToEvents([{id:"yt"+(++n),snippet:{type:"textMessageEvent",displayMessage:text,publishedAt:new Date().toISOString()},authorDetails:{channelId:id,displayName:name,profileImageUrl:"",isChatModerator:!!a.mod,isChatOwner:!!a.owner,isChatSponsor:false}}])[0];
const tw=(id:string,login:string,text:string,badges:string[]=[])=>twitchToEvent({metadata:{message_id:"tw"+(++n),message_type:"notification",subscription_type:"channel.chat.message"},payload:{subscription:{type:"channel.chat.message"},event:{message_id:"twm"+n,chatter_user_id:id,chatter_user_name:login,message:{text},badges:badges.map(b=>({set_id:b}))}}});
const kk=(id:number,username:string,content:string,badges:string[]=[])=>kickToEvent("chat.message.sent",{message_id:"k"+(++n),broadcaster:{user_id:1},sender:{user_id:id,username,profile_picture:"",identity:{badges:badges.map(type=>({type}))}},content},"km"+n);
const wait=(ms=30)=>new Promise(r=>setTimeout(r,ms));

// ===== 1) طلب من شات TikTok =====
send(tt("nora_22","نورة ✨","!شغل فوق هام السحب")); await wait();
ok(M().current&&M().current.track.title==="فوق هام السحب","TikTok: «!شغل فوق هام السحب» → received, command recognized, song name extracted, found, playing");
ok(M().current.by.name==="نورة ✨"&&M().current.by.platform==="tiktok"&&M().current.by.via==="chat","requester name from the TikTok account (no name/username typed)");
const scr=R.__lastBot;
// ===== 2) YouTube / Twitch / Kick: نفس المعالج =====
send(yt("UC123","Sara YT","!طلب blinding lights")); await wait();
ok(M().queue.at(-1).track.title==="Blinding Lights"&&M().queue.at(-1).by.platform==="youtube"&&M().queue.at(-1).by.name==="Sara YT","YouTube Live chat → queued with YouTube name + platform");
ok(replies.some(r=>r.platform==="youtube"&&/تمت إضافة «Blinding Lights».*رقم 1.*@Sara YT/.test(r.text)),"YouTube: confirmation sent back to YouTube chat: "+(replies.find(r=>r.platform==="youtube")||{}).text);
send(tw("555","ali_tw","!song levitating")); await wait();
ok(M().queue.at(-1).track.title==="Levitating"&&M().queue.at(-1).by.platform==="twitch"&&replies.some(r=>r.platform==="twitch"&&/Levitating.*@ali_tw/.test(r.text)),"Twitch chat (EventSub) → queued + reply in Twitch chat");
send(kk(77,"kicker","!sr الاماكن")); await wait();
ok(M().queue.at(-1).track.title==="الأماكن"&&M().queue.at(-1).by.platform==="kick"&&replies.some(r=>r.platform==="kick"&&/الأماكن/.test(r.text)),"Kick chat (webhook) → queued (hamza-insensitive search) + reply in Kick chat");
ok(!replies.some(r=>r.platform==="tiktok"),"TikTok: no chat-send attempt (TikTok has no send API) — reply shown on screen only");
ok(M().queue.map((q:any,i:number)=>`${i+1}:${q.track.title}:${q.by.platform}`).join("|")==="1:Blinding Lights:youtube|2:Levitating:twitch|3:الأماكن:kick","central queue: order, title, requester platform");

// ===== 3) الصلاحيات =====
// نتحقق من رد الرفض عبر سجل الرسائل المبثوثة: نستخدم عميل ws للقراءة
const { WebSocket } = await import("/opt/npm-tools/node_modules/ws/wrapper.mjs");
const cl=new WebSocket("ws://127.0.0.1:39611"); const msgs:any[]=[]; cl.on("message",(d:any)=>msgs.push(JSON.parse(String(d)))); await new Promise(r=>cl.on("open",r)); cl.send(JSON.stringify({t:"join",room:ROOM})); await wait(150);
const botSaid=()=>msgs.filter(m=>m.t==="bot").flatMap(m=>m.items).map((i:any)=>i.text);
send(tt("viewer2","زائر","!سكب")); await wait(80);
ok(M().current.track.title==="فوق هام السحب"&&botSaid().some(t=>/@زائر ما عندك صلاحية لأمر !سكب/.test(t)),"viewer «!سكب» (skip, mods only) → refused with a clear message");
send(tw("9","mod_tw","!skip",["moderator"])); await wait(80);
ok(M().current.track.title==="Blinding Lights"&&botSaid().some(t=>/⏭ @mod_tw تخطى «فوق هام السحب».*التالية: «Blinding Lights»/.test(t)),"Twitch moderator badge → skip allowed → next song");
send(yt("UCm","YT Mod","!تخطي",{mod:true})); await wait(80);
ok(M().current.track.title==="Blinding Lights","second skip within 5 s ignored (no chained skipping)");
send(tt("host_user","صاحب البث","!وقف")); await wait(80);
ok(M().paused===true,"TikTok broadcaster (connected account) → owner permission → pause");
send(tt("viewer3","x","!كمل")); await wait(80); ok(M().paused===true,"viewer cannot resume");
send(kk(1,"streamer","!كمل",["broadcaster"])); await wait(80); ok(M().paused===false,"Kick broadcaster badge → resume");
// متابع (TikTok يرسل followRole)
setCfg({cmds:{...defaultMusicCmds(),request:{on:true,words:["!شغل"],perm:"followers",users:""}}});
send(tt("nf","غير متابع","!شغل تخيل")); await wait(80); ok(!M().queue.some((q:any)=>q.track.id==="g"),"followers-only request: non-follower refused");
send(tt("fl","متابعة","!شغل تخيل",{d:{followRole:1}})); await wait(80); ok(M().queue.some((q:any)=>q.track.id==="g"&&q.by.name==="متابعة"),"TikTok followRole=1 → follower → accepted");
// أشخاص محددون
setCfg({cmds:{...defaultMusicCmds(),skip:{on:true,words:["!تخطي"],perm:"custom",users:"@sami, lina"}}});
send(tt("other","غيره","!تخطي")); await wait(80); const cur1=M().current.track.title; ok(cur1==="Blinding Lights","custom list: user not in list refused");
await wait(5100); send(tt("sami","سامي","!تخطي")); await wait(80); ok(M().current.track.title!=="Blinding Lights","custom list: @sami allowed");

// ===== 4) تخصيص الأوامر =====
const custom={...defaultMusicCmds(),request:{on:true,words:["!غني","!شغل"],perm:"all",users:""},skip:{on:true,words:["!سكب"],perm:"all",users:""},pause:{on:true,words:["!اسكت"],perm:"all",users:""}};
setCfg({cmds:custom}); await wait(5100);
send(tt("u7","هند","!غني save your tears")); await wait(80); ok(M().queue.some((q:any)=>q.track.id==="e"&&q.by.name==="هند"),"renamed command «!غني» works");
const was=M().current.track.title; send(tt("u8","x8","!تخطي")); await wait(80); ok(M().current.track.title===was,"old word «!تخطي» no longer skips after renaming to «!سكب»");
send(tt("u9","x9","!سكب")); await wait(80); ok(M().current.track.title!==was,"«!سكب» skips (permission set to everyone)");
send(tt("u10","x10","!اسكت")); await wait(80); ok(M().paused,"«!اسكت» pauses");
setCfg({cmds:{...custom,pause:{on:false,words:["!اسكت"],perm:"all",users:""}}}); M().paused=false; send(tt("u11","x11","!اسكت")); await wait(80); ok(!M().paused,"disabled command ignored");
ok(musicCmdConflicts({...custom,queue:{on:true,words:["!غني"],perm:"all"}}).length===1&&musicCmdConflicts(custom).length===0,"conflict detection (same word for two functions)");
ok(parseMusicCmd("!أغنية الاماكن",musicCmds({}))?.cmd==="request"&&parseMusicCmd("مرحبا !شغل",musicCmds({}))===null,"aliases normalized (أ/ا); command must start the message");
ok(musicCmds({perms:{request:"followers",info:"all",skip:"mods",control:"owner",vote:"all"}}).skip.perm==="mods","old saved permissions migrated to per-command settings");

// ===== 5) منع الإزعاج =====
setCfg({cooldownSec:30,perUser:2,maxQueue:20}); await wait(10);
const qlen=()=>M().queue.length; const L0=qlen();
send(tt("sp","سبام","!شغل تخيل")); send(tt("sp","سبام","!شغل تخيل")); await wait(80);
ok(qlen()<=L0+1,"same message twice quickly → processed once");
send(tt("sp","سبام","!شغل levitating")); await wait(80); ok(botSaid().some(t=>/@سبام انتظر/.test(t))||botSaid().some(t=>/@سبام .*موجودة/.test(t)),"cooldown between the same person's requests");
send(tt("nn","فاضي","!شغل")); await wait(80); ok(botSaid().some(t=>/@فاضي اكتب اسم الأغنية بعد الأمر: !شغل اسم الأغنية/.test(t)),"incomplete command (no song name) → not executed, usage hint");
const c1=botSaid().length; send(tt("nn","فاضي","!شغل ")); send(tt("nn","فاضي","!شغل  ")); await wait(80); ok(botSaid().length===c1,"repeated refusals to the same person are throttled (no chat flooding)");
send(tt("q1","سائل","!شغل اغنية غير موجودة ابدا")); await wait(80); ok(botSaid().some(t=>/ما لقيت «اغنية غير موجودة ابدا»/.test(t)),"song not in library → clear reply, nothing queued");
setCfg({cooldownSec:0,perUser:5,maxQueue:1}); send(tt("mq","ممتلئ","!شغل فوق هام")); await wait(80); ok(botSaid().some(t=>/ممتلئة/.test(t)),"max queue length → stop accepting");
setCfg({cooldownSec:0}); const dupT=M().queue[0]&&M().queue[0].track.title; if(dupT){ send(tt("dd","مكرر","!شغل "+dupT)); await wait(80); ok(botSaid().some(t=>/موجودة في القائمة/.test(t)),"same song already in queue → refused") }
// حذف الطلب
send(tt("rm","حاذف","!شغل فوق هام")); await wait(80); const before=qlen(); send(tt("rm","حاذف","!حذف")); await wait(80);
ok(qlen()===before-1&&botSaid().some(t=>/@حاذف حذف طلبه «فوق هام السحب»/.test(t)),"«!حذف» removes the viewer's own last request");
send(tt("rm2","آخر","!حذف 1")); await wait(80); ok(botSaid().some(t=>/تقدر تحذف طلبك أنت فقط/.test(t)),"viewer cannot delete someone else's request");
send(tt("ls","مستعرض","!قائمتي")); await wait(80); ok(botSaid().some(t=>/^📋 1\. /.test(t)),"«!قائمتي» shows the waiting list");
// المنصة معطّلة
setCfg({platforms:{tiktok:true,youtube:false,twitch:true,kick:true}}); const ql=qlen(); send(yt("UCx","Off","!شغل تخيل")); await wait(80); ok(qlen()===ql,"platform disabled in settings → its commands ignored");
// رسائل تجريبية لا تُرسل للمنصات
const rc=replies.length; hub.dispatch(ROOM,{...tw("1","t","!queue"),test:true}); await wait(80); ok(replies.length===rc,"test messages are never sent to the real platform chat");
// بناء طلبات الإرسال الرسمية
const a=chatSendRequest("twitch",{token:"T",clientId:"C",accountId:"42",text:"hi"}), b=chatSendRequest("youtube",{token:"T",liveChatId:"L1",text:"x".repeat(300)}), c=chatSendRequest("kick",{token:"T",accountId:"7",text:"مرحبا"});
ok(a.url.endsWith("/helix/chat/messages")&&JSON.parse(a.init.body).broadcaster_id==="42"&&a.init.headers["client-id"]==="C"&&b.url.includes("liveChat/messages")&&JSON.parse(b.init.body).snippet.textMessageDetails.messageText.length===200&&JSON.parse(c.init.body).broadcaster_user_id===7&&chatSendRequest("tiktok",{token:"T",text:"x"})===null&&chatSendRequest("youtube",{token:"T",text:"x"})===null,"official chat-send requests (Twitch Helix / YouTube liveChat / Kick chat); none for TikTok or without an active YouTube chat");
cl.close(); wss.close(); console.log(f?`\n${f} FAILED`:"\nALL PASS"); process.exit(f?1:0);
