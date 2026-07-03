'use client';

import React, { useEffect, useState } from 'react';
import { fetchCrmCustomers } from '@/lib/api';
import Link from 'next/link';

export default function CrmPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadCustomers = (searchQuery = '') => {
    setLoading(true);
    fetchCrmCustomers(1, 20, searchQuery)
      .then((res) => {
        setCustomers(res.data);
        setMeta(res.meta);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadCustomers(search);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold text-neutral-900">Customer Relationship Management</h1>
          <button 
            onClick={() => loadCustomers(search)}
            disabled={loading}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:opacity-50"
            title="Refresh Customers"
          >
            <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-neutral-200">
        <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="rounded-md bg-brand-primary px-4 py-2 text-sm text-white hover:bg-brand-primary-dark">
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-sm text-neutral-500">Loading customers...</div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Total Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Support Tickets</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white">
              {customers.map((c) => (
                <tr key={c.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-neutral-900">
                    {c.firstName} {c.lastName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">{c.email}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">{c._count?.orders || 0}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">{c._count?.supportTickets || 0}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <Link href={`/dashboard/crm/${c.id}`} className="text-brand-primary hover:underline">
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-neutral-500">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {meta && (
            <div className="bg-neutral-50 px-6 py-3 text-sm text-neutral-500 border-t border-neutral-200">
              Showing {customers.length} of {meta.total} customers
            </div>
          )}
        </div>
      )}
    </div>
  );
}
