/* ===================== قوانين السابثون: الإدارة + التصميم + المكتبة + الأصوات + مختبر الحركات ===================== */
/* Fantastic Subathon & Premium Identity Update + Fantastic Motion Engine V2 */

/** التعديلات السريعة المتتالية لا تُبنى على نسخة قديمة من الخادم: آخر قائمة أرسلناها تبقى المرجع لثوانٍ حتى يؤكدها الخادم
 *  (هذا كان سبب رجوع القوانين المحذوفة عند الحذف/التعديل السريع) */
function saKeepShadow(){ const sh=S.saShadow; if(!sh||!R.C||!R.C.subathon) return; if(Date.now()-sh.at>4000){ S.saShadow=null; return }
 const cur=R.C.subathon.rules.list||[]; if(JSON.stringify(cur)!==JSON.stringify(sh.list)) R.C={...R.C,subathon:{...R.C.subathon,rules:{...R.C.subathon.rules,list:sh.list.map(x=>({...x}))}}} }
function saOptimistic(list){ const clean=cleanRuleList(list); if(typeof wsReady==="undefined"||!wsReady) return clean; // الوضع المحلي: المحرك نفسه يطبّق فوراً
 S.saShadow={list:clean.map(x=>({...x})),at:Date.now()}; try{ R.C={...R.C,subathon:{...R.C.subathon,rules:{...R.C.subathon.rules,list:clean.map(x=>({...x}))}}} }catch(e){} return clean }
const rbName=r=>{ try{ return ruleView(r)[0].what }catch(e){ return r.label||r.giftName||r.kind } };
const rbSndName=src=>src==="none"?"🔇 بدون صوت":src?((typeof sndInfo==="function"&&sndInfo(src))||{name:src}).name:"الافتراضي";
const RB_FAV=()=>{ S.settings.rbFav=S.settings.rbFav||[]; return S.settings.rbFav };
const RB_FS=[[0,"افتراضي"],[1,"صغير"],[2,"كبير"],[3,"كبير جداً"]];

/* ---------------- 🗂 إدارة قوانين العرض (لكل قانون: تعديل/حذف/إخفاء/تعطيل/نسخ/ترتيب/صوت/حركة/ألوان) ---------------- */
function saRulesMgrHTML(s){ const L=s.rules.list, dup=new Set(duplicateRules(L)), sel=S.rbSel||(S.rbSel=new Set()); for(const id of [...sel]) if(!L.some(r=>r.id===id)) sel.delete(id);
 const motions=[["","حركة التصميم"],...RB_MOTIONS.map(m=>[m.id,m.n+". "+m.name])];
 const row=r=>{ const v=(()=>{ try{ return ruleView(r)[0] }catch(e){ return {icon:"",img:""} } })(), empty=isEmptyRule(r), g=r.kind==="gift"&&r.giftId!=="*"?saGiftOf(r):null;
  const ic=g?giftIcon(g,"sa-ic sm"):`<span class="sa-ic sm sa-any">${esc(r.emoji||(RULE_KINDS[r.kind]||{}).icon||"")}</span>`;
  const time=r.kind==="donation"?durInput(r,"addMs","وقت «زيد»")+durInput(r,"subMs","وقت «نقص»"):r.kind==="gift"&&r.giftId==="*"?durInput({...r,perDiamondMs:r.perDiamondMs||1000},"perDiamondMs","لكل كوين"):durInput(r,"ms","الوقت");
  return `<div class="rmg-row ${r.enabled?"":"off"} ${r.show===false?"hid":""} ${sel.has(r.id)?"sel":""}" data-rule="${r.id}" draggable="true" data-rbdrag="${r.id}">
  <div class="rmg-h"><label class="rmg-ck"><input type="checkbox" data-rbx="sel" data-id="${r.id}" ${sel.has(r.id)?"checked":""}></label><span class="rmg-grip" title="اسحب لتغيير الترتيب">⠿</span>${ic}
   <input class="inp rmg-name" data-rl="${r.id}" data-rk="label" value="${esc(r.label||"")}" placeholder="${esc(rbName({...r,label:""}))}" title="اسم العرض في الطبقة">
   ${empty?`<span class="tag warn">فارغ — لا يظهر</span>`:""}${dup.has(r.id)?`<span class="tag warn">مكرر</span>`:""}
   <span class="rmg-acts"><button class="btn xs ${r.show===false?"":"on"}" data-rbx="show" data-id="${r.id}" title="إظهار/إخفاء في الطبقة فقط">${r.show===false?"🙈 مخفي":"👁 ظاهر"}</button>
   <label class="sa2-sw" title="${r.enabled?"القانون يعمل":"القانون متوقف"}"><input type="checkbox" data-rl="${r.id}" data-rk="enabled" ${r.enabled?"checked":""}><i></i></label>
   <button class="btn xs" data-rbx="dup" data-id="${r.id}" title="نسخ القانون">⧉</button><button class="btn xs" data-rbx="up" data-id="${r.id}" title="أعلى">↑</button><button class="btn xs" data-rbx="down" data-id="${r.id}" title="أسفل">↓</button><button class="btn xs dng" data-rbx="del" data-id="${r.id}" title="حذف">🗑</button></span></div>
  <div class="rmg-b">
   <div class="fld" style="margin:0"><label>التأثير</label><select class="inp" data-rl="${r.id}" data-rk="dir"><option value="1" ${r.dir>=0?"selected":""}>＋ يضيف وقتاً</option><option value="-1" ${r.dir<0?"selected":""}>－ يخصم وقتاً</option></select></div>
   ${time}
   <div class="fld" style="margin:0"><label>لون النص</label><input type="color" data-rl="${r.id}" data-rk="color" value="${r.color||"#ffffff"}"></div>
   <div class="fld" style="margin:0"><label>لون الوقت</label><input type="color" data-rl="${r.id}" data-rk="timeColor" value="${r.timeColor||(r.dir<0?"#ef4444":"#22c55e")}"></div>
   <div class="fld" style="margin:0"><label>حجم الخط</label><select class="inp" data-rl="${r.id}" data-rk="fs">${RB_FS.map(([k,t])=>`<option value="${k}" ${+r.fs===k?"selected":""}>${t}</option>`).join("")}</select></div>
   <div class="fld" style="margin:0"><label>تخصيص حركة القانون</label><select class="inp" data-rl="${r.id}" data-rk="anim">${motions.map(([k,t])=>`<option value="${k}" ${(r.anim||"")===k?"selected":""}>${esc(t)}</option>`).join("")}</select></div>
   <div class="fld rmg-snd" style="margin:0"><label>صوت القانون</label><div class="row" style="gap:4px;flex-wrap:nowrap"><span class="tag ${r.soundId&&r.soundId!=="none"?"ok":""}" title="${esc(rbSndName(r.soundId))}">${esc(rbSndName(r.soundId)).slice(0,22)}</span>
    <button class="btn xs" data-rbx="rsnd" data-id="${r.id}">🎵 اختيار صوت من المكتبة</button><button class="btn xs" data-rbx="rmute" data-id="${r.id}">🔇 بدون صوت</button>${r.soundId&&r.soundId!=="none"?`<button class="btn xs" data-rbx="rplay" data-id="${r.id}">▶</button><button class="btn xs" data-rbx="rsdef" data-id="${r.id}" title="الصوت العام للسابثون">↺</button>`:""}</div></div>
  </div></div>` };
 return `<section class="sa2-sec" id="sa-s3b"><div class="sa2-h"><h2>🗂 إدارة قوانين العرض</h2><span class="mut small">كل قانون مستقل: الاسم، الوقت، الألوان، الحجم، الحركة والصوت — التعديل يظهر فوراً في OBS وTikTok LIVE Studio</span></div>
  <div class="note small rmg-note">👁 <b>الإخفاء</b>: القانون يبقى يعمل ويضيف الوقت، لكنه لا يظهر في طبقة القوانين. ⚡ <b>الإيقاف</b>: القانون لا يضيف وقتاً ولا يظهر. 🗑 <b>الحذف</b>: يُزال نهائياً من الإعدادات والطبقة فوراً ولا يرجع.</div>
  <div class="row rmg-bulk"><label class="row small" style="gap:6px"><input type="checkbox" data-rbx="selall" ${sel.size&&sel.size===L.length?"checked":""}> تحديد الكل</label><span class="tag">${sel.size} محدد</span>
   <button class="btn xs" data-rbx="bulk" data-op="hide" ${sel.size?"":"disabled"}>🙈 إخفاء</button><button class="btn xs" data-rbx="bulk" data-op="show" ${sel.size?"":"disabled"}>👁 إظهار</button><button class="btn xs" data-rbx="bulk" data-op="on" ${sel.size?"":"disabled"}>⚡ تفعيل</button><button class="btn xs" data-rbx="bulk" data-op="off" ${sel.size?"":"disabled"}>⏸ إيقاف</button><button class="btn xs dng" data-rbx="bulk" data-op="del" ${sel.size?"":"disabled"}>🗑 حذف المحدد</button>
   ${dup.size?`<button class="btn xs" data-rbx="dedupe">🧹 حذف المكرر (${dup.size})</button>`:""}<select class="inp" data-act="rAdd" style="width:auto"><option value="">＋ قانون جديد…</option>${Object.entries(RULE_KINDS).map(([k,v])=>`<option value="${k}">${v.icon} ${v.label}</option>`).join("")}</select></div>
  <div class="rmg-list" data-rbmlist>${L.length?L.map(row).join(""):`<div class="sa2-empty">لا توجد قوانين. أضف قانوناً من «＋ قانون جديد».</div>`}</div></section>` }

