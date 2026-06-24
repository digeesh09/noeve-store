import type { Config } from 'tailwindcss';
import { colors } from '@noeve/ui-tokens';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: colors.brand.primary,
          'primary-dark': colors.brand.primaryDark,
          accent: colors.brand.accent,
          'accent-light': colors.brand.accentLight,
          'accent-gold': colors.brand.accentGold,
        },
        neutral: {
          50: colors.neutral[50],
          100: colors.neutral[100],
          200: colors.neutral[200],
          800: colors.neutral[800],
          900: colors.neutral[900],
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-cinzel)', 'Georgia', 'serif'],
        cinzel: ['var(--font-cinzel)', 'serif'],
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

