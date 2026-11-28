/* ================= 💬 الشات المباشر والإدارة + الشات العائم =================
   صفحة في اللوحة (#pg) أو نافذة مستقلة (#float) أو Picture-in-Picture (فوق التطبيقات في Chrome/Edge) أو تطبيق الكمبيوتر (فوق الألعاب + وضع اللعب).
   الإجراءات: تُرسل للخادم (clock-op chatmod). الأصلية على المنصة تُنفَّذ فقط عبر الربط الرسمي والنتيجة الحقيقية تظهر (modres). */
const FLC_DESIGNS=[["basic","Basic Transparent","نص وأسماء على خلفية شفافة"],["hud","Gaming HUD","زوايا HUD وخط ثابت العرض"],["minimal","Minimal Text","سطر واحد: الاسم: الرسالة"],["glass","Floating Glass","بطاقات زجاجية عائمة"],["neon","Neon Blue","حواف نيون زرقاء متوهجة"],
 ["gold","Royal Gold","إطار ذهبي مزدوج"],["cyber","Cyberpunk","بطاقات مائلة صفراء/وردية"],["dark","Dark Premium","داكن مع خط ذهبي جانبي"],["rgb","RGB Gaming","إطار ألوان متحرك"],["holo","Holographic","نص قزحي هولوغرامي"],
 ["compact","Compact Chat","أسطر مكثفة صغيرة"],["cinema","Cinematic Chat","نص كبير في المنتصف بشريط سينمائي"],["saudi","Saudi Style","أخضر مع نقشة السدو"],["frosted","Frosted Glass","زجاج ثلجي فاتح"],["esports","Esports Chat","شريط فريق جانبي بلون المنصة"],
 ["bubble","Chat Bubbles","فقاعات متبادلة الجهة"],["terminal","Terminal","طرفية خضراء بموجه >"],["sticky","Sticky Notes","ملاحظات لاصقة مائلة"],["comic","Comic Balloons","بالونات كوميك بحدود سميكة"],["pixel","Pixel 8-bit","حواف بكسل"],
 ["ribbon","Name Ribbons","الاسم شريط ملون"],["timeline","Timeline","خط زمني بنقاط"],["tilt","3D Cards","بطاقات منظورية مائلة"],["outline","Outline Text","نص بحدود فقط بدون خلفية"],["stream","Side Stream","شريط جانبي ضيق متدرج"]];
const FLC_MODES=[["full","Full Chat","الشات كامل مع أدوات الإدارة والإحصائيات"],["gaming","Gaming Mode","صغير وشفاف فوق اللعبة"],["support","Support Only","الهدايا والدونيشن والدعم فقط"],["messages","Messages Only","رسائل المشاهدين فقط"],["minimal","Minimal Mode","الاسم والرسالة بدون زخارف"],["multi","Multi-Platform","كل المنصات مع شعار كل منصة"],["focus","Focus Mode","المهم والدعم والمثبتة فقط"]];
const FLC_PRESETS={transparent:{bg:0,card:0,frame:0,av:100,text:100,stats:70,sup:100},glass:{bg:15,card:45,frame:40,av:100,text:100,stats:80,sup:100},gaming:{bg:35,card:25,frame:20,av:80,text:100,stats:60,sup:90},full:{bg:85,card:80,frame:70,av:100,text:100,stats:100,sup:100}};
const FLC_OP=[["bg","خلفية الشات"],["card","بطاقات الرسائل"],["frame","الإطارات"],["av","صور المشاهدين"],["text","النصوص"],["stats","شريط الإحصائيات"],["sup","إشعارات الدعم"]];
const FLC_SUP=new Set(["gift","donation","superchat","cheer","subscribe","member","member_gift","follow","share"]);
const FLC_MUTES=[[30,"30 ثانية"],[60,"دقيقة"],[300,"5 دقائق"],[600,"10 دقائق"],[1800,"30 دقيقة"],[3600,"ساعة"],[86400,"24 ساعة"]];
const FLC_PLAT={tiktok:["TikTok","#25f4ee",u=>u.handle?`https://www.tiktok.com/@${u.handle}`:""],youtube:["YouTube","#ff0033",u=>u.uid?`https://www.youtube.com/channel/${u.uid}`:""],kick:["Kick","#53fc18",u=>u.name?`https://kick.com/${encodeURIComponent(u.name)}`:""],twitch:["Twitch","#9146ff",u=>u.name?`https://www.twitch.tv/${encodeURIComponent(u.name)}`:""]};
function FLCS(){ S.settings.flc=S.settings.flc||{}; const f=S.settings.flc; f.design=f.design||"glass"; f.mode=f.mode||"full"; f.op={...FLC_PRESETS.glass,...(f.op||{})}; f.preset=f.preset||"glass"; f.font=f.font||15; f.av=f.av||30;
 f.stats=f.stats||{viewers:true,views:true,money:true,coins:true,follows:true,taps:true,dur:true,conn:true}; f.plats=f.plats||{tiktok:true,youtube:true,kick:true,twitch:true}; f.anim=f.anim!==false; f.sounds=!!f.sounds; f.low=!!f.low; f.bar=f.bar!==false; return f }
