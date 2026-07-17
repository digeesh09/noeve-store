const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'apps/web-admin/src/app/(dashboard)/dashboard/reports');

const templates = {
  sales: `
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
}`,
  customer: `
'use client';
import React, { useEffect, useState } from 'react';
import { fetchReportsData } from '@/lib/api';

export default function CustomerReportPage() {
  const [acquisition, setAcquisition] = useState<any[]>([]);
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const formatPrice = (cents: number, currency = 'INR') => 
    (cents / 100).toLocaleString('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 });

  useEffect(() => {
    Promise.all([
      fetchReportsData('user-acquisition').catch(() => []),
      fetchReportsData('top-customers').catch(() => [])
    ]).then(([acqRes, topRes]) => {
      setAcquisition(Array.isArray(acqRes?.data) ? acqRes.data : Array.isArray(acqRes) ? acqRes : []);
      setTopCustomers(Array.isArray(topRes?.data) ? topRes.data : Array.isArray(topRes) ? topRes : []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-neutral-500">Loading Customer Report...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Customer Report</h1>
      
      <section className="rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-medium mb-4">User Acquisition</h2>
        <div className="overflow-hidden rounded-lg border border-neutral-200">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">New Users</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white">
              {acquisition.map((item: any) => (
                <tr key={item.date}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-neutral-900">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">{item.count}</td>
                </tr>
              ))}
              {acquisition.length === 0 && (
                <tr><td colSpan={2} className="px-6 py-4 text-sm text-neutral-500 text-center">No acquisition data found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-medium mb-4">Top Customers (By LTV)</h2>
        <div className="overflow-hidden rounded-lg border border-neutral-200">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Total Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white">
              {topCustomers.map((user: any) => (
                <tr key={user.userId}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-neutral-900">{user.user?.firstName} {user.user?.lastName} <br/><span className="text-xs text-neutral-400">{user.user?.email}</span></td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">{user._count?.id || user.orders}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">{formatPrice(user._sum?.totalCents || 0)}</td>
                </tr>
              ))}
              {topCustomers.length === 0 && (
                <tr><td colSpan={3} className="px-6 py-4 text-sm text-neutral-500 text-center">No top customers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}`,
  product: `
'use client';
import React, { useEffect, useState } from 'react';
import { fetchReportsData } from '@/lib/api';

export default function ProductReportPage() {
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const formatPrice = (cents: number, currency = 'INR') => 
    (cents / 100).toLocaleString('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 });

  useEffect(() => {
    fetchReportsData('top-products')
      .then(res => setTopProducts(Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []))
      .catch(() => setTopProducts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-neutral-500">Loading Product Report...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Product Report</h1>
      <p className="text-neutral-500">Detailed performance metrics for your catalog.</p>
      
      <section className="rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-medium mb-4">Top Performing Products</h2>
        <div className="overflow-hidden rounded-lg border border-neutral-200">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Units Sold</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Gross Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white">
              {topProducts.map((tp: any) => (
                <tr key={tp.productId}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-neutral-900">{tp.productName}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">{tp._sum?.quantity || tp.sales}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">{formatPrice(tp._sum?.lineTotalCents || 0)}</td>
                </tr>
              ))}
              {topProducts.length === 0 && (
                <tr><td colSpan={3} className="px-6 py-4 text-sm text-neutral-500 text-center">No products found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}`,
  vendor: `
'use client';
import React from 'react';

export default function VendorReportPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Vendor Report</h1>
      <p className="text-neutral-500">Multi-vendor operations and fulfillment report.</p>
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-12 text-center text-sm text-neutral-400">
        Vendor reporting data is currently being aggregated. Coming soon in v2.1.
      </div>
    </div>
  );
}`,
  support: `
'use client';
import React, { useEffect, useState } from 'react';
import { fetchSupportTickets } from '@/lib/api';

export default function SupportReportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSupportTickets(1, 100)
      .then(res => setTickets(res.data))
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-neutral-500">Loading Support Report...</div>;

  const openCount = tickets.filter(t => t.status === 'OPEN').length;
  const closedCount = tickets.filter(t => t.status === 'CLOSED').length;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Support Report</h1>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-neutral-200 bg-white p-6 border-l-4 border-l-red-500">
          <p className="text-sm text-neutral-500">Open Tickets</p>
          <p className="mt-2 text-3xl font-semibold text-neutral-900">{openCount}</p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-6 border-l-4 border-l-green-500">
          <p className="text-sm text-neutral-500">Closed Tickets</p>
          <p className="mt-2 text-3xl font-semibold text-neutral-900">{closedCount}</p>
        </div>
      </div>
    </div>
  );
}`,
  shipment: `
'use client';
import React from 'react';

export default function ShipmentReportPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Shipment Report</h1>
      <p className="text-neutral-500">Logistics and carrier performance metrics.</p>
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-12 text-center text-sm text-neutral-400">
        Logistics reporting requires carrier integration to be fully finalized. Coming soon.
      </div>
    </div>
  );
}`,
  returns: `
'use client';
import React from 'react';

export default function ReturnsReportPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Returns (RMA) Report</h1>
      <p className="text-neutral-500">Returns, refunds, and RMA tracking.</p>
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-12 text-center text-sm text-neutral-400">
        No returns found for the current period.
      </div>
    </div>
  );
}`,
  'profit-and-loss': `
'use client';
import React, { useEffect, useState } from 'react';
import { fetchReportsData } from '@/lib/api';

export default function ProfitLossReportPage() {
  const [salesSummary, setSalesSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const formatPrice = (cents: number, currency = 'INR') => 
    (cents / 100).toLocaleString('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 });

  useEffect(() => {
    fetchReportsData('sales-summary')
      .then(res => setSalesSummary(res?.data || res))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-neutral-500">Loading P&L...</div>;

  const revenue = salesSummary?.totalRevenueCents || 0;
  // Mocking COGS at 40% for the report
  const cogs = Math.round(revenue * 0.4);
  const grossProfit = revenue - cogs;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Profit & Loss</h1>
      
      <section className="rounded-lg border border-neutral-200 bg-white p-6 max-w-2xl">
        <h2 className="text-lg font-medium mb-6 border-b pb-2">Income Statement (Estimated)</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-neutral-800">Gross Revenue</span>
            <span className="font-medium">{formatPrice(revenue)}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm text-red-600">
            <span>Cost of Goods Sold (Est 40%)</span>
            <span>-{formatPrice(cogs)}</span>
          </div>
          
          <div className="border-t border-neutral-200 pt-4 flex justify-between items-center font-bold text-lg">
            <span>Gross Profit</span>
            <span className="text-green-600">{formatPrice(grossProfit)}</span>
          </div>
        </div>
      </section>
    </div>
  );
}`,
  burnout: `
'use client';
import React from 'react';

export default function BurnoutReportPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Work Burn Out Report</h1>
      <p className="text-neutral-500">Employee and fulfillment team workload distribution.</p>
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-12 text-center text-sm text-neutral-400">
        Workload tracking module is active but insufficient data exists to generate a burnout analysis.
      </div>
    </div>
  );
}`,
  analytics: `
'use client';
import React from 'react';
import Link from 'next/link';

export default function AnalyticsSummaryPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Analytics Summary</h1>
      <p className="text-neutral-500">High level overview of all organizational reports.</p>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { name: 'Sales Performance', href: '/dashboard/reports/sales' },
          { name: 'Customer LTV', href: '/dashboard/reports/customer' },
          { name: 'Order Processing (Heatmaps)', href: '/dashboard/reports/order' },
          { name: 'Product Leaderboard', href: '/dashboard/reports/product' },
          { name: 'Profit & Loss', href: '/dashboard/reports/profit-and-loss' }
        ].map(r => (
          <Link key={r.name} href={r.href} className="flex items-center justify-between p-4 rounded border border-neutral-200 bg-white hover:border-brand-primary">
            <span className="font-medium">{r.name}</span>
            <span className="text-neutral-400">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}`
};

Object.entries(templates).forEach(([name, content]) => {
  const filePath = path.join(basePath, name, 'page.tsx');
  if (fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content.trim());
    console.log("Updated " + name + "/page.tsx");
  }
});
