'use client';

import React, { useEffect, useState } from 'react';
import { fetchReportsData } from '@/lib/api';

export default function ReportsPage() {
  const [salesSummary, setSalesSummary] = useState<any>(null);
  const [topProducts, setTopProducts] = useState<any>(null);
  const [transactions, setTransactions] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchReportsData('sales-summary'),
      fetchReportsData('top-products'),
      fetchReportsData('recent-transactions')
    ]).then(([salesRes, productsRes, transactionsRes]) => {
      setSalesSummary(salesRes);
      setTopProducts(productsRes);
      setTransactions(transactionsRes);
    }).finally(() => setLoading(false));
  }, []);

  const formatPrice = (cents: number) => (cents / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-neutral-900">Reports Overview</h1>

      {loading ? (
        <div className="text-sm text-neutral-500">Loading reports...</div>
      ) : (
        <>
          <section>
            <h2 className="text-xl font-medium mb-4">Sales Summary (Last 30 Days)</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-neutral-200 bg-white p-6">
                <p className="text-sm text-neutral-500">Total Revenue</p>
                <p className="mt-2 text-3xl font-semibold text-brand-primary">
                  {formatPrice(salesSummary?.totalRevenueCents || 0)}
                </p>
              </div>
              <div className="rounded-lg border border-neutral-200 bg-white p-6">
                <p className="text-sm text-neutral-500">Total Orders</p>
                <p className="mt-2 text-3xl font-semibold text-neutral-900">
                  {salesSummary?.totalOrders || 0}
                </p>
              </div>
              <div className="rounded-lg border border-neutral-200 bg-white p-6">
                <p className="text-sm text-neutral-500">Avg Order Value</p>
                <p className="mt-2 text-3xl font-semibold text-neutral-900">
                  {formatPrice(salesSummary?.averageOrderValueCents || 0)}
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4">Top Products</h2>
            <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Units Sold</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 bg-white">
                  {topProducts?.map((tp: any) => (
                    <tr key={tp.productId}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-neutral-900">{tp.productName}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">{tp._sum.quantity}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">{formatPrice(tp._sum.lineTotalCents || 0)}</td>
                    </tr>
                  ))}
                  {(!topProducts || topProducts.length === 0) && (
                    <tr><td colSpan={3} className="px-6 py-4 text-sm text-neutral-500 text-center">No data available</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-4">Recent Transactions</h2>
            <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Order #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 bg-white">
                  {transactions?.map((t: any) => (
                    <tr key={t.id}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-neutral-900">{t.order?.orderNumber}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">
                        {t.order?.user?.firstName} {t.order?.user?.lastName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">{formatPrice(t.amountCents || 0)}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${t.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {(!transactions || transactions.length === 0) && (
                    <tr><td colSpan={5} className="px-6 py-4 text-sm text-neutral-500 text-center">No transactions available</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
