/* ================= 🔊 مكتبة الأصوات — واجهة لوحة التحكم =================
   البساطة: اختيار الصوت ← الاستماع ← «استخدام الصوت» ← اختيار الحدث ← «حفظ وتفعيل».
   القرار في الخادم (sounds.js)، والتشغيل في رابط OBS (مشغل الأصوات). المعاينة هنا خاصة بك ولا تصل للبث. */
const SND_TABS=[["all","🎧 الكل"],["top","🔥 الأكثر استخداماً"],["new","🆕 الجديدة"],["meme_sa","🇸🇦 الميمز السعودية"],["meme_ar","🌍 الميمز العربية"],["cat:alerts","🔔 أصوات التنبيهات"],["cat:comedy","😂 كوميدي"],["cat:hype","🔥 حماس وفخامة"],["cat:games","🎮 ألعاب"],["cat:support","💰 دعم ودونيشن"],["cat:arabic","🎶 لمسة عربية"],["fav","⭐ المفضلة"],["used","📌 الأصوات المستخدمة"],["mine","🎵 أصواتي الخاصة"],["community","🌐 أصوات المجتمع"],["board","🎛️ لوحة التشغيل السريع"],["settings","⚙️ الإعدادات ورابط OBS"]];
const SND_UCATS={mine:"🎵 خاص",meme_sa:"🇸🇦 ميمز سعودية",meme_ar:"🌍 ميمز عربية",comedy:"😂 كوميدي",alerts:"🔔 تنبيهات",hype:"🔥 حماس",games:"🎮 ألعاب",support:"💰 دعم"};
const SND_SHARE_STYLE={meme_sa:"saudi",meme_ar:"funny",comedy:"funny",alerts:"minimal",hype:"cinematic",games:"gaming",support:"money",mine:"minimal"};
const SND_ICONS=["🔊","😂","🔥","👏","💰","🎉","👑","🎮","⚡","💥","😱","🤣","❤️","🏆","🥁","📢","🎺","🎵"];
const SND_COLORS=["#8b5cf6","#ec4899","#f59e0b","#10b981","#3b82f6","#ef4444","#14b8a6","#a3e635","#f97316","#64748b"];
let SNDX=null, SNDXp=null;
function sndBaseUrl(){ return location.protocol==="file:"?"../arsh-live/public/sounds/lib/":"/sounds/lib/" }
function sndLoadIndex(){ if(SNDX) return Promise.resolve(SNDX); if(SNDXp) return SNDXp;
 SNDXp=(window.B6O6_SND_INDEX?Promise.resolve(window.B6O6_SND_INDEX):fetch(sndBaseUrl()+"index.json",{cache:"force-cache"}).then(r=>r.json())).then(d=>{ const items=(d.items||[]).map((x,i)=>({...x,src:"lib:"+x.id,ord:i})); SNDX={cats:d.cats||{},items,by:Object.fromEntries(items.map(x=>[x.src,x]))}; if(S.page==="sounds") renderPage(true); return SNDX }).catch(()=>{ SNDXp=null; SNDX={cats:{},items:[],by:{},err:true}; return SNDX }); return SNDXp }
function SC(){ S.bots=S.bots||{}; if(!S.bots.sounds||S.bots.sounds.v!==1) S.bots.sounds=sndCfg(S.bots.sounds||{}); return S.bots.sounds }
function sndSave(msg){ S.bots.sounds=sndCfg(S.bots.sounds); save(); pushLayout(); syncBots(); if(msg) toast(msg) }
function SU(){ S.snd=S.snd||{tab:"all",q:"",cat:"",n:60}; return S.snd }
function sndInfo(src){ if(!src) return null; if(SNDX&&SNDX.by[src]) return SNDX.by[src]; const c=SC();
 if(src.startsWith("up:")){ const u=c.user.find(x=>"up:"+x.id===src); return u?{src,name:u.name,cat:u.cat,dur:u.dur,peaks:u.peaks,mine:true,url:"/api/alerts/media/"+u.id,start:u.start,end:u.end,defVol:u.vol}:{src,name:"صوت خاص (محذوف؟)",cat:"mine",dur:0,peaks:[],missing:true} }
 if(src.startsWith("al:")){ const a=(S.sndCom||[]).find(x=>"al:"+x.id===src)||(S.sndComSeen||{})[src]; return a?{src,name:a.name,cat:"community",dur:a.durationSec||0,peaks:[],url:a.audioUrl||a.mediaUrl,community:true}:{src,name:"صوت من المجتمع",cat:"community",dur:0,peaks:[]} }
 return null }
function sndPrevUrl(src){ const i=sndInfo(src); if(!i) return ""; if(i.url) return i.url; return src.startsWith("lib:")?sndBaseUrl()+src.slice(4)+".mp3":"" }
const sndFmtDur=s=>!(s>0)?"—":s<10?s.toFixed(1)+" ث":Math.round(s)+" ث";
/** أين يُستخدم الصوت (قواعد الأحداث + لوحة التشغيل) */
function sndUses(src){ const c=SC(), out=[]; for(const r of c.rules) if(r.sounds.some(s=>s.src===src)) out.push(sndRuleLabel(r)); if(c.board.some(b=>b.s.src===src)) out.push("🎛️ لوحة التشغيل"); return out }
function sndRuleLabel(r){ const e=SND_EVENTS[r.ev]||{}, c=r.cond||{}; let x=e.icon+" "+e.label;
 if(r.ev==="gift") x=c.any?"🎁 أي هدية أخرى":"🎁 "+(c.name||("هدية #"+c.giftId)); if(r.ev==="donation") x="💵 دونيشن "+(c.cur==="USD"?"$":c.cur+" ")+fmt(c.min)+"+"; if(r.ev==="taps") x="👆 "+fmt(c.n)+" تكبيسة";
 if(r.ev==="subathon") x="⏱️ السابثون — "+({add:"زيادة الوقت",sub:"نقص الوقت",any:"أي تغيير"}[c.dir]); if(r.ev==="goal") x="🎯 "+({any:"تحقيق أي هدف",likes:"هدف الإعجابات",subathon:"هدف السبثون"}[c.kind]); return x }
function sndWave(peaks,cat,dur){ const p=(peaks&&peaks.length?peaks:new Array(32).fill(.15)); const style=({comedy:"dots",games:"steps",arabic:"mirror",hype:"mirror",support:"bars",alerts:"bars"})[cat]||"bars";
 return `<div class="snd-wave w-${style}" dir="ltr" style="--d:${Math.max(.3,dur||1)}s">${p.map(v=>`<i style="--h:${Math.max(.06,v)}"></i>`).join("")}<b class="snd-ph"></b></div>` }
function sndCard(i){ const c=SC(), fav=c.fav.includes(i.src), uses=sndUses(i.src), playing=S.sndPlaying===i.src;
 return `<div class="snd-card k-${esc(i.cat||"mine")} ${playing?"playing":""} ${i.missing?"miss":""}" data-sid="${esc(i.src)}">
  <div class="snd-top"><button class="snd-play" data-snd="prev" data-s="${esc(i.src)}" title="معاينة (لك فقط — لا تصل للبث)">${playing?"⏹":"▶"}</button>
   <div class="snd-meta"><b title="${esc(i.name)}">${esc(i.name)}</b><span>${esc((SNDX&&SNDX.cats[i.cat])||SND_UCATS[i.cat]||(i.community?"🌐 المجتمع":""))} · ${sndFmtDur(i.dur)}</span></div>
   <button class="snd-fav ${fav?"on":""}" data-snd="fav" data-s="${esc(i.src)}" title="${fav?"إزالة من المفضلة":"إضافة للمفضلة"}">${fav?"★":"☆"}</button></div>
  ${sndWave(i.peaks,i.cat,i.dur)}
  <div class="snd-act"><button class="btn sm pri" data-snd="use" data-s="${esc(i.src)}">استخدام الصوت</button><button class="btn sm" data-snd="now" data-s="${esc(i.src)}" title="يشتغل في البث الآن عبر رابط OBS">📡 تشغيل الآن</button>
   ${i.community?`<button class="btn sm ghost" data-snd="report" data-s="${esc(i.src)}" title="إبلاغ عن صوت مخالف">🚩</button>`:""}</div>
  ${uses.length?`<div class="snd-link on">🔗 مرتبط: ${esc(uses.slice(0,2).join(" · "))}${uses.length>2?` +${uses.length-2}`:""}</div>`:`<div class="snd-link">غير مرتبط بحدث</div>`}
 </div>` }
