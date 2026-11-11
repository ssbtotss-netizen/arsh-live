const LOGO="data:image/png;base64,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";
/* ================= النقل: نفس المتصفح (BroadcastChannel) أو الخادم (WebSocket) ================= */
const bus=("BroadcastChannel" in window)?new BroadcastChannel("b6o6-live-v2"):null;
let ws=null, wsReady=false;
function connectWS(url,room,key,onMsg,onStatus){
 try{ if(ws){ ws.onclose=ws.onerror=ws.onmessage=null; ws.close() } }catch(e){}
 if(!url) return;
 let sock; try{ sock=ws=new WebSocket(url) }catch(e){ onStatus&&onStatus(false,"رابط غير صالح"); return }
 sock.onopen=()=>{wsReady=true; sock.send(JSON.stringify({t:"join",room,key})); onStatus&&onStatus(true)};
 sock.onerror=()=>{sock._err=true};
 sock.onclose=()=>{ if(ws===sock) wsReady=false; onStatus&&onStatus(false,sock._err&&!sock._opened?"تعذر الاتصال":undefined)};
 sock.addEventListener("open",()=>sock._opened=true);
 sock.onmessage=m=>{ try{ onMsg(JSON.parse(m.data)) }catch(e){ console.error(e) } };
}
const b64e=o=>btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
const b64d=s=>JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g,"+").replace(/_/g,"/")))));
function loadRoom(){ const r=newRoom(); const d=ls("arsh.room"); if(d&&d.D&&d.C){ r.D=d.D; r.H=d.H||[]; r.C=d.C; r.logs=d.logs||[]; if(d.DN) r.DN=d.DN } return r }

/* ================= وضع الرابط (OBS / TikTok LIVE Studio) ================= */
function bootOverlay(q){
 document.body.className="ov";
 let L; try{L=b64d(q.get("d"))}catch(e){document.body.innerHTML="<p style='color:#fff'>رابط غير صالح</p>";return}
 // رابط حساب مستقل: يعرض حساباً واحداً بلا تخطيط
 if(q.get("acc")){ const w=newWidget("social",{id:"acc_"+q.get("acc"),mode:"single",accountId:q.get("acc"),design:q.get("ds")||"elite",x:0,y:0,w:1,h:1}); L={id:L.id,name:"acc",canvas:"acc",widgets:[w],socials:L.socials} }
 L.widgets.forEach(migrateWidget);
 const only=q.get("only"), room=q.get("room")||"", wsUrl=q.get("ws")||"", bigT=+q.get("big")||1000;
 const R=loadRoom(); let skew=0;
 const src=()=>({D:R.D,H:R.H,C:R.C,skew,SO:L.socials,DN:R.DN,DC:L.donCfg});
 const root=document.getElementById("root");
 const stage=document.createElement("div"); stage.className="stage"; root.appendChild(stage);
 const views=new Map(); let cv;
 function layout(){
  const base=L.canvas==="acc"?{w:900,h:130}:(CANVASES[L.canvas]||CANVASES.vertical); let list=L.widgets;
  if(only){ const w=L.widgets.find(x=>x.id===only); if(!w){stage.innerHTML="";return} cv={w:Math.round(w.w*base.w),h:Math.round(w.h*base.h)}; list=[{...w,x:0,y:0,w:1,h:1}] } else cv=base;
  stage.style.width=cv.w+"px"; stage.style.height=cv.h+"px";
  stage.style.transform=`scale(${Math.min(innerWidth/cv.w,innerHeight/cv.h)})`;
  const seen=new Set();
  for(const w of list){ seen.add(w.id); let v=views.get(w.id); if(v){v.cv=cv;v.apply(w)} else { v=new View(w,cv,{data:src,refW:base.w}); views.set(w.id,v); stage.appendChild(v.el); v.el.classList.add("w-in") } }
  for(const [id,v] of views) if(!seen.has(id)){v.el.remove();views.delete(id)}
 }
 function onMsg(m){
  if(m.t==="snapshot"){ R.D=m.D; R.H=m.H||[]; R.C=m.C; if(m.DN) R.DN=m.DN; skew=(m.now||Date.now())-Date.now() }
  else if(m.t==="event"){ if(m.ev.type==="gift"&&m.ev.big===undefined) m.ev.big=m.ev.value>=bigT; if(m.applied!==true){ applyEvent(R.D,R.H,m.ev); applyDonation(R.DN,m.ev) } }
  else if(m.t==="clock"){ R.C=m.C; if(m.now) skew=m.now-Date.now() }
  else if(m.t==="layout"){ if(m.layout&&L.canvas==="acc"){ L.socials=m.layout.socials||L.socials; L.donCfg=m.layout.donCfg||L.donCfg; deliver(views.values(),{t:"snapshot"},src()); return } if(m.layout&&m.layout.id===L.id){ L=m.layout; L.widgets.forEach(migrateWidget); layout(); deliver(views.values(),{t:"snapshot"},src()) } return }
  deliver(views.values(),m,src());
 }
 layout(); addEventListener("resize",layout);
 setInterval(()=>{ for(const v of views.values()) if(TYPES[v.w.type].tick) v.refresh(src()) },250);
 // إعادة اتصال تلقائية بعد أي انقطاع؛ الخادم يرسل لقطة كاملة فلا يتكرر الاحتساب
 if(wsUrl){ let n=0; const go=()=>connectWS(wsUrl,room,"",onMsg,ok=>{ if(ok) n=0; else setTimeout(go,Math.min(15000,1000*++n)) }); go() }
 else if(bus) bus.onmessage=({data:m})=>onMsg({...m,applied:false});
}

/* ================= لوحة التحكم ================= */
// عند التشغيل داخل المنصة (Next.js) يحقن الخادم B6O6_CONFIG: الحساب، الغرفة، مفتاح التعديل، الحفظ في قاعدة البيانات
const CFG=window.B6O6_CONFIG||null;
const st=CFG?{layouts:CFG.layouts,active:CFG.activeLayoutId,settings:CFG.settings,profile:CFG.profile}:(ls("arsh.app")||{});
const S={layouts:st.layouts||defaultLayouts(),active:st.active,settings:Object.assign({fx:true,bigGift:1000,wsUrl:"",room:"",key:"",tiktok:"",bg:"stream"},st.settings||{}),profile:Object.assign({name:"عبدالرحمن",plan:"تجريبي"},st.profile||{}),page:"home",sel:null,libTab:"boards",scope:"likes"};
S.layouts.forEach(l=>l.widgets.forEach(migrateWidget));
S.providers=CFG?(CFG.providers||{}):{};
S.donCfg=Object.assign(defaultDonCfg(),(CFG?CFG.donCfg:st.donCfg)||{}); S.donTab=S.donTab||"overview";
S.socials=(CFG?CFG.socials:st.socials)||defaultSocials(); S.socials.rotation=migrateRotation(S.socials.rotation); if(!S.socials.rotation.startedAt) S.socials.rotation.startedAt=Date.now(); S.socials.accounts=S.socials.accounts||[]; S.socTab=S.socTab||"accounts";
if(!S.layouts.find(l=>l.id===S.active)) S.active=S.layouts[0].id;
if(!S.settings.room) S.settings.room="room_"+uid();
if(CFG){ Object.assign(S.settings,{wsUrl:CFG.wsUrl,room:CFG.room,key:CFG.key}) }
let R=loadRoom(), skew=0, liveStatus={live:false,text:"وضع التجربة المحلي — غير متصل بـ TikTok"};
const SRC=()=>({D:R.D,H:R.H,C:R.C,skew,SO:S.socials,DN:R.DN,DC:S.donCfg});
const L=()=>S.layouts.find(l=>l.id===S.active);
const CV=()=>CANVASES[L().canvas]||CANVASES.vertical;
let saveT; function save(){clearTimeout(saveT);saveT=setTimeout(()=>{ if(CFG){ const {wsUrl,room,key,...rest}=S.settings; Promise.resolve(CFG.persist({layouts:S.layouts,activeLayoutId:S.active,settings:rest,name:S.profile.name,socials:S.socials,donCfg:S.donCfg})).then(()=>flash("تم الحفظ"),()=>toast("تعذر الحفظ — تحقق من الاتصال")) } else { ls("arsh.app",{layouts:S.layouts,active:S.active,settings:S.settings,profile:S.profile,socials:S.socials,donCfg:S.donCfg}); flash("تم الحفظ") } },400)}
function saveRoomNow(){ ls("arsh.room",{D:R.D,H:R.H,C:R.C,logs:R.logs,DN:R.DN}) }
let saveRT; function saveRoom(){clearTimeout(saveRT);saveRT=setTimeout(saveRoomNow,300)}
addEventListener("pagehide",()=>{ if(!CFG) ls("arsh.app",{layouts:S.layouts,active:S.active,settings:S.settings,profile:S.profile,socials:S.socials,donCfg:S.donCfg}); saveRoomNow()});
function toast(t){const e=document.getElementById("toast");e.textContent=t;e.classList.add("show");clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove("show"),1600)}
function flash(t){const e=document.getElementById("savedot");if(e){e.textContent="✓ "+t;e.style.opacity=1;clearTimeout(e._t);e._t=setTimeout(()=>e.style.opacity=.5,900)}}
function pushLayout(){ const l={...L(),socials:S.socials,donCfg:S.donCfg}; if(bus) bus.postMessage({t:"layout",layout:l}); if(wsReady) ws.send(JSON.stringify({t:"layout",room:S.settings.room,layout:l})) }

const views=new Map(), liveViews=new Set();
const allViews=()=>[...views.values(),...liveViews];
/** كل أمر يمر من هنا: للخادم إن كان متصلاً، وإلا يُنفَّذ محلياً بنفس محرك الخادم */
function send(msg){
 if(wsReady){ ws.send(JSON.stringify({...msg,room:S.settings.room})); return }
 const now=Date.now(); let res;
 if(msg.t==="sim") res=roomEvent(R,msg.ev,now);
 else if(msg.t==="clock-op") res=roomClockOp(R,msg,now);
 else if(msg.t==="fx") res={out:[{t:"fx",fx:msg.fx}],logs:[]};
 else return;
 for(const m of res.out){ receive(m,true); if(bus) bus.postMessage(m) }
 saveRoom();
}
function receive(m,applied){
 if(m.t==="snapshot"){ R.D=m.D; R.H=m.H||[]; R.C=m.C; R.logs=m.logs||[]; if(m.DN) R.DN=m.DN; skew=(m.now||Date.now())-Date.now(); saveRoom() }
 else if(m.t==="event"){ if(m.ev.type==="gift"&&m.ev.big===undefined) m.ev.big=m.ev.value>=S.settings.bigGift; if(!applied){ applyEvent(R.D,R.H,m.ev); applyDonation(R.DN,m.ev); saveRoom() } }
 else if(m.t==="clock"){ if(!applied){ R.C=m.C; if(m.now) skew=m.now-Date.now(); for(const l of [...(m.logs||[])].reverse()) R.logs.unshift(l); R.logs.length=Math.min(R.logs.length,300); saveRoom() } }
 else if(m.t==="fx"){ /* عرض فوري */ }
 else if(m.t==="status"){ if(m.text!==undefined||m.live!==undefined) liveStatus={live:!!m.live,text:m.text||liveStatus.text}; setConn(); if(m.text) toast(m.text); return }
 else if(m.t==="gifts"){ S.catalog=m.gifts; if(S.page==="subathon") renderPage(true); return }
 else return;
 deliver(allViews(),m,SRC());
 if(m.t==="event"&&["stats","likes","gifts","comments","home","boards","donations"].includes(S.page)) softRefresh();
 if((m.t==="clock"||m.t==="snapshot")&&["subathon","timers","stats","home"].includes(S.page)) softRefresh();
}
let srT; function softRefresh(){clearTimeout(srT);srT=setTimeout(()=>{ if(!document.activeElement||!document.activeElement.closest||!document.activeElement.closest("#pg input,#pg select,#pg textarea")) renderPage(true) },250)}
// ساعة محلية في وضع التجربة (في الوضع الحقيقي الخادم هو المرجع)
setInterval(()=>{ if(wsReady||location.hash.startsWith("#/overlay")) return; const r=roomTick(R,Date.now()); for(const m of r.out){ receive(m,true); if(bus) bus.postMessage(m) } if(r.out.length) saveRoom() },1000);
setInterval(()=>{ for(const v of allViews()) if(TYPES[v.w.type]?.tick) v.refresh(SRC()); document.querySelectorAll("[data-live-clock]").forEach(e=>e.textContent=liveClockText(e.dataset.liveClock)) },250);
function liveClockText(id){ const now=Date.now()+skew; if(id==="subathon") return fmtClock(remaining(R.C.subathon,now)); const t=R.C.timers.find(x=>x.id===id); return t?fmtClock(timerValue(t,now),t.dir==="up"||t.durationMs>=HOUR):"--" }

const rnd=a=>a[Math.floor(Math.random()*a.length)];
function simUser(fresh){ if(!fresh){ const pool=[...new Set([...Object.keys(R.D.likes),...Object.keys(R.D.gifts),...Object.keys(R.D.comments)])]; if(pool.length>2&&Math.random()<.6){ const k=rnd(pool); const r=R.D.likes[k]||R.D.gifts[k]||R.D.comments[k]; return {id:k,name:r.name,avatar:r.av} } }
 let n=rnd(NAMES)+(Math.random()<.5?"_"+Math.floor(Math.random()*99):""); return {id:"u_"+n,name:n,avatar:avatar(n)} }
const sim=ev=>send({t:"sim",ev:{id:"sim_"+uid()+Date.now(),...ev}});
const gift=(g,user,mult=1)=>sim({type:"gift",user,gift:g[0],giftId:g[2],diamonds:g[1],value:g[1]*mult,count:mult});
const clockOp=(target,op,extra={})=>send({t:"clock-op",target,op,...extra});
const SIM={
 like100:()=>sim({type:"like",user:simUser(),count:100}),
 like1000:()=>sim({type:"like",user:simUser(),count:1000}),
 gift:()=>gift(rnd(GIFTS.slice(0,6)),simUser()),
 biggift:()=>gift(GIFTS[6],simUser()),
 supporter:()=>{const g=rnd(GIFTS.slice(1,5));gift(g,simUser(true),Math.ceil(Math.random()*5))},
 comment:()=>sim({type:"comment",user:simUser(),text:rnd(["هلا والله 🔥","كفو!","أبدعت","مين جاي من تيك توك؟","❤️❤️","يا هلا بالجميع"])}),
 follow:()=>sim({type:"follow",user:simUser(true)}),
 sub:()=>sim({type:"subscribe",user:simUser()}),
 saAdd:()=>clockOp("subathon","add",{ms:5*MIN,source:"manual",reason:"تجربة: +5 دقائق"}),
 saSub:()=>clockOp("subathon","add",{ms:-MIN,source:"manual",reason:"تجربة: خصم دقيقة"}),
 timer:()=>{ const t=R.C.timers.find(x=>x.id!=="stream")||R.C.timers[0]; clockOp(t.id,t.status==="running"?"pause":t.status==="paused"?"resume":"start") },
 shuffle:s=>sim({type:"shuffle",scope:s}),
 reset:s=>sim({type:"reset",scope:s}),
};
function testBar(){return `<div class="testbar" id="testbar"><b style="color:var(--gold)">🧪 وضع التجربة</b>
 <button class="btn sm" data-sim="like100">❤️ +100 إعجاب</button><button class="btn sm" data-sim="like1000">❤️ +1000 إعجاب</button>
 <button class="btn sm" data-sim="gift">🎁 هدية تجريبية</button><button class="btn sm" data-sim="biggift">🦁 هدية كبيرة</button><button class="btn sm" data-sim="supporter">➕ داعم جديد</button><button class="btn sm" data-sim="comment">💬 تعليق</button><button class="btn sm" data-sim="follow">👤 متابع</button>
 <button class="btn sm" data-soc-try="tiktok">🌐 ظهور TikTok</button><button class="btn sm" data-soc-try="instagram">🌐 Instagram</button><button class="btn sm" data-soc-try="roblox">🎮 Roblox</button><button class="btn sm" data-soc-try="cod">🎮 Call of Duty</button><button class="btn sm" data-rot-try>🔄 تجربة التناوب</button>
 <button class="btn sm" data-don-sim="5">💰 تبرع 5</button><button class="btn sm" data-don-sim="50">💰 50</button><button class="btn sm" data-don-sim="500">💰 500</button>
 <button class="btn sm" data-sim="saAdd">⏳ +5د للسبثون</button><button class="btn sm" data-sim="saSub">⏳ −1د</button><button class="btn sm" data-sim="timer">⏱️ تشغيل/إيقاف مؤقت</button>
 <select class="inp" id="simScope" style="width:auto">${[["likes","التكبيس"],["gifts","الدعم"],["comments","التعليقات"],["interact","المتفاعلين"],["follows","المتابعين"],["all","الكل (للإعادة)"]].map(o=>`<option value="${o[0]}" ${S.scope===o[0]?"selected":""}>${o[1]}</option>`).join("")}</select>
 <button class="btn sm" data-sim="shuffle">🔀 تغيير الترتيب</button><button class="btn sm dng" data-sim="reset">↺ إعادة ضبط</button></div>`}

/* ---- الروابط ---- */
function baseURL(){return location.href.split("#")[0]}
function overlayURL(l,only,acc){ if(CFG) return CFG.overlayURL(l.id,only,acc); const p=new URLSearchParams(); p.set("d",b64e({...l,socials:S.socials,donCfg:S.donCfg})); if(acc) p.set("acc",acc); if(only)p.set("only",only); p.set("big",S.settings.bigGift); if(S.settings.wsUrl){p.set("ws",S.settings.wsUrl);p.set("room",S.settings.room)} return baseURL()+"#/overlay?"+p.toString() }
function copy(t){ (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast("تم النسخ")).catch(()=>{const a=document.createElement("textarea");a.value=t;document.body.appendChild(a);a.select();try{document.execCommand("copy");toast("تم النسخ")}catch(e){toast("انسخ يدوياً")}a.remove()}) }

/* ---- الهيكل ---- */
const PAGES=[["home","الرئيسية","🏠"],["live","الاتصال بالبث المباشر","📡"],["boards","قوائم الترتيب","🏆"],["likes","التكبيس والإعجابات","❤️"],["gifts","الدعم والهدايا","🎁"],["comments","التعليقات والتفاعلات","💬"],["library","مكتبة التصاميم","🎨"],["subathon","نظام السبثون","⏳"],["timers","مؤقتات البث","⏱️"],["donations","الدونيشن والتبرعات","💰"],["socials","حساباتي","🌐"],["stats","الإحصائيات والتقارير","📊"],["studio","استوديو البث","🎬"],["obs","روابط OBS","🔗"],["settings","الإعدادات","⚙️"],["account","حسابي","👤"]];
const ROADMAP=[["المرحلة 3","قوانين البث + مكتبة تصاميمها"],["المرحلة 4","التنبيهات، الأهداف الموسعة، التعليقات المباشرة، القارئ الصوتي"],["المرحلة 5","بوت الشات، التصويت، مشغل الموسيقى، التقارير"],["المرحلة 6","بطاقات الشكر، تيليجرام، الباقات، لوحة الإدارة"],["المرحلة 7","استكمال 50 تصميماً للقوائم وتحسين الأداء"]];
function shell(){
 document.getElementById("root").innerHTML=`<div class="mobnav" id="mobnav">${PAGES.map(p=>`<button data-go="${p[0]}">${p[2]} ${p[1]}</button>`).join("")}</div>
 <div class="app"><aside class="side"><div class="brand"><div class="lg"><img src="${LOGO}" alt="B6O6"></div><div><b>B6O6 Streaming</b><small>منصة صنّاع المحتوى</small></div></div>
 <nav class="nav" id="nav">${PAGES.map(p=>`<button data-go="${p[0]}"><span class="ic">${p[2]}</span>${p[1]}</button>`).join("")}</nav>
 <div style="margin-top:18px" class="pill"><span class="dot" id="cdot"></span><span id="ctext">—</span></div></aside>
 <main class="main" id="pg"></main></div>`;
 const root=document.getElementById("root");
 root.addEventListener("click",onClick); root.addEventListener("input",onInput); root.addEventListener("change",onInput);
}
function go(p){ S.page=p; renderPage(); scrollTo(0,0) }
function head(t,sub,extra=""){return `<div class="top"><div><h1>${t}</h1>${sub?`<p>${sub}</p>`:""}</div><div class="row">${extra}<span class="pill" id="savedot" style="opacity:.5">✓ محفوظ تلقائياً</span></div></div>`}
function layoutPicker(){return `<select class="inp" data-act="pickLayout" style="width:auto">${S.layouts.map(l=>`<option value="${l.id}" ${l.id===S.active?"selected":""}>${esc(l.name)}</option>`).join("")}</select>`}
function userTable(rows,cols){ if(!rows.length) return '<div class="empty">لا توجد بيانات بعد — جرّب أزرار وضع التجربة</div>';
 return `<table><thead><tr><th>#</th><th>المستخدم</th>${cols.map(c=>`<th>${c[0]}</th>`).join("")}</tr></thead><tbody>${rows.map((r,i)=>`<tr><td>${i+1}</td><td><img class="tav" src="${r.av||avatar(r.name)}">${esc(r.name)}</td>${cols.map(c=>`<td>${c[1](r)}</td>`).join("")}</tr>`).join("")}</tbody></table>` }
