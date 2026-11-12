// صفحة طلب الأغاني العامة: الحالة الآن + القائمة (أسماء فقط) — بدون أي بيانات حساب
import { musicSvc } from "@/server/music-store";
export const dynamic = "force-dynamic";
export async function GET(_: Request, { params }: { params: Promise<{ token: string }> }) { const { token } = await params; return musicSvc.info(token); }
