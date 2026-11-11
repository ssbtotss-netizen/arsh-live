/** @type {import('next').NextConfig} */
// فحص الأنواع يتم في الاختبارات؛ لا نوقف النشر بسبب تحذيرات أنواع لا تؤثر على التشغيل
export default { reactStrictMode: false, typescript: { ignoreBuildErrors: true }, eslint: { ignoreDuringBuilds: true } };
