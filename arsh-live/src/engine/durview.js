// ====== طبقة «مدة البث» (Live Duration): 20 تصميماً + العرض المباشر من جلسة البث ======
import { View } from "./view.js";
import { esc } from "./defs.js";
import { durOf, duParts, durOpts } from "./duration.js";

export const DU_CATS={clear:"شفافة",panel:"بلوحات",fx:"متحركة ومؤثرات",big:"كبيرة"};
export const DU_DESIGNS=[
 {id:"basicClear",n:1,name:"Basic Transparent",cat:"clear",desc:"أرقام بيضاء بظل ناعم بدون خلفية"},
 {id:"digitalClock",n:2,name:"Digital Clock",cat:"panel",desc:"شاشة LCD خضراء بخط رقمي وأرقام شبحية خلفها"},
 {id:"neonBlue",n:3,name:"Neon Blue",cat:"fx",desc:"أنبوب نيون أزرق يرمش ويتوهج بإطار مضيء"},
 {id:"royalGold",n:4,name:"Royal Gold",cat:"panel",desc:"ذهب ملكي بإطار مزدوج وزخارف زوايا ولمعة متحركة"},
 {id:"glass",n:5,name:"Glass",cat:"panel",desc:"بطاقة زجاجية ضبابية شفافة بحافة لامعة"},
 {id:"cyberpunk",n:6,name:"Cyberpunk",cat:"fx",desc:"لوحة مقصوصة الزوايا صفراء/وردية مع تشويش Glitch"},
 {id:"gaming",n:7,name:"Gaming",cat:"fx",desc:"شريط ألعاب مائل بخطوط مسح وشارة LIVE نابضة"},
 {id:"luxury",n:8,name:"Luxury",cat:"panel",desc:"مخمل أسود بخطوط ذهبية رفيعة وخط كلاسيكي"},
 {id:"minimalText",n:9,name:"Minimal Text",cat:"clear",desc:"سطر واحد صغير: العنوان والوقت متجاوران"},
 {id:"futuristicHud",n:10,name:"Futuristic HUD",cat:"fx",desc:"أقواس زوايا HUD وخط مسح يدور بلون سماوي"},
 {id:"fire",n:11,name:"Fire",cat:"fx",desc:"أرقام لهب متدرجة تتراقص مع جمر متوهج"},
 {id:"ice",n:12,name:"Ice",cat:"fx",desc:"جليد بلوري بحواف مثلجة ولمعات تتلألأ"},
 {id:"rgbAnimated",n:13,name:"RGB Animated",cat:"fx",desc:"إطار ألوان قوس قزح يدور حول العداد"},
 {id:"metallic",n:14,name:"Metallic",cat:"panel",desc:"لوحة معدن مصقول بأرقام بارزة محفورة"},
 {id:"holographic",n:15,name:"Holographic",cat:"fx",desc:"خلفية هولوغرافية قزحية متغيرة باستمرار"},
 {id:"largeTimer",n:16,name:"Large Timer",cat:"big",desc:"عداد رقمي كبير مع عنوان «مدة البث» في الأعلى"},
 {id:"flipCards",n:17,name:"Flip Cards",cat:"big",desc:"كل جزء في بطاقة مستقلة مثل الساعات القلّابة"},
 {id:"livePill",n:18,name:"Live Pill",cat:"clear",desc:"كبسولة حمراء صغيرة بنقطة LIVE نابضة"},
 {id:"terminal",n:19,name:"Retro Terminal",cat:"panel",desc:"شاشة أوامر خضراء بخطوط مسح ومؤشر وامض"},
 {id:"orbit",n:20,name:"Orbit Ring",cat:"big",desc:"حلقة دائرية حول الوقت ونقطة تدور حولها"}];
