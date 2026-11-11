// ====== عنصر "ردود البوت والشكر" فوق البث (شفاف 100%) ======
import { View } from "./view.js";
import { esc, avatar } from "./defs.js";
export const BOTBOX_DESIGNS=[{id:"b6o6Bot",name:"B6O6 Signature"},{id:"glassBot",name:"Glass Chat"},{id:"neonBot",name:"Neon Chat"}];
export const BOT_KIND_LABEL={cmd:"⌨️",reply:"💬",thanks:"🎁",follow:"💚",subscribe:"⭐",welcome:"👋",periodic:"⏰",read:"🔊"};
let bbCss=false;
function ensureBbCSS(){ if(bbCss||typeof document==="undefined") return; bbCss=true; const st=document.createElement("style"); st.id="b6o6-botbox"; st.textContent=BB_CSS; document.head.appendChild(st) }
Object.assign(View.prototype,{
 applyBot(w,W,Hh,pad,gap){ ensureBbCSS(); const e=this.el, ed=this.opts.editor;
  e.className=`wd bbw bb-${w.design||"b6o6Bot"} bb-${w.stack==="down"?"down":"up"}${w.effects&&this.opts.globalFx!==false?"":" no-fx"}${ed?(" "+(w.locked?"locked":"")+(w.visible?"":" hid")+(this.opts.sel===w.id?" sel":"")):""}`;
  e.style.setProperty("--bfs",Math.max(10,Math.min(Hh/Math.max(2,(w.max||4))*.22,W*.045)*(w.fontScale||1))+"px");
  if(this.sig!=="bb"){ this.sig="bb"; e.innerHTML=`<div class="bb-list"></div>`+(ed?'<div class="rh"></div><div class="lockb">🔒</div>':""); this.bbList=e.querySelector(".bb-list");
   if(ed&&this.opts.demo!==false) this.botPush([{id:"demo1",kind:"thanks",bot:"thanks",text:"يا سلام يا محمد، شكراً على الأسد 👑🔥",user:{name:"محمد"},show:true},{id:"demo2",kind:"cmd",bot:"commands",text:"باقي على السبثون ساعتان و15 دقيقة ⏳",user:{name:"فهد"},show:true}],true) }
 },
 botPush(items,keep){ const w=this.w, L=this.bbList; if(!L) return;
  const kinds=w.kinds&&w.kinds.length?new Set(w.kinds):null;
  for(const it of items){ if(!it.show) continue; if(kinds&&!kinds.has(it.kind)) continue;
   const el=document.createElement("div"); el.className="bb-msg k-"+it.kind; el.dataset.id=it.id;
   el.innerHTML=`${w.showAvatar!==false&&it.user&&it.user.name?`<img src="${esc(it.user.av||avatar(it.user.name))}" alt="">`:`<span class="bb-ic">${BOT_KIND_LABEL[it.kind]||"🤖"}</span>`}<div class="bb-b">${w.showBot!==false?`<span class="bb-n">${BOT_KIND_LABEL[it.kind]||"🤖"} ${esc(w.botName||"البوت")}${it.test?" · تجربة":""}</span>`:""}<span class="bb-t">${esc(it.text)}</span></div><i class="bb-swp"></i>`;
   if(w.stack==="down") L.appendChild(el); else L.prepend(el);
   if(!keep&&!this.el.classList.contains("no-fx")) el.animate([{opacity:0,transform:"translateY(30%) scale(.95)"},{opacity:1,transform:"none"}],{duration:420,easing:"cubic-bezier(.2,.8,.2,1)"});
   const max=Math.max(1,w.max||4); while(L.children.length>max){ const old=w.stack==="down"?L.firstElementChild:L.lastElementChild; old.remove() }
   if(!keep&&(w.holdSec||0)>0) setTimeout(()=>{ if(!el.isConnected) return; const a=el.animate([{opacity:1},{opacity:0,transform:"translateX(10%)"}],{duration:350,fill:"forwards"}); a.onfinish=()=>el.remove() },w.holdSec*1000) }
 },
});
const BB_CSS=`
.bbw{background:none!important;direction:rtl;color:#fff;font-family:"Readex Pro","Changa",sans-serif}
.bbw .bb-list{position:absolute;inset:0;display:flex;flex-direction:column;gap:calc(var(--bfs)*.45);overflow:hidden;justify-content:flex-end}
.bbw.bb-down .bb-list{justify-content:flex-start}
.bbw .bb-msg{position:relative;display:flex;align-items:center;gap:calc(var(--bfs)*.55);padding:calc(var(--bfs)*.5) calc(var(--bfs)*.8);font-size:var(--bfs);overflow:hidden;flex:none}
.bbw .bb-msg img,.bbw .bb-ic{width:calc(var(--bfs)*2.1);height:calc(var(--bfs)*2.1);border-radius:50%;object-fit:cover;flex:none;display:grid;place-items:center;font-size:calc(var(--bfs)*1.2)}
.bbw .bb-b{display:flex;flex-direction:column;min-width:0;gap:.1em}
.bbw .bb-n{font-size:.68em;opacity:.8;font-weight:700}.bbw .bb-t{font-weight:700;line-height:1.35;overflow-wrap:anywhere}
.bbw .bb-swp{position:absolute;top:0;bottom:0;width:25%;right:-30%;background:linear-gradient(270deg,transparent,#ffffff40,transparent);transform:skewX(-18deg);animation:bb-swp 5s ease-in-out infinite;pointer-events:none}
@keyframes bb-swp{0%,60%{transform:translateX(0) skewX(-18deg)}100%{transform:translateX(-520%) skewX(-18deg)}}
.bb-b6o6Bot .bb-msg{border-radius:calc(var(--bfs)*.7);border:1px solid transparent;background:linear-gradient(90deg,#000000e6,#06122ed8) padding-box,linear-gradient(90deg,#c0c7d4,#2f7bff) border-box;box-shadow:0 0 14px #2f7bff33}
.bb-b6o6Bot .bb-n{color:#7fb2ff}.bb-b6o6Bot .k-thanks{background:linear-gradient(90deg,#1c1404ee,#06122ed8) padding-box,linear-gradient(90deg,#f5c542,#2f7bff) border-box}
.bb-glassBot .bb-msg{border-radius:calc(var(--bfs)*1.2);background:linear-gradient(180deg,#ffffff2a,#ffffff10);border:1px solid #ffffff55;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.bb-glassBot .bb-t{text-shadow:0 1px 3px #000a}
.bb-neonBot .bb-msg{border-radius:calc(var(--bfs)*.4);background:#05050ae6;border:1.5px solid #f472b6;box-shadow:0 0 10px #f472b6,inset 0 0 8px #f472b655}
.bb-neonBot .k-thanks{border-color:#facc15;box-shadow:0 0 10px #facc15}.bb-neonBot .bb-n{color:#f9a8d4}
.no-fx .bb-swp{animation:none}
@media (prefers-reduced-motion:reduce){.bbw *{animation:none!important}}
`;
