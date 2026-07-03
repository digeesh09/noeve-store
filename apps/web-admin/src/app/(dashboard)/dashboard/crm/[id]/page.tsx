'use client';

import React, { useEffect, useState } from 'react';
import { fetchCrmCustomerInsights } from '@/lib/api';
import Link from 'next/link';

export default function CustomerInsightsPage({ params }: { params: Promise<{ id: string }> }) {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const resolvedParams = React.use(params);

  useEffect(() => {
    fetchCrmCustomerInsights(resolvedParams.id)
      .then(setInsights)
      .finally(() => setLoading(false));
  }, [resolvedParams.id]);

  const formatPrice = (cents: number) => (cents / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

  if (loading) return <div className="p-8 text-neutral-500">Loading insights...</div>;
  if (!insights) return <div className="p-8 text-red-500">Customer not found or error loading data.</div>;

  return (
    <div className="space-y-8">
      <div>
        <Link href="/dashboard/crm" className="text-sm text-brand-primary hover:underline mb-2 inline-block">
          &larr; Back to Customers
        </Link>
        <h1 className="text-2xl font-semibold text-neutral-900">Customer Insights</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-neutral-200 bg-white p-6">
          <p className="text-sm text-neutral-500">Lifetime Value (LTV)</p>
          <p className="mt-2 text-3xl font-semibold text-brand-primary">
            {formatPrice(insights.lifetimeValueCents || 0)}
          </p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-6">
          <p className="text-sm text-neutral-500">Total Orders</p>
          <p className="mt-2 text-3xl font-semibold text-neutral-900">
            {insights.totalOrders || 0}
          </p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-6">
          <p className="text-sm text-neutral-500">Avg Order Value</p>
          <p className="mt-2 text-3xl font-semibold text-neutral-900">
            {formatPrice(insights.averageOrderValueCents || 0)}
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <section>
          <h2 className="text-xl font-medium mb-4">Recent Support Tickets</h2>
          <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
            <ul className="divide-y divide-neutral-200">
              {insights.recentTickets?.map((ticket: any) => (
                <li key={ticket.id} className="p-4 hover:bg-neutral-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{ticket.subject}</p>
                      <p className="text-xs text-neutral-500 line-clamp-2 mt-1">{ticket.message}</p>
                    </div>
                    <span className="ml-2 inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-800">
                      {ticket.status}
                    </span>
                  </div>
                </li>
              ))}
              {(!insights.recentTickets || insights.recentTickets.length === 0) && (
                <li className="p-4 text-sm text-neutral-500 text-center">No recent tickets</li>
              )}
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">Recent Reviews</h2>
          <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
            <ul className="divide-y divide-neutral-200">
              {insights.recentReviews?.map((review: any) => (
                <li key={review.id} className="p-4 hover:bg-neutral-50">
                  <div className="flex items-center justify-between">
                    <div className="flex text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-neutral-300'}>★</span>
                      ))}
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${review.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-800'}`}>
                      {review.status}
                    </span>
                  </div>
                  {review.comment && <p className="mt-2 text-sm text-neutral-600 italic">"{review.comment}"</p>}
                </li>
              ))}
              {(!insights.recentReviews || insights.recentReviews.length === 0) && (
                <li className="p-4 text-sm text-neutral-500 text-center">No recent reviews</li>
              )}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
