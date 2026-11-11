// ====== رسم قوائم Pro وأهداف الدعم المصغّرة (امتداد لـ View) ======
import { View } from "./view.js";
import { esc, avatar, clamp } from "./defs.js";
import { lbEntries, lbIcon, lbFmt, lbDesignOf, haloHTML, lbDesignCSS, RANK_COLORS, sgProgress, sgFmt, SG_ICONS, SG_DESIGNS, lbSlots } from "./lb.js";
import { lbBarSlots, lbBarDeco, lbCompact, LB_BAR_ICONS, LB_BAR_CSS } from "./lb_bars.js";
import { lbArtOf, lbArtSlots, lbAmbHTML, lbD1HTML, lbCelebrateArt, LB_ART_CSS } from "./lb_art.js";

const CROWN_SVG='<svg viewBox="0 0 64 44"><path fill="currentColor" d="M3 38 7 9l14 15L32 2l11 22L57 9l4 29z"/><rect x="5" y="38" width="54" height="6" rx="2" fill="currentColor"/></svg>';
let lbCss=false;
function ensureLbCSS(){ if(lbCss||typeof document==="undefined") return; lbCss=true; const st=document.createElement("style"); st.id="b6o6-lb-designs"; st.textContent=lbDesignCSS()+LB_BAR_CSS+LB_ART_CSS; document.head.appendChild(st) }
const lbReduced=()=>{ try{ return matchMedia("(prefers-reduced-motion: reduce)").matches }catch(e){ return false } };

function countTo(el,from,to,fmtFn,ms){
 if(el._raf) cancelAnimationFrame(el._raf);
 if(ms<=0||from===to){ el.textContent=fmtFn(to); return }
 const t0=performance.now(); const step=t=>{ const p=Math.min(1,(t-t0)/ms), e=1-Math.pow(1-p,3); el.textContent=fmtFn(from+(to-from)*e); if(p<1) el._raf=requestAnimationFrame(step); else el._raf=0 }; el._raf=requestAnimationFrame(step);
}

