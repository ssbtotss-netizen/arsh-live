// ====== الشات الموحد: محرك العرض + التصاميم (شفاف 100% خارج الرسائل) ======
import { View } from "./view.js";
import { esc, avatar } from "./defs.js";
import { CHAT_PLATFORMS, chatMsgOf, chatFilter, chatImportant } from "./chat.js";

// رموز مبسطة أصلية تدل على المنصة (ليست نسخاً من الشعارات الرسمية)
export const UC_ICONS={
 tiktok:'<svg viewBox="0 0 24 24"><path fill="#25f4ee" d="M14.5 3h2.6c.3 2.2 1.7 3.6 3.9 3.8v2.7c-1.4 0-2.8-.4-3.9-1.2v6.3a5.6 5.6 0 1 1-5.6-5.6v2.8a2.8 2.8 0 1 0 2.9 2.8z" transform="translate(-.6 .5)"/><path fill="#fe2c55" d="M14.5 3h2.6c.3 2.2 1.7 3.6 3.9 3.8v2.7c-1.4 0-2.8-.4-3.9-1.2v6.3a5.6 5.6 0 1 1-5.6-5.6v2.8a2.8 2.8 0 1 0 2.9 2.8z" transform="translate(.6 -.5)"/><path fill="#fff" d="M14.5 3h2.6c.3 2.2 1.7 3.6 3.9 3.8v2.7c-1.4 0-2.8-.4-3.9-1.2v6.3a5.6 5.6 0 1 1-5.6-5.6v2.8a2.8 2.8 0 1 0 2.9 2.8z"/></svg>',
 youtube:'<svg viewBox="0 0 24 24"><rect x="1.5" y="5" width="21" height="14" rx="4" fill="#ff0000"/><path d="M10 9l5.2 3L10 15z" fill="#fff"/></svg>',
 kick:'<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="4" fill="#53fc18"/><path d="M7 6h3v4h1.5V8.5H13V7h3v3.5h-1.5V12H16v1.5h-1.5V15H16v2h-3v-1.5h-1.5V14H10v4H7z" fill="#0b0e0f"/></svg>',
 twitch:'<svg viewBox="0 0 24 24"><path d="M4 3h17v11l-5 5h-4l-3 3H7v-3H3V6z" fill="#9146ff"/><path d="M11 7h2v5h-2zm5 0h2v5h-2z" fill="#fff"/></svg>',
 donation:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#22c55e"/><path d="M12.8 6v1.3c1.3.2 2.2.9 2.6 1.9l-1.6.7c-.3-.6-.9-1-1.8-1-1 0-1.5.4-1.5 1 0 .6.5.9 1.9 1.2 2.1.5 3.2 1.3 3.2 2.9 0 1.4-1 2.4-2.8 2.7V18h-1.6v-1.3c-1.5-.2-2.6-1-3-2.2l1.6-.7c.4.8 1.1 1.3 2.2 1.3s1.8-.4 1.8-1.1c0-.6-.5-.9-2-1.3-1.9-.4-3.1-1.1-3.1-2.8 0-1.3 1-2.3 2.6-2.6V6z" fill="#fff"/></svg>',
};
export const UC_DESIGNS=[
 {id:"glass",name:"Glass Chat",ar:"زجاجي",desc:"بطاقات زجاجية شفافة بحواف ناعمة"},
 {id:"neon",name:"Neon Chat",ar:"نيون",desc:"إطار نيون بلون المنصة وتوهج خفيف"},
 {id:"royal",name:"Royal Chat",ar:"ملكي",desc:"إطار ذهبي مزدوج وزخرفة صغيرة"},
 {id:"gaming",name:"Gaming Chat",ar:"ألعاب",desc:"بطاقات مائلة بشريط لون المنصة"},
 {id:"floating",name:"Floating Chat",ar:"عائم",desc:"نص بدون خلفية يطفو ويتلاشى"},
 {id:"minimal",name:"Minimal Chat",ar:"بسيط",desc:"سطر واحد: الاسم: الرسالة"},
 {id:"cyber",name:"Cyberpunk Chat",ar:"سايبربنك",desc:"زوايا مقطوعة وخط مسح وألوان سماوية"},
 {id:"diamond",name:"Diamond Chat",ar:"ألماسي",desc:"حواف كريستالية وانعكاس ضوئي"},
 {id:"saudi",name:"Saudi Chat",ar:"سعودي",desc:"أخضر وذهبي مع زخرفة نجدية"},
 {id:"b6o6",name:"B6O6 Signature Chat",ar:"توقيع B6O6",desc:"هوية B6O6 الزرقاء والفضية"},
 {id:"bubble",name:"Bubble Chat",ar:"فقاعات",desc:"فقاعات محادثة بذيل مثل تطبيقات الرسائل"},
 {id:"terminal",name:"Terminal Chat",ar:"طرفية",desc:"خط برمجي وبادئة المنصة [TT]"}, {id:"sakura",name:"Sakura Chat",ar:"ساكورا",desc:"وردي ناعم مع بتلة زهرة في الزاوية"},
 {id:"fire",name:"Fire Chat",ar:"ناري",desc:"تدرج ناري بحافة سفلية متوهجة"},
 {id:"space",name:"Galaxy Chat",ar:"مجرة",desc:"سماء نجوم داخل كل رسالة"},
 {id:"paper",name:"Paper Chat",ar:"ورقي",desc:"ورقة بيضاء بظل خفيف ونص داكن"},
 {id:"pixel",name:"Pixel Chat",ar:"بكسل",desc:"حواف بكسلية بأسلوب الألعاب القديمة"},
 {id:"gold",name:"Gold Bar Chat",ar:"سبيكة ذهبية",desc:"سبيكة ذهب لامعة بنص داكن"},
 {id:"ocean",name:"Ocean Chat",ar:"محيط",desc:"موجة زرقاء بحافة متموجة"},
 {id:"matrix",name:"Matrix Chat",ar:"ماتريكس",desc:"أخضر على أسود بخط برمجي"},
 {id:"candy",name:"Candy Chat",ar:"حلوى",desc:"ألوان حلوى مرحة بإطار مخطط"},
 {id:"aurora",name:"Aurora Chat",ar:"الشفق",desc:"تدرج شفق قطبي متحرك ببطء"},
 {id:"sticker",name:"Sticker Chat",ar:"ملصق",desc:"ملصق أبيض بحد سميك وظل"},
 {id:"comic",name:"Comic Chat",ar:"كوميكس",desc:"فقاعة كوميكس بخط أسود عريض"},
 {id:"hud",name:"HUD Chat",ar:"واجهة HUD",desc:"أقواس زاوية مثل واجهات الألعاب"},
 {id:"royalPurple",name:"Royal Purple Chat",ar:"بنفسجي ملكي",desc:"بنفسجي داكن بإطار فضي"},
 {id:"desert",name:"Desert Chat",ar:"صحراوي",desc:"لون الرمل وزخرفة سدو سفلية"},
 {id:"ice",name:"Ice Chat",ar:"جليدي",desc:"زجاج جليدي أزرق فاتح"},
 {id:"ribbon",name:"Ribbon Chat",ar:"شريط",desc:"الاسم على شريط ملون والرسالة تحته"},
 {id:"duck",name:"B6O6 Duck Chat",ar:"بطة B6O6",desc:"أبيض وبرتقالي بلون بطة B6O6 مع 🦆"},
];
export const UC_ENTERS=[["right","من اليمين"],["bottom","من الأسفل"],["fade","تلاشي"],["pop","انبثاق"],["none","بدون حركة"]];
const UC_TAG={tiktok:"TT",youtube:"YT",kick:"KC",twitch:"TW",donation:"$$"};
const UC_ROT=["tiktok","youtube","kick","twitch"];
let ucCss=false;
function ensureUcCSS(){ if(ucCss||typeof document==="undefined") return; ucCss=true; const st=document.createElement("style"); st.id="b6o6-uchat"; st.textContent=UC_CSS; document.head.appendChild(st) }
const ucSample=()=>{ const t=Date.now(); return [
 {id:"s1",platform:"tiktok",kind:"msg",uid:"a",name:"محمد",text:"السلام عليكم",at:t-9000},
 {id:"s2",platform:"youtube",kind:"msg",uid:"b",name:"أحمد",text:"البث رهيب 🔥",at:t-7000,sub:true},
 {id:"s3",platform:"kick",kind:"msg",uid:"c",name:"عبدالله",text:"نورت",at:t-5000,mod:true},
 {id:"s4",platform:"twitch",kind:"msg",uid:"d",name:"Sara",text:"Let's go!",at:t-3000},
 {id:"s5",platform:"tiktok",kind:"gift",uid:"e",name:"نورة",text:"أرسل وردة ×5",value:5,at:t-1000}] };

