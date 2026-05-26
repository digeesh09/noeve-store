import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/api';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const price = (product.basePriceCents / 100).toLocaleString('en-IN', {
    style: 'currency',
    currency: product.currency,
  });
  const image = product.images?.[0];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <Link href="/shop" className="text-sm text-brand-accent hover:underline">
        ← Back to shop
      </Link>
      <div className="mt-8 grid gap-12 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-lg bg-brand-accent-light/30">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image.url} alt={image.alt ?? product.name} className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div>
          <h1 className="font-serif text-3xl font-semibold text-brand-primary">{product.name}</h1>
          <p className="mt-4 text-2xl">{price}</p>
          {product.description ? (
            <p className="mt-6 text-neutral-600">{product.description}</p>
          ) : null}
          <dl className="mt-8 space-y-2 text-sm">
            {product.material ? (
              <div className="flex gap-2">
                <dt className="font-medium">Material</dt>
                <dd>{product.material}</dd>
              </div>
            ) : null}
            {product.purity ? (
              <div className="flex gap-2">
                <dt className="font-medium">Purity</dt>
                <dd>{product.purity}</dd>
              </div>
            ) : null}
            {product.weightGrams ? (
              <div className="flex gap-2">
                <dt className="font-medium">Weight</dt>
                <dd>{product.weightGrams} g</dd>
              </div>
            ) : null}
          </dl>
          <button
            type="button"
            className="mt-10 rounded-full bg-brand-primary px-8 py-3 text-sm font-medium text-white"
          >
            Add to cart
          </button>
        </div>
      </div>
    </section>
  );
}
