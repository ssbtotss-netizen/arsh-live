// ====== منشئ الإجراءات التلقائية (عندما ← إذا ← نفّذ): دوال نقية ======
// القواعد في إعدادات البوتات (cfg.actions) — الحالة والسجل في R.ACT (ذاكرة الغرفة).
import { normAr } from "./bots.js";

export const ACT_TRIGGERS=[["gift","هدية محددة"],["giftValue","قيمة هدية (نقاط)"],["follow","متابعة"],["likes","كل عدد من اللايكات"],["share","مشاركة"],["comment","أي تعليق"],["keyword","كلمة في التعليق"],["command","أمر شات (!أمر)"],["donation","دونيشن (مبلغ)"],["subscribe","اشتراك"],["goal","تحقيق هدف"],["join","دخول مشاهد"]];
export const ACT_TYPES=[["sound","تشغيل صوت"],["video","عرض فيديو"],["gif","عرض GIF"],["image","عرض صورة"],["text","عرض نص"],["tts","قراءة صوتية TTS"],["reply","رد في الشات (على الشاشة)"],["subAdd","زيادة السابثون"],["subSub","خصم السابثون"],["goalAdd","تحديث هدف"],["celebrate","تشغيل احتفال"],["discord","إشعار Discord"],["telegram","إشعار Telegram"],["songAdd","إضافة أغنية"],["songSkip","تخطي أغنية"]];
export const ACT_PERMS=[["all","الجميع"],["followers","المتابعون"],["subs","المشتركون"],["mods","المشرفون"],["owner","صانع المحتوى"]];
export const ACT_GOALS=[["likes","إجمالي اللايكات"],["giftsValue","نقاط الهدايا"],["follows","المتابعات الجديدة"],["donations","إجمالي الدونيشن"]];
let actSeq=0;
export function newActRule(o={}){ return {id:"r"+Date.now().toString(36)+(++actSeq),name:"قاعدة جديدة",enabled:true,priority:5,trigger:{type:"gift",giftId:"",minValue:1,every:100,text:"",minAmount:1,metric:"likes",target:1000},conds:{mode:"and",list:[]},cooldownSec:0,maxPerMin:0,run:"all",actions:[{t:"text",text:"شكراً {user} ❤️",dur:5}],...o} }
export function newActState(){ return {acc:{},last:{},win:{},goalsHit:{},seen:{},log:[]} }

const fill=(s,ev,extra={})=>String(s||"").replace(/\{user\}/g,(ev.user&&ev.user.name)||ev.name||"").replace(/\{gift\}/g,ev.gift||"").replace(/\{count\}/g,ev.count??"").replace(/\{amount\}/g,ev.amount??"").replace(/\{value\}/g,ev.value??"").replace(/\{text\}/g,ev.text||ev.message||"").replace(/\{platform\}/g,ev.platform||"").replace(/\{target\}/g,extra.target??"");

/** هل يطابق الحدث محفّز القاعدة؟ يرجع null أو {mult} */
function matchTrigger(r,ev,st,ctx){ const t=r.trigger||{}, u=ev.user||{};
 switch(t.type){
  case "gift": return ev.type==="gift"&&(!t.giftId||String(ev.giftId)===String(t.giftId)||normAr(ev.gift||"")===normAr(t.giftId))?{}:null;
  case "giftValue": return ev.type==="gift"&&(+ev.value||0)>=(+t.minValue||1)?{}:null;
  case "follow": case "share": case "subscribe": case "join": return ev.type===t.type?{}:null;
  case "comment": return ev.type==="comment"?{}:null;
  case "keyword": { if(ev.type!=="comment"||!t.text) return null; const ks=String(t.text).split(/[,،]/).map(s=>normAr(s.trim())).filter(Boolean); const tx=normAr(ev.text||""); return ks.some(k=>tx.includes(k))?{}:null }
  case "command": { if(ev.type!=="comment"||!t.text) return null; const c=String(t.text).trim().toLowerCase(); const head=String(ev.text||"").trim().split(/\s+/)[0].toLowerCase(); return head===(c.startsWith("!")?c:"!"+c)?{}:null }
  case "donation": return ev.type==="donation"&&(+ev.amount||0)>=(+t.minAmount||0)&&(!t.currency||t.currency===ev.currency)?{}:null;
  case "likes": { if(ev.type!=="like") return null; const every=Math.max(1,+t.every||100); const a=(st.acc[r.id]||0)+(+ev.count||0); const n=Math.floor(a/every); st.acc[r.id]=a-n*every; return n>0?{mult:Math.min(n,5)}:null }
  case "goal": { const tot=ctx.totals||{}; const v=+tot[t.metric]||0, tg=+t.target||0; if(!tg||v<tg||st.goalsHit[r.id]===tg) return null; st.goalsHit[r.id]=tg; return {target:tg} }
 } return null }
