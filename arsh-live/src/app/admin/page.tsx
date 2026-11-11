"use client";
// لوحة الإدارة — تحكم كامل بالاشتراكات: مدة التجربة، السعر، حدود ما بعد التجربة، وإجراءات كل مستخدم (الخادم يرفض غير المشرفين بـ403)
import { useEffect, useState } from "react";

const ST: Record<string, string> = { trial: "تجربة", active: "مشترك", comp: "منحة", expired: "منتهي" };
const d = (s: any) => s ? new Date(s).toLocaleDateString("ar-SA-u-ca-gregory-nu-latn") : "—";

export default function Admin() {
  const [data, setData] = useState<any>(null), [err, setErr] = useState(""), [q, setQ] = useState(""), [busy, setBusy] = useState(""), [cfg, setCfg] = useState<any>(null), [msg, setMsg] = useState("");
  const load = async () => { const r = await fetch("/api/admin?q=" + encodeURIComponent(q)); if (r.status === 401) { location.href = "/login"; return; } if (r.status === 403) { setErr("هذه الصفحة للمشرفين فقط."); return; } const j = await r.json(); setData(j); setCfg((c: any) => c || { trialEnabled: j.cfg.trialEnabled, trialDays: j.cfg.trialDays, priceUsd: j.cfg.priceUsd, layouts: j.cfg.limits.expired.layouts, widgets: j.cfg.limits.expired.widgets }); };
  useEffect(() => { load(); }, []);
  const act = async (userId: string, body: any) => { setBusy(userId); const r = await fetch("/api/admin", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ userId, ...body }) }); const j = await r.json(); setBusy(""); if (!r.ok) alert(j.error || "تعذر التنفيذ"); load(); };
  const saveCfg = async () => { const r = await fetch("/api/admin", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ trialEnabled: cfg.trialEnabled, trialDays: +cfg.trialDays, priceUsd: +cfg.priceUsd, expiredLimits: { layouts: +cfg.layouts, widgets: +cfg.widgets } }) }); setMsg(r.ok ? "✅ حُفظت الإعدادات — تُطبّق على التسجيلات الجديدة وصفحة الأسعار فوراً" : "تعذر الحفظ"); load(); };
  if (err) return <div className="empty" style={{ paddingTop: 80 }}>{err}</div>;
  if (!data || !cfg) return <div className="empty" style={{ paddingTop: 80 }}>جارٍ التحميل…</div>;
  const S = data.stats;
  return (<div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
    <h1>🛡️ لوحة الإدارة — B6O6 Streaming</h1>
    <div className="grid g4" style={{ margin: "12px 0" }}>
      {[["المستخدمون", S.total], ["في التجربة", S.byState.trial], ["مشتركون", S.byState.active + S.byState.comp], ["منتهي", S.byState.expired], ["بثوث مباشرة الآن", S.liveSessions], ["الإيرادات المؤكدة", "$" + S.revenueUsd.toFixed(2)], ["الموقوفون", S.disabled]].map(([k, v]) => <div className="card" key={k as string}><div className="mut small">{k}</div><b style={{ fontSize: 24 }}>{v}</b></div>)}
    </div>
    <div className="card" style={{ marginBottom: 12 }}><h3>💎 إعدادات الاشتراك</h3>
      <div className="grid g4" style={{ gap: 10 }}>
        <div className="fld"><label>التجربة المجانية</label><select className="inp" value={cfg.trialEnabled ? "1" : "0"} onChange={e => setCfg({ ...cfg, trialEnabled: e.target.value === "1" })}><option value="1">مفعّلة</option><option value="0">متوقفة</option></select></div>
        <div className="fld"><label>مدة التجربة (يوم)</label><input className="inp" type="number" min={0} max={365} value={cfg.trialDays} onChange={e => setCfg({ ...cfg, trialDays: e.target.value })} /></div>
        <div className="fld"><label>سعر الاشتراك الشهري ($)</label><input className="inp" type="number" min={1} step="0.5" value={cfg.priceUsd} onChange={e => setCfg({ ...cfg, priceUsd: e.target.value })} /></div>
        <div className="fld"><label>بعد انتهاء التجربة: المشاهد / العناصر</label><div className="row"><input className="inp" type="number" min={0} value={cfg.layouts} onChange={e => setCfg({ ...cfg, layouts: e.target.value })} /><input className="inp" type="number" min={0} value={cfg.widgets} onChange={e => setCfg({ ...cfg, widgets: e.target.value })} /></div></div>
      </div>
      <div className="row" style={{ marginTop: 8 }}><button className="btn pri" onClick={saveCfg}>حفظ الإعدادات</button><span className="mut small">{msg || "التجربة تُحسب لكل حساب من تاريخ تسجيله. تغيير المدة لا يقصّر تجربة من سجّل سابقاً — استخدم إجراءات المستخدم لذلك."}</span></div></div>
    <div className="card"><h3>المستخدمون</h3>
      <div className="row" style={{ marginBottom: 8 }}><input className="inp" placeholder="بحث بالبريد أو الاسم" value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === "Enter" && load()} /><button className="btn sm" onClick={load}>بحث</button></div>
      <table style={{ width: "100%", fontSize: 13 }}><thead><tr><th>المستخدم</th><th>الحالة</th><th>حتى</th><th>مشاهد/منصات/بثوث</th><th>التسجيل</th><th>آخر ظهور</th><th>إجراءات</th></tr></thead>
        <tbody>{data.users.map((u: any) => <tr key={u.id} style={{ opacity: u.disabled ? .5 : 1 }}>
          <td><b>{u.name}</b><div className="mut small" dir="ltr">{u.email}</div></td>
          <td><span className="tag">{ST[u.status.state]}</span>{u.status.daysLeft ? <span className="mut small"> ({u.status.daysLeft} يوم)</span> : null}</td><td>{d(u.status.until)}</td>
          <td>{u._count.layouts} / {u._count.connections} / {u._count.streamSessions}</td><td>{d(u.createdAt)}</td><td>{d(u.lastSeenAt)}</td>
          <td><select className="inp" disabled={busy === u.id} defaultValue="" onChange={e => { const v = e.target.value; e.target.value = ""; if (!v) return;
              if (v === "t7") act(u.id, { trialDays: 7 }); else if (v === "t30") act(u.id, { trialDays: 30 }); else if (v === "endt") confirm("إنهاء التجربة الآن؟") && act(u.id, { endTrial: true });
              else if (v.startsWith("g")) act(u.id, { grantMonths: +v.slice(1) }); else if (v === "cancel") confirm("إلغاء الاشتراك فوراً؟ (لا يرد المبلغ تلقائياً)") && act(u.id, { cancel: true });
              else if (v === "dis") confirm(u.disabled ? "إعادة تفعيل الحساب؟" : "إيقاف الحساب وتسجيل خروجه؟") && act(u.id, { disabled: !u.disabled }); }}>
            <option value="">إجراء…</option><option value="t7">تمديد التجربة 7 أيام</option><option value="t30">تمديد التجربة 30 يوماً</option><option value="endt">إنهاء التجربة</option>
            <option value="g1">منح شهر مجاني</option><option value="g3">منح 3 أشهر</option><option value="g12">منح سنة</option><option value="cancel">إلغاء الاشتراك</option><option value="dis">{u.disabled ? "تفعيل الحساب" : "إيقاف الحساب"}</option></select></td>
        </tr>)}</tbody></table></div>
    <div className="card" style={{ marginTop: 12 }}><h3>آخر الاشتراكات</h3>{data.subscriptions.length ? data.subscriptions.map((s: any) => <div key={s.id} className="small">{d(s.createdAt)} — {s.user.email} — {s.months} شهر — {s.provider === "admin" ? "منحة إدارية" : "$" + s.amountUsd}</div>) : <div className="empty">لا يوجد</div>}</div>
  </div>);
}
