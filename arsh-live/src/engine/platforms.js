// ====== ربط المنصات: تحويل حمولات الواجهات الرسمية إلى الأحداث الموحدة + إعدادات OAuth + أدلة الربط ======
// دوال نقية قابلة للاختبار بدون مفاتيح. الاتصال الفعلي في src/server/platforms.ts (المفاتيح على الخادم فقط).

/** إعدادات OAuth الرسمية لكل منصة (المتغيرات المطلوبة في بيئة الخادم) */
export const OAUTH={
 youtube:{authorize:"https://accounts.google.com/o/oauth2/v2/auth",token:"https://oauth2.googleapis.com/token",scopes:["https://www.googleapis.com/auth/youtube.readonly","https://www.googleapis.com/auth/youtube.force-ssl"],env:["YOUTUBE_CLIENT_ID","YOUTUBE_CLIENT_SECRET"],extra:{access_type:"offline",prompt:"consent"}},
 twitch:{authorize:"https://id.twitch.tv/oauth2/authorize",token:"https://id.twitch.tv/oauth2/token",scopes:["user:read:chat","user:write:chat","moderator:read:followers","channel:read:subscriptions","bits:read","moderator:manage:banned_users"],env:["TWITCH_CLIENT_ID","TWITCH_CLIENT_SECRET"]},
 kick:{authorize:"https://id.kick.com/oauth/authorize",token:"https://id.kick.com/oauth/token",scopes:["user:read","channel:read","chat:write","events:subscribe","moderation:ban"],env:["KICK_CLIENT_ID","KICK_CLIENT_SECRET"],pkce:true},
};
/** رابط التفويض — يرجع null إذا لم تُضبط المفاتيح (لا نعرض اتصالاً وهمياً) */
export function oauthUrl(platform,env,{redirect,state,challenge}){ const c=OAUTH[platform]; if(!c) return null; const id=env[c.env[0]]; if(!id||!env[c.env[1]]) return null;
 const p=new URLSearchParams({client_id:id,redirect_uri:redirect,response_type:"code",scope:c.scopes.join(" "),state,...(c.extra||{})});
 if(c.pkce&&challenge){ p.set("code_challenge",challenge); p.set("code_challenge_method","S256") }
 return c.authorize+"?"+p.toString() }
export const oauthMissing=(platform,env)=>(OAUTH[platform]?.env||[]).filter(k=>!env[k]);

const u_=(id,name,avatar,extra)=>({id:String(id||name||""),name:String(name||id||""),avatar:avatar||"",...extra});

/** Twitch EventSub (WebSocket) → حدث موحد. https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types */
export function twitchToEvent(msg){ const t=msg?.metadata?.subscription_type||msg?.payload?.subscription?.type, e=msg?.payload?.event; if(!t||!e) return null; const mid=msg.metadata?.message_id;
 const badges=new Set((e.badges||[]).map(b=>b.set_id));
 switch(t){
  case "channel.chat.message": return {platform:"twitch",type:"comment",id:e.message_id||mid,user:u_(e.chatter_user_id,e.chatter_user_name,"",{mod:badges.has("moderator"),sub:badges.has("subscriber")||badges.has("founder"),owner:badges.has("broadcaster")}),text:e.message?.text||"",source:"twitch-eventsub",verified:true};
  case "channel.follow": return {platform:"twitch",type:"follow",id:mid,user:u_(e.user_id,e.user_name),source:"twitch-eventsub",verified:true};
  case "channel.subscribe": return {platform:"twitch",type:"subscribe",id:mid,user:u_(e.user_id,e.user_name),data:{tier:e.tier,gift:!!e.is_gift},source:"twitch-eventsub",verified:true};
  case "channel.subscription.gift": return {platform:"twitch",type:"subscribe",id:mid,user:u_(e.user_id,e.is_anonymous?"مجهول":e.user_name),data:{tier:e.tier,giftCount:e.total},source:"twitch-eventsub",verified:true};
  case "channel.cheer": return {platform:"twitch",type:"cheer",id:mid,user:u_(e.user_id,e.is_anonymous?"مجهول":e.user_name),bits:e.bits,count:e.bits,text:e.message||"",source:"twitch-eventsub",verified:true};
  case "channel.raid": return {platform:"twitch",type:"raid",id:mid,user:u_(e.from_broadcaster_user_id,e.from_broadcaster_user_name),viewers:e.viewers,source:"twitch-eventsub",verified:true};
 } return null }