function permOk(p,u){ switch(p){ case "owner": return !!u.owner; case "mods": return !!(u.owner||u.mod); case "subs": return !!(u.owner||u.mod||u.sub); case "followers": return !!(u.owner||u.mod||u.sub||u.follower); default: return true } }
function condOk(c,ev){ const u=ev.user||{};
 switch(c.k){
  case "minValue": return (+ev.value||+ev.amount||+ev.count||0)>=(+c.v||0);
  case "users": { const L=String(c.v||"").split(/[,،\s]+/).map(s=>s.replace(/^@/,"").toLowerCase()).filter(Boolean); return L.includes(String(u.name||ev.name||"").toLowerCase())||L.includes(String(u.id||"").toLowerCase()) }
  case "perm": return permOk(c.v,u);
  case "platform": return !c.v||(ev.platform||"tiktok")===c.v;
  case "notTest": return !ev.test;
 } return true }

/**
 * تقييم كل القواعد على حدث. يرجع قائمة التنفيذ مرتبة بالأولوية: [{rule, actions:[...مملوءة], ev}]
 * ctx.totals لإجماليات البث (لمحفّز «تحقيق هدف»)، ctx.now للوقت.
 */
export function actionsOnEvent(A,rules,ev,ctx){ const now=ctx.now||Date.now(), out=[]; if(!rules||!rules.length) return out;
 const sorted=[...rules].filter(r=>r.enabled!==false).sort((a,b)=>(b.priority||0)-(a.priority||0));
 for(const r of sorted){ const m=matchTrigger(r,ev,A,ctx); if(!m) continue;
  const list=r.conds?.list||[]; const pass=!list.length||(r.conds.mode==="or"?list.some(c=>condOk(c,ev)):list.every(c=>condOk(c,ev)));
  if(!pass){ actLog(A,now,r,ev,[],false,"الشروط غير متحققة"); continue }
  if(r.cooldownSec&&A.last[r.id]&&now-A.last[r.id]<r.cooldownSec*1000){ actLog(A,now,r,ev,[],false,"وقت الانتظار لم ينتهِ"); continue }
  const win=(A.win[r.id]||[]).filter(t=>now-t<60000); if(r.maxPerMin&&win.length>=r.maxPerMin){ A.win[r.id]=win; actLog(A,now,r,ev,[],false,"تجاوز حد التكرار في الدقيقة"); continue }
  A.last[r.id]=now; win.push(now); A.win[r.id]=win;
  const acts=(r.run==="first"?(r.actions||[]).slice(0,1):(r.actions||[])).map(a=>({...a,text:a.text!=null?fill(a.text,ev,m):a.text,mult:m.mult||1}));
  out.push({rule:r,actions:acts,ev,mult:m.mult||1});
 } return out }

/** سجل التنفيذ: المحفز، المستخدم، الوقت، الإجراء، النتيجة، سبب الفشل */
export function actLog(A,now,r,ev,actions,ok,reason){ A.log.unshift({at:now,rule:r.name,ruleId:r.id,trigger:r.trigger?.type,user:(ev.user&&ev.user.name)||ev.name||"",test:!!ev.test,actions:actions.map(a=>a.t+(a.ok===false?"✗":"✓")).join(" "),ok,reason:reason||""}); if(A.log.length>150) A.log.length=150 }
