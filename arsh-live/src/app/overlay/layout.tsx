// صفحات OBS / TikTok LIVE Studio: الشفافية من HTML الخادم نفسه — قبل تحميل JavaScript.
// السبب: صنف body.ov الشفاف كان يُضاف بعد التشغيل فقط، وبعض المتصفحات المضمنة (منها TikTok LIVE Studio)
// تلتقط الصفحة قبل ذلك فتظهر خلفية لوحة التحكم (داكنة/فاتحة) خلف الطبقات.
export default function OverlayLayout({ children }: { children: React.ReactNode }) {
  return (<>
    <style>{`html,body,body.ov,#__next{background:transparent!important;background-color:transparent!important;background-image:none!important}html,body{overflow:hidden;color-scheme:normal}`}</style>
    {children}
  </>);
}
