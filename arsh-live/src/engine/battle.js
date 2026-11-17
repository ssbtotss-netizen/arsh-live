// ====== تحدي الفريقين (Team Battle Clash) — منطق نقي يعمل على الخادم داخل الغرفة ======
// النقاط من أحداث البث الحقيقية فقط: الهدايا (قيمتها بالعملات) + اختيارياً التكبيس.
// طريقتان للانضمام: «gift» = كل هدية تابعة لفريق (مثلاً الوردة للأزرق) | «join» = المشاهد يكتب كلمة الفريق في الشات فتُحسب هداياه لفريقه.
// الأحداث التجريبية (test) لا تُحسب إلا إذا بدأ التحدي في وضع التجربة.
export const BT_MODES={gift:"كل هدية لفريق",join:"الانضمام بكلمة في الشات"};
export const BT_DESIGNS=[
 {id:"rClash",name:"صدام الفريقين",desc:"شريط شد الحبل بين الأزرق والأحمر مع شرارة في نقطة الالتقاء",pro:true},
 {id:"rVersus",name:"VS ملكي",desc:"بطاقتان متقابلتان وشعار VS نابض وتاج للمتقدم",pro:true},
 {id:"rNeonDuel",name:"مبارزة النيون",desc:"شريطان نيون متقابلان ونسبة كل فريق",pro:true},
];
const btNorm=s=>String(s||"").trim().toLowerCase().replace(/[أإآ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه").replace(/^[!#/]+/,"");
export function newBattle(){ return {id:"bt"+Date.now().toString(36),status:"idle",mode:"gift",durMs:5*60000,endsAt:null,startedAt:null,endedAt:null,testMode:false,likePts:0,
 teams:[{id:"a",name:"الفريق الأزرق",color:"#2f7bff",gifts:["Rose","وردة"],kw:"ازرق",score:0,top:null},{id:"b",name:"الفريق الأحمر",color:"#ff2d55",gifts:["TikTok","تيك توك"],kw:"احمر",score:0,top:null}],
 members:{},contrib:{},winner:null,seq:0} }
const clampMs=v=>Math.max(30000,Math.min(6*3600000,Math.round(+v||0)));
/** إعداد/تشغيل من اللوحة: config | start | stop | reset | addTime */
export function battleOp(B,m,now){ if(!B) return false; const op=m.op;
 if(op==="config"){ const c=m.config||{}; if(B.status==="running") { if(c.teams) for(const t of B.teams){ const n=c.teams.find(x=>x.id===t.id); if(n){ if(n.name!=null) t.name=String(n.name).slice(0,30); if(n.color&&/^#[0-9a-f]{3,8}$/i.test(n.color)) t.color=n.color } } return true }
  if(c.mode&&BT_MODES[c.mode]) B.mode=c.mode; if(c.durMs!=null) B.durMs=clampMs(c.durMs); if(c.likePts!=null) B.likePts=Math.max(0,Math.min(100,+c.likePts||0));
  if(Array.isArray(c.teams)) for(const t of B.teams){ const n=c.teams.find(x=>x.id===t.id); if(!n) continue; if(n.name!=null) t.name=String(n.name).slice(0,30)||t.name; if(n.color&&/^#[0-9a-f]{3,8}$/i.test(n.color)) t.color=n.color; if(Array.isArray(n.gifts)) t.gifts=n.gifts.map(g=>String(g).trim().slice(0,40)).filter(Boolean).slice(0,12); if(n.kw!=null) t.kw=btNorm(n.kw).slice(0,20) }
  return true }
 if(op==="start"){ for(const t of B.teams){ t.score=0; t.top=null } B.members={}; B.contrib={}; B.winner=null; B.status="running"; B.startedAt=now; B.endsAt=now+B.durMs; B.endedAt=null; B.testMode=!!m.test; B.id="bt"+now.toString(36); return true }
 if(op==="addTime"){ if(B.status!=="running") return false; B.endsAt+=Math.max(-B.durMs,Math.min(3600000,Math.round(+m.ms||0))); return true }
 if(op==="stop"){ if(B.status!=="running") return false; finish(B,now); return true }
 if(op==="reset"){ const keep={mode:B.mode,durMs:B.durMs,likePts:B.likePts,teams:B.teams.map(t=>({...t,score:0,top:null}))}; Object.assign(B,newBattle(),keep); return true }
 return false }
function finish(B,now){ B.status="ended"; B.endedAt=now; B.endsAt=now; const [a,b]=B.teams; B.winner=a.score===b.score?"draw":a.score>b.score?a.id:b.id }
/** فريق الحدث حسب الطريقة */
function teamOf(B,ev){ const uid=String(ev.user?.id||ev.user?.name||"");
 if(B.mode==="join") return B.members[uid]||null;
 if(ev.type!=="gift") return B.members[uid]||null; // التكبيس في وضع الهدايا يُحسب لآخر فريق دعمه المشاهد
 const g=btNorm(ev.gift), gid=String(ev.giftId||""); for(const t of B.teams) if(t.gifts.some(x=>btNorm(x)===g||(gid&&String(x)===gid))) return t.id; return null }
/** حدث بث → هل تغيّر التحدي؟ */
export function battleOnEvent(B,ev,now){ if(!B||B.status!=="running"||!ev) return false; if(now>=B.endsAt){ finish(B,now); return true }
 if(ev.test&&!B.testMode) return false; const uid=String(ev.user?.id||ev.user?.name||""); if(!uid) return false;
 if(ev.type==="comment"&&B.mode==="join"){ const k=btNorm(String(ev.text||"").split(/\s+/)[0]); const t=B.teams.find(t=>t.kw&&t.kw===k); if(t&&!B.members[uid]){ B.members[uid]=t.id; return true } return false }
 let pts=0; if(ev.type==="gift") pts=Math.max(0,+ev.value||0); else if(ev.type==="like"&&B.likePts>0) pts=Math.max(0,(+ev.count||1))*B.likePts/100; else return false;
 if(!pts) return false; const tid=teamOf(B,ev); if(!tid) return false; const t=B.teams.find(x=>x.id===tid); if(!t) return false;
 if(ev.type==="gift"&&B.mode==="gift") B.members[uid]=tid;
 t.score=Math.round((t.score+pts)*100)/100; const key=tid+"|"+uid, c=B.contrib[key]=(B.contrib[key]||0)+pts;
 if(!t.top||c>=t.top.v) t.top={n:ev.user?.name||uid,av:ev.user?.avatar||"",v:Math.round(c)};
 const keys=Object.keys(B.contrib); if(keys.length>3000){ for(const k of keys.slice(0,1000)) delete B.contrib[k] }
 return true }
/** نبضة كل ثانية: إنهاء عند انتهاء الوقت */
export function battleTick(B,now){ if(B&&B.status==="running"&&now>=B.endsAt){ finish(B,now); return true } return false }
/** نسبة الفريق الأول (0..1) للعرض */
export const battleShare=B=>{ const [a,b]=B.teams, s=a.score+b.score; return s>0?a.score/s:.5 };
