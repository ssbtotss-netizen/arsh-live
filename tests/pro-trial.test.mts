// PRO + التجربة من أول بث: منطق الخادم (plans.js)
import { subStatus, trialStartPatch, proDesignsIn, proViolations, isProDesign, TRIAL_PENDING_CAP_DAYS } from "../arsh-live/src/engine/plans.js";
let pass=0,fail=0; const ok=(c:any,m:string)=>{ c?pass++:(fail++,console.log("FAIL",m)) };
const now=Date.parse("2026-11-17T12:00:00Z"), day=864e5, cfg={trialEnabled:true,trialDays:30};
// حساب جديد معلّق
const fresh={createdAt:new Date(now-2*day).toISOString(),trialPending:true,trialEndsAt:null,plan:"free"};
const s0=subStatus(fresh,cfg,now); ok(s0.state==="pending"&&s0.full===true,"new account pending = full features"); ok(/أول بث/.test(s0.label),"pending label arabic");
// الحد الأقصى للانتظار
const old={...fresh,createdAt:new Date(now-(TRIAL_PENDING_CAP_DAYS+1)*day).toISOString()}; ok(subStatus(old,cfg,now).full===false,"pending capped after "+TRIAL_PENDING_CAP_DAYS+" days");
// أول بث يبدأ التجربة 30 يوماً من لحظة البث
const patch:any=trialStartPatch(fresh,cfg,now); ok(patch&&patch.trialPending===false&&Date.parse(patch.trialEndsAt)===now+30*day,"first live starts 30-day trial");
const started={...fresh,...patch}; const s1=subStatus(started,cfg,now+5*day); ok(s1.state==="trial"&&s1.daysLeft===25,"trial counts from first stream");
ok(subStatus(started,cfg,now+31*day).full===false,"trial ends after 30 days");
ok(trialStartPatch(started,cfg,now+day)===null,"second live does not restart trial");
// الحسابات القديمة لا تتأثر
const legacy={createdAt:new Date(now-10*day).toISOString(),trialEndsAt:new Date(now+20*day).toISOString(),plan:"free"}; ok(subStatus(legacy,cfg,now).state==="trial"&&trialStartPatch(legacy,cfg,now)===null,"legacy accounts unchanged");
// تصاميم PRO
ok(isProDesign("rPerfume")&&isProDesign("xRoyalCrown")&&!isProDesign("goldCup")&&!isProDesign("royal")&&!isProDesign(undefined),"pro design ids");
const L=(ws:any[])=>[{widgets:ws}];
const prev=L([{type:"sgoal",design:"rHeart"}]), next=L([{type:"sgoal",design:"rHeart"},{type:"sgoal",design:"rFox"},{type:"lb",design:"goldCup"}]);
ok(proDesignsIn(next).size===2,"collect pro designs");
const expired={...legacy,trialEndsAt:new Date(now-day).toISOString()};
const v=proViolations(expired,next,prev,cfg,now); ok(v.length===1&&v[0]==="sgoal:rFox","expired: only NEW pro design rejected (existing kept)");
ok(proViolations(started,next,prev,cfg,now+day).length===0,"trial: pro allowed");
ok(proViolations(fresh,next,[],cfg,now).length===0,"pending: pro allowed");
ok(proViolations({...expired,plan:"pro",planUntil:new Date(now+day).toISOString()},next,prev,cfg,now).length===0,"subscriber: pro allowed");
ok(proViolations(expired,L([{type:"x",levels:{a:{design:"xNeonPulse"}}}]),[],cfg,now).length===1,"pro inside levels detected");
console.log(`pro-trial: ${pass} passed, ${fail} failed`); process.exit(fail?1:0);
