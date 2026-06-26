import React from 'react';
import Link from 'next/link';

const shopLinks = [
  { href: '/#pillars', label: 'Apparel' },
  { href: '/#pillars', label: 'Beauty' },
  { href: '/#pillars', label: 'Lifestyle' },
  { href: '#', label: 'Gift Cards' },
];
const supportLinks = [
  { href: '/account', label: 'Order Status' },
  { href: '#', label: 'Shipping & Returns' },
  { href: '#', label: 'Size Guide' },
  { href: '#', label: 'Contact Us' },
  { href: '#', label: 'FAQs' },
];
const studioLinks = [
  { href: '#', label: 'About Noeve' },
  { href: '/#newsletter', label: 'Journal' },
  { href: '#', label: 'Sustainability' },
  { href: '#', label: 'Careers' },
];

export function SiteFooter(): React.JSX.Element {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer__top">
          <div className="footer__brand">
            <Link href="/" className="nav__logo" style={{ color: 'var(--cream)' }}>NOEVE</Link>
            <p className="footer__tagline">
              Considered fashion, beauty and lifestyle, made to outlast the season.
            </p>
            <div className="footer__social">
              <a href="#" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.2" cy="6.8" r="1"/>
                </svg>
              </a>
              <a href="#" aria-label="Pinterest">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="9"/>
                  <path d="M9.5 17l1.6-7.3M12 9.5c2 0 3.3 1.1 3 2.8-.3 1.7-1.6 2.4-2.7 2.2-1-.2-1.3-.9-1-1.9"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer__col">
            <h4>Shop</h4>
            <ul>
              {shopLinks.map((l) => (
                <li key={l.label}><Link href={l.href}>{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h4>Support</h4>
            <ul>
              {supportLinks.map((l) => (
                <li key={l.label}><Link href={l.href}>{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h4>Studio</h4>
            <ul>
              {studioLinks.map((l) => (
                <li key={l.label}><Link href={l.href}>{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} NOEVE. All rights reserved. — www.noeve.store</p>
          <div className="footer__legal">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
