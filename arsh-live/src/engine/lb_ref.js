// ====== قوائم التوب «المرجع» — تكوينات أصلية مستوحاة من فيديو المرجع (#401+) ======
// تُبنى من أجزاء محرك القوائم (ترتيب + إطار + رقم + اسم + مؤثرات + زخرفة المتصدر + احتفال) — بدون نسخ أي ملف أو شعار.
// المعرّفات تبدأ بـ r = تصاميم PRO (يُفرض على الخادم).
import { LB_DESIGNS, LB_CATS } from "./lb.js";
Object.assign(LB_CATS,{refTop:"المرجع: قوائم التوب (PRO)"});
const RC=s=>s.split(",");
// [id, الاسم, الوصف, ترتيب, إطار, رقم, اسم, مؤثرات, زخرفة الأول, احتفال, ألوان, خط]
const ART=[
 ["rDiamondRose","Diamond Rose","وردة ألماسية: إطارات كريستال وتاج ورد للمتصدر وبتلات تتساقط","column","crystal","diamond","glass","petals","rosecrown","petals","#f9a8d4,#e0f2fe,#fda4af,#c4b5fd,#fecdd3","Changa"],
 ["rPearlBow","Pearl Bow","فيونكة لؤلؤ فوق الأول وصفوف ناعمة بألوان الباستيل","row","soft","circle","capsule","dust","bow","hearts","#fbcfe8,#fde68a,#e9d5ff,#bae6fd,#fecdd3","Changa"],
 ["rSoftBow","Soft Bow","المتصدر كبير بفيونكة وردية والبقية تحته بلطف","hero","soft","circle","capsule","petals","bow","petals","#f9a8d4,#fbcfe8,#f5d0fe,#fecdd3,#e9d5ff","Changa"],
 ["rHighestGift","Highest Gift","أعلى هدية: داعم واحد كبير بتاج متوّج يتبدل كل عدة ثوانٍ","rotate","ring","none","plate","sparks","crown","crown","#f6c94a,#fde68a,#fbbf24,#fff7d1,#eab308","Changa"],
 ["rImperialGates","Imperial Gates","بوابات إمبراطورية: ذهبي وفضي وبرونزي على منصة التتويج","podium","arch","shield","plate","sparks","gate","halo","#f6c94a,#e5e7eb,#cd7f32,#fde68a,#fbbf24","Amiri"],
 ["rRoyalBloom","Royal Bloom","هلال من الورود الملكية وتاج ورد للمتصدر","crescent","ring","ribbon","ribbon","petals","rosecrown","petals","#e11d48,#f9a8d4,#be185d,#fde68a,#fb7185","Changa"],
 ["rLuxeGemHalo","Luxe Gem Halo","هالات جواهر على منصة: خمس حلقات كريستالية مضيئة","podium","crystal","hex","glass","diamonds","cosmic","diamonds","#a5f3fc,#c4b5fd,#f0abfc,#e0f2fe,#93c5fd","Readex Pro"],
 ["rObsidianRace","Obsidian Race","سباق الداعمين: كل داعم في مساره والأقوى في المقدمة مع شهب","race","ring","circle","plate","meteors","firering","confetti","#f97316,#22d3ee,#a855f7,#facc15,#ef4444","Orbitron"],
 ["rTop5Podium","Top 5 Podium","منصة أفضل 5 بميداليات وعرش للمتصدر وعملات ذهبية","podium","medal","big","plate","coins","throne","coins","#f6c94a,#cbd5e1,#d08a52,#60a5fa,#c084fc","Changa"],
 ["rTopGifterRank","Top Gifter Ranking","درجات سداسية متصاعدة وتاج للأقوى","stairs","hex","hex","carbon","sparks","crown","stars","#22e1ff,#f0abfc,#a3e635,#facc15,#fb7185","Orbitron"],
];
// [id, الاسم, الوصف, شكل الشريط, الزخرفة, ألوان, خط]
const BARS=[
 ["rCrystalButterflyTop","Crystal Butterfly Top","أشرطة زجاج بنفسجية وفراشة كريستالية ترفرف فوق القائمة","glass","butterfly","#c084fc,#a78bfa,#e9d5ff,#f0abfc,#8b5cf6","Changa"],
 ["rNeonShards","Neon Shards","حدود نيون مع شظايا متطايرة","neonline","shards","#f0abfc,#22d3ee,#a78bfa,#f472b6,#67e8f9","Orbitron"],
 ["rNeonDiamond","Neon Diamond","صفوف صغيرة مضغوطة لعشرة داعمين مع ومضات نيون","mini","sparks","#22d3ee,#f0abfc,#a3e635,#facc15,#fb7185","Orbitron"],
 ["rTop20Shimmer","Top 20 Shimmer","زجاج سائل للمراكز العشرين بلمعة تمر على الأشرطة","liquid","sparks","#fde68a,#e0f2fe,#f5d0fe,#bae6fd,#fef3c7","Readex Pro"],
];
export const LB_REF_DESIGNS=[
 ...ART.map(([id,name,desc,arr,frame,rk,nm,amb,d1,cel,colors,font],i)=>({id,n:401+i,name,cat:"refTop",desc,layout:"art",arr,frame,rk,nm,amb,d1,cel,colors:RC(colors),font,row:"art",halo:"none",pro:true})),
 ...BARS.map(([id,name,desc,bar,deco,colors,font],i)=>({id,n:401+ART.length+i,name,cat:"refTop",desc,layout:"bars",bar,deco,colors:RC(colors),font,row:"bar",halo:"none",pro:true})),
];
LB_DESIGNS.push(...LB_REF_DESIGNS.filter(d=>!LB_DESIGNS.some(x=>x.id===d.id)));
