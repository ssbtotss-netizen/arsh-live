// ====== آخر التفاعلات — أول 5 تصاميم: الفراشة، النجوم، النار، التاج، الألماس ======
// كل تصميم له تكوين وزخارف وحركة خاصة به (ليست نفس المكوّن بلون مختلف).
import { leRegister } from "./leview.js";

const leMir=d=>d.replace(/(-?\d+(?:\.\d+)?)[ ,](-?\d+(?:\.\d+)?)/g,(m,x,y)=>`${+(200-x).toFixed(1)} ${y}`);
const leStar=(cx,cy,R,r,n=5,rot=-90)=>{ let d=""; for(let i=0;i<n*2;i++){ const a=(rot+i*180/n)*Math.PI/180, rr=i%2?r:R; d+=(i?"L":"M")+(cx+Math.cos(a)*rr).toFixed(1)+" "+(cy+Math.sin(a)*rr).toFixed(1) } return d+"Z" };
const leSpark=(x,y,s)=>`M${x} ${y-s}Q${x} ${y} ${x+s} ${y}Q${x} ${y} ${x} ${y+s}Q${x} ${y} ${x-s} ${y}Q${x} ${y} ${x} ${y-s}Z`;
const leSeed=s=>()=>((s=(s*9301+49297)%233280)/233280);
const SVGO='<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">';

