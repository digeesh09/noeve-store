import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const shopLinks = [
  { href: '/shop', label: 'All Jewellery' },
  { href: '/shop?category=pendants', label: 'Pendants' },
  { href: '/shop?category=jewellery', label: 'Fine Jewellery' },
  { href: '/shop?category=care-accessories', label: 'Care Accessories' },
];

const supportLinks = [
  { href: '/account', label: 'Order Status' },
  { href: '#', label: 'Shipping & Returns' },
  { href: '#', label: 'Care Guide' },
  { href: '#', label: 'Contact Us' },
];

const studioLinks = [
  { href: '#', label: 'About Noeve' },
  { href: '#', label: 'Journal' },
  { href: '#', label: 'Sustainability' },
  { href: '#', label: 'Careers' },
];

export function SiteFooter(): React.JSX.Element {
  return (
    <footer style={{ background: 'var(--ink)', color: 'var(--cream)', padding: '5rem 0 2rem' }}>
      <div className="mx-auto max-w-container px-[var(--edge)]">
        {/* Top grid */}
        <div className="grid gap-10 pb-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]" style={{ borderBottom: '1px solid rgba(253,251,244,0.15)' }}>

          {/* Brand */}
          <div>
            <Image src="/noeve-logo.png" alt="NOEVE" width={110} height={40} className="object-contain brightness-0 invert mb-4" />
            <p className="mt-2 max-w-[26ch] text-sm leading-relaxed" style={{ color: 'rgba(253,251,244,0.65)' }}>
              Effortless elegance in every piece — fine jewellery and accessories crafted to outlast the season.
            </p>
            <div className="mt-5 flex gap-3">
              {/* Instagram */}
              <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 hover:border-brand-accent" style={{ border: '1px solid rgba(253,251,244,0.3)' }}>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.2" cy="6.8" r="1"/>
                </svg>
              </a>
              {/* Pinterest */}
              <a href="#" aria-label="Pinterest" className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300" style={{ border: '1px solid rgba(253,251,244,0.3)' }}>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="9"/>
                  <path d="M9.5 17l1.6-7.3M12 9.5c2 0 3.3 1.1 3 2.8-.3 1.7-1.6 2.4-2.7 2.2-1-.2-1.3-.9-1-1.9"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-5 text-[0.72rem] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--gold)' }}>Shop</h4>
            <ul className="flex flex-col gap-3">
              {shopLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[0.92rem] transition-colors duration-200" style={{ color: 'rgba(253,251,244,0.78)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-5 text-[0.72rem] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--gold)' }}>Support</h4>
            <ul className="flex flex-col gap-3">
              {supportLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[0.92rem] transition-colors duration-200" style={{ color: 'rgba(253,251,244,0.78)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Studio */}
          <div>
            <h4 className="mb-5 text-[0.72rem] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--gold)' }}>Studio</h4>
            <ul className="flex flex-col gap-3">
              {studioLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[0.92rem] transition-colors duration-200" style={{ color: 'rgba(253,251,244,0.78)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-7">
          <p className="text-[0.78rem]" style={{ color: 'rgba(253,251,244,0.55)' }}>
            © {new Date().getFullYear()} NOEVE. All rights reserved. — www.noeve.store
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-[0.78rem] transition-colors" style={{ color: 'rgba(253,251,244,0.55)' }}>Privacy</a>
            <a href="#" className="text-[0.78rem] transition-colors" style={{ color: 'rgba(253,251,244,0.55)' }}>Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
