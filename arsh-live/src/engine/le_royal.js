// ====== آخر التفاعلات — المجموعة الثانية: الملكية والفخامة (12–20) ======
import { leRegister } from "./leview.js";

const LR_SVG='<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">';
const lrP=(cx,cy,a,r)=>[+(cx+Math.cos(a*Math.PI/180)*r).toFixed(1),+(cy+Math.sin(a*Math.PI/180)*r).toFixed(1)];
const lrSpark=(x,y,s)=>`M${x} ${y-s}Q${x} ${y} ${x+s} ${y}Q${x} ${y} ${x} ${y+s}Q${x} ${y} ${x-s} ${y}Q${x} ${y} ${x} ${y-s}Z`;
const lrSeed=s=>()=>((s=(s*9301+49297)%233280)/233280);
const LR_TW='{fill:#fff6d0;transform-box:fill-box;transform-origin:center;opacity:0;animation:bf-tw calc(2.4s / var(--as,1)) ease-in-out infinite}';
const LR_GOLD='<linearGradient id="lrg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3c4"/><stop offset=".45" stop-color="#f6c94a"/><stop offset="1" stop-color="#8a5a12"/></linearGradient><linearGradient id="lrgh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8a5a12"/><stop offset=".5" stop-color="#fde68a"/><stop offset="1" stop-color="#8a5a12"/></linearGradient>';
const lrSparks=pts=>pts.map(([x,y,s],i)=>`<path d="${lrSpark(x,y,s)}" class="lr-sp" style="animation-delay:${(i*.45).toFixed(2)}s"/>`).join("");
const lrConfetti=(c,cols)=>{ const b=c.querySelector(".le-burst"); if(!b) return; const R=lrSeed(Date.now()%7919); for(let i=0;i<16;i++){ const s=document.createElement("i"); s.className="le-confetti"; const a=R()*Math.PI*2, d=60+R()*90; s.style.background=cols[i%cols.length]; s.style.setProperty("--tx",(Math.cos(a)*d*2).toFixed(0)+"px"); s.style.setProperty("--ty",(Math.sin(a)*d*1.6-50).toFixed(0)+"px"); s.style.setProperty("--r",(R()*720-360).toFixed(0)+"deg"); b.appendChild(s); setTimeout(()=>s.remove(),1700) } };
const lrFlash=(cls,ms=1200)=>c=>{ c.classList.remove(cls); void c.offsetWidth; c.classList.add(cls); setTimeout(()=>c.classList.remove(cls),ms) };
const LR_PLATE_GOLD=id=>`.led-${id}.lec-clear .le-plate{border-radius:calc(var(--u)*.4);background:linear-gradient(180deg,#2a1d07f2,#0f0a02f2);border:calc(var(--u)*.07) solid #e8b84a;box-shadow:0 0 0 calc(var(--u)*.05) #0d0902,0 0 0 calc(var(--u)*.1) #a8761e,0 0 calc(var(--u)*.8*var(--gl)) #f6c94a66}`;

// ---------------- 12) Golden Throne ----------------
const goldenThrone={id:"goldenThrone",n:12,cat:"royal",name:"Golden Throne",ar:"العرش الذهبي",pal:"gold",frame:"gold",lay:"stack",
 desc:"عرش ذهبي مصغّر بظهر مقوّس مخملي وكرات تاجية يرتفع خلف الصورة",
 back:()=>`${LR_SVG}<defs>${LR_GOLD}<linearGradient id="gtv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b3122b"/><stop offset="1" stop-color="#4a0610"/></linearGradient></defs>
  <g class="gt-th"><path d="M44 160V70C44 30 70 12 100 12C130 12 156 30 156 70V160Z" fill="url(#lrg)" stroke="#6b430b" stroke-width="1.4"/>
   <path d="M54 156V74C54 40 76 24 100 24C124 24 146 40 146 74V156Z" fill="url(#gtv)"/>
   <path d="M60 150V78C60 48 80 34 100 34C120 34 140 48 140 78V150" fill="none" stroke="#f6c94a" stroke-width=".8" stroke-dasharray="2 3" opacity=".8"/>
   ${[[44,62],[156,62],[100,8]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6" fill="url(#lrg)" stroke="#6b430b" stroke-width="1" class="gt-orb"/><path d="M${x} ${y-12}L${x+3} ${y-6}H${x-3}Z" fill="#fde68a"/>`).join("")}
   <path d="M30 150H70V164H30ZM130 150H170V164H130Z" fill="url(#lrg)" stroke="#6b430b" stroke-width="1"/><path d="M32 150C30 132 40 124 52 124H62V150M168 150C170 132 160 124 148 124H138V150" fill="url(#lrg)" stroke="#6b430b" stroke-width="1"/>
   <rect x="40" y="10" width="20" height="160" class="gt-gloss" fill="url(#lrgh)" opacity=".0"/></g></svg>`,
 front:()=>`${LR_SVG}${lrSparks([[44,44,4],[156,44,4],[100,0,3.5],[24,120,3],[176,120,3]])}</svg>`,
 pulse(c){ lrConfetti(c,["#fde68a","#f6c94a","#fff3c4","#b3122b"]) },
 css:`
