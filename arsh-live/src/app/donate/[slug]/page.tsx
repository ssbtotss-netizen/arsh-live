"use client";
// صفحة التبرع العامة (ميسّر): الداعم يكتب اسمه ورسالته والمبلغ، والدفع يتم داخل نموذج ميسّر الرسمي
import { use, useEffect, useState } from "react";

export default function Donate({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [info, setInfo] = useState<any>(null);
  const [step, setStep] = useState<"form" | "pay">("form");
  const [err, setErr] = useState("");
  const [f, setF] = useState({ name: "", anonymous: false, amount: "25", message: "" });
  useEffect(() => { fetch(`/api/donate/${slug}`).then(r => r.json()).then(setInfo); }, [slug]);

  const start = async (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    const r = await fetch(`/api/donate/${slug}/intent`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(f) });
    const d = await r.json(); if (!r.ok) return setErr(d.error || "حدث خطأ");
    setStep("pay");
    const css = document.createElement("link"); css.rel = "stylesheet"; css.href = info.formCss; document.head.appendChild(css);
    const s = document.createElement("script"); s.src = info.formJs;
    s.onload = () => (window as any).Moyasar.init({
      element: ".mysr-form", amount: d.amount, currency: "SAR",
      description: `تبرع لـ ${info.name} (${d.intentId})`,
      publishable_api_key: info.publishableKey,
      callback_url: `${location.origin}/donate/${slug}/done?intent=${d.intentId}`,
      methods: ["creditcard", "stcpay"],
      metadata: { intent_id: d.intentId },
    });
    s.onerror = () => setErr("تعذر تحميل نموذج الدفع");
    document.body.appendChild(s);
  };
  if (!info) return null;
  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="card w-full max-w-md">
        <div className="brand" style={{ flexDirection: "column", textAlign: "center" }}>
          <img src="/logo.png" alt="" style={{ width: 96, height: 96 }} /><b style={{ fontSize: 20 }}>ادعم {info.name}</b><small>عبر B6O6 Streaming</small>
        </div>
        {!info.enabled ? <p className="empty">التبرع غير مفعّل حالياً.</p> : step === "form" ? (
          <form onSubmit={start}>
            <div className="fld"><label>اسمك</label><input className="inp" maxLength={40} value={f.name} onChange={e => setF({ ...f, name: e.target.value })} disabled={f.anonymous} /></div>
            <label className="row small" style={{ marginBottom: 12 }}><input type="checkbox" checked={f.anonymous} onChange={e => setF({ ...f, anonymous: e.target.checked })} /> تبرع كمجهول</label>
            <div className="fld"><label>المبلغ (ريال)</label><div className="row">{[10, 25, 50, 100].map(v => <button type="button" key={v} className={"btn sm" + (f.amount === String(v) ? " on" : "")} onClick={() => setF({ ...f, amount: String(v) })}>{v}</button>)}<input className="inp" type="number" min={1} max={20000} value={f.amount} onChange={e => setF({ ...f, amount: e.target.value })} style={{ width: 110 }} /></div></div>
            <div className="fld"><label>رسالة (تظهر في البث)</label><input className="inp" maxLength={200} value={f.message} onChange={e => setF({ ...f, message: e.target.value })} /></div>
            {err && <p style={{ color: "var(--bad)" }}>{err}</p>}
            <button className="btn pri w-full">متابعة للدفع</button>
            <p className="mut small" style={{ marginTop: 10 }}>الدفع يتم عبر ميسّر. لا نحفظ بيانات بطاقتك. يظهر تبرعك في البث فقط بعد تأكيد الدفع.</p>
          </form>
        ) : (<><div className="mysr-form" />{err && <p style={{ color: "var(--bad)" }}>{err}</p>}</>)}
      </div>
    </div>
  );
}
