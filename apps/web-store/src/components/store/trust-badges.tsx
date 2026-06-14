import React from 'react';

const badges = [
  { icon: '✨', title: 'Certified Quality', desc: 'Authentic materials & lifetime warranty' },
  { icon: '🔒', title: 'Secure Checkout', desc: 'Fully encrypted and insured payments' },
  { icon: '💎', title: 'Jeweller Care Guidance', desc: 'Expert maintenance guide with each order' },
  { icon: '📦', title: 'Insured Delivery', desc: 'Fully tracked door-to-door courier' },
];

export function TrustBadges(): React.JSX.Element {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {badges.map((b) => (
        <li
          key={b.title}
          className="relative rounded-xl border border-neutral-100 bg-white px-5 py-6 text-center shadow-sm transition-all duration-300 hover:shadow-md hover:border-brand-accent/20 border-t-2 border-t-brand-accent"
        >
          <div className="text-2xl mb-2">{b.icon}</div>
          <p className="font-serif text-base font-semibold text-brand-primary tracking-wide">{b.title}</p>
          <p className="mt-1.5 text-xs leading-relaxed text-neutral-400 font-medium">{b.desc}</p>
        </li>
      ))}
    </ul>
  );
}