Object.assign(View.prototype,{
 applyChat(w,W,Hh){ ensureUcCSS(); const e=this.el, ed=this.opts.editor;
  e.className=`wd ucw ucd-${w.design||"glass"} uc-${w.dir==="top"?"top":"bottom"} ucm-${w.mode||"all"}${w.animOn===false?" uc-still":""}${w.showAv===false?" uc-noav":""}${w.showLogo===false?" uc-nologo":""}${ed?(" "+(w.locked?"locked":"")+(w.visible?"":" hid")+(this.opts.sel===w.id?" sel":"")):""}`;
  const st=e.style; st.setProperty("--ufs",Math.max(10,Math.min(W*.045,Hh*.05))*(w.fontScale||1)+"px"); st.setProperty("--ubg",String(w.bgOpacity??.55)); if(w.font) st.setProperty("--uff",`"${w.font}"`); else st.removeProperty("--uff");
  if(w.nameColor) st.setProperty("--unc",w.nameColor); else st.removeProperty("--unc"); if(w.textColor) st.setProperty("--utc",w.textColor); else st.removeProperty("--utc"); if(w.accent) st.setProperty("--uac",w.accent); else st.removeProperty("--uac");
  const sig=["uc",w.mode,w.design,w.dir,w.banned,w.dedupe,w.showEvents,w.importantWords,(w.eventKinds||[]).join()].join("|");
  if(sig!==this.sig){ this.sig=sig; this.ucF=chatFilter(w); if(!this.ucBuf){ const src=this.opts.data?this.opts.data():null; this.ucBuf=(src&&(src.CHAT||src.CH)||[]).slice(-100) }
   e.innerHTML=`<div class="uc-root"></div>`+(ed?'<div class="rh"></div><div class="lockb">🔒</div>':""); this.ucRoot=e.firstChild; clearInterval(this.ucRotT); this.ucRotT=0; this.ucRotI=0;
   if(w.mode==="rotate") this.ucRotT=setInterval(()=>{ if(!this.el.isConnected){ clearInterval(this.ucRotT); return } this.ucRotI=(this.ucRotI+1)%UC_ROT.length; this.ucRender(true) },Math.max(3,+w.rotateSec||8)*1000);
   this.ucRender(false) }
 },
 ucList(platform){ const w=this.w; let buf=this.ucBuf||[]; if(!buf.length&&(this.opts.editor||String(w.id).startsWith("pv_"))) buf=ucSample();
  const F=chatFilter(w,()=>0); const out=[]; for(const m of buf){ const r=F(m,platform||w.mode); if(r) out.push(r) } return out.slice(-Math.max(1,+w.max||8)) },
 ucRender(anim){ const w=this.w, R=this.ucRoot; if(!R) return;
  if(w.mode==="split"){ const ps=UC_ROT.filter(p=>!(w.splitHide||[]).includes(p));
   R.innerHTML=`<div class="uc-split">${ps.map(p=>`<div class="uc-col" data-p="${p}"><div class="uc-ch">${UC_ICONS[p]}<span>${CHAT_PLATFORMS[p].name}</span></div><div class="uc-list"></div></div>`).join("")}</div>`;
   for(const p of ps){ const L=R.querySelector(`.uc-col[data-p="${p}"] .uc-list`); for(const m of this.ucList(p)) L.appendChild(this.ucEl(m)) } return }
  const plat=w.mode==="rotate"?UC_ROT[this.ucRotI||0]:null;
  R.innerHTML=(plat?`<div class="uc-rh">${UC_ICONS[plat]}<span>${CHAT_PLATFORMS[plat].name}</span></div>`:"")+`<div class="uc-list"></div>`;
  const L=R.querySelector(".uc-list"); for(const m of this.ucList(plat)) L.appendChild(this.ucEl(m));
  if(anim&&plat&&w.animOn!==false) R.animate([{opacity:0,transform:"translateY(8%)"},{opacity:1,transform:"none"}],{duration:380,easing:"ease-out"}) },
 ucEl(m){ const w=this.w, imp=chatImportant(m,w), el=document.createElement("div");
  el.className=`uc-m p-${m.platform} k-${m.kind}${m.mod?" mod":""}${m.sub?" sub":""}${m.owner?" own":""}${imp&&w.highlight!==false?" imp":""}${m.test?" test":""}`; el.dataset.id=m.id;
  const money=m.amount!=null?`<span class="uc-amt" dir="ltr">${esc((m.currency==="USD"?"$":"")+m.amount+(m.currency&&m.currency!=="USD"?" "+m.currency:""))}</span>`:"";
  const time=w.showTime?`<span class="uc-tm">${new Date(m.at).toLocaleTimeString("ar-SA",{hour:"2-digit",minute:"2-digit"})}</span>`:"";
  el.innerHTML=`${w.showAv!==false?`<img class="uc-av" src="${esc(m.av||avatar(m.name))}" alt="">`:""}<div class="uc-b"><div class="uc-h">${w.showLogo!==false?`<i class="uc-lg">${UC_ICONS[m.platform]||""}</i>`:""}<span class="uc-tag">[${UC_TAG[m.platform]||"??"}]</span>${m.owner?'<i class="uc-bd own" title="المذيع">🎙</i>':""}${m.mod?'<i class="uc-bd mod" title="مشرف">🛡</i>':""}${m.sub?'<i class="uc-bd sub" title="مشترك">★</i>':""}<b class="uc-n">${esc(m.name)}</b><span class="uc-sep">:</span>${time}</div><div class="uc-t">${money}${esc(m.text||"")}</div></div>${m.kind==="gift"||m.kind==="donation"||m.kind==="superchat"||m.kind==="cheer"?'<i class="uc-st s1">✦</i><i class="uc-st s2">✦</i><i class="uc-st s3">✦</i>':""}<i class="uc-sh"></i>`;
  const im=el.querySelector(".uc-av"); if(im) im.onerror=()=>{ im.onerror=null; im.src=avatar(m.name) };
  return el },
 /** حدث مباشر من الحافلة */
 chatPush(ev){ const m=ev&&ev.kind&&ev.platform?ev:chatMsgOf(ev); if(!m) return; const w=this.w; this.ucBuf=this.ucBuf||[];
  if(this.ucBuf.some(x=>x.id===m.id)) return; this.ucBuf.push(m); if(this.ucBuf.length>100) this.ucBuf.splice(0,this.ucBuf.length-100);
  const plat=w.mode==="rotate"?UC_ROT[this.ucRotI||0]:w.mode==="split"?m.platform:null;
  const r=(this.ucF||chatFilter(w))(m,plat||w.mode); if(!r) return;
  const L=w.mode==="split"?this.ucRoot&&this.ucRoot.querySelector(`.uc-col[data-p="${m.platform}"] .uc-list`):this.ucRoot&&this.ucRoot.querySelector(".uc-list"); if(!L) return;
  // أول رسالة حقيقية تستبدل رسائل المعاينة
  if(L.querySelector('.uc-m[data-id^="s"]')&&!String(m.id).startsWith("s")) L.querySelectorAll('.uc-m[data-id^="s"]').forEach(x=>{ if(/^s\d$/.test(x.dataset.id)) x.remove() });
  const el=this.ucEl(r); L.appendChild(el);
  const max=Math.max(1,+w.max||8); while(L.children.length>max) L.firstElementChild.remove();
  if(w.animOn!==false&&!this.el.classList.contains("uc-still")){ const en=w.enter||"right", K={right:[{opacity:0,transform:"translateX(-40%)"},{opacity:1,transform:"none"}],bottom:[{opacity:0,transform:"translateY(70%)"},{opacity:1,transform:"none"}],fade:[{opacity:0},{opacity:1}],pop:[{opacity:0,transform:"scale(.6)"},{opacity:1,transform:"scale(1.04)"},{opacity:1,transform:"none"}]}[en];
   if(K) el.animate(K,{duration:420,easing:"cubic-bezier(.2,.8,.2,1)"}); el.classList.add("uc-new"); setTimeout(()=>el.classList.remove("uc-new"),1200) }
  if((+w.holdSec||0)>0) setTimeout(()=>{ if(!el.isConnected) return; const a=el.animate([{opacity:1},{opacity:0}],{duration:450,fill:"forwards"}); a.onfinish=()=>el.remove() },(+w.holdSec)*1000) },
 chatLoad(list){ this.ucBuf=(list||[]).slice(-100); this.ucRender(false) },
});

