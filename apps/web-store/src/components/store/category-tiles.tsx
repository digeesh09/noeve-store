import Link from 'next/link';
import type { Category } from '@/lib/types';

const FALLBACK_GRADIENTS = [
  'from-brand-accent-light/80 to-brand-accent/30',
  'from-neutral-200 to-brand-accent-light/50',
  'from-brand-primary/20 to-brand-accent-light/60',
];

interface CategoryTilesProps {
  categories: Category[];
}

export function CategoryTiles({ categories }: CategoryTilesProps) {
  if (categories.length === 0) return null;

  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      {categories.map((cat, i) => (
        <li key={cat.id}>
          <Link
            href={`/shop?category=${cat.slug}`}
            className={`group flex min-h-[140px] flex-col justify-end rounded-xl bg-gradient-to-br p-5 transition hover:shadow-md ${FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length]}`}
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-primary/70">
              Collection
            </span>
            <span className="mt-1 font-serif text-xl font-semibold text-brand-primary group-hover:text-brand-accent">
              {cat.name}
            </span>
            {cat.description ? (
              <span className="mt-1 line-clamp-2 text-xs text-neutral-600">{cat.description}</span>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
