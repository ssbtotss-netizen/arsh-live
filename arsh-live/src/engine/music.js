// ====== نظام طلبات الأغاني (B6O6 Music Request): دوال نقية ======
// المصدر: مكتبة ملفات يرفعها صانع المحتوى (موسيقاه المرخّصة) وتُحفظ على الخادم. لا نستخرج صوتاً من YouTube أو غيره،
// ولا نعتبر رابط بحث أو صفحة أغنية رابط تشغيل: كل أغنية في المكتبة لها ملف صوتي فعلي (مصدر التشغيل) منفصل عن بياناتها.
// الحالة في C.music (تُحفظ مع حالة الغرفة). التشغيل الفعلي في «مشغل الأغاني» (رابط OBS / LIVE Studio مستقل) — مشغل واحد فقط في كل لحظة.
import { normAr } from "./bots.js";

export const MUSIC_PERMS=[["owner","صانع المحتوى فقط"],["mods","المشرفون فقط"],["owner_mods","صانع المحتوى والمشرفون"],["subs","المشتركون"],["followers","المتابعون"],["all","جميع المشاهدين"],["custom","قائمة مستخدمين مخصصة"]];
export const MUSIC_CMDS={request:["!اغنية","!أغنية","!song","!طلب","!sr"],queue:["!queue","!قائمة"],current:["!current","!الحالية","!song?"],skip:["!skip","!سكب","!تخطي"],pause:["!pause","!ايقاف","!إيقاف"],resume:["!resume","!استئناف"],volume:["!volume","!صوت"],remove:["!remove","!حذف"],clear:["!clear","!مسح"],voteskip:["!voteskip","!تصويت"]};
/** أي صلاحية تحكم كل أمر (طلب الأغاني منفصل عن التخطي والصوت) */
const CMD_PERM={request:"request",queue:"info",current:"info",skip:"skip",pause:"control",resume:"control",volume:"control",remove:"control",clear:"control",voteskip:"vote"};
export function defaultMusicCfg(){ return {page:true,approve:"auto",maxQueue:50,bannedUsers:"",playOn:"player",enabled:true,perms:{request:"all",info:"all",skip:"owner_mods",control:"owner_mods",vote:"all"},users:"",voteSkip:{on:true,needed:3},maxDurSec:420,perUser:2,cooldownSec:60,noRepeatMin:30,banned:"",autoplay:true,shuffle:false,duckTTS:true,volume:70,replies:true} }
export function newMusicState(){ return {queue:[],current:null,paused:false,volume:70,lib:[],votes:[],history:[],last:{},followers:[],seq:0,pending:[],prev:[],player:null,status:"idle",err:"",log:[]} }
/** سجل التشخيص: هل وصل الطلب، حُفظ، دخل القائمة، وُجد مصدر تشغيل، بدأ التشغيل، وسبب الفشل */
export const MUSIC_STEPS={received:"📨 وصل الطلب للخادم",queued:"✅ حُفظ ودخل قائمة الانتظار",pending:"⏳ بانتظار موافقة صانع المحتوى",approved:"👍 وافق صانع المحتوى",rejected:"🚫 رفض صانع المحتوى",refused:"⛔ رُفض الطلب",source:"🎧 وُجد ملف التشغيل",loading:"⏳ جارٍ تحميل الأغنية في المشغل",playing:"▶ بدأ التشغيل فعلياً",paused:"⏸ إيقاف مؤقت",ended:"⏭ انتهت الأغنية",error:"❌ فشل التشغيل",skip:"⏭ تخطي",claim:"📺 مشغل جديد يتولى التشغيل"};
export function musicLog(M,now,step,x={}){ M.log=M.log||[]; M.log.unshift({at:now,step,...x}); if(M.log.length>40) M.log.length=40 }
function musFix(M){ for(const k of ["pending","prev","log"]) if(!Array.isArray(M[k])) M[k]=[]; if(M.status==null) M.status="idle"; return M }

/** تحليل الأمر من نص التعليق */
export function parseMusicCmd(text){ const t=String(text||"").trim(); if(!t.startsWith("!")) return null; const sp=t.search(/\s/), head=(sp<0?t:t.slice(0,sp)).toLowerCase(), arg=sp<0?"":t.slice(sp+1).trim();
 for(const [cmd,al] of Object.entries(MUSIC_CMDS)) if(al.includes(head)) return {cmd,arg}; return null }