const sorted=(o,f="v")=>Object.values(o||{}).sort((a,b)=>b[f]-a[f]);
const dname=(id,clock)=>((clock===true?CLOCK_DESIGNS:clock==="soc"?SOCIAL_DESIGNS:DESIGNS).find(d=>d.id===id)||{}).name||id;
const wdname=w=>dname(w.design,dKind(w)==="clock"?true:dKind(w)==="soc"?"soc":false);
const isClock=w=>!!TYPES[w.type].clock;
const isSoc=w=>!!TYPES[w.type].soc;
const isChip=w=>["donTicker","donLatest","donAlert"].includes(w.type);
const dKind=w=>isClock(w)||w.type==="donGoal"?"clock":isSoc(w)||isChip(w)?"soc":"board";
const libPool=(w,tab)=>tab==="clocks"?dKind(w)==="clock":tab==="socials"?dKind(w)==="soc":dKind(w)==="board"&&TYPES[w.type].board;
const designsOf=w=>({clock:CLOCK_DESIGNS,soc:SOCIAL_DESIGNS,board:DESIGNS})[dKind(w)];
function stat(k,v,g,extra=""){return `<div class="card stat"><div class="k">${k}</div><div class="v ${g?"gold":""}" ${extra}>${v}</div></div>`}
function miniTop(t,rows){return `<div><div class="mut small" style="margin-bottom:6px">${t}</div>${rows.map((r,i)=>`<div style="display:flex;align-items:center;gap:8px;padding:5px 0"><b style="color:var(--gold);width:14px">${i+1}</b><img class="tav" style="margin:0" src="${r.av||avatar(r.name)}"><span style="flex:1">${esc(r.name)}</span><b>${fmt(r.v)}</b></div>`).join("")||'<div class="mut small">—</div>'}</div>`}
const SA_STATUS={idle:"لم يبدأ",running:"يعمل",paused:"متوقف مؤقتاً",ended:"انتهى"};
const TM_STATUS={idle:"جاهز",running:"يعمل",paused:"متوقف",ended:"انتهى"};
const dt=t=>t?new Date(t).toLocaleString("ar-SA-u-nu-latn",{hour:"numeric",minute:"2-digit",day:"numeric",month:"short"}):"—";
const msToMin=ms=>Math.round(ms/60000);

function renderPage(soft){
 document.querySelectorAll("[data-go]").forEach(b=>b.classList.toggle("on",b.dataset.go===S.page));
 const pg=document.getElementById("pg"); const p=S.page; const D=R.D;
 views.clear(); liveViews.clear();
 let h=""; const l=L();
 if(p==="home"){
  const s=R.C.subathon;
  h=head(`أهلاً ${esc(S.profile.name)} 👋`,"قوائم الترتيب والسبثون والمؤقتات على شاشة بثك")+
  `<div class="grid g4">${stat("إجمالي الإعجابات",fmt(D.tot.likes),1)}${stat("نقاط الدعم",fmt(D.tot.gifts),1)}${stat("السبثون — المتبقي",fmtClock(remaining(s,Date.now()+skew)),1,'data-live-clock="subathon"')}${stat("متابعون جدد",fmt(D.tot.follows||0))}</div>
  <div class="grid g2" style="margin-top:14px"><div class="card"><h3>ابدأ بسرعة</h3><div class="grid" style="gap:10px">
   <button class="btn pri" data-go="studio">🎬 رتّب عناصر شاشتك</button><button class="btn" data-go="subathon">⏳ جهّز السبثون</button><button class="btn" data-go="obs">🔗 انسخ روابط OBS</button></div>
   <p class="mut small" style="margin-top:12px">التخطيط النشط: <b style="color:var(--tx)">${esc(l.name)}</b> — ${l.widgets.length} عناصر على ${CV().label}</p></div>
  <div class="card"><h3>المتصدرون الآن</h3><div class="grid g2">${miniTop("❤️ التكبيس",sorted(D.likes).slice(0,3))}${miniTop("🎁 الدعم",sorted(D.gifts).slice(0,3))}</div></div></div>
  <div class="card" style="margin-top:14px"><h3>خطة المنصة</h3><div class="mut small" style="line-height:2">✅ المرحلة 1: لوحة التحكم، الاستوديو، قوائم الترتيب<br>✅ المرحلة 2: السبثون الكامل + مؤقتات البث<br>✅ حساباتي وحسابات الألعاب: تصاميم، دخوليات، تدوير، روابط<br>✅ الدونيشن والتبرعات: لوحة، شريط، أهداف، آخر/أكبر داعم، تنبيهات، ربط Streamlabs وStreamElements وميسّر<br>⏳ التالي: الإجراءات الذكية، ثم السبثون التفاعلي<br>${ROADMAP.map(r=>`⏳ ${r[0]}: ${r[1]}`).join("<br>")}</div></div>`+testBar();
 }
 else if(p==="live"){
  const s=S.settings;
  h=head("الاتصال بالبث المباشر","اربط حسابك في TikTok عبر خادم المنصة")+
  `<div class="grid g2"><div class="card"><h3>حالة الاتصال</h3><div class="row" style="margin-bottom:12px"><span class="pill"><span class="dot ${wsReady?"ok":""}"></span>${wsReady?"متصل بخادم المنصة":"غير متصل بالخادم"}</span><span class="pill"><span class="dot ${liveStatus.live?"ok":""}"></span>${esc(liveStatus.text)}</span></div>
  <div class="fld"><label>اسم المستخدم في TikTok (بدون @)</label><input class="inp" data-set="tiktok" value="${esc(s.tiktok)}" placeholder="username"></div>
  ${CFG?"":`<div class="fld"><label>عنوان خادم المنصة (WebSocket)</label><input class="inp" dir="ltr" data-set="wsUrl" value="${esc(s.wsUrl)}" placeholder="wss://your-domain/ws"></div>
  <div class="grid g2" style="gap:8px"><div class="fld"><label>معرّف الغرفة</label><input class="inp" dir="ltr" data-set="room" value="${esc(s.room)}"></div><div class="fld"><label>مفتاح التعديل</label><input class="inp" dir="ltr" type="password" data-set="key" value="${esc(s.key)}"></div></div>`}
  <div class="row">${CFG?(wsReady?"":`<button class="btn sm" data-connect>إعادة الاتصال بالخادم</button>`):`<button class="btn pri sm" data-connect>اتصال بالخادم</button>`}<button class="btn ${CFG?"pri ":""}sm" data-tiktok>بدء ربط TikTok</button><button class="btn sm" data-tiktok-stop>إيقاف الربط</button>${CFG?"":`<button class="btn sm" data-disconnect>قطع</button>`}</div></div>
  <div class="card"><h3>ماذا يعمل فعلياً؟</h3><div class="note" style="line-height:2">• بدون خادم: هذه الصفحة تعمل في <b>وضع التجربة المحلي</b> فقط، ولا يوجد اتصال حقيقي بـ TikTok.<br>• مع الخادم: يقرأ أحداث البث العامة (هدايا، إعجابات، تعليقات، متابعات، اشتراكات) عبر مكتبة tiktok-live-connector، وهي <b>غير رسمية</b> وقد تتوقف إذا غيّر TikTok نظامه.<br>• لا نطلب كلمة مرور حسابك. يجب أن تكون في بث مباشر.<br>• الاشتراكات تصل فقط للحسابات المفعّل لها الاشتراك في TikTok.</div></div></div>`;
 }
 else if(p==="boards"){
  h=head("قوائم الترتيب","كل قائمة عنصر مستقل بمعرّف وإعدادات وتصميم وموقع",layoutPicker())+
  `<div class="row" style="margin-bottom:14px">${Object.entries(TYPES).filter(([,t])=>t.board).map(([k,t])=>`<button class="btn sm" data-add="${k}">+ ${t.icon} ${t.label}</button>`).join("")}<button class="btn sm" data-add="gifts" data-top1>+ 👑 أكبر داعم</button></div>
  <div class="grid g3">${l.widgets.map(w=>`<div class="card"><h3><span>${TYPES[w.type].icon} ${esc(w.name)}</span><span class="tag">${w.id}</span></h3>
   <div class="mut small" style="line-height:2">التصميم: <b style="color:var(--tx)">${wdname(w)}</b><br>الموقع: ${POS.find(x=>x[0]===w.pos)?.[1]||"مخصص"} · ${Math.round(w.w*100)}%×${Math.round(w.h*100)}%<br>${TYPES[w.type].board?`المراكز: ${w.topN}`:""} ${w.visible?"· ظاهر":"· مخفي"} ${w.locked?"· مقفل 🔒":""}</div>
   <div class="row" style="margin-top:10px"><button class="btn sm pri" data-edit="${w.id}">تعديل في الاستوديو</button><button class="btn sm" data-lib="${w.id}">تغيير التصميم</button><button class="btn sm" data-copylink="${w.id}">🔗 رابط مستقل</button></div></div>`).join("")||'<div class="empty">لا توجد عناصر</div>'}</div>`;
 }
 else if(p==="library"){
  const tab=S.libTab;
  const pool=l.widgets.filter(w=>libPool(w,tab));
  const tgt=pool.find(w=>w.id===S.libTarget)||pool[0];
  const list=tab==="clocks"?CLOCK_DESIGNS:tab==="socials"?SOCIAL_DESIGNS:DESIGNS;
  h=head("مكتبة التصاميم","معاينة حيّة — التصميم يُطبَّق على العنصر المختار فقط",layoutPicker())+
  `<div class="row" style="margin-bottom:12px"><button class="btn sm ${tab==="boards"?"on":""}" data-libtab="boards">🏆 قوائم الترتيب (${DESIGNS.length})</button><button class="btn sm ${tab==="clocks"?"on":""}" data-libtab="clocks">⏳ السبثون والمؤقتات (${CLOCK_DESIGNS.length})</button><button class="btn sm ${tab==="socials"?"on":""}" data-libtab="socials">🌐 الحسابات (${SOCIAL_DESIGNS.length})</button></div>
  <div class="card" style="margin-bottom:14px"><div class="row"><span class="mut">تطبيق على:</span>${pool.length?`<select class="inp" data-act="libTarget" style="width:auto">${pool.map(w=>`<option value="${w.id}" ${tgt&&w.id===tgt.id?"selected":""}>${TYPES[w.type].icon} ${esc(w.name)} — ${wdname(w)}</option>`).join("")}</select>`:`<span class="mut small">لا يوجد عنصر من هذا النوع في التخطيط</span> <button class="btn sm" data-add="${tab==="clocks"?"subathon":tab==="socials"?"social":"gifts"}">+ إضافة</button>`}</div></div>
  <div class="lib" id="lib">${list.map(d=>`<div class="libc ${tgt&&tgt.design===d.id?"on":""}" data-pick="${d.id}"><div class="pv" data-pv="${d.id}"></div><div class="meta"><b>${d.name}</b><span class="tag">${({list:"قائمة",grid:"شبكة",pod:"تتويج",row:"أفقي",digital:"رقمي",ring:"دائري",bar:"شريط",mini:"صغير",vertical:"عمودي",pill:"كبسولة",box:"إطار",hud:"HUD",facet:"ألماسي",bare:"بدون خلفية",ribbon:"شريطة",card:"بطاقة",spot:"إضاءة",gcard:"ألعاب"})[d.shape]||d.shape}</span></div></div>`).join("")}</div>
  ${tab==="boards"?`<div class="ttl">المرحلة 7: الوصول إلى 50 تصميماً للقوائم</div><div class="row">${NEXT_DESIGNS.map(n=>`<span class="tag">${n}</span>`).join("")}</div>`:""}`;
 }
 else if(p==="likes"||p==="gifts"||p==="comments"){
  const types=p==="likes"?["likes"]:p==="gifts"?["gifts","recentGifts"]:["comments","interact","recentFollows"];
  const ws_=l.widgets.filter(w=>types.includes(w.type));
  const rows=p==="likes"?sorted(D.likes):p==="gifts"?sorted(D.gifts):sorted(D.comments);
  const cols=p==="likes"?[["الإعجابات",r=>fmt(r.v)]]:p==="gifts"?[["النقاط",r=>fmt(r.v)],["الهدايا",r=>fmt(r.c)]]:[["التعليقات",r=>fmt(r.v)]];
  h=head(PAGES.find(x=>x[0]===p)[1],p==="likes"?"تستقبل أحداث الإعجاب فقط — لا تختلط بنقاط الهدايا":p==="gifts"?"تستقبل الهدايا فقط — النقاط = قيمة الهدية بالألماس × العدد":"التعليقات، أكثر المتفاعلين، وآخر المتابعين",layoutPicker())+
  `<div class="grid g2"><div class="card"><h3>القوائم في هذا التخطيط <span class="row">${types.map(t=>`<button class="btn sm" data-add="${t}">+ ${TYPES[t].label}</button>`).join("")}</span></h3>${ws_.map(w=>widgetQuick(w)).join("")||'<div class="empty">لا توجد قائمة — أضف واحدة</div>'}
  ${p==="gifts"?`<div class="note" style="margin-top:10px">📌 <b>الفترات المتاحة فعلياً:</b> TikTok لا يعطي سجل دعم سابق. «البث الحالي» من أحداث هذا البث، و«اليوم/الأسبوع/الشهر» من الهدايا التي سجلتها المنصة أثناء اتصالها ببثوثك فقط.</div>`:""}
  ${p==="likes"?`<div class="note" style="margin-top:10px">📌 TikTok يرسل الإعجابات على دفعات، وفي البثوث الكبيرة قد لا تصل كل الدفعات.</div>`:""}
  ${p==="comments"?`<div class="note" style="margin-top:10px">📌 «أكثر المتفاعلين»: نقطة لكل تعليق، ونقطة لكل دفعة إعجاب، ونقطة لكل هدية.</div>`:""}</div>
  <div class="card"><h3>الترتيب المباشر <span class="tag">${rows.length} مستخدم</span></h3>${userTable(rows.slice(0,15),cols)}
  ${p==="gifts"?`<div class="ttl">آخر الداعمين</div>${userTable((D.recentGifts||[]).slice(0,8),[["القيمة",r=>fmt(r.v)]])}`:""}
  ${p==="comments"?`<div class="ttl">آخر التعليقات</div><div class="feed">${D.feed.slice(0,20).map(f=>`<div><b>${esc(f.name)}:</b> ${esc(f.text)}</div>`).join("")||'<div class="mut">لا توجد تعليقات</div>'}</div><div class="ttl">آخر المتابعين</div>${userTable((D.recentFollows||[]).slice(0,8),[["الوقت",r=>dt(r.t)]])}`:""}</div></div>`+testBar();
 }
 else if(p==="subathon"){ h=subathonHTML() }
 else if(p==="socials"){ h=socialsHTML() }
 else if(p==="donations"){ h=donationsHTML() }
 else if(p==="timers"){ h=timersHTML() }
 else if(p==="stats"){
  const mins=[...Array(12)].map((_,i)=>{const end=Date.now()-(11-i)*60000;return R.H.filter(e=>e.t>end-60000&&e.t<=end).reduce((s,e)=>s+e.v,0)}); const mx=Math.max(1,...mins);
  const s=R.C.subathon, added=R.logs.filter(x=>x.deltaMs>0).reduce((a,x)=>a+x.deltaMs,0), removed=R.logs.filter(x=>x.deltaMs<0).reduce((a,x)=>a+x.deltaMs,0);
  const st_=R.C.timers.find(t=>t.id==="stream");
  h=head("الإحصائيات والتقارير","محسوبة من الأحداث التي استقبلتها المنصة فعلياً")+
  `<div class="grid g4">${stat("إجمالي الإعجابات",fmt(D.tot.likes),1)}${stat("نقاط الدعم",fmt(D.tot.gifts),1)}${stat("التعليقات",fmt(D.tot.comments))}${stat("متابعون جدد",fmt(D.tot.follows||0))}</div>
  <div class="grid g4" style="margin-top:14px">${stat("مدة البث",st_?fmtClock(timerValue(st_,Date.now()+skew)):"—",0,'data-live-clock="stream"')}${stat("الوقت المضاف للسبثون",fmtDelta(s.totalAddedMs).replace("+",""),1)}${stat("عدد الهدايا",fmt(D.tot.giftCount))}${stat("الداعمون",fmt(Object.keys(D.gifts).length))}</div>
  <div class="grid g2" style="margin-top:14px"><div class="card"><h3>الدعم في آخر 12 دقيقة</h3><div class="bars">${mins.map(v=>`<i style="height:${v/mx*100}%" title="${fmt(v)}"></i>`).join("")}</div></div>
  <div class="card"><h3>ملخص السبثون</h3><table><tr><td>الحالة</td><td>${SA_STATUS[s.status]}</td></tr><tr><td>مجموع المضاف (السجل)</td><td>${fmtDelta(added)}</td></tr><tr><td>مجموع المخصوم</td><td>${removed?fmtDelta(removed):"—"}</td></tr><tr><td>عمليات في السجل</td><td>${R.logs.length}</td></tr></table></div></div>
  <div class="grid g2" style="margin-top:14px"><div class="card"><h3>أفضل المكبسين</h3>${userTable(sorted(D.likes).slice(0,10),[["الإعجابات",r=>fmt(r.v)]])}</div><div class="card"><h3>أفضل الداعمين</h3>${userTable(sorted(D.gifts).slice(0,10),[["النقاط",r=>fmt(r.v)],["الهدايا",r=>fmt(r.c)]])}</div></div>
  <div class="note" style="margin-top:14px">التقارير اليومية والأسبوعية والشهرية المفصّلة ضمن المرحلة 5.</div>`;
 }
 else if(p==="studio"){ h=studioHTML() }
 else if(p==="obs"){
  h=head("روابط OBS","Browser Source بخلفية شفافة",layoutPicker())+
  `<div class="card"><h3>🔗 الرابط الشامل — «${esc(l.name)}»</h3><p class="mut small">كل العناصر بنفس المواقع والأحجام. مقاس المصدر: <b style="color:var(--tx)">${dimTxt(CV().w,CV().h)}</b></p>
  <div class="code">${esc(overlayURL(l))}</div><div class="row" style="margin-top:10px"><button class="btn pri sm" data-copyall>نسخ الرابط الشامل</button><button class="btn sm" data-preview="">👁 معاينة هنا</button><a class="btn sm" target="_blank" href="${esc(overlayURL(l))}">فتح في تبويب ↗</a></div></div>
  <div class="ttl">روابط مستقلة لكل عنصر</div><div class="grid g2">${l.widgets.map(w=>`<div class="card"><h3><span>${TYPES[w.type].icon} ${esc(w.name)}</span><span class="tag">${dimTxt(Math.round(w.w*CV().w),Math.round(w.h*CV().h))}</span></h3><div class="code">${esc(overlayURL(l,w.id))}</div><div class="row" style="margin-top:8px"><button class="btn sm" data-copylink="${w.id}">نسخ</button><button class="btn sm" data-preview="${w.id}">👁 معاينة هنا</button><a class="btn sm" target="_blank" href="${esc(overlayURL(l,w.id))}">تبويب ↗</a></div></div>`).join("")}</div>
  <div class="card" style="margin-top:14px"><h3>طريقة الإضافة</h3><div class="mut" style="line-height:2"><b style="color:var(--tx)">OBS:</b> Sources ← + ← Browser ← الصق الرابط ← اكتب العرض والارتفاع الظاهرين. لتشغيل صوت السبثون فعّل «Control audio via OBS».<br><b style="color:var(--tx)">TikTok LIVE Studio:</b> أضف مصدر رابط/متصفح إن كان متاحاً في نسختك، أو استخدم OBS Virtual Camera.</div>
  <div class="note" style="margin-top:10px">⚠️ في وضع التجربة: البيانات تصل لنوافذ المعاينة في نفس المتصفح فقط. لكي تعمل الروابط داخل OBS أثناء البث شغّل خادم المنصة واتصل به من «الاتصال بالبث المباشر»، ثم انسخ الروابط من جديد.</div></div>`;
 }
 else if(p==="settings"){
  const s=S.settings;
  h=head("الإعدادات")+`<div class="grid g2"><div class="card"><h3>عام</h3>
  <div class="fld"><label>المؤثرات الحركية لكل العناصر</label><select class="inp" data-set="fx"><option value="1" ${s.fx?"selected":""}>مفعّلة</option><option value="0" ${!s.fx?"selected":""}>متوقفة</option></select></div>
  <div class="fld"><label>حد «الهدية الكبيرة» (نقاط)</label><input class="inp" type="number" data-set="bigGift" value="${s.bigGift}"></div>
  <div class="fld"><label>خلفية المحرر</label><select class="inp" data-set="bg"><option value="stream" ${s.bg==="stream"?"selected":""}>محاكاة بث</option><option value="chk" ${s.bg==="chk"?"selected":""}>شفافية (مربعات)</option></select></div></div>
  <div class="card"><h3>البيانات</h3><div class="row"><button class="btn sm" data-export>⧉ نسخ الإعدادات</button>${CFG?"":`<button class="btn sm dng" data-wipe>حذف كل البيانات المحلية</button>`}</div><p class="mut small">في النسخة المنشورة على الخادم تُحفظ كل الإعدادات والتخطيطات وسجل السبثون في قاعدة البيانات.</p></div></div>`;
 }
 else if(p==="account"){
  h=head("حسابي")+`<div class="grid g2"><div class="card"><div class="row" style="margin-bottom:14px"><img src="${avatar(S.profile.name)}" style="width:64px;height:64px;border-radius:50%"><div><b style="font-size:18px">${esc(S.profile.name)}</b><div class="mut small">الخطة: ${esc(S.profile.plan)}</div></div></div>
  <div class="fld"><label>الاسم</label><input class="inp" data-prof="name" value="${esc(S.profile.name)}"></div>${CFG?`<p class="mut small">${esc(CFG.email||"")}</p><button class="btn sm dng" data-logout>تسجيل الخروج</button>`:""}</div>
  <div class="card"><h3>ملخص</h3><table><tr><td>التخطيطات (المشاهد)</td><td>${S.layouts.length}</td></tr><tr><td>العناصر</td><td>${S.layouts.reduce((s,l)=>s+l.widgets.length,0)}</td></tr><tr><td>المؤقتات</td><td>${R.C.timers.length}</td></tr></table></div></div>`;
 }
 pg.innerHTML=h;
 if(p==="studio") mountStudio();
 if(p==="library") mountLibrary();
 if(p==="socials") mountSocials();
 if(p==="donations") mountDonations();
 if(p==="subathon") mountClockPreview("sa-pv",l.widgets.find(w=>w.type==="subathon")||newWidget("subathon"));
 setConn();
}
function widgetQuick(w){ const t=TYPES[w.type];
 return `<div style="border:1px solid var(--line);border-radius:12px;padding:10px;margin-bottom:10px"><div class="row" style="justify-content:space-between"><b>${TYPES[w.type].icon} ${esc(w.name)}</b><span class="tag">${wdname(w)}</span></div>
 <div class="grid g2" style="margin-top:8px;gap:8px">${t.board?`<div class="fld" style="margin:0"><label>عدد المراكز</label><select class="inp" data-wf="topN" data-wid="${w.id}">${TOPNS.map(n=>`<option value="${n}" ${w.topN==n?"selected":""}>${n===1?"الأول فقط":"أفضل "+n}</option>`).join("")}</select></div>`:""}
 ${w.type==="gifts"?`<div class="fld" style="margin:0"><label>الترتيب حسب</label><select class="inp" data-wf="sortBy" data-wid="${w.id}">${SORTS.map(s=>`<option value="${s[0]}" ${w.sortBy===s[0]?"selected":""}>${s[1]}</option>`).join("")}</select></div>`:""}
 <div class="fld" style="margin:0"><label>التصميم</label><select class="inp" data-wf="design" data-wid="${w.id}">${designsOf(w).map(d=>`<option value="${d.id}" ${w.design===d.id?"selected":""}>${d.name}</option>`).join("")}</select></div></div>
 <div class="row" style="margin-top:8px"><button class="btn sm" data-edit="${w.id}">فتح في الاستوديو</button><button class="btn sm" data-copylink="${w.id}">🔗 رابط مستقل</button></div></div>`}

