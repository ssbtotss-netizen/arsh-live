// ====== قراءة الشات العام باسم القناة فقط (بدون تسجيل دخول) — دوال نقية قابلة للاختبار ======
// Twitch: IRC الرسمي بحساب مجهول (justinfan) — قراءة فقط.
// YouTube: صفحة الشات العامة لبث مباشر (بدون حصة Data API) — غير رسمي وقد يتغير.
// Kick: قناة Pusher العامة لغرفة الشات — غير رسمي وقد يتغير.
// هذه القراءة لا تعني «ربطاً كاملاً»: لا متابعات/اشتراكات/هدايا، ولا إرسال ردود — ذلك يحتاج التفويض الرسمي (OAuth).
export const PC_PLATFORMS=["twitch","youtube","kick"];
export const PC_OFFICIAL={twitch:true,youtube:false,kick:false};
const u=(id,name,avatar,extra)=>({id:String(id||name||""),name:String(name||id||""),avatar:avatar||"",...extra});

/** تنظيف اسم القناة من رابط أو @ — null إذا غير صالح */
export function pcNormChannel(p,input){ let s=String(input||"").trim(); if(!s) return null;
 if(p==="twitch"){ s=s.replace(/^https?:\/\/(www\.)?twitch\.tv\//i,"").replace(/^@/,"").split(/[/?#]/)[0].toLowerCase(); return /^[a-z0-9_]{3,25}$/.test(s)?s:null }
 if(p==="kick"){ s=s.replace(/^https?:\/\/(www\.)?kick\.com\//i,"").replace(/^@/,"").split(/[/?#]/)[0].toLowerCase(); return /^[a-z0-9_-]{2,40}$/.test(s)?s:null }
 if(p==="youtube"){
  const v=s.match(/(?:youtu\.be\/|[?&]v=|\/live\/)([A-Za-z0-9_-]{11})/); if(v) return "v:"+v[1];
  s=s.replace(/^https?:\/\/(www\.|m\.)?youtube\.com\//i,"");
  const ch=s.match(/^channel\/(UC[A-Za-z0-9_-]{22})/)||s.match(/^(UC[A-Za-z0-9_-]{22})$/); if(ch) return "c:"+ch[1];
  s=s.split(/[/?#]/)[0]; if(!s.startsWith("@")) s="@"+s; return /^@[A-Za-z0-9._-]{3,30}$/.test(s)?s:null }
 return null }
/** رابط الصفحة التي نبحث فيها عن البث المباشر الحالي لقناة YouTube */
export function pcYtLiveUrl(ch){ if(!ch) return null; if(ch.startsWith("v:")) return "https://www.youtube.com/watch?v="+ch.slice(2); if(ch.startsWith("c:")) return "https://www.youtube.com/channel/"+ch.slice(2)+"/live"; return "https://www.youtube.com/"+ch+"/live" }

// ---------- Twitch IRC ----------
const unesc=v=>String(v||"").replace(/\\s/g," ").replace(/\\:/g,";").replace(/\\\\/g,"\\").replace(/\\r/g,"").replace(/\\n/g,"");
/** سطر/أسطر IRC → أحداث. يرجع {events, ping} */
export function pcParseIrc(raw){ const out={events:[],ping:null};
 for(const line of String(raw||"").split("\r\n")){ if(!line) continue;
  if(line.startsWith("PING")){ out.ping=line.replace(/^PING/,"PONG"); continue }
  let rest=line, tags={};
  if(rest[0]==="@"){ const sp=rest.indexOf(" "); for(const kv of rest.slice(1,sp).split(";")){ const i=kv.indexOf("="); tags[kv.slice(0,i)]=unesc(kv.slice(i+1)) } rest=rest.slice(sp+1) }
  const m=rest.match(/^:([^!\s]+)![^\s]+ PRIVMSG #(\S+) :([\s\S]*)$/); if(!m) continue;
  let text=m[3]; const act=text.match(/^\u0001ACTION ([\s\S]*)\u0001$/); if(act) text=act[1];
  const badges=String(tags.badges||"");
  out.events.push({platform:"twitch",type:"comment",id:tags.id||("tw_"+(tags["tmi-sent-ts"]||Date.now())+"_"+m[1]),
   user:u(tags["user-id"]||m[1],tags["display-name"]||m[1],"",{mod:tags.mod==="1"||/moderator/.test(badges),sub:tags.subscriber==="1"||/subscriber|founder/.test(badges),owner:/broadcaster/.test(badges),color:tags.color||""}),
   text:text.slice(0,500),channel:m[2],source:"twitch-irc",at:+tags["tmi-sent-ts"]||undefined}) }
 return out }
export const pcIrcHello=ch=>["CAP REQ :twitch.tv/tags twitch.tv/commands","PASS SCHMOOPIIE","NICK justinfan"+(10000+Math.floor(Math.random()*80000)),"JOIN #"+ch];

// ---------- Kick (Pusher) ----------
export const PC_KICK_WS="wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.4.0-rc2&flash=false";
export const pcKickSub=chatroomId=>JSON.stringify({event:"pusher:subscribe",data:{auth:"",channel:"chatrooms."+chatroomId+".v2"}});
/** إطار Pusher → حدث تعليق (أو null). يرجع {ping:true} لطلب pong */
export function pcKickFrame(raw){ let f; try{ f=typeof raw==="string"?JSON.parse(raw):raw }catch{ return null } if(!f) return null;
 if(f.event==="pusher:ping") return {ping:true};
 if(f.event!=="App\\Events\\ChatMessageEvent") return null;
 let d; try{ d=typeof f.data==="string"?JSON.parse(f.data):f.data }catch{ return null } if(!d||!d.sender) return null;
 const b=(d.sender.identity&&d.sender.identity.badges||[]).map(x=>x.type);
 const text=String(d.content||"").replace(/\[emote:\d+:([^\]]+)\]/g,":$1:").slice(0,500);
 return {platform:"kick",type:"comment",id:String(d.id||("kk_"+Date.now())),user:u(d.sender.id,d.sender.username,"",{mod:b.includes("moderator"),sub:b.includes("subscriber")||b.includes("og"),owner:b.includes("broadcaster"),color:d.sender.identity&&d.sender.identity.color||""}),text,source:"kick-pusher"} }
/** رد واجهة kick.com/api/v2/channels/<slug> → رقم غرفة الشات */
export const pcKickRoom=j=>j&&j.chatroom&&j.chatroom.id?String(j.chatroom.id):null;

// ---------- YouTube (صفحة الشات العامة) ----------
const jsonAfter=(html,key)=>{ const i=html.indexOf(key); if(i<0) return null; const s=html.indexOf("{",i); if(s<0) return null; let d=0,inS=false,esc=false;
 for(let k=s;k<html.length;k++){ const c=html[k]; if(inS){ if(esc) esc=false; else if(c==="\\") esc=true; else if(c==="\"") inS=false; continue } if(c==="\"") inS=true; else if(c==="{") d++; else if(c==="}"){ d--; if(!d){ try{ return JSON.parse(html.slice(s,k+1)) }catch{ return null } } } } return null };
/** صفحة /@قناة/live → رقم البث المباشر الحالي (أو null إذا غير مباشر) */
export function pcYtVideoId(html){ html=String(html||"");
 const canon=html.match(/<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})"/); const live=/"isLiveNow":\s*true|"isLive":\s*true|"style":"LIVE"/.test(html);
 if(canon&&live) return canon[1]; if(canon&&/"liveChatRenderer"/.test(html)) return canon[1]; return null }
/** صفحة live_chat → مفاتيح الاستمرار */
export function pcYtInit(html){ html=String(html||""); const key=(html.match(/"INNERTUBE_API_KEY":"([^"]+)"/)||[])[1], ver=(html.match(/"INNERTUBE_CLIENT_VERSION":"([^"]+)"/)||[])[1];
 const data=jsonAfter(html,"ytInitialData"); const cont=data&&data.contents&&data.contents.liveChatRenderer&&data.contents.liveChatRenderer.continuations&&data.contents.liveChatRenderer.continuations[0];
 const c=cont&&(cont.invalidationContinuationData||cont.timedContinuationData||cont.reloadContinuationData||{}).continuation;
 const first=data&&data.contents&&data.contents.liveChatRenderer&&data.contents.liveChatRenderer.actions||[];
 return key&&c?{key,ver:ver||"2.20240101.00.00",continuation:c,initial:first}:null }
const runsText=r=>(r&&r.runs||[]).map(x=>x.text!=null?x.text:(x.emoji&&(x.emoji.shortcuts&&x.emoji.shortcuts[0]||x.emoji.emojiId)||"")).join("");
/** actions → أحداث */
export function pcYtActions(actions){ const out=[]; for(const a of actions||[]){ const it=a&&a.addChatItemAction&&a.addChatItemAction.item; if(!it) continue;
  const r=it.liveChatTextMessageRenderer||it.liveChatPaidMessageRenderer; if(!r) continue;
  const badges=(r.authorBadges||[]).map(b=>b.liveChatAuthorBadgeRenderer&&(b.liveChatAuthorBadgeRenderer.icon&&b.liveChatAuthorBadgeRenderer.icon.iconType||b.liveChatAuthorBadgeRenderer.tooltip)||"").join(" ");
  const ph=r.authorPhoto&&r.authorPhoto.thumbnails||[]; const av=ph.length?ph[ph.length-1].url:"";
  const base={platform:"youtube",id:String(r.id),user:u(r.authorExternalChannelId,r.authorName&&r.authorName.simpleText,av,{mod:/MODERATOR/i.test(badges),sub:/member/i.test(badges),owner:/OWNER/i.test(badges)}),source:"youtube-public",at:r.timestampUsec?Math.floor(+r.timestampUsec/1000):undefined};
  if(it.liveChatPaidMessageRenderer){ const amt=r.purchaseAmountText&&r.purchaseAmountText.simpleText||""; out.push({...base,type:"comment",superchat:true,amountText:amt,text:("💰 "+amt+" "+runsText(r.message)).trim().slice(0,500)}) } /* بدون مبلغ رقمي موثوق → تعليق مميّز فقط */
  else out.push({...base,type:"comment",text:runsText(r.message).slice(0,500)}) }
 return out }
/** رد get_live_chat → {events, continuation, waitMs, ended} */
export function pcYtPoll(j){ const lc=j&&j.continuationContents&&j.continuationContents.liveChatContinuation; if(!lc) return {events:[],continuation:null,waitMs:0,ended:true};
 const c=(lc.continuations||[])[0]||{}; const cd=c.invalidationContinuationData||c.timedContinuationData||c.reloadContinuationData||null;
 return {events:pcYtActions(lc.actions),continuation:cd&&cd.continuation||null,waitMs:Math.max(1500,Math.min(15000,+(cd&&cd.timeoutMs)||5000)),ended:!cd} }
