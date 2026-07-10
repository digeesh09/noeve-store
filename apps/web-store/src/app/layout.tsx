import type { Metadata } from 'next';
import { CartProvider } from '@/components/cart/cart-provider';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import './globals.css';
import React from 'react';

export const metadata: Metadata = {
  title: 'NOEVE — Considered Fashion, Beauty & Lifestyle',
  description: 'NOEVE — fewer pieces, finer ones. Considered apparel, beauty and lifestyle objects designed to outlast the season.',
  keywords: 'luxury, fashion, beauty, lifestyle, apparel, jewelry, noeve, noeve store',
  openGraph: {
    title: 'NOEVE — Considered Fashion, Beauty & Lifestyle',
    description: 'NOEVE — fewer pieces, finer ones. Considered apparel, beauty and lifestyle objects designed to outlast the season.',
    url: 'https://noeve.store',
    siteName: 'NOEVE',
    images: [
      {
        url: 'https://noeve.store/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'NOEVE Store',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NOEVE — Considered Fashion, Beauty & Lifestyle',
    description: 'NOEVE — fewer pieces, finer ones. Considered apparel, beauty and lifestyle objects designed to outlast the season.',
    images: ['https://noeve.store/images/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import NextTopLoader from 'nextjs-toploader';

export default function RootLayout({ children }: { children: any }): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <NextTopLoader color="var(--ink)" showSpinner={false} height={2} />
        <CartProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
