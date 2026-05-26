export interface CartLine {
  id: string;
  quantity: number;
  productId: string;
  variantId: string | null;
  productName: string;
  productSlug: string;
  sku: string;
  imageUrl: string | null;
  unitPriceCents: number;
  lineTotalCents: number;
  currency: string;
}

export interface Cart {
  id: string | null;
  sessionId: string | null;
  lines: CartLine[];
  subtotalCents: number;
  itemCount: number;
  currency: string;
}
