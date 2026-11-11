// ====== آخر التفاعلات: محرك العرض + التصاميم (شفاف 100% خارج التصميم) ======
// كل تصميم = طبقة خلفية SVG + إطار الصورة + طبقة أمامية SVG + لوحة الاسم، بإحداثيات موحّدة 200×200 حول الصورة.
// تسلسل الحركة: تجمّع الجزيئات ← ظهور الهالة ← دخول الصورة (Zoom) ← صعود الاسم ← لمعة بيضاء ← عرض هادئ ← خروج ناعم.
import { View } from "./view.js";
import { esc, avatar } from "./defs.js";
import { fmtMoney } from "./donations.js";
import { LE_KINDS, leEntry, leText, leDerive } from "./latest.js";
import { lbEntries } from "./lb.js";
import { topsList } from "./tops.js";

export const LE_PALETTES={
 gold:{name:"ذهبي",c1:"#f6c94a",c2:"#ffb020",cn:"#fff6d8",ct:"#ffd66b",cp:"#ffe08a",csh:"#ffffff",cbg:"#1a1206"},
 red:{name:"أحمر",c1:"#ff3b4e",c2:"#ff1f3d",cn:"#ffffff",ct:"#ff8a96",cp:"#ff6b7a",csh:"#ffffff",cbg:"#1c0508"},
 blue:{name:"أزرق",c1:"#3ba8ff",c2:"#1e7bff",cn:"#ffffff",ct:"#9fd3ff",cp:"#7cc4ff",csh:"#ffffff",cbg:"#06111f"},
 green:{name:"أخضر",c1:"#2ee59d",c2:"#11c47a",cn:"#effff7",ct:"#8ff5c6",cp:"#7dffc4",csh:"#ffffff",cbg:"#04170f"},
 purple:{name:"بنفسجي",c1:"#b56bff",c2:"#8b3dff",cn:"#ffffff",ct:"#e0b8ff",cp:"#d49bff",csh:"#ffffff",cbg:"#12061f"},
 pink:{name:"وردي",c1:"#ff5fb8",c2:"#ff2d95",cn:"#ffffff",ct:"#ffb3dc",cp:"#ff9ad0",csh:"#ffffff",cbg:"#1f0614"},
 silver:{name:"فضي",c1:"#d6dde8",c2:"#9fb0c8",cn:"#ffffff",ct:"#dfe6f0",cp:"#eef3fa",csh:"#ffffff",cbg:"#0e1218"},
 white:{name:"أبيض",c1:"#ffffff",c2:"#dfe9ff",cn:"#ffffff",ct:"#f2f6ff",cp:"#ffffff",csh:"#ffffff",cbg:"#10131a"},
};
export const LE_FRAMES=[["auto","حسب التصميم"],["circle","دائري"],["hex","سداسي"],["crystal","كريستالي"],["fire","ناري"],["butterfly","فراشات"],["stars","نجوم"],["gold","ذهبي"],["neon","نيون"],["b6o6","B6O6"]];
export const LE_CARDS=[["clear","شفاف 100%"],["glass","بطاقة زجاجية"],["gold","بطاقة ذهبية"],["neon","بطاقة نيون"],["crystal","بطاقة كريستالية"],["gaming","بطاقة ألعاب"]];
/** خطة المكتبة: 20 نمطاً لكل نوع — المنفذ فعلياً فقط يظهر في المكتبة */
export const LE_GROUPS={nature:"الطبيعة الساحرة",royal:"الملكية والفخامة",space:"الفضاء والمجرات",fire:"النار والطاقة",crystal:"الكريستال والألماس",gaming:"الألعاب والمستقبل",saudi:"السعودية والهوية العربية",b6o6:"B6O6 الحصرية"};
/** خطة مكتبة V3: 80 تصميماً (10 لكل مجموعة) — المنفذ فعلياً فقط يظهر في المكتبة */
export const LE_PLAN={nature:["butterfly","sakura","goldenRose","crystalLotus","enchantedForest","moonBlossom","emeraldVines","snowflakeQueen","auroraGarden","floatingClouds"],royal:["crown","goldenThrone","diamondEmperor","royalLion","platinumWings","goldenMedal","crystalPalace","royalScepter","blackGold","legendaryMonarch"],space:["stars","cosmicOrbit","blackHole","nebulaPortal","meteorShower","saturnRing","lunarEclipse","solarCrown","celestialWings","infinityUniverse"],fire:["phoenix","fire","blueFlame","dragonFire","lavaCore","lightningStorm","electricHalo","solarBurst","energyReactor","infernoCrown"],crystal:["diamond","crystalHalo","rubyQueen","sapphireOrbit","emeraldCrystal","prismLight","frozenCrown","floatingGems","glassButterfly","diamondExplosion"],gaming:["cyberSamurai","hologramPortal","levelUp","rgbChampion","digitalMatrix","neonHexagon","mechaWings","plasmaCore","quantumCircle","ultimateEsports"],saudi:["saudiPalm","najdiCrown","goldenDallah","desertFalcon","arabianMoon","diriyahGate","desertStars","saudiEmerald","arabianHorse","saudiLegendary"],b6o6:["duckRoyal","duckNeon","duckDiamond","duckFire","duckGalaxy","duckButterfly","duckCyber","duckSaudi","duckCrystal","duckUltimate"]};
export const LE_PLAN_TOTAL=80;
/** حركات الدخول (30) والخروج (20) — «تلقائي» = تسلسل التصميم الأصلي */
export const LE_ENTERS=[["auto","تلقائي (حركة التصميم)"],["fade","ظهور تدريجي"],["zoom","تكبير ناعم"],["slideR","دخول من اليمين"],["slideL","دخول من اليسار"],["slideUp","صعود من الأسفل"],["slideDown","نزول من الأعلى"],["gather","تجميع الجزيئات"],["portal","فتح بوابة"],["bloom","تفتح زهرة"],["flutter","ظهور فراشات"],["diamond","تشكل ألماس"],["crownDrop","نزول تاج"],["ignite","اشتعال حلقة نار"],["wings","فتح أجنحة"],["hologram","ظهور هولوغرام"],["flipX","قلب أفقي"],["flipY","قلب عمودي"],["bounce","ارتداد"],["elastic","مطاطي"],["spiral","دوران حلزوني"],["blur","وضوح من الضباب"],["glitch","تشويش رقمي"],["curtain","فتح ستارة"],["iris","عدسة دائرية"],["swing","تأرجح"],["rise","طفو للأعلى"],["unfold","انبساط"],["lightSpeed","سرعة الضوء"],["twist","التفاف"],["pop","انبثاق مع دوران"]];
export const LE_EXITS=[["auto","تلقائي (خفوت الإضاءة)"],["fade","تلاشي ناعم"],["scatter","تفكك جزيئات"],["wingsClose","إغلاق الأجنحة"],["flyAway","اختفاء الفراشات"],["portalClose","إغلاق البوابة"],["dim","خفوت الإضاءة"],["shrink","تصغير"],["slideR","خروج لليمين"],["slideL","خروج لليسار"],["slideUp","صعود وتلاشي"],["slideDown","هبوط وتلاشي"],["blur","تلاشي ضبابي"],["flip","قلب للخارج"],["spin","دوران للخارج"],["glitch","تشويش رقمي"],["curtain","إغلاق ستارة"],["collapse","انطواء"],["zoomOut","تكبير وتلاشي"],["sink","غوص"],["burn","احتراق"]];
export const LE_FONTS=[["","افتراضي"],["Readex Pro","Readex Pro — عصري"],["Changa","Changa — عريض"],["Amiri","Amiri — كلاسيكي"],["Orbitron","Orbitron — ألعاب"]];
export const LE_LAYOUTS=[["","حسب التصميم"],["stack","الصورة فوق الاسم"],["stackTop","الاسم فوق الصورة"],["row","الصورة يسار والاسم يمين"],["rowR","الصورة يمين والاسم يسار"]];
export const LE_DESIGNS=[];
export const leDesignOf=id=>LE_DESIGNS.find(d=>d.id===id)||LE_DESIGNS[0];
let LE_XCSS="";
export function leRegister(list){ for(const d of list){ const i=LE_DESIGNS.findIndex(x=>x.id===d.id); if(i>=0) LE_DESIGNS[i]=d; else LE_DESIGNS.push(d); if(d.css) LE_XCSS+=d.css } LE_DESIGNS.sort((a,b)=>a.n-b.n) }

