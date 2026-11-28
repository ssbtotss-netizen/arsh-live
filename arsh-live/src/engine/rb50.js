// ====== قوانين السابثون: 50 تصميماً بهوية بصرية وحركية مستقلة (Fantastic Subathon) ======
// كل تصميم: شكل مستقل + حركة رئيسية فريدة من RB_MOTIONS (لا تتكرر بين تصميمين) + نوع خط سفلي + تخطيط.
// المعرّفات القديمة (royalRules…) محفوظة كأسماء بديلة حتى لا تنكسر روابط الطبقات الحالية.

export const RB_LIB={alpha:"شفافة",text:"كتابية",lines:"خطوط سفلية",lux:"فاخرة",glass:"زجاجية",gaming:"قيمنق",tech:"تقنية",cine:"سينمائية",motion:"متحركة",basic:"Basic",fav:"المفضلة"};
export const RB_GROUPS={g1:"الشفافة والخطوط السفلية",g2:"الفاخرة",g3:"التقنية والقيمنق",g4:"الإبداعية"};
export const RB_LINES={static:"ثابت",animated:"متحرك",neon:"نيون",gold:"ذهبي",silver:"فضي",gradient:"متدرج",sweep:"لمعة تمر عليه",reveal:"ظهور تدريجي",pulse:"نبض عند الهدية",none:"مخفي"};
export const RB_LAYOUTS={list:"قائمة",cards:"بطاقات عائمة",stack:"مكدسة عمودياً",hrow:"أفقية",grid2:"شبكة مضغوطة",timeline:"خط زمني",columns:"أعمدة ديناميكية",cine:"سينمائية"};
export const RB_PRESETS={full:"التصميم الكامل",basic:"بسيط",alpha:"شفاف",textOnly:"نص فقط",lineOnly:"خط سفلي فقط",custom:"مخصص"};
// [id, n, الاسم, المجموعة, تصنيفات المكتبة, الحركة الرئيسية, الخط الافتراضي, التخطيط, الوصف]
const RB50_D=[
 ["pureText",1,"Pure Text","g1",["alpha","text","basic"],"txBlur","none","list","نص صافٍ بلا خلفية — الأوضح فوق اللعبة"],
 ["floatingText",2,"Floating Text","g1",["alpha","text","motion"],"crJelly","none","list","نص عائم بظل ناعم وتمدد انسيابي عند الظهور"],
 ["minimalUnderline",3,"Minimal Underline","g1",["alpha","lines","basic"],"lnCenterGrow","static","list","خط رفيع أبيض تحت كل قانون ينمو من المنتصف"],
 ["goldenUnderline",4,"Golden Underline","g1",["alpha","lines","lux"],"lnSparks","gold","list","خط ذهبي يتشكل من شرارات"],
 ["neonUnderline",5,"Neon Underline","g1",["alpha","lines","gaming"],"tcElectric","neon","list","خط نيون بموجات كهربائية"],
 ["gradientLine",6,"Gradient Line","g1",["alpha","lines"],"lnTravel","gradient","list","خط متدرج الألوان يتحرك من اليمين لليسار"],
 ["lightSweep",7,"Light Sweep","g1",["alpha","lines","motion"],"lnReflect","sweep","list","لمعة ضوء تمر على الخط"],
 ["doubleLine",8,"Double Line","g1",["alpha","lines"],"lnGeo","static","list","خطان متوازيان يتشكلان هندسياً"],
 ["digitalLine",9,"Digital Line","g1",["alpha","lines","tech"],"lnDots","animated","list","خط رقمي متقطع يتجمع من نقاط"],
 ["diamondLine",10,"Diamond Line","g1",["alpha","lines","lux"],"lxDiamond","silver","list","خط بنهايتين ماسيتين وجزيئات ألماس"],
 ["pulseLine",11,"Pulse Line","g1",["alpha","lines","motion"],"lnHeart","pulse","list","خط ينبض كنبض القلب عند كل هدية"],
 ["liquidLine",12,"Liquid Line","g1",["alpha","lines","motion"],"lnOcean","gradient","list","خط سائل يتموج كموجة بحرية"],
 ["segmentedLine",13,"Segmented Line","g1",["alpha","lines","tech"],"lnMagnet","animated","list","خط من أجزاء مغناطيسية"],
 ["royalLine",14,"Royal Line","g1",["alpha","lines","lux"],"lxOrnament","gold","list","خط ملكي بزخارف زوايا تتشكل بالتتابع"],
 ["floatingIcons",15,"Floating Icons","g1",["alpha","motion"],"crOrbit","none","list","صور هدايا كبيرة عائمة بمدارات دائرية"],
 ["cleanTypography",16,"Clean Typography","g1",["alpha","text","basic"],"txLetters","static","list","طباعة نظيفة بأوزان متباينة وحروف تظهر بالتتابع"],
 ["shadowText",17,"Shadow Text","g1",["alpha","text"],"txInk","none","list","نص بظل عميق يظهر كحبر منتشر"],
 ["outlineText",18,"Outline Text","g1",["alpha","text"],"lnDraw","reveal","list","نص مفرّغ بحدود وخط يرسم نفسه"],
 ["splitText",19,"Split Text","g1",["alpha","text","motion"],"txOpposite","static","list","الاسم والوقت ينزلقان من اتجاهين متعاكسين"],
 ["elegantTransparent",20,"Elegant Transparent","g1",["alpha","basic"],"txMask","silver","list","شفاف أنيق يظهر من خلف قناع"],
 ["royalGold",21,"Royal Gold","g2",["lux"],"lxGoldDust","gold","list","لوح أسود مخملي بإطار ذهبي وغبار ذهبي"],
 ["platinum",22,"Platinum","g2",["lux","glass"],"lxPlatinum","silver","list","زجاج بلاتيني بانعكاس معدني"],
 ["blackDiamond",23,"Black Diamond","g2",["lux"],"lxEclipse","silver","list","أسود ماسي مع كسوف ضوئي حول الهدية"],
 ["crystal",24,"Crystal","g2",["lux","glass"],"lxCrystal","silver","cards","بطاقات كريستالية بانعكاسات"],
 ["luxurySilver",25,"Luxury Silver","g2",["lux"],"lxSilk","silver","list","فضي فاخر بحركة حرير"],
 ["midnight",26,"Midnight","g2",["lux","cine"],"crAurora","gradient","list","كحلي ليلي مع شفق قطبي"],
 ["emerald",27,"Emerald","g2",["lux"],"lxRings","gold","list","زمردي وذهبي مع حلقات ضوئية حول الهدية"],
 ["premiumGlass",28,"Premium Glass","g2",["glass","lux"],"txRefract","static","list","زجاج فاخر بانكسار لوني"],
 ["frostedGlass",29,"Frosted Glass","g2",["glass","basic"],"lxGlassRipple","none","cards","زجاج مصنفر بتموجات"],
 ["saudiLuxury",30,"Saudi Luxury","g2",["lux","text"],"txCineGlare","gold","list","أخضر وذهبي بزخرفة نجدية ولمعة سينمائية"],
 ["gamingHUD",31,"Gaming HUD","g3",["gaming","tech"],"tcGameUI","neon","list","واجهة HUD بزوايا وانتقال ألعاب"],
 ["cyberpunk",32,"Cyberpunk","g3",["gaming","tech"],"tcGlitch","neon","list","وردي وسماوي بتشويش رقمي خفيف"],
 ["digitalMatrix",33,"Digital Matrix","g3",["tech"],"txTyping","animated","list","أخضر مصفوفة بكتابة رقمية"],
 ["holographic",34,"Holographic","g3",["tech","glass"],"tcHolo","gradient","list","هولوغرام بخطوط مسح"],
 ["esports",35,"Esports","g3",["gaming"],"tcMagnetic","static","list","ألواح مائلة رياضية بجذب مغناطيسي"],
 ["rgbFlow",36,"RGB Flow","g3",["gaming","motion"],"crPrism","gradient","list","حدود RGB متدفقة ومنشور ضوئي"],
 ["techGrid",37,"Tech Grid","g3",["tech"],"tcGrid3D","static","grid2","شبكة تقنية بمنظور ثلاثي الأبعاد"],
 ["futuristicPanels",38,"Futuristic Panels","g3",["tech","gaming"],"tx3D","neon","columns","ألواح مستقبلية بدوران ثلاثي الأبعاد"],
 ["digitalCountdown",39,"Digital Countdown","g3",["tech"],"tcPixels","none","list","لوحة أرقام رقمية تتشكل من البكسلات"],
 ["electricMotion",40,"Electric Motion","g3",["tech","motion"],"tcCircuit","animated","list","دوائر إلكترونية متحركة"],
 ["cinematic",41,"Cinematic","g4",["cine"],"lxHalo","none","cine","شريطان سينمائيان وهالة ضوئية"],
 ["floatingCards",42,"Floating Cards","g4",["motion","basic"],"crGravity","none","cards","بطاقات عائمة تهبط بالجاذبية"],
 ["verticalStack",43,"Vertical Stack","g4",["motion"],"crFold","static","stack","قوانين مكدسة تُطوى وتُفتح"],
 ["horizontalRules",44,"Horizontal Rules","g4",["alpha","motion"],"tcLaser","static","hrow","قوانين أفقية بمسح ليزري"],
 ["compactGrid",45,"Compact Grid","g4",["basic"],"txGather","none","grid2","شبكة مضغوطة والكلمات تتجمع"],
 ["timeline",46,"Timeline","g4",["tech"],"tcRadar","none","timeline","خط زمني بعقد ورادار"],
 ["slidingRules",47,"Sliding Rules","g4",["motion"],"crSoundWave","static","list","قوانين منزلقة مع موجات صوتية"],
 ["dynamicColumns",48,"Dynamic Columns","g4",["motion"],"crDrop","static","columns","أعمدة ديناميكية وقطرات ماء"],
 ["spotlight",49,"Spotlight","g4",["cine"],"crSpotlight","none","list","إضاءة مسرحية تتنقل بين القوانين"],
 ["fantasticSignature",50,"Fantastic Signature","g4",["lux","cine","motion"],"crSignature","gradient","list","توقيع B6O6 الحصري: سداسي يُرسم ولمعة أزرق وذهبي"],
];
export const RB50=RB50_D.map(([id,n,name,grp,lib,motion,line,layout,desc])=>({id,n,name,grp,lib,motion,line,layout,desc,cat:lib[0]}));
export const RB_ALIASES={royalRules:"royalGold",goldenRules:"goldenUnderline",diamondRules:"blackDiamond",silverRules:"luxurySilver",crownRules:"royalLine",luxuryBlackRules:"midnight",platinumRules:"platinum",crystalRules:"crystal",neonBlueRules:"neonUnderline",b6o6Rules:"fantasticSignature"};
/** إعدادات الإخفاء لكل نمط جاهز */
export function rbPreset(k){ return ({
 full:{hideBg:false,hideFrame:false,hideDeco:false,showImg:true,showWhat:true,showTime:true,hideLine:false},
 basic:{hideBg:false,hideFrame:true,hideDeco:true,showImg:true,showWhat:true,showTime:true,hideLine:true},
 alpha:{hideBg:true,hideFrame:true,hideDeco:false,showImg:true,showWhat:true,showTime:true,hideLine:false},
 textOnly:{hideBg:true,hideFrame:true,hideDeco:true,showImg:false,showWhat:true,showTime:true,hideLine:true},
 lineOnly:{hideBg:true,hideFrame:true,hideDeco:true,showImg:true,showWhat:true,showTime:true,hideLine:false},
}[k]||{}) }