/* ---------------- 🎵 أصوات السابثون (من مكتبة المنصة — الرفع اختياري) ---------------- */
const SA_SND_EVS=[["sa_start","","▶️ بدء السابثون"],["sa_pause","","⏸️ الإيقاف المؤقت"],["sa_resume","","⏯️ الاستكمال"],["subathon","add","➕ زيادة الوقت"],["subathon","sub","➖ نقص الوقت"],["sa_gift","","🎁 هدية محددة"],["sa_donation","","💵 دونيشن"],["sa_near","","⏳ اقتراب النهاية"],["sa_end","","🏁 النهاية"],["sa_milestone","","🏆 إنجاز"]];
const saSndRule=(ev,dir)=>SC().rules.find(r=>r.ev===ev&&(!dir||r.cond.dir===dir));
function saSoundsHTML(s){ const c=SC(); sndLoadIndex();
 const evRow=([ev,dir,label])=>{ const r=saSndRule(ev,dir), k=`data-ev="${ev}" data-dir="${dir}"`;
  return `<div class="sas-row ${r&&r.on===false?"off":""}"><b>${label}</b><div class="sas-snds">${r&&r.sounds.length?r.sounds.map((x,i)=>`<span class="sas-chip"><button class="btn xs" data-rbx="sasplay" data-src="${esc(x.src)}">▶</button>${esc(rbSndName(x.src))}<input type="range" min="0" max="100" step="5" value="${x.vol}" data-rbx="sasvol" ${k} data-i="${i}" title="مستوى الصوت"><button class="btn xs" data-rbx="saschg" ${k} data-i="${i}" title="تغيير">⇄</button><button class="btn xs dng" data-rbx="sasdel" ${k} data-i="${i}" title="حذف">✕</button></span>`).join(""):`<span class="mut small">بدون صوت</span>`}</div>
  <div class="row" style="gap:4px"><button class="btn xs pri" data-rbx="saspick" ${k}>🎵 اختيار الصوت</button>${r&&r.sounds.length>1?`<button class="btn xs ${r.mode==="random"?"on":""}" data-rbx="sasrnd" ${k}>🔀 عشوائي</button>`:""}${r?`<button class="btn xs" data-rbx="sasmute" ${k}>${r.on===false?"🔈 تشغيل":"🔇 كتم"}</button>`:""}</div></div>` };
 return `<section class="sa2-sec" id="sa-s3c"><div class="sa2-h"><h2>🎵 أصوات السابثون</h2><span class="mut small">اختر من مكتبة المنصة (ميمز عربية وسعودية، احتفالية، سينمائية…) — رفع ملفاتك اختياري</span></div>
  <div class="row" style="gap:10px;margin-bottom:8px"><label class="row small" style="gap:6px"><input type="checkbox" data-sa="soundsOff" ${s.soundsOff?"checked":""}> تشغيل السابثون بدون أصوات</label>
   <div class="fld" style="margin:0"><label>«اقتراب النهاية» عند بقاء</label><select class="inp" data-sa="nearEndMs">${[[60000,"دقيقة"],[180000,"3 دقائق"],[300000,"5 دقائق"],[600000,"10 دقائق"],[900000,"15 دقيقة"]].map(([v,t])=>`<option value="${v}" ${(+s.nearEndMs||300000)===v?"selected":""}>${t}</option>`).join("")}</select></div>
   <div class="fld" style="margin:0"><label>«إنجاز» كل</label><select class="inp" data-sa="milestoneMs">${[[1800000,"30 دقيقة مضافة"],[3600000,"ساعة مضافة"],[7200000,"ساعتين"],[10800000,"3 ساعات"]].map(([v,t])=>`<option value="${v}" ${(+s.milestoneMs||3600000)===v?"selected":""}>${t}</option>`).join("")}</select></div>
   ${!c.on?`<span class="tag warn">نظام الأصوات متوقف في «مكتبة الأصوات» — أصوات القوانين الخاصة تعمل، وأصوات الأحداث تحتاج تفعيله</span>`:""}</div>
  <div class="sas-list">${SA_SND_EVS.map(evRow).join("")}</div>
  <p class="mut small">🎯 صوت واحد فقط لكل تغيير وقت: صوت القانون ← صوت «هدية محددة/دونيشن» ← صوت الزيادة/النقص العام. إذا كان للهدية صوت تنبيه في «مكتبة الأصوات» فلن يتكرر صوت القانون (إلا إذا سمحت بذلك).</p></section>` }
