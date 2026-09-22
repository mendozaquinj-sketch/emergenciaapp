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
          DEFAULT: "#1F6F5C",
          dark: "#14453A",
          light: "#EAF3F1",
        },
      },
    },
  },
  plugins: [],
};

export default config;
