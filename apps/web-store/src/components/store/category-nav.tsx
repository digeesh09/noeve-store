import Link from 'next/link';
import type { Category } from '@/lib/types';
import React from 'react';
interface CategoryNavProps {
  categories: Category[];
  activeSlug?: string;
  basePath?: string;
}

export function CategoryNav({
  categories,
  activeSlug,
  basePath = '/shop',
}: CategoryNavProps): React.JSX.Element {
  const items = [{ slug: '', name: 'All' }, ...categories.map((c) => ({ slug: c.slug, name: c.name }))];

  return (
    <nav className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" aria-label="Categories">
      {items.map((item) => {
        const href = item.slug ? `${basePath}?category=${item.slug}` : basePath;
        const isActive = (activeSlug ?? '') === item.slug;
        return (
          <Link
            key={item.slug || 'all'}
            href={href}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive
                ? 'bg-brand-primary text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-brand-accent-light/60'
            }`}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
