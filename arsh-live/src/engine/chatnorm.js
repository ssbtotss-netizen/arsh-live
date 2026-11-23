// ====== Unified Chat Message Normalizer — توحيد رسائل الشات من كل المنصات ======
// السبب الجذري الذي أصلحه هذا الملف: مكتبة TikTok v2 تضع نص التعليق في الحقل content،
// بينما الكود كان يقرأ comment (اسم الحقل في الإصدار الأول) → يصل الاسم بدون النص، وأوامر بوت الأغاني لا تُقرأ.
// القاعدة: نقرأ الحقل الموثق لكل منصة أولاً، ثم نجرّب الحقول البديلة المعروفة — ولا نخترع نصاً أبداً.

/** الحقول المحتملة لنص الرسالة بالترتيب (الأول غير الفارغ هو المعتمد) */
export const CHAT_TEXT_FIELDS=["comment","content","text","message","body","msg"];
const strOf=v=>typeof v==="string"?v:(v&&typeof v==="object"&&typeof v.text==="string")?v.text:"";
/** نص الرسالة + اسم الحقل الذي وُجد فيه (للتشخيص) */
export function chatTextOf(d,first){ if(!d||typeof d!=="object") return {text:"",field:null};
 if(first){ const s=strOf(d[first]); if(s&&s.trim()) return {text:s,field:first} }
 for(const f of CHAT_TEXT_FIELDS){ const s=strOf(d[f]); if(s&&s.trim()) return {text:s,field:f} }
 return {text:"",field:null} }
/** الملصقات/الإيموجي المخصص المرفق بالرسالة (روابط https فقط) */
export function chatEmotesOf(d){ const a=Array.isArray(d&&d.emotes)?d.emotes:Array.isArray(d&&d.emoteList)?d.emoteList:[], out=[];
 for(const e of a){ const em=(e&&(e.emote||e))||{}, img=em.image||em.icon||{};
  const u=img.imageUrl||img.url||(img.urlList||img.url_list||[])[0]||em.imageUrl||em.url;
  if(typeof u==="string"&&/^https:\/\//.test(u)&&!out.includes(u)) out.push(u); if(out.length>=8) break }
 return out }
/** تنظيف بدون تشويه: يحذف محارف التحكم فقط — العربية والإنجليزية والإيموجي والرموز تبقى كما هي */
export function chatClean(s,max=500){ return String(s??"").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,"").replace(/\r\n?/g,"\n").slice(0,max) }
/**
 * الصيغة الموحدة لأي رسالة: {platform, userId, username, avatar, message, timestamp, messageId, emotes, field}
 * field = اسم الحقل الذي جاء منه النص (للتشخيص فقط)
 */
export function normChat(platform,raw,{userId="",username="",avatar="",messageId=null,timestamp=null,field=null}={}){
 const t=chatTextOf(raw,field);
 return {platform:String(platform||""),userId:String(userId||""),username:String(username||""),avatar:String(avatar||""),
  message:chatClean(t.text),field:t.field,emotes:chatEmotesOf(raw),timestamp:+timestamp||Date.now(),messageId:messageId!=null?String(messageId):null} }
/** تشخيص بدون محتوى: أسماء الحقول فقط (لا نصوص محادثات في سجلات الإنتاج) */
export const chatShape=d=>Object.keys(d||{}).slice(0,30).join(",");
