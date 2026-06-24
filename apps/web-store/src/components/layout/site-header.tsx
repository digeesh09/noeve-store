'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CartBadge } from '@/components/cart/cart-badge';

const nav = [
  { href: '/shop', label: 'New' },
  { href: '/shop?category=jewellery', label: 'Jewellery' },
  { href: '/shop?category=pendants', label: 'Pendants' },
  { href: '/shop?category=care-accessories', label: 'Care' },
];

/** Inline SVG Logo — NOEVE in Cinzel/gold with tagline in Montserrat/gold */
function NoeveWordmark({ dark = false }: { dark?: boolean }) {
  const brandColor = dark ? '#cbb36b' : '#5a0014';
  const taglineColor = '#cbb36b';
  return (
    <svg
      viewBox="0 0 260 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="NOEVE"
      className="h-10 w-auto"
    >
      {/* NOEVE text */}
      <text
        x="130" y="30"
        textAnchor="middle"
        fontFamily="Cinzel, serif"
        fontSize="28"
        fontWeight="600"
        letterSpacing="4"
        fill={brandColor}
      >
        NOEVE
      </text>
      {/* Left hairline */}
      <line x1="18" y1="42" x2="62" y2="42" stroke={taglineColor} strokeWidth="0.8"/>
      {/* Tagline */}
      <text
        x="130" y="50"
        textAnchor="middle"
        fontFamily="Montserrat, sans-serif"
        fontSize="5.5"
        fontWeight="500"
        letterSpacing="2.5"
        fill={taglineColor}
      >
        EFFORTLESS ELEGANCE IN EVERY PIECE
      </text>
      {/* Right hairline */}
      <line x1="198" y1="42" x2="242" y2="42" stroke={taglineColor} strokeWidth="0.8"/>
    </svg>
  );
}

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
      <div
        className="overflow-hidden whitespace-nowrap"
        style={{ background: '#1a1a1a', borderBottom: '1px solid #cbb36b' }}
      >
        <div
          className="inline-flex"
          style={{ animation: 'scroll-marquee 30s linear infinite', padding: '0.55em 0' }}
        >
          {[
            'FREE SHIPPING ON ORDERS OVER ₹1500', '○',
            'NEW COLLECTION NOW LIVE', '○',
            'EARLY ACCESS FOR LIST MEMBERS', '○',
            'HANDCRAFTED FINE JEWELLERY', '○',
            'FREE SHIPPING ON ORDERS OVER ₹1500', '○',
            'NEW COLLECTION NOW LIVE', '○',
            'EARLY ACCESS FOR LIST MEMBERS', '○',
            'HANDCRAFTED FINE JEWELLERY', '○',
          ].map((item, i) => (
            <span
              key={i}
              style={{
                padding: '0 1.6em',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.7rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#fdfbf4',
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Sticky header */}
      <header
        id="site-header"
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(253,251,244,0.96)' : 'rgba(253,251,244,0.93)',
          backdropFilter: 'blur(6px)',
          borderBottom: '1px solid rgba(26,26,26,0.1)',
          boxShadow: scrolled ? '0 6px 18px rgba(26,26,26,0.07)' : 'none',
        }}
      >
        <div
          className="mx-auto flex items-center justify-between"
          style={{ maxWidth: '1280px', padding: '1rem clamp(1.5rem, 5vw, 4.5rem)' }}
        >
          {/* Logo — on cream bg: gold tagline, burgundy brand name */}
          <Link href="/" className="shrink-0">
            <NoeveWordmark dark={false} />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-9 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link group relative pb-1 text-[0.78rem] font-medium uppercase tracking-[0.08em] text-ink transition-colors duration-200 hover:text-brand-primary"
              >
                {item.label}
                <span
                  className="absolute bottom-0 left-0 h-px w-0 transition-all duration-300 group-hover:w-full"
                  style={{ background: '#5a0014' }}
                />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-5">
            {/* Search */}
            <button aria-label="Search" className="hidden h-5 w-5 text-ink transition-colors hover:text-brand-primary sm:inline-flex">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="7"/>
                <path d="M21 21l-4.3-4.3"/>
              </svg>
            </button>

            {/* Account */}
            <Link href="/login" aria-label="Sign in" className="hidden h-5 w-5 text-ink transition-colors hover:text-brand-primary sm:inline-flex">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="3.5"/>
                <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6"/>
              </svg>
            </Link>

            {/* Cart */}
            <CartBadge />

            {/* Burger */}
            <button
              id="nav-burger"
              className="flex flex-col gap-1.5 md:hidden"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <span className="block h-px w-6 bg-ink" />
              <span className="block h-px w-6 bg-ink" />
              <span className="block h-px w-6 bg-ink" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav overlay */}
      <div
        id="mobile-nav"
        className="fixed inset-0 z-[300] flex flex-col transition-transform duration-[400ms] ease-[cubic-bezier(.2,.8,.2,1)]"
        style={{
          background: '#fdfbf4',
          padding: '1.5rem clamp(1.5rem,5vw,4.5rem) 2rem',
          transform: mobileOpen ? 'translateY(0)' : 'translateY(-100%)',
        }}
      >
        <div className="mb-10 flex items-center justify-between">
          <NoeveWordmark dark={false} />
          <button
            id="mobile-nav-close"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="flex flex-col gap-1.5"
          >
            <span className="block h-px w-6 bg-ink" style={{ transform: 'rotate(45deg) translate(1px,1px)' }} />
            <span className="block h-px w-6 bg-ink opacity-0" />
            <span className="block h-px w-6 bg-ink" style={{ transform: 'rotate(-45deg) translate(1px,-1px)' }} />
          </button>
        </div>
        <div className="flex flex-col gap-6">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              style={{ fontFamily: 'Cinzel, serif', fontSize: '1.9rem', color: '#5a0014' }}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/cart" onClick={() => setMobileOpen(false)} style={{ fontFamily: 'Cinzel, serif', fontSize: '1.9rem', color: '#5a0014' }}>Bag</Link>
          <Link href="/login" onClick={() => setMobileOpen(false)} style={{ fontFamily: 'Cinzel, serif', fontSize: '1.9rem', color: '#5a0014' }}>Sign In</Link>
          <Link href="/register" onClick={() => setMobileOpen(false)} style={{ fontFamily: 'Cinzel, serif', fontSize: '1.9rem', color: '#5a0014' }}>Create Account</Link>
        </div>
      </div>
    </>
  );
}
