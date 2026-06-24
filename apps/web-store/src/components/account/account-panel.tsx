'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { isLoggedIn, loginStore, logout, registerStore } from '@/lib/auth';
import { fetchMyOrders, type Order } from '@/lib/orders';
import { formatPrice } from '@/lib/format';

export function AccountPanel(): React.JSX.Element {
  const [loggedIn, setLoggedIn] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  useEffect(() => {
    if (!loggedIn) return;
    setOrdersLoading(true);
    fetchMyOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [loggedIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'login') {
        await loginStore(email, password);
      } else {
        await registerStore({ email, password, firstName, lastName });
      }
      setLoggedIn(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    setOrders([]);
  };

  if (loggedIn) {
    return (
      <div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-accent">Account</p>
            <h1 className="mt-2 font-serif text-3xl font-semibold text-brand-primary">Your account</h1>
            <p className="mt-2 text-neutral-600">Signed in as {email || 'customer'}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm hover:border-brand-primary"
          >
            Sign out
          </button>
        </div>

        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="font-serif text-xl font-semibold text-brand-primary">Your orders</h2>
          {ordersLoading ? (
            <p className="mt-4 text-sm text-neutral-500">Loading orders…</p>
          ) : orders.length === 0 ? (
            <p className="mt-4 text-sm text-neutral-500">
              No orders yet.{' '}
              <Link href="/shop" className="text-brand-accent hover:underline">
                Start shopping
              </Link>
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 text-sm"
                >
                  <div>
                    <p className="font-medium text-brand-primary">{order.orderNumber}</p>
                    <p className="text-neutral-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')} · {order.status}
                    </p>
                  </div>
                  <p className="font-semibold">{formatPrice(order.totalCents, order.currency)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-accent">Account</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-brand-primary">
        {mode === 'login' ? 'Welcome back' : 'Create account'}
      </h1>
      <p className="mt-2 text-neutral-600">
        Sign in to track orders, save addresses, and manage your profile.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
      >
        {mode === 'register' ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700">
                First name
              </label>
              <input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm outline-none ring-brand-accent focus:ring-2"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700">
                Last name
              </label>
              <input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm outline-none ring-brand-accent focus:ring-2"
              />
            </div>
          </div>
        ) : null}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm outline-none ring-brand-accent focus:ring-2"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm outline-none ring-brand-accent focus:ring-2"
          />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full border-2 border-brand-accent bg-transparent py-3 text-sm font-semibold text-brand-primary hover:bg-brand-accent hover:text-brand-primary disabled:opacity-60"
        >
          {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>
        <p className="text-center text-xs text-neutral-500">
          {mode === 'login' ? (
            <>
              New to Noeve?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="font-medium text-brand-accent hover:underline"
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-medium text-brand-accent hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </p>
        <p className="text-center text-xs text-neutral-400">
          Demo: customer@noeve.local / Customer123!
        </p>
      </form>
    </div>
  );
}