const FLCV=()=>(S.flcv=S.flcv||{q:"",pause:false,sup:false,pins:false,menu:null,list:[]});
const flcIsFloat=()=>document.body.classList.contains("flc-only");
function flcMod(){ return (R.C&&R.C.mod)||{u:{},hid:[],pin:null,auto:modAutoCfg({}),log:[]} }
function flcCaps(){ const c=S.conns||{}, x={}; for(const p of Object.keys(FLC_PLAT)) x[p]={connected:!!(c[p]&&c[p].status==="connected")}; return modCaps(x) }
function flcMsgs(){ const f=FLCS(), V=FLCV(), M=flcMod(), now=Date.now(), q=lc(V.q).trim(); let L=(R.CHAT||[]).slice(-200);
 L=L.filter(m=>f.plats[m.platform]!==false&&!modHidden(M,m,now));
 if(f.mode==="support"||V.sup) L=L.filter(m=>FLC_SUP.has(m.kind)); else if(f.mode==="messages") L=L.filter(m=>m.kind==="msg");
 else if(f.mode==="focus") L=L.filter(m=>m.kind!=="msg"||m.mod||m.owner||chatImportant(m,{})||(M.pin&&M.pin.m.id===m.id));
 if(q) L=L.filter(m=>lc(m.name).includes(q)||lc(m.text).includes(q));
 return L.slice(-(f.low?60:150)) }
function flcRow(m){ const f=FLCS(), P=FLC_PLAT[m.platform]||["","#888"], M=flcMod(), u=M.u[modKey(m.platform,m.uid)]||{}, sup=m.kind!=="msg";
 const ic={gift:"🎁",follow:"➕",share:"🔗",subscribe:"⭐",member:"⭐",cheer:"💎",raid:"⚔️",join:"👋"}[m.kind]||"✨";
 const txt=m.kind==="msg"?esc(m.text):m.kind==="donation"||m.kind==="superchat"?`💵 <b>${esc(m.amount!=null?fmtMoney(m.amount,m.currency||"USD"):"")}</b> ${esc(m.text||"")}`:`${ic} ${esc(m.text||m.kind)}`;
 return `<div class="flc-m ${sup?"sup k-"+m.kind:""} ${u.mod||m.mod?"is-mod":""}" data-id="${esc(m.id)}" data-p="${m.platform}" data-uid="${esc(m.uid)}" style="--pc:${P[1]}">
  ${f.mode==="minimal"?"":`<span class="flc-av">${m.av?`<img src="${esc(m.av)}" alt="" loading="lazy">`:esc((m.name||"?").slice(0,1))}</span>`}
  <div class="flc-b"><span class="flc-n" data-flc="menu">${f.mode==="minimal"?"":`<i class="flc-pl">${UC_ICONS[m.platform]||""}</i>`}${esc(m.name)}${u.mod||m.mod?' <i class="flc-badge">🛡️</i>':""}${f.mode==="minimal"?":":""}</span><span class="flc-t">${txt}</span></div></div>` }
function flcStatsHTML(){ const f=FLCS(), s=f.stats, sum=statsSummary(R.C||{},Date.now()), t=sum.total||{}, D=R.D&&R.D.tot||{}, it=[];
 const nf=v=>v==null?"غير متاح":fmt(v);
 if(s.viewers) it.push(["👁️","الآن",nf(t.viewers)]); if(s.views) it.push(["📊","المشاهدات",nf(t.views)]);
 if(s.money){ const mm=Object.entries(t.money||{}).filter(([,v])=>v>0).map(([c,v])=>fmtMoney(v,c)).join(" + "); it.push(["💰","الدعم",mm||"0"]) } if(s.coins) it.push(["🪙","كوين",fmt(t.coins||0)]);
 if(s.follows){ const sc=R.C&&R.C.live&&R.C.live.scopes; it.push(["➕",sc&&sc.follows?"متابعون جدد (هذا البث)":"متابعات مسجّلة منذ آخر تصفير",fmt(D.follows||0)]) } // لا نسمّيها «جدد» إن لم تكن تُصفّر مع كل بث if(s.taps) it.push(["👆","تكبيسات",fmt(D.likes||0)]);
 if(s.dur){ const st=R.C&&R.C.live&&R.C.live.streamStart||R.C&&R.C.live&&R.C.live.startedAt; if(st&&!(R.C.live.endedAt)){ const sec=Math.max(0,(Date.now()-st)/1000|0), d=sec/86400|0, h=(sec%86400)/3600|0, mi=(sec%3600)/60|0; it.push(["⏱️","مدة البث",(d?d+"ي ":"")+String(h).padStart(2,"0")+":"+String(mi).padStart(2,"0")]) } else it.push(["⏱️","مدة البث","—"]) }
 const conn=s.conn?Object.entries(FLC_PLAT).map(([p,[n]])=>{ const row=(sum.rows||[]).find(r=>r.k===p); const on=p==="tiktok"?!!(S.tk&&S.tk.state==="connected")||!!(S.perf&&S.perf.conn&&S.perf.conn.live):!!(S.conns&&S.conns[p]&&S.conns[p].status==="connected")||!!(S.pub&&S.pub[p]&&S.pub[p].status==="connected"); return `<i class="flc-cn ${on?"on":""}" title="${n}: ${on?"متصل":"غير متصل"}">${UC_ICONS[p]||""}</i>` }).join(""):"";
 return `<div class="flc-stats">${it.map(([i,l,v])=>`<span title="${l}">${i}<b>${esc(String(v))}</b></span>`).join("")}${conn?`<span class="flc-conns">${conn}</span>`:""}</div>` }
