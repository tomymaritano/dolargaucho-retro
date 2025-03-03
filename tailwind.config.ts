import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        dark: "#1E1E1E",
        panel: "#252526",
        primary: "#FFFFFF",
        secondary: "#A0A0A0",
        highlight: "#8E61DB",
        text:"#e2e8f0",
      },
    },
  },
  plugins: [],
} satisfies Config;
