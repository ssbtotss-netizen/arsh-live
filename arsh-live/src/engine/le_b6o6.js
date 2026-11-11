// ====== آخر التفاعلات — المجموعة الثامنة: B6O6 الحصرية (71–80) — بطّة B6O6 بنظارة وقبعة ======
import { LK_SVG, lkP, lkSpark, lkGem, lkStar8, lkPoly, lkStars, lkSeed, lkDef, lkRegister } from "./le_kit.js";

/** رأس البطة (هوية B6O6): رأس أبيض، منقار برتقالي، نظارة سوداء، قبعة. o.cap=لون القبعة، o.hat=زخرفة فوق القبعة */
const DUCK=(x,y,s,o={})=>`<g transform="translate(${x} ${y}) scale(${s})" class="dk ${o.cls||""}">
 <ellipse cx="0" cy="4" rx="17" ry="16" fill="${o.body||"#ffffff"}" stroke="${o.line||"#cfd6e0"}" stroke-width="1"/>
 <path d="M10 6C20 4 28 7 28 10C28 13 20 15 10 13Z" fill="${o.beak||"#ff9f1a"}" stroke="#d97706" stroke-width=".8"/><path d="M12 10H26" stroke="#d97706" stroke-width=".6"/>
 <path d="M-8 -2H16C16 4 12 5 8 5C5 5 4 2 4 1H0C0 2-1 5-4 5C-8 5-9 2-8-2Z" fill="${o.shades||"#0b0d14"}"/><path d="M8 0L12 0" stroke="#fff" stroke-width=".8" opacity=".7"/>
 <path d="M-16 -6C-16 -18 16 -20 18 -8L24 -6C24 -3 -16 -2 -16 -6Z" fill="${o.cap||"#111827"}"/><path d="M-6 -16L4 -17" stroke="#ffffff22" stroke-width="2"/>${o.hat||""}</g>`;
const DK_CROWN=c=>`<path d="M-8 -17L-6 -26L-2 -20L1 -28L4 -20L8 -26L10 -17Z" fill="${c}" stroke="#fff3c4" stroke-width=".6"/>`;
const PL=(id,c1,c2,b1,b2)=>({plateCss:[c1,c2,b1,b2,.5]});

const duckRoyal=lkDef({id:"duckRoyal",n:71,cat:"b6o6",name:"B6O6 Royal Duck",ar:"البطة الملكية",pal:"gold",frame:"b6o6",
 desc:"بطة B6O6 بتاج ذهبي فوق قبعتها تطل من أعلى الصورة مع عباءة ذهبية من النجوم",
 back:()=>`${LK_SVG}${[200,230,260,290,320,350].map((a,i)=>{ const [x,y]=lkP(100,100,a,72); return `<path d="${lkSpark(x,y,4)}" class="dr-s" style="animation-delay:${i*.25}s"/>` }).join("")}</svg>`,
 front:()=>`${LK_SVG}${DUCK(150,40,1.25,{hat:DK_CROWN("#f6c94a"),cls:"lk-bob"})}</svg>`,
 css:`.D .dr-s{fill:#ffe08a;animation:lk-tw 1.8s ease-in-out infinite}`,...PL(0,"#f6c94a","#ffb02066","#1f1506f0","#0f0a02f0")});

const duckNeon=lkDef({id:"duckNeon",n:72,cat:"b6o6",name:"B6O6 Neon Duck",ar:"البطة النيون",pal:"pink",frame:"b6o6",
 desc:"بطة B6O6 بخطوط نيون وردية وزرقاء وحلقة نيون متقطعة تدور",
 back:()=>`${LK_SVG}<circle cx="100" cy="100" r="68" class="dn-r"/><circle cx="100" cy="100" r="74" class="dn-r2"/></svg>`,
 front:()=>`${LK_SVG}${DUCK(150,40,1.25,{body:"#1a0b24",line:"#ff2d95",beak:"#22e1ff",shades:"#ff2d95",cap:"#22e1ff",cls:"lk-bob"})}</svg>`,
 css:`.D .dn-r{fill:none;stroke:#ff2d95;stroke-width:2.5;stroke-dasharray:16 8;animation:lk-dash calc(2s / var(--as,1)) linear infinite}.D .dn-r2{fill:none;stroke:#22e1ff;stroke-width:1;opacity:.7}`,...PL(0,"#ff2d95","#22e1ff66","#1f0614f0","#0e020af0")});

