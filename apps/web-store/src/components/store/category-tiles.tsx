import Link from 'next/link';
import type { Category } from '@/lib/types';
import React from 'react';
const FALLBACK_GRADIENTS = [
  'linear-gradient(135deg, var(--bone), var(--champagne))',
  'linear-gradient(135deg, var(--bone), #E2D1C3)',
  'linear-gradient(135deg, var(--bone), #C4CCC8)',
];

interface CategoryTilesProps {
  categories: Category[];
}

export function CategoryTiles({ categories }: CategoryTilesProps): React.ReactNode {
  if (categories.length === 0) return null;

  return (
    <ul className="grid gap-[1.4rem] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((cat, i) => (
        <li key={cat.id}>
          <Link
            href={`/shop?category=${cat.slug}`}
            className="group flex min-h-[380px] flex-col justify-end rounded-[2px] p-[2.2rem_1.8rem] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md relative overflow-hidden isolate"
            style={{ background: FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length] }}
          >
            <span className="tag absolute left-5 top-5 z-10">
              Collection
            </span>
            <span className="font-display text-[1.9rem] relative z-10 mb-[0.4rem]">
              {cat.name}
            </span>
            {cat.description ? (
              <span className="relative z-10 mb-[1.1rem] max-w-[24ch] text-sm" style={{ color: 'rgba(33,29,25,0.75)' }}>{cat.description}</span>
            ) : null}
            <span className="relative z-10 inline-flex items-center gap-[0.4em] font-mono text-[0.78rem] uppercase tracking-[0.1em]">
              Shop {cat.name} 
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

