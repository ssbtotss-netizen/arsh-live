// ====== ودجت عرض الإجراءات (صوت/فيديو/GIF/صورة/نص/احتفال) — شفاف 100% ======
import { View } from "./view.js";
import { esc } from "./defs.js";

let acCss=false;
function ensureAcCSS(){ if(acCss||typeof document==="undefined") return; acCss=true; const st=document.createElement("style"); st.id="b6o6-act"; st.textContent=AC_CSS; document.head.appendChild(st) }
const safeSrc=s=>/^(https?:|data:(image|audio|video)\/)/i.test(String(s||""))?String(s):"";

Object.assign(View.prototype,{
 applyAct(w,W,Hh){ ensureAcCSS(); const e=this.el, ed=this.opts.editor;
  e.className=`wd acw${ed?(" "+(w.locked?"locked":"")+(w.visible?"":" hid")+(this.opts.sel===w.id?" sel":"")):""}`; e.style.setProperty("--afs",Math.max(14,Math.min(W*.07,Hh*.12))*(w.fontScale||1)+"px");
  if(this.sig!=="act"){ this.sig="act"; this.acQ=[]; this.acBusy=false; e.innerHTML=`<div class="ac-stage"></div>${ed?'<div class="ac-ph">⚡ منطقة عرض الإجراءات (صور/فيديو/نص/احتفال)</div><div class="rh"></div><div class="lockb">🔒</div>':""}` } },
 /** عناصر قادمة من قواعد الإجراءات — تُعرض بالتتابع (قائمة انتظار) */
 actPush(items){ const w=this.w; for(const it of items){ if(it.kind==="goal") continue; if(it.test&&w.hideTests) continue; if(this.acQ.length<20) this.acQ.push(it) } if(!this.acBusy) this.acNext() },
 acNext(){ const it=this.acQ.shift(); if(!it){ this.acBusy=false; return } this.acBusy=true; const st=this.el.querySelector(".ac-stage"); if(!st){ this.acBusy=false; return }
  const vol=Math.max(0,Math.min(1,(+it.vol||80)/100)), src=safeSrc(it.src); let html="", audio=null;
  if(it.kind==="image"||it.kind==="gif") html=src?`<img src="${esc(src)}" alt="">`:"";
  else if(it.kind==="video") html=src?`<video src="${esc(src)}" autoplay playsinline></video>`:"";
  else if(it.kind==="celebrate") html=`<div class="ac-cel">${Array.from({length:26},(_,i)=>`<i style="--x:${(Math.cos(i*2.4)*46).toFixed(0)}vw;--y:${(Math.sin(i*1.7)*36-30).toFixed(0)}vh;--r:${i*47%360}deg;--c:${["#fde68a","#f472b6","#60a5fa","#34d399","#f87171"][i%5]};animation-delay:${(i%6)*.04}s"></i>`).join("")}</div>`;
  if(it.kind==="sound"&&src){ audio=new Audio(src); audio.volume=vol; audio.play().catch(()=>{}) }
  const box=document.createElement("div"); box.className=`ac-it k-${it.kind} p-${it.pos||"center"}`; box.innerHTML=html+(it.text?`<div class="ac-tx">${esc(it.text)}</div>`:"");
  st.appendChild(box); const v=box.querySelector("video"); if(v){ v.volume=vol; v.play().catch(()=>{ v.muted=true; v.play().catch(()=>{}) }) }
  const dur=Math.max(1,+it.dur||5)*1000; setTimeout(()=>{ box.classList.add("out"); if(audio) audio.pause(); setTimeout(()=>{ box.remove(); this.acNext() },450) },dur) },
});
const AC_CSS=`
.acw{background:none!important;pointer-events:none}
.acw .ac-stage{position:absolute;inset:0;overflow:hidden}
.acw .ac-ph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;border:2px dashed #ffffff40;border-radius:12px;color:#ffffff99;font-size:14px;padding:10px}
.acw .ac-it{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.4em;animation:ac-in .5s cubic-bezier(.2,1.3,.3,1)}
.acw .ac-it.p-top{justify-content:flex-start}.acw .ac-it.p-bottom{justify-content:flex-end}
.acw .ac-it.out{animation:ac-out .45s ease forwards}
.acw .ac-it img,.acw .ac-it video{max-width:100%;max-height:78%;object-fit:contain;filter:drop-shadow(0 6px 14px #0008)}
.acw .ac-tx{font-family:"Changa","Readex Pro",sans-serif;font-weight:900;font-size:var(--afs);color:#fff;text-align:center;text-shadow:0 0 12px #000,0 3px 6px #000c;padding:0 .4em;unicode-bidi:plaintext;max-width:100%}
.acw .k-celebrate .ac-tx{font-size:calc(var(--afs)*1.3);background:linear-gradient(90deg,#fde68a,#f472b6,#60a5fa);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:none;filter:drop-shadow(0 3px 6px #000a)}
.acw .ac-cel{position:absolute;left:50%;top:55%}
.acw .ac-cel i{position:absolute;width:12px;height:18px;border-radius:3px;background:var(--c);animation:ac-cf 1.8s cubic-bezier(.2,.7,.4,1) forwards}
@keyframes ac-cf{0%{transform:translate(0,0) rotate(0);opacity:1}100%{transform:translate(var(--x),var(--y)) rotate(calc(var(--r) + 540deg));opacity:0}}
@keyframes ac-in{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}
@keyframes ac-out{to{opacity:0;transform:scale(.9)}}
`;
