/** API path constants — keep in sync with NestJS controllers */
export const API_PATHS = {
  store: {
    health: '/store/health',
    auth: {
      login: '/store/auth/login',
      register: '/store/auth/register',
      refresh: '/store/auth/refresh',
    },
    products: '/store/products',
    categories: '/store/categories',
    cart: '/store/cart',
    orders: '/store/orders',
  },
  admin: {
    health: '/admin/health',
    auth: {
      login: '/admin/auth/login',
    },
    products: '/admin/products',
    orders: '/admin/orders',
    fulfillment: '/admin/fulfillment',
  },
} as const;
