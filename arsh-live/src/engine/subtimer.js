// ====== مؤقت السابثون — B6O6 Fantastic Timer Collection V3 ======
// 50 تصميماً مستقلاً تعتمد كلها على مصدر وقت مركزي واحد (حالة السابثون في الخادم: remaining(C.subathon)).
// التصميم = هيكل (طريقة عرض الوقت) + عارض أرقام + زخرفة + مؤثر زيادة + مؤثر نقصان + مؤثر اقتراب النهاية.
// تغيير التصميم لا يغيّر الوقت ولا الحالة، والمعاينة لا تلمس العداد الحقيقي.
import { View } from "./view.js";
import { remaining, MIN, HOUR } from "./clock.js";
import { esc } from "./defs.js";

const SEC=1000, DAY=24*HOUR;
export const ST_GROUPS={g1:"الشفافة والبسيطة",g2:"الملكية والفاخرة",g3:"القيمنق والتقنية",g4:"التفاعلية",g5:"السينمائية والحصرية"};
export const ST_FORMATS=[["hms","05:30:25 (ساعات بلا حد)"],["dhms","5 أيام | 12:30:25"],["units","05D : 12H : 30M : 25S"],["words","يومان و5 ساعات"]];
export const ST_PRESETS={full:"Full Design",basic:"Basic",alpha:"Transparent",numbers:"Numbers Only",text:"Text Only",underline:"Underline",custom:"Custom"};
export const ST_STAGES_DEF=[[0,"Basic"],[1,"Bronze"],[3,"Silver"],[6,"Gold"],[12,"Diamond"],[24,"Legendary"],[48,"Fantastic"],[72,"Ultimate"],[100,"Infinite"]];
export const ST_TIERS_DEF=[5,30,120]; // دقائق: بسيطة <5 ≤ متوسطة <30 ≤ كبيرة <120 ≤ أسطورية

/* ---------------- تنسيق الوقت (لا يتصفر بعد 24 ساعة) ---------------- */
const stP2=n=>String(n).padStart(2,"0");
function arDays(d){ return d===1?"يوم":d===2?"يومان":d<=10?d+" أيام":d+" يوماً" }
function arHours(h){ return h===1?"ساعة":h===2?"ساعتان":h<=10?h+" ساعات":h+" ساعة" }
/** يعيد وحدات العرض حسب التنسيق والخيارات */
export function stUnits(ms,o={}){ const s=Math.max(0,Math.ceil(ms/SEC)), d=Math.floor(s/86400), h=Math.floor(s/3600), hd=Math.floor(s/3600)%24, m=Math.floor(s/60)%60, x=s%60, f=o.fmt||"hms";
 const sh=k=>o[k]!==false;
 if(f==="words"){ const parts=[]; if(d) parts.push(arDays(d)); if(hd||!d) parts.push(arHours(hd)); if(!d&&sh("showM")) parts.push(m+" دقيقة"); return {words:parts.join(" و"),u:[]} }
 const U=[];
 if(f==="dhms"||f==="units"){ if(f==="units"&&d&&sh("showD")) U.push({k:"d",v:stP2(d),l:f==="units"?"D":(d===1?"يوم":d===2?"يومان":"أيام")}); if(sh("showH")) U.push({k:"h",v:stP2(d?hd:h%24),l:f==="units"?"H":"ساعة"}) }
 else if(sh("showH")) U.push({k:"h",v:stP2(h),l:"ساعة"});
 if(sh("showM")) U.push({k:"m",v:stP2(m),l:f==="units"?"M":"دقيقة"}); if(sh("showS")) U.push({k:"s",v:stP2(x),l:f==="units"?"S":"ثانية"});
 return {u:U,days:f==="dhms"&&d?arDays(d):""} }
export function stDelta(ms){ const a=Math.abs(ms), s=Math.round(a/1000), sign=ms<0?"−":"+"; if(s>=3600){ const h=Math.floor(s/3600), m=Math.round((s%3600)/60); return sign+h+" ساعة"+(m?" "+m+" د":"") } if(s>=60) return sign+Math.round(s/60)+" دقيقة"; return sign+s+" ثانية" }

