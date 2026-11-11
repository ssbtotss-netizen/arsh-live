// ====== إحصائيات نهاية البث: الجلسات والتقارير (دوال نقية) ======
// جلسة بمعرّف فريد تبدأ مع «متصل/مباشر» وتنتهي فقط بعد تأكيد الانقطاع (افتراضياً 90 ثانية) — لا يُعتبر تحديث الصفحة أو انقطاع ثوانٍ نهاية بث.
import { entries } from "./leaderboard.js";

export const PS_END_CONFIRM_MS=90000;
export function sessionOnLive(R,live,now){ const C=R.C; C.session=C.session||null;
 if(live){ if(C.session&&C.session.endingAt){ C.session.endingAt=null; return "resumed" }  // انقطاع مؤقت ثم عودة → نفس الجلسة
  if(!C.session||C.session.done){ const id="s"+now.toString(36)+Math.random().toString(36).slice(2,6); C.session={id,startedAt:now,endingAt:null,done:false,acc:null}; R.PSB=null; return "started" } return null }
 if(C.session&&!C.session.done&&!C.session.endingAt){ C.session.endingAt=now; return "ending" } return null }
/** يُستدعى في كل نبضة: إذا استمر الانقطاع فترة التأكيد → تقرير نهائي */
export function sessionTick(R,now,confirmMs=PS_END_CONFIRM_MS){ const s=R.C.session; if(!s||s.done||!s.endingAt||now-s.endingAt<confirmMs) return null;
 s.done=true; const rep=buildReport(R,s.startedAt,s.endingAt,{id:s.id}); R.C.reports=[rep,...(R.C.reports||[])].slice(0,30); return rep }
/** لقطة الأرقام عند بداية الجلسة — لحساب أرقام هذه الجلسة فقط وعدم خلطها بما قبلها */
/** عدّاد الجلسة: الأحداث الحقيقية فقط (التجريبية لا تُحتسب) أثناء جلسة مفتوحة.
 * الإجماليات في C.session.acc (تُحفظ مع الغرفة)، وترتيب المستخدمين في R.PSB (خارج C حتى لا يُرسل مع كل رسالة ساعة) */
export function sessionOnEvent(R,ev){ const s=R.C.session; if(!s||s.done||!ev||ev.test) return; if((ev.platform||"tiktok")!=="tiktok"&&ev.type==="gift") return;
 const a=s.acc||(s.acc={likes:0,gifts:0,giftCount:0,comments:0,follows:0,subs:0,shares:0});
 if(!R.PSB||R.PSB.id!==s.id) R.PSB={id:s.id,u:{likes:{},gifts:{},comments:{},shares:{}}};
 const u=ev.user||{}, k=u.id||u.name, add=(t,n)=>{ if(!k) return; const m=R.PSB.u[t]; const r=m[k]||(m[k]={name:u.name||k,av:u.avatar||"",v:0}); r.v+=n; if(u.avatar) r.av=u.avatar };
 if(ev.type==="like"){ const n=Math.max(0,+ev.count||0); a.likes+=n; add("likes",n) }
 else if(ev.type==="gift"){ const v=Math.max(0,+ev.value||0), c=Math.max(1,+ev.count||1); a.gifts+=v; a.giftCount+=c; add("gifts",v) }
 else if(ev.type==="comment"){ a.comments++; add("comments",1) }
 else if(ev.type==="follow") a.follows++;
 else if(ev.type==="subscribe") a.subs++;
 else if(ev.type==="share"){ a.shares++; add("shares",1) } }
