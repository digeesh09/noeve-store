'use client';

import { authHeaders } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/v1';

async function adminFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (res.status === 401) {
    const { clearAccessToken } = require('./auth');
    clearAccessToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login?session_expired=true';
    }
    throw new Error('Session expired');
  }
  return res;
}

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
  const res = await adminFetch(`${API_URL}/admin/orders${params}`, {
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
  const res = await adminFetch(`${API_URL}/admin/orders/${orderId}/status`, {
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

export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  priceCents: number;
  stockQuantity: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  basePriceCents: number;
  currency: string;
  categoryId: string;
  material: string | null;
  purity: string | null;
  gemstone: string | null;
  weightGrams: number | null;
  createdAt: string;
  variants?: ProductVariant[];
  images?: ProductImage[];
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await adminFetch(`${API_URL}/admin/products`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Could not load products');
  }
  const json = await res.json();
  return json.data as Product[];
}

export async function createProduct(payload: any): Promise<Product> {
  const res = await adminFetch(`${API_URL}/admin/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Could not create product');
  }
  const json = await res.json();
  return json.data as Product;
}

export async function updateProduct(id: string, payload: any): Promise<Product> {
  const res = await adminFetch(`${API_URL}/admin/products/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Could not update product');
  }
  const json = await res.json();
  return json.data as Product;
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await adminFetch(`${API_URL}/admin/products/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Could not delete product');
  }
}

export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await adminFetch(`${API_URL}/admin/upload`, {
    method: 'POST',
    headers: {
      ...authHeaders(),
    },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Could not upload file');
  }
  const json = await res.json();
  return json.url;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await adminFetch(`${API_URL}/store/categories`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Could not load categories');
  }
  const json = await res.json();
  return json.data as Category[];
}

export interface Promotion {
  id: string;
  code: string;
  description: string | null;
  discountPercentage: number | null;
  discountCents: number | null;
  minOrderValue: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

export async function fetchPromotions(): Promise<Promotion[]> {
  const res = await adminFetch(`${API_URL}/admin/orders/promotions`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Could not load promotions');
  const json = await res.json();
  return json.data as Promotion[];
}

export async function createPromotion(payload: any): Promise<Promotion> {
  const res = await adminFetch(`${API_URL}/admin/orders/promotions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Could not create promotion');
  const json = await res.json();
  return json.data as Promotion;
}

export async function deletePromotion(id: string): Promise<void> {
  const res = await adminFetch(`${API_URL}/admin/orders/promotions/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Could not delete promotion');
}
