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
} from '../lib/cart';

interface CartContextValue {
  cart: Cart;
  loading: boolean;
  refresh: () => Promise<void>;
  addItem: (productId: string, variantId?: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
}

const empty: Cart = {
  id: null,
  sessionId: null,
  lines: [],
  subtotalCents: 0,
  itemCount: 0,
  currency: 'INR',
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(empty);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setCart(await fetchCart());
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const addItem = useCallback(async (productId: string, variantId?: string) => {
    setCart(await apiAdd(productId, variantId, 1));
  }, []);

  const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
    setCart(await updateCartLine(lineId, quantity));
  }, []);

  const removeItem = useCallback(async (lineId: string) => {
    setCart(await removeCartLine(lineId));
  }, []);

  const value = useMemo(
    () => ({ cart, loading, refresh, addItem, updateQuantity, removeItem }),
    [cart, loading, refresh, addItem, updateQuantity, removeItem],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart requires CartProvider');
  return ctx;
}