function flcPinHTML(){ const P=modPinActive(flcMod(),Date.now()); if(!P) return ""; const m=P.m; const left=P.until?Math.max(0,Math.ceil((P.until-Date.now())/1000)):0;
 return `<div class="flc-pin"><span>📌</span>${m.av?`<img src="${esc(m.av)}" alt="">`:""}<div><b><i class="flc-pl">${UC_ICONS[m.platform]||""}</i>${esc(m.name)}</b><span>${esc(m.text)}</span></div>${left?`<em>${left}ث</em>`:""}<button class="flc-x" data-flc="unpin" title="إلغاء التثبيت">✕</button></div>` }
function flcVars(){ const f=FLCS(), o=f.op; return `--fc-bg:${o.bg/100};--fc-card:${o.card/100};--fc-frame:${o.frame/100};--fc-avo:${o.av/100};--fc-txt:${o.text/100};--fc-st:${o.stats/100};--fc-sup:${o.sup/100};--fc-fs:${f.font}px;--fc-avs:${f.av}px` }
function flcToolbar(){ const f=FLCS(), V=FLCV(), D=window.b6o6Desktop;
 const b=(k,ic,t,on,dis)=>`<button class="flc-tb ${on?"on":""}" data-flc="${k}" title="${t}" ${dis?"data-dis=1":""}>${ic}</button>`;
 return `<div class="flc-bar ${f.bar?"":"hidden"}">
  ${flcIsFloat()?"":b("open","🪟","فتح الشات العائم")}
  ${b("ontop","📌","تثبيت فوق التطبيقات"+(D?"":" (يتطلب تطبيق الكمبيوتر أو نافذة PiP)"),D&&D.state&&D.state.onTop,!D)}
  ${b("game","🎮","وضع اللعب: تمر ضغطات الماوس للعبة"+(D?"":" (يتطلب تطبيق الكمبيوتر)"),D&&D.state&&D.state.clickThrough,!D)}
  ${b("op","🌗","الشفافية",S.flcPanel==="op")}${b("pause",V.pause?"▶":"⏸",V.pause?"استئناف التمرير التلقائي":"إيقاف التمرير التلقائي",V.pause)}
  <input class="flc-q" type="search" placeholder="🔎 بحث" value="${esc(V.q)}" data-flcf="q">
  ${b("plat","🌐","فلترة المنصات",S.flcPanel==="plat")}${b("sup","💰","الدعم فقط",V.sup)}${b("pins","📌","الرسائل المثبتة",V.pins)}
  ${b("modset","🛡️","إعدادات الإشراف",S.flcPanel==="mod")}${b("design","🎨","التصميم والأوضاع",S.flcPanel==="design")}${b("min","▁","إخفاء شريط الأدوات")}</div>
  ${f.bar?"":`<button class="flc-show" data-flc="min" title="إظهار شريط الأدوات">⋯</button>`}` }
