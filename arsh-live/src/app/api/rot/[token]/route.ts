// تحكم القوائم المتناوبة من Stream Deck (إجراء «Website» / رابط GET) أو أي اختصار خارجي:
// /api/rot/<رمز رابط OBS>?g=<معرّف المجموعة>&cmd=next|prev|pause|resume|toggle|pin|unpin&item=<معرّف القائمة>
// يتحكم بالعرض فقط (لا يغيّر بيانات البث ولا الإعدادات)، ورمز الرابط هو نفس رمز طبقات OBS الخاص بصاحب الحساب.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
const OPS = new Set(["next", "prev", "pause", "resume", "toggle", "pin", "unpin"]);
async function run(req: Request, token: string) {
  const u = new URL(req.url), g = u.searchParams.get("g") || "", cmd = u.searchParams.get("cmd") || "", item = u.searchParams.get("item") || "";
  if (!/^[\w-]{2,40}$/.test(g) || !OPS.has(cmd) || (item && !/^[\w-]{1,40}$/.test(item))) return NextResponse.json({ ok: false, error: "طلب غير صالح" }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { overlayToken: token }, select: { id: true } });
  if (!user) return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });
  const hub = (globalThis as any).__b6o6?.hub; if (!hub?.rotCmd) return NextResponse.json({ ok: false, error: "server" }, { status: 503 });
  const ok = await hub.rotCmd(token, g, cmd, item);
  return NextResponse.json({ ok }, { headers: { "cache-control": "no-store" } });
}
export async function GET(req: Request, ctx: { params: Promise<{ token: string }> }) { const { token } = await ctx.params; return run(req, token); }
export async function POST(req: Request, ctx: { params: Promise<{ token: string }> }) { const { token } = await ctx.params; return run(req, token); }
