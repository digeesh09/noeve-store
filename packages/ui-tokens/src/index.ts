/** Noeve brand design tokens — shared across web and mobile */
export const colors = {
  brand: {
    primary: '#1a1a2e',
    accent: '#c9a227',
    accentLight: '#e8d5a3',
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