/** Kick Webhooks الرسمية → حدث موحد. https://docs.kick.com/events/event-types */
export function kickToEvent(type,b,messageId){ if(!type||!b) return null; const s=b.sender||b.follower||b.subscriber||b.gifter||{};
 const user=u_(s.user_id,s.username,s.profile_picture,{mod:!!(s.identity?.badges||[]).find(x=>x.type==="moderator"),sub:!!(s.identity?.badges||[]).find(x=>x.type==="subscriber"),owner:!!(s.identity?.badges||[]).find(x=>x.type==="broadcaster")});
 switch(type){
  case "chat.message.sent": return {platform:"kick",type:"comment",id:b.message_id||messageId,user,text:b.content||"",source:"kick-webhook",verified:true};
  case "channel.followed": return {platform:"kick",type:"follow",id:messageId,user,source:"kick-webhook",verified:true};
  case "channel.subscription.new": case "channel.subscription.renewal": return {platform:"kick",type:"subscribe",id:messageId,user,data:{months:b.duration},source:"kick-webhook",verified:true};
  case "channel.subscription.gifts": return {platform:"kick",type:"subscribe",id:messageId,user:u_(s.user_id,s.is_anonymous?"مجهول":s.username,s.profile_picture),data:{giftCount:(b.giftees||[]).length},source:"kick-webhook",verified:true};
  case "kicks.gifted": return {platform:"kick",type:"gift",id:messageId,user,gift:b.gift?.name||"Kicks",count:1,value:+(b.gift?.amount||0),source:"kick-webhook",verified:true};
 } return null }

/** YouTube liveChatMessages.list → أحداث موحدة. https://developers.google.com/youtube/v3/live/docs/liveChatMessages */
export function youtubeToEvents(items){ const out=[]; for(const it of items||[]){ const sn=it.snippet||{}, a=it.authorDetails||{};
  const user=u_(a.channelId,a.displayName,a.profileImageUrl,{mod:!!a.isChatModerator,sub:!!a.isChatSponsor,owner:!!a.isChatOwner});
  const base={platform:"youtube",id:it.id,user,source:"youtube-data-api",verified:true,at:sn.publishedAt?Date.parse(sn.publishedAt):undefined};
  if(sn.type==="textMessageEvent") out.push({...base,type:"comment",text:sn.displayMessage||sn.textMessageDetails?.messageText||""});
  else if(sn.type==="superChatEvent"){ const d=sn.superChatDetails||{}; out.push({...base,type:"superchat",amount:(+d.amountMicros||0)/1e6,currency:d.currency,text:d.userComment||""}) }
  else if(sn.type==="newSponsorEvent"||sn.type==="memberMilestoneChatEvent") out.push({...base,type:"subscribe"}) }
 return out }

