import type { Metadata } from 'next';
import { Cinzel, Inter, Montserrat } from 'next/font/google';
import { CartProvider } from '@/components/cart/cart-provider';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import './globals.css';
import React from 'react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' });
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'Noeve — Fine Jewellery & Accessories',
  description: 'Discover fancy jewellery, pendants, and ladies care accessories.',
};

export default function RootLayout({ children }: { children: any }): React.JSX.Element {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable} ${montserrat.variable}`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <CartProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
