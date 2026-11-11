// سوق آيرتات المجتمع — المحرك النقي (بدون DOM ولا شبكة): الخصوصية، الأحداث، الشروط، المتغيرات، الطابور، الترتيب
// يُستخدم في الخادم (التحقق من الصلاحيات) وفي الغرفة (تشغيل القواعد) وفي لوحة التحكم (العرض)

/** الأحداث المدعومة. avail: هل يرسلها TikTok LIVE فعلاً عبر الاتصال الحالي — لا نعرض حدثاً غير متوفر على أنه يعمل */
export const AL_EVENTS={
 follow:{label:"متابعة جديدة",icon:"➕",field:null,avail:{tiktok:true}},
 like_user:{label:"تكبيس مستخدم (لايكات شخص واحد)",icon:"❤️",field:"likes",avail:{tiktok:true},note:"مجموع لايكات المستخدم نفسه في البث الحالي — منفصل عن المجموع العام"},
 like_total:{label:"مجموع لايكات البث",icon:"💗",field:"total_likes",avail:{tiktok:true},note:"مجموع كل اللايكات في البث — منفصل عن لايكات كل مستخدم"},
 gift:{label:"هدية",icon:"🎁",field:"gift_count",avail:{tiktok:true}},
 gift_value:{label:"هدية بقيمة (عملات)",icon:"💎",field:"diamonds",avail:{tiktok:true}},
 first_gift:{label:"أول هدية من مستخدم",icon:"🥇",field:null,avail:{tiktok:true}},
 first_comment:{label:"أول تعليق للمستخدم في البث",icon:"🗨️",field:null,avail:{tiktok:true}},
 comment_count:{label:"وصول مستخدم لعدد تعليقات",icon:"💬",field:"comments",avail:{tiktok:true}},
 stream_end:{label:"نهاية البث",icon:"⏹️",field:null,avail:{tiktok:true},note:"يُطلق عند انتهاء البث أو انقطاع الاتصال بـ TikTok"},
 manual:{label:"آيرت يدوي (زر في اللوحة)",icon:"🖐️",field:null,avail:{tiktok:true,donation:true}},
 share:{label:"مشاركة البث",icon:"🔁",field:null,avail:{tiktok:true},note:"تصل من مكتبة غير رسمية — قد لا تصل كل مشاركة"},
 join:{label:"دخول مشاهد",icon:"👋",field:null,avail:{tiktok:true},note:"لا يصل دخول كل مشاهد من TikTok"},
 comment:{label:"تعليق (كلمة مفتاحية)",icon:"💬",field:null,avail:{tiktok:true}},
 subscribe:{label:"اشتراك",icon:"⭐",field:null,avail:{tiktok:true},note:"فقط للحسابات المفعّل لها الاشتراك في TikTok"},
 donation:{label:"دونيشن (تبرع مالي مؤكد)",icon:"💰",field:"amount",avail:{tiktok:true,donation:true}},
 live_start:{label:"بداية البث",icon:"🔴",field:null,avail:{tiktok:true}},
 time_added:{label:"إضافة وقت للسبثون",icon:"⏩",field:"seconds",avail:{tiktok:true}},
 time_removed:{label:"خصم وقت من السبثون",icon:"⏪",field:"seconds",avail:{tiktok:true}},
 resub:{label:"تجديد اشتراك",icon:"🔄",field:null,avail:{tiktok:false},note:"غير متوفر: TikTok LIVE لا يرسل حدث تجديد الاشتراك عبر الاتصال الحالي"},
 viewer_goal:{label:"هدف عدد المشاهدين",icon:"👀",field:null,avail:{tiktok:false},note:"غير متوفر: عدد المشاهدين اللحظي غير مربوط بعد"},
 vip_join:{label:"دخول VIP/مشرف",icon:"👑",field:null,avail:{tiktok:false},note:"غير مضمون: صفة المشرف لا تصل دائماً من TikTok — مُعطّل حتى يتأكد"},
};
export const AL_OPS={eq:"يساوي",gt:"أكبر من",gte:"أكبر أو يساوي",lt:"أقل من",lte:"أقل أو يساوي",between:"بين",every:"كل",any:"أي قيمة"};
export const AL_KINDS={video:"فيديو (MP4/WebM)",gif:"GIF متحرك",image:"صورة (PNG/JPG/WebP)",lottie:"Lottie (JSON)",audio:"صوت فقط",template:"قالب جاهز من المنصة"};
/** طابع التصميم (مستقل عن نوع الحدث): Follow + Enemy = «Enemy Follow Alert» */
export const AL_STYLES={enemy:"👾 Enemy",money:"💰 Money",fire:"🔥 Fire",diamond:"💎 Diamond",royal:"👑 Royal",butterfly:"🦋 Butterfly",flowers:"🌸 Flowers",lightning:"⚡ Lightning",ice:"❄️ Ice",gaming:"🎮 Gaming",robot:"🤖 Robot",galaxy:"🌌 Galaxy",hearts:"❤️ Hearts",animals:"🦁 Animals",saudi:"🇸🇦 Saudi",stars:"✨ Stars",anime:"🎭 Anime",funny:"😂 Funny",cinematic:"🎬 Cinematic",minimal:"🫧 Minimal",b6o6:"🦆 B6O6 Exclusive"};
/** مجموعات نوع الحدث للمكتبة */
export const AL_EVENT_GROUPS={follow:["❤️ متابعة",["follow"]],likes:["👍 تكبيس",["like_user","like_total"]],gifts:["🎁 هدايا",["gift","gift_value","first_gift"]],donations:["💸 دونيشن",["donation"]],join:["🚪 دخول البث",["join","vip_join"]],share:["🔁 مشاركة",["share"]],comment:["💬 تعليق",["comment","first_comment","comment_count"]],subscription:["⭐ اشتراك",["subscribe","resub"]],subathon:["⏱️ سابثون",["time_added","time_removed"]],goals:["🏆 تحقيق الأهداف",["viewer_goal"]],custom:["🔔 تنبيهات مخصصة",["manual","live_start","stream_end"]]};
export function alEventGroup(ev){ for(const [k,[,list]] of Object.entries(AL_EVENT_GROUPS)) if(list.includes(ev)) return k; return "custom" }
/** اقتراح الطابع من اسم الملف فقط (اقتراح يعدّله المستخدم — لا نعتمد عليه لتحديد نوع الحدث) */
const AL_STYLE_KW={enemy:["enemy","عدو","monster","وحش"],money:["money","cash","coin","dollar","فلوس","عملة","مال"],fire:["fire","flame","نار"],diamond:["diamond","gem","الماس","ألماس"],royal:["royal","king","crown","ملك","تاج"],butterfly:["butterfl","فراش"],flowers:["flower","rose","ورد","زهر"],lightning:["lightning","thunder","bolt","برق"],ice:["ice","snow","frozen","ثلج","جليد"],gaming:["game","gaming","pixel","العاب","قيم"],robot:["robot","cyber","روبوت"],galaxy:["galaxy","space","star","مجرة","فضاء"],hearts:["heart","love","قلب"],animals:["lion","tiger","cat","dog","animal","اسد","أسد","حيوان"],saudi:["saudi","ksa","سعود"],anime:["anime","انمي","أنمي"],funny:["funny","meme","lol","ضحك"],cinematic:["cinema","epic","movie","سينما"],minimal:["minimal","simple","basic","بسيط"],b6o6:["b6o6","btot","بطوط"]};
export function alSuggestStyle(name){ const n=String(name||"").toLowerCase(); for(const [k,kw] of Object.entries(AL_STYLE_KW)) if(kw.some(w=>n.includes(w))) return k; return "" }
/** رسائل أخطاء الرفع الواضحة (للخادم والواجهة) */
export const AL_ERR={empty:"الملف فارغ أو تالف",too_large:"الملف أكبر من الحد المسموح",bad_type:"صيغة غير مدعومة أو ملف تالف — المدعوم: MP4, WebM, MOV, GIF, APNG, PNG, WebP, MP3, WAV, OGG, Lottie JSON",quota:"امتلأت مساحة ملفاتك — احذف آيرتات قديمة",bad_lottie:"ملف Lottie غير صالح (ليس JSON صحيحاً أو بنيته ناقصة)",lottie_expressions:"ملف Lottie يحتوي تعابير برمجية — غير مسموح لأسباب أمنية",lottie_external:"ملف Lottie يحمّل ملفات من الإنترنت — غير مسموح",too_complex:"ملف Lottie معقد جداً",not_playable:"الفيديو بترميز لا يشغّله المتصفح/OBS ولم ينجح تحويله",convert_failed:"فشل تحويل الفيديو إلى صيغة قابلة للتشغيل",no_converter:"هذا الترميز يحتاج تحويلاً والمحوّل غير متوفر على الخادم حالياً — صدّر الملف بصيغة MP4 (H.264) أو WebM",corrupt:"الملف تالف — لم يمكن قراءة الفيديو",too_long:"المقطع أطول من 60 ثانية",rate_limited:"رفعت ملفات كثيرة — انتظر دقيقة",bad_form:"لم يصل الملف — أعد المحاولة",unauthorized:"سجّل الدخول أولاً",network:"انقطع الاتصال أثناء الرفع — أعد المحاولة"};
export const AL_CATS={celebrate:"احتفال",funny:"مضحك",gaming:"ألعاب",royal:"ملكي",anime:"أنمي",minimal:"بسيط",saudi:"سعودي",neon:"نيون",cute:"لطيف",other:"أخرى",...AL_STYLES}; // التصنيفات القديمة تبقى صالحة للآيرتات القديمة
export const AL_LIMITS={media:30*1024*1024,audio:5*1024*1024,cover:2*1024*1024,quota:200*1024*1024,name:60,desc:400,tags:8,durMin:1,durMax:30};
export const AL_VARS=["username","display_name","avatar","likes","total_likes","gift_name","gift_image","gift_count","diamonds","amount","currency","message","platform","rank","level","time_added","time_removed","goal","progress"];
/** إطارات الصورة الشخصية (32) */
export const AL_FRAMES=[["none","شفاف بالكامل"],["circle","دائرة بسيطة"],["ring","حلقة"],["gold","ذهبي"],["silver","فضي"],["neon","نيون"],["fire","ناري"],["ice","جليدي"],["crown","تاج"],["hex","سداسي"],["square","مربع"],["rounded","مربع ناعم"],["diamond","ماسي"],["star","نجمة"],["heart","قلب"],["shield","درع"],["rainbow","قوس قزح"],["pulse","نابض"],["glitch","جليتش"],["spin","دوار"],["double","حلقتان"],["dash","متقطع"],["glow","توهج"],["shadow","ظل"],["leaf","أوراق"],["galaxy","مجرة"],["pixel","بكسل"],["royal","ملكي"],["saudi","أخضر سعودي"],["pink","وردي"],["cyber","سايبربنك"],["b6o6","B6O6"],["butterfly","فراشات"],["lightning","برق"],["rose","ورد"],["wings","أجنحة"],["crystal","كريستال"],["chrome","كروم"],["cloud","سحابي"],["crescent","هلال"],["sun","شمس"],["emerald","زمرد"],["pearl","لؤلؤ"],["falcon","صقر"],["lion","أسد"],["dragon","تنين"]];
/** حركات الظهور (24) والخروج (18) والتأثيرات المصاحبة (8) = 50 حركة */
export const AL_IN=[["cinema","ظهور سينمائي"],["fadeIn","ظهور تدريجي"],["zoomIn","تكبير"],["popIn","قفزة"],["slideUp","من الأسفل"],["slideDown","من الأعلى"],["slideRight","من اليمين"],["slideLeft","من اليسار"],["bounceIn","ارتداد"],["flipX","قلب أفقي"],["flipY","قلب عمودي"],["rotateIn","دوران"],["swing","تأرجح"],["elastic","مطاط"],["blurIn","من الضباب"],["dropIn","سقوط"],["rise","صعود ناعم"],["spiral","حلزون"],["stretch","تمدد"],["shake","اهتزاز"],["glitchIn","جليتش"],["neonOn","إضاءة نيون"],["unfold","انفتاح"],["roll","تدحرج"],["heartbeat","نبض"]];
export const AL_OUT=[["fadeOut","تلاشي"],["zoomOut","تصغير"],["slideUp","للأعلى"],["slideDown","للأسفل"],["slideRight","لليمين"],["slideLeft","لليسار"],["flipOut","قلب"],["rotateOut","دوران"],["blurOut","ضباب"],["shrink","انكماش"],["dropOut","سقوط"],["fly","طيران"],["spiralOut","حلزون"],["popOut","فرقعة"],["squeeze","عصر"],["glitchOut","جليتش"],["neonOff","انطفاء"],["fold","انطواء"]];
export const AL_FX=[["none","بدون"],["confetti","قصاصات"],["hearts","قلوب"],["stars","نجوم"],["sparkle","لمعان"],["fireworks","ألعاب نارية"],["coins","عملات"],["snow","ثلج"],["butterflies","فراشات"],["diamonds","مطر ألماس"],["petals","بتلات ورد"],["meteors","شهب"],["lightning","برق"],["crowns","نزول تاج"],["smoke","دخان ناعم"]];

