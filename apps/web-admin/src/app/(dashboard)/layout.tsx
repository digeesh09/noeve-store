'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/auth-guard';
import { logout } from '@/lib/auth';
import { NavigationProgress, startProgress } from '@/components/NavigationProgress';

const nav = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/reports', label: 'Reports' },
  { href: '/dashboard/orders', label: 'Orders' },
  { href: '/dashboard/products', label: 'Products' },
  { href: '/dashboard/inventory', label: 'Inventory' },
  { href: '/dashboard/categories', label: 'Categories' },
  { href: '/dashboard/promotions', label: 'Promotions' },
  { href: '/dashboard/crm', label: 'CRM' },
  { href: '/dashboard/marketing', label: 'Marketing' },
  { href: '/dashboard/reviews', label: 'Reviews' },
  { href: '/dashboard/support', label: 'Support' },
  { href: '/dashboard/fulfillment', label: 'Fulfillment' },
  { href: '/dashboard/settings', label: 'Settings' },
];

export default function DashboardLayout({ children }: { children: any }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  /**
   * Determine if a nav item is active.
   * The Overview ("/dashboard") only matches exactly; sub-pages match by prefix.
   */
  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

  return (
    <AuthGuard>
      {/* Top-of-page route-change progress bar */}
      <NavigationProgress />

      <div className="flex min-h-screen">
        <aside className="w-56 border-r border-neutral-200 bg-white p-4">
          <div className="mb-8">
            <img src="/images/logo.png" alt="Noeve Admin" style={{ height: '32px', width: 'auto' }} />
          </div>
          <nav className="mt-8 space-y-1">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    // Only fire the progress bar if we are navigating somewhere new.
                    if (!active) startProgress();
                  }}
                  className={[
                    'block rounded px-3 py-2 text-sm transition-colors duration-150',
                    active
                      ? 'bg-violet-50 font-semibold text-violet-700'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
                  ].join(' ')}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-8 w-full rounded px-3 py-2 text-left text-sm text-neutral-500 hover:bg-neutral-100"
          >
            Sign out
          </button>
        </aside>
        <div className="flex flex-1 flex-col">
          <main className="flex-1 p-8">{children}</main>
          <footer className="border-t border-neutral-200 p-4 text-center text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} Noeve Web Admin. All rights reserved.
          </footer>
        </div>
      </div>
    </AuthGuard>
  );
}