function sndList(){ const U=SU(), c=SC(), all=SNDX?SNDX.items:[], q=lc(U.q).trim();
 let L=[]; const t=U.tab;
 if(t==="all") L=all; else if(t==="new") L=all.filter(x=>x.ord>=all.length-125).reverse(); else if(t.startsWith("cat:")) L=all.filter(x=>x.cat===t.slice(4));
 else if(t==="top"){ const n=sndUseCount(); L=[...all,...c.user.map(u=>sndInfo("up:"+u.id))].map(x=>({x,n:n[x.src]||0})).filter(o=>o.n>0).sort((a,b)=>b.n-a.n).map(o=>o.x); if(L.length<24) L=[...L,...all.filter(x=>x.ev&&!L.includes(x))].slice(0,60) }
 else if(t==="fav") L=c.fav.map(sndInfo).filter(Boolean); else if(t==="mine") L=c.user.map(u=>sndInfo("up:"+u.id)); else if(t==="meme_sa"||t==="meme_ar") L=[...c.user.filter(u=>u.cat===t).map(u=>sndInfo("up:"+u.id)),...(S.sndCom||[]).filter(a=>(a.tags||[]).includes("snd:"+t)).map(a=>sndInfo("al:"+a.id))];
 else if(t==="community") L=(S.sndCom||[]).map(a=>sndInfo("al:"+a.id));
 if(q) L=L.filter(x=>lc(x.name).includes(q)||lc(x.tags||"").includes(q)||lc((SNDX&&SNDX.cats[x.cat])||"").includes(q));
 return L.filter(Boolean) }
function sndUseCount(){ const n={}; try{ Object.assign(n,JSON.parse(localStorage.getItem("b6o6.sndUse")||"{}")) }catch(e){} for(const r of SC().rules) for(const s of r.sounds) n[s.src]=(n[s.src]||0)+3; return n }
function sndBump(src){ try{ const n=JSON.parse(localStorage.getItem("b6o6.sndUse")||"{}"); n[src]=(n[src]||0)+1; const ks=Object.keys(n); if(ks.length>400) delete n[ks[0]]; localStorage.setItem("b6o6.sndUse",JSON.stringify(n)) }catch(e){} }
function sndHasPlayer(){ return (S.layouts||[]).some(l=>(l.widgets||[]).some(w=>w.type==="sndplayer"))||(L().widgets||[]).some(w=>w.type==="sndplayer") }

function sndHTML(){ const U=SU(), c=SC(); sndLoadIndex(); if((U.tab==="community"||U.tab.startsWith("meme"))&&!S.sndComLoaded) sndLoadCommunity();
 const tabs=`<div class="snd-tabs">${SND_TABS.map(([k,l])=>`<button class="snd-tab ${U.tab===k?"on":""}" data-snd="tab" data-k="${k}">${l}${k==="fav"&&c.fav.length?` <i>${c.fav.length}</i>`:k==="used"&&c.rules.length?` <i>${c.rules.length}</i>`:k==="mine"&&c.user.length?` <i>${c.user.length}</i>`:""}</button>`).join("")}</div>`;
 const head=`<div class="snd-head"><div><h2>🔊 مكتبة الأصوات</h2><p class="muted">اختر الصوت ← استمع ← «استخدام الصوت» ← اختر الحدث ← «حفظ وتفعيل». ${SNDX&&!SNDX.err?`<b>${SNDX.items.length}</b> صوت أصلي من B6O6 (مولّدة بالكامل لدينا — بدون مقاطع منسوخة)`:""}</p></div>
  <div class="snd-master"><label class="cc-sw"><input type="checkbox" data-sndf="on" ${c.on?"checked":""}><i></i></label><b>${c.on?"الأصوات مفعّلة":"الأصوات موقوفة"}</b>
   <span class="muted">🔉</span><input type="range" min="0" max="100" value="${c.vol}" data-sndf="vol" title="مستوى صوت المكتبة كلها في البث (لا يؤثر على المايك أو اللعبة)"><b>${c.vol}%</b>
   <button class="btn sm" data-snd="stopall" title="إيقاف كل الأصوات في البث">⏹ إيقاف الكل</button></div></div>
  ${sndHasPlayer()?"":`<div class="snd-warn">⚠️ لم تُضف «مشغل الأصوات» لطبقاتك بعد — الأصوات لا تصل للبث بدونه. <button class="btn sm pri" data-snd="addplayer">➕ أضفه الآن</button> <button class="btn sm" data-snd="tab" data-k="settings">كيف أربطه بـ OBS؟</button></div>`}`;
 let body="";
 if(U.tab==="used") body=sndUsedHTML(); else if(U.tab==="board") body=sndBoardHTML(); else if(U.tab==="settings") body=sndSettingsHTML();
 else { const L0=sndList(), Lv=L0.slice(0,U.n);
  const search=`<div class="snd-search"><input type="search" placeholder="🔎 ابحث عن صوت… (فولو، فوز، عود، كاش)" value="${esc(U.q)}" data-sndf="q"><span class="muted">${L0.length} صوت</span>${U.tab==="mine"||U.tab.startsWith("meme")?`<button class="btn pri" data-snd="upload">⬆️ رفع صوت</button>`:""}</div>`;
  const empty=U.tab.startsWith("meme")?`<div class="snd-empty"><b>${U.tab==="meme_sa"?"🇸🇦 الميمز السعودية":"🌍 الميمز العربية"}</b><p>لا توجد حالياً مقاطع ميمز مرخّصة لإعادة التوزيع داخل المنصة، لذلك لم نضع أصواتاً مولّدة ونسمّيها «ميمز».</p><p>ارفع مقاطع الميمز التي تملك حق استخدامها (تبقى خاصة لبثك)، ويمكنك مشاركتها مع الجميع بعد المراجعة البشرية. أصوات المجتمع المعتمدة في هذا القسم تظهر هنا.</p><button class="btn pri" data-snd="upload" data-cat="${U.tab}">⬆️ رفع ميم</button></div>`
   :U.tab==="mine"?`<div class="snd-empty"><b>🎵 أصواتي الخاصة</b><p>ارفع ملفاتك (MP3 · WAV · OGG · M4A) — تبقى خاصة بك وتعمل في بثك فوراً.</p><button class="btn pri" data-snd="upload">⬆️ رفع صوت</button></div>`
   :U.tab==="fav"?`<div class="snd-empty"><b>⭐ المفضلة فارغة</b><p>اضغط ☆ على أي صوت لإضافته هنا.</p></div>`:U.tab==="community"?`<div class="snd-empty">${S.sndComLoaded?"لا توجد أصوات مجتمع معتمدة بعد.":"⏳ جاري التحميل…"}</div>`
   :!SNDX?`<div class="snd-empty">⏳ جاري تحميل المكتبة…</div>`:SNDX.err?`<div class="snd-empty">تعذر تحميل المكتبة — تحقق من الاتصال وأعد المحاولة.</div>`:`<div class="snd-empty">لا نتائج.</div>`;
  body=search+(Lv.length?`<div class="snd-grid">${Lv.map(sndCard).join("")}</div>${L0.length>Lv.length?`<div class="row" style="justify-content:center;margin:12px"><button class="btn" data-snd="more">عرض المزيد (${L0.length-Lv.length})</button></div>`:""}`:empty) }
 return `<div class="card snd-page">${head}${tabs}<div id="snd-body">${body}</div></div>` }

