// ====== مركز البوتات والذكاء الصوتي: محرك موحّد (دوال نقية) ======
// يعمل داخل "الغرفة" نفسها: على الخادم في البث الحقيقي، وفي لوحة التحكم في وضع التجربة.
// لذلك كل رد يُولَّد مرة واحدة فقط ثم يُبث لكل الروابط (لا تكرار عند فتح اللوحة وOBS معاً).
// مهم: لا يوجد إرسال رسائل إلى شات TikTok (لا تكامل مصرّح به) — المخرجات: عرض في Overlay + قراءة صوتية + نسخة جاهزة للإرسال اليدوي.
import { entries } from "./leaderboard.js";
import { remaining } from "./clock.js";
import { sgProgress, sgFmt } from "./lb.js";
import { accountView } from "./socials.js";
import { GIFTS } from "./defs.js";

const bid=()=>"b_"+Math.random().toString(36).slice(2,9);
export const BOT_TYPES={commands:{label:"بوت الأوامر",icon:"⌨️"},replies:{label:"الردود التلقائية",icon:"💬"},thanks:{label:"شكر الداعمين",icon:"🎁"},follows:{label:"المتابعات والاشتراكات",icon:"💚"},welcome:{label:"بوت الترحيب",icon:"👋"},periodic:{label:"الرسائل الدورية",icon:"⏰"},reader:{label:"القارئ الصوتي",icon:"🔊"},ai:{label:"بوت الذكاء الاصطناعي",icon:"🧠"}};
export const READ_MODES=[["all","جميع التعليقات المؤهلة"],["mods","المشرفون فقط (عند توفر الصفة)"],["subs","المشتركون فقط (عند توفر الصفة)"],["gifters","الداعمون فقط"],["keyword","تحتوي على كلمة"],["prefix","تبدأ بأمر"],["users","أشخاص محددون"],["approve","بعد موافقتي"],["random","عشوائية بنسبة"]];
export const MATCH_MODES=[["contains","يحتوي على الكلمة"],["exact","مطابقة تامة"],["starts","يبدأ بالكلمة"],["regex","تعبير منتظم"]];
export const VARS=[["{username}","اسم المشاهد"],["{subathon_remaining}","الوقت المتبقي في السبثون"],["{likes_total}","مجموع التكبيس"],["{likes_goal}","هدف التكبيس الحالي"],["{likes_remaining}","المتبقي لهدف التكبيس"],["{support_goal}","هدف الدعم الحالي"],["{top_supporter}","المتصدر في الدعم"],["{top_liker}","متصدر التكبيس"],["{socials}","كل الحسابات"],["{social_tiktok}","حساب TikTok"],["{social_instagram}","حساب Instagram"],["{social_roblox}","حساب Roblox"],["{social_fortnite}","حساب Fortnite"],["{gift_name}","اسم الهدية"],["{gift_count}","عدد الهدايا"],["{amount}","المبلغ"]];

