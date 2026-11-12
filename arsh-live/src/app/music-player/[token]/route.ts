// مشغل الأغاني: Browser Source شفاف لـ OBS و TikTok LIVE Studio — يشغّل الصوت فعلياً
import { playerPageHTML } from "@/server/music-pages";
export const dynamic = "force-dynamic";
export async function GET(_: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params; return new Response(playerPageHTML(token), { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" } });
}