/* ---- السبثون ---- */
function subathonHTML(){
 const s=R.C.subathon, now=Date.now()+skew, r=s.rules, l=L();
 const sw=l.widgets.filter(w=>w.type==="subathon");
 const chk=(path,on)=>`<label class="row small" style="gap:6px;cursor:pointer"><input type="checkbox" data-sa="${path}" ${on?"checked":""}> مفعّل</label>`;
 const num=(path,val,lab,step=1,attrs="")=>`<div class="fld" style="margin:0"><label>${lab}</label><input class="inp" type="number" step="${step}" data-sa="${path}" value="${val}" ${attrs}></div>`;
 return head("نظام السبثون","وقت البث يزيد تلقائياً حسب تفاعل الجمهور — الوقت محسوب ومحفوظ على الخادم")+
 `<div class="grid g2"><div class="card"><h3><span>⏳ ${esc(s.name)}</span><span class="tag">${SA_STATUS[s.status]}${s.autoPaused?" (انقطاع البث)":""}</span></h3>
  <div class="pv" id="sa-pv" style="height:150px;position:relative;border-radius:12px;overflow:hidden;background:radial-gradient(ellipse at 50% 30%,#2a2238,#0b0a10)"></div>
  <div class="grid g3" style="margin-top:12px;gap:8px">${stat("المتبقي",fmtClock(remaining(s,now)),1,'data-live-clock="subathon"')}${stat("الوقت المضاف",fmtDelta(s.totalAddedMs).replace("+",""))}${stat("النهاية المتوقعة",s.status==="running"?dt(s.endsAt):"—")}</div>
  <div class="row" style="margin-top:12px">
   <button class="btn pri sm" data-sa-op="start">▶ بدء السبثون</button><button class="btn sm" data-sa-op="pause">⏸ إيقاف مؤقت</button><button class="btn sm" data-sa-op="resume">⏯ استكمال</button>
   <button class="btn sm" data-sa-add="60000">+1 دقيقة</button><button class="btn sm" data-sa-add="300000">+5 دقائق</button><button class="btn sm" data-sa-add="600000">+10 دقائق</button><button class="btn sm" data-sa-add="-60000">−1 دقيقة</button>
   <button class="btn sm dng" data-sa-op="reset">↺ إعادة ضبط</button><button class="btn sm dng" data-sa-op="end">⏹ إنهاء</button></div>
  <div class="row" style="margin-top:8px"><input class="inp" id="saCustom" type="number" min="1" value="15" style="width:90px"><span class="mut small">دقيقة</span><button class="btn sm" data-sa-custom="1">إضافة</button><button class="btn sm" data-sa-custom="-1">خصم</button></div>
  ${s.startedAt?`<p class="mut small">بدأ: ${dt(s.startedAt)}</p>`:""}
 </div>
 <div class="card"><h3>إعداد السبثون</h3>
  <div class="grid g2" style="gap:8px"><div class="fld" style="margin:0"><label>اسم السبثون</label><input class="inp" data-sa="name" value="${esc(s.name)}"></div><div class="fld" style="margin:0"><label>الوصف</label><input class="inp" data-sa="desc" value="${esc(s.desc)}"></div>
  ${num("initialMin",msToMin(s.initialMs),"مدة البداية (دقيقة)",1,'min="1"')}${num("minMin",msToMin(s.minMs),"الحد الأدنى عند الخصم (دقيقة)")}
  ${num("maxMin",msToMin(s.maxMs),"الحد الأقصى للوقت المتبقي (دقيقة، 0 = بلا حد)")}${num("maxTotalMin",msToMin(s.maxTotalMs),"حد مجموع الإضافات (دقيقة، 0 = بلا حد)")}
  <div class="fld" style="margin:0"><label>بدء مجدول (اختياري)</label><input class="inp" type="datetime-local" data-sa="scheduledAt" value="${s.scheduledAt?new Date(s.scheduledAt-new Date().getTimezoneOffset()*60000).toISOString().slice(0,16):""}"></div>
  <div class="fld" style="margin:0"><label>عند انقطاع البث</label><select class="inp" data-sa="pauseOnDisconnect"><option value="1" ${s.pauseOnDisconnect?"selected":""}>يتوقف العد تلقائياً</option><option value="0" ${!s.pauseOnDisconnect?"selected":""}>يستمر العد</option></select></div></div>
  <div class="fld" style="margin-top:8px"><label>احتساب الأحداث أثناء الإيقاف المؤقت</label><select class="inp" data-sa="countWhilePaused"><option value="1" ${s.countWhilePaused?"selected":""}>نعم، يُضاف الوقت ويُحفظ</option><option value="0" ${!s.countWhilePaused?"selected":""}>لا</option></select></div>
 </div></div>
 <div class="ttl">طرق إضافة الوقت — كل طريقة تُفعَّل وتُعطَّل بشكل مستقل</div>
 <div class="grid g2"><div class="card"><h3><span>🎁 الهدايا</span>${chk("rules.gifts.enabled",r.gifts.enabled)}</h3>
  <table><thead><tr><th>معرّف الهدية</th><th>الاسم</th><th>أو حد أدنى (ألماس)</th><th>الوقت (ثانية)</th><th></th></tr></thead><tbody>
  ${r.gifts.table.map((g,i)=>`<tr><td><input class="inp" dir="ltr" data-gr="${i}" data-gf="giftId" value="${g.giftId??""}" placeholder="—" style="width:80px"></td><td><input class="inp" data-gr="${i}" data-gf="name" value="${esc(g.name)}"></td><td><input class="inp" type="number" data-gr="${i}" data-gf="minDiamonds" value="${g.minDiamonds||""}" style="width:80px"></td><td><input class="inp" type="number" data-gr="${i}" data-gf="sec" value="${g.sec}" style="width:80px"></td><td><button class="ib" data-gdel="${i}">✕</button></td></tr>`).join("")}
  </tbody></table><div class="row" style="margin-top:8px"><button class="btn sm" data-gadd>+ إضافة هدية</button><span class="mut small">هدية غير موجودة في الجدول:</span><input class="inp" type="number" step="0.1" data-sa="rules.gifts.perDiamondSec" value="${r.gifts.perDiamondSec}" style="width:80px"><span class="mut small">ثانية لكل ألماسة (0 = لا شيء)</span></div>
  ${S.catalog&&S.catalog.length?`<div class="ttl">هدايا متاحة في البث (من TikTok)</div><div class="row">${S.catalog.slice(0,60).map(g=>`<button class="btn sm" data-gcat="${g.id}">${esc(g.name)} · ${g.diamonds}💎</button>`).join("")}</div>`:`<div class="note" style="margin-top:10px">المطابقة بالمعرّف أولاً ثم بالاسم ثم بالحد الأدنى للألماس. عند الاتصال الفعلي بالخادم تظهر هنا قائمة الهدايا الحقيقية بمعرّفاتها وقيمها من TikTok لتضيفها بضغطة — القيم الحالية افتراضية تجريبية.</div>`}
 </div>
 <div class="card"><h3><span>❤️ الإعجابات</span>${chk("rules.likes.enabled",r.likes.enabled)}</h3><div class="grid g2" style="gap:8px">${num("rules.likes.every",r.likes.every,"كل (إعجاب)")}${num("rules.likes.sec",r.likes.sec,"يضيف (ثانية)")}</div><p class="mut small">المتراكم الحالي: ${fmt(s.likeAcc||0)} إعجاب</p>
  <h3 style="margin-top:14px"><span>👤 المتابعون الجدد</span>${chk("rules.follow.enabled",r.follow.enabled)}</h3>${num("rules.follow.sec",r.follow.sec,"لكل متابع (ثانية)")}
  <h3 style="margin-top:14px"><span>⭐ الاشتراكات</span>${chk("rules.subscribe.enabled",r.subscribe.enabled)}</h3>${num("rules.subscribe.sec",r.subscribe.sec,"لكل اشتراك (ثانية)")}
  <h3 style="margin-top:14px"><span>🎯 تحقيق هدف</span>${chk("rules.goal.enabled",r.goal.enabled)}</h3><div class="grid g3" style="gap:8px"><div class="fld" style="margin:0"><label>المقياس</label><select class="inp" data-sa="rules.goal.metric">${[["likes","الإعجابات"],["gifts","نقاط الدعم"],["follows","المتابعون"]].map(o=>`<option value="${o[0]}" ${r.goal.metric===o[0]?"selected":""}>${o[1]}</option>`).join("")}</select></div>${num("rules.goal.target",r.goal.target,"الهدف")}${num("rules.goal.sec",r.goal.sec,"يضيف (ثانية)")}</div>${r.goal.reached?'<p class="small" style="color:var(--ok)">✓ تم تحقيق الهدف</p>':""}
  <h3 style="margin-top:14px"><span>✋ الإضافة والخصم اليدوي</span>${chk("rules.manual.enabled",r.manual.enabled)}</h3></div></div>
 <div class="grid g2" style="margin-top:14px"><div class="card"><h3>العداد على الشاشة</h3>${sw.length?sw.map(w=>widgetQuick(w)+`<div class="row"><label class="row small"><input type="checkbox" data-wf="sound" data-wid="${w.id}" ${w.sound?"checked":""}> صوت عند إضافة الوقت</label></div>`).join(""):`<div class="empty">لا يوجد عداد سبثون في «${esc(l.name)}»</div><button class="btn pri sm" data-add="subathon">+ إضافة عداد السبثون</button>`}
  <button class="btn sm" data-libtab="clocks" data-go="library" style="margin-top:8px">🎨 مكتبة أشكال العداد (${CLOCK_DESIGNS.length})</button></div>
 <div class="card"><h3>سجل العمليات <span class="tag">${R.logs.length}</span></h3><div class="feed">${R.logs.slice(0,60).map(x=>`<div><b style="color:${x.deltaMs>0?"var(--ok)":x.deltaMs<0?"var(--bad)":"var(--mut)"}">${x.deltaMs?fmtDelta(x.deltaMs):"•"}</b> ${esc(x.reason)} <span class="mut small">— ${dt(x.at)} · متبقٍ ${fmtClock(x.remainingMs)}</span></div>`).join("")||'<div class="mut">لا عمليات بعد</div>'}</div></div></div>`+testBar();
}
function mountClockPreview(id,w){ const box=document.getElementById(id); if(!box) return; const cv={w:1000,h:Math.round(1000*box.clientHeight/Math.max(1,box.clientWidth))};
 const pw={...w,id:"pv_sa",x:.04,y:.06,w:.92,h:.88,locked:true}; const stg=document.createElement("div"); stg.className="stage"; stg.style.background="none"; stg.style.width=cv.w+"px"; stg.style.height=cv.h+"px"; stg.style.transform=`scale(${box.clientWidth/cv.w})`; box.appendChild(stg);
 const v=new View(pw,cv,{data:SRC,globalFx:S.settings.fx,mute:true}); stg.appendChild(v.el); liveViews.add(v) }

/* ---- المؤقتات ---- */
function timersHTML(){
 const now=Date.now()+skew, l=L();
 return head("مؤقتات البث","عدة مؤقتات تعمل في نفس الوقت — كل مؤقت مستقل بإعداداته")+
 `<div class="card" style="margin-bottom:14px"><div class="row"><b>مؤقت جديد:</b><select class="inp" id="tmKind" style="width:auto">${Object.entries(TIMER_KINDS).filter(([k])=>k!=="elapsed").map(([k,v])=>`<option value="${k}">${v.label}</option>`).join("")}</select><input class="inp" id="tmName" placeholder="الاسم (مثل: وقت السحب)" style="width:200px"><input class="inp" id="tmMin" type="number" value="10" min="1" style="width:80px"><span class="mut small">دقيقة</span><button class="btn pri sm" data-tm-create>+ إنشاء</button></div></div>
 <div class="grid g2">${R.C.timers.map(t=>{ const ws_=l.widgets.filter(w=>w.type==="timer"&&w.timerId===t.id);
  return `<div class="card"><h3><span>⏱️ ${esc(t.name)} <span class="tag">${TIMER_KINDS[t.kind]?.label||""}</span></span><span class="tag">${TM_STATUS[t.status]}</span></h3>
  <div class="stat"><div class="v gold" data-live-clock="${t.id}">${fmtClock(timerValue(t,now),t.dir==="up"||t.durationMs>=HOUR)}</div></div>
  <div class="row" style="margin:10px 0"><button class="btn sm pri" data-tm="${t.id}" data-tmop="start">▶ تشغيل</button><button class="btn sm" data-tm="${t.id}" data-tmop="pause">⏸ إيقاف</button><button class="btn sm" data-tm="${t.id}" data-tmop="resume">⏯ استكمال</button><button class="btn sm" data-tm="${t.id}" data-tmop="reset">↺ تصفير</button><button class="btn sm" data-tm="${t.id}" data-tmadd="60000">+1د</button><button class="btn sm" data-tm="${t.id}" data-tmadd="-60000">−1د</button></div>
  <div class="grid g2" style="gap:8px"><div class="fld" style="margin:0"><label>الاسم</label><input class="inp" data-tmc="name" data-tm-id="${t.id}" value="${esc(t.name)}"></div><div class="fld" style="margin:0"><label>النص الظاهر فوق الوقت</label><input class="inp" data-tmc="prefix" data-tm-id="${t.id}" value="${esc(t.prefix)}"></div>
  ${t.dir==="down"?`<div class="fld" style="margin:0"><label>المدة (دقيقة)</label><input class="inp" type="number" min="1" data-tmc="durationMin" data-tm-id="${t.id}" value="${msToMin(t.durationMs)}"></div><div class="fld" style="margin:0"><label>نص الانتهاء</label><input class="inp" data-tmc="endText" data-tm-id="${t.id}" value="${esc(t.endText)}"></div>`:`<div class="fld" style="margin:0"><label>تشغيل تلقائي مع البث</label><select class="inp" data-tmc="autoLive" data-tm-id="${t.id}"><option value="1" ${t.autoLive?"selected":""}>نعم</option><option value="0" ${!t.autoLive?"selected":""}>لا</option></select></div>`}</div>
  <div class="row" style="margin-top:10px">${ws_.length?`<span class="tag">على الشاشة: ${ws_.length}</span>${ws_.map(w=>`<button class="btn sm" data-edit="${w.id}">تعديل الشكل</button><button class="btn sm" data-copylink="${w.id}">🔗 رابط</button>`).join("")}`:`<button class="btn sm" data-tm-add-w="${t.id}">+ إضافة للشاشة</button>`}${t.id!=="stream"?`<button class="btn sm dng" data-tm-del="${t.id}">حذف</button>`:""}</div></div>` }).join("")}</div>
 <div class="note" style="margin-top:14px">الوقت يُحسب من ساعة الخادم ويُحفظ، فلا يتأثر بتحديث الصفحة أو إغلاق المتصفح. أشكال المؤقتات (20 تصميماً) في مكتبة التصاميم ← «السبثون والمؤقتات».</div>`+testBar();
}



/* ---- الدونيشن والتبرعات ---- */
const DONTABS=[["overview","📊 لوحة الدونيشن"],["widgets","🧩 العناصر"],["goals","🎯 أهداف الدعم"],["alerts","🔔 التنبيهات"],["log","🧾 سجل التبرعات"],["providers","🔌 إعدادات الربط"],["settings","⚙️ الإعدادات"]];
const CUR_OPTS=Object.entries(CURRENCIES).map(([k,c])=>[k,`${c.name} (${k})`]);
function donSave(){ save(); pushLayout(); allViews().forEach(v=>{ if(TYPES[v.w.type]?.don) v.refresh(SRC()) }) }
function donPropsHTML(w,sel,rng){ const DC=S.donCfg; let h="";
 if(w.type==="donGoal") h+=sel("goalId","الهدف المعروض",DC.goals.map(g=>[g.id,g.name]),w.goalId||DC.goals[0]?.id);
 if(w.type==="donTop"||w.type==="donBoard"||(w.type==="donTicker"&&w.order==="top")) h+=sel("period","الفترة",PERIODS,w.period);
 if(w.type==="donTicker") h+=`<div class="grid g2" style="gap:8px">${sel("order","الترتيب",[["recent","الأحدث"],["top","الأعلى مبلغاً"]],w.order)}${sel("topN","عدد الداعمين",[[5,"آخر 5"],[10,"آخر 10"],[20,"آخر 20"]],w.topN)}</div><div class="grid g2" style="gap:8px">${sel("dir","الاتجاه",[["rtl","من اليمين لليسار"],["ltr","من اليسار لليمين"]],w.dir)}</div>${rng("speed","سرعة الحركة",20,400,10,w.speed,v=>v+" px/ث")}`;
 if(w.type!=="donGoal"&&w.type!=="donAlert") h+=`<div class="grid g2" style="gap:8px">${sel("currency","العملة",[["","الافتراضية ("+DC.currency+")"],...CUR_OPTS],w.currency)}${sel("hideAnon","المجهولون",[["0","إظهار"],["1","إخفاء"]],w.hideAnon?"1":"0")}</div>`;
 if(w.type==="donLatest"||w.type==="donAlert") h+=`<div class="grid g2" style="gap:8px">${sel("enter","حركة الدخول",ENTER_OPTS,w.enter)}${sel("exit","حركة الخروج",ENTER_OPTS,w.exit)}</div>${w.type==="donLatest"?sel("showMessage","رسالة الداعم",[["1","ظاهرة"],["0","مخفية"]],w.showMessage?"1":"0"):""}`;
 return h }
