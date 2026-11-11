// ====== محرك الدونيشن (التبرعات المالية) ======
// منفصل تماماً عن هدايا TikTok: لا تُجمع المبالغ بالريال مع نقاط الهدايا، ولا تُجمع عملات مختلفة في رقم واحد.
// كل تبرع له معرّف ثابت (المزوّد + معرّف العملية) يمنع احتسابه مرتين، والاسترجاع يُخصم من الإحصائيات والأهداف.

export const CURRENCIES={SAR:{sym:"ر.س",name:"ريال سعودي",dec:2},USD:{sym:"$",name:"دولار",dec:2},EUR:{sym:"€",name:"يورو",dec:2},AED:{sym:"د.إ",name:"درهم",dec:2},KWD:{sym:"د.ك",name:"دينار كويتي",dec:3},QAR:{sym:"ر.ق",name:"ريال قطري",dec:2},BHD:{sym:"د.ب",name:"دينار بحريني",dec:3},OMR:{sym:"ر.ع",name:"ريال عماني",dec:3},GBP:{sym:"£",name:"جنيه",dec:2}};
export const PROVIDERS={
 moyasar:{name:"ميسّر Moyasar",kind:"صفحة تبرع + Webhook",supported:true,note:"مزود دفع سعودي: مدى، Apple Pay، STC Pay، البطاقات. التبرع يُحتسب بعد التحقق من حالة الدفع paid عبر API ميسّر، والاسترجاع يصل عبر Webhook."},
 streamlabs:{name:"Streamlabs",kind:"Socket API الرسمي",supported:true,note:"يتطلب Socket API Token من إعدادات Streamlabs. يصل حدث donation فقط بعد إتمام الدفع. لا يرسل Streamlabs أحداث الاسترجاع عبر هذا الاتصال."},
 streamelements:{name:"StreamElements",kind:"Astro WebSocket الرسمي",supported:true,note:"اشتراك في channel.tips باستخدام JWT أو OAuth2 أو Overlay Token. يُحتسب التبرع فقط إذا كانت حالته success ومسموح به."},
 streampay:{name:"StreamPay (سعودي)",kind:"Webhook بتوقيع HMAC",supported:false,note:"غير مدعوم حالياً — مخطط لإضافته لاحقاً."},
 paypal:{name:"PayPal مباشر",kind:"—",supported:false,note:"غير مدعوم حالياً — يمكن استقبال تبرعات PayPal عبر Streamlabs أو StreamElements."},
 kofi:{name:"Ko-fi",kind:"—",supported:false,note:"غير مدعوم حالياً."},
};
export const PERIODS=[["session","البث الحالي"],["day","اليوم"],["week","الأسبوع"],["month","الشهر"],["all","جميع الأوقات"]];
export const WEEKDAYS=["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];

export function fmtMoney(v,cur="SAR"){ const c=CURRENCIES[cur]||{sym:cur,dec:2}; const n=Number(v)||0;
 const s=n.toLocaleString("en-US",{minimumFractionDigits:n%1?Math.min(2,c.dec):0,maximumFractionDigits:c.dec}); return `${s} ${c.sym}` }
export function newGoal(o={}){ return Object.assign({id:"dg_"+Math.random().toString(36).slice(2,9),name:"هدف تطوير معدات البث",target:1000,currency:"SAR",base:0,auto:true,startAt:null,endAt:null,paused:false,celebrate:true},o) }
export function defaultDonCfg(){ return {
 currency:"SAR",tz:"Asia/Riyadh",weekStart:0,hideAnon:false,anonName:"داعم مجهول",
 goals:[newGoal()],
 alert:{minAmount:1,durationSec:6,showMessage:true,template:"{name} دعم البث بـ {amount}!",sound:true},
 tiers:[{min:0,emoji:"💚",fx:"basic",name:"عادي"},{min:50,emoji:"🔥",fx:"fire",name:"قوي"},{min:200,emoji:"👑",fx:"royal",name:"ملكي"},{min:1000,emoji:"💎",fx:"legend",name:"أسطوري"}],
} }
export function emptyDonations(){ return {list:[],sessionStart:Date.now()} }
const net=d=>d.status==="pending"?0:Math.max(0,(+d.amount||0)-(+d.refunded||0));
export const donNet=net;

/** تطبيق حدث تبرع أو استرجاع. يرجع true إذا تغيّر شيء */
export function applyDonation(DN,ev){
 if(ev.type==="donation"){
  if(!ev.id||DN.list.some(d=>d.id===ev.id)) return false; // منع التكرار بمعرّف العملية
  if(ev.status&&ev.status!=="confirmed") return false; // المعلّق لا يُحتسب
  const amount=Math.round((+ev.amount||0)*1000)/1000; if(!(amount>0)) return false;
  DN.list.push({id:ev.id,provider:ev.provider||"test",name:String(ev.name||"").slice(0,60),anonymous:!!ev.anonymous,avatar:ev.avatar||"",amount,currency:String(ev.currency||"SAR").toUpperCase(),message:String(ev.message||"").slice(0,300),status:"confirmed",refunded:0,test:!!ev.test,t:ev.t||Date.now()});
  if(DN.list.length>20000) DN.list.splice(0,DN.list.length-20000);
  return true }
 if(ev.type==="donation_refund"){ const d=DN.list.find(x=>x.id===ev.id); if(!d) return false;
  const amt=ev.amount==null?d.amount:Math.min(d.amount,+ev.amount||0); if(amt<=d.refunded) return false;
  d.refunded=amt; d.status=d.refunded>=d.amount?"refunded":"partially_refunded"; return true }
 if(ev.type==="donation_session"){ DN.sessionStart=ev.t||Date.now(); return true }
 if(ev.type==="donation_clear_tests"){ const n=DN.list.length; DN.list=DN.list.filter(d=>!d.test); return n!==DN.list.length }
 return false;
}
/** مفتاح الفترة بالمنطقة الزمنية التي يحددها صانع المحتوى (اليوم/الأسبوع ببداية قابلة للتحديد/الشهر) */
export function periodKey(t,tz,period,weekStart=0){
 let p; try{ p=Object.fromEntries(new Intl.DateTimeFormat("en-US",{timeZone:tz||"UTC",year:"numeric",month:"2-digit",day:"2-digit",weekday:"short"}).formatToParts(new Date(t)).map(x=>[x.type,x.value])) }catch(e){ return periodKey(t,"UTC",period,weekStart) }
 if(period==="month") return p.year+"-"+p.month;
 if(period==="day") return p.year+"-"+p.month+"-"+p.day;
 if(period==="week"){ const wd=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(p.weekday); const back=(wd-weekStart+7)%7; const d=new Date(Date.UTC(+p.year,+p.month-1,+p.day-back)); return "W"+d.toISOString().slice(0,10) }
 return "all";
}
function inPeriod(d,o){ if(o.period==="all") return true; if(o.period==="session") return d.t>=(o.sessionStart||0); return periodKey(d.t,o.tz,o.period,o.weekStart)===periodKey(o.now,o.tz,o.period,o.weekStart) }
export function displayName(d,cfg){ return d.anonymous||(!d.name)?(cfg&&cfg.anonName||"داعم مجهول"):d.name }

/** مجموع كل داعم في فترة وعملة محددة (المجهولون لا يُدمجون معاً) */
export function donorTotals(DN,cfg,o){
 const cur=o.currency||cfg.currency, m={};
 for(const d of DN.list){ if(d.currency!==cur||!inPeriod(d,{...o,tz:cfg.tz,weekStart:cfg.weekStart,sessionStart:DN.sessionStart})) continue; if(o.excludeTests&&d.test) continue;
  const v=net(d); if(!v) continue;
  const anon=d.anonymous||!d.name; const k=anon?"anon:"+d.id:"n:"+d.name.toLowerCase();
  const r=m[k]||(m[k]={k,name:displayName(d,cfg),av:anon?"":d.avatar,v:0,c:0,anon}); r.v+=v; r.c++ }
 return Object.values(m).filter(r=>!(o.hideAnon&&r.anon)).sort((a,b)=>b.v-a.v);
}
export function recentDonations(DN,cfg,o={}){ return DN.list.filter(d=>net(d)>0&&(!o.currency||d.currency===o.currency)&&!(o.hideAnon&&(d.anonymous||!d.name))).slice(-(o.limit||20)).reverse() }
export function goalProgress(g,DN,now){
 let cur=+g.base||0;
 if(g.auto&&!g.paused) for(const d of DN.list){ if(d.currency!==g.currency) continue; if(g.startAt&&d.t<g.startAt) continue; if(g.endAt&&d.t>g.endAt) continue; if(g.countedFrom&&d.t<g.countedFrom) continue; cur+=net(d) }
 const target=Math.max(0.01,+g.target||1);
 return {current:Math.round(cur*100)/100,target,pct:Math.min(100,cur/target*100),remaining:Math.max(0,target-cur),reached:cur>=target};
}
/** الإحصائيات المالية: التبرعات المؤكدة فقط، بدون التجريبية، ولكل عملة على حدة */
export function donationStats(DN,cfg,now){
 const by={};
 for(const d of DN.list){ if(d.test) continue; const v=net(d); const c=by[d.currency]||(by[d.currency]={currency:d.currency,total:0,today:0,week:0,month:0,count:0,max:0,maxDon:null,refunded:0,byProvider:{}});
  c.refunded+=+d.refunded||0; if(!v) continue;
  c.total+=v; c.count++; if(d.amount>c.max){c.max=d.amount;c.maxDon=d}
  c.byProvider[d.provider]=(c.byProvider[d.provider]||0)+v;
  const o={tz:cfg.tz,weekStart:cfg.weekStart,now};
  if(periodKey(d.t,o.tz,"day",o.weekStart)===periodKey(now,o.tz,"day",o.weekStart)) c.today+=v;
  if(periodKey(d.t,o.tz,"week",o.weekStart)===periodKey(now,o.tz,"week",o.weekStart)) c.week+=v;
  if(periodKey(d.t,o.tz,"month",o.weekStart)===periodKey(now,o.tz,"month",o.weekStart)) c.month+=v }
 for(const c of Object.values(by)) c.top=donorTotals(DN,cfg,{period:"all",currency:c.currency,now,excludeTests:true})[0]||null;
 return Object.values(by);
}
export function tierFor(cfg,amount){ const t=[...(cfg.tiers||[])].sort((a,b)=>b.min-a.min).find(x=>amount>=x.min); return t||{min:0,emoji:"💚",fx:"basic"} }
export function alertText(cfg,d){ return String(cfg.alert.template||"{name} دعم البث بـ {amount}!").replace("{name}",displayName(d,cfg)).replace("{amount}",fmtMoney(d.amount,d.currency)) }
