import React from 'react';
import Link from 'next/link';
import { CategoryNav } from '@/components/store/category-nav';
import { ProductGrid } from '@/components/store/product-grid';
import { filterByCategory, getCategories, getProducts } from '@/lib/api';

interface ShopPageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps): Promise<React.JSX.Element> {
  const { category: categorySlug, q } = await searchParams;
  const [categories, products, trendingProducts] = await Promise.all([getCategories(), getProducts(), getProducts('popular')]);
  
  let filtered = filterByCategory(products, categorySlug);
  if (q) {
    const query = q.toLowerCase();
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(query) || p.description?.toLowerCase().includes(query));
  }
  
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
      <div style={{ marginBottom: '2.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <CategoryNav categories={categories} activeSlug={categorySlug} />
        
        <form method="GET" action="/shop" style={{ display: 'flex' }}>
          {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
          <input 
            type="text" 
            name="q" 
            defaultValue={q || ''} 
            placeholder="Search pieces..." 
            style={{ padding: '0.5rem 1rem', border: '1px solid var(--border)', borderRadius: '4px 0 0 4px', fontSize: '0.85rem' }} 
          />
          <button type="submit" className="btn btn--primary" style={{ padding: '0.5rem 1rem', borderRadius: '0 4px 4px 0', minHeight: 'auto' }}>
            Search
          </button>
        </form>
      </div>
      
      {!categorySlug && !q && trendingProducts.length > 0 && (
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--oxblood)' }}>
            Trending Now
          </h2>
          <ProductGrid products={trendingProducts.slice(0, 4)} />
          <hr style={{ margin: '4rem 0 2rem 0', borderColor: 'rgba(33,29,25,.1)' }} />
          <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.8rem', marginBottom: '1.5rem' }}>
            All Pieces
          </h2>
        </div>
      )}

      {/* Grid */}
      <ProductGrid products={filtered} />
    </div>
  );
}
