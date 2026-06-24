'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { isLoggedIn, loginStore, logout, registerStore } from '@/lib/auth';
import { fetchMyOrders, type Order } from '@/lib/orders';
import { formatPrice } from '@/lib/format';

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid rgba(26,26,26,0.25)',
  background: 'transparent',
  padding: '0.85em 1em',
  fontSize: '0.95rem',
  color: 'var(--ink)',
  outline: 'none',
  transition: 'border-color 0.25s ease',
  borderRadius: '1px',
};

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
            <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--burgundy)' }}>Account</p>
            <h1 className="font-display text-3xl text-brand-primary">Your Account</h1>
            <p className="mt-2 text-sm" style={{ color: 'rgba(26,26,26,0.65)' }}>Signed in as {email || 'customer'}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium uppercase tracking-[0.05em] transition-all duration-200 hover:-translate-y-0.5"
            style={{ border: '1px solid rgba(26,26,26,0.3)', borderRadius: '1px', color: 'var(--ink)' }}
          >
            Sign Out
          </button>
        </div>

        <div className="mt-8 p-6" style={{ background: 'var(--cream-deep)', border: '1px solid rgba(26,26,26,0.08)', borderRadius: '2px' }}>
          <h2 className="font-display mb-4 text-xl text-brand-primary">Your Orders</h2>
          {ordersLoading ? (
            <p className="text-sm" style={{ color: 'rgba(26,26,26,0.55)' }}>Loading orders…</p>
          ) : orders.length === 0 ? (
            <p className="text-sm" style={{ color: 'rgba(26,26,26,0.55)' }}>
              No orders yet.{' '}
              <Link href="/shop" className="underline" style={{ color: 'var(--burgundy)' }}>Start shopping</Link>
            </p>
          ) : (
            <ul className="mt-2 space-y-3">
              {orders.map((order) => (
                <li key={order.id} className="flex items-center justify-between rounded-[1px] border p-4 text-sm" style={{ borderColor: 'rgba(26,26,26,0.1)' }}>
                  <div>
                    <p className="font-medium text-brand-primary">{order.orderNumber}</p>
                    <p className="text-xs" style={{ color: 'rgba(26,26,26,0.55)' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN')} · {order.status}
                    </p>
                  </div>
                  <p className="font-semibold" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                    {formatPrice(order.totalCents, order.currency)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
      {/* Visual panel — matching reference auth__visual */}
      <div
        className="hidden rounded-[2px] p-10 lg:flex lg:min-h-[520px] lg:flex-col lg:justify-between"
        style={{ background: 'var(--ink)', position: 'relative', overflow: 'hidden' }}
      >
        {/* bg art */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-15" viewBox="0 0 560 660" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="alg1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e4d6a7"/>
              <stop offset="100%" stopColor="#cbb36b"/>
            </linearGradient>
          </defs>
          <path d="M60 40 C200 10, 380 90, 420 230 C460 370, 320 420, 260 540 C220 620, 140 640, 90 600 C30 555, 80 470, 150 420 C230 365, 250 280, 190 210 C130 140, 20 120, 60 40 Z" fill="url(#alg1)"/>
        </svg>
        <div className="relative z-10">
          <span
            className="inline-block px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.1em]"
            style={{ background: 'var(--cream)', border: '1px solid var(--gold)', color: 'var(--ink)', transform: 'rotate(-2deg)', borderRadius: '1px' }}
          >
            Member Access
          </span>
        </div>
        <div className="relative z-10">
          <div className="mb-5 h-px w-10" style={{ background: 'var(--gold)' }} />
          <p
            className="mb-3 leading-[1.32]"
            style={{ fontFamily: '"Libre Caslon Text", serif', fontStyle: 'italic', fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', color: 'var(--cream)' }}
          >
            "We don't chase seasons. We build the pieces that outlast them."
          </p>
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--gold)' }}>
            — The Noeve Studio
          </span>
        </div>
      </div>

      {/* Form */}
      <div>
        <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--burgundy)' }}>
          {mode === 'login' ? 'Welcome Back' : 'New Member'}
        </p>
        <h1 className="font-display mb-2 text-3xl text-brand-primary">
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </h1>
        <p className="mb-8 text-sm" style={{ color: 'rgba(26,26,26,0.65)' }}>
          {mode === 'login'
            ? 'Access your orders, saved details and early drop access.'
            : 'Create your account for early access and order tracking.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'register' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.08em]" style={{ color: 'rgba(26,26,26,0.6)', fontFamily: '"JetBrains Mono", monospace' }}>
                  First Name
                </label>
                <input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.08em]" style={{ color: 'rgba(26,26,26,0.6)', fontFamily: '"JetBrains Mono", monospace' }}>
                  Last Name
                </label>
                <input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputStyle} />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.08em]" style={{ color: 'rgba(26,26,26,0.6)', fontFamily: '"JetBrains Mono", monospace' }}>
              Email Address
            </label>
            <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle} />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.08em]" style={{ color: 'rgba(26,26,26,0.6)', fontFamily: '"JetBrains Mono", monospace' }}>
              Password
            </label>
            <input id="password" type="password" required autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
          </div>

          {error && <p className="text-sm" style={{ color: 'var(--burgundy)' }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-[0.85rem] font-semibold uppercase tracking-[0.05em] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60"
            style={{ background: 'var(--burgundy)', color: 'var(--cream)', borderRadius: '1px' }}
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div className="my-7 flex items-center gap-4" style={{ color: 'rgba(26,26,26,0.4)', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <div className="h-px flex-1" style={{ background: 'rgba(26,26,26,0.15)' }} />
          or
          <div className="h-px flex-1" style={{ background: 'rgba(26,26,26,0.15)' }} />
        </div>

        <Link
          href="/shop"
          className="block w-full py-4 text-center text-[0.85rem] font-semibold uppercase tracking-[0.05em] transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink hover:text-cream-DEFAULT"
          style={{ border: '1px solid var(--ink)', color: 'var(--ink)', borderRadius: '1px' }}
        >
          Continue as Guest
        </Link>

        <p className="mt-6 text-center text-[0.88rem]" style={{ color: 'rgba(26,26,26,0.7)' }}>
          {mode === 'login' ? (
            <>
              New to Noeve?{' '}
              <button type="button" onClick={() => setMode('register')} className="font-semibold underline" style={{ color: 'var(--ink)' }}>
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" onClick={() => setMode('login')} className="font-semibold underline" style={{ color: 'var(--ink)' }}>
                Sign in
              </button>
            </>
          )}
        </p>
        <p className="mt-2 text-center text-[0.72rem]" style={{ color: 'rgba(26,26,26,0.4)' }}>
          Demo: customer@noeve.local / Customer123!
        </p>
      </div>
    </div>
  );
}
