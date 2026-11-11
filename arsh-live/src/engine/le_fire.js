// ====== آخر التفاعلات — المجموعة الرابعة: النار والطاقة (31، 33–40) ======
import { leRegister } from "./leview.js";

const LF_SVG='<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">';
const lfP=(cx,cy,a,r)=>[+(cx+Math.cos(a*Math.PI/180)*r).toFixed(1),+(cy+Math.sin(a*Math.PI/180)*r).toFixed(1)];
const lfSeed=s=>()=>((s=(s*9301+49297)%233280)/233280);
const lfFlash=(cls,ms=1100)=>c=>{ c.classList.remove(cls); void c.offsetWidth; c.classList.add(cls); setTimeout(()=>c.classList.remove(cls),ms) };
const LF_FL="M0 0C-7-3-9-12-4-20C-3-14-1-13 0-16C2-22 0-27 3-31C8-23 11-11 6-3C4-1 2 0 0 0Z";
const lfEmbers=(seed,n,cls="lf-em")=>{ const R=lfSeed(seed); return Array.from({length:n},()=>`<circle cx="${(30+R()*140).toFixed(0)}" cy="${(110+R()*60).toFixed(0)}" r="${(.9+R()*1.4).toFixed(1)}" class="${cls}" style="animation-delay:${(-R()*3).toFixed(1)}s;animation-duration:calc(${(2+R()*2).toFixed(1)}s / var(--as,1))"/>`).join("") };
const LF_EM=id=>`.led-${id} .lf-em{fill:#ffcc4d;opacity:0;animation:lf-up 3s ease-out infinite}`;
const LF_PLATE=(id,c1,c2,bg1,bg2,clip)=>`.led-${id}.lec-clear .le-plate{border-radius:${clip?"0":"calc(var(--u)*.6)"};background:linear-gradient(180deg,${bg1},${bg2});border:calc(var(--u)*.06) solid ${c1};box-shadow:0 0 calc(var(--u)*.8*var(--gl)) ${c2};${clip?`clip-path:${clip}`:""}}`;
const LF_FLAMEGRAD=(id,a,b,c)=>`<linearGradient id="${id}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${a}"/><stop offset=".55" stop-color="${b}"/><stop offset="1" stop-color="${c}" stop-opacity=".9"/></linearGradient>`;

// ---------------- 31) Phoenix Flame ----------------
const lfPhWing=()=>Array.from({length:7},(_,i)=>{ const a=-70+i*14, len=48+(i<3?i*8:(6-i)*6)+14; return `<g transform="rotate(${a} 72 100)"><path d="M72 100C64 94 ${72-len*.55} 90 ${72-len} 98C${72-len*.6} 104 64 106 72 100Z" class="ph-f" style="animation-delay:${(i*.08).toFixed(2)}s"/></g>` }).join("");
const phoenix={id:"phoenix",n:31,cat:"fire",name:"Phoenix Flame",ar:"العنقاء النارية",pal:"red",frame:"fire",lay:"stack",
 desc:"جناحا عنقاء من ريش ناري يرفرفان وذيل لهب ينسدل أسفل الصورة وجمرات تصعد",
 back:()=>`${LF_SVG}<defs>${LF_FLAMEGRAD("phg","#c4160a","#ff7a00","#ffe27a")}<linearGradient id="phw" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#ffe27a"/><stop offset=".5" stop-color="#ff7a00"/><stop offset="1" stop-color="#c4160a"/></linearGradient></defs>
  <g class="ph-w l">${lfPhWing()}</g><g transform="translate(200 0) scale(-1 1)"><g class="ph-w r">${lfPhWing()}</g></g>
  ${[-16,0,16].map((x,i)=>`<g transform="translate(${100+x} 150) rotate(180) scale(${i===1?1.5:1.1})"><path d="${LF_FL}" fill="url(#phg)" class="ph-tail" style="animation-delay:${i*.15}s"/></g>`).join("")}${lfEmbers(3,9)}</svg>`,
 front:()=>"",
 pulse:lfFlash("ph-rise"),
 css:`${LF_EM("phoenix")}
.led-phoenix .ph-f{fill:url(#phw);stroke:#ffd27a;stroke-width:.4;transform-box:fill-box;transform-origin:100% 50%;animation:ph-fl calc(.9s / var(--as,1)) ease-in-out infinite alternate}
@keyframes ph-fl{from{transform:scaleX(1)}to{transform:scaleX(1.08) scaleY(.92)}}
.led-phoenix .ph-w{transform-box:view-box;transform-origin:72px 100px;animation:ph-flap calc(2.4s / var(--as,1)) ease-in-out infinite}
.led-phoenix .le-back svg{filter:drop-shadow(0 0 4px #ff7a00)}
@keyframes ph-flap{0%,100%{transform:rotate(4deg)}50%{transform:rotate(-12deg)}}
.led-phoenix .le-enter .ph-w{animation:cr-open calc(var(--d)*1) cubic-bezier(.2,1.2,.3,1) calc(var(--d)*.2) both}
.led-phoenix .ph-tail{transform-box:fill-box;transform-origin:50% 100%;animation:fl-flick .6s ease-in-out infinite alternate}
.led-phoenix .ph-rise .ph-w{animation:pw-big .9s ease}.led-phoenix .ph-rise .le-back{animation:fl-flare .9s ease}
${LF_PLATE("phoenix","#ff7a00","#ff5a0066","#2a0804f0","#120302f0")}
`};

