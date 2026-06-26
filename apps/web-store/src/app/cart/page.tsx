'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/components/cart/cart-provider';
import { formatPrice } from '@/lib/format';

export default function CartPage(): React.JSX.Element {
  const { cart, loading, updateQuantity, removeItem } = useCart();

  if (loading) return <div className="wrap"><p style={{padding:'5rem 0',textAlign:'center',color:'rgba(33,29,25,.55)'}}>Loading your bag…</p></div>;

  const subtotal = cart.subtotalCents;
  const shipping = subtotal >= 15000 ? 0 : 800;
  const total = subtotal + shipping;

  return (
    <div className="wrap">
      <nav className="breadcrumb">
        <Link href="/">Home</Link><span>/</span>
        <span style={{color:'var(--ink)'}}>Your Bag</span>
      </nav>

      <div className="page-head">
        <p className="eyebrow">{cart.itemCount} {cart.itemCount === 1 ? 'Item' : 'Items'}</p>
        <h1>Your Bag</h1>
      </div>

      <div className="cart-layout">
        <div>
          {cart.lines.length === 0 ? (
            <div className="cart-empty is-visible">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M6 8h12l-1 13H7L6 8z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>
              <h3 style={{fontFamily:'var(--display)',fontSize:'1.6rem'}}>Your bag is empty</h3>
              <p>Pieces you add will show up here.</p>
              <Link href="/#edit" className="btn btn--primary">Continue Shopping</Link>
            </div>
          ) : (
            <div className="cart-items">
              {cart.lines.map((line) => (
                <div className="cart-item" key={line.id}>
                  <div className="cart-item__media" style={{background:'linear-gradient(135deg,#DCD3C2,#B89B6E)'}} />
                  <div>
                    <h3 className="cart-item__name">{line.productName}</h3>
                    <p className="cart-item__meta">{line.sku}</p>
                    <button className="cart-item__remove" onClick={() => removeItem(line.id)}>Remove</button>
                  </div>
                  <div className="qty">
                    <button onClick={() => updateQuantity(line.id, Math.max(1, line.quantity - 1))} aria-label="Decrease">−</button>
                    <span>{line.quantity}</span>
                    <button onClick={() => updateQuantity(line.id, line.quantity + 1)} aria-label="Increase">+</button>
                  </div>
                  <div className="cart-item__price">{formatPrice(line.unitPriceCents * line.quantity, line.currency)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="summary">
          <h3>Order Summary</h3>
          <div className="summary__row"><span>Subtotal</span><span>{formatPrice(subtotal, cart.currency)}</span></div>
          <div className="summary__row"><span>Shipping</span><span>{subtotal === 0 ? '—' : shipping === 0 ? 'Free' : formatPrice(shipping, cart.currency)}</span></div>
          <div className="summary__row summary__row--total"><span>Total</span><span>{formatPrice(total, cart.currency)}</span></div>

          <Link href={cart.lines.length > 0 ? '/checkout' : '/#edit'} className="btn btn--primary">Proceed to Checkout</Link>
          <p className="summary__note">Free shipping automatically applied over $150</p>

          <div className="trust-row">
            <div className="trust-row__item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="10" width="16" height="10" rx="1"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
              Secure Checkout
            </div>
            <div className="trust-row__item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12a9 9 0 1 0 9-9"/><path d="M3 12l4-2v4z"/></svg>
              30-Day Returns
            </div>
            <div className="trust-row__item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="7" width="18" height="13" rx="1"/><path d="M16 3v8M8 3v8"/></svg>
              Free Over $150
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
