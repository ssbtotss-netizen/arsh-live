import { newRoom, roomEvent, roomSnapshot } from "../arsh-live/src/engine/room.js";
import { donorTotals, goalProgress, donationStats, periodKey, newGoal, defaultDonCfg, fmtMoney, recentDonations } from "../arsh-live/src/engine/donations.js";
let f=0; const ok=(c:any,m:string)=>{console.log((c?"PASS ":"FAIL ")+m); if(!c) f++};
const R=newRoom(); const cfg=defaultDonCfg(); const now=Date.UTC(2026,10,9,12); // Mon 9 Nov 2026 15:00 Riyadh
const don=(id:string,name:string,amount:number,o:any={})=>roomEvent(R,{type:"donation",id,provider:"moyasar",name,amount,currency:"SAR",t:now,...o},now);
don("m:1","محمد",50); don("m:2","خالد",100); don("m:3","محمد",25);
const r=don("m:1","محمد",50); ok(r.dup&&R.DN.list.length===3,"duplicate transaction id ignored");
ok(R.D.tot.gifts===0&&Object.keys(R.D.gifts).length===0,"donations never touch TikTok gift points");
const top=donorTotals(R.DN,cfg,{period:"all",now}); ok(top[0].name==="خالد"&&top[0].v===100&&top[1].v===75,"top donors summed per donor");
roomEvent(R,{type:"donation",id:"u:1",provider:"streamlabs",name:"John",amount:20,currency:"USD",t:now},now);
ok(donorTotals(R.DN,cfg,{period:"all",now,currency:"SAR"}).every((x:any)=>x.name!=="John"),"USD not mixed into SAR totals");
const st=donationStats(R.DN,cfg,now); ok(st.length===2&&st.find((x:any)=>x.currency==="SAR").total===175&&st.find((x:any)=>x.currency==="USD").total===20,"stats split per currency");
roomEvent(R,{type:"donation",id:"t:1",provider:"test",name:"تجربة",amount:500,currency:"SAR",test:true,t:now},now);
ok(donationStats(R.DN,cfg,now).find((x:any)=>x.currency==="SAR").total===175,"test donations excluded from financial stats");
ok(donorTotals(R.DN,cfg,{period:"all",now})[0].name==="تجربة","test donation visible on overlays for preview");
roomEvent(R,{type:"donation",id:"p:1",provider:"moyasar",name:"x",amount:30,currency:"SAR",status:"pending",t:now},now);
ok(!R.DN.list.find((d:any)=>d.id==="p:1"),"pending payment not counted");
roomEvent(R,{type:"donation_refund",id:"m:2",amount:100},now);
ok(donationStats(R.DN,cfg,now).find((x:any)=>x.currency==="SAR").total===75,"full refund removed from totals");
roomEvent(R,{type:"donation_refund",id:"m:1",amount:20},now);
ok(R.DN.list.find((d:any)=>d.id==="m:1").status==="partially_refunded"&&donationStats(R.DN,cfg,now).find((x:any)=>x.currency==="SAR").total===55,"partial refund");
const g=newGoal({target:1000,base:700}); ok(goalProgress(g,R.DN,now).current===700+55+500,"goal = base + confirmed (incl. test while present)");
roomEvent(R,{type:"donation_clear_tests"},now); ok(goalProgress(g,R.DN,now).current===755,"clear tests");
ok(goalProgress({...g,paused:true},R.DN,now).current===700,"paused goal stops auto counting");
ok(goalProgress({...g,auto:false},R.DN,now).current===700,"auto-count off");
// periods with timezone + week start
const sat=Date.UTC(2026,10,7,22); // Sat 7 Nov 22:00 UTC = Sun 8 Nov 01:00 Riyadh
ok(periodKey(sat,"Asia/Riyadh","day",0)==="2026-11-08","day uses creator timezone (Riyadh)");
ok(periodKey(sat,"Asia/Riyadh","week",0)===periodKey(now,"Asia/Riyadh","week",0),"week starting Sunday groups Sun 8 & Mon 9");
ok(periodKey(sat,"Asia/Riyadh","week",1)!==periodKey(now,"Asia/Riyadh","week",1),"week starting Monday separates them");
roomEvent(R,{type:"donation",id:"old",provider:"moyasar",name:"قديم",amount:999,currency:"SAR",t:Date.UTC(2026,9,15)},now);
ok(donorTotals(R.DN,cfg,{period:"month",now}).every((x:any)=>x.name!=="قديم")&&donorTotals(R.DN,cfg,{period:"all",now})[0].name==="قديم","new month starts fresh, history kept for all-time");
roomEvent(R,{type:"donation",id:"an1",provider:"moyasar",name:"سر",anonymous:true,amount:5,currency:"SAR",t:now},now);
ok(recentDonations(R.DN,cfg,{limit:1})[0].id==="an1"&&donorTotals(R.DN,cfg,{period:"day",now,hideAnon:true}).every((x:any)=>!x.anon),"anonymous hidden when requested");
ok(!JSON.stringify(roomSnapshot(R,now)).includes("@"),"snapshot carries no emails");
ok(fmtMoney(1500,"SAR")==="1,500 ر.س"&&fmtMoney(2.5,"KWD")==="2.50 د.ك","money formatting");
console.log(f?f+" FAILED":"ALL PASS"); process.exit(f?1:0);
