import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import MotionProvider from "@/components/motion/MotionProvider";
import Preloader from "@/components/motion/Preloader";
import SharedElementOverlay from "@/components/motion/SharedElementOverlay";
import KloaqCursor from "@/components/v2/KloaqCursor";
import "../styles/globals.css";

// Site-wide type system (source of truth: the Kloaq design study).
// Inter Tight (body/UI) loads via next/font — self-hosted + preloaded, no CLS —
// exposing --font-body. Boldonse (display) isn't in this Next version's Google
// font manifest, so it loads via the Google Fonts <link> below; its
// --font-display var is declared statically in globals.css :root (not an inline
// style on <html>, which hydration-mismatches against MotionProvider mutating
// the root element).
const interTight = Inter_Tight({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "freddi.design — Design on Demand, Singapore",
  description:
    "Skip the overhead of a full-time hire. Get a dedicated designer on speed dial — fast turnarounds, direct line, always on brand.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={interTight.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Boldonse&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://va.vercel-scripts.com" />
      </head>
      <body>
        <MotionProvider>
          {children}
          <Preloader />
          <SharedElementOverlay />
          <KloaqCursor suppressOnKloaq />
          <div className="grain-overlay" aria-hidden />
        </MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
