// ====== مدة البث (Live Duration): الاحتساب من جلسة البث على الخادم + صياغات العرض ======
// البداية: وقت بدء البث الحقيقي من TikTok (create_time) إن توفر، وإلا بداية الجلسة المسجلة على الخادم، أو بداية يدوية.
// لا يعتمد على وقت فتح الصفحة: تحديث الصفحة/OBS وإعادة الاتصال لا تغيّر المدة. الانتهاء الفعلي يجمّد المدة.

/** بداية الاحتساب للجلسة الحالية (يدوي ← TikTok ← الجلسة) */
export function durStartOf(L){ if(!L) return null; const M=L.durMan; if(M&&M.at&&(M.sid==null||M.sid===L.sid)) return M.at; return L.sid?(L.streamStart||L.startedAt||null):null }
/** المدة الحالية: {ms (مع المتراكم إن فُعّل الاستمرار), cur (هذا البث فقط), acc, running, ended, src} */
export function durOf(C,now){ const L=(C&&C.live)||{}, M=L.durMan, man=!!(M&&M.at&&(M.sid==null||M.sid===L.sid));
 const start=durStartOf(L); let end=null;
 if(man&&M.stop) end=M.stop; else if(!man&&L.sid&&L.endedAt) end=L.endedAt;
 const cur=start?Math.max(0,(end||now)-start):0, acc=L.durCarry?Math.max(0,+L.durAcc||0):0;
 return {ms:cur+acc,cur,acc,running:!!start&&!end,ended:!!start&&!!end,idle:!start,src:man?"manual":L.streamStart?"tiktok":start?"session":"none",start} }

/** تقسيم المدة حسب المعادلات: إجمالي الساعات = ث÷3600، الأيام = ث÷86400، ساعات اليوم = إجمالي الساعات %24 */
export function durSplit(ms){ const s=Math.floor(Math.max(0,+ms||0)/1000); return {s,tm:Math.floor(s/60),th:Math.floor(s/3600),d:Math.floor(s/86400),h:Math.floor(s/3600)%24,m:Math.floor(s/60)%60,sec:s%60} }

export const DU_MODES=[
 ["auto","تلقائي — 19:22:18 ثم «1 يوم | 02:15:30» بعد 24 ساعة"],
 ["hours","الساعات فقط — 48:35:20"],
 ["hours_days","الساعات مع الأيام — 48 ساعة | يومان"],
 ["hours_days_detail","الساعات والأيام بالتفصيل — 53 ساعة | يومان و5 ساعات"],
 ["hms_days","الوقت الإجمالي مع الأيام — 48:35:20 | يومان"],
 ["days_time","الأيام مع الوقت — يومان | 05:20:15"],
 ["full","التفاصيل الكاملة — يومان | 5 ساعات | 30 دقيقة | 45 ثانية"],
 ["minimal","مختصر — 2D : 05H : 30M : 45S"],
 ["custom","عرض مخصص — تختار العناصر الظاهرة"]];

const p2=n=>String(n).padStart(2,"0");
/** صيغ العدد العربية: 1 مفرد، 2 مثنى، 3–10 جمع، 11+ مفرد */
const AR={d:["يوم","يومان","أيام","يوماً","يوم واحد"],h:["ساعة","ساعتان","ساعات","ساعة","ساعة واحدة"],m:["دقيقة","دقيقتان","دقائق","دقيقة","دقيقة واحدة"],s:["ثانية","ثانيتان","ثوانٍ","ثانية","ثانية واحدة"]};
const EN={d:["Day","Days"],h:["Hour","Hours"],m:["Minute","Minutes"],s:["Second","Seconds"]};
/**
 * عبارة «عدد + وحدة» كقطع: [{k:"n"|"u", t}] — n=رقم، u=كلمة
 * long: «يوم واحد» بدل «1 يوم» · unit=false: الرقم فقط (حتى «يومان» تصبح 2)
 */
export function durWord(n,kind,lang,{long=false,unit=true}={}){ const N=Math.max(0,Math.floor(+n||0));
 if(!unit) return [{k:"n",t:String(N)}];
 if(lang==="en") return [{k:"n",t:String(N)},{k:"u",t:" "+(N===1?EN[kind][0]:EN[kind][1])}];
 const w=AR[kind];
 if(N===0) return [{k:"n",t:"0"},{k:"u",t:" "+w[0]}];
 if(N===1) return long?[{k:"u",t:w[4]}]:[{k:"n",t:"1"},{k:"u",t:" "+w[0]}];
 if(N===2) return [{k:"u",t:w[1]}];
 if(N>=3&&N<=10) return [{k:"n",t:String(N)},{k:"u",t:" "+w[2]}];
 return [{k:"n",t:String(N)},{k:"u",t:" "+w[3]}] }
const tag=(arr,kind)=>arr.map(x=>({...x,c:kind}));
/** «يومان و5 ساعات» / «2 Days 5 Hours» */
function daysDetail(d,h,lang,o){ const a=tag(durWord(d,"d",lang,{long:true,unit:o.unitD}),"d"); if(!h) return a;
 return [...a,{k:"x",t:lang==="en"?" ":" و",c:"d"},...tag(durWord(h,"h",lang,{unit:o.unitH}),"h")] }

