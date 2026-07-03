'use client';

import React, { useEffect, useState } from 'react';
import { fetchOrders, type Order } from '@/lib/api';
import Link from 'next/link';

export default function DashboardPage(): React.JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Formatting helper
  const formatPrice = (cents: number, currency = 'INR') => 
    (cents / 100).toLocaleString('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 });

  useEffect(() => {
    fetchOrders()
      .then((res) => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openOrders = orders.filter((o) => o.status === 'CONFIRMED').length;
  const processing = orders.filter((o) => ['PROCESSING', 'PICKED', 'PACKED'].includes(o.status)).length;
  const shippedToday = orders.filter((o) => {
    if (o.status !== 'SHIPPED') return false;
    const orderDate = new Date(o.createdAt); // ideally we would check when it was shipped, but we only have createdAt
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  }).length;

  const stats = [
    { label: 'Open orders', value: loading ? '—' : openOrders, href: '/dashboard/orders?status=CONFIRMED' },
    { label: 'Processing', value: loading ? '—' : processing, href: '/dashboard/orders?status=PROCESSING' },
    { label: 'Shipped today', value: loading ? '—' : shippedToday, href: '/dashboard/orders?status=SHIPPED' },
  ];

  // Reports
  const totalSalesCents = orders.filter(o => o.status !== 'CANCELLED' && o.status !== 'REFUNDED').reduce((acc, o) => acc + o.totalCents, 0);
  const totalTaxCents = orders.filter(o => o.status !== 'CANCELLED' && o.status !== 'REFUNDED').reduce((acc, o) => acc + o.taxCents, 0);
  
  const financialStats = [
    { label: 'Total Sales Revenue', value: loading ? '—' : formatPrice(totalSalesCents) },
    { label: 'Total Tax Collected (GST)', value: loading ? '—' : formatPrice(totalTaxCents) },
  ];
  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-neutral-600">
        Order queue, product management, and fulfillment tracking connect to{' '}
        <code className="rounded bg-neutral-100 px-1">/v1/admin/*</code> endpoints.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="block rounded-lg border border-neutral-200 bg-white p-6 hover:border-brand-primary hover:bg-neutral-50 transition-colors">
            <p className="text-sm text-neutral-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-neutral-900">{stat.value}</p>
          </Link>
        ))}
      </div>
      
      <h2 className="text-xl font-semibold mt-12 mb-4">Financial Reports</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {financialStats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-brand-accent/20 bg-brand-accent-light/10 p-6">
            <p className="text-sm text-neutral-600">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-brand-primary">{stat.value}</p>
          </div>
        ))}
      </div>
      
      <h2 className="text-xl font-semibold mt-12 mb-4">Quick Access</h2>
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { name: 'Orders', href: '/dashboard/orders', icon: '📦' },
          { name: 'Products', href: '/dashboard/products', icon: '🛍️' },
          { name: 'Marketing', href: '/dashboard/marketing', icon: '📢' },
          { name: 'Categories', href: '/dashboard/categories', icon: '📑' },
          { name: 'Promotions', href: '/dashboard/promotions', icon: '🏷️' },
          { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
        ].map((link) => (
          <Link key={link.name} href={link.href} className="group flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-4 hover:border-brand-primary hover:bg-neutral-50 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{link.icon}</span>
              <span className="font-medium text-neutral-800 group-hover:text-brand-primary">{link.name}</span>
            </div>
            <span className="text-neutral-400 group-hover:text-brand-primary transition-transform group-hover:translate-x-1">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
