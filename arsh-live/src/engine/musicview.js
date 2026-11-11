// ====== ودجت «الأغنية الحالية» (شفاف 100%) ======
import { View } from "./view.js";
import { esc, avatar } from "./defs.js";

export const NP_DESIGNS=[
 {id:"vinyl",name:"Vinyl Spin",ar:"أسطوانة دوّارة",desc:"أسطوانة تدور مع الغلاف في المنتصف"},
 {id:"glass",name:"Glass Card",ar:"بطاقة زجاجية",desc:"غلاف وعنوان وشريط تقدم على زجاج"},
 {id:"neon",name:"Neon Bar",ar:"شريط نيون",desc:"شريط أفقي بحواف نيون ومعادل صوتي"},
 {id:"minimal",name:"Minimal Line",ar:"سطر بسيط",desc:"🎵 العنوان — الفنان فقط"},
 {id:"eq",name:"Equalizer",ar:"معادل صوتي",desc:"أعمدة معادل متحركة خلف العنوان"},
 {id:"royal",name:"Royal Gold",ar:"ملكي ذهبي",desc:"إطار ذهبي مزدوج وتاج صغير"},
 {id:"cyber",name:"Cyber HUD",ar:"واجهة سايبر",desc:"زوايا مقطوعة وخط مسح"},
 {id:"b6o6",name:"B6O6 Signature",ar:"توقيع B6O6",desc:"هوية B6O6 الزرقاء"},
 {id:"cassette",name:"Cassette",ar:"كاسيت",desc:"شريط كاسيت ببكرتين تدوران"},
 {id:"floating",name:"Floating Text",ar:"نص عائم",desc:"نص فقط بظل ناعم بدون خلفية"}, {id:"sakura",name:"Sakura Song",ar:"ساكورا",desc:"وردي ناعم وبتلات"},
 {id:"fire",name:"Fire Track",ar:"ناري",desc:"تدرج ناري ومعادل برتقالي"},
 {id:"galaxy",name:"Galaxy",ar:"مجرة",desc:"غلاف دائري ونجوم"},
 {id:"pill",name:"Pill",ar:"كبسولة",desc:"كبسولة مستديرة بسيطة"},
 {id:"spotify",name:"Streaming Card",ar:"بطاقة بث",desc:"خلفية داكنة وشريط أخضر"},
 {id:"radio",name:"Retro Radio",ar:"راديو قديم",desc:"لوحة راديو خشبية بمؤشر"},
 {id:"ticker",name:"Ticker",ar:"شريط متحرك",desc:"العنوان يتحرك أفقياً كشريط أخبار"},
 {id:"gold",name:"Gold Plate",ar:"لوحة ذهبية",desc:"ذهب لامع ونص داكن"},
 {id:"ice",name:"Ice Glass",ar:"زجاج جليدي",desc:"أزرق فاتح شفاف"},
 {id:"saudi",name:"Saudi Green",ar:"أخضر سعودي",desc:"أخضر وذهبي وزخرفة سفلية"},
 {id:"duck",name:"B6O6 Duck",ar:"بطة B6O6",desc:"أبيض وبرتقالي مع 🦆"},
 {id:"wave",name:"Sound Wave",ar:"موجة صوت",desc:"خط موجة متحرك أسفل البطاقة"},
 {id:"polaroid",name:"Polaroid",ar:"صورة فورية",desc:"غلاف كبير بإطار أبيض"},
 {id:"hud",name:"Game HUD",ar:"واجهة لعبة",desc:"أقواس زوايا وخط Orbitron"},
 {id:"purple",name:"Royal Purple",ar:"بنفسجي ملكي",desc:"بنفسجي وإطار فضي"},
 {id:"matrix",name:"Matrix",ar:"ماتريكس",desc:"أخضر على أسود"},
 {id:"sticker",name:"Sticker",ar:"ملصق",desc:"بطاقة ملونة بحد أبيض وظل"},
 {id:"aurora",name:"Aurora",ar:"الشفق",desc:"تدرج شفق متحرك"},
 {id:"compact",name:"Compact Icon",ar:"أيقونة مختصرة",desc:"غلاف صغير وعنوان فقط"},
 {id:"frame",name:"Picture Frame",ar:"إطار فني",desc:"إطار مزخرف مزدوج حول البطاقة"},
];
let npCss=false;
function ensureNpCSS(){ if(npCss||typeof document==="undefined") return; npCss=true; const st=document.createElement("style"); st.id="b6o6-np"; st.textContent=NP_CSS; document.head.appendChild(st) }
const npFmt=s=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`;
const NP_SAMPLE={track:{id:"s",title:"اسم الأغنية",artist:"اسم الفنان",dur:215,cover:""},by:{name:"محمد"},startedAt:Date.now(),pos:64,posAt:Date.now()};

Object.assign(View.prototype,{
 applyNp(w,W,Hh){ ensureNpCSS(); const e=this.el, ed=this.opts.editor;
  e.className=`wd npw npd-${w.design||"glass"}${w.animOn===false?" np-still":""}${ed?(" "+(w.locked?"locked":"")+(w.visible?"":" hid")+(this.opts.sel===w.id?" sel":"")):""}`;
  e.style.setProperty("--nfs",Math.max(10,Math.min(Hh*.2,W*.06))*(w.fontScale||1)+"px"); if(w.accent) e.style.setProperty("--nac",w.accent); else e.style.removeProperty("--nac");
  if(this.sig!=="np"+w.design){ this.sig="np"+w.design;
   e.innerHTML=`<div class="np-in"><div class="np-art"><div class="np-cv"></div><i class="np-hole"></i></div><div class="np-tx"><div class="np-ti"></div><div class="np-ar"></div><div class="np-by"></div><div class="np-pr"><i></i></div><div class="np-tm"><span class="np-a"></span><span class="np-b"></span></div></div><div class="np-eq">${"<i></i>".repeat(9)}</div></div>`+(ed?'<div class="rh"></div><div class="lockb">🔒</div>':"");
   clearInterval(this.npT); this.npT=setInterval(()=>{ if(!this.el.isConnected){ clearInterval(this.npT); return } this.npTick() },500) }
  this.refreshNp(this.opts.data?this.opts.data():null) },
 refreshNp(src){ const w=this.w, M=src&&src.C&&src.C.music; let cur=M&&M.current; const ed=this.opts.editor||String(w.id).startsWith("pv_");
  if(!cur&&ed) cur=NP_SAMPLE; this.npCur=cur; this.npPaused=!!(M&&M.paused);
  const e=this.el; e.classList.toggle("np-empty",!cur); e.classList.toggle("np-paused",this.npPaused); if(!cur) return;
  const q=s=>e.querySelector(s), t=cur.track;
  if(this.npId!==cur.qid+t.id){ this.npId=cur.qid+t.id; q(".np-ti").textContent=t.title; q(".np-ar").textContent=t.artist||""; q(".np-by").textContent=w.showBy!==false&&cur.by?.name?`طلب: ${cur.by.name}`:"";
   const cv=q(".np-cv"); cv.style.backgroundImage=t.cover?`url("${t.cover.replace(/"/g,"")}")`:`linear-gradient(135deg,hsl(${(t.title.length*37)%360} 80% 55%),hsl(${(t.title.length*37+70)%360} 80% 35%))`;
   if(w.animOn!==false&&!ed) q(".np-in").animate([{opacity:0,transform:"translateY(12%)"},{opacity:1,transform:"none"}],{duration:500,easing:"cubic-bezier(.2,.8,.2,1)"}) }
  this.npTick() },
 npTick(){ const c=this.npCur; if(!c) return; const dur=c.track.dur||0; let pos=c.pos||0; if(!this.npPaused&&c.posAt) pos+= (Date.now()-c.posAt)/1000; else if(!this.npPaused&&!c.posAt&&c.startedAt) pos=(Date.now()-c.startedAt)/1000;
  pos=Math.max(0,Math.min(dur||pos,pos)); const e=this.el; const bar=e.querySelector(".np-pr i"); if(bar) bar.style.width=(dur?pos/dur*100:0)+"%";
  const a=e.querySelector(".np-a"), b=e.querySelector(".np-b"); if(a) a.textContent=npFmt(pos); if(b) b.textContent=dur?npFmt(dur):"" },
});

