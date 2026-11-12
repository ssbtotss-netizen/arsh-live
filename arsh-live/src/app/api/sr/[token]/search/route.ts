import { musicSvc } from "@/server/music-store";
export const dynamic = "force-dynamic";
export async function GET(req: Request, { params }: { params: Promise<{ token: string }> }) { const { token } = await params; return musicSvc.search(token, new URL(req.url).searchParams.get("q") || ""); }
