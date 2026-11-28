// ====== القوائم المتناوبة — B6O6 Fantastic Smart Rotation V1 ======
// عنصر واحد (رابط واحد في OBS/TikTok LIVE Studio) يعرض عدة قوائم وطبقات في نفس المكان ويبدّل بينها.
// - كل قائمة تحتفظ بتصميمها وإعداداتها (نسخة مرجعية من عنصرها في التخطيط تُحدَّث تلقائياً من لوحة التحكم).
// - استقبال البيانات منفصل عن العرض: كل القوائم تبقى مُركّبة وتستقبل الأحداث وهي مخفية، فتظهر بأحدث الأرقام بلا تصفير.
// - التحكم المباشر (إيقاف/تثبيت/التالي/السابق) محفوظ في حالة الغرفة C.rot[id] ويصل لكل الروابط فوراً.
import { View } from "./view.js";
import { TYPES, esc } from "./defs.js";
import { entries } from "./leaderboard.js";
import { lbEntries } from "./lb.js";
import { recentDonations, goalProgress } from "./donations.js";
import { rulesForBoard } from "./clock.js";

export const ROT_DURS=[[3,"3 ثوانٍ"],[5,"5 ثوانٍ"],[10,"10 ثوانٍ"],[15,"15 ثانية"],[20,"20 ثانية"],[30,"30 ثانية"],[45,"45 ثانية"],[60,"دقيقة"],[120,"دقيقتان"],[300,"5 دقائق"]];
export const ROT_INDICATORS={none:"بدون مؤشرات",bar:"خط زمني أسفل القائمة",ring:"دائرة تقدم صغيرة",count:"عداد تنازلي",dots:"نقاط بعدد القوائم",next:"اسم القائمة التالية"};
export const ROT_SMART={bigGift:"دعم قوي (هدية كبيرة)",likes:"ارتفاع التكبيس",follow:"متابع جديد",subNear:"اقتراب نهاية السابثون",goal:"تحقيق هدف",gift:"هدية معيّنة",donation:"دونيشن"};
export const ROT_FALLBACK={transparent:"شفافة بالكامل",text:"نص احتياطي",logo:"شعار"};
const rotR=(a,b)=>a+Math.random()*(b-a);
const RT_EZ="cubic-bezier(.2,.85,.25,1)", RT_IO="cubic-bezier(.65,0,.35,1)", RT_BK="cubic-bezier(.34,1.56,.64,1)";
function rtA(el,kf,o){ if(!el||!el.animate) return null; try{ return el.animate(kf,Object.assign({fill:"backwards"},o)) }catch(e){ return null } }
let RT_LIVE=0, RT_NOCAP=false;
function rtFx(host,c,cls,css,life){ if(c.lite||(!RT_NOCAP&&RT_LIVE>60)) return null; const e=document.createElement("i"); e.className="rtx "+cls; if(css) e.style.cssText=css; host.appendChild(e); RT_LIVE++; setTimeout(()=>{ e.remove(); RT_LIVE=Math.max(0,RT_LIVE-1) },life||c.d*1.6); return e }
function rtSvg(host,c,cls,inner,vb,life){ const e=rtFx(host,c,cls,"",life); if(!e) return null; e.innerHTML=`<svg viewBox="${vb||"0 0 100 100"}" preserveAspectRatio="none">${inner}</svg>`; return e.firstChild }

