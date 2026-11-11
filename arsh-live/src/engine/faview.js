// ====== استوديو تنبيهات المتابعين V2: 10 نسخ لبطة بطوط + 80 تصميماً + 30 حركة دخول + 20 خروج + طابور بلا تداخل ======
import { View } from "./view.js";
import { esc, avatar } from "./defs.js";
import { LE_DESIGNS, LE_PALETTES, leDesignOf, ensureLeCSS } from "./leview.js";
import { FA_CHARS, DUCK_VARIANTS, FA_CHAR_CSS, duckSVG } from "./fachars.js";

export const FA_GROUPS={duck:"بطة بطوط الحصرية",royal:"الملكية",hearts:"القلوب والغيوم",gaming:"الألعاب والنيون",saudi:"السعودية",mascots:"الشخصيات والأفاتارات",crystal:"الزجاج والكريستال",cinema:"السينمائية",mini:"الصغيرة والشفافة"};
// كل مجموعة من الثمانين تستخدم عمل فني فريد من مكتبة آخر التفاعلات (80 رسمة مختلفة — لا تكرار)
const FA_ART_GROUP={royal:"royal",hearts:"nature",gaming:"gaming",saudi:"saudi",mascots:"space",crystal:"crystal",cinema:"fire",mini:"b6o6"};
const N={royal:["Royal Golden Crown","Diamond King","Golden Throne","Luxury Black Gold","Silver Royal","Royal Wings","Platinum Welcome","Golden Sparkle","Royal Medal","B6O6 Royal Follow"],
 hearts:["Pink Cloud","Crystal Heart","Floating Hearts","Angel Wings","Pink Halo","Love Bubble","Rose Bloom","Dream Cloud","Heart Explosion","White Angel Follow"],
 gaming:["Gaming HUD","Cyber Neon","RGB Gamer","Level Up Follow","XP Welcome","Hologram Follow","Electric Pulse","Neon Portal","Digital Glitch","B6O6 Esports Follow"],
 saudi:["Saudi Palm","Golden Dallah","Saudi Falcon","Najdi Welcome","Desert Gold","Saudi Crown","Arabic Lantern","Saudi Coffee","Diriyah Style","B6O6 Saudi Welcome"],
 mascots:["Dancing Duck","Royal Duck","Gaming Duck","Robot Welcome","Cute Cat","Mini Dragon","Floating Ghost","Pixel Character","Space Astronaut","B6O6 Signature Mascot"],
 crystal:["Liquid Glass","Crystal Bubble","Diamond Frame","Ice Glass","Mirror Chrome","Floating Crystal","Holographic Glass","Pearl White","Glass Wings","B6O6 Crystal Follow"],
 cinema:["Cinematic Light","Golden Reveal","Smoke Reveal","Magic Portal","Starfall","Lightning Reveal","Fire Reveal","Space Warp","Premium Spotlight","Ultimate Follow Reveal"],
 mini:["Mini Glass Follow","Mini Neon Follow","Mini Royal Follow","Mini Heart Follow","Mini Crystal Follow","Mini Floating Follow","Mini Gaming Follow","Mini Saudi Follow","Mini Avatar Follow","B6O6 Ultimate Mini Follow"]};