// ---------------- 33) Blue Flame ----------------
const blueFlame={id:"blueFlame",n:33,cat:"fire",name:"Blue Flame",ar:"اللهب الأزرق",pal:"blue",frame:"neon",lay:"stack",
 desc:"شعلة لهب أزرق عملاقة تتصاعد من خلف الصورة بألسنة متفاوتة الطول وقلب أبيض وشرارات زرقاء",
 back:()=>{ const R=lfSeed(19); let fl=""; const cols=[[44,2.4],[64,3.3],[84,3.9],[100,4.4],[116,3.9],[136,3.3],[156,2.4]];
  for(const [x,sc] of cols){ const du=(.45+R()*.35).toFixed(2), dl=(-R()).toFixed(2); fl+=`<g transform="translate(${x} 150) scale(${sc})"><path d="${LF_FL}" class="bf2 o" style="animation-duration:${du}s;animation-delay:${dl}s"/><path d="M0 0C-3-2-4-7-1-12C0-8 2-8 2-10C4-6 3-2 0 0Z" class="bf2 i" style="animation-duration:${du}s;animation-delay:${dl}s"/></g>` }
  return `${LF_SVG}<defs>${LF_FLAMEGRAD("bfg2","#0a3cff","#2fb8ff","#e8fbff")}<radialGradient id="bfgl"><stop offset=".5" stop-color="#2f8bff" stop-opacity=".5"/><stop offset="1" stop-color="#2f8bff" stop-opacity="0"/></radialGradient></defs><circle cx="100" cy="96" r="90" fill="url(#bfgl)" class="bf2-gl"/>${fl}${lfEmbers(23,8,"lf-em b")}</svg>` },
 front:()=>"",
 pulse:lfFlash("fl-flare",900),
 css:`${LF_EM("blueFlame")}
.led-blueFlame .lf-em.b{fill:#aee6ff}
.led-blueFlame .bf2{transform-box:fill-box;transform-origin:50% 100%;animation:fl-flick .6s ease-in-out infinite alternate}
.led-blueFlame .bf2.o{fill:url(#bfg2);filter:drop-shadow(0 0 3px #2fb8ff)}.led-blueFlame .bf2.i{fill:#f2fdff;opacity:.85}
.led-blueFlame .bf2-gl{animation:fl-gl calc(1.6s / var(--as,1)) ease-in-out infinite alternate;transform-box:fill-box;transform-origin:center}
.led-blueFlame .le-enter .le-back{animation:lei-ignite calc(var(--d)*1) ease both}
.led-blueFlame .fl-flare .le-back{animation:fl-flare .85s ease}
${LF_PLATE("blueFlame","#2fb8ff","#2f8bff77","#041430f0","#020818f0")}
`};

