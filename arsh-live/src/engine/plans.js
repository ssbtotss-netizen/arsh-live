// ====== الباقات والاشتراكات (دوال نقية — تُستخدم في الخادم ولوحة التحكم) ======
// الأسعار بالدولار شهرياً. الحدود تُطبَّق على الخادم؛ الواجهة تعرضها فقط.
export const PLANS=[
 {id:"free",name:"مجانية",price:0,color:"#94a3b8",limits:{layouts:1,widgets:12,platforms:1,actions:3,musicTracks:20,reports:3,customDesigns:2,tts:false,ai:false,watermark:true,notify:false},
  perks:["تصاميم آخر التفاعلات الأساسية","مشهد واحد و12 عنصراً","منصة واحدة (TikTok)","آخر 3 تقارير بث"]},
 {id:"starter",name:"المبتدئ",price:5,color:"#22d3ee",limits:{layouts:3,widgets:40,platforms:2,actions:15,musicTracks:200,reports:15,customDesigns:10,tts:true,ai:false,watermark:false,notify:true},
  perks:["كل التصاميم (80 + 184 قائمة)","3 مشاهد و40 عنصراً","منصتان","القارئ الصوتي","إشعارات Discord/Telegram","بدون علامة B6O6"]},
 {id:"pro",name:"المحترف",price:15,color:"#a78bfa",limits:{layouts:10,widgets:120,platforms:4,actions:60,musicTracks:2000,reports:30,customDesigns:50,tts:true,ai:true,watermark:false,notify:true},
  perks:["كل مزايا المبتدئ","10 مشاهد و120 عنصراً","كل المنصات الأربع + الشات الموحد","60 إجراءً تلقائياً","ردود ذكية (AI) عند ربط المفتاح على الخادم"]},
 {id:"elite",name:"النخبة",price:30,color:"#f6c94a",limits:{layouts:30,widgets:400,platforms:4,actions:200,musicTracks:10000,reports:100,customDesigns:200,tts:true,ai:true,watermark:false,notify:true},
  perks:["كل مزايا المحترف","30 مشهداً","أرشيف 100 تقرير بث","أولوية في الدعم"]},
 {id:"legend",name:"الأسطورة",price:60,color:"#ff2d6f",limits:{layouts:100,widgets:2000,platforms:4,actions:1000,musicTracks:50000,reports:365,customDesigns:1000,tts:true,ai:true,watermark:false,notify:true},
  perks:["كل المزايا بلا حدود عملية","أرشيف سنة كاملة","مساعدة إعداد شخصية"]},
];
export const planOf=id=>PLANS.find(p=>p.id===id)||PLANS[0];
/** الباقة الفعلية: المدفوعة إن لم تنتهِ، وإلا المجانية */
export function effectivePlan(u,now=Date.now()){ if(!u||!u.plan||u.plan==="free") return PLANS[0]; if(u.planUntil&&new Date(u.planUntil).getTime()<now) return PLANS[0]; return planOf(u.plan) }
export function planLimit(u,key,now){ return effectivePlan(u,now).limits[key] }
/** فحص حد معدود: يرجع null إن كان مسموحاً، أو رسالة عربية بالسبب */
export function planCheck(u,key,count,now){ const L=planLimit(u,key,now); if(typeof L==="boolean") return L?null:`هذه الميزة غير متاحة في باقتك (${effectivePlan(u,now).name})`; return count<=L?null:`تجاوزت حد باقتك (${effectivePlan(u,now).name}): الحد ${L}` }
/** تمديد الاشتراك بعد دفع مؤكد: من تاريخ الانتهاء الحالي إن لم ينتهِ، وإلا من الآن */
export function extendPlan(u,planId,months=1,now=Date.now()){ const cur=u&&u.planUntil?new Date(u.planUntil).getTime():0, base=u&&u.plan===planId&&cur>now?cur:now; const d=new Date(base); d.setUTCMonth(d.getUTCMonth()+months); return {plan:planId,planUntil:d.toISOString()} }
