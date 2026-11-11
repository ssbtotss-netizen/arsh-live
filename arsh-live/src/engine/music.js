// ====== نظام طلبات الأغاني (B6O6 Music Request): دوال نقية ======
// المصدر: مكتبة ملفات يرفعها صانع المحتوى (موسيقاه المرخّصة). لا نستخرج صوتاً من YouTube أو غيره.
// الحالة في C.music (تُحفظ مع حالة الغرفة). التشغيل الفعلي في لوحة التحكم (الجهاز الذي فيه الملفات).
import { normAr } from "./bots.js";

export const MUSIC_PERMS=[["owner","صانع المحتوى فقط"],["mods","المشرفون فقط"],["owner_mods","صانع المحتوى والمشرفون"],["subs","المشتركون"],["followers","المتابعون"],["all","جميع المشاهدين"],["custom","قائمة مستخدمين مخصصة"]];
export const MUSIC_CMDS={request:["!اغنية","!أغنية","!song","!طلب","!sr"],queue:["!queue","!قائمة"],current:["!current","!الحالية","!song?"],skip:["!skip","!سكب","!تخطي"],pause:["!pause","!ايقاف","!إيقاف"],resume:["!resume","!استئناف"],volume:["!volume","!صوت"],remove:["!remove","!حذف"],clear:["!clear","!مسح"],voteskip:["!voteskip","!تصويت"]};
/** أي صلاحية تحكم كل أمر (طلب الأغاني منفصل عن التخطي والصوت) */
const CMD_PERM={request:"request",queue:"info",current:"info",skip:"skip",pause:"control",resume:"control",volume:"control",remove:"control",clear:"control",voteskip:"vote"};
export function defaultMusicCfg(){ return {enabled:true,perms:{request:"all",info:"all",skip:"owner_mods",control:"owner_mods",vote:"all"},users:"",voteSkip:{on:true,needed:3},maxDurSec:420,perUser:2,cooldownSec:60,noRepeatMin:30,banned:"",autoplay:true,shuffle:false,duckTTS:true,volume:70,replies:true} }
export function newMusicState(){ return {queue:[],current:null,paused:false,volume:70,lib:[],votes:[],history:[],last:{},followers:[],seq:0} }

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

