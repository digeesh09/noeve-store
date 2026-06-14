import React from 'react';
import Link from 'next/link';
import { AccountPanel } from '@/components/account/account-panel';

export default function AccountPage(): React.JSX.Element {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <AccountPanel />

        <div className="space-y-6">
          <div className="rounded-2xl bg-brand-primary p-6 text-white">
            <h2 className="font-serif text-xl font-semibold">Your orders</h2>
            <p className="mt-2 text-sm text-neutral-300">
              View order history and delivery status after signing in.
            </p>
            <Link
              href="/shop"
              className="mt-4 inline-block text-sm font-medium text-brand-accent hover:underline"
            >
              Start shopping →
            </Link>
          </div>

          <ul className="space-y-4 text-sm text-neutral-600">
            <li className="flex gap-3 rounded-xl border border-neutral-200 p-4">
              <span className="text-brand-accent">01</span>
              <span>
                <strong className="text-brand-primary">Saved addresses</strong> — faster checkout for
                gifts and repeat orders.
              </span>
            </li>
            <li className="flex gap-3 rounded-xl border border-neutral-200 p-4">
              <span className="text-brand-accent">02</span>
              <span>
                <strong className="text-brand-primary">Wishlist</strong> — save pieces you love
                (coming soon).
              </span>
            </li>
            <li className="flex gap-3 rounded-xl border border-neutral-200 p-4">
              <span className="text-brand-accent">03</span>
              <span>
                <strong className="text-brand-primary">Care reminders</strong> — tips to keep your
                jewellery radiant.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
