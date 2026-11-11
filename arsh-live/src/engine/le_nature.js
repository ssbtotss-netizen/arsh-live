// ====== آخر التفاعلات — المجموعة الأولى: الطبيعة الساحرة (2–10) ======
// كل تصميم بتكوين وحركة مختلفة: أغصان تتفتح، وردة تتفتح طبقاتها، لوتس فوق ماء، غابة بيراعات، هلال، كرمة تنمو، ندفة ثلج، شفق، غيوم.
import { leRegister } from "./leview.js";

const LN_SVG='<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">';
const lnSeed=s=>()=>((s=(s*9301+49297)%233280)/233280);
const lnP=(cx,cy,a,r)=>[+(cx+Math.cos(a*Math.PI/180)*r).toFixed(1),+(cy+Math.sin(a*Math.PI/180)*r).toFixed(1)];
const lnSpark=(x,y,s)=>`M${x} ${y-s}Q${x} ${y} ${x+s} ${y}Q${x} ${y} ${x} ${y+s}Q${x} ${y} ${x-s} ${y}Q${x} ${y} ${x} ${y-s}Z`;
const LN_TW='{fill:#fff;transform-box:fill-box;transform-origin:center;opacity:0;animation:bf-tw calc(2.6s / var(--as,1)) ease-in-out infinite}';
// زهرة خماسية (ساكورا) حول (0,0)
const lnBlossom=(r,cls)=>`<g class="${cls}">${[0,72,144,216,288].map(a=>`<path transform="rotate(${a})" d="M0 0C${-r*.55} ${-r*.35} ${-r*.5} ${-r*1.05} 0 ${-r}C${r*.5} ${-r*1.05} ${r*.55} ${-r*.35} 0 0Z" class="lnp"/>`).join("")}<circle r="${(r*.22).toFixed(1)}" class="lnc"/></g>`;

// ---------------- 2) Sakura Bloom ----------------
const SK_FLOWERS=[[36,52,9,0],[56,34,7,.15],[22,82,6,.3],[150,150,9,.45],[172,128,7,.6],[132,170,6,.75],[78,26,5,.9]];
const sakura={id:"sakura",n:2,cat:"nature",name:"Sakura Bloom",ar:"تفتّح الساكورا",pal:"pink",frame:"circle",lay:"stack",
 desc:"غصنا ساكورا على جانبي الصورة تتفتح أزهارهما بالتتابع وبتلات تتساقط بانسياب",
 back:()=>`${LN_SVG}<path d="M8 96C24 70 40 50 66 32C76 25 86 22 96 20M30 62C26 50 20 44 12 42M150 178C160 160 174 140 194 122M164 152C172 154 180 160 186 170" class="sk-br"/>
  ${SK_FLOWERS.map(([x,y,r,dl])=>`<g transform="translate(${x} ${y})"><g class="sk-fl" style="animation-delay:calc(${dl}s / var(--as,1))">${lnBlossom(r,"sk-b")}</g></g>`).join("")}</svg>`,
 front:()=>{ const R=lnSeed(11); return `${LN_SVG}${Array.from({length:9},(_,i)=>{ const x=(10+R()*180).toFixed(0), du=(5+R()*4).toFixed(1), dl=(-R()*8).toFixed(1), s=(.6+R()*.6).toFixed(2);
   return `<g transform="translate(${x} -10) scale(${s})"><path d="M0 0C-4-3-4-9 0-10C4-9 4-3 0 0Z" class="sk-pt" style="animation-duration:calc(${du}s / var(--as,1));animation-delay:${dl}s"/></g>` }).join("")}</svg>` },
 pulse(c){ const b=c.querySelector(".le-burst"); if(!b) return; const R=lnSeed(Date.now()%997); for(let i=0;i<12;i++){ const s=document.createElement("i"); s.className="le-confetti sk-cf"; const a=R()*Math.PI*2, d=40+R()*80; s.style.setProperty("--tx",(Math.cos(a)*d*2).toFixed(0)+"px"); s.style.setProperty("--ty",(Math.sin(a)*d*1.4+30).toFixed(0)+"px"); s.style.setProperty("--r",(R()*540).toFixed(0)+"deg"); b.appendChild(s); setTimeout(()=>s.remove(),1600) } },
 css:`
.led-sakura .sk-br{fill:none;stroke:#5a2a24;stroke-width:3.2;stroke-linecap:round}
.led-sakura .lnp{fill:#ffc4dc;stroke:#ff8fbd;stroke-width:.5}.led-sakura .lnc{fill:#ff5f9e}
.led-sakura .sk-fl{transform-box:fill-box;transform-origin:center;animation:sk-sway calc(4s / var(--as,1)) ease-in-out infinite}
.led-sakura .le-enter .sk-fl{animation:sk-open calc(var(--d)*.9) cubic-bezier(.2,1.4,.3,1) both}
@keyframes sk-open{from{transform:scale(0) rotate(-90deg);opacity:0}to{transform:none;opacity:1}}
@keyframes sk-sway{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg) scale(1.04)}}
.led-sakura .sk-pt{fill:var(--cp);opacity:.9;transform-box:fill-box;animation:sk-fall 7s linear infinite}
@keyframes sk-fall{0%{transform:translate(0,0) rotate(0);opacity:0}10%{opacity:.95}100%{transform:translate(-40px,230px) rotate(540deg);opacity:0}}
.led-sakura .sk-cf{background:#ffc4dc;border-radius:60% 0;width:calc(var(--S)*.04);height:calc(var(--S)*.04)}
.led-sakura.lec-clear .le-plate{border-radius:calc(var(--u)*1.6);background:linear-gradient(180deg,#3a0f24ee,#1c0712ee);border:calc(var(--u)*.06) solid #ffb3d1;box-shadow:0 0 calc(var(--u)*.7*var(--gl)) #ff5fb877}
`};

