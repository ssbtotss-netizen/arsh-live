// ====== عنصر عداد المتابعين (شفاف 100% خارج البطاقة) ======
import { View } from "./view.js";
import { esc, avatar } from "./defs.js";
import { accountView } from "./socials.js";
import { FC_PLATFORMS, fcData, fcFormat, fcGoal } from "./followers.js";

export const FC_CATS={clear:"شفافة",card:"بخلفيات فاخرة",creative:"إبداعية",mini:"صغيرة"};
export const FC_PLAN={clear:10,card:10,creative:10,mini:5};
export const FC_DESIGNS=[
 {id:"minimalWhite",n:1,name:"Minimal White",cat:"clear",lay:"stack",desc:"رقم أبيض كبير بدون خلفية"},
 {id:"minimalGold",n:2,name:"Minimal Gold",cat:"clear",lay:"stack",desc:"رقم ذهبي مع لمعة تتحرك عبره"},
 {id:"floatingNumber",n:3,name:"Floating Number",cat:"clear",lay:"stack",desc:"رقم طافٍ مع ظل ناعم تحته"},
 {id:"neonOutline",n:4,name:"Neon Outline",cat:"clear",lay:"stack",desc:"رقم مفرّغ بإضاءة نيون"},
 {id:"glassNumber",n:5,name:"Glass Number",cat:"clear",lay:"stack",desc:"أرقام زجاجية شفافة بانعكاس"},
 {id:"silverChrome",n:6,name:"Silver Chrome",cat:"clear",lay:"stack",desc:"أرقام فضية كرومية"},
 {id:"royalCrown",n:7,name:"Royal Crown",cat:"clear",lay:"stack",deco:"crown",desc:"رقم ذهبي يعلوه تاج صغير"},
 {id:"diamondCounter",n:8,name:"Diamond Counter",cat:"clear",lay:"row",deco:"diamond",desc:"ألماسة متلألئة بجانب الرقم"},
 {id:"floatingTikTok",n:9,name:"Floating TikTok",cat:"clear",lay:"row",deco:"logo",desc:"شعار المنصة كبير مع رقم طافٍ"},
 {id:"b6o6Sig",n:10,name:"B6O6 Signature",cat:"clear",lay:"stack",deco:"b6",desc:"هوية المنصة: كروم أزرق وفضي"},
];
export const FC_XCSS=[];
/** 20 طريقة لعرض هدف المتابعين: أشرطة، حلقات، وأشكال تتعبّى (التعبئة = النسبة الحقيقية من نقطة البداية للهدف) */
export const FC_GOAL_STYLES=[["bar","شريط نيون أفقي","bar"],["goldBar","شريط ذهبي","bar"],["glassBar","شريط زجاجي","bar"],["bottomBar","شريط أسفل البطاقة","bar"],["ring","دائرة تقدم","ring"],["diamondRing","حلقة ألماس","ring"],
 ["heart","قلب يتعبّى","shape"],["cup","كأس ذهبي يتعبّى","shape"],["star","نجمة تتوهج","shape"],["crown","تاج تضيء أجزاؤه","shape"],["gem","ألماسة تتكوّن","shape"],["palm","نخلة ذهبية تتوهج","shape"],["battery","بطارية طاقة","shape"],["capsule","كبسولة زجاجية","shape"],["chest","صندوق كنز يمتلئ","shape"],["wings","أجنحة مضيئة","shape"],
 ["xpBar","شريط ألعاب XP","bar"],["orb","كرة كريستالية","shape"],["vBar","شريط عمودي صغير","shape"],["b6o6","تصميم B6O6 الحصري","bar"],["none","بدون شكل تعبئة","none"]];
