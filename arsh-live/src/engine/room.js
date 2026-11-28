// ====== غرفة البث: تربط المحركات الثلاثة دون خلطها ======
// استقبال الأحداث → (منع التكرار) → محرك القوائم + محرك السبثون/المؤقتات → رسائل للعرض
// نفس الكود يعمل على الخادم (الوضع الحقيقي) وفي المتصفح (وضع التجربة بدون خادم).
import { newBattle, battleOp, battleOnEvent, battleTick } from "./battle.js";
import { emptyData, applyEvent } from "./leaderboard.js";
import { emptyDonations, applyDonation } from "./donations.js";
import { followersOp, followersOnEvent } from "./followers.js";
import { latestOnEvent } from "./latest.js";
import { normalizeEvent } from "./events.js";
import { chatPush } from "./chat.js";
import { topsOnEvent } from "./tops.js";
import { sessionOnLive, sessionTick, sessionOnEvent } from "./poststats.js";
import { actionsOnEvent, newActState, actLog } from "./actions.js";
import { musicOnEvent, musicOp, newMusicState, defaultMusicCfg, musicSearch, musicAdd, musicNext, musicLog, musicAddedText } from "./music.js";
import { botsOnEvent, botsTick, newBotState } from "./bots.js";
import { alCfg, alFill, alNewState, alertsOnEvent, alertsOnLogs, alertsOnLive, alertsOnEnd, alertsManual, alLibTest } from "./alerts.js";
import { giftStreak, glogPush } from "./giftstreak.js";
import { modState, modApply, modPin, modCheck, modAutoState, modAutoCfg, modKey } from "./chatmod.js";
import { chatMsgOf } from "./chat.js";
import { sndCfg, sndNewState, sndOnEvent, sndOnLogs, sndSessionReset, sndManual, SND_EVENTS } from "./sounds.js";
import { liveState, sessDecide, sessOpen, sessClose, sessPublic, okStart } from "./session.js";
import { statsState, statsOnEvent, statsViewers, statsOffline } from "./livestats.js";
import { newClockState, giftCoins, subathonOp, subathonOnEvent, subathonOnDonation, migrateRules, subathonTick, timerOp, timerTick, newTimer } from "./clock.js";

const LIVE_TYPES=new Set(["like","gift","comment","superchat","cheer","raid","follow","subscribe","share","join","reset","shuffle","donation","donation_refund","donation_session","donation_clear_tests"]);
const DON_TYPES=new Set(["donation","donation_refund","donation_session","donation_clear_tests"]);
export function newRoom(){ return {D:emptyData(),H:[],C:newClockState(),DN:emptyDonations(),seen:new Map(),live:false,logs:[]} }
function keep(R,logs){ if(!logs.length) return; R.logs=(R.logs||[]); for(const l of logs) R.logs.unshift(l); if(R.logs.length>300) R.logs.length=300 }

