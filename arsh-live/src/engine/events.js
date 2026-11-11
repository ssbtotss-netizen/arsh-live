// ====== محرك الأحداث الموحد | Event Normalization + Event Bus ======
// كل مصدر (TikTok / YouTube / Kick / Twitch / مزودو الدونيشن / لوحة التحكم) يمر من هنا قبل الغرفة.
// القاعدة: كل نوع له وحدة قياس ومصدر مستقل — لا تُخلط هدايا TikTok بالدونيشن المالي ولا باشتراكات المنصات.
// ملاحظة توافق: أحداث TikTok تحتفظ بمعرّفها الأصلي (الأنظمة الحالية ومنع التكرار تعتمد عليه)،
// وأحداث بقية المنصات تُسبق باسم المنصة لمنع تصادم المعرفات بين المنصات.

/** حالة دعم الميزة: مدعومة · تتطلب تفويضاً · تجريبية · غير متاحة حالياً */
export const CAP={ok:["مدعومة","ok"],auth:["تتطلب تفويضاً","warn"],beta:["تجريبية","warn"],no:["غير متاحة حالياً","bad"]};

/** سجل المنصات — قابل للتوسعة بإضافة مدخل جديد فقط */
export const LIVE_PLATFORMS={
 tiktok:{name:"TikTok LIVE",color:"#ff0050",color2:"#00f2ea",short:"TT",
  connect:"اسم المستخدم فقط (بدون كلمة مرور) عبر اتصال LIVE غير رسمي؛ لا توجد واجهة رسمية عامة لأحداث LIVE",
  caps:{comment:"beta",like:"beta",gift:"beta",follow:"beta",share:"beta",join:"beta",subscribe:"beta",viewers:"beta",sendChat:"no",moderate:"no"}},
 youtube:{name:"YouTube Live",color:"#ff0000",color2:"#ffffff",short:"YT",
  connect:"Google OAuth + YouTube Data API v3 (liveChatMessages) — المفاتيح على الخادم فقط",
  caps:{comment:"auth",superchat:"auth",subscribe:"auth",viewers:"auth",like:"no",share:"no",join:"no",follow:"no",sendChat:"auth",moderate:"auth"}},
 kick:{name:"Kick",color:"#53fc18",color2:"#0b0e0f",short:"KC",
  connect:"Kick OAuth 2.1 + Webhooks الرسمية (chat.message.sent, channel.followed, channel.subscription.*)",
  caps:{comment:"auth",follow:"auth",subscribe:"auth",gift:"auth",viewers:"beta",sendChat:"auth",moderate:"auth",like:"no",share:"no",join:"no"}},
 twitch:{name:"Twitch",color:"#9146ff",color2:"#ffffff",short:"TW",
  connect:"Twitch OAuth + EventSub WebSocket (channel.chat.message, channel.follow, channel.subscribe, channel.cheer)",
  caps:{comment:"auth",follow:"auth",subscribe:"auth",cheer:"auth",raid:"auth",viewers:"auth",sendChat:"auth",moderate:"auth",like:"no",share:"no",join:"no"}},
};
export const PLATFORM_IDS=Object.keys(LIVE_PLATFORMS);
export const DONATION_SOURCES=["streamlabs","streamelements","kofi","stripe","paypal","test"];

/** أنواع الأحداث ووحدة قياس كل نوع */
export const EVENT_TYPES={
 comment:{unit:"message",label:"تعليق"}, like:{unit:"likes",label:"لايك"}, gift:{unit:"platform_coins",label:"هدية منصة"},
 follow:{unit:"count",label:"متابعة"}, share:{unit:"count",label:"مشاركة"}, join:{unit:"count",label:"دخول"},
 subscribe:{unit:"platform_sub",label:"اشتراك منصة"}, superchat:{unit:"currency",label:"Super Chat"}, cheer:{unit:"bits",label:"Bits"}, raid:{unit:"viewers",label:"غارة"},
 donation:{unit:"currency",label:"دونيشن مالي"}, donation_refund:{unit:"currency",label:"استرجاع دونيشن"}, donation_session:{unit:"none",label:"جلسة دونيشن"}, donation_clear_tests:{unit:"none",label:"مسح تجارب الدونيشن"},
};
const evS=(v,n)=>String(v??"").slice(0,n);
const evN=(v,min=0,max=1e12)=>{ const x=+v; return Number.isFinite(x)?Math.min(max,Math.max(min,x)):0 };

/**
 * يحوّل أي حدث خام إلى الصيغة الموحدة مع الإبقاء على الحقول التي تعتمد عليها الأنظمة الحالية.
 * الصيغة: { id, platform, type, user:{id,name,avatar,mod,sub}, at, data, source, verified, test, unit, ...حقول التوافق }
 * يرجع null للحدث غير الصالح.
 */
