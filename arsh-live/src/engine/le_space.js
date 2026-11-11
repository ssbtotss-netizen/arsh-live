// ====== آخر التفاعلات — المجموعة الثالثة: الفضاء والمجرات (22–30) ======
import { leRegister } from "./leview.js";

const LS_SVG='<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">';
const lsP=(cx,cy,a,r)=>[+(cx+Math.cos(a*Math.PI/180)*r).toFixed(1),+(cy+Math.sin(a*Math.PI/180)*r).toFixed(1)];
const lsSpark=(x,y,s)=>`M${x} ${y-s}Q${x} ${y} ${x+s} ${y}Q${x} ${y} ${x} ${y+s}Q${x} ${y} ${x-s} ${y}Q${x} ${y} ${x} ${y-s}Z`;
const lsSeed=s=>()=>((s=(s*9301+49297)%233280)/233280);
const LS_TW='{fill:#fff;transform-box:fill-box;transform-origin:center;opacity:0;animation:bf-tw calc(2.6s / var(--as,1)) ease-in-out infinite}';
const lsStars=(seed,n,cls="ls-st")=>{ const R=lsSeed(seed); return Array.from({length:n},()=>{ let x,y; do{ x=6+R()*188; y=6+R()*170 }while(Math.hypot(x-100,y-100)<56); return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(.5+R()*1.2).toFixed(1)}" class="${cls}" style="animation-delay:${(-R()*3).toFixed(1)}s"/>` }).join("") };
const lsSparks=pts=>pts.map(([x,y,s],i)=>`<path d="${lsSpark(x,y,s)}" class="ls-sp" style="animation-delay:${(i*.5).toFixed(2)}s"/>`).join("");
const lsFlash=(cls,ms=1200)=>c=>{ c.classList.remove(cls); void c.offsetWidth; c.classList.add(cls); setTimeout(()=>c.classList.remove(cls),ms) };
const LS_BASE=id=>`.led-${id} .ls-st{fill:#fff;animation:ls-tw calc(3s / var(--as,1)) ease-in-out infinite}.led-${id} .ls-sp${LS_TW}`;
const LS_PLATE=(id,c1,c2,bg1,bg2,r=1)=>`.led-${id}.lec-clear .le-plate{border-radius:calc(var(--u)*${r});background:linear-gradient(180deg,${bg1},${bg2});border:calc(var(--u)*.06) solid ${c1};box-shadow:0 0 calc(var(--u)*.8*var(--gl)) ${c2}}`;

// ---------------- 22) Cosmic Orbit ----------------
const CO_ORB=[[78,30,-20,7,"#ffb347",9],[68,22,25,5,"#7cc4ff",6.5],[88,40,70,4,"#d49bff",12]];
const lsEll=(rx,ry,rot)=>{ const a=rot*Math.PI/180; const p=t=>{ const x=Math.cos(t)*rx, y=Math.sin(t)*ry; return [(100+x*Math.cos(a)-y*Math.sin(a)).toFixed(1),(100+x*Math.sin(a)+y*Math.cos(a)).toFixed(1)] }; let d=""; for(let i=0;i<=36;i++){ const [x,y]=p(i/36*Math.PI*2); d+=(i?"L":"M")+x+" "+y } return d+"Z" };
const cosmicOrbit={id:"cosmicOrbit",n:22,cat:"space",name:"Cosmic Orbit",ar:"المدار الكوني",pal:"blue",frame:"neon",lay:"stack",
 desc:"ثلاثة مدارات مائلة تدور فيها كواكب صغيرة ملونة حول الصورة بسرعات مختلفة",
 back:()=>`${LS_SVG}${lsStars(5,16)}${CO_ORB.map(([rx,ry,rot])=>`<path d="${lsEll(rx,ry,rot)}" class="co-o"/>`).join("")}</svg>`,
 front:()=>`${LS_SVG}${CO_ORB.map(([rx,ry,rot,r,c,du],i)=>`<g><animateMotion dur="${du}s" begin="${-i*2}s" repeatCount="indefinite" path="${lsEll(rx,ry,rot)}"/><circle r="${r}" fill="${c}" class="co-p"/><circle r="${r}" fill="url(#cop)"/>${i===0?`<ellipse rx="${r*1.8}" ry="${r*.5}" class="co-ring"/>`:""}</g>`).join("")}<defs><radialGradient id="cop" cx="35%" cy="30%"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient></defs></svg>`,
 pulse:lsFlash("co-boost"),
 css:`${LS_BASE("cosmicOrbit")}
.led-cosmicOrbit .co-o{fill:none;stroke:var(--cp);stroke-width:.8;opacity:.45;stroke-dasharray:3 3}
.led-cosmicOrbit .co-p{filter:drop-shadow(0 0 4px currentColor)}
.led-cosmicOrbit .co-ring{fill:none;stroke:#ffe0a8;stroke-width:1.1}
.led-cosmicOrbit .le-enter .co-o{animation:co-in calc(var(--d)*.9) ease both;transform-box:view-box;transform-origin:100px 100px}
@keyframes co-in{from{transform:scale(.3) rotate(-90deg);opacity:0}to{transform:none;opacity:.45}}
.led-cosmicOrbit .co-boost .co-o{animation:co-b 1.1s ease}
@keyframes co-b{35%{opacity:1;stroke-width:2;filter:drop-shadow(0 0 4px var(--cp))}}
${LS_PLATE("cosmicOrbit","#7cc4ff","#3ba8ff66","#081428f0","#030914f0",1.4)}
`};

// ---------------- 23) Black Hole ----------------
const lsSpiral=(turns,r0,r1,a0)=>{ let d=""; const n=60; for(let i=0;i<=n;i++){ const t=i/n, a=a0+t*turns*360, r=r0+(r1-r0)*t; const [x,y]=lsP(100,100,a,r); d+=(i?"L":"M")+x+" "+y } return d };
const blackHole={id:"blackHole",n:23,cat:"space",name:"Black Hole",ar:"الثقب الأسود",pal:"red",frame:"neon",lay:"stack",
 desc:"قرص تراكمي متوهج يدور حول الصورة وحلقة فوتونات وجزيئات تُسحب للداخل بشكل حلزوني",
 back:()=>`${LS_SVG}<defs><radialGradient id="bhg"><stop offset=".45" stop-color="#000" stop-opacity=".9"/><stop offset=".62" stop-color="#ff7a1a" stop-opacity=".75"/><stop offset=".78" stop-color="#b03bff" stop-opacity=".35"/><stop offset="1" stop-color="#b03bff" stop-opacity="0"/></radialGradient></defs>
  <circle cx="100" cy="100" r="94" fill="url(#bhg)" class="bh-glow"/><g class="bh-disk a"><circle cx="100" cy="100" r="70" class="bh-d1"/></g><g class="bh-disk b"><circle cx="100" cy="100" r="60" class="bh-d2"/></g><circle cx="100" cy="100" r="51" class="bh-ph"/></svg>`,
 front:()=>`${LS_SVG}${[0,1,2,3,4].map(i=>`<circle r="1.8" class="bh-pt"><animateMotion dur="${(3.2+i*.4).toFixed(1)}s" begin="${-i*.7}s" repeatCount="indefinite" path="${lsSpiral(1.4,96,52,i*72)}"/><animate attributeName="opacity" values="0;1;1;0" dur="${(3.2+i*.4).toFixed(1)}s" begin="${-i*.7}s" repeatCount="indefinite"/></circle>`).join("")}</svg>`,
 pulse:lsFlash("bh-pull"),
 css:`
.led-blackHole .bh-glow{animation:le-breath calc(3s / var(--as,1)) ease-in-out infinite;transform-box:fill-box;transform-origin:center}
.led-blackHole .bh-disk{transform-box:view-box;transform-origin:100px 100px}
.led-blackHole .bh-disk.a{animation:le-spin calc(7s / var(--as,1)) linear infinite}.led-blackHole .bh-disk.b{animation:le-spin calc(3.5s / var(--as,1)) linear infinite}
.led-blackHole .bh-d1{fill:none;stroke:#ff9a3d;stroke-width:6;stroke-dasharray:60 20 30 30 80 40;opacity:.75;filter:blur(1px) drop-shadow(0 0 4px #ff7a1a)}
.led-blackHole .bh-d2{fill:none;stroke:#ffd27a;stroke-width:3;stroke-dasharray:40 25 15 35;filter:drop-shadow(0 0 3px #ffb347)}
.led-blackHole .bh-ph{fill:none;stroke:#fff3d6;stroke-width:1.4;filter:drop-shadow(0 0 4px #fff)}
.led-blackHole .bh-pt{fill:#ffd9a8;filter:drop-shadow(0 0 2px #ff9a3d)}
.led-blackHole .le-enter .le-back{animation:bh-in calc(var(--d)*1.1) cubic-bezier(.2,1,.3,1) both}
@keyframes bh-in{from{transform:scale(1.8) rotate(-180deg);opacity:0;filter:blur(6px)}to{transform:none;opacity:1;filter:none}}
.led-blackHole .bh-pull .bh-disk{animation-duration:.8s}
.led-blackHole .bh-pull .bh-ph{animation:bh-p 1s ease}
@keyframes bh-p{35%{stroke-width:4;filter:drop-shadow(0 0 10px #fff)}}
${LS_PLATE("blackHole","#ff9a3d","#ff7a1a66","#1a0a04f0","#070302f0",.8)}
`};

// ---------------- 24) Nebula Portal ----------------
const nebulaPortal={id:"nebulaPortal",n:24,cat:"space",name:"Nebula Portal",ar:"بوابة السديم",pal:"purple",frame:"neon",lay:"stack",
 desc:"سحب سديم بنفسجية ووردية تدور ببطء وحلقات بوابة متعاكسة الدوران حول الصورة",
 back:()=>{ const R=lsSeed(29); const clouds=Array.from({length:7},(_,i)=>{ const [x,y]=lsP(100,100,i*51+R()*20,46+R()*26); return `<circle cx="${x}" cy="${y}" r="${(22+R()*16).toFixed(0)}" fill="${["#b56bff","#ff5fb8","#6b8bff","#d49bff"][i%4]}" class="np-c"/>` }).join("");
  return `${LS_SVG}<g class="np-neb">${clouds}</g>${lsStars(17,18)}<g class="np-r a"><circle cx="100" cy="100" r="62" class="np-r1"/></g><g class="np-r b"><circle cx="100" cy="100" r="54" class="np-r2"/></g></svg>` },
 front:()=>`${LS_SVG}${lsSparks([[28,36,4],[172,40,4],[30,160,3],[170,158,3.5]])}</svg>`,
 pulse:lsFlash("np-open"),
 css:`${LS_BASE("nebulaPortal")}
.led-nebulaPortal .np-c{opacity:.45;filter:blur(9px)}
.led-nebulaPortal .np-neb{transform-box:view-box;transform-origin:100px 100px;animation:le-spin calc(45s / var(--as,1)) linear infinite;mix-blend-mode:screen}
.led-nebulaPortal .np-r{transform-box:view-box;transform-origin:100px 100px}
.led-nebulaPortal .np-r.a{animation:le-spin calc(12s / var(--as,1)) linear infinite}.led-nebulaPortal .np-r.b{animation:le-spin calc(8s / var(--as,1)) linear infinite reverse}
.led-nebulaPortal .np-r1{fill:none;stroke:#e0b8ff;stroke-width:2;stroke-dasharray:24 10 4 10;filter:drop-shadow(0 0 4px #b56bff)}
.led-nebulaPortal .np-r2{fill:none;stroke:#ff9ad0;stroke-width:1.4;stroke-dasharray:8 6;filter:drop-shadow(0 0 3px #ff5fb8)}
.led-nebulaPortal .le-enter .np-r{animation:np-in calc(var(--d)*1) cubic-bezier(.2,1.2,.3,1) both}
@keyframes np-in{from{transform:scale(0) rotate(-180deg)}to{transform:none}}
.led-nebulaPortal .np-open .np-r{animation:np-o 1.1s ease}
@keyframes np-o{40%{transform:scale(1.18) rotate(60deg);filter:brightness(1.8)}}
${LS_PLATE("nebulaPortal","#d49bff","#b56bff66","#1c0832f0","#0c0318f0",1.2)}
`};

// ---------------- 25) Meteor Shower ----------------
const meteorShower={id:"meteorShower",n:25,cat:"space",name:"Meteor Shower",ar:"زخات الشهب",pal:"blue",frame:"circle",lay:"stack",
 desc:"شهب لامعة بذيول متدرجة تعبر خلف الصورة بزوايا وتوقيتات مختلفة فوق سماء نجوم",
 back:()=>{ const R=lsSeed(71); return `${LS_SVG}<defs><linearGradient id="msg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".85" stop-color="#bfe3ff" stop-opacity=".8"/><stop offset="1" stop-color="#fff"/></linearGradient></defs>${lsStars(41,22)}
  ${Array.from({length:6},(_,i)=>`<g transform="translate(${(20+R()*170).toFixed(0)} ${(-20+R()*60).toFixed(0)}) rotate(135)"><g class="ms-m" style="animation-delay:calc(${(i*.55+R()*.3).toFixed(2)}s / var(--as,1));animation-duration:calc(${(2.4+R()*1.4).toFixed(1)}s / var(--as,1))"><rect x="-40" y="-1.2" width="40" height="2.4" rx="1.2" fill="url(#msg)"/><circle r="2" class="ms-h"/></g></g>`).join("")}</svg>` },
 front:()=>`${LS_SVG}${lsSparks([[36,30,3.5],[164,24,4],[178,140,3]])}</svg>`,
 pulse(c){ const f=c.querySelector(".le-back"); if(!f) return; const s=document.createElement("div"); s.className="ms-x"; s.innerHTML=LS_SVG+[0,1,2,3].map(i=>`<g transform="translate(${30+i*45} ${-10+i*6}) rotate(135)"><g class="ms-m" style="animation-delay:${i*.08}s;animation-iteration-count:1"><rect x="-50" y="-1.6" width="50" height="3.2" rx="1.6" fill="url(#msg)"/><circle r="2.6" class="ms-h"/></g></g>`).join("")+"</svg>"; f.appendChild(s); setTimeout(()=>s.remove(),1500) },
 css:`${LS_BASE("meteorShower")}
.led-meteorShower .ms-m{opacity:0;animation:ms-fly 3s linear infinite}
@keyframes ms-fly{0%{opacity:0;transform:translateX(0)}10%{opacity:1}55%{opacity:1}70%,100%{opacity:0;transform:translateX(230px)}}
.led-meteorShower .ms-h{fill:#fff;filter:drop-shadow(0 0 3px #bfe3ff) drop-shadow(0 0 6px #7cc4ff)}
.led-meteorShower .ms-x{position:absolute;inset:0}.led-meteorShower .ms-x svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.led-meteorShower .ms-x .ms-m{animation-duration:1.2s}
${LS_PLATE("meteorShower","#9fd3ff","#3ba8ff55","#0a1530f0","#040918f0",1.4)}
`};

// ---------------- 26) Saturn Ring ----------------
const saturnRing={id:"saturnRing",n:26,cat:"space",name:"Saturn Ring",ar:"حلقة زحل",pal:"gold",frame:"circle",lay:"stack",
 desc:"حلقة زحل مائلة حول الصورة: نصفها خلف الصورة ونصفها أمامها مع قمر صغير يدور",
 back:()=>`${LS_SVG}${lsStars(53,14)}<g transform="rotate(-18 100 100)"><g class="sr-tilt"><path d="M14 100A86 26 0 0 1 186 100" class="sr-r1"/><path d="M24 100A76 21 0 0 1 176 100" class="sr-r2"/><path d="M34 100A66 17 0 0 1 166 100" class="sr-r3"/></g></g></svg>`,
 front:()=>`${LS_SVG}<g transform="rotate(-18 100 100)"><g class="sr-tilt"><path d="M14 100A86 26 0 0 0 186 100" class="sr-r1"/><path d="M24 100A76 21 0 0 0 176 100" class="sr-r2"/><path d="M34 100A66 17 0 0 0 166 100" class="sr-r3"/><path d="M14 100A86 26 0 0 0 186 100" class="sr-sh" pathLength="100"/></g></g>
  <g><animateMotion dur="9s" repeatCount="indefinite" path="M100 8A92 92 0 1 1 99.9 8"/><circle r="5" class="sr-moon"/></g></svg>`,
 pulse:lsFlash("sr-glow"),
 css:`${LS_BASE("saturnRing")}
.led-saturnRing .sr-r1{fill:none;stroke:#e8c27a;stroke-width:7;opacity:.8}.led-saturnRing .sr-r2{fill:none;stroke:#fff0c8;stroke-width:3;opacity:.85}.led-saturnRing .sr-r3{fill:none;stroke:#b08a4a;stroke-width:4;opacity:.7}
.led-saturnRing .sr-sh{fill:none;stroke:#fff;stroke-width:3;stroke-dasharray:10 90;filter:drop-shadow(0 0 3px #fff);animation:bg-run calc(4s / var(--as,1)) linear infinite}
.led-saturnRing .sr-tilt{transform-box:view-box;transform-origin:100px 100px;animation:sr-wob calc(6s / var(--as,1)) ease-in-out infinite}
@keyframes sr-wob{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.15)}}
.led-saturnRing .le-enter .sr-tilt{animation:sr-in calc(var(--d)*1) cubic-bezier(.2,1.2,.3,1) calc(var(--d)*.3) both}
@keyframes sr-in{from{transform:scaleX(0)}to{transform:none}}
.led-saturnRing .sr-moon{fill:#dfe6f0;filter:drop-shadow(0 0 3px #fff)}
.led-saturnRing .sr-glow .sr-r2{animation:sr-g 1.1s ease}
@keyframes sr-g{35%{stroke:#fff;filter:drop-shadow(0 0 6px #fff)}}
${LS_PLATE("saturnRing","#e8c27a","#e8c27a55","#1e1608f0","#0c0904f0",1.4)}
`};

// ---------------- 27) Lunar Eclipse ----------------
const lunarEclipse={id:"lunarEclipse",n:27,cat:"space",name:"Lunar Eclipse",ar:"الخسوف القمري",pal:"red",frame:"neon",lay:"stack",
 desc:"قمر كبير خلف الصورة يمر عليه ظل الخسوف فيحمرّ تدريجياً مع هالة إكليلية ونجوم",
 back:()=>`${LS_SVG}<defs><radialGradient id="leM" cx="40%" cy="38%"><stop offset="0" stop-color="#fff8ea"/><stop offset=".7" stop-color="#d9cfc0"/><stop offset="1" stop-color="#9c8f7c"/></radialGradient><radialGradient id="leR"><stop offset=".6" stop-color="#7a1406" stop-opacity=".9"/><stop offset="1" stop-color="#c23a12" stop-opacity=".7"/></radialGradient><clipPath id="leC"><circle cx="100" cy="92" r="74"/></clipPath><radialGradient id="leK"><stop offset=".72" stop-color="#ff6a3d" stop-opacity=".55"/><stop offset="1" stop-color="#ff6a3d" stop-opacity="0"/></radialGradient></defs>
  ${lsStars(61,14)}<circle cx="100" cy="92" r="96" fill="url(#leK)" class="ec-cor"/><circle cx="100" cy="92" r="74" fill="url(#leM)"/><g clip-path="url(#leC)"><circle cx="100" cy="92" r="78" fill="url(#leR)" class="ec-sh"/></g>
  ${[[70,62,8],[124,70,6],[86,128,7],[136,116,5]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" class="ec-cr"/>`).join("")}</svg>`,
 front:()=>`${LS_SVG}${lsSparks([[22,30,3.5],[178,36,3.5],[184,150,3]])}</svg>`,
 pulse:lsFlash("ec-flare"),
 css:`${LS_BASE("lunarEclipse")}
.led-lunarEclipse .ec-sh{animation:ec-ecl calc(10s / var(--as,1)) ease-in-out infinite}
@keyframes ec-ecl{0%,100%{transform:translateX(-150px)}40%,60%{transform:translateX(0)}}
.led-lunarEclipse .ec-cr{fill:#000;opacity:.08}
.led-lunarEclipse .ec-cor{animation:le-breath calc(4s / var(--as,1)) ease-in-out infinite;transform-box:fill-box;transform-origin:center}
.led-lunarEclipse .le-enter .le-back{animation:mb-rise calc(var(--d)*1.1) cubic-bezier(.2,1.1,.3,1) both}
.led-lunarEclipse .ec-flare .ec-cor{animation:ec-fl 1.1s ease}
@keyframes ec-fl{35%{transform:scale(1.15);filter:brightness(1.8)}}
${LS_PLATE("lunarEclipse","#ff7a5a","#ff4a1a55","#1e0806f0","#0c0302f0",1)}
`};

// ---------------- 28) Solar Crown ----------------
const lsCorona=(n,r0,r1)=>{ let d=""; for(let i=0;i<=n*2;i++){ const a=i*180/n, r=i%2?r0:r1; const [x,y]=lsP(100,100,a,r); d+=(i?"L":"M")+x+" "+y } return d+"Z" };
const solarCrown={id:"solarCrown",n:28,cat:"space",name:"Solar Crown",ar:"التاج الشمسي",pal:"gold",frame:"gold",lay:"stack",
 desc:"إكليل شمسي بطبقتين من الأشعة تدوران بعكس بعض مع ألسنة شمسية متقوسة",
 back:()=>`${LS_SVG}<defs><radialGradient id="scg"><stop offset=".45" stop-color="#fff3b0"/><stop offset=".7" stop-color="#ffb300"/><stop offset="1" stop-color="#ff5a00"/></radialGradient></defs>
  <g class="sc-a"><path d="${lsCorona(18,56,86)}" fill="url(#scg)" class="sc-c1"/></g><g class="sc-b"><path d="${lsCorona(12,54,74)}" fill="#ffd54a" class="sc-c2"/></g>
  ${[[-60,"a"],[30,"b"],[150,"c"]].map(([a,k])=>{ const [x1,y1]=lsP(100,100,a-14,56), [x2,y2]=lsP(100,100,a+14,56), [cx,cy]=lsP(100,100,a,96); return `<path d="M${x1} ${y1}Q${cx} ${cy} ${x2} ${y2}" class="sc-fl ${k}"/>` }).join("")}</svg>`,
 front:()=>"",
 pulse:lsFlash("sc-burst"),
 css:`
.led-solarCrown .sc-a,.led-solarCrown .sc-b{transform-box:view-box;transform-origin:100px 100px}
.led-solarCrown .sc-a{animation:le-spin calc(40s / var(--as,1)) linear infinite}.led-solarCrown .sc-b{animation:le-spin calc(26s / var(--as,1)) linear infinite reverse}
.led-solarCrown .sc-c1{opacity:.9;filter:drop-shadow(0 0 6px #ff9a00)}.led-solarCrown .sc-c2{opacity:.8}
.led-solarCrown .sc-fl{fill:none;stroke:#ffcf3d;stroke-width:3;stroke-linecap:round;filter:drop-shadow(0 0 4px #ff7a00);stroke-dasharray:120;animation:sc-fl calc(4s / var(--as,1)) ease-in-out infinite}
.led-solarCrown .sc-fl.b{animation-delay:-1.3s}.led-solarCrown .sc-fl.c{animation-delay:-2.6s}
@keyframes sc-fl{0%{stroke-dashoffset:120;opacity:0}40%{stroke-dashoffset:0;opacity:1}100%{stroke-dashoffset:-120;opacity:0}}
.led-solarCrown .le-enter .le-back{animation:lei-ignite calc(var(--d)*1.1) ease both}
.led-solarCrown .sc-burst .sc-a{animation:sc-b 1s ease}
@keyframes sc-b{35%{transform:scale(1.18);filter:brightness(1.6)}}
${LS_PLATE("solarCrown","#ffcf3d","#ff9a0066","#2a1404f0","#120802f0",.6)}
`};

// ---------------- 29) Celestial Wings ----------------
const CW_PTS=[[76,92],[56,70],[34,56],[16,58],[26,76],[14,92],[30,104],[22,120],[44,122],[60,112]];
const lsWingL=()=>{ const d="M"+CW_PTS.map(p=>p.join(" ")).join("L")+"Z"; const lines=`M76 92L34 56M76 92L14 92M76 92L22 120`; return `<path d="${d}" class="cw-fill"/><path d="${d}" class="cw-line"/><path d="${lines}" class="cw-line t"/>${CW_PTS.map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="${i%3?1.6:2.4}" class="cw-n" style="animation-delay:${(i*.25).toFixed(2)}s"/>`).join("")}` };
const celestialWings={id:"celestialWings",n:29,cat:"space",name:"Celestial Wings",ar:"الأجنحة الكونية",pal:"purple",frame:"neon",lay:"stack",
 desc:"جناحان مرسومان من كوكبات نجمية متصلة بخطوط ضوئية يرفرفان ونجومهما تومض",
 back:()=>`${LS_SVG}${lsStars(83,12)}<g class="cw-w l">${lsWingL()}</g><g transform="translate(200 0) scale(-1 1)"><g class="cw-w r">${lsWingL()}</g></g></svg>`,
 front:()=>`${LS_SVG}${lsSparks([[100,20,4],[40,30,3],[160,30,3]])}</svg>`,
 pulse:lsFlash("cw-lit"),
 css:`${LS_BASE("celestialWings")}
.led-celestialWings .cw-fill{fill:var(--c2);opacity:.16}
.led-celestialWings .cw-line{fill:none;stroke:var(--cp);stroke-width:.9;opacity:.85;filter:drop-shadow(0 0 2px var(--cp))}.led-celestialWings .cw-line.t{opacity:.45;stroke-dasharray:2 3}
.led-celestialWings .cw-n{fill:#fff;filter:drop-shadow(0 0 3px var(--cp));animation:ls-tw calc(2s / var(--as,1)) ease-in-out infinite}
.led-celestialWings .cw-w{transform-box:view-box;transform-origin:76px 92px;animation:cw-f calc(3.4s / var(--as,1)) ease-in-out infinite}
@keyframes cw-f{0%,100%{transform:rotate(0)}50%{transform:rotate(-10deg)}}
.led-celestialWings .le-enter .cw-line{stroke-dasharray:300;animation:ef-grow calc(var(--d)*1.2) ease both}
.led-celestialWings .le-enter .cw-w{animation:cr-open calc(var(--d)*1) cubic-bezier(.2,1.2,.3,1) both}
.led-celestialWings .cw-lit .cw-n{animation:de-wv .9s ease}
${LS_PLATE("celestialWings","#d49bff","#b56bff66","#160a2ef0","#080316f0",1.4)}
`};

// ---------------- 30) Infinity Universe ----------------
const LS_INF="M100 100C120 70 170 70 170 100C170 130 120 130 100 100C80 70 30 70 30 100C30 130 80 130 100 100Z";
const lsGalaxy=()=>[0,1,2].map(k=>`<path d="${lsSpiral(1.1,8,92,k*120)}" class="iu-arm"/>`).join("");
const infinityUniverse={id:"infinityUniverse",n:30,cat:"space",name:"Infinity Universe",ar:"الكون اللانهائي",pal:"blue",frame:"neon",lay:"stack",
 desc:"مجرة حلزونية تدور خلف الصورة ورمز لانهاية مضيء تجري عليه نقطة ضوء",
 back:()=>`${LS_SVG}<g class="iu-gal">${lsGalaxy()}</g>${lsStars(97,16)}<g transform="translate(100 100) scale(1.15) translate(-100 -100)"><path d="${LS_INF}" class="iu-inf"/></g></svg>`,
 front:()=>`${LS_SVG}<g transform="translate(100 100) scale(1.15) translate(-100 -100)"><g><animateMotion dur="5s" repeatCount="indefinite" path="${LS_INF}"/><circle r="3.4" class="iu-dot"/></g><g><animateMotion dur="5s" begin="-2.5s" repeatCount="indefinite" path="${LS_INF}"/><circle r="2.4" class="iu-dot b"/></g></g></svg>`,
 pulse:lsFlash("iu-flow"),
 css:`${LS_BASE("infinityUniverse")}
.led-infinityUniverse .iu-arm{fill:none;stroke:var(--cp);stroke-width:4;stroke-linecap:round;opacity:.28;filter:blur(1.5px)}
.led-infinityUniverse .iu-gal{transform-box:view-box;transform-origin:100px 100px;animation:le-spin calc(35s / var(--as,1)) linear infinite}
.led-infinityUniverse .iu-inf{fill:none;stroke:var(--c1);stroke-width:2.6;filter:drop-shadow(0 0 4px var(--c1)) drop-shadow(0 0 9px var(--c2))}
.led-infinityUniverse .iu-dot{fill:#fff;filter:drop-shadow(0 0 4px #fff) drop-shadow(0 0 8px var(--c1))}.led-infinityUniverse .iu-dot.b{opacity:.7}
.led-infinityUniverse .le-enter .iu-inf{stroke-dasharray:420;animation:ef-grow calc(var(--d)*1.2) ease calc(var(--d)*.2) both}
.led-infinityUniverse .iu-flow .iu-inf{animation:iu-f 1.1s ease}
@keyframes iu-f{35%{stroke-width:5;filter:drop-shadow(0 0 10px #fff)}}
${LS_PLATE("infinityUniverse","#7cc4ff","#3ba8ff66","#06142cf0","#020814f0",1.4)}
`};

const LS_COMMON=`@keyframes ls-tw{0%,100%{opacity:.35}50%{opacity:1}}`;
leRegister([{...cosmicOrbit,css:cosmicOrbit.css+LS_COMMON},blackHole,nebulaPortal,meteorShower,saturnRing,lunarEclipse,solarCrown,celestialWings,infinityUniverse]);
