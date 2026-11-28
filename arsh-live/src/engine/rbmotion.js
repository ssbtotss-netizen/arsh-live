// ====== Subathon Animation Engine — B6O6 Fantastic Motion Engine V2 ======
// 50 حركة رئيسية مختلفة فعلياً (لكل تصميم حركة مستقلة) + مكوّنات ثانوية (دخول/خروج/صورة/وقت).
// كل حركة تعمل على عناصر القانون: .rb-row (الصف) · .rb-ic (صورة الهدية) · .rb-what (الاسم) · .rb-val (الوقت) · .rb-ln (الخط السفلي)
// المؤثرات المضافة (جزيئات/حلقات/خطوط SVG) تُنشأ مؤقتاً داخل طبقة .rb-fx وتُحذف بعد انتهائها — بدون خلفيات إجبارية.
// الأداء: Web Animations API (transform/opacity/clip-path/filter) + سقف لعدد عناصر المؤثرات المتزامنة.

export const RBM_CATS={line:"حركات الخطوط السفلية",text:"حركات النصوص",lux:"الحركات الفاخرة",tech:"الحركات التقنية والقيمنق",creative:"الحركات الإبداعية"};
let RBM_LIVE=0, RBM_NOCAP=false; const RBM_MAX=90;
const rbmE=(o,f)=>Object.assign({},o,f);
function rbmA(el,kf,o){ if(!el||!el.animate) return null; try{ return el.animate(kf,rbmE({fill:"backwards"},o)) }catch(e){ return null } }
const rbmQ=(row,s)=>row.querySelector(s);
function rbmLayer(row){ let L=row.querySelector(":scope>.rb-fx"); if(!L){ L=document.createElement("i"); L.className="rb-fx"; row.appendChild(L) } return L }
/** عنصر مؤثر مؤقت (يُحذف تلقائياً) — يُرجع null إذا تجاوزنا السقف أو كان وضع الأداء الخفيف */
function rbmFx(row,c,cls,css,life){ if(c.lite||(!RBM_NOCAP&&RBM_LIVE>=(c.hit?RBM_MAX:RBM_MAX*.55))) return null; /* الدخول له حصة أقل حتى يبقى مجال لمؤثرات وصول الهدايا */ const e=document.createElement("i"); e.className="rbx "+cls; if(css) e.style.cssText=css; rbmLayer(row).appendChild(e); RBM_LIVE++;
 setTimeout(()=>{ e.remove(); RBM_LIVE=Math.max(0,RBM_LIVE-1) },life||c.d*2.2); return e }
function rbmSvg(row,c,cls,inner,vb,css,life){ const e=rbmFx(row,c,cls,css,life); if(!e) return null; e.innerHTML=`<svg viewBox="${vb||"0 0 100 10"}" preserveAspectRatio="none">${inner}</svg>`; return e.firstChild }
const rbmR=(a,b)=>a+Math.random()*(b-a);
/** تقسيم النص لحروف (inline للحفاظ على اتصال الحروف العربية) أو كلمات (inline-block للتحريك) */
function rbmSplit(el,mode){ if(!el) return []; const key=mode==="w"?"w":"c";
 if(el.dataset.sp!==key){ const t=el.dataset.tx!=null?el.dataset.tx:el.textContent; el.dataset.tx=t;
  el.innerHTML=mode==="w"?t.split(/(\s+)/).map(x=>/^\s+$/.test(x)?x:`<span class="rbw-w">${rbmEsc(x)}</span>`).join(""):Array.from(t).map(x=>`<span class="rbw-c">${rbmEsc(x)}</span>`).join(""); el.dataset.sp=key }
 return [...el.querySelectorAll(mode==="w"?".rbw-w":".rbw-c")] }
const rbmEsc=s=>String(s).replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
const RBM_EZ="cubic-bezier(.2,.85,.25,1)", RBM_EO="cubic-bezier(.16,1,.3,1)", RBM_BK="cubic-bezier(.34,1.56,.64,1)";