function donWidgetsOf(types){ return L().widgets.filter(w=>types.includes(w.type)) }
function donationsHTML(){
 const t=S.donTab, DC=S.donCfg, now=Date.now()+skew; let body="";
 if(t==="overview"){ const stats=donationStats(R.DN,DC,now);
  body=(stats.length?stats.map(c=>`<div class="card" style="margin-bottom:14px"><h3>${CURRENCIES[c.currency]?.name||c.currency} <span class="tag">${c.currency}</span></h3><div class="grid g4">${stat("إجمالي التبرعات المؤكدة",fmtMoney(c.total,c.currency),1)}${stat("اليوم",fmtMoney(c.today,c.currency))}${stat("الأسبوع",fmtMoney(c.week,c.currency))}${stat("الشهر",fmtMoney(c.month,c.currency))}</div>
   <div class="grid g4" style="margin-top:10px">${stat("أعلى تبرع منفرد",fmtMoney(c.max,c.currency))}${stat("أكبر داعم",c.top?esc(c.top.name)+" · "+fmtMoney(c.top.v,c.currency):"—")}${stat("عدد العمليات",fmt(c.count))}${stat("المسترجع",fmtMoney(c.refunded,c.currency))}</div>
   <div class="ttl">التوزيع حسب المزود</div><div class="row">${Object.entries(c.byProvider).map(([k,v])=>`<span class="tag">${esc(PROVIDERS[k]?.name||k)}: ${fmtMoney(v,c.currency)}</span>`).join("")}</div></div>`).join(""):`<div class="card empty">لا توجد تبرعات مؤكدة بعد. أحداث وضع التجربة لا تظهر هنا.</div>`)+
  `<div class="note">📌 كل عملة تُعرض لوحدها — لا نجمع ريالاً مع دولار في رقم واحد بدون تحويل موثوق. الأرقام هنا للتبرعات المؤكدة فقط بعد خصم الاسترجاع، وبدون التبرعات التجريبية. الدونيشن منفصل تماماً عن نقاط هدايا TikTok.</div>
  <div class="row" style="margin-top:12px"><button class="btn sm" data-don-session>▶ بدء جلسة بث جديدة (لقائمة «البث الحالي»)</button><button class="btn sm" data-don-cleartests>🧹 مسح التبرعات التجريبية</button></div>` }
 else if(t==="widgets"){
  const add=(type,label,extra)=>`<button class="btn sm" data-don-addw="${type}" ${extra?`data-don-extra='${extra}'`:""}>+ ${label}</button>`;
  body=`<div class="card" style="margin-bottom:14px"><h3>أضف إلى المشهد «${esc(L().name)}»</h3><div class="row">${add("donTicker","💸 شريط الدعم")}${add("donGoal","🎯 هدف الدعم")}${add("donLatest","💚 آخر داعم")}${add("donTop","👑 أكبر داعم (البث الحالي)",'{"period":"session","title":"ملك الدعم"}')}${add("donTop","🏆 أقوى داعم الأسبوع",'{"period":"week","title":"أقوى داعم الأسبوع","name":"أقوى داعم الأسبوع"}')}${add("donTop","👑 أقوى داعم الشهر",'{"period":"month","title":"أقوى داعم الشهر","name":"أقوى داعم الشهر"}')}${add("donBoard","💰 قائمة أفضل الداعمين")}${add("donAlert","🔔 تنبيهات الدونيشن")}</div></div>
  <div class="grid g2">${donWidgetsOf(["donTicker","donGoal","donLatest","donTop","donBoard","donAlert"]).map(w=>`<div class="card"><h3><span>${TYPES[w.type].icon} ${esc(w.name)}</span><span class="tag">${wdname(w)}</span></h3><div class="mut small">${w.type==="donTop"||w.type==="donBoard"?"الفترة: "+(PERIODS.find(p=>p[0]===w.period)||[])[1]+" · ":""}${w.currency||DC.currency}</div><div class="row" style="margin-top:8px"><button class="btn sm pri" data-edit="${w.id}">تعديل في الاستوديو</button><button class="btn sm" data-lib="${w.id}">التصميم</button><button class="btn sm" data-copylink="${w.id}">🔗 رابط مستقل</button><button class="btn sm" data-preview="${w.id}">👁 معاينة</button></div></div>`).join("")||'<div class="empty">لا توجد عناصر دونيشن في هذا المشهد</div>'}</div>
  <p class="mut small">أقوى داعم الأسبوع يُحسب بالمنطقة الزمنية وبداية الأسبوع من «الإعدادات». عند بداية شهر جديد يبدأ ترتيب جديد تلقائياً، وتبقى بيانات الأشهر السابقة في «جميع الأوقات» والسجل.</p>` }
 else if(t==="goals"){
  body=`<div class="row" style="margin-bottom:12px"><button class="btn pri sm" data-goal-add>+ هدف جديد</button></div><div class="grid g2">${DC.goals.map(g=>{const p=goalProgress(g,R.DN,now); const inp=(f,l,v,type="text",attrs="")=>`<div class="fld" style="margin:0"><label>${l}</label><input class="inp" type="${type}" data-goal="${g.id}" data-gf="${f}" value="${esc(v??"")}" ${attrs}></div>`; const dtv=x=>x?new Date(x-new Date().getTimezoneOffset()*60000).toISOString().slice(0,16):"";
   return `<div class="card"><h3><span>🎯 ${esc(g.name)}</span><span class="tag">${g.paused?"متوقف":p.reached?"✓ تحقق":Math.floor(p.pct)+"%"}</span></h3>
   <div class="gbar" style="height:12px;border-radius:999px;background:#ffffff1a;overflow:hidden;margin-bottom:8px"><i style="display:block;height:100%;width:${p.pct}%;background:linear-gradient(90deg,#1546c9,#6aa8ff)"></i></div>
   <div class="mut small" style="margin-bottom:10px">${fmtMoney(p.current,g.currency)} / ${fmtMoney(p.target,g.currency)} · المتبقي ${fmtMoney(p.remaining,g.currency)}</div>
   <div class="grid g2" style="gap:8px">${inp("name","اسم الهدف",g.name)}${inp("target","المبلغ المستهدف",g.target,"number",'min="1"')}
   <div class="fld" style="margin:0"><label>العملة</label><select class="inp" data-goal="${g.id}" data-gf="currency">${CUR_OPTS.map(o=>`<option value="${o[0]}" ${g.currency===o[0]?"selected":""}>${o[1]}</option>`).join("")}</select></div>${inp("base","المبلغ الحالي (رصيد يدوي)",g.base,"number",'min="0"')}
   ${inp("startAt","تاريخ البداية",dtv(g.startAt),"datetime-local")}${inp("endAt","تاريخ النهاية",dtv(g.endAt),"datetime-local")}
   <div class="fld" style="margin:0"><label>احتساب التبرعات الجديدة تلقائياً</label><select class="inp" data-goal="${g.id}" data-gf="auto"><option value="1" ${g.auto?"selected":""}>نعم</option><option value="0" ${!g.auto?"selected":""}>لا — يدوي فقط</option></select></div>
   <div class="fld" style="margin:0"><label>احتفال عند التحقيق</label><select class="inp" data-goal="${g.id}" data-gf="celebrate"><option value="1" ${g.celebrate!==false?"selected":""}>مفعّل</option><option value="0" ${g.celebrate===false?"selected":""}>متوقف</option></select></div></div>
   <div class="row" style="margin-top:10px"><button class="btn sm" data-goal-pause="${g.id}">${g.paused?"▶ استئناف":"⏸ إيقاف مؤقت"}</button><button class="btn sm dng" data-goal-reset="${g.id}">↺ إعادة ضبط</button>${DC.goals.length>1?`<button class="btn sm dng" data-goal-del="${g.id}">حذف</button>`:""}</div></div>` }).join("")}</div>
  <p class="mut small">إعادة الضبط تصفّر الرصيد اليدوي وتبدأ الاحتساب من الآن دون حذف أي تبرع. التبرعات المسترجعة تُخصم من الهدف تلقائياً.</p>` }
 else if(t==="alerts"){ const A=DC.alert;
  body=`<div class="grid g2"><div class="card"><h3>إعدادات التنبيه</h3><div class="grid g2" style="gap:8px">
   <div class="fld" style="margin:0"><label>الحد الأدنى للمبلغ لتشغيل التنبيه</label><input class="inp" type="number" min="0" data-alert="minAmount" value="${A.minAmount}"></div>
   <div class="fld" style="margin:0"><label>مدة الظهور (ثانية)</label><input class="inp" type="number" min="2" data-alert="durationSec" value="${A.durationSec}"></div>
   <div class="fld" style="margin:0"><label>رسالة الداعم</label><select class="inp" data-alert="showMessage"><option value="1" ${A.showMessage?"selected":""}>تظهر</option><option value="0" ${!A.showMessage?"selected":""}>لا تظهر</option></select></div>
   <div class="fld" style="margin:0"><label>الصوت</label><select class="inp" data-alert="sound"><option value="1" ${A.sound!==false?"selected":""}>مفعّل</option><option value="0" ${A.sound===false?"selected":""}>متوقف</option></select></div></div>
   <div class="fld" style="margin-top:8px"><label>نص التنبيه ({name} و {amount})</label><input class="inp" data-alert="template" value="${esc(A.template)}"></div>
   <p class="mut small">قائمة انتظار: التنبيهات لا تتداخل؛ كل تنبيه ينتظر انتهاء الذي قبله.</p><button class="btn sm pri" data-don-sim="100" data-msg="تنبيه تجريبي 🔥">🔔 تشغيل تنبيه تجريبي</button></div>
   <div class="card"><h3>فئات المبالغ <button class="btn sm" data-tier-add>+ فئة</button></h3><table><thead><tr><th>من مبلغ</th><th>الرمز</th><th>التأثير</th><th>الاسم</th><th></th></tr></thead><tbody>${DC.tiers.map((x,i)=>`<tr><td><input class="inp" type="number" min="0" style="width:80px" data-tier="${i}" data-tf="min" value="${x.min}"></td><td><input class="inp" style="width:60px" data-tier="${i}" data-tf="emoji" value="${esc(x.emoji)}"></td><td><select class="inp" data-tier="${i}" data-tf="fx">${[["basic","عادي"],["fire","نار"],["royal","ملكي + احتفال"],["legend","أسطوري + احتفال"]].map(o=>`<option value="${o[0]}" ${x.fx===o[0]?"selected":""}>${o[1]}</option>`).join("")}</select></td><td><input class="inp" data-tier="${i}" data-tf="name" value="${esc(x.name||"")}"></td><td>${DC.tiers.length>1?`<button class="ib" data-tier-del="${i}">✕</button>`:""}</td></tr>`).join("")}</tbody></table><p class="mut small">كل مبلغ يأخذ أعلى فئة يصل لها، بتأثير وشكل مختلف.</p></div></div>
  <div class="row" style="margin-top:12px">${donWidgetsOf(["donAlert"]).length?`<span class="tag">عنصر التنبيهات موجود في المشهد</span>`:`<button class="btn sm" data-don-addw="donAlert">+ إضافة عنصر التنبيهات للمشهد</button>`}</div>` }
 else if(t==="log"){ const list=[...R.DN.list].reverse().slice(0,200);
  body=`<div class="card"><h3>سجل التبرعات <span class="tag">${R.DN.list.length}</span></h3>${list.length?`<table><thead><tr><th>الوقت</th><th>الداعم</th><th>المبلغ</th><th>المزود</th><th>الحالة</th><th>الرسالة</th><th></th></tr></thead><tbody>${list.map(d=>`<tr><td class="small">${dt(d.t)}</td><td>${esc(displayName(d,DC))}${d.anonymous?' <span class="tag">مجهول</span>':""}</td><td>${fmtMoney(d.amount,d.currency)}${d.refunded?`<div class="small" style="color:var(--bad)">−${fmtMoney(d.refunded,d.currency)}</div>`:""}</td><td>${esc(PROVIDERS[d.provider]?.name||d.provider)}${d.test?' <span class="tag">تجريبي</span>':""}</td><td>${({confirmed:"مؤكد",refunded:"مسترجع",partially_refunded:"مسترجع جزئياً"})[d.status]||d.status}</td><td class="small">${esc(d.message||"")}</td><td>${d.test&&d.status==="confirmed"?`<button class="btn sm" data-don-refund="${esc(d.id)}">محاكاة استرجاع</button>`:""}</td></tr>`).join("")}</tbody></table>`:'<div class="empty">لا توجد تبرعات بعد</div>'}</div>
  <p class="mut small">معرّف العملية لدى المزود محفوظ ويمنع احتساب نفس التبرع مرتين. المدفوعات المعلّقة لا تُحتسب. سياسة الاسترجاع: يُخصم المبلغ المسترجع من الإحصائيات والأهداف والقوائم تلقائياً ويبقى السجل للمراجعة.</p>` }
 else if(t==="providers"){ const srv=!!CFG;
  body=`<div class="grid g2">${Object.entries(PROVIDERS).map(([k,p])=>{ const st=(S.providers||{})[k]||{};
   return `<div class="card"><h3><span>${esc(p.name)}</span><span class="tag" style="${p.supported?"":"opacity:.6"}">${p.supported?(st.enabled?(st.connected?"🟢 متصل":"🟡 مفعّل"):"مدعوم"):"غير مدعوم حالياً"}</span></h3><div class="mut small" style="line-height:1.9">${esc(p.kind)} — ${esc(p.note)}</div>
   ${p.supported?(srv?providerForm(k,st):`<div class="note" style="margin-top:8px">يتطلب خادم المنصة: المفاتيح تُحفظ مشفّرة على الخادم ولا تظهر في المتصفح أو روابط OBS.</div>`):""}</div>` }).join("")}</div>` }
 else if(t==="settings"){
  body=`<div class="card"><div class="grid g2" style="gap:10px">
   <div class="fld" style="margin:0"><label>العملة الافتراضية للعناصر</label><select class="inp" data-dc="currency">${CUR_OPTS.map(o=>`<option value="${o[0]}" ${DC.currency===o[0]?"selected":""}>${o[1]}</option>`).join("")}</select></div>
   <div class="fld" style="margin:0"><label>المنطقة الزمنية لحساب اليوم/الأسبوع/الشهر</label><select class="inp" data-dc="tz">${["Asia/Riyadh","Asia/Dubai","Asia/Kuwait","Asia/Qatar","Asia/Bahrain","Asia/Muscat","Africa/Cairo","Europe/London","America/New_York","UTC"].map(z=>`<option ${DC.tz===z?"selected":""}>${z}</option>`).join("")}</select></div>
   <div class="fld" style="margin:0"><label>بداية الأسبوع</label><select class="inp" data-dc="weekStart">${WEEKDAYS.map((d,i)=>`<option value="${i}" ${+DC.weekStart===i?"selected":""}>${d}</option>`).join("")}</select></div>
   <div class="fld" style="margin:0"><label>اسم الداعم المجهول</label><input class="inp" data-dc="anonName" value="${esc(DC.anonName)}"></div>
   <div class="fld" style="margin:0"><label>إخفاء المجهولين في كل العناصر</label><select class="inp" data-dc="hideAnon"><option value="0" ${!DC.hideAnon?"selected":""}>لا</option><option value="1" ${DC.hideAnon?"selected":""}>نعم</option></select></div></div>
   <p class="mut small">روابط OBS تعرض الاسم والمبلغ والرسالة فقط — لا بريد ولا بيانات دفع ولا مفاتيح.</p></div>` }
 return head("الدونيشن والتبرعات","تبرعات مالية مؤكدة من مزودين رسميين — منفصلة تماماً عن هدايا TikTok")+`<div class="row" style="margin-bottom:14px">${DONTABS.map(x=>`<button class="btn sm ${t===x[0]?"on":""}" data-dontab="${x[0]}">${x[1]}</button>`).join("")}</div>`+body+donTestBar();
}
function providerForm(k,st){ const f=(n,l,type="text",ph="")=>`<div class="fld" style="margin:0"><label>${l}</label><input class="inp" dir="ltr" type="${type}" data-pv-kind="${k}" data-pv-f="${n}" placeholder="${esc(st.masked?.[n]||ph)}"></div>`;
 const fields=k==="streamlabs"?f("socketToken","Socket API Token","password","من streamlabs.com ← Settings ← API Settings"):k==="streamelements"?f("token","Token","password")+`<div class="fld" style="margin:0"><label>نوع التوكن</label><select class="inp" data-pv-kind="${k}" data-pv-f="tokenType"><option value="jwt">JWT</option><option value="apikey">Overlay Token</option><option value="oauth2">OAuth2</option></select></div>`
  :f("publishableKey","Publishable Key (pk_)","text","pk_live_...")+f("secretKey","Secret Key (sk_)","password","sk_live_...")+f("webhookSecret","Webhook Secret Token","password");
 return `<div class="grid g2" style="gap:8px;margin-top:8px">${fields}</div><div class="row" style="margin-top:8px"><button class="btn pri sm" data-pv-save="${k}">حفظ وتفعيل</button>${st.enabled?`<button class="btn sm dng" data-pv-off="${k}">تعطيل</button>`:""}</div>
 ${k==="moyasar"&&st.enabled&&CFG?`<div class="note" style="margin-top:8px">صفحة التبرع: <span dir="ltr">${esc(CFG.donateURL)}</span><br>عنوان الـWebhook في لوحة ميسّر (الأحداث: payment_paid و payment_refunded و payment_voided): <span dir="ltr">${esc(CFG.webhookURL)}</span></div>`:""}` }
function donTestBar(){ return `<div class="testbar"><b style="color:var(--gold)">🧪 تجربة الدونيشن</b> <span class="mut small">(لا تدخل الإحصائيات المالية)</span>
 <button class="btn sm" data-don-sim="5">💰 تبرع 5</button><button class="btn sm" data-don-sim="50">💰 50</button><button class="btn sm" data-don-sim="500">💰 500</button><button class="btn sm" data-don-sim="25" data-newname="1">💚 تغيير آخر داعم</button><button class="btn sm" data-don-sim="1500" data-newname="1">👑 تغيير أكبر داعم</button><button class="btn sm" data-don-sim="100" data-msg="لهدف المعدات 🎯">🎯 تحديث الهدف</button><button class="btn sm" data-don-shuffle>🔀 تغيير ترتيب الداعمين</button><button class="btn sm" data-don-sim="200" data-msg="تنبيه تجريبي 🔥">🔔 تشغيل تنبيه</button></div>` }
function mountDonations(){}
function donSim(amount,o={}){ const names=["محمد","خالد","عبدالله","سارة","نورة","فهد","ريم","تركي"]; const n=o.newName?rnd(names)+"_"+Math.floor(Math.random()*90+10):rnd(names);
 sim({type:"donation",provider:"test",test:true,name:n,amount:+amount,currency:S.donCfg.currency,message:o.msg||rnd(["كفو!","استمر 🔥","","لأجل البث 💙"]),anonymous:!o.newName&&Math.random()<.1}) }
