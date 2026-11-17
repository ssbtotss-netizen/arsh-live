// ====== قوائم التتويج — TOP 3 (منصة تتويج: الأول في المنتصف أعلى وأكبر، الثاني يسار، الثالث يمين، مع إمكانية العكس) ======
// 10 تصاميم مختلفة فعلياً: الإطار، الرقم، اللوحة، المؤثرات، زخرفة المتصدر، الاحتفال، وشكل المنصة وحركتها.
// تعمل مع أي ترتيب: التكبيس، الهدايا، الدونيشن، وكل مصادر قوائم الداعمين — وتتحدث تلقائياً مع تغيّر الترتيب الحقيقي.
import { LB_DESIGNS, LB_CATS } from "./lb.js";
Object.assign(LB_CATS,{top3:"قوائم التتويج – TOP 3"});

/** منصة التتويج تحت كل مركز (ارتفاع حسب الترتيب) — مشتركة */
const T3_BASE=`.lba-crown3 :where(.lr) .ped{display:none}
.lba-crown3 :where(.lr.k-tok) .ped{display:grid;place-items:center;position:absolute;left:6%;right:6%;top:calc(100% - var(--av)*.3);height:calc(var(--ped,40px) + var(--av)*.3);border-radius:8px 8px 0 0;font:900 calc(var(--av)*.34)/1 "Orbitron","Changa",sans-serif;color:#fff;z-index:-1;
 background:linear-gradient(180deg,color-mix(in srgb,var(--rc) 85%,#fff),color-mix(in srgb,var(--rc) 60%,#000));box-shadow:inset 0 2px 0 #ffffff66,0 10px 22px #0007}
.lba-crown3 :where(.lr.r1) .ped b::after{content:"1"}.lba-crown3 :where(.lr.r2) .ped b::after{content:"2"}.lba-crown3 :where(.lr.r3) .ped b::after{content:"3"}
.lba-crown3 :where(.lr.r1) .lr-av img{box-shadow:0 0 0 calc(var(--av)*.06) var(--rc),0 0 calc(var(--av)*.35) color-mix(in srgb,var(--rc) 70%,transparent)}
.lba-crown3 :where(.lr.r1) .d1{animation:t3-crown 2.4s ease-in-out infinite}@keyframes t3-crown{50%{transform:translateY(-6%) rotate(-3deg)}}
.lba-crown3 :where(.lr.emp) .ped{opacity:.35}`;
const D=(id,name,desc,frame,rk,nm,amb,d1,cel,colors,font,css,pro=true)=>({id,name,desc,cat:"top3",layout:"art",arr:"crown3",frame,rk,nm,amb,d1,cel,colors:colors.split(","),font,row:"art",halo:"none",pro,css,topN:3});
export const LB_TOP3=[
 D("top3Royal","تتويج ملكي ذهبي","منصة رخام ذهبية، تاج ذهبي متحرك للأول وهالة ملكية وشرارات","medal","big","plate","sparks","crown","halo","#f6c94a,#cbd5e1,#cd7f32,#fde68a,#fbbf24","Amiri",
  `.lbd-top3Royal .lr.k-tok .ped{background:linear-gradient(180deg,#fff4c9,#d4a017 40%,#7a5200);border:1px solid #fde68a}.lbd-top3Royal .lr.r2 .ped{background:linear-gradient(180deg,#f8fafc,#94a3b8 45%,#475569)}.lbd-top3Royal .lr.r3 .ped{background:linear-gradient(180deg,#fde2c4,#cd7f32 45%,#6b3a12)}`,false),
 D("xTop3Butterfly","تتويج الفراشات","منصات زجاج بنفسجي وفراشات تحوم حول المراكز وتحط على الأول","crystal","circle","glass","butterflies","moonbf","butterflies","#c084fc,#f0abfc,#a5b4fc,#e9d5ff,#f5d0fe","Changa",
  `.lbd-xTop3Butterfly .lr.k-tok .ped{background:linear-gradient(180deg,#f5d0fecc,#a855f7aa);backdrop-filter:blur(4px);border:1px solid #f5d0fe;border-radius:14px 14px 0 0}`),
 D("xTop3Girly","تتويج بناتي وردي","منصات وردية بفيونكة لؤلؤ وقلوب وبتلات ورد","soft","circle","capsule","hearts","bow","petals","#f9a8d4,#fbcfe8,#fda4af,#f5d0fe,#fecdd3","Changa",
  `.lbd-xTop3Girly .lr.k-tok .ped{background:linear-gradient(180deg,#fff0f6,#f9a8d4);border-radius:18px 18px 4px 4px;color:#be185d;box-shadow:inset 0 0 0 3px #fff,0 10px 22px #f472b655}`),
 D("xTop3NeonBlue","تتويج نيون أزرق","منصات بحواف نيون زرقاء تنبض وشهب ودوائر إلكترونية","ring","hex","carbon","circuit","cosmic","lightning","#22e1ff,#60a5fa,#a78bfa,#38bdf8,#93c5fd","Orbitron",
  `.lbd-xTop3NeonBlue .lr.k-tok .ped{background:#05081acc;border:2px solid var(--rc);box-shadow:0 0 14px var(--rc),inset 0 0 14px color-mix(in srgb,var(--rc) 50%,transparent);color:var(--rc);text-shadow:0 0 8px var(--rc);animation:t3-neon 1.6s ease-in-out infinite}@keyframes t3-neon{50%{box-shadow:0 0 26px var(--rc),inset 0 0 20px var(--rc)}}`),
 D("xTop3Rgb","تتويج RGB","منصات بإضاءة RGB تتدرج باستمرار وبرق — طابع قيمنق","hex","hex","carbon","bolts","firering","confetti","#ff2d55,#2ee59d,#3ba8ff,#b56bff,#facc15","Orbitron",
  `.lbd-xTop3Rgb .lr.k-tok .ped{background:linear-gradient(90deg,#ff2d55,#facc15,#2ee59d,#3ba8ff,#b56bff,#ff2d55);background-size:300% 100%;animation:t3-rgb 3s linear infinite}@keyframes t3-rgb{to{background-position:300% 0}}.lbd-xTop3Rgb .lr-av img{animation:t3-hue 3s linear infinite}@keyframes t3-hue{to{filter:hue-rotate(360deg)}}`),
 D("xTop3Diamond","تتويج الألماس","منصات ألماسية بأوجه مضيئة وألماس يتجمع حول الأول","diamond","diamond","glass","diamonds","cosmic","diamonds","#bae6fd,#e0f2fe,#c7d2fe,#a5f3fc,#ddd6fe","Readex Pro",
  `.lbd-xTop3Diamond .lr.k-tok .ped{clip-path:polygon(10% 0,90% 0,100% 30%,100% 100%,0 100%,0 30%);background:linear-gradient(135deg,#ffffff,#bae6fd 35%,#7dd3fc 50%,#e0f2fe 65%,#93c5fd);color:#1e3a8a}`),
 D("xTop3Fire","تتويج ناري","منصات من حمم ولهب يتصاعد وحلقة نار حول الأول","ring","shield","plate","flames","firering","firering","#ff5a1f,#ffb020,#ef4444,#fb923c,#facc15","Changa",
  `.lbd-xTop3Fire .lr.k-tok .ped{background:linear-gradient(180deg,#ffb020,#ff5a1f 40%,#7f1d1d);box-shadow:0 -6px 18px #ff5a1f99,inset 0 2px 0 #ffd27a}.lbd-xTop3Fire .lr.k-tok .ped::before{content:"";position:absolute;inset:-30% 10% auto;height:40%;background:radial-gradient(ellipse at 50% 100%,#ffb020aa,transparent 70%);animation:t3-fl .6s ease-in-out infinite alternate}@keyframes t3-fl{to{transform:scaleY(1.3);opacity:.6}}`),
 D("top3Glass","تتويج زجاجي","منصات زجاج شفاف بلمعة تمر عليها — أنيق وخفيف","squircle","circle","glass","dust","crown","stars","#e0f2fe,#f1f5f9,#e2e8f0,#cbd5e1,#f8fafc","Readex Pro",
  `.lbd-top3Glass .lr.k-tok .ped{background:linear-gradient(180deg,#ffffff40,#ffffff12);backdrop-filter:blur(6px);border:1px solid #ffffff66;overflow:hidden}.lbd-top3Glass .lr.k-tok .ped::before{content:"";position:absolute;inset:0;background:linear-gradient(100deg,transparent 30%,#ffffff88 50%,transparent 70%);background-size:250% 100%;animation:t3-sh 2.8s linear infinite}@keyframes t3-sh{from{background-position:150% 0}to{background-position:-100% 0}}`,false),
 D("top3Clear","تتويج شفاف بالكامل","بدون منصات ولا خلفيات: الصور والأسماء والأرقام فقط فوق البث","ring","big","none","none","crown","none","#ffffff,#e5e7eb,#fcd34d,#ffffff,#ffffff","Changa",
  `.lbd-top3Clear .lr.k-tok .ped{background:none;box-shadow:none;border:0;color:#fff;text-shadow:0 2px 6px #000,0 0 2px #000;place-items:start center;font-size:calc(var(--av)*.28)}`,false),
 D("xTop3BlackGold","تتويج فاخر أسود وذهبي","منصات سوداء بحواف ذهبية وعملات تتساقط وتاج متوهج","hex","shield","line","coins","throne","coins","#d4a017,#e5e7eb,#b45309,#fde68a,#f6c94a","Amiri",
  `.lbd-xTop3BlackGold .lr.k-tok .ped{background:linear-gradient(180deg,#1a1a1a,#000);border:2px solid #d4a017;color:#f6c94a;box-shadow:inset 0 0 0 4px #000,inset 0 0 0 5px #d4a01766,0 10px 24px #000a}`),
].map((d,i)=>({...d,n:451+i,css:T3_BASE+d.css}));
LB_DESIGNS.push(...LB_TOP3.filter(d=>!LB_DESIGNS.some(x=>x.id===d.id)));