// ---------------- 3) Golden Rose ----------------
const lnRoseLayer=(n,r,w,rot,cls)=>Array.from({length:n},(_,i)=>`<path transform="rotate(${(rot+i*360/n).toFixed(1)} 100 100)" d="M100 100C${100-w} ${100-r*.45} ${100-w*.8} ${100-r} 100 ${100-r}C${100+w*.8} ${100-r} ${100+w} ${100-r*.45} 100 100Z" class="${cls}"/>`).join("");
const goldenRose={id:"goldenRose",n:3,cat:"nature",name:"Golden Rose",ar:"الوردة الذهبية",pal:"gold",frame:"gold",lay:"stack",
 desc:"وردة ذهبية كبيرة تتفتح طبقاتها خلف الصورة مع أوراق جانبية ولمعات ذهبية",
 back:()=>`${LN_SVG}<defs><radialGradient id="grg" cx="50%" cy="50%" r="50%"><stop offset=".3" stop-color="#fff3c4"/><stop offset=".75" stop-color="#e8b84a"/><stop offset="1" stop-color="#8a5a12"/></radialGradient></defs>
  <g class="gr-leaf l"><path d="M60 140C30 150 12 136 8 112C30 108 50 118 60 140Z" class="gr-lf"/><path d="M60 140C40 130 24 122 10 113" class="gr-lv"/></g>
  <g class="gr-leaf r"><path d="M140 140C170 150 188 136 192 112C170 108 150 118 140 140Z" class="gr-lf"/><path d="M140 140C160 130 176 122 190 113" class="gr-lv"/></g>
  <g class="gr-l3">${lnRoseLayer(8,90,30,0,"gr-p3")}</g><g class="gr-l2">${lnRoseLayer(7,76,28,22,"gr-p2")}</g><g class="gr-l1">${lnRoseLayer(6,62,24,10,"gr-p1")}</g></svg>`,
 front:()=>`${LN_SVG}${[[24,40,5],[176,44,6],[30,160,4],[170,166,4.5],[100,6,4]].map(([x,y,s],i)=>`<path d="${lnSpark(x,y,s)}" class="gr-sp" style="animation-delay:${(i*.5).toFixed(1)}s"/>`).join("")}</svg>`,
 pulse(c){ c.classList.remove("gr-bloom"); void c.offsetWidth; c.classList.add("gr-bloom"); setTimeout(()=>c.classList.remove("gr-bloom"),1200) },
 css:`
.led-goldenRose .gr-p3{fill:url(#grg);opacity:.55;stroke:#8a5a12;stroke-width:.5}.led-goldenRose .gr-p2{fill:url(#grg);opacity:.75;stroke:#8a5a12;stroke-width:.5}.led-goldenRose .gr-p1{fill:url(#grg);stroke:#7a4e0c;stroke-width:.6}
.led-goldenRose .gr-l1,.led-goldenRose .gr-l2,.led-goldenRose .gr-l3{transform-box:view-box;transform-origin:100px 100px}
.led-goldenRose .gr-l3{animation:le-spin calc(60s / var(--as,1)) linear infinite}.led-goldenRose .gr-l2{animation:le-spin calc(45s / var(--as,1)) linear infinite reverse}.led-goldenRose .gr-l1{animation:gr-breath calc(4s / var(--as,1)) ease-in-out infinite}
@keyframes gr-breath{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
.led-goldenRose .le-enter .gr-l3{animation:gr-open calc(var(--d)*1) cubic-bezier(.2,1.2,.3,1) calc(var(--d)*.1) both}
.led-goldenRose .le-enter .gr-l2{animation:gr-open calc(var(--d)*1) cubic-bezier(.2,1.2,.3,1) calc(var(--d)*.25) both}
.led-goldenRose .le-enter .gr-l1{animation:gr-open calc(var(--d)*1) cubic-bezier(.2,1.2,.3,1) calc(var(--d)*.4) both}
@keyframes gr-open{from{transform:scale(.2) rotate(-70deg);opacity:0}to{transform:none;opacity:1}}
.led-goldenRose .gr-bloom .gr-l1,.led-goldenRose .gr-bloom .gr-l2{animation:gr-pop 1.1s ease}
@keyframes gr-pop{0%{transform:scale(1);filter:none}35%{transform:scale(1.12) rotate(8deg);filter:brightness(1.6)}100%{transform:none;filter:none}}
.led-goldenRose .gr-lf{fill:#2f7a3a;stroke:#e8b84a;stroke-width:.8}.led-goldenRose .gr-lv{fill:none;stroke:#e8b84a;stroke-width:.6;opacity:.8}
.led-goldenRose .gr-leaf{transform-box:view-box;animation:gr-leaf calc(5s / var(--as,1)) ease-in-out infinite}
.led-goldenRose .gr-leaf.l{transform-origin:60px 140px}.led-goldenRose .gr-leaf.r{transform-origin:140px 140px;animation-direction:reverse}
@keyframes gr-leaf{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
.led-goldenRose .gr-sp${LN_TW}
.led-goldenRose.lec-clear .le-plate{border-radius:calc(var(--u)*.5);background:linear-gradient(180deg,#2a1d07f2,#0f0a02f2);border:calc(var(--u)*.06) solid #e8b84a;box-shadow:0 0 calc(var(--u)*.8*var(--gl)) #f6c94a66}
`};

