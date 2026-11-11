// 🎬 مشاركة واستيراد تصاميم البث — محرك نقي: تصدير آمن (بدون بيانات صاحب التصميم)، تحقق، ترحيل إصدارات، استيراد بمعرفات جديدة، خطوات الإعداد، قوالب رسمية
import { TYPES, CANVASES, newWidget, migrateWidget, applyPreset, uid } from "./defs.js";

export const LS_VERSION=1;
export const LS_MAX_WIDGETS=120, LS_MAX_BYTES=1.5*1024*1024, LS_MAX_IMG=400*1024;
/** حقول شخصية لا تُنسخ أبداً (حسابات، أهداف، إحصائيات، قوائم حظر…) — تُعاد لقيمها الافتراضية عند المستورد */
export const LS_PRIVATE_KEYS=["accountId","acc","handle","goalId","streamName","banned","since","base","timerId","sound","importantWords","source","platform"];
const SECRET_RE=/(token|secret|password|passwd|api_?key|apikey|webhook|bearer|session|cookie|jwt|private|email|phone)/i;
export const LS_CATS={gaming:"🎮 ألعاب",chatting:"🎙️ شاتينق",support:"🎁 بثوث دعم",likes:"❤️ تحديات التكبيس",subathon:"⏱️ سابثون",contests:"🏆 مسابقات",royal:"💎 ملكي",girly:"🦋 بناتي",youth:"🔥 شبابي",transparent:"✨ شفاف",saudi:"🇸🇦 سعودي",b6o6:"🦆 B6O6 حصري"};
export const LS_SHAPES={horizontal:"🖥️ أفقي",vertical:"📱 عمودي",square:"🟦 مربع"};
export function lsShape(canvas,cw,ch){ const c=CANVASES[canvas]; const w=c?c.w:+cw||1080, h=c?c.h:+ch||1920; return Math.abs(w-h)<w*.05?"square":w>h?"horizontal":"vertical" }

/** نص آمن: بدون أكواد تنفيذية */
function lsSafeStr(v,max=2000){ v=String(v); if(/<\s*\/?\s*(script|iframe|object|embed|link|meta|style)\b|javascript:|on\w+\s*=/i.test(v)) return ""; return v.slice(0,max) }
/** الروابط: صور مضمّنة صغيرة فقط، أو ملفات آيرتات المنصة (يتحقق الخادم أنها عامة) — أي رابط خارجي يُحذف */
function lsSafeUrl(v){ v=String(v||""); if(/^data:image\/(png|jpe?g|gif|webp);base64,[A-Za-z0-9+/=]+$/.test(v)) return v.length<=LS_MAX_IMG*1.37?v:""; if(/^\/api\/alerts\/media\/[A-Za-z0-9_-]{6,40}$/.test(v)) return v; return "" }
function lsCleanVal(k,v,depth=0){
 if(v==null) return v; if(depth>6) return undefined;
 if(typeof v==="number") return Number.isFinite(v)?v:0; if(typeof v==="boolean") return v;
 if(typeof v==="string"){ if(/^(data:|https?:|\/\/|\/api\/|blob:)/i.test(v)) return lsSafeUrl(v)||undefined; return lsSafeStr(v) }
 if(Array.isArray(v)) return v.slice(0,200).map(x=>lsCleanVal(k,x,depth+1)).filter(x=>x!==undefined);
 if(typeof v==="object"){ const o={}; for(const [kk,vv] of Object.entries(v)){ if(SECRET_RE.test(kk)) continue; const c=lsCleanVal(kk,vv,depth+1); if(c!==undefined) o[kk]=c } return o }
 return undefined }
/** عنصر قابل للمشاركة: الشكل والترتيب فقط */
export function lsCleanWidget(w){ if(!w||!TYPES[w.type]) return null; const d=newWidget(w.type), o={};
 for(const [k,v] of Object.entries(w)){ if(k==="id"||SECRET_RE.test(k)) continue; if(LS_PRIVATE_KEYS.includes(k)){ if(k in d) o[k]=d[k]; continue } const c=lsCleanVal(k,v); if(c!==undefined) o[k]=c }
 for(const k of ["x","y","w","h","opacity"]) o[k]=Math.max(k==="w"||k==="h"?.005:-1,Math.min(k==="w"||k==="h"?2:2,+o[k]||0));
 o.z=Math.max(0,Math.min(999,Math.round(+o.z||0))); o.type=w.type; return o }
