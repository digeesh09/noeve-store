import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AddToCartSection } from './add-to-cart-section';
import { formatPrice } from '@/lib/format';
import { getProduct } from '@/lib/api';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }): Promise<React.JSX.Element> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const image = product.images?.[0];
  const specs = [
    { label: 'Material', value: product.material },
    { label: 'Purity', value: product.purity },
    { label: 'Gemstone', value: product.gemstone },
    { label: 'Weight', value: product.weightGrams ? `${product.weightGrams} g` : null },
  ].filter((s) => s.value);

  return (
    <div className="mx-auto max-w-container px-[var(--edge)]">
      {/* Breadcrumb */}
      <nav
        className="flex items-center gap-2 py-6 text-[0.7rem] uppercase tracking-[0.07em]"
        style={{ fontFamily: '"JetBrains Mono", monospace', color: 'rgba(26,26,26,0.5)' }}
      >
        <Link href="/" className="transition-colors hover:text-brand-primary">Home</Link>
        <span style={{ opacity: 0.5 }}>/</span>
        <Link href="/shop" className="transition-colors hover:text-brand-primary">Shop</Link>
        {product.category && (
          <>
            <span style={{ opacity: 0.5 }}>/</span>
            <Link href={`/shop?category=${product.category.slug}`} className="transition-colors hover:text-brand-primary">
              {product.category.name}
            </Link>
          </>
        )}
        <span style={{ opacity: 0.5 }}>/</span>
        <span style={{ color: 'var(--ink)' }}>{product.name}</span>
      </nav>

      {/* PDP grid */}
      <div className="grid gap-14 pb-20 lg:grid-cols-2 lg:gap-20">
        {/* Gallery */}
        <div>
          <div
            className="relative mb-4"
            style={{
              height: '560px',
              borderRadius: '2px',
              border: '1px solid rgba(26,26,26,0.08)',
              background: 'linear-gradient(135deg, var(--cream-deep), var(--gold-light, #e4d6a7))',
              overflow: 'hidden',
            }}
          >
            {/* New tag */}
            {product.category && (
              <span
                className="absolute left-5 top-5 z-10 inline-block border px-2 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.1em]"
                style={{
                  background: 'var(--cream)',
                  borderColor: 'var(--gold)',
                  color: 'var(--ink)',
                  transform: 'rotate(-3deg)',
                }}
              >
                {product.category.name}
              </span>
            )}
            {image && (
              <Image
                src={image.url}
                alt={image.alt ?? product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {product.category && (
            <p
              className="mb-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em]"
              style={{ color: 'var(--burgundy)' }}
            >
              {product.category.name}
            </p>
          )}

          <h1 className="font-display text-[clamp(2rem,4vw,2.8rem)] leading-tight text-brand-primary">
            {product.name}
          </h1>

          {/* Stars */}
          <div className="mt-3 flex items-center gap-3">
            <span className="text-[0.95rem] tracking-[0.1em]" style={{ color: 'var(--gold)' }}>★★★★★</span>
            <span
              className="text-[0.74rem] underline"
              style={{ fontFamily: '"JetBrains Mono", monospace', color: 'rgba(26,26,26,0.6)' }}
            >
              4.9 (reviews)
            </span>
          </div>

          <p
            className="mt-4 text-[1.7rem] font-semibold"
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          >
            {formatPrice(product.basePriceCents, product.currency)}
          </p>

          {product.description && (
            <p className="mt-5 max-w-[46ch] leading-relaxed text-sm" style={{ color: 'rgba(26,26,26,0.78)' }}>
              {product.description}
            </p>
          )}

          {/* Specs */}
          {specs.length > 0 && (
            <dl className="mt-7 grid gap-3 border-y py-6 sm:grid-cols-2" style={{ borderColor: 'rgba(26,26,26,0.12)' }}>
              {specs.map((s) => (
                <div key={s.label}>
                  <dt
                    className="text-[0.7rem] font-semibold uppercase tracking-[0.1em]"
                    style={{ fontFamily: '"JetBrains Mono", monospace', color: 'rgba(26,26,26,0.65)' }}
                  >
                    {s.label}
                  </dt>
                  <dd className="mt-1 font-medium text-ink">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {/* Care */}
          {product.careInstructions && (
            <div
              className="mt-4 rounded-[1px] p-4 text-sm"
              style={{ background: 'var(--cream-deep)', border: '1px solid rgba(203,179,107,0.3)' }}
            >
              <p className="mb-1 font-semibold text-brand-primary">Care Instructions</p>
              <p style={{ color: 'rgba(26,26,26,0.72)' }}>{product.careInstructions}</p>
            </div>
          )}

          {/* Add to cart */}
          <AddToCartSection productId={product.id} variantId={product.variants?.[0]?.id} />

          {/* Shipping note */}
          <p className="mt-4 flex items-center gap-2 text-[0.82rem]" style={{ color: 'rgba(26,26,26,0.65)' }}>
            <svg className="h-4 w-4 shrink-0" style={{ color: 'var(--gold)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="7" width="18" height="13" rx="1"/>
              <path d="M16 3v8M8 3v8"/>
            </svg>
            Free shipping on orders over ₹1500 · 30-day returns
          </p>
        </div>
      </div>
    </div>
  );
}