const alS=(v,n)=>String(v??"").slice(0,n);
const alN=(v,d=0)=>{ const x=+v; return Number.isFinite(x)?x:d };

/* ------------------------------------------------------------------ الخصوصية والصلاحيات */
/** viewer: {id, admin} أو null للزائر. a: {ownerId, visibility, review, removed} */
export function alIsListed(a){ return !!a&&a.visibility==="public"&&a.review==="approved"&&!a.removed }
export function alCanView(a,viewer){ if(!a) return false; const v=viewer||{}; if(v.id&&a.ownerId===v.id) return true; if(v.admin) return true; return alIsListed(a) }
/** التعديل والحذف لصاحب الآيرت فقط (المشرف يراجع ويخفي من الإدارة، لا يعدّل محتوى غيره) */
export function alCanEdit(a,viewer){ return !!(a&&viewer&&viewer.id&&a.ownerId===viewer.id) }
export function alCanModerate(viewer){ return !!(viewer&&viewer.admin) }
/** الاستخدام في البث: صاحبه دائماً (حتى لو خاص)، وغيره فقط إن كان عاماً ومعتمداً وغير محذوف */
/** opt.adopted: المستخدم أضافه سابقاً وهو عام — يحتفظ بنسخته المرخصة حتى لو أصبح خاصاً، ما لم يُحذف لمخالفة أو يُرفض */
export function alCanUse(a,viewer,opt={}){ if(!a||a.removed) return false; if(viewer&&viewer.id&&a.ownerId===viewer.id) return true; if(alIsListed(a)) return true; return !!(opt.adopted&&a.review!=="rejected") }
/** ما يراه الآخرون من الآيرت العام: بدون أي حقل داخلي */
export function alPublicView(a){ if(!a) return null; const {id,name,description,kind,event,durationSec,category,tags,designerName,ownerId,uses,likes,favs,ratingSum,ratingCount,publishedAt,createdAt,coverId,mediaId,audioId,previewId,meta,config}=a;
 return {id,name,description,kind,event,durationSec,category,tags,designerName,ownerId,previewId,meta:alMeta(meta),uses:uses|0,likes:likes|0,favs:favs|0,rating:ratingCount?Math.round(ratingSum/ratingCount*10)/10:0,ratingCount:ratingCount|0,publishedAt,createdAt,coverId,mediaId,audioId,config} }
