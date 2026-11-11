// ====== مكتبة الأهداف الأسطورية (80) — الدفعة الأولى: أفضل 10 ======
// كل تصميم: رسم SVG حقيقي + أجزاء تضيء بالنسبة (vg-fc) أو سائل (vg-liq) أو عملات (vg-pile) + حركات المراحل والاكتمال.
import { vgRegister } from "./vgoal.js";

// ---------- أدوات هندسية: شرائح على منحنى (للسيوف، الجذوع، الأوراق، جسم التنين، الريش) ----------
const qp=(a,b,c,t)=>{ const u=1-t; return [u*u*a[0]+2*u*t*b[0]+t*t*c[0],u*u*a[1]+2*u*t*b[1]+t*t*c[1]] };
const qd=(a,b,c,t)=>{ const u=1-t; const x=2*u*(b[0]-a[0])+2*t*(c[0]-b[0]), y=2*u*(b[1]-a[1])+2*t*(c[1]-b[1]); const l=Math.hypot(x,y)||1; return [-y/l,x/l] };
const f1=n=>Math.round(n*10)/10;
/** مقاطع متتالية على منحنى بعرض متدرج — كل مقطع جزء يضيء */
function segs(a,b,c,n,w0,w1){ const out=[]; for(let i=0;i<n;i++){ const t0=i/n,t1=(i+1)/n, p0=qp(a,b,c,t0),p1=qp(a,b,c,t1), n0=qd(a,b,c,t0),n1=qd(a,b,c,t1), h0=(w0+(w1-w0)*t0)/2,h1=(w0+(w1-w0)*t1)/2;
 out.push([[p0[0]+n0[0]*h0,p0[1]+n0[1]*h0],[p1[0]+n1[0]*h1,p1[1]+n1[1]*h1],[p1[0]-n1[0]*h1,p1[1]-n1[1]*h1],[p0[0]-n0[0]*h0,p0[1]-n0[1]*h0]].map(p=>f1(p[0])+","+f1(p[1])).join(" ")) } return out }
/** شكل متدرج كامل (ورقة/ريشة/نصل) */
function band(a,b,c,w0,w1,steps=14){ const L=[],R=[]; for(let i=0;i<=steps;i++){ const t=i/steps,p=qp(a,b,c,t),nn=qd(a,b,c,t),h=(w0+(w1-w0)*t)/2; L.push([p[0]+nn[0]*h,p[1]+nn[1]*h]); R.push([p[0]-nn[0]*h,p[1]-nn[1]*h]) } return "M"+[...L,...R.reverse()].map(p=>f1(p[0])+" "+f1(p[1])).join("L")+"Z" }
let PI=0; const pc=(d,i,tag="polygon",attr="points",extra="")=>`<${tag} class="vg-fc" data-i="${i}" ${attr}="${d}" ${extra}/>`;
const LG=(id,n,stops,v)=>`<linearGradient id="${n}${id}" ${v?'x1="0" y1="0" x2="0" y2="1"':'x1="0" x2="1"'}>${stops.map((c,i)=>`<stop offset="${i/(stops.length-1)}" stop-color="${c}"/>`).join("")}</linearGradient>`;
const GOLD=["#7a4e0e","#f9e29c","#d4a537","#fff1c1","#a16207"], GOLDV=["#fff1c1","#f5c542","#a16207"];
const spark=(pts)=>`<g class="vg-spk">${pts.map(([x,y,s,c])=>`<path d="M${x} ${y-s}l${s*.3} ${s*.7} ${s*.7} ${s*.3}-${s*.7} ${s*.3}-${s*.3} ${s*.7}-${s*.3}-${s*.7}-${s*.7}-${s*.3} ${s*.7}-${s*.3}z" fill="${c||"#fff"}"/>`).join("")}</g>`;
const halo=(cx,cy,r,c)=>`<g class="vg-glow"><circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}" opacity=".22"/></g>`;
const rays=(cx,cy,n,len,c)=>`<g class="vg-rays" style="transform-origin:${cx}px ${cy}px">${Array.from({length:n},(_,i)=>`<rect x="${cx-1.5}" y="${cy-len}" width="3" height="${len*.45}" rx="1.5" fill="${c}" transform="rotate(${i*360/n} ${cx} ${cy})" opacity=".7"/>`).join("")}</g>`;

// ---------- 1. النخلة والسيفان (مستوحى — ليس الشعار الرسمي حرفياً) ----------
function palmSwords(id){ let i=0; const P=[];
 const sw=(m)=>{ const a=[100+m*58,196],b=[100+m*10,150],c=[100-m*62,98]; const hilt=`<path d="M${a[0]-m*6} ${a[1]+2}l${m*14}-12" stroke="url(#g${id})" stroke-width="7" stroke-linecap="round"/><rect x="${a[0]-m*16-9}" y="${a[1]-14}" width="18" height="5" rx="2" fill="url(#g${id})" transform="rotate(${m*-38} ${a[0]-m*16} ${a[1]-12})"/>`; return {hilt,blade:segs(a,b,c,6,8,2)} };
 const L=sw(1),R=sw(-1); P.push(pc(L.blade[0],i++),pc(R.blade[0],i++)); for(let k=1;k<6;k++){ P.push(pc(L.blade[k],i++),pc(R.blade[k],i++)) }
 const trunk=segs([100,186],[98,140],[100,86],6,13,9); for(const t of trunk) P.push(pc(t,i++,"polygon","points",'data-k="trunk"'));
 const fr=[[-74,6,-50],[-62,-22,-34],[-30,-44,-12],[0,-50,0],[30,-44,12],[62,-22,34],[74,6,50]];
 for(const [dx,dy,cx] of fr) P.push(`<path class="vg-fc" data-i="${i++}" d="${band([100,84],[100+cx,84+dy*.8-14],[100+dx,84+dy],12,1)}"/>`);
 return `<svg class="vg-svg" viewBox="0 0 200 220"><defs>${LG(id,"g",GOLD)}${LG(id,"v",GOLDV,1)}<radialGradient id="h${id}"><stop offset="0" stop-color="#fde68a" stop-opacity=".6"/><stop offset="1" stop-color="#fde68a" stop-opacity="0"/></radialGradient></defs>
 <g class="vg-glow"><circle cx="100" cy="118" r="96" fill="url(#h${id})"/></g>${rays(100,118,18,100,"#fde68a")}
 <circle class="vg-ring" cx="100" cy="118" r="92" fill="none" stroke="#f5c542" stroke-width="2" stroke-dasharray="4 6"/>
 ${L.hilt}${R.hilt}${P.join("")}${spark([[34,40,9],[170,52,7,"#fde68a"],[150,190,6]])}</svg>` }