/** الحركات الخمسون: run(row,c) — c={d:مدة,p:قوة,dir:اتجاه,hit:وصول هدية,lite} */
export const RB_MOTIONS=[
// ---------------- حركات الخطوط السفلية (1–10) ----------------
{id:"lnCenterGrow",n:1,cat:"line",name:"خط ينمو من المنتصف إلى الأطراف",run(r,c){ const l=rbmQ(r,".rb-ln"); rbmA(l,[{transform:"scaleX(0)",transformOrigin:"50% 50%"},{transform:"scaleX(1)",transformOrigin:"50% 50%"}],{duration:c.d,easing:RBM_EO}) }},
{id:"lnTravel",n:2,cat:"line",name:"خط يتحرك من اليمين إلى اليسار",run(r,c){ const l=rbmQ(r,".rb-ln"), b=l&&l.querySelector("b"); rbmA(l,[{opacity:.25},{opacity:1}],{duration:c.d*.6});
 rbmA(b,[{transform:`translateX(${120*c.dir}%)`,opacity:1},{transform:`translateX(${-320*c.dir}%)`,opacity:1}],{duration:c.d*1.4,easing:"cubic-bezier(.45,0,.55,1)",fill:"none"}) }},
{id:"lnDots",n:3,cat:"line",name:"خط يتشكل من نقاط متفرقة",run(r,c){ const l=rbmQ(r,".rb-ln"); rbmA(l,[{opacity:0},{opacity:0,offset:.55},{opacity:1}],{duration:c.d*1.2});
 for(let i=0;i<14;i++){ const x=(i+.5)/14*100, e=rbmFx(r,c,"rbx-dot",`left:${x}%;bottom:calc(var(--lnb,.1em) - .12em)`,c.d*1.4); rbmA(e,[{transform:`translate(${rbmR(-80,80)*c.p}px,${rbmR(-46,-10)*c.p}px) scale(.4)`,opacity:0},{opacity:1,offset:.3},{transform:"none",opacity:1,offset:.75},{opacity:0,transform:"scaleX(2.2)"}],{duration:c.d*1.3,delay:i*18,easing:RBM_EZ}) } }},
{id:"lnOcean",n:4,cat:"line",name:"خط يتحرك كموجة بحرية",run(r,c){ const l=rbmQ(r,".rb-ln"); rbmA(l,[{opacity:0},{opacity:0,offset:.6},{opacity:1}],{duration:c.d*1.5});
 const s=rbmSvg(r,c,"rbx-wave",`<path d="M0 5 Q6.25 ${5-4*c.p} 12.5 5 T25 5 T37.5 5 T50 5 T62.5 5 T75 5 T87.5 5 T100 5 T112.5 5 T125 5 T137.5 5 T150 5 T162.5 5 T175 5 T187.5 5 T200 5" fill="none" stroke="currentColor" stroke-width="1.4" vector-effect="non-scaling-stroke"/>`,"0 0 100 10","",c.d*1.7);
 if(s){ const p=s.firstChild; rbmA(p,[{transform:"translateX(0) scaleY(1)"},{transform:"translateX(-50px) scaleY(.6)",offset:.6},{transform:"translateX(-100px) scaleY(0)"}],{duration:c.d*1.5,easing:"linear"}) } }},
{id:"lnSparks",n:5,cat:"line",name:"خط يتشكل من شرارات ذهبية",run(r,c){ const l=rbmQ(r,".rb-ln"); rbmA(l,[{clipPath:"inset(0 50% 0 50%)"},{clipPath:"inset(0 0 0 0)"}],{duration:c.d,delay:c.d*.25,easing:RBM_EO});
 for(let i=0;i<12;i++){ const side=i%2?1:-1, e=rbmFx(r,c,"rbx-spark",`left:50%;bottom:var(--lnb,.1em)`,c.d*1.6); rbmA(e,[{transform:"translate(0,0) rotate(0)",opacity:1},{transform:`translate(${side*rbmR(40,150)*c.p}px,${-rbmR(6,34)*c.p}px) rotate(${side*rbmR(90,280)}deg)`,opacity:0}],{duration:c.d*rbmR(.8,1.3),delay:i*30,easing:"cubic-bezier(.1,.7,.3,1)"}) } }},
{id:"lnReflect",n:6,cat:"line",name:"خط يمر عليه انعكاس ضوئي",run(r,c){ const l=rbmQ(r,".rb-ln"); rbmA(l,[{filter:"brightness(1)"},{filter:`brightness(${1+1.4*c.p})`,offset:.5},{filter:"brightness(1)"}],{duration:c.d*1.4});
 const g=rbmFx(r,c,"rbx-glare",`bottom:calc(var(--lnb,.1em) - .45em)`,c.d*1.6); rbmA(g,[{left:"105%",opacity:0},{opacity:1,offset:.2},{left:"-25%",opacity:0}],{duration:c.d*1.4,easing:"cubic-bezier(.6,0,.4,1)"}) }},
{id:"lnGeo",n:7,cat:"line",name:"خط يتشكل بطريقة هندسية",run(r,c){ const l=rbmQ(r,".rb-ln"); rbmA(l,[{opacity:0},{opacity:0,offset:.7},{opacity:1}],{duration:c.d*1.4});
 for(let i=0;i<4;i++){ const e=rbmFx(r,c,"rbx-seg",`left:${i*25}%;width:25%;bottom:var(--lnb,.1em)`,c.d*1.5); rbmA(e,[{transform:`rotate(${i%2?90:-90}deg) scaleX(.2)`,opacity:0},{transform:`rotate(${i%2?-12:12}deg) scaleX(1)`,opacity:1,offset:.55},{transform:"none",opacity:1,offset:.85},{opacity:0}],{duration:c.d*1.4,delay:i*90,easing:RBM_BK}) } }},
{id:"lnHeart",n:8,cat:"line",name:"خط ينبض مثل نبض القلب",run(r,c){ const l=rbmQ(r,".rb-ln"); rbmA(l,[{transform:"scaleY(1)"},{transform:`scaleY(${1+2.5*c.p})`,offset:.12},{transform:"scaleY(.6)",offset:.22},{transform:`scaleY(${1+1.6*c.p})`,offset:.32},{transform:"scaleY(1)",offset:.45},{transform:"scaleY(1)"}],{duration:c.d*1.3});
 const s=rbmSvg(r,c,"rbx-ecg",`<path d="M0 5 H38 L42 1 L46 9 L50 0 L54 10 L58 5 H100" fill="none" stroke="currentColor" stroke-width="1.6" vector-effect="non-scaling-stroke" pathLength="100" stroke-dasharray="100" />`,"0 0 100 10","",c.d*1.5);
 if(s) rbmA(s.firstChild,[{strokeDashoffset:100},{strokeDashoffset:0,offset:.6},{strokeDashoffset:-100}],{duration:c.d*1.4,easing:"linear"}) }},
{id:"lnMagnet",n:9,cat:"line",name:"خط يتكون من أجزاء مغناطيسية",run(r,c){ const l=rbmQ(r,".rb-ln"); rbmA(l,[{opacity:0},{opacity:0,offset:.8},{opacity:1}],{duration:c.d*1.3});
 for(let i=0;i<6;i++){ const e=rbmFx(r,c,"rbx-mag",`left:${i*16.66+.6}%;width:15.4%;bottom:var(--lnb,.1em)`,c.d*1.4); const dx=(i-2.5)*rbmR(30,60)*c.p;
  rbmA(e,[{transform:`translate(${dx}px,${rbmR(-22,22)}px) rotate(${rbmR(-40,40)}deg)`,opacity:.3},{transform:`translate(${-dx*.08}px,0)`,opacity:1,offset:.62},{transform:"none",opacity:1,offset:.8},{opacity:0}],{duration:c.d*1.3,easing:"cubic-bezier(.7,0,.2,1.4)"}) } }},
{id:"lnDraw",n:10,cat:"line",name:"خط يرسم نفسه تدريجياً",run(r,c){ const l=rbmQ(r,".rb-ln"); rbmA(l,[{opacity:0},{opacity:0,offset:.9},{opacity:1}],{duration:c.d*1.5});
 const s=rbmSvg(r,c,"rbx-pen",`<path d="M${c.dir>0?100:0} 6 C70 3 60 8 50 5 S20 3 ${c.dir>0?0:100} 6" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" vector-effect="non-scaling-stroke" pathLength="100" stroke-dasharray="100"/>`,"0 0 100 10","",c.d*1.6);
 if(s) rbmA(s.firstChild,[{strokeDashoffset:100},{strokeDashoffset:0}],{duration:c.d*1.4,easing:"cubic-bezier(.65,0,.35,1)"});
 const nib=rbmFx(r,c,"rbx-nib",`bottom:calc(var(--lnb,.1em) - .18em)`,c.d*1.6); rbmA(nib,[{left:c.dir>0?"100%":"0%",opacity:1},{left:c.dir>0?"0%":"100%",opacity:1,offset:.95},{opacity:0}],{duration:c.d*1.4,easing:"cubic-bezier(.65,0,.35,1)"}) }},
// ---------------- حركات النصوص (11–20) ----------------
{id:"txLetters",n:11,cat:"text",name:"ظهور الحروف بالتتابع",run(r,c){ const L=rbmSplit(rbmQ(r,".rb-what"),"c"), st=Math.min(45,c.d*.9/Math.max(1,L.length));
 L.forEach((x,i)=>rbmA(x,[{opacity:0,color:"var(--acc,#9fd0ff)"},{opacity:1,color:"var(--acc,#9fd0ff)",offset:.5},{opacity:1}],{duration:c.d*.7,delay:i*st,easing:"ease-out"})) }},
{id:"txMask",n:12,cat:"text",name:"ظهور النص من خلف قناع شفاف",run(r,c){ const w=rbmQ(r,".rb-what"); const from=c.dir>0?"inset(0 0 0 100%)":"inset(0 100% 0 0)";
 rbmA(w,[{clipPath:from,transform:"translateY(35%)"},{clipPath:"inset(0 0 0 0)",transform:"none"}],{duration:c.d,easing:RBM_EO});
 const e=rbmFx(r,c,"rbx-maskedge","",c.d*1.2); rbmA(e,[{right:c.dir>0?"0%":"auto",left:c.dir>0?"auto":"0%",transform:"scaleY(0)"},{transform:"scaleY(1)",offset:.3},{transform:"scaleY(0)",opacity:0}],{duration:c.d}) }},
{id:"txGather",n:13,cat:"text",name:"تجميع الحروف المتفرقة",run(r,c){ const W=rbmSplit(rbmQ(r,".rb-what"),"w");
 W.forEach((x,i)=>rbmA(x,[{transform:`translate(${rbmR(-90,90)*c.p}px,${rbmR(-50,50)*c.p}px) rotate(${rbmR(-60,60)}deg) scale(${rbmR(.3,1.6)})`,opacity:0},{transform:"none",opacity:1}],{duration:c.d*1.1,delay:i*60,easing:RBM_BK})) }},
{id:"txCineGlare",n:14,cat:"text",name:"انعكاس ضوئي سينمائي على النص",run(r,c){ const w=rbmQ(r,".rb-what"); w.classList.add("rbx-glaretext");
 const a=rbmA(w,[{backgroundPosition:"160% 0"},{backgroundPosition:"-60% 0"}],{duration:c.d*1.6,easing:"cubic-bezier(.5,0,.3,1)",fill:"none"}); setTimeout(()=>w.classList.remove("rbx-glaretext"),c.d*1.65);
 rbmA(w,[{letterSpacing:".18em",opacity:0},{letterSpacing:"0em",opacity:1}],{duration:c.d*.8,easing:RBM_EO}) }},
{id:"txBlur",n:15,cat:"text",name:"تحول النص من ضبابي إلى واضح",run(r,c){ const w=rbmQ(r,".rb-what"), v=rbmQ(r,".rb-val"); rbmA(w,[{filter:`blur(${10*c.p}px)`,opacity:0,transform:"scale(1.08)"},{filter:"blur(0)",opacity:1,transform:"none"}],{duration:c.d*1.1,easing:"ease-out"});
 rbmA(v,[{filter:`blur(${6*c.p}px)`,opacity:0},{filter:"blur(0)",opacity:1}],{duration:c.d*1.1,delay:c.d*.25}) }},
{id:"txTyping",n:16,cat:"text",name:"حركة كتابة رقمية",run(r,c){ const L=rbmSplit(rbmQ(r,".rb-what"),"c"), st=Math.min(55,c.d*1.1/Math.max(1,L.length));
 L.forEach((x,i)=>rbmA(x,[{visibility:"hidden"},{visibility:"visible"}],{duration:1,delay:i*st}));
 const k=rbmFx(r,c,"rbx-caret","",L.length*st+500); rbmA(k,[{opacity:1},{opacity:0},{opacity:1}],{duration:400,iterations:Math.ceil((L.length*st+400)/400),easing:"steps(1)"}) }},
{id:"tx3D",n:17,cat:"text",name:"دوران ثلاثي الأبعاد للنص",run(r,c){ const w=rbmQ(r,".rb-what"), v=rbmQ(r,".rb-val");
 rbmA(w,[{transform:`perspective(500px) rotateY(${95*c.dir}deg)`,opacity:0},{transform:"perspective(500px) rotateY(0)",opacity:1}],{duration:c.d,easing:RBM_EO});
 rbmA(v,[{transform:"perspective(400px) rotateX(-100deg)",opacity:0},{transform:"perspective(400px) rotateX(0)",opacity:1}],{duration:c.d,delay:c.d*.3,easing:RBM_BK}) }},
{id:"txRefract",n:18,cat:"text",name:"ظهور النص بتأثير الانكسار الزجاجي",run(r,c){ const w=rbmQ(r,".rb-what");
 rbmA(w,[{textShadow:`${-8*c.p}px 0 rgba(0,229,255,.8),${8*c.p}px 0 rgba(255,60,180,.8)`,transform:"skewX(-14deg)",opacity:0},{textShadow:"0 0 0 rgba(0,229,255,0),0 0 0 rgba(255,60,180,0)",transform:"none",opacity:1}],{duration:c.d,easing:RBM_EZ});
 const e=rbmFx(r,c,"rbx-shard","",c.d*1.2); rbmA(e,[{clipPath:"polygon(0 0,40% 0,20% 100%,0 100%)",opacity:.8},{clipPath:"polygon(60% 0,100% 0,100% 100%,80% 100%)",opacity:0}],{duration:c.d}) }},
{id:"txOpposite",n:19,cat:"text",name:"انزلاق النص والوقت من اتجاهين متعاكسين",run(r,c){ const w=rbmQ(r,".rb-what"), v=rbmQ(r,".rb-val");
 rbmA(w,[{transform:`translateX(${70*c.dir}%)`,opacity:0},{transform:"none",opacity:1}],{duration:c.d,easing:RBM_EO});
 rbmA(v,[{transform:`translateX(${-160*c.dir}%)`,opacity:0},{transform:"none",opacity:1}],{duration:c.d,easing:RBM_EO}) }},
{id:"txInk",n:20,cat:"text",name:"ظهور النص بتأثير الحبر المنتشر",run(r,c){ const w=rbmQ(r,".rb-what"); rbmA(w,[{filter:"blur(3px) contrast(3)",opacity:0},{filter:"blur(1px) contrast(1.6)",opacity:.8,offset:.5},{filter:"none",opacity:1}],{duration:c.d*1.2});
 const e=rbmFx(r,c,"rbx-ink","",c.d*1.4); rbmA(e,[{clipPath:"circle(0% at 70% 55%)",opacity:.9},{clipPath:"circle(85% at 70% 55%)",opacity:.0}],{duration:c.d*1.3,easing:"cubic-bezier(.3,.1,.3,1)"}) }},
// ---------------- الحركات الفاخرة (21–30) ----------------
{id:"lxDiamond",n:21,cat:"lux",name:"جزيئات ألماسية تتجمع حول القانون",run(r,c){ rbmA(r,[{opacity:.2},{opacity:1}],{duration:c.d*.7,delay:c.d*.4});
 for(let i=0;i<12;i++){ const a=i/12*Math.PI*2, e=rbmFx(r,c,"rbx-dia",`left:${50+Math.cos(a)*46}%;top:${50+Math.sin(a)*40}%`,c.d*1.6); rbmA(e,[{transform:`translate(${Math.cos(a)*120*c.p}px,${Math.sin(a)*70*c.p}px) rotate(45deg) scale(.2)`,opacity:0},{transform:"rotate(45deg) scale(1)",opacity:1,offset:.6},{transform:"rotate(45deg) scale(0)",opacity:0}],{duration:c.d*1.4,delay:i*25,easing:RBM_EZ}) } }},
{id:"lxGoldDust",n:22,cat:"lux",name:"غبار ذهبي يتشكل تدريجياً",run(r,c){ const w=rbmQ(r,".rb-what"); rbmA(w,[{opacity:0,color:"#f6c94a"},{opacity:0,offset:.35},{opacity:1,color:"#ffe9a8",offset:.75},{opacity:1}],{duration:c.d*1.4});
 for(let i=0;i<26;i++){ const e=rbmFx(r,c,"rbx-dust",`left:${rbmR(15,85)}%;top:${rbmR(25,75)}%`,c.d*1.8); rbmA(e,[{transform:`translate(${rbmR(-30,30)}px,${rbmR(30,70)*c.p}px)`,opacity:0},{opacity:1,offset:.4},{transform:"translate(0,0)",opacity:.9,offset:.7},{transform:"translate(0,-6px)",opacity:0}],{duration:c.d*rbmR(1.2,1.7),delay:rbmR(0,c.d*.4),easing:"ease-out"}) } }},
{id:"lxCrystal",n:23,cat:"lux",name:"انعكاسات كريستالية",run(r,c){ ["polygon(0 0,30% 0,10% 100%,0 100%)","polygon(35% 0,55% 0,40% 100%,25% 100%)","polygon(62% 0,100% 0,100% 100%,48% 100%)"].forEach((p,i)=>{
  const e=rbmFx(r,c,"rbx-facet",`clip-path:${p}`,c.d*1.6); rbmA(e,[{opacity:0},{opacity:.85*c.p,offset:.35},{opacity:0}],{duration:c.d*.8,delay:i*c.d*.22,easing:"ease-in-out"}) });
 rbmA(r,[{filter:"saturate(.4) brightness(1.4)"},{filter:"none"}],{duration:c.d*1.2}) }},
{id:"lxRings",n:24,cat:"lux",name:"حلقات ضوئية تتمدد حول الهدية",run(r,c){ const ic=rbmQ(r,".rb-ic"); if(!ic) return; const b=ic.getBoundingClientRect(), R=r.getBoundingClientRect(), x=(b.left+b.width/2-R.left)/Math.max(1,R.width)*100;
 for(let i=0;i<3;i++){ const e=rbmFx(r,c,"rbx-ring",`left:${x}%;top:50%`,c.d*1.8); rbmA(e,[{transform:"translate(-50%,-50%) scale(.3)",opacity:.95},{transform:`translate(-50%,-50%) scale(${2.4*c.p+.6})`,opacity:0}],{duration:c.d*1.3,delay:i*c.d*.22,easing:"cubic-bezier(.1,.6,.3,1)"}) }
 rbmA(ic,[{transform:"scale(.5)"},{transform:"scale(1.12)",offset:.5},{transform:"none"}],{duration:c.d*.8,easing:RBM_BK}) }},
{id:"lxSilk",n:25,cat:"lux",name:"تأثير حرير متحرك",run(r,c){ const e=rbmFx(r,c,"rbx-silk","",c.d*2); rbmA(e,[{transform:"translateX(60%) skewY(6deg)",opacity:0},{transform:"translateX(0) skewY(-4deg)",opacity:.7,offset:.45},{transform:"translateX(-60%) skewY(3deg)",opacity:0}],{duration:c.d*1.8,easing:"ease-in-out"});
 rbmA(r,[{transform:"translateY(8%)",opacity:0},{transform:"translateY(-2%)",opacity:1,offset:.5},{transform:"translateY(1%)",offset:.75},{transform:"none"}],{duration:c.d*1.4,easing:"ease-out"}) }},
{id:"lxGlassRipple",n:26,cat:"lux",name:"تموجات زجاجية",run(r,c){ for(let i=0;i<3;i++){ const e=rbmFx(r,c,"rbx-ripple","",c.d*1.8); rbmA(e,[{transform:"translate(-50%,-50%) scale(.05,.12)",opacity:.8},{transform:`translate(-50%,-50%) scale(${1.1*c.p},${.9*c.p})`,opacity:0}],{duration:c.d*1.4,delay:i*c.d*.18,easing:"ease-out"}) }
 rbmA(r,[{backdropFilter:"blur(0px)"},{backdropFilter:"blur(6px)",offset:.4},{backdropFilter:"blur(0px)"}],{duration:c.d*1.4}) }},
{id:"lxPlatinum",n:27,cat:"lux",name:"انعكاس معدني بلاتيني",run(r,c){ const e=rbmFx(r,c,"rbx-metal","",c.d*1.6); rbmA(e,[{backgroundPosition:"200% 0",opacity:0},{opacity:.9*c.p,offset:.2},{backgroundPosition:"-100% 0",opacity:0}],{duration:c.d*1.5,easing:"cubic-bezier(.7,0,.3,1)"});
 rbmA(r,[{transform:"scaleX(.94)",filter:"grayscale(1) brightness(1.5)"},{transform:"none",filter:"none"}],{duration:c.d,easing:RBM_EO}) }},
{id:"lxOrnament",n:28,cat:"lux",name:"زخارف هندسية تتشكل بالتتابع",run(r,c){ const P=["M0 40 V0 H40","M60 0 H100 V40","M100 60 V100 H60","M40 100 H0 V60"];
 P.forEach((d,i)=>{ const s=rbmSvg(r,c,"rbx-orn",`<path d="${d}" fill="none" stroke="currentColor" stroke-width="2" vector-effect="non-scaling-stroke" pathLength="100" stroke-dasharray="100"/><rect x="${i%3?94:2}" y="${i<2?2:94}" width="4" height="4" transform="rotate(45 ${i%3?96:4} ${i<2?4:96})" fill="currentColor"/>`,"0 0 100 100","",c.d*2.2);
  if(s) rbmA(s.firstChild,[{strokeDashoffset:100},{strokeDashoffset:0,offset:.6},{strokeDashoffset:0,opacity:1,offset:.8},{opacity:0}],{duration:c.d*1.8,delay:i*c.d*.18}) }) }},
{id:"lxEclipse",n:29,cat:"lux",name:"تأثير الكسوف الضوئي",run(r,c){ const ic=rbmQ(r,".rb-ic"); const g=rbmFx(r,c,"rbx-corona","",c.d*1.9), m=rbmFx(r,c,"rbx-moon","",c.d*1.9);
 rbmA(g,[{transform:"translate(-50%,-50%) scale(.6)",opacity:0},{transform:"translate(-50%,-50%) scale(1.25)",opacity:1,offset:.55},{opacity:0,transform:"translate(-50%,-50%) scale(1.6)"}],{duration:c.d*1.7});
 rbmA(m,[{transform:"translate(40%,-50%)",opacity:1},{transform:"translate(-50%,-50%)",opacity:1,offset:.5},{transform:"translate(-140%,-50%)",opacity:0}],{duration:c.d*1.7,easing:"ease-in-out"});
 rbmA(ic,[{filter:"brightness(.2)"},{filter:"brightness(.2)",offset:.45},{filter:"brightness(1.5) drop-shadow(0 0 8px #ffd77a)",offset:.7},{filter:"none"}],{duration:c.d*1.7}) }},
{id:"lxHalo",n:30,cat:"lux",name:"هالة ضوئية سينمائية",run(r,c){ const h=rbmFx(r,c,"rbx-halo","",c.d*2), f=rbmFx(r,c,"rbx-flare","",c.d*2);
 rbmA(h,[{transform:"translate(-50%,-50%) scale(.2)",opacity:0},{transform:"translate(-50%,-50%) scale(1)",opacity:.8*c.p,offset:.4},{transform:"translate(-50%,-50%) scale(1.3)",opacity:0}],{duration:c.d*1.8,easing:"ease-out"});
 rbmA(f,[{transform:"translate(-50%,-50%) scaleX(0)",opacity:0},{transform:"translate(-50%,-50%) scaleX(1)",opacity:1,offset:.3},{transform:"translate(-50%,-50%) scaleX(1.6)",opacity:0}],{duration:c.d*1.3}) }},
// ---------------- الحركات التقنية والقيمنق (31–40) ----------------
{id:"tcLaser",n:31,cat:"tech",name:"مسح ليزري",run(r,c){ const L=rbmFx(r,c,"rbx-laser","",c.d*1.5); const a=c.dir>0?["105%","-5%"]:["-5%","105%"];
 rbmA(L,[{left:a[0]},{left:a[1]}],{duration:c.d*1.1,easing:"cubic-bezier(.5,0,.5,1)"});
 rbmA(r,[{clipPath:c.dir>0?"inset(0 0 0 100%)":"inset(0 100% 0 0)"},{clipPath:"inset(0 0 0 0)"}],{duration:c.d*1.1,easing:"cubic-bezier(.5,0,.5,1)"}) }},
{id:"tcHolo",n:32,cat:"tech",name:"تأثير هولوغرام",run(r,c){ const e=rbmFx(r,c,"rbx-scan","",c.d*1.8); rbmA(e,[{backgroundPosition:"0 0",opacity:.9},{backgroundPosition:"0 40px",opacity:0}],{duration:c.d*1.6,easing:"linear"});
 rbmA(r,[{opacity:0,transform:"skewX(8deg) translateX(3%)",filter:"hue-rotate(40deg) brightness(1.6)"},{opacity:.6,offset:.15},{opacity:.2,offset:.25},{opacity:.85,transform:"skewX(-2deg)",offset:.45},{opacity:.5,offset:.55},{opacity:1,transform:"none",filter:"none"}],{duration:c.d*1.3}) }},
{id:"tcPixels",n:33,cat:"tech",name:"تشكل وحدات البكسل",run(r,c){ const cols=12, rows=3; for(let y=0;y<rows;y++) for(let x=0;x<cols;x++){ const e=rbmFx(r,c,"rbx-px",`left:${x/cols*100}%;top:${y/rows*100}%;width:${100/cols+.3}%;height:${100/rows+.5}%`,c.d*1.8); rbmA(e,[{opacity:1},{opacity:1,offset:.1},{opacity:0}],{duration:c.d*.5,delay:rbmR(0,c.d*.9),easing:"steps(2)"}) }
 rbmA(r,[{filter:"blur(4px) contrast(2)"},{filter:"none"}],{duration:c.d*1.2,easing:"steps(6)"}) }},
{id:"tcCircuit",n:34,cat:"tech",name:"دوائر إلكترونية متحركة",run(r,c){ const s=rbmSvg(r,c,"rbx-circ",`<path d="M2 50 H20 V20 H45 V50 H60 V80 H85 V50 H98" fill="none" stroke="currentColor" stroke-width="1.5" vector-effect="non-scaling-stroke" pathLength="100" stroke-dasharray="14 86"/><circle cx="20" cy="20" r="2.5" fill="currentColor"/><circle cx="60" cy="80" r="2.5" fill="currentColor"/><circle cx="85" cy="50" r="2.5" fill="currentColor"/>`,"0 0 100 100","",c.d*2);
 if(s){ rbmA(s.firstChild,[{strokeDashoffset:100},{strokeDashoffset:-100}],{duration:c.d*1.8,easing:"linear"}); [...s.querySelectorAll("circle")].forEach((k,i)=>rbmA(k,[{opacity:0},{opacity:1,offset:.3+i*.2},{opacity:.2}],{duration:c.d*1.8})) }
 rbmA(rbmQ(r,".rb-val"),[{opacity:0},{opacity:0,offset:.55},{opacity:1}],{duration:c.d*1.4}) }},
{id:"tcMagnetic",n:35,cat:"tech",name:"تأثير مغناطيسي",run(r,c){ const ic=rbmQ(r,".rb-ic"), v=rbmQ(r,".rb-val");
 rbmA(ic,[{transform:`translateX(${180*c.dir}%)`},{transform:`translateX(${-14*c.dir}%)`,offset:.7},{transform:"none"}],{duration:c.d,easing:"cubic-bezier(.7,0,.3,1)"});
 rbmA(v,[{transform:`translateX(${-260*c.dir}%)`},{transform:`translateX(${18*c.dir}%)`,offset:.7},{transform:"none"}],{duration:c.d,easing:"cubic-bezier(.7,0,.3,1)"});
 for(let i=0;i<3;i++){ const s=rbmSvg(r,c,"rbx-field",`<path d="M5 50 Q50 ${10+i*12} 95 50" fill="none" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke" stroke-dasharray="3 4"/>`,"0 0 100 100","",c.d*1.3); if(s) rbmA(s,[{opacity:0},{opacity:.7,offset:.6},{opacity:0}],{duration:c.d*1.2,delay:i*60}) } }},
{id:"tcElectric",n:36,cat:"tech",name:"موجات كهربائية",run(r,c){ const s=rbmSvg(r,c,"rbx-bolt",`<polyline fill="none" stroke="currentColor" stroke-width="1.6" vector-effect="non-scaling-stroke" points="0,5 100,5"/>`,"0 0 100 10","",c.d*1.6); if(!s) return; const pl=s.firstChild;
 const fr=()=>{ let p="0,5"; for(let x=6;x<=100;x+=6) p+=` ${x},${5+rbmR(-4,4)*c.p}`; return p }; const t0=performance.now();
 const step=()=>{ if(!pl.isConnected) return; pl.setAttribute("points",fr()); if(performance.now()-t0<c.d*1.2) setTimeout(step,55) }; step();
 rbmA(s,[{opacity:1,filter:"drop-shadow(0 0 4px currentColor)"},{opacity:1,offset:.75},{opacity:0}],{duration:c.d*1.4}) }},
{id:"tcGrid3D",n:37,cat:"tech",name:"شبكة رقمية ثلاثية الأبعاد",run(r,c){ const e=rbmFx(r,c,"rbx-grid","",c.d*2); rbmA(e,[{transform:"perspective(300px) rotateX(85deg) translateY(30%)",opacity:0,backgroundPosition:"0 0"},{transform:"perspective(300px) rotateX(62deg) translateY(10%)",opacity:.8,offset:.4},{transform:"perspective(300px) rotateX(62deg) translateY(10%)",opacity:0,backgroundPosition:"0 60px"}],{duration:c.d*1.8});
 rbmA(r,[{transform:"perspective(600px) translateZ(-60px)",opacity:0},{transform:"none",opacity:1}],{duration:c.d,delay:c.d*.2,easing:RBM_EO}) }},
{id:"tcGlitch",n:38,cat:"tech",name:"مؤثر تشويش رقمي خفيف",run(r,c){ const k=8*c.p;
 rbmA(r,[{clipPath:"inset(0 0 60% 0)",transform:`translateX(${k}px)`},{clipPath:"inset(40% 0 20% 0)",transform:`translateX(${-k}px)`,offset:.15},{clipPath:"inset(70% 0 0 0)",transform:`translateX(${k*.6}px)`,offset:.3},{clipPath:"inset(10% 0 50% 0)",transform:"translateX(0)",offset:.45},{clipPath:"inset(0 0 0 0)",transform:`translateX(${-k*.4}px)`,offset:.6},{clipPath:"inset(0 0 0 0)",transform:"none"}],{duration:c.d*.9,easing:"steps(1)"});
 rbmA(rbmQ(r,".rb-what"),[{textShadow:`${-3*c.p}px 0 #ff2a6d,${3*c.p}px 0 #05d9e8`},{textShadow:"0 0 transparent,0 0 transparent"}],{duration:c.d*.9,easing:"steps(4)"}) }},
{id:"tcRadar",n:39,cat:"tech",name:"حركة رادار",run(r,c){ const ic=rbmQ(r,".rb-ic"); if(!ic) return; const b=ic.getBoundingClientRect(), R=r.getBoundingClientRect(), x=(b.left+b.width/2-R.left)/Math.max(1,R.width)*100;
 const e=rbmFx(r,c,"rbx-radar",`left:${x}%`,c.d*2); rbmA(e,[{transform:"translate(-50%,-50%) rotate(0)",opacity:.9},{transform:"translate(-50%,-50%) rotate(720deg)",opacity:0}],{duration:c.d*1.8,easing:"linear"});
 const p=rbmFx(r,c,"rbx-blip","",c.d*2); rbmA(p,[{transform:"scale(0)",opacity:0},{transform:"scale(0)",opacity:0,offset:.5},{transform:"scale(1.6)",opacity:1,offset:.65},{transform:"scale(3)",opacity:0}],{duration:c.d*1.8}) }},
{id:"tcGameUI",n:40,cat:"tech",name:"انتقال بأسلوب واجهات الألعاب المستقبلية",run(r,c){ rbmA(r,[{clipPath:"polygon(0 0,0 0,0 100%,0 100%)"},{clipPath:"polygon(0 0,70% 0,55% 100%,0 100%)",offset:.5},{clipPath:"polygon(0 0,100% 0,100% 100%,0 100%)"}],{duration:c.d,easing:"cubic-bezier(.8,0,.2,1)"});
 ["rbx-br-a","rbx-br-b"].forEach((k,i)=>{ const e=rbmFx(r,c,"rbx-br "+k,"",c.d*1.8); rbmA(e,[{transform:`translateX(${(i?-1:1)*60}px)`,opacity:0},{transform:"none",opacity:1,offset:.5},{opacity:1,offset:.8},{opacity:0}],{duration:c.d*1.6,easing:RBM_EO}) }) }},
// ---------------- الحركات الإبداعية (41–50) ----------------
{id:"crDrop",n:41,cat:"creative",name:"حركة قطرات الماء",run(r,c){ const x=rbmR(30,70), d=rbmFx(r,c,"rbx-drop",`left:${x}%`,c.d*2.2); rbmA(d,[{transform:"translateY(-160%) scaleY(1.4)",opacity:0},{opacity:1,offset:.1},{transform:"translateY(var(--dropY,120%)) scaleY(1)",opacity:1,offset:.5},{transform:"translateY(var(--dropY,120%)) scale(1.6,.2)",opacity:0,offset:.6},{opacity:0}],{duration:c.d*1.8,easing:"cubic-bezier(.5,0,1,.6)"});
 const s=rbmFx(r,c,"rbx-splash",`left:${x}%`,c.d*2.2); rbmA(s,[{transform:"translate(-50%,50%) scale(0)",opacity:0},{transform:"translate(-50%,50%) scale(0)",opacity:0,offset:.5},{transform:"translate(-50%,50%) scale(1)",opacity:.9,offset:.6},{transform:"translate(-50%,50%) scale(2.6)",opacity:0}],{duration:c.d*1.8}) }},
{id:"crGravity",n:42,cat:"creative",name:"تأثير الجاذبية",run(r,c){ rbmA(r,[{transform:"translateY(-140%)",opacity:0},{transform:"translateY(0)",opacity:1,offset:.45},{transform:`translateY(${-18*c.p}%)`,offset:.62},{transform:"translateY(0)",offset:.76},{transform:`translateY(${-6*c.p}%)`,offset:.86},{transform:"none"}],{duration:c.d*1.4,easing:"cubic-bezier(.45,0,.55,1)"});
 rbmA(rbmQ(r,".rb-ic"),[{transform:"translateY(-260%) rotate(-40deg)"},{transform:"translateY(-260%) rotate(-40deg)",offset:.3},{transform:"rotate(8deg)",offset:.7},{transform:"none"}],{duration:c.d*1.4,easing:"cubic-bezier(.5,0,.75,0)"}) }},
{id:"crSoundWave",n:43,cat:"creative",name:"موجات صوتية متحركة",run(r,c){ const v=rbmQ(r,".rb-val"); if(!v) return; const b=v.getBoundingClientRect(), R=r.getBoundingClientRect(), x=(b.left-R.left)/Math.max(1,R.width)*100;
 for(let i=0;i<7;i++){ const e=rbmFx(r,c,"rbx-eq",`left:calc(${x}% - ${(i+1)*.42}em)`,c.d*2); rbmA(e,[{transform:"scaleY(.15)"},{transform:`scaleY(${rbmR(.6,1)*c.p})`},{transform:"scaleY(.3)"},{transform:`scaleY(${rbmR(.5,1)*c.p})`},{transform:"scaleY(.1)",opacity:0}],{duration:c.d*1.8,delay:i*40,easing:"ease-in-out"}) }
 rbmA(v,[{transform:"scale(.6)"},{transform:"scale(1.15)",offset:.3},{transform:"scale(.95)",offset:.5},{transform:"scale(1.08)",offset:.7},{transform:"none"}],{duration:c.d*1.4}) }},
{id:"crAurora",n:44,cat:"creative",name:"تأثير الشفق القطبي",run(r,c){ ["#22e1ff","#7c3aed","#22c55e"].forEach((col,i)=>{ const e=rbmFx(r,c,"rbx-aur",`background:radial-gradient(closest-side,${col},transparent);left:${15+i*28}%`,c.d*2.4);
  rbmA(e,[{transform:"translate(-50%,-50%) scale(.4,.6) translateX(0)",opacity:0,filter:"hue-rotate(0deg)"},{transform:`translate(-50%,-50%) scale(1.2,.9) translateX(${(i-1)*30}px)`,opacity:.55*c.p,offset:.45},{transform:`translate(-50%,-50%) scale(1.5,1) translateX(${(1-i)*30}px)`,opacity:0,filter:"hue-rotate(90deg)"}],{duration:c.d*2.2,delay:i*120,easing:"ease-in-out"}) }) }},
{id:"crFold",n:45,cat:"creative",name:"طي وفتح العناصر بطريقة هندسية",run(r,c){ rbmA(r,[{transform:"perspective(700px) rotateX(-90deg)",transformOrigin:"50% 0"},{transform:"perspective(700px) rotateX(25deg)",transformOrigin:"50% 0",offset:.45},{transform:"perspective(700px) rotateX(-10deg)",transformOrigin:"50% 0",offset:.7},{transform:"perspective(700px) rotateX(0)",transformOrigin:"50% 0"}],{duration:c.d*1.3,easing:"ease-out"});
 const e=rbmFx(r,c,"rbx-crease","",c.d*1.4); rbmA(e,[{opacity:.7},{opacity:0}],{duration:c.d*1.3}) }},
{id:"crOrbit",n:46,cat:"creative",name:"تأثير المدارات الدائرية",run(r,c){ const ic=rbmQ(r,".rb-ic"); if(!ic) return; const b=ic.getBoundingClientRect(), R=r.getBoundingClientRect(), x=(b.left+b.width/2-R.left)/Math.max(1,R.width)*100;
 for(let i=0;i<3;i++){ const o=rbmFx(r,c,"rbx-orbit",`left:${x}%;--rx:${1.1+i*.35}em;--ry:${.45+i*.18}em`,c.d*2.2); rbmA(o,[{transform:`translate(-50%,-50%) rotate(${i*120}deg)`,opacity:0},{opacity:1,offset:.2},{transform:`translate(-50%,-50%) rotate(${i*120+(c.dir>0?540:-540)}deg)`,opacity:0}],{duration:c.d*2,easing:"cubic-bezier(.3,.1,.3,1)"}) } }},
{id:"crPrism",n:47,cat:"creative",name:"حركة المنشور الضوئي",run(r,c){ const b=rbmFx(r,c,"rbx-beam","",c.d*2), s=rbmFx(r,c,"rbx-spectrum","",c.d*2);
 rbmA(b,[{transform:"scaleX(0)",opacity:1},{transform:"scaleX(1)",opacity:1,offset:.35},{opacity:0}],{duration:c.d*1.2,easing:"ease-in"});
 rbmA(s,[{transform:"scaleY(.02) scaleX(0)",opacity:0},{transform:"scaleY(.02) scaleX(0)",opacity:0,offset:.3},{transform:`scaleY(${.9*c.p}) scaleX(1)`,opacity:.75,offset:.6},{transform:"scaleY(1) scaleX(1.1)",opacity:0}],{duration:c.d*1.8,easing:"cubic-bezier(.2,.7,.3,1)"}) }},
{id:"crJelly",n:48,cat:"creative",name:"تأثير التمدد والانكماش الانسيابي",run(r,c){ const k=.25*c.p;
 rbmA(r,[{transform:"scale(0.4,0.4)",opacity:0},{transform:`scale(${1+k},${1-k})`,opacity:1,offset:.35},{transform:`scale(${1-k*.6},${1+k*.6})`,offset:.55},{transform:`scale(${1+k*.25},${1-k*.25})`,offset:.75},{transform:"scale(1,1)"}],{duration:c.d*1.3,easing:"ease-out"}) }},
{id:"crSpotlight",n:49,cat:"creative",name:"حركة إضاءة مسرحية تتنقل بين القوانين",run(r,c){ const panel=r.closest(".rb-panel"); const host=panel||r;
 if(c.lite||(!RBM_NOCAP&&RBM_LIVE>=RBM_MAX)) return; const e=document.createElement("i"); e.className="rbx rbx-spot"; host.appendChild(e); RBM_LIVE++; setTimeout(()=>{ e.remove(); RBM_LIVE=Math.max(0,RBM_LIVE-1) },c.d*2);
 const H=host.getBoundingClientRect(), b=r.getBoundingClientRect(), y=((b.top+b.height/2)-H.top)/Math.max(1,H.height)*100;
 rbmA(e,[{left:"-20%",top:"10%",opacity:0},{left:"30%",top:`${y}%`,opacity:1,offset:.4},{left:"50%",top:`${y}%`,opacity:1,offset:.7},{left:"50%",top:`${y}%`,opacity:0}],{duration:c.d*1.8,easing:"cubic-bezier(.4,0,.2,1)"});
 rbmA(r,[{filter:"brightness(.35)"},{filter:"brightness(.35)",offset:.35},{filter:"brightness(1.35)",offset:.6},{filter:"none"}],{duration:c.d*1.8}) }},
{id:"crSignature",n:50,cat:"creative",name:"Fantastic Signature — حركة سينمائية حصرية",run(r,c){ const ic=rbmQ(r,".rb-ic"), w=rbmQ(r,".rb-what"), v=rbmQ(r,".rb-val");
 const s=rbmSvg(r,c,"rbx-hexsig",`<path d="M50 3 93 27v46L50 97 7 73V27Z" fill="none" stroke="url(#rbsg)" stroke-width="5" pathLength="100" stroke-dasharray="100"/><defs><linearGradient id="rbsg"><stop offset="0" stop-color="#4d8dff"/><stop offset="1" stop-color="#f6c94a"/></linearGradient></defs>`,"0 0 100 100","",c.d*2.4);
 if(s&&ic){ const b=ic.getBoundingClientRect(), R=r.getBoundingClientRect(); s.parentNode.style.left=((b.left+b.width/2-R.left)/Math.max(1,R.width)*100)+"%"; rbmA(s.firstChild,[{strokeDashoffset:100},{strokeDashoffset:0,offset:.5},{strokeDashoffset:0,opacity:1,offset:.8},{opacity:0}],{duration:c.d*2}) }
 const st=rbmFx(r,c,"rbx-streak","",c.d*2.2); rbmA(st,[{transform:"translateX(110%) scaleX(.3)",opacity:0},{transform:"translateX(0) scaleX(1)",opacity:1,offset:.45},{transform:"translateX(-120%) scaleX(.3)",opacity:0}],{duration:c.d*1.6,easing:"cubic-bezier(.7,0,.3,1)"});
 rbmA(w,[{clipPath:"inset(0 0 0 100%)",opacity:1},{clipPath:"inset(0 0 0 100%)",offset:.3},{clipPath:"inset(0 0 0 0)"}],{duration:c.d*1.5,easing:RBM_EO});
 rbmA(v,[{transform:"translateY(-120%)",opacity:0},{transform:"translateY(-120%)",opacity:0,offset:.55},{transform:"translateY(12%)",opacity:1,offset:.8},{transform:"none",opacity:1}],{duration:c.d*1.6,easing:RBM_BK}) }},
];
export const RBM_BY_ID=Object.fromEntries(RB_MOTIONS.map(m=>[m.id,m]));

