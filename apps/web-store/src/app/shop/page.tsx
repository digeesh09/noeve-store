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
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-accent">Catalogue</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-brand-primary md:text-4xl">
          {activeCategory ? activeCategory.name : 'All pieces'}
        </h1>
        <p className="mt-2 text-neutral-600">
          {activeCategory?.description ??
            'Fine jewellery, elegant pendants, and ladies care accessories.'}
        </p>
      </div>

      <div className="mt-8">
        <CategoryNav categories={categories} activeSlug={categorySlug} />
      </div>

      <div className="mt-8">
        <p className="mb-4 text-sm text-neutral-500">
          {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
        </p>
        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}
