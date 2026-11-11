import "./globals.css";
import "../styles/app.css";
import "../styles/overlay.css";
import type { Metadata, Viewport } from "next";
import { SITE } from "./site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url()),
  title: { default: SITE.title, template: "%s | بطوط ستريم B6O6" },
  description: SITE.description, keywords: SITE.keywords, applicationName: SITE.name,
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "ar_SA", siteName: `${SITE.nameAr} | ${SITE.name}`, title: SITE.title, description: SITE.description, images: [{ url: "/shots/follower-alerts.jpg", width: 1440, height: 900 }] },
  twitter: { card: "summary_large_image", title: SITE.title, description: SITE.description, images: ["/shots/follower-alerts.jpg"] },
  icons: { icon: "/logo-160.png", apple: "/logo-160.png" },
  manifest: "/manifest.webmanifest",
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};
export const viewport: Viewport = { themeColor: "#0b1020" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" /><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@300;400;500;600;700&family=Changa:wght@500;600;700;800&family=Orbitron:wght@600;800;900&family=Amiri:wght@700&display=swap" /></head>
      <body>{children}</body>
    </html>
  );
}
