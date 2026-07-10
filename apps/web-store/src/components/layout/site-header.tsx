'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CartBadge } from '@/components/cart/cart-badge';


const nav = [
  { href: '/shop', label: 'The Edit' },
  { href: '/#edit', label: 'Trending' },
  { href: '/shop?category=apparel', label: 'Apparel' },
  { href: '/shop?category=jewellery', label: 'Jewellery' },
  { href: '/shop?category=beauty', label: 'Beauty' },
  { href: '/#newsletter', label: 'Journal' },
  { href: '/support', label: 'Contact' },
];

export function SiteHeader(): React.JSX.Element {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showShopBtn, setShowShopBtn] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    import('@/lib/api').then(({ apiClient }) => {
      apiClient.store.getSettings().then(res => setSettings(res.data)).catch(console.error);
    });
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
          {settings?.marqueeText ? (
            // Duplicate the text to ensure continuous scrolling
            [...settings.marqueeText.split('\n'), ...settings.marqueeText.split('\n'), ...settings.marqueeText.split('\n')].map((text, i) => (
              <React.Fragment key={i}>
                <span>{text.trim()}</span>
                <span>○</span>
              </React.Fragment>
            ))
          ) : (
            <>
              <span>FREE SHIPPING ON ORDERS OVER {settings ? `₹${(settings.shippingThresholdCents / 100).toLocaleString()}` : '₹15,000'}</span>
              <span>○</span>
              <span>THE NEW EDIT IS NOW LIVE</span>
              <span>○</span>
              <span>EARLY ACCESS FOR LIST MEMBERS</span>
              <span>○</span>
              <span>FREE SHIPPING ON ORDERS OVER {settings ? `₹${(settings.shippingThresholdCents / 100).toLocaleString()}` : '₹15,000'}</span>
              <span>○</span>
              <span>THE NEW EDIT IS NOW LIVE</span>
              <span>○</span>
              <span>EARLY ACCESS FOR LIST MEMBERS</span>
              <span>○</span>
            </>
          )}
        </div>
      </div>

      {/* Sticky header */}
      <header
        id="site-header"
        className={`site-header ${scrolled ? 'is-scrolled' : ''}`}
      >
        <div className="wrap nav">
          <Link href="/" className="nav__logo" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/images/logo.png" alt="NOEVE" style={{ height: '44px', width: 'auto', mixBlendMode: 'multiply' }} />
          </Link>

          <nav className="nav__links">
            {nav.map((item) => (
              <Link key={item.label} href={item.href} className="nav__link">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="nav__actions">
            <Link href="/shop" aria-label="Search" className="nav__icon-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
              </svg>
            </Link>

            <Link href="/account" aria-label="Profile" className="nav__icon-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>

            <CartBadge />

            {showShopBtn && (
              <Link href="/shop" className="btn btn--primary nav__shop-btn is-visible">Shop Now</Link>
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
          <span className="nav__logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/images/logo.png" alt="NOEVE" style={{ height: '44px', width: 'auto', mixBlendMode: 'multiply' }} />
          </span>
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
        </div>
      </div>
    </>
  );
}
