// مصدر التشغيل الفعلي لمشغل الأغاني (OBS / LIVE Studio): ملف صاحب رابط OBS فقط، مع Range
import { musicSvc } from "@/server/music-store";
export const dynamic = "force-dynamic";
export async function GET(req: Request, { params }: { params: Promise<{ token: string; id: string }> }) {
  const { token, id } = await params; return musicSvc.stream(token, id, req.headers.get("range"));
}
