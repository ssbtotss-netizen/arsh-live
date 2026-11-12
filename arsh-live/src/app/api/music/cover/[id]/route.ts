// غلاف الأغنية (صورة فقط — لا يكشف الملف الصوتي)
import { musicSvc } from "@/server/music-store";
export const dynamic = "force-dynamic";
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) { const { id } = await params; return musicSvc.cover(id); }