function donClick(t,d){
 if(d.dontab){ S.donTab=d.dontab; renderPage(); if(d.dontab==="providers"&&CFG) CFG.api("/api/donations/providers").then(r=>{ if(r.providers){ S.providers=r.providers; if(S.page==="donations"&&S.donTab==="providers") renderPage(true) } }); return true }
 if(d.donSim){ donSim(d.donSim,{newName:!!d.newname,msg:d.msg}); return true }
 if(t.hasAttribute("data-don-shuffle")){ const tops=donorTotals(R.DN,S.donCfg,{period:"all",now:Date.now()}); const pick=tops[1+Math.floor(Math.random()*Math.max(1,tops.length-1))]; if(pick&&tops[0]){ sim({type:"donation",provider:"test",test:true,name:pick.name,amount:Math.ceil(tops[0].v-pick.v+10),currency:S.donCfg.currency,message:"🔀"}) } else donSim(50); return true }
 if(t.hasAttribute("data-don-session")){ sim({type:"donation_session"}); toast("بدأت جلسة جديدة"); return true }
 if(t.hasAttribute("data-don-cleartests")){ sim({type:"donation_clear_tests"}); setTimeout(()=>renderPage(true),80); return true }
 if(d.donRefund){ sim({type:"donation_refund",id:d.donRefund}); setTimeout(()=>renderPage(true),80); return true }
 if(d.donAddw){ const w=addWidget(d.donAddw,d.donExtra?JSON.parse(d.donExtra):{}); const ex=d.donExtra?JSON.parse(d.donExtra):{}; const pos={donTicker:"tc",donGoal:"bc",donLatest:"bl",donTop:ex.period==="month"?"tr":ex.period==="week"?"tl":"tc",donBoard:"ml",donAlert:"mr"}[d.donAddw]; applyPreset(w,pos==="mr"?"tc":pos,CV()); if(d.donAddw==="donAlert"){ w.y=.3 } save(); pushLayout(); renderPage(); return true }
 if(t.hasAttribute("data-goal-add")){ S.donCfg.goals.push(newGoal({name:"هدف جديد",currency:S.donCfg.currency})); donSave(); renderPage(true); return true }
 if(d.goalPause){ const g=S.donCfg.goals.find(x=>x.id===d.goalPause); g.paused=!g.paused; donSave(); renderPage(true); return true }
 if(d.goalReset){ ask("إعادة ضبط الهدف؟ يبدأ الاحتساب من الآن ولا تُحذف التبرعات").then(ok=>{ if(!ok) return; const g=S.donCfg.goals.find(x=>x.id===d.goalReset); g.base=0; g.countedFrom=Date.now()+skew; donSave(); renderPage(true) }); return true }
 if(d.goalDel){ S.donCfg.goals=S.donCfg.goals.filter(x=>x.id!==d.goalDel); donSave(); renderPage(true); return true }
 if(t.hasAttribute("data-tier-add")){ S.donCfg.tiers.push({min:100,emoji:"⭐",fx:"basic",name:"فئة جديدة"}); donSave(); renderPage(true); return true }
 if(d.tierDel!==undefined){ S.donCfg.tiers.splice(+d.tierDel,1); donSave(); renderPage(true); return true }
 if(d.pvSave&&CFG){ const k=d.pvSave, body={}; document.querySelectorAll(`[data-pv-kind="${k}"]`).forEach(e=>{ if(e.value) body[e.dataset.pvF]=e.value }); CFG.api("/api/donations/providers",{method:"PUT",body:{kind:k,enabled:true,config:body}}).then(r=>{ S.providers=r.providers; toast(r.error||"تم الحفظ"); renderPage(true) }); return true }
 if(d.pvOff&&CFG){ CFG.api("/api/donations/providers",{method:"PUT",body:{kind:d.pvOff,enabled:false}}).then(r=>{ S.providers=r.providers; renderPage(true) }); return true }
 return false }
function donInput(t,d,e){ if(e.type!=="change") return false;
 if(d.goal){ const g=S.donCfg.goals.find(x=>x.id===d.goal); const f=d.gf; let v=t.value;
  if(f==="target"||f==="base") v=Math.max(0,+v||0); else if(f==="auto"||f==="celebrate") v=v==="1"; else if(f==="startAt"||f==="endAt") v=v?new Date(v).getTime():null;
  g[f]=v; donSave(); renderPage(true); return true }
 if(d.alert){ let v=t.value; if(["minAmount","durationSec"].includes(d.alert)) v=Math.max(0,+v||0); if(["showMessage","sound"].includes(d.alert)) v=v==="1"; S.donCfg.alert[d.alert]=v; donSave(); return true }
 if(d.tier!==undefined){ const x=S.donCfg.tiers[+d.tier]; x[d.tf]=d.tf==="min"?Math.max(0,+t.value||0):t.value; donSave(); return true }
 if(d.dc){ let v=t.value; if(d.dc==="weekStart") v=+v; if(d.dc==="hideAnon") v=v==="1"; S.donCfg[d.dc]=v; donSave(); renderPage(true); return true }
 return false }

/* ---- حساباتي + حسابات الألعاب ---- */
const ENTER_OPTS=Object.entries(ENTRANCES).filter(([,v])=>!v.legacy).map(([k,v])=>[k,v.name]);
const EXIT_OPTS=Object.entries(EXITS).map(([k,v])=>[k,v.name]);
const IDLE_OPTS=[["","بدون"],...Object.entries(IDLES).map(([k,v])=>[k,v.name])];
const SDG={luxury:"فاخرة",neon:"نيون",modern:"عصرية",pro:"احترافية للبث",anim:"متحركة"};
const DESIGN_OPTS=SOCIAL_DESIGNS.map(d=>[d.id,`${SDG[d.g]} · ${d.name}`]);
const SOCTABS=[["accounts","🌐 حسابات التواصل"],["games","🎮 حسابات الألعاب"],["rotation","🔄 التناوب والمعاينة"],["style","🎨 تصميم البطاقة"],["anim","✨ مكتبة الحركات"],["display","📺 العناصر والروابط"]];
const accById=id=>S.socials.accounts.find(a=>a.id===id);
const dimTxt=(w,h)=>`<span dir="ltr">${w} × ${h}</span>`;
function socSave(){ save(); pushLayout(); allViews().forEach(v=>{ if(isSoc(v.w)) v.refresh(SRC()) }) }
const rotW=()=>L().widgets.find(w=>w.type==="social"&&w.mode==="rotation");
function socialShow(accountId,sec=8){ const now=Date.now()+skew; send({t:"fx",fx:{kind:"social",accountId,at:now,until:now+sec*1000}});
 if(!L().widgets.some(w=>w.type==="social"&&w.mode!=="single")) toast("أضف «الحسابات المتناوبة» للمشهد من «العناصر والروابط»") }
function accFields(a){
 const inp=(f,l,v,attrs="")=>`<div class="fld" style="margin:0"><label>${l}</label><input class="inp" data-acf="${f}" data-acc="${a.id}" value="${esc(v??"")}" ${attrs}></div>`;
 if(a.kind==="game"){ const G=GAMES[a.platform]||GAMES.customGame;
  return `<div class="fld" style="margin:0"><label>اللعبة</label><select class="inp" data-acf="platform" data-acc="${a.id}">${Object.entries(GAMES).map(([k,g])=>`<option value="${k}" ${a.platform===k?"selected":""}>${g.name}</option>`).join("")}</select></div>`+
   G.fields.map(([k,l])=>inp("f."+k,l,(a.fields||{})[k],'dir="auto"')).join("") }
 const P=PLATFORMS[a.platform]||PLATFORMS.custom;
 return `<div class="fld" style="margin:0"><label>المنصة</label><select class="inp" data-acf="platform" data-acc="${a.id}">${Object.entries(PLATFORMS).map(([k,p])=>`<option value="${k}" ${a.platform===k?"selected":""}>${p.name}</option>`).join("")}</select></div>`+
  inp("username","اسم المستخدم",a.username,'dir="ltr" placeholder="b6s61"')+inp("display",a.platform==="custom"?"اسم المنصة":"الاسم الظاهر داخل البث (اختياري)",a.display)+inp("url","رابط الحساب",a.url||(a.username?P.url(String(a.username).replace(/^@/,"")):""),'dir="ltr"');
}

function accCard(a){ const v=accountView(a), st=a.style||{};
 const so=(f,l,opts,val)=>`<div class="fld" style="margin:0"><label>${l}</label><select class="inp" data-acst="${f}" data-acc="${a.id}"><option value="">حسب العنصر</option>${opts.map(o=>`<option value="${o[0]}" ${val===o[0]?"selected":""}>${o[1]}</option>`).join("")}</select></div>`;
 return `<div class="card"><h3><span class="row" style="gap:8px"><span style="width:12px;height:12px;border-radius:50%;background:${esc(v.color)};display:inline-block"></span>${esc(v.platform)} <span class="mut small" dir="ltr">${esc(v.user)}</span></span><label class="row small" style="gap:6px"><input type="checkbox" data-acf="enabled" data-acc="${a.id}" ${a.enabled!==false?"checked":""}> مفعّل</label></h3>
 <div class="pv accpv" data-accpv="${a.id}" style="height:84px;position:relative;border-radius:12px;overflow:hidden;background:repeating-conic-gradient(#101830 0 25%,#0a1022 0 50%) 0 0/20px 20px;margin-bottom:10px"></div>
 <div class="grid g2" style="gap:8px">${accFields(a)}
 <div class="fld" style="margin:0"><label>لون مخصص</label><input type="color" data-acf="color" data-acc="${a.id}" value="${esc(a.color||v.color)}"></div>
 <div class="fld" style="margin:0"><label>وصف مختصر</label><input class="inp" data-acf="desc" data-acc="${a.id}" value="${esc(a.desc)}"></div>
 <div class="fld" style="margin:0"><label>الشعار الرسمي (صورة)</label><label class="btn sm">⬆ رفع${a.logo?" ✓":""}<input type="file" accept="image/*" hidden data-upload="logo" data-acc="${a.id}"></label></div>
 <div class="fld" style="margin:0"><label>صورة الحساب (اختياري)</label><label class="btn sm">⬆ رفع${a.avatar?" ✓":""}<input type="file" accept="image/*" hidden data-upload="avatar" data-acc="${a.id}"></label></div></div>
 <details style="margin-top:10px"><summary class="small" style="cursor:pointer;color:var(--gold)">🎨 تصميم وحركات خاصة بهذا الحساب</summary><div class="grid g2" style="gap:8px;margin-top:8px">${so("design","التصميم",DESIGN_OPTS,st.design)}${so("enter","الدخول",ENTER_OPTS,st.enter)}${so("exit","الخروج",EXIT_OPTS,st.exit)}${so("idle","الحركة أثناء الظهور",IDLE_OPTS.slice(1),(st.idle||[])[0])}</div></details>
 <div class="row" style="margin-top:10px"><button class="btn sm pri" data-soc-show="${a.id}">▶ إظهار الآن</button><button class="btn sm" data-copy-acc="${a.id}">🔗 رابط هذا الحساب</button><button class="btn sm" data-acc-dup="${a.id}">نسخ</button>${a.logo||a.avatar?`<button class="btn sm" data-acc-clrimg="${a.id}">إزالة الصور</button>`:""}<button class="btn sm dng" data-acc-del="${a.id}">حذف</button></div></div>` }
function previewBox(id,h=150){ return `<div class="pv" id="${id}" style="height:${h}px;position:relative;border-radius:12px;overflow:hidden;background:repeating-conic-gradient(#101830 0 25%,#0a1022 0 50%) 0 0/20px 20px"></div>` }
function socialsHTML(){
 const t=S.socTab, R_=S.socials.rotation, l=L(), now=Date.now()+skew; let body="";
 const opt=(f,v,o,attr="data-rot")=>`<select class="inp" ${attr}="${f}" style="width:auto">${o.map(x=>`<option value="${x[0]}" ${String(v)===String(x[0])?"selected":""}>${x[1]}</option>`).join("")}</select>`;
 if(t==="accounts"||t==="games"){ const kind=t==="accounts"?"social":"game"; const list=S.socials.accounts.filter(a=>a.kind===kind);
  body=`<div class="row" style="margin-bottom:12px"><button class="btn pri sm" data-acc-add="${kind}">+ ${kind==="social"?"إضافة حساب":"إضافة حساب لعبة"}</button><span class="mut small">${kind==="game"?"يمكن إضافة أكثر من حساب للعبة الواحدة، ولكل لعبة صيغة معرّف خاصة بها.":"لكل حساب تصميم ودخولية خاصة اختيارياً."}</span></div>
  <div class="grid g2">${list.map(accCard).join("")||'<div class="empty">لا توجد حسابات بعد</div>'}</div>
  <div class="note" style="margin-top:14px">🔒 <b>الشعارات:</b> لا نرسم شعارات المنصات أو الألعاب داخل المنصة، ونعرض بدلاً منها رمزاً نصياً بلون المنصة. لاستخدام الشعار الرسمي ارفعه من حزمة الشعارات الرسمية وفق شروطها. لا نعرض أعداد متابعين أو شارات توثيق.</div>` }
 else if(t==="rotation"){ const slots=rotationSlots(S.socials); const st=rotationState(S.socials,now); const rw=rotW();
  const phaseAr={entering:"دخول",visible:"ظاهر",exiting:"خروج",waiting:"انتظار",paused:"متوقف مؤقتاً"};
  const accList=S.socials.accounts.filter(a=>a.enabled!==false); const items=R_.items&&R_.items.length?R_.items:accList.map(a=>({accountId:a.id,enabled:true}));
  body=`<div class="grid g2"><div class="card"><h3>المعاينة المباشرة <span class="tag">نفس شكل OBS</span></h3>${previewBox("rot-pv",170)}
   <div class="row" style="margin-top:10px"><button class="btn sm" data-pv="play">▶ تشغيل</button><button class="btn sm" data-pv="pause">⏸ إيقاف</button><button class="btn sm" data-pv="restart">↺ إعادة</button><button class="btn sm" data-pv="prev">⏮ السابق</button><button class="btn sm" data-pv="next">⏭ التالي</button>
   <select class="inp" id="pvSpeed" style="width:auto">${[[0.5,"سرعة ×0.5"],[1,"سرعة ×1"],[2,"سرعة ×2"]].map(o=>`<option value="${o[0]}" ${(S.pvSpeed||1)==o[0]?"selected":""}>${o[1]}</option>`).join("")}</select></div>
   <div class="grid g2" style="gap:8px;margin-top:8px"><div class="fld" style="margin:0"><label>التصميم</label>${opt("design",rw?rw.design:"b6o6Signature",DESIGN_OPTS,"data-rw")}</div><div class="fld" style="margin:0"><label>الحركة المستمرة</label>${opt("idle0",rw?(rw.idle||[])[0]||"":"sweep",IDLE_OPTS,"data-rw")}</div>
   <div class="fld" style="margin:0"><label>حركة الدخول</label>${opt("enter",R_.enter,ENTER_OPTS)}</div><div class="fld" style="margin:0"><label>حركة الخروج</label>${opt("exit",R_.exit,EXIT_OPTS)}</div></div>
   <p class="mut small">المعاينة مستقلة عن البث: أزرارها لا تؤثر على OBS. ${rw?"":"<b style='color:var(--bad)'>أضف عنصر «الحسابات المتناوبة» للمشهد من «العناصر والروابط».</b>"}</p></div>
  <div class="card"><h3>التحكم المباشر في البث <span class="tag">${R_.running?(R_.pausedAt?"متوقف مؤقتاً":"يعمل"):"متوقف"}</span></h3>
   <div class="row" style="margin-bottom:10px"><button class="btn pri sm" data-rot-run="1">▶ تشغيل التناوب</button><button class="btn sm" data-rot-act="pause">⏸ إيقاف مؤقت</button><button class="btn sm" data-rot-act="resume">⏯ استكمال</button><button class="btn sm" data-rot-act="prev">⏮ السابق</button><button class="btn sm" data-rot-act="next">⏭ التالي</button><button class="btn sm" data-rot-act="restart">↺ من البداية</button><button class="btn sm dng" data-rot-run="0">⏹ إيقاف</button></div>
   <p class="small">الآن: <b>${st?esc(accountView(accById(st.accountId)).platform)+" — "+phaseAr[st.phase]:"—"}</b> ${st?`(${st.index+1} من ${st.count})`:""}</p>
   <div class="grid g2" style="gap:8px"><div class="fld" style="margin:0"><label>مدة ظهور الحساب (ثانية)</label><input class="inp" type="number" min="1" step="0.5" data-rot="showSec" value="${R_.showSec}"></div>
   <div class="fld" style="margin:0"><label>الانتظار بين الحسابات (ثانية)</label><input class="inp" type="number" min="0" step="0.1" data-rot="gapSec2" value="${R_.gapMs/1000}"></div>
   <div class="fld" style="margin:0"><label>مدة الدخول (ثانية)</label><input class="inp" type="number" min="0.1" step="0.1" data-rot="enterSec" value="${R_.enterMs/1000}"></div>
   <div class="fld" style="margin:0"><label>مدة الخروج (ثانية)</label><input class="inp" type="number" min="0.1" step="0.1" data-rot="exitSec" value="${R_.exitMs/1000}"></div>
   <div class="fld" style="margin:0"><label>الترتيب</label>${opt("order",R_.order,[["list","حسب القائمة"],["random","عشوائي"]])}</div>
   <div class="fld" style="margin:0"><label>تكرار الدورة</label>${opt("loop",R_.loop?"1":"0",[["1","تكرار مستمر"],["0","مرة واحدة"]])}</div>
   <div class="fld" style="margin:0"><label>الحسابات المعروضة</label>${opt("filter",R_.filter,[["all","التواصل + الألعاب"],["social","التواصل فقط"],["game","الألعاب فقط"]])}</div></div>
   <p class="mut small">الحساب التالي لا يبدأ دخوله إلا بعد انتهاء خروج السابق. طول الدورة: ${(slots.reduce((a,x)=>a+x.dur,0)/1000).toFixed(1)} ثانية.</p></div></div>
  <div class="card" style="margin-top:14px"><h3>الحسابات المشاركة وترتيبها <span class="mut small">اسحب لتغيير الترتيب</span></h3><div id="rotList">${items.map((it,i)=>{const a=accById(it.accountId); if(!a) return ""; const v=accountView(a); return `<div class="ly rot-item" draggable="true" data-ri="${i}" style="border:1px solid var(--line);margin-bottom:6px;cursor:grab"><span>☰</span><input type="checkbox" data-ri-en="${i}" ${it.enabled!==false?"checked":""}><span style="width:10px;height:10px;border-radius:50%;background:${esc(v.color)}"></span><span class="nm">${esc(v.platform)} <span class="mut small" dir="ltr">${esc(v.user)}</span></span><input class="inp" type="number" min="1" step="0.5" data-ri-show="${i}" value="${it.showSec??""}" placeholder="${R_.showSec}ث" style="width:80px"></div>`}).join("")}</div></div>` }
 else if(t==="style"){ const rw=rotW(); const w=rw;
  body=w?`<div class="grid g2"><div class="card"><h3>المعاينة <span class="tag">${esc(w.name)}</span></h3>${previewBox("style-pv",150)}
   <div class="grid g2" style="gap:8px;margin-top:10px">${sty("design","التصميم",DESIGN_OPTS,w.design)}${sty("logoPos","مكان الشعار",[["auto","حسب التصميم"],["start","يمين"],["end","يسار"],["top","أعلى"]],w.logoPos)}
   ${sty("idle0","الحركة المستمرة 1",IDLE_OPTS,(w.idle||[])[0]||"")}${sty("idle1","الحركة المستمرة 2 (اختياري)",IDLE_OPTS,(w.idle||[])[1]||"")}</div>
   ${rngS("idleSpeed","سرعة الحركة المستمرة",.3,2,.1,w.idleSpeed??1)}${rngS("idleStrength","قوة الحركة",.2,2,.1,w.idleStrength??1)}</div>
   <div class="card"><h3>✨ اللمعة البيضاء White Light Sweep</h3><div class="grid g2" style="gap:8px">${swp("color","اللون",Object.entries(SWEEP_COLORS).map(([k,v])=>[k,v.name]))}${swp("dir","الاتجاه",[["rtl","من اليمين لليسار"],["ltr","من اليسار لليمين"]])}</div>
   ${swr("speedMs","مدة المرور (ms)",400,4000,100)}${swr("every","الانتظار بين التكرارات (ثانية)",0,20,.5)}${swr("width","عرض اللمعة (%)",6,50,1)}${swr("angle","الزاوية (°)",0,45,1)}${swr("strength","قوة الإضاءة / الشفافية",.1,1,.05)}${swr("repeat","عدد التكرارات (0 = مستمر)",0,20,1)}
   <p class="mut small">اللمعة تمر فوق الخلفية وتحت النص والشعار، فلا تحجبهما. شغّلها بإضافة «White Sweep» للحركة المستمرة.</p></div></div>
   <div class="card" style="margin-top:14px"><h3>🃏 التحكم بالبطاقة</h3><div class="grid g3" style="gap:8px">
   <div class="fld" style="margin:0"><label>لون الخلفية</label><div class="row" style="flex-wrap:nowrap"><input type="color" data-wst="cardBg" value="${w.cardBg||"#0b1120"}"><button class="ib" data-wclr="cardBg" title="الافتراضي">↺</button></div></div>
   ${rngS("cardBgOpacity","شفافية الخلفية",0,1,.05,w.cardBgOpacity??.9)}
   <div class="fld" style="margin:0"><label>لون الإطار</label><div class="row" style="flex-wrap:nowrap"><input type="color" data-wst="cardBorder" value="${w.cardBorder||"#2f7bff"}"><button class="ib" data-wclr="cardBorder">↺</button></div></div>
   ${rngS("cardBorderW","سماكة الإطار",0,8,1,w.cardBorderW??2)}${rngS("cardRadius","استدارة الزوايا (0–50)",0,50,1,w.cardRadius===""||w.cardRadius==null?26:w.cardRadius)}
   <div class="fld" style="margin:0"><label>لون اسم المستخدم</label><div class="row" style="flex-wrap:nowrap"><input type="color" data-wst="unColor" value="${w.unColor||"#ffffff"}"><button class="ib" data-wclr="unColor">↺</button></div></div>
   ${sty("font","الخط",FONTS,w.font)}${rngS("fontScale","حجم الخط",.5,1.8,.05,w.fontScale)}${rngS("logoScale","حجم الشعار",.5,1.6,.05,w.logoScale)}</div>
   <p class="mut small">العرض والارتفاع والموقع من «استوديو البث» (اسحب العنصر وغيّر حجمه). البطاقة تتكيّف تلقائياً مع البث العمودي والأفقي.</p></div>
   <div class="ttl">مكتبة التصاميم (${SOCIAL_DESIGNS.length}) — اضغط للتطبيق على «${esc(w.name)}»</div><div class="lib" id="slib">${SOCIAL_DESIGNS.map(d=>`<div class="libc ${w.design===d.id?"on":""}" data-sdesign="${d.id}"><div class="pv sdpv" data-sdpv="${d.id}" style="height:110px"></div><div class="meta"><b class="small">${esc(d.name)}</b><span class="tag">${SDG[d.g]}</span></div></div>`).join("")}</div>`
   :`<div class="card empty">أضف عنصر «الحسابات المتناوبة» للمشهد أولاً من تبويب «العناصر والروابط».<div style="margin-top:10px"><button class="btn pri sm" data-soc-addw="rotation">+ إضافة الحسابات المتناوبة</button></div></div>` }
 else if(t==="anim"){
  body=`<div class="ttl">حركات الدخول (${ENTER_OPTS.length}) — اضغط للمعاينة</div><div class="lib">${ENTER_OPTS.map(([k,n])=>`<div class="libc" data-anim-try="${k}" data-kind="in"><div class="pv animpv" data-animpv="in:${k}" style="height:96px;position:relative"></div><div class="meta"><b class="small">${esc(n)}</b><button class="btn sm" data-anim-set="enter" data-anim="${k}">اختيار</button></div></div>`).join("")}</div>
  <div class="ttl">حركات الخروج (${EXIT_OPTS.length})</div><div class="lib">${EXIT_OPTS.map(([k,n])=>`<div class="libc" data-anim-try="${k}" data-kind="out"><div class="pv animpv" data-animpv="out:${k}" style="height:96px;position:relative"></div><div class="meta"><b class="small">${esc(n)}</b><button class="btn sm" data-anim-set="exit" data-anim="${k}">اختيار</button></div></div>`).join("")}</div>
  <div class="ttl">حركات أثناء الظهور (${IDLE_OPTS.length-1}) — تعمل باستمرار، ويمكن دمج حركتين</div><div class="lib">${IDLE_OPTS.slice(1).map(([k,n])=>`<div class="libc" data-idle-set="${k}"><div class="pv animpv" data-animpv="idle:${k}" style="height:96px;position:relative"></div><div class="meta"><b class="small">${esc(n)}</b></div></div>`).join("")}</div>
  <p class="mut small">كل الحركات تستخدم transform وopacity وclip-path فقط لأداء خفيف داخل OBS، وتحترم إعداد «تقليل الحركة» في الجهاز.</p>` }
 else if(t==="display"){ const sw=l.widgets.filter(isSoc);
  body=`<div class="grid g2"><div class="card"><h3>أضف إلى المشهد «${esc(l.name)}»</h3><div class="grid" style="gap:8px">
   <button class="btn pri sm" data-soc-addw="rotation">🔄 الحسابات المتناوبة (حساب واحد في كل مرة)</button><button class="btn sm" data-soc-addw="single">🌐 حساب منفرد ثابت</button><button class="btn sm" data-soc-addw="ondemand">👆 العرض عند الطلب فقط</button>
   <button class="btn sm" data-soc-addw="bar">📜 شريط الحسابات المتحرك</button><button class="btn sm" data-soc-addw="panel-social">🗂️ عرض جميع حسابات التواصل</button><button class="btn sm" data-soc-addw="panel-game">🎮 عرض جميع حسابات الألعاب</button></div>
   <p class="mut small">«عرض جميع الحسابات» يظهر الحسابات كلها معاً عمداً. للتناوب استخدم «الحسابات المتناوبة».</p></div>
   <div class="card"><h3>عرض عند الطلب</h3><div class="row">${S.socials.accounts.filter(a=>a.enabled!==false).map(a=>`<button class="btn sm" data-soc-show="${a.id}">▶ ${esc(accountView(a).platform)}</button>`).join("")}</div><div class="fld" style="margin-top:10px"><label>مدة الظهور (ثانية)</label><input class="inp" type="number" id="showSecs" value="8" min="2" style="width:100px"></div><p class="mut small">يخرج الحساب الحالي أولاً، ثم يظهر المطلوب، ثم يكمل التناوب.</p></div></div>
  <div class="ttl">عناصر الحسابات في المشهد وروابطها</div><div class="grid g2">${sw.map(w=>`<div class="card"><h3><span>${TYPES[w.type].icon} ${esc(w.name)}</span><span class="tag">${dimTxt(Math.round(w.w*CV().w),Math.round(w.h*CV().h))}</span></h3><div class="row"><button class="btn sm pri" data-edit="${w.id}">تعديل في الاستوديو</button><button class="btn sm" data-copylink="${w.id}">🔗 رابط مستقل</button><button class="btn sm" data-preview="${w.id}">👁 معاينة</button></div></div>`).join("")||'<div class="empty">لا توجد عناصر حسابات في هذا المشهد</div>'}</div>
  <div class="ttl">روابط الحسابات المنفردة</div><div class="grid g3">${S.socials.accounts.map(a=>`<div class="card"><b>${esc(accountView(a).platform)}</b> <span class="mut small" dir="ltr">${esc(accountView(a).user)}</span><div class="row" style="margin-top:8px"><button class="btn sm" data-copy-acc="${a.id}">🔗 نسخ الرابط</button></div></div>`).join("")}</div>` }
 return head("حساباتي","أنت تختار متى وأين وكيف يظهر كل حساب",layoutPicker())+
  `<div class="row" style="margin-bottom:14px">${SOCTABS.map(x=>`<button class="btn sm ${t===x[0]?"on":""}" data-soctab="${x[0]}">${x[1]}</button>`).join("")}</div>`+body+testBar();
}
function sty(f,l,o,v){ return `<div class="fld" style="margin:0"><label>${l}</label><select class="inp" data-wst="${f}">${o.map(x=>`<option value="${x[0]}" ${String(v)===String(x[0])?"selected":""}>${x[1]}</option>`).join("")}</select></div>` }
function rngS(f,l,min,max,step,v){ return `<div class="fld" style="margin:0"><label><span>${l}</span><span>${v}</span></label><input type="range" min="${min}" max="${max}" step="${step}" value="${v}" data-wst="${f}"></div>` }
function swp(f,l,o){ const v=(rotW()?.sweep||{})[f]; return `<div class="fld" style="margin:0"><label>${l}</label><select class="inp" data-swp="${f}">${o.map(x=>`<option value="${x[0]}" ${v===x[0]?"selected":""}>${x[1]}</option>`).join("")}</select></div>` }
function swr(f,l,min,max,step){ const v=(rotW()?.sweep||{})[f]??SWEEP_DEFAULTS[f]; return `<div class="fld" style="margin:0"><label><span>${l}</span><span>${v}</span></label><input type="range" min="${min}" max="${max}" step="${step}" value="${v}" data-swp="${f}"></div>` }
/** يبني مسرحاً صغيراً لعنصر حساب (نفس View المستخدم في OBS) */
function miniStage(box,wcfg,src,cv={w:900,h:130}){ const stg=document.createElement("div"); stg.className="stage"; stg.style.cssText=`width:${cv.w}px;height:${cv.h}px;background:none`; const sc=Math.min(box.clientWidth/cv.w,box.clientHeight/cv.h); stg.style.transform=`scale(${sc})`; stg.style.left=(box.clientWidth-cv.w*sc)/2+"px"; stg.style.top=(box.clientHeight-cv.h*sc)/2+"px"; box.appendChild(stg);
 const v=new View(newWidget("social",{id:"pv_"+uid(),x:.03,y:.1,w:.94,h:.8,...wcfg}),cv,{globalFx:S.settings.fx,mute:true,data:src||SRC}); stg.appendChild(v.el); liveViews.add(v); return v }
