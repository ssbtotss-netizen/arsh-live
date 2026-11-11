// أسعار الصرف لشرائح الدونيشن: من open.er-api.com (بيانات ExchangeRate-API المجانية، تُحدَّث يومياً) مع ذاكرة مؤقتة 6 ساعات.
// إن تعذّر الجلب نرجع العملات المربوطة رسمياً بالدولار فقط (ريال سعودي 3.75 …) ولا نخترع أسعاراً.
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { AL_PEGGED } from "@/engine/alerts.js";

let cache: { at: number; body: any } | null = null;
export async function GET() {
  const u = await currentUser(); if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (cache && Date.now() - cache.at < 6 * 3600e3) return NextResponse.json(cache.body);
  try {
    const r = await fetch("https://open.er-api.com/v6/latest/USD", { signal: AbortSignal.timeout(8000) });
    const j: any = await r.json();
    if (j?.result === "success" && j.rates) {
      const keep = ["USD", "SAR", "AED", "KWD", "QAR", "BHD", "OMR", "EGP", "EUR", "GBP", "TRY", "CAD", "AUD", "JPY", "JOD", "MAD", "IQD"];
      const body = { base: "USD", rates: Object.fromEntries(keep.filter(k => j.rates[k] > 0).map(k => [k, j.rates[k]])), updatedAt: j.time_last_update_utc || new Date().toUTCString(), source: "ExchangeRate-API (open.er-api.com)" };
      cache = { at: Date.now(), body }; return NextResponse.json(body);
    }
  } catch {}
  return NextResponse.json({ base: "USD", rates: AL_PEGGED, updatedAt: "", source: "أسعار الربط الرسمية بالدولار فقط (تعذر جلب الأسعار المحدّثة)", fallback: true });
}
