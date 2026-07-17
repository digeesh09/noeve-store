'use client';
import React, { useEffect, useState } from 'react';
import { fetchReportsData } from '@/lib/api';

export default function SalesReportPage() {
  const [salesSummary, setSalesSummary] = useState<any>(null);
  const [dailyRevenue, setDailyRevenue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const formatPrice = (cents: number, currency = 'INR') => 
    (cents / 100).toLocaleString('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 });

  useEffect(() => {
    Promise.all([
      fetchReportsData('sales-summary').catch(() => null),
      fetchReportsData('daily-revenue').catch(() => [])
    ]).then(([summary, daily]) => {
      setSalesSummary(summary?.data || summary);
      setDailyRevenue(Array.isArray(daily?.data) ? daily.data : Array.isArray(daily) ? daily : []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-neutral-500">Loading Sales Report...</div>;

  const maxRevenue = Math.max(...(dailyRevenue.map(d => d.revenueCents) || [0]), 100000);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Sales Report</h1>
      
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

      <section className="rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-medium mb-6">Daily Revenue Trends</h2>
        {dailyRevenue.length > 0 ? (
          <div className="h-64 flex items-end gap-1">
            {dailyRevenue.map((day) => {
              const heightPct = Math.max((day.revenueCents / maxRevenue) * 100, 1);
              return (
                <div key={day.date} className="group relative flex-1 flex flex-col justify-end items-center h-full">
                  <div 
                    className="w-full bg-brand-primary/80 hover:bg-brand-primary rounded-t transition-colors"
                    style={{ height: heightPct + '%' }}
                  />
                  <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-neutral-900 text-white text-xs rounded px-2 py-1 pointer-events-none whitespace-nowrap z-10 transition-opacity">
                    {new Date(day.date).toLocaleDateString()}: {formatPrice(day.revenueCents)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-sm text-neutral-400">No data available</div>
        )}
      </section>
    </div>
  );
}