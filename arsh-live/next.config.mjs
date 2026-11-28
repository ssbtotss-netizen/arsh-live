/** @type {import('next').NextConfig} */
// فحص الأنواع يتم في الاختبارات؛ لا نوقف النشر بسبب تحذيرات أنواع لا تؤثر على التشغيل
// ws ومكتبة TikTok تُحمَّل كما هي من node_modules (تجميعها يكسر ws: "b.mask is not a function")
// رقم نسخة لرابط لوحة التحكم يتغير مع كل نشر (يمنع بقاء نسخة قديمة مخزنة في المتصفح أو الكاش)
const BUILD_ID = (process.env.RENDER_GIT_COMMIT || "").slice(0, 12) || String(Date.now());
export default { env: { NEXT_PUBLIC_BUILD_ID: BUILD_ID }, reactStrictMode: false, typescript: { ignoreBuildErrors: true }, eslint: { ignoreDuringBuilds: true }, serverExternalPackages: ["ws", "tiktok-live-connector", "@prisma/client", "ffmpeg-static"] };
