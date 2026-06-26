import React from 'react';

const badges = [
  { icon: '✨', title: 'Certified Quality', desc: 'Authentic materials & lifetime warranty' },
  { icon: '🔒', title: 'Secure Checkout', desc: 'Fully encrypted and insured payments' },
  { icon: '💎', title: 'Jeweller Care Guidance', desc: 'Expert maintenance guide with each order' },
  { icon: '📦', title: 'Insured Delivery', desc: 'Fully tracked door-to-door courier' },
];

export function TrustBadges(): React.JSX.Element {
  return (
    <div className="trust-row">
      {badges.map((b) => (
        <div key={b.title} className="trust-row__item">
          <span style={{ fontSize: '1.4rem', marginBottom: '0.2rem' }}>{b.icon}</span>
          <span>{b.title}</span>
        </div>
      ))}
    </div>
  );
}
