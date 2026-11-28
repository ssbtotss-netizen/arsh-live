// ====== محرك المؤقتات والسبثون ======
// دوال نقية: كل عملية تأخذ "now" من الخادم، والحالة تُخزَّن كـ endsAt (وقت انتهاء مطلق) أثناء التشغيل
// أو remainingMs أثناء الإيقاف. لذلك لا يضيع الوقت عند تحديث الصفحة أو إغلاق المتصفح أو إعادة تشغيل الخادم.
export const MIN=60000, HOUR=3600000;

export function defaultGiftRules(){ // قيم افتراضية تجريبية — قابلة للتعديل بالكامل
 return [{giftId:5655,name:"وردة",sec:5},{giftId:5487,name:"قلب",sec:10},{giftId:5879,name:"دونات",sec:30},{giftId:null,name:"هدية متوسطة",sec:120,minDiamonds:500},{giftId:6369,name:"أسد",sec:1800},{giftId:7312,name:"يونيفرس",sec:3600}];
}
export function newSubathon(o={}){
 const initial=2*HOUR;
 return Object.assign({id:"sa_"+Math.random().toString(36).slice(2,9),name:"سبثون",desc:"",status:"idle",
  initialMs:initial,remainingMs:initial,endsAt:null,startedAt:null,scheduledAt:null,endedAt:null,
  minMs:0,maxMs:72*HOUR,maxTotalMs:0,totalAddedMs:0,
  pauseOnDisconnect:true,autoPaused:false,countWhilePaused:true,
  rules:{
   gifts:{enabled:true,table:defaultGiftRules(),perDiamondSec:0},
   likes:{enabled:true,every:1000,sec:30},
   follow:{enabled:true,sec:10},
   subscribe:{enabled:true,sec:300},
   goal:{enabled:false,metric:"likes",target:10000,sec:600,reached:false},
   manual:{enabled:true},
   auto:true,
   list:defaultRuleList(),
  },
  rstate:{acc:{},last:{},user:{},win:{}},
  likeAcc:0, seq:0},o);
}
export function remaining(s,now){ return s.status==="running"?Math.max(0,s.endsAt-now):Math.max(0,s.remainingMs) }

/** إنجاز: كل ما تجاوز مجموع الوقت المضاف مضاعفات «milestoneMs» (افتراضياً ساعة) */
function saMilestone(s,now,out){ const step=+s.milestoneMs||HOUR; if(step<=0) return; const k=Math.floor((s.totalAddedMs||0)/step); if(k>(s.msK||0)){ s.msK=k; out.push(log(s,now,0,0,`إنجاز: +${Math.round(k*step/MIN)} دقيقة مضافة`,"system",null,{sa:"milestone",milestone:k})) } }
function setRemaining(s,ms,now){ if(s.status==="running") s.endsAt=now+ms; else s.remainingMs=ms }
function log(s,now,deltaMs,requestedMs,reason,source,eventId,x){ s.seq=(s.seq||0)+1; return Object.assign({subathonId:s.id,seq:s.seq,deltaMs,requestedMs,reason,source,eventId:eventId||null,at:now,remainingMs:remaining(s,now)},x||{}) }

