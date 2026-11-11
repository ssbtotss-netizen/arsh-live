import { rotationState, rotationSlots, rotationJump, rotationPause, rotationResume, newAccount, migrateRotation } from "../arsh-live/src/engine/socials.js";
let f=0; const ok=(c:any,m:string)=>{console.log((c?"PASS ":"FAIL ")+m); if(!c) f++};
const mk=(n:number)=>({accounts:Array.from({length:n},(_,i)=>newAccount("social",{id:"a"+i,platform:"tiktok",username:"u"+i})),rotation:migrateRotation({startedAt:1000})});
// defaults
const S3=mk(3); const R=S3.rotation;
ok(R.showSec===5&&R.enterMs===600&&R.exitMs===500&&R.gapMs===300,"defaults: 5s show, 0.6 enter, 0.5 exit, 0.3 wait");
const at=(S:any,ms:number)=>rotationState(S,1000+ms);
// exact timeline from the spec
ok(at(S3,0).accountId==="a0"&&at(S3,0).phase==="entering","0s: TikTok starts entering");
ok(at(S3,600).phase==="visible","0.6s: fully visible");
ok(at(S3,5599).phase==="visible"&&at(S3,5600).phase==="exiting","5.6s: exit starts");
ok(at(S3,6100).phase==="waiting"&&at(S3,6100).accountId==="a0","6.1s: gone (waiting)");
ok(at(S3,6400).accountId==="a1"&&at(S3,6400).phase==="entering","6.4s: next account starts entering");
// never two accounts in a visible phase at the same time (timeline is sequential by construction)
let bad=0; for(let t=0;t<60000;t+=50){ const s=at(S3,t); if(s&&s.phase==="entering"){ const prev=at(S3,t-1); if(prev&&prev.accountId!==s.accountId&&(prev.phase==="exiting")) bad++ } } ok(bad===0,"next never enters while previous is exiting");
// counts 1,2,10
for(const n of [1,2,10]){ const S=mk(n); const seen=new Set(); for(let t=0;t<n*6400+10;t+=200){ const s=at(S,t); if(s) seen.add(s.accountId) } ok(seen.size===n,`${n} account(s) all shown in one cycle`) }
ok(at(mk(1),6400).accountId==="a0"&&at(mk(1),6400).cycle===1,"single account repeats");
// hide one
const Sh=mk(3); Sh.accounts[1].enabled=false; ok(rotationSlots(Sh).map((x:any)=>x.accountId).join()==="a0,a2","hidden account skipped");
// reorder
const So=mk(3); So.rotation.items=[{accountId:"a2"},{accountId:"a0"},{accountId:"a1",enabled:false}]; ok(rotationSlots(So).map((x:any)=>x.accountId).join()==="a2,a0","custom order + per-item disable");
// duration change
const Sd=mk(3); Sd.rotation.showSec=2; ok(at(Sd,2600).phase==="exiting","show duration change applies");
// pause / resume
const Sp=mk(3); rotationPause(Sp,1000+3000); ok(rotationState(Sp,1000+9000).phase==="paused"&&rotationState(Sp,1000+9000).accountId==="a0","paused stays on current account");
rotationResume(Sp,1000+9000); ok(rotationState(Sp,1000+9000+100).accountId==="a0"&&rotationState(Sp,1000+9000+100).phase==="visible","resume continues where it stopped");
// next / prev
const Sn=mk(3); rotationJump(Sn,1000+2000,1); ok(rotationState(Sn,1000+2000).accountId==="a1"&&rotationState(Sn,1000+2000).phase==="entering","next account manually");
rotationJump(Sn,1000+2000,-1); ok(rotationState(Sn,1000+2000).accountId==="a0","previous account manually");
rotationJump(Sn,1000+2000,-1); ok(rotationState(Sn,1000+2000).accountId==="a2","previous wraps to last");
// random: deterministic for all links
const Sr=mk(10); Sr.rotation.order="random"; const o1=rotationSlots(Sr,3).map((x:any)=>x.accountId).join(), o2=rotationSlots(Sr,3).map((x:any)=>x.accountId).join(); ok(o1===o2&&o1!==rotationSlots(mk(10),0).map((x:any)=>x.accountId).join(),"random order is identical across OBS links");
// loop off
const Sl=mk(2); Sl.rotation.loop=false; ok(at(Sl,2*6400+10)===null,"no repeat when loop is off");
// migration from old settings
const m=migrateRotation({showSec:10,gapSec:5,enter:"slideRight",exit:"slideLeft",startedAt:5}); ok(m.gapMs===5000&&m.exit==="slideOutLeft","old saved rotation migrated without loss");
console.log(f?f+" FAILED":"ALL PASS"); process.exit(f?1:0);
