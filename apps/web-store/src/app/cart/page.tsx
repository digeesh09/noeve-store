import React from 'react';
import { CartView } from '@/components/cart/cart-view';

export default function CartPage(): React.JSX.Element {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <h1 className="font-serif text-3xl font-semibold text-brand-primary">Your bag</h1>
      <p className="mt-2 text-neutral-600">Review items before checkout.</p>
      <CartView />
    </div>
  );
}
