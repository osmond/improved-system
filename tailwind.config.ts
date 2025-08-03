import { fontFamily } from "tailwindcss/defaultTheme"
import tailwindcssAnimate from "tailwindcss-animate"

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        "wild-primary": "hsl(var(--wild-primary))",
        "wild-secondary": "hsl(var(--wild-secondary))",
        "wild-gold": "hsl(var(--wild-gold))",
        "wild-wheat": "hsl(var(--wild-wheat))",
        "spotify-primary": "hsl(var(--spotify-primary))",
        "spotify-foreground": "hsl(var(--spotify-foreground))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
          6: "hsl(var(--chart-6))",
          7: "hsl(var(--chart-7))",
          8: "hsl(var(--chart-8))",
          9: "hsl(var(--chart-9))",
          10: "hsl(var(--chart-10))",
        }
      },
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
        slab: ["var(--font-slab)", ...fontFamily.serif],
      },
    }
  },
  plugins: [tailwindcssAnimate],
}
