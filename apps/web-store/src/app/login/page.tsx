'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginStore } from '@/lib/auth';

export default function LoginPage(): React.JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      await loginStore(email, password);
      setSuccess(true);
      setTimeout(() => router.push('/account'), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inp: React.CSSProperties = {
    width: '100%', border: '1px solid rgba(26,26,26,0.25)', background: 'transparent',
    padding: '0.85em 1em', fontSize: '0.95rem', color: '#1a1a1a',
    outline: 'none', transition: 'border-color 0.25s ease', borderRadius: '1px', fontFamily: 'inherit',
  };

  if (success) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: '#fdfbf4', border: '1px solid #cbb36b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.4rem' }}>
          <svg style={{ width: '24px', height: '24px', color: '#5a0014' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.9rem', color: '#5a0014', marginBottom: '0.6rem' }}>Welcome back.</h2>
        <p style={{ color: 'rgba(26,26,26,0.7)', marginBottom: '1.8rem' }}>Redirecting to your account…</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(1.5rem,5vw,4.5rem)' }}>
      {/* Breadcrumb */}
      <nav style={{ display: 'flex', gap: '0.5em', alignItems: 'center', padding: '1.6rem 0 0', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.7rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)' }}>
        <Link href="/" style={{ color: 'inherit' }}>Home</Link>
        <span style={{ opacity: 0.5 }}>/</span>
        <span style={{ color: '#1a1a1a' }}>Sign In</span>
      </nav>

      {/* Auth layout */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '74vh', alignItems: 'center', gap: '4rem', padding: '2.5rem 0 5rem' }}
        className="auth-grid"
      >
        {/* Visual panel */}
        <div
          style={{
            background: '#1a1a1a', borderRadius: '2px', padding: '3rem',
            minHeight: '560px', display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between', position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Art */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.14 }} viewBox="0 0 560 660" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#e4d6a7"/><stop offset="100%" stopColor="#cbb36b"/>
              </linearGradient>
            </defs>
            <path d="M60 40 C200 10, 380 90, 420 230 C460 370, 320 420, 260 540 C220 620, 140 640, 90 600 C30 555, 80 470, 150 420 C230 365, 250 280, 190 210 C130 140, 20 120, 60 40 Z" fill="url(#lg1)"/>
          </svg>

          {/* Top tag */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <span style={{ display: 'inline-block', background: '#fdfbf4', border: '1px solid #cbb36b', color: '#1a1a1a', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.4em 0.85em', transform: 'rotate(-2deg)' }}>
              Member Access
            </span>
          </div>

          {/* Quote */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ width: '40px', height: '1px', background: '#cbb36b', marginBottom: '1.6rem' }} />
            <p style={{ fontFamily: '"Libre Caslon Text", Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(1.4rem,2.5vw,2rem)', color: '#fdfbf4', lineHeight: 1.32, marginBottom: '1.2rem' }}>
              "We don't chase seasons. We build the pieces that outlast them."
            </p>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#cbb36b' }}>
              — The Noeve Studio
            </span>
          </div>
        </div>

        {/* Form */}
        <div>
          <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5a0014', marginBottom: '0.5rem' }}>
            Welcome Back
          </p>
          <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(2rem,4vw,2.6rem)', color: '#5a0014', marginBottom: '0.6rem' }}>Sign In</h1>
          <p style={{ color: 'rgba(26,26,26,0.65)', marginBottom: '2.2rem', fontSize: '0.95rem' }}>
            Access your orders, saved details and early drop access.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            {/* Email */}
            <div>
              <label htmlFor="login-email" style={{ display: 'block', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.6)', marginBottom: '0.6rem' }}>
                Email Address
              </label>
              <input id="login-email" type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inp} />
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.6rem' }}>
                <label htmlFor="login-password" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.6)' }}>
                  Password
                </label>
                <a href="#" style={{ fontSize: '0.78rem', textDecoration: 'underline', color: 'rgba(26,26,26,0.6)' }}>Forgot password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <input id="login-password" type={showPw ? 'text' : 'password'} required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" style={{ ...inp, paddingRight: '3rem' }} />
                <button type="button" onClick={() => setShowPw(!showPw)} aria-label="Toggle password" style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(26,26,26,0.45)', width: '20px', height: '20px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>

            {error && <p style={{ fontSize: '0.8rem', color: '#5a0014' }}>{error}</p>}

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              style={{ background: '#5a0014', color: '#fdfbf4', border: 'none', padding: '0.95em 1.9em', fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', borderRadius: '1px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, width: '100%', transition: 'background 0.3s ease' }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.7rem 0', color: 'rgba(26,26,26,0.4)', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(26,26,26,0.15)' }} />
            or
            <div style={{ flex: 1, height: '1px', background: 'rgba(26,26,26,0.15)' }} />
          </div>

          <Link
            href="/"
            id="continue-as-guest"
            style={{ display: 'block', width: '100%', textAlign: 'center', border: '1px solid #1a1a1a', color: '#1a1a1a', padding: '0.95em 1.9em', fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', borderRadius: '1px', transition: 'all 0.3s ease' }}
          >
            Continue as Guest
          </Link>

          <p style={{ textAlign: 'center', marginTop: '1.8rem', fontSize: '0.88rem', color: 'rgba(26,26,26,0.7)' }}>
            New to Noeve?{' '}
            <Link href="/register" style={{ fontWeight: 600, color: '#1a1a1a', textDecoration: 'underline' }}>Create an account</Link>
          </p>
          <p style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.72rem', color: 'rgba(26,26,26,0.4)' }}>
            Demo: customer@noeve.local / Customer123!
          </p>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) { .auth-grid { grid-template-columns: 1fr !important; }
          .auth-grid > div:first-child { display: none !important; } }
      `}</style>
    </div>
  );
}
