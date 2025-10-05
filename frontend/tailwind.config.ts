import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary-dark)",
          secondary: "var(--secondary-dark)",
          tertiary: "var(--tertiary-dark)",
        },
        text: {
          primary: "var(--text-light)",
          muted: "var(--text-muted)",
        },
        border: {
          DEFAULT: "var(--border-color)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
