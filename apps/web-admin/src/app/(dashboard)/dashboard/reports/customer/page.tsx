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
}