const FC_SHAPES={heart:"M50 88C20 66 6 48 6 30C6 16 17 6 30 6C39 6 46 11 50 18C54 11 61 6 70 6C83 6 94 16 94 30C94 48 80 66 50 88Z",
 cup:"M22 8H78V30C78 46 66 56 56 58V70H70V88H30V70H44V58C34 56 22 46 22 30ZM22 14H8V24C8 34 14 40 22 41ZM78 14H92V24C92 34 86 40 78 41Z",
 star:"M50 4L62 36H96L69 56L79 90L50 70L21 90L31 56L4 36H38Z",crown:"M8 80L14 24L34 46L50 12L66 46L86 24L92 80Z",gem:"M26 10H74L94 36L50 92L6 36Z",
 palm:"M47 92L49 46C40 30 22 26 8 32C22 18 40 20 49 36C46 20 34 10 22 8C40 4 52 16 52 34C56 18 68 10 84 12C70 16 60 26 56 38C66 28 82 28 94 36C78 34 62 38 54 48L56 92Z",
 battery:"M10 26H84V36H92V64H84V74H10Z",capsule:"M30 6H70A24 24 0 0 1 70 94H30A24 24 0 0 1 30 6Z",chest:"M10 40C10 20 26 12 50 12C74 12 90 20 90 40V88H10Z",
 wings:"M50 60C42 40 24 26 4 22C14 34 16 46 26 56C18 58 12 62 8 70C24 72 40 70 50 60C60 70 76 72 92 70C88 62 82 58 74 56C84 46 86 34 96 22C76 26 58 40 50 60Z",
 orb:"M50 6A40 40 0 1 1 49.9 6ZM28 90H72L66 80H34Z",vBar:"M36 4H64V96H36Z"};
