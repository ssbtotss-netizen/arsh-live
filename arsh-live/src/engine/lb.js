// ====== قوائم Pro + أهداف الدعم المصغّرة ======
// خلفية خارجية شفافة 100%: لا يوجد صندوق خلف القائمة — فقط الصفوف والصور والهالات والزخارف.
import { entries } from "./leaderboard.js";
import { donorTotals, defaultDonCfg, fmtMoney } from "./donations.js";

export const LB_SOURCES=[["gifts","نقاط هدايا TikTok (هذا البث)"],["giftsDay","أقوى داعمي اليوم (هدايا TikTok)"],["giftsWeek","أقوى داعمي الأسبوع"],["giftsMonth","أقوى داعمي الشهر"],["giftCount","عدد هدايا TikTok"],["gift","هدية TikTok محددة"],["likes","التكبيس (الإعجابات)"],["donations","الدونيشن المالي"],["interact","أكثر المتفاعلين"],["comments","أكثر المعلقين"]];
export const LB_CATS={circle:"الدائرية والهالات",cloud:"السحابية والحالمة",royal:"الملكية والفاخرة",neon:"النيون والألعاب",glass:"الزجاجية والكريستالية",d3:"ثلاثية الأبعاد",mini:"الصغيرة والأنيقة"};
export const RANK_COLORS=["#f5c542","#cfd8e3","#d08a52","#2f7bff","#9b5cff"];
const LB_ICONS={gifts:"💎",giftCount:"🎁",gift:"🎁",likes:"❤️",donations:"💰",interact:"⚡",comments:"💬"};

/** بيانات القائمة حسب المصدر المختار — كل قائمة مستقلة */
import { topsList } from "./tops.js";
export function lbEntries(w,src){
 const D=src.D||{}, N=w.topN||5, s=w.source||"gifts";
 if(src.preview) return src.preview.slice(0,N);
 if(s==="donations"){ const DC=src.DC||defaultDonCfg(); return donorTotals(src.DN||{list:[]},DC,{period:w.period||"session",currency:w.currency||DC.currency,now:Date.now()+(src.skew||0),hideAnon:w.hideAnon}).slice(0,N) }
 if(s==="giftsDay"||s==="giftsWeek"||s==="giftsMonth"){ const per={giftsDay:"day",giftsWeek:"week",giftsMonth:"month"}[s]; return topsList(src.C&&src.C.tops,per,Date.now()+(src.skew||0),180).slice(0,N).map(r=>({k:r.id,name:r.name,av:r.av,v:r.v})) }
 if(s==="gift"){ const gb=(D.giftBy||{})[String(w.giftKey||"")]||{}; return Object.values(gb).map(r=>({k:r.k,name:r.name,av:r.av,v:r.v})).sort((a,b)=>b.v-a.v).slice(0,N) }
 if(s==="giftCount") return entries({type:"gifts",sortBy:"count",topN:N},D,src.H);
 if(s==="gifts") return entries({type:"gifts",sortBy:w.sortBy||"value",topN:N},D,src.H);
 return entries({type:s,topN:N},D,src.H);
}
export const lbIcon=w=>w.icon||(w.source==="gift"&&w.giftEmoji)||LB_ICONS[w.source]||"💎";
export function lbFmt(w,v,src){ if(w.source==="donations"){ const DC=src.DC||defaultDonCfg(); return fmtMoney(v,w.currency||DC.currency) } return Math.round(v).toLocaleString("en-US") }

