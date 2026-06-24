import type { Metadata } from 'next';
import { Cinzel, Montserrat } from 'next/font/google';
import { CartProvider } from '@/components/cart/cart-provider';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import './globals.css';
import React from 'react';

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NOEVE — Fine Jewellery & Accessories',
  description: 'Effortless elegance in every piece. Discover fine jewellery, pendants, and ladies care accessories.',
};

export default function RootLayout({ children }: { children: any }): React.JSX.Element {
  return (
    <html lang="en" className={`${cinzel.variable} ${montserrat.variable}`}>
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
