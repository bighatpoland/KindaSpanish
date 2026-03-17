import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#16131d",
        sand: "#f6f1e7",
        coral: "#ee6c4d",
        gold: "#f4b860",
        teal: "#2a9d8f",
        plum: "#5a3d5c",
        mist: "#fffaf2"
      },
      boxShadow: {
        card: "0 18px 45px rgba(22, 19, 29, 0.12)"
      },
      borderRadius: {
        pill: "999px",
        panel: "28px"
      },
      backgroundImage: {
        hero: "radial-gradient(circle at top, rgba(244,184,96,0.5), transparent 36%), linear-gradient(180deg, #fffaf2 0%, #f3ecdf 100%)"
      }
    }
  },
  plugins: []
};

export default config;

