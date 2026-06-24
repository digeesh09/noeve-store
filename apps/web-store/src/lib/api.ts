import { NoeveApiClient } from '@noeve/api-client';
import { getCartSessionId } from './cart';
import { getAccessToken } from './auth';
import type { Category, Product } from '@noeve/shared-types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/v1';

export const apiClient = new NoeveApiClient({
  baseUrl: API_URL,
  getSessionId: () => {
    if (typeof window === 'undefined') return null;
    return getCartSessionId();
  },
  getAccessToken: () => {
    if (typeof window === 'undefined') return null;
    return getAccessToken();
  },
});

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await apiClient.store.getCategories({ next: { revalidate: 60 } } as RequestInit);
    return res.data;
  } catch {
    return [];
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await apiClient.store.getProducts({ next: { revalidate: 60 } } as RequestInit);
    return res.data;
  } catch {
    return [];
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await apiClient.store.getProduct(slug, { next: { revalidate: 60 } } as RequestInit);
    return res.data;
  } catch {
    return null;
  }
}

export function filterByCategory(products: Product[], categorySlug?: string) {
  if (!categorySlug) return products;
  return products.filter((p) => p.category?.slug === categorySlug);
}