function flcPanelHTML(){ const f=FLCS(), M=flcMod(), A=M.auto;
 if(S.flcPanel==="op") return `<div class="flc-panel"><div class="flc-presets">${[["transparent","الشفاف بالكامل"],["glass","الزجاجي"],["gaming","وضع الألعاب"],["full","الكامل"]].map(([k,l])=>`<button class="btn sm ${f.preset===k?"pri":""}" data-flc="preset" data-k="${k}">${l}</button>`).join("")}<button class="btn sm ${f.preset==="custom"?"pri":""}" data-flc="preset" data-k="custom">مخصص</button></div>
  ${FLC_OP.map(([k,l])=>`<label>${l} <b>${f.op[k]}%</b><input type="range" min="0" max="100" value="${f.op[k]}" data-flcf="op.${k}"></label>`).join("")}
  <label>حجم الخط <b>${f.font}px</b><input type="range" min="10" max="28" value="${f.font}" data-flcf="font"></label><label>حجم الصور <b>${f.av}px</b><input type="range" min="0" max="56" value="${f.av}" data-flcf="av"></label></div>`;
 if(S.flcPanel==="plat") return `<div class="flc-panel row">${Object.entries(FLC_PLAT).map(([p,[n]])=>`<label class="flc-chk"><input type="checkbox" data-flcf="plat.${p}" ${f.plats[p]!==false?"checked":""}> ${UC_ICONS[p]||""} ${n}</label>`).join("")}</div>`;
 if(S.flcPanel==="design") return `<div class="flc-panel"><b>الوضع</b><div class="flc-modes">${FLC_MODES.map(([k,n,d])=>`<button class="flc-mode ${f.mode===k?"on":""}" data-flc="mode" data-k="${k}" title="${d}"><b>${n}</b><span>${d}</span></button>`).join("")}</div>
  <b>التصميم (${FLC_DESIGNS.length})</b><div class="flc-dgal">${FLC_DESIGNS.map(([k,n,d])=>`<button class="flc-dg ${f.design===k?"on":""}" data-flc="dsg" data-k="${k}" title="${d}"><div class="flc-dpv flcd-${k}">${flcSampleRows()}</div><b>${n}</b></button>`).join("")}</div>
  <b>الإحصائيات أعلى الشات</b><div class="row">${[["viewers","المشاهدين الآن"],["views","إجمالي المشاهدات"],["money","الدعم المالي"],["coins","الهدايا والكوين"],["follows","المتابعون الجدد"],["taps","التكبيسات"],["dur","مدة البث"],["conn","حالة المنصات"]].map(([k,l])=>`<label class="flc-chk"><input type="checkbox" data-flcf="st.${k}" ${f.stats[k]?"checked":""}> ${l}</label>`).join("")}</div>
  <div class="row"><label class="flc-chk"><input type="checkbox" data-flcf="anim" ${f.anim?"checked":""}> الحركات</label><label class="flc-chk"><input type="checkbox" data-flcf="sounds" ${f.sounds?"checked":""}> أصوات المكتبة داخل الشات العائم</label><label class="flc-chk"><input type="checkbox" data-flcf="low" ${f.low?"checked":""}> وضع أداء منخفض</label></div>
  ${window.b6o6Desktop?`<b>⌨️ اختصارات تطبيق الكمبيوتر</b><div class="row">${[["show","إظهار/إخفاء الشات"],["game","وضع اللعب"],["lock","قفل المكان"],["onTop","فوق التطبيقات"],["opacity","شفافية كاملة/جزئية"],["display","نقل للشاشة التالية"]].map(([k,l])=>`<label>${l}<input class="inp" value="${esc((window.b6o6Desktop.state&&window.b6o6Desktop.state.keys||{})[k]||"")}" data-flcf="key.${k}" placeholder="Control+Shift+X"></label>`).join("")}</div>`:`<p class="muted">🖥️ البقاء فوق الألعاب ووضع اللعب والاختصارات العامة تعمل في <a href="https://github.com/ssbtotss-netizen/arsh-live/releases/latest/download/B6O6-Streaming-Setup.exe" target="_blank" rel="noopener">تطبيق الكمبيوتر</a>. في Chrome/Edge يمكن فتح الشات كنافذة PiP تبقى فوق التطبيقات (بدون تمرير الماوس).</p>`}
  <p class="muted">الأصوات هنا للأحداث التي ليس لها صوت في OBS فقط (لا تكرار). الشات العائم خاص بشاشتك — للمشاهدين استخدم «الشات الموحد» في OBS.</p></div>`;
 if(S.flcPanel==="mod") return `<div class="flc-panel"><label class="flc-chk"><input type="checkbox" data-flcf="am.on" ${A.on?"checked":""}> <b>تفعيل الإشراف التلقائي</b></label>
  <div class="row">${[["profanity","الكلمات المسيئة والسب"],["dup","الرسائل المكررة"],["spam","السبام"],["links","الروابط غير المصرح بها"]].map(([k,l])=>`<label class="flc-chk"><input type="checkbox" data-flcf="am.${k}" ${A[k]?"checked":""}> ${l} <select data-flcf="ama.${k}">${[["warn","تنبيه"],["hide","إخفاء محلي"],["delete","حذف"],["timeout","كتم مؤقت"],["ban","حظر"]].map(([v,n])=>`<option value="${v}" ${A.action[k]===v?"selected":""}>${n}</option>`).join("")}</select></label>`).join("")}</div>
  <label>كلمات ممنوعة (افصل بفاصلة)<textarea class="inp" rows="2" data-flcf="am.words">${esc(A.words.join("، "))}</textarea></label>
  <label>نطاقات روابط مسموحة<input class="inp" value="${esc(A.allowDomains.join("، "))}" data-flcf="am.allowDomains"></label>
  <div class="row"><label class="flc-chk"><input type="checkbox" data-flcf="am.rate" ${A.rate.on?"checked":""}> حد الرسائل</label><input class="inp snd-num" type="number" min="1" value="${A.rate.n}" data-flcf="am.rateN"> رسائل خلال <input class="inp snd-num" type="number" min="2" value="${A.rate.sec}" data-flcf="am.rateSec"> ث · مدة الكتم التلقائي <input class="inp snd-num" type="number" min="10" value="${A.timeoutSec}" data-flcf="am.timeoutSec"> ث</div>
  <label>مستخدمون مسموح لهم دائماً<input class="inp" value="${esc(A.allow.join("، "))}" data-flcf="am.allow"></label><label>مستخدمون محظورون<input class="inp" value="${esc(A.block.join("، "))}" data-flcf="am.block"></label>
  <label class="flc-chk"><input type="checkbox" data-flcf="am.exemptMods" ${A.exemptMods?"checked":""}> استثناء المشرفين</label>
  <label class="flc-chk warn"><input type="checkbox" data-flcf="am.native" ${A.native?"checked":""}> تنفيذ الحذف/الكتم/الحظر التلقائي على المنصة الأصلية أيضاً (اختياري — يتطلب ربطاً رسمياً بصلاحيات الإدارة؛ TikTok محلي دائماً)</label>
  <b>آخر إجراءات الإدارة</b><div class="flc-log">${(M.log||[]).slice(0,12).map(e=>`<div>${e.auto?"🤖":"👤"} ${esc(MOD_ACT_LABEL[e.act]||e.act)} — <b>${esc(e.name||e.uid)}</b> <span class="muted">${FLC_PLAT[e.platform]?FLC_PLAT[e.platform][0]:""} ${e.reason?"· "+esc(e.reason):""}</span></div>`).join("")||'<span class="muted">لا شيء بعد</span>'}</div></div>`;
 return "" }
