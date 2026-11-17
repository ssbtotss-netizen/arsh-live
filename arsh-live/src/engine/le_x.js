// ====== آخر التفاعلات — مجموعة «B6O6 الحصرية PRO» (81–110): 30 تصميماً أصلياً ======
// كل تصميم يعمل مع كل الأنشطة (متابعة، هدية، لايك، مشاركة، انضمام، اشتراك، دونيشن…) — نفس محرك leview.
// المعرّفات تبدأ بـ x = تصاميم PRO (يُفرض على الخادم). رسم SVG أصلي بالكامل (بدون شعارات أو ملفات محمية).
import { LK_SVG, lkP, lkSpark, lkGem, lkStar8, lkPoly, lkStars, lkSeed, lkDef, lkRegister } from "./le_kit.js";
import { LE_GROUPS, LE_PLAN } from "./leview.js";
Object.assign(LE_GROUPS,{excl:"B6O6 الحصرية PRO"});

const lxRing=(r,c,w=2,cls="",dash="")=>`<circle cx="100" cy="100" r="${r}" fill="none" stroke="${c}" stroke-width="${w}" ${dash?`stroke-dasharray="${dash}"`:""} class="${cls}"/>`;
const lxRays=(n,r1,r2,c,w=2,cls="")=>`<g class="${cls}">${Array.from({length:n},(_,i)=>{ const a=i*360/n, [x1,y1]=lkP(100,100,a,r1), [x2,y2]=lkP(100,100,a,r2); return `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>` }).join("")}</g>`;
const lxAround=(n,r,fn,from=0,span=360)=>Array.from({length:n},(_,i)=>{ const a=from+i*span/(span===360?n:Math.max(1,n-1)), [x,y]=lkP(100,100,a,r); return fn(x,y,a,i) }).join("");
const lxSparks=(n,r,c,seed=1)=>{ const R=lkSeed(seed); return lxAround(n,r,(x,y,a,i)=>`<path d="${lkSpark(x+(R()-.5)*14,y+(R()-.5)*14,2.5+R()*3)}" fill="${c}" class="lx-tw" style="animation-delay:${(-R()*2.4).toFixed(2)}s"/>`) };
const lxHeart=(x,y,s,c)=>`<path transform="translate(${x} ${y}) scale(${s})" d="M0 6C-7 0-9-4-6-7C-4-9-1-8 0-5C1-8 4-9 6-7C9-4 7 0 0 6Z" fill="${c}"/>`;
const lxCrown=(x,y,s,c1,c2)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M-20 10L-23-12L-10 0L0-18L10 0L23-12L20 10Z" fill="${c1}" stroke="#fff6d0" stroke-width="1.2"/><rect x="-21" y="9" width="42" height="6" rx="2" fill="${c2}"/>${[-12,0,12].map(cx=>`<circle cx="${cx}" cy="4" r="2.6" fill="${cx?"#22e1ff":"#ff2d55"}"/>`).join("")}</g>`;
const lxWing=(side,c1,c2,cls="")=>{ const m=side<0?`translate(200 0) scale(-1 1)`:""; return `<g transform="${m}"><g class="${cls}">${[0,1,2,3,4].map(i=>`<path d="M140 ${92-i*3}C${160+i*6} ${70-i*12} ${178+i*3} ${70-i*6} ${190-i*2} ${60+i*8}C${176-i*4} ${84+i*2} ${160-i*2} ${96} 142 ${104-i*2}Z" fill="${i%2?c2:c1}" opacity="${1-i*.1}" stroke="#ffffff55" stroke-width=".5"/>`).join("")}</g></g>` };
const lxFlame=(x,y,s,a,c="#ff5a1f",cls="lx-fl")=>`<path transform="translate(${x} ${y}) rotate(${a}) scale(${s})" d="M0 0C-6-3-8-11-3-18C-2-12 0-11 1-14C3-19 1-23 3-27C8-20 10-10 5-3Z" fill="${c}" class="${cls}"/>`;
const lxPL=(c1,c2,b1,b2,r=.5)=>({plateCss:[c1,c2,b1,b2,r]});
const X=(o)=>lkDef({cat:"excl",frame:"auto",...o});

