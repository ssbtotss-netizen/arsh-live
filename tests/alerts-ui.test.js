const { chromium } = require('/opt/npm-tools/node_modules/playwright');
const FX='/tmp/alfx/';
(async()=>{
 const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1};
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const ctx=await b.newContext({viewport:{width:1440,height:1000}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file:///home/claude/najd/demo/index.html'); await p.evaluate(()=>localStorage.clear()); await p.goto('file:///home/claude/najd/demo/index.html');
 await p.click('.nav [data-go="alerts"]'); await p.waitForTimeout(300);
 ok(await p.$('[data-alsec="official"]')&&(await p.$$('[data-alsty]')).length===22&&(await p.$$('[data-algrp]')).length===12,'library: sections, 21 design styles, 11 event groups');
 await p.click('[data-alsec="official"]'); await p.waitForTimeout(300);
 ok((await p.$$('.al-card')).length>=90,'official templates listed');
 const up=async(file)=>{ await p.click('[data-altab="create"]').catch(()=>{}); await p.waitForTimeout(150); await p.setInputFiles('#al-file',FX+file); for(let i=0;i<60;i++){ const ph=await p.evaluate(()=>S.al.up&&S.al.up.phase); if(ph==="done"||ph==="error") return ph; await p.waitForTimeout(200) } return "timeout" };
 const reset=()=>p.evaluate(()=>{ S.al.form=null; S.al.up=null; S.al.tab="create"; renderPage(true) });
 await p.click('[data-altab="create"]'); await p.waitForTimeout(200);
 ok(await p.evaluate(()=>document.querySelector('[data-alff="visibility"][value="private"]').checked&&!!document.getElementById('al-drop')),'upload form: drag&drop zone, privacy defaults to private');
 // 1. MP4 مع صوت
 ok(await up('mp4_audio.mp4')==='done','1. MP4 with audio uploaded');
 let F=await p.evaluate(()=>({k:S.al.form.kind,d:S.al.form.durationSec,da:S.al.form.durAuto,m:S.al.form.meta,c:(S.al.form.coverData||"").slice(0,22),n:S.al.form.name}));
 ok(F.k==='video'&&F.da===3&&F.d===3&&F.m.w===640&&F.m.h===360,'duration read automatically (3s) + resolution 640x360');
 ok(F.c==='data:image/png;base64,','automatic cover generated from the video (no manual cover needed)');
 ok(F.m.hasAudio===true,'audio track detected');
 ok(await p.evaluate(()=>/640×360/.test(document.querySelector('.al-info').innerText)&&/يوجد صوت/.test(document.querySelector('.al-info').innerText)),'detected info shown to the user');
 await p.click('[data-alsave]'); await p.waitForTimeout(200);
 ok(await p.evaluate(()=>/تصنيف التصميم مطلوب/.test(document.body.innerText)&&!/الغلاف/.test(S.al.ferr.join())),'design style required; cover image NOT required');
 await p.selectOption('[data-alff="category"]','enemy'); await p.waitForTimeout(150);
 await p.selectOption('[data-alff="event"]','gift'); await p.waitForTimeout(150);
 await p.fill('[data-alff="name"]','Enemy Legendary'); await p.dispatchEvent('[data-alff="name"]','change');
 await p.click('[data-alsave]'); await p.waitForTimeout(400);
 let L=await p.evaluate(()=>ls("b6o6.alerts")); ok(L.length===1&&L[0].category==='enemy'&&L[0].event==='gift'&&L[0].visibility==='private'&&L[0].durationSec===3&&L[0].meta.hasAudio,'saved: Enemy style + Gift event + private + auto duration + meta');
 // 2-9
 await reset(); ok(await up('mp4_silent.mp4')==='done'&&await p.evaluate(()=>S.al.form.meta.hasAudio===false),'2. MP4 without audio: no audio detected');
 await reset(); ok(await up('webm_alpha.webm')==='done'&&await p.evaluate(()=>S.al.form.meta.alpha===true),'3. transparent WebM: transparency detected');
 await reset(); ok(await up('webm_plain.webm')==='done'&&await p.evaluate(()=>S.al.form.meta.alpha===false),'4. normal WebM: no transparency');
 await reset(); const mv=await up('mov_alpha.mov'); const mvMsg=await p.evaluate(()=>S.al.up.msg||""); ok(mv==='error'&&/يحوّله الخادم/.test(mvMsg),'5. MOV ProRes in demo mode: clear message (server converts it on the platform)');
 await reset(); ok(await up('gif_anim.gif')==='done'&&await p.evaluate(()=>S.al.form.kind==='gif'&&/^data:image\/png/.test(S.al.form.coverData)),'6. animated GIF: kind gif + still cover from first frame');
 await reset(); ok(await up('png_still.png')==='done'&&await p.evaluate(()=>S.al.form.kind==='image'),'7. PNG accepted');
 await reset(); ok(await up('webp_anim.webp')==='done'&&await p.evaluate(()=>S.al.form.kind==='gif'&&S.al.form.meta.animated),'8. animated WebP accepted');
 await reset(); ok(await up('mp3_sound.mp3')==='done'&&await p.evaluate(()=>S.al.form.kind==='audio'&&Math.abs(S.al.form.durAuto-2)<.3),'9. MP3: audio-only alert, duration read');
 ok(await p.evaluate(()=>!!document.querySelector('#al-drop .al-acov')),'audio-only alert gets an automatic audio cover');
 await reset(); const cr=await up('corrupt.mp4'); const crMsg=await p.evaluate(()=>S.al.up.msg); ok(cr==='error'&&/غير مدعومة|تالف/.test(crMsg)&&!!await p.$('[data-alretry]'),'10. corrupt file: clear error + retry button: '+crMsg.slice(0,40));
 ok(await p.evaluate(()=>S.al.form&&S.al.form.config&&true),'form data kept after failed upload');
 // حفظ GIF + WebM شفاف لاختبار المكتبة
 await reset(); await up('webm_alpha.webm'); await p.selectOption('[data-alff="category"]','money'); await p.waitForTimeout(100); await p.selectOption('[data-alff="event"]','donation'); await p.waitForTimeout(100); await p.click('[data-alsave]'); await p.waitForTimeout(300);
 // المكتبة: Hover
 await p.evaluate(()=>{ S.al.tab="lib"; S.al.sec="mine"; S.al.key=""; renderPage(true) }); await p.waitForTimeout(500);
 ok((await p.$$('.al-card')).length===2,'my alerts listed');
 const ths=await p.$$('.al-th[data-alhv]'); await ths[0].hover(); await p.waitForTimeout(700);
 let hv=await p.evaluate(()=>{ const v=document.querySelector('.al-th.playing video.al-hv'); return v?{play:!v.paused,muted:v.muted,t:v.currentTime}:null });
 ok(hv&&hv.play&&hv.muted,'hover: video plays inside the card, muted by default');
 const box0=await (await p.$$('.al-card'))[1].boundingBox();
 await ths[1].hover(); await p.waitForTimeout(600);
 const n=await p.evaluate(()=>[...document.querySelectorAll('video.al-hv')].length); ok(n===1,'only one preview plays at a time');
 const box1=await (await p.$$('.al-card'))[1].boundingBox(); ok(Math.abs(box0.y-box1.y)<1&&Math.abs(box0.height-box1.height)<1,'other cards do not move');
 await p.mouse.move(5,5); await p.waitForTimeout(300); ok(await p.evaluate(()=>!document.querySelector('video.al-hv')&&!document.querySelector('.al-th.playing')),'mouse leave: video stopped, resources cleaned, cover back');
 // الصوت
 await ths[1].hover(); await p.waitForTimeout(300); const sb=await p.$$('[data-alsnd]'); await sb[sb.length-1].click(); await p.waitForTimeout(400);
 hv=await p.evaluate(()=>{ const v=document.querySelector('video.al-hv'); return v?{muted:v.muted,play:!v.paused}:null }); ok(hv&&!hv.muted&&hv.play,'🔊 button plays the alert sound');
 await sb[sb.length-1].click(); await p.waitForTimeout(200); ok(await p.evaluate(()=>document.querySelector('video.al-hv').muted),'🔊 again mutes');
 // فلتر الطابع والحدث
 await p.evaluate(()=>{ S.al.sec="all"; S.al.key="" }); await p.click('[data-alsty="money"]'); await p.waitForTimeout(400);
 ok(await p.evaluate(()=>S.al.items.length===1&&S.al.items[0].category==="money"),'style filter: Money');
 await p.click('[data-alsty=""]'); await p.click('[data-algrp="gifts"]'); await p.waitForTimeout(400);
 ok(await p.evaluate(()=>S.al.items.length>=1&&S.al.items.every(a=>["gift","gift_value","first_gift"].includes(a.event))),'event filter: Gifts');
 await p.click('[data-algrp=""]'); await p.selectOption('[data-alf="alpha"]','1'); await p.waitForTimeout(400);
 ok(await p.evaluate(()=>S.al.items.some(a=>a.category==="money")&&!S.al.items.some(a=>a.category==="enemy")),'transparency filter');
 await p.selectOption('[data-alf="alpha"]',''); await p.waitForTimeout(200);
 // نافذة المعاينة
 await p.evaluate(()=>{ S.al.sec="mine"; S.al.key=""; renderPage(true) }); await p.waitForTimeout(400);
 await (await p.$$('[data-alpv]'))[0].click(); await p.waitForTimeout(900);
 ok(await p.evaluate(()=>!!document.querySelector('#al-mpv .ab-root')&&/الأبعاد/.test(document.querySelector('.al-pm').innerText)&&/الحجم/.test(document.querySelector('.al-pm').innerText)),'full preview: playing + size/dimensions info');
 await p.click('[data-pbg="black"]'); ok(await p.evaluate(()=>getComputedStyle(document.getElementById('al-mpv')).backgroundColor==='rgb(0, 0, 0)'),'preview backgrounds (black)');
 await p.click('[data-pbg="game"]'); ok(await p.evaluate(()=>/svg/.test(document.getElementById('al-mpv').style.background)),'game test background');
 await p.click('[data-pmute]'); await p.waitForTimeout(500); ok(await p.evaluate(()=>{ const v=document.querySelector('#al-mpv video'); return !!v&&!v.muted }),'unmute in full preview');
 await p.click('.al-pm [data-close]'); await p.waitForTimeout(200);
 // الجوال
 const m=await (await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true})).newPage();
 await m.goto('file:///home/claude/najd/demo/index.html'); await m.evaluate(l=>{ localStorage.setItem("b6o6.alerts",l) },JSON.stringify(L)); await m.goto('file:///home/claude/najd/demo/index.html');
 await m.evaluate(()=>{ S.page="alerts"; ALS().sec="mine"; renderPage() }); await m.waitForTimeout(500);
 ok(await m.evaluate(()=>getComputedStyle(document.querySelector('.al-tp')).display==='flex'),'mobile: visible play button on cards');
 await m.tap('.al-tp'); await m.waitForTimeout(600); ok(await m.evaluate(()=>{ const v=document.querySelector('video.al-hv'); return v&&!v.paused }),'mobile: tap plays the animated preview');
 await m.tap('.al-tp'); await m.waitForTimeout(200); ok(await m.evaluate(()=>!document.querySelector('video.al-hv')),'mobile: tap again stops');
 // OBS: الاسم والصورة الافتراضية
 const r=await p.evaluate(()=>{ const id=ls("b6o6.alerts")[0].id; const w=newWidget("abox",{}); const v=new View(w,{w:640,h:360},{mute:true}); document.body.appendChild(v.el); AB_DEFS[id]={...AB_DEFS[id],...{id,kind:"image",mediaUrl:"",config:alConfig({title:{text:"شكراً {display_name}"}}),durationSec:2}}; v.aboxPush([{id:"z1",alertId:id,event:"follow",vars:{display_name:"نورة"},priority:1}]); return new Promise(r=>setTimeout(()=>r({t:v.el.querySelector('.ab-tx')&&v.el.querySelector('.ab-tx').textContent,av:v.el.querySelector('.ab-av')&&v.el.querySelector('.ab-av').style.backgroundImage.slice(0,30)}),500)) });
 ok(r.t==='شكراً نورة'&&/svg/.test(r.av),'alert shows real name; default avatar when the source has no photo');
 ok(errs.length===0,'no page errors '+errs.slice(0,3).join(' / '));
 await b.close();
})();