Object.assign(View.prototype,{
 applyPro(w,W,Hh,pad,gap){
  ensureLbCSS(); const e=this.el, lb=w.type==="lb", ed=this.opts.editor;
  const lite=!!(w.lowPerf||this.opts.lowPerf), d=lb?lbDesignOf(w.design):(SG_DESIGNS.find(x=>x.id===w.design)||SG_DESIGNS[0]);
  e.className=`wd pro ${lb?"lbw lbd-"+d.id+(d.cat==="mini"?" lbd-mini":"")+" lbn-"+Math.max(1,w.topN):"sgw sg-"+d.id+" sgs-"+d.shape} av-${w.avShape||"circle"} f-${w.font&&w.font!=="default"?w.font:"default"}${lite?" lb-lite":""}${w.effects&&this.opts.globalFx!==false?"":" no-fx"}${ed?(" "+(w.locked?"locked":"")+(w.visible?"":" hid")+(this.opts.sel===w.id?" sel":"")):""}`;
  this.lbBars=lb&&d.layout==="bars"; this.lbArt=lb&&d.layout==="art"?lbArtOf(d,w):null;
  if(this.lbArt){ const A=this.lbArt, T=(c,on)=>on&&e.classList.add(c); e.classList.add("lbl-art","lba-"+A.arr,"lbfr-"+(w.showAv===false?"none":A.frame),"lbrk-"+A.rk,"lbnm-"+A.nm);
   T("lb-norank",w.showRank===false); T("lb-nod1",w.crown1===false||w.showDeco===false); T("lb-noamb",w.showAmb===false); T("lb-shine",w.shine===true||(w.shine!==false&&d.id==="whiteShine"));
   const S0=e.style; S0.setProperty("--W0",String(Math.round(Math.min(W,Hh*1.6)))); S0.setProperty("--las",String(w.animSpeed||1)); S0.setProperty("--glw",String(w.glowStr??1));
   for(const [v,f] of [["--nmc","nameColor"],["--vlc2","valTx"]]) if(w[f]) S0.setProperty(v,w[f]); else S0.removeProperty(v) }
  if(this.lbBars){ e.classList.add("lbl-bars","lbb-"+d.bar,"lbs-"+(w.source||"gifts")); const T=(c,on)=>on&&e.classList.add(c); T("lbf-solid",w.barFill==="solid"); T("lb-noic",w.showIcon===false); T("lb-norank",w.showRank===false); T("lb-noav",w.showAv===false); T("lb-crown1",!!w.crown1); T("lb-noshine",w.shine===false); T("lb-no1fx",w.fx1===false); T("lb-nodeco",w.showDeco===false);
   const S0=e.style; S0.setProperty("--shc",(+w.shineEvery||6)+"s"); S0.setProperty("--las",String(w.animSpeed||1)); S0.setProperty("--H0",String(Math.round(Hh)));
   for(const [v,f] of [["--rkc","rankTx"],["--vlc","valTx"],["--icc","icColor"]]) if(w[f]) S0.setProperty(v,w[f]); else S0.removeProperty(v) }
  if(lb&&(!w.font||w.font==="default")) e.style.setProperty("--lbf",d.font==="Orbitron"?`"Orbitron","Readex Pro"`:`"${d.font}"`); else e.style.removeProperty("--lbf");
  const S=e.style; S.setProperty("--ro",String(w.rowOpacity??1)); S.setProperty("--tx2",w.tx||"#fff");
  if(lb){ const cols=(w.rankColors&&w.rankColors.length===5)?w.rankColors:(d.colors||RANK_COLORS); cols.forEach((c,i)=>S.setProperty("--rc"+(i+1),c)) }
  if(w.acc) S.setProperty("--acc",w.acc); else S.removeProperty("--acc");
  const tth=lb&&w.showTitle?clamp(Math.min(Hh*.07,W*.07),16,110)*Math.sqrt(w.fontScale||1):0;
  this.pg={W:W-pad*2,H:Hh-pad*2-(tth?tth+gap:0),g:gap,pad,tth};
  S.setProperty("--tth",tth+"px"); S.setProperty("--pad",pad+"px");
  if(!lb){ const ih=Hh, sh=d.shape; S.setProperty("--gh",(sh==="ring"?Math.min(W,ih):sh==="vertical"?W:ih)+"px"); S.setProperty("--gfs",(sh==="ring"?Math.min(W,ih)*.1:sh==="vertical"?Math.min(W*.15,ih*.06):Math.min(ih*.36,W*.06))*(w.fontScale||1)+"px") }
  this.lbAvs=lb?(d.avs||1):1;
  const sig=["pro",w.type,d.id,w.topN,w.showTitle,w.title,w.source,w.giftKey,w.showPct,w.icon,this.lbArt?[this.lbArt.arr,this.lbArt.amb,this.lbArt.d1,w.fxN,w.firstScale].join(","):"",d.vg?Math.round(W)+"x"+Math.round(Hh):""].join("|");
  if(sig!==this.sig){ this.sig=sig; this.buildPro(d) }
  else if(this.vg&&d.vg) this.vgCls(d);
  else if(lb) this.layoutRows(true);
  if(this.opts.data) this.refreshPro(this.opts.data(),true);
 },
 buildPro(d){
  const w=this.w, ed=this.opts.editor?'<div class="rh"></div><div class="lockb">🔒</div>':"";
  this.leader=null; this.rowEls=new Map(); this.sgDone=null;
  if(w.type==="lb"){
   this.el.innerHTML=`${w.showTitle?`<div class="lb-t"><span class="tx">${esc(w.title||"")}</span></div>`:""}<div class="lb-rows"></div><div class="fxl"></div>`+ed;
   this.rows=this.el.querySelector(".lb-rows"); this.lbHalo=d.layout==="bars"?"":haloHTML(d.halo);
   if(d.layout==="bars"){ const dc=document.createElement("div"); dc.className="lbx-deco"; dc.innerHTML=lbBarDeco(d.deco); this.el.insertBefore(dc,this.el.querySelector(".fxl")) }
   if(this.lbArt){ const A=this.lbArt, am=document.createElement("div"); am.className="lbx-amb"; am.innerHTML=lbAmbHTML(A.amb,w.fxN??1,w.id); this.el.insertBefore(am,this.rows); this.lbD1=lbD1HTML(A.d1) } else this.lbD1="";
   clearInterval(this.rotT); this.rotT=0; return;
  }
  this.vg=null;
  if(d.vg){ this.buildVG(d); return }
  const ic=w.icon||(w.source==="gift"&&w.giftEmoji)||SG_ICONS[w.source]||"🎯";
  this.el.innerHTML=`<div class="sg-in"><span class="swp"><i></i></span><div class="sg-ic">${esc(ic)}</div><div class="sg-body"><div class="sg-top"><span class="sg-tt tx">${esc(w.title||"")}</span><span class="sg-pc"></span></div><div class="sg-bar"><i></i><span class="sg-gl"></span></div><div class="sg-vl tx"></div></div><svg class="sg-ring" viewBox="0 0 100 100"><circle class="trk" cx="50" cy="50" r="44"/><circle class="prg" cx="50" cy="50" r="44" pathLength="100"/></svg></div><div class="fxl"></div>`+ed;
  this.q={bar:this.el.querySelector(".sg-bar i"),pc:this.el.querySelector(".sg-pc"),vl:this.el.querySelector(".sg-vl"),prg:this.el.querySelector(".prg"),fx:this.el.querySelector(".fxl")};
 },
 layoutRows(){
  const P=this.pg; if(!P||!this.rows||!this.slotOf) return; const N=Math.max(1,this.w.topN), sl=this.lbSlotsOf(N,P);
  for(const [k,el] of this.rowEls){ const i=this.slotOf.get(k); if(i==null) continue; this.place(el,sl[i],i) }
 },
 lbSlotsOf(N,P){ if(this.lbArt) return lbArtSlots(this.lbArt.arr,N,P.W,P.H,P.g); if(!this.lbBars) return lbSlots(N,P.W,P.H,P.g); const sl=lbBarSlots(N,P.W,P.H,P.g); if(sl[0]) this.el.style.setProperty("--rh0",sl[0].h+"px"); return sl },
 place(el,s,i){
  const w=this.w, as=(w.avatarScale||1)*(this.lbAvs||1), fsx=w.fontScale||1;
  el.style.transform=`translate(${s.x}px,${s.y}px)`; el.style.width=s.w+"px"; el.style.height=s.h+"px";
  let av,fs; if(s.k==="tok"){ av=s.w*.74*as*(i===0?(+w.firstScale||1):1); fs=Math.min(s.w*.14,s.h*.1)*fsx } else if(this.lbBars){ av=s.h*.74*as; fs=s.h*.42*fsx } else if(s.k==="row"){ av=s.h*.84*as; fs=Math.min(s.h*.36,s.w*.06)*fsx } else if(s.k==="hero"){ av=Math.min(s.w*.4,s.h*.48)*as; fs=Math.min(s.w*.075,s.h*.08)*fsx } else { av=Math.min(s.w*.66,s.h*.46)*as; fs=Math.min(s.w*.12,s.h*.08)*fsx }
  el.style.setProperty("--av",av+"px"); el.style.setProperty("--fs",fs+"px"); el.style.setProperty("--rh",(s.k==="row"?s.h:fs*2.6)+"px");
  const k="k-"+s.k; if(!el.classList.contains(k)){ el.classList.remove("k-row","k-pod","k-hero","k-tok"); el.classList.add(k) }
 },
 refreshPro(src,silent){
  if(this.w.type==="sgoal") return this.refreshSG(src,silent);
  const w=this.w, P=this.pg, box=this.rows; if(!box||!P) return;
  const N=Math.max(1,w.topN), list=lbEntries(w,src), sl=this.lbSlotsOf(N,P);
  const fx=!this.el.classList.contains("no-fx")&&!lbReduced(), lite=this.el.classList.contains("lb-lite");
  const icon=lbIcon(w), fmtV=v=>w.numFmt==="short"&&w.source!=="donations"?lbCompact(v):lbFmt(w,v,src), keep=new Set(); this.slotOf=new Map();
  for(let i=0;i<N;i++){
   const it=list[i]?{...list[i]}:{k:"__e"+i,name:"بانتظار…",v:0,emp:true}; const rank=i+1;
   let el=this.rowEls.get(it.k), fresh=false;
   if(!el){ fresh=true; el=document.createElement("div"); el.dataset.k=it.k;
    el.innerHTML=`<div class="lr-card"><span class="swp"><i></i></span></div><span class="lr-rk"></span><span class="lr-av"><span class="halo">${this.lbHalo}</span><img alt=""><i class="crw">${CROWN_SVG}</i><i class="d1">${this.lbD1||""}</i></span><span class="lr-nm"></span><span class="lr-vl"><b></b><span class="ic"></span></span>`;
    box.appendChild(el); this.rowEls.set(it.k,el); el.dataset.v="0" }
   el.className=`lr r${rank}${rank>5?" rx":""}${it.emp?" emp":""}${el.classList.contains("k-row")?" k-row":el.classList.contains("k-pod")?" k-pod":el.classList.contains("k-hero")?" k-hero":el.classList.contains("k-tok")?" k-tok":""}`;
   el.style.setProperty("--rc",`var(--rc${Math.min(5,rank)})`); el.style.setProperty("--d",(i*.35)+"s");
   const old=el.style.transform; this.place(el,sl[i],i);
   if(fx&&!silent&&!fresh&&old&&old!==el.style.transform){ el.classList.add("moving"); clearTimeout(el._mv); el._mv=setTimeout(()=>el.classList.remove("moving"),700) }
   if(fresh&&!silent&&!it.emp&&fx){ el.animate([{opacity:0,transform:el.style.transform+" scale(.85)"},{opacity:1,transform:el.style.transform}],{duration:450,easing:"cubic-bezier(.2,.8,.2,1)"}) }
   const medal=this.lbBars&&w.medals!==false&&rank<=3&&!it.emp; el.querySelector(".lr-rk").textContent=medal?["🥇","🥈","🥉"][rank-1]:rank; el.classList.toggle("medal",medal);
   const img=el.querySelector("img"), s2=it.emp?avatar("؟"):(it.av||avatar(it.name)); if(img.getAttribute("src")!==s2) img.src=s2;
   const nm=el.querySelector(".lr-nm"); if(nm.textContent!==it.name) nm.textContent=it.name;
   const ic=el.querySelector(".ic"); if(this.lbBars&&!w.icon&&LB_BAR_ICONS[w.source||"gifts"]){ if(ic.dataset.s!==(w.source||"gifts")){ ic.innerHTML=LB_BAR_ICONS[w.source||"gifts"]; ic.dataset.s=w.source||"gifts" } } else if(ic.textContent!==icon){ ic.textContent=icon; ic.dataset.s="" }
   const b=el.querySelector(".lr-vl b"), prev=+el.dataset.v||0;
   if(it.emp) b.textContent="—"; else countTo(b,silent?it.v:prev,it.v,fmtV,fx&&!lite&&!silent?700:0);
   if(!it.emp&&it.v>prev&&prev>0&&fx&&!silent){ el.classList.remove("pulse"); void el.offsetWidth; el.classList.add("pulse") }
   el.dataset.v=it.v; this.slotOf.set(it.k,i); keep.add(it.k);
  }
  for(const [k,el] of this.rowEls) if(!keep.has(k)){ this.rowEls.delete(k); if(fx&&!silent&&!k.startsWith("__e")){ const a=el.animate([{opacity:1},{opacity:0}],{duration:300}); a.onfinish=()=>el.remove() } else el.remove() }
  const lead=list[0]?list[0].k:null;
  if(lead&&this.leader!==null&&lead!==this.leader&&fx&&!silent){ const el=this.rowEls.get(lead); if(el){ el.classList.remove("newtop"); void el.offsetWidth; el.classList.add("newtop"); setTimeout(()=>el.classList.remove("newtop"),1800); this.celebrate() } }
  this.leader=lead;
  if(this.lbArt&&this.lbArt.arr==="rotate"){ const order=[...this.rowEls.entries()].filter(([k])=>!k.startsWith("__e")).sort((a,b)=>this.slotOf.get(a[0])-this.slotOf.get(b[0])).map(x=>x[1]); const all=[...this.rowEls.values()];
   const show=i=>{ all.forEach(x=>x.classList.remove("cur")); const el=(order.length?order:all)[i%Math.max(1,(order.length?order:all).length)]; if(el) el.classList.add("cur") };
   if(!this.rotT){ this.rotI=0; show(0); this.rotT=setInterval(()=>{ if(!this.el.isConnected){ clearInterval(this.rotT); return } this.rotI=(this.rotI||0)+1; const o=[...this.rowEls.entries()].filter(([k])=>!k.startsWith("__e")).sort((a,b)=>this.slotOf.get(a[0])-this.slotOf.get(b[0])).map(x=>x[1]); all.length=0; all.push(...this.rowEls.values()); order.length=0; order.push(...o); show(this.rotI) },(+w.rotSec||4)*1000/(w.animSpeed||1)) }
   else if(!this.el.querySelector(".lr.cur")) show(this.rotI||0) }
 },
 celebrate(){ const L=this.el.querySelector(".fxl"); if(!L||this.el.classList.contains("lb-lite")) return; const s=this.slotOf&&this.rowEls; const top=[...this.rowEls.values()].find(x=>x.classList.contains("r1")); if(!top) return;
  const r=top.getBoundingClientRect(), b=this.el.getBoundingClientRect(), sc=(b.width/(this.el.offsetWidth||1))||1;
  const cx=(r.left-b.left+r.width/2)/sc, cy=(r.top-b.top+r.height*.3)/sc;
  if(this.lbArt){ if(this.w.fx1===false) return; const av=parseFloat(top.style.getPropertyValue("--av"))||60, ia=top.querySelector(".lr-av").getBoundingClientRect(); lbCelebrateArt(L,this.w.cel1||this.lbArt.cel,(ia.left-b.left+ia.width/2)/sc,(ia.top-b.top+ia.height/2)/sc,av); return }
  for(let i=0;i<14;i++){ const p=document.createElement("i"); p.className="lb-spark"; p.style.left=cx+"px"; p.style.top=cy+"px"; L.appendChild(p); const a=Math.PI*2*i/14, dist=40+Math.random()*60;
   p.animate([{transform:"translate(-50%,-50%) scale(1)",opacity:1},{transform:`translate(calc(-50% + ${Math.cos(a)*dist}px),calc(-50% + ${Math.sin(a)*dist}px)) scale(.3)`,opacity:0}],{duration:900+Math.random()*400,easing:"cubic-bezier(.2,.8,.2,1)"}).onfinish=()=>p.remove() } },
 refreshSG(src,silent,ev){
  if(this.vg) return this.refreshVG(src,silent,ev);
  const q=this.q, w=this.w; if(!q) return; const g=sgProgress(w,src);
  if(this.el.classList.contains("sgs-vertical")){ q.bar.style.height=g.pct+"%"; q.bar.style.width="" } else { q.bar.style.width=g.pct+"%"; q.bar.style.height="" } q.prg.style.strokeDasharray=`${g.pct} 100`;
  q.pc.textContent=(g.levels?`المستوى \u2066${g.level}/${g.levels}\u2069 · `:"")+(w.showPct===false?"":`\u2066${Math.floor(g.pct)}%\u2069`);
  if(g.levels&&this.sgLv!=null&&g.level>this.sgLv&&!silent&&!this.el.classList.contains("no-fx")){ this.el.classList.remove("celeb"); void this.el.offsetWidth; this.el.classList.add("celeb","lvup"); setTimeout(()=>this.el.classList.remove("celeb","lvup"),2200) } this.sgLv=g.level??null;
  const fx=!this.el.classList.contains("no-fx")&&!lbReduced(), prev=this.sgPrev??g.cur;
  const f=v=>`${sgFmt(w,Math.min(v,g.tgt),src)} / ${sgFmt(w,g.tgt,src)}`;
  countTo(q.vl,silent?g.cur:prev,g.cur,f,fx&&!silent?600:0); this.sgPrev=g.cur;
  this.el.classList.toggle("done",g.done);
  if(g.done&&this.sgDone===false&&fx){ this.el.classList.remove("celeb"); void this.el.offsetWidth; this.el.classList.add("celeb"); setTimeout(()=>this.el.classList.remove("celeb"),2200) }
  this.sgDone=g.done;
 },
});
