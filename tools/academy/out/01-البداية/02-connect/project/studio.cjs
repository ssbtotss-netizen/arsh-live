// B6O6 Academy Studio v2 — الاستخدام:
//   node studio.cjs episodes/v2/01-intro.json out.mp4            (تصدير كامل 60fps)
//   node studio.cjs ep.json out.mp4 --frames 2,8,20               (لقطات مفتاحية للمراجعة)
// يصوّر النسخة التجريبية الحقيقية من المنصة (demo/index.html، بيانات تجريبية فقط) مع تحكم كامل بالزمن:
// مؤقتات JS عبر Playwright clock، وحركات CSS عبر CDP Animation (إيقاف + تقديم يدوي لكل إطار).
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const http=require('http'), fs=require('fs'), path=require('path'), {spawn}=require('child_process');
const ROOT=path.resolve(__dirname,'..','..'); // /home/claude/najd
const [,,EPF,OUT,...rest]=process.argv; const FR=rest.includes('--frames')?rest[rest.indexOf('--frames')+1].split(',').map(Number):null;
const BENCH=rest.includes('--bench')?rest[rest.indexOf('--bench')+1].split(':').map(Number):null; // t0:n
const FPS=60, EP=JSON.parse(fs.readFileSync(EPF,'utf8')), DUR=EP.dur||59, N=Math.round(DUR*FPS);
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript','.png':'image/png','.jpg':'image/jpeg','.ttf':'font/ttf','.json':'application/json','.mp3':'audio/mpeg','.svg':'image/svg+xml','.css':'text/css','.webp':'image/webp'};
const srv=http.createServer((q,r)=>{ let u=decodeURIComponent(q.url.split('?')[0]); if(u.startsWith('/sounds/')) u='/arsh-live/public'+u; const f=path.join(ROOT,u); if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);return r.end()} r.writeHead(200,{'content-type':MIME[path.extname(f)]||'application/octet-stream'}); fs.createReadStream(f).pipe(r) });
(async()=>{ await new Promise(r=>srv.listen(0,'127.0.0.1',r)); const base=`http://127.0.0.1:${srv.address().port}`;
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--mute-audio','--autoplay-policy=no-user-gesture-required','--disable-gpu-vsync']});
 const ctx=await b.newContext({viewport:{width:1080,height:1920},deviceScaleFactor:1}); const p=await ctx.newPage();
 p.on('pageerror',e=>console.error('pageerror',e.message.slice(0,160)));
 const T0=Date.parse('2026-11-27T20:00:00+03:00'); await p.clock.install({time:T0});
 await p.goto(base+'/tools/academy/studio.html'); await p.evaluate(()=>document.fonts.ready);
 if(process.env.LITE) await p.addStyleTag({content:process.env.LITE});
 await p.evaluate(ep=>window.__setup(ep),{...EP,appUrl:base+'/demo/index.html'});
 // حالة نظيفة: بيانات تجريبية فقط (بدون أي بيانات مستخدمين)
 await p.evaluate(()=>{ const f=document.getElementById('app'); f.contentWindow.localStorage.clear(); });
 await p.evaluate(()=>new Promise(r=>{ const f=document.getElementById('app'); f.onload=()=>r(); f.contentWindow.location.reload() }));
 await p.evaluate(ep=>window.__setup(ep),{...EP,appUrl:base+'/demo/index.html'});
 await p.clock.runFor(800);
 if(EP.seed) await p.evaluate(js=>document.getElementById('app').contentWindow.eval(js),EP.seed);
 await p.clock.runFor(1500);
 if(EP.live){ const url=await p.evaluate(x=>document.getElementById('app').contentWindow.eval(x),EP.ovl||'overlayURL(L())'); await p.evaluate(u=>window.__overlay(u),url.replace(/^.*?\/demo\//,base+'/demo/')); await p.clock.runFor(1500) }
 if(EP.liveMode==='desk'){ await p.evaluate(u=>window.__float(u),base+'/demo/index.html#float'); await p.clock.runFor(1500) }
 await p.clock.pauseAt(T0+60000);
 const cdp=await ctx.newCDPSession(p); await cdp.send('Animation.enable'); await cdp.send('Animation.setPlaybackRate',{playbackRate:0});
 let TV=0; const anims=new Map(); cdp.on('Animation.animationStarted',e=>{ if(!anims.has(e.animation.id)) anims.set(e.animation.id,TV) });
 if(BENCH){ const [b0,bn]=BENCH; for(let f=0;f<Math.round(b0*FPS);f+=4){ TV=f*1000/FPS; await p.clock.runFor(4000/FPS); await p.evaluate(([t,f])=>window.__frame(t,f),[f/FPS,f]) }
  let ts=0,te=0,tf=0; for(let k=0;k<bn;k++){ const f=Math.round(b0*FPS)+k; TV=f*1000/FPS; let a=Date.now(); await p.clock.runFor(1000/FPS); await p.evaluate(([t,f])=>window.__frame(t,f),[f/FPS,f]); tf+=Date.now()-a; a=Date.now(); await p.screenshot({type:'jpeg',quality:92}); ts+=Date.now()-a }
  console.log(`BENCH frame=${(tf/bn).toFixed(0)}ms shot=${(ts/bn).toFixed(0)}ms total=${((tf+ts)/bn).toFixed(0)}ms`); await b.close(); srv.close(); return }
 let ff=null; if(!FR){ ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','faster','-crf','15','-pix_fmt','yuv420p','-movflags','+faststart',OUT.replace(/\.mp4$/,'.part.mp4')],{stdio:['pipe','inherit','inherit']}) }
 const want=FR?new Set(FR.map(s=>Math.round(s*FPS))):null, last=FR?Math.max(...want):N-1, step=FR?2:1; const t0=Date.now();
 for(let f=0;f<=last;f+=1){ TV=f*1000/FPS; const t=f/FPS;
  if(f) await p.clock.runFor(1000/FPS);
  if(FR&&!want.has(f)&&f%step) continue;
  const fr=await p.evaluate(([t,f])=>window.__frame(t,f),[t,f]); if(typeof fr==='string'&&!global.__errShown){ global.__errShown=1; console.error('FRAME',t,fr) }
  await new Promise(r=>setImmediate(r)); await p.evaluate(()=>{ for(const e of [document.documentElement,document.body]){e.scrollTop=0;e.scrollLeft=0} });
  const groups=new Map(); for(const [id,s] of anims){ const k=TV-s; if(!groups.has(k)) groups.set(k,[]); groups.get(k).push(id) }
  for(const [k,ids] of groups){ try{ await cdp.send('Animation.seekAnimations',{animations:ids,currentTime:k}) }catch(e){ for(const id of ids) anims.delete(id) } }
  if(anims.size>400){ const ks=[...anims.keys()].slice(0,anims.size-400); ks.forEach(k=>anims.delete(k)) }
  if(FR){ if(want.has(f)) await p.screenshot({path:OUT.replace(/\.mp4$/,'')+'_'+(f/FPS)+'.jpg',type:'jpeg',quality:92}); continue }
  const buf=await p.screenshot({type:'jpeg',quality:92}); if(!ff.stdin.write(buf)) await new Promise(r=>ff.stdin.once('drain',r));
  if(f%300===0) console.log(`frame ${f}/${N} ${Math.round((Date.now()-t0)/1000)}s anims=${anims.size}`) }
 const LOG=await p.evaluate(()=>window.__log()); fs.writeFileSync(OUT.replace(/\.mp4$/,'.events.json'),JSON.stringify(LOG));
 if(ff){ ff.stdin.end(); const code=await new Promise(r=>ff.on('close',r)); if(code!==0) throw new Error('ffmpeg '+code); fs.renameSync(OUT.replace(/\.mp4$/,'.part.mp4'),OUT); console.log('OK',OUT,N,'frames',Math.round((Date.now()-t0)/1000),'s') }
 await b.close(); srv.close() })().catch(e=>{ console.error(e); process.exit(1) });