// ---------- رموز الأنواع والجزيئات ----------
const IC={
 like:'<svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.3C1 8.4 3 5 6.4 5c2 0 3.6 1.1 4.6 2.6C12 6.1 13.6 5 15.6 5 19 5 21 8.4 19.6 11.7 17.5 16.4 12 21 12 21z"/></svg>',
 follow:'<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="4"/><path d="M1.5 20c.8-4 4-6 7.5-6s6.7 2 7.5 6z"/><path d="M19 7v3h3v2h-3v3h-2v-3h-3v-2h3V7z"/></svg>',
 join:'<svg viewBox="0 0 24 24"><path d="M5 21V4.5C5 3.7 5.7 3 6.5 3h8L19 5v16zm9-8.5a1.2 1.2 0 1 0 0 .01z"/></svg>',
 share:'<svg viewBox="0 0 24 24"><path d="M13 4l8 7.5-8 7.5v-4.6c-5 0-8.3 1.4-11 5.1C3 14 6 10 13 9z"/></svg>',
 donation:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path fill="#000" fill-opacity=".45" d="M13 5h-2v1.6c-1.9.3-3 1.5-3 3 0 1.9 1.6 2.6 3.3 3 1.4.4 2 .7 2 1.3s-.7 1-1.6 1c-1.1 0-2-.5-2.6-1.2L7.6 15c.8.9 1.9 1.4 3.4 1.6V18h2v-1.5c1.9-.3 3-1.5 3-3 0-2-1.6-2.6-3.4-3.1-1.3-.4-1.9-.6-1.9-1.2 0-.5.6-.9 1.4-.9.9 0 1.6.4 2.1.9l1.3-1.4c-.7-.7-1.6-1.1-2.5-1.3z"/></svg>',
 gift:'<svg viewBox="0 0 24 24"><path d="M3 9h18v4H3zM4.5 13h15v8h-15z"/><path d="M12 9c-1-3-5-5-6-2.5S9.5 9 12 9c2.5 0 5-0.5 6-2.5S13 6 12 9z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
 subscribe:'<svg viewBox="0 0 24 24"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 21l1.6-7L2 9.2l7.1-.6z"/></svg>',
};
const PT={
 like:'<svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.3C1 8.4 3 5 6.4 5c2 0 3.6 1.1 4.6 2.6C12 6.1 13.6 5 15.6 5 19 5 21 8.4 19.6 11.7 17.5 16.4 12 21 12 21z"/></svg>',
 follow:'<svg viewBox="0 0 24 24"><path d="M12 0l2.2 9.8L24 12l-9.8 2.2L12 24l-2.2-9.8L0 12l9.8-2.2z"/></svg>',
 join:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"/></svg>',
 share:'<svg viewBox="0 0 24 24"><path d="M4 10h10V5l8 7-8 7v-5H4z"/></svg>',
 donation:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6.5" fill="#000" fill-opacity=".18"/></svg>',
 gift:'<svg viewBox="0 0 24 24"><path d="M12 0l2.2 9.8L24 12l-9.8 2.2L12 24l-2.2-9.8L0 12l9.8-2.2z"/></svg>',
 subscribe:'<svg viewBox="0 0 24 24"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 21l1.6-7L2 9.2l7.1-.6z"/></svg>',
};
// مولّد أرقام ثابت (نفس التوزيع كل مرة — لا عشوائية مزعجة)
const leRnd=s=>()=>((s=(s*9301+49297)%233280)/233280);
const leF1=n=>Math.round(n*10)/10;
// حركة خاصة بكل نوع تفاعل (فوق أي تصميم)
const KFX={
 like:'<i class="kf-hb"></i><i class="kf-hb b"></i>',
 follow:'<i class="kf-rip"></i><b class="kf-plus p1">+</b><b class="kf-plus p2">+</b><b class="kf-plus p3">+</b>',
 join:'<i class="kf-portal"></i><i class="kf-beam b1"></i><i class="kf-beam b2"></i><i class="kf-beam b3"></i>',
 share:'<i class="kf-orbit">'+[0,120,240].map(a=>`<b style="--a:${a}deg">${PT.share}</b>`).join("")+'</i>',
 donation:[0,1,2,3].map(i=>`<b class="kf-coin" style="--x:${[18,74,34,62][i]}%;--d:${i*.7}s">${PT.donation}</b>`).join(""),
 gift:'<b class="kf-gift">'+IC.gift+'</b>',
 subscribe:'<b class="kf-sub">'+IC.subscribe+'</b>',
};

/** المبلغ بعملته: الرموز اللاتينية قبل الرقم ($2) والعربية بعده (50 ر.س) */
export function leMoney(a,cu){ const t=fmtMoney(a,cu); const m=t.match(/^(.*) ([$€£])$/); return m?m[2]+m[1]:t }
// أيقونات وجزيئات وحركات الأنواع المضافة (الطبقات)
IC.comment='<svg viewBox="0 0 24 24"><path d="M3 4h18v12H9l-5 4v-4H3z"/></svg>';
IC.song='<svg viewBox="0 0 24 24"><path d="M9 3v12.3A3.5 3.5 0 1 0 11 18V8h8V3z"/></svg>';
IC.topDay='<svg viewBox="0 0 64 44"><path d="M3 38 7 9l14 15L32 2l11 22L57 9l4 29z"/></svg>';
IC.topWeek='<svg viewBox="0 0 24 24"><path d="M6 2h12v3h4c0 4-2 7-5 7.5A6 6 0 0 1 13 16v3h4v3H7v-3h4v-3a6 6 0 0 1-4-3.5C4 12 2 9 2 5h4z"/></svg>';
IC.topMonth='<svg viewBox="0 0 20 20"><path d="M10 0 20 7 10 20 0 7z"/></svg>';
IC.topLike=IC.like; IC.topComment=IC.comment; IC.topShare=IC.share;
Object.assign(PT,{comment:PT.join,song:PT.follow,topDay:PT.subscribe,topWeek:PT.subscribe,topMonth:PT.follow,topLike:PT.like,topComment:PT.join,topShare:PT.share});
Object.assign(KFX,{topLike:KFX.like,topShare:KFX.share,topDay:KFX.donation,topWeek:KFX.donation,topMonth:KFX.donation,comment:KFX.follow,topComment:KFX.follow,song:KFX.subscribe});
const SAMPLE_X={comment:{name:"محمد",text:"السلام عليكم 🔥"},topDay:{name:"محمد",count:12500},topWeek:{name:"محمد",count:84000},topMonth:{name:"محمد",count:310000},topLike:{name:"محمد",count:24500},topComment:{name:"محمد",count:86},topShare:{name:"محمد",count:12},song:{name:"محمد",title:"اسم الأغنية"}};
let leCss=false;
export function ensureLeCSS(){ if(leCss||typeof document==="undefined") return; leCss=true; const st=document.createElement("style"); st.id="b6o6-le"; st.textContent=LE_CSS+LE_XCSS; document.head.appendChild(st) }
const leReduced=()=>{ try{ return matchMedia("(prefers-reduced-motion: reduce)").matches }catch(e){ return false } };
const SAMPLE={like:{name:"محمد",count:120},follow:{name:"محمد"},join:{name:"محمد"},share:{name:"محمد"},donation:{name:"محمد",amount:2,currency:"USD",message:"استمر 🔥"},gift:{name:"محمد",gift:"وردة",count:5},subscribe:{name:"محمد"}};
export const leSample=(kind,n)=>({id:"sample_"+kind+"_"+(n||0),kind,uid:"s",av:"",at:Date.now(),sample:true,...(SAMPLE[kind]||SAMPLE_X[kind]||SAMPLE.follow)});

