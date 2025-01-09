import { Transform } from "stream";

const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "selector",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      animationDelay: {
        100: "100ms",
        200: "200ms",
        300: "300ms",
        400: "400ms",
      },
      colors: {
        customOrange: "#FF8345",
        customRedOrange: "#F5AE7A",
        slateDark: "#374151",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        sunset: "#FFD29E",
        "sunset-2": "#FFC684",
        "earth-yellow": "#FFB969",
        "sandy-brown": "#FFAD4F",
        "orange-peel": "#FFA135",
        "princeton-orange": "#FF941A",
        "dark-orange-web": "#FF8800",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      backgroundImage: {
        "custom-sunset-gradient":
          "linear-gradient(90deg, hsla(228, 12%, 8%, 1) 0%, hsla(359, 73%, 39%, 1) 39%, hsla(9, 69%, 45%, 1) 54%, hsla(32, 97%, 59%, 1) 100%)",
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        roboto: ["Roboto", "sans-serif"],
        anton: ["Anton SC", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        paytone: ["Paytone One", "sans-serif"],
        archivo: ["Archivo Black", "sans-serif"],
        radioCanada: ["Radio Canada", "serif"],
      },
      fontSize: {
        "200px": "200px", // Custom font size
        "300px": "300px",
        "400px": "400px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        slideDown: {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        slideUp: {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        scrollOpen: {
          "0%": { transform: "scaleY(0.2) rotateX(90deg)", opacity: "0" },
          "20%": { transform: "scaleY(0.5) rotateX(50deg)", opacity: "0.2" },
          "40%": { transform: "scaleY(0.8) rotateX(30deg)", opacity: "0.5" },
          "60%": { transform: "scaleY(1) rotateX(-10deg)", opacity: "0.8" },
          "80%": { transform: "scaleY(1) rotateX(-5deg)", opacity: "1" },
          "100%": { transform: "scaleY(1) rotateX(0)", opacity: "1" },
        },
        scrollClose: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "20%": { transform: "scale(0.8)", opacity: "0.7" },
          "60%": { transform: "scale(0.5)", opacity: "0.5" },
          "100%": { transform: "scale(0.2)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        slideUp: "slideUp 0.3s ease-out",
        slideDown: "slideDown 0.3s ease-out",
        scrollOpen: "scrollOpen 0.5s ease-out",
        scrollClose: "scrollClose 0.6s ease-in",
      },
      sidebar: {
        DEFAULT: "hsl(var(--sidebar-background))",
        foreground: "hsl(var(--sidebar-foreground))",
        primary: "hsl(var(--sidebar-primary))",
        "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
        accent: "hsl(var(--sidebar-accent))",
        "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
        border: "hsl(var(--sidebar-border))",
        ring: "hsl(var(--sidebar-ring))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
