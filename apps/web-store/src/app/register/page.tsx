'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerStore } from '@/lib/auth';

export default function RegisterPage(): React.JSX.Element {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password || !firstName) { setError('Please fill in all required fields.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      await registerStore({ email, password, firstName, lastName });
      setSuccess(true);
      setTimeout(() => router.push('/account'), 1400);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
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
        <h2>Welcome to Noeve.</h2>
        <p>Your account has been created. Redirecting…</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--edge)' }}>
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <span style={{ color: 'var(--ink)' }}>Create Account</span>
      </nav>

      {/* Auth layout */}
      <section className="auth">
        {/* Visual panel */}
        <div className="auth__visual">
          <svg className="bg-art" viewBox="0 0 560 660" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="rg1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#DCD3C2"/><stop offset="100%" stopColor="#B89B6E"/>
              </linearGradient>
            </defs>
            <path d="M340 20 C440 60, 520 180, 480 300 C440 420, 320 400, 300 500 C285 575, 360 620, 440 600 L520 640 L540 80 Z" fill="url(#rg1)" opacity="0.9"/>
            <path d="M120 480 C160 440, 230 450, 250 510 C268 565, 210 610, 160 600 C112 590, 90 515, 120 480 Z" fill="var(--oxblood)"/>
          </svg>
          <div className="auth__visual-top">
            <span style={{
              position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '.5em', padding: '.4em .85em .4em 1.7em',
              background: 'var(--cream)', border: '1px solid var(--champagne)', color: 'var(--ink)', fontFamily: 'var(--mono)',
              fontSize: '.7rem', letterSpacing: '.1em', textTransform: 'uppercase', transform: 'rotate(2deg)',
            }}>
              <span style={{ position: 'absolute', left: '.6em', top: '50%', width: '.5em', height: '.5em', borderRadius: '50%', background: 'var(--bone)', border: '1px solid var(--ink)', transform: 'translateY(-50%)' }}></span>
              New Member
            </span>
          </div>
          <div>
            <div className="auth__visual-hairline"></div>
            <h2>"Fewer pieces. Finer ones."</h2>
            <span className="quote-byline">— The Noeve Edit</span>
          </div>
        </div>

        {/* Form */}
        <div className="auth__form-card">
          <p style={{ fontFamily: 'var(--mono)', fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--oxblood)', marginBottom: '.5rem' }}>
            New Member
          </p>
          <h1>Create Account</h1>
          <p className="sub">Join Noeve for early access to new drops and order tracking.</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            {/* Name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label htmlFor="reg-first" style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '.7rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(33,29,25,.6)', marginBottom: '.6rem' }}>First Name *</label>
                <input id="reg-first" required value={firstName} onChange={e => setFirstName(e.target.value)} style={inp} />
              </div>
              <div>
                <label htmlFor="reg-last" style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '.7rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(33,29,25,.6)', marginBottom: '.6rem' }}>Last Name</label>
                <input id="reg-last" value={lastName} onChange={e => setLastName(e.target.value)} style={inp} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '.7rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(33,29,25,.6)', marginBottom: '.6rem' }}>Email Address *</label>
              <input id="reg-email" type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inp} />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '.7rem', letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(33,29,25,.6)', marginBottom: '.6rem' }}>Password *</label>
              <div style={{ position: 'relative' }}>
                <input id="reg-password" type={showPw ? 'text' : 'password'} required autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" style={{ ...inp, paddingRight: '3rem' }} />
                <button type="button" onClick={() => setShowPw(!showPw)} aria-label="Toggle password" style={{ position: 'absolute', right: '.9rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(33,29,25,.45)', width: '20px', height: '20px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>

            {/* Checkbox */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '.7rem' }}>
              <input id="reg-consent" type="checkbox" style={{ width: '17px', height: '17px', marginTop: '.18rem', accentColor: 'var(--oxblood)', flexShrink: 0 }} />
              <label htmlFor="reg-consent" style={{ fontSize: '.85rem', color: 'rgba(33,29,25,.75)', lineHeight: 1.45 }}>
                I agree to the <a href="#" style={{ textDecoration: 'underline' }}>Privacy Policy</a> and would like to receive updates from Noeve.
              </label>
            </div>

            {error && <p style={{ fontSize: '.76rem', color: 'var(--oxblood)', marginTop: '.5rem' }}>{error}</p>}

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="btn btn--primary"
              style={{ width: '100%' }}
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="auth__switch">
            Already have an account?{' '}
            <Link href="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
