import { SITE } from "../site";
export const metadata = { title: "تحميل برنامج بطوط ستريم لويندوز", description: "حمّل برنامج بطوط ستريم (B6O6 Streaming) لويندوز، أو ثبّته كتطبيق من المتصفح مباشرة." };
export default function Download() {
  return (<main className="lp" style={{ minHeight: "100vh", background: "#070a14", color: "#e6ecff", padding: "40px 20px", fontFamily: "Readex Pro,sans-serif" }}>
    <div style={{ maxWidth: 760, margin: "auto" }}>
      <a href="/" style={{ color: "#7fb3ff" }}>← بطوط ستريم</a>
      <h1 style={{ fontSize: 40 }}>⬇️ برنامج بطوط ستريم لويندوز</h1>
      <p style={{ lineHeight: 1.9, opacity: .85 }}>نفس لوحة التحكم في نافذة مستقلة على سطح المكتب، مع اختصار في قائمة ابدأ. روابط OBS تبقى كما هي (مصدر متصفح).</p>
      <div style={{ background: "#ffffff0a", border: "1px solid #ffffff17", borderRadius: 16, padding: 20, margin: "18px 0" }}>
        <h2 style={{ marginTop: 0 }}>الطريقة 1: المثبّت (Windows 10/11 — 64 بت)</h2>
        <a href={SITE.windowsDownload} style={{ display: "inline-block", background: "linear-gradient(135deg,#ff2d6f,#7c5cff)", color: "#fff", padding: "12px 22px", borderRadius: 12, fontWeight: 800, textDecoration: "none" }}>تحميل B6O6-Streaming-Setup.exe</a>
        <p style={{ fontSize: 13, opacity: .7, lineHeight: 1.8 }}>البرنامج غير موقّع رقمياً بعد، لذلك قد يظهر تحذير «Windows protected your PC» — اضغط «More info» ثم «Run anyway». يُبنى المثبّت تلقائياً من الكود المصدري المفتوح على GitHub.</p>
      </div>
      <div style={{ background: "#ffffff0a", border: "1px solid #ffffff17", borderRadius: 16, padding: 20 }}>
        <h2 style={{ marginTop: 0 }}>الطريقة 2: تثبيت من المتصفح (بدون تحميل)</h2>
        <ol style={{ lineHeight: 2 }}><li>افتح <a href="/dashboard" style={{ color: "#7fb3ff" }}>لوحة التحكم</a> في Edge أو Chrome.</li><li>اضغط أيقونة «تثبيت التطبيق» في شريط العنوان (أو القائمة ⋯ ← التطبيقات ← تثبيت).</li><li>يظهر بطوط ستريم كتطبيق في قائمة ابدأ وسطح المكتب.</li></ol>
      </div>
    </div></main>);
}
