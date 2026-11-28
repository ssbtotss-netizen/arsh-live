// ====== هوية B6O6 الرسمية: شعار تقني بسيط (بدون شخصيات) ======
// سداسي بحافة متدرجة + علامة تشغيل + موجتا بث. الاسم التجاري «بطوط ستريم» يبقى نصاً فقط.
let EMB_N=0;
/** o: {a: لون أول, b: لون ثانٍ, bg: تعبئة الداخل, glow: هالة, live: نقطة بث} */
export function emblemSVG(o={}){ const id="emb"+(++EMB_N), a=o.a||"#4d8dff", b=o.b||"#9fd0ff", bg=o.bg||"#0a1226";
 return `<svg class="b6-emblem" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-label="B6O6"><defs>
 <linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${b}"/><stop offset=".55" stop-color="${a}"/><stop offset="1" stop-color="${o.c||"#1546c9"}"/></linearGradient>
 <linearGradient id="${id}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${bg}"/><stop offset="1" stop-color="${o.bg2||"#050914"}"/></linearGradient></defs>
 ${o.glow?`<circle cx="60" cy="60" r="56" fill="${o.glow}" opacity=".18" class="emb-glow"/>`:""}
 <path d="M60 8 103 33v54L60 112 17 87V33Z" fill="url(#${id}f)" stroke="url(#${id}g)" stroke-width="5" stroke-linejoin="round"/>
 <path d="M60 19 94 39v42L60 101 26 81V39Z" fill="none" stroke="${a}" stroke-opacity=".22" stroke-width="1.5" stroke-linejoin="round"/>
 <path d="M50 42v36l29-18Z" fill="url(#${id}g)" stroke="url(#${id}g)" stroke-width="3" stroke-linejoin="round"/>
 <path class="emb-w1" d="M84 44a22 22 0 0 1 0 32" fill="none" stroke="${b}" stroke-width="4" stroke-linecap="round"/>
 <path class="emb-w2" d="M36 44a22 22 0 0 0 0 32" fill="none" stroke="${b}" stroke-opacity=".55" stroke-width="4" stroke-linecap="round"/>
 ${o.live?`<circle cx="92" cy="26" r="6" fill="#ef4444" stroke="${bg}" stroke-width="3" class="emb-live"/>`:""}</svg>` }
/** ألوان جاهزة للشعار حسب الطابع */
export const EMB_TONES={blue:{},gold:{a:"#f6c94a",b:"#fff1b8",c:"#b7791f",bg:"#1a1306"},silver:{a:"#cbd5e1",b:"#ffffff",c:"#64748b",bg:"#0f141c"},
 neon:{a:"#22e1ff",b:"#a5f3fc",c:"#7c3aed",bg:"#0b0420"},emerald:{a:"#34d399",b:"#bbf7d0",c:"#047857",bg:"#03140d"},crimson:{a:"#f87171",b:"#fecaca",c:"#b91c1c",bg:"#1a0505"},
 diamond:{a:"#7cc4ff",b:"#e9fbff",c:"#2b7bd8",bg:"#06122a"},black:{a:"#e5e7eb",b:"#ffffff",c:"#4b5563",bg:"#050505"}};
export const emblemTone=(t,extra)=>emblemSVG(Object.assign({},EMB_TONES[t]||{},extra||{}));
