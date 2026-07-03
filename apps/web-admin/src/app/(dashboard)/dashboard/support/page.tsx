'use client';

import React, { useEffect, useState } from 'react';
import { fetchSupportTickets, updateSupportTicketStatus } from '@/lib/api';

export default function SupportAdminPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const res = await fetchSupportTickets(1, 100);
      setTickets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateSupportTicketStatus(id, status);
      await loadTickets();
    } catch (err) {
      console.error(err);
      alert('Failed to update ticket status');
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading support tickets...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-sm text-gray-500 mt-1">Manage customer inquiries and support requests.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 border-b">
            <tr>
              <th className="p-4 font-medium">Customer</th>
              <th className="p-4 font-medium">Subject</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No support tickets found.
                </td>
              </tr>
            ) : (
              tickets.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{t.name}</div>
                    <div className="text-gray-500">{t.email}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{t.subject}</div>
                    <div className="text-xs text-gray-500 max-w-xs truncate">{t.message}</div>
                  </td>
                  <td className="p-4 text-gray-500 whitespace-nowrap">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        t.status === 'OPEN'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {t.status === 'OPEN' ? (
                      <button
                        onClick={() => updateStatus(t.id, 'RESOLVED')}
                        className="text-sm text-blue-600 hover:text-blue-900 font-medium"
                      >
                        Mark Resolved
                      </button>
                    ) : (
                      <button
                        onClick={() => updateStatus(t.id, 'OPEN')}
                        className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                      >
                        Reopen
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
