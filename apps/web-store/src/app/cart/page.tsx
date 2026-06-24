import React from 'react';
import { CartView } from '@/components/cart/cart-view';

export default function CartPage(): React.JSX.Element {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(1.5rem,5vw,4.5rem)' }}>
      {/* Breadcrumb */}
      <nav style={{ display: 'flex', gap: '0.5em', alignItems: 'center', padding: '1.6rem 0 0', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.7rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)' }}>
        <a href="/" style={{ color: 'inherit' }}>Home</a>
        <span style={{ opacity: 0.5 }}>/</span>
        <span style={{ color: '#1a1a1a' }}>Your Bag</span>
      </nav>
      <div style={{ padding: '1rem 0 2.5rem' }}>
        <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(2.2rem,4.5vw,3.1rem)', color: '#5a0014', marginTop: '0.5rem' }}>
          Your Bag
        </h1>
      </div>
      <CartView />
    </div>
  );
}