/* ---------- المكوّنات الثانوية لمحرك المؤثرات (مسجّلة أيضاً في Animation Registry) ---------- */
export const RB_EXITS={
 fadeOut:{name:"تلاشي",kf:[{opacity:1},{opacity:0}]},
 slideOut:{name:"انزلاق للخارج",kf:[{transform:"none",opacity:1},{transform:"translateX(-30%)",opacity:0}]},
 blurOut:{name:"ضبابية",kf:[{filter:"blur(0)",opacity:1},{filter:"blur(10px)",opacity:0}]},
 collapse:{name:"انطواء",kf:[{transform:"scaleY(1)",opacity:1},{transform:"scaleY(0)",opacity:0}]},
 sink:{name:"هبوط",kf:[{transform:"none",opacity:1},{transform:"translateY(40%) scale(.92)",opacity:0}]},
};
export const RB_IDLES={
 none:{name:"بدون"},breathe:{name:"تنفّس ناعم",cls:"rbi-breathe"},shimmer:{name:"لمعان دوري",cls:"rbi-shimmer"},float:{name:"طفو هادئ",cls:"rbi-float"},glow:{name:"توهج الوقت",cls:"rbi-glow"},
};
export const RB_IMGS={
 none:{name:"بدون"},pop:{name:"ظهور مرن",kf:[{transform:"scale(0)"},{transform:"scale(1.15)",offset:.6},{transform:"none"}]},
 spin:{name:"دوران",kf:[{transform:"rotate(-180deg) scale(.4)"},{transform:"none"}]},tilt:{name:"ميلان",kf:[{transform:"rotate(-18deg)"},{transform:"rotate(10deg)",offset:.5},{transform:"none"}]},
 shine:{name:"وميض",kf:[{filter:"brightness(2.2)"},{filter:"none"}]},rise:{name:"صعود",kf:[{transform:"translateY(70%)",opacity:0},{transform:"none",opacity:1}]},
};
export const RB_TIMES={
 none:{name:"بدون"},roll:{name:"عدّاد متدحرج",kf:[{transform:"translateY(100%)",opacity:0},{transform:"translateY(-10%)",opacity:1,offset:.7},{transform:"none"}]},
 flip:{name:"قلب",kf:[{transform:"perspective(300px) rotateX(90deg)"},{transform:"none"}]},stamp:{name:"ختم",kf:[{transform:"scale(2.2)",opacity:0},{transform:"scale(.9)",opacity:1,offset:.7},{transform:"none"}]},
 glowPop:{name:"توهج",kf:[{filter:"brightness(1)"},{filter:"brightness(2) drop-shadow(0 0 6px currentColor)",offset:.4},{filter:"none"}]},nudge:{name:"دفعة",kf:[{transform:"translateX(-25%)"},{transform:"translateX(8%)",offset:.6},{transform:"none"}]},
};

