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
    <article className="group flex flex-col">
      <Link href={`/shop/${product.slug}`} className="block">
        {/* Card media */}
        <div
          className="relative mb-4 overflow-hidden"
          style={{
            height: '320px',
            borderRadius: '2px',
            border: '1px solid rgba(26,26,26,0.08)',
            background: 'linear-gradient(135deg, var(--cream-deep), var(--gold-light, #e4d6a7))',
            transition: 'transform 0.4s cubic-bezier(0.2,0.8,0.2,1)',
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
              style={{ transition: 'transform 0.7s ease-out' }}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              {/* Jewel-gradient placeholder */}
              <svg viewBox="0 0 200 200" className="w-24 opacity-30">
                <path d="M40 20 C100 5, 160 60, 150 120 C140 180, 80 190, 50 160 C20 130, 10 60, 40 20 Z" fill="var(--gold)"/>
              </svg>
            </div>
          )}

          {/* Category tag */}
          {categoryLabel && (
            <span
              className="absolute left-3 top-3 z-10 inline-block px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.1em]"
              style={{
                background: 'var(--burgundy)',
                color: 'var(--cream)',
                borderRadius: '1px',
              }}
            >
              {categoryLabel}
            </span>
          )}
        </div>

        {/* Card info */}
        <div className="space-y-1 px-0.5">
          <h3
            className="font-caslon italic text-[1.12rem] text-brand-primary transition-colors duration-300 group-hover:text-brand-accent"
            style={{ fontFamily: '"Libre Caslon Text", serif' }}
          >
            {product.name}
          </h3>
          {product.material && (
            <p className="text-[0.82rem]" style={{ color: 'rgba(26,26,26,0.6)' }}>
              {product.material}{product.purity ? ` · ${product.purity}` : ''}
            </p>
          )}
          <div className="flex items-center gap-2 pt-1">
            <p className="font-mono text-sm font-semibold text-ink" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
              {formatPrice(product.basePriceCents, product.currency)}
            </p>
            {/* Gold stars placeholder */}
            <span className="text-[0.78rem] tracking-[0.08em]" style={{ color: 'var(--gold)' }}>★★★★★</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
