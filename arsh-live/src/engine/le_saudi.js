// ====== آخر التفاعلات — المجموعة السابعة: السعودية والهوية العربية (61–70) ======
import { LK_SVG, lkP, lkSpark, lkStar8, lkPoly, lkStars, lkSeed, lkDef, lkRegister } from "./le_kit.js";

const SA_PALM=(x,y,s,fl)=>`<g transform="translate(${x} ${y}) scale(${fl?-s:s} ${s})"><path d="M0 0C2-20 1-40-2-62" stroke="#8a5a2b" stroke-width="5" fill="none" stroke-linecap="round"/>${[-150,-120,-90,-60,-30,-170,-10].map((a,i)=>{ const [ex,ey]=lkP(-2,-62,a,26), [cx,cy]=lkP(-2,-62,a-12,16); return `<path d="M-2 -62Q${cx} ${cy-6} ${ex} ${ey}Q${cx} ${cy} -2 -60Z" class="sp-l" style="animation-delay:${(i*.15).toFixed(2)}s"/>` }).join("")}<circle cx="-4" cy="-58" r="3" fill="#b8741a"/><circle cx="1" cy="-57" r="3" fill="#a3651a"/></g>`;

const saudiPalm=lkDef({id:"saudiPalm",n:61,cat:"saudi",name:"Saudi Palm",ar:"النخلة السعودية",pal:"green",frame:"gold",
 desc:"نخلتان على جانبي الصورة بسعف أخضر يتمايل وعذوق تمر ذهبية",
 back:()=>`${LK_SVG}${SA_PALM(30,190,1,false)}${SA_PALM(170,190,1,true)}</svg>`,
 css:`.D .sp-l{fill:#1fa463;stroke:#7dffc4;stroke-width:.4;transform-box:fill-box;transform-origin:0% 100%;animation:lk-swing calc(3.4s / var(--as,1)) ease-in-out infinite}`,plateCss:["#11c47a","#f6c94a55","#04170ff0","#020c07f0"]});

const najdiCrown=lkDef({id:"najdiCrown",n:62,cat:"saudi",name:"Najdi Crown",ar:"التاج النجدي",pal:"gold",frame:"gold",
 desc:"شُرفات نجدية مثلثة على قوس فوق الصورة بلون الطين الذهبي ونقوش مثلثات",
 back:()=>`${LK_SVG}${Array.from({length:9},(_,i)=>{ const a=-160+i*17.5, [x,y]=lkP(100,100,a,70); return `<path transform="translate(${x} ${y}) rotate(${a+90})" d="M-8 6L-8 -4L0 -14L8 -4L8 6Z" class="nc-s" style="animation-delay:${(i*.08).toFixed(2)}s"/><path transform="translate(${x} ${y}) rotate(${a+90})" d="M-3 2L0 -4L3 2Z" fill="#5a3410"/>` }).join("")}<path d="M${lkP(100,100,-165,62).join(" ")}A62 62 0 0 1 ${lkP(100,100,-15,62).join(" ")}" class="nc-b"/></svg>`,
 css:`.D .nc-s{fill:#d9a55a;stroke:#ffe0a3;stroke-width:.8}.D .nc-b{fill:none;stroke:#b8741a;stroke-width:4}.D .le-enter .nc-s{transform-box:fill-box;transform-origin:50% 100%;animation:nc-up calc(var(--d)*.7) cubic-bezier(.3,1.4,.4,1) both}@keyframes nc-up{from{transform:scaleY(0)}}`,plateCss:["#d9a55a","#f6c94a55","#24170af0","#120b04f0"]});

const goldenDallah=lkDef({id:"goldenDallah",n:63,cat:"saudi",name:"Golden Dallah",ar:"الدلّة الذهبية",pal:"gold",frame:"gold",
 desc:"دلّة قهوة ذهبية بجانب الصورة يتصاعد منها بخار وفنجانان صغيران",
 back:()=>`${LK_SVG}<g transform="translate(160 150)"><path d="M-12 20H12L9 4C14-4 12-14 6-18L8-26H-8L-6-18C-12-14-14-4-9 4Z" fill="url(#gdg)" stroke="#fff3c4" stroke-width="1"/><path d="M-9 0Q-24 -6 -30 -22L-26 -24Q-20 -12 -9 -8" fill="#f6c94a"/><path d="M9 -10Q20 -10 18 6" fill="none" stroke="#f6c94a" stroke-width="3"/><path d="M-4 -26L0 -34L4 -26Z" fill="#ffe08a"/>${[0,1,2].map(i=>`<path d="M${-30+i*4} -30q-4 -8 0 -16q4 -8 0 -16" class="gd-st" style="animation-delay:${i*.6}s"/>`).join("")}</g>${[[30,168],[50,174]].map(([x,y])=>`<path d="M${x-7} ${y-6}H${x+7}L${x+4} ${y+4}H${x-4}Z" fill="#f6c94a" stroke="#fff3c4" stroke-width=".6"/>`).join("")}<defs><linearGradient id="gdg" x1="0" x2="1"><stop offset="0" stop-color="#b8860b"/><stop offset=".5" stop-color="#ffe08a"/><stop offset="1" stop-color="#b8860b"/></linearGradient></defs></svg>`,
 css:`.D .gd-st{fill:none;stroke:#fff;stroke-width:1.4;stroke-linecap:round;opacity:0;animation:lk-rise calc(2.6s / var(--as,1)) ease-out infinite}`,plateCss:["#f6c94a","#ffb02055","#1f1506f0","#0f0a02f0"]});