/** إعدادات المحرك الافتراضية (لكل تصميم) — تُدمج مع w.ae وrule.ae */
export const RB_AE_DEF={enter:"",exit:"fadeOut",idle:"none",line:"",img:"",text:"",time:"roll",hit:"",speed:1,power:1,dur:1,dir:"rtl",off:false};
export function rbAE(w,rule){ return Object.assign({},RB_AE_DEF,(w&&w.ae)||{},rule&&rule.ae||{}) }
function rbmCtx(ae,o={}){ const sp=Math.max(.25,+ae.speed||1), du=Math.max(.3,+ae.dur||1); return {d:Math.round(900*du/sp),p:Math.max(.2,Math.min(1.8,+ae.power||1)),dir:ae.dir==="ltr"?-1:1,hit:!!o.hit,lite:!!o.lite} }

/** تشغيل الحركة الرئيسية + المكوّنات المختارة على صف قانون */
export function rbmRun(row,motionId,ae,o={}){ if(!row||ae.off) return; const c=rbmCtx(ae,o), m=RBM_BY_ID[motionId]; if(row.closest&&row.closest(".mir-m")) c.dir*=-1; /* عكس اتجاه الحركة مع الاتجاه */
 if(m){ try{ m.run(row,c) }catch(e){} }
 const sub=(id,cat)=>{ const x=RBM_BY_ID[id]; if(x&&x.cat===cat&&x.id!==motionId) try{ x.run(row,c) }catch(e){} };
 if(ae.line) sub(ae.line,"line"); if(ae.text) sub(ae.text,"text");
 if(ae.img&&RB_IMGS[ae.img]&&RB_IMGS[ae.img].kf) rbmA(row.querySelector(".rb-ic"),RB_IMGS[ae.img].kf,{duration:c.d*.8,easing:RBM_BK});
 if(o.hit&&ae.time&&RB_TIMES[ae.time]&&RB_TIMES[ae.time].kf) rbmA(row.querySelector(".rb-val"),RB_TIMES[ae.time].kf,{duration:c.d*.7,easing:RBM_EO});
}
export function rbmExit(el,ae){ const x=RB_EXITS[ae.exit]||RB_EXITS.fadeOut, c=rbmCtx(ae); return rbmA(el,x.kf,{duration:Math.round(c.d*.6),easing:"ease-in",fill:"forwards"}) }
export const rbmLive=()=>RBM_LIVE;

