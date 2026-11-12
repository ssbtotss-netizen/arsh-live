// ====== غرفة البث: تربط المحركات الثلاثة دون خلطها ======
// استقبال الأحداث → (منع التكرار) → محرك القوائم + محرك السبثون/المؤقتات → رسائل للعرض
// نفس الكود يعمل على الخادم (الوضع الحقيقي) وفي المتصفح (وضع التجربة بدون خادم).
import { emptyData, applyEvent } from "./leaderboard.js";
import { emptyDonations, applyDonation } from "./donations.js";
import { followersOp, followersOnEvent } from "./followers.js";
import { latestOnEvent } from "./latest.js";
import { normalizeEvent } from "./events.js";
import { chatPush } from "./chat.js";
import { topsOnEvent } from "./tops.js";
import { sessionOnLive, sessionTick, sessionOnEvent } from "./poststats.js";
import { actionsOnEvent, newActState, actLog } from "./actions.js";
import { musicOnEvent, musicOp, newMusicState, defaultMusicCfg, musicSearch, musicAdd, musicNext, musicLog } from "./music.js";
import { botsOnEvent, botsTick, newBotState } from "./bots.js";
import { alCfg, alFill, alNewState, alertsOnEvent, alertsOnLogs, alertsOnLive, alertsOnEnd, alertsManual, alLibTest } from "./alerts.js";
import { newClockState, subathonOp, subathonOnEvent, subathonOnDonation, migrateRules, subathonTick, timerOp, timerTick, newTimer } from "./clock.js";

const LIVE_TYPES=new Set(["like","gift","comment","superchat","cheer","raid","follow","subscribe","share","join","reset","shuffle","donation","donation_refund","donation_session","donation_clear_tests"]);
const DON_TYPES=new Set(["donation","donation_refund","donation_session","donation_clear_tests"]);
export function newRoom(){ return {D:emptyData(),H:[],C:newClockState(),DN:emptyDonations(),seen:new Map(),live:false,logs:[]} }
function keep(R,logs){ if(!logs.length) return; R.logs=(R.logs||[]); for(const l of logs) R.logs.unshift(l); if(R.logs.length>300) R.logs.length=300 }

