import type { MetadataRoute } from "next";
// تطبيق ويب قابل للتثبيت (Windows/Android/iOS) من المتصفح مباشرة
export default function manifest(): MetadataRoute.Manifest {
  return { name: "بطوط ستريم — B6O6 Streaming", short_name: "بطوط ستريم", description: "أدوات بث TikTok LIVE بالعربي", start_url: "/dashboard", display: "standalone", background_color: "#0b1020", theme_color: "#0b1020", dir: "rtl", lang: "ar",
    icons: [{ src: "/logo-160.png", sizes: "160x160", type: "image/png" }, { src: "/logo.png", sizes: "512x512", type: "image/png", purpose: "any" }] };
}
