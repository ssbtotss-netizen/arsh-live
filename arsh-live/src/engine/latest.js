// ====== آخر التفاعلات (Latest Events): دوال نقية ======
// يُحفظ آخر حدث حقيقي لكل نوع داخل C.latest (يُحفظ مع حالة الغرفة ويصل لكل الروابط عند إعادة الاتصال).
// قاعدة الصدق: أحداث الاختبار تُعرض على العنصر فقط ولا تُحفظ كآخر حدث حقيقي.
// الدونيشن لا يصل هنا إلا بعد تأكيده من مزود الدفع (مسار التبرعات في الغرفة)، ولا يُخلط بهدايا TikTok.
export const LE_KINDS={
 like:{label:"آخر لايك",en:"LAST LIKE",icon:"❤️",ev:"like",title:"آخر لايك",msg:"{count} لايك",status:["يعمل — أحدث حدث إعجاب مستلم من البث","ok"],note:"TikTok يرسل الإعجابات على دفعات؛ المعروض هو صاحب أحدث دفعة إعجاب مستلمة، وليس ترتيباً موثقاً لآخر ضغطة."},
 follow:{label:"آخر متابعة",en:"LAST FOLLOW",icon:"👤",ev:"follow",title:"آخر متابعة",msg:"شكراً على الفولو يا {user}",status:["يعمل — متابعات البث المباشر","ok"]},
 join:{label:"آخر دخول",en:"LAST JOIN",icon:"🚪",ev:"join",title:"آخر دخول",msg:"نورت البث يا {user}",status:["غير مؤكد — يعتمد على وصول أحداث الدخول من اتصال TikTok","warn"],note:"أحداث الدخول قد لا تصل لكل المشاهدين أو قد لا تصل إطلاقاً حسب اتصال TikTok؛ إن لم تصل يبقى العنصر فارغاً ولا نعرض أسماء وهمية."},
 share:{label:"آخر مشاركة",en:"LAST SHARE",icon:"🔁",ev:"share",title:"آخر مشاركة",msg:"شكراً على مشاركة البث",status:["يعمل عند وصول أحداث المشاركة من البث","warn"]},
 donation:{label:"آخر دعم دونيشن",en:"LAST DONATION",icon:"💰",ev:"donation",title:"آخر دعم",msg:"شكراً على دعمك",status:["يعمل — بعد تأكيد مزود التبرعات فقط","ok"],note:"يظهر الدعم المالي فقط بعد تأكيده من مزود التبرعات المتصل، ولا تُحسب هدايا TikTok هنا."},
 gift:{label:"آخر هدية TikTok",en:"LAST GIFT",icon:"🎁",ev:"gift",title:"آخر هدية",msg:"{gift} ×{count}",status:["يعمل — هدايا البث","ok"]},
 comment:{label:"آخر تعليق",en:"LAST COMMENT",icon:"💬",ev:"comment",title:"آخر تعليق",msg:"{text}",status:["يعمل — تعليقات كل المنصات المتصلة","ok"]},
 topDay:{label:"أقوى داعم اليوم",en:"TOP TODAY",icon:"👑",derived:"tops:day",title:"أقوى داعم اليوم",msg:"{count} نقطة هدايا",status:["يعمل — نقاط هدايا TikTok منذ بداية اليوم (توقيت السعودية)","ok"]},
 topWeek:{label:"أقوى داعم الأسبوع",en:"TOP WEEK",icon:"🏆",derived:"tops:week",title:"أقوى داعم الأسبوع",msg:"{count} نقطة هدايا",status:["يعمل — من الأحد إلى اليوم","ok"]},
 topMonth:{label:"أقوى داعم الشهر",en:"TOP MONTH",icon:"💎",derived:"tops:month",title:"أقوى داعم الشهر",msg:"{count} نقطة هدايا",status:["يعمل — منذ بداية الشهر","ok"]},
 topLike:{label:"أكثر شخص كبس",en:"TOP LIKER",icon:"❤️",derived:"lb:likes",title:"أكثر شخص كبس",msg:"{count} لايك",status:["يعمل — دفعات اللايكات المستلمة في هذا البث","ok"]},
 topComment:{label:"أكثر شخص علّق",en:"TOP CHATTER",icon:"💬",derived:"lb:comments",title:"أكثر شخص علّق",msg:"{count} تعليق",status:["يعمل — تعليقات هذا البث","ok"]},
 topShare:{label:"أكثر شخص شارك",en:"TOP SHARER",icon:"🔁",derived:"tops:shares",title:"أكثر شخص شارك",msg:"{count} مشاركة",status:["يعمل عند وصول أحداث المشاركة (اليوم)","warn"]},
 song:{label:"آخر طالب أغنية",en:"LAST SONG REQUEST",icon:"🎵",derived:"music",title:"آخر طلب أغنية",msg:"طلب «{title}»",status:["يعمل — من نظام طلبات الأغاني","ok"]},
 subscribe:{label:"آخر مشترك",en:"LAST SUB",icon:"⭐",ev:"subscribe",title:"آخر مشترك",msg:"يا هلا بالمشترك الجديد",status:["يعمل عند وصول أحداث الاشتراك","warn"]},
};
export const LE_MAIN=["like","follow","join","share","donation"];
const KIND_OF={comment:"comment",like:"like",follow:"follow",join:"join",share:"share",donation:"donation",gift:"gift",subscribe:"subscribe"};
export const leKindOf=ev=>ev&&KIND_OF[ev.type]||null;

