import Link from 'next/link';
import { CartBadge } from '@/components/cart/cart-badge';

const nav = [
  { href: '/shop', label: 'Shop' },
  { href: '/shop?category=jewellery', label: 'Jewellery' },
  { href: '/shop?category=pendants', label: 'Pendants' },
  { href: '/shop?category=care-accessories', label: 'Care' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="font-serif text-2xl font-semibold tracking-tight text-brand-primary">
          Noeve
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-neutral-700 md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-brand-accent">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 text-sm font-medium">
          <Link
            href="/account"
            className="hidden rounded-full px-3 py-1.5 text-neutral-700 hover:bg-neutral-100 sm:inline"
          >
            Account
          </Link>
          <CartBadge />
        </div>
      </div>
    </header>
  );
}
