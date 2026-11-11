// ====== قوائم الداعمين: المجموعة الأسطورية (60 تصميماً، #301–360) ======
// كل تصميم = طريقة ترتيب مختلفة (15) + إطار صورة + شكل رقم المركز + شكل الاسم + زخرفة المركز الأول + مؤثرات محيطة + احتفال الصدارة.
// الخلفية شفافة 100% (لا مستطيل خلف القائمة)، والمؤثرات أجزاء مستقلة تتحرك وحدها.
import { LB_DESIGNS, LB_CATS } from "./lb.js";
import { duckSVG } from "./fachars.js";

Object.assign(LB_CATS,{legRoyal:"أسطورية: ملكية",legFlower:"أسطورية: فراشات وورد",legGaming:"أسطورية: ألعاب",legGalaxy:"أسطورية: فضاء",legMinimal:"أسطورية: بسيطة وشفافة",legSaudi:"أسطورية: سعودية وB6O6"});
export const LB_ARRS={column:"عمودي نحيف",row:"أفقي",podium:"منصة تتويج",hero:"الأول كبير",ring:"دائري حول الأول",stairs:"درجات",triangle:"مثلث",crescent:"هلال",float:"طافٍ بدون خلفيات",zigzag:"متعرج",wings:"أجنحة",medals:"ميداليات",planets:"كواكب",text:"نصي بسيط",rotate:"متناوب (داعم كل عدة ثوانٍ)"};
export const LB_FRAMES={ring:"حلقة",shield:"درع",medal:"ميدالية",hex:"سداسي",diamond:"ماسي",crystal:"كريستال",arch:"بوابة",soft:"توهج ناعم",planet:"كوكب بحلقة",squircle:"مربع ناعم",moon:"أطوار القمر",none:"بدون صورة"};
export const LB_RKS={circle:"دائرة",diamond:"ألماسة",shield:"درع",ribbon:"شريطة",big:"رقم كبير",hex:"سداسي",none:"مخفي"};
export const LB_NMS={none:"نص فقط",capsule:"كبسولة",ribbon:"شريطة نحيفة",line:"خط ذهبي",glass:"زجاجي",plate:"لوحة داكنة",carbon:"كربون"};
export const LB_AMBS={none:"بدون",butterflies:"فراشات",petals:"بتلات ورد",stars:"نجوم",sparks:"شرارات ذهبية",hearts:"قلوب",clouds:"غيوم",bolts:"برق",flames:"لهب",shards:"شظايا ثلج",meteors:"شهب",coins:"عملات ذهبية",steam:"بخار",dust:"غبار سحري",circuit:"دوائر إلكترونية",diamonds:"ألماس",nebula:"سديم"};
export const LB_D1S={none:"بدون",crown:"تاج",throne:"عرش",lion:"أسد",swords:"سيفان",wings:"أجنحة",rosecrown:"تاج ورد",dragon:"تنين",palm:"نخلة",falcon:"صقر",duck:"بطة بطوط الملك",blackhole:"ثقب أسود",eclipse:"كسوف",firering:"حلقة نار",cosmic:"تاج نجوم",storm:"برق",moonbf:"هلال وفراشة",horse:"حصان عربي",dallah:"دلة"};
export const LB_CELS={crown:"نزول التاج",wings:"فتح الأجنحة",stars:"انفجار نجوم",butterflies:"ظهور فراشات",diamonds:"تجمع الألماس",falcon:"ظهور صقر",lion:"ظهور أسد",coins:"عملات ذهبية",firering:"حلقة نار",halo:"هالة ملكية",hearts:"قلوب",petals:"بتلات",lightning:"برق",planets:"كواكب",confetti:"قصاصات احتفال"};

// ---------- رموز SVG صغيرة (أصلية) ----------
const LBA_G={
 butterfly:c=>`<svg viewBox="0 0 24 24"><g class="bwl"><path d="M12 12C9 4 2 4 3 9C3 12 7 13 12 12Z" fill="${c}" stroke="#fff" stroke-width=".6"/><path d="M12 12C8 13 4 16 6 19C8 21 11 17 12 12Z" fill="${c}" opacity=".85" stroke="#fff" stroke-width=".5"/></g><g class="bwr"><path d="M12 12C15 4 22 4 21 9C21 12 17 13 12 12Z" fill="${c}" stroke="#fff" stroke-width=".6"/><path d="M12 12C16 13 20 16 18 19C16 21 13 17 12 12Z" fill="${c}" opacity=".85" stroke="#fff" stroke-width=".5"/></g><path d="M12 7V18" stroke="#2a1a10" stroke-width="1.4" stroke-linecap="round"/></svg>`,
 star:c=>`<svg viewBox="0 0 24 24"><path d="M12 2L14.6 9H22L16 13.4L18.3 21L12 16.4L5.7 21L8 13.4L2 9H9.4Z" fill="${c}"/></svg>`,
 spark:c=>`<svg viewBox="0 0 24 24"><path d="M12 1Q12 12 23 12Q12 12 12 23Q12 12 1 12Q12 12 12 1Z" fill="${c}"/></svg>`,
 heart:c=>`<svg viewBox="0 0 24 24"><path d="M12 21C6 16 2 13 2 8C2 5 4 3 7 3C9 3 11 4 12 6C13 4 15 3 17 3C20 3 22 5 22 8C22 13 18 16 12 21Z" fill="${c}"/><ellipse cx="8" cy="8" rx="2" ry="1.3" fill="#fff" opacity=".6"/></svg>`,
 petal:c=>`<svg viewBox="0 0 24 24"><path d="M12 2C18 6 18 16 12 22C6 16 6 6 12 2Z" fill="${c}"/><path d="M12 5V19" stroke="#fff" stroke-width=".6" opacity=".6"/></svg>`,
 diamond:c=>`<svg viewBox="0 0 24 24"><path d="M6 3H18L23 9L12 22L1 9Z" fill="${c}" stroke="#fff" stroke-width=".7"/><path d="M1 9H23M6 3L9 9L12 22L15 9L18 3" fill="none" stroke="#fff" stroke-width=".5" opacity=".8"/></svg>`,
 coin:c=>`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#d4a017"/><circle cx="12" cy="12" r="7.5" fill="none" stroke="#fff3c4" stroke-width="1.2"/><path d="M12 7V17M9 9.5H14A2 2 0 0 1 14 13.5H10A2 2 0 0 0 10 17.5H15" stroke="#7a5200" stroke-width="1.3" fill="none"/></svg>`,
 bolt:c=>`<svg viewBox="0 0 24 24"><path d="M14 1L4 14H11L9 23L20 9H13Z" fill="${c}" stroke="#fff" stroke-width=".6"/></svg>`,
 flame:c=>`<svg viewBox="0 0 24 24"><path d="M12 23C6 23 4 18 6 13C7 10 10 9 9 4C13 6 15 9 14 12C16 11 16 9 16 8C19 11 20 15 18 19C17 21 15 23 12 23Z" fill="${c}"/><path d="M12 22C10 22 9 20 10 18C11 16 12 16 12 14C14 16 15 18 14 20C14 21 13 22 12 22Z" fill="#ffe14d"/></svg>`,
 cloud:c=>`<svg viewBox="0 0 24 24"><path d="M6 18A4 4 0 0 1 6 10A6 6 0 0 1 17 8A4.5 4.5 0 0 1 18 18Z" fill="${c}"/></svg>`,
 shard:c=>`<svg viewBox="0 0 24 24"><path d="M12 1L16 10L12 23L8 10Z" fill="${c}" stroke="#fff" stroke-width=".6"/><path d="M12 1L12 23" stroke="#fff" stroke-width=".5" opacity=".7"/></svg>`,
 meteor:c=>`<svg viewBox="0 0 24 24"><path d="M2 2L19 19" stroke="url(#lbmg)" stroke-width="2.4" stroke-linecap="round"/><defs><linearGradient id="lbmg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c}" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient></defs><circle cx="19.5" cy="19.5" r="2.6" fill="#fff"/></svg>`,
 dot:c=>`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" fill="${c}"/><circle cx="12" cy="12" r="9" fill="${c}" opacity=".25"/></svg>`,
 steam:c=>`<svg viewBox="0 0 24 24"><path d="M10 22C6 18 14 15 10 10C7 6 13 4 11 1" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"/></svg>`,
 blob:c=>`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="url(#lbnb)"/><defs><radialGradient id="lbnb"><stop offset="0" stop-color="${c}" stop-opacity=".7"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient></defs></svg>`,
 planet:c=>`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" fill="${c}"/><ellipse cx="12" cy="12" rx="11" ry="3.5" fill="none" stroke="#fff" stroke-width="1" transform="rotate(-20 12 12)" opacity=".8"/></svg>`,
 confetti:c=>`<svg viewBox="0 0 24 24"><rect x="8" y="3" width="8" height="18" rx="2" fill="${c}"/></svg>`,
};
const AMB={butterflies:["butterfly",["#ff9ad0","#c084fc","#7dd3fc","#fde68a"],7,"fly"],petals:["petal",["#ffb3d1","#ff8fb8","#fecdd3"],10,"fall"],stars:["star",["#fff","#fde68a","#bae6fd"],12,"twinkle"],sparks:["spark",["#ffe08a","#f6c94a","#fff"],10,"rise"],
 hearts:["heart",["#ff5f8f","#ff9ad0","#fff0f6"],8,"rise"],clouds:["cloud",["#e9d5ff","#ddd6fe","#f5f3ff"],5,"drift"],bolts:["bolt",["#7dd3fc","#e0f2fe"],5,"flicker"],flames:["flame",["#ff5a1f","#ff7a00","#ffb020"],8,"burn"],
 shards:["shard",["#bae6fd","#e0f2fe","#7dd3fc"],9,"spin"],meteors:["meteor",["#a5b4fc","#fde68a"],5,"streak"],coins:["coin",["#f6c94a"],8,"fall"],steam:["steam",["#ffffffaa"],5,"rise"],
 dust:["spark",["#f0abfc","#fde68a","#a5f3fc","#fff"],16,"twinkle"],circuit:["dot",["#22e1ff","#39ff14"],10,"pulse"],diamonds:["diamond",["#9fe3ff","#e0f2fe","#7cc4ff"],7,"spin"],nebula:["blob",["#8b5cf6","#ec4899","#22d3ee"],5,"drift"]};
