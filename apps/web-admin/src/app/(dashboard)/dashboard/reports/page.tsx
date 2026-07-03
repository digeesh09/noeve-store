'use client';

import React, { useEffect, useState } from 'react';
import { fetchReportsData } from '@/lib/api';

export default function ReportsPage() {
  const [salesSummary, setSalesSummary] = useState<any>(null);
  const [topProducts, setTopProducts] = useState<any>(null);
  const [transactions, setTransactions] = useState<any>(null);
  const [dailyRevenue, setDailyRevenue] = useState<any[]>([]);
  const [ordersByStatus, setOrdersByStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetchReportsData('sales-summary'),
      fetchReportsData('top-products'),
      fetchReportsData('recent-transactions'),
      fetchReportsData('daily-revenue'),
      fetchReportsData('orders-by-status')
    ]).then(([salesRes, productsRes, transactionsRes, dailyRes, statusRes]) => {
      setSalesSummary(salesRes.data || salesRes);
      setTopProducts(productsRes.data || productsRes);
      setTransactions(transactionsRes.data || transactionsRes);
      setDailyRevenue(dailyRes.data || dailyRes || []);
      setOrdersByStatus(statusRes.data || statusRes || []);
    }).catch(err => {
      console.error(err);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatPrice = (cents: number) => (cents / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

  // Compute values for Bar Chart
  const maxRevenue = Math.max(...(dailyRevenue.map(d => d.revenueCents) || [0]), 100000);
  
  // Compute values for Donut Chart
  const statusColors: Record<string, string> = {
    'PENDING_PAYMENT': '#f97316', // orange
    'CONFIRMED': '#14b8a6',       // teal
    'PROCESSING': '#f59e0b',      // amber
    'PICKED': '#8b5cf6',          // purple
    'PACKED': '#6366f1',          // indigo
    'SHIPPED': '#3b82f6',         // blue
    'DELIVERED': '#10b981',       // green
    'CANCELLED': '#ef4444',       // red
    'REFUNDED': '#64748b',        // slate
  };
  const totalStatusCount = ordersByStatus.reduce((acc, curr) => acc + curr.count, 0) || 1;
  let currentOffset = 0;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-neutral-900">Reports Overview</h1>
        <button 
          onClick={loadData}
          disabled={loading}
          className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:opacity-50"
          title="Refresh Data"
        >
          <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

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

          <div className="grid gap-8 lg:grid-cols-2">
            <section className="rounded-lg border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-medium mb-6">Daily Revenue</h2>
              {dailyRevenue.length > 0 ? (
                <div className="h-64 flex items-end gap-1">
                  {dailyRevenue.map((day, i) => {
                    const heightPct = Math.max((day.revenueCents / maxRevenue) * 100, 1);
                    return (
                      <div key={day.date} className="group relative flex-1 flex flex-col justify-end items-center h-full">
                        <div 
                          className="w-full bg-brand-primary/80 hover:bg-brand-primary rounded-t transition-colors"
                          style={{ height: `${heightPct}%` }}
                        />
                        <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-neutral-900 text-white text-xs rounded px-2 py-1 pointer-events-none whitespace-nowrap z-10 transition-opacity">
                          {new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}: {formatPrice(day.revenueCents)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-sm text-neutral-400">No data available</div>
              )}
            </section>

            <section className="rounded-lg border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-medium mb-6">Orders by Status</h2>
              {ordersByStatus.length > 0 ? (
                <div className="flex items-center justify-center gap-8 h-64">
                  <div className="relative w-48 h-48">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      {ordersByStatus.map((status) => {
                        const pct = status.count / totalStatusCount;
                        const strokeDasharray = `${pct * 314} 314`; // 2 * pi * r (r=50)
                        const strokeDashoffset = -currentOffset * 314;
                        currentOffset += pct;
                        const color = statusColors[status.status] || '#cbd5e1';
                        return (
                          <circle
                            key={status.status}
                            cx="50"
                            cy="50"
                            r="50"
                            fill="transparent"
                            stroke={color}
                            strokeWidth="20"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-1000 hover:opacity-80"
                          />
                        );
                      })}
                      {/* Inner circle to make it a donut */}
                      <circle cx="50" cy="50" r="40" fill="white" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-2xl font-bold">{totalStatusCount}</span>
                      <span className="text-xs text-neutral-500 uppercase tracking-widest">Total</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {ordersByStatus.map(status => (
                      <div key={status.status} className="flex items-center gap-2 text-sm">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColors[status.status] || '#cbd5e1' }} />
                        <span className="font-medium">{status.status}</span>
                        <span className="text-neutral-500 ml-auto">{status.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-sm text-neutral-400">No data available</div>
              )}
            </section>
          </div>

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
