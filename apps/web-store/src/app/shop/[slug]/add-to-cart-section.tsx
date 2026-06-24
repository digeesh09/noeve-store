'use client';

import React from 'react';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';

interface AddToCartSectionProps {
  productId: string;
  variantId?: string;
}

export function AddToCartSection({ productId, variantId }: AddToCartSectionProps): React.JSX.Element {
  return (
    <div className="mt-auto pt-8 flex flex-col gap-3">
      <AddToCartButton productId={productId} variantId={variantId} />
      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 px-8 py-4 text-[0.85rem] font-semibold uppercase tracking-[0.05em] transition-all duration-300 hover:-translate-y-0.5"
        style={{
          border: '1px solid var(--gold)',
          color: 'var(--burgundy)',
          background: 'transparent',
          borderRadius: '1px',
        }}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        Add to Wishlist
      </button>
    </div>
  );
}