const duckDiamond=lkDef({id:"duckDiamond",n:73,cat:"b6o6",name:"B6O6 Diamond Duck",ar:"البطة الماسية",pal:"blue",frame:"b6o6",
 desc:"بطة B6O6 بنظارة ألماسية لامعة وألماسات تحيط بالصورة",
 back:()=>`${LK_SVG}${[190,215,245,295,325,350].map((a,i)=>{ const [x,y]=lkP(100,100,a,70); return `<g class="lk-bob" style="animation-delay:${-i*.4}s">${lkGem(x,y,6,"#9fe3ff","#2b7bd8")}</g>` }).join("")}</svg>`,
 front:()=>`${LK_SVG}${DUCK(150,40,1.25,{shades:"#3ba8ff",cap:"#0a2a50",hat:lkGem(1,-22,5,"#e9fbff","#7cc4ff")})}</svg>`,
 ...PL(0,"#9fe3ff","#3ba8ff66","#06122af0","#020814f0")});

const duckFire=lkDef({id:"duckFire",n:74,cat:"b6o6",name:"B6O6 Fire Duck",ar:"البطة النارية",pal:"red",frame:"b6o6",
 desc:"بطة B6O6 بقبعة مشتعلة ولهب يحيط بأسفل الصورة",
 back:()=>`${LK_SVG}${Array.from({length:9},(_,i)=>{ const a=30+i*15, [x,y]=lkP(100,100,a,64); return `<path transform="translate(${x} ${y}) rotate(${a-90+180})" d="M0 0C-6-3-8-11-3-18C-2-12 0-11 1-14C3-19 1-23 3-27C8-20 10-10 5-3Z" class="dfi-f" style="animation-delay:${(i*.09).toFixed(2)}s"/>` }).join("")}</svg>`,
 front:()=>`${LK_SVG}${DUCK(150,40,1.25,{cap:"#7a1206",hat:`<path d="M-4 -18C-8-24-4-30 0-34C0-28 6-26 4-18Z" fill="#ff7a00" class="dfi-h"/>`,cls:"lk-bob"})}</svg>`,
 css:`.D .dfi-f{fill:#ff5a1f;stroke:#ffd000;stroke-width:.6;transform-box:fill-box;transform-origin:50% 100%;animation:fl-flick .5s ease-in-out infinite alternate}.D .dfi-h{transform-box:fill-box;transform-origin:50% 100%;animation:fl-flick .4s ease-in-out infinite alternate}`,...PL(0,"#ff5a1f","#ff2d0066","#2a0804f0","#120302f0")});

const duckGalaxy=lkDef({id:"duckGalaxy",n:75,cat:"b6o6",name:"B6O6 Galaxy Duck",ar:"بطة المجرة",pal:"purple",frame:"b6o6",
 desc:"بطة B6O6 رائدة فضاء بخوذة شفافة وكواكب صغيرة تدور حول الصورة",
 back:()=>`${LK_SVG}${lkStars(75,22)}<ellipse cx="100" cy="100" rx="84" ry="24" transform="rotate(-20 100 100)" fill="none" stroke="#b56bff" stroke-width="1" opacity=".6"/></svg>`,
 front:()=>`${LK_SVG}<g transform="rotate(-20 100 100)"><g><animateMotion dur="8s" repeatCount="indefinite" path="M16 100a84 24 0 1 0 168 0a84 24 0 1 0 -168 0"/><circle r="5" fill="#ffb347"/><ellipse rx="9" ry="2.4" fill="none" stroke="#ffe08a" stroke-width="1"/></g></g>${DUCK(150,40,1.25,{hat:`<circle cx="2" cy="-2" r="24" fill="#b56bff18" stroke="#e0b8ff" stroke-width="1.2"/>`,cls:"lk-bob"})}</svg>`,
 ...PL(0,"#b56bff","#8b3dff66","#140624f0","#080312f0")});