const UC_CSS=`
.ucw{background:none!important;direction:rtl;color:#fff;font-family:var(--uff,"Readex Pro","Changa",sans-serif)}
.ucw .uc-root{position:absolute;inset:0;display:flex;flex-direction:column}
.ucw .uc-list{flex:1;display:flex;flex-direction:column;gap:calc(var(--ufs)*.4);overflow:hidden;justify-content:flex-end;min-height:0}
.ucw.uc-top .uc-list{flex-direction:column-reverse;justify-content:flex-end}
.ucw .uc-m{position:relative;display:flex;align-items:flex-start;gap:calc(var(--ufs)*.5);padding:calc(var(--ufs)*.45) calc(var(--ufs)*.7);font-size:var(--ufs);flex:none;overflow:hidden;--pc:#fff}
.ucw .p-tiktok{--pc:#fe2c55}.ucw .p-youtube{--pc:#ff3b3b}.ucw .p-kick{--pc:#53fc18}.ucw .p-twitch{--pc:#a970ff}.ucw .p-donation{--pc:#22c55e}
.ucw .uc-av{width:calc(var(--ufs)*2);height:calc(var(--ufs)*2);border-radius:50%;object-fit:cover;flex:none;background:#111}
.ucw.uc-noav .uc-av{display:none}
.ucw .uc-b{min-width:0;flex:1}
.ucw .uc-h{display:flex;align-items:center;gap:calc(var(--ufs)*.3);font-size:calc(var(--ufs)*.82);line-height:1.3;min-width:0}
.ucw .uc-lg{width:calc(var(--ufs)*1.05);height:calc(var(--ufs)*1.05);flex:none;display:inline-flex}.ucw .uc-lg svg{width:100%;height:100%}
.ucw.uc-nologo .uc-lg{display:none}
.ucw .uc-tag{display:none;font-family:ui-monospace,monospace;color:var(--pc);font-weight:700}
.ucw .uc-n{color:var(--unc,var(--pc));font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;unicode-bidi:plaintext;max-width:60%}
.ucw .uc-sep{display:none}
.ucw .uc-tm{opacity:.55;font-size:.85em;margin-inline-start:auto}
.ucw .uc-bd{font-style:normal;font-size:.9em}.ucw .uc-bd.mod{color:#4ade80}.ucw .uc-bd.sub{color:#fbbf24}
.ucw .uc-t{color:var(--utc,#fff);font-weight:600;line-height:1.35;word-break:break-word;unicode-bidi:plaintext;text-align:start}
.ucw .uc-amt{display:inline-block;margin-inline-end:.4em;padding:0 .35em;border-radius:.3em;background:#16a34a;color:#fff;font-weight:900}
.ucw .k-gift .uc-t,.ucw .k-follow .uc-t,.ucw .k-subscribe .uc-t,.ucw .k-share .uc-t,.ucw .k-raid .uc-t{color:#ffd66b;font-style:italic}
/* مؤثرات خفيفة: لمعة عند الوصول، نجوم للداعمين، إطار للمشرف، إبراز المهم */
.ucw .uc-sh{position:absolute;inset:0;pointer-events:none;background:linear-gradient(105deg,transparent 35%,#ffffff55 50%,transparent 65%);transform:translateX(130%)}
.ucw .uc-new .uc-sh{animation:uc-sh .9s ease .15s}
@keyframes uc-sh{from{transform:translateX(130%)}to{transform:translateX(-130%)}}
.ucw .uc-st{position:absolute;font-style:normal;color:#ffd66b;font-size:calc(var(--ufs)*.7);opacity:0;pointer-events:none}
.ucw .uc-st.s1{top:6%;left:8%}.ucw .uc-st.s2{bottom:8%;left:22%}.ucw .uc-st.s3{top:20%;left:40%}
.ucw .uc-m .uc-st{animation:uc-tw 2.2s ease-in-out infinite}.ucw .uc-st.s2{animation-delay:.7s}.ucw .uc-st.s3{animation-delay:1.4s}
@keyframes uc-tw{0%,100%{opacity:0;transform:scale(.5)}50%{opacity:1;transform:scale(1.1)}}
.ucw .uc-m.mod{box-shadow:0 0 0 calc(var(--ufs)*.08) #4ade80,0 0 calc(var(--ufs)*.6) #4ade8088}
.ucw .uc-m.imp{outline:calc(var(--ufs)*.09) solid var(--uac,#fbbf24);outline-offset:-1px}
.ucw .uc-m.k-gift.uc-new{animation:uc-gift .9s ease}
@keyframes uc-gift{0%{transform:scale(1)}30%{transform:scale(1.05);filter:brightness(1.4)}100%{transform:none}}
.ucw.uc-still *{animation:none!important}
/* التقسيم والتناوب */
.ucw .uc-split{flex:1;display:grid;grid-template-columns:repeat(auto-fit,minmax(0,1fr));gap:calc(var(--ufs)*.5);min-height:0}
.ucw .uc-col{display:flex;flex-direction:column;min-height:0;min-width:0}
.ucw .uc-ch,.ucw .uc-rh{display:flex;align-items:center;gap:.4em;font-weight:800;font-size:calc(var(--ufs)*.9);padding:.2em .5em;background:rgba(0,0,0,var(--ubg));border-radius:.5em;margin-bottom:.35em;align-self:flex-start}
.ucw .uc-ch svg,.ucw .uc-rh svg{width:1.2em;height:1.2em}
/* ===== التصاميم ===== */
.ucd-glass .uc-m{background:linear-gradient(135deg,rgba(255,255,255,calc(var(--ubg)*.32)),rgba(255,255,255,calc(var(--ubg)*.1)));border:1px solid #ffffff40;border-radius:calc(var(--ufs)*.8);backdrop-filter:blur(8px)}
.ucd-neon .uc-m{background:rgba(5,6,14,var(--ubg));border:calc(var(--ufs)*.08) solid var(--pc);border-radius:calc(var(--ufs)*.6);box-shadow:0 0 calc(var(--ufs)*.5) var(--pc),inset 0 0 calc(var(--ufs)*.5) color-mix(in srgb,var(--pc) 35%,transparent)}
.ucd-neon .uc-n{text-shadow:0 0 6px var(--pc)}
.ucd-royal .uc-m{background:linear-gradient(180deg,rgba(42,29,7,var(--ubg)),rgba(15,10,2,var(--ubg)));border:calc(var(--ufs)*.07) solid #e8b84a;box-shadow:0 0 0 calc(var(--ufs)*.05) #0d0902,0 0 0 calc(var(--ufs)*.11) #a8761e;border-radius:calc(var(--ufs)*.3)}
.ucd-royal .uc-m::before{content:"♛";position:absolute;left:calc(var(--ufs)*.4);top:calc(var(--ufs)*.1);color:#e8b84a;font-size:calc(var(--ufs)*.75);opacity:.8}
.ucd-royal .uc-n{color:var(--unc,#fde68a)}
.ucd-gaming .uc-m{background:linear-gradient(90deg,rgba(10,15,28,var(--ubg)),rgba(13,20,38,calc(var(--ubg)*1.2)));clip-path:polygon(0 0,calc(100% - var(--ufs)*.6) 0,100% calc(var(--ufs)*.6),100% 100%,calc(var(--ufs)*.6) 100%,0 calc(100% - var(--ufs)*.6));border-right:calc(var(--ufs)*.25) solid var(--pc)}
.ucd-gaming .uc-n{text-transform:uppercase;letter-spacing:.04em}
.ucd-floating .uc-m{background:none;padding:calc(var(--ufs)*.15) 0;text-shadow:0 2px 4px #000,0 0 8px #000c}
.ucd-floating .uc-m{animation:uc-float 6s ease-in-out infinite alternate}
@keyframes uc-float{from{transform:translateY(0)}to{transform:translateY(-4%)}}
.ucd-floating .uc-av{box-shadow:0 0 0 2px var(--pc)}
.ucd-minimal .uc-m{background:rgba(0,0,0,calc(var(--ubg)*.6));border-radius:calc(var(--ufs)*.25);padding:calc(var(--ufs)*.2) calc(var(--ufs)*.5);align-items:center}
.ucd-minimal .uc-b{display:flex;gap:.35em;align-items:baseline;min-width:0}.ucd-minimal .uc-h{flex:none;font-size:var(--ufs)}.ucd-minimal .uc-sep{display:inline}
.ucd-minimal .uc-av{width:calc(var(--ufs)*1.3);height:calc(var(--ufs)*1.3)}
.ucd-cyber .uc-m{background:linear-gradient(90deg,rgba(0,20,30,var(--ubg)),rgba(20,0,40,var(--ubg)));border-top:1px solid #22d3ee;border-bottom:1px solid #f0abfc;clip-path:polygon(calc(var(--ufs)*.5) 0,100% 0,100% calc(100% - var(--ufs)*.5),calc(100% - var(--ufs)*.5) 100%,0 100%,0 calc(var(--ufs)*.5))}
.ucd-cyber .uc-m::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 3px,#22d3ee10 3px 4px);pointer-events:none}
.ucd-cyber .uc-n{color:var(--unc,#22d3ee)}.ucd-cyber .uc-t{font-family:"Orbitron","Readex Pro",sans-serif;font-size:.92em}
.ucd-diamond .uc-m{background:linear-gradient(135deg,rgba(11,34,64,var(--ubg)),rgba(5,15,31,var(--ubg)));border:1px solid #cfefff;clip-path:polygon(3% 0,97% 0,100% 30%,100% 70%,97% 100%,3% 100%,0 70%,0 30%);box-shadow:inset 0 0 calc(var(--ufs)*.6) #8fd8ff55}
.ucd-diamond .uc-n{color:var(--unc,#bfe9ff)}
.ucd-saudi .uc-m{background:linear-gradient(90deg,rgba(0,84,48,var(--ubg)),rgba(0,40,24,var(--ubg)));border:calc(var(--ufs)*.06) solid #c9a227;border-radius:calc(var(--ufs)*.5)}
.ucd-saudi .uc-m::before{content:"";position:absolute;inset:auto 0 0 0;height:calc(var(--ufs)*.22);background:repeating-linear-gradient(90deg,#c9a227 0 6px,transparent 6px 10px,#c9a22788 10px 12px,transparent 12px 16px);opacity:.7}
.ucd-saudi .uc-n{color:var(--unc,#fde68a)}
.ucd-b6o6 .uc-m{background:linear-gradient(135deg,rgba(10,99,255,calc(var(--ubg)*.55)),rgba(6,17,31,var(--ubg)));border:1px solid #9fc3ff;border-radius:calc(var(--ufs)*.9) calc(var(--ufs)*.2) calc(var(--ufs)*.9) calc(var(--ufs)*.2);box-shadow:0 0 calc(var(--ufs)*.5) #0a63ff66}
.ucd-b6o6 .uc-n{color:var(--unc,#e8f1ff)}
.ucd-bubble .uc-m{background:none;padding:0;align-items:flex-end}
.ucd-bubble .uc-b{background:rgba(255,255,255,calc(.85*var(--ubg)/.55));color:#111;border-radius:calc(var(--ufs)*1) calc(var(--ufs)*1) calc(var(--ufs)*1) calc(var(--ufs)*.15);padding:calc(var(--ufs)*.4) calc(var(--ufs)*.7);position:relative;flex:0 1 auto}
.ucd-bubble .uc-t{color:var(--utc,#111)}
.ucd-terminal .uc-m{background:rgba(0,0,0,var(--ubg));font-family:ui-monospace,"Courier New",monospace;border-left:2px solid var(--pc);border-radius:0;padding:calc(var(--ufs)*.2) calc(var(--ufs)*.5);direction:ltr}
.ucd-terminal .uc-av,.ucd-terminal .uc-lg{display:none}.ucd-terminal .uc-tag{display:inline}.ucd-terminal .uc-b{display:flex;gap:.4em}.ucd-terminal .uc-sep{display:inline}.ucd-terminal .uc-t{color:var(--utc,#a3e635)}
.ucd-terminal .uc-h{flex:none;font-size:var(--ufs)}
.ucd-sakura .uc-m{background:linear-gradient(135deg,rgba(255,214,231,calc(var(--ubg)*.4)),rgba(80,20,50,var(--ubg)));border:1px solid #ffb3d1;border-radius:calc(var(--ufs)*1)}.ucd-sakura .uc-m::before{content:"🌸";position:absolute;left:calc(var(--ufs)*.3);top:calc(var(--ufs)*-.1);font-size:calc(var(--ufs)*.8)}.ucd-sakura .uc-n{color:var(--unc,#ffd1e3)}
.ucd-fire .uc-m{background:linear-gradient(90deg,rgba(60,8,0,var(--ubg)),rgba(25,3,0,var(--ubg)));border-bottom:calc(var(--ufs)*.12) solid #ff5a1f;border-radius:calc(var(--ufs)*.4);box-shadow:0 calc(var(--ufs)*.15) calc(var(--ufs)*.5) #ff5a1f55}.ucd-fire .uc-n{color:var(--unc,#ffb347)}
.ucd-space .uc-m{background:radial-gradient(circle at 20% 30%,#ffffff22 0 1px,transparent 2px),radial-gradient(circle at 70% 60%,#ffffff33 0 1px,transparent 2px),linear-gradient(135deg,rgba(25,10,60,var(--ubg)),rgba(5,5,25,var(--ubg)));background-size:40px 30px,55px 40px,100%;border:1px solid #8b5cf6;border-radius:calc(var(--ufs)*.7)}.ucd-space .uc-n{color:var(--unc,#c4b5fd)}
.ucd-paper .uc-m{background:rgba(250,248,240,calc(var(--ubg)*1.6));border-radius:calc(var(--ufs)*.25);box-shadow:0 2px 6px #0006;transform:rotate(-.4deg)}.ucd-paper .uc-m:nth-child(2n){transform:rotate(.4deg)}.ucd-paper .uc-t{color:var(--utc,#1f2937)}.ucd-paper .uc-n{color:var(--unc,#7c2d12)}
.ucd-pixel .uc-m{background:rgba(20,20,40,var(--ubg));border-radius:0;box-shadow:0 calc(var(--ufs)*-.12) 0 #fff,0 calc(var(--ufs)*.12) 0 #fff,calc(var(--ufs)*-.12) 0 0 #fff,calc(var(--ufs)*.12) 0 0 #fff;margin:calc(var(--ufs)*.15)}.ucd-pixel .uc-n{color:var(--unc,#facc15);font-family:"Orbitron","Readex Pro",monospace}
.ucd-gold .uc-m{background:linear-gradient(180deg,#fde68a,#d4a017 55%,#b8860b);border-radius:calc(var(--ufs)*.3);border:1px solid #fff3c4}.ucd-gold .uc-t{color:var(--utc,#1c1206)}.ucd-gold .uc-n{color:var(--unc,#3b2506)}
.ucd-ocean .uc-m{background:linear-gradient(180deg,rgba(14,116,144,var(--ubg)),rgba(8,47,73,var(--ubg)));border-radius:calc(var(--ufs)*.9) calc(var(--ufs)*.2);border-inline-start:calc(var(--ufs)*.15) solid #67e8f9}.ucd-ocean .uc-n{color:var(--unc,#a5f3fc)}
.ucd-matrix .uc-m{background:rgba(0,10,0,var(--ubg));border:1px solid #16a34a;border-radius:2px}.ucd-matrix .uc-t,.ucd-matrix .uc-n{color:#4ade80;font-family:ui-monospace,monospace}.ucd-matrix .uc-n{color:var(--unc,#bbf7d0)}
.ucd-candy .uc-m{background:rgba(255,255,255,calc(var(--ubg)*1.5));border-radius:calc(var(--ufs)*1.2);border:calc(var(--ufs)*.12) solid transparent;background-image:linear-gradient(#fff,#fff),repeating-linear-gradient(45deg,#f472b6 0 8px,#60a5fa 8px 16px,#facc15 16px 24px);background-origin:border-box;background-clip:padding-box,border-box}.ucd-candy .uc-t{color:var(--utc,#1f2937)}.ucd-candy .uc-n{color:var(--unc,#db2777)}
.ucd-aurora .uc-m{background:linear-gradient(120deg,rgba(16,185,129,calc(var(--ubg)*.6)),rgba(59,130,246,calc(var(--ubg)*.6)),rgba(168,85,247,calc(var(--ubg)*.6)));background-size:300% 100%;animation:uc-aur 8s ease-in-out infinite alternate;border-radius:calc(var(--ufs)*.7)}@keyframes uc-aur{to{background-position:100% 0}}
.ucd-sticker .uc-m{background:var(--pc);border:calc(var(--ufs)*.14) solid #fff;border-radius:calc(var(--ufs)*.8);box-shadow:calc(var(--ufs)*.15) calc(var(--ufs)*.15) 0 #0008}.ucd-sticker .uc-n{color:var(--unc,#fff);text-shadow:0 1px 0 #0006}
.ucd-comic .uc-m{background:#fffbe6;border:calc(var(--ufs)*.12) solid #111;border-radius:calc(var(--ufs)*.4);box-shadow:calc(var(--ufs)*.18) calc(var(--ufs)*.18) 0 #111}.ucd-comic .uc-t{color:var(--utc,#111)}.ucd-comic .uc-n{color:var(--unc,#dc2626);font-weight:900}
.ucd-hud .uc-m{background:rgba(0,15,25,var(--ubg));background-image:linear-gradient(var(--pc),var(--pc)),linear-gradient(var(--pc),var(--pc)),linear-gradient(var(--pc),var(--pc)),linear-gradient(var(--pc),var(--pc));background-size:calc(var(--ufs)*.7) 2px,2px calc(var(--ufs)*.7),calc(var(--ufs)*.7) 2px,2px calc(var(--ufs)*.7);background-position:0 0,0 0,100% 100%,100% 100%;background-repeat:no-repeat;border-radius:0}.ucd-hud .uc-n{color:var(--unc,var(--pc))}
.ucd-royalPurple .uc-m{background:linear-gradient(135deg,rgba(59,7,100,var(--ubg)),rgba(25,3,45,var(--ubg)));border:calc(var(--ufs)*.06) solid #d8b4fe;border-radius:calc(var(--ufs)*.5);box-shadow:inset 0 0 0 calc(var(--ufs)*.12) #3b0764}.ucd-royalPurple .uc-n{color:var(--unc,#e9d5ff)}
.ucd-desert .uc-m{background:linear-gradient(180deg,rgba(120,72,30,var(--ubg)),rgba(70,40,15,var(--ubg)));border-radius:calc(var(--ufs)*.4);border-bottom:calc(var(--ufs)*.2) solid transparent;border-image:repeating-linear-gradient(90deg,#b91c1c 0 6px,#fde68a 6px 9px,#111 9px 12px) 1}.ucd-desert .uc-n{color:var(--unc,#fde68a)}
.ucd-ice .uc-m{background:linear-gradient(135deg,rgba(224,242,254,calc(var(--ubg)*.45)),rgba(56,189,248,calc(var(--ubg)*.25)));border:1px solid #e0f2fe;border-radius:calc(var(--ufs)*.35);backdrop-filter:blur(6px)}.ucd-ice .uc-n{color:var(--unc,#e0f2fe)}
.ucd-ribbon .uc-m{background:rgba(0,0,0,var(--ubg));border-radius:calc(var(--ufs)*.3);padding-top:calc(var(--ufs)*.2)}.ucd-ribbon .uc-n{display:inline-block;background:var(--pc);color:var(--unc,#fff);padding:0 .5em;clip-path:polygon(0 0,100% 0,92% 50%,100% 100%,0 100%)}
.ucd-duck .uc-m{background:linear-gradient(135deg,rgba(255,255,255,calc(var(--ubg)*1.4)),rgba(226,232,240,calc(var(--ubg)*1.4)));border:calc(var(--ufs)*.08) solid #ff9f1a;border-radius:calc(var(--ufs)*.9)}.ucd-duck .uc-m::after{content:"🦆";position:absolute;right:calc(var(--ufs)*.3);bottom:calc(var(--ufs)*-.2);font-size:calc(var(--ufs)*.9)}.ucd-duck .uc-t{color:var(--utc,#111827)}.ucd-duck .uc-n{color:var(--unc,#c2410c)}
`;
