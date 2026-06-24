import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Cart } from './cart-types';
import { apiClient, SESSION_KEY, setApiSessionId } from './api';

export type { Cart, CartLine } from './cart-types';

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

  const res = await apiClient.store.getCartSession();
  sessionId = res.data.sessionId;
  await setApiSessionId(sessionId);
  return sessionId;
}

export async function fetchCart(): Promise<Cart> {
  try {
    const sessionId = await getCartSessionId();
    if (!sessionId) return emptyCart;
    const res = await apiClient.store.getCart();
    return res.data;
  } catch {
    return emptyCart;
  }
}

export async function addToCart(productId: string, variantId?: string, quantity = 1) {
  await ensureSession();
  const res = await apiClient.store.addToCart({ productId, variantId, quantity });
  return res.data;
}

export async function updateCartLine(lineId: string, quantity: number) {
  await ensureSession();
  const res = await apiClient.store.updateCartLine(lineId, { quantity });
  return res.data;
}

export async function removeCartLine(lineId: string) {
  await ensureSession();
  const res = await apiClient.store.removeCartLine(lineId);
  return res.data;
}
