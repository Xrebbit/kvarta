import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      screens: {
        tall: { raw: '(min-height: 821px)' },
        cozy: { raw: '(min-height: 700px)' },
      },
      fontFamily: {
        sans: ['var(--font-jost)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        display: ['var(--font-oswald)', 'Impact', 'sans-serif'],
        hand: ['var(--font-caveat)', 'cursive'],
      },
    },
  },
  plugins: [],
};

export default config;