/** عملية تحكم: start | pause | resume | add | reset | end | config — ترجع سجلات العمليات */
export function subathonOp(s,op,now){
 const out=[];
 switch(op.op){
  case "start":
   if(s.status==="running") break;
   if(s.status==="ended"){ s.remainingMs=s.initialMs; s.totalAddedMs=0; s.likeAcc=0; s.rules.goal.reached=false }
   if(s.status==="paused"){ s.endsAt=now+s.remainingMs; s.status="running"; s.autoPaused=false; out.push(log(s,now,0,0,"استكمال","control",null,{sa:"resume"})); break }
   s.status="running"; s.startedAt=now; s.endsAt=now+s.remainingMs; s.endedAt=null; s.autoPaused=false;
   out.push(log(s,now,0,0,"بدء السبثون","control",null,{sa:"start"})); s.nearFired=false; break;
  case "pause":
   if(s.status!=="running") break;
   s.remainingMs=remaining(s,now); s.endsAt=null; s.status="paused"; s.autoPaused=!!op.auto;
   out.push(log(s,now,0,0,op.auto?"إيقاف تلقائي (انقطاع البث)":"إيقاف مؤقت","control",null,{sa:"pause"})); break;
  case "resume":
   if(s.status!=="paused") break;
   s.endsAt=now+s.remainingMs; s.status="running"; s.autoPaused=false;
   out.push(log(s,now,0,0,op.auto?"استكمال تلقائي (عودة البث)":"استكمال","control",null,{sa:"resume"})); break;
  case "add": {
   if(s.status==="ended") break;
   const manual=op.source==="manual";
   if(manual&&!s.rules.manual.enabled) break;
   let req=Math.round(+op.ms||0); if(!req) break;
   const cur=remaining(s,now);
   let delta=req;
   if(delta>0&&s.maxTotalMs>0) delta=Math.min(delta,Math.max(0,s.maxTotalMs-s.totalAddedMs));
   let next=cur+delta;
   if(s.maxMs>0) next=Math.min(next,s.maxMs);
   if(req<0) next=Math.max(next,Math.min(cur,s.minMs)); // الخصم لا ينزل تحت الحد الأدنى
   next=Math.max(0,next);
   const applied=next-cur; if(!applied&&req>0){ out.push(log(s,now,0,req,(op.reason||"إضافة")+" (وصل الحد الأقصى)",op.source||"manual",op.eventId,op.x)); break }
   setRemaining(s,next,now); if(applied>0) s.totalAddedMs+=applied;
   out.push(log(s,now,applied,req,op.reason||(req>0?"إضافة يدوية":"خصم يدوي"),op.source||"manual",op.eventId,op.x));
   if(s.status==="running"&&next===0){ s.status="ended"; s.endedAt=now; s.remainingMs=0; s.endsAt=null; out.push(log(s,now,0,0,"انتهى السبثون","system",null,{sa:"end"})) }
   saMilestone(s,now,out); if(remaining(s,now)>(+s.nearEndMs||5*MIN)) s.nearFired=false;
   break }
  case "reset":
   s.status="idle"; s.msK=0; s.nearFired=false; s.remainingMs=s.initialMs; s.endsAt=null; s.startedAt=null; s.endedAt=null; s.totalAddedMs=0; s.likeAcc=0; s.rules.goal.reached=false; s.autoPaused=false;
   out.push(log(s,now,0,0,"إعادة ضبط","control")); break;
  case "end":
   if(s.status==="ended") break;
   s.status="ended"; s.endedAt=now; s.remainingMs=0; s.endsAt=null;
   out.push(log(s,now,0,0,"إنهاء السبثون","control",null,{sa:"end"})); break;
  case "config": { // تعديل الإعدادات (لا يغيّر الوقت الجاري إلا initialMs عند الخمول)
   const c=op.config||{};
   for(const k of ["name","desc","minMs","maxMs","maxTotalMs","pauseOnDisconnect","countWhilePaused","scheduledAt","nearEndMs","milestoneMs","soundsOff"]) if(c[k]!==undefined) s[k]=k==="nearEndMs"||k==="milestoneMs"?Math.max(0,+c[k]||0):k==="soundsOff"?c[k]===true||c[k]==="true"||c[k]==="on":c[k];
   if(c.initialMs!==undefined){ s.initialMs=Math.max(MIN,+c.initialMs); if(s.status==="idle") s.remainingMs=s.initialMs }
   if(c.rules) for(const r in c.rules){ if(r==="list"&&Array.isArray(c.rules.list)){ const before=s.rules.list||[]; s.rules.list=cleanRuleList(c.rules.list); s.rules.rev=(+s.rules.rev||0)+1;
     // القوانين المحذوفة تُسجّل حتى لا يعيدها أي مصدر قديم، والجدول القديم يُطابق القائمة دائماً
     const keep=new Set(s.rules.list.map(x=>x.id)), gone=before.filter(x=>!keep.has(x.id)&&x.kind==="gift").map(legacyKey);
     s.rules.deletedKeys=[...new Set([...(s.rules.deletedKeys||[]).filter(k=>!s.rules.list.some(x=>x.kind==="gift"&&legacyKey(x)===k)),...gone])].slice(-300);
     if(s.rules.gifts) s.rules.gifts.table=s.rules.list.filter(x=>x.kind==="gift"&&x.giftId!=="*").map(x=>({giftId:x.giftId??null,name:x.giftName||"",minDiamonds:x.minDiamonds||0,sec:Math.round(x.ms/1000)})) } else if(typeof c.rules[r]!=="object"||c.rules[r]===null) s.rules[r]=c.rules[r]; else s.rules[r]=Object.assign(s.rules[r]||{},c.rules[r]) }
   if(c.rules&&Array.isArray(s.rules.list)) syncLegacy(s,c.rules);
   if(c.rules&&Array.isArray(s.rules.list)&&s.rules.gifts) s.rules.gifts.table=s.rules.list.filter(x=>x.kind==="gift"&&x.giftId!=="*"&&!isEmptyRule(x)).map(x=>({giftId:x.giftId??null,name:x.giftName||"",minDiamonds:x.minDiamonds||0,sec:Math.round(x.ms/1000)}));
   break }
 }
 return out;
}

/** قيمة الوقت لهدية حسب جدول المستخدم (بالمعرّف أولاً ثم الاسم ثم حد الألماس ثم قيمة لكل ألماسة) */
export function giftSeconds(rules,ev){
 const g=rules.gifts; if(!g||!g.enabled) return 0;
 const id=ev.giftId!=null?String(ev.giftId):null, name=String(ev.gift||"").trim().toLowerCase();
 const per=(ev.diamonds!=null?+ev.diamonds:(+ev.value||0)/Math.max(1,+ev.count||1));
 let row=(id&&g.table.find(r=>r.giftId!=null&&String(r.giftId)===id))||(name&&g.table.find(r=>r.giftId==null&&!r.minDiamonds&&String(r.name).trim().toLowerCase()===name));
 if(!row){ const tiers=g.table.filter(r=>r.giftId==null&&r.minDiamonds>0&&per>=r.minDiamonds).sort((a,b)=>b.minDiamonds-a.minDiamonds); row=tiers[0] }
 const cnt=Math.max(1,+ev.count||1);
 if(row) return row.sec*cnt;
 return (g.perDiamondSec||0)*per*cnt;
}