/** بناء التقرير من بيانات الجلسة الفعلية فقط. غير المتاح = null (يُعرض «غير متاح») */
export function buildReport(R,startedAt,endedAt,o={}){ const s=R.C.session&&R.C.session.id===o.id?R.C.session:null, D=R.D||{};
 const acc=s&&s.acc||null, UB=R.PSB&&R.PSB.id===o.id?R.PSB.u:null;
 // تقرير تجريبي بدون جلسة: يُبنى من بيانات الغرفة الحالية ويُعلَّم تجريبياً
 const t=acc||(o.test?{...(D.tot||{}),shares:(D.tot||{}).shares??null}:{likes:0,gifts:0,giftCount:0,comments:0,follows:0,subs:0,shares:0});
 const top=(type,N=10)=>UB?Object.values(UB[type]||{}).filter(x=>x.v>0).sort((a,c)=>c.v-a.v).slice(0,N).map(x=>({name:x.name,av:x.av||"",v:x.v}))
  :(o.test&&type!=="shares"?entries({type,topN:N},D,R.H||[]).filter(x=>x.v>0).map(x=>({name:x.name,av:x.av||"",v:x.v})):[]);
 const DC=R.donCfg||{currency:"USD"}; let donors=[], donTotal=null, donCount=null, cur=DC.currency||"USD";
 try{ const L=((R.DN&&R.DN.list)||[]).filter(d=>!d.test&&d.status!=="refunded"&&d.t>=startedAt&&d.t<=endedAt+60000).map(d=>({...d,amount:Math.max(0,(+d.amount||0)-(+d.refunded||0))})).filter(d=>d.amount>0); if(L.length){ cur=L[0].currency||cur; const same=L.filter(d=>(d.currency||cur)===cur); donTotal=Math.round(same.reduce((a,d)=>a+(+d.amount||0),0)*100)/100; donCount=new Set(same.map(d=>d.name||d.id)).size;
  const by={}; for(const d of same){ const k=d.name||"مجهول"; (by[k]||(by[k]={name:k,av:d.avatar||"",v:0})).v+=+d.amount||0 } donors=Object.values(by).sort((a,b)=>b.v-a.v).slice(0,10).map(x=>({...x,v:Math.round(x.v*100)/100})) } }catch(e){}
 return {id:o.id||"r"+endedAt.toString(36),test:!!o.test,startedAt,endedAt,durationMs:Math.max(0,endedAt-startedAt),
  totals:{likes:t.likes??0,comments:t.comments??0,follows:t.follows??0,gifts:t.gifts??0,giftCount:t.giftCount??0,subs:t.subs??0,shares:t.shares??null,views:null,peakViewers:null,donations:donTotal,donationCurrency:cur,donors:donCount},
  listsSessionOnly:!!UB,lists:{supporters:top("gifts"),donors,likers:top("likes"),sharers:top("shares"),commenters:top("comments")},complete:!o.partial&&!!UB} }
export const psDur=ms=>{ const m=Math.round(ms/60000), h=Math.floor(m/60); return h?`${h} س ${m%60} د`:`${m} د` };

