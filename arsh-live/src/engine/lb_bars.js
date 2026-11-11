// ====== قوائم الترتيب الأساسية والمتحركة (Bars Collection) ======
// أشرطة أفقية نحيفة فوق بعضها: رقم المركز ← الصورة ← الاسم ← العدد. تُضاف لمكتبة Pro الحالية (نفس العنصر lb).
// كل تصميم = شكل شريط (bar) + زخرفة (deco) + خط + ألوان، وكل زوج (شكل، زخرفة) لا يتكرر.
import { LB_DESIGNS, LB_CATS } from "./lb.js";

Object.assign(LB_CATS,{basic:"الأساسية (ملونة وشفافة)",boys:"الشبابية والألعاب",girls:"البناتية والناعمة",ptrans:"الشفافة الفاخرة",creative:"الإبداعية"});
const RC5=["#f5c542","#cbd5e1","#d08a52","#3b82f6","#a855f7"];

// ---------- الزخارف (SVG أصلية متحركة) ----------
const BF='<svg class="lbx-bf" viewBox="-16 -14 32 26"><g class="w l"><path d="M0 0C-3-9-13-11-12-3C-11 1-5 2 0 0Z"/><path d="M0 1C-3 5-9 9-8 4C-7 2-4 1 0 1Z" opacity=".8"/></g><g class="w r"><path d="M0 0C3-9 13-11 12-3C11 1 5 2 0 0Z"/><path d="M0 1C3 5 9 9 8 4C7 2 4 1 0 1Z" opacity=".8"/></g><ellipse rx="1.1" ry="5" fill="#2a0f3a"/><rect class="sh" x="-14" y="-12" width="5" height="22" transform="skewX(-20)"/></svg>';
const STAR='<svg viewBox="0 0 20 20"><path d="M10 0l2.2 7.8L20 10l-7.8 2.2L10 20l-2.2-7.8L0 10l7.8-2.2z"/></svg>';
const LBB_CROWN='<svg viewBox="0 0 64 44"><path d="M3 38 7 9l14 15L32 2l11 22L57 9l4 29z"/><rect x="5" y="38" width="54" height="6" rx="2"/></svg>';
const LBB_WING='<svg viewBox="0 0 60 40"><path d="M58 22C48 6 26 0 2 2c10 4 17 7 22 11-8-1-15 0-21 3 9 1 16 3 21 6-6 1-12 3-17 7 13 0 27-2 51-7z"/></svg>';
const BOLT='<svg viewBox="0 0 12 20"><path d="M7 0 0 11h5l-2 9 9-12H7z"/></svg>';
const HEART='<svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.3C1 8.4 3 5 6.4 5c2 0 3.6 1.1 4.6 2.6C12 6.1 13.6 5 15.6 5 19 5 21 8.4 19.6 11.7 17.5 16.4 12 21 12 21z"/></svg>';
const PETAL='<svg viewBox="0 0 10 12"><path d="M5 12C1 9 0 4 5 0c5 4 4 9 0 12z"/></svg>';
const FLAME='<svg viewBox="0 0 20 30"><path d="M10 30C3 27 1 20 5 13c1 4 3 5 4 3C8 10 10 5 14 0c-1 7 5 11 5 18 0 7-4 11-9 12z"/></svg>';
const SHARD='<svg viewBox="0 0 10 24"><path d="M5 0 10 9 6 24 0 10z"/></svg>';
const PALM='<svg viewBox="0 0 40 48"><path d="M19 47h2l1-26c3-1 9-1 15 3-3-6-9-8-14-7 4-3 10-4 14-3-5-4-11-3-15 0 1-4 5-8 9-9-6 0-10 3-12 7-2-4-6-7-12-7 4 1 8 5 9 9-4-3-10-4-15 0 4-1 10 0 14 3-5-1-11 1-14 7 6-4 12-4 15-3z"/></svg>';
const FEATHER='<svg viewBox="0 0 16 40"><path d="M8 40V8M8 2C2 10 1 22 8 34c7-12 6-24 0-32z"/></svg>';
const MOON='<svg viewBox="0 0 24 24"><path d="M15 2a10 10 0 1 0 7 15A8 8 0 1 1 15 2z"/></svg>';
const DECO={
 none:()=>"",
 butterfly:()=>`<i class="lbx d-bf">${BF}<b class="s s1">${STAR}</b><b class="s s2">${STAR}</b></i>`,
 butterflies:()=>`<i class="lbx d-bf">${BF}</i><i class="lbx d-bf b2">${BF}</i><i class="lbx d-bf b3">${BF}</i>`,
 stars:()=>[0,1,2,3,4,5].map(i=>`<b class="lbx d-st s${i}">${STAR}</b>`).join(""),
 crown:()=>`<i class="lbx d-cr">${LBB_CROWN}</i>`,
 bolts:()=>[0,1,2].map(i=>`<b class="lbx d-bo b${i}">${BOLT}</b>`).join(""),
 flames:()=>[0,1,2,3].map(i=>`<b class="lbx d-fl f${i}">${FLAME}</b>`).join(""),
 shards:()=>[0,1,2,3].map(i=>`<b class="lbx d-sh h${i}">${SHARD}</b>`).join(""),
 hearts:()=>[0,1,2,3,4].map(i=>`<b class="lbx d-ht h${i}">${HEART}</b>`).join(""),
 petals:()=>[0,1,2,3,4,5].map(i=>`<b class="lbx d-pt p${i}">${PETAL}</b>`).join(""),
 wings:()=>`<i class="lbx d-wg l">${LBB_WING}</i><i class="lbx d-wg r">${LBB_WING}</i>`,
 palm:()=>`<i class="lbx d-pm">${PALM}</i>`,
 feathers:()=>[0,1,2].map(i=>`<b class="lbx d-fe e${i}">${FEATHER}</b>`).join(""),
 moon:()=>`<i class="lbx d-mn">${MOON}</i>`+[0,1,2].map(i=>`<b class="lbx d-st s${i}">${STAR}</b>`).join(""),
 orbit:()=>`<i class="lbx d-or"><b></b><b></b><b></b></i>`,
 bubbles:()=>[0,1,2,3,4].map(i=>`<b class="lbx d-bb u${i}"></b>`).join(""),
 scan:()=>`<i class="lbx d-sc"></i>`,
 sparks:()=>[0,1,2,3,4,5,6,7].map(i=>`<b class="lbx d-sp k${i}"></b>`).join(""),
};
export const lbBarDeco=(k,mini)=>(DECO[k]||DECO.none)();

