// ====== طبقتا «آخر دعم» (بطاقة Basic) و«آخر 5 داعمين» (حركة متعرجة) ======
// المصدر الوحيد: تبرعات مؤكدة من مزود الدونيشن (DN.list) — لا تجربة ولا مسترجع بالكامل، بدون تكرار نفس العملية، وبعملة الدعم الفعلية.
import { View } from "./view.js";
import { esc, DC_DEFAULTS, D5_DEFAULTS } from "./defs.js";
import { dtMoney } from "./dtext.js";

export const DC_ANIMS=[["none","بدون حركة"],["fade","Fade In — ظهور تدريجي"],["slide","Slide — دخول خفيف من الأسفل"]];
export const D5_ANIMS=[["zigzag","Zigzag — متعرّجة يمين/يسار (افتراضي)"],["slide","Slide — كل الصفوف من جهة واحدة"],["fade","Fade — ظهور واختفاء تدريجي"],["none","بدون حركة"]];

const hexA=(h,a)=>{ const m=/^#?([0-9a-f]{6})$/i.exec(h||""); if(!m) return h||"transparent"; const n=parseInt(m[1],16); return `rgba(${n>>16&255},${n>>8&255},${n&255},${Math.max(0,Math.min(1,+a))})` };
const nmOf=d=>d.anonymous?"داعم مجهول":(d.name||"داعم");

/** التبرعات الحقيقية الأحدث أولاً (بدون تكرار نفس العملية) */
export function dcReal(DN){ const L=(DN&&DN.list)||[], seen=new Set(), out=[];
 for(let i=L.length-1;i>=0;i--){ const d=L[i]; if(!d||d.test||d.provider==="test") continue; if(d.status==="refunded"||(d.refunded||0)>=d.amount) continue;
  const k=d.id||[d.provider,d.name,d.amount,d.at].join("|"); if(seen.has(k)) continue; seen.add(k); out.push(d) } return out }
/** آخر N داعمين: «each» كل عملية صف مستقل، «person» آخر عملية لكل شخص */
export function d5List(DN,n=5,merge="each"){ const all=dcReal(DN); if(merge!=="person") return all.slice(0,n);
 const seen=new Set(), out=[]; for(const d of all){ const k=(d.anonymous?"~anon":(d.name||"").trim().toLowerCase()); if(seen.has(k)) continue; seen.add(k); out.push(d); if(out.length>=n) break } return out }

function moneyHTML(w,d,showSym,cls){ const m=dtMoney({symMode:showSym===false?"none":"sym",symPos:"auto",dec:"auto"},+d.amount||0,d.currency||"USD");
 return `<span class="${cls}" dir="ltr">${m.before?esc(m.sym):""}${m.num}${!m.before&&m.sym?" "+esc(m.sym):""}</span>` }
function neonFilter(c,str,spread,a){ const s=Math.max(.05,+spread||1), k=Math.max(0,+str||0); if(!k) return "none"; const col=hexA(c,Math.min(1,(+a||0)*Math.min(1,k)));
 const L=[`drop-shadow(0 0 ${(.08*s).toFixed(3)}em ${col})`,`drop-shadow(0 0 ${(.22*s).toFixed(3)}em ${col})`]; if(k>1) L.push(`drop-shadow(0 0 ${(.45*s*k).toFixed(3)}em ${col})`); return L.join(" ") }

Object.assign(View.prototype,{
 // ---------- آخر دعم ----------
 applyDc(w,W,Hh){ const e=this.el, ed=this.opts.editor; ensureDcCSS(); const D=DC_DEFAULTS, g=k=>w[k]??D[k];
  e.className=`wd dcw${ed?(" "+(w.locked?"locked":"")+(w.visible?"":" hid")+(this.opts.sel===w.id?" sel":"")):""}`;
  const st=e.style, fx=!g("lcFxOff"); st.setProperty("--cfs",Math.max(7,Hh*.2)*(+g("lcFs")||1)+"px");
  const set=(k,v)=>st.setProperty(k,v);
  set("--cbg",hexA(g("lcBgC"),g("lcBgA"))); set("--cbd",g("lcBorderC")); set("--cbw",Math.max(0,+g("lcBw"))+"px"); set("--crad",(+g("lcRad"))+"em"); set("--cpad",(+g("lcPad"))+"em"); set("--cgap",(+g("lcGap"))+"em");
  set("--cw",g("lcWeight")); if(g("lcFont")) set("--cff",`"${g("lcFont")}"`); else st.removeProperty("--cff");
  set("--cnc",hexA(g("lcNameC"),g("lcNameA"))); set("--cbc",hexA(g("lcBadgeC"),g("lcBadgeA"))); set("--cbb",hexA(g("lcBadgeBg"),g("lcBadgeA"))); set("--ctc",hexA(g("lcThxC"),g("lcThxA")));
  for(const [k,v] of [["lcAmtS","--cas"],["lcNameS","--cns"],["lcBadgeS","--cbs"],["lcThxS","--cts"]]) set(v,+g(k)||1);
  const grad=g("lcAmtMode")==="grad"; set("--cac",grad?"transparent":hexA(g("lcAmtC"),g("lcAmtA"))); set("--cagr",grad?`linear-gradient(90deg,${g("lcAmtC")},${g("lcAmtC2")})`:"none"); set("--caop",grad?String(+g("lcAmtA")):"1");
  set("--cneon",fx&&g("lcNeon")?neonFilter(g("lcNeonC"),g("lcNeonStr"),g("lcNeonSpread"),g("lcNeonA")):"none");
  set("--cbsh",fx&&g("lcNeon")&&g("lcNeonBorder")?`0 0 ${(.3*(+g("lcNeonSpread")||1)).toFixed(2)}em ${hexA(g("lcNeonC"),(+g("lcNeonA"))*.8)}`:"none");
  e.classList.toggle("dc-grad",grad); set("--cal",g("lcAlign")==="right"?"flex-start":g("lcAlign")==="left"?"flex-end":"center"); set("--cta",g("lcAlign")||"center");
  if(!this.dc){ this.dc={cur:null,key:null}; e.innerHTML=(ed?'<div class="rh"></div><div class="lockb">🔒</div>':"") }
  this.dcRender(this.dc.cur,true); if(this.opts.data) this.refreshDc(this.opts.data(),true) },
 dcHTML(d){ const w=this.w, D=DC_DEFAULTS, g=k=>w[k]??D[k], ed=this.opts.editor;
  if(!d&&!ed) return null; const ph=!d;
  const badge=g("lcShowBadge")&&g("lcBadge")?`<div class="dc-badge">${esc(g("lcBadge"))}</div>`:"";
  const amt=ph?`<span class="dc-amt" dir="ltr">—</span>`:moneyHTML(w,d,g("lcShowSym"),"dc-amt");
  const name=g("lcShowName")?`<span class="dc-name">${ph?"بانتظار أول دعم":esc(nmOf(d))}</span>`:"";
  const row=`<div class="dc-row">${g("lcOrder")==="name"?name+amt:amt+name}</div>`;
  const thx=g("lcShowThx")&&g("lcThx")?`<div class="dc-thx">${esc(g("lcThx"))}</div>`:"";
  return `<div class="dc-card${ph?" dc-ph":""}" dir="rtl">${badge}${row}${thx}</div>` },
 dcRender(d,silent){ const w=this.w, g=k=>w[k]??DC_DEFAULTS[k], old=this.el.querySelector(".dc-card:not(.dc-out)"), html=this.dcHTML(d), rh=this.el.querySelector(".rh");
  const anim=g("lcFxOff")||!g("lcAnimOn")?"none":g("lcAnim"), ms=Math.max(100,Math.min(4000,+g("lcAnimMs")||500));
  const tok=(this._dcTok=(this._dcTok||0)+1); this.el.querySelectorAll(".dc-card.dc-out").forEach(x=>x.remove());
  if(!html){ if(old) old.remove(); return }
  const t=document.createElement("div"); t.innerHTML=html; const card=t.firstChild;
  const enter=()=>{ this.el.insertBefore(card,rh||null); if(!silent&&anim!=="none"&&card.animate) card.animate(anim==="slide"?[{opacity:0,transform:"translateY(35%)"},{opacity:1,transform:"none"}]:[{opacity:0},{opacity:1}],{duration:ms,easing:"cubic-bezier(.2,.9,.3,1)"}) };
  if(old&&!silent&&anim!=="none"&&g("lcAnimOut")&&old.animate){ old.classList.add("dc-out"); old.animate([{opacity:1},{opacity:0}],{duration:ms*.6,fill:"forwards"}); setTimeout(()=>{ old.remove(); if(tok===this._dcTok) enter() },ms*.6); return } /* setTimeout بدل onfinish: يعمل حتى لو كان المصدر مخفياً في OBS */
  if(old) old.remove(); enter() },
 refreshDc(src,silent){ const d=this.opts.dcSample?this.opts.dcSample():(dcReal(src&&src.DN)[0]||null); const key=d?d.id+"|"+d.amount+"|"+(d.refunded||0):"";
  if(!this.dc) this.dc={cur:null}; if(this.dc.key===key&&!this.dc.force) return; this.dc.key=key; this.dc.force=false; this.dc.cur=d; this.dcRender(d,silent) },

 // ---------- آخر 5 داعمين ----------
 applyD5(w,W,Hh){ const e=this.el, ed=this.opts.editor; ensureDcCSS(); const D=D5_DEFAULTS, g=k=>w[k]??D[k];
  e.className=`wd d5w${ed?(" "+(w.locked?"locked":"")+(w.visible?"":" hid")+(this.opts.sel===w.id?" sel":"")):""}`;
  const n=Math.max(1,Math.min(10,+g("l5Count")||5)), rows=n+(g("l5ShowTitle")&&g("l5Title")?.8:0), gap=+g("l5Gap")||0;
  const rowH=Hh/(rows+gap*(n)); const st=e.style, set=(k,v)=>st.setProperty(k,v);
  set("--qfs",Math.max(6,rowH*.5)*(+g("l5Fs")||1)+"px"); set("--qgap",gap*rowH+"px"); set("--qw",g("l5Weight")); if(g("l5Font")) set("--qff",`"${g("l5Font")}"`); else st.removeProperty("--qff");
  set("--qnc",g("l5NameC")); set("--qac",g("l5AmtC")); set("--qrc",g("l5RankC")); set("--qtc",g("l5TitleC"));
  set("--qbg",hexA(g("l5BgC"),g("l5BgA"))); set("--qbd",g("l5BorderC")); set("--qbw",Math.max(0,+g("l5Bw"))+"px"); set("--qrad",(+g("l5Rad"))+"em");
  set("--qneon",g("l5Neon")?neonFilter(g("l5NeonC"),g("l5NeonStr"),1,.9):"none");
  e.classList.toggle("d5-panel",g("l5BgMode")==="panel"); e.classList.toggle("d5-norank",!g("l5ShowRank"));
  const sig=[n,g("l5ShowTitle"),g("l5Title"),g("l5Anim"),g("l5AnimOn"),g("l5Dir"),g("l5InMs"),g("l5Stagger"),g("l5Hold"),g("l5OutMs"),g("l5Wait"),g("l5Dist"),g("l5Float")].join("|");
  if(!this.d5||this.d5.sig!==sig){ this.d5Stop(); this.d5={sig,items:this.d5?this.d5.items:[],key:null,timers:[],anims:[]};
   e.innerHTML=`<div class="d5-box" dir="rtl">${g("l5ShowTitle")&&g("l5Title")?`<div class="d5-title">${esc(g("l5Title"))}</div>`:""}<div class="d5-rows">${Array.from({length:n},(_,i)=>`<div class="d5-row" data-i="${i}"><span class="d5-rank">${i+1}</span><span class="d5-name"></span><span class="d5-amt"></span></div>`).join("")}</div></div>`+(ed?'<div class="rh"></div><div class="lockb">🔒</div>':"");
   this.d5Fill(true); this.d5Cycle(true) } else this.d5Fill(true);
  if(this.opts.data) this.refreshD5(this.opts.data(),true) },
 d5Fill(silent,newTop){ const w=this.w, g=k=>w[k]??D5_DEFAULTS[k], ed=this.opts.editor, items=this.d5.items||[];
  this.el.querySelectorAll(".d5-row").forEach((r,i)=>{ const d=items[i];
   if(!d){ r.classList.add("d5-empty"); r.querySelector(".d5-name").textContent=ed&&i===0&&!items.length?"بانتظار أول دعم":""; r.querySelector(".d5-amt").innerHTML=""; return }
   r.classList.remove("d5-empty"); r.querySelector(".d5-name").textContent=nmOf(d); r.querySelector(".d5-amt").innerHTML=moneyHTML(w,d,g("l5ShowSym"),"d5-m") });
  if(!silent&&newTop) this.d5Enter(0,true) },
 d5Side(i){ const w=this.w, g=k=>w[k]??D5_DEFAULTS[k], a=g("l5Anim"), first=g("l5Dir")==="lr"?-1:1; return a==="zigzag"?(i%2?-first:first):first },
 d5Enter(i,flash){ const w=this.w, g=k=>w[k]??D5_DEFAULTS[k], r=this.el.querySelectorAll(".d5-row")[i]; if(!r||!r.animate) return;
  const a=g("l5Anim"), dist=(+g("l5Dist")||60)*this.d5Side(i), ms=Math.max(120,+g("l5InMs")||700);
  const kf=a==="fade"?[{opacity:0},{opacity:1}]:[{opacity:0,transform:`translateX(${dist}%)`},{opacity:1,transform:"none"}];
  r.style.opacity=""; const an=r.animate(kf,{duration:flash?Math.min(ms,600):ms,easing:"cubic-bezier(.2,.9,.25,1)",fill:"backwards"}); this.d5.anims.push(an); return an },
 d5Stop(){ if(!this.d5) return; for(const t of this.d5.timers) clearTimeout(t); for(const a of this.d5.anims) try{ a.cancel() }catch{} this.d5.timers=[]; this.d5.anims=[];
  this.el.querySelectorAll&&this.el.querySelectorAll(".d5-row").forEach(r=>{ r.style.opacity=""; r.style.transform="" }) },
 d5Cycle(first){ const w=this.w, g=k=>w[k]??D5_DEFAULTS[k], S=this.d5, T=(f,ms)=>S.timers.push(setTimeout(()=>{ if(S!==this.d5) return; if(this.el.isConnected){ this._d5in=true; f() } else if(!this._d5in) f(); else this.d5Stop() },ms));
  const anim=g("l5AnimOn")&&g("l5Anim")!=="none"; const rows=[...this.el.querySelectorAll(".d5-row")]; if(!anim||!rows.length) return;
  const inMs=Math.max(120,+g("l5InMs")||700), stg=Math.max(0,+g("l5Stagger")||0), hold=Math.max(0,+g("l5Hold")||0)*1000, outMs=Math.max(120,+g("l5OutMs")||600), wait=Math.max(0,+g("l5Wait")||0)*1000, a=g("l5Anim");
  rows.forEach(r=>r.style.opacity="0"); rows.forEach((r,i)=>T(()=>this.d5Enter(i),i*stg));
  const shown=inMs+stg*(rows.length-1);
  if(g("l5Float")) T(()=>rows.forEach((r,i)=>{ if(r.animate){ const an=r.animate([{transform:"translateX(0)"},{transform:`translateX(${this.d5Side(i)*1.2}%)`},{transform:"translateX(0)"}],{duration:3200,iterations:Infinity,easing:"ease-in-out",delay:i*240}); S.anims.push(an) } }),shown);
  if(!hold) return; /* 0 = تبقى ظاهرة بدون دورة */
  T(()=>{ S.anims.forEach(x=>{ try{ x.cancel() }catch{} }); S.anims=[];
   rows.forEach((r,i)=>T(()=>{ if(!r.animate) return; const dist=(+g("l5Dist")||60)*this.d5Side(i);
    const an=r.animate(a==="fade"?[{opacity:1},{opacity:0}]:[{opacity:1,transform:"none"},{opacity:0,transform:`translateX(${dist}%)`}],{duration:outMs,easing:"cubic-bezier(.6,0,.8,.4)",fill:"forwards"}); S.anims.push(an) },(rows.length-1-i)*stg));
   T(()=>{ S.anims.forEach(x=>{ try{ x.cancel() }catch{} }); S.anims=[]; rows.forEach(r=>r.style.opacity="0"); T(()=>{ rows.forEach(r=>r.style.opacity=""); this.d5Cycle(false) },wait) },outMs+stg*(rows.length-1)+30) },shown+hold) },
 refreshD5(src,silent){ const w=this.w, g=k=>w[k]??D5_DEFAULTS[k]; if(!this.d5) return;
  const items=this.opts.d5Sample?this.opts.d5Sample():d5List(src&&src.DN,Math.max(1,Math.min(10,+g("l5Count")||5)),g("l5Merge"));
  const key=items.map(d=>d.id+":"+d.amount+":"+(d.refunded||0)).join(","); if(this.d5.key===key&&!this.d5.force) return;
  const newTop=this.d5.key!=null&&items[0]&&(this.d5.items[0]||{}).id!==items[0].id; this.d5.key=key; this.d5.force=false; this.d5.items=items; this.d5Fill(silent,newTop) },
});

let dcCss=false;
function ensureDcCSS(){ if(dcCss||typeof document==="undefined") return; dcCss=true; const s=document.createElement("style"); s.id="b6o6-dc"; s.textContent=DC_CSS; document.head.appendChild(s) }
const DC_CSS=`
.dcw,.d5w{background:none!important;border:0!important;box-shadow:none!important;overflow:visible}
.dcw{display:flex;align-items:stretch;justify-content:stretch}
.dc-card{flex:1;box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;align-items:var(--cal);text-align:var(--cta);gap:var(--cgap);padding:calc(var(--cpad)*.6) var(--cpad);
 background:var(--cbg);border:var(--cbw) solid var(--cbd);border-radius:var(--crad);box-shadow:var(--cbsh);font-family:var(--cff,inherit);font-size:var(--cfs);font-weight:var(--cw);line-height:1.15;overflow:hidden;min-width:0}
.dc-badge{display:inline-block;align-self:var(--cal);background:var(--cbb);color:var(--cbc);font-size:calc(.62em * var(--cbs));padding:.12em .7em;border-radius:99em;white-space:nowrap}
.dc-row{display:flex;align-items:baseline;justify-content:var(--cal);gap:.45em;min-width:0;max-width:100%}
.dc-amt{color:var(--cac);background:var(--cagr);-webkit-background-clip:text;background-clip:text;opacity:var(--caop);font-size:calc(1.4em * var(--cas));font-weight:900;filter:var(--cneon);font-variant-numeric:tabular-nums;white-space:nowrap;unicode-bidi:isolate}
.dc-name{color:var(--cnc);flex:0 1 auto;font-size:calc(1em * var(--cns));white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;unicode-bidi:plaintext}
.dc-thx{color:var(--ctc);font-size:calc(.62em * var(--cts));font-weight:600;white-space:nowrap}
.dc-ph{opacity:.55}
.d5w{display:flex;align-items:stretch}
.d5-box{flex:1;display:flex;flex-direction:column;gap:var(--qgap);font-family:var(--qff,inherit);font-size:var(--qfs);font-weight:var(--qw);line-height:1.1;min-width:0}
.d5-panel .d5-box{background:var(--qbg);border:var(--qbw) solid var(--qbd);border-radius:var(--qrad);padding:.35em .5em}
.d5-title{color:var(--qtc);font-size:.85em;font-weight:800;text-align:center;white-space:nowrap}
.d5-rows{flex:1;display:flex;flex-direction:column;gap:var(--qgap);min-height:0}
.d5-row{flex:1;display:flex;align-items:center;gap:.55em;padding:0 .6em;min-height:0;border-radius:var(--qrad);will-change:transform,opacity}
.d5w:not(.d5-panel) .d5-row{background:var(--qbg);border:var(--qbw) solid var(--qbd)}
.d5-row.d5-empty{visibility:hidden}
.d5-rank{color:var(--qrc);font-weight:900;min-width:1.1em;text-align:center}
.d5-norank .d5-rank{display:none}
.d5-name{color:var(--qnc);flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;unicode-bidi:plaintext}
.d5-amt{color:var(--qac);font-weight:900;white-space:nowrap;filter:var(--qneon);font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){.d5-row,.dc-card{animation:none!important}}
`;