/** تحويل الحدث إلى سجل عرض موحّد */
export function leEntry(ev,now){ const k=leKindOf(ev); if(!k) return null;
 const u=ev.user||{}, don=k==="donation";
 const name=don?(ev.anonymous?"داعم مجهول":String(ev.name||"").slice(0,60)):String(u.name||u.nick||u.id||"").slice(0,60);
 const e={id:String(ev.id||k+"_"+now),kind:k,name,uid:don?"":String(u.id||name),av:don?(ev.anonymous?"":ev.avatar||""):(u.avatar||""),at:ev.t||now,test:!!ev.test};
 if(k==="like") e.count=Math.max(0,+ev.count||0);
 if(k==="comment") e.text=String(ev.text||"").slice(0,120);
 if(k==="gift"){ e.count=Math.max(1,+ev.count||1); e.gift=String(ev.gift||"هدية").slice(0,40); e.value=+ev.value||0 }
 if(don){ e.amount=Math.round((+ev.amount||0)*100)/100; e.currency=String(ev.currency||"SAR").toUpperCase(); e.message=String(ev.message||"").slice(0,120) }
 return e }

/** تحديث آخر حدث حقيقي (الغرفة) — اللايكات من نفس المستخدم خلال 15 ثانية تُجمع في نفس السجل */
export function latestOnEvent(L,ev,now){ if(!ev||ev.test) return false;
 if(ev.type==="donation_refund"){ const d=L.donation; if(d&&ev.id&&(d.id===ev.id||d.id===ev.ref)){ delete L.donation; return true } return false }
 const e=leEntry(ev,now); if(!e) return false; if(e.kind==="donation"&&!(e.amount>0)) return false;
 const p=L[e.kind];
 if(e.kind==="like"&&p&&p.uid===e.uid&&now-p.at<15000){ p.count+=e.count; p.at=now; p.id=e.id; return true }
 L[e.kind]=e; return true }

/** تعبئة القالب بقيم حقيقية فقط */
export function leText(tpl,e,money){ return String(tpl||"").replace(/\{user\}/g,e.name||"").replace(/\{count\}/g,e.count!=null?Number(e.count).toLocaleString("en-US"):"").replace(/\{gift\}/g,e.gift||"").replace(/\{text\}/g,e.text||"").replace(/\{title\}/g,e.title||"").replace(/\{amount\}/g,e.amount!=null&&money?money(e.amount,e.currency):"").trim() }

/** العناصر المشتقة: تُحسب من حالة الغرفة (أقوى داعم بالفترة، الأكثر تفاعلاً، آخر طالب أغنية) — لا أرقام وهمية */
export function leDerive(kind,src,lbEntriesFn,topsListFn){ const K=LE_KINDS[kind]; if(!K||!K.derived||!src) return null; const [t,a]=K.derived.split(":"); const now=Date.now()+(src.skew||0);
 let r=null;
 if(t==="tops"){ const L=topsListFn(src.C&&src.C.tops,a,now,180); if(L[0]) r={uid:L[0].id,name:L[0].name,av:L[0].av,count:L[0].v} }
 else if(t==="lb"){ const L=lbEntriesFn({source:a,topN:1},src); const x=L&&L[0]; if(x&&x.v>0) r={uid:String(x.k),name:x.name,av:x.av||"",count:x.v} }
 else if(t==="music"){ const q=src.C&&src.C.music&&src.C.music.lastReq; if(q) r={uid:q.id+"|"+q.qid,name:q.name,av:"",title:q.title,count:null} }
 if(!r) return null; return {id:kind+":"+r.uid,kind,at:now,...r} }
