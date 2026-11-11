// ====== أقوى الداعمين حسب الفترة (اليوم / الأسبوع / الشهر) + أكثر المشاركين ======
// يُحفظ في C.tops مع حالة الغرفة. الوحدة: نقاط هدايا TikTok فقط (لا يُخلط بالدونيشن المالي).
// التوقيت: توقيت صانع المحتوى (الافتراضي السعودية +3)، والأسبوع يبدأ يوم الأحد.
const TOP_CAP=60;
export function topsKeys(now,tzMin=180){ const d=new Date(now+tzMin*60000); const y=d.getUTCFullYear(), m=d.getUTCMonth(), day=d.getUTCDate();
 const p=n=>String(n).padStart(2,"0"); const ws=new Date(Date.UTC(y,m,day-d.getUTCDay()));
 return {day:`${y}-${p(m+1)}-${p(day)}`,week:`${ws.getUTCFullYear()}-${p(ws.getUTCMonth()+1)}-${p(ws.getUTCDate())}`,month:`${y}-${p(m+1)}`} }
function bucket(T,period,key){ const b=T[period]; if(!b||b.key!==key) T[period]={key,u:{}}; return T[period] }
function bump(b,u,add){ const id=String(u.id||u.name||""); if(!id) return; const r=b.u[id]||(b.u[id]={id,name:"",av:"",v:0}); r.name=String(u.name||r.name).slice(0,60); if(u.avatar) r.av=u.avatar; r.v+=add; r.at=Date.now();
 const ks=Object.keys(b.u); if(ks.length>TOP_CAP*2){ ks.sort((a,c)=>b.u[c].v-b.u[a].v); for(const k of ks.slice(TOP_CAP)) delete b.u[k] } }
/** تحديث من حدث حقيقي — يرجع true إذا تغيّر */
export function topsOnEvent(T,ev,now,tzMin=180){ if(!ev||ev.test||!ev.user) return false; const K=topsKeys(now,tzMin);
 if(ev.type==="gift"){ const v=Math.max(0,(+ev.value||0)*(ev.platform&&ev.platform!=="tiktok"?0:1)); if(!v) return false; for(const p of ["day","week","month"]) bump(bucket(T,p,K[p]),ev.user,v); return true }
 if(ev.type==="share"){ bump(bucket(T,"shares",K.day),ev.user,1); return true }
 return false }
/** القائمة المرتبة لفترة — تُصفّر تلقائياً عند بداية يوم/أسبوع/شهر جديد */
export function topsList(T,period,now,tzMin=180){ const K=topsKeys(now,tzMin), key=period==="shares"?K.day:K[period]; const b=T&&T[period];
 if(!b||b.key!==key) return []; return Object.values(b.u).sort((a,c)=>c.v-a.v) }