const duckButterfly=lkDef({id:"duckButterfly",n:76,cat:"b6o6",name:"B6O6 Butterfly Duck",ar:"بطة الفراشات",pal:"pink",frame:"butterfly",
 desc:"بطة B6O6 تحمل فراشة على قبعتها وفراشات ملونة ترفرف حول الصورة",
 back:()=>{ const bf=(x,y,c,d)=>`<g transform="translate(${x} ${y})"><g class="db-w" style="animation-delay:${d}s"><path d="M0 0C-10-14-20-8-14 2C-20 10-8 14 0 2C8 14 20 10 14 2C20-8 10-14 0 0Z" fill="${c}" stroke="#fff" stroke-width=".7"/></g></g>`; return `${LK_SVG}${bf(30,60,"#ff9ad0",0)}${bf(36,150,"#b56bff",-.3)}${bf(172,140,"#7cc4ff",-.6)}</svg>` },
 front:()=>`${LK_SVG}${DUCK(150,40,1.25,{cap:"#a3115f",hat:`<g transform="translate(2 -22) scale(.5)"><g class="db-w"><path d="M0 0C-10-14-20-8-14 2C-20 10-8 14 0 2C8 14 20 10 14 2C20-8 10-14 0 0Z" fill="#ffe14d"/></g></g>`})}</svg>`,
 css:`.D .db-w{transform-box:fill-box;transform-origin:center;animation:lk-flap calc(.9s / var(--as,1)) ease-in-out infinite}`,...PL(0,"#ff5fb8","#ff2d9566","#2a0718f0","#14030cf0")});

const duckCyber=lkDef({id:"duckCyber",n:77,cat:"b6o6",name:"B6O6 Cyber Duck",ar:"البطة السايبر",pal:"green",frame:"b6o6",
 desc:"بطة B6O6 بنظارة رقمية خضراء وشبكة سايبر وخطوط بيانات تدور",
 back:()=>`${LK_SVG}<path d="${lkPoly(100,100,74,8,22.5)}" class="dc-f"/>${[0,1,2,3].map(i=>`<path d="M${lkP(100,100,i*90+10,80).join(" ")}A80 80 0 0 1 ${lkP(100,100,i*90+50,80).join(" ")}" class="dc-d"/>`).join("")}</svg>`,
 front:()=>`${LK_SVG}${DUCK(150,40,1.25,{shades:"#2ee59d",cap:"#062012",hat:`<rect x="-14" y="-4" width="30" height="1.2" fill="#7dffc4" class="dc-sc"/>`,cls:"lk-bob"})}</svg>`,
 css:`.D .dc-f{fill:none;stroke:#2ee59d88;stroke-width:1.4}.D .dc-d{fill:none;stroke:#7dffc4;stroke-width:3;stroke-linecap:round;stroke-dasharray:6 6;animation:lk-dash calc(1.6s / var(--as,1)) linear infinite}.D .dc-sc{animation:lk-pulse .8s steps(2) infinite}`,...PL(0,"#2ee59d","#11c47a66","#03170cf0","#010c06f0")});

const duckSaudi=lkDef({id:"duckSaudi",n:78,cat:"b6o6",name:"B6O6 Saudi Duck",ar:"البطة السعودية",pal:"green",frame:"b6o6",
 desc:"بطة B6O6 بشماغ أحمر وعقال أسود ونجوم ثمانية خضراء حول الصورة",
 back:()=>`${LK_SVG}${Array.from({length:8},(_,i)=>{ const [x,y]=lkP(100,100,i*45,72); return `<path d="${lkStar8(x,y,7,4)}" class="ds8" style="animation-delay:${i*.2}s"/>` }).join("")}</svg>`,
 front:()=>`${LK_SVG}${DUCK(150,40,1.25,{cap:"url(#shm)",hat:`<path d="M-17 -6C-22 6-20 18-14 22L-10 4Z" fill="url(#shm)"/><ellipse cx="1" cy="-9" rx="17" ry="3" fill="none" stroke="#111" stroke-width="2.4"/><defs><pattern id="shm" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#fff"/><path d="M0 0L5 5M5 0L0 5" stroke="#d81f2a" stroke-width="1.2"/></pattern></defs>`,cls:"lk-bob"})}</svg>`,
 css:`.D .ds8{fill:#11c47a;stroke:#f6c94a;stroke-width:.6;animation:lk-pulse 2.4s ease-in-out infinite}`,...PL(0,"#11c47a","#f6c94a55","#04170ff0","#020c07f0")});

