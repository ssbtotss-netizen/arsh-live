// ====== جلسات البث (Live Session Management) ======
// كل بث TikTok LIVE له roomId فريد — هو معرّف الجلسة الحقيقي:
//  • نفس roomId بعد انقطاع/إعادة اتصال/إعادة تشغيل الخادم = نفس الجلسة → لا تصفير.
//  • roomId مختلف = بث جديد → تُغلق الجلسة السابقة (تُحفظ إحصائياتها) وتُصفّر بيانات الجلسة فقط.
// الإعدادات الدائمة (التصاميم، الألوان، الأهداف المحددة، قواعد السبثون ووقته) لا تُلمس هنا أبداً.
// الحالة في C.live (تُحفظ مع حالة الغرفة في قاعدة البيانات).

export const SESS_HISTORY_CAP=20;
/** بدون roomId موثوق: بث جديد فقط إذا انتهى السابق منذ هذه المدة على الأقل */
export const SESS_NOID_GAP_MS=5*60_000;
/** نطاقات البيانات القابلة للتصفير — التكبيس دائماً، والباقي حسب اختيار صانع المحتوى */
export const SESS_SCOPES=[["likes","التكبيس والإعجابات (العدد، الترتيب، آخر وأكثر مكبس، أهداف وتحدي التكبيس)",true],["gifts","قوائم الهدايا والداعمين لهذا البث",false],["comments","التعليقات",false],["follows","المتابعون الجدد",false]];

export function liveState(C){ const L=C.live&&typeof C.live==="object"?C.live:(C.live={});
 if(L.auto===undefined) L.auto=true; if(L.keep===undefined) L.keep=true;
 if(!Array.isArray(L.history)) L.history=[]; if(!L.scopes||typeof L.scopes!=="object") L.scopes={gifts:false,comments:false,follows:false};
 return L }
const sid=now=>"s"+now.toString(36)+Math.random().toString(36).slice(2,6);
/** إحصائيات الجلسة (لحفظها عند إغلاقها) */
export function sessStats(D){ const t=(D&&D.tot)||{}, top=Object.values((D&&D.likes)||{}).sort((a,b)=>b.v-a.v).slice(0,5).map(x=>({name:x.name,v:x.v}));
 return {likes:t.likes||0,likers:Object.keys((D&&D.likes)||{}).length,gifts:t.gifts||0,giftCount:t.giftCount||0,comments:t.comments||0,follows:t.follows||0,topLikers:top} }
/** النسخة المرسلة للواجهات (بدون تفاصيل داخلية زائدة) */
export function sessPublic(L){ return L?{sid:L.sid||null,roomId:L.roomId||null,startedAt:L.startedAt||null,endedAt:L.endedAt||null,endWhy:L.endWhy||"",source:L.source||"",auto:L.auto!==false,keep:L.keep!==false,scopes:{...(L.scopes||{})},history:(L.history||[]).slice(0,SESS_HISTORY_CAP)}:null }

/** يغلق الجلسة الحالية ويحفظ إحصائياتها (لا يصفّر شيئاً) */
export function sessClose(L,D,now,why){ if(!L.sid||L.endedAt) return false; L.endedAt=now; L.endWhy=why||"";
 if(L.keep!==false){ L.history=L.history.filter(h=>h.sid!==L.sid); L.history.unshift({sid:L.sid,roomId:L.roomId||null,startedAt:L.startedAt,endedAt:now,why:why||"",...sessStats(D)}); if(L.history.length>SESS_HISTORY_CAP) L.history.length=SESS_HISTORY_CAP }
 return true }

/**
 * قرار الجلسة عند الاتصال بالبث: {act:"same"|"new"|"resume"|"first"}
 *  same: نفس roomId والجلسة مفتوحة · resume: نفس roomId بعد «انتهاء» (انقطاع ظن أنه نهاية) → يعاد فتحها بدون تصفير
 *  new: roomId مختلف (أو بدون معرّف وانتهى السابق منذ مدة كافية) · first: أول جلسة مسجلة لهذه الغرفة
 */
export function sessDecide(L,roomId,now){ const id=roomId!=null&&roomId!==""?String(roomId):null;
 if(!L.sid) return {act:"first",id};
 if(id&&L.roomId){ if(id===String(L.roomId)) return {act:L.endedAt?"resume":"same",id}; return {act:"new",id} }
 if(id&&!L.roomId) return {act:L.endedAt?"new":"same",id}; // جلسة يدوية سابقة بلا معرّف: إن كانت مفتوحة نربطها بهذا البث
 // لا يوجد معرّف موثوق من المصدر: لا تصفير بسبب انقطاع — فقط إذا انتهى البث السابق فعلاً ومر وقت كافٍ
 if(L.endedAt&&now-L.endedAt>=SESS_NOID_GAP_MS) return {act:"new",id:null};
 return {act:L.endedAt?"resume":"same",id:null} }

export function sessOpen(L,{roomId=null,now,source="tiktok"}){ L.sid=sid(now); L.roomId=roomId!=null?String(roomId):null; L.startedAt=now; L.endedAt=null; L.endWhy=""; L.source=source; return L.sid }
