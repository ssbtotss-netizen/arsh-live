import "./globals.css";
import "../styles/app.css";
import "../styles/overlay.css";
export const metadata = { title: "B6O6 Streaming" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" /><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@300;400;500;600;700&family=Changa:wght@500;600;700;800&family=Orbitron:wght@600;800;900&family=Amiri:wght@700&display=swap" /></head>
      <body>{children}</body>
    </html>
  );
}