/** حدث بث (حقيقي أو تجريبي). يرجع {out: رسائل للبث للعملاء, logs: سجلات وقت للحفظ} */
/** منع التكرار: نافذة زمنية (10 دقائق) بدل عدد ثابت — في الإكسبلور تصل آلاف الأحداث في دقيقة فكانت المعرفات القديمة تُنسى بسرعة */
function seenPrune(S,now){ const lim=now-600000; for(const [k,t] of S){ if(S.size<=20000||t>=lim) break; S.delete(k) } if(S.size>60000){ const it=S.keys(); while(S.size>50000) S.delete(it.next().value) } }
export function roomEvent(R,ev,now){
 if(!ev||!LIVE_TYPES.has(ev.type)) return {out:[],logs:[]};
 // أحداث متأخرة من بث سابق (roomId مختلف عن الجلسة الحالية، أو من جلسة أُغلقت) لا تغيّر أرقام البث الجديد
 if(ev.lr!=null&&R.C&&R.C.live&&R.C.live.roomId&&(String(ev.lr)!==String(R.C.live.roomId)||(R.C.live.endedAt&&ev.type==="like"))) return {out:[],logs:[],stale:true};
 ev=normalizeEvent(ev,{now}); if(!ev) return {out:[],logs:[],bad:true};
 // التبرعات: محرك مستقل لا يلمس قوائم TikTok
 if(DON_TYPES.has(ev.type)){ R.DN=R.DN||emptyDonations(); ev.t=ev.t||now; if(!applyDonation(R.DN,ev)) return {out:[],logs:[],dup:true};
  // الدونيشن المؤكد فقط يصل هنا (المزوّد تحقق منه) ومرة واحدة فقط (applyDonation يمنع التكرار)
  R.C.latest=R.C.latest||{}; latestOnEvent(R.C.latest,ev,now);
  R.CHAT=R.CHAT||[]; chatPush(R.CHAT,ev);
  const out=[{t:"event",ev}], logs=ev.type==="donation"?subathonOnDonation(R.C.subathon,ev,now):[]; keep(R,logs); if(logs.length) out.push({t:"clock",C:R.C,now,logs});
 roomActions(R,ev,now,out); if(ev.type==="donation"){ const nm=String(ev.name||""), cur=String(ev.currency||"").toUpperCase(); ev.donorTotal=nm&&!ev.anonymous?R.DN.list.filter(d=>d.name===nm&&d.currency===cur&&!d.test).reduce((a,d)=>a+Math.max(0,d.amount-(d.refunded||0)),0):""; }
 if((ev.type==="donation"||ev.type==="donation_refund")&&statsOnEvent(R.C,ev,now)) out.push({t:"stats",ST:R.C.stats});
 roomAlerts(R,ev,logs,now,out); roomSounds(R,ev,logs,now,out); botOut(R,ev,now,out); return {out,logs} }
 // هدايا TikTok: السلاسل ترسل عدداً تراكمياً — نحتسب الزيادة الجديدة فقط (وسجل الهدايا يوضح كل حدث)
 let gdiag=null;
 if(ev.type==="gift"){ const g=giftStreak(R.C,ev,now); gdiag=g.diag; if(!g.ev){ const it=glogPush(R.C,gdiag); return {out:[{t:"glog",it}],logs:[],gsdup:true} } ev=g.ev }
 if(ev.id){ if(R.seen.has(ev.id)) return {out:[],logs:[],dup:true}; R.seen.set(ev.id,now); if(R.seen.size>20000) seenPrune(R.seen,now) }
 ev.t=ev.t||now;
 applyEvent(R.D,R.H,ev);
 const out=[{t:"event",ev}];
 const logs=subathonOnEvent(R.C.subathon,ev,now,R.D.tot); keep(R,logs);
 R.C.latest=R.C.latest||{}; latestOnEvent(R.C.latest,ev,now);
 R.CHAT=R.CHAT||[]; chatPush(R.CHAT,ev);
 roomAutoMod(R,ev,now,out);
 roomMusic(R,ev,now,out);
 sessionOnEvent(R,ev);
 faRoomTTS(R,ev,now,out);
 R.C.tops=R.C.tops||{}; topsOnEvent(R.C.tops,ev,now,(R.botCfg&&R.botCfg.tzMin)??180);
 roomActions(R,ev,now,out);
 if(R.C.battle&&battleOnEvent(R.C.battle,ev,now)){ if(ev.type==="like") R.btDirty=true; else if(!logs.length) out.push({t:"clock",C:R.C,now,logs:[],bt:1}) } // تحدي الفريقين: الهدايا فوراً، التكبيس مجمّع كل ثانية
 if(ev.type==="follow"){ R.C.followers=R.C.followers||{}; if(followersOnEvent(R.C.followers,ev,now)&&!logs.length) out.push({t:"clock",C:R.C,now,logs:[],fc:"tiktok"}) }
 if(statsOnEvent(R.C,ev,now)) out.push({t:"stats",ST:R.C.stats}); // إحصائيات البث: دعم الجلسة بوحدته الأصلية
 if(gdiag){ const mine=logs.filter(l=>l.eventId===ev.id), ms=mine.reduce((a,l)=>a+(+l.deltaMs||0),0), capped=mine.some(l=>l.requestedMs!==l.deltaMs);
  const it=glogPush(R.C,gdiag,{ms,why:ms?"":giftWhy(R.C.subathon,ev)}); if(capped) it.why="وصل السبثون للحد الأقصى — أُضيف جزء من الوقت"; out.push({t:"glog",it}) }
 if(logs.length) out.push({t:"clock",C:R.C,now,logs});
 roomAlerts(R,ev,logs,now,out); roomSounds(R,ev,logs,now,out);
 botOut(R,ev,now,out);
 return {out,logs};
}
/** سبب عدم إضافة وقت لهدية (لسجل الهدايا) — بدون تخمين قيم */
function giftWhy(s,ev){ if(!s) return "السبثون غير مُعد";
 if(!(s.status==="running"||(s.status==="paused"&&s.countWhilePaused))) return s.status==="paused"?"السبثون متوقف مؤقتاً":"السبثون غير مشغّل";
 const R=s.rules||{}; if(R.auto===false) return "الإضافة التلقائية مطفأة";
 const mode=R.giftMode||"gifts_first", L=R.list||[];
 const hasGift=L.some(r=>r.kind==="gift"&&r.enabled), hasCoins=L.some(r=>r.kind==="coins"&&r.enabled);
 if(mode==="gifts"&&!hasGift) return "لا توجد قاعدة هدايا مفعّلة";
 if(mode!=="gifts"&&R.coinsOn!==false&&hasCoins&&giftCoins(R,ev)==null) return "قيمة الهدية بالكوين غير معروفة — حددها يدوياً في قواعد الهدايا";
 if(mode!=="gifts"&&hasCoins) return "يتجمع مع الهدايا القادمة حتى يكتمل حد الكوين (أو فترة انتظار القاعدة)";
 return "لا توجد قاعدة مطابقة لهذه الهدية (أو فترة انتظار القاعدة)" }
