import Constants from 'expo-constants';
import type { Category, Product } from './types';

function getApiUrl() {
  return (
    (Constants.expoConfig?.extra as { apiUrl?: string })?.apiUrl ?? 'http://localhost:3001/v1'
  );
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${getApiUrl()}${path}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as T;
  } catch {
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  return (await fetchJson<Category[]>('/store/categories')) ?? [];
}

export async function getProducts(): Promise<Product[]> {
  return (await fetchJson<Product[]>('/store/products')) ?? [];
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${getApiUrl()}/store/products/${slug}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as Product;
  } catch {
    return null;
  }
}

export function filterByCategory(products: Product[], categorySlug?: string) {
  if (!categorySlug) return products;
  return products.filter((p) => p.category?.slug === categorySlug);
}
