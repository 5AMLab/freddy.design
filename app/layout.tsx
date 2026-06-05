import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "freddy.design — Design on Demand, Singapore",
  description:
    "Skip the overhead of a full-time hire. Get a dedicated designer on speed dial — fast turnarounds, direct line, always on brand.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Preload critical above-the-fold fonts */}
        <link rel="preload" href="/fonts/canela-woff2/Canela-Light-Trial.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/canela-woff2/Canela-LightItalic-Trial.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/sohne-woff2/TestSohne-Buch-BF663d89cd32e6a.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/sohne-woff2/TestSohneBreit-Kraftig-BF663d89caa6b6c.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://va.vercel-scripts.com" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
