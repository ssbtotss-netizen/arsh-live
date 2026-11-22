// ====== سلاسل هدايا TikTok (Gift Streak) + سجل الهدايا التشخيصي ======
// TikTok يرسل لنفس السلسلة تحديثات متتابعة بعدد تراكمي (1 → 3 → 5 → 8) ثم حدثاً نهائياً بنفس العدد.
// نحتسب فقط «الزيادة الجديدة» (الفرق عن آخر عدد محتسب) لكل سلسلة — فوراً، بدون انتظار الحدث النهائي —
// فلا تضيع الهدايا إذا لم يصل الحدث النهائي أو انقطع الاتصال، ولا تُحتسب الهدية نفسها مرتين.
// الحالة تُحفظ داخل C.gs مع حالة السبثون (تتحمل إعادة تشغيل الخادم).

/** نافذة تكرار الحدث النهائي لسلسلة بدون معرّف مجموعة: النهائي يصل عادةً بعد ~3 ثوانٍ من آخر تحديث */
export const GS_SAME_MS=10_000;
/** عمر حالة السلسلة: بعدها تُحذف (السلاسل الحقيقية تنتهي خلال ثوانٍ) */
export const GS_TTL_MS=30*60_000;
const GS_CAP=600, GLOG_CAP=80;

export function gsState(C){ C.gs=C.gs&&typeof C.gs==="object"?C.gs:{}; C.gs.s=C.gs.s||{}; C.glog=Array.isArray(C.glog)?C.glog:[]; return C.gs }
function gsPrune(G,now){ const ks=Object.keys(G.s); for(const k of ks) if(now-(G.s[k].at||0)>GS_TTL_MS) delete G.s[k];
 const left=Object.keys(G.s); if(left.length>GS_CAP){ left.sort((a,b)=>G.s[a].at-G.s[b].at); for(const k of left.slice(0,left.length-GS_CAP)) delete G.s[k] } }
const gsStr=v=>v==null?"":String(v);

/**
 * يحوّل حدث هدية من TikTok يحمل معلومات السلسلة (ev.streak = {cum, gc, end, type, group}) إلى حدث بالزيادة الجديدة فقط.
 * يرجع {ev: الحدث المعدّل أو null إن لم توجد زيادة, diag: بيانات سجل الهدايا}
 * الأحداث بدون ev.streak (تجربة/منصات أخرى) تمر كما هي.
 */
export function giftStreak(C,ev,now){
 const st=ev&&ev.streak;
 const base={at:now,user:(ev.user&&(ev.user.name||ev.user.id))||"",gift:ev.gift||"هدية",giftId:ev.giftId??null,img:ev.image||"",test:!!ev.test,sim:!!ev.sim};
 if(!st||typeof st!=="object"){ const n=Math.max(1,+ev.count||1); return {ev,diag:{...base,sent:n,counted:n,coins:ev.diamonds!=null&&ev.diamonds!==""?(+ev.diamonds||0)*n:null,raw:null}} }
 const G=gsState(C); gsPrune(G,now);
 const gc=Math.max(1,Math.floor(+st.gc||1)); // عدد الهدايا في الضغطة الواحدة (إرسال متعدد) إن أرسله TikTok
 const cum=Math.max(1,Math.floor(+st.cum||1))*gc; // العدد التراكمي للسلسلة
 const group=gsStr(st.group)==="0"?"":gsStr(st.group);
 const key=`${(ev.user&&ev.user.id)||"?"}|${ev.giftId??ev.gift??"?"}|${group}`;
 let s=G.s[key], prev=0, fresh=!s;
 if(s){
  if(!group){ // بدون معرّف مجموعة: نميّز السلسلة الجديدة من تكرار السابقة
   if(cum<s.cum) fresh=true; // العدد رجع للبداية = سلسلة جديدة
   else if(cum===s.cum&&now-s.at>GS_SAME_MS) fresh=true; // نفس العدد بعد مدة طويلة = إرسال جديد
  }
  if(!fresh) prev=s.cum;
 }
 if(fresh) s=G.s[key]={cum:0,at:now,end:false,n:s?(s.n||0)+1:0};
 const raw={cum:+st.cum||1,gc,end:!!st.end,type:st.type??null,group:group?group.slice(-6):""};
 const add=cum-prev;
 s.at=now; if(st.end) s.end=true;
 if(add<=0){ const late=cum<prev;
  return {ev:null,diag:{...base,sent:cum,counted:0,status:late?"late":"dup",why:late?"تحديث متأخر لسلسلة محتسبة (أقل من آخر عدد)":(st.end?"الحدث النهائي للسلسلة — كل هداياها محتسبة مسبقاً":"تكرار لنفس العدد — محتسب مسبقاً"),raw}} }
 s.cum=cum;
 const diamonds=ev.diamonds!=null?+ev.diamonds:null;
 const out={...ev,count:add,value:diamonds!=null?diamonds*add:(+ev.value>0?Math.round((+ev.value)/cum*add):0),streakTotal:cum,
  id:`gs:${key}#${s.n||0}:${cum}`}; // معرّف ثابت لكل (سلسلة، عدد): إعادة إرسال نفس التحديث لا تضيف مرتين حتى بعد إعادة التشغيل
 delete out.streak;
 return {ev:out,diag:{...base,sent:cum,counted:add,coins:diamonds!=null?diamonds*add:null,raw}};
}

/** يكمل سجل الهدايا بنتيجة السبثون ويضيفه (الأحدث أولاً) */
export function glogPush(C,diag,res){
 const it={...diag,id:"gl"+(diag.at||0).toString(36)+Math.random().toString(36).slice(2,6)};
 if(res){ it.ms=res.ms||0; if(!it.status) it.status=res.ms?"added":"none"; if(!it.why&&!res.ms) it.why=res.why||"" }
 gsState(C); C.glog.unshift(it); if(C.glog.length>GLOG_CAP) C.glog.length=GLOG_CAP;
 if(it.counted>0&&!it.test&&!it.sim){ const T=gsTotals(C); T.gifts+=it.counted; T.coins+=+it.coins||0; T.events++; if(it.ms) T.ms+=it.ms; T.last=it.at }
 return it;
}
/** مجاميع السبثون الحالي من هدايا TikTok الحقيقية (تُصفّر مع كل بدء جديد للسبثون) — التجارب لا تُحتسب */
export function gsTotals(C){ const G=gsState(C), sa=(C.subathon&&C.subathon.startedAt)||0; if(!G.tot||G.tot.sa!==sa) G.tot={sa,coins:0,gifts:0,events:0,ms:0,last:0}; return G.tot }
export const GLOG_STATUS={added:"✅ أُضيف",none:"⚪ بدون وقت",dup:"🔁 مكرر",late:"⏪ متأخر"};
