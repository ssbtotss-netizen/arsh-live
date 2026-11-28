/* ================= 🎓 أكاديمية بطوط ستريم — مقاطع تعليمية 59 ثانية =================
   الفهرس: /academy/index.json (يُولَّد من tools/academy/manifest.py) — الفيديو والغلاف ملفات ثابتة في public/academy.
   زر «تعلّم الميزة في 59 ثانية» يظهر أعلى كل صفحة لها حلقة. المشاهدة تُحفظ محلياً (S.acad.w). */
var ACX=null, ACXp=null;
function acBase(){ return location.protocol==="file:"?"../arsh-live/public/academy/":"/academy/" }
function acLoad(){ if(ACX) return Promise.resolve(ACX); if(ACXp) return ACXp;
 ACXp=(window.B6O6_ACADEMY?Promise.resolve(window.B6O6_ACADEMY):fetch(acBase()+"index.json",{cache:"no-cache"}).then(r=>r.ok?r.json():{eps:[]}))
  .then(d=>{ ACX={eps:(d.eps||[]).sort((a,b)=>a.num-b.num)}; return ACX }).catch(()=>{ ACX={eps:[]}; return ACX }); return ACXp }
function AC(){ S.acad=S.acad||{q:"",cat:"",w:{}}; S.acad.w=S.acad.w||{}; return S.acad }
function acFor(p){ return ACX&&ACX.eps.find(e=>(e.pages||[e.page]).includes(p)) }
function acNum(n){ return String(n).padStart(2,"0") }
function acCard(e){ const w=AC().w[e.slug];
 return `<button class="ac-card ${w?"seen":""}" data-ac="play" data-k="${esc(e.slug)}"><span class="ac-thumb"><img loading="lazy" src="${acBase()+esc(e.poster)}" alt=""><i class="ac-dur">0:59</i>${w?'<i class="ac-seen">✓ شاهدتها</i>':""}<i class="ac-playb">▶</i></span>
  <span class="ac-meta"><small>الحلقة ${acNum(e.num)} · ${esc(e.cat)}</small><b>${esc(e.title)}</b><span>${esc(e.hook)}</span></span></button>` }
function acHTML(){ const A=AC();
 if(!ACX) return `<div class="top"><div><h1>🎓 أكاديمية بطوط ستريم</h1><p>…جاري تحميل الحلقات</p></div></div>`;
 const cats=[...new Set(ACX.eps.map(e=>e.cat))], q=(A.q||"").trim();
 const list=ACX.eps.filter(e=>(!A.cat||e.cat===A.cat)&&(!q||(e.title+" "+e.hook+" "+e.desc).includes(q)));
 const seen=ACX.eps.filter(e=>A.w[e.slug]).length, nxt=ACX.eps.find(e=>!A.w[e.slug]);
 return `<div class="top"><div><h1>🎓 أكاديمية بطوط ستريم</h1><p>تعلّم كل ميزة في 59 ثانية — بدون كلام كثير، خطوات واضحة من داخل المنصة.</p></div></div>
 <div class="card ac-hero"><div><b>${seen} من ${ACX.eps.length}</b><span>حلقة شاهدتها</span></div><div class="ac-prog"><i style="width:${ACX.eps.length?Math.round(seen/ACX.eps.length*100):0}%"></i></div>
  ${nxt?`<button class="btn pri" data-ac="play" data-k="${esc(nxt.slug)}">▶ كمّل من الحلقة ${acNum(nxt.num)}</button>`:`<span class="tag">🏆 خلّصت كل الحلقات</span>`}</div>
 <div class="row ac-tools"><input class="inp" type="search" data-acq placeholder="🔎 ابحث عن ميزة… (سبثون، أصوات، شات)" value="${esc(A.q||"")}">
  <div class="row" style="gap:6px;flex-wrap:wrap"><button class="btn sm ${!A.cat?"pri":""}" data-ac="cat" data-k="">الكل ${ACX.eps.length}</button>${cats.map(c=>`<button class="btn sm ${A.cat===c?"pri":""}" data-ac="cat" data-k="${esc(c)}">${esc(c)}</button>`).join("")}</div></div>
 <div class="ac-grid" id="ac-grid">${list.map(acCard).join("")||'<div class="empty">ما فيه حلقة بهذا الاسم — جرّب كلمة ثانية</div>'}</div>` }
