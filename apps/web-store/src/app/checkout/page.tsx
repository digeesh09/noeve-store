'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/cart/cart-provider';
import { isLoggedIn } from '@/lib/auth';
import { formatPrice } from '@/lib/format';
import { placeOrder, validatePromotion } from '@/lib/orders';
import { apiClient } from '@/lib/api';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage(): React.JSX.Element {
  const router = useRouter();
  const { cart, loading, refresh } = useCart();
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountCents: number } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [validatingPromo, setValidatingPromo] = useState(false);

  // Mock payment modal states
  const [showMockModal, setShowMockModal] = useState(false);
  const [paymentSession, setPaymentSession] = useState<any>(null);
  const [currentOrder, setCurrentOrder] = useState<any>(null);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/account?redirect=/checkout');
    }
  }, [router]);

  const taxRate = 0.18;
  const taxCents = cart ? Math.round(cart.subtotalCents * taxRate) : 0;
  const shippingCents = cart && cart.subtotalCents < 1500000 ? 100000 : 0;
  const discountCents = appliedPromo ? appliedPromo.discountCents : 0;
  const totalCents = cart ? Math.max(0, cart.subtotalCents + taxCents + shippingCents - discountCents) : 0;

  const handleApplyPromo = async () => {
    if (!promoCode || !cart) return;
    setValidatingPromo(true);
    setPromoError(null);
    try {
      const data = await validatePromotion(promoCode, cart.subtotalCents);
      setAppliedPromo(data);
    } catch (err: any) {
      setPromoError(err.message || 'Invalid promotion code');
      setAppliedPromo(null);
    } finally {
      setValidatingPromo(false);
    }
  };

  const handlePlaceOrder = async () => {
    setError(null);
    setSubmitting(true);
    try {
      // 1. Create order (returns Order in PENDING_PAYMENT status)
      const order = await placeOrder(
        note || undefined,
        appliedPromo?.code,
        appliedPromo?.discountCents
      );
      setCurrentOrder(order);

      // 2. Create Payment Session on API
      const sessionRes = await apiClient.store.createPaymentSession({ orderId: order.id });
      const session = sessionRes.data;
      setPaymentSession(session);

      if (session.isMock) {
        // Show mock simulation modal
        setShowMockModal(true);
      } else {
        // Load Razorpay and process payment
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error('Failed to load Razorpay checkout script. Please check your internet connection.');
        }

        const options = {
          key: session.keyId,
          amount: session.amount,
          currency: session.currency,
          name: 'Noeve',
          description: `Order ${order.orderNumber}`,
          order_id: session.providerOrderId,
          handler: async function (response: any) {
            try {
              setSubmitting(true);
              await apiClient.store.verifyPayment({
                orderId: order.id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              await refresh();
              setSuccess(order.orderNumber);
            } catch (err: any) {
              setError(err?.message || 'Payment signature verification failed');
            } finally {
              setSubmitting(false);
            }
          },
          prefill: {
            name: '',
            email: '',
          },
          theme: {
            color: '#6B2230', // Oxblood primary
          },
          modal: {
            ondismiss: function () {
              setSubmitting(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not place order');
      setSubmitting(false);
    }
  };

  const handleSimulatePaymentSuccess = async () => {
    if (!currentOrder || !paymentSession) return;
    setError(null);
    setSubmitting(true);
    setShowMockModal(false);

    try {
      await apiClient.store.verifyPayment({
        orderId: currentOrder.id,
        razorpayOrderId: paymentSession.providerOrderId,
        razorpayPaymentId: `pay_mock_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        razorpaySignature: 'mock_signature_verified',
      });
      await refresh();
      setSuccess(currentOrder.orderNumber);
    } catch (err: any) {
      setError(err?.message || 'Verification of mock payment failed');
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
            Thank you for your purchase. Your order <strong>{success}</strong> has been placed and payment has been processed successfully.
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
          Verify your items and proceed with secure payment.
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

          <div className="summary__row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem', marginBottom: '.5rem', color: 'rgba(33,29,25,.8)' }}>
            <span>Subtotal</span>
            <span>{formatPrice(cart.subtotalCents, cart.currency)}</span>
          </div>
          <div className="summary__row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem', marginBottom: '.5rem', color: 'rgba(33,29,25,.8)' }}>
            <span>Shipping</span>
            <span>{shippingCents === 0 ? 'Free' : formatPrice(shippingCents, cart.currency)}</span>
          </div>
          <div className="summary__row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem', marginBottom: '1rem', color: 'rgba(33,29,25,.8)', borderBottom: '1px solid rgba(33,29,25,.1)', paddingBottom: '1rem' }}>
            <span>Estimated Tax (18% GST)</span>
            <span>{formatPrice(taxCents, cart.currency)}</span>
          </div>

          {appliedPromo && (
            <div className="summary__row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem', marginBottom: '1rem', color: 'var(--brand-primary)' }}>
              <span>Discount ({appliedPromo.code})</span>
              <span>-{formatPrice(appliedPromo.discountCents, cart.currency)}</span>
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                placeholder="Promo Code" 
                value={promoCode}
                onChange={e => setPromoCode(e.target.value.toUpperCase())}
                disabled={!!appliedPromo}
                style={{ flex: 1, padding: '0.6rem 0.8rem', border: '1px solid rgba(33,29,25,.2)', borderRadius: '1px', outline: 'none' }}
              />
              {!appliedPromo ? (
                <button type="button" onClick={handleApplyPromo} disabled={validatingPromo || !promoCode} style={{ padding: '0 1rem', background: 'var(--ink)', color: 'white', borderRadius: '1px' }}>
                  {validatingPromo ? '...' : 'Apply'}
                </button>
              ) : (
                <button type="button" onClick={() => { setAppliedPromo(null); setPromoCode(''); }} style={{ padding: '0 1rem', background: 'var(--oxblood)', color: 'white', borderRadius: '1px' }}>
                  Remove
                </button>
              )}
            </div>
            {promoError && <p style={{ fontSize: '.75rem', color: 'var(--oxblood)', marginTop: '0.4rem' }}>{promoError}</p>}
          </div>

          <div className="summary__row summary__row--total" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '1rem', marginBottom: '1.5rem' }}>
            <span>Total</span>
            <span>{formatPrice(totalCents, cart.currency)}</span>
          </div>

          {error && <p style={{ fontSize: '.76rem', color: 'var(--oxblood)', marginBottom: '1rem' }}>{error}</p>}

          <button
            type="button"
            disabled={submitting}
            onClick={handlePlaceOrder}
            className="btn btn--primary"
            style={{ width: '100%' }}
          >
            {submitting ? 'Processing…' : 'Place Order & Pay'}
          </button>

          <Link href="/cart" style={{ display: 'block', textAlign: 'center', marginTop: '1.2rem', fontSize: '.8rem', textDecoration: 'underline' }}>
            ← Back to bag
          </Link>
        </aside>
      </div>

      {/* Mock Sandbox Payment Modal */}
      {showMockModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(33, 29, 25, 0.5)',
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: 'var(--cream)',
            border: '1px solid rgba(33, 29, 25, 0.15)',
            borderRadius: '2px',
            padding: '2.5rem',
            maxWidth: '480px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 12px 36px rgba(33, 29, 25, 0.15)',
          }}>
            <span style={{ fontSize: '2.5rem', color: 'var(--oxblood)', display: 'block', marginBottom: '1rem' }}>💳</span>
            <h3 style={{ fontFamily: 'var(--display)', fontSize: '1.8rem', color: 'var(--oxblood)', marginBottom: '0.8rem' }}>Noeve Sandbox Payment</h3>
            <p style={{ fontSize: '0.92rem', color: 'rgba(33,29,25,0.7)', lineHeight: 1.5, marginBottom: '2rem' }}>
              You are running in development mode without active Razorpay keys. Click below to simulate a successful transaction for order <strong>{currentOrder?.orderNumber}</strong>.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <button
                type="button"
                onClick={handleSimulatePaymentSuccess}
                className="btn btn--primary"
                style={{ width: '100%' }}
              >
                Simulate Successful Payment
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMockModal(false);
                  setSubmitting(false);
                }}
                className="btn btn--outline"
                style={{ width: '100%' }}
              >
                Cancel Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
