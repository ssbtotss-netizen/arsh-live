"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
export default function Page() { return <Suspense fallback={null}><Done /></Suspense>; }
function Done() {
  const q = useSearchParams();
  const [state, setState] = useState<"wait" | "ok" | "fail">("wait");
  useEffect(() => {
    const id = q.get("id"), intent = q.get("intent");
    if (!id || !intent) return setState("fail");
    fetch("/api/donate/confirm", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ paymentId: id, intentId: intent }) })
      .then(r => r.json()).then(d => setState(d.ok ? "ok" : "fail")).catch(() => setState("fail"));
  }, [q]);
  return (
    <div className="min-h-screen grid place-items-center p-4"><div className="card w-full max-w-md" style={{ textAlign: "center" }}>
      <img src="/logo.png" alt="" style={{ width: 96, height: 96 }} />
      {state === "wait" && <p>جارٍ التحقق من الدفع…</p>}
      {state === "ok" && <><h2>شكراً لدعمك 💙</h2><p className="mut">تم تأكيد الدفع وسيظهر تبرعك في البث.</p></>}
      {state === "fail" && <><h2>لم يكتمل الدفع</h2><p className="mut">لم يتم خصم أي مبلغ أو لم يُؤكَّد الدفع بعد. إذا خُصم المبلغ سيظهر تبرعك تلقائياً عند وصول تأكيد ميسّر.</p></>}
    </div></div>
  );
}
