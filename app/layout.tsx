import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import { SITE_URL } from "@/lib/site";
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
  // Required for OG/canonical URLs to resolve absolutely. Without it Next
  // emits relative og:image paths, which LinkedIn and WhatsApp cannot fetch.
  metadataBase: new URL(SITE_URL),
  title: {
    // The homepage's own title. Every other page supplies just its name and
    // gets " — Studio Kavea" appended by the template, so the studio name is
    // never doubled up.
    default: "Brand & Creative Direction Studio in Singapore — Studio Kavea",
    template: "%s — Studio Kavea",
  },
  description:
    "Skip the overhead of a full-time hire. Get a dedicated design team on speed dial — fast turnarounds, direct line, always on brand.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_SG",
    siteName: "Studio Kavea",
  },
  twitter: { card: "summary_large_image" },
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
        {/* NO ANALYTICS IS INSTALLED. This is deliberate and matches what
            /privacy and /cookies now say.

            @vercel/analytics used to be mounted here and was removed in 1.8:
            it only reports when the app runs on Vercel, and this site is on
            Namecheap (LiteSpeed), so it shipped a third-party script to every
            visitor and collected nothing.

            TODO(Farid) — to turn on cookieless analytics:
              1. create a Plausible site for kavea.studio
              2. npm i next-plausible
              3. render <PlausibleProvider src={"<your script URL>"} /> here
                 (v4 wants the site-specific script URL, not a bare domain,
                 and THROWS if rendered without one — so do not mount it
                 until you have that URL)
              4. update the analytics paragraphs on /privacy and /cookies,
                 which currently state that no analytics is in use
            Plausible is cookieless, so this keeps the "no consent banner"
            position honest. */}
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