// ---------- تعريف التصاميم: [id, الاسم, الوصف, شكل الشريط, الزخرفة, الألوان, الخط] ----------
const P=(a)=>a.split(",");
const SETS={
 basic:[["basicColorful","Basic Colorful","كل مركز بلون (ذهبي، فضي، برونزي، أزرق، بنفسجي) — قابل للتغيير","solid","none",RC5,"Readex Pro"],
  ["transClean","Transparent Clean","بدون أي خلفية: الرقم والصورة والاسم والعدد فقط","clean","none",RC5,"Readex Pro"],
  ["transOutline","Transparent Outline","حدود رفيعة حول كل مركز وداخلها شفاف","outline","none",RC5,"Readex Pro"],
  ["transGlass","Transparent Glass","زجاج خفيف جداً مع التحكم بالشفافية","glass","none",RC5,"Readex Pro"]],
 boys:[["blackChrome","Black Chrome","كروم أسود لامع بحواف فضية","chrome","sparks",P("#e5e7eb,#9ca3af,#6b7280,#d1d5db,#f3f4f6"),"Orbitron"],
  ["silverRacing","Silver Racing","فضي رياضي بخطوط سباق مائلة","racing","none",P("#f8fafc,#cbd5e1,#94a3b8,#e2e8f0,#64748b"),"Changa"],
  ["blueNeonBar","Blue Neon","حدود نيون زرقاء متوهجة","neonline","sparks",P("#38bdf8,#60a5fa,#22d3ee,#818cf8,#0ea5e9"),"Orbitron"],
  ["redGaming","Red Gaming","زوايا مقطوعة حمراء بشريط جانبي","hud","bolts",P("#ef4444,#f87171,#dc2626,#fb7185,#b91c1c"),"Orbitron"],
  ["cyberpunkBar","Cyberpunk","سماوي ووردي مع خط مسح","cyber","scan",P("#22d3ee,#f0abfc,#a78bfa,#2dd4bf,#f472b6"),"Orbitron"],
  ["electricBar","Electric Lightning","صواعق صغيرة تومض حول القائمة","neonline","bolts",P("#facc15,#fde047,#eab308,#a3e635,#fbbf24"),"Changa"],
  ["fireEdge","Fire Edge","حواف نارية ولهب صغير يتراقص","flame","flames",P("#f97316,#fb923c,#ef4444,#fbbf24,#ea580c"),"Changa"],
  ["iceWarrior","Ice Warrior","بلورات ثلج زرقاء على الأطراف","facet","shards",P("#bae6fd,#7dd3fc,#e0f2fe,#38bdf8,#93c5fd"),"Readex Pro"],
  ["diamondGaming","Diamond Gaming","أوجه ألماسية مع ومضات","facet","sparks",P("#a5f3fc,#e0f2fe,#c4b5fd,#67e8f9,#93c5fd"),"Orbitron"],
  ["royalBlack","Royal Black","أسود ملكي بحدود ذهبية وتاج للأول","royal","crown",P("#f5c542,#e5e7eb,#d08a52,#facc15,#fde68a"),"Changa"],
  ["carbonFiber","Carbon Fiber","نسيج كربوني مع شريط لون المركز","carbon","none",P("#f97316,#e5e7eb,#ef4444,#22d3ee,#a3e635"),"Orbitron"],
  ["racingHud","Racing HUD","عداد سباق مع علامات قياس","hud","scan",P("#22c55e,#a3e635,#facc15,#f97316,#ef4444"),"Orbitron"],
  ["samuraiRed","Samurai Red","شريط بفرشاة حمراء وريشة","brush","feathers",P("#dc2626,#991b1b,#f87171,#7f1d1d,#ef4444"),"Changa"],
  ["goldenChampion","Golden Champion","ذهب بطولي مع نجوم وتاج","chrome","crown",P("#fbbf24,#fde68a,#d97706,#facc15,#f59e0b"),"Changa"],
  ["toxicGreen","Toxic Green","أخضر نيون مع فقاعات","neonline","bubbles",P("#84cc16,#a3e635,#22c55e,#4ade80,#bef264"),"Orbitron"],
  ["shadowPurple","Shadow Purple","بنفسجي داكن بظلال عميقة","capsule","sparks",P("#a855f7,#7c3aed,#c084fc,#6d28d9,#d8b4fe"),"Changa"],
  ["hologramBlue","Hologram Blue","ألوان هولوغرام متغيرة مع خطوط","holo","scan",P("#67e8f9,#a5b4fc,#f0abfc,#93c5fd,#99f6e4"),"Orbitron"],
  ["metallicSteel","Metallic Steel","فولاذ مصقول بمسامير","steel","none",P("#94a3b8,#cbd5e1,#64748b,#e2e8f0,#475569"),"Orbitron"],
  ["spaceWarrior","Space Warrior","مدارات ونجوم فضائية","hud","orbit",P("#818cf8,#c4b5fd,#38bdf8,#a78bfa,#e0e7ff"),"Orbitron"],
  ["b6o6EsportsBar","B6O6 Esports","هوية B6O6 الزرقاء للبطولات","b6o6","bolts",P("#0a63ff,#e8f1ff,#7fb3ff,#c8d3e0,#3d8bff"),"Orbitron"]],
 girls:[["pinkButterfly","Pink Butterfly","فراشة وردية ترفرف في الزاوية","pill","butterfly",P("#ff8fd8,#f9a8d4,#f472b6,#fbcfe8,#ec4899"),"Changa"],
  ["purpleButterfly","Purple Butterfly","فراشة بنفسجية مع نجمتين","glass","butterfly",P("#c084fc,#d8b4fe,#a855f7,#e9d5ff,#9333ea"),"Changa"],
  ["crystalButterfly","Crystal Butterfly","فراشات كريستالية على أوجه لامعة","facet","butterflies",P("#bae6fd,#fbcfe8,#e9d5ff,#a5f3fc,#f5d0fe"),"Readex Pro"],
  ["sakuraFlowers","Sakura Flowers","بتلات ساكورا تتساقط","pill","petals",P("#fbcfe8,#f9a8d4,#fda4af,#fecdd3,#f472b6"),"Changa"],
  ["pinkCloudBar","Pink Cloud","غيوم وردية ناعمة","cloud","none",P("#fbcfe8,#f5d0fe,#fecdd3,#e9d5ff,#fce7f3"),"Changa"],
  ["roseGold","Rose Gold","ذهبي وردي لامع","chrome","sparks",P("#fda4af,#fecaca,#fb7185,#fde68a,#fbcfe8"),"Changa"],
  ["diamondPrincess","Diamond Princess","ألماس وتاج صغير للأميرة","facet","crown",P("#f5d0fe,#e0f2fe,#fbcfe8,#c4b5fd,#a5f3fc"),"Changa"],
  ["crystalHeart","Crystal Heart","قلوب كريستالية تطفو","glass","hearts",P("#f9a8d4,#fda4af,#fbcfe8,#f472b6,#fecdd3"),"Changa"],
  ["fairyWings","Fairy Wings","أجنحة جنية شفافة على الأطراف","pill","wings",P("#e9d5ff,#fbcfe8,#bae6fd,#f5d0fe,#c7d2fe"),"Changa"],
  ["moonPrincess","Moon Princess","هلال ونجوم فوق القائمة","capsule","moon",P("#e0e7ff,#c7d2fe,#fde68a,#f5d0fe,#bae6fd"),"Changa"],
  ["pearlWhite","Pearl White","لؤلؤ أبيض بلمعة ناعمة","pearl","sparks",P("#ffffff,#f1f5f9,#fef3c7,#fce7f3,#e0f2fe"),"Readex Pro"],
  ["pinkGalaxy","Pink Galaxy","مجرة وردية بمدارات","holo","orbit",P("#f472b6,#c084fc,#fb7185,#a78bfa,#f0abfc"),"Changa"],
  ["lavenderDream","Lavender Dream","لافندر حالم مع فقاعات","cloud","bubbles",P("#c4b5fd,#ddd6fe,#e9d5ff,#a78bfa,#f5d0fe"),"Changa"],
  ["goldenRoseBar","Golden Rose","وردة ذهبية وبتلات","royal","petals",P("#fda4af,#fde68a,#fb7185,#fcd34d,#fecdd3"),"Changa"],
  ["starPrincess","Star Princess","نجوم لامعة حول القائمة","pill","stars",P("#fde68a,#fbcfe8,#e9d5ff,#fef3c7,#f9a8d4"),"Changa"],
  ["softAngel","Soft Angel","ريش ملائكي أبيض","pearl","feathers",P("#ffffff,#e0f2fe,#fef3c7,#f5f3ff,#fce7f3"),"Changa"],
  ["cherryBlossom","Cherry Blossom","أزهار الكرز مع فراشة","glass","petals",P("#fb7185,#fda4af,#fecdd3,#f43f5e,#ffe4e6"),"Changa"],
  ["candyGlass","Candy Glass","زجاج حلوى بألوان مختلفة","candy","bubbles",P("#f472b6,#38bdf8,#a3e635,#facc15,#c084fc"),"Changa"],
  ["butterflyCrown","Butterfly Crown","تاج مع فراشات","royal","butterflies",P("#f0abfc,#fde68a,#c084fc,#fbcfe8,#e9d5ff"),"Changa"],
  ["b6o6PinkRoyal","B6O6 Pink Royal","هوية B6O6 الوردية الملكية","b6o6","crown",P("#ec4899,#fbcfe8,#f472b6,#fde68a,#db2777"),"Changa"]],
 ptrans:[["floatingGold","Floating Gold","نص ذهبي عائم بدون خلفية","clean","sparks",P("#fbbf24,#fde68a,#f59e0b,#fcd34d,#d97706"),"Changa"],
  ["floatingSilver","Floating Silver","نص فضي عائم بظل ناعم","clean","none",P("#f1f5f9,#cbd5e1,#e2e8f0,#94a3b8,#f8fafc"),"Readex Pro"],
  ["minimalWhiteBar","Minimal White","خط أبيض رفيع تحت كل مركز","underline","none",P("#ffffff,#e5e7eb,#f3f4f6,#d1d5db,#f9fafb"),"Readex Pro"],
  ["minimalBlackBar","Minimal Black","نص أسود بحد أبيض لخلفيات فاتحة","ink","none",P("#111827,#1f2937,#374151,#111827,#1f2937"),"Readex Pro"],
  ["diamondOutline","Diamond Outline","حدود ألماسية مقطوعة الأوجه","facetline","sparks",P("#a5f3fc,#e0f2fe,#c4b5fd,#67e8f9,#93c5fd"),"Readex Pro"],
  ["neonOutline","Neon Outline","حد نيون فقط وداخله شفاف","neonline","none",P("#22d3ee,#f0abfc,#a3e635,#facc15,#fb7185"),"Orbitron"],
  ["crystalBorder","Crystal Border","حدود كريستالية مع شظايا","outline","shards",P("#bae6fd,#e0f2fe,#a5f3fc,#c7d2fe,#f0f9ff"),"Readex Pro"],
  ["goldenLine","Golden Line","خط ذهبي متدرج تحت الاسم","underline","sparks",P("#fbbf24,#fde68a,#d97706,#facc15,#f59e0b"),"Changa"],
  ["royalCrownT","Royal Crown","شفاف مع تاج ذهبي للأول","clean","crown",P("#fbbf24,#e5e7eb,#d08a52,#fde68a,#facc15"),"Changa"],
  ["starBorder","Star Border","حدود منقطة مع نجوم","dotted","stars",P("#fde68a,#e0f2fe,#fbcfe8,#c7d2fe,#fef3c7"),"Changa"],
  ["butterflyOutline","Butterfly Outline","حدود رفيعة مع فراشة","outline","butterfly",P("#f0abfc,#c084fc,#f9a8d4,#e9d5ff,#a78bfa"),"Changa"],
  ["floatingHearts","Floating Hearts","قلوب صغيرة تطفو حول الأسماء","clean","hearts",P("#fb7185,#f472b6,#fda4af,#f43f5e,#fecdd3"),"Changa"],
  ["liquidGlassBar","Liquid Glass","زجاج سائل بانعكاس متحرك","liquid","none",P("#e0f2fe,#f5f3ff,#ecfeff,#fdf4ff,#f0fdf4"),"Readex Pro"],
  ["transWings","Transparent Wings","أجنحة شفافة على جانبي القائمة","clean","wings",P("#e0f2fe,#fde68a,#f5d0fe,#bae6fd,#fef3c7"),"Changa"],
  ["cyberOutline","Cyber Outline","حدود سايبر بزوايا مقطوعة","hudline","scan",P("#22d3ee,#f0abfc,#a78bfa,#2dd4bf,#f472b6"),"Orbitron"],
  ["miniGaming","Mini Gaming","صغيرة جداً بطابع الألعاب","mini","bolts",P("#22d3ee,#a3e635,#facc15,#f97316,#ef4444"),"Orbitron"],
  ["miniRoyal","Mini Royal","صغيرة ملكية بتاج","mini","crown",P("#fbbf24,#e5e7eb,#d08a52,#fde68a,#facc15"),"Changa"],
  ["miniButterfly","Mini Butterfly","صغيرة مع فراشة","mini","butterfly",P("#f9a8d4,#c084fc,#fbcfe8,#e9d5ff,#f0abfc"),"Changa"],
  ["saudiPalmT","Saudi Palm","نخلة ذهبية وخط أخضر","underline","palm",P("#16a34a,#c9a227,#22c55e,#fde68a,#15803d"),"Changa"],
  ["b6o6SigT","B6O6 Signature","توقيع B6O6 الشفاف","outline","sparks",P("#0a63ff,#e8f1ff,#7fb3ff,#c8d3e0,#3d8bff"),"Orbitron"]],
 creative:[["goldenSnake","Golden Snake","الأشرطة تتعرج كأفعى ذهبية","snake","sparks",P("#fbbf24,#fde68a,#d97706,#facc15,#f59e0b"),"Changa"],
  ["diamondSteps","Diamond Steps","درجات ألماسية متدرجة","steps","shards",P("#a5f3fc,#e0f2fe,#c4b5fd,#67e8f9,#93c5fd"),"Readex Pro"],
  ["royalRibbon","Royal Ribbon","شرائط ملكية بذيول","ribbon","crown",P("#dc2626,#f5c542,#7c3aed,#2563eb,#16a34a"),"Changa"],
  ["butterflyTrail","Butterfly Trail","مسار فراشات على القائمة","snake","butterflies",P("#f0abfc,#c084fc,#f9a8d4,#a78bfa,#fbcfe8"),"Changa"],
  ["neonCapsules","Neon Capsules","كبسولات نيون منفصلة","capsule","none",P("#22d3ee,#f0abfc,#a3e635,#facc15,#fb7185"),"Orbitron"],
  ["crystalBars","Crystal Bars","أشرطة كريستالية بأوجه","facet","none",P("#bae6fd,#e0f2fe,#c7d2fe,#a5f3fc,#f0f9ff"),"Readex Pro"],
  ["floatingWings","Floating Wings","أجنحة طافية خلف كل مركز","pill","wings",P("#fde68a,#e0f2fe,#f5d0fe,#fef3c7,#bae6fd"),"Changa"],
  ["starfall","Starfall","نجوم متساقطة","clean","stars",P("#fde68a,#e0f2fe,#c7d2fe,#fef3c7,#fbcfe8"),"Changa"],
  ["iceShards","Ice Shards","شظايا ثلج حادة على حدود مقطوعة","facetline","shards",P("#7dd3fc,#bae6fd,#e0f2fe,#38bdf8,#0ea5e9"),"Orbitron"],
  ["fireTrails","Fire Trails","آثار نار خلف الأشرطة","flame","flames",P("#f97316,#ef4444,#fbbf24,#ea580c,#dc2626"),"Changa"],
  ["pinkBubbles","Pink Bubbles","فقاعات وردية صاعدة","bubble","bubbles",P("#f9a8d4,#f472b6,#fbcfe8,#ec4899,#fda4af"),"Changa"],
  ["galaxyOrbit","Galaxy Orbit","مدارات مجرية حول القائمة","glass","orbit",P("#818cf8,#c084fc,#38bdf8,#a78bfa,#f0abfc"),"Orbitron"],
  ["saudiGold","Saudi Gold","زخارف سعودية ذهبية","saudi","palm",P("#c9a227,#fde68a,#16a34a,#facc15,#22c55e"),"Changa"],
  ["moonlight","Moonlight","ضوء القمر على أشرطة داكنة","capsule","moon",P("#e0e7ff,#c7d2fe,#fef3c7,#bae6fd,#f5f3ff"),"Readex Pro"],
  ["racingStripes","Racing Stripes","خطوط سباق متحركة","racing","bolts",P("#ef4444,#f8fafc,#2563eb,#facc15,#111827"),"Orbitron"],
  ["hologramBars","Hologram Bars","أشرطة هولوغرام بقوس قزح","holo","sparks",P("#67e8f9,#f0abfc,#a5b4fc,#99f6e4,#fde68a"),"Orbitron"],
  ["crownSteps","Crown Steps","درجات ملكية وتاج للقمة","steps","crown",P("#fbbf24,#e5e7eb,#d08a52,#fde68a,#facc15"),"Changa"],
  ["emeraldGlow","Emerald Glow","توهج زمردي","neonline","sparks",P("#10b981,#34d399,#059669,#6ee7b7,#047857"),"Readex Pro"],
  ["angelFeathers","Angel Feathers","ريش ملائكي يتساقط","pearl","feathers",P("#ffffff,#fef3c7,#e0f2fe,#fce7f3,#f5f3ff"),"Changa"],
  ["b6o6Ultimate","B6O6 Ultimate","تصميم B6O6 الأسطوري: تاج + برق + هولوغرام","b6o6","sparks",P("#0a63ff,#fde68a,#7fb3ff,#e8f1ff,#3d8bff"),"Orbitron"]],
};
let lbN=200;
const BAR_DESIGNS=[];
for(const [cat,list] of Object.entries(SETS)) for(const [id,name,desc,bar,deco,colors,font] of list) BAR_DESIGNS.push({id,n:++lbN,name,cat,desc,colors,font,layout:"bars",bar,deco,row:"bar",halo:"none"});
// منع التكرار: كل (شكل، زخرفة) فريد داخل كل مجموعة
LB_DESIGNS.push(...BAR_DESIGNS.filter(d=>!LB_DESIGNS.some(x=>x.id===d.id)));
export const LB_BAR_COUNT=BAR_DESIGNS.length;

