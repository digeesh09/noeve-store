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
        className="flex w-full items-center justify-center rounded-md border-2 border-brand-accent bg-transparent px-8 py-3.5 text-sm font-semibold text-brand-primary transition-all duration-300 hover:bg-brand-accent/10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        ADD TO WISHLIST
      </button>
    </div>
  );
}