const SKIN={royal:"gold",hearts:"pink",gaming:"neon",saudi:"saudi",mascots:"glass",crystal:"crystal",cinema:"dark",mini:"clear"};
const MASCOT_CHAR=["duck:dancing","duck:royal","duck:gaming","robot","cat","dragon","ghost","pixel","astro","duck:legendary"];
const GROUP_ENTER={royal:"crownDrop",hearts:"heartBurst",gaming:"neonTrace",saudi:"goldenReveal",mascots:"floatUp",crystal:"crystalAssemble",cinema:"lightSweep",mini:"slideRight"};
const GROUP_EXIT={royal:"goldenDust",hearts:"heartDissolve",gaming:"neonFade",saudi:"fadeOut",mascots:"floatAway",crystal:"crystalShatter",cinema:"portalClose",mini:"slideRight"};
export const FA_DESIGNS=[];
const DUCKS=[["classic","Classic B6O6 Duck","البطة الكلاسيكية","clear","duckJump"],["royal","Royal Duck","البطة بالتاج الذهبي","gold","crownDrop"],["gaming","Gaming Duck","البطة بسماعة الألعاب","neon","pixelBuild"],["neon","Neon Duck","البطة بإضاءة نيون","neon","neonTrace"],["diamond","Diamond Duck","البطة بإطار ألماسي","crystal","diamondReveal"],["saudi","Saudi Duck","البطة بلمسات سعودية","saudi","goldenReveal"],["mini","Mini Duck","بطة صغيرة للبث العمودي","clear","smoothZoom"],["dancing","Dancing Duck","البطة ترقص عند المتابعة","pink","heartBurst"],["flying","Flying Duck","البطة تدخل بطيران قصير","glass","rocketLanding"],["legendary","Legendary Duck","دخولية أسطورية بهالة ذهبية","gold","ultimate"]];
DUCKS.forEach(([v,name,ar,skin,en],i)=>FA_DESIGNS.push({id:"duck_"+v,n:i+1,grp:"duck",name,ar,art:"",skin,char:"duck",duck:v,act:v==="dancing"?"dance":v==="flying"?"fly":"wave",enter:en,exit:v==="flying"?"floatAway":"b6o6Exit",charScale:v==="mini"?.6:1}));
let n=11; for(const g of Object.keys(N)){ const arts=LE_DESIGNS.filter(d=>d.cat===FA_ART_GROUP[g]).map(d=>d.id);
 N[g].forEach((name,i)=>{ const mc=g==="mascots"?MASCOT_CHAR[i]:""; FA_DESIGNS.push({id:"fa_"+g+"_"+(i+1),n:n++,grp:g,name,ar:FA_GROUPS[g],art:arts[i]||"",skin:SKIN[g],char:mc.split(":")[0]||"",duck:mc.split(":")[1]||"",act:mc==="duck:dancing"?"dance":"wave",enter:GROUP_ENTER[g],exit:GROUP_EXIT[g],mini:g==="mini"}) }) }
export const faDesignOf=id=>FA_DESIGNS.find(d=>d.id===id)||FA_DESIGNS[0];

