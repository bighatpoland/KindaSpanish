import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SoundProvider } from "@/components/sound-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kinda Spanish",
  description:
    "A lightweight mobile-first app for speaking Spanish the imperfect way.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kinda Spanish"
  },
  formatDetection: {
    telephone: false
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fffaf2"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SoundProvider>{children}</SoundProvider>
      </body>
    </html>
  );
}
