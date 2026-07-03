import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Kloaq design system — single source of truth.
        ink: "#050505",
        cream: "#f9f9f9",
        orange: "#FC5000", // Flameburst Orange — the one accent
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