/** أماكن الأشرطة: عمود واحد حتى 10، وعمودان لـ 15 و20 — ارتفاع ثابت لكل مركز (لا قفز) */
export function lbBarSlots(N,W,H,g){ const cols=N>=15?2:1, per=Math.ceil(N/cols), cw=(W-g*(cols-1))/cols; const h=Math.min((H-g*(per-1))/per,cw*.17); const S=[];
 for(let i=0;i<N;i++){ const c=Math.floor(i/per), r=i%per; S[i]={x:cols===2?(c===0?cw+g:0):0,y:r*(h+g),w:cw,h,k:"row"} } return S }
/** تنسيق الأرقام: مختصر 24.5K أو كامل 24,500 */
export function lbCompact(v){ const a=Math.abs(v); if(a>=1e6) return (Math.round(v/1e5)/10)+"M"; if(a>=1e3) return (Math.round(v/100)/10)+"K"; return String(Math.round(v)) }
export const LB_BAR_ICONS={likes:HEART,gifts:'<svg viewBox="0 0 20 20"><path d="M10 0 20 7 10 20 0 7z"/><path fill="#fff" opacity=".45" d="M10 0 13 7H7z"/></svg>',giftCount:'<svg viewBox="0 0 24 24"><path d="M3 9h18v4H3zM4.5 13h15v8h-15z"/></svg>',comments:'<svg viewBox="0 0 24 24"><path d="M3 4h18v12H8l-5 4z"/></svg>',interact:BOLT};

