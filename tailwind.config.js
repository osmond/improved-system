const { fontFamily } = require("tailwindcss/defaultTheme")

module.exports = {
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
        "spotify-foreground": "hsl(var(--spotify-foreground))"
      },
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
        slab: ["var(--font-slab)", ...fontFamily.serif],
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
}