/** هل يملك المستخدم صلاحية المستوى؟ */
export function musicPermOk(level,u,M,cfg){ u=u||{}; const owner=!!u.owner, mod=!!u.mod;
 switch(level){ case "owner": return owner; case "mods": return mod; case "owner_mods": return owner||mod; case "subs": return owner||mod||!!u.sub;
  case "followers": return owner||mod||!!u.sub||(M.followers||[]).includes(String(u.id||u.name));
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
 const item={qid:"q"+(++M.seq),track:{id:track.id,title:track.title,artist:track.artist||"",dur:track.dur||0,cover:track.cover||""},by,at:now}; M.last[by.id]=now;
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

/** حدث تعليق → أمر موسيقى. يرجع {changed, reply} */
export function musicOnEvent(M,cfg,ev,now,lib){ if(!cfg||cfg.enabled===false) return null;
 if(ev.type==="follow"&&ev.user){ const k=String(ev.user.id||ev.user.name); if(!M.followers.includes(k)){ M.followers.push(k); if(M.followers.length>2000) M.followers.shift() } return null }
 if(ev.type!=="comment") return null; const c=parseMusicCmd(ev.text); if(!c) return null;
 const u={...(ev.user||{}),platform:ev.platform}; const perm=cfg.perms?.[CMD_PERM[c.cmd]]||"all";
 if(!musicPermOk(perm,u,M,cfg)) return {changed:false,reply:`@${u.name} ما عندك صلاحية لهذا الأمر`};
 switch(c.cmd){
  case "request": { if(!c.arg) return {changed:false,reply:"اكتب اسم الأغنية بعد الأمر: !اغنية اسم الأغنية"}; const t=musicSearch(lib||M.lib,c.arg); const r=musicAdd(M,cfg,t,u,now,{via:"chat"}); return {changed:r.ok,reply:`@${u.name} ${r.reply}`} }
  case "queue": return {changed:false,reply:M.queue.length?M.queue.slice(0,5).map((q,i)=>`${i+1}. ${q.track.title}`).join(" | "):"القائمة فاضية"};
  case "current": return {changed:false,reply:M.current?`الحالية: ${M.current.track.title}${M.current.track.artist?" — "+M.current.track.artist:""} (طلب ${M.current.by.name})`:"لا توجد أغنية الآن"};
  case "skip": if(M.current) musicLog(M,now,"skip",{qid:M.current.qid,title:M.current.track.title,by:u.name}); musicNext(M,now,cfg); return {changed:true,reply:"تم التخطي ⏭"};
  case "pause": if(!M.current||M.paused) return {changed:false}; M.paused=true; M.status="paused"; return {changed:true,reply:"إيقاف مؤقت ⏸"};
  case "resume": if(!M.current||!M.paused) return {changed:false}; M.paused=false; M.status="loading"; return {changed:true,reply:"استئناف ▶"};
  case "volume": { const v=Math.round(+c.arg); if(!(v>=0&&v<=100)) return {changed:false,reply:"اكتب رقماً من 0 إلى 100"}; M.volume=v; return {changed:true,reply:`الصوت ${v}%`} }
  case "remove": { const i=Math.round(+c.arg)-1; if(!(i>=0&&i<M.queue.length)) return {changed:false,reply:"رقم غير موجود في القائمة"}; const [q]=M.queue.splice(i,1); return {changed:true,reply:`حُذفت «${q.track.title}»`} }
  case "clear": M.queue=[]; M.pending=[]; return {changed:true,reply:"تم مسح القائمة"};
  case "voteskip": { if(!cfg.voteSkip?.on||!M.current) return {changed:false}; const k=String(u.id||u.name); if(M.votes.includes(k)) return {changed:false,reply:`@${u.name} صوّتت مسبقاً`};
   M.votes.push(k); const need=Math.max(1,+cfg.voteSkip.needed||3); if(M.votes.length>=need){ musicNext(M,now,cfg); return {changed:true,reply:"اكتمل التصويت — تم التخطي ⏭"} } return {changed:true,reply:`تصويت التخطي ${M.votes.length}/${need}`} }
 } return null }

/** عمليات لوحة التحكم (صانع المحتوى) */
/** المشغل الفعلي (رابط OBS/LIVE Studio أو المتصفح): واحد فقط يملك التشغيل حتى لا تعمل أغنيتان معاً.
 * يتولى المشغل التشغيل إن لم يوجد مشغل، أو انقطع نبض المشغل الحالي 15 ثانية، أو طلب صانع المحتوى ذلك (force). */
export const MUSIC_PLAYER_STALE=15000;
export function musicPlayerOp(M,op,now,cfg={}){ musFix(M); const pid=String(op.pid||"").slice(0,40); if(!pid) return false; const P=M.player, mine=P&&P.pid===pid;
 if(op.op==="claim"){ if(mine){ P.at=now; return false } if(P&&now-P.at<MUSIC_PLAYER_STALE&&!op.force) return false; M.player={pid,kind:String(op.kind||"player").slice(0,20),at:now}; musicLog(M,now,"claim",{by:M.player.kind}); if(M.current&&!M.paused) M.status="loading"; return true }
 if(!mine) return false; P.at=now; const cur=M.current, same=cur&&String(op.qid||"")===cur.qid;
 if(op.op==="pstate"){ if(!same) return false; if(op.pos!=null) { cur.pos=Math.max(0,+op.pos||0); cur.posAt=now }
  const st=["loading","playing","paused"].includes(op.status)?op.status:null; if(st==="loading"&&!cur.ld){ cur.ld=1; musicLog(M,now,"loading",{qid:cur.qid,title:cur.track.title}); if(M.status==="loading") return true }
  if(!st||st===M.status) return false; M.status=st; if(st==="playing"){ M.err=""; musicLog(M,now,"playing",{qid:cur.qid,title:cur.track.title}) } return true }
 if(op.op==="pended"){ if(!same) return false; musicLog(M,now,"ended",{qid:cur.qid,title:cur.track.title}); musicNext(M,now,cfg); return true }
 if(op.op==="perror"){ if(!same) return false; const why=String(op.why||"تعذر تحميل ملف الأغنية").slice(0,160); M.err=why; cur.bad=1; /* لا تعود إليها بزر «السابق» */ musicLog(M,now,"error",{qid:cur.qid,title:cur.track.title,why}); musicNext(M,now,cfg); M.err=why; return true }
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