// ================= التصاميم (الدفعة الأولى: الدائرية والهالات) =================
// كل تصميم: شكل الصف (row) + الهالة حول الصورة (halo + زخارفها) + خلفية البطاقة + الخط + حركات خاصة
export const LB_DESIGNS=[
 {id:"pinkCloud",n:1,name:"Pink Cloud Royal",cat:"circle",desc:"صور دائرية بهالات وردية سحابية وبطاقات بنفسجية",colors:["#ff8fd8","#c9a7ff","#ff9fb8","#a78bfa","#f0abfc"],row:"pill",halo:"cloud",font:"Changa"},
 {id:"whiteAngel",n:2,name:"White Angel",cat:"circle",desc:"هالات بيضاء ناعمة مع أجنحة ضوئية صغيرة",colors:["#ffffff","#e2e8f0","#fde68a","#bae6fd","#ddd6fe"],row:"glass",halo:"angel",font:"Readex Pro"},
 {id:"goldenHalo",n:3,name:"Golden Halo",cat:"circle",desc:"حلقات ذهبية تدور حول الصور",colors:["#f5c542","#d4d4d8","#d08a52","#f59e0b","#eab308"],row:"slim",halo:"goldRings",font:"Changa"},
 {id:"diamondRing",n:4,name:"Diamond Ring",cat:"circle",desc:"إطار ألماسي متلألئ",colors:["#a5f3fc","#e0f2fe","#c4b5fd","#67e8f9","#93c5fd"],row:"facet",halo:"diamond",font:"Readex Pro"},
 {id:"purpleGalaxy",n:5,name:"Purple Galaxy",cat:"circle",desc:"مجرة بنفسجية تدور حول الصورة",colors:["#c084fc","#818cf8","#f472b6","#6366f1","#a855f7"],row:"space",halo:"galaxy",font:"Changa"},
 {id:"crystalMoon",n:6,name:"Crystal Moon",cat:"circle",desc:"إطار قمري فضي مع نجوم",colors:["#e2e8f0","#cbd5e1","#bfdbfe","#94a3b8","#c7d2fe"],row:"frost",halo:"moon",font:"Readex Pro"},
 {id:"roseAura",n:7,name:"Rose Aura",cat:"circle",desc:"هالة وردية متحركة مع بتلات صغيرة",colors:["#fb7185","#f9a8d4","#fda4af","#f472b6","#e879f9"],row:"leaf",halo:"rose",font:"Changa"},
 {id:"blueEnergy",n:8,name:"Blue Energy",cat:"circle",desc:"حلقات طاقة زرقاء",colors:["#38bdf8","#60a5fa","#22d3ee","#2f7bff","#818cf8"],row:"energy",halo:"energy",font:"Orbitron"},
 {id:"rainbowHalo",n:9,name:"Rainbow Halo",cat:"circle",desc:"حلقة متدرجة الألوان تتحرك ببطء",colors:["#f5c542","#cfd8e3","#d08a52","#2f7bff","#9b5cff"],row:"darkGlass",halo:"rainbow",font:"Readex Pro"},
 {id:"royalCrown",n:10,name:"Royal Crown",cat:"circle",desc:"تاج أعلى الصورة مع إطار ملكي",colors:["#f5c542","#cfd8e3","#d08a52","#7c3aed","#9b5cff"],row:"royal",halo:"royal",font:"Changa"},
 {id:"iceCircle",n:11,name:"Ice Circle",cat:"circle",desc:"إطار جليدي مع بلورات متلألئة",colors:["#e0f2fe","#bae6fd","#a5b4fc","#7dd3fc","#c7d2fe"],row:"frost",halo:"ice",font:"Readex Pro"},
 {id:"fireCircle",n:12,name:"Fire Circle",cat:"circle",desc:"حلقة نارية ناعمة حول الصورة",colors:["#fbbf24","#fb923c","#f87171","#f97316","#ef4444"],row:"ember",halo:"fire",font:"Changa"},
 {id:"electricAura",n:13,name:"Electric Aura",cat:"circle",desc:"شرارات كهربائية خفيفة حول الإطار",colors:["#facc15","#a3e635","#22d3ee","#60a5fa","#c084fc"],row:"volt",halo:"electric",font:"Orbitron"},
 {id:"pearlRing",n:14,name:"Pearl Ring",cat:"circle",desc:"إطار لؤلؤي أبيض متحرك",colors:["#d4a373","#94a3b8","#c08457","#64748b","#a78bfa"],row:"pearl",halo:"pearl",font:"Changa"},
 {id:"b6o6Halo",n:15,name:"B6O6 Halo",cat:"circle",desc:"تصميم حصري بهالة زرقاء وفضية",colors:["#2f7bff","#c0c7d4","#7fb2ff","#1d4ed8","#94a3b8"],row:"chrome",halo:"b6o6",font:"Changa"},
 {id:"dreamClouds",n:16,name:"Dream Clouds",cat:"cloud",desc:"صور فوق غيوم صغيرة متحركة",colors:["#93c5fd","#c4b5fd","#f9a8d4","#a5f3fc","#bfdbfe"],row:"puff",halo:"cloudSeat",font:"Changa"},
 {id:"pinkHeaven",n:17,name:"Pink Heaven",cat:"cloud",desc:"غيوم وردية مع نجوم بيضاء",colors:["#f472b6","#f9a8d4","#fb7185","#e879f9","#fda4af"],row:"heaven",halo:"heaven",font:"Changa"},
 {id:"cloudNine",n:18,name:"Cloud Nine",cat:"cloud",desc:"صور معلقة داخل سحب مضيئة",colors:["#60a5fa","#a78bfa","#38bdf8","#818cf8","#93c5fd"],row:"bright",halo:"cloud9",font:"Readex Pro"},
 {id:"moonlightDream",n:19,name:"Moonlight Dream",cat:"cloud",desc:"هلال خلف صورة الداعم",colors:["#fde68a","#e2e8f0","#fcd34d","#c7d2fe","#a5b4fc"],row:"night",halo:"moonBack",font:"Changa"},
 {id:"starGarden",n:20,name:"Star Garden",cat:"cloud",desc:"نجوم صغيرة تدور حول الصور",colors:["#fde047","#a7f3d0","#f9a8d4","#93c5fd","#c4b5fd"],row:"garden",halo:"starOrbit",font:"Readex Pro"},
 {id:"cottonCandy",n:21,name:"Cotton Candy",cat:"cloud",desc:"سحب وردية وزرقاء ناعمة",colors:["#f9a8d4","#93c5fd","#fbcfe8","#bae6fd","#ddd6fe"],row:"cotton",halo:"cotton",font:"Changa"},
 {id:"angelWings",n:22,name:"Angel Wings",cat:"cloud",desc:"أجنحة صغيرة حول المركز الأول",colors:["#fde68a","#f1f5f9","#fbcfe8","#e0e7ff","#e2e8f0"],row:"halo",halo:"wings1",font:"Changa"},
 {id:"floatingStars",n:23,name:"Floating Stars",cat:"cloud",desc:"صور طافية مع نجوم متحركة",colors:["#fef08a","#bfdbfe","#fecaca","#a5f3fc","#e9d5ff"],row:"float",halo:"floatStars",font:"Readex Pro"},
 {id:"crystalClouds",n:24,name:"Crystal Clouds",cat:"cloud",desc:"غيوم كريستالية شفافة",colors:["#a5f3fc","#e0f2fe","#c4b5fd","#99f6e4","#bae6fd"],row:"crystal",halo:"crystalCloud",font:"Readex Pro"},
 {id:"purpleFantasy",n:25,name:"Purple Fantasy",cat:"cloud",desc:"غيوم بنفسجية مع لمعات متدرجة",colors:["#c084fc","#e879f9","#a78bfa","#f0abfc","#818cf8"],row:"fantasy",halo:"fantasy",font:"Changa"},
 {id:"kingSupport",n:26,name:"King of Support",cat:"royal",desc:"تاج ذهبي متحرك وأشعة خلف المتصدر",colors:["#f5c542","#d4d4d8","#d08a52","#eab308","#ca8a04"],row:"king",halo:"kingRays",font:"Changa"},
 {id:"royalThrone",n:27,name:"Royal Throne",cat:"royal",desc:"بطاقات على شكل عروش مصغرة",colors:["#f5c542","#e5e7eb","#d08a52","#fbbf24","#f59e0b"],row:"throne",halo:"throne",font:"Changa"},
 {id:"goldenPalace",n:28,name:"Golden Palace",cat:"royal",desc:"إطارات ذهبية مزخرفة",colors:["#f5c542","#e7d7a8","#d08a52","#eab308","#b45309"],row:"palace",halo:"ornate",font:"Changa"},
 {id:"diamondEmperor",n:29,name:"Diamond Emperor",cat:"royal",desc:"ألماس يدور حول صورة المركز الأول",colors:["#a5f3fc","#e2e8f0","#c4b5fd","#93c5fd","#cbd5e1"],row:"emperor",halo:"gemOrbit",font:"Changa"},
 {id:"luxuryBlackGold",n:30,name:"Luxury Black Gold",cat:"royal",desc:"أسود وذهبي مع لمعة بيضاء",colors:["#f5c542","#d6c08a","#c9a227","#b8962e","#a3832a"],row:"blackGold",halo:"goldThin",font:"Readex Pro"},
 {id:"silverKingdom",n:31,name:"Silver Kingdom",cat:"royal",desc:"إطارات فضية كرومية",colors:["#475569","#64748b","#78716c","#334155","#52525b"],row:"silver",halo:"chrome",font:"Changa"},
 {id:"royalRuby",n:32,name:"Royal Ruby",cat:"royal",desc:"أحجار ياقوت حمراء",colors:["#f5c542","#fecaca","#fb7185","#f87171","#fda4af"],row:"ruby",halo:"gems",font:"Changa",gem:"#e11d48"},
 {id:"emeraldKing",n:33,name:"Emerald King",cat:"royal",desc:"أحجار زمرد خضراء",colors:["#f5c542","#bbf7d0","#6ee7b7","#34d399","#a7f3d0"],row:"emerald",halo:"gems",font:"Changa",gem:"#10b981"},
 {id:"sapphireElite",n:34,name:"Sapphire Elite",cat:"royal",desc:"ياقوت أزرق مع توهج",colors:["#f5c542","#bfdbfe","#93c5fd","#60a5fa","#a5b4fc"],row:"sapphire",halo:"gems",font:"Changa",gem:"#2563eb"},
 {id:"platinumCrown",n:35,name:"Platinum Crown",cat:"royal",desc:"تاج بلاتيني متحرك فوق الصور",colors:["#f1f5f9","#cbd5e1","#d6d3d1","#94a3b8","#a1a1aa"],row:"platinum",halo:"platCrown",font:"Readex Pro"},
 {id:"goldenWings",n:36,name:"Golden Wings",cat:"royal",desc:"أجنحة ذهبية خلف الصورة",colors:["#f5c542","#e5e7eb","#d08a52","#fbbf24","#f59e0b"],row:"wingsGold",halo:"goldWings",font:"Changa"},
 {id:"royalMedals",n:37,name:"Royal Medals",cat:"royal",desc:"ميداليات وأشرطة للمراكز الثلاثة",colors:["#f5c542","#cbd5e1","#d08a52","#3b82f6","#8b5cf6"],row:"medal",halo:"medal",font:"Changa"},
 {id:"kingdomGlass",n:38,name:"Kingdom Glass",cat:"royal",desc:"بطاقات ملكية زجاجية بحافة ذهبية",colors:["#f5c542","#e2e8f0","#d08a52","#93c5fd","#c4b5fd"],row:"kglass",halo:"glassRing",font:"Readex Pro"},
 {id:"diamondCastle",n:39,name:"Diamond Castle",cat:"royal",desc:"زخارف ألماسية حول البطاقات",colors:["#a5f3fc","#e0e7ff","#c4b5fd","#67e8f9","#a5b4fc"],row:"castle",halo:"castle",font:"Changa"},
 {id:"b6o6Royal",n:40,name:"B6O6 Royal",cat:"royal",desc:"تصميم ملكي حصري للمنصة: أسود وأزرق وفضي",colors:["#2f7bff","#c0c7d4","#7fb2ff","#1d4ed8","#64748b"],row:"b6royal",halo:"b6royal",font:"Changa"},
 {id:"neonPink",n:41,name:"Neon Pink Pro",cat:"neon",desc:"إطار وردي نيون متحرك",colors:["#ff2fb3","#ff7ad9","#f472b6","#e879f9","#fb7185"],row:"neon",halo:"neonDouble",font:"Changa"},
 {id:"cyberBlue",n:42,name:"Cyber Blue",cat:"neon",desc:"خطوط إلكترونية زرقاء",colors:["#22d3ee","#38bdf8","#60a5fa","#3b82f6","#818cf8"],row:"circuit",halo:"circuit",font:"Orbitron"},
 {id:"rgbGamer",n:43,name:"RGB Gamer",cat:"neon",desc:"ألوان RGB تتحرك حول الصور",colors:["#ff004c","#00ff88","#00c3ff","#ffcc00","#a100ff"],row:"rgb",halo:"rgbRing",font:"Orbitron"},
 {id:"gamingHudPro",n:44,name:"Gaming HUD",cat:"neon",desc:"واجهة ألعاب مستقبلية بزوايا تصويب",colors:["#4ade80","#a3e635","#22d3ee","#facc15","#f472b6"],row:"hud",halo:"brackets",font:"Orbitron"},
 {id:"esportsChampion",n:45,name:"Esports Champion",cat:"neon",desc:"بطاقات بطولات إلكترونية بإطار سداسي",colors:["#f5c542","#e5e7eb","#f97316","#ef4444","#8b5cf6"],row:"esports",halo:"hex",font:"Changa"},
 {id:"cyberpunkCity",n:46,name:"Cyberpunk City",cat:"neon",desc:"إطارات سايبربنك مضيئة",colors:["#fcee0a","#ff2a6d","#05d9e8","#d1f7ff","#ff9f1c"],row:"cyberpunk",halo:"glitch",font:"Orbitron"},
 {id:"digitalPulse",n:47,name:"Digital Pulse",cat:"neon",desc:"نبضات رقمية حول الصورة",colors:["#34d399","#22d3ee","#a3e635","#2dd4bf","#4ade80"],row:"pulse",halo:"pulse",font:"Orbitron"},
 {id:"hologramPlayer",n:48,name:"Hologram Player",cat:"neon",desc:"صورة داخل هولوغرام متحرك",colors:["#67e8f9","#a5f3fc","#7dd3fc","#5eead4","#c4b5fd"],row:"holo",halo:"holo",font:"Orbitron"},
 {id:"electricStorm",n:49,name:"Electric Storm",cat:"neon",desc:"عاصفة بنفسجية وشرارات كهربائية",colors:["#c084fc","#e9d5ff","#a78bfa","#818cf8","#f0abfc"],row:"storm",halo:"storm",font:"Changa"},
 {id:"techOrbit",n:50,name:"Tech Orbit",cat:"neon",desc:"حلقات تقنية تدور حول الصور",colors:["#38bdf8","#a78bfa","#34d399","#f472b6","#facc15"],row:"orbit",halo:"techOrbit",font:"Orbitron"},
 {id:"neonTriangle",n:51,name:"Neon Triangle",cat:"neon",desc:"إطار مثلث نيون متحرك",colors:["#f43f5e","#22d3ee","#a3e635","#e879f9","#facc15"],row:"tri",halo:"triangle",font:"Orbitron"},
 {id:"laserFrame",n:52,name:"Laser Frame",cat:"neon",desc:"أشعة ليزر تجري على حدود البطاقة",colors:["#ef4444","#22d3ee","#22c55e","#f472b6","#facc15"],row:"laser",halo:"laser",font:"Orbitron"},
 {id:"digitalMatrix",n:53,name:"Digital Matrix",cat:"neon",desc:"أرقام رقمية تتحرك بالخلفية",colors:["#22c55e","#4ade80","#86efac","#16a34a","#a3e635"],row:"matrix",halo:"matrix",font:"Orbitron"},
 {id:"rgbCrown",n:54,name:"RGB Crown",cat:"neon",desc:"تاج RGB متغيّر للمركز الأول",colors:["#ff004c","#00ff88","#00c3ff","#ffcc00","#a100ff"],row:"rgbc",halo:"rgbThin",font:"Changa"},
 {id:"b6o6Esports",n:55,name:"B6O6 Esports",cat:"neon",desc:"تصميم ألعاب حصري للمنصة",colors:["#2f7bff","#c0c7d4","#7fb2ff","#1d4ed8","#64748b"],row:"b6es",halo:"b6hex",font:"Orbitron"},
 {id:"liquidGlass",n:56,name:"Liquid Glass",cat:"glass",desc:"زجاج سائل يتموّج حول الصورة",colors:["#7dd3fc","#c4b5fd","#f9a8d4","#93c5fd","#a5f3fc"],row:"liquid",halo:"liquid",font:"Readex Pro"},
 {id:"frostedCrystal",n:57,name:"Frosted Crystal",cat:"glass",desc:"زجاج ضبابي مع حواف مضيئة",colors:["#f5c542","#e2e8f0","#d08a52","#7dd3fc","#c4b5fd"],row:"frosted",halo:"frost",font:"Readex Pro"},
 {id:"transparentDiamond",n:58,name:"Transparent Diamond",cat:"glass",desc:"بطاقات ألماسية شفافة",colors:["#a5f3fc","#e0e7ff","#c4b5fd","#99f6e4","#bae6fd"],row:"tdiamond",halo:"rhombus",font:"Readex Pro"},
 {id:"glassBubble",n:59,name:"Glass Bubble",cat:"glass",desc:"الصور داخل فقاعات زجاجية",colors:["#7dd3fc","#f9a8d4","#a7f3d0","#c4b5fd","#fde68a"],row:"bubble",halo:"bubble",font:"Changa"},
 {id:"crystalOrbit",n:60,name:"Crystal Orbit",cat:"glass",desc:"بلورات تدور حول الصورة",colors:["#a5f3fc","#c4b5fd","#f0abfc","#93c5fd","#99f6e4"],row:"corbit",halo:"shards",font:"Readex Pro"},
 {id:"mirrorChrome",n:61,name:"Mirror Chrome",cat:"glass",desc:"انعكاس كرومي متحرك",colors:["#1e293b","#334155","#44403c","#0f172a","#3f3f46"],row:"mirror",halo:"chromeSpin",font:"Changa"},
 {id:"glassReflection",n:62,name:"Glass Reflection",cat:"glass",desc:"انعكاس ضوء أبيض يمر على البطاقة والصورة",colors:["#f8fafc","#e2e8f0","#fde68a","#bfdbfe","#ddd6fe"],row:"reflect",halo:"reflect",font:"Readex Pro"},
 {id:"iceGlass",n:63,name:"Ice Glass",cat:"glass",desc:"زجاج جليدي شفاف مع رقاقات ثلج",colors:["#bae6fd","#e0f2fe","#a5f3fc","#7dd3fc","#c7d2fe"],row:"iceglass",halo:"icicle",font:"Readex Pro"},
 {id:"pearlCrystal",n:64,name:"Pearl Crystal",cat:"glass",desc:"لؤلؤ وكريستال أبيض",colors:["#f5f5f4","#e7e5e4","#fde68a","#e0e7ff","#fbcfe8"],row:"pearlglass",halo:"pearls",font:"Changa"},
 {id:"holographicGlass",n:65,name:"Holographic Glass",cat:"glass",desc:"زجاج هولوغرافي بألوان متغيّرة",colors:["#f0abfc","#a5f3fc","#fde68a","#c4b5fd","#99f6e4"],row:"hologlass",halo:"iris",font:"Changa"},
 {id:"prismLight",n:66,name:"Prism Light",cat:"glass",desc:"انعكاسات منشورية بألوان الطيف",colors:["#fef08a","#a5f3fc","#f9a8d4","#c4b5fd","#bbf7d0"],row:"prism",halo:"prism",font:"Readex Pro"},
 {id:"diamondDust",n:67,name:"Diamond Dust",cat:"glass",desc:"غبار ألماسي خفيف يلمع",colors:["#e0f2fe","#f1f5f9","#fde68a","#e9d5ff","#cffafe"],row:"dust",halo:"dust",font:"Readex Pro"},
 {id:"glassWings",n:68,name:"Glass Wings",cat:"glass",desc:"أجنحة زجاجية خلف الصور",colors:["#a5f3fc","#e0e7ff","#f9a8d4","#bae6fd","#ddd6fe"],row:"gwings",halo:"glassWings",font:"Changa"},
 {id:"crystalCrown",n:69,name:"Crystal Crown",cat:"glass",desc:"تاج كريستالي للمتصدر",colors:["#a5f3fc","#e0e7ff","#c4b5fd","#99f6e4","#bfdbfe"],row:"ccrown",halo:"crystalCrown",font:"Changa"},
 {id:"b6o6Crystal",n:70,name:"B6O6 Crystal",cat:"glass",desc:"تصميم كريستالي حصري للمنصة",colors:["#2f7bff","#c0c7d4","#7fb2ff","#93c5fd","#94a3b8"],row:"b6crystal",halo:"b6crystal",font:"Changa"},
 {id:"float3d",n:71,name:"3D Floating Cards",cat:"d3",desc:"بطاقات طافية بعمق بصري وظلال متدرجة",colors:["#f5c542","#e2e8f0","#d08a52","#60a5fa","#a78bfa"],row:"float3d",halo:"float3d",font:"Changa"},
 {id:"rotHalo3d",n:72,name:"3D Rotating Halo",cat:"d3",desc:"هالات تدور بمنظور ثلاثي الأبعاد",colors:["#f5c542","#cbd5e1","#d08a52","#38bdf8","#c084fc"],row:"rotHalo3d",halo:"rot3d",font:"Changa"},
 {id:"diamond3d",n:73,name:"3D Diamond",cat:"d3",desc:"ألماسة مجسمة تدور خلف المركز الأول",colors:["#a5f3fc","#e2e8f0","#c4b5fd","#93c5fd","#99f6e4"],row:"diamond3d",halo:"diamond3d",font:"Changa"},
 {id:"crown3d",n:74,name:"3D Crown",cat:"d3",desc:"تاج مجسم يدور وإطارات بارزة",colors:["#f5c542","#d4d4d8","#d08a52","#eab308","#ca8a04"],row:"crown3d",halo:"crown3d",font:"Changa"},
 {id:"glassPodium3d",n:75,name:"3D Glass Podium",cat:"d3",desc:"منصة تتويج زجاجية مجسمة",colors:["#f5c542","#e2e8f0","#d08a52","#93c5fd","#c4b5fd"],row:"glassPodium3d",halo:"glassRing3d",font:"Readex Pro"},
 {id:"orbit3d",n:76,name:"3D Orbit",cat:"d3",desc:"كرات صغيرة تدور حول الصور بعمق",colors:["#38bdf8","#f472b6","#a3e635","#facc15","#c084fc"],row:"orbit3d",halo:"orbit3d",font:"Orbitron"},
 {id:"neonRings3d",n:77,name:"3D Neon Rings",cat:"d3",desc:"حلقات نيون متقاطعة كالجيروسكوب",colors:["#22d3ee","#f472b6","#a3e635","#facc15","#c084fc"],row:"neonRings3d",halo:"gyro",font:"Orbitron"},
 {id:"crystalFrame3d",n:78,name:"3D Crystal Frame",cat:"d3",desc:"إطار كريستالي مجسم يميل ببطء",colors:["#a5f3fc","#e0e7ff","#c4b5fd","#99f6e4","#bfdbfe"],row:"crystalFrame3d",halo:"frame3d",font:"Readex Pro"},
 {id:"medal3d",n:79,name:"3D Royal Medal",cat:"d3",desc:"ميداليات مجسمة تدور كالعملة",colors:["#f5c542","#cbd5e1","#d08a52","#60a5fa","#a78bfa"],row:"medal3d",halo:"coin",font:"Changa"},
 {id:"hologram3d",n:80,name:"3D Hologram",cat:"d3",desc:"صور معلقة في هولوغرام مائل",colors:["#67e8f9","#a5f3fc","#7dd3fc","#5eead4","#c4b5fd"],row:"hologram3d",halo:"holo3d",font:"Orbitron"},
 {id:"lightCube3d",n:81,name:"3D Light Cube",cat:"d3",desc:"مكعبات ضوئية تدور خلف الصور",colors:["#38bdf8","#a78bfa","#f472b6","#34d399","#facc15"],row:"lightCube3d",halo:"cube",font:"Orbitron"},
 {id:"floatCrown3d",n:82,name:"3D Floating Crown",cat:"d3",desc:"تاج عائم يدور مع ظل تحته",colors:["#f5c542","#e5e7eb","#d08a52","#fbbf24","#f59e0b"],row:"floatCrown3d",halo:"floatCrown",font:"Changa"},
 {id:"energySphere3d",n:83,name:"3D Energy Sphere",cat:"d3",desc:"كرة طاقة حول المتصدر",colors:["#38bdf8","#c4b5fd","#5eead4","#60a5fa","#a78bfa"],row:"energySphere3d",halo:"sphere",font:"Orbitron"},
 {id:"premiumGlass3d",n:84,name:"3D Premium Glass",cat:"d3",desc:"زجاج مجسم بحافة سميكة وانعكاسات",colors:["#f5c542","#e2e8f0","#d08a52","#93c5fd","#c4b5fd"],row:"premiumGlass3d",halo:"pglass",font:"Readex Pro"},
 {id:"b6o63d",n:85,name:"B6O6 3D Elite",cat:"d3",desc:"تصميم حصري ثلاثي الأبعاد للمنصة",colors:["#2f7bff","#c0c7d4","#7fb2ff","#1d4ed8","#94a3b8"],row:"b6o63d",halo:"b6gyro",font:"Changa"},
 {id:"miniPinkHalo",n:86,name:"Mini Pink Halo",cat:"mini",desc:"صور صغيرة بهالات وردية",colors:["#f472b6","#f9a8d4","#fb7185","#e879f9","#fda4af"],row:"miniPinkHalo",halo:"mPink",font:"Changa",avs:.72},
 {id:"miniGoldCrown",n:87,name:"Mini Gold Crown",cat:"mini",desc:"صور صغيرة مع تيجان ذهبية للثلاثة الأوائل",colors:["#f5c542","#d4d4d8","#d08a52","#94a3b8","#94a3b8"],row:"miniGoldCrown",halo:"mCrown",font:"Changa",avs:.72},
 {id:"miniCrystal",n:88,name:"Mini Crystal",cat:"mini",desc:"بطاقات كريستالية مضغوطة",colors:["#a5f3fc","#e0e7ff","#c4b5fd","#99f6e4","#bfdbfe"],row:"miniCrystal",halo:"mRing",font:"Readex Pro",avs:.72},
 {id:"compactRoyal",n:89,name:"Compact Royal",cat:"mini",desc:"ترتيب ملكي صغير بنفسجي وذهبي",colors:["#f5c542","#e5e7eb","#d08a52","#c4b5fd","#a78bfa"],row:"compactRoyal",halo:"mRoyal",font:"Changa",avs:.72},
 {id:"floatingMini",n:90,name:"Floating Mini Cards",cat:"mini",desc:"بطاقات صغيرة طافية",colors:["#f5c542","#e2e8f0","#d08a52","#93c5fd","#c4b5fd"],row:"floatingMini",halo:"mRing",font:"Readex Pro",avs:.72},
 {id:"slimNeon",n:91,name:"Slim Neon",cat:"mini",desc:"شريط نيون رفيع",colors:["#22d3ee","#f472b6","#a3e635","#facc15","#c084fc"],row:"slimNeon",halo:"mNeon",font:"Orbitron",avs:.72},
 {id:"miniGlass",n:92,name:"Mini Glass",cat:"mini",desc:"بطاقات زجاجية صغيرة",colors:["#f8fafc","#e2e8f0","#fde68a","#bfdbfe","#ddd6fe"],row:"miniGlass",halo:"mRing",font:"Readex Pro",avs:.72},
 {id:"minimalWhite",n:93,name:"Minimal White",cat:"mini",desc:"تصميم أبيض أنيق",colors:["#0f172a","#475569","#78716c","#334155","#64748b"],row:"minimalWhite",halo:"mPlain",font:"Readex Pro",avs:.72},
 {id:"minimalBlack",n:94,name:"Minimal Black",cat:"mini",desc:"تصميم أسود شفاف بسيط",colors:["#f8fafc","#cbd5e1","#d6d3d1","#94a3b8","#94a3b8"],row:"minimalBlack",halo:"mPlain",font:"Readex Pro",avs:.72},
 {id:"miniDiamond",n:95,name:"Mini Diamond",cat:"mini",desc:"ألماس صغير حول الصور",colors:["#a5f3fc","#e0e7ff","#c4b5fd","#67e8f9","#bae6fd"],row:"miniDiamond",halo:"mGem",font:"Changa",avs:.72},
 {id:"miniCloud",n:96,name:"Mini Cloud",cat:"mini",desc:"غيوم وردية مصغرة",colors:["#f9a8d4","#c4b5fd","#93c5fd","#fbcfe8","#ddd6fe"],row:"miniCloud",halo:"mCloud",font:"Changa",avs:.72},
 {id:"miniEsports",n:97,name:"Mini Esports",cat:"mini",desc:"تصميم ألعاب مضغوط",colors:["#f5c542","#e5e7eb","#f97316","#ef4444","#8b5cf6"],row:"miniEsports",halo:"mHex",font:"Orbitron",avs:.72},
 {id:"miniHologram",n:98,name:"Mini Hologram",cat:"mini",desc:"صور هولوغرافية صغيرة",colors:["#67e8f9","#a5f3fc","#7dd3fc","#5eead4","#c4b5fd"],row:"miniHologram",halo:"mHolo",font:"Orbitron",avs:.72},
 {id:"miniPremium",n:99,name:"Mini Premium",cat:"mini",desc:"بطاقات فاخرة صغيرة أسود وذهبي",colors:["#f5c542","#d6c08a","#c9a227","#b8962e","#a3832a"],row:"miniPremium",halo:"mPrem",font:"Changa",avs:.72},
 {id:"b6o6UltimateMini",n:100,name:"B6O6 Ultimate Mini",cat:"mini",desc:"تصميم حصري صغير للمنصة",colors:["#2f7bff","#c0c7d4","#7fb2ff","#1d4ed8","#94a3b8"],row:"b6o6UltimateMini",halo:"mB6",font:"Changa",avs:.72},
];
export const lbDesignOf=id=>LB_DESIGNS.find(d=>d.id===id)||LB_DESIGNS[0];
const LB_CROWN='<svg viewBox="0 0 64 44"><path fill="currentColor" d="M3 38 7 9l14 15L32 2l11 22L57 9l4 29z"/><rect x="5" y="38" width="54" height="6" rx="2" fill="currentColor"/></svg>';
const LB_WING='<svg viewBox="0 0 60 40"><path fill="currentColor" d="M58 22C48 6 26 0 2 2c10 4 17 7 22 11-8-1-15 0-21 3 9 1 16 3 21 6-6 0-12 1-17 4 15 1 33 0 51-4z"/></svg>';
const LB_BOLT='<svg viewBox="0 0 12 20"><path fill="currentColor" d="M7 0 0 11h5l-2 9 9-12H7z"/></svg>';
const LB_GEM='<svg viewBox="0 0 20 20"><path fill="currentColor" d="M10 0 20 7 10 20 0 7z"/><path fill="#fff" opacity=".55" d="M10 0 13 7H7z"/><path fill="#000" opacity=".18" d="M10 20 20 7h-7z"/></svg>';
const LB_STAR='<svg viewBox="0 0 20 20"><path fill="currentColor" d="M10 0l2.2 7.8L20 10l-7.8 2.2L10 20l-2.2-7.8L0 10l7.8-2.2z"/></svg>';
/** زخارف الهالة (عناصر خفيفة: SVG صغير + spans) */
export function haloHTML(kind){
 const st=n=>Array.from({length:n},(_,i)=>`<i class="st s${i}">${LB_STAR}</i>`).join("");
 switch(kind){
  case "cloud": return `<i class="cl c0"></i><i class="cl c1"></i><i class="cl c2"></i><i class="cl c3"></i>`;
  case "angel": return `<i class="glow"></i><i class="wn l">${LB_WING}</i><i class="wn r">${LB_WING}</i>`;
  case "goldRings": return `<i class="ring r1"></i><i class="ring r2"></i>`;
  case "diamond": return `<i class="ring"></i>${st(4)}`;
  case "galaxy": return `<i class="gx"></i>${st(3)}`;
  case "moon": return `<i class="moon"></i>${st(3)}`;
  case "rose": return `<i class="aura"></i>${Array.from({length:5},(_,i)=>`<i class="pt p${i}"></i>`).join("")}`;
  case "energy": return `<i class="rp r1"></i><i class="rp r2"></i><i class="rp r3"></i>`;
  case "rainbow": return `<i class="rb"></i>`;
  case "royal": return `<i class="frame"></i><i class="mini-crw">${LB_CROWN}</i>`;
  case "ice": return `<i class="ring"></i>${st(5)}`;
  case "fire": return `<i class="fl f1"></i><i class="fl f2"></i><i class="emb"></i>`;
  case "electric": return `<i class="ring e1"></i><i class="ring e2"></i>${Array.from({length:4},(_,i)=>`<i class="bolt b${i}">${LB_BOLT}</i>`).join("")}`;
  case "pearl": return `<i class="pr"></i>`;
  case "b6o6": return `<i class="ring o1"></i><i class="ring o2"></i><i class="glow"></i>`;
  case "cloudSeat": return `<i class="cl c0"></i><i class="cl c1"></i><i class="cl c2"></i>`;
  case "heaven": return `<i class="cl c0"></i><i class="cl c1"></i>${st(4)}`;
  case "cloud9": return `<i class="bub"></i><i class="cl c0"></i><i class="cl c1"></i><i class="cl c2"></i><i class="cl c3"></i>`;
  case "moonBack": return `<i class="moon"></i>${st(3)}`;
  case "starOrbit": return `<i class="orb">${st(5)}</i>`;
  case "cotton": return `<i class="cl c0"></i><i class="cl c1"></i><i class="cl c2"></i><i class="cl c3"></i>`;
  case "wings1": return `<i class="glow"></i><i class="wn l">${LB_WING}</i><i class="wn r">${LB_WING}</i>`;
  case "floatStars": return `<i class="sh"></i>${st(4)}`;
  case "crystalCloud": return `<i class="cl c0"></i><i class="cl c1"></i><i class="cl c2"></i>${st(2)}`;
  case "kingRays": return `<i class="rays"></i><i class="ring"></i>`;
  case "throne": return `<i class="back"></i><i class="arm l"></i><i class="arm r"></i>`;
  case "ornate": return `<i class="orn"></i><i class="ring"></i>`;
  case "gemOrbit": return `<i class="ring"></i><i class="orb">${Array.from({length:6},(_,i)=>`<i class="gm g${i}">${LB_GEM}</i>`).join("")}</i>`;
  case "goldThin": return `<i class="ring"></i>`;
  case "chrome": return `<i class="ring"></i>`;
  case "gems": return `<i class="ring"></i>${Array.from({length:4},(_,i)=>`<i class="gm g${i}">${LB_GEM}</i>`).join("")}`;
  case "platCrown": return `<i class="ring"></i><i class="pc">${LB_CROWN}</i>`;
  case "goldWings": return `<i class="wn l">${LB_WING}</i><i class="wn r">${LB_WING}</i>`;
  case "medal": return `<i class="rib l"></i><i class="rib r"></i><i class="ring"></i>`;
  case "glassRing": return `<i class="ring"></i>`;
  case "castle": return `<i class="ring"></i><i class="gm top">${LB_GEM}</i>`;
  case "b6royal": return `<i class="ring o1"></i><i class="ring o2"></i><i class="bc">${LB_CROWN}</i>`;
 case "neonDouble": return `<i class="ring n1"></i><i class="ring n2"></i>`;
  case "circuit": return `<i class="tick"></i><i class="arc"></i>`;
  case "rgbRing": return `<i class="rb"></i><i class="gl"></i>`;
  case "brackets": return `<i class="bk tl"></i><i class="bk tr"></i><i class="bk bl"></i><i class="bk br"></i><i class="aim"></i>`;
  case "hex": return `<i class="hx"></i>`;
  case "glitch": return `<i class="ring y"></i><i class="ring m"></i><i class="ring c"></i>`;
  case "pulse": return `<i class="rp r1"></i><i class="rp r2"></i><i class="ecg"></i>`;
  case "holo": return `<i class="base"></i><i class="beam"></i><i class="scan"></i>`;
  case "storm": return `<i class="cloud"></i><i class="ring"></i>${Array.from({length:6},(_,i)=>`<i class="bolt b${i}">${LB_BOLT}</i>`).join("")}`;
  case "techOrbit": return `<i class="ob o1"><i></i></i><i class="ob o2"><i></i></i><i class="ob o3"><i></i></i>`;
  case "triangle": return `<i class="tri t1"></i><i class="tri t2"></i>`;
  case "laser": return `<i class="lz"></i>`;
  case "matrix": return `<i class="ring"></i><i class="mx"></i>`;
  case "rgbThin": return `<i class="rb"></i>`;
  case "b6hex": return `<i class="hx"></i><i class="hx h2"></i>`;
 case "liquid": return `<i class="blob"></i><i class="blob b2"></i>`;
  case "frost": return `<i class="ring"></i><i class="glow"></i>`;
  case "rhombus": return `<i class="rmb"></i><i class="rmb r2"></i>`;
  case "bubble": return `<i class="bb"></i><i class="hl"></i><i class="mb m0"></i><i class="mb m1"></i><i class="mb m2"></i>`;
  case "shards": return `<i class="orb">${Array.from({length:5},(_,i)=>`<i class="sd d${i}"></i>`).join("")}</i>`;
  case "chromeSpin": return `<i class="ring"></i>`;
  case "reflect": return `<i class="ring"></i><i class="rf"></i>`;
  case "icicle": return `<i class="ring"></i>${Array.from({length:5},(_,i)=>`<i class="icl i${i}"></i>`).join("")}`;
  case "pearls": return `<i class="orb">${Array.from({length:8},(_,i)=>`<i class="pl p${i}"></i>`).join("")}</i><i class="ring"></i>`;
  case "iris": return `<i class="ir"></i>`;
  case "prism": return `<i class="beam"></i><i class="ring"></i>`;
  case "dust": return `${Array.from({length:8},(_,i)=>`<i class="ds d${i}"></i>`).join("")}<i class="ring"></i>`;
  case "glassWings": return `<i class="wn l">${LB_WING}</i><i class="wn r">${LB_WING}</i><i class="ring"></i>`;
  case "crystalCrown": return `<i class="ring"></i><i class="cc">${LB_CROWN}</i>`;
  case "b6crystal": return `<i class="ring"></i><i class="orb">${Array.from({length:3},(_,i)=>`<i class="sd d${i}"></i>`).join("")}</i>`;

  case "float3d": return `<i class="ring"></i><i class="sh"></i>`;
  case "rot3d": return `<i class="r3 a"></i><i class="r3 b"></i>`;
  case "diamond3d": return `<i class="ring"></i><i class="dm">${LB_GEM}</i>`;
  case "crown3d": return `<i class="ring"></i>`;
  case "glassRing3d": return `<i class="ring"></i><i class="sh"></i>`;
  case "orbit3d": return `<i class="o3 a"><i></i></i><i class="o3 b"><i></i></i><i class="o3 c"><i></i></i>`;
  case "gyro": return `<i class="gy a"></i><i class="gy b"></i><i class="gy c"></i>`;
  case "frame3d": return `<i class="fr"></i>`;
  case "coin": return `<i class="cn"></i><i class="rib l"></i><i class="rib r"></i>`;
  case "holo3d": return `<i class="base"></i><i class="hr a"></i><i class="hr b"></i><i class="scan"></i>`;
  case "cube": return `<i class="cb"><i class="f1"></i><i class="f2"></i><i class="f3"></i><i class="f4"></i><i class="f5"></i><i class="f6"></i></i>`;
  case "floatCrown": return `<i class="ring"></i><i class="fc">${LB_CROWN}</i><i class="fs"></i>`;
  case "sphere": return `<i class="sp"></i><i class="gy a"></i><i class="gy b"></i>`;
  case "pglass": return `<i class="ring"></i>`;
  case "b6gyro": return `<i class="gy a"></i><i class="gy b"></i><i class="ring"></i>`;
  case "mPink": case "mRing": case "mNeon": case "mPlain": case "mHolo": case "mPrem": case "mB6": case "mRoyal": return `<i class="ring"></i>`;
  case "mCrown": return `<i class="ring"></i>`;
  case "mGem": return `<i class="ring"></i><i class="gm g0">${LB_GEM}</i><i class="gm g1">${LB_GEM}</i>`;
  case "mCloud": return `<i class="cl c0"></i><i class="cl c1"></i>`;
  case "mHex": return `<i class="hx"></i>`;
 case "fantasy": return `<i class="cl c0"></i><i class="cl c1"></i><i class="cl c2"></i><i class="spark"></i>${st(3)}`;
 }
 return "";
}
/** CSS التصاميم — يُحقن مرة واحدة. كل الحركات transform/opacity لتكون خفيفة في OBS */
export function lbDesignCSS(){
 const P=s=>s.split("\n").join("");
 return P(`
.lbw .halo .st{position:absolute;width:16%;color:#fff;filter:drop-shadow(0 0 4px #fff);animation:lb-twinkle 2.4s ease-in-out infinite}
.lbw .halo .s0{top:-14%;right:2%}.lbw .halo .s1{bottom:-8%;left:-8%;animation-delay:-.7s;width:12%}.lbw .halo .s2{top:38%;right:-20%;animation-delay:-1.3s;width:11%}.lbw .halo .s3{top:-10%;left:4%;animation-delay:-1.8s;width:10%}.lbw .halo .s4{bottom:-12%;right:18%;animation-delay:-.4s;width:9%}
.lbw .halo .cl{position:absolute;border-radius:50%;animation:lb-drift 6s ease-in-out infinite}
.lbd-pinkCloud .lr-card{border-radius:999px;background:linear-gradient(90deg,color-mix(in srgb,var(--rc) 70%,#6d28d9),color-mix(in srgb,#6d28d9 60%,transparent));box-shadow:0 0 0 1.5px color-mix(in srgb,var(--rc) 70%,#fff),0 calc(var(--rh)*.08) calc(var(--rh)*.3) #6d28d955}
.lbd-pinkCloud .halo .cl{position:absolute;border-radius:50%;background:radial-gradient(circle,#ffd1f0 0,#ff8fd8aa 45%,transparent 70%);filter:blur(calc(var(--av)*.04));animation:lb-drift 6s ease-in-out infinite}
.lbd-pinkCloud .halo .c0{width:70%;height:55%;left:-28%;top:5%}.lbd-pinkCloud .halo .c1{width:75%;height:58%;right:-30%;top:15%;animation-delay:-2s}.lbd-pinkCloud .halo .c2{width:85%;height:50%;left:8%;bottom:-24%;animation-delay:-4s}.lbd-pinkCloud .halo .c3{width:60%;height:45%;left:20%;top:-22%;animation-delay:-1s}
@keyframes lb-drift{50%{transform:translate(6%,-5%) scale(1.06)}}
.lbd-pinkCloud .lr-nm{color:#fff;text-shadow:0 2px 6px #6d28d9}.lbd-pinkCloud .lr-vl{color:#ffe4f6}
.lbd-whiteAngel .lr-card{border-radius:calc(var(--rh)*.3);background:linear-gradient(90deg,#ffffff38,#ffffff12);border:1px solid #ffffff70;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
.lbd-whiteAngel .r1 .lr-card{background:linear-gradient(90deg,#fff7d6aa,#ffffff22);border-color:#fff}
.lbd-whiteAngel .halo .glow{position:absolute;inset:-14%;border-radius:50%;background:radial-gradient(circle,#ffffffcc 40%,#ffffff00 70%);animation:lb-breath 3.2s ease-in-out infinite}
.lbd-whiteAngel .halo .wn{position:absolute;top:18%;width:62%;color:#fff;filter:drop-shadow(0 0 6px #fff);animation:lb-flap 2.6s ease-in-out infinite}
.lbd-whiteAngel .halo .wn.l{left:-46%;transform-origin:100% 50%}.lbd-whiteAngel .halo .wn.r{right:-46%;transform:scaleX(-1);transform-origin:50% 50%;animation-name:lb-flap2}
.lbd-whiteAngel .halo .wn svg,.lbd-royalCrown .mini-crw svg{width:100%;height:auto;display:block}
@keyframes lb-flap{50%{transform:rotate(-8deg)}}@keyframes lb-flap2{50%{transform:scaleX(-1) rotate(-8deg)}}@keyframes lb-breath{50%{opacity:.6;transform:scale(1.06)}}
.lbd-whiteAngel .lr-nm{color:#fff;text-shadow:0 1px 4px #0009}.lbd-whiteAngel .lr-vl{color:#fff}
.lbd-goldenHalo .lr-card{border-radius:calc(var(--rh)*.12);background:linear-gradient(90deg,#0b0805d9,#1a1206b0);border-inline-start:calc(var(--rh)*.06) solid var(--rc);box-shadow:inset 0 -1px 0 color-mix(in srgb,var(--rc) 60%,transparent)}
.lbd-goldenHalo .halo .ring{position:absolute;border-radius:50%;border:calc(var(--av)*.035) solid transparent;border-top-color:var(--rc);border-bottom-color:color-mix(in srgb,var(--rc) 50%,transparent);animation:lb-spin 3.5s linear infinite}
.lbd-goldenHalo .halo .r1{inset:-9%}.lbd-goldenHalo .halo .r2{inset:-17%;animation-duration:6s;animation-direction:reverse;border-top-color:transparent;border-left-color:var(--rc);opacity:.75}
@keyframes lb-spin{to{transform:rotate(360deg)}}
.lbd-goldenHalo .lr-nm{color:#fff3d1}.lbd-goldenHalo .lr-vl{color:var(--rc)}
.lbd-diamondRing .lr-card{clip-path:polygon(3% 0,97% 0,100% 50%,97% 100%,3% 100%,0 50%);background:linear-gradient(115deg,color-mix(in srgb,var(--rc) 45%,#0b1630) 0%,#0b1630d9 55%,color-mix(in srgb,var(--rc) 30%,#0b1630) 100%)}
.lbd-diamondRing .halo .ring{position:absolute;inset:-8%;border-radius:50%;background:conic-gradient(from 0deg,#fff,var(--rc),#c4b5fd,#fff,var(--rc),#a5f3fc,#fff);-webkit-mask:radial-gradient(circle,transparent 63%,#000 64%);mask:radial-gradient(circle,transparent 63%,#000 64%);animation:lb-spin 8s linear infinite}
.lbd-diamondRing .halo .st,.lbd-purpleGalaxy .halo .st,.lbd-crystalMoon .halo .st{position:absolute;width:20%;color:#fff;filter:drop-shadow(0 0 4px #fff);animation:lb-twinkle 2.4s ease-in-out infinite}
.lbd-diamondRing .halo .s0{top:-12%;right:4%}.lbd-diamondRing .halo .s1{bottom:-6%;left:-6%;animation-delay:-.6s}.lbd-diamondRing .halo .s2{top:40%;right:-18%;animation-delay:-1.2s;width:14%}.lbd-diamondRing .halo .s3{top:-8%;left:2%;animation-delay:-1.8s;width:12%}
@keyframes lb-twinkle{0%,100%{transform:scale(.4) rotate(0);opacity:.2}50%{transform:scale(1) rotate(45deg);opacity:1}}
.lbd-diamondRing .lr-nm{color:#e0f7ff}.lbd-diamondRing .lr-vl{color:#a5f3fc}
.lbd-purpleGalaxy .lr-card{border-radius:calc(var(--rh)*.5) calc(var(--rh)*.15) calc(var(--rh)*.15) calc(var(--rh)*.5);background:radial-gradient(1px 1px at 20% 30%,#fff,transparent),radial-gradient(1px 1px at 60% 70%,#fff,transparent),radial-gradient(1.5px 1.5px at 85% 25%,#e9d5ff,transparent),linear-gradient(90deg,color-mix(in srgb,var(--rc) 60%,#1e1b4b),#0f0a24d0)}
.lbd-purpleGalaxy .halo .gx{position:absolute;inset:-26%;border-radius:50%;background:repeating-conic-gradient(from 0deg,#c084fc66 0 8%,transparent 8% 16%,#818cf866 16% 22%,transparent 22% 30%);-webkit-mask:radial-gradient(circle,transparent 38%,#000 40%,#000 62%,transparent 72%);mask:radial-gradient(circle,transparent 38%,#000 40%,#000 62%,transparent 72%);filter:blur(1px);animation:lb-spin 9s linear infinite}
.lbd-purpleGalaxy .halo .s0{top:-20%;left:40%;width:14%}.lbd-purpleGalaxy .halo .s1{bottom:-18%;right:10%;animation-delay:-1s;width:12%}.lbd-purpleGalaxy .halo .s2{top:30%;left:-24%;animation-delay:-1.7s;width:10%}
.lbd-purpleGalaxy .lr-nm{color:#f5f3ff}.lbd-purpleGalaxy .lr-vl{color:#e9d5ff}
.lbd-crystalMoon .lr-card{border-radius:calc(var(--rh)*.25);background:linear-gradient(90deg,#e2e8f033,#94a3b81a);border:1px solid #e2e8f066;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.lbd-crystalMoon .halo .moon{position:absolute;inset:-16%;border-radius:50%;background:radial-gradient(circle at 70% 40%,transparent 52%,#f8fafc 53%,#cbd5e1 62%,transparent 64%);filter:drop-shadow(0 0 6px #e2e8f0);animation:lb-rock 5s ease-in-out infinite}
@keyframes lb-rock{50%{transform:rotate(14deg)}}
.lbd-crystalMoon .halo .s0{top:-14%;left:-4%;width:14%}.lbd-crystalMoon .halo .s1{bottom:-10%;left:-14%;width:10%;animation-delay:-.8s}.lbd-crystalMoon .halo .s2{top:-22%;right:30%;width:9%;animation-delay:-1.6s}
.lbd-crystalMoon .lr-nm{color:#f8fafc}.lbd-crystalMoon .lr-vl{color:#e0e7ff}
.lbd-roseAura .lr-card{border-radius:calc(var(--rh)*.5) 6px calc(var(--rh)*.5) 6px;background:linear-gradient(90deg,color-mix(in srgb,var(--rc) 75%,#4c0519),#4c0519b8)}
.lbd-roseAura .halo .aura{position:absolute;inset:-18%;border-radius:50%;background:radial-gradient(circle,color-mix(in srgb,var(--rc) 70%,transparent) 45%,transparent 70%);animation:lb-breath 2.8s ease-in-out infinite}
.lbd-roseAura .halo .pt{position:absolute;width:16%;height:10%;border-radius:100% 0;background:linear-gradient(135deg,#ffe4e6,#fb7185);animation:lb-petal 5s linear infinite;opacity:0}
.lbd-roseAura .halo .p0{left:10%;animation-delay:0s}.lbd-roseAura .halo .p1{left:60%;animation-delay:-1s}.lbd-roseAura .halo .p2{left:85%;animation-delay:-2s}.lbd-roseAura .halo .p3{left:30%;animation-delay:-3s}.lbd-roseAura .halo .p4{left:-10%;animation-delay:-4s}
@keyframes lb-petal{0%{top:-25%;opacity:0;transform:rotate(0)}15%{opacity:1}100%{top:110%;opacity:0;transform:rotate(220deg) translateX(30%)}}
.lbd-roseAura .lr-nm{color:#fff1f2}.lbd-roseAura .lr-vl{color:#ffe4e6}
.lbd-blueEnergy .lr-card{border-radius:calc(var(--rh)*.18);background:linear-gradient(90deg,#03123ad9,#0a2a7aa8);border:1px solid color-mix(in srgb,var(--rc) 70%,transparent);box-shadow:0 0 calc(var(--rh)*.2) color-mix(in srgb,var(--rc) 45%,transparent)}
.lbd-blueEnergy .lr-card::after{content:"";position:absolute;bottom:0;height:2px;width:30%;background:linear-gradient(90deg,transparent,var(--rc),#fff,transparent);animation:lb-line 2.4s linear infinite}
@keyframes lb-line{from{left:100%}to{left:-30%}}
.lbd-blueEnergy .halo .rp{position:absolute;inset:-4%;border-radius:50%;border:calc(var(--av)*.03) solid var(--rc);animation:lb-ripple 2.4s ease-out infinite;opacity:0}
.lbd-blueEnergy .halo .r2{animation-delay:-.8s}.lbd-blueEnergy .halo .r3{animation-delay:-1.6s}
@keyframes lb-ripple{0%{transform:scale(.95);opacity:.9}100%{transform:scale(1.45);opacity:0}}
.lbd-blueEnergy .lr-nm{color:#e0f2fe}.lbd-blueEnergy .lr-vl{color:var(--rc);font-family:"Orbitron",monospace}
.lbd-rainbowHalo .lr-card{border-radius:calc(var(--rh)*.22);background:linear-gradient(90deg,#0b0f17cc,#0b0f1788);border-inline-start:calc(var(--rh)*.05) solid var(--rc);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.lbd-rainbowHalo .halo .rb{position:absolute;inset:-12%;border-radius:50%;background:conic-gradient(#ff004c,#ffcc00,#00ff88,#00c3ff,#a100ff,#ff004c);-webkit-mask:radial-gradient(circle,transparent 66%,#000 68%);mask:radial-gradient(circle,transparent 66%,#000 68%);filter:blur(1.5px) saturate(1.2);animation:lb-spin 7s linear infinite}
.lbd-rainbowHalo .lr-nm{color:#fff}.lbd-rainbowHalo .lr-vl{color:var(--rc)}
.lbd-royalCrown .lr-card{border-radius:calc(var(--rh)*.14);border:calc(var(--rh)*.04) solid transparent;background:linear-gradient(90deg,#2a0f3ae6,#12061bd0) padding-box,linear-gradient(135deg,#fff1c1,#b8862b 35%,#f9e29c 55%,#7a5512) border-box}
.lbd-royalCrown .halo .frame{position:absolute;inset:-9%;border-radius:50%;border:calc(var(--av)*.05) double #e8c46a;box-shadow:0 0 calc(var(--av)*.15) #e8c46a88}
.lbd-royalCrown .halo .mini-crw{position:absolute;top:-38%;left:28%;width:44%;color:var(--rc);filter:drop-shadow(0 2px 3px #000a);animation:lb-bob 3s ease-in-out infinite}
.lbd-royalCrown .r1 .halo .mini-crw{display:none}
@keyframes lb-bob{50%{transform:translateY(-8%)}}
.lbd-royalCrown .lr-nm{color:#fff3d1}.lbd-royalCrown .lr-vl{color:#ffe39a}
.lbd-iceCircle .lr-card{border-radius:calc(var(--rh)*.08);background:linear-gradient(100deg,#e0f2fe40,#0c4a6e99 40%,#082f49cc);border:1px solid #bae6fdaa;box-shadow:inset 0 0 calc(var(--rh)*.3) #bae6fd33}
.lbd-iceCircle .halo .ring{position:absolute;inset:-9%;border-radius:50%;background:conic-gradient(from 30deg,#fff,#7dd3fc,#e0f2fe,#38bdf8,#fff,#a5b4fc,#fff);-webkit-mask:radial-gradient(circle,transparent 63%,#000 65%);mask:radial-gradient(circle,transparent 63%,#000 65%);animation:lb-spin 12s linear infinite;filter:drop-shadow(0 0 6px #7dd3fc)}
.lbd-iceCircle .halo .st{color:#e0f2fe;filter:drop-shadow(0 0 5px #38bdf8)}
.lbd-iceCircle .lr-nm{color:#f0f9ff}.lbd-iceCircle .lr-vl{color:#bae6fd}
.lbd-fireCircle .lr-card{border-radius:calc(var(--rh)*.16);background:linear-gradient(90deg,#1c0a03e6,#3b0d05cc);box-shadow:inset 0 calc(var(--rh)*-.06) 0 var(--rc),0 0 calc(var(--rh)*.25) #f9731655}
.lbd-fireCircle .halo .fl{position:absolute;inset:-14%;border-radius:50%;background:conic-gradient(#ef4444,#f97316,#fde047,#f97316,#ef4444,#f97316,#fbbf24,#ef4444);-webkit-mask:radial-gradient(circle,transparent 58%,#000 64%,transparent 72%);mask:radial-gradient(circle,transparent 58%,#000 64%,transparent 72%);filter:blur(2px);animation:lb-spin 4s linear infinite,lb-flick 1.2s ease-in-out infinite}
.lbd-fireCircle .halo .f2{inset:-20%;opacity:.55;animation-duration:6s,1.6s;animation-direction:reverse,normal}
.lbd-fireCircle .halo .emb{position:absolute;inset:-30%;border-radius:50%;background:radial-gradient(circle,#f9731655 35%,transparent 65%);z-index:0!important}
@keyframes lb-flick{50%{transform:scale(1.05);opacity:.8}}
.lbd-fireCircle .lr-nm{color:#fff7ed}.lbd-fireCircle .lr-vl{color:#fdba74}
.lbd-electricAura .lr-card{clip-path:polygon(0 0,96% 0,100% 30%,100% 100%,4% 100%,0 70%);background:linear-gradient(90deg,#0b1020e6,#111a3acc);border-bottom:2px solid var(--rc)}
.lbd-electricAura .halo .ring{position:absolute;border-radius:50%;border:calc(var(--av)*.03) dashed var(--rc);animation:lb-spin 3s linear infinite,lb-zap 1.6s steps(2) infinite}
.lbd-electricAura .halo .e1{inset:-8%}.lbd-electricAura .halo .e2{inset:-16%;animation-direction:reverse;border-style:dotted;opacity:.7}
.lbd-electricAura .halo .bolt{position:absolute;width:16%;color:var(--rc);filter:drop-shadow(0 0 4px var(--rc));animation:lb-zap 1.1s steps(2) infinite}
.lbd-electricAura .halo .b0{top:-18%;left:40%}.lbd-electricAura .halo .b1{bottom:-16%;left:10%;animation-delay:-.3s}.lbd-electricAura .halo .b2{top:30%;right:-22%;animation-delay:-.6s}.lbd-electricAura .halo .b3{top:30%;left:-22%;animation-delay:-.9s}
@keyframes lb-zap{0%{opacity:1}50%{opacity:.25}}
.lbd-electricAura .lr-nm{color:#f8fafc}.lbd-electricAura .lr-vl{color:var(--rc);font-family:"Orbitron",monospace}
.lbd-pearlRing .lr-card{border-radius:999px;background:linear-gradient(180deg,#fffaf3,#ece3d6);box-shadow:0 calc(var(--rh)*.06) calc(var(--rh)*.25) #0006,inset 0 2px 0 #fff}
.lbd-pearlRing .halo .pr{position:absolute;inset:-12%;border-radius:50%;background:repeating-conic-gradient(from 0deg,#fff 0 4%,#e7dccb 4% 5%,transparent 5% 8.33%);-webkit-mask:radial-gradient(circle,transparent 62%,#000 64%,#000 74%,transparent 76%);mask:radial-gradient(circle,transparent 62%,#000 64%,#000 74%,transparent 76%);filter:drop-shadow(0 0 3px #fff);animation:lb-spin 16s linear infinite}
.lbd-pearlRing .lr-nm{color:#3b2f22;text-shadow:none}.lbd-pearlRing .lr-vl{color:#7a5a3a}
.lbd-b6o6Halo .lr-card{border-radius:calc(var(--rh)*.14);border:1px solid transparent;background:linear-gradient(90deg,#000000ee,#071433d8) padding-box,linear-gradient(90deg,#c0c7d4,#2f7bff 50%,#c0c7d4) border-box;box-shadow:0 0 calc(var(--rh)*.25) #2f7bff44}
.lbd-b6o6Halo .halo .ring{position:absolute;border-radius:50%}
.lbd-b6o6Halo .halo .o1{inset:-8%;background:conic-gradient(from 0deg,#2f7bff,#c0c7d4,#fff,#2f7bff 40%,transparent 60%,#2f7bff);-webkit-mask:radial-gradient(circle,transparent 64%,#000 66%);mask:radial-gradient(circle,transparent 64%,#000 66%);animation:lb-spin 3.5s linear infinite}
.lbd-b6o6Halo .halo .o2{inset:-17%;border:1px solid #c0c7d488;border-top-color:#fff;animation:lb-spin 7s linear infinite reverse}
.lbd-b6o6Halo .halo .glow{position:absolute;inset:-22%;border-radius:50%;background:radial-gradient(circle,#2f7bff55 40%,transparent 70%);z-index:0!important;animation:lb-breath 3s ease-in-out infinite}
.lbd-b6o6Halo .lr-nm{background:linear-gradient(180deg,#fff,#aeb8c8);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:none}.lbd-b6o6Halo .lr-vl{color:#7fb2ff}
.lbd-dreamClouds .lr-card{border-radius:calc(var(--rh)*.5);background:radial-gradient(circle at 15% 120%,#ffffff55 0 25%,transparent 26%),radial-gradient(circle at 40% 130%,#ffffff40 0 22%,transparent 23%),linear-gradient(90deg,color-mix(in srgb,var(--rc) 70%,#1e3a8a),#1e3a8aaa)}
.lbd-dreamClouds .halo .cl{background:radial-gradient(circle at 50% 40%,#fff 0,#e0e7ff 55%,#c7d2fe00 72%)}
.lbd-dreamClouds .halo .c0{width:64%;height:34%;left:-22%;bottom:-8%}.lbd-dreamClouds .halo .c1{width:70%;height:30%;left:15%;bottom:-8%;animation-delay:-2s;z-index:3!important}.lbd-dreamClouds .halo .c2{width:58%;height:32%;right:-22%;bottom:-6%;animation-delay:-4s}
.lbd-dreamClouds .lr-nm{color:#fff;text-shadow:0 1px 4px #1e3a8a}.lbd-dreamClouds .lr-vl{color:#fff;text-shadow:0 1px 4px #1e3a8a}
.lbd-whiteAngel .k-row .halo .wn{width:42%;top:26%}.lbd-whiteAngel .k-row .halo .wn.l{left:-30%}.lbd-whiteAngel .k-row .halo .wn.r{right:-30%}
.lbd-pinkHeaven .lr-card{border-radius:999px;background:radial-gradient(1.5px 1.5px at 30% 30%,#fff,transparent),radial-gradient(1.5px 1.5px at 70% 60%,#fff,transparent),radial-gradient(1px 1px at 50% 80%,#fff,transparent),linear-gradient(90deg,color-mix(in srgb,var(--rc) 85%,#fff),#be185dbb)}
.lbd-pinkHeaven .halo .cl{background:radial-gradient(circle,#fff 0,#fbcfe8 50%,#f9a8d400 72%)}
.lbd-pinkHeaven .halo .c0{width:80%;height:46%;left:-34%;bottom:-6%}.lbd-pinkHeaven .halo .c1{width:80%;height:46%;right:-34%;bottom:-2%;animation-delay:-3s}
.lbd-pinkHeaven .lr-nm{color:#fff;text-shadow:0 1px 4px #9d174d}.lbd-pinkHeaven .lr-vl{color:#fff}
.lbd-cloudNine .lr-card{border-radius:calc(var(--rh)*.4);background:linear-gradient(180deg,#ffffffee,#e0e7ffdd);box-shadow:0 0 calc(var(--rh)*.3) #ffffffaa,0 calc(var(--rh)*.06) calc(var(--rh)*.2) #1e3a8a55}
.lbd-cloudNine .halo .bub{position:absolute;inset:-22%;border-radius:50%;background:radial-gradient(circle,#ffffffee 45%,#ffffff00 70%);z-index:0!important;animation:lb-breath 4s ease-in-out infinite}
.lbd-cloudNine .halo .cl{background:radial-gradient(circle,#fff 40%,#fff0 70%);width:42%;height:42%}
.lbd-cloudNine .halo .c0{left:-26%;top:20%}.lbd-cloudNine .halo .c1{right:-26%;top:28%;animation-delay:-1.5s}.lbd-cloudNine .halo .c2{left:4%;bottom:-24%;animation-delay:-3s}.lbd-cloudNine .halo .c3{right:6%;bottom:-22%;animation-delay:-4.5s}
.lbd-cloudNine .lr-nm{color:#1e1b4b;text-shadow:none}.lbd-cloudNine .lr-vl{color:#3730a3}
.lbd-moonlightDream .lr-card{border-radius:calc(var(--rh)*.22);background:radial-gradient(circle at 90% 50%,#fde68a33,transparent 40%),linear-gradient(90deg,#0b1240f0,#1e1b4bc8)}
.lbd-moonlightDream .halo .moon{position:absolute;inset:-34%;z-index:0!important;border-radius:50%;background:radial-gradient(circle at 34% 38%,transparent 47%,#fef3c7 48%,#fde68a 60%,transparent 62%);filter:drop-shadow(0 0 10px #fde68a);animation:lb-rock 6s ease-in-out infinite}
.lbd-moonlightDream .halo .st{color:#fef9c3}
.lbd-moonlightDream .lr-nm{color:#fefce8}.lbd-moonlightDream .lr-vl{color:#fde68a}
.lbd-starGarden .lr-card{border-radius:calc(var(--rh)*.5) calc(var(--rh)*.5) calc(var(--rh)*.2) calc(var(--rh)*.2);background:radial-gradient(1px 1px at 12% 40%,#fff,transparent),radial-gradient(1px 1px at 45% 25%,#fef08a,transparent),radial-gradient(1.5px 1.5px at 78% 65%,#fff,transparent),linear-gradient(90deg,#022c22e8,#0f172acc)}
.lbd-starGarden .halo .orb{position:absolute;inset:-26%;animation:lb-spin 7s linear infinite}
.lbd-starGarden .halo .orb .st{color:var(--rc);filter:drop-shadow(0 0 4px var(--rc))}
.lbd-starGarden .lr-nm{color:#ecfdf5}.lbd-starGarden .lr-vl{color:var(--rc)}
.lbd-cottonCandy .lr-card{border-radius:999px;background:linear-gradient(90deg,#f9a8d4,#c4b5fd 50%,#93c5fd);box-shadow:0 0 calc(var(--rh)*.25) #f9a8d466}
.lbd-cottonCandy .halo .cl{width:55%;height:40%}
.lbd-cottonCandy .halo .c0{background:radial-gradient(circle,#fbcfe8 40%,#fbcfe800 70%);left:-30%;top:0}.lbd-cottonCandy .halo .c1{background:radial-gradient(circle,#bae6fd 40%,#bae6fd00 70%);right:-30%;top:10%;animation-delay:-2s}.lbd-cottonCandy .halo .c2{background:radial-gradient(circle,#bae6fd 40%,#bae6fd00 70%);left:-16%;bottom:-18%;animation-delay:-3.5s}.lbd-cottonCandy .halo .c3{background:radial-gradient(circle,#fbcfe8 40%,#fbcfe800 70%);right:-14%;bottom:-20%;animation-delay:-5s}
.lbd-cottonCandy .lr-nm{color:#fff;text-shadow:0 1px 4px #7c3aedaa}.lbd-cottonCandy .lr-vl{color:#fff;text-shadow:0 1px 3px #7c3aed}
.lbd-angelWings .lr-card{border-radius:calc(var(--rh)*.3);background:linear-gradient(90deg,#fffbeb44,#ffffff14);border:1px solid #fde68a99;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.lbd-angelWings .halo .glow{position:absolute;inset:-12%;border-radius:50%;background:radial-gradient(circle,#fef3c7aa 40%,transparent 70%);animation:lb-breath 3s ease-in-out infinite}
.lbd-angelWings .halo .wn{position:absolute;top:8%;width:86%;color:#fff;filter:drop-shadow(0 0 8px #fde68a);animation:lb-flap 2.4s ease-in-out infinite}
.lbd-angelWings .halo .wn.l{left:-72%;transform-origin:100% 50%}.lbd-angelWings .halo .wn.r{right:-72%;transform:scaleX(-1);transform-origin:50% 50%;animation-name:lb-flap2}
.lbd-angelWings .halo .wn svg{width:100%;height:auto;display:block}
.lbd-angelWings .lr:not(.r1) .halo .wn{display:none}
.lbd-angelWings .lr-nm{color:#fff;text-shadow:0 1px 4px #000a}.lbd-angelWings .lr-vl{color:#fde68a}
.lbd-floatingStars .lr-card{background:linear-gradient(90deg,transparent,#00000055 30%,#00000066);border-bottom:2px solid color-mix(in srgb,var(--rc) 80%,transparent);border-radius:0}
.lbd-floatingStars .lr-av{animation:lb-float 3.4s ease-in-out infinite;animation-delay:var(--d,0s)}
@keyframes lb-float{50%{transform:translateY(-7%)}}
.lbd-floatingStars .halo .sh{position:absolute;left:10%;right:10%;bottom:-22%;height:12%;border-radius:50%;background:#0008;filter:blur(3px);z-index:0!important}
.lbd-floatingStars .halo .st{color:var(--rc);filter:drop-shadow(0 0 5px var(--rc))}
.lbd-floatingStars .lr-nm{color:#fff;text-shadow:0 2px 6px #000}.lbd-floatingStars .lr-vl{color:var(--rc);text-shadow:0 2px 6px #000}
.lbd-crystalClouds .lr-card{border-radius:calc(var(--rh)*.35);background:linear-gradient(120deg,#ffffff38,#a5f3fc18 40%,#ffffff2a 60%,#c4b5fd20);border:1px solid #e0f2fe88;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:inset 0 1px 0 #fff8}
.lbd-crystalClouds .halo .cl{background:radial-gradient(circle,#ffffff66 30%,#a5f3fc33 55%,transparent 70%);border:1px solid #ffffff55;width:46%;height:34%}
.lbd-crystalClouds .halo .c0{left:-28%;top:6%}.lbd-crystalClouds .halo .c1{right:-28%;top:26%;animation-delay:-2s}.lbd-crystalClouds .halo .c2{left:20%;bottom:-24%;animation-delay:-4s}
.lbd-crystalClouds .lr-nm{color:#f0fdff}.lbd-crystalClouds .lr-vl{color:#a5f3fc}
.lbd-purpleFantasy .lr-card{border-radius:calc(var(--rh)*.45);background:linear-gradient(90deg,#7e22ce,#c026d3 50%,#6d28d9);box-shadow:0 0 calc(var(--rh)*.3) #c026d355}
.lbd-purpleFantasy .lr-card::after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 30%,#f0abfc66 45%,#fff8 50%,#f0abfc66 55%,transparent 70%);transform:translateX(100%);animation:lb-shim 4s ease-in-out infinite;animation-delay:var(--d,0s)}
@keyframes lb-shim{0%,40%{transform:translateX(100%)}100%{transform:translateX(-100%)}}
.lbd-purpleFantasy .halo .cl{background:radial-gradient(circle,#e9d5ff 20%,#c084fc88 50%,transparent 70%);width:58%;height:42%}
.lbd-purpleFantasy .halo .c0{left:-30%;bottom:-8%}.lbd-purpleFantasy .halo .c1{right:-30%;bottom:-4%;animation-delay:-2s}.lbd-purpleFantasy .halo .c2{left:22%;top:-24%;animation-delay:-4s;width:50%;height:34%}
.lbd-purpleFantasy .halo .spark{position:absolute;inset:-10%;border-radius:50%;background:conic-gradient(from 0deg,transparent,#f0abfc,transparent 30%,transparent 50%,#c4b5fd,transparent 80%);-webkit-mask:radial-gradient(circle,transparent 64%,#000 66%);mask:radial-gradient(circle,transparent 64%,#000 66%);animation:lb-spin 5s linear infinite}
.lbd-purpleFantasy .lr-nm{color:#fff}.lbd-purpleFantasy .lr-vl{color:#fae8ff}
.lbw .halo .gm{position:absolute;width:20%;color:var(--gem,#f5c542);filter:drop-shadow(0 0 4px var(--gem,#f5c542))}
.lbd-kingSupport .lr-card{border-radius:calc(var(--rh)*.14);background:linear-gradient(90deg,#1c1404f0,#3a2a07d0);border:1px solid #f5c54299;box-shadow:inset 0 0 0 1px #00000066,0 0 calc(var(--rh)*.2) #f5c54233}
.lbd-kingSupport .halo .ring{position:absolute;inset:-6%;border-radius:50%;border:calc(var(--av)*.045) solid var(--rc);box-shadow:0 0 8px var(--rc)}
.lbd-kingSupport .halo .rays{position:absolute;inset:-60%;z-index:0!important;border-radius:50%;background:repeating-conic-gradient(#f5c54255 0 6deg,transparent 6deg 18deg);-webkit-mask:radial-gradient(circle,#000 25%,transparent 70%);mask:radial-gradient(circle,#000 25%,transparent 70%);animation:lb-spin 14s linear infinite;display:none}
.lbd-kingSupport .r1 .halo .rays{display:block}
.lbd-kingSupport .r1 .lr-av .crw{width:80%;left:10%;top:-58%}
.lbd-kingSupport .lr-nm{color:#fff7d6}.lbd-kingSupport .lr-vl{color:var(--rc)}
.lbd-royalThrone .lr-card{border-radius:calc(var(--rh)*.6) calc(var(--rh)*.6) calc(var(--rh)*.12) calc(var(--rh)*.12);background:linear-gradient(180deg,#7f1d1d,#450a0a);border:calc(var(--rh)*.05) solid #d4a537;box-shadow:inset 0 0 calc(var(--rh)*.25) #000a}
.lbd-royalThrone .k-row .lr-card{border-radius:calc(var(--rh)*.12) calc(var(--rh)*.5) calc(var(--rh)*.5) calc(var(--rh)*.12)}
.lbd-royalThrone .halo .back{position:absolute;left:-14%;right:-14%;top:-30%;bottom:-6%;z-index:0!important;border-radius:50% 50% 12% 12%/40% 40% 10% 10%;background:linear-gradient(180deg,#991b1b,#450a0a);border:calc(var(--av)*.05) solid #d4a537;box-shadow:0 0 8px #000a}
.lbd-royalThrone .halo .arm{position:absolute;bottom:-10%;width:22%;height:40%;border-radius:40% 40% 10% 10%;background:linear-gradient(180deg,#d4a537,#8a6416);z-index:3!important}
.lbd-royalThrone .halo .arm.l{left:-22%}.lbd-royalThrone .halo .arm.r{right:-22%}
.lbd-royalThrone .k-row .halo .arm{display:none}.lbd-royalThrone .k-row .halo .back{top:-6%;bottom:-6%;left:-10%;right:-10%;border-radius:50%}
.lbd-royalThrone .lr-nm{color:#fef3c7}.lbd-royalThrone .lr-vl{color:#fcd34d}
.lbd-goldenPalace .lr-card{border-radius:calc(var(--rh)*.1);background:radial-gradient(circle at 0 0,#f5c542 0 calc(var(--rh)*.12),transparent calc(var(--rh)*.13)),radial-gradient(circle at 100% 0,#f5c542 0 calc(var(--rh)*.12),transparent calc(var(--rh)*.13)),radial-gradient(circle at 0 100%,#f5c542 0 calc(var(--rh)*.12),transparent calc(var(--rh)*.13)),radial-gradient(circle at 100% 100%,#f5c542 0 calc(var(--rh)*.12),transparent calc(var(--rh)*.13)),linear-gradient(90deg,#241703f0,#3b2706d8);outline:1px solid #f5c542aa;outline-offset:calc(var(--rh)*-.08);border:calc(var(--rh)*.03) solid #b8862b}
.lbd-goldenPalace .halo .orn{position:absolute;inset:-16%;border-radius:50%;background:repeating-conic-gradient(#f5c542 0 5deg,#8a6416 5deg 10deg,transparent 10deg 15deg);-webkit-mask:radial-gradient(circle,transparent 66%,#000 68%,#000 80%,transparent 82%);mask:radial-gradient(circle,transparent 66%,#000 68%,#000 80%,transparent 82%);animation:lb-spin 24s linear infinite}
.lbd-goldenPalace .halo .ring{position:absolute;inset:-5%;border-radius:50%;border:calc(var(--av)*.04) solid #f5c542;box-shadow:0 0 6px #f5c54299}
.lbd-goldenPalace .lr-nm{color:#fff3d1}.lbd-goldenPalace .lr-vl{color:#f5c542}
.lbd-diamondEmperor .lr-card{border-radius:calc(var(--rh)*.18);background:linear-gradient(110deg,#0f172af0,#1e293bd0 60%,#334155c0);border:1px solid #a5f3fc66}
.lbd-diamondEmperor .halo .ring{position:absolute;inset:-6%;border-radius:50%;border:calc(var(--av)*.035) solid #e0f2fe;box-shadow:0 0 8px #a5f3fc}
.lbd-diamondEmperor .halo .orb{position:absolute;inset:-34%;animation:lb-spin 8s linear infinite;display:none}
.lbd-diamondEmperor .r1 .halo .orb{display:block}
.lbd-diamondEmperor .halo .orb .gm{--gem:#a5f3fc;width:16%;margin:-8%}
.lbd-diamondEmperor .halo .g0{top:8%;left:50%}.lbd-diamondEmperor .halo .g1{top:29%;left:87%}.lbd-diamondEmperor .halo .g2{top:71%;left:87%}.lbd-diamondEmperor .halo .g3{top:92%;left:50%}.lbd-diamondEmperor .halo .g4{top:71%;left:13%}.lbd-diamondEmperor .halo .g5{top:29%;left:13%}
.lbd-diamondEmperor .lr-nm{color:#f0f9ff}.lbd-diamondEmperor .lr-vl{color:#a5f3fc}
.lbd-luxuryBlackGold .lr-card{border-radius:2px;background:linear-gradient(90deg,#000000f2,#0d0d0de0);border-top:1px solid #d6b55e;border-bottom:1px solid #d6b55e}
.lbd-luxuryBlackGold .lr-card .swp i{background:linear-gradient(90deg,transparent,#ffffffcc,transparent);width:18%}
.lbd-luxuryBlackGold .halo .ring{position:absolute;inset:-7%;border-radius:50%;border:1.5px solid #d6b55e;box-shadow:0 0 0 calc(var(--av)*.04) #000,0 0 0 calc(var(--av)*.055) #d6b55e}
.lbd-luxuryBlackGold .lr-nm{color:#fff}.lbd-luxuryBlackGold .lr-vl{color:#d6b55e}
.lbd-silverKingdom .lr-card{border-radius:calc(var(--rh)*.2);background:linear-gradient(180deg,#f8fafc,#cbd5e1 45%,#94a3b8 55%,#e2e8f0);box-shadow:0 calc(var(--rh)*.05) calc(var(--rh)*.2) #0007,inset 0 1px 0 #fff}
.lbd-silverKingdom .halo .ring{position:absolute;inset:-9%;border-radius:50%;background:conic-gradient(#fff,#94a3b8,#f1f5f9,#64748b,#fff,#cbd5e1,#fff);-webkit-mask:radial-gradient(circle,transparent 64%,#000 66%);mask:radial-gradient(circle,transparent 64%,#000 66%);animation:lb-spin 6s linear infinite}
.lbd-silverKingdom .lr-nm{color:#0f172a;text-shadow:0 1px 0 #fff8}.lbd-silverKingdom .lr-vl{color:#1e293b}
.lbd-silverKingdom .k-pod .lr-rk,.lbd-silverKingdom .k-hero .lr-rk{color:#334155;text-shadow:0 1px 0 #fff}
.lbd-royalRuby{--gem:#e11d48}.lbd-emeraldKing{--gem:#10b981}.lbd-sapphireElite{--gem:#2563eb}
.lbd-royalRuby .lr-card{border-radius:calc(var(--rh)*.16);background:linear-gradient(90deg,#4c0519f0,#881337c8);border:1px solid #f5c54299}
.lbd-emeraldKing .lr-card{border-radius:calc(var(--rh)*.16);background:linear-gradient(90deg,#022c22f0,#065f46c8);border:1px solid #f5c54299}
.lbd-sapphireElite .lr-card{border-radius:calc(var(--rh)*.16);background:linear-gradient(90deg,#0b1a4af0,#1e3a8ac8);border:1px solid #93c5fd99;box-shadow:0 0 calc(var(--rh)*.3) #2563eb55}
.lbd-royalRuby .halo .ring,.lbd-emeraldKing .halo .ring,.lbd-sapphireElite .halo .ring{position:absolute;inset:-6%;border-radius:50%;border:calc(var(--av)*.045) solid #e8c46a;box-shadow:0 0 8px var(--gem)}
.lbd-royalRuby .halo .gm,.lbd-emeraldKing .halo .gm,.lbd-sapphireElite .halo .gm{width:22%;animation:lb-gem 2.6s ease-in-out infinite}
.lbd-royalRuby .halo .g0,.lbd-emeraldKing .halo .g0,.lbd-sapphireElite .halo .g0{top:-18%;left:39%}
.lbd-royalRuby .halo .g1,.lbd-emeraldKing .halo .g1,.lbd-sapphireElite .halo .g1{top:39%;right:-18%;animation-delay:-.65s}
.lbd-royalRuby .halo .g2,.lbd-emeraldKing .halo .g2,.lbd-sapphireElite .halo .g2{bottom:-18%;left:39%;animation-delay:-1.3s}
.lbd-royalRuby .halo .g3,.lbd-emeraldKing .halo .g3,.lbd-sapphireElite .halo .g3{top:39%;left:-18%;animation-delay:-1.95s}
@keyframes lb-gem{50%{transform:scale(1.2);filter:drop-shadow(0 0 8px var(--gem)) brightness(1.3)}}
.lbd-sapphireElite .halo .ring{border-color:#bfdbfe}
.lbd-royalRuby .lr-nm,.lbd-emeraldKing .lr-nm,.lbd-sapphireElite .lr-nm{color:#fff}
.lbd-royalRuby .lr-vl{color:#fecdd3}.lbd-emeraldKing .lr-vl{color:#a7f3d0}.lbd-sapphireElite .lr-vl{color:#bfdbfe}
.lbd-platinumCrown .lr-card{border-radius:calc(var(--rh)*.25);background:linear-gradient(90deg,#1f2937f0,#374151c8);border:1px solid #e5e7eb88}
.lbd-platinumCrown .halo .ring{position:absolute;inset:-6%;border-radius:50%;border:calc(var(--av)*.04) solid #e5e7eb;box-shadow:0 0 10px #e5e7eb88}
.lbd-platinumCrown .halo .pc{position:absolute;top:-40%;left:24%;width:52%;color:#e5e7eb;filter:drop-shadow(0 0 5px #fff) drop-shadow(0 2px 2px #0008);animation:lb-crown 3s ease-in-out infinite;z-index:3!important}
.lbd-platinumCrown .halo .pc svg{width:100%;display:block}
.lbd-platinumCrown .r1 .halo .pc{display:none}.lbd-platinumCrown .r1 .lr-av .crw{color:#f1f5f9;filter:drop-shadow(0 0 8px #fff)}
.lbd-platinumCrown .lr-nm{color:#f9fafb}.lbd-platinumCrown .lr-vl{color:#e5e7eb}
.lbd-goldenWings .lr-card{border-radius:calc(var(--rh)*.2);background:linear-gradient(90deg,#1c1404e8,#2a1e05c8);border:1px solid #f5c54277}
.lbd-goldenWings .lr-av img{box-shadow:0 0 0 calc(var(--av)*.05) #f5c542,0 4px 12px #0008}
.lbd-goldenWings .halo .wn{position:absolute;top:10%;width:62%;color:#f5c542;filter:drop-shadow(0 0 6px #f59e0b);z-index:0!important;animation:lb-flap 2.6s ease-in-out infinite}
.lbd-goldenWings .halo .wn.l{left:-48%;transform-origin:100% 50%}.lbd-goldenWings .halo .wn.r{right:-48%;transform:scaleX(-1);transform-origin:50% 50%;animation-name:lb-flap2}
.lbd-goldenWings .r1 .halo .wn{width:84%;top:2%}.lbd-goldenWings .r1 .halo .wn.l{left:-66%}.lbd-goldenWings .r1 .halo .wn.r{right:-66%}
.lbd-goldenWings .k-row .halo .wn{width:40%;top:24%}.lbd-goldenWings .k-row .halo .wn.l{left:-28%}.lbd-goldenWings .k-row .halo .wn.r{right:-28%}
.lbd-goldenWings .halo .wn svg{width:100%;height:auto;display:block}
.lbd-goldenWings .lr-nm{color:#fff3d1}.lbd-goldenWings .lr-vl{color:#f5c542}
.lbd-royalMedals .lr-card{border-radius:calc(var(--rh)*.2);background:linear-gradient(90deg,#0b1020ee,#151b33cc);border-inline-start:calc(var(--rh)*.06) solid var(--rc)}
.lbd-royalMedals .halo .ring{position:absolute;inset:-8%;border-radius:50%;background:radial-gradient(circle,transparent 62%,var(--rc) 63%,color-mix(in srgb,var(--rc) 60%,#000) 74%,transparent 75%);filter:drop-shadow(0 2px 3px #000a)}
.lbd-royalMedals .halo .rib{position:absolute;top:-42%;width:30%;height:52%;z-index:0!important;background:linear-gradient(90deg,#1d4ed8 0 33%,#fff 33% 66%,#dc2626 66%);clip-path:polygon(0 0,100% 0,100% 100%,50% 82%,0 100%)}
.lbd-royalMedals .halo .rib.l{left:18%;transform:rotate(14deg)}.lbd-royalMedals .halo .rib.r{right:18%;transform:rotate(-14deg)}
.lbd-royalMedals .rx .halo .rib,.lbd-royalMedals .r4 .halo .rib,.lbd-royalMedals .r5 .halo .rib{display:none}
.lbd-royalMedals .r1 .lr-av .crw{display:none}
.lbd-royalMedals .lr-nm{color:#fff}.lbd-royalMedals .lr-vl{color:var(--rc)}
.lbd-kingdomGlass .lr-card{border-radius:calc(var(--rh)*.25);background:linear-gradient(180deg,#ffffff30,#ffffff10);border:1px solid #ffffff55;border-top:calc(var(--rh)*.05) solid #f5c542;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:0 calc(var(--rh)*.08) calc(var(--rh)*.25) #0005}
.lbd-kingdomGlass .halo .ring{position:absolute;inset:-8%;border-radius:50%;border:calc(var(--av)*.05) solid #ffffff55;border-top-color:#f5c542;animation:lb-spin 5s linear infinite}
.lbd-kingdomGlass .lr-nm{color:#fff;text-shadow:0 1px 4px #000a}.lbd-kingdomGlass .lr-vl{color:#fde68a}
.lbd-diamondCastle .lr-card{border-radius:calc(var(--rh)*.1);background:linear-gradient(45deg,#a5f3fc33 25%,transparent 25%) 0 0/calc(var(--rh)*.3) calc(var(--rh)*.3),linear-gradient(-45deg,#a5f3fc33 25%,transparent 25%) 0 0/calc(var(--rh)*.3) calc(var(--rh)*.3),linear-gradient(90deg,#0b1430f0,#1e1b4bd0);border:calc(var(--rh)*.04) solid transparent;border-image:repeating-linear-gradient(45deg,#e0f2fe 0 6px,#67e8f9 6px 12px,#c4b5fd 12px 18px) 1}
.lbd-diamondCastle .k-pod .lr-card,.lbd-diamondCastle .k-hero .lr-card{border-radius:0!important}
.lbd-diamondCastle .halo .ring{position:absolute;inset:-7%;border-radius:50%;border:calc(var(--av)*.04) solid #e0f2fe;box-shadow:0 0 8px #67e8f9,inset 0 0 6px #67e8f9}
.lbd-diamondCastle .halo .gm.top{--gem:#a5f3fc;top:-24%;left:40%;width:20%;animation:lb-gem 2.4s ease-in-out infinite}
.lbd-diamondCastle .r1 .halo .gm.top{display:none}
.lbd-diamondCastle .lr-nm{color:#ecfeff}.lbd-diamondCastle .lr-vl{color:#a5f3fc}
.lbd-b6o6Royal .lr-card{border-radius:calc(var(--rh)*.14);border:calc(var(--rh)*.035) solid transparent;background:linear-gradient(90deg,#000000f0,#06122ed8) padding-box,linear-gradient(135deg,#e5e7eb,#2f7bff 40%,#c0c7d4 60%,#1d4ed8) border-box;box-shadow:0 0 calc(var(--rh)*.3) #2f7bff44}
.lbd-b6o6Royal .halo .ring{position:absolute;border-radius:50%}
.lbd-b6o6Royal .halo .o1{inset:-7%;border:calc(var(--av)*.045) solid #2f7bff;box-shadow:0 0 10px #2f7bff}
.lbd-b6o6Royal .halo .o2{inset:-15%;border:1px dashed #c0c7d4aa;animation:lb-spin 12s linear infinite}
.lbd-b6o6Royal .halo .bc{position:absolute;top:-36%;left:28%;width:44%;color:#c0c7d4;filter:drop-shadow(0 0 5px #2f7bff);z-index:3!important}
.lbd-b6o6Royal .halo .bc svg{width:100%;display:block}
.lbd-b6o6Royal .r1 .halo .bc{display:none}.lbd-b6o6Royal .r1 .lr-av .crw{color:#7fb2ff;filter:drop-shadow(0 0 8px #2f7bff) drop-shadow(0 2px 3px #000)}
.lbd-b6o6Royal .lr-nm{background:linear-gradient(180deg,#fff,#aeb8c8);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:none}.lbd-b6o6Royal .lr-vl{color:#7fb2ff}
.lbd-neonPink .lr-card{border-radius:calc(var(--rh)*.5);background:#14001ad9;border:2px solid #ff2fb3;box-shadow:0 0 calc(var(--rh)*.18) #ff2fb3,inset 0 0 calc(var(--rh)*.18) #ff2fb366;animation:lb-neonflick 4s steps(1) infinite}
@keyframes lb-neonflick{0%,100%{opacity:1}92%{opacity:1}93%{opacity:.6}94%{opacity:1}96%{opacity:.7}}
.lbd-neonPink .halo .ring{position:absolute;border-radius:50%;border:calc(var(--av)*.03) solid #ff2fb3;box-shadow:0 0 8px #ff2fb3,inset 0 0 6px #ff2fb3}
.lbd-neonPink .halo .n1{inset:-6%}.lbd-neonPink .halo .n2{inset:-16%;border-color:#ff7ad9;border-style:dashed;animation:lb-spin 8s linear infinite}
.lbd-neonPink .lr-nm{color:#ffe4f6;text-shadow:0 0 6px #ff2fb3}.lbd-neonPink .lr-vl{color:#ff7ad9;text-shadow:0 0 6px #ff2fb3}
.lbd-cyberBlue .lr-card{border-radius:calc(var(--rh)*.08);background:repeating-linear-gradient(90deg,transparent 0 calc(var(--rh)*.6),#22d3ee18 calc(var(--rh)*.6) calc(var(--rh)*.62)),repeating-linear-gradient(0deg,transparent 0 calc(var(--rh)*.3),#22d3ee14 calc(var(--rh)*.3) calc(var(--rh)*.32)),linear-gradient(90deg,#020617f0,#082f49d0);border:1px solid #22d3ee88;border-inline-start:3px solid #22d3ee}
.lbd-cyberBlue .halo .tick{position:absolute;inset:-14%;border-radius:50%;background:repeating-conic-gradient(#22d3ee 0 2deg,transparent 2deg 12deg);-webkit-mask:radial-gradient(circle,transparent 66%,#000 68%,#000 76%,transparent 78%);mask:radial-gradient(circle,transparent 66%,#000 68%,#000 76%,transparent 78%);animation:lb-spin 20s linear infinite reverse}
.lbd-cyberBlue .halo .arc{position:absolute;inset:-6%;border-radius:50%;border:calc(var(--av)*.035) solid transparent;border-top-color:#22d3ee;border-right-color:#22d3ee;filter:drop-shadow(0 0 4px #22d3ee);animation:lb-spin 1.8s linear infinite}
.lbd-cyberBlue .lr-nm{color:#e0f2fe}.lbd-cyberBlue .lr-vl{color:#22d3ee}
.lbd-rgbGamer .lr-card{border-radius:calc(var(--rh)*.2);border:2px solid transparent;background:linear-gradient(90deg,#050505f0,#111827d8) padding-box,linear-gradient(90deg,#ff004c,#ffcc00,#00ff88,#00c3ff,#a100ff,#ff004c) border-box;box-shadow:0 0 calc(var(--rh)*.2) #a100ff55}
.lbd-rgbGamer .halo .rb{position:absolute;inset:-9%;border-radius:50%;background:conic-gradient(#ff004c,#ffcc00,#00ff88,#00c3ff,#a100ff,#ff004c);-webkit-mask:radial-gradient(circle,transparent 63%,#000 65%);mask:radial-gradient(circle,transparent 63%,#000 65%);animation:lb-spin 2.5s linear infinite}
.lbd-rgbGamer .halo .gl{position:absolute;inset:-22%;z-index:0!important;border-radius:50%;background:conic-gradient(#ff004c66,#00ff8866,#00c3ff66,#a100ff66,#ff004c66);filter:blur(10px);animation:lb-spin 2.5s linear infinite}
.lbd-rgbGamer .lr-nm{color:#fff}.lbd-rgbGamer .lr-vl{color:var(--rc)}
.lbd-gamingHudPro .lr-card{clip-path:polygon(0 0,calc(100% - var(--rh)*.3) 0,100% calc(var(--rh)*.3),100% 100%,calc(var(--rh)*.3) 100%,0 calc(100% - var(--rh)*.3));background:linear-gradient(90deg,#052e16e6,#0a0a0ad0);border-top:1px solid #4ade80;border-bottom:1px solid #4ade8066}
.lbd-gamingHudPro .halo .bk{position:absolute;width:30%;height:30%;border:calc(var(--av)*.04) solid var(--rc);filter:drop-shadow(0 0 4px var(--rc));animation:lb-aim 2.4s ease-in-out infinite}
.lbd-gamingHudPro .halo .tl{top:-14%;left:-14%;border-right:0;border-bottom:0}.lbd-gamingHudPro .halo .tr{top:-14%;right:-14%;border-left:0;border-bottom:0}.lbd-gamingHudPro .halo .bl{bottom:-14%;left:-14%;border-right:0;border-top:0}.lbd-gamingHudPro .halo .br{bottom:-14%;right:-14%;border-left:0;border-top:0}
@keyframes lb-aim{50%{transform:scale(.85)}}
.lbd-gamingHudPro .halo .aim{position:absolute;inset:-2%;border-radius:50%;border:1px solid #4ade8066}
.lbd-gamingHudPro .lr-nm{color:#dcfce7}.lbd-gamingHudPro .lr-vl{color:var(--rc)}
.lbd-esportsChampion .lr-card{border-radius:calc(var(--rh)*.06);background:linear-gradient(100deg,var(--rc) 0 calc(var(--rh)*.18),transparent calc(var(--rh)*.18)),linear-gradient(100deg,transparent calc(var(--rh)*.26),#111827f0 calc(var(--rh)*.26),#1f2937d8);box-shadow:0 calc(var(--rh)*.06) calc(var(--rh)*.2) #0008}
.lbd-esportsChampion .k-row .lr-card{background:linear-gradient(-100deg,var(--rc) 0 calc(var(--rh)*.18),transparent calc(var(--rh)*.18)),linear-gradient(-100deg,transparent calc(var(--rh)*.26),#111827f0 calc(var(--rh)*.26),#1f2937d8)}
.lbd-esportsChampion .halo .hx{position:absolute;inset:-14%;clip-path:polygon(25% 2%,75% 2%,99% 50%,75% 98%,25% 98%,1% 50%);background:linear-gradient(135deg,#fff,var(--rc) 40%,color-mix(in srgb,var(--rc) 50%,#000));z-index:0!important}
.lbd-esportsChampion .lr-av img{border-radius:50%}
.lbd-esportsChampion .lr-nm{color:#fff;font-weight:900}.lbd-esportsChampion .lr-vl{color:var(--rc)}
.lbd-cyberpunkCity .lr-card{clip-path:polygon(0 0,100% 0,100% 70%,calc(100% - var(--rh)*.3) 100%,0 100%);background:linear-gradient(90deg,#fcee0a 0 calc(var(--rh)*.06),#140a1ef0 calc(var(--rh)*.06),#2b0b3ad0);box-shadow:inset 0 -2px 0 #ff2a6d}
.lbd-cyberpunkCity .halo .ring{position:absolute;inset:-7%;border-radius:50%;border:calc(var(--av)*.035) solid}
.lbd-cyberpunkCity .halo .y{border-color:#fcee0a}.lbd-cyberpunkCity .halo .m{border-color:#ff2a6d;animation:lb-glitch 2.2s steps(1) infinite}.lbd-cyberpunkCity .halo .c{border-color:#05d9e8;animation:lb-glitch 2.2s steps(1) infinite reverse}
@keyframes lb-glitch{0%,100%{transform:translate(0)}20%{transform:translate(-4%,2%)}40%{transform:translate(3%,-2%)}60%{transform:translate(0)}80%{transform:translate(2%,3%)}}
.lbd-cyberpunkCity .lr-nm{color:#fcee0a;text-shadow:1px 0 #ff2a6d99,-1px 0 #05d9e899,0 1px 3px #000}.lbd-cyberpunkCity .lr-vl{color:#05d9e8}
.lbd-digitalPulse .lr-card{border-radius:calc(var(--rh)*.15);background:linear-gradient(90deg,#022c22f0,#042f2ed0);border:1px solid #34d39966}
.lbd-digitalPulse .lr-card::after{content:"";position:absolute;left:0;right:0;top:50%;height:40%;transform:translateY(-50%);opacity:.35;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 20' preserveAspectRatio='none'%3E%3Cpath d='M0 10h30l4-8 5 16 5-14 3 6h53' fill='none' stroke='%2334d399' stroke-width='1.5'/%3E%3C/svg%3E") 0 0/50% 100% repeat-x;animation:lb-ecg 3s linear infinite}
@keyframes lb-ecg{to{background-position:-100% 0}}
.lbd-digitalPulse .halo .rp{position:absolute;inset:-4%;border-radius:50%;border:calc(var(--av)*.03) solid var(--rc);animation:lb-ripple 1.6s ease-out infinite;opacity:0}
.lbd-digitalPulse .halo .r2{animation-delay:-.8s}
.lbd-digitalPulse .halo .ecg{position:absolute;inset:-5%;border-radius:50%;border:calc(var(--av)*.03) solid #34d399;animation:lb-beat 1.6s ease-in-out infinite}
@keyframes lb-beat{0%,40%,100%{transform:scale(1)}15%{transform:scale(1.08)}25%{transform:scale(.98)}}
.lbd-digitalPulse .lr-nm{color:#ecfdf5}.lbd-digitalPulse .lr-vl{color:#34d399}
.lbd-hologramPlayer .lr-card{border-radius:calc(var(--rh)*.15);background:repeating-linear-gradient(0deg,#67e8f914 0 2px,transparent 2px 5px),linear-gradient(90deg,#083344c0,#0c4a6e80);border:1px solid #67e8f999;box-shadow:0 0 calc(var(--rh)*.2) #67e8f955}
.lbd-hologramPlayer .lr-av img{filter:sepia(.3) hue-rotate(150deg) saturate(1.6) brightness(1.1);opacity:.88}
.lbd-hologramPlayer .halo .base{position:absolute;left:5%;right:5%;bottom:-16%;height:18%;border-radius:50%;background:radial-gradient(ellipse,#67e8f9cc,transparent 70%);z-index:0!important}
.lbd-hologramPlayer .halo .beam{position:absolute;left:10%;right:10%;top:-8%;bottom:-10%;z-index:0!important;background:linear-gradient(0deg,#67e8f955,transparent);clip-path:polygon(15% 0,85% 0,100% 100%,0 100%)}
.lbd-hologramPlayer .halo .scan{position:absolute;inset:0;border-radius:50%;overflow:hidden;z-index:3!important;background:repeating-linear-gradient(0deg,#00000033 0 2px,transparent 2px 4px)}
.lbd-hologramPlayer .halo .scan::after{content:"";position:absolute;left:0;right:0;height:20%;background:linear-gradient(transparent,#a5f3fc88,transparent);animation:lb-scan 2.2s linear infinite}
@keyframes lb-scan{from{transform:translateY(-100%)}to{transform:translateY(500%)}}
.lbd-hologramPlayer .lr-nm{color:#cffafe;text-shadow:0 0 6px #67e8f9}.lbd-hologramPlayer .lr-vl{color:#67e8f9}
.lbd-electricStorm .lr-card{border-radius:calc(var(--rh)*.2);background:radial-gradient(ellipse at 20% 0,#a78bfa55,transparent 60%),linear-gradient(90deg,#1e1033f0,#2e1065c8);border:1px solid #c084fc77}
.lbd-electricStorm .halo .cloud{position:absolute;inset:-34%;z-index:0!important;border-radius:50%;background:radial-gradient(circle,#7c3aed88 30%,#4c1d9544 55%,transparent 70%);animation:lb-storm 3s steps(1) infinite}
@keyframes lb-storm{0%,100%{opacity:.7}10%{opacity:1}12%{opacity:.5}14%{opacity:1}}
.lbd-electricStorm .halo .ring{position:absolute;inset:-6%;border-radius:50%;border:calc(var(--av)*.035) solid #e9d5ff;box-shadow:0 0 10px #c084fc}
.lbd-electricStorm .halo .bolt{position:absolute;width:15%;color:#f5f3ff;filter:drop-shadow(0 0 5px #c084fc);animation:lb-zap .9s steps(2) infinite}
.lbd-electricStorm .halo .b0{top:-24%;left:20%;transform:rotate(-20deg)}.lbd-electricStorm .halo .b1{top:-20%;right:12%;animation-delay:-.2s;transform:rotate(20deg)}.lbd-electricStorm .halo .b2{top:34%;right:-24%;animation-delay:-.4s}.lbd-electricStorm .halo .b3{bottom:-22%;right:24%;animation-delay:-.1s;transform:rotate(160deg)}.lbd-electricStorm .halo .b4{bottom:-18%;left:14%;animation-delay:-.6s;transform:rotate(200deg)}.lbd-electricStorm .halo .b5{top:30%;left:-24%;animation-delay:-.3s}
.lbd-electricStorm .lr-nm{color:#faf5ff}.lbd-electricStorm .lr-vl{color:#e9d5ff}
.lbd-techOrbit .lr-card{border-radius:calc(var(--rh)*.5);background:linear-gradient(90deg,#0b1120f0,#1e293bc8);border:1px solid #38bdf855}
.lbd-techOrbit .halo .ob{position:absolute;inset:-20%;border-radius:50%;border:1px solid color-mix(in srgb,var(--rc) 80%,transparent)}
.lbd-techOrbit .halo .ob i{position:absolute;top:-4%;left:46%;width:8%;height:8%;border-radius:50%;background:var(--rc);box-shadow:0 0 6px var(--rc)}
.lbd-techOrbit .halo .o1{animation:lb-orb1 4s linear infinite}.lbd-techOrbit .halo .o2{animation:lb-orb2 5.5s linear infinite}.lbd-techOrbit .halo .o3{animation:lb-orb3 7s linear infinite;inset:-30%;opacity:.7}
@keyframes lb-orb1{from{transform:rotate(30deg) scaleY(.35) rotate(0)}to{transform:rotate(30deg) scaleY(.35) rotate(360deg)}}
@keyframes lb-orb2{from{transform:rotate(-30deg) scaleY(.35) rotate(0)}to{transform:rotate(-30deg) scaleY(.35) rotate(360deg)}}
@keyframes lb-orb3{from{transform:rotate(90deg) scaleY(.3) rotate(0)}to{transform:rotate(90deg) scaleY(.3) rotate(-360deg)}}
.lbd-techOrbit .lr-nm{color:#e0f2fe}.lbd-techOrbit .lr-vl{color:var(--rc)}
.lbd-neonTriangle .lr-card{clip-path:polygon(calc(var(--rh)*.4) 0,100% 0,calc(100% - var(--rh)*.4) 100%,0 100%);background:linear-gradient(90deg,#0a0a0af0,#18181bd0);border-top:2px solid var(--rc);border-bottom:2px solid var(--rc)}
.lbd-neonTriangle .k-pod .lr-card,.lbd-neonTriangle .k-hero .lr-card{clip-path:none}
.lbd-neonTriangle .halo .tri{position:absolute;inset:-34%;clip-path:polygon(50% 0,100% 87%,0 87%,50% 0,50% 8%,7% 82%,93% 82%,50% 8%);background:var(--rc);filter:drop-shadow(0 0 4px var(--rc));z-index:0!important;animation:lb-spin 6s linear infinite}
.lbd-neonTriangle .k-row .halo .tri{inset:-16%}.lbd-neonTriangle .k-row .halo .t2{inset:-8%}.lbd-neonTriangle .halo .t2{animation-direction:reverse;animation-duration:9s;opacity:.5;inset:-26%}
.lbd-neonTriangle .lr-nm{color:#fff}.lbd-neonTriangle .lr-vl{color:var(--rc)}
.lbd-laserFrame .lr-card{border-radius:calc(var(--rh)*.1);background:#09090bf0;box-shadow:inset 0 0 0 1px #27272a}
.lbd-laserFrame .lr-card::after{content:"";position:absolute;inset:-60%;background:conic-gradient(from 0deg,transparent 0 70%,var(--rc) 80%,#fff 82%,transparent 84%);animation:lb-spin 3s linear infinite;-webkit-mask:none}
.lbd-laserFrame .lr-card .swp{z-index:1}
.lbd-laserFrame .lr-card{isolation:isolate}
.lbd-laserFrame .lr-card>.swp::before{content:"";position:absolute;inset:2px;border-radius:inherit;background:#09090bf2;z-index:-1}
.lbd-laserFrame .halo .lz{position:absolute;inset:-7%;border-radius:50%;background:conic-gradient(from 0deg,transparent 0 60%,var(--rc) 85%,#fff 88%,transparent 90%);-webkit-mask:radial-gradient(circle,transparent 63%,#000 65%);mask:radial-gradient(circle,transparent 63%,#000 65%);animation:lb-spin 1.8s linear infinite}
.lbd-laserFrame .lr-nm{color:#fafafa}.lbd-laserFrame .lr-vl{color:var(--rc)}
.lbd-digitalMatrix .lr-card{border-radius:calc(var(--rh)*.08);background:#020a04f0;border:1px solid #22c55e66}
.lbd-digitalMatrix .lr-card::after{content:"";position:absolute;left:0;right:0;top:-100%;height:300%;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cg fill='%2322c55e' font-family='monospace' font-size='11'%3E%3Ctext x='2' y='12'%3E1 0%3C/text%3E%3Ctext x='30' y='26' opacity='.6'%3E0 1%3C/text%3E%3Ctext x='8' y='42' opacity='.4'%3E1 1%3C/text%3E%3Ctext x='36' y='56' opacity='.7'%3E0%3C/text%3E%3C/g%3E%3C/svg%3E") 0 0/calc(var(--rh)*.9) calc(var(--rh)*.9);opacity:.35;animation:lb-rain 6s linear infinite}
@keyframes lb-rain{to{transform:translateY(33.33%)}}
.lbd-digitalMatrix .halo .ring{position:absolute;inset:-6%;border-radius:50%;border:calc(var(--av)*.035) solid #22c55e;box-shadow:0 0 8px #22c55e}
.lbd-digitalMatrix .halo .mx{position:absolute;inset:-18%;border-radius:50%;z-index:0!important;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cg fill='%2322c55e' font-family='monospace' font-size='11'%3E%3Ctext x='2' y='12'%3E1 0%3C/text%3E%3Ctext x='30' y='26' opacity='.6'%3E0 1%3C/text%3E%3Ctext x='8' y='42' opacity='.4'%3E1 1%3C/text%3E%3Ctext x='36' y='56' opacity='.7'%3E0%3C/text%3E%3C/g%3E%3C/svg%3E") 0 0/40% 40%;-webkit-mask:radial-gradient(circle,#000 40%,transparent 70%);mask:radial-gradient(circle,#000 40%,transparent 70%);opacity:.7;animation:lb-spin 30s linear infinite}
.lbd-digitalMatrix .lr-nm{color:#dcfce7;text-shadow:0 0 6px #22c55e}.lbd-digitalMatrix .lr-vl{color:#4ade80}
.lbd-rgbCrown .lr-card{border-radius:calc(var(--rh)*.25);background:linear-gradient(90deg,#0a0a0af0,#171717d0);border:1px solid #ffffff22}
.lbd-rgbCrown .r1 .lr-card{border:2px solid transparent;background:linear-gradient(90deg,#0a0a0af0,#171717e0) padding-box,linear-gradient(90deg,#ff004c,#ffcc00,#00ff88,#00c3ff,#a100ff) border-box}
.lbd-rgbCrown .halo .rb{position:absolute;inset:-6%;border-radius:50%;border:calc(var(--av)*.035) solid var(--rc)}
.lbd-rgbCrown .r1 .halo .rb{border:0;background:conic-gradient(#ff004c,#ffcc00,#00ff88,#00c3ff,#a100ff,#ff004c);-webkit-mask:radial-gradient(circle,transparent 64%,#000 66%);mask:radial-gradient(circle,transparent 64%,#000 66%);animation:lb-spin 3s linear infinite}
.lbd-rgbCrown .r1 .lr-av .crw{color:#ff004c;animation:lb-crown 2.6s ease-in-out infinite,lb-hue 4s linear infinite}
@keyframes lb-hue{to{filter:hue-rotate(360deg) drop-shadow(0 0 8px #fff)}}
.lbd-rgbCrown .lr-nm{color:#fff}.lbd-rgbCrown .lr-vl{color:var(--rc)}
.lbd-b6o6Esports .lr-card{clip-path:polygon(0 0,100% 0,100% calc(100% - var(--rh)*.25),calc(100% - var(--rh)*.25) 100%,0 100%);background:linear-gradient(110deg,#2f7bff 0 calc(var(--rh)*.08),transparent calc(var(--rh)*.08) calc(var(--rh)*.14),#c0c7d4 calc(var(--rh)*.14) calc(var(--rh)*.18),transparent calc(var(--rh)*.18)),linear-gradient(90deg,#000000f0,#06122ed8);border-bottom:2px solid #2f7bff}
.lbd-b6o6Esports .k-row .lr-card{background:linear-gradient(-110deg,#2f7bff 0 calc(var(--rh)*.08),transparent calc(var(--rh)*.08) calc(var(--rh)*.14),#c0c7d4 calc(var(--rh)*.14) calc(var(--rh)*.18),transparent calc(var(--rh)*.18)),linear-gradient(90deg,#06122ed8,#000000f0)}
.lbd-b6o6Esports .halo .hx{position:absolute;inset:-12%;clip-path:polygon(25% 2%,75% 2%,99% 50%,75% 98%,25% 98%,1% 50%,25% 2%,27% 8%,4% 50%,27% 92%,73% 92%,96% 50%,73% 8%,27% 8%);background:#2f7bff;filter:drop-shadow(0 0 4px #2f7bff)}
.lbd-b6o6Esports .halo .h2{inset:-22%;background:#c0c7d4;opacity:.5;animation:lb-spin 10s linear infinite}
.lbd-b6o6Esports .lr-nm{color:#fff;font-weight:900}.lbd-b6o6Esports .lr-vl{color:#7fb2ff}
.lbd-liquidGlass .lr-card{border-radius:calc(var(--rh)*.4);background:linear-gradient(120deg,#ffffff30,#ffffff0d);border:1px solid #ffffff55;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.lbd-liquidGlass .lr-card::after{content:"";position:absolute;width:40%;height:180%;top:-40%;left:10%;border-radius:45% 55% 60% 40%;background:radial-gradient(circle,#c4b5fd44,transparent 65%);animation:lb-liq 7s ease-in-out infinite}
@keyframes lb-liq{50%{transform:translateX(120%) rotate(40deg) scale(1.2)}}
.lbd-liquidGlass .halo .blob{position:absolute;inset:-16%;z-index:0!important;border-radius:42% 58% 63% 37%/45% 40% 60% 55%;background:linear-gradient(135deg,#7dd3fc88,#c4b5fd88,#f9a8d488);border:1px solid #ffffff88;animation:lb-blob 6s ease-in-out infinite,lb-spin 14s linear infinite}
.lbd-liquidGlass .halo .b2{inset:-9%;opacity:.6;animation-duration:5s,10s;animation-direction:normal,reverse}
@keyframes lb-blob{0%,100%{border-radius:42% 58% 63% 37%/45% 40% 60% 55%}50%{border-radius:60% 40% 38% 62%/58% 62% 38% 42%}}
.lbd-liquidGlass .lr-nm{color:#fff;text-shadow:0 1px 4px #0009}.lbd-liquidGlass .lr-vl{color:#e0f2fe}
.lbd-frostedCrystal .lr-card{border-radius:calc(var(--rh)*.2);background:linear-gradient(180deg,#ffffff26,#ffffff12);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--rc) 80%,transparent),0 0 calc(var(--rh)*.25) color-mix(in srgb,var(--rc) 45%,transparent)}
.lbd-frostedCrystal .halo .ring{position:absolute;inset:-8%;border-radius:50%;border:calc(var(--av)*.06) solid #ffffff40;box-shadow:0 0 0 1.5px var(--rc),inset 0 0 0 1px #fff8}
.lbd-frostedCrystal .halo .glow{position:absolute;inset:-22%;z-index:0!important;border-radius:50%;background:radial-gradient(circle,color-mix(in srgb,var(--rc) 50%,transparent) 40%,transparent 70%);animation:lb-breath 3.4s ease-in-out infinite}
.lbd-frostedCrystal .lr-nm{color:#fff;text-shadow:0 1px 4px #000a}.lbd-frostedCrystal .lr-vl{color:var(--rc)}
.lbd-transparentDiamond .lr-card{clip-path:polygon(calc(var(--rh)*.35) 0,calc(100% - var(--rh)*.35) 0,100% 50%,calc(100% - var(--rh)*.35) 100%,calc(var(--rh)*.35) 100%,0 50%);background:linear-gradient(115deg,#ffffff38,#a5f3fc14 45%,#ffffff2a 55%,#c4b5fd1a);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.lbd-transparentDiamond .k-pod .lr-card,.lbd-transparentDiamond .k-hero .lr-card{clip-path:polygon(50% 0,100% 12%,100% 100%,0 100%,0 12%)}
.lbd-transparentDiamond .halo .rmb{position:absolute;inset:-12%;transform:rotate(45deg);border:1.5px solid #e0f2fe;background:linear-gradient(135deg,#ffffff30,transparent);z-index:0!important;box-shadow:0 0 8px #a5f3fc88}
.lbd-transparentDiamond .k-row .halo .rmb{inset:-2%}.lbd-transparentDiamond .halo .r2{inset:-2%;opacity:.5;animation:lb-dia 5s ease-in-out infinite}
@keyframes lb-dia{0%,100%{transform:rotate(45deg) scale(1)}50%{transform:rotate(45deg) scale(1.2)}}
.lbd-transparentDiamond .lr-nm{color:#fff;text-shadow:0 1px 4px #000a}.lbd-transparentDiamond .lr-vl{color:#a5f3fc}
.lbd-glassBubble .lr-card{border-radius:999px;background:radial-gradient(circle at 20% 20%,#ffffff40,transparent 40%),linear-gradient(90deg,#ffffff22,#ffffff0d);border:1px solid #ffffff66;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.lbd-glassBubble .halo .bb{position:absolute;inset:-12%;border-radius:50%;background:radial-gradient(circle at 50% 50%,transparent 60%,#ffffff30 70%,#ffffff70 100%);box-shadow:inset 0 0 0 1px #ffffffaa,0 0 0 1px #f9a8d455;z-index:3!important}
.lbd-glassBubble .halo .hl{position:absolute;top:2%;left:12%;width:30%;height:18%;border-radius:50%;background:#ffffffcc;filter:blur(1.5px);transform:rotate(-30deg);z-index:3!important}
.lbd-glassBubble .halo .mb{position:absolute;bottom:0;width:12%;height:12%;border-radius:50%;border:1px solid #ffffffaa;background:#ffffff22;animation:lb-rise 4s ease-in infinite;opacity:0}
.lbd-glassBubble .halo .m0{left:-12%}.lbd-glassBubble .halo .m1{right:-16%;animation-delay:-1.4s;width:9%;height:9%}.lbd-glassBubble .halo .m2{left:96%;animation-delay:-2.8s;width:7%;height:7%}
@keyframes lb-rise{0%{transform:translateY(0);opacity:0}15%{opacity:1}100%{transform:translateY(-900%);opacity:0}}
.lbd-glassBubble .lr-nm{color:#fff;text-shadow:0 1px 4px #000a}.lbd-glassBubble .lr-vl{color:var(--rc)}
.lbd-crystalOrbit .lr-card{border-radius:calc(var(--rh)*.25);background:linear-gradient(90deg,#0b1120d8,#1e1b4ba8);border:1px solid #a5f3fc55;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.lbd-crystalOrbit .halo .orb{position:absolute;inset:-32%;animation:lb-spin 9s linear infinite}
.lbd-crystalOrbit .halo .sd,.lbd-b6o6Crystal .halo .sd{position:absolute;width:10%;height:22%;margin:-11% -5%;clip-path:polygon(50% 0,100% 30%,50% 100%,0 30%);background:linear-gradient(180deg,#fff,var(--rc) 60%,color-mix(in srgb,var(--rc) 50%,#000));filter:drop-shadow(0 0 4px var(--rc))}
.lbd-crystalOrbit .halo .d0{top:6%;left:50%}.lbd-crystalOrbit .halo .d1{top:36%;left:93%;transform:rotate(72deg)}.lbd-crystalOrbit .halo .d2{top:85%;left:77%;transform:rotate(144deg)}.lbd-crystalOrbit .halo .d3{top:85%;left:23%;transform:rotate(216deg)}.lbd-crystalOrbit .halo .d4{top:36%;left:7%;transform:rotate(288deg)}
.lbd-crystalOrbit .lr-nm{color:#f0fdff}.lbd-crystalOrbit .lr-vl{color:var(--rc)}
.lbd-mirrorChrome .lr-card{border-radius:calc(var(--rh)*.18);background:linear-gradient(180deg,#ffffff 0,#d1d5db 30%,#6b7280 50%,#e5e7eb 70%,#f9fafb 100%);box-shadow:0 calc(var(--rh)*.05) calc(var(--rh)*.2) #0008}
.lbd-mirrorChrome .lr-card::after{content:"";position:absolute;inset:0;background:linear-gradient(100deg,transparent 35%,#ffffffee 48%,transparent 60%);transform:translateX(-100%);animation:lb-shim2 3.5s ease-in-out infinite;animation-delay:var(--d,0s)}
@keyframes lb-shim2{0%,50%{transform:translateX(100%)}100%{transform:translateX(-100%)}}
.lbd-mirrorChrome .halo .ring{position:absolute;inset:-9%;border-radius:50%;background:conic-gradient(#fff,#6b7280,#f9fafb,#374151,#fff,#9ca3af,#fff);-webkit-mask:radial-gradient(circle,transparent 63%,#000 65%);mask:radial-gradient(circle,transparent 63%,#000 65%);animation:lb-spin 4s linear infinite}
.lbd-mirrorChrome .lr-nm{color:#111827;text-shadow:0 1px 0 #fff}.lbd-mirrorChrome .lr-vl{color:#1f2937}
.lbd-mirrorChrome .k-pod .lr-rk,.lbd-mirrorChrome .k-hero .lr-rk{color:#1f2937;text-shadow:0 1px 0 #fff}
.lbd-glassReflection .lr-card{border-radius:calc(var(--rh)*.22);background:linear-gradient(180deg,#ffffff1f,#ffffff0a);border:1px solid #ffffff4d;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.lbd-glassReflection .lr-card::after{content:"";position:absolute;top:-50%;bottom:-50%;width:22%;left:0;background:linear-gradient(90deg,transparent,#ffffffdd,transparent);transform:translateX(-200%) skewX(-25deg);animation:lb-refl 4s ease-in-out infinite;animation-delay:var(--d,0s)}
@keyframes lb-refl{0%,55%{transform:translateX(-200%) skewX(-25deg)}100%{transform:translateX(600%) skewX(-25deg)}}
.lbd-glassReflection .lr-card .swp{display:none}
.lbd-glassReflection .halo .ring{position:absolute;inset:-6%;border-radius:50%;border:1.5px solid #ffffffaa;box-shadow:0 0 6px #fff8}
.lbd-glassReflection .halo .rf{position:absolute;inset:0;border-radius:50%;overflow:hidden;z-index:3!important}
.lbd-glassReflection .halo .rf::after{content:"";position:absolute;top:-20%;bottom:-20%;width:30%;background:linear-gradient(90deg,transparent,#ffffffaa,transparent);transform:translateX(-200%) skewX(-25deg);animation:lb-refl 4s ease-in-out infinite;animation-delay:calc(var(--d,0s) + .3s)}
.lbd-glassReflection .lr-nm{color:#fff;text-shadow:0 1px 4px #000a}.lbd-glassReflection .lr-vl{color:#fff}
.lbd-iceGlass .lr-card{border-radius:calc(var(--rh)*.15);background:radial-gradient(circle at 10% 0,#ffffff55,transparent 30%),linear-gradient(180deg,#bae6fd40,#0c4a6e40);border:1px solid #e0f2feaa;border-top:2px solid #fff;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.lbd-iceGlass .halo .ring{position:absolute;inset:-7%;border-radius:50%;border:calc(var(--av)*.05) solid #e0f2fecc;box-shadow:0 0 8px #7dd3fc,inset 0 0 6px #7dd3fc}
.lbd-iceGlass .halo .icl{position:absolute;top:92%;width:10%;height:24%;clip-path:polygon(0 0,100% 0,50% 100%);background:linear-gradient(180deg,#fff,#7dd3fc88);transform-origin:top;animation:lb-drip 3s ease-in-out infinite}
.lbd-iceGlass .halo .i0{left:18%}.lbd-iceGlass .halo .i1{left:34%;height:32%;animation-delay:-.6s}.lbd-iceGlass .halo .i2{left:47%;height:20%;animation-delay:-1.2s}.lbd-iceGlass .halo .i3{left:60%;height:28%;animation-delay:-1.8s}.lbd-iceGlass .halo .i4{left:74%;height:18%;animation-delay:-2.4s}
@keyframes lb-drip{50%{transform:scaleY(1.15)}}
.lbd-iceGlass .k-row .halo .icl{display:none}
.lbd-iceGlass .lr-nm{color:#f0f9ff;text-shadow:0 1px 4px #0c4a6e}.lbd-iceGlass .lr-vl{color:#e0f2fe}
.lbd-pearlCrystal .lr-card{border-radius:calc(var(--rh)*.5);background:linear-gradient(180deg,#ffffffd9,#f5f5f4b8);border:1px solid #fff;box-shadow:0 0 calc(var(--rh)*.2) #ffffff66}
.lbd-pearlCrystal .halo .orb{position:absolute;inset:-18%;animation:lb-spin 18s linear infinite}
.lbd-pearlCrystal .halo .pl{position:absolute;width:12%;height:12%;margin:-6%;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#e7e5e4 60%,#a8a29e);box-shadow:0 1px 2px #0006}
.lbd-pearlCrystal .halo .p0{top:0;left:50%}.lbd-pearlCrystal .halo .p1{top:15%;left:85%}.lbd-pearlCrystal .halo .p2{top:50%;left:100%}.lbd-pearlCrystal .halo .p3{top:85%;left:85%}.lbd-pearlCrystal .halo .p4{top:100%;left:50%}.lbd-pearlCrystal .halo .p5{top:85%;left:15%}.lbd-pearlCrystal .halo .p6{top:50%;left:0}.lbd-pearlCrystal .halo .p7{top:15%;left:15%}
.lbd-pearlCrystal .halo .ring{position:absolute;inset:-4%;border-radius:50%;border:1.5px solid #fff}
.lbd-pearlCrystal .lr-nm{color:#292524;text-shadow:none}.lbd-pearlCrystal .lr-vl{color:#57534e}
.lbd-pearlCrystal .k-pod .lr-rk,.lbd-pearlCrystal .k-hero .lr-rk{text-shadow:0 1px 2px #0008}
.lbd-holographicGlass .lr-card{border-radius:calc(var(--rh)*.3);background:linear-gradient(115deg,#f0abfc55,#a5f3fc55,#fde68a55,#c4b5fd55,#99f6e455);background-size:300% 100%;border:1px solid #ffffff88;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);animation:lb-holo 6s ease-in-out infinite alternate}
@keyframes lb-holo{to{background-position:100% 0}}
.lbd-holographicGlass .halo .ir{position:absolute;inset:-9%;border-radius:50%;background:conic-gradient(#f0abfc,#a5f3fc,#fde68a,#c4b5fd,#99f6e4,#f0abfc);-webkit-mask:radial-gradient(circle,transparent 62%,#000 64%);mask:radial-gradient(circle,transparent 62%,#000 64%);animation:lb-spin 6s linear infinite;opacity:.9}
.lbd-holographicGlass .lr-nm{color:#fff;text-shadow:0 1px 4px #4c1d95}.lbd-holographicGlass .lr-vl{color:#fff;text-shadow:0 1px 4px #4c1d95}
.lbd-prismLight .lr-card{border-radius:calc(var(--rh)*.2);background:linear-gradient(90deg,#0b0f1ad8,#111827b0);border-bottom:2px solid transparent;border-image:linear-gradient(90deg,#ef4444,#f59e0b,#eab308,#22c55e,#06b6d4,#6366f1,#a855f7) 1;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.lbd-prismLight .halo .beam{position:absolute;inset:-70%;z-index:0!important;border-radius:50%;background:conic-gradient(from 200deg,transparent 0deg,#ef444455 10deg,#f59e0b55 20deg,#eab30855 30deg,#22c55e55 40deg,#06b6d455 50deg,#6366f155 60deg,#a855f755 70deg,transparent 80deg);-webkit-mask:radial-gradient(circle,#000 20%,transparent 70%);mask:radial-gradient(circle,#000 20%,transparent 70%);animation:lb-rock 6s ease-in-out infinite}
.lbd-prismLight .k-row .halo .beam{inset:-40%}
.lbd-prismLight .halo .ring{position:absolute;inset:-6%;border-radius:50%;border:1.5px solid #fff;box-shadow:0 0 8px #fff}
.lbd-prismLight .lr-nm{color:#fff}.lbd-prismLight .lr-vl{color:var(--rc)}
.lbd-diamondDust .lr-card{border-radius:calc(var(--rh)*.2);background:radial-gradient(1px 1px at 15% 30%,#fff,transparent),radial-gradient(1px 1px at 35% 70%,#e0f2fe,transparent),radial-gradient(1.5px 1.5px at 62% 40%,#fff,transparent),radial-gradient(1px 1px at 85% 75%,#fde68a,transparent),linear-gradient(90deg,#0f172ad8,#1e293bb0);border:1px solid #e0f2fe44;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.lbd-diamondDust .halo .ds{position:absolute;width:5%;height:5%;border-radius:50%;background:#fff;box-shadow:0 0 6px 1px #fff;animation:lb-twinkle 2s ease-in-out infinite}
.lbd-diamondDust .halo .d0{top:-14%;left:30%}.lbd-diamondDust .halo .d1{top:-6%;right:-6%;animation-delay:-.3s}.lbd-diamondDust .halo .d2{top:40%;right:-18%;animation-delay:-.6s}.lbd-diamondDust .halo .d3{bottom:-10%;right:10%;animation-delay:-.9s}.lbd-diamondDust .halo .d4{bottom:-16%;left:40%;animation-delay:-1.2s}.lbd-diamondDust .halo .d5{bottom:4%;left:-16%;animation-delay:-1.5s}.lbd-diamondDust .halo .d6{top:30%;left:-20%;animation-delay:-1.8s}.lbd-diamondDust .halo .d7{top:-18%;left:-4%;animation-delay:-.15s}
.lbd-diamondDust .halo .ring{position:absolute;inset:-5%;border-radius:50%;border:1.5px solid #e0f2fe;box-shadow:0 0 6px #fff}
.lbd-diamondDust .lr-nm{color:#f8fafc}.lbd-diamondDust .lr-vl{color:var(--rc)}
.lbd-glassWings .lr-card{border-radius:calc(var(--rh)*.3);background:linear-gradient(180deg,#ffffff26,#ffffff0d);border:1px solid #ffffff55;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.lbd-glassWings .halo .wn{position:absolute;top:6%;width:70%;color:#ffffff40;filter:drop-shadow(0 0 1px #fff) drop-shadow(0 0 6px color-mix(in srgb,var(--rc) 70%,transparent));z-index:0!important;animation:lb-flap 3s ease-in-out infinite}
.lbd-glassWings .halo .wn svg{width:100%;height:auto;display:block}
.lbd-glassWings .halo .wn.l{left:-56%;transform-origin:100% 50%}.lbd-glassWings .halo .wn.r{right:-56%;transform:scaleX(-1);transform-origin:50% 50%;animation-name:lb-flap2}
.lbd-glassWings .k-row .halo .wn{width:40%;top:24%}.lbd-glassWings .k-row .halo .wn.l{left:-28%}.lbd-glassWings .k-row .halo .wn.r{right:-28%}
.lbd-glassWings .halo .ring{position:absolute;inset:-5%;border-radius:50%;border:1.5px solid #ffffffbb}
.lbd-glassWings .lr-nm{color:#fff;text-shadow:0 1px 4px #000a}.lbd-glassWings .lr-vl{color:var(--rc)}
.lbd-crystalCrown .lr-card{border-radius:calc(var(--rh)*.2);background:linear-gradient(90deg,#0b1430d8,#1e1b4bb0);border:1px solid #a5f3fc66;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.lbd-crystalCrown .halo .ring{position:absolute;inset:-6%;border-radius:50%;border:calc(var(--av)*.04) solid #e0f2fe;box-shadow:0 0 8px #a5f3fc}
.lbd-crystalCrown .halo .cc{position:absolute;top:-36%;left:28%;width:44%;color:#a5f3fc;opacity:.85;filter:drop-shadow(0 0 4px #67e8f9);z-index:3!important}
.lbd-crystalCrown .halo .cc svg{width:100%;display:block}
.lbd-crystalCrown .r1 .halo .cc{display:none}
.lbd-crystalCrown .r1 .lr-av .crw{color:#cffafe;filter:drop-shadow(0 0 2px #fff) drop-shadow(0 0 10px #22d3ee) drop-shadow(0 0 2px #a78bfa)}
.lbd-crystalCrown .lr-nm{color:#ecfeff}.lbd-crystalCrown .lr-vl{color:#a5f3fc}
.lbd-b6o6Crystal .lr-card{border-radius:calc(var(--rh)*.2);background:linear-gradient(180deg,#2f7bff2e,#06122ec0);border:1px solid #c0c7d488;border-top:1px solid #fff;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:0 0 calc(var(--rh)*.25) #2f7bff44}
.lbd-b6o6Crystal .halo .ring{position:absolute;inset:-7%;border-radius:50%;background:conic-gradient(#2f7bff,#fff,#c0c7d4,#2f7bff,#7fb2ff,#2f7bff);-webkit-mask:radial-gradient(circle,transparent 63%,#000 65%);mask:radial-gradient(circle,transparent 63%,#000 65%);animation:lb-spin 7s linear infinite}
.lbd-b6o6Crystal .halo .orb{position:absolute;inset:-26%;animation:lb-rock 5s ease-in-out infinite}
.lbd-b6o6Crystal .halo .d0{top:6%;left:50%}.lbd-b6o6Crystal .halo .d1{top:40%;left:96%;transform:rotate(100deg)}.lbd-b6o6Crystal .halo .d2{top:40%;left:4%;transform:rotate(260deg)}
.lbd-b6o6Crystal .lr-nm{background:linear-gradient(180deg,#fff,#aeb8c8);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:none}.lbd-b6o6Crystal .lr-vl{color:#7fb2ff}
.lbd-float3d .lr-card{border-radius:calc(var(--rh)*.2);background:linear-gradient(90deg,#111827f0,#1f2937e0);border:1px solid #ffffff22;box-shadow:0 2px 0 #374151,0 4px 0 #1f2937,0 6px 0 #111827,0 calc(var(--rh)*.35) calc(var(--rh)*.35) #000a;animation:lb-f3 3.6s ease-in-out infinite;animation-delay:var(--d,0s)}
@keyframes lb-f3{50%{transform:translateY(-5%)}}
.lbd-float3d .lr-av{animation:lb-f3 3.6s ease-in-out infinite;animation-delay:var(--d,0s)}
.lbd-float3d .halo .ring{position:absolute;inset:-5%;border-radius:50%;border:calc(var(--av)*.045) solid var(--rc);box-shadow:0 3px 0 color-mix(in srgb,var(--rc) 50%,#000),0 6px 10px #000a}
.lbd-float3d .halo .sh{position:absolute;left:12%;right:12%;bottom:-24%;height:12%;border-radius:50%;background:#000a;filter:blur(3px);z-index:0!important}
.lbd-float3d .lr-nm{color:#fff}.lbd-float3d .lr-vl{color:var(--rc)}
.lbd-rotHalo3d .lr-card{border-radius:calc(var(--rh)*.25);background:linear-gradient(90deg,#0b1120f0,#172554c8);border:1px solid #60a5fa44}
.lbd-rotHalo3d .halo{perspective:calc(var(--av)*3)}
.lbd-rotHalo3d .halo .r3{position:absolute;inset:-18%;border-radius:50%;border:calc(var(--av)*.04) solid var(--rc);box-shadow:0 0 8px var(--rc)}
.lbd-rotHalo3d .halo .a{animation:lb-r3a 4s linear infinite}.lbd-rotHalo3d .halo .b{inset:-26%;opacity:.6;animation:lb-r3b 6s linear infinite}
@keyframes lb-r3a{from{transform:rotateX(70deg) rotateZ(0)}to{transform:rotateX(70deg) rotateZ(360deg)}}
@keyframes lb-r3b{from{transform:rotateY(65deg) rotateZ(0)}to{transform:rotateY(65deg) rotateZ(-360deg)}}
.lbd-rotHalo3d .lr-nm{color:#eff6ff}.lbd-rotHalo3d .lr-vl{color:var(--rc)}
.lbd-diamond3d .lr-card{border-radius:calc(var(--rh)*.18);background:linear-gradient(110deg,#0f172af0,#1e293bd0);border:1px solid #a5f3fc55}
.lbd-diamond3d .halo{perspective:calc(var(--av)*4)}
.lbd-diamond3d .halo .ring{position:absolute;inset:-5%;border-radius:50%;border:calc(var(--av)*.035) solid #e0f2fe;box-shadow:0 0 8px #a5f3fc}
.lbd-diamond3d .halo .dm{position:absolute;inset:-40%;z-index:0!important;color:#67e8f9;opacity:.85;filter:drop-shadow(0 0 12px #22d3ee);animation:lb-flipY 4s linear infinite;display:none}
.lbd-diamond3d .r1 .halo .dm{display:block}
.lbd-diamond3d .halo .dm svg{width:100%;height:100%;display:block}
@keyframes lb-flipY{from{transform:rotateY(0)}to{transform:rotateY(360deg)}}
.lbd-diamond3d .lr-nm{color:#f0f9ff}.lbd-diamond3d .lr-vl{color:#a5f3fc}
.lbd-crown3d .lr-card{border-radius:calc(var(--rh)*.15);background:linear-gradient(180deg,#3a2a07,#1c1404);border:1px solid #f5c542aa;box-shadow:0 3px 0 #7a5512,0 6px 0 #4a3409,0 calc(var(--rh)*.3) calc(var(--rh)*.3) #000a}
.lbd-crown3d .halo .ring{position:absolute;inset:-6%;border-radius:50%;border:calc(var(--av)*.05) solid #f5c542;box-shadow:0 2px 0 #b8862b,0 4px 0 #7a5512,0 6px 8px #000a}
.lbd-crown3d .lr-av{perspective:calc(var(--av)*3)}
.lbd-crown3d .r1 .lr-av .crw{width:76%;left:12%;top:-56%;color:#f5c542;filter:drop-shadow(0 2px 0 #b8862b) drop-shadow(0 4px 0 #7a5512) drop-shadow(0 6px 6px #000a);animation:lb-c3 3.5s ease-in-out infinite}
@keyframes lb-c3{0%,100%{transform:rotateY(-30deg)}50%{transform:rotateY(30deg) translateY(-6%)}}
.lbd-crown3d .lr-nm{color:#fff3d1}.lbd-crown3d .lr-vl{color:#f5c542}
.lbd-glassPodium3d .lr-card{border-radius:calc(var(--rh)*.2);background:linear-gradient(180deg,#ffffff40,#ffffff12 40%,#ffffff20);border:1px solid #ffffff77;border-top:2px solid #fff;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:inset 0 -8px 16px #ffffff18,0 10px 20px #0006}
.lbd-glassPodium3d .k-pod .lr-card{transform:perspective(400px) rotateX(10deg);transform-origin:bottom;box-shadow:inset 0 -8px 16px #ffffff18,0 12px 0 -4px color-mix(in srgb,var(--rc) 50%,transparent),0 20px 26px #0007}
.lbd-glassPodium3d .halo .ring{position:absolute;inset:-5%;border-radius:50%;border:calc(var(--av)*.04) solid #ffffffcc;box-shadow:0 0 0 1px var(--rc),0 0 10px var(--rc)}
.lbd-glassPodium3d .halo .sh{position:absolute;left:8%;right:8%;bottom:-20%;height:12%;border-radius:50%;background:radial-gradient(ellipse,color-mix(in srgb,var(--rc) 70%,transparent),transparent 70%);z-index:0!important}
.lbd-glassPodium3d .lr-nm{color:#fff;text-shadow:0 1px 4px #000a}.lbd-glassPodium3d .lr-vl{color:var(--rc)}
.lbd-orbit3d .lr-card{border-radius:calc(var(--rh)*.5);background:linear-gradient(90deg,#020617f0,#1e1b4bc8);border:1px solid #38bdf844}
.lbd-orbit3d .halo .o3{position:absolute;inset:-22%}
.lbd-orbit3d .halo .o3 i{position:absolute;width:12%;height:12%;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,var(--rc) 50%,color-mix(in srgb,var(--rc) 40%,#000));box-shadow:0 0 6px var(--rc);animation:lb-o3 3.2s linear infinite;offset-path:none}
.lbd-orbit3d .halo .b i{animation-delay:-1.07s}.lbd-orbit3d .halo .c i{animation-delay:-2.13s}
@keyframes lb-o3{0%{left:44%;top:30%;transform:scale(.5);opacity:.4}25%{left:94%;top:44%;transform:scale(.9);opacity:1}50%{left:44%;top:58%;transform:scale(1.3);opacity:1}75%{left:-6%;top:44%;transform:scale(.9);opacity:1}100%{left:44%;top:30%;transform:scale(.5);opacity:.4}}
.lbd-orbit3d .lr-nm{color:#eff6ff}.lbd-orbit3d .lr-vl{color:var(--rc)}
.lbd-neonRings3d .lr-card{border-radius:calc(var(--rh)*.15);background:#05050af0;border:1px solid var(--rc);box-shadow:0 0 calc(var(--rh)*.15) var(--rc)}
.lbd-neonRings3d .halo,.lbd-energySphere3d .halo,.lbd-b6o63d .halo{perspective:calc(var(--av)*3)}
.lbd-neonRings3d .halo .gy,.lbd-energySphere3d .halo .gy,.lbd-b6o63d .halo .gy{position:absolute;inset:-16%;border-radius:50%;border:calc(var(--av)*.03) solid var(--rc);box-shadow:0 0 6px var(--rc),inset 0 0 6px var(--rc)}
.lbd-neonRings3d .halo .a{animation:lb-g1 3s linear infinite}.lbd-neonRings3d .halo .b{border-color:#f472b6;box-shadow:0 0 6px #f472b6;animation:lb-g2 4s linear infinite}.lbd-neonRings3d .halo .c{border-color:#22d3ee;box-shadow:0 0 6px #22d3ee;animation:lb-g3 5s linear infinite}
@keyframes lb-g1{from{transform:rotateX(75deg) rotateY(0)}to{transform:rotateX(75deg) rotateY(360deg)}}
@keyframes lb-g2{from{transform:rotateY(75deg) rotateX(0)}to{transform:rotateY(75deg) rotateX(360deg)}}
@keyframes lb-g3{from{transform:rotateX(45deg) rotateY(45deg) rotateZ(0)}to{transform:rotateX(45deg) rotateY(45deg) rotateZ(360deg)}}
.lbd-neonRings3d .lr-nm{color:#fff;text-shadow:0 0 6px var(--rc)}.lbd-neonRings3d .lr-vl{color:var(--rc)}
.lbd-crystalFrame3d .lr-card{border-radius:calc(var(--rh)*.12);background:linear-gradient(135deg,#ffffff38,#a5f3fc12 50%,#c4b5fd24);border:2px solid #e0f2fe99;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:inset 2px 2px 0 #fff8,inset -2px -2px 0 #0004,0 8px 18px #0006}
.lbd-crystalFrame3d .halo{perspective:calc(var(--av)*4)}
.lbd-crystalFrame3d .halo .fr{position:absolute;inset:-14%;border-radius:22%;border:calc(var(--av)*.06) solid #e0f2fecc;box-shadow:inset 3px 3px 0 #fff,inset -3px -3px 0 #67e8f966,0 0 10px #a5f3fc;background:linear-gradient(135deg,#ffffff30,transparent 60%);animation:lb-tilt 5s ease-in-out infinite}
@keyframes lb-tilt{0%,100%{transform:rotateX(15deg) rotateY(-20deg)}50%{transform:rotateX(-15deg) rotateY(20deg)}}
.lbd-crystalFrame3d .lr-nm{color:#fff;text-shadow:0 1px 4px #000a}.lbd-crystalFrame3d .lr-vl{color:#a5f3fc}
.lbd-medal3d .lr-card{border-radius:calc(var(--rh)*.2);background:linear-gradient(90deg,#111827f0,#1f2937d8);border-inline-start:calc(var(--rh)*.06) solid var(--rc)}
.lbd-medal3d .halo{perspective:calc(var(--av)*3)}
.lbd-medal3d .halo .cn{position:absolute;inset:-10%;border-radius:50%;background:radial-gradient(circle,transparent 60%,var(--rc) 61%,color-mix(in srgb,var(--rc) 50%,#000) 70%,var(--rc) 72%,color-mix(in srgb,var(--rc) 70%,#fff) 78%,transparent 79%);animation:lb-coin 4s ease-in-out infinite;filter:drop-shadow(0 3px 2px #000a)}
@keyframes lb-coin{0%,100%{transform:rotateY(0)}50%{transform:rotateY(180deg)}}
.lbd-medal3d .halo .rib{position:absolute;top:-44%;width:28%;height:50%;z-index:0!important;background:linear-gradient(90deg,var(--rc) 0 30%,#fff 30% 70%,var(--rc) 70%);clip-path:polygon(0 0,100% 0,100% 100%,50% 82%,0 100%);filter:brightness(.8)}
.lbd-medal3d .halo .rib.l{left:20%;transform:rotate(14deg)}.lbd-medal3d .halo .rib.r{right:20%;transform:rotate(-14deg)}
.lbd-medal3d .rx .halo .rib,.lbd-medal3d .r4 .halo .rib,.lbd-medal3d .r5 .halo .rib,.lbd-medal3d .r1 .lr-av .crw{display:none}
.lbd-medal3d .lr-nm{color:#fff}.lbd-medal3d .lr-vl{color:var(--rc)}
.lbd-hologram3d .lr-card{border-radius:calc(var(--rh)*.15);background:repeating-linear-gradient(0deg,#67e8f914 0 2px,transparent 2px 5px),linear-gradient(90deg,#083344b0,#0c4a6e70);border:1px solid #67e8f9aa;transform:perspective(500px) rotateX(6deg)}
.lbd-hologram3d .lr-av{perspective:calc(var(--av)*3)}
.lbd-hologram3d .lr-av img{filter:hue-rotate(160deg) saturate(1.5) brightness(1.15);opacity:.85;animation:lb-h3 4s ease-in-out infinite}
@keyframes lb-h3{0%,100%{transform:rotateY(-18deg)}50%{transform:rotateY(18deg)}}
.lbd-hologram3d .halo .base{position:absolute;left:0;right:0;bottom:-22%;height:20%;border-radius:50%;background:radial-gradient(ellipse,#67e8f9,transparent 70%);z-index:0!important}
.lbd-hologram3d .halo .hr{position:absolute;left:-6%;right:-6%;height:24%;border-radius:50%;border:1.5px solid #67e8f9;box-shadow:0 0 6px #67e8f9;animation:lb-hr 3s ease-in-out infinite}
.lbd-hologram3d .halo .a{bottom:-8%}.lbd-hologram3d .halo .b{bottom:30%;animation-delay:-1.5s;opacity:.6}
@keyframes lb-hr{50%{transform:translateY(-40%) scale(.9);opacity:.3}}
.lbd-hologram3d .halo .scan{position:absolute;inset:0;border-radius:50%;z-index:3!important;background:repeating-linear-gradient(0deg,#00000030 0 2px,transparent 2px 4px)}
.lbd-hologram3d .lr-nm{color:#cffafe;text-shadow:0 0 6px #67e8f9}.lbd-hologram3d .lr-vl{color:#67e8f9}
.lbd-lightCube3d .lr-card{border-radius:calc(var(--rh)*.1);background:linear-gradient(90deg,#020617f0,#0f172ad0);border:1px solid color-mix(in srgb,var(--rc) 60%,transparent)}
.lbd-lightCube3d .halo{perspective:calc(var(--av)*4)}
.lbd-lightCube3d .lr{--czf:.56}.lbd-lightCube3d .lr.k-row{--czf:.4}.lbd-lightCube3d .halo .cb{--cz:calc(var(--av)*var(--czf));position:absolute;inset:calc(var(--av) * (0.5 - var(--czf)));z-index:0!important;transform-style:preserve-3d;animation:lb-cube 8s linear infinite}
.lbd-lightCube3d .halo .cb i{position:absolute;inset:0;border:1.5px solid var(--rc);background:color-mix(in srgb,var(--rc) 14%,transparent);box-shadow:0 0 10px color-mix(in srgb,var(--rc) 60%,transparent) inset}
.lbd-lightCube3d .halo .f1{transform:translateZ(var(--cz))}.lbd-lightCube3d .halo .f2{transform:rotateY(180deg) translateZ(var(--cz))}.lbd-lightCube3d .halo .f3{transform:rotateY(90deg) translateZ(var(--cz))}.lbd-lightCube3d .halo .f4{transform:rotateY(-90deg) translateZ(var(--cz))}.lbd-lightCube3d .halo .f5{transform:rotateX(90deg) translateZ(var(--cz))}.lbd-lightCube3d .halo .f6{transform:rotateX(-90deg) translateZ(var(--cz))}
@keyframes lb-cube{from{transform:rotateX(-20deg) rotateY(0)}to{transform:rotateX(-20deg) rotateY(360deg)}}
.lbd-lightCube3d .lr-nm{color:#f8fafc}.lbd-lightCube3d .lr-vl{color:var(--rc)}
.lbd-floatCrown3d .lr-card{border-radius:calc(var(--rh)*.25);background:linear-gradient(90deg,#1c1404e8,#2a1e05c8);border:1px solid #f5c54277}
.lbd-floatCrown3d .halo .ring{position:absolute;inset:-5%;border-radius:50%;border:calc(var(--av)*.04) solid var(--rc)}
.lbd-floatCrown3d .lr-av{perspective:calc(var(--av)*3)}
.lbd-floatCrown3d .halo .fc{position:absolute;top:-52%;left:22%;width:56%;color:var(--rc);filter:drop-shadow(0 2px 0 color-mix(in srgb,var(--rc) 50%,#000));animation:lb-fc 3.2s ease-in-out infinite;z-index:3!important}
.lbd-floatCrown3d .halo .fc svg{width:100%;display:block}
@keyframes lb-fc{0%,100%{transform:translateY(0) rotateY(0)}50%{transform:translateY(-18%) rotateY(180deg)}}
.lbd-floatCrown3d .halo .fs{position:absolute;top:-6%;left:30%;width:40%;height:8%;border-radius:50%;background:#0008;filter:blur(2px);animation:lb-fs 3.2s ease-in-out infinite;z-index:3!important}
@keyframes lb-fs{50%{transform:scale(.6);opacity:.5}}
.lbd-floatCrown3d .r1 .lr-av .crw{display:none}.lbd-floatCrown3d .rx .halo .fc,.lbd-floatCrown3d .rx .halo .fs,.lbd-floatCrown3d .r4 .halo .fc,.lbd-floatCrown3d .r4 .halo .fs,.lbd-floatCrown3d .r5 .halo .fc,.lbd-floatCrown3d .r5 .halo .fs{display:none}
.lbd-floatCrown3d .k-row .halo .fc{top:-46%;width:44%;left:28%}
.lbd-floatCrown3d .lr-nm{color:#fff3d1}.lbd-floatCrown3d .lr-vl{color:var(--rc)}
.lbd-energySphere3d .lr-card{border-radius:calc(var(--rh)*.5);background:linear-gradient(90deg,#0b1430f0,#1e1b4bc0);border:1px solid #38bdf855}
.lbd-energySphere3d .halo .sp{position:absolute;inset:-22%;z-index:0!important;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ffffff55,#38bdf844 30%,#6366f122 60%,transparent 72%);box-shadow:inset 0 0 20px #38bdf8aa,0 0 20px #38bdf866;animation:lb-breath 2.6s ease-in-out infinite;display:none}
.lbd-energySphere3d .halo .gy{inset:-20%;display:none}
.lbd-energySphere3d .r1 .halo .sp,.lbd-energySphere3d .r1 .halo .gy{display:block}
.lbd-energySphere3d .halo .a{animation:lb-g1 2.4s linear infinite}.lbd-energySphere3d .halo .b{border-color:#c4b5fd;box-shadow:0 0 6px #c4b5fd;animation:lb-g2 3.2s linear infinite}
.lbd-energySphere3d .lr:not(.r1) .lr-av img{box-shadow:0 0 0 calc(var(--av)*.04) var(--rc),0 0 12px var(--rc)}
.lbd-energySphere3d .lr-nm{color:#e0f2fe}.lbd-energySphere3d .lr-vl{color:var(--rc)}
.lbd-premiumGlass3d .lr-card{border-radius:calc(var(--rh)*.22);background:linear-gradient(120deg,#ffffff40,#ffffff10 40%,#ffffff26 60%,#ffffff0c);border:1px solid #ffffff88;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:6px 6px 0 -1px #ffffff22,10px 10px 18px #0007,inset 0 1px 0 #fff}
.lbd-premiumGlass3d .k-row .lr-card{transform:perspective(600px) rotateY(-8deg);transform-origin:right}
.lbd-premiumGlass3d .halo .ring{position:absolute;inset:-6%;border-radius:50%;border:calc(var(--av)*.05) solid #ffffff66;box-shadow:0 0 0 1px var(--rc),4px 4px 0 #ffffff22,6px 8px 12px #0007}
.lbd-premiumGlass3d .lr-nm{color:#fff;text-shadow:0 1px 4px #000a}.lbd-premiumGlass3d .lr-vl{color:var(--rc)}
.lbd-b6o63d .lr-card{border-radius:calc(var(--rh)*.15);border:1px solid transparent;background:linear-gradient(90deg,#000000f0,#06122ed8) padding-box,linear-gradient(90deg,#c0c7d4,#2f7bff,#c0c7d4) border-box;box-shadow:0 3px 0 #1d4ed8,0 6px 0 #0b2a6b,0 calc(var(--rh)*.3) calc(var(--rh)*.3) #000a}
.lbd-b6o63d .halo .gy{inset:-16%}
.lbd-b6o63d .halo .a{border-color:#2f7bff;animation:lb-g1 3.4s linear infinite}.lbd-b6o63d .halo .b{border-color:#c0c7d4;box-shadow:0 0 6px #c0c7d4;animation:lb-g2 4.6s linear infinite}
.lbd-b6o63d .halo .ring{position:absolute;inset:-5%;border-radius:50%;border:calc(var(--av)*.04) solid #2f7bff;box-shadow:0 0 10px #2f7bff}
.lbd-b6o63d .r1 .lr-av .crw{color:#c0c7d4;filter:drop-shadow(0 2px 0 #2f7bff) drop-shadow(0 4px 6px #000)}
.lbd-b6o63d .lr-nm{background:linear-gradient(180deg,#fff,#aeb8c8);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:none}.lbd-b6o63d .lr-vl{color:#7fb2ff}
.lbd-mini .lr.k-row .lr-card{top:20%;bottom:20%}
.lbd-mini .lr-av .halo .ring{position:absolute;inset:-6%;border-radius:50%;border:calc(var(--av)*.06) solid var(--rc)}
.lbd-miniPinkHalo .lr-card{border-radius:999px;background:linear-gradient(90deg,#831843e0,#500724c0)}
.lbd-miniPinkHalo .halo .ring{box-shadow:0 0 10px 2px #f472b6,0 0 18px #f9a8d488;border-color:#f9a8d4!important;animation:lb-breath 2.6s ease-in-out infinite}
.lbd-miniGoldCrown .lr-card{border-radius:calc(var(--rh)*.15);background:#0a0a0ae0;border:1px solid #f5c54255}
.lbd-miniGoldCrown .r2 .lr-av .crw,.lbd-miniGoldCrown .r3 .lr-av .crw{display:block;color:var(--rc);width:50%;left:25%;top:-36%}
.lbd-miniCrystal .lr-card{border-radius:calc(var(--rh)*.15);background:linear-gradient(120deg,#ffffff30,#a5f3fc12);border:1px solid #e0f2fe88;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
.lbd-miniCrystal .halo .ring{border-width:2px!important;box-shadow:0 0 8px #a5f3fc}
.lbd-compactRoyal .lr-card{border-radius:calc(var(--rh)*.12);border:1px solid transparent;background:linear-gradient(90deg,#2e1065f0,#1e1b4bd8) padding-box,linear-gradient(90deg,#f5c542,#a78bfa) border-box}
.lbd-floatingMini .lr-card{border-radius:calc(var(--rh)*.4);background:#111827e8;box-shadow:0 8px 14px #0008;animation:lb-f3 3s ease-in-out infinite;animation-delay:var(--d,0s)}
.lbd-floatingMini .lr-av{animation:lb-f3 3s ease-in-out infinite;animation-delay:var(--d,0s)}
.lbd-slimNeon .lr.k-row .lr-card{top:36%;bottom:36%;border-radius:99px;background:var(--rc);box-shadow:0 0 10px var(--rc);opacity:.9}
.lbd-slimNeon .lr.k-row .lr-nm,.lbd-slimNeon .lr.k-row .lr-vl{top:12%;transform:none;text-shadow:0 0 6px var(--rc),0 1px 3px #000}
.lbd-slimNeon .k-pod .lr-card,.lbd-slimNeon .k-hero .lr-card{background:#05050af0;border:1px solid var(--rc);box-shadow:0 0 10px var(--rc)}
.lbd-slimNeon .halo .ring{box-shadow:0 0 8px var(--rc)}
.lbd-miniGlass .lr-card{border-radius:calc(var(--rh)*.3);background:linear-gradient(180deg,#ffffff2a,#ffffff10);border:1px solid #ffffff55;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
.lbd-miniGlass .halo .ring{border-color:#ffffffaa!important;border-width:2px!important}
.lbd-minimalWhite .lr-card{border-radius:calc(var(--rh)*.12);background:#fffffff0;box-shadow:0 4px 12px #0004}
.lbd-minimalWhite .lr-nm{color:#0f172a;text-shadow:none}.lbd-minimalWhite .lr-vl{color:#334155}
.lbd-minimalWhite .halo .ring{border-width:2px!important}.lbd-minimalWhite .k-pod .lr-rk,.lbd-minimalWhite .k-hero .lr-rk{color:#0f172a;text-shadow:none;opacity:.25}
.lbd-minimalBlack .lr-card{border-radius:calc(var(--rh)*.12);background:#00000099}
.lbd-minimalBlack .halo .ring{border-width:1.5px!important;opacity:.7}.lbd-minimalBlack .lr-card .swp{display:none}
.lbd-miniDiamond .lr-card{border-radius:calc(var(--rh)*.2);background:linear-gradient(90deg,#0b1430e8,#1e1b4bc8);border:1px solid #a5f3fc55}
.lbd-miniDiamond .halo .gm{--gem:#a5f3fc;width:26%;animation:lb-gem 2.4s ease-in-out infinite}.lbd-miniDiamond .halo .g0{top:-14%;right:-14%}.lbd-miniDiamond .halo .g1{bottom:-12%;left:-14%;animation-delay:-1.2s}
.lbd-miniCloud .lr-card{border-radius:999px;background:linear-gradient(90deg,#f9a8d4,#c4b5fd);box-shadow:0 0 10px #f9a8d466}
.lbd-miniCloud .lr-nm,.lbd-miniCloud .lr-vl{color:#fff;text-shadow:0 1px 3px #7c3aed}
.lbd-miniCloud .halo .cl{background:radial-gradient(circle,#fff 30%,#fbcfe8 50%,transparent 70%);width:60%;height:40%}.lbd-miniCloud .halo .c0{left:-30%;bottom:-10%}.lbd-miniCloud .halo .c1{right:-30%;bottom:-6%;animation-delay:-3s}
.lbd-miniEsports .lr-card{clip-path:polygon(0 0,calc(100% - var(--rh)*.3) 0,100% 50%,calc(100% - var(--rh)*.3) 100%,0 100%);background:linear-gradient(90deg,#111827f0,#1f2937d8);border-bottom:2px solid var(--rc)}
.lbd-miniEsports .halo .hx{position:absolute;inset:-12%;clip-path:polygon(25% 2%,75% 2%,99% 50%,75% 98%,25% 98%,1% 50%);background:var(--rc);z-index:0!important}
.lbd-miniHologram .lr-card{border-radius:calc(var(--rh)*.15);background:repeating-linear-gradient(0deg,#67e8f914 0 2px,transparent 2px 4px),#083344a0;border:1px solid #67e8f999}
.lbd-miniHologram .lr-av img{filter:hue-rotate(160deg) saturate(1.5);opacity:.88}.lbd-miniHologram .halo .ring{box-shadow:0 0 8px #67e8f9}
.lbd-miniHologram .lr-nm{color:#cffafe}.lbd-miniHologram .lr-vl{color:#67e8f9}
.lbd-miniPremium .lr-card{border-radius:2px;background:#000000e8;border-top:1px solid #d6b55e;border-bottom:1px solid #d6b55e}
.lbd-miniPremium .halo .ring{border-width:1.5px!important;box-shadow:0 0 0 calc(var(--av)*.05) #000,0 0 0 calc(var(--av)*.07) #d6b55e}
.lbd-miniPremium .lr-vl{color:#d6b55e}
.lbd-b6o6UltimateMini .lr-card{border-radius:calc(var(--rh)*.2);border:1px solid transparent;background:linear-gradient(90deg,#000000f0,#06122ed8) padding-box,linear-gradient(90deg,#c0c7d4,#2f7bff) border-box;box-shadow:0 0 10px #2f7bff44}
.lbd-b6o6UltimateMini .halo .ring{box-shadow:0 0 8px #2f7bff}
.lbd-b6o6UltimateMini .lr-nm{background:linear-gradient(180deg,#fff,#aeb8c8);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:none}.lbd-b6o6UltimateMini .lr-vl{color:#7fb2ff}
`);
}