export function defaultBots(){ const R=(o)=>({id:bid(),enabled:true,...o});
 return {
  enabled:true, name:"بوت بطوط", output:{show:true,say:true,manual:true},
  status:{commands:true,replies:true,thanks:true,follows:true,welcome:false,periodic:true,reader:false,ai:false},
  commands:[
   R({name:"!وقت",desc:"الوقت المتبقي في السبثون",text:"باقي على السبثون {subathon_remaining} ⏳",cooldownMs:15000,userCooldownMs:60000,perm:"all",say:true,show:true}),
   R({name:"!تكبيس",desc:"تقدم هدف التكبيس",text:"باقي {likes_remaining} تكبيسة على الهدف 🔥",fallback:"ما فيه هدف تكبيس مفعّل حالياً",cooldownMs:15000,userCooldownMs:60000,perm:"all",say:true,show:true}),
   R({name:"!هدف",desc:"هدف الدعم الحالي",text:"هدفنا الحالي: {support_goal} 🎯",fallback:"ما فيه هدف دعم مفعّل حالياً",cooldownMs:15000,userCooldownMs:60000,perm:"all",say:true,show:true}),
   R({name:"!متصدر",desc:"المركز الأول في الدعم",text:"المتصدر في الدعم: {top_supporter} 👑",fallback:"ما فيه داعمين بعد في هذا البث",cooldownMs:15000,userCooldownMs:60000,perm:"all",say:true,show:true}),
   R({name:"!مكبس",desc:"متصدر التكبيس",text:"ملك التكبيس: {top_liker} ❤️",fallback:"ما فيه تكبيس بعد",cooldownMs:15000,userCooldownMs:60000,perm:"all",say:true,show:true}),
   R({name:"!حساباتي",desc:"حسابات التواصل المسجلة",text:"حساباتي: {socials}",fallback:"ما فيه حسابات مسجلة بعد",cooldownMs:30000,userCooldownMs:60000,perm:"all",say:false,show:true}),
   R({name:"!روبلوكس",desc:"حساب Roblox",text:"حسابي في روبلوكس: {social_roblox} 🎮",fallback:"لم يُضف حساب روبلوكس بعد",cooldownMs:30000,userCooldownMs:60000,perm:"all",say:false,show:true}),
   R({name:"!دعم",desc:"طريقة الدعم",text:"تقدر تدعم بالهدايا أو من رابط الدونيشن ❤️",cooldownMs:30000,userCooldownMs:60000,perm:"all",say:true,show:true}),
  ],
  replies:[
   R({keyword:"السلام عليكم",match:"contains",replies:["وعليكم السلام، حياك الله في بث بطوط ❤️","وعليكم السلام ورحمة الله، نورت يا {username} 🌹"],oncePerUser:true,perMin:6,cooldownMs:0,say:true,show:true}),
   R({keyword:"ديسكورد",match:"contains",replies:["رابط مجتمع بطوط موجود في البايو ❤️"],oncePerUser:true,perMin:4,cooldownMs:20000,say:false,show:true}),
   R({keyword:"سبثون",match:"contains",replies:["تقدر تشوف قوانين السبثون على الشاشة، وباقي {subathon_remaining} ⏳"],oncePerUser:true,perMin:3,cooldownMs:30000,say:false,show:true}),
   R({keyword:"روبلوكس",match:"contains",replies:["حياك في مابات بطوط على روبلوكس 🎮"],oncePerUser:true,perMin:3,cooldownMs:30000,say:false,show:true}),
  ],
  thanks:{gift:{enabled:true,minDiamonds:1,tpl:"يا سلام يا {username}، شكراً على {gift_count} {gift_name}، الله يسعدك ❤️",byGift:[{giftId:6369,tpl:"يا {username} يا أسطورة، الأسد وصل! الله يسعدك على الدعم 👑🔥"},{giftId:7312,tpl:"{username}! يونيفرس كامل؟! أنت أسطورة البث 🌌👑"}]},
   donation:{enabled:true,min:1,tpl:"شكراً يا {username} على دعمك بـ {amount}، الله يسعدك 💚"},first:{enabled:true,tpl:"أول دعم في البث من {username}! الله يسعدك 🥇"},say:true,show:true},
  follows:{follow:{enabled:true,tpl:"نورتنا يا {username}، شكراً على الفولو ❤️",perMin:6},subscribe:{enabled:true,tpl:"{username} اشترك! يا هلا بالمشترك الجديد ⭐",perMin:10},share:{enabled:false,tpl:"شكراً يا {username} على مشاركة البث 🔁",perMin:6},say:true,show:true},
  welcome:{tpls:["نورت البث يا {username} ❤️","حياك الله يا {username} 👑"],perMin:4,oncePerUser:true,onlyKnown:false,users:"",say:true,show:true},
  periodic:{items:[R({text:"لا تنسون الفولو يا أساطير ❤️",everyMin:5}),R({text:"هدفنا الحالي: {support_goal} 🎯",everyMin:10}),R({text:"شكراً لكل الداعمين، الله يسعدكم 👑",everyMin:20})],order:"seq",minChatPerMin:2,minGapSinceBotMs:60000,maxPerStream:0,pauseOnBigMs:15000,say:false,show:true},
  reader:{mode:"all",keyword:"",prefix:"!قل",users:"",randomPct:30,sayName:true,maxLen:150,emoji:"strip",gap:0},
  mod:{banned:"",blockedUsers:"",noLinks:true,noPhones:true,noRepeat:true,maxLen:200,dupWindowMs:60000,perUserPerMin:4},
  queue:{max:15,expireSec:60,noSameUserRow:true,fair:true,prio:{mod:3,sub:2,gifter:1,all:0}},
  voice:{provider:"browser",voiceName:"",lang:"ar",rate:1,pitch:1,volume:1,preset:"natural",muted:false},
  ai:{mode:"off",name:"بطوط بوت",dialect:"najdi",style:"ودود",length:"short",facts:"",banned:"",approve:true},
 };
}
export function newBotState(){ return {stats:{received:0,filtered:0,read:0,replies:0,commands:{},welcome:0,thanks:0,follows:0,periodic:0,errors:0,waitTotal:0,waitN:0},last:{},user:{},win:{},recent:[],welcomed:{},gifters:{},firstDone:false,chat:[],lastBotAt:0,lastBigAt:0,perIdx:0,perLast:{},perCount:0,log:[]} }

