// صفحة رابط البايو العامة: /u/<handle> — تُعرض من الخادم بدون تسجيل دخول
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { bioHTML, BIO_CSS } from "@/engine/bio.js";

export const dynamic = "force-dynamic";
export async function generateMetadata(props: { params: Promise<{ handle: string }> }) {
  const params = await props.params;
  const u = await prisma.user.findUnique({ where: { bioHandle: params.handle.toLowerCase() }, select: { bio: true } });
  const b: any = u?.bio || {}; return { title: (b.name || params.handle) + " — B6O6", description: b.about || "رابط البايو" };
}
export default async function BioPage(props: { params: Promise<{ handle: string }> }) {
  const params = await props.params;
  const h = params.handle.toLowerCase();
  const u = await prisma.user.findUnique({ where: { bioHandle: h }, select: { id: true, bio: true } });
  if (!u) notFound();
  const b: any = u.bio || {}; const stats = b.stats || { visits: 0, clicks: {} }; stats.visits = (stats.visits || 0) + 1;
  await prisma.user.update({ where: { id: u.id }, data: { bio: { ...b, stats } } }).catch(() => {});
  const track = `document.addEventListener("click",function(e){var a=e.target.closest("[data-bl]");if(a)navigator.sendBeacon("/api/bio/${encodeURIComponent(h)}",JSON.stringify({k:a.dataset.bl}))});`;
  return (<html lang="ar" dir="rtl"><head><meta name="viewport" content="width=device-width,initial-scale=1" /><style dangerouslySetInnerHTML={{ __html: "html,body{margin:0;min-height:100%}" + BIO_CSS }} /></head>
    <body><div style={{ minHeight: "100vh", display: "flex" }} dangerouslySetInnerHTML={{ __html: bioHTML(b, { visits: stats.visits }) }} /><script dangerouslySetInnerHTML={{ __html: track }} /></body></html>);
}
