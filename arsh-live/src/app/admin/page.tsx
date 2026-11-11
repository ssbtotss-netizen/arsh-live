"use client";
// لوحة الإدارة (للمشرفين في ADMIN_EMAILS فقط — الخادم يرفض غيرهم بـ403)
import { useEffect, useState } from "react";

type U = { id: string; email: string; name: string; plan: string; effective: string; planUntil: string | null; disabled: boolean; createdAt: string; lastSeenAt: string | null; bioHandle: string | null; _count: { layouts: number; connections: number; streamSessions: number } };
const PL: Record<string, string> = { free: "مجانية", starter: "المبتدئ $5", pro: "المحترف $15", elite: "النخبة $30", legend: "الأسطورة $60" };
const d = (s: string | null) => s ? new Date(s).toLocaleDateString("ar-SA-u-ca-gregory-nu-latn") : "—";

export default function Admin() {
  const [data, setData] = useState<any>(null), [err, setErr] = useState(""), [q, setQ] = useState(""), [busy, setBusy] = useState("");
  const load = async () => { const r = await fetch("/api/admin?q=" + encodeURIComponent(q)); if (r.status === 401) { location.href = "/login"; return; } if (r.status === 403) { setErr("هذه الصفحة للمشرفين فقط."); return; } setData(await r.json()); };
  useEffect(() => { load(); }, []);
  const act = async (userId: string, body: any) => { setBusy(userId); const r = await fetch("/api/admin", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ userId, ...body }) }); const j = await r.json(); setBusy(""); if (!r.ok) alert(j.error || "تعذر التنفيذ"); load(); };
  if (err) return <div className="empty" style={{ paddingTop: 80 }}>{err}</div>;
  if (!data) return <div className="empty" style={{ paddingTop: 80 }}>جارٍ التحميل…</div>;
  const S = data.stats;
  return (<div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
    <h1>🛡️ لوحة الإدارة — B6O6 Streaming</h1>
    <div className="grid g4" style={{ margin: "12px 0" }}>
      {[["المستخدمون", S.total], ["الموقوفون", S.disabled], ["بثوث مباشرة الآن", S.liveSessions], ["الإيرادات المؤكدة", "$" + S.revenueUsd.toFixed(2)]].map(([k, v]) => <div className="card" key={k as string}><div className="mut small">{k}</div><b style={{ fontSize: 24 }}>{v}</b></div>)}
    </div>
    <div className="card" style={{ marginBottom: 12 }}><h3>توزيع الباقات</h3><div className="row">{Object.entries(S.byPlan).map(([k, v]) => <span className="tag" key={k}>{PL[k]}: {v as number}</span>)}</div></div>
    <div className="card"><h3>المستخدمون</h3>
      <div className="row" style={{ marginBottom: 8 }}><input className="inp" placeholder="بحث بالبريد أو الاسم" value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === "Enter" && load()} /><button className="btn sm" onClick={load}>بحث</button></div>
      <table style={{ width: "100%", fontSize: 13 }}><thead><tr><th>المستخدم</th><th>الباقة</th><th>ينتهي</th><th>مشاهد/منصات/بثوث</th><th>التسجيل</th><th>آخر ظهور</th><th>إجراءات</th></tr></thead>
        <tbody>{data.users.map((u: U) => <tr key={u.id} style={{ opacity: u.disabled ? .5 : 1 }}>
          <td><b>{u.name}</b><div className="mut small" dir="ltr">{u.email}</div></td>
          <td>{PL[u.effective]}</td><td>{d(u.planUntil)}</td><td>{u._count.layouts} / {u._count.connections} / {u._count.streamSessions}</td><td>{d(u.createdAt)}</td><td>{d(u.lastSeenAt)}</td>
          <td><select className="inp" disabled={busy === u.id} defaultValue="" onChange={e => { const v = e.target.value; if (v) act(u.id, { plan: v, months: 1 }); e.target.value = ""; }}><option value="">منح باقة (شهر)…</option>{Object.entries(PL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
            <button className="btn sm" disabled={busy === u.id} onClick={() => confirm(u.disabled ? "إعادة تفعيل الحساب؟" : "إيقاف الحساب وتسجيل خروجه؟") && act(u.id, { disabled: !u.disabled })}>{u.disabled ? "تفعيل" : "إيقاف"}</button></td>
        </tr>)}</tbody></table></div>
    <div className="card" style={{ marginTop: 12 }}><h3>آخر الاشتراكات</h3>{data.subscriptions.length ? data.subscriptions.map((s: any) => <div key={s.id} className="small">{d(s.createdAt)} — {s.user.email} — {PL[s.plan]} × {s.months} — {s.provider === "admin" ? "منح إداري" : "$" + s.amountUsd}</div>) : <div className="empty">لا يوجد</div>}</div>
  </div>);
}