/** صندوق الآيرتات: القواعد تأتي من إعدادات المستخدم (botCfg.alerts) — الغرفة مصدر واحد فلا يتكرر الآيرت بين روابط OBS */
function roomAlertCfg(R){ const raw=R.botCfg&&R.botCfg.alerts; if(!raw) return null; if(R.ALraw!==raw){ R.ALraw=raw; R.ALc=alCfg(raw) } R.AL=R.AL||alNewState(); return R.ALc }
/* ===== إدارة الشات: الإشراف التلقائي (محلي افتراضياً) ===== */
function roomAutoMod(R,ev,now,out){ if(ev.type!=="comment"||ev.test) return; const M=modState(R.C); if(!M.auto.on) return; R.AM=R.AM||modAutoState(); const m=chatMsgOf(ev); if(!m) return;
 let v=null; try{ v=modCheck(M.auto,R.AM,M,m,now) }catch(e){ return } if(!v) return;
 const base={platform:m.platform,uid:m.uid,name:m.name,msgId:m.id,auto:true,reason:v.reason};
 if(v.action==="warn"){ M.log.unshift({at:now,act:"warn",platform:m.platform,uid:m.uid,name:m.name,msgId:m.id,auto:true,reason:v.reason}); if(M.log.length>100) M.log.length=100 }
 else { modApply(M,{...base,act:"hide"},now); if(v.action==="timeout") modApply(M,{...base,act:"timeout",sec:M.auto.timeoutSec},now); if(v.action==="ban") modApply(M,{...base,act:"ban"},now);
  // على المنصة الأصلية: فقط إذا فعّله صانع المحتوى صراحةً (معطّل افتراضياً) والخادم يتحقق من الربط والصلاحيات
  if(M.auto.native&&v.action!=="hide") out.push({t:"modnative",a:{...base,act:v.action,sec:M.auto.timeoutSec}}) }
 out.push({t:"clock",C:R.C,now,logs:[],cm:1}) }
