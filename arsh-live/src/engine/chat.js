// ====== الشات الموحد (Universal Live Chat): دوال نقية ======
// يجمع تعليقات TikTok + YouTube + Kick + Twitch من محرك الأحداث الموحد في قائمة واحدة.
// الرسائل تأتي فقط من أحداث فعلية؛ رسائل الاختبار مُعلَّمة ولا تُحفظ في سجل الغرفة.
import { normAr } from "./bots.js";

export const CHAT_MODES=[["all","شات موحد"],["tiktok","TikTok فقط"],["youtube","YouTube فقط"],["kick","Kick فقط"],["twitch","Twitch فقط"],["split","تقسيم حسب المنصة"],["rotate","متناوب بين المنصات"],["important","الرسائل المهمة فقط"]];
export const CHAT_PLATFORMS={tiktok:{name:"TikTok",color:"#ff0050"},youtube:{name:"YouTube",color:"#ff0000"},kick:{name:"Kick",color:"#53fc18"},twitch:{name:"Twitch",color:"#9146ff"},donation:{name:"دعم",color:"#22c55e"}};
const CHAT_EVENT_TYPES=new Set(["comment","superchat","cheer","gift","follow","subscribe","donation","share","raid"]);

/** يحوّل حدثاً موحداً إلى رسالة شات (أو null) */
export function chatMsgOf(ev){ if(!ev||!CHAT_EVENT_TYPES.has(ev.type)) return null; const u=ev.user||{};
 const m={id:String(ev.id||ev.type+"_"+(ev.at||Date.now())),platform:ev.platform||"tiktok",kind:ev.type==="comment"?"msg":ev.type,
  uid:String(u.id||u.name||ev.name||""),name:String(u.name||ev.name||"").slice(0,60),av:u.avatar||ev.avatar||"",
  mod:!!(u.mod||u.isModerator),sub:!!(u.sub||u.isSubscriber),owner:!!u.owner,at:ev.at||Date.now(),test:!!ev.test,text:""};
 if(ev.type==="comment") m.text=String(ev.text||"").slice(0,300);
 else if(ev.type==="gift"){ m.text=`أرسل ${ev.gift||"هدية"} ×${ev.count||1}`; m.value=ev.value||0 }
 else if(ev.type==="follow") m.text="تابع البث";
 else if(ev.type==="subscribe") m.text="اشترك في القناة";
 else if(ev.type==="share") m.text="شارك البث";
 else if(ev.type==="raid") m.text=`غارة بـ ${ev.viewers||0} مشاهد`;
 else if(ev.type==="cheer") m.text=`${ev.bits||ev.count||0} Bits${ev.text?" — "+String(ev.text).slice(0,200):""}`;
 else if(ev.type==="superchat"||ev.type==="donation"){ m.amount=ev.amount; m.currency=ev.currency; m.text=String(ev.text||ev.message||"").slice(0,300); if(ev.type==="donation"){ m.anonymous=!!ev.anonymous; if(m.anonymous) m.name="داعم مجهول" } }
 if(!m.name) return null;
 return m }

/** هل الرسالة «مهمة»؟ مشرف/مالك/مشترك/داعم/دعم مالي/ذكر المذيع/كلمة مفتاحية */
export function chatImportant(m,w={}){ if(m.mod||m.owner||m.kind==="superchat"||m.kind==="donation"||m.kind==="cheer"||m.kind==="raid") return true;
 if(m.kind==="gift"&&(m.value||0)>=(+w.importantGift||100)) return true; if(m.sub&&w.importantSubs!==false) return true;
 const kw=String(w.importantWords||"").split(/[,،\n]/).map(s=>normAr(s.trim())).filter(Boolean); const t=normAr(m.text||"");
 return kw.some(k=>t.includes(k)) }

/** منشئ مرشح لكل عنصر: المنصة، الكلمات المحظورة، التكرار، المهم فقط، أنواع الأحداث */
export function chatFilter(w,now=()=>Date.now()){ const seen=new Map();
 const banned=String(w.banned||"").split(/[,،\n]/).map(s=>normAr(s.trim())).filter(Boolean);
 return (m,mode)=>{ mode=mode||w.mode||"all"; if(!m) return null;
  if(CHAT_PLATFORMS[mode]&&m.platform!==mode) return null;
  if(m.kind!=="msg"&&w.showEvents===false) return null;
  if(m.kind!=="msg"&&Array.isArray(w.eventKinds)&&w.eventKinds.length&&!w.eventKinds.includes(m.kind)) return null;
  if(mode==="important"&&!chatImportant(m,w)) return null;
  let text=m.text;
  if(banned.length&&text){ const n=normAr(text); if(banned.some(b=>n.includes(b))){ if(w.bannedAction==="hide") return null; text=text.replace(new RegExp(banned.map(b=>b.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|"),"gi"),"***"); if(normAr(text)===n) text="•••" } }
  if(w.dedupe!==false&&m.kind==="msg"){ const k=m.uid+"|"+normAr(m.text); const t=now(), p=seen.get(k); if(p&&t-p<(+w.dedupeSec||30)*1000) return null; seen.set(k,t); if(seen.size>400){ const it=seen.keys(); for(let i=0;i<100;i++) seen.delete(it.next().value) } }
  return text===m.text?m:{...m,text} } }

/** سجل الغرفة: آخر 60 رسالة حقيقية (لإعادة الاتصال وفتح رابط OBS جديد) */
export function chatPush(list,ev,cap=60){ if(!ev||ev.test) return null; const m=chatMsgOf(ev); if(!m) return null; list.push(m); if(list.length>cap) list.splice(0,list.length-cap); return m }