// ---------- 30 حركة دخول و20 خروج (Web Animations) ----------
const o0={opacity:0}, o1={opacity:1};
export const FA_ENTER={
 slideRight:["دخول من اليمين",[{...o0,transform:"translateX(60%)"},{...o1,transform:"none"}]],slideLeft:["دخول من اليسار",[{...o0,transform:"translateX(-60%)"},{...o1,transform:"none"}]],
 slideTop:["من الأعلى",[{...o0,transform:"translateY(-60%)"},{...o1,transform:"none"}]],slideBottom:["من الأسفل",[{...o0,transform:"translateY(60%)"},{...o1,transform:"none"}]],
 smoothZoom:["تكبير ناعم",[{...o0,transform:"scale(.6)"},{...o1,transform:"none"}]],softFade:["تلاشي ناعم",[o0,o1]],
 heartBurst:["انفجار قلب",[{...o0,transform:"scale(.2)"},{opacity:1,transform:"scale(1.15)",offset:.6},{...o1,transform:"none"}]],
 goldenReveal:["كشف ذهبي",[{...o0,filter:"brightness(3) sepia(1)",clipPath:"inset(0 50% 0 50%)"},{...o1,filter:"none",clipPath:"inset(0 0 0 0)"}]],
 diamondReveal:["كشف ماسي",[{...o0,clipPath:"polygon(50% 50%,50% 50%,50% 50%,50% 50%)"},{...o1,clipPath:"polygon(50% -60%,160% 50%,50% 160%,-60% 50%)"}]],
 cloudPop:["فقاعة غيمة",[{...o0,transform:"scale(.4,.2)"},{opacity:1,transform:"scale(1.08,.95)",offset:.6},{...o1,transform:"none"}]],
 glassReveal:["كشف زجاجي",[{...o0,filter:"blur(12px)",transform:"scale(1.1)"},{...o1,filter:"none",transform:"none"}]],
 neonTrace:["تتبع نيون",[{opacity:0,filter:"brightness(4)"},{opacity:1,offset:.2},{opacity:.3,offset:.35},{opacity:1,filter:"none"}]],
 portalOpen:["فتح بوابة",[{...o0,clipPath:"circle(0% at 50% 50%)",transform:"rotate(-30deg)"},{...o1,clipPath:"circle(75% at 50% 50%)",transform:"none"}]],
 wingsOpen:["انفتاح أجنحة",[{...o0,transform:"scaleX(0)"},{...o1,transform:"none"}]],crownDrop:["سقوط التاج",[{...o0,transform:"translateY(-80%) rotate(-8deg)"},{opacity:1,transform:"translateY(6%)",offset:.7},{...o1,transform:"none"}]],
 floatUp:["طفو للأعلى",[{...o0,transform:"translateY(30%)"},{...o1,transform:"none"}]],lightSweep:["مسح ضوئي",[{...o0,clipPath:"inset(0 100% 0 0)"},{...o1,clipPath:"inset(0 0 0 0)"}]],
 pixelBuild:["بناء بكسل",[{opacity:0,filter:"blur(6px) contrast(3)"},{opacity:1,filter:"none"}]],hologram:["تجسّد هولوغرام",[{opacity:0,transform:"scaleY(.02)",filter:"hue-rotate(90deg) brightness(2)"},{opacity:.7,transform:"scaleY(1)",offset:.5},{opacity:1,filter:"none"}]],
 crystalAssemble:["تجمّع كريستال",[{...o0,transform:"scale(1.4) rotate(12deg)",filter:"blur(4px)"},{...o1,transform:"none",filter:"none"}]],starfall:["تساقط نجوم",[{...o0,transform:"translate(30%,-60%) rotate(20deg)"},{...o1,transform:"none"}]],
 magicSparkle:["بريق سحري",[{opacity:0,filter:"brightness(3) saturate(0)"},{opacity:1,filter:"none"}]],robotEntrance:["دخول روبوت",[{...o0,transform:"translateX(40%)"},{opacity:1,transform:"translateX(-4%)",offset:.5},{opacity:1,transform:"translateX(2%)",offset:.75},{...o1,transform:"none"}]],
 duckJump:["قفزة البطة",[{...o0,transform:"translateY(40%) scale(.9)"},{opacity:1,transform:"translateY(-12%)",offset:.55},{...o1,transform:"none"}]],rocketLanding:["هبوط صاروخ",[{...o0,transform:"translateY(-120%)"},{opacity:1,transform:"translateY(5%)",offset:.8},{...o1,transform:"none"}]],
 liquidMorph:["تشكّل سائل",[{...o0,borderRadius:"50%",transform:"scale(.3)"},{...o1,transform:"none"}]],circularReveal:["كشف دائري",[{clipPath:"circle(0% at 50% 50%)"},{clipPath:"circle(80% at 50% 50%)"}]],
 premiumFlip:["قلب فاخر",[{...o0,transform:"perspective(600px) rotateY(90deg)"},{...o1,transform:"none"}]],b6o6Entrance:["دخول B6O6 الحصري",[{...o0,transform:"scale(.5) rotate(-6deg)",filter:"hue-rotate(60deg)"},{opacity:1,transform:"scale(1.06)",offset:.65},{...o1,transform:"none",filter:"none"}]],
 ultimate:["الدخول السينمائي الأسطوري",[{...o0,transform:"scale(2)",filter:"blur(10px) brightness(3)"},{opacity:1,transform:"scale(.96)",filter:"none",offset:.7},{...o1,transform:"none"}]]};