/* ---------------- المؤثرات (WAAPI) ---------------- */
let ST_LIVE=0, ST_NOCAP=false;
const stR=(a,b)=>a+Math.random()*(b-a);
function stA(el,kf,o){ if(!el||!el.animate) return null; try{ return el.animate(kf,Object.assign({fill:"backwards"},o)) }catch(e){ return null } }
function stFx(host,c,cls,css,life){ if(!host||c.lite||(!ST_NOCAP&&ST_LIVE>70)) return null; const e=document.createElement("i"); e.className="stx "+cls; if(css) e.style.cssText=css; host.appendChild(e); ST_LIVE++; setTimeout(()=>{ e.remove(); ST_LIVE=Math.max(0,ST_LIVE-1) },life||c.d*2); return e }
/** مؤثرات الزيادة: كل واحد مختلف فعلياً (بصمة حركية فريدة) — يُطبّق على: num (الأرقام) · root · fx (طبقة شفافة) · deco */
export const ST_ADD={
 sheen(q,c){ const e=stFx(q.fx,c,"stx-sheen"); stA(e,[{left:"-30%"},{left:"110%"}],{duration:c.d,easing:"ease-in-out"}) },
 lineSurge(q,c){ stA(q.ln,[{transform:"scaleX(.2)",filter:"brightness(2.5)"},{transform:"scaleX(1)",filter:"none"}],{duration:c.d,easing:"cubic-bezier(.2,.9,.3,1)"}) },
 floatUp(q,c){ stA(q.num,[{transform:"translateY(0)"},{transform:`translateY(${-14*c.p}%)`,offset:.4},{transform:"translateY(0)"}],{duration:c.d*1.2,easing:"cubic-bezier(.3,1.4,.5,1)"}) },
 splitBounce(q,c){ q.units.forEach((u,i)=>stA(u,[{transform:"scale(1)"},{transform:`scale(${1+.18*c.p})`,offset:.3},{transform:"scale(1)"}],{duration:c.d*.7,delay:i*90,easing:"ease-out"})) },
 neonFlick(q,c){ stA(q.num,[{opacity:1},{opacity:.3,offset:.1},{opacity:1,offset:.2},{opacity:.5,offset:.3},{opacity:1}],{duration:c.d*.8,easing:"steps(5)"}) },
 inkSpread(q,c){ stA(q.num,[{letterSpacing:".25em",opacity:.2},{letterSpacing:"0em",opacity:1}],{duration:c.d,easing:"cubic-bezier(.16,1,.3,1)"}) },
 depthPush(q,c){ stA(q.num,[{textShadow:"0 0 0 transparent"},{textShadow:`${6*c.p}px ${8*c.p}px 0 rgba(0,0,0,.6)`,offset:.4},{textShadow:"3px 4px 0 rgba(0,0,0,.6)"}],{duration:c.d}) },
 stackSlide(q,c){ q.units.forEach((u,i)=>stA(u,[{transform:`translateX(${(i%2?1:-1)*30*c.p}%)`,opacity:0},{transform:"none",opacity:1}],{duration:c.d*.7,delay:i*70,easing:"cubic-bezier(.2,.8,.2,1)"})) },
 miniPop(q,c){ stA(q.root,[{transform:"scale(1)"},{transform:`scale(${1+.08*c.p})`,offset:.35},{transform:"scale(1)"}],{duration:c.d*.6}) },
 haloPulse(q,c){ const e=stFx(q.fx,c,"stx-halo"); stA(e,[{transform:"translate(-50%,-50%) scale(.4)",opacity:.9},{transform:`translate(-50%,-50%) scale(${1.6*c.p})`,opacity:0}],{duration:c.d*1.4,easing:"ease-out"}) },
 crownRise(q,c){ stA(q.deco,[{transform:"translateY(0)"},{transform:`translateY(${-18*c.p}%) rotate(-6deg)`,offset:.4},{transform:"none"}],{duration:c.d*1.1,easing:"cubic-bezier(.3,1.5,.5,1)"}); for(let i=0;i<10;i++){ const e=stFx(q.fx,c,"stx-gold",`left:${stR(15,85)}%;top:${stR(30,70)}%`); stA(e,[{transform:"translateY(0) scale(1)",opacity:1},{transform:`translateY(${-60*c.p}px) scale(0)`,opacity:0}],{duration:c.d*1.4,delay:i*40}) } },
 diamondFacets(q,c){ ["polygon(0 0,30% 0,10% 100%,0 100%)","polygon(35% 0,65% 0,50% 100%)","polygon(70% 0,100% 0,100% 100%,85% 100%)"].forEach((p,i)=>{ const e=stFx(q.fx,c,"stx-facet",`clip-path:${p}`); stA(e,[{opacity:0},{opacity:.9,offset:.4},{opacity:0}],{duration:c.d*.7,delay:i*120}) }) },
 metalSweep(q,c){ const e=stFx(q.fx,c,"stx-metal"); stA(e,[{backgroundPosition:"200% 0"},{backgroundPosition:"-100% 0"}],{duration:c.d*1.1,easing:"cubic-bezier(.7,0,.3,1)"}); stA(q.num,[{filter:"grayscale(1) brightness(1.6)"},{filter:"none"}],{duration:c.d}) },
 refract(q,c){ stA(q.num,[{textShadow:`${-6*c.p}px 0 rgba(0,229,255,.8),${6*c.p}px 0 rgba(255,60,180,.8)`},{textShadow:"0 0 0 transparent,0 0 0 transparent"}],{duration:c.d*.9}) },
 watchTick(q,c){ stA(q.hand,[{transform:"rotate(0deg)"},{transform:"rotate(360deg)"}],{duration:c.d*1.2,easing:"cubic-bezier(.5,0,.2,1)",composite:"add"}); stA(q.num,[{transform:"scale(.94)"},{transform:"none"}],{duration:c.d*.5}) },
 gemLight(q,c){ (q.gems||[]).forEach((g,i)=>stA(g,[{filter:"brightness(1)",transform:"scale(1)"},{filter:"brightness(2.4) drop-shadow(0 0 8px #34d399)",transform:"scale(1.3)",offset:.4},{filter:"brightness(1)",transform:"scale(1)"}],{duration:c.d,delay:i*80})) },
 patternDraw(q,c){ const s=q.deco&&q.deco.querySelector("path"); if(s) stA(s,[{strokeDashoffset:100},{strokeDashoffset:0}],{duration:c.d*1.2}); stA(q.num,[{opacity:.4},{opacity:1}],{duration:c.d*.6}) },
 crownStage(q,c){ stA(q.deco,[{transform:"scale(1) rotate(0)"},{transform:`scale(${1+.25*c.p}) rotate(8deg)`,offset:.3},{transform:"scale(1) rotate(-4deg)",offset:.6},{transform:"none"}],{duration:c.d*1.1}) },
 spotlightSweep(q,c){ const e=stFx(q.fx,c,"stx-spot"); stA(e,[{left:"0%",opacity:0},{left:"50%",opacity:1,offset:.5},{left:"100%",opacity:0}],{duration:c.d*1.4}) },
 orbitBurst(q,c){ for(let i=0;i<12;i++){ const a=i/12*Math.PI*2, e=stFx(q.fx,c,"stx-dia",`left:50%;top:50%`); stA(e,[{transform:"translate(-50%,-50%) rotate(45deg) scale(.2)",opacity:1},{transform:`translate(calc(-50% + ${Math.cos(a)*90*c.p}px),calc(-50% + ${Math.sin(a)*50*c.p}px)) rotate(45deg) scale(1)`,opacity:0}],{duration:c.d*1.2}) } },
 hudBrackets(q,c){ ["a","b"].forEach((k,i)=>{ const e=stFx(q.fx,c,"stx-br stx-br-"+k); stA(e,[{transform:`translateX(${(i?-1:1)*40}px)`,opacity:0},{transform:"none",opacity:1,offset:.5},{opacity:0}],{duration:c.d*1.2}) }) },
 glitchSlice(q,c){ stA(q.num,[{clipPath:"inset(0 0 60% 0)",transform:`translateX(${6*c.p}px)`},{clipPath:"inset(40% 0 20% 0)",transform:`translateX(${-6*c.p}px)`,offset:.25},{clipPath:"inset(0)",transform:"none"}],{duration:c.d*.6,easing:"steps(3)"}) },
 scanlines(q,c){ const e=stFx(q.fx,c,"stx-scan"); stA(e,[{backgroundPosition:"0 0",opacity:.9},{backgroundPosition:"0 30px",opacity:0}],{duration:c.d*1.2,easing:"linear"}) },
 matrixDrop(q,c){ for(let i=0;i<14;i++){ const e=stFx(q.fx,c,"stx-code",`left:${i*7+2}%`); if(e) e.textContent=String.fromCharCode(48+Math.floor(stR(0,10))); stA(e,[{top:"-20%",opacity:1},{top:"110%",opacity:0}],{duration:c.d*stR(.8,1.4),delay:stR(0,c.d*.4),easing:"linear"}) } },
 reactorSurge(q,c){ (q.rings||[]).forEach((r,i)=>stA(r,[{transform:"scale(1)",opacity:.5},{transform:`scale(${1.2+i*.1})`,opacity:1,offset:.4},{transform:"scale(1)",opacity:.5}],{duration:c.d,delay:i*100})) },
 raceLights(q,c){ (q.lights||[]).forEach((l,i)=>stA(l,[{background:"#300"},{background:"#ff2a2a",offset:.3},{background:"#2aff6a"}],{duration:c.d,delay:i*120})) },
 esportsWipe(q,c){ stA(q.root,[{clipPath:"polygon(0 0,0 0,0 100%,0 100%)"},{clipPath:"polygon(0 0,100% 0,100% 100%,0 100%)"}],{duration:c.d*.6,easing:"cubic-bezier(.8,0,.2,1)"}) },
 radarPing(q,c){ const e=stFx(q.fx,c,"stx-ping"); stA(e,[{transform:"translate(-50%,-50%) scale(.1)",opacity:1},{transform:"translate(-50%,-50%) scale(2)",opacity:0}],{duration:c.d*1.2}) },
 boltStrike(q,c){ const e=stFx(q.fx,c,"stx-bolt"); if(e){ e.innerHTML='<svg viewBox="0 0 100 20" preserveAspectRatio="none"><polyline fill="none" stroke="currentColor" stroke-width="2" vector-effect="non-scaling-stroke" points="0,10 10,4 20,15 30,6 42,14 55,3 66,16 78,7 90,13 100,9"/></svg>' } stA(e,[{opacity:1},{opacity:.2,offset:.2},{opacity:1,offset:.35},{opacity:0}],{duration:c.d,easing:"steps(4)"}) },
 flipCards(q,c){ q.units.forEach((u,i)=>stA(u,[{transform:"perspective(300px) rotateX(-90deg)"},{transform:"perspective(300px) rotateX(0)"}],{duration:c.d*.6,delay:i*80,easing:"cubic-bezier(.3,1.4,.5,1)"})) },
 sandFlow(q,c){ stA(q.sandB,[{transform:"scaleY(.92)"},{transform:"scaleY(1)"}],{duration:c.d}); for(let i=0;i<10;i++){ const e=stFx(q.fx,c,"stx-sand",`left:${stR(44,56)}%`); stA(e,[{top:"30%",opacity:1},{top:"72%",opacity:0}],{duration:c.d*stR(.6,1),delay:i*50,easing:"ease-in"}) } },
 liquidRise(q,c){ stA(q.wave,[{transform:"translateX(0)"},{transform:"translateX(-50%)"}],{duration:c.d*1.4,easing:"ease-out"}); for(let i=0;i<8;i++){ const e=stFx(q.fx,c,"stx-bub",`left:${stR(15,85)}%`); stA(e,[{bottom:"5%",opacity:.9},{bottom:"85%",opacity:0}],{duration:c.d*stR(1,1.6),delay:i*80}) } },
 chargeCells(q,c){ (q.cells||[]).forEach((x,i)=>stA(x,[{filter:"brightness(1)"},{filter:"brightness(2.2)",offset:.5},{filter:"brightness(1)"}],{duration:c.d*.6,delay:i*70})); const e=stFx(q.fx,c,"stx-zap"); stA(e,[{opacity:0},{opacity:1,offset:.2},{opacity:0}],{duration:c.d*.6}) },
 heartSpike(q,c){ stA(q.ecg,[{strokeDashoffset:100},{strokeDashoffset:0}],{duration:c.d*.8}); stA(q.num,[{transform:"scale(1)"},{transform:`scale(${1+.1*c.p})`,offset:.15},{transform:"scale(1)",offset:.3},{transform:`scale(${1+.06*c.p})`,offset:.45},{transform:"scale(1)"}],{duration:c.d}) },
 flameFlare(q,c){ stA(q.flame,[{transform:"scaleY(1)",filter:"brightness(1)"},{transform:`scaleY(${1.4*c.p})`,filter:"brightness(1.6)",offset:.4},{transform:"scaleY(1)",filter:"brightness(1)"}],{duration:c.d*1.2,easing:"ease-out"}) },
 frostThaw(q,c){ stA(q.num,[{filter:"blur(3px) saturate(.2) brightness(1.6)"},{filter:"none"}],{duration:c.d}); const e=stFx(q.fx,c,"stx-frost"); stA(e,[{opacity:.8},{opacity:0}],{duration:c.d}) },
 orbitSpeed(q,c){ (q.orbits||[]).forEach((o,i)=>stA(o,[{transform:"translate(-50%,-50%) rotate(0)"},{transform:`translate(-50%,-50%) rotate(${i%2?-360:360}deg)`}],{duration:c.d*1.4,easing:"cubic-bezier(.3,0,.2,1)",composite:"add"})) },
 eclipseShift(q,c){ stA(q.moon,[{transform:"translateX(0)"},{transform:`translateX(${-30*c.p}%)`,offset:.5},{transform:"translateX(0)"}],{duration:c.d*1.4}); stA(q.sun,[{filter:"brightness(1)"},{filter:"brightness(2)",offset:.5},{filter:"brightness(1)"}],{duration:c.d*1.4}) },
 ringFill(q,c){ stA(q.prg,[{strokeWidth:6},{strokeWidth:11,offset:.4},{strokeWidth:6}],{duration:c.d}); const e=stFx(q.fx,c,"stx-halo"); stA(e,[{transform:"translate(-50%,-50%) scale(.6)",opacity:.7},{transform:"translate(-50%,-50%) scale(1.3)",opacity:0}],{duration:c.d}) },
 infinityRun(q,c){ stA(q.dot,[{r:4},{r:10,offset:.3},{r:4}],{duration:c.d*1.2}); const p=q.root.querySelector(".st-inf path"); stA(p,[{opacity:.55,strokeWidth:2.4},{opacity:1,strokeWidth:5,offset:.35},{opacity:.55,strokeWidth:2.4}],{duration:c.d*1.2}) },
 cineBars(q,c){ ["t","b"].forEach(k=>{ const e=stFx(q.fx,c,"stx-cine stx-cine-"+k); stA(e,[{transform:"scaleY(0)"},{transform:"scaleY(1)",offset:.3},{transform:"scaleY(1)",offset:.7},{transform:"scaleY(0)"}],{duration:c.d*1.5}) }); stA(q.num,[{transform:"scale(1.15)",filter:"blur(4px)"},{transform:"none",filter:"none"}],{duration:c.d}) },
 butterflies(q,c){ for(let i=0;i<5;i++){ const e=stFx(q.fx,c,"stx-bfly",`left:${20+i*15}%;top:70%`); if(e) e.innerHTML='<svg viewBox="0 0 20 14"><path d="M10 7C6 0 0 1 2 6c1 3 5 2 8 1zM10 7c4-7 10-6 8-1-1 3-5 2-8 1z" fill="currentColor"/></svg>'; stA(e,[{transform:"translate(0,0) scale(.6)",opacity:0},{transform:`translate(${stR(-30,30)}px,${-50*c.p}px) scale(1)`,opacity:1,offset:.5},{transform:`translate(${stR(-50,50)}px,${-90*c.p}px) scale(.8)`,opacity:0}],{duration:c.d*1.8,delay:i*90}) } },
 auroraWave(q,c){ ["#22e1ff","#7c3aed","#22c55e"].forEach((col,i)=>{ const e=stFx(q.fx,c,"stx-aur",`background:radial-gradient(closest-side,${col},transparent);left:${20+i*30}%`); stA(e,[{transform:"translate(-50%,-50%) scale(.3)",opacity:0},{transform:"translate(-50%,-50%) scale(1.3)",opacity:.6,offset:.5},{opacity:0}],{duration:c.d*1.6,delay:i*100}) }) },
 gravityPull(q,c){ for(let i=0;i<14;i++){ const e=stFx(q.fx,c,"stx-pt",`left:${stR(5,95)}%;top:-5%`); stA(e,[{transform:"translateY(0)",opacity:1},{transform:`translateY(${stR(60,110)}px)`,opacity:1,offset:.7},{transform:`translateY(${stR(55,105)}px)`,opacity:0}],{duration:c.d*1.2,delay:i*30,easing:"cubic-bezier(.5,0,1,.5)"}) } },
 prismSplit(q,c){ const e=stFx(q.fx,c,"stx-prism"); stA(e,[{transform:"scaleX(0)",opacity:0},{transform:"scaleX(1)",opacity:.8,offset:.5},{transform:"scaleX(1.1)",opacity:0}],{duration:c.d*1.2}) },
 sandstorm(q,c){ for(let i=0;i<18;i++){ const e=stFx(q.fx,c,"stx-sand",`top:${stR(10,90)}%;left:-5%`); stA(e,[{transform:"translateX(0)",opacity:.9},{transform:`translateX(${stR(200,420)}px)`,opacity:0}],{duration:c.d*stR(.7,1.2),delay:stR(0,c.d*.3),easing:"linear"}) } },
 portalSpin(q,c){ (q.rings||[]).forEach((r,i)=>stA(r,[{transform:"translate(-50%,-50%) rotate(0) scale(1)"},{transform:`translate(-50%,-50%) rotate(${i%2?-540:540}deg) scale(${1+.15*c.p})`,offset:.6},{transform:"translate(-50%,-50%) rotate(720deg) scale(1)"}],{duration:c.d*1.4,easing:"cubic-bezier(.3,0,.2,1)"})) },
 gearTurn(q,c){ (q.gears||[]).forEach((g,i)=>stA(g,[{transform:"rotate(0)"},{transform:`rotate(${i%2?-90:90}deg)`}],{duration:c.d,easing:"cubic-bezier(.3,1.4,.5,1)",composite:"add"})) },
 evolveBloom(q,c){ stA(q.root,[{filter:"brightness(1) saturate(1)"},{filter:"brightness(1.5) saturate(1.5)",offset:.4},{filter:"none"}],{duration:c.d*1.2}); const e=stFx(q.fx,c,"stx-bloom"); stA(e,[{transform:"translate(-50%,-50%) scale(0)",opacity:1},{transform:"translate(-50%,-50%) scale(1.4)",opacity:0}],{duration:c.d*1.3}) },
 signature(q,c){ const s=q.deco&&q.deco.querySelector("path"); if(s) stA(s,[{strokeDashoffset:100},{strokeDashoffset:0,offset:.5},{strokeDashoffset:-100}],{duration:c.d*1.4}); const e=stFx(q.fx,c,"stx-streak"); stA(e,[{transform:"translateX(110%)",opacity:0},{transform:"translateX(0)",opacity:1,offset:.5},{transform:"translateX(-110%)",opacity:0}],{duration:c.d*1.2}) },
 timeTwist(q,c){ stA(q.num,[{transform:"perspective(500px) rotateY(0)"},{transform:"perspective(500px) rotateY(360deg)"}],{duration:c.d*1.1,easing:"cubic-bezier(.4,0,.2,1)"}) },
 rippleRings(q,c){ for(let i=0;i<3;i++){ const e=stFx(q.fx,c,"stx-ring"); stA(e,[{transform:"translate(-50%,-50%) scale(.3)",opacity:.9},{transform:"translate(-50%,-50%) scale(2.2)",opacity:0}],{duration:c.d*1.3,delay:i*180}) } },
};
/** مؤثرات النقصان: مستقلة عن الزيادة */
export const ST_SUB={
 dropRed(q,c){ stA(q.num,[{color:"#ef4444",transform:"translateY(-6%)"},{transform:"translateY(4%)",offset:.5},{transform:"none"}],{duration:c.d*1.1}) },
 shake(q,c){ stA(q.root,[{transform:"translateX(0)"},{transform:`translateX(${-6*c.p}px)`},{transform:`translateX(${6*c.p}px)`},{transform:`translateX(${-4*c.p}px)`},{transform:"translateX(0)"}],{duration:c.d*.6}) },
 dim(q,c){ stA(q.root,[{filter:"brightness(.4) saturate(.3)"},{filter:"none"}],{duration:c.d}) },
 drain(q,c){ stA(q.wave||q.fill||q.num,[{transform:"translateY(0)"},{transform:"translateY(12%)",offset:.5},{transform:"translateY(0)"}],{duration:c.d}) },
 crack(q,c){ const e=stFx(q.fx,c,"stx-crack"); stA(e,[{opacity:0},{opacity:.9,offset:.2},{opacity:0}],{duration:c.d}); stA(q.num,[{filter:"hue-rotate(-60deg)"},{filter:"none"}],{duration:c.d}) },
 reverseSpin(q,c){ (q.gears||q.orbits||q.rings||[]).forEach(g=>stA(g,[{transform:"rotate(0)"},{transform:"rotate(-120deg)"}],{duration:c.d,composite:"add"})); stA(q.num,[{color:"#f87171"},{color:"inherit"}],{duration:c.d}) },
};
/** اقتراب النهاية (بدون وميض سريع): يعمل كحالة ثابتة عبر CSS + نبض هادئ */
export const ST_NEAR={warmGlow:"توهج دافئ",breathing:"تنفّس هادئ",heartFast:"نبض متسارع",redShift:"تحول أحمر",sandLow:"رمال أخيرة",ringClose:"إغلاق الحلقة"};