// ---------------- 4) Crystal Lotus ----------------
const lnLotus=()=>{ const P=(ang,len,w,cls)=>`<path transform="rotate(${ang} 100 160)" d="M100 160C${100-w} ${160-len*.5} ${100-w*.5} ${160-len*.9} 100 ${160-len}C${100+w*.5} ${160-len*.9} ${100+w} ${160-len*.5} 100 160Z" class="${cls}"/>`;
 return [[-80,62,15],[80,62,15],[-58,78,18],[58,78,18]].map(a=>P(...a,"cl-p2")).join("")+[[-34,86,19],[34,86,19],[0,96,20]].map(a=>P(...a,"cl-p1")).join("") };
const crystalLotus={id:"crystalLotus",n:4,cat:"nature",name:"Crystal Lotus",ar:"اللوتس الكريستالي",pal:"blue",frame:"crystal",lay:"stack",
 desc:"زهرة لوتس كريستالية تحتضن الصورة من الأسفل فوق تموجات ماء مضيئة وكرات ضوء صاعدة",
 back:()=>`${LN_SVG}<defs><linearGradient id="clg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#5ab8ff" stop-opacity=".9"/><stop offset=".6" stop-color="#d9f2ff" stop-opacity=".75"/><stop offset="1" stop-color="#ffd1f0" stop-opacity=".9"/></linearGradient></defs>
  <ellipse cx="100" cy="166" rx="70" ry="10" class="cl-w"/><ellipse cx="100" cy="166" rx="70" ry="10" class="cl-w b"/><g class="cl-lotus">${lnLotus()}</g></svg>`,
 front:()=>{ const R=lnSeed(23); return `${LN_SVG}${Array.from({length:7},(_,i)=>`<circle cx="${(30+R()*140).toFixed(0)}" cy="${(140+R()*20).toFixed(0)}" r="${(1.4+R()*2).toFixed(1)}" class="cl-orb" style="animation-delay:${(-R()*5).toFixed(1)}s;animation-duration:calc(${(4+R()*3).toFixed(1)}s / var(--as,1))"/>`).join("")}</svg>` },
 pulse(c){ c.classList.remove("cl-pulse"); void c.offsetWidth; c.classList.add("cl-pulse"); setTimeout(()=>c.classList.remove("cl-pulse"),1300) },
 css:`
.led-crystalLotus .cl-p1{fill:url(#clg);stroke:#f2fbff;stroke-width:.9}.led-crystalLotus .cl-p2{fill:url(#clg);opacity:.7;stroke:#cfefff;stroke-width:.6}
.led-crystalLotus .cl-lotus{transform-box:view-box;transform-origin:100px 160px;filter:drop-shadow(0 0 4px #8fd8ff);animation:cl-float calc(4s / var(--as,1)) ease-in-out infinite}
@keyframes cl-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
.led-crystalLotus .le-enter .cl-lotus{animation:cl-open calc(var(--d)*1) cubic-bezier(.2,1.3,.3,1) calc(var(--d)*.2) both}
@keyframes cl-open{from{transform:scaleX(.1) scaleY(.4);opacity:0}to{transform:none;opacity:1}}
.led-crystalLotus .cl-w{fill:none;stroke:#8fd8ff;stroke-width:1.2;transform-box:fill-box;transform-origin:center;animation:cl-rip calc(3s / var(--as,1)) ease-out infinite}
.led-crystalLotus .cl-w.b{animation-delay:calc(-1.5s / var(--as,1))}
@keyframes cl-rip{from{transform:scale(.5);opacity:.9}to{transform:scale(1.3);opacity:0}}
.led-crystalLotus .cl-orb{fill:#e9fbff;filter:drop-shadow(0 0 3px #8fd8ff);animation:cl-rise 5s ease-in infinite}
@keyframes cl-rise{0%{opacity:0;transform:translateY(0)}20%{opacity:1}100%{opacity:0;transform:translateY(-130px)}}
.led-crystalLotus .cl-pulse .cl-lotus{animation:cl-glow 1.2s ease}
@keyframes cl-glow{40%{filter:drop-shadow(0 0 14px #fff) brightness(1.5)}}
.led-crystalLotus.lec-clear .le-plate{border-radius:calc(var(--u)*1.2);background:linear-gradient(180deg,#0c2a44ee,#06142aee);border:calc(var(--u)*.06) solid #bfe9ff;box-shadow:0 0 calc(var(--u)*.7*var(--gl)) #8fd8ff88}
`};

