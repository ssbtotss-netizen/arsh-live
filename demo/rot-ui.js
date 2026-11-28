/* ===================== 🔁 القوائم المتناوبة — B6O6 Fantastic Smart Rotation V1 ===================== */
/* المجموعة = عنصر «rotator» في التخطيط برابط OBS مستقل. القوائم داخلها مراجع لعناصر التخطيط (نفس التصميم والإعدادات). */

const ROT_CAT=[
 ["likes","❤️ أقوى المكبسين",{type:"lb",source:"likes",title:"أقوى المكبسين",design:"b6o6Halo"}],
 ["gifts","🎁 أقوى الداعمين",{type:"lb",source:"gifts",title:"أقوى الداعمين",design:"goldenHalo"}],
 ["last5","🧾 آخر خمسة داعمين",{type:"donLast5"}],
 ["day","📅 داعمو اليوم",{type:"lb",source:"giftsDay",title:"داعمو اليوم",design:"diamondRing"}],
 ["week","🗓 داعمو الأسبوع",{type:"lb",source:"giftsWeek",title:"داعمو الأسبوع",design:"royalCrown"}],
 ["month","🏆 داعمو الشهر",{type:"lb",source:"giftsMonth",title:"داعمو الشهر",design:"platinumCrown"}],
 ["lastFollow","➕ آخر متابع",{type:"levent",kind:"follow",mode:"sticky",title:"آخر متابع",design:"goldenRose"}],
 ["lastDon","💵 آخر داعم",{type:"levent",kind:"donation",mode:"sticky",title:"آخر داعم"}],
 ["lastGift","🎁 آخر مرسل هدية",{type:"levent",kind:"gift",mode:"sticky",title:"آخر هدية"}],
 ["lastLike","👆 آخر مكبس",{type:"levent",kind:"like",mode:"sticky",title:"آخر مكبس"}],
 ["fcount","👥 عداد المتابعين",{type:"fcount"}],
 ["donGoal","🎯 أهداف الدعم",{type:"donGoal"}],
 ["likeGoal","❤️ هدف التكبيس",{type:"goal"}],
 ["likeChallenge","🔥 تحدي التكبيس",{type:"sgoal",source:"likes",title:"تحدي التكبيس",target:10000,giftEmoji:"❤️"}],
 ["srules","📜 قوانين السابثون",{type:"srules"}],
 ["subathon","⏳ عداد السابثون",{type:"subathon"}],
 ["duration","⏲️ مدة البث",{type:"duration"}],
 ["stats","📊 إحصائيات البث",{type:"chatstats"}],
 ["welcome","👋 رسالة ترحيبية",{type:"rcard",rcMode:"text",rcText:"أهلاً وسهلاً فيكم في البث",rcSub:"لا تنسى المتابعة وتفعيل الجرس"}],
 ["text","✍️ نص مخصص",{type:"rcard",rcMode:"text",rcText:"نص مخصص",rcSub:""}],
 ["social","🌐 حسابات التواصل",{type:"social"}],
 ["logo","✦ شعار صانع المحتوى",{type:"rcard",rcMode:"logo",rcSrc:"/logo-160.png",rcBg:false}],
 ["media","🖼️ صورة أو مقطع إعلاني",{type:"rcard",rcMode:"media",rcSrc:"",rcBg:false}],
];
const ROT_FITS=[["full","المساحة كاملة",{x:0,y:0,w:1,h:1}],["c90","وسط 90%",{x:.05,y:.05,w:.9,h:.9}],["top","النصف العلوي",{x:0,y:0,w:1,h:.5}],["bottom","النصف السفلي",{x:0,y:.5,w:1,h:.5}],["right","النصف الأيمن",{x:.5,y:0,w:.5,h:1}],["left","النصف الأيسر",{x:0,y:0,w:.5,h:1}],["c70","وسط 70%",{x:.15,y:.15,w:.7,h:.7}]];
const rotUid=()=>"i"+Math.random().toString(36).slice(2,8);
const rotGroups=()=>L().widgets.filter(w=>w.type==="rotator");
const rotCur=()=>{ const G=rotGroups(); return G.find(w=>w.id===S.rotSel)||G[0]||null };
/** إنشاء عنصر جديد مخفي في التخطيط ليُستخدم داخل مجموعة (لا يظهر في البث خارج المجموعة) */
function rotNewWidget(o,grpName){ const w=newWidget(o.type,{...o,name:"↻ "+(o.title||(TYPES[o.type]||{}).label||"قائمة")+(grpName?" — "+grpName:""),visible:false,z:1}); L().widgets.push(w); return w }
function rotItemFor(w,extra){ return {id:rotUid(),ref:w.id,dur:10,tr:"",hidden:false,fit:{x:0,y:0,w:1,h:1},...(extra||{}),cfg:JSON.parse(JSON.stringify(w))} }
/** المزامنة: كل قائمة داخل المجموعة تحمل نسخة محدثة من عنصرها (يُستدعى قبل كل إرسال للتخطيط) */
function rotSyncAll(){ try{ const l=L(); const by=Object.fromEntries(l.widgets.map(w=>[w.id,w]));
 for(const g of l.widgets) if(g.type==="rotator"){ g.items=(g.items||[]).filter(it=>it&&it.ref); for(const it of g.items){ const src=by[it.ref]; if(src&&src.type!=="rotator") it.cfg=JSON.parse(JSON.stringify(src)); it.missing=!src } } }catch(e){} }