/* ---------------- الهياكل ---------------- */
const FMT_UNITS=u=>u.map(x=>`<span class="st-u st-u-${x.k}" data-k="${x.k}"><b class="st-v">${x.v}</b><em class="st-l">${x.l}</em></span>`).join('<i class="st-sep">:</i>');
const LAY={
 plain:()=>``, floor:()=>`<i class="st-shadowfloor"></i>`, pulse:()=>`<i class="st-pring"></i>`, bolts:()=>`<svg class="st-deco st-bolts" viewBox="0 0 200 60" preserveAspectRatio="none"><path d="M14 8 4 32h10L8 54l18-30H16l8-16zM186 8l10 24h-10l6 22-18-30h10l-8-16z" fill="currentColor"/></svg>`, night:()=>`<i class="st-nightbg"></i>`, line:()=>`<i class="st-ln"></i>`, split:()=>``, vertical:()=>``, compact:()=>``,
 frame:()=>`<svg class="st-deco st-frame" viewBox="0 0 200 80" preserveAspectRatio="none"><path d="M6 20V6h20M174 6h20v14M194 60v14h-20M26 74H6V60" fill="none" stroke="currentColor" stroke-width="2" pathLength="100" stroke-dasharray="100" vector-effect="non-scaling-stroke"/></svg>`,
 watch:()=>`<svg class="st-dial" viewBox="0 0 100 100">${Array.from({length:12},(_,i)=>`<line x1="50" y1="5" x2="50" y2="${i%3?9:13}" transform="rotate(${i*30} 50 50)" stroke="currentColor" stroke-width="${i%3?1:2.4}"/>`).join("")}<line class="st-hand" x1="50" y1="50" x2="50" y2="12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="50" cy="50" r="2.4" fill="currentColor"/></svg>`,
 ring:()=>`<svg class="st-ringsvg" viewBox="0 0 100 100"><circle class="trk" cx="50" cy="50" r="44"/><circle class="prg" cx="50" cy="50" r="44" pathLength="100"/></svg>`,
 bar:()=>`<i class="st-bar"><b></b></i>`,
 tank:()=>`<div class="st-tank"><div class="st-fill"><svg class="st-wave" viewBox="0 0 200 20" preserveAspectRatio="none"><path d="M0 10Q25 0 50 10T100 10T150 10T200 10V20H0Z" fill="currentColor"/></svg></div></div>`,
 battery:()=>`<div class="st-batt"><div class="st-cells">${Array.from({length:10},()=>'<i></i>').join("")}</div><b class="st-cap"></b></div>`,
 hourglass:()=>`<svg class="st-hg" viewBox="0 0 60 100"><path d="M8 4h44M8 96h44M12 4c0 22 16 30 16 46S12 74 12 96M48 4c0 22-16 30-16 46s16 24 16 50" fill="none" stroke="currentColor" stroke-width="2.2"/><clipPath id="HGID_t"><path d="M13 6h34c-1 20-13 28-17 44C26 34 14 26 13 6z"/></clipPath><clipPath id="HGID_b"><path d="M30 50c4 16 16 24 17 44H13c1-20 13-28 17-44z"/></clipPath><rect class="st-sandT" clip-path="url(#HGID_t)" x="0" y="0" width="60" height="50" fill="currentColor"/><rect class="st-sandB" clip-path="url(#HGID_b)" x="0" y="50" width="60" height="50" fill="currentColor"/><line class="st-stream" x1="30" y1="48" x2="30" y2="94" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2"/></svg>`,
 ecg:()=>`<svg class="st-ecgsvg" viewBox="0 0 200 40" preserveAspectRatio="none"><path class="st-ecg" d="M0 20H60L68 6L76 34L84 2L92 38L100 20H200" fill="none" stroke="currentColor" stroke-width="2" pathLength="100" stroke-dasharray="100" vector-effect="non-scaling-stroke"/></svg>`,
 orbit:()=>`<i class="st-orb st-orb1"><b></b></i><i class="st-orb st-orb2"><b></b></i><i class="st-orb st-orb3"><b></b></i>`,
 gears:()=>`${[["g1",0],["g2",1],["g3",2]].map(([k,i])=>`<svg class="st-gear st-${k}" viewBox="0 0 100 100"><path d="${gearPath(i?8+i*2:12)}" fill="currentColor"/><circle cx="50" cy="50" r="12" fill="var(--st-bg,#0b1020)"/></svg>`).join("")}`,
 infinity:()=>`<svg class="st-inf" viewBox="0 0 200 80"><path id="INFID" d="M100 40C80 10 30 10 30 40s50 30 70 0 70-30 70 0-50 30-70 0z" fill="none" stroke="currentColor" stroke-width="2.4" opacity=".55"/><circle class="st-dot" r="4" fill="#f6c94a"><animateMotion dur="5s" repeatCount="indefinite"><mpath href="#INFID"/></animateMotion></circle></svg>`,
 radar:()=>`<i class="st-radar"></i><i class="st-radar-grid"></i>`,
 reactor:()=>`<i class="st-rx st-rx1"></i><i class="st-rx st-rx2"></i><i class="st-rx st-rx3"></i><i class="st-core"></i>`,
 portal:()=>`<i class="st-pr st-pr1"></i><i class="st-pr st-pr2"></i><i class="st-pr st-pr3"></i>`,
 eclipse:()=>`<i class="st-sun"></i><i class="st-moon"></i>`,
 cine:()=>`<i class="st-cb st-cb-t"></i><i class="st-cb st-cb-b"></i>`,
 hud:()=>`<svg class="st-deco st-hudsvg" viewBox="0 0 200 80" preserveAspectRatio="none"><path d="M2 24 14 2h60M126 2h60l12 22M198 56l-12 22h-60M74 78H14L2 56" fill="none" stroke="currentColor" stroke-width="2" pathLength="100" stroke-dasharray="100" vector-effect="non-scaling-stroke"/></svg>`,
 race:()=>`<div class="st-lights">${Array.from({length:5},()=>'<i></i>').join("")}</div><i class="st-track"></i>`,
 crown:()=>`<svg class="st-deco st-crownsvg" viewBox="0 0 64 40"><path d="M4 34 8 8l14 14L32 4l10 18L56 8l4 26z" fill="currentColor"/><rect x="4" y="34" width="56" height="5" rx="2" fill="currentColor"/></svg>`,
 gems:()=>`<div class="st-gems">${Array.from({length:7},()=>'<i></i>').join("")}</div>`,
 pattern:()=>`<svg class="st-deco st-pat" viewBox="0 0 200 80" preserveAspectRatio="none"><path d="M10 40 25 25 40 40 25 55ZM160 40l15-15 15 15-15 15ZM40 40H160" fill="none" stroke="currentColor" stroke-width="1.6" pathLength="100" stroke-dasharray="100" vector-effect="non-scaling-stroke"/></svg>`,
 signature:()=>`<svg class="st-deco st-sigsvg" viewBox="0 0 100 100"><path d="M50 4 92 27v46L50 96 8 73V27Z" fill="none" stroke="url(#STSG)" stroke-width="3" pathLength="100" stroke-dasharray="100" vector-effect="non-scaling-stroke"/><defs><linearGradient id="STSG"><stop offset="0" stop-color="#4d8dff"/><stop offset="1" stop-color="#f6c94a"/></linearGradient></defs></svg>`,
 diamonds:()=>`<i class="st-orb st-orb1 st-dorb"><b></b><b></b><b></b></i>`,
 aurora:()=>`<i class="st-aurbg"></i>`, prism:()=>`<i class="st-prismbg"></i>`, galaxy:()=>`<i class="st-stars"></i><i class="st-orb st-orb1"><b></b></i><i class="st-orb st-orb2"><b></b></i>`, flame:()=>`<i class="st-flame"></i>`, frost:()=>`<i class="st-frostbg"></i>`, butterfly:()=>``, gravity:()=>`<i class="st-floor"></i>`, sandstorm:()=>`<i class="st-dunes"></i>`, energy:()=>`<svg class="st-ringsvg st-ering" viewBox="0 0 100 100"><circle class="trk" cx="50" cy="50" r="44"/><circle class="prg" cx="50" cy="50" r="44" pathLength="100"/><circle class="prg2" cx="50" cy="50" r="37" pathLength="100"/></svg>`,
};
function gearPath(n){ let d=""; for(let i=0;i<n;i++){ const a=i/n*Math.PI*2, b=(i+.5)/n*Math.PI*2, r1=46, r2=36; const P=(r,t)=>`${(50+Math.cos(t)*r).toFixed(1)} ${(50+Math.sin(t)*r).toFixed(1)}`; d+=(i?"L":"M")+P(r2,a-.15)+"L"+P(r1,a-.08)+"L"+P(r1,a+.12)+"L"+P(r2,b-.05) } return d+"Z" }