// ---------------- 5) Enchanted Forest ----------------
const EF_LEAVES=[[30,120,-30],[22,92,-60],[34,66,-100],[52,44,-130],[170,120,210],[178,92,240],[166,66,280],[148,44,310]];
const enchantedForest={id:"enchantedForest",n:5,cat:"nature",name:"Enchanted Forest",ar:"الغابة المسحورة",pal:"green",frame:"circle",lay:"stack",
 desc:"أغصان تحتضن الصورة بأوراق مضيئة تتمايل ويراعات تطير بمسارات حرة",
 back:()=>`${LN_SVG}<path d="M60 176C30 150 18 110 30 76C38 54 52 40 70 30M140 176C170 150 182 110 170 76C162 54 148 40 130 30" class="ef-br"/>
  ${EF_LEAVES.map(([x,y,a],i)=>`<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 0C4-6 14-8 20 0C14 8 4 6 0 0Z" class="ef-lf" style="animation-delay:${(i*.4).toFixed(1)}s"/></g>`).join("")}</svg>`,
 front:()=>{ const R=lnSeed(41); return `${LN_SVG}${Array.from({length:6},(_,i)=>{ const pts=Array.from({length:4},()=>`${(20+R()*160).toFixed(0)} ${(20+R()*150).toFixed(0)}`); const path=`M${pts[0]}Q${pts[1]} ${pts[2]}T${pts[3]}Q${pts[1]} ${pts[0]}`;
   return `<circle r="2.2" class="ef-ff" style="animation-delay:${(R()*2).toFixed(1)}s"><animateMotion dur="${(7+R()*5).toFixed(1)}s" begin="${(-R()*6).toFixed(1)}s" repeatCount="indefinite" path="${path}"/></circle>` }).join("")}</svg>` },
 pulse(c){ c.classList.remove("ef-glow"); void c.offsetWidth; c.classList.add("ef-glow"); setTimeout(()=>c.classList.remove("ef-glow"),1100) },
 css:`
.led-enchantedForest .ef-br{fill:none;stroke:#3b2a18;stroke-width:4;stroke-linecap:round}
.led-enchantedForest .ef-lf{fill:#5df2a8;filter:drop-shadow(0 0 3px #2ee59d);transform-box:fill-box;transform-origin:0 50%;animation:ef-sway calc(3.4s / var(--as,1)) ease-in-out infinite}
@keyframes ef-sway{0%,100%{transform:rotate(-10deg);opacity:.85}50%{transform:rotate(10deg);opacity:1}}
.led-enchantedForest .le-enter .ef-br{stroke-dasharray:400;animation:ef-grow calc(var(--d)*1.1) ease both}
@keyframes ef-grow{from{stroke-dashoffset:400}to{stroke-dashoffset:0}}
.led-enchantedForest .ef-ff{fill:#fffbb0;filter:drop-shadow(0 0 3px #e9ff7a) drop-shadow(0 0 6px #b6ff5a);animation:ef-blink 1.6s ease-in-out infinite alternate}
@keyframes ef-blink{from{opacity:.25}to{opacity:1}}
.led-enchantedForest .ef-glow .ef-lf{animation:ef-g 1s ease}
@keyframes ef-g{40%{filter:drop-shadow(0 0 9px #b6ffde) brightness(1.6)}}
.led-enchantedForest.lec-clear .le-plate{border-radius:calc(var(--u)*.8);background:linear-gradient(180deg,#0b2416ee,#04110aee);border:calc(var(--u)*.06) solid #5df2a8;box-shadow:0 0 calc(var(--u)*.7*var(--gl)) #2ee59d66}
`};

