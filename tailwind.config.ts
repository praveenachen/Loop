import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: "hsl(var(--surface))",
        "surface-soft": "hsl(var(--surface-soft))",
        stroke: "hsl(var(--stroke))",
        ink: "hsl(var(--ink))",
        "ink-soft": "hsl(var(--ink-soft))",
        accent: "hsl(var(--accent))",
        brand: "hsl(var(--brand))",
        marketplace: "hsl(var(--marketplace))",
        rides: "hsl(var(--rides))",
        study: "hsl(var(--study))",
        trust: "hsl(var(--trust))",
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))"
      },
      boxShadow: {
        card: "0 10px 30px -16px rgba(18, 21, 26, 0.22)",
        lift: "0 16px 50px -22px rgba(18, 21, 26, 0.3)"
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem"
      },
      fontFamily: {
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem"
      }
    }
  },
  plugins: []
};

export default config;