// ---------------- 1) الفراشة ----------------
const BF_SMALL=(c="bfa")=>`<g class="${c}"><g class="bfl"><path d="M0 0C-3-9-13-11-12-3C-11 1-5 2 0 0Z"/><path d="M0 1C-3 5-9 9-8 4C-7 2-4 1 0 1Z" opacity=".85"/></g><g class="bfr"><path d="M0 0C3-9 13-11 12-3C11 1 5 2 0 0Z"/><path d="M0 1C3 5 9 9 8 4C7 2 4 1 0 1Z" opacity=".85"/></g><ellipse rx="1.1" ry="5" class="bfb"/><path d="M-.5-5Q-3-9-4-9M.5-5Q3-9 4-9" class="bfn"/></g>`;
const BF_PATH1="M100 22C150 18 188 60 178 104C168 150 128 184 100 180C66 182 22 150 24 104C24 58 54 24 100 22Z";
const BF_PATH2="M30 84C40 30 120 10 168 50C196 76 182 130 150 156C110 186 50 172 30 130C24 116 26 98 30 84Z";
const bfWing="M84 96C60 38 6 28 14 76C18 98 52 104 84 100Z", bfWing2="M84 106C58 108 24 128 36 152C48 170 76 136 86 112Z";
const bfFlyer=(path,dur,begin,cls)=>`<g class="${cls}">${[3,2,1].map(i=>`<circle r="${1+i*.5}" class="bftr" opacity="${.14*i}"><animateMotion dur="${dur}s" begin="${begin-i*.16}s" repeatCount="indefinite" path="${path}"/></circle>`).join("")}<g><animateMotion dur="${dur}s" begin="${begin}s" repeatCount="indefinite" path="${path}"/><g transform="scale(1.35)">${BF_SMALL()}</g></g></g>`;
const butterfly={id:"butterfly",n:1,cat:"nature",name:"Butterfly Dream",ar:"حلم الفراشات",pal:"purple",frame:"butterfly",lay:"stack",
 desc:"جناحان كبيران خلف الصورة وفراشتان تطيران حولها بمسار منحني مع أثر ضوئي",
 back:()=>`${SVGO}<defs><linearGradient id="bfg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff9ee0"/><stop offset=".55" stop-color="#b56bff"/><stop offset="1" stop-color="#6b2bd9"/></linearGradient></defs>
  <g class="bf-big l"><path d="${bfWing}" fill="url(#bfg)" opacity=".78"/><path d="${bfWing2}" fill="url(#bfg)" opacity=".62"/><path d="M80 98C58 72 34 58 22 66M80 100C56 92 36 86 22 82M82 108C62 120 48 134 42 146" class="bfv"/><circle cx="34" cy="64" r="4" class="bfdot"/><circle cx="46" cy="140" r="3" class="bfdot"/></g>
  <g class="bf-big r"><path d="${leMir(bfWing)}" fill="url(#bfg)" opacity=".78"/><path d="${leMir(bfWing2)}" fill="url(#bfg)" opacity=".62"/><path d="${leMir("M80 98C58 72 34 58 22 66M80 100C56 92 36 86 22 82M82 108C62 120 48 134 42 146")}" class="bfv"/><circle cx="166" cy="64" r="4" class="bfdot"/><circle cx="154" cy="140" r="3" class="bfdot"/></g></svg>`,
 front:()=>`${SVGO}${bfFlyer(BF_PATH1,7.5,0,"bf-f1")}${bfFlyer(BF_PATH2,9.5,-3,"bf-f2")}${[[40,40,4],[160,36,3],[176,120,3.5],[24,124,3]].map(([x,y,s],i)=>`<path d="${leSpark(x,y,s)}" class="bf-sp" style="animation-delay:${i*.6}s"/>`).join("")}</svg>`,
 plate:`<i class="bp-w l"><svg viewBox="-14 -12 28 22">${BF_SMALL("bfo")}</svg></i><i class="bp-w r"><svg viewBox="-14 -12 28 22">${BF_SMALL("bfo")}</svg></i>`,
 pulse(c){ const box=c.querySelector(".le-front"); if(!box) return; const R=leSeed(Date.now()%9973);
  const paths=[0,1,2,3].map(i=>{ const a=(i/4)*Math.PI*2+R(), x=100+Math.cos(a)*120, y=100+Math.sin(a)*110; return `M100 100Q${(100+Math.cos(a+1.2)*80).toFixed(0)} ${(100+Math.sin(a+1.2)*80).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)}` });
  const s=document.createElement("div"); s.className="bf-extra"; s.innerHTML=SVGO+paths.map((p,i)=>`<g><animateMotion dur="2.2s" begin="indefinite" fill="freeze" path="${p}"/><g transform="scale(${(.7+R()*.4).toFixed(2)})">${BF_SMALL()}</g></g>`).join("")+"</svg>";
  box.appendChild(s); s.querySelectorAll("animateMotion").forEach((m,i)=>{ try{ m.beginElementAt(i*.12) }catch(e){} }); setTimeout(()=>s.remove(),2600) },
 css:`
.led-butterfly .bf-big{transform-box:view-box;animation:bf-breathe calc(3.6s / var(--as,1)) ease-in-out infinite}
.led-butterfly .bf-big.l{transform-origin:86px 102px}.led-butterfly .bf-big.r{transform-origin:114px 102px;animation-delay:calc(-1.8s / var(--as,1))}
@keyframes bf-breathe{0%,100%{transform:scale(1,1)}50%{transform:scale(.9,1.03)}}
.led-butterfly .bfv{fill:none;stroke:#fff;stroke-opacity:.35;stroke-width:.9}
.led-butterfly .bfdot{fill:#fff;opacity:.7}
.led-butterfly .bfa path,.led-butterfly .bfo path{fill:var(--cp)}
.led-butterfly .bfa .bfb,.led-butterfly .bfo .bfb{fill:#2a0f3a}
.led-butterfly .bfn{fill:none;stroke:#2a0f3a;stroke-width:.5}
.bfl,.bfr{transform-box:fill-box;animation:bf-flap calc(.26s / var(--as,1)) ease-in-out infinite alternate}
.bfl{transform-origin:100% 50%}.bfr{transform-origin:0% 50%}
@keyframes bf-flap{from{transform:scaleX(1)}to{transform:scaleX(.28)}}
.led-butterfly .bf-f1,.led-butterfly .bf-f2{}
.led-butterfly .bftr{fill:var(--cp)}
.led-butterfly .bf-sp{fill:#fff;opacity:0;animation:bf-tw calc(2.4s / var(--as,1)) ease-in-out infinite}
@keyframes bf-tw{0%,100%{opacity:0;transform:scale(.6)}50%{opacity:.95;transform:scale(1)}}
.led-butterfly .bf-sp{transform-box:fill-box;transform-origin:center}
.led-butterfly .bf-extra{position:absolute;inset:0;animation:bf-fade 2.4s ease forwards}
.led-butterfly .bf-extra svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
@keyframes bf-fade{0%{opacity:0}15%{opacity:1}70%{opacity:1}100%{opacity:0}}
.led-butterfly.lec-clear .le-plate{border-radius:calc(var(--u)*2);background:linear-gradient(180deg,#2a0d46e6,#16052ae6);border:calc(var(--u)*.07) solid transparent;background-clip:padding-box;box-shadow:0 0 0 calc(var(--u)*.07) var(--c1),0 0 calc(var(--u)*.8*var(--gl)) var(--c2),inset 0 0 calc(var(--u)*.6) #ff7ad955}
.led-butterfly .bp-w{position:absolute;top:50%;width:calc(var(--u)*1.3);height:calc(var(--u)*1.05);margin-top:calc(var(--u)*-.55);z-index:4;filter:drop-shadow(0 0 4px var(--cp))}
.led-butterfly .bp-w svg{width:100%;height:100%;overflow:visible}
.led-butterfly .bp-w.l{left:calc(var(--u)*-.75);transform:rotate(-18deg)}.led-butterfly .bp-w.r{right:calc(var(--u)*-.75);transform:rotate(18deg)}
.lel-row.led-butterfly .bp-w{display:none}
.le-exit.led-butterfly .bf-f1,.led-butterfly .le-exit .bf-f1,.led-butterfly .le-exit .bf-f2{transition:opacity .5s;opacity:0}
`};

