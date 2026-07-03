'use client';

import React, { useEffect, useState } from 'react';
import { fetchSettings, updateSettings } from '@/lib/api';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states (using standard units, e.g., rupees instead of cents)
  const [shippingThreshold, setShippingThreshold] = useState('');
  const [shippingRate, setShippingRate] = useState('');
  const [taxRate, setTaxRate] = useState('');
  const [marqueeText, setMarqueeText] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setError(null);
    try {
      setLoading(true);
      const data = await fetchSettings();
      // Convert cents to standard currency for display
      setShippingThreshold((data.shippingThresholdCents / 100).toString());
      setShippingRate((data.shippingRateCents / 100).toString());
      setTaxRate(data.taxRatePercentage.toString());
      setMarqueeText(data.marqueeText || '');
    } catch (err: any) {
      setError(err.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await updateSettings({
        shippingThresholdCents: Math.round(parseFloat(shippingThreshold || '0') * 100),
        shippingRateCents: Math.round(parseFloat(shippingRate || '0') * 100),
        taxRatePercentage: parseFloat(taxRate || '0'),
        marqueeText: marqueeText || null,
      });
      setSuccess('Settings updated successfully');
      await loadSettings();
    } catch (err: any) {
      setError(err.message || 'Failed to update settings');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>
        <p className="text-sm text-gray-500">Manage global rules for shipping and taxes.</p>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      {success && <p className="mb-4 text-sm text-green-600">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Shipping Rules</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Free Shipping Threshold (₹)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₹</span>
              </div>
              <input
                type="number"
                step="0.01"
                required
                value={shippingThreshold}
                onChange={(e) => setShippingThreshold(e.target.value)}
                className="pl-7 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="15000"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Orders above this amount qualify for free shipping.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Standard Shipping Rate (₹)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₹</span>
              </div>
              <input
                type="number"
                step="0.01"
                required
                value={shippingRate}
                onChange={(e) => setShippingRate(e.target.value)}
                className="pl-7 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="1000"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">The flat rate applied to orders below the free shipping threshold.</p>
          </div>
        </div>

        <div className="space-y-4 mt-8 pt-6 border-t">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Appearance</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Header Marquee Text
            </label>
            <textarea
              rows={3}
              value={marqueeText}
              onChange={(e) => setMarqueeText(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="e.g. THE NEW EDIT IS NOW LIVE. Separate messages with a newline."
            />
            <p className="mt-1 text-xs text-gray-500">
              The scrolling text displayed at the top of the store. If left blank, default text will be used.
            </p>
          </div>
        </div>

        <div className="space-y-4 mt-8 pt-6 border-t">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Tax Settings</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tax Rate Percentage (%)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                required
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="pr-7 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="18"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">%</span>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">The GST or tax rate applied during checkout.</p>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="bg-black text-white px-6 py-2 rounded font-medium hover:bg-gray-800 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
