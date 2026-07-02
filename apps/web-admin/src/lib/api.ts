'use client';

import { getAccessToken, clearAccessToken } from './auth';
import { NoeveApiClient } from '@noeve/api-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/v1';

export const apiClient = new NoeveApiClient({
  baseUrl: API_URL,
  getAccessToken: () => getAccessToken(),
  onUnauthorized: () => {
    clearAccessToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login?session_expired=true';
    }
  },
});

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
  discountCents?: number;
  promotionCode?: string | null;
}

export async function fetchOrders(status?: string): Promise<Order[]> {
  const res = await apiClient.admin.getOrders(status);
  return res.data as unknown as Order[];
}

export async function updateOrderStatus(orderId: string, status: string, note?: string): Promise<Order> {
  const res = await apiClient.admin.updateOrderStatus(orderId, { status, note });
  return res.data as unknown as Order;
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
  const res = await apiClient.admin.getProducts();
  return res.data as unknown as Product[];
}

export async function createProduct(payload: any): Promise<Product> {
  const res = await apiClient.admin.createProduct(payload);
  return res.data as unknown as Product;
}

export async function updateProduct(id: string, payload: any): Promise<Product> {
  const res = await apiClient.admin.updateProduct(id, payload);
  return res.data as unknown as Product;
}

export async function deleteProduct(id: string): Promise<void> {
  await apiClient.admin.deleteProduct(id);
}

export async function uploadFile(file: File): Promise<string> {
  const res = await apiClient.admin.uploadFile(file);
  return res.data.url;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await apiClient.store.getCategories();
  return res.data as unknown as Category[];
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
  const res = await apiClient.admin.getPromotions();
  return res.data as unknown as Promotion[];
}

export async function createPromotion(payload: any): Promise<Promotion> {
  const res = await apiClient.admin.createPromotion(payload);
  return res.data as unknown as Promotion;
}

export async function deletePromotion(id: string): Promise<void> {
  await apiClient.admin.deletePromotion(id);
}

export interface StoreSettings {
  id: string;
  shippingThresholdCents: number;
  shippingRateCents: number;
  taxRatePercentage: number;
  updatedAt: string;
}

export async function fetchSettings(): Promise<StoreSettings> {
  const res = await apiClient.admin.getSettings();
  return res.data as unknown as StoreSettings;
}

export async function updateSettings(payload: any): Promise<StoreSettings> {
  const res = await apiClient.admin.updateSettings(payload);
  return res.data as unknown as StoreSettings;
}