/* ===== مكتبة الأصوات: القرار هنا (مصدر واحد) — رابط OBS يشغّل فقط ===== */
function roomSoundCfg(R){ const raw=R.botCfg&&R.botCfg.sounds; if(!raw) return null; if(R.SNDraw!==raw){ R.SNDraw=raw; R.SNDc=sndCfg(raw) } R.SND=R.SND||sndNewState(); return R.SNDc }
function roomSoundGoals(R){ const L=R.botCtx&&R.botCtx.layout, v=R.D&&R.D.tot?R.D.tot.likes:0; return (L&&Array.isArray(L.widgets)?L.widgets:[]).filter(w=>w&&w.type==="goal"&&+w.target>0).map(w=>({id:"lk:"+w.id+":"+w.target,kind:"likes",target:+w.target,value:v})) }
function roomSounds(R,ev,logs,now,out){ const c0=roomSoundCfg(R), c=c0&&c0.on?c0:null; R.SND=R.SND||sndNewState(); if(!c&&!(logs&&logs.length)) return; try{
  const ac=roomAlertCfg(R), ctx={totalLikes:R.D&&R.D.tot?R.D.tot.likes:0,goals:roomSoundGoals(R),explore:!!R.explore,rates:ac&&ac.don&&ac.don.rates};
  const items=[...(ev&&c?sndOnEvent(c,R.SND,ev,now,ctx):[]),...sndOnLogs(c,R.SND,logs||[],now,{rules:R.C&&R.C.subathon&&R.C.subathon.rules&&R.C.subathon.rules.list,soundsOff:R.C&&R.C.subathon&&R.C.subathon.soundsOff})]; if(items.length) out.push({t:"snd",items}) }catch(e){} }
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
/** نتيجة بحث YouTube لطلب من الشات: إضافة للقائمة + رد بالاسم (أو سبب الفشل) — نفس قيود الطلب */
export function roomMusicFound(R,s,res,now){ R.C.music=R.C.music||newMusicState(); const M=R.C.music, cfg=roomMusicCfg(R), out=[], u=s.user||{}, at="@"+(u.name||u.id||"مشاهد");
 let text="", changed=false;
 if(!res||!res.ok){ const why=res&&res.message||"تعذر البحث"; musicLog(M,now,"refused",{why,by:u.name,via:s.plat,title:String(s.q).slice(0,60)}); text=`${at} ${why}`; }
 else { const t=res.track; musicLog(M,now,"found",{title:t.title,by:u.name,via:s.plat,why:res.cached?"من الكاش":""}); const r=musicAdd(M,cfg,t,u,now,{via:"chat"}); if(!r.ok){ musicLog(M,now,"refused",{why:r.reply,title:t.title,by:u.name}); text=`${at} ${r.reply}` } else { changed=true; text=musicAddedText(t,r,at) } }
 out.push({t:"clock",C:R.C,now,logs:[],mu:"found"});
 if(text&&cfg.replies!==false) out.push({t:"bot",items:[{id:"mu_f"+now+Math.random().toString(36).slice(2,6),kind:"reply",bot:"music",text,show:true,say:false,user:{name:"🎵 الأغاني"},at:now,...(cfg.chatReplies!==false&&!s.test&&s.plat&&s.plat!=="tiktok"?{chat:s.plat}:{})}]});
 return {out,changed} }
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
 if(r.search){ out.push({t:"musicsearch",q:r.search.q,user:r.search.user,plat:r.search.plat,test:!!ev.test,cfg:{maxDurSec:cfg.maxDurSec||0,region:cfg.ytRegion||"SA"}}); out.push({t:"clock",C:R.C,now,logs:[],mu:"search"}); return }
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
 // القوائم المتناوبة: إيقاف/استئناف/تثبيت/التالي/السابق — تُحفظ في حالة الغرفة وتصل لكل الروابط فوراً
 if(m.target==="rot"){ const id=String(m.wid||"").slice(0,40); if(!/^[\w-]{2,40}$/.test(id)) return {out:[],logs:[]}; R.C.rot=R.C.rot||{}; const c=R.C.rot[id]=R.C.rot[id]||{paused:false,pin:"",seq:0};
  const op=m.op; if(op==="pause") c.paused=true; else if(op==="resume"){ c.paused=false; c.pin="" } else if(op==="pin") c.pin=String(m.item||"").slice(0,40); else if(op==="unpin") c.pin=""; else if(op==="next"||op==="prev"){ c.pin=""; c.cmd=op } else if(op==="toggle"){ c.paused=!c.paused; if(!c.paused) c.pin="" } else return {out:[],logs:[]};
  c.seq=(+c.seq||0)+1; c.at=now; const ks=Object.keys(R.C.rot); if(ks.length>60) delete R.C.rot[ks[0]];
  return {out:[{t:"clock",C:R.C,now,logs:[],rot:id}],logs:[]} }
 if(m.target==="battle"){ R.C.battle=R.C.battle||newBattle(); if(!battleOp(R.C.battle,m,now)) return {out:[],logs:[]}; return {out:[{t:"clock",C:R.C,now,logs:[],bt:1}],logs:[]} }
 if(m.target==="followers"){ R.C.followers=R.C.followers||{}; if(!followersOp(R.C.followers,m,now)) return {out:[],logs:[]}; return {out:[{t:"clock",C:R.C,now,logs:[],fc:m.platform}],logs:[]} }
 if(m.target==="chatmod"){ // إدارة الشات من اللوحة / الشات العائم
  const M=modState(R.C), a=m.a&&typeof m.a==="object"?m.a:{}, ok=s=>/^[a-z]{3,10}$/.test(String(s||""));
  if(m.op==="act"&&ok(a.platform)&&a.uid!=null){ const e=modApply(M,{act:a.act,platform:a.platform,uid:String(a.uid).slice(0,80),name:a.name,msgId:a.msgId?String(a.msgId).slice(0,120):"",sec:+a.sec||0},now); if(!e) return {out:[],logs:[]};
   const out=[{t:"clock",C:R.C,now,logs:[],cm:1}]; if(a.native) out.push({t:"modnative",a:{act:a.act,platform:a.platform,uid:String(a.uid),name:a.name,msgId:a.msgId||"",sec:+a.sec||0}}); return {out,logs:[]} }
  if(m.op==="pin"){ const msg=(R.CHAT||[]).find(x=>x.id===m.msgId)||(m.msg&&typeof m.msg==="object"?m.msg:null); if(!modPin(M,msg,Math.max(0,+m.sec||0),now)) return {out:[],logs:[]}; return {out:[{t:"clock",C:R.C,now,logs:[],cm:1}],logs:[]} }
  if(m.op==="unpin"){ M.pin=null; return {out:[{t:"clock",C:R.C,now,logs:[],cm:1}],logs:[]} }
  if(m.op==="auto"){ M.auto=modAutoCfg(m.auto); R.AM=modAutoState(); return {out:[{t:"clock",C:R.C,now,logs:[],cm:1}],logs:[]} }
  return {out:[],logs:[]} }
 if(m.target==="sounds"){ // لوحة التشغيل السريع / «تشغيل الآن» / إيقاف — من لوحة التحكم فقط
  const c=roomSoundCfg(R)||sndCfg({});
  if(m.op==="play"){ const it=sndManual(c,m.s,now,{test:!!m.test}); return {out:it?[{t:"snd",items:[it]}]:[],logs:[]} }
  if(m.op==="stop"||m.op==="stopall") return {out:[{t:"snd",stop:m.op==="stopall"?"all":"cur"}],logs:[]};
  if(m.op==="test"){ const r=c.rules.find(x=>x.id===m.ruleId); if(!r||!r.sounds.length) return {out:[],logs:[]}; const s=r.sounds[Math.floor(Math.random()*r.sounds.length)];
   return {out:[{t:"snd",items:[{id:"t"+now.toString(36),rule:r.id,ev:r.ev,s,prio:(SND_EVENTS[r.ev]||{}).prio||10,at:now,merged:0,test:true}]}],logs:[]} }
  return {out:[],logs:[]} }
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
 if(m.target==="subathon"){ logs=subathonOp(R.C.subathon,m,now); keep(R,logs); const out=[{t:"clock",C:R.C,now,logs}]; roomAlerts(R,null,logs,now,out); roomSounds(R,null,logs,now,out); return {out,logs} }
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
 if(R.C.battle&&battleTick(R.C.battle,now)) changed=true; if(R.btDirty){ R.btDirty=false; changed=true }
 if(rep) bo.push({t:"report",report:rep});
 if(logs.length){ const so=[]; roomSounds(R,null,logs,now,so); bo.push(...so) }
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

