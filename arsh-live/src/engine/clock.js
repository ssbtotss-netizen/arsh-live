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

function setRemaining(s,ms,now){ if(s.status==="running") s.endsAt=now+ms; else s.remainingMs=ms }
function log(s,now,deltaMs,requestedMs,reason,source,eventId,x){ s.seq=(s.seq||0)+1; return Object.assign({subathonId:s.id,seq:s.seq,deltaMs,requestedMs,reason,source,eventId:eventId||null,at:now,remainingMs:remaining(s,now)},x||{}) }

/** عملية تحكم: start | pause | resume | add | reset | end | config — ترجع سجلات العمليات */
export function subathonOp(s,op,now){
 const out=[];
 switch(op.op){
  case "start":
   if(s.status==="running") break;
   if(s.status==="ended"){ s.remainingMs=s.initialMs; s.totalAddedMs=0; s.likeAcc=0; s.rules.goal.reached=false }
   if(s.status==="paused"){ s.endsAt=now+s.remainingMs; s.status="running"; s.autoPaused=false; out.push(log(s,now,0,0,"استكمال","control")); break }
   s.status="running"; s.startedAt=now; s.endsAt=now+s.remainingMs; s.endedAt=null; s.autoPaused=false;
   out.push(log(s,now,0,0,"بدء السبثون","control")); break;
  case "pause":
   if(s.status!=="running") break;
   s.remainingMs=remaining(s,now); s.endsAt=null; s.status="paused"; s.autoPaused=!!op.auto;
   out.push(log(s,now,0,0,op.auto?"إيقاف تلقائي (انقطاع البث)":"إيقاف مؤقت","control")); break;
  case "resume":
   if(s.status!=="paused") break;
   s.endsAt=now+s.remainingMs; s.status="running"; s.autoPaused=false;
   out.push(log(s,now,0,0,op.auto?"استكمال تلقائي (عودة البث)":"استكمال","control")); break;
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
   if(s.status==="running"&&next===0){ s.status="ended"; s.endedAt=now; s.remainingMs=0; s.endsAt=null; out.push(log(s,now,0,0,"انتهى السبثون","system")) }
   break }
  case "reset":
   s.status="idle"; s.remainingMs=s.initialMs; s.endsAt=null; s.startedAt=null; s.endedAt=null; s.totalAddedMs=0; s.likeAcc=0; s.rules.goal.reached=false; s.autoPaused=false;
   out.push(log(s,now,0,0,"إعادة ضبط","control")); break;
  case "end":
   if(s.status==="ended") break;
   s.status="ended"; s.endedAt=now; s.remainingMs=0; s.endsAt=null;
   out.push(log(s,now,0,0,"إنهاء السبثون","control")); break;
  case "config": { // تعديل الإعدادات (لا يغيّر الوقت الجاري إلا initialMs عند الخمول)
   const c=op.config||{};
   for(const k of ["name","desc","minMs","maxMs","maxTotalMs","pauseOnDisconnect","countWhilePaused","scheduledAt"]) if(c[k]!==undefined) s[k]=c[k];
   if(c.initialMs!==undefined){ s.initialMs=Math.max(MIN,+c.initialMs); if(s.status==="idle") s.remainingMs=s.initialMs }
   if(c.rules) for(const r in c.rules){ if(r==="list"&&Array.isArray(c.rules.list)) s.rules.list=c.rules.list.map(x=>Object.assign(newRule(x.kind||"gift"),x)); else if(typeof c.rules[r]!=="object"||c.rules[r]===null) s.rules[r]=c.rules[r]; else s.rules[r]=Object.assign(s.rules[r]||{},c.rules[r]) }
   if(c.rules&&Array.isArray(s.rules.list)) syncLegacy(s,c.rules);
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
export const RULE_KINDS={gift:{label:"هدية TikTok",icon:"🎁"},follow:{label:"متابعة جديدة",icon:"💚"},subscribe:{label:"اشتراك مدفوع",icon:"⭐"},likes:{label:"تكبيس (إعجابات)",icon:"❤️"},share:{label:"مشاركة البث",icon:"🔁"},comment:{label:"أمر في التعليقات",icon:"💬"},donation:{label:"دونيشن مالي",icon:"💰"}};
const rid=()=>"r_"+Math.random().toString(36).slice(2,9);
export function newRule(kind="gift",o={}){
 return Object.assign({id:rid(),kind,enabled:true,dir:1,ms:60000,every:1,giftId:null,giftName:"",emoji:"",img:"",minDiamonds:0,perDiamondMs:0,
  keyword:"",cooldownMs:0,userCooldownMs:0,perMin:0,maxMs:0,sound:true,show:true,label:"",
  currency:"SAR",unit:1,addMs:120000,subMs:60000,addWords:"زيد,زود,+",subWords:"نقص,انقص,-",defaultAction:"add",minAmount:0},o);
}
/** القيم الافتراضية من المواصفات — قابلة للتعديل بالكامل */
export function defaultRuleList(){ return [
 newRule("follow",{ms:60000,emoji:"💚"}),
 newRule("subscribe",{ms:10*60000,emoji:"⭐"}),
 newRule("likes",{every:1000,ms:60000,emoji:"❤️"}),
 newRule("share",{every:10,ms:2*60000,emoji:"🔁",enabled:false}),
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
 if(c.gifts){ if(c.gifts.table){ const keep=L.filter(x=>x.kind!=="gift"); const g=s.rules.gifts; const add=c.gifts.table.map(r=>newRule("gift",{giftId:r.giftId??null,giftName:r.name||"",minDiamonds:r.minDiamonds||0,ms:(r.sec||0)*1000,enabled:g.enabled!==false,emoji:"🎁"})); s.rules.list=L.splice(0,L.length,...keep,...add)&&[...keep,...add] }
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
 const icon=r.emoji||k.icon, img=r.img||"";
 let what="", ms=r.ms*(r.dir<0?-1:1), rows=null;
 switch(r.kind){
  case "follow": what="فولو"; break;
  case "subscribe": what="اشتراك"; break;
  case "likes": what=`${(+r.every||1).toLocaleString("en-US")} لايك`; break;
  case "share": what=(+r.every>1?`${r.every} مشاركات`:"مشاركة"); break;
  case "comment": what=`اكتب «${r.keyword}»`; break;
  case "gift": what=(r.giftId==="*"?"أي هدية":r.giftName||("هدية "+(r.giftId??"")))+(+r.every>1?` ×${r.every}`:"")+(r.minDiamonds>0&&r.giftId==null?` (${r.minDiamonds}💎+)`:""); if(r.perDiamondMs&&!r.ms){ ms=r.perDiamondMs; what+=" لكل 💎" } break;
  case "donation": { const u=`${r.unit||1} ${CUR_AR[r.currency]||r.currency}`; rows=[];
   if(r.addMs>0) rows.push({icon,what:`دونيشن ${u} + زيد`,ms:r.addMs,text:signed(r.addMs),short:`+${fmtDur(r.addMs,1)}`});
   if(r.subMs>0) rows.push({icon,what:`دونيشن ${u} + نقص`,ms:-r.subMs,text:signed(-r.subMs),short:`-${fmtDur(r.subMs,1)}`});
   return rows.map((x,i)=>({...x,id:r.id+"_"+i,img,label:r.label||""})) }
 }
 return [{id:r.id,icon,img,what:r.label||what,ms,text:signed(ms),short:`${ms<0?"-":"+"}${fmtDur(ms,1)}`}];
}
export function rulesForBoard(s,opt={}){ const L=(s&&s.rules&&s.rules.list)||[]; const out=[]; for(const r of L){ if(!r.enabled||r.show===false) continue; if(r.kind==="share"&&opt.noShare) continue; out.push(...ruleView(r)) } return out }
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
/** تطبيق حدث بث على السبثون — ترجع سجلات التغيير (كل سجل يحمل معرّف القاعدة والحدث) */
export function subathonOnEvent(s,ev,now,tot){
 migrateRules(s);
 if(!(s.status==="running"||(s.status==="paused"&&s.countWhilePaused))) return [];
 const R=s.rules, out=[];
 if(R.auto!==false){ const L=R.list, who=ev.user?.name||ev.name||"", uk=ev.user?.id||who;
  if(ev.type==="gift"){ const r=giftRule(L,ev); if(r&&gate(s,r,now,uk)){ const cnt=Math.max(1,+ev.count||1);
    let ms; if(r.giftId==="*"&&r.perDiamondMs&&!r.ms){ const per=(ev.diamonds!=null?+ev.diamonds:(+ev.value||0)/cnt); ms=r.perDiamondMs*per*cnt } else { const n=+r.every>1?accum(s,r,cnt):cnt; ms=n*r.ms }
    if(ms){ mark(s,r,now,uk); out.push(...apply(s,r,ms*(r.dir<0?-1:1),now,ev,`${ev.gift||r.giftName||"هدية"}${cnt>1?" ×"+cnt:""} من ${who}`)) } } }
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
 if(s.status==="running"&&s.endsAt<=now){ s.status="ended"; s.endedAt=s.endsAt; s.remainingMs=0; s.endsAt=null; out.push(log(s,now,0,0,"انتهى السبثون","system")) }
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