const seed=s=>()=>((s=(s*9301+49297)%233280)/233280);
/** طبقة المؤثرات المحيطة: عناصر صغيرة متفرقة (لا تغطي البث) — الكثافة قابلة للتحكم */
export function lbAmbHTML(type,density=1,id=""){ const A=AMB[type]; if(!A) return ""; const [g,cols,n0,mode]=A, n=Math.round(n0*Math.max(0,Math.min(2,density))), R=seed([...String(id+type)].reduce((a,c)=>a+c.charCodeAt(0),7));
 return Array.from({length:n},(_,i)=>{ const x=(R()*100).toFixed(1), y=(R()*100).toFixed(1), s=(.6+R()*.8).toFixed(2), d=(-R()*8).toFixed(1), du=(4+R()*6).toFixed(1);
  return `<i class="ap am-${mode}" style="left:${x}%;top:${y}%;--s:${s};animation-delay:${d}s;--du:${du}s">${LBA_G[g](cols[i%cols.length])}</i>` }).join("") }

// ---------- زخارف المركز الأول (حول صورته) ----------
const D1={
 crown:`<svg viewBox="0 0 100 100" class="d1-top"><path d="M18 70L24 30L40 48L50 22L60 48L76 30L82 70Z" fill="#f6c94a" stroke="#fff3c4" stroke-width="2"/><rect x="16" y="68" width="68" height="10" rx="3" fill="#d4a017"/><circle cx="50" cy="56" r="5" fill="#ff1f3d"/><circle cx="32" cy="60" r="3.5" fill="#22e1ff"/><circle cx="68" cy="60" r="3.5" fill="#22e1ff"/></svg>`,
 throne:`<svg viewBox="0 0 100 100" class="d1-back"><path d="M14 98V40C14 18 30 6 50 6C70 6 86 18 86 40V98H74V44C74 30 64 20 50 20C36 20 26 30 26 44V98Z" fill="#d4a017" stroke="#fff3c4" stroke-width="2"/><path d="M20 96H80" stroke="#7a5200" stroke-width="5"/><circle cx="50" cy="12" r="5" fill="#ff1f3d"/><path d="M14 40H26M74 40H86" stroke="#fff3c4" stroke-width="2"/></svg>`,
 lion:`<svg viewBox="0 0 100 100" class="d1-back"><g fill="#d4a017" stroke="#7a5200" stroke-width="1.2">${Array.from({length:14},(_,i)=>{ const a=i*360/14; return `<path transform="rotate(${a} 50 50)" d="M50 2C56 10 56 16 50 22C44 16 44 10 50 2Z"/>` }).join("")}</g><circle cx="50" cy="50" r="34" fill="none" stroke="#f6c94a" stroke-width="3"/></svg>`,
 swords:`<svg viewBox="0 0 100 100" class="d1-back">${[[-40,"#e5e7eb"],[40,"#e5e7eb"]].map(([r,c])=>`<g transform="rotate(${r} 50 50)"><rect x="47.5" y="-6" width="5" height="78" rx="2" fill="${c}" stroke="#fff"/><rect x="38" y="70" width="24" height="5" rx="2" fill="#d4a017"/><rect x="47" y="75" width="6" height="20" rx="2" fill="#5a3410"/><circle cx="50" cy="98" r="4" fill="#d4a017"/></g>`).join("")}</svg>`,
 wings:`<svg viewBox="0 0 100 100" class="d1-back d1-flap">${[1,-1].map(s=>`<g transform="translate(50 0) scale(${s} 1)"><g class="wg">${Array.from({length:6},(_,i)=>`<path d="M8 50Q${30+i*3} ${30-i*4} ${46+i*2} ${18+i*9}Q${34+i*2} ${46+i*3} 8 ${58+i}Z" fill="${i%2?"#fde68a":"#f6c94a"}" stroke="#7a5200" stroke-width=".6"/>`).join("")}</g></g>`).join("")}</svg>`,
 rosecrown:`<svg viewBox="0 0 100 100" class="d1-ring">${Array.from({length:9},(_,i)=>{ const a=(-160+i*17.5)*Math.PI/180, x=(50+Math.cos(a)*44).toFixed(1), y=(50+Math.sin(a)*44).toFixed(1); return `<g transform="translate(${x} ${y})"><circle r="7" fill="${i%2?"#ff5f8f":"#ff2d6f"}"/><path d="M-3 -1Q0 -5 3 -1Q0 2 -3 -1Z" fill="#ffd1e3"/><ellipse cx="6" cy="5" rx="4" ry="2" fill="#16a34a"/></g>` }).join("")}</svg>`,
 dragon:`<svg viewBox="0 0 100 100" class="d1-ring d1-spin"><path d="M50 4A46 46 0 1 1 8 30" fill="none" stroke="#22c55e" stroke-width="7" stroke-linecap="round"/><path d="M50 4A46 46 0 1 1 8 30" fill="none" stroke="#bbf7d0" stroke-width="2" stroke-dasharray="3 5"/><path d="M8 30L0 22L14 24ZM5 36L-3 40L8 42Z" fill="#16a34a"/><circle cx="50" cy="4" r="6" fill="#22c55e"/><circle cx="52" cy="3" r="1.6" fill="#ff1f3d"/></svg>`,
 palm:`<svg viewBox="0 0 100 100" class="d1-side"><path d="M50 98C52 70 51 50 48 34" stroke="#8a5a2b" stroke-width="6" fill="none" stroke-linecap="round"/>${[-150,-120,-90,-60,-30].map((a,i)=>`<path transform="rotate(${a+90} 48 34)" d="M48 34Q60 20 48 0Q40 18 48 34Z" fill="#c9a227" class="pf" style="animation-delay:${i*.15}s"/>`).join("")}</svg>`,
 falcon:`<svg viewBox="0 0 100 100" class="d1-back d1-flap">${[1,-1].map(s=>`<g transform="translate(50 0) scale(${s} 1)"><g class="wg">${Array.from({length:7},(_,i)=>`<path d="M6 52Q${26+i*4} ${36-i*5} ${48-i} ${16+i*11}Q${32} ${50+i*2} 6 ${60+i}Z" fill="${i%2?"#e8dcc4":"#cbb48f"}" stroke="#5a4630" stroke-width=".7"/>`).join("")}</g></g>`).join("")}</svg>`,
 blackhole:`<svg viewBox="0 0 100 100" class="d1-back d1-spin"><circle cx="50" cy="50" r="48" fill="url(#lbbh)"/><defs><radialGradient id="lbbh"><stop offset=".5" stop-color="#000"/><stop offset=".72" stop-color="#7c3aed"/><stop offset=".82" stop-color="#f0abfc" stop-opacity=".7"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs><ellipse cx="50" cy="50" rx="49" ry="12" fill="none" stroke="#fde68a" stroke-width="2" opacity=".8"/></svg>`,
 eclipse:`<svg viewBox="0 0 100 100" class="d1-back"><circle cx="50" cy="50" r="48" fill="url(#lbec)"/><defs><radialGradient id="lbec"><stop offset=".55" stop-color="#ffd000" stop-opacity="0"/><stop offset=".66" stop-color="#fff7d1"/><stop offset=".78" stop-color="#ffb020" stop-opacity=".6"/><stop offset="1" stop-color="#ff5a1f" stop-opacity="0"/></radialGradient></defs></svg>`,
 firering:`<svg viewBox="0 0 100 100" class="d1-back">${Array.from({length:16},(_,i)=>`<g transform="rotate(${i*22.5} 50 50)"><path d="M50 0C44 8 46 12 50 16C54 12 56 8 50 0Z" fill="${i%2?"#ff7a00":"#ffb020"}" class="fl" style="animation-delay:${(i*.07).toFixed(2)}s"/></g>`).join("")}</svg>`,
 cosmic:`<svg viewBox="0 0 100 100" class="d1-top">${[[20,64,6],[32,44,7],[50,30,9],[68,44,7],[80,64,6]].map(([x,y,r],i)=>`<path transform="translate(${x} ${y})" d="M0 ${-r}L${r*.3} ${-r*.3}L${r} 0L${r*.3} ${r*.3}L0 ${r}L${-r*.3} ${r*.3}L${-r} 0L${-r*.3} ${-r*.3}Z" fill="${i===2?"#fde68a":"#c4b5fd"}" class="tw" style="animation-delay:${i*.3}s"/>`).join("")}<path d="M16 76Q50 60 84 76" stroke="#a78bfa" stroke-width="3" fill="none"/></svg>`,
 storm:`<svg viewBox="0 0 100 100" class="d1-back">${[[10,20],[78,14],[86,70],[6,74]].map(([x,y],i)=>`<path transform="translate(${x} ${y}) scale(.9)" d="M10 0L0 14H8L4 26L16 10H9Z" fill="#7dd3fc" class="fk" style="animation-delay:${i*.25}s"/>`).join("")}<circle cx="50" cy="50" r="46" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 7" opacity=".7"/></svg>`,
 moonbf:`<svg viewBox="0 0 100 100" class="d1-side"><path d="M60 8A34 34 0 1 0 92 52A26 26 0 1 1 60 8Z" fill="#e5e7eb"/><g transform="translate(20 52) scale(1.4)" class="bfly">${LBA_G.butterfly("#bae6fd").replace('<svg viewBox="0 0 24 24">','').replace('</svg>','')}</g></svg>`,
 horse:`<svg viewBox="0 0 100 100" class="d1-side"><path d="M30 96C26 70 34 46 52 34L50 22L60 30C72 28 84 38 86 52L92 66C94 70 90 74 86 72L76 66C70 70 68 80 70 96Z" fill="#e9e4dc" stroke="#6b5a48" stroke-width="2"/><circle cx="72" cy="46" r="2.6" fill="#111"/>${[0,1,2,3].map(i=>`<path d="M${52-i*5} ${30+i*10}q-16 -2 -24 6" fill="none" stroke="#3a2a1a" stroke-width="4" stroke-linecap="round" class="mn" style="animation-delay:${i*.15}s"/>`).join("")}</svg>`,
 dallah:`<svg viewBox="0 0 100 100" class="d1-side"><path d="M34 92H66L62 64C70 52 68 38 58 32L60 20H40L42 32C32 38 30 52 38 64Z" fill="#d4a017" stroke="#fff3c4" stroke-width="2"/><path d="M38 60Q16 52 8 30L14 28Q22 46 38 52" fill="#f6c94a"/><path d="M44 20L50 8L56 20Z" fill="#ffe08a"/>${[0,1].map(i=>`<path d="M${8+i*6} 24q-6 -8 0 -16" stroke="#fff" stroke-width="2" fill="none" class="stm" style="animation-delay:${i*.6}s"/>`).join("")}</svg>`,
};
export function lbD1HTML(k){ if(k==="duck") return `<span class="d1-side d1-duck">${duckSVG({acc:["crown"],aura:"#f6c94a"})}</span>`; return D1[k]||"" }

