// ====== عرض «تحدي الفريقين» — شفاف للبث، يقرأ حالة الغرفة الحقيقية src.C.battle ======
import { View } from "./view.js";
import { esc, avatar, fmt } from "./defs.js";
import { battleShare } from "./battle.js";

const BT_CSS=`
.t-battle .bt{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;gap:calc(var(--bfs)*.3);font-family:"Changa","Readex Pro",sans-serif;color:#fff;direction:rtl}
.bt-head{display:flex;align-items:center;justify-content:center;gap:calc(var(--bfs)*.5);font-size:calc(var(--bfs)*.62);font-weight:800;text-shadow:0 2px 6px #000c}
.bt-tm{font-family:"Orbitron","Changa",monospace;direction:ltr;padding:.1em .6em;border-radius:999px;background:#000a;border:1px solid #ffffff33;font-size:.9em}
.bt-tm.low{color:#ff5d7a;animation:bt-blink 1s steps(2) infinite}@keyframes bt-blink{50%{opacity:.4}}
.bt-row{display:flex;align-items:center;gap:calc(var(--bfs)*.35);direction:ltr}.bt-row>[data-k]{display:contents}
.bt-side{display:flex;align-items:center;gap:calc(var(--bfs)*.25);min-width:0;flex:0 1 auto;max-width:34%}.bt-nm{direction:rtl}
.bt-side.b{flex-direction:row-reverse}
.bt-av{width:calc(var(--bfs)*1.5);height:calc(var(--bfs)*1.5);border-radius:50%;background:#222 center/cover;border:3px solid var(--tc);box-shadow:0 0 calc(var(--bfs)*.5) var(--tc);flex:0 0 auto;display:grid;place-items:center;font-weight:800}
.bt-nm{display:flex;flex-direction:column;line-height:1.15;min-width:0}.bt-nm b{font-size:calc(var(--bfs)*.5);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bt-nm small{font-size:calc(var(--bfs)*.38);opacity:.85;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bt-sc{font-family:"Orbitron","Changa",monospace;font-weight:800;font-size:calc(var(--bfs)*.62);color:var(--tc);text-shadow:0 0 8px #000,0 0 12px var(--tc)}
.bt-bar{position:relative;flex:1;height:calc(var(--bfs)*.9);border-radius:999px;overflow:hidden;background:var(--cb);box-shadow:0 0 0 2px #ffffff40,0 4px 14px #0008;direction:ltr}
.bt-bar .fa{position:absolute;inset:0 auto 0 0;width:50%;background:linear-gradient(90deg,var(--ca),color-mix(in srgb,var(--ca) 70%,#fff));transition:width .8s cubic-bezier(.2,.8,.2,1)}
.bt-bar .sp{position:absolute;top:50%;left:50%;width:calc(var(--bfs)*1.3);height:calc(var(--bfs)*1.3);translate:-50% -50%;transition:left .8s cubic-bezier(.2,.8,.2,1);background:radial-gradient(circle,#fff 0 18%,#fde68a 30%,transparent 62%);animation:bt-spark .5s ease-in-out infinite alternate;filter:drop-shadow(0 0 8px #fde68a)}
@keyframes bt-spark{to{scale:1.25;rotate:30deg}}
.bt-bar .sh{position:absolute;inset:0;background:linear-gradient(100deg,transparent 30%,#ffffff55 50%,transparent 70%);background-size:250% 100%;animation:bt-sh 2.6s linear infinite}@keyframes bt-sh{from{background-position:150% 0}to{background-position:-100% 0}}
.bt-win{position:absolute;inset:0;display:grid;place-items:center;pointer-events:none}
.bt-win span{padding:.2em .9em;border-radius:999px;font-size:calc(var(--bfs)*.7);font-weight:900;background:linear-gradient(90deg,#b8862b,#fde68a,#b8862b);color:#2a1a00;box-shadow:0 0 24px #fde68a;animation:bt-pop .7s cubic-bezier(.2,1.6,.4,1) both}
@keyframes bt-pop{from{scale:.3;opacity:0}}
.bt-idle{text-align:center;font-size:calc(var(--bfs)*.42);opacity:.75}
/* VS ملكي */
.btd-rVersus .bt-bar{height:calc(var(--bfs)*.55)}.btd-rVersus .bt-vs{position:absolute;left:50%;top:50%;translate:-50% -50%;font:900 calc(var(--bfs)*.9) "Orbitron",sans-serif;color:#fde68a;text-shadow:0 0 10px #f59e0b,0 3px 0 #000;animation:bt-vs 1.2s ease-in-out infinite;z-index:2}
@keyframes bt-vs{50%{scale:1.15}}.btd-rVersus .bt-side{padding:calc(var(--bfs)*.15) calc(var(--bfs)*.35);border-radius:calc(var(--bfs)*.5);background:linear-gradient(135deg,color-mix(in srgb,var(--tc) 55%,#000),#000c);border:2px solid var(--tc)}
.btd-rVersus .bt-side.lead::before{content:"👑";position:absolute;translate:0 -110%;font-size:calc(var(--bfs)*.6)}.btd-rVersus .bt-side{position:relative}
/* مبارزة النيون */
.btd-rNeonDuel .bt-bar{background:#05060c;box-shadow:0 0 0 2px var(--ca),0 0 16px var(--ca),0 0 0 4px #05060c,0 0 0 6px var(--cb),0 0 22px var(--cb)}
.btd-rNeonDuel .bt-bar .fa{box-shadow:0 0 18px var(--ca)}.btd-rNeonDuel .bt-bar::after{content:"";position:absolute;inset:0 0 0 auto;width:var(--rb,50%);background:var(--cb);opacity:.85;transition:width .8s}
.btd-rNeonDuel .bt-pc{font-family:"Orbitron",monospace;font-size:calc(var(--bfs)*.42);opacity:.9}
`;
let cssOn=false; const ensureCss=()=>{ if(cssOn||typeof document==="undefined") return; cssOn=true; const s=document.createElement("style"); s.textContent=BT_CSS; document.head.appendChild(s) };
const mmss=ms=>{ const s=Math.max(0,Math.ceil(ms/1000)); return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0") };
const side=(t,k)=>`<div class="bt-side ${k}" style="--tc:${t.color}"><div class="bt-av" data-k="av"></div><div class="bt-nm"><b data-k="nm"></b><small data-k="top"></small></div><div class="bt-sc" data-k="sc">0</div></div>`;

Object.assign(View.prototype,{
 applyBt(w,W,Hh){ ensureCss(); const e=this.el; [...e.classList].filter(c=>c.startsWith("btd-")).forEach(c=>e.classList.remove(c)); e.classList.add("btd-"+(w.design||"rClash"));
  if(this.btEl&&(!this.btEl.isConnected||this.btD!==w.design)){ this.btEl.remove(); this.el.querySelector(".bt-win")?.remove(); this.btEl=null } this.btD=w.design;
  e.style.setProperty("--bfs",Math.max(10,Math.min(Hh*.26,W/18))+"px");
  if(!this.btEl){ this.el.insertAdjacentHTML("afterbegin",`<div class="bt"><div class="bt-head"><span data-k="ttl"></span><span class="bt-tm" data-k="tm"></span></div><div class="bt-row"><span data-k="A"></span><div class="bt-bar"><i class="fa"></i><i class="sh"></i><i class="sp"></i>${w.design==="rVersus"?'<b class="bt-vs">VS</b>':""}</div><span data-k="B"></span></div><div class="bt-idle" data-k="idle"></div></div><div class="bt-win" data-k="win"></div>`); this.btEl=this.el.querySelector(".bt"); this.btSig="" }
  this.refreshBt(this.opts.data?this.opts.data():null) },
 refreshBt(src){ if(!this.btEl) return; const w=this.w, B=src&&src.C&&src.C.battle, q=k=>this.el.querySelector(`[data-k="${k}"]`);
  const ed=this.opts.editor||String(w.id).startsWith("pv_");
  const st=B||(ed?{status:"preview",teams:[{id:"a",name:"الفريق الأزرق",color:"#2f7bff",score:620,top:{n:"نورة",v:400}},{id:"b",name:"الفريق الأحمر",color:"#ff2d55",score:380,top:{n:"فهد",v:300}}],endsAt:Date.now()+154000}:null);
  q("ttl").textContent=w.showTitle===false?"":(w.title||"تحدي الفريقين"); q("ttl").hidden=w.showTitle===false;
  if(!st){ q("idle").textContent="ابدأ التحدي من لوحة التحكم ← تحدي الفريقين"; this.el.querySelector(".bt-row").style.visibility="hidden"; q("tm").hidden=true; return }
  this.el.querySelector(".bt-row").style.visibility=""; q("idle").textContent=st.status==="idle"?"بانتظار بدء التحدي":"";
  const [a,b]=st.teams, share=battleShare(st);
  this.el.style.setProperty("--ca",a.color); this.el.style.setProperty("--cb",b.color);
  const sig=JSON.stringify([st.status,a.name,a.color,a.score,a.top&&a.top.n,b.name,b.color,b.score,b.top&&b.top.n,st.winner]);
  if(sig!==this.btSig){ this.btSig=sig;
   q("A").innerHTML=side(a,"a"); q("B").innerHTML=side(b,"b");
   for(const [k,t] of [["A",a],["B",b]]){ const box=q(k); box.querySelector('[data-k="nm"]').textContent=t.name; box.querySelector('[data-k="sc"]').textContent=fmt(t.score);
    const tp=box.querySelector('[data-k="top"]'); tp.textContent=w.showTop!==false&&t.top?"👑 "+t.top.n:(w.design==="rNeonDuel"?Math.round((t===a?share:1-share)*100)+"%":"");
    const av=box.querySelector('[data-k="av"]'); if(t.top&&t.top.av){ av.style.backgroundImage=`url("${String(t.top.av).replace(/"/g,"")}")` } else { av.textContent=t.top&&t.top.n?String(t.top.n).slice(0,1):(t.name||"?").replace(/^الفريق\s+/,"").replace(/^ال/,"").slice(0,1) } }
   const lead=a.score===b.score?null:a.score>b.score?"a":"b"; this.el.querySelectorAll(".bt-side").forEach(s=>s.classList.toggle("lead",!!lead&&s.classList.contains(lead)));
   const fa=this.el.querySelector(".bt-bar .fa"), sp=this.el.querySelector(".bt-bar .sp"); fa.style.width=(share*100)+"%"; sp.style.left=(share*100)+"%"; this.el.style.setProperty("--rb",((1-share)*100)+"%");
   const win=q("win"); if(st.status==="ended"&&st.winner){ const t=st.teams.find(x=>x.id===st.winner); win.innerHTML=`<span>${st.winner==="draw"?"🤝 تعادل!":"🏆 فاز "+esc(t?t.name:"")}</span>` } else win.innerHTML="" }
  // المؤقت يتحدث محلياً كل ثانية أثناء التحدي
  const tm=q("tm"), tick=()=>{ if(!this.el.isConnected){ clearInterval(this.btT); this.btT=0; return } const left=(st.endsAt||0)-(Date.now()+((src&&src.skew)||0)); tm.textContent=st.status==="ended"?"انتهى":mmss(left); tm.classList.toggle("low",st.status!=="ended"&&left<30000) };
  tm.hidden=w.showTimer===false||st.status==="idle"; clearInterval(this.btT); this.btT=0; tick(); if(st.status==="running"||st.status==="preview") this.btT=setInterval(tick,1000) },
});
