import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/format';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority }: ProductCardProps): React.JSX.Element {
  const image = product.images?.[0];
  const categoryLabel = product.category?.name || 'Apparel';
  const materialLabel = product.material || 'Premium Material';

  return (
    <Link href={`/shop/${product.slug}`} className="card outline outline-1 outline-[rgba(33,29,25,0.1)] p-4 rounded-sm hover:shadow-md transition-shadow">
      <div
        className="card__media"
        style={{
          background: 'linear-gradient(135deg, var(--bone), var(--champagne))',
        }}
      >
        {image ? (
          <Image
            src={image.url}
            alt={image.alt ?? product.name}
            fill
            priority={priority}
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <Image
            src="/public/uploads/placeholder.png"
            alt={product.name}
            fill
            priority={priority}
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}
      </div>

      <h3 className="card__name">{product.name}</h3>
      <p className="card__meta">
        {categoryLabel} — {materialLabel} — {formatPrice(product.basePriceCents, product.currency)}
      </p>
      <div className="card__rating">
        <span className="card__stars">★★★★★</span>
        <span className="card__rating-text">4.9 (184)</span>
      </div>
    </Link>
  );
}
