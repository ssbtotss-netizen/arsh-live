// ====== آخر التفاعلات — المجموعة السادسة: الألعاب والمستقبل (51–60) ======
import { LK_SVG, lkP, lkSpark, lkPoly, lkSeed, lkDef, lkRegister } from "./le_kit.js";


const cyberSamurai=lkDef({id:"cyberSamurai",n:51,cat:"gaming",name:"Cyber Samurai",ar:"الساموراي السايبر",pal:"red",frame:"neon",
 desc:"سيفان نيون متقاطعان خلف الصورة بلمعة تمر على النصلين",
 back:()=>`${LK_SVG}${[[-38,"#ff2d55"],[38,"#22e1ff"]].map(([r,c])=>`<g transform="rotate(${r} 100 100)"><rect x="97" y="4" width="6" height="150" rx="3" fill="${c}" class="cs-b"/><rect x="99" y="4" width="2" height="150" fill="#fff" opacity=".8"/><rect x="92" y="150" width="16" height="5" rx="2" fill="#ddd"/><rect x="97" y="155" width="6" height="34" rx="2" fill="#222" stroke="${c}" stroke-width="1"/></g>`).join("")}</svg>`,
 css:`.D .cs-b{animation:lk-pulse calc(1.6s / var(--as,1)) ease-in-out infinite}`,plateCss:["#ff2d55","#22e1ff66","#1a0610f0","#08030af0",.2]});

const hologramPortal=lkDef({id:"hologramPortal",n:52,cat:"gaming",name:"Hologram Portal",ar:"بوابة الهولوغرام",pal:"blue",frame:"neon",
 desc:"منصة هولوغرام بحلقات منظور تحت الصورة وخطوط مسح ترتفع للأعلى",
 back:()=>`${LK_SVG}${[0,1,2,3].map(i=>`<ellipse cx="100" cy="168" rx="${30+i*16}" ry="${7+i*3}" class="hp-r" style="animation-delay:${i*.3}s"/>`).join("")}<path d="M48 168L70 40H130L152 168Z" fill="url(#hpg)" opacity=".35"/><defs><linearGradient id="hpg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#22e1ff"/><stop offset="1" stop-color="#22e1ff" stop-opacity="0"/></linearGradient></defs>${[0,1,2].map(i=>`<rect x="56" y="150" width="88" height="1.4" fill="#9ff3ff" class="hp-sc" style="animation-delay:${i*.8}s"/>`).join("")}</svg>`,
 css:`.D .hp-r{fill:none;stroke:#22e1ff;stroke-width:1.2;animation:lk-pulse calc(2s / var(--as,1)) ease-in-out infinite}.D .hp-sc{animation:hp-up calc(2.4s / var(--as,1)) linear infinite;opacity:0}@keyframes hp-up{0%{opacity:0;transform:translateY(0)}20%{opacity:1}100%{opacity:0;transform:translateY(-120px)}}`,plateCss:["#22e1ff","#1e7bff66","#041422f0","#020a12f0",.2]});

const levelUp=lkDef({id:"levelUp",n:53,cat:"gaming",name:"Level Up",ar:"ارتقاء المستوى",pal:"green",frame:"neon",
 desc:"عدّاد خبرة دائري يمتلئ حول الصورة وأسهم ترتفع مع شارة LEVEL UP",
 back:()=>`${LK_SVG}<circle cx="100" cy="100" r="64" class="lu-bg"/><circle cx="100" cy="100" r="64" class="lu-xp" transform="rotate(-90 100 100)"/>${[34,166].map((x,i)=>[0,1,2].map(j=>`<path d="M${x-7} ${150-j*14}L${x} ${142-j*14}L${x+7} ${150-j*14}" class="lu-ar" style="animation-delay:${(j*.25+i*.1).toFixed(2)}s"/>`).join("")).join("")}</svg>`,
 front:()=>`${LK_SVG}<g transform="translate(100 24)"><rect x="-34" y="-9" width="68" height="18" rx="9" fill="#0b2a18" stroke="#2ee59d" stroke-width="1.5"/><text y="4.5" text-anchor="middle" font-size="11" font-weight="900" fill="#7dffc4" font-family="Orbitron,sans-serif">LEVEL UP</text></g></svg>`,
 css:`.D .lu-bg{fill:none;stroke:#2ee59d33;stroke-width:6}.D .lu-xp{fill:none;stroke:#2ee59d;stroke-width:6;stroke-linecap:round;stroke-dasharray:402;animation:lu-fill calc(4s / var(--as,1)) ease-in-out infinite}@keyframes lu-fill{0%{stroke-dashoffset:402}70%,100%{stroke-dashoffset:0}}
.D .lu-ar{fill:none;stroke:#7dffc4;stroke-width:2.4;stroke-linecap:round;animation:lk-pulse calc(1.2s / var(--as,1)) ease-in-out infinite}`,plateCss:["#2ee59d","#11c47a66","#03170cf0","#010c06f0",.2]});

