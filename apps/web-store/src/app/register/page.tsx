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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      await registerStore({ email, password, firstName, lastName });
      setSuccess(true);
      setTimeout(() => router.push('/account'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="wrap" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="auth__success is-visible">
          <div className="auth__success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2>Welcome to Noeve.</h2>
          <p>Your account has been created successfully. Redirecting you to your account page…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/login">Sign In</Link>
        <span>/</span>
        <span style={{ color: 'var(--ink)' }}>Create Account</span>
      </nav>

      {/* Auth layout */}
      <section className="auth">
        {/* Visual panel */}
        <div className="auth__visual">
          <svg className="bg-art" viewBox="0 0 560 660" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="fold2" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F6F1E8" />
                <stop offset="100%" stopColor="#DCD3C2" />
              </linearGradient>
            </defs>
            <path
              d="M340 20 C440 60, 520 180, 480 300 C440 420, 320 400, 300 500 C285 575, 360 620, 440 600 L520 640 L540 80 Z"
              fill="url(#fold2)"
            />
          </svg>
          <div className="auth__visual-top">
            <span className="tag">Join Noeve</span>
          </div>
          <div>
            <div className="auth__visual-hairline" />
            <h2>&quot;Fewer pieces. Finer ones.&quot; — made for members who buy once, and buy well.</h2>
            <span className="quote-byline">Member Benefits</span>
            <div className="auth__perks" style={{ marginTop: '1.6rem' }}>
              <div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>{' '}
                Early access to new drops
              </div>
              <div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>{' '}
                Order tracking &amp; history
              </div>
              <div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>{' '}
                Saved addresses for faster checkout
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="auth__form-card">
          <p className="eyebrow">New Here</p>
          <h1>Create your account</h1>
          <p className="sub">Takes less than a minute.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  placeholder="Maren"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  placeholder="Kjær"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="regEmail">Email Address</label>
              <input
                type="email"
                id="regEmail"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="regPassword">Password</label>
              <div className="input-group">
                <input
                  type={showPw ? 'text' : 'password'}
                  id="regPassword"
                  placeholder="Create a password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-pw"
                  onClick={() => setShowPw(!showPw)}
                  aria-label="Toggle password"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
              <p className="form-hint">At least 8 characters.</p>
            </div>

            <div className="form-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-group">
                <input
                  type={showConfirmPw ? 'text' : 'password'}
                  id="confirmPassword"
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-pw"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  aria-label="Toggle password"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="checkbox-row">
              <input type="checkbox" id="emailOptIn" defaultChecked />
              <label htmlFor="emailOptIn">Email me about new drops, early access and seasonal notes.</label>
            </div>

            <div className="checkbox-row">
              <input type="checkbox" id="termsAgree" required />
              <label htmlFor="termsAgree">
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
              </label>
            </div>

            {error && <p style={{ fontSize: '.76rem', color: 'var(--oxblood)', marginBottom: '1.2rem' }}>{error}</p>}

            <button type="submit" disabled={loading} className="btn btn--primary">
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>

          <p className="auth__switch">
            Already a member? <Link href="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