function flcSampleRows(){ return [["أحمد","السلام عليكم 👋","tiktok"],["سارة","بث أسطوري","youtube"],["خالد","GG","kick"]].map(([n,t,p])=>`<div class="flc-m" style="--pc:${FLC_PLAT[p][1]}"><span class="flc-av">${n[0]}</span><div class="flc-b"><span class="flc-n">${n}</span><span class="flc-t">${t}</span></div></div>`).join("") }
function flcHTML(){ const f=FLCS(), V=FLCV(), M=flcMod();
 const top=flcIsFloat()?"":`<div class="flc-pagehead"><div><h2>💬 الشات المباشر والإدارة</h2><p class="muted">اضغط اسم المشاهد أو زر الماوس الأيمن على رسالته لإدارته. المنصات: ${Object.entries(flcCaps()).map(([p,c])=>`<span class="flc-cap ${c.native.length?"on":""}" title="${esc(c.note)}">${UC_ICONS[p]||""} ${c.native.length?"إدارة على المنصة":"محلي فقط"}</span>`).join(" ")}</p></div>
  <div class="row"><button class="btn pri" data-flc="open">🪟 فتح الشات العائم</button><a class="btn" href="https://github.com/ssbtotss-netizen/arsh-live/releases/latest/download/B6O6-Streaming-Setup.exe" target="_blank" rel="noopener">⬇️ تحميل الشات العائم للكمبيوتر</a><button class="btn" data-flc="privacy">🔒 الخصوصية واختبار الظهور</button></div></div>`;
 const list=flcMsgs(), pins=V.pins?`<div class="flc-pins">${(M.pin?[M.pin]:[]).map(()=>flcPinHTML()).join("")||'<p class="muted">لا توجد رسالة مثبتة</p>'}</div>`:"";
 return `${top}<div class="flc-root flcd-${f.design} flm-${f.mode} ${f.anim&&!f.low&&!window.__arshExplore?"":"flc-still"} ${f.low?"flc-low":""}" style="${flcVars()}">${flcToolbar()}${flcPanelHTML()}${flcStatsHTML()}${flcPinHTML()}${pins}
  <div class="flc-list" id="flc-list">${list.map(flcRow).join("")}</div>${V.pause?`<button class="flc-resume" data-flc="pause">⬇️ رسائل جديدة — استئناف</button>`:""}</div>` }
/** رسالة جديدة: إضافة صف فقط (لا إعادة رسم كاملة) */
function flcOnEvent(ev){ if(S.page!=="livechat"&&!flcIsFloat()) return; const L=document.getElementById("flc-list"); if(!L) return; const m=chatMsgOf(ev); if(!m||m.test&&!S.flcShowTest) return;
 const f=FLCS(), V=FLCV(); if(L.querySelector(`[data-id="${CSS.escape(m.id)}"]`)) return;
 if(!flcMsgs().some(x=>x.id===m.id)) return; // مُرشَّح (منصة/وضع/مكتوم)
 const tmp=document.createElement("div"); tmp.innerHTML=flcRow(m); const el=tmp.firstElementChild; L.appendChild(el); if(f.anim&&!f.low&&!window.__arshExplore) el.classList.add("flc-in");
 const cap=f.low?60:150; while(L.children.length>cap) L.firstElementChild.remove();
 if(!V.pause) L.scrollTop=L.scrollHeight; else if(!document.querySelector(".flc-resume")) flcRefresh();
 if(f.sounds&&FLC_SUP.has(m.kind)&&!sndHasPlayer()) flcSound(ev) }
function flcSound(ev){ try{ const c=SC(); const items=sndOnEvent(c,(S.flcSndSt=S.flcSndSt||sndNewState()),ev,Date.now(),{totalLikes:R.D&&R.D.tot&&R.D.tot.likes}); const it=items[0]; if(!it) return; const a=new Audio(sndPrevUrl(it.s.src)); a.volume=Math.min(1,(it.s.vol/100)*(c.vol/100)); a.play().catch(()=>{}) }catch(e){} }
function flcRefresh(){ if(S.page==="livechat"||flcIsFloat()){ const st=document.querySelector(".flc-list"); const keep=st&&FLCV().pause?st.scrollTop:null; renderPage(true); const L=document.getElementById("flc-list"); if(L){ if(keep!=null) L.scrollTop=keep; else L.scrollTop=L.scrollHeight } } }
function flcSave(){ save(); if(window.b6o6Desktop&&window.b6o6Desktop.saveSettings) window.b6o6Desktop.saveSettings(FLCS()) }
function flcAct(a,native){ const caps=flcCaps()[a.platform]||{native:[]}; const nat=native!==false&&caps.native.includes(a.act==="unmute"?"unban":a.act);
 send({t:"clock-op",target:"chatmod",op:"act",a:{...a,native:nat}}); toast(nat?"⏳ جاري التنفيذ على "+FLC_PLAT[a.platform][0]+"…":"✅ "+(MOD_ACT_LABEL[a.act]||"تم")+" — داخل B6O6 فقط"+(a.platform==="tiktok"?" (TikTok لا يتيح إدارة الشات رسمياً)":"")) }
