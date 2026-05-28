import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jonathan & Nerizza · February 25, 2027",
  description:
    "You are cordially invited to the wedding of Jonathan Rivera & Nerizza Gonzales at Jardin de Milagros, Tagaytay.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Italiana&family=Tangerine:wght@400;700&family=Allura&family=Inter:wght@300;400;500;600&family=Cormorant+Unicase:wght@300;400;500&display=swap"
        />
      </head>
      <body className="intro-locked">{children}</body>
    </html>
  );
}