function saSndUpdate(ev,dir,fn,msg){ const c=SC(); let r=saSndRule(ev,dir); if(!r){ r=sndRule({ev,cond:dir?{dir}:ev==="sa_gift"?{any:true}:{},sounds:[],mode:"random",on:true}); c.rules.push(r) } fn(r); c.rules=c.rules.filter(x=>x.sounds.length||x===r&&x.sounds.length); sndSave(msg); renderPage(true) }

/* ---------------- منتقي الأصوات (مكتبة المنصة + ميمز المجتمع + أصواتي) ---------------- */
function rbSndPick(title,onPick){ const st={q:"",cat:"",tab:"lib"}; sndLoadIndex().then(()=>draw()); if(!S.sndComLoaded&&typeof sndLoadCommunity==="function") sndLoadCommunity();
 const m=modal(`<div class="rbp"><div class="row" style="justify-content:space-between"><h3>🎵 ${esc(title)}</h3><button class="btn sm" data-close>✕</button></div>
  <div class="row" style="gap:6px;margin:8px 0"><input class="inp" id="rbp-q" placeholder="🔍 ابحث في المكتبة…" style="flex:1"><button class="btn sm on" data-rbp-tab="lib">📚 المكتبة</button><button class="btn sm" data-rbp-tab="com">😂 ميمز المجتمع</button><button class="btn sm" data-rbp-tab="mine">📁 أصواتي</button><button class="btn sm" data-rbp-tab="fav">⭐ المفضلة</button></div>
  <div class="row" id="rbp-cats" style="gap:4px;flex-wrap:wrap"></div><div id="rbp-list" class="rbp-list"></div>
  <div class="row" style="margin-top:8px;justify-content:space-between"><button class="btn sm" data-rbp-upload>⬆️ رفع ملف خاص (اختياري)</button><button class="btn sm" data-rbp-rand>🎲 صوت عشوائي من التصنيف</button></div></div>`);
 m.classList.add("rbp-m");
 const items=()=>{ const c=SC(); if(st.tab==="mine") return c.user.map(u=>({src:"up:"+u.id,name:u.name,cat:"mine",dur:u.dur})); if(st.tab==="com") return (S.sndCom||[]).map(a=>({src:"al:"+a.id,name:a.name,cat:"community",dur:a.durationSec}));
  const all=(SNDX&&SNDX.items)||[]; return st.tab==="fav"?all.filter(x=>c.fav.includes(x.src)):all };
 const list=()=>{ const q=st.q.trim().toLowerCase(); return items().filter(x=>(!st.cat||x.cat===st.cat)&&(!q||(x.name+" "+(x.tags||"")).toLowerCase().includes(q))) };
 function draw(){ const cats=(SNDX&&SNDX.cats)||{}; m.querySelector("#rbp-cats").innerHTML=st.tab==="lib"||st.tab==="fav"?[["","الكل"],...Object.entries(cats)].map(([k,v])=>`<button class="btn xs ${st.cat===k?"on":""}" data-rbp-cat="${k}">${esc(v)}</button>`).join(""):"";
  const L=list(); m.querySelector("#rbp-list").innerHTML=L.slice(0,120).map(x=>`<div class="rbp-it"><button class="btn xs" data-rbp-play="${esc(x.src)}">▶</button><b>${esc(x.name)}</b><span class="mut small">${x.dur?sndFmtDur(x.dur):""}</span><button class="btn xs pri" data-rbp-use="${esc(x.src)}">اختيار</button></div>`).join("")||`<div class="mut small" style="padding:12px">${st.tab==="mine"?"لا توجد ملفات مرفوعة — الرفع اختياري":st.tab==="com"&&!S.sndComLoaded?"جارٍ التحميل…":"لا توجد نتائج"}</div>` }
 m.addEventListener("input",e=>{ if(e.target.id==="rbp-q"){ st.q=e.target.value; draw() } });
 m.addEventListener("click",e=>{ const b=e.target.closest("button"); if(!b) return; const d=b.dataset;
  if(d.rbpTab){ st.tab=d.rbpTab; st.cat=""; m.querySelectorAll("[data-rbp-tab]").forEach(x=>x.classList.toggle("on",x===b)); draw() }
  else if(d.rbpCat!==undefined){ st.cat=d.rbpCat; draw() }
  else if(d.rbpPlay) sndPreview(d.rbpPlay);
  else if(d.rbpUse){ if(S.sndAudio) S.sndAudio.pause(); m.remove(); onPick(d.rbpUse) }
  else if(d.rbpRand!==undefined){ const L=list(); if(!L.length) return toast("لا توجد أصوات"); const x=L[Math.floor(Math.random()*L.length)]; sndPreview(x.src); toast("🎲 "+x.name); m.querySelectorAll(".rbp-it").forEach(it=>it.classList.toggle("on",it.querySelector(`[data-rbp-use="${CSS.escape(x.src)}"]`)!==null)) }
  else if(d.rbpUpload!==undefined){ m.remove(); if(typeof sndUploadModal==="function") sndUploadModal("mine") } });
 draw(); return m }