/* ====== جلسات البث: تصفير بيانات الجلسة فقط ====== */
/** يصفّر بيانات البث (التكبيس دائماً + النطاقات المختارة) ويرجع رسائل التحديث لكل الطبقات — الإعدادات والتصاميم والأهداف المحددة ووقت السبثون لا تُلمس */
export function roomSessionReset(R,now,scopes){ const L=liveState(R.C), sc=scopes||L.scopes||{}, out=[];
 if(R.SND) sndSessionReset(R.SND); // مراحل التكبيس والأهداف الصوتية تبدأ من جديد مع البث الجديد
 const list=["likes","interact",...["gifts","comments","follows"].filter(k=>sc[k])];
 for(const s of list){ const r=roomEvent(R,{type:"reset",scope:s,id:`sr:${L.sid||"m"}:${s}:${now}`,t:now},now); out.push(...r.out) }
 if(R.C.latest){ delete R.C.latest.like; if(sc.gifts) delete R.C.latest.gift; if(sc.follows) delete R.C.latest.follow; if(sc.comments) delete R.C.latest.comment } // آخر شخص كبس
 if(R.C.battle&&+R.C.battle.likePts>0) battleOp(R.C.battle,{op:"reset"},now); // تحدي التكبيس: الإعدادات تبقى والنقاط تُصفّر
 const s=R.C.subathon; if(s&&s.rstate&&s.rstate.acc){ for(const r of (s.rules&&s.rules.list)||[]) if(r.kind==="likes") delete s.rstate.acc[r.id]; s.likeAcc=0 } // بقايا تكبيس البث السابق لا تُحتسب في السبثون — الوقت المتبقي لا يُلمس
 if(R.ACT&&R.botCfg&&Array.isArray(R.botCfg.actions)) for(const a of R.botCfg.actions){ const tr=a.trigger||{}; if(tr.type==="likes"&&R.ACT.acc) delete R.ACT.acc[a.id]; if(tr.type==="goal"&&tr.metric==="likes"&&R.ACT.goalsHit) delete R.ACT.goalsHit[a.id] } // مراحل أهداف التكبيس تبدأ من جديد
 if(R.AL&&typeof R.AL==="object"){ if("tl" in R.AL) R.AL.tl=0; if(R.AL.ul) R.AL.ul={} } // تنبيهات مراحل اللايك: عدّاد جديد (لا تعاد تنبيهات المراحل القديمة)
 R.D.startedAt=now; R.btDirty=false;
 out.push({t:"clock",C:R.C,now,logs:[]});
 return out }