export const FC_GOAL_CSS=`
.fcw .fc-bar.gs-goldBar i{background:linear-gradient(90deg,#a16207,#fde68a,#d4a017)}.fcw .fc-bar.gs-goldBar{box-shadow:0 0 0 1px #d4a017}
.fcw .fc-bar.gs-glassBar{background:#ffffff1f;backdrop-filter:blur(6px);box-shadow:inset 0 0 0 1px #ffffff55;height:calc(var(--nfs)*.18)}.fcw .fc-bar.gs-glassBar i{background:linear-gradient(180deg,#ffffffcc,#ffffff55)}
.fcw .fc-goal.gb-bottomBar{position:absolute;left:0;right:0;bottom:0;width:auto}.fcw .fc-bar.gs-bottomBar{border-radius:0;height:calc(var(--nfs)*.09)}
.fcw .fc-bar.gs-bar i{background:linear-gradient(90deg,var(--acc,#2f7bff),#a5f3fc);box-shadow:0 0 10px var(--acc,#2f7bff)}
.fcw .fc-bar.gs-xpBar{border-radius:2px;height:calc(var(--nfs)*.16);background:#111;box-shadow:inset 0 0 0 2px #555}.fcw .fc-bar.gs-xpBar i{border-radius:0;background:repeating-linear-gradient(90deg,#22c55e 0 10px,#16a34a 10px 12px)}
.fcw .fc-bar.gs-b6o6{height:calc(var(--nfs)*.14);background:#0b1220;box-shadow:inset 0 0 0 1px #2f7bff}.fcw .fc-bar.gs-b6o6 i{background:linear-gradient(90deg,#2f7bff,#c0c7d4,#2f7bff);background-size:200% 100%;animation:fc-b6bar calc(3s/var(--as,1)) linear infinite}@keyframes fc-b6bar{to{background-position:-200% 0}}
.fcw .fc-ring.gs-diamondRing .prg{stroke:#a5f3fc;stroke-dasharray:0 100}.fcw .fc-ring.gs-diamondRing .trk{stroke:#67e8f933;stroke-dasharray:2 3}
.fcw .fc-goal.gsh{flex-direction:row;justify-content:center;width:auto;gap:.5em}.fcw .fc-shape{width:calc(var(--nfs)*.75);height:calc(var(--nfs)*.75);flex:none;overflow:visible}
.fcw .fc-shape .sb{fill:#ffffff1f;stroke:#ffffff88;stroke-width:3}.fcw .fc-shape .gf{fill:var(--sf,var(--acc,#2f7bff));transform-box:view-box;transform-origin:50% 100%;transform:scaleY(0);transition:transform 1s cubic-bezier(.2,.8,.2,1)}
.fcw .fc-shape.gs-heart{--sf:#ef4444}.fcw .fc-shape.gs-cup,.fcw .fc-shape.gs-crown,.fcw .fc-shape.gs-palm,.fcw .fc-shape.gs-chest{--sf:#f6c94a}.fcw .fc-shape.gs-star{--sf:#fde047}.fcw .fc-shape.gs-gem,.fcw .fc-shape.gs-orb{--sf:#67e8f9}.fcw .fc-shape.gs-battery{--sf:#22c55e}.fcw .fc-shape.gs-capsule{--sf:#a78bfa}.fcw .fc-shape.gs-wings{--sf:#fde68a}.fcw .fc-shape.gs-vBar{--sf:var(--acc,#2f7bff)}
.fcw .fc-shape.gs-vBar{width:calc(var(--nfs)*.35);height:calc(var(--nfs)*1.1)}
.fcw.fc-goaldone .fc-shape .gf,.fcw.fc-goaldone .fc-bar i{animation:fc-gdone 1s ease-in-out 3}@keyframes fc-gdone{50%{filter:brightness(1.8)}}.fcw.fc-goaldone .fc-in{animation:fc-gdone 1s ease-in-out 3}
`;
export const fcShapeSVG=(style,uid)=>{ const d=FC_SHAPES[style]; return `<svg class="fc-shape gs-${style}" viewBox="0 0 100 100"><defs><clipPath id="fcs-${uid}"><path d="${d}"/></clipPath></defs><path class="sb" d="${d}"/><g clip-path="url(#fcs-${uid})"><rect class="gf" x="0" y="0" width="100" height="100"/></g></svg>` };
export const fcDesignOf=id=>FC_DESIGNS.find(d=>d.id===id)||FC_DESIGNS[0];
const FC_CROWN='<svg viewBox="0 0 64 44"><defs><linearGradient id="fcg" x1="0" x2="1"><stop offset="0" stop-color="#a16207"/><stop offset=".5" stop-color="#fde68a"/><stop offset="1" stop-color="#a16207"/></linearGradient></defs><path fill="url(#fcg)" d="M3 38 7 9l14 15L32 2l11 22L57 9l4 29z"/><rect x="5" y="38" width="54" height="6" rx="2" fill="url(#fcg)"/></svg>';
const FC_DIAMOND='<svg viewBox="0 0 40 36"><path d="M8 2h24l8 10-20 22L0 12z" fill="#67e8f9"/><path d="M8 2l6 10h12l6-10zM0 12h40L20 34z" fill="#a5f3fc" opacity=".7"/><path d="M14 12l6 22 6-22z" fill="#e0f7ff" opacity=".8"/></svg>';
const logoHTML=(P,a)=>a&&a.logo?`<img class="fc-logo" src="${esc(a.logo)}" alt="">`:`<span class="fc-logo" style="--lc:${P.color}${P.dark?";--lt:#000":""}">${P.mono}</span>`;
let fcCss=false;
function ensureFcCSS(){ if(fcCss||typeof document==="undefined") return; fcCss=true; const st=document.createElement("style"); st.id="b6o6-fc"; st.textContent=FC_CSS+FC_XCSS.join("\n")+FC_GOAL_CSS; document.head.appendChild(st) }
const fcReduced=()=>{ try{ return matchMedia("(prefers-reduced-motion: reduce)").matches }catch(e){ return false } };
function roll(el,from,to,f,ms){ if(el._raf) cancelAnimationFrame(el._raf); if(ms<=0||from===to){ el.textContent=f(to); return } const t0=performance.now(); const st=t=>{ const p=Math.min(1,(t-t0)/ms), e=1-Math.pow(1-p,3); el.textContent=f(from+(to-from)*e); if(p<1) el._raf=requestAnimationFrame(st) }; el._raf=requestAnimationFrame(st) }

