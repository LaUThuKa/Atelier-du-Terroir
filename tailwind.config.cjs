module.exports = {
  content: [
    "./index.html",
    "./App.tsx",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vanilla: "rgb(var(--vanilla) / <alpha-value>)",
        wheat: "rgb(var(--wheat) / <alpha-value>)",
        olive: "rgb(var(--olive) / <alpha-value>)",
        amber: "rgb(var(--amber) / <alpha-value>)",
        sun: "rgb(var(--sun) / <alpha-value>)",
        footerDeep: "rgb(var(--footerDeep) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        text: "rgb(var(--text) / <alpha-value>)",
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        accent_hover: "rgb(var(--accentHover) / <alpha-value>)",
        dark: "rgb(var(--heading) / <alpha-value>)",
        olive_border: "rgba(79 88 59 / 0.25)",
        olive_divider: "rgba(79 88 59 / 0.18)",
        olive_muted: "rgba(79 88 59 / 0.85)",
        olive_hint: "rgba(79 88 59 / 0.65)",
        olive_disabled: "rgba(79 88 59 / 0.45)",
      },
      fontFamily: {
        serif: ["\"Noto Serif TC\"", "serif"],
        sans: ["\"Noto Sans TC\"", "sans-serif"],
      },
      spacing: {
        "128": "32rem",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out both",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
