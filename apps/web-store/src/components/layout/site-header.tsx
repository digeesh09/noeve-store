import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CartBadge } from '@/components/cart/cart-badge';

const nav = [
  { href: '/shop', label: 'Shop All' },
  { href: '/shop?category=jewellery', label: 'Jewellery' },
  { href: '/shop?category=pendants', label: 'Pendants' },
  { href: '/shop?category=care-accessories', label: 'Care' },
];

export function SiteHeader(): React.JSX.Element {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-accent/20 bg-neutral-50/95 text-neutral-900 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-3 group">
          <Image src="/Logo.png" alt="Noeve" width={48} height={48} className="object-contain" />
          <span className="font-cinzel text-3xl font-semibold tracking-wide text-brand-primary transition-colors duration-300 group-hover:text-brand-primaryDark">
            Noeve
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium tracking-wider md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="relative py-1 transition-colors hover:text-brand-accent group">
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-accent transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link
            href="/account"
            className="hidden rounded-full border border-brand-accent px-4 py-2 text-neutral-900 transition-all duration-300 hover:bg-brand-accent/10 hover:text-brand-primary sm:inline"
          >
            Account
          </Link>
          <CartBadge />
        </div>
      </div>
    </header>
  );
}

