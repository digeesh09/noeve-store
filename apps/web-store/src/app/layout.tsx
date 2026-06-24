import type { Metadata } from 'next';
import { CartProvider } from '@/components/cart/cart-provider';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import './globals.css';
import React from 'react';

export const metadata: Metadata = {
  title: 'NOEVE — Fine Jewellery & Accessories',
  description: 'Effortless elegance in every piece. Discover fine jewellery, pendants, and ladies care accessories.',
};

export default function RootLayout({ children }: { children: any }): React.JSX.Element {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <CartProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
