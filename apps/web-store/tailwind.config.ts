import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--oxblood)',
          'primary-dark': 'var(--burgundy-dark)',
          accent: 'var(--champagne)',
          'accent-light': 'var(--gold-light)',
        },
        cream: {
          DEFAULT: 'var(--cream)',
          deep: 'var(--bone)',
          darker: 'var(--stone)',
        },
        ink: {
          DEFAULT: 'var(--ink)',
          muted: 'var(--ink-muted)',
          faint: 'var(--ink-faint)',
        },
      },
      fontFamily: {
        sans:        ['"Public Sans"', 'sans-serif'],
        display:     ['"Libre Caslon Display"', 'serif'],
        serif:       ['"Libre Caslon Text"', 'serif'],
        mono:        ['"JetBrains Mono"', 'monospace'],
      },
      maxWidth: {
        container: '1280px',
      },
    },
  },
  plugins: [],
};

export default config;
