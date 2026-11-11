// ====== أهداف الدعم التفاعلية 2.0: محرك تعبئة + تصاميم مرئية حقيقية (SVG) ======
// كل تصميم يرسم شكله ويُملأ فعلياً بنسبة التقدم (650/1000 = 65%)، مع مراحل وتأثيرات وآخر داعم.
// الخلفية الخارجية شفافة 100%: لا يوجد صندوق خلف العنصر.
import { View } from "./view.js";
import { esc, avatar, clamp, GIFTS } from "./defs.js";
import { SG_DESIGNS, sgProgress, sgFmt, SG_ICONS } from "./lb.js";
import { donorTotals, defaultDonCfg, CURRENCIES } from "./donations.js";

export const VG_CATS={saudi:"🇸🇦 أساطير السعودية",legend:"الأسطورية",treasure:"الكنوز والألماس",energy:"الألعاب والطاقة",creative:"الإبداعية",b6o6:"حصرية B6O6",vessel:"الأكواب والأوعية",gem:"الألماس والجواهر",chest:"الصناديق والكنوز",clock:"الساعات والعدادات",tower:"الأبراج والبناء",heart:"القلوب والغيوم",game:"الألعاب والنيون",mini:"الأهداف المصغرة",lux:"الفاخرة",fun:"الإبداعية"};
/** أنواع التعبئة (محرك موحد) — كل نوع مرتبط فعلياً بنسبة التقدم */
/** عدد التصاميم المخطط لكل مجموعة (لعرض التقدم في المكتبة) */
export const VG_PLAN={saudi:20,legend:15,treasure:10,energy:10,creative:15,b6o6:10,vessel:10,gem:10,chest:10,clock:10};
export const FILL_TYPES=[["liquidUp","سائل من الأسفل للأعلى"],["pieces","قطعة قطعة"],["coins","عملات تتجمع"],["ringCW","دائرية مع عقارب الساعة"]];
export const VG_FX=[["sweep","White Light Sweep"],["goldSweep","Golden Light Sweep"],["sparkle","Diamond Sparkle"],["coins","Coin Drop"],["hearts","Heart Burst"],["ripple","Progress Ripple"],["glow","Soft Glow"],["bounce","Progress Bounce"]];
export const VG_DESIGNS=[
 {id:"goldCup",n:1,name:"كأس الذهب",cat:"vessel",fill:"liquidUp",desc:"كأس ذهبي يمتلئ بسائل ذهبي مع فقاعات ولمعة",vg:true,shape:"vg",fx:"goldSweep"},
 {id:"diamondForm",n:11,name:"الألماسة المتكوّنة",cat:"gem",fill:"pieces",desc:"ألماسة تتكوّن قطعة قطعة مع كل دعم",vg:true,shape:"vg",fx:"sparkle"},
 {id:"treasureChest",n:21,name:"صندوق الكنز",cat:"chest",fill:"coins",desc:"صندوق يمتلئ بالذهب ويُفتح تدريجياً: خشب ← فضة ← ذهب ← ألماس",vg:true,shape:"vg",fx:"coins"},
 {id:"ringGoal",n:31,name:"الساعة الدائرية",cat:"clock",fill:"ringCW",desc:"حلقة تمتلئ بالإضاءة مع عقارب الساعة ومؤشر متوهج",vg:true,shape:"vg",fx:"ripple"},
];
for(const d of VG_DESIGNS) if(!SG_DESIGNS.find(x=>x.id===d.id)) SG_DESIGNS.push(d);
export const vgDesignOf=id=>VG_DESIGNS.find(d=>d.id===id);

/** المرحلة الحالية من نسب المراحل (افتراضي 25/50/75/90) */
export function vgStage(pct,stages){ const S=(Array.isArray(stages)?stages:String(stages||"25,50,75,90").split(",")).map(Number).filter(x=>x>0&&x<100).sort((a,b)=>a-b); let n=0; for(const s of S) if(pct>=s) n++; return {n,total:S.length,list:S} }
/** وحدة المساهمة كما تظهر في رسالة الداعم */
export function vgUnit(w,src,ev){
 switch(w.source){
  case "gift": return ev?.gift||(GIFTS.find(g=>String(g[2])===String(w.giftKey))||[])[0]||"هدية";
  case "giftCount": return "هدية"; case "giftPoints": return "💎"; case "likes": return "لايك"; case "follows": return "متابعة"; case "subs": return "اشتراك"; case "share": return "مشاركة";
  case "donation": { const DC=src.DC||defaultDonCfg(), c=w.currency||DC.currency; return ({SAR:"ريال",AED:"درهم",KWD:"دينار",USD:"$"})[c]||(CURRENCIES[c]||{}).sym||c }
 }
 return "";
}
/** أكبر مساهم وعدد المساهمين (من البيانات المحفوظة، لا من الذاكرة) */
export function vgContrib(w,src){
 const D=src.D||{}; let map=null, n=0;
 if(w.source==="gift") map=(D.giftBy||{})[String(w.giftKey||"")];
 else if(w.source==="giftPoints"||w.source==="giftCount") map=D.gifts;
 else if(w.source==="likes") map=D.likes;
 else if(w.source==="donation"){ const DC=src.DC||defaultDonCfg(); const L=donorTotals(src.DN||{list:[]},DC,{period:"all",currency:w.currency||DC.currency,now:Date.now()}); return {top:L[0]?{name:L[0].name,av:L[0].av,v:L[0].v}:null,n:L.length} }
 if(!map) return {top:null,n:0};
 let top=null; for(const k in map){ const r=map[k], v=w.source==="giftCount"?(r.c||0):r.v; if(v>0){ n++; if(!top||v>top.v) top={name:r.name,av:r.av,v} } }
 return {top,n};
}