/* ---------------- 50 تصميماً ---------------- */
// [id, n, الاسم, المجموعة, الهيكل, الأرقام, الزيادة, النقصان, اقتراب النهاية, الوصف]
const ST_D=[
 ["pureTime",1,"Pure Time","g1","plain","plain","inkSpread","dropRed","breathing","أرقام فقط بخلفية شفافة بالكامل"],
 ["goldenLine",2,"Golden Line","g1","line","plain","lineSurge","drain","warmGlow","خط ذهبي متحرك أسفل الأرقام"],
 ["floatingTime",3,"Floating Time","g1","floor","float","floatUp","dropRed","breathing","أرقام عائمة بحركة انسيابية"],
 ["splitTime",4,"Split Time","g1","split","plain","splitBounce","shake","redShift","الساعات والدقائق والثواني بتكوين منفصل أنيق"],
 ["neonOutline",5,"Neon Outline","g1","plain","outline","neonFlick","dim","redShift","أرقام مفرّغة بإطار نيون"],
 ["elegantTypography",6,"Elegant Typography","g1","plain","serif","timeTwist","dropRed","warmGlow","يعتمد على الخطوط الفاخرة"],
 ["digitalShadow",7,"Digital Shadow","g1","plain","shadow3d","depthPush","shake","redShift","أرقام بظلال ثلاثية الأبعاد"],
 ["verticalTime",8,"Vertical Time","g1","vertical","plain","stackSlide","drain","breathing","عرض الوقت عمودياً"],
 ["compactTime",9,"Compact Time","g1","compact","plain","miniPop","dim","redShift","مؤقت صغير لا يحجب الشاشة"],
 ["transparentPulse",10,"Transparent Pulse","g1","pulse","plain","haloPulse","dim","breathing","نبض ضوئي خفيف عند الزيادة"],
 ["royalGold",11,"Royal Gold","g2","frame","serif","crownRise","dropRed","warmGlow","إطار ملكي ذهبي بتفاصيل متحركة"],
 ["blackDiamond",12,"Black Diamond","g2","frame","facet","diamondFacets","crack","redShift","أرقام بتأثير الألماس الأسود"],
 ["platinumClock",13,"Platinum Clock","g2","bar","metal","metalSweep","drain","warmGlow","تكوين معدني بلاتيني"],
 ["crystalTime",14,"Crystal Time","g2","plain","crystal","refract","crack","breathing","أرقام بانكسارات كريستالية"],
 ["luxuryWatch",15,"Luxury Watch","g2","watch","serif","watchTick","reverseSpin","ringClose","مستوحى من الساعات الفاخرة"],
 ["emeraldTime",16,"Emerald Time","g2","gems","serif","gemLight","dim","warmGlow","أحجار زمردية تضيء عند الدعم"],
 ["saudiSignature",17,"Saudi Signature","g2","pattern","serif","patternDraw","dropRed","warmGlow","زخارف هندسية سعودية"],
 ["goldenCrown",18,"Golden Crown","g2","crown","serif","crownStage","shake","warmGlow","تاج ملكي يتفاعل مع المراحل"],
 ["midnightLuxury",19,"Midnight Luxury","g2","night","glow","spotlightSweep","dim","breathing","تصميم ليلي بإضاءة سينمائية"],
 ["diamondOrbit",20,"Diamond Orbit","g2","diamonds","plain","orbitBurst","reverseSpin","ringClose","جزيئات ألماسية تدور حول الوقت"],
 ["gamingHUD",21,"Gaming HUD","g3","hud","mono","hudBrackets","shake","redShift","واجهة ألعاب بزوايا"],
 ["cyberTime",22,"Cyber Time","g3","plain","glitch","glitchSlice","crack","redShift","تأثيرات رقمية مستقبلية"],
 ["hologramClock",23,"Hologram Clock","g3","plain","holo","scanlines","dim","breathing","مؤقت هولوغرام"],
 ["digitalMatrix",24,"Digital Matrix","g3","plain","matrix","matrixDrop","dropRed","redShift","أرقام من وحدات رقمية"],
 ["reactorCore",25,"Reactor Core","g3","reactor","mono","reactorSurge","dim","heartFast","مفاعل طاقة يتفاعل مع الزيادة"],
 ["racingTimer",26,"Racing Timer","g3","race","mono","raceLights","shake","redShift","مستوحى من سباقات الفورمولا"],
 ["esportsTimer",27,"Esports Timer","g3","plain","italic","esportsWipe","shake","redShift","طابع البطولات الإلكترونية"],
 ["radarClock",28,"Radar Clock","g3","radar","mono","radarPing","reverseSpin","ringClose","مسح راداري متحرك"],
 ["electricTime",29,"Electric Time","g3","bolts","glow","boltStrike","dim","heartFast","طاقة كهربائية عند الدعم"],
 ["mechanicalFlip",30,"Mechanical Flip","g3","split","flip","flipCards","shake","redShift","أرقام ميكانيكية تنقلب"],
 ["hourglass",31,"Hourglass","g4","hourglass","plain","sandFlow","drain","sandLow","ساعة رملية تتفاعل مع الوقت المتبقي"],
 ["liquidTime",32,"Liquid Time","g4","tank","plain","liquidRise","drain","breathing","خزان سائل يرتفع مع الزيادة"],
 ["batteryTimer",33,"Battery Timer","g4","battery","mono","chargeCells","drain","redShift","بطارية تتعبأ مع الدعم"],
 ["heartbeat",34,"Heartbeat","g4","ecg","plain","heartSpike","dropRed","heartFast","نبضات تتسارع عند اقتراب النهاية"],
 ["fireClock",35,"Fire Clock","g4","flame","glow","flameFlare","dim","warmGlow","لهب سينمائي يتفاعل مع الزيادة"],
 ["frozenTime",36,"Frozen Time","g4","frost","crystal","frostThaw","crack","breathing","تأثير جليدي عند الإيقاف المؤقت"],
 ["galaxyTimer",37,"Galaxy Timer","g4","galaxy","glow","orbitSpeed","reverseSpin","ringClose","مجرة ومدارات حول الأرقام"],
 ["eclipseClock",38,"Eclipse Clock","g4","eclipse","plain","eclipseShift","dim","ringClose","كسوف مرتبط بالوقت المتبقي"],
 ["energyRing",39,"Energy Ring","g4","energy","mono","ringFill","drain","ringClose","حلقات تقدم دائرية متحركة"],
 ["infinityTime",40,"Infinity Time","g4","infinity","plain","infinityRun","dim","breathing","مسار طاقة بشكل اللانهاية"],
 ["cinematicCountdown",41,"Cinematic Countdown","g5","cine","serif","cineBars","dim","warmGlow","عد تنازلي سينمائي"],
 ["butterflyElegance",42,"Butterfly Elegance","g5","butterfly","serif","butterflies","dropRed","breathing","فراشات أنيقة اختيارية"],
 ["auroraClock",43,"Aurora Clock","g5","aurora","glow","auroraWave","dim","breathing","مؤثرات الشفق القطبي"],
 ["gravityTime",44,"Gravity Time","g5","gravity","plain","gravityPull","drain","redShift","جزيئات بتأثير الجاذبية"],
 ["prismClock",45,"Prism Clock","g5","prism","crystal","prismSplit","crack","breathing","انعكاسات ضوئية متعددة"],
 ["sandstormTimer",46,"Sandstorm Timer","g5","sandstorm","plain","sandstorm","drain","sandLow","جزيئات رملية سينمائية"],
 ["timePortal",47,"Time Portal","g5","portal","glow","portalSpin","reverseSpin","ringClose","بوابة زمنية تتفاعل مع الزيادة"],
 ["mechanicalGear",48,"Mechanical Gear","g5","gears","mono","gearTurn","reverseSpin","heartFast","تروس ميكانيكية متحركة"],
 ["fantasticEvolution",49,"Fantastic Evolution","g5","ring","serif","evolveBloom","dim","warmGlow","يتطور بصرياً حسب المراحل"],
 ["b6o6Signature",50,"B6O6 Signature","g5","signature","serif","signature","dropRed","ringClose","الهوية الرسمية للمنصة"],
];
export const ST_DESIGNS=ST_D.map(([id,n,name,grp,lay,dig,add,sub,near,desc])=>({id:"st_"+id,key:id,n,name,grp,lay,dig,add,sub,near,desc}));
export const ST_BY_ID=Object.fromEntries(ST_DESIGNS.map(d=>[d.id,d]));
View.ST_BY_ID=ST_BY_ID; // يقرأه view.js بدون استيراد دائري
export function stPreset(k){ return ({full:{stNoBg:false,stNoFrame:false,stNoDeco:false,stNoTitle:false,stTextOnly:false,stNoLine:false},basic:{stNoBg:false,stNoFrame:true,stNoDeco:true,stNoTitle:false,stTextOnly:false},alpha:{stNoBg:true,stNoFrame:true,stNoDeco:false,stTextOnly:false},numbers:{stNoBg:true,stNoFrame:true,stNoDeco:true,stNoTitle:true,stTextOnly:false,stNoLine:true},text:{stNoBg:true,stNoFrame:true,stNoDeco:true,stNoTitle:true,stTextOnly:true},underline:{stNoBg:true,stNoFrame:true,stNoDeco:true,stNoTitle:true,stTextOnly:false,stNoLine:false,stForceLine:true}}[k]||{}) }
/** المرحلة الحالية (Timer Evolution) */
export function stStage(w,ms,best){ const L=(Array.isArray(w.stStages)&&w.stStages.length?w.stStages:ST_STAGES_DEF).map(([h,n])=>[+h,n]).sort((a,b)=>a[0]-b[0]); const h=ms/HOUR; let i=0; L.forEach(([x],k)=>{ if(h>=x) i=k }); if(w.stEvoMode==="highest"&&best!=null) i=Math.max(i,best); return {i,name:(L[i]||[0,""])[1],n:L.length} }
export function stTier(w,ms){ const T=Array.isArray(w.stTiers)&&w.stTiers.length===3?w.stTiers.map(Number):ST_TIERS_DEF, m=Math.abs(ms)/MIN; return m>=T[2]?4:m>=T[1]?3:m>=T[0]?2:1 }