/* ---------------- ⚙️ خصائص لوحة القوانين (التصميم + الإخفاء + الخط السفلي + محرك المؤثرات) ---------------- */
function rbPropsHTML2(w,sel,rng){ const d=rbDesignOf(w.design), L=R.C.subathon.rules.list.filter(r=>r.enabled&&r.show!==false), hid=new Set(w.hideKinds||[]), ae=rbAE(w);
 const ck=(f,label,on)=>`<label class="row small" style="gap:6px"><input type="checkbox" data-rbf="${f}" data-wid="${w.id}" ${on?"checked":""}> ${label}</label>`;
 const col=(f,label,def)=>`<div class="fld" style="margin:0"><label>${label}</label><input type="color" data-rbf="${f}" data-wid="${w.id}" value="${w[f]||def}"></div>`;
 const rs=(f,label,a,b,st,v,fmt)=>`<div class="fld" style="margin:0"><label>${label} <b class="mut">${fmt(v)}</b></label><input type="range" min="${a}" max="${b}" step="${st}" value="${v}" data-rbf="${f}" data-wid="${w.id}"></div>`;
 const sl=(f,label,opts,v,attr="data-rbf")=>`<div class="fld" style="margin:0"><label>${label}</label><select class="inp" ${attr}="${f}" data-wid="${w.id}">${opts.map(([k,t])=>`<option value="${esc(k)}" ${String(v??"")===String(k)?"selected":""}>${esc(t)}</option>`).join("")}</select></div>`;
 const MO=g=>RB_MOTIONS.filter(m=>!g||m.cat===g).map(m=>[m.id,m.n+". "+m.name]);
 return `<div class="rbp-cur"><b>${d.n}. ${esc(d.name)}</b><span class="mut small">${esc(d.desc)} · الحركة: ${esc((RBM_BY_ID[d.motion]||{}).name||"")}</span>
  <div class="row" style="gap:6px;margin-top:6px"><button class="btn sm pri" data-rbx="lib" data-wid="${w.id}">🎨 مكتبة تصاميم القوانين (50)</button><button class="btn sm" data-rbx="hittest" data-wid="${w.id}">🎁 تجربة وصول هدية</button><button class="btn sm" data-go="subathon">⚙️ القوانين</button></div></div>
  <h4>النمط الجاهز</h4><div class="row" style="gap:4px;flex-wrap:wrap">${Object.entries(RB_PRESETS).map(([k,t])=>`<button class="btn xs ${(w.preset||"full")===k?"on":""}" data-rbx="preset" data-k="${k}" data-wid="${w.id}">${t}</button>`).join("")}</div>
  <h4>طريقة العرض</h4><div class="grid g2" style="gap:8px">${sel("mode","الوضع",RB_MODES,w.mode)}${sl("layout","التخطيط",Object.entries(RB_LAYOUTS),w.layout||d.layout)}</div>
  ${["rotate","page3"].includes(w.mode)?`<div class="grid g2" style="gap:8px">${sel("interval","مدة العرض",[[3,"3 ث"],[4,"4 ث"],[5,"5 ث"],[6,"6 ث"],[8,"8 ث"],[10,"10 ث"],[15,"15 ث"]],w.interval)}${rs("aeSpeed","سرعة الانتقال",.4,2,.1,ae.speed,v=>"×"+v)}</div>`:""}
  ${w.mode==="ticker"?`<div class="grid g2" style="gap:8px">${sel("tickerDir","الاتجاه",[["h","أفقي"],["v","عمودي"]],w.tickerDir)}</div>${rng("speed","سرعة الشريط",20,240,5,w.speed,v=>v+" px/ث")}`:""}
  ${(w.layout||d.layout)==="columns"?rs("cols","عدد الأعمدة",2,4,1,+w.cols||3,v=>v):""}
  <div class="grid g2" style="gap:8px">${sel("order","ترتيب القوانين",RB_ORDERS,w.order)}${sel("maxRules","عدد القوانين",[[0,"الكل"],[3,"3"],[4,"4"],[5,"5"],[6,"6"],[8,"8"],[10,"10"]],w.maxRules)}</div>
  <div class="fld"><label>القوانين الظاهرة في هذه اللوحة</label><div class="row" style="gap:6px">${L.map(r=>`<label class="row small" style="gap:4px"><input type="checkbox" data-rbhide="${r.id}" data-wid="${w.id}" ${hid.has(r.id)?"":"checked"}> ${esc(rbName(r))}</label>`).join("")||'<span class="mut small">لا توجد قوانين مفعّلة</span>'}</div></div>
  <h4>إظهار وإخفاء العناصر</h4><div class="grid g3 rbp-cks" style="gap:6px">${ck("hideBg","إخفاء الخلفية",w.hideBg)}${ck("hideFrame","إخفاء الإطار",w.hideFrame)}${ck("hideDeco","إخفاء الزخارف",w.hideDeco)}${ck("noImg","إخفاء صورة الهدية",w.showImg===false)}${ck("noName","إخفاء اسم الهدية",w.showWhat===false)}${ck("noTime","إخفاء الوقت",w.showTime===false)}${ck("showTitle","إظهار العنوان",!!w.showTitle)}${ck("hideLine","إخفاء الخط السفلي",w.hideLine)}</div>
  <h4>الألوان والخط</h4><div class="grid g3" style="gap:8px">${col("nameColor","لون الاسم","#ffffff")}${col("timeColor","لون الوقت","#ffffff")}${col("lineColor","لون الخط","#9fd0ff")}
   <div class="fld" style="margin:0"><label>لون الزيادة</label><input type="color" data-wf="posColor" data-wid="${w.id}" value="${w.posColor||"#22c55e"}"></div><div class="fld" style="margin:0"><label>لون النقصان</label><input type="color" data-wf="negColor" data-wid="${w.id}" value="${w.negColor||"#ef4444"}"></div>${sel("font","الخط",FONTS,w.font)}</div>
  <div class="grid g2" style="gap:8px">${rng("fontScale","حجم النص",.6,1.8,.05,w.fontScale||1,v=>Math.round(v*100)+"%")}${rs("spacing","تباعد الحروف",0,.2,.01,+w.spacing||0,v=>(+v).toFixed(2))}${rng("iconScale","حجم صورة الهدية",.6,2,.05,w.iconScale,v=>Math.round(v*100)+"%")}${rng("rowOpacity","الشفافية",0,1,.05,w.rowOpacity??1,v=>Math.round(v*100)+"%")}${sl("dirMode","الاتجاه",[["rtl","يمين ← يسار"],["ltr","يسار ← يمين"]],w.dirMode||"rtl")}</div>
  <h4>الخط السفلي</h4><div class="grid g2" style="gap:8px">${sl("lineType","نوع الخط",Object.entries(RB_LINES),w.lineType||d.line)}${rs("lineLen","طول الخط",20,100,5,+w.lineLen||100,v=>v+"%")}${rs("lineThick","السماكة",1,8,1,+w.lineThick||2,v=>v+"px")}${rs("lineOp","الشفافية",0,1,.05,w.lineOp??.9,v=>Math.round(v*100)+"%")}${rs("lineSpeed","سرعة حركة الخط",.3,3,.1,+w.lineSpeed||1,v=>"×"+v)}</div>
  <h4>⚡ محرك المؤثرات (Subathon Animation Engine)</h4>
  <div class="grid g2" style="gap:8px">${sl("ruleMotion","حركة القوانين",[["perRule","تخصيص حركة لكل قانون (إن وُجدت)"],["design","حركة التصميم لجميع القوانين"]],w.ruleMotion||"perRule")}${sl("motion","الحركة الرئيسية (الدخول)",[["","حركة التصميم: "+((RBM_BY_ID[d.motion]||{}).name||"")],...MO()],w.motion||"")}
   ${sl("exit","حركة الخروج",Object.entries(RB_EXITS).map(([k,x])=>[k,x.name]),ae.exit,"data-rbae")}${sl("idle","الحركة المستمرة",Object.entries(RB_IDLES).map(([k,x])=>[k,x.name]),ae.idle,"data-rbae")}
   ${sl("line","حركة الخط السفلي",[["","بدون إضافة"],...MO("line")],ae.line,"data-rbae")}${sl("text","حركة النص",[["","بدون إضافة"],...MO("text")],ae.text,"data-rbae")}
   ${sl("img","حركة صورة الهدية",Object.entries(RB_IMGS).map(([k,x])=>[k==="none"?"":k,x.name]),ae.img,"data-rbae")}${sl("time","حركة الوقت المضاف/المخصوم",Object.entries(RB_TIMES).map(([k,x])=>[k==="none"?"":k,x.name]),ae.time,"data-rbae")}
   ${sl("hit","مؤثر وصول الهدية",[["","نفس حركة القانون"],...MO()],ae.hit,"data-rbae")}${sl("dir","اتجاه الحركة",[["rtl","من اليمين"],["ltr","من اليسار"]],ae.dir,"data-rbae")}</div>
  <div class="grid g3" style="gap:8px">${rs("aeSpeed","السرعة",.4,2,.1,ae.speed,v=>"×"+v)}${rs("aePower","قوة المؤثر",.3,1.6,.1,ae.power,v=>Math.round(v*100)+"%")}${rs("aeDur","المدة",.5,2,.1,ae.dur,v=>"×"+v)}</div>
  <div class="grid g2 rbp-cks" style="gap:6px">${ck("aeOff","⛔ إيقاف جميع المؤثرات",ae.off||w.animOn===false)}${ck("hitOn","تفاعل القانون عند وصول الهدية",w.hitOn!==false)}${ck("hitDelta","إظهار الوقت المضاف/المخصوم",w.hitDelta!==false)}${ck("lowPerf","وضع أداء خفيف (بدون جزيئات)",!!w.lowPerf)}</div>` }
