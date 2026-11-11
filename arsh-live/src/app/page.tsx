// الصفحة الرئيسية العامة لبطوط ستريم: تعريف بالمنصة وصورها وميزاتها والسعر قبل التسجيل أو التحميل
import { SITE } from "./site";
import { billingCfg } from "@/engine/plans.js";
export const revalidate = 300;

async function pricing() { try { const { getBilling } = await import("@/server/appconfig"); return await getBilling(); } catch { return billingCfg({}); } }

const SHOTS = [["follower-alerts", "تنبيهات المتابعين ببطة بطوط المتحركة"], ["studio", "استوديو البث: رتّب عناصرك بالسحب"], ["followers", "عداد المتابعين بالأهداف — 60 تصميماً"], ["latest-events", "آخر التفاعلات — 80 تصميماً متحركاً"], ["leaderboards", "قوائم الداعمين — 184 تصميماً"], ["post-live-stats", "إحصائيات نهاية البث بصورة جاهزة للنشر"], ["bots", "البوتات والقارئ الصوتي"], ["home", "لوحة تحكم عربية بالكامل"]];
const FEATURES = [["🦆", "بطة بطوط الحصرية", "تدخل الشاشة، تلوّح للمتابع الجديد، وتشكره باسمه وصورته — بعشر نسخ."], ["🔔", "تنبيهات المتابعين", "80 تصميماً و30 حركة دخول و20 خروج، طابور بلا تداخل ودمج للمتابعات."], ["👥", "عداد المتابعين", "60 تصميماً مع هدف يتعبّى بالعدد الحقيقي ومراحل تلقائية."], ["🏆", "قوائم الداعمين", "أفضل الداعمين والمكبسين يومياً وأسبوعياً وشهرياً."], ["⏳", "السبثون والمؤقتات", "الهدايا تضيف وقتاً تلقائياً حسب قوانينك."], ["🤖", "البوتات والقارئ الصوتي", "ردود وشكر تلقائي وقراءة صوتية بالعربي."], ["⚡", "الإجراءات التلقائية", "اربط أي هدية أو متابعة بصوت أو صورة أو رسالة."], ["🎵", "طلبات الأغاني", "المشاهدون يطلبون من مكتبتك بأوامر الشات."], ["💬", "شات موحد", "TikTok وYouTube وTwitch وKick في عنصر واحد."], ["📊", "إحصائيات نهاية البث", "تقرير تلقائي بـ36 قالباً وتصدير PNG/JPG/WebP."], ["📣", "Discord وTelegram", "إشعار تلقائي عند بدء البث وملخص بعده."], ["🔗", "رابط البايو", "صفحة روابطك بـ40 تصميماً ورمز QR."]];

