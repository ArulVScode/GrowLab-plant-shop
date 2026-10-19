/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        cream: "#FFFDF2",
        paper: "#FFFFFF",
        yellow: {
          DEFAULT: "#FFD21F",
          soft: "#FFE98A",
        },
        leaf: {
          DEFAULT: "#8BE62E",
          deep: "#3F8F1B",
          soft: "#D9F7B0",
        },
        sky: {
          DEFAULT: "#3B82F6",
          soft: "#CFE0FF",
        },
        clay: {
          DEFAULT: "#FF7A00",
          soft: "#FFDCB8",
        },
        muted: "#6B6B63",
        line: "#111111",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        hard: "4px 4px 0px 0px #111111",
        "hard-sm": "2px 2px 0px 0px #111111",
        "hard-lg": "8px 8px 0px 0px #111111",
        "hard-yellow": "4px 4px 0px 0px #FFD21F",
        "hard-green": "4px 4px 0px 0px #8BE62E",
      },
      borderWidth: {
        3: "3px",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 22s linear infinite",
      },
    },
  },
  plugins: [],
};