// ---------- طرق الترتيب (15) ----------
const T=(x,y,s)=>({x,y,w:s,h:s*1.45,k:"tok"});
export function lbArtSlots(arr,N,W,H,g){ const S=[], m=Math.min(W,H);
 const rows=(n,x,y,w,h,from,step=0,alt=0)=>{ const rh=Math.min(h/n,Math.max(24,h/Math.max(5,n))*1.4); for(let i=0;i<n;i++) S[from+i]={x:x+(alt&&i%2?alt:0),y:y+i*rh,w:w-(alt?Math.abs(alt):0),h:rh-g*.5,k:"row"} };
 const grid=(n,from,x,y,w,h,cols)=>{ cols=cols||Math.min(n,Math.max(1,Math.round(Math.sqrt(n*w/(h||1))))); const rr=Math.ceil(n/cols), s=Math.max(4,Math.min(w/cols-g,(h-(rr-1)*g*.5)/rr/1.45)); for(let i=0;i<n;i++){ const c=i%cols, r=Math.floor(i/cols), inRow=Math.min(cols,n-r*cols), ox=(w-inRow*(s+g)+g)/2; S[from+i]=T(x+ox+(inRow-1-c)*(s+g),y+r*(s*1.45+g*.5),s) } };
 switch(arr){
  case "text": { const rh=Math.min(H/N,m*.14); for(let i=0;i<N;i++) S[i]={x:0,y:i*rh,w:W,h:rh*.92,k:"row"}; break }
  case "column": rows(N,W*.04,0,W*.92,H,0); break;
  case "float": rows(N,0,0,W,H,0,0,W*.07); break;
  case "row": { const lines=N>6?2:1, per=Math.ceil(N/lines), s=Math.min(W/per-g,(H/lines)/1.45-g), oy=Math.max(0,(H-lines*(s*1.45+g))/2); for(let i=0;i<N;i++){ const l=Math.floor(i/per), c=i%per, inL=Math.min(per,N-l*per), ox=(W-inL*(s+g)+g)/2; S[i]=T(ox+(inL-1-c)*(s+g),oy+l*(s*1.45+g),s) } break }
  case "podium": { const top=Math.min(3,N), ph=N>3?H*.62:H, cw=W/3, s=Math.min(cw-g,ph/1.45); const P=[[1,0],[2,.14],[0,.2]]; for(let i=0;i<top;i++){ const [col,lift]=P[i], sc=i===0?1:.86; S[i]=T(col*cw+(cw-s*sc)/2,lift*ph,s*sc) } if(N>3) rows(N-3,W*.06,ph+g,W*.88,H-ph-g,3); break }
  case "hero": { const s=Math.min(W*.42,H*.48/1.45); S[0]=T((W-s)/2,0,s); if(N>1) grid(N-1,1,0,s*1.45+g,W,H-s*1.45-g); break }
  case "ring": { const cx=W/2, cy=H/2, s0=m*.32, r=m*.39, n=N-1, s=Math.min(m*.2,2*Math.PI*r/Math.max(n,1)*.8); S[0]=T(cx-s0/2,cy-s0*.725,s0); for(let i=0;i<n;i++){ const a=-Math.PI/2+i*2*Math.PI/Math.max(n,1); S[i+1]=T(cx+Math.cos(a)*r-s/2,cy+Math.sin(a)*r-s*.725,s) } break }
  case "stairs": { if(N>7){ rows(N,0,0,W,H,0); break } const s=Math.min(W/(N*.8+.4),H/(N*.55+1)); for(let i=0;i<N;i++) S[i]=T(W-s-i*(W-s)/Math.max(1,N-1),i*(H-s*1.45)/Math.max(1,N-1),s*(1-i*.04)); break }
  case "triangle": { let lines=[],k=0,c=1; while(k<N){ lines.push(Math.min(c,N-k)); k+=c; c++ } const s=Math.min(W/Math.max(...lines)-g,H/lines.length/1.45-g); let i=0; lines.forEach((cnt,l)=>{ const ox=(W-cnt*(s+g)+g)/2; for(let j=0;j<cnt;j++,i++) S[i]=T(ox+(cnt-1-j)*(s+g),l*(s*1.45+g),s) }); break }
  case "crescent": { const s=Math.min(W/(N*.82+.4),H*.46/1.45), half=Math.ceil((N-1)/2)||1, depth=H-s*1.45*1.16; for(let i=0;i<N;i++){ const side=i===0?0:(i%2?1:-1), step=Math.ceil(i/2), t=side*step/half, sc=i===0?1.15:1-step*.04; S[i]=T(Math.max(0,Math.min(W-s*sc,W/2+t*(W/2-s*.62)-s*sc/2)),Math.max(0,(1-t*t)*depth),s*sc) } break }
  case "zigzag": { const s=Math.min(W*.42,(H/(N*.62+.4))/1.45*1.2); for(let i=0;i<N;i++) S[i]=T(i%2?W*.06:W-s-W*.06,i*(H-s*1.45)/Math.max(1,N-1),s); break }
  case "wings": { const s0=Math.min(W*.28,H*.5/1.45), s=s0*.72; S[0]=T((W-s0)/2,0,s0); for(let i=1;i<N;i++){ const side=i%2?1:-1, step=Math.ceil(i/2), x=W/2+side*(s0*.55+step*(s+g)*1.02)-s/2, y=s0*.3+step*s*.55; S[i]=T(Math.max(0,Math.min(W-s,x)),Math.min(H-s*1.45,y),s*(1-step*.05)) } break }
  case "medals": grid(N,0,0,0,W,H); break;
  case "planets": { const P=[[.5,.12,1],[.18,.05,.7],[.8,.08,.66],[.3,.55,.6],[.72,.52,.58],[.08,.62,.5],[.92,.6,.5],[.5,.7,.48],[.2,.85,.44],[.8,.86,.44]]; if(N>10){ grid(N,0,0,0,W,H); break } const base=Math.min(W*.3,H*.36/1.45*1.45); for(let i=0;i<N;i++){ const [px,py,sc]=P[i], s=base*sc; S[i]=T(Math.max(0,Math.min(W-s,px*W-s/2)),Math.max(0,Math.min(H-s*1.45,py*H)),s) } break }
  case "rotate": { const s=Math.min(W*.5,H/1.45); for(let i=0;i<N;i++) S[i]=T((W-s)/2,(H-s*1.45)/2,s); break }
  default: rows(N,0,0,W,H,0);
 }
 return S }