/** قواعد الآيرتات القابلة للمشاركة (بدون فلاتر مستخدمين محددين) */
export function lsCleanRules(rules){ return (Array.isArray(rules)?rules:[]).slice(0,60).map(r=>{ const c=lsCleanVal("rule",r)||{}; if(c.cond) c.cond={...c.cond,user:""}; delete c.id; return c }).filter(r=>r&&r.alertId) }

/** تصدير مشهد واحد أو عدة مشاهد (حزمة) أو عنصر واحد */
export function lsExport(layouts,opt={}){ const L=(Array.isArray(layouts)?layouts:[layouts]).filter(Boolean);
 const scenes=L.map(l=>({name:lsSafeStr(l.name||"مشهد",60),canvas:CANVASES[l.canvas]||l.canvas==="custom"?l.canvas:"vertical",cw:+l.cw||undefined,ch:+l.ch||undefined,widgets:(l.widgets||[]).map(lsCleanWidget).filter(Boolean).sort((a,b)=>a.z-b.z).slice(0,LS_MAX_WIDGETS)}));
 return {format:"b6o6.layout",v:LS_VERSION,kind:opt.kind||(scenes.length>1?"pack":"scene"),name:lsSafeStr(opt.name||scenes[0]&&scenes[0].name||"تصميم",60),scenes,alertRules:opt.rules?lsCleanRules(opt.rules):[],createdAt:new Date(opt.now||Date.now()).toISOString()} }
export function lsExportWidget(w,canvas){ const c=lsCleanWidget(w); return c?{format:"b6o6.layout",v:LS_VERSION,kind:"element",name:lsSafeStr(w.name||(TYPES[w.type]||{}).label||"عنصر",60),scenes:[{name:"عنصر",canvas:canvas||"vertical",widgets:[c]}],alertRules:[]}:null }

/** ترحيل الإصدارات القديمة: v0 = كائن مشهد خام {name,canvas,widgets} */
export function lsMigrate(o){ if(!o||typeof o!=="object") return null;
 if(!o.format&&Array.isArray(o.widgets)) return {format:"b6o6.layout",v:1,kind:"scene",name:o.name||"تصميم",scenes:[{name:o.name||"مشهد",canvas:o.canvas,cw:o.cw,ch:o.ch,widgets:o.widgets}],alertRules:[]};
 if(o.format==="b6o6.layout"&&o.v===1) return o; return null }
/** التحقق الكامل قبل المعاينة أو الحفظ في الخادم */
export function lsValidate(raw){ let o=raw; if(typeof o==="string"){ if(o.length>LS_MAX_BYTES) return {ok:false,error:"too_large"}; try{ o=JSON.parse(o) }catch(e){ return {ok:false,error:"bad_json"} } }
 o=lsMigrate(o); if(!o) return {ok:false,error:"bad_format"};
 const scenes=(Array.isArray(o.scenes)?o.scenes:[]).slice(0,10).map(s=>({name:lsSafeStr(s.name||"مشهد",60),canvas:CANVASES[s.canvas]||s.canvas==="custom"?s.canvas:"vertical",cw:Math.max(200,Math.min(7680,+s.cw||0))||undefined,ch:Math.max(200,Math.min(7680,+s.ch||0))||undefined,widgets:(Array.isArray(s.widgets)?s.widgets:[]).map(lsCleanWidget).filter(Boolean).slice(0,LS_MAX_WIDGETS)})).filter(s=>s.widgets.length||o.kind!=="element");
 if(!scenes.length||!scenes.some(s=>s.widgets.length)) return {ok:false,error:"empty"};
 const v={format:"b6o6.layout",v:LS_VERSION,kind:["scene","pack","element"].includes(o.kind)?o.kind:scenes.length>1?"pack":"scene",name:lsSafeStr(o.name||scenes[0].name,60)||"تصميم",scenes,alertRules:lsCleanRules(o.alertRules)};
 if(JSON.stringify(v).length>LS_MAX_BYTES) return {ok:false,error:"too_large"};
 return {ok:true,value:v,stats:lsStats(v)} }
export function lsStats(p){ const ws=p.scenes.flatMap(s=>s.widgets); const types=[...new Set(ws.map(w=>w.type))]; return {scenes:p.scenes.length,widgets:ws.length,types,shape:lsShape(p.scenes[0].canvas,p.scenes[0].cw,p.scenes[0].ch),canvas:p.scenes[0].canvas} }

