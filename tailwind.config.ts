import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./ui/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "361px",
        sm: "601px",
        md: "901px",
        lg: "1101px",
        xl: "1441px",
        xxl: "1921px",
      },
      colors: {
        primary: {
          DEFAULT: "#0B2A3C",
        },
        secondary: {
          DEFAULT: "#1e7487",
        },
        tertiary: {
          DEFAULT: "#D2433C",
        },
        white: {
          DEFAULT: "#FFFFFF",
        },
        black:{
          DEFAULT: "#101010",
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
