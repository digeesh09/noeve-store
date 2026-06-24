import React from 'react';
import Link from 'next/link';

/** Inline SVG Wordmark for dark backgrounds — gold name + gold tagline */
function NoeveWordmarkLight() {
  return (
    <svg
      viewBox="0 0 260 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="NOEVE"
      className="h-10 w-auto"
    >
      <text
        x="130" y="30"
        textAnchor="middle"
        fontFamily="Cinzel, serif"
        fontSize="28"
        fontWeight="600"
        letterSpacing="4"
        fill="#cbb36b"
      >
        NOEVE
      </text>
      <line x1="18" y1="42" x2="62" y2="42" stroke="#cbb36b" strokeWidth="0.8" strokeOpacity="0.7"/>
      <text
        x="130" y="50"
        textAnchor="middle"
        fontFamily="Montserrat, sans-serif"
        fontSize="5.5"
        fontWeight="500"
        letterSpacing="2.5"
        fill="#cbb36b"
        fillOpacity="0.85"
      >
        EFFORTLESS ELEGANCE IN EVERY PIECE
      </text>
      <line x1="198" y1="42" x2="242" y2="42" stroke="#cbb36b" strokeWidth="0.8" strokeOpacity="0.7"/>
    </svg>
  );
}

const shopLinks = [
  { href: '/shop', label: 'All Jewellery' },
  { href: '/shop?category=pendants', label: 'Pendants' },
  { href: '/shop?category=jewellery', label: 'Fine Jewellery' },
  { href: '/shop?category=care-accessories', label: 'Care Accessories' },
];
const supportLinks = [
  { href: '/account', label: 'My Orders' },
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
    <footer style={{ background: '#1a1a1a', color: '#fdfbf4', padding: '5rem 0 2rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(1.5rem,5vw,4.5rem)' }}>

        {/* Top grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '2.5rem',
            paddingBottom: '3.5rem',
            borderBottom: '1px solid rgba(253,251,244,0.15)',
          }}
        >
          {/* Brand */}
          <div>
            <NoeveWordmarkLight />
            <p style={{ color: 'rgba(253,251,244,0.65)', margin: '1.2rem 0 1.4rem', maxWidth: '26ch', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Effortless elegance in every piece — fine jewellery and accessories crafted to outlast the season.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {/* Instagram */}
              <a
                href="#"
                aria-label="Instagram"
                style={{ width: '34px', height: '34px', border: '1px solid rgba(253,251,244,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease', color: '#fdfbf4' }}
              >
                <svg style={{ width: '15px', height: '15px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.2" cy="6.8" r="1"/>
                </svg>
              </a>
              {/* Pinterest */}
              <a
                href="#"
                aria-label="Pinterest"
                style={{ width: '34px', height: '34px', border: '1px solid rgba(253,251,244,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease', color: '#fdfbf4' }}
              >
                <svg style={{ width: '15px', height: '15px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="9"/>
                  <path d="M9.5 17l1.6-7.3M12 9.5c2 0 3.3 1.1 3 2.8-.3 1.7-1.6 2.4-2.7 2.2-1-.2-1.3-.9-1-1.9"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#cbb36b', marginBottom: '1.2rem' }}>Shop</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {shopLinks.map((l) => (
                <li key={l.label}><Link href={l.href} style={{ fontSize: '0.92rem', color: 'rgba(253,251,244,0.78)' }}>{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#cbb36b', marginBottom: '1.2rem' }}>Support</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {supportLinks.map((l) => (
                <li key={l.label}><Link href={l.href} style={{ fontSize: '0.92rem', color: 'rgba(253,251,244,0.78)' }}>{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Studio */}
          <div>
            <h4 style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#cbb36b', marginBottom: '1.2rem' }}>Studio</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {studioLinks.map((l) => (
                <li key={l.label}><Link href={l.href} style={{ fontSize: '0.92rem', color: 'rgba(253,251,244,0.78)' }}>{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.8rem', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.78rem', color: 'rgba(253,251,244,0.55)' }}>
            © {new Date().getFullYear()} NOEVE. All rights reserved. — www.noeve.store
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" style={{ fontSize: '0.78rem', color: 'rgba(253,251,244,0.55)' }}>Privacy</a>
            <a href="#" style={{ fontSize: '0.78rem', color: 'rgba(253,251,244,0.55)' }}>Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
