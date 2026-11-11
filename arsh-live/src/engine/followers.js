// ====== عداد المتابعين المباشر: مصادر البيانات (دوال نقية) ======
// الحالة محفوظة داخل C.followers (تُحفظ مع حالة المؤقتات على الخادم وتصل لكل الروابط).
// قاعدة الصدق: الرقم "موثّق" فقط إذا جاء من API رسمي؛ غير ذلك "تقديري" = عدد يدوي + متابعات مؤكدة من البث.
export const FC_PLATFORMS={
 tiktok:{name:"TikTok",unit:"متابع",units:"متابع",mono:"TT",color:"#fe2c55",sources:[["manual","يدوي + متابعات البث المباشر (تقديري)","ok"],["tiktok_live","تلقائي من بث TikTok LIVE — كل دقيقة، يشمل إلغاء المتابعة","ok"],["official","TikTok Display API (user.info.stats)","app"]]},
 youtube:{name:"YouTube",unit:"مشترك",units:"مشترك",mono:"YT",color:"#ff0000",sources:[["manual","يدوي (تقديري)","ok"],["youtube","YouTube Data API v3 — رسمي","server"]]},
 instagram:{name:"Instagram",unit:"متابع",units:"متابع",mono:"IG",color:"#e1306c",sources:[["manual","يدوي (تقديري)","ok"],["official","Instagram Graph API (حسابات الأعمال/صنّاع المحتوى)","app"]]},
 twitch:{name:"Twitch",unit:"متابع",units:"متابع",mono:"TW",color:"#9146ff",sources:[["manual","يدوي (تقديري)","ok"],["twitch","Twitch Helix API — رسمي","server"]]},
 kick:{name:"Kick",unit:"متابع",units:"متابع",mono:"KK",color:"#53fc18",dark:true,sources:[["manual","يدوي (تقديري)","ok"]]},
};
/** حالة كل مصدر كما تُعرض في لوحة التحكم */
export const FC_SOURCE_STATUS={ok:["يعمل الآن","ok"],server:["يعمل عند إضافة المفتاح على الخادم","warn"],app:["يحتاج تطبيق مطوّر معتمد من المنصة — غير مفعّل","bad"]};
export function newFollowers(){ return {} }
function slot(F,p){ return F[p]||(F[p]={value:0,base:0,at:0,setAt:0,source:"manual",verified:false,session:0,sessionStart:0,last:null,delta:0,goalHits:0}) }
/** أوامر لوحة التحكم: set (تعيين العدد يدوياً) | session (بدء جلسة جديدة) | official (قيمة من API رسمي على الخادم) | source */
export function followersOp(F,op,now){ const p=op.platform; if(!FC_PLATFORMS[p]) return false; const s=slot(F,p);
 switch(op.op){
  case "set": { const v=Math.max(0,Math.round(+op.value||0)); s.delta=v-s.value; s.value=v; s.test=0; s.base=v; s.setAt=now; s.at=now; if(s.source!=="manual"&&!op.keepSource) s.source="manual"; s.verified=false; return true }
  case "session": s.session=0; s.sessionStart=now; s.last=null; return true;
  case "source": s.source=String(op.source||"manual"); if(s.source==="manual") s.verified=false; return true;
  case "official": { const v=Math.max(0,Math.round(+op.value||0)); s.delta=v-s.value; if(s.sessionStart&&s.value) s.session+=Math.max(0,v-s.value); s.value=v; s.at=now; s.source=op.source||s.source; s.verified=true; s.err=null; return true }
  case "test": { const n=Math.round(+op.n||0); s.test=Math.max(0,(s.test||0)+n); s.delta=n; return true }
  case "clear_tests": s.test=0; s.delta=0; if(s.last&&s.last.test) s.last=null; return true;
  case "error": s.err=String(op.error||"").slice(0,200); s.errAt=now; return true;
 }
 return false;
}
/** متابعة مؤكدة من البث: تُضاف للعدد التقديري لـ TikTok فقط (لا تُضاف لرقم موثّق من API لتجنب العد المزدوج) */
export function followersOnEvent(F,ev,now){
 if(ev.type!=="follow"||!F.tiktok) return false; const s=F.tiktok;
 // بيانات الاختبار لا تُحسب كرقم حقيقي: تُعرض فوق العدد وتُمسح بزر أو عند تعيين العدد
 if(ev.test){ s.test=(s.test||0)+1; s.last={name:ev.user?.name||"",av:ev.user?.avatar||"",at:now,test:true}; s.delta=1; return true }
 s.session++; s.last={name:ev.user?.name||"",av:ev.user?.avatar||"",at:now};
 // يدوي: يُضاف للتقديري. مزامنة البث (tiktok_live): يُضاف فوراً ثم تصحّحه المزامنة الدورية (تشمل إلغاء المتابعة)
 if(s.source==="manual"||s.source==="tiktok_live"){ s.value++; s.delta=1; s.at=now } return true;
}
/** ما يُعرض في الواجهة = الرقم الحقيقي + متابعات الاختبار (إن وجدت) */
export function fcData(F,p){ const s=(F||{})[p]; if(!s) return null; const t=s.test||0; return {...s,real:s.value,value:s.value+t,session:s.session+t,platform:p,P:FC_PLATFORMS[p]} }
/** تنسيق الرقم: كامل / مختصر إنجليزي / مختصر عربي */
export function fcFormat(n,mode){ n=Math.max(0,Math.round(n||0));
 if(mode==="short"){ if(n>=1e6) return (+(n/1e6).toFixed(n<1e7?2:1))+"M"; if(n>=1e4) return (+(n/1e3).toFixed(n<1e5?1:0))+"K"; return n.toLocaleString("en-US") }
 if(mode==="ar"){ if(n>=1e6) return (+(n/1e6).toFixed(2))+" مليون"; if(n>=1e3) return (+(n/1e3).toFixed(1))+" ألف"; return String(n) }
 return n.toLocaleString("en-US") }
/** الهدف الحالي: التقدم يُحسب من نقطة بداية المرحلة إلى الهدف (وليس من الصفر دائماً)
 *  progress = clamp((current - start) / (target - start) * 100, 0, 100)
 *  المراحل: قائمة يحددها المستخدم (goalStages) أو زيادة ثابتة (goalStep) عند تفعيل الانتقال التلقائي */
export function fcGoal(w,value){ const t=Math.max(0,+w.goal||0); if(!w.goalOn||!t) return null;
 const st0=Math.max(0,+w.goalStart||0);
 const stages=String(w.goalStages||"").split(/[,،\s]+/).map(Number).filter(n=>n>0).sort((a,b)=>a-b);
 let start=st0<t?st0:0, target=t, level=0;
 if(w.goalAuto&&value>=t){
  if(stages.length){ const next=stages.find(n=>n>value&&n>t); const prev=[t,...stages].filter(n=>n<=value).pop(); if(next){ start=prev; target=next; level=stages.indexOf(next)+1 } else { start=st0<t?st0:0; target=Math.max(t,stages[stages.length-1]); level=stages.length } }
  else { const step=Math.max(1,+w.goalStep||Math.max(1,Math.round(t*.1))); level=Math.floor((value-t)/step)+1; target=t+level*step; start=target-step } }
 const span=Math.max(1,target-start);
 return {target,start,level,remaining:Math.max(0,target-value),pct:Math.min(100,Math.max(0,(value-start)/span*100)),done:value>=target} }
