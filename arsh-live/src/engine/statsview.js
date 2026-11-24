// ====== شريط إحصائيات البث (Live Chat Statistics Bar) — داخل الشات أو طبقة مستقلة ======
import { View } from "./view.js";
import { esc } from "./defs.js";
import { UC_ICONS } from "./chatview.js";
import { statsSummary } from "./livestats.js";

export const SB_DESIGNS=[
 {id:"basic",n:1,name:"Basic Transparent",desc:"أرقام بظل ناعم بدون خلفية"},
 {id:"glass",n:2,name:"Glass Effect",desc:"كبسولة زجاجية ضبابية لكل منصة"},
 {id:"neonBlue",n:3,name:"Neon Blue",desc:"إطار نيون أزرق وأرقام متوهجة"},
 {id:"royalGold",n:4,name:"Royal Gold",desc:"إطار ذهبي مزدوج وأرقام ذهبية لامعة"},
 {id:"gamingHud",n:5,name:"Gaming HUD",desc:"خلايا مائلة بأقواس زوايا لكل إحصائية"},
 {id:"minimalText",n:6,name:"Minimal Text",desc:"أرقام فقط بخط صغير وفواصل نقطية"},
 {id:"cyberpunk",n:7,name:"Cyberpunk",desc:"لوحة صفراء مقصوصة وأرقام وردية"},
 {id:"rgbAnimated",n:8,name:"RGB Animated",desc:"إطار قوس قزح يدور حول الشريط"},
 {id:"floating",n:9,name:"Floating Statistics",desc:"كل إحصائية فقاعة مستقلة تطفو"},
 {id:"darkPremium",n:10,name:"Dark Premium",desc:"أعمدة: الرقم كبير والوصف تحته"},
 {id:"tiktokStyle",n:11,name:"TikTok Style",desc:"شرائح بظل وردي/سماوي مزدوج"},
 {id:"youtubeStyle",n:12,name:"YouTube Style",desc:"شارة تشغيل حمراء وشرائح بيضاء"},
 {id:"kickStyle",n:13,name:"Kick Style",desc:"أخضر على أسود بخط برمجي وزوايا حادة"},
 {id:"compactH",n:14,name:"Compact Horizontal",desc:"سطر واحد كثيف بفواصل |"},
 {id:"vertical",n:15,name:"Vertical Statistics",desc:"عمود: كل إحصائية في سطر"}];