// ---------- 60 تصميماً ----------
const C=s=>s.split(",");
const LBA_L=[
 // ROYAL
 ["goldenThrone","Golden Throne","legRoyal","المركز الأول على عرش ذهبي والبقية حوله","podium","ring","big","plate","sparks","throne","crown",C("#f6c94a,#e5e7eb,#d08a52,#fde68a,#facc15"),"Changa"],
 ["royalCrownTop","Royal Crown","legRoyal","تاج متحرك فوق صورة أقوى داعم","hero","soft","circle","glass","stars","crown","crown",C("#f6c94a,#cbd5e1,#d97706,#fde68a,#eab308"),"Changa"],
 ["kingdomShields","Kingdom Shields","legRoyal","صور الداعمين داخل دروع ملكية","medals","shield","shield","ribbon","none","crown","halo",C("#d4a017,#94a3b8,#b45309,#e5e7eb,#ca8a04"),"Changa"],
 ["goldenSwords","Golden Swords","legRoyal","سيوف ذهبية متقاطعة خلف المتصدر","column","ring","diamond","line","sparks","swords","coins",C("#f6c94a,#e2e8f0,#cd7f32,#fde68a,#fbbf24"),"Readex Pro"],
 ["royalMedalsArt","Royal Medals","legRoyal","كل داعم داخل ميدالية حسب ترتيبه","row","medal","ribbon","none","none","none","coins",C("#f6c94a,#c0c7d4,#cd7f32,#7dd3fc,#c084fc"),"Changa"],
 ["imperialWings","Imperial Wings","legRoyal","أجنحة ذهبية ترفرف خلف الصور","wings","ring","circle","capsule","sparks","wings","wings",C("#f6c94a,#fde68a,#d4a017,#fff7d1,#eab308"),"Changa"],
 ["diamondPalace","Diamond Palace","legRoyal","بوابات كريستالية لكل داعم","row","arch","hex","glass","diamonds","crown","diamonds",C("#9fe3ff,#e0f2fe,#7cc4ff,#c4b5fd,#bae6fd"),"Readex Pro"],
 ["royalStaircase","Royal Staircase","legRoyal","الداعمون على درجات ذهبية متصاعدة","stairs","squircle","big","plate","coins","crown","coins",C("#f6c94a,#e5e7eb,#d08a52,#facc15,#fde68a"),"Changa"],
 ["goldenLion","Golden Lion","legRoyal","لبدة أسد ذهبية تحيط بالمركز الأول","ring","ring","circle","none","none","lion","lion",C("#f6c94a,#fde68a,#d4a017,#e5e7eb,#b45309"),"Changa"],
 ["blackGoldLux","Black Gold Luxury","legRoyal","إطارات سوداء وذهبية بلا خلفية عامة","triangle","hex","hex","plate","none","crown","halo",C("#f6c94a,#a3a3a3,#d4a017,#fafafa,#ca8a04"),"Orbitron"],
 // FLOWERS
 ["butterflyGarden","Butterfly Garden","legFlower","فراشات ترفرف وتطير بين الصور","float","soft","circle","capsule","butterflies","moonbf","butterflies",C("#ff9ad0,#c084fc,#7dd3fc,#fde68a,#f0abfc"),"Changa"],
 ["pinkWingsArt","Pink Wings","legFlower","أجنحة وردية ترفرف خلف الصور","wings","soft","heart","capsule","hearts","wings","hearts",C("#ff9ad0,#ffc2dc,#f472b6,#fbcfe8,#ec4899"),"Changa"],
 ["crystalButterflyArt","Crystal Butterfly","legFlower","فراشات كريستالية شفافة على هلال","crescent","crystal","diamond","glass","butterflies","none","butterflies",C("#bae6fd,#e0f2fe,#a5f3fc,#f5d0fe,#c7d2fe"),"Readex Pro"],
 ["sakuraBranch","Sakura Branch","legFlower","بتلات ساكورا تتساقط حول القائمة","column","ring","circle","ribbon","petals","rosecrown","petals",C("#ffb3d1,#fecdd3,#f9a8d4,#fda4af,#fbcfe8"),"Changa"],
 ["roseCrownArt","Rose Crown","legFlower","تاج ورود حول صورة المتصدر","hero","ring","ribbon","none","petals","rosecrown","petals",C("#ff2d6f,#ff9ad0,#e11d48,#fecdd3,#be185d"),"Changa"],
 ["lavenderClouds","Lavender Clouds","legFlower","غيوم بنفسجية ناعمة أسفل الصور","row","soft","circle","glass","clouds","crown","halo",C("#c4b5fd,#ddd6fe,#a78bfa,#f5f3ff,#8b5cf6"),"Readex Pro"],
 ["pearlHearts","Pearl Hearts","legFlower","قلوب لؤلؤية مضيئة بترتيب متعرج","zigzag","squircle","circle","capsule","hearts","none","hearts",C("#fff0f6,#ffe4ec,#ffc2dc,#fbcfe8,#f9a8d4"),"Changa"],
 ["fairyDust","Fairy Dust","legFlower","غبار سحري يتلألأ بين المراكز","triangle","soft","diamond","none","dust","cosmic","stars",C("#f0abfc,#a5f3fc,#fde68a,#c4b5fd,#fbcfe8"),"Readex Pro"],
 ["flowerOrbit","Flower Orbit","legFlower","زهور صغيرة تدور حول الصور","ring","ring","circle","capsule","petals","rosecrown","petals",C("#fda4af,#fcd34d,#f9a8d4,#a7f3d0,#c4b5fd"),"Changa"],
 ["moonButterfly","Moon Butterfly","legFlower","هلال فضي وفراشات مضيئة","medals","moon","circle","glass","butterflies","moonbf","butterflies",C("#e5e7eb,#bae6fd,#c7d2fe,#f5f3ff,#a5b4fc"),"Readex Pro"],
 // GAMING
 ["cyberSamuraiLb","Cyber Samurai","legGaming","إطارات حادة بأسلوب الساموراي الإلكتروني","column","hex","shield","carbon","bolts","swords","lightning",C("#ff2d55,#22e1ff,#f43f5e,#a5f3fc,#e11d48"),"Orbitron"],
 ["electricStormArt","Electric Storm","legGaming","برق أزرق حول المركز الأول","hero","ring","hex","plate","bolts","storm","lightning",C("#38bdf8,#7dd3fc,#0ea5e9,#e0f2fe,#0284c7"),"Orbitron"],
 ["carbonRacingArt","Carbon Racing","legGaming","أشرطة سباق كربونية نحيفة","text","squircle","big","carbon","none","none","confetti",C("#ef4444,#f8fafc,#2563eb,#facc15,#64748b"),"Orbitron"],
 ["fireChampion","Fire Champion","legGaming","لهب حول أقوى داعم","podium","ring","circle","plate","flames","firering","firering",C("#ff5a1f,#ffb020,#ef4444,#fde68a,#f97316"),"Changa"],
 ["iceWarriorArt","Ice Warrior","legGaming","شظايا ثلجية حول الصور","triangle","crystal","diamond","glass","shards","none","diamonds",C("#bae6fd,#e0f2fe,#7dd3fc,#f0f9ff,#38bdf8"),"Orbitron"],
 ["hologramRank","Hologram Rank","legGaming","صور وأسماء بأسلوب الهولوغرام","stairs","hex","hex","glass","circuit","none","planets",C("#22e1ff,#a5f3fc,#f0abfc,#99f6e4,#67e8f9"),"Orbitron"],
 ["neonCircuit","Neon Circuit","legGaming","مسارات إلكترونية مضيئة بين المراكز","zigzag","hex","hex","capsule","circuit","storm","lightning",C("#39ff14,#22e1ff,#a3e635,#67e8f9,#4ade80"),"Orbitron"],
 ["metallicShields","Metallic Shields","legGaming","دروع معدنية بانعكاس متحرك","medals","shield","shield","plate","none","swords","halo",C("#e5e7eb,#94a3b8,#cbd5e1,#64748b,#f1f5f9"),"Orbitron"],
 ["gamingBadges","Gaming Badges","legGaming","شارات ألعاب مختلفة لكل مركز","row","hex","ribbon","none","sparks","crown","confetti",C("#f43f5e,#a855f7,#22c55e,#38bdf8,#f59e0b"),"Orbitron"],
 ["dragonOrbit","Dragon Orbit","legGaming","تنين زخرفي يلتف حول المتصدر","ring","ring","circle","plate","flames","dragon","firering",C("#22c55e,#bbf7d0,#16a34a,#fde68a,#4ade80"),"Changa"],
 // GALAXY
 ["saturnSupporters","Saturn Supporters","legGalaxy","حلقات كوكبية حول صور الداعمين","planets","planet","circle","none","stars","none","planets",C("#fbbf24,#a5b4fc,#f0abfc,#7dd3fc,#fde68a"),"Orbitron"],
 ["starConstellation","Star Constellation","legGalaxy","نجوم صغيرة متلألئة بترتيب متعرج","zigzag","soft","diamond","line","stars","cosmic","stars",C("#fde68a,#e0e7ff,#c7d2fe,#bae6fd,#fff"),"Readex Pro"],
 ["blackHole","Black Hole","legGalaxy","حلقة كونية دوّارة حول المتصدر","ring","soft","circle","glass","nebula","blackhole","planets",C("#c084fc,#f0abfc,#818cf8,#fde68a,#a78bfa"),"Orbitron"],
 ["moonPhases","Moon Phases","legGalaxy","كل مركز بطور مختلف من أطوار القمر","row","moon","big","none","stars","none","halo",C("#f5f5f4,#e7e5e4,#d6d3d1,#a8a29e,#78716c"),"Readex Pro"],
 ["meteorTrail","Meteor Trail","legGalaxy","شهب تمر خلف الأسماء","column","ring","circle","ribbon","meteors","cosmic","stars",C("#a5b4fc,#fde68a,#c4b5fd,#7dd3fc,#f0abfc"),"Orbitron"],
 ["cosmicCrown","Cosmic Crown","legGalaxy","تاج مجري مصنوع من النجوم","hero","planet","diamond","glass","dust","cosmic","stars",C("#c4b5fd,#fde68a,#a78bfa,#bae6fd,#e0e7ff"),"Readex Pro"],
 ["nebulaWings","Nebula Wings","legGalaxy","أجنحة من السديم الكوني","wings","soft","hex","none","nebula","wings","wings",C("#ec4899,#8b5cf6,#22d3ee,#f0abfc,#6366f1"),"Orbitron"],
 ["solarEclipse","Solar Eclipse","legGalaxy","هالة شمسية مضيئة حول الصور","crescent","ring","circle","plate","sparks","eclipse","halo",C("#ffd000,#fff7d1,#ff7a00,#fde68a,#f59e0b"),"Changa"],
 ["floatingPlanets","Floating Planets","legGalaxy","صور الداعمين داخل كواكب طافية","planets","soft","none","capsule","nebula","none","planets",C("#38bdf8,#f472b6,#a3e635,#fbbf24,#c084fc"),"Orbitron"],
 ["infinityGalaxy","Infinity Galaxy","legGalaxy","داعم واحد كل عدة ثوانٍ بحلقات كونية","rotate","planet","big","glass","dust","blackhole","planets",C("#818cf8,#f0abfc,#38bdf8,#fde68a,#c084fc"),"Orbitron"],
 // MINIMAL
 ["cleanText","Clean Text","legMinimal","الاسم والمبلغ ورقم المركز فقط","text","none","big","none","none","none","stars",C("#ffffff,#e5e7eb,#d1d5db,#9ca3af,#6b7280"),"Readex Pro"],
 ["floatingAvatars","Floating Avatars","legMinimal","صور وأسماء وقيمة بلا أي خلفية","float","ring","none","none","none","none","halo",C("#ffffff,#e2e8f0,#cbd5e1,#94a3b8,#64748b"),"Readex Pro"],
 ["goldenLineArt","Golden Line","legMinimal","خط ذهبي رفيع أسفل كل اسم","column","ring","big","line","none","none","coins",C("#f6c94a,#fde68a,#eab308,#facc15,#d4a017"),"Changa"],
 ["minimalCapsules","Minimal Capsules","legMinimal","كبسولات صغيرة بحدود شفافة","text","squircle","circle","capsule","none","none","confetti",C("#a5b4fc,#93c5fd,#c4b5fd,#99f6e4,#fbcfe8"),"Readex Pro"],
 ["diamondNumbers","Diamond Numbers","legMinimal","أرقام المراكز داخل ألماسات صغيرة","float","none","diamond","none","none","none","diamonds",C("#9fe3ff,#e0f2fe,#7cc4ff,#bae6fd,#a5f3fc"),"Orbitron"],
 ["glassOutline","Glass Outline","legMinimal","إطارات زجاجية خفيفة جداً بترتيب أفقي","row","squircle","circle","glass","none","none","halo",C("#ffffff,#e0f2fe,#f5f3ff,#ecfeff,#fdf2f8"),"Readex Pro"],
 ["floatingRanking","Floating Ranking","legMinimal","ترتيب عمودي طافٍ دون بطاقات","zigzag","soft","big","none","none","none","stars",C("#ffffff,#fde68a,#bae6fd,#fbcfe8,#c4b5fd"),"Changa"],
 ["miniCrown","Mini Crown","legMinimal","أسماء بسيطة وتاج صغير للأول","text","ring","none","none","none","crown","crown",C("#f6c94a,#e5e7eb,#d08a52,#cbd5e1,#9ca3af"),"Changa"],
 ["supporterRibbon","Supporter Ribbon","legMinimal","شرائط نحيفة جداً خلف الأسماء","column","ring","circle","ribbon","none","none","confetti",C("#f43f5e,#3b82f6,#22c55e,#f59e0b,#a855f7"),"Readex Pro"],
 ["whiteShine","White Shine","legMinimal","نصوص شفافة مع لمعة بيضاء متحركة","text","none","ribbon","none","sparks","none","halo",C("#ffffff,#f1f5f9,#e2e8f0,#cbd5e1,#94a3b8"),"Readex Pro"],
 // SAUDI & B6O6
 ["saudiPalmLb","Saudi Palm","legSaudi","نخلة ذهبية بجانب المركز الأول","podium","ring","circle","plate","none","palm","coins",C("#c9a227,#16a34a,#fde68a,#22c55e,#facc15"),"Changa"],
 ["desertFalconLb","Desert Falcon","legSaudi","صقر يفتح جناحيه خلف أقوى داعم","hero","ring","shield","plate","sparks","falcon","falcon",C("#d6c4a0,#c9a227,#e8dcc4,#fde68a,#a16207"),"Changa"],
 ["najdiLuxury","Najdi Luxury","legSaudi","زخارف نجدية مثلثة حول الصور","triangle","arch","diamond","plate","none","crown","halo",C("#d9a55a,#fde68a,#b07a40,#fff7ed,#8a5a2b"),"Amiri"],
 ["arabianHorseLb","Arabian Horse","legSaudi","حصان عربي بجانب ترتيب الداعمين","column","ring","circle","line","none","horse","halo",C("#e9e4dc,#c9a227,#d6c4a0,#fde68a,#a8a29e"),"Amiri"],
 ["goldenDallahLb","Golden Dallah","legSaudi","دلّة ذهبية مع بخار متحرك","row","ring","circle","glass","steam","dallah","coins",C("#d4a017,#fde68a,#b45309,#fff3c4,#ca8a04"),"Changa"],
 ["saudiEmeraldLb","Saudi Emerald","legSaudi","إطارات زمردية وزخارف ذهبية","medals","hex","hex","plate","sparks","crown","diamonds",C("#11c47a,#f6c94a,#059669,#fde68a,#34d399"),"Changa"],
 ["duckKing","B6O6 Duck King","legSaudi","بطة بطوط بتاج ملكي بجانب المتصدر","hero","ring","circle","capsule","sparks","duck","crown",C("#f6c94a,#2f7bff,#fde68a,#e0f2fe,#ff9f1a"),"Changa"],
 ["b6o6DiamondLb","B6O6 Diamond","legSaudi","ألماس أزرق وفضي دوّار بترتيب أجنحة","wings","crystal","hex","glass","diamonds","cosmic","diamonds",C("#2f7bff,#c0c7d4,#7cc4ff,#e0f2fe,#3d8bff"),"Orbitron"],
 ["b6o6LegendWings","B6O6 Legendary Wings","legSaudi","أجنحة حصرية بألوان المنصة على شكل هلال","crescent","soft","shield","plate","dust","wings","wings",C("#2f7bff,#ff2d6f,#7c5cff,#e0f2fe,#fde68a"),"Orbitron"],
 ["b6o6UltimateSup","B6O6 Ultimate Supporters","legSaudi","تصميم سينمائي: أشعة وتاج وهالة دوّارة","ring","ring","big","glass","dust","eclipse","confetti",C("#fde68a,#2f7bff,#ff2d6f,#e0f2fe,#7c5cff"),"Orbitron"],
];
export const LB_ART_DESIGNS=LBA_L.map(([id,name,cat,desc,arr,frame,rk,nm,amb,d1,cel,colors,font],i)=>({id,n:301+i,name,cat,desc,layout:"art",arr,frame,rk,nm,amb,d1,cel,colors,font,row:"art",halo:"none"}));
LB_DESIGNS.push(...LB_ART_DESIGNS.filter(d=>!LB_DESIGNS.some(x=>x.id===d.id)));
/** «صمم قائمتك»: تصميم يُبنى من اختيارات صانع المحتوى (حقول w.cArr…) */
export const LB_CUSTOM={id:"lbCustom",n:361,name:"صمم قائمتك",cat:"legMinimal",desc:"اختر الترتيب والإطار والزخرفة والمؤثرات بنفسك",layout:"art",arr:"column",frame:"ring",rk:"circle",nm:"capsule",amb:"none",d1:"crown",cel:"crown",colors:C("#f6c94a,#e5e7eb,#d08a52,#2f7bff,#9b5cff"),font:"Changa",row:"art",halo:"none",custom:true};
LB_DESIGNS.push(LB_CUSTOM);
export function lbArtOf(d,w){ if(!d.custom) return d; return {...d,arr:w.cArr||d.arr,frame:w.cFrame||d.frame,rk:w.cRk||d.rk,nm:w.cNm||d.nm,amb:w.cAmb||d.amb,d1:w.cD1||d.d1,cel:w.cCel||d.cel} }

