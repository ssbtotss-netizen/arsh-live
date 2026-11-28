// ====== شعار تنبيهات المتابعين: شعار B6O6 التقني (هوية رسمية — بدون شخصيات كرتونية) ======
// ملاحظة توافق: قيم قديمة محفوظة في طبقات المستخدمين (duck/robot/cat/dragon/ghost/pixel/astro) تُعرض الآن كشعار B6O6 الأنيق.
import { emblemSVG, EMB_TONES } from "./brand.js";

/** طابع الشعار حسب النسخة (المفاتيح القديمة محفوظة للتوافق مع الطبقات الحالية) */
export const DUCK_VARIANTS={classic:{tone:"blue"},royal:{tone:"gold",glow:"#f6c94a"},gaming:{tone:"neon"},neon:{tone:"neon",glow:"#22e1ff"},diamond:{tone:"diamond"},
 saudi:{tone:"emerald"},mini:{tone:"blue"},dancing:{tone:"silver"},flying:{tone:"black"},legendary:{tone:"gold",glow:"#ffd000",live:true}};
export const EMBLEM_VARIANT_NAMES={classic:"أزرق المنصة",royal:"ذهبي",gaming:"نيون",neon:"نيون مضيء",diamond:"ماسي",saudi:"زمردي",mini:"صغير",dancing:"فضي",flying:"أسود فاخر",legendary:"ذهبي أسطوري"};
/** شعار B6O6 (الهوية الرسمية) — o.tone أو ألوان مباشرة */
export function duckSVG(o={}){ const t=EMB_TONES[o.tone]||{}; return emblemSVG(Object.assign({},t,{glow:o.glow||o.aura||"",live:!!o.live})).replace('class="b6-emblem"','class="fa-chsvg b6-emblem"') }
export const emblemFor=duckSVG;
const EMB=o=>duckSVG(o||{});
/** الاختيار الوحيد المعروض: الشعار. المفاتيح القديمة تُعرض كشعار (لا شخصيات كرتونية). */
export const FA_CHARS={emblem:["شعار B6O6",EMB]};
export const FA_LEGACY_CHARS=new Set(["duck","robot","cat","dragon","ghost","pixel","astro"]);
/** حركات هادئة فقط */
export const FA_ACTIONS={float:"طفو هادئ",pulse:"نبض خفيف",idle:"ثابت"};
export const FA_CHAR_CSS=`
.fa-char{position:absolute;bottom:8%;width:calc(var(--fu)*2.6*var(--cs,1));height:calc(var(--fu)*2.6*var(--cs,1));z-index:3;pointer-events:none}
.fa-char svg,.fa-char img,.fa-char video{width:100%;height:100%;object-fit:contain;overflow:visible}
.fa-char .b6-emblem{filter:drop-shadow(0 6px 18px rgba(0,0,0,.45))}
.fa-char[class*="fa-act-"]:not(.fa-act-idle):not(.fa-act-pulse){animation:fa-float calc(3.2s/var(--as,1)) ease-in-out infinite}@keyframes fa-float{50%{transform:translateY(-4%)}}
.fa-act-pulse .b6-emblem{animation:fa-pulse calc(2.4s/var(--as,1)) ease-in-out infinite}@keyframes fa-pulse{50%{filter:drop-shadow(0 0 14px rgba(77,141,255,.7))}}
.fa-char .emb-w1,.fa-char .emb-w2{animation:emb-wave calc(2.2s/var(--as,1)) ease-in-out infinite}.fa-char .emb-w2{animation-delay:-1.1s}@keyframes emb-wave{50%{opacity:.35}}
.fa-char .emb-live{animation:lk-pulse 1.4s ease-in-out infinite}.fa-char .emb-glow{animation:lk-pulse 2.6s ease-in-out infinite}
@keyframes lk-pulse{0%,100%{opacity:.55}50%{opacity:1}}@keyframes lk-swing{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
.fa-still .fa-char *,.fa-still .fa-char{animation:none!important}`;
