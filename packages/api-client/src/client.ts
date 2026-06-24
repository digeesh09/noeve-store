import type { ApiErrorBody, ApiResponse, AuthTokens, LoginRequest, RegisterRequest, Category, Product, Cart, Order } from '@noeve/shared-types';

export interface ApiClientConfig {
  baseUrl: string;
  getAccessToken?: () => string | null;
  getSessionId?: () => string | null;
  onUnauthorized?: () => void;
}

export class NoeveApiClient {
  constructor(private readonly config: ApiClientConfig) {}

  private async request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    };

    const token = this.config.getAccessToken?.();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const sessionId = this.config.getSessionId?.();
    if (sessionId) {
      (headers as Record<string, string>)['X-Cart-Session'] = sessionId;
    }

    const res = await fetch(`${this.config.baseUrl}${path}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as ApiErrorBody;
      if (res.status === 401) {
        this.config.onUnauthorized?.();
      }
      throw new ApiClientError(res.status, body.message ?? res.statusText, body);
    }

    return res.json() as Promise<ApiResponse<T>>;
  }

  store = {
    health: () => this.request<{ status: string }>('/store/health'),

    login: (body: LoginRequest) =>
      this.request<AuthTokens>('/store/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    register: (body: RegisterRequest) =>
      this.request<AuthTokens>('/store/auth/register', {
        method: 'POST',
        body: JSON.stringify(body),
      }),

    getCategories: (options?: RequestInit) => this.request<Category[]>('/store/categories', options),
    getProducts: (options?: RequestInit) => this.request<Product[]>('/store/products', options),
    getProduct: (slug: string, options?: RequestInit) => this.request<Product>(`/store/products/${slug}`, options),

    getCartSession: () => this.request<{ sessionId: string }>('/store/cart/session'),
    getCart: (options?: RequestInit) => this.request<Cart>('/store/cart', options),
    addToCart: (body: { productId: string; variantId?: string; quantity: number }, options?: RequestInit) =>
      this.request<Cart>('/store/cart/items', { ...options, method: 'POST', body: JSON.stringify(body) }),
    updateCartLine: (lineId: string, body: { quantity: number }, options?: RequestInit) =>
      this.request<Cart>(`/store/cart/items/${lineId}`, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
    removeCartLine: (lineId: string, options?: RequestInit) =>
      this.request<Cart>(`/store/cart/items/${lineId}`, { ...options, method: 'DELETE' }),
    clearCart: (options?: RequestInit) =>
      this.request<Cart>('/store/cart', { ...options, method: 'DELETE' }),

    placeOrder: (body?: { note?: string }, options?: RequestInit) =>
      this.request<Order>('/store/orders', { ...options, method: 'POST', body: JSON.stringify(body || {}) }),
    getOrders: (options?: RequestInit) => this.request<Order[]>('/store/orders', options),
  };

  admin = {
    health: () => this.request<{ status: string }>('/admin/health'),

    login: (body: LoginRequest) =>
      this.request<AuthTokens>('/admin/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  };
}

export class ApiClientError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly body?: ApiErrorBody,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}
