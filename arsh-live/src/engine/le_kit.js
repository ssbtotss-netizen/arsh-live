// ====== أدوات مشتركة لتصاميم «آخر التفاعلات» 42–80 (رسم SVG + تعريف موحّد) ======
import { leRegister } from "./leview.js";
export const LK_SVG='<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">';
export const lkP=(cx,cy,a,r)=>[+(cx+Math.cos(a*Math.PI/180)*r).toFixed(1),+(cy+Math.sin(a*Math.PI/180)*r).toFixed(1)];
export const lkSeed=s=>()=>((s=(s*9301+49297)%233280)/233280);
export const lkSpark=(x,y,s)=>`M${x} ${y-s}Q${x} ${y} ${x+s} ${y}Q${x} ${y} ${x} ${y+s}Q${x} ${y} ${x-s} ${y}Q${x} ${y} ${x} ${y-s}Z`;
/** حجر كريم مضلّع (وجه علوي + جوانب) عند x,y بحجم s */
export const lkGem=(x,y,s,c1,c2,cls="")=>`<g transform="translate(${x} ${y})" class="${cls}"><path d="M${-s} ${-s*.35}L${-s*.55} ${-s}H${s*.55}L${s} ${-s*.35}L0 ${s}Z" fill="${c1}" stroke="#fff" stroke-width=".6" stroke-opacity=".7"/><path d="M${-s} ${-s*.35}H${s}L0 ${s}Z" fill="${c2}" opacity=".55"/><path d="M${-s*.55} ${-s}L${-s*.2} ${-s*.35}L0 ${-s}L${s*.2} ${-s*.35}L${s*.55} ${-s}" fill="none" stroke="#fff" stroke-width=".5" opacity=".8"/><path d="M${-s} ${-s*.35}L${-s*.3} ${-s*.35}L0 ${s}Z" fill="#fff" opacity=".28"/></g>`;
/** نجمة ثمانية (الخاتم العربي) */
export const lkStar8=(cx,cy,r,ri)=>{ let d=""; for(let i=0;i<16;i++){ const [x,y]=lkP(cx,cy,i*22.5-90,i%2?ri:r); d+=(i?"L":"M")+x+" "+y } return d+"Z" };
export const lkPoly=(cx,cy,r,n,rot=-90)=>{ let d=""; for(let i=0;i<n;i++){ const [x,y]=lkP(cx,cy,rot+i*360/n,r); d+=(i?"L":"M")+x+" "+y } return d+"Z" };
export const lkStars=(seed,n,minR=58,cls="lk-st")=>{ const R=lkSeed(seed); return Array.from({length:n},()=>{ let x,y; do{ x=6+R()*188; y=6+R()*176 }while(Math.hypot(x-100,y-100)<minR); return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(.6+R()*1.3).toFixed(1)}" class="${cls}" style="animation-delay:${(-R()*3).toFixed(1)}s"/>` }).join("") };
export const LK_CSS=`@keyframes lk-tw{0%,100%{opacity:.15}50%{opacity:1}}@keyframes lk-spin{to{transform:rotate(360deg)}}@keyframes lk-spinr{to{transform:rotate(-360deg)}}@keyframes lk-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}@keyframes lk-pulse{0%,100%{opacity:.55}50%{opacity:1}}
@keyframes lk-pop{0%{opacity:0;transform:scale(.4)}70%{opacity:1;transform:scale(1.08)}100%{opacity:1;transform:none}}@keyframes lk-big{35%{transform:scale(1.18)}}@keyframes lk-fall{0%{opacity:0;transform:translateY(-20px)}15%{opacity:1}100%{opacity:0;transform:translateY(70px)}}
@keyframes lk-rise{0%{opacity:0;transform:translateY(10px)}25%{opacity:1}100%{opacity:0;transform:translateY(-40px)}}@keyframes lk-flap{0%,100%{transform:scaleX(1)}50%{transform:scaleX(.55)}}@keyframes lk-dash{to{stroke-dashoffset:-60}}@keyframes lk-swing{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
.lk-st{fill:#fff;animation:lk-tw calc(2.8s / var(--as,1)) ease-in-out infinite}
.lk-spin{transform-box:view-box;transform-origin:100px 100px;animation:lk-spin calc(var(--sd,24s) / var(--as,1)) linear infinite}.lk-spinr{transform-box:view-box;transform-origin:100px 100px;animation:lk-spinr calc(var(--sd,30s) / var(--as,1)) linear infinite}
.lk-bob{transform-box:fill-box;transform-origin:center;animation:lk-bob calc(3s / var(--as,1)) ease-in-out infinite}
.le-enter .lk-in{transform-box:view-box;transform-origin:100px 100px;animation:lk-pop calc(var(--d)*.8) cubic-bezier(.2,1.3,.3,1) both}
.lk-hit .lk-hb{transform-box:view-box;transform-origin:100px 100px;animation:lk-big .9s ease}`;
const lkFlash=c=>{ c.classList.remove("lk-hit"); void c.offsetWidth; c.classList.add("lk-hit"); setTimeout(()=>c.classList.remove("lk-hit"),1000) };
/** لوحة الاسم الخاصة بالتصميم في وضع «شفاف» */
export const lkPlate=(id,c1,c2,bg1,bg2,r=.6)=>`.led-${id}.lec-clear .le-plate{border-radius:calc(var(--u)*${r});background:linear-gradient(180deg,${bg1},${bg2});border:calc(var(--u)*.06) solid ${c1};box-shadow:0 0 calc(var(--u)*.8*var(--gl)) ${c2}}`;
/** تعريف تصميم: كل الطبقات داخل lk-hb تكبر عند كل حدث جديد */
export function lkDef(o){ const wrap=f=>f?()=>{ const s=f(); return s?s.replace(LK_SVG,LK_SVG+'<g class="lk-hb lk-in">').replace(/<\/svg>$/,"</g></svg>"):"" }:()=>"";
 const {plateCss,...rest}=o; return {lay:"stack",...rest,back:wrap(o.back),front:wrap(o.front),pulse:lkFlash,css:(o.css||"").replace(/\.D\b/g,".led-"+o.id)+(o.plateCss?lkPlate(o.id,...o.plateCss):"")} }
let LK_ADDED=false;
export function lkRegister(list){ leRegister(list.map((d,i)=>{ if(i===0&&!LK_ADDED){ LK_ADDED=true; return {...d,css:d.css+LK_CSS} } return d })) }
