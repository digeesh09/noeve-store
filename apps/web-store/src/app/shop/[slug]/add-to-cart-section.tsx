'use client';

import React from 'react';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';

interface AddToCartSectionProps {
  productId: string;
  variantId?: string;
}

export function AddToCartSection({ productId, variantId }: AddToCartSectionProps): React.JSX.Element {
  return (
    <div className="mt-auto pt-8">
      <AddToCartButton productId={productId} variantId={variantId} />
    </div>
  );
}