let stCss=false;
function ensureStCSS(){ if(stCss||typeof document==="undefined") return; stCss=true; const st=document.createElement("style"); st.id="b6o6-st"; st.textContent=ST_CSS; document.head.appendChild(st) }
let ST_UID=0;

Object.assign(View.prototype,{
 applySt(w,W,H){ ensureStCSS(); const d=ST_BY_ID[w.design], e=this.el, ed=this.opts.editor, u=++ST_UID;
  e.className=`wd stw ${d.id} stl-${d.lay} std-${d.dig} stn-${d.near}${w.stNoBg?" st-nobg":""}${w.stNoFrame?" st-noframe":""}${w.stNoDeco?" st-nodeco":""}${w.stNoTitle?" st-notitle":""}${w.stTextOnly?" st-textonly":""}${w.stNoLine?" st-noline":""}${w.stForceLine?" st-forceline":""}${w.stLite||this.opts.lowPerf?" st-lite":""}${w.animOn===false?" st-still":""}${ed?(" "+(w.locked?"locked":"")+(w.visible?"":" hid")+(this.opts.sel===w.id?" sel":"")):""}`;
  if(!ed) e.style.display=w.visible===false?"none":"";
  const S=e.style, set=(k,v)=>v!=null&&v!==""?S.setProperty(k,v):S.removeProperty(k), col=c=>/^#[0-9a-f]{3,8}$/i.test(c||"")?c:"";
  const base=Math.min(H*(d.lay==="vertical"?.2:d.lay==="compact"?.5:.4),W*(d.lay==="vertical"?.22:.14))*(+w.fontScale||1);
  set("--st-fs",base+"px"); set("--st-c",col(w.stNum)); set("--st-bgc",col(w.stBg)); set("--st-bgo",w.stBgOp!=null&&w.stBgOp!==""?String(w.stBgOp):""); set("--st-fxo",w.stFxOp!=null&&w.stFxOp!==""?String(w.stFxOp):"");
  set("--st-fr",col(w.stFr)); set("--st-frw",w.stFrW>0?(+w.stFrW)+"px":""); set("--st-lnc",col(w.stLn)); set("--st-gap",w.stGap!=null&&w.stGap!==""?(+w.stGap)+"em":""); set("--st-dec",w.stDec>0?String(+w.stDec):""); set("--as",String(+w.animSpeed||1));
  S.direction=w.stDir==="ltr"?"ltr":"";
  const tid="st"+u; const lay=(LAY[d.lay]||LAY.plain)().replace(/HGID/g,tid+"hg").replace(/INFID/g,tid+"inf").replace(/STSG/g,tid+"sg");
  e.innerHTML=`<div class="st-in"><div class="st-bg"></div>${lay}<div class="st-t"></div><div class="st-num"></div><div class="st-days"></div><div class="st-goal"><i><b></b></i><span></span></div><div class="st-stage"></div><div class="st-fx"></div><div class="st-notes st-np-${w.stNotePos||"top"}"></div></div>${ed?'<div class="rh"></div><div class="lockb">🔒</div>':""}`;
  const Q=s=>e.querySelector(s);
  this.st={d,root:Q(".st-in"),num:Q(".st-num"),t:Q(".st-t"),days:Q(".st-days"),fx:Q(".st-fx"),notes:Q(".st-notes"),goal:Q(".st-goal"),stage:Q(".st-stage"),ln:Q(".st-ln,.st-bar b"),deco:Q(".st-deco,.st-crownsvg,.st-sigsvg"),hand:Q(".st-hand"),prg:Q(".prg"),wave:Q(".st-wave"),fill:Q(".st-fill"),cells:[...e.querySelectorAll(".st-cells i")],gems:[...e.querySelectorAll(".st-gems i")],rings:[...e.querySelectorAll(".st-rx,.st-pr")],orbits:[...e.querySelectorAll(".st-orb")],gears:[...e.querySelectorAll(".st-gear")],lights:[...e.querySelectorAll(".st-lights i")],sandT:Q(".st-sandT"),sandB:Q(".st-sandB"),ecg:Q(".st-ecg"),flame:Q(".st-flame"),moon:Q(".st-moon"),sun:Q(".st-sun"),dot:Q(".st-dot"),units:[],last:"",best:null,grp:null};
  this.stLast=null; this.stFc="" },
 /** التحديث كل ربع ثانية من مصدر الوقت المركزي */
 refreshSt(src){ const q=this.st, w=this.w; if(!q||!src||!src.C) return; const s=(this.opts.stPreview&&this.opts.stPreview.s)||src.C.subathon; if(!s) return;
  const now=Date.now()+(src.skew||0), ms=remaining(s,now)+(this.opts.stPreview?this.opts.stPreview.off||0:0), o={fmt:w.stFmt||"hms",showD:w.stShowD,showH:w.stShowH,showM:w.stShowM,showS:w.stShowS};
  const U=stUnits(ms,o), key=U.words||U.u.map(x=>x.v).join(":");
  if(key!==q.last){ const prev=q.last; q.last=key;
   if(U.words!=null){ q.num.textContent=U.words; q.units=[q.num] }
   else { const same=q.units.length===U.u.length&&q.units.every((n,i)=>n.dataset.k===U.u[i].k);
    if(!same){ q.num.innerHTML=FMT_UNITS(U.u); q.units=[...q.num.querySelectorAll(".st-u")] }
    U.u.forEach((x,i)=>{ const b=q.units[i]&&q.units[i].querySelector(".st-v"); if(b&&b.textContent!==x.v){ const old=b.textContent; b.textContent=x.v; if(prev&&!this.el.classList.contains("st-still")) this.stDigitFx(q.units[i],old) } }) }
   q.days.textContent=U.days||"" }
  const title=w.title||s.name||"السابثون"; if(q.t.textContent!==title) q.t.textContent=title;
  // التقدم: الحلقة/الشريط/السائل/البطارية/الساعة الرملية = المتبقي ÷ (الهدف أو الوقت الكلي)
  const goalMs=w.stGoalH>0?w.stGoalH*HOUR:0, total=Math.max(1,goalMs||(s.initialMs+(s.totalAddedMs||0))), gv=w.stGoalMode==="added"?(s.totalAddedMs||0):ms, pr=Math.max(0,Math.min(1,gv/total));
  if(q.prg) q.prg.style.strokeDasharray=`${pr*100} 100`; const p2=this.el.querySelector(".prg2"); if(p2) p2.style.strokeDasharray=`${((ms/MIN)%60)/60*100} 100`;
  if(q.d.lay==="bar"||q.d.lay==="line") { const b=this.el.querySelector(".st-bar b"); if(b) b.style.transform=`scaleX(${pr})` }
  if(q.fill) q.fill.style.height=(8+pr*84)+"%";
  q.cells.forEach((c,i)=>c.classList.toggle("on",i<Math.ceil(pr*q.cells.length)));
  if(q.sandT){ q.sandT.style.transform=`translateY(${(1-pr)*50}%)`; q.sandB.style.transform=`translateY(${pr*50}%)` }
  if(q.moon) q.moon.style.transform=`translateX(${(pr-1)*60}%)`;
  if(q.hand) q.hand.style.transform=`rotate(${((ms/1000)%60)*6}deg)`;
  if(goalMs&&w.stGoalShow!==false){ q.goal.classList.add("on"); q.goal.querySelector("b").style.transform=`scaleX(${pr})`; q.goal.querySelector("span").textContent=`${Math.floor(gv/HOUR)}س / ${w.stGoalH}س` } else q.goal.classList.remove("on");
  // Timer Evolution: تطور بنائي حقيقي (طبقات إضافية) لا تغيير لون فقط
  if(w.stEvo){ const st=stStage(w,ms,q.best); q.best=Math.max(q.best??0,st.i); for(let k=0;k<10;k++) this.el.classList.toggle("st-ev"+k,k<=st.i&&k>0); if(q.stage.textContent!==st.name) q.stage.textContent=st.name; if(this.stEvoI!==undefined&&st.i>this.stEvoI&&this.stLog) this.stStageUp(st); this.stEvoI=st.i }
  else { for(let k=1;k<10;k++) this.el.classList.remove("st-ev"+k); q.stage.textContent="" }
  // Final Countdown (أوقات قابلة للتعديل، بدون وميض سريع)
  const fcOn=w.stFc!==false, warn=(+w.stFcWarn||10)*MIN, cd=(+w.stFcCount||60)*SEC, last=(+w.stFcLast||10)*SEC, run=s.status==="running";
  const fc=!fcOn||!run||ms<=0?"":ms<=last?"last":ms<=cd?"count":ms<=warn?"warn":"";
  if(fc!==this.stFc){ this.el.classList.remove("st-fc-warn","st-fc-count","st-fc-last"); if(fc) this.el.classList.add("st-fc-"+fc); this.stFc=fc }
  this.el.classList.toggle("st-ended",s.status==="ended"); this.el.classList.toggle("st-paused",s.status==="paused") },
 /** حركة الأرقام عند تغيّرها — خاصة بعارض الأرقام في التصميم */
 stDigitFx(u,old){ const d=this.st.d, v=u.querySelector(".st-v"); if(!v||!v.animate||this.el.classList.contains("st-lite")) return;
  if(d.dig==="flip") v.animate([{transform:"perspective(200px) rotateX(-80deg)",opacity:.4},{transform:"none",opacity:1}],{duration:320,easing:"cubic-bezier(.3,1.4,.5,1)"});
  else if(d.dig==="matrix") v.animate([{filter:"blur(2px)",opacity:.3},{filter:"none",opacity:1}],{duration:260,easing:"steps(3)"});
  else if(d.dig==="glitch") v.animate([{transform:"translateX(2px)",clipPath:"inset(0 0 50% 0)"},{transform:"none",clipPath:"inset(0)"}],{duration:180,easing:"steps(2)"});
  else if(d.dig==="float"&&u.dataset.k==="s") v.animate([{transform:"translateY(-30%)",opacity:0},{transform:"none",opacity:1}],{duration:380,easing:"ease-out"});
  else if(u.dataset.k!=="s"||this.el.classList.contains("st-fc-last")) v.animate([{transform:"translateY(-25%)",opacity:0},{transform:"none",opacity:1}],{duration:320,easing:"ease-out"}) },
 /** تغيّر الوقت (زيادة/نقصان) — يُجمّع المتتالي في إشعار واحد (لا تراكم)، والوقت نفسه من الخادم */
 stDeltaFx(log){ const q=this.st, w=this.w; if(!q||!log||!log.deltaMs||this.opts.stPreview) return; if(w.stFxOn===false||w.effects===false&&w.stFxOn==null) return; const G=q.grp||(q.grp={ms:0,n:0,user:"",t:0});
  G.ms+=+log.deltaMs; G.n++; if(log.user) G.user=log.user; if(G.t) return;
  G.t=setTimeout(()=>{ const ms=G.ms, n=G.n, user=G.user; q.grp=null; this.stPlayDelta(ms,user,n) },Math.max(150,+w.stGroupMs||300)) },
 stPlayDelta(ms,user,n){ const q=this.st, w=this.w, d=q.d; if(!q) return; const tier=stTier(w,ms), c={d:Math.round(900/(+w.animSpeed||1)),p:Math.max(.3,Math.min(1.8,(+w.stFxPower||1)*(1+(tier-1)*.2))),lite:this.el.classList.contains("st-lite")||(typeof window!=="undefined"&&!!window.__arshExplore)};
  const still=this.el.classList.contains("st-still");
  if(!still){ try{ (ms>0?ST_ADD[d.add]:ST_SUB[d.sub]||ST_SUB.dim)(q,c) }catch(e){} if(ms>0&&tier>=3) try{ (tier===4?ST_ADD.rippleRings:ST_ADD.haloPulse)(q,c) }catch(e){} }
  if(w.stNote!==false){ const b=document.createElement("div"); b.className=`st-note ${ms<0?"neg":"pos"} tier${tier}`; b.innerHTML=`<b>${esc(stDelta(ms))}${n>1?` <small>×${n}</small>`:""}</b>${w.stDonor!==false&&user?`<span>${esc(user)}</span>`:""}`; q.notes.appendChild(b); while(q.notes.children.length>3) q.notes.firstChild.remove(); setTimeout(()=>b.remove(),Math.max(1200,(+w.stNoteSec||3)*1000)) }
  if(ms<0){ this.el.classList.add("st-neg"); setTimeout(()=>this.el.classList.remove("st-neg"),1200) } },
 /** أحداث أخرى من السجل (انتهاء/مراحل) */
 stLog(l){ if(!this.st) return; if(l.sa==="end"&&!this.el.classList.contains("st-still")){ const e=stFx(this.st.fx,{d:1400},"stx-end"); if(e){ e.textContent="انتهى السابثون"; stA(e,[{opacity:0,transform:"scale(1.3)",letterSpacing:".4em"},{opacity:1,transform:"none",letterSpacing:"0",offset:.4},{opacity:1,offset:.85},{opacity:0}],{duration:3600}) } } },
 stStageUp(st){ const q=this.st; const e=stFx(q.fx,{d:1200},"stx-stage"); if(e){ e.textContent=st.name; stA(e,[{opacity:0,transform:"translate(-50%,0) scale(.6)"},{opacity:1,transform:"translate(-50%,0) scale(1)",offset:.3},{opacity:0,transform:"translate(-50%,-40%)"}],{duration:2600}) } try{ ST_ADD.evolveBloom(q,{d:1000,p:1}) }catch(e){} },
});

