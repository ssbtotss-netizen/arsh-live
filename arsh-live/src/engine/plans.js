// ====== الاشتراك: تجربة مجانية (افتراضياً 30 يوماً) ثم اشتراك واحد (افتراضياً $7 شهرياً) — كل القيم يتحكم بها المشرف ======
// الحالات: trial (تجربة كاملة) | active (مشترك) | expired (انتهت التجربة/الاشتراك → حدود مجانية) | comp (منحة إدارية)
export const BILLING_DEFAULTS={trialEnabled:true,trialDays:30,priceUsd:7,months:[1,3,12],
 limits:{full:{layouts:100,widgets:2000,platforms:4,actions:1000,reports:365,tts:true,ai:true,notify:true,watermark:false},
  expired:{layouts:1,widgets:12,platforms:1,actions:3,reports:3,tts:false,ai:false,notify:false,watermark:true}},
 perks:["كل التصاميم والعناصر بلا حدود عملية","كل المنصات + الشات الموحد","القارئ الصوتي والإجراءات التلقائية","إحصائيات نهاية البث والأرشيف","إشعارات Discord/Telegram","بدون علامة B6O6"]};
/** دمج إعدادات المشرف مع الافتراضيات مع حدود آمنة */
export function billingCfg(c){ c=c||{}; const d=BILLING_DEFAULTS;
 return {trialEnabled:c.trialEnabled!==undefined?!!c.trialEnabled:d.trialEnabled, trialDays:Math.max(0,Math.min(365,Math.round(+c.trialDays>=0&&c.trialDays!==""&&c.trialDays!=null?+c.trialDays:d.trialDays))),
  priceUsd:Math.max(1,Math.min(1000,Math.round((+c.priceUsd>0?+c.priceUsd:d.priceUsd)*100)/100)), months:d.months,
  limits:{full:{...d.limits.full},expired:{...d.limits.expired,...((c.limits&&c.limits.expired)||{}),...(c.expiredLimits||{})}}, perks:Array.isArray(c.perks)&&c.perks.length?c.perks.slice(0,12).map(String):d.perks} }
const ms=x=>x?new Date(x).getTime():0;
/** الحساب الجديد ينتظر أول بث لبدء التجربة — بحدّ أقصى لهذا الانتظار حتى لا تبقى الميزات مفتوحة بلا نهاية */
export const TRIAL_PENDING_CAP_DAYS=60;
/** بدء التجربة عند أول بث موثوق: يُعيد بيانات التحديث أو null إن لم تكن معلّقة */
export function trialStartPatch(u,cfg,now=Date.now()){ cfg=billingCfg(cfg); if(!u||!u.trialPending) return null; return {trialPending:false,trialEndsAt:new Date(now+cfg.trialDays*864e5).toISOString()} }
// ====== تصاميم PRO: تصاميم المرجع (r…) والحصرية (x…) — يُفرض على الخادم عند الحفظ ======
export const PRO_DESIGN_RE=/^[rx][A-Z][A-Za-z0-9]*$/;
export const isProDesign=d=>typeof d==="string"&&PRO_DESIGN_RE.test(d);
/** كل تصاميم PRO المستخدمة في مجموعة تخطيطات (type:design) */
export function proDesignsIn(layouts){ const out=new Set(); for(const l of (Array.isArray(layouts)?layouts:[])) for(const w of (Array.isArray(l&&l.widgets)?l.widgets:[])){ if(!w) continue; for(const k of ["design","tpl","alertDesign"]) if(isProDesign(w[k])) out.add(String(w.type||"")+":"+w[k]); if(w.levels&&typeof w.levels==="object") for(const lv of Object.values(w.levels)) if(lv&&isProDesign(lv.design)) out.add(String(w.type||"")+":"+lv.design) } return out }
/** تصاميم PRO الجديدة (غير المحفوظة سابقاً) لحساب غير مشترك — تبقى القديمة كما هي ولا تُحذف */
export function proViolations(u,next,prev,cfg,now){ if(subStatus(u,cfg,now).full) return []; const had=proDesignsIn(prev); return [...proDesignsIn(next)].filter(x=>!had.has(x)) }
/** نهاية التجربة: الحقل المحفوظ، أو تاريخ التسجيل + مدة التجربة الحالية للحسابات القديمة */
export function trialEnd(u,cfg){ cfg=billingCfg(cfg); if(u&&u.trialEndsAt) return ms(u.trialEndsAt); if(!cfg.trialEnabled||!u) return 0; return ms(u.createdAt||Date.now())+cfg.trialDays*864e5 }
/** حالة الحساب الآن */
export function subStatus(u,cfg,now=Date.now()){ cfg=billingCfg(cfg); const paid=ms(u&&u.planUntil), tEnd=trialEnd(u,cfg);
 if(u&&u.plan==="comp"&&(!paid||paid>now)) return {state:"comp",label:"منحة إدارية",until:paid||null,full:true};
 if(paid>now&&u.plan!=="free") return {state:"active",label:"مشترك",until:paid,full:true};
 if(u&&u.trialPending&&cfg.trialEnabled){ const cap=ms(u.createdAt||now)+TRIAL_PENDING_CAP_DAYS*864e5; if(cap>now) return {state:"pending",label:`التجربة (${cfg.trialDays} يوماً) تبدأ مع أول بث مباشر`,until:null,full:true,trialDays:cfg.trialDays} }
 if(tEnd>now) return {state:"trial",label:"فترة تجربة مجانية",until:tEnd,daysLeft:Math.ceil((tEnd-now)/864e5),full:true};
 return {state:"expired",label:paid?"انتهى الاشتراك":"انتهت فترة التجربة",until:paid||tEnd||null,full:false} }
export function planLimit(u,key,cfg,now){ cfg=billingCfg(cfg); return cfg.limits[subStatus(u,cfg,now).full?"full":"expired"][key] }
/** فحص حد: null = مسموح، وإلا رسالة عربية */
export function planCheck(u,key,count,cfg,now){ const L=planLimit(u,key,cfg,now), st=subStatus(u,cfg,now);
 if(typeof L==="boolean") return L?null:`هذه الميزة تحتاج اشتراكاً فعّالاً (${st.label})`; return count<=L?null:`${st.label}: الحد المسموح ${L} — اشترك لإزالة الحدود` }
/** تمديد الاشتراك بعد دفع مؤكد أو منحة: من نهاية الاشتراك الحالي إن لم ينتهِ، وإلا من الآن */
export function extendPlan(u,months=1,now=Date.now(),plan="pro"){ const cur=ms(u&&u.planUntil), base=cur>now?cur:now; const d=new Date(base); d.setUTCMonth(d.getUTCMonth()+months); return {plan,planUntil:d.toISOString()} }
export const priceCents=(cfg,months)=>Math.round(billingCfg(cfg).priceUsd*months*100);