// ---------------- 6) Moon Blossom ----------------
const moonBlossom={id:"moonBlossom",n:6,cat:"nature",name:"Moon Blossom",ar:"أزهار القمر",pal:"silver",frame:"neon",lay:"stack",
 desc:"هلال مضيء خلف الصورة وأزهار بيضاء مضيئة على قوس سفلي ونجوم تتلألأ",
 back:()=>`${LN_SVG}<defs><radialGradient id="mbg"><stop offset=".6" stop-color="#fff9e0" stop-opacity=".6"/><stop offset="1" stop-color="#fff9e0" stop-opacity="0"/></radialGradient></defs>
  <g class="mb-moon"><circle cx="146" cy="50" r="40" fill="url(#mbg)"/><path d="M160 20A34 34 0 1 0 170 74A28 28 0 1 1 160 20Z" class="mb-m"/></g>
  <path d="M36 112A64 64 0 0 0 164 112" class="mb-arc"/></svg>`,
 front:()=>`${LN_SVG}${[[168,6],[148,7.5],[124,6],[56,6.5],[32,7.5],[12,6]].map(([a,r],i)=>[...lnP(100,100,a,64),r]).map(([x,y,r],i)=>`<g transform="translate(${x} ${y})"><g class="mb-fl" style="animation-delay:calc(${(i*.18).toFixed(2)}s / var(--as,1))">${lnBlossom(r,"mb-b")}</g></g>`).join("")}
  ${[[22,40,4],[52,18,3],[96,8,3.5],[184,110,3],[20,100,3]].map(([x,y,s],i)=>`<path d="${lnSpark(x,y,s)}" class="mb-sp" style="animation-delay:${(i*.55).toFixed(2)}s"/>`).join("")}</svg>`,
 pulse(c){ c.classList.remove("mb-shine"); void c.offsetWidth; c.classList.add("mb-shine"); setTimeout(()=>c.classList.remove("mb-shine"),1200) },
 css:`
.led-moonBlossom .mb-m{fill:#fff6d0;filter:drop-shadow(0 0 6px #fff1b0)}
.led-moonBlossom .mb-moon{transform-box:view-box;transform-origin:146px 50px;animation:mb-rock calc(6s / var(--as,1)) ease-in-out infinite}
@keyframes mb-rock{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(6deg)}}
.led-moonBlossom .le-enter .mb-moon{animation:mb-rise calc(var(--d)*1) cubic-bezier(.2,1.2,.3,1) calc(var(--d)*.2) both}
@keyframes mb-rise{from{transform:translate(20px,30px) scale(.5);opacity:0}to{transform:none;opacity:1}}
.led-moonBlossom .mb-arc{fill:none;stroke:#cfd8ff;stroke-width:1.4;stroke-dasharray:2 4;opacity:.7}
.led-moonBlossom .lnp{fill:#ffffff;stroke:#c8d3ff;stroke-width:.5;filter:drop-shadow(0 0 2px #dfe6ff)}.led-moonBlossom .lnc{fill:#ffe08a}
.led-moonBlossom .mb-fl{transform-box:fill-box;transform-origin:center;animation:mb-pulse calc(3s / var(--as,1)) ease-in-out infinite}
@keyframes mb-pulse{0%,100%{transform:scale(1);opacity:.9}50%{transform:scale(1.12) rotate(15deg);opacity:1}}
.led-moonBlossom .le-enter .mb-fl{animation:sk-open calc(var(--d)*.8) cubic-bezier(.2,1.4,.3,1) both}
.led-moonBlossom .mb-sp${LN_TW}
.led-moonBlossom .mb-shine .mb-m{animation:mb-sh 1.1s ease}
@keyframes mb-sh{40%{filter:drop-shadow(0 0 18px #fff) brightness(1.3)}}
.led-moonBlossom.lec-clear .le-plate{border-radius:calc(var(--u)*1.4);background:linear-gradient(180deg,#141a33ee,#080b1aee);border:calc(var(--u)*.05) solid #dfe6ff;box-shadow:0 0 calc(var(--u)*.7*var(--gl)) #c8d3ff66}
`};

