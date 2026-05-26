const badges = [
  { title: 'Certified quality', desc: 'Authentic materials & craftsmanship' },
  { title: 'Secure checkout', desc: 'Protected payments coming soon' },
  { title: 'Care guidance', desc: 'Instructions with every piece' },
  { title: 'Tracked delivery', desc: 'Follow your order end to end' },
];

export function TrustBadges() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {badges.map((b) => (
        <li
          key={b.title}
          className="rounded-xl border border-neutral-200 bg-white px-4 py-5 text-center shadow-sm"
        >
          <p className="text-sm font-semibold text-brand-primary">{b.title}</p>
          <p className="mt-1 text-xs text-neutral-500">{b.desc}</p>
        </li>
      ))}
    </ul>
  );
}