/* ---------- 📌 الأصوات المستخدمة: كل الأحداث المرتبطة وتعديلها ---------- */
function sndUsedHTML(){ const c=SC();
 const quick=`<div class="snd-quick"><b>⚡ إعداد سريع بضغطة</b><span class="muted">ينشئ الربط بأصوات مقترحة من المكتبة — غيّرها متى شئت</span>
  <button class="btn sm" data-snd="preset" data-k="don">💵 مستويات الدونيشن (5$ ← 500$)</button><button class="btn sm" data-snd="preset" data-k="taps">👆 مراحل التكبيس (1K ← 50K)</button><button class="btn sm" data-snd="preset" data-k="gifts">🎁 هدايا TikTok (وردة/أحبني/أسد/يونيفرس)</button><button class="btn sm" data-snd="preset" data-k="basic">🔔 فولو + مشاركة + اشتراك</button></div>`;
 if(!c.rules.length) return quick+`<div class="snd-empty"><b>لا توجد أصوات مرتبطة بأحداث البث بعد</b><p>اختر أي صوت من المكتبة واضغط «استخدام الصوت»، أو استخدم الإعداد السريع.</p></div>`;
 const order=Object.keys(SND_EVENTS); const rules=[...c.rules].sort((a,b)=>order.indexOf(a.ev)-order.indexOf(b.ev)||((a.cond.min||a.cond.n||0)-(b.cond.min||b.cond.n||0)));
 return quick+`<div class="snd-rules">${rules.map(r=>`<div class="snd-rule ${r.on?"":"off"}" data-rid="${r.id}">
  <div class="snd-rh"><label class="cc-sw"><input type="checkbox" data-sndf="ron" data-rid="${r.id}" ${r.on?"checked":""}><i></i></label><b>${esc(sndRuleLabel(r))}</b>
   ${r.ev==="donation"?`<span class="muted">من</span><input type="number" min="0" step="1" value="${r.cond.min}" data-sndf="rmin" data-rid="${r.id}" class="inp snd-num"><select class="inp" data-sndf="rcur" data-rid="${r.id}">${["USD","SAR","AED","KWD","EUR","GBP"].map(x=>`<option ${x===r.cond.cur?"selected":""}>${x}</option>`).join("")}</select>`:""}
   ${r.ev==="taps"?`<input type="number" min="1" step="100" value="${r.cond.n}" data-sndf="rn" data-rid="${r.id}" class="inp snd-num"><span class="muted">تكبيسة</span>`:""}
   <select class="inp" data-sndf="rmode" data-rid="${r.id}" title="طريقة الاختيار عند وجود أكثر من صوت">${Object.entries(SND_MODES).map(([k,l])=>`<option value="${k}" ${r.mode===k?"selected":""}>${l}</option>`).join("")}</select>
   <span class="muted" title="أقل مدة بين صوتين لهذا الحدث (مفيد للفولو في الإكسبلور)">⏳</span><input type="number" min="0" max="600" value="${r.cool}" data-sndf="rcool" data-rid="${r.id}" class="inp snd-num" title="ثوانٍ"><span class="muted">ث</span>
   <span class="sp"></span><button class="btn sm" data-snd="rtest" data-rid="${r.id}" title="يشغّل في البث (تجربة)">📡 تجربة</button><button class="btn sm" data-snd="radd" data-rid="${r.id}">➕ صوت آخر</button><button class="btn sm ghost" data-snd="rdel" data-rid="${r.id}" title="إزالة الربط">🗑️</button></div>
  <div class="snd-rs">${r.sounds.map((s,i)=>sndRefRow(r,s,i)).join("")}</div></div>`).join("")}</div>` }
function sndRefRow(r,s,i){ const inf=sndInfo(s.src)||{name:s.src}, open=S.sndOpen===r.id+":"+i, k=`data-rid="${r.id}" data-i="${i}"`;
 return `<div class="snd-ref ${open?"open":""}"><div class="snd-refh"><button class="snd-play sm" data-snd="prev" data-s="${esc(s.src)}">${S.sndPlaying===s.src?"⏹":"▶"}</button><b>${esc(inf.name)}</b><span class="muted">${sndFmtDur(inf.dur)} · ${s.vol}%</span>
  <span class="sp"></span><button class="btn sm ghost" data-snd="ropen" ${k}>⚙️ إعدادات</button><button class="btn sm ghost" data-snd="rrep" ${k} title="استبدال الصوت">🔁</button><button class="btn sm ghost" data-snd="rrm" ${k} title="إزالة من الحدث">✕</button></div>
  ${open?`<div class="snd-set">
   <label>مستوى الصوت <b>${s.vol}%</b><input type="range" min="0" max="100" value="${s.vol}" data-sndf="s.vol" ${k}></label>
   <label>بداية المقطع (ث)<input type="number" min="0" step=".1" value="${s.start}" data-sndf="s.start" ${k}></label><label>نهاية المقطع (ث، 0 = حتى النهاية)<input type="number" min="0" step=".1" value="${s.end}" data-sndf="s.end" ${k}></label>
   <label>عدد مرات التشغيل<input type="number" min="1" max="20" value="${s.times}" data-sndf="s.times" ${k}></label><label>الانتظار بين المرات (ث)<input type="number" min="0" max="30" step=".5" value="${s.gap}" data-sndf="s.gap" ${k}></label>
   <label>Fade In (ث)<input type="number" min="0" max="10" step=".1" value="${s.fin}" data-sndf="s.fin" ${k}></label><label>Fade Out (ث)<input type="number" min="0" max="10" step=".1" value="${s.fout}" data-sndf="s.fout" ${k}></label>
   <label>السرعة <b>${s.rate}×</b><input type="range" min=".5" max="2" step=".05" value="${s.rate}" data-sndf="s.rate" ${k}></label>
   <div class="row"><button class="btn sm" data-snd="rnow" ${k}>📡 تجربة بهذه الإعدادات</button></div></div>`:""}</div>` }

/* ---------- 🎛️ لوحة التشغيل السريع ---------- */
function sndBoardHTML(){ const c=SC(), solo=document.body.classList.contains("sb-only");
 return `<div class="snd-board-bar"><b>🎛️ لوحة التشغيل السريع</b><span class="muted">اضغط المربع ← يشتغل الصوت في البث مباشرة · اسحب لإعادة الترتيب</span><span class="sp"></span>
  <button class="btn sm" data-snd="stop">⏹ إيقاف الحالي</button><button class="btn sm" data-snd="stopall">⏹⏹ إيقاف الكل</button>${solo?"":`<button class="btn sm" data-snd="popout" title="نافذة مستقلة / Custom Browser Dock في OBS">🪟 نافذة مستقلة</button>`}</div>
 ${c.board.length?`<div class="snd-board">${c.board.map((b,i)=>{ const inf=sndInfo(b.s.src)||{name:"؟"}; return `<div class="snd-pad" draggable="true" data-snd="pad" data-bid="${b.id}" data-i="${i}" style="--pc:${b.color||SND_COLORS[i%SND_COLORS.length]}">
   <span class="snd-pi">${esc(b.icon||"🔊")}</span><b>${esc(b.label||inf.name)}</b>${b.key?`<kbd>${esc(b.key.toUpperCase())}</kbd>`:""}<button class="snd-pe" data-snd="padedit" data-bid="${b.id}" title="تعديل">✎</button></div>` }).join("")}</div>`
  :`<div class="snd-empty"><b>اللوحة فارغة</b><p>اختر صوتاً من المكتبة ← «استخدام الصوت» ← «تشغيل يدوي» ليظهر هنا كزر.</p></div>`}
 ${S.sndPadEdit?sndPadEditHTML():""}
 <p class="muted" style="margin-top:10px">⌨️ الاختصارات تعمل عندما تكون هذه الصفحة أو النافذة المستقلة مفتوحة. Stream Deck: لا يوجد تكامل مباشر حالياً — يمكنك ربط زر Stream Deck بنفس اختصار الكيبورد (Hotkey) والنافذة مفتوحة.</p>` }
