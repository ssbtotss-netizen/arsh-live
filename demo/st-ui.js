/* ====== مكتبة «تصاميم مؤقت السابثون» + إعدادات التصميم — Timer Collection V3 ====== */
/* المعاينات تستخدم حالة وهمية محلية (stPreview) — لا تلمس وقت السابثون الحقيقي أبداً */
const ST_PV_DEF=2*3600000;
function stFavs(){ return S.settings.stFav||(S.settings.stFav=[]) }
function stLayW(){ return L().widgets.filter(w=>w.type==="subathon") }
function stTgt(){ const W=stLayW(); return W.find(x=>x.id===S.stTarget)||W.find(x=>x.id===S.sel)||W.find(x=>x.visible!==false)||W[0] }
function stLibHTML(){ const q=(S.stQ||"").toLowerCase(), g=S.stG||"", fav=stFavs();
 const list=ST_DESIGNS.filter(d=>(!g||(g==="fav"?fav.includes(d.id):d.grp===g))&&(!q||(d.n+" "+d.name+" "+d.desc).toLowerCase().includes(q)));
 const cur=stLayW(), using=new Set(cur.map(w=>w.design));
 return head("⏱️ تصاميم مؤقت السابثون",`${ST_DESIGNS.length} تصميماً مستقلاً — كل تصميم له شكله وحركة أرقامه ومؤثرات الزيادة والنقصان واقتراب النهاية. كلها تقرأ من نفس مصدر الوقت، فتغيير التصميم لا يصفّر شيئاً.`)+
 `<div class="card st-libbar"><div class="row" style="gap:6px;flex-wrap:wrap;align-items:center">
  <button class="btn sm ${!g?"on":""}" data-stx="grp" data-g="">الكل (${ST_DESIGNS.length})</button>${Object.entries(ST_GROUPS).map(([k,v])=>`<button class="btn sm ${g===k?"on":""}" data-stx="grp" data-g="${k}">${v} (${ST_DESIGNS.filter(d=>d.grp===k).length})</button>`).join("")}<button class="btn sm ${g==="fav"?"on":""}" data-stx="grp" data-g="fav">⭐ المفضلة (${fav.length})</button>
  ${cur.length>1?`<select class="inp" style="max-width:220px" data-sttarget title="العنصر الذي يُطبّق عليه «استخدام»">${cur.map(w=>`<option value="${w.id}" ${stTgt()&&stTgt().id===w.id?"selected":""}>يُطبّق على: ${esc(w.name||"السابثون")} — ${esc(dname(w.design,true))}</option>`).join("")}</select>`:""}<input class="inp" style="max-width:220px;margin-inline-start:auto" placeholder="ابحث بالاسم أو الرقم" value="${esc(S.stQ||"")}" data-stq>
 </div><p class="mut small" style="margin:8px 0 0">مرّر الماوس على أي تصميم لتشوف حركته. أزرار التجربة تعمل على نسخة معاينة فقط — العداد الحقيقي ما يتأثر.${cur.length?` · عناصر السابثون في التخطيط الحالي: <b>${cur.length}</b>`:""}</p></div>
 <div class="st-grid">${list.map(d=>`<div class="st-card ${using.has(d.id)?"used":""}" data-stcard="${d.id}">
  <div class="st-pv" data-stpv="${d.id}"></div>
  <div class="st-meta"><b>${d.n}. ${esc(d.name)}</b><span class="mut small">${esc(d.desc)}</span><span class="tag">${esc(ST_GROUPS[d.grp])}</span>${using.has(d.id)?'<span class="tag" style="background:#14532d">مستخدم الآن</span>':""}</div>
  <div class="st-acts"><button class="btn xs" data-stx="add" data-id="${d.id}" title="تجربة زيادة">＋5د</button><button class="btn xs" data-stx="big" data-id="${d.id}" title="زيادة أسطورية">＋2س</button><button class="btn xs" data-stx="sub" data-id="${d.id}" title="تجربة نقص">−5د</button><button class="btn xs" data-stx="end" data-id="${d.id}" title="تجربة النهاية">🏁</button><button class="btn xs" data-stx="evo" data-id="${d.id}" title="تجربة مراحل التطور">🧬</button>
   <button class="btn xs" data-stx="fav" data-id="${d.id}">${fav.includes(d.id)?"★":"☆"}</button><button class="btn xs" data-stx="big-pv" data-id="${d.id}">🔍 معاينة</button><button class="btn xs" data-stx="custom" data-id="${d.id}">🎛️ تخصيص</button><button class="btn xs pri" data-stx="use" data-id="${d.id}">استخدام</button><button class="btn xs" data-stx="link" data-id="${d.id}">🔗 نسخ الرابط</button></div>
 </div>`).join("")||`<div class="sa2-empty">لا توجد تصاميم مطابقة.</div>`}</div>`}