export function normalizeEvent(raw,ctx={}){
 if(!raw||typeof raw!=="object"||!raw.type||!EVENT_TYPES[raw.type]) return null;
 const platform=LIVE_PLATFORMS[raw.platform]?raw.platform:(LIVE_PLATFORMS[ctx.platform]?ctx.platform:(raw.type.startsWith("donation")?"donation":"tiktok"));
 const ev={...raw};
 ev.platform=platform;
 ev.source=evS(raw.source||ctx.source||(platform==="donation"?raw.provider||"provider":platform),40);
 ev.at=evN(raw.at||raw.t||ctx.now||Date.now(),0,9e15);
 ev.unit=EVENT_TYPES[raw.type].unit;
 ev.test=!!(raw.test||raw.provider==="test");
 // التحقق: الدونيشن موثّق فقط إذا جاء من مزوّد تحقق منه الخادم؛ أحداث المنصات موثّقة بقدر مصدرها
 ev.verified=raw.type.startsWith("donation")?!!(raw.verified??(raw.provider&&raw.provider!=="test")):(raw.verified??!ev.test);
 if(raw.id!=null){ const id=evS(raw.id,160); ev.id=platform==="tiktok"||platform==="donation"||id.startsWith(platform+":")?id:platform+":"+id }
 if(raw.user){ const u=raw.user; ev.user={...u,id:evS(u.id??u.uniqueId??u.name,120),name:evS(u.name??u.nick??u.nickname??u.id,80),avatar:evS(u.avatar||"",600)} }
 // فصل صارم بين الوحدات
 if(raw.type==="like") ev.count=evN(raw.count,0,1e7);
 if(raw.type==="gift"){ ev.count=Math.max(1,evN(raw.count,1,1e6)); ev.value=evN(raw.value,0,1e9); delete ev.amount; delete ev.currency }
 if(raw.type==="donation"){ ev.amount=Math.round(evN(raw.amount,0,1e7)*100)/100; ev.currency=evS(raw.currency||"USD",8).toUpperCase(); ev.platform="donation" }
 // الاسترجاع: غياب المبلغ يعني استرجاعاً كاملاً — لا نحوّله إلى صفر
 if(raw.type==="donation_refund"){ if(raw.amount!=null) ev.amount=Math.round(evN(raw.amount,0,1e7)*100)/100; if(raw.currency) ev.currency=evS(raw.currency,8).toUpperCase(); ev.platform="donation" }
 if(raw.type==="comment") ev.text=evS(raw.text,500);
 ev.data={...(raw.data||{})};
 return ev }

/** منع التكرار بذاكرة محدودة (LRU) — يُستخدم في الحافلة وعند إعادة الاتصال */
export function createDedupe(cap=8000){ const m=new Map();
 return { has:id=>m.has(id), add(id){ if(!id) return true; if(m.has(id)) return false; m.set(id,1); if(m.size>cap){ const it=m.keys(); for(let i=0;i<cap/4;i++) m.delete(it.next().value) } return true }, get size(){ return m.size } } }

/** حافلة الأحداث المركزية: اتصال واحد لكل مصدر يوزّع على كل الأنظمة والعناصر */
export class EventBus{
 constructor(opts={}){ this.subs=new Map(); this.dd=createDedupe(opts.cap||8000); this.stats={in:0,out:0,dup:0,bad:0,byType:{},byPlatform:{},lastAt:0,lat:[]} }
 on(type,fn){ if(!this.subs.has(type)) this.subs.set(type,new Set()); this.subs.get(type).add(fn); return ()=>this.subs.get(type)?.delete(fn) }
 /** يطبّع ثم يمنع التكرار ثم يوزّع. يرجع الحدث الموحد أو null */
 emit(raw,ctx={}){ this.stats.in++; const ev=normalizeEvent(raw,ctx); if(!ev){ this.stats.bad++; return null }
  if(ev.id&&!this.dd.add(ev.id)){ this.stats.dup++; return null }
  const st=this.stats; st.out++; st.byType[ev.type]=(st.byType[ev.type]||0)+1; st.byPlatform[ev.platform]=(st.byPlatform[ev.platform]||0)+1; st.lastAt=ev.at;
  const now=ctx.now||Date.now(); if(raw.at||raw.t){ st.lat.push(Math.max(0,now-ev.at)); if(st.lat.length>200) st.lat.shift() }
  for(const k of [ev.type,"*"]) for(const fn of this.subs.get(k)||[]) try{ fn(ev) }catch(e){ st.err=(st.err||0)+1 }
  return ev }
 latency(){ const a=[...this.stats.lat].sort((x,y)=>x-y); if(!a.length) return null; return {p50:a[Math.floor(a.length*.5)],p95:a[Math.floor(a.length*.95)],n:a.length} }
}

/** ملخص حالة الدعم لكل منصة/ميزة لعرضه في الواجهة */
export function capabilityTable(){ return PLATFORM_IDS.map(p=>({platform:p,name:LIVE_PLATFORMS[p].name,connect:LIVE_PLATFORMS[p].connect,caps:Object.entries(LIVE_PLATFORMS[p].caps).map(([k,v])=>({feature:k,status:v,label:CAP[v][0],tone:CAP[v][1]}))})) }
