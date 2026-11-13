// مستويات الدونيشن الموسّعة: 1$ → 1,000$ وأي مستوى مخصص، الأعلى المطابق يغلب، تنبيه واحد لكل دعم
import { newRoom, roomEvent } from "/home/claude/najd/arsh-live/src/engine/room.js";
import { alLib, alDonLevel, AL_DON_DEFAULT, alLibAlertIds } from "/home/claude/najd/arsh-live/src/engine/alerts.js";
let f=0; const ok=(c:any,m:string)=>{ console.log((c?"PASS ":"FAIL ")+m); if(!c) f++ };
const clip=(id:string)=>({alertId:id,enabled:true});
const levels=()=>AL_DON_DEFAULT.map(d=>({...d,clips:[clip("V"+d.min)]}));
let lib:any={don:{currency:"USD",levels:levels()}};
const mk=()=>{ const R:any=newRoom(); R.botCfg={alerts:{enabled:true,rules:[],lib}}; R.live=true; return R };
let R=mk(), n=0;
const don=(amount:number,cur="USD",x:any={})=>{ const r=roomEvent(R,{id:"e"+(++n),platform:"tiktok",type:"donation",provider:"streamlabs",verified:true,amount,currency:cur,name:"داعم",...x},Date.now()); return r.out.filter((m:any)=>m.t==="alert").flatMap((m:any)=>m.items).filter((i:any)=>i.sec==="don") };
const ids=(a:any[])=>a.map(x=>x.alertId).join(",");

ok(alLib({}).don.levels.map((l:any)=>l.min).join(",")==="1,5,10,20,50,100,200,500,1000","الافتراضي: 9 مستويات 1$ → 1,000$");
for(const [a,e] of [[50,"V50"],[100,"V100"],[200,"V200"],[500,"V500"],[1000,"V1000"],[3,"V1"],[7.5,"V5"],[49.99,"V20"],[5000,"V1000"]] as const){ const it=don(a); ok(it.length===1&&ids(it)===e,`$${a} ← ${e} (تنبيه واحد فقط)`) }
ok(don(250).map(x=>x.alertId).join()==="V200","$250 بلا مستوى 250 ← مستوى 200$");
lib.don.levels.push({id:"custom250",label:"دعم 250",min:250,max:0,clips:[clip("V250")]}); R=mk();
ok(ids(don(250))==="V250","بعد إضافة مستوى 250$ ← 250$ يشغّل مقطعه");
ok(ids(don(300))==="V250"&&ids(don(500))==="V500","300$ ← 250$، و500$ ← 500$");
lib.don.levels.find((l:any)=>l.min===200).enabled=false; lib.don.levels=alLib(lib).don.levels; lib.don.levels.find((l:any)=>l.id==="custom250").enabled=false; R=mk();
ok(ids(don(260))==="V100","مستويا 250 و200 معطّلان ← أقرب مستوى أدنى مفعّل (100$)");
lib={don:{currency:"USD",levels:levels()}}; lib.don.levels.find((l:any)=>l.min===500).clips=[]; R=mk();
ok(ids(don(700))==="V200","مستوى 500$ بلا مقطع ← أقرب مستوى أدنى له مقطع (200$)");
// العملات
lib={don:{currency:"USD",levels:levels()}}; R=mk();
ok(ids(don(375,"SAR"))==="V100","375 ر.س = 100$ ← مستوى 100$ (تحويل العملة)");
ok(don(100,"XYZ").length===0,"عملة بلا سعر موثوق ← لا تنبيه (لا نفترض التساوي)");
lib.don.levels.push({id:"sar1000",label:"ألف ريال",min:1000,max:0,cur:"SAR",clips:[clip("VSAR")]}); R=mk();
ok(ids(don(270))==="VSAR","مستوى بعملة خاصة (1000 ر.س ≈ 266.67$): 270$ ← مستواه");
ok(alLib(lib).don.levels.find((l:any)=>l.id==="sar1000").cur==="SAR","عملة المستوى تُحفظ");
// لا حدود ثابتة + حقول التخصيص
const many={don:{currency:"USD",levels:Array.from({length:40},(_,i)=>({id:"x"+i,label:"م"+i,min:(i+1)*25,max:0,color:"#ff0000",fx:"bad!",sound:"S1",clips:[clip("C"+i)]}))}};
const L2=alLib(many); ok(L2.don.levels.length===40,"40 مستوى بدون قص (لا حد 12)");
ok(L2.don.levels[0].color==="#ff0000"&&L2.don.levels[0].fx===""&&L2.don.levels[0].sound==="S1","اللون والصوت يُحفظان، والمؤثر غير الصالح يُرفض");
ok(alLibAlertIds(L2).includes("S1"),"صوت المستوى ضمن المقاطع المحمّلة للصندوق");
ok(alDonLevel(L2,1000)?.id==="x39"&&alDonLevel(L2,24)==null,"1000$ ← أعلى مستوى، و24$ تحت الكل ← لا شيء");
// التجربة لا تُحسب دعماً حقيقياً
R=mk(); const t=roomEvent(R,{id:"tt",type:"donation",provider:"test",test:true,amount:200,currency:"USD",name:"تجربة"},Date.now());
ok(t.out.filter((m:any)=>m.t==="alert").flatMap((m:any)=>m.items).every((i:any)=>i.test),"التجربة مُعلَّمة test");
console.log(f?`${f} FAILED`:"ALL PASS"); if(f) process.exit(1);
