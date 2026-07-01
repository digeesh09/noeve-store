'use client';

import React, { useEffect, useState } from 'react';
import { fetchPromotions, createPromotion, deletePromotion, type Promotion } from '@/lib/api';

function formatPrice(cents: number, currency = 'INR') {
  return (cents / 100).toLocaleString('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });
}

export default function PromotionsPage(): React.JSX.Element {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountPercentage: '',
    discountAmount: '',
    minOrderValue: '0',
  });

  const load = async () => {
    setError(null);
    try {
      const data = await fetchPromotions();
      setPromotions(data);
    } catch (err) {
      setError('Failed to load promotions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPromotion({
        code: formData.code.toUpperCase(),
        description: formData.description,
        discountPercentage: formData.discountPercentage ? Number(formData.discountPercentage) : undefined,
        discountCents: formData.discountAmount ? Math.round(Number(formData.discountAmount) * 100) : undefined,
        minOrderValue: Math.round(Number(formData.minOrderValue) * 100),
      });
      setIsCreating(false);
      setFormData({ code: '', description: '', discountPercentage: '', discountAmount: '', minOrderValue: '0' });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create promotion');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promotion?')) return;
    try {
      await deletePromotion(id);
      await load();
    } catch (err) {
      setError('Failed to delete promotion');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Promotions</h1>
          <p className="mt-2 text-sm text-neutral-600">Create discount codes for your customers.</p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary/90"
        >
          {isCreating ? 'Cancel' : 'New Promotion'}
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {isCreating && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-neutral-700">Code</label>
              <input required type="text" placeholder="e.g. SUMMER20" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Description</label>
              <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Discount % (Optional)</label>
              <input type="number" placeholder="20" value={formData.discountPercentage} onChange={e => setFormData({...formData, discountPercentage: e.target.value})} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Fixed Discount Amount (Optional)</label>
              <input type="number" step="0.01" placeholder="5.00" value={formData.discountAmount} onChange={e => setFormData({...formData, discountAmount: e.target.value})} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Minimum Order Value</label>
              <input required type="number" step="0.01" value={formData.minOrderValue} onChange={e => setFormData({...formData, minOrderValue: e.target.value})} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm sm:text-sm" />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary/90">
              Save Promotion
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="mt-8 text-sm text-neutral-500">Loading...</p>
      ) : promotions.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">No promotions yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-neutral-200">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50">
              <tr>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Discount</th>
                <th className="px-4 py-3 font-medium">Min Order</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promo) => (
                <tr key={promo.id} className="border-b border-neutral-100">
                  <td className="px-4 py-3 font-medium">{promo.code}</td>
                  <td className="px-4 py-3 text-neutral-600">{promo.description || '-'}</td>
                  <td className="px-4 py-3">
                    {promo.discountPercentage ? `${promo.discountPercentage}%` : ''}
                    {promo.discountPercentage && promo.discountCents ? ' OR ' : ''}
                    {promo.discountCents ? formatPrice(promo.discountCents) : ''}
                  </td>
                  <td className="px-4 py-3">{formatPrice(promo.minOrderValue)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(promo.id)} className="text-sm font-medium text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
