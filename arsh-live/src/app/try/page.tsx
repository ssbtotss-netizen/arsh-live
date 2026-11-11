"use client";
// وضع الضيف: نفس لوحة التحكم بدون حساب — كل شيء يُحفظ على هذا الجهاز فقط، ولا اتصال بحساب أو قاعدة بيانات.
import { useEffect } from "react";
export default function TryPage() {
  useEffect(() => {
    (window as any).B6O6_CONFIG = undefined;
    const s = document.createElement("script"); s.src = "/b6o6-dashboard.js?v=" + (process.env.NEXT_PUBLIC_BUILD_ID || "1"); document.body.appendChild(s);
  }, []);
  return (<>
    <div style={{ position: "fixed", insetInline: 0, bottom: 0, zIndex: 999, background: "#1e293bee", color: "#fff", padding: "8px 14px", textAlign: "center", fontSize: 13 }}>
      وضع الضيف — الإعدادات محفوظة على هذا الجهاز فقط ولا تُعتبر بيانات بث حقيقية. <a href="/login" style={{ color: "#7fb3ff", fontWeight: 800 }}>أنشئ حساباً مجانياً</a> لحفظها وروابط OBS دائمة.
    </div>
    <div id="root"><div className="empty" style={{ paddingTop: 80 }}>جارٍ التحميل…</div></div><div className="toast" id="toast" />
  </>);
}