const LX=[
 // 1) Royal Crown — تاج ملكي ينزل وهالة أشعة ذهبية
 X({id:"xRoyalCrown",n:81,name:"Royal Crown",ar:"التاج الملكي",pal:"gold",frame:"gold",desc:"تاج ذهبي مرصّع ينزل فوق الصورة مع هالة أشعة ذهبية تدور ببطء",
  back:()=>`${LK_SVG}<g class="lk-spin" style="--sd:40s">${lxRays(24,62,90,"#f6c94a66",3)}</g>${lxRing(66,"#f6c94a",2.5)}${lxRing(71,"#fff3c4",.8,"","3 5")}</svg>`,
  front:()=>`${LK_SVG}<g class="xrc-c">${lxCrown(100,26,1.15,"#f6c94a","#b8862b")}</g>${lxSparks(6,80,"#fff3c4",3)}</svg>`,
  css:`.D .xrc-c{transform-box:fill-box;transform-origin:50% 100%}.D .le-enter .xrc-c,.led-xRoyalCrown.le-enter .xrc-c{animation:xrc-down .9s cubic-bezier(.2,1.4,.3,1) both}@keyframes xrc-down{from{transform:translateY(-40px);opacity:0}}`,...lxPL("#f6c94a","#f6c94a66","#241805f2","#0f0a02f2")}),
 // 2) Diamond Storm — عاصفة ألماس تدور
 X({id:"xDiamondStorm",n:82,name:"Diamond Storm",ar:"عاصفة الألماس",pal:"blue",frame:"crystal",desc:"ألماسات زرقاء تدور حول الصورة في دوامة مع ومضات بيضاء",
  back:()=>`${LK_SVG}<g class="lk-spin" style="--sd:9s">${lxAround(8,74,(x,y,a,i)=>lkGem(x,y,5+(i%3)*2,"#9fe3ff","#2b7bd8"))}</g><g class="lk-spinr" style="--sd:14s">${lxAround(6,58,(x,y)=>lkGem(x,y,3.5,"#e9fbff","#7cc4ff"))}</g></svg>`,
  front:()=>`${LK_SVG}${lxSparks(8,86,"#ffffff",5)}</svg>`,...lxPL("#9fe3ff","#3ba8ff66","#06122af2","#020814f2")}),
 // 3) Neon Pulse — نبض نيون
 X({id:"xNeonPulse",n:83,name:"Neon Pulse",ar:"نبض النيون",pal:"pink",frame:"neon",desc:"حلقات نيون وردية وزرقاء تنبض للخارج مع كل نشاط",
  back:()=>`${LK_SVG}${lxRing(64,"#ff2d95",3,"xnp-a")}${lxRing(64,"#22e1ff",2,"xnp-b")}${lxRing(70,"#ff2d95",1.2,"","2 6")}</svg>`,
  front:()=>`${LK_SVG}<path d="M20 100H52L60 84L70 116L80 94L86 100H114L120 88L130 112L138 100H180" fill="none" stroke="#22e1ff" stroke-width="2" class="xnp-ecg" style="filter:drop-shadow(0 0 3px #22e1ff)"/></svg>`,
  css:`.D .xnp-a,.D .xnp-b{transform-box:view-box;transform-origin:100px 100px;animation:xnp-p calc(1.8s / var(--as,1)) ease-out infinite;filter:drop-shadow(0 0 4px currentColor)}.D .xnp-b{animation-delay:-.9s}@keyframes xnp-p{from{transform:scale(.9);opacity:1}to{transform:scale(1.35);opacity:0}}.D .xnp-ecg{stroke-dasharray:240;animation:xnp-e 2s linear infinite}@keyframes xnp-e{from{stroke-dashoffset:240}to{stroke-dashoffset:-240}}`,...lxPL("#ff2d95","#22e1ff66","#1f0614f2","#0e020af2")}),
 // 4) Galaxy Portal — بوابة مجرة
 X({id:"xGalaxyPortal",n:84,name:"Galaxy Portal",ar:"بوابة المجرة",pal:"purple",frame:"stars",desc:"بوابة مجرية دوّارة بأذرع حلزونية ونجوم خلف الصورة",
  back:()=>`${LK_SVG}<defs><radialGradient id="xgp"><stop offset=".55" stop-color="#8b3dff00"/><stop offset=".75" stop-color="#8b3dff88"/><stop offset="1" stop-color="#22e1ff00"/></radialGradient></defs><circle cx="100" cy="100" r="88" fill="url(#xgp)"/><g class="lk-spin" style="--sd:12s">${[0,90,180,270].map(a=>`<path transform="rotate(${a} 100 100)" d="M100 100C130 70 170 80 178 110" fill="none" stroke="#e0b8ff" stroke-width="2" opacity=".7"/>`).join("")}</g>${lkStars(84,26)}</svg>`,
  front:()=>``,...lxPL("#b56bff","#8b3dff66","#12061ff2","#06020ef2")}),
 // 5) Crystal Glass — زجاج كريستالي
 X({id:"xCrystalGlass",n:85,name:"Crystal Glass",ar:"الزجاج الكريستالي",pal:"white",frame:"crystal",desc:"أوجه زجاجية سداسية شفافة بلمعة بيضاء تمر عليها",
  back:()=>`${LK_SVG}<path d="${lkPoly(100,100,74,6)}" fill="#ffffff12" stroke="#e0f2fe" stroke-width="1.5"/><path d="${lkPoly(100,100,64,6,-60)}" fill="none" stroke="#bae6fd" stroke-width="1"/>${lxAround(6,74,(x,y)=>`<path d="M100 100L${x} ${y}" stroke="#ffffff33"/>`,-90)}<clipPath id="xcgc"><path d="${lkPoly(100,100,74,6)}"/></clipPath><g clip-path="url(#xcgc)"><rect x="20" y="-40" width="26" height="280" fill="#ffffff2a" class="xcg-sh"/></g></svg>`,
  front:()=>`${LK_SVG}${lxSparks(4,80,"#ffffff",9)}</svg>`,
  css:`.D .xcg-sh{animation:xcg 3.4s ease-in-out infinite}@keyframes xcg{0%{transform:translateX(-80px) rotate(25deg)}60%,100%{transform:translateX(220px) rotate(25deg)}}`,...lxPL("#e0f2fe","#ffffff55","#0e1420e0","#06090fe0")}),
 // 6) Cyber Dragon — تنين سايبر
 X({id:"xCyberDragon",n:86,name:"Cyber Dragon",ar:"التنين السايبر",pal:"green",frame:"neon",desc:"تنين إلكتروني بخطوط دوائر خضراء يلتف حول الصورة",
  back:()=>`${LK_SVG}<path d="M40 150C10 100 40 30 100 26C160 22 192 80 168 132C160 150 140 166 120 172" fill="none" stroke="#2ee59d" stroke-width="5" stroke-linecap="round" class="xcd-b"/><path d="M40 150C10 100 40 30 100 26C160 22 192 80 168 132" fill="none" stroke="#0b3d2a" stroke-width="1.5" stroke-dasharray="4 4"/>${lxAround(10,80,(x,y)=>`<rect x="${x-2}" y="${y-2}" width="4" height="4" fill="#7dffc4" class="lx-tw"/>`,200,280)}</svg>`,
  front:()=>`${LK_SVG}<g transform="translate(120 172)"><path d="M0 0L16 -6L26 2L16 6L6 14Z" fill="#11c47a" stroke="#7dffc4"/><circle cx="16" cy="-1" r="1.6" fill="#ff2d55"/></g></svg>`,
  css:`.D .xcd-b{stroke-dasharray:420;animation:xcd 2.2s ease-out both;filter:drop-shadow(0 0 4px #2ee59d)}@keyframes xcd{from{stroke-dashoffset:420}}`,...lxPL("#2ee59d","#2ee59d66","#04170ff2","#020a06f2")}),
 // 7) Pink Butterfly — فراشات وردية
 X({id:"xPinkButterfly",n:87,name:"Pink Butterfly",ar:"الفراشة الوردية",pal:"pink",frame:"butterfly",desc:"فراشتان ورديتان كبيرتان ترفرفان على جانبي الصورة وقلوب صغيرة",
  back:()=>`${LK_SVG}${[[-1,30],[1,170]].map(([s,x])=>`<g transform="translate(${x} 70) scale(${s} 1)"><g class="xpb-w"><path d="M0 0C-26-30-50-10-36 14C-28 26-10 18 0 6Z" fill="#ff9ad0" stroke="#fff" stroke-width="1"/><path d="M0 6C-18 18-28 40-12 40C-4 40 0 24 0 10Z" fill="#ff5fb8" stroke="#fff" stroke-width=".8"/></g></g>`).join("")}</svg>`,
  front:()=>`${LK_SVG}${lxAround(5,84,(x,y,a,i)=>`<g class="lk-bob" style="animation-delay:${-i*.5}s">${lxHeart(x,y,.8,"#ffb3dc")}</g>`,200,140)}</svg>`,
  css:`.D .xpb-w{transform-box:fill-box;transform-origin:100% 50%;animation:lk-flap calc(.7s / var(--as,1)) ease-in-out infinite}`,...lxPL("#ff9ad0","#ff2d9566","#1f0614f2","#0e020af2")}),
 // 8) Golden Lion — لبدة أسد ذهبية
 X({id:"xGoldenLion",n:88,name:"Golden Lion",ar:"الأسد الذهبي",pal:"gold",frame:"gold",desc:"لبدة أسد ذهبية متموجة تحيط بالصورة وزئير من الشرارات",
  back:()=>`${LK_SVG}<g class="xgl-m">${lxAround(22,74,(x,y,a)=>`<path transform="translate(${x} ${y}) rotate(${a+90})" d="M-7 6C-8-6-2-16 0-18C2-16 8-6 7 6Z" fill="${Math.round(a/16)%2?"#d4a017":"#f6c94a"}" stroke="#7a5200" stroke-width=".6"/>`)}</g>${lxRing(62,"#7a5200",3)}</svg>`,
  front:()=>`${LK_SVG}${lxSparks(6,92,"#fde68a",11)}</svg>`,
  css:`.D .xgl-m{transform-box:view-box;transform-origin:100px 100px;animation:xgl 3s ease-in-out infinite}@keyframes xgl{50%{transform:scale(1.05) rotate(3deg)}}`,...lxPL("#f6c94a","#d4a01766","#241805f2","#0f0a02f2")}),
 // 9) Fire Phoenix — طائر العنقاء الناري
 X({id:"xFirePhoenix",n:89,name:"Fire Phoenix",ar:"العنقاء النارية",pal:"red",frame:"fire",desc:"جناحا عنقاء من لهب يفتحان خلف الصورة مع ريش ناري متصاعد",
  back:()=>`${LK_SVG}${lxWing(1,"#ff5a1f","#ffb020","xfp-w")}${lxWing(-1,"#ff5a1f","#ffb020","xfp-w")}${lxAround(9,64,(x,y,a,i)=>lxFlame(x,y,.9,a+90,i%2?"#ff7a00":"#ff3b1f"),30,120)}</svg>`,
  front:()=>`${LK_SVG}${lxAround(5,40,(x,y,a,i)=>`<circle cx="${x}" cy="${y+60}" r="2" fill="#ffd000" class="xfp-e" style="animation-delay:${-i*.4}s"/>`,200,140)}</svg>`,
  css:`.D .xfp-w{transform-box:view-box;transform-origin:140px 100px;animation:xfp 2.4s ease-in-out infinite}@keyframes xfp{50%{transform:rotate(-6deg)}}.D .lx-fl{transform-box:fill-box;transform-origin:50% 100%;animation:fl-flick .5s ease-in-out infinite alternate}.D .xfp-e{animation:lk-rise 2s ease-out infinite}`,...lxPL("#ff5a1f","#ff2d0066","#2a0804f2","#120302f2")}),
 // 10) Luxury Minimal — فخامة بسيطة
 X({id:"xLuxuryMinimal",n:90,name:"Luxury Minimal",ar:"الفخامة البسيطة",pal:"white",frame:"circle",desc:"خط ذهبي رفيع وحلقة واحدة أنيقة بدون أي زخرفة زائدة",
  back:()=>`${LK_SVG}${lxRing(62,"#e8c46a",1.2)}<path d="M38 168H162" stroke="#e8c46a" stroke-width="1" class="xlm-l"/></svg>`,front:()=>``,
  css:`.D .xlm-l{stroke-dasharray:124;animation:xlm 1.2s ease-out both}@keyframes xlm{from{stroke-dashoffset:124}}`,...lxPL("#e8c46a","#00000000","#000000a0","#00000080",.2)}),
 // 11) RGB Gaming — ألوان RGB متدرجة
 X({id:"xRgbGaming",n:91,name:"RGB Gaming",ar:"قيمنق RGB",pal:"blue",frame:"neon",desc:"حلقة RGB تتدرج ألوانها باستمرار وزوايا HUD مقطوعة",
  back:()=>`${LK_SVG}<defs><linearGradient id="xrg" x1="0" x2="1"><stop offset="0" stop-color="#ff2d55"/><stop offset=".33" stop-color="#2ee59d"/><stop offset=".66" stop-color="#3ba8ff"/><stop offset="1" stop-color="#b56bff"/></linearGradient></defs><g class="lk-spin" style="--sd:4s">${lxRing(66,"url(#xrg)",5)}</g>${[[28,28,1,1],[172,28,-1,1],[28,172,1,-1],[172,172,-1,-1]].map(([x,y,a,b])=>`<path d="M${x} ${y+16*b}V${y}H${x+16*a}" fill="none" stroke="#ffffff" stroke-width="2"/>`).join("")}</svg>`,
  front:()=>``,css:`.D .lk-spin{filter:drop-shadow(0 0 6px #b56bff) hue-rotate(0deg);animation:lk-spin calc(4s / var(--as,1)) linear infinite,xrg-h 3s linear infinite}@keyframes xrg-h{to{filter:drop-shadow(0 0 6px #b56bff) hue-rotate(360deg)}}`,...lxPL("#3ba8ff","#b56bff66","#06111ff2","#02060ff2",.15)}),
 // 12) Saudi Emerald — زمرد سعودي
 X({id:"xSaudiEmerald",n:92,name:"Saudi Emerald",ar:"الزمرد السعودي",pal:"green",frame:"gold",desc:"نجمة ثمانية زمردية بإطار ذهبي وزخرفة نجدية متكررة",
  back:()=>`${LK_SVG}<path d="${lkStar8(100,100,82,68)}" fill="#05301e" stroke="#c9a227" stroke-width="2"/><path d="${lkStar8(100,100,74,62)}" fill="none" stroke="#11c47a" stroke-width="1" stroke-dasharray="3 3" class="lk-spin" style="--sd:30s"/>${lxAround(8,78,(x,y)=>`<path d="${lkPoly(x,y,4,4)}" fill="#c9a227"/>`,22.5)}</svg>`,
  front:()=>`${LK_SVG}${lxSparks(4,90,"#fde68a",13)}</svg>`,...lxPL("#11c47a","#c9a22766","#04170ff2","#020a06f2")}),
 // 13) Ocean Wave — موج المحيط
 X({id:"xOceanWave",n:93,name:"Ocean Wave",ar:"موج البحر",pal:"blue",frame:"circle",desc:"أمواج زرقاء تتحرك أسفل الصورة وفقاعات صاعدة",
  back:()=>`${LK_SVG}<clipPath id="xow"><circle cx="100" cy="100" r="80"/></clipPath><g clip-path="url(#xow)"><path class="xow-w" d="M-100 150Q-75 140 -50 150T0 150T50 150T100 150T150 150T200 150T250 150T300 150V200H-100Z" fill="#1e7bff99"/><path class="xow-w2" d="M-100 160Q-75 150 -50 160T0 160T50 160T100 160T150 160T200 160T250 160T300 160V200H-100Z" fill="#3ba8ffcc"/></g>${lxRing(80,"#9fd3ff",1.5)}</svg>`,
  front:()=>`${LK_SVG}${[60,90,130,150].map((x,i)=>`<circle cx="${x}" cy="170" r="${2+i%2}" fill="none" stroke="#e0f2fe" class="xow-b" style="animation-delay:${-i*.6}s"/>`).join("")}</svg>`,
  css:`.D .xow-w{animation:xow 3s linear infinite}.D .xow-w2{animation:xow 2.2s linear infinite reverse}@keyframes xow{to{transform:translateX(100px)}}.D .xow-b{animation:lk-rise 2.6s ease-out infinite}`,...lxPL("#3ba8ff","#1e7bff66","#06111ff2","#02060ff2")}),
 // 14) Thunder Bolt — برق
 X({id:"xThunderBolt",n:94,name:"Thunder Bolt",ar:"الصاعقة",pal:"blue",frame:"neon",desc:"صواعق صفراء تضرب من الأعلى مع وميض عند كل نشاط",
  back:()=>`${LK_SVG}${lxRing(68,"#facc15",2,"","10 6")}${[[40,20,-15],[160,20,15]].map(([x,y,r])=>`<path transform="translate(${x} ${y}) rotate(${r})" d="M6 0L-4 22H4L-2 40L14 14H6L12 0Z" fill="#facc15" stroke="#fff" class="xtb-b"/>`).join("")}</svg>`,
  front:()=>`${LK_SVG}<circle cx="100" cy="100" r="90" fill="#ffffff" class="xtb-f"/></svg>`,
  css:`.D .xtb-b{animation:xtb 1.6s steps(1) infinite;filter:drop-shadow(0 0 6px #facc15)}@keyframes xtb{0%,40%,60%,100%{opacity:1}50%{opacity:.2}}.D .xtb-f{opacity:0}.lk-hit.led-xThunderBolt .xtb-f{animation:xtb-f .5s ease-out}@keyframes xtb-f{0%{opacity:.5}100%{opacity:0}}`,...lxPL("#facc15","#facc1566","#14130af2","#070600f2")}),
 // 15) Rose Garden — حديقة ورد
 X({id:"xRoseGarden",n:95,name:"Rose Garden",ar:"حديقة الورد",pal:"red",frame:"circle",desc:"إكليل ورود حمراء حول الصورة وبتلات تتساقط",
  back:()=>`${LK_SVG}${lxAround(12,70,(x,y,a,i)=>`<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 -8C6 -8 8 -2 4 2C8 4 4 9 0 7C-4 9 -8 4 -4 2C-8 -2 -6 -8 0 -8Z" fill="${i%2?"#e11d48":"#be123c"}" stroke="#fecdd3" stroke-width=".6"/><path d="M-10 0L-16 -4" stroke="#15803d" stroke-width="2"/></g>`)}</svg>`,
  front:()=>`${LK_SVG}${[40,80,120,160].map((x,i)=>`<path d="M${x} 10q4-5 8 0q-4 5-8 0z" fill="#fda4af" class="xrg-p" style="animation-delay:${-i*.9}s"/>`).join("")}</svg>`,
  css:`.D .xrg-p{animation:lk-fall 3.6s linear infinite}`,...lxPL("#e11d48","#be123c66","#1c0508f2","#0e0203f2")}),
 // 16) Moon Night — ليلة القمر
 X({id:"xMoonNight",n:96,name:"Moon Night",ar:"ليلة القمر",pal:"silver",frame:"stars",desc:"هلال فضي كبير خلف الصورة ونجوم متلألئة وسحاب خفيف",
  back:()=>`${LK_SVG}<path d="M130 20A80 80 0 1 0 186 120A64 64 0 1 1 130 20Z" fill="#e5e7eb" opacity=".9" class="xmn-m"/>${lkStars(96,20)}<path d="M20 170C30 160 50 162 56 170C66 164 84 168 84 178H20Z" fill="#ffffff22"/></svg>`,
  front:()=>``,css:`.D .xmn-m{filter:drop-shadow(0 0 10px #e5e7eb88)}`,...lxPL("#d6dde8","#9fb0c866","#0e1218f2","#05070af2")}),
 // 17) Ice Queen — ملكة الجليد
 X({id:"xIceQueen",n:97,name:"Ice Queen",ar:"ملكة الجليد",pal:"blue",frame:"crystal",desc:"تاج جليدي من شظايا كريستال ورقاقات ثلج تتساقط",
  back:()=>`${LK_SVG}${lxAround(9,72,(x,y,a)=>`<path transform="translate(${x} ${y}) rotate(${a+90})" d="M0 -14L5 0L0 10L-5 0Z" fill="#bae6fd" stroke="#fff" stroke-width=".6"/>`,200,140)}${lxRing(64,"#e0f2fe",1)}</svg>`,
  front:()=>`${LK_SVG}${[30,70,110,150,180].map((x,i)=>`<g class="xiq-s" style="animation-delay:${-i*.8}s"><path transform="translate(${x} 0)" d="M0-5V5M-4.3-2.5L4.3 2.5M-4.3 2.5L4.3-2.5" stroke="#fff" stroke-width="1.2"/></g>`).join("")}</svg>`,
  css:`.D .xiq-s{animation:lk-fall 4s linear infinite}`,...lxPL("#bae6fd","#7dd3fc66","#06122af2","#020814f2")}),
 // 18) Desert Falcon — صقر الصحراء
 X({id:"xDesertFalcon",n:98,name:"Desert Falcon",ar:"صقر الصحراء",pal:"gold",frame:"gold",desc:"صقر يفرد جناحيه فوق الصورة مع كثبان رملية ذهبية",
  back:()=>`${LK_SVG}<path d="M0 176C40 160 70 168 100 176C130 166 160 160 200 176V200H0Z" fill="#d6c4a0aa"/>${lxRing(66,"#c9a227",1.5)}</svg>`,
  front:()=>`${LK_SVG}<g transform="translate(100 34)" class="xdf-f"><path d="M0 0C-20-8-46-6-62 4C-44 4-28 8-14 12C-8 14-4 12 0 8C4 12 8 14 14 12C28 8 44 4 62 4C46-6 20-8 0 0Z" fill="#8a6a3f" stroke="#e8dcc4" stroke-width="1"/><circle cx="0" cy="-2" r="5" fill="#e8dcc4"/><path d="M3-2L8 0L3 1Z" fill="#c9a227"/></g></svg>`,
  css:`.D .xdf-f{transform-box:fill-box;transform-origin:center;animation:xdf 2.4s ease-in-out infinite}@keyframes xdf{50%{transform:translateY(-4px) scaleX(1.06)}}`,...lxPL("#c9a227","#d6c4a066","#1f1806f2","#0d0a02f2")}),
 // 19) Aurora Ribbon — شريط الشفق
 X({id:"xAuroraRibbon",n:99,name:"Aurora Ribbon",ar:"شريط الشفق",pal:"green",frame:"circle",desc:"شريط شفق قطبي أخضر وبنفسجي يتموج حول الصورة",
  back:()=>`${LK_SVG}<defs><linearGradient id="xar" x1="0" x2="1"><stop offset="0" stop-color="#2ee59d"/><stop offset=".5" stop-color="#22d3ee"/><stop offset="1" stop-color="#b56bff"/></linearGradient></defs><path class="xar-r" d="M10 120C40 60 70 150 100 90S160 40 190 100" fill="none" stroke="url(#xar)" stroke-width="10" stroke-linecap="round" opacity=".75"/><path class="xar-r2" d="M10 140C40 90 70 170 100 120S160 70 190 130" fill="none" stroke="url(#xar)" stroke-width="5" stroke-linecap="round" opacity=".5"/></svg>`,
  front:()=>``,css:`.D .xar-r,.D .xar-r2{filter:blur(1px) drop-shadow(0 0 6px #22d3ee);animation:xar 4s ease-in-out infinite alternate}.D .xar-r2{animation-delay:-2s}@keyframes xar{to{transform:translateY(-10px)}}`,...lxPL("#2ee59d","#b56bff66","#04170ff2","#020a06f2")}),
 // 20) Sakura Wind — رياح الساكورا
 X({id:"xSakuraWind",n:100,name:"Sakura Wind",ar:"رياح الساكورا",pal:"pink",frame:"circle",desc:"غصن ساكورا مزهر بجانب الصورة وبتلات تطير مع الريح",
  back:()=>`${LK_SVG}<path d="M200 30C160 40 140 60 132 90C128 104 120 112 108 118" fill="none" stroke="#5b3a29" stroke-width="4" stroke-linecap="round"/>${[[170,40],[150,58],[136,82],[122,104]].map(([x,y])=>`<g transform="translate(${x} ${y})">${[0,72,144,216,288].map(a=>`<ellipse rx="3" ry="6" transform="rotate(${a}) translate(0 -5)" fill="#fbcfe8"/>`).join("")}<circle r="2" fill="#f472b6"/></g>`).join("")}</svg>`,
  front:()=>`${LK_SVG}${[20,60,100,140].map((y,i)=>`<ellipse cx="190" cy="${y}" rx="2.5" ry="4" fill="#f9a8d4" class="xsw-p" style="animation-delay:${-i*1}s"/>`).join("")}</svg>`,
  css:`.D .xsw-p{animation:xsw 4s linear infinite}@keyframes xsw{0%{transform:translate(0,0) rotate(0);opacity:0}10%{opacity:1}100%{transform:translate(-190px,40px) rotate(360deg);opacity:0}}`,...lxPL("#f9a8d4","#f472b666","#1f0614f2","#0e020af2")}),
 // 21) Gold Coins Rain — مطر العملات
 X({id:"xGoldRain",n:101,name:"Gold Coins Rain",ar:"مطر العملات",pal:"gold",frame:"gold",desc:"عملات ذهبية تتساقط وتلمع حول الصورة — مثالي للهدايا والدعم",
  back:()=>`${LK_SVG}${lxRing(64,"#f6c94a",2)}</svg>`,
  front:()=>`${LK_SVG}${[24,56,88,120,152,178].map((x,i)=>`<g class="xgr-c" style="animation-delay:${-i*.55}s"><ellipse cx="${x}" cy="0" rx="7" ry="7" fill="#f6c94a" stroke="#7a5200"/><text x="${x}" y="3" font-size="8" text-anchor="middle" fill="#7a5200" font-weight="900">$</text></g>`).join("")}</svg>`,
  css:`.D .xgr-c{animation:xgr 2.8s linear infinite}@keyframes xgr{0%{transform:translateY(-10px);opacity:0}10%{opacity:1}100%{transform:translateY(210px) rotateY(720deg);opacity:0}}`,...lxPL("#f6c94a","#ffb02066","#241805f2","#0f0a02f2")}),
 // 22) Hologram Grid — شبكة هولوغرام
 X({id:"xHoloGrid",n:102,name:"Hologram Grid",ar:"شبكة الهولوغرام",pal:"blue",frame:"neon",desc:"شبكة هولوغرام سماوية بخط مسح يمر عبر الصورة",
  back:()=>`${LK_SVG}<clipPath id="xhg"><circle cx="100" cy="100" r="82"/></clipPath><g clip-path="url(#xhg)" stroke="#22e1ff55" stroke-width=".8">${Array.from({length:11},(_,i)=>`<path d="M${18+i*16.4} 18V182M18 ${18+i*16.4}H182"/>`).join("")}<rect x="0" y="0" width="200" height="6" fill="#22e1ff88" class="xhg-s"/></g>${lxRing(82,"#22e1ff",1.5)}</svg>`,
  front:()=>``,css:`.D .xhg-s{animation:xhg 2.4s linear infinite}@keyframes xhg{from{transform:translateY(0)}to{transform:translateY(200px)}}`,...lxPL("#22e1ff","#22e1ff66","#031319f2","#01080bf2",.15)}),
 // 23) Black Gold — أسود وذهبي
 X({id:"xBlackGold",n:103,name:"Black Gold",ar:"الأسود الذهبي",pal:"gold",frame:"hex",desc:"إطار سداسي أسود بحواف ذهبية وزخارف زاوية فاخرة",
  back:()=>`${LK_SVG}<path d="${lkPoly(100,100,80,6,-90)}" fill="#0a0a0a" stroke="#d4a017" stroke-width="3"/><path d="${lkPoly(100,100,72,6,-90)}" fill="none" stroke="#f6c94a" stroke-width=".8" stroke-dasharray="1 3"/>${lxAround(6,80,(x,y)=>`<circle cx="${x}" cy="${y}" r="4" fill="#f6c94a"/>`,-90)}</svg>`,
  front:()=>``,...lxPL("#d4a017","#f6c94a44","#0a0a0af5","#000000f5",.15)}),
 // 24) Rainbow Prism — منشور قوس قزح
 X({id:"xRainbowPrism",n:104,name:"Rainbow Prism",ar:"منشور قوس قزح",pal:"white",frame:"crystal",desc:"منشور زجاجي يحلل الضوء لأشعة قوس قزح خلف الصورة",
  back:()=>`${LK_SVG}<g class="lk-spin" style="--sd:20s">${["#ff2d55","#ff9f1a","#facc15","#2ee59d","#3ba8ff","#b56bff"].map((c,i)=>`<path transform="rotate(${i*60} 100 100)" d="M100 100L92 10H108Z" fill="${c}" opacity=".55"/>`).join("")}</g><path d="${lkPoly(100,100,60,3)}" fill="#ffffff18" stroke="#fff" stroke-width="1.2"/></svg>`,
  front:()=>``,...lxPL("#ffffff","#b56bff55","#10131af2","#05070af2")}),
 // 25) Heart Burst — انفجار القلوب
 X({id:"xHeartBurst",n:105,name:"Heart Burst",ar:"انفجار القلوب",pal:"red",frame:"circle",desc:"قلوب حمراء ووردية تنطلق من الصورة مع كل لايك أو «أحبني»",
  back:()=>`${LK_SVG}${lxRing(64,"#ff5f8f",2)}</svg>`,
  front:()=>`${LK_SVG}${lxAround(10,60,(x,y,a,i)=>`<g class="xhb-h" style="--dx:${((x-100)*.6).toFixed(0)}px;--dy:${((y-100)*.6).toFixed(0)}px;animation-delay:${-(i*.22).toFixed(2)}s">${lxHeart(x,y,1.1,i%2?"#ff5f8f":"#ffb3dc")}</g>`)}</svg>`,
  css:`.D .xhb-h{animation:xhb 2.2s ease-out infinite}@keyframes xhb{0%{transform:translate(0,0) scale(.4);opacity:0}20%{opacity:1}100%{transform:translate(var(--dx),var(--dy)) scale(1.1);opacity:0}}`,...lxPL("#ff5f8f","#ff2d5566","#1c0508f2","#0e0203f2")}),
 // 26) Star Constellation — كوكبة النجوم
 X({id:"xConstellation",n:106,name:"Star Constellation",ar:"كوكبة النجوم",pal:"purple",frame:"stars",desc:"كوكبة نجوم متصلة بخطوط مضيئة ترسم نفسها حول الصورة",
  back:()=>{ const P=[[30,60],[56,30],[96,22],[140,34],[170,62],[178,110],[160,152]]; return `${LK_SVG}<path d="M${P.map(p=>p.join(" ")).join("L")}" fill="none" stroke="#e0b8ff" stroke-width="1" class="xcs-l"/>${P.map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="3" fill="#fff" class="lx-tw" style="animation-delay:${-i*.3}s"/>`).join("")}${lkStars(106,16)}</svg>` },
  front:()=>``,css:`.D .xcs-l{stroke-dasharray:340;animation:xcs 3s ease-out both}@keyframes xcs{from{stroke-dashoffset:340}}`,...lxPL("#b56bff","#e0b8ff66","#12061ff2","#06020ef2")}),
 // 27) Palm Oasis — واحة النخيل
 X({id:"xPalmOasis",n:107,name:"Palm Oasis",ar:"واحة النخيل",pal:"green",frame:"gold",desc:"نخلتان ذهبيتان على جانبي الصورة وشمس غروب خلفها",
  back:()=>`${LK_SVG}<circle cx="100" cy="100" r="78" fill="#f59e0b33"/>${[[34,1],[166,-1]].map(([x,s])=>`<g transform="translate(${x} 176) scale(${s*.62} .62)"><g class="xpo-p"><path d="M0 0C2-30 4-60 0-90" stroke="#a16207" stroke-width="5" fill="none"/>${[-60,-30,0,30,60].map(a=>`<path transform="translate(0 -90) rotate(${a})" d="M0 0C10-6 22-4 30 4C20 0 10 2 0 0Z" fill="#16a34a"/>`).join("")}</g></g>`).join("")}</svg>`,
  front:()=>``,css:`.D .xpo-p{transform-box:fill-box;transform-origin:50% 100%;animation:lk-swing 3s ease-in-out infinite}`,...lxPL("#c9a227","#16a34a66","#071a0ef2","#020a05f2")}),
 // 28) Pearl Shell — صدفة اللؤلؤ
 X({id:"xPearlShell",n:108,name:"Pearl Shell",ar:"صدفة اللؤلؤ",pal:"white",frame:"circle",desc:"صدفة بحرية وردية تنفتح خلف الصورة ولآلئ تحيط بها",
  back:()=>`${LK_SVG}<g class="xps-s"><path d="M100 170L20 90C30 40 70 18 100 18C130 18 170 40 180 90Z" fill="#fde2e4" stroke="#f9a8d4" stroke-width="1.5"/>${[-60,-36,-12,12,36,60].map(a=>`<path transform="rotate(${a} 100 170)" d="M100 170V26" stroke="#f9a8d4" stroke-width="1"/>`).join("")}</g>${lxAround(10,74,(x,y)=>`<circle cx="${x}" cy="${y}" r="4" fill="#fff" stroke="#e5e7eb"/>`,200,140)}</svg>`,
  front:()=>``,css:`.D .xps-s{transform-box:fill-box;transform-origin:50% 100%;animation:xps 1s cubic-bezier(.2,1.3,.3,1) both}@keyframes xps{from{transform:scaleY(.2)}}`,...lxPL("#f9a8d4","#fde2e466","#1f1418f2","#0e080af2")}),
 // 29) Comet Trail — ذيل المذنب
 X({id:"xCometTrail",n:109,name:"Comet Trail",ar:"ذيل المذنب",pal:"blue",frame:"stars",desc:"مذنب لامع يدور حول الصورة تاركاً ذيلاً من الضوء",
  back:()=>`${LK_SVG}${lkStars(109,18)}${lxRing(74,"#9fd3ff33",1)}<g class="lk-spin" style="--sd:3.2s"><path d="M100 26A74 74 0 0 1 164 64" fill="none" stroke="url(#xct)" stroke-width="4" stroke-linecap="round"/><circle cx="164" cy="64" r="5" fill="#fff"/></g><defs><linearGradient id="xct" x1="0" x2="1"><stop offset="0" stop-color="#3ba8ff00"/><stop offset="1" stop-color="#e0f2fe"/></linearGradient></defs></svg>`,
  front:()=>``,...lxPL("#9fd3ff","#3ba8ff66","#06111ff2","#02060ff2")}),
 // 30) B6O6 Legend — أسطورة B6O6
 X({id:"xB6o6Legend",n:110,name:"B6O6 Legend",ar:"أسطورة B6O6",pal:"blue",frame:"b6o6",desc:"هوية B6O6: حلقتان بالأزرق والوردي، تاج، برق وأجنحة — للأحداث الكبيرة",
  back:()=>`${LK_SVG}${lxWing(1,"#2f7bff","#7c5cff","xbl-w")}${lxWing(-1,"#2f7bff","#7c5cff","xbl-w")}<g class="lk-spin" style="--sd:10s">${lxRing(66,"#2f7bff",3,"","30 10")}</g><g class="lk-spinr" style="--sd:14s">${lxRing(72,"#ff2d6f",1.6,"","8 8")}</g></svg>`,
  front:()=>`${LK_SVG}${lxCrown(100,24,.9,"#fde68a","#2f7bff")}${lxSparks(6,88,"#e0f2fe",17)}</svg>`,
  css:`.D .xbl-w{transform-box:view-box;transform-origin:140px 100px;animation:xfp 2.6s ease-in-out infinite}`,...lxPL("#2f7bff","#ff2d6f66","#06111ff2","#02060ff2")}),
];
const LX_CSS=`.lx-tw{opacity:.2;animation:lk-tw calc(2.2s / var(--as,1)) ease-in-out infinite}@keyframes fl-flick{to{transform:scale(1.08,.88)}}@keyframes xfp{50%{transform:rotate(-6deg)}}`;
LX[0].css=(LX[0].css||"")+LX_CSS;
lkRegister(LX.map(d=>({...d,pro:true})));
export const LE_X_IDS=LX.map(d=>d.id);
LE_PLAN.excl=LE_X_IDS.slice();