// ================= أهداف الدعم المصغّرة =================
export const SG_SOURCES=[["giftPoints","نقاط هدايا TikTok"],["gift","هدية TikTok محددة"],["giftCount","عدد هدايا TikTok"],["likes","التكبيس"],["donation","الدونيشن المالي"],["follows","المتابعون الجدد"],["share","المشاركات (عند توفرها)"],["subs","الاشتراكات"],["custom","مخصص (يدوي)"]];
export const SG_AVAIL={follows:"يعتمد على وصول أحداث المتابعة من TikTok",share:"غير مؤكدة: تُحسب فقط إذا أرسلت المكتبة غير الرسمية حدث المشاركة فعلاً",subs:"يصل فقط للحسابات المفعّل لها الاشتراك في TikTok",custom:"تحدّثه يدوياً من لوحة التحكم"};
export const SG_ICONS={giftPoints:"💎",gift:"🦁",giftCount:"🎁",likes:"❤️",donation:"💰",follows:"👥",subs:"⭐",custom:"🎯"};
export const SG_DESIGNS=[
 {id:"miniPill",name:"Mini Floating Goal",shape:"pill"},{id:"diamond",name:"Diamond Goal",shape:"pill"},{id:"royalGold",name:"Royal Gold Goal",shape:"card"},
 {id:"neonBlue",name:"Neon Blue Goal",shape:"pill"},{id:"glass",name:"Glass Goal",shape:"card"},{id:"ring",name:"Progress Ring",shape:"ring"},
 {id:"vertical",name:"Vertical Goal",shape:"vertical"},{id:"capsule",name:"Floating Capsule",shape:"capsule"},{id:"hud",name:"Gaming HUD",shape:"card"},{id:"b6o6",name:"B6O6 Signature",shape:"pill"},
];
/** قيمة الهدف الحالية: (القيمة الحالية − نقطة البداية) + الرصيد اليدوي */
export function sgRaw(w,src){
 const D=src.D||{tot:{}}, t=D.tot||{};
 switch(w.source){
  case "likes": return t.likes||0; case "giftPoints": return t.gifts||0; case "giftCount": return t.giftCount||0;
  case "gift": return (D.giftTot||{})[String(w.giftKey||"")]||0;
  case "follows": return t.follows||0; case "subs": return t.subs||0; case "share": return t.shares||0;
  case "donation": { const DN=src.DN||{list:[]}, DC=src.DC||defaultDonCfg(), cur=w.currency||DC.currency; let s=0; for(const d of DN.list) if(d.currency===cur&&d.t>=(w.since||0)) s+=Math.max(0,d.amount-(d.refunded||0)); return s }
 }
 return 0;
}
export function sgProgress(w,src){ const raw=w.source==="donation"?sgRaw(w,src):Math.max(0,sgRaw(w,src)-(+w.offset||0)); const cur=(+w.base||0)+(w.source==="custom"?0:raw);
 // مراحل التحدي (levelStages — منفصلة عن w.stages الخاصة بنسب تصاميم الأهداف المرئية): «1000,1500,2000» — التقدم يُحسب من بداية المرحلة الحالية إلى هدفها
 const st=String(w.levelStages||"").split(/[,،\s]+/).map(Number).filter(n=>n>0).sort((a,b)=>a-b);
 if(st.length){ let i=st.findIndex(n=>cur<n); const done=i<0; if(done) i=st.length-1; const tgt=st[i], start=done?0:(i?st[i-1]:0);
  return {cur,tgt,start,level:done?st.length:i+1,levels:st.length,pct:done?100:Math.min(100,Math.max(0,(cur-start)/Math.max(1,tgt-start)*100)),done} }
 const tgt=Math.max(1,+w.target||1); return {cur,tgt,pct:Math.min(100,cur/tgt*100),done:cur>=tgt} }
