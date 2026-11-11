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
function loadRoom(){ const r=newRoom(); const d=ls("arsh.room"); if(d&&d.D&&d.C){ r.D=d.D; r.H=d.H||[]; r.C=d.C; r.logs=d.logs||[]; if(d.DN) r.DN=d.DN; if(d.CHAT) r.CHAT=d.CHAT } migrateRules(r.C.subathon); return r }

/* ================= وضع الرابط (OBS / TikTok LIVE Studio) ================= */
function bootOverlay(q){
 document.body.className="ov";
 let L; try{L=b64d(q.get("d"))}catch(e){document.body.innerHTML="<p style='color:#fff'>رابط غير صالح</p>";return}
 // رابط حساب مستقل: يعرض حساباً واحداً بلا تخطيط
 if(q.get("acc")){ const w=newWidget("social",{id:"acc_"+q.get("acc"),mode:"single",accountId:q.get("acc"),design:q.get("ds")||"elite",x:0,y:0,w:1,h:1}); L={id:L.id,name:"acc",canvas:"acc",widgets:[w],socials:L.socials} }
 L.widgets.forEach(migrateWidget);
 try{ const m={}; for(const a of ls("b6o6.alerts")||[]) m[a.id]={id:a.id,name:a.name,kind:a.kind,event:a.event,durationSec:a.durationSec,config:a.config,mediaUrl:a.mediaData||"",audioUrl:a.audioData||""}; for(const d of FA_DESIGNS) m["tpl:"+d.id]=alOfficialDef("tpl:"+d.id,d.name); aboxSetDefs(m) }catch(e){}
 const only=q.get("only"), room=q.get("room")||"", wsUrl=q.get("ws")||"", bigT=+q.get("big")||1000;
 const PM=q.get("pm")||(q.get("lp")==="1"?"perf":"hq"); document.body.classList.add("pm-"+PM);
 const R=loadRoom(); let skew=0;
 const src=()=>({D:R.D,H:R.H,C:R.C,skew,SO:L.socials,DN:R.DN,DC:L.donCfg,CHAT:R.CHAT});
 const root=document.getElementById("root");
 const stage=document.createElement("div"); stage.className="stage"; root.appendChild(stage);
 const views=new Map(); let cv;
 function layout(){
  const base=L.canvas==="acc"?{w:900,h:130}:canvasOf(L); let list=L.widgets;
  if(only){ const w=L.widgets.find(x=>x.id===only); if(!w){stage.innerHTML="";return} cv={w:Math.round(w.w*base.w),h:Math.round(w.h*base.h)}; list=[{...w,x:0,y:0,w:1,h:1}] } else cv=base;
  stage.style.width=cv.w+"px"; stage.style.height=cv.h+"px";
  stage.style.transform=`scale(${Math.min(innerWidth/cv.w,innerHeight/cv.h)})`;
  const seen=new Set();
  for(const w of list){ seen.add(w.id); let v=views.get(w.id); if(v){v.cv=cv;v.apply(w)} else { v=new View(w,cv,{data:src,refW:base.w,lowPerf:PM==="perf"}); views.set(w.id,v); stage.appendChild(v.el); v.el.classList.add("w-in") } }
  for(const [id,v] of views) if(!seen.has(id)){v.el.remove();views.delete(id)}
 }
 function onMsg(m){
  if(m.t==="snapshot"){ if(m.BS) S.botStats=m.BS; R.D=m.D; R.H=m.H||[]; R.C=m.C; if(m.DN) R.DN=m.DN; skew=(m.now||Date.now())-Date.now() }
  else if(m.t==="event"){ if(m.ev.type==="gift"&&m.ev.big===undefined) m.ev.big=m.ev.value>=bigT; if(m.applied!==true){ applyEvent(R.D,R.H,m.ev); applyDonation(R.DN,m.ev); R.C.tops=R.C.tops||{}; topsOnEvent(R.C.tops,m.ev,Date.now(),180) } }
  else if(m.t==="clock"){ R.C=m.C; if(m.now) skew=m.now-Date.now() }
  else if(m.t==="layout"){ if(m.layout&&L.canvas==="acc"){ L.socials=m.layout.socials||L.socials; L.donCfg=m.layout.donCfg||L.donCfg; deliver(views.values(),{t:"snapshot"},src()); return } if(m.layout&&m.layout.id===L.id){ L=m.layout; L.widgets.forEach(migrateWidget); layout(); deliver(views.values(),{t:"snapshot"},src()) } return }
  if(m.t==="bot"&&q.get("voice")==="1") for(const it of m.items||[]) if(it.say) vpPush(it);
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
const S={layouts:st.layouts||defaultLayouts(),active:st.active,settings:Object.assign({fx:true,bigGift:1000,wsUrl:"",room:"",key:"",tiktok:"",bg:"stream"},st.settings||{}),profile:Object.assign({name:"صانع المحتوى",plan:"تجريبي"},st.profile||{}),page:"home",sel:null,libTab:"boards",scope:"likes"};
window.__arshPM=S.settings.perfMode||"hq";
S.layouts.forEach(l=>l.widgets.forEach(migrateWidget));
S.providers=CFG?(CFG.providers||{}):{};
S.donCfg=Object.assign(defaultDonCfg(),(CFG?CFG.donCfg:st.donCfg)||{}); S.donTab=S.donTab||"overview";
S.bots=mergeBots((CFG?CFG.bots:st.bots)||null); S.botTab=S.botTab||"status"; S.botFeed=[]; S.botStats=null;
S.socials=(CFG?CFG.socials:st.socials)||defaultSocials(); S.socials.rotation=migrateRotation(S.socials.rotation); if(!S.socials.rotation.startedAt) S.socials.rotation.startedAt=Date.now(); S.socials.accounts=S.socials.accounts||[]; S.socTab=S.socTab||"accounts";
if(!S.layouts.find(l=>l.id===S.active)) S.active=S.layouts[0].id;
if(!S.settings.room) S.settings.room="room_"+uid();
if(CFG){ Object.assign(S.settings,{wsUrl:CFG.wsUrl,room:CFG.room,key:CFG.key}) }
let R=loadRoom(), skew=0, liveStatus={live:false,text:"وضع التجربة المحلي — غير متصل بـ TikTok"};
const SRC=()=>({D:R.D,H:R.H,C:R.C,skew,SO:S.socials,DN:R.DN,DC:S.donCfg,CHAT:R.CHAT});
const L=()=>S.layouts.find(l=>l.id===S.active);
const CV=()=>canvasOf(L());
let saveT; function save(){clearTimeout(saveT);saveT=setTimeout(()=>{ if(CFG){ const {wsUrl,room,key,...rest}=S.settings; Promise.resolve(CFG.persist({layouts:S.layouts,activeLayoutId:S.active,settings:rest,name:S.profile.name,socials:S.socials,donCfg:S.donCfg,bots:S.bots})).then(()=>flash("تم الحفظ"),()=>toast("تعذر الحفظ — تحقق من الاتصال")) } else { ls("arsh.app",{layouts:S.layouts,active:S.active,settings:S.settings,profile:S.profile,socials:S.socials,donCfg:S.donCfg,bots:S.bots}); flash("تم الحفظ") } },400)}
function saveRoomNow(){ ls("arsh.room",{D:R.D,H:R.H,C:R.C,logs:R.logs,DN:R.DN,CHAT:R.CHAT}) }
let saveRT; function saveRoom(){clearTimeout(saveRT);saveRT=setTimeout(saveRoomNow,300)}
addEventListener("pagehide",()=>{ if(!CFG) ls("arsh.app",{layouts:S.layouts,active:S.active,settings:S.settings,profile:S.profile,socials:S.socials,donCfg:S.donCfg,bots:S.bots}); saveRoomNow()});
function toast(t){const e=document.getElementById("toast");e.textContent=t;e.classList.add("show");clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove("show"),1600)}
function flash(t){const e=document.getElementById("savedot");if(e){e.textContent="✓ "+t;e.style.opacity=1;clearTimeout(e._t);e._t=setTimeout(()=>e.style.opacity=.5,900)}}
function pushLayout(){ const l={...L(),socials:S.socials,donCfg:S.donCfg,bots:S.bots}; if(bus) bus.postMessage({t:"layout",layout:l}); if(wsReady) ws.send(JSON.stringify({t:"layout",room:S.settings.room,layout:l})) }

const views=new Map(), liveViews=new Set();
const allViews=()=>[...views.values(),...liveViews];
/** كل أمر يمر من هنا: للخادم إن كان متصلاً، وإلا يُنفَّذ محلياً بنفس محرك الخادم */
/** إعدادات البوت الافتراضية مع دمج المحفوظ (لا تضيع المفاتيح الجديدة) */
function mergeBots(saved){ const d=defaultBots(); if(!saved) return d; const o={...d,...saved}; for(const k of ["output","status","thanks","follows","welcome","periodic","reader","mod","queue","voice","ai"]) o[k]={...d[k],...(saved[k]||{})}; return o }
function syncBots(){ roomBots(R,S.bots,{layout:L(),socials:S.socials,donCfg:S.donCfg,forceLive:!!S.bots.demoLive}) }
function send(msg){
 if(wsReady){ ws.send(JSON.stringify({...msg,room:S.settings.room})); return }
 const now=Date.now(); let res;
 if(msg.t==="sim"){ syncBots(); res=roomEvent(R,msg.ev,now) }
 else if(msg.t==="clock-op") res=roomClockOp(R,msg,now);
 else if(msg.t==="fx") res={out:[{t:"fx",fx:msg.fx}],logs:[]};
 else return;
 for(const m of res.out){ receive(m,true); if(bus) bus.postMessage(m) }
 saveRoom();
}
function receive(m,applied){
 if(m.t==="snapshot"){ if(m.BS) S.botStats=m.BS; R.D=m.D; R.H=m.H||[]; R.C=m.C; R.logs=m.logs||[]; if(m.DN) R.DN=m.DN; skew=(m.now||Date.now())-Date.now(); saveRoom() }
 else if(m.t==="event"){ if(m.ev.type==="gift"&&m.ev.big===undefined) m.ev.big=m.ev.value>=S.settings.bigGift; if(!applied){ applyEvent(R.D,R.H,m.ev); applyDonation(R.DN,m.ev); R.CHAT=R.CHAT||[]; chatPush(R.CHAT,m.ev); R.C.tops=R.C.tops||{}; topsOnEvent(R.C.tops,m.ev,Date.now(),180); saveRoom() } if(!m.ev.test){ S.lastEv=S.lastEv||{}; S.lastEv[m.ev.platform||"tiktok"]=Date.now() } }
 else if(m.t==="clock"){ if(!applied){ R.C=m.C; if(m.now) skew=m.now-Date.now(); for(const l of [...(m.logs||[])].reverse()) R.logs.unshift(l); R.logs.length=Math.min(R.logs.length,300); saveRoom() } }
 else if(m.t==="fx"){ /* عرض فوري */ }
 else if(m.t==="status"){ if(m.text!==undefined||m.live!==undefined) liveStatus={live:!!m.live,text:m.text||liveStatus.text}; setConn(); if(m.text) toast(m.text); return }
 else if(m.t==="bot"){ for(const it of m.items||[]){ S.botFeed.unshift(it); if(it.say) vpPush(it) } S.botFeed.length=Math.min(S.botFeed.length,120); deliver(allViews(),m,SRC()); if(S.page==="bots") softRefresh(); return }
 else if(m.t==="gifts"){ S.catalog=m.gifts; if(S.page==="subathon") renderPage(true); return }
 else if(m.t==="report"){ if(m.report&&!m.report.test) psDone(m.report); return }
 else if(m.t==="actlog"||m.t==="act"||m.t==="notify"||m.t==="alertctl"){ /* تُعالج أدناه */ }
 else if(m.t==="alert"){ S.alFeed=[...(m.items||[]),...(S.alFeed||[])].slice(0,50) }
 else return;
 if(m.t==="actlog"){ S.actLog=m.log||[]; if(S.page==="actions"&&!/INPUT|SELECT|TEXTAREA/.test(document.activeElement?.tagName||"")) renderPage(true) }
 if(m.t==="act"){ for(const it of m.items||[]) if(it.kind==="goal"&&it.widgetId){ const gw=L().widgets.find(w=>w.id===it.widgetId); if(gw){ gw.base=(+gw.base||0)+(+it.n||1); save(); pushLayout() } } }
 if(m.t==="clock"&&MP.on) mpSync();
 if(m.t==="clock"&&m.mu&&S.page==="music") softRefresh();
 deliver(allViews(),m,SRC());
 if(m.t==="event"&&["stats","likes","gifts","comments","home","boards","donations"].includes(S.page)) softRefresh();
 if((m.t==="clock"||m.t==="snapshot")&&["subathon","timers","stats","home"].includes(S.page)) softRefresh();
}
let srT; function softRefresh(){clearTimeout(srT);srT=setTimeout(()=>{ if(!document.activeElement||!document.activeElement.closest||!document.activeElement.closest("#pg input,#pg select,#pg textarea")) renderPage(true) },250)}
// ساعة محلية في وضع التجربة (في الوضع الحقيقي الخادم هو المرجع)
setInterval(()=>{ if(wsReady||location.hash.startsWith("#/overlay")) return; syncBots(); const r=roomTick(R,Date.now()); for(const m of r.out){ receive(m,true); if(bus) bus.postMessage(m) } if(r.out.length) saveRoom() },1000);
setInterval(()=>{ for(const v of allViews()) if(TYPES[v.w.type]?.tick) v.refresh(SRC()); document.querySelectorAll("[data-live-clock]").forEach(e=>e.textContent=liveClockText(e.dataset.liveClock)) },250);
function liveClockText(id){ const now=Date.now()+skew; if(id==="subathon") return fmtClock(remaining(R.C.subathon,now)); const t=R.C.timers.find(x=>x.id===id); return t?fmtClock(timerValue(t,now),t.dir==="up"||t.durationMs>=HOUR):"--" }

const rnd=a=>a[Math.floor(Math.random()*a.length)];
function simUser(fresh){ if(!fresh){ const pool=[...new Set([...Object.keys(R.D.likes),...Object.keys(R.D.gifts),...Object.keys(R.D.comments)])]; if(pool.length>2&&Math.random()<.6){ const k=rnd(pool); const r=R.D.likes[k]||R.D.gifts[k]||R.D.comments[k]; return {id:k,name:r.name,avatar:r.av} } }
 let n=rnd(NAMES)+(Math.random()<.5?"_"+Math.floor(Math.random()*99):""); return {id:"u_"+n,name:n,avatar:avatar(n)} }
const sim=ev=>send({t:"sim",ev:{id:"sim_"+uid()+Date.now(),test:true,...ev}});
const gift=(g,user,mult=1)=>sim({type:"gift",user,gift:g[0],giftId:g[2],diamonds:g[1],value:g[1]*mult,count:mult});
const clockOp=(target,op,extra={})=>send({t:"clock-op",target,op,...extra});
const SIM={
 like100:()=>sim({type:"like",user:simUser(),count:100}),
 like1000:()=>sim({type:"like",user:simUser(),count:1000}),
 roses100:()=>gift(GIFTS[0],simUser(),100),
 flipTop:()=>{ const a=Object.values(R.D.gifts).sort((x,y)=>y.v-x.v); if(a.length<2) return gift(GIFTS[6],simUser(true)); const need=a[0].v-a[1].v+500, n=Math.max(1,Math.ceil(need/GIFTS[3][1])); sim({type:"gift",user:{id:a[1].k,name:a[1].name,avatar:a[1].av},gift:GIFTS[3][0],giftId:GIFTS[3][2],diamonds:GIFTS[3][1],value:n*GIFTS[3][1],count:n}) },
 goalDone:()=>{ const w=L().widgets.find(x=>x.type==="sgoal"&&x.visible); if(!w) return toast("أضف «هدف دعم مصغّر» أولاً"); const g=sgProgress(w,SRC()), need=Math.max(1,Math.ceil(g.tgt-g.cur)); const u=simUser();
  if(w.source==="custom"){ w.base=w.target; save(); pushLayout(); return refreshView(w) }
  if(w.source==="gift"){ const gg=GIFTS.find(x=>String(x[2])===String(w.giftKey))||GIFTS[6]; return sim({type:"gift",user:u,gift:gg[0],giftId:w.giftKey||gg[2],diamonds:gg[1],value:gg[1]*need,count:need}) }
  if(w.source==="giftPoints") return sim({type:"gift",user:u,gift:GIFTS[4][0],giftId:GIFTS[4][2],diamonds:need,value:need,count:1});
  if(w.source==="giftCount") return sim({type:"gift",user:u,gift:GIFTS[0][0],giftId:GIFTS[0][2],diamonds:1,value:need,count:need});
  if(w.source==="likes") return sim({type:"like",user:u,count:need});
  if(w.source==="donation") return sim({type:"donation",provider:"test",test:true,name:u.name,amount:need,currency:w.currency||S.donCfg.currency,message:"🎯"});
  const ty=w.source==="subs"?"subscribe":"follow"; for(let i=0;i<Math.min(need,200);i++) sim({type:ty,user:simUser(true)}) },
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
 <button class="btn sm" data-sim="gift">🎁 هدية تجريبية</button><button class="btn sm" data-sim="biggift">🦁 أسد</button><button class="btn sm" data-sim="roses100">🌹 100 وردة</button><button class="btn sm" data-sim="flipTop">👑 تغيير المركز الأول</button><button class="btn sm" data-sim="goalDone">🎯 إكمال الهدف</button><button class="btn sm" data-sim="supporter">➕ داعم جديد</button><button class="btn sm" data-sim="comment">💬 تعليق</button><button class="btn sm" data-sim="follow">👤 متابع</button>
 <button class="btn sm" data-soc-try="tiktok">🌐 ظهور TikTok</button><button class="btn sm" data-soc-try="instagram">🌐 Instagram</button><button class="btn sm" data-soc-try="roblox">🎮 Roblox</button><button class="btn sm" data-soc-try="cod">🎮 Call of Duty</button><button class="btn sm" data-rot-try>🔄 تجربة التناوب</button>
 <button class="btn sm" data-don-sim="5">💰 تبرع 5</button><button class="btn sm" data-don-sim="50">💰 50</button><button class="btn sm" data-don-sim="500">💰 500</button>
 <button class="btn sm" data-sim="saAdd">⏳ +5د للسبثون</button><button class="btn sm" data-sim="saSub">⏳ −1د</button><button class="btn sm" data-sim="timer">⏱️ تشغيل/إيقاف مؤقت</button>
 <select class="inp" id="simScope" style="width:auto">${[["likes","التكبيس"],["gifts","الدعم"],["comments","التعليقات"],["interact","المتفاعلين"],["follows","المتابعين"],["all","الكل (للإعادة)"]].map(o=>`<option value="${o[0]}" ${S.scope===o[0]?"selected":""}>${o[1]}</option>`).join("")}</select>
 <button class="btn sm" data-sim="shuffle">🔀 تغيير الترتيب</button><button class="btn sm dng" data-sim="reset">↺ إعادة ضبط</button></div>`}

/* ---- الروابط ---- */
function baseURL(){return location.href.split("#")[0]}
function overlayURL(l,only,acc){ if(CFG) return CFG.overlayURL(l.id,only,acc); const p=new URLSearchParams(); p.set("d",b64e({...l,socials:S.socials,donCfg:S.donCfg})); if(acc) p.set("acc",acc); if(only)p.set("only",only); p.set("big",S.settings.bigGift); if(S.settings.perfMode&&S.settings.perfMode!=="hq") p.set("pm",S.settings.perfMode); if(S.settings.wsUrl){p.set("ws",S.settings.wsUrl);p.set("room",S.settings.room)} return baseURL()+"#/overlay?"+p.toString() }
function copy(t){ (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast("تم النسخ")).catch(()=>{const a=document.createElement("textarea");a.value=t;document.body.appendChild(a);a.select();try{document.execCommand("copy");toast("تم النسخ")}catch(e){toast("انسخ يدوياً")}a.remove()}) }

/* ---- الهيكل ---- */
const PAGES=[["home","الرئيسية","🏠"],["live","الاتصال بالبث المباشر","📡"],["connections","مركز ربط البثوث","🔌"],["music","طلبات الأغاني","🎵"],["actions","الإجراءات التلقائية","⚡"],["community","المجتمعات والإشعارات","📣"],["bio","رابط البايو","🔗"],["poststats","إحصائيات نهاية البث","📊"],["billing","الاشتراك","💎"],["falerts","تنبيهات المتابعين","🦆"],["alerts","مكتبة الآيرتات","🔔"],["boards","قوائم الترتيب","🏆"],["likes","التكبيس والإعجابات","❤️"],["gifts","الدعم والهدايا","🎁"],["comments","التعليقات والتفاعلات","💬"],["bots","مركز البوتات والصوت","🤖"],["followers","عداد المتابعين","👥"],["layers","الطبقات","🧩"],["latest","آخر التفاعلات","✨"],["library","مكتبة التصاميم","🎨"],["subathon","نظام السبثون","⏳"],["timers","مؤقتات البث","⏱️"],["donations","الدونيشن والتبرعات","💰"],["socials","حساباتي","🌐"],["stats","الإحصائيات والتقارير","📊"],["studio","استوديو البث","🎬"],["obs","روابط OBS","🔗"],["settings","الإعدادات","⚙️"],["account","حسابي","👤"]];
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
const proName=w=>w.type==="lb"?lbDesignOf(w.design).name:(SG_DESIGNS.find(x=>x.id===w.design)||SG_DESIGNS[0]).name;
const dname=(id,clock)=>((clock===true?CLOCK_DESIGNS:clock==="soc"?SOCIAL_DESIGNS:DESIGNS).find(d=>d.id===id)||{}).name||id;
const wdname=w=>w.type==="donText"?"Minimal — نص فقط":w.type==="levent"?leDesignOf(w.design).name+" — "+(LE_KINDS[w.kind]||{}).label:w.type==="fcount"?fcDesignOf(w.design).name:w.type==="srules"?rbDesignOf(w.design).name:TYPES[w.type]?.pro?proName(w):dname(w.design,dKind(w)==="clock"?true:dKind(w)==="soc"?"soc":false);
const isClock=w=>!!TYPES[w.type].clock;
const isSoc=w=>!!TYPES[w.type].soc;
const isChip=w=>["donTicker","donLatest","donAlert"].includes(w.type);
const dKind=w=>w.type==="donText"?"dt":w.type==="levent"?"le":w.type==="fcount"?"fc":w.type==="srules"?"rb":w.type==="lb"?"lb":w.type==="sgoal"?"sg":isClock(w)||w.type==="donGoal"?"clock":isSoc(w)||isChip(w)?"soc":"board";
const libPool=(w,tab)=>tab==="nowplay"?w.type==="nowplay":tab==="uchat"?w.type==="uchat":tab==="levent"?w.type==="levent":tab==="fcount"?w.type==="fcount":tab==="rules"?w.type==="srules":tab==="pro"?w.type==="lb":tab==="goals"?w.type==="sgoal":tab==="clocks"?dKind(w)==="clock":tab==="socials"?dKind(w)==="soc":dKind(w)==="board"&&TYPES[w.type].board;
const designsOf=w=>({clock:CLOCK_DESIGNS,soc:SOCIAL_DESIGNS,board:DESIGNS,lb:LB_DESIGNS,sg:SG_DESIGNS,rb:RB_DESIGNS,fc:FC_DESIGNS,le:LE_DESIGNS,dt:[{id:w.design,name:"Minimal Last Donation — نص فقط"}]})[dKind(w)];
const LB_N=[[1,"الأول فقط (بطل)"],[3,"أفضل 3 (منصة تتويج)"],[5,"أفضل 5 (منصة + صفوف)"],[10,"أفضل 10 (مضغوط)"],[20,"أفضل 20 (عمودين)"]];
const LB_SIZE={1:[.4,.22],3:[.5,.28],5:[.46,.38],10:[.46,.5],20:[.7,.55]};
const giftOpts=()=>(S.catalog&&S.catalog.length?S.catalog.map(g=>[g.id,`${g.name} (${g.diamonds}💎)`]):GIFTS.map(g=>[g[2],`${g[0]} (${g[1]}💎)`]));
function rbPropsHTML(w,sel,rng){ const L=R.C.subathon.rules.list.filter(r=>r.enabled&&r.show!==false), hid=new Set(w.hideKinds||[]);
 return `${sel("mode","طريقة العرض",RB_MODES,w.mode)}
  ${w.mode==="rotate"?`<div class="grid g2" style="gap:8px">${sel("interval","مدة كل قانون",[[3,"3 ث"],[4,"4 ث"],[5,"5 ث"],[6,"6 ث"],[8,"8 ث"],[10,"10 ث"]],w.interval)}${sel("anim","حركة الانتقال",RB_ANIMS,w.anim)}</div>`:""}
  ${w.mode==="ticker"?`<div class="grid g2" style="gap:8px">${sel("tickerDir","الاتجاه",[["h","أفقي (يمين ← يسار)"],["v","عمودي"]],w.tickerDir)}</div>${rng("speed","سرعة الشريط",20,240,5,w.speed,v=>v+" px/ث")}`:""}
  <div class="grid g2" style="gap:8px">${sel("order","ترتيب القوانين",RB_ORDERS,w.order)}${sel("maxRules","عدد القوانين",[[0,"الكل"],[3,"3"],[4,"4"],[5,"5"],[6,"6"],[8,"8"],[10,"10"]],w.maxRules)}</div>
  <div class="grid g3" style="gap:8px">${sel("showWhat","اسم التفاعل",[["1","ظاهر"],["0","مخفي"]],w.showWhat!==false?"1":"0")}${sel("showTime","الوقت",[["1","ظاهر"],["0","مخفي"]],w.showTime!==false?"1":"0")}${sel("showImg","صور الهدايا",[["1","ظاهرة"],["0","أيقونات فقط"]],w.showImg!==false?"1":"0")}</div>
  <div class="fld"><label>القوانين الظاهرة في هذه اللوحة</label><div class="row" style="gap:6px">${L.map(r=>`<label class="row small" style="gap:4px"><input type="checkbox" data-rbhide="${r.id}" data-wid="${w.id}" ${hid.has(r.id)?"":"checked"}> ${esc(r.emoji||"")} ${esc(ruleView(r)[0].what)}</label>`).join("")||'<span class="mut small">لا توجد قواعد مفعّلة</span>'}</div></div>
  ${rng("iconScale","حجم صور الهدايا",.6,1.8,.05,w.iconScale,v=>Math.round(v*100)+"%")}${rng("rowOpacity","شفافية خلفية الصفوف",0,1,.05,w.rowOpacity??1,v=>Math.round(v*100)+"%")}
  <div class="grid g2" style="gap:8px"><div class="fld"><label>لون الزيادة</label><input type="color" data-wf="posColor" data-wid="${w.id}" value="${w.posColor||"#22c55e"}"></div><div class="fld"><label>لون النقصان</label><input type="color" data-wf="negColor" data-wid="${w.id}" value="${w.negColor||"#ef4444"}"></div></div>
  <div class="grid g3" style="gap:8px">${sel("animOn","التحريكات",[["1","مفعّلة"],["0","متوقفة"]],w.animOn!==false?"1":"0")}${sel("animSpeed","سرعة التحريك",[[.5,"بطيئة"],[1,"عادية"],[1.5,"سريعة"]],w.animSpeed||1)}${sel("lowPerf","أداء منخفض",[["0","متوقف"],["1","مفعّل"]],w.lowPerf?"1":"0")}</div>
  ${sel("font","الخط",FONTS,w.font)}<div class="row" style="margin-bottom:10px"><button class="btn sm pri" data-lib="${w.id}">🎨 تصاميم القوانين</button><button class="btn sm" data-go="subathon">⚙️ تعديل القواعد</button></div>` }
function proPropsHTML(w,sel,rng){
 const inp=(f,l,type="text",val=w[f])=>`<div class="fld"><label>${l}</label><input class="inp" type="${type}" data-wf="${f}" data-wid="${w.id}" value="${esc(val??"")}"></div>`;
 if(w.type==="lb"){ const d=lbDesignOf(w.design), cols=(w.rankColors&&w.rankColors.length===5)?w.rankColors:d.colors;
  return `${sel("source","مصدر القائمة",LB_SOURCES,w.source)}
  ${w.source==="gift"?sel("giftKey","الهدية",giftOpts(),w.giftKey):""}
  ${w.source==="donations"?`<div class="grid g2" style="gap:8px">${sel("period","الفترة",PERIODS,w.period)}${sel("currency","العملة",[["","الافتراضية"],...Object.keys(CURRENCIES).map(c=>[c,c])],w.currency)}</div>`:""}
  ${d.layout==="art"?sel("topN","عدد الداعمين",[[1,"1"],[3,"3"],[5,"5"],[10,"10"],[15,"15"],[20,"20"]],w.topN)+lbArtProps(w,d,sel,rng):d.layout==="bars"?sel("topN","عدد المراكز",[[3,"أفضل 3"],[5,"أفضل 5"],[10,"أفضل 10"],[15,"أفضل 15 (عمودان)"],[20,"أفضل 20 (عمودان)"]],w.topN):sel("topN","عدد المراكز وشكل الترتيب",LB_N,w.topN)}
  ${d.layout==="bars"?`${w.source==="likes"?`<div class="note small">❤️ تكبيسات TikTok تصل على دفعات منسوبة لكل مستخدم؛ الترتيب مبني على الدفعات المستلمة فعلاً في هذا البث، وقد يختلف قليلاً عن عداد TikTok الرسمي.</div>`:""}${w.source==="gifts"||w.source==="giftCount"||w.source==="gift"?`<div class="note small">💎 الترتيب بنقاط هدايا TikTok فقط — الدونيشن المالي له قائمته المستقلة (المصدر: الدونيشن).</div>`:""}
   <div class="grid g2" style="gap:8px">${sel("numFmt","شكل الأرقام",[["short","مختصر 24.5K"],["full","كامل 24,500"]],w.numFmt||"short")}${sel("medals","ميداليات المراكز 1-3",[["1","🥇🥈🥉"],["0","أرقام فقط"]],w.medals!==false?"1":"0")}
   ${d.id==="basicColorful"?sel("barFill","تعبئة الشريط",[["gradient","تدرج لوني"],["solid","لون ثابت"]],w.barFill||"gradient"):""}${sel("showAv","الصور",[["1","ظاهرة"],["0","مخفية"]],w.showAv!==false?"1":"0")}
   ${sel("showIcon","أيقونة القلب/الألماس",[["1","ظاهرة"],["0","مخفية"]],w.showIcon!==false?"1":"0")}${sel("showRank","أرقام المراكز",[["1","ظاهرة"],["0","مخفية"]],w.showRank!==false?"1":"0")}
   ${sel("crown1","تاج المركز الأول",[["0","بدون"],["1","تاج صغير"]],w.crown1?"1":"0")}${sel("fx1","لمعة ونجمتا المركز الأول",[["1","مفعّلة"],["0","متوقفة"]],w.fx1!==false?"1":"0")}
   ${sel("shine","اللمعة البيضاء",[["1","مفعّلة"],["0","متوقفة"]],w.shine!==false?"1":"0")}${rng("shineEvery","تكرار اللمعة كل",2,20,1,w.shineEvery||6,v=>v+" ث")}
   ${sel("showDeco","الزخارف (فراشات/نجوم...)",[["1","ظاهرة"],["0","مخفية"]],w.showDeco!==false?"1":"0")}${rng("animSpeed","سرعة الحركة",.5,2,.1,w.animSpeed||1,v=>v+"×")}
   <div class="fld"><label>لون النص</label><input type="color" data-wf="tx" data-wid="${w.id}" value="${w.tx||"#ffffff"}"></div><div class="fld"><label>لون الأرقام</label><input type="color" data-wf="valTx" data-wid="${w.id}" value="${w.valTx||"#ffffff"}"></div>
   <div class="fld"><label>لون رقم المركز</label><input type="color" data-wf="rankTx" data-wid="${w.id}" value="${w.rankTx||"#ffffff"}"></div><div class="fld"><label>لون أيقونة القلب/الألماس</label><input type="color" data-wf="icColor" data-wid="${w.id}" value="${w.icColor||(w.source==="likes"?"#ff4d6d":"#67e8f9")}"></div></div>`:""}
  <div class="fld"><label>ألوان المراكز (الأول ← الخامس)</label><div class="row" style="gap:6px">${cols.map((c,i)=>`<input type="color" data-rc="${i}" data-wid="${w.id}" value="${c}" title="المركز ${i+1}">`).join("")}<button class="btn sm" data-rc-reset="${w.id}">↺</button></div></div>
  ${rng("rowOpacity","شفافية خلفية الصفوف",.2,1,.05,w.rowOpacity??1,v=>Math.round(v*100)+"%")}
  <div class="grid g2" style="gap:8px">${sel("avShape","شكل الصور",[["circle","دائرية"],["rounded","مستديرة الزوايا"],["square","مربعة"]],w.avShape)}${sel("font","الخط",FONTS,w.font)}</div>
  <div class="grid g2" style="gap:8px">${inp("icon","أيقونة القيمة")}${sel("lowPerf","وضع الأداء المنخفض",[["0","متوقف"],["1","مفعّل (أخف لـ OBS)"]],w.lowPerf?"1":"0")}</div>
  <div class="row" style="margin-bottom:10px"><button class="btn sm pri" data-lib="${w.id}">🎨 مكتبة تصاميم القوائم</button><button class="btn sm" data-lb-save="${w.id}">💾 حفظ تصميمي</button><button class="btn sm" data-lb-default="${w.id}">↺ استعادة الافتراضي</button></div>` }
 const raw=sgProgress(w,SRC());
 return `${sel("source","نوع الهدف",SG_SOURCES,w.source)}${SG_AVAIL[w.source]?`<div class="note small">${SG_AVAIL[w.source]}</div>`:""}
  ${w.source==="gift"?sel("giftKey","الهدية",giftOpts(),w.giftKey):""}${w.source==="donation"?sel("currency","العملة",[["","الافتراضية"],...Object.keys(CURRENCIES).map(c=>[c,c])],w.currency):""}
  <div class="grid g2" style="gap:8px">${inp("target","الهدف","number")}${inp("base",w.source==="custom"?"القيمة الحالية":"رصيد إضافي يدوي","number")}</div>
  ${inp("levelStages","مراحل التحدي (مثال: 1000,1500,2000,3000,5000) — فارغ = هدف واحد")}${raw.levels?`<div class="note small">المرحلة الحالية: <b>${raw.level}/${raw.levels}</b> — من ${sgFmt(w,raw.start,SRC())} إلى ${sgFmt(w,raw.tgt,SRC())}</div>`:""}<div class="row" style="margin-bottom:8px"><button class="btn sm" data-sgpreset="${w.id}">❤️ تحدي تكبيس جاهز (5 مراحل)</button></div>
  <div class="note small">الحالي: <b>${sgFmt(w,raw.cur,SRC())}</b> من ${sgFmt(w,raw.tgt,SRC())} (${Math.floor(raw.pct)}%)</div>
  <div class="row" style="margin-bottom:10px">${w.source==="custom"?`<button class="btn sm" data-sg-add="1">+1</button><button class="btn sm" data-sg-add="10">+10</button><button class="btn sm" data-sg-add="-1">−1</button>`:`<button class="btn sm" data-sg-zero="${w.id}">⏱ ابدأ العدّ من الآن</button><button class="btn sm" data-sg-unzero="${w.id}">↺ احسب من بداية البث</button>`}</div>
  <div class="grid g2" style="gap:8px">${inp("icon","الأيقونة")}${sel("showPct","النسبة المئوية",[["1","ظاهرة"],["0","مخفية"]],w.showPct!==false?"1":"0")}</div>
  ${vgDesignOf(w.design)?`<div class="ttl" style="margin:10px 0 6px">✨ هدف تفاعلي — ${esc(vgDesignOf(w.design).name)}</div>
   ${inp("stages","نسب المراحل (بفواصل)")}${sel("fx","التأثير عند وصول الدعم",[["","حسب التصميم"],...VG_FX],w.fx||"")}
   <div class="grid g3" style="gap:8px">${sel("showLast","آخر داعم",[["1","ظاهر"],["0","مخفي"]],w.showLast!==false?"1":"0")}${sel("showTop","أكبر مساهم",[["1","ظاهر"],["0","مخفي"]],w.showTop!==false?"1":"0")}${sel("showCount","عدد المساهمين",[["1","ظاهر"],["0","مخفي"]],w.showCount!==false?"1":"0")}</div>`:`<div class="note small">✨ جرّب التصاميم التفاعلية (كأس، ألماسة، صندوق كنز، حلقة) من <button class="btn sm" data-lib="${w.id}">مكتبة الأهداف</button></div>`}
  ${sel("lowPerf","وضع الأداء المنخفض",[["0","متوقف"],["1","مفعّل"]],w.lowPerf?"1":"0")}`;
}
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
  <div class="card" style="margin-top:14px"><h3>كل ما في المنصة</h3><div class="row" style="gap:6px;flex-wrap:wrap">${[["studio","🎬 استوديو البث"],["falerts","🦆 تنبيهات المتابعين"],["alerts","🔔 مكتبة الآيرتات"],["followers","👥 عداد المتابعين"],["latest","✨ آخر التفاعلات"],["library","🏆 قوائم الداعمين"],["subathon","⏳ السبثون"],["bots","🤖 البوتات والقارئ الصوتي"],["actions","⚡ الإجراءات التلقائية"],["music","🎵 طلبات الأغاني"],["poststats","📊 إحصائيات نهاية البث"],["community","📣 Discord وTelegram"],["bio","🔗 رابط البايو"]].map(([g,n])=>`<button class="btn sm" data-go="${g}">${n}</button>`).join("")}</div></div></div>`+testBar();
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
  <div class="card" style="margin-bottom:14px"><h3>✨ قوائم Pro الشفافة <span class="tag">صور دائرية وهالات · ${LB_DESIGNS.length} تصاميم</span></h3><div class="row"><button class="btn sm pri" data-add-lb="3">+ 🏆 أفضل 3</button><button class="btn sm pri" data-add-lb="5">+ 🏆 أفضل 5</button><button class="btn sm" data-add-lb="10">+ أفضل 10</button><button class="btn sm" data-add-lb="20">+ أفضل 20</button><button class="btn sm" data-add-lb="Likes">+ ❤️ التكبيس Pro</button><button class="btn sm" data-add="sgoal">+ 🎯 هدف دعم مصغّر</button><button class="btn sm pri" data-add-vg="goldCup">+ 🏆 كأس الذهب</button><button class="btn sm pri" data-add-vg="treasureChest">+ 🧰 صندوق الكنز</button><button class="btn sm" data-add-vg="diamondForm">+ 💎 الألماسة</button><button class="btn sm" data-add-vg="ringGoal">+ ⭕ الهدف الدائري</button><button class="btn sm" data-libtab="pro" data-go="library">🎨 مكتبة تصاميم القوائم</button></div></div>
  <div class="grid g3">${l.widgets.map(w=>`<div class="card"><h3><span>${TYPES[w.type].icon} ${esc(w.name)}</span><span class="tag">${w.id}</span></h3>
   <div class="mut small" style="line-height:2">التصميم: <b style="color:var(--tx)">${wdname(w)}</b><br>الموقع: ${POS.find(x=>x[0]===w.pos)?.[1]||"مخصص"} · ${Math.round(w.w*100)}%×${Math.round(w.h*100)}%<br>${TYPES[w.type].board?`المراكز: ${w.topN}`:""} ${w.visible?"· ظاهر":"· مخفي"} ${w.locked?"· مقفل 🔒":""}</div>
   <div class="row" style="margin-top:10px"><button class="btn sm pri" data-edit="${w.id}">تعديل في الاستوديو</button><button class="btn sm" data-lib="${w.id}">تغيير التصميم</button><button class="btn sm" data-copylink="${w.id}">🔗 رابط مستقل</button></div></div>`).join("")||'<div class="empty">لا توجد عناصر</div>'}</div>`;
 }
 else if(p==="library"){
  const tab=S.libTab;
  const pool=l.widgets.filter(w=>libPool(w,tab));
  const tgt=pool.find(w=>w.id===S.libTarget)||pool[0];
  const favs=S.settings.lbFav||[], q=(S.lbQ||"").trim().toLowerCase();
  const list=tab==="pro"?LB_DESIGNS.filter(d=>(!S.lbCat||S.lbCat===d.cat)&&(!S.lbFavOnly||favs.includes(d.id))&&(!q||(d.name+" "+d.desc+" "+d.n).toLowerCase().includes(q))):tab==="goals"?SG_DESIGNS.filter(d=>!S.gcat||(S.gcat==="bar"?!d.vg:d.cat===S.gcat)).sort((a,b)=>(b.vg?1:0)-(a.vg?1:0)):tab==="fcount"?FC_DESIGNS.filter(d=>(!S.fcF||(S.fcF.startsWith("cat:")?d.cat===S.fcF.slice(4):fcTags(d).includes(S.fcF)))&&(!S.fcFavOnly||(S.settings.fcFav||[]).includes(d.id))):tab==="nowplay"?NP_DESIGNS:tab==="uchat"?UC_DESIGNS:tab==="levent"?LE_DESIGNS.filter(d=>(!S.leFavOnly||(S.settings.leFav||[]).includes(d.id))&&(!S.leGrp||d.cat===S.leGrp)):tab==="rules"?RB_DESIGNS:tab==="clocks"?CLOCK_DESIGNS:tab==="socials"?SOCIAL_DESIGNS:DESIGNS;
  const LB_PLAN={circle:15,cloud:10,royal:15,neon:15,glass:15,d3:15,mini:15,basic:4,boys:20,girls:20,ptrans:20,creative:20,legRoyal:10,legFlower:10,legGaming:10,legGalaxy:10,legMinimal:11,legSaudi:10};
  h=head(tab==="pro"?"🎨 مكتبة تصاميم القوائم":"مكتبة التصاميم","معاينة حيّة — التصميم يُطبَّق على العنصر المختار فقط",layoutPicker())+
  `<div class="row" style="margin-bottom:12px"><button class="btn sm ${tab==="pro"?"on":""}" data-libtab="pro">✨ قوائم الداعمين (${LB_DESIGNS.length})</button><button class="btn sm ${tab==="goals"?"on":""}" data-libtab="goals">🎯 أهداف الدعم (${SG_DESIGNS.length})</button><button class="btn sm ${tab==="nowplay"?"on":""}" data-libtab="nowplay">🎵 الأغنية الحالية (${NP_DESIGNS.length})</button><button class="btn sm ${tab==="uchat"?"on":""}" data-libtab="uchat">💬 الشات الموحد (${UC_DESIGNS.length})</button><button class="btn sm ${tab==="levent"?"on":""}" data-libtab="levent">✨ آخر التفاعلات (${LE_DESIGNS.length}/${LE_PLAN_TOTAL})</button><button class="btn sm ${tab==="fcount"?"on":""}" data-libtab="fcount">👥 عدادات المتابعين (${FC_DESIGNS.length}/60)</button><button class="btn sm ${tab==="rules"?"on":""}" data-libtab="rules">📜 قوانين السبثون (${RB_DESIGNS.length}/40)</button><button class="btn sm ${tab==="boards"?"on":""}" data-libtab="boards">🏆 قوائم الترتيب (${DESIGNS.length})</button><button class="btn sm ${tab==="clocks"?"on":""}" data-libtab="clocks">⏳ السبثون والمؤقتات (${CLOCK_DESIGNS.length})</button><button class="btn sm ${tab==="socials"?"on":""}" data-libtab="socials">🌐 الحسابات (${SOCIAL_DESIGNS.length})</button></div>
  <div class="card" style="margin-bottom:14px"><div class="row"><span class="mut">تطبيق على:</span>${pool.length?`<select class="inp" data-act="libTarget" style="width:auto">${pool.map(w=>`<option value="${w.id}" ${tgt&&w.id===tgt.id?"selected":""}>${TYPES[w.type].icon} ${esc(w.name)} — ${wdname(w)}</option>`).join("")}</select>`:`<span class="mut small">لا يوجد عنصر من هذا النوع في التخطيط</span> ${tab==="pro"?`<button class="btn sm" data-add-lb="5">+ إضافة قائمة Pro</button>`:`<button class="btn sm" data-add="${tab==="clocks"?"subathon":tab==="socials"?"social":tab==="goals"?"sgoal":tab==="rules"?"srules":tab==="fcount"?"fcount":"gifts"}">+ إضافة</button>`}`}</div></div>
  ${tab==="levent"?`<div class="card" style="margin-bottom:14px"><h3>✨ آخر التفاعلات <span class="tag">معاينة حيّة بنفس مكوّن OBS</span></h3><div class="row"><span class="mut">نوع المعاينة:</span>${Object.entries(LE_KINDS).map(([k,K])=>`<button class="btn sm ${(S.leKind||(tgt&&tgt.kind)||"follow")===k?"on":""}" data-lekindpv="${k}">${K.icon} ${K.label}</button>`).join("")}</div><div class="row" style="margin-top:8px"><button class="btn sm pri" data-lepv="all">▶ تشغيل التجربة على الكل</button><button class="btn sm ${S.leFavOnly?"on":""}" data-lefavonly="1">★ المفضلة فقط</button>${tgt?`<button class="btn sm" data-lecopy="${tgt.id}">🔗 نسخ رابط OBS للعنصر المختار</button><button class="btn sm" data-sel="${tgt.id}" data-go="studio">⚙️ إعدادات العنصر</button>`:""}</div><div class="row" style="margin-top:8px"><button class="btn sm ${!S.leGrp?"on":""}" data-legrp="">الكل (${LE_DESIGNS.length})</button>${Object.entries(LE_GROUPS).map(([g,n])=>`<button class="btn sm ${S.leGrp===g?"on":""}" data-legrp="${g}">${n} (${LE_DESIGNS.filter(d=>d.cat===g).length}/${LE_PLAN[g].length})</button>`).join("")}</div><p class="mut small">المنفذ فعلياً: ${LE_DESIGNS.length} من ${LE_PLAN_TOTAL} تصميماً متحركاً — كل تصميم يعمل مع كل الأنواع بشارة وجزيئات وحركة خاصة بكل نوع. ${LE_ENTERS.length-1} حركة دخول و${LE_EXITS.length-1} حركة خروج.</p></div>`:""}
  ${tab==="fcount"?`<div class="card" style="margin-bottom:14px"><h3>🧪 تجربة العدادات <span class="tag">بيانات تجريبية</span></h3><div class="row"><button class="btn sm" data-fcpv="up">➕ زيادة متابع</button><button class="btn sm" data-fcpv="down">➖ نقصان متابع</button><button class="btn sm" data-fcpv="goal">⭐ الوصول للهدف</button></div><p class="mut small">المعاينات تعمل بنفس كود OBS. الأرقام توضيحية.</p><div class="row" style="margin-top:8px;gap:6px"><button class="btn sm ${!S.fcF?"on":""}" data-fcf="">الكل (${FC_DESIGNS.length})</button>${Object.entries(FC_CATS).map(([k,n])=>`<button class="btn sm ${S.fcF==="cat:"+k?"on":""}" data-fcf="cat:${k}">${n} <span class="tag">${FC_DESIGNS.filter(d=>d.cat===k).length}/${FC_PLAN[k]}</span></button>`).join("")}</div>
   <div class="row" style="margin-top:6px;gap:6px">${FC_FILTERS.map(([k,n])=>`<button class="btn sm ${S.fcF===k?"on":""}" data-fcf="${k}">${n}</button>`).join("")}<button class="btn sm ${S.fcGoalPv!=="0"?"on":""}" data-fcg="1">🎯 مع هدف</button><button class="btn sm ${S.fcGoalPv==="0"?"on":""}" data-fcg="0">بدون هدف</button><button class="btn sm ${S.fcFavOnly?"on":""}" data-fcfavonly>★ المفضلة (${(S.settings.fcFav||[]).length})</button></div></div>`:""}
  ${tab==="goals"?`<div class="card" style="margin-bottom:14px"><h3>🧪 تجربة الأهداف التفاعلية <span class="tag">بيانات تجريبية — لا تؤثر على البث</span></h3>
   <div class="row"><span class="mut small">نسبة التعبئة</span><input type="range" min="0" max="100" step="1" value="${S.gpct??60}" data-act="gpct" style="flex:1;min-width:200px"><b id="gpctv" style="min-width:48px">${S.gpct??60}%</b>
   <button class="btn sm" data-gtest="sup">🦁 دعم تجريبي (+8%)</button><button class="btn sm" data-gtest="done">🎉 تجربة الاكتمال</button><button class="btn sm" data-gtest="zero">↺ 0%</button></div>
   <div class="row" style="margin-top:8px;gap:6px"><button class="btn sm ${!S.gcat?"on":""}" data-gcat2="">الكل</button><button class="btn sm ${S.gcat==="bar"?"on":""}" data-gcat2="bar">أشرطة كلاسيكية (${SG_DESIGNS.filter(d=>!d.vg).length})</button>${Object.entries(VG_CATS).map(([k,n])=>{const c=VG_DESIGNS.filter(d=>d.cat===k).length;return `<button class="btn sm ${S.gcat===k?"on":""}" data-gcat2="${k}">${n} <span class="tag">${c}/${VG_PLAN[k]||10}</span></button>`}).join("")}</div></div>`:""}
  ${tab==="pro"?`<div class="card" style="margin-bottom:14px"><div class="row" style="gap:6px"><button class="btn sm ${!S.lbCat?"on":""}" data-lbcat="">الكل</button>${Object.entries(LB_CATS).map(([k,n])=>{const c=LB_DESIGNS.filter(d=>d.cat===k).length;return `<button class="btn sm ${S.lbCat===k?"on":""}" data-lbcat="${k}">${n} <span class="tag">${c}/${LB_PLAN[k]}</span></button>`}).join("")}</div>
   <div class="row" style="margin-top:10px"><input class="inp" data-act="lbq" placeholder="🔍 ابحث باسم التصميم أو رقمه…" value="${esc(S.lbQ||"")}" style="max-width:320px"><button class="btn sm ${S.lbFavOnly?"on":""}" data-lbfavonly>★ المفضلة (${favs.length})</button></div>
   <div class="row" style="margin-top:8px;gap:6px"><span class="mut small">🧪 تجربة (بيانات تجريبية):</span><button class="btn sm" data-lbt="new">🎁 دعم جديد</button><button class="btn sm" data-lbt="top">👑 تغيير المركز الأول</button><button class="btn sm" data-lbt="add">➕ زيادة النقاط</button><button class="btn sm" data-lbt="cel">🎉 الاحتفال</button><button class="btn sm ${S.lbStill?"on":""}" data-lbt="still">⏸ إيقاف الحركة</button>
   ${(S.settings.lbPresets||[]).length?`<select class="inp" data-act="lbPreset" style="width:auto"><option value="">💾 تصاميمي المحفوظة…</option>${S.settings.lbPresets.map((x,i)=>`<option value="${i}">${esc(x.name)}</option>`).join("")}</select>`:""}</div>
   ${list.length?"":`<div class="empty" style="margin-top:10px">${S.lbCat&&!LB_DESIGNS.some(d=>d.cat===S.lbCat)?"هذه الفئة ضمن الدفعات القادمة":"لا توجد نتائج"}</div>`}</div>`:""}
  <div class="lib ${tab==="pro"?"lib-pro":""} ${S.lbStill?"pv-still":""}" id="lib">${list.map(d=>`<div class="libc ${tgt&&tgt.design===d.id?"on":""}" data-pick="${d.id}" data-name="${esc((d.name+" "+(d.desc||"")+" "+(d.n||"")).toLowerCase())}"><div class="pv" data-pv="${d.id}"></div>${tab==="pro"?`<button class="lbfav ${(S.settings.lbFav||[]).includes(d.id)?"on":""}" data-lbfav="${d.id}" title="المفضلة">★</button><button class="lbfav lepl" data-lbobs="${d.id}" title="استخدام ونسخ رابط OBS">🔗</button>`:""}${tab==="fcount"?`<button class="lbfav ${(S.settings.fcFav||[]).includes(d.id)?"on":""}" data-fcfav="${d.id}" title="المفضلة">★</button><button class="lbfav lepl" data-fcobs="${d.id}" title="نسخ رابط OBS">🔗</button>`:""}${tab==="levent"?`<button class="lbfav ${(S.settings.leFav||[]).includes(d.id)?"on":""}" data-lefav="${d.id}" title="المفضلة">★</button><button class="lbfav lepl" data-lepv="${d.id}" title="تشغيل الحركة">▶</button>${tgt?`<button class="lbfav lecu" data-lecust="${d.id}" title="تخصيص">⚙</button>`:""}`:""}<div class="meta"><b>${tab==="pro"||tab==="levent"?`<span class="tag">#${d.n}</span> `:""}${d.name}</b>${tab==="pro"||tab==="levent"||tab==="uchat"||tab==="nowplay"?`<span class="mut small" style="display:block">${d.desc}</span>`:""}<span class="tag">${tab==="uchat"||tab==="nowplay"?esc(d.ar):tab==="levent"?esc(d.ar)+" · "+LE_GROUPS[d.cat]:tab==="fcount"?FC_CATS[d.cat]:tab==="rules"?RB_CATS[d.cat]:tab==="goals"&&d.vg?VG_CATS[d.cat]:d.cat?LB_CATS[d.cat]:({list:"قائمة",grid:"شبكة",pod:"تتويج",row:"أفقي",digital:"رقمي",ring:"دائري",bar:"شريط",mini:"صغير",vertical:"عمودي",pill:"كبسولة",box:"إطار",hud:"HUD",facet:"ألماسي",bare:"بدون خلفية",ribbon:"شريطة",card:"بطاقة",spot:"إضاءة",gcard:"ألعاب",capsule:"كبسولة عائمة"})[d.shape]||d.shape}</span></div></div>`).join("")}</div>
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
 else if(p==="bots"){ h=botsHTML() }
 else if(p==="followers"){ h=fcHTML() }
 else if(p==="latest"){ h=leHTML() }
 else if(p==="connections"){ h=connHTML() }
 else if(p==="layers"){ h=layersHTML() }
 else if(p==="actions"){ h=actHTML() }
 else if(p==="community"){ h=commHTML() }
 else if(p==="bio"){ h=bioHTMLPage() }
 else if(p==="poststats"){ h=psHTML() }
 else if(p==="billing"){ h=billHTML() }
 else if(p==="falerts"){ h=faHTML() }
 else if(p==="alerts"){ h=alHTML() }
 else if(p==="music"){ h=musicHTML() }
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
  <div class="fld"><label>وضع الأداء لروابط OBS</label><select class="inp" data-set="perfMode">${[["hq","High Quality — كل المؤثرات"],["balanced","Balanced — مؤثرات متوسطة"],["perf","Performance — حركات خفيفة وأقل استهلاكاً"]].map(([v,l])=>`<option value="${v}" ${(s.perfMode||"hq")===v?"selected":""}>${l}</option>`).join("")}</select><p class="mut small">يُطبَّق على الروابط المنسوخة بعد التغيير (أعد نسخ الرابط في OBS).</p></div>
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
 if(p==="layers") layersMount();
 if(p==="bio") bioPreview();
 if(p==="poststats") psPreview();
 if(p==="falerts") faPreview();
 if(p==="alerts") alAfter();
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
 <div class="ttl">⚙️ قواعد التفاعل — كل قاعدة مستقلة بمعرّفها وتُقرأ تلقائياً في لوحة القوانين</div>
 ${rulesEditorHTML(s)}
 <div class="grid g2" style="margin-top:14px"><div class="card"><h3><span>🎯 تحقيق هدف</span>${chk("rules.goal.enabled",r.goal.enabled)}</h3><div class="grid g3" style="gap:8px"><div class="fld" style="margin:0"><label>المقياس</label><select class="inp" data-sa="rules.goal.metric">${[["likes","الإعجابات"],["gifts","نقاط الدعم"],["follows","المتابعون"]].map(o=>`<option value="${o[0]}" ${r.goal.metric===o[0]?"selected":""}>${o[1]}</option>`).join("")}</select></div>${num("rules.goal.target",r.goal.target,"الهدف")}${num("rules.goal.sec",r.goal.sec,"يضيف (ثانية)")}</div>${r.goal.reached?'<p class="small" style="color:var(--ok)">✓ تم تحقيق الهدف</p>':""}
  <h3 style="margin-top:14px"><span>✋ الإضافة والخصم اليدوي</span>${chk("rules.manual.enabled",r.manual.enabled)}</h3></div>
 <div class="card"><h3>📜 لوحة القوانين للمشاهدين</h3><p class="mut small">تعرض القواعد المفعّلة تلقائياً — أي تعديل هنا يظهر فوراً في البث بدون كتابة يدوية.</p>
  ${l.widgets.filter(w=>w.type==="srules").map(w=>widgetQuick(w)).join("")||`<div class="empty">لا توجد لوحة قوانين في «${esc(l.name)}»</div>`}
  <div class="row" style="margin-top:8px"><button class="btn sm pri" data-add-rb="list">+ قائمة كاملة</button><button class="btn sm" data-add-rb="rotate">+ قانون بالتناوب</button><button class="btn sm" data-add-rb="ticker">+ شريط متحرك</button><button class="btn sm" data-add-rb="cards">+ بطاقات</button><button class="btn sm" data-add-rb="compact">+ مختصرة</button><button class="btn sm" data-libtab="rules" data-go="library">🎨 تصاميم القوانين (${RB_DESIGNS.length}/40)</button></div></div></div>
 <div class="grid g2" style="margin-top:14px"><div class="card"><h3>العداد على الشاشة</h3>${sw.length?sw.map(w=>widgetQuick(w)+`<div class="row"><label class="row small"><input type="checkbox" data-wf="sound" data-wid="${w.id}" ${w.sound?"checked":""}> صوت عند إضافة الوقت</label></div>`).join(""):`<div class="empty">لا يوجد عداد سبثون في «${esc(l.name)}»</div><button class="btn pri sm" data-add="subathon">+ إضافة عداد السبثون</button>`}
  <button class="btn sm" data-libtab="clocks" data-go="library" style="margin-top:8px">🎨 مكتبة أشكال العداد (${CLOCK_DESIGNS.length})</button></div>
 <div class="card"><h3>سجل العمليات <span class="tag">${R.logs.length}</span></h3><div class="feed">${R.logs.slice(0,60).map(x=>`<div><b style="color:${x.deltaMs>0?"var(--ok)":x.deltaMs<0?"var(--bad)":"var(--mut)"}">${x.deltaMs?fmtDelta(x.deltaMs):"•"}</b> ${x.test?'🧪 ':''}${esc(x.reason)}${x.ruleId?` <span class="tag" dir="ltr">${x.ruleId}</span>`:''} <span class="mut small">— ${dt(x.at)} · متبقٍ ${fmtClock(x.remainingMs)}</span></div>`).join("")||'<div class="mut">لا عمليات بعد</div>'}</div></div></div>`+testBar();
}
const UNITS=[[1000,"ثانية"],[60000,"دقيقة"],[3600000,"ساعة"]];
const bestUnit=ms=>{ const a=Math.abs(ms); return a&&a%3600000===0?3600000:a&&a%60000===0?60000:1000 };
function durInput(r,f,label){ const u=bestUnit(r[f]); return `<div class="fld" style="margin:0"><label>${label}</label><div class="row" style="flex-wrap:nowrap;gap:4px"><input class="inp" type="number" min="0" step="any" data-rl="${r.id}" data-rk="amt:${f}" value="${Math.abs(r[f])/u}" style="min-width:0"><select class="inp" data-rl="${r.id}" data-rk="unit:${f}" style="width:auto">${UNITS.map(x=>`<option value="${x[0]}" ${x[0]===u?"selected":""}>${x[1]}</option>`).join("")}</select></div></div>` }
function rulesEditorHTML(s){ const L=s.rules.list, shares=(R.D.tot&&R.D.tot.shares)||0;
 const fld=(r,k,label,type="text",extra="")=>`<div class="fld" style="margin:0"><label>${label}</label><input class="inp" type="${type}" data-rl="${r.id}" data-rk="${k}" value="${esc(r[k]??"")}" ${extra}></div>`;
 const sel=(r,k,label,opts)=>`<div class="fld" style="margin:0"><label>${label}</label><select class="inp" data-rl="${r.id}" data-rk="${k}">${opts.map(o=>`<option value="${o[0]}" ${String(r[k])===String(o[0])?"selected":""}>${o[1]}</option>`).join("")}</select></div>`;
 const gopts=()=>{ const c=S.catalog&&S.catalog.length?S.catalog.map(g=>[g.id,`${g.name} (${g.diamonds}💎)`]):GIFTS.map(g=>[g[2],`${g[0]} (${g[1]}💎)`]); return [["","— بالاسم أو بحد الألماس —"],["*","أي هدية أخرى (لكل ألماسة)"],...c] };
 const card=(r,i)=>{ const k=RULE_KINDS[r.kind]||RULE_KINDS.gift, v=ruleView(r);
  const kindFields=r.kind==="gift"?`${sel(r,"giftId","الهدية",gopts())}${fld(r,"giftName","اسم الهدية")}${fld(r,"emoji","أيقونة")}${fld(r,"img","رابط صورة الهدية (اختياري)","url",'dir="ltr"')}${fld(r,"every","عدد الهدايا المطلوبة","number",'min="1"')}${r.giftId==null||r.giftId===""?fld(r,"minDiamonds","أو أي هدية قيمتها ≥ (ألماس)","number",'min="0"'):""}${r.giftId==="*"?`${durInput({...r,perDiamondMs:r.perDiamondMs||1000},"perDiamondMs","لكل ألماسة")}`:""}`
   :r.kind==="likes"||r.kind==="share"?fld(r,"every",r.kind==="likes"?"كل (لايك)":"كل (مشاركة)","number",'min="1"')
   :r.kind==="comment"?`${fld(r,"keyword","الأمر (الكلمة)")}`
   :r.kind==="donation"?`${sel(r,"currency","العملة",Object.keys(CURRENCIES).map(c=>[c,c]))}${fld(r,"unit","لكل مبلغ","number",'min="0.01" step="any"')}${durInput(r,"addMs","مع «زيد» يزيد")}${durInput(r,"subMs","مع «نقص» ينقص")}${fld(r,"addWords","كلمات الزيادة (بفواصل)")}${fld(r,"subWords","كلمات النقصان (بفواصل)")}${sel(r,"defaultAction","بدون كلمة في الرسالة",[["add","يزيد الوقت"],["sub","ينقص الوقت"],["none","لا يغيّر الوقت"]])}${fld(r,"minAmount","الحد الأدنى للمبلغ","number",'min="0" step="any"')}`:"";
  const note=r.kind==="share"?`<div class="note small">${shares?`✅ وصل ${shares} حدث مشاركة في هذا البث — الميزة تعمل.`:"⚠️ غير مؤكدة: تعتمد على إرسال المكتبة غير الرسمية لحدث المشاركة. لن تُحسب إلا إذا وصل الحدث فعلاً من بث حقيقي."}</div>`:r.kind==="subscribe"?`<div class="note small">تصل فقط للحسابات المفعّل لها الاشتراك في TikTok.</div>`:r.kind==="donation"?`<div class="note small">يُحتسب بعد تأكيد الدفع من المزوّد فقط، ومرة واحدة لكل عملية. مثال: 10 + «زيد» = ${fmtDur(r.addMs*10/(+r.unit||1))}.</div>`:r.kind==="comment"?`<div class="note small">يُنفَّذ إذا كان التعليق هو الأمر نفسه (وليس داخل جملة). حماية السبام من «خيارات متقدمة».</div>`:"";
  return `<div class="card rl ${r.enabled?"":"off"}" data-rule="${r.id}"><h3><span>${esc(r.emoji||k.icon)} ${k.label}${r.kind==="gift"&&r.giftName?" — "+esc(r.giftName):""}${r.kind==="comment"&&r.keyword?" «"+esc(r.keyword)+"»":""}</span><span class="row" style="gap:6px"><span class="tag ${v[0]&&v[0].ms<0?"bad":"ok"}">${v.map(x=>x.text).join(" / ")}</span><label class="row small" style="gap:4px"><input type="checkbox" data-rl="${r.id}" data-rk="enabled" ${r.enabled?"checked":""}> مفعّلة</label></span></h3>
   <div class="grid g3" style="gap:8px">${r.kind!=="donation"?`${sel(r,"dir","التأثير",[[1,"➕ زيادة"],[-1,"➖ نقصان"]])}${r.giftId==="*"&&!r.ms?"":durInput(r,"ms","المقدار")}`:""}${kindFields}</div>${note}
   <details style="margin-top:8px"><summary class="mut small" style="cursor:pointer">خيارات متقدمة</summary><div class="grid g3" style="gap:8px;margin-top:8px">
    ${durInput(r,"cooldownMs","انتظار بين التنفيذات")}${durInput(r,"userCooldownMs","انتظار لكل مستخدم")}${fld(r,"perMin","أقصى تنفيذ بالدقيقة (0 = بلا حد)","number",'min="0"')}${durInput(r,"maxMs","أقصى تأثير للحدث (0 = بلا حد)")}
    ${sel(r,"show","تظهر في لوحة القوانين",[["true","نعم"],["false","لا"]])}${sel(r,"sound","صوت التنبيه",[["true","مفعّل"],["false","متوقف"]])}${fld(r,"label","نص مخصص في اللوحة (اختياري)")}</div></details>
   <div class="row" style="margin-top:8px"><button class="btn sm" data-rtest="${r.id}">🧪 جرّب القاعدة</button><button class="btn sm" data-rmove="${r.id}" data-dir="-1">↑</button><button class="btn sm" data-rmove="${r.id}" data-dir="1">↓</button><button class="btn sm" data-rdup="${r.id}">نسخ</button><button class="btn sm dng" data-rdel="${r.id}">حذف</button><span class="mut small" dir="ltr">${r.id}</span></div></div>` };
 return `<div class="card" style="margin-bottom:12px"><div class="row" style="justify-content:space-between"><label class="row" style="gap:6px"><input type="checkbox" data-sa="rules.auto" ${s.rules.auto!==false?"checked":""}> <b>القواعد التلقائية مفعّلة</b></label>
  <div class="row"><select class="inp" data-act="rAdd" style="width:auto"><option value="">+ إضافة قاعدة…</option>${Object.entries(RULE_KINDS).map(([k,x])=>`<option value="${k}">${x.icon} ${x.label}</option>`).join("")}</select>
  <select class="inp" data-act="rPreset" style="width:auto"><option value="">📋 قالب جاهز…</option>${Object.entries(RULE_PRESETS).map(([k,n])=>`<option value="${k}">${n}</option>`).join("")}</select></div></div>
  <p class="mut small" style="margin:8px 0 0">الأحداث المدعومة فعلياً من TikTok: الهدايا، الإعجابات، المتابعات، الاشتراكات، التعليقات. المشاركات: ${shares?"✅ وصلت فعلاً":"⚠️ غير مؤكدة بعد"}. الدونيشن: بعد تأكيد الدفع.</p></div>
  <div class="grid g2">${L.map(card).join("")}</div>` }
function setRules(fn){ const L=R.C.subathon.rules.list.map(r=>({...r})); fn(L); saConfig({rules:{list:L}}); setTimeout(()=>renderPage(true),60) }
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
  body=`<div class="card" style="margin-bottom:14px"><h3>أضف إلى المشهد «${esc(L().name)}»</h3><div class="row">${add("donTicker","💸 شريط الدعم")}${add("donGoal","🎯 هدف الدعم")}${add("donLatest","💚 آخر داعم")}${add("donText","💬 آخر دعم نصي (نص فقط)")}${add("donText","💬 آخر دعم نصي (نص فقط)")}${add("donTop","👑 أكبر داعم (البث الحالي)",'{"period":"session","title":"ملك الدعم"}')}${add("donTop","🏆 أقوى داعم الأسبوع",'{"period":"week","title":"أقوى داعم الأسبوع","name":"أقوى داعم الأسبوع"}')}${add("donTop","👑 أقوى داعم الشهر",'{"period":"month","title":"أقوى داعم الشهر","name":"أقوى داعم الشهر"}')}${add("donBoard","💰 قائمة أفضل الداعمين")}${add("donAlert","🔔 تنبيهات الدونيشن")}</div></div>
  <div class="grid g2">${donWidgetsOf(["donTicker","donGoal","donLatest","donText","donTop","donBoard","donAlert"]).map(w=>`<div class="card"><h3><span>${TYPES[w.type].icon} ${esc(w.name)}</span><span class="tag">${wdname(w)}</span></h3><div class="mut small">${w.type==="donTop"||w.type==="donBoard"?"الفترة: "+(PERIODS.find(p=>p[0]===w.period)||[])[1]+" · ":""}${w.currency||DC.currency}</div><div class="row" style="margin-top:8px"><button class="btn sm pri" data-edit="${w.id}">تعديل في الاستوديو</button>${w.type==="donText"?"":`<button class="btn sm" data-lib="${w.id}">التصميم</button>`}<button class="btn sm" data-copylink="${w.id}">🔗 رابط مستقل</button><button class="btn sm" data-preview="${w.id}">👁 معاينة</button></div></div>`).join("")||'<div class="empty">لا توجد عناصر دونيشن في هذا المشهد</div>'}</div>
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
 if(d.donAddw){ const w=addWidget(d.donAddw,d.donExtra?JSON.parse(d.donExtra):{}); const ex=d.donExtra?JSON.parse(d.donExtra):{}; const pos={donTicker:"tc",donGoal:"bc",donLatest:"bl",donText:"tc",donTop:ex.period==="month"?"tr":ex.period==="week"?"tl":"tc",donBoard:"ml",donAlert:"mr"}[d.donAddw]; applyPreset(w,pos==="mr"?"tc":pos,CV()); if(d.donAddw==="donAlert"){ w.y=.3 } save(); pushLayout(); renderPage(); return true }
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
 <span style="width:12px"></span>${Object.entries(CANVASES).map(([k,c])=>`<button class="btn sm ${l.canvas===k?"on":""}" data-canvas="${k}">${c.label}</button>`).join("")}<button class="btn sm ${String(l.canvas).startsWith("custom")?"on":""}" data-canvas="custom">${String(l.canvas).startsWith("custom")?canvasOf(l).label:"مقاس مخصص…"}</button>
 <span style="width:12px"></span><select class="inp" data-act="addW" style="width:auto"><option value="">+ إضافة عنصر…</option><option value="@rotation">🔄 الحسابات المتناوبة</option><option value="@single">🌐 حساب منفرد</option><option value="@panel-social">🗂️ عرض جميع الحسابات</option><option value="@lb3">🏆 قائمة Pro — أفضل 3</option><option value="@lb5">🏆 قائمة Pro — أفضل 5</option><option value="@lb10">🏆 قائمة Pro — أفضل 10</option><option value="@lb20">🏆 قائمة Pro — أفضل 20</option><option value="@lbLikes">❤️ قائمة التكبيس Pro</option>${Object.entries(TYPES).filter(([k])=>k!=="social"&&k!=="socialPanel").map(([k,t])=>`<option value="${k}">${t.icon} ${t.label}</option>`).join("")}</select>
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
 el.innerHTML=`<h3>الطبقات</h3>`+ws_.map(w=>`<div class="ly ${S.sel===w.id?"sel":""}" data-selw="${w.id}"><span>${TYPES[w.type].icon}</span><span class="nm">${esc(w.name)}${w.group?` <span class="tag">${esc(w.group)}</span>`:""}</span><button class="ib ${w.visible?"":"off"}" data-tog="visible" data-wid="${w.id}" title="إظهار/إخفاء">👁</button><button class="ib ${w.locked?"":"off"}" data-tog="locked" data-wid="${w.id}" title="قفل">🔒</button></div>`).join("")||'<div class="mut small">لا عناصر</div>';
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
 ${t.pro?proPropsHTML(w,sel,rng):""}
 ${t.rules?rbPropsHTML(w,sel,rng):""}
 ${t.fc?fcPropsHTML(w,sel,rng):""}${t.le?lePropsHTML(w,sel,rng):""}${t.chat?ucPropsHTML(w,sel,rng):""}${t.np?`<div class="grid g2" style="gap:8px">${sel("design","التصميم",NP_DESIGNS.map(d=>[d.id,d.name+" — "+d.ar]),w.design)}${sel("showBy","اسم طالب الأغنية",[["1","ظاهر"],["0","مخفي"]],w.showBy!==false?"1":"0")}${rng("fontScale","حجم النص",.6,2,.05,w.fontScale||1,v=>Math.round(v*100)+"%")}<div class="fld"><label>اللون</label><input type="color" data-wf="accent" data-wid="${w.id}" value="${w.accent||"#7cc4ff"}"></div></div><div class="row" style="margin-bottom:10px"><button class="btn sm" data-lecopy="${w.id}">🔗 نسخ رابط OBS</button><button class="btn sm" data-lib="${w.id}">🎨 التصاميم</button></div>`:""}${t.dt?dtPropsHTML(w,sel,rng):""}
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
 ${rng("fontScale","حجم النصوص",.5,1.8,.05,w.fontScale,v=>Math.round(v*100)+"%")}${t.board||w.type==="lb"?rng("avatarScale","حجم الصور",.4,1.5,.05,w.avatarScale,v=>Math.round(v*100)+"%"):""}
 ${rng("gap","المسافات",0,40,1,w.gap)}${rng("opacity","الشفافية",.1,1,.05,w.opacity,v=>Math.round(v*100)+"%")}${rng("rot","التدوير",-180,180,1,w.rot||0,v=>v+"°")}<div class="fld"><label>التجميع (تتحرك العناصر معاً)</label><select class="inp" data-wgroup="${w.id}"><option value="">بدون مجموعة</option>${[...new Set(L().widgets.map(x=>x.group).filter(Boolean))].map(g=>`<option value="${esc(g)}" ${w.group===g?"selected":""}>${esc(g)} (${L().widgets.filter(x=>x.group===g).length})</option>`).join("")}<option value="@new">+ مجموعة جديدة…</option></select></div>
 <div class="grid g2" style="gap:8px"><div class="fld"><label>لون التمييز</label><input type="color" data-wf="acc" data-wid="${w.id}" value="${w.acc||"#e8c46a"}"></div><div class="fld"><label>لون النص</label><input type="color" data-wf="tx" data-wid="${w.id}" value="${w.tx||"#ffffff"}"></div></div>
 <div class="grid g2" style="gap:8px">${sel("anim","حركة الدخول",[["slide","انزلاق"],["fade","تلاشي"],["zoom","تكبير"],["none","بدون"]],w.anim)}${sel("effects","المؤثرات",[["1","مفعّلة"],["0","متوقفة"]],w.effects?"1":"0")}</div>
 <div class="fld"><label>ترتيب الطبقات</label><div class="row"><button class="btn sm" data-z="front">⬆ للأمام</button><button class="btn sm" data-z="back">⬇ للخلف</button></div></div>
 <div class="row"><button class="btn sm ${w.visible?"":"on"}" data-tog="visible" data-wid="${w.id}">${w.visible?"👁 إخفاء":"👁 إظهار"}</button><button class="btn sm ${w.locked?"on":""}" data-tog="locked" data-wid="${w.id}">${w.locked?"🔓 فك القفل":"🔒 قفل المكان"}</button><button class="btn sm" data-dupw>نسخ</button><button class="btn sm dng" data-delw>حذف</button></div>`;
 if(t.dt) mountDtPreview(w);
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
 const grp=!resize&&w.group?L().widgets.filter(x=>x!==w&&x.group===w.group&&!x.locked).map(x=>({x,ox:x.x,oy:x.y})):[];
 const move=ev=>{ const cv=CV(); const dx=(ev.clientX-d.sx)/stageScale/cv.w, dy=(ev.clientY-d.sy)/stageScale/cv.h;
  const s=v=>Math.round(v*1000)/1000;
  if(resize){ w.w=s(clamp(d.ow+dx,.05,1-w.x)); w.h=s(clamp(d.oh+dy,.02,1-w.y)) }
  else { w.x=s(clamp(d.ox+dx,0,1-w.w)); w.y=s(clamp(d.oy+dy,0,1-w.h)); w.pos="custom"; showGuides(S.settings.snap!==false&&!ev.altKey&&!grp.length?snapMove(w,cv):null);
   const rx=w.x-d.ox, ry=w.y-d.oy; for(const g of grp){ g.x.x=s(clamp(g.ox+rx,0,1-g.x.w)); g.x.y=s(clamp(g.oy+ry,0,1-g.x.h)); g.x.pos="custom"; refreshView(g.x) } }
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
 try{ if(window.__lbIO) window.__lbIO.disconnect(); window.__lbIO=new IntersectionObserver(es=>es.forEach(en=>en.target.classList.toggle("pv-off",!en.isIntersecting)),{rootMargin:"200px"}); setTimeout(()=>document.querySelectorAll("#lib .pv").forEach(b=>window.__lbIO.observe(b)),0) }catch(e){}
 const pool=l.widgets.filter(w=>libPool(w,tab));
 const tgt=pool.find(w=>w.id===S.libTarget)||pool[0];
 document.querySelectorAll("[data-pv]").forEach(box=>{
  if(tab==="socials"){ const cv={w:600,h:360}; const acc=S.socials.accounts[0]; const card=box.dataset.pv==="card";
   const w=newWidget("social",{id:"pv_"+box.dataset.pv,design:box.dataset.pv,mode:"single",accountId:(tgt&&tgt.accountId)||(acc&&acc.id)||"",x:card?.3:.06,y:card?.18:.36,w:card?.4:.88,h:card?.64:.28,enter:tgt?tgt.enter:"slideRight"});
   const stg=document.createElement("div"); stg.className="stage"; stg.style.cssText=`width:${cv.w}px;height:${cv.h}px;background:none`; const sc=Math.min(box.clientWidth/cv.w,box.clientHeight/cv.h); stg.style.transform=`scale(${sc})`; stg.style.left=(box.clientWidth-cv.w*sc)/2+"px"; stg.style.top=(box.clientHeight-cv.h*sc)/2+"px"; box.appendChild(stg);
   const v=new View(w,cv,{globalFx:S.settings.fx,mute:true,data:SRC}); stg.appendChild(v.el); liveViews.add(v); return }
  if(tab==="nowplay"){ const cv={w:520,h:200}; const w=newWidget("nowplay",{id:"pv_"+box.dataset.pv,design:box.dataset.pv,x:.03,y:.1,w:.94,h:.8});
   const stg=document.createElement("div"); stg.className="stage"; stg.style.cssText=`width:${cv.w}px;height:${cv.h}px;background:none`; const sc=Math.min(box.clientWidth/cv.w,box.clientHeight/cv.h); stg.style.transform=`scale(${sc})`; stg.style.left=(box.clientWidth-cv.w*sc)/2+"px"; stg.style.top=(box.clientHeight-cv.h*sc)/2+"px"; box.appendChild(stg);
   const v=new View(w,cv,{mute:true}); stg.appendChild(v.el); liveViews.add(v); return }
  if(tab==="uchat"){ const cv={w:520,h:420}; const w=newWidget("uchat",{id:"pv_"+box.dataset.pv,design:box.dataset.pv,x:.02,y:.02,w:.96,h:.96,max:5,mode:tgt?tgt.mode:"all"});
   const stg=document.createElement("div"); stg.className="stage"; stg.style.cssText=`width:${cv.w}px;height:${cv.h}px;background:none`; const sc=Math.min(box.clientWidth/cv.w,box.clientHeight/cv.h); stg.style.transform=`scale(${sc})`; stg.style.left=(box.clientWidth-cv.w*sc)/2+"px"; stg.style.top=(box.clientHeight-cv.h*sc)/2+"px"; box.appendChild(stg);
   const v=new View(w,cv,{mute:true}); stg.appendChild(v.el); liveViews.add(v); return }
  if(tab==="levent"){ const cv={w:520,h:420}; const k=S.leKind||(tgt&&tgt.kind)||"follow"; const w=newWidget("levent",{id:"pv_"+box.dataset.pv+"_"+k,design:box.dataset.pv,kind:k,x:.02,y:.02,w:.96,h:.96,frame:tgt?tgt.frame:"auto",card:tgt?tgt.card:"clear",palette:tgt?tgt.palette:"",title:tgt&&tgt.kind===k?tgt.title:"",msg:tgt&&tgt.kind===k?tgt.msg:""});
   const stg=document.createElement("div"); stg.className="stage"; stg.style.cssText=`width:${cv.w}px;height:${cv.h}px;background:none`; const sc=Math.min(box.clientWidth/cv.w,box.clientHeight/cv.h); stg.style.transform=`scale(${sc})`; stg.style.left=(box.clientWidth-cv.w*sc)/2+"px"; stg.style.top=(box.clientHeight-cv.h*sc)/2+"px"; box.appendChild(stg);
   const v=new View(w,cv,{globalFx:S.settings.fx,mute:true}); stg.appendChild(v.el); liveViews.add(v); return }
  if(tab==="fcount"){ const cv={w:520,h:300}; const w=newWidget("fcount",{id:"pv_"+box.dataset.pv,design:box.dataset.pv,platform:tgt?tgt.platform:"tiktok",accountId:tgt?tgt.accountId:"",x:.04,y:.06,w:.92,h:.88,goalOn:S.fcGoalPv!=="0",goal:510000,goalStart:490000,goalAuto:true,goalRemain:true,goalStyle:tgt&&tgt.goalStyle||"bar",showLast:false});
   const stg=document.createElement("div"); stg.className="stage"; stg.style.cssText=`width:${cv.w}px;height:${cv.h}px;background:none`; const sc=Math.min(box.clientWidth/cv.w,box.clientHeight/cv.h); stg.style.transform=`scale(${sc})`; stg.style.left=(box.clientWidth-cv.w*sc)/2+"px"; stg.style.top=(box.clientHeight-cv.h*sc)/2+"px"; box.appendChild(stg);
   const v=new View(w,cv,{globalFx:S.settings.fx,mute:true}); v._pv={value:500000,session:125,source:"manual",verified:false,at:Date.now()}; stg.appendChild(v.el); liveViews.add(v); v.refreshFc({C:{followers:{[w.platform]:v._pv}},SO:S.socials},true); return }
  if(tab==="rules"){ const cv={w:500,h:440}; const w=newWidget("srules",{id:"pv_"+box.dataset.pv,design:box.dataset.pv,mode:tgt?tgt.mode:"list",x:.03,y:.03,w:.94,h:.94,title:tgt?tgt.title:TYPES.srules.title,maxRules:6,tickerDir:tgt?tgt.tickerDir:"h"});
   const stg=document.createElement("div"); stg.className="stage"; stg.style.cssText=`width:${cv.w}px;height:${cv.h}px;background:none`; const sc=Math.min(box.clientWidth/cv.w,box.clientHeight/cv.h); stg.style.transform=`scale(${sc})`; stg.style.left=(box.clientWidth-cv.w*sc)/2+"px"; stg.style.top=(box.clientHeight-cv.h*sc)/2+"px"; box.appendChild(stg);
   const v=new View(w,cv,{globalFx:S.settings.fx,mute:true,data:SRC}); stg.appendChild(v.el); liveViews.add(v); return }
  if(tab==="pro"||tab==="goals"){ const pro=tab==="pro", dd=pro?lbDesignOf(box.dataset.pv):(SG_DESIGNS.find(x=>x.id===box.dataset.pv)||SG_DESIGNS[0]);
   const cv=pro?{w:540,h:640}:dd.vg?{w:420,h:440}:{w:600,h:dd.shape==="ring"||dd.shape==="vertical"?400:200};
   const n=pro?(tgt?Math.min(tgt.topN,5):5):0, n2=n===1?1:n<=3?3:5;
   const w=pro?newWidget("lb",{id:"pv_"+box.dataset.pv,design:dd.id,topN:n2,x:.04,y:.03,w:.92,h:.94,title:tgt?tgt.title:"أفضل الداعمين",source:tgt?tgt.source:"gifts",icon:tgt?tgt.icon:"",rankColors:null,avShape:tgt?tgt.avShape:"circle"})
    :dd.vg?newWidget("sgoal",{id:"pv_"+dd.id,design:dd.id,source:"custom",base:S.gpct??60,target:100,title:tgt?tgt.title:"هدف الأسد",icon:tgt?tgt.icon:"🦁",stages:tgt?tgt.stages:"25,50,75,90",fx:tgt?tgt.fx:"",x:.04,y:.02,w:.92,h:.96}):newWidget("sgoal",{id:"pv_"+dd.id,design:dd.id,source:"custom",base:7,target:10,title:tgt?tgt.title:"هدف الأسد",icon:tgt?tgt.icon:"",x:dd.shape==="ring"?.3:dd.shape==="vertical"?.4:.05,y:dd.shape==="ring"||dd.shape==="vertical"?.08:.3,w:dd.shape==="ring"?.4:dd.shape==="vertical"?.2:.9,h:dd.shape==="ring"||dd.shape==="vertical"?.84:.4});
   const stg=document.createElement("div"); stg.className="stage"; stg.style.cssText=`width:${cv.w}px;height:${cv.h}px;background:none`; const sc=Math.min(box.clientWidth/cv.w,box.clientHeight/cv.h); stg.style.transform=`scale(${sc})`; stg.style.left=(box.clientWidth-cv.w*sc)/2+"px"; stg.style.top=(box.clientHeight-cv.h*sc)/2+"px"; box.appendChild(stg);
   const v=new View(w,cv,{globalFx:S.settings.fx,mute:true}); stg.appendChild(v.el); if(v.vg) liveViews.add(v); v.refresh(pro?{preview:sample(w.source==="likes"?"likes":"gifts"),D:emptyData()}:{D:emptyData()},true); return }
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
function changed(w,full){ save(); pushLayout(); if(S.page==="studio"){ refreshView(w); if(full){renderProps();renderLayers()} else if(w.type==="donText") mountDtPreview(w) } else renderPage(true) }
function addLB(k){ const likes=k==="Likes", n=likes?5:+k||5; const [ww,hh]=LB_SIZE[n]; const w=addWidget("lb",{topN:n,w:ww,h:hh,source:likes?"likes":"gifts",design:likes?"roseAura":"pinkCloud",title:likes?"أفضل المكبسين":"أفضل الداعمين",name:likes?"قائمة التكبيس Pro":"قائمة Pro — أفضل "+n,icon:likes?"❤️":""}); applyPreset(w,likes?"mr":"ml",CV()); save(); pushLayout(); return w }
function addWidget(type,extra={}){ const cv=CV(); const w=newWidget(type,{z:Math.max(0,...L().widgets.map(x=>x.z))+1,...extra}); applyPreset(w,isClock(w)?"tc":"mr",cv); L().widgets.push(w); S.sel=w.id; save(); pushLayout(); toast("تمت إضافة "+TYPES[type].label); return w }
function setPath(obj,path,v){ const k=path.split("."); let o=obj; for(let i=0;i<k.length-1;i++) o=o[k[i]]=o[k[i]]||{}; o[k[k.length-1]]=v }
function saConfig(cfg){ clockOp("subathon","config",{config:cfg}) }
function onClick(e){
 const t=e.target.closest("button,[data-pick],[data-selw],[data-anim-try],[data-sdesign],[data-idle-set],a"); if(!t) return;
 const d=t.dataset;
 if(socClick(t,d)) return;
 if(botsClick(t,d)) return;
 if(fcClick(t,d)) return;
 if(lbtClick(t,d)) return;
 if(leClick(t,d)) return;
 if(connClick(t,d)) return;
 if(layersClick(t,d)) return;
 if(actClick(t,d)) return;
 if(d.nsave||d.ntest){ commClick(t,d); return }
 if(bioClick(t,d)) return;
 if(psClick(t,d)) return;
 if(billClick(t,d)) return;
 if(faClick(t,d)) return;
 if(alClick(t,d)) return;
 if(musicClick(t,d)) return;
 if(dtClick(t,d)) return;
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
 if(t.hasAttribute("data-lbfav")){ const f=S.settings.lbFav=S.settings.lbFav||[]; const i=f.indexOf(d.lbfav); if(i>=0) f.splice(i,1); else f.push(d.lbfav); save(); t.classList.toggle("on",i<0); return }
 if(t.hasAttribute("data-lbcat")){ S.lbCat=d.lbcat||""; return renderPage() }
 if(t.hasAttribute("data-lbfavonly")){ S.lbFavOnly=!S.lbFavOnly; return renderPage() }
 if(d.rcReset){ const w=findW(d.rcReset); if(w){ w.rankColors=null; changed(w,true) } return }
 if(d.lbDefault){ const w=findW(d.lbDefault); if(w){ const def=newWidget("lb"); for(const k of ["rankColors","rowOpacity","avShape","font","fontScale","avatarScale","gap","lowPerf","icon","tx","acc"]) w[k]=def[k]; changed(w,true); toast("تمت استعادة الإعدادات الافتراضية للتصميم") } return }
 if(d.lbSave){ const w=findW(d.lbSave); if(!w) return; ask("اسم تصميمك","تصميمي "+((S.settings.lbPresets||[]).length+1)).then(name=>{ if(!name) return; (S.settings.lbPresets=S.settings.lbPresets||[]).push({name,design:w.design,rankColors:w.rankColors,rowOpacity:w.rowOpacity,avShape:w.avShape,font:w.font,fontScale:w.fontScale,avatarScale:w.avatarScale,icon:w.icon,lowPerf:w.lowPerf}); save(); toast("تم حفظ تصميمك") }); return }
 if(d.sgZero||d.sgUnzero){ const w=findW(d.sgZero||d.sgUnzero); if(!w) return; if(d.sgZero){ w.offset=sgRaw({...w,offset:0,since:0},SRC()); w.since=Date.now() } else { w.offset=0; w.since=0 } changed(w,true); toast(d.sgZero?"سيبدأ العدّ من الآن":"يُحسب الهدف من بداية البث"); return }
 if(d.sgAdd){ const w=findW(S.sel)||L().widgets.find(x=>x.type==="sgoal"&&x.source==="custom"); if(!w) return; w.base=Math.max(0,(+w.base||0)+(+d.sgAdd)); changed(w,true); return }
 if(t.hasAttribute("data-gcat2")){ S.gcat=d.gcat2||""; return renderPage() }
 if(d.gtest){ const vs=[...liveViews].filter(v=>v.vg&&String(v.w.id).startsWith("pv_")); if(d.gtest==="zero") S.gpct=0; else if(d.gtest==="done") S.gpct=100; else S.gpct=Math.min(100,(S.gpct??60)+8);
  const ev=d.gtest==="sup"?{user:{name:rnd(["محمد","خالد","نورة","سارة"]),avatar:""},gift:"أسد"}:null; for(const v of vs){ v.w.base=S.gpct; if(d.gtest==="zero"){ v.sgDone=null; v.vg.prevCur=null } v.refreshVG({D:emptyData()},d.gtest==="zero",ev) }
  const r=document.querySelector('[data-act="gpct"]'); if(r) r.value=S.gpct; const b=document.getElementById("gpctv"); if(b) b.textContent=S.gpct+"%"; return }
 if(d.addVg){ const w=addWidget("sgoal",{design:d.addVg,w:.36,h:.24,source:"gift",giftKey:"6369",giftEmoji:"🦁",title:"هدف الأسد",target:10}); applyPreset(w,"tr",CV()); save(); pushLayout(); return renderPage() }
 if(d.addRb){ const w=addWidget("srules",{mode:d.addRb,design:d.addRb==="ticker"?"luxuryBlackRules":d.addRb==="cards"?"crystalRules":d.addRb==="compact"?"neonBlueRules":d.addRb==="rotate"?"b6o6Rules":"royalRules",...(d.addRb==="ticker"?{w:.94,h:.05}:d.addRb==="rotate"?{w:.6,h:.07}:d.addRb==="compact"?{w:.9,h:.08}:d.addRb==="cards"?{w:.6,h:.3}:{})}); applyPreset(w,d.addRb==="ticker"?"bc":d.addRb==="list"||d.addRb==="cards"?"mr":"tc",CV()); save(); pushLayout(); return renderPage() }
 if(d.rdel){ return ask("حذف هذه القاعدة؟").then(ok=>{ if(ok) setRules(L=>{ const i=L.findIndex(r=>r.id===d.rdel); if(i>=0) L.splice(i,1) }) }) }
 if(d.rdup){ return setRules(L=>{ const i=L.findIndex(r=>r.id===d.rdup); if(i>=0) L.splice(i+1,0,{...L[i],id:"r_"+uid()}) }) }
 if(d.rmove){ return setRules(L=>{ const i=L.findIndex(r=>r.id===d.rmove), j=i+(+d.dir); if(i>=0&&j>=0&&j<L.length){ const [x]=L.splice(i,1); L.splice(j,0,x) } }) }
 if(d.rtest){ const r=R.C.subathon.rules.list.find(x=>x.id===d.rtest); if(!r) return; if(R.C.subathon.status!=="running") toast("ابدأ السبثون أولاً لتجربة القاعدة");
  const u=simUser(), n=Math.max(1,+r.every||1);
  if(r.kind==="gift"){ const g=GIFTS.find(x=>String(x[2])===String(r.giftId))||(r.minDiamonds>0?["هدية",r.minDiamonds,999]:GIFTS[0]); sim({type:"gift",user:u,gift:r.giftName||g[0],giftId:r.giftId&&r.giftId!=="*"?r.giftId:g[2],diamonds:g[1],value:g[1]*n,count:n}) }
  else if(r.kind==="likes") sim({type:"like",user:u,count:n});
  else if(r.kind==="share"){ for(let i=0;i<n;i++) sim({type:"share",user:simUser(true)}) }
  else if(r.kind==="comment") sim({type:"comment",user:simUser(true),text:r.keyword});
  else if(r.kind==="donation") sim({type:"donation",provider:"test",name:u.name,amount:10*(+r.unit||1),currency:r.currency,message:rnd(["زيد","نقص"])});
  else sim({type:r.kind,user:simUser(true)});
  return toast("🧪 حدث تجريبي — يظهر في السجل بعلامة تجربة") }
 if(d.addLb){ addLB(d.addLb); return renderPage() }
 if(d.add){ addWidget(d.add,t.hasAttribute("data-top1")?{topN:1,title:"أكبر داعم",name:"أكبر داعم",design:"podium",w:.32,h:.18}:{}); return renderPage() }
 if(d.edit){ S.sel=d.edit; return go("studio") }
 if(d.lib){ const w=findW(d.lib); S.libTab=({clock:"clocks",soc:"socials",board:"boards",lb:"pro",sg:"goals",rb:"rules",fc:"fcount",le:"levent",uc:"uchat",np:"nowplay"})[dKind(w)]; S.libTarget=d.lib; return go("library") }
 if(d.pick){ const l=L(); const pool=l.widgets.filter(w=>libPool(w,S.libTab)); const tgt=pool.find(w=>w.id===S.libTarget)||pool[0]; if(!tgt) return toast("أضف عنصراً أولاً"); tgt.design=d.pick; save(); pushLayout(); toast(`«${wdname(tgt)}» ← ${tgt.name} فقط`); return renderPage() }
 if(d.copylink) return copy(overlayURL(L(),d.copylink));
 if(t.hasAttribute("data-copyall")) return copy(overlayURL(L()));
 if(d.selw&&!d.tog) return select(d.selw);
 if(d.tog){ e.stopPropagation(); const w=findW(d.wid); w[d.tog]=!w[d.tog]; return changed(w,true) }
 if(d.pos){ const w=findW(S.sel); if(!w) return; applyPreset(w,d.pos,CV()); return changed(w,true) }
 if(d.z){ const w=findW(S.sel); const zs=L().widgets.map(x=>x.z); w.z=d.z==="front"?Math.max(...zs)+1:Math.min(...zs)-1; if(w.z<0){L().widgets.forEach(x=>x.z+=1-w.z)} L().widgets.forEach(refreshView); return changed(w,true) }
 if(t.hasAttribute("data-tpl-save")){ const w=findW(S.sel); return ask("اسم القالب","قالبي "+((S.socials.templates||[]).length+1)).then(n=>{ if(!n) return; const keys=["design","enter","exit","enterMs","exitMs","delayMs","holdMs","charScale","qMax","mergeAt","soundVol","showLogo","showPlatform","showUser","logoScale","font","acc","tx","opacity","fontScale","speed","dir"]; const o={}; keys.forEach(k=>o[k]=w[k]); (S.socials.templates=S.socials.templates||[]).push({name:n,style:o}); socSave(); renderProps(); toast("تم حفظ القالب") }) }
 if(t.hasAttribute("data-dupw")){ const w=findW(S.sel); const c={...w,id:"w_"+uid(),name:w.name+" (نسخة)",x:clamp(w.x+.03,0,1-w.w),y:clamp(w.y+.03,0,1-w.h),z:w.z+1,pos:"custom"}; L().widgets.push(c); S.sel=c.id; save(); pushLayout(); return renderPage() }
 if(t.hasAttribute("data-delw")){ return ask("حذف هذا العنصر؟").then(ok=>{ if(!ok) return; const l=L(); l.widgets=l.widgets.filter(x=>x.id!==S.sel); S.sel=null; save(); pushLayout(); renderPage() }) }
 if(d.canvas==="custom"){ const l=L(); return ask("العرض × الارتفاع (بالبكسل)",(l.cw||1600)+"×"+(l.ch||900)).then(v=>{ const m=String(v||"").match(/(\d{3,4})\s*[x×*,]\s*(\d{3,4})/); if(!m) return v&&toast("اكتب مثل: 1600×900"); l.cw=+m[1]; l.ch=+m[2]; l.canvas="custom:"+l.cw+"x"+l.ch; save(); pushLayout(); renderPage() }) }
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
 if(d.wgroup!==undefined){ if(e.type!=="change") return; const w=findW(d.wgroup); if(!w) return; if(t.value==="@new") return ask("اسم المجموعة","مجموعة "+(new Set(L().widgets.map(x=>x.group).filter(Boolean)).size+1)).then(n=>{ if(n){ w.group=n.slice(0,30) } save(); renderProps() }); w.group=t.value||""; save(); pushLayout(); return renderProps() }
 if(d.leimg){ if(e.type==="change") leImgInput(t); return }
 if(musicInput(t,d,e)) return;
 if(alInput(t,d,e)) return;
 if(actInput(t,d,e)) return;
 if(commInput(t,d,e)) return;
 if(bioInput(t,d,e)) return;
 if(leMineImport(t,e)) return;
 if(faInput(t,d,e)) return;
 if(psInput(t,d,e)) return;
 if(dtInput(t,d,e)) return;
 if(socInput(t,d,e)) return;
 if(botsInput(t,d,e)) return;
 if(donInput(t,d,e)) return;
 if(d.act==="pickLayout"&&e.type==="change"){ S.active=t.value; S.sel=null; save(); return renderPage() }
 if(d.act==="addW"&&e.type==="change"&&t.value){ if(t.value.startsWith("@lb")) addLB(t.value.slice(3)); else if(t.value.startsWith("@")) addSocialWidget(t.value.slice(1)); else addWidget(t.value); t.value=""; return renderPage() }
 if(d.act==="libTarget"&&e.type==="change"){ S.libTarget=t.value; return renderPage() }
 if(d.act==="tplApply"&&e.type==="change"&&t.value!==""){ const w=findW(S.sel); Object.assign(w,S.socials.templates[+t.value].style); save(); pushLayout(); refreshView(w); renderProps(); return }
 if(d.act==="snap"&&e.type==="change"){ S.settings.snap=t.checked; return save() }
 if(d.act==="gpct"){ S.gpct=+t.value; const b=document.getElementById("gpctv"); if(b) b.textContent=S.gpct+"%"; for(const v of [...liveViews].filter(v=>v.vg&&String(v.w.id).startsWith("pv_"))){ v.w.base=S.gpct; v.refreshVG({D:emptyData()},e.type==="input") } return }
 if(d.rbhide&&e.type==="change"){ const w=findW(d.wid); if(!w) return; const h=new Set(w.hideKinds||[]); if(t.checked) h.delete(d.rbhide); else h.add(d.rbhide); w.hideKinds=[...h]; save(); pushLayout(); if(S.page==="studio") refreshView(w); return }
 if(d.rl&&e.type==="change"){ const id=d.rl, k=d.rk; setRules(L=>{ const r=L.find(x=>x.id===id); if(!r) return;
   if(k.startsWith("amt:")||k.startsWith("unit:")){ const f=k.split(":")[1], card=t.closest("[data-rule]"); const amt=+card.querySelector(`[data-rk="amt:${f}"]`).value||0, unit=+card.querySelector(`[data-rk="unit:${f}"]`).value||1000; r[f]=Math.round(amt*unit); return }
   let v=t.type==="checkbox"?t.checked:t.value;
   if(["dir","every","minDiamonds","perMin","unit","minAmount"].includes(k)) v=+v||0; if(k==="every"||k==="unit") v=Math.max(k==="unit"?0.01:1,v);
   if(k==="show"||k==="sound") v=v==="true";
   if(k==="giftId"){ v=v===""?null:v==="*"?"*":(isNaN(+v)?v:+v); const g=(S.catalog||[]).find(x=>String(x.id)===String(v)), G=GIFTS.find(x=>String(x[2])===String(v)); if(g){ r.giftName=g.name; if(g.image) r.img=g.image } else if(G) r.giftName=G[0]; if(v==="*"){ r.giftName="أي هدية أخرى"; if(!r.perDiamondMs) r.perDiamondMs=1000; r.ms=0 } }
   r[k]=v }); return }
 if(d.act==="rAdd"&&e.type==="change"&&t.value){ const k=t.value; t.value=""; return setRules(L=>L.push(newRule(k,{emoji:RULE_KINDS[k].icon,...(k==="comment"?{keyword:"زيد",ms:10000,userCooldownMs:60000,perMin:10}:{})}))) }
 if(d.act==="rPreset"&&e.type==="change"&&t.value){ const k=t.value; t.value=""; return ask(`استبدال القواعد الحالية بقالب «${RULE_PRESETS[k]}»؟`).then(ok=>{ if(ok){ saConfig({rules:{list:presetRules(k)}}); setTimeout(()=>renderPage(true),60) } }) }
 if(d.sa&&e.type==="change"){ // إعدادات السبثون → أمر config عبر نفس المحرك
  const k=d.sa; let v=t.type==="checkbox"?t.checked:t.value; const cfg={};
  if(k==="initialMin") cfg.initialMs=Math.max(1,+v)*MIN; else if(k==="minMin") cfg.minMs=Math.max(0,+v)*MIN; else if(k==="maxMin") cfg.maxMs=Math.max(0,+v)*MIN; else if(k==="maxTotalMin") cfg.maxTotalMs=Math.max(0,+v)*MIN;
  else if(k==="pauseOnDisconnect"||k==="countWhilePaused") cfg[k]=v==="1";
  else if(k==="scheduledAt") cfg.scheduledAt=v?new Date(v).getTime():null;
  else if(k==="rules.auto"){ cfg.rules={auto:!!v} } else if(k.startsWith("rules.")){ if(t.type==="number") v=+v; setPath(cfg,k,v) } else cfg[k]=v;
  saConfig(cfg); return setTimeout(()=>renderPage(true),60) }
 if(d.gr!==undefined&&e.type==="change"){ const tb=R.C.subathon.rules.gifts.table.map(r=>({...r})); const r=tb[+d.gr]; let v=t.value.trim();
  if(d.gf==="giftId") r.giftId=v===""?null:(isNaN(+v)?v:+v); else if(d.gf==="name") r.name=v; else r[d.gf]=Math.max(0,+v||0);
  saConfig({rules:{gifts:{table:tb}}}); return }
 if(d.tmc&&e.type==="change"){ const cfg={}; if(d.tmc==="durationMin") cfg.durationMs=Math.max(1,+t.value)*MIN; else if(d.tmc==="autoLive") cfg.autoLive=t.value==="1"; else cfg[d.tmc]=t.value; clockOp(d.tmId,"config",{config:cfg}); return }
 if(d.rc!==undefined&&d.wid){ const w=findW(d.wid); if(!w) return; if(!w.rankColors) w.rankColors=[...lbDesignOf(w.design).colors]; w.rankColors[+d.rc]=t.value; save(); pushLayout(); if(S.page==="studio") refreshView(w); return }
 if(d.act==="lbq"){ S.lbQ=t.value; const q=t.value.trim().toLowerCase(); document.querySelectorAll("#lib .libc").forEach(c=>c.style.display=!q||c.dataset.name.includes(q)?"":"none"); return }
 if(d.act==="lbPreset"&&e.type==="change"&&t.value!==""){ const pr=S.settings.lbPresets[+t.value]; const l=L(); const tgt=l.widgets.find(w=>w.id===S.libTarget&&w.type==="lb")||l.widgets.find(w=>w.type==="lb"); if(!tgt) return toast("أضف قائمة Pro أولاً"); const {name,...rest}=pr; Object.assign(tgt,JSON.parse(JSON.stringify(rest))); save(); pushLayout(); toast(`طُبّق «${name}» على ${tgt.name}`); return renderPage(true) }
 if(d.wf){ const w=findW(d.wid); if(!w) return; const f=d.wf; let v=t.type==="checkbox"?t.checked:t.value;
  if(["w","h","fontScale","avatarScale","gap","opacity","topN","target","base","goal","goalStep","goalStart","glow","textScale","dur","avScale","ptN","shineEvery","rot","fs","titleScale","nameScale","amtScale","symScale","gapEm","glowStr","fxN","firstScale","rotSec","numScale","rowOpacity","interval","speed","maxRules","iconScale","animSpeed","enterMs","exitMs","delayMs","speed","cols","logoScale","showSec","gapSec"].includes(f)) v=+v;
  if(["showTitle","showAmb","effects","showSub","sound","repeat","showLogo","showPlatform","showUser","hideAnon","showMessage","useAccStyle","lowPerf","showPct","showHead","showAvatar","showName","showLogo","showNew","showUnit","goalOn","goalAuto","goalRemain","showMsg","showEmblem","showAv","fxHalo","fxKind","showBy","medals","showIcon","showRank","crown1","fx1","shine","showDeco","shadow","glowOn","showLast","showTop","showCount","showWhat","showTime","showImg","animOn","msgRandom","reduceFx"].includes(f)&&t.type!=="checkbox") v=v==="1";
  if(f==="idle"){ v=[v,...((findW(d.wid)||{}).idle||[]).slice(1)].filter(Boolean) }
  if(t.type==="range"&&e.type==="change") return;
  if((t.tagName==="SELECT"||t.type==="number"||t.type==="checkbox")&&e.type==="input") return;
  w[f]=v;
  if(w.type==="lb"&&f==="topN"&&LB_SIZE[v]){ [w.w,w.h]=LB_SIZE[v]; w.x=clamp(w.x,0,1-w.w); w.y=clamp(w.y,0,1-w.h) }
  if(w.type==="sgoal"&&f==="giftKey"){ const g=GIFTS.find(x=>String(x[2])===String(v)); w.title=g?"هدف "+g[0]:w.title }
  if(f==="w") w.x=clamp(w.x,0,1-w.w); if(f==="h") w.y=clamp(w.y,0,1-w.h);
  if((f==="w"||f==="h")&&w.pos!=="custom") applyPreset(w,w.pos,CV());
  const lab=document.getElementById("v_"+f); if(lab){ const cv=CV(); lab.textContent=f==="w"?Math.round(v*cv.w)+"px":f==="h"?Math.round(v*cv.h)+"px":["fontScale","avatarScale","opacity","logoScale","rowOpacity"].includes(f)?Math.round(v*100)+"%":["enterMs","exitMs","delayMs"].includes(f)?v+"ms":f==="speed"?v+" px/ث":v }
  save(); pushLayout();
  if(S.page==="studio"){ refreshView(w); if(f==="name") renderLayers(); if(["design","topN","sortBy","showTitle","effects","timerId","mode","repeat","filter","order","source","target","base","tickerDir","stages","levelStages","platform","goalOn"].includes(f)) renderProps() }
  else if(t.tagName==="SELECT"||e.type==="change") renderPage(true);
  return }
 if(d.set&&e.type==="change"){ let v=t.value; if(d.set==="fx") v=v==="1"; if(d.set==="bigGift") v=+v; S.settings[d.set]=v; if(d.set==="perfMode") window.__arshPM=v; save(); return }
 if(d.prof&&e.type==="change"){ S.profile[d.prof]=t.value; save(); return renderPage() }
}
function setConn(){ [["cdot","ctext"]].forEach(([a,b])=>{const dd=document.getElementById(a),tt=document.getElementById(b); if(dd) dd.classList.toggle("ok",wsReady&&liveStatus.live); if(tt) tt.textContent=!wsReady?"وضع التجربة (بدون خادم)":liveStatus.live?"متصل ببث TikTok":"متصل بالخادم"}) }
function startWS(){ if(!S.settings.wsUrl) return toast("اكتب عنوان الخادم أولاً");
 S.wantWS=true; let n=0;
 const go=()=>connectWS(S.settings.wsUrl,S.settings.room,S.settings.key,m=>receive(m,false),(ok,err)=>{ setConn(); if(ok){ n=0; toast("تم الاتصال بالخادم"); pushLayout(); if(S.page==="live") renderPage(true) } else { if(err) toast(err); if(S.wantWS) setTimeout(()=>{ if(S.wantWS&&!wsReady) go() },Math.min(15000,1000*++n)) } });
 go() }

/* ================= مركز البوتات والصوت ================= */
// مشغّل صوت واحد فقط: قفل بين النوافذ (لوحة التحكم ورابط القارئ) حتى لا يُقرأ التعليق مرتين
const VP={q:[],speaking:null,lastUser:null,paused:false,unlocked:false,id:"vp_"+uid(),prio:1,pending:[],spoken:0};
function vpHere(){ return localStorage.getItem("b6o6.voiceHere")!=="0" }
function vpLeader(){ try{ return JSON.parse(localStorage.getItem("b6o6.voiceLeader")||"null") }catch(e){ return null } }
function vpIsPlayer(){ const L=vpLeader(); return vpHere()&&!!L&&L.id===VP.id&&Date.now()-L.t<4000 }
function vpBeat(){ if(!vpHere()) return; const L=vpLeader(), now=Date.now(); if(!L||now-L.t>3500||L.id===VP.id||VP.prio>(L.prio||0)) localStorage.setItem("b6o6.voiceLeader",JSON.stringify({id:VP.id,t:now,prio:VP.prio,where:location.hash.startsWith("#/overlay")?"رابط القارئ":"لوحة التحكم"})) }
function vpInit(prio){ VP.prio=prio; vpBeat(); setInterval(vpBeat,1000); addEventListener("pagehide",()=>{ const L=vpLeader(); if(L&&L.id===VP.id) localStorage.removeItem("b6o6.voiceLeader") }) }
const hasTTS=()=>typeof speechSynthesis!=="undefined"&&typeof SpeechSynthesisUtterance!=="undefined";
function vpVoices(){ if(!hasTTS()) return []; return speechSynthesis.getVoices() }
function vpPush(it){ if(!vpIsPlayer()) return; const B=S.bots; if(it.needApprove){ VP.pending.unshift({...it}); VP.pending.length=Math.min(VP.pending.length,30); if(S.page==="bots"&&S.botTab==="voice") renderPage(true); return }
 vqPush(VP.q,it,B.queue); vpPump() }
function vpSpeak(text,o,cb){ text=String(text??""); if(!text.trim()){ cb&&cb("empty"); return } if(!hasTTS()){ cb&&cb("no-tts"); return } const V=S.bots.voice, pr=VOICE_PRESETS.find(x=>x[0]===(o.preset||V.preset))||VOICE_PRESETS[0];
 const u=new SpeechSynthesisUtterance(text); const vs=vpVoices(); const v=vs.find(x=>x.name===(o.voiceName??V.voiceName))||vs.find(x=>x.lang&&x.lang.toLowerCase().startsWith(o.lang||V.lang||"ar"));
 if(v){ u.voice=v; u.lang=v.lang } else u.lang=(o.lang||V.lang)==="en"?"en-US":"ar-SA";
 u.rate=Math.max(.1,Math.min(10,(+V.rate||1)*pr[2])); u.pitch=Math.max(0,Math.min(2,(+V.pitch||1)*pr[3])); u.volume=Math.max(0,Math.min(1,+V.volume??1));
 let done=false; const fin=e=>{ if(done) return; done=true; cb&&cb(e) }; u.onend=()=>fin(); u.onerror=e=>fin(e.error||"error");
 setTimeout(()=>fin("timeout"),Math.max(8000,text.length*180)); speechSynthesis.speak(u) }
function vpPump(){ if(VP.paused||VP.speaking||S.bots.voice.muted) return; const it=vqNext(VP.q,S.bots.queue,VP.lastUser); if(!it) return;
 VP.speaking=it; vpUI(); vpSpeak(it.speech,{},err=>{ VP.spoken++; VP.lastUser=it.user&&it.user.name; VP.speaking=null; vpUI(); setTimeout(vpPump,(+S.bots.reader.gap||0)*1000+150) }) }
function vpUI(){ const e=document.getElementById("vp-now"); if(e) e.textContent=VP.speaking?("🔊 "+VP.speaking.speech):"—"; const q=document.getElementById("vp-q"); if(q) q.innerHTML=VP.q.map((x,i)=>`<div class="row" style="justify-content:space-between"><span>${x.prio>=3?"⭐":""} ${esc(x.speech)}</span><button class="btn sm dng" data-vpdel="${i}">حذف</button></div>`).join("")||'<span class="mut small">قائمة الانتظار فارغة</span>' }
const BOT_TABS=[["status","📊 الحالة"],["commands","⌨️ الأوامر"],["replies","💬 الردود التلقائية"],["thanks","🎁 الشكر والمتابعات"],["periodic","⏰ الرسائل الدورية"],["voice","🔊 القارئ الصوتي"],["mod","🛡️ الفلترة"],["log","📜 السجل والإحصائيات"],["test","🧪 التجربة"]];
const CAP_TAG={full:["تعمل بالكامل","ok"],overlay:["تعمل داخل Overlay","ok"],provider:["تحتاج مزود TTS/AI","warn"],tiktok:["تعتمد على تكامل TikTok","warn"],unavailable:["غير متاحة حالياً","bad"]};
function botsHTML(){ const B=S.bots, tab=S.botTab, st=S.botStats||{};
 const fld=(path,label,type="text",extra="",val)=>{ const v=val!==undefined?val:getPath(B,path); return `<div class="fld" style="margin:0"><label>${label}</label>${type==="area"?`<textarea class="inp" rows="3" data-bp="${path}" ${extra}>${esc(v??"")}</textarea>`:`<input class="inp" type="${type}" data-bp="${path}" value="${esc(v??"")}" ${extra}>`}</div>` };
 const tog=(path,label)=>`<label class="row small" style="gap:6px"><input type="checkbox" data-bp="${path}" data-bt="bool" ${getPath(B,path)?"checked":""}> ${label}</label>`;
 const sel=(path,label,opts)=>`<div class="fld" style="margin:0"><label>${label}</label><select class="inp" data-bp="${path}">${opts.map(o=>`<option value="${o[0]}" ${String(getPath(B,path))===String(o[0])?"selected":""}>${o[1]}</option>`).join("")}</select></div>`;
 const outs=(base)=>`<div class="row" style="gap:12px">${tog(base+".say","🔊 قراءة صوتية")}${tog(base+".show","🖥️ عرض في Overlay")}</div>`;
 const varsHelp=`<details class="small"><summary class="mut" style="cursor:pointer">المتغيرات الحية</summary><div class="row" style="gap:6px;margin-top:6px">${VARS.map(v=>`<span class="tag" title="${v[1]}" dir="ltr">${v[0]}</span>`).join("")}</div><p class="mut small">إذا غابت البيانات (مثلاً لا يوجد هدف) يُستخدم «النص البديل» بدل اختراع قيمة.</p></details>`;
 let body="";
 if(tab==="status"){ const L=vpLeader();
  body=`<div class="grid g3">${Object.entries(BOT_TYPES).map(([k,x])=>`<div class="card"><h3><span>${x.icon} ${x.label}</span>${k==="ai"?'<span class="tag warn">يحتاج مزود AI</span>':`<label class="row small" style="gap:4px"><input type="checkbox" data-bp="status.${k}" data-bt="bool" ${B.status[k]?"checked":""}> ${B.status[k]?"يعمل":"متوقف"}</label>`}</h3>
   <p class="mut small">${({commands:`${B.commands.filter(c=>c.enabled).length} أمر مفعّل`,replies:`${B.replies.filter(c=>c.enabled).length} رد تلقائي`,thanks:"شكر الهدايا والدونيشن وأول دعم",follows:"المتابعات والاشتراكات",welcome:"يعتمد على حدث دخول المشاهدين",periodic:`${B.periodic.items.filter(c=>c.enabled).length} رسالة — تعمل أثناء البث المتصل`,reader:READ_MODES.find(m=>m[0]===B.reader.mode)[1],ai:"المرحلة القادمة: يحتاج مفتاح مزود على الخادم"})[k]}</p></div>`).join("")}</div>
  <div class="grid g2" style="margin-top:14px"><div class="card"><h3>⚙️ إعدادات عامة</h3><div class="grid g2" style="gap:8px">${fld("name","اسم البوت")}<div>${tog("enabled","🤖 البوتات مفعّلة")}${tog("output.say","🔊 القراءة الصوتية مسموحة")}${tog("output.show","🖥️ العرض في Overlay مسموح")}${tog("demoLive","🧪 اعتبر البث متصلاً في وضع التجربة (للرسائل الدورية)")}</div></div>
   <div class="note small" style="margin-top:8px">🔊 مشغّل الصوت الحالي: <b>${L&&Date.now()-L.t<4000?esc(L.where||""):"لا يوجد"}</b> ${vpIsPlayer()?"(هذه النافذة)":""} — يُشغَّل الصوت من مصدر واحد فقط حتى لا يتكرر.</div></div>
   <div class="card"><h3>📋 تقرير الإمكانيات الحقيقي</h3><table><tbody>${CAPABILITY.map(c=>`<tr><td>${c[0]}</td><td><span class="tag ${CAP_TAG[c[1]][1]}">${CAP_TAG[c[1]][0]}</span></td></tr><tr><td colspan="2" class="mut small" style="padding-top:0">${c[2]}</td></tr>`).join("")}</tbody></table></div></div>
   <div class="card" style="margin-top:14px"><h3>🖥️ عنصر الردود في البث <span class="tag">شفاف · رابط OBS مستقل</span></h3>${L_().widgets.filter(w=>w.type==="botbox").map(w=>widgetQuick(w)).join("")||'<div class="empty">لا يوجد عنصر ردود في هذا التخطيط</div>'}<button class="btn sm pri" data-add="botbox" style="margin-top:8px">+ إضافة عنصر ردود البوت</button></div>` }
 else if(tab==="commands"){ body=`<div class="card" style="margin-bottom:12px"><div class="row" style="justify-content:space-between"><b>الأوامر تبدأ بـ «!» — الرد يظهر في Overlay ويُقرأ صوتياً (لا يُرسل لشات TikTok)</b><button class="btn sm pri" data-badd="commands">+ أمر جديد</button></div>${varsHelp}</div>
  <div class="grid g2">${B.commands.map((c,i)=>`<div class="card ${c.enabled?"":"rl off"}"><h3><span dir="auto">${esc(c.name)}</span><span class="row" style="gap:6px"><span class="tag">${(st.stats&&st.stats.commands&&st.stats.commands[c.name])||0} استخدام</span>${tog(`commands.${i}.enabled`,"مفعّل")}</span></h3>
   <div class="grid g2" style="gap:8px">${fld(`commands.${i}.name`,"اسم الأمر")}${fld(`commands.${i}.desc`,"الوصف")}</div>${fld(`commands.${i}.text`,"نص الرد","area")}${fld(`commands.${i}.fallback`,"النص البديل عند غياب البيانات")}
   <div class="grid g3" style="gap:8px">${sel(`commands.${i}.perm`,"الصلاحية",[["all","الجميع"],["sub","المشتركون"],["gifter","الداعمون"],["mod","المشرفون"]])}${fld(`commands.${i}.cooldownMs`,"انتظار عام (ms)","number")}${fld(`commands.${i}.userCooldownMs`,"انتظار لكل مستخدم (ms)","number")}</div>
   ${outs(`commands.${i}`)}<div class="row" style="margin-top:6px"><button class="btn sm" data-btry="${esc(c.name)}">🧪 جرّب</button><button class="btn sm dng" data-bdel="commands.${i}">حذف</button></div></div>`).join("")}</div>` }
 else if(tab==="replies"){ body=`<div class="card" style="margin-bottom:12px"><div class="row" style="justify-content:space-between"><b>المطابقة تتجاهل الهمزات والتشكيل وحالة الحروف</b><button class="btn sm pri" data-badd="replies">+ رد جديد</button></div>${varsHelp}</div>
  <div class="grid g2">${B.replies.map((r,i)=>`<div class="card ${r.enabled?"":"rl off"}"><h3><span>«${esc(r.keyword)}»</span>${tog(`replies.${i}.enabled`,"مفعّل")}</h3>
   <div class="grid g2" style="gap:8px">${fld(`replies.${i}.keyword`,"الكلمة")}${sel(`replies.${i}.match`,"الشرط",MATCH_MODES)}</div>${fld(`replies.${i}.replies`,"الردود (سطر لكل رد — يُختار عشوائياً)","area",'data-bt="lines"',(r.replies||[]).join("\n"))}
   <div class="grid g3" style="gap:8px">${fld(`replies.${i}.perMin`,"حد بالدقيقة","number")}${fld(`replies.${i}.cooldownMs`,"انتظار (ms)","number")}<div style="align-self:end">${tog(`replies.${i}.oncePerUser`,"مرة لكل مستخدم")}</div></div>
   ${outs(`replies.${i}`)}<div class="row" style="margin-top:6px"><button class="btn sm" data-btry="${esc(r.keyword)}">🧪 جرّب</button><button class="btn sm dng" data-bdel="replies.${i}">حذف</button></div></div>`).join("")}</div>` }
 else if(tab==="thanks"){ const T=B.thanks, F=B.follows, W=B.welcome;
  body=`<div class="grid g2"><div class="card"><h3>🎁 شكر الهدايا ${tog("thanks.gift.enabled","مفعّل")}</h3>${fld("thanks.gift.tpl","الرسالة العامة","area")}${fld("thanks.gift.minDiamonds","الحد الأدنى للقيمة (💎)","number")}
   <div class="ttl" style="margin:8px 0">رسائل خاصة لهدايا محددة</div>${(T.gift.byGift||[]).map((g,i)=>`<div class="grid g2" style="gap:6px;margin-bottom:6px"><select class="inp" data-bp="thanks.gift.byGift.${i}.giftId">${GIFTS.map(x=>`<option value="${x[2]}" ${String(g.giftId)===String(x[2])?"selected":""}>${x[0]}</option>`).join("")}</select><div class="row" style="flex-wrap:nowrap;gap:4px"><input class="inp" data-bp="thanks.gift.byGift.${i}.tpl" value="${esc(g.tpl)}"><button class="btn sm dng" data-bdel="thanks.gift.byGift.${i}">×</button></div></div>`).join("")}<button class="btn sm" data-badd="thanks.gift.byGift">+ رسالة لهدية</button>
   <h3 style="margin-top:14px">💰 شكر الدونيشن ${tog("thanks.donation.enabled","مفعّل")}</h3>${fld("thanks.donation.tpl","الرسالة","area")}${fld("thanks.donation.min","الحد الأدنى للمبلغ","number")}<p class="mut small">بعد تأكيد الدفع فقط.</p>
   <h3 style="margin-top:14px">🥇 أول دعم في البث ${tog("thanks.first.enabled","مفعّل")}</h3>${fld("thanks.first.tpl","الرسالة")}${outs("thanks")}</div>
   <div class="card"><h3>💚 المتابعات ${tog("follows.follow.enabled","مفعّل")}</h3>${fld("follows.follow.tpl","الرسالة")}${fld("follows.follow.perMin","حد بالدقيقة","number")}
   <h3 style="margin-top:14px">⭐ الاشتراكات ${tog("follows.subscribe.enabled","مفعّل")}</h3>${fld("follows.subscribe.tpl","الرسالة")}<p class="mut small">تصل فقط للحسابات المفعّل لها الاشتراك في TikTok.</p>${outs("follows")}
   <h3 style="margin-top:14px">👋 الترحيب عند الدخول ${tog("status.welcome","مفعّل")}</h3><div class="note small">⚠️ يعتمد على حدث دخول المشاهدين من المكتبة غير الرسمية؛ غير مؤكد حتى يصل فعلاً من بث حقيقي.</div>
   ${fld("welcome.tpls","رسائل الترحيب (سطر لكل رسالة)","area",'data-bt="lines"',(W.tpls||[]).join("\n"))}<div class="grid g2" style="gap:8px">${fld("welcome.perMin","حد بالدقيقة","number")}${fld("welcome.users","أشخاص محددون (بفواصل)")}</div>${tog("welcome.onlyKnown","رحّب فقط بالمعروفين (داعمون/مشرفون/المحددون)")}${outs("welcome")}</div></div>` }
 else if(tab==="periodic"){ const P=B.periodic;
  body=`<div class="card" style="margin-bottom:12px"><div class="grid g3" style="gap:8px">${sel("periodic.order","الترتيب",[["seq","بالتسلسل"],["random","عشوائي"]])}${fld("periodic.minChatPerMin","لا ترسل إذا قلّت التعليقات عن (بالدقيقة)","number")}${fld("periodic.minGapSinceBotMs","مهلة بعد آخر رد للبوت (ms)","number")}${fld("periodic.maxPerStream","أقصى عدد بالبث (0 = بلا حد)","number")}${fld("periodic.pauseOnBigMs","إيقاف بعد دعم كبير (ms)","number")}<div style="align-self:end">${outs("periodic")}</div></div>
   <p class="mut small">تعمل أثناء البث المتصل فقط (في التجربة: فعّل «اعتبر البث متصلاً» من الحالة). لا تُكرر نفس الرسالة مباشرة، وتتوقف عند انتهاء البث.</p></div>
   ${P.items.map((it,i)=>`<div class="card ${it.enabled?"":"rl off"}" style="margin-bottom:8px"><div class="grid g3" style="gap:8px;align-items:end"><div style="grid-column:span 2">${fld(`periodic.items.${i}.text`,"الرسالة")}</div>${sel(`periodic.items.${i}.everyMin`,"كل",[[1,"دقيقة"],[3,"3 دقائق"],[5,"5 دقائق"],[10,"10 دقائق"],[15,"15 دقيقة"],[20,"20 دقيقة"],[30,"30 دقيقة"],[60,"ساعة"]])}</div><div class="row" style="margin-top:6px">${tog(`periodic.items.${i}.enabled`,"مفعّلة")}<button class="btn sm dng" data-bdel="periodic.items.${i}">حذف</button></div></div>`).join("")}<button class="btn sm pri" data-badd="periodic.items">+ رسالة دورية</button>${varsHelp}` }
 else if(tab==="voice"){ const V=B.voice, Rd=B.reader, Q=B.queue, vs=vpVoices(), ar=vs.filter(v=>/^ar/i.test(v.lang)), en=vs.filter(v=>/^en/i.test(v.lang)), L=vpLeader();
  body=`<div class="grid g2"><div class="card"><h3>🔊 المشغّل ${tog("status.reader","قراءة التعليقات مفعّلة")}</h3>
   <div class="note small">${!hasTTS()?"❌ هذا المتصفح لا يدعم القراءة الصوتية.":vs.length?`✅ القراءة عبر أصوات المتصفح (Web Speech) — ${ar.length} صوت عربي و${en.length} إنجليزي على هذا الجهاز.${ar.length?"":" ⚠️ لا يوجد صوت عربي مثبت على هذا الجهاز؛ ثبّت حزمة اللغة العربية من إعدادات النظام."}`:"⏳ جارٍ تحميل الأصوات… أعد فتح التبويب."}<br>أصوات الذكاء الاصطناعي الطبيعية (ومنها السعودية): تحتاج مزود TTS بمفتاح على الخادم — غير مفعّلة.</div>
   <label class="row" style="gap:6px;margin-top:8px"><input type="checkbox" data-vphere ${vpHere()?"checked":""}> هذا الجهاز يشغّل الصوت</label>
   <p class="mut small">المشغّل الحالي: <b>${L&&Date.now()-L.t<4000?esc(L.where||""):"لا يوجد"}</b>${vpIsPlayer()?" (هذه النافذة)":""}. رابط القارئ له الأولوية على لوحة التحكم.</p>
   <div class="row"><button class="btn sm pri" data-vptest>▶ اختبار الصوت</button><button class="btn sm" data-vppause>${VP.paused?"▶ استئناف":"⏸ إيقاف مؤقت"}</button><button class="btn sm" data-vpskip>⏭ تخطي</button><button class="btn sm dng" data-vpclear>مسح القائمة</button>${tog("voice.muted","🔇 كتم")}</div>
   <div class="ttl" style="margin:10px 0 4px">يُقرأ الآن</div><div id="vp-now" class="small">${VP.speaking?esc(VP.speaking.speech):"—"}</div>
   <div class="ttl" style="margin:10px 0 4px">قائمة الانتظار (${VP.q.length})</div><div id="vp-q" class="small"></div>
   ${VP.pending.length?`<div class="ttl" style="margin:10px 0 4px">بانتظار موافقتك (${VP.pending.length})</div>${VP.pending.map((x,i)=>`<div class="row" style="justify-content:space-between"><span>${esc(x.speech)}</span><span><button class="btn sm pri" data-vpok="${i}">✓ اقرأ</button><button class="btn sm dng" data-vpno="${i}">✕</button></span></div>`).join("")}`:""}</div>
   <div class="card"><h3>🎙️ الصوت</h3><div class="grid g2" style="gap:8px">${sel("voice.lang","اللغة",[["ar","العربية"],["en","English"]])}${sel("voice.voiceName","الصوت",[["","تلقائي حسب اللغة"],...(V.lang==="en"?en:ar).map(v=>[v.name,v.name+(v.localService?"":" (سحابي)")])])}
    ${sel("voice.preset","القالب الصوتي",VOICE_PRESETS.map(p=>[p[0],p[1]]))}${fld("voice.rate","السرعة","number",'step="0.1" min="0.3" max="3"')}${fld("voice.pitch","الطبقة","number",'step="0.1" min="0" max="2"')}${fld("voice.volume","مستوى الصوت (0-1)","number",'step="0.1" min="0" max="1"')}</div>
    <div class="row" style="gap:6px;margin-top:8px">${VOICE_PRESETS.map(p=>`<button class="btn sm" data-vppre="${p[0]}">${p[1]}</button>`).join("")}</div><p class="mut small">القوالب تعتمد على السرعة والطبقة المتاحة في المتصفح (لا مؤثرات صوتية متقدمة بدون مزود).</p>
    <h3 style="margin-top:12px">📖 ماذا يُقرأ</h3><div class="grid g2" style="gap:8px">${sel("reader.mode","الوضع",READ_MODES)}${B.reader.mode==="keyword"?fld("reader.keyword","الكلمة"):B.reader.mode==="prefix"?fld("reader.prefix","الأمر"):B.reader.mode==="users"?fld("reader.users","الأشخاص (بفواصل)"):B.reader.mode==="random"?fld("reader.randomPct","النسبة %","number"):""}
    ${fld("reader.maxLen","أقصى طول (حرف)","number")}${fld("reader.gap","انتظار بين التعليقات (ث)","number")}${sel("reader.emoji","الإيموجي",[["strip","تجاهل"],["keep","تُترك للمتصفح"]])}<div style="align-self:end">${tog("reader.sayName","نطق اسم المستخدم")}</div></div>
    <h3 style="margin-top:12px">⏳ قائمة الانتظار</h3><div class="grid g3" style="gap:8px">${fld("queue.max","الحد الأقصى","number")}${fld("queue.expireSec","صلاحية التعليق (ث)","number")}<div style="align-self:end">${tog("queue.noSameUserRow","لا نفس المستخدم متتالياً")}${tog("queue.fair","ترتيب عادل")}</div></div>
    <p class="mut small">الأولوية: المشرفون ثم المشتركون (عند توفر الصفة) ثم الداعمون ثم المشاهدون.</p></div></div>` }
 else if(tab==="mod"){ body=`<div class="grid g2"><div class="card"><h3>🛡️ الفلترة قبل القراءة والرد</h3>${fld("mod.banned","كلمات ممنوعة (بفواصل)","area")}${fld("mod.blockedUsers","مستخدمون محظورون من القراءة (بفواصل)","area")}
  <div class="grid g2" style="gap:8px">${fld("mod.maxLen","أقصى طول","number")}${fld("mod.perUserPerMin","تعليقات لكل مستخدم بالدقيقة","number")}${fld("mod.dupWindowMs","منع التكرار خلال (ms)","number")}</div>
  ${tog("mod.noLinks","حذف الروابط")}${tog("mod.noPhones","حذف أرقام الهواتف")}${tog("mod.noRepeat","تقليص الأحرف المكررة")}</div>
  <div class="card"><h3>ملاحظة</h3><p class="mut">الفلترة تمنع القراءة والعرض والرد فقط. الحظر أو الحذف داخل TikTok غير متاح لعدم وجود صلاحية رسمية.</p><p class="mut small">للمراجعة اليدوية قبل القراءة: اختر وضع «بعد موافقتي» في القارئ الصوتي.</p></div></div>` }
 else if(tab==="log"){ const s2=(st.stats)||{}; const log=(S.botFeed||[]);
  body=`<div class="grid g4" style="margin-bottom:12px">${[["التعليقات المستقبلة",s2.received],["المحجوبة بالفلترة",s2.filtered],["المقروءة",s2.read],["الردود التلقائية",s2.replies],["رسائل الشكر",s2.thanks],["المتابعات/الاشتراكات",s2.follows],["الترحيب",s2.welcome],["الدورية",s2.periodic],["قُرئت صوتياً هنا",VP.spoken],["الأخطاء",s2.errors]].map(x=>stat(x[0],x[1]??0)).join("")}</div>
  <div class="card"><h3>آخر مخرجات البوتات <span class="tag">${log.length}</span></h3><div class="feed">${log.slice(0,80).map(x=>`<div>${x.test?"🧪 ":""}<b>${BOT_KIND_LABEL[x.kind]||"🤖"}</b> ${esc(x.text)} ${x.say?"🔊":""}${x.show?"🖥️":""} <span class="mut small">— ${dt(x.at)}</span> <button class="btn sm" data-bcopy="${esc(x.text)}" title="نسخ للإرسال اليدوي في شات TikTok">📋</button></div>`).join("")||'<div class="empty">لا توجد مخرجات بعد — جرّب من تبويب التجربة</div>'}</div></div>` }
 else if(tab==="test"){ body=`<div class="card"><h3>🧪 محاكاة <span class="tag">أحداث تجريبية معلّمة — لا تُعتبر حقيقية</span></h3><div class="row">
  <button class="btn sm" data-bsim="hi">💬 تعليق «السلام عليكم»</button><button class="btn sm" data-bsim="mod">🛡️ تعليق مشرف</button><button class="btn sm" data-bsim="sub">⭐ تعليق مشترك</button><button class="btn sm" data-bsim="time">⌨️ !وقت</button><button class="btn sm" data-bsim="goal">⌨️ !هدف</button><button class="btn sm" data-bsim="likes">⌨️ !تكبيس</button>
  <button class="btn sm" data-bsim="rose">🌹 10 وردات</button><button class="btn sm" data-bsim="lion">🦁 أسد</button><button class="btn sm" data-bsim="don">💰 دونيشن 50</button><button class="btn sm" data-bsim="follow">💚 متابعة</button><button class="btn sm" data-bsim="subev">⭐ اشتراك</button><button class="btn sm" data-bsim="join">👋 دخول مشاهد</button><button class="btn sm" data-bsim="spam">🚫 تعليق برابط ورقم</button><button class="btn sm" data-bsim="per">⏰ رسالة دورية الآن</button></div>
  <p class="mut small" style="margin-top:8px">تظهر النتائج في عنصر ردود البوت (الاستوديو/OBS) وتُقرأ من المشغّل الوحيد، وفي «السجل».</p></div>
  <div class="card" style="margin-top:12px"><h3>آخر النتائج</h3><div class="feed">${(S.botFeed||[]).slice(0,12).map(x=>`<div>${x.test?"🧪 ":""}<b>${BOT_KIND_LABEL[x.kind]||"🤖"}</b> ${esc(x.text)}</div>`).join("")||'<div class="empty">—</div>'}</div></div>` }
 return head("🤖 مركز البوتات والذكاء الصوتي","الردود تظهر في Overlay وتُقرأ صوتياً — لا يوجد إرسال لشات TikTok (غير مصرّح)")+`<div class="row" style="margin-bottom:12px">${BOT_TABS.map(t=>`<button class="btn sm ${tab===t[0]?"on":""}" data-btab="${t[0]}">${t[1]}</button>`).join("")}</div>`+body;
}
const L_=()=>L();
function getPath(o,p){ return p.split(".").reduce((a,k)=>a==null?a:a[k],o) }
function botsChanged(full){ save(); pushLayout(); syncBots(); if(full) renderPage(true) }
function botsClick(t,d){
 if(d.btab){ S.botTab=d.btab; renderPage(); if(d.btab==="voice") setTimeout(vpUI,0); return true }
 if(d.badd){ const B=S.bots, arr=getPath(B,d.badd); const id="b_"+uid();
  arr.push(d.badd==="commands"?{id,enabled:true,name:"!جديد",desc:"",text:"",fallback:"",perm:"all",cooldownMs:15000,userCooldownMs:60000,say:true,show:true}:d.badd==="replies"?{id,enabled:true,keyword:"كلمة",match:"contains",replies:["رد"],oncePerUser:true,perMin:5,cooldownMs:0,say:false,show:true}:d.badd==="periodic.items"?{id,enabled:true,text:"رسالة",everyMin:10}:{giftId:GIFTS[0][2],tpl:"شكراً {username} ❤️"}); botsChanged(true); return true }
 if(d.bdel){ const parts=d.bdel.split("."), i=+parts.pop(), arr=getPath(S.bots,parts.join(".")); arr.splice(i,1); botsChanged(true); return true }
 if(d.bcopy!==undefined){ try{ navigator.clipboard.writeText(d.bcopy); toast("نُسخ — الصقه في شات TikTok يدوياً") }catch(e){ toast("تعذر النسخ") } return true }
 if(d.btry){ sim({type:"comment",user:simUser(true),text:d.btry}); toast("🧪 تعليق تجريبي: "+d.btry); return true }
 if(d.bsim){ const u=simUser(true), k=d.bsim;
  const E={hi:{type:"comment",user:u,text:"السلام عليكم"},mod:{type:"comment",user:{...u,mod:true},text:"تنبيه من المشرف للجميع"},sub:{type:"comment",user:{...u,sub:true},text:"أنا مشترك وأحب البث"},time:{type:"comment",user:u,text:"!وقت"},goal:{type:"comment",user:u,text:"!هدف"},likes:{type:"comment",user:u,text:"!تكبيس"},
   rose:{type:"gift",user:u,gift:GIFTS[0][0],giftId:GIFTS[0][2],diamonds:1,value:10,count:10},lion:{type:"gift",user:u,gift:GIFTS[6][0],giftId:GIFTS[6][2],diamonds:GIFTS[6][1],value:GIFTS[6][1],count:1},follow:{type:"follow",user:u},subev:{type:"subscribe",user:u},join:{type:"join",user:u},spam:{type:"comment",user:u,text:"تابعوني https://spam.com 0551234567"}}[k];
  if(k==="don") sim({type:"donation",provider:"test",name:u.name,amount:50,currency:S.donCfg.currency,message:""});
  else if(k==="per"){ const P=S.bots.periodic.items.find(x=>x.enabled); if(!P) return toast("لا توجد رسالة دورية مفعّلة"),true; const t=fillTpl(P.text,botVars({D:R.D,H:R.H,C:R.C,DN:R.DN,DC:S.donCfg,layout:L(),socials:S.socials,now:Date.now()},null))||"(بيانات غير متوفرة)"; receive({t:"bot",items:[{id:"per_"+uid(),at:Date.now(),bot:"periodic",kind:"periodic",text:t,speech:t,user:{name:"",av:""},prio:0,say:S.bots.periodic.say,show:true,test:true}]},true) }
  else if(E) sim(E);
  if(k==="join"&&!S.bots.status.welcome) toast("بوت الترحيب متوقف — فعّله من الحالة"); return true }
 if(t.hasAttribute("data-vptest")){ VP.unlocked=true; vpSpeak(S.bots.voice.lang==="en"?"Hello, this is a voice test from B6O6 Streaming":"هلا والله، هذا اختبار صوت من منصة بطوط",{},e=>{ if(e&&e!=="timeout") toast("تعذر التشغيل: "+e) }); return true }
 if(t.hasAttribute("data-vppause")){ VP.paused=!VP.paused; if(VP.paused&&hasTTS()) speechSynthesis.pause(); else { if(hasTTS()) speechSynthesis.resume(); vpPump() } renderPage(true); return true }
 if(t.hasAttribute("data-vpskip")){ if(hasTTS()) speechSynthesis.cancel(); return true }
 if(t.hasAttribute("data-vpclear")){ VP.q.length=0; VP.pending.length=0; if(hasTTS()) speechSynthesis.cancel(); renderPage(true); return true }
 if(d.vpdel!==undefined){ VP.q.splice(+d.vpdel,1); vpUI(); return true }
 if(d.vpok!==undefined){ const it=VP.pending.splice(+d.vpok,1)[0]; if(it){ it.needApprove=false; vqPush(VP.q,it,S.bots.queue); vpPump() } renderPage(true); return true }
 if(d.vpno!==undefined){ VP.pending.splice(+d.vpno,1); renderPage(true); return true }
 if(d.vppre){ S.bots.voice.preset=d.vppre; botsChanged(false); const p=VOICE_PRESETS.find(x=>x[0]===d.vppre); vpSpeak("قالب "+p[1],{},()=>{}); renderPage(true); return true }
 return false;
}
function botsInput(t,d,e){
 if(t.hasAttribute("data-vphere")&&e.type==="change"){ localStorage.setItem("b6o6.voiceHere",t.checked?"1":"0"); if(!t.checked){ const L=vpLeader(); if(L&&L.id===VP.id) localStorage.removeItem("b6o6.voiceLeader") } else vpBeat(); renderPage(true); return true }
 if(!d.bp) return false;
 const isSel=t.tagName==="SELECT", isChk=t.type==="checkbox";
 if((isSel||isChk)&&e.type==="input") return true; if(!isSel&&!isChk&&e.type==="input") return true;
 let v=isChk?t.checked:t.value;
 if(d.bt==="lines") v=String(v).split("\n").map(x=>x.trim()).filter(Boolean);
 else if(t.type==="number") v=+v||0;
 else if(isSel&&/^(everyMin|giftId)$/.test(d.bp.split(".").pop())) v=+v;
 setPath(S.bots,d.bp,v); botsChanged(isSel||isChk); return true;
}

/* ================= عداد المتابعين ================= */
// ====== آخر دعم نصي: الإعدادات والمعاينة ======
function dtPropsHTML(w,sel,rng){ const tg=(f,l)=>`<button class="btn sm ${w[f]!==false?"on":""}" data-dttog="${f}" data-wid="${w.id}">${w[f]!==false?"✓":"✕"} ${l}</button>`, col=(f,l)=>`<div class="fld"><label>${l}</label><input type="color" data-wf="${f}" data-wid="${w.id}" value="${w[f]||DT_DEFAULTS[f]}"></div>`;
 const pv=S.dtPv||(S.dtPv={name:"gg4days",amount:30,currency:"USD"});
 return `<div class="ttl" style="margin:6px 0 4px">💬 آخر دعم نصي — نص فقط، خلفية شفافة 100%</div>
  <div class="dt-pvbox" data-dtpv="${w.id}" style="height:70px;border-radius:10px;border:1px dashed var(--line);background:repeating-conic-gradient(#2a2f3a 0 25%,#1c2029 0 50%) 0 0/16px 16px;position:relative;overflow:hidden;margin-bottom:8px"></div>
  <div class="grid g3" style="gap:6px"><div class="fld"><label>اسم تجريبي</label><input class="inp" data-dtpvf="name" value="${esc(pv.name)}"></div><div class="fld"><label>مبلغ تجريبي</label><input class="inp" type="number" data-dtpvf="amount" value="${pv.amount}"></div><div class="fld"><label>العملة</label><select class="inp" data-dtpvf="currency">${Object.keys(CURRENCIES).map(c=>`<option ${pv.currency===c?"selected":""}>${c}</option>`).join("")}</select></div></div>
  <div class="row" style="margin-bottom:8px"><button class="btn sm pri" data-dtsim="${w.id}">🧪 تجربة وصول دعم (المعاينة فقط)</button><button class="btn sm" data-dtreset="${w.id}">↺ الإعدادات الافتراضية</button></div>
  <div class="row" style="gap:4px;flex-wrap:wrap">${tg("showTitle","«"+esc(w.dtTitle||"آخر دعم")+"»")}${tg("showName","الاسم")}${tg("showSep","النقطتان")}${tg("showSym","رمز العملة")}${tg("showAmt","المبلغ")}</div>
  <div class="grid g2" style="gap:8px"><div class="fld"><label>نص العنوان</label><input class="inp" data-wf="dtTitle" data-wid="${w.id}" value="${esc(w.dtTitle??"")}"></div><div class="fld"><label>علامة الفصل</label><input class="inp" data-wf="sepText" data-wid="${w.id}" value="${esc(w.sepText??":")}"></div>
   ${sel("symMode","شكل العملة",[["sym","الرمز ($ / ر.س)"],["code","الكود (USD / SAR)"],["none","بدون"]],w.symMode||"sym")}${sel("symPos","مكان الرمز",[["auto","تلقائي حسب العملة"],["before","قبل المبلغ"],["after","بعد المبلغ"]],w.symPos||"auto")}${sel("dec","المنازل العشرية",[["auto","تلقائي"],["0","0"],["1","1"],["2","2"],["3","3"]],w.dec??"auto")}</div>
  <div class="ttl" style="margin:8px 0 4px">🎨 لون كل جزء مستقل</div><div class="grid g3" style="gap:8px">${col("cTitle","العنوان")}${col("cName","الاسم")}${col("cSep","النقطتان")}${col("cSym","رمز العملة")}${col("cAmt","المبلغ")}</div>
  <div class="ttl" style="margin:8px 0 4px">🔤 الخط والأحجام</div><div class="grid g2" style="gap:8px">${sel("font","الخط",DT_FONTS,w.font||"")}${sel("weight","وزن الخط",[["400","عادي"],["600","متوسط"],["800","عريض"],["900","أسود"]],w.weight||"800")}
   ${rng("fs","حجم الخط",.4,2.5,.05,w.fs||1,v=>Math.round(v*100)+"%")}${rng("titleScale","حجم العنوان",.4,2,.05,w.titleScale||1,v=>Math.round(v*100)+"%")}${rng("nameScale","حجم الاسم",.4,2,.05,w.nameScale||1,v=>Math.round(v*100)+"%")}${rng("amtScale","حجم المبلغ",.4,2,.05,w.amtScale||1,v=>Math.round(v*100)+"%")}${rng("symScale","حجم رمز العملة",.4,2,.05,w.symScale||1,v=>Math.round(v*100)+"%")}${rng("gapEm","المسافة بين الأجزاء",0,1.5,.05,w.gapEm??.35,v=>v)}
   ${sel("align","المحاذاة",[["right","يمين"],["center","وسط"],["left","يسار"]],w.align||"center")}${sel("dir","اتجاه النص",[["auto","تلقائي"],["rtl","من اليمين لليسار"],["ltr","من اليسار لليمين"]],w.dir||"auto")}
   ${sel("shadow","ظل النص",[["1","مفعّل"],["0","متوقف"]],w.shadow!==false?"1":"0")}${sel("glowOn","توهج النص",[["0","متوقف"],["1","مفعّل"]],w.glowOn?"1":"0")}${w.glowOn?`<div class="fld"><label>لون التوهج</label><input type="color" data-wf="glowColor" data-wid="${w.id}" value="${w.glowColor||"#ffffff"}"></div>${rng("glowStr","شدة التوهج",.1,2,.05,w.glowStr??.6,v=>Math.round(v*100)+"%")}`:""}</div>
  <div class="ttl" style="margin:8px 0 4px">✨ الحركة (اختيارية — ثابت افتراضياً)</div><div class="grid g2" style="gap:8px">${sel("dtAnim","عند وصول دعم جديد",DT_ANIMS,w.dtAnim||"none")}${sel("animOn","كل الحركات",[["1","مسموحة"],["0","معطّلة بالكامل"]],w.animOn!==false?"1":"0")}</div>
  <p class="mut small">يعرض آخر دونيشن مؤكد من مزود التبرعات فقط — دعم الاختبار والمسترجع لا يظهران في OBS، ولا تُحوَّل العملات: تظهر عملة الدعم الفعلية.</p>
  <div class="row" style="margin-bottom:10px"><button class="btn sm" data-copylink="${w.id}">🔗 نسخ رابط OBS</button></div>` }
function mountDtPreview(w){ const box=document.querySelector(`[data-dtpv="${w.id}"]`); if(!box) return; box.innerHTML=""; const cv={w:box.clientWidth||300,h:70};
 const pw={...w,id:"pv_dt",x:0,y:.12,w:1,h:.76,visible:true,locked:false};
 const v=new View(pw,cv,{mute:true,dtSample:()=>{ const p=S.dtPv; return {id:"pv_"+(p.n||0),name:p.name,amount:+p.amount||0,currency:p.currency,refunded:0} }}); box.appendChild(v.el); v.apply(pw); v.refreshDt({},true); S._dtV=v }
function dtClick(t,d){
 if(d.dttog&&d.wid){ const w=findW(d.wid); if(!w) return true; w[d.dttog]=w[d.dttog]===false; changed(w,true); return true }
 if(d.dtsim){ const w=findW(d.dtsim); if(w) mountDtPreview(w); const p=S.dtPv; p.n=(p.n||0)+1; const v=S._dtV; if(v){ v.dt.force=true; v.refreshDt({},false) } return true }
 if(d.dtreset&&d.wid){ const w=findW(d.wid); if(!w) return true; Object.assign(w,JSON.parse(JSON.stringify(DT_DEFAULTS)),{w:w.w,h:w.h}); changed(w,true); toast("أُعيدت الإعدادات الافتراضية"); return true }
 return false }
function dtInput(t,d,e){ if(!d.dtpvf) return false; const p=S.dtPv; p[d.dtpvf]=t.value; const v=S._dtV; if(v){ v.dt.force=true; v.refreshDt({},true) } return true }
// ====== رابط البايو: المنشئ + المعاينة ======
S.bio=Object.assign(bioDefaults(),(CFG&&CFG.bio)||ls("b6o6.bio")||{});
function bioSave(re){ ls("b6o6.bio",S.bio); if(CFG) fetch("/api/me",{method:"PUT",headers:{"content-type":"application/json"},body:JSON.stringify({bio:S.bio})}).then(r=>r.json()).then(j=>{ if(j&&j.error) toast(j.error) }).catch(()=>{}); if(re) renderPage(true); else bioPreview() }
function bioPublicUrl(){ return CFG?`${location.origin}/u/${encodeURIComponent(S.bio.handle||"")}`:`${location.href.split("#")[0]}#/bio` }
function bioPreview(){ const f=document.getElementById("bio-pv"); if(f) f.innerHTML=`<style>${BIO_CSS}</style>`+bioHTML(S.bio,{visits:S.bio.stats?.visits||0}) }
function bioHTMLPage(){ const b=S.bio, T=Object.entries(BIO_TYPES);
 return head("🔗 رابط البايو","صفحة واحدة لكل حساباتك وبثوثك وروابط الدعم — تشاركها في البايو")+
 `<div class="bio-ed"><div><div class="card"><h3>الملف الشخصي</h3><div class="grid g2" style="gap:8px">
  <div class="fld"><label>اسم الرابط (يظهر في العنوان)</label><input class="inp" dir="ltr" data-bio="handle" value="${esc(b.handle)}" placeholder="username"></div><div class="fld"><label>الاسم</label><input class="inp" data-bio="name" value="${esc(b.name)}"></div>
  <div class="fld" style="grid-column:1/-1"><label>نبذة قصيرة</label><input class="inp" data-bio="about" value="${esc(b.about)}"></div>
  <div class="fld"><label>الصورة الشخصية</label><input type="file" accept="image/*" data-bioimg="avatar"></div><div class="fld"><label>الشعار (اختياري)</label><input type="file" accept="image/*" data-bioimg="logo"></div>
  <label class="row small" style="gap:6px"><input type="checkbox" data-bio="live" ${b.live?"checked":""}> إظهار «مباشر الآن»</label><div class="fld"><label>رابط مشاهدة البث</label><input class="inp" dir="ltr" data-bio="liveUrl" value="${esc(b.liveUrl)}" placeholder="https://www.tiktok.com/@you/live"></div>
  <label class="row small" style="gap:6px"><input type="checkbox" data-bio="animBg" ${b.animBg?"checked":""}> خلفية متحركة</label><label class="row small" style="gap:6px"><input type="checkbox" data-bio="showVisits" ${b.showVisits?"checked":""}> إظهار عداد الزيارات</label></div></div>
 <div class="card"><h3>الروابط</h3>${b.links.map((l,i)=>`<div class="row bio-row" style="gap:6px;margin-bottom:6px"><select class="inp" style="width:auto" data-bl="${i}" data-blf="type">${T.map(([k,[n]])=>`<option value="${k}" ${l.type===k?"selected":""}>${n}</option>`).join("")}</select><input class="inp" data-bl="${i}" data-blf="label" value="${esc(l.label)}" placeholder="${l.type==="fortnite"?"الكود":"النص"}"><input class="inp" dir="ltr" data-bl="${i}" data-blf="url" value="${esc(l.url)}" placeholder="https://…"><button class="btn sm" data-blmv="${i}" data-d="-1">↑</button><button class="btn sm" data-blmv="${i}" data-d="1">↓</button><button class="btn sm dng" data-blrm="${i}">✕</button><span class="mut small">${(b.stats?.clicks||{})[l.id]||0} نقرة</span></div>`).join("")}
  <button class="btn sm" data-bladd>+ رابط</button></div>
 <div class="card"><h3>التصميم (${BIO_DESIGNS.length})</h3><div class="row" style="flex-wrap:wrap;gap:6px">${BIO_DESIGNS.map(d=>`<button class="btn sm ${b.design===d.id?"on":""}" data-biod="${d.id}">${d.name} — ${d.ar}</button>`).join("")}</div></div>
 <div class="card"><h3>المشاركة</h3><div class="row" style="gap:6px"><input class="inp" dir="ltr" readonly value="${esc(bioPublicUrl())}"><button class="btn sm pri" data-biocopy>نسخ الرابط</button><a class="btn sm" href="${esc(bioPublicUrl())}" target="_blank">فتح</a></div><p class="mut small">${CFG?"الرابط ثابت بعد اختيار اسم الرابط.":"في نسخة التجربة الصفحة محفوظة على هذا الجهاز فقط — الرابط العام يعمل بعد النشر."} الزيارات: <b>${b.stats?.visits||0}</b></p>
  <div class="row" style="gap:12px;align-items:center;margin-top:8px"><div id="bio-qr" style="width:132px;height:132px;background:#fff;border-radius:10px;padding:4px">${bioQR()}</div><div class="row" style="flex-direction:column;gap:6px;align-items:stretch"><b>رمز QR لصفحتك</b><span class="mut small">يُولَّد محلياً — اطبعه أو ضعه في البث</span><button class="btn sm" data-bioqr="png">⬇️ PNG</button><button class="btn sm" data-bioqr="svg">⬇️ SVG</button></div></div></div></div>
 <div class="bio-phone"><div class="bio-screen" id="bio-pv"></div></div></div>` }
function bioQR(){ try{ return qrSVG(bioPublicUrl(),{px:4}).replace(/width="\d+" height="\d+"/,'width="100%" height="100%"') }catch(e){ return "" } }
function bioQRDownload(fmt){ const svg=qrSVG(bioPublicUrl(),{px:16}), name="b6o6-bio-qr."+fmt; const save=u=>{ const a=document.createElement("a"); a.href=u; a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(u),5000) };
 if(fmt==="svg") return save(URL.createObjectURL(new Blob([svg],{type:"image/svg+xml"})));
 const im=new Image(); im.onload=()=>{ const c=document.createElement("canvas"); c.width=im.width; c.height=im.height; c.getContext("2d").drawImage(im,0,0); c.toBlob(b=>save(URL.createObjectURL(b)),"image/png") }; im.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg) }
function bioClick(t,d){
 if(d.biod){ S.bio.design=d.biod; bioSave(true); return true }
 if(t.hasAttribute("data-bladd")){ S.bio.links.push({id:"l"+uid(),type:"link",label:"",url:""}); bioSave(true); return true }
 if(d.blrm!==undefined){ S.bio.links.splice(+d.blrm,1); bioSave(true); return true }
 if(d.blmv!==undefined){ const i=+d.blmv, j=i+(+d.d), L_=S.bio.links; if(j>=0&&j<L_.length){ [L_[i],L_[j]]=[L_[j],L_[i]]; bioSave(true) } return true }
 if(t.hasAttribute("data-biocopy")){ copy(bioPublicUrl()); return true }
 if(d.bioqr){ bioQRDownload(d.bioqr); return true }
 return false }
function bioInput(t,d,e){
 if(d.bio){ S.bio[d.bio]=t.type==="checkbox"?t.checked:d.bio==="handle"?t.value.replace(/[^\w.\-]/g,"").slice(0,30):t.value; bioSave(false); return true }
 if(d.bl!==undefined&&d.blf){ S.bio.links[+d.bl][d.blf]=t.value; if(d.blf==="type"){ const T=BIO_TYPES[t.value]; if(T&&!S.bio.links[+d.bl].label) S.bio.links[+d.bl].label=T[0]; bioSave(true) } else bioSave(false); return true }
 if(d.bioimg&&e.type==="change"){ const f=t.files&&t.files[0]; if(!f) return true; readImage(f).then(src=>{ S.bio[d.bioimg]=src; bioSave(false) }); return true }
 return false }
// ====== المجتمعات والإشعارات (Discord / Telegram) ======
async function commLoad(){ if(!CFG) return; try{ const r=await fetch("/api/notify"); if(r.ok){ S.notify=await r.json(); if(S.page==="community") renderPage(true) } }catch(e){} }
function commHTML(){ if(CFG&&!S.notifyAt){ S.notifyAt=Date.now(); commLoad() }
 const N=S.notify||{channels:{discord:{connected:false,events:notifyDefaults()},telegram:{connected:false,events:notifyDefaults()}},logs:[]};
 const card=(k,title,icon,fields)=>{ const c=N.channels[k]; return `<div class="card"><h3><span>${icon} ${title}</span><span class="tag ${c.connected?"ok":""}">${c.connected?"مربوط"+(c.label?" — "+esc(c.label):""):"غير مربوط"}</span></h3>
  ${fields}<div class="fld"><label>اسم القناة/المجموعة (للعرض فقط)</label><input class="inp" data-nf="${k}.label" value="${esc(c.label||"")}"></div>
  <h4 style="margin:10px 0 4px">الإشعارات</h4>${NOTIFY_EVENTS.map(([e,l])=>{ const ev=c.events[e]||{}; return `<div class="act-a"><label class="row small" style="gap:6px"><input type="checkbox" data-nf="${k}.events.${e}.on" ${ev.on?"checked":""}> <b>${l}</b></label><input class="inp" data-nf="${k}.events.${e}.tpl" value="${esc(ev.tpl||"")}"></div>` }).join("")}
  <div class="row" style="margin-top:8px"><button class="btn sm pri" data-nsave="${k}">💾 حفظ</button><button class="btn sm" data-ntest="${k}" ${c.connected?"":"disabled"}>🧪 إرسال تجربة</button></div></div>` };
 return head("📣 المجتمعات والإشعارات","Discord وTelegram: «أنا لايف»، نهاية البث، ملخص الإحصائيات، الأهداف، الدعم الكبير")+
 `${CFG?"":`<div class="note small" style="margin-bottom:12px">الإرسال يتم من خادم المنصة فقط (الرموز السرية لا تُحفظ في المتصفح). هذه نسخة تجربة بدون خادم — الإعدادات تعمل في لوحة التحكم المنشورة.</div>`}
 <div class="grid g2">${card("discord","Discord","💬",`<div class="fld"><label>رابط Webhook للقناة (Server Settings ← Integrations ← Webhooks)</label><input class="inp" type="password" data-nf="discord.secret" placeholder="${N.channels.discord.connected?"•••• محفوظ — اتركه فارغاً للإبقاء":"https://discord.com/api/webhooks/…"}"></div>`)}
 ${card("telegram","Telegram","✈️",`<div class="fld"><label>رمز البوت من @BotFather</label><input class="inp" type="password" data-nf="telegram.token" placeholder="${N.channels.telegram.connected?"•••• محفوظ":"123456:ABC…"}"></div><div class="fld"><label>معرّف القناة أو المجموعة (أضف البوت مشرفاً أولاً)</label><input class="inp" data-nf="telegram.chatId" placeholder="@mychannel أو -100…"></div>`)}</div>
 <div class="card" style="margin-top:12px"><h3>📜 سجل الإشعارات</h3><table class="tbl"><tr><th>الوقت</th><th>المنصة</th><th>الحدث</th><th>النتيجة</th></tr>${(N.logs||[]).map(l=>`<tr><td>${new Date(l.at).toLocaleString("ar-SA")}</td><td>${l.kind}</td><td>${esc(l.event)}</td><td>${l.ok?'<span class="tag ok">أُرسل</span>':`<span class="tag bad">فشل</span> ${esc(l.error||"")}`}</td></tr>`).join("")||'<tr><td colspan="4" class="mut">لا يوجد</td></tr>'}</table></div>` }
const NF={};
function commInput(t,d,e){ if(!d.nf) return false; const v=t.type==="checkbox"?t.checked:t.value; NF[d.nf]=v; return true }
async function commClick(t,d){
 if(d.nsave){ const k=d.nsave; if(!CFG){ toast("الحفظ يعمل في لوحة التحكم المنشورة على الخادم"); return true } const N=S.notify||{channels:{}}; const ch=N.channels[k]||{events:notifyDefaults()}; const events=JSON.parse(JSON.stringify(ch.events));
  for(const [p,v] of Object.entries(NF)){ const [kk,a,b,c]=p.split("."); if(kk!==k||a!=="events") continue; events[b]=events[b]||{}; events[b][c]=v }
  const body={kind:k,label:NF[k+".label"]??ch.label,events}; if(k==="discord"&&NF["discord.secret"]) body.secret=NF["discord.secret"]; if(k==="telegram"&&(NF["telegram.token"]||NF["telegram.chatId"])) body.secret={token:NF["telegram.token"],chatId:NF["telegram.chatId"]};
  const r=await fetch("/api/notify",{method:"PUT",headers:{"content-type":"application/json"},body:JSON.stringify(body)}); const j=await r.json().catch(()=>({})); toast(r.ok?"تم الحفظ":"تعذر الحفظ: "+(j.error||r.status)); for(const p of Object.keys(NF)) if(p.startsWith(k+".")) delete NF[p]; S.notifyAt=0; commLoad(); return true }
 if(d.ntest){ const r=await fetch("/api/notify",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({kind:d.ntest,event:"custom"})}); const j=await r.json().catch(()=>({})); const x=(j.results||[])[0]; toast(x?(x.ok?"✅ وصلت رسالة التجربة":"❌ "+x.error):"لا توجد قناة مفعّلة"); S.notifyAt=0; commLoad(); return true }
 return false }
// ====== مركز الإجراءات التلقائية (عندما ← إذا ← نفّذ) ======
S.bots.actions=S.bots.actions||[]; S.actLog=[];
const ACT_TPL={rose:()=>newActRule({name:"وردة = +30 ثانية",trigger:{type:"gift",giftId:"5655"},actions:[{t:"subAdd",sec:30},{t:"text",text:"+30 ثانية من {user} 🌹",dur:4}]}),
 lion:()=>newActRule({name:"هدية كبيرة = احتفال",priority:9,trigger:{type:"giftValue",minValue:5000},actions:[{t:"celebrate",text:"شكراً {user} 👑",dur:6},{t:"tts",text:"شكراً {user} على {gift}"}]}),
 likes:()=>newActRule({name:"كل 1000 لايك = +دقيقة",trigger:{type:"likes",every:1000},actions:[{t:"subAdd",sec:60}]}),
 dance:()=>newActRule({name:"أمر !رقصة للمشرفين",trigger:{type:"command",text:"!رقصة"},conds:{mode:"and",list:[{k:"perm",v:"mods"}]},cooldownSec:30,actions:[{t:"text",text:"💃 {user} شغّل الرقصة",dur:5}]})};
function actSave(rerender){ save(); pushLayout(); if(rerender) renderPage(true) }
function actFind(id){ return S.bots.actions.find(r=>r.id===id) }
function actSetPath(o,path,v){ const ks=path.split("."); let c=o; for(let i=0;i<ks.length-1;i++){ c=c[ks[i]]=c[ks[i]]??(isNaN(+ks[i+1])?{}:[]) } c[ks[ks.length-1]]=v }
function actHTML(){ const R_=S.bots.actions, opt=(L,v)=>L.map(([k,l])=>`<option value="${k}" ${v===k?"selected":""}>${l}</option>`).join("");
 const fi=(r,path,val,label,type="text",ph="")=>`<div class="fld"><label>${label}</label><input class="inp" ${type==="number"?'type="number"':""} data-ar="${r.id}" data-af="${path}" value="${esc(val??"")}" placeholder="${esc(ph)}"></div>`;
 const sl=(r,path,L,val,label)=>`<div class="fld"><label>${label}</label><select class="inp" data-ar="${r.id}" data-af="${path}" data-rr="1">${opt(L,val)}</select></div>`;
 const trig=r=>{ const t=r.trigger||{}; switch(t.type){ case "gift": return fi(r,"trigger.giftId",t.giftId,"رقم الهدية أو اسمها (فارغ = أي هدية)","text","5655 أو وردة"); case "giftValue": return fi(r,"trigger.minValue",t.minValue,"أقل قيمة (نقاط)","number"); case "likes": return fi(r,"trigger.every",t.every,"كل كم لايك؟","number"); case "keyword": return fi(r,"trigger.text",t.text,"كلمات (مفصولة بفاصلة)","text","زيد, more"); case "command": return fi(r,"trigger.text",t.text,"الأمر","text","!رقصة"); case "donation": return fi(r,"trigger.minAmount",t.minAmount,"أقل مبلغ","number")+fi(r,"trigger.currency",t.currency,"العملة (فارغ = أي)","text","USD"); case "goal": return sl(r,"trigger.metric",ACT_GOALS,t.metric,"المقياس")+fi(r,"trigger.target",t.target,"الهدف","number"); case "join": return `<p class="mut small">⚠️ أحداث الدخول غير مؤكدة من TikTok — قد لا تصل.</p>`; default: return "" } };
 const actF=(r,a,i)=>{ const p=`actions.${i}.`; const media=["sound","video","gif","image"].includes(a.t);
  return `<div class="act-a"><div class="grid g3" style="gap:6px">${sl(r,p+"t",ACT_TYPES,a.t,"الإجراء "+(i+1))}
   ${media?fi(r,p+"src",a.src&&a.src.startsWith("data:")?"(ملف مرفوع)":a.src,"رابط الملف (https) أو ارفع ملفاً","text","https://…")+`<div class="fld"><label>رفع ملف (حتى 1.5MB)</label><input type="file" data-actfile="${r.id}" data-ai="${i}" accept="${a.t==="sound"?"audio/*":a.t==="video"?"video/*":"image/*"}"></div>`:""}
   ${["text","tts","reply","celebrate","discord","telegram","songAdd","image","gif","video"].includes(a.t)?fi(r,p+"text",a.text,a.t==="songAdd"?"اسم الأغنية":"النص ({user} {gift} {amount} {count} {text})"):""}
   ${["text","image","gif","video","celebrate","sound"].includes(a.t)?fi(r,p+"dur",a.dur||5,"المدة (ث)","number"):""}${["sound","video"].includes(a.t)?fi(r,p+"vol",a.vol??80,"الصوت %","number"):""}
   ${a.t==="subAdd"||a.t==="subSub"?fi(r,p+"sec",a.sec||30,"الثواني","number"):""}${a.t==="goalAdd"?sl(r,p+"widgetId",[["","اختر الهدف"],...L().widgets.filter(w=>w.type==="sgoal"||w.type==="vgoal").map(w=>[w.id,w.name])],a.widgetId||"","الهدف")+fi(r,p+"n",a.n||1,"الزيادة","number"):""}
   ${a.t==="discord"||a.t==="telegram"?`<p class="mut small" style="grid-column:1/-1">يتطلب ربط ${a.t==="discord"?"Discord":"Telegram"} من صفحة «المجتمعات والإشعارات» (خادم المنصة).</p>`:""}</div>
   <button class="btn sm dng" data-actdel="${r.id}" data-ai="${i}">✕ حذف الإجراء</button></div>` };
 return head("⚡ الإجراءات التلقائية","عندما يحدث شيء ← إذا تحققت الشروط ← نفّذ إجراءً أو أكثر")+
 `<div class="card" style="margin-bottom:12px"><div class="row"><button class="btn sm pri" data-actnew="blank">+ قاعدة جديدة</button><span class="mut small">قوالب جاهزة:</span>${Object.entries({rose:"🌹 وردة = +30ث",lion:"👑 هدية كبيرة = احتفال",likes:"❤️ 1000 لايك = +دقيقة",dance:"💃 أمر للمشرفين"}).map(([k,l])=>`<button class="btn sm" data-actnew="${k}">${l}</button>`).join("")}<button class="btn sm" data-addw="actbox">+ ودجت عرض الإجراءات (OBS)</button></div>
  ${L().widgets.some(w=>w.type==="actbox")?"":`<p class="mut small">الصور والفيديو والنصوص والاحتفالات تظهر في ودجت «عرض الإجراءات» — أضفه للمشهد.</p>`}</div>
 ${R_.map(r=>`<div class="card act-rule ${r.enabled===false?"off":""}" data-rule="${r.id}"><h3><span class="row" style="gap:8px"><input type="checkbox" data-ar="${r.id}" data-af="enabled" ${r.enabled!==false?"checked":""}><input class="inp" style="width:auto;min-width:200px" data-ar="${r.id}" data-af="name" value="${esc(r.name)}"></span><span class="row"><button class="btn sm" data-acttest="${r.id}">🧪 تجربة</button><button class="btn sm dng" data-actrm="${r.id}">حذف القاعدة</button></span></h3>
  <div class="act-cols"><div><h4>عندما</h4><div class="grid g2" style="gap:6px">${sl(r,"trigger.type",ACT_TRIGGERS,r.trigger.type,"المحفّز")}${trig(r)}</div></div>
  <div><h4>إذا</h4><div class="grid g2" style="gap:6px">${sl(r,"conds.mode",[["and","كل الشروط (AND)"],["or","أي شرط (OR)"]],r.conds?.mode||"and","الربط")}${fi(r,"priority",r.priority??5,"الأولوية (أعلى = أولاً)","number")}${fi(r,"cooldownSec",r.cooldownSec||0,"وقت الانتظار (ث)","number")}${fi(r,"maxPerMin",r.maxPerMin||0,"حد التكرار/دقيقة (0 = بلا حد)","number")}</div>
   ${(r.conds?.list||[]).map((c,i)=>`<div class="row" style="gap:6px;margin-top:6px"><select class="inp" style="width:auto" data-ar="${r.id}" data-af="conds.list.${i}.k" data-rr="1">${opt([["minValue","حد أدنى للقيمة"],["users","قائمة مستخدمين"],["perm","صلاحية"],["platform","منصة"],["notTest","أحداث حقيقية فقط"]],c.k)}</select>${c.k==="perm"?`<select class="inp" style="width:auto" data-ar="${r.id}" data-af="conds.list.${i}.v">${opt(ACT_PERMS,c.v)}</select>`:c.k==="platform"?`<select class="inp" style="width:auto" data-ar="${r.id}" data-af="conds.list.${i}.v">${opt([["tiktok","TikTok"],["youtube","YouTube"],["kick","Kick"],["twitch","Twitch"]],c.v)}</select>`:c.k==="notTest"?"":`<input class="inp" style="width:auto" data-ar="${r.id}" data-af="conds.list.${i}.v" value="${esc(c.v??"")}">`}<button class="btn sm" data-actcrm="${r.id}" data-ci="${i}">✕</button></div>`).join("")}
   <button class="btn sm" data-actcadd="${r.id}" style="margin-top:6px">+ شرط</button></div>
  <div><h4>نفّذ</h4>${sl(r,"run",[["all","كل الإجراءات"],["first","الإجراء الأول فقط"]],r.run||"all","التشغيل")}${(r.actions||[]).map((a,i)=>actF(r,a,i)).join("")}<button class="btn sm" data-actadd="${r.id}">+ إجراء</button></div></div></div>`).join("")||`<div class="card mut">لا توجد قواعد بعد — ابدأ بقالب جاهز.</div>`}
 <div class="card" style="margin-top:12px"><h3>📜 سجل التنفيذ</h3><div style="overflow:auto;max-height:320px"><table class="tbl"><tr><th>الوقت</th><th>القاعدة</th><th>المحفّز</th><th>المستخدم</th><th>الإجراءات</th><th>النتيجة</th></tr>${S.actLog.map(l=>`<tr><td>${new Date(l.at).toLocaleTimeString("ar-SA")}</td><td>${esc(l.rule)}</td><td>${esc(l.trigger||"")}</td><td>${esc(l.user)}${l.test?" 🧪":""}</td><td dir="ltr">${esc(l.actions)}</td><td>${l.ok?'<span class="tag ok">نجح</span>':`<span class="tag bad">فشل</span> <span class="small">${esc(l.reason)}</span>`}</td></tr>`).join("")||'<tr><td colspan="6" class="mut">لا يوجد تنفيذ بعد</td></tr>'}</table></div></div>` }
function actTestEv(r){ const t=r.trigger, u={id:"t"+Date.now()%1000,name:"تجربة",mod:true,owner:false}, id="at_"+uid()+Date.now();
 switch(t.type){ case "gift": return {id,type:"gift",user:u,gift:t.giftId||"وردة",giftId:+t.giftId||5655,count:1,value:1,test:true}; case "giftValue": return {id,type:"gift",user:u,gift:"هدية",giftId:1,count:1,value:+t.minValue||1,test:true};
  case "likes": return {id,type:"like",user:u,count:+t.every||100,test:true}; case "keyword": return {id,type:"comment",user:u,text:String(t.text||"").split(/[,،]/)[0],test:true}; case "command": return {id,type:"comment",user:u,text:t.text,test:true};
  case "donation": return {id,type:"donation",provider:"test",name:"تجربة",amount:Math.max(+t.minAmount||1,1),currency:t.currency||"USD",test:true}; case "comment": return {id,type:"comment",user:u,text:"تجربة",test:true};
  case "goal": return null; default: return {id,type:t.type,user:u,test:true} } }
function actClick(t,d){
 if(d.actnew){ const r=d.actnew==="blank"?newActRule():ACT_TPL[d.actnew](); S.bots.actions.push(r); actSave(true); return true }
 if(d.actrm){ return ask("حذف القاعدة؟").then(ok=>{ if(ok){ S.bots.actions=S.bots.actions.filter(r=>r.id!==d.actrm); actSave(true) } }),true }
 if(d.actadd){ actFind(d.actadd).actions.push({t:"text",text:"",dur:5}); actSave(true); return true }
 if(d.actdel){ actFind(d.actdel).actions.splice(+d.ai,1); actSave(true); return true }
 if(d.actcadd){ const r=actFind(d.actcadd); r.conds=r.conds||{mode:"and",list:[]}; r.conds.list.push({k:"minValue",v:1}); actSave(true); return true }
 if(d.actcrm){ actFind(d.actcrm).conds.list.splice(+d.ci,1); actSave(true); return true }
 if(d.acttest){ const ev=actTestEv(actFind(d.acttest)); if(!ev) return toast("محفّز الهدف يُختبر بالوصول الفعلي للرقم"),true; sim(ev); toast("أُرسل حدث تجربة (مُعلَّم)"); return true }
 return false }
function actInput(t,d,e){
 if(d.actfile!==undefined){ if(e.type!=="change") return true; const f=t.files&&t.files[0]; if(!f) return true; if(f.size>1.5*1024*1024){ toast("الملف أكبر من 1.5MB — استخدم رابطاً"); return true } const fr=new FileReader(); fr.onload=()=>{ actFind(d.actfile).actions[+d.ai].src=fr.result; actSave(true); toast("رُفع الملف") }; fr.readAsDataURL(f); return true }
 if(d.ar&&d.af){ const r=actFind(d.ar); if(!r) return true; if(t.type!=="checkbox"&&e.type!=="change"&&t.tagName!=="SELECT") return true;
  let v=t.type==="checkbox"?t.checked:t.value; if(t.type==="number") v=+v||0; if(d.af.endsWith(".src")&&v==="(ملف مرفوع)") return true;
  actSetPath(r,d.af,v); if(d.af.endsWith(".t")){ const a=r.actions[+d.af.split(".")[1]]; if(a) for(const k of ["src","sec","n","widgetId"]) delete a[k] } actSave(!!d.rr); return true }
 return false }
// ====== صفحة الطبقات | Layers & Latest Events ======
const LAYERS15=[["like","آخر مكبس"],["follow","آخر متابع"],["gift","آخر مرسل هدية"],["comment","آخر معلّق"],["share","آخر مشارك للبث"],["join","آخر داخل للبث"],["donation","آخر داعم دونيشن"],["topDay","أقوى داعم اليوم"],["topWeek","أقوى داعم الأسبوع"],["topMonth","أقوى داعم الشهر"],["topLike","أكثر شخص كبس"],["topComment","أكثر شخص علّق"],["topShare","أكثر شخص شارك"],["subscribe","آخر مشترك"],["song","آخر شخص طلب أغنية"]];
const LAYER_DESIGN={like:"fire",follow:"butterfly",gift:"stars",comment:"floatingClouds",share:"diamond",join:"moonBlossom",donation:"crown",topDay:"crown",topWeek:"goldenRose",topMonth:"diamond",topLike:"fire",topComment:"auroraGarden",topShare:"snowflakeQueen",subscribe:"stars",song:"sakura"};
function layersHTML(){ const ws_=L().widgets.filter(w=>w.type==="levent");
 return head("🧩 الطبقات","15 عنصراً مستقلاً فوق البث — كل عنصر بتصميمه وإعداداته ورابط OBS الخاص به")+
 `<div class="note small" style="margin-bottom:12px">كل عنصر يعرض المعلومات المتاحة فعلاً من مصدرها. العناصر المحسوبة (أقوى داعم / الأكثر تفاعلاً) تُبنى من الأحداث الحقيقية فقط — أحداث التجربة لا تُحسب فيها، وتظهر المعاينة بمثال حتى تصل بيانات حقيقية.</div>
 <div class="lay-grid">${LAYERS15.map(([k,label])=>{ const K=LE_KINDS[k], mine=ws_.filter(w=>w.kind===k);
  return `<div class="card lay-card"><div class="lay-pv" data-laypv="${k}"></div><h3 style="margin:6px 0"><span>${K.icon} ${label}</span><span class="tag ${K.status[1]}">${K.derived?"محسوب":K.status[1]==="ok"?"مدعوم":"مشروط"}</span></h3>
   <p class="mut small" style="min-height:2.6em">${esc(K.status[0])}</p>
   <div class="row" style="gap:6px"><button class="btn sm pri" data-layadd="${k}">+ إضافة للمشهد</button>${mine.length?`<button class="btn sm" data-lecopy="${mine[0].id}">🔗 رابط OBS</button><button class="btn sm" data-sel="${mine[0].id}" data-go="studio">⚙️ تخصيص</button>`:""}<button class="btn sm" data-layplay="${k}">▶ تشغيل</button></div>
   ${mine.length>1?`<p class="mut small">${mine.length} عناصر من هذا النوع في المشهد</p>`:""}</div>` }).join("")}</div>` }
function layersMount(){ document.querySelectorAll("[data-laypv]").forEach(box=>{ const k=box.dataset.laypv, cv={w:420,h:300};
  const w=newWidget("levent",{id:"pv_lay_"+k,kind:k,design:LAYER_DESIGN[k]||"stars",x:.02,y:.02,w:.96,h:.96,ptN:6});
  const stg=document.createElement("div"); stg.className="stage"; stg.style.cssText=`width:${cv.w}px;height:${cv.h}px;background:none;position:absolute;transform-origin:0 0`; const sc=Math.min(box.clientWidth/cv.w,box.clientHeight/cv.h); stg.style.transform=`scale(${sc})`; stg.style.left=(box.clientWidth-cv.w*sc)/2+"px"; box.appendChild(stg);
  const v=new View(w,cv,{mute:true,data:SRC}); stg.appendChild(v.el); v.apply(w); liveViews.add(v) }) }
function layersClick(t,d){
 if(d.layadd){ const k=d.layadd, w=addWidget("levent",{kind:k,design:LAYER_DESIGN[k]||"stars",name:LAYERS15.find(x=>x[0]===k)[1]}); w.mode=LE_KINDS[k].derived?"sticky":w.mode; applyPreset(w,LE_POS[k]||"mm",CV()); save(); pushLayout(); toast("أُضيف «"+w.name+"»"); renderPage(true); return true }
 if(d.layplay){ for(const v of liveViews) if(v.w.type==="levent"&&v.w.kind===d.layplay&&v.leReplay) v.leReplay(); if(!LE_KINDS[d.layplay].derived) sim(leTestEv(d.layplay)); return true }
 return false }
// ====== نظام الأغاني: المكتبة (IndexedDB) + المشغل + الصفحة ======
// الملفات الصوتية تبقى على هذا الجهاز فقط (IndexedDB). الغرفة تعرف بيانات الأغاني (العنوان/الفنان/المدة) للبحث بأوامر الشات.
const MDB={db:null,open(){ if(this.db) return Promise.resolve(this.db); return new Promise((res,rej)=>{ const r=indexedDB.open("b6o6-music",1); r.onupgradeneeded=()=>r.result.createObjectStore("tracks"); r.onsuccess=()=>{ this.db=r.result; res(r.result) }; r.onerror=()=>rej(r.error) }) },
 async put(id,blob){ const db=await this.open(); return new Promise((res,rej)=>{ const t=db.transaction("tracks","readwrite"); t.objectStore("tracks").put(blob,id); t.oncomplete=res; t.onerror=()=>rej(t.error) }) },
 async get(id){ const db=await this.open(); return new Promise(res=>{ const r=db.transaction("tracks").objectStore("tracks").get(id); r.onsuccess=()=>res(r.result||null); r.onerror=()=>res(null) }) },
 async del(id){ const db=await this.open(); return new Promise(res=>{ const t=db.transaction("tracks","readwrite"); t.objectStore("tracks").delete(id); t.oncomplete=res }) }};
S.musicLib=ls("b6o6.musicLib")||[];
S.bots.music=Object.assign(defaultMusicCfg(),S.bots.music||{});
function musicSyncLib(){ ls("b6o6.musicLib",S.musicLib); clockOp("music","lib",{lib:S.musicLib}) }
async function musicImport(files){ let n=0;
 for(const f of files){ if(!/^audio\//.test(f.type)&&!/\.(mp3|m4a|aac|ogg|wav|flac|opus)$/i.test(f.name)) continue; if(f.size>40*1024*1024){ toast("ملف أكبر من 40MB: "+f.name); continue }
  const dur=await new Promise(r=>{ const a=new Audio(); a.preload="metadata"; a.onloadedmetadata=()=>{ r(isFinite(a.duration)?Math.round(a.duration):0); URL.revokeObjectURL(a.src) }; a.onerror=()=>r(0); a.src=URL.createObjectURL(f) });
  const base=f.name.replace(/\.[^.]+$/,""), m=base.split(/\s+-\s+/); const id="t"+uid()+Date.now().toString(36);
  await MDB.put(id,f); S.musicLib.push({id,title:(m[1]||m[0]).trim().slice(0,120),artist:m[1]?m[0].trim().slice(0,80):"",dur}); n++ }
 musicSyncLib(); toast(n?`أُضيفت ${n} أغنية للمكتبة`:"لم تُضف ملفات صوتية"); renderPage(true) }
// ---------- المشغل (هذا التبويب فقط بعد تفعيله — يتطلب ضغطة من المستخدم بسبب سياسة التشغيل التلقائي) ----------
const MP={on:false,audio:null,id:null,posT:0};
function mpEnsure(){ if(MP.audio) return MP.audio; const a=MP.audio=new Audio(); a.onended=()=>{ if(MP.on) clockOp("music","ended",{}) }; a.onerror=()=>{ if(MP.on&&MP.id){ toast("تعذر تشغيل الملف — تخطي"); clockOp("music","next",{}) } }; return a }
async function mpSync(){ if(!MP.on) return; const M=R.C.music, a=mpEnsure(); const cur=M&&M.current;
 if(!cur){ if(MP.id){ a.pause(); MP.id=null } mpUI(); return }
 const key=cur.qid+cur.track.id; if(MP.id!==key){ MP.id=key; const blob=await MDB.get(cur.track.id); if(!blob){ toast("ملف الأغنية غير موجود على هذا الجهاز — تخطي"); clockOp("music","next",{}); return } if(a.src) URL.revokeObjectURL(a.src); a.src=URL.createObjectURL(blob); a.currentTime=0 }
 const duck=S.bots.music.duckTTS&&VP.speaking?.35:1; a.volume=Math.max(0,Math.min(1,(M.volume??70)/100*duck));
 if(M.paused) a.pause(); else a.play().catch(()=>toast("اضغط «تفعيل المشغل» للسماح بالتشغيل")); mpUI() }
setInterval(()=>{ if(MP.on&&MP.audio&&!MP.audio.paused&&R.C.music?.current){ clockOp("music","pos",{pos:Math.round(MP.audio.currentTime)}); const M=R.C.music; MP.audio.volume=Math.max(0,Math.min(1,(M.volume??70)/100*(S.bots.music.duckTTS&&VP.speaking?.35:1))) } },5000);
function mpUI(){ const b=document.querySelector("[data-mpon]"); if(b) b.textContent=MP.on?"🔊 المشغل يعمل في هذا التبويب":"▶ تفعيل المشغل في هذا التبويب" }
function musicHTML(){ const M=R.C.music||{queue:[],lib:[]}, C=S.bots.music, cur=M.current, P=MUSIC_PERMS;
 const permSel=(k,l)=>`<div class="fld"><label>${l}</label><select class="inp" data-mperm="${k}">${P.map(([v,t])=>`<option value="${v}" ${C.perms[k]===v?"selected":""}>${t}</option>`).join("")}</select></div>`;
 const num=(k,l,v)=>`<div class="fld"><label>${l}</label><input class="inp" type="number" data-mcfg="${k}" value="${v}"></div>`;
 const chk=(k,l)=>`<label class="row small" style="gap:6px"><input type="checkbox" data-mchk="${k}" ${C[k]?"checked":""}> ${l}</label>`;
 return head("🎵 طلبات الأغاني","يكتب المتابع في الشات: !اغنية اسم الأغنية — والمصدر مكتبتك المرخّصة فقط")+
 `<div class="note small" style="margin-bottom:12px">المصدر: ملفات صوتية ترفعها أنت (موسيقاك المرخّصة). الملفات تبقى على هذا الجهاز، والتشغيل من هذا التبويب بعد «تفعيل المشغل». لا نستخرج صوتاً من YouTube أو غيره. لإيصال الصوت للبث: التقط صوت سطح المكتب في OBS أو اجعل هذا المتصفح مصدر صوت.</div>
 <div class="grid g2"><div class="card"><h3>▶ يعمل الآن</h3>${cur?`<div class="row" style="gap:10px"><b style="font-size:18px">${esc(cur.track.title)}</b><span class="mut">${esc(cur.track.artist||"")}</span></div><div class="mut small">طلب: ${esc(cur.by.name)} · ${cur.by.platform||"tiktok"} · ${M.paused?"⏸ متوقف مؤقتاً":"يعمل"}</div>`:`<p class="mut">لا توجد أغنية الآن</p>`}
  <div class="row" style="margin-top:10px"><button class="btn sm pri" data-mpon>${MP.on?"🔊 المشغل يعمل في هذا التبويب":"▶ تفعيل المشغل في هذا التبويب"}</button><button class="btn sm" data-mop="${M.paused?"resume":"pause"}">${M.paused?"▶ استئناف":"⏸ إيقاف مؤقت"}</button><button class="btn sm" data-mop="next">⏭ تخطي</button><button class="btn sm" data-mop="clear">🗑 مسح القائمة</button></div>
  <div class="fld" style="margin-top:8px"><label>مستوى صوت الموسيقى: ${M.volume??70}%</label><input type="range" min="0" max="100" value="${M.volume??70}" data-mvol></div>
  <h3 style="margin-top:12px">قائمة الانتظار (${M.queue.length})</h3>${M.queue.length?`<ol class="mq">${M.queue.map((q,i)=>`<li><b>${esc(q.track.title)}</b> <span class="mut small">${esc(q.track.artist||"")} · ${Math.floor(q.track.dur/60)}:${String(q.track.dur%60).padStart(2,"0")} · طلب ${esc(q.by.name)} (${q.by.platform||"tiktok"})</span> <button class="btn sm" data-mmv="${q.qid}" data-d="-1">↑</button><button class="btn sm" data-mmv="${q.qid}" data-d="1">↓</button><button class="btn sm" data-mrm="${q.qid}">✕</button></li>`).join("")}</ol>`:`<p class="mut small">فاضية</p>`}
  <div class="row"><button class="btn sm" data-addw="nowplay">+ ودجت «الأغنية الحالية»</button><button class="btn sm" data-libtab="nowplay" data-go="library">🎨 التصاميم (${NP_DESIGNS.length})</button><button class="btn sm" data-mtest>🧪 تجربة طلب من الشات</button></div></div>
 <div class="card"><h3>📚 المكتبة (${S.musicLib.length})</h3><div class="fld"><label>رفع ملفات صوتية (اسم الملف: الفنان - العنوان)</label><input type="file" multiple accept="audio/*" data-mimport></div>
  <div style="max-height:320px;overflow:auto">${S.musicLib.map(t=>`<div class="row" style="justify-content:space-between;border-bottom:1px solid #ffffff10;padding:4px 0"><span><b>${esc(t.title)}</b> <span class="mut small">${esc(t.artist)} · ${Math.floor(t.dur/60)}:${String(t.dur%60).padStart(2,"0")}</span></span><span><button class="btn sm" data-madd="${t.id}">+ للقائمة</button><button class="btn sm" data-mdel="${t.id}">حذف</button></span></div>`).join("")||`<p class="mut small">ارفع أغانيك المرخّصة لتبدأ.</p>`}</div></div></div>
 <div class="card" style="margin-top:14px"><h3>🔐 الصلاحيات (كل أمر مستقل)</h3><div class="grid g3">${permSel("request","طلب أغنية (!اغنية / !song / !طلب)")}${permSel("info","عرض القائمة والحالية (!queue / !current)")}${permSel("skip","التخطي (!skip / !سكب / !تخطي)")}${permSel("control","التحكم (!pause / !volume / !remove / !clear)")}${permSel("vote","التصويت على التخطي (!voteskip)")}<div class="fld"><label>القائمة المخصصة (أسماء مفصولة بفاصلة)</label><input class="inp" data-mcfg="users" value="${esc(C.users||"")}"></div></div>
  <h3>⚙️ القيود</h3><div class="grid g3">${num("maxDurSec","أقصى مدة للأغنية (ثانية)",C.maxDurSec)}${num("perUser","طلبات لكل مستخدم في القائمة",C.perUser)}${num("cooldownSec","انتظار بين الطلبات (ثانية)",C.cooldownSec)}${num("noRepeatMin","منع تكرار نفس الأغنية (دقيقة)",C.noRepeatMin)}${num("voteNeeded","أصوات التخطي المطلوبة",C.voteSkip.needed)}<div class="fld"><label>أغانٍ محظورة (كلمات مفصولة بفاصلة)</label><input class="inp" data-mcfg="banned" value="${esc(C.banned||"")}"></div></div>
  <div class="row" style="gap:16px;flex-wrap:wrap">${chk("enabled","تفعيل الأوامر")}${chk("autoplay","تشغيل تلقائي")}${chk("shuffle","تشغيل عشوائي")}${chk("duckTTS","خفض الموسيقى أثناء القارئ الصوتي")}${chk("replies","ردود البوت على الشاشة")}<label class="row small" style="gap:6px"><input type="checkbox" data-mvote ${C.voteSkip.on?"checked":""}> التصويت على التخطي</label></div></div>` }
function musicSave(){ save(); pushLayout(); syncBots&&syncBots() }
function musicClick(t,d){
 if(t.hasAttribute("data-mpon")){ MP.on=true; mpEnsure().play().catch(()=>{}); MP.audio.pause(); mpSync(); mpUI(); toast("المشغل يعمل في هذا التبويب"); return true }
 if(d.addw){ const w=addWidget(d.addw,{}); applyPreset(w,"bc",CV()); save(); pushLayout(); toast("أُضيف «"+(TYPES[d.addw]||{}).label+"»"); return true }
 if(d.mop){ clockOp("music",d.mop,{}); setTimeout(()=>renderPage(true),60); return true }
 if(d.mrm){ clockOp("music","remove",{qid:d.mrm}); setTimeout(()=>renderPage(true),60); return true }
 if(d.mmv){ clockOp("music","move",{qid:d.mmv,d:+d.d}); setTimeout(()=>renderPage(true),60); return true }
 if(d.madd){ if(!R.C.music||!R.C.music.lib.length) musicSyncLib(); clockOp("music","add",{id:d.madd}); setTimeout(()=>renderPage(true),60); return true }
 if(d.mdel){ MDB.del(d.mdel); S.musicLib=S.musicLib.filter(x=>x.id!==d.mdel); musicSyncLib(); renderPage(true); return true }
 if(t.hasAttribute("data-mtest")){ const t0=S.musicLib[0]; if(!t0) return toast("ارفع أغنية أولاً"),true; sim({id:"mt_"+uid()+Date.now(),type:"comment",user:{id:"tester"+Date.now()%1000,name:"تجربة"},text:"!اغنية "+t0.title,test:true}); setTimeout(()=>renderPage(true),120); return true }
 return false }
function musicInput(t,d,e){
 if(d.mimport!==undefined&&e.type==="change"){ musicImport([...t.files]); return true }
 if(d.mvol!==undefined&&e.type==="change"){ clockOp("music","volume",{v:+t.value}); return true }
 if(d.mperm){ S.bots.music.perms[d.mperm]=t.value; musicSave(); return true }
 if(d.mcfg&&e.type==="change"){ if(d.mcfg==="voteNeeded") S.bots.music.voteSkip.needed=Math.max(1,+t.value||1); else S.bots.music[d.mcfg]=["users","banned"].includes(d.mcfg)?t.value:Math.max(0,+t.value||0); musicSave(); return true }
 if(d.mchk!==undefined){ S.bots.music[d.mchk]=t.checked; musicSave(); return true }
 if(d.mvote!==undefined){ S.bots.music.voteSkip.on=t.checked; musicSave(); return true }
 return false }
// ====== مركز ربط البثوث | Multi-Platform Connection Hub ======
const CONN_P=["tiktok","youtube","kick","twitch"];
const CONN_ST={connected:["متصل","ok"],connecting:["جارٍ الاتصال","warn"],error:["خطأ","bad"],disconnected:["غير متصل",""],unconfigured:["غير مضبوط على الخادم","bad"]};
async function connLoad(){ if(!CFG) return; try{ const r=await fetch("/api/connections"); if(r.ok){ S.conns=(await r.json()).connections; if(S.page==="connections") renderPage(true) } }catch(e){} }
function connState(p){ if(p==="tiktok") return wsReady&&liveStatus.live?"connected":wsReady&&S.settings.tiktok?"connecting":"disconnected";
 const c=(S.conns||{})[p]; if(!c||!c.configured) return "unconfigured"; return c.status||"disconnected" }
function connHTML(){ if(CFG&&!S.connsAt){ S.connsAt=Date.now(); connLoad() }
 const ago=t=>{ if(!t) return "—"; const s=Math.round((Date.now()-new Date(t).getTime())/1000); return s<60?`قبل ${s} ث`:s<3600?`قبل ${Math.round(s/60)} د`:new Date(t).toLocaleString("ar-SA") };
 const caps=capabilityTable();
 return head("🔌 مركز ربط البثوث","TikTok LIVE · YouTube Live · Kick · Twitch — اتصال واحد لكل منصة، والأحداث كلها تمر عبر محرك الأحداث الموحد")+
 `<div class="grid g2">${CONN_P.map(p=>{ const P=LIVE_PLATFORMS[p], st=connState(p), [stl,stc]=CONN_ST[st], c=(S.conns||{})[p]||{};
  const acc=p==="tiktok"?(S.settings.tiktok?"@"+esc(S.settings.tiktok):"—"):(c.accountName?esc(c.accountName):"—");
  return `<div class="card conn-card" data-conn="${p}" style="border-top:3px solid ${P.color}"><h3><span class="row" style="gap:8px"><i class="conn-lg">${UC_ICONS[p]}</i>${P.name}</span><span class="tag ${stc}" data-connst="${p}">${stl}</span></h3>
   <div class="row" style="gap:10px;margin-bottom:8px">${c.avatarUrl?`<img src="${esc(c.avatarUrl)}" style="width:40px;height:40px;border-radius:50%">`:""}<div><div><b>الحساب:</b> ${acc}</div><div class="mut small">البث: ${p==="tiktok"?esc(liveStatus.text):st==="connected"?(c.lastError?esc(c.lastError):"يُقرأ تلقائياً عند بدء بث نشط"):"—"}</div></div></div>
   <div class="conn-info"><span><b>آخر حدث:</b> <span data-connlast="${p}">${ago((S.lastEv||{})[p]||c.lastEventAt)}</span></span><span><b>المشاهدون:</b> غير متاح حالياً</span><span><b>طريقة الربط:</b> ${p==="tiktok"?"اسم المستخدم":"OAuth رسمي"}</span></div>
   ${p==="tiktok"?`<div class="fld" style="margin-top:8px"><label>اسم المستخدم (بدون @)</label><input class="inp" data-set="tiktok" value="${esc(S.settings.tiktok||"")}" placeholder="username"></div>`:""}
   ${st==="unconfigured"?`<p class="mut small">${CFG?"لم يضف مالك المنصة مفاتيح تطبيق "+P.name+" بعد: "+esc(((OAUTH[p]||{}).env||[]).join(" + ")):"الربط الرسمي يعمل من خادم المنصة (لوحة التحكم المنشورة)، وليس من نسخة التجربة هذه."}</p>`:""}
   ${c.lastError&&st!=="connected"?`<p class="small" style="color:#f87171">${esc(c.lastError)}</p>`:""}
   <div class="row" style="margin-top:8px">${p==="tiktok"?`<button class="btn sm pri" data-tiktok>اتصال</button><button class="btn sm" data-disconnect>فصل</button>`:`<button class="btn sm pri" data-connect="${p}" ${st==="unconfigured"?"disabled":""}>${st==="connected"?"إعادة الربط":"ربط "+P.name}</button>${st==="connected"?`<button class="btn sm" data-conndel="${p}">فصل</button>`:""}`}
    <button class="btn sm" data-connguide="${p}">❓ كيف أربط حسابي؟</button><button class="btn sm" data-conntest="${p}">🧪 رسالة تجربة</button><button class="btn sm" data-go="settings">⚙️ الإعدادات</button></div></div>` }).join("")}</div>
 <div class="card" style="margin-top:14px"><h3>حالة دعم الميزات لكل منصة</h3><div style="overflow:auto"><table class="tbl"><tr><th>الميزة</th>${caps.map(c=>`<th>${c.name}</th>`).join("")}</tr>
  ${[["comment","التعليقات"],["like","اللايكات"],["gift","الهدايا"],["follow","المتابعات"],["subscribe","الاشتراكات"],["share","المشاركات"],["join","دخول المشاهدين"],["viewers","عدد المشاهدين"],["sendChat","إرسال رد في الشات"],["moderate","أوامر الإشراف"]].map(([f,l])=>`<tr><td>${l}</td>${caps.map(c=>{ const x=c.caps.find(y=>y.feature===f); return `<td><span class="tag ${x?x.tone:"bad"}">${x?x.label:CAP.no[0]}</span></td>` }).join("")}</tr>`).join("")}</table></div>
  <p class="mut small">«تجريبية» لـ TikTok = اتصال LIVE غير رسمي بالاسم فقط. «تتطلب تفويضاً» = تعمل بعد الربط عبر OAuth الرسمي. لا نعرض «متصل» قبل التحقق من الحساب فعلياً.</p></div>
 <div class="card" style="margin-top:14px"><h3>💬 الشات الموحد</h3><div class="row"><button class="btn sm pri" data-ucadd="1">+ إضافة الشات الموحد للمشهد</button><button class="btn sm" data-libtab="uchat" data-go="library">🎨 تصاميم الشات (${UC_DESIGNS.length})</button><button class="btn sm" data-conntest="all">🧪 رسائل تجربة من المنصات الأربع</button></div>
  <p class="mut small">رسائل التجربة مُعلَّمة ولا تُحفظ في سجل الشات الحقيقي.</p></div>` }
function connGuide(p){ const G=PLATFORM_GUIDES[p], P=LIVE_PLATFORMS[p]; const li=a=>`<ol>${a.map(x=>`<li>${esc(x)}</li>`).join("")}</ol>`;
 const m=modal(`<h3 class="row" style="gap:8px"><i class="conn-lg">${UC_ICONS[p]}</i> كيف أربط ${P.name}؟</h3>
  <div class="cguide"><h4>1. متطلبات الربط</h4>${li(G.req)}<h4>2. طريقة التفويض</h4><p>${esc(G.auth)}</p><h4>3. خطوات الاتصال</h4>${li(G.steps)}<h4>4. تشغيل الشات</h4><p>${esc(G.chat)}</p><h4>5. تفعيل OBS</h4>${li(G.obs)}<h4>6. اختبار الاتصال</h4><p>${esc(G.test)}</p><h4>7. حل المشاكل الشائعة</h4>${li(G.fix)}</div>
  <div class="row" style="margin-top:10px"><button class="btn pri" data-close>فهمت</button></div>`);
 m.addEventListener("click",e=>{ if(e.target===m||e.target.hasAttribute("data-close")) m.remove() }) }
const CONN_TEST={tiktok:["محمد","السلام عليكم"],youtube:["أحمد","البث رهيب"],kick:["عبدالله","نورت"],twitch:["Sara","Let's go!"]};
function connTest(p){ for(const q of p==="all"?CONN_P:[p]){ const [n,t]=CONN_TEST[q]; sim({id:"t_"+q+"_"+uid()+Date.now(),type:"comment",platform:q,user:{id:"t_"+q+n,name:n,mod:q==="kick",sub:q==="youtube"},text:t,test:true}) } }
function connClick(t,d){
 if(d.connguide){ connGuide(d.connguide); return true }
 if(d.conntest){ connTest(d.conntest); toast("أُرسلت رسالة تجربة (مُعلَّمة)"); return true }
 if(d.connect){ if(!CFG) return toast("الربط الرسمي متاح في لوحة التحكم المنشورة على الخادم"),true; location.href="/api/connect/"+d.connect; return true }
 if(d.conndel){ if(CFG) fetch("/api/connections?platform="+d.conndel,{method:"DELETE"}).then(()=>{ S.connsAt=0; connLoad() }); return true }
 if(d.ucadd){ const w=addWidget("uchat",{}); applyPreset(w,"mr",CV()); save(); pushLayout(); toast("أُضيف الشات الموحد"); return true }
 return false }
function ucPropsHTML(w,sel,rng){ const inp=(f,l,ph="")=>`<div class="fld"><label>${l}</label><input class="inp" data-wf="${f}" data-wid="${w.id}" value="${esc(w[f]??"")}" placeholder="${esc(ph)}"></div>`, col=(f,l,d)=>`<div class="fld"><label>${l}</label><input type="color" data-wf="${f}" data-wid="${w.id}" value="${w[f]||d}"></div>`;
 return `<div class="grid g2" style="gap:8px">${sel("design","التصميم",UC_DESIGNS.map(d=>[d.id,d.name+" — "+d.ar]),w.design)}${sel("mode","وضع العرض",CHAT_MODES,w.mode)}${w.mode==="rotate"?rng("rotateSec","مدة كل منصة",3,30,1,w.rotateSec||8,v=>v+" ث"):""}
  ${sel("enter","دخول الرسالة",UC_ENTERS,w.enter||"right")}${sel("dir","اتجاه العرض",[["bottom","الأحدث بالأسفل"],["top","الأحدث بالأعلى"]],w.dir||"bottom")}
  ${rng("max","عدد الرسائل",1,30,1,w.max||8,v=>v)}${rng("holdSec","مدة بقاء الرسالة (0 = دائم)",0,120,5,w.holdSec||0,v=>v?v+" ث":"دائم")}
  ${rng("fontScale","حجم الخط",.6,2,.05,w.fontScale||1,v=>Math.round(v*100)+"%")}${sel("font","الخط",LE_FONTS,w.font||"")}
  ${rng("bgOpacity","شفافية الخلفية",0,1,.05,w.bgOpacity??.55,v=>Math.round(v*100)+"%")}${sel("animOn","الأنيميشن",[["1","مفعّل"],["0","متوقف"]],w.animOn!==false?"1":"0")}
  ${sel("showAv","صور المستخدمين",[["1","ظاهرة"],["0","مخفية"]],w.showAv!==false?"1":"0")}${sel("showLogo","شعارات المنصات",[["1","ظاهرة"],["0","مخفية"]],w.showLogo!==false?"1":"0")}
  ${sel("showTime","وقت الرسالة",[["0","مخفي"],["1","ظاهر"]],w.showTime?"1":"0")}${sel("showEvents","أحداث (هدايا/متابعات/اشتراكات)",[["1","تظهر"],["0","تعليقات فقط"]],w.showEvents!==false?"1":"0")}
  ${sel("dedupe","الرسائل المكررة",[["1","إخفاء خلال 30 ث"],["0","إظهار"]],w.dedupe!==false?"1":"0")}${sel("highlight","إبراز الرسائل المهمة",[["1","مفعّل"],["0","متوقف"]],w.highlight!==false?"1":"0")}
  ${col("nameColor","لون الاسم (فارغ = لون المنصة)","#ffffff")}${col("textColor","لون النص","#ffffff")}${col("accent","لون الإبراز","#fbbf24")}</div>
  ${inp("banned","كلمات محظورة (مفصولة بفاصلة)","مثال: سبام, رابط")}${sel("bannedAction","عند وجود كلمة محظورة",[["mask","إخفاء الكلمة ***"],["hide","إخفاء الرسالة كاملة"]],w.bannedAction||"mask")}
  ${inp("importantWords","كلمات تجعل الرسالة مهمة","اسمك, سؤال")}
  <div class="row" style="margin-bottom:10px"><button class="btn sm" data-conntest="all">🧪 رسائل تجربة</button><button class="btn sm" data-lecopy="${w.id}">🔗 نسخ رابط OBS</button><button class="btn sm" data-lib="${w.id}">🎨 التصاميم</button></div>` }
// ====== آخر التفاعلات | Latest Events Studio ======
const LE_POS={like:"tr",follow:"tl",join:"br",share:"bl",donation:"mm"};
const LE_VOICE={follow:["follows","follow"],share:["follows","share"],subscribe:["follows","subscribe"],donation:["thanks","donation"],gift:["thanks","gift"]};
function leVoiceOn(k){ if(k==="join") return !!S.bots.status.welcome; const m=LE_VOICE[k]; if(!m) return null; const c=(S.bots[m[0]]||{})[m[1]]; return !!(c&&c.enabled&&S.bots.status[m[0]]) }
function leHTML(){ const l=L(), ws_=l.widgets.filter(w=>w.type==="levent"), Lt=R.C.latest||{};
 return head("✨ آخر التفاعلات","آخر لايك · آخر متابعة · آخر دخول · آخر مشاركة · آخر دعم — كل عنصر مستقل بتصميمه وإعداداته ورابط OBS")+
 `<div class="card" style="margin-bottom:14px"><h3>⚡ البدء السريع</h3><div class="row"><button class="btn sm pri" data-leall="1">✨ ضع الخمسة في المشهد</button>${LE_MAIN.map(k=>`<button class="btn sm" data-leadd="${k}">+ ${LE_KINDS[k].icon} ${LE_KINDS[k].label}</button>`).join("")}<button class="btn sm" data-leadd="gift">+ 🎁 آخر هدية</button><button class="btn sm" data-leadd="subscribe">+ ⭐ آخر مشترك</button><button class="btn sm" data-libtab="levent" data-go="library">🎨 المكتبة (${LE_DESIGNS.length} أنماط × 5 أنواع)</button></div>
 <p class="mut small" style="margin-top:8px">الترتيب الافتراضي: اللايك أعلى اليمين، المتابعة أعلى اليسار، الدخول أسفل اليمين، المشاركة أسفل اليسار، الدونيشن في المنتصف — ويمكن تحريك وتكبير كل عنصر من الاستوديو. أحداث التجربة تظهر على العناصر فقط ولا تُحفظ كآخر حدث حقيقي.</p></div>
 <div class="grid g2">${[...LE_MAIN,"gift","subscribe"].map(k=>{ const K=LE_KINDS[k], e=Lt[k], mine=ws_.filter(w=>w.kind===k), vo=leVoiceOn(k);
  return `<div class="card" data-lekind="${k}"><h3><span>${K.icon} ${K.label}</span><span class="tag ${K.status[1]}">${K.status[0]}</span></h3>
   <div class="grid g3" style="gap:8px">${stat("آخر حدث حقيقي",e?esc(e.name)+(e.kind==="donation"?" · "+fmtMoney(e.amount,e.currency):e.count?" · "+e.count:""):"لا يوجد بعد")}${stat("العناصر",mine.length)}${stat("الصوت",vo==null?"—":vo?"مفعّل":"متوقف")}</div>
   ${K.note?`<p class="mut small">${K.note}</p>`:""}
   ${mine.map(w=>`<div class="row" style="margin-top:6px;gap:6px"><b class="small">${esc(w.name)}</b><span class="tag">${esc(leDesignOf(w.design).name)}</span><span class="tag">${w.mode==="alert"?"تنبيه مؤقت "+(w.dur||5)+"ث":"آخر حدث ثابت"}</span><button class="btn sm" data-lecopy="${w.id}">🔗 نسخ رابط OBS</button><button class="btn sm" data-sel="${w.id}" data-go="studio">⚙️ إعدادات</button><button class="btn sm" data-lib="${w.id}">🎨 تصميم</button></div>`).join("")}
   <div class="row" style="margin-top:8px"><button class="btn sm" data-leadd="${k}">+ عنصر</button><button class="btn sm" data-letest="${k}">🧪 تجربة</button>${vo==null?"":`<button class="btn sm ${vo?"on":""}" data-levoice="${k}">🔊 ${vo?"إيقاف":"تشغيل"} الصوت</button>`}</div></div>` }).join("")}</div>
 ${leMineHTML(ws_)}
 <div class="note small" style="margin-top:14px">🔊 الصوت مربوط بمركز البوتات (نفس القارئ الصوتي، مصدر واحد بدون تكرار): المتابعة والمشاركة والاشتراك من «شكر المتابعة»، الدخول من «الترحيب»، الدونيشن والهدايا من «شكر الدعم». تعديل العبارات من صفحة البوتات.</div>` }
function lePropsHTML(w,sel,rng){ const d=leDesignOf(w.design), inp=(f,l,ph="")=>`<div class="fld"><label>${l}</label><input class="inp" data-wf="${f}" data-wid="${w.id}" value="${esc(w[f]??"")}" placeholder="${esc(ph)}"></div>`, K=LE_KINDS[w.kind]||LE_KINDS.follow;
 const col=(f,l)=>{ const P=LE_PALETTES[w.palette||d.pal]||LE_PALETTES.gold; return `<div class="fld"><label>${l}</label><input type="color" data-wf="${f}" data-wid="${w.id}" value="${w[f]||P[f]}"></div>` };
 return `<div class="grid g2" style="gap:8px">${sel("kind","نوع التفاعل",Object.entries(LE_KINDS).map(([k,x])=>[k,x.icon+" "+x.label]),w.kind)}${sel("design","التصميم",LE_DESIGNS.map(x=>[x.id,x.n+". "+x.name+" — "+x.ar]),w.design)}
  ${sel("mode","طريقة العرض",[["sticky","آخر حدث ثابت (Persistent)"],["alert","تنبيه مؤقت (Temporary)"]],w.mode)}${w.mode==="alert"?rng("dur","مدة التنبيه",2,30,1,w.dur||5,v=>v+" ث"):""}${sel("layout","مكان الصورة والاسم",LE_LAYOUTS,w.layout||"")}
  ${sel("frame","الإطار",LE_FRAMES,w.frame||"auto")}${sel("card","الخلفية",LE_CARDS,w.card||"clear")}</div>
  <div class="grid g2" style="gap:8px">${sel("enter","حركة الدخول ("+(LE_ENTERS.length-1)+")",LE_ENTERS,w.enter||"auto")}${sel("exit","حركة الخروج ("+(LE_EXITS.length-1)+")",LE_EXITS,w.exit||"auto")}${sel("font","الخط",LE_FONTS,w.font||"")}${rng("avScale","حجم الصورة والزخارف",.5,1.4,.05,w.avScale||1,v=>Math.round(v*100)+"%")}${rng("ptN","عدد الجزيئات",0,24,1,w.ptN??10,v=>v)}${sel("fxHalo","الهالة",[["1","ظاهرة"],["0","مخفية"]],w.fxHalo!==false?"1":"0")}${sel("fxKind","مؤثر نوع التفاعل",[["1","ظاهر"],["0","مخفي"]],w.fxKind!==false?"1":"0")}<div class="fld"><label>&nbsp;</label><button class="btn sm" data-lereplay="${w.id}">▶ تشغيل الحركة من البداية</button></div></div>
  ${inp("title","العنوان",K.title)}${inp("msg","الرسالة",K.msg)}<p class="mut small">المتغيرات: {user} الاسم · {count} العدد · {gift} الهدية · {amount} المبلغ بعملته</p>
  <div class="ttl" style="margin:8px 0 4px">🎨 الألوان</div><div class="row" style="gap:4px;flex-wrap:wrap">${Object.entries(LE_PALETTES).map(([k,p])=>`<button class="btn sm ${w.palette===k?"on":""}" data-lepal="${k}" data-wid="${w.id}" style="border-color:${p.c1}"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${p.c1}"></span> ${p.name}</button>`).join("")}<button class="btn sm" data-lepal="" data-wid="${w.id}">↺ ألوان التصميم</button></div>
  <div class="grid g3" style="gap:8px">${col("c1","الإطار")}${col("c2","الهالة")}${col("cn","الاسم")}${col("ct","العنوان")}${col("cp","النجوم/الفراشات")}${col("csh","اللمعة")}${col("cbg","خلفية اللوحة")}</div>
  <div class="grid g2" style="gap:8px">${rng("glow","شدة التوهج",0,2,.1,w.glow??1,v=>Math.round(v*100)+"%")}${rng("textScale","حجم النص",.6,1.6,.05,w.textScale||1,v=>Math.round(v*100)+"%")}${rng("animSpeed","سرعة الحركة",.5,2,.1,w.animSpeed||1,v=>v+"×")}${sel("animOn","الحركة",[["1","مفعّلة"],["0","متوقفة"]],w.animOn!==false?"1":"0")}${sel("lowPerf","وضع الأداء المنخفض",[["0","متوقف"],["1","مفعّل (بدون جزيئات)"]],w.lowPerf?"1":"0")}</div>
  <div class="grid g2" style="gap:8px">${sel("showAv","صورة المستخدم",[["1","ظاهرة"],["0","مخفية"]],w.showAv!==false?"1":"0")}${sel("showTitle","العنوان",[["1","ظاهر"],["0","مخفي"]],w.showTitle!==false?"1":"0")}${sel("showMsg","الرسالة",[["1","ظاهرة"],["0","مخفية"]],w.showMsg!==false?"1":"0")}${sel("showEmblem","شارة النوع",[["1","ظاهرة"],["0","مخفية"]],w.showEmblem!==false?"1":"0")}</div>
  <div class="ttl" style="margin:8px 0 4px">🖼️ صور وإطارات مخصصة</div>
  <div class="grid g2" style="gap:8px"><div class="fld"><label>إطار مخصص فوق الصورة (PNG/WebP/GIF شفاف)</label><input type="file" accept="image/png,image/webp,image/gif,image/svg+xml" data-leimg="frameImg" data-wid="${w.id}">${w.frameImg?`<button class="btn sm" data-leimgclr="frameImg" data-wid="${w.id}">إزالة</button>`:""}</div>
   <div class="fld"><label>صورة افتراضية عند غياب صورة المستخدم</label><input type="file" accept="image/*" data-leimg="defaultAv" data-wid="${w.id}">${w.defaultAv?`<button class="btn sm" data-leimgclr="defaultAv" data-wid="${w.id}">إزالة</button>`:""}</div></div>
  <div class="row" style="margin-bottom:10px"><button class="btn sm pri" data-lib="${w.id}">🎨 مكتبة آخر التفاعلات</button><button class="btn sm" data-letest="${w.kind}">▶ تشغيل التجربة</button><button class="btn sm" data-lecopy="${w.id}">🔗 نسخ رابط OBS</button><button class="btn sm" data-lemysave="${w.id}">💾 حفظ كتصميم خاص</button></div>` }
function leTestEv(k){ const u=simUser(true), id="le_"+uid()+Date.now();
 if(k==="donation") return {id,type:"donation",provider:"test",test:true,name:u.name,avatar:u.avatar,amount:rnd([2,5,10,25]),currency:S.donCfg.currency||"USD",message:"كفو 🔥"};
 if(k==="like") return {id,type:"like",user:u,count:rnd([15,40,120]),test:true};
 if(k==="comment") return {id,type:"comment",user:u,text:rnd(["السلام عليكم","البث رهيب 🔥","نورت"]),test:true};
 if(k==="gift") return {id,type:"gift",user:u,gift:"وردة",giftId:5655,count:3,value:3,test:true};
 return {id,type:k,user:u,test:true} }
// ====== «اصنع تصميمك»: حفظ تنسيق عنصر كتصميم خاص وتطبيقه على أي عنصر آخر (يعمل في OBS لأن التنسيق يُنسخ للعنصر) ======
const LE_STYLE_KEYS=["design","frame","card","enter","exit","font","layout","palette","c1","c2","cn","ct","cp","csh","cbg","glow","textScale","animSpeed","avScale","frameImg","defaultAv","fxHalo","fxKind","ptN","showAv","showTitle","showMsg","showEmblem","animOn"];
S.leMine=ls("b6o6.leMine")||[];
function leMineSave(){ ls("b6o6.leMine",S.leMine) }
function leStyleOf(w){ const o={}; for(const k of LE_STYLE_KEYS) if(w[k]!==undefined&&w[k]!==""&&w[k]!==null) o[k]=w[k]; return o }
function leMineHTML(ws_){ const M=S.leMine;
 return `<div class="card" style="margin:14px 0" id="le-mine"><h3>🎨 اصنع تصميمك — تصاميمي الخاصة <span class="tag">${M.length}</span></h3>
 <p class="mut small">اختر أي تصميم من الـ80 وعدّل الألوان والإطار والخط والحركات وارفع إطارك الخاص من إعدادات العنصر، ثم اضغط «💾 حفظ كتصميم خاص». يمكنك تطبيقه على أي عنصر وتصديره ومشاركته كملف.</p>
 ${M.length?`<div class="grid g2" style="gap:8px">${M.map((m,i)=>`<div class="card" style="padding:10px"><div class="row" style="justify-content:space-between"><b>${esc(m.name)}</b><span class="tag">${esc(leDesignOf(m.style.design).name)}</span></div>
  <div class="row" style="gap:4px;margin:6px 0">${["c1","c2","cn","cp"].map(k=>m.style[k]?`<span title="${k}" style="width:14px;height:14px;border-radius:50%;background:${esc(m.style[k])};display:inline-block;border:1px solid #fff4"></span>`:"").join("")}${m.style.frameImg?'<span class="tag">إطار مرفوع</span>':""}</div>
  <div class="row" style="gap:4px;flex-wrap:wrap">${ws_.length?ws_.map(w=>`<button class="btn sm" data-lemyapply="${i}" data-wid="${w.id}">تطبيق على ${esc(w.name)}</button>`).join(""):'<span class="mut small">أضف عنصراً أولاً</span>'}<button class="btn sm" data-lemyexp="${i}">⬇️ تصدير</button><button class="btn sm" data-lemydel="${i}">🗑️</button></div></div>`).join("")}</div>`:'<div class="empty">لا توجد تصاميم خاصة بعد</div>'}
 <div class="row" style="margin-top:8px"><label class="btn sm">⬆️ استيراد تصميم (JSON)<input type="file" accept="application/json" data-lemyimp hidden></label></div></div>` }
function leMineClick(t,d){
 if(d.lemysave){ const w=findW(d.lemysave); if(!w) return true; const name=(prompt("اسم التصميم الخاص:",w.name+" — تصميمي")||"").trim().slice(0,40); if(!name) return true;
  S.leMine.unshift({id:"m"+uid(),name,style:leStyleOf(w),at:Date.now()}); S.leMine=S.leMine.slice(0,60); leMineSave(); toast("💾 حُفظ «"+name+"»"); renderPage(true); return true }
 if(d.lemyapply!==undefined){ const m=S.leMine[+d.lemyapply], w=findW(d.wid); if(m&&w){ for(const k of LE_STYLE_KEYS) delete w[k]; Object.assign(w,JSON.parse(JSON.stringify(m.style))); save(); pushLayout(); toast("طُبّق «"+m.name+"» على "+w.name); renderPage(true) } return true }
 if(d.lemydel!==undefined){ S.leMine.splice(+d.lemydel,1); leMineSave(); renderPage(true); return true }
 if(d.lemyexp!==undefined){ const m=S.leMine[+d.lemyexp]; const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([JSON.stringify({b6o6:"le-design",v:1,...m},null,1)],{type:"application/json"})); a.download="b6o6-design-"+m.name.replace(/[^\w؀-ۿ-]+/g,"_")+".json"; a.click(); return true }
 return false }
function leMineImport(t,e){ if(!t.hasAttribute("data-lemyimp")||e.type!=="change") return false; const f=t.files&&t.files[0]; if(!f) return true;
 f.text().then(txt=>{ const j=JSON.parse(txt); if(j.b6o6!=="le-design"||!j.style||typeof j.style!=="object") throw 0; const st={}; for(const k of LE_STYLE_KEYS) if(j.style[k]!==undefined) st[k]=k==="frameImg"||k==="defaultAv"?(/^data:image\//.test(j.style[k])?j.style[k]:undefined):j.style[k];
  if(!LE_DESIGNS.some(x=>x.id===st.design)) st.design="stars"; S.leMine.unshift({id:"m"+uid(),name:String(j.name||"تصميم مستورد").slice(0,40),style:st,at:Date.now()}); leMineSave(); toast("تم الاستيراد"); renderPage(true) }).catch(()=>toast("ملف غير صالح")); return true }
function leClick(t,d){
 if(leMineClick(t,d)) return true;
 if(d.leadd){ const k=d.leadd, w=addWidget("levent",{kind:k,design:({like:"fire",follow:"butterfly",join:"stars",share:"diamond",donation:"crown"})[k]||"stars",name:LE_KINDS[k].label}); applyPreset(w,LE_POS[k]||"mm",CV()); save(); pushLayout(); toast("أُضيف «"+LE_KINDS[k].label+"»"); renderPage(); return true }
 if(d.leall){ const have=new Set(L().widgets.filter(w=>w.type==="levent").map(w=>w.kind)); let n=0; for(const k of LE_MAIN){ if(have.has(k)) continue; const w=addWidget("levent",{kind:k,design:({like:"fire",follow:"butterfly",join:"stars",share:"diamond",donation:"crown"})[k],name:LE_KINDS[k].label}); applyPreset(w,LE_POS[k],CV()); n++ } save(); pushLayout(); toast(n?`أُضيفت ${n} عناصر في أماكنها`:"العناصر الخمسة موجودة مسبقاً"); renderPage(); return true }
 if(d.letest){ sim(leTestEv(d.letest)); return true }
 if(d.lecopy){ copy(overlayURL(L(),d.lecopy)); return true }
 if(d.levoice){ const k=d.levoice; if(k==="join"){ S.bots.status.welcome=!S.bots.status.welcome } else { const m=LE_VOICE[k], c=S.bots[m[0]][m[1]]; const on=!leVoiceOn(k); c.enabled=on; if(on) S.bots.status[m[0]]=true } save(); pushLayout(); renderPage(true); return true }
 if(d.lepal!==undefined&&d.wid){ const w=findW(d.wid); if(!w) return true; w.palette=d.lepal; for(const f of ["c1","c2","cn","ct","cp","csh","cbg"]) delete w[f]; save(); pushLayout(); renderPage(true); return true }
 if(d.leimgclr&&d.wid){ const w=findW(d.wid); if(w){ w[d.leimgclr]=""; save(); pushLayout(); renderPage(true) } return true }
 if(d.lepv){ const vs=[...liveViews].filter(v=>v.w.type==="levent"&&String(v.w.id).startsWith("pv_")&&(d.lepv==="all"||v.w.design===d.lepv)); for(const v of vs){ const c=v.el.querySelector(".le-card"); if(c) c.remove(); if(v.le) v.le.cur=null; const e=leSample(v.w.kind,Date.now()); e.name=rnd(["محمد","سارة","أبو فهد","Nora","عبدالله","ريم"]); e.id+="_"+Math.random(); e.uid="pv"+Math.random(); v.leShow(e,false) } return true }
 if(d.lefav){ const f=S.settings.leFav=S.settings.leFav||[]; const i=f.indexOf(d.lefav); if(i>=0) f.splice(i,1); else f.push(d.lefav); save(); t.classList.toggle("on",i<0); return true }
 if(d.lereplay){ for(const v of allViews()) if(v.w.id===d.lereplay&&v.leReplay) v.leReplay(); return true }
 if(d.legrp!==undefined){ S.leGrp=d.legrp; renderPage(); return true }
 if(d.lecust){ const tg=L().widgets.find(w=>w.id===S.libTarget&&w.type==="levent")||L().widgets.find(w=>w.type==="levent"); if(tg){ tg.design=d.lecust; save(); pushLayout(); S.sel=tg.id; go("studio") } return true }
 if(d.sgpreset){ const w=findW(d.sgpreset); if(w){ w.source="likes"; w.levelStages="1000,1500,2000,3000,5000"; w.title="تحدي التكبيس"; save(); pushLayout(); renderPage(true) } return true }
 if(d.lefavonly){ S.leFavOnly=!S.leFavOnly; renderPage(); return true }
 if(d.lekindpv){ S.leKind=d.lekindpv; renderPage(); return true }
 return false }
function leImgInput(t){ const f=t.files&&t.files[0], w=findW(t.dataset.wid); if(!f||!w) return; if(f.size>1.5*1024*1024) return toast("الصورة أكبر من 1.5MB — اختر صورة أصغر");
 const r=new FileReader(); r.onload=()=>{ w[t.dataset.leimg]=r.result; save(); pushLayout(); toast("تم رفع الصورة"); renderPage(true) }; r.readAsDataURL(f) }
function fcHTML(){ const F=R.C.followers||{}, l=L(), ws_=l.widgets.filter(w=>w.type==="fcount"), now=Date.now();
 const ago=t=>!t?"لم يُحدَّث بعد":Math.round((now-t)/60000)<1?"الآن":Math.round((now-t)/60000)<60?`قبل ${Math.round((now-t)/60000)} دقيقة`:dt(t);
 return head("👥 عداد المتابعين المباشر","اختر حسابك وتصميمك وانسخ رابط OBS — الرقم التقديري يُوضَّح دائماً")+
 `<div class="card" style="margin-bottom:14px"><h3>⚡ البدء السريع</h3><div class="row">${Object.entries(FC_PLATFORMS).map(([k,P])=>`<button class="btn sm ${k==="tiktok"?"pri":""}" data-fcadd="${k}">+ عداد ${P.name}</button>`).join("")}<button class="btn sm" data-libtab="fcount" data-go="library">🎨 مكتبة التصاميم (${FC_DESIGNS.length}/60)</button></div>
  <p class="mut small" style="margin-top:8px">1) أضف العداد ← 2) اكتب عدد متابعيك الحالي ← 3) انسخ الرابط من «روابط OBS». متابعات TikTok المؤكدة من البث تُضاف تلقائياً.</p></div>
 <div class="grid g2">${Object.entries(FC_PLATFORMS).map(([k,P])=>{ const d=F[k]; const src=d?(P.sources.find(s=>s[0]===d.source)||P.sources[0]):P.sources[0];
  return `<div class="card"><h3><span><span class="fc-mini-logo" style="background:${P.color};color:${P.dark?"#000":"#fff"}">${P.mono}</span> ${P.name}</span>${d?`<span class="tag ${d.verified?"ok":"warn"}">${d.verified?"موثّق من API رسمي":"تقديري"}</span>`:'<span class="tag">غير مُعد</span>'}</h3>
   <div class="grid g3" style="gap:8px">${stat("الإجمالي الحقيقي",d?fcFormat(d.value):"—")}${stat("الجدد في البث",d?"+"+d.session:"—")}${stat("آخر تحديث",d?ago(d.at):"—")}</div>
   <div class="row" style="margin-top:8px"><input class="inp" type="number" min="0" placeholder="عدد ${P.units}ين الحالي" data-fcset-in="${k}" style="max-width:200px"><button class="btn sm pri" data-fcset="${k}">تعيين العدد</button><button class="btn sm" data-fcsession="${k}">بدء جلسة جديدة</button></div>
   <div class="ttl" style="margin:10px 0 4px">مصادر البيانات</div><table><tbody>${P.sources.map(s=>`<tr><td>${s[1]}</td><td><span class="tag ${FC_SOURCE_STATUS[s[2]][1]}">${FC_SOURCE_STATUS[s[2]][0]}</span></td></tr>`).join("")}</tbody></table>
   ${d&&d.test?`<div class="note small" data-fctestinfo="${k}">🧪 معروض حالياً +${d.test} متابع تجريبي فوق الرقم الحقيقي — لا يُحسب كرقم حقيقي. <button class="btn sm" data-fcclear="${k}">مسح التجربة</button></div>`:""}<p class="mut small">المصدر الحالي: <b>${src[1]}</b>${d&&d.err?` · ⚠️ ${esc(d.err)}`:""}${k==="tiktok"?"<br>أحداث المتابعة من البث لا تعطي الإجمالي الحقيقي؛ تُضاف فقط فوق العدد الذي أدخلته.":""}</p></div>` }).join("")}</div>
 <div class="card" style="margin-top:14px"><h3>العدادات في «${esc(l.name)}» <span class="tag">${ws_.length}</span></h3>${ws_.map(w=>widgetQuick(w)).join("")||'<div class="empty">لا توجد عدادات بعد — أضف واحداً من البدء السريع</div>'}
  <div class="row" style="margin-top:8px"><button class="btn sm" data-fctest="1">🧪 +1 متابع تجريبي</button><button class="btn sm" data-fctest="-1">🧪 −1</button><button class="btn sm" data-fctest="25">🧪 +25</button></div><p class="mut small">التجربة تظهر على العداد فقط ومعلّمة كتجريبية — لا تُضاف للرقم الحقيقي، وتُمسح بزر «مسح التجربة» أو عند تعيين العدد.</p></div>` }
function fcPropsHTML(w,sel,rng){ const P=FC_PLATFORMS[w.platform]||FC_PLATFORMS.tiktok, accs=(S.socials.accounts||[]).filter(a=>a.platform===w.platform);
 const tg=(f,l)=>sel(f,l,[["1","ظاهر"],["0","مخفي"]],w[f]!==false?"1":"0"); const inp=(f,l,type="text")=>`<div class="fld"><label>${l}</label><input class="inp" type="${type}" data-wf="${f}" data-wid="${w.id}" value="${esc(w[f]??"")}"></div>`;
 return `<div class="grid g2" style="gap:8px">${sel("platform","المنصة",Object.entries(FC_PLATFORMS).map(([k,x])=>[k,x.name]),w.platform)}${sel("accountId","الحساب (من حساباتي)",[["","— تلقائي —"],...accs.map(a=>[a.id,accountView(a).user||a.id])],w.accountId)}</div>
  ${accs.length?"":`<div class="note small">لا يوجد حساب ${P.name} في «حساباتي» — اكتب الاسم يدوياً أو أضفه من هناك.</div>${inp("handle","اسم الحساب")}`}
  <div class="grid g3" style="gap:8px">${tg("showHead","الرأس")}${tg("showAvatar","الصورة")}${tg("showName","الاسم")}${tg("showLogo","الشعار")}${tg("showNew","الجدد")}${tg("showUnit","كلمة متابع")}</div>
  ${sel("showLast","آخر متابع",[["1","ظاهر"],["0","مخفي"]],w.showLast?"1":"0")}
  <div class="grid g2" style="gap:8px">${sel("numFmt","شكل الرقم",[["full","500,000"],["short","500K"],["ar","500 ألف"]],w.numFmt)}${rng("numScale","حجم الرقم",.5,1.8,.05,w.numScale||1,v=>Math.round(v*100)+"%")}</div>
  <div class="ttl" style="margin:8px 0 4px">🎯 هدف المتابعين</div><div class="grid g2" style="gap:8px">${sel("goalOn","الهدف",[["0","متوقف"],["1","مفعّل"]],w.goalOn?"1":"0")}${w.goalOn?`${inp("goal","العدد المستهدف","number")}${sel("goalStyle","طريقة التعبئة (20)",FC_GOAL_STYLES.map(x=>[x[0],x[1]]),w.goalStyle||"bar")}${sel("goalPct","النسبة المئوية",[["1","ظاهرة"],["0","مخفية"]],w.goalPct!==false?"1":"0")}${sel("goalAuto","بعد الوصول",[["1","انتقل للهدف التالي"],["0","يبقى مكتملاً"]],w.goalAuto?"1":"0")}${inp("goalStep","زيادة الهدف التالي (0 = 10٪)","number")}${inp("goalStart","نقطة بداية الهدف (0 = من الصفر)","number")}${inp("goalStages","مراحل تلقائية (مثال: 3500,4000,5000)")}${sel("goalRemain","العدد المتبقي",[["0","مخفي"],["1","ظاهر"]],w.goalRemain?"1":"0")}<div class="row" style="grid-column:1/-1;gap:4px"><span class="mut small">زيادة تلقائية:</span>${[100,250,500,1000,5000].map(n=>`<button class="btn sm ${+w.goalStep===n?"on":""}" data-fcstep="${n}" data-wid="${w.id}">+${n.toLocaleString("en-US")}</button>`).join("")}</div>${fcGoalCalc(w)}<p class="mut small" style="grid-column:1/-1">التقدم = (العدد الحالي − البداية) ÷ (الهدف − البداية) × 100. عند الوصول يظهر احتفال «حققنا الهدف!» وينتقل للمرحلة التالية من نقطة البداية الصحيحة.</p>`:""}</div>
  <div class="grid g2" style="gap:8px"><div class="fld"><label>لون الرقم</label><input type="color" data-wf="color" data-wid="${w.id}" value="${w.color||"#ffffff"}"></div>${sel("animOn","الحركة",[["1","مفعّلة"],["0","متوقفة"]],w.animOn!==false?"1":"0")}${sel("animSpeed","سرعة الحركة",[[.5,"بطيئة"],[1,"عادية"],[1.5,"سريعة"]],w.animSpeed||1)}</div>
  <div class="row" style="margin-bottom:10px"><button class="btn sm pri" data-lib="${w.id}">🎨 مكتبة العدادات</button><button class="btn sm" data-go="followers">👥 مصدر البيانات</button></div>` }
function fcGoalCalc(w){ const D=fcData(R.C.followers,w.platform), v=D?D.value:0, g=fcGoal(w,v); if(!g) return "";
 return `<div class="note small" style="grid-column:1/-1">الحساب الآن: العدد الحالي <b>${v.toLocaleString("en-US")}</b>${D&&!D.verified?" (تقديري)":""} · البداية <b>${g.start.toLocaleString("en-US")}</b> · الهدف <b>${g.target.toLocaleString("en-US")}</b> · المتبقي <b>${g.remaining.toLocaleString("en-US")}</b> · التقدم <b>${(Math.floor(g.pct*10)/10)}%</b>${g.level?` · المرحلة ${g.level+1}`:""}</div>` }
const fcTags=d=>d.tags||({clear:["transparent"],card:["luxury"],creative:["animated"],mini:["small"]})[d.cat]||[];
const FC_FILTERS=[["transparent","شفافة"],["luxury","فخمة"],["small","صغيرة"],["animated","متحركة"]];
function fcClick(t,d){
 if(d.fcstep){ const w=findW(d.wid); if(w){ w.goalStep=+d.fcstep; w.goalAuto=true; save(); pushLayout(); renderPage(true) } return true }
 if(d.fcf!==undefined){ S.fcF=S.fcF===d.fcf?"":d.fcf; renderPage(); return true }
 if(d.fcg!==undefined){ S.fcGoalPv=d.fcg; renderPage(); return true }
 if(t.hasAttribute("data-fcfavonly")){ S.fcFavOnly=!S.fcFavOnly; renderPage(); return true }
 if(d.fcfav){ const f=S.settings.fcFav=S.settings.fcFav||[]; const i=f.indexOf(d.fcfav); if(i>=0) f.splice(i,1); else f.push(d.fcfav); save(); t.classList.toggle("on",i<0); return true }
 if(d.fcobs){ // كل تصميم برابط OBS مستقل: يُطبَّق على العداد المختار، أو يُنشأ عداد جديد بهذا التصميم
  const l=L(); let w=l.widgets.find(x=>x.type==="fcount"&&x.id===S.libTarget)||null;
  if(!w||w.design!==d.fcobs){ w=l.widgets.find(x=>x.type==="fcount"&&x.design===d.fcobs)||addWidget("fcount",{platform:"tiktok",design:d.fcobs,name:"عداد — "+fcDesignOf(d.fcobs).name}); if(!w.x&&w.x!==0) applyPreset(w,"tr",CV()); save(); pushLayout() }
  copy(overlayURL(l,w.id)); toast("🔗 نُسخ رابط OBS المستقل لـ«"+fcDesignOf(d.fcobs).name+"»"); return true }
 if(d.fcadd){ const w=addWidget("fcount",{platform:d.fcadd,design:d.fcadd==="tiktok"?"floatingTikTok":"minimalGold",name:"عداد "+FC_PLATFORMS[d.fcadd].name}); applyPreset(w,"tr",CV()); save(); pushLayout(); toast("أُضيف العداد — اكتب عدد المتابعين الحالي"); renderPage(); return true }
 if(d.fcset){ const v=document.querySelector(`[data-fcset-in="${d.fcset}"]`).value; if(v===""||+v<0) return toast("اكتب العدد أولاً"),true; clockOp("followers","set",{platform:d.fcset,value:+v}); setTimeout(()=>renderPage(true),80); return true }
 if(d.fcclear){ clockOp("followers","clear_tests",{platform:d.fcclear}); setTimeout(()=>renderPage(true),80); return true }
 if(d.fcsession){ clockOp("followers","session",{platform:d.fcsession}); setTimeout(()=>renderPage(true),80); return true }
 if(d.fctest){ const n=+d.fctest; if(n>0) for(let i=0;i<n;i++) sim({type:"follow",user:simUser(true)}); else clockOp("followers","test",{platform:"tiktok",n}); setTimeout(()=>{ if(S.page==="followers") renderPage(true) },120); return true }
 if(d.fcpv){ const vs=[...liveViews].filter(v=>v.fc&&String(v.w.id).startsWith("pv_")), k=d.fcpv; for(const v of vs){ const st=v._pv; if(k==="up") st.value+=1+Math.floor(Math.random()*3),st.session+=1; else if(k==="down") st.value=Math.max(0,st.value-1); else if(k==="goal") st.value=v.w.goal; v.refreshFc({C:{followers:{[v.w.platform]:st}},SO:S.socials},false) } return true }
 return false }

// ====== إحصائيات نهاية البث (الاستوديو + الأرشيف) ======
S.ps=Object.assign(psDefaults(),ls("b6o6.ps")||{}); S.psTest=ls("b6o6.psTest")||[]; S.psSel=null;
function psSave(re){ ls("b6o6.ps",S.ps); if(re) renderPage(true); else psPreview() }
function psReports(){ return [...((R.C&&R.C.reports)||[]),...S.psTest].sort((a,b)=>b.endedAt-a.endedAt) }
function psCur(){ const L_=psReports(); return L_.find(r=>r.id===S.psSel)||L_[0]||null }
function psDone(rep){ S.psSel=rep.id; const m=modal(`<h3 style="margin:0 0 6px">🎉 اكتمل بثك!</h3><p class="mut">مدة البث ${psDur(rep.durationMs)} — ${psNum0(rep.totals.likes)} إعجاب، ${psNum0(rep.totals.follows)} متابع جديد</p>
 <div class="row" style="gap:8px"><button class="btn pri" data-psopen>📊 عرض إحصائيات البث</button><button class="btn" data-psclose>لاحقاً</button></div>`);
 m.addEventListener("click",e=>{ if(e.target.closest("[data-psopen]")){ m.remove(); go("poststats") } else if(e.target.closest("[data-psclose]")||e.target===m) m.remove() }) }
const psNum0=v=>v==null?"غير متاح":Number(v).toLocaleString("en-US");
function psHTML(){ const o=S.ps, cur=psCur(), L_=psReports();
 const sel=(k,arr)=>`<select class="inp" data-ps="${k}">${arr.map(([v,n])=>`<option value="${v}" ${o[k]===v?"selected":""}>${n}</option>`).join("")}</select>`;
 return head("📊 إحصائيات نهاية البث","تقرير تلقائي بعد تأكيد انتهاء البث (90 ثانية بلا عودة) — الأرقام من أحداث الجلسة الفعلية فقط، وغير المتاح يظهر «غير متاح»")+
 `<div class="bio-ed ps-ed"><div>
 <div class="card"><h3>التقرير</h3>${L_.length?`<select class="inp" data-pssel>${L_.map(r=>`<option value="${r.id}" ${cur&&cur.id===r.id?"selected":""}>${r.test?"🧪 تجريبي — ":""}${new Date(r.endedAt).toLocaleString("ar-SA-u-ca-gregory-nu-latn")} • ${psDur(r.durationMs)}</option>`).join("")}</select>`:'<div class="empty">لا توجد تقارير بعد — سيُنشأ أول تقرير تلقائياً عند انتهاء بثك القادم.</div>'}
  <div class="row" style="gap:6px;margin-top:8px"><button class="btn sm" data-pstest>🧪 إنشاء تقرير الآن (تجريبي)</button>${cur&&cur.test?'<button class="btn sm" data-psdel>🗑️ حذف التقرير التجريبي</button>':""}</div>
  <p class="mut small">التقرير التجريبي يُبنى من بيانات الغرفة الحالية ويُعلَّم «تجريبي» ولا يُحفظ في أرشيف الحساب ولا يُرسل للمجتمعات.</p></div>
 <div class="card"><h3>القالب (${PS_TEMPLATES.length})</h3><div class="row" style="flex-wrap:wrap;gap:6px">${PS_TEMPLATES.map(t=>`<button class="btn sm ${o.template===t.id?"on":""}" data-pst="${t.id}">${t.name}</button>`).join("")}</div></div>
 <div class="card"><h3>المقاس والنص</h3><div class="grid g2" style="gap:8px">
  <div class="fld"><label>المقاس</label>${sel("size",PS_SIZES.map(z=>[z[0],z[1]]))}</div><div class="fld"><label>الاسم الظاهر</label><input class="inp" data-ps="name" value="${esc(o.name)}" placeholder="اسمك"></div>
  <div class="fld" style="grid-column:1/-1"><label>رسالة الشكر</label><input class="inp" data-ps="thanks" value="${esc(o.thanks)}"><div class="row" style="gap:4px;margin-top:4px;flex-wrap:wrap">${PS_THANKS.map((t,i)=>`<button class="btn sm" data-psth="${i}">${esc(t)}</button>`).join("")}</div></div>
  <div class="fld"><label>الخط</label>${sel("font",[["Readex Pro","Readex Pro"],["Changa","Changa"],["Tajawal","Tajawal"],["Cairo","Cairo"]])}</div>
  <div class="fld"><label>لون رسالة الشكر</label><input type="color" class="inp" data-ps="thanksColor" value="${o.thanksColor||"#ffffff"}"></div>
  <div class="fld"><label>حجم رسالة الشكر: ${o.thanksSize}</label><input type="range" min="24" max="80" data-ps="thanksSize" value="${o.thanksSize}"></div></div></div>
 <div class="card"><h3>المؤشرات</h3><div class="row" style="flex-wrap:wrap;gap:10px">${PS_STATS.map(([k,ic,lb])=>`<label class="row small" style="gap:4px"><input type="checkbox" data-psst="${k}" ${o.stats[k]?"checked":""}> ${ic} ${lb}</label>`).join("")}</div>
  <label class="row small" style="gap:6px;margin-top:8px"><input type="checkbox" data-ps="showUnavailable" ${o.showUnavailable?"checked":""}> إظهار المؤشرات غير المتاحة بعبارة «غير متاح»</label>
  <p class="mut small">المشاهدات وأعلى عدد مشاهدين غير متوفرة من TikTok LIVE عبر الاتصال الحالي — لذلك تظهر «غير متاح» ولا نقدّرها.</p></div>
 <div class="card"><h3>القوائم</h3>${PS_LISTS.map(([k,ic,lb])=>`<div class="row" style="justify-content:space-between;margin-bottom:6px"><span>${ic} ${lb}</span><span class="row" style="gap:4px">${[0,3,5,10].map(n=>`<button class="btn sm ${+o.lists[k]===n?"on":""}" data-psl="${k}" data-n="${n}">${n?"أفضل "+n:"إخفاء"}</button>`).join("")}</span></div>`).join("")}</div>
 <div class="card"><h3>التصدير والمشاركة</h3><div class="row" style="gap:6px;flex-wrap:wrap">${[["png","PNG"],["jpeg","JPG"],["webp","WebP"]].map(([f,n])=>`<button class="btn sm pri" data-psdl="${f}" ${cur?"":"disabled"}>⬇️ ${n}</button>`).join("")}<button class="btn sm" data-psshare ${cur?"":"disabled"}>📤 مشاركة</button></div></div>
 </div><div class="ps-phone"><canvas id="ps-cv"></canvas>${cur?"":'<div class="empty">لا يوجد تقرير لعرضه</div>'}</div></div>` }
let psImgs={}, psImgFor=null;
function psPreview(){ const cv=document.getElementById("ps-cv"), cur=psCur(); if(!cv) return; if(!cur){ cv.style.display="none"; return }
 psDraw(cv,cur,S.ps,psImgs); if(psImgFor!==cur.id){ psImgFor=cur.id; psLoadImages(cur).then(m=>{ psImgs=m; const c2=document.getElementById("ps-cv"); if(c2&&psCur()&&psCur().id===cur.id) psDraw(c2,cur,S.ps,psImgs) }) } }
function psBlob(fmt){ const cv=document.createElement("canvas"), cur=psCur(); psDraw(cv,cur,S.ps,psImgs); return new Promise(res=>cv.toBlob(res,"image/"+fmt,.92)) }
function psFile(fmt,b){ const cur=psCur(); return new File([b],`b6o6-stats-${new Date(cur.endedAt).toISOString().slice(0,10)}.${fmt==="jpeg"?"jpg":fmt}`,{type:"image/"+fmt}) }
function psClick(t,d){
 if(d.pst){ S.ps.template=d.pst; psSave(true); return true }
 if(d.psth!==undefined){ S.ps.thanks=PS_THANKS[+d.psth]; psSave(true); return true }
 if(d.psl){ S.ps.lists[d.psl]=+d.n; psSave(true); return true }
 if(t.hasAttribute("data-pstest")){ const now=Date.now(), st=(R.C.session&&!R.C.session.done&&R.C.session.startedAt)||now-3600000;
  const r=buildReport(R,st,now,{id:"t"+now.toString(36),test:true,partial:true}); S.psTest=[r,...S.psTest].slice(0,10); ls("b6o6.psTest",S.psTest); S.psSel=r.id; renderPage(true); toast("🧪 أُنشئ تقرير تجريبي"); return true }
 if(t.hasAttribute("data-psdel")){ const c=psCur(); S.psTest=S.psTest.filter(r=>r.id!==c.id); ls("b6o6.psTest",S.psTest); S.psSel=null; renderPage(true); return true }
 if(d.psdl){ psBlob(d.psdl).then(b=>{ if(!b) return toast("هذا المتصفح لا يدعم الصيغة"); const f=psFile(d.psdl,b), a=document.createElement("a"); a.href=URL.createObjectURL(f); a.download=f.name; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),5000) }); return true }
 if(t.hasAttribute("data-psshare")){ psBlob("png").then(b=>{ const f=psFile("png",b); if(navigator.canShare&&navigator.canShare({files:[f]})) navigator.share({files:[f],title:"إحصائيات البث"}).catch(()=>{}); else toast("المشاركة غير مدعومة هنا — استخدم التنزيل") }); return true }
 return false }
function psInput(t,d,e){
 if(t.hasAttribute("data-pssel")){ S.psSel=t.value; renderPage(true); return true }
 if(d.psst){ S.ps.stats[d.psst]=t.checked; psSave(false); return true }
 if(d.ps){ const k=d.ps; S.ps[k]=t.type==="checkbox"?t.checked:k==="thanksSize"?+t.value:t.value; psSave(k==="size"||k==="font"||k==="showUnavailable"); return true }
 return false }

// ====== الاشتراك: تجربة مجانية ثم اشتراك شهري (الإعدادات من لوحة الإدارة) ======
S.bill={months:1,data:null};
async function billLoad(){ if(!CFG) return; try{ const r=await fetch("/api/billing"); if(r.ok){ S.bill.data=await r.json(); if(S.page==="billing") renderPage(true) } }catch(e){} }
function billHTML(){ const B=S.bill; if(CFG&&!B.data) billLoad();
 const cfg=B.data?.cfg||billingCfg({}), st=B.data?.status||(CFG?CFG.profile?.sub:null), m=B.months, total=Math.round(cfg.priceUsd*m*100)/100, dt_=x=>new Date(x).toLocaleDateString("ar-SA-u-ca-gregory-nu-latn");
 const ok=/billing-ok/.test(location.hash)?'<div class="note" style="margin-bottom:12px">✅ تم استلام الدفع. يُفعَّل الاشتراك تلقائياً فور تأكيد بوابة الدفع (عادة خلال ثوانٍ) — حدّث الصفحة.</div>':"";
 const stTxt=!CFG?"وضع التجربة المحلي — الاشتراك يعمل بعد إنشاء حساب على المنصة المنشورة":!st?"":st.state==="trial"?`🎁 فترة تجربة مجانية — متبقي <b>${st.daysLeft}</b> يوم (حتى ${dt_(st.until)})`:st.state==="active"?`✅ مشترك حتى ${dt_(st.until)}`:st.state==="comp"?`🎁 منحة إدارية${st.until?" حتى "+dt_(st.until):""}`:`⚠️ ${st.label} — بعض الميزات محدودة حتى تشترك`;
 return head("💎 الاشتراك",stTxt)+ok+
 `<div class="grid g2" style="align-items:start"><div class="card" style="border-color:#7c5cff;box-shadow:0 0 0 2px #7c5cff55">
  <h3>B6O6 Streaming — كل الميزات</h3>
  ${cfg.trialEnabled&&cfg.trialDays?`<div style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap"><s class="mut" style="font-size:22px">$${cfg.priceUsd}</s><b style="font-size:34px;color:#4ade80">مجاناً</b><span class="tag">أول ${cfg.trialDays} يوماً</span></div><p class="mut small">بعد التجربة: <b>$${cfg.priceUsd} شهرياً</b> — بدون التزام، ولا يُخصم شيء تلقائياً.</p>`:`<div style="font-size:34px;font-weight:900">$${cfg.priceUsd}<span class="mut small"> / شهر</span></div>`}
  <ul class="small" style="padding-inline-start:18px;line-height:1.9">${cfg.perks.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
  <div class="row" style="margin:8px 0"><span class="mut">مدة الاشتراك:</span>${cfg.months.map(x=>`<button class="btn sm ${m===x?"on":""}" data-billm="${x}">${x===1?"شهر":x===12?"سنة":x+" أشهر"}</button>`).join("")}</div>
  <button class="btn pri" style="width:100%" data-billbuy="1">${st&&st.state==="active"?"تمديد الاشتراك":"اشترك الآن"} — $${total}</button>
  <p class="mut small" style="margin-top:8px">الدفع عبر بوابة آمنة (Stripe) — لا نرى بيانات بطاقتك. يُفعَّل الاشتراك فقط بعد تأكيد موقّع من بوابة الدفع، ويُضاف لما تبقّى من اشتراكك.</p></div>
 <div>${B.data?.history?.length?`<div class="card"><h3>سجل الاشتراكات</h3>${B.data.history.map(h=>`<div class="small">${dt_(h.createdAt)} — ${h.months} شهر — ${h.provider==="admin"?"منحة إدارية":"$"+h.amountUsd}</div>`).join("")}</div>`:""}
 ${CFG?.profile?.isAdmin?'<div class="card"><h3>🛡️ الإدارة</h3><p class="mut small">التحكم بمدة التجربة والسعر والاشتراكات لكل مستخدم.</p><a class="btn pri" href="/admin">فتح لوحة الإدارة</a></div>':""}</div></div>` }
function billClick(t,d){
 if(d.billm){ S.bill.months=+d.billm; renderPage(true); return true }
 if(d.billbuy){ if(!CFG){ toast("الاشتراك متاح بعد إنشاء حساب على المنصة المنشورة"); return true }
  fetch("/api/billing",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({months:S.bill.months})}).then(r=>r.json()).then(j=>{ if(j.url) location.href=j.url; else toast(j.message||j.error||"تعذر بدء الدفع") }).catch(()=>toast("تعذر الاتصال")); return true }
 return false }

// ====== استوديو تنبيهات المتابعين V2 ======
S.faGrp=S.faGrp||"duck";
function faW(){ const ws_=L().widgets.filter(w=>w.type==="falert"); return ws_.find(w=>w.id===S.faSel)||ws_[0]||null }
function faHTML(){ const w=faW(), ws_=L().widgets.filter(x=>x.type==="falert"), B=S.bots.falert||{};
 if(!w) return head("🦆 استوديو تنبيهات المتابعين","تنبيه متحرك لكل متابعة جديدة — بطة بطوط الحصرية + 80 تصميماً")+`<div class="card"><div class="empty">لا يوجد تنبيه متابعين في «${esc(L().name)}» بعد</div><div class="row" style="justify-content:center"><button class="btn pri" data-faadd>➕ إضافة تنبيه المتابعين</button></div></div>`;
 const d=FA_DESIGNS.find(x=>x.id===w.design)||FA_DESIGNS[0];
 const sel=(f,l,opts,v)=>`<div class="fld"><label>${l}</label><select class="inp" data-wf="${f}" data-wid="${w.id}">${opts.map(([k,n])=>`<option value="${k}" ${String(v??"")===String(k)?"selected":""}>${esc(n)}</option>`).join("")}</select></div>`;
 const rng=(f,l,a,b,st,v,fmt)=>`<div class="fld"><label>${l}: <b id="v_${f}">${fmt?fmt(v):v}</b></label><input type="range" min="${a}" max="${b}" step="${st}" value="${v}" data-wf="${f}" data-wid="${w.id}"></div>`;
 const yn=(f,l,v)=>sel(f,l,[["1","ظاهر"],["0","مخفي"]],v?"1":"0");
 return head("🦆 استوديو تنبيهات المتابعين",`${FA_DESIGNS.length} تصميماً · ${Object.keys(FA_ENTER).length} حركة دخول · ${Object.keys(FA_EXIT).length} حركة خروج · طابور بلا تداخل`)+
 `<div class="card" style="margin-bottom:12px"><div class="row" style="gap:6px;flex-wrap:wrap">${ws_.length>1?`<select class="inp" data-fasel style="width:auto">${ws_.map(x=>`<option value="${x.id}" ${x.id===w.id?"selected":""}>${esc(x.name)}</option>`).join("")}</select>`:""}
  <button class="btn pri" data-fatest="1">🧪 تجربة متابعة جديدة</button><button class="btn" data-faduck>🦆 تجربة بطة بطوط</button><button class="btn" data-fatest="6">🧪 6 متابعات معاً (الطابور والدمج)</button>
  <button class="btn" data-facopy="${w.id}">🔗 نسخ رابط OBS</button><button class="btn" data-faadd>➕ تنبيه آخر</button><button class="btn" data-falast>❤️ إضافة عنصر «آخر متابع»</button></div>
  <p class="mut small" style="margin-top:6px">التجربة تظهر بعلامة «تجريبي» ولا تُحسب متابعة حقيقية. أحداث المتابعة الحقيقية تأتي من اتصال TikTok LIVE عند توفرها — لا نفترض بيانات لا يرسلها التكامل.</p></div>
 <div class="grid g2" style="align-items:start"><div>
 <div class="card"><h3>المعاينة الحيّة <span class="tag">نفس مكوّن OBS</span></h3><div id="fa-pv" style="position:relative;height:300px;border-radius:12px;background:repeating-conic-gradient(#1a1f2e 0 25%,#141826 0 50%) 0 0/24px 24px;overflow:hidden"></div></div>
 <div class="card"><h3>التصميم: <span class="tag">#${d.n}</span> ${esc(d.name)}</h3><div class="row" style="gap:4px;flex-wrap:wrap;margin-bottom:8px">${Object.entries(FA_GROUPS).map(([k,n])=>`<button class="btn sm ${S.faGrp===k?"on":""}" data-fagrp="${k}">${n} <span class="tag">${FA_DESIGNS.filter(x=>x.grp===k).length}</span></button>`).join("")}</div>
  <div class="row" style="gap:6px;flex-wrap:wrap">${FA_DESIGNS.filter(x=>x.grp===S.faGrp).map(x=>`<button class="btn sm ${x.id===w.design?"on":""}" data-fadesign="${x.id}">#${x.n} ${esc(x.name)}</button>`).join("")}</div></div></div>
 <div>
 <div class="card"><h3>الشخصية المتحركة</h3><div class="grid g2" style="gap:8px">
  ${sel("char","الشخصية",[["","— حسب التصميم —"],["none","بدون شخصية"],...Object.entries(FA_CHARS).map(([k,v])=>[k,v[0]])],w.char)}
  ${sel("duck","نسخة البطة",[["","— حسب التصميم —"],...Object.keys(DUCK_VARIANTS).map(k=>[k,{classic:"كلاسيكية",royal:"ملكية بتاج",gaming:"ألعاب بسماعة",neon:"نيون",diamond:"ماسية",saudi:"سعودية بشماغ",mini:"صغيرة",dancing:"راقصة",flying:"طائرة",legendary:"أسطورية"}[k]])],w.duck)}
  ${sel("act","حركة الشخصية",[["","— حسب التصميم —"],...Object.entries(FA_ACTIONS)],w.act)}${sel("side","تدخل من",[["right","اليمين"],["left","اليسار"]],w.side)}
  ${rng("charScale","حجم الشخصية",.4,2,.05,w.charScale||1,v=>Math.round(v*100)+"%")}
  <div class="fld"><label>شخصيتك الخاصة (GIF / WebP / WebM شفاف / PNG — حتى 2MB)</label><input type="file" accept="image/gif,image/webp,image/png,video/webm" data-fachar="${w.id}">${w.customChar?`<button class="btn sm" data-fanochar>إزالة الشخصية المرفوعة</button>`:""}</div></div></div>
 <div class="card"><h3>رسالة الشكر</h3><div class="fld"><label>رسالة في كل سطر — المتغيرات: {username} {display_name} {platform} {follower_count} {stream_name}</label><textarea class="inp" rows="4" data-wf="msgs" data-wid="${w.id}">${esc(w.msgs||"")}</textarea></div>
  <div class="row" style="gap:4px;flex-wrap:wrap">${FA_MSGS.map((m,i)=>`<button class="btn sm" data-famsg="${i}">${esc(m)}</button>`).join("")}</div>
  <div class="grid g2" style="gap:8px;margin-top:8px">${sel("msgRandom","اختيار الرسالة",[["0","الأولى دائماً"],["1","عشوائية"]],w.msgRandom?"1":"0")}<div class="fld"><label>السطر الثاني</label><input class="inp" data-wf="sub" data-wid="${w.id}" value="${esc(w.sub??"")}"></div>${yn("showSub","السطر الثاني",w.showSub!==false)}${yn("showAv","صورة المتابع",w.showAv!==false)}<div class="fld"><label>اسم البث ({stream_name})</label><input class="inp" data-wf="streamName" data-wid="${w.id}" value="${esc(w.streamName||"")}"></div></div></div>
 <div class="card"><h3>الحركة والمدة</h3><div class="grid g2" style="gap:8px">
  ${sel("enter","حركة الدخول (30)",[["","— حسب التصميم —"],...Object.entries(FA_ENTER).map(([k,v])=>[k,v[0]])],w.enter)}${sel("exit","حركة الخروج (20)",[["","— حسب التصميم —"],...Object.entries(FA_EXIT).map(([k,v])=>[k,v[0]])],w.exit)}
  ${rng("enterMs","مدة الدخول",200,2000,50,w.enterMs||700,v=>v+"ms")}${rng("holdMs","مدة البقاء",1500,10000,100,w.holdMs||3700,v=>v+"ms")}${rng("exitMs","مدة الخروج",200,2000,50,w.exitMs||600,v=>v+"ms")}
  ${sel("animSpeed","سرعة الحركة",[[.5,"بطيئة"],[1,"عادية"],[1.5,"سريعة"]],w.animSpeed||1)}${sel("reduceFx","تقليل المؤثرات",[["0","لا"],["1","نعم"]],w.reduceFx?"1":"0")}
  <p class="mut small" style="grid-column:1/-1">المدة الإجمالية ≈ ${(((+w.enterMs||700)*1.4+450+(+w.holdMs||3700)+500+(+w.exitMs||600)*1.6)/1000).toFixed(1)} ث — أقل بقاء 1.5 ث حتى تُقرأ الرسالة.</p></div></div>
 <div class="card"><h3>الشكل والخلفية</h3><div class="grid g2" style="gap:8px">${sel("bgMode","الخلفية",[["premium","بطاقة فاخرة"],["clear","شفاف (بدون خلفية)"]],w.bgMode||"premium")}<div class="fld"><label>لون الإطار</label><input type="color" data-wf="frameColor" data-wid="${w.id}" value="${w.frameColor||"#22e1ff"}"></div>
  ${rng("avScale","حجم الصورة",.5,1.6,.05,w.avScale||1,v=>Math.round(v*100)+"%")}${rng("nameScale","حجم الاسم",.6,1.6,.05,w.nameScale||1,v=>Math.round(v*100)+"%")}</div></div>
 <div class="card"><h3>الطابور</h3><div class="grid g2" style="gap:8px">${rng("qMax","حد الانتظار",5,100,1,w.qMax||30)}${rng("mergeAt","دمج المتابعات عند تجاوز",0,30,1,w.mergeAt??6,v=>v?v+" بالانتظار":"بدون دمج")}</div><p class="mut small">تنبيه واحد في كل مرة، بلا تكرار لنفس الحدث. عند الدمج: «❤️ شكراً لـ N متابعاً جديداً!»</p></div>
 <div class="card"><h3>الصوت والقارئ الصوتي</h3><div class="grid g2" style="gap:8px">
  <div class="fld"><label>القارئ الصوتي (من مركز البوتات — مرة واحدة لكل متابعة)</label><select class="inp" data-fatts><option value="0" ${B.tts?"":"selected"}>متوقف</option><option value="1" ${B.tts?"selected":""}>مفعّل</option></select></div>
  <div class="fld"><label>نص القراءة</label><input class="inp" data-fattstext value="${esc(B.text||"يا هلا والله بـ {username}، نورتنا يا أسطورة!")}"></div>
  <div class="fld"><label>صوت ترحيبي مرفوع (MP3/OGG — حتى 1MB، يعمل في OBS فقط)</label><input type="file" accept="audio/*" data-fasound="${w.id}">${w.sound?`<button class="btn sm" data-fanosound>إزالة الصوت</button>`:""}</div>${rng("soundVol","مستوى الصوت",0,1,.05,w.soundVol??.8,v=>Math.round(v*100)+"%")}</div>
  <p class="mut small">اختيار الصوت العربي/السعودي من «مركز البوتات ← القارئ الصوتي» (حسب الأصوات المتوفرة في جهازك).</p></div>
 </div></div>` }
let faPv=null;
function faPreview(){ const box=document.getElementById("fa-pv"), w=faW(); if(!box||!w) return; box.innerHTML=""; liveViews.delete(faPv);
 const cv={w:Math.max(320,box.clientWidth),h:300}, pw={...w,id:"pv_fa",x:.02,y:.04,w:.96,h:.92};
 const stg=document.createElement("div"); stg.className="stage"; stg.style.cssText=`width:${cv.w}px;height:${cv.h}px;background:none;position:absolute;left:0;top:0`; box.appendChild(stg);
 faPv=new View(pw,cv,{data:SRC,globalFx:S.settings.fx,mute:true}); stg.appendChild(faPv.el); liveViews.add(faPv); setTimeout(()=>faPv&&faPv.faTest("متابع تجريبي"),150) }
function faFile(t,max,cb){ const f=t.files&&t.files[0]; if(!f) return; if(f.size>max) return toast("الملف أكبر من المسموح"); const r=new FileReader(); r.onload=()=>cb(r.result); r.readAsDataURL(f) }
function faClick(t,d){ const w=faW();
 if(t.hasAttribute("data-faadd")){ const n=addWidget("falert",{name:"تنبيه المتابعين"}); applyPreset(n,"bc",CV()); S.faSel=n.id; save(); pushLayout(); renderPage(true); return true }
 if(t.hasAttribute("data-falast")){ const n=addWidget("levent",{kind:"follow",mode:"sticky",title:"❤️ آخر متابع",name:"آخر متابع",design:"duckRoyal"}); applyPreset(n,"tr",CV()); save(); pushLayout(); toast("أُضيف «آخر متابع» — اختر تصميمه من مكتبة آخر التفاعلات (80)"); return true }
 if(!w) return false;
 if(d.fagrp){ S.faGrp=d.fagrp; renderPage(true); return true }
 if(d.fadesign){ w.design=d.fadesign; save(); pushLayout(); renderPage(true); return true }
 if(d.famsg!==undefined){ const m=FA_MSGS[+d.famsg]; w.msgs=(w.msgs?w.msgs.trim()+"\n":"")+m; save(); pushLayout(); renderPage(true); return true }
 if(d.fatest){ const n=+d.fatest; for(let i=0;i<n;i++) sim({type:"follow",user:simUser(true)}); return true }
 if(t.hasAttribute("data-faduck")){ if(!/^duck_/.test(w.design)){ w.design="duck_classic"; save(); pushLayout(); renderPage(true) } else faPreview(); return true }
 if(d.facopy){ copy(overlayURL(L(),d.facopy)); toast("🔗 نُسخ رابط OBS لتنبيه المتابعين"); return true }
 if(t.hasAttribute("data-fanochar")){ w.customChar=""; save(); pushLayout(); renderPage(true); return true }
 if(t.hasAttribute("data-fanosound")){ w.sound=""; save(); pushLayout(); renderPage(true); return true }
 return false }
function faInput(t,d,e){
 if(t.hasAttribute("data-fasel")&&e.type==="change"){ S.faSel=t.value; renderPage(true); return true }
 if(d.fachar&&e.type==="change"){ const w=findW(d.fachar); faFile(t,2*1024*1024,u=>{ w.customChar=u; save(); pushLayout(); renderPage(true) }); return true }
 if(d.fasound&&e.type==="change"){ const w=findW(d.fasound); faFile(t,1024*1024,u=>{ w.sound=u; save(); pushLayout(); renderPage(true) }); return true }
 if(t.hasAttribute("data-fatts")&&e.type==="change"){ S.bots.falert={...(S.bots.falert||{}),tts:t.value==="1"}; save(); pushLayout(); return true }
 if(t.hasAttribute("data-fattstext")&&e.type==="change"){ S.bots.falert={...(S.bots.falert||{}),text:t.value.slice(0,200)}; save(); pushLayout(); return true }
 return false }

// ====== سوق آيرتات المجتمع + صندوق الآيرتات الشامل ======
const AL_TEST_VARS={username:"test_user",display_name:"مشاهد تجريبي",platform:"TikTok",likes:"100",total_likes:"1000",gift_name:"وردة",gift_count:"5",diamonds:"5",amount:"10",currency:"USD",message:"رسالة تجريبية",time_added:"0:30",time_removed:"0:30",goal:"1000",progress:"100%",level:"",rank:"1"};
function ALS(){ return S.al||(S.al={tab:"lib",sec:"all",q:"",cat:"",kind:"",event:"",items:[],total:0,at:0,key:"",vis:"all",cache:{},form:null,designers:null,adm:null,admTab:"pending",busy:false,quota:null}) }
function alLocal(){ return ls("b6o6.alerts")||[] }
function alLocalSave(list){ try{ localStorage.setItem("b6o6.alerts",JSON.stringify(list)); return true }catch(e){ toast("مساحة المتصفح ممتلئة — احذف آيرتات أو استخدم المنصة بعد تسجيل الدخول"); return false } }
/** إعدادات القواعد داخل إعدادات البوتات (تصل للغرفة مع التخطيط — مصدر واحد في الخادم) */
function alCfgS(){ S.bots.alerts=S.bots.alerts||{enabled:true,rules:[],gapMs:600,maxQueue:30,mergeLikes:true}; return S.bots.alerts }
function alSaveCfg(){ save(); pushLayout(); syncBots() }
async function alApi(path,opt){ try{ const r=await fetch(path,opt&&opt.body&&!(opt.body instanceof FormData)?{...opt,headers:{"content-type":"application/json"},body:JSON.stringify(opt.body)}:opt); const j=await r.json().catch(()=>({})); if(!r.ok){ j.error=j.error||("HTTP "+r.status); j.status=r.status } return j }catch(e){ return {error:"network"} } }
const alOfficial=()=>FA_DESIGNS.map(d=>({id:"tpl:"+d.id,name:d.name,description:"قالب رسمي من المنصة — "+(d.ar||""),kind:"template",event:"follow",durationSec:6,official:true,config:alConfig({template:d.id}),designer:{name:"بطوط ستريم",verified:true},uses:0,likes:0,rating:0,tags:[d.grp]}));
function alDef(a){ return {id:a.id,name:a.name,kind:a.kind,event:a.event,durationSec:a.durationSec,config:a.config,mediaUrl:a.mediaUrl||a.mediaData||"",audioUrl:a.audioUrl||a.audioData||"",coverUrl:a.coverUrl||a.coverData||""} }
/** تعريفات المعاينة في اللوحة: الرسمية + المحلية + ما حُمّل من الخادم */
function alSyncDefs(){ const A=ALS(), m={}; for(const a of alOfficial()) m[a.id]=alDef(a); for(const a of alLocal()) m[a.id]=alDef(a); for(const a of Object.values(A.cache)) if(!a.unavailable) m[a.id]=alDef(a); Object.assign(AB_DEFS,m) }
const alKindOf=mime=>/^video/.test(mime)?"video":mime==="image/gif"?"gif":/^image/.test(mime)?"image":mime==="application/json"?"lottie":/^audio/.test(mime)?"audio":"";
async function alLoad(force){ const A=ALS(); const key=[A.sec,A.q,A.cat,A.kind,A.event,A.vis,A.grp||"",A.alpha||"",A.desId||""].join("|"); if(!force&&A.key===key&&Date.now()-A.at<20000) return; A.key=key; A.at=Date.now();
 if(A.sec==="official"){ A.items=alFilter(alSearch(alOfficial(),A.q)); A.total=A.items.length; return softRefresh() }
 if(A.sec==="packs"){ if(!CFG){ A.packs=[]; return softRefresh() } const [pub,mine]=await Promise.all([alApi("/api/alerts/packs"),alApi("/api/alerts/packs?mine=1")]); const m=new Map(); for(const p of [...(mine.packs||[]).map(x=>({...x,mine:true})),...(pub.packs||[])]) if(!m.has(p.id)) m.set(p.id,p); A.packs=[...m.values()]; return softRefresh() }
 if(A.sec==="designers"){ if(!CFG){ A.designers=[]; return softRefresh() } const j=await alApi("/api/alerts/designers"); A.designers=j.designers||[]; return softRefresh() }
 if(!CFG){ const loc=alLocal().map(a=>({...a,mine:true,using:true,badge:alBadge(a),group:alEventGroup(a.event)})); A.items=["mine","using","all"].includes(A.sec)?alFilter(alSearch(loc,A.q)):[]; if(A.sec==="all") A.items=[...A.items,...alFilter(alSearch(alOfficial(),A.q)).slice(0,24)]; A.total=A.items.length; return softRefresh() }
 const p=new URLSearchParams({section:A.sec==="designer"?"designer":A.sec,q:A.q,cat:A.cat,kind:A.kind==="template"?"":A.kind,event:A.event,vis:A.vis,group:A.grp||"",alpha:A.alpha||""}); if(A.desId) p.set("id",A.desId);
 A.busy=true; const j=await alApi("/api/alerts?"+p); A.busy=false; if(j.error){ A.items=[]; A.err=j.status===401?"سجّل الدخول لعرض هذا القسم":"تعذر التحميل"; return softRefresh() }
 A.err=""; A.items=alFilter(j.items||[]); if(A.sec==="mine"&&A.sort&&A.sort!=="date") A.items.sort((x,y)=>String(x[A.sort]||"").localeCompare(String(y[A.sort]||""),"ar")); A.total=j.total||A.items.length; for(const a of A.items) if(a.id) A.cache[a.id]=a;
 if(A.sec==="all"&&!A.q) A.items=[...A.items,...alFilter(alOfficial()).slice(0,24)]; alSyncDefs(); softRefresh() }
/** فلترة إضافية في المتصفح (نفس منطق الخادم) — مجموعة الحدث، الطابع، نوع الملف، الشفافية */
function alFilter(list){ const A=ALS(), G=A.grp&&AL_EVENT_GROUPS[A.grp]?AL_EVENT_GROUPS[A.grp][1]:null;
 return list.filter(a=>(!G||G.includes(a.event))&&(!A.cat||a.category===A.cat)&&(!A.kind||a.kind===A.kind)&&(!A.alpha||(A.alpha==="1")===alIsAlpha(a))) }
function alIsAlpha(a){ return a.kind==="template"||a.kind==="lottie"||!!(a.meta&&a.meta.alpha) }
function alFind(id){ const A=ALS(); return A.cache[id]||alLocal().find(x=>x.id===id)||alOfficial().find(x=>x.id===id)||(A.items||[]).find(x=>x.id===id) }
const alFmtSize=b=>!b?"":b>1048576?(b/1048576).toFixed(1)+" MB":Math.max(1,Math.round(b/1024))+" KB";
const alFmtDur=s=>s==null?"":(Math.round(s*10)/10)+" ث";
function alCard(a){ const off=a.official, b=a.mine&&a.badge?a.badge:null, ev=AL_EVENTS[a.event]||{}, my=a.my||{}, d=a.designer||{}, m=a.meta||{};
 const cover=a.coverUrl||a.coverData||((a.kind==="image"||a.kind==="gif")?(a.mediaUrl||a.mediaData):"");
 const thumb=cover?`<img src="${esc(cover)}" alt="" loading="lazy" decoding="async">`:a.kind==="audio"?`<div class="al-acov"><span>🔊</span><b>${esc(a.name||"")}</b></div>`:`<div class="al-acov"><span>${off?"🦆":a.kind==="lottie"?"✨":"🔔"}</span><b>${esc(a.name||"")}</b></div>`;
 const hasSound=a.kind==="audio"||!!(a.audioUrl||a.audioData)||m.hasAudio===true||off;
 return `<div class="card al-card"><div class="al-th" data-alhv="${esc(a.id)}">${thumb}
  <div class="al-tags">${alIsAlpha(a)?`<span title="خلفية شفافة">◩ شفاف</span>`:""}${a.durationSec?`<span>${a.durationSec}ث</span>`:""}</div>
  ${hasSound?`<button class="al-snd" data-alsnd="${esc(a.id)}" title="تجربة الصوت">🔊</button>`:""}<button class="al-tp" data-altp="${esc(a.id)}" title="تشغيل">▶</button></div>
 <div class="al-nm">${esc(a.name||"")}</div>
 <div class="mut small">${esc(AL_CATS[a.category]||"")}${a.category?" · ":""}${ev.icon||""} ${esc(ev.label||a.event||"")}</div>
 <div class="small">${off?"🏛️ رسمي من المنصة":`🎨 ${esc(d.name||a.designerName||"")}${d.verified?" ✔️":""}`}${b?` · <span class="tag" title="${esc(b[1])}">${b[0]} ${esc(b[1])}</span>`:""}</div>
 ${off||a.mine?"":`<div class="mut small">▶️ ${a.uses|0} · ❤️ ${a.likes|0} · ⭐ ${a.rating||0}</div>`}
 ${a.mine&&a.reviewNote&&(a.review==="rejected"||a.removed)?`<div class="note small">ملاحظة الإدارة: ${esc(a.reviewNote)}</div>`:""}
 <div class="row" style="gap:4px;flex-wrap:wrap;margin-top:auto;padding-top:6px">
  <button class="btn sm pri" data-aluse="${esc(a.id)}">➕ استخدام</button><button class="btn sm" data-alpv="${esc(a.id)}">👁 معاينة</button>
  ${a.mine?`<button class="btn sm" data-alman="${esc(a.id)}">⚙️ إدارة</button>`:""}
  ${!off&&!a.mine&&CFG?`<button class="btn sm ${my.fav?"on":""}" data-alact="fav" data-alid="${esc(a.id)}" title="المفضلة">🔖</button><button class="btn sm ${my.like?"on":""}" data-alact="like" data-alid="${esc(a.id)}" title="إعجاب">❤️</button>
  <select class="inp" style="width:auto;padding:2px 4px" data-alrate="${esc(a.id)}"><option value="0">⭐</option>${[1,2,3,4,5].map(n=>`<option value="${n}" ${my.rating===n?"selected":""}>${"★".repeat(n)}</option>`).join("")}</select>
  <button class="btn sm" data-alrep="${esc(a.id)}" title="إبلاغ">🚩</button>${a.using?`<button class="btn sm" data-alunuse="${esc(a.id)}" title="إزالة من آيرتاتي المستخدمة">✖</button>`:""}${d.id?`<button class="btn sm" data-aldes="${esc(d.id)}" title="أعمال المصمم">👤</button>`:""}`:""}</div></div>` }

function alLibHTML(){ const A=ALS(); alLoad();
 const secs=AL_SECTIONS.filter(([k])=>CFG||["all","official","mine","using"].includes(k));
 const sub=A.sec==="mine"?`<div class="row" style="gap:4px;flex-wrap:wrap;margin:6px 0">${[["all","جميع آيرتاتي"],["public","🌍 العامة"],["private","🔒 الخاصة"],["pending","⏳ بانتظار المراجعة"],["rejected","❌ مرفوضة/محذوفة"]].map(([k,n])=>`<button class="btn sm ${A.vis===k?"on":""}" data-alvisf="${k}">${n}</button>`).join("")}<select class="inp" style="width:auto;padding:2px 6px" data-alsort><option value="date" ${A.sort==="date"?"selected":""}>الأحدث</option><option value="name" ${A.sort==="name"?"selected":""}>الاسم</option><option value="kind" ${A.sort==="kind"?"selected":""}>النوع</option></select>${CFG&&A.quota?`<span class="mut small">مساحتك: ${(A.quota.used/1048576).toFixed(1)} / ${Math.round(A.quota.quota/1048576)} MB</span>`:""}</div>`:"";
 let body;
 if(A.sec==="packs") body=`<div class="row" style="margin-bottom:8px"><button class="btn pri" data-alpknew ${CFG?"":"disabled"}>➕ إنشاء حزمة</button>${CFG?"":`<span class="mut small">الحزم متاحة بعد تسجيل الدخول</span>`}</div>`+(!A.packs?`<div class="empty">جاري التحميل…</div>`:!A.packs.length?`<div class="empty">لا توجد حزم بعد — اجمع آيرتاتك المتناسقة (فولو، لايك، هدية، دونيشن…) في حزمة واحدة</div>`:`<div class="grid g3">${A.packs.map(p=>`<div class="card"><h3>📦 ${esc(p.name)}</h3><p class="mut small">${esc(p.description||"")}</p><p class="small">${p.alertIds.length} آيرت${p.mine?` · ${p.visibility==="public"?"🌍 عامة":"🔒 خاصة"}`:""}</p><div class="row" style="gap:4px;flex-wrap:wrap"><button class="btn sm pri" data-alpkadd="${esc(p.id)}">➕ إضافة الحزمة كاملة</button>${p.mine?`<button class="btn sm" data-alpkdel="${esc(p.id)}">🗑️</button>`:""}</div></div>`).join("")}</div>`);
 else if(A.sec==="designers") body=!A.designers?`<div class="empty">جاري التحميل…</div>`:!A.designers.length?`<div class="empty">لا يوجد مصممون بآيرتات عامة معتمدة بعد</div>`:`<div class="grid g3">${A.designers.map(d=>`<div class="card"><h3>🎨 ${esc(d.name)}</h3><div class="row" style="gap:4px;flex-wrap:wrap">${d.badges.map(b=>`<span class="tag">${esc(b[1])}</span>`).join("")}</div><p class="mut small">${d.count} آيرت · ${d.uses} استخدام · ⭐ ${d.rating} · ${d.followers} متابع</p><div class="row" style="gap:4px"><button class="btn sm pri" data-aldes="${esc(d.id)}">عرض الآيرتات</button><button class="btn sm ${d.following?"on":""}" data-alfol="${esc(d.id)}">${d.following?"✔ تتابعه":"➕ متابعة"}</button></div></div>`).join("")}</div>`;
 else body=A.busy?`<div class="empty">جاري التحميل…</div>`:A.err?`<div class="empty">${esc(A.err)}</div>`:!A.items.length?`<div class="empty">${A.sec==="mine"?"لم ترفع آيرتات بعد — ابدأ من «رفع آيرت جديد»":!CFG&&!["official"].includes(A.sec)?"آيرتات المجتمع متاحة بعد تسجيل الدخول على المنصة":"لا توجد آيرتات بهذه الفلاتر"}</div>`:`<div class="al-grid">${A.items.map(alCard).join("")}</div>`;
 const chips=(attr,cur,list)=>`<div class="al-chips">${list.map(([k,n])=>`<button class="al-chip ${cur===k?"on":""}" ${attr}="${k}">${esc(n)}</button>`).join("")}</div>`;
 return `<div class="card al-hero"><div class="row" style="justify-content:space-between;gap:8px;flex-wrap:wrap"><div><h3 style="margin:0">🔔 اختر آيرتك</h3><p class="mut small" style="margin:2px 0 0">مرّر الماوس على أي آيرت لمشاهدة حركته — 🔊 لتجربة الصوت</p></div><button class="btn pri" data-altab="create">➕ إنشاء آيرت جديد</button></div>
 <div class="row" style="gap:4px;flex-wrap:wrap;margin-top:8px">${secs.map(([k,n])=>`<button class="btn sm ${A.sec===k||A.sec==="designer"&&k==="designers"?"pri":""}" data-alsec="${k}">${n}</button>`).join("")}</div>
 <input class="inp" style="margin-top:8px" placeholder="🔍 ابحث باسم الآيرت أو المصمم أو التصنيف" data-alq value="${esc(A.q)}">
 <div class="small mut" style="margin-top:8px">نوع الحدث</div>${chips("data-algrp",A.grp||"",[["","الكل"],...Object.entries(AL_EVENT_GROUPS).map(([k,[n]])=>[k,n])])}
 <div class="small mut">طابع التصميم</div>${chips("data-alsty",A.cat||"",[["","الكل"],...Object.entries(AL_STYLES)])}
 <div class="row" style="gap:6px;flex-wrap:wrap;margin-top:6px"><select class="inp" style="width:auto" data-alf="kind"><option value="">كل الأنواع</option>${[["video","🎬 فيديو"],["gif","🌀 GIF متحرك"],["image","🖼️ صورة"],["audio","🔊 صوت فقط"],["lottie","✨ Lottie"],["template","🏛️ قالب رسمي"]].map(([k,n])=>`<option value="${k}" ${A.kind===k?"selected":""}>${n}</option>`).join("")}</select>
 <select class="inp" style="width:auto" data-alf="alpha"><option value="">شفاف أو بخلفية</option><option value="1" ${A.alpha==="1"?"selected":""}>◩ شفاف فقط</option><option value="0" ${A.alpha==="0"?"selected":""}>▣ بخلفية فقط</option></select></div>${sub}
 <p class="mut small" style="margin-top:6px">🔒 الآيرت الخاص يراه صاحبه فقط. 🌍 العام يظهر للجميع بعد المراجعة. عند استخدام آيرت غيرك تحصل على إعداداتك المستقلة — لا يتغير الأصل.</p></div>${body}` }

/* ---------------- معاينة البطاقة (Hover) — معاينة واحدة فقط في كل لحظة ---------------- */
let AH={el:null,v:null,au:null,view:null,img:null,snd:false,id:""}, alIO=null;
function alHoverStop(){ const h=AH; if(!h.el) return; h.el.classList.remove("playing","snd"); try{ if(h.v){ h.v.pause(); h.v.removeAttribute("src"); h.v.load(); h.v.remove() } if(h.au){ h.au.pause(); h.au.src="" } if(h.img) h.img.remove(); if(h.view){ liveViews.delete(h.view); h.view.el.parentNode&&h.view.el.parentNode.remove() } }catch(e){} if(alIO&&h.el) alIO.unobserve(h.el); AH={el:null,v:null,au:null,view:null,img:null,snd:false,id:""} }
function alHoverStart(th,sound){ const id=th.dataset.alhv, a=alFind(id); if(!a) return;
 if(AH.el===th){ if(sound!==undefined) alHoverSound(sound); return } alHoverStop(); AH={el:th,v:null,au:null,view:null,img:null,snd:false,id}; th.classList.add("playing");
 const src=a.previewUrl||a.mediaUrl||a.mediaData;
 if(a.kind==="video"&&src){ const v=document.createElement("video"); v.className="al-hv"; v.muted=true; v.loop=true; v.playsInline=true; v.preload="auto"; v.src=src; th.appendChild(v); AH.v=v; v.play().catch(()=>{}) }
 else if((a.kind==="gif"||a.kind==="image")&&(a.mediaUrl||a.mediaData)&&(a.coverUrl||a.coverData)){ const im=document.createElement("img"); im.className="al-hv"; im.src=a.mediaUrl||a.mediaData; th.appendChild(im); AH.img=im }
 else if(a.kind==="template"||a.kind==="lottie"){ AB_DEFS[a.id]=alDef(a); const box=document.createElement("div"); box.className="al-hv"; th.appendChild(box); const v=alPreviewMountEl(box,{mute:true}); if(v){ AH.view=v; v.aboxPush([{id:"h"+Date.now(),alertId:a.id,event:a.event,vars:{...AL_TEST_VARS},priority:1,test:false}]) } }
 if(!alIO&&"IntersectionObserver" in window) alIO=new IntersectionObserver(es=>{ for(const e of es) if(!e.isIntersecting&&e.target===AH.el) alHoverStop() },{threshold:.15});
 if(alIO) alIO.observe(th);
 if(sound) alHoverSound(true) }
/** الصوت بالضغط فقط (سياسات المتصفح تسمح بالصوت بعد تفاعل المستخدم) */
function alHoverSound(on){ const a=alFind(AH.id); if(!a||!AH.el) return; AH.snd=on; AH.el.classList.toggle("snd",on);
 if(AH.v){ AH.v.muted=!on; AH.v.volume=1; if(on){ AH.v.currentTime=0; AH.v.play().catch(()=>{}) } }
 const au=a.audioUrl||a.audioData||(a.kind==="audio"?(a.mediaUrl||a.mediaData):"");
 if(au){ if(on){ if(!AH.au) AH.au=new Audio(au); AH.au.currentTime=0; AH.au.play().catch(()=>toast("المتصفح منع تشغيل الصوت — اضغط مرة أخرى")) } else if(AH.au) AH.au.pause() }
 if(AH.view&&on){ /* القوالب الرسمية بدون ملف صوتي */ } }
function alHoverWire(){ const pg=document.getElementById("pg"); if(!pg||pg.__alhv) return; pg.__alhv=1;
 const canHover=()=>matchMedia("(hover:hover)").matches;
 pg.addEventListener("mouseover",e=>{ if(!canHover()) return; const th=e.target.closest&&e.target.closest(".al-th[data-alhv]"); if(th&&S.page==="alerts") alHoverStart(th) });
 pg.addEventListener("mouseout",e=>{ if(!canHover()||!AH.el) return; const to=e.relatedTarget; if(!to||!AH.el.contains(to)) { const from=e.target.closest&&e.target.closest(".al-th"); if(from===AH.el) alHoverStop() } }) }
function alPreviewMountEl(box,opt){ box.innerHTML=""; const cv={w:Math.max(160,box.clientWidth||320),h:Math.max(90,box.clientHeight||180)}; const stg=document.createElement("div"); stg.className="stage"; stg.style.cssText=`width:${cv.w}px;height:${cv.h}px;background:none;position:absolute;left:0;top:0`; box.appendChild(stg);
 const v=new View(newWidget("abox",{id:"pv_ab"+Math.random().toString(36).slice(2,6),x:0,y:0,w:1,h:1}),cv,{data:SRC,mute:opt&&opt.mute!==false}); stg.appendChild(v.el); return v }

/* ---------------- نافذة المعاينة الكاملة ---------------- */
const AL_BGS={checker:"repeating-conic-gradient(#d9dbe3 0 25%,#fff 0 50%) 0 0/22px 22px",black:"#000",white:"#fff",game:"url(\"data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a7bd5"/><stop offset="1" stop-color="#9fd3ff"/></linearGradient></defs><rect width="640" height="360" fill="url(#s)"/><circle cx="520" cy="70" r="34" fill="#fff6b0"/><path d="M0 250 L90 170 L170 230 L260 140 L360 240 L450 160 L540 220 L640 150 V360 H0Z" fill="#3c6e47"/><rect y="290" width="640" height="70" fill="#5b4632"/><rect x="300" y="236" width="26" height="54" fill="#e94b3c"/><circle cx="313" cy="226" r="12" fill="#f5c9a0"/><rect x="12" y="12" width="150" height="14" rx="7" fill="#0007"/><rect x="14" y="14" width="104" height="10" rx="5" fill="#ff4d4d"/><rect x="12" y="32" width="110" height="12" rx="6" fill="#0007"/><rect x="14" y="34" width="60" height="8" rx="4" fill="#4dc3ff"/><rect x="560" y="12" width="68" height="22" rx="6" fill="#0008"/><text x="594" y="28" font-family="sans-serif" font-size="13" fill="#fff" text-anchor="middle">12:48</text><rect x="12" y="300" width="200" height="48" rx="8" fill="#0007"/><text x="22" y="320" font-family="sans-serif" font-size="12" fill="#fff">viewer: hi!</text><text x="22" y="338" font-family="sans-serif" font-size="12" fill="#ffd76a">fan: GG 🔥</text></svg>')+"\") center/cover"};
function alPreviewModal(id){ const a=alFind(id); if(!a) return; alHoverStop(); AB_DEFS[a.id]=alDef(a); const m0=a.meta||{}, ev=AL_EVENTS[a.event]||{}, d=a.designer||{}; let mute=true, bg="checker";
 const info=[["النوع",(AL_KINDS[a.kind]||a.kind)],["الحدث",(ev.icon||"")+" "+(ev.label||a.event)],["التصنيف",AL_CATS[a.category]||"—"],["المصمم",a.official?"بطوط ستريم":(d.name||a.designerName||"—")],["المدة",(a.durationSec||"—")+" ث"+(m0.duration?` (الملف ${alFmtDur(m0.duration)})`:"")],["الأبعاد",m0.w?m0.w+"×"+m0.h:"—"],["الحجم",alFmtSize(m0.size)||"—"],["الصوت",m0.hasAudio?"يحتوي صوتاً":a.audioUrl||a.audioData?"ملف صوتي مرفق":m0.hasAudio===false?"بدون صوت":"—"],["الشفافية",alIsAlpha(a)?"◩ خلفية شفافة":"▣ بخلفية"]];
 const m=modal(`<div class="al-pm"><div class="row" style="justify-content:space-between;align-items:center;gap:8px"><h3 style="margin:0">${esc(a.name||"")}</h3><button class="btn sm" data-close>✖</button></div>
 <div id="al-mpv" class="al-stage"></div>
 <div class="row" style="gap:4px;flex-wrap:wrap;margin-top:8px"><span class="small mut">الخلفية:</span>${[["checker","▦ شطرنج"],["black","⬛ سوداء"],["white","⬜ بيضاء"],["game","🎮 لعبة تجريبية"]].map(([k,n])=>`<button class="btn sm ${k===bg?"on":""}" data-pbg="${k}">${n}</button>`).join("")}</div>
 <div class="row" style="gap:6px;flex-wrap:wrap;margin-top:8px"><button class="btn" data-preplay>🔁 إعادة التشغيل</button><button class="btn" data-pmute>🔇 الصوت مكتوم — اضغط للتشغيل</button><button class="btn pri" data-puse>➕ استخدام الآيرت</button></div>
 <div class="al-info">${info.map(([k,v])=>`<div><span>${k}</span><b>${esc(v)}</b></div>`).join("")}</div>${a.description?`<p class="mut small">${esc(a.description)}</p>`:""}</div>`);
 let view=null; const box=m.querySelector("#al-mpv");
 const play=()=>{ if(view) liveViews.delete(view); box.style.background=AL_BGS[bg]; view=alPreviewMountEl(box,{mute}); if(view){ liveViews.add(view); view.aboxPush([{id:"pv"+Date.now(),alertId:a.id,event:a.event,vars:{...AL_TEST_VARS,avatar:""},priority:10,test:false}]) } };
 setTimeout(play,60);
 m.addEventListener("click",e=>{ const t=e.target.closest("button"); if(!t) return;
  if(t.dataset.pbg){ bg=t.dataset.pbg; box.style.background=AL_BGS[bg]; m.querySelectorAll("[data-pbg]").forEach(x=>x.classList.toggle("on",x===t)) }
  if(t.hasAttribute("data-preplay")) play();
  if(t.hasAttribute("data-pmute")){ mute=!mute; t.textContent=mute?"🔇 الصوت مكتوم — اضغط للتشغيل":"🔊 الصوت يعمل — اضغط للكتم"; play() }
  if(t.hasAttribute("data-puse")){ m.remove(); alClick(t,{aluse:a.id}) }
  if(t.hasAttribute("data-close")){ if(view) liveViews.delete(view); box.innerHTML="" } });
 const obs=new MutationObserver(()=>{ if(!m.isConnected){ if(view) liveViews.delete(view); box.innerHTML=""; obs.disconnect() } }); obs.observe(document.body,{childList:true}) }

/* ---------------- رفع/تعديل آيرت ---------------- */
function alNewForm(){ return {id:"",name:"",description:"",kind:"",event:"follow",durationSec:6,durAuto:null,category:"",tags:"",designerName:"",visibility:"private",rightsConfirmed:false,mediaId:"",mediaUrl:"",mediaMime:"",audioId:"",audioUrl:"",coverId:"",coverUrl:"",coverAuto:true,previewId:"",previewUrl:"",meta:{},config:alConfig({title:{text:"شكراً على الفولو يا {display_name} ❤️"},sub:{text:""}})} }
const AL_EVENT_TEXT={follow:"شكراً على الفولو يا {display_name} ❤️",like_user:"🔥 {display_name} وصل إلى {likes} تكبيسة!",like_total:"🔥 وصلنا {total_likes} تكبيسة!",donation:"💸 {display_name} دعم بمبلغ {amount} {currency}",gift:"🎁 شكراً {display_name} على {gift_count} × {gift_name}",gift_value:"🎁 شكراً {display_name} على {gift_name}",share:"🔁 شكراً {display_name} على المشاركة",join:"👋 أهلاً {display_name}",subscribe:"⭐ شكراً {display_name} على الاشتراك"};
const AL_ACCEPT=".mp4,.webm,.mov,.gif,.apng,.png,.webp,.jpg,.jpeg,.mp3,.wav,.ogg,.m4a,.aac,.json,video/*,audio/*,image/*";
function alFormHTML(){ const A=ALS(), F=A.form||(A.form=alNewForm()), c=F.config, ed=!!F.id, U=A.up, m=F.meta||{};
 const o=(obj,v)=>Object.entries(obj).map(([k,n])=>`<option value="${k}" ${v===k?"selected":""}>${esc(typeof n==="string"?n:n.icon+" "+n.label)}</option>`).join("");
 const lo=(list,v)=>list.map(([k,n])=>`<option value="${k}" ${v===k?"selected":""}>${esc(n)}</option>`).join("");
 const fi=(k,l,inner)=>`<div class="fld"><label>${l}</label>${inner}</div>`;
 const tx=(k,v,ph)=>`<input class="inp" data-alff="${k}" value="${esc(v??"")}" placeholder="${esc(ph||"")}">`;
 const nm=(k,v,a,b,st)=>`<input type="range" min="${a}" max="${b}" step="${st||1}" data-alff="${k}" value="${v}">`;
 const lay=(k,l)=>`<div class="ttl" style="margin:8px 0 4px">${l}</div><div class="grid g3" style="gap:6px">${fi(k,"إظهار",`<select class="inp" data-alff="config.${k}.show"><option value="1" ${c[k].show?"selected":""}>ظاهر</option><option value="0" ${c[k].show?"":"selected"}>مخفي</option></select>`)}
  ${k!=="avatar"?fi(k,"النص",tx("config."+k+".text",c[k].text,"{display_name}")):fi(k,"الإطار ("+AL_FRAMES.length+")",`<select class="inp" data-alff="config.avatar.frame">${lo(AL_FRAMES,c.avatar.frame)}</select>`)}
  ${fi(k,"اللون",`<input type="color" data-alff="config.${k}.color" value="${c[k].color}">`)}${fi(k,"أفقي "+c[k].x+"%",nm("config."+k+".x",c[k].x,0,100))}${fi(k,"عمودي "+c[k].y+"%",nm("config."+k+".y",c[k].y,0,100))}${fi(k,"الحجم "+c[k].size,nm("config."+k+".size",c[k].size,4,k==="avatar"?60:20,.5))}</div>`;
 const miss=alMissing(c.title.text+" "+c.sub.text+" "+(c.tts.text||""),F.event);
 const has=!!(F.mediaId||F.audioId||F.kind==="template"), cov=F.coverUrl||F.coverData||((F.kind==="image"||F.kind==="gif")?(F.mediaUrl||F.mediaData):"");
 const phases={read:"📖 قراءة الملف…",upload:"⬆️ جاري الرفع",process:"⚙️ معالجة الفيديو وإنشاء المعاينة…",cover:"🖼️ حفظ صورة المعاينة…",done:"✅ تم الرفع بنجاح",error:"❌ فشل الرفع"};
 const status=U?`<div class="al-up ${U.phase}"><div class="row" style="justify-content:space-between;gap:6px"><b>${phases[U.phase]||""}</b><span class="small mut">${esc(U.name||"")} ${U.size?"· "+alFmtSize(U.size):""}</span></div>
  ${U.phase==="upload"||U.phase==="process"||U.phase==="cover"?`<div class="al-bar"><i style="width:${U.phase==="upload"?U.pct:100}%" class="${U.phase!=="upload"?"busy":""}"></i></div><div class="small mut">${U.phase==="upload"?U.pct+"%":"قد يستغرق التحويل حتى دقيقة للملفات الكبيرة"}</div>`:""}
  ${U.phase==="error"?`<div class="note small" style="margin-top:6px">${esc(U.msg||"")}</div><div class="row" style="gap:6px;margin-top:6px">${U.file?`<button class="btn sm pri" data-alretry>🔁 إعادة المحاولة</button>`:""}<button class="btn sm" data-alpick>📁 اختيار ملف آخر</button></div><p class="mut small">بياناتك وإعداداتك في النموذج محفوظة.</p>`:""}</div>`:"";
 const det=has&&F.kind!=="template"?`<div class="al-info">${[["النوع",AL_KINDS[F.kind]||F.kind],["المدة",alFmtDur(m.duration)||"—"],["الدقة",m.w?m.w+"×"+m.h:"—"],["معدل الإطارات",m.fps?m.fps+" fps":"—"],["الصوت",m.hasAudio==null?"—":m.hasAudio?"🔊 يوجد صوت":"🔇 بدون صوت"],["الشفافية",m.alpha==null?"—":m.alpha?"◩ شفاف":"▣ بخلفية"],["الحجم",alFmtSize(m.size)||"—"],["الترميز",m.codec||m.mime||"—"]].map(([k,v])=>`<div><span>${k}</span><b>${esc(v)}</b></div>`).join("")}</div>${m.converted?`<p class="small">🔄 حُوِّل الملف تلقائياً إلى صيغة يشغّلها المتصفح وOBS${m.alpha?" مع الحفاظ على الشفافية":""}.</p>`:""}`:"";
 const grpOpts=Object.entries(AL_EVENT_GROUPS).map(([g,[gl,evs]])=>`<optgroup label="${esc(gl)}">${evs.map(k=>{ const e=AL_EVENTS[k]; return e?`<option value="${k}" ${F.event===k?"selected":""} ${e.avail.tiktok===false?"disabled":""}>${e.icon} ${esc(e.label)}${e.avail.tiktok===false?" (غير متوفر)":""}</option>`:"" }).join("")}</optgroup>`).join("");
 const sug=F.sugStyle&&F.sugStyle!==F.category?`<button class="btn sm" data-alsug="${F.sugStyle}">💡 مقترح: ${esc(AL_STYLES[F.sugStyle])}</button>`:"";
 return `<div class="grid g2" style="align-items:start"><div>
 <div class="card"><h3>${ed?"✏️ تعديل الآيرت":"1️⃣ ملف الآيرت"}</h3>
  <button type="button" id="al-drop" class="al-drop ${has?"has":""}" data-alpick>${cov?`<img src="${esc(cov)}" alt="">`:has&&F.kind==="audio"?`<div class="al-acov"><span>🔊</span><b>${esc(F.name||"آيرت صوتي")}</b></div>`:""}
   <div class="al-drop-t"><b>${has?"🔁 استبدال الملف":"⬇️ اسحب ملف الآيرت وأفلته هنا"}</b><span>أو اضغط لاختيار ملف من جهازك</span><span class="mut small">MP4 · WebM (يدعم الشفافية) · MOV · GIF · APNG · PNG · WebP · MP3 · WAV · OGG · Lottie JSON — حتى ${Math.round(AL_LIMITS.media/1048576)}MB${CFG?"":" (3MB في وضع التجربة)"}</span></div></button>
  <input type="file" id="al-file" accept="${AL_ACCEPT}" data-almain style="display:none">${status}${det}
  ${has&&F.kind!=="template"&&F.kind!=="audio"?`<div class="row" style="gap:6px;flex-wrap:wrap;margin-top:6px"><span class="small">صورة المعاينة: ${F.coverAuto!==false?"تلقائية من الملف ✓":"مخصصة"}</span><label class="btn sm">🖼️ تغيير الغلاف (اختياري)<input type="file" accept=".png,.jpg,.jpeg,.webp,.gif" data-alfile="cover" style="display:none"></label></div>`:""}
  ${F.kind!=="audio"?`<div class="row" style="gap:6px;flex-wrap:wrap;margin-top:6px"><label class="btn sm">🎵 ${F.audioId||F.audioData?"✅ صوت مرفق — استبدال":"إضافة صوت منفصل (اختياري)"}<input type="file" accept=".mp3,.wav,.ogg,.m4a,.aac" data-alfile="audio" style="display:none"></label>${F.audioId||F.audioData?`<button class="btn sm" data-alfx="audio">إزالة الصوت</button>`:""}${!has||F.kind==="template"?`<button class="btn sm" data-altpl>🏛️ ${F.kind==="template"?"قالب رسمي مختار":"أو استخدم قالباً رسمياً"}</button>`:""}</div>`:""}
  ${F.kind==="template"?fi("tpl","القالب الرسمي",`<select class="inp" data-alff="config.template">${FA_DESIGNS.map(d=>`<option value="${d.id}" ${c.template===d.id?"selected":""}>#${d.n} ${esc(d.name)}</option>`).join("")}</select>`):""}</div>
 <div class="card"><h3>2️⃣ معلومات الآيرت</h3>
 <div class="grid g2" style="gap:8px">${fi("name","اسم الآيرت *",tx("name",F.name,"مثال: Enemy Legendary"))}${fi("event","نوع الحدث *",`<select class="inp" data-alff="event">${grpOpts}</select>`)}
 ${fi("cat","تصنيف التصميم * "+sug,`<select class="inp" data-alff="category"><option value="">— اختر الطابع —</option>${o(AL_STYLES,F.category)}${F.category&&!AL_STYLES[F.category]&&AL_CATS[F.category]?`<option value="${F.category}" selected>${esc(AL_CATS[F.category])} (قديم)</option>`:""}</select>`)}
 ${fi("dur","مدة العرض: "+F.durationSec+" ث"+(F.durAuto?` <span class="mut">(من الملف ${F.durAuto} ث)</span>`:""),nm("durationSec",F.durationSec,1,30))}
 ${F.kind==="video"||F.kind==="audio"||F.audioId||F.audioData?fi("snd","الصوت",`<select class="inp" data-alff="config.videoSound"><option value="1">🔊 تشغيل</option><option value="0" ${c.videoSound?"":"selected"}>🔇 كتم</option></select>`):""}
 ${fi("designerName","اسم المصمم",tx("designerName",F.designerName,CFG?CFG.profile.name:""))}</div>
 ${fi("description","وصف الآيرت (اختياري)",`<textarea class="inp" rows="2" data-alff="description" maxlength="400">${esc(F.description)}</textarea>`)}${fi("tags","الكلمات المفتاحية (اختيارية)",tx("tags",Array.isArray(F.tags)?F.tags.join("، "):F.tags,"فخم، ملكي، ذهبي"))}</div>
 <div class="card"><h3>🧩 اسم وصورة صاحب الحدث والطبقات</h3><p class="mut small">تظهر بيانات الشخص الحقيقي الذي شغّل الآيرت. إذا لم يرسل المصدر صورته تظهر صورة افتراضية واضحة.</p>${lay("avatar","🖼️ صورة المستخدم")}${lay("title","🔤 عبارة الشكر")}${lay("sub","🔡 النص الثاني")}
 <div class="row" style="gap:4px;flex-wrap:wrap">${AL_EVENT_TEXT[F.event]?`<button class="btn sm" data-altxt>✍️ استخدم العبارة المقترحة: ${esc(AL_EVENT_TEXT[F.event])}</button>`:""}</div>
 <div class="grid g3" style="gap:6px;margin-top:8px">${fi("enter","حركة الظهور",`<select class="inp" data-alff="config.enter">${lo(AL_IN,c.enter)}</select>`)}${fi("exit","حركة الخروج",`<select class="inp" data-alff="config.exit">${lo(AL_OUT,c.exit)}</select>`)}${fi("fx","تأثير",`<select class="inp" data-alff="config.fx">${lo(AL_FX,c.fx)}</select>`)}
 ${fi("fit","ملاءمة الملف",`<select class="inp" data-alff="config.fit"><option value="contain" ${c.fit==="contain"?"selected":""}>احتواء</option><option value="cover" ${c.fit==="cover"?"selected":""}>ملء</option></select>`)}${fi("vol","مستوى الصوت "+Math.round(c.volume*100)+"%",nm("config.volume",c.volume,0,1,.05))}
 ${fi("spd","سرعة الحركة "+c.speed+"×",nm("config.speed",c.speed,.25,3,.25))}${fi("fa","حركة الإطار",`<select class="inp" data-alff="config.frameAnim"><option value="1">متحركة</option><option value="0" ${c.frameAnim?"":"selected"}>ثابتة</option></select>`)}${fi("lo","ترتيب صورة المستخدم",`<select class="inp" data-alff="config.layerOrder"><option value="front">أمام الفيديو</option><option value="behind" ${c.layerOrder==="behind"?"selected":""}>خلف الفيديو</option></select>`)}
 ${fi("ad","تأخير الصوت (مللي ث)",`<input class="inp" type="number" min="0" max="10000" data-alff="config.audioDelay" value="${c.audioDelay}">`)}
 ${F.kind==="video"?fi("ck","إزالة الخلفية",`<select class="inp" data-alff="config.chroma.on"><option value="0">متوقف (أو WebM شفاف)</option><option value="1" ${c.chroma.on?"selected":""}>مفعّل</option></select>`):""}${F.kind==="video"&&c.chroma.on?fi("ckm","النوع",`<select class="inp" data-alff="config.chroma.mode"><option value="green">Chroma — لون محدد (أخضر)</option><option value="luma" ${c.chroma.mode==="luma"?"selected":""}>Luma — خلفية سوداء</option></select>`)+(c.chroma.mode==="green"?fi("ckc","لون الخلفية",`<input type="color" data-alff="config.chroma.color" value="${c.chroma.color}">`):"")+fi("ckt","الحساسية "+c.chroma.tol,nm("config.chroma.tol",c.chroma.tol,5,200)):""}</div>
 <p class="mut small">المتغيرات: ${AL_VARS.map(v=>"{"+v+"}").join(" ")}</p>${miss.length?`<p class="note small">⚠️ حدث «${esc(AL_EVENTS[F.event].label)}» لا يرسل: ${miss.map(x=>"{"+x+"}").join(" ")}</p>`:""}</div></div>
 <div><div class="card"><h3>المعاينة <span class="tag">بيانات تجريبية</span></h3><div id="al-fpv" class="al-stage" style="height:300px"></div><button class="btn" style="margin-top:8px" data-alfplay>🔁 تشغيل المعاينة</button></div>
 <div class="card"><h3>3️⃣ الخصوصية</h3>
  <label class="row" style="gap:6px;align-items:flex-start"><input type="radio" name="alvis" data-alff="visibility" value="private" ${F.visibility!=="public"?"checked":""}><span><b>🔒 خاص (افتراضي)</b><br><span class="mut small">يظهر لك فقط ويعمل في بثك. لا يظهر في البحث ولا الأقسام العامة، وملفاته لا تُفتح لغيرك.</span></span></label>
  <label class="row" style="gap:6px;align-items:flex-start;margin-top:8px"><input type="radio" name="alvis" data-alff="visibility" value="public" ${F.visibility==="public"?"checked":""} ${CFG?"":"disabled"}><span><b>🌍 عام</b><br><span class="mut small">${CFG?"يظهر للجميع في المكتبة بعد مراجعة الإدارة، ويستطيع الآخرون استخدامه بإعداداتهم المستقلة.":"النشر العام متاح بعد تسجيل الدخول على المنصة."}</span></span></label>
  ${F.visibility==="public"?`<label class="row" style="gap:6px;margin-top:8px"><input type="checkbox" data-alff="rightsConfirmed" ${F.rightsConfirmed?"checked":""}><span class="small">أؤكد أنني أملك حقوق هذه الملفات أو لدي إذن بنشرها، ولا تحتوي محتوى مخالفاً *</span></label>`:""}
  <div class="row" style="gap:6px;margin-top:12px"><button class="btn pri" data-alsave ${U&&["read","upload","process","cover"].includes(U.phase)?"disabled":""}>${ed?"💾 حفظ التعديلات":"💾 حفظ الآيرت"}</button>${ed?`<button class="btn" data-alcancel>إلغاء</button>`:""}</div>${A.ferr?`<div class="note small" style="margin-top:6px">${A.ferr.map(esc).join("<br>")}</div>`:""}</div></div></div>` }

/** قراءة الملف في المتصفح: المدة، الأبعاد، الصوت، الشفافية، وغلاف من إطار غير أسود */
function alWait(el,ev,ms){ return new Promise((ok,no)=>{ const t=setTimeout(()=>no(new Error("timeout")),ms); el.addEventListener(ev,()=>{ clearTimeout(t); ok() },{once:true}); el.addEventListener("error",()=>{ clearTimeout(t); no(new Error("error")) },{once:true}) }) }
function alFrameStats(cv){ const g=cv.getContext("2d",{willReadFrequently:true}), d=g.getImageData(0,0,cv.width,cv.height).data; let lum=0,n=0,tr=0; for(let i=0;i<d.length;i+=16){ if(d[i+3]<250) tr++; if(d[i+3]>30){ lum+=d[i]*.3+d[i+1]*.59+d[i+2]*.11; n++ } } return {lum:n?lum/n:0,opaque:n,alpha:tr>4} }
async function alAnalyze(file,ins){ const out={meta:{size:file.size,mime:ins.mime,alpha:ins.alpha,animated:ins.animated},cover:null,playable:true}; const url=URL.createObjectURL(file);
 try{
  if(ins.family==="video"){ const v=document.createElement("video"); v.muted=true; v.playsInline=true; v.preload="auto"; v.src=url;
   try{ await alWait(v,"loadeddata",9000) }catch(e){ out.playable=false; return out }
   Object.assign(out.meta,{duration:isFinite(v.duration)?v.duration:null,w:v.videoWidth,h:v.videoHeight});
   if(!v.videoWidth){ out.playable=false; return out }
   try{ await v.play(); await new Promise(r=>setTimeout(r,350)); v.pause() }catch(e){}
   out.meta.hasAudio=v.mozHasAudio!==undefined?!!v.mozHasAudio:v.audioTracks?v.audioTracks.length>0:v.webkitAudioDecodedByteCount!==undefined?v.webkitAudioDecodedByteCount>0:null;
   const W=Math.min(400,v.videoWidth), H=Math.round(W*v.videoHeight/v.videoWidth), cv=document.createElement("canvas"); cv.width=W; cv.height=H; const g=cv.getContext("2d");
   const d=out.meta.duration||1, times=[Math.min(1.5,d*.25),d*.5,d*.75,.05]; let best=null, alpha=false;
   for(const t of times){ try{ v.currentTime=t; await alWait(v,"seeked",4000); g.clearRect(0,0,W,H); g.drawImage(v,0,0,W,H); const st=alFrameStats(cv); alpha=alpha||st.alpha; const score=st.lum+(st.opaque>10?5:0); if(!best||score>best.score){ best={score,url:cv.toDataURL("image/png")} } if(st.lum>28&&st.opaque>10) break }catch(e){} }
   out.meta.alpha=ins.mime==="video/webm"||ins.mime==="video/quicktime"?alpha:false; out.cover=best&&best.url; v.removeAttribute("src"); v.load() }
  else if(ins.family==="image"){ const im=new Image(); im.src=url; await alWait(im,"load",8000); Object.assign(out.meta,{w:im.naturalWidth,h:im.naturalHeight});
   if(ins.animated){ const W=Math.min(400,im.naturalWidth), cv=document.createElement("canvas"); cv.width=W; cv.height=Math.round(W*im.naturalHeight/im.naturalWidth); cv.getContext("2d").drawImage(im,0,0,cv.width,cv.height); out.cover=cv.toDataURL("image/png") } }
  else if(ins.family==="audio"){ const a=document.createElement("audio"); a.preload="metadata"; a.src=url; try{ await alWait(a,"loadedmetadata",8000); out.meta.duration=isFinite(a.duration)?a.duration:null; out.meta.hasAudio=true }catch(e){ out.playable=false } }
  else if(ins.family==="lottie"){ const j=JSON.parse(await file.text()); Object.assign(out.meta,{w:j.w,h:j.h,fps:j.fr,duration:j.fr?(j.op-j.ip)/j.fr:null,alpha:true}) }
 }finally{ URL.revokeObjectURL(url) }
 return out }
const alDataBlob=u=>fetch(u).then(r=>r.blob());
/** رفع مع شريط نسبة (XHR) */
function alXhr(fd,onPct){ return new Promise(res=>{ const x=new XMLHttpRequest(); x.open("POST","/api/alerts/upload"); x.responseType="json"; x.upload.onprogress=e=>{ if(e.lengthComputable) onPct(Math.round(e.loaded/e.total*100)) }; x.upload.onload=()=>onPct(100,true);
 x.onload=()=>{ const j=x.response||{}; if(x.status>=400&&!j.error) j.error="HTTP "+x.status; res(j) }; x.onerror=()=>res({error:"network"}); x.ontimeout=()=>res({error:"network"}); x.timeout=600000; x.send(fd) }) }
function alUpSet(p){ const A=ALS(); A.up={...(A.up||{}),...p}; if(S.page==="alerts"&&A.tab==="create"){ const st=document.querySelector(".al-up"); if(p.pct!=null&&st&&A.up.phase==="upload"){ const i=st.querySelector(".al-bar i"), s=st.querySelector(".small.mut:last-child"); if(i) i.style.width=A.up.pct+"%"; if(s) s.textContent=A.up.pct+"%"; return } renderPage(true) } }
async function alPickFile(f){ const A=ALS(), F=A.form; if(!f||!F) return;
 alUpSet({phase:"read",pct:0,name:f.name,size:f.size,file:f,msg:""});
 const buf=new Uint8Array(await f.arrayBuffer()); const chk=alCheckFile("media",buf);
 if(!chk.ok) return alUpSet({phase:"error",msg:(AL_ERR[chk.error]||chk.error)+(chk.error==="too_large"?` (${alFmtSize(f.size)} — الحد ${alFmtSize(chk.max)})`:"")});
 const ins=alInspect(buf); let an={meta:{},cover:null,playable:true}; try{ an=await alAnalyze(f,ins) }catch(e){}
 if(!F.category){ const s=alSuggestStyle(f.name); if(s){ F.sugStyle=s } }
 if(!F.name) F.name=f.name.replace(/\.[^.]+$/,"").replace(/[_-]+/g," ").slice(0,60);
 const setDur=d=>{ if(d){ F.durAuto=Math.round(d*10)/10; F.durationSec=Math.max(1,Math.min(30,Math.round(d))) } };
 if(!CFG){ // وضع التجربة: لا خادم ولا تحويل — نقبل ما يشغّله المتصفح فقط
  if(f.size>3*1024*1024) return alUpSet({phase:"error",msg:"في وضع التجربة الحد 3MB — سجّل الدخول على المنصة للرفع حتى "+alFmtSize(AL_LIMITS.media)});
  if(!an.playable) return alUpSet({phase:"error",msg:ins.family==="video"?"المتصفح لا يستطيع تشغيل ترميز هذا الفيديو. على المنصة (بعد تسجيل الدخول) يحوّله الخادم تلقائياً — أو صدّره MP4 (H.264) أو WebM":AL_ERR.corrupt});
  const data=await new Promise(r=>{ const fr=new FileReader(); fr.onload=()=>r(fr.result); fr.readAsDataURL(f) });
  if(ins.family==="audio"){ F.kind="audio"; F.audioData=data; F.audioId="local"; F.mediaData=""; F.mediaId="" } else { F.kind=ins.kind; F.mediaData=data; F.mediaId="local"; F.mediaMime=ins.mime }
  F.meta=alMeta(an.meta); if(an.cover&&F.coverAuto!==false){ F.coverData=an.cover; F.coverId="local" } setDur(an.meta.duration);
  return alUpSet({phase:"done",file:null}) }
 alUpSet({phase:"upload",pct:0}); const fd=new FormData(); fd.append("slot","media"); fd.append("file",f);
 const j=await alXhr(fd,(p,done)=>alUpSet(done?{phase:"process",pct:100}:{pct:p}));
 if(j.error) return alUpSet({phase:"error",msg:(j.message||AL_ERR[j.error]||"تعذر رفع الملف ("+j.error+")")+(j.detail?" — "+j.detail:"")});
 if(j.slot==="audio"){ F.kind="audio"; F.audioId=j.id; F.audioUrl=j.url; F.mediaId=""; F.mediaUrl="" } else { F.kind=j.kind; F.mediaId=j.id; F.mediaUrl=j.url; F.mediaMime=j.mime }
 F.meta=j.meta||{}; F.previewId=j.previewId||""; F.previewUrl=j.previewUrl||""; setDur(F.meta.duration);
 if(F.coverAuto!==false){ if(j.coverId){ F.coverId=j.coverId; F.coverUrl=j.coverUrl } else if(an.cover){ alUpSet({phase:"cover"}); const cf=new FormData(); cf.append("slot","cover"); cf.append("file",await alDataBlob(an.cover),"cover.png"); const c=await alXhr(cf,()=>{}); if(!c.error){ F.coverId=c.id; F.coverUrl=c.url } } else if(F.kind!=="audio"){ F.coverId=""; F.coverUrl="" } }
 A.quota=null; alUpSet({phase:"done",file:null}) }
/** ملفات إضافية: الصوت المنفصل وتغيير الغلاف */
async function alUpload(slot,t){ const A=ALS(), F=A.form, f=t.files&&t.files[0]; if(!f||!F) return;
 const buf=new Uint8Array(await f.arrayBuffer()); const chk=alCheckFile(slot,buf); if(!chk.ok) return toast("❌ "+(AL_ERR[chk.error]||chk.error));
 if(!CFG){ if(f.size>3*1024*1024) return toast("في وضع التجربة الحد 3MB"); const r=new FileReader(); r.onload=()=>{ F[slot+"Data"]=r.result; F[slot+"Id"]="local"; if(slot==="cover") F.coverAuto=false; renderPage(true) }; r.readAsDataURL(f); return }
 toast("⏳ جاري الرفع…"); const fd=new FormData(); fd.append("slot",slot); fd.append("file",f);
 const j=await alXhr(fd,()=>{}); if(j.error) return toast("❌ "+(j.message||AL_ERR[j.error]||j.error));
 F[slot+"Id"]=j.id; F[slot+"Url"]=j.url; if(slot==="cover") F.coverAuto=false; A.quota=null; toast("✅ تم رفع الملف"); renderPage(true) }
async function alSaveForm(){ const A=ALS(), F=A.form; const body={name:F.name,description:F.description,kind:F.kind,event:F.event,durationSec:+F.durationSec,category:F.category,tags:F.tags,designerName:F.designerName,visibility:F.visibility,rightsConfirmed:!!F.rightsConfirmed,mediaId:F.mediaId||null,audioId:F.audioId||null,coverId:F.coverId||null,previewId:F.previewId||null,meta:F.meta,config:F.config};
 const v=alValidate(body,{legacy:!!F.id}); if(!v.ok){ A.ferr=v.errors; return renderPage(true) } A.ferr=null;
 if(!CFG){ const list=alLocal(); const rec={...v.value,id:F.id||"loc_"+Date.now().toString(36),ownerId:"me",visibility:"private",review:"none",mediaData:F.mediaData||"",audioData:F.audioData||"",coverData:F.coverData||"",createdAt:new Date().toISOString()}; const i=list.findIndex(x=>x.id===rec.id); if(i>=0) list[i]=rec; else list.unshift(rec); if(!alLocalSave(list)) return; toast("✅ حُفظ الآيرت (خاص)"); A.form=null; A.up=null; A.tab="lib"; A.sec="mine"; A.key=""; alSyncDefs(); return renderPage(true) }
 const j=await alApi(F.id?"/api/alerts/"+F.id:"/api/alerts",{method:F.id?"PUT":"POST",body}); if(j.error){ A.ferr=j.errors||[({rights_required:"يجب تأكيد حقوق الملفات للنشر العام",bad_file:"ملف غير صالح أو ليس ملكك",limit:j.message}[j.error])||"تعذر الحفظ: "+j.error]; return renderPage(true) }
 A.cache[j.alert.id]=j.alert; toast(j.alert.visibility==="public"?(j.alert.review==="approved"?"✅ نُشر للجميع":"⏳ حُفظ وأُرسل للمراجعة قبل الظهور العام"):"✅ حُفظ الآيرت (خاص)"); A.form=null; A.up=null; A.tab="lib"; A.sec="mine"; A.key=""; A.usableAt=0; alSyncDefs(); renderPage(true) }

/** يحمّل آيرتاتي وما أستخدمه لمحرر القواعد */
async function alLoadUsable(){ const A=ALS(); if(A.usableAt&&Date.now()-A.usableAt<30000) return; A.usableAt=Date.now(); if(!CFG){ alSyncDefs(); return } const [m,u]=await Promise.all([alApi("/api/alerts?section=mine"),alApi("/api/alerts?section=using")]); for(const a of [...(m.items||[]),...(u.items||[])]) if(a.id) A.cache[a.id]=a; alSyncDefs(); if(S.page==="alerts"&&A.tab==="rules") softRefresh() }
function alUsable(){ const A=ALS(), m=new Map(); for(const a of alLocal()) m.set(a.id,a); for(const a of Object.values(A.cache)) if((a.mine||a.using)&&!a.unavailable) m.set(a.id,a); return [...m.values()] }
function alName(id){ if(alIsOfficial(id)){ const d=FA_DESIGNS.find(x=>"tpl:"+x.id===id); return "🏛️ "+(d?d.name:"قالب رسمي") } const a=alUsable().find(x=>x.id===id)||ALS().cache[id]; return a?a.name:(id?"⚠️ آيرت غير متاح":"— اختر آيرت —") }
function alBoxW(){ return L().widgets.find(x=>x.type==="abox") }

function alHTML(){ alHoverStop(); const A=ALS(), adm=!!(CFG&&CFG.profile&&CFG.profile.isAdmin);
 const tabs=[["lib","📚 المكتبة"],["rules","🔔 صندوق الآيرتات والقواعد"],["create",A.form&&A.form.id?"✏️ تعديل آيرت":"➕ رفع آيرت جديد"],...(adm?[["admin","🛡️ المراجعة"]]:[])];
 return head("🔔 مكتبة الآيرتات",`سوق آيرتات المجتمع: ارفع آيرتاتك، خليها خاصة أو انشرها للجميع، واستخدم آيرتات المصممين بإعداداتك المستقلة`)+
 `<div class="row" style="gap:6px;flex-wrap:wrap;margin-bottom:12px">${tabs.map(([k,n])=>`<button class="btn ${A.tab===k?"pri":""}" data-altab="${k}">${n}</button>`).join("")}</div>`+
 (A.tab==="rules"?alRulesHTML():A.tab==="create"?alFormHTML():A.tab==="admin"&&adm?alAdminHTML():alLibHTML()) }

/* ---------------- صندوق الآيرتات والقواعد ---------------- */
function alRulesHTML(){ const C=alCfgS(), w=alBoxW(); alLoadUsable(); const us=alUsable(), off=alOfficial();
 const aopts=v=>`<option value="">— اختر آيرت —</option><optgroup label="آيرتاتي والمستخدمة">${us.map(a=>`<option value="${esc(a.id)}" ${v===a.id?"selected":""}>${esc(a.name)}${a.visibility==="private"?" 🔒":""}</option>`).join("")}</optgroup><optgroup label="القوالب الرسمية">${off.map(a=>`<option value="${esc(a.id)}" ${v===a.id?"selected":""}>${esc(a.name)}</option>`).join("")}</optgroup>`;
 const evo=v=>Object.entries(AL_EVENTS).map(([k,e])=>`<option value="${k}" ${v===k?"selected":""} ${e.avail.tiktok===false?"disabled":""}>${e.icon} ${esc(e.label)}${e.avail.tiktok===false?" (غير متوفر)":""}</option>`).join("");
 const f=(r,k,l,inner)=>`<div class="fld"><label>${l}</label>${inner}</div>`;
 const rule=(r0,i)=>{ const r=alRule(r0), e=AL_EVENTS[r.event]||{}, c=r.cond, fld=e.field, miss=alMissing((r.over.title||"")+" "+(r.over.sub||"")+" "+(r.over.ttsText||""),r.event);
  const inp=(k,v,ph,type)=>`<input class="inp" ${type?`type="${type}"`:""} data-alr="${i}" data-k="${k}" value="${esc(v??"")}" placeholder="${esc(ph||"")}">`;
  const sel=(k,v,o)=>`<select class="inp" data-alr="${i}" data-k="${k}">${o.map(([a,b])=>`<option value="${a}" ${String(v)===String(a)?"selected":""}>${esc(b)}</option>`).join("")}</select>`;
  return `<div class="card" style="margin-bottom:8px;${r.enabled?"":"opacity:.6"};${ALS().ruleFocus&&ALS().ruleFocus===r.alertId?"outline:2px solid var(--pri,#ffcc00)":""}"><div class="row" style="justify-content:space-between;gap:6px;flex-wrap:wrap"><b>${e.icon||""} ${esc(r.label||e.label||"")}${r.level?` <span class="tag">${esc(r.level)}</span>`:""}</b>
  <div class="row" style="gap:4px"><button class="btn sm pri" data-alrtest="${i}">🧪 تجربة</button>${r.event==="manual"?`<button class="btn sm" data-alrfire="${i}">🖐️ تشغيل الآن</button>`:""}<button class="btn sm" data-alron="${i}">${r.enabled?"⏸ إيقاف":"▶ تفعيل"}</button><button class="btn sm" data-alrdup="${i}">⧉</button><button class="btn sm" data-alrdel="${i}">🗑️</button></div></div>
  ${e.note?`<p class="mut small">ℹ️ ${esc(e.note)}</p>`:""}
  <div class="grid g3" style="gap:8px">${f(r,"event","الحدث",`<select class="inp" data-alr="${i}" data-k="event">${evo(r.event)}</select>`)}${f(r,"alertId","الآيرت",`<select class="inp" data-alr="${i}" data-k="alertId">${aopts(r.alertId)}</select>`)}${f(r,"label","اسم القاعدة",inp("label",r.label,"مثال: هدية أسطورية"))}
  ${fld?f(r,"op","الشرط على "+({likes:"لايكات المستخدم",total_likes:"مجموع اللايكات",gift_count:"عدد الهدايا",diamonds:"قيمة الهدية",amount:"المبلغ",seconds:"الثواني"}[fld]||fld),sel("cond.op",c.op,Object.entries(AL_OPS))):""}
  ${fld&&c.op!=="any"?f(r,"v","القيمة",inp("cond.value",c.value,"","number")):""}${fld&&c.op==="between"?f(r,"v2","إلى",inp("cond.value2",c.value2,"","number")):""}
  ${r.event==="comment"?f(r,"kw","كلمة مفتاحية",inp("cond.keyword",c.keyword,"!hype")):""}${/gift/.test(r.event)?f(r,"g","اسم هدية محددة (اختياري)",inp("cond.gift",c.gift,"Rose")):""}
  ${f(r,"u","مستخدم محدد (اختياري)",inp("cond.user",c.user,"@username"))}${f(r,"once","التكرار",sel("once",r.once,[["none","كل مرة"],["user","مرة لكل مستخدم في البث"],["session","مرة واحدة في البث"]]))}${f(r,"role","من يُفعّلها",sel("cond.role",c.role,[["","أي مستخدم"],["mod","مشرف فقط"],["sub","مشترك فقط"],["follower","متابع فقط"]]))}
  ${f(r,"p","الأولوية (0-100)",inp("priority",r.priority,"","number"))}${f(r,"lv","المستوى {level}",inp("level",r.level,"عادي / ذهبي / أسطوري"))}${f(r,"cd","انتظار بين التكرارات (ث)",inp("cooldownSec",r.cooldownSec,"","number"))}
  ${f(r,"also","مع القواعد الأعلى",sel("also",r.also?"1":"0",[["0","الأعلى أولوية فقط (مستويات)"],["1","يعمل إضافةً للأعلى"]]))}
  ${f(r,"t","نص العنوان (اختياري)",inp("over.title",r.over.title,"{display_name}"))}${f(r,"s","النص الثاني (اختياري)",inp("over.sub",r.over.sub,"أرسل {gift_count} × {gift_name}"))}
  ${f(r,"tts","القارئ الصوتي",sel("over.tts",r.over.tts?"1":"0",[["0","متوقف"],["1","يقرأ النص"]]))}${r.over.tts?f(r,"tt","نص القراءة",inp("over.ttsText",r.over.ttsText,"شكراً {display_name}")):""}</div>
  ${miss.length?`<p class="note small">⚠️ هذا الحدث لا يرسل: ${miss.map(x=>"{"+x+"}").join(" ")} — ستظهر فارغة (لا نخترع بيانات)</p>`:""}
  ${r.alertId&&!AB_DEFS[r.alertId]?`<p class="note small">⚠️ الآيرت غير متاح (ربما أصبح خاصاً أو حذفه صاحبه) — لن يظهر في البث</p>`:""}</div>` };
 return `<div class="grid g2" style="align-items:start"><div>
 <div class="card"><h3>🔔 صندوق الآيرتات الشامل <span class="tag">رابط OBS واحد</span></h3>
  ${w?`<div class="row" style="gap:6px;flex-wrap:wrap"><button class="btn pri" data-alcopy="${w.id}">🔗 نسخ رابط OBS للصندوق</button><button class="btn" data-algo="studio">🎬 تعديل مكانه في الاستوديو</button></div>`:`<p class="mut">أضف الصندوق للتخطيط «${esc(L().name)}» ليعرض كل آيرتاتك بالترتيب وبخلفية شفافة 100%.</p><button class="btn pri" data-aladdbox>➕ إضافة صندوق الآيرتات</button>`}
  <div class="row" style="gap:4px;flex-wrap:wrap;margin-top:8px">${[["skip","⏭ تخطي الحالي"],["replay","🔁 إعادة الأخير"],["pause","⏸ إيقاف مؤقت"],["resume","▶ استكمال"],["stop","⏹ مسح الطابور"]].map(([k,n])=>`<button class="btn sm" data-alctl="${k}">${n}</button>`).join("")}</div>
  <div class="grid g3" style="gap:8px;margin-top:8px"><div class="fld"><label>الصندوق</label><select class="inp" data-alc="enabled"><option value="1" ${C.enabled!==false?"selected":""}>مفعّل</option><option value="0" ${C.enabled===false?"selected":""}>متوقف</option></select></div>
  <div class="fld"><label>فاصل بين الآيرتات (مللي ث)</label><input class="inp" type="number" data-alc="gapMs" value="${C.gapMs??600}"></div><div class="fld"><label>أقصى طول للطابور</label><input class="inp" type="number" data-alc="maxQueue" value="${C.maxQueue??30}"></div>
  <div class="fld"><label>دمج لايكات نفس المستخدم</label><select class="inp" data-alc="mergeLikes"><option value="1" ${C.mergeLikes!==false?"selected":""}>نعم</option><option value="0" ${C.mergeLikes===false?"selected":""}>لا</option></select></div></div>
  <p class="mut small">الآيرتات تُشغَّل من الخادم مرة واحدة لكل حدث حقيقي (بدون تكرار بين الروابط). التجربة تظهر بعلامة «تجربة» ولا تُحسب حدثاً حقيقياً.</p></div>
 <div class="card"><h3>🧪 بيانات التجربة المخصصة</h3><p class="mut small">تُستخدم مع زر «تجربة» في كل قاعدة. التجارب تظهر بعلامة «تجربة» ولا تدخل إحصائيات البث.</p><div class="grid g3" style="gap:6px">${[["display_name","الاسم","مشاهد تجريبي"],["avatar","رابط الصورة","https://…"],["amount","المبلغ","10"],["currency","العملة","USD"],["likes","التكبيسات","1000"],["gift_name","الهدية","Lion"],["gift_count","عدد الهدايا","1"],["message","الرسالة","شكراً!"]].map(([k,l,ph])=>`<div class="fld"><label>${l}</label><input class="inp" data-altv="${k}" value="${esc((ALS().tv||{})[k]||"")}" placeholder="${esc(ph)}"></div>`).join("")}</div></div>
 <div class="card"><h3>المعاينة الحيّة <span class="tag">نفس مكوّن OBS</span></h3><div id="al-pv" style="position:relative;height:300px;border-radius:12px;background:repeating-conic-gradient(#1a1f2e 0 25%,#141826 0 50%) 0 0/24px 24px;overflow:hidden"></div></div></div>
 <div><div class="card"><div class="row" style="justify-content:space-between"><h3>⚙️ القواعد والمستويات (${C.rules.length})</h3><button class="btn pri" data-alradd>➕ قاعدة جديدة</button></div>
 <div class="row" style="gap:4px;flex-wrap:wrap;margin:6px 0"><span class="small">مستويات جاهزة:</span><button class="btn sm" data-allv="likes">❤️ مستويات التكبيس (100 → 100,000)</button><button class="btn sm" data-allv="don">💰 مستويات الدونيشن (1$ → 100$)</button><button class="btn sm" data-allv="gifts">🎁 مستويات الهدايا</button></div>
 <p class="mut small">كل قاعدة: حدث + شرط + آيرت. للمستويات: أنشئ عدة قواعد لنفس الحدث بأولويات مختلفة — يُعرض الأعلى أولوية المطابق فقط. اللايكات: «تكبيس مستخدم» يحسب لايكات الشخص نفسه، و«مجموع اللايكات» يحسب البث كله — لا يختلطان.</p></div>
 ${C.rules.length?C.rules.map(rule).join(""):`<div class="card"><div class="empty">لا توجد قواعد — أضف قاعدة أو اضغط «استخدام» على أي آيرت في المكتبة</div></div>`}</div></div>` }
let alPv=null;
function alPreviewMount(id){ const box=document.getElementById(id); if(!box) return null; box.innerHTML=""; if(alPv) liveViews.delete(alPv);
 const cv={w:Math.max(320,box.clientWidth),h:box.clientHeight||300}; const stg=document.createElement("div"); stg.className="stage"; stg.style.cssText=`width:${cv.w}px;height:${cv.h}px;background:none;position:absolute;left:0;top:0`; box.appendChild(stg);
 const v=new View(newWidget("abox",{id:"pv_ab",x:.02,y:.03,w:.96,h:.94}),cv,{data:SRC,mute:true}); stg.appendChild(v.el); return v }
function alAfter(){ const A=ALS(); alSyncDefs(); alHoverWire();
 const dz=document.getElementById("al-drop"); if(dz&&!dz.__w){ dz.__w=1; dz.addEventListener("dragover",e=>{ e.preventDefault(); dz.classList.add("over") }); dz.addEventListener("dragleave",()=>dz.classList.remove("over")); dz.addEventListener("drop",e=>{ e.preventDefault(); dz.classList.remove("over"); const f=e.dataTransfer&&e.dataTransfer.files&&e.dataTransfer.files[0]; if(f) alPickFile(f) }) } if(A.tab==="rules"){ alPv=alPreviewMount("al-pv"); if(alPv) liveViews.add(alPv) } if(A.tab==="create") alFormPreview(false); if(CFG&&A.tab==="lib"&&A.sec==="mine"&&!A.quota) alApi("/api/alerts/upload").then(j=>{ if(!j.error){ A.quota=j; softRefresh() } }) }
/** معاينة آيرت واحد في نافذة منبثقة */
/* ---------------- رفع/تعديل آيرت ---------------- */
let alFpv=null;
function alFormPreview(play){ const F=ALS().form; if(!F) return; if(alFpv) liveViews.delete(alFpv); alFpv=alPreviewMount("al-fpv"); if(!alFpv) return; const id="draft"; AB_DEFS[id]={...alDef({...F,id}),config:alConfig(F.config),kind:F.kind||"image"}; if(play!==false||true) setTimeout(()=>alFpv&&alFpv.aboxPush([{id:"f"+Date.now(),alertId:id,event:F.event,vars:{...AL_TEST_VARS,avatar:simUser(true).avatar||""},priority:1,test:true}]),80) }
function alSetPath(o,path,v){ const k=path.split("."); let x=o; for(let i=0;i<k.length-1;i++) x=x[k[i]]=x[k[i]]||{}; x[k[k.length-1]]=v }
/* ---------------- المراجعة (للمشرفين) ---------------- */
function alAdminHTML(){ const A=ALS(); if(!A.adm||A.adm.tab!==A.admTab){ A.adm={tab:A.admTab,loading:true}; alApi("/api/admin/alerts?tab="+A.admTab).then(j=>{ A.adm={tab:A.admTab,...j}; for(const a of j.items||[]) A.cache[a.id]={...a,mine:false}; alSyncDefs(); softRefresh() }) }
 const D=A.adm, c=D.counts||{};
 return `<div class="card" style="margin-bottom:12px"><div class="row" style="gap:4px;flex-wrap:wrap">${[["pending","⏳ بانتظار المراجعة",c.pending],["reported","🚩 عليها بلاغات",c.reported],["approved","🌍 المعتمدة",c.approved],["removed","❌ المحذوفة"]].map(([k,n,x])=>`<button class="btn sm ${A.admTab===k?"pri":""}" data-aladm="${k}">${n}${x!=null?` <span class="tag">${x}</span>`:""}</button>`).join("")}
 <label class="row small" style="gap:4px;margin-inline-start:auto"><input type="checkbox" data-alauto ${D.cfg&&D.cfg.autoApprove?"checked":""}> اعتماد تلقائي بعد فحص الملفات</label></div>
 <p class="mut small">الآيرت الخاص لا يظهر هنا أبداً — الإدارة تراجع فقط ما اختار صاحبه نشره. ${AL_REPORT_HIDE} بلاغات مستقلة تسحب الآيرت للمراجعة تلقائياً.</p></div>
 ${D.loading?`<div class="empty">جاري التحميل…</div>`:D.error?`<div class="empty">${esc(D.error)}</div>`:!(D.items||[]).length?`<div class="empty">لا شيء هنا</div>`:`<div class="grid g3">${D.items.map(a=>`<div class="card"><div class="al-th" data-alpv="${esc(a.id)}">${a.coverUrl?`<img src="${esc(a.coverUrl)}" alt="">`:a.kind==="video"?`<video src="${esc(a.mediaUrl)}" muted preload="metadata"></video>`:a.mediaUrl&&a.kind!=="lottie"?`<img src="${esc(a.mediaUrl)}" alt="">`:"🔔"}<span class="al-play">▶</span></div>
  <b>${esc(a.name)}</b><div class="mut small">${esc(a.description||"")}</div><div class="small">👤 ${esc(a.designer&&a.designer.name||"")} · ${esc(a.ownerEmail||"")} ${a.designer&&a.designer.verified?"✔️":""}</div>
  ${a.reports?`<div class="note small">🚩 ${a.reports} بلاغ: ${(a.reportList||[]).map(r=>esc(AL_REPORT_REASONS[r.reason]||r.reason)+(r.note?" — "+esc(r.note):"")).join(" · ")}</div>`:""}
  <div class="row" style="gap:4px;flex-wrap:wrap;margin-top:6px">${a.review!=="approved"||a.removed?`<button class="btn sm pri" data-almod="approve" data-alid="${a.id}">✅ اعتماد</button>`:""}<button class="btn sm" data-almod="reject" data-alid="${a.id}">❌ رفض</button>${a.removed?`<button class="btn sm" data-almod="restore" data-alid="${a.id}">↩ استرجاع</button>`:`<button class="btn sm" data-almod="remove" data-alid="${a.id}">🗑️ حذف</button>`}${a.reports?`<button class="btn sm" data-almod="clearReports" data-alid="${a.id}">مسح البلاغات</button>`:""}
  <button class="btn sm" data-alver="${a.ownerId}" data-on="${a.designer&&a.designer.verified?0:1}">${a.designer&&a.designer.verified?"إلغاء التوثيق":"✔️ توثيق المصمم"}</button></div></div>`).join("")}</div>`}` }

/* ---------------- الأحداث ---------------- */
function alAddRule(alertId,event){ const C=alCfgS(); const r=alRule({id:"r"+Date.now().toString(36),alertId:alertId||"",event:event||"follow",priority:10}); C.rules.push(r); alSaveCfg(); return r }
function alClick(t,d){ const A=ALS();
 if(d.altab){ A.tab=d.altab; if(d.altab==="create"&&!A.form) A.form=alNewForm(); renderPage(true); return true }
 if(d.alsec){ A.sec=d.alsec; A.desId=""; A.vis="all"; renderPage(true); alLoad(true); return true }
 if(d.alvisf){ A.vis=d.alvisf; renderPage(true); alLoad(true); return true }
 if(d.aldes){ A.tab="lib"; A.sec="designer"; A.desId=d.aldes; renderPage(true); alLoad(true); return true }
 if(d.alfol){ alApi("/api/alerts/designers",{method:"POST",body:{designerId:d.alfol}}).then(j=>{ if(j.error) return toast("تعذر: "+j.error); const x=(A.designers||[]).find(y=>y.id===d.alfol); if(x){ x.following=j.following; x.followers+=j.following?1:-1 } renderPage(true) }); return true }
 if(d.alpv){ alPreviewModal(d.alpv); return true }
 if(d.alsnd){ const th=t.closest(".al-th"); if(th){ if(AH.el!==th) alHoverStart(th,true); else alHoverSound(!AH.snd) } return true }
 if(d.altp){ const th=t.closest(".al-th"); if(th){ if(AH.el===th) alHoverStop(); else alHoverStart(th) } return true }
 if(t.closest&&t.closest(".al-th[data-alhv]")&&!matchMedia("(hover:hover)").matches){ const th=t.closest(".al-th"); if(AH.el===th) alHoverStop(); else alHoverStart(th); return true }
 if(d.algrp!==undefined){ A.grp=d.algrp; renderPage(true); alLoad(true); return true }
 if(d.alsty!==undefined){ A.cat=d.alsty; renderPage(true); alLoad(true); return true }
 if(t.hasAttribute("data-alpick")||t.closest&&t.closest("[data-alpick]")){ const i=document.getElementById("al-file"); if(i) i.click(); return true }
 if(t.hasAttribute("data-alretry")){ const f=A.up&&A.up.file; if(f) alPickFile(f); return true }
 if(d.alsug){ A.form.category=d.alsug; renderPage(true); return true }
 if(t.hasAttribute("data-altxt")){ A.form.config.title.text=AL_EVENT_TEXT[A.form.event]; renderPage(true); return true }
 if(t.hasAttribute("data-altpl")){ const F=A.form; F.kind="template"; F.config.template=F.config.template||FA_DESIGNS[0].id; F.category=F.category||"b6o6"; renderPage(true); return true }
 if(d.aluse){ const id=d.aluse, a=A.cache[id]||alOfficial().find(x=>x.id===id)||alLocal().find(x=>x.id===id); const go=()=>{ alAddRule(id,a&&a.event||"follow"); A.tab="rules"; renderPage(true); toast("✅ أُضيفت قاعدة — عدّل الشرط ثم جرّبها") };
  if(CFG&&!alIsOfficial(id)&&a&&!a.mine&&!a.using) alApi("/api/alerts/"+id+"/act",{method:"POST",body:{act:"use"}}).then(j=>{ if(j.error) return toast(j.error==="not_available"?"هذا الآيرت لم يعد متاحاً":"تعذر: "+j.error); a.using=true; A.usableAt=0; alSyncDefs(); go() }); else go(); return true }
 if(d.alunuse){ alApi("/api/alerts/"+d.alunuse+"/act",{method:"POST",body:{act:"unuse"}}).then(()=>{ const a=A.cache[d.alunuse]; if(a) a.using=false; A.key=""; alLoad(true) }); return true }
 if(d.alact){ alApi("/api/alerts/"+d.alid+"/act",{method:"POST",body:{act:d.alact}}).then(j=>{ if(j.error) return toast(j.message||"تعذر: "+j.error); const a=A.cache[d.alid]; if(a){ const p=a.my||{}; if(d.alact==="like") a.likes+=j.my.like?1:p.like?-1:0; if(d.alact==="fav") a.favs+=j.my.fav?1:p.fav?-1:0; a.my=j.my } renderPage(true) }); return true }
 if(d.alrep){ ask("سبب البلاغ (حقوق / غير لائق / لا يعمل / مزعج / أخرى) — اكتب تفاصيل اختيارية","").then(note=>{ if(note===null||note===undefined) return; const reason=/حقوق|copy/i.test(note)?"copyright":/لائق/.test(note)?"inappropriate":/يعمل/.test(note)?"broken":/مزعج|مكرر/.test(note)?"spam":"other"; alApi("/api/alerts/"+d.alrep+"/act",{method:"POST",body:{act:"report",reason,note}}).then(j=>toast(j.error?"تعذر: "+j.error:j.already?"أبلغت عنه سابقاً":"✅ وصل البلاغ للإدارة")) }); return true }
 if(t.hasAttribute("data-alpknew")){ alLoadUsable(); const us=alUsable().filter(a=>!a.unavailable&&(a.mine||a.visibility==="public")); const m=modal(`<h3>📦 حزمة جديدة</h3><input class="inp" id="pkn" placeholder="اسم الحزمة — مثال: حزمة الفراشات الملكية"><textarea class="inp" id="pkd" rows="2" placeholder="وصف"></textarea><div style="max-height:240px;overflow:auto;margin:8px 0">${us.length?us.map(a=>`<label class="row small" style="gap:6px"><input type="checkbox" value="${esc(a.id)}"> ${esc(a.name)} <span class="mut">(${esc((AL_EVENTS[a.event]||{}).label||"")})</span></label>`).join(""):`<p class="mut small">أضف آيرتات أولاً</p>`}</div><label class="row small" style="gap:6px"><input type="checkbox" id="pkp"> 🌍 حزمة عامة (تعرض فقط الآيرتات العامة المعتمدة داخلها)</label><div class="row" style="gap:6px;margin-top:10px"><button class="btn pri" id="pks">حفظ</button><button class="btn" data-close>إلغاء</button></div>`);
  m.querySelector("#pks").onclick=()=>{ const ids=[...m.querySelectorAll("input[type=checkbox][value]:checked")].map(x=>x.value); alApi("/api/alerts/packs",{method:"POST",body:{name:m.querySelector("#pkn").value,description:m.querySelector("#pkd").value,alertIds:ids,visibility:m.querySelector("#pkp").checked?"public":"private"}}).then(j=>{ if(j.error) return toast(j.error==="name_required"?"اكتب اسم الحزمة":"تعذر الحفظ"); m.remove(); toast("✅ حُفظت الحزمة"); A.key=""; alLoad(true) }) }; return true }
 if(d.alpkdel){ alApi("/api/alerts/packs?id="+encodeURIComponent(d.alpkdel),{method:"DELETE"}).then(()=>{ A.key=""; alLoad(true) }); return true }
 if(d.alpkadd){ const p=(A.packs||[]).find(x=>x.id===d.alpkadd); if(!p) return true; (async()=>{ let n=0; for(const id of p.alertIds){ const j=await alApi("/api/alerts/"+id,{}); if(j.alert){ A.cache[id]=j.alert; if(!j.alert.mine) await alApi("/api/alerts/"+id+"/act",{method:"POST",body:{act:"use"}}); A.cache[id].using=true; alAddRule(id,j.alert.event); n++ } } A.usableAt=0; alSyncDefs(); toast(`✅ أُضيفت ${n} قاعدة من الحزمة`); A.tab="rules"; renderPage(true) })(); return true }
 if(d.alman){ const a=A.cache[d.alman]||alLocal().find(x=>x.id===d.alman); if(!a) return true; const b=alBadge(a);
  const m=modal(`<h3>⚙️ إدارة «${esc(a.name)}»</h3><p class="small">الحالة: ${b[0]} ${esc(b[1])}</p><div class="grid g2" style="gap:6px"><button class="btn" data-k="edit">✏️ تعديل الآيرت (الاسم، المدة، الحدث، الملفات، الطبقات)</button><button class="btn" data-k="rules">⚙️ تعديل شروط التشغيل</button><button class="btn" data-k="vis">${a.visibility==="public"?"🔒 تحويل إلى خاص":"🌍 تحويل إلى عام"}</button><button class="btn" data-k="del">🗑️ حذف الآيرت</button></div><div class="row" style="margin-top:10px"><button class="btn" data-close>إغلاق</button></div>`);
  m.addEventListener("click",e=>{ const k=e.target.closest("[data-k]"); if(!k) return; m.remove(); const x=k.dataset.k; if(x==="edit") alClick(t,{aledit:a.id}); else if(x==="vis") alClick(t,{alvis:a.id}); else if(x==="del") alClick(t,{aldel:a.id}); else { const C=alCfgS(); if(!C.rules.some(r=>r.alertId===a.id)) alAddRule(a.id,a.event); A.tab="rules"; A.ruleFocus=a.id; renderPage(true) } }); return true }
 if(d.aledit){ const a=A.cache[d.aledit]||alLocal().find(x=>x.id===d.aledit); if(!a) return true; A.form={...alNewForm(),...a,tags:(a.tags||[]).join("، "),config:alConfig(a.config),mediaId:a.mediaId||(a.mediaData?"local":""),audioId:a.audioId||(a.audioData?"local":""),coverId:a.coverId||(a.coverData?"local":"")}; A.tab="create"; renderPage(true); return true }
 if(d.alvis){ const a=A.cache[d.alvis]; if(!CFG||!a) return toast("النشر العام متاح بعد تسجيل الدخول"),true; const to=a.visibility==="public"?"private":"public";
  const doit=rc=>alApi("/api/alerts/"+a.id,{method:"PUT",body:{visibility:to,rightsConfirmed:rc}}).then(j=>{ if(j.error) return toast(j.error==="rights_required"?"يجب تأكيد حقوق الملفات":"تعذر: "+j.error); A.cache[a.id]=j.alert; toast(to==="private"?"🔒 أصبح خاصاً — اختفى من المكتبة العامة فوراً":j.alert.review==="approved"?"🌍 نُشر":"⏳ أُرسل للمراجعة"); A.key=""; alLoad(true) });
  if(to==="public"){ const m=modal(`<h3>🌍 نشر «${esc(a.name)}» للجميع</h3><p class="small">سيظهر في المكتبة العامة بعد مراجعة الإدارة.</p><label class="row" style="gap:6px"><input type="checkbox" id="alrc"> <span class="small">أؤكد أنني أملك حقوق هذه الملفات أو لدي إذن بنشرها</span></label><div class="row" style="gap:6px;margin-top:10px"><button class="btn pri" id="alpub">نشر</button><button class="btn" data-close>إلغاء</button></div>`); m.querySelector("#alpub").onclick=()=>{ if(!m.querySelector("#alrc").checked) return toast("يجب التأكيد"); m.remove(); doit(true) } } else doit(false); return true }
 if(d.aldel){ if(!confirm("حذف الآيرت نهائياً؟ سيتوقف في بث كل من يستخدمه.")) return true; if(!CFG){ alLocalSave(alLocal().filter(x=>x.id!==d.aldel)); A.key=""; alLoad(true); return true } alApi("/api/alerts/"+d.aldel,{method:"DELETE"}).then(j=>{ if(j.error) return toast("تعذر الحذف"); delete A.cache[d.aldel]; A.quota=null; A.key=""; alLoad(true); toast("🗑️ حُذف") }); return true }
 if(t.hasAttribute("data-aladdbox")){ const n=addWidget("abox",{name:"صندوق الآيرتات"}); applyPreset(n,"mc",CV()); save(); pushLayout(); renderPage(true); return true }
 if(d.alcopy){ copy(overlayURL(L(),d.alcopy)); toast("🔗 نُسخ رابط OBS لصندوق الآيرتات"); return true }
 if(d.algo){ go(d.algo); return true }
 if(d.alctl){ send({t:"clock-op",target:"alerts",op:d.alctl}); return true }
 if(t.hasAttribute("data-alradd")){ alAddRule("","follow"); renderPage(true); return true }
 const C=alCfgS();
 if(d.alrtest!==undefined){ const r=C.rules[+d.alrtest]; if(!r||!r.alertId) return toast("اختر آيرت للقاعدة أولاً"),true; syncBots(); alSyncDefs(); const tv=Object.fromEntries(Object.entries(A.tv||{}).filter(([k,v])=>v)); if(tv.display_name&&!tv.username) tv.username=tv.display_name; send({t:"clock-op",target:"alerts",op:"test",ruleId:r.id,vars:tv}); return true }
 if(d.alrfire!==undefined){ const r=C.rules[+d.alrfire]; if(!r||!r.alertId) return toast("اختر آيرت للقاعدة أولاً"),true; syncBots(); send({t:"clock-op",target:"alerts",op:"fire",ruleId:r.id}); toast("🖐️ شُغّل في البث"); return true }
 if(d.allv){ const P={likes:{ev:"like_user",lv:[[100,"نجمة"],[500,"برق"],[1000,"نار"],[5000,"ألماس"],[10000,"أسد"],[50000,"تنين"],[100000,"ملكي"]]},don:{ev:"donation",lv:[[1,"بسيط"],[5,"عملات"],[10,"ذهبي"],[50,"فاخر"],[100,"سينمائي"]]},gifts:{ev:"gift_value",lv:[[1,"عادي"],[100,"فضي"],[1000,"ذهبي"],[10000,"أسطوري"]]}}[d.allv];
  P.lv.forEach(([v,n],i)=>C.rules.push(alRule({id:"r"+Date.now().toString(36)+i,event:P.ev,alertId:"",label:n+" ("+v.toLocaleString("en")+")",level:n,cond:{op:"gte",value:v},priority:10+i*10,once:P.ev==="like_user"?"user":"none"}))); alSaveCfg(); renderPage(true); toast("✅ أُضيفت المستويات — اختر آيرت لكل مستوى"); return true }
 if(d.alron!==undefined){ const r=C.rules[+d.alron]; r.enabled=r.enabled===false; alSaveCfg(); renderPage(true); return true }
 if(d.alrdup!==undefined){ const r=C.rules[+d.alrdup]; C.rules.splice(+d.alrdup+1,0,{...JSON.parse(JSON.stringify(r)),id:"r"+Date.now().toString(36)}); alSaveCfg(); renderPage(true); return true }
 if(d.alrdel!==undefined){ C.rules.splice(+d.alrdel,1); alSaveCfg(); renderPage(true); return true }
 if(t.hasAttribute("data-alsave")){ alSaveForm(); return true }
 if(t.hasAttribute("data-alcancel")){ A.form=null; A.tab="lib"; renderPage(true); return true }
 if(t.hasAttribute("data-alfplay")){ alFormPreview(true); return true }
 if(d.alfx){ const F=A.form; F[d.alfx+"Id"]=""; F[d.alfx+"Url"]=""; F[d.alfx+"Data"]=""; renderPage(true); return true }
 if(d.aladm){ A.admTab=d.aladm; A.adm=null; renderPage(true); return true }
 if(d.almod){ const go2=note=>alApi("/api/admin/alerts",{method:"PUT",body:{id:d.alid,action:d.almod,note}}).then(j=>{ toast(j.error?"تعذر: "+(j.message||j.error):"✅ تم"); A.adm=null; renderPage(true) }); if(d.almod==="reject"||d.almod==="remove") ask("ملاحظة لصاحب الآيرت (اختياري)","").then(n=>{ if(n!==null&&n!==undefined) go2(n) }); else go2(""); return true }
 if(d.alver){ alApi("/api/admin/alerts",{method:"PUT",body:{action:"verifyDesigner",userId:d.alver,on:d.on==="1"}}).then(j=>{ toast(j.error?"تعذر":"✅ تم"); A.adm=null; renderPage(true) }); return true }
 return false }
let alQT;
function alInput(t,d,e){ const A=ALS();
 if(t.hasAttribute("data-alsort")&&e.type==="change"){ A.sort=t.value; alLoad(true); return true }
 if(t.hasAttribute("data-alq")){ clearTimeout(alQT); alQT=setTimeout(()=>{ A.q=t.value; alLoad(true) },350); return true }
 if(d.alf&&e.type==="change"){ A[d.alf]=t.value; alLoad(true); return true }
 if(d.alfile&&e.type==="change"){ alUpload(d.alfile,t); return true }
 if(t.hasAttribute("data-almain")&&e.type==="change"){ const f=t.files&&t.files[0]; t.value=""; if(f) alPickFile(f); return true }
 if(t.hasAttribute("data-alauto")&&e.type==="change"){ alApi("/api/admin/alerts",{method:"PATCH",body:{autoApprove:t.checked}}).then(j=>{ toast(j.error?"تعذر":"✅ حُفظ"); A.adm=null }); return true }
 if(d.alrate&&e.type==="change"){ alApi("/api/alerts/"+d.alrate+"/act",{method:"POST",body:{act:"rate",value:+t.value}}).then(j=>{ if(j.error) return toast(j.message||"تعذر"); const a=A.cache[d.alrate]; if(a){ const p=(a.my&&a.my.rating)||0; a.ratingSum=(a.ratingSum||0)+j.my.rating-p; a.ratingCount=(a.ratingCount||0)+(j.my.rating?1:0)-(p?1:0); a.rating=a.ratingCount?Math.round(a.ratingSum/a.ratingCount*10)/10:0; a.my=j.my } toast("⭐ شكراً على التقييم"); renderPage(true) }); return true }
 if(d.alff!==undefined&&A.form){ const k=d.alff; let v=t.type==="checkbox"?t.checked:t.value; if(t.type==="radio"&&!t.checked) return true;
  if(t.type==="range"||t.type==="number") v=+v; if(/\.(show|on)$|\.(frameAnim|videoSound)$/.test(k)) v=v==="1"||v===true; if(k==="config.audioDelay") v=+v;
  if(k.startsWith("config.")) alSetPath(A.form,k,v); else A.form[k]=v; A.form.config=alConfig(A.form.config);
  if(e.type==="change"||t.type==="range") { if(t.type==="range"){ const lb=t.closest(".fld")&&t.closest(".fld").querySelector("label"); if(lb) lb.textContent=lb.textContent.replace(/[\d.]+%?(\s*ث)?$/,String(v)+(lb.textContent.includes("%")?"%":lb.textContent.includes("ث")?" ث":"")); clearTimeout(alQT); alQT=setTimeout(()=>alFormPreview(true),400) } else renderPage(true) }
  return true }
 if(d.altv){ A.tv=A.tv||{}; A.tv[d.altv]=t.value.slice(0,200); return true }
 if(d.alr!==undefined&&e.type==="change"){ const C=alCfgS(), r=C.rules[+d.alr]; if(!r) return true; let v=t.value; const k=d.k; if(["priority","cooldownSec","cond.value","cond.value2"].includes(k)) v=+v; if(k==="also"||k==="over.tts") v=v==="1";
  alSetPath(r,k,v); C.rules[+d.alr]=alRule(r); alSaveCfg(); renderPage(true); return true }
 if(d.alc!==undefined&&e.type==="change"){ const C=alCfgS(); let v=t.value; if(d.alc==="enabled"||d.alc==="mergeLikes") v=v==="1"; else v=+v; C[d.alc]=v; alSaveCfg(); return true }
 return false }

// ====== قوائم الداعمين الأسطورية: الإعدادات + «صمم قائمتك» ======
function lbArtProps(w,d,sel,rng){ const A=lbArtOf(d,w), o=x=>Object.entries(x);
 return `<div class="ttl" style="margin:8px 0 4px">✨ إعدادات التصميم الأسطوري</div>
  ${d.custom?`<div class="note small">🎨 صمم قائمتك: اختر كل جزء بنفسك.</div><div class="grid g2" style="gap:8px">${sel("cArr","طريقة الترتيب",o(LB_ARRS),A.arr)}${sel("cFrame","إطار الصورة",o(LB_FRAMES),A.frame)}${sel("cRk","شكل رقم المركز",o(LB_RKS),A.rk)}${sel("cNm","خلفية الاسم",o(LB_NMS),A.nm)}${sel("cAmb","المؤثرات المحيطة",o(LB_AMBS),A.amb)}${sel("cD1","زخرفة المركز الأول",o(LB_D1S),A.d1)}${sel("cCel","احتفال الصدارة",o(LB_CELS),A.cel)}</div>`:""}
  <div class="grid g2" style="gap:8px">${sel("cel1","احتفال الوصول للمركز الأول",[["","— حسب التصميم —"],...o(LB_CELS)],w.cel1||"")}${sel("fx1","احتفال الصدارة",[["1","مفعّل"],["0","متوقف"]],w.fx1!==false?"1":"0")}
  ${sel("crown1","زخرفة المركز الأول (تاج/أجنحة…)",[["1","ظاهرة"],["0","مخفية"]],w.crown1!==false?"1":"0")}${sel("showAmb","المؤثرات المحيطة (فراشات/نجوم…)",[["1","ظاهرة"],["0","مخفية"]],w.showAmb!==false?"1":"0")}
  ${rng("fxN","كثافة المؤثرات",0,2,.25,w.fxN??1,v=>Math.round(v*100)+"%")}${rng("firstScale","حجم المركز الأول",.7,1.5,.05,w.firstScale||1,v=>Math.round(v*100)+"%")}
  ${rng("glowStr","شدة التوهج",0,2,.1,w.glowStr??1,v=>v+"×")}${rng("animSpeed","سرعة الحركة",.5,2,.1,w.animSpeed||1,v=>v+"×")}
  ${sel("showAv","صور الداعمين",[["1","ظاهرة"],["0","مخفية"]],w.showAv!==false?"1":"0")}${sel("showRank","أرقام المراكز",[["1","ظاهرة"],["0","مخفية"]],w.showRank!==false?"1":"0")}
  ${sel("showIcon","أيقونة الألماس",[["1","ظاهرة"],["0","مخفية"]],w.showIcon!==false?"1":"0")}${sel("shine","لمعة الأسماء",[["0","متوقفة"],["1","مفعّلة"]],w.shine===true||(w.shine!==false&&d.id==="whiteShine")?"1":"0")}
  ${A.arr==="rotate"?rng("rotSec","مدة عرض كل داعم",2,12,1,w.rotSec||4,v=>v+" ث"):""}
  <div class="fld"><label>لون الأسماء</label><input type="color" data-wf="nameColor" data-wid="${w.id}" value="${w.nameColor||"#ffffff"}"></div><div class="fld"><label>لون قيمة الدعم</label><input type="color" data-wf="valTx" data-wid="${w.id}" value="${w.valTx||"#ffffff"}"></div></div>` }
let lbtN=0;
function lbtClick(t,d){
 if(d.lbt){ const k=d.lbt, U=n=>({id:"pvu"+n,name:["فهد","نورة","سارة","Ahmed","ريم","خالد","Mona","عبدالله","ليان","ماجد"][n%10]});
  if(k==="new") sim({type:"gift",user:{id:"pvn"+(++lbtN),name:"داعم "+lbtN},gift:"وردة",giftId:1,count:1,value:20+Math.ceil(Math.random()*80),test:true});
  else if(k==="top"){ const L_=lbEntries({source:"gifts",topN:1},SRC()); const top=(L_[0]&&L_[0].v)||0; sim({type:"gift",user:{id:"pvt"+(++lbtN),name:"المتحدي "+lbtN},gift:"أسد",giftId:2,count:1,value:top+100,test:true}) }
  else if(k==="add") sim({type:"gift",user:U(Math.floor(Math.random()*5)),gift:"وردة",giftId:1,count:1,value:15,test:true});
  else if(k==="cel") lbPvAll(v=>v.celebrate&&v.celebrate());
  else if(k==="still"){ S.lbStill=!S.lbStill; document.getElementById("lib")?.classList.toggle("pv-still",S.lbStill); t.classList.toggle("on",S.lbStill) }
  return true }
 if(d.lbobs){ const l=L(); let w=l.widgets.find(x=>x.type==="lb"&&x.id===S.libTarget)||l.widgets.find(x=>x.type==="lb"&&x.design===d.lbobs);
  if(!w) w=addWidget("lb",{design:d.lbobs,name:"قائمة — "+lbDesignOf(d.lbobs).name}); else w.design=d.lbobs; save(); pushLayout();
  copy(overlayURL(l,w.id)); toast("🔗 طُبّق «"+lbDesignOf(d.lbobs).name+"» ونُسخ رابط OBS المستقل"); return true }
 return false }
function lbPvAll(fn){ for(const v of liveViews) if(v.w&&v.w.type==="lb"&&String(v.w.id).startsWith("pv_")) fn(v) }

/* ================= التشغيل ================= */
(function(){
 const h=location.hash;
 if(h.startsWith("#/bio")){ // صفحة البايو العامة (نسخة التجربة: من هذا الجهاز)
  const b=Object.assign(bioDefaults(),ls("b6o6.bio")||{}); b.stats=b.stats||{visits:0,clicks:{}}; b.stats.visits=(b.stats.visits||0)+1; ls("b6o6.bio",b);
  document.title=(b.name||"B6O6")+" — رابط البايو"; document.body.innerHTML=`<style>html,body{margin:0;height:100%}${BIO_CSS}</style>`+bioHTML(b,{visits:b.stats.visits});
  document.body.addEventListener("click",e=>{ const a=e.target.closest("[data-bl]"); if(!a) return; const k=a.dataset.bl; b.stats.clicks[k]=(b.stats.clicks[k]||0)+1; ls("b6o6.bio",b) }); return }
 if(h.startsWith("#/overlay")){ const qq=new URLSearchParams(h.split("?")[1]||""); bootOverlay(qq); if(qq.get("voice")==="1") vpInit(2); return }
 shell(); renderPage(); vpInit(1);
 if(S.settings.wsUrl) startWS();
 window.__arsh={faW,S,R:()=>R,send,L,SIM,clockOp,addWidget,save,pushLayout,overlayURL,receive,psCur,psBlob,psDraw};
 window.S=S;
})();
</script>
</body>
</html>