// ---------------- 2) النجوم ----------------
const ST_SMALL=(()=>{ const R=leSeed(31); const out=[]; const spots=[[-150,74],[-118,82],[-30,84],[-58,72],[10,80],[40,86],[70,70],[110,84],[140,78],[170,72],[-170,86],[-90,92]];
 for(const [deg,r] of spots){ const a=deg*Math.PI/180, x=100+Math.cos(a)*r, y=100+Math.sin(a)*r*.95; if(y<6||y>196) continue; const s=2.2+R()*3.4; out.push({x:+x.toFixed(1),y:+y.toFixed(1),s:+s.toFixed(1),dx:+(Math.cos(a)*(6+R()*8)).toFixed(1),dy:+(Math.sin(a)*(6+R()*8)).toFixed(1),dl:+(R()*3).toFixed(2),du:+(2.6+R()*2).toFixed(2)}) } return out })();
const stars={id:"stars",n:21,cat:"space",name:"Star Galaxy",ar:"مجرة النجوم",pal:"gold",frame:"gold",lay:"stack",
 desc:"نجمة رئيسية تتكوّن فوق الصورة ونجوم صغيرة متفاوتة تبتعد ببطء مع ومضات وموجة ضوء عند كل حدث",
 back:()=>`${SVGO}<g class="st-orb a"><circle cx="100" cy="100" r="72" class="st-dots"/></g><g class="st-orb b"><circle cx="100" cy="100" r="84" class="st-dots2"/></g></svg>`,
 front:()=>{ const main=leStar(100,30,24,10.5); let facets=""; for(let i=0;i<5;i++){ const a=(-90+i*72)*Math.PI/180, b=(-90+i*72+36)*Math.PI/180; facets+=`<path d="M100 30L${(100+Math.cos(a)*24).toFixed(1)} ${(30+Math.sin(a)*24).toFixed(1)}L${(100+Math.cos(b)*10.5).toFixed(1)} ${(30+Math.sin(b)*10.5).toFixed(1)}Z" class="st-fc"/>` }
  return `${SVGO}<defs><linearGradient id="stg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff8d6"/><stop offset=".45" stop-color="#ffd54a"/><stop offset="1" stop-color="#c98a0b"/></linearGradient><radialGradient id="stgl"><stop offset="0" stop-color="#fff3b0" stop-opacity=".9"/><stop offset="1" stop-color="#ffd54a" stop-opacity="0"/></radialGradient></defs>
  <g class="st-small">${ST_SMALL.map(p=>`<g transform="translate(${p.x} ${p.y})"><path d="${leStar(0,0,p.s,p.s*.45)}" class="st-s" style="--dx:${p.dx}px;--dy:${p.dy}px;animation-delay:${p.dl}s;animation-duration:calc(${p.du}s / var(--as,1))"/></g>`).join("")}</g>
  ${[[24,60,5],[176,58,5.5],[150,20,4],[52,22,4],[186,150,4],[14,150,4]].map(([x,y,s],i)=>`<path d="${leSpark(x,y,s)}" class="st-tw" style="animation-delay:${(i*.7).toFixed(1)}s"/>`).join("")}
  <g class="st-main"><circle cx="100" cy="30" r="30" fill="url(#stgl)" class="st-glow"/><path d="${main}" fill="url(#stg)" class="st-mp"/>${facets}<path d="${leSpark(112,16,5)}" class="st-tw2"/></g></svg>` },
 pulse(c){ const box=c.querySelector(".le-front"); if(!box) return; const s=document.createElement("div"); s.className="st-wave"; s.innerHTML=SVGO+'<circle cx="100" cy="100" r="49" class="w1" pathLength="100"/><circle cx="100" cy="100" r="49" class="w2"/></svg>'; box.appendChild(s); setTimeout(()=>s.remove(),1500) },
 css:`
.led-stars .st-orb{transform-box:view-box;transform-origin:100px 100px}
.led-stars .st-orb.a{animation:le-spin calc(40s / var(--as,1)) linear infinite}.led-stars .st-orb.b{animation:le-spin calc(60s / var(--as,1)) linear infinite reverse}
.led-stars .st-dots{fill:none;stroke:var(--cp);stroke-width:1.6;stroke-linecap:round;stroke-dasharray:0 9;opacity:.55}
.led-stars .st-dots2{fill:none;stroke:var(--c1);stroke-width:.9;stroke-linecap:round;stroke-dasharray:0 5 0 17;opacity:.4}
.led-stars .st-s{fill:var(--cp);transform-box:fill-box;transform-origin:center;opacity:0;animation:st-drift 3.4s ease-out infinite}
@keyframes st-drift{0%{opacity:0;transform:translate(0,0) scale(.3)}25%{opacity:1;transform:translate(calc(var(--dx)*.2),calc(var(--dy)*.2)) scale(1)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.7) rotate(40deg)}}
.led-stars .st-tw,.led-stars .st-tw2{fill:#fff;transform-box:fill-box;transform-origin:center;opacity:0;animation:bf-tw calc(2.8s / var(--as,1)) ease-in-out infinite}
.led-stars .st-main{transform-box:fill-box;transform-origin:50% 60%}
.led-stars .le-idle .st-main,.led-stars .le-card:not(.le-enter) .st-main{animation:st-twinkle calc(3s / var(--as,1)) ease-in-out infinite}
.led-stars .le-enter .st-main{animation:st-form calc(var(--d)*1.1) cubic-bezier(.2,1.3,.3,1) calc(var(--d)*.5) both}
@keyframes st-form{0%{opacity:0;transform:scale(0) rotate(-144deg)}60%{opacity:1}100%{opacity:1;transform:none}}
@keyframes st-twinkle{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
.led-stars .st-mp{stroke:#fff6c8;stroke-width:.8}
.led-stars .st-fc{fill:#fff;opacity:.22}.led-stars .st-fc:nth-of-type(odd){opacity:.08}
.led-stars .st-glow{animation:le-breath calc(2.6s / var(--as,1)) ease-in-out infinite;transform-box:fill-box;transform-origin:center}
.led-stars .st-wave{position:absolute;inset:0}
.led-stars .st-wave svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.led-stars .st-wave .w1{fill:none;stroke:var(--csh);stroke-width:3.5;stroke-linecap:round;stroke-dasharray:22 78;filter:drop-shadow(0 0 4px var(--csh));animation:st-sweep 1.2s ease-out forwards}
.led-stars .st-wave .w2{fill:none;stroke:var(--cp);stroke-width:2;transform-box:fill-box;transform-origin:center;animation:st-ring 1.2s ease-out forwards}
@keyframes st-sweep{from{stroke-dashoffset:0;opacity:1}to{stroke-dashoffset:-100;opacity:0}}
@keyframes st-ring{from{opacity:.9;transform:scale(1)}to{opacity:0;transform:scale(1.55)}}
.led-stars.lec-clear .le-plate{background:none;border:0;box-shadow:none;border-radius:0;filter:drop-shadow(0 0 calc(var(--u)*.35*var(--gl)) var(--c2))}
.led-stars.lec-clear .le-plate::before,.led-stars.lec-clear .le-plate::after{content:"";position:absolute;inset:0;z-index:-1;clip-path:polygon(5% 0,95% 0,100% 50%,95% 100%,5% 100%,0 50%)}
.led-stars.lec-clear .le-plate::before{background:linear-gradient(90deg,#8a5a12,#fde68a,#c08a1e,#fff3c4,#a86f12)}
.led-stars.lec-clear .le-plate::after{inset:calc(var(--u)*.08);background:linear-gradient(180deg,#241806,#0d0802)}
`};

