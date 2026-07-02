import React from 'react';
import Link from 'next/link';

const shopLinks = [
  { href: '/#pillars', label: 'Apparel' },
  { href: '/#pillars', label: 'Beauty' },
  { href: '/#pillars', label: 'Lifestyle' },
  { href: '/gift-cards', label: 'Gift Cards' },
];
const supportLinks = [
  { href: '/account', label: 'Order Status' },
  { href: '/return-policy', label: 'Returns Policy' },
  { href: '/size-guide', label: 'Size Guide' },
  { href: '/grievance-redressal', label: 'Grievance Redressal' },
  { href: '/faqs', label: 'FAQs' },
];
const studioLinks = [
  { href: '/about', label: 'About Noeve' },
  { href: '/vision', label: 'Vision' },
  { href: '/mission', label: 'Mission' },
  { href: '/sustainability', label: 'Sustainability' },
  { href: '/careers', label: 'Careers' },
];

export function SiteFooter(): React.JSX.Element {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer__top">
          <div className="footer__brand">
            <Link href="/" className="nav__logo" style={{ color: 'var(--cream)', display: 'flex', alignItems: 'center' }}>
              <img src="/images/logo.png" alt="NOEVE" style={{ height: '56px', width: 'auto', filter: 'invert(1) brightness(2)' }} />
            </Link>
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
            <Link href="/payment-security">Payment Security</Link>
            <Link href="/e-waste-compliance">E-Waste</Link>
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