export const SB_POS=[["top","أعلى الشات"],["bottom","أسفل الشات"],["float","شريط عائم فوق الرسائل"],["none","إخفاء الشريط"]];
export const sbDesignOf=id=>SB_DESIGNS.find(d=>d.id===id)||SB_DESIGNS[1];
const nf=n=>Number(n||0).toLocaleString("en-US");
const nc=n=>{ const v=+n||0; return v>=1e6?(v/1e6).toFixed(v>=1e7?0:1).replace(/\.0$/,"")+"M":v>=1e4?(v/1e3).toFixed(v>=1e5?0:1).replace(/\.0$/,"")+"K":nf(v) };
const CUR={USD:"$",EUR:"€",GBP:"£"};
const money=(c,a,compact)=>CUR[c]?CUR[c]+(compact?nc(a):nf(a)):(compact?nc(a):nf(a))+" "+c;
/** إعدادات الشريط من العنصر (الشات: sb* — الطبقة المستقلة: نفس المفاتيح) */
export const sbOpts=w=>({viewers:w.sbViewers!==false,views:w.sbViews!==false,money:w.sbMoney!==false,coins:w.sbCoins!==false,logo:w.sbLogo!==false,name:!!w.sbName,merge:!!w.sbMerge,bg:w.sbBg!==false,unavail:w.sbUnavail==="hide"?"hide":"show",labels:w.sbLabels!==false,support:w.sbSupport||"both"});
/** عناصر سطر واحد (منصة أو المجمّع) */
function sbItems(r,o,compact,merged){ const it=[]; const add=(k,ic,lb,val,title,unit)=>it.push({k,ic,lb,val,title,unit});
 const show=(v)=>v!==undefined; // undefined = المنصة لا توفرها أصلاً
 if(o.viewers&&show(r.viewers)){ if(r.viewers==null){ if(o.unavail==="show") add("v","👁️","الآن",null) } else add("v","👁️","الآن",compact?nc(r.viewers):nf(r.viewers),merged?"مجموع أعداد المنصات — ليس عدد أشخاص فريدين":"") }
 if(o.views&&show(r.views)){ if(r.views==null){ if(o.unavail==="show") add("w","📊","المشاهدات",null) } else add("w","📊","المشاهدات",compact?nc(r.views):nf(r.views),merged?"مجموع المنصات التي توفر إجمالي المشاهدات":"") }
 if(o.money&&o.support!=="coins"){ const M=Object.entries(r.money||{}).filter(([,a])=>a>0); if(M.length) add("m","💰","الدعم",M.map(([c,a])=>money(c,a,compact)).join(" + "),"كل عملة منفصلة — بدون تحويل"); else if(merged||r.k==="youtube"||r.k==="donation") add("m","💰","الدعم",money("USD",0,compact)) }
 if(o.coins&&o.support!=="money"&&show(r.coins)) add("c","🪙","الهدايا",compact?nc(r.coins):nf(r.coins),"كوينز TikTok — لا تُحوَّل إلى دولار",o.labels&&!compact?"كوين":"");
 if(o.money&&o.support!=="coins"&&show(r.bits)&&r.bits>0) add("b","🔷","Bits",compact?nc(r.bits):nf(r.bits));
 if(o.money&&o.support!=="coins"&&show(r.kicks)&&r.kicks>0) add("k","🟢","Kicks",compact?nc(r.kicks):nf(r.kicks));
 return it }
/** HTML الشريط كاملاً من الملخص — rows فارغة = لا شيء (لا أرقام مختلقة) */
export function sbHTML(sum,w,now){ const o=sbOpts(w), d=sbDesignOf(w.sbDesign), compact=d.id==="minimalText"||d.id==="compactH"; if(!sum) return "";
 const rows=sum.rows.filter(r=>r.k!=="donation"||(o.money&&o.support!=="coins"));
 if(!rows.length) return "";
 const plat=r=>r.k==="donation"?`<i class="lsb-lg">💸</i>`:UC_ICONS[r.k]?`<i class="lsb-lg">${UC_ICONS[r.k]}</i>`:"";
 const cell=x=>`<span class="lsb-it sb-${x.k}${x.val==null?" na":""}"${x.title?` title="${esc(x.title)}"`:""}><i class="lsb-ic">${x.ic}</i>${o.labels&&!compact?`<span class="lsb-lb">${esc(x.lb)}</span>`:""}<b class="lsb-n">${x.val==null?"غير متاح":esc(String(x.val))}</b>${x.unit&&x.val!=null?`<span class="lsb-un">${esc(x.unit)}</span>`:""}</span>`;
 let html="";
 if(o.merge&&rows.length>1){ const T=sum.total, R={k:"all",viewers:T.viewers,views:T.views,money:T.money,coins:T.coins==null?undefined:T.coins,bits:T.bits==null?undefined:T.bits,kicks:T.kicks==null?undefined:T.kicks};
  const its=sbItems(R,o,compact,true); html=`<div class="lsb-row lsb-all">${o.logo?`<span class="lsb-pl">${rows.filter(r=>r.k!=="donation").map(plat).join("")}${o.name?`<span class="lsb-pn">كل المنصات</span>`:""}</span>`:""}${its.map(cell).join("")}</div>` }
 else for(const r of rows){ const its=sbItems(r,o,compact,false); if(!its.length) continue; const stale=r.stale?` <span class="lsb-st" title="لم يصل تحديث منذ ${Math.round((now-r.at)/60000)} دقيقة">⏸</span>`:"";
  html+=`<div class="lsb-row" data-p="${r.k}">${o.logo||o.name?`<span class="lsb-pl">${o.logo?plat(r):""}${o.name?`<span class="lsb-pn">${esc(r.name)}</span>`:""}</span>`:""}${its.map(cell).join("")}${stale}</div>` }
 return html }