// ---------------- 7) Emerald Vines ----------------
const EV_PATH="M100 168C60 170 34 140 34 104C34 64 64 34 100 34C140 34 166 64 166 104C166 128 152 150 132 160";
const EV_LEAVES=[[.08,1],[.2,-1],[.32,1],[.44,-1],[.56,1],[.68,-1],[.8,1],[.92,-1]];
const emeraldVines={id:"emeraldVines",n:7,cat:"nature",name:"Emerald Vines",ar:"الكرمة الزمردية",pal:"green",frame:"gold",lay:"stack",
 desc:"كرمة تنمو وتلتف حول الإطار وتظهر أوراقها الزمردية بالتتابع مع قطرات ندى لامعة",
 back:()=>"",
 front:()=>{ // نحسب نقاط الأوراق على المسار تقريبياً عبر دائرة بنفس الشكل
  const L=EV_LEAVES.map(([t,side],i)=>{ const a=90+t*320; const [x,y]=lnP(100,102,a,66); return `<g transform="translate(${x} ${y}) rotate(${(a+90+(side>0?-40:40)).toFixed(0)})"><path d="M0 0C3-5 11-7 16 0C11 7 3 5 0 0Z" class="ev-lf" style="animation-delay:calc(${(.4+t*1.2).toFixed(2)}s / var(--as,1))"/></g>` }).join("");
  const D=[.14,.5,.86].map((t,i)=>{ const [x,y]=lnP(100,102,90+t*320,66); return `<circle cx="${x}" cy="${y}" r="2.6" class="ev-dw" style="animation-delay:${i*.8}s"/>` }).join("");
  return `${LN_SVG}<path d="${EV_PATH}" class="ev-v" pathLength="100"/>${L}${D}</svg>` },
 pulse(c){ c.classList.remove("ev-grow"); void c.offsetWidth; c.classList.add("ev-grow"); setTimeout(()=>c.classList.remove("ev-grow"),1300) },
 css:`
.led-emeraldVines .ev-v{fill:none;stroke:#1f6b3a;stroke-width:3.4;stroke-linecap:round;stroke-dasharray:100;stroke-dashoffset:0;filter:drop-shadow(0 0 2px #2ee59d)}
.led-emeraldVines .le-enter .ev-v{animation:ev-draw calc(var(--d)*1.3) ease-out calc(var(--d)*.2) both}
@keyframes ev-draw{from{stroke-dashoffset:100}to{stroke-dashoffset:0}}
.led-emeraldVines .ev-lf{fill:#13c07a;stroke:#9dffd3;stroke-width:.6;transform-box:fill-box;transform-origin:0 50%;animation:ev-sw calc(3s / var(--as,1)) ease-in-out infinite;filter:drop-shadow(0 0 2px #2ee59d)}
@keyframes ev-sw{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(8deg)}}
.led-emeraldVines .le-enter .ev-lf{animation:ev-in calc(var(--d)*.5) cubic-bezier(.2,1.5,.3,1) both}
@keyframes ev-in{from{transform:scale(0);opacity:0}to{transform:none;opacity:1}}
.led-emeraldVines .ev-dw{fill:#e9fff6;filter:drop-shadow(0 0 3px #7dffc4);animation:ev-dw calc(2.4s / var(--as,1)) ease-in-out infinite}
@keyframes ev-dw{0%,100%{opacity:.4}50%{opacity:1}}
.led-emeraldVines .ev-grow .ev-lf{animation:ev-in .7s cubic-bezier(.2,1.5,.3,1)}
.led-emeraldVines.lec-clear .le-plate{border-radius:calc(var(--u)*.6);background:linear-gradient(180deg,#06261aee,#03130cee);border:calc(var(--u)*.06) solid #13c07a;box-shadow:0 0 0 calc(var(--u)*.05) #e8b84a,0 0 calc(var(--u)*.7*var(--gl)) #2ee59d66}
`};

// ---------------- 8) Snowflake Queen ----------------
const lnFlake=(r)=>{ let d=""; for(let i=0;i<6;i++){ const a=i*60; const [x,y]=lnP(100,100,a,r); d+=`M100 100L${x} ${y}`; for(const t of [.45,.72]){ const [bx,by]=lnP(100,100,a,r*t); const [l1x,l1y]=lnP(bx,by,a+40,r*.22); const [l2x,l2y]=lnP(bx,by,a-40,r*.22); d+=`M${bx} ${by}L${l1x} ${l1y}M${bx} ${by}L${l2x} ${l2y}` } } return d };
const snowflakeQueen={id:"snowflakeQueen",n:8,cat:"nature",name:"Snowflake Queen",ar:"ملكة الثلج",pal:"white",frame:"hex",lay:"stack",
 desc:"ندفة ثلج سداسية كبيرة تدور ببطء خلف إطار سداسي وندفات صغيرة تتساقط",
 back:()=>`${LN_SVG}<g class="sq-big"><path d="${lnFlake(92)}" class="sq-f"/><path d="${lnFlake(92)}" class="sq-f2"/>${[0,60,120,180,240,300].map(a=>{ const [x,y]=lnP(100,100,a,92); return `<circle cx="${x}" cy="${y}" r="3" class="sq-tip"/>` }).join("")}</g></svg>`,
 front:()=>{ const R=lnSeed(53); return `${LN_SVG}${Array.from({length:8},()=>{ const x=(10+R()*180).toFixed(0), s=(.12+R()*.12).toFixed(2), du=(6+R()*4).toFixed(1), dl=(-R()*9).toFixed(1); return `<g transform="translate(${x} -12)"><g class="sq-sm" style="animation-duration:calc(${du}s / var(--as,1));animation-delay:${dl}s"><path transform="scale(${s}) translate(-100 -100)" d="${lnFlake(60)}" class="sq-f3"/></g></g>` }).join("")}</svg>` },
 pulse(c){ c.classList.remove("sq-burst"); void c.offsetWidth; c.classList.add("sq-burst"); setTimeout(()=>c.classList.remove("sq-burst"),1200) },
 css:`
.led-snowflakeQueen .sq-f{fill:none;stroke:#bfe9ff;stroke-width:5;stroke-linecap:round;opacity:.35}
.led-snowflakeQueen .sq-f2{fill:none;stroke:#ffffff;stroke-width:1.8;stroke-linecap:round;filter:drop-shadow(0 0 3px #8fd8ff)}
.led-snowflakeQueen .sq-tip{fill:#fff;filter:drop-shadow(0 0 3px #bfe9ff)}
.led-snowflakeQueen .sq-big{transform-box:view-box;transform-origin:100px 100px;animation:le-spin calc(50s / var(--as,1)) linear infinite}
.led-snowflakeQueen .le-enter .sq-big{animation:sq-form calc(var(--d)*1.1) cubic-bezier(.2,1.2,.3,1) calc(var(--d)*.15) both}
@keyframes sq-form{from{transform:scale(.2) rotate(-120deg);opacity:0}to{transform:none;opacity:1}}
.led-snowflakeQueen .sq-f3{fill:none;stroke:#fff;stroke-width:6;stroke-linecap:round}
.led-snowflakeQueen .sq-sm{animation:sq-fall 8s linear infinite}
@keyframes sq-fall{0%{transform:translate(0,0) rotate(0);opacity:0}10%{opacity:.9}100%{transform:translate(20px,230px) rotate(360deg);opacity:0}}
.led-snowflakeQueen .sq-burst .sq-big{animation:sq-b 1.1s ease}
@keyframes sq-b{40%{transform:scale(1.12) rotate(30deg);filter:brightness(1.8)}100%{transform:rotate(60deg)}}
.led-snowflakeQueen.lec-clear .le-plate{background:none;border:0;box-shadow:none;border-radius:0;filter:drop-shadow(0 0 calc(var(--u)*.3*var(--gl)) #bfe9ff)}
.led-snowflakeQueen.lec-clear .le-plate::before,.led-snowflakeQueen.lec-clear .le-plate::after{content:"";position:absolute;inset:0;z-index:-1;clip-path:polygon(6% 0,94% 0,100% 50%,94% 100%,6% 100%,0 50%)}
.led-snowflakeQueen.lec-clear .le-plate::before{background:linear-gradient(90deg,#bfe9ff,#ffffff,#8fd8ff,#ffffff,#bfe9ff)}
.led-snowflakeQueen.lec-clear .le-plate::after{inset:calc(var(--u)*.07);background:linear-gradient(180deg,#0f1c2ef2,#070d18f2)}
`};

