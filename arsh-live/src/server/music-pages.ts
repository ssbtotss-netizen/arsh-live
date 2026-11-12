// صفحتان مستقلتان عن لوحة التحكم (HTML خفيف بدون إطار عمل — تعمل في OBS و TikTok LIVE Studio والجوال):
// 1) /sr/<songToken>        صفحة المشاهد: بحث بالاسم أو الفنان ← اختيار ← «طلب الأغنية»
// 2) /music-player/<token>  مشغل الأغاني (Browser Source شفاف): يشغّل الصوت فعلياً ويتنقل تلقائياً — مشغل واحد فقط في كل لحظة
const esc = (s: string) => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const tokOk = (t: string) => /^[\w-]{8,80}$/.test(t || "");

export function requestPageHTML(token: string) {
  if (!tokOk(token)) return "<!doctype html><meta charset=utf-8><p>رابط غير صالح</p>";
  return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>🎵 اطلب أغنية — B6O6 Streaming</title>
<style>
:root{--bg:#0b0e17;--card:#141a29;--line:#252d42;--pri:#ffcc00;--txt:#eef2ff;--mut:#8b95b0;--ok:#4ade80;--bad:#f87171}
*{box-sizing:border-box}body{margin:0;background:radial-gradient(1200px 600px at 80% -10%,#2a1f4a55,transparent),var(--bg);color:var(--txt);font:15px/1.6 system-ui,"Segoe UI",Tahoma,sans-serif}
.wrap{max-width:720px;margin:0 auto;padding:16px}h1{font-size:22px;margin:6px 0 2px}.mut{color:var(--mut);font-size:13px}
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:14px;margin-top:12px}
.inp{width:100%;padding:12px 14px;border-radius:12px;border:1px solid var(--line);background:#0e1320;color:var(--txt);font:inherit}
.btn{border:0;border-radius:10px;padding:9px 14px;font:inherit;font-weight:700;cursor:pointer;background:#232c44;color:var(--txt)}.btn.pri{background:var(--pri);color:#111}.btn:disabled{opacity:.5;cursor:default}
.row{display:flex;gap:10px;align-items:center}.res{display:flex;flex-direction:column;gap:8px;margin-top:10px}
.it{display:flex;gap:12px;align-items:center;padding:8px;border-radius:12px;background:#0e1320;border:1px solid transparent}.it:hover{border-color:var(--line)}
.cv{width:52px;height:52px;border-radius:10px;flex:0 0 52px;background:#222 center/cover;display:grid;place-items:center;font-size:22px}
.tt{flex:1;min-width:0}.tt b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.tt span{color:var(--mut);font-size:13px}
.msg{margin-top:10px;padding:10px 12px;border-radius:10px;display:none}.msg.ok{display:block;background:#4ade8022;border:1px solid #4ade8055}.msg.bad{display:block;background:#f8717122;border:1px solid #f8717155}
.q li{margin:4px 0}.now{display:flex;gap:12px;align-items:center}.tag{font-size:12px;padding:2px 8px;border-radius:99px;background:#ffffff12}
</style></head><body><div class="wrap">
<h1>🎵 اطلب أغنية</h1><div class="mut" id="who">…</div>
<div class="card" id="closed" style="display:none">⛔ طلبات الأغاني متوقفة الآن.</div>
<div class="card" id="box"><label class="mut">اسمك (يظهر مع طلبك)</label><input class="inp" id="nm" maxlength="30" placeholder="اسمك أو يوزرك في TikTok">
<div style="height:10px"></div><input class="inp" id="q" placeholder="🔎 ابحث باسم الأغنية أو الفنان" autocomplete="off">
<div class="msg" id="msg"></div><div class="res" id="res"></div><div class="mut" id="rules" style="margin-top:8px"></div></div>
<div class="card"><b>▶ تعمل الآن</b><div id="now" class="mut" style="margin-top:6px">—</div><b style="display:block;margin-top:10px">قائمة الانتظار</b><ol class="q" id="ql"></ol></div>
<p class="mut" style="text-align:center">B6O6 Streaming — الأغاني من مكتبة صانع المحتوى</p></div>
<script>
const T=${JSON.stringify(token)}, A="/api/sr/"+T, $=id=>document.getElementById(id);
const fmt=s=>s?Math.floor(s/60)+":"+String(s%60).padStart(2,"0"):"";
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const cv=c=>c?'<div class="cv" style="background-image:url(\\''+esc(c)+'\\')"></div>':'<div class="cv">🎵</div>';
try{ $("nm").value=localStorage.getItem("b6o6.srname")||"" }catch(e){}
let busy=false, open=true;
function show(t,ok){ const m=$("msg"); m.className="msg "+(ok?"ok":"bad"); m.textContent=t }
async function info(){ try{ const r=await fetch(A,{cache:"no-store"}); const j=await r.json(); if(!r.ok){ $("who").textContent=j.message||"الرابط غير صالح"; return }
 $("who").textContent="طلبات أغاني بث "+j.name; open=j.open; $("closed").style.display=open?"none":"block"; $("box").style.opacity=open?1:.5;
 const R=j.rules, x=[]; if(R.maxDurSec) x.push("أقصى مدة "+fmt(R.maxDurSec)); if(R.perUser) x.push(R.perUser+" طلبات لكل مشاهد"); if(R.cooldownSec) x.push("انتظار "+R.cooldownSec+" ث بين الطلبات"); if(R.manual) x.push("الطلبات تحتاج موافقة صانع المحتوى"); $("rules").textContent=x.join(" · ");
 $("now").innerHTML=j.now?'<div class="now">'+cv(j.now.cover)+'<div class="tt"><b>'+esc(j.now.title)+'</b><span>'+esc(j.now.artist)+(j.now.by?" · طلب "+esc(j.now.by):"")+(j.now.paused?' <span class="tag">⏸ متوقف</span>':"")+'</span></div></div>':"لا توجد أغنية الآن";
 $("ql").innerHTML=j.queue.map(q=>"<li><b>"+esc(q.title)+"</b> <span class=mut>"+esc(q.artist)+" · "+esc(q.by)+"</span></li>").join("")||'<span class="mut">فاضية — اطلب أول أغنية!</span>' }catch(e){ $("who").textContent="تعذر الاتصال بالخادم" } }
let st=null; async function search(){ const q=$("q").value.trim(); try{ const r=await fetch(A+"/search?q="+encodeURIComponent(q),{cache:"no-store"}); const j=await r.json(); if(!r.ok) return show(j.message||"تعذر البحث",false);
 $("res").innerHTML=j.results.length?j.results.map(t=>'<div class="it">'+cv(t.cover)+'<div class="tt"><b>'+esc(t.title)+'</b><span>'+esc(t.artist||"—")+(t.dur?" · "+fmt(t.dur):"")+'</span></div><button class="btn pri" data-id="'+esc(t.id)+'">طلب الأغنية</button></div>').join(""):'<div class="mut">'+(j.total?"لا توجد نتائج — جرّب اسماً آخر":"مكتبة صانع المحتوى فاضية حالياً")+'</div>' }catch(e){ show("تعذر البحث — تحقق من الاتصال",false) } }
$("q").addEventListener("input",()=>{ clearTimeout(st); st=setTimeout(search,250) });
$("res").addEventListener("click",async e=>{ const b=e.target.closest("[data-id]"); if(!b||busy) return; const name=$("nm").value.trim(); if(name.length<2){ show("اكتب اسمك أولاً",false); $("nm").focus(); return }
 try{ localStorage.setItem("b6o6.srname",name) }catch(_){}
 busy=true; b.disabled=true; b.textContent="جارٍ الإرسال…"; console.log("[sr] sending",b.dataset.id);
 try{ const r=await fetch(A+"/request",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({trackId:b.dataset.id,name})}); const j=await r.json().catch(()=>({}));
  console.log("[sr] server",r.status,j); if(r.ok&&j.ok){ show("✅ "+j.message,true); b.textContent="✔ تم الطلب"; info() } else { show("⚠️ "+(j.message||"لم يُرسل الطلب ("+r.status+")"),false); b.disabled=false; b.textContent="طلب الأغنية" } }
 catch(err){ show("⚠️ لم يُرسل الطلب — تحقق من الاتصال وحاول مرة أخرى",false); b.disabled=false; b.textContent="طلب الأغنية" } finally{ busy=false } });
info(); search(); setInterval(info,5000);
</script></body></html>`;
}

export function playerPageHTML(token: string) {
  if (!tokOk(token)) return "<!doctype html><meta charset=utf-8>";
  return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="referrer" content="strict-origin-when-cross-origin"><title>B6O6 — مشغل الأغاني</title>
<style>html,body{margin:0;background:transparent;overflow:hidden;font:600 16px/1.4 system-ui,"Segoe UI",Tahoma,sans-serif;color:#fff}
.wrap{position:fixed;bottom:24px;right:24px;display:flex;gap:12px;align-items:flex-end;transition:opacity .4s,transform .4s}.wrap.hide{opacity:0;transform:translateY(20px)}
.np{display:flex;gap:14px;align-items:center;padding:12px 16px 12px 12px;min-width:300px;max-width:480px;border-radius:18px;background:#0b0e17cc;backdrop-filter:blur(8px);box-shadow:0 10px 30px #0008}
.cv{width:64px;height:64px;border-radius:12px;background:linear-gradient(135deg,#7c3aed,#ec4899) center/cover;flex:0 0 64px;display:grid;place-items:center;font-size:28px}
.tt{flex:1;min-width:0}.tt b{display:block;font-size:18px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.tt span{display:block;font-size:13px;opacity:.75;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bar{height:4px;border-radius:4px;background:#ffffff26;margin-top:8px;overflow:hidden}.bar i{display:block;height:100%;width:0;background:#ffcc00;transition:width .5s linear}
.st{font-size:11px;opacity:.8;margin-top:4px}.err{color:#fca5a5}.src{font-size:11px;opacity:.7}
/* مشغل YouTube الرسمي: ظاهر دائماً أثناء تشغيل أغنية من YouTube (شروط YouTube: 200×200 على الأقل، بدون تغطية) */
.ytb{width:356px;height:200px;border-radius:14px;overflow:hidden;background:#000;box-shadow:0 10px 30px #0008;display:none}.ytb.on{display:block}.ytb iframe{width:100%;height:100%;border:0}
.tap{position:fixed;inset:0;display:none;place-items:center;background:#000a;font-size:20px;cursor:pointer}
</style></head><body><div class="wrap hide" id="wrap"><div class="ytb" id="ytb"><div id="yt"></div></div><div class="np" id="np"><div class="cv" id="cv">🎵</div><div class="tt"><b id="ti"></b><span id="ar"></span><div class="bar"><i id="pb"></i></div><div class="st" id="st"></div><div class="src" id="src"></div></div></div></div>
<div class="tap" id="tap">▶ اضغط مرة لتفعيل الصوت</div>
<script>
// مصدران للتشغيل الفعلي، منفصلان عن بيانات الأغنية:
//  • YouTube: المشغل المضمّن الرسمي (IFrame Player API) — ظاهر في البث، والصوت يُلتقط من مصدر المتصفح في OBS
//  • مكتبتك: /api/music/stream/<token>/<trackId> (ملف صوتي فعلي)
const T=${JSON.stringify(token)}, P=new URLSearchParams(location.search), UI=P.get("ui")!=="0", PID=P.get("pid")||("p"+Math.random().toString(36).slice(2,10)), KIND=P.get("as")||"obs";
const $=id=>document.getElementById(id), A=new Audio(); A.preload="auto";
const YTE={2:"معرّف الفيديو غير صالح",5:"تعذر تشغيل الفيديو في المشغل",100:"الفيديو حُذف أو أصبح خاصاً",101:"صاحب الفيديو منع التشغيل خارج YouTube",150:"صاحب الفيديو منع التشغيل خارج YouTube",153:"المشغل يحتاج Referer"};
let ws=null, M=null, key="", mine=false, loadT=null, lastSt="", kind="", YTP=null, ytOk=false, ytP=null, ytWant=null;
const log=(...a)=>console.log("[b6o6-player]",...a);
const send=m=>{ if(ws&&ws.readyState===1) ws.send(JSON.stringify({t:"mplayer",pid:PID,kind:KIND,...m})) };
const LBL={loading:"⏳ جارٍ التحميل…",playing:"▶ يعمل",paused:"⏸ متوقف مؤقتاً",blocked:"🔇 المتصفح منع التشغيل التلقائي",error:"❌ تعذر التشغيل",idle:""};
const cur=()=>M&&M.current, isYt=c=>c&&c.track&&c.track.src==="yt";
const pos=()=>kind==="yt"?(YTP&&ytOk&&YTP.getCurrentTime?YTP.getCurrentTime()||0:0):(A.currentTime||0);
function report(status){ const c=cur(); if(!c||!mine) return; if(status===lastSt&&status!=="pos") return; if(status!=="pos") lastSt=status; send({op:"pstate",qid:c.qid,status:status==="pos"?M.status:status,pos:Math.round(pos())}) }
function fail(why,embed){ const c=cur(); log("error",why); clearTimeout(loadT); if(c&&mine) send({op:"perror",qid:c.qid,why,embed:!!embed}); $("st").textContent="❌ "+why; $("st").className="st err" }
function armTimeout(){ clearTimeout(loadT); loadT=setTimeout(()=>{ if(lastSt!=="playing"&&lastSt!=="blocked"&&!(M&&M.paused)) fail("انتهت مهلة تحميل الأغنية (25 ث)") },25000) }
// ---------- ملفات المكتبة ----------
A.addEventListener("playing",()=>{ if(kind!=="lib") return; clearTimeout(loadT); $("tap").style.display="none"; report("playing") });
A.addEventListener("pause",()=>{ if(kind==="lib"&&M&&M.paused) report("paused") });
A.addEventListener("ended",()=>{ const c=cur(); if(kind==="lib"&&c&&mine) send({op:"pended",qid:c.qid}) });
A.addEventListener("error",()=>{ if(kind!=="lib"||!A.currentSrc) return; const e=A.error, code=e?e.code:0; fail(code===4?"صيغة الملف غير مدعومة أو الملف غير موجود":code===2?"انقطع تحميل الأغنية (شبكة)":code===3?"تعذر فك ترميز الملف":"تعذر تحميل ملف الأغنية") });
A.addEventListener("timeupdate",()=>{ const c=cur(); if(kind==="lib"&&c&&c.track.dur) $("pb").style.width=Math.min(100,A.currentTime/c.track.dur*100)+"%" });
function playA(){ A.play().catch(e=>{ log("play blocked",e&&e.name); if(e&&e.name==="NotAllowedError"){ $("tap").style.display="grid"; report("blocked") } }) }
// ---------- YouTube (IFrame Player API الرسمي) ----------
function ytApi(){ if(window.YT&&YT.Player) return Promise.resolve(); if(!ytP) ytP=new Promise((res,rej)=>{ const prev=window.onYouTubeIframeAPIReady; window.onYouTubeIframeAPIReady=()=>{ prev&&prev(); res() }; const s=document.createElement("script"); s.src="https://www.youtube.com/iframe_api"; s.onerror=()=>rej(new Error("api")); document.head.appendChild(s) }); return ytP }
function ytState(e){ const S=(window.YT&&YT.PlayerState)||{ENDED:0,PLAYING:1,PAUSED:2,BUFFERING:3}, c=cur(); if(kind!=="yt"||!c) return;
 if(e.data===S.PLAYING){ clearTimeout(loadT); $("tap").style.display="none"; report("playing") }
 else if(e.data===S.ENDED){ log("yt ended"); if(mine) send({op:"pended",qid:c.qid}) }
 else if(e.data===S.PAUSED){ if(M&&M.paused) report("paused") }
 else if(e.data===S.BUFFERING){ $("st").textContent=LBL.loading } }
function ytErr(e){ if(kind!=="yt") return; const code=+e.data; fail(YTE[code]||("خطأ في مشغل YouTube ("+code+")"),code===101||code===150) }
function ytLoad(vid,start){ ytWant={vid,start}; return ytApi().then(()=>{ if(YTP&&ytOk){ YTP.loadVideoById({videoId:vid,startSeconds:start||0}); return }
  if(YTP) return; YTP=new YT.Player("yt",{width:356,height:200,videoId:vid,host:"https://www.youtube.com",playerVars:{autoplay:1,playsinline:1,rel:0,start:Math.floor(start||0),origin:location.origin},
   events:{onReady:()=>{ ytOk=true; if(ytWant&&ytWant.vid!==vid) YTP.loadVideoById({videoId:ytWant.vid,startSeconds:ytWant.start||0}); YTP.setVolume&&YTP.setVolume(M?M.volume??70:70); if(M&&M.paused) YTP.pauseVideo(); else YTP.playVideo() },onStateChange:ytState,onError:ytErr,onAutoplayBlocked:()=>{ log("yt autoplay blocked"); $("tap").style.display="grid"; report("blocked") }}}) })
 .catch(()=>fail("تعذر تحميل مشغل YouTube (الشبكة)")) }
$("tap").onclick=()=>{ $("tap").style.display="none"; if(kind==="yt"&&YTP&&ytOk) YTP.playVideo(); else playA() };
function stopAll(except){ if(except!=="lib"&&!A.paused) A.pause(); if(except!=="yt"&&YTP&&ytOk&&YTP.getPlayerState&&YTP.getPlayerState()===1) YTP.pauseVideo(); }
function render(){ const c=cur(), w=$("wrap");
 const yt=!!(c&&isYt(c)&&mine); $("ytb").classList.toggle("on",yt); /* المشغل الرسمي ظاهر دائماً عند تشغيل YouTube (حتى مع ui=0) */
 if(!c||(!UI&&!yt)){ w.classList.add("hide"); return } w.classList.remove("hide"); $("np").style.display=UI?"flex":"none";
 $("ti").textContent=c.track.title; $("ar").textContent=(c.track.artist||"")+(c.by&&c.by.name?" · طلب "+c.by.name:"");
 $("cv").style.backgroundImage=c.track.cover?'url("'+c.track.cover.replace(/"/g,"")+'")':""; $("cv").textContent=c.track.cover?"":"🎵";
 $("src").textContent=isYt(c)?"▶ YouTube":"🎧 مكتبتي";
 const s=M.paused?"paused":(M.status||"loading"); $("st").textContent=!mine?"":M.err&&s!=="playing"?"❌ "+M.err:LBL[s]||""; $("st").className="st"+(M.err&&s!=="playing"?" err":"") }
function sync(){ if(!M) return; mine=!!(M.player&&M.player.pid===PID); const c=cur(); render();
 if(!mine||!c){ stopAll(); if(!c){ key=""; kind=""; } return }
 const k=c.qid+":"+(c.rp||0)+":"+(c.track.vid||c.track.id), nk=isYt(c)?"yt":"lib";
 if(k!==key){ const resume=key===""&&c.pos>0&&c.qid===sessionStorage.getItem("b6o6.mq"); key=k; kind=nk; lastSt=""; sessionStorage.setItem("b6o6.mq",c.qid); stopAll(nk);
  log("load",nk,c.track.title); report("loading"); armTimeout();
  if(nk==="yt") ytLoad(c.track.vid,resume?c.pos:0);
  else { A.src="/api/music/stream/"+encodeURIComponent(T)+"/"+encodeURIComponent(c.track.id); if(resume) A.currentTime=c.pos } }
 const vol=Math.max(0,Math.min(100,M.volume??70));
 if(kind==="yt"){ if(YTP&&ytOk){ YTP.setVolume(vol); const ps=YTP.getPlayerState(); if(M.paused){ if(ps===1||ps===3) YTP.pauseVideo(); clearTimeout(loadT); report("paused") } else if(ps===2) YTP.playVideo() } }
 else { A.volume=vol/100; if(M.paused){ if(!A.paused) A.pause(); clearTimeout(loadT); report("paused") } else if(A.paused) playA() } }
function connect(){ ws=new WebSocket((location.protocol==="https:"?"wss":"ws")+"://"+location.host+"/ws");
 ws.onopen=()=>{ log("connected"); ws.send(JSON.stringify({t:"join",room:T})); send({op:"claim"}) };
 ws.onmessage=e=>{ let m; try{ m=JSON.parse(e.data) }catch(_){ return } if((m.t==="snapshot"||m.t==="clock")&&m.C){ M=m.C.music||null; if(M&&!M.player) send({op:"claim"}); sync() } };
 ws.onclose=()=>{ log("disconnected — retry"); setTimeout(connect,2000) }; }
// نبضة: تجديد ملكية التشغيل + الموضع + شريط التقدم
setInterval(()=>{ send({op:"claim"}); const c=cur(); if(mine&&c&&lastSt==="playing") report("pos"); if(kind==="yt"&&c&&c.track.dur) $("pb").style.width=Math.min(100,pos()/c.track.dur*100)+"%" },5000);
setInterval(()=>{ const c=cur(); if(kind==="yt"&&c&&c.track.dur) $("pb").style.width=Math.min(100,pos()/c.track.dur*100)+"%" },1000);
connect(); window.__player={A,get M(){return M},get mine(){return mine},get YTP(){return YTP},get kind(){return kind},PID};
</script></body></html>`;
}
