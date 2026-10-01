import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#D7263D",
          dark: "#7A1220",
          light: "#FDECEE",
        },
      },
    },
  },
  plugins: [],
};

export default config;
