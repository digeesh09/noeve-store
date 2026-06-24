import React from 'react';
import Link from 'next/link';

const links = [
  { href: '/shop', label: 'Shop all' },
  { href: '/shop?category=pendants', label: 'Pendants' },
  { href: '/account', label: 'Account' },
  { href: '/cart', label: 'Bag' },
];

export function SiteFooter(): React.JSX.Element {
  return (
    <footer className="mt-auto border-t border-brand-accent/30 bg-neutral-50 text-neutral-700">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          <p className="font-cinzel text-2xl font-semibold text-brand-primary">Noeve</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed">
            Fine jewellery, pendants, and ladies care accessories — crafted with timeless elegance.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-accent">Explore</p>
          <ul className="mt-4 space-y-2 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-brand-primary transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-accent">Care</p>
          <p className="mt-4 text-sm leading-relaxed">
            Store pieces in a dry pouch. Avoid direct contact with perfumes and moisture on metal surfaces.
          </p>
        </div>
      </div>
      <div className="border-t border-brand-accent/20 py-6 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} Noeve. All rights reserved.
      </div>
    </footer>
  );
}
