'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { fetchOrders, updateOrderStatus, type Order } from '@/lib/api';

const STATUS_OPTIONS = [
  'CONFIRMED',
  'PROCESSING',
  'PICKED',
  'PACKED',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
] as const;

const NEXT_STATUS: Record<string, string[]> = {
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['PICKED', 'CANCELLED'],
  PICKED: ['PACKED'],
  PACKED: ['SHIPPED'],
  SHIPPED: ['DELIVERED'],
};

function formatPrice(cents: number, currency = 'INR') {
  return (cents / 100).toLocaleString('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });
}

export default function OrdersPage(): React.JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatus = async (orderId: string, status: string) => {
    setUpdating(orderId);
    try {
      await updateOrderStatus(orderId, status);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Orders</h1>
      <p className="mt-2 text-sm text-neutral-600">Manage customer orders and fulfillment status.</p>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      {loading ? (
        <p className="mt-8 text-sm text-neutral-500">Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">No orders yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-neutral-200">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const next = NEXT_STATUS[order.status] ?? [];
                return (
                  <tr key={order.id} className="border-b border-neutral-100">
                    <td className="px-4 py-3">
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-xs text-neutral-500">
                        {new Date(order.createdAt).toLocaleString('en-IN')}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{order.user?.email ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-brand-accent-light px-2 py-0.5 text-xs font-medium text-brand-primary">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {formatPrice(order.totalCents, order.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {next.map((status) => (
                          <button
                            key={status}
                            type="button"
                            disabled={updating === order.id}
                            onClick={() => handleStatus(order.id, status)}
                            className="rounded border border-neutral-300 px-2 py-1 text-xs hover:border-brand-primary disabled:opacity-50"
                          >
                            → {status}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <details className="mt-6 text-xs text-neutral-500">
        <summary>All status values</summary>
        <p className="mt-2">{STATUS_OPTIONS.join(' · ')}</p>
      </details>
    </div>
  );
}