/** بدء جلسة جديدة (تلقائي عند بث جديد أو يدوي): يغلق السابقة ويحفظ إحصائياتها، ثم يصفّر */
export function roomSessionStart(R,now,o={}){ const L=liveState(R.C);
 if(!L.sid&&L.keep!==false&&R.D&&R.D.tot&&(R.D.tot.likes||0)>0){ L.sid="pre"+now.toString(36); L.roomId=null; L.startedAt=R.D.startedAt||now; L.endedAt=null } // بيانات قبل نظام الجلسات: تُحفظ كجلسة سابقة بدل أن تضيع
 sessClose(L,R.D,now,o.why||"new"); sessOpen(L,{roomId:o.roomId??null,now,source:o.source||"manual",startAt:o.startAt});
 const out=o.reset===false?[]:roomSessionReset(R,now);
 statsState(R.C); out.push({t:"stats",ST:R.C.stats}); // إحصائيات جلسة جديدة تبدأ من الصفر
 out.push({t:"session",S:sessPublic(L),started:true,reset:o.reset!==false});
 return {out,logs:[],session:true} }
/** اتصال بـ TikTok نجح ومعه roomId: نفس البث = استمرار، بث جديد = جلسة جديدة (مع التصفير إن كان مفعّلاً) */
export function roomSessionConnect(R,roomId,now,o={}){ const L=liveState(R.C), d=sessDecide(L,roomId,now), st=okStart(o.startAt,now);
 if(d.act==="same"){ let ch=false; if(d.id&&!L.roomId){ L.roomId=d.id; ch=true } if(st&&!L.streamStart&&(!L.roomId||!d.id||String(L.roomId)===d.id)){ L.streamStart=st; ch=true } // وقت البدء الحقيقي يصل لاحقاً (مثلاً بعد إعادة تشغيل الخادم)
  return ch?{out:[{t:"session",S:sessPublic(L)}],logs:[],act:"same"}:{out:[],logs:[],act:"same"} }
 if(d.act==="resume"){ L.endedAt=null; L.endWhy=""; L.history=L.history.filter(h=>h.sid!==L.sid); if(L.durAdded){ L.durAcc=Math.max(0,(+L.durAcc||0)-L.durAdded); L.durAdded=0 } if(st&&!L.streamStart) L.streamStart=st; return {out:[{t:"session",S:sessPublic(L)}],logs:[],act:"resume"} }
 if(d.act==="first"){ // أول جلسة: إن كانت لدينا بيانات من قبل نظام الجلسات فهي من بث سابق غير معروف — تُصفّر فقط إن كان التصفير التلقائي مفعّلاً
  const had=(R.D&&R.D.tot&&(R.D.tot.likes||0))>0; const r=roomSessionStart(R,now,{roomId:d.id,source:"tiktok",why:"first",reset:L.auto!==false&&had,startAt:st}); return {...r,act:"first"} }
 const r=roomSessionStart(R,now,{roomId:d.id,source:"tiktok",why:"new_stream",reset:L.auto!==false,startAt:st}); return {...r,act:"new"} }