// ---------- أدوات النص العربي ----------
/** تطبيع: إزالة التشكيل والتطويل، توحيد الهمزات والتاء المربوطة والياء، وحروف صغيرة */
export function normAr(s){ return String(s||"").toLowerCase().replace(/[ً-ٰٟـ]/g,"").replace(/[إأآٱ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه").replace(/ؤ/g,"و").replace(/ئ/g,"ي").replace(/\s+/g," ").trim() }
const EMOJI=/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu;
const LINK=/(https?:\/\/|www\.)\S+|\b\S+\.(com|net|org|io|gg|me|ly|sa|co)\b\S*/gi;
const PHONE=/(\+?\d[\d\s\-]{7,}\d)/g;
/** فلترة التعليق: ترجع {ok, text, why} */
export function moderate(cfg,st,ev,now){
 const M=cfg.mod||{}, u=ev.user||{}, uk=u.id||u.name||"", raw=String(ev.text||"");
 const blocked=String(M.blockedUsers||"").split(/[,،\n]/).map(x=>normAr(x.replace(/^@/,""))).filter(Boolean);
 if(blocked.includes(normAr(u.name))||blocked.includes(normAr(uk))) return {ok:false,why:"مستخدم محظور من القراءة"};
 const bad=String(M.banned||"").split(/[,،\n]/).map(normAr).filter(Boolean), n=normAr(raw);
 if(bad.some(w=>n.includes(w))) return {ok:false,why:"كلمة ممنوعة"};
 let t=raw;
 if(M.noLinks!==false){ if(LINK.test(t)) { LINK.lastIndex=0; t=t.replace(LINK," ") } }
 if(M.noPhones!==false) t=t.replace(PHONE," ");
 if(M.noRepeat!==false) t=t.replace(/(.)\1{3,}/gu,"$1$1");
 t=t.replace(/\s+/g," ").trim();
 if(!t.replace(EMOJI,"").trim()&&!t) return {ok:false,why:"فارغ بعد الفلترة"};
 if(M.maxLen>0&&raw.length>M.maxLen*2) return {ok:false,why:"رسالة طويلة جداً"};
 if(M.dupWindowMs>0){ const key=uk+"|"+n; const seen=st.recent.find(x=>x.k===key&&now-x.t<M.dupWindowMs); if(seen) return {ok:false,why:"تعليق مكرر"}; st.recent.push({k:key,t:now}); if(st.recent.length>300) st.recent.splice(0,100) }
 if(M.perUserPerMin>0){ const k="pu|"+uk, w=st.win[k]||(st.win[k]={t:now,n:0}); if(now-w.t>=60000){ w.t=now; w.n=0 } if(w.n>=M.perUserPerMin) return {ok:false,why:"تجاوز حد التعليقات للمستخدم"}; w.n++ }
 return {ok:true,text:t};
}
/** تجهيز النص للقراءة الصوتية */
export function speechText(t,R){ let s=String(t||""); s=R.emoji==="strip"?s.replace(EMOJI,""):s; s=s.replace(LINK,"").replace(/\s+/g," ").trim(); if(R.maxLen>0&&s.length>R.maxLen) s=s.slice(0,R.maxLen)+"…"; return s }

// ---------- المتغيرات الحية (لا قيم وهمية: المتغير الغائب = null) ----------
function arDur(ms){ const s=Math.max(0,Math.round(ms/1000)), d=Math.floor(s/86400), h=Math.floor(s/3600)%24, m=Math.floor(s/60)%60;
 const w=(n,one,two,few,many)=>n===1?one:n===2?two:n<=10?`${n} ${few}`:`${n} ${many}`;
 const p=[]; if(d) p.push(w(d,"يوم","يومان","أيام","يوماً")); if(h) p.push(w(h,"ساعة","ساعتان","ساعات","ساعة")); if(m) p.push(w(m,"دقيقة","دقيقتان","دقائق","دقيقة"));
 if(!p.length) p.push(w(s%60||0,"ثانية","ثانيتان","ثوانٍ","ثانية")); return p.join(" و") }
export function botVars(ctx,ev){
 const D=ctx.D||{tot:{}}, C=ctx.C, L=ctx.layout||{widgets:[]}, now=ctx.now||Date.now(), src={D,H:ctx.H||[],DN:ctx.DN,DC:ctx.DC};
 const v={};
 v.username=ev?.user?.name||ev?.name||null;
 const s=C&&C.subathon; v.subathon_remaining=!s?null:s.status==="running"||s.status==="paused"?arDur(remaining(s,now)):s.status==="ended"?"السبثون انتهى":"السبثون لم يبدأ بعد";
 v.likes_total=(D.tot&&D.tot.likes!=null)?Math.round(D.tot.likes).toLocaleString("en-US"):null;
 const lg=(L.widgets||[]).find(w=>w.visible!==false&&(w.type==="goal"||(w.type==="sgoal"&&w.source==="likes")));
 if(lg){ const cur=lg.type==="goal"?(D.tot.likes||0):sgProgress(lg,src).cur, tgt=Math.max(1,+lg.target||1); v.likes_goal=tgt.toLocaleString("en-US"); v.likes_remaining=Math.max(0,Math.ceil(tgt-cur)).toLocaleString("en-US") } else { v.likes_goal=null; v.likes_remaining=null }
 const sg=(L.widgets||[]).find(w=>w.visible!==false&&w.type==="sgoal"&&w.source!=="likes");
 if(sg){ const g=sgProgress(sg,src); v.support_goal=`${sg.title||"الهدف"} ${sgFmt(sg,g.cur,src)} / ${sgFmt(sg,g.tgt,src)}` } else v.support_goal=null;
 const tg=entries({type:"gifts",sortBy:"value",topN:1},D,ctx.H||[])[0]; v.top_supporter=tg?tg.name:null;
 const tl=entries({type:"likes",topN:1},D,ctx.H||[])[0]; v.top_liker=tl?tl.name:null;
 const acc=(ctx.socials&&ctx.socials.accounts)||[]; const views=acc.filter(a=>a.enabled!==false).map(a=>({a,v:accountView(a)}));
 for(const p of ["tiktok","instagram","snapchat","youtube","x","twitch","kick","discord","roblox","fortnite","minecraft"]){ const f=views.find(x=>x.a.platform===p); v["social_"+p]=f?(f.v.user||f.v.title||null):null }
 v.socials=views.length?views.map(x=>`${x.v.platform} ${x.v.user}`.trim()).join(" · "):null;
 if(ev&&ev.type==="gift"){ v.gift_name=ev.gift||(GIFTS.find(g=>String(g[2])===String(ev.giftId))||[])[0]||"هدية"; v.gift_count=String(Math.max(1,+ev.count||1)) }
 if(ev&&ev.type==="donation"){ v.amount=`${ev.amount} ${({SAR:"ريال",AED:"درهم",KWD:"دينار",USD:"دولار"})[ev.currency]||ev.currency||""}`.trim() }
 return v;
}
/** تعبئة القالب. إذا غاب متغير مطلوب → null (يُستخدم النص البديل بدل اختراع قيمة) */
export function fillTpl(tpl,vars){ let missing=false; const out=String(tpl||"").replace(/\{([a-z_]+)\}/g,(m,k)=>{ if(!(k in vars)) return m; const x=vars[k]; if(x==null||x===""){ missing=true; return "" } return String(x) }); return missing?null:out.replace(/\s+/g," ").trim() }

// ---------- أدوات المعدل ----------
function bgate(st,key,now,{cooldownMs=0,perMin=0}){ if(cooldownMs>0&&st.last[key]&&now-st.last[key]<cooldownMs) return false;
 if(perMin>0){ const w=st.win[key]||(st.win[key]={t:now,n:0}); if(now-w.t>=60000){ w.t=now; w.n=0 } if(w.n>=perMin) return false } return true }
function bmark(st,key,now,perMin){ st.last[key]=now; if(perMin>0){ (st.win[key]||(st.win[key]={t:now,n:0})).n++ } }
const roleOf=u=>u&&u.mod?"mod":u&&u.sub?"sub":"all";
function out(cfg,st,bot,kind,text,ev,o={}){ const u=ev&&(ev.user||{name:ev.name})||{}; const say=o.say!==false&&cfg.output?.say!==false, show=o.show!==false&&cfg.output?.show!==false;
 st.lastBotAt=o.now||Date.now(); return {id:bid(),at:o.now||Date.now(),bot,kind,text,speech:o.speech??text,user:{name:u.name||"",av:u.avatar||""},prio:o.prio??1,say,show,test:!!(ev&&ev.test),srcId:ev&&ev.id||null} }

/** معالجة حدث بث → مخرجات البوتات */
export function botsOnEvent(cfg,st,ev,ctx){
 if(!cfg||!cfg.enabled||!ev) return [];
 const now=ctx.now||Date.now(), S=cfg.status||{}, O=[]; const push=x=>{ if(x){ O.push(x); st.log.unshift({at:now,bot:x.bot,kind:x.kind,text:x.text,test:x.test}); if(st.log.length>200) st.log.length=200 } };
 const V=()=>botVars(ctx,ev), uk=ev.user?.id||ev.user?.name||ev.name||"";
 if(ev.type==="gift"&&ev.user){ st.gifters[uk]=true; if((+ev.value||0)>=1000) st.lastBigAt=now }
 if(ev.type==="comment"){
  st.stats.received++; st.chat.push(now); while(st.chat.length&&now-st.chat[0]>60000) st.chat.shift();
  const m=moderate(cfg,st,ev,now); if(!m.ok){ st.stats.filtered++; return O }
  const text=m.text, n=normAr(text), u=ev.user||{}, role=roleOf(u);
  let handled=false;
  // 1) الأوامر
  if(S.commands&&n.startsWith("!")){ const name=n.split(" ")[0];
   const c=(cfg.commands||[]).find(x=>x.enabled&&normAr(x.name)===name);
   if(c){ handled=true; const okPerm=c.perm==="all"||(c.perm==="mod"&&u.mod)||(c.perm==="sub"&&(u.sub||u.mod))||(c.perm==="gifter"&&(st.gifters[uk]||u.mod));
    if(okPerm&&bgate(st,"c|"+c.id,now,{cooldownMs:c.cooldownMs})&&bgate(st,"cu|"+c.id+"|"+uk,now,{cooldownMs:c.userCooldownMs})){ bmark(st,"c|"+c.id,now); bmark(st,"cu|"+c.id+"|"+uk,now);
     const t=fillTpl(c.text,V())??fillTpl(c.fallback||"هذه المعلومة غير متاحة حالياً",V())??"هذه المعلومة غير متاحة حالياً"; st.stats.commands[c.name]=(st.stats.commands[c.name]||0)+1;
     push(out(cfg,st,"commands","cmd",t,ev,{say:c.say,show:c.show,prio:2,now})) } } }
  // 2) الردود التلقائية
  if(!handled&&S.replies) for(const r of (cfg.replies||[]).filter(x=>x.enabled&&x.keyword)){
   let hit=false; const k=normAr(r.keyword);
   try{ hit=r.match==="exact"?n===k:r.match==="starts"?n.startsWith(k):r.match==="regex"?new RegExp(r.keyword,"i").test(text):n.includes(k) }catch(e){ st.stats.errors++; continue }
   if(!hit) continue;
   if(r.oncePerUser&&st.user["r|"+r.id+"|"+uk]) break;
   if(!bgate(st,"r|"+r.id,now,{cooldownMs:r.cooldownMs,perMin:r.perMin})) break;
   bmark(st,"r|"+r.id,now,r.perMin); if(r.oncePerUser) st.user["r|"+r.id+"|"+uk]=now;
   const opts=(r.replies||[]).filter(Boolean); if(!opts.length) break; const pick=opts[Math.floor((ctx.rand||Math.random)()*opts.length)];
   const t=fillTpl(pick,V()); if(t){ st.stats.replies++; push(out(cfg,st,"replies","reply",t,ev,{say:r.say,show:r.show,prio:1,now})) } handled=true; break }
  // 3) القارئ الصوتي
  if(S.reader){ const R=cfg.reader||{}; let ok=false, body=text;
   switch(R.mode){ case "mods": ok=!!u.mod; break; case "subs": ok=!!(u.sub||u.mod); break; case "gifters": ok=!!st.gifters[uk]; break;
    case "keyword": ok=!!R.keyword&&n.includes(normAr(R.keyword)); break;
    case "prefix": { const p=normAr(R.prefix||"!قل"); ok=n.startsWith(p); if(ok) body=text.slice(text.length-n.length+p.length).trim()||""; break }
    case "users": ok=String(R.users||"").split(/[,،\n]/).map(x=>normAr(x.replace(/^@/,""))).filter(Boolean).some(x=>x===normAr(u.name)||x===normAr(uk)); break;
    case "random": ok=(ctx.rand||Math.random)()*100<(+R.randomPct||0); break;
    case "approve": ok=true; break;
    default: ok=!n.startsWith("!") }
   const sp=speechText(body,R);
   if(ok&&sp){ st.stats.read++; const say=(R.sayName!==false&&u.name?`${u.name} يقول: `:"")+sp;
    push({...out(cfg,st,"reader","read",body,ev,{speech:say,show:false,prio:({mod:3,sub:2})[role]??(st.gifters[uk]?1:0),now}),role,needApprove:R.mode==="approve",user:{name:u.name||"",av:u.avatar||"",id:uk}}) } }
 }
 else if(ev.type==="gift"&&S.thanks&&cfg.thanks?.gift?.enabled){ const T=cfg.thanks, per=ev.diamonds!=null?+ev.diamonds:(+ev.value||0)/Math.max(1,+ev.count||1);
  if((+ev.value||per)>=(+T.gift.minDiamonds||0)&&bgate(st,"tg|"+uk,now,{cooldownMs:3000})){ bmark(st,"tg|"+uk,now);
   const by=(T.gift.byGift||[]).find(x=>String(x.giftId)===String(ev.giftId)); let tpl=by?by.tpl:T.gift.tpl;
   if(!st.firstDone&&T.first?.enabled){ st.firstDone=true; tpl=T.first.tpl }
   const t=fillTpl(tpl,V()); if(t){ st.stats.thanks++; push(out(cfg,st,"thanks","thanks",t,ev,{say:T.say,show:T.show,prio:3,now})) } } }
 else if(ev.type==="donation"&&S.thanks&&cfg.thanks?.donation?.enabled){ const T=cfg.thanks;
  if((+ev.amount||0)>=(+T.donation.min||0)){ let tpl=T.donation.tpl; if(!st.firstDone&&T.first?.enabled){ st.firstDone=true; tpl=T.first.tpl }
   const t=fillTpl(tpl,{...V(),username:ev.anonymous?"داعم مجهول":(ev.name||"داعم")}); if(t){ st.stats.thanks++; push(out(cfg,st,"thanks","thanks",t,{...ev,user:{name:ev.anonymous?"داعم مجهول":ev.name}},{say:T.say,show:T.show,prio:3,now})) } } }
 else if((ev.type==="follow"||ev.type==="subscribe"||ev.type==="share")&&S.follows){ const F=cfg.follows||{}, c=F[ev.type];
  if(c&&c.enabled&&bgate(st,"f|"+ev.type,now,{perMin:c.perMin})){ bmark(st,"f|"+ev.type,now,c.perMin); const t=fillTpl(c.tpl,V()); if(t){ st.stats.follows++; push(out(cfg,st,"follows",ev.type,t,ev,{say:F.say,show:F.show,prio:ev.type==="subscribe"?3:1,now})) } } }
 else if(ev.type==="join"&&S.welcome){ const W=cfg.welcome||{};
  const list=String(W.users||"").split(/[,،\n]/).map(x=>normAr(x.replace(/^@/,""))).filter(Boolean), u=ev.user||{};
  const special=list.length&&(list.includes(normAr(u.name))||list.includes(normAr(uk)));
  if((!W.onlyKnown||special||st.gifters[uk]||u.mod||u.sub)&&!(W.oncePerUser!==false&&st.welcomed[uk])&&bgate(st,"welcome",now,{perMin:W.perMin||4})){
   bmark(st,"welcome",now,W.perMin||4); st.welcomed[uk]=now; const tp=(W.tpls||[]).filter(Boolean); const t=tp.length?fillTpl(tp[Math.floor((ctx.rand||Math.random)()*tp.length)],V()):null;
   if(t){ st.stats.welcome++; push(out(cfg,st,"welcome","welcome",t,ev,{say:W.say,show:W.show,prio:0,now})) } } }
 return O;
}
/** الرسائل الدورية (تُستدعى من ساعة الغرفة) */
export function botsTick(cfg,st,ctx){
 if(!cfg||!cfg.enabled||!cfg.status?.periodic||!ctx.live) return [];
 const P=cfg.periodic||{}, items=(P.items||[]).filter(x=>x.enabled&&x.text&&+x.everyMin>0), now=ctx.now||Date.now(); if(!items.length) return [];
 if(P.maxPerStream>0&&st.perCount>=P.maxPerStream) return [];
 while(st.chat.length&&now-st.chat[0]>60000) st.chat.shift();
 if(P.minChatPerMin>0&&st.chat.length<P.minChatPerMin) return [];
 if(P.minGapSinceBotMs>0&&st.lastBotAt&&now-st.lastBotAt<P.minGapSinceBotMs) return [];
 if(P.pauseOnBigMs>0&&st.lastBigAt&&now-st.lastBigAt<P.pauseOnBigMs) return [];
 const due=items.filter(x=>now-(st.perLast[x.id]||ctx.startedAt||0)>=x.everyMin*60000); if(!due.length) return [];
 let it; if(P.order==="random"){ const pool=due.length>1?due.filter(x=>x.id!==st.lastPer):due; it=pool[Math.floor((ctx.rand||Math.random)()*pool.length)] }
 else { const n=items.length; for(let k=0;k<n;k++){ const c=items[(st.perIdx+k)%n]; if(due.includes(c)){ it=c; break } } st.perIdx=(items.indexOf(it)+1)%n }
 const t=fillTpl(it.text,botVars(ctx,null)); st.perLast[it.id]=now; if(!t) return [];
 st.lastPer=it.id; st.perCount++; st.stats.periodic++; const o=out(cfg,st,"periodic","periodic",t,null,{say:P.say,show:P.show,prio:0,now}); st.log.unshift({at:now,bot:"periodic",kind:"periodic",text:t}); return [o];
}

// ---------- قائمة انتظار الصوت (في المشغّل الوحيد) ----------
/** إضافة عنصر مع الأولوية والحد الأقصى ومنع التكرار */
export function vqPush(q,item,Q){ const now=item.at||Date.now(), max=Q.max||15;
 if(q.some(x=>x.srcId&&x.srcId===item.srcId&&x.kind===item.kind)) return q;
 if(q.some(x=>x.speech===item.speech&&now-x.at<30000)) return q;
 const prio=item.prio??0; q.push({...item,prio});
 if(q.length>max){ let low=0; for(let i=1;i<q.length;i++) if(q[i].prio<q[low].prio||(q[i].prio===q[low].prio&&q[i].at<q[low].at)) low=i; q.splice(low,1) }
 return q }
/** اختيار التالي: الأعلى أولوية، مع منع نفس المستخدم مرتين متتاليتين، وحذف المنتهي صلاحيته */
export function vqNext(q,Q,lastUser,now=Date.now()){
 const exp=(Q.expireSec||60)*1000; for(let i=q.length-1;i>=0;i--) if(q[i].kind==="read"&&now-q[i].at>exp) q.splice(i,1);
 if(!q.length) return null;
 const ready=q.filter(x=>!x.needApprove||x.approved); if(!ready.length) return null;
 let cand=[...ready].sort((a,b)=>b.prio-a.prio||a.at-b.at);
 if(Q.noSameUserRow&&lastUser&&cand.length>1){ const alt=cand.find(x=>x.user?.name!==lastUser); if(alt&&(Q.fair!==false||alt.prio===cand[0].prio)) cand=[alt,...cand.filter(x=>x!==alt)] }
 const it=cand[0]; q.splice(q.indexOf(it),1); return it;
}
/** 20 قالب صوتي جاهز — تأثيرات بالمتاح فعلياً في Web Speech (السرعة/الطبقة/الصوت) */
export const VOICE_PRESETS=[["natural","طبيعي",1,1],["calm","هادئ",.85,1],["fast","سريع",1.45,1],["deep","عميق",.9,.55],["high","حاد",1.05,1.6],["robot","روبوت",.95,.2],["electro","إلكتروني",1.15,.35],["party","احتفالي",1.2,1.35],["gamer","ألعاب",1.25,1.1],["comic","كوميدي",1.35,1.8],["narrator","راوي",.8,.8],["news","مذيع",1,.95],["whisper","هادئ جداً",.75,1.1],["epic","ملحمي",.85,.6],["kid","طفولي",1.15,1.9],["giant","عملاق",.7,.1],["sport","معلق رياضي",1.4,1.15],["slowmo","بطيء",.6,1],["chipmunk","سنجاب",1.6,2],["royal","ملكي",.9,.8]];

/** تقرير الإمكانيات الحقيقي لكل ميزة */
export const CAPABILITY=[
 ["استقبال التعليقات","tiktok","يعمل عبر المكتبة غير الرسمية tiktok-live-connector (يحتاج الخادم)"],
 ["الأوامر والردود التلقائية","overlay","تعمل بالكامل — الرد يظهر في Overlay ويُقرأ صوتياً ويمكن نسخه للإرسال اليدوي"],
 ["إرسال رسالة داخل شات TikTok","unavailable","غير متاح حالياً: لا يوجد تكامل مصرّح به للإرسال — لا نستخدم طرقاً تتجاوز قيود المنصة"],
 ["القارئ الصوتي (أصوات المتصفح)","full","يعمل بالكامل عبر Web Speech على جهاز المشغّل — الأصوات المتاحة حسب نظام الجهاز"],
 ["أصوات ذكاء اصطناعي طبيعية/سعودية","provider","تحتاج مزود TTS (مفتاح على الخادم)"],
 ["شكر الهدايا والدونيشن","full","يعمل بالكامل (الدونيشن بعد تأكيد الدفع فقط)"],
 ["المتابعات والاشتراكات","tiktok","تعمل عند وصول الحدث (الاشتراكات للحسابات المفعّلة فقط)"],
 ["الرسائل الدورية","overlay","تعمل أثناء البث المتصل، وتُعرض في Overlay/صوتياً"],
 ["بوت الترحيب عند الدخول","tiktok","يعتمد على حدث الدخول من المكتبة غير الرسمية (أُضيف للخادم) — غير مؤكد حتى يصل فعلاً"],
 ["صفة المشرف/المشترك في التعليقات","tiktok","تُقرأ إن أرسلتها المكتبة؛ وإلا تُعامل كمشاهد عادي"],
 ["الذكاء الاصطناعي","provider","يحتاج مزود AI على الخادم (المرحلة القادمة)"],
 ["الحظر/الحذف داخل TikTok","unavailable","غير متاح: الفلترة تمنع القراءة والعرض فقط"],
];
