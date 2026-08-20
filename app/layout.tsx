import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import PlausibleProvider from "next-plausible";
import MotionProvider from "@/components/motion/MotionProvider";
import Preloader from "@/components/motion/Preloader";
import SharedElementOverlay from "@/components/motion/SharedElementOverlay";
import KloaqCursor from "@/components/v2/KloaqCursor";
import KloaqMobileTabbar from "@/components/v2/KloaqMobileTabbar";
import "../styles/globals.css";

// Site-wide type system (source of truth: the Kloaq design study).
// Inter Tight (body/UI) loads via next/font — self-hosted + preloaded, no CLS —
// exposing --font-body. Boldonse (display) isn't in this Next version's Google
// font manifest, so it loads via the Google Fonts <link> below; its
// --font-display var is declared statically in globals.css :root (not an inline
// style on <html>, which hydration-mismatches against MotionProvider mutating
// the root element).
const interTight = Inter_Tight({
  // 900 (Black) is used by the v6 hero's inline card labels. next/font only
  // ships the weights listed here — omitting one does NOT fall back to the
  // nearest real weight, it lets the browser SYNTHESISE a fake bold, which
  // renders as smeared outlines rather than the true Black cut.
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Studio Kavea — Design on Demand, Singapore",
  description:
    "Skip the overhead of a full-time hire. Get a dedicated design team on speed dial — fast turnarounds, direct line, always on brand.",
};

// App Router owns the viewport meta via this export — NOT a hand-written
// <meta name="viewport"> in <head>. Rendering it manually produced TWO
// viewport metas in the built HTML (App Router injects its own), which some
// mobile browsers resolve by falling back to a ~980px desktop layout viewport
// — making a phone render the desktop hero squeezed. One canonical tag here
// fixes that. Do NOT re-add a manual <meta name="viewport">.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={interTight.variable}>
      <head>
        {/* Cookieless analytics. Replaces @vercel/analytics, which was
            mounted here but collected NOTHING off-platform — Vercel Analytics
            only reports when the app runs on Vercel, and this site is hosted
            on Namecheap (LiteSpeed). That shipped a third-party script to
            every visitor for no data. Plausible is cookieless by design, so
            /cookies keeps its "no consent banner needed" position honestly.

            ⚠ TODO(Farid) — NOT LIVE YET. next-plausible v4 wants the
            site-specific script URL from the Plausible dashboard
            (https://plausible.io/js/pa-XXXXX.js), not a bare domain, so this
            needs a Plausible account for kavea.studio before it collects
            anything. Set NEXT_PUBLIC_PLAUSIBLE_SRC in the environment and
            this starts reporting; until then `enabled` is false and NO
            third-party script is served — which is the honest state, and
            matches what /cookies and /privacy now say.

            If you'd rather not run analytics at all, delete this block and
            the next-plausible dependency, then change the two policy pages
            to say plainly that no analytics is in use. */}
        {process.env.NEXT_PUBLIC_PLAUSIBLE_SRC && (
          <PlausibleProvider src={process.env.NEXT_PUBLIC_PLAUSIBLE_SRC} />
        )}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Boldonse&display=swap"
          rel="stylesheet"
        />
        {/* NO hero preload. This used to preload /bg/bg-orange-grain.jpg —
            the old HeroStatementV4 hero's rest-state backdrop — but the
            homepage now runs HeroInlineV6 and never paints that image, so the
            preload was fetching an asset the page does not use. (The grain
            field is still used by /v4 and /kloaq, which load it normally.)
            Deliberately NOT replaced with a preload of the hero video:
            `as="video"` is poorly supported and would pull the full ~3.1MB up
            front, competing with the headline's own first paint. The <video>
            element carries preload="metadata" and starts itself. */}
      </head>
      <body>
        <MotionProvider>
          {children}
          <Preloader />
          <SharedElementOverlay />
          <KloaqCursor suppressOnKloaq />
          <KloaqMobileTabbar />
          <div className="grain-overlay" aria-hidden />
        </MotionProvider>
      </body>
    </html>
  );
}
