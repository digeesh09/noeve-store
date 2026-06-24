/** Noeve brand design tokens — purple & gold theme */
export const colors = {
  brand: {
    primary: '#5a0014',
    primaryDark: '#36000c',
    accent: '#cbb36b',
    accentLight: '#e4d6a7',
    accentGold: '#cbb36b',
  },
  neutral: {
    50: '#fdfbf4',
    100: '#f5f0df',
    200: '#ebdcc0',
    800: '#262626',
    900: '#000000',
  },
  semantic: {
    success: '#16a34a',
    error: '#dc2626',
    warning: '#ca8a04',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const typography = {
  fontFamily: {
    sans: 'Inter, system-ui, sans-serif',
    serif: 'Cormorant Garamond, Georgia, serif',
  },
  fontSize: {
    sm: 14,
    base: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
} as const;