export function sgFmt(w,v,src){ if(w.source==="donation"){ const DC=src.DC||defaultDonCfg(); return fmtMoney(v,w.currency||DC.currency) } return Math.floor(v).toLocaleString("en-US") }

/** مصدر الأحداث لكل عنصر Pro — كل قائمة تستقبل أحداث مصدرها فقط */
const LB_LISTEN={giftsDay:["gift"],giftsWeek:["gift"],giftsMonth:["gift"],gifts:["gift"],giftCount:["gift"],gift:["gift"],likes:["like"],comments:["comment"],interact:["like","gift","comment"],donations:["donation","donation_refund","donation_session","donation_clear_tests"]};
const LB_SCOPE={giftsDay:"gifts",giftsWeek:"gifts",giftsMonth:"gifts",gifts:"gifts",giftCount:"gifts",gift:"gifts",likes:"likes",comments:"comments",interact:"interact"};
const SG_LISTEN={share:["share"],giftPoints:["gift"],gift:["gift"],giftCount:["gift"],likes:["like"],donation:["donation","donation_refund","donation_clear_tests"],follows:["follow"],subs:["subscribe"],custom:[]};
const SG_SCOPE={share:"follows",giftPoints:"gifts",gift:"gifts",giftCount:"gifts",likes:"likes",follows:"follows"};
export function proAffects(w,ev){
 const lb=w.type==="lb", s=w.source||(lb?"gifts":"likes");
 if(ev.type==="reset"){ const sc=ev.scope||"all"; if(sc==="all") return true; const mine=(lb?LB_SCOPE:SG_SCOPE)[s]; return !!mine&&(sc===mine||(mine==="interact"&&["likes","gifts","comments"].includes(sc))) }
 if(ev.type==="shuffle") return lb&&(ev.scope===LB_SCOPE[s]);
 return ((lb?LB_LISTEN:SG_LISTEN)[s]||[]).includes(ev.type);
}


