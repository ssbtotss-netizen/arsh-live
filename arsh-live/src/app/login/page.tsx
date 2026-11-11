"use client";
import { useState } from "react";
export default function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [err, setErr] = useState("");
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setErr("");
    const f = Object.fromEntries(new FormData(e.currentTarget));
    const r = await fetch("/api/auth", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...f, action: mode }) });
    const d = await r.json();
    if (d.ok) location.href = "/dashboard"; else setErr(d.error || "حدث خطأ");
  };
  return (
    <div className="min-h-screen grid place-items-center p-4">
      <form onSubmit={submit} className="card w-full max-w-sm">
        <div className="brand" style={{ justifyContent: "center", flexDirection: "column", textAlign: "center" }}><img src="/logo.png" alt="B6O6 Streaming" style={{ width: 140, height: 140, filter: "drop-shadow(0 0 18px #2f7bff88)" }} /><b style={{ fontSize: 22 }}>B6O6 Streaming</b><small>منصة صنّاع المحتوى</small></div>
        {mode === "register" && <div className="fld"><label>الاسم</label><input className="inp" name="name" required /></div>}
        <div className="fld"><label>البريد الإلكتروني</label><input className="inp" name="email" type="email" dir="ltr" required /></div>
        <div className="fld"><label>كلمة المرور (8 أحرف على الأقل)</label><input className="inp" name="password" type="password" dir="ltr" minLength={8} required /></div>
        {err && <p style={{ color: "var(--bad)" }}>{err}</p>}
        <button className="btn pri w-full">{mode === "login" ? "دخول" : "إنشاء حساب"}</button>
        <p className="mut small text-center mt-3 cursor-pointer" onClick={() => setMode(mode === "login" ? "register" : "login")}>{mode === "login" ? "ما عندك حساب؟ سجّل الآن" : "عندك حساب؟ سجّل دخول"}</p>
      </form>
    </div>
  );
}
