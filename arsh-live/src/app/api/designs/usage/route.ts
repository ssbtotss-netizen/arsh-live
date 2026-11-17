// «الأكثر استخداماً» في معرض التصاميم: عدد مرات استخدام كل تصميم عبر كل التخطيطات (مجمّع — بدون أي بيانات شخصية)، مخزّن 10 دقائق
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/auth";

let cache: { at: number; counts: Record<string, number> } | null = null;
const TTL = 10 * 60 * 1000;

export async function GET() {
  const u = await currentUser();
  if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!cache || Date.now() - cache.at > TTL) {
    const counts: Record<string, number> = {};
    const rows = await prisma.layout.findMany({ select: { widgets: true } });
    for (const r of rows) {
      const ws = Array.isArray(r.widgets) ? (r.widgets as any[]) : [];
      for (const w of ws) {
        if (w && typeof w.design === "string" && w.design.length < 60) counts[w.design] = (counts[w.design] || 0) + 1;
        if (w && Array.isArray(w.lvls)) for (const x of w.lvls) if (x && typeof x.design === "string" && x.design.length < 60) counts[x.design] = (counts[x.design] || 0) + 1;
      }
    }
    cache = { at: Date.now(), counts };
  }
  return NextResponse.json({ counts: cache.counts, at: cache.at }, { headers: { "Cache-Control": "private, max-age=300" } });
}
