'use client';

import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from './cart-provider';

interface AddToCartButtonProps {
  productId: string;
  variantId?: string;
  className?: string;
}

export function AddToCartButton({ productId, variantId, className }: AddToCartButtonProps): React.JSX.Element {
  const { addItem } = useCart();
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const handleClick = async () => {
    setStatus('loading');
    try {
      await addItem(productId, variantId);
      setStatus('done');
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const label =
    status === 'loading'
      ? 'Adding…'
      : status === 'done'
        ? 'Added ✓'
        : status === 'error'
          ? 'Try again'
          : 'Add to bag';

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={status === 'loading'}
        className={
          className ??
          'flex-1 rounded-full border-2 border-brand-accent bg-transparent px-8 py-3.5 text-sm font-semibold text-brand-primary transition hover:bg-brand-accent hover:text-brand-primary disabled:opacity-60 sm:flex-none'
        }
      >
        {label}
      </button>
      <button
        type="button"
        onClick={() => router.push('/cart')}
        className="rounded-full border-2 border-brand-accent px-8 py-3.5 text-sm font-medium text-brand-primary transition hover:bg-brand-accent"
      >
        View bag
      </button>
    </div>
  );
}