// ====== استوديو التقرير: قوالب + رسم Canvas (يعمل في المتصفح؛ الدوال الحسابية نقية) ======
export const PS_PALETTES=[["b6o6","بطوط","#0b1020","#2a1458","#ff2d6f","#7c5cff"],["gold","ذهبي ملكي","#140d02","#3a2606","#f5c542","#ffe9a3"],["ocean","المحيط","#021420","#063a5a","#22d3ee","#60a5fa"],["neon","نيون","#05010d","#1a0533","#39ff14","#ff00e5"],["rose","وردي","#1d0612","#4a0f2c","#ff6fa8","#ffc2dc"],["desert","صحراء نجد","#1e1206","#5a3410","#f59e0b","#fcd9a0"],["forest","غابة","#03140b","#0b3a22","#34d399","#bef264"],["ice","جليدي","#0a1622","#1f3b57","#bae6fd","#ffffff"],["fire","ناري","#160300","#4a0e00","#ff5a1f","#ffd000"],["mono","أسود وأبيض","#0a0a0a","#262626","#ffffff","#a3a3a3"],["royal","بنفسجي ملكي","#0e0420","#2e0f5c","#c084fc","#f0abfc"],["light","فاتح","#f8fafc","#e2e8f0","#7c3aed","#0f172a"]];
export const PS_LAYOUTS=[["cards","بطاقات"],["glass","زجاجي"],["minimal","بسيط"]];
/** 36 قالباً = 12 لوحة ألوان × 3 أنماط تخطيط (كل تركيبة فريدة) */
export const PS_TEMPLATES=PS_PALETTES.flatMap(p=>PS_LAYOUTS.map(l=>({id:p[0]+"-"+l[0],name:p[1]+" · "+l[1],pal:p[0],layout:l[0]})));
export const PS_SIZES=[["story","ستوري 1080×1920",1080,1920],["portrait","منشور طولي 1080×1350",1080,1350],["square","مربع 1080×1080",1080,1080],["wide","عريض 1920×1080",1920,1080]];
export const PS_STATS=[["duration","⏱️","مدة البث"],["likes","❤️","الإعجابات"],["gifts","💎","قيمة الهدايا"],["giftCount","🎁","عدد الهدايا"],["comments","💬","التعليقات"],["follows","➕","متابعون جدد"],["shares","🔁","المشاركات"],["subs","⭐","الاشتراكات"],["donations","💰","الدعم المالي"],["views","👁️","المشاهدات"],["peakViewers","📈","أعلى مشاهدين"]];
export const PS_LISTS=[["supporters","🏆","أكثر الداعمين بالهدايا"],["donors","💰","أكثر الداعمين مالياً"],["likers","❤️","أكثر المكبسين"],["sharers","🔁","أكثر المشاركين"],["commenters","💬","أكثر المعلّقين"]];
export const PS_THANKS=["شكراً لكل من حضر ودعم البث ❤️","أنتم السبب في نجاح هذا البث 🙏","نلتقي في البث القادم بإذن الله 👋","شكراً يا أحلى متابعين 🌹","ما قصرتوا، الله يسعدكم 💜"];
export function psDefaults(){ return {template:"b6o6-cards",size:"story",name:"",thanks:PS_THANKS[0],thanksColor:"",thanksSize:44,font:"Readex Pro",
 stats:Object.fromEntries(PS_STATS.map(([k])=>[k,!["views","peakViewers"].includes(k)])),showUnavailable:true,
 lists:{supporters:5,donors:3,likers:5,sharers:3,commenters:3}} }
const psNum=v=>Number(v).toLocaleString("en-US");
/** قيمة المؤشر كنص؛ null = غير متاح (لا نخترع أرقاماً) */
export function psStatValue(rep,k){ if(k==="duration") return psDur(rep.durationMs||0); const v=rep.totals?rep.totals[k]:null;
 if(v==null) return null; if(k==="donations") return psNum(v)+" "+(rep.totals.donationCurrency||""); return psNum(v) }
/** المؤشرات والقوائم المعروضة فعلاً حسب الإعدادات */
export function psSections(rep,o){ o={...psDefaults(),...o};
 const stats=PS_STATS.filter(([k])=>o.stats[k]).map(([k,ic,lb])=>({k,ic,lb,v:psStatValue(rep,k)})).filter(s=>s.v!=null||o.showUnavailable);
 const lists=PS_LISTS.map(([k,ic,lb])=>({k,ic,lb,n:+(o.lists[k]||0),rows:((rep.lists||{})[k]||[]).slice(0,+(o.lists[k]||0))})).filter(l=>l.n>0&&(l.rows.length||o.showUnavailable));
 return {stats,lists} }
export function psCanvasSize(id){ const s=PS_SIZES.find(x=>x[0]===id)||PS_SIZES[0]; return [s[2],s[3]] }