const rgbChampion=lkDef({id:"rgbChampion",n:54,cat:"gaming",name:"RGB Champion",ar:"بطل RGB",pal:"purple",frame:"neon",
 desc:"حلقة إضاءة RGB تدور ألوانها حول الصورة وكأس بطولة فوقها",
 back:()=>`${LK_SVG}<g class="lk-spin" style="--sd:6s">${["#ff2d55","#ff9f1a","#ffe14d","#2ee59d","#22e1ff","#8b3dff"].map((c,i)=>`<path d="M${lkP(100,100,i*60,66).join(" ")}A66 66 0 0 1 ${lkP(100,100,i*60+58,66).join(" ")}" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/>`).join("")}</g></svg>`,
 front:()=>`${LK_SVG}<g transform="translate(100 22)"><path d="M-11 -10H11V-2C11 6 6 10 0 10C-6 10-11 6-11-2Z" fill="#f6c94a" stroke="#fff3c4" stroke-width=".8"/><path d="M-11 -6H-16C-16 2-12 3-10 3M11 -6H16C16 2 12 3 10 3" fill="none" stroke="#f6c94a" stroke-width="2"/><rect x="-3" y="10" width="6" height="5" fill="#d8a520"/><rect x="-8" y="15" width="16" height="4" rx="1" fill="#f6c94a"/></g></svg>`,
 plate:["#b56bff","#22e1ff66","#120624f0","#080312f0",.2]});

const digitalMatrix=lkDef({id:"digitalMatrix",n:55,cat:"gaming",name:"Digital Matrix",ar:"المصفوفة الرقمية",pal:"green",frame:"neon",
 desc:"أعمدة رموز رقمية خضراء تتساقط خلف الصورة",
 back:()=>{ const R=lkSeed(55), ch="01アイウエオカキク10"; return `${LK_SVG}${Array.from({length:12},(_,i)=>{ const x=10+i*16; return `<g class="dm-c" style="animation-delay:${(-R()*3).toFixed(1)}s;animation-duration:calc(${(2.4+R()*2).toFixed(1)}s / var(--as,1))">${Array.from({length:6},(_,j)=>`<text x="${x}" y="${j*12}" font-size="10" fill="${j===5?"#d9ffe9":"#2ee59d"}" opacity="${(.25+j*.15).toFixed(2)}">${ch[Math.floor(R()*ch.length)]}</text>`).join("")}</g>` }).join("")}</svg>` },
 css:`.D .dm-c{font-family:monospace;animation:dm-fall 3s linear infinite}@keyframes dm-fall{from{transform:translateY(-70px)}to{transform:translateY(200px)}}.D .le-back{-webkit-mask:radial-gradient(circle,transparent 30%,#000 46%);mask:radial-gradient(circle,transparent 30%,#000 46%)}`,plateCss:["#2ee59d","#11c47a66","#021209f0","#000804f0",.15]});

const neonHexagon=lkDef({id:"neonHexagon",n:56,cat:"gaming",name:"Neon Hexagon",ar:"السداسي النيون",pal:"pink",frame:"hex",
 desc:"إطار سداسي مزدوج من النيون وخلايا سداسية تضيء بالتتابع",
 back:()=>{ const cells=[]; for(const [a,r] of [[0,84],[60,84],[120,84],[180,84],[240,84],[300,84],[30,92],[150,92],[270,92]]){ const [x,y]=lkP(100,100,a,r); cells.push(`<path d="${lkPoly(x,y,9,6,0)}" class="nh-c" style="animation-delay:${(cells.length*.22).toFixed(2)}s"/>`) } return `${LK_SVG}${cells.join("")}<path d="${lkPoly(100,100,70,6,0)}" class="nh-f"/><path d="${lkPoly(100,100,64,6,0)}" class="nh-f2"/></svg>` },
 css:`.D .nh-f{fill:none;stroke:#ff2d95;stroke-width:3}.D .nh-f2{fill:none;stroke:#22e1ff;stroke-width:1.4;stroke-dasharray:10 6;animation:lk-dash calc(3s / var(--as,1)) linear infinite}.D .nh-c{fill:#ff2d9522;stroke:#ff9ad0;stroke-width:1;animation:lk-pulse calc(2s / var(--as,1)) ease-in-out infinite}`,plateCss:["#ff2d95","#22e1ff66","#1f0614f0","#0e020af0",.15]});

const mechaWings=lkDef({id:"mechaWings",n:57,cat:"gaming",name:"Mecha Wings",ar:"الأجنحة الميكانيكية",pal:"silver",frame:"neon",
 desc:"جناحان من صفائح معدنية حادة بخطوط طاقة زرقاء ينفتحان على الجانبين",
 back:()=>{ const wing=Array.from({length:5},(_,i)=>`<path d="M84 ${92+i*4}L${30-i*4} ${50+i*18}L${40-i*2} ${58+i*18}L84 ${100+i*4}Z" class="mw-p"/><path d="M84 ${96+i*4}L${36-i*3} ${55+i*18}" class="mw-l"/>`).join(""); return `${LK_SVG}<g class="mw-w">${wing}</g><g transform="translate(200 0) scale(-1 1)"><g class="mw-w">${wing}</g></g></svg>` },
 css:`.D .mw-p{fill:#9fb0c8;stroke:#eef3fa;stroke-width:.8}.D .mw-l{stroke:#22e1ff;stroke-width:1.2;animation:lk-pulse calc(1.4s / var(--as,1)) ease-in-out infinite}.D .mw-w{transform-box:view-box;transform-origin:84px 100px;animation:mw-f calc(3s / var(--as,1)) ease-in-out infinite}@keyframes mw-f{50%{transform:rotate(-6deg)}}`,plateCss:["#d6dde8","#22e1ff55","#10151ef0","#070a10f0",.15]});

