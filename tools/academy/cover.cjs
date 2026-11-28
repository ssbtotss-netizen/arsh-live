// node cover.cjs meta.json frame.jpg out.jpg
const {chromium}=require('/opt/npm-tools/node_modules/playwright'); const fs=require('fs'), path=require('path');
(async()=>{ const [,,MF,IMG,OUT]=process.argv; const m=JSON.parse(fs.readFileSync(MF,'utf8'));
 const words=m.title.split(' '); const titleHtml=words.length>1?words.slice(0,-1).join(' ')+' <em>'+words[words.length-1]+'</em>':m.title;
 const hookPlain=(m.hook||'').replace(/\*/g,'').replace(/\|/g,' ');
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--allow-file-access-from-files']}); const p=await b.newPage({viewport:{width:1080,height:1920}});
 await p.goto('file://'+path.join(__dirname,'cover.html')); await p.evaluate(()=>document.fonts.ready);
 await p.evaluate(x=>window.__cover(x),{num:m.num,titleHtml,hookPlain,img:'file://'+path.resolve(IMG)}); await p.waitForTimeout(300);
 await p.screenshot({path:OUT,type:'jpeg',quality:92}); await b.close() })();