// ---------------- 3) النار ----------------
const FL="M0 0C-7-3-9-12-4-20C-3-14-1-13 0-16C2-22 0-27 3-31C8-23 11-11 6-3C4-1 2 0 0 0Z";
const FL_IN="M0 0C-4-2-5-8-2-13C-1-9 1-9 1-11C3-14 2-17 3-19C6-13 6-6 4-2C2-.5 1 0 0 0Z";
const fire={id:"fire",n:32,cat:"fire",name:"Fire Ring",ar:"حلقة النار",pal:"red",frame:"fire",lay:"stack",
 desc:"حلقة لهب تدور بهدوء وألسنة نار تتراقص للأعلى مع جمرات وتوهج يشتد عند كل حدث",
 back:()=>{ const R=leSeed(77); let fl=""; const n=14; for(let i=0;i<n;i++){ const a=i/n*360; const sc=(.75+R()*.55).toFixed(2), du=(.5+R()*.5).toFixed(2), dl=(-R()).toFixed(2);
   fl+=`<g transform="rotate(${a.toFixed(1)} 100 100) translate(100 53) scale(${sc})"><g class="fl" style="animation-duration:${du}s;animation-delay:${dl}s"><path d="${FL}" class="flo"/><path d="${FL_IN}" class="fli"/></g></g>` }
  let em=""; for(let i=0;i<9;i++){ const a=(-160+R()*140)*Math.PI/180, x=100+Math.cos(a)*(60+R()*14), y=100+Math.sin(a)*(60+R()*14); em+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(1+R()*1.4).toFixed(1)}" class="fe" style="animation-delay:${(R()*2.4).toFixed(2)}s"/>` }
  return `${SVGO}<defs><linearGradient id="flg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff2a00"/><stop offset=".55" stop-color="#ff7a00"/><stop offset="1" stop-color="#ffd23a" stop-opacity=".9"/></linearGradient><linearGradient id="flg2" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffb300"/><stop offset="1" stop-color="#fff6b0"/></linearGradient><radialGradient id="flgl"><stop offset=".45" stop-color="#ff5a00" stop-opacity=".55"/><stop offset="1" stop-color="#ff2a00" stop-opacity="0"/></radialGradient></defs>
  <circle cx="100" cy="100" r="86" fill="url(#flgl)" class="fl-gl"/><g class="fl-ring">${fl}</g><circle cx="100" cy="100" r="50" class="fl-rot"/>${em}</svg>` },
 front:()=>"",
 pulse(c){ c.classList.remove("fl-flare"); void c.offsetWidth; c.classList.add("fl-flare"); setTimeout(()=>c.classList.remove("fl-flare"),900) },
 css:`
.led-fire .fl{transform-box:fill-box;transform-origin:50% 100%;animation:fl-flick .7s ease-in-out infinite alternate}
.led-fire .flo{fill:url(#flg)}.led-fire .fli{fill:url(#flg2);opacity:.9}
@keyframes fl-flick{0%{transform:scale(1,1) skewX(0)}35%{transform:scale(.88,1.18) skewX(-5deg)}70%{transform:scale(1.06,.9) skewX(4deg)}100%{transform:scale(.94,1.28) skewX(-2deg)}}
.led-fire .fl-ring{transform-box:view-box;transform-origin:100px 100px;animation:le-spin calc(30s / var(--as,1)) linear infinite}
.led-fire .fl-rot{fill:none;stroke:#ffb300;stroke-width:2.2;stroke-dasharray:10 6 3 6;transform-box:view-box;transform-origin:100px 100px;animation:le-spin calc(8s / var(--as,1)) linear infinite reverse;opacity:.8}
.led-fire .fl-gl{opacity:calc(.8 * var(--gl));animation:fl-gl calc(1.6s / var(--as,1)) ease-in-out infinite alternate;transform-box:fill-box;transform-origin:center}
@keyframes fl-gl{from{opacity:calc(.6 * var(--gl));transform:scale(.97)}to{opacity:calc(.95 * var(--gl));transform:scale(1.03)}}
.led-fire .fe{fill:#ffcc4d;transform-box:fill-box;opacity:0;animation:fl-ember calc(2.4s / var(--as,1)) ease-out infinite}
@keyframes fl-ember{0%{opacity:0;transform:translateY(0)}20%{opacity:1}100%{opacity:0;transform:translate(4px,-28px) scale(.4)}}
.led-fire .fl-flare .le-back{animation:fl-flare .85s ease}
@keyframes fl-flare{0%{filter:none;transform:scale(1)}30%{filter:brightness(1.9) saturate(1.3);transform:scale(1.08)}100%{filter:none;transform:scale(1)}}
.led-fire .le-avi img{box-shadow:0 0 0 calc(var(--S)*.008) #000}
.led-fire.lec-clear .le-plate{background:none;border:0;box-shadow:none;border-radius:0}
.led-fire.lec-clear .le-plate::before,.led-fire.lec-clear .le-plate::after{content:"";position:absolute;inset:0;z-index:-1;clip-path:polygon(7% 0,100% 0,93% 100%,0 100%)}
.led-fire.lec-clear .le-plate::before{background:linear-gradient(90deg,#ff2a00,#ffb300,#ff5a00,#ffd23a,#ff2a00);filter:drop-shadow(0 0 6px #ff5a00);animation:fl-edge calc(2s / var(--as,1)) linear infinite;background-size:200% 100%}
.led-fire.lec-clear .le-plate::after{inset:calc(var(--u)*.08);background:linear-gradient(180deg,#2a0603,#120201)}
@keyframes fl-edge{to{background-position:200% 0}}
`};