export function sbVars(el,w){ const s=el.style, set=(k,v)=>v==null||v===""?s.removeProperty(k):s.setProperty(k,v);
 const a=+w.sbBgA; const hex=/^#?([0-9a-f]{6})$/i.exec(String(w.sbBgC||"")); set("--sbBg",hex?`rgba(${parseInt(hex[1].slice(0,2),16)},${parseInt(hex[1].slice(2,4),16)},${parseInt(hex[1].slice(4,6),16)},${a>=0?a:.55})`:(a>=0?`rgba(0,0,0,${a})`:null));
 set("--sbNum",w.sbNumC); set("--sbTxt",w.sbTxtC); set("--sbIco",w.sbIcoC); set("--sbFs",String(+w.sbFs||1)); set("--sbIcoS",String(+w.sbIcoS||1)); set("--sbGap",String(+w.sbGap??1));
 set("--sbH",String(+w.sbH||1)); set("--sbW",(Math.max(20,Math.min(100,+w.sbW||100)))+"%"); set("--sbGlow",String(w.sbGlow??.6)); set("--sbSpd",String(Math.max(.25,+w.sbSpeed||1)));
 set("--sbFont",w.sbFont?`"${w.sbFont}"`:null) }
export const sbClass=w=>`lsb lsbd-${sbDesignOf(w.sbDesign).id}${w.sbBg===false?" lsb-nobg":""}${w.sbNeon===false?" lsb-noneon":""}${w.sbFx===false?" lsb-still":""}`;

