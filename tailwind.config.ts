import { withUt } from "uploadthing/tw";
import type { Config } from "tailwindcss";
const flowbite = require("flowbite-react/tailwind");

const config: Config = withUt({
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{ts,tsx,mdx}", // for extra coverage
    flowbite.content() // integrating Flowbite content
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
    flowbite.plugin(),
    // add other plugins here if needed
  ],
});

export default config; 