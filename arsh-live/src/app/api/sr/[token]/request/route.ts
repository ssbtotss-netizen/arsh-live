// إرسال طلب أغنية من المشاهد → الخادم اللحظي (نفس قيود الشات) → قائمة الانتظار
import { musicSvc } from "@/server/music-store";
export const dynamic = "force-dynamic";
export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params; const body = await req.json().catch(() => null);
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || req.headers.get("x-real-ip") || "local";
  return musicSvc.request(token, body, ip);
}
