export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
}

export interface ProductImage {
  url: string;
  alt: string | null;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  priceCents: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  basePriceCents: number;
  currency: string;
  material: string | null;
  purity: string | null;
  gemstone: string | null;
  weightGrams: number | null;
  careInstructions: string | null;
  images?: ProductImage[];
  variants?: ProductVariant[];
  category?: Category;
}
