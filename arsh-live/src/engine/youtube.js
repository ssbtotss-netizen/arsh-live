// ====== YouTube لبوت الأغاني: دوال نقية (بدون شبكة) — الاتصال الفعلي في src/server/youtube.ts ======
// الالتزام بشروط YouTube API: البحث عبر YouTube Data API الرسمي فقط، والتشغيل عبر المشغل المضمَّن الرسمي (IFrame Player)
// ظاهراً في البث (200×200 على الأقل). لا نستخرج الصوت ولا نخفي المشغل ولا نحمّل الملفات.

/** معرّف الفيديو من رابط أو نص (youtu.be / watch?v= / shorts / embed / music.youtube) */
export function ytVideoIdFromText(s){ const t=String(s||"").trim();
 const m=/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:[^ ]*&)?v=|shorts\/|embed\/|live\/)|music\.youtube\.com\/watch\?(?:[^ ]*&)?v=)([\w-]{11})/i.exec(t);
 return m?m[1]:null }
/** مدة ISO 8601 (PT4M13S) بالثواني */
export function ytDur(iso){ const m=/^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(String(iso||"")); if(!m) return 0; return (+m[1]||0)*86400+(+m[2]||0)*3600+(+m[3]||0)*60+(+m[4]||0) }
const ENT={"&amp;":"&","&quot;":'"',"&#39;":"'","&lt;":"<","&gt;":">","&#039;":"'"};
export const ytDecode=s=>String(s||"").replace(/&(?:amp|quot|#39|#039|lt|gt);/g,x=>ENT[x]||x);
/** العنوان والفنان من بيانات الفيديو: «الفنان - العنوان» أو اسم القناة (بدون « - Topic» و VEVO) */
const YT_NOISE=/^(official|music|lyric|lyrics|audio|video|hd|4k|clip|كليب|فيديو كليب|حصري[اًا]*|حصريا|افضل تسجيل|أفضل تسجيل|جديد|new|remastered|live|مباشر|النسخه الاصليه|النسخة الأصلية)$/i;
const ytN=s=>String(s||"").toLowerCase().replace(/[أإآ]/g,"ا").replace(/ة/g,"ه").replace(/ى/g,"ي").replace(/[^\p{L}\p{N}]+/gu,"");
export function ytMeta(sn){ const ch=ytDecode(sn&&sn.channelTitle||"").replace(/\s*-\s*Topic$/i,"").replace(/VEVO$/i,"").replace(/\s*official$/i,"").trim();
 const raw=ytDecode(sn&&sn.title||"").replace(/\s*[\[(（][^\])）]*[\])）]\s*/g," ").replace(/\s*[|｜].*$/,"").replace(/\s+/g," ").trim();
 const p=raw.split(/\s+[-–—]\s+/).map(x=>x.trim()).filter(x=>x&&!YT_NOISE.test(x));
 if(p.length>=2){ const cn=ytN(ch), ai=cn?p.findIndex(x=>{ const n=ytN(x); return n&&(cn.includes(n)||n.includes(cn)) }):-1; const a=ai>=0?ai:0; const title=p.filter((_,i)=>i!==a).join(" - ");
  return {title:title.slice(0,120),artist:p[a].slice(0,80)} }
 return {title:(p[0]||raw).slice(0,120)||"أغنية",artist:ch.slice(0,80)} }
/** صورة الغلاف: أعلى دقة متاحة */
export const ytThumb=sn=>{ const t=(sn&&sn.thumbnails)||{}; return (t.high||t.medium||t.standard||t.default||{}).url||"" };
/**
 * اختيار نسخ صالحة للتشغيل في البث من نتائج videos.list:
 * قابلة للتضمين، عامة، ليست بثاً مباشراً، غير محجوبة في منطقة البث، ومدتها ضمن الحد. ترتيب البحث محفوظ.
 */
export function ytPlayable(items,{maxDurSec=0,region="SA"}={}){ const out=[];
 for(const v of items||[]){ const st=v.status||{}, cd=v.contentDetails||{}, sn=v.snippet||{}, rr=cd.regionRestriction||{}, dur=ytDur(cd.duration);
  let why="";
  if(st.embeddable===false) why="صاحب الفيديو منع التشغيل خارج YouTube";
  else if(st.privacyStatus&&st.privacyStatus!=="public"&&st.privacyStatus!=="unlisted") why="الفيديو خاص";
  else if(sn.liveBroadcastContent&&sn.liveBroadcastContent!=="none") why="بث مباشر";
  else if(region&&((rr.blocked||[]).includes(region)||(rr.allowed&&!rr.allowed.includes(region)))) why="محجوب في منطقتك";
  else if(cd.contentRating&&cd.contentRating.ytRating==="ytAgeRestricted") why="مقيد بالعمر (لا يعمل في المشغل المضمّن)";
  else if(!dur) why="مدة غير معروفة";
  else if(maxDurSec&&dur>maxDurSec) why="أطول من الحد المسموح";
  const m=ytMeta(sn); out.push({vid:v.id,title:m.title,artist:m.artist,dur,cover:ytThumb(sn),ok:!why,why}) }
 return out }
/** بيانات الأغنية للقائمة: المعرّف yt:<id> + نسخ بديلة إن رفض صاحب الفيديو التشغيل في المشغل */
export function ytTrack(c,alts=[]){ return {id:"yt:"+c.vid,src:"yt",vid:c.vid,title:c.title,artist:c.artist,dur:c.dur,cover:c.cover,alts:alts.slice(0,3).map(a=>({vid:a.vid,title:a.title,artist:a.artist,dur:a.dur,cover:a.cover}))} }
/** مفتاح الكاش: نفس الطلب بصيغ مختلفة (همزات/مسافات/حالة الأحرف) يستخدم نفس النتيجة — يوفر حصة البحث اليومية */
export function ytCacheKey(q){ return String(q||"").toLowerCase().replace(/[أإآ]/g,"ا").replace(/ة/g,"ه").replace(/ى/g,"ي").replace(/[^\p{L}\p{N}]+/gu," ").trim().slice(0,100) }
/** رسائل أخطاء المشغل المضمّن الرسمية */
export const YT_ERR={2:"معرّف الفيديو غير صالح",5:"تعذر تشغيل الفيديو في المشغل",100:"الفيديو حُذف أو أصبح خاصاً",101:"صاحب الفيديو منع التشغيل خارج YouTube",150:"صاحب الفيديو منع التشغيل خارج YouTube",153:"المشغل يحتاج Referer — افتح رابط المشغل من موقع المنصة"};
