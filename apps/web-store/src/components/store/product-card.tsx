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
    <Link href={`/shop/${product.slug}`} className="card">
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
          <div className="flex h-full items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-24 opacity-30">
              <path d="M40 20 C100 5, 160 60, 150 120 C140 180, 80 190, 50 160 C20 130, 10 60, 40 20 Z" fill="var(--champagne)" />
            </svg>
          </div>
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
