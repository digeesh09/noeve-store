import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import type { Cart } from './cart-types';

export type { Cart, CartLine } from './cart-types';

const SESSION_KEY = 'noeve_cart_session';

function getApiUrl() {
  return (
    (Constants.expoConfig?.extra as { apiUrl?: string })?.apiUrl ?? 'http://localhost:3001/v1'
  );
}

const emptyCart: Cart = {
  id: null,
  sessionId: null,
  lines: [],
  subtotalCents: 0,
  itemCount: 0,
  currency: 'INR',
};

export async function getCartSessionId(): Promise<string | null> {
  return AsyncStorage.getItem(SESSION_KEY);
}

async function ensureSession(): Promise<string> {
  let sessionId = await getCartSessionId();
  if (sessionId) return sessionId;

  const res = await fetch(`${getApiUrl()}/store/cart/session`);
  if (!res.ok) throw new Error('Could not start cart session');
  const json = await res.json();
  sessionId = json.data.sessionId as string;
  await AsyncStorage.setItem(SESSION_KEY, sessionId);
  return sessionId;
}

async function cartFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const sessionId = await ensureSession();
  const res = await fetch(`${getApiUrl()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-Cart-Session': sessionId,
      ...(init?.headers as Record<string, string>),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? 'Cart request failed');
  }
  const json = await res.json();
  return json.data as T;
}

export async function fetchCart(): Promise<Cart> {
  try {
    const sessionId = await getCartSessionId();
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
