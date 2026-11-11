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
/** نهاية التجربة: الحقل المحفوظ، أو تاريخ التسجيل + مدة التجربة الحالية للحسابات القديمة */
export function trialEnd(u,cfg){ cfg=billingCfg(cfg); if(u&&u.trialEndsAt) return ms(u.trialEndsAt); if(!cfg.trialEnabled||!u) return 0; return ms(u.createdAt||Date.now())+cfg.trialDays*864e5 }
/** حالة الحساب الآن */
export function subStatus(u,cfg,now=Date.now()){ cfg=billingCfg(cfg); const paid=ms(u&&u.planUntil), tEnd=trialEnd(u,cfg);
 if(u&&u.plan==="comp"&&(!paid||paid>now)) return {state:"comp",label:"منحة إدارية",until:paid||null,full:true};
 if(paid>now&&u.plan!=="free") return {state:"active",label:"مشترك",until:paid,full:true};
 if(tEnd>now) return {state:"trial",label:"فترة تجربة مجانية",until:tEnd,daysLeft:Math.ceil((tEnd-now)/864e5),full:true};
 return {state:"expired",label:paid?"انتهى الاشتراك":"انتهت فترة التجربة",until:paid||tEnd||null,full:false} }
export function planLimit(u,key,cfg,now){ cfg=billingCfg(cfg); return cfg.limits[subStatus(u,cfg,now).full?"full":"expired"][key] }
/** فحص حد: null = مسموح، وإلا رسالة عربية */
export function planCheck(u,key,count,cfg,now){ const L=planLimit(u,key,cfg,now), st=subStatus(u,cfg,now);
 if(typeof L==="boolean") return L?null:`هذه الميزة تحتاج اشتراكاً فعّالاً (${st.label})`; return count<=L?null:`${st.label}: الحد المسموح ${L} — اشترك لإزالة الحدود` }
/** تمديد الاشتراك بعد دفع مؤكد أو منحة: من نهاية الاشتراك الحالي إن لم ينتهِ، وإلا من الآن */
export function extendPlan(u,months=1,now=Date.now(),plan="pro"){ const cur=ms(u&&u.planUntil), base=cur>now?cur:now; const d=new Date(base); d.setUTCMonth(d.getUTCMonth()+months); return {plan,planUntil:d.toISOString()} }
export const priceCents=(cfg,months)=>Math.round(billingCfg(cfg).priceUsd*months*100);
