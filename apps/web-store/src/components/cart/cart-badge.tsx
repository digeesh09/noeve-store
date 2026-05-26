'use client';

import Link from 'next/link';
import { useCart } from './cart-provider';

export function CartBadge() {
  const { cart } = useCart();
  const count = cart.itemCount;

  return (
    <Link
      href="/cart"
      className="relative rounded-full bg-brand-primary px-4 py-2 text-white transition hover:opacity-90"
    >
      Bag
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-accent px-1 text-[10px] font-bold text-brand-primary">
          {count > 99 ? '99+' : count}
        </span>
      ) : null}
    </Link>
  );
}
