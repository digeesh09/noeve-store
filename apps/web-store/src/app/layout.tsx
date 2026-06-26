import type { Metadata } from 'next';
import { CartProvider } from '@/components/cart/cart-provider';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import './globals.css';
import React from 'react';

export const metadata: Metadata = {
  title: 'NOEVE — Considered Fashion, Beauty & Lifestyle',
  description: 'NOEVE — fewer pieces, finer ones. Considered apparel, beauty and lifestyle objects designed to outlast the season.',
};

export default function RootLayout({ children }: { children: any }): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