export const FA_EXIT={fadeOut:["تلاشي",[o1,o0]],slideRight:["إلى اليمين",[o1,{...o0,transform:"translateX(60%)"}]],slideLeft:["إلى اليسار",[o1,{...o0,transform:"translateX(-60%)"}]],slideUp:["للأعلى",[o1,{...o0,transform:"translateY(-60%)"}]],slideDown:["للأسفل",[o1,{...o0,transform:"translateY(60%)"}]],
 zoomOut:["تصغير",[o1,{...o0,transform:"scale(.5)"}]],heartDissolve:["ذوبان قلب",[o1,{...o0,transform:"scale(1.3)",filter:"blur(8px) saturate(2)"}]],crystalShatter:["تحطم كريستال",[o1,{opacity:.6,transform:"scale(1.05) rotate(2deg)",offset:.3},{...o0,transform:"scale(1.25) rotate(-6deg)",filter:"blur(6px)"}]],
 cloudDisappear:["اختفاء الغيمة",[o1,{...o0,filter:"blur(14px)",transform:"scale(1.15,.8)"}]],portalClose:["إغلاق البوابة",[{clipPath:"circle(80% at 50% 50%)"},{clipPath:"circle(0% at 50% 50%)",transform:"rotate(30deg)"}]],
 neonFade:["خفوت نيون",[o1,{opacity:.2,offset:.2},{opacity:.8,offset:.35},o0]],goldenDust:["غبار ذهبي",[o1,{...o0,filter:"sepia(1) brightness(2) blur(6px)",transform:"translateY(-10%)"}]],
 glassDissolve:["ذوبان زجاجي",[o1,{...o0,filter:"blur(12px)"}]],pixelDisappear:["اختفاء بكسل",[o1,{...o0,filter:"blur(5px) contrast(3)"}]],wingsClose:["انغلاق الأجنحة",[o1,{...o0,transform:"scaleX(0)"}]],
 floatAway:["طفو بعيداً",[o1,{...o0,transform:"translateY(-40%)"}]],lightSweepExit:["مسح ضوئي",[{clipPath:"inset(0 0 0 0)"},{clipPath:"inset(0 0 0 100%)"}]],miniSpin:["دوران صغير",[o1,{...o0,transform:"rotate(180deg) scale(.3)"}]],
 softBlur:["تمويه ناعم",[o1,{...o0,filter:"blur(8px)"}]],b6o6Exit:["خروج B6O6",[o1,{opacity:1,transform:"scale(1.05)",offset:.3},{...o0,transform:"scale(.4) rotate(6deg)",filter:"hue-rotate(60deg)"}]]};

export const FA_MSGS=["❤️ شكراً على الفولو يا {username}","👑 نورتنا يا {username}","🔥 يا هلا والله بـ {username}","💎 أسطورة جديدة انضمت لنا!","🦆 بطة بطوط ترحب فيك يا {username}"];
export function faFill(t,v){ return String(t||"").replace(/\{(username|display_name|platform|follower_count|stream_name)\}/g,(_,k)=>v[k]!=null&&v[k]!==""?String(v[k]):"") }
export function faDefaults(){ return {design:"duck_classic",char:"",duck:"",act:"",side:"right",charScale:1,msgs:FA_MSGS.slice(0,1).join("\n"),msgRandom:false,sub:"نورتنا يا أسطورة 👑",showSub:true,showAv:true,
 enter:"",exit:"",enterMs:700,holdMs:3700,exitMs:600,avScale:1,nameScale:1,frameColor:"",bgMode:"premium",qMax:30,mergeAt:6,sound:"",soundVol:.8,customChar:"",streamName:"",reduceFx:false,w:.5,h:.34} }