Object.assign(View.prototype,{
 applyLe(w,W,Hh){ ensureLeCSS(); const e=this.el, d=leDesignOf(w.design), ed=this.opts.editor, lay=w.layout||d.lay||"stack", row=lay==="row"||lay==="rowR";
  const fr=w.frame&&w.frame!=="auto"?w.frame:d.frame;
  e.className=`wd lew led-${d.id} lek-${w.kind} lel-${row?"row":"stack"} lelx-${lay} lef-${fr} lec-${w.card||"clear"}${w.animOn===false?" le-still":""}${w.lowPerf||this.opts.lowPerf?" le-lite":""}${ed?(" "+(w.locked?"locked":"")+(w.visible?"":" hid")+(this.opts.sel===w.id?" sel":"")):""}`;
  const S=(row?Math.min(Hh*.96,W*.36):Math.min(W*.72,Hh*.66))*Math.max(.5,Math.min(1.4,+w.avScale||1));
  const st=e.style; st.setProperty("--S",S+"px"); st.setProperty("--W",W+"px"); st.setProperty("--u",(S/10)*(w.textScale||1)+"px"); st.setProperty("--as",String(w.animSpeed||1)); st.setProperty("--gl",String(w.glow??1)); if(w.font) st.setProperty("--lef",`"${w.font}"`); else st.removeProperty("--lef");
  const P={...LE_PALETTES[d.pal]||LE_PALETTES.gold,...(w.palette&&LE_PALETTES[w.palette]||{})};
  for(const k of ["c1","c2","cn","ct","cp","csh","cbg"]) st.setProperty("--"+k,w[k]||P[k]);
  const sig=["le",d.id,w.kind,fr,w.frameImg||"",w.showTitle,w.showMsg,w.showEmblem,w.showAv,lay,w.ptN,w.fxHalo,w.fxKind].join("|");
  if(sig!==this.sig){ this.sig=sig; this.le={cur:null,timer:0}; e.innerHTML=(ed?'<div class="rh"></div><div class="lockb">🔒</div>':""); this.leShow(this.leCurrent(),true) }
  else if(this.le&&this.le.cur) this.leFill(this.el.querySelector(".le-card:not(.le-exit)"),this.le.cur);
 },
 leCurrent(){ const w=this.w, src=this.opts.data?this.opts.data():null; const L=src&&src.C&&src.C.latest||{}; const e=LE_KINDS[w.kind]?.derived?leDerive(w.kind,src,lbEntries,topsList):L[w.kind];
  if(e) return e; if(this.opts.editor||String(w.id).startsWith("pv_")) return leSample(w.kind); return null },
 /** بناء بطاقة لحدث واحد */
 leCard(e){ const w=this.w, d=leDesignOf(w.design), k=w.kind, R=leRnd(7+(d.n||1)*13);
  const PN=Math.max(0,Math.min(24,w.ptN==null||w.ptN===""?10:+w.ptN)); const pts=Array.from({length:PN},(_,i)=>{ const a=i/Math.max(1,PN)*Math.PI*2+R()*.5, r=58+R()*30, x=leF1(100+Math.cos(a)*r), y=leF1(100+Math.sin(a)*r*.92); const fx=leF1(Math.cos(a)*130), fy=leF1(Math.sin(a)*130);
   return `<b style="left:${x/2}%;top:${y/2}%;--fx:${fx}%;--fy:${fy}%;--s:${leF1(.55+R()*.7)};--dl:${leF1(R()*.35)}s;--fd:${leF1(2.6+R()*2.4)}s">${PT[k]||PT.follow}</b>` }).join("");
  const c=document.createElement("div"); c.className="le-card";
  c.innerHTML=`<div class="le-stage"><div class="le-pt">${pts}</div>${w.fxHalo===false?"":'<div class="le-halo"><i></i></div>'}<div class="le-back">${d.back?d.back(k):""}</div>
   ${w.fxKind===false?"":`<div class="le-kfx">${KFX[k]||""}</div>`}
   ${w.showAv!==false?`<div class="le-av"><div class="le-avi"><i class="le-ring"></i><img alt="">${w.frameImg?`<img class="le-fimg" src="${esc(w.frameImg)}" alt="">`:""}</div></div>`:""}
   <div class="le-front">${d.front?d.front(k):""}</div>
   ${w.showEmblem!==false?`<i class="le-emb">${IC[k]||""}</i>`:""}</div>
   <div class="le-plate"><div class="le-pl-in">${w.showTitle!==false?`<span class="le-title"></span>`:""}<b class="le-name"></b>${w.showMsg!==false?`<span class="le-msg"></span>`:""}</div><i class="le-shw"><i class="le-shine"></i></i>${d.plate||""}</div><div class="le-burst"></div>`;
  return c },
 leFill(c,e){ if(!c||!e) return; const w=this.w, K=LE_KINDS[w.kind]||LE_KINDS.follow, q=s=>c.querySelector(s);
  const img=q(".le-avi img:not(.le-fimg)"); if(img){ const s=e.av||w.defaultAv||avatar(e.name||"?"); if(img.getAttribute("src")!==s) img.src=s; img.onerror=()=>{ img.onerror=null; img.src=w.defaultAv||avatar(e.name||"?") } }
  const t=q(".le-title"); if(t) t.textContent=w.title||K.title;
  const money=(a,cu)=>leMoney(a,cu);
  const n=q(".le-name"); if(n){ const amt=e.kind==="donation"&&e.amount!=null?leMoney(e.amount,e.currency):""; n.innerHTML=(amt?`<span class="le-amt" dir="ltr">${esc(amt)}</span><span class="le-sep">-</span>`:"")+`<span class="le-nm">${esc(e.name||"")}</span>`; n.title=e.name||"" }
  const m=q(".le-msg"); if(m){ const tx=leText(w.msg!=null&&w.msg!==""?w.msg:K.msg,e,money); m.textContent=tx&&!(e.kind==="like"&&!e.count&&/\{count\}/.test(w.msg||K.msg))?tx:""; m.style.display=m.textContent?"":"none" }
 },
 /** عرض حدث: انتقال سينمائي من السابق للجديد، أو نبضة إذا كان نفس المستخدم */
 leShow(e,silent){ const w=this.w; if(!this.le) this.le={cur:null,timer:0}; const st=this.le;
  // دمج الأحداث المتلاحقة: حد أدنى للعرض 600ms — أثناء الانتظار نحتفظ بأحدث حدث فقط (يمنع تراكم البطاقات أثناء عواصف الأحداث)
  const nowT=Date.now(), HOLD=600, sameUser=st.cur&&e&&(st.cur.id===e.id||(e.kind==="like"&&st.cur.uid===e.uid));
  if(e&&!silent&&!sameUser&&st.swapAt&&nowT-st.swapAt<HOLD){ st.pending=e; if(!st.pt) st.pt=setTimeout(()=>{ st.pt=0; const p=st.pending; st.pending=null; if(p&&this.el.isConnected) this.leShow(p,false) },HOLD-(nowT-st.swapAt)); return }
  const old=this.el.querySelector(".le-card:not(.le-exit)");
  if(!e){ if(old) this.leHide(); st.cur=null; return }
  const same=st.cur&&old&&(st.cur.id===e.id||(LE_KINDS[e.kind]?.derived&&st.cur.uid===e.uid)||(st.cur.uid&&st.cur.uid===e.uid&&st.cur.kind===e.kind&&e.at-st.cur.at<15000&&e.kind==="like"));
  st.cur=e;
  if(same){ this.leFill(old,e); if(!silent) this.lePulse(old); }
  else { if(!silent) st.swapAt=nowT; this.el.querySelectorAll(".le-card.le-exit").forEach(x=>x.remove()); if(old) this.leOut(old);
   const c=this.leCard(e); this.leFill(c,e); const rh=this.el.querySelector(".rh"); this.el.insertBefore(c,rh||null);
   if(silent||leReduced()) c.classList.add("le-idle"); else { c.classList.add("le-enter"); if(w.enter&&w.enter!=="auto") c.classList.add("lei-"+w.enter); const as=+w.animSpeed||1; setTimeout(()=>{ if(c.isConnected){ c.classList.remove("le-enter","lei-"+w.enter); c.classList.add("le-idle") } },2200/as); setTimeout(()=>c.isConnected&&this.lePulse(c,true),1100/as) } }
  clearTimeout(st.timer);
  if(w.mode==="alert"&&!e.sample&&!this.opts.editor) st.timer=setTimeout(()=>this.leHide(),Math.max(1,+w.dur||5)*1000);
 },
 leHide(){ const c=this.el.querySelector(".le-card:not(.le-exit)"); if(!c) return; this.leOut(c); if(this.le) this.le.cur=null },
 leOut(c){ const x=this.w.exit; c.classList.remove("le-enter"); c.classList.add("le-exit"); if(x&&x!=="auto") c.classList.add("leo-"+x); setTimeout(()=>c.remove(),900) },
 /** تشغيل الحركة كاملة من البداية (المكتبة/الاستوديو) */
 leReplay(){ const e=this.le&&this.le.cur||this.leCurrent(); if(!e) return; const c=this.el.querySelector(".le-card:not(.le-exit)"); if(c) c.remove(); if(this.le) this.le.cur=null; this.leShow({...e,id:e.id+"_r"+Date.now()},false) },
 lePulse(c,first){ if(!c||this.el.classList.contains("le-still")||leReduced()) return; c.classList.remove("le-bump"); void c.offsetWidth; c.classList.add("le-bump"); setTimeout(()=>c.classList.remove("le-bump"),900);
  const d=leDesignOf(this.w.design); if(d.pulse) try{ d.pulse(c,this.w,first) }catch(err){} },
 refreshLe(src,silent){ if(LE_KINDS[this.w.kind]?.derived){ const d=leDerive(this.w.kind,src,lbEntries,topsList); if(d&&(!this.le||!this.le.cur||this.le.cur.id!==d.id||this.le.cur.count!==d.count)) this.leShow(d,silent); return }
  const e=src&&src.C&&src.C.latest&&src.C.latest[this.w.kind]; if(e&&(!this.le||!this.le.cur||this.le.cur.id!==e.id||this.le.cur.count!==e.count)) this.leShow({...e},silent) },
 /** حدث مباشر (يشمل أحداث الاختبار — تُعرض ولا تُحفظ) */
 lePush(ev){ const e=leEntry(ev,Date.now()); if(!e||e.kind!==this.w.kind) return; if(e.kind==="donation"&&!(e.amount>0)) return;
  const c=this.le&&this.le.cur; if(e.kind==="like"&&c&&c.uid===e.uid&&!c.sample&&Date.now()-c.at<15000){ e.count+=c.count||0; e.at=Date.now() }
  this.leShow(e,false) },
});

