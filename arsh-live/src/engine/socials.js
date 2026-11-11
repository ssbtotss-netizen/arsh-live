// ====== محرك الحسابات المتحركة (حساباتي + حسابات الألعاب) ======
// مستقل عن محرك القوائم والسبثون. التوقيت حتمي من startedAt فكل روابط OBS تعرض نفس الحساب في نفس اللحظة.
// الشعارات: لا نرسم شعارات المنصات أو الألعاب؛ نعرض رمزاً نصياً بلون المنصة، ويستطيع صانع المحتوى رفع الشعار الرسمي.

export const PLATFORMS={
 tiktok:{name:"TikTok",mono:"TT",color:"#fe2c55",url:u=>`https://www.tiktok.com/@${u}`},
 instagram:{name:"Instagram",mono:"IG",color:"#e1306c",url:u=>`https://instagram.com/${u}`},
 snapchat:{name:"Snapchat",mono:"SC",color:"#fffc00",dark:true,url:u=>`https://snapchat.com/add/${u}`},
 youtube:{name:"YouTube",mono:"YT",color:"#ff0033",url:u=>`https://youtube.com/@${u}`},
 twitch:{name:"Twitch",mono:"TW",color:"#9146ff",url:u=>`https://twitch.tv/${u}`},
 kick:{name:"Kick",mono:"K",color:"#53fc18",dark:true,url:u=>`https://kick.com/${u}`},
 x:{name:"X",mono:"X",color:"#e7e9ea",dark:true,url:u=>`https://x.com/${u}`},
 facebook:{name:"Facebook",mono:"FB",color:"#1877f2",url:u=>`https://facebook.com/${u}`},
 discord:{name:"Discord",mono:"DC",color:"#5865f2",url:u=>u.startsWith("http")?u:`https://discord.gg/${u}`},
 telegram:{name:"Telegram",mono:"TG",color:"#229ed9",url:u=>`https://t.me/${u}`},
 whatsapp:{name:"WhatsApp Channel",mono:"WA",color:"#25d366",url:u=>u},
 threads:{name:"Threads",mono:"TH",color:"#f5f5f5",dark:true,url:u=>`https://threads.net/@${u}`},
 custom:{name:"منصة مخصصة",mono:"★",color:"#2f7bff",url:u=>u},
};
// لكل لعبة حقولها وصيغة معرّفها — لا نفترض صيغة واحدة لكل الألعاب
export const GAMES={
 roblox:{name:"Roblox",mono:"RB",color:"#e2231a",fields:[["username","اسم المستخدم"],["display","الاسم الظاهر"],["url","رابط الملف الشخصي"]],id:f=>"@"+(f.username||"")},
 cod:{name:"Call of Duty",mono:"COD",color:"#9aa3ad",fields:[["activision","Activision ID (مثل B6O6#1234567)"],["player","اسم اللاعب"]],id:f=>f.activision||f.player},
 warzone:{name:"Call of Duty: Warzone",mono:"WZ",color:"#c7f000",dark:true,fields:[["activision","Activision ID"],["player","اسم اللاعب"]],id:f=>f.activision||f.player},
 codm:{name:"Call of Duty: Mobile",mono:"CODM",color:"#f5a623",dark:true,fields:[["player","اسم اللاعب"],["uid","UID"]],id:f=>(f.player||"")+(f.uid?` · UID ${f.uid}`:"")},
 fortnite:{name:"Fortnite",mono:"FN",color:"#7b5cff",fields:[["epic","Epic Games Display Name"],["player","اسم اللاعب الظاهر"]],id:f=>f.epic||f.player},
 pubgm:{name:"PUBG Mobile",mono:"PUBGM",color:"#f2a900",dark:true,fields:[["player","اسم اللاعب"],["pid","Player ID"]],id:f=>(f.player||"")+(f.pid?` · ID ${f.pid}`:"")},
 pubg:{name:"PUBG: BATTLEGROUNDS",mono:"PUBG",color:"#f2a900",dark:true,fields:[["player","اسم اللاعب"],["platform","المنصة (Steam / Xbox / PS)"]],id:f=>f.player},
 rocketleague:{name:"Rocket League",mono:"RL",color:"#1e90ff",fields:[["epic","Epic ID"],["platform","المنصة"]],id:f=>f.epic},
 valorant:{name:"Valorant",mono:"VAL",color:"#ff4655",fields:[["riot","Riot ID"],["tag","Tagline (بدون #)"]],id:f=>(f.riot||"")+(f.tag?"#"+String(f.tag).replace(/^#/,""):"")},
 minecraft:{name:"Minecraft",mono:"MC",color:"#62b13a",fields:[["username","Java Username أو Bedrock Gamertag"],["edition","النسخة (Java / Bedrock)"]],id:f=>(f.username||"")+(f.edition?` · ${f.edition}`:"")},
 eafc:{name:"EA SPORTS FC",mono:"FC",color:"#00e676",dark:true,fields:[["ea","EA ID"],["platform","المنصة"]],id:f=>f.ea},
 gta:{name:"GTA Online",mono:"GTA",color:"#57b846",fields:[["social","Rockstar Social Club"],["platform","المنصة"]],id:f=>f.social},
 apex:{name:"Apex Legends",mono:"APEX",color:"#da292a",fields:[["ea","EA ID"],["platform","المنصة"]],id:f=>f.ea},
 r6:{name:"Rainbow Six Siege",mono:"R6",color:"#c9d6e3",dark:true,fields:[["ubisoft","Ubisoft Connect"],["platform","المنصة"]],id:f=>f.ubisoft},
 customGame:{name:"لعبة مخصصة",mono:"🎮",color:"#2f7bff",fields:[["game","اسم اللعبة"],["gid","المعرّف"]],id:f=>f.gid},
};
export const SOCIAL_DESIGNS_OLD=[
 {id:"elite",name:"B6O6 Chrome Elite",shape:"pill"},{id:"neon",name:"Social Neon",shape:"box"},{id:"royal",name:"Royal Social",shape:"box"},
 {id:"glass",name:"Glass Social",shape:"pill"},{id:"cyber",name:"Cyber HUD",shape:"hud"},{id:"diamond",name:"Diamond Social",shape:"facet"},
 {id:"rgb",name:"RGB Social",shape:"box"},{id:"minimal",name:"Minimal Social",shape:"bare"},{id:"ribbon",name:"Social Ribbon",shape:"ribbon"},
 {id:"card",name:"Social Card",shape:"card"},{id:"spot",name:"Social Spotlight",shape:"spot"},{id:"gamer",name:"Gaming Card",shape:"gcard"},
];
export const newAccount=(kind="social",o={})=>Object.assign({id:"ac_"+Math.random().toString(36).slice(2,9),kind,platform:kind==="game"?"roblox":"instagram",username:"",url:"",display:"",color:"",desc:"",logo:"",avatar:"",fields:{},enabled:true},o);
export function defaultSocials(){
 return {accounts:[newAccount("social",{platform:"tiktok",username:"b6o6"}),newAccount("social",{platform:"instagram",username:"b6s61"}),newAccount("social",{platform:"snapchat",username:"b6o6"}),newAccount("game",{platform:"roblox",fields:{username:"B6O6"}}),newAccount("game",{platform:"cod",fields:{activision:"B6O6#1234567"}})],
  rotation:{...ROT_DEFAULTS,startedAt:Date.now()},templates:[]};
}
/** نص العرض لأي حساب حسب منصته أو لعبته */
export function accountView(a){
 const isG=a.kind==="game", P=isG?(GAMES[a.platform]||GAMES.customGame):(PLATFORMS[a.platform]||PLATFORMS.custom);
 const f=a.fields||{};
 const platform=isG?(a.platform==="customGame"?(f.game||P.name):P.name):(a.platform==="custom"?(a.display||P.name):P.name);
 let user=isG?(P.id(f)||""):(a.username?(["discord","whatsapp","custom"].includes(a.platform)&&a.username.includes("/")?a.username:"@"+String(a.username).replace(/^@/,"")):"");
 const title=isG?(f.display||f.player||""):(a.display||"");
 return {platform,user,title,mono:P.mono,color:a.color||P.color,dark:!a.color&&!!P.dark,logo:a.logo||"",avatar:a.avatar||"",kind:a.kind};
}

// ================= محرك التناوب (Social Rotation Engine) =================
// كل خانة = دخول ← ظهور ← خروج ← انتظار. الحساب التالي لا يبدأ قبل انتهاء خروج السابق.
// التوقيت حتمي من startedAt (توقيت الخادم) فكل روابط OBS تعرض نفس الحساب ونفس المرحلة في نفس اللحظة.
export const ROT_DEFAULTS={running:true,startedAt:0,pausedAt:0,order:"list",loop:true,filter:"all",showSec:5,enterMs:600,exitMs:500,gapMs:300,enter:"slideRight",exit:"slideOutLeft",idle:["sweep"],items:[]};
export function migrateRotation(R){ const o=Object.assign({},ROT_DEFAULTS,R||{});
 if(R&&R.gapMs===undefined&&R.gapSec!==undefined) o.gapMs=Math.round(R.gapSec*1000);
 if(o.exit&&!EXITS[o.exit]) o.exit=EXIT_OF[o.exit]||"slideOutLeft"; if(!ENTRANCES[o.enter]) o.enter="slideRight";
 if(!Array.isArray(o.idle)) o.idle=["sweep"]; return o }
function mulberry(a){ return ()=>{ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296 } }
/** الخانات بالترتيب (ترتيب المستخدم، أو كل الحسابات المفعّلة، أو عشوائي ثابت لكل دورة) */
export function rotationSlots(S,cycle=0){
 const R=migrateRotation(S.rotation), acc=(S.accounts||[]).filter(a=>a.enabled!==false);
 const ok=a=>R.filter==="all"||(R.filter==="social"?a.kind==="social":a.kind==="game");
 const base=R.items&&R.items.length?R.items.filter(it=>it.enabled!==false):acc.filter(ok).map(a=>({accountId:a.id}));
 let list=base.map(it=>{ const a=acc.find(x=>x.id===it.accountId); if(!a||!ok(a)) return null; const st=a.style||{};
  return {accountId:a.id,enter:it.enter||st.enter||R.enter,exit:it.exit||st.exit||R.exit,enterMs:Math.max(0,+R.enterMs),showMs:Math.max(500,(+(it.showSec||R.showSec))*1000),exitMs:Math.max(0,+R.exitMs),gapMs:Math.max(0,+R.gapMs)} }).filter(Boolean);
 if(R.order==="random"&&list.length>1){ const rnd=mulberry((R.startedAt|0)+cycle*7919); for(let i=list.length-1;i>0;i--){ const j=Math.floor(rnd()*(i+1)); [list[i],list[j]]=[list[j],list[i]] } }
 return list.map(x=>({...x,dur:x.enterMs+x.showMs+x.exitMs+x.gapMs}));
}
/** الحالة الآن: entering | visible | exiting | waiting | paused */
export function rotationState(S,now){
 const R=migrateRotation(S.rotation); if(!R.running||!R.startedAt) return null;
 const paused=!!R.pausedAt, eff=paused?R.pausedAt:now;
 const slots0=rotationSlots(S,0); if(!slots0.length) return null;
 const total=slots0.reduce((a,x)=>a+x.dur,0); if(total<=0) return null;
 let t=eff-R.startedAt; if(t<0) t=0;
 if(!R.loop&&t>=total) return null;
 const cycle=Math.floor(t/total); let off=t-cycle*total; const slots=R.order==="random"?rotationSlots(S,cycle):slots0;
 for(let i=0;i<slots.length;i++){ const x=slots[i];
  const ph=[["entering",x.enterMs],["visible",x.showMs],["exiting",x.exitMs],["waiting",x.gapMs]];
  for(const [name,d] of ph){ if(off<d){ return {...x,index:i,count:slots.length,cycle,key:x.accountId+"#"+cycle+"#"+i,phase:paused?"paused":name,realPhase:name,elapsed:off,phaseLeft:d-off} } off-=d } }
 return null;
}
/** الانتقال للحساب التالي/السابق يدوياً (يُزاح وقت البدء فتتزامن كل الروابط) */
export function rotationJump(S,now,dir){
 const R=S.rotation; const st=rotationState(S,now); if(!st) return;
 const eff=R.pausedAt||now, slots=rotationSlots(S,st.cycle), total=slots.reduce((a,x)=>a+x.dur,0);
 let target=st.index+dir, cyc=st.cycle; if(target>=slots.length){ target=0; cyc++ } if(target<0){ target=slots.length-1; cyc=Math.max(0,cyc-1) }
 let startOff=cyc*total; for(let i=0;i<target;i++) startOff+=slots[i].dur;
 R.startedAt=eff-startOff;
}
export function rotationPause(S,now){ const R=S.rotation; if(R.running&&!R.pausedAt) R.pausedAt=now }
export function rotationResume(S,now){ const R=S.rotation; if(R.pausedAt){ R.startedAt+=now-R.pausedAt; R.pausedAt=0 } R.running=true; if(!R.startedAt) R.startedAt=now }
export function rotationRestart(S,now){ const R=S.rotation; R.running=true; R.pausedAt=0; R.startedAt=now }

// ================= الحركات =================
// تحويلات وشفافية وclip-path وfilter فقط — خفيفة على مصدر المتصفح في OBS
const K=(...f)=>f;
export const ENTRANCES={
 slideRight:{name:"دخول من اليمين",k:K({transform:"translateX(110%)",opacity:0},{transform:"none",opacity:1}),e:"cubic-bezier(.2,.9,.2,1)"},
 slideLeft:{name:"دخول من اليسار",k:K({transform:"translateX(-110%)",opacity:0},{transform:"none",opacity:1}),e:"cubic-bezier(.2,.9,.2,1)"},
 slideDown:{name:"دخول من الأعلى",k:K({transform:"translateY(-110%)",opacity:0},{transform:"none",opacity:1}),e:"cubic-bezier(.2,.9,.2,1)"},
 slideUp:{name:"دخول من الأسفل",k:K({transform:"translateY(110%)",opacity:0},{transform:"none",opacity:1}),e:"cubic-bezier(.2,.9,.2,1)"},
 fade:{name:"ظهور تدريجي",k:K({opacity:0},{opacity:1}),e:"ease"},
 zoomIn:{name:"تكبير تدريجي",k:K({transform:"scale(.4)",opacity:0},{transform:"scale(1.05)",opacity:1,offset:.75},{transform:"none",opacity:1}),e:"ease-out"},
 zoomOut:{name:"تصغير تدريجي",k:K({transform:"scale(1.5)",opacity:0},{transform:"none",opacity:1}),e:"ease-out"},
 slideBounce:{name:"انزلاق مع ارتداد خفيف",k:K({transform:"translateX(110%)",opacity:0},{transform:"translateX(-6%)",opacity:1,offset:.7},{transform:"translateX(2%)",offset:.88},{transform:"none",opacity:1}),e:"ease-out"},
 flip3d:{name:"دوران ثلاثي الأبعاد",k:K({transform:"perspective(900px) rotateY(95deg)",opacity:0},{transform:"perspective(900px) rotateY(-10deg)",opacity:1,offset:.75},{transform:"perspective(900px) rotateY(0)",opacity:1}),e:"ease-out"},
 glass:{name:"ظهور زجاجي",k:K({opacity:0,filter:"blur(10px) brightness(1.6)",transform:"scale(1.06)"},{opacity:1,filter:"none",transform:"none"}),e:"ease-out"},
 neon:{name:"ظهور نيون",k:K({opacity:0,filter:"brightness(3) blur(6px)"},{opacity:1,filter:"brightness(2)",offset:.35},{opacity:.35,offset:.45},{opacity:1,offset:.55},{opacity:.7,offset:.65},{opacity:1,filter:"none"}),e:"linear"},
 lightLine:{name:"ظهور بخط ضوئي",k:K({clipPath:"inset(48% 0 48% 0)",opacity:1,filter:"brightness(2.5)"},{clipPath:"inset(48% 0 48% 0)",offset:.3,filter:"brightness(2.5)"},{clipPath:"inset(0 0 0 0)",filter:"none"}),e:"cubic-bezier(.6,0,.2,1)"},
 frameGrow:{name:"ظهور بتوسع الإطار",k:K({transform:"scaleX(.15)",opacity:0},{transform:"scaleX(1.03)",opacity:1,offset:.7},{transform:"none"}),e:"cubic-bezier(.2,.9,.2,1)"},
 center:{name:"ظهور من المنتصف",k:K({clipPath:"inset(0 50% 0 50%)"},{clipPath:"inset(0 0 0 0)"}),e:"cubic-bezier(.6,0,.2,1)"},
 sweepIn:{name:"ظهور مع لمعة بيضاء",k:K({clipPath:"inset(0 0 0 100%)",opacity:1},{clipPath:"inset(0 0 0 0)",opacity:1}),e:"cubic-bezier(.6,0,.2,1)",sweep:true},
 holo:{name:"ظهور بتأثير هولوغرام",k:K({opacity:0,filter:"hue-rotate(90deg) brightness(1.8)",transform:"translateY(6%) skewX(-6deg)"},{opacity:.6,offset:.4},{opacity:.25,offset:.5},{opacity:1,filter:"none",transform:"none"}),e:"ease-out"},
 glitchSoft:{name:"Glitch خفيف",k:K({opacity:0,transform:"translateX(-4%)",filter:"hue-rotate(90deg)"},{opacity:1,transform:"translateX(3%)",offset:.3},{opacity:.6,transform:"translateX(-2%)",offset:.5},{opacity:1,transform:"translateX(1%)",offset:.7},{opacity:1,transform:"none",filter:"none"}),e:"steps(1)"},
 whiteLine:{name:"ظهور مع خط أبيض متحرك",k:K({clipPath:"inset(0 100% 0 0)"},{clipPath:"inset(0 0 0 0)"}),e:"cubic-bezier(.6,0,.2,1)",trail:true},
 borderDraw:{name:"رسم حدود البطاقة",parts:"border",e:"ease-out"},
 logoFirst:{name:"انتقال الشعار أولاً",parts:"logoFirst",e:"ease-out"},
 letters:{name:"ظهور النص حرفاً حرفاً",parts:"letters",e:"ease-out"},
 logoThenName:{name:"الشعار ثم اسم الحساب",parts:"logoThenName",e:"ease-out"},
 liquid:{name:"Liquid Glass",k:K({opacity:0,filter:"blur(14px) saturate(1.8)",transform:"scale(1.12,.85)"},{opacity:1,transform:"scale(.97,1.03)",offset:.6},{filter:"none",transform:"none",opacity:1}),e:"ease-out"},
 gradientLight:{name:"ظهور مع إضاءة متدرجة",k:K({opacity:0,filter:"brightness(3) saturate(0)"},{opacity:1,filter:"brightness(1.6) saturate(.6)",offset:.5},{opacity:1,filter:"none"}),e:"ease-out"},
 flip3dX:{name:"3D Flip عمودي",k:K({transform:"perspective(800px) rotateX(-90deg)",opacity:0},{transform:"perspective(800px) rotateX(10deg)",opacity:1,offset:.75},{transform:"none",opacity:1}),e:"ease-out"},
 softBounce:{name:"Soft Bounce",k:K({transform:"translateY(-60%) scale(.9)",opacity:0},{transform:"translateY(6%)",opacity:1,offset:.6},{transform:"translateY(-2%)",offset:.82},{transform:"none",opacity:1}),e:"ease-out"},
 blur:{name:"Blur Reveal",k:K({opacity:0,filter:"blur(18px)"},{opacity:1,filter:"none"}),e:"ease-out"},
 mask:{name:"Mask Reveal",k:K({clipPath:"circle(0% at 85% 50%)"},{clipPath:"circle(150% at 85% 50%)"}),e:"cubic-bezier(.6,0,.2,1)"},
 lightTrail:{name:"Light Trail",k:K({clipPath:"inset(0 0 0 100%)",filter:"brightness(2.2)"},{clipPath:"inset(0 0 0 0)",filter:"brightness(1.4)",offset:.7},{filter:"none"}),e:"cubic-bezier(.6,0,.2,1)",trail:true},
 premium:{name:"B6O6 Premium",k:K({opacity:0,transform:"perspective(900px) rotateX(18deg) scale(.86)",filter:"blur(8px) brightness(1.8)"},{opacity:1,transform:"perspective(900px) rotateX(-4deg) scale(1.03)",filter:"blur(0) brightness(1.3)",offset:.65},{transform:"none",filter:"none",opacity:1}),e:"cubic-bezier(.2,.9,.2,1)",sweep:true},
 // أسماء قديمة محفوظة للتوافق
 bounce:{name:"دخول مع ارتداد",k:K({transform:"translateY(-130%)",opacity:0},{transform:"translateY(10%)",opacity:1,offset:.55},{transform:"translateY(-5%)",offset:.75},{transform:"none",opacity:1}),e:"ease-out",legacy:true},
 glitch:{name:"Glitch",k:K({opacity:0,transform:"translateX(-8%) skewX(25deg)",filter:"hue-rotate(120deg)"},{opacity:1,transform:"translateX(6%) skewX(-18deg)",offset:.25},{opacity:.4,offset:.4},{opacity:1,transform:"none",filter:"none"}),e:"steps(1)",legacy:true},
 rotate:{name:"دوران",k:K({transform:"rotate(-200deg) scale(.4)",opacity:0},{transform:"none",opacity:1}),e:"ease-out",legacy:true},
 sweep:{name:"مرور ضوء",k:K({clipPath:"inset(0 0 0 100%)"},{clipPath:"inset(0 0 0 0)"}),e:"ease-out",sweep:true,legacy:true},
 split:{name:"انقسام وظهور",k:K({clipPath:"inset(50% 0 50% 0)",opacity:.4},{clipPath:"inset(0 0 0 0)",opacity:1}),e:"ease-out",legacy:true},
};
export const EXITS={
 slideOutRight:{name:"خروج لليمين",k:K({transform:"none",opacity:1},{transform:"translateX(110%)",opacity:0}),e:"ease-in"},
 slideOutLeft:{name:"خروج لليسار",k:K({transform:"none",opacity:1},{transform:"translateX(-110%)",opacity:0}),e:"ease-in"},
 slideOutUp:{name:"خروج للأعلى",k:K({transform:"none",opacity:1},{transform:"translateY(-110%)",opacity:0}),e:"ease-in"},
 slideOutDown:{name:"خروج للأسفل",k:K({transform:"none",opacity:1},{transform:"translateY(110%)",opacity:0}),e:"ease-in"},
 fadeOut:{name:"اختفاء تدريجي",k:K({opacity:1},{opacity:0}),e:"ease"},
 zoomAway:{name:"تصغير واختفاء",k:K({transform:"none",opacity:1},{transform:"scale(.3)",opacity:0}),e:"ease-in"},
 shrink:{name:"انكماش البطاقة",k:K({transform:"none"},{transform:"scaleX(1.04)",offset:.25},{transform:"scaleX(0)",opacity:.6}),e:"cubic-bezier(.6,0,.4,1)"},
 sweepOut:{name:"خروج مع لمعة",k:K({clipPath:"inset(0 0 0 0)"},{clipPath:"inset(0 100% 0 0)"}),e:"cubic-bezier(.6,0,.2,1)",sweep:true},
 blurOut:{name:"خروج بتأثير Blur",k:K({opacity:1,filter:"none"},{opacity:0,filter:"blur(16px)"}),e:"ease-in"},
 glitchOut:{name:"خروج Glitch",k:K({opacity:1,transform:"none"},{opacity:.5,transform:"translateX(4%) skewX(12deg)",filter:"hue-rotate(90deg)",offset:.3},{opacity:1,transform:"translateX(-3%)",offset:.5},{opacity:.3,transform:"translateX(2%)",offset:.75},{opacity:0,transform:"none"}),e:"steps(1)"},
 maskOut:{name:"خروج Mask",k:K({clipPath:"circle(150% at 15% 50%)"},{clipPath:"circle(0% at 15% 50%)"}),e:"cubic-bezier(.6,0,.2,1)"},
 trailOut:{name:"خروج Light Trail",k:K({clipPath:"inset(0 0 0 0)",filter:"none"},{clipPath:"inset(0 100% 0 0)",filter:"brightness(2)"}),e:"cubic-bezier(.6,0,.2,1)",trail:true},
 rotateOut:{name:"خروج بدوران خفيف",k:K({transform:"none",opacity:1},{transform:"rotate(-8deg) translateY(30%) scale(.85)",opacity:0}),e:"ease-in"},
 frameFade:{name:"تلاشي الإطار",parts:"frameFade",e:"ease-in"},
 disassemble:{name:"تفكك العناصر",parts:"disassemble",e:"ease-in"},
 holoOut:{name:"خروج هولوغرام",k:K({opacity:1,filter:"none"},{opacity:.3,filter:"hue-rotate(90deg) brightness(1.8)",offset:.3},{opacity:.8,offset:.45},{opacity:0,transform:"translateY(-6%) skewX(6deg)",filter:"hue-rotate(160deg)"}),e:"linear"},
 softSlide:{name:"انزلاق ناعم",k:K({transform:"none",opacity:1},{transform:"translateX(-30%)",opacity:0}),e:"cubic-bezier(.4,0,.2,1)"},
 glassOut:{name:"خروج زجاجي",k:K({opacity:1,filter:"none",transform:"none"},{opacity:0,filter:"blur(12px) brightness(1.6)",transform:"scale(1.08)"}),e:"ease-in"},
 premiumFade:{name:"Premium Fade",k:K({opacity:1,filter:"none",transform:"none"},{opacity:.8,filter:"brightness(1.8)",transform:"scale(1.03)",offset:.35},{opacity:0,filter:"brightness(2.5) blur(4px)",transform:"scale(1.06)"}),e:"ease-in"},
 signatureOut:{name:"B6O6 Signature",k:K({clipPath:"inset(0 0 0 0)",transform:"none"},{clipPath:"inset(0 0 0 0)",transform:"scaleY(.12)",offset:.45},{clipPath:"inset(0 50% 0 50%)",transform:"scaleY(.12)",opacity:.8}),e:"cubic-bezier(.6,0,.2,1)",sweep:true},
};
export const EXIT_OF={slideRight:"slideOutRight",slideLeft:"slideOutLeft",slideUp:"slideOutDown",slideDown:"slideOutUp",zoomIn:"zoomAway",zoomOut:"fadeOut",fade:"fadeOut",flip3d:"fadeOut",rotate:"rotateOut",bounce:"slideOutUp",glitch:"glitchOut",neon:"fadeOut",sweep:"sweepOut",split:"maskOut"};
// حركات أثناء الظهور (يمكن دمج حركتين)
export const IDLES={
 sweep:{name:"White Sweep — لمعة",js:true},float:{name:"Floating — طفو"},border:{name:"Border Flow — إطار متحرك"},glow:{name:"Soft Glow — توهج"},
 logoPulse:{name:"Logo Pulse — نبض الشعار"},gradient:{name:"Gradient Motion — تدرج متحرك"},shineEdge:{name:"Shine Edge — لمعة الأطراف"},
 reflect:{name:"Light Reflection — انعكاس"},tilt:{name:"Micro Tilt — ميلان"},textReveal:{name:"Text Reveal — ظهور النص"},
};
export const SWEEP_COLORS={white:{name:"أبيض",c:"255,255,255"},gold:{name:"ذهبي",c:"255,214,120"},silver:{name:"فضي",c:"214,224,236"},blue:{name:"أزرق",c:"120,180,255"}};
export const SWEEP_DEFAULTS={color:"white",dir:"rtl",speedMs:1300,every:4,width:22,angle:18,strength:.55,repeat:0};

// ================= 50 تصميماً للحسابات =================
// كل تصميم = شكل (sh) + توزيع (ly) + شكل الشعار (lg) + خلفية (bg) + إطار (bd) + نسبة الارتفاع (hh) + لون النص (un) + مؤثر خاص (fx)
const G={gold:"linear-gradient(135deg,#fff1c1,#b8862b 30%,#f9e29c 50%,#7a5512 75%,#ffe9a8)",chrome:"linear-gradient(180deg,#f8fafc,#94a3b8 45%,#e2e8f0 55%,#64748b)",blue:"linear-gradient(135deg,#dbe8ff,#2f7bff 35%,#0b2a7a 60%,#6aa8ff)",
 dark:"linear-gradient(180deg,#0d1220f2,#04060cf4)",black:"linear-gradient(180deg,#141414f5,#050505f8)",rgb:"linear-gradient(90deg,#ff004c,#ffcc00,#00ff88,#00c3ff,#a100ff,#ff004c)"};
export const SOCIAL_DESIGNS=[
 // فاخرة
 {id:"royalGold",name:"Royal Gold — ذهبي ملكي",g:"luxury",sh:"round",ly:"row",lg:"circle",bg:"linear-gradient(180deg,#1b1306f2,#0a0703f5)",bdg:G.gold,bw:.05,un:"#ffe39a",pf:"#f5d27a",hh:1,glow:"#e8c46a66",fx:"crown"},
 {id:"silverChrome",name:"Silver Chrome — فضي كرومي",g:"luxury",sh:"pill",ly:"end",lg:"ring",bg:"linear-gradient(180deg,#1e293bf2,#0b1220f5)",bdg:G.chrome,bw:.06,un:"#f1f5f9",unGrad:"linear-gradient(180deg,#fff,#94a3b8)",hh:.86,glow:"#cbd5e155"},
 {id:"blackDiamond",name:"Black Diamond — ألماس أسود",g:"luxury",sh:"hex",ly:"row",lg:"diamond",bg:"conic-gradient(from 210deg at 70% 40%,#1a1a1a,#3a3a3a 12%,#0a0a0a 24%,#2b2b2b 40%,#050505 60%,#262626 80%,#0d0d0d)",un:"#fff",pf:"#a3a3a3",hh:.9,glow:"#ffffff22"},
 {id:"luxuryGlass",name:"Luxury Glass — زجاج فاخر",g:"luxury",sh:"round",ly:"badge",lg:"circle",bg:"linear-gradient(135deg,#ffffff2e,#ffffff0d)",bd:"1px solid #ffffff55",blur:16,un:"#fff",hh:.8,glow:"#0008"},
 {id:"platinum",name:"Platinum — بلاتيني",g:"luxury",sh:"soft",ly:"stack",lg:"square",bg:"linear-gradient(135deg,#e5e7eb,#9ca3af 50%,#f3f4f6)",un:"#111827",pf:"#374151",dark:true,hh:.92,glow:"#00000055"},
 {id:"goldenCrown",name:"Golden Crown — تاج ذهبي",g:"luxury",sh:"tab",ly:"top",lg:"circle",bg:"linear-gradient(180deg,#2a1a03f2,#0f0901f5)",bdg:G.gold,bw:.05,un:"#ffe39a",pf:"#f5d27a",hh:1,glow:"#e8c46a77",fx:"crown"},
 {id:"crystal",name:"Crystal — كريستال",g:"luxury",sh:"hex",ly:"center",lg:"diamond",bg:"linear-gradient(115deg,#e0f7ffee,#93c5fdee 35%,#c4b5fdee 60%,#e0f7ffee)",un:"#0b1630",pf:"#1e3a8a",dark:true,hh:.88,glow:"#93c5fd88"},
 {id:"premiumBlack",name:"Premium Black — أسود فاخر",g:"luxury",sh:"sharp",ly:"split",lg:"block",bg:G.black,bd:"1px solid #ffffff1f",un:"#fff",pf:"#9ca3af",hh:.84,glow:"#000a"},
 {id:"whitePearl",name:"White Pearl — لؤلؤ أبيض",g:"luxury",sh:"pill",ly:"row",lg:"circle",bg:"radial-gradient(ellipse at 30% 20%,#fff,#f1f5f9 40%,#e2e8f0 70%,#f8fafc)",un:"#0f172a",pf:"#64748b",dark:true,hh:.84,glow:"#ffffff66"},
 {id:"titanium",name:"Titanium — تيتانيوم",g:"luxury",sh:"cut",ly:"row",lg:"hex",bg:"repeating-linear-gradient(90deg,#3f4652 0 2px,#4b5361 2px 4px),linear-gradient(180deg,#5b6472,#2d333c)",bgBlend:true,un:"#f8fafc",pf:"#cbd5e1",hh:.9,glow:"#0009"},
 // نيون
 {id:"neonBlue",name:"Neon Blue",g:"neon",sh:"round",ly:"row",lg:"ring",bg:"#020617d9",bd:"2px solid #22d3ee",neon:"#22d3ee",un:"#e0fbff",hh:.86},
 {id:"neonRed",name:"Neon Red",g:"neon",sh:"slant",ly:"end",lg:"square",bg:"#14020599",bd:"2px solid #ff2d55",neon:"#ff2d55",un:"#ffe4ea",hh:.82},
 {id:"neonPurple",name:"Neon Purple",g:"neon",sh:"pill",ly:"badge",lg:"circle",bg:"#0d0420d9",bd:"2px solid #a855f7",neon:"#a855f7",un:"#f3e8ff",hh:.78},
 {id:"neonGreen",name:"Neon Green",g:"neon",sh:"cut",ly:"hud",lg:"plain",bg:"#021407d9",bd:"2px solid #22c55e",neon:"#22c55e",un:"#dcfce7",mono:true,hh:.84},
 {id:"neonPink",name:"Neon Pink",g:"neon",sh:"leaf",ly:"row",lg:"circle",bg:"#1a0414d9",bd:"2px solid #ec4899",neon:"#ec4899",un:"#fce7f3",hh:.86},
 {id:"rgbFlow",name:"RGB Flow",g:"neon",sh:"round",ly:"row",lg:"square",bg:"#08080df2",bdg:G.rgb,bw:.05,anim:"rgbm",un:"#fff",hh:.88},
 {id:"electricBlue",name:"Electric Blue",g:"neon",sh:"notch",ly:"split",lg:"block",bg:"linear-gradient(90deg,#03123a,#0a2a7a)",bd:"2px solid #3b82f6",neon:"#3b82f6",un:"#dbeafe",hh:.86,fx:"bolt"},
 {id:"cyberNeon",name:"Cyber Neon",g:"neon",sh:"cut",ly:"tag",lg:"square",bg:"#0d0221e8",bd:"2px solid #05d9e8",neon:"#ff2a6d",un:"#fcee0a",mono:true,hh:.8},
 {id:"neonOutline",name:"Neon Outline",g:"neon",sh:"pill",ly:"center",lg:"ring",bg:"transparent",bd:"2px solid var(--pc)",neon:"var(--pc)",un:"#fff",hh:.8},
 {id:"neonPulse",name:"Neon Pulse",g:"neon",sh:"round",ly:"row",lg:"circle",bg:"#020617d9",bd:"2px solid var(--pc)",neon:"var(--pc)",un:"#fff",hh:.86,anim:"npulse2"},
 // عصرية
 {id:"minimalWhite",name:"Minimal White",g:"modern",sh:"soft",ly:"row",lg:"square",bg:"#ffffffee",un:"#0f172a",pf:"#64748b",dark:true,hh:.76,glow:"#0003"},
 {id:"minimalDark",name:"Minimal Dark",g:"modern",sh:"soft",ly:"row",lg:"square",bg:"#0b0f17e6",un:"#f8fafc",pf:"#94a3b8",hh:.76,glow:"#0006"},
 {id:"floatingCard",name:"Floating Card",g:"modern",sh:"round",ly:"top",lg:"circle",bg:"linear-gradient(180deg,#111827f2,#0b1020f5)",bd:"1px solid #ffffff22",un:"#fff",hh:1,glow:"#000c",fx:"float"},
 {id:"roundedCapsule",name:"Rounded Capsule",g:"modern",sh:"pill",ly:"split",lg:"block",bg:"#0f172ae6",un:"#fff",hh:.78,glow:"#0008"},
 {id:"socialPill",name:"Social Pill",g:"modern",sh:"pill",ly:"row",lg:"circle",bg:"var(--pc)",un:"#fff",pf:"#ffffffcc",tint:true,hh:.7,glow:"#0007"},
 {id:"glassCapsule",name:"Glass Capsule",g:"modern",sh:"pill",ly:"end",lg:"circle",bg:"#ffffff1c",bd:"1px solid #ffffff45",blur:14,un:"#fff",hh:.76,glow:"#0008"},
 {id:"modernGradient",name:"Modern Gradient",g:"modern",sh:"round",ly:"stack",lg:"square",bg:"linear-gradient(120deg,var(--pc),#1e1b4b 70%)",un:"#fff",hh:.92,glow:"#0008"},
 {id:"softShadow",name:"Soft Shadow",g:"modern",sh:"round",ly:"row",lg:"square",bg:"#1f2937f0",un:"#f9fafb",pf:"#9ca3af",hh:.8,glow:"#000",bigShadow:true},
 {id:"cleanType",name:"Clean Typography",g:"modern",sh:"sharp",ly:"stack",lg:"plain",bg:"transparent",un:"#fff",pf:"var(--pc)",hh:.95,textShadow:true},
 {id:"floatingIsland",name:"Floating Island",g:"modern",sh:"pill",ly:"medal",lg:"circle",bg:"linear-gradient(180deg,#0b1222f2,#05070ff5)",bd:"1px solid #ffffff1c",un:"#fff",hh:.7,glow:"#000a",fx:"float"},
 // احترافية للبث
 {id:"gamingHud",name:"Gaming HUD",g:"pro",sh:"cut",ly:"hud",lg:"hex",bg:"#05080fe6",bd:"0",un:"#e2e8f0",pf:"var(--pc)",mono:true,hh:.9},
 {id:"esportsElite",name:"Esports Elite",g:"pro",sh:"slant",ly:"split",lg:"block",bg:"linear-gradient(90deg,#0a0f1e,#111a33)",bd:"0",un:"#fff",pf:"#94a3b8",hh:.86,stripe:true},
 {id:"streamerPro",name:"Streamer Pro",g:"pro",sh:"round",ly:"tag",lg:"circle",bg:G.dark,bd:"1px solid #ffffff22",un:"#fff",hh:.82,glow:"#0009"},
 {id:"cyberpunk",name:"Cyberpunk",g:"pro",sh:"notch",ly:"row",lg:"square",bg:"#fcee0a",un:"#0d0221",pf:"#ff2a6d",dark:true,mono:true,hh:.86,glitch:true},
 {id:"hologram",name:"Hologram",g:"pro",sh:"round",ly:"center",lg:"ring",bg:"repeating-linear-gradient(0deg,#22d3ee14 0 2px,transparent 2px 5px),#03141ccc",bd:"1px solid #67e8f9aa",un:"#a5f3fc",hh:.86,holo:true},
 {id:"matrix",name:"Digital Matrix",g:"pro",sh:"sharp",ly:"row",lg:"plain",bg:"repeating-linear-gradient(90deg,#00ff4112 0 1px,transparent 1px 9px),#010a03ee",bd:"1px solid #00ff41",un:"#00ff41",mono:true,hh:.84,anim:"matrix"},
 {id:"techFrame",name:"Tech Frame",g:"pro",sh:"hex",ly:"end",lg:"hex",bg:"#0b1020ee",bd:"2px solid #64748b",un:"#e2e8f0",hh:.88,corners:true},
 {id:"futuristic",name:"Futuristic Panel",g:"pro",sh:"cut",ly:"stack",lg:"diamond",bg:"linear-gradient(135deg,#0b1a33f2,#050b18f5)",bd:"1px solid #38bdf866",un:"#e0f2fe",pf:"#38bdf8",hh:.94},
 {id:"streamOverlay",name:"Stream Overlay",g:"pro",sh:"sharp",ly:"split",lg:"block",bg:"#000000c8",un:"#fff",hh:.72,bottomBar:true},
 {id:"b6o6Signature",name:"B6O6 Signature",g:"pro",sh:"pill",ly:"row",lg:"circle",bg:"linear-gradient(180deg,#071026f2,#02040af4)",bdg:G.blue,bw:.05,un:"#fff",unGrad:"linear-gradient(180deg,#fff,#c9d6f2)",hh:.86,glow:"#2f7bff66",fx:"crown"},
 // متحركة خاصة
 {id:"lightSweepCard",name:"Light Sweep Card",g:"anim",sh:"round",ly:"row",lg:"circle",bg:G.dark,bd:"1px solid #ffffff33",un:"#fff",hh:.86,idle:"sweep"},
 {id:"movingBorder",name:"Moving Border",g:"anim",sh:"round",ly:"row",lg:"square",bg:"#070b14f2",un:"#fff",hh:.86,idle:"border"},
 {id:"liquidGlass",name:"Liquid Glass",g:"anim",sh:"pill",ly:"center",lg:"circle",bg:"linear-gradient(120deg,#ffffff26,#ffffff0a,#ffffff26)",bgSize:"300% 100%",anim:"liquid",bd:"1px solid #ffffff50",blur:18,un:"#fff",hh:.8},
 {id:"energyFlow",name:"Energy Flow",g:"anim",sh:"slant",ly:"row",lg:"square",bg:"linear-gradient(90deg,#1e1b4b,var(--pc),#1e1b4b,var(--pc),#1e1b4b)",bgSize:"300% 100%",anim:"flow",un:"#fff",hh:.84},
 {id:"electricLine",name:"Electric Line",g:"anim",sh:"sharp",ly:"stack",lg:"plain",bg:"#050a18e8",un:"#fff",pf:"#60a5fa",hh:.82,eline:true},
 {id:"shimmerCard",name:"Shimmer Card",g:"anim",sh:"round",ly:"top",lg:"circle",bg:"linear-gradient(110deg,#111827 30%,#1f2937 45%,#374151 50%,#1f2937 55%,#111827 70%)",bgSize:"250% 100%",anim:"shimmer",un:"#fff",hh:1},
 {id:"floating3d",name:"3D Floating",g:"anim",sh:"round",ly:"badge",lg:"circle",bg:"linear-gradient(180deg,#1e293bf2,#0f172af5)",bd:"1px solid #ffffff22",un:"#fff",hh:.8,idle:"tilt",bigShadow:true},
 {id:"particleGlow",name:"Particle Glow",g:"anim",sh:"pill",ly:"row",lg:"circle",bg:"radial-gradient(circle,#ffffff55 1px,transparent 1.5px) 0 0/22px 22px,radial-gradient(ellipse at 20% 50%,color-mix(in srgb,var(--pc) 55%,transparent),transparent 60%),#05070fee",anim:"particles",un:"#fff",hh:.84},
 {id:"animatedGradient",name:"Animated Gradient",g:"anim",sh:"round",ly:"end",lg:"square",bg:"linear-gradient(135deg,#ff004c,#a100ff,#00c3ff,#00ff88)",bgSize:"300% 300%",anim:"flow",un:"#fff",hh:.86},
 {id:"ultimate",name:"Ultimate Social",g:"anim",sh:"pill",ly:"medal",lg:"circle",bg:"linear-gradient(180deg,#071026f2,#02040af4)",bdg:G.rgb,bw:.05,anim:"rgbm",un:"#fff",unGrad:"linear-gradient(180deg,#fff,#c9d6f2)",hh:.84,idle:"sweep",fx:"crown"},
];
export const DESIGN_ALIAS={elite:"b6o6Signature",neon:"neonBlue",royal:"royalGold",glass:"glassCapsule",cyber:"cyberNeon",diamond:"blackDiamond",rgb:"rgbFlow",minimal:"minimalDark",ribbon:"esportsElite",card:"floatingCard",spot:"floatingIsland",gamer:"gamingHud"};
export const designOf=id=>SOCIAL_DESIGNS.find(d=>d.id===(DESIGN_ALIAS[id]||id))||SOCIAL_DESIGNS[0];
const SHAPE={pill:"border-radius:999px",round:"border-radius:calc(var(--sh)*.26)",soft:"border-radius:calc(var(--sh)*.12)",sharp:"border-radius:0",tab:"border-radius:calc(var(--sh)*.3) calc(var(--sh)*.3) 4px 4px",leaf:"border-radius:calc(var(--sh)*.5) 4px calc(var(--sh)*.5) 4px",
 cut:"clip-path:polygon(0 0,95% 0,100% 30%,100% 100%,5% 100%,0 70%)",slant:"clip-path:polygon(3% 0,100% 0,97% 100%,0 100%)",hex:"clip-path:polygon(3% 0,97% 0,100% 50%,97% 100%,3% 100%,0 50%)",notch:"clip-path:polygon(0 0,100% 0,100% 100%,7% 100%,0 72%)"};
const LOGO_SHAPE={square:"border-radius:24%",circle:"border-radius:50%",hex:"border-radius:0;clip-path:polygon(25% 3%,75% 3%,100% 50%,75% 97%,25% 97%,0 50%)",diamond:"border-radius:0;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);width:calc(var(--sh)*.78*var(--ls,1))!important;height:calc(var(--sh)*.78*var(--ls,1))!important",
 ring:"border-radius:50%;background:transparent!important;box-shadow:inset 0 0 0 calc(var(--sh)*.05) var(--pc),0 0 12px var(--pc)!important",plain:"background:transparent!important;box-shadow:none!important",block:"border-radius:0;height:100%!important;width:calc(var(--sh)*.95)!important;box-shadow:none!important"};
/** يولّد CSS التصاميم الخمسين مرة واحدة (مشترك بين المحرر وروابط OBS) */
export function socialDesignCSS(){
 let c="";
 for(const d of SOCIAL_DESIGNS){ const S=`.sd-${d.id}`;
  c+=`${S}{--hh:${d.hh};color:${d.un}}`;
  c+=`${S}>.bgx{${SHAPE[d.sh]||""};background:${d.bg};${d.bgSize?`background-size:${d.bgSize};`:""}${d.bdg?`border:calc(var(--sh)*${d.bw}) solid transparent;background:linear-gradient(0deg,#0000,#0000) padding-box,${d.bg} padding-box,${d.bdg} border-box;${d.anim==="rgbm"?"background-size:100% 100%,100% 100%,300% 100%;":""}`:d.bd?`border:${d.bd};`:""}${d.blur?`backdrop-filter:blur(${d.blur}px);-webkit-backdrop-filter:blur(${d.blur}px);`:""}${d.neon?`box-shadow:0 0 14px ${d.neon},inset 0 0 18px color-mix(in srgb,${d.neon} 30%,transparent);`:""}${d.anim&&d.anim!=="npulse2"?`animation:sx-${d.anim} ${d.anim==="matrix"?"6s":"5s"} linear infinite;`:""}${d.anim==="npulse2"?"animation:sx-npulse 2.2s ease-in-out infinite;":""}}`;
  if(d.glow) c+=`${S}{filter:drop-shadow(0 calc(var(--sh)*${d.bigShadow?.18:.06}) calc(var(--sh)*${d.bigShadow?.35:.2}) ${d.glow})}`;
  if(d.unGrad) c+=`${S} .un{background:${d.unGrad};-webkit-background-clip:text;background-clip:text;color:transparent}`;
  else c+=`${S} .un{color:var(--c-un,${d.un})}`;
  if(d.pf) c+=`${S} .pf{color:${d.pf};opacity:1}`;
  if(d.mono) c+=`${S} .un{font-family:"Orbitron","Changa",monospace;letter-spacing:.03em}`;
  if(d.textShadow) c+=`${S} .un,${S} .pf{text-shadow:0 2px 10px #000,0 0 2px #000}`;
  if(d.tint) c+=`${S}>.bgx{background:var(--pc)}${S}.dk .un,${S}.dk .pf{color:#0a0a0a}${S} .lg{background:#0003!important;box-shadow:none!important}`;
  if(d.holo) c+=`${S} .un{text-shadow:-2px 0 #f0abfc,2px 0 #22d3ee,0 0 14px #22d3ee}`;
  if(d.glitch) c+=`${S} .un{text-shadow:2px 0 #ff2a6d,-2px 0 #05d9e8}`;
  if(d.stripe) c+=`${S}>.bgx::after{content:"";position:absolute;inset:auto 0 0 0;height:12%;background:var(--pc)}`;
  if(d.bottomBar) c+=`${S}>.bgx::after{content:"";position:absolute;left:0;right:0;bottom:0;height:8%;background:linear-gradient(90deg,var(--pc),transparent)}`;
  if(d.corners) c+=`${S}::before,${S}::after{content:"";position:absolute;width:calc(var(--sh)*.3);height:calc(var(--sh)*.3);border:3px solid var(--pc);z-index:2}${S}::before{top:-4px;right:-4px;border-left:0;border-bottom:0}${S}::after{bottom:-4px;left:-4px;border-right:0;border-top:0}`;
  if(d.eline) c+=`${S}>.bgx::after{content:"";position:absolute;bottom:0;height:3px;width:35%;background:linear-gradient(90deg,transparent,#60a5fa,#fff,#60a5fa,transparent);animation:sx-eline 2.2s linear infinite;box-shadow:0 0 10px #60a5fa}`;
  if(d.fx==="bolt") c+=`${S} .lg::after{content:"⚡";position:absolute;font-size:calc(var(--sh)*.3);top:-8%;left:-8%;animation:bolt 1.6s steps(1) infinite}`;
  c+=`${S} .lg{${LOGO_SHAPE[d.lg]||""}}`;
 }
 c+=`@keyframes sx-rgbm{to{background-position:0 0,0 0,300% 0}}@keyframes sx-liquid{50%{background-position:100% 0}}@keyframes sx-flow{to{background-position:300% 0}}@keyframes sx-shimmer{from{background-position:120% 0}to{background-position:-120% 0}}@keyframes sx-matrix{to{background-position:0 90px}}@keyframes sx-particles{to{background-position:0 -44px,0 0,0 0}}@keyframes sx-eline{from{left:-35%}to{left:100%}}@keyframes sx-npulse{50%{box-shadow:0 0 26px var(--pc),inset 0 0 22px color-mix(in srgb,var(--pc) 40%,transparent)}}`;
 return c;
}