Object.assign(View.prototype,{
 applyFc(w,W,Hh,pad,gap){ ensureFcCSS(); const e=this.el, d=fcDesignOf(w.design), ed=this.opts.editor;
  e.className=`wd fcw fcd-${d.id} fcl-${d.lay}${w.anim===false||w.animOn===false?" fc-still":""}${w.effects&&this.opts.globalFx!==false?"":" no-fx"}${ed?(" "+(w.locked?"locked":"")+(w.visible?"":" hid")+(this.opts.sel===w.id?" sel":"")):""}`;
  const rows=1+(w.showHead!==false?(d.lay==="pcard"?1.3:.45):0)+(w.showNew!==false?.32:0)+(w.goalOn?.42:0)+(w.showLast?.3:0);
  const nfs=Math.max(12,Math.min(Hh/(rows*1.35),W/(d.lay==="row"?7.5:6.2))*(w.numScale||1));
  const S=e.style; S.setProperty("--nfs",nfs+"px"); S.setProperty("--as",String(w.animSpeed||1));
  if(w.color) S.setProperty("--nc",w.color); else S.removeProperty("--nc"); if(w.acc) S.setProperty("--acc",w.acc); else S.removeProperty("--acc");
  const sig=["fc",d.id,w.showHead,w.showAvatar,w.showName,w.showLogo,w.showNew,w.showUnit,w.goalOn,w.goalStyle,w.showLast,w.platform,w.accountId,w.handle,w.avatar].join("|");
  if(sig!==this.sig){ this.sig=sig; this.buildFc(d) }
  if(this.opts.data) this.refreshFc(this.opts.data(),true);
 },
 buildFc(d){ const w=this.w, ed=this.opts.editor?'<div class="rh"></div><div class="lockb">🔒</div>':"", P=FC_PLATFORMS[w.platform]||FC_PLATFORMS.tiktok;
  const deco=d.deco==="crown"?`<i class="fc-crown">${FC_CROWN}</i>`:d.deco==="diamond"?`<i class="fc-dia">${FC_DIAMOND}<b></b></i>`:d.deco==="logo"?`<i class="fc-biglogo" style="--lc:${P.color}">${P.mono}</i>`:"";
  const ring=w.goalOn&&(w.goalStyle==="ring"||w.goalStyle==="diamondRing")?`<svg class="fc-ring gs-${w.goalStyle}" viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" class="trk"/><circle cx="50" cy="50" r="44" class="prg" pathLength="100"/></svg>`:"";
  this.el.innerHTML=`<div class="fc-in"><i class="fc-swp"></i>
   ${w.showHead!==false?`<div class="fc-head">${w.showAvatar!==false?'<img class="fc-av" alt="">':""}${w.showName!==false?'<span class="fc-name"></span>':""}${w.showLogo!==false?'<span class="fc-lg"></span>':""}</div>`:""}
   <div class="fc-main">${d.deco==="logo"||d.deco==="diamond"?deco:""}<div class="fc-numwrap">${d.deco==="crown"?deco:""}<b class="fc-num">0</b>${w.showUnit!==false?`<span class="fc-unit">${P.units}</span>`:""}${d.deco==="b6"?'<i class="fc-b6"></i>':""}</div></div>
   ${w.showNew!==false?'<div class="fc-new"></div>':""}
   ${w.goalOn?(()=>{ const gs=FC_GOAL_STYLES.find(x=>x[0]===(w.goalStyle||"bar"))||FC_GOAL_STYLES[0], k=gs[2];
    return `<div class="fc-goal ${k==="ring"?"gr":k==="shape"?"gsh":""} gb-${gs[0]}">${k==="ring"?ring:k==="shape"?fcShapeSVG(gs[0],String(w.id).replace(/\W/g,"")):k==="bar"?`<div class="fc-bar gs-${gs[0]}"><i></i></div>`:""}<span class="fc-gt"></span></div>` })():""}
   ${w.showLast?'<div class="fc-last"></div>':""}</div><div class="fc-fx"></div>`+ed;
  const q=s=>this.el.querySelector(s);
  this.fc={gf:q(".fc-shape .gf"),num:q(".fc-num"),nw:q(".fc-new"),gt:q(".fc-gt"),bar:q(".fc-bar i"),prg:q(".fc-ring .prg"),last:q(".fc-last"),fx:q(".fc-fx"),av:q(".fc-av"),name:q(".fc-name"),lg:q(".fc-lg"),prev:null,prevTarget:null};
 },
 refreshFc(src,silent){ const F=this.fc, w=this.w; if(!F) return;
  const D=fcData(src.C&&src.C.followers,w.platform), P=FC_PLATFORMS[w.platform]||FC_PLATFORMS.tiktok;
  const acc=(src.SO&&src.SO.accounts||[]).find(a=>a.id===w.accountId)||(src.SO&&src.SO.accounts||[]).find(a=>a.platform===w.platform);
  const av=acc?accountView(acc):null, handle=w.handle||(av&&av.user)||"", pic=w.avatar||(av&&av.avatar)||"";
  if(F.name&&F.name.textContent!==handle) F.name.textContent=handle||P.name;
  if(F.av){ const s=pic||avatar(handle||P.name); if(F.av.getAttribute("src")!==s) F.av.src=s }
  if(F.lg&&!F.lg.dataset.p){ F.lg.dataset.p=w.platform; F.lg.innerHTML=logoHTML(P,acc) }
  const value=D?D.value:0, fx=!this.el.classList.contains("no-fx")&&!this.el.classList.contains("fc-still")&&!fcReduced();
  const fmt=v=>fcFormat(v,w.numFmt||"full"), prev=F.prev==null?value:F.prev;
  roll(F.num,silent?value:prev,value,fmt,fx&&!silent?Math.min(1400,500+Math.abs(value-prev)*40):0);
  if(F.nw){ const n=D?D.session:0; F.nw.textContent=n>0?`\u2066+${n.toLocaleString("en-US")}\u2069 ${P.unit} جديد`:""; F.nw.style.display=n>0?"":"none" }
  if(F.last){ const L=D&&D.last; F.last.textContent=L?`آخر متابع: ${L.name}`:""; F.last.style.display=L?"":"none" }
  const g=fcGoal(w,value);
  if(g){ if(F.bar) F.bar.style.width=g.pct+"%"; if(F.gf) F.gf.style.transform=`scaleY(${(g.pct/100).toFixed(4)})`; if(F.prg) F.prg.style.strokeDasharray=`${g.pct} 100`; if(F.gt){ const pc=Math.floor(g.pct*10)/10; F.gt.textContent=g.done&&!w.goalAuto?"حققنا الهدف! 🎉":`🎯 هدفنا \u2066${fcFormat(g.target,w.numFmt||"full")}\u2069${w.goalPct!==false?` · \u2066${pc}%\u2069`:""}${w.goalRemain&&g.remaining?` · باقي \u2066${g.remaining.toLocaleString("en-US")}\u2069 ${P.unit} ❤️`:""}${g.level?` · المرحلة ${g.level+1}`:""}` }
   if(!silent&&F.prevTarget!=null&&(g.target>F.prevTarget||(g.done&&!F.prevDone))){ if(fx) this.fcStar(); this.el.classList.remove("fc-goaldone"); void this.el.offsetWidth; this.el.classList.add("fc-goaldone"); setTimeout(()=>this.el.classList.remove("fc-goaldone"),3200) }
   F.prevTarget=g.target; F.prevDone=g.done }
  if(!silent&&fx&&F.prev!=null&&value!==prev){ const dlt=value-prev, pop=document.createElement("div"); pop.className="fc-pop "+(dlt>0?"up":"down"); pop.textContent=(dlt>0?"+":"")+dlt.toLocaleString("en-US"); F.fx.appendChild(pop);
   pop.animate([{opacity:0,transform:"translateY(30%) scale(.7)"},{opacity:1,transform:"translateY(-40%) scale(1)",offset:.3},{opacity:0,transform:"translateY(-140%)"}],{duration:1600/(w.animSpeed||1),easing:"ease-out"}).onfinish=()=>pop.remove();
   this.el.classList.remove("fc-bump","fc-dip"); void this.el.offsetWidth; this.el.classList.add(dlt>0?"fc-bump":"fc-dip") }
  F.prev=value;
 },
 fcStar(){ const L=this.fc.fx; const s=document.createElement("div"); s.className="fc-star"; s.textContent="حققنا الهدف! 🎉"; L.appendChild(s);
  s.animate([{opacity:0,transform:"translate(-50%,-50%) scale(.4)"},{opacity:1,transform:"translate(-50%,-50%) scale(1.1)",offset:.3},{opacity:0,transform:"translate(-50%,-90%) scale(1)"}],{duration:2200}).onfinish=()=>s.remove();
  for(let i=0;i<12;i++){ const c=document.createElement("i"); c.className="fc-spk"; L.appendChild(c); const a=Math.PI*2*i/12, r=50+Math.random()*50; c.animate([{transform:"translate(-50%,-50%) scale(1)",opacity:1},{transform:`translate(calc(-50% + ${Math.cos(a)*r}px),calc(-50% + ${Math.sin(a)*r}px)) scale(.2)`,opacity:0}],{duration:1100}).onfinish=()=>c.remove() } },
});

