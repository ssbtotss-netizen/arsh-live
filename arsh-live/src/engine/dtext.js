// ====== آخر دعم نصي | Minimal Last Donation ======
// سطر نصي واحد فقط (مثل Streamlabs): بدون بطاقة أو صورة أو زخارف — الخلفية شفافة 100%.
// المصدر: آخر دونيشن مؤكد من مزود التبرعات (DN.list) — لا يعرض دعم الاختبار ولا المسترجع، ولا يحوّل العملات.
import { View } from "./view.js";
import { esc, DT_DEFAULTS } from "./defs.js";
import { CURRENCIES } from "./donations.js";

export const DT_ANIMS=[["none","بدون حركة (ثابت)"],["fade","Fade In — ظهور تدريجي"],["fadeOut","Fade Out ثم In — تبديل ناعم"],["slideUp","Slide Up — صعود"],["number","Smooth Number — عدّ المبلغ"],["shine","White Shine — لمعة بيضاء"],["glow","Soft Glow — توهج ناعم"]];
export const DT_FONTS=[["","افتراضي"],["Readex Pro","Readex Pro"],["Changa","Changa"],["Amiri","Amiri"],["Orbitron","Orbitron"],["Arial","Arial"],["Tahoma","Tahoma"]];

/** آخر دونيشن حقيقي مؤكد غير مسترجع بالكامل */
export function dtLatest(DN){ const L=(DN&&DN.list)||[]; for(let i=L.length-1;i>=0;i--){ const d=L[i]; if(d.test||d.provider==="test") continue; if(d.status==="refunded"||(d.refunded||0)>=d.amount) continue; return d } return null }
/** تجزئة المبلغ والعملة حسب الإعدادات (بدون تحويل عملات) */
export function dtMoney(w,amount,cur){ const c=CURRENCIES[cur]||{sym:cur,dec:2}; const dec=w.dec==="auto"||w.dec==null?(amount%1?Math.min(2,c.dec):0):Math.max(0,Math.min(3,+w.dec));
 const num=Number(amount||0).toLocaleString("en-US",{minimumFractionDigits:dec,maximumFractionDigits:dec});
 const sym=w.symMode==="code"?cur:w.symMode==="none"?"":c.sym; const latin=/^[$€£]$/.test(sym);
 const before=w.symPos==="before"||(w.symPos!=="after"&&latin); return {num,sym,before,dec} }

Object.assign(View.prototype,{
 applyDt(w,W,Hh){ const e=this.el, ed=this.opts.editor; ensureDtCSS();
  e.className=`wd dtw${ed?(" "+(w.locked?"locked":"")+(w.visible?"":" hid")+(this.opts.sel===w.id?" sel":"")):""}`;
  const st=e.style, fs=Math.max(8,Hh*.62)*(+w.fs||1);
  st.setProperty("--dfs",fs+"px"); st.setProperty("--dgap",(w.gapEm??.35)+"em"); st.setProperty("--dw",w.weight||"800");
  if(w.font) st.setProperty("--dff",`"${w.font}"`); else st.removeProperty("--dff");
  for(const [k,v] of [["cTitle","--dct"],["cName","--dcn"],["cSep","--dcs"],["cSym","--dcy"],["cAmt","--dca"],["glowColor","--dgc"]]) st.setProperty(v,w[k]||DT_DEFAULTS[k]);
  st.setProperty("--dns",w.nameScale||1); st.setProperty("--das",w.amtScale||1); st.setProperty("--dys",w.symScale||1); st.setProperty("--dts",w.titleScale||1); st.setProperty("--dgs",w.glowStr??.6);
  e.classList.toggle("dt-shadow",w.shadow!==false); e.classList.toggle("dt-glow",!!w.glowOn);
  e.style.justifyContent=w.align==="right"?"flex-end":w.align==="left"?"flex-start":"center";
  if(!this.dt){ this.dt={cur:null}; e.innerHTML=(ed?'<div class="rh"></div><div class="lockb">🔒</div>':"") }
  this.dtRender(this.dt.cur,true);
  if(this.opts.data) this.refreshDt(this.opts.data(),true);
 },
 dtLine(d){ const w=this.w; if(!d) return null; const m=dtMoney(w,d.amount,d.currency); const name=d.anonymous?"داعم مجهول":d.name;
  const sym=w.showSym!==false&&m.sym?`<span class="dt-sym">${esc(m.sym)}</span>`:"";
  const amt=w.showAmt!==false?`<span class="dt-amt" data-v="${+d.amount||0}">${m.num}</span>`:"";
  const money=amt||sym?`<span class="dt-money" dir="ltr">${m.before?sym+amt:amt+(sym?" "+sym:"")}</span>`:"";
  const ttl=w.showTitle!==false&&w.dtTitle?`<span class="dt-title">${esc(w.dtTitle)}</span>`:"";
  const nm=w.showName!==false?`<span class="dt-nwrap"><span class="dt-name">${esc(name)}</span>${w.showSep!==false&&w.sepText?`<span class="dt-sep">${esc(w.sepText)}</span>`:""}</span>`:"";
  const dir=w.dir&&w.dir!=="auto"?w.dir:(ttl&&/[؀-ۿ]/.test(w.dtTitle||"")?"rtl":"ltr");
  return `<div class="dt-line" dir="${dir}">${ttl}${nm}${money}<i class="dt-shine"></i></div>` },
 dtRender(d,silent){ const w=this.w, old=this.el.querySelector(".dt-line:not(.dt-out)"), html=this.dtLine(d);
  const anim=w.animOn===false?"none":(w.dtAnim||"none");
  if(!html){ if(old) old.remove(); return }
  const prevAmt=old&&old.querySelector(".dt-amt")?+old.querySelector(".dt-amt").dataset.v:null;
  const tmp=document.createElement("div"); tmp.innerHTML=html; const line=tmp.firstChild; const rh=this.el.querySelector(".rh");
  if(silent||anim==="none"||!old){ if(old) old.remove(); this.el.insertBefore(line,rh||null); if(!silent&&!old&&anim!=="none") line.classList.add("dt-a-"+(anim==="fadeOut"||anim==="number"?"fade":anim)); return }
  if(anim==="fadeOut"){ old.classList.add("dt-out"); setTimeout(()=>old.remove(),350); line.classList.add("dt-a-fadeIn2"); this.el.insertBefore(line,rh||null); return }
  old.remove(); this.el.insertBefore(line,rh||null);
  if(anim==="number"){ const a=line.querySelector(".dt-amt"); if(a&&prevAmt!=null){ const to=+a.dataset.v, m=dtMoney(w,to,d.currency), t0=performance.now(), from=prevAmt; const fmt=v=>Number(v).toLocaleString("en-US",{minimumFractionDigits:m.dec,maximumFractionDigits:m.dec});
    const step=t=>{ const p=Math.min(1,(t-t0)/900), e=1-Math.pow(1-p,3); a.textContent=fmt(from+(to-from)*e); if(p<1&&a.isConnected) requestAnimationFrame(step); else a.textContent=m.num }; requestAnimationFrame(step) } line.classList.add("dt-a-fade") }
  else line.classList.add("dt-a-"+anim) },
 refreshDt(src,silent){ const d=this.opts.dtSample?this.opts.dtSample():dtLatest(src&&src.DN); const key=d?d.id+"|"+d.amount+"|"+d.refunded:"";
  if(!this.dt) this.dt={cur:null}; if(this.dt.key===key&&!this.dt.force) return; this.dt.key=key; this.dt.force=false; this.dt.cur=d; this.dtRender(d,silent) },
});

