'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { fetchOrders, updateOrderStatus, type Order } from '@/lib/api';
import { Pagination } from '@/components/Pagination';
import { useSearchParams, useRouter } from 'next/navigation';

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialStatus = searchParams.get('status') || '';
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [openOrder, setOpenOrder] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [filterStatus, setFilterStatus] = useState<string>(initialStatus);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await fetchOrders(filterStatus || undefined, page);
      setOrders(res.data);
      setTotalPages(res.meta.totalPages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus]);

  useEffect(() => {
    load();
  }, [load]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFilterStatus(val);
    setPage(1);
    
    // Update URL without reloading page
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set('status', val);
    } else {
      params.delete('status');
    }
    router.replace(`/dashboard/orders?${params.toString()}`);
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Orders</h1>
          <p className="mt-2 text-sm text-neutral-600">Manage customer orders and fulfillment status.</p>
        </div>
        <select 
          value={filterStatus}
          onChange={handleFilterChange}
          className="rounded-md border-neutral-300 py-1.5 pl-3 pr-8 text-sm shadow-sm focus:border-brand-primary focus:ring-brand-primary"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

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
                const isOpen = openOrder === order.id;
                return (
                  <React.Fragment key={order.id}>
                  <tr className="border-b border-neutral-100 hover:bg-neutral-50/50 cursor-pointer" onClick={() => setOpenOrder(isOpen ? null : order.id)}>
                    <td className="px-4 py-3">
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-xs text-neutral-500">
                        {new Date(order.createdAt).toLocaleString('en-IN')}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      <div>{order.user?.firstName} {order.user?.lastName}</div>
                      <div className="text-xs text-neutral-500">{order.user?.email ?? '—'}</div>
                    </td>
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
                            onClick={(e) => { e.stopPropagation(); handleStatus(order.id, status); }}
                            className="rounded border border-neutral-300 px-2 py-1 text-xs hover:border-brand-primary disabled:opacity-50"
                          >
                            → {status}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr className="border-b border-neutral-200 bg-neutral-50/30">
                      <td colSpan={5} className="px-4 py-4">
                        <div className="flex flex-col md:flex-row gap-8">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-2 text-neutral-800">Items</h4>
                            <div className="space-y-2">
                              {order.lines?.map((line, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                  <span className="text-neutral-600">{line.quantity} × {line.productName}</span>
                                  <span className="font-medium">{formatPrice(line.lineTotalCents, order.currency)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-2 text-neutral-800">Financial Summary</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between"><span className="text-neutral-500">Subtotal:</span><span>{formatPrice(order.subtotalCents, order.currency)}</span></div>
                              <div className="flex justify-between"><span className="text-neutral-500">Shipping:</span><span>{formatPrice(order.shippingCents, order.currency)}</span></div>
                              <div className="flex justify-between"><span className="text-neutral-500">Tax:</span><span>{formatPrice(order.taxCents, order.currency)}</span></div>
                              {(order.discountCents ?? 0) > 0 && (
                                <div className="flex justify-between text-brand-primary"><span className="text-neutral-500">Discount:</span><span>-{formatPrice(order.discountCents || 0, order.currency)}</span></div>
                              )}
                              <div className="flex justify-between font-semibold pt-1 mt-1 border-t border-neutral-200">
                                <span>Total:</span><span>{formatPrice(order.totalCents, order.currency)}</span>
                              </div>
                            </div>
                            
                            <h4 className="font-semibold text-sm mb-2 mt-6 text-neutral-800">Shipping Address</h4>
                            {order.user?.addresses?.[0] ? (
                              <div className="text-sm text-neutral-600 space-y-1">
                                <p className="font-medium text-neutral-800">{order.user.addresses[0].name}</p>
                                <p>{order.user.addresses[0].streetLine1}</p>
                                {order.user.addresses[0].streetLine2 && <p>{order.user.addresses[0].streetLine2}</p>}
                                <p>{order.user.addresses[0].city}, {order.user.addresses[0].state} {order.user.addresses[0].postalCode}</p>
                                <p>{order.user.addresses[0].country}</p>
                                <p className="mt-1">Phone: {order.user.addresses[0].phone}</p>
                              </div>
                            ) : (
                              <p className="text-sm text-neutral-400 italic">No default address found</p>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-2 text-neutral-800">Tracking Info</h4>
                            {order.trackingNumber ? (
                              <p className="text-sm text-neutral-600">{order.carrier} - {order.trackingNumber}</p>
                            ) : (
                              <p className="text-sm text-neutral-400 italic">No tracking info provided</p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  </React.Fragment>
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
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