const plasmaCore=lkDef({id:"plasmaCore",n:58,cat:"gaming",name:"Plasma Core",ar:"نواة البلازما",pal:"purple",frame:"neon",
 desc:"نواة طاقة بنفسجية تحيط بالصورة وأقواس كهربائية متقطعة تومض حولها",
 back:()=>{ const R=lkSeed(58); return `${LK_SVG}<circle cx="100" cy="100" r="70" fill="url(#pcg)"/><defs><radialGradient id="pcg"><stop offset=".6" stop-color="#8b3dff00"/><stop offset=".85" stop-color="#8b3dff88"/><stop offset="1" stop-color="#8b3dff00"/></radialGradient></defs>${Array.from({length:6},(_,i)=>{ let d=""; for(let k=0;k<=6;k++){ const [x,y]=lkP(100,100,i*60+k*8,64+(k%2?10:0)+R()*6); d+=(k?"L":"M")+x+" "+y } return `<path d="${d}" class="pc-a" style="animation-delay:${(i*.2).toFixed(1)}s"/>` }).join("")}</svg>` },
 css:`.D .pc-a{fill:none;stroke:#e0b8ff;stroke-width:1.6;stroke-linejoin:round;animation:pc-z calc(1s / var(--as,1)) steps(2) infinite}@keyframes pc-z{0%{opacity:1}50%{opacity:.1}}`,plateCss:["#b56bff","#8b3dff77","#150628f0","#090314f0",.2]});

const quantumCircle=lkDef({id:"quantumCircle",n:59,cat:"gaming",name:"Quantum Circle",ar:"الدائرة الكمّية",pal:"blue",frame:"neon",
 desc:"ثلاثة مدارات ذرّية متقاطعة بإلكترونات مضيئة تدور حول الصورة",
 back:()=>`${LK_SVG}${[0,60,120].map(r=>`<ellipse cx="100" cy="100" rx="84" ry="26" transform="rotate(${r} 100 100)" class="qc-o"/>`).join("")}</svg>`,
 front:()=>`${LK_SVG}${[0,60,120].map((r,i)=>`<g transform="rotate(${r} 100 100)"><g><animateMotion dur="${3+i}s" repeatCount="indefinite" path="M16 100a84 26 0 1 0 168 0a84 26 0 1 0 -168 0"/><circle r="8" fill="#22e1ff" opacity=".3"/><circle r="4" fill="#bdf3ff"/></g></g>`).join("")}</svg>`,
 css:`.D .qc-o{fill:none;stroke:#3ba8ff;stroke-width:1.3;opacity:.75}`,plateCss:["#3ba8ff","#22e1ff66","#06111ff0","#020810f0"]});

const ultimateEsports=lkDef({id:"ultimateEsports",n:60,cat:"gaming",name:"Ultimate Esports",ar:"أبطال الرياضات الإلكترونية",pal:"gold",frame:"gold",
 desc:"درع بطولة ذهبي خلف الصورة مع غصني غار ونجوم انتصار",
 back:()=>`${LK_SVG}<path d="M100 10L170 32V96C170 140 136 170 100 188C64 170 30 140 30 96V32Z" class="ue-s"/><path d="M100 18L162 38V96C162 134 132 160 100 178C68 160 38 134 38 96V38Z" class="ue-s2"/>${[-1,1].map(s=>Array.from({length:6},(_,i)=>{ const [x,y]=lkP(100,104,90+s*(60+i*16),74); return `<ellipse cx="${x}" cy="${y}" rx="7" ry="3" transform="rotate(${90+s*(60+i*16)+s*60} ${x} ${y})" fill="#f6c94a"/>` }).join("")).join("")}</svg>`,
 front:()=>`${LK_SVG}${[70,100,130].map((x,i)=>`<path d="${lkSpark(x,i===1?14:20,i===1?7:5)}" class="ue-st" style="animation-delay:${i*.3}s"/>`).join("")}</svg>`,
 css:`.D .ue-s{fill:#1a1206cc;stroke:#f6c94a;stroke-width:3}.D .ue-s2{fill:none;stroke:#ffe08a;stroke-width:1;stroke-dasharray:4 4}.D .ue-st{fill:#ffe08a;animation:lk-tw 1.8s ease-in-out infinite}`,plateCss:["#f6c94a","#ffb02066","#1f1506f0","#0f0a02f0",.2]});

lkRegister([cyberSamurai,hologramPortal,levelUp,rgbChampion,digitalMatrix,neonHexagon,mechaWings,plasmaCore,quantumCircle,ultimateEsports]);
