// ====== آخر التفاعلات — المجموعة الخامسة: الكريستال والألماس (42–50) ======
import { LK_SVG, lkP, lkGem, lkSpark, lkPoly, lkStars, lkSeed, lkDef, lkRegister } from "./le_kit.js";


const crystalHalo=lkDef({id:"crystalHalo",n:42,cat:"crystal",name:"Crystal Halo",ar:"هالة الكريستال",pal:"blue",frame:"crystal",
 desc:"حلقة من 16 بلورة معينية تدور ببطء حول الصورة مع لمعات متتابعة",
 back:()=>`${LK_SVG}<g class="lk-spin" style="--sd:40s">${Array.from({length:16},(_,i)=>{ const [x,y]=lkP(100,100,i*22.5,70); return `<path transform="translate(${x} ${y}) rotate(${i*22.5+90})" d="M0 -9L4 0L0 9L-4 0Z" class="ch-c" style="animation-delay:${(i*.18).toFixed(2)}s"/>` }).join("")}</g></svg>`,
 css:`.D .ch-c{fill:#bfeaff;stroke:#fff;stroke-width:.6;animation:lk-pulse calc(2.9s / var(--as,1)) ease-in-out infinite}`,plateCss:["#9fe3ff","#3ba8ff66","#0a1a2cf0","#040b16f0"]});