function sndPadEditHTML(){ const c=SC(), b=c.board.find(x=>x.id===S.sndPadEdit); if(!b) return ""; const k=`data-bid="${b.id}"`;
 return `<div class="snd-padedit"><b>تعديل الزر</b><label>الاسم<input value="${esc(b.label)}" maxlength="30" data-sndf="b.label" ${k}></label>
  <label>الأيقونة<div class="snd-icons">${SND_ICONS.map(ic=>`<button class="${b.icon===ic?"on":""}" data-snd="padicon" data-ic="${ic}" ${k}>${ic}</button>`).join("")}</div></label>
  <label>اللون<div class="snd-icons">${SND_COLORS.map(co=>`<button class="sw ${b.color===co?"on":""}" style="background:${co}" data-snd="padcolor" data-co="${co}" ${k}></button>`).join("")}</div></label>
  <label>اختصار الكيبورد (حرف أو رقم)<input value="${esc(b.key)}" maxlength="1" data-sndf="b.key" ${k} style="width:60px;text-align:center"></label>
  <label>مستوى الصوت <b>${b.s.vol}%</b><input type="range" min="0" max="100" value="${b.s.vol}" data-sndf="b.vol" ${k}></label>
  <div class="row"><button class="btn sm" data-snd="padrep" ${k}>🔁 استبدال الصوت</button><button class="btn sm ghost" data-snd="paddel" ${k}>🗑️ حذف الزر</button><span class="sp"></span><button class="btn sm pri" data-snd="padclose">تم</button></div></div>` }

/* ---------- ⚙️ الإعدادات ورابط OBS ---------- */
function sndSettingsHTML(){ const c=SC(), pl=(L().widgets||[]).find(w=>w.type==="sndplayer");
 const link=pl?overlayURL(L(),pl.id):""; const feed=(S.sndFeed||[]).slice(0,8);
 return `<div class="snd-cols"><div class="snd-box"><h3>📡 وصول الصوت للبث (OBS و TikTok LIVE Studio)</h3>
  ${pl?`<p>✅ «مشغل الأصوات» موجود في طبقة «${esc(L().name||"")}». إذا كنت تضيف رابط الطبقة كاملة في OBS فالأصوات تعمل فيه تلقائياً.</p>
   <p>أو أضف <b>رابط الأصوات المستقل</b> كمصدر منفصل (للتحكم بمستواه في مكسر OBS):</p><div class="row"><input readonly value="${esc(link)}" style="flex:1;direction:ltr"><button class="btn pri" data-copylink="${esc(link)}">نسخ</button></div>`
   :`<p>لم يُضف «مشغل الأصوات» بعد.</p><button class="btn pri" data-snd="addplayer">➕ إضافة مشغل الأصوات لطبقتي</button>`}
  <ol class="snd-steps"><li><b>OBS:</b> Sources ➕ ← <b>Browser</b> ← ألصق الرابط ← العرض 1080 والارتفاع 1920 ← فعّل <b>Control audio via OBS</b> (التحكم بالصوت عبر OBS) ليظهر في المكسر.</li>
   <li><b>TikTok LIVE Studio:</b> إضافة مصدر ← <b>Link</b> (رابط) ← ألصق نفس الرابط. الصوت يخرج مع البث.</li>
   <li>أضف الرابط <b>مرة واحدة فقط</b> في المشهد — رابطان فيهما مشغل الأصوات = تشغيل مضاعف.</li>
   <li>في المتصفح العادي قد يظهر زر «🔊 اضغط لتفعيل الأصوات» (قيد التشغيل التلقائي)؛ في OBS لا يظهر.</li></ol></div>
 <div class="snd-box"><h3>🎚️ التحكم العام</h3>
  <label>مستوى صوت المكتبة كلها <b>${c.vol}%</b><input type="range" min="0" max="100" value="${c.vol}" data-sndf="vol"></label>
  <label>أقصى عدد أصوات في الانتظار<input type="number" min="3" max="50" value="${c.maxQ}" data-sndf="maxQ" class="inp snd-num"></label>
  <label>عند الضغط العالي (وضع الإكسبلور)<select class="inp" data-sndf="explore"><option value="merge" ${c.explore==="merge"?"selected":""}>تجميع الأصوات الخفيفة (فولو/دخول/مشاركة) — موصى به</option><option value="all" ${c.explore==="all"?"selected":""}>تشغيل كل صوت (قد يكون مزعجاً)</option></select></label>
  <p class="muted">كل الأحداث تُحتسب دائماً — التجميع يختصر الصوت فقط. أصوات الدعم لا تُختصر أبداً، والأولوية لها في الطابور.</p>
  <h3>🕘 آخر الأصوات المُرسلة للبث</h3><div id="snd-feed">${sndFeedHTML(feed)}</div></div></div>` }
function sndFeedHTML(feed){ return feed.length?feed.map(x=>{ const i=sndInfo(x.s&&x.s.src)||{name:"؟"}; return `<div class="snd-fd">${(SND_EVENTS[x.ev]||{}).icon||"🔊"} <b>${esc(i.name)}</b>${x.merged?` <span class="muted">(+${x.merged} مجمّعة)</span>`:""}${x.test?` <span class="muted">تجربة</span>`:""}<span class="muted">${new Date(x.at).toLocaleTimeString("ar")}</span></div>` }).join(""):`<p class="muted">لا شيء بعد.</p>` }
function sndFeedRefresh(){ const f=document.getElementById("snd-feed"); if(f) f.innerHTML=sndFeedHTML((S.sndFeed||[]).slice(0,8)) }

/* ---------- «متى تريد تشغيل هذا الصوت؟» ---------- */
function sndUseModal(src,replace){ const inf=sndInfo(src)||{name:src}; S.sndUse={src,ev:"",cond:{},replace};
 const m=modal(`<div class="snd-modal"><h3>متى تريد تشغيل هذا الصوت؟</h3><p class="muted">🔊 ${esc(inf.name)}</p><div id="snd-evs"></div><div class="row" style="margin-top:12px"><span class="sp"></span><button class="btn" data-close>إلغاء</button><button class="btn pri" data-snd="usesave">✅ حفظ وتفعيل</button></div></div>`);
 m.classList.add("snd-m"); m.addEventListener("click",e=>{ const b=e.target.closest("[data-snd]"); if(b&&sndClick(b,e)) e.stopPropagation() }); m.addEventListener("input",e=>sndInput(e.target,e)); m.addEventListener("change",e=>sndInput(e.target,e)); sndUseRender(); return m }