function acMount(){ if(!ACX) acLoad().then(()=>{ if(S.page==="academy") renderPage() }) }
function acPlay(slug){ const e=ACX&&ACX.eps.find(x=>x.slug===slug); if(!e) return; const i=ACX.eps.indexOf(e), nx=ACX.eps[i+1];
 const m=modal(`<div class="ac-player"><div class="ac-vid"><video src="${acBase()+esc(e.video)}" poster="${acBase()+esc(e.poster)}" controls playsinline autoplay preload="metadata"></video></div>
  <div class="ac-info"><small>الحلقة ${acNum(e.num)} · ${esc(e.cat)}</small><h3>${esc(e.title)}</h3><p>${esc(e.desc)}</p>
   <div class="ac-acts"><button class="btn pri sm" data-ac="go" data-k="${esc(e.page)}">↗ افتح الميزة</button><button class="btn sm" data-ac="share" data-k="${esc(e.slug)}">🔗 مشاركة</button>
   ${nx?`<button class="btn sm" data-ac="play" data-k="${esc(nx.slug)}">التالي: ${esc(nx.title)} ←</button>`:""}<button class="btn sm" data-close>إغلاق</button></div>
   <span class="mut ac-note">🔇 المقاطع بدون تعليق صوتي — الشرح بالنصوص على الشاشة.</span></div></div>`);
 m.classList.add("ac-modal"); const v=m.querySelector("video"); const mark=()=>{ const A=AC(); if(!A.w[e.slug]){ A.w[e.slug]=Date.now(); save(); document.querySelectorAll(`.ac-learn[data-k="${e.slug}"] small`).forEach(x=>x.textContent="✓ شاهدتها") } };
 v.addEventListener("timeupdate",()=>{ if(v.duration&&v.currentTime/v.duration>.85) mark() }); v.addEventListener("ended",mark);
 m.addEventListener("click",ev=>{ const ab=ev.target.closest&&ev.target.closest("[data-ac]"); if(ab){ ev.stopPropagation(); acClick(ab,ev); return }
  if(ev.target.closest("[data-close]")||ev.target===m){ v.pause(); if(S.page==="academy") renderPage(true) } });
 return m }
function acClick(b,e){ const d=b.dataset, k=d.k, A=AC();
 if(d.ac==="play"){ document.querySelectorAll(".modal.ac-modal").forEach(x=>{ const v=x.querySelector("video"); if(v) v.pause(); x.remove() }); acLoad().then(()=>acPlay(k)); return true }
 if(d.ac==="cat"){ A.cat=k; renderPage(true); return true }
 if(d.ac==="go"){ document.querySelectorAll(".modal.ac-modal").forEach(x=>{ x.querySelector("video")?.pause(); x.remove() }); go(k); return true }
 if(d.ac==="share"){ const url=baseURL().replace(/\/?(index\.html)?$/,"")+(location.protocol==="file:"?"":"")+"#academy="+k, ep=ACX.eps.find(x=>x.slug===k);
  if(navigator.share) navigator.share({title:"بطوط ستريم — "+(ep?ep.title:""),url}).catch(()=>{}); else copy(url); return true }
 return false }
function acInput(t){ if(t.dataset&&t.dataset.acq!==undefined){ AC().q=t.value; const g=document.getElementById("ac-grid"); if(g){ const q=t.value.trim(), A=AC(); g.innerHTML=ACX.eps.filter(e=>(!A.cat||e.cat===A.cat)&&(!q||(e.title+" "+e.hook+" "+e.desc).includes(q))).map(acCard).join("")||'<div class="empty">ما فيه حلقة بهذا الاسم — جرّب كلمة ثانية</div>' } return true } return false }
/** زر «تعلّم الميزة في 59 ثانية» أعلى كل صفحة لها حلقة */
function acInject(p){ if(p==="academy"||document.body.classList.contains("flc-only")) return; acLoad().then(()=>{ if(S.page!==p) return; const e=acFor(p); const pg=document.getElementById("pg"); if(!e||!pg||pg.querySelector(".ac-learn")) return;
 const d=document.createElement("div"); d.className="ac-bar"; d.innerHTML=`<button class="ac-learn" data-ac="play" data-k="${esc(e.slug)}"><span class="ac-ico">🎓</span><b>تعلّم الميزة في 59 ثانية</b><small>${AC().w[e.slug]?"✓ شاهدتها":"الحلقة "+acNum(e.num)}</small></button>`; pg.prepend(d) }) }
// رابط مباشر لحلقة: ‎#academy=slug
setTimeout(()=>{ const m=/^#academy=([\w-]+)/.exec(location.hash||""); if(m){ go("academy"); acLoad().then(()=>acPlay(m[1])) } },0);
