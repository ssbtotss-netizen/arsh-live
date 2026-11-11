// ====== رسم العناصر: نفس الكود في المحرر والمعاينة وروابط OBS ======
import { LE_KINDS } from "./latest.js";
import { TYPES, DESIGNS, CLOCK_DESIGNS, SVG, clamp, fmt, esc, avatar } from "./defs.js";
import { entries, SCOPE_OF } from "./leaderboard.js";
import { remaining, timerValue, fmtClock, fmtDelta, HOUR } from "./clock.js";
import { SOCIAL_DESIGNS, ENTRANCES, EXITS, EXIT_OF, SWEEP_COLORS, SWEEP_DEFAULTS, accountView, rotationState, designOf, socialDesignCSS } from "./socials.js";
import { proAffects } from "./lb.js";
import { donorTotals, recentDonations, goalProgress, fmtMoney, displayName, tierFor, alertText, defaultDonCfg } from "./donations.js";

const ICON={likes:SVG.heart,gifts:SVG.gem,recentGifts:SVG.gem,comments:SVG.chat,
 money:'<svg viewBox="0 0 24 24"><rect x="1" y="5" width="22" height="14" rx="3" fill="#22c55e"/><circle cx="12" cy="12" r="4" fill="#bbf7d0"/></svg>',
 interact:'<svg viewBox="0 0 24 24"><path fill="#fde047" d="M13 1 3 14h7l-1 9 11-14h-7z"/></svg>',
 recentFollows:'<svg viewBox="0 0 24 24"><path fill="#86efac" d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z"/></svg>'};
const WING='<svg viewBox="0 0 120 60"><path fill="currentColor" d="M118 30C95 4 50 0 2 6c20 6 34 10 44 16-16-2-30 0-42 4 18 2 32 6 42 12-12 0-24 2-34 8 30 2 66 0 106-16z"/></svg>';

/** هل الرسالة تخص هذا العنصر؟ كل عنصر يستقبل نوع أحداثه فقط */
export function affects(w,ev){
 if(TYPES[w.type]?.pro) return proAffects(w,ev);
 const lis=TYPES[w.type]?.listens||[];
 if(ev.type==="reset") return (ev.scope||"all")==="all"||(SCOPE_OF[ev.scope]||[]).includes(w.type)||(w.type==="goal"&&ev.scope==="likes");
 if(ev.type==="shuffle") return (SCOPE_OF[ev.scope]||[]).includes(w.type);
 return lis.includes(ev.type);
}
let actx=null;
function chime(){ try{ actx=actx||new (window.AudioContext||window.webkitAudioContext)(); const t=actx.currentTime;
 [880,1320,1760].forEach((f,i)=>{ const o=actx.createOscillator(), g=actx.createGain(); o.type="sine"; o.frequency.value=f; g.gain.setValueAtTime(0,t+i*.09); g.gain.linearRampToValueAtTime(.18,t+i*.09+.02); g.gain.exponentialRampToValueAtTime(.001,t+i*.09+.5); o.connect(g).connect(actx.destination); o.start(t+i*.09); o.stop(t+i*.09+.55) }) }catch(e){} }

