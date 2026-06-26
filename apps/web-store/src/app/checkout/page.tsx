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
    return (
      <div className="wrap" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <p style={{ color: 'rgba(33,29,25,0.5)' }}>Redirecting to sign in…</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="wrap" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div className="auth__success is-visible">
          <div className="auth__success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2>Order confirmed</h2>
          <p>
            Thank you for your purchase. Your order <strong>{success}</strong> has been placed.
          </p>
          <div className="auth__success-actions">
            <Link href="/account" className="btn btn--primary">
              View orders
            </Link>
            <Link href="/shop" className="btn btn--outline">
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="wrap" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <p style={{ color: 'rgba(33,29,25,0.5)' }}>Loading checkout…</p>
      </div>
    );
  }

  if (cart.lines.length === 0) {
    return (
      <div className="wrap" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div className="auth__success is-visible">
          <h2>Your bag is empty</h2>
          <p>Add items before checking out.</p>
          <div className="auth__success-actions">
            <Link href="/shop" className="btn btn--primary">
              Browse collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/cart">Your Bag</Link>
        <span>/</span>
        <span style={{ color: 'var(--ink)' }}>Checkout</span>
      </nav>

      {/* Page Head */}
      <div className="page-head">
        <p className="eyebrow">Secure Checkout</p>
        <h1>Complete your order</h1>
        <p className="sub">
          Payment integration coming soon — orders are confirmed immediately for demo purposes.
        </p>
      </div>

      <div className="cart-layout">
        <div>
          {/* Order Details form fields */}
          <div className="section-card" style={{ background: 'var(--cream)', border: '1px solid rgba(33,29,25,.1)', borderRadius: '2px', padding: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.6rem', marginBottom: '1rem' }}>Shipping Details</h2>
            <p style={{ fontSize: '.88rem', color: 'rgba(33,29,25,.65)', marginBottom: '1.5rem' }}>
              Your order will be shipped to the default address linked to your account.
            </p>
            <div className="form-field">
              <label htmlFor="note">Order note (optional)</label>
              <textarea
                id="note"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Gift message, delivery instructions…"
                style={{
                  width: '100%',
                  border: '1px solid rgba(33,29,25,.25)',
                  background: 'transparent',
                  padding: '.85em 1em',
                  fontSize: '.95rem',
                  color: 'var(--ink)',
                  outline: 'none',
                  borderRadius: '1px',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <aside className="summary">
          <h3>Order summary</h3>
          <div className="summary__items" style={{ marginBottom: '1.5rem' }}>
            {cart.lines.map((line) => (
              <div
                key={line.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '.85rem',
                  padding: '.6rem 0',
                  borderBottom: '1px solid rgba(33,29,25,.1)',
                }}
              >
                <span style={{ color: 'rgba(33,29,25,.8)' }}>
                  {line.productName} <span style={{ fontFamily: 'var(--mono)', fontSize: '.76rem' }}>× {line.quantity}</span>
                </span>
                <span style={{ fontFamily: 'var(--mono)', fontWeight: 500 }}>
                  {formatPrice(line.lineTotalCents, line.currency)}
                </span>
              </div>
            ))}
          </div>

          <div className="summary__row summary__row--total">
            <span>Total</span>
            <span>{formatPrice(cart.subtotalCents, cart.currency)}</span>
          </div>

          {error && <p style={{ fontSize: '.76rem', color: 'var(--oxblood)', marginBottom: '1rem' }}>{error}</p>}

          <button
            type="button"
            disabled={submitting}
            onClick={handlePlaceOrder}
            className="btn btn--primary"
            style={{ width: '100%' }}
          >
            {submitting ? 'Placing order…' : 'Place order'}
          </button>

          <Link href="/cart" style={{ display: 'block', textAlign: 'center', marginTop: '1.2rem', fontSize: '.8rem', textDecoration: 'underline' }}>
            ← Back to bag
          </Link>
        </aside>
      </div>
    </div>
  );
}