/** أدلة الربط بالعربية — تُعرض في نافذة «كيف أربط حسابي؟» */
export const PLATFORM_GUIDES={
 tiktok:{req:["حساب TikTok عليه بث مباشر فعّال","لا يلزم كلمة مرور — اسم المستخدم فقط"],auth:"لا توجد واجهة رسمية عامة لأحداث LIVE؛ نستخدم اتصال LIVE العام بالاسم فقط. لذلك الأحداث «تجريبية» وقد تتوقف إذا غيّر TikTok نظامه.",
  steps:["افتح «مركز ربط البثوث»","اكتب اسم مستخدمك بدون @","اضغط «اتصال» — يظهر «متصل» فقط بعد وصول أول رد من البث","ابدأ البث من التطبيق أو TikTok LIVE Studio"],
  chat:"تعليقات TikTok تظهر تلقائياً في الشات الموحد. الرد داخل شات TikTok غير متاح (لا توجد صلاحية رسمية).",
  obs:["انسخ رابط الشات أو المشهد","OBS ← Sources ← + ← Browser","الصق الرابط واجعل المقاس مثل مقاس المشهد","الخلفية شفافة تلقائياً"],
  test:"اضغط «تجربة» لإرسال رسالة اختبار مُعلَّمة؛ لا تُحفظ كبيانات حقيقية.",
  fix:["«غير متصل» رغم البث: تأكد أن البث بدأ فعلاً وأن الاسم صحيح","توقف الأحداث فجأة: أعد الاتصال — يُستأنف بدون تكرار","لا تظهر الهدايا: بعض الحسابات تقيّد البيانات العامة للبث"]},
 youtube:{req:["قناة YouTube مفعّل فيها البث المباشر","مالك المنصة أضاف YOUTUBE_CLIENT_ID و YOUTUBE_CLIENT_SECRET على الخادم"],auth:"Google OAuth الرسمي (YouTube Data API v3). لا نطلب كلمة المرور؛ تسجّل الدخول في صفحة Google نفسها.",
  steps:["اضغط «ربط YouTube»","سجّل الدخول بحساب القناة ووافق على الصلاحيات","عند بدء بث نشط يبدأ النظام قراءة الشات تلقائياً"],
  chat:"الرسائل وSuper Chat والعضويات تظهر في الشات الموحد. الرد ممكن بصلاحية youtube.force-ssl.",
  obs:["نفس رابط الشات الموحد — لا يحتاج رابطاً منفصلاً"],test:"ابدأ بثاً تجريبياً غير مُدرج (Unlisted) واكتب رسالة من حساب آخر.",
  fix:["«لا يوجد بث نشط»: ابدأ البث أولاً ثم انتظر 30 ثانية","تجاوز الحصة اليومية للـAPI: يقل معدل القراءة تلقائياً"]},
 kick:{req:["حساب Kick","مالك المنصة أضاف KICK_CLIENT_ID و KICK_CLIENT_SECRET وفعّل Webhooks على رابط المنصة العام"],auth:"Kick OAuth 2.1 (PKCE) + Webhooks الرسمية الموقّعة.",
  steps:["اضغط «ربط Kick»","وافق على الصلاحيات في صفحة Kick","يشترك النظام تلقائياً في أحداث الشات والمتابعة والاشتراكات"],
  chat:"رسائل Kick تظهر في الشات الموحد. الرد ممكن بصلاحية chat:write.",obs:["نفس رابط الشات الموحد"],test:"اكتب رسالة في شات قناتك من حساب آخر.",
  fix:["لا تصل الأحداث: يجب أن يكون رابط المنصة عاماً عبر HTTPS لاستقبال Webhooks"]},
 twitch:{req:["حساب Twitch","مالك المنصة أضاف TWITCH_CLIENT_ID و TWITCH_CLIENT_SECRET"],auth:"Twitch OAuth + EventSub WebSocket الرسمي.",
  steps:["اضغط «ربط Twitch»","وافق على الصلاحيات","يتصل النظام بـ EventSub ويشترك في الشات والمتابعات والاشتراكات والـBits والغارات"],
  chat:"رسائل Twitch تظهر في الشات الموحد مع شارات المشرف والمشترك. الرد ممكن بصلاحية user:write:chat.",obs:["نفس رابط الشات الموحد"],test:"اكتب رسالة في شات قناتك.",
  fix:["انتهاء الصلاحية: يُجدَّد الرمز تلقائياً؛ إن فشل أعد الربط"]},
};
