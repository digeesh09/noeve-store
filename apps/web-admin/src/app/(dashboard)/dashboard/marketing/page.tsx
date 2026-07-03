'use client';

import React, { useEffect, useState } from 'react';
import { fetchMarketingSubscribers, toggleMarketingSubscriber, deleteMarketingSubscriber } from '@/lib/api';
import { apiClient } from '@/lib/api';
import { Pagination } from '@/components/Pagination';

type NewsletterSubscriber = {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
};

export default function MarketingPage(): React.JSX.Element {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [campaignSubject, setCampaignSubject] = useState('');
  const [campaignHtml, setCampaignHtml] = useState('');
  const [sendingCampaign, setSendingCampaign] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = async () => {
    setError(null);
    try {
      const res = await fetchMarketingSubscribers(page, 20);
      setSubscribers(res.data);
      setTotalPages(res.meta?.totalPages || 1);
    } catch (err: any) {
      setError(err.message || 'Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page]);

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      await toggleMarketingSubscriber(id, !currentStatus);
      await load();
    } catch (err: any) {
      setError(err.message || 'Failed to update subscriber');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return;
    try {
      await deleteMarketingSubscriber(id);
      await load();
    } catch (err: any) {
      setError(err.message || 'Failed to delete subscriber');
    }
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Email', 'Status', 'Subscribed At'],
      ...subscribers.map(sub => [
        sub.email,
        sub.isActive ? 'Active' : 'Unsubscribed',
        new Date(sub.createdAt).toLocaleDateString()
      ])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "subscribers.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Marketing</h1>
          <p className="mt-2 text-sm text-neutral-600">Manage your newsletter subscribers and send campaigns.</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsCreatingCampaign(!isCreatingCampaign)}
            className="rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary/90"
          >
            {isCreatingCampaign ? 'Cancel' : 'New Campaign'}
          </button>
          <button
            onClick={handleExportCSV}
            className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Export CSV
          </button>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {isCreatingCampaign && (
        <form onSubmit={async (e) => {
          e.preventDefault();
          setSendingCampaign(true);
          try {
            const res = await apiClient.admin.sendMarketingCampaign({ subject: campaignSubject, html: campaignHtml });
            const count = (res as any).count ?? (res as any).data?.count ?? 0;
            alert(`Campaign successfully sent to ${count} active subscribers!`);
            setIsCreatingCampaign(false);
            setCampaignSubject('');
            setCampaignHtml('');
          } catch(err: any) {
            setError(err.message || 'Failed to send campaign');
          } finally {
            setSendingCampaign(false);
          }
        }} className="mt-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700">Campaign Subject</label>
              <input required type="text" placeholder="e.g. Our new Winter Collection is here!" value={campaignSubject} onChange={e => setCampaignSubject(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Email HTML Body</label>
              <textarea required rows={5} placeholder="<h1>Hello!</h1><p>Check out our latest drops.</p>" value={campaignHtml} onChange={e => setCampaignHtml(e.target.value)} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm sm:text-sm" />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" disabled={sendingCampaign} className="rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary/90 disabled:opacity-50">
              {sendingCampaign ? 'Sending...' : 'Send to all Active Subscribers'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="mt-8 text-sm text-neutral-500">Loading subscribers…</p>
      ) : subscribers.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">No subscribers found.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-neutral-200">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50">
              <tr>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Subscribed At</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub.id} className="border-b border-neutral-100">
                  <td className="px-4 py-3">
                    <p className="font-medium">{sub.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${sub.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {sub.isActive ? 'Active' : 'Unsubscribed'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-500">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button 
                      onClick={() => handleToggle(sub.id, sub.isActive)} 
                      className="text-sm font-medium text-brand-primary hover:underline"
                    >
                      {sub.isActive ? 'Unsubscribe' : 'Resubscribe'}
                    </button>
                    <button 
                      onClick={() => handleDelete(sub.id)} 
                      className="text-sm font-medium text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
