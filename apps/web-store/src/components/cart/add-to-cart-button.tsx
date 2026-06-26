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
          : 'Add to Bag';

  const isPrimary = !className;

  return (
    <div className="flex flex-wrap gap-3">
      <button
        id="add-to-bag-btn"
        type="button"
        onClick={handleClick}
        disabled={status === 'loading'}
        className={className ?? 'flex-1 sm:flex-none'}
        style={isPrimary ? {
          background: 'var(--oxblood)',
          color: 'var(--cream)',
          border: 'none',
          padding: '0.95em 1.9em',
          fontSize: '0.85rem',
          fontWeight: 500,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          borderRadius: '1px',
          transition: 'background 0.3s ease, transform 0.3s ease',
          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
          opacity: status === 'loading' ? 0.7 : 1,
        } : undefined}
      >
        {label}
      </button>
      <button
        id="view-bag-btn"
        type="button"
        onClick={() => router.push('/cart')}
        style={{
          padding: '0.95em 1.9em',
          fontSize: '0.85rem',
          fontWeight: 500,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          borderRadius: '1px',
          border: '1px solid var(--ink)',
          color: 'var(--ink)',
          background: 'transparent',
          transition: 'background 0.3s ease, color 0.3s ease',
        }}
      >
        View Bag
      </button>
    </div>
  );
}
