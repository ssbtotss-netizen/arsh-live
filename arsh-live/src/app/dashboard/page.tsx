"use client";
// لوحة التحكم: نفس الواجهة المختبرة (public/b6o6-dashboard.js المبنية من src/engine + demo/app.js)
// تعمل هنا بوضع المنصة: حساب حقيقي، حفظ في PostgreSQL، واتصال WebSocket بخادم المنصة.
import { useEffect } from "react";

export default function DashboardPage() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const r = await fetch("/api/me");
      if (r.status === 401) { location.href = "/login"; return; }
      const d = await r.json();
      if (cancelled) return;
      (window as any).B6O6_CONFIG = {
        layouts: d.layouts, activeLayoutId: d.activeLayoutId, email: d.user.email,
        settings: d.user.settings || {}, socials: d.user.socials && d.user.socials.accounts ? d.user.socials : null, donCfg: d.user.donCfg && d.user.donCfg.goals ? d.user.donCfg : null, bio: d.user.bio || null, bots: d.user.bots && d.user.bots.commands ? d.user.bots : null, providers: d.user.providers,
        donateURL: `${location.origin}/donate/${d.user.donateSlug}`, webhookURL: `${location.origin}/api/webhooks/moyasar/${d.user.donateSlug}`,
        api: (path: string, o: any = {}) => fetch(path, { method: o.method || "GET", headers: { "content-type": "application/json" }, body: o.body ? JSON.stringify(o.body) : undefined }).then(r => r.json()),
        profile: { name: d.user.name, plan: d.user.sub?.label || "", sub: d.user.sub, isAdmin: !!d.user.isAdmin },
        wsUrl: `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/ws`,
        room: d.user.overlayToken, key: d.user.editKey,
        overlayURL: (layoutId: string, only?: string, acc?: string) => `${location.origin}/overlay/${d.user.overlayToken}?layout=${layoutId}${only ? `&only=${only}` : ""}${acc ? `&acc=${acc}` : ""}${(window as any).__arshPM && (window as any).__arshPM !== "hq" ? `&pm=${(window as any).__arshPM}` : ""}`,
        persist: (body: any) => fetch("/api/me", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }).then(x => { if (!x.ok) throw new Error(); }),
        logout: () => fetch("/api/auth", { method: "DELETE" }).then(() => (location.href = "/login")),
      };
      const s = document.createElement("script");
      s.src = "/b6o6-dashboard.js?v=" + (process.env.NEXT_PUBLIC_BUILD_ID || "1");
      document.body.appendChild(s);
    })();
    return () => { cancelled = true; };
  }, []);
  return (<><div id="root"><div className="empty" style={{ paddingTop: 80 }}>جارٍ التحميل…</div></div><div className="toast" id="toast" /></>);
}
