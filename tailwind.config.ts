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
        black: "#0f0f0f",
        red: "#E8222E",
        cream: "#FFF8EE",
        yellow: "#FFD93D",
        ink: "#1a1a1a",
      },
      fontFamily: {
        fredoka: ["'Fredoka One'", "cursive"],
        nunito: ["'Nunito'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
