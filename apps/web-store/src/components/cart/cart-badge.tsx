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
      aria-label="Your bag"
      className="relative inline-flex h-5 w-5 items-center justify-center text-ink transition-colors hover:opacity-80"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 8h12l-1 13H7L6 8z"/>
        <path d="M9 8a3 3 0 0 1 6 0"/>
      </svg>
      {count > 0 && (
        <span
          className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full text-[0.6rem] font-semibold leading-none"
          style={{ background: 'var(--oxblood)', color: 'var(--cream)' }}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