const desertFalcon=lkDef({id:"desertFalcon",n:64,cat:"saudi",name:"Desert Falcon",ar:"صقر الصحراء",pal:"silver",frame:"gold",
 desc:"جناحا صقر مفرودان خلف الصورة بريش متدرج يرفرف بقوة",
 back:()=>{ const w=Array.from({length:8},(_,i)=>`<path d="M86 96Q${60-i*4} ${70+i*6} ${20+i*2} ${46+i*13}Q${44-i} ${60+i*13} 86 ${104+i*2}Z" class="df-f" style="opacity:${(1-i*.06).toFixed(2)}"/>`).join(""); return `${LK_SVG}<g class="df-w">${w}</g><g transform="translate(200 0) scale(-1 1)"><g class="df-w">${w}</g></g></svg>` },
 css:`.D .df-f{fill:#cbb48f;stroke:#5a4630;stroke-width:.7}.D .df-f:nth-child(2n){fill:#e8dcc4}.D .df-w{transform-box:view-box;transform-origin:86px 100px;animation:df-fl calc(2.2s / var(--as,1)) ease-in-out infinite}@keyframes df-fl{50%{transform:rotate(-10deg) scaleY(.94)}}`,plateCss:["#d6c4a0","#f6c94a44","#1a140cf0","#0d0a06f0"]});

const arabianMoon=lkDef({id:"arabianMoon",n:65,cat:"saudi",name:"Arabian Moon",ar:"القمر العربي",pal:"purple",frame:"stars",
 desc:"هلال ذهبي ونجوم تتلألأ وفانوس عربي معلّق يتأرجح",
 back:()=>`${LK_SVG}${lkStars(65,18)}<path d="M150 22A26 26 0 1 0 176 58A20 20 0 1 1 150 22Z" fill="#ffe08a"/></svg>`,
 front:()=>`${LK_SVG}<g class="am-l"><path d="M34 0V22" stroke="#d8a520" stroke-width="1"/><path d="M28 22H40L44 30L40 46H28L24 30Z" fill="#f6c94a55" stroke="#f6c94a" stroke-width="1.2"/><path d="M34 22V46M24 30H44" stroke="#f6c94a" stroke-width=".7"/><circle cx="34" cy="34" r="4" fill="#ffd27a" class="am-g"/><path d="M30 46L34 52L38 46" fill="#f6c94a"/></g></svg>`,
 css:`.D .am-l{transform-box:view-box;transform-origin:34px 0;animation:lk-swing calc(3s / var(--as,1)) ease-in-out infinite}.D .am-g{animation:lk-pulse 1.4s ease-in-out infinite}`,plateCss:["#b56bff","#f6c94a55","#140824f0","#090412f0"]});

const diriyahGate=lkDef({id:"diriyahGate",n:66,cat:"saudi",name:"Diriyah Gate",ar:"بوابة الدرعية",pal:"gold",frame:"gold",
 desc:"بوابة طينية بطابع الدرعية تؤطر الصورة مع نوافذ مثلثة وشُرفات",
 back:()=>`${LK_SVG}<path d="M14 196V40H44V30H156V40H186V196H150V100A50 50 0 0 0 50 100V196Z" class="dg-w"/>${[[24,60],[24,110],[24,150],[170,60],[170,110],[170,150]].map(([x,y])=>`<path d="M${x} ${y+8}L${x+3} ${y}L${x+6} ${y+8}Z" fill="#5a3410"/>`).join("")}${Array.from({length:10},(_,i)=>`<path d="M${30+i*15} 30L${36+i*15} 20L${42+i*15} 30Z" fill="#c48a4a"/>`).join("")}</svg>`,
 css:`.D .dg-w{fill:#b07a40;stroke:#e6b97a;stroke-width:1.4}.D .le-enter .dg-w{animation:lk-pop calc(var(--d)*.8) ease both;transform-box:view-box;transform-origin:100px 196px}`,plateCss:["#c48a4a","#f6c94a44","#22160af0","#110b05f0",.2]});

const desertStars=lkDef({id:"desertStars",n:67,cat:"saudi",name:"Desert Stars",ar:"نجوم الصحراء",pal:"blue",frame:"stars",
 desc:"كثبان رملية متدرجة أسفل الصورة تحت سماء ليل مليئة بالنجوم وشهاب يعبر",
 back:()=>`${LK_SVG}${lkStars(67,26)}<path d="M0 170Q40 146 90 164T200 156V200H0Z" fill="#c48a4a"/><path d="M0 184Q60 166 120 182T200 176V200H0Z" fill="#8a5a2b"/><path d="M20 30L60 50" class="ds-m"/></svg>`,
 css:`.D .ds-m{stroke:#fff;stroke-width:1.6;stroke-linecap:round;stroke-dasharray:14 200;animation:ds-sh calc(4s / var(--as,1)) linear infinite}@keyframes ds-sh{0%{stroke-dashoffset:14}40%,100%{stroke-dashoffset:-60}}`,plateCss:["#3ba8ff","#c48a4a55","#07101ef0","#03080ff0"]});