/** معاينة التناوب المستقلة: نسخة محلية بسرعة قابلة للتغيير */
function pvSocials(){ const sp=S.pvSpeed||1, R0=S.socials.rotation; if(!S.pvRot) S.pvRot={...R0,running:true,pausedAt:0,startedAt:Date.now()};
 const r=S.pvRot; Object.assign(r,{showSec:R0.showSec/sp,enterMs:R0.enterMs/sp,exitMs:R0.exitMs/sp,gapMs:R0.gapMs/sp,enter:R0.enter,exit:R0.exit,order:R0.order,loop:true,filter:R0.filter,items:R0.items});
 return {...S.socials,rotation:r} }
function mountSocials(){
 const first=S.socials.accounts.find(a=>a.enabled!==false)||S.socials.accounts[0];
 document.querySelectorAll("[data-accpv]").forEach(b=>{ const a=accById(b.dataset.accpv); if(a) miniStage(b,{mode:"single",accountId:a.id,design:(a.style&&a.style.design)||(a.kind==="game"?"gamingHud":"b6o6Signature"),idle:["sweep"]}) });
 const rw=rotW()||newWidget("social",{mode:"rotation"});
 const rp=document.getElementById("rot-pv"); if(rp){ const sp=S.pvSpeed||1; miniStage(rp,{...rw,id:undefined,x:.03,y:.1,w:.94,h:.8,mode:"rotation",enterMs:S.socials.rotation.enterMs/sp,exitMs:S.socials.rotation.exitMs/sp},()=>({...SRC(),SO:pvSocials(),skew:0})) }
 const sp_=document.getElementById("style-pv"); if(sp_&&first) miniStage(sp_,{...rw,id:undefined,x:.03,y:.1,w:.94,h:.8,mode:"single",accountId:first.id,useAccStyle:false});
 document.querySelectorAll("[data-sdpv]").forEach(b=>{ if(first) miniStage(b,{mode:"single",accountId:first.id,design:b.dataset.sdpv,idle:[],useAccStyle:false,x:.04,y:.14,w:.92,h:.72},null,{w:600,h:150}) });
 document.querySelectorAll("[data-animpv]").forEach(b=>{ if(!first) return; const [kind,k]=b.dataset.animpv.split(":"); b._v=miniStage(b,{mode:"single",accountId:first.id,design:"b6o6Signature",idle:kind==="idle"?[k]:[],useAccStyle:false,x:.04,y:.14,w:.92,h:.72},null,{w:600,h:150}) });
 // سحب وإفلات لترتيب الحسابات
 const list=document.getElementById("rotList"); if(list){ let from=null;
  list.addEventListener("dragstart",e=>{ const it=e.target.closest("[data-ri]"); if(it){ from=+it.dataset.ri; e.dataTransfer.effectAllowed="move" } });
  list.addEventListener("dragover",e=>e.preventDefault());
  list.addEventListener("drop",e=>{ e.preventDefault(); const it=e.target.closest("[data-ri]"); if(from==null||!it) return; const to=+it.dataset.ri; reorderRot(from,to); from=null }) }
}
function rotItems(){ const R_=S.socials.rotation; if(!R_.items||!R_.items.length) R_.items=S.socials.accounts.filter(a=>a.enabled!==false).map(a=>({accountId:a.id,enabled:true})); return R_.items }
function reorderRot(from,to){ const it=rotItems(); if(from===to) return; const [x]=it.splice(from,1); it.splice(to,0,x); socSave(); renderPage(true) }
function replayAnim(kind,k){ const b=document.querySelector(`[data-animpv="${kind}:${k}"]`); if(!b||!b._v) return; const v=b._v, c=v.cur&&v.cur.el; if(!c) return;
 if(kind==="in"){ v.play(c,k,700,0,false) } else { const a=v.play(c,k,600,0,true); a.onfinish=()=>{ a.cancel(); v.play(c,"fade",300) } } }
function readImage(file){ return new Promise((res,rej)=>{ const fr=new FileReader(); fr.onload=()=>{ const img=new Image(); img.onload=()=>{ const s=Math.min(1,128/Math.max(img.width,img.height)); const c=document.createElement("canvas"); c.width=Math.max(1,Math.round(img.width*s)); c.height=Math.max(1,Math.round(img.height*s)); c.getContext("2d").drawImage(img,0,0,c.width,c.height); res(c.toDataURL("image/png")) }; img.onerror=rej; img.src=fr.result }; fr.onerror=rej; fr.readAsDataURL(file) }) }

function addSocialWidget(kind){ const cv=CV();
 const map={rotation:["social",{mode:"rotation",name:"الحسابات المتناوبة"},"bc"],ondemand:["social",{mode:"ondemand",name:"حساب عند الطلب"},"tc"],single:["social",{mode:"single",accountId:S.socials.accounts[0]?.id||"",name:"حساب منفرد"},"tl"],
  bar:["socialBar",{name:"شريط الحسابات"},"bc"],"panel-social":["socialPanel",{filter:"social",name:"جميع حسابات التواصل",cols:1,design:"glassCapsule"},"ml"],"panel-game":["socialPanel",{filter:"game",name:"جميع حسابات الألعاب",cols:1,design:"gamingHud"},"mr"]}[kind];
 const w=newWidget(map[0],{z:Math.max(0,...L().widgets.map(x=>x.z))+1,...map[1]}); if(cv.w>cv.h&&map[0]==="social"){ w.w=.3; w.h=.09 } applyPreset(w,map[2],cv); L().widgets.push(w); S.sel=w.id;
 if(kind==="rotation"&&!S.socials.rotation.running){ rotationRestart(S.socials,Date.now()+skew) }
 save(); pushLayout(); toast("تمت إضافة "+w.name); return w }
function setRotW(fn){ const ws=L().widgets.filter(w=>w.type==="social"); const t=rotW(); if(!t) return; fn(t); save(); pushLayout(); views.forEach(v=>{ if(v.w.id===t.id) v.apply(t) }); allViews().forEach(v=>isSoc(v.w)&&v.refresh(SRC())) }
function socClick(t,d){
 if(d.soctab){ S.socTab=d.soctab; renderPage(); return true }
 if(d.accAdd){ const a=newAccount(d.accAdd,d.accAdd==="game"?{platform:"valorant",fields:{riot:"B6O6",tag:"SA1"}}:{platform:"youtube",username:""}); S.socials.accounts.push(a); socSave(); renderPage(); return true }
 if(d.accDel){ ask("حذف هذا الحساب؟").then(ok=>{ if(!ok) return; S.socials.accounts=S.socials.accounts.filter(a=>a.id!==d.accDel); S.socials.rotation.items=(S.socials.rotation.items||[]).filter(i=>i.accountId!==d.accDel); socSave(); renderPage() }); return true }
 if(d.accDup){ const a=accById(d.accDup); const c=JSON.parse(JSON.stringify(a)); c.id="ac_"+uid(); S.socials.accounts.push(c); socSave(); renderPage(); return true }
 if(d.accClrimg){ const a=accById(d.accClrimg); a.logo=""; a.avatar=""; socSave(); renderPage(true); return true }
 if(d.socShow){ socialShow(d.socShow,+(document.getElementById("showSecs")?.value)||8); return true }
 if(d.socTry){ const a=S.socials.accounts.find(x=>x.platform===d.socTry); if(!a){ toast("أضف حساب "+(PLATFORMS[d.socTry]||GAMES[d.socTry]).name+" أولاً"); return true } socialShow(a.id,6); return true }
 if(t.hasAttribute("data-rot-try")){ rotationRestart(S.socials,Date.now()+skew); socSave(); toast("بدأت دورة التناوب"); return true }
 if(d.copyAcc){ copy(overlayURL(L(),null,d.copyAcc)); return true }
 if(d.animSet){ if(d.animSet==="enter") S.socials.rotation.enter=d.anim; else S.socials.rotation.exit=d.anim; const w=findW(S.sel); if(w&&isSoc(w)) w[d.animSet]=d.anim; L().widgets.filter(isSoc).forEach(x=>x[d.animSet]=d.anim); socSave(); toast("تم الاختيار: "+(ENTRANCES[d.anim]||EXITS[d.anim]).name); return true }
 if(d.animTry){ replayAnim(d.kind,d.animTry); return true }
 if(d.idleSet){ setRotW(w=>w.idle=[d.idleSet]); toast("الحركة المستمرة: "+IDLES[d.idleSet].name); return true }
 if(d.sdesign){ setRotW(w=>w.design=d.sdesign); renderPage(true); return true }
 if(d.wclr){ setRotW(w=>w[d.wclr]=""); renderPage(true); return true }
 if(d.rotRun){ const R_=S.socials.rotation; if(d.rotRun==="1") rotationRestart(S.socials,Date.now()+skew); else { R_.running=false; R_.pausedAt=0 } socSave(); renderPage(true); return true }
 if(d.rotAct){ const now=Date.now()+skew, X=S.socials; if(d.rotAct==="pause") rotationPause(X,now); if(d.rotAct==="resume") rotationResume(X,now); if(d.rotAct==="next") rotationJump(X,now,1); if(d.rotAct==="prev") rotationJump(X,now,-1); if(d.rotAct==="restart") rotationRestart(X,now); socSave(); renderPage(true); return true }
 if(d.pv){ const now=Date.now(), X=pvSocials(); if(d.pv==="pause") rotationPause(X,now); if(d.pv==="play") rotationResume(X,now); if(d.pv==="next") rotationJump(X,now,1); if(d.pv==="prev") rotationJump(X,now,-1); if(d.pv==="restart") rotationRestart(X,now); return true }
 if(d.socAddw){ addSocialWidget(d.socAddw); renderPage(); return true }
 return false }
