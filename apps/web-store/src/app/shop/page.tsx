import Link from 'next/link';
import { getProducts } from '@/lib/api';

export default async function ShopPage() {
  const { data: products } = await getProducts();

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-serif text-3xl font-semibold text-brand-primary">Shop</h1>
      <p className="mt-2 text-neutral-600">Jewellery, pendants, and care accessories</p>

      {products.length === 0 ? (
        <p className="mt-12 text-neutral-500">
          No products yet. Start the API and run{' '}
          <code className="rounded bg-neutral-100 px-1">pnpm db:seed</code>.
        </p>
      ) : (
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const image = product.images?.[0];
            const price = (product.basePriceCents / 100).toLocaleString('en-IN', {
              style: 'currency',
              currency: product.currency,
            });
            return (
              <li key={product.id}>
                <Link href={`/shop/${product.slug}`} className="group block">
                  <div className="aspect-square overflow-hidden rounded-lg bg-brand-accent-light/30">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={image.url}
                        alt={image.alt ?? product.name}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <h2 className="mt-3 font-medium text-brand-primary group-hover:text-brand-accent">
                    {product.name}
                  </h2>
                  <p className="text-sm text-neutral-600">{price}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
