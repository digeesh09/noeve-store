import React from 'react';
import { notFound } from 'next/navigation';
import { getProduct, getProducts } from '@/lib/api';
import { ProductDetailClient } from './product-detail-client';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }): Promise<React.JSX.Element> {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([
    getProduct(slug),
    getProducts(),
  ]);

  if (!product) notFound();

  // Filter out the current product from related products
  const relatedProducts = allProducts.filter((p) => p.id !== product.id);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