/** قائمة إدارة المشاهد: تظهر فقط الإجراءات المتاحة فعلاً، مع توضيح «محلي» و«على المنصة» */
function flcMenu(row,x,y){ const id=row.dataset.id, p=row.dataset.p, uid=row.dataset.uid, m=(R.CHAT||[]).find(z=>z.id===id)||{id,platform:p,uid,name:row.querySelector(".flc-n")?.textContent||""}, M=flcMod(), u=M.u[modKey(p,uid)]||{};
 const caps=flcCaps()[p]||{native:[],note:"",max:0}, nat=k=>caps.native.includes(k), tag=k=>nat(k)?`<em class="on">على ${FLC_PLAT[p][0]}</em>`:`<em>محلي</em>`;
 const mutes=FLC_MUTES.filter(([s])=>!nat("timeout")||s<=caps.max);
 const recent=(R.CHAT||[]).filter(z=>z.platform===p&&z.uid===uid&&z.kind==="msg").slice(-5);
 const url=(FLC_PLAT[p][2]||(()=>""))(m);
 document.querySelectorAll(".flc-menu").forEach(e=>e.remove()); const el=document.createElement("div"); el.className="flc-menu";
 el.innerHTML=`<div class="flc-mh"><i class="flc-pl">${UC_ICONS[p]||""}</i><b>${esc(m.name)}</b><span class="muted">${FLC_PLAT[p][0]}</span></div><p class="flc-note">${esc(caps.note)}</p>
  ${u.mute>Date.now()?`<button data-fm="unmute">🔊 إلغاء الكتم ${tag("unban")}</button>`:`<div class="flc-sub"><span>🔇 كتم مؤقت ${tag("timeout")}</span><div>${mutes.map(([s,l])=>`<button data-fm="timeout" data-sec="${s}">${l}</button>`).join("")}<button data-fm="timeout" data-sec="custom">مدة مخصصة…</button></div></div>`}
  ${u.ban?`<button data-fm="unban">✅ فك الحظر ${tag("unban")}</button>`:`<button data-fm="ban" class="dng">⛔ حظر ${tag("ban")}</button>`}
  ${m.kind==="msg"?`<button data-fm="delete">🗑️ حذف الرسالة ${tag("delete")}</button><div class="flc-sub"><span>📌 تثبيت داخل B6O6</span><div>${[[30,"30 ث"],[60,"دقيقة"],[300,"5 د"],[0,"حتى الإلغاء"]].map(([s,l])=>`<button data-fm="pin" data-sec="${s}">${l}</button>`).join("")}</div></div><button data-fm="pinnative" class="muted">📌 تثبيت في ${FLC_PLAT[p][0]} <em>غير متاح عبر الواجهة الرسمية</em></button>`:""}
  ${M.pin&&M.pin.m.id===id?`<button data-fm="unpin">📍 إلغاء التثبيت</button>`:""}
  ${u.mod?`<button data-fm="unmod">🛡️ إزالة صلاحية المشرف ${tag("unmod")}</button>`:`<button data-fm="mod">🛡️ تعيين مشرفاً ${tag("mod")}</button>`}
  ${url?`<a href="${esc(url)}" target="_blank" rel="noopener">👤 فتح حساب المشاهد</a>`:""}<button data-fm="copy">📋 نسخ اسم المستخدم</button>
  <div class="flc-sub"><span>💬 آخر رسائله (${recent.length})</span><div class="flc-recent">${recent.map(z=>`<p>${esc(z.text)}</p>`).join("")||'<p class="muted">لا رسائل متاحة</p>'}</div></div>
  ${url?`<a href="${esc(url)}" target="_blank" rel="noopener">🚩 الإبلاغ (من صفحة المشاهد في ${FLC_PLAT[p][0]})</a>`:""}<button data-fm="hidelocal">🙈 إخفاء رسائله محلياً فقط</button>`;
 document.body.appendChild(el); const r=el.getBoundingClientRect(); el.style.left=Math.max(6,Math.min(x,innerWidth-r.width-6))+"px"; el.style.top=Math.max(6,Math.min(y,innerHeight-r.height-6))+"px";
 el.onclick=e=>{ const b=e.target.closest("[data-fm]"); if(!b) return; const k=b.dataset.fm, base={platform:p,uid,name:m.name,msgId:id};
  if(k==="timeout"){ let s=b.dataset.sec; if(s==="custom"){ const v=prompt("مدة الكتم بالدقائق",""+10); if(!v) return; s=Math.round(+v*60) } flcAct({...base,act:"timeout",sec:+s}) }
  else if(k==="unmute") flcAct({...base,act:"unmute"}); else if(k==="ban"){ if(!confirm("حظر "+m.name+"؟")) return; flcAct({...base,act:"ban"}) } else if(k==="unban") flcAct({...base,act:"unban"});
  else if(k==="delete") flcAct({...base,act:"delete"}); else if(k==="mod") flcAct({...base,act:"mod"}); else if(k==="unmod") flcAct({...base,act:"unmod"});
  else if(k==="hidelocal") flcAct({...base,act:"timeout",sec:30*86400},false);
  else if(k==="pin"){ send({t:"clock-op",target:"chatmod",op:"pin",msgId:id,msg:m,sec:+b.dataset.sec}); toast("📌 تم التثبيت داخل B6O6 (اللوحة + OBS + الشات العائم)") }
  else if(k==="pinnative") return toast("المنصات لا تتيح تثبيت الرسائل عبر واجهاتها الرسمية المتاحة لنا حالياً — استخدم «تثبيت داخل B6O6»");
  else if(k==="unpin"){ send({t:"clock-op",target:"chatmod",op:"unpin"}); toast("أُلغي التثبيت") }
  else if(k==="copy"){ copy(m.name) }
  el.remove() };
 setTimeout(()=>document.addEventListener("click",function h(e){ if(!el.contains(e.target)){ el.remove(); document.removeEventListener("click",h) } }),0) }