/** انتهاء البث (حدث STREAM_END من TikTok): يُغلق ويحفظ الإحصائيات بدون تصفير — الأرقام تبقى ظاهرة حتى يبدأ بث جديد */
export function roomSessionEnd(R,now,why){ const L=liveState(R.C); if(!sessClose(L,R.D,now,why||"stream_end")) return {out:[],logs:[]}; return {out:[{t:"session",S:sessPublic(L),ended:true}],logs:[]} }
/** أوامر من لوحة التحكم: إعدادات / تصفير يدوي / جلسة جديدة */
export function roomSessionOp(R,m,now){ const L=liveState(R.C);
 if(m.op==="config"){ const c=m.config||{}; if(c.auto!==undefined) L.auto=!!c.auto; if(c.keep!==undefined) L.keep=!!c.keep; if(c.scopes&&typeof c.scopes==="object") for(const k of ["gifts","comments","follows"]) if(k in c.scopes) L.scopes[k]=!!c.scopes[k]; return {out:[{t:"session",S:sessPublic(L)}],logs:[]} }
 if(m.op==="resetNow"){ const out=roomSessionReset(R,now); out.push({t:"session",S:sessPublic(L),reset:true}); return {out,logs:[]} }
 if(m.op==="newSession") return roomSessionStart(R,now,{roomId:null,source:"manual",why:"manual"});
 if(m.op==="clearHistory"){ L.history=[]; return {out:[{t:"session",S:sessPublic(L)}],logs:[]} }
 // مدة البث: استمرار بين البثوث، بدء/إيقاف يدوي، العودة للتلقائي، تصفير المتراكم
 const pub=()=>({out:[{t:"session",S:sessPublic(L)}],logs:[]});
 if(m.op==="durCarry"){ L.durCarry=!!m.on; if(!L.durCarry){ L.durAcc=0; L.durAdded=0 } return pub() }
 if(m.op==="durStart"){ L.durMan={sid:L.sid||null,at:now,stop:null}; return pub() }
 if(m.op==="durStop"){ const st=(L.durMan&&L.durMan.at&&(L.durMan.sid==null||L.durMan.sid===L.sid))?L.durMan.at:(L.sid?(L.streamStart||L.startedAt):null); if(!st) return {out:[],logs:[]}; L.durMan={sid:L.sid||null,at:st,stop:now}; return pub() }
 if(m.op==="durAuto"){ L.durMan=null; return pub() }
 if(m.op==="durAccReset"){ L.durAcc=0; L.durAdded=0; return pub() }
 return {out:[],logs:[]} }
/** أرقام المشاهدين من منصة (TikTok roomUser / YouTube / Twitch / Kick) → رسالة stats لكل الواجهات */
export function roomStats(R,platform,data,now){ const ch=data&&data.offline?statsOffline(R.C,platform):statsViewers(R.C,platform,data||{},now); return ch?{out:[{t:"stats",ST:R.C.stats}],logs:[]}:{out:[],logs:[]} }
