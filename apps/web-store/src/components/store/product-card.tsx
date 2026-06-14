import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/format';
import type { Product } from '@/lib/types';
import React from 'react';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority }: ProductCardProps): React.JSX.Element {
  const image = product.images?.[0];
  const categoryLabel = product.category?.name;

  return (
    <article className="group relative rounded-xl border border-neutral-100 bg-white p-3 transition-all duration-500 hover:border-brand-accent/30 hover:shadow-[0_8px_30px_rgba(212,175,55,0.08)]">
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-neutral-50">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt ?? product.name}
              fill
              priority={priority}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-neutral-400">No Image Available</div>
          )}
          {categoryLabel ? (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-brand-primary/90 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-brand-accent backdrop-blur-sm">
              {categoryLabel}
            </span>
          ) : null}
        </div>
        <div className="mt-4 space-y-1 px-1 pb-1">
          <h3 className="font-serif text-lg font-semibold tracking-wide text-brand-primary transition-colors duration-300 group-hover:text-brand-accent">
            {product.name}
          </h3>
          {product.material ? (
            <p className="text-[11px] font-medium tracking-wide text-neutral-400">
              {product.material}
              {product.purity ? ` · ${product.purity}` : ''}
            </p>
          ) : null}
          <div className="pt-1 flex items-center justify-between">
            <p className="font-sans text-sm font-bold text-brand-accent">
              {formatPrice(product.basePriceCents, product.currency)}
            </p>
            <span className="text-[10px] font-semibold text-brand-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              View Details ➔
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

