import type { Config } from "tailwindcss";

// Single source of truth for Tailwind config. A second `tailwind.config.js`
// used to exist and silently won resolution over this file; it has been removed.
const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // The Geist variables were previously declared on <body> but never wired
      // up here, and globals.css overrode body with an unloaded "Calibre"/"Inter"
      // stack — so both faces shipped as payload and neither actually rendered.
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        display: ["var(--font-display)", "var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      // Fluid scale. display-1 : body ≈ 5.2:1 at max viewport.
      fontSize: {
        "display-1": ["clamp(3rem, 2.2rem + 3.4vw, 5.5rem)", { lineHeight: "0.95", letterSpacing: "-0.035em" }],
        "display-2": ["clamp(1.75rem, 1.25rem + 2.2vw, 3rem)", { lineHeight: "1.06", letterSpacing: "-0.022em" }],
        "heading": ["clamp(1.5rem, 1.3rem + 0.8vw, 2rem)", { lineHeight: "1.15", letterSpacing: "-0.018em" }],
        "subheading": ["clamp(1.125rem, 1.05rem + 0.4vw, 1.375rem)", { lineHeight: "1.25", letterSpacing: "-0.012em" }],
        "body": ["1.0625rem", { lineHeight: "1.65" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        "eyebrow": ["0.8125rem", { lineHeight: "1.4", letterSpacing: "0.1em" }],
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "out-quart": "cubic-bezier(0.25, 1, 0.5, 1)",
        "in-out-expo": "cubic-bezier(0.87, 0, 0.13, 1)",
      },
      maxWidth: {
        prose: "65ch",
      },
      colors: {
        // Brand tokens — see globals.css. These flip per theme, so components
        // use `text-brand` / `bg-surface` instead of paired `x dark:x` literals.
        brand: "hsl(var(--brand) / <alpha-value>)",
        surface: {
          DEFAULT: "hsl(var(--surface) / <alpha-value>)",
          raised: "hsl(var(--surface-raised) / <alpha-value>)",
        },
        content: {
          DEFAULT: "hsl(var(--content) / <alpha-value>)",
          muted: "hsl(var(--content-muted) / <alpha-value>)",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