/** استيراد: نسخة جديدة بمعرفات جديدة (لا تكرار)، مرتبطة بحساب المستورد. replace: يستبدل عناصر المشهد الحالي بعد نسخة احتياطية */
export function lsImport(pkg,opt={}){ const v=lsValidate(pkg); if(!v.ok) return v; const p=v.value, out=[];
 for(const s of p.scenes){ const widgets=s.widgets.map(w=>{ const n={...JSON.parse(JSON.stringify(w)),id:"w_"+uid()}; migrateWidget(n); return n });
  out.push({id:"l_"+uid(),name:opt.name&&p.scenes.length===1?opt.name:s.name,canvas:s.canvas,...(s.canvas==="custom"?{cw:s.cw,ch:s.ch}:{}),widgets}) }
 return {ok:true,layouts:out,rules:p.alertRules.map(r=>({...r,id:"r"+uid()})),kind:p.kind,needs:lsNeeds(out)} }
/** عنصر واحد يُضاف للمشهد الحالي في نفس مكانه وحجمه */
export function lsImportWidget(pkg){ const r=lsImport(pkg); if(!r.ok) return r; const w=r.layouts[0]&&r.layouts[0].widgets[0]; return w?{ok:true,widget:w,needs:lsNeeds(r.layouts)}:{ok:false,error:"empty"} }
/** النسخة الاحتياطية والاستبدال والتراجع */
export function lsReplace(current,imported){ const backup=JSON.parse(JSON.stringify(current)); const next={...current,canvas:imported.canvas,...(imported.canvas==="custom"?{cw:imported.cw,ch:imported.ch}:{}),widgets:imported.widgets}; return {backup,next} }

/** «أكمل إعداد تصميمك»: ما يحتاج ربطاً عند المستورد (لا يعيده لترتيب العناصر) */
export function lsNeeds(layouts){ const ws=layouts.flatMap(l=>l.widgets), has=f=>ws.some(f), T=w=>TYPES[w.type]||{}, out=[];
 if(has(w=>T(w).board||["lb","goal","levent","falert","fcount","uchat","sgoal","interact"].includes(w.type)||(w.type==="abox"&&!(w.abEvents||[]).every(e=>e==="donation")))) out.push({key:"tiktok",icon:"📡",title:"ربط TikTok",desc:"قوائم الداعمين والتكبيس والمتابعين تحتاج اتصال حسابك في TikTok LIVE.",go:"live"});
 if(has(w=>T(w).don||/^don/.test(w.type)||(w.type==="abox"&&(w.abEvents||[]).includes("donation")))) out.push({key:"donation",icon:"💸",title:"ربط الدونيشن",desc:"عناصر الدعم المالي تحتاج ربط Streamlabs أو StreamElements أو ميسّر.",go:"donalerts"});
 if(has(w=>w.type==="fcount")) out.push({key:"followers",icon:"👥",title:"اختيار حساب عداد المتابعين",desc:"اختر الحساب والهدف من صفحة عداد المتابعين.",go:"followers"});
 if(has(w=>T(w).soc)) out.push({key:"socials",icon:"🔗",title:"إضافة حسابات التواصل",desc:"العناصر الاجتماعية تعرض حساباتك أنت — أضف روابطك.",go:"socials"});
 if(has(w=>w.type==="subathon"||w.type==="srules")) out.push({key:"subathon",icon:"⏳",title:"قواعد السابثون",desc:"حدد الوقت الذي تضيفه الهدايا واللايكات والمتابعة.",go:"subathon"});
 if(has(w=>w.type==="donGoal"||w.type==="sgoal")) out.push({key:"goals",icon:"🎯",title:"تحديد أهداف الدعم",desc:"اختر هدفك ومبلغه — لا ننسخ أهداف صاحب التصميم.",go:"donations"});
 out.push({key:"obs",icon:"📋",title:"نسخ رابط OBS",desc:"انسخ رابط المشهد الجديد وأضفه مصدر متصفح.",go:"studio"});
 return out }

