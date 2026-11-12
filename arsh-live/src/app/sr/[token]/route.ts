// صفحة طلب الأغاني العامة للمشاهدين (مستقلة عن لوحة التحكم)
import { requestPageHTML } from "@/server/music-pages";
export const dynamic = "force-dynamic";
export async function GET(_: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params; return new Response(requestPageHTML(token), { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" } });
}