/** طابور التنبيهات (نقي — يُختبر بدون متصفح): منع التكرار، حد الانتظار، دمج المتابعات */
export function faQueuePush(Q,ev,o){ Q.seen=Q.seen||[]; Q.q=Q.q||[]; if(!ev||!ev.id||Q.seen.includes(ev.id)) return "dup"; Q.seen.push(ev.id); if(Q.seen.length>300) Q.seen.splice(0,100);
 const merge=Math.max(0,+o.mergeAt||0), max=Math.max(1,+o.qMax||30);
 if(merge&&Q.q.length>=merge){ const last=Q.q[Q.q.length-1]; if(last.merged){ last.count++; last.names.push(ev.name) } else { const m=Q.q.splice(merge-1); Q.q.push({id:"m"+ev.id,merged:true,count:m.length+1,names:[...m.map(x=>x.name),ev.name],test:ev.test&&m.every(x=>x.test)}) } return "merged" }
 if(Q.q.length>=max) return "full"; Q.q.push(ev); return "queued" }

const SKIN_CSS={clear:"background:none;border:0;box-shadow:none",glass:"background:linear-gradient(135deg,#ffffff2e,#ffffff0a);border:1px solid #ffffff55;backdrop-filter:blur(10px)",gold:"background:linear-gradient(180deg,#2a1d06f0,#120c02f0);border:2px solid var(--fc,#f6c94a);box-shadow:0 0 18px #f6c94a55",
 neon:"background:#05010de6;border:2px solid var(--fc,#22e1ff);box-shadow:0 0 14px var(--fc,#22e1ff),inset 0 0 10px var(--fc,#22e1ff)",crystal:"background:linear-gradient(160deg,#e0f2fe33,#0c4a6ecc);border:1px solid var(--fc,#bae6fd)",
 saudi:"background:linear-gradient(180deg,#005430f0,#002818f0);border:2px solid var(--fc,#c9a227)",pink:"background:linear-gradient(180deg,#ffd1e3e6,#ff9ad0d9);border:1px solid var(--fc,#fff);color:#5a0f33",dark:"background:#07070bea;border:1px solid var(--fc,#3f3f46)",
 hud:"background:#020c18e6;border:1px solid var(--fc,#22d3ee)",b6o6:"background:linear-gradient(180deg,#0b1220f0,#020617f0);border:1px solid var(--fc,#2f7bff)"};