// ---------------- 4) التاج ----------------
const CR_FEATH=(ang,len,w)=>`<g transform="rotate(${ang} 74 108)"><path d="M74 108C64 ${108-w} ${74-len*.6} ${108-w-2} ${74-len} 106C${74-len*.6} ${110+w*.6} 64 ${110+w*.4} 74 108Z" class="cr-fe"/><path d="M74 108L${74-len+4} 106" class="cr-fv"/></g>`;
const CR_WING=[[-46,58,7],[-30,64,8],[-14,66,8],[2,60,7],[18,48,6]].map(a=>CR_FEATH(...a)).join("");
const crown={id:"crown",n:11,cat:"royal",name:"Imperial Crown",ar:"التاج الملكي",pal:"gold",frame:"gold",lay:"stack",
 desc:"تاج ذهبي ينزل فوق الصورة مع جناحين ذهبيين وزخارف تدور ولمعة على حواف التاج واحتفال عند التحديث",
 back:()=>`${SVGO}<defs><linearGradient id="crw" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#fff3c4"/><stop offset=".5" stop-color="#e8b84a"/><stop offset="1" stop-color="#8a5a12"/></linearGradient></defs>
  <g class="cr-wing l">${CR_WING}</g><g transform="translate(200 0) scale(-1 1)"><g class="cr-wing r">${CR_WING}</g></g>
  <g class="cr-orn"><circle cx="100" cy="100" r="58" class="cr-or"/>${Array.from({length:12},(_,i)=>`<path transform="rotate(${i*30} 100 100)" d="M100 39l2.6 3-2.6 3-2.6-3z" class="cr-dm"/>`).join("")}</g></svg>`,
 front:()=>`${SVGO}<defs><linearGradient id="crg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3c4"/><stop offset=".45" stop-color="#f6c94a"/><stop offset="1" stop-color="#9a6a14"/></linearGradient><clipPath id="crc"><path d="M68 60L63 28L82 43L100 18L118 43L137 28L132 60Z"/><rect x="66" y="58" width="68" height="10" rx="2"/></clipPath><linearGradient id="crsh" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
  <g class="cr-crown"><path d="M68 60L63 28L82 43L100 18L118 43L137 28L132 60Z" fill="url(#crg)" stroke="#7a4e0c" stroke-width="1"/><rect x="66" y="58" width="68" height="10" rx="2" fill="url(#crg)" stroke="#7a4e0c" stroke-width="1"/>
   <circle cx="63" cy="27" r="3.2" class="cr-pl"/><circle cx="100" cy="17" r="3.8" class="cr-pl"/><circle cx="137" cy="27" r="3.2" class="cr-pl"/>
   <path d="M100 44l5 6-5 6-5-6z" class="cr-ruby"/><circle cx="80" cy="63" r="2.6" class="cr-sap"/><circle cx="100" cy="63" r="2.6" class="cr-ruby"/><circle cx="120" cy="63" r="2.6" class="cr-sap"/>
   <g clip-path="url(#crc)"><rect x="40" y="10" width="26" height="70" fill="url(#crsh)" class="cr-gloss" transform="skewX(-18)"/></g></g>
  ${[[56,22,4],[146,18,4.5],[40,44,3],[160,48,3],[100,4,3]].map(([x,y,s],i)=>`<path d="${leSpark(x,y,s)}" class="cr-sp" style="animation-delay:${(i*.45).toFixed(2)}s"/>`).join("")}</svg>`,
 plate:`<i class="cr-gem"></i>`,
 pulse(c){ const b=c.querySelector(".le-burst"); if(!b) return; const R=leSeed(Date.now()%7919); const cols=["#fde68a","#f6c94a","#fff3c4","#c08a1e","#ffffff"];
  for(let i=0;i<18;i++){ const s=document.createElement("i"); s.className="le-confetti"; const a=R()*Math.PI*2, d=60+R()*90; s.style.cssText=`background:${cols[i%5]};--tx:${(Math.cos(a)*d).toFixed(0)}%;--ty:${(Math.sin(a)*d-40).toFixed(0)}%;--r:${(R()*720-360).toFixed(0)}deg;animation-delay:${(R()*.15).toFixed(2)}s`; s.style.setProperty("--tx",(Math.cos(a)*d*2).toFixed(0)+"px"); s.style.setProperty("--ty",(Math.sin(a)*d*1.6-50).toFixed(0)+"px"); b.appendChild(s); setTimeout(()=>s.remove(),1700) }
  const cr=c.querySelector(".cr-crown"); if(cr){ cr.classList.remove("cr-hop"); void cr.getBBox; requestAnimationFrame(()=>cr.classList.add("cr-hop")); setTimeout(()=>cr.classList.remove("cr-hop"),800) } },
 css:`
.led-crown .cr-fe{fill:url(#crw);stroke:#7a4e0c;stroke-width:.5}
.led-crown .cr-fv{stroke:#fff6d0;stroke-width:.5;opacity:.6}
.led-crown .cr-wing{transform-box:view-box;transform-origin:74px 108px;animation:cr-wing calc(3.4s / var(--as,1)) ease-in-out infinite;filter:drop-shadow(0 0 3px #f6c94a88)}
@keyframes cr-wing{0%,100%{transform:rotate(0)}50%{transform:rotate(-5deg)}}
.led-crown .le-enter .cr-wing{animation:cr-open calc(var(--d)*.9) cubic-bezier(.2,1.2,.3,1) calc(var(--d)*.3) both}
@keyframes cr-open{from{transform:rotate(40deg) scale(.4);opacity:0}to{transform:none;opacity:1}}
.led-crown .cr-orn{transform-box:view-box;transform-origin:100px 100px;animation:le-spin calc(24s / var(--as,1)) linear infinite}
.led-crown .cr-or{fill:none;stroke:#e8b84a;stroke-width:.8;stroke-dasharray:2 4;opacity:.7}
.led-crown .cr-dm{fill:#fde68a;filter:drop-shadow(0 0 2px #f6c94a)}
.led-crown .cr-pl{fill:#fffdf0;stroke:#c08a1e;stroke-width:.6}
.led-crown .cr-ruby{fill:#e0213a;stroke:#7a0e1a;stroke-width:.5}.led-crown .cr-sap{fill:#2f7bff;stroke:#0a2f7a;stroke-width:.5}
.led-crown .cr-crown{transform-box:fill-box;transform-origin:50% 100%;filter:drop-shadow(0 3px 3px #0008) drop-shadow(0 0 6px #f6c94a77)}
.led-crown .le-enter .cr-crown{animation:cr-drop calc(var(--d)*.8) cubic-bezier(.3,1.5,.4,1) calc(var(--d)*.55) both}
@keyframes cr-drop{0%{opacity:0;transform:translateY(-70px) rotate(-8deg)}60%{opacity:1}100%{opacity:1;transform:none}}
.led-crown .cr-hop{animation:cr-hop .7s cubic-bezier(.3,1.6,.4,1)}
@keyframes cr-hop{0%{transform:none}35%{transform:translateY(-10px) rotate(4deg)}100%{transform:none}}
.led-crown .cr-gloss{animation:cr-gloss calc(3.2s / var(--as,1)) ease-in-out infinite}
@keyframes cr-gloss{0%,55%{transform:skewX(-18deg) translateX(0)}100%{transform:skewX(-18deg) translateX(120px)}}
.led-crown .cr-sp{fill:#fff6c8;transform-box:fill-box;transform-origin:center;opacity:0;animation:bf-tw calc(2.2s / var(--as,1)) ease-in-out infinite}
.led-crown.lec-clear .le-plate{border-radius:calc(var(--u)*.35);background:linear-gradient(180deg,#2a1d07f2,#0f0a02f2);border:calc(var(--u)*.07) solid #e8b84a;box-shadow:0 0 0 calc(var(--u)*.06) #0d0902,0 0 0 calc(var(--u)*.12) #a8761e,0 0 calc(var(--u)*.8*var(--gl)) #f6c94a66;clip-path:polygon(calc(var(--u)*.4) 0,calc(100% - var(--u)*.4) 0,100% calc(var(--u)*.4),100% calc(100% - var(--u)*.4),calc(100% - var(--u)*.4) 100%,calc(var(--u)*.4) 100%,0 calc(100% - var(--u)*.4),0 calc(var(--u)*.4))}
.led-crown .cr-gem{position:absolute;left:50%;top:calc(var(--u)*.04);width:calc(var(--u)*.32);height:calc(var(--u)*.32);margin-left:calc(var(--u)*-.16);background:linear-gradient(135deg,#ff6b81,#b3001e);transform:rotate(45deg);box-shadow:0 0 6px #ff3b4e;z-index:4}
.lel-row.led-crown .cr-gem{display:none}
`};

