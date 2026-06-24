import React from 'react';
import Link from 'next/link';
import type { Category } from '@/lib/types';

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
            className="shrink-0 px-4 py-2 text-[0.82rem] font-medium uppercase tracking-[0.06em] transition-all duration-200"
            style={{
              borderRadius: '1px',
              border: `1px solid ${isActive ? 'var(--burgundy)' : 'rgba(26,26,26,0.2)'}`,
              background: isActive ? 'var(--burgundy)' : 'transparent',
              color: isActive ? 'var(--cream)' : 'var(--ink)',
            }}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