export const LB_BAR_CSS=`
.lbw.lbl-bars .lr .lr-card{top:0;bottom:0;left:0;right:0;border-radius:999px;background:linear-gradient(90deg,color-mix(in srgb,var(--rc) calc(var(--ro)*100%),transparent),color-mix(in srgb,var(--rc) calc(var(--ro)*55%),transparent));overflow:hidden}
.lbw.lbl-bars .lr-rk{display:flex!important;right:calc(var(--rh)*.18);top:50%;bottom:auto;transform:translateY(-50%);width:calc(var(--rh)*.7);height:calc(var(--rh)*.7);background:none!important;box-shadow:none!important;border-radius:50%;color:var(--rkc,#fff);font-weight:900;font-size:calc(var(--rh)*.44);align-items:center;justify-content:center;text-shadow:0 1px 3px #000a}
.lbw.lbl-bars .lr.medal .lr-rk{font-size:calc(var(--rh)*.6)}
.lbw.lbl-bars .lr-av{right:calc(var(--rh)*.98);top:calc(50% - var(--av)/2)}
.lbw.lbl-bars .lr-av .halo{display:none}
.lbw.lbl-bars .lr-av img{box-shadow:0 0 0 calc(var(--rh)*.04) color-mix(in srgb,var(--rc) 80%,#fff)}
.lbw.lbl-bars .lbn-hide-av .lr-av{display:none}
.lbw.lbl-bars .lr-nm{right:calc(var(--rh)*1.12 + var(--av));left:calc(var(--rh)*2.5);font-size:calc(var(--rh)*.42);text-align:right;unicode-bidi:plaintext;color:var(--tx2,#fff);text-shadow:0 1px 3px #000c}
.lbw.lbl-bars .lr-vl{left:calc(var(--rh)*.32);font-size:calc(var(--rh)*.42);display:flex;align-items:center;gap:calc(var(--rh)*.12);direction:ltr}
.lbw.lbl-bars .lr-vl b{color:var(--vlc,var(--tx2,#fff));font-weight:900}
.lbw.lbl-bars .lr-vl .ic{display:inline-flex;width:calc(var(--rh)*.42);height:calc(var(--rh)*.42);color:var(--icc,#ff4d6d);font-size:0}
.lbw.lbl-bars .lr-vl .ic svg{width:100%;height:100%;fill:currentColor}
.lbw.lbl-bars.lbs-gifts .lr-vl .ic{color:var(--icc,#67e8f9)}
.lbw.lbl-bars.lb-noic .lr-vl .ic,.lbw.lbl-bars.lb-norank .lr-rk{display:none!important}
.lbw.lbl-bars.lb-norank .lr-av{right:calc(var(--rh)*.25)}.lbw.lbl-bars.lb-norank .lr-nm{right:calc(var(--rh)*.45 + var(--av))}
.lbw.lbl-bars.lb-noav .lr-av{display:none}.lbw.lbl-bars.lb-noav .lr-nm{right:calc(var(--rh)*1.05)}
.lbw.lbl-bars .lr.emp{opacity:.45}
.lbw.lbl-bars .lr .crw{display:none}
.lbw.lbl-bars.lb-crown1 .lr.r1 .crw{display:block;position:absolute;width:62%;left:19%;top:-42%;color:#fbbf24;filter:drop-shadow(0 0 4px #fbbf24)}
/* اللمعة الدورية (من اليمين لليسار) */
.lbw.lbl-bars .lr-card .swp{position:absolute;inset:0;overflow:hidden;border-radius:inherit;pointer-events:none}
.lbw.lbl-bars .lr-card .swp i{position:absolute;top:0;bottom:0;width:7%;right:-10%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.75),transparent);transform:skewX(-20deg);animation:lbb-shine var(--shd,1.1s) ease-in-out infinite;animation-duration:var(--shc,6s);animation-delay:var(--d)}
@keyframes lbb-shine{0%{right:-20%;opacity:0}3%{opacity:1}18%{right:110%;opacity:1}19%,100%{right:110%;opacity:0}}
.lbw.lbl-bars.lb-noshine .swp,.lbw.lbb-clean .swp,.lbw.lbb-underline .swp,.lbw.lbb-ink .swp,.lbw.lbb-capsule .swp{display:none}
/* المركز الأول: لمعة ذهبية + نجمتان */
.lbw.lbl-bars .lr.r1::before,.lbw.lbl-bars .lr.r1::after{content:"✦";position:absolute;color:#fde68a;font-size:calc(var(--rh)*.32);text-shadow:0 0 6px #fbbf24;animation:lb-twinkle 2.2s ease-in-out infinite;z-index:3;pointer-events:none}
.lbw.lbl-bars .lr.r1::before{top:-18%;right:calc(var(--rh)*.9)}.lbw.lbl-bars .lr.r1::after{bottom:-14%;right:calc(var(--rh)*2.4);animation-delay:-1.1s}
.lbw.lbl-bars.lb-no1fx .lr.r1::before,.lbw.lbl-bars.lb-no1fx .lr.r1::after{display:none}
.lbw.lbl-bars .lr.pulse .lr-vl b{animation:lbb-glow .7s ease}
@keyframes lbb-glow{40%{text-shadow:0 0 10px #fff,0 0 18px var(--rc)}}
.lbw.lbl-bars .lr.newtop .lr-card{animation:lbb-top 1.6s ease}
@keyframes lbb-top{20%{box-shadow:0 0 0 2px #fff,0 0 24px var(--rc)}}
.lbw.lbl-bars .lr{transition:transform calc(.6s / var(--las,1)) cubic-bezier(.2,.8,.2,1)}
/* الزخارف */
.lbw.lbl-bars .lbx-deco{position:absolute;inset:0;pointer-events:none;z-index:4}
.lbw.lbl-bars .lbx{position:absolute;display:block}
.lbw.lbl-bars .lbx svg{width:100%;height:100%;fill:currentColor;overflow:visible}
.lbw.lbl-bars .d-bf{top:-6%;left:-2%;width:calc(var(--rh0)*1.1);height:calc(var(--rh0)*.9);color:var(--rc1);animation:lbb-float calc(3.4s / var(--las,1)) ease-in-out infinite}
.lbw.lbl-bars .d-bf.b2{top:auto;bottom:-4%;left:auto;right:30%;width:calc(var(--rh0)*.7);animation-delay:-1.5s;color:var(--rc2)}.lbw.lbl-bars .d-bf.b3{top:30%;left:auto;right:-3%;width:calc(var(--rh0)*.6);animation-delay:-2.4s;color:var(--rc3)}
.lbx-bf .w{transform-box:fill-box;animation:bf-flap .28s ease-in-out infinite alternate}.lbx-bf .w.l{transform-origin:100% 50%}.lbx-bf .w.r{transform-origin:0 50%}
.lbx-bf .sh{fill:#fff;opacity:.55;animation:lbb-wsh 3s ease-in-out infinite}
@keyframes lbb-wsh{0%,70%{transform:translateX(0) skewX(-20deg);opacity:0}80%{opacity:.6}100%{transform:translateX(26px) skewX(-20deg);opacity:0}}
@keyframes bf-flap{from{transform:scaleX(1)}to{transform:scaleX(.3)}}
@keyframes lbb-float{0%,100%{transform:translate(0,0) rotate(-6deg)}50%{transform:translate(8%,-10%) rotate(6deg)}}
.lbw.lbl-bars .d-bf .s{position:absolute;width:30%;height:30%;color:#fff;animation:lb-twinkle 2s ease-in-out infinite}.lbw.lbl-bars .d-bf .s1{top:-20%;right:-20%}.lbw.lbl-bars .d-bf .s2{bottom:-10%;left:-25%;animation-delay:-1s}
.lbw.lbl-bars .d-st{width:calc(var(--rh0)*.32);height:calc(var(--rh0)*.32);color:#fff8d6;filter:drop-shadow(0 0 3px #fde68a);animation:lb-twinkle 2.4s ease-in-out infinite}
.lbw.lbl-bars .d-st.s0{top:-5%;left:6%}.lbw.lbl-bars .d-st.s1{top:22%;left:-2%;animation-delay:-.8s}.lbw.lbl-bars .d-st.s2{top:48%;right:-2%;animation-delay:-1.6s}.lbw.lbl-bars .d-st.s3{bottom:2%;left:30%;animation-delay:-.4s}.lbw.lbl-bars .d-st.s4{top:-6%;right:22%;animation-delay:-1.2s}.lbw.lbl-bars .d-st.s5{bottom:-4%;right:8%;animation-delay:-2s}
.lbw.lbl-bars .d-cr{top:calc(var(--rh0)*-.55);right:calc(var(--rh0)*.7);width:calc(var(--rh0)*.75);height:calc(var(--rh0)*.52);color:#fbbf24;filter:drop-shadow(0 0 4px #fbbf24);animation:lbb-crown 2.6s ease-in-out infinite}
@keyframes lbb-crown{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(6deg) translateY(-6%)}}
.lbw.lbl-bars .d-bo{width:calc(var(--rh0)*.3);height:calc(var(--rh0)*.5);color:#fde047;filter:drop-shadow(0 0 4px #facc15);opacity:0;animation:lbb-zap 2.4s steps(1) infinite}
.lbw.lbl-bars .d-bo.b0{top:-8%;left:4%}.lbw.lbl-bars .d-bo.b1{top:40%;right:-3%;animation-delay:-.8s}.lbw.lbl-bars .d-bo.b2{bottom:-6%;left:40%;animation-delay:-1.6s}
@keyframes lbb-zap{0%,100%{opacity:0}10%,14%{opacity:1}12%{opacity:.2}}
.lbw.lbl-bars .d-fl{bottom:auto;width:calc(var(--rh0)*.36);height:calc(var(--rh0)*.54);color:#fb923c;filter:drop-shadow(0 0 4px #f97316);transform-origin:50% 100%;animation:lbb-flame .6s ease-in-out infinite alternate}
.lbw.lbl-bars .d-fl.f0{top:-10%;left:2%}.lbw.lbl-bars .d-fl.f1{top:-10%;left:12%;animation-delay:-.3s;height:calc(var(--rh0)*.4)}.lbw.lbl-bars .d-fl.f2{top:-10%;right:4%;animation-delay:-.15s}.lbw.lbl-bars .d-fl.f3{top:-10%;right:14%;animation-delay:-.45s;height:calc(var(--rh0)*.38)}
@keyframes lbb-flame{from{transform:scaleY(1) skewX(-4deg)}to{transform:scaleY(1.25) skewX(5deg)}}
.lbw.lbl-bars .d-sh{width:calc(var(--rh0)*.22);height:calc(var(--rh0)*.55);color:#e0f2fe;filter:drop-shadow(0 0 3px #7dd3fc);animation:lbb-sh 3s ease-in-out infinite}
.lbw.lbl-bars .d-sh.h0{top:-6%;left:-1%;transform:rotate(-20deg)}.lbw.lbl-bars .d-sh.h1{top:-8%;left:5%;transform:rotate(15deg);animation-delay:-1s}.lbw.lbl-bars .d-sh.h2{bottom:-6%;right:-1%;transform:rotate(200deg);animation-delay:-2s}.lbw.lbl-bars .d-sh.h3{bottom:-8%;right:6%;transform:rotate(160deg);animation-delay:-.5s}
@keyframes lbb-sh{50%{opacity:.6;filter:drop-shadow(0 0 7px #e0f2fe)}}
.lbw.lbl-bars .d-ht{width:calc(var(--rh0)*.3);height:calc(var(--rh0)*.3);color:#fb7185;opacity:0;animation:lbb-rise calc(4s / var(--las,1)) ease-in infinite}
.lbw.lbl-bars .d-ht.h0{left:6%;bottom:0}.lbw.lbl-bars .d-ht.h1{left:24%;bottom:10%;animation-delay:-.8s}.lbw.lbl-bars .d-ht.h2{left:46%;bottom:0;animation-delay:-1.6s}.lbw.lbl-bars .d-ht.h3{left:68%;bottom:20%;animation-delay:-2.4s}.lbw.lbl-bars .d-ht.h4{left:88%;bottom:5%;animation-delay:-3.2s}
@keyframes lbb-rise{0%{opacity:0;transform:translateY(0) scale(.6)}20%{opacity:.9}100%{opacity:0;transform:translateY(-240%) scale(1)}}
.lbw.lbl-bars .d-pt{width:calc(var(--rh0)*.22);height:calc(var(--rh0)*.27);color:#fbcfe8;top:-10%;opacity:0;animation:lbb-fall calc(6s / var(--las,1)) linear infinite}
.lbw.lbl-bars .d-pt.p0{left:5%}.lbw.lbl-bars .d-pt.p1{left:22%;animation-delay:-1s}.lbw.lbl-bars .d-pt.p2{left:40%;animation-delay:-2s}.lbw.lbl-bars .d-pt.p3{left:58%;animation-delay:-3s}.lbw.lbl-bars .d-pt.p4{left:76%;animation-delay:-4s}.lbw.lbl-bars .d-pt.p5{left:92%;animation-delay:-5s}
@keyframes lbb-fall{0%{opacity:0;transform:translate(0,0) rotate(0)}10%{opacity:.9}100%{opacity:0;transform:translate(-30px,calc(var(--H0) * 1px)) rotate(400deg)}}
.lbw.lbl-bars .d-wg{top:0;width:calc(var(--rh0)*1.3);height:calc(var(--rh0)*.9);color:color-mix(in srgb,var(--rc1) 70%,#fff);opacity:.85;animation:lbb-wing 3s ease-in-out infinite}
.lbw.lbl-bars .d-wg.r{right:calc(var(--rh0)*-1.05);transform-origin:0 50%}.lbw.lbl-bars .d-wg.l{left:calc(var(--rh0)*-1.05);transform:scaleX(-1);transform-origin:100% 50%;animation-name:lbb-wingl}
@keyframes lbb-wing{50%{transform:rotate(-8deg)}}@keyframes lbb-wingl{0%,100%{transform:scaleX(-1)}50%{transform:scaleX(-1) rotate(-8deg)}}
.lbw.lbl-bars .d-pm{bottom:-2%;left:-1%;width:calc(var(--rh0)*.9);height:calc(var(--rh0)*1.1);color:#c9a227;filter:drop-shadow(0 0 3px #fde68a);transform-origin:50% 100%;animation:lbb-palm 4s ease-in-out infinite}
@keyframes lbb-palm{50%{transform:rotate(3deg)}}
.lbw.lbl-bars .d-fe{width:calc(var(--rh0)*.25);height:calc(var(--rh0)*.6);color:#fff;top:-14%;opacity:0;animation:lbb-fall calc(7s / var(--las,1)) linear infinite}
.lbw.lbl-bars .d-fe svg{fill:none;stroke:currentColor;stroke-width:1.4}.lbw.lbl-bars .d-fe.e0{left:10%}.lbw.lbl-bars .d-fe.e1{left:50%;animation-delay:-2.3s}.lbw.lbl-bars .d-fe.e2{left:84%;animation-delay:-4.6s}
.lbw.lbl-bars .d-mn{top:calc(var(--rh0)*-.6);left:2%;width:calc(var(--rh0)*.7);height:calc(var(--rh0)*.7);color:#fff6d0;filter:drop-shadow(0 0 6px #fde68a);animation:lbb-crown 5s ease-in-out infinite}
.lbw.lbl-bars .d-or{top:-8%;left:-4%;width:calc(var(--rh0)*1.2);height:calc(var(--rh0)*1.2);border:1px dashed color-mix(in srgb,var(--rc1) 60%,transparent);border-radius:50%;animation:le-spin 8s linear infinite}
.lbw.lbl-bars .d-or b{position:absolute;width:14%;height:14%;border-radius:50%;background:var(--rc2);box-shadow:0 0 6px var(--rc2)}.lbw.lbl-bars .d-or b:nth-child(1){top:-7%;left:43%}.lbw.lbl-bars .d-or b:nth-child(2){bottom:10%;right:2%;background:var(--rc1)}.lbw.lbl-bars .d-or b:nth-child(3){bottom:10%;left:2%;background:var(--rc3)}
.lbw.lbl-bars .d-bb{width:calc(var(--rh0)*.28);height:calc(var(--rh0)*.28);border-radius:50%;border:1px solid #ffffffaa;background:radial-gradient(circle at 30% 30%,#fff9,transparent 60%);bottom:0;opacity:0;animation:lbb-rise calc(5s / var(--las,1)) ease-in infinite}
.lbw.lbl-bars .d-bb.u0{left:4%}.lbw.lbl-bars .d-bb.u1{left:28%;animation-delay:-1s;width:calc(var(--rh0)*.18);height:calc(var(--rh0)*.18)}.lbw.lbl-bars .d-bb.u2{left:52%;animation-delay:-2s}.lbw.lbl-bars .d-bb.u3{left:74%;animation-delay:-3s;width:calc(var(--rh0)*.2);height:calc(var(--rh0)*.2)}.lbw.lbl-bars .d-bb.u4{left:92%;animation-delay:-4s}
.lbw.lbl-bars .d-sc{left:0;right:0;height:2px;top:0;background:linear-gradient(90deg,transparent,var(--rc1),transparent);box-shadow:0 0 8px var(--rc1);animation:lbb-scan 3.2s linear infinite}
@keyframes lbb-scan{from{top:0}to{top:100%}}
.lbw.lbl-bars .d-sp{width:3px;height:3px;border-radius:50%;background:#fff;box-shadow:0 0 6px var(--rc1);opacity:0;animation:lb-twinkle 2.6s ease-in-out infinite}
${[[2,6],[18,92],[40,3],[63,96],[85,8],[8,50],[95,40],[50,100]].map(([t,l],i)=>`.lbw.lbl-bars .d-sp.k${i}{top:${t}%;left:${l}%;animation-delay:-${(i*.33).toFixed(2)}s}`).join("")}
.lbw.lbl-bars.lb-nodeco .lbx-deco{display:none}
/* ===== أشكال الأشرطة ===== */
.lbw.lbb-clean .lr .lr-card{background:none!important;box-shadow:none!important;border:0!important}
.lbw.lbb-clean .lr-nm,.lbw.lbb-clean .lr-vl b,.lbw.lbb-clean .lr-rk{text-shadow:0 1px 2px #000,0 0 6px #000c}
.lbw.lbb-outline .lr .lr-card{background:none;border:1px solid color-mix(in srgb,var(--rc) 85%,#fff);box-shadow:none}
.lbw.lbb-glass .lr .lr-card{background:rgba(255,255,255,calc(var(--ro)*.16));border:1px solid rgba(255,255,255,calc(var(--ro)*.35));backdrop-filter:blur(8px)}
.lbw.lbb-solid.lbf-solid .lr .lr-card{background:color-mix(in srgb,var(--rc) calc(var(--ro)*100%),transparent)}
.lbw.lbb-solid .lr-nm,.lbw.lbb-solid .lr-vl b,.lbw.lbb-solid .lr-rk{color:var(--tx2,#fff)}
.lbw.lbb-chrome .lr .lr-card{background:linear-gradient(180deg,#3a3f47,#0b0d10 55%,#25292f);border:1px solid color-mix(in srgb,var(--rc) 80%,#fff);box-shadow:inset 0 1px 0 #ffffff55,0 0 10px color-mix(in srgb,var(--rc) 35%,transparent)}
.lbw.lbb-racing .lr .lr-card{border-radius:6px;background:repeating-linear-gradient(115deg,color-mix(in srgb,var(--rc) 30%,#0b0d10) 0 14px,#0b0d10 14px 22px);border-right:5px solid var(--rc);clip-path:polygon(4% 0,100% 0,96% 100%,0 100%)}
.lbw.lbb-neonline .lr .lr-card{background:rgba(5,6,14,calc(var(--ro)*.75));border:2px solid var(--rc);box-shadow:0 0 8px var(--rc),inset 0 0 8px color-mix(in srgb,var(--rc) 50%,transparent)}
.lbw.lbb-hud .lr .lr-card{border-radius:0;background:linear-gradient(90deg,rgba(10,15,28,.85),rgba(13,20,38,.95));border-right:4px solid var(--rc);clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))}
.lbw.lbb-hud .lr .lr-card::after{content:"";position:absolute;left:8px;right:40%;bottom:3px;height:2px;background:repeating-linear-gradient(90deg,var(--rc) 0 2px,transparent 2px 6px);opacity:.7}
.lbw.lbb-cyber .lr .lr-card{border-radius:0;background:linear-gradient(90deg,#001420e6,#140028e6);border-top:1px solid #22d3ee;border-bottom:1px solid #f0abfc;clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px)}
.lbw.lbb-flame .lr .lr-card{background:linear-gradient(90deg,#2a0603e6,#120201e6);border:1px solid #f97316;box-shadow:0 -3px 10px #f9731655,inset 0 -6px 12px #ef444455}
.lbw.lbb-facet .lr .lr-card,.lbw.lbb-facetline .lr .lr-card{border-radius:0;clip-path:polygon(3% 0,97% 0,100% 50%,97% 100%,3% 100%,0 50%);background:linear-gradient(120deg,color-mix(in srgb,var(--rc) 45%,#0b2240),#050f1f 60%,color-mix(in srgb,var(--rc) 30%,#0b2240))}
.lbw.lbb-facetline .lr .lr-card{background:linear-gradient(90deg,var(--rc),#fff,var(--rc));-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;padding:1.5px}
.lbw.lbb-royal .lr .lr-card{border-radius:6px;background:linear-gradient(180deg,#2a1d07f2,#0f0a02f2);border:2px solid #e8b84a;box-shadow:0 0 0 1px #0d0902,0 0 0 3px #a8761e}
.lbw.lbb-carbon .lr .lr-card{border-radius:6px;background:repeating-linear-gradient(45deg,#1b1b1b 0 4px,#262626 4px 8px),#1b1b1b;border-left:6px solid var(--rc);box-shadow:inset 0 1px 0 #ffffff22}
.lbw.lbb-brush .lr .lr-card{border-radius:2px 40px 2px 40px;background:linear-gradient(90deg,color-mix(in srgb,var(--rc) 80%,#000),#1a0505 80%);transform:skewX(-6deg)}
.lbw.lbb-capsule .lr .lr-card{background:none;border:0}
.lbw.lbb-capsule .lr .lr-card::before{content:"";position:absolute;right:0;top:8%;bottom:8%;width:calc(var(--rh)*1.95);border-radius:999px;background:var(--rc);box-shadow:0 0 10px color-mix(in srgb,var(--rc) 60%,transparent)}
.lbw.lbb-capsule .lr .lr-card::after{content:"";position:absolute;right:calc(var(--rh)*2.05);left:0;top:8%;bottom:8%;border-radius:999px;background:rgba(10,12,24,calc(var(--ro)*.85));border:1px solid color-mix(in srgb,var(--rc) 60%,transparent)}
.lbw.lbb-capsule .lr-rk{color:#111}
.lbw.lbb-capsule .lr .lr-nm{right:calc(var(--rh)*2.25)}
.lbw.lbl-bars .lb-t,.lbw.lbl-bars .lr-nm{letter-spacing:0!important;word-spacing:normal}
.lbw.lbb-holo .lr .lr-card{background:linear-gradient(110deg,#67e8f955,#f0abfc55,#a5b4fc55,#99f6e455);background-size:300% 100%;border:1px solid #ffffff66;animation:lbb-holo 6s linear infinite}
.lbw.lbb-holo .lr .lr-card::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 3px,#ffffff14 3px 4px)}
@keyframes lbb-holo{to{background-position:300% 0}}
.lbw.lbb-steel .lr .lr-card{border-radius:4px;background:linear-gradient(180deg,#cbd5e1,#64748b 45%,#94a3b8);border:1px solid #e2e8f0;box-shadow:inset 0 1px 0 #fff}
.lbw.lbb-steel .lr .lr-card::before,.lbw.lbb-steel .lr .lr-card::after{content:"";position:absolute;top:calc(50% - 3px);width:6px;height:6px;border-radius:50%;background:#334155;box-shadow:inset 0 1px 1px #000}.lbw.lbb-steel .lr .lr-card::before{left:6px}.lbw.lbb-steel .lr .lr-card::after{right:6px}
.lbw.lbb-steel .lr-nm,.lbw.lbb-steel .lr-vl b,.lbw.lbb-steel .lr-rk{color:#0f172a;text-shadow:0 1px 0 #ffffff88}
.lbw.lbb-b6o6 .lr .lr-card{border-radius:calc(var(--rh)*.5) calc(var(--rh)*.12);background:linear-gradient(135deg,color-mix(in srgb,var(--rc) 70%,#0a63ff),#06111ff2);border:1px solid #9fc3ff;box-shadow:0 0 10px #0a63ff66}
.lbw.lbb-pill .lr .lr-card{background:linear-gradient(90deg,color-mix(in srgb,var(--rc) calc(var(--ro)*85%),#6d28d9),color-mix(in srgb,#6d28d9 calc(var(--ro)*50%),transparent));box-shadow:0 0 0 1.5px color-mix(in srgb,var(--rc) 70%,#fff)}
.lbw.lbb-cloud .lr .lr-card{background:rgba(255,255,255,calc(var(--ro)*.85));box-shadow:0 4px 12px color-mix(in srgb,var(--rc) 50%,transparent)}
.lbw.lbb-cloud .lr .lr-card::before{content:"";position:absolute;top:-35%;left:12%;width:30%;height:70%;border-radius:50%;background:inherit}
.lbw.lbb-cloud .lr-nm,.lbw.lbb-cloud .lr-vl b,.lbw.lbb-cloud .lr-rk{color:#6b21a8;text-shadow:none}
.lbw.lbb-pearl .lr .lr-card{background:radial-gradient(120% 140% at 30% 0%,#fff,#f1f5f9 50%,color-mix(in srgb,var(--rc) 40%,#e2e8f0));box-shadow:inset 0 -2px 6px #0002}
.lbw.lbb-pearl .lr-nm,.lbw.lbb-pearl .lr-vl b,.lbw.lbb-pearl .lr-rk{color:#334155;text-shadow:none}
.lbw.lbb-candy .lr .lr-card{background:linear-gradient(90deg,color-mix(in srgb,var(--rc) 75%,#fff),color-mix(in srgb,var(--rc) 40%,#fff));box-shadow:inset 0 2px 0 #ffffffaa,0 3px 0 color-mix(in srgb,var(--rc) 60%,#000)}
.lbw.lbb-candy .lr-nm,.lbw.lbb-candy .lr-vl b,.lbw.lbb-candy .lr-rk{color:#3b0764;text-shadow:none}
.lbw.lbb-underline .lr .lr-card{background:none;border-radius:0;box-shadow:none}
.lbw.lbb-underline .lr .lr-card::after{content:"";position:absolute;left:0;right:0;bottom:4%;height:2px;background:linear-gradient(90deg,transparent,var(--rc),transparent)}
.lbw.lbb-underline .lr-nm,.lbw.lbb-underline .lr-vl b,.lbw.lbb-underline .lr-rk{text-shadow:0 1px 3px #000}
.lbw.lbb-ink .lr .lr-card{background:none;box-shadow:none}.lbw.lbb-ink .lr-nm,.lbw.lbb-ink .lr-vl b,.lbw.lbb-ink .lr-rk{color:#111827;text-shadow:0 0 2px #fff,0 0 4px #fff}
.lbw.lbb-dotted .lr .lr-card{background:none;border:2px dotted color-mix(in srgb,var(--rc) 85%,#fff)}
.lbw.lbb-liquid .lr .lr-card{background:linear-gradient(120deg,rgba(255,255,255,calc(var(--ro)*.22)),rgba(255,255,255,calc(var(--ro)*.06)) 40%,rgba(255,255,255,calc(var(--ro)*.2)) 70%,rgba(255,255,255,calc(var(--ro)*.05)));background-size:250% 100%;border:1px solid #ffffff55;backdrop-filter:blur(6px) saturate(1.4);animation:lbb-holo 8s ease-in-out infinite alternate}
.lbw.lbb-hudline .lr .lr-card{border-radius:0;background:none;border:1px solid var(--rc);clip-path:polygon(10px 0,100% 0,100% calc(100% - 10px),calc(100% - 10px) 100%,0 100%,0 10px);box-shadow:inset 0 0 8px color-mix(in srgb,var(--rc) 50%,transparent)}
.lbw.lbb-mini .lr .lr-card{background:rgba(0,0,0,calc(var(--ro)*.45));border-left:3px solid var(--rc);border-radius:4px}
.lbw.lbb-mini .lr-nm,.lbw.lbb-mini .lr-vl,.lbw.lbb-mini .lr-rk{font-size:calc(var(--rh)*.5)!important}
.lbw.lbb-snake .lr:nth-child(odd){margin-left:6%}.lbw.lbb-snake .lr .lr-card{border-radius:999px;background:linear-gradient(90deg,color-mix(in srgb,var(--rc) 80%,#000),color-mix(in srgb,var(--rc) 30%,#000));box-shadow:0 0 0 1px var(--rc)}
.lbw.lbb-snake .lr.r2,.lbw.lbb-snake .lr.r4,.lbw.lbb-snake .lr.r6,.lbw.lbb-snake .lr.r8,.lbw.lbb-snake .lr.r10{translate:5% 0}.lbw.lbb-snake .lr.r1,.lbw.lbb-snake .lr.r3,.lbw.lbb-snake .lr.r5,.lbw.lbb-snake .lr.r7,.lbw.lbb-snake .lr.r9{translate:-3% 0}
.lbw.lbb-steps .lr .lr-card{border-radius:4px;clip-path:polygon(0 0,100% 0,100% 100%,4% 100%);background:linear-gradient(90deg,color-mix(in srgb,var(--rc) 60%,#0b2240),#050f1f)}
${[1,2,3,4,5,6,7,8,9,10].map(i=>`.lbw.lbb-steps .lr.r${i}{scale:${(1-(i-1)*.035).toFixed(3)} 1;transform-origin:right center}`).join("")}
.lbw.lbb-ribbon .lr .lr-card{border-radius:0;background:linear-gradient(180deg,color-mix(in srgb,var(--rc) 85%,#fff),var(--rc) 50%,color-mix(in srgb,var(--rc) 70%,#000));clip-path:polygon(0 0,100% 0,96% 50%,100% 100%,0 100%,4% 50%)}
.lbw.lbb-bubble .lr .lr-card{background:radial-gradient(120% 120% at 30% 20%,color-mix(in srgb,var(--rc) 60%,#fff),var(--rc));box-shadow:inset 0 3px 6px #ffffff88,0 4px 10px color-mix(in srgb,var(--rc) 45%,transparent)}
.lbw.lbb-bubble .lr-nm,.lbw.lbb-bubble .lr-vl b,.lbw.lbb-bubble .lr-rk{color:#4a044e;text-shadow:0 1px 0 #ffffff88}
.lbw.lbb-saudi .lr .lr-card{border-radius:6px;background:linear-gradient(90deg,#005430f2,#00281af2);border:2px solid #c9a227}
.lbw.lbb-saudi .lr .lr-card::after{content:"";position:absolute;inset:auto 0 0 0;height:4px;background:repeating-linear-gradient(90deg,#c9a227 0 6px,transparent 6px 10px)}
`;
