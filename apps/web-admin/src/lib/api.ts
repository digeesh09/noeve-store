'use client';

import { authHeaders } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/v1';

export interface OrderLine {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
}

export interface OrderUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
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
  user?: OrderUser;
}

export async function fetchOrders(status?: string): Promise<Order[]> {
  const params = status ? `?status=${status}` : '';
  const res = await fetch(`${API_URL}/admin/orders${params}`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Could not load orders');
  }
  const json = await res.json();
  return json.data as Order[];
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
  note?: string,
): Promise<Order> {
  const res = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ status, note }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Could not update status');
  }
  const json = await res.json();
  return json.data as Order;
}
