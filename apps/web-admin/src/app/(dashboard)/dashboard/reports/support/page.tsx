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
}