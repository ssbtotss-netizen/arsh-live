/* ===================== ↔ اتجاه وترتيب العناصر — B6O6 Fantastic Mirror Layout ===================== */
function mirPropsHTML(w){ if(!w||MIR_SKIP.has(w.type)) return w&&w.type==="rotator"?`<div class="card" style="margin:8px 0"><button class="btn sm pri" data-go="rotations">🔁 إعدادات المجموعة المتناوبة</button></div>`:"";
 const m=w.mir||"default", O=w.mirOrder||null, hist=(w.mirHist||[]).length;
 return `<div class="mir-box"><h4>↔ اتجاه وترتيب العناصر</h4>
  <div class="row" style="gap:6px;flex-wrap:wrap"><button class="btn sm ${m==="right"?"on":""}" data-mir="right" data-wid="${w.id}">الصورة يمين</button><button class="btn sm ${m==="left"?"on":""}" data-mir="left" data-wid="${w.id}">الصورة يسار</button>
   <button class="btn sm pri" data-mir="flip" data-wid="${w.id}" title="عكس الاتجاه بضغطة">⇆ Flip Layout</button>${hist?`<button class="btn sm" data-mir="undo" data-wid="${w.id}">↶ تراجع</button>`:""}<button class="btn sm ${m==="default"?"on":""}" data-mir="default" data-wid="${w.id}">الافتراضي</button></div>
  <div class="grid g2" style="gap:8px;margin-top:8px"><div class="fld" style="margin:0"><label>الاتجاه</label><select class="inp" data-mirf="mir" data-wid="${w.id}">${MIR_MODES.map(([k,t])=>`<option value="${k}" ${m===k?"selected":""}>${t}</option>`).join("")}</select></div>
   <label class="row small" style="gap:6px;align-self:end"><input type="checkbox" data-mirf="mirMotion" data-wid="${w.id}" ${w.mirMotion?"checked":""}> عكس اتجاه الحركة فقط</label></div>
  <details class="mir-adv" ${O||w.mirAlign||w.mirGap||w.mirRowGap?"open":""}><summary class="small">ترتيب مخصص ومسافات</summary>
   <div class="grid g2" style="gap:8px;margin-top:6px">${MIR_PARTS.map(([k,t])=>`<div class="fld" style="margin:0"><label>موقع ${t}</label><select class="inp" data-mirord="${k}" data-wid="${w.id}"><option value="">حسب التصميم</option>${[1,2,3,4].map(n=>`<option value="${n}" ${O&&+O[k]===n?"selected":""}>${n===1?"الأول (بداية الصف)":n===4?"الأخير (نهاية الصف)":"الموضع "+n}</option>`).join("")}</select></div>`).join("")}
    <div class="fld" style="margin:0"><label>محاذاة النص</label><select class="inp" data-mirf="mirAlign" data-wid="${w.id}">${[["","حسب التصميم"],["start","بداية"],["center","المنتصف"],["end","نهاية"]].map(([k,t])=>`<option value="${k}" ${(w.mirAlign||"")===k?"selected":""}>${t}</option>`).join("")}</select></div>
    <div class="fld" style="margin:0"><label>المسافة بين العناصر <b class="mut">${(+w.mirGap||0).toFixed(1)}</b></label><input type="range" min="0" max="2" step=".1" value="${+w.mirGap||0}" data-mirf="mirGap" data-wid="${w.id}"></div>
    <div class="fld" style="margin:0"><label>المسافة بين الصفوف <b class="mut">${+w.mirRowGap||0}px</b></label><input type="range" min="0" max="40" step="1" value="${+w.mirRowGap||0}" data-mirf="mirRowGap" data-wid="${w.id}"></div></div>
   ${O?`<button class="btn xs" data-mir="resetord" data-wid="${w.id}" style="margin-top:6px">↺ ترتيب التصميم</button>`:""}</details>
  <p class="mut small" style="margin:6px 0 0">إعادة ترتيب فعلية: النصوص والأرقام والصور لا تنعكس، والحجم والموقع لا يتغيران. يصل للبث فوراً.</p></div>` }
function mirUpd(w,fn){ fn(w); save(); pushLayout(); if(typeof refreshView==="function") refreshView(w); renderPage(true) }
function mirSetMode(w,m){ const h=w.mirHist||(w.mirHist=[]); h.push(w.mir||"default"); if(h.length>20) h.shift(); w.mir=m }
/** الاتجاه الحالي للعنصر في المعاينة (لزر Flip): هل الصورة يمين أم يسار؟ */
function mirCurSide(w){ const v=(typeof views!=="undefined"&&views.get(w.id))||null; if(!v||!v.mirSide) return null; const on=v.mirOn; const s=v.mirSide(); return s }
document.addEventListener("click",e=>{ const b=e.target.closest&&e.target.closest("[data-mir]"); if(!b) return; const w=findW(b.dataset.wid); if(!w) return; const a=b.dataset.mir;
 if(a==="undo") return mirUpd(w,w=>{ const h=w.mirHist||[]; if(h.length) w.mir=h.pop() });
 if(a==="resetord") return mirUpd(w,w=>{ delete w.mirOrder });
 if(a==="flip") return mirUpd(w,w=>{ const cur=w.mir||"default", s=mirCurSide(w); let nx;
  if(cur==="right") nx="left"; else if(cur==="left") nx="right"; else if(s==="right") nx="left"; else if(s==="left") nx="right"; else nx=cur==="reverse"?"default":"reverse"; mirSetMode(w,nx); toast("⇆ تم عكس الاتجاه") });
 mirUpd(w,w=>mirSetMode(w,a)) });
document.addEventListener("change",e=>{ const t=e.target, d=t.dataset||{};
 if(d.mirf){ const w=findW(d.wid); if(!w) return; const f=d.mirf, v=t.type==="checkbox"?t.checked:t.value; return mirUpd(w,w=>{ if(f==="mir") mirSetMode(w,v); else if(f==="mirGap"||f==="mirRowGap") w[f]=+v; else w[f]=v }) }
 if(d.mirord){ const w=findW(d.wid); if(!w) return; return mirUpd(w,w=>{ const O={...(w.mirOrder||{})}; if(t.value) O[d.mirord]=+t.value; else delete O[d.mirord]; w.mirOrder=Object.keys(O).length?O:undefined; if(!w.mirOrder) delete w.mirOrder }) }
});
/** القوائم المتناوبة: تطبيق اتجاه واحد على جميع قوائم المجموعة */
function rotMirAll(g,m){ const l=L(); for(const it of g.items||[]){ const w=l.widgets.find(x=>x.id===it.ref); if(w&&!MIR_SKIP.has(w.type)) mirSetMode(w,m) } save(); pushLayout(); toast("↔ طُبّق الاتجاه على جميع قوائم المجموعة") }