/* ---------- Animation Registry ---------- */
/** السجل المركزي: كل حركة بمعرّف مستقل + نوعها + مسارها (الدالة) + تكوينها + طريقة تشغيلها */
export function rbAnimRegistry(){ return [
 ...RB_MOTIONS.map(m=>({id:m.id,n:m.n,kind:"main",cat:m.cat,name:m.name,path:"rbmotion.js#"+m.id,engine:"WAAPI+DOM",config:"run(row,ctx)"})),
 ...Object.entries(RB_EXITS).map(([id,x])=>({id:"exit:"+id,kind:"exit",name:x.name,path:"rbmotion.js#RB_EXITS",engine:"WAAPI",config:JSON.stringify(x.kf)})),
 ...Object.entries(RB_IMGS).filter(([,x])=>x.kf).map(([id,x])=>({id:"img:"+id,kind:"img",name:x.name,path:"rbmotion.js#RB_IMGS",engine:"WAAPI",config:JSON.stringify(x.kf)})),
 ...Object.entries(RB_TIMES).filter(([,x])=>x.kf).map(([id,x])=>({id:"time:"+id,kind:"time",name:x.name,path:"rbmotion.js#RB_TIMES",engine:"WAAPI",config:JSON.stringify(x.kf)})),
 ...Object.entries(RB_IDLES).filter(([,x])=>x.cls).map(([id,x])=>({id:"idle:"+id,kind:"idle",name:x.name,path:"rbmotion.js#RB_IDLES",engine:"CSS",config:x.cls})),
]}
/** بصمة حركية فعلية (لا تعتمد على الاسم أو المعرّف): تُسجَّل أثناء التشغيل الحقيقي —
 *  العناصر المستهدفة + الخصائص المتحركة + شكل الإطارات + عناصر المؤثرات المنشأة. الألوان والمدد تُحذف من البصمة. */
