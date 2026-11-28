// ====== اتجاه وترتيب العناصر — B6O6 Fantastic Mirror Layout ======
// يعمل على كل القوائم والطبقات الحالية والمستقبلية بدون تصميم جديد لكل اتجاه:
// - إعادة ترتيب فعلية: عكس اتجاه التخطيط (direction) فتنعكس صفوف flex/grid ومواقع العناصر،
//   بينما النصوص العربية والإنجليزية والأرقام والصور تبقى سليمة (لا يوجد scaleX(-1) على المحتوى).
// - القوائم ذات المواقع المحسوبة (قوائم Pro والتتويج) تُعكس مواقع خاناتها برمجياً مع بقاء ترتيب المراكز.
// - «الصورة يمين/يسار» يقيس موقع صورة المستخدم الفعلي في التصميم ثم يقرر العكس — يصلح لأي تصميم.
// - الحجم والموقع والشفافية لا تتغير.
import { View } from "./view.js";

export const MIR_MODES=[["default","الاتجاه الافتراضي للتصميم"],["right","صورة المستخدم على اليمين"],["left","صورة المستخدم على اليسار"],["reverse","عكس ترتيب القائمة بالكامل"]];
export const MIR_PARTS=[["rank","رقم الترتيب",".rk,.lr-rk,.d5-rank"],["av","صورة المستخدم",".av,.lr-av,.le-av,.rb-ic,.d5-av"],["name","الاسم",".nm,.lr-nm,.d5-name,.rb-what,.le-name"],["val","العداد / القيمة",".vl,.lr-vl,.d5-amt,.rb-val"]];
const MIR_AV=".lr-av,.av,.le-av,.rb-ic,.d5-av,.fc-av,.uc-av";
/** الأنواع التي لا معنى للاتجاه فيها (بدون واجهة) */
export const MIR_SKIP=new Set(["sndplayer","abox","rotator"]);
let mirCss=false;
function ensureMirCSS(){ if(mirCss||typeof document==="undefined") return; mirCss=true; const st=document.createElement("style"); st.id="b6o6-mir"; st.textContent=MIR_CSS; document.head.appendChild(st) }

Object.assign(View.prototype,{
 /** يطبّق الاتجاه بعد كل رسم — مستقل عن نوع العنصر */
 mirSync(){ const w=this.w; if(!w||MIR_SKIP.has(w.type)) return; ensureMirCSS(); const el=this.el, m=w.mir||"default";
  this.mirExtras();
  const key=[w.type,w.design,w.layout||"",w.kind||"",w.mode||""].join("|");
  if(this.mirKey!==key){ this.mirKey=key; this.mirBase=null; if(this.mirOn) this.mirSet(false) }
  if(m==="default"){ this.mirSet(false); return }
  if(m==="reverse"){ this.mirSet(true); return }
  if(!this.mirBase){ if(this.mirOn) this.mirSet(false); const s=this.mirSide(); if(!s){ this.mirRetry(); return } this.mirBase=s }
  this.mirSet(this.mirBase!=="center"&&this.mirBase!==m) },
 mirSet(on){ const el=this.el; on=!!on;
  if(!on||!this.mirDir0){ el.style.direction=""; this.mirDir0=getComputedStyle(el).direction||"rtl" }
  // قوائم Pro عناصرها بمواقع مطلقة: يُعكس الصف في مكانه ثم يُعاد النص والأرقام والصور لوضعها الطبيعي (المحصلة: مواقع معكوسة ومحتوى سليم)
  const abs=this.w.type==="lb"; el.classList.toggle("mir-s",on&&abs); el.classList.toggle("mir-x",on&&!abs); el.style.direction=on&&!abs?(this.mirDir0==="rtl"?"ltr":"rtl"):""; const nd=on&&!abs?(this.mirDir0==="rtl"?"ltr":"rtl"):""; el.classList.toggle("mir-ltr",nd==="ltr"); el.classList.toggle("mir-rtl",nd==="rtl");
  const motion=on!==!!this.w.mirMotion; el.classList.toggle("mir-m",motion); el.style.setProperty("--mdir",motion?"-1":"1");
  if(this.mirOn!==on){ this.mirOn=on; if(this.layoutRows) try{ this.layoutRows() }catch(e){} } },
 /** موقع صورة المستخدم الحالي بالنسبة لمنتصف العنصر */
 mirSide(){ const el=this.el; const r=el.getBoundingClientRect(); if(!r.width) return null;
  const avs=[...el.querySelectorAll(MIR_AV)].filter(a=>{ const b=a.getBoundingClientRect(); return b.width>0&&b.height>0 }); if(!avs.length) return null;
  // صف عادي (ليس منصة تتويج): نقارن الصورة بالاسم في نفس الصف
  let stacked=0;
  for(const a of avs){ const row=a.parentElement; const nm=row&&row.querySelector(".nm,.lr-nm,.d5-name,.rb-what,.le-name"); if(nm){ const ab=a.getBoundingClientRect(), nb=nm.getBoundingClientRect(); if(Math.abs((ab.left+ab.width/2)-(nb.left+nb.width/2))>4&&Math.abs((ab.top+ab.height/2)-(nb.top+nb.height/2))<ab.height) return ab.left>nb.left?"right":"left"; stacked++ } }
  if(stacked) return "center"; // الصورة فوق الاسم (منصات/بطاقات عمودية): لا يمين ولا يسار — «عكس الكل» يعكس مواقع الخانات
  const a=avs[0].getBoundingClientRect(), cx=a.left+a.width/2, rc=r.left+r.width/2; if(Math.abs(cx-rc)<r.width*.06) return "center"; return cx>rc?"right":"left" },
 mirRetry(){ if(this.mirT) return; let n=0; const run=()=>{ this.mirT=0; if(!this.el.isConnected&&n>0) return; if(this.mirBase) return; n++; this.mirSync(); if(!this.mirBase&&n<12&&!this.mirT) this.mirT=setTimeout(run,Math.min(2000,120*n)) }; this.mirT=setTimeout(run,60) },
 /** المحاذاة والمسافات والترتيب المخصص لكل عنصر */
 mirExtras(){ const w=this.w, S=this.el.style, set=(k,v)=>v!=null&&v!==""?S.setProperty(k,v):S.removeProperty(k);
  set("--mir-al",w.mirAlign||""); this.el.classList.toggle("mir-al",!!w.mirAlign);
  set("--mir-gap",w.mirGap>0?(+w.mirGap)+"em":""); this.el.classList.toggle("mir-g",w.mirGap>0);
  set("--mir-rgap",w.mirRowGap>0?(+w.mirRowGap)+"px":""); this.el.classList.toggle("mir-rg",w.mirRowGap>0);
  const O=w.mirOrder&&typeof w.mirOrder==="object"?w.mirOrder:null; this.el.classList.toggle("mir-o",!!O);
  for(const [k] of MIR_PARTS) set("--o-"+k,O&&O[k]!=null?String(+O[k]):"") },
});
// كل رسم/تحديث لأي عنصر يمر بالاتجاه المختار
const mirAp=View.prototype.apply; View.prototype.apply=function(w,a){ const r=mirAp.call(this,w,a); try{ this.mirSync() }catch(e){} return r };
const mirRf=View.prototype.refresh; View.prototype.refresh=function(src,s){ const r=mirRf.call(this,src,s); if(this.w&&(this.w.mir==="right"||this.w.mir==="left")&&!this.mirBase) try{ this.mirSync() }catch(e){} return r };

