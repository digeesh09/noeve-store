import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#5a0014',
          'primary-dark': '#36000c',
          accent: '#cbb36b',
          'accent-light': '#e4d6a7',
        },
        cream: {
          DEFAULT: '#fdfbf4',
          deep: '#f5f0df',
          darker: '#ebdcc0',
        },
        ink: {
          DEFAULT: '#1a1a1a',
          muted: 'rgba(26,26,26,0.65)',
          faint: 'rgba(26,26,26,0.4)',
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