function sndUseRender(){ const box=document.getElementById("snd-evs"), U=S.sndUse; if(!box||!U) return; const c=U.cond;
 const gifts=saCatalog().slice(0,80);
 const field=k=>{ if(U.ev!==k) return "";
  if(k==="gift") return `<div class="snd-gifts"><button class="snd-gift ${c.any?"on":""}" data-snd="ugift" data-any="1">🎁<b>أي هدية أخرى</b></button>${gifts.map(g=>`<button class="snd-gift ${!c.any&&String(c.giftId)===String(g.id)?"on":""}" data-snd="ugift" data-gid="${esc(g.id)}" data-gname="${esc(g.name)}" data-gimg="${esc(g.img||"")}">${g.img?`<img src="${esc(g.img)}" alt="">`:giftIcon(g,"snd-gi")}<b>${esc(g.name)}</b><span>${g.coins}🪙</span></button>`).join("")}</div>${(S.catalog||[]).length?"":`<p class="muted">القائمة الكاملة لهدايا بثك تظهر بعد الاتصال بـ TikTok.</p>`}`;
  if(k==="donation") return `<div class="row"><span>عند دونيشن من</span><input type="number" min="0" value="${c.min??5}" data-sndf="u.min" class="inp snd-num"><select class="inp" data-sndf="u.cur">${["USD","SAR","AED","KWD","EUR","GBP"].map(x=>`<option ${x===(c.cur||"USD")?"selected":""}>${x}</option>`).join("")}</select><span class="muted">فأكثر</span></div><div class="row">${SND_DON_PRESETS.map(n=>`<button class="btn sm ${+c.min===n?"pri":""}" data-snd="umin" data-n="${n}">$${n}</button>`).join("")}</div><p class="muted">الدونيشن المالي فقط — هدايا TikTok (كوينز) لها قسم «هدية محددة». لكل مبلغ صوت مختلف: يُختار أعلى مستوى يصل له المبلغ.</p>`;
  if(k==="taps") return `<div class="row"><span>عند الوصول إلى</span><input type="number" min="1" step="100" value="${c.n??1000}" data-sndf="u.n" class="inp snd-num"><span>تكبيسة</span></div><div class="row">${SND_TAP_PRESETS.map(n=>`<button class="btn sm ${+c.n===n?"pri":""}" data-snd="un" data-n="${n}">${fmt(n)}</button>`).join("")}</div><p class="muted">مرة واحدة لكل بث — لا تُعاد أصوات مراحل البث السابق.</p>`;
  if(k==="subathon") return `<div class="row">${[["add","زيادة الوقت"],["sub","نقص الوقت"],["any","أي تغيير"]].map(([v,l])=>`<button class="btn sm ${(c.dir||"add")===v?"pri":""}" data-snd="udir" data-v="${v}">${l}</button>`).join("")}</div>`;
  if(k==="goal") return `<div class="row">${[["any","أي هدف"],["likes","هدف الإعجابات"],["subathon","هدف السبثون"]].map(([v,l])=>`<button class="btn sm ${(c.kind||"any")===v?"pri":""}" data-snd="ugoal" data-v="${v}">${l}</button>`).join("")}</div>`;
  return "" };
 box.innerHTML=`<table class="snd-evt"><tbody>${Object.entries(SND_EVENTS).map(([k,e])=>`<tr class="${U.ev===k?"on":""}" data-snd="uev" data-k="${k}"><td>${e.icon} <b>${esc(e.label)}</b></td><td class="muted">${esc(e.hint)}</td></tr>${U.ev===k&&field(k)?`<tr class="sub"><td colspan="2">${field(k)}</td></tr>`:""}`).join("")}</tbody></table>` }
function sndUseSave(){ const U=S.sndUse, c=SC(); if(!U||!U.ev) return toast("اختر الحدث أولاً"), false; const inf=sndInfo(U.src)||{};
 const ref={src:U.src,vol:inf.defVol||100,start:inf.start||0,end:inf.end||0};
 if(U.ev==="manual"){ c.board.push(sndBoardItem({s:ref,label:(inf.name||"").split("—")[0].trim().slice(0,30),icon:"🔊",color:SND_COLORS[c.board.length%SND_COLORS.length]})); sndBump(U.src); sndEnsurePlayer(); sndSave("✅ أُضيف للوحة التشغيل السريع"); return true }
 const cond={...U.cond}; if(U.ev==="gift"&&!cond.any&&!cond.giftId&&!cond.name) return toast("اختر الهدية"), false; if(U.ev==="donation"){ cond.min=+cond.min||5; cond.cur=cond.cur||"USD" } if(U.ev==="taps") cond.n=+cond.n||1000;
 const same=r=>r.ev===U.ev&&(U.ev==="gift"?(!!r.cond.any===!!cond.any&&(cond.any||(r.cond.giftId?String(r.cond.giftId)===String(cond.giftId):lc(r.cond.name)===lc(cond.name)))):U.ev==="donation"?r.cond.min===cond.min&&r.cond.cur===cond.cur:U.ev==="taps"?r.cond.n===cond.n:U.ev==="subathon"?r.cond.dir===(cond.dir||"add"):U.ev==="goal"?r.cond.kind===(cond.kind||"any"):true);
 let r=c.rules.find(same);
 if(U.replace){ const [rid,i]=U.replace.split(":"), rr=c.rules.find(x=>x.id===rid); if(rr&&rr.sounds[+i]){ rr.sounds[+i]={...rr.sounds[+i],src:U.src}; sndSave("🔁 تم استبدال الصوت"); return true } }
 if(r){ if(r.sounds.some(s=>s.src===U.src)) return toast("هذا الصوت مرتبط بهذا الحدث مسبقاً"), true; if(r.sounds.length>=SND_LIMITS.sounds) return toast(`الحد ${SND_LIMITS.sounds} أصوات للحدث الواحد`), false; r.sounds.push(sndRef(ref)); r.on=true }
 else c.rules.push(sndRule({ev:U.ev,cond,sounds:[ref],mode:"random"}));
 sndBump(U.src); sndEnsurePlayer(); sndSave("✅ تم الحفظ والتفعيل — "+(SND_EVENTS[U.ev]||{}).label); return true }
function sndEnsurePlayer(){ if(sndHasPlayer()) return; try{ window.__arsh.addWidget("sndplayer",{}); save(); pushLayout(); toast("➕ أضفنا «مشغل الأصوات» لطبقتك — الصوت يصل لرابط OBS الحالي") }catch(e){} }
const SND_PRESETS={
 don:()=>[[5,"tier-5"],[20,"coin-drop-01"],[50,"tier-50"],[100,"tier-100"],[200,"tier-200"],[500,"tier-500"]].map(([n,id])=>({ev:"donation",cond:{min:n,cur:"USD"},sounds:[{src:"lib:"+id}]})),
 taps:()=>[1000,2000,5000,10000,50000].map(n=>({ev:"taps",cond:{n},sounds:[{src:"lib:taps-"+n}]})),
 gifts:()=>[{ev:"gift",cond:{name:"Rose",giftId:"5655"},sounds:[{src:"lib:gift-01"}]},{ev:"love",sounds:[{src:"lib:arab-alert-02"}]},{ev:"gift",cond:{name:"Lion",giftId:"6369"},sounds:[{src:"lib:crown-01"}]},{ev:"gift",cond:{name:"TikTok Universe",giftId:"7312"},sounds:[{src:"lib:tier-500"}]}],
 basic:()=>[{ev:"follow",sounds:[{src:"lib:follow-01"},{src:"lib:follow-02"},{src:"lib:follow-03"}],mode:"norepeat",cool:2},{ev:"share",sounds:[{src:"lib:share-11"}]},{ev:"sub",sounds:[{src:"lib:sub-11"}]}] };
function sndPreset(k){ const c=SC(); let n=0; for(const x of SND_PRESETS[k]()){ const ok=x.sounds.filter(s=>!SNDX||SNDX.by[s.src]); if(!ok.length) continue; const r=sndRule({...x,sounds:ok});
  const dup=c.rules.find(y=>y.ev===r.ev&&JSON.stringify(y.cond)===JSON.stringify(r.cond)); if(dup) continue; c.rules.push(r); n++ }
 sndEnsurePlayer(); sndSave(n?`✅ أُضيف ${n} ربط — جرّبها من «📡 تجربة»`:"موجودة مسبقاً") }

