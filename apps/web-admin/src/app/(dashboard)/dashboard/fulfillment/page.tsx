'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { fetchOrders, updateOrderStatus, type Order } from '@/lib/api';
import { Pagination } from '@/components/Pagination';

export default function FulfillmentPage(): React.JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('PROCESSING');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Print Label state
  const [labelOrder, setLabelOrder] = useState<Order | null>(null);
  
  // Tracking form state
  const [shippingOrderId, setShippingOrderId] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchOrders(statusFilter, page, 20);
      setOrders(res.data);
      setTotalPages(res.meta.totalPages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus, 'Status updated via Fulfillment');
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleShipOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingOrderId) return;
    setUpdatingId(shippingOrderId);
    try {
      await updateOrderStatus(shippingOrderId, 'SHIPPED', 'Order shipped', trackingNumber, carrier);
      setShippingOrderId(null);
      setTrackingNumber('');
      setCarrier('');
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to ship order');
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePrintLabel = (order: Order) => {
    setLabelOrder(order);
    setTimeout(() => {
      window.print();
      // Optional: delay clearing to allow print dialog to open, though most browsers block JS during print dialog anyway.
      setTimeout(() => setLabelOrder(null), 1000);
    }, 100);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Fulfillment Center</h1>
          <p className="mt-2 text-sm text-neutral-600">Track and manage the pick-pack-ship workflow.</p>
        </div>
        <div className="flex gap-4">
          <select 
            value={statusFilter} 
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="block rounded-md border-neutral-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
          >
            <option value="PROCESSING">Processing (To Pick)</option>
            <option value="PICKED">Picked (To Pack)</option>
            <option value="PACKED">Packed (To Ship)</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="">All Orders</option>
          </select>
        </div>
      </div>

      {error ? <p className="text-sm text-red-600 mb-4">{error}</p> : null}

      {loading ? (
        <p className="text-sm text-neutral-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-8 text-center text-sm text-neutral-500">
          No orders found for the current filter.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                  <p className="text-xs text-neutral-500">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <span className="inline-flex rounded-full bg-brand-primary/10 px-2.5 py-0.5 text-xs font-semibold text-brand-primary">
                  {order.status}
                </span>
              </div>

              <div className="text-sm mb-4 flex-grow">
                <p className="font-medium text-neutral-700 mb-1">Items:</p>
                <ul className="list-disc pl-5 text-neutral-600 space-y-1 mb-4">
                  {order.lines.map(line => (
                    <li key={line.id}>{line.quantity}x {line.productName} {line.sku ? `(${line.sku})` : ''}</li>
                  ))}
                </ul>
                
                {order.user?.addresses && order.user.addresses.length > 0 && (
                  <div className="mt-4 border-t pt-4">
                    <p className="font-medium text-neutral-700 mb-1">Shipping To:</p>
                    <p className="text-neutral-600">
                      {order.user.addresses[0].name}<br/>
                      {order.user.addresses[0].streetLine1} {order.user.addresses[0].streetLine2}<br/>
                      {order.user.addresses[0].city}, {order.user.addresses[0].state} {order.user.addresses[0].postalCode}<br/>
                      {order.user.addresses[0].phone}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-auto border-t pt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => handlePrintLabel(order)}
                  className="rounded bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-200"
                >
                  Print Label
                </button>
                
                {order.status === 'PROCESSING' && (
                  <button
                    disabled={updatingId === order.id}
                    onClick={() => handleUpdateStatus(order.id, 'PICKED')}
                    className="rounded bg-brand-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-primary/90 disabled:opacity-50"
                  >
                    Mark Picked
                  </button>
                )}
                
                {order.status === 'PICKED' && (
                  <button
                    disabled={updatingId === order.id}
                    onClick={() => handleUpdateStatus(order.id, 'PACKED')}
                    className="rounded bg-brand-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-primary/90 disabled:opacity-50"
                  >
                    Mark Packed
                  </button>
                )}
                
                {order.status === 'PACKED' && (
                  <button
                    onClick={() => setShippingOrderId(order.id)}
                    className="rounded bg-brand-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-primary/90"
                  >
                    Ship Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6">
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {/* Shipping Modal */}
      {shippingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Shipping Details</h2>
            <form onSubmit={handleShipOrder}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700">Carrier</label>
                  <input
                    type="text"
                    required
                    value={carrier}
                    onChange={e => setCarrier(e.target.value)}
                    placeholder="e.g. FedEx, BlueDart, Delhivery"
                    className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700">Tracking Number</label>
                  <input
                    type="text"
                    required
                    value={trackingNumber}
                    onChange={e => setTrackingNumber(e.target.value)}
                    className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShippingOrderId(null)}
                  className="rounded-md px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingId === shippingOrderId}
                  className="rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary/90 disabled:opacity-50"
                >
                  {updatingId === shippingOrderId ? 'Saving...' : 'Confirm Shipment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print Label Container (Hidden unless printing) */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; }
          #print-label, #print-label * { visibility: visible; }
          #print-label { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}} />
      <div id="print-label" className="absolute top-0 left-0 w-[400px] bg-white p-8 hidden print:block border-2 border-black m-4">
        {labelOrder && (
          <div className="text-black text-sm">
            <div className="border-b-2 border-black pb-4 mb-4 text-center">
              <h2 className="text-2xl font-bold tracking-widest uppercase">NOEVE</h2>
              <p className="text-xs">Premium Jewellery</p>
            </div>
            
            <div className="mb-6 flex justify-between items-end">
              <div>
                <p className="font-bold">SHIP TO:</p>
                {labelOrder.user?.addresses?.[0] ? (
                  <p className="mt-1 uppercase">
                    {labelOrder.user.addresses[0].name}<br/>
                    {labelOrder.user.addresses[0].streetLine1}<br/>
                    {labelOrder.user.addresses[0].streetLine2 && <>{labelOrder.user.addresses[0].streetLine2}<br/></>}
                    {labelOrder.user.addresses[0].city}, {labelOrder.user.addresses[0].state}<br/>
                    {labelOrder.user.addresses[0].postalCode}<br/>
                    PHONE: {labelOrder.user.addresses[0].phone}
                  </p>
                ) : (
                  <p className="mt-1 italic">Address not available</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">{labelOrder.orderNumber}</p>
                <p className="text-xs">{new Date(labelOrder.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="border-t-2 border-black pt-4">
              <p className="font-bold mb-2">CONTENTS:</p>
              <ul className="list-none p-0 m-0">
                {labelOrder.lines.map(line => (
                  <li key={line.id} className="flex justify-between border-b border-gray-200 py-1 text-xs">
                    <span className="pr-4">{line.quantity}x {line.productName}</span>
                    <span className="font-mono">{line.sku}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-8 text-center border-2 border-black p-4">
              <p className="text-xs font-bold mb-1">SCAN ORDER</p>
              {/* Fake barcode block */}
              <div className="h-12 w-full bg-[repeating-linear-gradient(90deg,#000,#000_2px,transparent_2px,transparent_5px,#000_5px,#000_8px,transparent_8px,transparent_11px)]" />
              <p className="text-[10px] mt-1 font-mono">{labelOrder.orderNumber}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
