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
    width: '100%', border: '1px solid rgba(33,29,25,0.25)', background: 'transparent',
    padding: '0.85em 1em', fontSize: '0.95rem', color: 'var(--ink)',
    outline: 'none', transition: 'border-color 0.25s ease', borderRadius: '1px', fontFamily: 'inherit',
  };

  if (success) {
    return (
      <div className="auth__success is-visible" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="auth__success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <h2>Welcome back.</h2>
        <p>Redirecting to your account…</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--edge)' }}>
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <span style={{ color: 'var(--ink)' }}>Sign In</span>
      </nav>

      {/* Auth layout */}
      <section className="auth">
        {/* Visual panel */}
        <div className="auth__visual">
          <svg className="bg-art" viewBox="0 0 560 660" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="fold1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#DCD3C2"/><stop offset="100%" stopColor="#B89B6E"/>
              </linearGradient>
            </defs>
            <path d="M60 40 C200 10, 380 90, 420 230 C460 370, 320 420, 260 540 C220 620, 140 640, 90 600 C30 555, 80 470, 150 420 C230 365, 250 280, 190 210 C130 140, 20 120, 60 40 Z" fill="url(#fold1)"/>
          </svg>
          <div className="auth__visual-top">
            <span style={{
              position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '.5em', padding: '.4em .85em .4em 1.7em',
              background: 'var(--cream)', border: '1px solid var(--champagne)', color: 'var(--ink)', fontFamily: 'var(--mono)',
              fontSize: '.7rem', letterSpacing: '.1em', textTransform: 'uppercase', transform: 'rotate(-3deg)',
            }}>
              <span style={{ position: 'absolute', left: '.6em', top: '50%', width: '.5em', height: '.5em', borderRadius: '50%', background: 'var(--bone)', border: '1px solid var(--ink)', transform: 'translateY(-50%)' }}></span>
              Member Access
            </span>
          </div>
          <div>
            <div className="auth__visual-hairline"></div>
            <h2>"We don't chase seasons. We build the pieces that outlast them."</h2>
            <span className="quote-byline">— The Noeve Studio</span>
          </div>
        </div>

        {/* Form */}
        <div className="auth__form-card">
          <p style={{ fontFamily: 'var(--mono)', fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--oxblood)', marginBottom: '.5rem' }}>
            Welcome Back
          </p>
          <h1>Sign in</h1>
          <p className="sub">Access your orders, saved details and early drop access.</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            {/* Email */}
            <div>
              <label htmlFor="login-email" style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '.7rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(33,29,25,.6)', marginBottom: '.6rem' }}>
                Email Address
              </label>
              <input id="login-email" type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inp} />
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '.6rem' }}>
                <label htmlFor="login-password" style={{ fontFamily: 'var(--mono)', fontSize: '.7rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(33,29,25,.6)' }}>
                  Password
                </label>
                <a href="#" style={{ fontSize: '.78rem', textDecoration: 'underline', color: 'rgba(33,29,25,.6)' }}>Forgot password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <input id="login-password" type={showPw ? 'text' : 'password'} required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" style={{ ...inp, paddingRight: '3rem' }} />
                <button type="button" onClick={() => setShowPw(!showPw)} aria-label="Toggle password" style={{ position: 'absolute', right: '.9rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(33,29,25,.45)', width: '20px', height: '20px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>

            {error && <p style={{ fontSize: '.76rem', color: 'var(--oxblood)', marginTop: '.5rem' }}>{error}</p>}

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn btn--primary"
              style={{ width: '100%' }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="auth__divider">or</div>

          <Link
            href="/"
            id="continue-as-guest"
            className="btn btn--outline"
            style={{ width: '100%', textAlign: 'center', display: 'block' }}
          >
            Continue as Guest
          </Link>

          <p className="auth__switch">
            New to Noeve?{' '}
            <Link href="/register">Create an account</Link>
          </p>
          <p style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.72rem', color: 'rgba(33,29,25,0.4)' }}>
            Demo: customer@noeve.local / Customer123!
          </p>
        </div>
      </section>
    </div>
  );
}
