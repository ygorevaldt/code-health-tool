import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#111111",
        border: "#222222",
        text: "#e5e5e5",
        background: "#0a0a0a",
      },
    },
  },
  plugins: [],
};

export default config;