// ---------------- 34) Dragon Fire ----------------
const DR_BODY="M150 168C186 140 192 90 168 56C146 24 100 14 64 30C34 44 16 78 24 112C30 140 52 162 80 170";
const dragonFire={id:"dragonFire",n:34,cat:"fire",name:"Dragon Fire",ar:"نار التنين",pal:"red",frame:"fire",lay:"stack",
 desc:"تنين زخرفي يلتف جسده المحرشف حول الإطار ورأسه يقذف نفثات لهب",
 back:()=>`${LF_SVG}<defs>${LF_FLAMEGRAD("drf","#c4160a","#ff7a00","#ffe27a")}</defs><path d="${DR_BODY}" class="dr-b"/><path d="${DR_BODY}" class="dr-sc"/>
  ${[0.12,.3,.48,.66].map(t=>{ const a=60-t*330; const [x,y]=lfP(100,98,a,84); return `<path d="M${x} ${y}l${(Math.cos((a+90)*Math.PI/180)*9).toFixed(1)} ${(Math.sin((a+90)*Math.PI/180)*9-6).toFixed(1)}l4 6Z" class="dr-sp"/>` }).join("")}
  <path d="M80 170C92 174 104 172 110 166L104 160C98 166 90 168 80 170Z" class="dr-tail"/></svg>`,
 front:()=>`${LF_SVG}<g class="dr-head" transform="translate(150 168) rotate(-40)"><path d="M0 0C6-10 18-14 28-10L36-4L28 0L36 4L26 8C16 12 6 8 0 0Z" class="dr-h"/><path d="M8-8L2-20L14-12Z" class="dr-horn"/><circle cx="20" cy="-4" r="1.8" class="dr-eye"/>
  <g class="dr-breath" transform="translate(38 0)">${[0,1,2].map(i=>`<g transform="rotate(90) scale(${1.1-i*.2}) translate(0 ${i*10})"><path d="${LF_FL}" fill="url(#drf)" class="dr-fb" style="animation-delay:${i*.2}s"/></g>`).join("")}</g></g></svg>`,
 pulse:lfFlash("dr-roar",1000),
 css:`
.led-dragonFire .dr-b{fill:none;stroke:#7a0e0a;stroke-width:13;stroke-linecap:round;filter:drop-shadow(0 0 4px #ff5a00)}
.led-dragonFire .dr-sc{fill:none;stroke:#e8572a;stroke-width:9;stroke-linecap:round;stroke-dasharray:6 4;animation:dr-crawl calc(2s / var(--as,1)) linear infinite}
@keyframes dr-crawl{to{stroke-dashoffset:-20}}
.led-dragonFire .dr-sp{fill:#ffb347}
.led-dragonFire .dr-tail{fill:#7a0e0a}
.led-dragonFire .dr-h{fill:#a8150e;stroke:#ffb347;stroke-width:1}.led-dragonFire .dr-horn{fill:#ffd27a}.led-dragonFire .dr-eye{fill:#ffe27a;filter:drop-shadow(0 0 2px #ffe27a)}
.led-dragonFire .dr-fb{transform-box:fill-box;transform-origin:50% 100%;animation:dr-puff calc(1.4s / var(--as,1)) ease-out infinite}
@keyframes dr-puff{0%{transform:scale(.2);opacity:0}30%{opacity:1}100%{transform:scale(1.3,1.6);opacity:0}}
.led-dragonFire .le-enter .dr-b,.led-dragonFire .le-enter .dr-sc{stroke-dasharray:400;animation:ef-grow calc(var(--d)*1.2) ease both}
.led-dragonFire .dr-roar .dr-fb{animation-duration:.5s}
.led-dragonFire .dr-roar .dr-head{animation:dr-r .9s ease}
@keyframes dr-r{30%{filter:brightness(1.6) drop-shadow(0 0 8px #ff7a00)}}
${LF_PLATE("dragonFire","#e8572a","#ff5a0066","#240604f0","#100201f0","polygon(4% 0,100% 0,96% 100%,0 100%)")}
`};