/** نسخة الاتجاه للعناصر ذات المواقع المحسوبة (قوائم Pro): عكس أفقي للخانة داخل المساحة */
export function mirX(view,x,w,W){ return view&&view.mirOn?Math.max(0,W-x-w):x }
/** قلب الصف في مكانه (يُضاف بعد الإزاحة حتى لا ينعكس موقع الخانة نفسه) */
export const mirFlipT=view=>view&&view.mirOn&&view.w&&view.w.type==="lb"?" scaleX(-1)":"";

const MIR_CSS=`
.wd.mir-ltr :is(.nm,.d5-name,.rb-what,.le-name){text-align:left}.wd.mir-rtl :is(.nm,.d5-name,.rb-what,.le-name){text-align:right}
.wd.mir-s .lr{transform-origin:50% 50%!important}
.wd.mir-s .lr :is(.lr-nm,.lr-vl,.lr-rk,.ped>b),.wd.mir-s .lr .lr-av>img{scale:-1 1!important}
.wd.mir-s .lr.k-row .lr-nm{text-align:left!important}
.wd.mir-x .lr-nm,.wd.mir-x .nm,.wd.mir-x .d5-name,.wd.mir-x .rb-what,.wd.mir-x .le-name,.wd.mir-x .le-title,.wd.mir-x .le-msg,.wd.mir-x .vl,.wd.mir-x .lr-vl,.wd.mir-x .d5-amt,.wd.mir-x .rb-val,.wd.mir-x .wt,.wd.mir-x .rb-t{unicode-bidi:plaintext}
.wd.mir-al .nm,.wd.mir-al .lr-nm,.wd.mir-al .d5-name,.wd.mir-al .rb-what,.wd.mir-al .le-name{text-align:var(--mir-al)!important;justify-content:var(--mir-al)}
.wd.mir-g :is(.r,.lr,.d5-row,.rb-row){column-gap:var(--mir-gap)!important}
.wd.mir-rg :is(.rows,.d5-rows,.rb-list){row-gap:var(--mir-rgap)!important}
.wd.mir-o :is(.rk,.lr-rk,.d5-rank){order:var(--o-rank,0)}.wd.mir-o :is(.av,.lr-av,.le-av,.rb-ic,.d5-av){order:var(--o-av,0)}.wd.mir-o :is(.nm,.lr-nm,.d5-name,.rb-what,.le-name){order:var(--o-name,0)}.wd.mir-o :is(.vl,.lr-vl,.d5-amt,.rb-val){order:var(--o-val,0)}
`;