.led-goldenThrone .gt-th{transform-box:view-box;transform-origin:100px 170px;filter:drop-shadow(0 4px 6px #0009) drop-shadow(0 0 6px #f6c94a55)}
.led-goldenThrone .le-enter .gt-th{animation:gt-rise calc(var(--d)*1) cubic-bezier(.2,1.2,.3,1) calc(var(--d)*.1) both}
@keyframes gt-rise{from{transform:translateY(40px) scaleY(.4);opacity:0}to{transform:none;opacity:1}}
.led-goldenThrone .gt-orb{animation:gt-orb calc(2.6s / var(--as,1)) ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes gt-orb{0%,100%{filter:none}50%{filter:brightness(1.5) drop-shadow(0 0 4px #fde68a)}}
.led-goldenThrone .lr-sp${LR_TW}
${LR_PLATE_GOLD("goldenThrone")}
`};

// ---------------- 13) Diamond Emperor ----------------
const diamondEmperor={id:"diamondEmperor",n:13,cat:"royal",name:"Diamond Emperor",ar:"إمبراطور الألماس",pal:"silver",frame:"crystal",lay:"stack",
 desc:"إطار من 24 ماسة صغيرة تتلألأ كموجة متتابعة مع شعار ماسي كبير فوق الصورة",
 back:()=>`${LR_SVG}<circle cx="100" cy="100" r="60" class="de-band"/>${Array.from({length:24},(_,i)=>{ const a=i*15-90; const [x,y]=lrP(100,100,a,58); return `<g transform="translate(${x} ${y}) rotate(${a+90})"><path d="M0 -5L4 -1L0 5L-4 -1Z" class="de-g" style="animation-delay:calc(${(i*.08).toFixed(2)}s / var(--as,1))"/></g>` }).join("")}</svg>`,
 front:()=>`${LR_SVG}<defs><linearGradient id="deg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#c8e8ff"/><stop offset="1" stop-color="#7fb3ff"/></linearGradient></defs>
  <g class="de-crest"><path d="M84 28L92 18H108L116 28L100 46Z" fill="url(#deg)" stroke="#fff" stroke-width=".8"/><path d="M84 28H116M92 18L96 28L100 18L104 28L108 18" fill="none" stroke="#fff" stroke-width=".6"/><path d="M70 30L80 26L84 30L80 34ZM130 30L120 26L116 30L120 34Z" fill="url(#deg)" stroke="#fff" stroke-width=".5"/></g>
  ${lrSparks([[30,60,3.5],[170,60,4],[40,150,3],[162,150,3],[112,14,4]])}</svg>`,
 pulse:lrFlash("de-wave"),
 css:`
.led-diamondEmperor .de-band{fill:none;stroke:#dfe9ff;stroke-width:9;opacity:.12}
.led-diamondEmperor .le-front svg,.led-diamondEmperor .le-back svg{filter:drop-shadow(0 0 2px #cfe6ff)}
.led-diamondEmperor .de-g{fill:#f2f8ff;stroke:#7fb3ff;stroke-width:.6;animation:de-tw calc(1.9s / var(--as,1)) ease-in-out infinite}
@keyframes de-tw{0%,100%{opacity:.55}50%{opacity:1;filter:drop-shadow(0 0 5px #fff)}}
.led-diamondEmperor .le-enter .de-g{animation:de-in calc(var(--d)*.4) cubic-bezier(.2,1.6,.3,1) both}
@keyframes de-in{from{opacity:0;transform:scale(0)}to{opacity:1;transform:none}}
.led-diamondEmperor .de-g{transform-box:fill-box;transform-origin:center}
.led-diamondEmperor .de-crest{transform-box:fill-box;transform-origin:50% 100%;animation:di-float calc(3s / var(--as,1)) ease-in-out infinite}
.led-diamondEmperor .le-enter .de-crest{animation:di-form calc(var(--d)*.9) cubic-bezier(.2,1.3,.3,1) calc(var(--d)*.6) both}
.led-diamondEmperor .de-wave .de-g{animation:de-wv .9s ease}
@keyframes de-wv{40%{transform:scale(1.6);filter:brightness(2) drop-shadow(0 0 6px #fff)}}
.led-diamondEmperor .lr-sp${LR_TW}
.led-diamondEmperor.lec-clear .le-plate{border-radius:calc(var(--u)*.3);background:linear-gradient(180deg,#141a28f2,#080b12f2);border:calc(var(--u)*.06) solid #dfe9ff;box-shadow:0 0 0 calc(var(--u)*.1) #5a6b8a,0 0 calc(var(--u)*.8*var(--gl)) #cfe6ff66}
`};

// ---------------- 14) Royal Lion ----------------
const lrMane=()=>Array.from({length:22},(_,i)=>{ const a=-200+i*(220/21); const r=i%2?72:80; const [x,y]=lrP(100,104,a,r), [b1x,b1y]=lrP(100,104,a-8,50), [b2x,b2y]=lrP(100,104,a+8,50), [cx,cy]=lrP(100,104,a+5,r*.82);
 return `<path d="M${b1x} ${b1y}Q${cx} ${cy} ${x} ${y}Q${lrP(100,104,a+12,r*.7).join(" ")} ${b2x} ${b2y}Z" class="rl-m ${i%2?"b":""}" style="animation-delay:calc(${(i*.06).toFixed(2)}s / var(--as,1))"/>` }).join("");
const royalLion={id:"royalLion",n:14,cat:"royal",name:"Royal Lion",ar:"الأسد الملكي",pal:"gold",frame:"gold",lay:"stack",
 desc:"لبدة أسد ذهبية زخرفية تحيط بالصورة مع أذنين وتاج صغير وموجة زئير عند كل حدث",
 back:()=>`${LR_SVG}<defs>${LR_GOLD}<radialGradient id="rlm" cx="50%" cy="52%" r="50%"><stop offset=".45" stop-color="#f6c94a"/><stop offset="1" stop-color="#7a4e0c"/></radialGradient></defs>
  <g class="rl-mane">${lrMane()}</g><path d="M58 52C50 30 62 22 74 36ZM142 52C150 30 138 22 126 36Z" class="rl-ear"/></svg>`,
 front:()=>`${LR_SVG}<g class="rl-crown"><path d="M84 36L80 18L90 26L100 12L110 26L120 18L116 36Z" fill="url(#lrg)" stroke="#6b430b" stroke-width=".8"/><circle cx="100" cy="28" r="2.4" fill="#e0213a"/></g>${lrSparks([[30,40,3.5],[172,46,3.5],[100,2,3]])}</svg>`,
 pulse(c){ const f=c.querySelector(".le-front"); if(!f) return; const s=document.createElement("div"); s.className="rl-roar"; s.innerHTML=LR_SVG+'<circle cx="100" cy="100" r="52"/><circle cx="100" cy="100" r="52" style="animation-delay:.18s"/></svg>'; f.appendChild(s); setTimeout(()=>s.remove(),1300) },
 css:`
.led-royalLion .rl-m{fill:url(#rlm);stroke:#6b430b;stroke-width:.5;transform-box:view-box;transform-origin:100px 104px;animation:rl-br calc(3.2s / var(--as,1)) ease-in-out infinite}
.led-royalLion .rl-m.b{fill:#c08a1e}
@keyframes rl-br{0%,100%{transform:scale(1)}50%{transform:scale(1.035)}}
.led-royalLion .le-enter .rl-m{animation:rl-in calc(var(--d)*.7) cubic-bezier(.2,1.4,.3,1) both}
@keyframes rl-in{from{transform:scale(.5);opacity:0}to{transform:none;opacity:1}}
.led-royalLion .rl-mane{filter:drop-shadow(0 0 4px #f6c94a66)}
.led-royalLion .rl-ear{fill:#c08a1e;stroke:#6b430b;stroke-width:.8}
.led-royalLion .rl-crown{transform-box:fill-box;transform-origin:50% 100%;filter:drop-shadow(0 0 4px #fde68a)}
.led-royalLion .le-enter .rl-crown{animation:cr-drop calc(var(--d)*.8) cubic-bezier(.3,1.5,.4,1) calc(var(--d)*.6) both}
.led-royalLion .rl-roar{position:absolute;inset:0}.led-royalLion .rl-roar svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.led-royalLion .rl-roar circle{fill:none;stroke:#fde68a;stroke-width:3;transform-box:fill-box;transform-origin:center;animation:st-ring 1.1s ease-out both}
.led-royalLion .lr-sp${LR_TW}
${LR_PLATE_GOLD("royalLion")}
`};

// ---------------- 15) Platinum Wings ----------------
const lrWing=()=>{ const rows=[[7,70,9,"pw-f3"],[6,56,9,"pw-f2"],[5,40,8,"pw-f1"]]; let o=""; for(const [n,len,w,cls] of rows) for(let i=0;i<n;i++){ const a=-62+i*(80/(n-1)); o+=`<g transform="rotate(${a.toFixed(1)} 76 104)"><path d="M76 104C68 ${104-w} ${76-len*.6} ${104-w-1} ${76-len} 103C${76-len*.6} ${108+w*.5} 68 ${108+w*.3} 76 104Z" class="${cls}"/></g>` } return o };
const platinumWings={id:"platinumWings",n:15,cat:"royal",name:"Platinum Wings",ar:"الأجنحة البلاتينية",pal:"silver",frame:"b6o6",lay:"stack",
 desc:"جناحان بلاتينيان بثلاث طبقات ريش يرفرفان بهدوء وهالة بلاتينية فوق الصورة",
 back:()=>`${LR_SVG}<defs><linearGradient id="pwg" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#cfd8e6"/><stop offset="1" stop-color="#7c8aa3"/></linearGradient></defs>
  <g class="pw-w l">${lrWing()}</g><g transform="translate(200 0) scale(-1 1)"><g class="pw-w r">${lrWing()}</g></g>
  <ellipse cx="100" cy="30" rx="30" ry="7" class="pw-halo"/></svg>`,
 front:()=>`${LR_SVG}${lrSparks([[20,70,3],[180,70,3],[70,22,2.5],[130,22,2.5]])}</svg>`,
 pulse(c){ lrFlash("pw-flap",1000)(c); const b=c.querySelector(".le-burst"); if(!b) return; const R=lrSeed(Date.now()%977); for(let i=0;i<8;i++){ const s=document.createElement("i"); s.className="le-confetti pw-fe"; const a=(R()*.8+.1)*Math.PI; s.style.setProperty("--tx",((R()<.5?-1:1)*(60+R()*120)).toFixed(0)+"px"); s.style.setProperty("--ty",(40+R()*90).toFixed(0)+"px"); s.style.setProperty("--r",(R()*400).toFixed(0)+"deg"); b.appendChild(s); setTimeout(()=>s.remove(),1600) } },
 css:`
.led-platinumWings .pw-f1{fill:#ffffff;stroke:#8a97ad;stroke-width:.5}.led-platinumWings .pw-f2{fill:url(#pwg);stroke:#8a97ad;stroke-width:.5}.led-platinumWings .pw-f3{fill:url(#pwg);opacity:.85;stroke:#6b7891;stroke-width:.5}
.led-platinumWings .pw-w{transform-box:view-box;transform-origin:76px 104px;animation:pw-flp calc(3.6s / var(--as,1)) ease-in-out infinite;filter:drop-shadow(0 0 4px #ffffff88)}
@keyframes pw-flp{0%,100%{transform:rotate(0)}50%{transform:rotate(-9deg)}}
.led-platinumWings .le-enter .pw-w{animation:cr-open calc(var(--d)*1) cubic-bezier(.2,1.2,.3,1) calc(var(--d)*.25) both}
.led-platinumWings .pw-flap .pw-w{animation:pw-big .9s ease}
@keyframes pw-big{35%{transform:rotate(-24deg)}70%{transform:rotate(6deg)}}
.led-platinumWings .pw-halo{fill:none;stroke:#f2f6ff;stroke-width:3;filter:drop-shadow(0 0 5px #fff);animation:pw-h calc(2.8s / var(--as,1)) ease-in-out infinite}
@keyframes pw-h{0%,100%{opacity:.7;transform:translateY(0)}50%{opacity:1;transform:translateY(-3px)}}
.led-platinumWings .pw-fe{background:#f2f6ff;border-radius:50% 0;width:calc(var(--S)*.02);height:calc(var(--S)*.07)}
.led-platinumWings .lr-sp${LR_TW}
.led-platinumWings.lec-clear .le-plate{border-radius:calc(var(--u)*1.6);background:linear-gradient(180deg,#1b2130f2,#0b0e16f2);border:calc(var(--u)*.06) solid #e6ecf5;box-shadow:0 0 calc(var(--u)*.8*var(--gl)) #ffffff55}
`};

// ---------------- 16) Golden Medal ----------------
const goldenMedal={id:"goldenMedal",n:16,cat:"royal",name:"Golden Medal",ar:"الميدالية الملكية",pal:"gold",frame:"gold",lay:"stack",
 desc:"الصورة داخل ميدالية ذهبية بحافة مسننة تدور وشريطان ملونان وغصنا غار",
 back:()=>{ let teeth=""; for(let i=0;i<32;i++){ const a=i*360/32; teeth+=`<path transform="rotate(${a} 100 96)" d="M96 34L100 28L104 34Z" class="gm-t"/>` }
  const laurel=side=>Array.from({length:6},(_,i)=>{ const a=side<0?150+i*16:30-i*16; const [x,y]=lrP(100,96,a,70); return `<ellipse cx="${x}" cy="${y}" rx="7" ry="3.2" transform="rotate(${(a+(side<0?-60:60)).toFixed(0)} ${x} ${y})" class="gm-lf"/>` }).join("");
  return `${LR_SVG}<defs>${LR_GOLD}</defs><g class="gm-rib"><path d="M76 134L56 194L72 186L84 198L96 140Z" class="gm-r1"/><path d="M124 134L144 194L128 186L116 198L104 140Z" class="gm-r2"/></g>
  <g class="gm-rim"><circle cx="100" cy="96" r="64" fill="url(#lrg)" stroke="#6b430b" stroke-width="1.2"/>${teeth}<circle cx="100" cy="96" r="56" fill="none" stroke="#fff3c4" stroke-width="1" stroke-dasharray="3 3"/></g>${laurel(-1)}${laurel(1)}</svg>` },
 front:()=>`${LR_SVG}${lrSparks([[40,44,4],[160,40,4],[100,16,3]])}</svg>`,
 pulse:lrFlash("gm-swing",1100),
 css:`
.led-goldenMedal .le-stage{transform-origin:50% 0}
.led-goldenMedal .gm-rim{transform-box:view-box;transform-origin:100px 96px;animation:le-spin calc(40s / var(--as,1)) linear infinite;filter:drop-shadow(0 2px 4px #0008)}
.led-goldenMedal .gm-t{fill:#f6c94a;stroke:#6b430b;stroke-width:.4}
.led-goldenMedal .gm-r1{fill:#c8102e;stroke:#6b0a18;stroke-width:.6}.led-goldenMedal .gm-r2{fill:#1e3a8a;stroke:#0b1a45;stroke-width:.6}
.led-goldenMedal .gm-lf{fill:#e8b84a;stroke:#6b430b;stroke-width:.4}
.led-goldenMedal .le-avi{margin-top:-4%}
.led-goldenMedal .le-enter .le-back{animation:gm-drop calc(var(--d)*1) cubic-bezier(.3,1.5,.4,1) calc(var(--d)*.2) both}
@keyframes gm-drop{from{transform:translateY(-30%) rotate(-12deg);opacity:0}to{transform:none;opacity:1}}
.led-goldenMedal .gm-swing .le-stage{animation:gm-sw 1s ease}
@keyframes gm-sw{20%{transform:rotate(7deg)}45%{transform:rotate(-5deg)}70%{transform:rotate(2deg)}100%{transform:none}}
.led-goldenMedal .lr-sp${LR_TW}
${LR_PLATE_GOLD("goldenMedal")}
`};

// ---------------- 17) Crystal Palace ----------------
const lrTower=x=>`<path d="M${x-12} 170V70L${x} 34L${x+12} 70V170Z" class="cp-tw"/><path d="M${x} 34V170" class="cp-ln"/>${[86,108,130].map(y=>`<rect x="${x-3}" y="${y}" width="6" height="9" rx="3" class="cp-win"/>`).join("")}<circle cx="${x}" cy="30" r="2.5" class="cp-tip"/>`;
const crystalPalace={id:"crystalPalace",n:17,cat:"royal",name:"Crystal Palace",ar:"القصر الكريستالي",pal:"blue",frame:"crystal",lay:"stack",
 desc:"بوابة قصر كريستالي ببرجين وقوس تنفتح أبوابها لتظهر الصورة مع نوافذ تضيء",
 back:()=>`${LR_SVG}<defs><linearGradient id="cpg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e9fbff" stop-opacity=".85"/><stop offset=".5" stop-color="#8fd8ff" stop-opacity=".55"/><stop offset="1" stop-color="#2b7bd8" stop-opacity=".75"/></linearGradient></defs>
  ${lrTower(30)}${lrTower(170)}<path d="M42 170V84C42 40 70 22 100 22C130 22 158 40 158 84V170" class="cp-arch"/><path d="M100 22V10M94 14L100 4L106 14Z" class="cp-tip2"/></svg>`,
 front:()=>`${LR_SVG}<g class="cp-doors"><path d="M54 170V92C54 60 74 44 100 44V170Z" class="cp-door l"/><path d="M146 170V92C146 60 126 44 100 44V170Z" class="cp-door r"/></g></svg>`,
 pulse:lrFlash("cp-lit",1300),
 css:`
.led-crystalPalace .cp-tw{fill:url(#cpg);stroke:#e9fbff;stroke-width:.9}.led-crystalPalace .cp-ln{stroke:#fff;stroke-width:.5;opacity:.6}
.led-crystalPalace .cp-win{fill:#cfefff;opacity:.5;animation:cp-w calc(3s / var(--as,1)) ease-in-out infinite}
@keyframes cp-w{0%,100%{opacity:.4}50%{opacity:.95;filter:drop-shadow(0 0 3px #fff)}}
.led-crystalPalace .cp-tip,.led-crystalPalace .cp-tip2{fill:#fff;filter:drop-shadow(0 0 3px #8fd8ff)}
.led-crystalPalace .cp-arch{fill:none;stroke:#cfefff;stroke-width:3;filter:drop-shadow(0 0 4px #8fd8ff)}
.led-crystalPalace .cp-door{fill:url(#cpg);stroke:#e9fbff;stroke-width:.8;opacity:0}
.led-crystalPalace .le-enter .cp-door{opacity:1;animation:cp-open calc(var(--d)*1) ease-in-out calc(var(--d)*.25) both;transform-box:fill-box}
.led-crystalPalace .le-enter .cp-door.l{transform-origin:0 50%}.led-crystalPalace .le-enter .cp-door.r{transform-origin:100% 50%}
@keyframes cp-open{0%{opacity:1;transform:none}100%{opacity:0;transform:scaleX(.05)}}
.led-crystalPalace .le-enter .le-av{animation-delay:calc(var(--d)*.9)}
.led-crystalPalace .cp-lit .cp-win{animation:cp-l 1.2s ease}
@keyframes cp-l{30%{opacity:1;fill:#fff;filter:drop-shadow(0 0 6px #fff)}}
.led-crystalPalace.lec-clear .le-plate{border-radius:calc(var(--u)*.5) calc(var(--u)*.5) calc(var(--u)*1.2) calc(var(--u)*1.2);background:linear-gradient(180deg,#0c2440f0,#06122af0);border:calc(var(--u)*.06) solid #cfefff;box-shadow:0 0 calc(var(--u)*.7*var(--gl)) #8fd8ff77}
`};

// ---------------- 18) Royal Scepter ----------------
const lrScepter=`<path d="M100 186V40" class="rs-rod"/><path d="M93 176H107M95 60H105M94 150H106" class="rs-band"/><path d="M90 46C90 34 110 34 110 46Z" class="rs-cup"/><circle cx="100" cy="30" r="10" class="rs-orb"/><path d="M100 18V8M95 13H105" class="rs-cross"/>`;
const royalScepter={id:"royalScepter",n:18,cat:"royal",name:"Royal Scepter",ar:"الصولجان الملكي",pal:"purple",frame:"gold",lay:"stack",
 desc:"صولجانان ذهبيان متقاطعان خلف الصورة بكرات بنفسجية مضيئة وأشعة عند كل حدث",
 back:()=>`${LR_SVG}<defs>${LR_GOLD}<radialGradient id="rso" cx="40%" cy="35%"><stop offset="0" stop-color="#ffffff"/><stop offset=".4" stop-color="#c58bff"/><stop offset="1" stop-color="#5b1ca8"/></radialGradient></defs>
  <g class="rs-s l"><g transform="rotate(-48 100 104)">${lrScepter}</g></g><g class="rs-s r"><g transform="rotate(48 100 104)">${lrScepter}</g></g></svg>`,
 front:()=>`${LR_SVG}${lrSparks([[34,30,4],[166,30,4],[20,110,3],[180,110,3]])}</svg>`,
 pulse:lrFlash("rs-beam",1200),
 css:`
.led-royalScepter .rs-rod{stroke:url(#lrgh);stroke-width:6;stroke-linecap:round}.led-royalScepter .rs-band{stroke:#fde68a;stroke-width:4}
.led-royalScepter .rs-cup{fill:url(#lrg);stroke:#6b430b;stroke-width:.6}.led-royalScepter .rs-cross{stroke:#fde68a;stroke-width:2.4;stroke-linecap:round}
.led-royalScepter .rs-orb{fill:url(#rso);filter:drop-shadow(0 0 5px #c58bff);animation:rs-o calc(2.2s / var(--as,1)) ease-in-out infinite}
@keyframes rs-o{0%,100%{filter:drop-shadow(0 0 4px #c58bff)}50%{filter:drop-shadow(0 0 10px #e7c8ff) brightness(1.25)}}
.led-royalScepter .rs-s{transform-box:view-box;transform-origin:100px 104px}
.led-royalScepter .le-enter .rs-s.l{animation:rs-inl calc(var(--d)*.9) cubic-bezier(.2,1.3,.3,1) calc(var(--d)*.2) both}
.led-royalScepter .le-enter .rs-s.r{animation:rs-inr calc(var(--d)*.9) cubic-bezier(.2,1.3,.3,1) calc(var(--d)*.2) both}
@keyframes rs-inl{from{transform:rotate(48deg);opacity:0}to{transform:none;opacity:1}}@keyframes rs-inr{from{transform:rotate(-48deg);opacity:0}to{transform:none;opacity:1}}
.led-royalScepter .rs-beam .rs-orb{animation:rs-b 1.1s ease}
@keyframes rs-b{35%{filter:drop-shadow(0 0 22px #fff) brightness(1.8)}}
.led-royalScepter .lr-sp${LR_TW}
.led-royalScepter.lec-clear .le-plate{border-radius:calc(var(--u)*.4);background:linear-gradient(180deg,#22093ef2,#10031ff2);border:calc(var(--u)*.07) solid #e8b84a;box-shadow:0 0 calc(var(--u)*.8*var(--gl)) #c58bff66}
`};

// ---------------- 19) Black Gold Luxury ----------------
const blackGold={id:"blackGold",n:19,cat:"royal",name:"Black Gold Luxury",ar:"الأسود والذهبي",pal:"gold",frame:"gold",lay:"stack",
 desc:"إطار آرت ديكو مثمّن أسود وذهبي بأشعة شمسية خلفه وزخارف مروحية وخط ذهبي يجري حول الإطار",
 back:()=>{ const oct=r=>Array.from({length:8},(_,i)=>lrP(100,100,i*45+22.5,r).join(" ")).join("L");
  const rays=Array.from({length:24},(_,i)=>{ const a=i*15; const [x1,y1]=lrP(100,100,a,66), [x2,y2]=lrP(100,100,a,i%2?84:94); return `M${x1} ${y1}L${x2} ${y2}` }).join("");
  const fan=(x,y,rot)=>`<g transform="translate(${x} ${y}) rotate(${rot})">${[0,1,2,3].map(i=>`<path d="M0 0L${(-14+i*9).toFixed(0)} -18" class="bg-fan"/>`).join("")}<path d="M-16 -16A22 22 0 0 1 16 -16" class="bg-fan"/></g>`;
  return `${LR_SVG}<g class="bg-rays"><path d="${rays}" class="bg-ray"/></g><path d="M${oct(64)}Z" class="bg-oct"/><path d="M${oct(64)}Z" class="bg-run" pathLength="100"/><path d="M${oct(58)}Z" class="bg-oct2"/>${fan(100,26,0)}${fan(100,174,180)}${fan(26,100,-90)}${fan(174,100,90)}</svg>` },
 front:()=>"",
 pulse:lrFlash("bg-flash",1100),
 css:`
.led-blackGold .bg-ray{stroke:#e8b84a;stroke-width:1.3;opacity:.55}
.led-blackGold .bg-rays{transform-box:view-box;transform-origin:100px 100px;animation:le-spin calc(70s / var(--as,1)) linear infinite}
.led-blackGold .bg-oct{fill:#0b0904;stroke:#e8b84a;stroke-width:2.2}
.led-blackGold .bg-oct2{fill:none;stroke:#8a6a2a;stroke-width:.8}
.led-blackGold .bg-run{fill:none;stroke:#fff3c4;stroke-width:2.6;stroke-dasharray:14 86;filter:drop-shadow(0 0 3px #fde68a);animation:bg-run calc(3.4s / var(--as,1)) linear infinite}
@keyframes bg-run{to{stroke-dashoffset:-100}}
.led-blackGold .bg-fan{fill:none;stroke:#e8b84a;stroke-width:1.2}
.led-blackGold .le-enter .le-back{animation:bg-in calc(var(--d)*.9) cubic-bezier(.2,1.1,.3,1) calc(var(--d)*.1) both}
@keyframes bg-in{from{clip-path:circle(0% at 50% 50%)}to{clip-path:circle(75% at 50% 50%)}}
.led-blackGold .bg-flash .bg-ray{animation:bg-f 1s ease}
@keyframes bg-f{35%{opacity:1;stroke:#fff3c4;filter:drop-shadow(0 0 4px #fde68a)}}
.led-blackGold.lec-clear .le-plate{border-radius:0;background:#0b0904f2;border:calc(var(--u)*.06) solid #e8b84a;box-shadow:inset 0 0 0 calc(var(--u)*.1) #0b0904,inset 0 0 0 calc(var(--u)*.14) #8a6a2a,0 0 calc(var(--u)*.6*var(--gl)) #e8b84a55;clip-path:polygon(calc(var(--u)*.5) 0,calc(100% - var(--u)*.5) 0,100% 50%,calc(100% - var(--u)*.5) 100%,calc(var(--u)*.5) 100%,0 50%)}
`};

// ---------------- 20) Legendary Monarch ----------------
const legendaryMonarch={id:"legendaryMonarch",n:20,cat:"royal",name:"Legendary Monarch",ar:"الملك الأسطوري",pal:"gold",frame:"gold",lay:"stack",
 desc:"تصميم سينمائي: أشعة ذهبية دوّارة وعباءة ملكية حمراء بحواف ذهبية وتاج وجناحان صغيران واحتفال",
 back:()=>{ const rays=Array.from({length:16},(_,i)=>{ const a=i*22.5; const [x1,y1]=lrP(100,96,a-4,40), [x2,y2]=lrP(100,96,a,98), [x3,y3]=lrP(100,96,a+4,40); return `M${x1} ${y1}L${x2} ${y2}L${x3} ${y3}Z` }).join("");
  return `${LR_SVG}<defs>${LR_GOLD}<radialGradient id="lmr"><stop offset="0" stop-color="#fff3c4" stop-opacity=".7"/><stop offset="1" stop-color="#f6c94a" stop-opacity="0"/></radialGradient><linearGradient id="lmc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c8102e"/><stop offset="1" stop-color="#5a0614"/></linearGradient></defs>
  <g class="lm-rays"><path d="${rays}" fill="url(#lmr)"/></g>
  <path d="M60 96C40 120 30 160 24 196H176C170 160 160 120 140 96Z" fill="url(#lmc)" class="lm-cape"/><path d="M24 196C30 160 40 120 60 96M176 196C170 160 160 120 140 96" class="lm-trim"/>
  <g class="lm-w l">${[0,1,2,3].map(i=>`<g transform="rotate(${-30+i*14} 66 92)"><path d="M66 92C58 86 36 82 22 86C36 94 58 96 66 92Z" class="lm-f"/></g>`).join("")}</g>
  <g transform="translate(200 0) scale(-1 1)"><g class="lm-w r">${[0,1,2,3].map(i=>`<g transform="rotate(${-30+i*14} 66 92)"><path d="M66 92C58 86 36 82 22 86C36 94 58 96 66 92Z" class="lm-f"/></g>`).join("")}</g></g></svg>` },
 front:()=>`${LR_SVG}<g class="lm-crown"><path d="M74 50L68 22L86 36L100 12L114 36L132 22L126 50Z" fill="url(#lrg)" stroke="#6b430b" stroke-width="1"/><rect x="72" y="48" width="56" height="8" rx="2" fill="url(#lrg)" stroke="#6b430b" stroke-width=".8"/><path d="M100 30l4 5-4 5-4-5z" fill="#e0213a"/><circle cx="68" cy="21" r="2.6" fill="#fff"/><circle cx="100" cy="11" r="3" fill="#fff"/><circle cx="132" cy="21" r="2.6" fill="#fff"/></g>${lrSparks([[30,30,4.5],[170,30,4.5],[16,80,3],[184,80,3],[100,0,3]])}</svg>`,
 pulse(c){ lrFlash("lm-burst",1100)(c); lrConfetti(c,["#fde68a","#f6c94a","#ffffff","#c8102e"]) },
 css:`
.led-legendaryMonarch .lm-rays{transform-box:view-box;transform-origin:100px 96px;animation:le-spin calc(30s / var(--as,1)) linear infinite;mix-blend-mode:screen}
.led-legendaryMonarch .lm-cape{filter:drop-shadow(0 4px 6px #0009)}
.led-legendaryMonarch .lm-trim{fill:none;stroke:#f6c94a;stroke-width:2.4}
.led-legendaryMonarch .lm-f{fill:url(#lrg);stroke:#6b430b;stroke-width:.5}
.led-legendaryMonarch .lm-w{transform-box:view-box;transform-origin:66px 92px;animation:cr-wing calc(3s / var(--as,1)) ease-in-out infinite}
.led-legendaryMonarch .le-enter .lm-w{animation:cr-open calc(var(--d)*.9) cubic-bezier(.2,1.2,.3,1) calc(var(--d)*.35) both}
.led-legendaryMonarch .le-enter .lm-cape{animation:lm-cape calc(var(--d)*.9) ease calc(var(--d)*.15) both;transform-box:fill-box;transform-origin:50% 0}
@keyframes lm-cape{from{transform:scaleY(0);opacity:0}to{transform:none;opacity:1}}
.led-legendaryMonarch .lm-crown{transform-box:fill-box;transform-origin:50% 100%;filter:drop-shadow(0 3px 3px #0008) drop-shadow(0 0 6px #f6c94a88)}
.led-legendaryMonarch .le-enter .lm-crown{animation:cr-drop calc(var(--d)*.8) cubic-bezier(.3,1.5,.4,1) calc(var(--d)*.6) both}
.led-legendaryMonarch .lm-burst .lm-rays{animation:lm-b 1s ease}
@keyframes lm-b{35%{transform:scale(1.25);filter:brightness(1.8)}}
.led-legendaryMonarch .lr-sp${LR_TW}
${LR_PLATE_GOLD("legendaryMonarch")}
`};

leRegister([goldenThrone,diamondEmperor,royalLion,platinumWings,goldenMedal,crystalPalace,royalScepter,blackGold,legendaryMonarch]);
