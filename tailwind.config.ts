import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-jost)', 'system-ui', 'sans-serif'],
        display: ['var(--font-oswald)', 'Impact', 'sans-serif'],
        hand: ['var(--font-caveat)', 'cursive'],
      },
    },
  },
  plugins: [],
};

export default config;