/* ---------- المعاينة (لك فقط) ---------- */
function sndPreview(src,ref){ const a=S.sndAudio||(S.sndAudio=new Audio()); if(S.sndPlaying===src&&!a.paused){ a.pause(); S.sndPlaying=null; sndMarkPlaying(); return }
 const url=sndPrevUrl(src); if(!url) return toast("تعذر تشغيل هذا الصوت"); a.pause(); a.src=url; a.currentTime=0; a.volume=Math.min(1,((ref&&ref.vol)||100)/100); a.playbackRate=(ref&&ref.rate)||1; if(ref&&ref.start) try{ a.currentTime=ref.start }catch(e){}
 S.sndPlaying=src; sndMarkPlaying(); a.onended=()=>{ S.sndPlaying=null; sndMarkPlaying() }; a.onerror=()=>{ S.sndPlaying=null; sndMarkPlaying(); toast("⚠️ الملف لا يعمل") }; a.play().catch(()=>{ S.sndPlaying=null; sndMarkPlaying() }) }
function sndMarkPlaying(){ document.querySelectorAll(".snd-card").forEach(el=>{ const on=el.dataset.sid===S.sndPlaying; el.classList.toggle("playing",on); const b=el.querySelector(".snd-play"); if(b) b.textContent=on?"⏹":"▶" });
 document.querySelectorAll(".snd-ref .snd-play").forEach(b=>{ b.textContent=b.dataset.s===S.sndPlaying?"⏹":"▶" }) }
function sndNow(ref){ clockOp("sounds","play",{s:sndRef(ref)}); sndBump(ref.src||ref); if(!sndHasPlayer()) toast("⚠️ أضف «مشغل الأصوات» لطبقتك ليصل الصوت للبث"); else toast("📡 يشتغل في البث") }

/* ---------- الرفع: ملفاتك الخاصة (MP3 · WAV · OGG · M4A) ---------- */
function sndUploadModal(cat){ const m=modal(`<div class="snd-modal"><h3>⬆️ رفع صوت خاص</h3>
  <label>الملف<input type="file" accept="audio/mpeg,audio/wav,audio/x-wav,audio/ogg,audio/mp4,audio/x-m4a,audio/aac,.mp3,.wav,.ogg,.m4a" id="snd-file"></label>
  <label>اسم الصوت<input id="snd-name" maxlength="60" placeholder="مثال: ضحكة أبو فهد"></label>
  <label>التصنيف<select id="snd-cat">${Object.entries(SND_UCATS).map(([k,l])=>`<option value="${k}" ${k===(cat||"mine")?"selected":""}>${l}</option>`).join("")}</select></label>
  <div id="snd-trim" class="snd-trim"></div><div id="snd-up-st" class="muted"></div>
  <p class="muted">يبقى الصوت <b>خاصاً</b> لبثك. يُفحص الملف من محتواه الفعلي (لا من اسمه) قبل الحفظ.</p>
  <div class="row"><span class="sp"></span><button class="btn" data-close>إلغاء</button><button class="btn pri" id="snd-up-go">⬆️ رفع وحفظ</button></div></div>`);
 const inp=m.querySelector("#snd-file"), st=m.querySelector("#snd-up-st"); let peaks=[], dur=0, ab=null;
 inp.onchange=async()=>{ const f=inp.files[0]; if(!f) return; if(!m.querySelector("#snd-name").value) m.querySelector("#snd-name").value=f.name.replace(/\.[a-z0-9]+$/i,"").slice(0,60);
  st.textContent="⏳ قراءة الملف…"; try{ const AC=window.AudioContext||window.webkitAudioContext; const ctx=new AC(); ab=await ctx.decodeAudioData(await f.arrayBuffer()); dur=ab.duration; const ch=ab.getChannelData(0), seg=Math.floor(ch.length/48)||1; let mx=0; peaks=[];
   for(let i=0;i<48;i++){ let p=0; for(let j=i*seg;j<Math.min(ch.length,(i+1)*seg);j+=8) p=Math.max(p,Math.abs(ch[j])); peaks.push(p); mx=Math.max(mx,p) } peaks=peaks.map(p=>mx?Math.round(p/mx*100)/100:0); ctx.close();
   m.querySelector("#snd-trim").innerHTML=`${sndWave(peaks,"mine",dur)}<div class="row"><label>قص — البداية (ث)<input type="number" id="snd-ts" min="0" step=".1" value="0" class="inp snd-num"></label><label>النهاية (ث)<input type="number" id="snd-te" min="0" step=".1" value="${dur.toFixed(1)}" class="inp snd-num"></label><label>المستوى %<input type="number" id="snd-tv" min="0" max="100" value="100" class="inp snd-num"></label><button class="btn sm" id="snd-tp">▶ معاينة</button></div>`;
   m.querySelector("#snd-tp").onclick=()=>{ const a=S.sndAudio||(S.sndAudio=new Audio()); a.src=URL.createObjectURL(f); a.currentTime=+m.querySelector("#snd-ts").value||0; a.volume=(+m.querySelector("#snd-tv").value||100)/100; a.play(); const e=+m.querySelector("#snd-te").value; if(e>0) setTimeout(()=>a.pause(),Math.max(100,(e-a.currentTime)*1000)) };
   st.textContent=`المدة ${sndFmtDur(dur)}` }catch(e){ st.textContent="⚠️ تعذرت قراءة الملف — تأكد أنه ملف صوتي سليم (MP3 · WAV · OGG · M4A)"; ab=null } };
 m.querySelector("#snd-up-go").onclick=async()=>{ const f=inp.files[0]; if(!f) return toast("اختر ملفاً"); if(!ab) return toast("الملف غير صالح");
  if(!CFG){ return toast("رفع الملفات يعمل داخل المنصة (بعد تسجيل الدخول)") }
  st.textContent="⏳ جاري الرفع… 0%"; const j=await alXhr(f,"audio",p=>st.textContent=`⏳ جاري الرفع… ${p}%`);
  if(!j||!j.ok){ st.textContent="⚠️ "+((j&&j.message)||"تعذر رفع الملف"); return }
  const c=SC(); const ts=+m.querySelector("#snd-ts").value||0, te=+m.querySelector("#snd-te").value||0;
  c.user.unshift(sndUserItem({id:j.id,name:m.querySelector("#snd-name").value,cat:m.querySelector("#snd-cat").value,dur:(j.meta&&j.meta.duration)||dur,peaks,start:ts,end:te>=dur-.05?0:te,vol:+m.querySelector("#snd-tv").value||100}));
  sndSave("✅ تم حفظ الصوت في «أصواتي الخاصة»"); m.remove(); SU().tab=m.querySelector("#snd-cat").value.startsWith("meme")?m.querySelector("#snd-cat").value:"mine"; renderPage(true) } }
/** مشاركة صوت خاص في المكتبة العامة: تأكيد الحقوق ← مراجعة بشرية (لا اعتماد تلقائي) */
async function sndShare(id){ const c=SC(), u=c.user.find(x=>x.id===id); if(!u) return;
 if(!confirm("مشاركة «"+u.name+"» مع جميع صناع المحتوى؟\n\n• أؤكد أنني أملك حق استخدام هذا الصوت وإعادة توزيعه.\n• الصوت خالٍ من الألفاظ البذيئة والسب والإيحاءات والإساءة والعنصرية والتنمر.\n\nسيُراجع بشرياً قبل ظهوره (لا يُنشر تلقائياً).")) return;
 const r=await fetch("/api/alerts",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({name:u.name,description:"صوت من مكتبة الأصوات",kind:"audio",event:"sound",durationSec:Math.max(1,Math.min(60,Math.round(u.dur||3))),category:SND_SHARE_STYLE[u.cat]||"minimal",tags:["snd:"+u.cat,"صوت"],visibility:"public",rightsConfirmed:true,audioId:id,meta:{duration:u.dur}})}).then(r=>r.json()).catch(()=>null);
 if(!r||r.error){ toast("⚠️ "+((r&&(r.message||(r.errors||[]).join("، ")))||"تعذرت المشاركة")); return } u.shared="pending"; u.alertId=(r.alert&&r.alert.id)||r.id||""; sndSave("📨 أُرسل للمراجعة — يظهر للجميع بعد الموافقة") }
