'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { isLoggedIn, loginStore, logout } from '@/lib/auth';
import { fetchMyOrders, type Order } from '@/lib/orders';
import { formatPrice } from '@/lib/format';

export function AccountPanel(): React.JSX.Element {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState<'orders'|'profile'>('orders');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [openOrder, setOpenOrder] = useState<string|null>(null);

  useEffect(() => { setLoggedIn(isLoggedIn()); }, []);
  useEffect(() => {
    if (!loggedIn) return;
    fetchMyOrders().then(setOrders).catch(() => setOrders([]));
  }, [loggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null); setLoading(true);
    try { await loginStore(email, password); setLoggedIn(true); }
    catch (err) { setError(err instanceof Error ? err.message : 'Sign in failed.'); }
    finally { setLoading(false); }
  };

  const toggleOrder = (id: string) => setOpenOrder(openOrder === id ? null : id);

  if (!loggedIn) {
    return (
      <div className="wrap">
        <nav className="breadcrumb"><Link href="/">Home</Link><span>/</span><span style={{color:'var(--ink)'}}>Sign In</span></nav>
        <section className="auth">
          <div className="auth__visual">
            <svg className="bg-art" viewBox="0 0 560 660" xmlns="http://www.w3.org/2000/svg">
              <defs><linearGradient id="af1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#DCD3C2"/><stop offset="100%" stopColor="#B89B6E"/></linearGradient></defs>
              <path d="M60 40 C200 10, 380 90, 420 230 C460 370, 320 420, 260 540 C220 620, 140 640, 90 600 C30 555, 80 470, 150 420 C230 365, 250 280, 190 210 C130 140, 20 120, 60 40 Z" fill="url(#af1)"/>
            </svg>
            <div className="auth__visual-top"><span className="tag">Member Access</span></div>
            <div><div className="auth__visual-hairline"/><h2>&quot;We don&apos;t chase seasons. We build the pieces that outlast them.&quot;</h2><span className="quote-byline">— The Noeve Studio</span></div>
          </div>
          <div className="auth__form-card">
            <p className="eyebrow">Welcome Back</p>
            <h1>Sign in</h1>
            <p className="sub">Access your orders, saved details and early drop access.</p>
            <form onSubmit={handleLogin}>
              <div className="form-field"><label>Email Address</label><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></div>
              <div className="form-field"><label>Password</label><input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password"/></div>
              {error && <p style={{fontSize:'.76rem',color:'var(--oxblood)',marginBottom:'1rem'}}>{error}</p>}
              <button type="submit" disabled={loading} className="btn btn--primary" style={{width:'100%'}}>{loading ? 'Signing in…' : 'Sign In'}</button>
            </form>
            <div className="auth__divider">or</div>
            <Link href="/" className="btn btn--outline" style={{width:'100%'}}>Continue as Guest</Link>
            <p className="auth__switch">New to Noeve? <Link href="/register">Create an account</Link></p>
            <p style={{textAlign:'center',marginTop:'.5rem',fontSize:'.72rem',color:'rgba(33,29,25,.4)'}}>Demo: customer@noeve.local / Customer123!</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <nav className="breadcrumb"><Link href="/">Home</Link><span>/</span><span style={{color:'var(--ink)'}}>{tab === 'orders' ? 'Your Orders' : 'Account Details'}</span></nav>
      <div className="page-head" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'1rem'}}>
        <div>
          <p className="eyebrow">Account</p>
          <h1>{tab === 'orders' ? 'Your Orders' : 'Account Details'}</h1>
        </div>
        <button onClick={() => { logout(); setLoggedIn(false); setOrders([]); }} style={{fontFamily:'var(--mono)',fontSize:'.72rem',letterSpacing:'.08em',textTransform:'uppercase',textDecoration:'underline',color:'rgba(33,29,25,.55)',background:'none',border:'none',cursor:'pointer'}}>Sign Out</button>
      </div>

      <nav className="account-tabs">
        <a href="#" className={tab==='orders'?'is-active':''} onClick={e=>{e.preventDefault();setTab('orders')}}>Orders</a>
        <a href="#">Addresses</a>
        <a href="#" className={tab==='profile'?'is-active':''} onClick={e=>{e.preventDefault();setTab('profile')}}>Account Details</a>
        <a href="#">Wishlist</a>
      </nav>

      {tab === 'orders' && (
        <div className="orders-list">
          {orders.length === 0 ? (
            <p style={{padding:'3rem 0',textAlign:'center',color:'rgba(33,29,25,.55)'}}>No orders yet. <Link href="/#edit" style={{textDecoration:'underline',color:'var(--oxblood)'}}>Start shopping</Link></p>
          ) : orders.map(order => {
            const isOpen = openOrder === order.id;
            const statusClass = order.status === 'DELIVERED' ? 'status--delivered' : order.status === 'SHIPPED' ? 'status--shipped' : 'status--processing';
            return (
              <article key={order.id} className={`order-card ${isOpen?'is-open':''}`}>
                <div className="order-card__head" onClick={()=>toggleOrder(order.id)}>
                  <div>
                    <p className="order-card__id">{order.orderNumber}</p>
                    <p className="order-card__date">Placed {new Date(order.createdAt).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</p>
                  </div>
                  <div className="order-card__mid">
                    <span className={`status ${statusClass}`}>{order.status}</span>
                    <span className="order-card__total">{formatPrice(order.totalCents, order.currency)}</span>
                  </div>
                  <span className="order-card__chevron"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg></span>
                </div>
                {isOpen && (
                  <div className="order-card__body" style={{maxHeight:'600px'}}>
                    <div className="order-card__body-inner">
                      <div>
                        {order.lines?.map((line, i) => (
                          <div key={i} className="order-line">
                            <div><p className="order-line__name">{line.productName}</p><p className="order-line__meta">Qty {line.quantity}</p></div>
                            <span>{formatPrice(line.unitPriceCents * line.quantity, order.currency)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="order-meta">
                        <h4>Order Status</h4>
                        <p>{order.status}</p>
                      </div>
                    </div>
                    <div className="order-card__actions">
                      <Link href="/#edit" className="btn btn--primary">Buy Again</Link>
                      <a href="#" className="btn btn--outline">Need Help?</a>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {tab === 'profile' && (
        <div className="profile-layout">
          <aside className="profile-card">
            <div className="avatar">MK</div>
            <h3>Member</h3>
            <p className="email">{email || 'customer@noeve.local'}</p>
            <p className="since">Member Since 2025</p>
            <Link href="#" className="btn btn--outline" style={{width:'100%'}}>View Orders</Link>
          </aside>
          <div>
            <div className="section-card">
              <h2>Personal Information</h2>
              <p className="section-sub">Update your name, email and phone number.</p>
              <div className="form-row">
                <div className="form-field"><label>First Name</label><input type="text" defaultValue="Maren" style={{background:'var(--cream)'}}/></div>
                <div className="form-field"><label>Last Name</label><input type="text" defaultValue="K." style={{background:'var(--cream)'}}/></div>
              </div>
              <div className="form-field"><label>Email Address</label><input type="email" defaultValue={email || 'customer@noeve.local'} style={{background:'var(--cream)'}}/></div>
            </div>
            <div className="section-card">
              <h2>Email Preferences</h2>
              <p className="section-sub">Choose what you&apos;d like to hear from us about.</p>
              <div className="checkbox-row"><input type="checkbox" id="prefDrops" defaultChecked/><label htmlFor="prefDrops">New drops, early access and seasonal notes.</label></div>
              <div className="checkbox-row"><input type="checkbox" id="prefSms"/><label htmlFor="prefSms">SMS order and shipping updates.</label></div>
            </div>
            <div className="save-row">
              <button type="button" className="btn btn--primary">Save Changes</button>
              <a href="#" className="btn btn--outline">Cancel</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
