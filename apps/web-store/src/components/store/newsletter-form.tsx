'use client';

import React, { useState } from 'react';
import { apiClient } from '@/lib/api';

export function NewsletterForm(): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      await apiClient.store.subscribeNewsletter({ email });
      setStatus('success');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Failed to subscribe. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="newsletter__form" style={{ padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', textAlign: 'center' }}>
        <p style={{ margin: 0, fontWeight: 500 }}>Thank you for subscribing!</p>
      </div>
    );
  }

  return (
    <form className="newsletter__form" onSubmit={handleSubmit}>
      <input 
        type="email" 
        placeholder="Your email address" 
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        disabled={status === 'loading'}
      />
      <button 
        type="submit" 
        className="btn btn--primary" 
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>
      {status === 'error' && <p style={{ color: 'var(--oxblood)', fontSize: '0.85rem', marginTop: '0.5rem', width: '100%' }}>{errorMessage}</p>}
    </form>
  );
}
