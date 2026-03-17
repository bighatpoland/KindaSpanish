import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#241814",
        sand: "#ede0c8",
        coral: "#b85a3b",
        gold: "#c89a43",
        teal: "#50796c",
        plum: "#5a4037",
        mist: "#f8f1e1",
        bark: "#6e4b2e",
        moss: "#6b7752",
        brass: "#b88a35",
        ember: "#8f4334",
        stone: "#cab896"
      },
      boxShadow: {
        card: "0 18px 40px rgba(61, 42, 26, 0.18)",
        panel: "inset 0 1px 0 rgba(255,248,230,0.55), 0 10px 25px rgba(58,38,22,0.2)",
        medal: "0 10px 18px rgba(93, 63, 30, 0.2)"
      },
      borderRadius: {
        pill: "999px",
        panel: "26px",
        plaque: "20px"
      },
      fontFamily: {
        display: ["Palatino Linotype", "Book Antiqua", "Georgia", "serif"],
        body: ["Trebuchet MS", "Verdana", "Geneva", "sans-serif"]
      },
      backgroundImage: {
        hero: "radial-gradient(circle at top, rgba(200,154,67,0.28), transparent 34%), linear-gradient(180deg, #f6eddc 0%, #e7d4b0 100%)",
        map: "radial-gradient(circle at 20% 10%, rgba(255,245,220,0.4), transparent 24%), radial-gradient(circle at 80% 0%, rgba(80,121,108,0.12), transparent 30%), linear-gradient(180deg, rgba(247,238,220,0.95) 0%, rgba(227,209,173,0.98) 100%)",
        wood: "linear-gradient(180deg, #8e673f 0%, #6e4b2e 100%)",
        brass: "linear-gradient(180deg, #deb76b 0%, #b7872a 100%)",
        parchment: "linear-gradient(180deg, rgba(251,244,225,0.98) 0%, rgba(237,224,200,0.96) 100%)"
      }
    }
  },
  plugins: []
};

export default config;