function rotCtl(g,op,item){ clockOp("rot",op,{wid:g.id,item:item||""}) }
const rotLive=g=>((R.C&&R.C.rot&&R.C.rot[g.id])||{});

/* ---------------- القوالب الجاهزة (15) ---------------- */
const ROT_TPL=[
 {k:"gaming",n:"Gaming Rotation",d:"التكبيس ← الداعمين ← قوانين السابثون",tr:"digitalScan",ind:"bar",c:"#22e1ff",items:[["likes",15,{design:"rgbGamer"}],["gifts",20,{design:"esportsChampion"}],["srules",10,{design:"gamingHUD"}]],smart:[["bigGift","gifts",12,3,1000],["likes","likes",10,2,800]]},
 {k:"luxury",n:"Luxury Rotation",d:"الداعمين ← آخر داعم ← أهداف الدعم",tr:"goldenSweep",ind:"ring",c:"#f6c94a",items:[["gifts",20,{design:"luxuryBlackGold"}],["lastDon",10,{design:"blackGold"}],["donGoal",15]],smart:[["donation","lastDon",10,3,1]]},
 {k:"support",n:"Support Rotation",d:"أقوى الداعمين ← آخر خمسة ← داعمو اليوم",tr:"crossfade",ind:"dots",c:"#22c55e",items:[["gifts",20,{design:"diamondEmperor"}],["last5",15],["day",15]],smart:[["bigGift","gifts",12,3,500]]},
 {k:"tiktok",n:"TikTok Rotation",d:"التكبيس ← آخر متابع ← عداد المتابعين",tr:"slideUp",ind:"bar",c:"#ff2d55",items:[["likes",15],["lastFollow",8],["fcount",10]],smart:[["follow","lastFollow",6,1],["likes","likes",10,2,1000]]},
 {k:"subathon",n:"Subathon Rotation",d:"عداد السابثون ← القوانين ← أقوى الداعمين",tr:"fantasticMotion",ind:"next",c:"#4d8dff",items:[["subathon",15],["srules",15,{design:"fantasticSignature"}],["gifts",15]],smart:[["subNear","subathon",20,5]]},
 {k:"minimal",n:"Minimal Transparent",d:"نصوص شفافة بانتقالات هادئة",tr:"smoothFade",ind:"none",c:"#ffffff",items:[["srules",12,{design:"pureText"}],["lastFollow",8],["welcome",8,{rcBg:false}]]},
 {k:"royal",n:"Royal Rotation",d:"داعمو الأسبوع ← الشهر ← اليوم",tr:"curtainReveal",ind:"ring",c:"#d4a73c",items:[["week",15,{design:"royalThrone"}],["month",15,{design:"goldenPalace"}],["day",15,{design:"royalCrown"}]]},
 {k:"fantastic",n:"Fantastic Rotation",d:"توقيع B6O6: انتقال عشوائي فاخر بلا تكرار",tr:"fantasticMotion",mode:"random",ind:"dots",c:"#4d8dff",items:[["gifts",15,{design:"b6o6Royal"}],["likes",15,{design:"b6o6Halo"}],["srules",10,{design:"fantasticSignature"}],["fcount",10]]},
 {k:"multi",n:"Multi-Platform Rotation",d:"الحسابات ← الإحصائيات ← مدة البث",tr:"cardRotation",ind:"bar",c:"#a78bfa",items:[["social",12],["stats",12],["duration",8]]},
 {k:"full",n:"Full Stream Rotation",d:"كل شيء في مساحة واحدة",tr:"elegantScale",mode:"random",ind:"next",c:"#4d8dff",items:[["likes",12],["gifts",15],["lastFollow",8],["donGoal",10],["srules",10],["stats",10]],smart:[["bigGift","gifts",12,3,1000],["follow","lastFollow",6,1]]},
 {k:"chat",n:"Chatting Rotation",d:"ترحيب ← آخر متابع ← نص مخصص",tr:"softDissolve",ind:"none",c:"#ffffff",items:[["welcome",10],["lastFollow",8],["text",8,{rcText:"شاركونا آراءكم في الشات"}]]},
 {k:"charity",n:"Goal Rotation",d:"أهداف الدعم ← تحدي التكبيس ← آخر داعم",tr:"diamondReveal",ind:"ring",c:"#22c55e",items:[["donGoal",15],["likeChallenge",12],["lastDon",8]],smart:[["goal","donGoal",15,5]]},
 {k:"esports",n:"Esports Rotation",d:"قوانين HUD ← أقوى المكبسين ← الإحصائيات",tr:"laserSweep",ind:"count",c:"#facc15",items:[["srules",12,{design:"esports"}],["likes",12,{design:"b6o6Esports"}],["stats",10]]},
 {k:"saudi",n:"Saudi Rotation",d:"أخضر وذهبي: الداعمين ← القوانين",tr:"metallicReflection",ind:"bar",c:"#d4a73c",items:[["gifts",15,{design:"emeraldKing"}],["srules",12,{design:"saudiLuxury"}],["welcome",8,{rcText:"حياكم الله"}]]},
 {k:"calm",n:"Night Calm Rotation",d:"انتقالات ناعمة لبثوث الليل",tr:"aurora",ind:"dots",c:"#818cf8",items:[["lastFollow",10],["likes",15],["text",8,{rcText:"شكراً لوجودكم الليلة"}]]},
];
function rotFromTemplate(t){ const l=L(), g=newWidget("rotator",{name:t.n,tr:t.tr,trMode:t.mode||"fixed",indicator:t.ind,indColor:t.c,z:Math.max(0,...l.widgets.map(x=>x.z))+1}); const map={};
 for(const [k,dur,extra] of t.items){ const c=ROT_CAT.find(x=>x[0]===k); if(!c) continue; const w=rotNewWidget({...c[2],...(extra||{})},t.n); const it=rotItemFor(w,{dur}); g.items.push(it); map[k]=map[k]||it.id }
 if(t.smart&&t.smart.length) g.smart={on:true,cooldown:8,rules:t.smart.filter(r=>map[r[1]]).map(([ev,k,dur,prio,min])=>({id:rotUid(),ev,item:map[k],dur,prio,min:min||0}))};
 l.widgets.push(g); S.rotSel=g.id; save(); pushLayout(); toast("✅ أُنشئت «"+t.n+"» — انسخ رابطها إلى OBS أو TikTok LIVE Studio"); return g }

