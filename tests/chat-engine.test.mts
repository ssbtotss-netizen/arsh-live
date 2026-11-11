import { chatMsgOf, chatFilter, chatImportant, chatPush } from "/home/claude/najd/arsh-live/src/engine/chat.js";
import { twitchToEvent, kickToEvent, youtubeToEvents, oauthUrl, oauthMissing, PLATFORM_GUIDES } from "/home/claude/najd/arsh-live/src/engine/platforms.js";
import { normalizeEvent } from "/home/claude/najd/arsh-live/src/engine/events.js";
import { newRoom, roomEvent, roomSnapshot } from "/home/claude/najd/arsh-live/src/engine/room.js";
let f=0; const ok=(c:any,m:string)=>{ console.log((c?"PASS ":"FAIL ")+m); if(!c) f++ };
// Twitch EventSub
const tw=twitchToEvent({metadata:{message_id:"m1",subscription_type:"channel.chat.message"},payload:{event:{message_id:"abc",chatter_user_id:"9",chatter_user_name:"Sara",message:{text:"Let's go!"},badges:[{set_id:"moderator"}]}}});
const twn=normalizeEvent(tw); ok(twn.platform==="twitch"&&twn.type==="comment"&&twn.text==="Let's go!"&&twn.user.mod===true&&twn.id==="twitch:abc","Twitch chat → unified comment with mod badge");
ok(twitchToEvent({metadata:{message_id:"m2",subscription_type:"channel.cheer"},payload:{event:{user_id:"1",user_name:"A",bits:100,message:"gg"}}}).bits===100,"Twitch cheer keeps bits (not money)");
ok(twitchToEvent({metadata:{subscription_type:"unknown"},payload:{event:{}}})===null,"unknown Twitch type ignored");
// Kick webhook
const kk=normalizeEvent(kickToEvent("chat.message.sent",{message_id:"k1",content:"نورت",sender:{user_id:5,username:"عبدالله",identity:{badges:[{type:"subscriber"}]}}},"x"));
ok(kk.platform==="kick"&&kk.text==="نورت"&&kk.user.sub===true&&kk.id==="kick:k1","Kick chat → unified comment with sub badge");
ok(kickToEvent("channel.followed",{follower:{user_id:7,username:"f"}},"kick:m9").type==="follow","Kick follow");
// YouTube
const yt=youtubeToEvents([{id:"y1",snippet:{type:"textMessageEvent",displayMessage:"البث رهيب",publishedAt:"2026-11-10T00:00:00Z"},authorDetails:{channelId:"c1",displayName:"أحمد",isChatSponsor:true}},{id:"y2",snippet:{type:"superChatEvent",superChatDetails:{amountMicros:"5000000",currency:"USD",userComment:"شكراً"}},authorDetails:{channelId:"c2",displayName:"B"}}]);
const y2=normalizeEvent(yt[1]); ok(yt.length===2&&yt[0].user.sub&&y2.type==="superchat"&&y2.amount===5&&y2.currency==="USD","YouTube text + Super Chat (amount from micros)");
// OAuth: لا رابط بدون مفاتيح
ok(oauthUrl("twitch",{}, {redirect:"r",state:"s"})===null&&oauthMissing("twitch",{}).length===2,"no OAuth URL without server keys (no fake connect)");
const u=oauthUrl("kick",{KICK_CLIENT_ID:"a",KICK_CLIENT_SECRET:"b"},{redirect:"https://x/cb",state:"st",challenge:"ch"}); ok(u&&u.includes("code_challenge=ch")&&u.includes("state=st"),"Kick OAuth uses PKCE");
ok(["tiktok","youtube","kick","twitch"].every(p=>{ const g=(PLATFORM_GUIDES as any)[p]; return g.req&&g.auth&&g.steps&&g.chat&&g.obs&&g.test&&g.fix }),"guides have all 7 sections for 4 platforms");
// المرشح
const W:any={banned:"سبام",dedupe:true}; const F=chatFilter(W,()=>1000);
const m1=chatMsgOf(normalizeEvent({type:"comment",id:"c1",user:{id:"u",name:"a"},text:"هذا سبام"}));
ok(F(m1,"all").text.includes("***"),"banned word masked");
const m2=chatMsgOf(normalizeEvent({type:"comment",id:"c2",user:{id:"u",name:"a"},text:"هلا"})); const m3={...m2,id:"c3"};
ok(F(m2,"all")&&F(m3,"all")===null,"duplicate message from same user hidden");
ok(F({...m2,id:"c4",platform:"youtube"},"tiktok")===null,"platform-only mode filters others");
ok(chatImportant({...m2,mod:true})&&!chatImportant(m2),"moderator messages are important");
ok(chatFilter({},()=>0)(m2,"important")===null,"important mode hides normal messages");
// الغرفة: الحقيقي فقط في السجل
const R=newRoom(); roomEvent(R,{type:"comment",id:"r1",platform:"youtube",user:{id:"y",name:"Y"},text:"hi"},Date.now()); roomEvent(R,{type:"comment",id:"r2",user:{id:"t",name:"T"},text:"test",test:true},Date.now());
const sn=roomSnapshot(R,Date.now()); ok(sn.CH.length===1&&sn.CH[0].platform==="youtube","room chat log keeps real messages only (snapshot for OBS reconnect)");
const big:any[]=[]; for(let i=0;i<100;i++) chatPush(big,normalizeEvent({type:"comment",id:"b"+i,user:{id:"u",name:"a"},text:"x"+i})); ok(big.length===60,"chat log bounded to 60");
console.log(f?`${f} FAILED`:"ALL PASS"); if(f) process.exit(1);