// ---------------- 9) Aurora Garden ----------------
const AU_BANDS=[["M-10 70C30 40 70 90 110 60S170 40 210 66","M-10 66C30 80 70 40 110 70S170 76 210 52","#2ee59d"],["M-10 92C40 62 80 110 120 82S180 70 210 92","M-10 86C40 104 80 66 120 92S180 100 210 78","#22d3ee"],["M-10 112C30 90 80 128 120 104S180 92 210 116","M-10 118C30 100 80 92 120 116S180 124 210 100","#b56bff"]];
const auroraGarden={id:"auroraGarden",n:9,cat:"nature",name:"Aurora Garden",ar:"حديقة الشفق",pal:"green",frame:"neon",lay:"stack",
 desc:"أشرطة شفق قطبي متموجة خلف الصورة بألوان أخضر وسماوي وبنفسجي مع جزيئات ضوء صاعدة",
 back:()=>`${LN_SVG}<defs>${AU_BANDS.map(([,,c],i)=>`<linearGradient id="aug${i}" x1="0" x2="1"><stop offset="0" stop-color="${c}" stop-opacity="0"/><stop offset=".5" stop-color="${c}" stop-opacity=".85"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></linearGradient>`).join("")}</defs>
  ${AU_BANDS.map(([a,b],i)=>`<path d="${a}" stroke="url(#aug${i})" class="au-b" style="stroke-width:${16-i*3}"><animate attributeName="d" dur="${6+i*1.5}s" repeatCount="indefinite" values="${a};${b};${a}" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/></path>`).join("")}</svg>`,
 front:()=>{ const R=lnSeed(67); return `${LN_SVG}${Array.from({length:10},()=>`<circle cx="${(16+R()*168).toFixed(0)}" cy="${(150+R()*30).toFixed(0)}" r="${(.8+R()*1.4).toFixed(1)}" class="au-p" style="animation-delay:${(-R()*6).toFixed(1)}s;animation-duration:calc(${(4+R()*4).toFixed(1)}s / var(--as,1))"/>`).join("")}</svg>` },
 pulse(c){ c.classList.remove("au-flash"); void c.offsetWidth; c.classList.add("au-flash"); setTimeout(()=>c.classList.remove("au-flash"),1300) },
 css:`
.led-auroraGarden .au-b{fill:none;stroke-linecap:round;filter:blur(2.5px);opacity:.9;mix-blend-mode:screen}
.led-auroraGarden .le-back{animation:au-hue calc(12s / var(--as,1)) ease-in-out infinite alternate}
@keyframes au-hue{from{filter:hue-rotate(0)}to{filter:hue-rotate(40deg)}}
.led-auroraGarden .le-enter .le-back{animation:au-in calc(var(--d)*1.2) ease both}
@keyframes au-in{from{clip-path:inset(0 100% 0 0);opacity:0}to{clip-path:inset(0);opacity:1}}
.led-auroraGarden .au-p{fill:#e9fff6;filter:drop-shadow(0 0 3px #7dffc4);animation:cl-rise 6s ease-in infinite}
.led-auroraGarden .au-flash .le-back{animation:au-f 1.2s ease}
@keyframes au-f{40%{filter:brightness(1.8) saturate(1.4)}}
.led-auroraGarden.lec-clear .le-plate{border-radius:calc(var(--u)*1);background:linear-gradient(180deg,#071a1fee,#040c12ee);border:calc(var(--u)*.06) solid transparent;background-clip:padding-box;box-shadow:0 0 0 calc(var(--u)*.06) #22d3ee,0 0 calc(var(--u)*.8*var(--gl)) #2ee59d66,inset 0 0 calc(var(--u)*.6) #b56bff33}
`};

