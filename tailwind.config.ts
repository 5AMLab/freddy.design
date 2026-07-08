import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Canonical breakpoints — the single source of truth for the whole site.
    // Aligned to Tailwind's own md/lg/xl so utilities and the hand-written CSS
    // media queries (which reference the same px values, mirrored as --bp-* in
    // globals.css) finally agree. Replaces the previous ad-hoc zoo of
    // 599/820/900/980/1000/1100/1360 one-off breakpoints scattered across
    // kloaq.css. `sm` is kept small (480) as the narrow-phone step; the primary
    // layout switch is `lg` (1024), where the multi-column desktop layouts
    // collapse to stacked mobile ones.
    screens: {
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
      // Ultra-wide tier. Only the nav uses it (below this width the nav is a
      // full-width bar by design; at/above it snaps its inner content to the
      // shared container so it doesn't float away from page content). Mirrors
      // --ultrawide in globals.css:root.
      ultrawide: "2560px",
    },
    extend: {
      colors: {
        // Kloaq design system — single source of truth.
        ink: "#050505",
        cream: "#f9f9f9",
        orange: "#FC5000", // Flameburst Orange — the one accent
      },
      // Section rhythm as named tokens so paddings stop being per-section
      // magic numbers. These mirror the fluid --section-pad-* / --gap-*
      // custom properties defined in globals.css:root; use whichever the
      // context wants (Tailwind class vs raw CSS), both resolve to the same
      // clamp() so desktop→tablet→mobile is one continuous ramp, not a jump.
      spacing: {
        "section-y": "var(--section-pad-y)",
        "section-x": "var(--section-pad-x)",
        "gap-lg": "var(--gap-lg)",
        "gap-md": "var(--gap-md)",
        "gap-sm": "var(--gap-sm)",
      },
      maxWidth: {
        // The one content-column cap shared by every section, the footer and
        // (above the ultrawide breakpoint) the nav. Mirrors --container-max.
        container: "var(--container-max)",
      },
      fontSize: {
        // One fluid type step for the big display titles (hero nouns, project
        // tile names, work-index titles). Replaces the 4 divergent per-band
        // clamp() formulas so a title scales on ONE continuous ramp from
        // 375→1440 instead of jumping at each breakpoint.
        tile: ["var(--type-tile)", { lineHeight: "1", letterSpacing: "0.004em" }],
      },
      fontFamily: {
        // Boldonse for display/headline, Inter Tight for body/UI.
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        sans: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        // Canonical image-rectangle radius from the Kloaq study.
        image: "14px",
        "image-sm": "12px",
      },
    },
  },
  plugins: [],
};
export default config;
