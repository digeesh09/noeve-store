import Link from 'next/link';
import type { Category } from '@/lib/types';
import React from 'react';
const FALLBACK_GRADIENTS = [
  'from-brand-primary/10 via-brand-accent-light/30 to-brand-accent-gold/20',
  'from-brand-accent-gold/30 via-white to-brand-accent/15',
  'from-brand-primary/5 via-brand-accent-light/20 to-brand-accent-gold/30',
];

interface CategoryTilesProps {
  categories: Category[];
}

export function CategoryTiles({ categories }: CategoryTilesProps): React.ReactNode {
  if (categories.length === 0) return null;

  return (
    <ul className="grid gap-6 sm:grid-cols-3">
      {categories.map((cat, i) => (
        <li key={cat.id}>
          <Link
            href={`/shop?category=${cat.slug}`}
            className={`group flex min-h-[160px] flex-col justify-end rounded-xl border border-neutral-100/85 bg-gradient-to-br p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-accent/30 hover:shadow-[0_10px_25px_rgba(212,175,55,0.06)] ${FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length]}`}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/60">
              Collection
            </span>
            <span className="mt-1 font-serif text-2xl font-bold tracking-wide text-brand-primary transition-colors duration-300 group-hover:text-brand-accent">
              {cat.name}
            </span>
            {cat.description ? (
              <span className="mt-2 line-clamp-2 text-xs leading-relaxed text-neutral-500">{cat.description}</span>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}

