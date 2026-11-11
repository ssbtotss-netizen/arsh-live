const { chromium } = require('/opt/npm-tools/node_modules/playwright');
(async()=>{
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required','--allow-file-access-from-files']});
 const p=await b.newPage(); await p.goto('file:///home/claude/najd/demo/index.html');
 ok(await p.evaluate(()=>alValidate({name:"x",kind:"video",event:"follow",category:"fire",durationSec:120,mediaId:"m"}).ok&&alValidate({name:"x",kind:"video",event:"follow",category:"fire",durationSec:70,mediaId:"m"}).value.durationSec===70),'durations 70s / 120s accepted (no 30s cap)');
 ok(await p.evaluate(()=>alRule({over:{durationSec:90}}).over.durationSec===90),'rule override keeps 90s');
 // مقطع 12 ث مع مدة مضبوطة 3 ث: لا يُقطع قبل نهاية الفيديو
 await p.evaluate(()=>{ AB_DEFS.v12={id:"v12",kind:"video",event:"follow",durationSec:3,mediaUrl:"file:///tmp/alfx/clip12.mp4",config:alConfig({})}; const v=new View(newWidget("abox",{}),{w:640,h:360},{mute:true}); document.body.appendChild(v.el); window.__v=v; v.aboxPush([{id:"d1",alertId:"v12",event:"follow",vars:{display_name:"س"},priority:1}]) });
 await p.waitForTimeout(8000); const mid=await p.evaluate(()=>{ const v=document.querySelector('.ab-root video'); return v?{t:v.currentTime,on:true}:null });
 ok(mid&&mid.t>6,'at 8s the 12s clip is still playing (not cut at 3s): t='+(mid&&mid.t.toFixed(1)));
 await p.waitForTimeout(6500); ok(await p.evaluate(()=>!document.querySelector('.ab-root')),'alert ends after the clip ends');
 // مدة أطول من المقطع تُحترم أيضاً
 await p.evaluate(()=>{ AB_DEFS.v12b={...AB_DEFS.v12,id:"v12b",durationSec:15}; window.__v.aboxPush([{id:"d2",alertId:"v12b",event:"follow",vars:{},priority:1}]) });
 await p.waitForTimeout(13500); ok(await p.evaluate(()=>!!document.querySelector('.ab-root')),'a 15s duration on a 12s clip keeps showing until 15s');
 await b.close();
})();
