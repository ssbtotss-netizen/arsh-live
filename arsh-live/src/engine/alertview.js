// صندوق الآيرتات الشامل (Universal Alert Box): رابط OBS واحد يعرض كل آيرتات المستخدم بالترتيب وبخلفية شفافة 100%
import { View } from "./view.js";
import { newWidget } from "./defs.js";
import { alQueue, alQueuePush, alQueueNext, alFill, alConfig, alMergeCfg, AL_FX, AL_FONT_CSS } from "./alerts.js";

/** تعريفات الآيرتات المتاحة لهذا الرابط: {id:{id,name,kind,durationSec,mediaUrl,mediaMime,audioUrl,config}} — يملؤها رابط OBS من الخادم (روابط موقّعة) أو اللوحة */
export const AB_DEFS={};
export function aboxSetDefs(map){ for(const k of Object.keys(AB_DEFS)) delete AB_DEFS[k]; Object.assign(AB_DEFS,map||{}) }
const abWait=ms=>new Promise(r=>setTimeout(r,ms));
const abEsc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let abCss=false;
export const AB_DEFAULT_AV="data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#2a2f45"/><circle cx="50" cy="38" r="18" fill="#8a93b8"/><path d="M18 92c4-20 18-30 32-30s28 10 32 30z" fill="#8a93b8"/></svg>');
/** حركات الدخول والخروج (Web Animations) */
const ab0={opacity:0}, ab1={opacity:1,transform:"none",filter:"none"};
export const AB_IN_KF={cinema:[{...ab0,transform:"scale(1.25)",filter:"blur(12px) brightness(2)"},{opacity:1,filter:"blur(0) brightness(1.2)",offset:.6},ab1],fadeIn:[ab0,ab1],zoomIn:[{...ab0,transform:"scale(.3)"},ab1],popIn:[{...ab0,transform:"scale(.5)"},{opacity:1,transform:"scale(1.12)",offset:.7},ab1],slideUp:[{...ab0,transform:"translateY(60%)"},ab1],slideDown:[{...ab0,transform:"translateY(-60%)"},ab1],slideRight:[{...ab0,transform:"translateX(60%)"},ab1],slideLeft:[{...ab0,transform:"translateX(-60%)"},ab1],
 bounceIn:[{...ab0,transform:"translateY(-80%)"},{opacity:1,transform:"translateY(8%)",offset:.6},{transform:"translateY(-4%)",offset:.8},ab1],flipX:[{...ab0,transform:"perspective(800px) rotateY(90deg)"},ab1],flipY:[{...ab0,transform:"perspective(800px) rotateX(90deg)"},ab1],rotateIn:[{...ab0,transform:"rotate(-200deg) scale(.4)"},ab1],swing:[{...ab0,transform:"rotate(-25deg)"},{opacity:1,transform:"rotate(12deg)",offset:.5},{transform:"rotate(-6deg)",offset:.8},ab1],
 elastic:[{...ab0,transform:"scaleX(.2)"},{opacity:1,transform:"scaleX(1.25)",offset:.5},{transform:"scaleX(.9)",offset:.75},ab1],blurIn:[{...ab0,filter:"blur(20px)"},ab1],dropIn:[{...ab0,transform:"translateY(-120%) scale(1.3)"},ab1],rise:[{...ab0,transform:"translateY(15%)"},ab1],spiral:[{...ab0,transform:"rotate(540deg) scale(0)"},ab1],stretch:[{...ab0,transform:"scaleY(.1)"},ab1],
 shake:[{...ab0},{opacity:1,transform:"translateX(-6%)",offset:.2},{transform:"translateX(6%)",offset:.4},{transform:"translateX(-4%)",offset:.6},{transform:"translateX(3%)",offset:.8},ab1],glitchIn:[{...ab0,transform:"translateX(-8%) skewX(20deg)",filter:"hue-rotate(90deg)"},{opacity:1,transform:"translateX(6%) skewX(-12deg)",offset:.4},{transform:"translateX(-3%)",offset:.7},ab1],
 neonOn:[{...ab0,filter:"brightness(3) blur(4px)"},{opacity:.4,offset:.3},{opacity:1,offset:.45},{opacity:.5,offset:.6},ab1],unfold:[{...ab0,transform:"scaleY(0)"},{opacity:1,transform:"scaleY(1.05)",offset:.7},ab1],roll:[{...ab0,transform:"translateX(-100%) rotate(-360deg)"},ab1],heartbeat:[{...ab0,transform:"scale(.6)"},{opacity:1,transform:"scale(1.15)",offset:.3},{transform:"scale(.95)",offset:.5},{transform:"scale(1.08)",offset:.7},ab1]};