/** 40 مؤثر انتقال — run(out,in,fx,c): out/in = العنصران، fx = طبقة المؤثرات الشفافة، c={d,p,dir,lite} */
export const RT_TRANS=[
{id:"smoothFade",n:1,name:"Smooth Fade",run(o,i,f,c){ rtA(o,[{opacity:1},{opacity:0}],{duration:c.d*.5,fill:"forwards"}); rtA(i,[{opacity:0},{opacity:1}],{duration:c.d*.5,delay:c.d*.5}) }},
{id:"crossfade",n:2,name:"Crossfade",run(o,i,f,c){ rtA(o,[{opacity:1},{opacity:0}],{duration:c.d,fill:"forwards",easing:"linear"}); rtA(i,[{opacity:0},{opacity:1}],{duration:c.d,easing:"linear"}) }},
{id:"slideRight",n:3,name:"Slide Right",run(o,i,f,c){ rtA(o,[{transform:"none"},{transform:"translateX(100%)"}],{duration:c.d,fill:"forwards",easing:RT_IO}); rtA(i,[{transform:"translateX(-100%)"},{transform:"none"}],{duration:c.d,easing:RT_IO}) }},
{id:"slideLeft",n:4,name:"Slide Left",run(o,i,f,c){ rtA(o,[{transform:"none"},{transform:"translateX(-100%)"}],{duration:c.d,fill:"forwards",easing:RT_IO}); rtA(i,[{transform:"translateX(100%)"},{transform:"none"}],{duration:c.d,easing:RT_IO}) }},
{id:"slideUp",n:5,name:"Slide Up",run(o,i,f,c){ rtA(o,[{transform:"none"},{transform:"translateY(-100%)"}],{duration:c.d,fill:"forwards",easing:RT_IO}); rtA(i,[{transform:"translateY(100%)"},{transform:"none"}],{duration:c.d,easing:RT_IO}) }},
{id:"slideDown",n:6,name:"Slide Down",run(o,i,f,c){ rtA(o,[{transform:"none"},{transform:"translateY(100%)"}],{duration:c.d,fill:"forwards",easing:RT_IO}); rtA(i,[{transform:"translateY(-100%)"},{transform:"none"}],{duration:c.d,easing:RT_IO}) }},
{id:"cinematicZoom",n:7,name:"Cinematic Zoom",run(o,i,f,c){ rtA(o,[{transform:"scale(1)",filter:"blur(0)",opacity:1},{transform:`scale(${1+.35*c.p})`,filter:"blur(8px)",opacity:0}],{duration:c.d*.7,fill:"forwards",easing:"ease-in"}); rtA(i,[{transform:"scale(.78)",opacity:0},{transform:"none",opacity:1}],{duration:c.d*.8,delay:c.d*.35,easing:RT_EZ}) }},
{id:"glassReveal",n:8,name:"Glass Reveal",run(o,i,f,c){ const g=rtFx(f,c,"rtx-glass"); rtA(g,[{transform:"translateX(110%) skewX(-12deg)",opacity:0},{transform:"translateX(0) skewX(-12deg)",opacity:1,offset:.5},{transform:"translateX(-110%) skewX(-12deg)",opacity:0}],{duration:c.d*1.2,easing:RT_IO});
 rtA(o,[{opacity:1},{opacity:0}],{duration:c.d*.6,fill:"forwards"}); rtA(i,[{clipPath:"inset(0 0 0 100%)"},{clipPath:"inset(0 0 0 0)"}],{duration:c.d*.7,delay:c.d*.45,easing:RT_EZ}) }},
{id:"goldenSweep",n:9,name:"Golden Sweep",run(o,i,f,c){ const b=rtFx(f,c,"rtx-gold"); rtA(b,[{left:"-30%"},{left:"110%"}],{duration:c.d,easing:"cubic-bezier(.5,0,.5,1)"});
 rtA(o,[{clipPath:"inset(0 0 0 0)"},{clipPath:"inset(0 0 0 100%)"}],{duration:c.d,fill:"forwards",easing:"cubic-bezier(.5,0,.5,1)"}); rtA(i,[{clipPath:"inset(0 100% 0 0)"},{clipPath:"inset(0 0 0 0)"}],{duration:c.d,easing:"cubic-bezier(.5,0,.5,1)"}) }},
{id:"neonWave",n:10,name:"Neon Wave",run(o,i,f,c){ const s=rtSvg(f,c,"rtx-neon",`<path d="M0 50 Q12.5 20 25 50 T50 50 T75 50 T100 50" fill="none" stroke="currentColor" stroke-width="2" vector-effect="non-scaling-stroke" pathLength="100" stroke-dasharray="100"/>`); if(s) rtA(s.firstChild,[{strokeDashoffset:100},{strokeDashoffset:0,offset:.5},{strokeDashoffset:-100}],{duration:c.d});
 rtA(o,[{clipPath:"polygon(0 0,100% 0,100% 100%,0 100%)"},{clipPath:"polygon(0 0,100% 0,100% 0%,0 30%)"}],{duration:c.d*.6,fill:"forwards"}); rtA(i,[{clipPath:"polygon(0 70%,100% 100%,100% 100%,0 100%)"},{clipPath:"polygon(0 0,100% 0,100% 100%,0 100%)"}],{duration:c.d*.7,delay:c.d*.35,easing:RT_EZ}) }},
{id:"digitalScan",n:11,name:"Digital Scan",run(o,i,f,c){ const s=rtFx(f,c,"rtx-scan"); rtA(s,[{top:"-4%"},{top:"104%"}],{duration:c.d,easing:"linear"});
 rtA(o,[{clipPath:"inset(0 0 0 0)"},{clipPath:"inset(100% 0 0 0)"}],{duration:c.d,fill:"forwards",easing:"linear"}); rtA(i,[{clipPath:"inset(0 0 100% 0)"},{clipPath:"inset(0 0 0 0)"}],{duration:c.d,easing:"linear"}) }},
{id:"holographic",n:12,name:"Holographic Transition",run(o,i,f,c){ rtFx(f,c,"rtx-holo");
 rtA(o,[{opacity:1,filter:"hue-rotate(0)"},{opacity:.4,filter:"hue-rotate(90deg)",offset:.3},{opacity:.8,offset:.5},{opacity:0,filter:"hue-rotate(180deg)"}],{duration:c.d*.6,fill:"forwards",easing:"steps(6)"});
 rtA(i,[{opacity:0,transform:"skewX(10deg)",filter:"hue-rotate(-120deg) brightness(1.6)"},{opacity:.6,offset:.4},{opacity:.3,offset:.55},{opacity:1,transform:"none",filter:"none"}],{duration:c.d*.8,delay:c.d*.3}) }},
{id:"liquidMorph",n:13,name:"Liquid Morph",run(o,i,f,c){ rtA(o,[{borderRadius:"0%",transform:"scale(1)",opacity:1},{borderRadius:"50%",transform:"scale(.3)",opacity:0}],{duration:c.d*.6,fill:"forwards",easing:"ease-in"});
 rtA(i,[{clipPath:"circle(0% at 50% 50%)",filter:"blur(10px)"},{clipPath:"circle(40% at 55% 45%)",filter:"blur(4px)",offset:.5},{clipPath:"circle(75% at 50% 50%)",filter:"blur(0)"}],{duration:c.d,delay:c.d*.3,easing:RT_EZ}) }},
{id:"diamondReveal",n:14,name:"Diamond Reveal",run(o,i,f,c){ rtA(o,[{opacity:1},{opacity:0}],{duration:c.d*.5,fill:"forwards",delay:c.d*.3});
 rtA(i,[{clipPath:"polygon(50% 50%,50% 50%,50% 50%,50% 50%)"},{clipPath:"polygon(50% -60%,160% 50%,50% 160%,-60% 50%)"}],{duration:c.d,easing:RT_EZ}) }},
{id:"crystalReflection",n:15,name:"Crystal Reflection",run(o,i,f,c){ ["polygon(0 0,35% 0,15% 100%,0 100%)","polygon(40% 0,60% 0,45% 100%,25% 100%)","polygon(65% 0,100% 0,100% 100%,50% 100%)"].forEach((p,k)=>{ const e=rtFx(f,c,"rtx-facet",`clip-path:${p}`); rtA(e,[{opacity:0},{opacity:.8,offset:.4},{opacity:0}],{duration:c.d*.6,delay:k*c.d*.15}) });
 rtA(o,[{opacity:1,filter:"brightness(1)"},{opacity:0,filter:"brightness(2.2)"}],{duration:c.d*.5,fill:"forwards"}); rtA(i,[{opacity:0,filter:"brightness(2.2) saturate(.3)"},{opacity:1,filter:"none"}],{duration:c.d*.7,delay:c.d*.35}) }},
{id:"pixelTransition",n:16,name:"Pixel Transition",run(o,i,f,c){ const C=10,R=6; for(let y=0;y<R;y++) for(let x=0;x<C;x++){ const e=rtFx(f,c,"rtx-px",`left:${x*10}%;top:${y/R*100}%;width:10.4%;height:${100/R+.6}%`); rtA(e,[{opacity:0},{opacity:1,offset:.5},{opacity:0}],{duration:c.d*.9,delay:rotR(0,c.d*.25),easing:"steps(2)"}) }
 rtA(o,[{opacity:1},{opacity:0}],{duration:1,delay:c.d*.45,fill:"forwards"}); rtA(i,[{opacity:0},{opacity:1}],{duration:1,delay:c.d*.45}) }},
{id:"flip3D",n:17,name:"3D Flip",run(o,i,f,c){ rtA(o,[{transform:"perspective(900px) rotateY(0)"},{transform:`perspective(900px) rotateY(${90*c.dir}deg)`}],{duration:c.d*.5,fill:"forwards",easing:"ease-in"}); rtA(i,[{transform:`perspective(900px) rotateY(${-90*c.dir}deg)`},{transform:"perspective(900px) rotateY(0)"}],{duration:c.d*.5,delay:c.d*.5,easing:"ease-out"}) }},
{id:"cardRotation",n:18,name:"Card Rotation",run(o,i,f,c){ rtA(o,[{transform:"none",opacity:1},{transform:`translateX(${-55*c.dir}%) rotate(${-14*c.dir}deg)`,opacity:0}],{duration:c.d*.7,fill:"forwards",easing:"ease-in"}); rtA(i,[{transform:`translateX(${55*c.dir}%) rotate(${14*c.dir}deg)`,opacity:0},{transform:"none",opacity:1}],{duration:c.d*.8,delay:c.d*.2,easing:RT_EZ}) }},
{id:"curtainReveal",n:19,name:"Curtain Reveal",run(o,i,f,c){ const a=rtFx(f,c,"rtx-cur rtx-cur-a"), b=rtFx(f,c,"rtx-cur rtx-cur-b"); rtA(a,[{transform:"translateX(-100%)"},{transform:"none",offset:.45},{transform:"none",offset:.55},{transform:"translateX(-100%)"}],{duration:c.d*1.2,easing:RT_IO}); rtA(b,[{transform:"translateX(100%)"},{transform:"none",offset:.45},{transform:"none",offset:.55},{transform:"translateX(100%)"}],{duration:c.d*1.2,easing:RT_IO});
 rtA(o,[{opacity:1},{opacity:0}],{duration:1,delay:c.d*.55,fill:"forwards"}); rtA(i,[{opacity:0},{opacity:1}],{duration:1,delay:c.d*.6}) }},
{id:"lightTunnel",n:20,name:"Light Tunnel",run(o,i,f,c){ for(let k=0;k<4;k++){ const r=rtFx(f,c,"rtx-ring"); rtA(r,[{transform:"translate(-50%,-50%) scale(2.6)",opacity:0},{opacity:.8,offset:.4},{transform:"translate(-50%,-50%) scale(0)",opacity:0}],{duration:c.d*.8,delay:k*c.d*.1,easing:"ease-in"}) }
 rtA(o,[{transform:"scale(1)",opacity:1},{transform:"scale(0)",opacity:0}],{duration:c.d*.55,fill:"forwards",easing:"ease-in"}); rtA(i,[{transform:"scale(2.4)",opacity:0},{transform:"none",opacity:1}],{duration:c.d*.6,delay:c.d*.45,easing:"ease-out"}) }},
{id:"magnetic",n:21,name:"Magnetic Transition",run(o,i,f,c){ rtA(o,[{transform:"none"},{transform:`translateX(${8*c.dir}%) scaleX(1.05)`,offset:.3},{transform:`translateX(${-120*c.dir}%) scaleX(.6)`}],{duration:c.d*.7,fill:"forwards",easing:"cubic-bezier(.7,0,.9,.4)"}); rtA(i,[{transform:`translateX(${120*c.dir}%) scaleX(.6)`},{transform:`translateX(${-6*c.dir}%) scaleX(1.04)`,offset:.75},{transform:"none"}],{duration:c.d*.8,delay:c.d*.3,easing:"cubic-bezier(.2,.6,.3,1.3)"}) }},
{id:"motionBlur",n:22,name:"Motion Blur",run(o,i,f,c){ rtA(o,[{transform:"none",filter:"blur(0)"},{transform:`translateX(${-60*c.dir}%)`,filter:"blur(16px)",opacity:0}],{duration:c.d*.45,fill:"forwards",easing:"ease-in"}); rtA(i,[{transform:`translateX(${60*c.dir}%)`,filter:"blur(16px)",opacity:0},{transform:"none",filter:"blur(0)",opacity:1}],{duration:c.d*.55,delay:c.d*.35,easing:"ease-out"}) }},
{id:"softDissolve",n:23,name:"Soft Dissolve",run(o,i,f,c){ rtA(o,[{opacity:1,filter:"contrast(1) blur(0)"},{opacity:0,filter:"contrast(.2) blur(3px)"}],{duration:c.d,fill:"forwards"}); rtA(i,[{opacity:0,filter:"contrast(.2) blur(3px)"},{opacity:1,filter:"contrast(1) blur(0)"}],{duration:c.d,delay:c.d*.25}) }},
{id:"gradientWipe",n:24,name:"Gradient Wipe",run(o,i,f,c){ const m="linear-gradient(90deg,#000 40%,transparent 60%)"; rtA(i,[{maskImage:m,WebkitMaskImage:m,maskSize:"300% 100%",WebkitMaskSize:"300% 100%",maskPosition:"100% 0",WebkitMaskPosition:"100% 0"},{maskImage:m,WebkitMaskImage:m,maskSize:"300% 100%",WebkitMaskSize:"300% 100%",maskPosition:"0 0",WebkitMaskPosition:"0 0"}],{duration:c.d,easing:"ease-in-out"});
 rtA(o,[{opacity:1},{opacity:1,offset:.6},{opacity:0}],{duration:c.d,fill:"forwards"}) }},
{id:"geometricReveal",n:25,name:"Geometric Reveal",run(o,i,f,c){ rtA(i,[{clipPath:"polygon(50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%)"},{clipPath:"polygon(50% 20%,80% 35%,80% 65%,50% 80%,20% 65%,20% 35%)",offset:.5},{clipPath:"polygon(50% -50%,150% 0%,150% 100%,50% 150%,-50% 100%,-50% 0%)"}],{duration:c.d,easing:"steps(5,end)"});
 rtA(o,[{opacity:1},{opacity:0}],{duration:c.d*.4,delay:c.d*.5,fill:"forwards"}) }},
{id:"spotlight",n:26,name:"Spotlight",run(o,i,f,c){ const s=rtFx(f,c,"rtx-spot"); rtA(s,[{left:"10%",opacity:0},{left:"50%",opacity:1,offset:.5},{left:"50%",opacity:0}],{duration:c.d});
 rtA(o,[{filter:"brightness(1)"},{filter:"brightness(.15)",opacity:0}],{duration:c.d*.5,fill:"forwards"}); rtA(i,[{clipPath:"circle(0% at 50% 50%)"},{clipPath:"circle(18% at 50% 50%)",offset:.4},{clipPath:"circle(80% at 50% 50%)"}],{duration:c.d,delay:c.d*.2,easing:RT_EZ}) }},
{id:"laserSweep",n:27,name:"Laser Sweep",run(o,i,f,c){ const l=rtFx(f,c,"rtx-laser"); rtA(l,[{left:c.dir>0?"102%":"-2%"},{left:c.dir>0?"-2%":"102%"}],{duration:c.d*.9,easing:"linear"});
 rtA(i,[{clipPath:c.dir>0?"inset(0 0 0 100%)":"inset(0 100% 0 0)"},{clipPath:"inset(0 0 0 0)"}],{duration:c.d*.9,easing:"linear"}); rtA(o,[{clipPath:"inset(0 0 0 0)"},{clipPath:c.dir>0?"inset(0 100% 0 0)":"inset(0 0 0 100%)"}],{duration:c.d*.9,fill:"forwards",easing:"linear",composite:"replace"}) }},
{id:"electricPulse",n:28,name:"Electric Pulse",run(o,i,f,c){ const s=rtSvg(f,c,"rtx-bolt",`<polyline fill="none" stroke="currentColor" stroke-width="2" vector-effect="non-scaling-stroke" points="0,50 100,50"/>`); if(s){ const pl=s.firstChild, t0=performance.now(); const st=()=>{ if(!pl.isConnected) return; let p="0,50"; for(let x=5;x<=100;x+=5) p+=` ${x},${50+rotR(-30,30)*c.p}`; pl.setAttribute("points",p); if(performance.now()-t0<c.d) setTimeout(st,60) }; st() }
 rtA(o,[{filter:"brightness(1)",opacity:1},{filter:"brightness(3)",opacity:1,offset:.3},{filter:"brightness(1)",opacity:0}],{duration:c.d*.5,fill:"forwards"}); rtA(i,[{transform:"translateX(-2%)",opacity:0},{transform:"translateX(2%)",opacity:1,offset:.3},{transform:"translateX(-1%)",offset:.6},{transform:"none"}],{duration:c.d*.6,delay:c.d*.4,easing:"steps(6)"}) }},
{id:"waveDistortion",n:29,name:"Wave Distortion",run(o,i,f,c){ rtA(o,[{transform:"none",opacity:1},{transform:"skewX(12deg) scaleY(.9)",offset:.33},{transform:"skewX(-12deg) scaleY(1.05)",offset:.66},{transform:"skewX(8deg) scaleY(.6)",opacity:0}],{duration:c.d*.6,fill:"forwards"}); rtA(i,[{transform:"skewX(-10deg) scaleY(.6)",opacity:0},{transform:"skewX(8deg) scaleY(1.05)",opacity:1,offset:.4},{transform:"skewX(-4deg)",offset:.7},{transform:"none"}],{duration:c.d*.8,delay:c.d*.35}) }},
{id:"foldingPanels",n:30,name:"Folding Panels",run(o,i,f,c){ rtA(o,[{transform:"perspective(900px) rotateX(0)",transformOrigin:"50% 100%"},{transform:"perspective(900px) rotateX(-90deg)",transformOrigin:"50% 100%"}],{duration:c.d*.5,fill:"forwards",easing:"ease-in"}); rtA(i,[{transform:"perspective(900px) rotateX(90deg)",transformOrigin:"50% 0"},{transform:"perspective(900px) rotateX(-12deg)",transformOrigin:"50% 0",offset:.7},{transform:"perspective(900px) rotateX(0)",transformOrigin:"50% 0"}],{duration:c.d*.6,delay:c.d*.4}); const k=rtFx(f,c,"rtx-crease"); rtA(k,[{opacity:.8},{opacity:0}],{duration:c.d}) }},
{id:"verticalSplit",n:31,name:"Vertical Split",run(o,i,f,c){ rtA(o,[{clipPath:"inset(0 0 0 0)"},{clipPath:"inset(0 50% 0 50%)"}],{duration:c.d*.55,fill:"forwards",easing:"ease-in"}); rtA(i,[{clipPath:"inset(0 50% 0 50%)"},{clipPath:"inset(0 0 0 0)"}],{duration:c.d*.55,delay:c.d*.45,easing:"ease-out"}) }},
{id:"horizontalSplit",n:32,name:"Horizontal Split",run(o,i,f,c){ rtA(o,[{clipPath:"inset(0 0 0 0)"},{clipPath:"inset(50% 0 50% 0)"}],{duration:c.d*.55,fill:"forwards",easing:"ease-in"}); rtA(i,[{clipPath:"inset(50% 0 50% 0)"},{clipPath:"inset(0 0 0 0)"}],{duration:c.d*.55,delay:c.d*.45,easing:"ease-out"}) }},
{id:"particleReveal",n:33,name:"Particle Reveal",run(o,i,f,c){ for(let k=0;k<26;k++){ const e=rtFx(f,c,"rtx-pt",`left:${rotR(5,95)}%;top:${rotR(10,90)}%`); rtA(e,[{transform:`translate(${rotR(-140,140)}px,${rotR(-90,90)}px) scale(.3)`,opacity:0},{transform:"none",opacity:1,offset:.6},{transform:"scale(0)",opacity:0}],{duration:c.d,delay:rotR(0,c.d*.2),easing:RT_EZ}) }
 rtA(o,[{opacity:1},{opacity:0}],{duration:c.d*.4,fill:"forwards"}); rtA(i,[{opacity:0,filter:"blur(4px)"},{opacity:1,filter:"blur(0)"}],{duration:c.d*.5,delay:c.d*.55}) }},
{id:"elegantScale",n:34,name:"Elegant Scale",run(o,i,f,c){ rtA(o,[{transform:"scale(1)",opacity:1},{transform:"scale(.92)",opacity:0}],{duration:c.d*.6,fill:"forwards",easing:"cubic-bezier(.4,0,.2,1)"}); rtA(i,[{transform:"scale(1.06)",opacity:0},{transform:"scale(1)",opacity:1}],{duration:c.d*.8,delay:c.d*.3,easing:"cubic-bezier(.16,1,.3,1)"}) }},
{id:"aurora",n:35,name:"Aurora Transition",run(o,i,f,c){ ["#22e1ff","#7c3aed","#22c55e"].forEach((col,k)=>{ const e=rtFx(f,c,"rtx-aur",`background:radial-gradient(closest-side,${col},transparent);left:${20+k*30}%`,c.d*1.6); rtA(e,[{transform:"translate(-50%,-50%) scale(.3)",opacity:0},{transform:`translate(-50%,-50%) scale(1.4) translateX(${(k-1)*20}px)`,opacity:.6,offset:.5},{opacity:0}],{duration:c.d*1.3,delay:k*80}) });
 rtA(o,[{opacity:1,filter:"hue-rotate(0)"},{opacity:0,filter:"hue-rotate(80deg)"}],{duration:c.d*.6,fill:"forwards"}); rtA(i,[{opacity:0,filter:"hue-rotate(-80deg)"},{opacity:1,filter:"hue-rotate(0)"}],{duration:c.d*.8,delay:c.d*.4}) }},
{id:"metallicReflection",n:36,name:"Metallic Reflection",run(o,i,f,c){ const m=rtFx(f,c,"rtx-metal"); rtA(m,[{backgroundPosition:"200% 0"},{backgroundPosition:"-100% 0"}],{duration:c.d,easing:RT_IO});
 rtA(o,[{filter:"grayscale(0)",opacity:1},{filter:"grayscale(1) brightness(1.6)",opacity:0}],{duration:c.d*.5,fill:"forwards"}); rtA(i,[{filter:"grayscale(1) brightness(1.6)",opacity:0},{filter:"grayscale(0)",opacity:1}],{duration:c.d*.6,delay:c.d*.45}) }},
{id:"digitalGrid",n:37,name:"Digital Grid",run(o,i,f,c){ const g=rtFx(f,c,"rtx-grid"); rtA(g,[{opacity:0,backgroundSize:"40px 40px"},{opacity:.9,backgroundSize:"20px 20px",offset:.5},{opacity:0,backgroundSize:"10px 10px"}],{duration:c.d});
 rtA(o,[{opacity:1},{opacity:0}],{duration:c.d*.5,fill:"forwards",easing:"steps(5)"}); rtA(i,[{opacity:0,transform:"scale(.97)"},{opacity:1,transform:"none"}],{duration:c.d*.5,delay:c.d*.5,easing:"steps(5)"}) }},
{id:"orbit",n:38,name:"Orbit Transition",run(o,i,f,c){ rtA(o,[{transform:"rotate(0) translateX(0) rotate(0)",opacity:1},{transform:`rotate(${-60*c.dir}deg) translateX(${40*c.dir}%) rotate(${60*c.dir}deg) scale(.5)`,opacity:0}],{duration:c.d*.7,fill:"forwards",easing:"ease-in"}); rtA(i,[{transform:`rotate(${60*c.dir}deg) translateX(${-40*c.dir}%) rotate(${-60*c.dir}deg) scale(.5)`,opacity:0},{transform:"none",opacity:1}],{duration:c.d*.8,delay:c.d*.3,easing:RT_EZ}) }},
{id:"fantasticMotion",n:39,name:"Fantastic Motion",run(o,i,f,c){ const s=rtSvg(f,c,"rtx-hex",`<path d="M50 4 92 27v46L50 96 8 73V27Z" fill="none" stroke="url(#rtsg)" stroke-width="3" vector-effect="non-scaling-stroke" pathLength="100" stroke-dasharray="100"/><defs><linearGradient id="rtsg"><stop offset="0" stop-color="#4d8dff"/><stop offset="1" stop-color="#f6c94a"/></linearGradient></defs>`); if(s) rtA(s.firstChild,[{strokeDashoffset:100},{strokeDashoffset:0,offset:.5},{strokeDashoffset:0,opacity:1,offset:.8},{opacity:0}],{duration:c.d*1.2});
 const st=rtFx(f,c,"rtx-streak"); rtA(st,[{transform:"translateX(110%) scaleX(.3)",opacity:0},{transform:"translateX(0) scaleX(1)",opacity:1,offset:.5},{transform:"translateX(-110%) scaleX(.3)",opacity:0}],{duration:c.d,easing:RT_IO});
 rtA(o,[{transform:"none",opacity:1},{transform:"scale(.9) translateY(4%)",opacity:0}],{duration:c.d*.5,fill:"forwards"}); rtA(i,[{clipPath:"polygon(50% 50%,50% 50%,50% 50%,50% 50%,50% 50%,50% 50%)",transform:"scale(1.08)"},{clipPath:"polygon(50% -40%,140% 10%,140% 90%,50% 140%,-40% 90%,-40% 10%)",transform:"none"}],{duration:c.d*.8,delay:c.d*.35,easing:RT_EZ}) }},
{id:"instant",n:40,name:"Instant Switch",run(){ /* تبديل فوري بلا حركة */ }},
];
export const RT_BY_ID=Object.fromEntries(RT_TRANS.map(t=>[t.id,t]));
/** بصمة فعلية لمؤثر انتقال (لا تعتمد على الاسم): الأدوار + الخصائص + شكل الإطارات + التأخير + المؤثرات المنشأة */
export function rtTrace(o,i,f,id){ const T=[], orig=Element.prototype.animate, origAp=Element.prototype.appendChild;
 const role=el=>el===o?"out":el===i?"in":el.closest&&el.closest(".rtx")?"fx:"+el.closest(".rtx").className.split(" ").slice(1).join("."):"x";
 const shape=v=>String(v).replace(/#[0-9a-f]{3,8}|rgba?\([^)]*\)|url\([^)]*\)/gi,"C").replace(/-?\d+(\.\d+)?/g,m=>+m===0?"0":+m<0?"-n":"n");
 Element.prototype.animate=function(kf,op){ const k=Array.isArray(kf)?kf:[]; T.push("A:"+role(this)+":"+k.length+":"+k.map(x=>Object.keys(x).filter(p=>p!=="offset"&&p!=="easing").sort().map(p=>p+"="+shape(x[p])).join(",")).join("|")+":"+(op&&op.delay?"D":"")+(op&&/steps/.test(op.easing||"")?"S":"")); return orig.call(this,kf,op) };
 Element.prototype.appendChild=function(n){ if(n&&n.classList&&n.classList.contains("rtx")) T.push("F:"+n.className); return origAp.call(this,n) };
 RT_NOCAP=true; try{ RT_BY_ID[id].run(o,i,f,{d:800,p:1,dir:1,lite:false}) } finally { RT_NOCAP=false; Element.prototype.animate=orig; Element.prototype.appendChild=origAp }
 return T }

/** هل القائمة فارغة الآن؟ (لتجاوز القوائم الفارغة) — يعتمد على البيانات الحقيقية فقط */
export function rotEmpty(w,src){ if(!w||!src) return false; const T=TYPES[w.type]||{};
 try{
  if(T.board) return !entries(w,src.D,src.H).length;
  if(w.type==="lb") return !lbEntries(w,src).length;
  if(T.le){ const L=src.C&&src.C.latest||{}; return !L[w.kind] }
  if(T.rules){ const s=src.C&&src.C.subathon; return !s||s.status==="idle"||s.status==="ended"||!rulesForBoard(s).length }
  if(w.type==="subathon"){ const s=src.C&&src.C.subathon; return !s||s.status==="idle"||s.status==="ended" }
  if(["donLatest","donCard","donText","donLast5","donBoard","donTop","donTicker"].includes(w.type)) return !recentDonations(src.DN||{list:[]},src.DC||{},{limit:1}).length;
  if(T.soc) return !((src.SO&&src.SO.accounts)||[]).some(a=>a.enabled!==false);
  if(w.type==="rcard") return w.rcMode==="media"&&!w.rcSrc;
 }catch(e){ return false }
 return false }
/** وصف قصير لعنصر (للوحة التحكم والمؤشر «التالي») */
export function rotLabel(cfg){ return (cfg&&(cfg.name||cfg.title||(TYPES[cfg.type]||{}).label))||"قائمة" }

/* ================= عنصر «نص / شعار / إعلان» (rcard) ================= */
export const RC_MODES={text:"نص مخصص / رسالة ترحيبية",logo:"شعار صانع المحتوى",media:"صورة أو مقطع إعلاني"};

/* ================= العرض ================= */
let rotCss=false;
function ensureRotCSS(){ if(rotCss||typeof document==="undefined") return; rotCss=true; const st=document.createElement("style"); st.id="b6o6-rot"; st.textContent=ROT_CSS; document.head.appendChild(st) }
const rotReduced=()=>{ try{ return matchMedia("(prefers-reduced-motion: reduce)").matches }catch(e){ return false } };

Object.assign(View.prototype,{
 applyRc(w,W,H){ ensureRotCSS(); const e=this.el; e.className=`wd rcw rcm-${w.rcMode||"text"}${this.opts.editor?(" "+(w.locked?"locked":"")+(w.visible?"":" hid")+(this.opts.sel===w.id?" sel":"")):""}`;
  e.style.setProperty("--rcc",w.rcColor||"#ffffff"); e.style.setProperty("--rcfs",Math.min(H*.42,W*.09)*(+w.fontScale||1)+"px");
  const sig=[w.rcMode,w.rcText,w.rcSub,w.rcSrc,w.rcFit,w.rcBg].join("|"); if(sig===this.rcSig) return; this.rcSig=sig; const ed=this.opts.editor?'<div class="rh"></div><div class="lockb">🔒</div>':"";
  const src=String(w.rcSrc||""), safe=/^(https:\/\/|data:image\/|data:video\/|\/)/.test(src)?src:"", vid=/^data:video\/|\.(mp4|webm)(\?|$)/i.test(safe);
  e.innerHTML=(w.rcMode==="text"||!w.rcMode)?`<div class="rc-in${w.rcBg?" rc-bg":""}"><b class="rc-t">${esc(w.rcText||"أهلاً بكم في البث")}</b>${w.rcSub?`<span class="rc-s">${esc(w.rcSub)}</span>`:""}</div>${ed}`
   :safe?(vid?`<video class="rc-m" src="${esc(safe)}" autoplay muted loop playsinline style="object-fit:${w.rcFit||"contain"}"></video>`:`<img class="rc-m" src="${esc(safe)}" alt="" style="object-fit:${w.rcFit||"contain"}">`)+ed
   :`<div class="rc-in rc-empty">${this.opts.editor?"اختر صورة أو مقطعاً":""}</div>${ed}` },

 /** المجموعة المتناوبة */
 applyRot(w,W,H){ ensureRotCSS(); const e=this.el, ed=this.opts.editor;
  e.className=`wd rotw rti-${w.indicator||"none"}${ed?(" "+(w.locked?"locked":"")+(w.visible?"":" hid")+(this.opts.sel===w.id?" sel":"")):""}`;
  const S=e.style; S.setProperty("--ric",w.indColor||"#4d8dff"); S.setProperty("--ris",String(Math.max(.4,Math.min(2.5,+w.indSize||1)))); S.setProperty("--rio",String(w.indOp??.9));
  this.rotWH={W,H};
  if(!this.rotStage){ e.innerHTML=`<div class="rot-stage"></div><i class="rot-fx"></i><div class="rot-ind"></div>${ed?'<div class="rh"></div><div class="lockb">🔒</div>':""}`; this.rotStage=e.querySelector(".rot-stage"); this.rotFxL=e.querySelector(".rot-fx"); this.rotInd=e.querySelector(".rot-ind"); this.rotKids=new Map(); this.rs={i:-1,since:0,cyc:0,lastTr:""} }
  else if(ed&&!e.querySelector(".rh")) e.insertAdjacentHTML("beforeend",'<div class="rh"></div><div class="lockb">🔒</div>');
  // القوائم: كل قائمة View مستقل مُركّب دائماً (يستقبل البيانات وهو مخفي)
  const items=(w.items||[]).filter(x=>x&&x.cfg&&TYPES[x.cfg.type]&&x.cfg.type!=="rotator"), seen=new Set();
  for(const it of items){ seen.add(it.id); const f=it.fit||{}, fx=+f.x||0, fy=+f.y||0, fw=+f.w||1, fh=+f.h||1;
   const cfg={...it.cfg,id:"rk_"+w.id+"_"+it.id,x:fx,y:fy,w:fw,h:fh,visible:true,locked:true,z:1};
   let k=this.rotKids.get(it.id);
   if(!k){ const box=document.createElement("div"); box.className="rot-item"; box.dataset.item=it.id; const v=new View(cfg,{w:W,h:H},{data:this.opts.data,refW:this.opts.refW||W,globalFx:this.opts.globalFx,lowPerf:this.opts.lowPerf,mute:true}); box.appendChild(v.el); this.rotStage.appendChild(box); k={box,v,sig:""}; this.rotKids.set(it.id,k); try{ if(this.opts.data) v.refresh(this.opts.data(),true) }catch(_){} }
   const sig=JSON.stringify(cfg)+W+"x"+H; if(sig!==k.sig){ k.sig=sig; k.v.cv={w:W,h:H}; try{ k.v.apply(cfg); if(this.opts.data) k.v.refresh(this.opts.data(),true) }catch(_){} }
   k.it=it }
  for(const [id,k] of this.rotKids) if(!seen.has(id)){ k.box.remove(); this.rotKids.delete(id) }
  this.rotItems=items;
  if(!this.rotT){ this.rotT=setInterval(()=>{ if(!this.el.isConnected){ clearInterval(this.rotT); this.rotT=0; return } this.rotStep() },200) }
  this.rotStep(true) },
 /** القوائم الصالحة للعرض الآن */
 rotPool(){ const w=this.w, src=this.opts.data?this.opts.data():null; return (this.rotItems||[]).filter(it=>!it.hidden&&!(w.skipEmpty&&!this.opts.editor&&rotEmpty(it.cfg,src))) },
 rotCtl(){ if(this.opts.localCtl) return this.opts.localCtl; const src=this.opts.data?this.opts.data():null; return (src&&src.C&&src.C.rot&&src.C.rot[this.w.id])||{} },
 rotStep(force){ const w=this.w, now=Date.now(), rs=this.rs, ctl=this.rotCtl(), all=this.rotItems||[]; if(!all.length){ this.rotShow(null); return }
  // أوامر مباشرة (التالي/السابق) من لوحة التحكم أو Stream Deck
  if(ctl.seq&&ctl.seq!==rs.seq){ const first=rs.seq===undefined; rs.seq=ctl.seq; if(!first&&now-(ctl.at||0)<15000&&(ctl.cmd==="next"||ctl.cmd==="prev")){ rs.ev=null; return this.rotGo(ctl.cmd==="next"?1:-1) } }
  // تثبيت قائمة
  const pin=ctl.pin&&all.find(x=>x.id===ctl.pin); if(pin){ if(rs.cur!==pin.id) this.rotShow(pin); this.rotIndicator(pin,0,1,true); return }
  // حدث ذكي جارٍ
  if(rs.ev){ if(now<rs.ev.until){ const it=all.find(x=>x.id===rs.ev.item); if(it){ if(rs.cur!==it.id) this.rotShow(it); this.rotIndicator(it,now-rs.ev.at,rs.ev.until-rs.ev.at); return } } rs.ev=null; rs.cool=now+Math.max(0,(+((w.smart||{}).cooldown)||8))*1000; rs.since=now; if(rs.base) { const b=all.find(x=>x.id===rs.base); if(b&&this.rotPool().includes(b)){ this.rotShow(b); return } } }
  const pool=this.rotPool(); if(!pool.length){ this.rotShow(null); return }
  let cur=pool.find(x=>x.id===rs.cur);
  if(!cur){ const prevI=all.findIndex(x=>x.id===rs.cur); cur=prevI>=0?(all.slice(prevI+1).concat(all.slice(0,prevI+1)).find(x=>pool.includes(x))||pool[0]):pool[0]; rs.since=now; this.rotShow(cur); return }
  const dur=Math.max(1,+cur.dur||+w.dur||10)*1000, paused=!!ctl.paused;
  if(paused){ if(!rs.pausedAt) rs.pausedAt=now; this.rotIndicator(cur,rs.pausedAt-rs.since,dur,true); return }
  if(rs.pausedAt){ rs.since+=now-rs.pausedAt; rs.pausedAt=0 }
  const el=now-rs.since; if(el>=dur&&pool.length>1) return this.rotGo(1);
  if(el>=dur) rs.since=now; // قائمة واحدة فقط: تبقى
  this.rotIndicator(cur,el,dur) },
 rotGo(dir){ const all=this.rotItems||[], pool=this.rotPool(); if(!pool.length) return this.rotShow(null); const rs=this.rs; let i=all.findIndex(x=>x.id===rs.cur), n=all.length, nx=null;
  for(let k=1;k<=n;k++){ const c=all[((i+dir*k)%n+n)%n]; if(pool.includes(c)){ nx=c; break } }
  if(!nx) nx=pool[0]; if(nx.id===rs.cur&&pool.length>1) return; const idx=all.indexOf(nx); if(dir>0&&idx<=i) rs.cyc++; rs.since=Date.now(); this.rotShow(nx) },
 /** عرض قائمة بانتقال */
 rotShow(it){ const rs=this.rs, w=this.w; if((it?it.id:null)===rs.cur) return; const prev=rs.cur&&this.rotKids.get(rs.cur), next=it&&this.rotKids.get(it.id);
  rs.cur=it?it.id:null; if(!rs.ev&&it) rs.base=it.id;
  for(const [id,k] of this.rotKids) if(k!==prev&&k!==next){ k.box.getAnimations&&k.box.getAnimations().forEach(a=>a.cancel()); k.box.classList.remove("on","leaving") }
  this.rotFallback(!it);
  if(!next){ if(prev){ prev.box.classList.remove("on") } return }
  clearTimeout(next.box._offT); next.box.classList.remove("leaving"); next.box.classList.add("on"); try{ if(this.opts.data) next.v.refresh(this.opts.data(),true) }catch(_){} // تظهر بأحدث الأرقام
  // إعادة تشغيل حركة الظهور الخاصة بالقائمة (إن وجدت) بدون تصفير بياناتها
  const still=rotReduced()||this.opts.editor&&this.opts.still;
  if(!prev||still){ if(prev) prev.box.classList.remove("on"); return }
  const tr=this.rotTrans(prev.it,it), ex=typeof window!=="undefined"&&!!window.__arshExplore, T=RT_BY_ID[ex&&tr!=="instant"?"crossfade":tr]||RT_BY_ID.smoothFade;
  const tw=it.trDur||w.trDur||900, c={d:Math.max(150,Math.min(4000,+tw/(+w.trSpeed||1))),p:Math.max(.3,Math.min(1.6,+w.trPower||1)),dir:w.trDir==="ltr"?-1:1,lite:!!(ex||w.lowPerf||this.opts.lowPerf)};
  prev.box.getAnimations&&prev.box.getAnimations().forEach(a=>a.cancel()); next.box.getAnimations&&next.box.getAnimations().forEach(a=>a.cancel());
  prev.box.classList.add("on","leaving"); rs.lastTr=T.id;
  try{ T.run(prev.box,next.box,this.rotFxL,c) }catch(_){}
  const p=prev; clearTimeout(p.box._offT); p.box._offT=setTimeout(()=>{ if(this.rs.cur!==p.it.id){ p.box.classList.remove("on","leaving"); p.box.getAnimations&&p.box.getAnimations().forEach(a=>a.cancel()) } },c.d*1.4+60) },
 /** الانتقال بين قائمتين: انتقال القائمة الخاصة ← انتقال المجموعة ← عشوائي بدون تكرار متتالٍ */
 rotTrans(from,to){ const w=this.w; let t=(to&&to.tr)||"";
  if(!t||t==="group") t=w.trMode==="random"?"random":(w.tr||"elegantScale");
  if(t==="random"){ const ids=RT_TRANS.filter(x=>x.id!=="instant"&&x.id!==this.rs.lastTr).map(x=>x.id); t=ids[Math.floor(Math.random()*ids.length)] }
  return RT_BY_ID[t]?t:"elegantScale" },
 rotFallback(on){ const w=this.w; let fb=this.el.querySelector(".rot-fb");
  if(!on||!w.fallback||w.fallback==="transparent"){ if(fb) fb.remove(); return }
  const html=w.fallback==="logo"?`<img src="${esc(w.fbLogo||"/logo-160.png")}" alt="">`:`<b>${esc(w.fbText||"")}</b>`;
  if(!fb){ fb=document.createElement("div"); fb.className="rot-fb"; this.el.insertBefore(fb,this.rotInd) } if(fb.innerHTML!==html) fb.innerHTML=html },
 rotIndicator(it,el,dur,frozen){ const w=this.w, I=this.rotInd; if(!I) return; const k=w.indicator||"none"; if(k==="none"||!it){ if(I.innerHTML) I.innerHTML=""; return }
  const p=Math.max(0,Math.min(1,el/dur)), all=(this.rotItems||[]).filter(x=>!x.hidden), left=Math.max(0,Math.ceil((dur-el)/1000));
  if(k==="bar"){ if(!I.firstChild||!I.querySelector(".ri-bar")) I.innerHTML='<i class="ri-bar"><b></b></i>'; I.querySelector(".ri-bar b").style.transform=`scaleX(${frozen&&!dur?1:p})` }
  else if(k==="ring"){ if(!I.querySelector(".ri-ring")) I.innerHTML='<svg class="ri-ring" viewBox="0 0 36 36"><circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" stroke-opacity=".25" stroke-width="3"/><circle class="rr" cx="18" cy="18" r="15" fill="none" stroke="currentColor" stroke-width="3" pathLength="100" stroke-dasharray="100" transform="rotate(-90 18 18)"/></svg>'; I.querySelector(".rr").style.strokeDashoffset=String(100-p*100) }
  else if(k==="count"){ const t=frozen?"⏸":left+"s"; if(I.textContent!==t) I.innerHTML=`<span class="ri-count">${t}</span>` }
  else if(k==="dots"){ const h=all.map(x=>`<i class="${x.id===it.id?"on":""}"></i>`).join(""); if(I.dataset.h!==h){ I.dataset.h=h; I.innerHTML=`<span class="ri-dots">${h}</span>` } }
  else if(k==="next"){ const i=all.findIndex(x=>x.id===it.id), nx=all[(i+1)%all.length]; const t=nx&&nx.id!==it.id?`التالي: ${rotLabel(nx.cfg)}${frozen?"":" · "+left+"s"}`:""; if(I.textContent!==t) I.innerHTML=t?`<span class="ri-next">${esc(t)}</span>`:"" } },
 /** التبديل الذكي حسب أحداث البث */
 rotEvent(ev){ const w=this.w, sm=w.smart||{}; if(!sm.on||!ev||this.opts.editor&&!this.opts.smartPreview) return; const now=Date.now(), rs=this.rs; if(!rs) return;
  const rules=Array.isArray(sm.rules)?sm.rules:[]; let hit=null;
  for(const r of rules){ if(!r||!r.item||!(this.rotItems||[]).some(x=>x.id===r.item)) continue; let m=false;
   if(r.ev==="bigGift"&&ev.type==="gift") m=(+ev.value||((+ev.diamonds||0)*(+ev.count||1)))>=(+r.min||1000);
   else if(r.ev==="gift"&&ev.type==="gift") m=String(ev.giftId)===String(r.giftId)||(!!r.giftName&&String(ev.gift||"").toLowerCase()===String(r.giftName).toLowerCase());
   else if(r.ev==="follow") m=ev.type==="follow";
   else if(r.ev==="donation") m=ev.type==="donation"&&(+ev.amount||0)>=(+r.min||0);
   else if(r.ev==="likes"&&ev.type==="like"){ const L=rs.lk||(rs.lk=[]); L.push([now,+ev.count||1]); while(L.length&&now-L[0][0]>10000) L.shift(); m=L.reduce((a,x)=>a+x[1],0)>=(+r.min||500) }
   if(m&&(!hit||(+r.prio||0)>(+hit.prio||0))) hit=r }
  if(hit) this.rotInterrupt(hit,now) },
 rotClockLogs(logs){ const sm=(this.w.smart||{}); if(!sm.on) return; const now=Date.now();
  for(const l of logs||[]){ for(const r of sm.rules||[]){ if(r.ev==="subNear"&&l.sa==="near") this.rotInterrupt(r,now); if(r.ev==="goal"&&(l.kind==="goal"||/^تحقيق الهدف/.test(String(l.reason||"")))) this.rotInterrupt(r,now) } } },
 rotGoalCheck(src){ const sm=this.w.smart||{}; if(!sm.on||!src) return; const rs=this.rs; rs.goals=rs.goals||{};
  for(const r of sm.rules||[]){ if(r.ev!=="goal") continue; const it=(this.rotItems||[]).find(x=>x.id===r.item); if(!it) continue; const c=it.cfg; let done=false;
   try{ if(c.type==="goal") done=+c.target>0&&((src.D&&src.D.tot&&src.D.tot.likes)||0)>=+c.target; else if(c.type==="donGoal"){ const DC=src.DC||{}, gl=(DC.goals||[]).find(x=>x.id===c.goalId)||(DC.goals||[])[0]; if(gl){ const g=goalProgress(gl,src.DN||{list:[]},Date.now(),DC.fx); done=g.pct>=100 } } }catch(e){}
   if(done&&!rs.goals[r.id]){ rs.goals[r.id]=1; if(rs.goalsInit) this.rotInterrupt(r,Date.now()) } }
  rs.goalsInit=true },
 rotInterrupt(r,now){ const rs=this.rs; if(!rs) return; if(rs.ev&&(+rs.ev.prio||0)>(+r.prio||0)&&now<rs.ev.until) return; if(!rs.ev&&rs.cool&&now<rs.cool) return;
  const it=(this.rotItems||[]).find(x=>x.id===r.item); if(!it||it.hidden) return; const d=Math.max(2,+r.dur||10)*1000;
  if(rs.ev&&rs.ev.item===it.id){ rs.ev.until=Math.max(rs.ev.until,now+d); return } // نفس الحدث يتكرر: نمدد بدل إعادة الانتقال (لا تبديل مزعج)
  rs.ev={item:it.id,at:now,until:now+d,prio:+r.prio||0}; this.rotShow(it) },
 /** للمعاينة والاختبارات */
 rotState(){ const rs=this.rs||{}; return {cur:rs.cur,ev:rs.ev?rs.ev.item:null,cyc:rs.cyc,lastTr:rs.lastTr} },
});

const ROT_CSS=`
.rotw{overflow:visible}
.rotw .rot-stage{position:absolute;inset:0}
.rotw .rot-item{position:absolute;inset:0;visibility:hidden;pointer-events:none}
.rotw .rot-item.on{visibility:visible}
.rotw .rot-item:not(.on) *{animation-play-state:paused!important}
.rotw .rot-item>.wd{pointer-events:none}
.rotw .rot-fx{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:5}
.rotw .rot-fb{position:absolute;inset:0;display:grid;place-items:center;color:#fff;font:800 calc(var(--rfs,28px))/1.2 "Alexandria","IBM Plex Sans Arabic",sans-serif;text-shadow:0 2px 8px #000}.rotw .rot-fb img{max-width:40%;max-height:70%;object-fit:contain}
.rotw .rot-ind{position:absolute;inset:auto 0 0 0;z-index:6;pointer-events:none;color:var(--ric);opacity:var(--rio)}
.rti-bar .ri-bar{display:block;position:absolute;inset:auto 0 0 0;height:calc(3px*var(--ris));background:color-mix(in srgb,var(--ric) 25%,transparent);border-radius:9px;overflow:hidden}.rti-bar .ri-bar b{position:absolute;inset:0;background:var(--ric);transform-origin:100% 50%;transition:transform .2s linear;box-shadow:0 0 8px var(--ric)}
.rti-ring .rot-ind{inset:6px 6px auto auto;width:calc(22px*var(--ris));height:calc(22px*var(--ris))}.ri-ring{width:100%;height:100%;display:block}.ri-ring .rr{transition:stroke-dashoffset .2s linear}
.rti-count .rot-ind,.rti-next .rot-ind{inset:auto 8px 6px auto;font:700 calc(13px*var(--ris))/1 "Alexandria","IBM Plex Sans Arabic",sans-serif;text-shadow:0 1px 4px #000}
.ri-count,.ri-next{background:rgba(0,0,0,.35);padding:.25em .6em;border-radius:99px;white-space:nowrap}
.rti-dots .rot-ind{display:flex;justify-content:center;bottom:6px}.ri-dots{display:flex;gap:calc(5px*var(--ris))}.ri-dots i{width:calc(7px*var(--ris));height:calc(7px*var(--ris));border-radius:50%;background:currentColor;opacity:.35;transition:opacity .3s,transform .3s}.ri-dots i.on{opacity:1;transform:scale(1.25)}
.rtx{position:absolute;display:block;pointer-events:none;color:#9fd0ff}
.rtx svg{width:100%;height:100%;display:block;overflow:visible}
.rtx-glass{top:-10%;bottom:-10%;left:20%;width:60%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.35),rgba(255,255,255,.08),transparent);backdrop-filter:blur(6px)}
.rtx-gold{top:0;bottom:0;width:16%;background:linear-gradient(90deg,transparent,#f6c94a,#fff1b8,#f6c94a,transparent);box-shadow:0 0 30px #f6c94a;filter:blur(1px)}
.rtx-neon{inset:0;color:#22e1ff;filter:drop-shadow(0 0 6px #22e1ff)}
.rtx-scan{left:0;right:0;height:3px;background:#22e1ff;box-shadow:0 0 14px #22e1ff,0 0 30px #22e1ff88}
.rtx-holo{inset:0;background:repeating-linear-gradient(0deg,rgba(120,240,255,.25) 0 2px,transparent 2px 5px);mix-blend-mode:screen;animation:rtx-fade .8s forwards}@keyframes rtx-fade{to{opacity:0}}
.rtx-facet{inset:0;background:linear-gradient(160deg,rgba(255,255,255,.7),rgba(170,220,255,.2) 50%,transparent)}
.rtx-px{background:#4d8dff}
.rtx-cur{top:0;bottom:0;width:50.5%;background:linear-gradient(90deg,#0a1226,#13234a)}.rtx-cur-a{left:0}.rtx-cur-b{right:0;background:linear-gradient(270deg,#0a1226,#13234a)}
.rtx-ring{left:50%;top:50%;width:60%;aspect-ratio:1;border-radius:50%;border:2px solid rgba(160,210,255,.8);box-shadow:0 0 20px rgba(120,190,255,.6)}
.rtx-spot{top:50%;width:70%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(closest-side,rgba(255,250,230,.4),transparent)}
.rtx-laser{top:-5%;bottom:-5%;width:3px;background:#ff3355;box-shadow:0 0 10px #ff3355,0 0 26px #ff335588}
.rtx-bolt{left:0;right:0;top:35%;height:30%;color:#9fd0ff;filter:drop-shadow(0 0 6px #9fd0ff)}
.rtx-crease{left:0;right:0;top:50%;height:1px;background:rgba(255,255,255,.7)}
.rtx-pt{width:6px;height:6px;border-radius:50%;background:#bfe6ff;box-shadow:0 0 8px #9fd0ff}
.rtx-aur{top:50%;width:55%;height:140%;border-radius:50%;filter:blur(18px);mix-blend-mode:screen}
.rtx-metal{inset:0;background:linear-gradient(115deg,transparent 30%,#f2f5f9 45%,#9aa6b5 50%,#fff 55%,transparent 70%) 200% 0/250% 100% no-repeat;mix-blend-mode:screen}
.rtx-grid{inset:0;background-image:linear-gradient(rgba(77,141,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(77,141,255,.6) 1px,transparent 1px)}
.rtx-hex{left:50%;top:50%;height:80%;aspect-ratio:1;transform:translate(-50%,-50%)}
.rtx-streak{left:0;right:0;top:48%;height:3px;background:linear-gradient(90deg,transparent,#4d8dff,#f6c94a,transparent)}
.rcw{display:grid;place-items:center}.rcw .rc-in{text-align:center;color:var(--rcc);display:flex;flex-direction:column;gap:.2em;padding:.3em .8em}
.rcw .rc-bg{background:rgba(6,10,20,.6);border:1px solid rgba(255,255,255,.12);border-radius:16px;backdrop-filter:blur(6px)}
.rcw .rc-t{font:800 var(--rcfs)/1.25 "Alexandria","IBM Plex Sans Arabic",sans-serif;text-shadow:0 2px 10px rgba(0,0,0,.7)}.rcw .rc-s{font:500 calc(var(--rcfs)*.5)/1.3 "IBM Plex Sans Arabic",sans-serif;opacity:.85;text-shadow:0 1px 6px rgba(0,0,0,.7)}
.rcw .rc-m{position:absolute;inset:0;width:100%;height:100%}
.rcw .rc-empty{opacity:.5;font-size:14px}
`;
