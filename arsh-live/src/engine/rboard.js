// ====== لوحة قوانين السبثون: تُقرأ تلقائياً من قواعد السبثون (لا كتابة يدوية) ======
// خمسة أوضاع: قائمة كاملة، قانون واحد بالتناوب، شريط متحرك، بطاقات منفصلة، مختصرة.
import { View } from "./view.js";
import { esc, clamp } from "./defs.js";
import { rulesForBoard } from "./clock.js";

export const RB_MODES=[["list","القائمة الكاملة"],["rotate","قانون واحد بالتناوب"],["ticker","شريط متحرك"],["cards","بطاقات منفصلة"],["compact","مختصرة"]];
export const RB_ANIMS=[["slideUp","انزلاق للأعلى"],["slideSide","انزلاق جانبي"],["fade","تلاشي"],["zoom","تكبير"],["flip","قلب ثلاثي الأبعاد"],["blur","ضبابية ناعمة"]];
export const RB_ORDERS=[["custom","حسب ترتيب الإعدادات"],["addFirst","الزيادة أولاً"],["subFirst","النقصان أولاً"],["big","الأكبر تأثيراً أولاً"]];
export const RB_CATS={royal:"ملكية",neon:"نيون",glass:"زجاجية",motion:"متحركة",mini:"صغيرة"};
export const RB_DESIGNS=[
 {id:"royalRules",n:1,name:"Royal Rules",cat:"royal",desc:"مخمل بنفسجي وإطار ذهبي مزدوج وتاج"},
 {id:"goldenRules",n:2,name:"Golden Rules",cat:"royal",desc:"شريط عنوان ذهبي وصفوف بحواف ذهبية"},
 {id:"diamondRules",n:3,name:"Diamond Rules",cat:"royal",desc:"لوحة ماسية الحواف ونقاط ألماسية تلمع"},
 {id:"silverRules",n:4,name:"Silver Rules",cat:"royal",desc:"لوحة فضية كرومية"},
 {id:"crownRules",n:5,name:"Crown Rules",cat:"royal",desc:"تاج كبير عائم وصفوف في المنتصف"},
 {id:"luxuryBlackRules",n:6,name:"Luxury Black",cat:"royal",desc:"أسود فاخر بخطوط ذهبية رفيعة"},
 {id:"platinumRules",n:7,name:"Platinum Rules",cat:"royal",desc:"زجاج بلاتيني بحافة جانبية"},
 {id:"crystalRules",n:8,name:"Crystal Rules",cat:"royal",desc:"كل قانون بطاقة كريستالية مستقلة"},
 {id:"neonBlueRules",n:9,name:"Neon Blue Rules",cat:"neon",desc:"إطار نيون أزرق يرمش وخطوط مضيئة"},
 {id:"b6o6Rules",n:40,name:"B6O6 Signature Rules",cat:"mini",desc:"هوية المنصة: أسود وأزرق وفضي"},
];
export const rbDesignOf=id=>RB_DESIGNS.find(d=>d.id===id)||RB_DESIGNS[0];
const CROWN='<svg viewBox="0 0 64 44"><path fill="currentColor" d="M3 38 7 9l14 15L32 2l11 22L57 9l4 29z"/><rect x="5" y="38" width="54" height="6" rx="2" fill="currentColor"/></svg>';

/** القوانين المعروضة حسب إعدادات العنصر */
export function rbItems(w,s){
 let L=rulesForBoard(s);
 if(w.hideKinds&&w.hideKinds.length){ const hid=new Set(w.hideKinds); L=L.filter(x=>!hid.has(x.id.split("_")[0])&&!hid.has(x.id)) }
 if(w.order==="addFirst") L=[...L].sort((a,b)=>(b.ms>0)-(a.ms>0));
 else if(w.order==="subFirst") L=[...L].sort((a,b)=>(a.ms>0)-(b.ms>0));
 else if(w.order==="big") L=[...L].sort((a,b)=>Math.abs(b.ms)-Math.abs(a.ms));
 if(w.maxRules>0) L=L.slice(0,w.maxRules);
 return L;
}
const icoHTML=(it,w)=>it.img&&w.showImg!==false?`<img class="rb-img" src="${esc(it.img)}" alt="">`:`<span class="rb-emo">${esc(it.icon)}</span>`;
function rowHTML(it,w){
 return `<div class="rb-row ${it.ms<0?"neg":"pos"}" data-rid="${esc(it.id)}"><span class="rb-ic">${icoHTML(it,w)}</span>${w.showWhat!==false?`<span class="rb-what">${esc(it.what)}</span>`:""}${w.showTime!==false?`<span class="rb-val">${esc(w.mode==="compact"?it.short:it.text)}</span>`:""}<i class="rb-swp"></i></div>`;
}