export const AB_OUT_KF={fadeOut:[ab1,ab0],zoomOut:[ab1,{...ab0,transform:"scale(.3)"}],slideUp:[ab1,{...ab0,transform:"translateY(-60%)"}],slideDown:[ab1,{...ab0,transform:"translateY(60%)"}],slideRight:[ab1,{...ab0,transform:"translateX(60%)"}],slideLeft:[ab1,{...ab0,transform:"translateX(-60%)"}],flipOut:[ab1,{...ab0,transform:"perspective(800px) rotateY(90deg)"}],rotateOut:[ab1,{...ab0,transform:"rotate(200deg) scale(.4)"}],blurOut:[ab1,{...ab0,filter:"blur(20px)"}],
 shrink:[ab1,{...ab0,transform:"scale(0)"}],dropOut:[ab1,{...ab0,transform:"translateY(120%)"}],fly:[ab1,{...ab0,transform:"translate(40%,-120%) rotate(15deg)"}],spiralOut:[ab1,{...ab0,transform:"rotate(540deg) scale(0)"}],popOut:[ab1,{opacity:1,transform:"scale(1.2)",offset:.4},{...ab0,transform:"scale(0)"}],squeeze:[ab1,{...ab0,transform:"scaleX(0)"}],glitchOut:[ab1,{opacity:1,transform:"translateX(6%) skewX(-20deg)",offset:.5},{...ab0,transform:"translateX(-10%)",filter:"hue-rotate(90deg)"}],neonOff:[ab1,{opacity:.3,offset:.3},{opacity:.9,offset:.5},ab0],fold:[ab1,{...ab0,transform:"scaleY(0)"}]};
