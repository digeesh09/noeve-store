'use client';

import React, { useEffect, useState } from 'react';
import { fetchReportsData } from '@/lib/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#14b8a6', '#f43f5e'];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [userAcquisition, setUserAcquisition] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([
    { label: 'Total Revenue', value: '$0.00', change: '—', trend: 'up' },
    { label: 'Total Orders', value: '0', change: '—', trend: 'up' },
    { label: 'Average Order', value: '$0.00', change: '—', trend: 'up' },
  ]);

  useEffect(() => {
    async function loadData() {
      try {
        const [dailyRes, topRes, statusRes, userRes, summaryRes] = await Promise.all([
          fetchReportsData('daily-revenue'),
          fetchReportsData('top-products'),
          fetchReportsData('orders-by-status'),
          fetchReportsData('user-acquisition'),
          fetchReportsData('sales-summary')
        ]);

        if (Array.isArray(dailyRes)) {
          // Format daily revenue
          setRevenueData(dailyRes.map((d: any) => ({
            name: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
            revenue: d.revenueCents / 100
          })));
        }

        if (Array.isArray(topRes)) {
          setTopProducts(topRes.map((p: any) => ({
            name: p.productName || 'Unknown',
            sales: p._sum.quantity
          })));
        }

        if (Array.isArray(statusRes)) {
          setCategoryData(statusRes.map((s: any) => ({
            name: s.status,
            value: s.count
          })));
        }

        if (Array.isArray(userRes)) {
          setUserAcquisition(userRes);
        }

        if (summaryRes) {
          setStats([
            { label: 'Total Revenue', value: `$${(summaryRes.totalRevenueCents / 100).toLocaleString()}`, change: 'Past 30 days', trend: 'up' },
            { label: 'Total Orders', value: summaryRes.totalOrders.toString(), change: 'Past 30 days', trend: 'up' },
            { label: 'Average Order', value: `$${(summaryRes.averageOrderValueCents / 100).toLocaleString()}`, change: 'Past 30 days', trend: 'up' },
          ]);
        }
      } catch (err) {
        console.error('Failed to load analytics data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <p className="mt-8 text-sm text-neutral-500">Loading analytics...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Analytics</h1>
        <p className="text-sm text-neutral-500">Current state analysis of Noeve.store</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-neutral-500">{stat.label}</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-semibold tracking-tight text-neutral-900">{stat.value}</span>
            </div>
            <p className={`mt-2 text-xs ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-neutral-900">Revenue Over Time (Past 7 Days)</h3>
          <div className="h-[300px] w-full text-sm">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#737373' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#737373' }} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e5e5', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(val) => [`$${val}`, 'Revenue']}
                />
                <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-neutral-900">Orders by Status</h3>
          <div className="h-[300px] w-full text-sm">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e5e5', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-neutral-900">User Acquisition Trend</h3>
          <div className="h-[300px] w-full text-sm">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userAcquisition} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#737373' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#737373' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e5e5', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(val) => [val, 'New Users']}
                />
                <Area type="monotone" dataKey="users" stroke="#10b981" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-neutral-900">Top Selling Products</h3>
          <div className="h-[300px] w-full text-sm">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} margin={{ top: 10, right: 30, left: 0, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e5e5" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#737373' }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#737373' }} width={80} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e5e5', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(val) => [val, 'Sales']}
                />
                <Bar dataKey="sales" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