const muFmt=s=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`;
const who=u=>({id:String(u?.id||u?.name||""),name:String(u?.name||"").slice(0,60),platform:u?.platform||"tiktok"});

/** إضافة أغنية للطابور مع كل القيود — ترجع {ok, reply} */
export function musicAdd(M,cfg,track,u,now,{force}={}){ if(!track) return {ok:false,reply:"ما لقيت الأغنية في المكتبة"};
 const by=who(u), banned=String(cfg.banned||"").split(/[,،\n]/).map(s=>normAr(s.trim()).toLowerCase()).filter(Boolean);
 if(!force){
  if(banned.some(b=>normAr(track.title+" "+(track.artist||"")).toLowerCase().includes(b))) return {ok:false,reply:"هذه الأغنية محظورة"};
  if(cfg.maxDurSec&&track.dur>cfg.maxDurSec) return {ok:false,reply:`الأغنية أطول من الحد (${muFmt(cfg.maxDurSec)})`};
  if(M.queue.some(q=>q.track.id===track.id)||M.current?.track.id===track.id) return {ok:false,reply:"الأغنية موجودة في القائمة"};
  if(cfg.noRepeatMin&&M.history.some(h=>h.id===track.id&&now-h.at<cfg.noRepeatMin*60000)) return {ok:false,reply:"اشتغلت قبل شوي — جرّب أغنية ثانية"};
  if(cfg.perUser&&M.queue.filter(q=>q.by.id===by.id).length>=cfg.perUser) return {ok:false,reply:`عندك ${cfg.perUser} طلبات في القائمة`};
  const last=M.last[by.id]; if(cfg.cooldownSec&&last&&now-last<cfg.cooldownSec*1000) return {ok:false,reply:`انتظر ${Math.ceil((cfg.cooldownSec*1000-(now-last))/1000)} ث قبل طلب جديد`} }
 M.lastReq={name:by.name,id:by.id,platform:by.platform,title:track.title,at:now,qid:"q"+(M.seq+1)}; M.queue.push({qid:"q"+(++M.seq),track:{id:track.id,title:track.title,artist:track.artist||"",dur:track.dur||0,cover:track.cover||""},by,at:now}); M.last[by.id]=now;
 if(!M.current&&cfg.autoplay!==false) musicNext(M,now);
 return {ok:true,reply:`أُضيفت «${track.title}» — رقم ${M.current&&M.current.track.id===track.id?"الآن":M.queue.length}`} }

/** الانتقال للأغنية التالية */
export function musicNext(M,now,cfg={}){ if(M.current) M.history.unshift({id:M.current.track.id,at:now}); M.history.length=Math.min(M.history.length,50);
 let i=0; if(cfg.shuffle&&M.queue.length>1) i=Math.floor((now/1000)%M.queue.length);
 const q=M.queue.splice(i,1)[0]; M.current=q?{...q,startedAt:now,pos:0}:null; M.paused=false; M.votes=[]; return M.current }

/** حدث تعليق → أمر موسيقى. يرجع {changed, reply} */
export function musicOnEvent(M,cfg,ev,now){ if(!cfg||cfg.enabled===false) return null;
 if(ev.type==="follow"&&ev.user){ const k=String(ev.user.id||ev.user.name); if(!M.followers.includes(k)){ M.followers.push(k); if(M.followers.length>2000) M.followers.shift() } return null }
 if(ev.type!=="comment") return null; const c=parseMusicCmd(ev.text); if(!c) return null;
 const u={...(ev.user||{}),platform:ev.platform}; const perm=cfg.perms?.[CMD_PERM[c.cmd]]||"all";
 if(!musicPermOk(perm,u,M,cfg)) return {changed:false,reply:`@${u.name} ما عندك صلاحية لهذا الأمر`};
 switch(c.cmd){
  case "request": { if(!c.arg) return {changed:false,reply:"اكتب اسم الأغنية بعد الأمر: !اغنية اسم الأغنية"}; const t=musicSearch(M.lib,c.arg); const r=musicAdd(M,cfg,t,u,now); return {changed:r.ok,reply:`@${u.name} ${r.reply}`} }
  case "queue": return {changed:false,reply:M.queue.length?M.queue.slice(0,5).map((q,i)=>`${i+1}. ${q.track.title}`).join(" | "):"القائمة فاضية"};
  case "current": return {changed:false,reply:M.current?`الحالية: ${M.current.track.title}${M.current.track.artist?" — "+M.current.track.artist:""} (طلب ${M.current.by.name})`:"لا توجد أغنية الآن"};
  case "skip": musicNext(M,now,cfg); return {changed:true,reply:"تم التخطي ⏭"};
  case "pause": if(!M.current||M.paused) return {changed:false}; M.paused=true; return {changed:true,reply:"إيقاف مؤقت ⏸"};
  case "resume": if(!M.current||!M.paused) return {changed:false}; M.paused=false; return {changed:true,reply:"استئناف ▶"};
  case "volume": { const v=Math.round(+c.arg); if(!(v>=0&&v<=100)) return {changed:false,reply:"اكتب رقماً من 0 إلى 100"}; M.volume=v; return {changed:true,reply:`الصوت ${v}%`} }
  case "remove": { const i=Math.round(+c.arg)-1; if(!(i>=0&&i<M.queue.length)) return {changed:false,reply:"رقم غير موجود في القائمة"}; const [q]=M.queue.splice(i,1); return {changed:true,reply:`حُذفت «${q.track.title}»`} }
  case "clear": M.queue=[]; return {changed:true,reply:"تم مسح القائمة"};
  case "voteskip": { if(!cfg.voteSkip?.on||!M.current) return {changed:false}; const k=String(u.id||u.name); if(M.votes.includes(k)) return {changed:false,reply:`@${u.name} صوّتت مسبقاً`};
   M.votes.push(k); const need=Math.max(1,+cfg.voteSkip.needed||3); if(M.votes.length>=need){ musicNext(M,now,cfg); return {changed:true,reply:"اكتمل التصويت — تم التخطي ⏭"} } return {changed:true,reply:`تصويت التخطي ${M.votes.length}/${need}`} }
 } return null }

/** عمليات لوحة التحكم (صانع المحتوى) */
export function musicOp(M,op,now,cfg={}){ switch(op.op){
 case "lib": M.lib=(op.lib||[]).slice(0,1000).map(t=>({id:String(t.id),title:String(t.title||"").slice(0,120),artist:String(t.artist||"").slice(0,80),dur:+t.dur||0,cover:t.cover&&String(t.cover).length<200000?t.cover:""})); return true;
 case "add": return musicAdd(M,cfg,M.lib.find(t=>t.id===op.id),{id:"owner",name:op.name||"صانع المحتوى",owner:true},now,{force:true}).ok;
 case "next": case "ended": musicNext(M,now,cfg); return true;
 case "pause": if(M.current) M.paused=true; return true;
 case "resume": if(M.current) M.paused=false; return true;
 case "volume": M.volume=Math.max(0,Math.min(100,Math.round(+op.v||0))); return true;
 case "remove": M.queue=M.queue.filter(q=>q.qid!==op.qid); return true;
 case "move": { const i=M.queue.findIndex(q=>q.qid===op.qid); if(i<0) return false; const [q]=M.queue.splice(i,1); M.queue.splice(Math.max(0,Math.min(M.queue.length,i+(op.d||0))),0,q); return true }
 case "clear": M.queue=[]; return true;
 case "pos": if(M.current){ M.current.pos=+op.pos||0; M.current.posAt=now } return true;
 } return false }