const NP_CSS=`
.npw{background:none!important;direction:rtl;color:#fff;font-family:"Readex Pro","Changa",sans-serif}
.npw.np-empty .np-in{display:none}
.npw .np-in{position:absolute;inset:0;display:flex;align-items:center;gap:calc(var(--nfs)*.7);padding:calc(var(--nfs)*.5)}
.npw .np-art{position:relative;height:100%;aspect-ratio:1;flex:none;max-height:calc(var(--nfs)*5)}
.npw .np-cv{position:absolute;inset:0;border-radius:calc(var(--nfs)*.4);background-size:cover;background-position:center;box-shadow:0 4px 14px #0008}
.npw .np-hole{display:none}
.npw .np-tx{min-width:0;flex:1;display:flex;flex-direction:column;gap:calc(var(--nfs)*.15)}
.npw .np-ti{font-weight:900;font-size:var(--nfs);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;unicode-bidi:plaintext}
.npw .np-ar{opacity:.8;font-size:calc(var(--nfs)*.7);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;unicode-bidi:plaintext}
.npw .np-by{font-size:calc(var(--nfs)*.55);color:var(--nac,#7cc4ff)}
.npw .np-pr{direction:ltr;height:calc(var(--nfs)*.18);background:#ffffff2a;border-radius:9px;overflow:hidden;margin-top:calc(var(--nfs)*.2)}.npw .np-pr i{display:block;height:100%;width:0;background:var(--nac,#7cc4ff);border-radius:9px;transition:width .5s linear}
.npw .np-tm{display:flex;justify-content:space-between;font-size:calc(var(--nfs)*.5);opacity:.75;direction:ltr}
.npw .np-eq{display:none;position:absolute;inset:auto 0 0 0;height:60%;align-items:flex-end;gap:3%;padding:0 4%;opacity:.35;pointer-events:none}
.npw .np-eq i{flex:1;background:var(--nac,#7cc4ff);border-radius:3px 3px 0 0;height:30%;animation:np-eq .9s ease-in-out infinite alternate}
${[...Array(9)].map((_,i)=>`.npw .np-eq i:nth-child(${i+1}){animation-duration:${(.5+((i*37)%7)/10).toFixed(2)}s;animation-delay:-${(i*.13).toFixed(2)}s}`).join("")}
@keyframes np-eq{from{height:15%}to{height:95%}}
.npw.np-paused .np-eq i,.npw.np-paused .np-cv,.npw.np-paused .np-art::before,.npw.np-paused .np-art::after{animation-play-state:paused!important}
.npw.np-still *{animation:none!important}
/* التصاميم */
.npd-vinyl .np-art::before{content:"";position:absolute;inset:-4%;border-radius:50%;background:repeating-radial-gradient(circle,#111 0 2px,#1d1d1d 2px 4px);box-shadow:0 6px 18px #000a}
.npd-vinyl .np-cv{inset:24%;border-radius:50%;animation:le-spin 4s linear infinite;z-index:1}
.npd-vinyl .np-hole{display:block;position:absolute;left:47%;top:47%;width:6%;height:6%;border-radius:50%;background:#000;z-index:2}
.npd-vinyl .np-art{animation:le-spin 4s linear infinite}
.npd-glass .np-in{background:linear-gradient(135deg,#ffffff26,#ffffff0d);border:1px solid #ffffff40;border-radius:calc(var(--nfs)*.8);backdrop-filter:blur(10px)}
.npd-neon .np-in{background:#05060ccc;border:calc(var(--nfs)*.08) solid var(--nac,#22d3ee);border-radius:calc(var(--nfs)*2);box-shadow:0 0 calc(var(--nfs)*.6) var(--nac,#22d3ee),inset 0 0 calc(var(--nfs)*.5) #22d3ee55}
.npd-neon .np-eq{display:flex;opacity:.25}.npd-neon .np-cv{border-radius:50%}
.npd-minimal .np-art,.npd-minimal .np-pr,.npd-minimal .np-tm,.npd-minimal .np-by{display:none}.npd-minimal .np-tx{flex-direction:row;gap:.5em;align-items:baseline}.npd-minimal .np-ti::before{content:"🎵 "}.npd-minimal .np-ar::before{content:"— "}
.npd-minimal .np-in{text-shadow:0 2px 4px #000}
.npd-eq .np-eq{display:flex;opacity:.55}.npd-eq .np-in{background:linear-gradient(0deg,#000a,transparent);border-radius:calc(var(--nfs)*.5)}.npd-eq .np-art{display:none}
.npd-royal .np-in{background:linear-gradient(180deg,#2a1d07f2,#0f0a02f2);border:calc(var(--nfs)*.07) solid #e8b84a;box-shadow:0 0 0 calc(var(--nfs)*.05) #0d0902,0 0 0 calc(var(--nfs)*.11) #a8761e;border-radius:calc(var(--nfs)*.3);--nac:#f6c94a}
.npd-royal .np-ti{color:#fde68a}.npd-royal .np-in::before{content:"♛";position:absolute;top:calc(var(--nfs)*-.75);left:50%;transform:translateX(-50%);color:#f6c94a;font-size:var(--nfs);text-shadow:0 0 6px #f6c94a}
.npd-cyber .np-in{background:linear-gradient(90deg,#001420e6,#140028e6);border-top:1px solid #22d3ee;border-bottom:1px solid #f0abfc;clip-path:polygon(calc(var(--nfs)*.6) 0,100% 0,100% calc(100% - var(--nfs)*.6),calc(100% - var(--nfs)*.6) 100%,0 100%,0 calc(var(--nfs)*.6));--nac:#22d3ee}
.npd-cyber .np-in::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 3px,#22d3ee10 3px 4px);pointer-events:none}.npd-cyber .np-ti{font-family:"Orbitron","Readex Pro",sans-serif}
.npd-b6o6 .np-in{background:linear-gradient(135deg,#0a63ffcc,#06111ff2);border:1px solid #9fc3ff;border-radius:calc(var(--nfs)*1) calc(var(--nfs)*.25);box-shadow:0 0 calc(var(--nfs)*.6) #0a63ff66;--nac:#e8f1ff}
.npd-cassette .np-art{aspect-ratio:1.6;background:linear-gradient(180deg,#2b2b2b,#141414);border-radius:calc(var(--nfs)*.3);border:2px solid #444}
.npd-cassette .np-cv{inset:22% 30%;border-radius:4px;opacity:.85}
.npd-cassette .np-art::before,.npd-cassette .np-art::after{content:"";position:absolute;top:34%;width:22%;aspect-ratio:1;border-radius:50%;border:3px dashed #ddd;animation:le-spin 2.2s linear infinite;z-index:2}
.npd-cassette .np-art::before{left:6%}.npd-cassette .np-art::after{right:6%}
.npd-cassette .np-in{background:#0009;border-radius:calc(var(--nfs)*.4)}
.npd-floating .np-art{display:none}.npd-floating .np-in{text-shadow:0 2px 4px #000,0 0 10px #000c}.npd-floating .np-pr{background:#ffffff40}
.npd-sakura .np-in{background:linear-gradient(135deg,#ffd1e333,#5a183acc);border:1px solid #ffb3d1;border-radius:calc(var(--nfs)*1.2)}.npd-sakura .np-cv{border-radius:50%}.npd-sakura .np-by{color:#ffd1e3}
.npd-fire .np-in{background:linear-gradient(90deg,#3c0800dd,#190300cc);border-bottom:calc(var(--nfs)*.15) solid #ff5a1f;border-radius:calc(var(--nfs)*.4)}.npd-fire .np-eq{display:flex;opacity:.3;--nac:#ff5a1f}.npd-fire .np-pr i{background:#ff7a00}
.npd-galaxy .np-in{background:radial-gradient(circle at 15% 30%,#fff3 0 1px,transparent 2px),radial-gradient(circle at 60% 70%,#fff3 0 1px,transparent 2px),linear-gradient(135deg,#190a3cdd,#05051acc);background-size:36px 28px,48px 36px,100%;border:1px solid #8b5cf6;border-radius:calc(var(--nfs)*.8)}.npd-galaxy .np-cv{border-radius:50%;box-shadow:0 0 0 3px #8b5cf6}
.npd-pill .np-in{background:#000b;border-radius:999px;padding-inline:calc(var(--nfs)*.4) calc(var(--nfs)*1)}.npd-pill .np-cv{border-radius:50%}.npd-pill .np-tm,.npd-pill .np-by{display:none}
.npd-spotify .np-in{background:#121212e6;border-radius:calc(var(--nfs)*.5)}.npd-spotify .np-pr i{background:#1ed760}.npd-spotify .np-by{color:#1ed760}
.npd-radio .np-in{background:linear-gradient(180deg,#7c4a1e,#4a2a10);border:calc(var(--nfs)*.12) solid #2a170a;border-radius:calc(var(--nfs)*.6)}.npd-radio .np-cv{border-radius:50%;background:repeating-radial-gradient(circle,#222 0 2px,#444 2px 4px)!important}.npd-radio .np-ti{font-family:Amiri,serif;color:#fde68a}
.npd-ticker .np-art,.npd-ticker .np-tm,.npd-ticker .np-pr{display:none}.npd-ticker .np-in{background:#000c;border-block:2px solid var(--nac,#facc15)}.npd-ticker .np-ti{animation:np-tk 10s linear infinite;overflow:visible}@keyframes np-tk{from{transform:translateX(-100%)}to{transform:translateX(100%)}}
.npd-gold .np-in{background:linear-gradient(180deg,#fde68a,#d4a017 55%,#b8860b);border-radius:calc(var(--nfs)*.4);color:#1c1206}.npd-gold .np-by{color:#5a3a06}.npd-gold .np-pr{background:#0003}.npd-gold .np-pr i{background:#3b2506}
.npd-ice .np-in{background:linear-gradient(135deg,#e0f2fe55,#38bdf826);border:1px solid #e0f2fe;border-radius:calc(var(--nfs)*.5);backdrop-filter:blur(8px)}
.npd-saudi .np-in{background:linear-gradient(90deg,#005430dd,#002818cc);border:calc(var(--nfs)*.06) solid #c9a227;border-radius:calc(var(--nfs)*.5)}.npd-saudi .np-pr i{background:#c9a227}.npd-saudi .np-by{color:#fde68a}
.npd-duck .np-in{background:#ffffffee;color:#111827;border:calc(var(--nfs)*.08) solid #ff9f1a;border-radius:calc(var(--nfs)*1)}.npd-duck .np-in::after{content:"🦆";position:absolute;left:calc(var(--nfs)*.4);top:calc(var(--nfs)*-.4);font-size:var(--nfs)}.npd-duck .np-by{color:#c2410c}.npd-duck .np-pr{background:#0002}.npd-duck .np-pr i{background:#ff9f1a}
.npd-wave .np-in{background:#0b1020cc;border-radius:calc(var(--nfs)*.6);overflow:hidden}.npd-wave .np-in::after{content:"";position:absolute;inset:auto 0 0 0;height:30%;background:repeating-linear-gradient(90deg,transparent 0 4px,var(--nac,#7cc4ff) 4px 6px);-webkit-mask:linear-gradient(0deg,#000,transparent);opacity:.4;animation:np-wv 1.2s linear infinite}@keyframes np-wv{to{background-position:20px 0}}
.npd-polaroid .np-art{background:#fff;padding:6%;box-shadow:0 6px 14px #0009;transform:rotate(-4deg)}.npd-polaroid .np-cv{inset:6% 6% 18% 6%;border-radius:0}.npd-polaroid .np-in{text-shadow:0 2px 6px #000}
.npd-hud .np-in{background:#000f19cc;background-image:linear-gradient(var(--nac,#22d3ee),var(--nac,#22d3ee)),linear-gradient(var(--nac,#22d3ee),var(--nac,#22d3ee)),linear-gradient(var(--nac,#22d3ee),var(--nac,#22d3ee)),linear-gradient(var(--nac,#22d3ee),var(--nac,#22d3ee));background-size:14px 2px,2px 14px,14px 2px,2px 14px;background-position:0 0,0 0,100% 100%,100% 100%;background-repeat:no-repeat}.npd-hud .np-tm{font-family:Orbitron,monospace}
.npd-purple .np-in{background:linear-gradient(135deg,#3b0764dd,#19032dcc);border:calc(var(--nfs)*.06) solid #d8b4fe;border-radius:calc(var(--nfs)*.5)}.npd-purple .np-pr i{background:#d8b4fe}
.npd-matrix .np-in{background:#000a00e6;border:1px solid #16a34a;font-family:ui-monospace,monospace;color:#4ade80}.npd-matrix .np-pr i{background:#22c55e}
.npd-sticker .np-in{background:var(--nac,#7c3aed);border:calc(var(--nfs)*.14) solid #fff;border-radius:calc(var(--nfs)*.8);box-shadow:4px 4px 0 #0008}
.npd-aurora .np-in{background:linear-gradient(120deg,#10b98199,#3b82f699,#a855f799);background-size:300% 100%;animation:np-au 8s ease-in-out infinite alternate;border-radius:calc(var(--nfs)*.7)}@keyframes np-au{to{background-position:100% 0}}
.npd-compact .np-ar,.npd-compact .np-by,.npd-compact .np-tm,.npd-compact .np-pr{display:none}.npd-compact .np-in{background:#000a;border-radius:calc(var(--nfs)*.4)}.npd-compact .np-cv{border-radius:50%;animation:le-spin 6s linear infinite}
.npd-frame .np-in{background:#0d0d0dd9;border:calc(var(--nfs)*.1) double #e5e7eb;outline:calc(var(--nfs)*.05) solid #9ca3af;outline-offset:calc(var(--nfs)*.15)}
`;