/**
 * يحوّل المدة إلى قطع عرض حسب طريقة العرض — كل قطعة {k:"n"|"u"|":"|"|"|"x", t, c:"d"|"h"|"m"|"s"}
 * o: {mode, lang, daysAlways, showD, showH, showM, showS, unitD, unitH, sep, dayDetail, totalH}
 */
export function duParts(ms,o={}){
 const lang=o.lang==="en"?"en":"ar", mode=o.mode||"auto", S=durSplit(ms);
 const showD=o.showD!==false, showH=o.showH!==false, showM=o.showM!==false, showS=o.showS!==false;
 const unitD=o.unitD!==false, unitH=o.unitH!==false, sep=o.sep!=null?String(o.sep):"|";
 const SEP=[{k:"|",t:` ${sep} `}], C={k:":",t:":"};
 const daysOn=showD&&(S.d>0||!!o.daysAlways);
 /** وقت HH:MM:SS — الساعات إجمالية أو ضمن اليوم، والمخفي يُدمج فيما قبله حتى لا يضيع وقت */
 const clock=(hoursTotal)=>{ const out=[];
  let H=hoursTotal?S.th:S.h, M=S.m, Sx=S.sec;
  if(!showH){ M=(hoursTotal?S.tm:S.tm-S.d*1440) } // بدون ساعات: الدقائق إجمالية
  if(showH){ out.push({k:"n",t:p2(H),c:"h"}) }
  if(showM){ if(out.length) out.push({...C,c:"m"}); out.push({k:"n",t:p2(M),c:"m"}) }
  if(showS){ if(out.length) out.push({...C,c:"s"}); out.push({k:"n",t:p2(Sx),c:"s"}) }
  return out };
 const dShort=()=>tag(durWord(S.d,"d",lang,{unit:unitD}),"d"), dLong=()=>tag(durWord(S.d,"d",lang,{long:true,unit:unitD}),"d");
 const hTot=()=>tag(durWord(S.th,"h",lang,{unit:unitH}),"h");
 switch(mode){
  case "hours": return clock(true);
  case "hours_days": return [...(showH?hTot():[]),...(daysOn&&showH?SEP:[]),...(daysOn?dLong():[])];
  case "hours_days_detail": return [...(showH?hTot():[]),...(daysOn&&showH?SEP:[]),...(daysOn?daysDetail(S.d,S.h,lang,{unitD,unitH}):[])];
  case "hms_days": return [...clock(true),...(daysOn?[...SEP,...(o.dayDetail?daysDetail(S.d,S.h,lang,{unitD,unitH}):dLong())]:[])];
  case "days_time": return [...(showD?dShort():[]),...(showD?SEP:[]),...clock(!showD)];
  case "full": { const parts=[]; const add=a=>{ if(parts.length) parts.push(...SEP); parts.push(...a) };
   if(daysOn) add(dLong()); if(showH) add(tag(durWord(daysOn?S.h:S.th,"h",lang,{unit:unitH}),"h"));
   if(showM) add(tag(durWord(showH?S.m:S.tm,"m",lang),"m")); if(showS) add(tag(durWord(S.sec,"s",lang),"s")); return parts }
  case "minimal": { const L=lang==="en"?{d:"D",h:"H",m:"M",s:"S"}:{d:"ي",h:"س",m:"د",s:"ث"}, parts=[]; const add=(n,k)=>{ if(parts.length) parts.push({k:":",t:" : ",c:k}); parts.push({k:"n",t:n,c:k},{k:"u",t:L[k],c:k}) };
   if(daysOn) add(String(S.d),"d"); if(showH) add(p2(daysOn?S.h:S.th),"h"); if(showM) add(p2(showH?S.m:S.tm),"m"); if(showS) add(p2(S.sec),"s"); return parts }
  case "custom": { const tot=!!o.totalH||!daysOn; return [...(daysOn?[...dShort(),...SEP]:[]),...clock(tot)] }
  default: // auto: أقل من يوم «19:22:18»، ومن 24 ساعة «1 يوم | 02:15:30» — الساعات لا تُصفّر دون زيادة الأيام
   return daysOn?[...dShort(),...SEP,...clock(false)]:clock(true) }
}
/** النص الكامل (للسجل والاختبارات وقارئ الشاشة) */
export const durText=(ms,o)=>duParts(ms,o).map(p=>p.t).join("");
/** خيارات العرض من إعدادات العنصر */
export const durOpts=w=>({mode:w.duMode||"auto",lang:w.duLang==="en"?"en":"ar",daysAlways:!!w.duDaysAlways,showD:w.duShowD!==false,showH:w.duShowH!==false,showM:w.duShowM!==false,showS:w.duShowS!==false,unitD:w.duUnitD!==false,unitH:w.duUnitH!==false,sep:w.duSep??"|",dayDetail:!!w.duDayDetail,totalH:!!w.duTotalH});