function rbApplyPreset(w,k){ w.preset=k; if(k!=="custom") Object.assign(w,rbPreset(k)) }

/* ---------------- 🎨 مكتبة تصاميم القوانين ---------------- */
function rbTargetW(){ const l=L(); return l.widgets.find(x=>x.id===S.rbTarget&&x.type==="srules")||l.widgets.find(x=>x.type==="srules") }
function rbSampleList(){ const real=(R.C.subathon.rules.list||[]).filter(r=>r.enabled&&r.show!==false&&!isEmptyRule(r)); return (real.length>=3?real:defaultRuleList().filter(r=>r.enabled)).slice(0,4) }
const rbSampleSrc=()=>{ const list=rbSampleList(); return ()=>({...SRC(),C:{...R.C,subathon:{...R.C.subathon,rules:{...R.C.subathon.rules,list}}}}) };
function rlibHTML(){ const tab=S.rlibCat||"", fav=RB_FAV(), q=(S.rlibQ||"").trim().toLowerCase(), tgt=rbTargetW();
 const list=RB_DESIGNS.filter(d=>(!tab||(tab==="fav"?fav.includes(d.id):d.lib.includes(tab)))&&(!q||(d.n+" "+d.name+" "+d.desc).toLowerCase().includes(q)));
 return head("🎨 مكتبة تصاميم قوانين السابثون",`${RB_DESIGNS.length} تصميماً — لكل تصميم هوية بصرية وحركة رئيسية مستقلة · مرّر الماوس لمشاهدة الحركة الحقيقية`)+
 `<div class="card"><div class="row" style="gap:6px;flex-wrap:wrap"><button class="btn sm ${!tab?"on":""}" data-rbx="rcat" data-k="">الكل</button>${Object.entries(RB_LIB).map(([k,t])=>`<button class="btn sm ${tab===k?"on":""}" data-rbx="rcat" data-k="${k}">${k==="fav"?"⭐ ":""}${t}</button>`).join("")}
  <input class="inp" data-rbx="rq" value="${esc(S.rlibQ||"")}" placeholder="🔍 بحث" style="max-width:200px;margin-inline-start:auto"><button class="btn sm" data-go="rblab">🧪 مختبر الحركات</button></div>
  ${tgt?`<p class="mut small" style="margin:8px 0 0">التطبيق على: <b>${esc(tgt.name||"لوحة القوانين")}</b></p>`:`<p class="mut small" style="margin:8px 0 0">لا توجد لوحة قوانين في هذا التخطيط — «استخدام» يضيفها تلقائياً.</p>`}</div>
 <div class="rlib">${list.map(d=>`<div class="rlib-c ${tgt&&rbDesignOf(tgt.design).id===d.id?"on":""}" data-rlib="${d.id}"><div class="rlib-pv" data-rlibpv="${d.id}"></div>
  <div class="rlib-m"><b>${d.n}. ${esc(d.name)}</b><span class="mut small">${esc(d.desc)}</span><span class="tag">⚡ ${esc((RBM_BY_ID[d.motion]||{}).name||"")}</span></div>
  <div class="rlib-b"><button class="btn xs" data-rbx="rpv" data-k="${d.id}">👁 معاينة</button><button class="btn xs" data-rbx="rcust" data-k="${d.id}">🎛 تخصيص</button><button class="btn xs pri" data-rbx="ruse" data-k="${d.id}">استخدام</button><button class="btn xs ${fav.includes(d.id)?"on":""}" data-rbx="rfav" data-k="${d.id}">${fav.includes(d.id)?"⭐":"☆"}</button><button class="btn xs" data-rbx="rlink" data-k="${d.id}">🔗 رابط الطبقة</button></div></div>`).join("")||`<div class="sa2-empty">لا توجد تصاميم في هذا التصنيف${tab==="fav"?" — أضف تصاميمك المفضلة بزر ☆":""}</div>`}</div>` }
