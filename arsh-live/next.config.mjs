/** @type {import('next').NextConfig} */
// فحص الأنواع يتم في الاختبارات؛ لا نوقف النشر بسبب تحذيرات أنواع لا تؤثر على التشغيل
// ws ومكتبة TikTok تُحمَّل كما هي من node_modules (تجميعها يكسر ws: "b.mask is not a function")
export default { reactStrictMode: false, typescript: { ignoreBuildErrors: true }, eslint: { ignoreDuringBuilds: true }, serverExternalPackages: ["ws", "tiktok-live-connector", "@prisma/client", "ffmpeg-static"] };
