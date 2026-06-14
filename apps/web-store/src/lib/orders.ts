'use client';

import { authHeaders } from './auth';
import { getCartSessionId } from './cart';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/v1';

export interface OrderLine {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  currency: string;
  trackingNumber: string | null;
  carrier: string | null;
  createdAt: string;
  lines: OrderLine[];
}

export async function placeOrder(note?: string): Promise<Order> {
  const sessionId = getCartSessionId();
  const res = await fetch(`${API_URL}/store/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(sessionId ? { 'X-Cart-Session': sessionId } : {}),
    },
    body: JSON.stringify({ note }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Could not place order');
  }
  const json = await res.json();
  return json.data as Order;
}

export async function fetchMyOrders(): Promise<Order[]> {
  const res = await fetch(`${API_URL}/store/orders`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    throw new Error('Could not load orders');
  }
  const json = await res.json();
  return json.data as Order[];
}