const SB_CSS=`
.lsb{--u:calc(var(--sbFs,1)*var(--sbBase,16px));display:flex;flex-direction:column;gap:calc(var(--u)*.3*var(--sbGap,1));width:var(--sbW,100%);max-width:100%;font-family:var(--sbFont,"Readex Pro","Changa",sans-serif);font-size:var(--u);color:var(--sbTxt,#fff);direction:rtl;pointer-events:none;box-sizing:border-box}
.lsb-row{display:flex;align-items:center;flex-wrap:wrap;gap:calc(var(--u)*.55*var(--sbGap,1));padding:calc(var(--u)*.28*var(--sbH,1)) calc(var(--u)*.6);border-radius:calc(var(--u)*.55);background:var(--sbBg,rgba(0,0,0,.45));line-height:1.15;width:fit-content;max-width:100%;box-sizing:border-box}
.lsb-it{display:inline-flex;align-items:center;gap:calc(var(--u)*.28);white-space:nowrap}
.lsb-ic{font-style:normal;font-size:calc(1em*var(--sbIcoS,1));color:var(--sbIco,inherit);line-height:1}
.lsb-lb{opacity:.8;font-size:.82em}.lsb-un{opacity:.8;font-size:.8em}.lsb-lb::after{content:":"}
.lsb-n{color:var(--sbNum,#fff);font-weight:800;font-variant-numeric:tabular-nums;direction:ltr;unicode-bidi:isolate}
.lsb-it.na .lsb-n{opacity:.5;font-weight:500;font-size:.8em;direction:rtl}
.lsb-pl{display:inline-flex;align-items:center;gap:calc(var(--u)*.2)}.lsb-lg{width:calc(var(--u)*1.05);height:calc(var(--u)*1.05);display:inline-grid;place-items:center;font-style:normal}.lsb-lg svg{width:100%;height:100%}.lsb-pn{font-weight:700;font-size:.85em}
.lsb-st{opacity:.6;font-size:.8em}
.lsb-nobg .lsb-row{background:none!important;border-color:transparent!important;box-shadow:none!important}.lsb-nobg .lsb-row{text-shadow:0 1px 3px #000c}
.lsb-n.bump{animation:sbBump calc(.5s/var(--sbSpd,1)) ease}@keyframes sbBump{40%{transform:scale(1.18)}}
.lsb-still *,.lsb-still{animation:none!important}
/* 1 */.lsbd-basic .lsb-row{background:none;text-shadow:0 1px 4px #000,0 0 2px #000}
/* 2 */.lsbd-glass .lsb-row{background:var(--sbBg,rgba(255,255,255,.12));backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid #ffffff40;border-radius:99em;box-shadow:inset 0 1px 0 #ffffff50}
/* 3 */.lsbd-neonBlue .lsb-row{background:var(--sbBg,rgba(2,10,20,.6));border:calc(var(--u)*.08) solid #22d3ee;box-shadow:0 0 calc(var(--u)*.6*var(--sbGlow,.6)) #22d3ee,inset 0 0 calc(var(--u)*.4*var(--sbGlow,.6)) #22d3ee66}
 .lsbd-neonBlue .lsb-n{color:var(--sbNum,#cffafe);text-shadow:0 0 calc(var(--u)*.35*var(--sbGlow,.6)) #22d3ee}.lsbd-neonBlue.lsb-noneon .lsb-row{box-shadow:none}.lsbd-neonBlue.lsb-noneon .lsb-n{text-shadow:none}
/* 4 */.lsbd-royalGold .lsb-row{background:var(--sbBg,linear-gradient(180deg,rgba(42,29,7,.85),rgba(15,10,2,.85)));border:calc(var(--u)*.08) double #e9b949;border-radius:calc(var(--u)*.25);font-family:var(--sbFont,"Amiri","Changa",serif)}
 .lsbd-royalGold .lsb-n{background:linear-gradient(100deg,#c98b1e 20%,#fff3c4 45%,#e9b949 60%) 0 0/250% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:sbShine calc(4s/var(--sbSpd,1)) linear infinite}@keyframes sbShine{to{background-position:-250% 0}}
/* 5 */.lsbd-gamingHud .lsb-row{background:none;padding:0;gap:calc(var(--u)*.35)}.lsbd-gamingHud .lsb-pl{padding:0 .3em}
 .lsbd-gamingHud .lsb-it{background:var(--sbBg,rgba(10,12,20,.8));padding:calc(var(--u)*.3*var(--sbH,1)) calc(var(--u)*.7);transform:skewX(-12deg);border-inline-start:calc(var(--u)*.18) solid #ff2e4d;position:relative}
 .lsbd-gamingHud .lsb-it>*{transform:skewX(12deg)}.lsbd-gamingHud .lsb-it::after{content:"";position:absolute;inset-block-start:0;inset-inline-end:0;width:.5em;height:.5em;border-top:2px solid #fff8;border-inline-end:2px solid #fff8}
/* 6 */.lsbd-minimalText .lsb-row{background:none;padding:0 .2em;font-size:.85em;gap:.6em;text-shadow:0 1px 3px #000c}.lsbd-minimalText .lsb-ic{display:none}.lsbd-minimalText .lsb-it+.lsb-it::before{content:"•";opacity:.5;margin-inline-end:.6em}
/* 7 */.lsbd-cyberpunk .lsb-row{background:var(--sbBg,#fcee0a);color:var(--sbTxt,#0b0b0f);border-radius:0;clip-path:polygon(0 0,94% 0,100% 35%,100% 100%,6% 100%,0 65%);padding-inline:calc(var(--u)*1)}.lsbd-cyberpunk .lsb-n{color:var(--sbNum,#e1127e)}
/* 8 */.lsbd-rgbAnimated .lsb-row{position:relative;background:var(--sbBg,#05060c);isolation:isolate}
 .lsbd-rgbAnimated .lsb-row::before{content:"";position:absolute;inset:calc(var(--u)*-.09);z-index:-1;border-radius:inherit;background:conic-gradient(from var(--sbA,0deg),#ff004c,#ffcc00,#33ff66,#00ccff,#9a3dff,#ff004c);animation:sbSpin calc(3s/var(--sbSpd,1)) linear infinite}
 .lsbd-rgbAnimated .lsb-row::after{content:"";position:absolute;inset:0;z-index:-1;border-radius:inherit;background:var(--sbBg,#05060c)}
 @property --sbA{syntax:"<angle>";inherits:false;initial-value:0deg}@keyframes sbSpin{to{--sbA:360deg}}
/* 9 */.lsbd-floating .lsb-row{background:none;padding:0;gap:calc(var(--u)*.45)}.lsbd-floating .lsb-it{background:var(--sbBg,rgba(15,20,40,.7));border-radius:99em;padding:calc(var(--u)*.25*var(--sbH,1)) calc(var(--u)*.6);box-shadow:0 .2em .5em #0006;animation:sbBob calc(3.2s/var(--sbSpd,1)) ease-in-out infinite alternate}
 .lsbd-floating .lsb-it:nth-child(2n){animation-delay:-1.2s}.lsbd-floating .lsb-it:nth-child(3n){animation-delay:-2.1s}@keyframes sbBob{to{transform:translateY(-14%)}}
/* 10 */.lsbd-darkPremium .lsb-row{background:var(--sbBg,linear-gradient(180deg,#141414f0,#060606f0));border:1px solid #ffffff1f;border-radius:calc(var(--u)*.4);gap:0;padding:0}
 .lsbd-darkPremium .lsb-it{flex-direction:column-reverse;gap:.1em;padding:calc(var(--u)*.4*var(--sbH,1)) calc(var(--u)*.9);border-inline-start:1px solid #ffffff1f}.lsbd-darkPremium .lsb-pl{padding:0 .6em}
 .lsbd-darkPremium .lsb-n{font-size:1.25em}.lsbd-darkPremium .lsb-lb{font-size:.62em;letter-spacing:.06em}.lsbd-darkPremium .lsb-lb::after{content:""}.lsbd-darkPremium .lsb-ic{position:absolute;opacity:0}
/* 11 */.lsbd-tiktokStyle .lsb-row{background:none;padding:0;gap:calc(var(--u)*.4)}.lsbd-tiktokStyle .lsb-it{background:var(--sbBg,#111);border-radius:calc(var(--u)*.35);padding:calc(var(--u)*.25*var(--sbH,1)) calc(var(--u)*.55);box-shadow:-.12em -.08em 0 #25f4ee,.12em .08em 0 #fe2c55}
/* 12 */.lsbd-youtubeStyle .lsb-row{background:var(--sbBg,#ffffff);color:var(--sbTxt,#0f0f0f);border-radius:calc(var(--u)*.35)}.lsbd-youtubeStyle .lsb-n{color:var(--sbNum,#0f0f0f)}
 .lsbd-youtubeStyle .lsb-row::before{content:"▶";display:inline-grid;place-items:center;width:1.5em;height:1.05em;border-radius:.3em;background:#ff0033;color:#fff;font-size:.8em}
/* 13 */.lsbd-kickStyle .lsb-row{background:var(--sbBg,#0b0e0f);border:1px solid #53fc18;border-radius:0}.lsbd-kickStyle .lsb-n{color:var(--sbNum,#53fc18);font-family:var(--sbFont,ui-monospace,"SFMono-Regular",monospace)}.lsbd-kickStyle .lsb-lb{text-transform:uppercase}
/* 14 */.lsbd-compactH .lsb-row{gap:0;padding:calc(var(--u)*.18*var(--sbH,1)) calc(var(--u)*.45);font-size:.85em;border-radius:calc(var(--u)*.25)}.lsbd-compactH .lsb-it+.lsb-it::before{content:"|";opacity:.4;margin:0 .45em}
/* 15 */.lsbd-vertical .lsb-row{flex-direction:column;align-items:stretch;gap:calc(var(--u)*.2*var(--sbGap,1));border-radius:calc(var(--u)*.5)}.lsbd-vertical .lsb-it{justify-content:space-between;gap:1em}.lsbd-vertical .lsb-pl{justify-content:center;border-bottom:1px solid #ffffff22;padding-bottom:.2em}
/* داخل الشات */
.ucw .lsb-host{flex:none;z-index:2}.ucw .lsb-host.lsb-float{position:absolute;inset-inline:0;top:0}
.wd.t-chatstats{display:flex;align-items:center;justify-content:center;overflow:visible}.wd.t-chatstats .lsb{max-height:100%}
.lsb-empty{font-size:12px;opacity:.6;padding:.4em .8em;border:1px dashed #ffffff44;border-radius:.6em;color:#fff}
`;
let sbCss=false;
export function ensureSbCSS(){ if(sbCss||typeof document==="undefined") return; sbCss=true; const st=document.createElement("style"); st.id="b6o6-sb"; st.textContent=SB_CSS; document.head.appendChild(st) }
/** بيانات نموذجية للمعاينة في المحرر/المكتبة فقط */
export const sbDemo=()=>({since:Date.now()-3600e3,rows:[{k:"tiktok",name:"TikTok",viewers:1500,views:20000,coins:5000,money:{},at:Date.now()},{k:"youtube",name:"YouTube",viewers:350,views:3000,money:{USD:50},at:Date.now()},{k:"kick",name:"Kick",viewers:200,views:undefined,kicks:0,money:{},at:Date.now()}],
 total:{viewers:2050,views:23000,coins:5000,bits:null,kicks:0,money:{USD:50}}});
