'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/cart/cart-provider';
import { isLoggedIn } from '@/lib/auth';
import { formatPrice } from '@/lib/format';
import { placeOrder } from '@/lib/orders';

export default function CheckoutPage(): React.JSX.Element {
  const router = useRouter();
  const { cart, loading, refresh } = useCart();
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/account?redirect=/checkout');
    }
  }, [router]);

  const handlePlaceOrder = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const order = await placeOrder(note || undefined);
      await refresh();
      setSuccess(order.orderNumber);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoggedIn()) {
    return <p className="py-12 text-center text-neutral-500">Redirecting to sign in…</p>;
  }

  if (success) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-accent-light text-2xl text-brand-accent">
          ✓
        </div>
        <h1 className="mt-6 font-serif text-2xl font-semibold text-brand-primary">Order confirmed</h1>
        <p className="mt-2 text-neutral-600">
          Thank you for your purchase. Your order <strong>{success}</strong> has been placed.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/account"
            className="rounded-full border-2 border-brand-accent bg-transparent px-8 py-3 text-sm font-semibold text-brand-primary hover:bg-brand-accent/10"
          >
            View orders
          </Link>
          <Link
            href="/shop"
            className="rounded-full border-2 border-brand-accent px-8 py-3 text-sm font-semibold text-brand-primary hover:bg-brand-accent/10"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <p className="py-12 text-center text-neutral-500">Loading checkout…</p>;
  }

  if (cart.lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="font-serif text-2xl font-semibold text-brand-primary">Your bag is empty</h1>
        <p className="mt-2 text-neutral-600">Add items before checking out.</p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full border-2 border-brand-accent bg-transparent px-8 py-3 text-sm font-semibold text-brand-primary hover:bg-brand-accent/10"
        >
          Browse collection
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-accent">Checkout</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-brand-primary">Complete your order</h1>
      <p className="mt-2 text-neutral-600">
        Payment integration coming soon — orders are confirmed immediately for demo purposes.
      </p>

      <div className="mt-8 space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-lg font-semibold text-brand-primary">Order summary</h2>
        <ul className="divide-y divide-neutral-100">
          {cart.lines.map((line) => (
            <li key={line.id} className="flex justify-between py-3 text-sm">
              <span>
                {line.productName} × {line.quantity}
              </span>
              <span className="font-medium">{formatPrice(line.lineTotalCents, line.currency)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-neutral-200 pt-4 font-semibold">
          <span>Total</span>
          <span className="text-brand-accent">{formatPrice(cart.subtotalCents, cart.currency)}</span>
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="note" className="block text-sm font-medium text-neutral-700">
          Order note (optional)
        </label>
        <textarea
          id="note"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Gift message, delivery instructions…"
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none ring-brand-accent focus:ring-2"
        />
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      <button
        type="button"
        disabled={submitting}
        onClick={handlePlaceOrder}
        className="mt-6 w-full rounded-full bg-brand-accent py-3.5 text-sm font-bold text-brand-primary hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? 'Placing order…' : 'Place order'}
      </button>

      <Link href="/cart" className="mt-4 block text-center text-sm text-neutral-500 hover:text-brand-primary">
        ← Back to bag
      </Link>
    </div>
  );
}