let rbCss=false;
function ensureRbCSS(){ if(rbCss||typeof document==="undefined") return; rbCss=true; const st=document.createElement("style"); st.id="b6o6-rb-designs"; st.textContent=rbDesignCSS(); document.head.appendChild(st) }
const rbReduced=()=>{ try{ return matchMedia("(prefers-reduced-motion: reduce)").matches }catch(e){ return false } };

Object.assign(View.prototype,{
 applyRules(w,W,Hh,pad,gap){
  ensureRbCSS(); const e=this.el, d=rbDesignOf(w.design), ed=this.opts.editor;
  const lite=!!(w.lowPerf||this.opts.lowPerf);
  e.className=`wd rbw rbd-${d.id} rbm-${w.mode||"list"}${w.tickerDir==="v"?" rbv":""} rba-${w.anim||"slideUp"}${w.animOn===false?" rb-still":""}${lite?" rb-lite":""} f-${w.font||"default"}${w.effects&&this.opts.globalFx!==false?"":" no-fx"}${ed?(" "+(w.locked?"locked":"")+(w.visible?"":" hid")+(this.opts.sel===w.id?" sel":"")):""}`;
  const S=e.style; S.setProperty("--pos",w.posColor||"#22c55e"); S.setProperty("--neg",w.negColor||"#ef4444"); S.setProperty("--bo",String(w.rowOpacity??1)); S.setProperty("--as",String(w.animSpeed||1));
  if(w.acc) S.setProperty("--acc",w.acc); else S.removeProperty("--acc"); if(w.tx) S.setProperty("--tx2",w.tx);
  this.rbG={W,H:Hh,pad,gap}; this.rbSig=null; this.rbIdx=-1; this.sig="rb";
  if(this.opts.data) this.refreshRules(this.opts.data(),true);
 },
 rbLayout(n){
  const w=this.w, {W,H,pad,gap}=this.rbG, S=this.el.style, fsx=w.fontScale||1, ics=w.iconScale||1, mode=w.mode||"list";
  const tth=w.showTitle&&mode!=="ticker"&&mode!=="compact"?clamp(Math.min(H*.16,W*.08),14,120)*Math.sqrt(fsx):0;
  const ih=H-pad*2-(tth?tth+gap*.6:0), iw=W-pad*2; let fs, rh;
  if(mode==="list"){ rh=(ih-gap*.5*(n-1))/Math.max(1,n); fs=Math.min(rh*.42,iw*.055) }
  else if(mode==="rotate"){ rh=ih; fs=Math.min(ih*.34,iw*.06) }
  else if(mode==="ticker"){ rh=H-pad*2; fs=w.tickerDir==="v"?Math.min(iw*.065,rh*.09,48):Math.min(rh*.5,90) }
  else if(mode==="cards"){ const cols=Math.max(1,Math.min(n,Math.round(Math.sqrt(n*iw/Math.max(1,ih))))), rows=Math.ceil(n/cols); S.setProperty("--cols",cols); rh=(ih-gap*(rows-1))/rows; fs=Math.min(rh*.17,(iw/cols)*.1) }
  else { rh=ih; fs=Math.min(ih*.36,Math.sqrt(iw*ih*.7/(Math.max(1,n)*17))) }
  fs*=fsx; S.setProperty("--tth",tth+"px"); S.setProperty("--fs",Math.max(8,fs)+"px"); S.setProperty("--rh",rh+"px"); S.setProperty("--ics",String(ics)); S.setProperty("--pad",pad+"px"); S.setProperty("--gap",gap+"px");
 },
 refreshRules(src,silent){
  const w=this.w, s=src.C&&src.C.subathon; if(!s||!this.rbG) return;
  const items=rbItems(w,s), mode=w.mode||"list";
  const sig=JSON.stringify([items,mode,w.showTitle,w.title,w.showWhat,w.showTime,w.showImg,w.tickerDir,this.rbG.W,this.rbG.H]);
  if(sig!==this.rbSig){ this.rbSig=sig; this.rbItems=items; this.buildRules(items,silent) }
  if(mode==="rotate"&&items.length){ const per=Math.max(1500,(w.interval||4)*1000), now=Date.now()+(src.skew||0), idx=Math.floor(now/per)%items.length; if(idx!==this.rbIdx) this.rbShow(idx,silent) }
 },
 buildRules(items,silent){
  const w=this.w, d=rbDesignOf(w.design), mode=w.mode||"list", ed=this.opts.editor?'<div class="rh"></div><div class="lockb">🔒</div>':"";
  const n=mode==="rotate"?1:Math.max(1,items.length); this.rbLayout(n);
  const title=w.showTitle&&mode!=="ticker"&&mode!=="compact"?`<div class="rb-t"><span class="rb-crw">${CROWN}</span><span class="tx">${esc(w.title||"")}</span></div>`:"";
  let body;
  if(!items.length) body=`<div class="rb-empty">لا توجد قوانين مفعّلة</div>`;
  else if(mode==="rotate") body=`<div class="rb-stage"></div>`;
  else if(mode==="ticker"){ const inner=(w.showTitle?`<div class="rb-row rb-tt"><span class="rb-what">${esc(w.title||"")}</span></div>`:"")+items.map(it=>rowHTML(it,w)).join(""); body=`<div class="rb-track ${w.tickerDir==="v"?"v":"h"}"><div class="rb-run">${inner}${inner}</div></div>` }
  else body=`<div class="rb-list">${items.map(it=>rowHTML(it,w)).join("")}</div>`;
  this.el.innerHTML=`<div class="rb-panel"><i class="rb-sweep"></i>${title}<div class="rb-body">${body}</div></div>`+ed;
  this.rbIdx=-1;
  if(mode==="ticker"&&items.length) requestAnimationFrame(()=>{ const run=this.el.querySelector(".rb-run"); if(!run) return; const v=w.tickerDir==="v", len=(v?run.scrollHeight:run.scrollWidth)/2, sp=Math.max(10,w.speed||70); run.style.setProperty("--len",len+"px"); run.style.animationDuration=(len/sp)+"s" });
  if(!silent&&!rbReduced()&&mode!=="rotate"&&mode!=="ticker") this.el.querySelectorAll(".rb-list .rb-row").forEach((r,i)=>r.animate([{opacity:0,transform:"translateY(14px)"},{opacity:1,transform:"none"}],{duration:420,delay:i*70,fill:"backwards",easing:"cubic-bezier(.2,.8,.2,1)"}));
 },
 rbShow(idx,silent){
  const st=this.el.querySelector(".rb-stage"); if(!st) return; this.rbIdx=idx; const it=this.rbItems[idx]; if(!it) return;
  const w=this.w, red=rbReduced()||this.el.classList.contains("rb-still"), ms=Math.round(520/(w.animSpeed||1));
  const K={slideUp:[[{opacity:0,transform:"translateY(60%)"},{opacity:1,transform:"none"}],[{opacity:1,transform:"none"},{opacity:0,transform:"translateY(-60%)"}]],
   slideSide:[[{opacity:0,transform:"translateX(-40%)"},{opacity:1,transform:"none"}],[{opacity:1,transform:"none"},{opacity:0,transform:"translateX(40%)"}]],
   fade:[[{opacity:0},{opacity:1}],[{opacity:1},{opacity:0}]],zoom:[[{opacity:0,transform:"scale(.6)"},{opacity:1,transform:"none"}],[{opacity:1,transform:"none"},{opacity:0,transform:"scale(1.3)"}]],
   flip:[[{opacity:0,transform:"perspective(600px) rotateX(-90deg)"},{opacity:1,transform:"none"}],[{opacity:1,transform:"none"},{opacity:0,transform:"perspective(600px) rotateX(90deg)"}]],
   blur:[[{opacity:0,filter:"blur(8px)"},{opacity:1,filter:"blur(0)"}],[{opacity:1,filter:"blur(0)"},{opacity:0,filter:"blur(8px)"}]]}[w.anim||"slideUp"]||[];
  const old=st.firstElementChild; const el=document.createElement("div"); el.innerHTML=rowHTML(it,w); const row=el.firstElementChild; row.classList.add("rb-one"); st.appendChild(row);
  if(old){ if(silent||red) old.remove(); else { const a=old.animate(K[1],{duration:ms,easing:"ease-in",fill:"forwards"}); a.onfinish=()=>old.remove() } }
  if(!silent&&!red) row.animate(K[0],{duration:ms,delay:old?ms*.6:0,easing:"cubic-bezier(.2,.8,.2,1)",fill:"backwards"});
 },
 /** وميض القانون الذي نُفّذ للتو */
 ruleHit(l){ if(!l||!l.ruleId||rbReduced()) return; const id=l.kind==="donation"?(l.ruleId+(l.action==="sub"?"_1":"_0")):l.ruleId;
  this.el.querySelectorAll(`[data-rid="${CSS.escape(id)}"]`).forEach(r=>{ r.classList.remove("hit"); void r.offsetWidth; r.classList.add("hit"); setTimeout(()=>r.classList.remove("hit"),1400) }) },
});