// ================= محرك قواعد التفاعل (لكل قاعدة معرّف مستقل) =================
export const RULE_KINDS={coins:{label:"عملات تيك توك (كوين)",icon:"🪙"},gift:{label:"هدية TikTok",icon:"🎁"},follow:{label:"متابعة جديدة",icon:"💚"},subscribe:{label:"اشتراك مدفوع",icon:"⭐"},likes:{label:"تكبيس (إعجابات)",icon:"❤️"},share:{label:"مشاركة البث",icon:"🔁"},comment:{label:"أمر في التعليقات",icon:"💬"},donation:{label:"دونيشن مالي",icon:"💰"}};
const rid=()=>"r_"+Math.random().toString(36).slice(2,9);
export function newRule(kind="gift",o={}){
 return Object.assign({id:rid(),kind,enabled:true,dir:1,ms:60000,every:1,giftId:null,giftName:"",emoji:"",img:"",minDiamonds:0,perDiamondMs:0,
  keyword:"",cooldownMs:0,userCooldownMs:0,perMin:0,maxMs:0,sound:true,show:true,label:"",coins:100,mode:"rate",
  currency:"SAR",unit:1,addMs:120000,subMs:60000,addWords:"زيد,زود,+",subWords:"نقص,انقص,-",defaultAction:"add",minAmount:0,
  color:"",timeColor:"",fs:0,anim:"",soundId:"",soundVol:1},o);
}
const legacyKey=x=>x.giftId!=null&&x.giftId!==""?String(x.giftId):"n:"+String(x.giftName||"").trim().toLowerCase();
const ruleKey=r=>r.kind+":"+(r.kind==="gift"?(r.giftId!=null&&r.giftId!==""?String(r.giftId):"n:"+String(r.giftName||"").trim().toLowerCase()+":"+(+r.minDiamonds||0)):r.kind==="comment"?String(r.keyword||"").trim()+":"+r.dir:r.kind==="coins"?r.mode+":"+r.coins+":"+r.dir:r.kind)+":"+(+r.every||1);
/** تنظيف قائمة القوانين: معرّف فريد لكل قانون، بدون عناصر تالفة، وحقول بأنواع صحيحة */
export function cleanRuleList(list){ const out=[], ids=new Set();
 for(const x of list||[]){ if(!x||typeof x!=="object"||!RULE_KINDS[x.kind||"gift"]) continue;
  const r=Object.assign(newRule(x.kind||"gift"),x); if(!r.id||ids.has(r.id)) r.id=rid(); ids.add(r.id);
  r.enabled=r.enabled!==false&&r.enabled!=="false"; r.show=r.show!==false&&r.show!=="false"; r.dir=+r.dir<0?-1:1; r.ms=Math.max(0,+r.ms||0); r.every=Math.max(1,+r.every||1);
  r.fs=Math.max(0,Math.min(3,+r.fs||0)); r.soundVol=Math.max(0,Math.min(1,r.soundVol==null?1:+r.soundVol));
  for(const k of ["color","timeColor"]) if(r[k]&&!/^#[0-9a-f]{3,8}$/i.test(r[k])) r[k]="";
  r.label=String(r.label||"").slice(0,60); out.push(r) }
 return out }
/** قوانين مكررة فعلياً (نفس الهدية/الحدث بنفس الإعداد) — تنبيه في الواجهة فقط */
export function duplicateRules(list){ const seen={}, d=[]; for(const r of list||[]){ const k=ruleKey(r); if(seen[k]) d.push(r.id); else seen[k]=1 } return d }
export const isEmptyRule=r=>(r.kind==="gift"&&(r.giftId==null||r.giftId==="")&&!String(r.giftName||"").trim()&&!(+r.minDiamonds>0))||(r.kind==="comment"&&!String(r.keyword||"").trim());
/** القيم الافتراضية من المواصفات — قابلة للتعديل بالكامل */
export function defaultRuleList(){ return [
 newRule("follow",{ms:60000,emoji:"💚"}),
 newRule("subscribe",{ms:10*60000,emoji:"⭐"}),
 newRule("likes",{every:1000,ms:60000,emoji:"❤️"}),
 newRule("share",{every:10,ms:2*60000,emoji:"🔁",enabled:false}),
 newRule("coins",{mode:"rate",coins:100,ms:60000,emoji:"🪙"}),
 newRule("gift",{giftId:5655,giftName:"وردة",emoji:"🌹",ms:5000}),
 newRule("gift",{giftId:6369,giftName:"أسد",emoji:"🦁",ms:30*60000}),
 newRule("gift",{giftId:7312,giftName:"يونيفرس",emoji:"🌌",ms:60*60000,dir:-1}),
 newRule("donation",{currency:"SAR",unit:1,addMs:2*60000,subMs:60000,emoji:"💰"}),
 newRule("comment",{keyword:"زيد",ms:10000,userCooldownMs:60000,perMin:10,emoji:"💬",enabled:false}),
 newRule("comment",{keyword:"نقص",ms:10000,dir:-1,userCooldownMs:60000,perMin:10,emoji:"💬",enabled:false}),
]}
/** ترقية إعدادات قديمة (جدول الهدايا + الإعجابات + المتابعة + الاشتراك) إلى قائمة قواعد دون تغيير سلوكها */
export function migrateRules(s){
 const R=s.rules=s.rules||{}; s.rstate=s.rstate||{acc:{},last:{},user:{},win:{}};
 if(R.auto===undefined) R.auto=true;
 if(Array.isArray(R.list)) return s;
 const L=[];
 if(R.follow) L.push(newRule("follow",{ms:(R.follow.sec||0)*1000,enabled:!!R.follow.enabled,emoji:"💚"}));
 if(R.subscribe) L.push(newRule("subscribe",{ms:(R.subscribe.sec||0)*1000,enabled:!!R.subscribe.enabled,emoji:"⭐"}));
 if(R.likes) L.push(newRule("likes",{every:R.likes.every||1000,ms:(R.likes.sec||0)*1000,enabled:!!R.likes.enabled,emoji:"❤️"}));
 L.push(newRule("share",{every:10,ms:120000,enabled:false,emoji:"🔁"}));
 const g=R.gifts; if(g){ for(const r of g.table||[]) L.push(newRule("gift",{giftId:r.giftId??null,giftName:r.name||"",minDiamonds:r.minDiamonds||0,ms:(r.sec||0)*1000,enabled:!!g.enabled,emoji:"🎁"}));
  if(g.perDiamondSec>0) L.push(newRule("gift",{giftId:"*",giftName:"أي هدية أخرى",perDiamondMs:g.perDiamondSec*1000,ms:0,enabled:!!g.enabled})) }
 L.push(newRule("donation",{enabled:false,emoji:"💰"}));
 R.list=L; return s;
}
/** توافق: تعديل الإعدادات بالصيغة القديمة (follow/subscribe/likes/gifts) ينعكس على قائمة القواعد */
function syncLegacy(s,c){ const L=s.rules.list;
 for(const k of ["follow","subscribe"]) if(c[k]) for(const r of L.filter(x=>x.kind===k)){ if(c[k].enabled!==undefined) r.enabled=!!c[k].enabled; if(c[k].sec!==undefined) r.ms=c[k].sec*1000 }
 if(c.likes) for(const r of L.filter(x=>x.kind==="likes")){ if(c.likes.enabled!==undefined) r.enabled=!!c.likes.enabled; if(c.likes.every!==undefined) r.every=c.likes.every; if(c.likes.sec!==undefined) r.ms=c.likes.sec*1000 }
 // الجدول القديم (gifts.table) لا يعيد بناء قائمة القواعد أبداً: كان يُرجع القوانين المحذوفة ويكررها.
 // صف جديد بالصيغة القديمة يُضاف كقاعدة واحدة فقط إن لم يكن موجوداً.
 if(c.gifts){ if(Array.isArray(c.gifts.table)&&!Array.isArray(c.list)){ for(const r of c.gifts.table){ if(!String(r.name||r.giftId||"").trim()) continue; const key=legacyKey({giftId:r.giftId,giftName:r.name});
   if(!L.some(x=>x.kind==="gift"&&legacyKey(x)===key)&&!(s.rules.deletedKeys||[]).includes(key)) L.push(newRule("gift",{giftId:r.giftId??null,giftName:r.name||"",minDiamonds:r.minDiamonds||0,ms:(r.sec||0)*1000,emoji:"🎁"})) } }
 if(c.gifts.enabled!==undefined) for(const r of s.rules.list.filter(x=>x.kind==="gift")) r.enabled=!!c.gifts.enabled }
}
/** نص القاعدة كما يظهر للمشاهد — يُقرأ دائماً من الإعدادات الحالية */
export function fmtDur(ms,short){ const a=Math.abs(ms), s=Math.round(a/1000);
 if(short){ if(s<60) return s+"s"; if(s<3600) return (+(s/60).toFixed(1))+"m"; return (+(s/3600).toFixed(1))+"h" }
 const p=durParts(ms); return `${p.n} ${p.unit}` }
/** الرقم والوحدة منفصلان حتى تُعرض العلامة والرقم معاً بالاتجاه الصحيح في العربية */
export function durParts(ms){ const s=Math.round(Math.abs(ms)/1000), u=(n,one,few)=>({n,unit:n>2&&n<=10&&Number.isInteger(n)?few:one});
 if(s<60) return u(s,"ثانية","ثوانٍ"); if(s<3600) return u(+(s/60).toFixed(1),"دقيقة","دقائق"); return u(+(s/3600).toFixed(1),"ساعة","ساعات") }
const signed=ms=>{ const p=durParts(ms); return `\u2066${ms<0?"-":"+"}${p.n}\u2069 ${p.unit}` };
const CUR_AR={SAR:"ريال",AED:"درهم",KWD:"دينار",USD:"دولار",EUR:"يورو",QAR:"ريال قطري",BHD:"دينار بحريني",OMR:"ريال عماني"};
export function ruleView(r){
 const k=RULE_KINDS[r.kind]||RULE_KINDS.gift, sg=r.dir<0?"-":"+";
 const icon=r.emoji||k.icon, img=/^(https:\/\/|data:image\/|\/)/.test(r.img||"")?r.img:"", st={kind:r.kind,color:r.color||"",timeColor:r.timeColor||"",fs:+r.fs||0,anim:r.anim||"",giftId:r.giftId??null};
 let what="", ms=r.ms*(r.dir<0?-1:1), rows=null;
 switch(r.kind){
  case "follow": what="فولو"; break;
  case "subscribe": what="اشتراك"; break;
  case "likes": what=`${(+r.every||1).toLocaleString("en-US")} لايك`; break;
  case "share": what=(+r.every>1?`${r.every} مشاركات`:"مشاركة"); break;
  case "comment": what=`اكتب «${r.keyword}»`; break;
  case "coins": what=r.mode==="tier"?`هدية ≥ ${(+r.coins||0).toLocaleString("en-US")} كوين`:`كل ${(+r.coins||0).toLocaleString("en-US")} كوين`; break;
  case "gift": what=(r.giftId==="*"?"أي هدية":r.giftName||("هدية "+(r.giftId??"")))+(+r.every>1?` ×${r.every}`:"")+(r.minDiamonds>0&&r.giftId==null?` (${r.minDiamonds}💎+)`:""); if(r.perDiamondMs&&!r.ms){ ms=r.perDiamondMs; what+=" لكل 💎" } break;
  case "donation": { const u=`${r.unit||1} ${CUR_AR[r.currency]||r.currency}`; rows=[];
   if(r.addMs>0) rows.push({icon,what:`دونيشن ${u} + زيد`,ms:r.addMs,text:signed(r.addMs),short:`+${fmtDur(r.addMs,1)}`});
   if(r.subMs>0) rows.push({icon,what:`دونيشن ${u} + نقص`,ms:-r.subMs,text:signed(-r.subMs),short:`-${fmtDur(r.subMs,1)}`});
   return rows.map((x,i)=>({...x,id:r.id+"_"+i,rid:r.id,img,label:r.label||"",...st})) }
 }
 return [{id:r.id,rid:r.id,icon,img,what:r.label||what,ms,text:signed(ms),short:`${ms<0?"-":"+"}${fmtDur(ms,1)}`,...st}];
}
export function rulesForBoard(s,opt={}){ const L=(s&&s.rules&&s.rules.list)||[]; const out=[], seen=new Set(); for(const r of L){ if(!r.enabled||r.show===false||isEmptyRule(r)||seen.has(r.id)) continue; seen.add(r.id); if(r.kind==="share"&&opt.noShare) continue; out.push(...ruleView(r)) } return out }
const words=v=>String(v||"").split(/[,،]/).map(x=>x.trim().toLowerCase()).filter(Boolean);
const norm=t=>String(t||"").trim().toLowerCase().replace(/[ً-ْ]/g,"");
/** هل الرسالة تحتوي الكلمة ككلمة مستقلة (أو رمز +/-) */
function hasWord(text,list){ const t=" "+norm(text).replace(/[!؟?.،,]/g," ")+" "; return list.some(w=>w==="+"||w==="-"?t.trim().startsWith(w)||t.includes(" "+w+" "):t.includes(" "+w+" ")) }
function gate(s,r,now,userKey){ const st=s.rstate;
 if(r.cooldownMs>0&&st.last[r.id]&&now-st.last[r.id]<r.cooldownMs) return false;
 if(r.userCooldownMs>0&&userKey){ const k=r.id+"|"+userKey; if(st.user[k]&&now-st.user[k]<r.userCooldownMs) return false }
 if(r.perMin>0){ const w=st.win[r.id]||(st.win[r.id]={t:now,n:0}); if(now-w.t>=60000){ w.t=now; w.n=0 } if(w.n>=r.perMin) return false }
 return true }
function mark(s,r,now,userKey){ const st=s.rstate; st.last[r.id]=now; if(r.perMin>0){ (st.win[r.id]||(st.win[r.id]={t:now,n:0})).n++ }
 if(r.userCooldownMs>0&&userKey){ st.user[r.id+"|"+userKey]=now; const ks=Object.keys(st.user); if(ks.length>3000) for(const k of ks.slice(0,1000)) delete st.user[k] } }
function apply(s,r,ms,now,ev,reason,extra){
 if(!ms) return [];
 if(r.maxMs>0) ms=Math.sign(ms)*Math.min(Math.abs(ms),r.maxMs);
 return subathonOp(s,{op:"add",ms,reason,source:"rule",eventId:ev.id,x:Object.assign({ruleId:r.id,kind:r.kind,user:ev.user?.name||ev.name||"",avatar:ev.user?.avatar||"",icon:r.emoji||(RULE_KINDS[r.kind]||{}).icon,img:r.img||"",gift:ev.gift||"",test:!!ev.test},extra||{})},now);
}
const accum=(s,r,n)=>{ const st=s.rstate.acc; const every=Math.max(1,+r.every||1); st[r.id]=(st[r.id]||0)+n; const k=Math.floor(st[r.id]/every); st[r.id]-=k*every; return k };
function giftRule(L,ev){
 const id=ev.giftId!=null?String(ev.giftId):null, name=norm(ev.gift), per=(ev.diamonds!=null?+ev.diamonds:(+ev.value||0)/Math.max(1,+ev.count||1));
 const gifts=L.filter(r=>r.kind==="gift"&&r.enabled);
 return (id&&gifts.find(r=>r.giftId!=null&&r.giftId!=="*"&&String(r.giftId)===id))
  ||(name&&gifts.find(r=>(r.giftId==null||r.giftId==="")&&!r.minDiamonds&&norm(r.giftName)===name))
  ||gifts.filter(r=>(r.giftId==null||r.giftId==="")&&r.minDiamonds>0&&per>=r.minDiamonds).sort((a,b)=>b.minDiamonds-a.minDiamonds)[0]
  ||gifts.find(r=>r.giftId==="*")||null;
}
/** قيمة الهدية الواحدة بالكوين: من حدث TikTok (diamondCount) أو قيمة يدوية حددها صانع المحتوى — لا نخترع قيمة */
export function giftCoins(R,ev){ const cnt=Math.max(1,+ev.count||1); let per=ev.diamonds!=null&&+ev.diamonds>0?+ev.diamonds:(+ev.value>0?(+ev.value)/cnt:0);
 if(!per){ const M=(R&&R.giftCoins)||{}, id=ev.giftId!=null?String(ev.giftId):"", nm=norm(ev.gift); const v=(id&&M[id])||M["n:"+nm]; per=+v>0?+v:0 }
 return per>0?per:null }
/** قواعد العملات: الشريحة (قيمة الحدث ≥ حد) لها الأولوية، وإلا المعدّل (كل N كوين = مدة) مع ترحيل الباقي بين الهدايا */
function coinsApply(s,L,ev,now,uk,who,cnt){ const per=giftCoins(s.rules,ev);
 if(per==null){ const u=s.rstate.unknown||(s.rstate.unknown={}), k=String(ev.gift||ev.giftId||"هدية"); u[k]=(u[k]||0)+cnt; return [] } // قيمة غير معروفة: لا وقت، وتظهر لصانع المحتوى ليحددها يدوياً
 const total=Math.round(per*cnt), C=L.filter(r=>r.kind==="coins"&&r.enabled&&+r.coins>0);
 const tier=C.filter(r=>r.mode==="tier"&&total>=+r.coins).sort((a,b)=>b.coins-a.coins)[0];
 const why=`${ev.gift||"هدية"}${cnt>1?" ×"+cnt:""} (${total} كوين) من ${who}`;
 if(tier){ if(!gate(s,tier,now,uk)) return []; mark(s,tier,now,uk); return apply(s,tier,tier.ms*(tier.dir<0?-1:1),now,ev,why,{coins:total}) }
 const rate=C.find(r=>r.mode!=="tier"); if(!rate||!gate(s,rate,now,uk)) return [];
 const st=s.rstate.acc; st[rate.id]=(st[rate.id]||0)+total; const n=Math.floor(st[rate.id]/(+rate.coins)); st[rate.id]-=n*(+rate.coins);
 if(!n) return []; mark(s,rate,now,uk); return apply(s,rate,n*rate.ms*(rate.dir<0?-1:1),now,ev,why,{coins:total}) }
/** تجربة هدية بدون لمس العداد الحقيقي: نسخة من السبثون تعمل كأنها مشغّلة وترجع النتيجة فقط */
export function subathonPreview(s,ev,now){ const c=JSON.parse(JSON.stringify(s)); if(c.status!=="running"){ c.status="running"; c.endsAt=now+remaining(s,now) } const before=remaining(c,now);
 const logs=subathonOnEvent(c,{...ev,id:"preview_"+Math.random().toString(36).slice(2)},now); const delta=remaining(c,now)-before;
 const l=logs.find(x=>x.ruleId); const r=l&&c.rules.list.find(x=>x.id===l.ruleId);
 return {deltaMs:delta,requestedMs:logs.reduce((a,x)=>a+(x.requestedMs||0),0),rule:r?{id:r.id,kind:r.kind,mode:r.mode,label:r.kind==="coins"?(r.mode==="tier"?`شريحة ≥ ${r.coins} كوين`:`كل ${r.coins} كوين`):(r.giftName||"هدية")}:null,coins:l&&l.coins!=null?l.coins:giftCoins(c.rules,ev)!=null?Math.round(giftCoins(c.rules,ev)*Math.max(1,+ev.count||1)):null,unknown:giftCoins(c.rules,ev)==null,capped:logs.some(x=>x.requestedMs!==x.deltaMs)} }
/** تطبيق حدث بث على السبثون — ترجع سجلات التغيير (كل سجل يحمل معرّف القاعدة والحدث) */
export function subathonOnEvent(s,ev,now,tot){
 migrateRules(s);
 if(!(s.status==="running"||(s.status==="paused"&&s.countWhilePaused))) return [];
 const R=s.rules, out=[];
 if(R.auto!==false){ const L=R.list, who=ev.user?.name||ev.name||"", uk=ev.user?.id||who;
  if(ev.type==="gift"){ /* طريقة الحساب (حدث واحد = قاعدة واحدة فقط، لا احتساب مزدوج):
     gifts_first: قاعدة الهدية إن وُجدت ← وإلا قواعد العملات | coins: العملات فقط | gifts: الهدايا فقط */
   const mode=R.giftMode||"gifts_first", cnt=Math.max(1,+ev.count||1);
   const r=mode!=="coins"&&R.giftsOn!==false?giftRule(L,ev):null;
   if(r){ if(gate(s,r,now,uk)){
    let ms; if(r.giftId==="*"&&r.perDiamondMs&&!r.ms){ const per=giftCoins(R,ev); ms=per==null?0:r.perDiamondMs*per*cnt } else { const n=+r.every>1?accum(s,r,cnt):cnt; ms=n*r.ms }
    if(ms){ mark(s,r,now,uk); out.push(...apply(s,r,ms*(r.dir<0?-1:1),now,ev,`${ev.gift||r.giftName||"هدية"}${cnt>1?" ×"+cnt:""} من ${who}`)) } } }
   else if(mode!=="gifts"&&R.coinsOn!==false) out.push(...coinsApply(s,L,ev,now,uk,who,cnt));
  }
  else if(ev.type==="like"){ for(const r of L.filter(x=>x.kind==="likes"&&x.enabled)){ const n=accum(s,r,+ev.count||0); s.likeAcc=s.rstate.acc[r.id]; if(n>0&&gate(s,r,now)){ mark(s,r,now); out.push(...apply(s,r,n*r.ms*(r.dir<0?-1:1),now,ev,`${n*(+r.every||1)} لايك`)) } } }
  else if(ev.type==="follow"||ev.type==="subscribe"||ev.type==="share"){ const kind=ev.type; for(const r of L.filter(x=>x.kind===kind&&x.enabled)){ const n=+r.every>1?accum(s,r,1):1; if(n>0&&gate(s,r,now,uk)){ mark(s,r,now,uk); out.push(...apply(s,r,n*r.ms*(r.dir<0?-1:1),now,ev,`${kind==="follow"?"متابعة":kind==="subscribe"?"اشتراك":"مشاركة"} ${who}`.trim())) } } }
  else if(ev.type==="comment"){ const t=norm(ev.text); for(const r of L.filter(x=>x.kind==="comment"&&x.enabled&&x.keyword)){ const kw=norm(r.keyword); if(!(t===kw||t.startsWith(kw+" "))) continue; if(!gate(s,r,now,uk)) continue; mark(s,r,now,uk); out.push(...apply(s,r,r.ms*(r.dir<0?-1:1),now,ev,`أمر «${r.keyword}» من ${who}`)) } }
 }
 const G=R.goal;
 if(G&&G.enabled&&!G.reached&&tot){ const v=G.metric==="gifts"?tot.gifts:G.metric==="follows"?tot.follows:tot.likes; if(v>=G.target){ G.reached=true; out.push(...subathonOp(s,{op:"add",ms:G.sec*1000,reason:"تحقيق الهدف ("+G.target+")",source:"event"},now)) } }
 return out;
}
/** الدونيشن المؤكد فقط: «زيد» يزيد و«نقص» ينقص حسب المبلغ، وإجراء افتراضي بدون رسالة */
export function donationAction(r,ev){
 const msg=ev.message||"";
 if(hasWord(msg,words(r.subWords))) return "sub"; if(hasWord(msg,words(r.addWords))) return "add";
 return r.defaultAction||"none";
}
export function subathonOnDonation(s,ev,now){
 migrateRules(s);
 if(!(s.status==="running"||(s.status==="paused"&&s.countWhilePaused))) return [];
 if(s.rules.auto===false||ev.type!=="donation") return [];
 const out=[];
 for(const r of s.rules.list.filter(x=>x.kind==="donation"&&x.enabled)){
  if(r.currency&&ev.currency&&r.currency!==ev.currency) continue;
  const amt=Math.max(0,+ev.amount||0); if(amt<(+r.minAmount||0)||!amt) continue;
  const act=donationAction(r,ev); if(act==="none") continue;
  const per=act==="sub"?r.subMs:r.addMs; if(!per) continue;
  if(!gate(s,r,now)) continue; mark(s,r,now);
  const ms=Math.round(amt/Math.max(0.01,+r.unit||1)*per)*(act==="sub"?-1:1);
  out.push(...apply(s,r,ms,now,ev,`دونيشن ${amt} ${ev.currency||r.currency} ${act==="sub"?"«نقص»":"«زيد»"} من ${ev.anonymous?"مجهول":(ev.name||"")}`,{donation:amt,currency:ev.currency,action:act}));
  break;
 }
 return out;
}

/** ساعة الخادم: بدء مجدول + انتهاء تلقائي */
export function subathonTick(s,now){
 const out=[];
 if(s.status==="idle"&&s.scheduledAt&&now>=s.scheduledAt){ s.scheduledAt=null; out.push(...subathonOp(s,{op:"start"},now)) }
 if(s.status==="running"&&!s.nearFired&&s.endsAt-now<=(+s.nearEndMs||5*MIN)&&s.endsAt>now){ s.nearFired=true; out.push(log(s,now,0,0,"اقترب انتهاء السبثون","system",null,{sa:"near"})) }
 if(s.status==="running"&&s.endsAt<=now){ s.status="ended"; s.endedAt=s.endsAt; s.remainingMs=0; s.endsAt=null; out.push(log(s,now,0,0,"انتهى السبثون","system",null,{sa:"end"})) }
 return out;
}

// ---------- مؤقتات البث المتعددة (كل مؤقت مستقل) ----------
export const TIMER_KINDS={elapsed:{label:"مدة البث",dir:"up"},countdown:{label:"عد تنازلي",dir:"down"},break:{label:"استراحة",dir:"down"},challenge:{label:"مؤقت التحدي",dir:"down"},custom:{label:"مخصص",dir:"down"}};
export function newTimer(kind="countdown",o={}){
 const k=TIMER_KINDS[kind]||TIMER_KINDS.custom;
 return Object.assign({id:"tm_"+Math.random().toString(36).slice(2,9),kind,name:k.label,dir:k.dir,durationMs:10*MIN,status:"idle",startedAt:null,endsAt:null,accMs:0,remainingMs:10*MIN,prefix:"",endText:"انتهى الوقت",autoLive:false},o);
}
export function defaultTimers(){ return [newTimer("elapsed",{id:"stream",name:"مدة البث",prefix:"مدة البث",autoLive:true}),newTimer("break",{name:"الاستراحة",prefix:"راجع بعد",durationMs:5*MIN,remainingMs:5*MIN})] }
export function timerValue(t,now){
 if(t.dir==="up") return t.accMs+(t.status==="running"?now-t.startedAt:0);
 return t.status==="running"?Math.max(0,t.endsAt-now):Math.max(0,t.remainingMs);
}
export function timerOp(t,op,now){
 switch(op.op){
  case "start": if(t.status==="running") break;
   if(t.status==="ended"||t.status==="idle"){ t.accMs=0; t.remainingMs=t.durationMs }
   t.status="running"; t.startedAt=now; if(t.dir==="down") t.endsAt=now+t.remainingMs; break;
  case "pause": if(t.status!=="running") break; if(t.dir==="up") t.accMs+=now-t.startedAt; else t.remainingMs=Math.max(0,t.endsAt-now); t.status="paused"; t.endsAt=null; break;
  case "resume": if(t.status!=="paused") break; t.status="running"; t.startedAt=now; if(t.dir==="down") t.endsAt=now+t.remainingMs; break;
  case "reset": t.status="idle"; t.accMs=0; t.remainingMs=t.durationMs; t.endsAt=null; t.startedAt=null; break;
  case "add": { const ms=+op.ms||0; if(t.dir==="up"){ t.accMs=Math.max(0,t.accMs+ms) } else if(t.status==="running"){ t.endsAt=Math.max(now,t.endsAt+ms) } else t.remainingMs=Math.max(0,t.remainingMs+ms); break }
  case "config": { const c=op.config||{}; for(const k of ["name","prefix","endText","autoLive"]) if(c[k]!==undefined) t[k]=c[k]; if(c.durationMs!==undefined){ t.durationMs=Math.max(1000,+c.durationMs); if(t.status==="idle") t.remainingMs=t.durationMs } break }
 }
}
export function timerTick(t,now){ if(t.dir==="down"&&t.status==="running"&&t.endsAt<=now){ t.status="ended"; t.remainingMs=0; t.endsAt=null; return true } return false }
export function fmtClock(ms,showHours=true){ const s=Math.max(0,Math.ceil(ms/1000)), h=Math.floor(s/3600), m=Math.floor(s/60)%60, x=s%60, p=n=>String(n).padStart(2,"0"); return (showHours||h?p(h)+":":"")+p(m)+":"+p(x) }
export function fmtDelta(ms){ const a=Math.abs(ms), s=Math.round(a/1000), sign=ms<0?"-":"+";
 if(s<60) return `${sign}${s} ثانية`; if(s<3600){ const m=Math.round(s/60); return `${sign}${m} ${m===1?"دقيقة":m===2?"دقيقتان":m<=10?"دقائق":"دقيقة"}` } const h=+(s/3600).toFixed(1); return `${sign}${h} ${h===1?"ساعة":h===2?"ساعتان":"ساعات"}` }
export function newClockState(){ return {subathon:newSubathon(),timers:defaultTimers(),followers:{},latest:{},music:null,tops:{},session:null,reports:[]} }
/** قوالب جاهزة للقواعد */
export const RULE_PRESETS={normal:"سبثون عادي (كل التفاعلات تزيد)",compete:"سبثون تنافسي (زيادة ونقصان)",gifts:"سبثون الهدايا فقط",donation:"سبثون الدونيشن فقط",likes:"سبثون التكبيس فقط",all:"سبثون شامل"};
export function presetRules(key){ const L=defaultRuleList();
 for(const r of L){ if(key==="normal"){ r.dir=1; if(r.kind==="comment"&&r.keyword==="نقص") r.enabled=false; if(r.kind==="donation") r.subMs=0 }
  else if(key==="compete"){ if(r.kind==="comment") r.enabled=true }
  else if(key==="gifts") r.enabled=r.kind==="gift";
  else if(key==="donation") r.enabled=r.kind==="donation";
  else if(key==="likes") r.enabled=r.kind==="likes";
  else if(key==="all"){ r.enabled=r.kind!=="share"||r.enabled } }
 if(key==="normal") for(const r of L) if(r.kind==="gift") r.dir=1;
 return L }