// ---------------- 10) Floating Clouds ----------------
const lnCloud=(w)=>`<path d="M${-w} 0C${-w} ${-w*.35} ${-w*.6} ${-w*.5} ${-w*.35} ${-w*.32}C${-w*.25} ${-w*.75} ${w*.2} ${-w*.8} ${w*.3} ${-w*.36}C${w*.65} ${-w*.55} ${w} ${-w*.3} ${w} 0Z" class="fc2-c"/>`;
const floatingClouds={id:"floatingClouds",n:10,cat:"nature",name:"Floating Clouds",ar:"الغيوم الطافية",pal:"white",frame:"circle",lay:"stack",
 desc:"طبقات غيوم ناعمة تنجرف بسرعات مختلفة تحت الصورة وحولها مع نجوم صغيرة تتلألأ",
 back:()=>`${LN_SVG}<g class="fc2-l a"><g transform="translate(40 150)">${lnCloud(34)}</g><g transform="translate(160 146)">${lnCloud(30)}</g><g transform="translate(26 92)">${lnCloud(18)}</g></g>
  <g class="fc2-l b"><g transform="translate(100 168)">${lnCloud(46)}</g><g transform="translate(178 96)">${lnCloud(16)}</g></g></svg>`,
 front:()=>`${LN_SVG}${[[30,40,4],[70,14,3],[130,12,3.5],[172,40,4],[100,4,2.5]].map(([x,y,s],i)=>`<path d="${lnSpark(x,y,s)}" class="fc2-sp" style="animation-delay:${(i*.45).toFixed(2)}s"/>`).join("")}<g class="fc2-l c"><g transform="translate(150 178)">${lnCloud(26)}</g><g transform="translate(52 182)">${lnCloud(22)}</g></g></svg>`,
 pulse(c){ c.classList.remove("fc2-puff"); void c.offsetWidth; c.classList.add("fc2-puff"); setTimeout(()=>c.classList.remove("fc2-puff"),1100) },
 css:`
.led-floatingClouds .fc2-c{fill:#ffffff;opacity:.92;filter:drop-shadow(0 3px 4px #7aa2ff55)}
.led-floatingClouds .fc2-l.a .fc2-c{fill:#eef3ff}.led-floatingClouds .fc2-l.b .fc2-c{fill:#dfe9ff;opacity:.8}
.led-floatingClouds .fc2-l.a{animation:fc2-drift calc(9s / var(--as,1)) ease-in-out infinite alternate}
.led-floatingClouds .fc2-l.b{animation:fc2-drift calc(13s / var(--as,1)) ease-in-out infinite alternate-reverse}
.led-floatingClouds .fc2-l.c{animation:fc2-drift calc(7s / var(--as,1)) ease-in-out infinite alternate-reverse}
@keyframes fc2-drift{from{transform:translateX(-8px)}to{transform:translateX(8px)}}
.led-floatingClouds .le-enter .fc2-l{animation:fc2-in calc(var(--d)*1) cubic-bezier(.2,1,.3,1) both}
@keyframes fc2-in{from{transform:translateY(30px);opacity:0}to{transform:none;opacity:1}}
.led-floatingClouds .fc2-sp${LN_TW}
.led-floatingClouds .fc2-puff .fc2-l{animation:fc2-p 1s ease}
@keyframes fc2-p{40%{transform:scale(1.06);filter:brightness(1.15)}}
.led-floatingClouds.lec-clear .le-plate{border-radius:calc(var(--u)*2);background:linear-gradient(180deg,#3a5294ee,#1b2a5cee);border:calc(var(--u)*.06) solid #ffffffcc;box-shadow:0 6px 16px #3b5bdb55,0 0 calc(var(--u)*.6*var(--gl)) #dfe9ff66}
`};

leRegister([sakura,goldenRose,crystalLotus,enchantedForest,moonBlossom,emeraldVines,snowflakeQueen,auroraGarden,floatingClouds]);