/** بصمة فعلية لمؤثر زيادة/نقصان (للاختبار ومنع التكرار) */
export function stTrace(view,kind,id){ const T=[], orig=Element.prototype.animate, ap=Element.prototype.appendChild, q=view.st;
 const role=el=>{ for(const [k,v] of Object.entries(q)) if(v===el) return k; if(Array.isArray(q.units)&&q.units.includes(el)) return "unit"; for(const k of ["cells","gems","rings","orbits","gears","lights"]) if((q[k]||[]).includes(el)) return k; const fx=el.closest&&el.closest(".stx"); return fx?"fx:"+fx.className.split(" ")[1]:el.tagName };
 const shape=v=>String(v).replace(/#[0-9a-f]{3,8}|rgba?\([^)]*\)/gi,"C").replace(/-?\d+(\.\d+)?/g,m=>+m===0?"0":+m<0?"-n":"n");
 Element.prototype.animate=function(kf,o){ const k=Array.isArray(kf)?kf:[]; T.push(role(this)+":"+k.length+":"+k.map(f=>Object.keys(f).filter(x=>x!=="offset").sort().map(p=>p+"="+shape(f[p])).join(",")).join("|")); return orig.call(this,kf,o) };
 Element.prototype.appendChild=function(n){ if(n&&n.classList&&n.classList.contains("stx")) T.push("F:"+n.className); return ap.call(this,n) };
 ST_NOCAP=true; try{ (kind==="add"?ST_ADD:ST_SUB)[id](q,{d:900,p:1,lite:false}) }finally{ ST_NOCAP=false; Element.prototype.animate=orig; Element.prototype.appendChild=ap }
 return T }

const ST_CSS=`
.stw{color:var(--st-c,#fff);font-family:"Alexandria","IBM Plex Sans Arabic",sans-serif;container-type:size}
.stw .st-in{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.2em;font-size:calc(var(--st-fs)*var(--st-fsk,1))}
.stl-watch,.stl-ring,.stl-energy,.stl-reactor,.stl-radar,.stl-portal,.stl-signature{--st-fsk:.56}.stl-battery,.stl-eclipse,.stl-hourglass{--st-fsk:.8}
.stw .st-bg{position:absolute;inset:0;border-radius:18px;background:var(--st-bgc,transparent);opacity:var(--st-bgo,1);pointer-events:none}
.stw.st-nobg .st-bg{display:none}.stw.st-noframe .st-frame,.stw.st-noframe .st-hudsvg{display:none}.stw.st-nodeco :is(.st-deco,.st-gems,.st-orb,.st-gear,.st-lights,.st-track,.st-pat,.st-crownsvg){display:none}.stw.st-notitle .st-t{display:none}
.stw .st-t{font:600 calc(var(--st-fs)*.28)/1.2 "IBM Plex Sans Arabic",sans-serif;opacity:.85;letter-spacing:.04em;z-index:2;text-shadow:0 1px 6px rgba(0,0,0,.6)}
.stw .st-num{position:relative;z-index:2;display:flex;align-items:baseline;gap:var(--st-gap,.06em);direction:ltr;font-weight:800;line-height:1;white-space:nowrap;font-variant-numeric:tabular-nums;text-shadow:0 2px 10px rgba(0,0,0,.55)}
.stw .st-u{display:inline-flex;flex-direction:column;align-items:center}.stw .st-v{display:inline-block;font-style:normal}.stw .st-l{display:none;font:500 calc(var(--st-fs)*.18)/1 "IBM Plex Sans Arabic",sans-serif;opacity:.7;font-style:normal;margin-top:.2em}
.stw .st-sep{font-style:normal;opacity:.75;transform:translateY(-.04em)}
.stw .st-days{z-index:2;font-size:calc(var(--st-fs)*.3);opacity:.85}.stw .st-days:empty{display:none}
.stw .st-fx{position:absolute;inset:0;pointer-events:none;overflow:visible;z-index:4;opacity:var(--st-fxo,1)}
.stw .st-notes{position:absolute;left:50%;transform:translateX(-50%);z-index:6;display:flex;flex-direction:column;align-items:center;gap:.15em;pointer-events:none}
.stw .st-np-top{bottom:100%;margin-bottom:.1em}.stw .st-np-bottom{top:100%;margin-top:.1em}.stw .st-np-side{left:auto;right:-4%;transform:translateX(100%);top:30%}
.stw .st-note{display:flex;flex-direction:column;align-items:center;font-size:calc(var(--st-fs)*.42);color:#4ade80;text-shadow:0 2px 8px #000,0 0 14px currentColor;animation:st-note var(--st-ns,3s) ease forwards;white-space:nowrap}.stw .st-note.neg{color:#f87171}.stw .st-note span{font:600 .5em/1.2 "IBM Plex Sans Arabic",sans-serif;color:#fff}.stw .st-note small{font-size:.6em;opacity:.8}
.stw .st-note.tier3{font-size:calc(var(--st-fs)*.55)}.stw .st-note.tier4{font-size:calc(var(--st-fs)*.68);color:#facc15}
@keyframes st-note{0%{opacity:0;transform:translateY(40%) scale(.8)}12%{opacity:1;transform:none}80%{opacity:1}100%{opacity:0;transform:translateY(-30%)}}
.stw .st-goal{display:none;width:70%;z-index:2;flex-direction:column;align-items:center;gap:.15em}.stw .st-goal.on{display:flex}.stw .st-goal i{display:block;width:100%;height:.12em;border-radius:9px;background:rgba(255,255,255,.18);overflow:hidden}.stw .st-goal b{display:block;height:100%;background:var(--st-lnc,#4d8dff);transform-origin:100% 50%}.stw .st-goal span{font-size:calc(var(--st-fs)*.2);opacity:.8}
.stw .st-stage{z-index:2;font:700 calc(var(--st-fs)*.18)/1 "Alexandria",sans-serif;letter-spacing:.2em;text-transform:uppercase;opacity:.85}.stw .st-stage:empty{display:none}
/* Final Countdown — هادئ بلا وميض سريع */
.stw.st-fc-warn .st-num{animation:st-warn 3s ease-in-out infinite}@keyframes st-warn{50%{text-shadow:0 0 .4em rgba(255,160,60,.7),0 2px 10px rgba(0,0,0,.55)}}
.stw.st-fc-count .st-u-s .st-v{color:#fbbf24}.stw.st-fc-count .st-num{animation:st-warn 1.6s ease-in-out infinite}
.stw.st-fc-last .st-num{color:#fca5a5}
.stw.st-ended .st-num{opacity:.45}.stw.st-paused .st-num{opacity:.75}
.stw.st-neg .st-num{color:#f87171;transition:color .3s}
.stw.st-still *,.stw.st-lite .stx{animation:none!important}
.stw.stn-heartFast.st-fc-warn .st-ecg{animation-duration:.9s!important}.stw.stn-ringClose.st-fc-warn .prg{stroke:#f59e0b}.stw.stn-sandLow.st-fc-warn .st-stream{stroke-width:2}.stw.stn-redShift.st-fc-warn .st-num{color:#fda4af}.stw.stn-breathing.st-fc-warn .st-in{animation:st-br 4s ease-in-out infinite}@keyframes st-br{50%{transform:scale(1.02)}}
/* Timer Evolution — كل مرحلة تضيف طبقة بنائية */
.stw.st-ev1 .st-bg{box-shadow:inset 0 0 0 2px #b0793c}
.stw.st-ev2 .st-in::before{content:"";position:absolute;inset:4%;border-radius:16px;border:1px solid rgba(220,225,235,.55);pointer-events:none}
.stw.st-ev3 .st-num{background:linear-gradient(180deg,#fff7d6,#f6c94a 55%,#b7791f);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.stw.st-ev4 .st-in::after{content:"◆ ◆ ◆";position:absolute;top:2%;font-size:calc(var(--st-fs)*.2);color:#bfe6ff;letter-spacing:.6em;text-shadow:0 0 8px #9fd0ff}
.stw.st-ev5 .st-t::before{content:"♛ ";color:#f6c94a}
.stw.st-ev6 .st-bg{box-shadow:0 0 30px rgba(77,141,255,.55),inset 0 0 0 2px #4d8dff}
.stw.st-ev7 .st-fx::before{content:"";position:absolute;inset:-6%;border-radius:50%;border:1px dashed rgba(246,201,74,.6);animation:st-spin calc(14s/var(--as,1)) linear infinite}
.stw.st-ev8 .st-fx::after{content:"";position:absolute;inset:-12% -4%;border-radius:40%;border:2px solid transparent;background:conic-gradient(from 0deg,#4d8dff,#f6c94a,#a855f7,#4d8dff) border-box;-webkit-mask:linear-gradient(#000 0 0) padding-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:st-spin calc(10s/var(--as,1)) linear infinite}
@keyframes st-spin{to{transform:rotate(360deg)}}
/* عارضات الأرقام */
.std-outline .st-num{color:transparent;-webkit-text-stroke:2px var(--st-c,#22e1ff);filter:drop-shadow(0 0 6px var(--st-c,#22e1ff))}
.std-serif .st-num{font-family:"Changa","Alexandria",serif;font-weight:600;letter-spacing:.02em}
.std-shadow3d .st-num{text-shadow:2px 2px 0 #1e3a8a,4px 4px 0 #172554,6px 6px 10px rgba(0,0,0,.6)}
.std-float .st-num{animation:st-fl calc(4s/var(--as,1)) ease-in-out infinite}@keyframes st-fl{50%{transform:translateY(-4%)}}
.std-facet .st-num{background:linear-gradient(135deg,#9ca3af,#fff 35%,#4b5563 50%,#e5e7eb 70%,#6b7280);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.std-metal .st-num{background:linear-gradient(180deg,#f9fafb,#9ca3af 50%,#e5e7eb);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.std-crystal .st-num{color:rgba(220,245,255,.9);text-shadow:0 0 1px #fff,0 0 12px rgba(165,243,252,.7)}
.std-glow .st-num{text-shadow:0 0 .2em currentColor,0 0 .6em color-mix(in srgb,currentColor 50%,transparent)}
.std-mono .st-num{font-family:"Orbitron","Alexandria",monospace;font-weight:700;letter-spacing:.05em}
.std-glitch .st-num{font-family:"Orbitron",monospace;text-shadow:-2px 0 #ff2a6d,2px 0 #05d9e8}
.std-holo .st-num{color:#a5f3fc;opacity:.92;text-shadow:0 0 10px #22d3ee}
.std-matrix .st-num{font-family:"Orbitron",monospace;color:#4ade80;-webkit-mask:radial-gradient(circle,#000 58%,transparent 62%) 0 0/.12em .12em;mask:radial-gradient(circle,#000 58%,transparent 62%) 0 0/.12em .12em}
.std-italic .st-num{font-style:italic;font-family:"Orbitron",sans-serif;transform:skewX(-8deg)}
.std-flip .st-u .st-v{background:linear-gradient(#1f2937 50%,#111827 50%);padding:.05em .12em;border-radius:.1em;box-shadow:inset 0 -1px 0 rgba(255,255,255,.1)}
/* الهياكل */
.stl-line .st-ln,.st-forceline .st-num::after{position:relative;display:block;width:70%;height:max(2px,var(--st-frw,.06em));background:var(--st-lnc,linear-gradient(90deg,transparent,#f6c94a,transparent));border-radius:2px;z-index:2;transform-origin:center}
.st-forceline .st-num::after{content:"";position:absolute;bottom:-.15em;left:15%}.stw.st-noline .st-ln{display:none}
.stl-split .st-l,.stl-vertical .st-l,.std-flip .st-l{display:block}.stl-split .st-sep{opacity:.35}.stl-split .st-u{background:rgba(255,255,255,.06);padding:.08em .14em;border-radius:.12em}
.stl-vertical .st-num{flex-direction:column;align-items:center;gap:.05em}.stl-vertical .st-sep{display:none}
.stl-compact .st-in{flex-direction:row;gap:.4em}.stl-compact .st-t{font-size:calc(var(--st-fs)*.35)}.stl-compact .st-bg{border-radius:99px}
.stl-frame .st-frame{position:absolute;inset:6%;width:88%;height:88%;color:var(--st-fr,#f6c94a);pointer-events:none}.stl-frame .st-frame path{stroke-dashoffset:0}
.stl-hud .st-hudsvg{position:absolute;inset:3%;width:94%;height:94%;color:var(--st-fr,#22e1ff);filter:drop-shadow(0 0 4px currentColor)}
.stl-pattern .st-pat{position:absolute;left:5%;right:5%;bottom:6%;width:90%;height:30%;color:var(--st-fr,#d4a73c)}.stl-pattern .st-pat path{stroke-dashoffset:0}
.stl-watch .st-dial,.stl-ring .st-ringsvg,.stl-energy .st-ringsvg{position:absolute;height:96%;aspect-ratio:1;color:var(--st-fr,#e5e7eb);opacity:.9}
.stw .st-ringsvg .trk{fill:none;stroke:rgba(255,255,255,.14);stroke-width:6}.stw .st-ringsvg .prg,.stw .st-ringsvg .prg2{fill:none;stroke:var(--st-lnc,#4d8dff);stroke-width:6;stroke-linecap:round;transform:rotate(-90deg);transform-origin:50% 50%;transition:stroke-dasharray .4s}.stw .st-ringsvg .prg2{stroke:#a855f7;stroke-width:3;opacity:.8}
.stl-watch .st-hand{transform-origin:50px 50px;transform-box:view-box}
.stl-bar .st-bar{position:relative;width:76%;height:.14em;border-radius:9px;background:rgba(255,255,255,.15);overflow:hidden;z-index:2;order:5}.stl-bar .st-bar b{display:block;height:100%;background:linear-gradient(90deg,#9ca3af,#f3f4f6);transform-origin:100% 50%;transition:transform .4s}
.stl-tank .st-tank{position:absolute;inset:6% 8%;border:2px solid rgba(147,197,253,.6);border-radius:18px;overflow:hidden}.stl-tank .st-fill{position:absolute;left:0;right:0;bottom:0;background:linear-gradient(#38bdf8aa,#1d4ed8cc);transition:height .6s}.stl-tank .st-wave{position:absolute;left:0;top:-.5em;width:200%;height:.6em;color:#38bdf8aa;animation:st-wv calc(3s/var(--as,1)) linear infinite}@keyframes st-wv{to{transform:translateX(-50%)}}
.stl-battery .st-batt{position:absolute;left:4%;top:28%;width:28%;height:44%;border:3px solid var(--st-fr,#e5e7eb);border-radius:12px;padding:4px}.stl-battery .st-cap{position:absolute;right:-12px;top:30%;width:8px;height:40%;background:var(--st-fr,#e5e7eb);border-radius:0 4px 4px 0}.stl-battery .st-cells{display:flex;gap:4px;height:100%}.stl-battery .st-cells i{flex:1;border-radius:4px;background:rgba(255,255,255,.08)}.stl-battery .st-cells i.on{background:linear-gradient(#4ade80,#16a34a)}.stl-battery .st-in{padding-left:30%}.stl-battery .st-cap{right:-10px}
.stl-hourglass .st-hg{position:absolute;left:4%;height:90%;color:#e8c46a}.stl-hourglass .st-sandT,.stl-hourglass .st-sandB{transition:transform .6s}.stl-hourglass .st-stream{animation:st-sf .6s linear infinite}@keyframes st-sf{to{stroke-dashoffset:-4}}.stl-hourglass .st-in{padding-left:18%}
.stl-ecg .st-ecgsvg{position:absolute;left:0;right:0;bottom:8%;height:30%;color:#f43f5e;opacity:.85}.stl-ecg .st-ecg{animation:st-ecg calc(1.8s/var(--as,1)) linear infinite}@keyframes st-ecg{from{stroke-dashoffset:100}to{stroke-dashoffset:-100}}
.stw .st-orb{position:absolute;left:50%;top:50%;border:1px solid rgba(160,200,255,.35);border-radius:50%;transform:translate(-50%,-50%)}.stw .st-orb b{position:absolute;top:-4px;left:50%;width:8px;height:8px;border-radius:50%;background:#bfe6ff;box-shadow:0 0 8px #9fd0ff}
.stw .st-orb1{height:92%;aspect-ratio:1;animation:st-or calc(9s/var(--as,1)) linear infinite}.stw .st-orb2{height:70%;aspect-ratio:1;animation:st-or calc(13s/var(--as,1)) linear infinite reverse}.stw .st-orb3{height:110%;aspect-ratio:1;animation:st-or calc(17s/var(--as,1)) linear infinite}@keyframes st-or{to{transform:translate(-50%,-50%) rotate(360deg)}}
.stl-diamonds .st-dorb b{width:10px;height:10px;border-radius:0;transform:rotate(45deg);background:linear-gradient(135deg,#fff,#7cc4ff)}.stl-diamonds .st-dorb b:nth-child(2){top:auto;bottom:-5px}.stl-diamonds .st-dorb b:nth-child(3){top:50%;left:-5px}
.stl-gears .st-gear{position:absolute;color:var(--st-fr,#94a3b8);opacity:.55}.stl-gears .st-g1{width:42%;left:-6%;top:-10%;animation:st-gr calc(12s/var(--as,1)) linear infinite}.stl-gears .st-g2{width:30%;right:-4%;bottom:-8%;animation:st-gr calc(8s/var(--as,1)) linear infinite reverse}.stl-gears .st-g3{width:20%;right:20%;top:-6%;animation:st-gr calc(6s/var(--as,1)) linear infinite}@keyframes st-gr{to{transform:rotate(360deg)}}
.stl-infinity .st-inf{position:absolute;width:96%;height:96%;color:#a78bfa}.stl-infinity .st-dot{filter:drop-shadow(0 0 4px #f6c94a)}
.stl-radar .st-radar{position:absolute;left:50%;top:50%;height:110%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;background:conic-gradient(from 0deg,transparent 0 300deg,rgba(34,197,94,.55) 360deg);animation:st-or calc(4s/var(--as,1)) linear infinite}.stl-radar .st-radar-grid{position:absolute;left:50%;top:50%;height:110%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;background:repeating-radial-gradient(circle,transparent 0 18%,rgba(34,197,94,.35) 18% 18.6%)}.stl-radar .st-num{color:#86efac}
.stl-reactor .st-rx{position:absolute;left:50%;top:50%;border-radius:50%;border:2px solid #22e1ff;transform:translate(-50%,-50%);opacity:.5}.stl-reactor .st-rx1{height:60%;aspect-ratio:1}.stl-reactor .st-rx2{height:80%;aspect-ratio:1;border-style:dashed;animation:st-or calc(10s/var(--as,1)) linear infinite}.stl-reactor .st-rx3{height:100%;aspect-ratio:1;border-color:#3b82f6}.stl-reactor .st-core{position:absolute;left:50%;top:50%;height:46%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(34,225,255,.45),transparent 70%)}
.stl-race .st-lights{position:absolute;top:6%;display:flex;gap:.25em;z-index:2}.stl-race .st-lights i{width:.32em;height:.32em;border-radius:50%;background:#300;border:2px solid #111}.stl-race .st-track{position:absolute;left:5%;right:5%;bottom:10%;height:.1em;background:repeating-linear-gradient(90deg,#fff 0 12px,#e11d48 12px 24px)}
.stl-eclipse .st-sun{position:absolute;right:3%;height:56%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,#fff7d6,#f59e0b 60%,transparent 72%)}.stl-eclipse .st-moon{position:absolute;right:3%;height:52%;aspect-ratio:1;border-radius:50%;background:#05070d;box-shadow:0 0 18px rgba(255,214,120,.6);transition:transform .8s}.stl-eclipse .st-in{padding-right:26%}
.stl-portal .st-pr{position:absolute;left:50%;top:50%;border-radius:50%;transform:translate(-50%,-50%)}.stl-portal .st-pr1{height:110%;aspect-ratio:1;border:3px solid transparent;border-top-color:#a855f7;border-bottom-color:#22e1ff;animation:st-or calc(6s/var(--as,1)) linear infinite}.stl-portal .st-pr2{height:90%;aspect-ratio:1;border:2px solid transparent;border-left-color:#f472b6;border-right-color:#60a5fa;animation:st-or calc(4s/var(--as,1)) linear infinite reverse}.stl-portal .st-pr3{height:70%;aspect-ratio:1;background:radial-gradient(circle,rgba(168,85,247,.35),transparent 70%)}
.stl-cine .st-cb{position:absolute;left:0;right:0;height:12%;background:#000}.stl-cine .st-cb-t{top:0}.stl-cine .st-cb-b{bottom:0}.stl-cine .st-num{letter-spacing:.08em}
.stl-crown .st-crownsvg{position:relative;width:calc(var(--st-fs)*1.1*var(--st-dec,1));color:#f6c94a;filter:drop-shadow(0 2px 6px rgba(0,0,0,.6));z-index:2;order:-2}
.stl-gems .st-gems{display:flex;gap:.25em;z-index:2;order:6}.stl-gems .st-gems i{width:.22em;height:.22em;transform:rotate(45deg);background:linear-gradient(135deg,#a7f3d0,#059669);box-shadow:0 0 6px #10b981}
.stl-signature .st-sigsvg{position:absolute;height:104%;aspect-ratio:1}.stl-signature .st-sigsvg path{stroke-dashoffset:0}
.stl-aurora .st-in{overflow:hidden;border-radius:18px}.stl-aurora .st-aurbg{position:absolute;inset:-10%;background:radial-gradient(40% 60% at 25% 50%,rgba(34,225,255,.35),transparent),radial-gradient(40% 60% at 75% 50%,rgba(124,58,237,.35),transparent);filter:blur(16px);animation:st-au calc(8s/var(--as,1)) ease-in-out infinite alternate}@keyframes st-au{to{transform:translateX(6%) scale(1.1);filter:blur(20px) hue-rotate(60deg)}}
.stl-prism .st-prismbg{position:absolute;inset:20% 0;background:linear-gradient(90deg,#ff3b3b33,#ffe14d33,#3ddc8433,#3aa0ff33,#8a5cff33);filter:blur(8px)}
.stl-galaxy .st-stars{position:absolute;inset:0;background-image:radial-gradient(1px 1px at 20% 30%,#fff,transparent),radial-gradient(1px 1px at 70% 20%,#fff,transparent),radial-gradient(1.5px 1.5px at 40% 80%,#c4b5fd,transparent),radial-gradient(1px 1px at 85% 70%,#fff,transparent),radial-gradient(1px 1px at 10% 75%,#93c5fd,transparent)}
.stl-flame .st-flame{position:absolute;bottom:4%;left:20%;right:20%;height:60%;background:radial-gradient(60% 80% at 50% 100%,rgba(255,170,40,.75),rgba(255,60,0,.35) 50%,transparent 75%);filter:blur(6px);transform-origin:50% 100%;animation:st-fla calc(1.6s/var(--as,1)) ease-in-out infinite alternate}@keyframes st-fla{to{transform:scaleY(1.12) scaleX(.95)}}
.stl-frost .st-frostbg{position:absolute;inset:0;border-radius:18px;background:linear-gradient(135deg,rgba(186,230,253,.18),rgba(255,255,255,.05));border:1px solid rgba(186,230,253,.4);opacity:0;transition:opacity .6s}.stl-frost.st-paused .st-frostbg{opacity:1;backdrop-filter:blur(3px)}
.stl-gravity .st-floor{position:absolute;left:5%;right:5%;bottom:8%;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent)}
.stl-sandstorm .st-dunes{position:absolute;left:0;right:0;bottom:0;height:30%;background:radial-gradient(60% 100% at 30% 100%,rgba(217,170,90,.4),transparent),radial-gradient(60% 100% at 80% 100%,rgba(180,130,60,.35),transparent)}
.stl-floor .st-shadowfloor{position:absolute;bottom:14%;left:25%;right:25%;height:10%;border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.55),transparent);animation:st-sh calc(4s/var(--as,1)) ease-in-out infinite}@keyframes st-sh{50%{transform:scaleX(.8);opacity:.6}}.stl-floor .st-num{animation:st-fl calc(4s/var(--as,1)) ease-in-out infinite}
.stl-pulse .st-pring{position:absolute;left:50%;top:50%;width:70%;height:80%;transform:translate(-50%,-50%);border-radius:999px;border:1px solid rgba(255,255,255,.35);box-shadow:0 0 18px rgba(160,210,255,.25),inset 0 0 18px rgba(160,210,255,.15);animation:st-pr calc(3.4s/var(--as,1)) ease-in-out infinite}@keyframes st-pr{50%{transform:translate(-50%,-50%) scale(1.04);opacity:.6}}.stl-pulse .st-num{font-weight:300}
.stl-bolts .st-bolts{position:absolute;inset:10% 2%;width:96%;height:80%;color:#93c5fd;filter:drop-shadow(0 0 6px #60a5fa)}.stl-bolts .st-num{color:#dbeafe}
.stl-night .st-nightbg{position:absolute;inset:0;border-radius:18px;background:radial-gradient(70% 90% at 50% 0%,rgba(129,140,248,.35),transparent 70%),linear-gradient(#0b1030,#05070f);border:1px solid rgba(129,140,248,.35)}.stw.st-nobg .st-nightbg{display:none}
.stl-pure .st-num{font-weight:700}
.stx{position:absolute;display:block;pointer-events:none}
.stx-sheen{top:0;bottom:0;width:25%;background:linear-gradient(90deg,transparent,rgba(255,240,200,.75),transparent);mix-blend-mode:screen}
.stx-halo{left:50%;top:50%;width:80%;aspect-ratio:1;border-radius:50%;background:radial-gradient(closest-side,rgba(160,210,255,.45),transparent)}
.stx-gold{width:6px;height:6px;border-radius:50%;background:#f6c94a;box-shadow:0 0 8px #f6c94a}
.stx-facet{inset:0;background:linear-gradient(160deg,rgba(255,255,255,.75),rgba(170,220,255,.2) 50%,transparent)}
.stx-metal{inset:0;background:linear-gradient(115deg,transparent 30%,#fff 45%,#9aa6b5 50%,#fff 55%,transparent 70%) 200% 0/250% 100% no-repeat;mix-blend-mode:screen}
.stx-spot{top:50%;width:60%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(closest-side,rgba(255,250,230,.35),transparent)}
.stx-dia{width:8px;height:8px;background:linear-gradient(135deg,#fff,#7cc4ff);box-shadow:0 0 8px #bfe6ff}
.stx-br{top:4%;bottom:4%;width:10%;border:2px solid #22e1ff}.stx-br-a{left:2%;border-right:0}.stx-br-b{right:2%;border-left:0}
.stx-scan{inset:0;background:repeating-linear-gradient(0deg,rgba(120,240,255,.3) 0 2px,transparent 2px 5px);mix-blend-mode:screen}
.stx-code{top:0;font:700 14px/1 monospace;color:#4ade80;text-shadow:0 0 6px #22c55e}
.stx-ping{left:50%;top:50%;width:60%;aspect-ratio:1;border-radius:50%;border:2px solid #4ade80}
.stx-bolt{left:0;right:0;top:40%;height:20%;color:#93c5fd;filter:drop-shadow(0 0 6px #60a5fa)}.stx-bolt svg{width:100%;height:100%}
.stx-sand{width:3px;height:3px;border-radius:50%;background:#e8c46a}
.stx-bub{width:7px;height:7px;border-radius:50%;border:1px solid rgba(255,255,255,.7)}
.stx-zap{inset:0;background:radial-gradient(closest-side,rgba(74,222,128,.35),transparent)}
.stx-frost{inset:0;background:linear-gradient(135deg,rgba(186,230,253,.5),transparent);border-radius:18px}
.stx-cine{left:0;right:0;height:14%;background:#000;transform-origin:50% 0}.stx-cine-t{top:0}.stx-cine-b{bottom:0;transform-origin:50% 100%}
.stx-bfly{width:22px;height:16px;color:#f5d0fe;filter:drop-shadow(0 0 4px #e879f9)}.stx-bfly svg{width:100%;height:100%}
.stx-aur{top:50%;width:50%;height:140%;border-radius:50%;filter:blur(16px);mix-blend-mode:screen}
.stx-pt{width:5px;height:5px;border-radius:50%;background:#e5e7eb}
.stx-prism{inset:30% 0;background:linear-gradient(90deg,#ff3b3b,#ffe14d,#3ddc84,#3aa0ff,#8a5cff);filter:blur(6px);mix-blend-mode:screen;transform-origin:50% 50%}
.stx-bloom{left:50%;top:50%;width:90%;aspect-ratio:1;border-radius:50%;background:radial-gradient(closest-side,rgba(246,201,74,.5),transparent)}
.stx-streak{left:0;right:0;top:48%;height:3px;background:linear-gradient(90deg,transparent,#4d8dff,#f6c94a,transparent)}
.stx-ring{left:50%;top:50%;width:50%;aspect-ratio:1;border-radius:50%;border:2px solid rgba(250,204,21,.8)}
.stx-crack{inset:10%;background:linear-gradient(115deg,transparent 48%,rgba(255,255,255,.8) 49%,transparent 51%),linear-gradient(60deg,transparent 58%,rgba(255,255,255,.6) 59%,transparent 61%)}
.stx-end{left:0;right:0;top:35%;text-align:center;font:800 calc(var(--st-fs)*.5)/1.2 "Alexandria",sans-serif;color:#fde68a;text-shadow:0 0 20px rgba(246,201,74,.7),0 2px 8px #000}
.stx-stage{left:50%;top:-10%;font:800 calc(var(--st-fs)*.32)/1 "Alexandria",sans-serif;letter-spacing:.2em;color:#f6c94a;text-shadow:0 0 12px rgba(246,201,74,.8)}
.st-textonly .st-num{font-size:.55em}
`;
