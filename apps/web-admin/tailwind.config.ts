import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { primary: '#1a1a2e', accent: '#c9a227' },
      },
    },
  },
  plugins: [],
};

export default config;
