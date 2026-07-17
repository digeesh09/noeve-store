'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { fetchOrders, type Order } from '@/lib/api';

export default function OrderReportPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch recent orders for the heatmap (limit to max 100 as per API rules)
    fetchOrders(undefined, 1, 100)
      .then((res) => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const ordersVsTimeData = useMemo(() => {
    const data: Record<string, Record<string, number>> = {};
    const days = 7;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString();
      data[dateStr] = {};
      for (let h = 0; h < 24; h++) {
        data[dateStr][`${h}:00`] = 0;
      }
    }

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const dateStr = date.toLocaleDateString();
      if (data[dateStr]) {
        const hour = date.getHours();
        data[dateStr][`${hour}:00`] += 1;
      }
    });
    return data;
  }, [orders]);

  const ordersVsDeliveryData = useMemo(() => {
    const data: Record<string, Record<string, number>> = {};
    const orderDates: string[] = [];
    const deliveryDatesSet = new Set<string>();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Rows: Last 7 days of order creation
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      orderDates.push(d.toLocaleDateString('en-IN'));
    }

    // Collect all delivery dates from orders
    orders.forEach((order) => {
      if (order.deliveryDate) {
        const d = new Date(order.deliveryDate);
        deliveryDatesSet.add(d.toLocaleDateString('en-IN'));
      }
    });

    // If no delivery dates exist, add a few future dates as placeholders
    if (deliveryDatesSet.size === 0) {
      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        deliveryDatesSet.add(d.toLocaleDateString('en-IN'));
      }
    }

    // Sort delivery dates
    const deliveryDates = Array.from(deliveryDatesSet).sort((a, b) => {
      const [d1, m1, y1] = a.split('/').map(Number);
      const [d2, m2, y2] = b.split('/').map(Number);
      return new Date(y1, m1 - 1, d1).getTime() - new Date(y2, m2 - 1, d2).getTime();
    });

    orderDates.forEach((orderDate) => {
      data[orderDate] = {};
      deliveryDates.forEach((deliveryDate) => {
        data[orderDate][deliveryDate] = 0;
      });
    });

    orders.forEach((order) => {
      if (order.deliveryDate) {
        const orderDateStr = new Date(order.createdAt).toLocaleDateString('en-IN');
        const deliveryDateStr = new Date(order.deliveryDate).toLocaleDateString('en-IN');
        if (data[orderDateStr] && data[orderDateStr][deliveryDateStr] !== undefined) {
          data[orderDateStr][deliveryDateStr] += 1;
        }
      }
    });
    return { data, orderDates, deliveryDates };
  }, [orders]);

  if (loading) {
    return <div className="text-sm text-neutral-500">Loading Order Heatmap...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Order Heatmaps</h1>

      <section className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium mb-4 text-neutral-900">Orders vs Time (Date × Hour)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-xs text-center">
            <thead>
              <tr>
                <th className="border border-neutral-200 p-2 bg-neutral-50 text-left">
                  Date / Hour
                </th>
                {Array.from({ length: 24 }).map((_, h) => (
                  <th key={h} className="border border-neutral-200 p-2 bg-neutral-50 min-w-[30px]">
                    {h}:00
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(ordersVsTimeData).map((dateStr) => (
                <tr key={dateStr}>
                  <td className="border border-neutral-200 p-2 text-left font-medium whitespace-nowrap">
                    {dateStr}
                  </td>
                  {Array.from({ length: 24 }).map((_, h) => {
                    const count = ordersVsTimeData[dateStr][`${h}:00`];
                    const alpha = Math.min(count * 0.2, 1);
                    return (
                      <td
                        key={h}
                        className="border border-neutral-200 p-2 font-medium"
                        style={{
                          backgroundColor:
                            count > 0 ? `rgba(16, 185, 129, ${alpha})` : 'transparent',
                          color: count > 0 && alpha > 0.5 ? 'white' : 'inherit',
                        }}
                        title={`${count} orders on ${dateStr} at ${h}:00`}
                      >
                        {count > 0 ? count : ''}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium mb-4 text-neutral-900">Orders vs Delivery Date</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-xs text-center">
            <thead>
              <tr>
                <th className="border border-neutral-200 p-2 bg-neutral-50 text-left">
                  Order Date \ Delivery Date
                </th>
                {ordersVsDeliveryData.deliveryDates.map((d) => (
                  <th key={d} className="border border-neutral-200 p-2 bg-neutral-50 min-w-[80px]">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ordersVsDeliveryData.orderDates.map((orderDate) => (
                <tr key={orderDate}>
                  <td className="border border-neutral-200 p-2 text-left font-medium whitespace-nowrap">
                    {orderDate}
                  </td>
                  {ordersVsDeliveryData.deliveryDates.map((deliveryDate) => {
                    const count = ordersVsDeliveryData.data[orderDate][deliveryDate];
                    const alpha = Math.min(count * 0.2, 1);
                    return (
                      <td
                        key={deliveryDate}
                        className="border border-neutral-200 p-2 font-medium"
                        style={{
                          backgroundColor:
                            count > 0 ? `rgba(139, 92, 246, ${alpha})` : 'transparent',
                          color: count > 0 && alpha > 0.5 ? 'white' : 'inherit',
                        }}
                        title={`${count} orders placed on ${orderDate} for delivery on ${deliveryDate}`}
                      >
                        {count > 0 ? count : ''}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-neutral-500">
            Note: Rows are Order Creation Dates, Columns are Planned Delivery Dates.
          </p>
        </div>
      </section>
    </div>
  );
}