/* ---------------- الصفحة ---------------- */
function rotHTML(){ const G=rotGroups(), g=rotCur(); rotSyncAll();
 const head0=head("🔁 القوائم المتناوبة","اعرض عدة قوائم وطبقات في نفس المكان برابط واحد — تتبدل تلقائياً بتوقيتك وانتقالاتك، والبيانات تستمر في الخلفية بدون تصفير");
 const tabs=`<div class="card rot-groups"><div class="row" style="gap:6px;flex-wrap:wrap;align-items:center">${G.map(x=>`<button class="btn sm ${g&&g.id===x.id?"on":""}" data-rotx="sel" data-id="${x.id}">🔁 ${esc(x.name||"مجموعة")} <span class="tag">${(x.items||[]).length}</span></button>`).join("")}
  <button class="btn sm pri" data-rotx="new">＋ مجموعة جديدة</button><button class="btn sm" data-rotx="tpls">📦 القوالب الجاهزة (${ROT_TPL.length})</button></div></div>`;
 const tpls=S.rotTpl||!G.length?`<div class="card"><h3>📦 قوالب جاهزة قابلة للتعديل</h3><div class="rot-tpls">${ROT_TPL.map(t=>`<div class="rot-tpl"><b>${esc(t.n)}</b><span class="mut small">${esc(t.d)}</span><span class="tag">⚡ ${esc((RT_BY_ID[t.tr]||{}).name||"")}${t.mode==="random"?" · عشوائي":""}</span><button class="btn xs pri" data-rotx="tpl" data-k="${t.k}">استخدام</button></div>`).join("")}</div></div>`:"";
 if(!g) return head0+tabs+tpls+`<div class="sa2-empty">لا توجد مجموعات بعد. أنشئ مجموعة جديدة أو ابدأ من قالب جاهز.</div>`;
 const live=rotLive(g), items=g.items||[], byId=Object.fromEntries(L().widgets.map(w=>[w.id,w]));
 const trOpts=(v,withGroup)=>`${withGroup?`<option value="" ${!v?"selected":""}>انتقال المجموعة</option>`:""}<option value="random" ${v==="random"?"selected":""}>🎲 عشوائي (بدون تكرار متتالٍ)</option>${RT_TRANS.map(t=>`<option value="${t.id}" ${v===t.id?"selected":""}>${t.n}. ${esc(t.name)}</option>`).join("")}`;
 const durSel=(it)=>{ const pre=ROT_DURS.some(([v])=>v===+it.dur); return `<select class="inp" data-rotf="dur" data-i="${it.id}">${ROT_DURS.map(([v,t])=>`<option value="${v}" ${+it.dur===v?"selected":""}>${t}</option>`).join("")}<option value="custom" ${pre?"":"selected"}>مدة مخصصة…</option></select>${pre?"":`<input class="inp" type="number" min="1" max="3600" value="${+it.dur||10}" data-rotf="durc" data-i="${it.id}" style="width:80px" title="بالثواني">`}` };
 const row=(it,i)=>{ const src=byId[it.ref], c=src||it.cfg||{}, pinned=live.pin===it.id;
  return `<div class="rot-it ${it.hidden?"hid":""} ${pinned?"pin":""} ${it.missing?"miss":""}" draggable="true" data-rotdrag="${it.id}">
   <span class="rot-grip">⠿</span><span class="rot-n">${i+1}</span><span class="rot-ic">${(TYPES[c.type]||{}).icon||"▫"}</span><b class="rot-lbl" title="${esc(rotLabel(c))}">${esc(rotLabel(c))}</b>${it.missing?`<span class="tag warn">العنصر محذوف</span>`:""}
   ${durSel(it)}<select class="inp" data-rotf="tr" data-i="${it.id}" title="الانتقال إلى هذه القائمة">${trOpts(it.tr||"",true)}</select>
   <select class="inp" data-rotf="fit" data-i="${it.id}" title="الحجم والموقع داخل المساحة">${ROT_FITS.map(([k,t,f])=>`<option value="${k}" ${JSON.stringify(f)===JSON.stringify(it.fit||ROT_FITS[0][2])?"selected":""}>${t}</option>`).join("")}</select>
   <span class="rot-acts"><button class="btn xs ${it.hidden?"":"on"}" data-rotx="hide" data-i="${it.id}" title="إخفاء مؤقت من الدورة">${it.hidden?"🙈":"👁"}</button><button class="btn xs ${pinned?"on":""}" data-rotx="pin" data-i="${it.id}" title="تثبيت هذه القائمة الآن في البث">📌</button><button class="btn xs" data-rotx="dup" data-i="${it.id}" title="تكرار داخل الدورة">⧉</button><button class="btn xs" data-rotx="edit" data-ref="${it.ref}" title="تعديل التصميم">🎨</button><button class="btn xs dng" data-rotx="rm" data-i="${it.id}" title="إزالة من المجموعة (لا يُحذف من المنصة)">✕</button></span></div>` };
 const others=L().widgets.filter(w=>w.type!=="rotator"&&!items.some(it=>it.ref===w.id));
 const sm=g.smart||{on:false,rules:[]};
 const link=overlayURL(L(),g.id), tok=(String(link).match(/\/overlay\/([^/?#]+)/)||[])[1]||"";
 const deck=tok&&typeof location!=="undefined"&&/^https?:/.test(location.protocol)?["next","prev","toggle"].map(c=>`<div class="row small" style="gap:6px"><code class="rot-code">${esc(location.origin+"/api/rot/"+tok+"?g="+g.id+"&cmd="+c)}</code><button class="btn xs" data-rotx="copy" data-v="${esc(location.origin+"/api/rot/"+tok+"?g="+g.id+"&cmd="+c)}">نسخ</button></div>`).join(""):`<p class="mut small">روابط Stream Deck تظهر بعد تسجيل الدخول في المنصة.</p>`;
 const K=rotKeys();
 return head0+tabs+tpls+`
 <div class="rot-grid">
  <div class="card rot-pvc"><div class="row" style="justify-content:space-between"><h3>👁 المعاينة المباشرة</h3><span class="tag" data-rotinfo></span></div>
   <div class="rot-pv" id="rot-pv" data-wid="${g.id}"></div>
   <div class="row rot-pvb"><button class="btn sm" data-rotpv="toggle">⏯ تشغيل/إيقاف المعاينة</button><button class="btn sm" data-rotpv="prev">⏮</button><button class="btn sm" data-rotpv="next">⏭ التالي</button><button class="btn sm" data-rotpv="gift">🎁 تجربة وصول دعم</button><button class="btn sm" data-rotpv="follow">➕ تجربة متابع</button><button class="btn sm" data-rotpv="likes">👆 تجربة التكبيس</button></div>
   <p class="mut small">أحداث المعاينة لا تغيّر بيانات البث الحقيقية.</p></div>
  <div class="card rot-livec"><h3>🎛 التحكم أثناء البث</h3>
   <div class="row" style="gap:6px;flex-wrap:wrap"><button class="btn" data-rotx="ctl" data-op="prev">⏮ السابقة</button>${live.paused?`<button class="btn pri" data-rotx="ctl" data-op="resume">▶ استئناف</button>`:`<button class="btn" data-rotx="ctl" data-op="pause">⏸ إيقاف مؤقت</button>`}<button class="btn" data-rotx="ctl" data-op="next">⏭ التالية</button>${live.pin?`<button class="btn pri" data-rotx="ctl" data-op="unpin">📌 إلغاء التثبيت واستئناف</button>`:""}</div>
   <p class="small" style="margin:8px 0 2px">${live.pin?`📌 مثبّتة: <b>${esc(rotLabel((items.find(x=>x.id===live.pin)||{}).cfg))}</b>`:live.paused?"⏸ التبديل متوقف مؤقتاً":"▶ التبديل التلقائي يعمل"}</p>
   <h4>⌨️ اختصارات الكيبورد</h4><div class="grid g3" style="gap:6px">${[["next","التالية"],["prev","السابقة"],["toggle","إيقاف/استئناف"]].map(([k,t])=>`<label class="fld" style="margin:0"><span class="small">${t}</span><input class="inp rot-key" data-rotkey="${k}" value="${esc(K[k])}" readonly placeholder="اضغط الاختصار"></label>`).join("")}</div>
   <h4>🎚 Stream Deck</h4><p class="mut small">أضف إجراء «Website» (طلب في الخلفية) بأحد الروابط:</p>${deck}
   <h4>🔗 رابط المجموعة (Browser Source)</h4><div class="row" style="gap:6px"><button class="btn sm pri" data-rotx="copy" data-v="${esc(link)}">نسخ رابط OBS / TikTok LIVE Studio / Streamlabs</button></div><p class="mut small">رابط واحد للمجموعة كاملة، شفاف، يدعم البث العمودي والأفقي — أي تعديل هنا يصل للبث فوراً دون تغيير الرابط.</p></div>
 </div>
 <div class="card"><div class="row" style="justify-content:space-between;align-items:center"><h3>🗂 قوائم المجموعة <span class="tag">${items.length}</span></h3>
   <div class="row" style="gap:6px"><input class="inp" data-rotf="name" value="${esc(g.name||"")}" style="max-width:220px" title="اسم المجموعة"><button class="btn sm dng" data-rotx="delg">حذف المجموعة</button></div></div>
  <div class="rot-list">${items.length?items.map(row).join(""):`<div class="sa2-empty">أضف قوائم من الأسفل.</div>`}</div>
  <div class="row rot-add"><select class="inp" data-rotf="addnew"><option value="">＋ إضافة قائمة جديدة…</option>${ROT_CAT.map(([k,t])=>`<option value="${k}">${t}</option>`).join("")}</select>
   <select class="inp" data-rotf="addref"><option value="">＋ إضافة عنصر موجود في التخطيط…</option>${others.map(w=>`<option value="${w.id}">${(TYPES[w.type]||{}).icon||""} ${esc(rotLabel(w))}</option>`).join("")}</select></div></div>
 <div class="grid g2">
  <div class="card"><h3>✨ الانتقالات</h3><div class="grid g2" style="gap:8px">
   <div class="fld" style="margin:0"><label>طريقة الانتقال</label><select class="inp" data-rotf="trMode"><option value="fixed" ${g.trMode!=="random"?"selected":""}>انتقال المجموعة (ومخصص لكل قائمة)</option><option value="random" ${g.trMode==="random"?"selected":""}>عشوائي بدون تكرار متتالٍ</option></select></div>
   <div class="fld" style="margin:0"><label>انتقال المجموعة</label><select class="inp" data-rotf="tr">${trOpts(g.tr||"elegantScale",false)}</select></div>
   <div class="fld" style="margin:0"><label>مدة الانتقال <b class="mut">${(+g.trDur||900)/1000}ث</b></label><input type="range" min="200" max="3000" step="100" value="${+g.trDur||900}" data-rotf="trDur"></div>
   <div class="fld" style="margin:0"><label>السرعة <b class="mut">×${+g.trSpeed||1}</b></label><input type="range" min=".5" max="2" step=".1" value="${+g.trSpeed||1}" data-rotf="trSpeed"></div>
   <div class="fld" style="margin:0"><label>القوة <b class="mut">${Math.round((+g.trPower||1)*100)}%</b></label><input type="range" min=".3" max="1.6" step=".1" value="${+g.trPower||1}" data-rotf="trPower"></div>
   <div class="fld" style="margin:0"><label>الاتجاه</label><select class="inp" data-rotf="trDir"><option value="rtl" ${g.trDir!=="ltr"?"selected":""}>من اليمين</option><option value="ltr" ${g.trDir==="ltr"?"selected":""}>من اليسار</option></select></div>
   <div class="fld" style="margin:0"><label>المدة الافتراضية لكل قائمة</label><select class="inp" data-rotf="dur">${ROT_DURS.map(([v,t])=>`<option value="${v}" ${+g.dur===v?"selected":""}>${t}</option>`).join("")}</select></div>
   <button class="btn sm" data-rotpv="trdemo" style="align-self:end">▶ معاينة الانتقال</button></div></div>
  <div class="card"><h3>📍 المؤشر والقوائم الفارغة</h3><div class="grid g2" style="gap:8px">
   <div class="fld" style="margin:0"><label>مؤشر التبديل</label><select class="inp" data-rotf="indicator">${Object.entries(ROT_INDICATORS).map(([k,t])=>`<option value="${k}" ${(g.indicator||"none")===k?"selected":""}>${t}</option>`).join("")}</select></div>
   <div class="fld" style="margin:0"><label>لون المؤشر</label><input type="color" data-rotf="indColor" value="${g.indColor||"#4d8dff"}"></div>
   <div class="fld" style="margin:0"><label>الحجم <b class="mut">×${+g.indSize||1}</b></label><input type="range" min=".5" max="2.5" step=".1" value="${+g.indSize||1}" data-rotf="indSize"></div>
   <div class="fld" style="margin:0"><label>الشفافية <b class="mut">${Math.round((g.indOp??.9)*100)}%</b></label><input type="range" min="0" max="1" step=".05" value="${g.indOp??.9}" data-rotf="indOp"></div>
   <label class="row small" style="gap:6px"><input type="checkbox" data-rotf="skipEmpty" ${g.skipEmpty!==false?"checked":""}> تجاوز القوائم الفارغة</label>
   <div class="fld" style="margin:0"><label>إذا كانت كل القوائم فارغة</label><select class="inp" data-rotf="fallback">${Object.entries(ROT_FALLBACK).map(([k,t])=>`<option value="${k}" ${(g.fallback||"transparent")===k?"selected":""}>${t}</option>`).join("")}</select></div>
   ${g.fallback==="text"?`<div class="fld" style="margin:0;grid-column:span 2"><label>النص الاحتياطي</label><input class="inp" data-rotf="fbText" value="${esc(g.fbText||"")}" placeholder="مثلاً: حياكم الله في البث"></div>`:""}</div></div>
 </div>
 <div class="card"><div class="row" style="justify-content:space-between;align-items:center"><h3>⚡ التبديل الذكي حسب أحداث البث — Smart Event Rotation</h3><label class="sa2-sw"><input type="checkbox" data-rotf="smartOn" ${sm.on?"checked":""}><i></i></label></div>
  <p class="mut small">عند الحدث تظهر القائمة المرتبطة لمدة محددة ثم تعود الدورة الأساسية. الأولوية الأعلى تتقدم، والحدث المتكرر يمدد العرض بدل التبديل المزعج.</p>
  <div class="grid g3" style="gap:8px;max-width:560px"><div class="fld" style="margin:0"><label>الانتظار بين الأحداث (ث)</label><input class="inp" type="number" min="0" max="300" value="${+sm.cooldown||8}" data-rotf="smartCool"></div></div>
  <div class="rot-smart">${(sm.rules||[]).map(r=>`<div class="rot-sr"><select class="inp" data-rots="ev" data-r="${r.id}">${Object.entries(ROT_SMART).map(([k,t])=>`<option value="${k}" ${r.ev===k?"selected":""}>${t}</option>`).join("")}</select><span>←</span>
   <select class="inp" data-rots="item" data-r="${r.id}">${items.map(it=>`<option value="${it.id}" ${r.item===it.id?"selected":""}>${esc(rotLabel(it.cfg))}</option>`).join("")}</select>
   <label class="small">المدة <input class="inp" type="number" min="2" max="300" value="${+r.dur||10}" data-rots="dur" data-r="${r.id}" style="width:64px"></label><label class="small">الأولوية <input class="inp" type="number" min="0" max="9" value="${+r.prio||0}" data-rots="prio" data-r="${r.id}" style="width:54px"></label>
   ${["bigGift","likes","donation"].includes(r.ev)?`<label class="small">${r.ev==="likes"?"تكبيس خلال 10ث ≥":r.ev==="donation"?"مبلغ ≥":"قيمة ≥ (كوين)"} <input class="inp" type="number" min="0" value="${+r.min||0}" data-rots="min" data-r="${r.id}" style="width:80px"></label>`:""}${r.ev==="gift"?`<input class="inp" placeholder="اسم الهدية أو رقمها" value="${esc(r.giftName||r.giftId||"")}" data-rots="gift" data-r="${r.id}" style="width:150px">`:""}
   <button class="btn xs dng" data-rotx="srdel" data-r="${r.id}">✕</button></div>`).join("")}</div>
  <button class="btn sm" data-rotx="sradd" ${items.length?"":"disabled"}>＋ قاعدة حدث</button></div>`+testBar() }

/* ---------------- المعاينة ---------------- */
function rotMount(){ const host=document.getElementById("rot-pv"); const g=rotCur(); if(!host||!g) return; host.innerHTML="";
 const cv=canvasOf(L()), W=Math.round(g.w*cv.w), H=Math.round(g.h*cv.h), stg=document.createElement("div"); stg.className="stage"; stg.style.cssText=`background:none;width:${W}px;height:${H}px;transform-origin:0 0`; host.appendChild(stg);
 const fit=()=>{ const s=Math.min(host.clientWidth/W,(host.clientHeight||360)/H); stg.style.transform=`scale(${s})`; stg.style.marginInline=Math.max(0,(host.clientWidth-W*s)/2)+"px" }; fit();
 S.rotPvCtl=S.rotPvCtl&&S.rotPvCtl.wid===g.id?S.rotPvCtl:{wid:g.id,paused:false,pin:"",seq:0};
 const pw={...JSON.parse(JSON.stringify(g)),id:"rotpv_"+g.id,x:0,y:0,w:1,h:1,locked:true,visible:true};
 const v=new View(pw,{w:W,h:H},{data:SRC,globalFx:true,mute:true,smartPreview:true,localCtl:S.rotPvCtl}); stg.appendChild(v.el); liveViews.add(v); S.rotPv=v;
 clearInterval(S.rotPvT); S.rotPvT=setInterval(()=>{ const el=document.querySelector("[data-rotinfo]"); if(!el||!v.el.isConnected){ clearInterval(S.rotPvT); liveViews.delete(v); return }
  const st=v.rotState(), its=v.rotItems||[], i=its.findIndex(x=>x.id===st.cur), cur=its[i], pool=v.rotPool(), nx=pool.length>1?(its.slice(i+1).concat(its.slice(0,i+1)).find(x=>pool.includes(x)&&x.id!==st.cur)):null;
  const left=cur?Math.max(0,Math.ceil(((+cur.dur||10)*1000-(Date.now()-v.rs.since))/1000)):0;
  el.textContent=cur?`الحالية: ${rotLabel(cur.cfg)}${st.ev?" (حدث)":""} · التالية: ${nx?rotLabel(nx.cfg):"—"} · ${S.rotPvCtl.paused?"⏸":left+"ث"}`:"لا توجد قائمة تُعرض (شفاف)" },300) }
function rotPvCmd(c){ const v=S.rotPv; if(!v) return; const L0=S.rotPvCtl;
 if(c==="toggle"){ L0.paused=!L0.paused; return }
 if(c==="next"||c==="prev"){ L0.seq++; L0.cmd=c; L0.at=Date.now(); return }
 const g=rotCur(), its=v.rotItems||[], find=t=>its.find(it=>it.cfg&&t(it.cfg));
 const fake={gift:{type:"gift",giftId:6369,gift:"Lion",diamonds:29999,count:1,value:29999,user:{name:"معاينة"}},follow:{type:"follow",user:{name:"معاينة"}},likes:{type:"like",count:5000,user:{name:"معاينة"}}}[c];
 if(fake){ const sm=g.smart||{}; if(!sm.on||!(sm.rules||[]).length){ const t=c==="gift"?find(x=>x.type==="lb"&&/gift/i.test(x.source||"")||x.type==="gifts"||/don/.test(x.type)):c==="follow"?find(x=>x.type==="levent"&&x.kind==="follow"||x.type==="fcount"||x.type==="recentFollows"):find(x=>x.type==="lb"&&x.source==="likes"||x.type==="likes"||x.type==="sgoal");
   if(t){ v.rotInterrupt({item:t.id,dur:8,prio:9},Date.now()); return toast("معاينة: ظهرت «"+rotLabel(t.cfg)+"» (التبديل الذكي غير مفعّل في البث)") } return toast("لا توجد قائمة مناسبة لهذا الحدث في المجموعة") }
  v.rs.cool=0; v.rotEvent(fake); toast("🧪 حدث معاينة — البيانات الحقيقية لم تتغير") } }
const ROT_KEYS_DEF={next:"Alt+ArrowLeft",prev:"Alt+ArrowRight",toggle:"Alt+KeyP"};
function rotKeys(){ return Object.assign({},ROT_KEYS_DEF,(S.settings&&S.settings.rotKeys)||{}) }
const rotKeyName=e=>[e.ctrlKey&&"Ctrl",e.altKey&&"Alt",e.shiftKey&&"Shift",e.metaKey&&"Meta",e.code].filter(Boolean).join("+");

/* ---------------- الأحداث ---------------- */
function rotSave(msg){ save(); pushLayout(); if(msg) toast(msg) }
function rotItem(id){ const g=rotCur(); return g&&(g.items||[]).find(x=>x.id===id) }
document.addEventListener("click",e=>{ const b=e.target.closest&&e.target.closest("[data-rotx],[data-rotpv]"); if(!b) return; const d=b.dataset, g=rotCur();
 if(d.rotpv){ if(d.rotpv==="trdemo"){ S.rotPvCtl&&(S.rotPvCtl.seq++,S.rotPvCtl.cmd="next",S.rotPvCtl.at=Date.now()); return } return rotPvCmd(d.rotpv) }
 const a=d.rotx;
 if(a==="sel"){ S.rotSel=d.id; S.rotTpl=false; return renderPage(true) }
 if(a==="new"){ const l=L(), w=newWidget("rotator",{z:Math.max(0,...l.widgets.map(x=>x.z))+1,name:"مجموعة "+(rotGroups().length+1)}); l.widgets.push(w); S.rotSel=w.id; rotSave("أُنشئت مجموعة جديدة"); return renderPage(true) }
 if(a==="tpls"){ S.rotTpl=!S.rotTpl; return renderPage(true) }
 if(a==="tpl"){ const t=ROT_TPL.find(x=>x.k===d.k); if(t){ rotFromTemplate(t); S.rotTpl=false; renderPage(true) } return }
 if(a==="copy") return copy(d.v);
 if(a==="ctl"&&g){ rotCtl(g,d.op); return setTimeout(()=>renderPage(true),80) }
 if(!g) return;
 if(a==="delg") return ask(`حذف مجموعة «${g.name}»؟ القوائم نفسها تبقى في المنصة.`).then(ok=>{ if(!ok) return; const l=L(); l.widgets=l.widgets.filter(x=>x.id!==g.id); S.rotSel=null; rotSave("حُذفت المجموعة"); renderPage(true) });
 if(a==="hide"){ const it=rotItem(d.i); if(it){ it.hidden=!it.hidden; rotSave(); renderPage(true) } return }
 if(a==="pin"){ const live=rotLive(g); rotCtl(g,live.pin===d.i?"unpin":"pin",d.i); return setTimeout(()=>renderPage(true),80) }
 if(a==="dup"){ const i=g.items.findIndex(x=>x.id===d.i); if(i>=0){ g.items.splice(i+1,0,{...JSON.parse(JSON.stringify(g.items[i])),id:rotUid()}); rotSave("كُررت القائمة داخل الدورة"); renderPage(true) } return }
 if(a==="rm"){ g.items=g.items.filter(x=>x.id!==d.i); if(g.smart) g.smart.rules=(g.smart.rules||[]).filter(r=>r.item!==d.i); rotSave("أُزيلت من المجموعة — العنصر باقٍ في المنصة"); return renderPage(true) }
 if(a==="edit"){ S.sel=d.ref; return go("studio") }
 if(a==="sradd"){ g.smart=g.smart||{on:true,cooldown:8,rules:[]}; g.smart.rules.push({id:rotUid(),ev:"bigGift",item:g.items[0].id,dur:10,prio:1,min:1000}); rotSave(); return renderPage(true) }
 if(a==="srdel"){ g.smart.rules=(g.smart.rules||[]).filter(r=>r.id!==d.r); rotSave(); return renderPage(true) }
});
document.addEventListener("change",e=>{ const t=e.target, d=t.dataset||{}, g=rotCur(); if(!g) return;
 if(d.rotf){ const f=d.rotf, v=t.type==="checkbox"?t.checked:t.value, it=d.i&&rotItem(d.i);
  if(f==="addnew"&&v){ const c=ROT_CAT.find(x=>x[0]===v); t.value=""; if(c){ const w=rotNewWidget(c[2],g.name); g.items.push(rotItemFor(w,{dur:+g.dur||10})); rotSave("أُضيفت «"+c[1]+"»"); renderPage(true) } return }
  if(f==="addref"&&v){ const w=L().widgets.find(x=>x.id===v); t.value=""; if(w){ g.items.push(rotItemFor(w,{dur:+g.dur||10})); rotSave("أُضيفت للمجموعة"); renderPage(true) } return }
  if(it){ if(f==="dur"){ if(v==="custom"){ it.dur=+it.dur||25 } else it.dur=+v } else if(f==="durc") it.dur=Math.max(1,Math.min(3600,+v||10)); else if(f==="tr") it.tr=v; else if(f==="fit"){ const F=ROT_FITS.find(x=>x[0]===v); if(F) it.fit={...F[2]} } rotSave(); return renderPage(true) }
  if(f==="smartOn"){ g.smart={...(g.smart||{cooldown:8,rules:[]}),on:!!v}; rotSave(); return renderPage(true) }
  if(f==="smartCool"){ g.smart={...(g.smart||{rules:[]}),cooldown:Math.max(0,+v||0)}; rotSave(); return }
  if(["trDur","trSpeed","trPower","indSize","indOp","dur"].includes(f)) g[f]=+v; else g[f]=v;
  rotSave(); return renderPage(true) }
 if(d.rots){ const r=(g.smart&&g.smart.rules||[]).find(x=>x.id===d.r); if(!r) return; const f=d.rots, v=t.value;
  if(f==="gift"){ if(/^\d+$/.test(v.trim())){ r.giftId=v.trim(); r.giftName="" } else { r.giftName=v.trim(); r.giftId="" } } else if(["dur","prio","min"].includes(f)) r[f]=+v||0; else r[f]=v; rotSave(); return renderPage(true) }
});
document.addEventListener("keydown",e=>{ const t=e.target;
 if(t&&t.dataset&&t.dataset.rotkey){ e.preventDefault(); if(["Alt","Control","Shift","Meta"].includes(e.key)) return; const k=rotKeyName(e); S.settings.rotKeys={...rotKeys(),[t.dataset.rotkey]:k}; t.value=k; save(); toast("حُفظ الاختصار: "+k); return }
 if(t&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.tagName==="SELECT"||t.isContentEditable)) return;
 const K=rotKeys(), name=rotKeyName(e), op=Object.keys(K).find(k=>K[k]===name); if(!op) return; const g=rotCur(); if(!g) return; e.preventDefault(); rotCtl(g,op); toast("🔁 "+({next:"التالية",prev:"السابقة",toggle:"إيقاف/استئناف"}[op]));
});
document.addEventListener("dragstart",e=>{ const r=e.target.closest&&e.target.closest("[data-rotdrag]"); if(!r) return; if(e.target.closest("input,select,button")){ e.preventDefault(); return } S.rotDrag=r.dataset.rotdrag; try{ e.dataTransfer.setData("text/plain",S.rotDrag) }catch(_){} });
document.addEventListener("dragover",e=>{ const r=e.target.closest&&e.target.closest("[data-rotdrag]"); if(r&&S.rotDrag) e.preventDefault() });
document.addEventListener("drop",e=>{ const r=e.target.closest&&e.target.closest("[data-rotdrag]"); if(!r||!S.rotDrag) return; e.preventDefault(); const g=rotCur(), from=S.rotDrag, to=r.dataset.rotdrag; S.rotDrag=null; if(!g||from===to) return;
 const i=g.items.findIndex(x=>x.id===from), j=g.items.findIndex(x=>x.id===to); if(i<0||j<0) return; const [x]=g.items.splice(i,1); g.items.splice(j,0,x); rotSave("تم تغيير الترتيب"); renderPage(true) });