/** أماكن الصفوف لكل عدد مراكز — تخطيط مختلف فعلياً وليس تصغيراً فقط */
export function lbSlots(N,W,H,g){
 const S=[];
 const rows=(n,x,y,w,h,from,weights)=>{ const tw=weights.reduce((a,b)=>a+b,0), u=(h-g*(n-1))/tw; let yy=y; for(let i=0;i<n;i++){ const hh=u*weights[i]; S[from+i]={x,y:yy,w,h:hh,k:"row"}; yy+=hh+g } };
 const podium=(y,h)=>{ const cw=(W-g*2)/3, lift=h*.13; S[0]={x:cw+g,y,w:cw,h,k:"pod"}; S[1]={x:(cw+g)*2,y:y+lift,w:cw,h:h-lift,k:"pod"}; S[2]={x:0,y:y+lift*1.5,w:cw,h:h-lift*1.5,k:"pod"} };
 if(N===1){ S[0]={x:0,y:0,w:W,h:H,k:"hero"} }
 else if(N===3){ podium(0,H) }
 else if(N===5){ const ph=H*.6; podium(0,ph); rows(2,W*.04,ph+g,W*.92,H-ph-g,3,[1,1]) }
 else if(N>=20){ const per=Math.ceil(N/2), cw=(W-g)/2; rows(per,cw+g,0,cw,H,0,Array(per).fill(1)); rows(N-per,0,0,cw,H*(N-per)/per,per,Array(N-per).fill(1)) }
 else if(N>=10){ rows(N,0,0,W,H,0,Array.from({length:N},(_,i)=>i<3?1.3:1)) }
 else rows(N,0,0,W,H,0,Array.from({length:N},(_,i)=>i===0?1.25:1));
 return S;
}