// ---------------- 35) Lava Core ----------------
const lavaCore={id:"lavaCore",n:35,cat:"fire",name:"Lava Core",ar:"نواة الحمم",pal:"red",frame:"fire",lay:"stack",
 desc:"حلقة صخرية داكنة بشقوق حمم متوهجة تنبض وفقاعات حمم تغلي وتنفجر حولها",
 back:()=>{ const R=lfSeed(37); const cr=Array.from({length:9},(_,i)=>{ const a=i*40+R()*15; let d=""; let r=50; let [x,y]=lfP(100,100,a,r); d=`M${x} ${y}`; for(let k=0;k<3;k++){ r+=8+R()*6; [x,y]=lfP(100,100,a+(R()-.5)*18,r); d+=`L${x} ${y}` } return `<path d="${d}" class="lv-cr" style="animation-delay:${(i*.3).toFixed(1)}s"/>` }).join("");
  const bub=Array.from({length:8},(_,i)=>{ const [x,y]=lfP(100,100,i*45+R()*20,72+R()*10); return `<circle cx="${x}" cy="${y}" r="${(3+R()*3).toFixed(1)}" class="lv-bb" style="animation-delay:${(-R()*2.5).toFixed(1)}s"/>` }).join("");
  return `${LF_SVG}<defs><radialGradient id="lvr"><stop offset=".5" stop-color="#2a1410"/><stop offset=".8" stop-color="#3b1a12"/><stop offset="1" stop-color="#160806"/></radialGradient><radialGradient id="lvg"><stop offset=".55" stop-color="#ff5a00" stop-opacity=".6"/><stop offset="1" stop-color="#ff2a00" stop-opacity="0"/></radialGradient></defs>
  <circle cx="100" cy="100" r="96" fill="url(#lvg)" class="lv-gl"/><circle cx="100" cy="100" r="80" fill="url(#lvr)" stroke="#5a2a14" stroke-width="2"/>${cr}${bub}</svg>` },
 front:()=>"",
 pulse:lfFlash("lv-erupt",1100),
 css:`
.led-lavaCore .lv-cr{fill:none;stroke:#ffb300;stroke-width:2.4;stroke-linejoin:round;filter:drop-shadow(0 0 3px #ff5a00);animation:lv-p calc(2.4s / var(--as,1)) ease-in-out infinite}
@keyframes lv-p{0%,100%{stroke:#ff6a00;opacity:.7}50%{stroke:#ffe27a;opacity:1}}
.led-lavaCore .lv-bb{fill:#ff7a00;filter:drop-shadow(0 0 3px #ff5a00);transform-box:fill-box;transform-origin:center;animation:lv-b calc(2.5s / var(--as,1)) ease-in infinite}
@keyframes lv-b{0%{transform:scale(0);opacity:0}60%{transform:scale(1);opacity:1}80%{transform:scale(1.3);opacity:.6}100%{transform:scale(1.6);opacity:0}}
.led-lavaCore .lv-gl{animation:fl-gl calc(2s / var(--as,1)) ease-in-out infinite alternate;transform-box:fill-box;transform-origin:center}
.led-lavaCore .le-enter .lv-cr{stroke-dasharray:60;animation:ef-grow calc(var(--d)*1) ease calc(var(--d)*.3) both}
.led-lavaCore .lv-erupt .le-back{animation:fl-flare 1s ease}
${LF_PLATE("lavaCore","#ff6a00","#ff2a0066","#1e0a06f0","#0c0402f0")}
`};

