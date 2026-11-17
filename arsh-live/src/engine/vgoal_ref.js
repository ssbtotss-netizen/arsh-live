// ====== أهداف «المرجع» — 12 تصميماً أصلياً مستوحاة من تكوينات فيديو المرجع (رسم B6O6 الخاص، بدون نسخ ملفات) ======
// أوعية تمتلئ بسائل حقيقي (vg-liq + data-top/bot) وأشرطة أفقية (vg-hf + vg-kn). كل عنصر يُرسم SVG قابل للتلوين.
// ملاحظة: «Eevee Goal» في المرجع شخصية Pokémon محمية — استُبدلت بقطة القمر الأصلية.
import { vgRegister } from "./vgoal.js";

const vrLG=(id,n,stops,v)=>`<linearGradient id="${n}${id}" ${v?'x1="0" y1="0" x2="0" y2="1"':'x1="0" x2="1"'}>${stops.map((c,i)=>`<stop offset="${i/(stops.length-1)}" stop-color="${c}"/>`).join("")}</linearGradient>`;
const vrRG=(id,n,stops,cx=".5",cy=".5")=>`<radialGradient id="${n}${id}" cx="${cx}" cy="${cy}">${stops.map((c,i)=>`<stop offset="${i/(stops.length-1)}" stop-color="${c}"/>`).join("")}</radialGradient>`;
const vrStar=(x,y,s,c="#fff")=>`<path d="M${x} ${y-s}l${s*.28} ${s*.72} ${s*.72} ${s*.28}-${s*.72} ${s*.28}-${s*.28} ${s*.72}-${s*.28}-${s*.72}-${s*.72}-${s*.28} ${s*.72}-${s*.28}z" fill="${c}"/>`;
const vrSpk=pts=>`<g class="vg-spk">${pts.map(p=>vrStar(...p)).join("")}</g>`;
/** سائل يرتفع داخل قص الشكل: موجة + فقاعات */
const vrLiquid=(id,top,bot,fill,bubbles=[])=>`<g class="vg-liq" data-top="${top}" data-bot="${bot}"><path class="vg-wave" d="M-300 0Q-275 -7 -250 0T-200 0T-150 0T-100 0T-50 0T0 0T50 0T100 0T150 0T200 0T250 0T300 0T350 0T400 0V320H-300Z" fill="${fill}"/>${bubbles.map(([x,y,r],k)=>`<circle class="vg-bub b${k%4+1}" cx="${x}" cy="${y}" r="${r}" fill="#ffffffaa"/>`).join("")}</g>`;
/** حركات مشتركة لكل التصاميم (موجة، فقاعات، لمعان، طفو) */
const vrBASE=ids=>ids.map(i=>`.vgd-${i} .vg-wave{animation:vg-wave 3.2s linear infinite}.vgd-${i} .vg-bub{animation:vgr-bub 2.8s ease-in infinite;opacity:0}.vgd-${i} .b2{animation-delay:-.7s}.vgd-${i} .b3{animation-delay:-1.4s}.vgd-${i} .b4{animation-delay:-2.1s}.vgd-${i} .vg-liq{transition:transform 1.2s cubic-bezier(.2,.8,.2,1)}.vgd-${i} .vg-hf{transition:width 1.1s cubic-bezier(.2,.8,.2,1)}.vgd-${i} .vg-kn{transition:transform 1.1s cubic-bezier(.2,.8,.2,1)}`).join("")+
`@keyframes vgr-bub{0%{transform:translateY(0);opacity:0}20%{opacity:.9}100%{transform:translateY(-46px);opacity:0}}
@keyframes vgr-float{50%{transform:translateY(-5px)}}@keyframes vgr-sheen{0%{transform:translateX(-120%) skewX(-18deg)}60%,100%{transform:translateX(320%) skewX(-18deg)}}
@keyframes vgr-flow{to{background-position:200% 0}}@keyframes vgr-sway{50%{transform:rotate(-4deg)}}@keyframes vgr-pulse{50%{opacity:.45}}
.vgr-float{animation:vgr-float 3.4s ease-in-out infinite}.vgr-sheen{animation:vgr-sheen 3.6s ease-in-out infinite}.vgr-sway{animation:vgr-sway 2.6s ease-in-out infinite}.vgr-pulse{animation:vgr-pulse 1.8s ease-in-out infinite}`;

