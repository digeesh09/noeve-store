'use client';

import React, { useState } from 'react';
import { apiClient } from '@/lib/api';

export default function SupportPage(): React.JSX.Element {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await apiClient.store.createSupportTicket({ name, email, subject, message });
      setStatus('success');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="wrap" style={{ padding: '6rem 0', maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2.5rem', margin: '0 0 1rem 0', color: 'var(--ink)' }}>Contact Us</h1>
        <p style={{ color: 'rgba(33,29,25,.6)', fontSize: '1.1rem', lineHeight: '1.6', maxWidth: '500px', margin: '0 auto' }}>
          Have a question or need assistance? Reach out to our support team and we will get back to you as soon as possible.
        </p>
      </div>
      
      {status === 'success' && (
        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>Your message has been sent successfully.</p>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>We will be in touch shortly via email.</p>
        </div>
      )}

      {status === 'error' && (
        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>An error occurred.</p>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>Please try sending your message again later.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ 
        background: '#fff', padding: '2.5rem', border: '1px solid var(--bone)', 
        borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 'bold', color: 'rgba(33,29,25,.8)' }}>Full Name</label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            style={{ 
              width: '100%', padding: '0.8rem 1rem', border: '1px solid var(--bone)', 
              background: '#fafafa', borderRadius: '6px', outline: 'none', 
              fontFamily: 'inherit', fontSize: '0.95rem', transition: 'all 0.2s'
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--oxblood)'; e.currentTarget.style.background = '#fff'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--bone)'; e.currentTarget.style.background = '#fafafa'; }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 'bold', color: 'rgba(33,29,25,.8)' }}>Email Address</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
            style={{ 
              width: '100%', padding: '0.8rem 1rem', border: '1px solid var(--bone)', 
              background: '#fafafa', borderRadius: '6px', outline: 'none', 
              fontFamily: 'inherit', fontSize: '0.95rem', transition: 'all 0.2s'
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--oxblood)'; e.currentTarget.style.background = '#fff'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--bone)'; e.currentTarget.style.background = '#fafafa'; }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="subject" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 'bold', color: 'rgba(33,29,25,.8)' }}>Subject</label>
          <input
            id="subject"
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="How can we help?"
            style={{ 
              width: '100%', padding: '0.8rem 1rem', border: '1px solid var(--bone)', 
              background: '#fafafa', borderRadius: '6px', outline: 'none', 
              fontFamily: 'inherit', fontSize: '0.95rem', transition: 'all 0.2s'
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--oxblood)'; e.currentTarget.style.background = '#fff'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--bone)'; e.currentTarget.style.background = '#fafafa'; }}
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 'bold', color: 'rgba(33,29,25,.8)' }}>Message</label>
          <textarea
            id="message"
            required
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your issue in detail..."
            style={{ 
              width: '100%', padding: '1rem', border: '1px solid var(--bone)', 
              background: '#fafafa', borderRadius: '6px', outline: 'none', 
              fontFamily: 'inherit', fontSize: '0.95rem', transition: 'all 0.2s', resize: 'vertical'
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--oxblood)'; e.currentTarget.style.background = '#fff'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--bone)'; e.currentTarget.style.background = '#fafafa'; }}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn btn--primary"
          style={{ width: '100%', padding: '0.8rem', fontSize: '1rem', borderRadius: '6px' }}
        >
          {status === 'loading' ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}
