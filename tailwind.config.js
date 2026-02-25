/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        uclaGold: "rgb(255, 209, 0)",
        uclaBlue: "rgb(39, 116, 174)",
        uclaDarkerBlue: "rgba(0, 85, 135)",
        notion: {
          bg: {
            secondary: "#F7F6F3",
            hover: "#F1F1EF",
            tertiary: "#EEEEED",
          },
          text: {
            DEFAULT: "#37352F",
            secondary: "#787774",
            tertiary: "#9B9A97",
          },
          border: "#E3E2DE",
          accent: {
            DEFAULT: "#2EAADC",
            light: "#D3E5EF",
            hover: "#2496C4",
          },
          highlight: "#FDECC8",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