/** معاينة حية مصغّرة لتصميم (بيانات القوانين الحالية — لا تؤثر على العداد) */
function rbMkPreview(host,design,extra,W=480,H=270){ host.innerHTML=""; const stg=document.createElement("div"); stg.className="stage"; stg.style.cssText=`background:none;width:${W}px;height:${H}px;transform-origin:0 0;transform:scale(${host.clientWidth/W||.5})`; host.appendChild(stg);
 const t=rbTargetW(), base=t?{...t}:newWidget("srules",{}); const pw={...base,...(extra||{}),id:"rbpv_"+design+"_"+Math.random().toString(36).slice(2,6),design,x:.03,y:.05,w:.94,h:.9,locked:true,visible:true,maxRules:4,mode:extra&&extra.mode||"list",animOn:true,preset:base.preset};
 const v=new View(pw,{w:W,h:H},{data:rbSampleSrc(),globalFx:true,mute:true}); stg.appendChild(v.el); try{ v.refresh(rbSampleSrc()(),true) }catch(e){} return v }
function rlibMount(){ const io=new IntersectionObserver(es=>{ for(const e of es) if(e.isIntersecting&&!e.target._v){ e.target._v=rbMkPreview(e.target,e.target.dataset.rlibpv); io.unobserve(e.target) } },{rootMargin:"200px"});
 document.querySelectorAll("[data-rlibpv]").forEach(el=>{ io.observe(el); const card=el.closest(".rlib-c"); let t=0;
  card.addEventListener("mouseenter",()=>{ const v=el._v; if(!v||!v.rbItems) return; clearTimeout(t); t=setTimeout(()=>{ try{ v.buildRules(v.rbItems,false,true) }catch(e){} },80) }) }) }
function rbHitTest(v,list){ const r=(list||rbSampleList()).find(x=>x.kind==="gift")||(list||rbSampleList())[0]; if(!v||!r) return;
 const ms=(r.kind==="donation"?r.addMs:r.ms)*(r.dir<0?-1:1); v.ruleHit({ruleId:r.id,deltaMs:ms||60000,kind:r.kind,test:true,preview:true}); if(r.soundId&&r.soundId!=="none") sndPreview(r.soundId) }
function rbPreviewModal(id){ const d=rbDesignOf(id); const m=modal(`<div class="rbpvm"><div class="row" style="justify-content:space-between"><h3>${d.n}. ${esc(d.name)}</h3><button class="btn sm" data-close>✕</button></div><p class="mut small">${esc(d.desc)} · ⚡ ${esc((RBM_BY_ID[d.motion]||{}).name||"")}</p>
  <div class="rbpvm-stage" id="rbpvm-pv"></div><div class="row" style="gap:6px;margin-top:10px"><button class="btn sm" data-rbpvm="replay">↻ إعادة الحركة</button><button class="btn sm pri" data-rbpvm="hit">🎁 تجربة وصول هدية</button><button class="btn sm" data-rbpvm="mode" data-k="rotate">واحد تلو الآخر</button><button class="btn sm" data-rbpvm="mode" data-k="list">الكل</button><button class="btn sm" data-rbpvm="mode" data-k="page3">ثلاثة ثلاثة</button><button class="btn sm pri" data-rbx="ruse" data-k="${d.id}" data-close>استخدام التصميم</button></div>
  <p class="mut small">المعاينة لا تؤثر على عداد السابثون الحقيقي.</p></div>`); m.classList.add("rbpvm-m");
 let mode="list"; const mk=()=>{ const h=m.querySelector("#rbpvm-pv"); return h._v=rbMkPreview(h,d.id,{mode},960,540) }; setTimeout(mk,30);
 m.addEventListener("click",e=>{ const b=e.target.closest("[data-rbpvm]"); if(!b) return; const v=m.querySelector("#rbpvm-pv")._v; const a=b.dataset.rbpvm;
  if(a==="replay"&&v) v.buildRules(v.rbItems,false,true); if(a==="hit") rbHitTest(v); if(a==="mode"){ mode=b.dataset.k; mk() } }) }
function rbUseDesign(id,goStudio){ const l=L(); let w=rbTargetW(); if(!w){ w=newWidget("srules",{design:id}); l.widgets.push(w) } w.design=id; S.rbTarget=w.id; save(); pushLayout(); if(typeof refreshView==="function") try{ refreshView(w) }catch(e){} toast("✅ طُبّق «"+rbDesignOf(id).name+"» — يظهر فوراً في OBS وTikTok LIVE Studio"); if(goStudio){ S.sel=w.id; go("studio") } else renderPage(true); return w }

/* ---------------- 🧪 مختبر الحركات + سجل الحركات (Animation Registry) ---------------- */
function rblabHTML(){ const reg=rbAnimRegistry(), R0=S.rbLabReport;
 return head("🧪 مختبر الحركات — Fantastic Motion Engine V2","صفحة داخلية: التصاميم الخمسون وحركاتها جنباً إلى جنب للمقارنة والمراجعة + فحص التكرار الفعلي")+
 `<div class="card"><div class="row" style="gap:6px;flex-wrap:wrap"><button class="btn sm pri" data-rbx="labplay">▶ تشغيل الكل</button><button class="btn sm" data-rbx="labhit">🎁 وصول هدية للكل</button><button class="btn sm" data-rbx="labscan">🔎 فحص التكرار (بصمة حركية فعلية)</button><button class="btn sm" data-go="rlib">🎨 المكتبة</button></div>
  ${R0?`<div class="note small" style="margin-top:8px">${R0.dups.length?`❌ حركات متطابقة: ${R0.dups.map(x=>x.join(" = ")).join("، ")}`:"✅ لا توجد حركتان متطابقتان"} · أعلى تشابه بين حركتين: <b>${Math.round(R0.max*100)}%</b> (${esc(R0.pair.join(" ↔ "))}) · التصاميم: ${R0.designs} · حركات رئيسية فريدة: ${R0.uniqueMotions}/50</div>`:""}</div>
 <div class="rblab">${RB_DESIGNS.map(d=>`<div class="rblab-c"><div class="rlib-pv" data-rblabpv="${d.id}"></div><b class="small">${d.n}. ${esc(d.name)}</b><span class="mut small">⚡ ${(RBM_BY_ID[d.motion]||{}).n}. ${esc((RBM_BY_ID[d.motion]||{}).name||"")}</span></div>`).join("")}</div>
 <details class="card" style="margin-top:12px"><summary><b>📒 Animation Registry</b> — ${reg.length} حركة ومكوّن</summary><div class="tbl-wrap"><table class="tbl small"><tr><th>المعرّف</th><th>النوع</th><th>الاسم</th><th>المسار</th><th>التشغيل</th></tr>${reg.map(x=>`<tr><td><code>${esc(x.id)}</code></td><td>${esc(x.kind+(x.cat?"/"+x.cat:""))}</td><td>${esc(x.name)}</td><td><code>${esc(x.path)}</code></td><td>${esc(x.engine)}</td></tr>`).join("")}</table></div></details>` }
