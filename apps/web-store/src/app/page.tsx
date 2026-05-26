import { CategoryTiles } from '@/components/store/category-tiles';
import { HeroBanner } from '@/components/store/hero-banner';
import { ProductGrid } from '@/components/store/product-grid';
import { SectionHeader } from '@/components/store/section-header';
import { TrustBadges } from '@/components/store/trust-badges';
import { getCategories, getProducts } from '@/lib/api';

export default async function HomePage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const featured = products.slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl space-y-16 px-4 py-8 md:py-12">
      <HeroBanner />

      <section className="space-y-6">
        <SectionHeader title="Shop by collection" subtitle="Jewellery, pendants & care" href="/shop" />
        <CategoryTiles categories={categories} />
      </section>

      <section className="space-y-6">
        <SectionHeader title="Featured pieces" subtitle="Handpicked from our catalogue" href="/shop" />
        <ProductGrid products={featured} />
      </section>

      <section>
        <TrustBadges />
      </section>
    </div>
  );
}