export const DU_INS=[["none","بدون"],["fade","ظهور تدريجي"],["slideUp","صعود"],["zoom","تكبير"],["slideSide","انزلاق جانبي"],["flip","قلب"],["blur","وضوح من الضباب"]];
export const duDesignOf=id=>DU_DESIGNS.find(d=>d.id===id)||DU_DESIGNS.find(d=>d.id==="largeTimer");
const FONT_MAP={changa:'"Changa","Readex Pro",sans-serif',readex:'"Readex Pro",sans-serif',mono:'ui-monospace,"SFMono-Regular",Menlo,monospace',serif:'"Amiri",Georgia,serif'};
const duHexA=(hex,a)=>{ const m=/^#?([0-9a-f]{6})$/i.exec(String(hex||"")); if(!m) return null; const n=parseInt(m[1],16); return `rgba(${n>>16&255},${n>>8&255},${n&255},${Math.max(0,Math.min(1,a))})` };

const DU_CSS=`
.wd.t-duration{display:flex;align-items:center;justify-content:center;overflow:visible}
.du{position:absolute;inset:0;display:flex;align-items:center;justify-content:var(--duJ,center);pointer-events:none}
.du-box{--g:var(--duNum,#fff);position:relative;display:inline-flex;flex-direction:column;align-items:var(--duJ,center);gap:.14em;padding:.32em .7em;font-size:var(--dfs,40px);line-height:1;max-width:100%;
 color:var(--duNum,#fff);background:var(--duBg,transparent);border:var(--duBw,0) solid var(--duFrame,transparent);border-radius:.45em;transition:font-size .6s ease;box-sizing:border-box;font-family:var(--duFont,"Orbitron","Readex Pro",sans-serif)}
.du-ttl{font-size:calc(.34em*var(--duTitleS,1));color:var(--duTitle,currentColor);font-weight:700;letter-spacing:.05em;white-space:nowrap;font-family:"Readex Pro","Changa",sans-serif;opacity:.92}
.du-val{white-space:pre;font-weight:800;font-variant-numeric:tabular-nums;letter-spacing:var(--duGap,0em)}
.du-clk{display:inline-block;direction:ltr;unicode-bidi:isolate}
.du-n{color:var(--duNum,inherit)}.du-n.c-d,.du-u.c-d{color:var(--duDay,var(--duNum,inherit))}.du-n.c-m,.du-n.c-s,.du-c.c-m,.du-c.c-s{color:var(--duMs,var(--duNum,inherit))}
.du-u{font-size:calc(.5em*var(--duUs,1));font-weight:700;font-family:"Readex Pro","Changa",sans-serif;letter-spacing:0}.du-u.c-d,.du-n.c-d{font-size:calc(1em*var(--duDayS,1))}.du-u.c-d{font-size:calc(.56em*var(--duDayS,1))}
.du-s{opacity:.55;font-weight:400}.du-c{opacity:.9}
.du-day-in .c-d{animation:duDayIn .8s ease both}@keyframes duDayIn{from{opacity:0;filter:blur(6px)}to{opacity:1;filter:none}}
.du-box.neon .du-val{text-shadow:0 0 calc(.12em*var(--duGlow,.6)) var(--g),0 0 calc(.35em*var(--duGlow,.6)) var(--g)}
.du-idle .du-val{opacity:.55}.du-ended .du-val{opacity:.85}
.du-dec{position:absolute;inset:0;pointer-events:none;border-radius:inherit}
/* حركات الدخول/الخروج */
.wd:not(.no-fx) .du-box.in-fade{animation:duFade .7s ease both}.wd:not(.no-fx) .du-box.in-slideUp{animation:duUp .7s cubic-bezier(.2,.9,.3,1.2) both}.wd:not(.no-fx) .du-box.in-zoom{animation:duZoom .6s cubic-bezier(.2,.9,.3,1.3) both}
.wd:not(.no-fx) .du-box.in-slideSide{animation:duSide .7s cubic-bezier(.2,.9,.3,1.1) both}.wd:not(.no-fx) .du-box.in-flip{animation:duFlip .8s ease both}.wd:not(.no-fx) .du-box.in-blur{animation:duBlur .8s ease both}
.du-box.out-fade{animation:duFade .6s ease reverse both}.du-box.out-slideUp{animation:duUp .6s ease reverse both}.du-box.out-zoom{animation:duZoom .5s ease reverse both}.du-box.out-slideSide{animation:duSide .6s ease reverse both}.du-box.out-flip{animation:duFlip .6s ease reverse both}.du-box.out-blur{animation:duBlur .6s ease reverse both}.du-box.out-none{opacity:0}
@keyframes duFade{from{opacity:0}}@keyframes duUp{from{opacity:0;transform:translateY(40%)}}@keyframes duZoom{from{opacity:0;transform:scale(.4)}}@keyframes duSide{from{opacity:0;transform:translateX(60%)}}@keyframes duFlip{from{opacity:0;transform:perspective(600px) rotateX(90deg)}}@keyframes duBlur{from{opacity:0;filter:blur(14px)}}
/* 1 Basic Transparent */
.du-basicClear .du-box{text-shadow:0 2px 6px #000c,0 0 2px #000}
/* 2 Digital Clock — LCD */
.du-digitalClock .du-box{--duNum0:#7dff8a;color:var(--duNum,#7dff8a);--g:var(--duNum,#7dff8a);background:var(--duBg,linear-gradient(180deg,#0b1a0e,#050b06));border:var(--duBw,.06em) solid var(--duFrame,#1e3b22);border-radius:.25em;box-shadow:inset 0 0 .5em #000,0 .1em .4em #000a;font-family:var(--duFont,"Orbitron",ui-monospace,monospace)}
.du-digitalClock .du-val{position:relative}.du-digitalClock .du-val::before{content:attr(data-ghost);position:absolute;inset:0;color:currentColor;opacity:.08;white-space:pre}
.du-digitalClock .du-ttl{color:var(--duTitle,#7dff8a);opacity:.7;font-family:var(--duFont,"Orbitron",monospace);font-size:calc(.26em*var(--duTitleS,1))}
/* 3 Neon Blue */
.du-neonBlue .du-box{color:var(--duNum,#e8fdff);--g:var(--duFrame,#22d3ee);background:var(--duBg,#020a14aa);border:var(--duBw,.07em) solid var(--duFrame,#22d3ee);border-radius:.6em;box-shadow:0 0 calc(.5em*var(--duGlow,.6)) var(--g),inset 0 0 calc(.4em*var(--duGlow,.6)) var(--g)}
.du-neonBlue .du-ttl{color:var(--duTitle,#7df9ff)}.wd:not(.no-fx) .du-neonBlue .du-val{animation:duFlick 4s infinite}
@keyframes duFlick{0%,19%,21%,62%,64%,100%{opacity:1}20%,63%{opacity:.55}}
/* 4 Royal Gold */
.du-royalGold .du-box{color:var(--duNum,#ffe08a);--g:#f5b942;background:var(--duBg,radial-gradient(120% 140% at 50% 0%,#3a2608,#120a02));border:var(--duBw,.08em) double var(--duFrame,#e9b949);border-radius:.3em;box-shadow:0 0 0 .06em #6b4a12,0 .15em .5em #000b;font-family:var(--duFont,"Amiri","Changa",serif)}
.du-royalGold .du-val{background:linear-gradient(100deg,#c98b1e 20%,#fff3c4 45%,#e9b949 55%,#c98b1e 80%) 0 0/250% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.du-royalGold.has-c .du-val{-webkit-text-fill-color:currentColor;background:none}.wd:not(.no-fx) .du-royalGold .du-val{animation:duShine 4s linear infinite}
.du-royalGold .du-dec::before,.du-royalGold .du-dec::after{content:"◆";position:absolute;top:-.42em;font-size:.4em;color:var(--duFrame,#e9b949)}.du-royalGold .du-dec::before{right:.5em}.du-royalGold .du-dec::after{left:.5em}
.du-royalGold .du-ttl{color:var(--duTitle,#e9b949)}
@keyframes duShine{to{background-position:-250% 0}}
/* 5 Glass */
.du-glass .du-box{background:var(--duBg,#ffffff1f);backdrop-filter:blur(12px) saturate(1.4);-webkit-backdrop-filter:blur(12px) saturate(1.4);border:var(--duBw,.04em) solid var(--duFrame,#ffffff55);border-radius:.6em;box-shadow:inset 0 .06em 0 #ffffff70,0 .2em .6em #0005}
/* 6 Cyberpunk */
.du-cyberpunk .du-box{color:var(--duNum,#0b0b0f);--g:#ff2bd6;background:var(--duBg,#fcee0a);border-radius:0;clip-path:polygon(0 0,92% 0,100% 30%,100% 100%,8% 100%,0 70%);padding:.34em 1em;font-family:var(--duFont,"Orbitron",sans-serif)}
.du-cyberpunk .du-ttl{color:var(--duTitle,#ff2bd6);letter-spacing:.2em}.du-cyberpunk .du-dec{border-bottom:.08em solid var(--duFrame,#ff2bd6)}
.wd:not(.no-fx) .du-cyberpunk .du-val{animation:duGlitch 3.2s infinite steps(1)}
@keyframes duGlitch{0%,92%,100%{text-shadow:none;transform:none}93%{text-shadow:.05em 0 #ff2bd6,-.05em 0 #00f0ff;transform:translateX(.02em)}95%{text-shadow:-.06em 0 #ff2bd6,.04em 0 #00f0ff;transform:translateX(-.03em)}97%{text-shadow:none}}
/* 7 Gaming */
.du-gaming .du-box{color:var(--duNum,#fff);--g:#ff2e4d;background:var(--duBg,linear-gradient(90deg,#14060a,#2a0a12));border-inline-start:.14em solid var(--duFrame,#ff2e4d);border-radius:.15em;transform:skewX(-10deg);padding:.3em .9em .3em 1.3em;overflow:hidden}
.du-gaming .du-box>*{transform:skewX(10deg)}.du-gaming .du-dec{background:repeating-linear-gradient(0deg,#ffffff08 0 2px,transparent 2px 5px)}
.du-gaming .du-ttl::before{content:"● LIVE  ";color:#ff2e4d;font-family:"Orbitron",sans-serif}.wd:not(.no-fx) .du-gaming .du-ttl::before{animation:duPulse 1.2s infinite}
@keyframes duPulse{50%{opacity:.25}}
/* 8 Luxury */
.du-luxury .du-box{color:var(--duNum,#f6ead0);--g:#d4af37;background:var(--duBg,radial-gradient(130% 160% at 50% 0%,#1d1a16,#070605));border:var(--duBw,.03em) solid var(--duFrame,#d4af37);border-radius:.1em;padding:.4em 1em;font-family:var(--duFont,"Amiri",Georgia,serif);box-shadow:0 0 0 .14em #070605,0 0 0 .17em var(--duFrame,#d4af3799)}
.du-luxury .du-ttl{color:var(--duTitle,#d4af37);letter-spacing:.3em;font-weight:400}.du-luxury .du-val{font-weight:700}
.wd:not(.no-fx) .du-luxury .du-dec{background:linear-gradient(115deg,transparent 40%,#ffffff1c 50%,transparent 60%) -200% 0/300% 100% no-repeat;animation:duSweep 6s ease-in-out infinite}
@keyframes duSweep{to{background-position:200% 0}}
/* 9 Minimal Text */
.du-minimalText .du-box{flex-direction:row;align-items:baseline;gap:.4em;padding:.1em .2em;text-shadow:0 1px 4px #000b}.du-minimalText .du-ttl{font-size:calc(.5em*var(--duTitleS,1));opacity:.75}
.du-minimalText .du-ttl::after{content:" •";opacity:.6}
/* 10 Futuristic HUD */
.du-futuristicHud .du-box{color:var(--duNum,#bff6ff);--g:var(--duFrame,#22e3ff);background:var(--duBg,#03141c99);border-radius:0;padding:.4em 1em}
.du-futuristicHud .du-dec{background:linear-gradient(var(--g),var(--g)) 0 0/.6em .06em,linear-gradient(var(--g),var(--g)) 0 0/.06em .6em,linear-gradient(var(--g),var(--g)) 100% 0/.6em .06em,linear-gradient(var(--g),var(--g)) 100% 0/.06em .6em,linear-gradient(var(--g),var(--g)) 0 100%/.6em .06em,linear-gradient(var(--g),var(--g)) 0 100%/.06em .6em,linear-gradient(var(--g),var(--g)) 100% 100%/.6em .06em,linear-gradient(var(--g),var(--g)) 100% 100%/.06em .6em;background-repeat:no-repeat}
.du-futuristicHud .du-dec::after{content:"";position:absolute;left:0;right:0;height:.05em;background:linear-gradient(90deg,transparent,var(--g),transparent);top:0;opacity:.8}
.wd:not(.no-fx) .du-futuristicHud .du-dec::after{animation:duScan 2.6s linear infinite}@keyframes duScan{to{top:100%}}
.du-futuristicHud .du-ttl{color:var(--duTitle,#22e3ff);letter-spacing:.25em;font-family:"Orbitron","Readex Pro",sans-serif}
/* 11 Fire */
.du-fire .du-box{--g:#ff6a00;color:var(--duNum,#ffb347)}.du-fire .du-val{background:linear-gradient(0deg,#ff2a00,#ff8a00 40%,#ffe066 80%) 0 0/100% 200%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 0 calc(.15em*var(--duGlow,.6)) #ff5a00)}
.du-fire.has-c .du-val{-webkit-text-fill-color:currentColor;background:none}.wd:not(.no-fx) .du-fire .du-val{animation:duFlame 1.6s ease-in-out infinite alternate}
@keyframes duFlame{0%{background-position:0 0;transform:skewX(0)}50%{transform:skewX(-1.5deg)}100%{background-position:0 100%;transform:skewX(1deg)}}
.du-fire .du-ttl{color:var(--duTitle,#ffb347)}.du-fire .du-dec{background:radial-gradient(60% 50% at 50% 100%,#ff4d0033,transparent)}
/* 12 Ice */
.du-ice .du-box{color:var(--duNum,#e9fbff);--g:#9be7ff;background:var(--duBg,linear-gradient(160deg,#0d2a3acc,#061722cc));border:var(--duBw,.05em) solid var(--duFrame,#bdefff);border-radius:.2em .9em;box-shadow:inset 0 0 .6em #9be7ff44,0 0 calc(.4em*var(--duGlow,.6)) #9be7ff66}
.du-ice .du-dec::before{content:"❄  ✦  ❄";position:absolute;top:-.55em;inset-inline-start:.6em;font-size:.32em;color:#e9fbff;letter-spacing:.3em}
.wd:not(.no-fx) .du-ice .du-dec::before{animation:duTwinkle 2.4s ease-in-out infinite}@keyframes duTwinkle{50%{opacity:.3}}
.du-ice .du-ttl{color:var(--duTitle,#9be7ff)}
/* 13 RGB Animated */
.du-rgbAnimated .du-box{background:var(--duBg,#05060c);border-radius:.5em;isolation:isolate}
.du-rgbAnimated .du-dec{inset:-.07em;z-index:-1;border-radius:.56em;background:conic-gradient(from var(--duA,0deg),#ff004c,#ffcc00,#33ff66,#00ccff,#9a3dff,#ff004c);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;padding:.07em}
@property --duA{syntax:"<angle>";inherits:false;initial-value:0deg}.wd:not(.no-fx) .du-rgbAnimated .du-dec{animation:duSpin 3s linear infinite}@keyframes duSpin{to{--duA:360deg}}
.wd:not(.no-fx) .du-rgbAnimated .du-ttl{animation:duHue 4s linear infinite}@keyframes duHue{to{filter:hue-rotate(360deg)}}.du-rgbAnimated .du-ttl{color:var(--duTitle,#ff4d8d)}
/* 14 Metallic */
.du-metallic .du-box{color:var(--duNum,#2a2f36);background:var(--duBg,linear-gradient(180deg,#f4f6f8,#aeb6bf 48%,#d7dce1 52%,#8f98a2));border:var(--duBw,.05em) solid var(--duFrame,#6b737c);border-radius:.3em;box-shadow:inset 0 .05em 0 #fff,0 .12em .3em #0007}
.du-metallic .du-val{text-shadow:0 .03em 0 #fff,0 -.02em 0 #0005}.du-metallic .du-ttl{color:var(--duTitle,#3a4048)}
.du-metallic .du-dec{background:repeating-linear-gradient(90deg,#ffffff10 0 1px,transparent 1px 3px);border-radius:inherit}
/* 15 Holographic */
.du-holographic .du-box{color:var(--duNum,#fff);background:var(--duBg,linear-gradient(120deg,#ff9ad5,#9ad0ff,#b6ffda,#fff59a,#d3a6ff,#ff9ad5) 0 0/400% 400%);border-radius:.7em;text-shadow:0 .03em .1em #0006;border:var(--duBw,.04em) solid var(--duFrame,#ffffffaa)}
.wd:not(.no-fx) .du-holographic .du-box{animation:duHolo 8s ease-in-out infinite}@keyframes duHolo{50%{background-position:100% 100%}}
.du-holographic .du-ttl{color:var(--duTitle,#2b1450);text-shadow:none}
/* 16 Large Timer — مثل الصورة المرجعية */
.du-largeTimer .du-box{color:var(--duNum,#fff);--g:var(--duFrame,#4f8bff);background:var(--duBg,linear-gradient(180deg,#0f1830ee,#070b16ee));border:var(--duBw,.05em) solid var(--duFrame,#4f8bff);border-radius:.35em;padding:.18em .55em .3em;box-shadow:0 0 calc(.4em*var(--duGlow,.6)) #4f8bff55}
.du-largeTimer .du-ttl{order:-1;background:var(--duFrame,#4f8bff);color:var(--duTitle,#fff);padding:.18em .9em;border-radius:0 0 .4em .4em;margin-top:-.18em;font-size:calc(.28em*var(--duTitleS,1))}
.du-largeTimer .du-val{font-size:1.25em}
/* 17 Flip Cards */
.du-flipCards .du-box{background:none;padding:0}.du-flipCards .du-ttl{color:var(--duTitle,#fff);text-shadow:0 1px 4px #000}
.du-flipCards .du-n{display:inline-block;background:var(--duBg,linear-gradient(180deg,#2a2d36 50%,#1c1e25 50%));color:var(--duNum,#fff);border-radius:.14em;padding:.08em .14em;margin:0 .04em;box-shadow:0 .06em .14em #000a,inset 0 -.02em 0 #000;position:relative}
.du-flipCards .du-n.c-d{color:var(--duDay,#ffd166)}.du-flipCards .du-n.c-m,.du-flipCards .du-n.c-s{color:var(--duMs,var(--duNum,#fff))}
.du-flipCards .du-n::after{content:"";position:absolute;left:0;right:0;top:50%;height:.02em;background:#0009}
.du-flipCards .du-c{color:var(--duFrame,#fff);text-shadow:0 1px 3px #000}
.wd:not(.no-fx) .du-flipCards .du-n.tick{animation:duFlipN .45s ease}@keyframes duFlipN{0%{transform:perspective(300px) rotateX(-80deg)}100%{transform:none}}
/* 18 Live Pill */
.du-livePill .du-box{flex-direction:row;align-items:center;gap:.45em;background:var(--duBg,#e0103a);color:var(--duNum,#fff);border-radius:99em;padding:.18em .7em;box-shadow:0 .08em .3em #0008;font-family:var(--duFont,"Readex Pro",sans-serif)}
.du-livePill .du-ttl{font-size:calc(.5em*var(--duTitleS,1));color:var(--duTitle,#fff)}.du-livePill .du-ttl::before{content:"";display:inline-block;width:.55em;height:.55em;border-radius:50%;background:#fff;margin-inline-end:.35em;vertical-align:middle}
.wd:not(.no-fx) .du-livePill .du-ttl::before{animation:duPulse 1s infinite}.du-livePill .du-val{font-size:.8em}
/* 19 Retro Terminal */
.du-terminal .du-box{color:var(--duNum,#33ff77);--g:var(--duNum,#33ff77);background:var(--duBg,#020a04);border:var(--duBw,.04em) solid var(--duFrame,#1b5e2c);border-radius:.15em;font-family:var(--duFont,ui-monospace,"Courier New",monospace);align-items:flex-start}
.du-terminal .du-ttl{font-family:inherit;color:var(--duTitle,#33ff77);opacity:.7}.du-terminal .du-ttl::before{content:"> "}
.du-terminal .du-val::after{content:"█";margin-inline-start:.08em;font-size:.8em}.wd:not(.no-fx) .du-terminal .du-val::after{animation:duPulse 1s steps(1) infinite}
.du-terminal .du-dec{background:repeating-linear-gradient(0deg,#33ff7708 0 1px,transparent 1px 3px)}
/* 20 Orbit Ring */
.du-orbit .du-box{background:var(--duBg,radial-gradient(circle,#0e1530 55%,transparent 56%));padding:.9em .8em;border-radius:50%;aspect-ratio:auto;min-height:2.4em;justify-content:center}
.du-orbit .du-dec{border:.06em solid var(--duFrame,#6d7bff);border-radius:50%;box-shadow:0 0 calc(.4em*var(--duGlow,.6)) var(--duFrame,#6d7bff)}
.du-orbit .du-dec::after{content:"";position:absolute;width:.22em;height:.22em;border-radius:50%;background:#fff;box-shadow:0 0 .3em #fff;top:-.11em;left:50%;transform-origin:0 calc(50% + 50%)}
.wd:not(.no-fx) .du-orbit .du-dec{animation:duSpinR 6s linear infinite}@keyframes duSpinR{to{transform:rotate(360deg)}}
.du-orbit .du-ttl{color:var(--duTitle,#a9b4ff)}
.du-box.noneon .du-val{text-shadow:none!important;filter:none!important}
`;
let duCss=false;
function ensureDuCSS(){ if(duCss||typeof document==="undefined") return; duCss=true; const st=document.createElement("style"); st.id="b6o6-du"; st.textContent=DU_CSS; document.head.appendChild(st) }
/** HTML القطع: تشغيلات الوقت (أرقام و«:») تُغلّف LTR حتى لا تنقلب في العربية */
export function durHTML(parts,flip){ let html="", run="";
 const flush=()=>{ if(run){ html+=`<span class="du-clk">${run}</span>`; run="" } };
 for(const p of parts){ const c=p.c?" c-"+p.c:"";
  if(p.k==="n"||p.k===":"){ run+=p.k==="n"?`<span class="du-n${c}${flip?" fl":""}">${esc(p.t)}</span>`:`<span class="du-c${c}">${esc(p.t)}</span>`; continue }
  flush(); html+=p.k==="|"?`<span class="du-s">${esc(p.t)}</span>`:`<span class="du-u${c}">${esc(p.t)}</span>` }
 flush(); return html }

Object.assign(View.prototype,{
 applyDur(w,W,Hh){ ensureDuCSS(); const e=this.el, d=duDesignOf(w.design);
  e.classList.add("du-"+d.id);
  const set=(k,v)=>{ if(v==null||v==="") e.style.removeProperty(k); else e.style.setProperty(k,v) };
  set("--duNum",w.duNumC); set("--duDay",w.duDayC); set("--duMs",w.duMsC); set("--duTitle",w.duTitleC); set("--duFrame",w.duFrameC);
  const bgA=+w.duBgA; set("--duBg",w.duBg?(duHexA(w.duBg,bgA>=0?bgA:1)||w.duBg):(bgA>=0&&bgA<1?`rgba(0,0,0,${bgA})`:null)); if(w.duBg===""&&bgA===0) set("--duBg","transparent");
  set("--duBw",w.duFrameC?".06em":null); set("--duGlow",String(Math.max(0,Math.min(2,w.duGlow??.6)))); set("--duGap",(+w.duGap||0)+"em");
  set("--duTitleS",String(+w.duTitleS||1)); set("--duDayS",String(+w.duDayS||1)); set("--duFont",FONT_MAP[w.font]||null);
  set("--duJ",w.duAlign==="start"?"flex-start":w.duAlign==="end"?"flex-end":"center");
  this.duBase=Math.min(Hh*.42,W*.16)*(+w.fontScale||1)*(+w.duNumS||1); this.duW=W; this.duH=Hh;
  e.innerHTML=`<div class="du"><div class="du-box ${w.duNeon!==false?"neon":"noneon"} ${w.duNumC?"has-c":""} in-${w.duIn||"fade"}" dir="${w.duLang==="en"?"ltr":"rtl"}"><i class="du-dec"></i><div class="du-ttl"></div><div class="du-val"></div></div></div>`;
  this.du={box:e.querySelector(".du-box"),ttl:e.querySelector(".du-ttl"),val:e.querySelector(".du-val"),html:"",sig:"",days:false,out:false};
  this.du.box.style.setProperty("--dfs",this.duBase+"px");
  if(this.opts.data) this.refreshDur(this.opts.data(),true) },
 refreshDur(src){ const U=this.du, w=this.w; if(!U||!src) return;
  const now=Date.now()+(+src.skew||0);
  // المعاينة في المكتبة/المحرر بدون بث: قيمة نموذجية ثابتة للعرض فقط (لا تُستخدم في رابط البث)
  const demo=w.duDemoMs!=null&&(this.opts.editor||String(w.id).startsWith("pv_"));
  const R=demo?{ms:+w.duDemoMs,running:true,ended:false,idle:false}:durOf(src.C,now);
  const o=durOpts(w), parts=duParts(R.ms,o), html=durHTML(parts,w.design==="flipCards");
  const title=w.duShowTitle===false?"":(w.duTitle||(o.lang==="en"?"LIVE TIME":"مدة البث"));
  if(U.ttl.textContent!==title||U.ttl.style.display!==(title?"":"none")){ U.ttl.textContent=title; U.ttl.style.display=title?"":"none"; U.sig="" }
  U.box.classList.toggle("du-idle",!!R.idle); U.box.classList.toggle("du-ended",!!R.ended);
  // الخروج عند انتهاء البث (اختياري) — والدخول من جديد عند بث جديد
  const hide=!!(w.duHideEnded&&R.ended&&!demo);
  if(hide!==U.out){ U.out=hide; U.box.classList.remove("in-"+(w.duIn||"fade")); U.box.classList.toggle("out-"+(w.duOut||"fade"),hide); if(!hide){ void U.box.offsetWidth; U.box.classList.add("in-"+(w.duIn||"fade")) } }
  if(html===U.html) return;
  const prevFlip=w.design==="flipCards"?[...U.val.querySelectorAll(".du-n")].map(x=>x.textContent):null;
  U.val.innerHTML=html; U.html=html; U.val.dataset.ghost=parts.map(p=>p.k==="n"?p.t.replace(/\d/g,"8"):p.t).join("");
  if(prevFlip){ U.val.querySelectorAll(".du-n").forEach((x,i)=>{ if(prevFlip[i]!==undefined&&prevFlip[i]!==x.textContent) x.classList.add("tick") }) }
  const hasDays=parts.some(p=>p.c==="d"); if(hasDays&&!U.days&&U.sig) U.box.classList.add("du-day-in"); U.days=hasDays;
  // ملاءمة الحجم فقط عند تغيّر بنية العرض (ظهور الأيام، تغيّر عدد الخانات) — لا اهتزاز كل ثانية
  const sig=title+"|"+parts.map(p=>p.k+(p.k==="n"?p.t.length:p.t)).join("");
  if(sig!==U.sig){ U.sig=sig; this.fitDur() } },
 fitDur(tries=0){ const U=this.du; if(!U) return;
  // العنصر لم يُعرض بعد (القياس = 0): نعيد المحاولة بعد الرسم
  if(!U.box.isConnected||!U.box.scrollWidth){ if(tries<20&&typeof requestAnimationFrame==="function") requestAnimationFrame(()=>this.fitDur(tries+1)); return }
  let fs=this.duBase; U.box.style.transition="none"; U.box.style.setProperty("--dfs",fs+"px");
  const W=this.duW*.97, H=this.duH*.97, bw=U.box.scrollWidth, bh=U.box.scrollHeight;
  requestAnimationFrame&&requestAnimationFrame(()=>{ U.box.style.transition="" });
  if(bw>W||bh>H){ fs=fs*Math.min(W/Math.max(1,bw),H/Math.max(1,bh)); U.box.style.setProperty("--dfs",Math.max(6,fs)+"px") } }
});
