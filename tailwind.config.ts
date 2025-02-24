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
      },
      fontFamily: {
        web3: ["Rajdhani", "sans-serif"], // Cambia por la tipografía que prefieras
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