const vgid=()=>Math.random().toString(36).slice(2,8);
/** سجل تصاميم إضافية: رسم + CSS (تُضاف من ملفات الدفعات) */
export const VG_ART={};
export const VG_EXTRA_CSS=[];
export function vgRegister(list){ for(const x of list){ const {art:a,css,...d}=x; const full={vg:true,shape:"vg",...d}; if(!VG_DESIGNS.find(y=>y.id===full.id)) VG_DESIGNS.push(full); if(!SG_DESIGNS.find(y=>y.id===full.id)) SG_DESIGNS.push(full); VG_ART[full.id]=a; if(css) VG_EXTRA_CSS.push(css) } }
/** رسومات SVG لكل تصميم — المتغيرات تُحدَّث بالنسبة عبر CSS vars (--p 0..1) */
function art(d,id){
 if(VG_ART[d.id]) return VG_ART[d.id](id);
 switch(d.id){
  case "goldCup": return `<svg class="vg-svg" viewBox="0 0 200 240"><defs>
   <clipPath id="c${id}"><path d="M44 34H156Q154 118 122 146Q100 160 78 146Q46 118 44 34Z"/></clipPath>
   <linearGradient id="g${id}" x1="0" x2="1"><stop offset="0" stop-color="#8a5a12"/><stop offset=".25" stop-color="#fbe39b"/><stop offset=".5" stop-color="#d4a537"/><stop offset=".8" stop-color="#fff1c1"/><stop offset="1" stop-color="#8a5a12"/></linearGradient>
   <linearGradient id="l${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9a3"/><stop offset=".35" stop-color="#f5c542"/><stop offset="1" stop-color="#b7791f"/></linearGradient></defs>
   <g class="vg-glow"><ellipse cx="100" cy="95" rx="78" ry="70" fill="#f5c542" opacity=".25"/></g>
   <path d="M44 48Q14 46 16 74Q18 100 52 106" fill="none" stroke="url(#g${id})" stroke-width="8" stroke-linecap="round"/><path d="M156 48Q186 46 184 74Q182 100 148 106" fill="none" stroke="url(#g${id})" stroke-width="8" stroke-linecap="round"/>
   <path d="M44 34H156Q154 118 122 146Q100 160 78 146Q46 118 44 34Z" fill="#00000055"/>
   <g clip-path="url(#c${id})"><g class="vg-liq"><path class="vg-wave" d="M-200 0Q-175 -8 -150 0T-100 0T-50 0T0 0T50 0T100 0T150 0T200 0T250 0T300 0T350 0T400 0V200H-200Z" fill="url(#l${id})"/>
    <circle class="vg-bub b1" cx="80" cy="120" r="3.5" fill="#fff8"/><circle class="vg-bub b2" cx="105" cy="130" r="2.5" fill="#fff8"/><circle class="vg-bub b3" cx="125" cy="115" r="3" fill="#fff8"/><circle class="vg-bub b4" cx="92" cy="140" r="2" fill="#fff8"/></g>
    <rect class="vg-shine" x="58" y="30" width="16" height="130" fill="#ffffff55" transform="skewX(-8)"/></g>
   <path d="M44 34H156Q154 118 122 146Q100 160 78 146Q46 118 44 34Z" fill="none" stroke="url(#g${id})" stroke-width="6"/>
   <rect x="38" y="28" width="124" height="10" rx="5" fill="url(#g${id})"/>
   <path d="M90 150H110L114 196H86Z" fill="url(#g${id})"/><ellipse cx="100" cy="206" rx="46" ry="12" fill="url(#g${id})"/><ellipse cx="100" cy="202" rx="40" ry="7" fill="#fff3" />
   <g class="vg-crown" transform="translate(76 0)"><path d="M3 22 6 5l9 9L24 0l9 14 9-9 3 17z" fill="url(#g${id})"/></g>
   <g class="vg-spk"><path d="M30 20l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#fff"/><path d="M168 130l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="#fff"/><path d="M176 18l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#fde68a"/></g></svg>`;
  case "diamondForm": { const F=[[[70,70],[100,70],[100,175]],[[100,70],[130,70],[100,175]],[[45,70],[70,70],[100,175]],[[130,70],[155,70],[100,175]],[[20,70],[45,70],[100,175]],[[155,70],[180,70],[100,175]],[[70,70],[100,40],[130,70]],[[55,40],[100,40],[70,70]],[[100,40],[145,40],[130,70]],[[20,70],[55,40],[70,70]],[[145,40],[180,70],[130,70]]];
   const tone=["#a5f3fc","#67e8f9","#cffafe","#22d3ee","#e0f7ff","#38bdf8","#f0fdff","#bae6fd","#7dd3fc","#ecfeff","#a5f3fc"];
   return `<svg class="vg-svg" viewBox="0 0 200 200"><g class="vg-glow"><circle cx="100" cy="105" r="80" fill="#67e8f9" opacity=".25"/></g>
    <g class="vg-rays">${Array.from({length:12},(_,i)=>`<rect x="98" y="0" width="4" height="40" rx="2" fill="#cffafe" transform="rotate(${i*30} 100 105)" opacity=".7"/>`).join("")}</g>
    ${F.map((p,i)=>`<polygon class="vg-fc" data-i="${i}" points="${p.map(x=>x.join(",")).join(" ")}" style="--c:${tone[i]}"/>`).join("")}
    <polygon points="20,70 55,40 145,40 180,70 100,175" fill="none" stroke="#e0f7ff" stroke-width="2" stroke-linejoin="round" opacity=".8"/>
    <g class="vg-spk"><path d="M150 30l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#fff"/><path d="M40 120l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="#fff"/><path d="M170 110l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#cffafe"/></g></svg>` }
  case "treasureChest": return `<svg class="vg-svg" viewBox="0 0 220 210"><defs><clipPath id="c${id}"><rect x="34" y="40" width="152" height="66"/></clipPath>
   <linearGradient id="gd${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1a8"/><stop offset=".5" stop-color="#f5c542"/><stop offset="1" stop-color="#b7791f"/></linearGradient></defs>
   <g class="vg-glow"><ellipse cx="110" cy="90" rx="100" ry="70" fill="#f5c542" opacity=".25"/></g>
   <g class="vg-rays">${Array.from({length:9},(_,i)=>`<path d="M110 92L${70+i*10} -10L${76+i*10} -10Z" fill="#fde68a" opacity=".55"/>`).join("")}</g>
   <rect x="34" y="70" width="152" height="40" fill="#1a0f05"/>
   <g clip-path="url(#c${id})"><g class="vg-pile"><path d="M30 120Q60 74 110 70Q160 74 190 120Z" fill="url(#gd${id})"/>
    ${[[60,96],[84,86],[110,80],[136,86],[160,96],[72,104],[98,96],[124,96],[148,104],[110,104]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="9" ry="4" fill="#fde68a" stroke="#b7791f" stroke-width="1.2"/>`).join("")}
    <path d="M100 74l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#fff"/></g></g>
   <g class="vg-body"><rect x="30" y="104" width="160" height="86" rx="8" fill="var(--cb,#8b5a2b)" stroke="#00000055" stroke-width="2"/>
    <rect x="30" y="104" width="160" height="10" fill="var(--cs,#5b3a1a)"/><rect x="60" y="104" width="12" height="86" fill="var(--cs,#5b3a1a)"/><rect x="148" y="104" width="12" height="86" fill="var(--cs,#5b3a1a)"/>
    <rect x="96" y="112" width="28" height="34" rx="5" fill="var(--cl,#d4a537)" stroke="#00000055"/><circle cx="110" cy="126" r="5" fill="#1a0f05"/><rect x="108" y="128" width="4" height="10" fill="#1a0f05"/>
    <rect class="vg-shine" x="40" y="110" width="14" height="76" fill="#ffffff22" transform="skewX(-10)"/></g>
   <g class="vg-lid"><path d="M30 104V82Q30 48 110 46Q190 48 190 82V104Z" fill="var(--cb,#8b5a2b)" stroke="#00000055" stroke-width="2"/>
    <path d="M30 96H190V104H30Z" fill="var(--cs,#5b3a1a)"/><rect x="60" y="50" width="12" height="54" fill="var(--cs,#5b3a1a)"/><rect x="148" y="50" width="12" height="54" fill="var(--cs,#5b3a1a)"/>
    <path d="M96 88H124V104H96Z" fill="var(--cl,#d4a537)"/></g>
   <g class="vg-spk"><path d="M24 40l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#fff"/><path d="M196 30l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="#fde68a"/></g></svg>`;
  case "ringGoal": return `<svg class="vg-svg" viewBox="0 0 200 200"><defs><linearGradient id="r${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--r1,#38bdf8)"/><stop offset="1" stop-color="var(--r2,#a78bfa)"/></linearGradient></defs>
   <g class="vg-glow"><circle cx="100" cy="100" r="92" fill="var(--r1,#38bdf8)" opacity=".18"/></g>
   <g class="vg-ticks">${Array.from({length:40},(_,i)=>`<rect class="vg-tk" data-i="${i}" x="99" y="4" width="2" height="8" rx="1" transform="rotate(${i*9} 100 100)"/>`).join("")}</g>
   <circle cx="100" cy="100" r="78" fill="#00000066" stroke="#ffffff1a" stroke-width="12"/>
   <circle class="vg-arc" cx="100" cy="100" r="78" fill="none" stroke="url(#r${id})" stroke-width="12" stroke-linecap="round" pathLength="100" transform="rotate(-90 100 100)"/>
   <g class="vg-head"><circle cx="100" cy="22" r="9" fill="#fff" opacity=".9"/><circle cx="100" cy="22" r="15" fill="var(--r1,#38bdf8)" opacity=".35"/></g></svg>`;
 }
 return "";
}

