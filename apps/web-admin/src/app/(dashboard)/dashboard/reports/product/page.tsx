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
}