const CHIP_TYPES=new Set(["donTicker","donLatest","donAlert"]);
let cssDone=false;
/** يحقن CSS التصاميم الخمسين مرة واحدة في الصفحة */
function ensureCSS(){ if(cssDone||typeof document==="undefined") return; cssDone=true; const st=document.createElement("style"); st.id="b6o6-social-designs"; st.textContent=socialDesignCSS(); document.head.appendChild(st) }
const reduced=()=>{ try{ return matchMedia("(prefers-reduced-motion: reduce)").matches }catch(e){ return false } };
export class View{
 constructor(w,cv,opts={}){this.opts=opts;this.el=document.createElement("div");this.leader=null;this.sig="";this.cv=cv;this.apply(w,true)}
 apply(w){
  this.w=w; const cv=this.cv, e=this.el, T=TYPES[w.type]||TYPES.likes;
  const ckLike=T.clock||w.type==="donGoal", chipLike=T.soc||CHIP_TYPES.has(w.type);
  const d=ckLike?(CLOCK_DESIGNS.find(x=>x.id===w.design)||CLOCK_DESIGNS[0]):chipLike?designOf(w.design):(DESIGNS.find(x=>x.id===w.design)||DESIGNS[0]);
  const W=w.w*cv.w, Hh=w.h*cv.h;
  Object.assign(e.style,{left:w.x*cv.w+"px",top:w.y*cv.h+"px",width:W+"px",height:Hh+"px",zIndex:w.z,opacity:w.opacity});
  e.style.rotate=w.rot?(+w.rot)+"deg":"";
  e.dataset.id=w.id;
  const fx=w.effects&&(this.opts.globalFx!==false);
  const shape=ckLike?"ck-"+d.shape+(w.type==="donGoal"?" dgoal":""):chipLike?"so-"+(w.type==="donTicker"?"socialBar":w.type==="donLatest"||w.type==="donAlert"?"social "+w.type:w.type):T.board?"sh-"+d.shape:"sh-single";
  e.className=`wd ${ckLike?"ck":chipLike?"sw":"ds"}-${d.id} ${shape} t-${w.type} an-${w.anim} f-${w.font||"default"}${fx?"":" no-fx"}${this.opts.editor?(" "+(w.locked?"locked":"")+(w.visible?"":" hid")+(this.opts.sel===w.id?" sel":"")):""}`;
  if(!this.opts.editor) e.style.display=w.visible?"":"none";
  if(w.acc) e.style.setProperty("--acc",w.acc); else e.style.removeProperty("--acc");
  e.style.setProperty("--tx2",w.tx||"#fff");
  const gap=w.gap*(this.opts.refW||cv.w)/1080, pad=gap*1.1, N=Math.max(1,w.topN);
  const S=e.style, set=(k,v)=>S.setProperty(k,v+"px");
  set("--gap",gap);set("--pad",pad);
  if(T.pro){ this.applyPro(w,W,Hh,pad,gap); return }
  if(T.rules){ this.applyRules(w,W,Hh,pad,gap); return }
  if(T.bot){ this.applyBot(w,W,Hh,pad,gap); return }
  if(T.fc){ this.applyFc(w,W,Hh,pad,gap); return }
  if(T.fa){ this.applyFa(w,W,Hh); return }
  if(T.abox){ this.applyAbox(w,W,Hh); return }
  if(T.le){ this.applyLe(w,W,Hh); return }
  if(T.chat){ this.applyChat(w,W,Hh); return }
  if(T.np){ this.applyNp(w,W,Hh); return }
  if(T.act){ this.applyAct(w,W,Hh); return }
  if(T.dt){ this.applyDt(w,W,Hh); return }
  if(ckLike){ this.layoutClock(d.shape,W,Hh,pad,w); if(w.type==="donGoal"){ const c=parseFloat(S.getPropertyValue("--cfs")); S.setProperty("--cfs",c*(d.shape==="ring"?.5:.6)+"px"); if(d.shape==="digital") S.setProperty("--sub",Math.max(parseFloat(S.getPropertyValue("--sub"))||0,Hh*.14)+"px") } }
  else if(chipLike&&!T.soc){ this.dsg=d; set("--sh",Math.max(10,w.type==="donTicker"?Hh-pad*2:Hh)); S.setProperty("--ls","1"); }
  else if(T.soc){ this.dsg=d; const n=Math.max(1,this.socCount||1), cols=Math.max(1,w.cols||1);
   const sh=w.type==="socialPanel"?(Hh-pad*2-gap*(Math.ceil(n/cols)-1))/Math.ceil(n/cols):w.type==="socialBar"?Hh-pad*2:Hh;
   set("--sh",Math.max(10,sh)); S.setProperty("--ls",String(w.logoScale||1)); S.setProperty("--ems",(w.enterMs||700)+"ms") }
  else if(!T.board){ set("--tth",0); set("--bfs",Math.min(Hh*.5,W*.12)*w.fontScale) }
  else {
   const tth=w.showTitle?clamp(Math.min(Hh*.13,W*.12),22,150)*Math.sqrt(w.fontScale):0;
   const ih=Hh-pad*2-tth-(tth?gap:0), iw=W-pad*2; set("--tth",tth);
   let rh,fs,av; const sh=d.shape==="pod"&&N<3?"list":d.shape;
   if(sh==="list"){ rh=(ih-gap*(N-1))/N; fs=Math.min(rh*.34,iw*.06)*w.fontScale; av=Math.min(rh*.72,iw*.17)*w.avatarScale; }
   else if(sh==="row"){ const cw=(iw-gap*(N-1))/N; fs=Math.min(cw*.12,ih*.12)*w.fontScale; av=Math.min(cw*.62,ih*.5)*w.avatarScale; rh=ih; }
   else if(sh==="grid"){ const cols=N<=3?N:N<=6?3:N<=10?5:5, rows=Math.ceil(N/cols); const cw=(iw-gap*(cols-1))/cols, ch=(ih-gap*(rows-1))/rows; set("--cw",cw);set("--ch",ch); fs=Math.min(cw*.12,ch*.12)*w.fontScale; av=Math.min(cw*.6,ch*.52)*w.avatarScale; rh=ch; }
   else if(sh==="pod"){ const ph=N>3?ih*(N>10?.45:.62):ih; const restN=Math.max(0,N-3); rh=restN?(ih-ph-gap*restN)/restN:ph/4; const cw=(iw-gap*2)/3; set("--ph",ph); fs=Math.min(N>3?rh*.36:ph*.08,cw*.11)*w.fontScale; set("--pav",Math.min(cw*.62,ph*.34)*w.avatarScale); av=rh*.72*w.avatarScale; }
   if(sh!==d.shape) e.classList.replace("sh-"+d.shape,"sh-"+sh);
   set("--rh",rh);set("--fs",fs);set("--av",av);
  }
  const sig=[d.id,w.type,N,w.showTitle,w.title,w.showSub,w.timerId,w.mode,w.accountId,w.filter,w.showLogo,w.showPlatform,w.showUser,w.cols,w.dir].join("|");
  if(sig!==this.sig){ this.sig=sig; this.build(d) }
  if(this.opts.data) this.refresh(this.opts.data(),true);
 }
 layoutClock(shape,W,Hh,pad,w){
  const set=(k,v)=>this.el.style.setProperty(k,v+"px"), fsx=w.fontScale, iw=W-pad*2, ih=Hh-pad*2;
  let cfs,tth=0,sub=0;
  if(shape==="digital"){ tth=w.showTitle?ih*.24:0; sub=w.showSub?ih*.17:0; cfs=Math.min((ih-tth-sub)*.82,iw/5.4) }
  else if(shape==="bar"){ tth=w.showTitle?ih*.3:0; cfs=Math.min(ih*.42,iw/9); sub=ih*.2 }
  else if(shape==="ring"){ const r=Math.min(iw,ih); set("--ring",r); cfs=r*.17; tth=r*.085; sub=r*.07 }
  else if(shape==="mini"){ cfs=Math.min(ih*.6,iw/8.5); tth=cfs*.62 }
  else if(shape==="vertical"){ cfs=Math.min(ih/4.6,iw*.38); tth=w.showTitle?cfs*.42:0; sub=w.showSub?cfs*.32:0 }
  set("--cfs",cfs*fsx);set("--tth",tth*Math.sqrt(fsx));set("--sub",sub*Math.sqrt(fsx));
 }
 build(d){
  const w=this.w,t=TYPES[w.type]||TYPES.likes, ed=this.opts.editor?'<div class="rh"></div><div class="lockb">🔒</div>':"";
  if(CHIP_TYPES.has(w.type)){ this.el.innerHTML=`<div class="in soc"><div class="scs"></div></div><div class="fxl"></div>`+ed; this.scs=this.el.querySelector(".scs"); this.cur=null; this.curKey=undefined; this.socSig=""; this.queue=[]; this.busy=false; return }
  if(t.soc){ this.el.innerHTML=`<div class="in soc"><div class="scs"></div></div>`+ed; this.scs=this.el.querySelector(".scs"); this.cur=null; this.curKey=undefined; this.socSig=""; return }
  if(t.clock||w.type==="donGoal"){
   const deco=d.id==="wings"?`<span class="wg l">${WING}</span><span class="wg r">${WING}</span>`:d.id==="crown"||d.id==="vip"||d.id==="royal"||d.id==="b6o6"?`<span class="ckc">${SVG.crown.replace('class="crown"','')}</span>`:d.id==="bolt"?'<span class="blt l">⚡</span><span class="blt r">⚡</span>':"";
   this.el.innerHTML=`<div class="in ck">${deco}<div class="ck-t tx"></div><div class="ck-face"><svg class="ck-ring" viewBox="0 0 100 100"><circle class="trk" cx="50" cy="50" r="45"/><circle class="prg" cx="50" cy="50" r="45" pathLength="100"/></svg><div class="ck-time tx">00:00:00</div><div class="ck-vert tx"><b>00</b><b>00</b><b>00</b></div></div><div class="ck-bar"><i></i></div><div class="ck-sub tx"></div></div><div class="fxl"></div>`+ed;
   this.q={t:this.el.querySelector(".ck-t"),time:this.el.querySelector(".ck-time"),vert:this.el.querySelectorAll(".ck-vert b"),bar:this.el.querySelector(".ck-bar i"),prg:this.el.querySelector(".prg"),sub:this.el.querySelector(".ck-sub"),fx:this.el.querySelector(".fxl")};
   this.lastTxt=""; return;
  }
  const ic=ICON[w.type]||SVG.chat;
  this.el.innerHTML=`<div class="in">${t.board&&w.showTitle?`<div class="wt"><span class="tx">${esc(w.title)}</span>${w.design==="royal"||w.design==="podium"||w.design==="b6o6"?SVG.crown.replace('class="crown"',''):ic}</div>`:""}${t.board?'<div class="rows"></div>':`<div class="goal"><div class="gtx tx"><span class="gt">${esc(w.title)}</span><span class="gv">0 / 0</span></div><div class="gbar"><i style="width:0%"></i></div></div>`}</div>`+ed;
  this.rows=this.el.querySelector(".rows"); this.leader=null;
 }
 refresh(src,silent){
  const w=this.w, t=TYPES[w.type]||TYPES.likes;
  if(t.pro) return this.refreshPro(src,silent);
  if(t.rules) return this.refreshRules(src,silent);
  if(t.bot) return;
  if(t.abox) return;
  if(t.fc) return this.refreshFc(src,silent);
  if(t.le) return this.refreshLe(src,silent);
  if(t.chat) return;
  if(t.np) return this.refreshNp(src);
  if(t.act||t.fa) return;
  if(t.dt) return this.refreshDt(src,silent);
  if(t.clock) return this.refreshClock(src);
  if(w.type==="donGoal") return this.refreshGoal(src,silent);
  if(CHIP_TYPES.has(w.type)) return this.refreshDonChip(src);
  if(t.soc) return this.refreshSoc(src);
  if(w.type==="goal"){ const v=src.D.tot.likes, g=Math.max(1,w.target); this.el.querySelector(".gv").textContent=`${fmt(Math.min(v,g))} / ${fmt(g)}`; this.el.querySelector(".gbar i").style.width=clamp(v/g*100,0,100)+"%"; return }
  const DC=src.DC||defaultDonCfg();
  const list=src.preview||(t.don?donorTotals(src.DN||{list:[]},DC,{period:w.period,currency:w.currency||DC.currency,now:Date.now()+(src.skew||0),hideAnon:w.hideAnon}).slice(0,w.topN):entries(w,src.D,src.H));
  const ic=t.don?ICON.money:(ICON[w.type]||SVG.chat);
  const items=[]; for(let i=0;i<w.topN;i++){ items.push(list[i]?{...list[i],rank:i+1}:{k:"__e"+i,name:"بانتظار…",av:avatar("؟"),v:0,rank:i+1,emp:true}) }
  const box=this.rows; const scale=(box.getBoundingClientRect().width/(box.offsetWidth||1))||1;
  const first=new Map(); for(const el of box.children) first.set(el.dataset.k,el.getBoundingClientRect());
  const keep=new Set(); const fx=!this.el.classList.contains("no-fx");
  const valTxt=it=>it.emp?"—":w.type==="recentFollows"?ago(it.t):t.don?fmtMoney(it.v,w.currency||DC.currency):fmt(it.v);
  items.forEach((it,i)=>{
   let el=box.querySelector(`[data-k="${CSS.escape(it.k)}"]`);
   if(!el){ el=document.createElement("div"); el.dataset.k=it.k; el.innerHTML=`<span class="rk"><span></span></span><span class="av"><img alt="">${SVG.crown}</span><span class="nm"></span><span class="vl"><b></b>${ic}</span><span class="sb"></span><span class="step"></span>`; if(!silent&&!it.emp) el.classList.add("enter"); el.addEventListener("animationend",ev=>{if(ev.target===el)el.classList.remove("enter","crowned","bump")}) }
   const prevV=+el.dataset.v||0;
   el.className=`r r${it.rank}${it.emp?" emp":""}${t.recent?" rc":""}${el.classList.contains("enter")?" enter":""}`;
   el.querySelector(".rk span").textContent=it.rank; el.querySelector(".step").textContent=it.rank;
   const img=el.querySelector("img"); const src2=it.av||avatar(it.name); if(img.getAttribute("src")!==src2) img.src=src2;
   el.querySelector(".nm").textContent=it.name; el.querySelector(".vl b").textContent=valTxt(it);
   if(!it.emp&&it.v>prevV&&prevV>0&&fx){el.classList.add("bump")}
   el.dataset.v=it.v;
   if(box.children[i]!==el) box.insertBefore(el,box.children[i]||null);
   keep.add(it.k);
  });
  for(const el of [...box.children]) if(!keep.has(el.dataset.k)) el.remove();
  if(fx&&!silent) for(const el of box.children){ const f=first.get(el.dataset.k); if(!f) continue; const l=el.getBoundingClientRect(); const dx=(f.left-l.left)/scale, dy=(f.top-l.top)/scale; if(Math.abs(dx)+Math.abs(dy)>1) el.animate([{transform:`translate(${dx}px,${dy}px)`},{transform:"none"}],{duration:600,easing:"cubic-bezier(.2,.8,.2,1)"}) }
  const lead=items[0]&&!items[0].emp&&!t.recent?items[0].k:null;
  if(lead&&lead!==this.leader&&this.leader!==null&&fx&&!silent){ box.firstElementChild.classList.add("crowned") }
  this.leader=lead;
 }
 refreshClock(src){
  const w=this.w, q=this.q, C=src.C; if(!q||!C) return;
  const now=Date.now()+(src.skew||0);
  let ms=0, prog=0, title=w.title, sub="", hours=true, ended=false;
  if(w.type==="subathon"){ const s=C.subathon; ms=remaining(s,now); prog=ms/Math.max(1,s.initialMs+s.totalAddedMs); title=w.title||s.name;
   sub=s.status==="running"?"ينتهي "+new Date(s.endsAt).toLocaleTimeString("ar-SA-u-nu-latn",{hour:"numeric",minute:"2-digit"}):s.status==="paused"?(s.autoPaused?"متوقف (انقطع البث)":"متوقف مؤقتاً"):s.status==="ended"?"انتهى السبثون":"لم يبدأ بعد";
   ended=s.status==="ended" }
  else { const tm=C.timers.find(x=>x.id===w.timerId)||C.timers[0]; if(!tm) return; ms=timerValue(tm,now); title=w.title&&w.title!==TYPES.timer.title?w.title:(tm.prefix||tm.name);
   prog=tm.dir==="up"?(ms%HOUR)/HOUR:ms/Math.max(1,tm.durationMs); hours=tm.dir==="up"||tm.durationMs>=HOUR||ms>=HOUR;
   sub=tm.status==="ended"?tm.endText:tm.status==="paused"?"متوقف":tm.status==="idle"?"جاهز":""; ended=tm.status==="ended" }
  const txt=fmtClock(ms,hours);
  if(txt!==this.lastTxt){ this.lastTxt=txt; q.time.textContent=txt; const p=txt.split(":"); if(p.length===2) p.unshift("00"); q.vert.forEach((b,i)=>b.textContent=p[i]) }
  if(q.t.textContent!==title) q.t.textContent=title;
  if(q.sub.textContent!==sub) q.sub.textContent=sub;
  const pc=clamp(prog*100,0,100); q.bar.style.width=pc+"%"; q.prg.style.strokeDasharray=`${pc} 100`;
  this.el.classList.toggle("ended",ended); this.el.classList.toggle("low",w.type==="subathon"&&!ended&&ms<60000&&ms>0);
 }
 // ---------- الدونيشن ----------
 refreshGoal(src,silent){ const q=this.q; if(!q) return; const DC=src.DC||defaultDonCfg(), w=this.w;
  const g=(DC.goals||[]).find(x=>x.id===w.goalId)||(DC.goals||[])[0]; if(!g){ q.t.textContent="أضف هدفاً"; return }
  const p=goalProgress(g,src.DN||{list:[]},Date.now()+(src.skew||0),DC.fx);
  const fxOn=!this.el.classList.contains("no-fx")&&g.anim!==false&&!silent, prev=this.lastGoal, inc=prev!==undefined&&p.current>prev;
  const show=v=>`${fmtMoney(v,g.currency)} / ${fmtMoney(p.target,g.currency)}`;
  // عدّ تدريجي للمبلغ + لمعة تمر على الشريط + نجوم للدعم الكبير — بدون إعادة حركة دخول العنصر
  if(inc&&fxOn){ cancelAnimationFrame(this.goalRaf); const from=prev, to=p.current, t0=performance.now(), D=900;
   const step=t=>{ const k=Math.min(1,(t-t0)/D), e=1-Math.pow(1-k,3); q.time.textContent=show(Math.round((from+(to-from)*e)*100)/100); if(k<1) this.goalRaf=requestAnimationFrame(step) }; this.goalRaf=requestAnimationFrame(step);
   this.el.classList.remove("pulse","gshine"); void this.el.offsetWidth; this.el.classList.add("pulse","gshine");
   if(to-from>=p.target*.2) this.goalStars(); }
  else q.time.textContent=show(p.current);
  this.lastGoal=p.current;
  q.t.textContent=(w.title&&w.title!==TYPES.donGoal.title?w.title:"🎯 "+g.name)+(g.paused?" (متوقف)":"");
  q.sub.textContent=p.reached?(p.over>0&&g.showOver!==false?`✓ تم تحقيق الهدف! +${fmtMoney(p.over,g.currency)} فوق الهدف`:"✓ تم تحقيق الهدف!"):`${Math.floor(p.pct)}% · المتبقي ${fmtMoney(p.remaining,g.currency)}`;
  q.bar.style.width=p.pct+"%"; q.prg.style.strokeDasharray=`${p.pct} 100`; this.el.style.setProperty("--gp",(p.pct/100).toFixed(4)); this.el.classList.toggle("ended",false);
  this.el.dataset.goal=p.current; this.el.dataset.pct=Math.floor(p.pct);
  if(p.reached&&this.goalReached===false&&!silent&&g.celebrate!==false) this.burst({user:{name:"🎉"},gift:"تم تحقيق الهدف",value:p.target,goal:g});
  this.goalReached=p.reached }
 goalStars(){ const box=document.createElement("div"); box.className="g-stars"; let h=""; for(let i=0;i<14;i++) h+=`<i style="left:${Math.random()*100}%;top:${20+Math.random()*60}%;animation-delay:${(Math.random()*.4).toFixed(2)}s">✦</i>`; box.innerHTML=h; this.el.appendChild(box); setTimeout(()=>box.remove(),1600) }
 donChip(d,DC,label,mainText){ const ds=this.dsg||SOCIAL_DESIGNS[0], tr=tierFor(DC,d.amount), w=this.w;
  const name=displayName(d,DC), av=(!d.anonymous&&d.avatar)?`<span class="av2"><img src="${esc(d.avatar)}" alt=""></span>`:"";
  ensureCSS(); const dd=designOf(ds.id);
  return `<div class="sc dn tier-${esc(tr.fx)}" data-don="${esc(d.id)}" style="--pc:#22c55e;--hh:${dd.hh}"><div class="ib sd-${dd.id} ly-${dd.ly==="top"||dd.ly==="medal"||dd.ly==="badge"?"row":dd.ly}"><span class="bgx"><span class="swp"><i></i></span></span><span class="lg"><b class="emo">${esc(tr.emoji)}</b></span><span class="tx">${label?`<i class="pf">${esc(label)}</i>`:""}<b class="un">${esc(mainText||(name+" — "+fmtMoney(d.amount,d.currency)))}</b>${w.showMessage&&d.message?`<i class="tt">${esc(d.message)}</i>`:""}</span>${av}</div></div>` }
 refreshDonChip(src){ const w=this.w, DC=src.DC||defaultDonCfg(), DN=src.DN||{list:[]};
  if(w.type==="donTicker"){
   const cur=w.currency||DC.currency, hide=w.hideAnon||DC.hideAnon;
   const items=w.order==="top"?donorTotals(DN,DC,{period:w.period,currency:cur,now:Date.now()+(src.skew||0),hideAnon:hide}).slice(0,w.topN).map(r=>({id:r.k,name:r.anon?"":r.name,anonymous:r.anon,amount:r.v,currency:cur,avatar:r.av}))
     :recentDonations(DN,DC,{currency:cur,hideAnon:hide,limit:w.topN});
   const sig=JSON.stringify([items,w.design,w.speed,w.dir,w.showMessage]); if(sig===this.socSig) return; this.socSig=sig;
   const html=items.length?items.map(d=>this.donChip({...d,message:""},DC)).join(""):`<div class="sc"><div class="ib sd-minimalDark ly-row"><span class="bgx"></span><span class="tx"><b class="un">💚 كن أول داعم!</b></span></div></div>`;
   this.scs.innerHTML=`<div class="trk ${w.dir==="ltr"?"ltr":""}">${html}${html}</div>`; const trk=this.scs.firstChild;
   requestAnimationFrame(()=>{ const half=trk.scrollWidth/2||1; trk.style.animationDuration=Math.max(4,half/Math.max(10,w.speed))+"s" }); return }
  if(w.type==="donLatest"){
   const d=recentDonations(DN,DC,{currency:w.currency||"",hideAnon:w.hideAnon,limit:1})[0];
   const key=d?d.id:null; if(key===this.curKey) return; const first=this.curKey===undefined; this.curKey=key;
   const old=this.cur; this.cur=null; const fx=!this.el.classList.contains("no-fx")&&!this.opts.editor&&!first;
   if(old){ if(fx){ const a=this.play(old.el,w.exit,w.exitMs,0,true); a.onfinish=()=>old.el.remove() } else old.el.remove() }
   const n=document.createElement("div"); n.innerHTML=d?this.donChip(d,DC,w.title):`<div class="sc ghost"><div class="ib sd-${designOf((this.dsg||{}).id).id} ly-row"><span class="bgx"></span><span class="tx"><i class="pf">${esc(w.title)}</i><b class="un">بانتظار أول داعم…</b></span></div></div>`;
   const c=n.firstChild; this.scs.appendChild(c); this.cur={el:c}; if(fx) this.play(c,w.enter,w.enterMs,old?w.exitMs*.6:0); return }
  if(w.type==="donAlert"&&this.opts.editor&&!this.scs.firstChild){ const n=document.createElement("div"); n.innerHTML=this.donChip({id:"x",name:"محمد",amount:100,currency:DC.currency,message:"تنبيه تجريبي في المحرر"},DC,"تنبيه دونيشن"); this.scs.appendChild(n.firstChild) }
 }
 /** قائمة انتظار التنبيهات: تنبيه واحد في كل مرة، بدون تداخل */
 alertPush(ev,src){ const DC=src.DC||defaultDonCfg(); const A=DC.alert||{}; if((+ev.amount||0)<(+A.minAmount||0)) return;
  this.queue.push({...ev}); if(this.queue.length>50) this.queue.shift(); if(!this.busy) this.nextAlert(src) }
 nextAlert(src){ const DC=src.DC||defaultDonCfg(), A=DC.alert||{}, w=this.w; const ev=this.queue.shift(); if(!ev){ this.busy=false; return } this.busy=true;
  this.scs.innerHTML=""; const n=document.createElement("div"); n.innerHTML=this.donChip({...ev,message:A.showMessage===false?"":ev.message},DC,null,alertText(DC,ev)); const c=n.firstChild; c.classList.add("alert"); this.scs.appendChild(c);
  const fx=!this.el.classList.contains("no-fx"); if(fx){ this.play(c,w.enter,w.enterMs,0); const tr=tierFor(DC,ev.amount); if(tr.fx==="royal"||tr.fx==="legend") this.burst({user:{name:displayName(ev,DC),avatar:""},gift:tr.emoji,value:ev.amount}) }
  if(A.sound!==false&&!this.opts.mute&&!this.opts.editor) chime();
  const dur=Math.max(2,+A.durationSec||6)*1000;
  setTimeout(()=>{ const end=()=>{ c.remove(); this.nextAlert(src) }; if(fx){ const a=this.play(c,w.exit,w.exitMs,0,true); a.onfinish=end } else end() },dur) }
 // ---------- الحسابات ----------
 /** بطاقة حساب: .sc (الدخول/الخروج) ← .ib (التصميم + الحركات المستمرة) ← .bgx (الخلفية + اللمعة تحت النص) */
 chip(acc){ ensureCSS(); const w=this.w, st=(w.useAccStyle!==false&&acc.style)||{}, d=designOf(st.design||w.design), v=accountView(acc);
  const idle=[...new Set([...(st.idle&&st.idle.length?st.idle:(w.idle||[])),...(d.idle?[d.idle]:[])])].slice(0,2);
  const lp=w.logoPos&&w.logoPos!=="auto"?({start:"row",end:"end",top:"top"})[w.logoPos]:d.ly;
  const cust=[], vars=[`--isp:${w.idleSpeed||1}`,`--ist:${w.idleStrength||1}`];
  if(w.cardBg){ const a=Math.round(255*(w.cardBgOpacity??.9)).toString(16).padStart(2,"0"); vars.push(`--c-bg:${w.cardBg}${a}`); cust.push("cust-bg") }
  if(w.cardBorder){ vars.push(`--c-bd:${w.cardBorder}`,`--c-bw:${w.cardBorderW??2}px`); cust.push("cust-bd") }
  if(w.cardRadius!=null&&w.cardRadius!==""){ vars.push(`--c-rad:calc(var(--sh)*${(+w.cardRadius)/100})`); cust.push("cust-rad") }
  if(w.unColor) vars.push(`--c-un:${w.unColor}`);
  const lg=w.showLogo?`<span class="lg">${v.logo?`<img src="${esc(v.logo)}" alt="">`:`<b>${esc(v.mono)}</b>`}</span>`:"";
  const av=v.avatar&&w.showLogo?`<span class="av2"><img src="${esc(v.avatar)}" alt=""></span>`:"";
  const crown=d.fx==="crown"?`<span class="crw">${SVG.crown.replace('class="crown"','')}</span>`:"";
  return `<div class="sc k-${v.kind}" data-acc="${acc.id}" data-design="${d.id}" data-sweep="${idle.includes("sweep")?1:0}" data-enter="${esc(st.enter||"")}" data-exit="${esc(st.exit||"")}" style="--pc:${esc(v.color)};--hh:${d.hh}"><div class="ib sd-${d.id} ly-${lp}${v.dark||d.dark?" dk":""} ${idle.map(i=>"idle-"+i).join(" ")} ${cust.join(" ")}" style="${vars.join(";")}"><span class="bgx"><span class="swp"><i></i></span></span>${crown}${lg}<span class="tx">${w.showPlatform?`<i class="pf">${esc(v.platform)}</i>`:""}${w.showUser&&v.user?`<b class="un">${esc(v.user)}</b>`:""}${v.title?`<i class="tt">${esc(v.title)}</i>`:""}</span>${av}</div></div>` }
 filtered(S){ const f=this.w.filter||"all"; return (S.accounts||[]).filter(a=>a.enabled!==false&&(f==="all"||(f==="social"?a.kind==="social":a.kind==="game"))) }
 refreshSoc(src){
  const S=src.SO; if(!S||!this.scs) return; const w=this.w;
  if(w.type!=="social"){ // شريط أو لوحة "عرض جميع الحسابات": يعاد البناء فقط عند تغيّر المحتوى
   const list=this.filtered(S); const sig=JSON.stringify([list,w.design,w.showLogo,w.showPlatform,w.showUser,w.speed,w.dir,w.idle,w.cardBg,w.cardBorder,w.cardRadius,w.unColor,w.logoPos]);
   if(sig===this.socSig) return; this.socSig=sig;
   if(this.socCount!==list.length){ this.socCount=list.length; this.apply(w) }
   const html=list.map(a=>this.chip(a)).join("");
   if(w.type==="socialBar"){ this.scs.innerHTML=`<div class="trk ${w.dir==="ltr"?"ltr":""}">${html}${html}</div>`; const trk=this.scs.firstChild;
    requestAnimationFrame(()=>{ const half=trk.scrollWidth/2||1; trk.style.animationDuration=Math.max(4,half/Math.max(10,w.speed))+"s" }) }
   else { this.scs.innerHTML=html; this.scs.style.setProperty("--cols",Math.max(1,w.cols||1)); if(!this.opts.editor&&!this.el.classList.contains("no-fx")) [...this.scs.children].forEach((c,i)=>this.play(c,w.enter,w.enterMs,i*120)) }
   [...this.scs.querySelectorAll(".sc")].forEach(c=>this.startIdle(c,w.enterMs||0));
   return }
  this.socTick(src) }
 /** محرك العرض: حساب واحد فقط في كل لحظة. لا يُنشأ حساب جديد قبل انتهاء خروج الحالي */
 socTick(src){
  const S=src.SO, w=this.w, now=Date.now()+(src.skew||0), eMs=w.enterMs??600, xMs=w.exitMs??500;
  let want=null;
  if(this.fx&&now<this.fx.until){ const f=this.fx, t=now-f.at, len=f.until-f.at; want={key:"fx"+f.at,accountId:f.accountId,phase:t<eMs?"entering":t<len-xMs?"visible":"exiting",elapsed:t<eMs?t:t-(len-xMs),enterMs:eMs,exitMs:xMs} }
  else if(w.mode==="rotation"){ const r=rotationState(S,now); if(r) want={key:r.key,accountId:r.accountId,phase:r.phase,elapsed:r.elapsed,enter:r.enter,exit:r.exit,enterMs:r.enterMs,exitMs:r.exitMs} }
  else if(w.mode==="single"&&w.accountId){ if(!w.repeat) want={key:"s"+w.accountId,accountId:w.accountId,phase:"visible",elapsed:0};
   else { const show=(w.showSec||5)*1000, gap=(w.gapSec||5)*1000, cyc=eMs+show+xMs+gap, t=now%cyc, c=Math.floor(now/cyc);
    const ph=t<eMs?["entering",t]:t<eMs+show?["visible",t-eMs]:t<eMs+show+xMs?["exiting",t-eMs-show]:["waiting",0]; want={key:"s"+c,accountId:w.accountId,phase:ph[0],elapsed:ph[1],enterMs:eMs,exitMs:xMs} } }
  if(this.opts.editor&&!want&&!this.cur&&!this.leaving){ const a=(w.accountId&&S.accounts.find(x=>x.id===w.accountId))||this.filtered(S)[0]; if(a) want={key:"ed",accountId:a.id,phase:"visible",elapsed:0,ghost:w.mode==="rotation"&&!(S.rotation&&S.rotation.running)} }
  const acc=want&&S.accounts.find(a=>a.id===want.accountId);
  if(!acc) want=null;
  const fx=!this.el.classList.contains("no-fx");
  // 1) الحساب الحالي يختلف عن المطلوب → خروج أولاً (مرة واحدة)
  if(this.cur&&(!want||want.key!==this.cur.key||want.phase==="exiting"||want.phase==="waiting")&&!this.cur.exiting){
   const c=this.cur, x=c.el.dataset.exit||want&&want.key===c.key&&want.exit||c.exit||w.exit;
   c.exiting=true; this.leaving=c;
   const off=want&&want.key===c.key&&want.phase==="exiting"?want.elapsed:0;
   const done=()=>{ c.el.remove(); if(this.leaving===c) this.leaving=null; if(this.cur===c){ this.cur=null; this.doneKey=c.key } };
   if(fx&&!(want&&want.key===c.key&&want.phase==="waiting")){ const a=this.play(c.el,x,want&&want.exitMs||xMs,0,true,off); a.onfinish=done; a.oncancel=done } else done();
  }
  if(!want||this.leaving||this.cur) { if(this.cur&&want&&want.key===this.cur.key) this.updateChip(acc,want); return }
  // 2) لا يوجد حساب ظاهر → أنشئ المطلوب (إلا إذا انتهى دوره)
  if(want.phase==="exiting"||want.phase==="waiting"||want.key===this.doneKey) return;
  const n=document.createElement("div"); n.innerHTML=this.chip(acc); const c=n.firstChild; if(want.ghost) c.classList.add("ghost");
  this.scs.querySelectorAll(":scope > .sc").forEach(e=>e.remove()); // ضمان: عنصر واحد فقط
  this.scs.appendChild(c); this.cur={el:c,key:want.key,exit:c.dataset.exit||want.exit||w.exit,sig:this.chipSig(acc)};
  if(fx&&want.phase==="entering") this.play(c,c.dataset.enter||want.enter||w.enter,want.enterMs||eMs,0,false,want.elapsed);
  this.startIdle(c,want.phase==="entering"?(want.enterMs||eMs)-want.elapsed:0);
 }
 chipSig(acc){ const w=this.w; return JSON.stringify([acc,w.design,w.showLogo,w.showPlatform,w.showUser,w.idle,w.cardBg,w.cardBgOpacity,w.cardBorder,w.cardBorderW,w.cardRadius,w.unColor,w.logoPos,w.idleSpeed,w.idleStrength,w.sweep]) }
 /** تغيير التصميم أثناء العرض: يُستبدل المحتوى بدون إعادة الدورة */
 updateChip(acc,want){ const sig=this.chipSig(acc); if(sig===this.cur.sig) return; this.cur.sig=sig;
  const n=document.createElement("div"); n.innerHTML=this.chip(acc); const nc=n.firstChild; if(want&&want.ghost) nc.classList.add("ghost");
  this.cur.el.replaceWith(nc); this.cur.el=nc; this.startIdle(nc,0) }
 /** الحركات المستمرة: CSS للبسيط، و Web Animations للمعة البيضاء (اتجاه/سرعة/عرض/زاوية/قوة/تكرار/انتظار) */
 startIdle(c,delay){ if(c.dataset.sweep!=="1"||this.el.classList.contains("no-fx")||reduced()) return;
  const i=c.querySelector(".swp i"); if(!i) return; const o=Object.assign({},SWEEP_DEFAULTS,this.w.sweep||{}), col=(SWEEP_COLORS[o.color]||SWEEP_COLORS.white).c;
  const wd=Math.max(5,Math.min(60,+o.width||22)); i.style.width=wd+"%"; i.style.background=`linear-gradient(90deg,rgba(${col},0),rgba(${col},${o.strength}),rgba(${col},0))`;
  const far=100/wd*100+20, a=+o.angle||0; const from=o.dir==="ltr"?-120:far, to=o.dir==="ltr"?far:-120;
  i.getAnimations().forEach(x=>x.cancel());
  i.animate([{transform:`translateX(${from}%) skewX(${-a}deg)`,opacity:0},{opacity:1,offset:.12},{opacity:1,offset:.88},{transform:`translateX(${to}%) skewX(${-a}deg)`,opacity:0}],
   {duration:Math.max(300,+o.speedMs||1300)/(this.w.idleSpeed||1),delay:Math.max(0,delay)+200,endDelay:Math.max(0,+o.every||4)*1000,iterations:+o.repeat>0?+o.repeat:Infinity,easing:"cubic-bezier(.45,0,.25,1)"}) }
 /** تشغيل دخول/خروج. offset = المزامنة مع الروابط الأخرى عند الانضمام في منتصف الحركة */
 play(el,id,ms,delay=0,out=false,offset=0){
  let E=out?(EXITS[id]||EXITS[EXIT_OF[id]]):ENTRANCES[id]; if(!E) E=out?EXITS.fadeOut:ENTRANCES.fade;
  if(reduced()) E=out?EXITS.fadeOut:ENTRANCES.fade;
  const dur=Math.max(80,ms||600), opts={duration:dur,delay,easing:E.e,fill:out?"forwards":"backwards"};
  const main=E.parts?this.playParts(el,E.parts,opts,out):el.animate(E.k,opts);
  if(offset>0) try{ main.currentTime=Math.min(offset,dur-1) }catch(e){}
  if(E.sweep||E.trail){ const i=el.querySelector(".swp i"); if(i){ const far=100/22*100+20; i.style.width="22%"; i.style.background="linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.75),rgba(255,255,255,0))"; i.animate([{transform:`translateX(${out?-120:far}%) skewX(-18deg)`,opacity:1},{transform:`translateX(${out?far:-120}%) skewX(-18deg)`,opacity:1}],{duration:dur,delay,easing:"ease-in-out"}) } }
  return main }
 playParts(el,kind,o,out){ const q=s=>el.querySelector(s), all=[];
  const A=(t,k,extra={})=>{ if(t){ const a=t.animate(k,{...o,...extra}); all.push(a); return a } };
  const base=el.animate([{opacity:out?1:.999},{opacity:out?0:1}],{...o,easing:"linear"}); // يحدد نهاية الحركة
  if(kind==="border"){ const ib=q(".ib"); const d=document.createElement("span"); d.className="drw"; ib.appendChild(d); A(d,[{clipPath:"inset(0 100% 0 0)",opacity:1},{clipPath:"inset(0 0 0 0)",opacity:1,offset:.55},{opacity:1,offset:.8},{opacity:0}]); ["bgx","lg","tx"].forEach(c=>A(q("."+c),[{opacity:0},{opacity:0,offset:.45},{opacity:1}])); base.finished.then(()=>d.remove()).catch(()=>{}) }
  else if(kind==="logoFirst"){ A(q(".lg"),[{transform:"translateX(160%) scale(.4)",opacity:0},{transform:"none",opacity:1,offset:.55},{transform:"none",opacity:1}]); A(q(".tx"),[{opacity:0,transform:"translateX(-15%)"},{opacity:0,offset:.45},{opacity:1,transform:"none"}]); A(q(".bgx"),[{opacity:0,transform:"scaleX(.3)"},{opacity:1,transform:"none",offset:.5},{opacity:1}]) }
  else if(kind==="logoThenName"){ A(q(".lg"),[{transform:"scale(0) rotate(-90deg)",opacity:0},{transform:"none",opacity:1,offset:.45},{transform:"none"}]); A(q(".tx"),[{clipPath:"inset(0 0 0 100%)"},{clipPath:"inset(0 0 0 100%)",offset:.45},{clipPath:"inset(0 0 0 0)"}]) }
  else if(kind==="letters"){ const un=q(".un"); if(un&&!un.dataset.split){ un.dataset.split=1; const txt=un.textContent; un.textContent=""; [...txt].forEach(ch=>{ const s=document.createElement("span"); s.textContent=ch; s.style.display="inline-block"; un.appendChild(s) }) }
   const ls=un?[...un.children]:[]; ls.forEach((s,i)=>A(s,[{opacity:0,transform:"translateY(60%)"},{opacity:1,transform:"none"}],{duration:Math.max(120,o.duration*.5),delay:(o.delay||0)+i*(o.duration*.5/Math.max(1,ls.length))})); A(q(".bgx"),[{opacity:0},{opacity:1,offset:.3},{opacity:1}]); A(q(".lg"),[{opacity:0,transform:"scale(.6)"},{opacity:1,transform:"none",offset:.4},{opacity:1}]) }
  else if(kind==="frameFade"){ ["lg","tx"].forEach(c=>A(q("."+c),[{opacity:1},{opacity:0,offset:.5},{opacity:0}])); A(q(".bgx"),[{opacity:1},{opacity:1,offset:.4},{opacity:0}]) }
  else if(kind==="disassemble"){ A(q(".lg"),[{transform:"none",opacity:1},{transform:"translate(70%,-40%) rotate(35deg)",opacity:0}]); A(q(".tx"),[{transform:"none",opacity:1},{transform:"translate(-40%,30%)",opacity:0}]); A(q(".bgx"),[{transform:"none",opacity:1},{transform:"scale(.4,.1)",opacity:0}]) }
  return base }
 /** عرض حساب عند الطلب أو من إجراء: يخرج الحساب الحالي ثم يظهر المطلوب، وبعدها يكمل التناوب */
 socFx(fx){ if(this.w.type!=="social"||this.w.mode==="single") return; this.fx=fx }
 /** تأثير إضافة/خصم وقت: +5 دقائق مع صوت اختياري */
 timeFx(log){
  if(!this.q||!log.deltaMs) return;
  const fx=!this.el.classList.contains("no-fx");
  if(fx){ const b=document.createElement("div"); b.className="tfx"+(log.deltaMs<0?" neg":""); b.textContent=fmtDelta(log.deltaMs);
   if(log.deltaMs>=5*60000){ let p=""; for(let i=0;i<14;i++){const a=i/14*Math.PI*2,r=60+Math.random()*90; p+=`<i style="--c:${["#fff1c1","#e8c46a","#f472b6","#22d3ee"][i%4]};--dx:${Math.cos(a)*r}px;--dy:${Math.sin(a)*r}px"></i>`} b.innerHTML+=p }
   this.q.fx.appendChild(b); setTimeout(()=>b.remove(),2300);
   this.el.classList.remove("pulse"); void this.el.offsetWidth; this.el.classList.add("pulse") }
  if(this.w.sound&&log.deltaMs>0&&!this.opts.editor&&!this.opts.mute) chime();
 }
 burst(ev){
  if(this.el.classList.contains("no-fx")) return;
  const b=document.createElement("div"); b.className="burst";
  let parts=""; const cols=["#fff1c1","#e8c46a","#f472b6","#22d3ee","#fff"];
  for(let i=0;i<18;i++){const a=i/18*Math.PI*2, r=120+Math.random()*160; parts+=`<i style="--c:${cols[i%5]};--dx:${Math.cos(a)*r}px;--dy:${Math.sin(a)*r}px"></i>`}
  b.innerHTML=parts+(ev.goal?`<div class="bx">🎉 ${esc(ev.gift)} — ${esc(ev.goal.name)}</div>`:`<div class="bx"><img src="${ev.user.avatar||avatar(ev.user.name)}"> ${esc(ev.user.name)} — ${esc(ev.gift||"هدية")} ${SVG.gem.replace("<svg",'<svg style="height:1em"')} ${fmt(ev.value)}</div>`);
  this.el.appendChild(b); setTimeout(()=>b.remove(),2700);
 }
}
function ago(t){ const s=Math.max(0,Math.round((Date.now()-t)/1000)); return s<60?"الآن":s<3600?Math.floor(s/60)+"د":Math.floor(s/3600)+"س" }