function rblabMount(){ document.querySelectorAll("[data-rblabpv]").forEach((el,i)=>setTimeout(()=>{ el._v=rbMkPreview(el,el.dataset.rblabpv,{maxRules:3}) },i*25)) }
/** فحص التكرار: يشغّل كل حركة على صف تجريبي ويسجل بصمتها الفعلية (لا يعتمد على الأسماء) */
function rbScanMotions(){ const box=document.createElement("div"); box.className="wd rbw rb50 rbl-static"; box.style.cssText="position:fixed;left:-3000px;top:0;width:600px;height:60px"; document.body.appendChild(box);
 const sample={id:"x",icon:"🎁",img:"",what:"وردة ×1",ms:5000,text:"+5 ثوانٍ",short:"+5s"}, T={};
 for(const m of RB_MOTIONS){ box.innerHTML=`<div class="rb-panel"><div class="rb-body"><div class="rb-list">${rowHTML(sample,{})}</div></div></div>`; T[m.id]=rbmTrace(box.querySelector(".rb-row"),m.id,{}) }
 box.remove(); const ids=Object.keys(T), dups=[]; let max=0, pair=["",""];
 for(let i=0;i<ids.length;i++) for(let j=i+1;j<ids.length;j++){ const a=T[ids[i]].join("\n"), b=T[ids[j]].join("\n"); if(a===b) dups.push([ids[i],ids[j]]); const s=rbmSimilar(T[ids[i]],T[ids[j]]); if(s>max){ max=s; pair=[ids[i],ids[j]] } }
 return {dups,max,pair,designs:RB_DESIGNS.length,uniqueMotions:new Set(RB_DESIGNS.map(d=>d.motion)).size,traces:T} }

