import Link from 'next/link';

const nav = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/orders', label: 'Orders' },
  { href: '/dashboard/products', label: 'Products' },
  { href: '/dashboard/fulfillment', label: 'Fulfillment' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r border-neutral-200 bg-white p-4">
        <p className="font-semibold text-brand-primary">Noeve Admin</p>
        <nav className="mt-8 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded px-3 py-2 text-sm hover:bg-neutral-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
