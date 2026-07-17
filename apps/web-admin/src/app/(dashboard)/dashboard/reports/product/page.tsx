'use client';
import React, { useEffect, useState } from 'react';
import { fetchReportsData } from '@/lib/api';

export default function ProductReportPage() {
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const formatPrice = (cents: number, currency = 'INR') => 
    (cents / 100).toLocaleString('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 });

  const [heatmapData, setHeatmapData] = useState<{ months: string[]; products: string[]; data: Record<string, Record<string, number>> } | null>(null);

  useEffect(() => {
    Promise.all([
      fetchReportsData('top-products'),
      fetchReportsData('product-heatmap')
    ])
      .then(([topRes, heatmapRes]) => {
        setTopProducts(Array.isArray(topRes?.data) ? topRes.data : Array.isArray(topRes) ? topRes : []);
        setHeatmapData(heatmapRes);
      })
      .catch(() => {
        setTopProducts([]);
        setHeatmapData(null);
      })
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
      <section className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium mb-4 text-neutral-900">Product Heat Map (Monthly Sales Trend)</h2>
        {heatmapData && heatmapData.products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-xs text-center">
              <thead>
                <tr>
                  <th className="border border-neutral-200 p-2 bg-neutral-50 text-left font-medium text-neutral-500">
                    Product \ Month
                  </th>
                  {heatmapData.months.map((m) => {
                    const d = new Date(`${m}-01`);
                    return (
                      <th key={m} className="border border-neutral-200 p-2 bg-neutral-50 font-medium text-neutral-500 min-w-[60px]">
                        {d.toLocaleString('en-US', { month: 'short', year: 'numeric' })}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {heatmapData.products.map((productName) => (
                  <tr key={productName}>
                    <td className="border border-neutral-200 p-2 text-left font-medium whitespace-nowrap text-neutral-900">
                      {productName}
                    </td>
                    {heatmapData.months.map((month) => {
                      const count = heatmapData.data[productName]?.[month] || 0;
                      // Maximum opacity at 10+ items for visibility
                      const alpha = Math.min(count * 0.15, 1);
                      return (
                        <td
                          key={month}
                          className="border border-neutral-200 p-2 font-medium"
                          style={{
                            backgroundColor: count > 0 ? `rgba(244, 63, 94, ${alpha})` : 'transparent', // Rose color for product heatmap
                            color: count > 0 && alpha > 0.5 ? 'white' : 'inherit',
                          }}
                          title={`${count} units sold in ${month}`}
                        >
                          {count > 0 ? count : ''}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-xs text-neutral-500">
              Note: This heatmap shows product sales volume over the last 6 months. Darker colors indicate higher sales volume.
            </p>
          </div>
        ) : (
          <p className="text-sm text-neutral-500">No heatmap data available.</p>
        )}
      </section>
    </div>
  );
}