/* ---------------- الأحداث ---------------- */
document.addEventListener("click",e=>{ const b=e.target.closest&&e.target.closest("[data-rbx]"); if(!b||b.tagName==="INPUT"&&b.type!=="checkbox"&&b.type!=="button") return; const d=b.dataset, a=d.rbx;
 if(b.tagName==="INPUT"&&b.type==="checkbox"&&!["sel","selall"].includes(a)) return;
 const list=()=>R.C.subathon.rules.list;
 if(a==="sel"){ const s=S.rbSel||(S.rbSel=new Set()); b.checked?s.add(d.id):s.delete(d.id); return renderPage(true) }
 if(a==="selall"){ S.rbSel=new Set(b.checked?list().map(r=>r.id):[]); return renderPage(true) }
 if(a==="show"){ return setRules(Lx=>{ const r=Lx.find(x=>x.id===d.id); if(r) r.show=r.show===false }) }
 if(a==="dup"){ return setRules(Lx=>{ const i=Lx.findIndex(x=>x.id===d.id); if(i>=0) Lx.splice(i+1,0,{...Lx[i],id:"r_"+uid(),label:(Lx[i].label||"")}) }) }
 if(a==="up"||a==="down"){ return setRules(Lx=>{ const i=Lx.findIndex(x=>x.id===d.id), j=i+(a==="up"?-1:1); if(i>=0&&j>=0&&j<Lx.length){ const [x]=Lx.splice(i,1); Lx.splice(j,0,x) } }) }
 if(a==="del"){ const r=list().find(x=>x.id===d.id); return ask(`حذف «${rbName(r||{})}» نهائياً؟ يختفي من الإعدادات والطبقة فوراً.`).then(ok=>{ if(ok) setRules(Lx=>{ const i=Lx.findIndex(x=>x.id===d.id); if(i>=0) Lx.splice(i,1) }) }) }
 if(a==="bulk"){ const ids=new Set(S.rbSel||[]); if(!ids.size) return; const op=d.op;
  const run=()=>{ setRules(Lx=>{ if(op==="del"){ for(let i=Lx.length-1;i>=0;i--) if(ids.has(Lx[i].id)) Lx.splice(i,1); return } for(const r of Lx) if(ids.has(r.id)){ if(op==="hide") r.show=false; if(op==="show") r.show=true; if(op==="on") r.enabled=true; if(op==="off") r.enabled=false } }); if(op==="del") S.rbSel=new Set() };
  return op==="del"?ask(`حذف ${ids.size} قانون نهائياً؟`).then(ok=>ok&&run()):run() }
 if(a==="dedupe"){ const dup=new Set(duplicateRules(list())); return ask(`حذف ${dup.size} قانون مكرر؟ (يبقى الأول من كل مجموعة)`).then(ok=>{ if(ok) setRules(Lx=>{ for(let i=Lx.length-1;i>=0;i--) if(dup.has(Lx[i].id)) Lx.splice(i,1) }) }) }
 if(a==="rsnd"){ const r=list().find(x=>x.id===d.id); return rbSndPick("صوت القانون: "+rbName(r||{}),src=>setRules(Lx=>{ const x=Lx.find(y=>y.id===d.id); if(x) x.soundId=src })) }
 if(a==="rmute"){ return setRules(Lx=>{ const x=Lx.find(y=>y.id===d.id); if(x) x.soundId="none" }) }
 if(a==="rsdef"){ return setRules(Lx=>{ const x=Lx.find(y=>y.id===d.id); if(x) x.soundId="" }) }
 if(a==="rplay"){ const r=list().find(x=>x.id===d.id); if(r&&r.soundId&&r.soundId!=="none") sndPreview(r.soundId); return }
 if(a==="sasplay"){ return sndPreview(d.src) }
 if(a==="saspick"||a==="saschg"){ const ev=d.ev, dir=d.dir, i=+d.i; return rbSndPick("صوت «"+(SA_SND_EVS.find(x=>x[0]===ev&&x[1]===dir)||[,,""])[2]+"»",src=>saSndUpdate(ev,dir,r=>{ const ref=sndRef({src,vol:100}); if(a==="saschg"&&r.sounds[i]) r.sounds[i]={...r.sounds[i],src}; else if(!r.sounds.some(s=>s.src===src)) r.sounds.push(ref) },"✅ تم اختيار الصوت")) }
 if(a==="sasdel"){ return saSndUpdate(d.ev,d.dir,r=>{ r.sounds.splice(+d.i,1) },"حُذف الصوت") }
 if(a==="sasrnd"){ return saSndUpdate(d.ev,d.dir,r=>{ r.mode=r.mode==="random"?"fixed":"random" },"تم") }
 if(a==="sasmute"){ return saSndUpdate(d.ev,d.dir,r=>{ r.on=r.on===false }, "تم") }
 if(a==="lib"){ S.rbTarget=d.wid; return go("rlib") }
 if(a==="hittest"){ const v=views.get(d.wid)||[...liveViews].find(x=>x.w&&x.w.id===d.wid); const real=R.C.subathon.rules.list.filter(r=>r.enabled&&r.show!==false&&!isEmptyRule(r)); if(!v) return toast("افتح الاستوديو لرؤية التجربة على اللوحة"); rbHitTest(v,real); return toast("🎁 تجربة مرئية فقط — العداد الحقيقي لم يتغير") }
 if(a==="preset"){ const w=findW(d.wid); if(!w) return; rbApplyPreset(w,d.k); save(); pushLayout(); refreshView(w); return renderPage(true) }
 if(a==="rcat"){ S.rlibCat=d.k; return renderPage(true) }
 if(a==="rpv") return rbPreviewModal(d.k);
 if(a==="ruse") return rbUseDesign(d.k,false);
 if(a==="rcust") return rbUseDesign(d.k,true);
 if(a==="rfav"){ const f=RB_FAV(), i=f.indexOf(d.k); if(i>=0) f.splice(i,1); else f.push(d.k); save(); return renderPage(true) }
 if(a==="rlink"){ const w=rbTargetW()||rbUseDesign(d.k,false); if(rbDesignOf(w.design).id!==d.k) rbUseDesign(d.k,false); return copy(overlayURL(L(),w.id)) }
 if(a==="labplay"){ document.querySelectorAll("[data-rblabpv]").forEach((el,i)=>setTimeout(()=>{ const v=el._v; if(v&&v.rbItems) v.buildRules(v.rbItems,false,true) },i*60)); return }
 if(a==="labhit"){ document.querySelectorAll("[data-rblabpv]").forEach((el,i)=>setTimeout(()=>rbHitTest(el._v),i*60)); return }
 if(a==="labscan"){ S.rbLabReport=rbScanMotions(); return renderPage(true) }
});
document.addEventListener("input",e=>{ const t=e.target; if(t.dataset&&t.dataset.rbx==="rq"){ S.rlibQ=t.value; clearTimeout(S.rlibT); S.rlibT=setTimeout(()=>{ renderPage(true); const i=document.querySelector('[data-rbx="rq"]'); if(i){ i.focus(); i.setSelectionRange(i.value.length,i.value.length) } },250) } });
document.addEventListener("change",e=>{ const t=e.target, d=t.dataset||{};
 if(d.rbx==="sasvol"){ return saSndUpdate(d.ev,d.dir,r=>{ if(r.sounds[+d.i]) r.sounds[+d.i].vol=+t.value }) }
 if(d.rbf&&d.wid){ const w=findW(d.wid); if(!w) return; const f=d.rbf; let v=t.type==="checkbox"?t.checked:t.value;
  if(f==="noImg") w.showImg=!v; else if(f==="noName") w.showWhat=!v; else if(f==="noTime") w.showTime=!v;
  else if(f==="aeOff"){ w.ae={...(w.ae||{}),off:!!v}; if(!v) w.animOn=true }
  else if(f==="aeSpeed"||f==="aePower"||f==="aeDur"){ w.ae={...(w.ae||{}),[f.slice(2).toLowerCase()]:+v}; if(f==="aeSpeed") w.animSpeed=+v }
  else if(["lineLen","lineThick","lineOp","lineSpeed","spacing","cols"].includes(f)) w[f]=+v;
  else w[f]=v;
  if(["hideBg","hideFrame","hideDeco","noImg","noName","noTime","showTitle","hideLine"].includes(f)) w.preset="custom";
  save(); pushLayout(); refreshView(w); return renderPage(true) }
 if(d.rbae&&d.wid){ const w=findW(d.wid); if(!w) return; w.ae={...(w.ae||{}),[d.rbae]:t.value}; save(); pushLayout(); refreshView(w); return renderPage(true) }
});
/* السحب والإفلات لترتيب القوانين */
document.addEventListener("dragstart",e=>{ const r=e.target.closest&&e.target.closest("[data-rbdrag]"); if(!r) return; if(e.target.closest("input,select,button")){ e.preventDefault(); return } S.rbDrag=r.dataset.rbdrag; r.classList.add("drag"); try{ e.dataTransfer.setData("text/plain",S.rbDrag); e.dataTransfer.effectAllowed="move" }catch(_){} });
document.addEventListener("dragover",e=>{ const r=e.target.closest&&e.target.closest("[data-rbdrag]"); if(!r||!S.rbDrag) return; e.preventDefault(); document.querySelectorAll(".rmg-row.over").forEach(x=>x!==r&&x.classList.remove("over")); r.classList.add("over") });
document.addEventListener("dragend",()=>{ document.querySelectorAll(".rmg-row.drag,.rmg-row.over").forEach(x=>x.classList.remove("drag","over")) });
document.addEventListener("drop",e=>{ const r=e.target.closest&&e.target.closest("[data-rbdrag]"); if(!r||!S.rbDrag) return; e.preventDefault(); const from=S.rbDrag, to=r.dataset.rbdrag; S.rbDrag=null; if(from===to) return;
 setRules(Lx=>{ const i=Lx.findIndex(x=>x.id===from), j=Lx.findIndex(x=>x.id===to); if(i<0||j<0) return; const [x]=Lx.splice(i,1); Lx.splice(j,0,x) }) });
/** صور الهدايا المفقودة: تُكمل تلقائياً من صور TikTok الحقيقية عند وصولها (لا صور تخمينية) */
function rbFillImgs(){ const cat=(S.catalog||[]).filter(g=>/^https:\/\//.test(g.image||"")); if(!cat.length) return; const need=R.C.subathon.rules.list.filter(r=>r.kind==="gift"&&!r.img&&r.giftId!=null&&r.giftId!=="*"&&cat.some(g=>String(g.id)===String(r.giftId)));
 if(!need.length) return; setRules(Lx=>{ for(const r of Lx) if(r.kind==="gift"&&!r.img){ const g=cat.find(x=>String(x.id)===String(r.giftId)); if(g) r.img=g.image } }) }
