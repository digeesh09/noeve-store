import React from 'react';
import { ProductCard } from './product-card';
import type { Product } from '@/lib/types';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps): React.JSX.Element {
  if (products.length === 0) {
    return (
      <p style={{ padding: '4rem 0', textAlign: 'center', color: 'rgba(33,29,25,0.5)' }}>
        No pieces in this collection yet. Check back soon.
      </p>
    );
  }

  return (
    <div className="related__grid">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} priority={i < 4} />
      ))}
    </div>
  );
}