export function rbmTrace(row,motionId,ae){ const T=[], orig=Element.prototype.animate, origAppend=Element.prototype.appendChild;
 const role=el=>el===row?"row":el.classList?(["rb-ic","rb-what","rb-val","rb-ln","rbw-c","rbw-w"].find(k=>el.classList.contains(k))||(el.closest&&el.closest(".rbx")?"fx:"+(el.closest(".rbx").className.split(" ")[1]||"")+":"+el.tagName:"other:"+el.tagName)):"x";
 const shape=v=>String(v).replace(/#[0-9a-f]{3,8}|rgba?\([^)]*\)/gi,"C").replace(/-?\d+(\.\d+)?/g,m=>Math.abs(+m)<1e-9?"0":+m<0?"-n":"n");
 Element.prototype.animate=function(kf,o){ const k=Array.isArray(kf)?kf:[]; T.push("A:"+role(this)+":"+k.length+":"+k.map(f=>Object.keys(f).filter(x=>x!=="offset"&&x!=="easing").sort().map(p=>p+"="+shape(f[p])).join(",")).join("|")+":"+(o&&o.iterations>1?"loop":"")); return orig.call(this,kf,o) };
 Element.prototype.appendChild=function(n){ if(n&&n.classList&&n.classList.contains("rbx")) T.push("F:"+n.className.split(" ")[1]); return origAppend.call(this,n) };
 RBM_NOCAP=true; try{ rbmRun(row,motionId,Object.assign({},RB_AE_DEF,ae||{},{line:"",text:"",img:"",time:""}),{}) } finally { RBM_NOCAP=false; Element.prototype.animate=orig; Element.prototype.appendChild=origAppend }
 return T }
/** تشابه بين بصمتين (Jaccard على مجموعة الخطوات) */
export function rbmSimilar(a,b){ const A=new Set(a), B=new Set(b); let i=0; for(const x of A) if(B.has(x)) i++; return i/Math.max(1,A.size+B.size-i) }

/** CSS المؤثرات (طبقة .rb-fx شفافة — بدون أي خلفية إجبارية) */
export function rbmCSS(){ return `
.rbw .rb-fx{position:absolute;inset:0;pointer-events:none;overflow:visible;z-index:4;contain:layout style}
.rbw .rbx{position:absolute;display:block;pointer-events:none;color:var(--fxc,var(--acc,#9fd0ff))}
.rbw .rbx svg{width:100%;height:100%;display:block;overflow:visible}
.rbw .rbw-c{display:inline}.rbw .rbw-w{display:inline-block;white-space:pre}
.rbx-dot{width:.22em;height:.22em;border-radius:50%;background:currentColor;box-shadow:0 0 .4em currentColor}
.rbx-wave,.rbx-ecg,.rbx-pen,.rbx-bolt{left:0;right:0;bottom:calc(var(--lnb,.1em) - .3em);height:.6em}
.rbx-wave svg{width:200%}
.rbx-spark{width:.5em;height:.08em;border-radius:2px;background:linear-gradient(90deg,#fff6c9,#f6c94a);box-shadow:0 0 .4em #f6c94a}
.rbx-glare{width:22%;height:.9em;background:radial-gradient(closest-side,#fff,transparent);filter:blur(1px)}
.rbx-seg,.rbx-mag{height:var(--lnt,2px);background:currentColor;border-radius:2px}
.rbx-nib{width:.34em;height:.34em;border-radius:50%;background:#fff;box-shadow:0 0 .6em currentColor;transform:translateX(-50%)}
.rbx-maskedge{top:10%;bottom:10%;width:2px;background:currentColor;box-shadow:0 0 .6em currentColor}
.rbx-caret{top:22%;bottom:22%;inset-inline-end:auto;left:calc(var(--capx,40%));width:2px;background:currentColor}
.rbw .rbx-glaretext{background:linear-gradient(100deg,currentColor 40%,#fff 50%,currentColor 60%) 160% 0/250% 100% no-repeat;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.rbx-shard{inset:0;background:linear-gradient(120deg,transparent,rgba(255,255,255,.55),transparent)}
.rbx-ink{inset:-10% -4%;background:radial-gradient(closest-side,color-mix(in srgb,currentColor 55%,transparent),transparent);mix-blend-mode:screen}
.rbx-dia{width:.36em;height:.36em;background:linear-gradient(135deg,#fff,#b9e6ff 45%,#5aa9ff);box-shadow:0 0 .5em #bfe6ff}
.rbx-dust{width:.12em;height:.12em;border-radius:50%;background:#ffe08a;box-shadow:0 0 .3em #f6c94a}
.rbx-facet{inset:0;background:linear-gradient(160deg,rgba(255,255,255,.7),rgba(170,220,255,.25) 50%,transparent)}
.rbx-ring{width:1.6em;height:1.6em;border-radius:50%;border:2px solid currentColor;box-shadow:0 0 .6em currentColor}
.rbx-silk{inset:-20% -10%;background:linear-gradient(100deg,transparent 20%,rgba(255,255,255,.28) 40%,rgba(255,255,255,.08) 55%,rgba(255,255,255,.3) 70%,transparent 85%);filter:blur(2px)}
.rbx-ripple{left:50%;top:50%;width:100%;height:220%;border-radius:50%;border:1.5px solid rgba(255,255,255,.7)}
.rbx-metal{inset:0;background:linear-gradient(115deg,transparent 30%,#f2f5f9 45%,#9aa6b5 50%,#ffffff 55%,transparent 70%) 200% 0/250% 100% no-repeat;mix-blend-mode:screen}
.rbx-orn{inset:-6% -2%;color:var(--acc,#f6c94a)}
.rbx-corona{left:var(--icx,12%);top:50%;width:2.2em;height:2.2em;border-radius:50%;box-shadow:0 0 1.2em .4em #ffd77a,inset 0 0 .6em #fff3c4}
.rbx-moon{left:var(--icx,12%);top:50%;width:1.9em;height:1.9em;border-radius:50%;background:#05070d}
.rbx-halo{left:50%;top:50%;width:130%;height:300%;border-radius:50%;background:radial-gradient(closest-side,color-mix(in srgb,currentColor 55%,transparent),transparent 70%)}
.rbx-flare{left:50%;top:50%;width:120%;height:.12em;background:linear-gradient(90deg,transparent,#fff,transparent);box-shadow:0 0 .8em #fff}
.rbx-laser{top:-8%;bottom:-8%;width:3px;background:#ff3355;box-shadow:0 0 .8em #ff3355,0 0 2em #ff335588}
.rbx-scan{inset:0;background:repeating-linear-gradient(0deg,rgba(120,240,255,.35) 0 2px,transparent 2px 5px);mix-blend-mode:screen}
.rbx-px{background:var(--acc,#22e1ff)}
.rbx-circ{inset:0;color:#22e1ff}
.rbx-field{inset:-30% 0;color:currentColor}
.rbx-bolt{color:#9fd0ff}
.rbx-grid{left:-10%;right:-10%;top:30%;height:140%;background-image:linear-gradient(currentColor 1px,transparent 1px),linear-gradient(90deg,currentColor 1px,transparent 1px);background-size:24px 24px;opacity:.6;transform-origin:50% 0}
.rbx-radar{top:50%;width:3.2em;height:3.2em;border-radius:50%;background:conic-gradient(from 0deg,transparent 0 300deg,color-mix(in srgb,currentColor 70%,transparent) 360deg)}
.rbx-blip{inset-inline-end:calc(var(--valw,3em) * .5);top:45%;width:.4em;height:.4em;border-radius:50%;background:currentColor;box-shadow:0 0 .6em currentColor}
.rbx-br{top:-6%;bottom:-6%;width:.6em;border:2px solid currentColor}.rbx-br-a{right:-.3em;border-left:0}.rbx-br-b{left:-.3em;border-right:0}
.rbx-drop{top:-10%;width:.3em;height:.42em;border-radius:50% 50% 50% 50%/60% 60% 40% 40%;background:linear-gradient(#e0f6ff,#5ab8ff);--dropY:calc(var(--rh,40px) * .9)}
.rbx-splash{bottom:var(--lnb,.1em);width:1.4em;height:.5em;border-radius:50%;border:1.5px solid #8fd4ff}
.rbx-eq{bottom:22%;width:.22em;height:56%;background:currentColor;border-radius:2px;transform-origin:50% 100%}
.rbx-aur{top:50%;width:60%;height:260%;border-radius:50%;filter:blur(10px);mix-blend-mode:screen}
.rbx-crease{left:0;right:0;top:50%;height:1px;background:rgba(255,255,255,.6)}
.rbx-orbit{top:50%;width:calc(var(--rx)*2);height:calc(var(--ry)*2);border-radius:50%;border:1px dashed color-mix(in srgb,currentColor 50%,transparent)}
.rbx-orbit::after{content:"";position:absolute;top:-.15em;left:50%;width:.3em;height:.3em;border-radius:50%;background:currentColor;box-shadow:0 0 .5em currentColor}
.rbx-beam{right:0;width:35%;top:48%;height:.1em;background:#fff;transform-origin:100% 50%;box-shadow:0 0 .6em #fff}
.rbx-spectrum{left:0;width:66%;top:0;bottom:0;transform-origin:100% 50%;background:linear-gradient(180deg,#ff3b3b,#ff9f1a,#ffe14d,#3ddc84,#3aa0ff,#8a5cff);clip-path:polygon(100% 48%,100% 52%,0 100%,0 0);mix-blend-mode:screen}
.rbx-spot{width:9em;height:9em;border-radius:50%;transform:translate(-50%,-50%);background:radial-gradient(closest-side,rgba(255,250,230,.38),transparent);z-index:5}
.rbx-hexsig{top:50%;width:2.4em;height:2.4em;transform:translate(-50%,-50%)}
.rbx-streak{top:42%;left:0;right:0;height:.16em;background:linear-gradient(90deg,transparent,#4d8dff,#f6c94a,transparent);filter:blur(.5px)}
.rbi-breathe .rb-row{animation:rbi-br calc(4.8s/var(--as,1)) ease-in-out infinite}@keyframes rbi-br{50%{transform:scale(1.012)}}
.rbi-shimmer .rb-val{animation:rbi-sh calc(5.5s/var(--as,1)) ease-in-out infinite}@keyframes rbi-sh{0%,85%,100%{filter:none}92%{filter:brightness(1.6)}}
.rbi-float .rb-ic{animation:rbi-fl calc(3.6s/var(--as,1)) ease-in-out infinite}@keyframes rbi-fl{50%{transform:translateY(-8%)}}
.rbi-glow .rb-val{animation:rbi-gl calc(3s/var(--as,1)) ease-in-out infinite}@keyframes rbi-gl{50%{text-shadow:0 0 .5em currentColor}}
.rb-still .rbx,.rb-lite .rbx{display:none}.rb-still [class*="rbi-"] *,.rb-still.rbi-breathe .rb-row{animation:none!important}
`}