/** معاينة محلية: حالة وهمية مستقلة لكل بطاقة */
function stPvState(){ const now=Date.now(); return {status:"running",endsAt:now+ST_PV_DEF,remainingMs:ST_PV_DEF,initialMs:ST_PV_DEF,totalAddedMs:0,name:"السابثون"} }
function stMountPv(host,id,big){ if(host.__v) return host.__v; const d=ST_BY_ID[id]; if(!d) return null; const W=big?900:320, H=big?380:150;
 const stg=document.createElement("div"); stg.className="stage"; stg.style.cssText=`background:none;width:${W}px;height:${H}px;transform-origin:0 0;position:relative`; host.innerHTML=""; host.appendChild(stg);
 const fit=()=>{ const s=Math.min(host.clientWidth/W,(host.clientHeight||H)/H)||1; stg.style.transform=`scale(${s})`; stg.style.marginInline=Math.max(0,(host.clientWidth-W*s)/2)+"px" }; fit();
 const pv={s:stPvState()}; const w=newWidget("subathon",{design:id,x:0,y:.08,w:1,h:.84,stEvo:false,title:"السابثون"});
 const v=new View(w,{w:W,h:H},{data:SRC,mute:true,stPreview:pv}); stg.appendChild(v.el); v.refresh(SRC(),true); v.__pv=pv; host.__v=v; liveViews.add(v); return v }
function stUnmountPv(host){ const v=host.__v; if(!v) return; liveViews.delete(v); v.el.remove(); host.__v=null; host.innerHTML="" }
function stPvAct(v,a){ if(!v) return; const s=v.__pv.s, now=Date.now(), rem=()=>s.status==="running"?Math.max(0,s.endsAt-now):s.remainingMs, set=ms=>{ if(s.status==="running") s.endsAt=now+ms; else s.remainingMs=ms };
 if(a==="add"||a==="big"){ const d=a==="big"?2*3600000:5*60000; if(s.status==="ended"){ Object.assign(s,stPvState()) } set(rem()+d); s.totalAddedMs+=d; v.stPlayDelta(d,"تجربة",1) }
 else if(a==="sub"){ const d=Math.min(rem(),5*60000); set(rem()-d); v.stPlayDelta(-d,"تجربة",1) }
 else if(a==="end"){ set(8000); clearTimeout(v.__endT); v.__endT=setTimeout(()=>{ s.status="ended"; s.remainingMs=0; v.stLog({sa:"end"}) },8200) }
 else if(a==="evo"){ v.w.stEvo=true; const H=[0.5,1,3,6,12,24,48,72,100], i=((v.__evoI??-1)+1)%H.length; v.__evoI=i; Object.assign(s,stPvState()); set(H[i]*3600000); }
 v.refresh(SRC(),true) }
let stIO=null;
function stLibMount(){ if(stIO) stIO.disconnect(); /* إيقاف المعاينات غير الظاهرة لتوفير الأداء */
 stIO=new IntersectionObserver(es=>es.forEach(e=>{ const h=e.target; if(e.isIntersecting) stMountPv(h,h.dataset.stpv); else stUnmountPv(h) }),{rootMargin:"120px"});
 document.querySelectorAll("[data-stpv]").forEach(h=>stIO.observe(h)) }
function stUse(id,silent){ const l=L(); let w=stTgt();
 if(w){ w.design=id } else { w=newWidget("subathon",{design:id,z:Math.max(0,...l.widgets.map(x=>x.z))+1}); l.widgets.push(w) }
 save(); pushLayout(); refreshView(w); if(!silent) toast(`✓ صار «${ST_BY_ID[id].name}» تصميم ${esc(w.name||"السابثون")} — الوقت ما تغيّر`); return w }

