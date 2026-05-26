import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatPrice } from '@/lib/format';
import { getProduct } from '@/lib/api';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
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
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <nav className="text-sm text-neutral-500">
        <Link href="/" className="hover:text-brand-accent">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-brand-accent">
          Shop
        </Link>
        {product.category ? (
          <>
            <span className="mx-2">/</span>
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="hover:text-brand-accent"
            >
              {product.category.name}
            </Link>
          </>
        ) : null}
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-brand-accent-light/30">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt ?? product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : null}
        </div>

        <div className="flex flex-col">
          {product.category ? (
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-accent">
              {product.category.name}
            </p>
          ) : null}
          <h1 className="mt-2 font-serif text-3xl font-semibold text-brand-primary md:text-4xl">
            {product.name}
          </h1>
          <p className="mt-4 text-2xl font-semibold text-neutral-800">
            {formatPrice(product.basePriceCents, product.currency)}
          </p>

          {product.description ? (
            <p className="mt-6 leading-relaxed text-neutral-600">{product.description}</p>
          ) : null}

          {specs.length > 0 ? (
            <dl className="mt-8 grid gap-3 border-y border-neutral-200 py-6 sm:grid-cols-2">
              {specs.map((s) => (
                <div key={s.label}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    {s.label}
                  </dt>
                  <dd className="mt-0.5 font-medium text-brand-primary">{s.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {product.careInstructions ? (
            <div className="mt-4 rounded-lg bg-brand-accent-light/30 p-4 text-sm text-neutral-700">
              <p className="font-semibold text-brand-primary">Care</p>
              <p className="mt-1">{product.careInstructions}</p>
            </div>
          ) : null}

          <div className="mt-auto flex flex-wrap gap-3 pt-8">
            <button
              type="button"
              className="flex-1 rounded-full bg-brand-primary px-8 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 sm:flex-none"
            >
              Add to bag
            </button>
            <Link
              href="/cart"
              className="rounded-full border border-neutral-300 px-8 py-3.5 text-center text-sm font-medium transition hover:border-brand-primary"
            >
              View bag
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