/** CSS: الأساس + التصاميم. كل الحركات transform/opacity */
export function rbDesignCSS(){ return `
.rbw{direction:rtl;color:var(--tx2,#fff);font-family:"Readex Pro","Changa",Tahoma,sans-serif}
.rbw .rb-panel{position:absolute;inset:0;padding:var(--pad);display:flex;flex-direction:column;gap:calc(var(--gap)*.6);overflow:hidden;border-radius:calc(var(--fs)*.9)}
.rbw .rb-t{height:var(--tth);display:flex;align-items:center;justify-content:center;gap:.35em;font:800 calc(var(--tth)*.58)/1 "Changa","Readex Pro",sans-serif;flex:none;position:relative;z-index:2}
.rbw .rb-crw{display:none;width:1.3em;color:#f5c542}.rbw .rb-crw svg{width:100%;display:block}
.rbw .rb-body{flex:1;min-height:0;position:relative;z-index:2}
.rbw .rb-list{height:100%;display:flex;flex-direction:column;gap:calc(var(--gap)*.5)}
.rbw .rb-row{position:relative;display:flex;align-items:center;gap:.5em;flex:1;min-height:0;padding:0 .7em;font-size:var(--fs);font-weight:700;border-radius:calc(var(--fs)*.5);overflow:hidden;white-space:nowrap}
.rbw .rb-row::before{content:"";position:absolute;inset:0;z-index:-1;opacity:var(--bo,1);border-radius:inherit}
.rbw .rb-ic{flex:none;display:grid;place-items:center;width:calc(1.5em*var(--ics,1));height:calc(1.5em*var(--ics,1));font-size:calc(1em*var(--ics,1));animation:rb-ic calc(5s/var(--as,1)) ease-in-out infinite}
.rbw .rb-ic img{width:100%;height:100%;object-fit:contain}
@keyframes rb-ic{0%,80%,100%{transform:none}86%{transform:rotate(-12deg) scale(1.1)}93%{transform:rotate(10deg) scale(1.1)}}
.rbw .rb-what{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis}
.rbw .rb-val{flex:none;unicode-bidi:isolate;font-family:"Changa","Orbitron",sans-serif;font-weight:900;padding:.08em .5em;border-radius:99px;color:#fff}
.rbw .pos .rb-val{background:color-mix(in srgb,var(--pos) 85%,transparent);box-shadow:0 0 .6em color-mix(in srgb,var(--pos) 55%,transparent)}
.rbw .neg .rb-val{background:color-mix(in srgb,var(--neg) 85%,transparent);box-shadow:0 0 .6em color-mix(in srgb,var(--neg) 55%,transparent)}
.rbw .rb-row .rb-swp{position:absolute;top:0;bottom:0;width:30%;right:-35%;background:linear-gradient(270deg,transparent,#ffffff55,transparent);transform:skewX(-18deg);animation:rb-swp calc(4.5s/var(--as,1)) ease-in-out infinite;pointer-events:none}
@keyframes rb-swp{0%,55%{transform:translateX(0) skewX(-18deg)}100%{transform:translateX(-450%) skewX(-18deg)}}
.rbw .rb-row:nth-child(2) .rb-swp{animation-delay:.25s}.rbw .rb-row:nth-child(3) .rb-swp{animation-delay:.5s}.rbw .rb-row:nth-child(4) .rb-swp{animation-delay:.75s}.rbw .rb-row:nth-child(5) .rb-swp{animation-delay:1s}.rbw .rb-row:nth-child(6) .rb-swp{animation-delay:1.25s}.rbw .rb-row:nth-child(7) .rb-swp{animation-delay:1.5s}.rbw .rb-row:nth-child(8) .rb-swp{animation-delay:1.75s}
.rbw .rb-sweep{position:absolute;top:-10%;bottom:-10%;width:18%;right:-25%;z-index:3;background:linear-gradient(270deg,transparent,#ffffff30,transparent);transform:skewX(-20deg);animation:rb-sweep calc(7s/var(--as,1)) ease-in-out infinite;pointer-events:none}
@keyframes rb-sweep{0%,60%{transform:translateX(0) skewX(-20deg)}100%{transform:translateX(-750%) skewX(-20deg)}}
.rbw .rb-row.hit{animation:rb-hit 1.3s ease}
.rbw .rb-row.hit::after{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:inset 0 0 0 2px var(--pos),0 0 1em var(--pos);animation:rb-hitg 1.3s ease forwards}
.rbw .rb-row.neg.hit::after{box-shadow:inset 0 0 0 2px var(--neg),0 0 1em var(--neg)}
@keyframes rb-bob{50%{transform:translateY(-8%)}}@keyframes rb-crown{0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-10%) rotate(4deg)}}@keyframes rb-twinkle{0%,100%{transform:rotate(45deg) scale(.4);opacity:.2}50%{transform:rotate(45deg) scale(1);opacity:1}}@keyframes rb-neonflick{0%,100%{opacity:1}92%{opacity:1}93%{opacity:.6}94%{opacity:1}96%{opacity:.75}}
@keyframes rb-hit{20%{transform:scale(1.05)}}@keyframes rb-hitg{from{opacity:1}to{opacity:0}}
.rbw .rb-empty{height:100%;display:grid;place-items:center;font-size:var(--fs);opacity:.6}
/* أوضاع العرض */
.rbm-rotate .rb-stage{position:relative;height:100%}
.rbm-rotate .rb-one{position:absolute;inset:0;justify-content:center;font-size:calc(var(--fs)*1.05)}
.rbm-rotate .rb-one .rb-what{flex:none}
.rbm-ticker .rb-panel{padding:0 var(--pad);justify-content:center}
.rbm-ticker .rb-track{height:100%;overflow:hidden;display:flex;align-items:center;-webkit-mask:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.rbm-ticker .rb-run{display:flex;direction:ltr;gap:calc(var(--fs)*1.2);animation:rb-run linear infinite;padding-inline:calc(var(--fs)*.6)}.rbm-ticker .rb-run>.rb-row{direction:rtl}
.rbm-ticker .rb-row{flex:none;height:calc(var(--fs)*2)}
.rbm-ticker .rb-tt .rb-what{font-family:"Changa",sans-serif;font-weight:900;color:var(--acc,#f5c542)}
@keyframes rb-run{from{transform:translateX(0)}to{transform:translateX(calc(var(--len)*-1))}}
.rbm-ticker .rb-track.v{flex-direction:column;-webkit-mask:linear-gradient(180deg,transparent,#000 10%,#000 90%,transparent);mask:linear-gradient(180deg,transparent,#000 10%,#000 90%,transparent)}
.rbm-ticker .rb-track.v .rb-run{flex-direction:column;animation-name:rb-runv;width:100%}.rbm-ticker .rb-track.v .rb-row{width:100%;height:calc(var(--fs)*2.2)}.rbm-ticker .rb-track.v{align-items:stretch}
@keyframes rb-runv{from{transform:translateY(0)}to{transform:translateY(calc(var(--len)*-1))}}
.rbm-cards .rb-list{display:grid;grid-template-columns:repeat(var(--cols,2),1fr);grid-auto-rows:1fr}
.rbm-cards .rb-row{flex-direction:column;justify-content:center;text-align:center;white-space:normal;gap:.25em;padding:.4em}
.rbm-cards .rb-ic{width:calc(2.2em*var(--ics,1));height:calc(2.2em*var(--ics,1));font-size:calc(1.6em*var(--ics,1))}
.rbm-cards .rb-what{flex:none;font-size:.85em}
.rbm-compact .rb-panel{justify-content:center}
.rbm-compact .rb-list{flex-direction:row;flex-wrap:wrap;align-content:center;justify-content:center;gap:calc(var(--fs)*.35)}
.rbm-compact .rb-row{flex:none;height:calc(var(--fs)*1.9);padding:0 .45em;gap:.25em}
.rbm-compact .rb-val{direction:ltr}.rbm-compact .rb-ic{width:1.2em;height:1.2em}.rbm-compact .rb-val{padding:0;background:none!important;box-shadow:none!important}
.rbm-compact .pos .rb-val{color:var(--pos)}.rbm-compact .neg .rb-val{color:var(--neg)}
.rb-still *,.rb-still *::before,.rb-still *::after,.rb-lite .rb-sweep,.rb-lite .rb-swp,.no-fx .rb-sweep,.no-fx .rb-swp{animation:none!important}
.rb-lite .rb-panel,.rb-lite .rb-row::before{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
.rbm-ticker.rb-still .rb-run{animation:rb-run linear infinite!important}
@media (prefers-reduced-motion:reduce){.rbw *,.rbw *::before,.rbw *::after{animation:none!important}}
/* 1 Royal */
.rbd-royalRules .rb-panel{background:radial-gradient(ellipse at 50% 0,#7e22ce55,transparent 60%),linear-gradient(180deg,#2a0f3ae8,#12061bd8);border:calc(var(--fs)*.12) double #e8c46a;box-shadow:0 0 0 1px #00000066,0 10px 30px #0008}
.rbd-royalRules .rb-crw{display:block;animation:rb-bob 3s ease-in-out infinite}
.rbd-royalRules .rb-t{color:#fff3d1;text-shadow:0 2px 6px #000}
.rbd-royalRules .rb-row::before{background:linear-gradient(90deg,#ffffff0a,#e8c46a14)}.rbd-royalRules .rb-row{border-bottom:1px solid #e8c46a44;border-radius:0}
/* 2 Golden */
.rbd-goldenRules .rb-panel{background:none;border-radius:0}
.rbd-goldenRules .rb-t{background:linear-gradient(180deg,#fde68a,#d4a537 50%,#a16207);color:#3b2506;border-radius:calc(var(--tth)*.2);clip-path:polygon(4% 0,96% 0,100% 50%,96% 100%,4% 100%,0 50%);text-shadow:0 1px 0 #fff8}
.rbd-goldenRules .rb-row{border-radius:99px;border:1.5px solid #e8c46a}.rbd-goldenRules .rb-row::before{background:linear-gradient(90deg,#1c1404,#2e2006)}
/* 3 Diamond */
.rbd-diamondRules .rb-panel{clip-path:polygon(calc(var(--fs)*1.2) 0,calc(100% - var(--fs)*1.2) 0,100% calc(var(--fs)*1.2),100% calc(100% - var(--fs)*1.2),calc(100% - var(--fs)*1.2) 100%,calc(var(--fs)*1.2) 100%,0 calc(100% - var(--fs)*1.2),0 calc(var(--fs)*1.2));border-radius:0;background:linear-gradient(135deg,#0e7490cc,#1e1b4be6 45%,#155e75cc)}
.rbd-diamondRules .rb-t{color:#e0f7ff;text-shadow:0 0 10px #67e8f9}
.rbd-diamondRules .rb-row::before{background:linear-gradient(90deg,#ffffff14,transparent)}
.rbd-diamondRules .rb-row .rb-ic::after{content:"";position:absolute;width:.32em;height:.32em;background:#fff;transform:rotate(45deg);margin:-1.1em -1.1em 0 0;box-shadow:0 0 6px #a5f3fc;animation:rb-twinkle 2.2s ease-in-out infinite}
.rbd-diamondRules .rb-ic{position:relative}
/* 4 Silver */
.rbd-silverRules .rb-panel{background:linear-gradient(180deg,#f8fafc,#cbd5e1 40%,#94a3b8 52%,#e2e8f0);box-shadow:0 10px 26px #0008,inset 0 1px 0 #fff;color:#0f172a}
.rbd-silverRules .rb-t,.rbd-silverRules .rb-t .tx{color:#0f172a!important;text-shadow:0 1px 0 #fff}.rbd-silverRules .rb-what{color:#1e293b}
.rbd-silverRules .rb-row::before{background:#ffffff66}.rbd-silverRules .rb-row{border-bottom:1px solid #64748b44}
/* 5 Crown */
.rbd-crownRules .rb-panel{background:linear-gradient(180deg,#1c1404e0,#0a0702d0);border:1px solid #f5c54288;border-radius:calc(var(--fs)*1.2) calc(var(--fs)*1.2) calc(var(--fs)*.4) calc(var(--fs)*.4);overflow:visible;margin-top:calc(var(--tth)*.5)}
.rbd-crownRules .rb-t{flex-direction:column;gap:0;margin-top:calc(var(--tth)*-.9);height:calc(var(--tth)*1.6);color:#f5c542}
.rbd-crownRules .rb-crw{display:block;width:2.2em;filter:drop-shadow(0 0 10px #f5c54299);animation:rb-crown 2.8s ease-in-out infinite}
.rbd-crownRules .rb-row{justify-content:center}.rbd-crownRules .rb-row .rb-what{flex:none}
.rbd-crownRules .rb-row::before{background:radial-gradient(ellipse,#f5c54222,transparent 70%)}
/* 6 Luxury Black */
.rbd-luxuryBlackRules .rb-panel{background:#000000e6;border-radius:2px;border-top:1px solid #d6b55e;border-bottom:1px solid #d6b55e}
.rbd-luxuryBlackRules .rb-t{color:#d6b55e;font-weight:600}.rbd-luxuryBlackRules .rb-row{border-radius:0}
.rbd-luxuryBlackRules .rb-row+.rb-row{border-top:1px solid #d6b55e33}.rbd-luxuryBlackRules .rb-sweep{background:linear-gradient(270deg,transparent,#ffffff55,transparent)}
.rbd-luxuryBlackRules .pos .rb-val,.rbd-luxuryBlackRules .neg .rb-val{background:none;box-shadow:none}.rbd-luxuryBlackRules .pos .rb-val{color:var(--pos)}.rbd-luxuryBlackRules .neg .rb-val{color:var(--neg)}
/* 7 Platinum */
.rbd-platinumRules .rb-panel{background:linear-gradient(180deg,#e5e7eb30,#9ca3af18);border:1px solid #e5e7eb77;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-inline-start:calc(var(--fs)*.3) solid #e5e7eb}
.rbd-platinumRules .rb-t{color:#f9fafb;justify-content:flex-start}.rbd-platinumRules .rb-row::before{background:#ffffff10}
/* 8 Crystal (بطاقات) */
.rbd-crystalRules .rb-panel{background:none;border-radius:0;overflow:visible}
.rbd-crystalRules .rb-t{color:#ecfeff;text-shadow:0 0 10px #67e8f9,0 2px 6px #000}
.rbd-crystalRules .rb-row::before{background:linear-gradient(120deg,#ffffff38,#a5f3fc14 50%,#c4b5fd24);border:1px solid #e0f2fe88;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
.rbd-crystalRules .rb-row{box-shadow:0 6px 16px #0005}
/* 9 Neon Blue */
.rbd-neonBlueRules .rb-panel{background:#020617d9;border:2px solid #38bdf8;box-shadow:0 0 14px #38bdf8,inset 0 0 14px #38bdf855;animation:rb-neonflick 5s steps(1) infinite}
.rbd-neonBlueRules .rb-t{color:#e0f2fe;text-shadow:0 0 8px #38bdf8,0 0 2px #fff}
.rbd-neonBlueRules .rb-row{border-bottom:1px solid #38bdf855;border-radius:0}.rbd-neonBlueRules .rb-what{text-shadow:0 0 6px #38bdf8}
/* 40 B6O6 */
.rbd-b6o6Rules .rb-panel{border:1.5px solid transparent;background:linear-gradient(180deg,#000000ee,#06122ee0) padding-box,linear-gradient(135deg,#c0c7d4,#2f7bff 50%,#c0c7d4) border-box;box-shadow:0 0 20px #2f7bff44}
.rbd-b6o6Rules .rb-t span.tx{background:linear-gradient(180deg,#fff,#aeb8c8);-webkit-background-clip:text;background-clip:text;color:transparent}
.rbd-b6o6Rules .rb-crw{display:block;color:#2f7bff}
.rbd-b6o6Rules .rb-row::before{background:linear-gradient(90deg,#2f7bff1a,transparent)}.rbd-b6o6Rules .rb-row{border-inline-start:2px solid #2f7bff}
.rbm-ticker:not(.rbv) .rb-panel,.rbm-compact .rb-panel{border-radius:99px}
.rbd-goldenRules.rbm-ticker .rb-panel,.rbd-crystalRules.rbm-ticker .rb-panel{background:#000000a0}
`}
