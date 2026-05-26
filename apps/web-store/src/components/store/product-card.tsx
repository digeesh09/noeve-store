import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/format';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority }: ProductCardProps) {
  const image = product.images?.[0];
  const categoryLabel = product.category?.name;

  return (
    <article className="group">
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-brand-accent-light/40">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt ?? product.name}
              fill
              priority={priority}
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-neutral-500">No image</div>
          )}
          {categoryLabel ? (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-brand-primary backdrop-blur">
              {categoryLabel}
            </span>
          ) : null}
        </div>
        <div className="mt-3 space-y-1">
          <h3 className="font-medium text-brand-primary transition group-hover:text-brand-accent">
            {product.name}
          </h3>
          {product.material ? (
            <p className="text-xs text-neutral-500">
              {product.material}
              {product.purity ? ` · ${product.purity}` : ''}
            </p>
          ) : null}
          <p className="text-sm font-semibold text-neutral-800">
            {formatPrice(product.basePriceCents, product.currency)}
          </p>
        </div>
      </Link>
    </article>
  );
}