const FA_CSS=`
.faw{background:none!important;direction:rtl;font-family:"Readex Pro","Changa",sans-serif;color:#fff;overflow:visible;--fu:calc(var(--FH)/10)}
.faw .fa-root{position:absolute;inset:0;display:flex;align-items:flex-end;justify-content:center;gap:calc(var(--fu)*.4)}
.faw.fa-side-left .fa-root{flex-direction:row-reverse}.faw .fa-char{position:relative;flex:none}
.faw .fa-card{position:relative;display:flex;align-items:center;gap:calc(var(--fu)*.5);padding:calc(var(--fu)*.5) calc(var(--fu)*.8);border-radius:calc(var(--fu)*.9);max-width:calc(100% - var(--fu)*3.6);margin-bottom:calc(var(--fu)*.6);overflow:hidden}
.faw .fa-stage{position:relative;width:calc(var(--fu)*4.2*var(--avs,1));height:calc(var(--fu)*4.2*var(--avs,1));flex:none}
.faw .fa-stage .le-back,.faw .fa-stage .le-front{position:absolute;inset:0}.faw .fa-stage svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.faw .fa-av{position:absolute;inset:25%;border-radius:50%;object-fit:cover;box-shadow:0 0 0 3px var(--fc,var(--c1,#3ba8ff)),0 0 16px var(--fc,var(--c1,#3ba8ff));z-index:1}
.faw.fa-noart .fa-stage{width:calc(var(--fu)*2.6*var(--avs,1));height:calc(var(--fu)*2.6*var(--avs,1))}.faw.fa-noart .fa-av{inset:4%}
.faw .fa-tx{display:flex;flex-direction:column;gap:calc(var(--fu)*.12);min-width:0}
.faw .fa-l1{font-weight:900;font-size:calc(var(--fu)*.82*var(--nms,1));line-height:1.3;text-shadow:0 2px 8px #000a;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow-wrap:anywhere}
.faw .fa-l2{font-size:calc(var(--fu)*.62*var(--nms,1));opacity:.9;text-shadow:0 2px 6px #000a}
.faw .fa-shine{position:absolute;inset:0;pointer-events:none;background:linear-gradient(100deg,transparent 35%,#ffffffa0 50%,transparent 65%);transform:translateX(120%)}
.faw .fa-shine.go{animation:fa-sh calc(1.1s/var(--as,1)) ease-in-out}@keyframes fa-sh{to{transform:translateX(-120%)}}
.faw .fa-card.pulse{animation:fa-pl .6s ease}@keyframes fa-pl{40%{transform:scale(1.04)}}
.faw .fa-av.zoom{animation:fa-zm .6s cubic-bezier(.2,1.4,.4,1)}@keyframes fa-zm{from{transform:scale(0)}}
.faw .fa-l1.type{animation:fa-ty calc(.6s/var(--as,1)) steps(18) both}@keyframes fa-ty{from{clip-path:inset(0 0 0 100%)}}
.faw .fa-stars i{position:absolute;width:12%;height:12%;background:radial-gradient(circle,#fff 0 20%,transparent 60%);animation:lk-pulse 1s ease-in-out infinite;z-index:2}
.faw.fa-mini .fa-card{padding:calc(var(--fu)*.25) calc(var(--fu)*.5);gap:calc(var(--fu)*.3)}.faw.fa-mini .fa-stage{width:calc(var(--fu)*2.4);height:calc(var(--fu)*2.4)}.faw.fa-mini .fa-l1{font-size:calc(var(--fu)*.7)}.faw.fa-mini .fa-l2{display:none}
.faw .fa-tag{position:absolute;top:2px;left:6px;font-size:calc(var(--fu)*.35);background:#f59e0b;color:#111;border-radius:6px;padding:0 .4em}
${Object.entries(SKIN_CSS).map(([k,v])=>`.faw .fa-card.sk-${k}{${v}}`).join("")}
.faw.fa-bgclear .fa-card{background:none!important;border:0!important;box-shadow:none!important;backdrop-filter:none!important}
`+FA_CHAR_CSS;
let faCss=false; function ensureFaCSS(){ if(faCss||typeof document==="undefined") return; faCss=true; const s=document.createElement("style"); s.id="b6o6-fa"; s.textContent=FA_CSS; document.head.appendChild(s) }
const faReduced=()=>{ try{ return matchMedia("(prefers-reduced-motion: reduce)").matches }catch(e){ return false } };
const wait=ms=>new Promise(r=>setTimeout(r,ms));