let vgCss=false;
function ensureVgCSS(){ if(vgCss||typeof document==="undefined") return; vgCss=true; const st=document.createElement("style"); st.id="b6o6-vg"; st.textContent=VG_CSS+VG_EXTRA_CSS.join("\n"); document.head.appendChild(st) }
const vgReduced=()=>{ try{ return matchMedia("(prefers-reduced-motion: reduce)").matches }catch(e){ return false } };
function countUp(el,from,to,f,ms){ if(el._raf) cancelAnimationFrame(el._raf); if(ms<=0||from===to){ el.textContent=f(to); return } const t0=performance.now(); const st=t=>{ const p=Math.min(1,(t-t0)/ms), e=1-Math.pow(1-p,3); el.textContent=f(from+(to-from)*e); if(p<1) el._raf=requestAnimationFrame(st) }; el._raf=requestAnimationFrame(st) }

Object.assign(View.prototype,{
 vgCls(d){ const w=this.w, W=w.w*this.cv.w, H=w.h*this.cv.h, horiz=W>H*1.25&&d.id!=="ringGoal";
  this.el.classList.add("vgw","vgd-"+d.id,horiz?"vg-h":"vg-v");
  this.el.style.setProperty("--vfs",Math.max(10,(horiz?Math.min(H*.16,W*.055):Math.min(W*.085,H*.06))*(w.fontScale||1))+"px") },
 buildVG(d){
  ensureVgCSS(); const w=this.w, id=vgid(), ed=this.opts.editor?'<div class="rh"></div><div class="lockb">🔒</div>':"";
  this.vgCls(d);
  const ic=w.icon||(w.source==="gift"&&w.giftEmoji)||SG_ICONS[w.source]||"🎯";
  this.el.innerHTML=`<div class="vg-art">${art(d,id)}${d.id==="ringGoal"?`<div class="vg-in"><div class="vg-ic">${esc(ic)}</div><div class="vg-pc"></div></div>`:""}</div>
   <div class="vg-info"><div class="vg-tt"><span class="vg-ic">${d.id==="ringGoal"?"":esc(ic)}</span><span class="tx">${esc(w.title||"")}</span></div>
    <div class="vg-val"><b class="vg-cur">0</b><span class="vg-tgt"></span>${d.id!=="ringGoal"?'<span class="vg-pc"></span>':""}</div>
    <div class="vg-last"></div><div class="vg-meta"></div></div><div class="vg-fx"></div>`+ed;
  const q=s=>this.el.querySelector(s);
  this.vg={d,cur:q(".vg-cur"),tgt:q(".vg-tgt"),pc:[...this.el.querySelectorAll(".vg-pc")],last:q(".vg-last"),meta:q(".vg-meta"),fx:q(".vg-fx"),art:q(".vg-art"),
   facets:[...this.el.querySelectorAll(".vg-fc")].sort((a,b)=>(+a.dataset.i||0)-(+b.dataset.i||0)),ticks:[...this.el.querySelectorAll(".vg-tk")],arc:q(".vg-arc"),head:q(".vg-head"),liq:q(".vg-liq"),pile:q(".vg-pile"),lid:q(".vg-lid"),prevCur:null,prevStage:null,lastSup:null};
 },
 /** تطبيق النسبة على التصميم (محرك التعبئة) */
 vgFill(p){ const V=this.vg; this.el.style.setProperty("--p",String(p));
  if(V.liq){ const top=+(V.liq.dataset.top||34), bot=+(V.liq.dataset.bot||152); V.liq.style.transform=`translateY(${bot-(bot-top)*p+(p>=1?-4:0)}px)` }
  if(V.facets.length){ const n=V.facets.length, f=p*n; V.facets.forEach((el,i)=>{ const on=Math.max(0,Math.min(1,f-i)); el.style.setProperty("--on",String(on)); el.classList.toggle("lit",on>=1) }) }
  if(V.pile){ V.pile.style.transform=`translateY(${(1-p)*(+(V.pile.dataset.h||48))}px)` }
  if(V.lid){ const o=Math.min(1,p*1.15); V.lid.style.transform=`translateY(${-o*30}px) scaleY(${1-o*.55})` }
  if(V.arc){ V.arc.style.strokeDasharray=`${p*100} 100`; if(V.head) V.head.style.transform=`rotate(${p*360}deg)`; const n=V.ticks.length; V.ticks.forEach((t,i)=>t.classList.toggle("on",i/n<p)) }
 },
 refreshVG(src,silent,ev){
  const V=this.vg, w=this.w; if(!V) return;
  const g=sgProgress(w,src), p=clamp(g.cur/g.tgt,0,1), f=v=>sgFmt(w,Math.min(v,g.tgt*99),src);
  const fx=!this.el.classList.contains("no-fx")&&!vgReduced(), lite=this.el.classList.contains("lb-lite");
  this.vgFill(p);
  const prev=V.prevCur==null?g.cur:V.prevCur;
  countUp(V.cur,silent?g.cur:prev,g.cur,f,fx&&!silent&&!lite?800:0); V.tgt.textContent=" / "+sgFmt(w,g.tgt,src);
  V.pc.forEach(e=>e.textContent=w.showPct===false?"":Math.floor(g.pct)+"%");
  const st=vgStage(g.pct,w.stages); for(let i=0;i<=5;i++) this.el.classList.toggle("vst-"+i,st.n===i); this.el.classList.toggle("done",g.done);
  if(d_matSync(this,g.pct)){}
  const c=w.showTop!==false||w.showCount!==false?vgContrib(w,src):null;
  V.meta.innerHTML=c?[w.showTop!==false&&c.top?`👑 ${esc(c.top.name)} <b>${sgFmt(w,c.top.v,src)}</b>`:"",w.showCount!==false&&c.n?`👥 ${c.n} مساهم`:""].filter(Boolean).join(" · "):"";
  const delta=g.cur-prev;
  if(ev&&delta>0){ const u=ev.user||{}; V.lastSup={name:ev.anonymous?"مجهول":(u.name||ev.name||""),av:u.avatar||"",d:delta,unit:vgUnit(w,src,ev),icon:(w.source==="gift"&&w.giftEmoji)||SG_ICONS[w.source]||"🎉",t:Date.now()} }
  if(w.showLast!==false&&V.lastSup){ const L=V.lastSup, html=`<img src="${esc(L.av||avatar(L.name||"?"))}" alt=""><span>${esc(L.icon)} ${esc(L.name)}</span><b>\u2066+${sgFmt(w,L.d,src)}\u2069 ${esc(L.unit)}</b>`;
   if(V.last.dataset.k!==String(L.t)){ V.last.dataset.k=String(L.t); V.last.innerHTML=html; if(fx&&!silent) V.last.animate([{opacity:0,transform:"translateY(40%)"},{opacity:1,transform:"none"}],{duration:420,easing:"cubic-bezier(.2,.8,.2,1)"}) } }
  else V.last.innerHTML="";
  if(!silent&&delta>0&&fx){ this.vgFx(w.fx||V.d.fx,V.lastSup&&ev?`${V.lastSup.icon} ${V.lastSup.name} \u2066+${sgFmt(w,delta,src)}\u2069 ${V.lastSup.unit}`.trim():`\u2066+${sgFmt(w,delta,src)}\u2069`) }
  if(!silent&&fx&&V.prevStage!=null&&st.n>V.prevStage&&!g.done) this.vgMilestone(st.list[st.n-1]);
  if(g.done&&this.sgDone===false&&fx){ this.el.classList.remove("celeb"); void this.el.offsetWidth; this.el.classList.add("celeb"); setTimeout(()=>this.el.classList.remove("celeb"),2600); this.vgBurst(22) }
  this.sgDone=g.done; V.prevCur=g.cur; V.prevStage=st.n;
 },
 vgFx(kind,text){ const L=this.vg.fx; if(!L) return;
  const pop=document.createElement("div"); pop.className="vg-pop"; pop.textContent=text; L.appendChild(pop); pop.animate([{opacity:0,transform:"translate(-50%,10%) scale(.8)"},{opacity:1,transform:"translate(-50%,-60%) scale(1)",offset:.25},{opacity:1,transform:"translate(-50%,-120%)",offset:.8},{opacity:0,transform:"translate(-50%,-160%)"}],{duration:2300,easing:"ease-out"}).onfinish=()=>pop.remove();
  const a=this.vg.art;
  if(kind==="sweep"||kind==="goldSweep"){ const s=document.createElement("i"); s.className="vg-swp"+(kind==="goldSweep"?" gold":""); a.appendChild(s); s.animate([{transform:"translateX(160%) skewX(-18deg)"},{transform:"translateX(-260%) skewX(-18deg)"}],{duration:900,easing:"ease-in-out"}).onfinish=()=>s.remove() }
  else if(kind==="coins"||kind==="hearts"||kind==="sparkle"){ const ch=kind==="coins"?"🪙":kind==="hearts"?"💗":"✨"; for(let i=0;i<7;i++){ const c=document.createElement("i"); c.className="vg-pt"; c.textContent=ch; c.style.left=(20+Math.random()*60)+"%"; L.appendChild(c);
    const from=kind==="coins"?"-60%":"60%", to=kind==="coins"?"40%":"-80%"; c.animate([{opacity:0,transform:`translateY(${from}) scale(.6)`},{opacity:1,offset:.2},{opacity:0,transform:`translateY(${to}) scale(1) rotate(${(Math.random()-.5)*90}deg)`}],{duration:900+Math.random()*500,delay:i*60,easing:"cubic-bezier(.3,.6,.4,1)",fill:"backwards"}).onfinish=()=>c.remove() } }
  else if(kind==="ripple"){ const r=document.createElement("i"); r.className="vg-rip"; a.appendChild(r); r.animate([{transform:"translate(-50%,-50%) scale(.6)",opacity:.9},{transform:"translate(-50%,-50%) scale(1.5)",opacity:0}],{duration:900,easing:"ease-out"}).onfinish=()=>r.remove() }
  else if(kind==="glow"){ a.animate([{filter:"drop-shadow(0 0 0 transparent)"},{filter:"drop-shadow(0 0 18px #fff)"},{filter:"drop-shadow(0 0 0 transparent)"}],{duration:900}) }
  else if(kind==="bounce"){ a.animate([{transform:"scale(1)"},{transform:"scale(1.08)"},{transform:"scale(.97)"},{transform:"scale(1)"}],{duration:600}) }
 },
 vgMilestone(s){ const L=this.vg.fx; if(!L) return; const m=document.createElement("div"); m.className="vg-ms"; m.textContent=`🎯 ${s}%`; L.appendChild(m); m.animate([{opacity:0,transform:"translate(-50%,-50%) scale(.5)"},{opacity:1,transform:"translate(-50%,-50%) scale(1.1)",offset:.3},{opacity:0,transform:"translate(-50%,-90%) scale(1)"}],{duration:1600}).onfinish=()=>m.remove() },
 vgBurst(n){ const L=this.vg.fx; if(!L||this.el.classList.contains("lb-lite")) return; for(let i=0;i<n;i++){ const c=document.createElement("i"); c.className="vg-cf"; c.style.background=["#f5c542","#fff","#22d3ee","#f472b6","#a3e635"][i%5]; c.style.left="50%"; c.style.top="45%"; L.appendChild(c); const a=Math.PI*2*i/n, r=60+Math.random()*90;
  c.animate([{transform:"translate(0,0) rotate(0)",opacity:1},{transform:`translate(${Math.cos(a)*r}px,${Math.sin(a)*r}px) rotate(${Math.random()*540}deg)`,opacity:0}],{duration:1200+Math.random()*500,easing:"cubic-bezier(.2,.8,.2,1)"}).onfinish=()=>c.remove() } },
});
/** مواد الصندوق حسب المرحلة: خشب ← فضة ← ذهب ← ألماس */
function d_matSync(v,pct){ if(v.vg.d.id!=="treasureChest") return; const m=pct>=100?["#67e8f9","#e0f7ff","#ffffff"]:pct>=75?["#d4a537","#8a5a12","#fff1c1"]:pct>=50?["#94a3b8","#475569","#e2e8f0"]:["#8b5a2b","#5b3a1a","#d4a537"]; const S=v.el.style; S.setProperty("--cb",m[0]); S.setProperty("--cs",m[1]); S.setProperty("--cl",m[2]); v.el.dataset.mat=pct>=100?"diamond":pct>=75?"gold":pct>=50?"silver":"wood" }