export default async function Home() {
  const cfg = await pricing(), u = SITE.url();
  const ld = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: SITE.name, alternateName: [SITE.nameAr, "بطوط", "B6O6"], applicationCategory: "MultimediaApplication", operatingSystem: "Windows, Web", url: u, description: SITE.description, inLanguage: "ar",
    offers: { "@type": "Offer", price: cfg.priceUsd, priceCurrency: "USD", description: cfg.trialEnabled ? `تجربة مجانية ${cfg.trialDays} يوماً ثم $${cfg.priceUsd} شهرياً` : `$${cfg.priceUsd} شهرياً` }, image: u + "/shots/follower-alerts.jpg" };
  return (<main className="lp">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    <style>{CSS}</style>
    <nav className="lp-nav"><a className="lp-brand" href="/"><img src="/logo-160.png" alt="شعار بطوط ستريم" width={40} height={40} /><b>بطوط ستريم</b><span>B6O6 Streaming</span></a>
      <div><a href="#features">الميزات</a><a href="#shots">الصور</a><a href="#price">السعر</a><a href="/download">برنامج ويندوز</a><a className="lp-btn sm" href="/login">دخول</a></div></nav>
    <header className="lp-hero"><div>
      <h1>بطوط ستريم<small>B6O6 Streaming</small></h1>
      <p>كل أدوات بثك المباشر على TikTok LIVE في منصة عربية واحدة — تنبيهات متحركة، عدادات، قوائم داعمين، سبثون، بوتات وقارئ صوتي، وروابط OBS شفافة تشتغل فوراً.</p>
      <div className="lp-cta"><a className="lp-btn" href="/login">ابدأ مجاناً {cfg.trialEnabled && cfg.trialDays ? `${cfg.trialDays} يوماً` : ""}</a><a className="lp-btn ghost" href="/try">جرّب بدون حساب</a><a className="lp-btn ghost" href="/download">⬇️ برنامج ويندوز</a></div>
      <p className="lp-mini">بدون بطاقة للتجربة · عربي بالكامل · يعمل مع OBS وTikTok LIVE Studio</p></div>
      <img className="lp-heroimg" src="/shots/follower-alerts.jpg" alt="تنبيه متابعة جديد ببطة بطوط في منصة بطوط ستريم" width={1440} height={900} /></header>
    <section id="features"><h2>ماذا تقدّم المنصة؟</h2><div className="lp-grid">{FEATURES.map(([i, t, d]) => <div className="lp-card" key={t}><span>{i}</span><h3>{t}</h3><p>{d}</p></div>)}</div></section>
    <section id="shots"><h2>شاهد المنصة من الداخل</h2><p className="lp-sub">صور حقيقية من لوحة التحكم — شاهد كل شيء قبل التسجيل أو التحميل.</p>
      <div className="lp-shots">{SHOTS.map(([f, c]) => <figure key={f}><a href={`/shots/${f}.jpg`} target="_blank"><img src={`/shots/${f}.jpg`} alt={c} loading="lazy" width={1440} height={900} /></a><figcaption>{c}</figcaption></figure>)}</div></section>
    <section id="price"><h2>السعر</h2><div className="lp-price">
      {cfg.trialEnabled && cfg.trialDays ? <><div className="lp-p"><s>${cfg.priceUsd}</s><b>مجاناً</b><span>أول {cfg.trialDays} يوماً</span></div><p>بعد التجربة <b>${cfg.priceUsd} شهرياً</b> لكل الميزات — بدون التزام ولا خصم تلقائي.</p></> : <div className="lp-p"><b>${cfg.priceUsd}</b><span>شهرياً</span></div>}
      <ul>{cfg.perks.map((p: string) => <li key={p}>✓ {p}</li>)}</ul><a className="lp-btn" href="/login">ابدأ الآن</a></div></section>
    <section id="faq"><h2>أسئلة شائعة</h2><div className="lp-faq">
      <details><summary>هل أحتاج تحميل برنامج؟</summary><p>لا. المنصة تعمل من المتصفح، وروابط OBS تُضاف كمصدر متصفح. برنامج ويندوز اختياري لمن يفضّل تطبيقاً مستقلاً.</p></details>
      <details><summary>هل تحتاج كلمة مرور حسابي في TikTok؟</summary><p>لا أبداً. يكفي اسم المستخدم للاتصال بالبث المباشر.</p></details>
      <details><summary>ماذا يحدث بعد انتهاء التجربة؟</summary><p>يبقى حسابك وإعداداتك، وتعمل المنصة بحدود مجانية حتى تشترك بـ${cfg.priceUsd} شهرياً.</p></details>
      <details><summary>هل يظهر شيء من لوحة التحكم في البث؟</summary><p>لا. كل رابط OBS شفاف 100% ويعرض العنصر فقط.</p></details></div></section>
    <footer className="lp-foot"><img src="/logo-160.png" alt="" width={28} height={28} /> بطوط ستريم · B6O6 Streaming © {new Date().getFullYear()} · <a href="/download">برنامج ويندوز</a> · <a href="/login">دخول</a></footer>
  </main>);
}

