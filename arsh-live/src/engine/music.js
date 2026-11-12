// ====== نظام طلبات الأغاني (B6O6 Music Request): دوال نقية ======
// المصدر: مكتبة ملفات يرفعها صانع المحتوى (موسيقاه المرخّصة) وتُحفظ على الخادم. لا نستخرج صوتاً من YouTube أو غيره،
// ولا نعتبر رابط بحث أو صفحة أغنية رابط تشغيل: كل أغنية في المكتبة لها ملف صوتي فعلي (مصدر التشغيل) منفصل عن بياناتها.
// الحالة في C.music (تُحفظ مع حالة الغرفة). التشغيل الفعلي في «مشغل الأغاني» (رابط OBS / LIVE Studio مستقل) — مشغل واحد فقط في كل لحظة.
import { normAr } from "./bots.js";

export const MUSIC_PERMS=[["owner","صانع المحتوى فقط"],["mods","المشرفون فقط"],["owner_mods","صانع المحتوى والمشرفون"],["subs","المشتركون"],["followers","المتابعون"],["all","جميع المشاهدين"],["custom","قائمة مستخدمين مخصصة"]];
/** وظائف بوت الأغاني في الشات — لكل وظيفة: أوامرها (أكثر من صيغة)، تفعيلها، وصلاحيتها. كلها قابلة للتعديل من اللوحة */
export const MUSIC_FUNCS=[
 ["request","طلب / تشغيل أغنية",["!شغل","!طلب","!اغنية","!song","!sr"],"all",true,"يبحث في مكتبتك ويضيف الأغنية لقائمة الانتظار — مثال: !شغل فوق هام السحب"],
 ["skip","تخطي الأغنية الحالية",["!تخطي","!سكب","!skip"],"owner_mods",false,"ينتقل للأغنية التالية"],
 ["next","تشغيل التالي",["!التالي","!next"],"owner_mods",false,"نفس التخطي باسم آخر"],
 ["pause","إيقاف مؤقت",["!وقف","!ايقاف","!pause"],"owner_mods",false,""],
 ["resume","استكمال التشغيل",["!كمل","!استئناف","!resume"],"owner_mods",false,""],
 ["queue","عرض قائمة الانتظار",["!قائمتي","!قائمة","!queue"],"all",false,"أول 5 أغاني + ترتيب طلباتك"],
 ["current","الأغنية الحالية",["!الحالية","!current"],"all",false,""],
 ["remove","حذف طلب",["!حذف","!remove"],"all",false,"المشاهد يحذف آخر طلب له فقط — المشرف يحذف برقم: !حذف 2"],
 ["volume","مستوى الصوت",["!صوت","!volume"],"owner_mods",true,"!صوت 50"],
 ["clear","مسح القائمة",["!مسح","!clear"],"owner",false,""],
 ["voteskip","التصويت على التخطي",["!تصويت","!voteskip"],"all",false,"يتخطى عند اكتمال الأصوات"]];