const VG_CSS=`
.vgw{background:none!important;border:0!important;box-shadow:none!important;display:flex;gap:calc(var(--vfs)*.6);align-items:center;color:var(--tx2,#fff);font-family:"Readex Pro","Changa",sans-serif}
.vgw.vg-v{flex-direction:column}.vgw.vg-h{flex-direction:row}
.vgw .vg-art{position:relative;flex:1 1 0;min-width:0;min-height:0;align-self:stretch;overflow:visible}
.vgw.vg-h .vg-art{flex:0 0 42%}
.vgw .vg-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible;filter:drop-shadow(0 6px 12px #0008)}
.vgw .vg-info{flex:none;text-align:center;display:flex;flex-direction:column;align-items:center;gap:calc(var(--vfs)*.25);min-width:0;max-width:100%}
.vgw.vg-h .vg-info{flex:1;align-items:flex-start;text-align:start}
.vgw .vg-tt{font:800 var(--vfs)/1.15 "Changa","Readex Pro",sans-serif;display:flex;gap:.3em;align-items:center;text-shadow:0 2px 6px #000c;white-space:nowrap;max-width:100%;overflow:hidden}
.vgw .vg-val{display:flex;align-items:baseline;gap:.15em;direction:ltr;text-shadow:0 2px 6px #000c}
.vgw .vg-cur{font:900 calc(var(--vfs)*1.5)/1 "Changa","Orbitron",sans-serif;color:var(--acc,#fde68a)}
.vgw .vg-tgt{font:700 calc(var(--vfs)*.9)/1 "Changa",sans-serif;opacity:.85}
.vgw .vg-val .vg-pc{margin-inline-start:.5em;font:800 calc(var(--vfs)*.75)/1 "Orbitron",monospace;color:var(--acc,#fde68a);background:#0008;border-radius:99px;padding:.15em .45em}
.vgw .vg-last{display:flex;align-items:center;gap:.35em;font-size:calc(var(--vfs)*.72);background:#000a;border:1px solid #ffffff22;border-radius:99px;padding:.2em .6em .2em .25em;max-width:100%;white-space:nowrap}
.vgw .vg-last:empty{display:none}.vgw .vg-last img{width:1.6em;height:1.6em;border-radius:50%;object-fit:cover}
.vgw .vg-last b{color:#86efac}
.vgw .vg-meta{font-size:calc(var(--vfs)*.6);opacity:.85;text-shadow:0 1px 4px #000}.vgw .vg-meta:empty{display:none}
.vgw .vg-fx{position:absolute;inset:0;pointer-events:none;overflow:visible}
.vgw .vg-pop{position:absolute;left:50%;top:30%;white-space:nowrap;font:900 calc(var(--vfs)*.95)/1 "Changa",sans-serif;color:#fff;background:linear-gradient(90deg,#16a34a,#22c55e);padding:.3em .8em;border-radius:99px;box-shadow:0 6px 18px #0008;z-index:5}
.vgw .vg-ms{position:absolute;left:50%;top:40%;font:900 calc(var(--vfs)*1.6)/1 "Changa",sans-serif;color:#fde68a;text-shadow:0 0 14px #f5c542,0 3px 8px #000;z-index:5}
.vgw .vg-pt{position:absolute;top:30%;font-size:calc(var(--vfs)*1.1)}
.vgw .vg-cf{position:absolute;width:8px;height:12px;border-radius:2px;z-index:4}
.vgw .vg-swp{position:absolute;top:-10%;bottom:-10%;width:22%;left:50%;background:linear-gradient(90deg,transparent,#ffffffcc,transparent);pointer-events:none;mix-blend-mode:screen}
.vgw .vg-swp.gold{background:linear-gradient(90deg,transparent,#fde68acc,transparent)}
.vgw .vg-rip{position:absolute;left:50%;top:50%;width:80%;aspect-ratio:1;border-radius:50%;border:3px solid var(--r1,#38bdf8);pointer-events:none}
.vgw .vg-glow{opacity:calc(.25 + var(--p,0)*.75);transition:opacity .8s}
.vgw .vg-spk,.vgw .vg-rays,.vgw .vg-crown{opacity:0;transition:opacity .6s}
.vgw.vst-3 .vg-spk,.vgw.vst-4 .vg-spk,.vgw.done .vg-spk{opacity:1}.vgw .vg-spk path{transform-box:fill-box;transform-origin:center;animation:vg-tw 1.8s ease-in-out infinite}
.vgw .vg-spk path:nth-child(2){animation-delay:-.6s}.vgw .vg-spk path:nth-child(3){animation-delay:-1.2s}
@keyframes vg-tw{0%,100%{transform:scale(.3);opacity:.3}50%{transform:scale(1);opacity:1}}
.vgw.done .vg-rays{opacity:1}.vgw .vg-rays{transform-box:view-box;transform-origin:50% 50%;animation:vg-spin 14s linear infinite}
@keyframes vg-spin{to{transform:rotate(360deg)}}
.vgw.vst-4 .vg-svg,.vgw.done .vg-svg{animation:vg-pulse 1.6s ease-in-out infinite}
@keyframes vg-pulse{50%{filter:drop-shadow(0 0 14px var(--acc,#fde68a)) drop-shadow(0 6px 12px #0008)}}
.vgw.celeb .vg-art{animation:vg-celeb 1.2s ease 2}@keyframes vg-celeb{30%{transform:scale(1.1)}60%{transform:scale(.97)}}
/* كأس الذهب */
.vgd-goldCup{--acc:#fde68a}
.vgd-goldCup .vg-liq{transition:transform 1.2s cubic-bezier(.2,.8,.2,1)}
.vgd-goldCup .vg-wave{animation:vg-wave 3s linear infinite}@keyframes vg-wave{to{transform:translateX(100px)}}
.vgd-goldCup .vg-bub{animation:vg-bub 2.6s ease-in infinite;opacity:0}.vgd-goldCup .b2{animation-delay:-.7s}.vgd-goldCup .b3{animation-delay:-1.4s}.vgd-goldCup .b4{animation-delay:-2s}
@keyframes vg-bub{0%{transform:translateY(0);opacity:0}20%{opacity:1}100%{transform:translateY(-110px);opacity:0}}
.vgd-goldCup.vst-2 .vg-crown,.vgd-goldCup.vst-3 .vg-crown,.vgd-goldCup.vst-4 .vg-crown,.vgd-goldCup.done .vg-crown{opacity:1}
.vgd-goldCup .vg-crown{animation:vg-bob 2.6s ease-in-out infinite}@keyframes vg-bob{50%{transform:translate(76px,-6px)}}
/* الألماسة المتكوّنة */
.vgd-diamondForm{--acc:#a5f3fc}
.vgd-diamondForm .vg-fc{fill:var(--c);fill-opacity:calc(var(--on,0)*.95);stroke:#e0f7ff;stroke-opacity:calc(.25 + var(--on,0)*.5);stroke-width:1.2;stroke-dasharray:calc((1 - var(--on,0))*4) calc((1 - var(--on,0))*3);transition:fill-opacity .6s,stroke-opacity .6s;transform-box:fill-box;transform-origin:center}
.vgd-diamondForm .vg-fc.lit{animation:vg-facet .7s cubic-bezier(.3,1.5,.5,1)}@keyframes vg-facet{0%{transform:scale(.6)}100%{transform:scale(1)}}
.vgd-diamondForm.done .vg-svg{animation:vg-pulse 1.4s ease-in-out infinite}
/* صندوق الكنز */
.vgd-treasureChest{--acc:#fde68a}
.vgd-treasureChest .vg-pile{transition:transform 1.2s cubic-bezier(.2,.8,.2,1)}
.vgd-treasureChest .vg-lid{transform-box:view-box;transform-origin:110px 46px;transition:transform 1.2s cubic-bezier(.3,1.3,.5,1)}
.vgd-treasureChest .vg-body rect,.vgd-treasureChest .vg-lid path,.vgd-treasureChest .vg-lid rect{transition:fill .8s}
.vgd-treasureChest .vg-rays{transform-origin:110px 92px}
.vgd-treasureChest.vst-3 .vg-rays{opacity:.5}
/* الساعة الدائرية */
.vgd-ringGoal{--acc:#7dd3fc;--r1:#38bdf8;--r2:#a78bfa}
.vgd-ringGoal .vg-art{width:100%}
.vgd-ringGoal .vg-arc{stroke-dasharray:0 100;transition:stroke-dasharray 1.2s cubic-bezier(.2,.8,.2,1);filter:drop-shadow(0 0 6px var(--r1))}
.vgd-ringGoal .vg-head{transform-box:view-box;transform-origin:100px 100px;transition:transform 1.2s cubic-bezier(.2,.8,.2,1)}
.vgd-ringGoal .vg-tk{fill:#ffffff26;transition:fill .5s}.vgd-ringGoal .vg-tk.on{fill:var(--r1)}
.vgd-ringGoal .vg-in{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none}
.vgd-ringGoal .vg-in .vg-ic{font-size:calc(var(--vfs)*1.6)}.vgd-ringGoal .vg-in .vg-pc{font:900 calc(var(--vfs)*1.3)/1 "Orbitron",monospace;color:#fff;text-shadow:0 0 10px var(--r1)}
.vgd-ringGoal.vst-2{--r1:#22d3ee}.vgd-ringGoal.vst-3{--r1:#a78bfa;--r2:#f472b6}.vgd-ringGoal.vst-4,.vgd-ringGoal.done{--r1:#f5c542;--r2:#fde68a}
.lb-lite.vgw *{animation:none!important}
@media (prefers-reduced-motion:reduce){.vgw *{animation:none!important;transition:none!important}}
`;