/** تغيير الخصوصية: العام يحتاج تأكيد الحقوق ويدخل المراجعة؛ الخاص يُسحب من العرض العام فوراً */
export function alVisibilityPatch(a,to,opt={}){
 if(to==="private") return {ok:true,patch:{visibility:"private",review:"none",publishedAt:null}};
 if(to!=="public") return {ok:false,error:"bad_visibility"};
 if(!(opt.rightsConfirmed||a&&a.rightsConfirmed)) return {ok:false,error:"rights_required"};
 const review=opt.autoApprove?"approved":"pending";
 return {ok:true,patch:{visibility:"public",rightsConfirmed:true,review,publishedAt:review==="approved"?new Date(opt.now||Date.now()):null}} }
/** تعديل محتوى آيرت عام معتمد يعيده للمراجعة (حتى لا يُستبدل الملف بعد الاعتماد) */
export function alEditNeedsReview(a,changed){ return !!(a&&a.visibility==="public"&&a.review==="approved"&&changed&&(changed.mediaId||changed.audioId||changed.coverId||changed.name||changed.description)) }
/** فلترة القائمة العامة (دفاع إضافي فوق استعلام قاعدة البيانات) */
export function alPublicList(list){ return (list||[]).filter(alIsListed).map(alPublicView) }