// ---------- CSS ----------
const svgUrl=s=>`url("data:image/svg+xml,${encodeURIComponent(s)}")`;
export const LB_ART_CSS=`
.lbl-art .lr-card{display:none}
.lbl-art .lbx-amb{position:absolute;inset:-4%;pointer-events:none;z-index:0;--apz:calc(var(--W0)*1px*.045)}
.lbx-amb .ap{position:absolute;width:var(--apz);height:var(--apz);transform:scale(var(--s));animation-duration:calc(var(--du) / var(--las,1));animation-iteration-count:infinite;animation-timing-function:ease-in-out}
.lbx-amb .ap svg{width:100%;height:100%;display:block;overflow:visible}
.am-fly{animation-name:lba-fly}.am-fly .bwl,.am-fly .bwr{transform-box:fill-box;animation:lba-flap calc(.5s / var(--las,1)) ease-in-out infinite alternate}.am-fly .bwl{transform-origin:100% 50%}.am-fly .bwr{transform-origin:0% 50%}
@keyframes lba-fly{0%,100%{translate:0 0}25%{translate:30% -40%}50%{translate:-20% -70%}75%{translate:-40% -20%}}@keyframes lba-flap{from{transform:scaleX(1)}to{transform:scaleX(.35)}}
.am-fall{animation-name:lba-fall;animation-timing-function:linear}@keyframes lba-fall{0%{opacity:0;translate:0 -60%;rotate:0deg}15%{opacity:1}100%{opacity:0;translate:40% 260%;rotate:200deg}}
.am-twinkle{animation-name:lba-tw}@keyframes lba-tw{0%,100%{opacity:.1}50%{opacity:1}}
.am-rise{animation-name:lba-rise}@keyframes lba-rise{0%{opacity:0;translate:0 60%}25%{opacity:1}100%{opacity:0;translate:10% -220%}}
.am-drift{animation-name:lba-drift;opacity:.75}@keyframes lba-drift{50%{translate:40% -10%}}
.am-flicker{animation-name:lba-fk;animation-timing-function:steps(2)}@keyframes lba-fk{0%,70%,100%{opacity:0}75%,85%{opacity:1}}
.am-burn{animation-name:lba-burn;transform-origin:50% 100%}@keyframes lba-burn{50%{scale:1 1.25;opacity:.7}}
.am-spin{animation-name:lba-spin;animation-timing-function:linear}@keyframes lba-spin{to{rotate:360deg}}
.am-streak{animation-name:lba-streak;animation-timing-function:linear}@keyframes lba-streak{0%{opacity:0;translate:-120% -120%}20%{opacity:1}60%,100%{opacity:0;translate:220% 220%}}
.am-pulse{animation-name:lba-pulse}@keyframes lba-pulse{50%{opacity:.25;scale:.6}}
.no-fx .lbx-amb,.lb-lite .lbx-amb,.lb-noamb .lbx-amb{display:none}
.lbl-art .lr.k-tok .lr-av{left:calc(50% - var(--av)/2);top:calc(var(--av)*.08)}
.lbl-art .lr.k-tok .lr-nm{left:0;right:0;text-align:center;top:calc(var(--av)*1.16)}
.lbl-art .lr.k-tok .lr-vl{left:0;right:0;justify-content:center;top:calc(var(--av)*1.16 + var(--fs)*1.45)}
.lbl-art .lr.k-tok .lr-rk{width:calc(var(--fs)*1.5);height:calc(var(--fs)*1.5);top:calc(var(--av)*.86);left:calc(50% + var(--av)*.22);font-size:calc(var(--fs)*.8);z-index:4}
.lbl-art .lr.k-tok.r1{--av1:1}.lbl-art .lr.k-tok.r1 .lr-nm{font-size:calc(var(--fs)*1.15)}
.lbl-art .lr.k-row .lr-rk{width:calc(var(--fs)*1.3);height:calc(var(--fs)*1.3);right:calc(var(--av)*.7);bottom:0;font-size:calc(var(--fs)*.72)}
.lbl-art .lr .d1{position:absolute;display:none;pointer-events:none;z-index:0}.lbl-art .lr.r1 .d1{display:block}.lb-nod1 .lr .d1{display:none!important}
.lbl-art .d1 svg{width:100%;height:100%;overflow:visible;display:block}
.lbl-art .d1:has(.d1-back){inset:-38%}.lbl-art .d1:has(.d1-ring){inset:-22%;z-index:3}.lbl-art .d1:has(.d1-top){left:12%;right:12%;top:-62%;height:62%;z-index:4}.lbl-art .d1:has(.d1-side){left:-95%;top:-10%;width:90%;height:110%;z-index:3}
.lbl-art .d1 .d1-flap .wg{transform-box:view-box;transform-origin:8px 55px;animation:lba-wing calc(2.4s / var(--las,1)) ease-in-out infinite}@keyframes lba-wing{50%{transform:rotate(-12deg) scaleY(.92)}}
.lbl-art .d1 .d1-spin{animation:lba-spin calc(14s / var(--las,1)) linear infinite}.lbl-art .d1 .fl{transform-box:fill-box;transform-origin:50% 100%;animation:lba-burn .6s ease-in-out infinite alternate}.lbl-art .d1 .tw{animation:lba-tw 1.6s ease-in-out infinite}.lbl-art .d1 .fk{animation:lba-fk 1.6s steps(2) infinite}
.lbl-art .d1 .pf{transform-box:fill-box;transform-origin:50% 100%;animation:lba-sw 3s ease-in-out infinite}@keyframes lba-sw{50%{rotate:6deg}}.lbl-art .d1 .stm{animation:lba-rise 2.4s ease-out infinite}.lbl-art .d1 .mn{transform-box:fill-box;transform-origin:100% 50%;animation:lba-sw 1.2s ease-in-out infinite}
.lbl-art .d1 .d1-top{animation:lba-crown 2.8s ease-in-out infinite}@keyframes lba-crown{50%{translate:0 -6%}}.lbl-art .d1 .d1-duck{display:block;width:100%;height:100%}.lbl-art .d1 .d1-duck svg{width:100%;height:100%}
.lbl-art .lr.k-row .d1:has(.d1-back),.lbl-art .lr.k-row .d1:has(.d1-ring){inset:-30%}.lbl-art .lr.k-row .d1:has(.d1-side){display:none}
.lbl-art .lr-av .crw{display:none!important}
/* إطارات الصور */
.lbfr-shield .lr-av img{border-radius:0;clip-path:polygon(50% 0,100% 12%,96% 62%,50% 100%,4% 62%,0 12%);box-shadow:none}.lbfr-shield .lr-av::before{content:"";position:absolute;inset:-7%;background:linear-gradient(160deg,#fff,var(--rc) 40%,#0008);clip-path:polygon(50% 0,100% 12%,96% 62%,50% 100%,4% 62%,0 12%);z-index:0}
.lbfr-hex .lr-av img{border-radius:0;clip-path:polygon(25% 3%,75% 3%,100% 50%,75% 97%,25% 97%,0 50%);box-shadow:none}.lbfr-hex .lr-av::before{content:"";position:absolute;inset:-6%;background:var(--rc);clip-path:polygon(25% 3%,75% 3%,100% 50%,75% 97%,25% 97%,0 50%);z-index:0;filter:drop-shadow(0 0 6px var(--rc))}
.lbfr-diamond .lr-av img{border-radius:0;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);box-shadow:none}.lbfr-diamond .lr-av::before{content:"";position:absolute;inset:-9%;background:linear-gradient(135deg,#fff,var(--rc));clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);z-index:0}
.lbfr-crystal .lr-av img{border-radius:0;clip-path:polygon(30% 0,70% 0,100% 30%,100% 70%,70% 100%,30% 100%,0 70%,0 30%);box-shadow:none}.lbfr-crystal .lr-av::before{content:"";position:absolute;inset:-7%;background:linear-gradient(135deg,#ffffffcc,var(--rc),#ffffff66);clip-path:polygon(30% 0,70% 0,100% 30%,100% 70%,70% 100%,30% 100%,0 70%,0 30%);z-index:0}
.lbfr-arch .lr-av img{border-radius:50% 50% 8% 8%/40% 40% 8% 8%;box-shadow:0 0 0 calc(var(--av)*.05) var(--rc),0 0 calc(var(--av)*.25) color-mix(in srgb,var(--rc) 60%,transparent)}
.lbfr-squircle .lr-av img{border-radius:28%}
.lbfr-soft .lr-av img{box-shadow:0 0 calc(var(--av)*.3*var(--glw,1)) color-mix(in srgb,var(--rc) 75%,transparent)}
.lbfr-medal .lr-av img{box-shadow:0 0 0 calc(var(--av)*.06) var(--rc),0 0 0 calc(var(--av)*.1) #0006,0 0 0 calc(var(--av)*.13) var(--rc)}.lbfr-medal .lr-av::after{content:"";position:absolute;left:30%;right:30%;top:-34%;height:40%;z-index:0;background:linear-gradient(90deg,#b91c1c 0 33%,#fff 33% 66%,#1d4ed8 66%);clip-path:polygon(0 0,100% 0,85% 100%,50% 80%,15% 100%)}
.lbfr-planet .lr-av::after{content:"";position:absolute;left:-28%;right:-28%;top:38%;height:24%;border-radius:50%;border:calc(var(--av)*.04) solid color-mix(in srgb,var(--rc) 80%,#fff);transform:rotate(-18deg);z-index:2;clip-path:polygon(0 50%,100% 50%,100% 100%,0 100%)}
.lbfr-moon .lr-av::after{content:"";position:absolute;inset:0;border-radius:50%;z-index:2;background:radial-gradient(circle at var(--mx,140%) 50%,transparent 49%,#0b1020d0 51%)}.lbfr-moon .r1{--mx:300%}.lbfr-moon .r2{--mx:-60%}.lbfr-moon .r3{--mx:160%}.lbfr-moon .r4{--mx:-30%}.lbfr-moon .r5{--mx:120%}
.lbfr-none .lr-av{display:none}.lbfr-none .lr.k-tok .lr-nm{top:calc(var(--av)*.3)}.lbfr-none .lr.k-tok .lr-vl{top:calc(var(--av)*.3 + var(--fs)*1.45)}.lbfr-none .lr.k-row .lr-nm{right:calc(var(--fs)*2.2)}.lbfr-none .lr.k-row .lr-rk{right:0;bottom:auto;top:calc(50% - var(--fs)*.65)}
/* أرقام المراكز */
.lbrk-circle .lr-rk{border-radius:50%;background:var(--rc);color:#111!important;text-shadow:none}
.lbrk-diamond .lr-rk{background:linear-gradient(135deg,#fff,var(--rc));clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);color:#111!important;text-shadow:none}
.lbrk-shield .lr-rk{background:var(--rc);clip-path:polygon(50% 0,100% 15%,92% 70%,50% 100%,8% 70%,0 15%);color:#111!important;text-shadow:none}
.lbrk-ribbon .lr-rk{background:var(--rc);clip-path:polygon(0 0,100% 0,100% 100%,50% 78%,0 100%);color:#111!important;text-shadow:none;border-radius:0}
.lbrk-hex .lr-rk{background:#0b1020;border:0;clip-path:polygon(25% 3%,75% 3%,100% 50%,75% 97%,25% 97%,0 50%);color:var(--rc)!important;box-shadow:inset 0 0 0 2px var(--rc)}
.lbrk-big .lr-rk{background:none!important;color:var(--rc)!important;font-size:calc(var(--fs)*1.25)!important;text-shadow:0 0 8px color-mix(in srgb,var(--rc) 70%,transparent),0 2px 4px #000c}
.lbrk-none .lr-rk,.lb-norank .lr-rk{display:none!important}
/* شكل الاسم */
.lbnm-capsule .lr-nm{background:#000a;border-radius:99px;padding:0 .55em;max-width:max-content;margin:auto;border:1px solid color-mix(in srgb,var(--rc) 60%,transparent)}
.lbnm-ribbon .lr-nm{background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--rc) 55%,transparent),transparent);padding:0 .8em}
.lbnm-line .lr-nm{border-bottom:2px solid #f6c94a;padding-bottom:.05em;max-width:max-content;margin:auto}
.lbnm-glass .lr-nm{background:#ffffff1f;backdrop-filter:blur(6px);border:1px solid #ffffff3a;border-radius:.4em;padding:0 .45em;max-width:max-content;margin:auto}
.lbnm-plate .lr-nm{background:linear-gradient(180deg,#151520e8,#05050ae8);border:1px solid var(--rc);border-radius:.3em;padding:0 .45em;max-width:max-content;margin:auto}
.lbnm-carbon .lr-nm{background:repeating-linear-gradient(45deg,#111 0 3px,#1f1f1f 3px 6px);border-inline-start:3px solid var(--rc);padding:0 .45em}
.lbl-art .lr.k-row .lr-nm{margin:0!important}
.lbl-art .lr-nm{color:var(--nmc,#fff)}.lbl-art .lr-vl{color:var(--vlc2,var(--tx2,#fff))}
/* حركات المتصدر */
.lbl-art .lr.r1 .lr-av img{animation:lba-glow calc(2.4s / var(--las,1)) ease-in-out infinite}@keyframes lba-glow{50%{filter:drop-shadow(0 0 calc(var(--av)*.12*var(--glw,1)) var(--rc))}}
.lbl-art.lb-shine .lr-nm{background-image:linear-gradient(100deg,#ffffffb0 40%,#fff 50%,#ffffffb0 60%);background-size:300% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:lba-shine calc(4s / var(--las,1)) linear infinite}@keyframes lba-shine{from{background-position:120% 0}to{background-position:-120% 0}}
.lba-rotate .lr{opacity:0;transition:opacity .6s,transform .6s}.lba-rotate .lr.cur{opacity:1}
.lba-float .lr-nm,.lba-float .lr-vl,.lba-text .lr-nm,.lba-text .lr-vl{text-shadow:0 2px 6px #000,0 0 2px #000}
.lbl-art .lr.newtop .lr-av{animation:lb-newtop 1.2s cubic-bezier(.2,.8,.2,1)}
.lb-cel{position:absolute;pointer-events:none;z-index:9;width:calc(var(--W0)*1px*.06);height:calc(var(--W0)*1px*.06)}.lb-cel svg{width:100%;height:100%;overflow:visible}
.lb-celbig{position:absolute;pointer-events:none;z-index:9}.lb-celbig svg{width:100%;height:100%;overflow:visible}
`;
/** احتفال الوصول للمركز الأول (15 نوعاً) حول صورة المتصدر */
export function lbCelebrateArt(host,kind,cx,cy,av){ const add=(html,cls,x,y,sz)=>{ const e=document.createElement("i"); e.className=cls; e.style.left=(x-sz/2)+"px"; e.style.top=(y-sz/2)+"px"; e.style.width=e.style.height=sz+"px"; e.innerHTML=html; host.appendChild(e); return e };
 const burst=(glyph,cols,n,dist,dur,fall)=>{ for(let i=0;i<n;i++){ const a=Math.PI*2*i/n+Math.random()*.4, r=dist*(.7+Math.random()*.6), e=add(LBA_G[glyph](cols[i%cols.length]),"lb-cel",cx,cy,av*.32);
   e.animate([{transform:"translate(0,0) scale(.3)",opacity:0},{opacity:1,offset:.15},{transform:`translate(${Math.cos(a)*r}px,${Math.sin(a)*r+(fall?r*.8:0)}px) scale(1) rotate(${Math.random()*360}deg)`,opacity:0}],{duration:dur,easing:"cubic-bezier(.2,.8,.3,1)"}).onfinish=()=>e.remove() } };
 const big=(svg,anim,scale=2.2,dur=1600)=>{ const e=add(svg,"lb-celbig",cx,cy,av*scale); e.animate(anim,{duration:dur,easing:"cubic-bezier(.2,.8,.2,1)"}).onfinish=()=>e.remove() };
 switch(kind){
  case "crown": big(D1.crown,[{transform:"translateY(-120%) scale(.6)",opacity:0},{transform:"translateY(-55%) scale(1)",opacity:1,offset:.6},{transform:"translateY(-55%)",opacity:0}],1.1); burst("spark",["#fde68a","#fff"],10,av*1.1,1000); break;
  case "wings": big(D1.wings,[{transform:"scaleX(0)",opacity:0},{transform:"scaleX(1)",opacity:1,offset:.5},{transform:"scaleX(1.1)",opacity:0}],2.6); break;
  case "stars": burst("star",["#fde68a","#fff","#bae6fd"],16,av*1.6,1300); break;
  case "butterflies": burst("butterfly",["#ff9ad0","#c084fc","#7dd3fc","#fde68a"],9,av*1.8,2200); break;
  case "diamonds": for(let i=0;i<10;i++){ const a=Math.PI*2*i/10, r=av*1.6, e=add(LBA_G.diamond(["#9fe3ff","#e0f2fe"][i%2]),"lb-cel",cx,cy,av*.3); e.animate([{transform:`translate(${Math.cos(a)*r}px,${Math.sin(a)*r}px) scale(1)`,opacity:0},{opacity:1,offset:.3},{transform:"translate(0,0) scale(.2)",opacity:0}],{duration:1200,easing:"ease-in"}).onfinish=()=>e.remove() } break;
  case "falcon": big(D1.falcon,[{transform:"translateY(40%) scale(.4)",opacity:0},{transform:"scale(1)",opacity:1,offset:.5},{transform:"translateY(-30%) scale(1.15)",opacity:0}],2.6,1800); break;
  case "lion": big(D1.lion,[{transform:"scale(.3) rotate(-30deg)",opacity:0},{transform:"scale(1)",opacity:1,offset:.5},{transform:"scale(1.2)",opacity:0}],2.2); break;
  case "coins": for(let i=0;i<14;i++){ const e=add(LBA_G.coin(),"lb-cel",cx+(Math.random()-.5)*av*3,cy-av*1.6,av*.28); e.animate([{transform:"translateY(0) rotateY(0)",opacity:0},{opacity:1,offset:.1},{transform:`translateY(${av*2.6}px) rotateY(720deg)`,opacity:0}],{duration:1200+Math.random()*600,delay:Math.random()*400,easing:"cubic-bezier(.5,0,.8,.6)",fill:"backwards"}).onfinish=()=>e.remove() } break;
  case "firering": big(D1.firering,[{transform:"scale(.2)",opacity:0},{transform:"scale(1)",opacity:1,offset:.4},{transform:"scale(1.3)",opacity:0}],2.1); break;
  case "halo": big(`<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="none" stroke="#fde68a" stroke-width="5"/><circle cx="50" cy="50" r="36" fill="none" stroke="#fff" stroke-width="2" opacity=".7"/></svg>`,[{transform:"scale(.4)",opacity:0},{transform:"scale(1)",opacity:1,offset:.4},{transform:"scale(1.6)",opacity:0}],1.6); break;
  case "hearts": burst("heart",["#ff5f8f","#ff9ad0","#fff"],12,av*1.5,1600,true); break;
  case "petals": for(let i=0;i<16;i++){ const e=add(LBA_G.petal(["#ffb3d1","#ff8fb8"][i%2]),"lb-cel",cx+(Math.random()-.5)*av*3,cy-av*1.4,av*.24); e.animate([{transform:"translate(0,0) rotate(0)",opacity:0},{opacity:1,offset:.15},{transform:`translate(${(Math.random()-.5)*av}px,${av*2.4}px) rotate(300deg)`,opacity:0}],{duration:1800,delay:Math.random()*500,fill:"backwards"}).onfinish=()=>e.remove() } break;
  case "lightning": for(let i=0;i<6;i++){ const a=Math.PI*2*i/6, e=add(LBA_G.bolt("#7dd3fc"),"lb-cel",cx+Math.cos(a)*av*.9,cy+Math.sin(a)*av*.9,av*.45); e.animate([{opacity:0},{opacity:1,offset:.1},{opacity:.1,offset:.2},{opacity:1,offset:.3},{opacity:0}],{duration:900,delay:i*80,fill:"backwards"}).onfinish=()=>e.remove() } break;
  case "planets": burst("planet",["#fbbf24","#a5b4fc","#f472b6","#7dd3fc"],8,av*1.7,1800); break;
  default: burst("confetti",["#f43f5e","#3b82f6","#22c55e","#f59e0b","#a855f7"],18,av*1.8,1500,true);
 } }
