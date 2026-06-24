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
    width: '100%', border: '1px solid rgba(26,26,26,0.25)', background: 'transparent',
    padding: '0.85em 1em', fontSize: '0.95rem', color: '#1a1a1a',
    outline: 'none', transition: 'border-color 0.25s ease', borderRadius: '1px', fontFamily: 'inherit',
  };

  if (success) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: '#fdfbf4', border: '1px solid #cbb36b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.4rem' }}>
          <svg style={{ width: '24px', height: '24px', color: '#5a0014' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <h2 style={{ fontFamily: '"Libre Caslon Display", serif', fontSize: '1.9rem', color: '#5a0014', marginBottom: '0.6rem' }}>Welcome to Noeve.</h2>
        <p style={{ color: 'rgba(26,26,26,0.7)' }}>Your account has been created. Redirecting…</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(1.5rem,5vw,4.5rem)' }}>
      {/* Breadcrumb */}
      <nav style={{ display: 'flex', gap: '0.5em', alignItems: 'center', padding: '1.6rem 0 0', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.7rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.5)' }}>
        <Link href="/" style={{ color: 'inherit' }}>Home</Link>
        <span style={{ opacity: 0.5 }}>/</span>
        <span style={{ color: '#1a1a1a' }}>Create Account</span>
      </nav>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '80vh', alignItems: 'center', gap: '4rem', padding: '2.5rem 0 5rem' }} className="auth-grid">

        {/* Visual panel */}
        <div style={{ background: '#1a1a1a', borderRadius: '2px', padding: '3rem', minHeight: '580px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.14 }} viewBox="0 0 560 660" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="rg1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#e4d6a7"/><stop offset="100%" stopColor="#cbb36b"/>
              </linearGradient>
            </defs>
            <path d="M340 20 C440 60, 520 180, 480 300 C440 420, 320 400, 300 500 C285 575, 360 620, 440 600 L520 640 L540 80 Z" fill="url(#rg1)" opacity="0.9"/>
            <path d="M120 480 C160 440, 230 450, 250 510 C268 565, 210 610, 160 600 C112 590, 90 515, 120 480 Z" fill="#5a0014"/>
          </svg>

          <div style={{ position: 'relative', zIndex: 2 }}>
            <span style={{ display: 'inline-block', background: '#fdfbf4', border: '1px solid #cbb36b', color: '#1a1a1a', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.4em 0.85em', transform: 'rotate(2deg)' }}>
              New Member
            </span>
          </div>

          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ width: '40px', height: '1px', background: '#cbb36b', marginBottom: '1.6rem' }} />
            <p style={{ fontFamily: '"Libre Caslon Text", Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(1.4rem,2.5vw,2rem)', color: '#fdfbf4', lineHeight: 1.32, marginBottom: '1.2rem' }}>
              "Fewer pieces. Finer ones."
            </p>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#cbb36b' }}>
              — The Noeve Edit
            </span>
          </div>
        </div>

        {/* Form */}
        <div>
          <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5a0014', marginBottom: '0.5rem' }}>
            New Member
          </p>
          <h1 style={{ fontFamily: '"Libre Caslon Display", serif', fontSize: 'clamp(2rem,4vw,2.6rem)', color: '#5a0014', marginBottom: '0.6rem' }}>Create Account</h1>
          <p style={{ color: 'rgba(26,26,26,0.65)', marginBottom: '2.2rem', fontSize: '0.95rem' }}>
            Join Noeve for early access to new drops and order tracking.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            {/* Name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label htmlFor="reg-first" style={{ display: 'block', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.6)', marginBottom: '0.6rem' }}>First Name *</label>
                <input id="reg-first" required value={firstName} onChange={e => setFirstName(e.target.value)} style={inp} />
              </div>
              <div>
                <label htmlFor="reg-last" style={{ display: 'block', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.6)', marginBottom: '0.6rem' }}>Last Name</label>
                <input id="reg-last" value={lastName} onChange={e => setLastName(e.target.value)} style={inp} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" style={{ display: 'block', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.6)', marginBottom: '0.6rem' }}>Email Address *</label>
              <input id="reg-email" type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inp} />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" style={{ display: 'block', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(26,26,26,0.6)', marginBottom: '0.6rem' }}>Password *</label>
              <div style={{ position: 'relative' }}>
                <input id="reg-password" type={showPw ? 'text' : 'password'} required autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" style={{ ...inp, paddingRight: '3rem' }} />
                <button type="button" onClick={() => setShowPw(!showPw)} aria-label="Toggle password" style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(26,26,26,0.45)', width: '20px', height: '20px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>

            {/* Checkbox */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.7rem' }}>
              <input id="reg-consent" type="checkbox" style={{ width: '17px', height: '17px', marginTop: '0.18rem', accentColor: '#5a0014', flexShrink: 0 }} />
              <label htmlFor="reg-consent" style={{ fontSize: '0.85rem', color: 'rgba(26,26,26,0.75)', lineHeight: 1.45 }}>
                I agree to the <a href="#" style={{ textDecoration: 'underline' }}>Privacy Policy</a> and would like to receive updates from Noeve.
              </label>
            </div>

            {error && <p style={{ fontSize: '0.8rem', color: '#5a0014' }}>{error}</p>}

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              style={{ background: '#5a0014', color: '#fdfbf4', border: 'none', padding: '0.95em 1.9em', fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', borderRadius: '1px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, width: '100%' }}
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.8rem', fontSize: '0.88rem', color: 'rgba(26,26,26,0.7)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ fontWeight: 600, color: '#1a1a1a', textDecoration: 'underline' }}>Sign in</Link>
          </p>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) { .auth-grid { grid-template-columns: 1fr !important; }
          .auth-grid > div:first-child { display: none !important; } }
        @media (max-width: 640px) { .auth-grid > div:last-child div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