function sndLoadCommunity(){ if(S.sndComBusy) return; S.sndComBusy=true; if(!CFG){ S.sndCom=[]; S.sndComLoaded=true; S.sndComBusy=false; return }
 fetch("/api/alerts?section=all&kind=audio&event=sound",{cache:"no-store"}).then(r=>r.json()).then(d=>{ S.sndCom=(d.items||[]).filter(a=>a.event==="sound"); S.sndComSeen=S.sndComSeen||{}; for(const a of S.sndCom) S.sndComSeen["al:"+a.id]=a; S.sndComLoaded=true; S.sndComBusy=false; if(S.page==="sounds") renderPage(true) }).catch(()=>{ S.sndComLoaded=true; S.sndComBusy=false }) }

/* ---------- الأحداث ---------- */
function sndClick(b,e){ const d=b.dataset, a=d.snd, c=SC(), U=SU(); if(!a) return false;
 if(a==="tab"){ U.tab=d.k; U.n=60; S.sndPadEdit=null; renderPage(true); return true }
 if(a==="more"){ U.n+=60; renderPage(true); return true }
 if(a==="prev"){ sndPreview(d.s,null); return true }
 if(a==="fav"){ const i=c.fav.indexOf(d.s); if(i>=0) c.fav.splice(i,1); else c.fav.unshift(d.s); sndSave(i>=0?"أُزيل من المفضلة":"⭐ أُضيف للمفضلة"); renderPage(true); return true }
 if(a==="use"){ sndUseModal(d.s); return true }
 if(a==="now"){ const i=sndInfo(d.s)||{}; sndNow({src:d.s,start:i.start||0,end:i.end||0,vol:i.defVol||100}); return true }
 if(a==="stop"||a==="stopall"){ clockOp("sounds",a); if(S.sndAudio) S.sndAudio.pause(); S.sndPlaying=null; sndMarkPlaying(); toast(a==="stopall"?"⏹ أُوقفت كل الأصوات":"⏹ أُوقف الصوت الحالي"); return true }
 if(a==="addplayer"){ sndEnsurePlayer(); renderPage(true); return true }
 if(a==="upload"){ sndUploadModal(d.cat||(U.tab.startsWith("meme")?U.tab:"mine")); return true }
 if(a==="share"){ sndShare(d.id); return true }
 if(a==="udel"){ const u=c.user.find(x=>x.id===d.id); if(u&&confirm("حذف «"+u.name+"» من أصواتك؟ (يُزال من الأحداث المرتبطة)")){ c.user=c.user.filter(x=>x.id!==d.id); for(const r of c.rules) r.sounds=r.sounds.filter(s=>s.src!=="up:"+d.id); c.rules=c.rules.filter(r=>r.sounds.length); c.board=c.board.filter(x=>x.s.src!=="up:"+d.id); sndSave("🗑️ حُذف"); renderPage(true) } return true }
 if(a==="report"){ const id=d.s.slice(3), why=prompt("سبب الإبلاغ (ألفاظ بذيئة، إساءة، محتوى غير لائق…)"); if(why==null) return true;
  fetch(`/api/alerts/${id}/act`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({act:"report",reason:String(why).slice(0,300)})}).then(r=>r.json()).then(j=>toast(j&&!j.error?"🚩 وصل البلاغ للإدارة — شكراً":"⚠️ "+((j&&j.message)||"تعذر الإبلاغ"))).catch(()=>toast("تعذر الإبلاغ")); return true }
 // نافذة «متى تريد تشغيل هذا الصوت؟»
 const UU=S.sndUse; if(UU){
  if(a==="uev"){ UU.ev=d.k; UU.cond=d.k==="donation"?{min:5,cur:"USD"}:d.k==="taps"?{n:1000}:d.k==="subathon"?{dir:"add"}:d.k==="goal"?{kind:"any"}:{}; sndUseRender(); return true }
  if(a==="ugift"){ UU.cond=d.any?{any:true}:{giftId:d.gid,name:d.gname,image:d.gimg}; sndUseRender(); return true }
  if(a==="umin"){ UU.cond.min=+d.n; sndUseRender(); return true } if(a==="un"){ UU.cond.n=+d.n; sndUseRender(); return true }
  if(a==="udir"){ UU.cond.dir=d.v; sndUseRender(); return true } if(a==="ugoal"){ UU.cond.kind=d.v; sndUseRender(); return true }
  if(a==="usesave"){ if(sndUseSave()){ const m=b.closest(".modal"); if(m) m.remove(); S.sndUse=null; renderPage(true) } return true } }
 // الأصوات المستخدمة
 const r=d.rid&&c.rules.find(x=>x.id===d.rid);
 if(a==="rtest"&&r){ clockOp("sounds","test",{ruleId:r.id}); toast("📡 تجربة في البث"); return true }
 if(a==="radd"&&r){ U.tab="all"; S.sndAddTo=r.id; toast("اختر صوتاً واضغط «استخدام الصوت» ثم نفس الحدث"); renderPage(true); return true }
 if(a==="rdel"&&r){ if(confirm("إزالة ربط «"+sndRuleLabel(r)+"»؟")){ c.rules=c.rules.filter(x=>x!==r); sndSave("🗑️ أُزيل الربط"); renderPage(true) } return true }
 if(a==="ropen"){ const k=d.rid+":"+d.i; S.sndOpen=S.sndOpen===k?null:k; renderPage(true); return true }
 if(a==="rrm"&&r){ r.sounds.splice(+d.i,1); if(!r.sounds.length) c.rules=c.rules.filter(x=>x!==r); sndSave("✕ أُزيل الصوت من الحدث"); renderPage(true); return true }
 if(a==="rrep"&&r){ const s=r.sounds[+d.i]; S.sndReplace=d.rid+":"+d.i; U.tab="all"; toast("اختر الصوت البديل ← «استخدام الصوت» ← نفس الحدث"); renderPage(true); return true }
 if(a==="rnow"&&r){ sndNow(r.sounds[+d.i]); return true }
 if(a==="preset"){ sndPreset(d.k); renderPage(true); return true }
 // لوحة التشغيل
 if(a==="pad"){ if(e&&e.target.closest(".snd-pe")) return false; const bb=c.board.find(x=>x.id===d.bid); if(bb){ sndNow(bb.s); b.classList.add("hit"); setTimeout(()=>b.classList.remove("hit"),300) } return true }
 if(a==="padedit"){ S.sndPadEdit=d.bid; renderPage(true); return true } if(a==="padclose"){ S.sndPadEdit=null; renderPage(true); return true }
 const bb=d.bid&&c.board.find(x=>x.id===d.bid);
 if(a==="padicon"&&bb){ bb.icon=d.ic; sndSave(); renderPage(true); return true } if(a==="padcolor"&&bb){ bb.color=d.co; sndSave(); renderPage(true); return true }
 if(a==="paddel"&&bb){ c.board=c.board.filter(x=>x!==bb); S.sndPadEdit=null; sndSave("🗑️ حُذف الزر"); renderPage(true); return true }
 if(a==="padrep"&&bb){ S.sndPadRep=bb.id; U.tab="all"; S.sndPadEdit=null; toast("اختر الصوت البديل ← «استخدام الصوت» ← «تشغيل يدوي»"); renderPage(true); return true }
 if(a==="popout"){ const u=location.href.split("#")[0]+"#sb"; window.open(u,"b6o6sb","width=760,height=620"); toast("للـ OBS Dock: انسخ رابط النافذة إلى Docks ← Custom Browser Docks"); return true }
 return false }