/** حدث بث (حقيقي أو تجريبي). يرجع {out: رسائل للبث للعملاء, logs: سجلات وقت للحفظ} */
export function roomEvent(R,ev,now){
 if(!ev||!LIVE_TYPES.has(ev.type)) return {out:[],logs:[]};
 ev=normalizeEvent(ev,{now}); if(!ev) return {out:[],logs:[],bad:true};
 // التبرعات: محرك مستقل لا يلمس قوائم TikTok
 if(DON_TYPES.has(ev.type)){ R.DN=R.DN||emptyDonations(); ev.t=ev.t||now; if(!applyDonation(R.DN,ev)) return {out:[],logs:[],dup:true};
  // الدونيشن المؤكد فقط يصل هنا (المزوّد تحقق منه) ومرة واحدة فقط (applyDonation يمنع التكرار)
  R.C.latest=R.C.latest||{}; latestOnEvent(R.C.latest,ev,now);
  R.CHAT=R.CHAT||[]; chatPush(R.CHAT,ev);
  const out=[{t:"event",ev}], logs=ev.type==="donation"?subathonOnDonation(R.C.subathon,ev,now):[]; keep(R,logs); if(logs.length) out.push({t:"clock",C:R.C,now,logs});
 roomActions(R,ev,now,out); if(ev.type==="donation"){ const nm=String(ev.name||""), cur=String(ev.currency||"").toUpperCase(); ev.donorTotal=nm&&!ev.anonymous?R.DN.list.filter(d=>d.name===nm&&d.currency===cur&&!d.test).reduce((a,d)=>a+Math.max(0,d.amount-(d.refunded||0)),0):""; }
 roomAlerts(R,ev,logs,now,out); botOut(R,ev,now,out); return {out,logs} }
 if(ev.id){ if(R.seen.has(ev.id)) return {out:[],logs:[],dup:true}; R.seen.set(ev.id,now); if(R.seen.size>8000){ const it=R.seen.keys(); for(let i=0;i<2000;i++) R.seen.delete(it.next().value) } }
 ev.t=ev.t||now;
 applyEvent(R.D,R.H,ev);
 const out=[{t:"event",ev}];
 const logs=subathonOnEvent(R.C.subathon,ev,now,R.D.tot); keep(R,logs);
 R.C.latest=R.C.latest||{}; latestOnEvent(R.C.latest,ev,now);
 R.CHAT=R.CHAT||[]; chatPush(R.CHAT,ev);
 roomMusic(R,ev,now,out);
 sessionOnEvent(R,ev);
 faRoomTTS(R,ev,now,out);
 R.C.tops=R.C.tops||{}; topsOnEvent(R.C.tops,ev,now,(R.botCfg&&R.botCfg.tzMin)??180);
 roomActions(R,ev,now,out);
 if(ev.type==="follow"){ R.C.followers=R.C.followers||{}; if(followersOnEvent(R.C.followers,ev,now)&&!logs.length) out.push({t:"clock",C:R.C,now,logs:[],fc:"tiktok"}) }
 if(logs.length) out.push({t:"clock",C:R.C,now,logs});
 roomAlerts(R,ev,logs,now,out);
 botOut(R,ev,now,out);
 return {out,logs};
}
/** صندوق الآيرتات: القواعد تأتي من إعدادات المستخدم (botCfg.alerts) — الغرفة مصدر واحد فلا يتكرر الآيرت بين روابط OBS */
function roomAlertCfg(R){ const raw=R.botCfg&&R.botCfg.alerts; if(!raw) return null; if(R.ALraw!==raw){ R.ALraw=raw; R.ALc=alCfg(raw) } R.AL=R.AL||alNewState(); return R.ALc }
function roomAlerts(R,ev,logs,now,out){ const c=roomAlertCfg(R); if(!c) return; try{ const items=[...(ev?alertsOnEvent(c,R.AL,ev,now,{totalLikes:R.D&&R.D.tot?R.D.tot.likes:0}):[]),...alertsOnLogs(c,R.AL,logs||[],now)]; if(!items.length) return; out.push({t:"alert",items});
  // القارئ الصوتي (اختياري لكل قاعدة): يمر عبر مركز البوتات — مفتاح خدمة الصوت يبقى على الخادم
  const say=items.map(it=>{ const r=c.rules.find(x=>x.id===it.ruleId); if(!r||!r.over.tts||!r.over.ttsText) return null; const text=alFill(r.over.ttsText,it.vars).slice(0,200); return text?{id:"al_tts_"+it.id,kind:"reply",bot:"alerts",text,speech:text,show:false,say:true,user:{name:it.vars.display_name||""},at:now,test:!!it.test}:null }).filter(Boolean); if(say.length) out.push({t:"bot",items:say}) }catch(e){} }