document.addEventListener("mouseover",e=>{ const c=e.target.closest&&e.target.closest("[data-stcard]"); if(!c||c.__hov) return; c.__hov=1; const h=c.querySelector("[data-stpv]"); stPvAct(h&&h.__v,"add") });
document.addEventListener("mouseout",e=>{ const c=e.target.closest&&e.target.closest("[data-stcard]"); if(c&&!c.contains(e.relatedTarget)) c.__hov=0 });
document.addEventListener("input",e=>{ const t=e.target; if(t.matches&&t.matches("[data-stq]")){ S.stQ=t.value; clearTimeout(stIO&&stIO.__t); const pos=t.selectionStart; renderPage(true); const n=document.querySelector("[data-stq]"); if(n){ n.focus(); n.setSelectionRange(pos,pos) } } });
document.addEventListener("change",e=>{ const t=e.target; if(t.matches&&t.matches("[data-sttarget]")){ S.stTarget=t.value; return } if(!t.dataset||!t.dataset.stf) return; const w=findW(t.dataset.wid); if(!w) return; const f=t.dataset.stf;
 if(f==="stStages"){ const L2=t.value.split(/[,،\n]/).map(x=>x.split(/[:=]/)).filter(p=>p.length===2&&!isNaN(+p[0])&&p[1].trim()).map(([h,n])=>[Math.max(0,+h),n.trim().slice(0,24)]).sort((a,b)=>a[0]-b[0]).slice(0,12); if(L2.length<2) return toast("اكتب مرحلتين على الأقل مثل 0:Basic, 1:Bronze"); w.stStages=L2 }
 if(f==="stTiers"){ const T=[...t.closest(".st-tiers").querySelectorAll("input")].map(x=>Math.max(1,+x.value||1)); if(!(T[0]<T[1]&&T[1]<T[2])) return toast("الحدود لازم تكون تصاعدية: بسيطة < متوسطة < كبيرة"); w.stTiers=T }
 save(); pushLayout(); refreshView(w); renderProps&&renderProps() });
document.addEventListener("click",e=>{ const b=e.target.closest&&e.target.closest("[data-stx]"); if(!b) return; const d=b.dataset, a=d.stx;
 if(a==="grp"){ S.stG=d.g; return renderPage(true) }
 const host=d.id&&document.querySelector(`[data-stpv="${d.id}"]`);
 if(["add","big","sub","end","evo"].includes(a)) return stPvAct((S.stBig&&S.stBig.__id===d.id&&document.body.contains(S.stBig.el)?S.stBig:null)||(host&&(host.__v||stMountPv(host,d.id))),a);
 if(a==="fav"){ const F=stFavs(), i=F.indexOf(d.id); if(i<0) F.push(d.id); else F.splice(i,1); save(); return renderPage(true) }
 if(a==="big-pv"){ const dd=ST_BY_ID[d.id], m=modal(`<h3 style="margin:0 0 8px">${dd.n}. ${esc(dd.name)}</h3><p class="mut small">${esc(dd.desc)} — معاينة فقط</p><div class="st-bigpv" style="height:380px;background:repeating-conic-gradient(#1b2232 0 25%,#141a27 0 50%) 0 0/24px 24px;border-radius:12px"></div><div class="row" style="margin-top:10px;gap:6px;flex-wrap:wrap"><button class="btn sm" data-stx="add" data-id="${d.id}">＋5 دقائق</button><button class="btn sm" data-stx="big" data-id="${d.id}">＋ساعتين (أسطورية)</button><button class="btn sm" data-stx="sub" data-id="${d.id}">−5 دقائق</button><button class="btn sm" data-stx="end" data-id="${d.id}">🏁 النهاية</button><button class="btn sm" data-stx="evo" data-id="${d.id}">🧬 المرحلة التالية</button><button class="btn sm pri" data-stx="use" data-id="${d.id}">استخدام</button><button class="btn sm" data-close>إغلاق</button></div>`);
  const v=stMountPv(m.querySelector(".st-bigpv"),d.id,true); v.__id=d.id; S.stBig=v; return }
 if(a==="use"){ stUse(d.id); return S.page==="stlib"?renderPage(true):null }
 if(a==="custom"){ const w=stUse(d.id,true); S.sel=w.id; go("studio"); return toast("🎛️ خصّص التصميم من لوحة الخصائص") }
 if(a==="link"){ const w=stLayW().find(x=>x.design===d.id)||stUse(d.id,true); copy(overlayURL(L(),w.id)); return S.page==="stlib"?renderPage(true):null }
 if(a==="preset"){ const w=findW(d.wid); if(!w) return; Object.assign(w,{stNoBg:false,stNoFrame:false,stNoDeco:false,stNoTitle:false,stTextOnly:false,stNoLine:false,stForceLine:false},stPreset(d.p)); w.stPresetK=d.p; save(); pushLayout(); refreshView(w); return renderProps&&renderProps() }
 if(a==="reset-col"){ const w=findW(d.wid); if(!w) return; for(const k of ["stNum","stBg","stFr","stLn"]) delete w[k]; save(); pushLayout(); refreshView(w); return renderProps&&renderProps() }
});