/** رسم التقرير على Canvas. imgs: خريطة رابط→صورة محمّلة (غير المتاحة → الحرف الأول) */
export function psDraw(cv,rep,o,imgs={}){ o={...psDefaults(),...o}; const [W,H]=psCanvasSize(o.size); cv.width=W; cv.height=H; const x=cv.getContext("2d");
 const T=PS_TEMPLATES.find(t=>t.id===o.template)||PS_TEMPLATES[0], P=PS_PALETTES.find(p=>p[0]===T.pal), [,,bg1,bg2,ac,ac2]=P, L=T.layout, light=T.pal==="light";
 const fg=light?"#0f172a":"#ffffff", mut=light?"#475569":"rgba(255,255,255,.65)", F=o.font||"Readex Pro", fam=`"${F}","Readex Pro","Changa","Noto Sans Arabic",sans-serif`;
 const g=x.createLinearGradient(0,0,W*.4,H); g.addColorStop(0,bg1); g.addColorStop(1,bg2); x.fillStyle=g; x.fillRect(0,0,W,H);
 x.globalAlpha=light?.18:.28; for(const [cx,cy,r,c] of [[W*.9,H*.06,W*.45,ac],[W*.05,H*.95,W*.5,ac2]]){ const rg=x.createRadialGradient(cx,cy,0,cx,cy,r); rg.addColorStop(0,c); rg.addColorStop(1,"transparent"); x.fillStyle=rg; x.fillRect(0,0,W,H) } x.globalAlpha=1;
 x.direction="rtl"; x.textBaseline="middle";
 const {stats,lists}=psSections(rep,o), wide=W>H*1.2, pad=Math.round(Math.min(W,H)*.06);
 const rr=(X,Y,w,h,r)=>{ x.beginPath(); x.roundRect?x.roundRect(X,Y,w,h,r):x.rect(X,Y,w,h) };
 const box=(X,Y,w,h,s)=>{ if(L==="minimal"){ x.strokeStyle=light?"#cbd5e1":"rgba(255,255,255,.14)"; x.lineWidth=2*s; x.beginPath(); x.moveTo(X,Y+h); x.lineTo(X+w,Y+h); x.stroke(); return }
  rr(X,Y,w,h,22*s); x.fillStyle=L==="glass"?(light?"rgba(255,255,255,.55)":"rgba(255,255,255,.07)"):(light?"#ffffff":"rgba(0,0,0,.35)"); x.fill(); if(L==="glass"){ x.strokeStyle=ac+"88"; x.lineWidth=2*s; x.stroke() } };
 const fit=(t,max)=>{ t=String(t??""); if(x.measureText(t).width<=max) return t; while(t.length>1&&x.measureText(t+"…").width>max) t=t.slice(0,-1); return t+"…" };
 const txt=(t,X,Y,sz,c,al="right",wt=700,max)=>{ x.font=`${wt} ${sz}px ${fam}`; x.fillStyle=c; x.textAlign=al; x.fillText(max?fit(t,max):t,X,Y) };
 // يرسم عموداً (أو يقيس ارتفاعه فقط عند dry) — للتكيّف التلقائي مع المقاس
 const head=(X,Y,w,s,dry)=>{ const h=150*s; if(dry) return h; txt("إحصائيات البث",X+w,Y+40*s,64*s,fg,"right",900,w); txt([o.name||"",new Date(rep.endedAt||Date.now()).toLocaleDateString("ar-SA-u-ca-gregory-nu-latn"),rep.test?"🧪 تقرير تجريبي":""].filter(Boolean).join("  •  "),X+w,Y+110*s,30*s,mut,"right",500,w); return h };
 const tiles=(X,Y,w,s,dry)=>{ if(!stats.length) return 0; const cols=w>1400*s?4:3, gap=18*s, tw=(w-gap*(cols-1))/cols, th=150*s, rows=Math.ceil(stats.length/cols), h=rows*th+(rows-1)*gap+30*s; if(dry) return h;
  stats.forEach((st,i)=>{ const c=i%cols, r=Math.floor(i/cols), tx=X+w-(c+1)*tw-c*gap, ty=Y+r*(th+gap); box(tx,ty,tw,th,s);
   txt(st.ic,tx+tw-24*s,ty+42*s,36*s,fg,"right",400); txt(st.v==null?"غير متاح":st.v,tx+tw/2,ty+80*s,(st.v==null?32:50)*s,st.v==null?mut:ac,"center",900,tw-20*s); txt(st.lb,tx+tw/2,ty+124*s,26*s,mut,"center",600,tw-20*s) }); return h };
 const listBlock=(l,X,Y,w,s,dry)=>{ const rh=62*s, h=76*s+Math.max(1,l.rows.length)*rh+20*s; if(dry) return h; box(X,Y,w,h,s); txt(l.ic+" "+l.lb,X+w-24*s,Y+40*s,32*s,fg,"right",800,w-48*s);
  if(!l.rows.length) txt("غير متاح لهذه الجلسة",X+w/2,Y+76*s+rh/2,26*s,mut,"center",500);
  l.rows.forEach((r,i)=>{ const ry=Y+76*s+i*rh+rh/2, ax=X+w-24*s-22*s-46*s; const med=["#f5c542","#cbd5e1","#d97706"][i];
   x.beginPath(); x.arc(X+w-24*s-22*s,ry,22*s,0,7); x.fillStyle=med||(light?"#e2e8f0":"rgba(255,255,255,.12)"); x.fill(); txt(String(i+1),X+w-24*s-22*s,ry+2*s,24*s,med?"#111":fg,"center",900);
   x.save(); x.beginPath(); x.arc(ax,ry,24*s,0,7); x.clip(); const im=r.av&&imgs[r.av]; if(im) x.drawImage(im,ax-24*s,ry-24*s,48*s,48*s); else { x.fillStyle=ac2; x.fillRect(ax-24*s,ry-24*s,48*s,48*s); txt((r.name||"?").trim().charAt(0),ax,ry+2*s,24*s,light?"#fff":"#111","center",900) } x.restore();
   x.font=`800 ${28*s}px ${fam}`; const vw=x.measureText(psNum(r.v)).width; txt(r.name,ax-36*s,ry,28*s,fg,"right",600,w-(24+44+48+60)*s-vw-30*s); txt(psNum(r.v),X+24*s,ry,28*s,ac,"left",800) }); return h };
 const listsCol=(X,Y,w,s,dry,cols)=>{ const gap=18*s, cw=(w-gap*(cols-1))/cols, colY=Array(cols).fill(0); for(const l of lists){ const c=colY.indexOf(Math.min(...colY)); const h=listBlock(l,0,0,cw,s,true); if(!dry) listBlock(l,X+w-(c+1)*cw-c*gap,Y+colY[c],cw,s,false); colY[c]+=h+gap } return lists.length?Math.max(...colY):0 };
 const thanks=(X,Y,w,s,dry)=>{ if(!o.thanks) return 0; const sz=(+o.thanksSize||44)*s, h=sz*1.9; if(dry) return h; txt(o.thanks,X+w/2,Y+h/2,sz,o.thanksColor||ac2,"center",800,w); return h };
 const foot=(s)=>txt("B6O6 Streaming",W/2,H-pad*.55,24*s,mut,"center",600);
 const plan=(s,dry)=>{ const g2=26*s; if(wide){ const cw=(W-pad*3)/2, A=pad*2+cw, Bx=pad; let y=pad; y+=head(A,y,cw,s,dry)+g2; y+=tiles(A,y,cw,s,dry)+g2; y+=thanks(A,y,cw,s,dry); const yl=pad+listsCol(Bx,pad,cw,s,dry,lists.length>2?2:1); return Math.max(y,yl)+pad }
  let y=pad; const w=W-pad*2; y+=head(pad,y,w,s,dry)+g2; y+=tiles(pad,y,w,s,dry)+g2; y+=listsCol(pad,y,w,s,dry,H>1500?(lists.length>3?2:1):2); y+=thanks(pad,y,w,s,dry); return y+pad };
 let s=1; for(let i=0;i<6;i++){ const need=plan(s,true)+40; if(need<=H) break; s*=Math.max(.6,(H-40)/need) }  // تصغير تلقائي حتى يتسع كل شيء
 plan(s,false); foot(s); return {scale:s,W,H} }
/** تحميل صور الملفات الشخصية بأمان: crossOrigin — ما يفشل أو يلوّث الـCanvas يُستبدل بالحرف الأول */
export function psLoadImages(rep){ const urls=[...new Set(Object.values(rep.lists||{}).flat().map(r=>r.av).filter(Boolean))].slice(0,60), out={};
 return Promise.all(urls.map(u=>new Promise(res=>{ const im=new Image(); im.crossOrigin="anonymous"; const done=ok=>{ if(ok){ try{ const c=document.createElement("canvas"); c.width=c.height=1; const cx=c.getContext("2d"); cx.drawImage(im,0,0,1,1); cx.getImageData(0,0,1,1); out[u]=im }catch(e){} } res() };
  im.onload=()=>done(true); im.onerror=()=>done(false); setTimeout(()=>done(false),4000); im.src=u }))).then(()=>out) }