Object.assign(View.prototype,{
 applyFa(w,W,Hh){ ensureLeCSS(); ensureFaCSS(); const e=this.el, d=faDesignOf(w.design), ed=this.opts.editor;
  e.className=`wd faw fa-side-${w.side||"right"}${d.art?"":" fa-noart"}${d.mini?" fa-mini":""}${w.bgMode==="clear"?" fa-bgclear":""}${w.reduceFx||faReduced()?" fa-still":""}${ed?(" "+(w.locked?"locked":"")+(w.visible?"":" hid")+(this.opts.sel===w.id?" sel":"")):""}`;
  const S=e.style; S.setProperty("--FH",Math.min(Hh,W*.6)+"px"); S.setProperty("--as",String(w.animSpeed||1)); S.setProperty("--avs",String(w.avScale||1)); S.setProperty("--nms",String(w.nameScale||1)); S.setProperty("--cs",String((w.charScale||1)*(d.charScale||1)));
  if(w.frameColor) S.setProperty("--fc",w.frameColor); else S.removeProperty("--fc");
  const P=d.art?{...LE_PALETTES[leDesignOf(d.art).pal]||LE_PALETTES.gold}:LE_PALETTES.blue; for(const k of ["c1","c2","cn","ct","cp","csh","cbg"]) S.setProperty("--"+k,P[k]); S.setProperty("--S",(Math.min(Hh,W*.6)*.42)+"px"); S.setProperty("--u",(Math.min(Hh,W*.6)*.042)+"px"); S.setProperty("--gl","1");
  if(!this.fa){ this.fa={Q:{},busy:false}; e.innerHTML=ed?'<div class="rh"></div><div class="lockb">🔒</div>':"" }
  if(ed&&!this.fa.busy&&!e.querySelector(".fa-root")) this.faRender({name:"اسم المتابع",av:"",sample:true},true);
 },
 /** الشخصية: من التصميم أو اختيار المستخدم، أو ملف مرفوع (GIF/WebP/WebM/PNG) */
 faCharHTML(d){ const w=this.w, c=w.char||d.char; if(w.customChar){ const u=esc(w.customChar); return /^data:video\//.test(w.customChar)?`<video src="${u}" autoplay loop muted playsinline></video>`:`<img src="${u}" alt="">` }
  if(!c||c==="none"||!FA_CHARS[c]) return ""; return c==="duck"?duckSVG(DUCK_VARIANTS[w.duck||d.duck||"classic"]||{}):FA_CHARS[c][1]() },
 faRender(it,still){ const w=this.w, d=faDesignOf(w.design), A=d.art?leDesignOf(d.art):null, ch=this.faCharHTML(d), src=this.opts.data?this.opts.data():{};
  const vars={username:it.name,display_name:it.name,platform:"TikTok",follower_count:(src.C&&src.C.followers&&src.C.followers.tiktok&&src.C.followers.tiktok.value)||"",stream_name:w.streamName||""};
  const msgs=String(w.msgs||FA_MSGS[0]).split("\n").map(s=>s.trim()).filter(Boolean), tpl=it.merged?`❤️ شكراً لـ ${it.count} متابعاً جديداً!`:msgs[w.msgRandom?Math.floor(Math.random()*msgs.length):0]||FA_MSGS[0];
  const pic=it.av||avatar(it.name||"?"), art=A?`<div class="le-back led-${A.id}">${A.back?A.back(w):""}</div>`:"", front=A?`<div class="le-front led-${A.id}">${A.front?A.front(w):""}</div>`:"";
  this.el.querySelectorAll(".fa-root").forEach(x=>x.remove());
  const r=document.createElement("div"); r.className="fa-root"; r.innerHTML=`${ch?`<div class="fa-char">${ch}</div>`:""}<div class="fa-card sk-${d.skin} led-${A?A.id:"none"}">${w.showAv!==false?`<div class="fa-stage">${art}<img class="fa-av" src="${esc(pic)}" alt="">${front}<div class="fa-stars">${[[8,10],[80,14],[86,76]].map(([x,y],i)=>`<i style="left:${x}%;top:${y}%;animation-delay:${i*.3}s"></i>`).join("")}</div></div>`:""}
   <div class="fa-tx"><b class="fa-l1"></b>${w.showSub!==false&&!it.merged?`<span class="fa-l2">${esc(w.sub??"نورتنا يا أسطورة 👑")}</span>`:""}</div><i class="fa-shine"></i>${it.test?'<span class="fa-tag">تجريبي</span>':""}</div>`;
  r.querySelector(".fa-l1").textContent=faFill(tpl,vars); this.el.prepend(r); return r },
 /** حدث متابعة حقيقي/تجريبي: يدخل الطابور ولا يتداخل */
 faPush(ev){ if(!ev||ev.type!=="follow") return; const u=ev.user||{}; const it={id:String(ev.id||"f"+Date.now()),name:String(u.name||u.nick||u.id||"متابع").slice(0,40),av:u.avatar||"",test:!!ev.test};
  if(!this.fa) this.fa={Q:{},busy:false}; faQueuePush(this.fa.Q,it,this.w); this.faNext() },
 async faNext(){ const F=this.fa; if(F.busy) return; const it=F.Q.q&&F.Q.q.shift(); if(!it) return; F.busy=true; try{ await this.faPlay(it) }catch(e){} F.busy=false; if(F.Q.q&&F.Q.q.length) setTimeout(()=>this.faNext(),250) },
 /** التسلسل: دخول الشخصية ← تلويح + تكبير الصورة ← الاسم واللمعة ← البقاء ← تلويح أخير ← خروج ← شفاف بالكامل */
 async faPlay(it){ const w=this.w, d=faDesignOf(w.design), still=this.el.classList.contains("fa-still"), sp=w.animSpeed||1;
  const enMs=Math.max(200,+w.enterMs||700)/sp, hold=Math.max(1200,+w.holdMs||3700), exMs=Math.max(200,+w.exitMs||600)/sp;
  const r=this.faRender(it,false), card=r.querySelector(".fa-card"), ch=r.querySelector(".fa-char"), av=r.querySelector(".fa-av"), l1=r.querySelector(".fa-l1"), sh=r.querySelector(".fa-shine");
  this.faSound(it);
  const side=(w.side||"right")==="right"?1:-1, act=w.act||d.act||"wave";
  if(ch){ ch.classList.add("fa-walk"); if(!still) await ch.animate([{transform:`translateX(${side*160}%)`},{transform:"none"}],{duration:enMs*1.4,easing:"ease-out",fill:"both"}).finished.catch(()=>{}); ch.classList.remove("fa-walk"); ch.classList.add("fa-act-"+act) }
  const en=(FA_ENTER[w.enter||d.enter]||FA_ENTER.slideRight)[1]; if(!still) card.animate(en,{duration:enMs,easing:"cubic-bezier(.2,.9,.3,1)",fill:"backwards"}); if(av) av.classList.add("zoom");
  await wait(still?50:enMs*.6); l1.classList.add("type"); await wait(450); if(sh&&!still) sh.classList.add("go"); card.classList.add("pulse");
  await wait(hold);
  if(ch){ ch.className="fa-char fa-act-wave"; await wait(500); }
  const ex=(FA_EXIT[w.exit||d.exit]||FA_EXIT.fadeOut)[1]; const a1=card.animate(ex,{duration:exMs,easing:"ease-in",fill:"forwards"});
  if(ch){ ch.className="fa-char fa-walk"; ch.animate([{transform:"none"},{transform:`translateX(${side*170}%)`}],{duration:exMs*1.6,easing:"ease-in",fill:"forwards"}); await wait(exMs*1.6) } else await a1.finished.catch(()=>{});
  r.remove(); if(this.opts.editor&&!this.el.querySelector(".fa-root")) this.faRender({name:"اسم المتابع",av:"",sample:true},true) },
 /** الصوت المرفوع يُشغَّل في OBS فقط (لا في لوحة التحكم) حتى لا يتكرر — القارئ الصوتي يُدار مرة واحدة من مركز البوتات */
 faSound(it){ const w=this.w; if(!w.sound||this.opts.editor||this.opts.mute||it.sample) return; try{ const a=new Audio(w.sound); a.volume=Math.max(0,Math.min(1,+w.soundVol||.8)); a.play().catch(()=>{}) }catch(e){} },
 faTest(name){ this.faPush({type:"follow",id:"t"+Date.now()+Math.random(),test:true,user:{name:name||"متابع تجريبي"}}) },
});
