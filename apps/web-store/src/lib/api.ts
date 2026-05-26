const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/v1';

export async function getProducts() {
  try {
    const res = await fetch(`${API_URL}/store/products`, { next: { revalidate: 60 } });
    if (!res.ok) return { data: [] as ProductListItem[] };
    const json = await res.json();
    return { data: json.data as ProductListItem[] };
  } catch {
    return { data: [] as ProductListItem[] };
  }
}

export async function getProduct(slug: string) {
  const res = await fetch(`${API_URL}/store/products/${slug}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data as ProductDetail;
}

interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  basePriceCents: number;
  currency: string;
  images?: { url: string; alt: string | null }[];
}

interface ProductDetail extends ProductListItem {
  description: string | null;
  material: string | null;
  purity: string | null;
  gemstone: string | null;
  weightGrams: number | null;
  careInstructions: string | null;
}
