// طلبات الأغاني: صفحة الطلب ← الطابور ← المشغل الواحد ← التالي تلقائياً (المحرك + الغرفة)
import { newRoom, roomClockOp, roomEvent, roomMusicRequest, roomMusicSetLib, roomSnapshot } from "/home/claude/najd/arsh-live/src/engine/room.js";
import { musicSearchAll, MUSIC_PLAYER_STALE } from "/home/claude/najd/arsh-live/src/engine/music.js";
let f=0; const ok=(c:any,m:string)=>{ console.log((c?"PASS ":"FAIL ")+m); if(!c) f++ };
const lib=[{id:"a",title:"فوق هام السحب",artist:"محمد عبده",dur:240},{id:"b",title:"Blinding Lights",artist:"The Weeknd",dur:200},{id:"c",title:"الأماكن",artist:"محمد عبده",dur:500},{id:"d",title:"Save Your Tears",artist:"The Weeknd",dur:215},{id:"e",title:"Levitating",artist:"Dua Lipa",dur:203}];
ok(musicSearchAll(lib,"محمد عبده").map(t=>t.id).sort().join()==="a,c","search by artist (Arabic, normalized)");
ok(musicSearchAll(lib,"weeknd").length===2&&musicSearchAll(lib,"blind")[0].id==="b","search by artist / song prefix (English)");
ok(musicSearchAll(lib,"الاماكن")[0].id==="c","hamza-insensitive song search");
ok(musicSearchAll(lib,"zzzz").length===0,"no results → empty");
let now=1e7; const R:any=newRoom(); R.botCfg={music:{page:true,maxDurSec:420,perUser:2,cooldownSec:30,dupSec:0}}; roomMusicSetLib(R,lib);
const op=(m:any)=>roomClockOp(R,{target:"music",...m},now+=100);
const req=(id:string,name:string,uid=name)=>roomMusicRequest(R,id,{id:uid,name},now+=1000);
let r=req("a","نورة"); const M=()=>R.C.music;
ok(r.res.ok&&r.out[0].t==="clock"&&M().current.track.id==="a"&&M().current.by.name==="نورة"&&M().current.by.via==="page","request → server → plays now (autoplay), requester saved");
ok(M().status==="loading","state: loading until the player confirms");
r=req("b","سعد"); ok(r.res.ok&&r.res.position===1&&M().queue[0].track.id==="b","second request → queue #1");
ok(!req("b","ريم").res.ok,"same song twice → refused");
ok(!req("c","فهد").res.ok&&/أطول/.test(req("c","فهد2").res.reply),"longer than max duration → refused with reason");
ok(!req("zz","x").res.ok,"unknown track → refused (no fake source)");
r=req("d","سعد"); ok(!r.res.ok&&/انتظر/.test(r.res.reply),"cooldown between requests for the same viewer");
now+=31000; r=req("d","سعد"); ok(r.res.ok,"after cooldown → accepted");
now+=31000; r=req("e","سعد"); ok(!r.res.ok&&/طلبات/.test(r.res.reply),"per-viewer limit (2 in queue)");
ok(M().queue.map((q:any)=>q.track.id).join()==="b,d","queue ordered by request time");
ok(M().log.some((l:any)=>l.step==="received")&&M().log.some((l:any)=>l.step==="queued")&&M().log.some((l:any)=>l.step==="refused"),"diagnostic log: received / queued / refused");
// مشغل واحد فقط
ok(op({op:"claim",pid:"obs1",kind:"obs"}).out.length===1&&M().player.pid==="obs1","OBS player claims playback");
ok(op({op:"claim",pid:"studio1",kind:"obs"}).out.length===0&&M().player.pid==="obs1","second player cannot take over → no two songs at once");
const q0=M().current.qid;
ok(op({op:"pstate",pid:"studio1",qid:q0,status:"playing"}).out.length===0,"non-owner player reports ignored");
op({op:"pstate",pid:"obs1",qid:q0,status:"playing",pos:3}); ok(M().status==="playing"&&M().log[0].step==="playing","player confirms → playing (logged)");
ok(op({op:"pended",pid:"obs1",qid:"q999"}).out.length===0,"stale 'ended' for another song ignored");
op({op:"pended",pid:"obs1",qid:q0}); ok(M().current.track.id==="b"&&M().status==="loading","song ended → next starts automatically");
// طلب جديد أثناء التشغيل
const qb=M().current.qid; op({op:"pstate",pid:"obs1",qid:qb,status:"playing"}); now+=31000; r=req("e","هند"); ok(r.res.ok&&M().current.qid===qb&&M().queue.at(-1).track.id==="e","new request while playing → appended, current keeps playing");
// إيقاف/استكمال/إعادة/سابق/تخطي/حذف/مسح
op({op:"pause"}); ok(M().paused&&M().status==="paused","pause"); op({op:"resume"}); ok(!M().paused&&M().status==="loading","resume");
const rp=M().current.rp; op({op:"replay"}); ok(M().current.rp===rp+1&&M().current.pos===0,"replay current from the start");
op({op:"next"}); ok(M().current.track.id==="d"&&M().log[0].step!=="error","skip → next");
op({op:"prev"}); ok(M().current.track.id==="b"&&M().queue[0].track.id==="d","previous → back to the last song, current returns to queue front");
const qe=M().queue.find((q:any)=>q.track.id==="e").qid; op({op:"remove",qid:qe}); ok(!M().queue.some((q:any)=>q.track.id==="e"),"remove from queue");
// فشل التشغيل
const qf=M().current.qid; op({op:"perror",pid:"obs1",qid:qf,why:"تعذر تحميل ملف الأغنية (404)"}); ok(M().current.track.id==="d"&&M().err.includes("404")&&M().log.some((l:any)=>l.step==="error"&&/404/.test(l.why)),"load error → logged with reason, skips to next");
// انقطاع المشغل
now+=MUSIC_PLAYER_STALE+1000; ok(op({op:"claim",pid:"studio1",kind:"obs"}).out.length===1&&M().player.pid==="studio1","player silent > 15s → another player takes over");
ok(op({op:"claim",pid:"dash",kind:"dashboard",force:true}).out.length===1&&M().player.pid==="dash","creator forces playback to a chosen player");
op({op:"clear"}); ok(M().queue.length===0,"clear queue");
// الموافقة اليدوية
R.botCfg.music.approve="manual"; R.botCfg.music.noRepeatMin=0; now+=40000; r=req("a","مها"); ok(r.res.ok&&r.res.pending&&M().pending.length===1&&!M().queue.length,"manual approval → waits, not in queue");
op({op:"approve",qid:M().pending[0].qid}); ok(M().queue.length===1&&M().queue[0].by.name==="مها"&&!M().pending.length,"approve → enters queue");
now+=40000; req("e","مها2"); op({op:"reject",qid:M().pending[0].qid}); ok(!M().pending.length&&!M().queue.some((q:any)=>q.track.id==="e"),"reject → removed");
// إيقاف الطلبات / امتلاء / محظور
R.botCfg.music.approve="auto"; R.botCfg.music.maxQueue=1; now+=40000; ok(/ممتلئة/.test(req("c","x9").res.reply),"queue full → stop accepting");
R.botCfg.music.maxQueue=50; R.botCfg.music.bannedUsers="مزعج"; now+=40000; ok(!req("e","مزعج").res.ok,"banned viewer");
R.botCfg.music.enabled=false; now+=40000; ok(/متوقفة/.test(req("e","هيا").res.reply),"requests disabled");
R.botCfg.music.enabled=true; R.botCfg.music.page=false; ok(/متوقفة/.test(req("e","هيا").res.reply),"request page disabled");
// المكتبة لا تُحفظ في حالة الغرفة (تُحمَّل من قاعدة البيانات)
ok(!JSON.stringify(roomSnapshot(R,now).C.music).includes("Levitating\",\"artist\":\"Dua Lipa\",\"dur\":203,\"cover\"")&&R.MLIB.length===5,"library kept out of saved room state");
// أمر الشات يستخدم مكتبة الخادم
R.botCfg.music.page=true; R.botCfg.music.cooldownSec=0; const out=roomEvent(R,{id:"c1",type:"comment",platform:"tiktok",user:{id:"v1",name:"عبير"},text:"!اغنية levitating"},now+=1000).out;
ok(out.some((m:any)=>m.t==="bot"&&/Levitating/.test(m.items[0].text)),"chat !اغنية finds the song in the server library (root cause fixed)");
const t=roomEvent(R,{id:"c2",type:"comment",platform:"tiktok",test:true,user:{id:"v2",name:"ت"},text:"!song blinding lights"},now+=1000);
ok([...R.C.music.queue,R.C.music.current].some((q:any)=>q&&q.by.test),"test requests are flagged as test (not real)");
console.log(f?`\n${f} FAILED`:"\nALL PASS"); process.exit(f?1:0);