/** موزّع الرسائل على العناصر — يستخدمه المحرر وروابط OBS والمعاينة */
// تجميع التحديثات: عدة أحداث في نفس الإطار = إعادة رسم واحدة لكل عنصر (rAF مع مهلة احتياطية 50ms للصفحات غير المرئية)
const RQ=new Map(); let rqT=0, rqF=0, rqSrc=null;
function rqFlush(){ if(rqF){ cancelAnimationFrame(rqF); rqF=0 } if(rqT){ clearTimeout(rqT); rqT=0 } const list=[...RQ]; RQ.clear(); for(const [v,src] of list) try{ v.refresh(rqSrc||src) }catch(e){} }
function queueRefresh(v,src){ if(typeof document!=="undefined"&&document.hidden){ v.refresh(src); return } RQ.set(v,src); if(rqF||rqT) return; if(typeof requestAnimationFrame==="function") rqF=requestAnimationFrame(rqFlush); rqT=setTimeout(rqFlush,50) }
export function deliver(views,msg,src){
 rqSrc=src; // التحديث المؤجل يستخدم أحدث بيانات دائماً (لا يعيد قيمة قديمة فوق رسالة أحدث)
 if(msg.t==="event"){ const ev=msg.ev; for(const v of views){ if(TYPES[v.w.type]?.fa){ v.faPush(ev); continue } if(TYPES[v.w.type]?.le){ if(LE_KINDS[v.w.kind]?.derived) v.refreshLe(src,false); else v.lePush(ev); continue } if(TYPES[v.w.type]?.chat){ v.chatPush(ev); continue } if(!affects(v.w,ev)) continue; if(v.w.type==="donAlert"){ if(ev.type==="donation") v.alertPush(ev,src); continue } if(v.vg) v.refreshVG(src,false,ev); else queueRefresh(v,src); if(ev.type==="gift"&&ev.big&&v.w.type==="gifts") v.burst(ev) } }
 else if(msg.t==="clock"){ for(const v of views){ if(TYPES[v.w.type]?.fc||TYPES[v.w.type]?.np||(TYPES[v.w.type]?.le&&LE_KINDS[v.w.kind]?.derived)){ v.refresh(src); continue } if(TYPES[v.w.type]?.rules){ v.refresh(src); for(const l of msg.logs||[]) v.ruleHit(l); continue } if(!TYPES[v.w.type]?.clock) continue; v.refresh(src); if(v.w.type==="subathon") for(const l of msg.logs||[]) if(l.deltaMs) v.timeFx(l) } }
 else if(msg.t==="snapshot"){ for(const v of views){ if(TYPES[v.w.type]?.chat){ v.chatLoad(msg.CH||[]); continue } v.refresh(src,true) } }
 else if(msg.t==="alert"&&Array.isArray(msg.items)){ for(const v of views) if(TYPES[v.w.type]?.abox) v.aboxPush(msg.items) }
 else if(msg.t==="alertctl"){ for(const v of views) if(TYPES[v.w.type]?.abox) v.aboxCtl(msg.op) }
 else if(msg.t==="act"&&Array.isArray(msg.items)){ for(const v of views) if(TYPES[v.w.type]?.act) v.actPush(msg.items) }
 else if(msg.t==="bot"&&Array.isArray(msg.items)){ for(const v of views) if(TYPES[v.w.type]?.bot) v.botPush(msg.items) }
 else if(msg.t==="fx"&&msg.fx&&msg.fx.kind==="social"){ for(const v of views) if(TYPES[v.w.type]?.soc){ v.socFx(msg.fx); v.refresh(src) } }
}