function sndInput(t,e){ const f=t.dataset&&t.dataset.sndf; if(!f) return false; const c=SC(), U=SU(), live=e.type==="input";
 if(f==="q"){ if(!live) return true; U.q=t.value; U.n=60; clearTimeout(sndInput.qt); sndInput.qt=setTimeout(()=>{ renderPage(true); const i=document.querySelector('[data-sndf="q"]'); if(i){ i.focus(); i.setSelectionRange(i.value.length,i.value.length) } },200); return true }
 if(f==="on"){ c.on=t.checked; sndSave(c.on?"🔊 الأصوات مفعّلة":"🔇 الأصوات موقوفة"); renderPage(true); return true }
 if(f==="vol"){ c.vol=+t.value; const lb=t.nextElementSibling; if(lb&&lb.tagName==="B") lb.textContent=c.vol+"%"; if(!live) sndSave(); return true }
 if(f==="maxQ"||f==="explore"){ if(live&&f==="maxQ") return true; c[f]=f==="maxQ"?+t.value:t.value; sndSave(); return true }
 if(f.startsWith("u.")){ const U2=S.sndUse; if(!U2) return true; const k=f.slice(2); U2.cond[k]=k==="cur"?t.value:+t.value; return true }
 const r=t.dataset.rid&&c.rules.find(x=>x.id===t.dataset.rid);
 if(r&&f==="ron"){ r.on=t.checked; sndSave(); renderPage(true); return true }
 if(r&&(f==="rmin"||f==="rn"||f==="rcool"||f==="rcur"||f==="rmode")){ if(live&&t.tagName==="INPUT") return true; if(f==="rmin") r.cond.min=Math.max(0,+t.value||0); if(f==="rn") r.cond.n=Math.max(1,+t.value||1); if(f==="rcool") r.cool=Math.max(0,+t.value||0); if(f==="rcur") r.cond.cur=t.value; if(f==="rmode") r.mode=t.value; sndSave(); return true }
 if(r&&f.startsWith("s.")){ const s=r.sounds[+t.dataset.i]; if(!s) return true; const k=f.slice(2); s[k]=+t.value; if(t.type==="range"){ const lb=t.parentElement.querySelector("b"); if(lb) lb.textContent=k==="rate"?s[k]+"×":s[k]+"%" } if(!live||t.type!=="range") { r.sounds[+t.dataset.i]=sndRef(s); sndSave() } return true }
 const b=t.dataset.bid&&c.board.find(x=>x.id===t.dataset.bid);
 if(b){ if(f==="b.label"){ b.label=t.value.slice(0,30); if(!live) sndSave() } if(f==="b.key"){ b.key=lc(t.value).replace(/[^a-z0-9]/g,"").slice(0,1); t.value=b.key; if(b.key&&c.board.some(x=>x!==b&&x.key===b.key)) toast("⚠️ هذا الاختصار مستخدم لزر آخر"); sndSave() } if(f==="b.vol"){ b.s.vol=+t.value; if(!live) sndSave() } return true }
 return false }
function sndMount(){ // سحب وإفلات أزرار لوحة التشغيل + «أصواتي»: أزرار المشاركة والحذف
 const box=document.querySelector(".snd-board"); if(box){ let from=null; box.querySelectorAll(".snd-pad").forEach(p=>{ p.ondragstart=()=>{ from=+p.dataset.i; p.classList.add("drag") }; p.ondragend=()=>p.classList.remove("drag"); p.ondragover=e=>e.preventDefault();
  p.ondrop=e=>{ e.preventDefault(); const to=+p.dataset.i; if(from==null||from===to) return; const c=SC(), [x]=c.board.splice(from,1); c.board.splice(to,0,x); sndSave(); renderPage(true) } }) }
 if(SU().tab==="mine") document.querySelectorAll('.snd-card[data-sid^="up:"]').forEach(el=>{ const id=el.dataset.sid.slice(3), u=SC().user.find(x=>x.id===id); if(!u) return; const row=document.createElement("div"); row.className="snd-own";
  row.innerHTML=u.shared==="pending"?`<span class="muted">⏳ قيد المراجعة للمكتبة العامة</span>`:u.shared==="approved"?`<span class="muted">✅ منشور في المكتبة العامة</span>`:u.shared==="rejected"?`<span class="muted">❌ رُفض للنشر العام</span>`:`<button class="btn sm" data-snd="share" data-id="${id}">🌐 مشاركة للعامة</button>`;
  row.innerHTML+=` <button class="btn sm ghost" data-snd="udel" data-id="${id}">🗑️</button>`; el.appendChild(row) })
 // اختيار بديل أو صوت إضافي لحدث: «استخدام الصوت» يفتح النافذة على الحدث مباشرة
 if(S.sndReplace||S.sndAddTo||S.sndPadRep) document.querySelectorAll('.snd-card [data-snd="use"]').forEach(btn=>btn.textContent=S.sndPadRep?"🔁 اختيار للزر":S.sndReplace?"🔁 اختيار كبديل":"➕ إضافة للحدث") }
// اختيار سريع للبديل/الإضافة/زر اللوحة بدون المرور على النافذة
const sndUseModal0=sndUseModal;
sndUseModal=function(src){ const c=SC();
 if(S.sndPadRep){ const b=c.board.find(x=>x.id===S.sndPadRep); S.sndPadRep=null; if(b){ b.s={...b.s,src}; sndSave("🔁 تم استبدال صوت الزر"); SU().tab="board"; renderPage(true) } return }
 if(S.sndReplace){ const [rid,i]=S.sndReplace.split(":"); S.sndReplace=null; const r=c.rules.find(x=>x.id===rid); if(r&&r.sounds[+i]){ r.sounds[+i]=sndRef({...r.sounds[+i],src}); sndSave("🔁 تم استبدال الصوت"); SU().tab="used"; renderPage(true) } return }
 if(S.sndAddTo){ const r=c.rules.find(x=>x.id===S.sndAddTo); S.sndAddTo=null; if(r){ if(!r.sounds.some(s=>s.src===src)&&r.sounds.length<SND_LIMITS.sounds) { const i=sndInfo(src)||{}; r.sounds.push(sndRef({src,start:i.start||0,end:i.end||0,vol:i.defVol||100})) } sndSave("➕ أُضيف الصوت — "+sndRuleLabel(r)); SU().tab="used"; renderPage(true) } return }
 return sndUseModal0(src) };
// اختصارات الكيبورد للوحة التشغيل (لا تعمل أثناء الكتابة في حقل)
document.addEventListener("keydown",e=>{ if(e.ctrlKey||e.metaKey||e.altKey||e.repeat) return; const t=e.target; if(t&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.tagName==="SELECT"||t.isContentEditable)) return;
 if(S.page!=="sounds"&&!document.body.classList.contains("sb-only")) return; const k=lc(e.key); if(!/^[a-z0-9]$/.test(k)) return; const b=SC().board.find(x=>x.key===k); if(!b) return; e.preventDefault(); sndNow(b.s);
 const el=document.querySelector(`.snd-pad[data-bid="${b.id}"]`); if(el){ el.classList.add("hit"); setTimeout(()=>el.classList.remove("hit"),300) } });
// نافذة مستقلة / OBS Dock: لوحة التشغيل فقط
if(location.hash==="#sb"){ document.body.classList.add("sb-only"); setTimeout(()=>{ S.page="sounds"; SU().tab="board"; renderPage() },0) }
