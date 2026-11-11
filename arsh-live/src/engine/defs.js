// ====== تعريفات مشتركة: المقاسات، أنواع العناصر، التصاميم، أدوات ======
// \u2066…\u2069 يعزل الأرقام من اتجاه RTL حتى لا تنقلب (1080×1920 كانت تظهر 1920×1080)
/** المقاسات المقبولة في الخادم (الجاهزة + custom:WxH) */
export const canvasValid=c=>/^(vertical|horizontal|square|hd|hdv|custom:\d{3,4}x\d{3,4})$/.test(String(c||""));
export const CANVASES={vertical:{w:1080,h:1920,label:"عمودي \u20661080×1920\u2069"},horizontal:{w:1920,h:1080,label:"أفقي \u20661920×1080\u2069"},square:{w:1080,h:1080,label:"مربع \u20661080×1080\u2069"},hd:{w:1280,h:720,label:"أفقي \u20661280×720\u2069"},hdv:{w:720,h:1280,label:"عمودي \u2066720×1280\u2069"}};
/** مقاس المشهد: المقاسات الجاهزة أو مقاس مخصص يدخله المستخدم (cw×ch) */
export function canvasOf(l){ const m=l&&/^custom:(\d{3,4})x(\d{3,4})$/.exec(String(l.canvas||"")); if(m) l={...l,canvas:"custom",cw:+m[1],ch:+m[2]}; if(l&&l.canvas==="custom"&&l.cw>=200&&l.ch>=200) return {w:Math.min(7680,Math.round(l.cw)),h:Math.min(7680,Math.round(l.ch)),label:`مخصص \u2066${l.cw}×${l.ch}\u2069`}; return CANVASES[l&&l.canvas]||CANVASES.vertical }
// listens: أنواع الأحداث التي تحدّث العنصر — كل عنصر يستقبل نوعه فقط
export const TYPES={
 likes:{label:"قائمة التكبيس",icon:"❤️",title:"أفضل المكبسين",listens:["like"],board:true},
 gifts:{label:"قائمة الدعم",icon:"🎁",title:"أفضل الداعمين",listens:["gift"],board:true},
 comments:{label:"أكثر المعلقين",icon:"💬",title:"أكثر المعلقين",listens:["comment"],board:true},
 interact:{label:"أكثر المتفاعلين",icon:"⚡",title:"أكثر المتفاعلين",listens:["like","gift","comment"],board:true},
 recentGifts:{label:"آخر الداعمين",icon:"🕒",title:"آخر الداعمين",listens:["gift"],board:true,recent:true},
 recentFollows:{label:"آخر المتابعين",icon:"➕",title:"آخر المتابعين",listens:["follow"],board:true,recent:true},
 subathon:{label:"عداد السبثون",icon:"⏳",title:"السبثون",listens:["clock"],board:false,clock:true,tick:true},
 timer:{label:"مؤقت",icon:"⏱️",title:"مدة البث",listens:["clock"],board:false,clock:true,tick:true},
 social:{label:"الحسابات المتناوبة",icon:"🔄",title:"",listens:["social"],board:false,soc:true,tick:true},
 socialBar:{label:"شريط الحسابات",icon:"📜",title:"",listens:["social"],board:false,soc:true,tick:true},
 socialPanel:{label:"عرض جميع الحسابات",icon:"🗂️",title:"",listens:["social"],board:false,soc:true,tick:true},
 donTicker:{label:"شريط الدعم",icon:"💸",title:"",listens:["donation","donation_refund","donation_clear_tests"],board:false,don:true},
 donGoal:{label:"هدف الدعم المالي",icon:"🎯",title:"هدف الدعم",listens:["donation","donation_refund","donation_clear_tests"],board:false,don:true},
 donLatest:{label:"آخر داعم",icon:"💚",title:"آخر داعم",listens:["donation","donation_refund","donation_clear_tests"],board:false,don:true},
 donTop:{label:"أكبر داعم",icon:"👑",title:"ملك الدعم",listens:["donation","donation_refund","donation_session","donation_clear_tests"],board:true,don:true},
 donBoard:{label:"أفضل الداعمين مالياً",icon:"💰",title:"أفضل الداعمين",listens:["donation","donation_refund","donation_session","donation_clear_tests"],board:true,don:true},
 donAlert:{label:"تنبيهات الدونيشن",icon:"🔔",title:"",listens:["donation"],board:false,don:true},
 lb:{label:"قائمة ترتيب Pro",icon:"🏆",title:"أفضل الداعمين",listens:[],board:false,pro:true},
 sgoal:{label:"هدف دعم مصغّر",icon:"🎯",title:"هدف الأسد",listens:[],board:false,pro:true},
 srules:{label:"لوحة قوانين السبثون",icon:"📜",title:"⏰ قوانين السبثون",listens:["clock"],board:false,tick:true,rules:true},
 botbox:{label:"ردود البوت والشكر",icon:"🤖",title:"",listens:["bot"],board:false,bot:true},
 fcount:{label:"عداد المتابعين",icon:"👥",title:"",listens:["follow"],board:false,fc:true},
 donText:{label:"آخر دعم نصي",icon:"💬",title:"",listens:["donation","donation_refund","donation_clear_tests"],board:false,dt:true},
 actbox:{label:"عرض الإجراءات",icon:"⚡",title:"",listens:[],board:false,act:true},
 nowplay:{label:"الأغنية الحالية",icon:"🎵",title:"",listens:[],board:false,np:true},
 uchat:{label:"الشات الموحد",icon:"💬",title:"",listens:[],board:false,chat:true},
 levent:{label:"آخر التفاعلات",icon:"✨",title:"",listens:[],board:false,le:true},
 falert:{label:"تنبيهات المتابعين",icon:"🦆",title:"",listens:[],board:false,fa:true},
 goal:{label:"هدف الإعجابات",icon:"🎯",title:"هدف الإعجابات",listens:["like"],board:false},
};
/** آخر دعم نصي: الإعدادات الافتراضية (نص فقط، شفاف 100%) */
export const DT_DEFAULTS={dtTitle:"آخر دعم",showTitle:true,showName:true,showSep:true,showSym:true,showAmt:true,sepText:":",symMode:"sym",symPos:"auto",dec:"auto",
 cTitle:"#ffffff",cName:"#ff3b4e",cSep:"#ffffff",cSym:"#22c55e",cAmt:"#f6c94a",font:"",fs:1,weight:"800",nameScale:1,amtScale:1,symScale:1,titleScale:1,gapEm:.35,align:"center",dir:"auto",
 shadow:true,glowOn:false,glowColor:"#ffffff",glowStr:.6,dtAnim:"none",animOn:true,w:.5,h:.07};