// ---------- 2. النخلة الذهبية ----------
function goldenPalm(id){ let i=0; const P=[];
 for(const t of segs([104,200],[92,150],[100,78],8,18,11)) P.push(pc(t,i++));
 const fr=[[-82,24,-40],[-70,-8,-36],[-44,-40,-18],[-14,-56,-4],[16,-56,6],[46,-40,20],[72,-8,38],[84,24,44],[-26,30,-12],[28,30,12]];
 for(const [dx,dy,cx] of fr){ P.push(`<path class="vg-fc" data-i="${i++}" d="${band([100,78],[100+cx,78+dy*.7-16],[100+dx,78+dy],14,1)}"/>`) }
 const dates=[[86,96],[92,104],[80,104],[112,96],[118,104],[106,104],[99,110]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" fill="url(#d${id})"/>`).join("");
 return `<svg class="vg-svg" viewBox="0 0 200 230"><defs>${LG(id,"g",GOLD)}<radialGradient id="d${id}" cx=".35" cy=".3"><stop offset="0" stop-color="#ffe9a8"/><stop offset="1" stop-color="#9a5b12"/></radialGradient></defs>
 ${halo(100,110,96,"#f5c542")}<path d="M10 214Q60 196 100 202T190 212V230H10Z" fill="#c2913f" opacity=".55"/>${P.join("")}<g class="vg-dates">${dates}</g>${spark([[40,60,8],[166,70,7,"#fde68a"],[30,150,6]])}</svg>` }

// ---------- 3. الدلة السعودية ----------
function dallah(id){ const body="M70 186Q58 172 64 150Q70 128 86 118L90 96H110L114 118Q130 128 136 150Q142 172 130 186Z";
 return `<svg class="vg-svg" viewBox="0 0 220 230"><defs>${LG(id,"g",GOLD)}${LG(id,"c",["#f3d9a4","#c8a15a","#7c5418"],1)}<clipPath id="b${id}"><path d="${body}"/></clipPath></defs>
 ${halo(110,140,92,"#f5c542")}
 <g class="vg-pot">
 <path d="M86 128Q52 120 40 92Q34 78 22 66L18 70Q30 84 34 100Q44 132 80 146Z" fill="url(#g${id})" stroke="#7a4e0e" stroke-width="1"/>
 <path d="M134 128Q170 120 164 160Q160 176 136 176" fill="none" stroke="url(#g${id})" stroke-width="7" stroke-linecap="round"/>
 <path d="${body}" fill="#1c1408"/>
 <g clip-path="url(#b${id})"><g class="vg-liq" data-top="104" data-bot="190"><path class="vg-wave" d="M-200 0Q-175 -6 -150 0T-100 0T-50 0T0 0T50 0T100 0T150 0T200 0T250 0T300 0T350 0T400 0V200H-200Z" fill="url(#c${id})"/>
  <circle class="vg-bub b1" cx="88" cy="160" r="2.5" fill="#fff8"/><circle class="vg-bub b2" cx="108" cy="170" r="2" fill="#fff8"/><circle class="vg-bub b3" cx="120" cy="156" r="2.5" fill="#fff8"/></g>
  <rect x="74" y="110" width="9" height="80" fill="#ffffff30" transform="skewX(-6)"/></g>
 <path d="${body}" fill="none" stroke="url(#g${id})" stroke-width="4"/>
 <path d="M68 168H132M66 150H134" stroke="#7a4e0e" stroke-width="1.5" stroke-dasharray="3 3" opacity=".7"/>
 <path d="M86 98H114L120 84Q110 62 100 60Q90 62 80 84Z" fill="url(#g${id})" stroke="#7a4e0e"/><circle cx="100" cy="54" r="6" fill="url(#g${id})"/><path d="M84 92H116" stroke="#7a4e0e" stroke-width="2"/>
 <ellipse cx="100" cy="188" rx="38" ry="6" fill="url(#g${id})"/></g>
 <g class="vg-steam"><path d="M22 58Q14 46 22 36Q30 26 22 14" fill="none" stroke="#ffffff99" stroke-width="3" stroke-linecap="round"/><path d="M32 60Q26 50 32 42Q38 32 32 22" fill="none" stroke="#ffffff66" stroke-width="2.5" stroke-linecap="round"/></g>
 <g class="vg-pour"><path class="vg-stream" d="M20 72Q14 120 30 176" fill="none" stroke="#c8a15a" stroke-width="4" stroke-linecap="round"/><path d="M14 184H50L46 202H18Z" fill="url(#g${id})" stroke="#7a4e0e"/><ellipse cx="32" cy="184" rx="18" ry="4" fill="#c8a15a"/></g>
 ${spark([[180,40,8],[190,120,6,"#fde68a"],[60,40,6]])}</svg>` }

// ---------- 4. الصقر الملكي ----------
function falcon(id){ let i=0; const P=[];
 for(let k=0;k<4;k++) P.push(`<path class="vg-fc" data-i="${i++}" d="${band([96,150],[90+k*4,180],[80+k*7,204],10,3)}"/>`);
 for(let k=0;k<8;k++){ const y=92+k*8; P.push(`<path class="vg-fc" data-i="${i++}" d="${band([112-k*1.5,y],[92,y+22],[72+k*2,y+46-k*2],14-k*.6,3)}"/>`) }
 P.push(`<path class="vg-fc" data-i="${i++}" d="M100 84Q132 92 128 132Q122 166 98 160Q82 150 86 118Q88 94 100 84Z"/>`);
 P.push(`<path class="vg-fc" data-i="${i++}" d="M104 50Q126 50 130 70Q132 86 112 92Q96 92 92 78Q90 56 104 50Z"/>`);
 return `<svg class="vg-svg" viewBox="0 0 220 230"><defs>${LG(id,"g",GOLD)}</defs>${halo(110,120,96,"#f5c542")}
 <g class="vg-wings"><path class="wl" d="${band([96,104],[40,60],[8,90],34,4)}" fill="url(#g${id})" opacity=".9"/><path class="wr" d="${band([118,104],[176,60],[212,92],34,4)}" fill="url(#g${id})" opacity=".9"/></g>
 <rect x="60" y="196" width="100" height="8" rx="4" fill="#5b3a1a"/><path d="M92 196l-4 8M104 196v8M112 196l4 8" stroke="#f5c542" stroke-width="2.5"/>
 ${P.join("")}<path d="M128 66L142 72L130 78Z" fill="#f5c542" stroke="#7a4e0e"/><circle class="vg-eye" cx="116" cy="66" r="4" fill="#1a1206"/><circle cx="117" cy="65" r="1.4" fill="#fff"/>
 <path d="M106 58Q116 54 124 60" stroke="#1a120688" stroke-width="2" fill="none"/>${spark([[40,40,8],[184,50,7,"#fde68a"],[30,180,6]])}</svg>` }

// ---------- 5. الدرعية التاريخية (طراز نجدي: شرفات مثلثة وأبراج متناقصة) ----------
function diriyah(id){ let i=0; const P=[]; const win=(x,y,w=6,h=9)=>P.push(`<rect class="vg-fc" data-i="${i++}" x="${x}" y="${y}" width="${w}" height="${h}" rx="1"/>`);
 const crenel=(x0,x1,y)=>{ let d=`M${x0} ${y}`; for(let x=x0;x<x1;x+=8) d+=`L${x+4} ${y-7}L${x+8} ${y}`; return `<path d="${d}V${y+3}H${x0}Z" fill="#b07c45"/>` };
 const bld=`<path d="M14 196V120H70V196Z" fill="url(#m${id})"/>${crenel(14,70,120)}<path d="M64 196V96L74 84H96L106 96V196Z" fill="url(#m${id})"/>${crenel(66,104,90)}
  <path d="M100 196V128H150V196Z" fill="url(#m${id})"/>${crenel(100,150,128)}<path d="M144 196V70L152 56H172L180 70V196Z" fill="url(#m${id})"/>${crenel(146,178,62)}<path d="M174 196V136H206V196Z" fill="url(#m${id})"/>${crenel(174,206,136)}`;
 for(const y of [140,166]) for(const x of [24,40,56]) win(x,y);
 for(const y of [104,126,150,172]) win(82,y,8,10);
 for(const x of [112,130]) win(x,150);
 for(const y of [80,104,128,152,176]) win(158,y,8,10);
 for(const x of [184]) win(x,156);
 return `<svg class="vg-svg" viewBox="0 0 220 220"><defs>${LG(id,"m",["#e2b680","#c99a62","#8a5a2b"],1)}<radialGradient id="s${id}" cx=".5" cy=".9"><stop offset="0" stop-color="#f59e0b" stop-opacity=".35"/><stop offset="1" stop-color="#f59e0b" stop-opacity="0"/></radialGradient></defs>
 <g class="vg-glow"><ellipse cx="110" cy="180" rx="110" ry="70" fill="url(#s${id})"/></g>
 <g class="vg-fw">${[[40,40,"#fde68a"],[170,30,"#f472b6"],[110,20,"#a3e635"]].map(([x,y,c],k)=>`<g transform="translate(${x} ${y})"><g style="animation-delay:${k*.4}s">${Array.from({length:10},(_,j)=>`<rect x="-1" y="-16" width="2" height="8" rx="1" fill="${c}" transform="rotate(${j*36})"/>`).join("")}</g></g>`).join("")}</g>
 ${bld}<path d="M10 196H210V206H10Z" fill="#7a4f25"/>${P.join("")}<path class="vg-lights" d="M14 118Q42 128 70 118M66 90Q86 98 106 90M144 66Q162 74 180 66" fill="none" stroke="#fde68a" stroke-width="1.5" stroke-dasharray="1 5" stroke-linecap="round"/></svg>` }

// ---------- 6. صندوق الكنز الملكي ----------
function royalChest(id){ let i=0; const gems=[[64,150,"#ef4444"],[88,156,"#22d3ee"],[132,156,"#22c55e"],[156,150,"#a855f7"],[110,172,"#f5c542"],[110,96,"#ef4444"]].map(([x,y,c])=>`<path class="vg-fc" data-i="${i++}" d="M${x} ${y-8}L${x+7} ${y}L${x} ${y+8}L${x-7} ${y}Z" style="--c:${c}"/>`).join("");
 return `<svg class="vg-svg" viewBox="0 0 220 220"><defs>${LG(id,"g",GOLD)}${LG(id,"vv",["#7e22ce","#4c1d95","#2e1065"],1)}<clipPath id="c${id}"><rect x="34" y="56" width="152" height="60"/></clipPath>${LG(id,"gd",["#fff1a8","#f5c542","#b7791f"],1)}</defs>
 ${halo(110,110,100,"#c084fc")}${rays(110,100,10,100,"#fde68a")}
 <rect x="34" y="84" width="152" height="34" fill="#12061b"/>
 <g clip-path="url(#c${id})"><g class="vg-pile" data-h="50"><path d="M30 126Q60 82 110 76Q160 82 190 126Z" fill="url(#gd${id})"/>${[[60,104],[84,94],[110,88],[136,94],[160,104],[98,104],[124,104]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="9" ry="4" fill="#fde68a" stroke="#b7791f"/>`).join("")}<path d="M104 72l6 -10 6 10z" fill="#22d3ee"/></g></g>
 <rect x="28" y="114" width="164" height="84" rx="10" fill="url(#vv${id})" stroke="url(#g${id})" stroke-width="5"/><path d="M28 132H192M28 182H192" stroke="url(#g${id})" stroke-width="4"/>
 <rect x="96" y="128" width="28" height="36" rx="6" fill="url(#g${id})"/><path d="M110 138a5 5 0 1 1 0 10v6" stroke="#2e1065" stroke-width="3" fill="none"/>
 <g class="vg-lid"><path d="M28 116V90Q28 52 110 50Q192 52 192 90V116Z" fill="url(#vv${id})" stroke="url(#g${id})" stroke-width="5"/><path d="M40 100H180" stroke="url(#g${id})" stroke-width="3"/>
  <g transform="translate(88 26)"><path d="M2 26 5 6l9 9L22 0l8 15 9-9 3 20z" fill="url(#g${id})" stroke="#7a4e0e"/></g></g>
 ${gems}${spark([[24,50,9],[196,60,7,"#fde68a"],[200,170,6]])}</svg>` }

// ---------- 7. التنين الأسطوري ----------
function dragon(id){ let i=0; const P=[];
 for(const s of segs([40,200],[20,140],[80,130],5,10,22)) P.push(pc(s,i++));
 for(const s of segs([80,130],[150,120],[130,80],5,22,26)) P.push(pc(s,i++));
 for(const s of segs([130,80],[112,52],[140,40],3,26,22)) P.push(pc(s,i++));
 const head=`<path class="vg-fc" data-i="${i++}" d="M128 26Q150 14 176 24Q190 30 186 40L170 42L184 50Q170 60 150 56Q132 54 128 44Z"/>`;
 return `<svg class="vg-svg" viewBox="0 0 220 220"><defs>${LG(id,"sc",["#064e3b","#10b981","#a7f3d0"],1)}</defs>${halo(110,110,98,"#10b981")}
 <g class="vg-dwings"><path d="M118 112Q150 70 196 80Q178 92 188 104Q168 100 172 116Q150 108 132 122Z"/><path d="M104 118Q76 74 30 84Q48 96 38 108Q58 104 54 120Q76 112 94 126Z"/></g>${segs([80,130],[150,120],[130,80],5,2,2).map((_,k)=>{ const t=(k+.5)/5, pt=qp([80,130],[150,120],[130,80],t), n=qd([80,130],[150,120],[130,80],t); return `<path class="vg-spike" d="M${f1(pt[0]+n[0]*10)} ${f1(pt[1]+n[1]*10)}L${f1(pt[0]+n[0]*22)} ${f1(pt[1]+n[1]*22)}L${f1(pt[0]+n[0]*10+4)} ${f1(pt[1]+n[1]*10+4)}Z"/>` }).join("")}
 <circle cx="70" cy="76" r="28" fill="none" stroke="#a7f3d055" stroke-width="2"/><circle class="vg-orb" cx="70" cy="76" r="20" fill="#67e8f9" opacity=".5"/>
 ${P.join("")}${head}<path d="M140 22L132 4L146 18M156 18L156 0L164 18" stroke="#fde68a" stroke-width="3" fill="none" stroke-linecap="round"/>
 <path d="M150 54Q160 70 150 84M140 56Q142 74 132 84" stroke="#a7f3d0" stroke-width="2" fill="none" opacity=".7"/>
 <circle class="vg-eye" cx="166" cy="32" r="4" fill="#fde047"/>
 <g class="vg-fire"><path d="M184 46Q206 40 216 26Q214 46 200 56Q214 58 220 70Q200 70 186 54Z" fill="#f97316"/><path d="M186 48Q200 44 208 36Q206 48 196 54Z" fill="#fde047"/></g>
 ${spark([[30,40,8,"#a7f3d0"],[200,120,7],[90,200,6,"#fde68a"]])}</svg>` }

// ---------- 8. مفاعل الطاقة ----------
function reactor(id){ let i=0; const cells=Array.from({length:12},(_,k)=>{ const a=(k/12)*Math.PI*2-Math.PI/2, r=82, x=110+Math.cos(a)*r, y=110+Math.sin(a)*r; return `<g transform="rotate(${k*30} ${f1(x)} ${f1(y)})"><rect class="vg-fc" data-i="${i++}" x="${f1(x-6)}" y="${f1(y-12)}" width="12" height="24" rx="3"/></g>` }).join("");
 return `<svg class="vg-svg" viewBox="0 0 220 220"><defs><radialGradient id="core${id}"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#67e8f9"/><stop offset=".75" stop-color="#2563eb"/><stop offset="1" stop-color="#1e3a8a" stop-opacity="0"/></radialGradient></defs>
 ${halo(110,110,104,"#38bdf8")}
 <path d="M110 6L200 58V162L110 214L20 162V58Z" fill="#0b1226d9" stroke="#38bdf8" stroke-width="2"/>
 ${cells}
 <g class="vg-r1"><circle cx="110" cy="110" r="62" fill="none" stroke="#38bdf8" stroke-width="3" stroke-dasharray="30 12"/></g>
 <g class="vg-r2"><circle cx="110" cy="110" r="50" fill="none" stroke="#a5f3fc" stroke-width="2" stroke-dasharray="6 8"/></g>
 <circle class="vg-core" cx="110" cy="110" r="40" fill="url(#core${id})"/>
 <g class="vg-arcs"><path d="M80 90Q96 104 86 124M140 92Q126 110 138 128M100 76Q112 90 124 78" stroke="#e0f2fe" stroke-width="2" fill="none" stroke-linecap="round"/></g>
 ${spark([[30,30,7,"#a5f3fc"],[190,30,6],[196,190,7,"#a5f3fc"]])}</svg>` }

// ---------- 9. كأس B6O6 الملكي ----------
function b6o6Cup(id){ const cup="M54 40H166Q166 120 128 146Q110 156 92 146Q54 120 54 40Z";
 return `<svg class="vg-svg" viewBox="0 0 220 240"><defs>${LG(id,"s",["#64748b","#f8fafc","#94a3b8","#ffffff","#475569"])}${LG(id,"l",["#bfdbfe","#2f7bff","#1e3a8a"],1)}<clipPath id="c${id}"><path d="${cup}"/></clipPath></defs>
 ${halo(110,96,96,"#2f7bff")}
 <path d="M58 54Q14 50 18 86Q22 116 70 118" fill="none" stroke="url(#s${id})" stroke-width="9"/><path d="M162 54Q206 50 202 86Q198 116 150 118" fill="none" stroke="url(#s${id})" stroke-width="9"/>
 <path d="${cup}" fill="#020617cc"/>
 <g clip-path="url(#c${id})"><g class="vg-liq" data-top="40" data-bot="152"><path class="vg-wave" d="M-200 0Q-175 -8 -150 0T-100 0T-50 0T0 0T50 0T100 0T150 0T200 0T250 0T300 0T350 0T400 0V200H-200Z" fill="url(#l${id})"/>
  <path class="vg-bolt" d="M100 30L90 52H104L94 76" stroke="#e0f2fe" stroke-width="2.5" fill="none"/><circle class="vg-bub b1" cx="80" cy="120" r="3" fill="#fff8"/><circle class="vg-bub b2" cx="130" cy="126" r="2.5" fill="#fff8"/></g>
  <rect x="68" y="36" width="12" height="120" fill="#ffffff30" transform="skewX(-8)"/></g>
 <path d="${cup}" fill="none" stroke="url(#s${id})" stroke-width="5"/><rect x="48" y="34" width="124" height="10" rx="5" fill="url(#s${id})"/>
 <path d="M60 96H160" stroke="#2f7bff" stroke-width="2"/><text x="110" y="92" text-anchor="middle" font-family="Orbitron,Changa,sans-serif" font-weight="900" font-size="20" fill="#ffffff" stroke="#1e3a8a" stroke-width="1.6" paint-order="stroke">B6O6</text>
 <path d="M100 150H120L126 196H94Z" fill="url(#s${id})"/><path d="M70 196H150L156 214H64Z" fill="url(#s${id})"/><rect x="58" y="214" width="104" height="10" rx="4" fill="#2f7bff"/>
 <g class="vg-crown" transform="translate(88 0)"><path d="M2 28 5 8l9 9L22 0l8 17 9-9 3 20z" fill="#7fb2ff" stroke="#1e3a8a"/></g>
 ${spark([[30,24,8,"#bfdbfe"],[196,140,7],[24,170,6,"#7fb2ff"]])}</svg>` }

// ---------- 10. البطة الذهبية B6O6 ----------
function goldenDuck(id){ const duck="M64 196Q30 190 30 158Q30 128 62 118Q52 100 56 82Q62 52 96 50Q128 50 134 80Q138 98 128 112Q162 112 182 96Q192 120 180 150Q166 194 120 198Z";
 return `<svg class="vg-svg" viewBox="0 0 220 230"><defs>${LG(id,"g",GOLD)}${LG(id,"l",["#fff1a8","#f5c542","#b7791f"],1)}<clipPath id="c${id}"><path d="${duck}"/></clipPath></defs>
 ${halo(110,128,98,"#f5c542")}
 <g class="vg-duck"><path d="${duck}" fill="#1c1408"/>
 <g clip-path="url(#c${id})"><g class="vg-liq" data-top="46" data-bot="200"><path class="vg-wave" d="M-200 0Q-175 -8 -150 0T-100 0T-50 0T0 0T50 0T100 0T150 0T200 0T250 0T300 0T350 0T400 0V260H-200Z" fill="url(#l${id})"/>
  <circle class="vg-bub b1" cx="80" cy="170" r="3" fill="#fff8"/><circle class="vg-bub b2" cx="120" cy="176" r="2.5" fill="#fff8"/><circle class="vg-bub b3" cx="150" cy="160" r="3" fill="#fff8"/></g>
  <path d="M70 140Q100 128 130 140Q120 162 90 160Z" fill="#ffffff22"/></g>
 <path d="${duck}" fill="none" stroke="url(#g${id})" stroke-width="4" stroke-linejoin="round"/>
 <path d="M132 76Q160 72 170 82Q160 94 132 92Z" fill="#fb923c" stroke="#9a3412" stroke-width="1.5"/><circle cx="108" cy="74" r="6" fill="#1a1206"/><circle cx="110" cy="72" r="2" fill="#fff"/>
 <path class="vg-wing" d="M78 150Q100 128 132 144Q118 168 86 164Z" fill="none" stroke="url(#g${id})" stroke-width="3"/></g>
 <g class="vg-crown" transform="translate(78 14)"><path d="M2 30 5 8l10 10L24 0l9 18 10-10 3 22z" fill="url(#g${id})" stroke="#7a4e0e"/></g>
 <g class="vg-quack"><rect x="150" y="20" width="60" height="28" rx="14" fill="#fff"/><path d="M160 46l-8 10 16-10z" fill="#fff"/><text x="180" y="40" text-anchor="middle" font-family="Changa,sans-serif" font-weight="900" font-size="14" fill="#a16207">كواك!</text></g>
 ${spark([[30,60,8],[196,110,7,"#fde68a"],[40,210,6]])}</svg>` }

const BASE_FC=`.vgw .vg-fc{fill-opacity:calc(.12 + var(--on,0)*.88);stroke-opacity:calc(.35 + var(--on,0)*.5);transition:fill-opacity .6s,stroke-opacity .6s,filter .6s;transform-box:fill-box;transform-origin:center}
.vgw .vg-fc.lit{animation:vg-facet .7s cubic-bezier(.3,1.5,.5,1)}
.vgw .vg-ring{opacity:calc(.2 + var(--p,0)*.8);transform-box:view-box;transform-origin:50% 54%;animation:vg-spin 30s linear infinite}`;
vgRegister([
 {id:"palmSwords",n:1,name:"النخلة والسيفان",cat:"saudi",fill:"pieces",fx:"goldSweep",desc:"نخلة وسيفان متقاطعان تضيء أجزاؤهما تدريجياً حتى الهالة الذهبية",art:palmSwords,css:BASE_FC+`
.vgd-palmSwords{--acc:#fde68a}.vgd-palmSwords .vg-fc{stroke:#f5c542;stroke-width:1}
.vgd-palmSwords .vg-fc{fill:#f5c542}.vgd-palmSwords .vg-fc.lit{filter:drop-shadow(0 0 3px #fde68a)}
.vgd-palmSwords.done .vg-fc{fill:#fde68a;filter:drop-shadow(0 0 6px #f5c542)}`},
 {id:"goldenPalm",n:2,name:"النخلة الذهبية",cat:"saudi",fill:"pieces",fx:"goldSweep",desc:"جذع وسعف يضيئان تدريجياً، يظهر الرطب عند 75٪",art:goldenPalm,css:`
.vgd-goldenPalm{--acc:#fde68a}.vgd-goldenPalm .vg-fc{fill:#e8b84a;stroke:#fde68a;stroke-width:.8}
.vgd-goldenPalm .vg-fc.lit{filter:drop-shadow(0 0 2px #fde68a)}.vgd-goldenPalm .vg-dates{opacity:0;transition:opacity .8s}
.vgd-goldenPalm.vst-3 .vg-dates,.vgd-goldenPalm.vst-4 .vg-dates,.vgd-goldenPalm.done .vg-dates{opacity:1}
.vgd-goldenPalm.done .vg-fc{fill:#fde68a;filter:drop-shadow(0 0 6px #f5c542)}`},
 {id:"dallah",n:4,name:"الدلة السعودية",cat:"saudi",fill:"liquidUp",fx:"goldSweep",desc:"دلة ذهبية يرتفع فيها مستوى القهوة مع بخار، وعند الاكتمال تصب في الفنجال",art:dallah,css:`
.vgd-dallah{--acc:#f3d9a4}.vgd-dallah .vg-liq{transition:transform 1.2s cubic-bezier(.2,.8,.2,1)}
.vgd-dallah .vg-wave{animation:vg-wave 3s linear infinite}.vgd-dallah .vg-bub{animation:vg-bub 2.6s ease-in infinite;opacity:0}.vgd-dallah .b2{animation-delay:-.9s}.vgd-dallah .b3{animation-delay:-1.7s}
.vgd-dallah .vg-steam{opacity:0;transition:opacity .8s}.vgd-dallah.vst-1 .vg-steam,.vgd-dallah.vst-2 .vg-steam,.vgd-dallah.vst-3 .vg-steam,.vgd-dallah.vst-4 .vg-steam{opacity:1}
.vgd-dallah .vg-steam path{animation:vg-steam 2.4s ease-in-out infinite}.vgd-dallah .vg-steam path+path{animation-delay:-1.2s}
@keyframes vg-steam{0%{transform:translateY(6px);opacity:0}40%{opacity:1}100%{transform:translateY(-10px);opacity:0}}
.vgd-dallah .vg-pot{transform-box:view-box;transform-origin:100px 186px;transition:transform 1s}.vgd-dallah .vg-pour{opacity:0;transition:opacity .6s}
.vgd-dallah.done .vg-pot{transform:rotate(-16deg)}.vgd-dallah.done .vg-pour{opacity:1}.vgd-dallah.done .vg-steam{opacity:0}
.vgd-dallah .vg-stream{stroke-dasharray:6 6;animation:vg-flow .5s linear infinite}@keyframes vg-flow{to{stroke-dashoffset:-12}}`},
 {id:"falcon",n:6,name:"الصقر الملكي",cat:"saudi",fill:"pieces",fx:"goldSweep",desc:"يكتمل ريش الصقر المضيء تدريجياً، وعند 100٪ يفرد جناحيه",art:falcon,css:`
.vgd-falcon{--acc:#fde68a}.vgd-falcon .vg-fc{fill:#c8892e;fill-opacity:calc(.32 + var(--on,0)*.68);stroke:#fde68a;stroke-width:.8}
.vgd-falcon .vg-fc.lit{filter:drop-shadow(0 0 2px #fde68a)}
.vgd-falcon .vg-wings path{transform-box:view-box;transition:transform .9s cubic-bezier(.3,1.4,.5,1),opacity .6s;opacity:0}
.vgd-falcon .vg-wings .wl{transform-origin:96px 104px;transform:rotate(60deg) scale(.4)}.vgd-falcon .vg-wings .wr{transform-origin:118px 104px;transform:rotate(-60deg) scale(.4)}
.vgd-falcon.done .vg-wings path{opacity:.95;transform:none}.vgd-falcon.done .vg-wings .wl{animation:vg-flapL 1.6s ease-in-out infinite}.vgd-falcon.done .vg-wings .wr{animation:vg-flapR 1.6s ease-in-out infinite}
@keyframes vg-flapL{50%{transform:rotate(10deg)}}@keyframes vg-flapR{50%{transform:rotate(-10deg)}}
.vgd-falcon.vst-4 .vg-eye,.vgd-falcon.done .vg-eye{fill:#f5c542}`},
 {id:"diriyah",n:7,name:"الدرعية التاريخية",cat:"saudi",fill:"pieces",fx:"glow",desc:"مبانٍ بطراز نجدي تضيء نوافذها وأبراجها، واحتفال ألعاب نارية عند الاكتمال",art:diriyah,css:`
.vgd-diriyah{--acc:#fde68a}.vgd-diriyah .vg-fc{fill:#fbbf24;fill-opacity:calc(.08 + var(--on,0)*.92);stroke:none}
.vgd-diriyah .vg-fc.lit{filter:drop-shadow(0 0 3px #fbbf24)}
.vgd-diriyah .vg-lights{opacity:0;transition:opacity .8s}.vgd-diriyah.vst-3 .vg-lights,.vgd-diriyah.vst-4 .vg-lights,.vgd-diriyah.done .vg-lights{opacity:1;animation:vg-blink 1.2s steps(2) infinite}
@keyframes vg-blink{50%{stroke:#f472b6}}
.vgd-diriyah .vg-fw{opacity:0}.vgd-diriyah.done .vg-fw{opacity:1}.vgd-diriyah.done .vg-fw g g{animation:vg-burst 1.8s ease-out infinite}
@keyframes vg-burst{0%{transform:var(--t,none) scale(.2);opacity:1}100%{opacity:0}}
.vgd-diriyah .vg-fw g g{transform-box:fill-box;transform-origin:center}`},
 {id:"royalChest",n:38,name:"صندوق الكنز الملكي",cat:"treasure",fill:"coins",fx:"coins",desc:"صندوق مخملي بتاج: تضيء جواهره وترتفع العملات ويُفتح الغطاء",art:royalChest,css:`
.vgd-royalChest{--acc:#fde68a}.vgd-royalChest .vg-pile{transition:transform 1.2s cubic-bezier(.2,.8,.2,1)}
.vgd-royalChest .vg-lid{transform-box:view-box;transform-origin:110px 50px;transition:transform 1.2s cubic-bezier(.3,1.3,.5,1)}
.vgd-royalChest .vg-fc{fill:var(--c);stroke:#fff;stroke-width:1}.vgd-royalChest .vg-fc.lit{filter:drop-shadow(0 0 4px var(--c))}
.vgd-royalChest .vg-rays{transform-box:view-box}.vgd-royalChest.vst-3 .vg-rays{opacity:.5}`},
 {id:"dragon",n:21,name:"التنين الأسطوري",cat:"legend",fill:"pieces",fx:"sparkle",desc:"تتوهج حراشف التنين من الذيل إلى الرأس، وعند الاكتمال ينفث النار",art:dragon,css:`
.vgd-dragon{--acc:#a7f3d0}.vgd-dragon .vg-fc{fill:#10b981;stroke:#a7f3d0;stroke-width:1}
.vgd-dragon .vg-fc.lit{filter:drop-shadow(0 0 3px #34d399)}.vgd-dragon.vst-4 .vg-eye,.vgd-dragon.done .vg-eye{fill:#ef4444;filter:drop-shadow(0 0 4px #ef4444)}
.vgd-dragon .vg-fire{opacity:0;transform-box:fill-box;transform-origin:0 50%}.vgd-dragon.done .vg-fire{opacity:1;animation:vg-fire .5s ease-in-out infinite alternate}
@keyframes vg-fire{to{transform:scale(1.15,.9)}}
.vgd-dragon .vg-dwings path{fill:#065f46;stroke:#a7f3d0;stroke-width:1.2;fill-opacity:calc(.25 + var(--p,0)*.6);transform-box:fill-box;transform-origin:0 100%}
.vgd-dragon.done .vg-dwings path{animation:vg-dflap 1.4s ease-in-out infinite}@keyframes vg-dflap{50%{transform:scaleY(.85) rotate(-4deg)}}
.vgd-dragon .vg-spike{fill:#fde68a;opacity:calc(.25 + var(--p,0)*.75)}
.vgd-dragon .vg-orb{opacity:calc(.2 + var(--p,0)*.8);animation:vg-pulse2 2s ease-in-out infinite}@keyframes vg-pulse2{50%{r:23}}`},
 {id:"reactor",n:46,name:"مفاعل الطاقة",cat:"energy",fill:"pieces",fx:"ripple",desc:"خلايا الطاقة تشحن واحدة واحدة، النواة تكبر والحلقات تتسارع",art:reactor,css:`
.vgd-reactor{--acc:#a5f3fc;--r1:#38bdf8}.vgd-reactor .vg-fc{fill:#38bdf8;stroke:#a5f3fc;stroke-width:1}.vgd-reactor .vg-fc.lit{filter:drop-shadow(0 0 4px #38bdf8)}
.vgd-reactor .vg-core{transform-box:fill-box;transform-origin:center;transform:scale(calc(.3 + var(--p,0)*.75));transition:transform 1s cubic-bezier(.2,.8,.2,1)}
.vgd-reactor .vg-r1,.vgd-reactor .vg-r2{transform-box:view-box;transform-origin:110px 110px}
.vgd-reactor .vg-r1{animation:vg-spin 6s linear infinite}.vgd-reactor .vg-r2{animation:vg-spin 9s linear infinite reverse}
.vgd-reactor.vst-2 .vg-r1,.vgd-reactor.vst-3 .vg-r1{animation-duration:3s}.vgd-reactor.vst-4 .vg-r1,.vgd-reactor.done .vg-r1{animation-duration:1.2s}
.vgd-reactor .vg-arcs{opacity:0}.vgd-reactor.vst-3 .vg-arcs,.vgd-reactor.vst-4 .vg-arcs,.vgd-reactor.done .vg-arcs{opacity:1;animation:vg-zap .25s steps(2) infinite}@keyframes vg-zap{50%{opacity:.2}}`},
 {id:"b6o6Cup",n:73,name:"كأس B6O6 الملكي",cat:"b6o6",fill:"liquidUp",fx:"sweep",desc:"كأس فضي بشعار المنصة يمتلئ بطاقة زرقاء مع برق وتاج",art:b6o6Cup,css:`
.vgd-b6o6Cup{--acc:#7fb2ff}.vgd-b6o6Cup .vg-liq{transition:transform 1.2s cubic-bezier(.2,.8,.2,1)}.vgd-b6o6Cup .vg-wave{animation:vg-wave 2.4s linear infinite}
.vgd-b6o6Cup .vg-bub{animation:vg-bub 2.4s ease-in infinite;opacity:0}.vgd-b6o6Cup .b2{animation-delay:-1.1s}
.vgd-b6o6Cup .vg-bolt{animation:vg-zap .4s steps(2) infinite}.vgd-b6o6Cup.vst-2 .vg-crown,.vgd-b6o6Cup.vst-3 .vg-crown,.vgd-b6o6Cup.vst-4 .vg-crown,.vgd-b6o6Cup.done .vg-crown{opacity:1}
.vgd-b6o6Cup .vg-crown{animation:vg-bob3 2.6s ease-in-out infinite}@keyframes vg-bob3{50%{transform:translate(88px,-6px)}}`},
 {id:"goldenDuck",n:71,name:"البطة الذهبية B6O6",cat:"b6o6",fill:"liquidUp",fx:"goldSweep",desc:"بطة بطوط تمتلئ ذهباً، يظهر التاج عند 50٪ وتقول «كواك!» عند الاكتمال",art:goldenDuck,css:`
.vgd-goldenDuck{--acc:#fde68a}.vgd-goldenDuck .vg-liq{transition:transform 1.2s cubic-bezier(.2,.8,.2,1)}.vgd-goldenDuck .vg-wave{animation:vg-wave 3s linear infinite}
.vgd-goldenDuck .vg-bub{animation:vg-bub 2.6s ease-in infinite;opacity:0}.vgd-goldenDuck .b2{animation-delay:-.9s}.vgd-goldenDuck .b3{animation-delay:-1.7s}
.vgd-goldenDuck.vst-2 .vg-crown,.vgd-goldenDuck.vst-3 .vg-crown,.vgd-goldenDuck.vst-4 .vg-crown,.vgd-goldenDuck.done .vg-crown{opacity:1}
.vgd-goldenDuck .vg-crown{animation:vg-bob2 2.6s ease-in-out infinite}@keyframes vg-bob2{50%{transform:translate(78px,8px)}}
.vgd-goldenDuck .vg-quack{opacity:0;transform-box:fill-box;transform-origin:0 100%}.vgd-goldenDuck.done .vg-quack{opacity:1;animation:vg-pop .6s cubic-bezier(.3,1.6,.5,1)}
@keyframes vg-pop{from{transform:scale(0)}}.vgd-goldenDuck .vg-duck{transform-box:view-box;transform-origin:110px 196px}.vgd-goldenDuck.done .vg-duck{animation:vg-wob 1s ease-in-out infinite}
@keyframes vg-wob{25%{transform:rotate(-4deg)}75%{transform:rotate(4deg)}}`},
]);