// ---------------- 5) الألماس ----------------
const DI_SHARDS=[[-168,56,30,9],[-148,60,38,11],[-126,58,30,9],[-108,62,22,8],[-72,62,22,8],[-54,58,30,9],[-32,60,38,11],[-12,56,30,9],[16,58,22,8],[164,58,22,8]];
const diShard=([deg,r0,len,w],i)=>{ const a=deg*Math.PI/180, c=Math.cos(a), s=Math.sin(a), px=-s, py=c; const x0=100+c*r0, y0=100+s*r0, x1=100+c*(r0+len), y1=100+s*(r0+len);
 const p=(x,y)=>`${x.toFixed(1)} ${y.toFixed(1)}`; const m1=[x0+c*len*.25+px*w/2,y0+s*len*.25+py*w/2], m2=[x0+c*len*.25-px*w/2,y0+s*len*.25-py*w/2];
 return `<g class="di-sh" style="animation-delay:${(i*.27).toFixed(2)}s"><path d="M${p(x0,y0)}L${p(...m1)}L${p(x1,y1)}L${p(...m2)}Z" class="di-a"/><path d="M${p(x0,y0)}L${p(...m1)}L${p(x1,y1)}Z" class="di-b"/></g>` };
const diamond={id:"diamond",n:41,cat:"crystal",name:"Ice Diamond",ar:"الألماس الجليدي",pal:"blue",frame:"crystal",lay:"stack",
 desc:"بلورات جليدية تحيط بالصورة وألماسة كبيرة تتكوّن فوقها مع ومضات ثلجية ولمعة تمر على البلورات",
 back:()=>`${SVGO}<defs><linearGradient id="dig" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f2fbff"/><stop offset=".5" stop-color="#8fd8ff"/><stop offset="1" stop-color="#2b7bd8"/></linearGradient></defs>${DI_SHARDS.map(diShard).join("")}</svg>`,
 front:()=>`${SVGO}<defs><linearGradient id="dig2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#9fe3ff"/><stop offset="1" stop-color="#3a8fe0"/></linearGradient></defs>
  <g class="di-big"><path d="M78 26L88 14H112L122 26L100 54Z" fill="url(#dig2)" stroke="#e9fbff" stroke-width="1"/><path d="M78 26H122" stroke="#fff" stroke-width=".8"/><path d="M88 14L94 26L100 14L106 26L112 14" fill="none" stroke="#fff" stroke-width=".7" opacity=".8"/><path d="M78 26L100 54L94 26Z" fill="#fff" opacity=".35"/><path d="M106 26L100 54L122 26Z" fill="#0a4fa8" opacity=".25"/><path d="M88 14L94 26H78Z" fill="#fff" opacity=".55"/>
   <path d="${leSpark(117,14,5)}" class="di-tw"/></g>
  ${[[30,70,3],[172,74,3.5],[22,120,2.5],[180,128,3],[60,26,2.5],[146,30,2.5]].map(([x,y,s],i)=>`<g transform="translate(${x} ${y})" class="di-fl" style="animation-delay:${(i*.5).toFixed(1)}s"><path d="M0 -${s*2}V${s*2}M-${s*1.7} -${s}L${s*1.7} ${s}M-${s*1.7} ${s}L${s*1.7} -${s}"/></g>`).join("")}</svg>`,
 pulse(c){ c.classList.remove("di-flash"); void c.offsetWidth; c.classList.add("di-flash"); setTimeout(()=>c.classList.remove("di-flash"),1400) },
 css:`
.led-diamond .di-a{fill:url(#dig);opacity:.82}.led-diamond .di-b{fill:#fff;opacity:.38}
.led-diamond .di-sh{animation:di-sh calc(3.2s / var(--as,1)) ease-in-out infinite}
.led-diamond .le-back svg{filter:drop-shadow(0 0 2px #8fd8ff)}
@keyframes di-sh{0%,100%{opacity:.8}50%{opacity:1}}
.led-diamond .le-enter .di-sh{animation:di-grow calc(var(--d)*.7) cubic-bezier(.2,1.2,.3,1) both;transform-box:view-box;transform-origin:100px 100px}
@keyframes di-grow{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}
.led-diamond .di-flash .di-sh{animation:di-flash 1.2s ease}
@keyframes di-flash{0%{filter:none}30%{filter:brightness(2) drop-shadow(0 0 6px #fff)}100%{filter:none}}
.led-diamond .di-big{transform-box:fill-box;transform-origin:50% 60%;animation:di-float calc(3s / var(--as,1)) ease-in-out infinite}
@keyframes di-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
.led-diamond .le-enter .di-big{animation:di-form calc(var(--d)*.9) cubic-bezier(.2,1.3,.3,1) calc(var(--d)*.55) both}
@keyframes di-form{0%{opacity:0;transform:scale(.2) rotate(30deg);filter:brightness(3)}70%{opacity:1}100%{opacity:1;transform:none;filter:drop-shadow(0 0 5px #9fe3ff)}}
.led-diamond .di-tw{fill:#fff;transform-box:fill-box;transform-origin:center;animation:bf-tw calc(1.8s / var(--as,1)) ease-in-out infinite}
.led-diamond .di-fl{stroke:#e9fbff;stroke-width:.9;stroke-linecap:round;opacity:0;animation:di-snow calc(4s / var(--as,1)) ease-in-out infinite}
@keyframes di-snow{0%{opacity:0;transform:translateY(0)}30%{opacity:.9}100%{opacity:0;transform:translateY(14px)}}
.led-diamond.lec-clear .le-plate{background:none;border:0;box-shadow:none;border-radius:0;filter:drop-shadow(0 0 calc(var(--u)*.35*var(--gl)) #5ab8ff)}
.led-diamond.lec-clear .le-plate::before,.led-diamond.lec-clear .le-plate::after{content:"";position:absolute;inset:0;z-index:-1;clip-path:polygon(4% 0,96% 0,100% 30%,100% 70%,96% 100%,4% 100%,0 70%,0 30%)}
.led-diamond.lec-clear .le-plate::before{background:linear-gradient(120deg,#e9fbff,#5ab8ff 30%,#ffffff 50%,#2b7bd8 75%,#cfefff)}
.led-diamond.lec-clear .le-plate::after{inset:calc(var(--u)*.08);background:linear-gradient(180deg,#0b2240f0,#050f1ff0)}
`};

leRegister([butterfly,stars,fire,crown,diamond]);