/** سياق البوتات: بيانات الغرفة الحقيقية + آخر تخطيط وحسابات من لوحة التحكم */
function botCtx(R,now){ const c=R.botCtx||{}; return {now,D:R.D,H:R.H,C:R.C,DN:R.DN,DC:c.donCfg,layout:c.layout,socials:c.socials,live:R.live||!!c.forceLive,startedAt:R.C.timers.find(t=>t.id==="stream")?.startedAt||0} }
function botOut(R,ev,now,out){ if(!R.botCfg) return; R.B=R.B||newBotState(); try{ const items=botsOnEvent(R.botCfg,R.B,ev,botCtx(R,now)); if(items.length) out.push({t:"bot",items}) }catch(e){ R.B.stats.errors++ } }
/** إعدادات البوتات وسياقها (تصل مع التخطيط) */
/** إعدادات الأغاني تُحفظ داخل إعدادات البوتات (cfg.music) — بدون تغيير قاعدة البيانات */
/** مكتبة الأغاني القابلة للتشغيل (بيانات فقط — الملفات على الخادم). لا تُحفظ داخل حالة الغرفة؛ تُحمَّل من قاعدة البيانات */
export function roomMusicLib(R){ return R.MLIB||(R.C&&R.C.music&&R.C.music.lib)||[] }
export function roomMusicSetLib(R,lib){ R.MLIB=(lib||[]).slice(0,2000).map(t=>({id:String(t.id),title:String(t.title||"").slice(0,120),artist:String(t.artist||"").slice(0,80),dur:+t.dur||0,cover:t.cover&&String(t.cover).length<2000?String(t.cover):""})); if(R.C&&R.C.music) R.C.music.lib=[] }
/** طلب من صفحة الطلب العامة (مشاهد) — نفس القيود والطابور */
export function roomMusicRequest(R,trackId,user,now){ R.C.music=R.C.music||newMusicState(); const cfg=roomMusicCfg(R), M=R.C.music;
 if(cfg.page===false) return {res:{ok:false,reply:"صفحة طلب الأغاني متوقفة"},out:[]};
 const t=roomMusicLib(R).find(x=>x.id===String(trackId)); if(!t){ musicLog(M,now,"refused",{why:"الأغنية غير موجودة في المكتبة",by:user&&user.name}); return {res:{ok:false,reply:"الأغنية غير موجودة في المكتبة"},out:[]} }
 const res=musicAdd(M,cfg,t,{id:String(user.id||""),name:String(user.name||"").slice(0,40),platform:"page"},now,{via:"page"});
 if(!res.ok) musicLog(M,now,"refused",{why:res.reply,title:t.title,by:user.name});
 return {res,out:[{t:"clock",C:R.C,now,logs:[],mu:"req"}]} }
export function roomMusicCfg(R){ return {...defaultMusicCfg(),...((R.botCfg&&R.botCfg.music)||{})} }
function roomMusic(R,ev,now,out){ if(ev.type!=="comment"&&ev.type!=="follow") return; R.C.music=R.C.music||newMusicState(); const cfg=roomMusicCfg(R);
 if(ev.test&&ev.type==="follow") return; const r=musicOnEvent(R.C.music,cfg,ev.test?{...ev,user:{...(ev.user||{}),test:true}}:ev,now,roomMusicLib(R)); if(!r) return;
 if(r.changed) out.push({t:"clock",C:R.C,now,logs:[],mu:"cmd"});
 /* الرد: على الشاشة (ودجت البوت) + في شات المنصة نفسها إن كانت تسمح بالإرسال (YouTube / Twitch / Kick). TikTok لا يوفر إرسال رسائل */
 if(r.reply&&cfg.replies!==false) out.push({t:"bot",items:[{id:"mu_"+(ev.id||now),kind:"reply",bot:"music",text:r.reply,show:true,say:false,user:{name:"🎵 الأغاني"},at:now,...(cfg.chatReplies!==false&&!ev.test&&!ev.sim&&r.platform&&r.platform!=="tiktok"?{chat:r.platform}:{})}]}) }
