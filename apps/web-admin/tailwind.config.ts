import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#4A148C',
          'primary-dark': '#311B92',
          accent: '#D4AF37',
          'accent-light': '#F3E8FF',
          'accent-gold': '#F5E6B8',
        },
      },
    },
  },
  plugins: [],
};

export default config;
