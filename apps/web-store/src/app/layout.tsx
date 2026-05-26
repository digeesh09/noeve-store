import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-cormorant',
});

export const metadata: Metadata = {
  title: 'Noeve — Fine Jewellery & Accessories',
  description: 'Discover fancy jewellery, pendants, and ladies care accessories.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <header className="border-b border-neutral-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="font-serif text-2xl font-semibold text-brand-primary">
              Noeve
            </Link>
            <nav className="flex gap-6 text-sm">
              <Link href="/shop" className="hover:text-brand-accent">
                Shop
              </Link>
              <Link href="/cart" className="hover:text-brand-accent">
                Cart
              </Link>
              <Link href="/account" className="hover:text-brand-accent">
                Account
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-16 border-t border-neutral-200 py-8 text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} Noeve. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