const FC_CSS=`
.fcw{background:none!important;direction:rtl;color:#fff;font-family:"Readex Pro","Changa",sans-serif}
.fcw .fc-in{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:calc(var(--nfs)*.12);overflow:visible}
.fcw .fc-head{display:flex;align-items:center;gap:calc(var(--nfs)*.18);font-size:calc(var(--nfs)*.3);font-weight:700;text-shadow:0 2px 6px #000c}
.fcw .fc-av{width:calc(var(--nfs)*.5);height:calc(var(--nfs)*.5);border-radius:50%;object-fit:cover;box-shadow:0 0 0 2px #fff6}
.fcw .fc-name{direction:ltr;unicode-bidi:isolate}
.fcw .fc-logo{display:inline-grid;place-items:center;width:calc(var(--nfs)*.42);height:calc(var(--nfs)*.42);border-radius:30%;background:var(--lc,#fe2c55);color:var(--lt,#fff);font:900 calc(var(--nfs)*.17)/1 "Orbitron",sans-serif;object-fit:cover}
.fcw .fc-main{display:flex;align-items:center;gap:calc(var(--nfs)*.25)}
.fcw .fc-numwrap{position:relative;display:flex;align-items:baseline;gap:calc(var(--nfs)*.15)}
.fcw .fc-num{font:900 var(--nfs)/1 "Changa","Readex Pro",sans-serif;direction:ltr;letter-spacing:.01em;color:var(--nc,#fff);text-shadow:0 3px 10px #000b;transition:transform .3s}
.fcw .fc-unit{font-size:calc(var(--nfs)*.28);font-weight:700;opacity:.9;text-shadow:0 2px 6px #000c}
.fcw .fc-new{font-size:calc(var(--nfs)*.24);font-weight:800;color:#86efac;text-shadow:0 2px 6px #000c}
.fcw .fc-goal{display:flex;flex-direction:column;align-items:center;gap:.2em;font-size:calc(var(--nfs)*.2);width:min(100%,calc(var(--nfs)*6))}
.fcw .fc-bar{width:100%;height:calc(var(--nfs)*.12);border-radius:99px;background:#ffffff26;overflow:hidden;box-shadow:0 2px 8px #0006}
.fcw .fc-bar i{display:block;height:100%;width:0;border-radius:inherit;background:linear-gradient(90deg,var(--acc,#2f7bff),#a5f3fc);transition:width 1s cubic-bezier(.2,.8,.2,1)}
.fcw .fc-gt{text-shadow:0 2px 6px #000c;opacity:.92}
.fcw .fc-last{font-size:calc(var(--nfs)*.2);opacity:.85;text-shadow:0 2px 6px #000c}
.fcw .fc-goal.gr{flex-direction:row;justify-content:center;width:auto}.fcw .fc-ring{width:calc(var(--nfs)*.55);height:calc(var(--nfs)*.55);transform:rotate(-90deg);flex:none}
.fcw .fc-ring circle{fill:none;stroke-width:12}.fcw .fc-ring .trk{stroke:#ffffff22}.fcw .fc-ring .prg{stroke:var(--acc,#2f7bff);stroke-linecap:round;stroke-dasharray:0 100;transition:stroke-dasharray 1s;filter:drop-shadow(0 0 4px var(--acc,#2f7bff))}
.fcw .fc-fx{position:absolute;inset:0;pointer-events:none;overflow:visible}
.fcw .fc-pop{position:absolute;left:8%;top:28%;font:900 calc(var(--nfs)*.42)/1 "Changa",sans-serif;direction:ltr;text-shadow:0 2px 8px #000}
.fcw .fc-pop.up{color:#4ade80}.fcw .fc-pop.down{color:#f87171}
.fcw .fc-star{position:absolute;left:50%;top:40%;white-space:nowrap;font:900 calc(var(--nfs)*.45)/1 "Changa",sans-serif;color:#fde68a;text-shadow:0 0 14px #f5c542,0 3px 8px #000}
.fcw .fc-spk{position:absolute;left:50%;top:45%;width:7px;height:7px;border-radius:50%;background:#fde68a;box-shadow:0 0 6px #f5c542}
.fcw.fc-bump .fc-num{animation:fc-bump calc(.6s/var(--as,1)) ease}@keyframes fc-bump{30%{transform:scale(1.08)}}
.fcw.fc-dip .fc-num{animation:fc-dip calc(.6s/var(--as,1)) ease}@keyframes fc-dip{30%{transform:translateY(6%) scale(.97)}}
.fcw .fc-swp{position:absolute;top:0;bottom:0;width:18%;right:-20%;background:linear-gradient(270deg,transparent,#ffffff55,transparent);transform:skewX(-18deg);animation:fc-swp calc(6s/var(--as,1)) ease-in-out infinite;pointer-events:none;mix-blend-mode:overlay;display:none}
@keyframes fc-swp{0%,60%{transform:translateX(0) skewX(-18deg)}100%{transform:translateX(-700%) skewX(-18deg)}}
.fc-still *,.no-fx .fc-swp{animation:none!important}
@media (prefers-reduced-motion:reduce){.fcw *{animation:none!important;transition:none!important}}
/* 1 */.fcd-minimalWhite .fc-num{color:var(--nc,#fff);text-shadow:0 4px 14px #000c,0 0 2px #000}
/* 2 */.fcd-minimalGold .fc-num{background:linear-gradient(100deg,#a16207 0%,#fde68a 25%,#d4a537 40%,#fff7d6 50%,#d4a537 60%,#fde68a 75%,#a16207 100%);background-size:250% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 3px 6px #0009);animation:fc-gold calc(4s/var(--as,1)) linear infinite;text-shadow:none}
@keyframes fc-gold{from{background-position:120% 0}to{background-position:-120% 0}}
/* 3 */.fcd-floatingNumber .fc-numwrap{animation:fc-float calc(3.6s/var(--as,1)) ease-in-out infinite}.fcd-floatingNumber .fc-numwrap::after{content:"";position:absolute;left:10%;right:10%;bottom:calc(var(--nfs)*-.3);height:calc(var(--nfs)*.14);border-radius:50%;background:#0009;filter:blur(6px);animation:fc-shadow calc(3.6s/var(--as,1)) ease-in-out infinite}
@keyframes fc-float{50%{transform:translateY(-10%)}}@keyframes fc-shadow{50%{transform:scale(.7);opacity:.5}}
/* 4 */.fcd-neonOutline .fc-num{color:transparent;-webkit-text-stroke:calc(var(--nfs)*.03) var(--nc,#f472b6);text-shadow:0 0 8px var(--nc,#f472b6),0 0 22px var(--nc,#f472b6);animation:fc-flick 5s steps(1) infinite}
.fcd-neonOutline .fc-unit{color:var(--nc,#f472b6);text-shadow:0 0 8px var(--nc,#f472b6)}@keyframes fc-flick{0%,100%{opacity:1}91%{opacity:1}92%{opacity:.55}93%{opacity:1}95%{opacity:.7}}
/* 5 */.fcd-glassNumber .fc-num{background:linear-gradient(180deg,#ffffffee 0%,#ffffff70 48%,#ffffff30 52%,#ffffffaa 100%);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-stroke:1px #ffffffcc;filter:drop-shadow(0 4px 10px #0008) drop-shadow(0 0 1px #fff);text-shadow:none}
/* 6 */.fcd-silverChrome .fc-num{background:linear-gradient(180deg,#ffffff 0%,#cbd5e1 35%,#475569 50%,#e2e8f0 65%,#94a3b8 100%);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-stroke:1px #1e293b;filter:drop-shadow(0 4px 6px #000a);text-shadow:none}
/* 7 */.fcd-royalCrown .fc-num{background:linear-gradient(180deg,#fff7d6,#f5c542 55%,#a16207);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 3px 6px #000a);text-shadow:none}
.fcd-royalCrown .fc-numwrap{margin-top:calc(var(--nfs)*.42)}.fcw .fc-crown{position:absolute;left:50%;top:calc(var(--nfs)*-.62);width:calc(var(--nfs)*.7);transform:translateX(-50%);animation:fc-crown calc(3s/var(--as,1)) ease-in-out infinite;filter:drop-shadow(0 2px 4px #000a)}
.fcw .fc-crown svg{width:100%;display:block}@keyframes fc-crown{50%{transform:translate(-50%,-8%) rotate(3deg)}}
/* 8 */.fcd-diamondCounter .fc-num{color:#ecfeff;text-shadow:0 0 12px #67e8f9,0 3px 8px #000}
.fcw .fc-dia{position:relative;width:calc(var(--nfs)*.9);filter:drop-shadow(0 0 10px #67e8f9);animation:fc-dia calc(3s/var(--as,1)) ease-in-out infinite}.fcw .fc-dia svg{width:100%;display:block}
.fcw .fc-dia b{position:absolute;top:-10%;right:-6%;width:30%;aspect-ratio:1;background:#fff;clip-path:polygon(50% 0,60% 40%,100% 50%,60% 60%,50% 100%,40% 60%,0 50%,40% 40%);animation:fc-tw 1.8s ease-in-out infinite}
@keyframes fc-dia{50%{transform:translateY(-6%) rotate(-6deg)}}@keyframes fc-tw{0%,100%{transform:scale(.3);opacity:.3}50%{transform:scale(1);opacity:1}}
/* 9 */.fcd-floatingTikTok .fc-biglogo{display:grid;place-items:center;width:calc(var(--nfs)*1.15);height:calc(var(--nfs)*1.15);border-radius:28%;background:#000;color:#fff;font:900 calc(var(--nfs)*.42)/1 "Orbitron",sans-serif;box-shadow:-3px -2px 0 #25f4ee,3px 2px 0 var(--lc,#fe2c55),0 8px 20px #0009;animation:fc-float calc(3.4s/var(--as,1)) ease-in-out infinite}
.fcd-floatingTikTok .fc-num{text-shadow:-2px -1px 0 #25f4ee,2px 1px 0 #fe2c55,0 4px 12px #000b;animation:fc-float calc(3.4s/var(--as,1)) ease-in-out infinite;animation-delay:-.6s}
/* 10 */.fcd-b6o6Sig .fc-num{background:linear-gradient(180deg,#ffffff,#c0c7d4 55%,#7c8aa5);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 10px #2f7bff99) drop-shadow(0 3px 6px #000a);text-shadow:none}
.fcw .fc-b6{position:absolute;left:0;right:0;bottom:calc(var(--nfs)*-.18);height:calc(var(--nfs)*.07);border-radius:99px;background:linear-gradient(90deg,transparent,#2f7bff,#c0c7d4,#2f7bff,transparent);box-shadow:0 0 10px #2f7bff;animation:fc-b6 calc(3s/var(--as,1)) ease-in-out infinite}
@keyframes fc-b6{50%{transform:scaleX(.7);opacity:.7}}.fcd-b6o6Sig{--acc:#2f7bff}
`;
