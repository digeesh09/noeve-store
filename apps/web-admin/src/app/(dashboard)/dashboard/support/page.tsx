'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  fetchSupportTickets,
  fetchSupportTicket,
  updateSupportTicketStatus,
  addSupportTicketReply,
} from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Reply {
  id: string;
  message: string;
  isAdmin: boolean;
  createdAt: string;
}

interface Ticket {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  replies: Reply[];
}

// ─── Status badge helper ───────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  OPEN: 'bg-amber-100 text-amber-800',
  RESOLVED: 'bg-emerald-100 text-emerald-800',
  CLOSED: 'bg-neutral-100 text-neutral-600',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        STATUS_STYLES[status] ?? 'bg-neutral-100 text-neutral-600'
      }`}
    >
      {status}
    </span>
  );
}

// ─── Detail Drawer ─────────────────────────────────────────────────────────────

function TicketDrawer({
  ticket,
  onClose,
  onStatusChange,
  onReplyAdded,
}: {
  ticket: Ticket;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
  onReplyAdded: (id: string) => void;
}) {
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const threadEndRef = useRef<HTMLDivElement>(null);

  // Scroll conversation to bottom when new replies appear
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket.replies]);

  const handleSendReply = async () => {
    const msg = reply.trim();
    if (!msg) return;
    setSending(true);
    try {
      await addSupportTicketReply(ticket.id, msg);
      setReply('');
      onReplyAdded(ticket.id);
    } catch (err) {
      console.error(err);
      alert('Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const handleStatusToggle = async () => {
    const next = ticket.status === 'OPEN' ? 'RESOLVED' : 'OPEN';
    
    if (next === 'RESOLVED') {
      const confirmClose = window.confirm('Are you sure you want to close this ticket?');
      if (!confirmClose) return;
    }

    setUpdatingStatus(true);
    try {
      await updateSupportTicketStatus(ticket.id, next);
      onStatusChange(ticket.id, next);
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-200 px-6 py-4">
          <div className="min-w-0 flex-1 pr-4">
            <div className="flex items-center gap-2">
              <StatusBadge status={ticket.status} />
              <span className="text-xs text-neutral-400">
                {new Date(ticket.createdAt).toLocaleString()}
              </span>
            </div>
            <h2 className="mt-1 truncate text-lg font-semibold text-neutral-900">
              {ticket.subject}
            </h2>
            <p className="text-sm text-neutral-500">
              {ticket.name}{' '}
              <a
                href={`mailto:${ticket.email}`}
                className="text-violet-600 hover:underline"
              >
                &lt;{ticket.email}&gt;
              </a>
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-2 rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Conversation thread */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Original customer message */}
          <div className="flex gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xs font-bold text-neutral-600">
              {ticket.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-sm font-medium text-neutral-800">{ticket.name}</span>
                <span className="text-xs text-neutral-400">
                  {new Date(ticket.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="rounded-2xl rounded-tl-none bg-neutral-100 px-4 py-3 text-sm text-neutral-700 whitespace-pre-wrap">
                {ticket.message}
              </div>
            </div>
          </div>

          {/* Replies */}
          {ticket.replies.map((r) => (
            <div key={r.id} className={`flex gap-3 ${r.isAdmin ? 'flex-row-reverse' : ''}`}>
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  r.isAdmin
                    ? 'bg-violet-600 text-white'
                    : 'bg-neutral-200 text-neutral-600'
                }`}
              >
                {r.isAdmin ? 'A' : ticket.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className={`mb-1 flex items-center gap-2 ${r.isAdmin ? 'justify-end' : ''}`}>
                  <span className="text-sm font-medium text-neutral-800">
                    {r.isAdmin ? 'Admin' : ticket.name}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {new Date(r.createdAt).toLocaleString()}
                  </span>
                </div>
                <div
                  className={`rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                    r.isAdmin
                      ? 'rounded-tr-none bg-violet-600 text-white'
                      : 'rounded-tl-none bg-neutral-100 text-neutral-700'
                  }`}
                >
                  {r.message}
                </div>
              </div>
            </div>
          ))}
          <div ref={threadEndRef} />
        </div>

        {/* Reply box */}
        <div className="border-t border-neutral-200 px-6 py-4 space-y-3">
          <textarea
            rows={3}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type your reply…"
            className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-800 outline-none placeholder:text-neutral-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSendReply();
            }}
          />
          <div className="flex items-center justify-between">
            <button
              onClick={handleStatusToggle}
              disabled={updatingStatus}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                ticket.status === 'OPEN'
                  ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  : 'border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
              } disabled:opacity-60`}
            >
              {updatingStatus
                ? 'Updating…'
                : ticket.status === 'OPEN'
                ? '✓ Mark Resolved'
                : '↩ Reopen Ticket'}
            </button>
            <button
              onClick={handleSendReply}
              disabled={sending || !reply.trim()}
              className="flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 disabled:opacity-50"
            >
              {sending ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Sending…
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send Reply
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-neutral-400">Tip: Ctrl/⌘ + Enter to send quickly.</p>
        </div>
      </aside>
    </>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

import { useSearchParams } from 'next/navigation';

export default function SupportAdminPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  const searchParams = useSearchParams();
  const ticketIdParam = searchParams.get('ticketId');

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const res = await fetchSupportTickets(1, 100);
      setTickets(res.data);
      
      if (ticketIdParam) {
        const t = res.data.find((x: Ticket) => x.id === ticketIdParam);
        if (t && !selectedTicket) {
          openTicket(t);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openTicket = async (t: Ticket) => {
    setDrawerLoading(true);
    setSelectedTicket(t); // show immediately with existing data
    try {
      const fresh = await fetchSupportTicket(t.id);
      setSelectedTicket(fresh);
    } catch (err) {
      console.error(err);
    } finally {
      setDrawerLoading(false);
    }
  };

  const handleStatusChange = (id: string, status: string) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    setSelectedTicket((prev) => (prev?.id === id ? { ...prev, status } : prev));
  };

  const handleReplyAdded = async (id: string) => {
    try {
      const fresh = await fetchSupportTicket(id);
      setSelectedTicket(fresh);
      setTickets((prev) => prev.map((t) => (t.id === id ? fresh : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const displayed =
    statusFilter === 'ALL'
      ? tickets
      : tickets.filter((t) => t.status === statusFilter);

  const counts = {
    ALL: tickets.length,
    OPEN: tickets.filter((t) => t.status === 'OPEN').length,
    RESOLVED: tickets.filter((t) => t.status === 'RESOLVED').length,
  };

  return (
    <div className="p-8">
      {/* Page header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
            <button 
              onClick={() => { setLoading(true); loadTickets(); }}
              disabled={loading}
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:opacity-50"
              title="Refresh Tickets"
            >
              <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Manage customer inquiries — click any row to view details and reply.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 rounded-xl bg-neutral-100 p-1">
          {(['ALL', 'OPEN', 'RESOLVED'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {s}{' '}
              <span className="ml-1 rounded-full bg-neutral-200 px-1.5 py-0.5 text-xs font-semibold">
                {counts[s]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tickets table */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-sm text-gray-500">
          <svg className="mr-2 h-5 w-5 animate-spin text-violet-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          Loading tickets…
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Replies</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-gray-400">
                    No tickets found.
                  </td>
                </tr>
              ) : (
                displayed.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => openTicket(t)}
                    className="cursor-pointer transition-colors hover:bg-violet-50"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{t.name}</div>
                      <div className="text-xs text-gray-500">{t.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{t.subject}</div>
                      <div className="max-w-xs truncate text-xs text-gray-400">{t.message}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                        {t.replies?.length ?? 0}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={t.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Ticket detail drawer */}
      {selectedTicket && (
        <TicketDrawer
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onStatusChange={handleStatusChange}
          onReplyAdded={handleReplyAdded}
        />
      )}
    </div>
  );
}
