'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from './cart-provider';

export function CartBadge(): React.JSX.Element {
  const { cart } = useCart();
  const count = cart.itemCount;

  return (
    <Link
      href="/cart"
      className="group relative flex items-center gap-2 rounded-full border border-brand-accent/40 bg-brand-accent px-4 py-2 text-xs font-semibold uppercase tracking-wider text-brand-primary transition-all duration-300 hover:bg-transparent hover:text-brand-accent hover:border-brand-accent"
    >
      <span>Bag 🛍️</span>
      {count > 0 ? (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-primary px-1 text-[10px] font-bold text-white transition-colors duration-300 group-hover:bg-brand-accent group-hover:text-brand-primary">
          {count > 99 ? '99+' : count}
        </span>
      ) : null}
    </Link>
  );
}