export const MUSIC_CMDS=Object.fromEntries(MUSIC_FUNCS.map(f=>[f[0],f[2]]));
/** توحيد الأمر: ! في البداية، حروف صغيرة، توحيد الهمزات (أ/ا) — حتى لا يتعارض «!أغنية» و«!اغنية» */
export function musicFixWord(w){ let t=String(w||"").trim().split(/\s+/)[0]||""; if(!t) return ""; if(!/^[!#/.$]/.test(t)) t="!"+t; return t.slice(0,30) }
export function musicNormWord(w){ const t=musicFixWord(w); return t?normAr(t).toLowerCase():"" }
export function defaultMusicCmds(){ return Object.fromEntries(MUSIC_FUNCS.map(([k,,w,perm])=>[k,{on:true,words:[...w],perm,users:""}])) }
/** الأوامر الفعلية: المحفوظة، أو ترحيل الإعدادات القديمة (صلاحيات المجموعات) */
export function musicCmds(cfg){ cfg=cfg||{}; const d=defaultMusicCmds(), c=cfg.cmds&&typeof cfg.cmds==="object"?cfg.cmds:null;
 const old=cfg.perms||{}, oldMap={request:old.request,queue:old.info,current:old.info,skip:old.skip,next:old.skip,pause:old.control,resume:old.control,volume:old.control,clear:old.control,voteskip:old.vote};
 const out={}; for(const [k,def] of Object.entries(d)){ const x=c&&c[k]||{}; const perm=MUSIC_PERMS.some(p=>p[0]===x.perm)?x.perm:(!c&&oldMap[k]&&MUSIC_PERMS.some(p=>p[0]===oldMap[k])?oldMap[k]:def.perm);
  const seen=new Set(), words=(Array.isArray(x.words)?x.words:def.words).map(musicFixWord).filter(w=>{ const n=musicNormWord(w); if(!n||seen.has(n)) return false; seen.add(n); return true }).slice(0,10);
  out[k]={on:x.on!==false,words,perm,users:String(x.users??(perm==="custom"&&!c?cfg.users||"":"")).slice(0,500)} }
 return out }
/** تعارض الأوامر: نفس الكلمة لوظيفتين — اللوحة تمنع الحفظ، والمحرك يأخذ أول وظيفة */
export function musicCmdConflicts(cmds){ const seen={}, out=[]; for(const [k,c] of Object.entries(cmds||{})) for(const raw of (c.words||[])){ const w=musicNormWord(raw); if(!w) continue; if(seen[w]&&seen[w]!==k) out.push({word:musicFixWord(raw),a:seen[w],b:k}); else seen[w]=k } return out }
/** تحليل التعليق: الأمر (كلمته الأولى) + النص بعده — فقط للأوامر المفعّلة */
export function parseMusicCmd(text,cmds){ const t=String(text||"").trim(); if(!/^[!#/.$]/.test(t)) return null; const sp=t.search(/\s/), head=musicNormWord(sp<0?t:t.slice(0,sp)), arg=(sp<0?"":t.slice(sp+1)).trim().slice(0,120);
 const C=cmds||musicCmds({}); for(const [cmd,c] of Object.entries(C)) if(c.on!==false){ const w=c.words.find(x=>musicNormWord(x)===head); if(w) return {cmd,arg,word:w} } return null }

export function defaultMusicCfg(){ return {source:"youtube",ytRegion:"SA",cmds:null,platforms:{tiktok:true,youtube:true,twitch:true,kick:true},dupSec:8,skipCooldownSec:5,chatReplies:true,page:false,approve:"auto",maxQueue:50,bannedUsers:"",playOn:"player",enabled:true,perms:{request:"all",info:"all",skip:"owner_mods",control:"owner_mods",vote:"all"},users:"",voteSkip:{on:true,needed:3},maxDurSec:420,perUser:2,cooldownSec:60,noRepeatMin:30,banned:"",autoplay:true,shuffle:false,duckTTS:true,volume:70,replies:true} }
export function newMusicState(){ return {queue:[],current:null,paused:false,volume:70,lib:[],votes:[],history:[],last:{},followers:[],seq:0,pending:[],prev:[],player:null,status:"idle",err:"",log:[]} }
/** سجل التشخيص: هل وصل الطلب، حُفظ، دخل القائمة، وُجد مصدر تشغيل، بدأ التشغيل، وسبب الفشل */
export const MUSIC_STEPS={received:"📨 وصل الطلب للخادم",queued:"✅ حُفظ ودخل قائمة الانتظار",pending:"⏳ بانتظار موافقة صانع المحتوى",approved:"👍 وافق صانع المحتوى",rejected:"🚫 رفض صانع المحتوى",refused:"⛔ رُفض الطلب",source:"🎧 وُجد ملف التشغيل",loading:"⏳ جارٍ تحميل الأغنية في المشغل",playing:"▶ بدأ التشغيل فعلياً",paused:"⏸ إيقاف مؤقت",ended:"⏭ انتهت الأغنية",error:"❌ فشل التشغيل",skip:"⏭ تخطي",claim:"📺 مشغل جديد يتولى التشغيل",searching:"🔎 جارٍ البحث في YouTube",found:"🎯 وُجدت في YouTube",alt:"🔁 النسخة ممنوعة من التضمين — تجربة نسخة أخرى",blocked:"🔇 المتصفح منع التشغيل التلقائي"};
export function musicLog(M,now,step,x={}){ M.log=M.log||[]; M.log.unshift({at:now,step,...x}); if(M.log.length>40) M.log.length=40 }
function musFix(M){ for(const k of ["pending","prev","log"]) if(!Array.isArray(M[k])) M[k]=[]; if(M.status==null) M.status="idle"; return M }

/** هل يملك المستخدم صلاحية المستوى؟ */
export function musicPermOk(level,u,M,cfg){ u=u||{}; const owner=!!u.owner, mod=!!u.mod;
 switch(level){ case "owner": return owner; case "mods": return mod; case "owner_mods": return owner||mod; case "subs": return owner||mod||!!u.sub;
  case "followers": return owner||mod||!!u.sub||!!u.follower||(M.followers||[]).includes(String(u.id||u.name));
  case "custom": { const list=String(cfg.users||"").split(/[,،\s]+/).map(s=>s.trim().replace(/^@/,"").toLowerCase()).filter(Boolean); return owner||list.includes(String(u.name||"").toLowerCase())||list.includes(String(u.id||"").toLowerCase()) }
  default: return true } }

/** البحث في المكتبة: يطابق العنوان والفنان بعد توحيد الحروف العربية */
export function musicSearch(lib,q){ const n=normAr(q).toLowerCase(); if(!n) return null; let best=null, bs=0;
 for(const t of lib){ const T=normAr(t.title).toLowerCase(), A=normAr(t.artist||"").toLowerCase(), full=T+" "+A; let s=0;
  if(T===n) s=100; else if(full.includes(n)) s=60+n.length/full.length*30; else { const w=n.split(/\s+/).filter(x=>x.length>1); const hit=w.filter(x=>full.includes(x)).length; if(hit) s=hit/w.length*50 }
  if(s>bs){ bs=s; best=t } } return bs>=25?best:null }

/** نتائج البحث لصفحة الطلب: الاسم أو الفنان (بعد توحيد الحروف) — مرتبة حسب التطابق. بدون كلمة: أحدث المكتبة */
export function musicSearchAll(lib,q,limit=20){ const n=normAr(q).toLowerCase().trim(); lib=lib||[]; if(!n) return lib.slice(0,limit);
 const out=[]; for(const t of lib){ const T=normAr(t.title).toLowerCase(), A=normAr(t.artist||"").toLowerCase(), full=T+" "+A; let s=0;
  if(T===n||A===n) s=100; else if(T.startsWith(n)||A.startsWith(n)) s=85; else if(full.includes(n)) s=60+n.length/full.length*20; else { const w=n.split(/\s+/).filter(x=>x.length>1); const hit=w.filter(x=>full.includes(x)).length; if(hit) s=hit/w.length*50 }
  if(s>=25) out.push([s,t]) } return out.sort((a,b)=>b[0]-a[0]).slice(0,limit).map(x=>x[1]) }
const muFmt=s=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`;
const who=u=>({id:String(u?.id||u?.name||""),name:String(u?.name||"").slice(0,60),platform:u?.platform||"tiktok",...(u?.test?{test:true}:{})});

/** إضافة أغنية للطابور مع كل القيود — ترجع {ok, reply} */
/** قيود الشخص قبل البحث (لا نستهلك حصة البحث لطلب سيُرفض): التفعيل، الحظر، امتلاء القائمة، حد الطلبات، الانتظار */
export function musicPreCheck(M,cfg,u,now){ musFix(M); const by=who(u);
 if(cfg.enabled===false) return "طلبات الأغاني متوقفة الآن";
 const bu=String(cfg.bannedUsers||"").split(/[,،\s]+/).map(x=>x.trim().replace(/^@/,"").toLowerCase()).filter(Boolean); if(bu.includes(by.name.toLowerCase())||bu.includes(by.id.toLowerCase())) return "لا يمكنك طلب الأغاني في هذا البث";
 if(cfg.maxQueue&&M.queue.length+M.pending.length>=cfg.maxQueue) return "قائمة الانتظار ممتلئة — جرّب بعد قليل";
 if(cfg.perUser&&[...M.queue,...M.pending].filter(q=>q.by.id===by.id).length>=cfg.perUser) return `عندك ${cfg.perUser} طلبات في القائمة`;
 const last=M.last[by.id]; if(cfg.cooldownSec&&last&&now-last<cfg.cooldownSec*1000) return `انتظر ${Math.ceil((cfg.cooldownSec*1000-(now-last))/1000)} ث قبل طلب جديد`;
 return "" }
export function musicAdd(M,cfg,track,u,now,{force,via}={}){ musFix(M); if(!track) return {ok:false,reply:"ما لقيت الأغنية في المكتبة"};
 const by={...who(u),via:via||"chat"}, banned=String(cfg.banned||"").split(/[,،\n]/).map(s=>normAr(s.trim()).toLowerCase()).filter(Boolean);
 if(!force){
  if(cfg.enabled===false) return {ok:false,reply:"طلبات الأغاني متوقفة الآن"};
  const bu=String(cfg.bannedUsers||"").split(/[,،\s]+/).map(x=>x.trim().replace(/^@/,"").toLowerCase()).filter(Boolean); if(bu.includes(by.name.toLowerCase())||bu.includes(by.id.toLowerCase())) return {ok:false,reply:"لا يمكنك طلب الأغاني في هذا البث"};
  if(cfg.maxQueue&&M.queue.length+M.pending.length>=cfg.maxQueue) return {ok:false,reply:"قائمة الانتظار ممتلئة — جرّب بعد قليل"};
  if(M.pending.some(q=>q.track.id===track.id)) return {ok:false,reply:"الأغنية مطلوبة وبانتظار الموافقة"};
  if(banned.some(b=>normAr(track.title+" "+(track.artist||"")).toLowerCase().includes(b))) return {ok:false,reply:"هذه الأغنية محظورة"};
  if(cfg.maxDurSec&&track.dur>cfg.maxDurSec) return {ok:false,reply:`الأغنية أطول من الحد (${muFmt(cfg.maxDurSec)})`};
  if(M.queue.some(q=>q.track.id===track.id)||M.current?.track.id===track.id) return {ok:false,reply:"الأغنية موجودة في القائمة"};
  if(cfg.noRepeatMin&&M.history.some(h=>h.id===track.id&&now-h.at<cfg.noRepeatMin*60000)) return {ok:false,reply:"اشتغلت قبل شوي — جرّب أغنية ثانية"};
  if(cfg.perUser&&[...M.queue,...M.pending].filter(q=>q.by.id===by.id).length>=cfg.perUser) return {ok:false,reply:`عندك ${cfg.perUser} طلبات في القائمة`};
  const last=M.last[by.id]; if(cfg.cooldownSec&&last&&now-last<cfg.cooldownSec*1000) return {ok:false,reply:`انتظر ${Math.ceil((cfg.cooldownSec*1000-(now-last))/1000)} ث قبل طلب جديد`} }
 const item={qid:"q"+(++M.seq),track:{id:track.id,title:track.title,artist:track.artist||"",dur:track.dur||0,cover:track.cover||"",...(track.src==="yt"?{src:"yt",vid:track.vid,alts:(track.alts||[]).slice(0,3)}:{})},by,at:now}; M.last[by.id]=now;
 musicLog(M,now,"received",{qid:item.qid,title:track.title,by:by.name,via:by.via});
 if(!force&&cfg.approve==="manual"&&!u.owner&&!u.mod){ M.pending.push(item); musicLog(M,now,"pending",{qid:item.qid,title:track.title,by:by.name}); return {ok:true,pending:true,qid:item.qid,reply:`وصل طلبك «${track.title}» — بانتظار موافقة صانع المحتوى`} }
 return musicEnqueue(M,cfg,item,now) }
/** إدخال القائمة (بترتيب وقت الطلب) + بدء التشغيل التلقائي إن لم يكن هناك أغنية */
export function musicEnqueue(M,cfg,item,now){ musFix(M); M.lastReq={name:item.by.name,id:item.by.id,platform:item.by.platform,title:item.track.title,at:now,qid:item.qid}; M.queue.push(item);
 musicLog(M,now,"queued",{qid:item.qid,title:item.track.title,by:item.by.name});
 if(!M.current&&cfg.autoplay!==false) musicNext(M,now);
 const pos=M.current&&M.current.qid===item.qid?0:M.queue.findIndex(q=>q.qid===item.qid)+1;
 return {ok:true,qid:item.qid,position:pos,reply:`أُضيفت «${item.track.title}» — ${pos?"رقم "+pos+" في القائمة":"تعمل الآن"}`} }

/** الانتقال للأغنية التالية */
export function musicNext(M,now,cfg={}){ musFix(M); if(M.current){ M.history.unshift({id:M.current.track.id,at:now}); if(!M.current.bad){ M.prev.unshift({qid:M.current.qid,track:M.current.track,by:M.current.by,at:M.current.at}); if(M.prev.length>20) M.prev.length=20 } } M.history.length=Math.min(M.history.length,50);
 let i=0; if(cfg.shuffle&&M.queue.length>1) i=Math.floor((now/1000)%M.queue.length);
 const q=M.queue.splice(i,1)[0]; M.current=q?{...q,startedAt:now,pos:0,rp:0}:null; M.paused=false; M.votes=[]; M.status=q?"loading":"idle"; M.err=""; return M.current }

export function musicAddedText(t,r,at){ return r.pending?`🎵 وصل طلب «${t.title}» من ${at} — بانتظار موافقة صانع المحتوى`:`🎵 تمت إضافة «${t.title}»${t.artist?" — "+t.artist:""} ${r.position?`إلى قائمة الانتظار (رقم ${r.position})`:"وتعمل الآن"} بواسطة ${at}` }
/** حدث تعليق → أمر موسيقى. يرجع {changed, reply, platform} — المعالج نفسه لكل المنصات (TikTok / YouTube / Twitch / Kick) */
export const MUSIC_PLATFORMS=[["tiktok","TikTok LIVE"],["youtube","YouTube Live"],["twitch","Twitch"],["kick","Kick"]];
const muSpam=M=>{ M.sp=M.sp||{msg:{},deny:{},skipAt:0}; return M.sp };
function muPrune(o,now,ms){ const ks=Object.keys(o); if(ks.length>500) for(const k of ks) if(now-o[k]>ms) delete o[k] }
export function musicOnEvent(M,cfg,ev,now,lib){ if(!cfg||cfg.enabled===false) return null; musFix(M);
 if(ev.type==="follow"&&ev.user){ const k=String(ev.user.id||ev.user.name); if(!M.followers.includes(k)){ M.followers.push(k); if(M.followers.length>2000) M.followers.shift() } return null }
 if(ev.type!=="comment") return null; const cmds=musicCmds(cfg); const c=parseMusicCmd(ev.text,cmds); if(!c) return null;
 const plat=ev.platform||"tiktok"; if(cfg.platforms&&cfg.platforms[plat]===false) return null; /* المنصة غير مفعّلة لأوامر الأغاني */
 const u={...(ev.user||{}),platform:plat}, uk=plat+":"+String(u.id||u.name), at="@"+(u.name||u.id||"مشاهد"), SP=muSpam(M), R=(changed,reply,x={})=>({changed,reply,platform:plat,...x});
 // منع الرسائل المكررة: نفس الشخص ونفس الأمر خلال ثوانٍ ← تجاهل بصمت (بدون رد يزيد الإزعاج)
 const mk=uk+"|"+normAr(c.word+" "+c.arg).toLowerCase(), dupMs=Math.max(0,+cfg.dupSec||8)*1000; if(dupMs&&SP.msg[mk]&&now-SP.msg[mk]<dupMs) return null; SP.msg[mk]=now; muPrune(SP.msg,now,60000);
 const deny=txt=>{ /* رد الرفض مرة كل 30 ث لكل شخص — لا نغرق الشات */ if(SP.deny[uk]&&now-SP.deny[uk]<30000) return R(false,""); SP.deny[uk]=now; muPrune(SP.deny,now,60000); return R(false,txt) };
 const C=cmds[c.cmd]; if(!musicPermOk(C.perm,u,M,{...cfg,users:C.users})) return deny(`${at} ما عندك صلاحية لأمر ${c.word}`);
 const word=C.words[0]||c.word;
 switch(c.cmd){
  case "request": { if(!c.arg||c.arg.replace(/[\s!.؟?]/g,"").length<2) return deny(`${at} اكتب اسم الأغنية بعد الأمر: ${word} اسم الأغنية`);
   const src=cfg.source||"youtube", local=src!=="youtube"?musicSearch(lib||M.lib,c.arg):null;
   if(!local&&src!=="library"){ /* بحث YouTube (غير متزامن على الخادم) — نفحص قيود الشخص أولاً حتى لا نستهلك حصة البحث */
    const why=musicPreCheck(M,cfg,u,now); if(why){ musicLog(M,now,"refused",{why,by:u.name,via:plat}); return R(false,`${at} ${why}`) }
    musicLog(M,now,"searching",{q:c.arg.slice(0,60),by:u.name,via:plat}); return R(false,"",{search:{q:c.arg,user:u,plat}}) }
   const t=local||musicSearch(lib||M.lib,c.arg); if(!t){ musicLog(M,now,"refused",{why:"لم تُوجد في المكتبة: "+c.arg.slice(0,40),by:u.name,via:plat}); return R(false,`${at} ما لقيت «${c.arg.slice(0,40)}» في المكتبة`) }
   const r=musicAdd(M,cfg,t,u,now,{via:"chat"}); if(!r.ok){ musicLog(M,now,"refused",{why:r.reply,title:t.title,by:u.name}); return R(false,`${at} ${r.reply}`) }
   return R(true,musicAddedText(t,r,at)) }
  case "queue": { if(!M.queue.length) return R(false,"📋 القائمة فاضية"); const mine=M.queue.map((q,i)=>q.by.id===String(u.id||u.name)?i+1:0).filter(Boolean);
   return R(false,"📋 "+M.queue.slice(0,5).map((q,i)=>`${i+1}. ${q.track.title}`).join(" | ")+(M.queue.length>5?` (+${M.queue.length-5})`:"")+(mine.length?` — طلباتك: ${mine.map(n=>"#"+n).join(" ")}`:"")) }
  case "current": return R(false,M.current?`🎵 الحالية: ${M.current.track.title}${M.current.track.artist?" — "+M.current.track.artist:""} (طلب ${M.current.by.name})`:"لا توجد أغنية الآن");
  case "skip": case "next": { if(!M.current&&!M.queue.length) return R(false,"لا توجد أغنية للتخطي");
   const cd=Math.max(0,+cfg.skipCooldownSec||5)*1000; if(cd&&now-SP.skipAt<cd) return null; /* منع التخطي المتتالي المزعج */ SP.skipAt=now;
   const was=M.current&&M.current.track.title; if(M.current) musicLog(M,now,"skip",{qid:M.current.qid,title:was,by:u.name,via:plat}); musicNext(M,now,cfg);
   return R(true,`⏭ ${at} تخطى${was?` «${was}»`:""}${M.current?` — التالية: «${M.current.track.title}»`:""}`) }
  case "pause": if(!M.current||M.paused) return R(false,""); M.paused=true; M.status="paused"; return R(true,`⏸ إيقاف مؤقت بواسطة ${at}`);
  case "resume": if(!M.current||!M.paused) return R(false,""); M.paused=false; M.status="loading"; return R(true,`▶ استكمال بواسطة ${at}`);
  case "volume": { const v=Math.round(+c.arg); if(!c.arg||!(v>=0&&v<=100)) return deny(`${at} اكتب رقماً من 0 إلى 100: ${word} 50`); M.volume=v; return R(true,`🔊 الصوت ${v}%`) }
  case "remove": { const staff=!!(u.owner||u.mod), n=Math.round(+c.arg);
   if(c.arg&&n>=1){ const q=M.queue[n-1]; if(!q) return deny(`${at} رقم غير موجود في القائمة`); if(!staff&&q.by.id!==String(u.id||u.name)) return deny(`${at} تقدر تحذف طلبك أنت فقط`); M.queue.splice(n-1,1); return R(true,`🗑 حُذفت «${q.track.title}»`) }
   const i=[...M.queue].reverse().findIndex(q=>q.by.id===String(u.id||u.name)); if(i<0){ const p=M.pending.findIndex(q=>q.by.id===String(u.id||u.name)); if(p>=0){ const [q]=M.pending.splice(p,1); return R(true,`🗑 ${at} ألغى طلب «${q.track.title}»`) } return deny(`${at} ما عندك طلبات في القائمة`) }
   const [q]=M.queue.splice(M.queue.length-1-i,1); return R(true,`🗑 ${at} حذف طلبه «${q.track.title}»`) }
  case "clear": M.queue=[]; M.pending=[]; return R(true,"🗑 تم مسح القائمة");
  case "voteskip": { if(!cfg.voteSkip?.on||!M.current) return R(false,""); const k=uk; if(M.votes.includes(k)) return null;
   M.votes.push(k); const need=Math.max(1,+cfg.voteSkip.needed||3); if(M.votes.length>=need){ musicLog(M,now,"skip",{qid:M.current.qid,title:M.current.track.title,by:"تصويت"}); musicNext(M,now,cfg); return R(true,"⏭ اكتمل التصويت — تم التخطي") } return R(true,`🗳 تصويت التخطي ${M.votes.length}/${need}`) }
 } return null }

/** عمليات لوحة التحكم (صانع المحتوى) */
/** المشغل الفعلي (رابط OBS/LIVE Studio أو المتصفح): واحد فقط يملك التشغيل حتى لا تعمل أغنيتان معاً.
 * يتولى المشغل التشغيل إن لم يوجد مشغل، أو انقطع نبض المشغل الحالي 15 ثانية، أو طلب صانع المحتوى ذلك (force). */
export const MUSIC_PLAYER_STALE=15000;
export function musicPlayerOp(M,op,now,cfg={}){ musFix(M); const pid=String(op.pid||"").slice(0,40); if(!pid) return false; const P=M.player, mine=P&&P.pid===pid;
 if(op.op==="claim"){ if(mine){ P.at=now; return false } if(P&&now-P.at<MUSIC_PLAYER_STALE&&!op.force) return false; M.player={pid,kind:String(op.kind||"player").slice(0,20),at:now}; musicLog(M,now,"claim",{by:M.player.kind}); if(M.current&&!M.paused) M.status="loading"; return true }
 if(!mine) return false; P.at=now; const cur=M.current, same=cur&&String(op.qid||"")===cur.qid;
 if(op.op==="pstate"){ if(!same) return false; if(op.pos!=null) { cur.pos=Math.max(0,+op.pos||0); cur.posAt=now }
  const st=["loading","playing","paused","blocked"].includes(op.status)?op.status:null; if(st==="loading"&&!cur.ld){ cur.ld=1; musicLog(M,now,"loading",{qid:cur.qid,title:cur.track.title}); if(M.status==="loading") return true }
  if(!st||st===M.status) return false; M.status=st; if(st==="playing"){ M.err=""; musicLog(M,now,"playing",{qid:cur.qid,title:cur.track.title}) } else if(st==="blocked") musicLog(M,now,"blocked",{qid:cur.qid,title:cur.track.title,why:"افتح المصدر في OBS (يسمح بالتشغيل التلقائي) أو اضغط على المشغل مرة"}); return true }
 if(op.op==="pended"){ if(!same) return false; musicLog(M,now,"ended",{qid:cur.qid,title:cur.track.title}); musicNext(M,now,cfg); return true }
 if(op.op==="perror"){ if(!same) return false; const why=String(op.why||"تعذر تحميل ملف الأغنية").slice(0,160);
  if(cur.track.src==="yt"&&op.embed&&(cur.track.alts||[]).length){ /* صاحب الفيديو منع التضمين ← نسخة بديلة من نتائج البحث نفسها */ const a=cur.track.alts.shift(); musicLog(M,now,"alt",{qid:cur.qid,title:cur.track.title,why}); cur.track={...cur.track,id:"yt:"+a.vid,vid:a.vid,title:a.title||cur.track.title,artist:a.artist||cur.track.artist,dur:a.dur||cur.track.dur,cover:a.cover||cur.track.cover}; cur.rp=(cur.rp||0)+1; cur.ld=0; cur.pos=0; M.status="loading"; return true } M.err=why; cur.bad=1; /* لا تعود إليها بزر «السابق» */ musicLog(M,now,"error",{qid:cur.qid,title:cur.track.title,why}); musicNext(M,now,cfg); M.err=why; return true }
 return false }
export function musicOp(M,op,now,cfg={},lib){ musFix(M); if(["claim","pstate","pended","perror"].includes(op.op)) return musicPlayerOp(M,op,now,cfg); const L=lib||M.lib; switch(op.op){
 case "approve": { const i=M.pending.findIndex(q=>q.qid===op.qid); if(i<0) return false; const [q]=M.pending.splice(i,1); musicLog(M,now,"approved",{qid:q.qid,title:q.track.title,by:q.by.name}); musicEnqueue(M,cfg,q,now); return true }
 case "reject": { const i=M.pending.findIndex(q=>q.qid===op.qid); if(i<0) return false; const [q]=M.pending.splice(i,1); musicLog(M,now,"rejected",{qid:q.qid,title:q.track.title,by:q.by.name}); return true }
 case "release": M.player=null; return true; /* تسليم التشغيل لأول مشغل يطلبه (مثلاً OBS بعد الاستماع في اللوحة) */
 case "replay": if(!M.current) return false; M.current.ld=0; M.current.rp=(M.current.rp||0)+1; M.current.pos=0; M.current.startedAt=now; M.paused=false; M.status="loading"; return true;
 case "prev": { const p=M.prev.shift(); if(!p) return false; if(M.current) M.queue.unshift({qid:M.current.qid,track:M.current.track,by:M.current.by,at:M.current.at}); M.current={...p,startedAt:now,pos:0,rp:0}; M.paused=false; M.status="loading"; return true }
 case "lib": M.lib=(op.lib||[]).slice(0,1000).map(t=>({id:String(t.id),title:String(t.title||"").slice(0,120),artist:String(t.artist||"").slice(0,80),dur:+t.dur||0,cover:t.cover&&String(t.cover).length<200000?t.cover:""})); return true;
 case "add": return musicAdd(M,cfg,(L||[]).find(t=>t.id===op.id),{id:"owner",name:op.name||"صانع المحتوى",owner:true},now,{force:true,via:"dash"}).ok;
 case "next": case "ended": if(op.op==="next"&&M.current) musicLog(M,now,"skip",{qid:M.current.qid,title:M.current.track.title}); musicNext(M,now,cfg); return true;
 case "pause": if(!M.current) return false; M.paused=true; M.status="paused"; return true;
 case "resume": if(!M.current) return false; M.paused=false; M.status="loading"; return true;
 case "volume": M.volume=Math.max(0,Math.min(100,Math.round(+op.v||0))); return true;
 case "remove": M.queue=M.queue.filter(q=>q.qid!==op.qid); return true;
 case "move": { const i=M.queue.findIndex(q=>q.qid===op.qid); if(i<0) return false; const [q]=M.queue.splice(i,1); M.queue.splice(Math.max(0,Math.min(M.queue.length,i+(op.d||0))),0,q); return true }
 case "clear": M.queue=[]; M.pending=[]; return true;
 case "pos": if(M.current){ M.current.pos=+op.pos||0; M.current.posAt=now } return true;
 } return false }
