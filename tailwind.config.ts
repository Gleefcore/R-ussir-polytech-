import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        night: {
          950: "#030A16",
          900: "#050D1D",
          800: "#081527",
          700: "#0B1F3A",
          600: "#102A4C",
          500: "#16375F",
        },
        gold: {
          200: "#F9E3AE",
          300: "#F3D07E",
          400: "#EBBB4E",
          500: "#E3A82B",
          600: "#C4880A",
          700: "#9A6B06",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        "gold-glow": "0 0 45px -10px rgba(227,168,43,.55)",
        "card": "0 24px 70px -24px rgba(0,0,0,.65)",
        "inner-gold": "inset 0 1px 0 0 rgba(243,208,126,.25)",
      },
      backgroundImage: {
        "gold-grad": "linear-gradient(135deg,#F3D07E 0%,#E3A82B 45%,#C4880A 100%)",
        "night-grad": "linear-gradient(160deg,#081527 0%,#030A16 60%)",
      },
      letterSpacing: { widest2: ".22em" },
    },
  },
  plugins: [],
};
export default config;