// ---------- 1. Perfume — زجاجة عطر كريستالية بغطاء ألماسي ----------
function vrPerfume(id){ const body="M52 104Q52 92 64 90H136Q148 92 148 104V196Q148 214 130 216H70Q52 214 52 196Z";
 return `<svg class="vg-svg" viewBox="0 0 200 230"><defs>${vrLG(id,"l",["#c4b5fd","#8b5cf6","#4c1d95"],1)}${vrLG(id,"m",["#f1f5f9","#94a3b8","#e2e8f0","#64748b"])}${vrLG(id,"d",["#ffffff","#c7d2fe","#a5b4fc","#ffffff"])}<clipPath id="c${id}"><path d="${body}"/></clipPath></defs>
 <g class="vg-glow"><ellipse cx="100" cy="160" rx="80" ry="60" fill="#8b5cf6" opacity=".25"/></g>
 <g class="vgr-float"><path d="${body}" fill="#ffffff14" stroke="url(#m${id})" stroke-width="3"/>
  <g clip-path="url(#c${id})">${vrLiquid(id,92,216,`url(#l${id})`,[[80,200,3],[110,206,2.5],[128,196,3],[96,210,2]])}<path d="M70 96L60 210M100 92V214M130 96L140 210" stroke="#ffffff22" stroke-width="2"/><rect class="vgr-sheen" x="40" y="88" width="18" height="130" fill="#ffffff40"/></g>
  <path d="M86 70H114V90H86Z" fill="url(#m${id})"/><rect x="80" y="64" width="40" height="8" rx="3" fill="url(#m${id})"/>
  <path d="M100 6L126 30 116 64H84L74 30Z" fill="url(#d${id})" stroke="#e0e7ff" stroke-width="1.5"/><path d="M74 30H126M100 6L92 30 100 64 108 30Z" fill="none" stroke="#ffffffaa" stroke-width="1.2"/></g>
 ${vrSpk([[30,120,7],[172,100,6,"#ddd6fe"],[164,190,5]])}</svg>` }

// ---------- 2. Royal Vial — قارورة زجاجية أفقية بأطراف فضية مزخرفة ----------
function vrRoyalVial(id){ const cap=(x,m)=>`<g transform="translate(${x} 40) scale(${m} 1)"><path d="M0 0L14 -14 30 0 14 14Z" fill="url(#m${id})" stroke="#e2e8f0"/><path d="M14 -20V20M4 -8L24 8M4 8L24 -8" stroke="#f8fafc" stroke-width="1.6"/><circle cx="14" cy="0" r="4" fill="#e9d5ff"/></g>`;
 return `<svg class="vg-svg" viewBox="0 0 320 80"><defs>${vrLG(id,"l",["#7c3aed","#a855f7","#e9d5ff"])}${vrLG(id,"m",["#f8fafc","#94a3b8","#f1f5f9","#64748b"])}<clipPath id="c${id}"><rect x="46" y="30" width="228" height="20" rx="10"/></clipPath></defs>
 <g class="vg-glow"><rect x="40" y="22" width="240" height="36" rx="18" fill="#a855f7" opacity=".3"/></g>
 <rect x="46" y="30" width="228" height="20" rx="10" fill="#0b0716cc" stroke="url(#m${id})" stroke-width="2.5"/>
 <g clip-path="url(#c${id})"><rect class="vg-hf" data-w="228" x="46" y="30" width="0" height="20" fill="url(#l${id})"/><rect class="vgr-sheen" x="40" y="28" width="22" height="26" fill="#ffffff55"/></g>
 <rect x="52" y="33" width="216" height="4" rx="2" fill="#ffffff30"/>${cap(14,1)}${cap(306,-1)}
 <g class="vg-kn" data-w="228"><circle cx="46" cy="40" r="3" fill="#fff" class="vgr-pulse"/></g>${vrSpk([[30,16,6],[290,66,5,"#e9d5ff"],[160,12,4]])}</svg>` }

// ---------- 3. Bunny — أرنب لامع مرصّع يمتلئ بالبريق ----------
function vrBunny(id){ const sh=`<ellipse cx="78" cy="58" rx="16" ry="44" transform="rotate(-10 78 58)"/><ellipse cx="122" cy="58" rx="16" ry="44" transform="rotate(10 122 58)"/><circle cx="100" cy="120" r="46"/><ellipse cx="100" cy="186" rx="52" ry="40"/>`;
 return `<svg class="vg-svg" viewBox="0 0 200 236"><defs>${vrLG(id,"l",["#f9a8d4","#ec4899","#9d174d"],1)}<pattern id="p${id}" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.6" fill="#fff" opacity=".8"/><circle cx="9" cy="9" r="1.1" fill="#fde68a" opacity=".8"/></pattern><clipPath id="c${id}">${sh}</clipPath></defs>
 <g class="vg-glow"><circle cx="100" cy="140" r="90" fill="#ec4899" opacity=".22"/></g>
 <g class="vgr-float"><g fill="#fbcfe8" stroke="#fbcfe8" stroke-width="7">${sh}</g><g fill="#2a0f1f">${sh}</g>
  <g clip-path="url(#c${id})">${vrLiquid(id,14,226,`url(#l${id})`,[[80,200,3],[120,190,2.5],[100,210,3]])}<rect x="0" y="0" width="200" height="236" fill="url(#p${id})" class="vgr-pulse"/></g>
  <circle cx="84" cy="116" r="6" fill="#1f0a14"/><circle cx="116" cy="116" r="6" fill="#1f0a14"/><circle cx="86" cy="114" r="2" fill="#fff"/><circle cx="118" cy="114" r="2" fill="#fff"/><path d="M95 130Q100 136 105 130" stroke="#1f0a14" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="74" cy="132" rx="7" ry="4" fill="#f472b6" opacity=".6"/><ellipse cx="126" cy="132" rx="7" ry="4" fill="#f472b6" opacity=".6"/></g>
 ${vrSpk([[26,70,8],[176,96,6,"#fbcfe8"],[168,210,5]])}</svg>` }

// ---------- 4. Coin Jar Sakura — جرة زجاجية تمتلئ بالعملات وبتلات الساكورا ----------
function vrCoinJar(id){ const jar="M58 70Q50 76 50 92V200Q50 220 72 222H128Q150 220 150 200V92Q150 76 142 70Z";
 const coins=Array.from({length:45},(_,k)=>{ const x=62+(k*37)%78, y=214-Math.floor(k/5)*15-(k%3)*3; return `<ellipse cx="${x}" cy="${y}" rx="11" ry="5" fill="url(#g${id})" stroke="#a16207" stroke-width="1"/>` }).join("");
 const petals=Array.from({length:8},(_,k)=>`<path d="M${66+k*9} ${110+(k%3)*36}q5-7 10 0q-5 7-10 0z" fill="#f9a8d4" transform="rotate(${k*40} ${71+k*9} ${110+(k%3)*36})"/>`).join("");
 return `<svg class="vg-svg" viewBox="0 0 200 236"><defs>${vrLG(id,"g",["#fff3c4","#f5c542","#b7791f"],1)}<clipPath id="c${id}"><path d="${jar}"/></clipPath></defs>
 <g class="vg-glow"><ellipse cx="100" cy="160" rx="84" ry="70" fill="#f472b6" opacity=".2"/></g>
 <path d="${jar}" fill="#ffffff0f"/><g clip-path="url(#c${id})"><g class="vg-pile" data-h="140">${coins}${petals}</g><rect class="vgr-sheen" x="40" y="60" width="16" height="170" fill="#ffffff33"/></g>
 <path d="${jar}" fill="none" stroke="#e9d5ff" stroke-width="3" opacity=".85"/><rect x="54" y="52" width="92" height="20" rx="6" fill="#7c3aed" stroke="#c4b5fd" stroke-width="2"/><rect x="60" y="56" width="80" height="4" rx="2" fill="#ffffff44"/>
 <g class="vgr-sway" style="transform-origin:100px 60px"><path d="M100 52q-18-14-26-2q8 10 26 2zM100 52q18-14 26-2q-8 10-26 2z" fill="#f472b6"/><circle cx="100" cy="52" r="4" fill="#ec4899"/><path d="M100 56v18" stroke="#ec4899" stroke-width="1.5"/><path d="M100 86l-9-8a6 6 0 0 1 9-7a6 6 0 0 1 9 7z" fill="#fbcfe8" stroke="#ec4899"/></g>
 ${vrSpk([[30,90,7],[172,120,6,"#fbcfe8"],[100,24,5,"#fde68a"]])}</svg>` }

// ---------- 5. Dragon — تنين نيون صغير ----------
function vrDragon(id){ const sh=`<circle cx="100" cy="84" r="40"/><ellipse cx="100" cy="160" rx="48" ry="50"/><path d="M60 140Q20 120 28 90Q48 112 66 120Z"/><path d="M140 140Q180 120 172 90Q152 112 134 120Z"/><path d="M140 186Q186 196 178 160Q170 178 146 172Z"/>`;
 return `<svg class="vg-svg" viewBox="0 0 200 230"><defs>${vrLG(id,"l",["#c084fc","#9333ea","#3b0764"],1)}<clipPath id="c${id}">${sh}</clipPath></defs>
 <g class="vg-glow"><circle cx="100" cy="130" r="94" fill="#a855f7" opacity=".25"/></g>
 <g class="vgr-float"><g fill="none" stroke="#e879f9" stroke-width="7" style="filter:drop-shadow(0 0 6px #e879f9)">${sh}</g><g fill="#160822">${sh}</g>
  <g clip-path="url(#c${id})">${vrLiquid(id,40,212,`url(#l${id})`,[[84,190,3],[112,200,2.5],[98,176,2]])}</g>
  <path d="M76 52L70 30 86 46M124 52L130 30 114 46" fill="#e879f9"/><path d="M90 40l4-10 4 10 4-10 4 10" stroke="#f0abfc" stroke-width="2" fill="none"/>
  <ellipse cx="86" cy="86" rx="7" ry="9" fill="#fff"/><ellipse cx="114" cy="86" rx="7" ry="9" fill="#fff"/><circle cx="87" cy="88" r="4" fill="#3b0764"/><circle cx="115" cy="88" r="4" fill="#3b0764"/><path d="M92 104Q100 110 108 104" stroke="#f0abfc" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>
 ${vrSpk([[30,40,8,"#f0abfc"],[176,60,6],[170,210,5,"#e9d5ff"]])}</svg>` }

// ---------- 6. Moon Cat — قطة القمر (بديل أصلي) ----------
function vrMoonCat(id){ const sh=`<path d="M58 64L64 20 92 50Z"/><path d="M142 64L136 20 108 50Z"/><circle cx="100" cy="86" r="44"/><ellipse cx="100" cy="168" rx="50" ry="46"/><path d="M146 186Q196 170 182 120Q176 150 150 162Z"/>`;
 return `<svg class="vg-svg" viewBox="0 0 200 230"><defs>${vrLG(id,"l",["#bfdbfe","#60a5fa","#1e3a8a"],1)}<clipPath id="c${id}">${sh}</clipPath></defs>
 <g class="vg-glow"><circle cx="100" cy="120" r="94" fill="#60a5fa" opacity=".22"/></g>
 <g class="vgr-float"><g fill="#e0f2fe" stroke="#e0f2fe" stroke-width="7">${sh}</g><g fill="#0b1426">${sh}</g>
  <g clip-path="url(#c${id})">${vrLiquid(id,20,214,`url(#l${id})`,[[86,196,3],[112,204,2.5],[100,186,2]])}</g>
  <path d="M100 52a12 12 0 1 0 8 20a10 10 0 1 1-8-20z" fill="#fde68a"/>
  <path d="M80 92q6-6 12 0M108 92q6-6 12 0" stroke="#e0f2fe" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M96 104l4 4 4-4" stroke="#e0f2fe" stroke-width="2.5" fill="none"/><path d="M70 104H52M70 110H54M130 104H148M130 110H146" stroke="#e0f2fe" stroke-width="1.6"/></g>
 ${vrSpk([[28,60,7,"#fde68a"],[178,80,6],[40,200,5]])}</svg>` }

// ---------- 7. Fox — ثعلب لطيف ----------
function vrFox(id){ const sh=`<path d="M50 70L56 18 92 52Z"/><path d="M150 70L144 18 108 52Z"/><path d="M48 76Q100 40 152 76Q150 130 100 140Q50 130 48 76Z"/><ellipse cx="100" cy="176" rx="44" ry="40"/><path d="M140 200Q196 196 186 140Q176 176 144 176Z"/>`;
 return `<svg class="vg-svg" viewBox="0 0 200 230"><defs>${vrLG(id,"l",["#fed7aa","#fb923c","#9a3412"],1)}<clipPath id="c${id}">${sh}</clipPath></defs>
 <g class="vg-glow"><circle cx="100" cy="120" r="94" fill="#fb923c" opacity=".2"/></g>
 <g class="vgr-float"><g fill="#ffedd5" stroke="#ffedd5" stroke-width="7">${sh}</g><g fill="#1c0f06">${sh}</g>
  <g clip-path="url(#c${id})">${vrLiquid(id,20,216,`url(#l${id})`,[[86,200,3],[110,206,2.5],[100,186,2]])}</g><path d="M60 96Q100 150 140 96Q130 132 100 138Q70 132 60 96Z" fill="#fff7ed" opacity=".9"/>
  <ellipse cx="80" cy="88" rx="7" ry="8" fill="#1c0f06"/><ellipse cx="120" cy="88" rx="7" ry="8" fill="#1c0f06"/><circle cx="82" cy="86" r="2.4" fill="#fff"/><circle cx="122" cy="86" r="2.4" fill="#fff"/><path d="M95 104h10l-5 6z" fill="#1c0f06"/></g>
 ${vrSpk([[26,50,8],[178,64,6,"#fed7aa"],[34,210,5]])}</svg>` }

// ---------- 8. Heart — قلب لامع يمتلئ ----------
function vrHeart(id){ const H="M100 206C30 156 14 112 30 76C46 42 88 40 100 70C112 40 154 42 170 76C186 112 170 156 100 206Z";
 return `<svg class="vg-svg" viewBox="0 0 200 220"><defs>${vrLG(id,"l",["#fda4af","#f43f5e","#9f1239"],1)}<clipPath id="c${id}"><path d="${H}"/></clipPath></defs>
 <g class="vg-glow"><circle cx="100" cy="120" r="94" fill="#f43f5e" opacity=".25"/></g>
 <g class="vgr-float"><path d="${H}" fill="#fff1f2" opacity=".14"/><g clip-path="url(#c${id})">${vrLiquid(id,42,206,`url(#l${id})`,[[80,180,3],[118,170,2.5],[100,190,3]])}<rect class="vgr-sheen" x="20" y="30" width="22" height="190" fill="#ffffff55"/></g>
  <path d="${H}" fill="none" stroke="#ffe4e6" stroke-width="4"/><path d="M48 82Q54 62 74 60" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".85"/></g>
 ${vrSpk([[30,40,8],[176,52,6,"#fecdd3"],[160,180,5]])}</svg>` }

// ---------- 9. Love Goal — شريط فيروزي بمقبض متوهج ----------
function vrLove(id){ return `<svg class="vg-svg" viewBox="0 0 320 70"><defs>${vrLG(id,"l",["#0f766e","#2dd4bf","#99f6e4"])}<clipPath id="c${id}"><rect x="20" y="28" width="280" height="16" rx="8"/></clipPath></defs>
 <g class="vg-glow"><rect x="14" y="22" width="292" height="28" rx="14" fill="#2dd4bf" opacity=".28"/></g>
 <path d="M22 16l-5-5a3.5 3.5 0 0 1 5-4.5a3.5 3.5 0 0 1 5 4.5z" fill="#2dd4bf" class="vgr-pulse"/>
 <rect x="20" y="28" width="280" height="16" rx="8" fill="#042f2e" stroke="#5eead4" stroke-width="1.5"/>
 <g clip-path="url(#c${id})"><rect class="vg-hf" data-w="280" x="20" y="28" width="0" height="16" fill="url(#l${id})"/><rect class="vgr-sheen" x="10" y="26" width="26" height="20" fill="#ffffff55"/></g>
 <g class="vg-kn" data-w="280"><circle cx="20" cy="36" r="11" fill="#99f6e4" stroke="#ccfbf1" stroke-width="3" style="filter:drop-shadow(0 0 8px #2dd4bf)"/></g>
 ${vrSpk([[120,14,5],[240,60,4,"#99f6e4"],[280,12,5]])}</svg>` }

// ---------- 10. Love Stream — قلب زجاجي بسائل بنفسجي وورود ----------
function vrLoveStream(id){ const H="M100 200C34 154 20 112 34 78C48 46 88 44 100 72C112 44 152 46 166 78C180 112 166 154 100 200Z";
 const roses=[[78,170],[104,184],[124,166],[92,190]].map(([x,y])=>`<g transform="translate(${x} ${y})"><circle r="7" fill="#be123c"/><path d="M-4 -1a4 4 0 0 1 8 0a3 3 0 0 1-6 1" stroke="#fda4af" stroke-width="1.4" fill="none"/></g>`).join("");
 return `<svg class="vg-svg" viewBox="0 0 200 214"><defs>${vrLG(id,"l",["#e9d5ff","#a855f7","#581c87"],1)}<clipPath id="c${id}"><path d="${H}"/></clipPath></defs>
 <g class="vg-glow"><circle cx="100" cy="122" r="92" fill="#c084fc" opacity=".22"/></g>
 <path d="${H}" fill="#ffffff10"/><g clip-path="url(#c${id})">${vrLiquid(id,46,200,`url(#l${id})`,[[86,170,2.5],[116,176,2],[100,160,3]])}<g class="vgr-float">${roses}</g></g>
 <path d="${H}" fill="none" stroke="#f5f3ff" stroke-width="4" opacity=".9"/><path d="M50 84Q56 66 74 64" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".8"/>
 ${vrSpk([[150,40,10],[166,64,6,"#e9d5ff"],[34,170,5]])}</svg>` }

// ---------- 11. Neon — شريط نيون وردي/أزرق ----------
function vrNeon(id){ return `<svg class="vg-svg" viewBox="0 0 320 60"><defs>${vrLG(id,"l",["#ec4899","#a855f7","#60a5fa","#a5f3fc"])}<clipPath id="c${id}"><rect x="22" y="20" width="276" height="20" rx="10"/></clipPath></defs>
 <rect x="22" y="20" width="276" height="20" rx="10" fill="#0a0612" stroke="#f472b6" stroke-width="2" style="filter:drop-shadow(0 0 6px #ec4899)"/>
 <g clip-path="url(#c${id})"><rect class="vg-hf" data-w="276" x="22" y="20" width="0" height="20" fill="url(#l${id})" style="filter:drop-shadow(0 0 8px #a855f7)"/><rect class="vgr-sheen" x="10" y="16" width="30" height="28" fill="#ffffff66"/></g>
 <circle cx="16" cy="30" r="7" fill="none" stroke="#f472b6" stroke-width="2.5" class="vgr-pulse"/><circle cx="304" cy="30" r="7" fill="none" stroke="#60a5fa" stroke-width="2.5" class="vgr-pulse"/></svg>` }

// ---------- 12. Spider Lily — شريط بنفسجي بزهور الليلي على الطرفين ----------
function vrSpiderLily(id){ const lily=(x,m)=>`<g transform="translate(${x} 44) scale(${m} 1)"><g class="vgr-sway" style="transform-origin:0 0">${Array.from({length:9},(_,k)=>`<path d="M0 0Q${10+k*2} ${-18+k*4} ${24+k} ${-24+k*6}" stroke="#a855f7" stroke-width="2.4" fill="none" stroke-linecap="round" transform="rotate(${-60+k*15})"/>`).join("")}<circle r="6" fill="#7e22ce"/></g></g>`;
 return `<svg class="vg-svg" viewBox="0 0 340 80"><defs>${vrLG(id,"l",["#6b21a8","#a855f7","#e9d5ff"])}<clipPath id="c${id}"><rect x="44" y="38" width="252" height="12" rx="6"/></clipPath></defs>
 <g class="vg-glow"><rect x="40" y="30" width="260" height="28" rx="14" fill="#a855f7" opacity=".25"/></g>
 <rect x="44" y="38" width="252" height="12" rx="6" fill="#1a0b2e" stroke="#c4b5fd" stroke-width="1.5"/>
 <g clip-path="url(#c${id})"><rect class="vg-hf" data-w="252" x="44" y="38" width="0" height="12" fill="url(#l${id})"/></g>
 ${lily(36,1)}${lily(304,-1)}${vrSpk([[170,14,5,"#e9d5ff"],[100,70,4],[250,10,4]])}</svg>` }

const vrIDS=["rPerfume","rRoyalVial","rBunny","rCoinJar","rDragonNeon","rMoonCat","rFox","rHeart","rLove","rLoveStream","rNeonBar","rSpiderLily"];
vgRegister([
 {id:"rPerfume",n:101,name:"زجاجة العطر الكريستالية",cat:"vessel",fill:"liquid",desc:"زجاجة عطر كريستالية بغطاء ألماسي يرتفع فيها سائل بنفسجي مع فقاعات ولمعة زجاج",art:vrPerfume,css:vrBASE(vrIDS)+`.vgd-rPerfume{--acc:#c4b5fd}`},
 {id:"rRoyalVial",n:102,name:"القارورة الملكية",cat:"lux",fill:"bar",desc:"قارورة زجاجية أفقية بأطراف فضية مزخرفة يمتلئ ضوؤها البنفسجي مع لمعة متحركة",art:vrRoyalVial,css:`.vgd-rRoyalVial{--acc:#e9d5ff}`},
 {id:"rBunny",n:103,name:"الأرنب اللامع",cat:"fun",fill:"liquid",desc:"أرنب وردي مرصّع يمتلئ بالبريق من الأسفل ويطفو بخفة",art:vrBunny,css:`.vgd-rBunny{--acc:#f9a8d4}`},
 {id:"rCoinJar",n:104,name:"جرة العملات — ساكورا",cat:"vessel",fill:"pile",desc:"جرة زجاجية بغطاء وفيونكة تمتلئ بالعملات الذهبية وبتلات الساكورا",art:vrCoinJar,css:`.vgd-rCoinJar{--acc:#f9a8d4}.vgd-rCoinJar .vg-pile{transition:transform 1.2s cubic-bezier(.2,.8,.2,1)}`},
 {id:"rDragonNeon",n:105,name:"تنين النيون",cat:"game",fill:"liquid",desc:"تنين صغير بإطار نيون يتوهج ويمتلئ باللون البنفسجي",art:vrDragon,css:`.vgd-rDragonNeon{--acc:#e879f9}`},
 {id:"rMoonCat",n:106,name:"قطة القمر",cat:"fun",fill:"liquid",desc:"قطة بهلال ذهبي تمتلئ بالأزرق الليلي — تصميم أصلي",art:vrMoonCat,css:`.vgd-rMoonCat{--acc:#93c5fd}`},
 {id:"rFox",n:107,name:"الثعلب اللطيف",cat:"fun",fill:"liquid",desc:"ثعلب لطيف يمتلئ بالبرتقالي الدافئ ويطفو",art:vrFox,css:`.vgd-rFox{--acc:#fdba74}`},
 {id:"rHeart",n:108,name:"القلب اللامع",cat:"heart",fill:"liquid",desc:"قلب زجاجي لامع يرتفع فيه سائل وردي مع لمعة متحركة",art:vrHeart,css:`.vgd-rHeart{--acc:#fda4af}`},
 {id:"rLove",n:109,name:"شريط الحب الفيروزي",cat:"heart",fill:"bar",desc:"شريط فيروزي بمقبض متوهج يتحرك مع التقدم وقلب نابض",art:vrLove,css:`.vgd-rLove{--acc:#5eead4}`},
 {id:"rLoveStream",n:110,name:"قلب الورود الزجاجي",cat:"heart",fill:"liquid",desc:"قلب زجاجي فيه ورود عائمة وسائل بنفسجي يرتفع",art:vrLoveStream,css:`.vgd-rLoveStream{--acc:#d8b4fe}`},
 {id:"rNeonBar",n:111,name:"شريط النيون",cat:"game",fill:"bar",desc:"شريط نيون بتدرج وردي-أزرق متوهج ولمعة متحركة",art:vrNeon,css:`.vgd-rNeonBar{--acc:#f472b6}`},
 {id:"rSpiderLily",n:112,name:"زهرة الليلي",cat:"lux",fill:"bar",desc:"شريط بنفسجي تحرسه زهرتا ليلي تتمايلان على الطرفين",art:vrSpiderLily,css:`.vgd-rSpiderLily{--acc:#c4b5fd}`},
]);
