/** Noeve brand design tokens — purple & gold theme */
export const colors = {
  brand: {
    primary: '#4A148C',
    primaryDark: '#311B92',
    accent: '#D4AF37',
    accentLight: '#F3E8FF',
    accentGold: '#F5E6B8',
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    800: '#262626',
    900: '#171717',
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
