import { CategoryNav } from '@/components/store/category-nav';
import { ProductGrid } from '@/components/store/product-grid';
import React from 'react';
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
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(1.5rem,5vw,4.5rem)', paddingBottom: '5rem' }}>
      {/* Breadcrumb */}
      <nav style={{ display: 'flex', gap: '0.5em', alignItems: 'center', padding: '1.6rem 0 0', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.7rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)' }}>
        <a href="/" style={{ color: 'inherit' }}>Home</a>
        <span style={{ opacity: 0.5 }}>/</span>
        <span style={{ color: '#1a1a1a' }}>Shop</span>
        {activeCategory && (
          <>
            <span style={{ opacity: 0.5 }}>/</span>
            <span style={{ color: '#1a1a1a' }}>{activeCategory.name}</span>
          </>
        )}
      </nav>

      {/* Page head */}
      <div style={{ padding: '1.2rem 0 2.5rem' }}>
        <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5a0014', marginBottom: '0.4rem' }}>
          {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
        </p>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(2.2rem,4.5vw,3.1rem)', color: '#5a0014', marginTop: '0.4rem' }}>
          {activeCategory ? activeCategory.name : 'All Pieces'}
        </h1>
        <p style={{ marginTop: '0.5rem', color: 'rgba(26,26,26,0.65)', fontSize: '0.95rem' }}>
          {activeCategory?.description ?? 'Fine jewellery, elegant pendants, and ladies care accessories.'}
        </p>
      </div>

      {/* Category nav */}
      <div style={{ marginBottom: '2rem' }}>
        <CategoryNav categories={categories} activeSlug={categorySlug} />
      </div>

      {/* Grid */}
      <ProductGrid products={filtered} />
    </div>
  );
}
