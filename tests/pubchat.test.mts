// قراءة الشات العام: تنظيف أسماء القنوات + محللات Twitch IRC و Kick Pusher و YouTube
import { pcNormChannel, pcYtLiveUrl, pcParseIrc, pcIrcHello, pcKickFrame, pcKickSub, pcKickRoom, pcYtVideoId, pcYtInit, pcYtPoll } from "/home/claude/najd/arsh-live/src/engine/pubchat.js";
let f=0; const ok=(c:any,m:string)=>{ console.log((c?"PASS ":"FAIL ")+m); if(!c) f++ };
// القنوات
ok(pcNormChannel("twitch","https://www.twitch.tv/Ninja?x=1")==="ninja"&&pcNormChannel("twitch","@xQc")==="xqc"&&pcNormChannel("twitch","a b")===null,"Twitch: رابط/@/اسم → login، والاسم غير الصالح يُرفض");
ok(pcNormChannel("kick","https://kick.com/trainwreckstv")==="trainwreckstv"&&pcNormChannel("kick","")===null,"Kick: رابط → slug");
ok(pcNormChannel("youtube","https://www.youtube.com/@MrBeast")==="@MrBeast"&&pcNormChannel("youtube","MrBeast")==="@MrBeast","YouTube: @handle من رابط أو اسم");
ok(pcNormChannel("youtube","https://youtu.be/dQw4w9WgXcQ")==="v:dQw4w9WgXcQ"&&pcNormChannel("youtube","https://www.youtube.com/live/abcdefghijk?si=1")==="v:abcdefghijk","YouTube: رابط بث مباشر → رقم الفيديو");
ok(pcNormChannel("youtube","https://www.youtube.com/channel/UCX6OQ3DkcsbYNE6H8uQQuVA")==="c:UCX6OQ3DkcsbYNE6H8uQQuVA","YouTube: رابط قناة UC…");
ok(pcYtLiveUrl("@x_y")==="https://www.youtube.com/@x_y/live"&&pcYtLiveUrl("v:abcdefghijk").includes("watch?v=abcdefghijk"),"رابط صفحة البث المباشر");
// Twitch
const irc="@badge-info=;badges=moderator/1;color=#FF0000;display-name=Ahmed_TV;id=abc-123;mod=1;subscriber=0;tmi-sent-ts=1700000000000;user-id=4455 :ahmed_tv!ahmed_tv@ahmed_tv.tmi.twitch.tv PRIVMSG #ninja :السلام عليكم 🔥\r\nPING :tmi.twitch.tv\r\n";
const r=pcParseIrc(irc); const e=r.events[0];
ok(r.events.length===1&&e.platform==="twitch"&&e.type==="comment"&&e.text==="السلام عليكم 🔥"&&e.user.name==="Ahmed_TV"&&e.user.id==="4455"&&e.user.mod===true&&e.id==="abc-123","Twitch: تعليق بالاسم والنص والمشرف والمعرّف");
ok(r.ping==="PONG :tmi.twitch.tv","Twitch: الرد على PING");
ok(pcParseIrc(":tmi.twitch.tv 001 justinfan1 :Welcome").events.length===0,"Twitch: رسائل النظام تُتجاهل");
ok(pcParseIrc("@display-name=X;id=q1 :x!x@x PRIVMSG #c :\u0001ACTION يرقص\u0001").events[0].text==="يرقص","Twitch: /me");
ok(pcIrcHello("ninja").includes("JOIN #ninja")&&pcIrcHello("ninja").some(l=>/^NICK justinfan\d+$/.test(l))&&!pcIrcHello("ninja").some(l=>/oauth:/i.test(l)),"Twitch: دخول مجهول (قراءة فقط، بدون رمز)");
// Kick
const kf=JSON.stringify({event:"App\\Events\\ChatMessageEvent",data:JSON.stringify({id:"k1",content:"هلا [emote:39261:KEKW]",sender:{id:77,username:"Faisal",identity:{color:"#00ff00",badges:[{type:"subscriber"}]}}})});
const k=pcKickFrame(kf) as any; ok(k&&k.platform==="kick"&&k.text==="هلا :KEKW:"&&k.user.name==="Faisal"&&k.user.sub===true&&k.id==="k1","Kick: تعليق + إيموت + مشترك");
ok((pcKickFrame(JSON.stringify({event:"pusher:ping"})) as any).ping===true&&pcKickFrame("not json")===null&&pcKickFrame(JSON.stringify({event:"App\\Events\\FollowersUpdated",data:"{}"}))===null,"Kick: ping + تجاهل غير التعليقات");
ok(JSON.parse(pcKickSub("123")).data.channel==="chatrooms.123.v2"&&pcKickRoom({chatroom:{id:123}})==="123"&&pcKickRoom({})===null,"Kick: الاشتراك في غرفة الشات");
// YouTube
const watch='<link rel="canonical" href="https://www.youtube.com/watch?v=AbCdEfGhIjK"> ... "isLiveNow":true';
ok(pcYtVideoId(watch)==="AbCdEfGhIjK"&&pcYtVideoId('<link rel="canonical" href="https://www.youtube.com/@x">')===null,"YouTube: رقم البث المباشر، والقناة غير المباشرة ← null");
const act=(id:string,name:string,text:string)=>({addChatItemAction:{item:{liveChatTextMessageRenderer:{id,message:{runs:[{text},{emoji:{shortcuts:[":fire:"]}}]},authorName:{simpleText:name},authorExternalChannelId:"UC1",authorPhoto:{thumbnails:[{url:"a"},{url:"b"}]},authorBadges:[{liveChatAuthorBadgeRenderer:{icon:{iconType:"MODERATOR"}}}],timestampUsec:"1700000000000000"}}}});
const html=`<script>ytcfg.set({"INNERTUBE_API_KEY":"KEY1","INNERTUBE_CLIENT_VERSION":"2.2024"})</script><script>window["ytInitialData"] = ${JSON.stringify({contents:{liveChatRenderer:{continuations:[{invalidationContinuationData:{continuation:"C1",timeoutMs:5000}}],actions:[act("y0","قديم","أهلاً")]}}})};</script>`;
const init=pcYtInit(html) as any; ok(init&&init.key==="KEY1"&&init.ver==="2.2024"&&init.continuation==="C1"&&init.initial.length===1,"YouTube: مفاتيح الاستمرار من صفحة الشات");
const poll=pcYtPoll({continuationContents:{liveChatContinuation:{continuations:[{timedContinuationData:{continuation:"C2",timeoutMs:3000}}],actions:[act("y1","سارة","مرحبا "),{addChatItemAction:{item:{liveChatPaidMessageRenderer:{id:"y2",purchaseAmountText:{simpleText:"$5.00"},message:{runs:[{text:"كفو"}]},authorName:{simpleText:"خالد"}}}}},{addLiveChatTickerItemAction:{}}]}}});
ok(poll.continuation==="C2"&&poll.waitMs===3000&&!poll.ended&&poll.events.length===2,"YouTube: استطلاع → تعليقات + الاستمرار التالي");
ok(poll.events[0].text==="مرحبا :fire:"&&poll.events[0].user.name==="سارة"&&poll.events[0].user.avatar==="b"&&poll.events[0].user.mod===true,"YouTube: نص + إيموجي + صورة + مشرف");
ok(poll.events[1].type==="comment"&&(poll.events[1] as any).superchat&&/\$5\.00/.test(poll.events[1].text),"YouTube: سوبر شات يظهر تعليقاً مميزاً (بدون مبلغ رقمي غير موثوق)");
ok(pcYtPoll({}).ended===true,"YouTube: انتهاء البث");
console.log(f?f+" FAILED":"ALL PASS"); if(f) process.exit(1);
