import React from 'react';
import Link from 'next/link';
import { CategoryNav } from '@/components/store/category-nav';
import { ProductGrid } from '@/components/store/product-grid';
import { filterByCategory, getCategories, getProducts } from '@/lib/api';

interface ShopPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps): Promise<React.JSX.Element> {
  const { category: categorySlug } = await searchParams;
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const filtered = filterByCategory(products, categorySlug);
  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="wrap" style={{ paddingBottom: '5rem' }}>
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <span style={{ color: 'var(--ink)' }}>Shop</span>
        {activeCategory && (
          <>
            <span>/</span>
            <span style={{ color: 'var(--ink)' }}>{activeCategory.name}</span>
          </>
        )}
      </nav>

      {/* Page head */}
      <div className="page-head">
        <p className="eyebrow">
          {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
        </p>
        <h1>{activeCategory ? activeCategory.name : 'All Pieces'}</h1>
        <p className="sub">
          {activeCategory?.description ?? 'Fine apparel, elegant objects, and organic beauty formulas.'}
        </p>
      </div>

      {/* Category nav */}
      <div style={{ marginBottom: '2.5rem' }}>
        <CategoryNav categories={categories} activeSlug={categorySlug} />
      </div>

      {/* Grid */}
      <ProductGrid products={filtered} />
    </div>
  );
}