let dtCss=false;
function ensureDtCSS(){ if(dtCss||typeof document==="undefined") return; dtCss=true; const s=document.createElement("style"); s.id="b6o6-dt"; s.textContent=DT_CSS; document.head.appendChild(s) }
const DT_CSS=`
.dtw{display:flex;align-items:center;background:none!important;border:0!important;box-shadow:none!important;overflow:visible}
.dt-line{position:relative;display:inline-flex;align-items:baseline;gap:var(--dgap);white-space:nowrap;font-family:var(--dff,inherit);font-size:var(--dfs);font-weight:var(--dw);line-height:1.15;max-width:100%;overflow:hidden}
.dt-line>span{unicode-bidi:isolate}
.dt-title{color:var(--dct);font-size:calc(1em * var(--dts))}
.dt-nwrap{display:inline-flex;align-items:baseline;min-width:0}
.dt-name{color:var(--dcn);font-size:calc(1em * var(--dns));unicode-bidi:plaintext;overflow:hidden;text-overflow:ellipsis;min-width:0}
.dt-sep{color:var(--dcs)}
.dt-money{display:inline-flex;align-items:baseline;direction:ltr;unicode-bidi:isolate}
.dt-sym{color:var(--dcy);font-size:calc(1em * var(--dys))}
.dt-amt{color:var(--dca);font-size:calc(1em * var(--das));font-variant-numeric:tabular-nums}
.dt-shadow .dt-line{text-shadow:0 2px 3px #000c,0 0 1px #000}
.dt-glow .dt-line{text-shadow:0 0 calc(var(--dfs)*.25*var(--dgs)) var(--dgc),0 0 calc(var(--dfs)*.5*var(--dgs)) var(--dgc)}
.dt-shadow.dt-glow .dt-line{text-shadow:0 2px 3px #000c,0 0 calc(var(--dfs)*.25*var(--dgs)) var(--dgc),0 0 calc(var(--dfs)*.5*var(--dgs)) var(--dgc)}
.dt-shine{position:absolute;inset:0;pointer-events:none;background:linear-gradient(105deg,transparent 35%,#ffffffcc 50%,transparent 65%);transform:translateX(-130%);mix-blend-mode:overlay;opacity:0}
.dt-a-fade{animation:dt-fade .6s ease both}.dt-a-fadeIn2{animation:dt-fade .5s ease .25s both}.dt-out{animation:dt-fadeo .35s ease forwards}
.dt-a-slideUp{animation:dt-up .55s cubic-bezier(.2,1,.3,1) both}
.dt-a-shine .dt-shine{opacity:1;animation:le-shine .9s ease .1s both}
.dt-a-glow{animation:dt-glow 1.4s ease}
@keyframes dt-fade{from{opacity:0}to{opacity:1}}@keyframes dt-fadeo{to{opacity:0}}
@keyframes dt-up{from{opacity:0;transform:translateY(60%)}to{opacity:1;transform:none}}
@keyframes dt-glow{0%{filter:none}35%{filter:drop-shadow(0 0 8px var(--dgc)) brightness(1.3)}100%{filter:none}}
@keyframes le-shine{from{transform:translateX(-130%)}to{transform:translateX(130%)}}
@media (prefers-reduced-motion:reduce){.dt-line{animation:none!important}}
`;