async function flcOpen(){ const D=window.b6o6Desktop; if(D&&D.openFloat) return D.openFloat();
 // Chrome/Edge: نافذة Picture-in-Picture تبقى فوق التطبيقات الأخرى (لا تعمل فوق الألعاب بملء الشاشة الحصري ولا تمرّر الماوس)
 if(window.documentPictureInPicture&&!S.flcPipFailed){ try{ const pw=await documentPictureInPicture.requestWindow({width:380,height:620});
   [...document.styleSheets].forEach(ss=>{ try{ const s=document.createElement("style"); s.textContent=[...ss.cssRules].map(r=>r.cssText).join("\n"); pw.document.head.appendChild(s) }catch(e){ if(ss.href){ const l=document.createElement("link"); l.rel="stylesheet"; l.href=ss.href; pw.document.head.appendChild(l) } } });
   pw.document.documentElement.dir="rtl"; pw.document.body.className="flc-only flc-pip"; S.flcPip=pw; flcPipRender(); pw.addEventListener("pagehide",()=>{ S.flcPip=null }); toast("🪟 الشات العائم فوق التطبيقات (نافذة PiP)"); return }catch(e){ S.flcPipFailed=true } }
 window.open(location.href.split("#")[0]+"#float","b6o6float","width=400,height=650"); toast("🪟 فُتح الشات العائم — لإبقائه فوق الألعاب استخدم تطبيق الكمبيوتر") }
function flcPipRender(){ const pw=S.flcPip; if(!pw) return; pw.document.body.innerHTML=flcHTML(); const L=pw.document.getElementById("flc-list"); if(L) L.scrollTop=L.scrollHeight;
 pw.document.body.onclick=e=>{ const b=e.target.closest("[data-flc]"); if(b) flcClick(b,e) }; pw.document.body.oncontextmenu=e=>{ const r=e.target.closest(".flc-m[data-id]"); if(r){ e.preventDefault(); flcMenu(r,e.clientX,e.clientY) } } }
function flcClick(b,e){ const d=b.dataset, k=d.flc, f=FLCS(), V=FLCV(), D=window.b6o6Desktop; if(!k) return false;
 if(k==="menu"){ const r=b.closest(".flc-m"); if(r&&r.dataset.id) flcMenu(r,e.clientX,e.clientY); return true }
 if(k==="open"){ flcOpen(); return true }
 if(k==="ontop"){ if(!D) return toast("يتطلب تطبيق الكمبيوتر — أو افتح الشات العائم (PiP) في Chrome/Edge ليبقى فوق التطبيقات"), true; D.toggle("onTop").then(()=>flcRefresh()); return true }
 if(k==="game"){ if(!D) return toast("وضع اللعب (تمرير الماوس للعبة) يعمل في تطبيق الكمبيوتر فقط"), true; D.toggle("clickThrough").then(()=>flcRefresh()); return true }
 if(k==="pause"){ V.pause=!V.pause; flcRefresh(); return true } if(k==="sup"){ V.sup=!V.sup; flcRefresh(); return true } if(k==="pins"){ V.pins=!V.pins; flcRefresh(); return true }
 if(["op","plat","design"].includes(k)||k==="modset"){ const pk=k==="modset"?"mod":k; S.flcPanel=S.flcPanel===pk?null:pk; flcRefresh(); return true }
 if(k==="min"){ f.bar=!f.bar; flcSave(); flcRefresh(); return true }
 if(k==="preset"){ f.preset=d.k; if(FLC_PRESETS[d.k]) f.op={...FLC_PRESETS[d.k]}; flcSave(); flcRefresh(); return true }
 if(k==="mode"){ f.mode=d.k; if(d.k==="gaming"){ f.op={...FLC_PRESETS.gaming}; f.preset="gaming"; f.font=13; f.av=22 } if(d.k==="minimal") f.design="minimal"; flcSave(); flcRefresh(); return true }
 if(k==="dsg"){ f.design=d.k; flcSave(); flcRefresh(); return true }
 if(k==="unpin"){ send({t:"clock-op",target:"chatmod",op:"unpin"}); return true }
 if(k==="privacy"){ modal(`<h3>🔒 خصوصية الشات</h3><p><b>شات خاص بك:</b> الشات العائم يظهر على شاشتك فقط ولا يُضاف لمشهد البث. في تطبيق الكمبيوتر نطلب من ويندوز استبعاد نافذته من التقاط الشاشة (Windows 10 2004+). هذا يعتمد على طريقة الالتقاط: «Window Capture» و«Display Capture» الحديثة في OBS وTikTok LIVE Studio تحترمه عادةً، لكن ليس كل برامج الالتقاط.</p>
  <p><b>شات ظاهر للمشاهدين:</b> أضف «الشات الموحد» كـ Browser Source في OBS أو رابط في TikTok LIVE Studio.</p><p><b>اختبار:</b> اضغط الزر — تظهر علامة كبيرة في الشات العائم لمدة 20 ثانية. انظر لمعاينة OBS/LIVE Studio: إن ظهرت فالشات يظهر في البث.</p>
  <div class="row"><button class="btn pri" data-close onclick="window.__flcProbe&&window.__flcProbe()">🧪 بدء الاختبار</button><button class="btn" data-close>إغلاق</button></div>`); return true }
 return false }