const CSS = `
.lp{min-height:100vh;background:radial-gradient(1200px 600px at 80% -10%,#2a145855,transparent),radial-gradient(900px 500px at 0% 20%,#0e749033,transparent),#070a14;color:#e6ecff;font-family:"Readex Pro",sans-serif}
.lp a{color:inherit;text-decoration:none}.lp-nav{display:flex;justify-content:space-between;align-items:center;max-width:1200px;margin:auto;padding:16px 20px;gap:12px;flex-wrap:wrap}
.lp-nav>div{display:flex;gap:18px;align-items:center;flex-wrap:wrap}.lp-nav>div a{opacity:.85}.lp-brand{display:flex;align-items:center;gap:10px}.lp-brand b{font-size:20px}.lp-brand span{opacity:.6;font-size:13px}
.lp-btn{display:inline-block;background:linear-gradient(135deg,#ff2d6f,#7c5cff);padding:12px 22px;border-radius:12px;font-weight:800;color:#fff!important;box-shadow:0 8px 24px #7c5cff55}.lp-btn.sm{padding:8px 14px}.lp-btn.ghost{background:#ffffff12;box-shadow:none;border:1px solid #ffffff26}
.lp-hero{max-width:1200px;margin:auto;padding:30px 20px 10px;display:grid;grid-template-columns:1fr 1.25fr;gap:30px;align-items:center}
.lp-hero h1{font-size:clamp(40px,6vw,68px);margin:0;line-height:1.1}.lp-hero h1 small{display:block;font:800 clamp(18px,2.4vw,26px) Orbitron,sans-serif;background:linear-gradient(90deg,#ff2d6f,#7c5cff,#22d3ee);-webkit-background-clip:text;color:transparent;margin-top:8px}
.lp-hero p{font-size:18px;line-height:1.9;opacity:.9}.lp-cta{display:flex;gap:10px;flex-wrap:wrap;margin:18px 0 8px}.lp-mini{font-size:13px!important;opacity:.6!important}
.lp-heroimg{width:100%;height:auto;border-radius:18px;border:1px solid #ffffff1f;box-shadow:0 30px 80px #000a}
.lp section{max-width:1200px;margin:auto;padding:50px 20px}.lp h2{font-size:32px;text-align:center;margin:0 0 8px}.lp-sub{text-align:center;opacity:.7;margin-bottom:20px}
.lp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px;margin-top:20px}.lp-card{background:#ffffff0a;border:1px solid #ffffff17;border-radius:16px;padding:18px}.lp-card span{font-size:30px}.lp-card h3{margin:8px 0 4px}.lp-card p{margin:0;opacity:.75;line-height:1.7;font-size:14px}
.lp-shots{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:16px}.lp-shots figure{margin:0;background:#ffffff08;border:1px solid #ffffff14;border-radius:14px;overflow:hidden}.lp-shots img{width:100%;height:auto;display:block}.lp-shots figcaption{padding:10px 14px;font-weight:700}
.lp-price{max-width:480px;margin:20px auto 0;background:#ffffff0a;border:2px solid #7c5cff;border-radius:20px;padding:26px;text-align:center}.lp-p{display:flex;gap:12px;justify-content:center;align-items:baseline;flex-wrap:wrap}.lp-p s{opacity:.55;font-size:26px}.lp-p b{font-size:44px;color:#4ade80}.lp-p span{background:#4ade8022;color:#4ade80;border-radius:99px;padding:2px 12px}
.lp-price ul{list-style:none;padding:0;text-align:right;line-height:2.1;margin:16px 0}
.lp-faq{max-width:800px;margin:auto}.lp-faq details{background:#ffffff0a;border:1px solid #ffffff14;border-radius:12px;padding:14px 18px;margin-bottom:10px}.lp-faq summary{cursor:pointer;font-weight:700}.lp-faq p{opacity:.8;line-height:1.8}
.lp-foot{text-align:center;padding:30px;opacity:.7;display:flex;gap:8px;justify-content:center;align-items:center;flex-wrap:wrap}
@media(max-width:860px){.lp-hero{grid-template-columns:1fr}}`;
