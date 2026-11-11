import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { currentUser } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { platform: string } }) {
  const u = await currentUser(); const url = new URL(req.url); const origin = process.env.PUBLIC_URL || url.origin;
  const back = (q: string) => NextResponse.redirect(`${origin}/dashboard?page=connections&${q}`);
  if (!u) return back("error=unauthorized");
  let ck: any = {}; try { ck = JSON.parse(cookies().get("b6o6_oauth")?.value || "{}"); } catch {}
  if (!ck.state || ck.state !== url.searchParams.get("state") || ck.p !== params.platform) return back("error=state");
  const code = url.searchParams.get("code"); if (!code) return back("error=" + encodeURIComponent(url.searchParams.get("error") || "denied"));
  const svc = (globalThis as any).__b6o6?.platforms; if (!svc) return back("error=server");
  try {
    const t = await svc.exchange(params.platform, code, `${origin}/api/connect/${params.platform}/callback`, ck.verifier);
    const acc = await svc.saveConnection(u.id, params.platform, t);
    const res = back(`connected=${params.platform}&account=${encodeURIComponent(acc.name)}`); res.cookies.delete("b6o6_oauth"); return res;
  } catch (e: any) { return back("error=" + encodeURIComponent(String(e.message || e).slice(0, 120))); }
}