/** CSS: الخط السفلي + التخطيطات + الإخفاء + 50 تصميماً */
export function rb50CSS(){ const L=`
.rbw.rb50 .rb-ic{animation:none}.rbw.rb50 .rb-row .rb-swp,.rbw.rb50 .rb-sweep{display:none}
.rbw.rb50 .rb-row{overflow:visible;--lnb:.06em;color:var(--nc,inherit)}
.rbw.rb50 .rb-what{overflow:hidden;text-overflow:ellipsis;padding-block:.08em}
.rbw.rb50 .rb-val{color:var(--tc,#fff)}
.rbw.rb50 .rb-row[data-c] .rb-what{color:var(--rc)}.rbw.rb50 .rb-row[data-t] .rb-val{color:var(--rt)!important}
.rbw.rb50 .rb-row[data-f="1"]{font-size:calc(var(--fs)*.85)}.rbw.rb50 .rb-row[data-f="2"]{font-size:calc(var(--fs)*1.15)}.rbw.rb50 .rb-row[data-f="3"]{font-size:calc(var(--fs)*1.3)}
.rbw.rb50 .rb-ln{position:absolute;bottom:var(--lnb);height:var(--lnt,var(--lntd,2px));width:var(--lnl,var(--lnld,100%));inset-inline-start:calc((100% - var(--lnl,var(--lnld,100%)))/2);background:var(--lnc,var(--lncd,currentColor));opacity:var(--lno,.9);border-radius:2px;overflow:hidden;pointer-events:none;color:var(--lnc,var(--acc,#9fd0ff))}
.rbw.rb50 .rb-ln b{position:absolute;inset:0;width:35%;background:linear-gradient(90deg,transparent,#fff,transparent);opacity:0}
.rbl-none .rb-ln,.rb-hl .rb-ln{display:none}
.rbl-gold .rb-ln{background:linear-gradient(90deg,#8a6116,#f6c94a,#fff1b8,#f6c94a,#8a6116);box-shadow:0 0 6px #f6c94a88}
.rbl-silver .rb-ln{background:linear-gradient(90deg,#6b7280,#e5e7eb,#ffffff,#e5e7eb,#6b7280)}
.rbl-neon .rb-ln{background:var(--lnc,#22e1ff);box-shadow:0 0 6px var(--lnc,#22e1ff),0 0 14px var(--lnc,#22e1ff)}
.rbl-gradient .rb-ln{background:linear-gradient(90deg,var(--lnc,#4d8dff),#a855f7,#f6c94a)}
.rbl-animated .rb-ln{background:repeating-linear-gradient(90deg,var(--lnc,currentColor) 0 10px,transparent 10px 16px);animation:rbl-mv calc(1.2s/var(--lns,1)) linear infinite;background-size:32px 100%}@keyframes rbl-mv{to{background-position:-32px 0}}
.rbl-sweep .rb-ln b{animation:rbl-sw calc(3.2s/var(--lns,1)) ease-in-out infinite;opacity:1}@keyframes rbl-sw{0%{transform:translateX(300%)}60%,100%{transform:translateX(-300%)}}
.rbl-reveal .rb-ln{animation:rbl-rv calc(4s/var(--lns,1)) ease-in-out infinite;transform-origin:100% 50%}@keyframes rbl-rv{0%{transform:scaleX(0)}40%,80%{transform:scaleX(1)}100%{transform:scaleX(1);opacity:0}}
.rbl-pulse .rb-row.hit .rb-ln{animation:rbl-pu .9s ease}@keyframes rbl-pu{30%{transform:scaleY(3);filter:brightness(1.8)}}
.rb-still .rb-ln,.rb-still .rb-ln b{animation:none!important}
/* إخفاء العناصر */
.rb-hbg .rb-panel,.rb-hbg .rb-row::before,.rb-hbg .rb-panel::before,.rb-hbg .rb-panel::after{background:none!important;box-shadow:none!important;backdrop-filter:none!important}
.rb-hfr .rb-panel,.rb-hfr .rb-row,.rb-hfr .rb-row::before{border-color:transparent!important;outline:0!important}
.rb-hdc .rb-panel::after,.rb-hdc .rb-deco,.rb-hdc .rb-crw{display:none!important}
.rbw.rb50.rb-ltr{direction:ltr}.rbw.rb50.rb-ltr .rb-row{direction:ltr}
/* التخطيطات */
.rblay-cards .rb-list{gap:var(--gap)}.rblay-cards .rb-row{border-radius:calc(var(--fs)*.7)}
.rblay-stack .rb-list{gap:2px}.rblay-stack .rb-row{border-radius:0}.rblay-stack .rb-row:first-child{border-radius:calc(var(--fs)*.5) calc(var(--fs)*.5) 0 0}.rblay-stack .rb-row:last-child{border-radius:0 0 calc(var(--fs)*.5) calc(var(--fs)*.5)}
.rblay-hrow .rb-list{flex-direction:row;flex-wrap:nowrap;gap:calc(var(--gap)*.6)}.rblay-hrow .rb-row{flex-direction:column;justify-content:center;gap:.15em;text-align:center;padding:.2em;min-width:0;font-size:calc(var(--fs)*.8)}.rblay-hrow .rb-what{white-space:nowrap;max-width:100%}
.rblay-grid2 .rb-list,.rblay-columns .rb-list{display:grid;grid-template-columns:repeat(var(--gcols,2),minmax(0,1fr));grid-auto-rows:1fr;gap:calc(var(--gap)*.5)}.rblay-grid2 .rb-row,.rblay-columns .rb-row{font-size:calc(var(--fs)*.78)}
.rblay-columns .rb-row{flex-direction:column;justify-content:center;text-align:center;gap:.12em}
.rblay-timeline .rb-list{padding-inline-start:1.3em;position:relative}.rblay-timeline .rb-list::before{content:"";position:absolute;inset-block:4%;inset-inline-start:.45em;width:2px;background:linear-gradient(var(--acc,#22e1ff),transparent)}
.rblay-timeline .rb-row::after{content:"";position:absolute;inset-inline-start:-1.05em;top:50%;width:.45em;height:.45em;margin-top:-.22em;border-radius:50%;background:var(--acc,#22e1ff);box-shadow:0 0 .5em var(--acc,#22e1ff)}
.rblay-cine .rb-panel::before,.rblay-cine .rb-panel::after{content:"";position:absolute;inset-inline:0;height:9%;background:#000;z-index:1}.rblay-cine .rb-panel::before{top:0}.rblay-cine .rb-panel::after{bottom:0}
.rbm-page3 .rb-list{height:100%}
.rb50 .rb-stage{position:relative;height:100%}.rb50 .rb-onebox,.rb50 .rb-pg{position:absolute;inset:0;display:flex;flex-direction:column;gap:calc(var(--gap)*.5)}
.rb50 .rb-onebox .rb-one{position:absolute;inset:0;justify-content:center;font-size:calc(var(--fs)*1.05)}.rb50 .rb-onebox .rb-one .rb-what{flex:none}
.rb50 .rb-delta{position:absolute;inset-inline-end:.3em;top:-.35em;font:800 calc(var(--fs)*.78)/1 "Alexandria","Changa",sans-serif;color:var(--pos);text-shadow:0 2px 6px #000,0 0 10px currentColor;z-index:6;pointer-events:none;white-space:nowrap;unicode-bidi:isolate;direction:ltr}.rb50 .rb-delta.neg{color:var(--neg)}
`;
 const C={
 pureText:`.rbd-pureText .rb-row{font-weight:600;text-shadow:0 2px 6px rgba(0,0,0,.85)}.rbd-pureText .rb-val{background:none!important;box-shadow:none!important;color:var(--tc,var(--pos))}`,
 floatingText:`.rbd-floatingText .rb-row{font-weight:700;text-shadow:0 10px 22px rgba(0,0,0,.6),0 2px 3px rgba(0,0,0,.8)}.rbd-floatingText .rb-ic{filter:drop-shadow(0 8px 10px rgba(0,0,0,.6))}.rbd-floatingText .rb-val{background:none!important;box-shadow:none!important;font-style:italic}`,
 minimalUnderline:`.rbd-minimalUnderline .rb-row{font-weight:500;letter-spacing:.01em;text-shadow:0 1px 4px #000c}.rbd-minimalUnderline .rb-ln{--lntd:1px;background:#fff}.rbd-minimalUnderline .rb-val{background:none!important;box-shadow:none!important;font-weight:600}`,
 goldenUnderline:`.rbd-goldenUnderline{--acc:#f6c94a}.rbd-goldenUnderline .rb-row{text-shadow:0 2px 6px #000}.rbd-goldenUnderline .rb-val{background:none!important;box-shadow:none!important;color:#ffe08a;font-family:"Alexandria",sans-serif}`,
 neonUnderline:`.rbd-neonUnderline{--acc:#22e1ff}.rbd-neonUnderline .rb-row{color:#e6fbff;text-shadow:0 0 6px #22e1ff99}.rbd-neonUnderline .rb-val{background:none!important;color:#22e1ff;text-shadow:0 0 8px #22e1ff;box-shadow:none!important}`,
 gradientLine:`.rbd-gradientLine .rb-row{font-weight:700;text-shadow:0 2px 5px #000}.rbd-gradientLine .rb-val{background:linear-gradient(90deg,#4d8dff,#a855f7)!important;box-shadow:none!important}`,
 lightSweep:`.rbd-lightSweep .rb-row{font-weight:600;text-shadow:0 2px 6px #000}.rbd-lightSweep .rb-val{background:rgba(255,255,255,.14)!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.35)!important}`,
 doubleLine:`.rbd-doubleLine .rb-row{text-shadow:0 2px 5px #000}.rbd-doubleLine .rb-ln{height:6px;background:none!important;border-block:1.5px solid var(--lnc,#e5e7eb)}.rbd-doubleLine .rb-val{background:none!important;box-shadow:none!important}`,
 digitalLine:`.rbd-digitalLine{--acc:#38bdf8}.rbd-digitalLine .rb-row{font-family:"Orbitron","Alexandria",sans-serif;font-size:calc(var(--fs)*.9);text-shadow:0 0 4px #38bdf8aa}.rbd-digitalLine .rb-val{background:none!important;color:#7dd3fc;box-shadow:none!important}`,
 diamondLine:`.rbd-diamondLine{--acc:#bfe6ff}.rbd-diamondLine .rb-ln{overflow:visible}.rbd-diamondLine .rb-ln::before,.rbd-diamondLine .rb-ln::after{content:"";position:absolute;top:50%;width:.45em;height:.45em;margin-top:-.22em;background:linear-gradient(135deg,#fff,#7cc4ff);transform:rotate(45deg)}.rbd-diamondLine .rb-ln::before{left:-.2em}.rbd-diamondLine .rb-ln::after{right:-.2em}.rbd-diamondLine .rb-row{text-shadow:0 2px 6px #000}.rbd-diamondLine .rb-val{background:none!important;box-shadow:none!important;color:#dff3ff}`,
 pulseLine:`.rbd-pulseLine{--acc:#ff4d6d}.rbd-pulseLine .rb-ln{--lncd:#ff4d6d}.rbd-pulseLine .rb-row{text-shadow:0 2px 5px #000}.rbd-pulseLine .rb-val{background:none!important;box-shadow:none!important;color:#ff8fa3}`,
 liquidLine:`.rbd-liquidLine{--acc:#38bdf8}.rbd-liquidLine .rb-ln{--lntd:3px;border-radius:9px;filter:blur(.3px)}.rbd-liquidLine .rb-row{text-shadow:0 2px 6px #000}.rbd-liquidLine .rb-val{background:rgba(56,189,248,.18)!important;box-shadow:none!important;border-radius:1em}`,
 segmentedLine:`.rbd-segmentedLine .rb-ln{background:repeating-linear-gradient(90deg,var(--lnc,#e5e7eb) 0 16%,transparent 16% 20%)!important}.rbd-segmentedLine .rb-row{text-shadow:0 2px 5px #000;font-weight:600}.rbd-segmentedLine .rb-val{background:none!important;box-shadow:none!important}`,
 royalLine:`.rbd-royalLine{--acc:#f6c94a}.rbd-royalLine .rb-row{font-family:"Alexandria",serif;text-shadow:0 2px 6px #000}.rbd-royalLine .rb-ln{--lnld:86%}.rbd-royalLine .rb-val{background:none!important;box-shadow:none!important;color:#f6c94a}`,
 floatingIcons:`.rbd-floatingIcons .rb-ic{width:calc(2.1em*var(--ics,1));height:calc(2.1em*var(--ics,1));filter:drop-shadow(0 6px 8px rgba(0,0,0,.6))}.rbd-floatingIcons .rb-row{text-shadow:0 2px 5px #000}.rbd-floatingIcons .rb-val{background:none!important;box-shadow:none!important}`,
 cleanTypography:`.rbd-cleanTypography .rb-what{font-weight:400}.rbd-cleanTypography .rb-val{font-family:"Alexandria",sans-serif;font-weight:800;background:none!important;box-shadow:none!important;letter-spacing:.02em}.rbd-cleanTypography .rb-row{text-shadow:0 1px 3px #000}`,
 shadowText:`.rbd-shadowText .rb-row{font-weight:800;text-shadow:3px 4px 0 rgba(0,0,0,.75),0 0 14px rgba(0,0,0,.6)}.rbd-shadowText .rb-val{background:none!important;box-shadow:none!important}`,
 outlineText:`.rbd-outlineText .rb-what{color:transparent;-webkit-text-stroke:1.2px var(--nc,#fff);font-weight:800}.rbd-outlineText .rb-val{background:none!important;box-shadow:none!important;-webkit-text-stroke:1px currentColor}`,
 splitText:`.rbd-splitText .rb-row{justify-content:space-between;text-shadow:0 2px 5px #000}.rbd-splitText .rb-what{flex:none;max-width:60%}.rbd-splitText .rb-val{background:none!important;box-shadow:none!important;border-inline-start:2px solid currentColor;border-radius:0}`,
 elegantTransparent:`.rbd-elegantTransparent .rb-row{font-weight:500;text-shadow:0 1px 8px rgba(0,0,0,.9)}.rbd-elegantTransparent .rb-ln{--lnld:70%;--lntd:1px}.rbd-elegantTransparent .rb-val{background:rgba(255,255,255,.1)!important;box-shadow:none!important;font-weight:600}`,
 royalGold:`.rbd-royalGold{--acc:#f6c94a}.rbd-royalGold .rb-panel{background:linear-gradient(160deg,#141008,#050403);border:1.5px solid #c8a24a;box-shadow:inset 0 0 0 3px #050403,inset 0 0 0 4px #6b5420,0 10px 30px #000a}.rbd-royalGold .rb-row::before{background:linear-gradient(90deg,#2a1f0b,#140f06);border:1px solid #6b5420}.rbd-royalGold .rb-val{background:linear-gradient(#f6c94a,#b7791f)!important;color:#1a1306!important;box-shadow:none!important}.rbd-royalGold .rb-t{color:#f6c94a}.rbd-royalGold .rb-crw{display:block}`,
 platinum:`.rbd-platinum{--acc:#e5e7eb}.rbd-platinum .rb-panel{background:linear-gradient(150deg,rgba(229,231,235,.22),rgba(107,114,128,.12));backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.4)}.rbd-platinum .rb-row::before{background:linear-gradient(90deg,rgba(255,255,255,.14),rgba(255,255,255,.04))}.rbd-platinum .rb-val{background:linear-gradient(#f3f4f6,#9ca3af)!important;color:#111827!important;box-shadow:none!important}`,
 blackDiamond:`.rbd-blackDiamond{--acc:#cfe7ff}.rbd-blackDiamond .rb-panel{background:#050608;border:1px solid #2a3442;box-shadow:0 0 0 1px #000,0 12px 30px #000}.rbd-blackDiamond .rb-row::before{background:linear-gradient(90deg,#0f141b,#07090c);border-bottom:1px solid #1f2937}.rbd-blackDiamond .rb-val{background:#0b1018!important;color:#cfe7ff!important;box-shadow:inset 0 0 0 1px #3b4a5e!important}`,
 crystal:`.rbd-crystal{--acc:#a5f3fc}.rbd-crystal .rb-row::before{background:linear-gradient(135deg,rgba(165,243,252,.22),rgba(255,255,255,.06));border:1px solid rgba(165,243,252,.5);backdrop-filter:blur(6px)}.rbd-crystal .rb-val{background:rgba(165,243,252,.25)!important;box-shadow:none!important}`,
 luxurySilver:`.rbd-luxurySilver{--acc:#d1d5db}.rbd-luxurySilver .rb-panel{background:linear-gradient(180deg,#1f2328,#0e1013);border:1px solid #4b5563}.rbd-luxurySilver .rb-row::before{background:linear-gradient(90deg,#2b3036,#16191d)}.rbd-luxurySilver .rb-val{background:linear-gradient(#f9fafb,#9ca3af)!important;color:#111!important;box-shadow:none!important}`,
 midnight:`.rbd-midnight{--acc:#818cf8}.rbd-midnight .rb-panel{background:radial-gradient(120% 90% at 80% 0%,#1e1b4b,#050816 70%);border:1px solid #312e81}.rbd-midnight .rb-row::before{background:rgba(99,102,241,.1)}.rbd-midnight .rb-val{background:rgba(129,140,248,.25)!important;box-shadow:none!important}`,
 emerald:`.rbd-emerald{--acc:#f6c94a}.rbd-emerald .rb-panel{background:linear-gradient(160deg,#064e3b,#022c22);border:1.5px solid #d4a73c}.rbd-emerald .rb-row::before{background:rgba(255,255,255,.05);border:1px solid rgba(212,167,60,.35)}.rbd-emerald .rb-val{background:#d4a73c!important;color:#022c22!important;box-shadow:none!important}`,
 premiumGlass:`.rbd-premiumGlass{--acc:#93c5fd}.rbd-premiumGlass .rb-panel{background:linear-gradient(135deg,rgba(255,255,255,.16),rgba(255,255,255,.04));backdrop-filter:blur(14px) saturate(1.4);border:1px solid rgba(255,255,255,.28);box-shadow:inset 0 1px 0 rgba(255,255,255,.45)}.rbd-premiumGlass .rb-val{background:rgba(147,197,253,.28)!important;box-shadow:none!important}`,
 frostedGlass:`.rbd-frostedGlass .rb-row::before{background:rgba(255,255,255,.18);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.25)}.rbd-frostedGlass .rb-row{color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.5)}.rbd-frostedGlass .rb-val{background:rgba(255,255,255,.28)!important;box-shadow:none!important}`,
 saudiLuxury:`.rbd-saudiLuxury{--acc:#d4a73c}.rbd-saudiLuxury .rb-panel{background:linear-gradient(150deg,#0b3d2a,#052016);border:1.5px solid #d4a73c;background-image:linear-gradient(150deg,#0b3d2a,#052016),repeating-linear-gradient(45deg,rgba(212,167,60,.08) 0 2px,transparent 2px 14px);background-blend-mode:overlay}.rbd-saudiLuxury .rb-what{font-family:"Alexandria",sans-serif}.rbd-saudiLuxury .rb-val{background:linear-gradient(#f0d38a,#b88a2a)!important;color:#052016!important;box-shadow:none!important}`,
 gamingHUD:`.rbd-gamingHUD{--acc:#22e1ff}.rbd-gamingHUD .rb-row::before{background:rgba(2,12,24,.72);clip-path:polygon(0 0,calc(100% - .6em) 0,100% .6em,100% 100%,.6em 100%,0 calc(100% - .6em));border:0}.rbd-gamingHUD .rb-row{color:#dffaff;font-family:"Alexandria",sans-serif}.rbd-gamingHUD .rb-val{background:#22e1ff!important;color:#001018!important;clip-path:polygon(.4em 0,100% 0,calc(100% - .4em) 100%,0 100%);border-radius:0!important;box-shadow:none!important}`,
 cyberpunk:`.rbd-cyberpunk{--acc:#ff2a6d}.rbd-cyberpunk .rb-row::before{background:linear-gradient(90deg,rgba(255,42,109,.22),rgba(5,217,232,.12));border-inline-start:3px solid #ff2a6d}.rbd-cyberpunk .rb-row{color:#fdf0ff;text-shadow:1px 0 #05d9e8}.rbd-cyberpunk .rb-val{background:#05d9e8!important;color:#1a0010!important;box-shadow:3px 3px 0 #ff2a6d!important;border-radius:0!important}`,
 digitalMatrix:`.rbd-digitalMatrix{--acc:#22c55e}.rbd-digitalMatrix .rb-panel{background:rgba(0,10,4,.78);border:1px solid #14532d}.rbd-digitalMatrix .rb-row{color:#86efac;font-family:ui-monospace,"Orbitron",monospace}.rbd-digitalMatrix .rb-val{background:none!important;color:#22c55e;box-shadow:none!important;text-shadow:0 0 6px #22c55e}`,
 holographic:`.rbd-holographic{--acc:#67e8f9}.rbd-holographic .rb-row::before{background:linear-gradient(100deg,rgba(103,232,249,.18),rgba(196,181,253,.16),rgba(244,114,182,.14));border:1px solid rgba(103,232,249,.45)}.rbd-holographic .rb-row{color:#ecfeff}.rbd-holographic .rb-val{background:rgba(103,232,249,.25)!important;box-shadow:0 0 10px rgba(103,232,249,.5)!important}`,
 esports:`.rbd-esports{--acc:#facc15}.rbd-esports .rb-row::before{background:linear-gradient(90deg,#0b1220,#172036);transform:skewX(-12deg);border-inline-end:4px solid #facc15}.rbd-esports .rb-row{font-family:"Alexandria",sans-serif;font-weight:800;font-style:italic}.rbd-esports .rb-val{background:#facc15!important;color:#0b1220!important;transform:skewX(-12deg);border-radius:2px!important;box-shadow:none!important}`,
 rgbFlow:`.rbd-rgbFlow .rb-row::before{background:rgba(6,8,14,.7);border:2px solid transparent;background-clip:padding-box;box-shadow:0 0 0 2px transparent}.rbd-rgbFlow .rb-row::after{content:"";position:absolute;inset:0;border-radius:inherit;padding:2px;background:linear-gradient(90deg,#ff3b3b,#ffe14d,#3ddc84,#3aa0ff,#8a5cff,#ff3b3b) 0 0/300% 100%;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:rbd-rgb calc(6s/var(--as,1)) linear infinite;pointer-events:none}@keyframes rbd-rgb{to{background-position:300% 0}}.rbd-rgbFlow .rb-val{background:rgba(255,255,255,.12)!important;box-shadow:none!important}.rb-still.rbd-rgbFlow .rb-row::after{animation:none}`,
 techGrid:`.rbd-techGrid{--acc:#38bdf8}.rbd-techGrid .rb-panel{background:rgba(3,10,20,.75) linear-gradient(rgba(56,189,248,.1) 1px,transparent 1px) 0 0/100% 14px,rgba(3,10,20,.75);border:1px solid #0c4a6e}.rbd-techGrid .rb-row::before{background:rgba(56,189,248,.08);border:1px solid rgba(56,189,248,.35)}.rbd-techGrid .rb-val{background:#0c4a6e!important;box-shadow:none!important}`,
 futuristicPanels:`.rbd-futuristicPanels{--acc:#a78bfa}.rbd-futuristicPanels .rb-row::before{background:linear-gradient(180deg,rgba(167,139,250,.25),rgba(20,10,40,.7));border-top:2px solid #a78bfa}.rbd-futuristicPanels .rb-val{background:#a78bfa!important;color:#120a24!important;box-shadow:none!important}`,
 digitalCountdown:`.rbd-digitalCountdown{--acc:#f97316}.rbd-digitalCountdown .rb-panel{background:#0a0a0a;border:1px solid #262626}.rbd-digitalCountdown .rb-row::before{background:#111;border:1px solid #1f1f1f}.rbd-digitalCountdown .rb-val{font-family:"Orbitron",monospace;background:#1c0a02!important;color:#fb923c!important;box-shadow:inset 0 0 8px #f9731655!important;border-radius:3px!important}`,
 electricMotion:`.rbd-electricMotion{--acc:#60a5fa}.rbd-electricMotion .rb-row::before{background:rgba(8,20,48,.66);border:1px solid rgba(96,165,250,.45)}.rbd-electricMotion .rb-val{background:#1d4ed8!important;box-shadow:0 0 10px #3b82f6!important}`,
 cinematic:`.rbd-cinematic{--acc:#fde68a}.rbd-cinematic .rb-panel{background:linear-gradient(180deg,rgba(0,0,0,.25),rgba(0,0,0,.55))}.rbd-cinematic .rb-row{font-family:"Alexandria",sans-serif;letter-spacing:.03em;justify-content:center;text-shadow:0 2px 12px #000}.rbd-cinematic .rb-what{flex:none}.rbd-cinematic .rb-val{background:none!important;box-shadow:none!important;color:#fde68a}`,
 floatingCards:`.rbd-floatingCards .rb-row::before{background:rgba(17,24,39,.82);box-shadow:0 10px 24px rgba(0,0,0,.45)}.rbd-floatingCards .rb-row{margin-inline:.2em}.rbd-floatingCards .rb-val{background:#2563eb!important;box-shadow:none!important}`,
 verticalStack:`.rbd-verticalStack .rb-row::before{background:linear-gradient(90deg,rgba(15,23,42,.9),rgba(30,41,59,.85))}.rbd-verticalStack .rb-row:nth-child(even)::before{background:linear-gradient(90deg,rgba(30,41,59,.9),rgba(15,23,42,.85))}.rbd-verticalStack .rb-val{background:none!important;box-shadow:none!important;border:1px solid currentColor}`,
 horizontalRules:`.rbd-horizontalRules .rb-row{text-shadow:0 2px 6px #000;border-inline-end:1px solid rgba(255,255,255,.25)}.rbd-horizontalRules .rb-row:last-child{border:0}.rbd-horizontalRules .rb-val{background:none!important;box-shadow:none!important}`,
 compactGrid:`.rbd-compactGrid .rb-row::before{background:rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.12)}.rbd-compactGrid .rb-val{background:rgba(255,255,255,.12)!important;box-shadow:none!important}`,
 timeline:`.rbd-timeline{--acc:#22e1ff}.rbd-timeline .rb-row{text-shadow:0 2px 6px #000}.rbd-timeline .rb-val{background:none!important;box-shadow:none!important;color:#67e8f9}`,
 slidingRules:`.rbd-slidingRules .rb-row::before{background:linear-gradient(90deg,transparent,rgba(0,0,0,.6) 18%,rgba(0,0,0,.6) 82%,transparent)}.rbd-slidingRules .rb-val{background:none!important;box-shadow:none!important}`,
 dynamicColumns:`.rbd-dynamicColumns{--acc:#38bdf8}.rbd-dynamicColumns .rb-row::before{background:linear-gradient(180deg,rgba(14,116,144,.35),rgba(0,0,0,.55));border-bottom:2px solid #38bdf8}.rbd-dynamicColumns .rb-val{background:none!important;box-shadow:none!important;color:#7dd3fc}`,
 spotlight:`.rbd-spotlight .rb-panel{background:radial-gradient(70% 60% at 50% 40%,rgba(255,250,230,.08),rgba(0,0,0,.55))}.rbd-spotlight .rb-row{text-shadow:0 2px 6px #000}.rbd-spotlight .rb-val{background:none!important;box-shadow:none!important;color:#fef3c7}`,
 fantasticSignature:`.rbd-fantasticSignature{--acc:#4d8dff}.rbd-fantasticSignature .rb-panel{background:linear-gradient(160deg,rgba(10,18,38,.88),rgba(4,8,18,.9));border:1px solid rgba(77,141,255,.55);box-shadow:inset 0 0 0 1px rgba(246,201,74,.18),0 10px 30px rgba(0,0,0,.5)}.rbd-fantasticSignature .rb-row::before{background:linear-gradient(90deg,rgba(77,141,255,.14),rgba(246,201,74,.06))}.rbd-fantasticSignature .rb-what{font-family:"Alexandria",sans-serif}.rbd-fantasticSignature .rb-val{background:linear-gradient(90deg,#2f6bff,#4d8dff)!important;box-shadow:0 0 12px rgba(77,141,255,.6)!important}`,
 };
 return L+Object.values(C).join("\n") }