/** كود المشاركة: B6O6-XXXXXXXX (أحرف بدون التباس) — يُولَّد عشوائياً على الخادم */
export const LS_CODE_RE=/^B6O6-[A-HJ-NP-Z2-9]{8}$/;
export function lsNormCode(s){ s=String(s||"").trim().toUpperCase(); const m=/B6O6-?(?:LAYOUT-)?([A-HJ-NP-Z2-9]{8})/.exec(s); return m?"B6O6-"+m[1]:"" }
export function lsCodeFrom(bytes){ const A="ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let s=""; for(let i=0;i<8;i++) s+=A[bytes[i]%32]; return "B6O6-"+s }
/** كود كامل بدون خادم (للتجربة أو الملفات): B6O6L1: + base64 */
export function lsInline(p){ const j=JSON.stringify(p); const b=typeof btoa==="function"?btoa(unescape(encodeURIComponent(j))):Buffer.from(j,"utf8").toString("base64"); return "B6O6L1:"+b }
export function lsFromInline(s){ s=String(s||"").trim(); if(!s.startsWith("B6O6L1:")) return null; try{ const b=s.slice(7); const j=typeof atob==="function"?decodeURIComponent(escape(atob(b))):Buffer.from(b,"base64").toString("utf8"); return JSON.parse(j) }catch(e){ return null } }

/* ---------------- القوالب الرسمية ---------------- */
function lsMkTpl(id,name,cat,canvas,list,extra={}){ const cv=CANVASES[canvas]; const widgets=list.map(([t,o,p],i)=>{ const w=newWidget(t,{z:i+1,...o}); if(p) applyPreset(w,p,cv); return w }); return {id:"off_"+id,official:true,name,category:cat,canvas,shape:lsShape(canvas),...extra,pkg:lsExport([{name,canvas,widgets}],{name})} }
export function lsOfficial(){ return [
 lsMkTpl("gaming","قالب ألعاب احترافي","gaming","horizontal",[["likes",{design:"cyber",w:.2,h:.42,topN:5},"tr"],["gifts",{design:"fire",w:.2,h:.42,topN:5},"tl"],["timer",{design:"future",w:.18,h:.06},"bc"],["abox",{name:"صندوق الآيرتات",w:.4,h:.3},"tc"],["fcount",{w:.16,h:.08},"br"]]),
 lsMkTpl("chatting","قالب شاتينق","chatting","vertical",[["uchat",{w:.9,h:.3},"bc"],["likes",{design:"glass",w:.42,h:.24,topN:3},"tr"],["recentGifts",{w:.42,h:.2},"tl"],["falert",{w:.8,h:.2},"mc"]]),
 lsMkTpl("subathon","قالب سابثون","subathon","vertical",[["subathon",{design:"b6o6",w:.7,h:.1},"tc"],["srules",{w:.44,h:.3},"ml"],["gifts",{design:"podium",w:.46,h:.3,topN:5},"mr"],["abox",{w:.8,h:.25},"bc"]]),
 lsMkTpl("likes","قالب تحدي تكبيس","likes","vertical",[["goal",{w:.84,h:.08},"tc"],["likes",{design:"neon",w:.44,h:.36,topN:10},"mr"],["interact",{w:.44,h:.3},"ml"],["levent",{w:.6,h:.12},"bc"]]),
 lsMkTpl("support","قالب دعم ودونيشن","support","vertical",[["donGoal",{w:.84,h:.09},"tc"],["donBoard",{w:.44,h:.32},"mr"],["donLatest",{w:.44,h:.12},"ml"],["abox",{name:"Donation Alert Box",abEvents:["donation"],w:.8,h:.3},"bc"]]),
 lsMkTpl("girly","قالب بناتي بفراشات","girly","vertical",[["lb",{design:"butterflyGarden",w:.46,h:.36},"mr"],["falert",{design:"fa_hearts_1",w:.8,h:.2},"bc"],["fcount",{w:.36,h:.08},"tl"]]),
 lsMkTpl("royal","قالب ملكي ذهبي","royal","vertical",[["lb",{design:"royalCrown",w:.5,h:.4},"mr"],["gifts",{design:"b6o6",w:.42,h:.3},"ml"],["subathon",{design:"b6o6",w:.62,h:.09},"tc"]]),
 lsMkTpl("transparent","قالب شفاف بالكامل","transparent","vertical",[["likes",{design:"glass",w:.4,h:.28,topN:5,bgOpacity:0},"tr"],["recentFollows",{w:.4,h:.2,bgOpacity:0},"tl"],["abox",{w:.8,h:.28},"bc"]]),
 lsMkTpl("tiktok","قالب عمودي لـ TikTok","b6o6","vertical",[["likes",{design:"neon",w:.4,h:.3,topN:5},"mr"],["gifts",{design:"b6o6",w:.4,h:.3,topN:5},"ml"],["goal",{w:.8,h:.07},"tc"],["fcount",{w:.34,h:.07},"bl"],["abox",{w:.8,h:.22},"bc"]]),
 lsMkTpl("wide","قالب أفقي لـ YouTube وKick وTwitch","gaming","horizontal",[["uchat",{w:.24,h:.6},"mr"],["gifts",{design:"fire",w:.2,h:.36},"tl"],["timer",{design:"future",w:.16,h:.06},"tc"],["abox",{w:.4,h:.3},"bc"]]),
 lsMkTpl("square","قالب مربع للمسابقات","contests","square",[["lb",{w:.46,h:.5},"ml"],["goal",{w:.84,h:.09},"tc"],["levent",{w:.44,h:.3},"mr"]]),
] }