// ---------- CSS الأساس: التخطيط + تسلسل الحركة + الإطارات + البطاقات + حركات الأنواع ----------
const LE_CSS=`
.lew{background:none!important;pointer-events:auto}
.lew .le-card{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:calc(var(--u)*.5);font-family:var(--lef,inherit);--d:calc(1s / var(--as,1))}
.lel-stack .le-card{flex-direction:column;gap:0}
.lel-row .le-card{flex-direction:row-reverse;justify-content:center}
.lelx-rowR .le-card{flex-direction:row}.lelx-rowR .le-pl-in{align-items:flex-end}.lelx-rowR .le-plate{text-align:left}.lelx-rowR .le-name{justify-content:flex-end}
.lelx-stackTop .le-card{flex-direction:column-reverse}.lelx-stackTop .le-plate{margin-top:0;margin-bottom:calc(var(--S)*-.1)}
.lelx-stackTop .le-enter .le-plate{animation-name:le-down}
@keyframes le-down{from{opacity:0;transform:translateY(-45%)}to{opacity:1;transform:none}}
.le-stage{position:relative;width:var(--S);height:var(--S);flex:0 0 auto}
.le-stage>div,.le-stage>i{position:absolute;inset:0}
.le-back svg,.le-front svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.le-front{pointer-events:none}
.le-halo{display:flex;align-items:center;justify-content:center}
.le-halo i{width:78%;height:78%;border-radius:50%;background:radial-gradient(circle,color-mix(in srgb,var(--c2) 70%,transparent) 0%,color-mix(in srgb,var(--c2) 22%,transparent) 45%,transparent 70%);opacity:calc(.55 * var(--gl));filter:blur(calc(var(--S)*.02))}
.le-av{display:flex;align-items:center;justify-content:center}
.le-avi{position:relative;width:46%;height:46%;border-radius:50%}
.le-avi img{position:absolute;inset:6%;width:88%;height:88%;border-radius:50%;object-fit:cover;background:#111;z-index:1}
.le-avi .le-fimg{inset:-14%;width:128%;height:128%;border-radius:0;object-fit:contain;background:none;z-index:3}
.le-ring{position:absolute;inset:0;border-radius:50%;z-index:2;pointer-events:none;background:conic-gradient(from 0deg,var(--c1),color-mix(in srgb,var(--c1) 35%,#fff),var(--c1),color-mix(in srgb,var(--c1) 55%,#000),var(--c1));-webkit-mask:radial-gradient(circle,transparent 61%,#000 62.5%);mask:radial-gradient(circle,transparent 61%,#000 62.5%);box-shadow:0 0 calc(var(--S)*.05*var(--gl)) color-mix(in srgb,var(--c1) 70%,transparent)}
.le-emb{position:absolute!important;inset:auto!important;left:63%!important;top:63%!important;width:15%;height:15%;border-radius:50%;display:flex!important;align-items:center;justify-content:center;background:radial-gradient(circle at 35% 30%,color-mix(in srgb,var(--c1) 60%,#fff),var(--c1) 55%,color-mix(in srgb,var(--c1) 50%,#000));box-shadow:0 0 0 calc(var(--S)*.008) #0008,0 0 calc(var(--S)*.04) var(--c1);z-index:5}
.le-emb svg{width:58%;height:58%;fill:#fff;color:#fff;filter:drop-shadow(0 1px 1px #0006)}
.le-pt b{position:absolute;width:calc(var(--S)*.06*var(--s));height:calc(var(--S)*.06*var(--s));margin:calc(var(--S)*-.03*var(--s));opacity:.85}
.le-pt svg{width:100%;height:100%;fill:var(--cp);filter:drop-shadow(0 0 calc(var(--S)*.012) var(--cp))}
.lek-donation .le-pt svg{fill:#ffcf3d;filter:drop-shadow(0 0 calc(var(--S)*.012) #ffb300)}
/* اللوحة */
.le-plate{position:relative;z-index:6;max-width:min(calc(var(--S)*1.55),calc(var(--W)*.97));min-width:min(calc(var(--S)*.9),calc(var(--W)*.97));box-sizing:border-box;padding:calc(var(--u)*.38) calc(var(--u)*1.05);border-radius:calc(var(--u)*.9);text-align:center;isolation:isolate}
.le-shw{position:absolute;inset:0;overflow:hidden;border-radius:inherit;pointer-events:none;z-index:3}
.lel-stack .le-plate{margin-top:calc(var(--S)*-.13)}
.lel-row .le-plate{text-align:right;max-width:calc(100% - var(--S) - var(--u));flex:0 1 auto;min-width:0;background:none!important;border:0!important;box-shadow:none!important;clip-path:none!important;filter:none!important;padding:0 calc(var(--u)*.3)}
.lel-row .le-plate::before,.lel-row .le-plate::after{display:none!important}
.le-pl-in{display:flex;flex-direction:column;align-items:center;gap:calc(var(--u)*.05);min-width:0}
.lel-row .le-pl-in{align-items:flex-start}
.le-title{font-size:calc(var(--u)*.62);font-weight:800;color:var(--ct);letter-spacing:.02em;text-shadow:0 0 calc(var(--u)*.35) color-mix(in srgb,var(--ct) 60%,transparent);white-space:nowrap}
.lel-row .le-title{border:1px solid color-mix(in srgb,var(--ct) 60%,transparent);border-radius:99px;padding:calc(var(--u)*.1) calc(var(--u)*.6);background:#0008;font-size:calc(var(--u)*.85);box-shadow:0 0 calc(var(--u)*.4) color-mix(in srgb,var(--ct) 40%,transparent)}
.lel-row .le-msg{font-size:calc(var(--u)*.85)}
.le-name{display:flex;align-items:baseline;justify-content:center;gap:.25em;font-size:calc(var(--u)*1.12);font-weight:900;color:var(--cn);line-height:1.2;max-width:100%;min-width:0;white-space:nowrap;text-shadow:0 0 calc(var(--u)*.4*var(--gl)) color-mix(in srgb,var(--c1) 80%,transparent),0 2px 3px #000a}
.lel-row .le-name{font-size:calc(var(--u)*2.3);text-shadow:0 0 calc(var(--u)*.6*var(--gl)) var(--c1),0 0 calc(var(--u)*1.2*var(--gl)) color-mix(in srgb,var(--c1) 60%,transparent),0 3px 4px #000c;justify-content:flex-start}
.le-nm{unicode-bidi:plaintext;overflow:hidden;text-overflow:ellipsis;min-width:0}
.le-amt{unicode-bidi:isolate;flex:0 0 auto;color:#7dffb0;text-shadow:0 0 calc(var(--u)*.35) #22c55e99,0 2px 3px #000a}
.le-sep{flex:0 0 auto;opacity:.6}
.le-msg{unicode-bidi:plaintext;font-size:calc(var(--u)*.56);font-weight:700;color:color-mix(in srgb,var(--cn) 82%,var(--ct));white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.le-shine{position:absolute;inset:0;pointer-events:none;background:linear-gradient(105deg,transparent 35%,color-mix(in srgb,var(--csh) 75%,transparent) 50%,transparent 65%);transform:translateX(-130%);z-index:3}
.le-burst{position:absolute;inset:0;pointer-events:none;overflow:visible}
/* بطاقات الخلفية (المنطقة خارجها شفافة دائماً) */
.lec-clear .le-plate{background:linear-gradient(180deg,color-mix(in srgb,var(--cbg) 82%,transparent),color-mix(in srgb,var(--cbg) 92%,transparent));border:calc(var(--u)*.07) solid color-mix(in srgb,var(--c1) 75%,transparent);box-shadow:0 0 calc(var(--u)*.6*var(--gl)) color-mix(in srgb,var(--c1) 45%,transparent),inset 0 0 calc(var(--u)*.5) color-mix(in srgb,var(--c1) 22%,transparent)}
.lec-glass .le-card{background:linear-gradient(160deg,#ffffff1f,#ffffff08);border:1px solid #ffffff38;border-radius:calc(var(--u)*1.2);backdrop-filter:blur(10px);box-shadow:0 10px 40px #0006}
.lec-gold .le-card{background:radial-gradient(120% 100% at 50% 0%,#3a2a0a,#120c03);border:calc(var(--u)*.09) solid #e8b84a;border-radius:calc(var(--u)*1.2);box-shadow:inset 0 0 calc(var(--u)*1.2) #f6c94a33,0 0 calc(var(--u)*.8) #f6c94a55}
.lec-neon .le-card{background:#05060ccc;border:calc(var(--u)*.08) solid var(--c1);border-radius:calc(var(--u)*1.2);box-shadow:0 0 calc(var(--u)*.9) var(--c1),inset 0 0 calc(var(--u)*.9) color-mix(in srgb,var(--c1) 45%,transparent)}
.lec-crystal .le-card{background:linear-gradient(135deg,#bfe9ff30,#5ab8ff14 40%,#ffffff26 60%,#7cc4ff12);border:1px solid #cfefffaa;border-radius:calc(var(--u)*.6);clip-path:polygon(6% 0,94% 0,100% 12%,100% 88%,94% 100%,6% 100%,0 88%,0 12%);backdrop-filter:blur(6px)}
.lec-gaming .le-card{background:linear-gradient(90deg,#0a0f1ccc,#0d1426ee);border:calc(var(--u)*.06) solid var(--c1);clip-path:polygon(4% 0,100% 0,100% 80%,96% 100%,0 100%,0 20%);box-shadow:inset 0 0 0 calc(var(--u)*.2) #0008}
.lec-glass .le-plate,.lec-gold .le-plate,.lec-neon .le-plate,.lec-crystal .le-plate,.lec-gaming .le-plate{background:none;border:0;box-shadow:none}
/* الإطارات */
.lef-hex .le-avi,.lef-hex .le-avi img{border-radius:0;clip-path:polygon(25% 3%,75% 3%,100% 50%,75% 97%,25% 97%,0 50%)}
.lef-hex .le-ring{border-radius:0;-webkit-mask:none;mask:none;clip-path:polygon(25% 3%,75% 3%,100% 50%,75% 97%,25% 97%,0 50%,6% 50%,28% 91%,72% 91%,94% 50%,72% 9%,28% 9%,6% 50%,0 50%)}
.lef-crystal .le-ring{background:conic-gradient(from 20deg,#e9fbff,#5ab8ff,#bdeaff,#2b7bd8,#e9fbff,#7fd0ff,#ffffff,#3a8fe0,#e9fbff);filter:drop-shadow(0 0 6px #8fd8ff)}
.lef-fire .le-ring{background:conic-gradient(from 0deg,#ff3d00,#ffb300,#ff6a00,#ffd54a,#ff2a00,#ff8f00,#ff3d00);animation:le-spin calc(6s / var(--as,1)) linear infinite;box-shadow:0 0 calc(var(--S)*.06) #ff5a00}
.lef-butterfly .le-ring{background:conic-gradient(from 0deg,#ff7ad9,#b56bff,#ffb3ec,#8b3dff,#ff7ad9)}
.lef-stars .le-ring{background:repeating-conic-gradient(var(--c1) 0 6deg,color-mix(in srgb,var(--c1) 30%,transparent) 6deg 12deg)}
.lef-gold .le-ring{background:conic-gradient(from 0deg,#8a5a12,#fde68a,#c08a1e,#fff3c4,#a86f12,#fde68a,#8a5a12);-webkit-mask:radial-gradient(circle,transparent 57%,#000 58.5%,#000 63%,transparent 64%,transparent 66%,#000 67%);mask:radial-gradient(circle,transparent 57%,#000 58.5%,#000 63%,transparent 64%,transparent 66%,#000 67%)}
.lef-neon .le-ring{background:var(--c1);-webkit-mask:radial-gradient(circle,transparent 64%,#000 65.5%,#000 68%,transparent 69.5%);mask:radial-gradient(circle,transparent 64%,#000 65.5%,#000 68%,transparent 69.5%);filter:drop-shadow(0 0 4px var(--c1)) drop-shadow(0 0 10px var(--c1))}
.lef-b6o6 .le-ring{background:conic-gradient(from 200deg,#0a63ff,#e8f1ff,#7fb3ff,#c8d3e0,#0a63ff,#ffffff,#3d8bff,#0a63ff)}
/* ===== تسلسل الحركة ===== */
.le-enter .le-pt b{animation:le-gather calc(var(--d)*.7) cubic-bezier(.2,.8,.2,1) var(--dl) both}
.le-enter .le-halo{animation:le-fadein calc(var(--d)*.7) ease calc(var(--d)*.2) both}
.le-enter .le-back{animation:le-pop calc(var(--d)*.7) cubic-bezier(.2,1.2,.3,1) calc(var(--d)*.3) both}
.le-enter .le-av{animation:le-zoom calc(var(--d)*.6) cubic-bezier(.2,1.3,.3,1) calc(var(--d)*.4) both}
.le-enter .le-front,.le-enter .le-kfx{animation:le-fadein calc(var(--d)*.6) ease calc(var(--d)*.55) both}
.le-enter .le-emb{animation:le-zoom calc(var(--d)*.5) cubic-bezier(.2,1.5,.3,1) calc(var(--d)*.85) both}
.lel-stack .le-enter .le-plate{animation:le-up calc(var(--d)*.6) cubic-bezier(.2,1,.3,1) calc(var(--d)*.7) both}
.lel-row .le-enter .le-plate{animation:le-side calc(var(--d)*.6) cubic-bezier(.2,1,.3,1) calc(var(--d)*.7) both}
.le-enter .le-shine,.le-bump .le-shine{animation:le-shine calc(var(--d)*.8) ease calc(var(--d)*1.15) both}
.le-bump .le-shine{animation-delay:0s}
.le-idle .le-halo i,.le-enter .le-halo i{animation:le-breath calc(3.2s / var(--as,1)) ease-in-out infinite}
.le-idle .le-avi,.le-enter .le-avi{animation:le-breath2 calc(4s / var(--as,1)) ease-in-out infinite}
.le-idle .le-pt b{animation:le-float var(--fd) ease-in-out var(--dl) infinite alternate}
.le-bump .le-stage{animation:le-flash .8s ease}
.le-exit{animation:le-out .65s ease forwards;pointer-events:none}
.le-exit .le-pt b{animation:le-scatter .6s ease forwards}
.le-still .le-card *,.le-still .le-card{animation:none!important;transition:none!important}
.le-still .le-shine{display:none}
.le-lite .le-pt,.le-lite .le-kfx{display:none}.le-lite .le-back *,.le-lite .le-halo i{animation:none!important;filter:none!important}
@keyframes le-gather{0%{opacity:0;transform:translate(var(--fx),var(--fy)) scale(.2)}70%{opacity:1}100%{opacity:.85;transform:none}}
@keyframes le-fadein{from{opacity:0}to{opacity:1}}
@keyframes le-pop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}
@keyframes le-zoom{from{opacity:0;transform:scale(.3)}to{opacity:1;transform:none}}
@keyframes le-up{from{opacity:0;transform:translateY(45%)}to{opacity:1;transform:none}}
@keyframes le-side{from{opacity:0;transform:translateX(-18%)}to{opacity:1;transform:none}}
@keyframes le-shine{from{transform:translateX(-130%)}to{transform:translateX(130%)}}
@keyframes le-breath{0%,100%{transform:scale(1);opacity:calc(.5 * var(--gl))}50%{transform:scale(1.07);opacity:calc(.75 * var(--gl))}}
@keyframes le-breath2{0%,100%{transform:scale(1)}50%{transform:scale(1.025)}}
@keyframes le-float{from{transform:translate(0,0)}to{transform:translate(calc(var(--S)*.02),calc(var(--S)*-.035))}}
@keyframes le-flash{0%{filter:none}30%{filter:brightness(1.6) saturate(1.2)}100%{filter:none}}
@keyframes le-out{0%{opacity:1;filter:none;transform:none}100%{opacity:0;filter:brightness(.35) blur(2px);transform:scale(.92)}}
@keyframes le-scatter{to{opacity:0;transform:translate(calc(var(--fx) * .4),calc(var(--fy) * .4)) scale(.3)}}
@keyframes le-spin{to{transform:rotate(360deg)}}
/* ===== حركة خاصة بكل نوع ===== */
.le-kfx{pointer-events:none}
.kf-hb{position:absolute;left:27%;top:27%;width:46%;height:46%;border-radius:50%;border:calc(var(--S)*.012) solid var(--cp);opacity:0;animation:kf-hb calc(2.4s / var(--as,1)) ease-out infinite}
.kf-hb.b{animation-delay:calc(.28s / var(--as,1))}
@keyframes kf-hb{0%{opacity:.8;transform:scale(1)}35%{opacity:0;transform:scale(1.45)}100%{opacity:0;transform:scale(1.45)}}
.kf-rip{position:absolute;left:27%;top:27%;width:46%;height:46%;border-radius:50%;box-shadow:0 0 0 calc(var(--S)*.01) var(--cp);opacity:0;animation:kf-hb calc(3s / var(--as,1)) ease-out infinite}
.kf-plus{position:absolute;color:var(--cp);font-weight:900;font-size:calc(var(--S)*.08);text-shadow:0 0 6px var(--cp);opacity:0;animation:kf-plus calc(3s / var(--as,1)) ease-out infinite}
.kf-plus.p1{left:22%;top:30%}.kf-plus.p2{left:74%;top:22%;animation-delay:calc(1s / var(--as,1))}.kf-plus.p3{left:70%;top:72%;animation-delay:calc(2s / var(--as,1))}
@keyframes kf-plus{0%{opacity:0;transform:translateY(20%) scale(.5)}20%{opacity:1;transform:none}60%{opacity:0;transform:translateY(-60%) scale(.9)}100%{opacity:0}}
.kf-portal{position:absolute;left:18%;top:72%;width:64%;height:14%;border-radius:50%;border:calc(var(--S)*.012) solid var(--cp);box-shadow:0 0 calc(var(--S)*.05) var(--cp),inset 0 0 calc(var(--S)*.04) var(--cp);animation:kf-portal calc(2.6s / var(--as,1)) ease-in-out infinite}
@keyframes kf-portal{0%,100%{transform:scaleX(.92);opacity:.6}50%{transform:scaleX(1.06);opacity:1}}
.kf-beam{position:absolute;bottom:22%;width:3%;height:30%;border-radius:9px;background:linear-gradient(to top,var(--cp),transparent);opacity:0;animation:kf-beam calc(2.2s / var(--as,1)) ease-out infinite}
.kf-beam.b1{left:30%}.kf-beam.b2{left:49%;animation-delay:calc(.7s / var(--as,1))}.kf-beam.b3{left:67%;animation-delay:calc(1.4s / var(--as,1))}
@keyframes kf-beam{0%{opacity:0;transform:translateY(30%) scaleY(.3)}30%{opacity:.8}100%{opacity:0;transform:translateY(-40%) scaleY(1)}}
.kf-orbit{position:absolute;inset:6%;animation:le-spin calc(7s / var(--as,1)) linear infinite}
.kf-orbit b{position:absolute;left:50%;top:50%;width:9%;height:9%;margin:-4.5%;transform:rotate(var(--a)) translateY(-500%) rotate(90deg)}
.kf-orbit svg{width:100%;height:100%;fill:var(--cp);filter:drop-shadow(0 0 4px var(--cp))}
.kf-coin{position:absolute;left:var(--x);top:-4%;width:9%;height:9%;opacity:0;animation:kf-coin calc(2.8s / var(--as,1)) ease-in var(--d) infinite}
.kf-coin svg{width:100%;height:100%;fill:#ffcf3d;filter:drop-shadow(0 0 4px #ffb300)}
@keyframes kf-coin{0%{opacity:0;transform:translateY(0) rotateY(0)}15%{opacity:1}80%{opacity:1}100%{opacity:0;transform:translateY(760%) rotateY(720deg)}}
.kf-gift,.kf-sub{position:absolute;left:12%;top:12%;width:14%;height:14%;color:var(--cp);animation:kf-bob calc(2s / var(--as,1)) ease-in-out infinite}
.kf-gift svg,.kf-sub svg{width:100%;height:100%;fill:var(--cp);filter:drop-shadow(0 0 5px var(--cp))}
@keyframes kf-bob{0%,100%{transform:translateY(0) rotate(-6deg)}50%{transform:translateY(-14%) rotate(6deg)}}
.le-confetti{position:absolute;width:calc(var(--S)*.03);height:calc(var(--S)*.05);border-radius:2px;left:50%;top:40%;animation:le-conf 1.4s cubic-bezier(.2,.7,.4,1) forwards}
@keyframes le-conf{0%{opacity:1;transform:translate(0,0) rotate(0)}100%{opacity:0;transform:translate(var(--tx),var(--ty)) rotate(var(--r))}}
/* ===== حركات الدخول (على البطاقة كاملة، فوق تسلسل التصميم) ===== */
.le-card[class*="lei-"]{animation:var(--lei) calc(var(--d)*.95) cubic-bezier(.2,.9,.25,1) both}
.lei-fade{--lei:lei-fade}.lei-zoom{--lei:lei-zoom}.lei-slideR{--lei:lei-slideR}.lei-slideL{--lei:lei-slideL}.lei-slideUp{--lei:lei-slideUp}.lei-slideDown{--lei:lei-slideDown}.lei-gather{--lei:lei-fade}.lei-portal{--lei:lei-portal}.lei-bloom{--lei:lei-bloom}.lei-flutter{--lei:lei-flutter}.lei-diamond{--lei:lei-diamond}.lei-crownDrop{--lei:lei-crownDrop}.lei-ignite{--lei:lei-ignite}.lei-wings{--lei:lei-wings}.lei-hologram{--lei:lei-holo}.lei-flipX{--lei:lei-flipX}.lei-flipY{--lei:lei-flipY}.lei-bounce{--lei:lei-bounce}.lei-elastic{--lei:lei-elastic}.lei-spiral{--lei:lei-spiral}.lei-blur{--lei:lei-blur}.lei-glitch{--lei:lei-glitch}.lei-curtain{--lei:lei-curtain}.lei-iris{--lei:lei-iris}.lei-swing{--lei:lei-swing}.lei-rise{--lei:lei-rise}.lei-unfold{--lei:lei-unfold}.lei-lightSpeed{--lei:lei-light}.lei-twist{--lei:lei-twist}.lei-pop{--lei:lei-pop}
.lei-gather .le-pt b{animation-duration:calc(var(--d)*1.1)!important}
.lei-flutter .le-front{animation:lei-flutterF calc(var(--d)*1.2) ease both!important}
.lei-crownDrop .le-front{animation:lei-crownDrop calc(var(--d)*.9) cubic-bezier(.3,1.5,.4,1) both!important}
.lei-ignite .le-back{animation:lei-ignite calc(var(--d)*1.1) ease both!important}
.lei-wings .le-back{animation:lei-wings calc(var(--d)*.9) cubic-bezier(.2,1.2,.3,1) both!important}
@keyframes lei-fade{from{opacity:0}to{opacity:1}}
@keyframes lei-zoom{from{opacity:0;transform:scale(.55)}to{opacity:1;transform:none}}
@keyframes lei-slideR{from{opacity:0;transform:translateX(60%)}to{opacity:1;transform:none}}
@keyframes lei-slideL{from{opacity:0;transform:translateX(-60%)}to{opacity:1;transform:none}}
@keyframes lei-slideUp{from{opacity:0;transform:translateY(55%)}to{opacity:1;transform:none}}
@keyframes lei-slideDown{from{opacity:0;transform:translateY(-55%)}to{opacity:1;transform:none}}
@keyframes lei-portal{0%{clip-path:circle(0% at 50% 40%);filter:brightness(2.2)}70%{filter:brightness(1.3)}100%{clip-path:circle(120% at 50% 40%);filter:none}}
@keyframes lei-bloom{0%{opacity:0;transform:scale(.2) rotate(-50deg);filter:blur(6px)}60%{opacity:1;filter:blur(0)}100%{transform:none}}
@keyframes lei-flutter{0%{opacity:0}100%{opacity:1}}
@keyframes lei-flutterF{0%{opacity:0;transform:translateY(30%) scale(1.4)}60%{opacity:1}100%{opacity:1;transform:none}}
@keyframes lei-diamond{0%{opacity:0;clip-path:polygon(50% 50%,50% 50%,50% 50%,50% 50%);filter:brightness(3) hue-rotate(-20deg)}50%{opacity:1;clip-path:polygon(50% -10%,110% 50%,50% 110%,-10% 50%)}100%{clip-path:polygon(-60% -60%,160% -60%,160% 160%,-60% 160%);filter:none}}
@keyframes lei-crownDrop{0%{opacity:0;transform:translateY(-60%)}60%{opacity:1}100%{opacity:1;transform:none}}
@keyframes lei-ignite{0%{opacity:0;filter:brightness(.2) saturate(0)}40%{opacity:1;filter:brightness(2.4) saturate(1.6)}100%{filter:none}}
@keyframes lei-wings{0%{opacity:0;transform:scaleX(0)}100%{opacity:1;transform:none}}
@keyframes lei-holo{0%{opacity:0;clip-path:inset(0 0 100% 0);filter:hue-rotate(90deg) brightness(1.8)}30%{opacity:.6}45%{opacity:.25}60%{opacity:.9;clip-path:inset(0 0 20% 0)}100%{opacity:1;clip-path:inset(0);filter:none}}
@keyframes lei-flipX{from{opacity:0;transform:perspective(800px) rotateY(90deg)}to{opacity:1;transform:none}}
@keyframes lei-flipY{from{opacity:0;transform:perspective(800px) rotateX(-90deg)}to{opacity:1;transform:none}}
@keyframes lei-bounce{0%{opacity:0;transform:scale(.3)}50%{opacity:1;transform:scale(1.08)}70%{transform:scale(.95)}100%{transform:none}}
@keyframes lei-elastic{0%{opacity:0;transform:scaleX(.2) scaleY(1.5)}40%{opacity:1;transform:scaleX(1.25) scaleY(.8)}60%{transform:scaleX(.9) scaleY(1.1)}80%{transform:scaleX(1.05) scaleY(.97)}100%{transform:none}}
@keyframes lei-spiral{from{opacity:0;transform:rotate(-540deg) scale(.1)}to{opacity:1;transform:none}}
@keyframes lei-blur{from{opacity:0;filter:blur(18px);transform:scale(1.15)}to{opacity:1;filter:none;transform:none}}
@keyframes lei-glitch{0%{opacity:0;transform:translateX(-8%) skewX(20deg);filter:hue-rotate(90deg)}20%{opacity:1;transform:translateX(6%) skewX(-12deg)}40%{transform:translateX(-3%);clip-path:inset(20% 0 40% 0)}60%{transform:translateX(2%);clip-path:inset(60% 0 5% 0)}80%{clip-path:inset(0);transform:none;filter:hue-rotate(-40deg)}100%{filter:none}}
@keyframes lei-curtain{from{clip-path:inset(0 50% 0 50%)}to{clip-path:inset(0 -10% 0 -10%)}}
@keyframes lei-iris{from{clip-path:circle(0% at 50% 50%)}to{clip-path:circle(100% at 50% 50%)}}
@keyframes lei-swing{0%{opacity:0;transform:rotate(-25deg);transform-origin:50% 0}40%{opacity:1;transform:rotate(14deg)}65%{transform:rotate(-7deg)}85%{transform:rotate(3deg)}100%{transform:none}}
@keyframes lei-rise{from{opacity:0;transform:translateY(25%) scale(.9);filter:blur(4px)}to{opacity:1;transform:none;filter:none}}
@keyframes lei-unfold{0%{opacity:0;transform:scale(.05,.02)}45%{opacity:1;transform:scale(1,.02)}100%{transform:none}}
@keyframes lei-light{0%{opacity:0;transform:translateX(80%) skewX(-30deg)}60%{opacity:1;transform:translateX(-6%) skewX(16deg)}80%{transform:skewX(-6deg)}100%{transform:none}}
@keyframes lei-twist{from{opacity:0;transform:perspective(700px) rotateY(-180deg) scale(.5)}to{opacity:1;transform:none}}
@keyframes lei-pop{0%{opacity:0;transform:scale(0) rotate(-30deg)}70%{opacity:1;transform:scale(1.12) rotate(6deg)}100%{transform:none}}
/* ===== حركات الخروج ===== */
.le-exit[class*="leo-"]{animation:var(--leo) .8s cubic-bezier(.5,0,.75,0) forwards}
.leo-fade{--leo:leo-fade}.leo-scatter{--leo:leo-fade}.leo-wingsClose{--leo:leo-wings}.leo-flyAway{--leo:leo-fly}.leo-portalClose{--leo:leo-portal}.leo-dim{--leo:le-out}.leo-shrink{--leo:leo-shrink}.leo-slideR{--leo:leo-slideR}.leo-slideL{--leo:leo-slideL}.leo-slideUp{--leo:leo-slideUp}.leo-slideDown{--leo:leo-slideDown}.leo-blur{--leo:leo-blur}.leo-flip{--leo:leo-flip}.leo-spin{--leo:leo-spin}.leo-glitch{--leo:leo-glitch}.leo-curtain{--leo:leo-curtain}.leo-collapse{--leo:leo-collapse}.leo-zoomOut{--leo:leo-zoomOut}.leo-sink{--leo:leo-sink}.leo-burn{--leo:leo-burn}
.leo-scatter .le-pt b{animation:le-scatter .8s ease forwards!important}.leo-scatter .le-stage>*:not(.le-pt){animation:leo-fade .5s ease forwards}
.leo-wingsClose .le-back{animation:leo-wingsB .6s ease forwards}
.leo-flyAway .le-front{animation:leo-flyF .8s ease-in forwards}
@keyframes leo-fade{to{opacity:0}}
@keyframes leo-wings{0%{opacity:1}60%{opacity:1;transform:scaleX(.35)}100%{opacity:0;transform:scaleX(0)}}
@keyframes leo-wingsB{to{transform:scaleX(0);opacity:0}}
@keyframes leo-fly{0%{opacity:1}100%{opacity:0;transform:translateY(-12%)}}
@keyframes leo-flyF{to{opacity:0;transform:translateY(-40%) scale(1.3)}}
@keyframes leo-portal{from{clip-path:circle(120% at 50% 40%)}to{clip-path:circle(0% at 50% 40%);filter:brightness(2)}}
@keyframes leo-shrink{to{opacity:0;transform:scale(.3)}}
@keyframes leo-slideR{to{opacity:0;transform:translateX(60%)}}
@keyframes leo-slideL{to{opacity:0;transform:translateX(-60%)}}
@keyframes leo-slideUp{to{opacity:0;transform:translateY(-45%)}}
@keyframes leo-slideDown{to{opacity:0;transform:translateY(45%)}}
@keyframes leo-blur{to{opacity:0;filter:blur(16px);transform:scale(1.1)}}
@keyframes leo-flip{to{opacity:0;transform:perspective(800px) rotateY(90deg)}}
@keyframes leo-spin{to{opacity:0;transform:rotate(360deg) scale(.1)}}
@keyframes leo-glitch{0%{clip-path:inset(0)}25%{transform:translateX(6%) skewX(-15deg);clip-path:inset(10% 0 50% 0);filter:hue-rotate(90deg)}50%{transform:translateX(-5%);clip-path:inset(55% 0 10% 0)}75%{opacity:.5;clip-path:inset(40% 0 40% 0)}100%{opacity:0;clip-path:inset(50% 0 50% 0)}}
@keyframes leo-curtain{from{clip-path:inset(0 -10% 0 -10%)}to{clip-path:inset(0 50% 0 50%)}}
@keyframes leo-collapse{50%{transform:scaleY(.04)}100%{opacity:0;transform:scale(0,.04)}}
@keyframes leo-zoomOut{to{opacity:0;transform:scale(1.6);filter:blur(4px)}}
@keyframes leo-sink{to{opacity:0;transform:translateY(30%) scale(.85);filter:brightness(.3)}}
@keyframes leo-burn{0%{filter:none}40%{filter:brightness(2) sepia(1) saturate(4) hue-rotate(-20deg)}100%{opacity:0;filter:brightness(.1) sepia(1) saturate(4);transform:translateY(-6%)}}
@media (prefers-reduced-motion:reduce){.lew .le-card *{animation-duration:.01s!important;animation-iteration-count:1!important}}
`;
