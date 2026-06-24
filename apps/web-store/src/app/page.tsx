import { HeroBanner } from '@/components/store/hero-banner';
import { ProductGrid } from '@/components/store/product-grid';
import { CategoryTiles } from '@/components/store/category-tiles';
import { getCategories, getProducts } from '@/lib/api';
import React from 'react';
import Link from 'next/link';

export default async function HomePage(): Promise<React.JSX.Element> {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const featured = products.slice(0, 6);

  return (
    <div className="mx-auto max-w-container px-[var(--edge)]">
      {/* Hero */}
      <HeroBanner />

      {/* Category pillars */}
      {categories.length > 0 && (
        <section className="py-12 md:py-16" id="categories">
          <div className="mb-8 flex items-baseline justify-between gap-4">
            <div>
              <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--burgundy)' }}>
                Collections
              </p>
              <h2 className="font-cinzel text-3xl text-brand-primary md:text-4xl">Shop by Category</h2>
            </div>
            <Link
              href="/shop"
              className="shrink-0 text-[0.78rem] font-medium uppercase tracking-[0.08em] underline-offset-4 hover:underline"
              style={{ color: 'var(--burgundy)' }}
            >
              View All
            </Link>
          </div>
          <CategoryTiles categories={categories} />
        </section>
      )}

      {/* Featured products */}
      <section className="py-4 pb-16 md:pb-20" id="edit">
        <div className="mb-8 flex items-baseline justify-between gap-4">
          <div>
            <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--burgundy)' }}>
              Handpicked
            </p>
            <h2 className="font-cinzel text-3xl text-brand-primary md:text-4xl">The Current Edit</h2>
          </div>
          <Link
            href="/shop"
            className="shrink-0 text-[0.78rem] font-medium uppercase tracking-[0.08em] underline-offset-4 hover:underline"
            style={{ color: 'var(--burgundy)' }}
          >
            View All
          </Link>
        </div>
        <ProductGrid products={featured} />
      </section>

      {/* Quote band — matching reference dark quote section */}
      <section
        className="-mx-[var(--edge)] px-[var(--edge)] py-20 text-center"
        style={{ background: 'var(--ink)', color: 'var(--cream)' }}
      >
        <div className="mx-auto max-w-2xl">
          <div className="mx-auto mb-8 h-px w-12" style={{ background: 'var(--gold)' }} />
          <p
            className="mb-4 leading-[1.32]"
            style={{
              fontFamily: '"Libre Caslon Text", serif',
              fontStyle: 'italic',
              fontSize: 'clamp(1.6rem, 3.6vw, 2.4rem)',
              color: 'var(--cream)',
            }}
          >
            We don't chase seasons. We build the pieces that outlast them.
          </p>
          <p
            className="text-[0.74rem] font-semibold uppercase tracking-[0.16em]"
            style={{ color: 'var(--gold)' }}
          >
            — The Noeve Studio
          </p>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 text-center" id="newsletter">
        <p className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--burgundy)' }}>
          Stay Close
        </p>
        <h2 className="font-cinzel mb-4 text-3xl text-brand-primary md:text-4xl">Join the list</h2>
        <p className="mx-auto mb-8 max-w-[42ch] text-sm" style={{ color: 'rgba(26,26,26,0.72)' }}>
          First access to new drops, early entry to sales, and a short note from the studio — once a month, never more.
        </p>
        <div className="mx-auto flex max-w-md flex-wrap justify-center gap-3">
          <input
            type="email"
            placeholder="Your email address"
            className="min-w-[240px] flex-1 bg-transparent px-1 py-3 text-base outline-none"
            style={{ borderBottom: '1px solid var(--ink)', color: 'var(--ink)' }}
          />
          <button
            type="button"
            className="px-7 py-3 text-[0.85rem] font-semibold uppercase tracking-[0.05em] transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90"
            style={{ background: 'var(--burgundy)', color: 'var(--cream)', borderRadius: '1px' }}
          >
            Subscribe
          </button>
        </div>
        <p className="mt-4 text-[0.74rem]" style={{ color: 'rgba(26,26,26,0.5)' }}>
          By joining, you agree to receive marketing emails. Unsubscribe anytime.
        </p>
      </section>
    </div>
  );
}