function stPropsHTML(w,sel,rng){ const d=ST_BY_ID[w.design], id=w.id, yn=(f,l,def=true)=>sel(f,l,[["1","مفعّل"],["0","متوقف"]],(w[f]??def)?"1":"0"), sh=(f,l,def=false)=>sel(f,l,[["0","ظاهر"],["1","مخفي"]],(w[f]??def)?"1":"0");
 const col=(f,l,def)=>`<div class="fld"><label>${l}</label><input type="color" data-wf="${f}" data-wid="${id}" value="${esc(w[f]||def)}"></div>`;
 const T=Array.isArray(w.stTiers)&&w.stTiers.length===3?w.stTiers:ST_TIERS_DEF, ST=(Array.isArray(w.stStages)&&w.stStages.length?w.stStages:ST_STAGES_DEF).map(([h,n])=>h+":"+n).join(", ");
 return `<div class="card st-props" style="margin:8px 0;padding:10px">
 <div class="row" style="justify-content:space-between;align-items:center"><b>⏱️ ${d.n}. ${esc(d.name)}</b><button class="btn xs" data-go="stlib">🎨 المكتبة (${ST_DESIGNS.length})</button></div>
 <p class="mut small" style="margin:4px 0 8px">${esc(d.desc)} · زيادة: <b>${d.add}</b> · نقصان: <b>${d.sub}</b></p>
 <label class="mut small">قالب سريع</label><div class="row" style="gap:4px;flex-wrap:wrap;margin:4px 0 8px">${Object.entries(ST_PRESETS).filter(([k])=>k!=="custom").map(([k,v])=>`<button class="btn xs ${w.stPresetK===k?"on":""}" data-stx="preset" data-p="${k}" data-wid="${id}">${v}</button>`).join("")}</div>
 <details open><summary>🕐 تنسيق الوقت</summary>${sel("stFmt","التنسيق",ST_FORMATS,w.stFmt||"hms")}<div class="grid g2" style="gap:6px">${sel("stShowD","الأيام",[["1","ظاهرة"],["0","مخفية"]],w.stShowD!==false?"1":"0")}${sel("stShowH","الساعات",[["1","ظاهرة"],["0","مخفية"]],w.stShowH!==false?"1":"0")}${sel("stShowM","الدقائق",[["1","ظاهرة"],["0","مخفية"]],w.stShowM!==false?"1":"0")}${sel("stShowS","الثواني",[["1","ظاهرة"],["0","مخفية"]],w.stShowS!==false?"1":"0")}</div><p class="mut small">الساعات لا تتصفر بعد 24 — 125:30:25 تظهر كما هي.</p></details>
 <details><summary>🎨 الشكل والألوان</summary><div class="grid g2" style="gap:6px">${sh("stNoBg","الخلفية",true)}${sh("stNoFrame","الإطار")}${sh("stNoDeco","الزخارف")}${sh("stNoTitle","العنوان")}${sh("stNoLine","الخط السفلي")}${sel("stDir","الاتجاه",[["","تلقائي"],["ltr","يسار ← يمين"]],w.stDir||"")}</div>
  <div class="grid g2" style="gap:6px">${col("stNum","لون الأرقام","#ffffff")}${col("stBg","لون الخلفية","#0b1020")}${col("stFr","لون الإطار","#f6c94a")}${col("stLn","لون الخط/التقدم","#4d8dff")}</div><button class="btn xs" data-stx="reset-col" data-wid="${id}">↺ ألوان التصميم الأصلية</button>
  ${rng("fontScale","حجم الأرقام",.5,2.5,.05,w.fontScale||1,v=>Math.round(v*100)+"%")}${rng("stBgOp","شفافية الخلفية",0,1,.05,w.stBgOp??1,v=>Math.round(v*100)+"%")}${rng("stGap","المسافة بين الأرقام",0,.6,.02,w.stGap??.06)}${rng("stDec","حجم الزخارف",.5,2,.05,w.stDec||1,v=>Math.round(v*100)+"%")}${rng("stFrW","سماكة الخط",0,12,1,w.stFrW||0,v=>v?v+"px":"افتراضي")}</details>
 <details><summary>✨ الحركة والمؤثرات</summary><div class="grid g2" style="gap:6px">${yn("animOn","الحركة الدائمة")}${yn("stFxOn","مؤثرات الزيادة/النقص")}${yn("stNote","إشعار +الوقت")}${yn("stDonor","اسم الداعم في الإشعار")}${sel("stNotePos","مكان الإشعار",[["top","أعلى"],["bottom","أسفل"],["side","جانب"]],w.stNotePos||"top")}${yn("stLite","الوضع الخفيف (أداء)",false)}</div>
  ${rng("animSpeed","سرعة الحركة",.4,2.5,.05,w.animSpeed||1,v=>"×"+(+v).toFixed(2))}${rng("stFxPower","قوة المؤثرات",.3,1.8,.05,w.stFxPower||1,v=>Math.round(v*100)+"%")}${rng("stFxOp","شفافية المؤثرات",.1,1,.05,w.stFxOp??1,v=>Math.round(v*100)+"%")}${rng("stNoteSec","مدة الإشعار",1,8,.5,w.stNoteSec||3,v=>v+" ث")}${rng("stGroupMs","تجميع الهدايا المتتالية",150,2000,50,w.stGroupMs||300,v=>v+" ms")}
  <label class="mut small">مستويات الزيادة (بالدقائق): بسيطة &lt; متوسطة &lt; كبيرة &lt; أسطورية</label><div class="row st-tiers" style="gap:4px;flex-wrap:nowrap">${T.map((x,i)=>`<input class="inp" type="number" min="1" value="${x}" data-stf="stTiers" data-wid="${id}" title="${["متوسطة من","كبيرة من","أسطورية من"][i]}">`).join("")}</div></details>
 <details><summary>🧬 تطور المؤقت (Timer Evolution)</summary><div class="grid g2" style="gap:6px">${yn("stEvo","التطور",false)}${sel("stEvoMode","المرحلة المعروضة",[["current","حسب الوقت الحالي"],["highest","الاحتفاظ بأعلى مرحلة"]],w.stEvoMode||"current")}</div>
  <div class="fld"><label>المراحل (ساعات:اسم)</label><textarea class="inp" rows="2" data-stf="stStages" data-wid="${id}">${esc(ST)}</textarea></div></details>
 <details><summary>⏳ العد التنازلي الأخير</summary><div class="grid g2" style="gap:6px">${yn("stFc","مفعّل")}${rng("stFcWarn","تحذير هادئ قبل",1,60,1,w.stFcWarn||10,v=>v+" د")}${rng("stFcCount","عدّ واضح قبل",10,300,5,w.stFcCount||60,v=>v+" ث")}${rng("stFcLast","الثواني الأخيرة",3,30,1,w.stFcLast||10,v=>v+" ث")}</div><p class="mut small">بدون وميض سريع أو مؤذٍ.</p></details>
 <details><summary>🎯 هدف الوقت</summary><div class="grid g2" style="gap:6px">${rng("stGoalH","الهدف",0,200,1,w.stGoalH||0,v=>v?v+" ساعة":"بدون هدف")}${sel("stGoalMode","يُقاس بـ",[["remaining","الوقت المتبقي"],["added","مجموع الوقت المضاف"]],w.stGoalMode||"remaining")}${yn("stGoalShow","إظهار شريط الهدف")}</div></details>
 <div class="row" style="gap:6px;margin-top:8px"><button class="btn xs" data-go="subathon">🔊 أصوات السابثون</button><button class="btn xs" data-lecopy="${id}">🔗 نسخ رابط OBS</button></div>
 </div>` }
