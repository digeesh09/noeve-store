'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CartBadge } from '@/components/cart/cart-badge';

const nav = [
  { href: '/shop', label: 'New' },
  { href: '/shop?category=jewellery', label: 'Jewellery' },
  { href: '/shop?category=pendants', label: 'Pendants' },
  { href: '/shop?category=care-accessories', label: 'Care' },
];

export function SiteHeader(): React.JSX.Element {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Announcement marquee */}
      <div className="overflow-hidden whitespace-nowrap bg-ink" style={{ borderBottom: '1px solid var(--gold)' }}>
        <div
          className="inline-flex py-2"
          style={{ animation: 'scroll-marquee 28s linear infinite' }}
        >
          {[
            'FREE SHIPPING ON ORDERS OVER ₹1500',
            '○',
            'NEW COLLECTION NOW LIVE',
            '○',
            'EARLY ACCESS FOR LIST MEMBERS',
            '○',
            'FREE SHIPPING ON ORDERS OVER ₹1500',
            '○',
            'NEW COLLECTION NOW LIVE',
            '○',
            'EARLY ACCESS FOR LIST MEMBERS',
            '○',
          ].map((item, i) => (
            <span
              key={i}
              className="px-6 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-cream-DEFAULT"
              style={{ fontFamily: 'var(--font-cinzel, Cinzel, serif)', color: '#fdfbf4', letterSpacing: '0.16em' }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Header */}
      <header
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: 'rgba(253,251,244,0.93)',
          backdropFilter: 'blur(6px)',
          borderBottom: '1px solid rgba(26,26,26,0.1)',
          boxShadow: scrolled ? '0 6px 18px rgba(26,26,26,0.07)' : 'none',
        }}
      >
        <div className="mx-auto flex max-w-container items-center justify-between px-[var(--edge)] py-4">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <Image src="/noeve-logo.png" alt="NOEVE" width={120} height={44} className="object-contain" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-9 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative pb-1 text-[0.78rem] font-medium uppercase tracking-[0.08em] text-ink transition-colors hover:text-brand-primary"
                style={{ fontFamily: 'inherit' }}
              >
                {item.label}
                <span
                  className="absolute bottom-0 left-0 h-px w-0 transition-all duration-300 group-hover:w-full"
                  style={{ background: 'var(--burgundy)' }}
                />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Account icon */}
            <Link href="/account" aria-label="Account" className="relative hidden h-5 w-5 text-ink transition-colors hover:text-brand-primary sm:inline-flex">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="3.5"/>
                <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6"/>
              </svg>
            </Link>

            {/* Cart badge */}
            <CartBadge />

            {/* Burger */}
            <button
              className="flex flex-col gap-1.5 md:hidden"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <span className="h-px w-6 bg-ink" />
              <span className="h-px w-6 bg-ink" />
              <span className="h-px w-6 bg-ink" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      <div
        className={`fixed inset-0 z-[300] flex flex-col transition-transform duration-500 ${mobileOpen ? 'translate-y-0' : '-translate-y-full'}`}
        style={{ background: 'var(--cream)', padding: '1.5rem var(--edge) 2rem' }}
      >
        <div className="mb-12 flex items-center justify-between">
          <Image src="/noeve-logo.png" alt="NOEVE" width={100} height={36} className="object-contain" />
          <button
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="flex flex-col gap-1.5"
          >
            <span className="h-px w-6 bg-ink" style={{ transform: 'rotate(45deg) translate(1px,1px)' }} />
            <span className="h-px w-6 bg-ink opacity-0" />
            <span className="h-px w-6 bg-ink" style={{ transform: 'rotate(-45deg) translate(1px,-1px)' }} />
          </button>
        </div>
        <div className="flex flex-col gap-6">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="font-cinzel text-3xl text-brand-primary"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/cart" onClick={() => setMobileOpen(false)} className="font-cinzel text-3xl text-brand-primary">Bag</Link>
          <Link href="/account" onClick={() => setMobileOpen(false)} className="font-cinzel text-3xl text-brand-primary">Account</Link>
        </div>
      </div>
    </>
  );
}
