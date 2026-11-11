// ====== إشعارات المجتمعات: القوالب ومنع التكرار (دوال نقية) ======
export const NOTIFY_EVENTS=[["live_start","بداية البث («أنا لايف»)","🔴 {name} بدأ البث الآن! تعال: {url}"],["live_end","نهاية البث","انتهى البث — شكراً لكل من حضر ❤️"],["stats","ملخص إحصائيات البث","📊 ملخص البث: مدة {duration} · {likes} لايك · {gifts} نقطة هدايا · {follows} متابع جديد"],["goal","تحقيق هدف","🎯 تحقق الهدف: {goal}!"],["big_support","دعم كبير","💎 شكراً {user} على {amount}!"],["custom","رسالة مخصصة من الإجراءات","{text}"]];
export function notifyDefaults(){ const o={}; for(const [k,,tpl] of NOTIFY_EVENTS) o[k]={on:k==="live_start"||k==="live_end",tpl,minGapMin:k==="live_start"?30:0}; return o }
export function notifyFill(tpl,vars){ return String(tpl||"").replace(/\{(\w+)\}/g,(m,k)=>vars[k]!=null?String(vars[k]):"").slice(0,1900) }
/** منع التكرار: نفس الحدث لنفس المستخدم خلال المهلة لا يُرسل مرتين (مثل انقطاع وعودة البث) */
export function notifyAllowed(state,key,now,minGapMin){ const last=state[key]||0; if(minGapMin>0&&now-last<minGapMin*60000) return false; state[key]=now; return true }