const duckCrystal=lkDef({id:"duckCrystal",n:79,cat:"b6o6",name:"B6O6 Crystal Duck",ar:"البطة الكريستالية",pal:"silver",frame:"crystal",
 desc:"بطة B6O6 جليدية شفافة ببلورات ثلجية وتاج كريستالي",
 back:()=>`${LK_SVG}${Array.from({length:10},(_,i)=>{ const a=i*36, [x,y]=lkP(100,100,a,70); return `<path transform="translate(${x} ${y}) rotate(${a+90})" d="M0 -10L4 0L0 10L-4 0Z" class="dcr" style="animation-delay:${(i*.2).toFixed(1)}s"/>` }).join("")}</svg>`,
 front:()=>`${LK_SVG}${DUCK(150,40,1.25,{body:"#e9f7ff",line:"#9fe3ff",shades:"#7cc4ff",cap:"#cfefff",hat:DK_CROWN("#bfeaff"),cls:"lk-bob"})}</svg>`,
 css:`.D .dcr{fill:#cfefffcc;stroke:#fff;stroke-width:.6;animation:lk-pulse 2.6s ease-in-out infinite}`,...PL(0,"#cfefff","#9fe3ff66","#0e141cf0","#070a10f0")});

const duckUltimate=lkDef({id:"duckUltimate",n:80,cat:"b6o6",name:"B6O6 Ultimate Duck",ar:"البطة الأسطورية",pal:"gold",frame:"b6o6",
 desc:"البطة الأسطورية: أجنحة ذهبية، تاج، هالة أشعة دوّارة وشارة B6O6 — التصميم الأعلى في المكتبة",
 back:()=>{ const w=Array.from({length:6},(_,i)=>`<path d="M84 96Q${58-i*5} ${74+i*6} ${22+i*3} ${52+i*13}Q${46-i} ${64+i*13} 84 ${104+i*2}Z" fill="${i%2?"#ffe08a":"#f6c94a"}" stroke="#b8860b" stroke-width=".6"/>`).join(""); return `${LK_SVG}<g class="lk-spin" style="--sd:26s">${Array.from({length:16},(_,i)=>`<path d="M100 100L${lkP(100,100,i*22.5-3,96).join(" ")}L${lkP(100,100,i*22.5+3,96).join(" ")}Z" fill="#f6c94a" opacity=".22"/>`).join("")}</g><g class="du-w">${w}</g><g transform="translate(200 0) scale(-1 1)"><g class="du-w">${w}</g></g></svg>` },
 front:()=>`${LK_SVG}${DUCK(150,40,1.3,{hat:DK_CROWN("#f6c94a")+lkGem(1,-30,3,"#ff1f3d","#8a0016"),cls:"lk-bob"})}<g transform="translate(100 186)"><rect x="-26" y="-8" width="52" height="16" rx="8" fill="#0b0d14" stroke="#f6c94a" stroke-width="1.4"/><text y="4" text-anchor="middle" font-size="10" font-weight="900" fill="#ffe08a" font-family="Orbitron,sans-serif">B6O6</text></g></svg>`,
 css:`.D .du-w{transform-box:view-box;transform-origin:84px 100px;animation:du-fl calc(2.6s / var(--as,1)) ease-in-out infinite}@keyframes du-fl{50%{transform:rotate(-10deg) scaleY(.94)}}`,...PL(0,"#f6c94a","#ffb02088","#231806f0","#110c02f0")});

lkRegister([duckRoyal,duckNeon,duckDiamond,duckFire,duckGalaxy,duckButterfly,duckCyber,duckSaudi,duckCrystal,duckUltimate]);