const rubyQueen=lkDef({id:"rubyQueen",n:43,cat:"crystal",name:"Ruby Queen",ar:"ملكة الياقوت",pal:"red",frame:"crystal",
 desc:"تاج رفيع مرصّع بياقوتة كبيرة فوق الصورة وخمس ياقوتات تنبض حولها",
 back:()=>`${LK_SVG}${[200,240,300,340,140].map((a,i)=>{ const [x,y]=lkP(100,100,a,66); return lkGem(x,y,7,"#e0112b","#7a0012","lk-bob") }).join("")}</svg>`,
 front:()=>`${LK_SVG}<path d="M66 40L72 22L84 34L100 14L116 34L128 22L134 40Z" fill="#f6c94a" stroke="#fff3c4" stroke-width="1"/><path d="M66 40H134" stroke="#b8860b" stroke-width="2"/>${lkGem(100,26,7,"#ff1f3d","#8a0016")}${[[78,32],[122,32]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.6" fill="#ff5a6e"/>`).join("")}<path d="${lkSpark(112,16,4)}" class="rq-sp"/></svg>`,
 css:`.D .rq-sp{fill:#fff;animation:lk-tw 1.8s ease-in-out infinite}.D .lk-bob:nth-child(2n){animation-delay:-1.2s}`,plateCss:["#ff3b4e","#ff1f3d66","#2a0509f0","#140204f0"]});

const sapphireOrbit=lkDef({id:"sapphireOrbit",n:44,cat:"crystal",name:"Sapphire Orbit",ar:"مدار الياقوت الأزرق",pal:"blue",frame:"crystal",
 desc:"ثلاث ياقوتات زرقاء تدور في مدار مائل حول الصورة بسرعات مختلفة",
 back:()=>`${LK_SVG}<ellipse cx="100" cy="100" rx="80" ry="30" transform="rotate(-18 100 100)" class="so-o"/></svg>`,
 front:()=>`${LK_SVG}<g transform="rotate(-18 100 100)">${[0,1,2].map(i=>`<g><animateMotion dur="${7+i*2}s" begin="-${i*2.4}s" repeatCount="indefinite" path="M20 100a80 30 0 1 0 160 0a80 30 0 1 0 -160 0" rotate="0"/>${lkGem(0,0,6-i,"#1e5bff","#0a2a80")}</g>`).join("")}</g></svg>`,
 css:`.D .so-o{fill:none;stroke:#7cc4ff;stroke-width:1.2;stroke-dasharray:3 5;opacity:.7}`,plateCss:["#3b82f6","#1e5bff66","#06122af0","#020814f0"]});

const emeraldCrystal=lkDef({id:"emeraldCrystal",n:45,cat:"crystal",name:"Emerald Crystal",ar:"كريستال الزمرد",pal:"green",frame:"crystal",
 desc:"عنقود بلورات زمردية ينمو من أسفل الصورة كأنه منجم كريستال",
 back:()=>`${LK_SVG}${[[-46,26,-28],[-30,40,-14],[-12,50,-4],[8,46,6],[26,38,16],[44,24,30]].map(([dx,h,r],i)=>`<g transform="translate(${100+dx} 168) rotate(${r})"><path d="M-7 0V-${h}L0 -${h+10}L7 -${h}V0Z" class="ec-c" style="animation-delay:${(i*.12).toFixed(2)}s"/><path d="M0 0V-${h+10}L7 -${h}V0Z" fill="#053d22" opacity=".45"/></g>`).join("")}</svg>`,
 css:`.D .ec-c{fill:#19c47a;stroke:#b6ffd9;stroke-width:.8;transform-box:fill-box;transform-origin:50% 100%;animation:lk-pulse calc(3s / var(--as,1)) ease-in-out infinite}.D .le-enter .ec-c{animation:ec-grow calc(var(--d)*.9) cubic-bezier(.2,1.2,.3,1) both}@keyframes ec-grow{from{transform:scaleY(0)}}`,plateCss:["#2ee59d","#11c47a66","#03190ff0","#010d07f0"]});

const prismLight=lkDef({id:"prismLight",n:46,cat:"crystal",name:"Prism Light",ar:"منشور الضوء",pal:"white",frame:"crystal",
 desc:"منشور زجاجي فوق الصورة يفرّق الضوء إلى ألوان الطيف خلفها",
 back:()=>`${LK_SVG}<g class="lk-spin" style="--sd:60s">${["#ff3b4e","#ff9f1a","#ffe14d","#2ee59d","#3ba8ff","#b56bff"].map((c,i)=>`<path d="M100 100L${lkP(100,100,200+i*24,98).join(" ")}L${lkP(100,100,212+i*24,98).join(" ")}Z" fill="${c}" opacity=".35"/><path d="M100 100L${lkP(100,100,20+i*24,98).join(" ")}L${lkP(100,100,32+i*24,98).join(" ")}Z" fill="${c}" opacity=".35"/>`).join("")}</g></svg>`,
 front:()=>`${LK_SVG}<path d="M100 8L120 42H80Z" fill="#ffffff55" stroke="#fff" stroke-width="1.2"/><path d="M100 8L106 42H80Z" fill="#fff" opacity=".35"/></svg>`,
 css:`.D .le-back svg{mix-blend-mode:screen}`,plateCss:["#ffffff","#dfe9ff66","#141824f0","#0a0d14f0"]});

const frozenCrown=lkDef({id:"frozenCrown",n:47,cat:"crystal",name:"Frozen Crown",ar:"التاج المتجمد",pal:"silver",frame:"crystal",
 desc:"تاج جليدي تتدلى منه قطرات متجمدة مع ثلج يتساقط بهدوء",
 back:()=>{ const R=lkSeed(47); return `${LK_SVG}${Array.from({length:14},()=>`<circle cx="${(10+R()*180).toFixed(0)}" cy="${(10+R()*40).toFixed(0)}" r="${(1+R()*1.6).toFixed(1)}" class="fc-sn" style="animation-delay:${(-R()*4).toFixed(1)}s"/>`).join("")}</svg>` },
 front:()=>`${LK_SVG}<path d="M64 42L68 18L80 32L90 12L100 30L110 12L120 32L132 18L136 42Z" fill="#dff4ff" stroke="#fff" stroke-width="1.2"/><path d="M64 42H136" stroke="#8fc8e8" stroke-width="2"/>${[70,80,92,104,116,128].map((x,i)=>`<path d="M${x-2} 42L${x} ${48+(i%3)*4}L${x+2} 42Z" fill="#cfefff"/>`).join("")}${lkGem(100,34,4,"#9fe3ff","#3a8fe0")}</svg>`,
 css:`.D .fc-sn{fill:#fff;animation:lk-fall calc(4s / var(--as,1)) linear infinite}`,plateCss:["#d6dde8","#9fb0c866","#0e141cf0","#070a10f0"]});

const floatingGems=lkDef({id:"floatingGems",n:48,cat:"crystal",name:"Floating Gems",ar:"الأحجار العائمة",pal:"purple",frame:"crystal",
 desc:"سبعة أحجار كريمة متعددة الألوان تطفو حول الصورة بارتفاعات مختلفة",
 back:()=>`${LK_SVG}${[["#b56bff","#5b1fa8",200],["#ff5fb8","#a3115f",235],["#3ba8ff","#0a4fa8",270],["#2ee59d","#0b6b44",305],["#f6c94a","#a06d00",340],["#ff3b4e","#8a0016",160],["#eef3fa","#7f93b0",20]].map(([a,b,ang],i)=>{ const [x,y]=lkP(100,100,ang,68+(i%2)*8); return `<g class="lk-bob" style="animation-delay:${(-i*.45).toFixed(2)}s">${lkGem(x,y,6+(i%3),a,b)}</g>` }).join("")}</svg>`,
 plate:["#b56bff","#8b3dff66","#160829f0","#0a0414f0"]});

const glassButterfly=lkDef({id:"glassButterfly",n:49,cat:"crystal",name:"Glass Butterfly",ar:"الفراشة الزجاجية",pal:"pink",frame:"crystal",
 desc:"فراشتان من زجاج مضلّع بحواف لامعة ترفرفان على جانبي الصورة",
 back:()=>{ const bf=(x,y,s,d)=>`<g transform="translate(${x} ${y}) scale(${s})"><g class="gb-w" style="animation-delay:${d}s"><path d="M0 0L-16 -18L-22 -4L-8 2Z" class="gb-a"/><path d="M0 0L-14 14L-6 18L0 4Z" class="gb-a"/><path d="M0 0L16 -18L22 -4L8 2Z" class="gb-a"/><path d="M0 0L14 14L6 18L0 4Z" class="gb-a"/></g><path d="M0 -8V10" stroke="#fff" stroke-width="1.6"/></g>`; return `${LK_SVG}${bf(30,70,1.3,0)}${bf(170,120,1.1,-.4)}</svg>` },
 css:`.D .gb-a{fill:#ff9ad055;stroke:#fff;stroke-width:.8;stroke-linejoin:round}.D .gb-w{transform-box:fill-box;transform-origin:center;animation:lk-flap calc(1.1s / var(--as,1)) ease-in-out infinite}`,plateCss:["#ff5fb8","#ff2d9566","#2a0718f0","#14030cf0"]});

const diamondExplosion=lkDef({id:"diamondExplosion",n:50,cat:"crystal",name:"Diamond Explosion",ar:"انفجار الألماس",pal:"white",frame:"crystal",
 desc:"اثنا عشر شعاعاً ألماسياً حول الصورة تنفجر للخارج عند كل تفاعل جديد",
 back:()=>`${LK_SVG}${Array.from({length:12},(_,i)=>`<g transform="rotate(${i*30} 100 100)"><path d="M100 30L104 40L100 52L96 40Z" class="dx-s" style="animation-delay:${(i*.1).toFixed(1)}s"/></g>`).join("")}</svg>`,
 front:()=>`${LK_SVG}${[[40,40],[160,44],[34,150],[166,156]].map(([x,y],i)=>`<path d="${lkSpark(x,y,5)}" class="dx-sp" style="animation-delay:${i*.4}s"/>`).join("")}</svg>`,
 css:`.D .dx-s{fill:#f2f6ff;stroke:#9fd3ff;stroke-width:.6;transform-box:view-box;transform-origin:100px 100px;animation:lk-pulse calc(2.4s / var(--as,1)) ease-in-out infinite}.D .dx-sp{fill:#fff;animation:lk-tw 2s ease-in-out infinite}
.D .lk-hit .dx-s{animation:dx-burst 1s ease-out}@keyframes dx-burst{40%{transform:scale(1.35);opacity:1}100%{transform:none}}`,plateCss:["#ffffff","#bfe9ff66","#101622f0","#070a12f0"]});

lkRegister([crystalHalo,rubyQueen,sapphireOrbit,emeraldCrystal,prismLight,frozenCrown,floatingGems,glassButterfly,diamondExplosion]);
