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

  const openTickets = tickets.filter(t => t.status === 'OPEN').sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const resolvedTickets = tickets.filter(t => t.status === 'RESOLVED').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const totalReplies = tickets.reduce((sum, t) => sum + (t.replies?.length || 0), 0);
  const avgReplies = tickets.length ? (totalReplies / tickets.length).toFixed(1) : '0';

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Support Report & Tracking</h1>
      
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-neutral-200 bg-white p-6 border-l-4 border-l-amber-500 shadow-sm">
          <p className="text-sm font-medium text-neutral-500">Open Tickets</p>
          <p className="mt-2 text-3xl font-semibold text-neutral-900">{openTickets.length}</p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-6 border-l-4 border-l-emerald-500 shadow-sm">
          <p className="text-sm font-medium text-neutral-500">Resolved</p>
          <p className="mt-2 text-3xl font-semibold text-neutral-900">{resolvedTickets.length}</p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-neutral-500">Total Inquiries</p>
          <p className="mt-2 text-3xl font-semibold text-neutral-900">{tickets.length}</p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-neutral-500">Avg Replies / Ticket</p>
          <p className="mt-2 text-3xl font-semibold text-neutral-900">{avgReplies}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-700">Action Required: Oldest Open Tickets</h2>
          </div>
          <div className="flex-1 overflow-auto max-h-[400px]">
            <table className="min-w-full divide-y divide-neutral-200 text-sm">
              <tbody className="divide-y divide-neutral-100">
                {openTickets.slice(0, 5).map((t) => (
                  <tr key={t.id} className="hover:bg-amber-50">
                    <td className="px-6 py-4 font-medium text-neutral-900">{t.name}</td>
                    <td className="px-6 py-4 text-neutral-600 max-w-[200px] truncate">{t.subject}</td>
                    <td className="px-6 py-4 text-neutral-500 text-right whitespace-nowrap">{new Date(t.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {openTickets.length === 0 && (
                  <tr><td colSpan={3} className="px-6 py-8 text-center text-neutral-400">No open tickets. Great job!</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-700">Recently Resolved</h2>
          </div>
          <div className="flex-1 overflow-auto max-h-[400px]">
            <table className="min-w-full divide-y divide-neutral-200 text-sm">
              <tbody className="divide-y divide-neutral-100">
                {resolvedTickets.slice(0, 5).map((t) => (
                  <tr key={t.id} className="hover:bg-emerald-50">
                    <td className="px-6 py-4 font-medium text-neutral-900">{t.name}</td>
                    <td className="px-6 py-4 text-neutral-600 max-w-[200px] truncate">{t.subject}</td>
                    <td className="px-6 py-4 text-neutral-500 text-right whitespace-nowrap">
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        Resolved
                      </span>
                    </td>
                  </tr>
                ))}
                {resolvedTickets.length === 0 && (
                  <tr><td colSpan={3} className="px-6 py-8 text-center text-neutral-400">No resolved tickets yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}