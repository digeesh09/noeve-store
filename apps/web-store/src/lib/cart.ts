'use client';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/v1';
const SESSION_KEY = 'noeve_cart_session';

export interface CartLine {
  id: string;
  quantity: number;
  productId: string;
  variantId: string | null;
  productName: string;
  productSlug: string;
  sku: string;
  imageUrl: string | null;
  unitPriceCents: number;
  lineTotalCents: number;
  currency: string;
}

export interface Cart {
  id: string | null;
  sessionId: string | null;
  lines: CartLine[];
  subtotalCents: number;
  itemCount: number;
  currency: string;
}

const emptyCart: Cart = {
  id: null,
  sessionId: null,
  lines: [],
  subtotalCents: 0,
  itemCount: 0,
  currency: 'INR',
};

export function getCartSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_KEY);
}

export function setCartSessionId(sessionId: string) {
  localStorage.setItem(SESSION_KEY, sessionId);
}

async function ensureSession(): Promise<string> {
  let sessionId = getCartSessionId();
  if (sessionId) return sessionId;

  const res = await fetch(`${API_URL}/store/cart/session`);
  if (!res.ok) throw new Error('Could not start cart session');
  const json = await res.json();
  sessionId = json.data.sessionId as string;
  setCartSessionId(sessionId);
  return sessionId;
}

async function cartFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const sessionId = await ensureSession();
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-Cart-Session': sessionId,
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Cart request failed');
  }
  const json = await res.json();
  return json.data as T;
}

export async function fetchCart(): Promise<Cart> {
  try {
    const sessionId = getCartSessionId();
    if (!sessionId) return emptyCart;
    return await cartFetch<Cart>('/store/cart');
  } catch {
    return emptyCart;
  }
}

export async function addToCart(productId: string, variantId?: string, quantity = 1) {
  return cartFetch<Cart>('/store/cart/items', {
    method: 'POST',
    body: JSON.stringify({ productId, variantId, quantity }),
  });
}

export async function updateCartLine(lineId: string, quantity: number) {
  return cartFetch<Cart>(`/store/cart/items/${lineId}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  });
}

export async function removeCartLine(lineId: string) {
  return cartFetch<Cart>(`/store/cart/items/${lineId}`, { method: 'DELETE' });
}

export async function clearCart() {
  return cartFetch<Cart>('/store/cart', { method: 'DELETE' });
}