/** تحديث محتوى الشريط بدون إعادة بناء إن لم يتغير (مع نبضة للأرقام المتغيرة) */
export function sbRender(box,sum,w,now){ const html=sbHTML(sum,w,now); if(box._sbh===html) return; const old=box._sbn||{};
 box.innerHTML=html; box._sbh=html; box.style.display=html?"":"none";
 const nn={}; box.querySelectorAll(".lsb-row").forEach((r,i)=>r.querySelectorAll(".lsb-it").forEach((it,j)=>{ const k=(r.dataset.p||"all")+":"+[...it.classList].find(c=>/^sb-[a-z]$/.test(c)); const v=it.querySelector(".lsb-n").textContent; nn[k]=v; if(old[k]!==undefined&&old[k]!==v&&w.sbFx!==false) it.querySelector(".lsb-n").classList.add("bump") }));
 box._sbn=nn }
export const sbSum=(src,w,demo)=>demo?sbDemo():statsSummary((src&&src.C)||{},Date.now()+(+(src&&src.skew)||0));

Object.assign(View.prototype,{
 applySb(w,W,Hh){ ensureSbCSS(); const e=this.el; e.innerHTML=`<div class="${sbClass(w)}"></div>`; this.sbBox=e.firstChild; sbVars(this.sbBox,w);
  this.sbBox.style.setProperty("--sbBase",Math.max(9,Math.min(Hh*.26,W*.045))+"px"); this.sbBox._sbh=null;
  if(this.opts.data) this.refreshSb(this.opts.data()) },
 refreshSb(src){ if(!this.sbBox) return; const w=this.w, demo=this.opts.editor||String(w.id).startsWith("pv_");
  const sum=sbSum(src,w,false), use=(!sum.rows.length&&demo)?sbDemo():sum; sbRender(this.sbBox,use,w,Date.now());
  if(!this.sbBox._sbh&&this.opts.editor){ this.sbBox.innerHTML=`<div class="lsb-empty">📊 إحصائيات البث — تظهر عند اتصال منصة</div>`; this.sbBox.style.display="" } }
});