// ---------------- 36) Lightning Storm ----------------
const lfBolt=(seed,x0,y0,x1,y1)=>{ const R=lfSeed(seed); let d=`M${x0} ${y0}`, br=""; const n=6; for(let i=1;i<=n;i++){ const t=i/n; const x=x0+(x1-x0)*t+(i<n?(R()-.5)*16:0), y=y0+(y1-y0)*t; d+=`L${x.toFixed(0)} ${y.toFixed(0)}`; if(i===3) br=`M${x.toFixed(0)} ${y.toFixed(0)}L${(x+(R()<.5?-14:14)).toFixed(0)} ${(y+12).toFixed(0)}L${(x+(R()<.5?-8:20)).toFixed(0)} ${(y+24).toFixed(0)}` } return d+br };
const lightningStorm={id:"lightningStorm",n:36,cat:"fire",name:"Lightning Storm",ar:"العاصفة البرقية",pal:"blue",frame:"neon",lay:"stack",
 desc:"غيوم عاصفة داكنة فوق الصورة وبروق متفرعة تومض بتوقيتات عشوائية حولها",
 back:()=>`${LF_SVG}${[[20,12,40,96],[176,10,160,100],[60,0,30,70],[146,4,176,70]].map((b,i)=>`<path d="${lfBolt(11+i*7,...b)}" class="ls-bolt" style="animation-delay:calc(${(i*.9).toFixed(1)}s / var(--as,1))"/>`).join("")}</svg>`,
 front:()=>`${LF_SVG}<g class="ls-cl">${[[40,22,24],[70,12,26],[104,8,28],[136,14,26],[164,24,22]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" class="ls-c"/>`).join("")}</g></svg>`,
 pulse:lfFlash("ls-strike",900),
 css:`