export const DESIGNS=[
 {id:"b6o6",name:"B6O6 الأزرق الكرومي",shape:"list"},
 {id:"royal",name:"ملكية ذهبية",shape:"list"},
 {id:"blackred",name:"أسود وأحمر",shape:"list"},
 {id:"neon",name:"نيون أزرق",shape:"list"},
 {id:"glass",name:"زجاجية شفافة",shape:"list"},
 {id:"crystal",name:"كريستالية",shape:"list"},
 {id:"hex",name:"سداسية",shape:"grid"},
 {id:"podium",name:"منصة تتويج",shape:"pod"},
 {id:"orbit",name:"دائرية أفقية",shape:"row"},
 {id:"fire",name:"نار",shape:"list"},
 {id:"cyber",name:"Cyberpunk",shape:"list"},
];
// تصاميم العدادات: مشتركة بين السبثون والمؤقتات (20 تصميماً بأشكال مختلفة)
export const CLOCK_DESIGNS=[
 {id:"b6o6",name:"B6O6 الأزرق الكرومي",shape:"digital"}, {id:"royal",name:"ملكي ذهبي",shape:"digital"},{id:"neon",name:"نيون أزرق",shape:"digital"},{id:"blackred",name:"أحمر وأسود",shape:"digital"},
 {id:"crystal",name:"كريستالي",shape:"digital"},{id:"glass",name:"زجاجي شفاف",shape:"digital"},{id:"lcd",name:"ساعة رقمية LCD",shape:"digital"},
 {id:"ring",name:"ساعة دائرية",shape:"ring"},{id:"bar",name:"شريط تقدم",shape:"bar"},{id:"fire",name:"نار",shape:"digital"},
 {id:"bolt",name:"برق",shape:"digital"},{id:"d3",name:"ثلاثي الأبعاد",shape:"digital"},{id:"space",name:"فضائي",shape:"digital"},
 {id:"rgb",name:"RGB",shape:"digital"},{id:"wings",name:"أجنحة ذهبية",shape:"digital"},{id:"crown",name:"تاج",shape:"digital"},
 {id:"holo",name:"هولوغرام",shape:"digital"},{id:"future",name:"مستقبلي",shape:"digital"},{id:"mini",name:"صغير أسفل الكاميرا",shape:"mini"},
 {id:"side",name:"عمودي جانبي",shape:"vertical"},{id:"vip",name:"فاخر VIP",shape:"ring"},
];
export const NEXT_DESIGNS=["ثلاثية الأبعاد","أسد وتاج","أجنحة ذهبية","برق","رأسية","بطاقات منفصلة","دروع","هولوغرام","فضية","ألماس","بنفسجية فاخرة","RGB","كأس","معدنية","مستقبلية","بسيطة وشفافة","أطراف مضيئة","متحركة بالكامل","VIP أسطورية","أفقية شريطية"];
export const POS=[["tr","أعلى اليمين"],["tc","أعلى المنتصف"],["tl","أعلى اليسار"],["mr","وسط اليمين"],["custom","مخصص (سحب)"],["ml","وسط اليسار"],["br","أسفل اليمين"],["bc","أسفل المنتصف"],["bl","أسفل اليسار"]];
export const SORTS=[["value","مجموع قيمة الهدايا"],["count","عدد الهدايا"],["session","دعم البث الحالي"],["day","دعم اليوم"],["week","دعم الأسبوع"],["month","دعم الشهر"]];
export const TOPNS=[1,3,5,10,20];
export const FONTS=[["default","Orbitron — أرقام رقمية"],["changa","Changa — عريض"],["readex","Readex Pro — عصري"],["mono","أرقام ثابتة العرض"],["serif","Amiri — كلاسيكي"]];
// هدايا وضع التجربة فقط — الأسماء والقيم الحقيقية تأتي من TikTok عند الاتصال
export const GIFTS=[["وردة",1,5655],["قلب",5,5487],["دونات",30,5879],["تاج",99,6097],["سيارة",1000,5774],["مجرة",3000,6602],["أسد",29999,6369],["يونيفرس",44999,7312]];
export const NAMES=["نورة","فهد","سارة","عبدالله","ريم","خالد","لمى","سلطان","جود","تركي","هيا","ماجد","دانة","بندر","رهف","مشاري","غلا","نايف","العنود","راكان"];
export const SVG={
 crown:'<svg class="crown" viewBox="0 0 64 44"><path fill="currentColor" d="M3 38 7 9l14 15L32 2l11 22L57 9l4 29z"/><rect x="5" y="38" width="54" height="6" rx="2" fill="currentColor"/><circle cx="32" cy="2.5" r="3" fill="#fff"/></svg>',
 heart:'<svg viewBox="0 0 24 22"><path fill="#ff4d6d" d="M12 21S1 14 1 7a5.5 5.5 0 0 1 11-1 5.5 5.5 0 0 1 11 1c0 7-11 14-11 14z"/></svg>',
 gem:'<svg viewBox="0 0 24 22"><path fill="#7dd3fc" d="M5 1h14l5 6-12 15L0 7z"/><path fill="#e0f7ff" d="M5 1l3 6h8l3-6M0 7h24" opacity=".55"/></svg>',
 chat:'<svg viewBox="0 0 24 22"><path fill="#a7f3d0" d="M2 2h20v14H8l-5 5v-5H2z"/></svg>',
};
export const uid=()=>Math.random().toString(36).slice(2,9);
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const fmt=n=>Math.round(n).toLocaleString("en-US");
export const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export const avatarCache={};
export function avatar(name){ if(avatarCache[name]) return avatarCache[name];
 let h=0; for(const c of name) h=(h*31+c.charCodeAt(0))%360;
 const s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${h},70%,62%)"/><stop offset="1" stop-color="hsl(${(h+50)%360},65%,32%)"/></linearGradient></defs><rect width="100" height="100" fill="url(#g)"/><text x="50" y="66" font-size="46" text-anchor="middle" fill="#fff" font-family="Tahoma" font-weight="bold">${esc(name.trim()[0]||"?")}</text></svg>`;
 return avatarCache[name]="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(s);
}
export function ls(k,v){try{ if(v===undefined){const r=localStorage.getItem(k);return r?JSON.parse(r):null} localStorage.setItem(k,JSON.stringify(v)) }catch(e){return null}}