window.__flcProbe=()=>{ const show=doc=>{ const el=doc.createElement("div"); el.className="flc-probe"; el.textContent="🔒 اختبار الخصوصية — هل ترى هذه العلامة في البث؟"; doc.body.appendChild(el); setTimeout(()=>el.remove(),20000) }; show(document); if(S.flcPip) show(S.flcPip.document); if(window.b6o6Desktop&&window.b6o6Desktop.probe) window.b6o6Desktop.probe() };
function flcInput(t,e){ const k=t.dataset&&t.dataset.flcf; if(!k) return false; const f=FLCS(), live=e.type==="input", M=flcMod();
 if(k==="q"){ if(!live) return true; FLCV().q=t.value; clearTimeout(flcInput.qt); flcInput.qt=setTimeout(()=>{ flcRefresh(); const i=document.querySelector('[data-flcf="q"]'); if(i){ i.focus(); i.setSelectionRange(i.value.length,i.value.length) } },220); return true }
 if(k.startsWith("op.")){ f.op[k.slice(3)]=+t.value; f.preset="custom"; const r=document.querySelector(".flc-root"); if(r) r.setAttribute("style",flcVars()); const lb=t.parentElement.querySelector("b"); if(lb) lb.textContent=t.value+"%"; if(!live) flcSave(); return true }
 if(k==="font"||k==="av"){ f[k]=+t.value; const r=document.querySelector(".flc-root"); if(r) r.setAttribute("style",flcVars()); const lb=t.parentElement.querySelector("b"); if(lb) lb.textContent=t.value+"px"; if(!live) flcSave(); return true }
 if(live&&t.type!=="checkbox") return true;
 if(k.startsWith("key.")&&window.b6o6Desktop){ const keys={...(window.b6o6Desktop.state&&window.b6o6Desktop.state.keys||{}),[k.slice(4)]:t.value.trim()}; window.b6o6Desktop.setKeys(keys).then(r=>toast(r&&r.ok?"⌨️ حُفظ الاختصار":"⚠️ الاختصار مستخدم في برنامج آخر: "+((r&&r.failed)||[]).join("، "))); return true }
 if(k.startsWith("plat.")){ f.plats[k.slice(5)]=t.checked; flcSave(); flcRefresh(); return true } if(k.startsWith("st.")){ f.stats[k.slice(3)]=t.checked; flcSave(); flcRefresh(); return true }
 if(k==="anim"||k==="sounds"||k==="low"){ f[k]=t.checked; flcSave(); flcRefresh(); return true }
 if(k.startsWith("am")){ const A=JSON.parse(JSON.stringify(M.auto||{})); const x=k.split(".")[1];
  if(k.startsWith("ama.")) A.action[x]=t.value; else if(x==="words"||x==="allowDomains"||x==="allow"||x==="block") A[x]=t.value; else if(x==="rate") A.rate.on=t.checked; else if(x==="rateN") A.rate.n=+t.value; else if(x==="rateSec") A.rate.sec=+t.value; else if(x==="timeoutSec") A.timeoutSec=+t.value;
  else if(x==="native"&&t.checked&&!confirm("تنفيذ الإجراءات التلقائية على المنصة الأصلية؟ (حذف/كتم/حظر حقيقي على YouTube/Twitch/Kick حسب الربط والصلاحيات)")){ t.checked=false; return true } else A[x]=t.checked;
  send({t:"clock-op",target:"chatmod",op:"auto",auto:A}); toast("🛡️ حُفظت إعدادات الإشراف"); return true }
 return false }
// النافذة المستقلة: الشات فقط
if(location.hash==="#float"){ document.body.classList.add("flc-only"); setTimeout(()=>{ S.page="livechat"; renderPage() },0) }
// تحديث الإحصائيات والتثبيت كل ثانيتين بدون إعادة رسم الرسائل
setInterval(()=>{ if(S.page!=="livechat"&&!flcIsFloat()&&!S.flcPip) return; const st=document.querySelector(".flc-stats"); if(st){ const t=document.createElement("div"); t.innerHTML=flcStatsHTML(); st.replaceWith(t.firstElementChild) }
 const pin=document.querySelector(".flc-root .flc-pin"), ph=flcPinHTML(); if(pin&&!ph) pin.remove(); else if(pin&&ph){ const t=document.createElement("div"); t.innerHTML=ph; pin.replaceWith(t.firstElementChild) } else if(!pin&&ph) flcRefresh();
 if(S.flcPip){ const L=S.flcPip.document.getElementById("flc-list"); const cur=L?L.children.length:0; if(cur!==flcMsgs().length) flcPipRender() } },2000);
// تطبيق الكمبيوتر يرسل تغيّر الحالة (فوق التطبيقات / وضع اللعب) والاختصارات
if(window.b6o6Desktop&&window.b6o6Desktop.onState) window.b6o6Desktop.onState(()=>flcRefresh());

// اختصار «الشفافية الكاملة/الجزئية» من تطبيق الكمبيوتر
window.addEventListener("b6o6-opacity",()=>{ const f=FLCS(); const to=f.preset==="transparent"?"glass":"transparent"; f.preset=to; f.op={...FLC_PRESETS[to]}; flcSave(); flcRefresh() });
