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
        parchment: "#efe1bd",
        parchmentLight: "#f8efd4",
        parchmentDeep: "#dcc48d",
        coral: "#b85a3b",
        gold: "#c89a43",
        teal: "#50796c",
        plum: "#5a4037",
        mist: "#f8f1e1",
        bark: "#6e4b2e",
        walnut: "#4e321d",
        moss: "#6b7752",
        olive: "#7a8460",
        cypress: "#2f4b3e",
        grove: "#45695a",
        brass: "#b88a35",
        ember: "#8f4334",
        stone: "#cab896",
        navy: "#26384b"
      },
      boxShadow: {
        card: "0 18px 40px rgba(61, 42, 26, 0.18)",
        panel: "inset 0 1px 0 rgba(255,248,230,0.55), 0 10px 25px rgba(58,38,22,0.2)",
        medal: "0 10px 18px rgba(93, 63, 30, 0.2)",
        timber: "inset 0 1px 0 rgba(255, 235, 199, 0.16), inset 0 -2px 0 rgba(55, 31, 17, 0.25), 0 14px 24px rgba(54, 31, 17, 0.26)"
      },
      borderRadius: {
        pill: "999px",
        panel: "26px",
        plaque: "20px",
        banner: "18px"
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "Trebuchet MS", "Verdana", "Geneva", "sans-serif"]
      },
      backgroundImage: {
        hero: "radial-gradient(circle at top, rgba(200,154,67,0.22), transparent 32%), radial-gradient(circle at 85% 12%, rgba(69,105,90,0.12), transparent 24%), linear-gradient(180deg, #f6eddc 0%, #e3d5b7 100%)",
        map: "radial-gradient(circle at 20% 10%, rgba(255,245,220,0.36), transparent 24%), radial-gradient(circle at 80% 0%, rgba(69,105,90,0.2), transparent 28%), radial-gradient(circle at 16% 82%, rgba(122,132,96,0.18), transparent 22%), linear-gradient(180deg, rgba(244,236,217,0.96) 0%, rgba(221,205,167,0.98) 100%)",
        wood: "linear-gradient(180deg, #8e673f 0%, #6e4b2e 100%)",
        timber: "linear-gradient(180deg, #7f5734 0%, #5c3921 54%, #452717 100%)",
        brass: "linear-gradient(180deg, #deb76b 0%, #b7872a 100%)",
        parchment: "linear-gradient(180deg, rgba(251,244,225,0.98) 0%, rgba(237,224,200,0.96) 100%)",
        courtyard: "radial-gradient(circle at top left, rgba(248,243,226,0.75), transparent 24%), linear-gradient(180deg, rgba(239,232,214,0.98) 0%, rgba(220,214,190,0.96) 100%)",
        board: "radial-gradient(circle at 20% 18%, rgba(255, 248, 232, 0.58), transparent 18%), radial-gradient(circle at 88% 8%, rgba(46, 70, 58, 0.16), transparent 20%), linear-gradient(180deg, rgba(239, 220, 177, 0.98) 0%, rgba(208, 183, 125, 0.95) 100%)"
      }
    }
  },
  plugins: []
};

export default config;