function socInput(t,d,e){
 if(d.acf&&e.type==="change"||d.acf&&e.type==="input"&&t.tagName==="INPUT"&&t.type!=="checkbox"&&t.type!=="color"){ const a=accById(d.acc); if(!a) return true; const f=d.acf; const v=t.type==="checkbox"?t.checked:t.value;
  if(f.startsWith("f.")){ a.fields=a.fields||{}; a.fields[f.slice(2)]=v } else if(f==="platform"){ a.platform=v; if(a.kind==="game") a.fields={} } else a[f]=v;
  socSave(); if(e.type==="change"&&(f==="platform"||f==="enabled")) renderPage(true); return true }
 if(d.acst&&e.type==="change"){ const a=accById(d.acc); a.style=a.style||{}; if(d.acst==="idle") a.style.idle=t.value?[t.value]:[]; else a.style[d.acst]=t.value||undefined; socSave(); renderPage(true); return true }
 if(d.upload&&e.type==="change"&&t.files[0]){ readImage(t.files[0]).then(u=>{ accById(d.acc)[d.upload]=u; socSave(); renderPage(true); toast("تم رفع الصورة") }).catch(()=>toast("صورة غير صالحة")); return true }
 if(d.rot&&e.type==="change"){ const R_=S.socials.rotation, now=Date.now()+skew; const v=t.value;
  // نحافظ على الحساب الحالي عند تغيير المدد: نعيد البدء من نفس الحساب
  const cur=rotationState(S.socials,now);
  if(d.rot==="gapSec2") R_.gapMs=Math.max(0,+v*1000); else if(d.rot==="enterSec") R_.enterMs=Math.max(100,+v*1000); else if(d.rot==="exitSec") R_.exitMs=Math.max(100,+v*1000); else if(d.rot==="showSec") R_.showSec=Math.max(1,+v); else if(d.rot==="loop") R_.loop=v==="1"; else R_[d.rot]=v;
  if(cur&&["gapSec2","enterSec","exitSec","showSec"].includes(d.rot)){ const slots=rotationSlots(S.socials,cur.cycle); let off=0; for(let i=0;i<cur.index;i++) off+=slots[i].dur; R_.startedAt=now-off-slots[cur.index].enterMs; if(R_.pausedAt) R_.pausedAt=now }
  socSave(); renderPage(true); return true }
 if(d.riEn!==undefined&&e.type==="change"){ rotItems()[+d.riEn].enabled=t.checked; socSave(); return true }
 if(d.riShow!==undefined&&e.type==="change"){ const it=rotItems()[+d.riShow]; it.showSec=t.value===""?undefined:Math.max(1,+t.value); socSave(); return true }
 if(d.rw&&e.type==="change"){ setRotW(w=>{ if(d.rw==="idle0") w.idle=[t.value,...(w.idle||[]).slice(1)].filter(Boolean); else w[d.rw]=t.value }); return true }
 if(d.wst){ if(t.type==="range"&&e.type==="change") return true; if(t.tagName==="SELECT"&&e.type!=="change") return true; const v=t.value;
  setRotW(w=>{ if(d.wst==="idle0") w.idle=[v,(w.idle||[])[1]].filter(Boolean); else if(d.wst==="idle1") w.idle=[(w.idle||[])[0],v].filter(Boolean); else w[d.wst]=["idleSpeed","idleStrength","cardBgOpacity","cardBorderW","cardRadius","fontScale","logoScale"].includes(d.wst)?+v:v });
  const lab=t.closest(".fld")?.querySelector("label span:last-child"); if(lab&&t.type==="range") lab.textContent=v; return true }
 if(d.swp){ if(t.type==="range"&&e.type==="change") return true; if(t.tagName==="SELECT"&&e.type!=="change") return true; const v=t.type==="range"?+t.value:t.value; setRotW(w=>{ w.sweep=Object.assign({},SWEEP_DEFAULTS,w.sweep||{},{[d.swp]:v}) }); allViews().forEach(x=>{ if(isSoc(x.w)&&x.cur){ x.cur.sig=""; x.refresh(SRC()) } }); const lab=t.closest(".fld")?.querySelector("label span:last-child"); if(lab&&t.type==="range") lab.textContent=v; return true }
 if(t.id==="pvSpeed"&&e.type==="change"){ S.pvSpeed=+t.value; S.pvRot=null; renderPage(true); return true }
 return false }
/* ---- الاستوديو ---- */
function studioHTML(){ const l=L();
 return head("استوديو البث","اسحب أي عنصر لمكانه — المحاذاة الذكية تظهر تلقائياً، وتعديل عنصر لا يحرّك غيره",`<button class="btn sm" data-go="obs">🔗 روابط OBS</button>`)+
 `<div class="st-bar">${layoutPicker()}<button class="btn sm" data-lay="new">+ مشهد جديد</button><button class="btn sm" data-lay="dup">نسخ</button><button class="btn sm" data-lay="ren">إعادة تسمية</button><button class="btn sm dng" data-lay="del">حذف</button>
 <span style="width:12px"></span>${Object.entries(CANVASES).map(([k,c])=>`<button class="btn sm ${l.canvas===k?"on":""}" data-canvas="${k}">${c.label}</button>`).join("")}
 <span style="width:12px"></span><select class="inp" data-act="addW" style="width:auto"><option value="">+ إضافة عنصر…</option><option value="@rotation">🔄 الحسابات المتناوبة</option><option value="@single">🌐 حساب منفرد</option><option value="@panel-social">🗂️ عرض جميع الحسابات</option>${Object.entries(TYPES).filter(([k])=>k!=="social"&&k!=="socialPanel").map(([k,t])=>`<option value="${k}">${t.icon} ${t.label}</option>`).join("")}</select>
 <label class="row small" style="gap:6px"><input type="checkbox" data-act="snap" ${S.settings.snap!==false?"checked":""}> محاذاة ذكية</label></div>
 <div class="studio"><div class="card layers" id="layers"></div><div class="stagewrap" id="stagewrap"><div class="stage-outer" id="stageouter"><div class="stage ${S.settings.bg==="chk"?"chk":""}" id="stage"></div></div></div><div class="card" id="props"></div></div>`+testBar();
}
let stageScale=1;
function mountStudio(){
 const stage=document.getElementById("stage"), cv=CV();
 stage.style.width=cv.w+"px"; stage.style.height=cv.h+"px";
 views.clear();
 for(const w of L().widgets){ const v=new View(w,cv,{refW:cv.w,editor:true,sel:S.sel,globalFx:S.settings.fx,data:SRC}); views.set(w.id,v); stage.appendChild(v.el) }
 fitStage(); renderLayers(); renderProps();
 stage.addEventListener("pointerdown",onStageDown);
}
function fitStage(){
 const wrap=document.getElementById("stagewrap"), outer=document.getElementById("stageouter"), stage=document.getElementById("stage"); if(!wrap) return;
 const cv=CV(); const aw=wrap.clientWidth||600, ah=Math.max(380,innerHeight-260);
 stageScale=Math.min(aw/cv.w,ah/cv.h); stage.style.transform=`scale(${stageScale})`;
 outer.style.width=cv.w*stageScale+"px"; outer.style.height=cv.h*stageScale+"px";
}
addEventListener("resize",()=>{ if(S.page==="studio") fitStage() });
function refreshView(w){ const v=views.get(w.id); if(v){ v.opts.sel=S.sel; v.opts.globalFx=S.settings.fx; v.apply(w) } }
function select(id){ const prev=S.sel; S.sel=id; [prev,id].forEach(x=>{const w=L().widgets.find(y=>y.id===x); if(w) refreshView(w)}); renderLayers(); renderProps() }
function renderLayers(){
 const el=document.getElementById("layers"); if(!el) return;
 const ws_=[...L().widgets].sort((a,b)=>b.z-a.z);
 el.innerHTML=`<h3>الطبقات</h3>`+ws_.map(w=>`<div class="ly ${S.sel===w.id?"sel":""}" data-selw="${w.id}"><span>${TYPES[w.type].icon}</span><span class="nm">${esc(w.name)}</span><button class="ib ${w.visible?"":"off"}" data-tog="visible" data-wid="${w.id}" title="إظهار/إخفاء">👁</button><button class="ib ${w.locked?"":"off"}" data-tog="locked" data-wid="${w.id}" title="قفل">🔒</button></div>`).join("")||'<div class="mut small">لا عناصر</div>';
}
function renderProps(){
 const el=document.getElementById("props"); if(!el) return;
 const w=L().widgets.find(x=>x.id===S.sel);
 if(!w){ el.innerHTML='<h3>الخصائص</h3><div class="empty">اضغط على أي عنصر في الشاشة لتعديله بشكل مستقل</div>'; return }
 const t=TYPES[w.type], cv=CV(), ck=!!t.clock||w.type==="donGoal";
 const rng=(f,l,min,max,step,val,fmtv)=>`<div class="fld"><label><span>${l}</span><span id="v_${f}">${fmtv?fmtv(val):val}</span></label><input type="range" min="${min}" max="${max}" step="${step}" value="${val}" data-wf="${f}" data-wid="${w.id}"></div>`;
 const sel=(f,l,opts,val)=>`<div class="fld"><label>${l}</label><select class="inp" data-wf="${f}" data-wid="${w.id}">${opts.map(o=>`<option value="${o[0]}" ${String(val)===String(o[0])?"selected":""}>${o[1]}</option>`).join("")}</select></div>`;
 el.innerHTML=`<h3><span>${t.icon} ${esc(w.name)}</span><span class="tag" title="معرّف مستقل">${w.id}</span></h3>
 <div class="fld"><label>اسم العنصر</label><input class="inp" data-wf="name" data-wid="${w.id}" value="${esc(w.name)}"></div>
 ${w.type!=="timer"?`<div class="fld"><label>العنوان الظاهر</label><input class="inp" data-wf="title" data-wid="${w.id}" value="${esc(w.title)}"></div>`:""}
 ${w.type==="timer"?sel("timerId","المؤقت المعروض",R.C.timers.map(x=>[x.id,x.name]),w.timerId):""}
 ${sel("design","التصميم",designsOf(w).map(d=>[d.id,d.name]),w.design)}
 ${t.board?`<div class="grid g2" style="gap:8px">${sel("topN","المراكز",TOPNS.map(n=>[n,n===1?"الأول فقط":"أفضل "+n]),w.topN)}${sel("showTitle","العنوان",[["1","ظاهر"],["0","مخفي"]],w.showTitle?"1":"0")}</div>`:""}
 ${ck?`<div class="grid g2" style="gap:8px">${sel("showTitle","العنوان",[["1","ظاهر"],["0","مخفي"]],w.showTitle?"1":"0")}${sel("showSub","سطر الحالة",[["1","ظاهر"],["0","مخفي"]],w.showSub?"1":"0")}</div>${sel("font","شكل الأرقام والخط",FONTS,w.font)}`:""}
 ${w.type==="subathon"?sel("sound","صوت عند إضافة الوقت",[["1","مفعّل"],["0","متوقف"]],w.sound?"1":"0"):""}
 ${w.type==="gifts"?sel("sortBy","ترتيب الداعمين حسب",SORTS,w.sortBy):""}
 ${t.don?donPropsHTML(w,sel,rng):""}
 ${t.soc?`${w.type==="social"?sel("mode","طريقة العرض",[["rotation","تدوير تلقائي"],["single","حساب واحد"],["ondemand","عند الطلب فقط"]],w.mode):sel("filter","الحسابات",[["all","التواصل + الألعاب"],["social","التواصل فقط"],["game","الألعاب فقط"]],w.filter)}
  ${w.type==="social"&&w.mode==="single"?sel("accountId","الحساب",S.socials.accounts.map(a=>[a.id,accountView(a).platform+" "+accountView(a).user]),w.accountId)+`<div class="grid g2" style="gap:8px">${sel("repeat","تكرار الظهور",[["0","ظاهر دائماً"],["1","يظهر ويختفي"]],w.repeat?"1":"0")}${w.repeat?`<div class="fld"><label>ظهور / اختفاء (ث)</label><div class="row" style="flex-wrap:nowrap"><input class="inp" type="number" min="2" data-wf="showSec" data-wid="${w.id}" value="${w.showSec}"><input class="inp" type="number" min="1" data-wf="gapSec" data-wid="${w.id}" value="${w.gapSec}"></div></div>`:""}</div>`:""}
  ${w.type==="social"&&w.mode==="rotation"?`<div class="note small">التوقيت والحسابات المشاركة من «حساباتي ← التناوب والمعاينة». يظهر حساب واحد فقط في كل مرة.</div>`:""}
  ${w.type!=="socialBar"&&!(w.type==="social"&&w.mode==="rotation")?`<div class="grid g2" style="gap:8px">${sel("enter","حركة الدخول",ENTER_OPTS,w.enter)}${sel("exit","حركة الخروج",EXIT_OPTS,w.exit)}</div>${rng("enterMs","مدة الدخول",150,2500,50,w.enterMs,v=>v+"ms")}${rng("exitMs","مدة الخروج",150,2500,50,w.exitMs,v=>v+"ms")}`:w.type!=="socialBar"?"":`<div class="grid g2" style="gap:8px">${sel("dir","اتجاه الحركة",[["rtl","من اليمين لليسار"],["ltr","من اليسار لليمين"]],w.dir)}</div>${rng("speed","سرعة الحركة",20,400,10,w.speed,v=>v+" px/ث")}`}
  ${w.type==="socialPanel"?sel("cols","الأعمدة",[[1,"1"],[2,"2"],[3,"3"]],w.cols):""}
  <div class="grid g2" style="gap:8px">${sel("idle","الحركة المستمرة",IDLE_OPTS,(w.idle||[])[0]||"")}${sel("logoPos","مكان الشعار",[["auto","حسب التصميم"],["start","يمين"],["end","يسار"],["top","أعلى"]],w.logoPos)}</div>
  ${sel("useAccStyle","تصاميم الحسابات الخاصة",[["1","تُستخدم إن وُجدت"],["0","تصميم العنصر للجميع"]],w.useAccStyle!==false?"1":"0")}
  <div class="grid g3" style="gap:8px">${sel("showLogo","الشعار",[["1","ظاهر"],["0","مخفي"]],w.showLogo?"1":"0")}${sel("showPlatform","اسم المنصة",[["1","ظاهر"],["0","مخفي"]],w.showPlatform?"1":"0")}${sel("showUser","اسم المستخدم",[["1","ظاهر"],["0","مخفي"]],w.showUser?"1":"0")}</div>
  ${rng("logoScale","حجم الشعار",.5,1.6,.05,w.logoScale,v=>Math.round(v*100)+"%")}${sel("font","الخط",FONTS,w.font)}
  <div class="row" style="margin-bottom:10px"><button class="btn sm" data-tpl-save>💾 حفظ كقالب</button>${(S.socials.templates||[]).length?`<select class="inp" data-act="tplApply" style="width:auto"><option value="">تطبيق قالب…</option>${S.socials.templates.map((x,i)=>`<option value="${i}">${esc(x.name)}</option>`).join("")}</select>`:""}</div>`:""}
 ${w.type==="goal"?`<div class="fld"><label>الهدف (إعجابات)</label><input class="inp" type="number" min="1" data-wf="target" data-wid="${w.id}" value="${w.target}"></div>`:""}
 <div class="fld"><label>الموقع</label><div class="posgrid">${POS.map(p=>`<button data-pos="${p[0]}" class="${w.pos===p[0]?"on":""}">${p[1]}</button>`).join("")}</div></div>
 ${rng("w","العرض",.05,1,.005,w.w,v=>Math.round(v*cv.w)+"px")}${rng("h","الارتفاع",.02,1,.005,w.h,v=>Math.round(v*cv.h)+"px")}
 ${rng("fontScale","حجم النصوص",.5,1.8,.05,w.fontScale,v=>Math.round(v*100)+"%")}${t.board?rng("avatarScale","حجم الصور",.4,1.5,.05,w.avatarScale,v=>Math.round(v*100)+"%"):""}
 ${rng("gap","المسافات",0,40,1,w.gap)}${rng("opacity","الشفافية",.1,1,.05,w.opacity,v=>Math.round(v*100)+"%")}
 <div class="grid g2" style="gap:8px"><div class="fld"><label>لون التمييز</label><input type="color" data-wf="acc" data-wid="${w.id}" value="${w.acc||"#e8c46a"}"></div><div class="fld"><label>لون النص</label><input type="color" data-wf="tx" data-wid="${w.id}" value="${w.tx||"#ffffff"}"></div></div>
 <div class="grid g2" style="gap:8px">${sel("anim","حركة الدخول",[["slide","انزلاق"],["fade","تلاشي"],["zoom","تكبير"],["none","بدون"]],w.anim)}${sel("effects","المؤثرات",[["1","مفعّلة"],["0","متوقفة"]],w.effects?"1":"0")}</div>
 <div class="fld"><label>ترتيب الطبقات</label><div class="row"><button class="btn sm" data-z="front">⬆ للأمام</button><button class="btn sm" data-z="back">⬇ للخلف</button></div></div>
 <div class="row"><button class="btn sm ${w.visible?"":"on"}" data-tog="visible" data-wid="${w.id}">${w.visible?"👁 إخفاء":"👁 إظهار"}</button><button class="btn sm ${w.locked?"on":""}" data-tog="locked" data-wid="${w.id}">${w.locked?"🔓 فك القفل":"🔒 قفل المكان"}</button><button class="btn sm" data-dupw>نسخ</button><button class="btn sm dng" data-delw>حذف</button></div>`;
}
/** المحاذاة الذكية: حواف ومنتصف الشاشة والعناصر الأخرى */
function snapMove(w,cv){
 const thr=10/stageScale, X=w.x*cv.w, Y=w.y*cv.h, W=w.w*cv.w, Hh=w.h*cv.h;
 const xs=[0,cv.w/2,cv.w], ys=[0,cv.h/2,cv.h];
 for(const o of L().widgets){ if(o.id===w.id||!o.visible) continue; xs.push(o.x*cv.w,(o.x+o.w/2)*cv.w,(o.x+o.w)*cv.w); ys.push(o.y*cv.h,(o.y+o.h/2)*cv.h,(o.y+o.h)*cv.h) }
 const best=(pos,size,cands)=>{ let b=null; for(const off of [0,size/2,size]) for(const c of cands){ const d=c-(pos+off); if(Math.abs(d)<=thr&&(!b||Math.abs(d)<Math.abs(b.d))) b={d,line:c} } return b };
 const bx=best(X,W,xs), by=best(Y,Hh,ys);
 if(bx) w.x=clamp((X+bx.d)/cv.w,0,1-w.w); if(by) w.y=clamp((Y+by.d)/cv.h,0,1-w.h);
 return {gx:bx?bx.line:null,gy:by?by.line:null};
}
function showGuides(g){ const stage=document.getElementById("stage"); stage.querySelectorAll(".guide").forEach(e=>e.remove()); if(!g) return;
 if(g.gx!=null){const e=document.createElement("div");e.className="guide v";e.style.left=g.gx-1+"px";stage.appendChild(e)}
 if(g.gy!=null){const e=document.createElement("div");e.className="guide h";e.style.top=g.gy-1+"px";stage.appendChild(e)} }