/** تنفيذ قواعد «عندما ← إذا ← نفّذ» — كل إجراء له نتيجة مسجّلة (نجاح/فشل + السبب) */
function roomActions(R,ev,now,out){ const rules=R.botCfg&&R.botCfg.actions; if(!rules||!rules.length) return; R.ACT=R.ACT||newActState();
 const D=R.D||{}, tot=D.tot||{}; const donSum=((R.DN&&R.DN.list)||[]).filter(d=>!d.test&&!d.refunded).reduce((a,d)=>a+(+d.amount||0),0);
 const fires=actionsOnEvent(R.ACT,rules,ev,{now,totals:{likes:tot.likes||0,giftsValue:tot.gifts||0,follows:tot.follows||0,donations:donSum}});
 for(const f of fires){ const media=[], bot=[];
  for(const a of f.actions){
   switch(a.t){
    case "sound": case "video": case "gif": case "image": case "text": case "celebrate":
     if(a.t!=="text"&&a.t!=="celebrate"&&!a.src){ a.ok=false; a.why="لا يوجد ملف/رابط"; break }
     media.push({id:"ac_"+f.rule.id+"_"+now+"_"+media.length,kind:a.t,src:a.src||"",text:a.text||"",dur:Math.max(1,Math.min(60,+a.dur||5)),vol:a.vol??80,pos:a.pos||"center",user:(f.ev.user&&f.ev.user.name)||f.ev.name||"",test:!!f.ev.test}); a.ok=true; break;
    case "tts": bot.push({id:"act_tts_"+f.rule.id+now,kind:"reply",bot:"actions",text:a.text||"",speech:a.text||"",show:false,say:true,user:{name:"⚡"},at:now}); a.ok=true; break;
    case "reply": bot.push({id:"act_rp_"+f.rule.id+now,kind:"reply",bot:"actions",text:a.text||"",show:true,say:false,user:{name:"⚡ "+f.rule.name},at:now}); a.ok=true; break;
    case "subAdd": case "subSub": { const ms=Math.round((+a.sec||0)*1000*(f.mult||1))*(a.t==="subSub"?-1:1); const lg=subathonOp(R.C.subathon,{op:"add",ms,source:"action",reason:"⚡ "+f.rule.name},now); a.ok=!!(lg&&lg.length); if(!a.ok) a.why="السابثون غير مشغّل"; else out.push({t:"clock",C:R.C,now,logs:lg}); break }
    case "goalAdd": media.push({id:"ac_goal_"+now,kind:"goal",widgetId:a.widgetId||"",n:(+a.n||1)*(f.mult||1)}); a.ok=true; break;
    case "songAdd": { R.C.music=R.C.music||newMusicState(); const t=musicSearch(roomMusicLib(R),a.text||""); const r=musicAdd(R.C.music,roomMusicCfg(R),t,{id:"actions",name:"⚡ "+f.rule.name,owner:true},now,{force:true}); a.ok=r.ok; if(!r.ok) a.why=r.reply; else out.push({t:"clock",C:R.C,now,logs:[],mu:"act"}); break }
    case "songSkip": { R.C.music=R.C.music||newMusicState(); a.ok=!!R.C.music.current; if(a.ok){ musicNext(R.C.music,now,roomMusicCfg(R)); out.push({t:"clock",C:R.C,now,logs:[],mu:"act"}) } else a.why="لا توجد أغنية"; break }
    case "discord": case "telegram": out.push({t:"notify",channel:a.t,text:a.text||"",rule:f.rule.name,test:!!f.ev.test}); a.ok=true; a.why="أُرسل لخدمة الإشعارات"; break;
    default: a.ok=false; a.why="إجراء غير معروف";
   } }
  if(media.length) out.push({t:"act",items:media}); if(bot.length) out.push({t:"bot",items:bot});
  const bad=f.actions.filter(a=>a.ok===false); actLog(R.ACT,now,f.rule,f.ev,f.actions,!bad.length,bad.map(a=>a.t+": "+(a.why||"فشل")).join(" · ")) }
 out.push({t:"actlog",log:R.ACT.log.slice(0,30)}) }