/* ================= Widgets ================= */
export function newWidget(type,o={}){
 if(!TYPES[type]) type="likes";
 const t=TYPES[type];
 const base={id:"w_"+uid(),type,name:t.label,title:t.title,showTitle:true,design:"b6o6",x:.05,y:.3,w:.4,h:.3,z:1,visible:true,locked:false,opacity:1,
  topN:5,fontScale:1,avatarScale:1,gap:10,acc:"",tx:"#ffffff",anim:"slide",effects:true,sortBy:"value",pos:"custom",target:10000,font:"default",sound:true,timerId:"stream",showSub:true};
 if(type==="timer"){Object.assign(base,{w:.42,h:.07,design:"glass"})}
 if(type==="subathon"){Object.assign(base,{w:.6,h:.11,design:"b6o6"})}
 if(type==="goal"){Object.assign(base,{w:.6,h:.09,design:"neon"})}
 if(type==="lb"){Object.assign(base,{design:"pinkCloud",source:"gifts",giftKey:"",giftEmoji:"",topN:5,w:.46,h:.36,title:"أفضل الداعمين",rankColors:null,rowOpacity:1,avShape:"circle",sweepOn:true,lowPerf:false,period:"session",currency:"",hideAnon:false,icon:""})}
 if(type==="sgoal"){Object.assign(base,{design:"miniPill",source:"gift",giftKey:"6369",giftEmoji:"🦁",title:"هدف الأسد",target:1,base:0,offset:0,since:0,currency:"",showPct:true,w:.52,h:.06,icon:"",stages:"25,50,75,90",fx:"",showLast:true,showTop:true,showCount:true})}
 if(type==="srules"){Object.assign(base,{design:"royalRules",mode:"list",w:.5,h:.34,interval:4,speed:70,tickerDir:"h",anim:"slideUp",animSpeed:1,animOn:true,order:"custom",maxRules:0,hideKinds:[],showWhat:true,showTime:true,showImg:true,iconScale:1,rowOpacity:1,posColor:"#22c55e",negColor:"#ef4444",lowPerf:false})}
 if(type==="botbox"){Object.assign(base,{design:"b6o6Bot",w:.6,h:.26,max:4,holdSec:10,stack:"up",showAvatar:true,showBot:true,botName:"بوت بطوط",kinds:[]})}
 if(type==="donText"){Object.assign(base,JSON.parse(JSON.stringify(DT_DEFAULTS)))}
 if(type==="actbox"){Object.assign(base,{fontScale:1,hideTests:false,w:.6,h:.4})}
 if(type==="nowplay"){Object.assign(base,{design:"glass",showBy:true,fontScale:1,accent:"",animOn:true,w:.36,h:.12})}
 if(type==="uchat"){Object.assign(base,{design:"glass",mode:"all",max:8,holdSec:0,dir:"bottom",enter:"right",showAv:true,showLogo:true,showTime:false,showEvents:true,dedupe:true,dedupeSec:30,banned:"",bannedAction:"mask",highlight:true,importantWords:"",importantGift:100,bgOpacity:.55,fontScale:1,font:"",rotateSec:8,animOn:true,w:.3,h:.5})}
 if(type==="falert"){Object.assign(base,faDefaultsLite())}
 if(type==="levent"){Object.assign(base,{design:"butterfly",kind:"follow",mode:"sticky",dur:5,layout:"",frame:"auto",card:"clear",palette:"",title:"",msg:"",showTitle:true,showMsg:true,showEmblem:true,showAv:true,w:.42,h:.3,glow:1,textScale:1,animOn:true,animSpeed:1,frameImg:"",defaultAv:""})}
 if(type==="fcount"){Object.assign(base,{design:"minimalGold",platform:"tiktok",accountId:"",handle:"",avatar:"",w:.46,h:.16,showHead:true,showAvatar:true,showName:true,showLogo:true,showNew:true,showUnit:true,showLast:false,goalOn:false,goal:10000,goalAuto:true,goalStep:0,goalStyle:"bar",numFmt:"full",numScale:1,color:"",animOn:true,animSpeed:1})}
 if(TYPES[type].don){Object.assign(base,{period:type==="donTop"?"week":"month",currency:"",goalId:"",order:"recent",hideAnon:false,speed:110,dir:"rtl",enter:"zoomIn",exit:"fade",enterMs:700,exitMs:500,showMessage:true,showSub:true,
   design:type==="donGoal"?"b6o6":type==="donTicker"||type==="donLatest"||type==="donAlert"?"b6o6Signature":"b6o6",exit:"fadeOut",topN:type==="donTop"?1:5,
   w:type==="donTicker"?.94:type==="donAlert"?.8:type==="donGoal"?.7:type==="donTop"?.4:type==="donLatest"?.5:.4,h:type==="donTicker"?.045:type==="donAlert"?.085:type==="donGoal"?.09:type==="donTop"?.14:type==="donLatest"?.08:.32})}
 if(TYPES[type].soc){Object.assign(base,{design:"b6o6Signature",mode:type==="social"?"rotation":"all",accountId:"",filter:"all",enter:"slideRight",exit:"slideOutLeft",enterMs:600,exitMs:500,delayMs:0,showSec:5,gapSec:5,idle:["sweep"],idleSpeed:1,idleStrength:1,sweep:{color:"white",dir:"rtl",speedMs:1300,every:4,width:22,angle:18,strength:.55,repeat:0},logoPos:"auto",useAccStyle:true,cardBg:"",cardBgOpacity:.9,cardBorder:"",cardBorderW:2,cardRadius:"",unColor:"",repeat:false,speed:120,dir:"rtl",cols:1,showLogo:true,showPlatform:true,showUser:true,logoScale:1,
   w:type==="socialBar"?.94:type==="socialPanel"?.42:.5,h:type==="socialBar"?.05:type==="socialPanel"?.3:.07})}
 return Object.assign(base,o);
}
/** يرقّي عناصر محفوظة من نسخة أقدم دون تغيير مواقعها */
const OLD_SOC={elite:"b6o6Signature",neon:"neonBlue",royal:"royalGold",glass:"glassCapsule",cyber:"cyberNeon",diamond:"blackDiamond",rgb:"rgbFlow",minimal:"minimalDark",ribbon:"esportsElite",card:"floatingCard",spot:"floatingIsland",gamer:"gamingHud"};
const OLD_EXIT={slideRight:"slideOutRight",slideLeft:"slideOutLeft",slideUp:"slideOutDown",slideDown:"slideOutUp",zoomIn:"zoomAway",zoomOut:"fadeOut",fade:"fadeOut",flip3d:"fadeOut",rotate:"rotateOut",bounce:"slideOutUp",glitch:"glitchOut",neon:"fadeOut",sweep:"sweepOut",split:"maskOut"};
export function migrateWidget(w){ const d=newWidget(w.type in TYPES?w.type:"likes"); for(const k in d) if(w[k]===undefined) w[k]=d[k];
 if(TYPES[w.type]?.soc||["donTicker","donLatest","donAlert"].includes(w.type)){ if(OLD_SOC[w.design]) w.design=OLD_SOC[w.design]; if(OLD_EXIT[w.exit]) w.exit=OLD_EXIT[w.exit] }
 if(w.type==="timer"&&!CLOCK_DESIGNS.find(c=>c.id===w.design)) w.design="glass"; return w }
