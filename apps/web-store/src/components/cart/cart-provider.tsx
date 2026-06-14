'use client';

import React from 'react';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  addToCart as apiAdd,
  fetchCart,
  removeCartLine,
  updateCartLine,
  type Cart,
} from '@/lib/cart';

interface CartContextValue {
  cart: Cart;
  loading: boolean;
  refresh: () => Promise<void>;
  addItem: (productId: string, variantId?: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

const empty: Cart = {
  id: null,
  sessionId: null,
  lines: [],
  subtotalCents: 0,
  itemCount: 0,
  currency: 'INR',
};

export function CartProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [cart, setCart] = useState<Cart>(empty);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await fetchCart();
    setCart(data);
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const addItem = useCallback(async (productId: string, variantId?: string) => {
    const data = await apiAdd(productId, variantId, 1);
    setCart(data);
  }, []);

  const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
    const data = await updateCartLine(lineId, quantity);
    setCart(data);
  }, []);

  const removeItem = useCallback(async (lineId: string) => {
    const data = await removeCartLine(lineId);
    setCart(data);
  }, []);

  const value = useMemo(
    () => ({ cart, loading, refresh, addItem, updateQuantity, removeItem }),
    [cart, loading, refresh, addItem, updateQuantity, removeItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
