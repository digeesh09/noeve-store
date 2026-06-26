'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CartBadge } from '@/components/cart/cart-badge';

const nav = [
  { href: '/#edit', label: 'New' },
  { href: '/#pillars', label: 'Apparel' },
  { href: '/#pillars', label: 'Beauty' },
  { href: '/#pillars', label: 'Lifestyle' },
  { href: '/#newsletter', label: 'Journal' },
];

export function SiteHeader(): React.JSX.Element {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showShopBtn, setShowShopBtn] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      setShowShopBtn(window.scrollY > 480);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Announcement marquee */}
      <div className="marquee">
        <div className="marquee__track">
          <span>FREE SHIPPING ON ORDERS OVER $150</span>
          <span>○</span>
          <span>THE NEW EDIT IS NOW LIVE</span>
          <span>○</span>
          <span>EARLY ACCESS FOR LIST MEMBERS</span>
          <span>○</span>
          <span>FREE SHIPPING ON ORDERS OVER $150</span>
          <span>○</span>
          <span>THE NEW EDIT IS NOW LIVE</span>
          <span>○</span>
          <span>EARLY ACCESS FOR LIST MEMBERS</span>
          <span>○</span>
        </div>
      </div>

      {/* Sticky header */}
      <header
        id="site-header"
        className={`site-header ${scrolled ? 'is-scrolled' : ''}`}
      >
        <div className="wrap nav">
          <Link href="/" className="nav__logo">NOEVE</Link>

          <nav className="nav__links">
            {nav.map((item) => (
              <Link key={item.label} href={item.href} className="nav__link">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="nav__actions">
            <button aria-label="Search" className="nav__icon-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
              </svg>
            </button>

            <Link href="/login" aria-label="Sign in" className="nav__icon-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6"/>
              </svg>
            </Link>

            <CartBadge />

            {showShopBtn && (
              <Link href="/#edit" className="btn btn--primary nav__shop-btn is-visible">Shop Now</Link>
            )}

            <button
              className="nav__burger"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav overlay */}
      <div className={`mobile-nav ${mobileOpen ? 'is-open' : ''}`}>
        <div className="mobile-nav__top">
          <span className="nav__logo">NOEVE</span>
          <button
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="nav__burger"
          >
            <span style={{ transform: 'rotate(45deg) translate(1px,1px)' }} />
            <span style={{ opacity: 0 }} />
            <span style={{ transform: 'rotate(-45deg) translate(1px,-1px)' }} />
          </button>
        </div>
        <div className="mobile-nav__links">
          {nav.map((item) => (
            <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)}>{item.label}</Link>
          ))}
          <Link href="/cart" onClick={() => setMobileOpen(false)}>Bag</Link>
          <Link href="/login" onClick={() => setMobileOpen(false)}>Sign In</Link>
        </div>
      </div>
    </>
  );
}