export function applyPreset(w,p,cv){
 w.pos=p; if(p==="custom") return;
 const mx=.025, my=.025*cv.w/cv.h;
 const r=p[0], c=p[1];
 w.x = c==="r"?1-w.w-mx : c==="l"?mx : (1-w.w)/2;
 w.y = r==="t"?my : r==="b"?1-w.h-my : (1-w.h)/2;
}
export function defaultLayouts(){
 const cv=CANVASES.vertical;
 const mk=(name,widgets)=>({id:"l_"+uid(),name,canvas:"vertical",widgets});
 const a=[
  newWidget("likes",{design:"neon",w:.37,h:.32,topN:5,z:2}),
  newWidget("gifts",{design:"b6o6",w:.37,h:.32,topN:5,z:3}),
  newWidget("subathon",{design:"b6o6",w:.62,h:.1,z:4}),
  newWidget("timer",{design:"mini",w:.36,h:.045,z:5}),
 ];
 applyPreset(a[0],"mr",cv); applyPreset(a[1],"ml",cv); applyPreset(a[2],"tc",cv); applyPreset(a[3],"bc",cv); a[2].y=.035;
 const b=[newWidget("likes",{design:"glass",w:.4,h:.26,topN:3}),newWidget("gifts",{design:"podium",w:.46,h:.3,topN:5,z:2}),newWidget("goal",{w:.8,h:.08,z:3}),newWidget("comments",{design:"orbit",w:.9,h:.12,topN:5,z:4})];
 applyPreset(b[0],"tr",cv); applyPreset(b[1],"bl",cv); applyPreset(b[2],"bc",cv); applyPreset(b[3],"tc",cv); b[0].y=.16;
 const c=[newWidget("likes",{design:"cyber",w:.4,h:.42,topN:10}),newWidget("gifts",{design:"fire",w:.4,h:.42,topN:10,z:2,sortBy:"count"}),newWidget("timer",{design:"future",w:.4,h:.06,z:3})];
 applyPreset(c[0],"mr",cv); applyPreset(c[1],"ml",cv); applyPreset(c[2],"tc",cv);
 return [mk("تخطيط بث الألعاب",a),mk("تخطيط بث السوالف",b),mk("تخطيط بث التحديات",c)];
}

/** إعدادات تنبيه المتابعين الافتراضية (نسخة مستقلة لتفادي الاستيراد الدائري) */
export function faDefaultsLite(){ return {design:"duck_classic",char:"",duck:"",act:"",side:"right",charScale:1,msgs:"❤️ شكراً على الفولو يا {username}",msgRandom:false,sub:"نورتنا يا أسطورة 👑",showSub:true,showAv:true,enter:"",exit:"",enterMs:700,holdMs:3700,exitMs:600,avScale:1,nameScale:1,frameColor:"",bgMode:"premium",qMax:30,mergeAt:6,sound:"",soundVol:.8,customChar:"",streamName:"",reduceFx:false,w:.5,h:.34} }