const saudiEmerald=lkDef({id:"saudiEmerald",n:68,cat:"saudi",name:"Saudi Emerald",ar:"الزمرد السعودي",pal:"green",frame:"gold",
 desc:"نجمة ثمانية عربية بلون الزمرد تدور ببطء ونقوش هندسية ذهبية",
 back:()=>`${LK_SVG}<g class="lk-spin" style="--sd:50s"><path d="${lkStar8(100,100,92,74)}" class="se-a"/><path d="${lkStar8(100,100,82,68)}" class="se-b"/></g><g class="lk-spinr" style="--sd:70s">${Array.from({length:8},(_,i)=>{ const [x,y]=lkP(100,100,i*45+22.5,86); return `<path d="${lkStar8(x,y,6,3.4)}" fill="#f6c94a"/>` }).join("")}</g></svg>`,
 css:`.D .se-a{fill:#0b6b44cc;stroke:#f6c94a;stroke-width:1.5}.D .se-b{fill:none;stroke:#7dffc4;stroke-width:.8}`,plateCss:["#11c47a","#f6c94a66","#03170ef0","#010c07f0"]});

const arabianHorse=lkDef({id:"arabianHorse",n:69,cat:"saudi",name:"Arabian Horse",ar:"الخيل العربية",pal:"silver",frame:"gold",
 desc:"رأسا خيل عربية أصيلة متقابلان بعُرف يتطاير مع الريح",
 back:()=>{ const H=`<path d="M0 0C-4-14 2-30 14-40L12-48L20-42C30-44 40-36 44-24L50-10C52-6 48-2 44-4L34-10C30-6 28 2 30 16Z" class="ah-h"/><circle cx="30" cy="-30" r="1.8" fill="#111"/>${[0,1,2,3].map(i=>`<path d="M${12-i*3} ${-38+i*9}q-12 -2 -20 4" class="ah-m" style="animation-delay:${i*.15}s"/>`).join("")}`; return `${LK_SVG}<g transform="translate(22 170) scale(1.2)">${H}</g><g transform="translate(178 170) scale(-1.2 1.2)">${H}</g></svg>` },
 css:`.D .ah-h{fill:#e9e4dc;stroke:#6b5a48;stroke-width:1}.D .ah-m{fill:none;stroke:#3a2a1a;stroke-width:2.6;stroke-linecap:round;transform-box:fill-box;transform-origin:100% 50%;animation:ah-w calc(1.2s / var(--as,1)) ease-in-out infinite}@keyframes ah-w{50%{transform:rotate(-8deg) scaleX(1.1)}}`,plateCss:["#e9e4dc","#f6c94a44","#16120ef0","#0b0907f0"]});

const saudiLegendary=lkDef({id:"saudiLegendary",n:70,cat:"saudi",name:"Saudi Legendary",ar:"الأسطورة السعودية",pal:"gold",frame:"gold",
 desc:"أشعة ذهبية دوّارة ونجمة ثمانية كبيرة وسعف نخيل يتوّج الصورة — أعلى فخامة في المجموعة",
 back:()=>`${LK_SVG}<g class="lk-spin" style="--sd:30s">${Array.from({length:24},(_,i)=>`<path d="M100 100L${lkP(100,100,i*15-2,98).join(" ")}L${lkP(100,100,i*15+2,98).join(" ")}Z" fill="#f6c94a" opacity="${i%2?.18:.32}"/>`).join("")}</g><path d="${lkStar8(100,100,76,62)}" fill="none" stroke="#ffe08a" stroke-width="2"/></svg>`,
 front:()=>`${LK_SVG}${[-1,1].map(s=>Array.from({length:5},(_,i)=>{ const a=-90+s*(10+i*14), [x,y]=lkP(100,100,a,70); return `<ellipse cx="${x}" cy="${y}" rx="9" ry="3" transform="rotate(${a+s*50} ${x} ${y})" fill="#1fa463" stroke="#f6c94a" stroke-width=".6"/>` }).join("")).join("")}<path d="${lkStar8(100,24,9,5)}" fill="#ffe08a" class="sl-s"/></svg>`,
 css:`.D .sl-s{transform-box:fill-box;transform-origin:center;animation:lk-spin calc(6s / var(--as,1)) linear infinite}`,plateCss:["#f6c94a","#ffb02077","#231806f0","#110c02f0"]});

lkRegister([saudiPalm,najdiCrown,goldenDallah,desertFalcon,arabianMoon,diriyahGate,desertStars,saudiEmerald,arabianHorse,saudiLegendary]);