function abEnsureCSS(){ if(abCss||typeof document==="undefined") return; abCss=true; const st=document.createElement("style"); st.id="b6o6-abox"; st.textContent=AB_CSS; document.head.appendChild(st) }
export const AB_CSS=`.t-abox{background:transparent!important;overflow:hidden;pointer-events:none}
.ab-root{position:absolute;inset:0}.ab-media{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}.ab-media.cover{object-fit:cover}
.ab-av{position:absolute;transform:translate(-50%,-50%);aspect-ratio:1;border-radius:50%;background:center/cover no-repeat;box-sizing:border-box}
.ab-tx{position:absolute;transform:translate(-50%,-50%);white-space:nowrap;font-weight:900;text-align:center;text-shadow:0 2px 6px #000a,0 0 2px #000;max-width:96%;overflow:hidden;text-overflow:ellipsis}
.ab-ph{position:absolute;inset:8%;border:2px dashed #fff5;border-radius:14px;display:flex;align-items:center;justify-content:center;color:#fffa;font:700 14px system-ui;text-align:center}
.abf-none{border:0}.abf-circle{border:.25em solid #fff}.abf-ring{border:.3em solid #fff;box-shadow:0 0 0 .2em #0006}.abf-gold{border:.35em solid #f5c542;box-shadow:0 0 1em #f5c54299}.abf-silver{border:.35em solid #d9dde3;box-shadow:0 0 .8em #fff8}
.abf-neon{border:.25em solid #0ff;box-shadow:0 0 .6em #0ff,0 0 1.4em #f0f}.abf-fire{border:.3em solid #ff6a00;box-shadow:0 0 1em #ff3c00,0 -.4em 1.2em #ffb300}.abf-ice{border:.3em solid #bff3ff;box-shadow:0 0 1em #7fdcff}
.abf-crown{border:.3em solid #f5c542}.abf-crown::before{content:"👑";position:absolute;top:-.9em;left:50%;transform:translateX(-50%);font-size:1.4em}
.abf-hex{border-radius:0;clip-path:polygon(25% 3%,75% 3%,100% 50%,75% 97%,25% 97%,0 50%)}.abf-square{border-radius:4px;border:.25em solid #fff}.abf-rounded{border-radius:22%;border:.25em solid #fff}
.abf-diamond{border-radius:0;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)}.abf-star{border-radius:0;clip-path:polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)}
.abf-heart{border-radius:0;clip-path:path("M50 90 C10 60 0 35 18 18 C32 5 46 12 50 24 C54 12 68 5 82 18 C100 35 90 60 50 90Z")}.abf-shield{border-radius:0 0 50% 50%/0 0 40% 40%;border:.3em solid #4da3ff}
.abf-rainbow{border:.35em solid transparent;background-clip:padding-box;box-shadow:0 0 0 .35em #f00,0 0 0 .5em #fa0,0 0 0 .65em #0c6,0 0 0 .8em #39f}.abf-pulse{border:.3em solid #ff2d75;animation:abPulse 1s infinite}
.abf-glitch{border:.25em solid #fff;box-shadow:-.2em 0 #f0f,.2em 0 #0ff}.abf-spin{border:.3em dashed #fff;animation:abSpin 4s linear infinite}.abf-double{border:.2em solid #fff;box-shadow:0 0 0 .25em #000,0 0 0 .45em #fff}
.abf-dash{border:.25em dashed #ffd76a}.abf-glow{box-shadow:0 0 1.5em #fff,0 0 .4em #fff}.abf-shadow{box-shadow:0 .6em 1.2em #000c}.abf-leaf{border:.3em solid #3ccf6e;border-radius:50% 0 50% 0}
.abf-galaxy{border:.3em solid #7b5cff;box-shadow:0 0 1.2em #7b5cff,0 0 2em #ff5cd6}.abf-pixel{border-radius:0;border:.3em solid #fff;image-rendering:pixelated;box-shadow:.3em .3em 0 #000}.abf-royal{border:.35em solid #8a2be2;box-shadow:0 0 0 .2em #f5c542}
.abf-saudi{border:.35em solid #006c35;box-shadow:0 0 0 .18em #fff}.abf-pink{border:.3em solid #ff8ccf;box-shadow:0 0 1em #ff8ccf}.abf-cyber{border:.25em solid #f6ff00;box-shadow:.25em .25em 0 #00e5ff}.abf-b6o6{border:.35em solid #ffcc00;box-shadow:0 0 0 .2em #ff7a00,0 0 1.2em #ffcc00}
.abf-butterfly{border:.3em solid #c69cff}.abf-butterfly::after{content:"🦋";position:absolute;right:-.6em;top:-.4em;font-size:1.3em;animation:abFlap 1s infinite}
.abf-lightning{border:.3em solid #ffe600;box-shadow:0 0 1em #ffe600}.abf-lightning::after{content:"⚡";position:absolute;left:-.5em;top:-.3em;font-size:1.3em;animation:abFlash 1.2s infinite}
.abf-rose{border:.3em solid #e8335a}.abf-rose::after{content:"🌹";position:absolute;left:50%;bottom:-.8em;transform:translateX(-50%);font-size:1.2em}
.abf-wings{border:.3em solid #fff}.abf-wings::before,.abf-wings::after{content:"🪽";position:absolute;top:20%;font-size:1.8em;animation:abFlap 1.4s infinite}.abf-wings::before{left:-1.4em;transform:scaleX(-1)}.abf-wings::after{right:-1.4em}
.abf-crystal{border:.35em solid #a8f0ff;box-shadow:0 0 1em #a8f0ff,inset 0 0 .8em #fff8}.abf-chrome{border:.35em solid #ccc;box-shadow:0 0 0 .1em #555,0 0 .8em #fff6;filter:contrast(1.1)}
.abf-cloud{border:.3em solid #fff;box-shadow:0 0 1.4em #ffffffcc}.abf-crescent{border:.3em solid #f5c542}.abf-crescent::after{content:"🌙";position:absolute;right:-.7em;top:-.5em;font-size:1.3em}
.abf-sun{border:.35em solid #ffb300;box-shadow:0 0 1.6em #ffb300}.abf-emerald{border:.35em solid #10c070;box-shadow:0 0 1em #10c070}.abf-pearl{border:.35em solid #f4eee4;box-shadow:0 0 0 .15em #d8cfc0,0 0 .8em #fff}
.abf-falcon{border:.3em solid #8a6a3a}.abf-falcon::after{content:"🦅";position:absolute;right:-.8em;top:-.6em;font-size:1.4em}.abf-lion{border:.3em solid #d4a017}.abf-lion::after{content:"🦁";position:absolute;left:50%;top:-1em;transform:translateX(-50%);font-size:1.3em}
.abf-dragon{border:.3em solid #c0392b;box-shadow:0 0 1em #ff4500}.abf-dragon::after{content:"🐉";position:absolute;right:-1em;bottom:-.4em;font-size:1.4em}
.ab-noanim,.ab-noanim *,.ab-noanim::before,.ab-noanim::after{animation:none!important}
@keyframes abFlap{50%{transform:scale(.85) rotate(-8deg)}}@keyframes abFlash{50%{opacity:.2}}
@keyframes abPulse{50%{box-shadow:0 0 1.4em #ff2d75}}@keyframes abSpin{to{rotate:360deg}}
.ab-fx{position:absolute;inset:0;overflow:hidden}.ab-fx i{position:absolute;top:-10%;font-style:normal;animation:abFall linear forwards}
@keyframes abFall{to{transform:translateY(130vh) rotate(540deg);opacity:.2}}
.ab-test{position:absolute;top:4px;inset-inline-start:4px;background:#ff3b30;color:#fff;font:700 11px system-ui;padding:2px 6px;border-radius:6px}`;
const AB_FX_CH={butterflies:["🦋"],diamonds:["💎"],petals:["🌸","🌹"],meteors:["☄️"],lightning:["⚡"],crowns:["👑"],smoke:["☁️","🌫️"],confetti:["🟥","🟨","🟩","🟦","🟪"],hearts:["❤️","💖","💗"],stars:["⭐","✨","🌟"],sparkle:["✨","💫"],fireworks:["🎆","🎇","✨"],coins:["🪙","💰"],snow:["❄️","❅"]};
let lottieP=null;
/** Lottie: مكتبة lottie-web تُحمّل عند الحاجة فقط */
function abLottie(){ if(typeof window==="undefined") return Promise.reject(); if(window.lottie) return Promise.resolve(window.lottie); if(!lottieP) lottieP=new Promise((ok,no)=>{ const s=document.createElement("script"); s.src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"; s.onload=()=>ok(window.lottie); s.onerror=no; document.head.appendChild(s) }); return lottieP }

Object.assign(View.prototype,{
 applyAbox(w,W,Hh){ abEnsureCSS(); this.abH=Hh; this.abW=W; if(!this.ab) this.ab={Q:alQueue(),busy:false,cur:null,last:null,paused:false};
  if(this.opts.editor&&!this.ab.busy){ this.el.innerHTML=`<div class="ab-ph">🔔 صندوق الآيرتات<br>يعرض كل آيرتاتك المفعّلة هنا</div>` } },
 /** عناصر من الغرفة {t:"alert",items} */
 aboxPush(items){ const w=this.w; if(!this.ab) this.ab={Q:alQueue(),busy:false,cur:null,last:null,paused:false};
  const only=Array.isArray(w.abEvents)&&w.abEvents.length?new Set(w.abEvents):null;
  for(const it of items||[]){ if(only&&!only.has(it.event)) continue; if(w.abHideTest&&it.test&&!this.opts.editor) continue; alQueuePush(this.ab.Q,it,{maxQueue:+w.abMax||30,mergeLikes:w.abMerge!==false}) }
  this.aboxNext() },
 aboxCtl(op){ const A=this.ab; if(!A) return; if(op==="skip"&&A.cur) A.cur.skip=true; if(op==="stop"){ A.Q.q.length=0; if(A.cur) A.cur.skip=true } if(op==="pause") A.paused=true; if(op==="resume"){ A.paused=false; this.aboxNext() } if(op==="replay"&&A.last){ A.Q.q.unshift({...A.last,id:A.last.id+":r"+Date.now()}); this.aboxNext() } },
 async aboxNext(){ const A=this.ab; if(!A||A.busy||A.paused) return; const it=alQueueNext(A.Q); if(!it) return; A.busy=true; A.cur={it,skip:false};
  try{ await this.aboxPlay(it,A.cur) }catch(e){} A.last=it; A.cur=null; A.busy=false; if(A.Q.q.length) setTimeout(()=>this.aboxNext(),Math.max(0,+this.w.abGap||600)) },
 /** يرسم الآيرت: الطبقات (ملف + صورة بإطار + نصوص + تأثير) ثم دخول ← بقاء ← خروج ← شفاف */
 async aboxPlay(it,cur){ const d=AB_DEFS[it.alertId]; if(!d) return; const w=this.w, H=this.abH||300, ed=this.opts.editor;
  const c=alMergeCfg(d.config,it.over&&it.over.cfg), fixed=!!(it.over&&it.over.durationSec), dur=Math.max(1,+(it.over&&it.over.durationSec)||+d.durationSec||5)*1000; // بدون حد أعلى. «مدة مخصصة» = مدة ثابتة؛ التلقائي = طول المقطع كاملاً
  this.el.innerHTML=""; const r=document.createElement("div"); r.className="ab-root"; r.style.isolation="isolate"; this.el.appendChild(r);
  if(d.kind==="template"){ return this.aboxTemplate(d,c,it,r,dur,cur) }
  let media=null, lot=null, vid=null;
  if(d.mediaUrl&&d.kind!=="audio"){
   if(d.kind==="lottie"){ media=document.createElement("div"); media.className="ab-media"; r.appendChild(media); try{ const L=await abLottie(); lot=L.loadAnimation({container:media,renderer:"svg",loop:true,autoplay:true,path:d.mediaUrl}) }catch(e){} }
   else if(d.kind==="video"){ const v=document.createElement("video"); v.className="ab-media"+(c.fit==="cover"?" cover":""); v.src=d.mediaUrl; v.playsInline=true; vid=v; v.muted=!!(ed||this.opts.mute||!c.videoSound); v.volume=c.volume; v.crossOrigin="anonymous";
    if(c.chroma.on){ media=this.aboxChroma(v,c); r.appendChild(media) } else { media=v; r.appendChild(v) } v.play().catch(()=>{ v.muted=true; v.play().catch(()=>{}) }) }
   else { const im=document.createElement("img"); im.className="ab-media"+(c.fit==="cover"?" cover":""); im.src=d.mediaUrl; im.alt=""; media=im; r.appendChild(im) } }
  const V=it.vars||{};
  if(c.avatar.show&&(V.avatar||V.display_name||V.username)){ /* بدون صورة من المصدر: صورة افتراضية واضحة (لا نختلق صورة شخص) */ const a=document.createElement("div"); a.className="ab-av abf-"+c.avatar.frame+(c.frameAnim?"":" ab-noanim"); if(c.layerOrder==="behind") a.style.zIndex="-1"; const sz=c.avatar.size/100*H; Object.assign(a.style,{left:c.avatar.x+"%",top:c.avatar.y+"%",width:sz+"px",fontSize:sz/10+"px",backgroundImage:`url("${String(V.avatar||AB_DEFAULT_AV).replace(/"/g,"")}")`}); r.appendChild(a) }
  const texts=[]; for(const k of ["title","sub","msg"]){ const L=c[k]; if(!L.show) continue; const tpl=(it.over&&it.over[k])||L.text; const txt=alFill(tpl,V); if(!txt) continue; const t=document.createElement("div"); t.className="ab-tx ab-tx-"+k; t.textContent=txt; Object.assign(t.style,{left:L.x+"%",top:L.y+"%",fontSize:L.size/100*H+"px",color:L.color,fontFamily:AL_FONT_CSS[c.font]||"inherit"}); if(k==="msg") Object.assign(t.style,{whiteSpace:"normal",width:"86%",fontWeight:"700"}); r.appendChild(t); texts.push(t) }
  if(c.fx!=="none"&&!(this.opts.lowPerf)) this.aboxFx(r,c.fx,dur);
  if(it.test&&ed) r.insertAdjacentHTML("beforeend",`<div class="ab-test">تجربة</div>`);
  if(d.audioUrl&&!ed&&!this.opts.mute){ try{ const a=new Audio(d.audioUrl); a.volume=it.over&&it.over.volume!=null?it.over.volume:c.volume; cur.audio=a; setTimeout(()=>{ if(!cur.skip) a.play().catch(()=>{}) },c.audioDelay) }catch(e){} }
  texts.forEach((t,i)=>{ try{ t.animate((AB_IN_KF[c.textEnter]||AB_IN_KF.rise).map(f=>({...f,transform:"translate(-50%,-50%) "+(f.transform&&f.transform!=="none"?f.transform:"")})),{duration:600/c.speed,delay:(250+i*180)/c.speed,easing:"cubic-bezier(.2,.9,.3,1)",fill:"backwards"}) }catch(e){} });
  await r.animate(AB_IN_KF[c.enter]||AB_IN_KF.popIn,{duration:650/c.speed,easing:"cubic-bezier(.2,.9,.3,1)",fill:"backwards"}).finished.catch(()=>{});
  // لا يُقطع المقطع: يبقى الآيرت حتى تنتهي المدة المحددة وحتى ينتهي الفيديو/الصوت نفسه
  const mediaLeft=el=>!!(el&&!el.ended&&!el.error&&isFinite(el.duration)&&el.duration-el.currentTime>.45&&(!el.paused||el.currentTime===0)&&Date.now()-t0<el.duration*1000+4000);
  const t0=Date.now(); while(!cur.skip&&(Date.now()-t0<dur-1000||!fixed&&(mediaLeft(vid)||mediaLeft(cur.audio)))) await abWait(100);
  await r.animate(AB_OUT_KF[c.exit]||AB_OUT_KF.fadeOut,{duration:450/c.speed,easing:"ease-in",fill:"forwards"}).finished.catch(()=>{});
  try{ if(lot) lot.destroy(); if(cur.audio) cur.audio.pause(); if(media&&media.tagName==="VIDEO") media.pause() }catch(e){}
  r.remove(); if(ed) this.applyAbox(w,this.abW,this.abH) },
 /** القوالب الرسمية: تصاميم تنبيهات المتابعين الجاهزة داخل الصندوق */
 async aboxTemplate(d,c,it,r,dur,cur){ const V=it.vars||{}; const sub=new View(newWidget("falert",{id:"abt",design:c.template||"duck_classic",x:0,y:0,w:1,h:1,z:1,holdMs:Math.max(1200,dur-1800),sound:"",...(it.event==="donation"?{msgs:"💸 شكراً يا {username} على دعمك",sub:""}:{})}),{w:this.abW||400,h:this.abH||300},{mute:true,refW:this.abW});
  r.appendChild(sub.el); sub.el.style.left="0"; sub.el.style.top="0"; const name=V.display_name||V.username||"";
  // في الدونيشن: القالب يعرض الاسم، ونضيف فوقه سطر المبلغ ورسالة الداعم
  if(it.event==="donation"){ const H=this.abH||300; for(const k of ["sub","msg"]){ const L=c[k]; if(!L.show) continue; const txt=alFill((it.over&&it.over[k])||L.text,V); if(!txt) continue; const t=document.createElement("div"); t.className="ab-tx ab-tx-"+k; t.textContent=txt; Object.assign(t.style,{left:L.x+"%",top:L.y+"%",fontSize:L.size/100*H+"px",color:L.color,fontFamily:AL_FONT_CSS[c.font]||"inherit",zIndex:5}); if(k==="msg") Object.assign(t.style,{whiteSpace:"normal",width:"86%"}); r.appendChild(t) } }
  try{ await sub.faPlay({id:it.id,name,av:V.avatar||"",test:!!it.test}) }catch(e){} r.remove(); if(this.opts.editor) this.applyAbox(this.w,this.abW,this.abH) },
 /** إزالة لون الخلفية (Chroma/Green screen) على canvas — شفافية حقيقية في OBS */
 aboxChroma(v,c){ const cv=document.createElement("canvas"); cv.className="ab-media"; const g=cv.getContext("2d",{willReadFrequently:true}); const hex=c.chroma.color, kr=parseInt(hex.slice(1,3),16), kg=parseInt(hex.slice(3,5),16), kb=parseInt(hex.slice(5,7),16), tol=c.chroma.tol, luma=c.chroma.mode==="luma"; // luma: إزالة الخلفية السوداء حسب الإضاءة
  const step=()=>{ if(!cv.isConnected&&v.currentTime>0) return; if(v.readyState>=2){ if(cv.width!==v.videoWidth){ cv.width=v.videoWidth; cv.height=v.videoHeight } try{ g.drawImage(v,0,0); const f=g.getImageData(0,0,cv.width,cv.height), p=f.data; for(let i=0;i<p.length;i+=4){ const dd=luma?(p[i]*.299+p[i+1]*.587+p[i+2]*.114)*1.6:Math.sqrt((p[i]-kr)**2+(p[i+1]-kg)**2+(p[i+2]-kb)**2); if(dd<tol) p[i+3]=0; else if(dd<tol*1.4) p[i+3]=Math.round(255*(dd-tol)/(tol*.4)) } g.putImageData(f,0,0) }catch(e){} }
   if(!v.ended) requestAnimationFrame(step) }; v.addEventListener("play",()=>requestAnimationFrame(step),{once:true}); return cv },
 aboxFx(r,fx,dur){ const ch=AB_FX_CH[fx]; if(!ch) return; const box=document.createElement("div"); box.className="ab-fx"; let h=""; for(let i=0;i<26;i++){ const s=(Math.random()*1.4+.8)*(this.abH||300)/18; h+=`<i style="left:${Math.random()*100}%;font-size:${s}px;animation-duration:${(Math.random()*2+2).toFixed(2)}s;animation-delay:${(Math.random()*Math.min(2,dur/2000)).toFixed(2)}s">${abEsc(ch[i%ch.length])}</i>` } box.innerHTML=h; r.appendChild(box) },
});
export const AB_FX_LIST=AL_FX;