export function roomBots(R,cfg,ctx){ R.botCfg=cfg||null; R.botCtx=ctx||{}; R.B=R.B||newBotState() }
/** أوامر لوحة التحكم للمؤقتات والسبثون */
export function roomClockOp(R,m,now){
 let logs=[];
 if(m.target==="music"){ R.C.music=R.C.music||newMusicState(); if(m.op==="lib"){ roomMusicSetLib(R,m.lib); return {out:[],logs:[]} } if(!musicOp(R.C.music,m,now,roomMusicCfg(R),roomMusicLib(R))) return {out:[],logs:[]}; return {out:[{t:"clock",C:R.C,now,logs:[],mu:m.op}],logs:[]} }
 if(m.target==="followers"){ R.C.followers=R.C.followers||{}; if(!followersOp(R.C.followers,m,now)) return {out:[],logs:[]}; return {out:[{t:"clock",C:R.C,now,logs:[],fc:m.platform}],logs:[]} }
 if(m.target==="alerts"){ // تحكم صندوق الآيرتات من اللوحة: تجربة قاعدة / تخطي / إيقاف / إعادة
  if(m.op==="test"){ const c=roomAlertCfg(R), r=c&&c.rules.find(x=>x.id===m.ruleId); if(!r) return {out:[],logs:[]}; const cu=m.vars&&typeof m.vars==="object"?Object.fromEntries(Object.entries(m.vars).filter(([k,v])=>typeof v==="string"&&v.length<300).slice(0,20)):{}; const v=Object.assign({username:"test_user",display_name:"مشاهد تجريبي",platform:"TikTok",likes:"100",total_likes:"1000",gift_name:"وردة",gift_count:"1",diamonds:"1",amount:"5",currency:"USD",message:"رسالة تجريبية",time_added:"0:30",time_removed:"0:30",goal:"1000",progress:"100%"},r.level?{level:r.level}:{},cu); /* بيانات تجربة مخصصة من اللوحة */ return {out:[{t:"alert",items:[{id:"test:"+now+":"+r.id,ruleId:r.id,alertId:r.alertId,event:r.event,vars:v,priority:r.priority,at:now,test:true}]}],logs:[]} }
  if(m.op==="testdon"){ // تجربة دعم: تمر بنفس منطق الشرائح لكنها لا تُسجَّل في الدونيشن ولا الإحصائيات
   const c=roomAlertCfg(R); if(!c) return {out:[],logs:[]}; const amt=Math.max(0,+m.amount||0); if(!(amt>0)) return {out:[],logs:[]};
   const ev={type:"donation",id:"testdon:"+now,test:true,provider:"test",amount:amt,currency:String(m.currency||c.don.base).toUpperCase().slice(0,3),name:String(m.name||"داعم تجريبي").slice(0,40),message:String(m.message||"").slice(0,200),avatar:String(m.avatar||"").slice(0,400)};
   const items=alertsOnEvent(c,{...alNewState()},ev,now); return {out:items.length?[{t:"alert",items}]:[{t:"status",text:"لا توجد شريحة تنطبق على "+amt+" "+ev.currency}],logs:[]} }
  if(m.op==="libtest"){ /* تجربة مستوى من مكتبة الأقسام: لا تمر على الدونيشن ولا الإحصائيات ولا عدادات التكبيس */
   const c=roomAlertCfg(R); if(!c) return {out:[],logs:[]}; R.ALT=R.ALT||{}; const tv=m.vars&&typeof m.vars==="object"?m.vars:{}; const items=alLibTest(c,R.ALT,String(m.sec||""),String(m.key||""),now,tv);
   return {out:items.length?[{t:"alert",items}]:[{t:"status",text:"لا يوجد مقطع مفعّل في هذا المستوى"}],logs:[]} }
  if(m.op==="fire"){ const c=roomAlertCfg(R), items=c?alertsManual(c,R.AL,m.ruleId,now):[]; return {out:items.length?[{t:"alert",items}]:[],logs:[]} }
  if(["skip","stop","replay","pause","resume"].includes(m.op)) return {out:[{t:"alertctl",op:m.op}],logs:[]}; return {out:[],logs:[]} }
 if(m.target==="subathon"){ logs=subathonOp(R.C.subathon,m,now); keep(R,logs); const out=[{t:"clock",C:R.C,now,logs}]; roomAlerts(R,null,logs,now,out); return {out,logs} }
 else if(m.target==="timers"){ // إضافة/حذف/ترتيب مؤقتات
  if(m.op==="create"){ if(R.C.timers.length<30) R.C.timers.push(newTimer(m.kind||"countdown",m.config||{})) }
  else if(m.op==="delete"){ if(m.id!=="stream") R.C.timers=R.C.timers.filter(t=>t.id!==m.id) }
 } else { const t=R.C.timers.find(x=>x.id===m.target); if(!t) return {out:[],logs:[]}; timerOp(t,m,now) }
 keep(R,logs); return {out:[{t:"clock",C:R.C,now,logs}],logs};
}
/** نبضة كل ثانية من الخادم */
export function roomTick(R,now){
 const logs=subathonTick(R.C.subathon,now); keep(R,logs); let changed=logs.length>0;
 const rep=sessionTick(R,now); if(rep) changed=true;
 const bo=[]; if(R.botCfg){ R.B=R.B||newBotState(); try{ const items=botsTick(R.botCfg,R.B,botCtx(R,now)); if(items.length) bo.push({t:"bot",items}) }catch(e){ R.B.stats.errors++ } }
 for(const t of R.C.timers) if(timerTick(t,now)) changed=true;
 if(rep) bo.push({t:"report",report:rep});
 return changed?{out:[{t:"clock",C:R.C,now,logs},...bo],logs}:{out:bo,logs:[]};
}
/** حالة الاتصال بالبث: إيقاف/استكمال السبثون تلقائياً حسب الإعداد، وتشغيل مؤقت مدة البث */
export function roomLive(R,live,now){
 const s=R.C.subathon, logs=[], was=!!R.live; R.live=live; sessionOnLive(R,live,now);
 if(!live&&s.pauseOnDisconnect&&s.status==="running") logs.push(...subathonOp(s,{op:"pause",auto:true},now));
 if(live&&s.autoPaused&&s.status==="paused") logs.push(...subathonOp(s,{op:"resume",auto:true},now));
 for(const t of R.C.timers) if(t.autoLive){ if(live&&t.status!=="running") timerOp(t,{op:t.status==="paused"?"resume":"start"},now); if(!live&&t.status==="running") timerOp(t,{op:"pause"},now) }
 keep(R,logs); const out=[{t:"clock",C:R.C,now,logs}];
 const gap=!R.liveOffAt||now-R.liveOffAt>5*60e3; if(!live&&was) R.liveOffAt=now;
 if(!live&&was){ const c=roomAlertCfg(R); if(c){ const items=alertsOnEnd(c,R.AL,now); if(items.length) out.push({t:"alert",items}) } }
 if(live&&!was&&gap){ const c=roomAlertCfg(R); if(c){ const items=alertsOnLive(c,R.AL,true,now); if(items.length) out.push({t:"alert",items}) } } // بداية جلسة جديدة فقط (لا عند إعادة اتصال قصيرة خلال 5 دقائق)
 return {out,logs};
}
export function roomSnapshot(R,now){ if(R.C&&R.C.subathon) migrateRules(R.C.subathon); return {t:"snapshot",CH:(R.CHAT||[]).slice(-60),BS:R.B?{stats:R.B.stats,log:R.B.log.slice(0,60)}:null,D:R.D,H:R.H,C:R.C,DN:R.DN,logs:R.logs||[],now} }

/** القارئ الصوتي لتنبيه المتابعة: مرة واحدة لكل حدث (من الغرفة، لا من كل نافذة مفتوحة) */
function faRoomTTS(R,ev,now,out){ const c=R.botCfg&&R.botCfg.falert; if(!c||!c.tts||ev.type!=="follow") return; const nm=String((ev.user&&(ev.user.name||ev.user.nick))||"").slice(0,40); if(!nm) return;
 const text=String(c.text||"يا هلا والله بـ {username}، نورتنا يا أسطورة!").replace(/\{(username|display_name)\}/g,nm).slice(0,200);
 out.push({t:"bot",items:[{id:"fa_tts_"+ev.id,kind:"reply",bot:"falert",text,speech:text,show:false,say:true,user:{name:nm},at:now,test:!!ev.test}]}) }
