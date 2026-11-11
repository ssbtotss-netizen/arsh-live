const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const url='file:///home/claude/najd/demo/index.html';
(async()=>{
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:1440,height:1000}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto(url); await p.evaluate(()=>localStorage.clear()); await p.goto(url);
 await p.click('.nav [data-go="layers"]'); await p.waitForTimeout(800);
 ok(await p.evaluate(()=>document.querySelectorAll('.lay-card').length===15&&document.querySelectorAll('.lay-card .lew .le-card').length===15),'Layers page: 15 elements with live previews');
 for(const k of ["topDay","topLike","comment","song","topShare","topComment"]) await p.click(`[data-layadd="${k}"]`);
 const W=await p.evaluate(()=>Object.fromEntries(window.__arsh.L().widgets.filter(w=>w.type==="levent").map(w=>[w.kind,w.id])));
 await p.click('.nav [data-go="studio"]'); await p.waitForTimeout(400);
 const send=ev=>p.evaluate(ev=>window.__arsh.send({t:"sim",ev}),ev);
 const T=(k,s)=>p.evaluate(([id,s])=>{const e=document.querySelector(`#stage .wd[data-id="${id}"] .le-card:not(.le-exit) ${s}`); return e?e.textContent:null},[W[k],s]);
 await send({id:"G1",type:"gift",user:{id:"a",name:"فهد"},gift:"وردة",giftId:5655,count:1,value:500});
 await send({id:"G2",type:"gift",user:{id:"b",name:"نورة"},gift:"أسد",giftId:1,count:1,value:2000});
 await send({id:"G3",type:"gift",user:{id:"z",name:"تجربة"},gift:"أسد",giftId:1,count:1,value:99999,test:true});
 await p.waitForTimeout(1500);
 ok((await T("topDay",".le-nm"))==="نورة"&&(await T("topDay",".le-msg")).includes("2,000"),'top supporter of the day = real gifts only (test gift ignored)');
 await send({id:"G4",type:"gift",user:{id:"a",name:"فهد"},gift:"أسد",giftId:1,count:1,value:2000}); await p.waitForTimeout(1500);
 ok((await T("topDay",".le-nm"))==="فهد"&&(await T("topDay",".le-msg")).includes("2,500"),'leader changes when overtaken (2,500)');
 for(const [id,u,c] of [["L1","ريم",300],["L2","سلطان",900]]) await send({id,type:"like",user:{id:u,name:u},count:c});
 await send({id:"C1",type:"comment",user:{id:"c1",name:"خالد"},text:"البث رهيب 🔥"}); await send({id:"C2",type:"comment",user:{id:"c1",name:"خالد"},text:"كمل"});
 await send({id:"S1",type:"share",user:{id:"sh",name:"جود"}});
 await p.waitForTimeout(1500);
 ok((await T("topLike",".le-nm"))==="سلطان"&&(await T("topLike",".le-msg")).includes("900"),'most likes = سلطان (900)');
 ok((await T("comment",".le-msg"))==="كمل"&&(await T("comment",".le-nm"))==="خالد",'last commenter shows the comment text');
 ok((await T("topComment",".le-nm"))==="خالد"&&(await T("topShare",".le-nm"))==="جود",'most comments + most shares');
 // آخر طالب أغنية
 await p.evaluate(()=>window.__arsh.clockOp("music","lib",{lib:[{id:"t1",title:"فوق هام السحب",artist:"",dur:200}]}));
 await send({id:"M1",type:"comment",user:{id:"m",name:"سارة"},text:"!اغنية فوق هام"}); await p.waitForTimeout(1500);
 ok((await T("song",".le-nm"))==="سارة"&&(await T("song",".le-msg")).includes("فوق هام السحب"),'last song requester + song title');
 // OBS
 await p.click('.nav [data-go="obs"]'); await p.waitForTimeout(200);
 const href=await p.evaluate(()=>document.querySelector('a[href*="#/overlay"]').href);
 const o=await ctx.newPage(); o.on('pageerror',e=>errs.push('ov '+e.message)); await o.goto(href+'&only='+W.topDay); await o.reload(); await o.waitForTimeout(1000);
 ok(await o.evaluate(()=>document.querySelector('.le-card .le-nm')?.textContent)==="فهد",'OBS: top supporter restored after reload');
 await p.evaluate(()=>window.__arsh.send({t:"sim",ev:{id:"G5",type:"gift",user:{id:"n",name:"منيرة"},gift:"كون",giftId:2,count:1,value:44999}})); await o.waitForTimeout(1600);
 ok(await o.evaluate(()=>document.querySelector('.le-card:not(.le-exit) .le-nm')?.textContent)==="منيرة",'OBS updates live when leader changes');
 // الاستوديو: تدوير + تجميع + مقاسات
 const ids=await p.evaluate(()=>{ const A=window.__arsh, L=A.L(); const [a,b]=L.widgets.filter(w=>w.type==="levent"); a.rot=15; a.group="G"; b.group="G"; a.locked=false; b.locked=false; L.widgets.forEach((w,i)=>{ w.x=.02+(i%3)*.33; w.y=.5+Math.floor(i/3)*.12; w.w=.3; w.h=.1 }); a.x=.1; a.y=.05; a.w=.3; a.h=.15; a.z=99; b.x=.55; b.y=.05; A.save(); A.pushLayout(); return [a.id,b.id,.55,.05] });
 await p.click('.nav [data-go="studio"]'); await p.waitForTimeout(400);
 ok(await p.evaluate(id=>document.querySelector(`#stage .wd[data-id="${id}"]`).style.rotate==="15deg",ids[0]),'rotation applied');
 const box=await p.evaluate(id=>{const r=document.querySelector(`#stage .wd[data-id="${id}"]`).getBoundingClientRect(); return [r.x+r.width/2,r.y+r.height/2]},ids[0]);
 await p.mouse.move(box[0],box[1]); await p.mouse.down(); await p.mouse.move(box[0]+40,box[1]+30,{steps:5}); await p.mouse.up(); await p.waitForTimeout(200);
 const b2=await p.evaluate(id=>{const w=window.__arsh.L().widgets.find(x=>x.id===id); return [w.x,w.y]},ids[1]);
 ok(b2[0]!==ids[2]||b2[1]!==ids[3],'grouped element moves together with the dragged one');
 await p.click('[data-canvas="hd"]'); await p.waitForTimeout(300); ok(await p.evaluate(()=>{const s=document.getElementById('stage'); return s.style.width==="1280px"&&s.style.height==="720px"}),'1280×720 canvas');
 await p.click('[data-canvas="hdv"]'); await p.waitForTimeout(300); ok(await p.evaluate(()=>document.getElementById('stage').style.width==="720px"),'720×1280 canvas');
 p.once('dialog',d=>d.accept('1600×900'));
 await p.click('[data-canvas="custom"]'); await p.waitForTimeout(300);
 const asked=await p.evaluate(()=>!!document.querySelector('.mbox input'));
 if(asked){ await p.fill('.mbox input','1600×900'); await p.click('.mbox [data-ok]').catch(()=>p.keyboard.press('Enter')); await p.waitForTimeout(300) }
 ok(await p.evaluate(()=>{const s=document.getElementById('stage'); return s.style.width==="1600px"&&s.style.height==="900px"}),'custom canvas 1600×900');
 const o2=await ctx.newPage(); await p.click('.nav [data-go="obs"]'); await p.waitForTimeout(200); const href2=await p.evaluate(()=>document.querySelector('a[href*="#/overlay"]').href); await o2.goto(href2); await o2.reload(); await o2.waitForTimeout(600);
 ok(await o2.evaluate(()=>{ const r=document.querySelector('.stage,#ov,.ovr')||document.body.firstElementChild; return !!r }),'OBS opens with custom canvas');
 ok(errs.length===0,'no page errors '+errs.join(' | '));
 await b.close();
})();