.led-lightningStorm .ls-bolt{fill:none;stroke:#eaf6ff;stroke-width:2.2;stroke-linejoin:round;filter:drop-shadow(0 0 3px #7cc4ff) drop-shadow(0 0 8px #3ba8ff);opacity:0;animation:ls-fl calc(3.6s / var(--as,1)) steps(1) infinite}
@keyframes ls-fl{0%,8%,14%,100%{opacity:0}9%,12%{opacity:1}10%{opacity:.3}}
.led-lightningStorm .ls-c{fill:#2a3448;opacity:.9}
.led-lightningStorm .ls-cl{filter:blur(2px) drop-shadow(0 4px 4px #000a);animation:ls-cf calc(3.6s / var(--as,1)) steps(1) infinite}
@keyframes ls-cf{0%,8%,14%,100%{filter:blur(2px) drop-shadow(0 4px 4px #000a)}9%,12%{filter:blur(2px) brightness(2.2) drop-shadow(0 0 8px #bfe3ff)}}
.led-lightningStorm .le-enter .ls-cl{animation:fc2-in calc(var(--d)*.9) ease both}
.led-lightningStorm .ls-strike .ls-bolt{animation:ls-s .8s steps(1)}
@keyframes ls-s{0%,30%,60%{opacity:1}15%,45%,100%{opacity:0}}
.led-lightningStorm .ls-strike .le-stage{animation:ls-shake .4s ease}
@keyframes ls-shake{25%{transform:translateX(-2%)}50%{transform:translateX(2%)}75%{transform:translateX(-1%)}}
${LF_PLATE("lightningStorm","#9fd3ff","#3ba8ff77","#0a1428f0","#040814f0","polygon(3% 0,100% 0,97% 100%,0 100%)")}
`};

// ---------------- 37) Electric Halo ----------------
const lfJag=(seed,r,amp)=>{ const R=lfSeed(seed); let d=""; for(let i=0;i<=48;i++){ const [x,y]=lfP(100,100,i*7.5,r+(i%48?(R()-.5)*amp:0)); d+=(i?"L":"M")+x+" "+y } return d+"Z" };
const electricHalo={id:"electricHalo",n:37,cat:"fire",name:"Electric Halo",ar:"الهالة الكهربائية",pal:"blue",frame:"neon",lay:"stack",
 desc:"هالة كهربائية متعرجة تتغير باستمرار حول الإطار مع شرارات قصيرة تقفز منها",
 back:()=>`${LF_SVG}${[0,1].map(k=>`<path d="${lfJag(5+k,56+k*8,10)}" class="eh-j ${k?"b":""}"><animate attributeName="d" dur="${k?.45:.3}s" repeatCount="indefinite" values="${lfJag(5+k,56+k*8,10)};${lfJag(9+k,56+k*8,12)};${lfJag(13+k,56+k*8,9)};${lfJag(5+k,56+k*8,10)}"/></path>`).join("")}</svg>`,
 front:()=>`${LF_SVG}${[30,110,200,290].map((a,i)=>{ const [x1,y1]=lfP(100,100,a,62), [x2,y2]=lfP(100,100,a+6,78), [x3,y3]=lfP(100,100,a-3,88); return `<path d="M${x1} ${y1}L${x2} ${y2}L${x3} ${y3}" class="eh-s" style="animation-delay:calc(${(i*.6).toFixed(1)}s / var(--as,1))"/>` }).join("")}</svg>`,
 pulse:lfFlash("eh-surge",900),
 css:`
.led-electricHalo .eh-j{fill:none;stroke:#bfe9ff;stroke-width:1.8;filter:drop-shadow(0 0 3px #3ba8ff) drop-shadow(0 0 7px #1e7bff)}
.led-electricHalo .eh-j.b{stroke:#7cc4ff;stroke-width:1.1;opacity:.75}
.led-electricHalo .eh-s{fill:none;stroke:#fff;stroke-width:1.4;filter:drop-shadow(0 0 3px #7cc4ff);opacity:0;animation:ls-fl calc(2.4s / var(--as,1)) steps(1) infinite}
.led-electricHalo .le-enter .le-back{animation:lei-holo calc(var(--d)*.9) ease both}
.led-electricHalo .eh-surge .eh-j{animation:eh-s .8s ease}
@keyframes eh-s{30%{stroke-width:4;stroke:#fff}}
${LF_PLATE("electricHalo","#7cc4ff","#1e7bff77","#06142cf0","#020814f0")}
`};

// ---------------- 38) Solar Burst ----------------
const solarBurst={id:"solarBurst",n:38,cat:"fire",name:"Solar Burst",ar:"الانفجار الشمسي",pal:"gold",frame:"gold",lay:"stack",
 desc:"أشعة ضوء طويلة دافئة تنبض للخارج بالتتابع كانفجار شمسي ناعم خلف الصورة",
 back:()=>`${LF_SVG}<defs><linearGradient id="sbg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff3b0" stop-opacity=".95"/><stop offset="1" stop-color="#ff9a00" stop-opacity="0"/></linearGradient><radialGradient id="sbc"><stop offset=".4" stop-color="#fff3b0" stop-opacity=".9"/><stop offset="1" stop-color="#ffb300" stop-opacity="0"/></radialGradient></defs>
  <circle cx="100" cy="100" r="70" fill="url(#sbc)" class="sb-core"/>${Array.from({length:12},(_,i)=>`<g transform="rotate(${i*30} 100 100)"><path d="M146 95L198 100L146 105Z" fill="url(#sbg)" class="sb-ray" style="animation-delay:calc(${(i*.12).toFixed(2)}s / var(--as,1))"/></g>`).join("")}</svg>`,
 front:()=>"",
 pulse:lfFlash("sb-pop",1000),
 css:`
.led-solarBurst .sb-ray{transform-box:fill-box;transform-origin:0 50%;animation:sb-r calc(2.2s / var(--as,1)) ease-in-out infinite}
@keyframes sb-r{0%,100%{transform:scaleX(.55);opacity:.5}50%{transform:scaleX(1);opacity:1}}
.led-solarBurst .sb-core{animation:le-breath calc(2.2s / var(--as,1)) ease-in-out infinite;transform-box:fill-box;transform-origin:center;mix-blend-mode:screen}
.led-solarBurst .le-enter .sb-ray{animation:sb-in calc(var(--d)*.8) cubic-bezier(.2,1.2,.3,1) both}
@keyframes sb-in{from{transform:scaleX(0);opacity:0}to{transform:none;opacity:1}}
.led-solarBurst .sb-pop .sb-ray{animation:sb-p .9s ease}
@keyframes sb-p{35%{transform:scaleX(1.35);opacity:1;filter:brightness(1.6)}}
${LF_PLATE("solarBurst","#ffcf3d","#ffb30066","#2a1a04f0","#120b02f0")}
`};

// ---------------- 39) Energy Reactor ----------------
const lfArcs=(r,n,gap,w,cls)=>Array.from({length:n},(_,i)=>{ const a0=i*360/n+gap/2, a1=(i+1)*360/n-gap/2; const [x0,y0]=lfP(100,100,a0,r), [x1,y1]=lfP(100,100,a1,r); return `<path d="M${x0} ${y0}A${r} ${r} 0 0 1 ${x1} ${y1}" class="${cls}" style="stroke-width:${w}"/>` }).join("");
const energyReactor={id:"energyReactor",n:39,cat:"fire",name:"Energy Reactor",ar:"مفاعل الطاقة",pal:"green",frame:"neon",lay:"stack",
 desc:"مفاعل بثلاث حلقات مقطّعة تدور باتجاهات مختلفة ونواة طاقة تنبض وعلامات تقنية",
 back:()=>{ let ticks=""; for(let i=0;i<60;i++){ const [x1,y1]=lfP(100,100,i*6,86), [x2,y2]=lfP(100,100,i*6,i%5?89:93); ticks+=`M${x1} ${y1}L${x2} ${y2}` }
  return `${LF_SVG}<defs><radialGradient id="erc"><stop offset=".5" stop-color="#2ee59d" stop-opacity=".55"/><stop offset="1" stop-color="#2ee59d" stop-opacity="0"/></radialGradient></defs><circle cx="100" cy="100" r="80" fill="url(#erc)" class="er-core"/>
  <path d="${ticks}" class="er-tk"/><g class="er-a">${lfArcs(78,6,14,4,"er-r1")}</g><g class="er-b">${lfArcs(68,12,8,2.5,"er-r2")}</g><g class="er-c">${lfArcs(58,3,30,5,"er-r3")}</g></svg>` },
 front:()=>"",
 pulse:lfFlash("er-charge",1100),
 css:`
.led-energyReactor .er-a,.led-energyReactor .er-b,.led-energyReactor .er-c{transform-box:view-box;transform-origin:100px 100px}
.led-energyReactor .er-a{animation:le-spin calc(10s / var(--as,1)) linear infinite}.led-energyReactor .er-b{animation:le-spin calc(6s / var(--as,1)) linear infinite reverse}.led-energyReactor .er-c{animation:le-spin calc(4s / var(--as,1)) linear infinite}
.led-energyReactor .er-r1{fill:none;stroke:#2ee59d;filter:drop-shadow(0 0 3px #2ee59d)}.led-energyReactor .er-r2{fill:none;stroke:#7dffc4;opacity:.8}.led-energyReactor .er-r3{fill:none;stroke:#d8fff0;filter:drop-shadow(0 0 4px #7dffc4)}
.led-energyReactor .er-tk{stroke:#2ee59d;stroke-width:1;opacity:.5}
.led-energyReactor .er-core{animation:le-breath calc(1.6s / var(--as,1)) ease-in-out infinite;transform-box:fill-box;transform-origin:center}
.led-energyReactor .le-enter .er-a,.led-energyReactor .le-enter .er-b,.led-energyReactor .le-enter .er-c{animation:np-in calc(var(--d)*.9) cubic-bezier(.2,1.2,.3,1) both}
.led-energyReactor .er-charge .er-c{animation-duration:.5s}.led-energyReactor .er-charge .er-core{animation:er-ch 1s ease}
@keyframes er-ch{35%{transform:scale(1.25);filter:brightness(2)}}
${LF_PLATE("energyReactor","#2ee59d","#2ee59d66","#04180ff0","#020c07f0","polygon(4% 0,96% 0,100% 30%,100% 70%,96% 100%,4% 100%,0 70%,0 30%)")}
`};

// ---------------- 40) Inferno Crown ----------------
const infernoCrown={id:"infernoCrown",n:40,cat:"fire",name:"Inferno Crown",ar:"تاج الجحيم",pal:"red",frame:"fire",lay:"stack",
 desc:"تاج من ألسنة لهب فوق الصورة بقاعدة ذهبية وجواهر حمراء وجمرات تتطاير",
 back:()=>`${LF_SVG}<defs><radialGradient id="icg"><stop offset=".5" stop-color="#ff5a00" stop-opacity=".45"/><stop offset="1" stop-color="#ff2a00" stop-opacity="0"/></radialGradient></defs><circle cx="100" cy="60" r="60" fill="url(#icg)" class="ic-gl"/>${lfEmbers(59,8)}</svg>`,
 front:()=>`${LF_SVG}<defs>${LF_FLAMEGRAD("icf","#c4160a","#ff7a00","#ffe27a")}<linearGradient id="icb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3c4"/><stop offset=".5" stop-color="#f6c94a"/><stop offset="1" stop-color="#8a5a12"/></linearGradient></defs>
  <g class="ic-crown">${[[72,1],[86,1.35],[100,1.75],[114,1.35],[128,1]].map(([x,s],i)=>`<g transform="translate(${x} 58) scale(${s})"><path d="${LF_FL}" fill="url(#icf)" class="ic-fl" style="animation-delay:${(i*.13).toFixed(2)}s"/></g>`).join("")}
  <rect x="64" y="54" width="72" height="11" rx="2" fill="url(#icb)" stroke="#6b430b" stroke-width=".8"/>${[76,100,124].map(x=>`<path d="M${x} 55.5l3.5 4-3.5 4-3.5-4z" class="ic-gem"/>`).join("")}</g></svg>`,
 pulse:lfFlash("ic-blaze",1000),
 css:`${LF_EM("infernoCrown")}
.led-infernoCrown .ic-fl{transform-box:fill-box;transform-origin:50% 100%;animation:fl-flick .55s ease-in-out infinite alternate;filter:drop-shadow(0 0 3px #ff5a00)}
.led-infernoCrown .ic-gem{fill:#e0213a;stroke:#7a0e1a;stroke-width:.5}
.led-infernoCrown .ic-crown{transform-box:fill-box;transform-origin:50% 100%}
.led-infernoCrown .le-enter .ic-crown{animation:cr-drop calc(var(--d)*.8) cubic-bezier(.3,1.5,.4,1) calc(var(--d)*.55) both}
.led-infernoCrown .ic-gl{animation:fl-gl calc(1.4s / var(--as,1)) ease-in-out infinite alternate;transform-box:fill-box;transform-origin:center}
.led-infernoCrown .ic-blaze .ic-fl{animation:ic-b .9s ease}
@keyframes ic-b{35%{transform:scale(1.25,1.6);filter:brightness(1.6) drop-shadow(0 0 8px #ff7a00)}}
${LF_PLATE("infernoCrown","#ff7a00","#ff5a0066","#240604f0","#100201f0")}
`};

const LF_COMMON=`@keyframes lf-up{0%{opacity:0;transform:translateY(0)}20%{opacity:1}100%{opacity:0;transform:translate(4px,-50px) scale(.4)}}`;
leRegister([{...phoenix,css:phoenix.css+LF_COMMON},blueFlame,dragonFire,lavaCore,lightningStorm,electricHalo,solarBurst,energyReactor,infernoCrown]);
