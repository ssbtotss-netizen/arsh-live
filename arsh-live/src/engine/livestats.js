// ====== إحصائيات البث المباشر (Live Statistics Collector) ======
// لكل منصة: المشاهدون الآن، إجمالي المشاهدات (إن وفّرته المنصة)، والدعم في جلسة البث الحالية بوحداته الأصلية:
//  • TikTok: كوينز الهدايا · YouTube: Super Chat بعملته · Twitch: Bits · Kick: Kicks · الدونيشن: بعملته.
// القواعد: لا تحويل للكوينز إلى دولار، لا جمع لعملات مختلفة، لا اختلاق لإحصائية لا توفرها المنصة (null = غير متاح).
// الدعم يُصفَّر مع كل جلسة بث جديدة (C.live.sid) ولا يتأثر بالانقطاع؛ التكرار ممنوع لأن الأحداث تصل بعد إزالة المكرر في الغرفة.

export const LS_PLATFORMS={tiktok:"TikTok",youtube:"YouTube",kick:"Kick",twitch:"Twitch",donation:"الدونيشن"};
/** ما توفره كل منصة فعلاً (للعرض «غير متاح» بدل رقم مختلق) */
export const LS_AVAIL={tiktok:{viewers:true,views:true},youtube:{viewers:true,views:true},kick:{viewers:true,views:false},twitch:{viewers:true,views:false},donation:{viewers:false,views:false}};
/** بعد هذه المدة بلا تحديث يُعتبر رقم المشاهدين قديماً (يظهر كحالة متوقفة) */
export const LS_STALE_MS=3*60_000;

const liveStBlank=()=>({viewers:null,views:null,viewersAt:0,peak:0,coins:0,money:{},bits:0,kicks:0,supportN:0,supportAt:0,on:false});
export function statsState(C){ const S=C.stats&&typeof C.stats==="object"?C.stats:(C.stats={}); if(!S.p||typeof S.p!=="object") S.p={};
 const sid=(C.live&&C.live.sid)||null;
 // جلسة بث جديدة: الدعم والمشاهدات والذروة تبدأ من الصفر — المشاهدون الآن يبقون حتى يصل رقم جديد
 if(S.sid!==sid){ for(const k of Object.keys(S.p)){ const o=S.p[k]; S.p[k]={...liveStBlank(),viewers:o.viewers,viewersAt:o.viewersAt,on:o.on} } S.sid=sid; S.since=(C.live&&(C.live.streamStart||C.live.startedAt))||null }
 return S }
const liveStP=(S,k)=>S.p[k]||(S.p[k]=liveStBlank());
/** حدث دعم وصل للغرفة (بعد إزالة المكرر) → يُضاف لدعم الجلسة بوحدته الأصلية */
export function statsOnEvent(C,ev,now){ if(!ev||ev.test||ev.sim) return false; const S=statsState(C); let p=null;
 if(ev.type==="gift"&&ev.platform!=="kick"&&ev.platform!=="donation"){ p=liveStP(S,ev.platform||"tiktok"); p.coins+=Math.max(0,+ev.value||0) }
 else if(ev.type==="gift"&&ev.platform==="kick"){ p=liveStP(S,"kick"); p.kicks+=Math.max(0,+ev.value||0) }
 else if(ev.type==="superchat"||ev.type==="donation"){ const k=ev.type==="donation"?"donation":(ev.platform||"youtube"); p=liveStP(S,k); const cur=String(ev.currency||"USD").toUpperCase().slice(0,8), a=Math.max(0,+ev.amount||0); p.money[cur]=Math.round(((p.money[cur]||0)+a)*100)/100 }
 else if(ev.type==="donation_refund"){ p=liveStP(S,"donation"); const cur=String(ev.currency||"USD").toUpperCase().slice(0,8), a=Math.max(0,+ev.amount||0); p.money[cur]=Math.max(0,Math.round(((p.money[cur]||0)-a)*100)/100) }
 else if(ev.type==="cheer"){ p=liveStP(S,"twitch"); p.bits+=Math.max(0,+ev.bits||+ev.count||0) }
 if(!p) return false; p.supportN++; p.supportAt=now; p.on=true; return true }
/** أرقام المشاهدين من المصدر المصرح به (null = لم توفرها المنصة — لا نخمّن) */
export function statsViewers(C,platform,{viewers,views}={},now){ const S=statsState(C), p=liveStP(S,platform); let ch=false;
 if(viewers!=null&&Number.isFinite(+viewers)&&+viewers>=0){ const v=Math.round(+viewers); if(v!==p.viewers) ch=true; p.viewers=v; p.viewersAt=now; if(v>p.peak) p.peak=v }
 if(views!=null&&Number.isFinite(+views)&&+views>=0){ const v=Math.round(+views); if(v!==p.views) ch=true; p.views=v }
 p.on=true; return ch }
/** منصة أُوقف اتصالها: أرقامها الحية تُعتبر غير متاحة (الدعم المجمّع يبقى) */
export function statsOffline(C,platform){ const S=statsState(C), p=S.p[platform]; if(!p) return false; p.viewers=null; p.viewersAt=0; return true }
/** الملخص: لكل منصة + المجمّع (المشاهدون = مجموع أعداد المنصات، وليس أشخاصاً فريدين) */
export function statsSummary(C,now){ const S=statsState(C), rows=[];
 for(const k of Object.keys(LS_PLATFORMS)){ const p=S.p[k]; if(!p||!p.on) continue; const av=LS_AVAIL[k]||{};
  const stale=p.viewers!=null&&p.viewersAt&&now-p.viewersAt>LS_STALE_MS;
  rows.push({k,name:LS_PLATFORMS[k],viewers:av.viewers?p.viewers:undefined,views:av.views?p.views:undefined,peak:p.peak||0,coins:k==="tiktok"?p.coins:undefined,bits:k==="twitch"?p.bits:undefined,kicks:k==="kick"?p.kicks:undefined,money:{...p.money},at:Math.max(p.viewersAt||0,p.supportAt||0),stale}) }
 const sum=(f)=>{ const v=rows.map(r=>r[f]).filter(x=>typeof x==="number"); return v.length?v.reduce((a,b)=>a+b,0):null };
 const money={}; for(const r of rows) for(const [c,a] of Object.entries(r.money||{})) money[c]=Math.round(((money[c]||0)+a)*100)/100;
 return {rows,since:S.since||null,total:{viewers:sum("viewers"),views:sum("views"),coins:sum("coins"),bits:sum("bits"),kicks:sum("kicks"),money}} }