/* ------------------------------------------------------------------ التحقق من المدخلات والملفات */
export function alValidate(b,opt={}){ const e=[]; const name=alS(b.name,AL_LIMITS.name).trim(), description=alS(b.description,AL_LIMITS.desc).trim();
 if(!name) e.push("اسم الآيرت مطلوب"); // الوصف اختياري
 const kind=AL_KINDS[b.kind]?b.kind:""; if(!kind) e.push("نوع الآيرت مطلوب");
 const event=AL_EVENTS[b.event]?b.event:""; if(!event) e.push("الحدث مطلوب");
 const durationSec=Math.round(alN(b.durationSec,5)); if(durationSec<AL_LIMITS.durMin||durationSec>AL_LIMITS.durMax) e.push("المدة بين 1 و30 ثانية");
 if(kind&&kind!=="template"&&kind!=="audio"&&!b.mediaId) e.push("ملف الآيرت مطلوب"); if(kind==="audio"&&!b.audioId&&!b.mediaId) e.push("الملف الصوتي مطلوب");
 if(kind==="template"&&!alS(b.config&&b.config.template,40)) e.push("اختر القالب");
 const category=AL_CATS[b.category]?b.category:""; if(!AL_STYLES[b.category]&&!(opt.legacy&&category)) e.push("تصنيف التصميم مطلوب");
 const tags=[...new Set((Array.isArray(b.tags)?b.tags:String(b.tags||"").split(/[,،#\s]+/)).map(t=>alS(t,24).trim()).filter(Boolean))].slice(0,AL_LIMITS.tags);
 const visibility=b.visibility==="public"?"public":"private"; // الافتراضي خاص
 if(visibility==="public"&&!b.rightsConfirmed) e.push("للنشر العام يجب تأكيد أنك تملك حقوق الملفات");
 return {ok:!e.length,errors:e,value:{name,description,kind,event,durationSec,category,tags,visibility,rightsConfirmed:!!b.rightsConfirmed,designerName:alS(b.designerName,40).trim(),previewId:b.previewId||null,meta:alMeta(b.meta),mediaId:b.mediaId||null,audioId:b.audioId||null,coverId:b.coverId||null,config:alConfig(b.config)}} }
/** إعدادات العرض (الطبقات) — قيم محصورة فقط */
export function alConfig(c){ c=c&&typeof c==="object"?c:{}; const lay=(o,d)=>{ o=o&&typeof o==="object"?o:{}; return {show:o.show!==undefined?!!o.show:d.show,x:Math.max(0,Math.min(100,alN(o.x,d.x))),y:Math.max(0,Math.min(100,alN(o.y,d.y))),size:Math.max(4,Math.min(100,alN(o.size,d.size))),color:/^#[0-9a-f]{3,8}$/i.test(o.color||"")?o.color:d.color,text:alS(o.text??d.text,140)} };
 const pick=(v,list,d)=>list.some(x=>x[0]===v)?v:d;
 return {template:alS(c.template,40),
  avatar:{...lay(c.avatar,{show:true,x:50,y:30,size:22,color:"#ffffff",text:""}),frame:pick(c.avatar&&c.avatar.frame,AL_FRAMES,"ring")},
  title:lay(c.title,{show:true,x:50,y:66,size:7,color:"#ffffff",text:"{display_name}"}),
  sub:lay(c.sub,{show:true,x:50,y:80,size:4.5,color:"#ffd76a",text:AL_DEFAULT_SUB}),
  enter:pick(c.enter,AL_IN,"popIn"),exit:pick(c.exit,AL_OUT,"fadeOut"),fx:pick(c.fx,AL_FX,"none"),
  fit:c.fit==="cover"?"cover":"contain",volume:Math.max(0,Math.min(1,alN(c.volume,.8))),
  chroma:{on:!!(c.chroma&&c.chroma.on),mode:c.chroma&&c.chroma.mode==="luma"?"luma":"green",color:/^#[0-9a-f]{6}$/i.test(c.chroma&&c.chroma.color||"")?c.chroma.color:"#00ff00",tol:Math.max(5,Math.min(200,alN(c.chroma&&c.chroma.tol,90)))},
  tts:{on:!!(c.tts&&c.tts.on),text:alS(c.tts&&c.tts.text||"",160)},
  videoSound:c.videoSound!==false,audioDelay:Math.max(0,Math.min(10000,alN(c.audioDelay,0))),speed:Math.max(.25,Math.min(3,alN(c.speed,1))),frameAnim:c.frameAnim!==false,
  layerOrder:c.layerOrder==="behind"?"behind":"front",
  font:alS(c.font||"default",24)} }
const AL_DEFAULT_SUB="";
/** فحص البايتات الحقيقية للملف (لا نثق بالامتداد أو نوع المتصفح) */
export function alSniff(b){ if(!b||b.length<4) return ""; const h=(i)=>b[i];
 if(h(0)===0x89&&h(1)===0x50&&h(2)===0x4e&&h(3)===0x47) return "image/png";
 if(h(0)===0xff&&h(1)===0xd8&&h(2)===0xff) return "image/jpeg";
 if(h(0)===0x47&&h(1)===0x49&&h(2)===0x46&&h(3)===0x38) return "image/gif";
 if(b.length>12&&h(0)===0x52&&h(1)===0x49&&h(2)===0x46&&h(3)===0x46){ const t=String.fromCharCode(b[8],b[9],b[10],b[11]); if(t==="WEBP") return "image/webp"; if(t==="WAVE") return "audio/wav" }
 if(h(0)===0x1a&&h(1)===0x45&&h(2)===0xdf&&h(3)===0xa3) return "video/webm";
 if(b.length>12&&String.fromCharCode(b[4],b[5],b[6],b[7])==="ftyp"){ const br=String.fromCharCode(b[8],b[9],b[10],b[11]); return /^M4A/.test(br)?"audio/mp4":br==="qt  "?"video/quicktime":"video/mp4" }
 if(b.length>12&&String.fromCharCode(b[4],b[5],b[6],b[7])==="moov"||String.fromCharCode(b[4],b[5],b[6],b[7])==="wide"||String.fromCharCode(b[4],b[5],b[6],b[7])==="mdat") return "video/quicktime";
 if(h(0)===0xff&&(h(1)===0xf1||h(1)===0xf9)) return "audio/aac";
 if(h(0)===0x4f&&h(1)===0x67&&h(2)===0x67&&h(3)===0x53) return "audio/ogg";
 if(h(0)===0x49&&h(1)===0x44&&h(2)===0x33||h(0)===0xff&&(h(1)&0xe0)===0xe0) return "audio/mpeg";
 let i=0; while(i<b.length&&i<64&&(b[i]===0x20||b[i]===0x0a||b[i]===0x0d||b[i]===0x09||b[i]===0xef||b[i]===0xbb||b[i]===0xbf)) i++; if(b[i]===0x7b) return "application/json";
 return "" }
export const AL_SLOT_MIMES={media:["video/mp4","video/webm","video/quicktime","audio/mpeg","audio/wav","audio/ogg","audio/mp4","audio/aac","image/gif","image/png","image/jpeg","image/webp","application/json"],audio:["audio/mpeg","audio/wav","audio/ogg","audio/mp4","audio/aac"],cover:["image/png","image/jpeg","image/webp","image/gif"]};
export function alCheckFile(slot,bytes){ const lim=AL_LIMITS[slot]; if(!lim) return {ok:false,error:"bad_slot"}; if(!bytes||!bytes.length) return {ok:false,error:"empty"}; if(bytes.length>lim) return {ok:false,error:"too_large",max:lim};
 const mime=alSniff(bytes); if(!mime||!AL_SLOT_MIMES[slot].includes(mime)) return {ok:false,error:"bad_type"};
 if(mime==="application/json"){ let j; try{ j=JSON.parse(typeof TextDecoder!=="undefined"?new TextDecoder().decode(bytes):String(bytes)) }catch(e){ return {ok:false,error:"bad_lottie"} } const r=alLottieSafe(j); if(!r.ok) return r }
 return {ok:true,mime} }
/** فحص سريع لخصائص الملف من البايتات: الحركة والشفافية للصور (الفيديو يُفحص بـ FFmpeg/المتصفح) */
export function alInspect(b){ const mime=alSniff(b), r={mime,family:/^video/.test(mime)?"video":/^audio/.test(mime)?"audio":mime==="application/json"?"lottie":/^image/.test(mime)?"image":"",animated:false,alpha:null,size:b?b.length:0};
 const str=(i,n)=>String.fromCharCode(...b.slice(i,i+n));
 if(mime==="image/png"){ r.alpha=b[25]===6||b[25]===4; let i=8; while(i+8<b.length&&i<4e6){ const len=(b[i]<<24|b[i+1]<<16|b[i+2]<<8|b[i+3])>>>0, t=str(i+4,4); if(t==="acTL") r.animated=true; if(t==="tRNS") r.alpha=true; if(t==="IDAT") break; i+=12+len } if(r.animated) r.apng=true }
 if(mime==="image/webp"&&str(12,4)==="VP8X"){ r.animated=!!(b[20]&2); r.alpha=!!(b[20]&16) } else if(mime==="image/webp") r.alpha=str(12,4)==="VP8L"?null:false;
 if(mime==="image/gif"){ let n=0; for(let i=13;i<b.length-1&&n<3;i++) if(b[i]===0x21&&b[i+1]===0xf9){ n++; if(b[i+3]&1) r.alpha=true } r.animated=n>1; if(r.alpha===null) r.alpha=false }
 if(r.family==="image") r.kind=mime==="image/gif"||r.animated?"gif":"image"; else r.kind=r.family==="video"?"video":r.family==="lottie"?"lottie":r.family==="audio"?"audio":"";
 return r }
/** وصف الوسائط المحفوظ مع الآيرت (أرقام محصورة فقط) */
export function alMeta(m){ m=m&&typeof m==="object"?m:{}; const n=(v,mx)=>Number.isFinite(+v)&&+v>=0?Math.min(+v,mx):null;
 return {w:n(m.w,10000),h:n(m.h,10000),duration:n(m.duration,3600),fps:n(m.fps,240),size:n(m.size,1e9),hasAudio:m.hasAudio==null?null:!!m.hasAudio,alpha:m.alpha==null?null:!!m.alpha,codec:alS(m.codec,30),mime:alS(m.mime,40),converted:!!m.converted,animated:m.animated==null?null:!!m.animated} }
/** Lottie آمن: بنية صحيحة، بدون تعابير برمجية (expressions) ولا روابط خارجية ولا حجم مبالغ */
export function alLottieSafe(j){ if(!j||typeof j!=="object"||!Array.isArray(j.layers)||!(alN(j.w)>0)||!(alN(j.h)>0)) return {ok:false,error:"bad_lottie"};
 let bad=null, n=0; const walk=(o,d)=>{ if(bad||d>60) return; if(++n>400000){ bad="too_complex"; return } if(Array.isArray(o)){ for(const x of o) walk(x,d+1); return } if(o&&typeof o==="object"){ for(const k in o){ const v=o[k]; if(k==="x"&&typeof v==="string"){ bad="lottie_expressions"; return } if(k==="u"&&typeof v==="string"&&/^(https?:|\/\/|javascript:)/i.test(v)){ bad="lottie_external"; return } if(k==="p"&&typeof v==="string"&&/^(https?:|\/\/|javascript:)/i.test(v)){ bad="lottie_external"; return } walk(v,d+1) } } };
 walk(j,0); return bad?{ok:false,error:bad}:{ok:true} }

/* ------------------------------------------------------------------ القواعد (الشروط) لكل مستخدم */
export function alRule(r){ r=r&&typeof r==="object"?r:{}; const c=r.cond||{};
 return {id:alS(r.id||"r"+Math.random().toString(36).slice(2,8),40),alertId:alS(r.alertId,40),event:AL_EVENTS[r.event]?r.event:"follow",enabled:r.enabled!==false,label:alS(r.label,40),level:alS(r.level,30),
  cond:{op:AL_OPS[c.op]?c.op:"any",value:alN(c.value,0),value2:alN(c.value2,0),user:alS(c.user,60).trim().replace(/^@/,"").toLowerCase(),gift:alS(c.gift,60).trim().toLowerCase(),keyword:alS(c.keyword,60).trim().toLowerCase(),platform:alS(c.platform,20),role:["","mod","sub","follower"].includes(c.role)?c.role:""},
  once:["none","user","session"].includes(r.once)?r.once:"none",priority:Math.max(0,Math.min(100,Math.round(alN(r.priority,10)))),cooldownSec:Math.max(0,Math.min(3600,alN(r.cooldownSec,0))),also:!!r.also,
  over:{title:alS(r.over&&r.over.title,140),sub:alS(r.over&&r.over.sub,140),volume:r.over&&r.over.volume!=null?Math.max(0,Math.min(1,alN(r.over.volume,.8))):null,durationSec:r.over&&r.over.durationSec?Math.max(1,Math.min(30,alN(r.over.durationSec,5))):null,tts:!!(r.over&&r.over.tts),ttsText:alS(r.over&&r.over.ttsText,200)}} }
export function alCfg(c){ c=c&&typeof c==="object"?c:{}; return {enabled:c.enabled!==false,rules:(Array.isArray(c.rules)?c.rules:[]).slice(0,200).map(alRule),gapMs:Math.max(0,Math.min(10000,alN(c.gapMs,600))),maxQueue:Math.max(1,Math.min(100,alN(c.maxQueue,30))),mergeLikes:c.mergeLikes!==false,tts:!!c.tts} }
export function alNewState(){ return {once:{},last:{},ul:{},tl:0,gifted:{},commented:{},uc:{},n:0} }
const cmpOp=(op,x,a,b)=>op==="any"||op==="eq"&&x===a||op==="gt"&&x>a||op==="gte"&&x>=a||op==="lt"&&x<a||op==="lte"&&x<=a||op==="between"&&x>=Math.min(a,b)&&x<=Math.max(a,b);
/** هل القيمة تعبر العتبة الآن؟ (للايكات: من prev إلى cur) — حتى لا يتكرر الآيرت عند كل لايك */
function crossOp(op,prev,cur,a,b){ if(op==="every") return a>0&&Math.floor(cur/a)>Math.floor(prev/a);
 if(op==="gte"||op==="eq"||op==="gt"){ const th=op==="gt"?a+1e-9:a; return prev<th&&cur>=th } if(op==="between") return cmpOp("between",cur,a,b)&&!cmpOp("between",prev,a,b); if(op==="any") return cur>prev; return cmpOp(op,cur,a,b)&&!cmpOp(op,prev,a,b) }
function fmtSec(ms){ const s=Math.round(Math.abs(ms)/1000), m=Math.floor(s/60), h=Math.floor(m/60); return h?`${h}:${String(m%60).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`:`${m}:${String(s%60).padStart(2,"0")}` }
/** المتغيرات من بيانات الحدث الحقيقية فقط — ما لا يصل يبقى فارغاً ولا نخترعه */
export function alVars(ev,x={}){ const u=(ev&&ev.user)||{}, v={};
 if(u.id) v.username=String(u.id); if(u.name) v.display_name=String(u.name); if(u.avatar) v.avatar=String(u.avatar);
 if(ev){ if(ev.platform) v.platform=ev.platform==="tiktok"?"TikTok":String(ev.platform);
  if(ev.type==="gift"){ if(ev.gift) v.gift_name=String(ev.gift); if(ev.giftImage||ev.image) v.gift_image=String(ev.giftImage||ev.image); v.gift_count=String(ev.count||1); if(ev.value) v.diamonds=String(ev.value) }
  if(ev.type==="donation"){ v.amount=String(ev.amount); if(ev.currency) v.currency=ev.currency; if(ev.message) v.message=alS(ev.message,200); if(!v.display_name&&ev.name) v.display_name=String(ev.name) }
  if(ev.type==="comment"&&ev.text) v.message=alS(ev.text,200) }
 for(const k of AL_VARS) if(x[k]!=null&&x[k]!=="") v[k]=String(x[k]);
 return v }
export function alFill(t,v){ return String(t||"").replace(/\{([a-z_]+)\}/g,(m,k)=>AL_VARS.includes(k)?(v&&v[k]!=null?v[k]:""):m).replace(/\s{2,}/g," ").trim() }
/** المتغيرات المطلوبة في النص وغير المتوفرة لهذا الحدث — للتنبيه في المحرر */
export function alMissing(t,event){ const have=new Set(["username","display_name","avatar","platform","level","rank"]); const by={like_user:["likes","total_likes"],like_total:["total_likes","goal","progress"],gift:["gift_name","gift_image","gift_count","diamonds"],gift_value:["gift_name","gift_image","gift_count","diamonds"],first_gift:["gift_name","gift_image","gift_count","diamonds"],donation:["amount","currency","message"],comment:["message"],time_added:["time_added"],time_removed:["time_removed"]};
 for(const k of by[event]||[]) have.add(k); if(event==="live_start"||event==="like_total"){ have.delete("username"); have.delete("display_name"); have.delete("avatar") }
 return [...String(t||"").matchAll(/\{([a-z_]+)\}/g)].map(m=>m[1]).filter(k=>AL_VARS.includes(k)&&!have.has(k)) }
const lc=s=>String(s||"").toLowerCase();
function filt(r,ev){ const c=r.cond; if(!ev) return true; const u=ev.user||{};
 if(c.user&&lc(u.id).replace(/^@/,"")!==c.user&&lc(u.name)!==c.user) return false;
 if(c.gift&&lc(ev.gift)!==c.gift&&String(ev.giftId||"")!==c.gift) return false;
 if(c.platform&&ev.platform!==c.platform) return false;
 if(c.role==="mod"&&!(u.mod||u.isModerator)) return false; if(c.role==="sub"&&!(u.sub||u.isSubscriber)) return false; if(c.role==="follower"&&!(u.follower||u.followRole>=1)) return false; // بيانات غير متوفرة ← لا يعمل الشرط (لا نفترض)
 return true }
/** مطابقة كل القواعد لحدث واحد ← عناصر الآيرت (بدون تكرار) */
function emit(cfg,st,cands,now,base){ if(!cands.length) return []; cands.sort((a,b)=>b.r.priority-a.r.priority); const out=[], taken={};
 // لكل حدث: أعلى قاعدة أولوية فقط (المستويات)، والقواعد المعلَّمة "إضافية" تعمل فوقها
 for(const {r,vars} of cands){ if(!r.also&&taken[r.event]) continue;
  const uid=lc(vars.username||vars.display_name||""); const ok=r.once==="user"?uid&&!st.once[r.id+":"+uid]:r.once==="session"?!st.once[r.id]:true; if(!ok) continue;
  if(r.cooldownSec&&st.last[r.id]&&now-st.last[r.id]<r.cooldownSec*1000) continue;
  if(r.once==="user") st.once[r.id+":"+uid]=1; if(r.once==="session") st.once[r.id]=1; st.last[r.id]=now; st.n++;
  if(r.level) vars.level=r.level;
  out.push({id:(base.id||"a"+now)+":"+r.id,ruleId:r.id,alertId:r.alertId,event:r.event,vars,priority:r.priority,at:now,test:!!base.test,mergeKey:r.event==="like_user"?r.id+":"+uid:r.event==="like_total"?r.id:""}); if(!r.also) taken[r.event]=1 }
 return out }
export function alertsOnEvent(cfg,st,ev,now){ if(!cfg||!cfg.enabled||!ev) return []; const rules=cfg.rules.filter(r=>r.enabled&&r.alertId&&AL_EVENTS[r.event]&&AL_EVENTS[r.event].avail[ev.platform==="donation"?"donation":"tiktok"]!==false); if(!rules.length&&ev.type!=="like") return [];
 const cands=[], u=ev.user||{}, uid=lc(u.id||u.name);
 if(ev.type==="like"){ const n=Math.max(0,+ev.count||0); if(!n) return []; const p=st.ul[uid]||0, c=p+n; st.ul[uid]=c; const tp=st.tl, tc=tp+n; st.tl=tc;
  for(const r of rules){ if(r.event==="like_user"&&filt(r,ev)&&crossOp(r.cond.op,p,c,r.cond.value,r.cond.value2)) cands.push({r,vars:alVars(ev,{likes:c,total_likes:tc})});
   if(r.event==="like_total"&&crossOp(r.cond.op,tp,tc,r.cond.value,r.cond.value2)){ const g=r.cond.op==="every"?Math.floor(tc/r.cond.value)*r.cond.value:r.cond.value; cands.push({r,vars:alVars(null,{total_likes:tc,goal:g||"",progress:g?Math.min(100,Math.round(tc/g*100))+"%":""})}) } } }
 else for(const r of rules){ if(!filt(r,ev)) continue; const c=r.cond;
  if(r.event==="follow"&&ev.type==="follow") cands.push({r,vars:alVars(ev)});
  else if(r.event==="share"&&ev.type==="share") cands.push({r,vars:alVars(ev)});
  else if(r.event==="join"&&ev.type==="join") cands.push({r,vars:alVars(ev)});
  else if(r.event==="subscribe"&&ev.type==="subscribe") cands.push({r,vars:alVars(ev)});
  else if(r.event==="first_comment"&&ev.type==="comment"){ if(!st.commented[uid]) cands.push({r,vars:alVars(ev)}) }
  else if(r.event==="comment_count"&&ev.type==="comment"){ const n=(st.uc[uid]||0)+1; if(crossOp(c.op==="any"?"gte":c.op,n-1,n,c.value,c.value2)) cands.push({r,vars:alVars(ev)}) }
  else if(r.event==="comment"&&ev.type==="comment"){ if(!c.keyword||lc(ev.text).includes(c.keyword)) cands.push({r,vars:alVars(ev)}) }
  else if(r.event==="gift"&&ev.type==="gift"){ if(cmpOp(c.op,+ev.count||1,c.value,c.value2)) cands.push({r,vars:alVars(ev)}) }
  else if(r.event==="gift_value"&&ev.type==="gift"){ if(cmpOp(c.op,+ev.value||0,c.value,c.value2)) cands.push({r,vars:alVars(ev)}) }
  else if(r.event==="first_gift"&&ev.type==="gift"){ if(!st.gifted[uid]) cands.push({r,vars:alVars(ev)}) }
  else if(r.event==="donation"&&ev.type==="donation"&&ev.verified&&!ev.refunded){ if(cmpOp(c.op,+ev.amount||0,c.value,c.value2)) cands.push({r,vars:alVars(ev)}) } }
 if(ev.type==="gift"&&uid) st.gifted[uid]=1; if(ev.type==="comment"&&uid){ st.commented[uid]=1; st.uc[uid]=(st.uc[uid]||0)+1 }
 return emit(cfg,st,cands,now,{id:ev.id,test:ev.test}) }
/** سجلات السبثون (وقت مضاف/مخصوم) */
export function alertsOnLogs(cfg,st,logs,now){ if(!cfg||!cfg.enabled||!logs||!logs.length) return []; const out=[];
 for(const l of logs){ const d=+l.deltaMs||0; if(!d) continue; const ev=d>0?"time_added":"time_removed", sec=Math.abs(d)/1000;
  const cands=cfg.rules.filter(r=>r.enabled&&r.alertId&&r.event===ev&&cmpOp(r.cond.op,sec,r.cond.value,r.cond.value2)).map(r=>({r,vars:alVars(l.user?{user:{name:l.user,avatar:l.avatar||""}}:null,{[ev]:fmtSec(d)})}));
  out.push(...emit(cfg,st,cands,now,{id:"log"+(l.subathonId||"")+":"+(l.seq||now),test:!!l.test})) }
 return out }
/** بداية البث: يصفّر عدادات الجلسة (مرة لكل مستخدم/جلسة) ويطلق آيرت بداية البث */
export function alertsOnLive(cfg,st,live,now){ if(!live) return []; const fresh=alNewState(); Object.keys(st).forEach(k=>delete st[k]); Object.assign(st,fresh);
 if(!cfg||!cfg.enabled) return []; const cands=cfg.rules.filter(r=>r.enabled&&r.alertId&&r.event==="live_start").map(r=>({r,vars:alVars(null,{})})); return emit(cfg,st,cands,now,{id:"live"+now}) }

/** نهاية البث */
export function alertsOnEnd(cfg,st,now){ if(!cfg||!cfg.enabled) return []; return emit(cfg,st,cfg.rules.filter(r=>r.enabled&&r.alertId&&r.event==="stream_end").map(r=>({r,vars:alVars(null,{})})),now,{id:"end"+now}) }
/** آيرت يدوي من اللوحة: حدث حقيقي يقرره صانع المحتوى (ليس تجربة) */
export function alertsManual(cfg,st,ruleId,now){ const r=cfg&&cfg.rules.find(x=>x.id===ruleId&&x.alertId); if(!r) return []; return [{id:"man:"+now+":"+r.id,ruleId:r.id,alertId:r.alertId,event:r.event,vars:r.level?{level:r.level}:{},priority:r.priority,at:now,test:false}] }
/* ------------------------------------------------------------------ الطابور (في رابط OBS) */
export function alQueue(){ return {q:[],seen:{},played:0} }
/** إضافة مع: منع التكرار، دمج اللايكات المتتالية لنفس المستخدم، الأولوية، حد أقصى للطول */
export function alQueuePush(Q,it,opt={}){ if(!it||!it.id) return false; if(Q.seen[it.id]) return false; Q.seen[it.id]=1; const ks=Object.keys(Q.seen); if(ks.length>3000) for(const k of ks.slice(0,1000)) delete Q.seen[k];
 if(opt.mergeLikes!==false&&it.mergeKey){ const ex=Q.q.find(x=>x.mergeKey===it.mergeKey); if(ex){ Object.assign(ex.vars,it.vars); ex.merged=(ex.merged||1)+1; return true } }
 let i=Q.q.findIndex(x=>(x.priority|0)<(it.priority|0)); if(i<0) i=Q.q.length; Q.q.splice(i,0,it);
 const max=opt.maxQueue||30; while(Q.q.length>max){ let lo=Q.q.length-1; Q.q.splice(lo,1) } return true }
export function alQueueNext(Q){ const it=Q.q.shift(); if(it) Q.played++; return it||null }

/* ------------------------------------------------------------------ الترتيب والأقسام والشارات */
export const AL_SECTIONS=[["all","الكل"],["official","الرسمية"],["community","المجتمع"],["new","الأحدث"],["used","الأكثر استخداماً"],["liked","الأكثر إعجاباً"],["rated","الأعلى تقييماً"],["trending","الرائج"],["week","أفضل الأسبوع"],["month","أفضل الشهر"],["packs","📦 الحزم"],["favs","المفضلة"],["mine","آيرتاتي"],["using","أستخدمها"],["designers","المصممون"]];
export function alRating(a){ return a.ratingCount?a.ratingSum/a.ratingCount:0 }
/** الرائج: نشاط حديث مع تخفيف زمني (لا يكفي العدد الكلي القديم) — التقييم بمتوسط بايزي حتى لا يتصدر تقييم واحد */
export function alScore(a,now,mode){ const age=Math.max(1,(now-new Date(a.publishedAt||a.createdAt||now).getTime())/36e5);
 const bayes=(alRating(a)*a.ratingCount+3.5*5)/((a.ratingCount|0)+5);
 if(mode==="rated") return bayes; if(mode==="used") return a.uses|0;
 return ((a.uses|0)*3+(a.likes|0)*2+(a.favs|0)*2+bayes*(a.ratingCount|0))/Math.pow(age+2,1.4) }
export function alSort(list,mode,now=Date.now()){ const L=[...list], t=a=>new Date(a.publishedAt||a.createdAt||0).getTime();
 if(mode==="liked") return L.sort((a,b)=>(b.likes|0)-(a.likes|0)||(b.favs|0)-(a.favs|0));
 if(mode==="new") return L.sort((a,b)=>t(b)-t(a));
 if(mode==="week"||mode==="month"){ const lim=now-(mode==="week"?7:30)*864e5; return L.filter(a=>t(a)>=lim).sort((a,b)=>alScore(b,now,"used")+alScore(b,now,"rated")-alScore(a,now,"used")-alScore(a,now,"rated")) }
 if(mode==="used"||mode==="rated"||mode==="trending") return L.sort((a,b)=>alScore(b,now,mode)-alScore(a,now,mode));
 return L }
export function alSearch(list,q){ q=lc(q).trim(); if(!q) return list; return list.filter(a=>lc(a.name).includes(q)||lc(a.description).includes(q)||lc(a.designerName).includes(q)||lc(a.category).includes(q)||lc(AL_CATS[a.category]).includes(q)||(a.tags||[]).some(t=>lc(t).includes(q))) }
export function alDesignerBadges(d){ const b=[]; if(d.verified) b.push(["verified","✔️ مصمم موثّق"]); if((d.uses|0)>=100) b.push(["popular","🔥 الأكثر استخداماً"]); if((d.count|0)>=10) b.push(["prolific","🎨 مصمم نشِط"]); if(d.rating>=4.5&&(d.ratingCount|0)>=10) b.push(["top","⭐ تقييم ممتاز"]); if(d.since&&Date.now()-new Date(d.since).getTime()<30*864e5) b.push(["new","🆕 جديد"]); return b }
/** شارات الخصوصية/المراجعة في "آيرتاتي" */
export function alBadge(a){ if(a.removed) return ["❌","محذوف من الإدارة","removed"]; if(a.visibility!=="public") return ["🔒","خاص","private"]; if(a.review==="pending") return ["⏳","بانتظار المراجعة","pending"]; if(a.review==="rejected") return ["❌","مرفوض","rejected"]; return ["🌍","عام","public"] }
export const AL_REPORT_REASONS={copyright:"انتهاك حقوق",inappropriate:"محتوى غير لائق",broken:"لا يعمل",spam:"مزعج/مكرر",other:"أخرى"};
export const AL_REPORT_HIDE=5; // بلاغات مستقلة تعيد الآيرت للمراجعة تلقائياً
/** الآيرتات الرسمية: قوالب المنصة الجاهزة (معرّف tpl:<تصميم>) — لا تحتاج رفع ملفات ومتاحة للجميع */
export function alIsOfficial(id){ return /^tpl:[a-z0-9_]{2,40}$/i.test(String(id||"")) }
export function alOfficialDef(id,name){ if(!alIsOfficial(id)) return null; return {id,name:name||"قالب رسمي",kind:"template",event:"follow",durationSec:6,official:true,config:alConfig({template:String(id).slice(4)})} }
/** تعريف الآيرت كما يحتاجه صندوق OBS (بدون حقول داخلية) — روابط الملفات يضيفها الخادم موقّعة */
export function alBoxDef(a,urls){ return {id:a.id,name:a.name,kind:a.kind,event:a.event,durationSec:a.durationSec,config:alConfig(a.config),mediaUrl:urls&&urls.media||"",audioUrl:urls&&urls.audio||"",coverUrl:urls&&urls.cover||""} }