function onStageDown(e){
 const wdEl=e.target.closest(".wd"); if(!wdEl){ if(S.sel) select(null); return }
 const w=L().widgets.find(x=>x.id===wdEl.dataset.id); if(!w) return;
 if(S.sel!==w.id) select(w.id);
 if(w.locked) return;
 e.preventDefault();
 const resize=e.target.classList.contains("rh");
 const d={sx:e.clientX,sy:e.clientY,ox:w.x,oy:w.y,ow:w.w,oh:w.h};
 const move=ev=>{ const cv=CV(); const dx=(ev.clientX-d.sx)/stageScale/cv.w, dy=(ev.clientY-d.sy)/stageScale/cv.h;
  const s=v=>Math.round(v*1000)/1000;
  if(resize){ w.w=s(clamp(d.ow+dx,.05,1-w.x)); w.h=s(clamp(d.oh+dy,.02,1-w.y)) }
  else { w.x=s(clamp(d.ox+dx,0,1-w.w)); w.y=s(clamp(d.oy+dy,0,1-w.h)); w.pos="custom"; showGuides(S.settings.snap!==false&&!ev.altKey?snapMove(w,cv):null) }
  refreshView(w) };
 const up=()=>{ removeEventListener("pointermove",move); removeEventListener("pointerup",up); showGuides(null); save(); pushLayout(); renderProps() };
 addEventListener("pointermove",move); addEventListener("pointerup",up);
}
addEventListener("keydown",e=>{ if(S.page!=="studio"||!S.sel||/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return;
 const w=L().widgets.find(x=>x.id===S.sel); if(!w||w.locked) return;
 const st_=e.shiftKey?.02:.004; const m={ArrowLeft:[-st_,0],ArrowRight:[st_,0],ArrowUp:[0,-st_],ArrowDown:[0,st_]}[e.key]; if(!m) return; e.preventDefault();
 w.x=clamp(w.x+m[0],0,1-w.w); w.y=clamp(w.y+m[1],0,1-w.h); w.pos="custom"; refreshView(w); save(); pushLayout() });

/* ---- المكتبة ---- */
function sample(type){ const n=["نورة","فهد","سارة","عبدالله","ريم","خالد","لمى","سلطان","جود","تركي"]; const base=type==="gifts"?[52000,31000,18500,9900,4200,2600,1500,900,400,120]:[98000,64000,41000,22000,15000,9000,5000,2200,900,300]; return n.map((x,i)=>({k:"s"+i,name:x,av:avatar(x),v:base[i]})) }
function mountLibrary(){
 const l=L(), tab=S.libTab;
 const pool=l.widgets.filter(w=>libPool(w,tab));
 const tgt=pool.find(w=>w.id===S.libTarget)||pool[0];
 document.querySelectorAll("[data-pv]").forEach(box=>{
  if(tab==="socials"){ const cv={w:600,h:360}; const acc=S.socials.accounts[0]; const card=box.dataset.pv==="card";
   const w=newWidget("social",{id:"pv_"+box.dataset.pv,design:box.dataset.pv,mode:"single",accountId:(tgt&&tgt.accountId)||(acc&&acc.id)||"",x:card?.3:.06,y:card?.18:.36,w:card?.4:.88,h:card?.64:.28,enter:tgt?tgt.enter:"slideRight"});
   const stg=document.createElement("div"); stg.className="stage"; stg.style.cssText=`width:${cv.w}px;height:${cv.h}px;background:none`; const sc=Math.min(box.clientWidth/cv.w,box.clientHeight/cv.h); stg.style.transform=`scale(${sc})`; stg.style.left=(box.clientWidth-cv.w*sc)/2+"px"; stg.style.top=(box.clientHeight-cv.h*sc)/2+"px"; box.appendChild(stg);
   const v=new View(w,cv,{globalFx:S.settings.fx,mute:true,data:SRC}); stg.appendChild(v.el); liveViews.add(v); return }
  const clock=tab==="clocks";
  const cv=clock?{w:600,h:360}:{w:540,h:680};
  const type=clock?(tgt?tgt.type:"subathon"):(tgt?tgt.type:"gifts");
  const w=newWidget(type,{id:"pv_"+box.dataset.pv,design:box.dataset.pv,x:.06,y:clock?.2:.06,w:.88,h:clock?.6:.88,topN:tgt&&!clock?Math.min(tgt.topN,10):5,title:tgt?tgt.title:TYPES[type].title,acc:tgt?tgt.acc:"",timerId:tgt?tgt.timerId:"stream",font:tgt?tgt.font:"default"});
  const stg=document.createElement("div"); stg.className="stage"; stg.style.width=cv.w+"px"; stg.style.height=cv.h+"px";
  const s=Math.min(box.clientWidth/cv.w,box.clientHeight/cv.h); stg.style.transform=`scale(${s})`; stg.style.left=(box.clientWidth-cv.w*s)/2+"px"; stg.style.top=(box.clientHeight-cv.h*s)/2+"px";
  box.appendChild(stg);
  const v=new View(w,cv,{globalFx:S.settings.fx,mute:true,data:clock?SRC:undefined}); stg.appendChild(v.el);
  if(clock) liveViews.add(v); else v.refresh({preview:sample(type==="likes"?"likes":"gifts")},true);
 });
}

/* ---- الأحداث ---- */
function findW(id){return L().widgets.find(w=>w.id===id)}
function changed(w,full){ save(); pushLayout(); if(S.page==="studio"){ refreshView(w); if(full){renderProps();renderLayers()} } else renderPage(true) }
function addWidget(type,extra={}){ const cv=CV(); const w=newWidget(type,{z:Math.max(0,...L().widgets.map(x=>x.z))+1,...extra}); applyPreset(w,isClock(w)?"tc":"mr",cv); L().widgets.push(w); S.sel=w.id; save(); pushLayout(); toast("تمت إضافة "+TYPES[type].label); return w }
function setPath(obj,path,v){ const k=path.split("."); let o=obj; for(let i=0;i<k.length-1;i++) o=o[k[i]]=o[k[i]]||{}; o[k[k.length-1]]=v }
function saConfig(cfg){ clockOp("subathon","config",{config:cfg}) }
function onClick(e){
 const t=e.target.closest("button,[data-pick],[data-selw],[data-anim-try],[data-sdesign],[data-idle-set],a"); if(!t) return;
 const d=t.dataset;
 if(socClick(t,d)) return;
 if(donClick(t,d)) return;
 if(d.libtab){ S.libTab=d.libtab; S.libTarget=null; if(!d.go) return renderPage() }
 if(d.go) return go(d.go);
 if(d.sim){ const sc=document.getElementById("simScope")?.value||"likes"; S.scope=sc; if(d.sim==="shuffle"){ if(sc==="all"||sc==="follows") return toast("اختر قائمة ترتيب واحدة"); return SIM.shuffle(sc) } if(d.sim==="reset") return SIM.reset(sc); return SIM[d.sim]() }
 if(d.saOp) return clockOp("subathon",d.saOp);
 if(d.saAdd) return clockOp("subathon","add",{ms:+d.saAdd,source:"manual"});
 if(d.saCustom){ const m=+document.getElementById("saCustom").value||0; if(m>0) clockOp("subathon","add",{ms:m*MIN*(+d.saCustom),source:"manual"}); return }
 if(t.hasAttribute("data-gadd")){ const tb=[...R.C.subathon.rules.gifts.table,{giftId:null,name:"هدية جديدة",sec:10}]; saConfig({rules:{gifts:{table:tb}}}); return setTimeout(()=>renderPage(true),50) }
 if(d.gdel!==undefined){ const tb=R.C.subathon.rules.gifts.table.filter((_,i)=>i!=+d.gdel); saConfig({rules:{gifts:{table:tb}}}); return setTimeout(()=>renderPage(true),50) }
 if(d.gcat){ const g=S.catalog.find(x=>String(x.id)===d.gcat); const tb=R.C.subathon.rules.gifts.table; if(tb.find(r=>String(r.giftId)===d.gcat)) return toast("موجودة في الجدول"); saConfig({rules:{gifts:{table:[...tb,{giftId:g.id,name:g.name,sec:Math.max(1,Math.round(g.diamonds/2))}]}}}); return setTimeout(()=>renderPage(true),50) }
 if(d.tm&&d.tmop) return clockOp(d.tm,d.tmop);
 if(d.tm&&d.tmadd) return clockOp(d.tm,"add",{ms:+d.tmadd});
 if(t.hasAttribute("data-tm-create")){ const kind=document.getElementById("tmKind").value, name=document.getElementById("tmName").value.trim()||TIMER_KINDS[kind].label, mins=Math.max(1,+document.getElementById("tmMin").value||10);
  clockOp("timers","create",{kind,config:{name,prefix:kind==="break"?"راجع بعد":name,durationMs:mins*MIN,remainingMs:mins*MIN}}); return setTimeout(()=>renderPage(),50) }
 if(d.tmDel){ return ask("حذف هذا المؤقت؟").then(ok=>{ if(ok){ clockOp("timers","delete",{id:d.tmDel}); setTimeout(()=>renderPage(),50) } }) }
 if(d.tmAddW){ addWidget("timer",{timerId:d.tmAddW,design:"glass"}); return renderPage() }
 if(d.add){ addWidget(d.add,t.hasAttribute("data-top1")?{topN:1,title:"أكبر داعم",name:"أكبر داعم",design:"podium",w:.32,h:.18}:{}); return renderPage() }
 if(d.edit){ S.sel=d.edit; return go("studio") }
 if(d.lib){ const w=findW(d.lib); S.libTab=({clock:"clocks",soc:"socials",board:"boards"})[dKind(w)]; S.libTarget=d.lib; return go("library") }
 if(d.pick){ const l=L(); const pool=l.widgets.filter(w=>libPool(w,S.libTab)); const tgt=pool.find(w=>w.id===S.libTarget)||pool[0]; if(!tgt) return toast("أضف عنصراً أولاً"); tgt.design=d.pick; save(); pushLayout(); toast(`«${wdname(tgt)}» ← ${tgt.name} فقط`); return renderPage() }
 if(d.copylink) return copy(overlayURL(L(),d.copylink));
 if(t.hasAttribute("data-copyall")) return copy(overlayURL(L()));
 if(d.selw&&!d.tog) return select(d.selw);
 if(d.tog){ e.stopPropagation(); const w=findW(d.wid); w[d.tog]=!w[d.tog]; return changed(w,true) }
 if(d.pos){ const w=findW(S.sel); if(!w) return; applyPreset(w,d.pos,CV()); return changed(w,true) }
 if(d.z){ const w=findW(S.sel); const zs=L().widgets.map(x=>x.z); w.z=d.z==="front"?Math.max(...zs)+1:Math.min(...zs)-1; if(w.z<0){L().widgets.forEach(x=>x.z+=1-w.z)} L().widgets.forEach(refreshView); return changed(w,true) }
 if(t.hasAttribute("data-tpl-save")){ const w=findW(S.sel); return ask("اسم القالب","قالبي "+((S.socials.templates||[]).length+1)).then(n=>{ if(!n) return; const keys=["design","enter","exit","enterMs","exitMs","delayMs","showLogo","showPlatform","showUser","logoScale","font","acc","tx","opacity","fontScale","speed","dir"]; const o={}; keys.forEach(k=>o[k]=w[k]); (S.socials.templates=S.socials.templates||[]).push({name:n,style:o}); socSave(); renderProps(); toast("تم حفظ القالب") }) }
 if(t.hasAttribute("data-dupw")){ const w=findW(S.sel); const c={...w,id:"w_"+uid(),name:w.name+" (نسخة)",x:clamp(w.x+.03,0,1-w.w),y:clamp(w.y+.03,0,1-w.h),z:w.z+1,pos:"custom"}; L().widgets.push(c); S.sel=c.id; save(); pushLayout(); return renderPage() }
 if(t.hasAttribute("data-delw")){ return ask("حذف هذا العنصر؟").then(ok=>{ if(!ok) return; const l=L(); l.widgets=l.widgets.filter(x=>x.id!==S.sel); S.sel=null; save(); pushLayout(); renderPage() }) }
 if(d.canvas){ L().canvas=d.canvas; save(); pushLayout(); return renderPage() }
 if(d.lay){ const l=L(); const done=()=>{S.sel=null; save(); renderPage()};
  if(d.lay==="new") return ask("اسم المشهد الجديد","مشهد جديد").then(n=>{ if(!n) return; const nl={id:"l_"+uid(),name:n,canvas:l.canvas,widgets:[]}; S.layouts.push(nl); S.active=nl.id; done() });
  if(d.lay==="dup"){ const nl=JSON.parse(JSON.stringify(l)); nl.id="l_"+uid(); nl.name=l.name+" (نسخة)"; nl.widgets.forEach(w=>w.id="w_"+uid()); S.layouts.push(nl); S.active=nl.id; return done() }
  if(d.lay==="ren") return ask("الاسم الجديد",l.name).then(n=>{ if(!n) return; l.name=n; done() });
  if(d.lay==="del"){ if(S.layouts.length<2) return toast("لا بد من مشهد واحد على الأقل"); return ask("حذف «"+l.name+"»؟").then(ok=>{ if(!ok) return; S.layouts=S.layouts.filter(x=>x.id!==l.id); S.active=S.layouts[0].id; done() }) } }
 if(t.hasAttribute("data-connect")){ S.settings.wsUrl=S.settings.wsUrl.trim(); save(); startWS(); return }
 if(t.hasAttribute("data-tiktok")){ if(!wsReady) return toast("اتصل بخادم المنصة أولاً — ربط TikTok يتم من الخادم"); if(!S.settings.tiktok) return toast("اكتب اسم المستخدم"); ws.send(JSON.stringify({t:"tiktok",room:S.settings.room,username:S.settings.tiktok.replace(/^@/,"")})); return }
 if(t.hasAttribute("data-tiktok-stop")){ if(wsReady) ws.send(JSON.stringify({t:"tiktok-stop",room:S.settings.room})); return }
 if(t.hasAttribute("data-logout")&&CFG) return CFG.logout();
 if(t.hasAttribute("data-disconnect")){ S.wantWS=false; if(wsReady) ws.send(JSON.stringify({t:"tiktok-stop",room:S.settings.room})); try{ if(ws){ ws.onclose=null; ws.close() } }catch(_){} ws=null; wsReady=false; liveStatus={live:false,text:"وضع التجربة المحلي — غير متصل بـ TikTok"}; setConn(); return renderPage(true) }
 if(t.hasAttribute("data-export")){ copy(JSON.stringify({layouts:S.layouts,settings:{...S.settings,key:""},profile:S.profile})); return }
 if(t.hasAttribute("data-wipe")){ return ask("سيتم حذف التخطيطات والبيانات من هذا المتصفح").then(ok=>{ if(!ok) return; try{["arsh.app","arsh.room"].forEach(k=>localStorage.removeItem(k))}catch(_){} location.reload() }) }
 if(d.preview!==undefined) return previewOverlay(d.preview||null);
}
function modal(html){ const m=document.createElement("div"); m.className="modal"; m.innerHTML=`<div class="mbox">${html}</div>`; document.body.appendChild(m); return m }
function ask(msg,def){ return new Promise(res=>{ const m=modal(`<p>${esc(msg)}</p>${def!==undefined?`<input class="inp" id="askv" value="${esc(def)}">`:""}<div class="row" style="margin-top:12px"><button class="btn pri sm" data-ok>تأكيد</button><button class="btn sm" data-no>إلغاء</button></div>`); const inp=m.querySelector("#askv"); if(inp){inp.focus();inp.select()}
 m.onclick=e=>{ if(e.target.closest("[data-ok]")){ const v=inp?inp.value.trim():true; m.remove(); res(v||null) } else if(e.target.closest("[data-no]")||e.target===m){ m.remove(); res(null) } } }) }
function previewOverlay(only){
 const l=L(), base=CV(); let cv=base, list=l.widgets;
 if(only){ const w=l.widgets.find(x=>x.id===only); cv={w:Math.round(w.w*base.w),h:Math.round(w.h*base.h)}; list=[{...w,x:0,y:0,w:1,h:1}] }
 const s=Math.min(innerWidth*.9/cv.w,(innerHeight*.9-110)/cv.h);
 const m=modal(`<div class="row" style="justify-content:space-between;margin-bottom:10px"><b>معاينة ${only?"الرابط المستقل":"الرابط الشامل"} (${cv.w}×${cv.h})</b><button class="btn sm" data-no>إغلاق</button></div><div class="pvbox" style="width:${cv.w*s}px;height:${cv.h*s}px"><div class="stage" style="background:none;width:${cv.w}px;height:${cv.h}px;transform:scale(${s})"></div></div><div class="row" style="margin-top:10px;justify-content:center"><button class="btn sm" data-sim="like1000">❤️ +1000</button><button class="btn sm" data-sim="gift">🎁 هدية</button><button class="btn sm" data-sim="biggift">🦁 هدية كبيرة</button><button class="btn sm" data-sim="saAdd">⏳ +5د</button></div>`);
 const stg=m.querySelector(".stage"), mine=[];
 for(const w of list){ const v=new View(w,cv,{data:SRC,refW:base.w,globalFx:S.settings.fx,mute:true}); stg.appendChild(v.el); v.el.classList.add("w-in"); liveViews.add(v); mine.push(v) }
 m.onclick=e=>{ const b=e.target.closest("[data-sim]"); if(b) return SIM[b.dataset.sim](); if(e.target.closest("[data-no]")||e.target===m){ mine.forEach(v=>liveViews.delete(v)); m.remove() } };
}
function onInput(e){
 const t=e.target, d=t.dataset;
 if(socInput(t,d,e)) return;
 if(donInput(t,d,e)) return;
 if(d.act==="pickLayout"&&e.type==="change"){ S.active=t.value; S.sel=null; save(); return renderPage() }
 if(d.act==="addW"&&e.type==="change"&&t.value){ if(t.value.startsWith("@")) addSocialWidget(t.value.slice(1)); else addWidget(t.value); t.value=""; return renderPage() }
 if(d.act==="libTarget"&&e.type==="change"){ S.libTarget=t.value; return renderPage() }
 if(d.act==="tplApply"&&e.type==="change"&&t.value!==""){ const w=findW(S.sel); Object.assign(w,S.socials.templates[+t.value].style); save(); pushLayout(); refreshView(w); renderProps(); return }
 if(d.act==="snap"&&e.type==="change"){ S.settings.snap=t.checked; return save() }
 if(d.sa&&e.type==="change"){ // إعدادات السبثون → أمر config عبر نفس المحرك
  const k=d.sa; let v=t.type==="checkbox"?t.checked:t.value; const cfg={};
  if(k==="initialMin") cfg.initialMs=Math.max(1,+v)*MIN; else if(k==="minMin") cfg.minMs=Math.max(0,+v)*MIN; else if(k==="maxMin") cfg.maxMs=Math.max(0,+v)*MIN; else if(k==="maxTotalMin") cfg.maxTotalMs=Math.max(0,+v)*MIN;
  else if(k==="pauseOnDisconnect"||k==="countWhilePaused") cfg[k]=v==="1";
  else if(k==="scheduledAt") cfg.scheduledAt=v?new Date(v).getTime():null;
  else if(k.startsWith("rules.")){ if(t.type==="number") v=+v; setPath(cfg,k,v) } else cfg[k]=v;
  saConfig(cfg); return setTimeout(()=>renderPage(true),60) }
 if(d.gr!==undefined&&e.type==="change"){ const tb=R.C.subathon.rules.gifts.table.map(r=>({...r})); const r=tb[+d.gr]; let v=t.value.trim();
  if(d.gf==="giftId") r.giftId=v===""?null:(isNaN(+v)?v:+v); else if(d.gf==="name") r.name=v; else r[d.gf]=Math.max(0,+v||0);
  saConfig({rules:{gifts:{table:tb}}}); return }
 if(d.tmc&&e.type==="change"){ const cfg={}; if(d.tmc==="durationMin") cfg.durationMs=Math.max(1,+t.value)*MIN; else if(d.tmc==="autoLive") cfg.autoLive=t.value==="1"; else cfg[d.tmc]=t.value; clockOp(d.tmId,"config",{config:cfg}); return }
 if(d.wf){ const w=findW(d.wid); if(!w) return; const f=d.wf; let v=t.type==="checkbox"?t.checked:t.value;
  if(["w","h","fontScale","avatarScale","gap","opacity","topN","target","enterMs","exitMs","delayMs","speed","cols","logoScale","showSec","gapSec"].includes(f)) v=+v;
  if(["showTitle","effects","showSub","sound","repeat","showLogo","showPlatform","showUser","hideAnon","showMessage","useAccStyle"].includes(f)&&t.type!=="checkbox") v=v==="1";
  if(f==="idle"){ v=[v,...((findW(d.wid)||{}).idle||[]).slice(1)].filter(Boolean) }
  if(t.type==="range"&&e.type==="change") return;
  if((t.tagName==="SELECT"||t.type==="number"||t.type==="checkbox")&&e.type==="input") return;
  w[f]=v;
  if(f==="w") w.x=clamp(w.x,0,1-w.w); if(f==="h") w.y=clamp(w.y,0,1-w.h);
  if((f==="w"||f==="h")&&w.pos!=="custom") applyPreset(w,w.pos,CV());
  const lab=document.getElementById("v_"+f); if(lab){ const cv=CV(); lab.textContent=f==="w"?Math.round(v*cv.w)+"px":f==="h"?Math.round(v*cv.h)+"px":["fontScale","avatarScale","opacity","logoScale"].includes(f)?Math.round(v*100)+"%":["enterMs","exitMs","delayMs"].includes(f)?v+"ms":f==="speed"?v+" px/ث":v }
  save(); pushLayout();
  if(S.page==="studio"){ refreshView(w); if(f==="name") renderLayers(); if(["design","topN","sortBy","showTitle","effects","timerId","mode","repeat","filter","order"].includes(f)) renderProps() }
  else if(t.tagName==="SELECT"||e.type==="change") renderPage(true);
  return }
 if(d.set&&e.type==="change"){ let v=t.value; if(d.set==="fx") v=v==="1"; if(d.set==="bigGift") v=+v; S.settings[d.set]=v; save(); return }
 if(d.prof&&e.type==="change"){ S.profile[d.prof]=t.value; save(); return renderPage() }
}
function setConn(){ [["cdot","ctext"]].forEach(([a,b])=>{const dd=document.getElementById(a),tt=document.getElementById(b); if(dd) dd.classList.toggle("ok",wsReady&&liveStatus.live); if(tt) tt.textContent=!wsReady?"وضع التجربة (بدون خادم)":liveStatus.live?"متصل ببث TikTok":"متصل بالخادم"}) }
function startWS(){ if(!S.settings.wsUrl) return toast("اكتب عنوان الخادم أولاً");
 S.wantWS=true; let n=0;
 const go=()=>connectWS(S.settings.wsUrl,S.settings.room,S.settings.key,m=>receive(m,false),(ok,err)=>{ setConn(); if(ok){ n=0; toast("تم الاتصال بالخادم"); pushLayout(); if(S.page==="live") renderPage(true) } else { if(err) toast(err); if(S.wantWS) setTimeout(()=>{ if(S.wantWS&&!wsReady) go() },Math.min(15000,1000*++n)) } });
 go() }

/* ================= التشغيل ================= */
(function(){
 const h=location.hash;
 if(h.startsWith("#/overlay")){ bootOverlay(new URLSearchParams(h.split("?")[1]||"")); return }
 shell(); renderPage();
 if(S.settings.wsUrl) startWS();
 window.__arsh={S,R:()=>R,send,L,SIM,clockOp};
})();
</script>
</body>
</html>
