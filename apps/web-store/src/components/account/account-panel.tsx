'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { isLoggedIn, loginStore, logout } from '@/lib/auth';
import { fetchMyOrders, type Order } from '@/lib/orders';
import { formatPrice } from '@/lib/format';
import { fetchWishlist, removeFromWishlist, type WishlistItem } from '@/lib/wishlist';
import { fetchAddresses, addAddress, updateAddress, deleteAddress, type Address } from '@/lib/addresses';

export function AccountPanel(): React.JSX.Element {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState<'orders'|'profile'|'wishlist'|'addresses'|'inbox'>('orders');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressForm, setAddressForm] = useState<Partial<Address> | null>(null);
  const [savingAddress, setSavingAddress] = useState(false);
  const [openOrder, setOpenOrder] = useState<string|null>(null);
  const [inbox, setInbox] = useState<any[]>([]);
  const [inboxForm, setInboxForm] = useState(false);
  const [inboxSubject, setInboxSubject] = useState('');
  const [inboxMessage, setInboxMessage] = useState('');

  useEffect(() => { 
    setLoggedIn(isLoggedIn()); 
    if (typeof window !== 'undefined') {
      const search = new URLSearchParams(window.location.search);
      if (search.get('tab') === 'addresses') {
        setTab('addresses');
        if (search.get('new') === '1') {
          setAddressForm({ country: 'India' });
        }
      }
    }
  }, []);
  useEffect(() => {
    if (!loggedIn) return;
    fetchOrders();
    fetchWishlistData();
    fetchAddressesData();
    fetchInbox();
  }, [loggedIn]);

  const fetchOrders = () => fetchMyOrders().then(setOrders).catch(() => setOrders([]));
  const fetchWishlistData = () => fetchWishlist().then(setWishlist).catch(() => setWishlist([]));
  const fetchAddressesData = () => fetchAddresses().then(setAddresses).catch(() => setAddresses([]));
  const fetchInbox = () => import('@/lib/api').then(({ apiClient }) => apiClient.store.getMySupportTickets().then(res => setInbox(res.data)).catch(() => setInbox([])));

  useEffect(() => {
    if (loggedIn && tab === 'wishlist') fetchWishlistData();
    if (loggedIn && tab === 'addresses') fetchAddressesData();
    if (loggedIn && tab === 'inbox') fetchInbox();
  }, [loggedIn, tab]);

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
      <nav className="breadcrumb"><Link href="/">Home</Link><span>/</span><span style={{color:'var(--ink)'}}>{tab === 'orders' ? 'Your Orders' : tab === 'profile' ? 'Account Details' : 'Wishlist'}</span></nav>
      <div className="page-head" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'1rem'}}>
        <div>
          <p className="eyebrow">Account</p>
          <h1>{tab === 'orders' ? 'Your Orders' : tab === 'profile' ? 'Account Details' : 'Wishlist'}</h1>
        </div>
        <button onClick={() => { logout(); setLoggedIn(false); setOrders([]); setWishlist([]); }} style={{fontFamily:'var(--mono)',fontSize:'.72rem',letterSpacing:'.08em',textTransform:'uppercase',textDecoration:'underline',color:'rgba(33,29,25,.55)',background:'none',border:'none',cursor:'pointer'}}>Sign Out</button>
      </div>

      <nav className="account-tabs">
        <a href="#" className={tab==='orders'?'is-active':''} onClick={e=>{e.preventDefault();setTab('orders')}}>Orders</a>
        <a href="#" className={tab==='addresses'?'is-active':''} onClick={e=>{e.preventDefault();setTab('addresses')}}>Addresses</a>
        <a href="#" className={tab==='profile'?'is-active':''} onClick={e=>{e.preventDefault();setTab('profile')}}>Account Details</a>
        <a href="#" className={tab==='wishlist'?'is-active':''} onClick={e=>{e.preventDefault();setTab('wishlist')}}>Wishlist</a>
        <a href="#" className={tab==='inbox'?'is-active':''} onClick={e=>{e.preventDefault();setTab('inbox')}}>Inbox</a>
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
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                              <Link href={`/shop/${line.productSlug}`} style={{ display: 'block', position: 'relative', width: '56px', height: '56px', flexShrink: 0, background: 'linear-gradient(135deg,#DCD3C2,#B89B6E)' }}>
                                {line.imageUrl && <Image src={line.imageUrl} alt={line.productName} fill style={{ objectFit: 'cover' }} />}
                              </Link>
                              <div>
                                <Link href={`/shop/${line.productSlug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                  <p className="order-line__name">{line.productName}</p>
                                </Link>
                                <p className="order-line__meta">Qty {line.quantity}</p>
                              </div>
                            </div>
                            <span>{formatPrice(line.unitPriceCents * line.quantity, order.currency)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="order-meta" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(33,29,25,.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem' }}>
                          <span style={{ color: 'rgba(33,29,25,.7)' }}>Subtotal</span>
                          <span>{formatPrice(order.subtotalCents, order.currency)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem' }}>
                          <span style={{ color: 'rgba(33,29,25,.7)' }}>Shipping</span>
                          <span>{formatPrice(order.shippingCents, order.currency)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem' }}>
                          <span style={{ color: 'rgba(33,29,25,.7)' }}>Tax</span>
                          <span>{formatPrice(order.taxCents, order.currency)}</span>
                        </div>
                        {(order.discountCents ?? 0) > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem', color: 'var(--brand-primary)' }}>
                            <span>Discount {order.promotionCode ? `(${order.promotionCode})` : ''}</span>
                            <span>-{formatPrice(order.discountCents || 0, order.currency)}</span>
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, marginTop: '.5rem', paddingTop: '.5rem', borderTop: '1px solid rgba(33,29,25,.1)' }}>
                          <span>Total</span>
                          <span>{formatPrice(order.totalCents, order.currency)}</span>
                        </div>
                      </div>
                      <div className="order-meta" style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                          <h4 style={{ fontSize: '.9rem', fontWeight: 600, marginBottom: '.25rem' }}>Fulfillment Status</h4>
                          <p style={{ fontSize: '.85rem', color: 'rgba(33,29,25,.8)' }}>{order.status}</p>
                          {order.trackingNumber && (
                            <p style={{ fontSize: '.85rem', color: 'rgba(33,29,25,.7)', marginTop: '.25rem' }}>
                              Tracking: {order.trackingNumber} {order.carrier ? `(${order.carrier})` : ''}
                            </p>
                          )}
                        </div>
                        {order.statusHistory && order.statusHistory.length > 0 && order.statusHistory[0].note && (
                          <div>
                            <h4 style={{ fontSize: '.9rem', fontWeight: 600, marginBottom: '.25rem' }}>Delivery & Gift Details</h4>
                            <div style={{ fontSize: '.85rem', color: 'rgba(33,29,25,.8)', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
                              {order.statusHistory[0].note}
                            </div>
                          </div>
                        )}
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

      {tab === 'addresses' && (
        <div className="addresses-list">
          {addressForm ? (
              <form className="section-card" onSubmit={async (e) => {
              e.preventDefault();
              setSavingAddress(true);
              try {
                if (addressForm.id) {
                  await updateAddress(addressForm.id, addressForm as any);
                } else {
                  await addAddress(addressForm as any);
                }
                const newAddrs = await fetchAddresses();
                setAddresses(newAddrs);
                setAddressForm(null);
                
                // If came from checkout, redirect back to checkout
                if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('redirect') === 'checkout') {
                  window.location.href = '/checkout';
                }
              } catch (err) {
                alert(err instanceof Error ? err.message : 'Failed to save address');
              } finally {
                setSavingAddress(false);
              }
            }}>
              <h2>{addressForm.id ? 'Edit Address' : 'New Address'}</h2>
              <div className="form-row">
                <div className="form-field"><label>Name</label><input required minLength={2} maxLength={100} value={addressForm.name || ''} onChange={e=>setAddressForm({...addressForm, name: e.target.value})} /></div>
                <div className="form-field"><label>Mobile Number</label><input required pattern="\d{10}" title="Mobile number must be exactly 10 digits" value={addressForm.phone || ''} onChange={e=>setAddressForm({...addressForm, phone: e.target.value})} placeholder="10-digit number" /></div>
              </div>
              <div className="form-field"><label>Address Line 1</label><input required maxLength={255} value={addressForm.streetLine1 || ''} onChange={e=>setAddressForm({...addressForm, streetLine1: e.target.value})} /></div>
              <div className="form-field"><label>Address Line 2 (Optional)</label><input maxLength={255} value={addressForm.streetLine2 || ''} onChange={e=>setAddressForm({...addressForm, streetLine2: e.target.value})} /></div>
              <div className="form-row">
                <div className="form-field"><label>City</label><input required maxLength={100} value={addressForm.city || ''} onChange={e=>setAddressForm({...addressForm, city: e.target.value})} /></div>
                <div className="form-field"><label>State</label><input required maxLength={100} value={addressForm.state || ''} onChange={e=>setAddressForm({...addressForm, state: e.target.value})} /></div>
              </div>
              <div className="form-row">
                <div className="form-field"><label>Postal Code</label><input required maxLength={20} value={addressForm.postalCode || ''} onChange={e=>setAddressForm({...addressForm, postalCode: e.target.value})} /></div>
                <div className="form-field"><label>Country</label><select required value={addressForm.country || 'India'} onChange={e=>setAddressForm({...addressForm, country: e.target.value})} style={{width:'100%',padding:'0.85em 1em',border:'1px solid rgba(33,29,25,.25)',background:'transparent',fontSize:'.95rem',outline:'none',borderRadius:'1px'}}><option value="India">India</option></select></div>
              </div>
              <div className="checkbox-row" style={{marginBottom: '1rem'}}><input type="checkbox" id="isDefault" checked={addressForm.isDefault || false} onChange={e=>setAddressForm({...addressForm, isDefault: e.target.checked})} /><label htmlFor="isDefault">Set as default</label></div>
              <div className="save-row">
                <button type="submit" disabled={savingAddress} className="btn btn--primary" style={{display:'flex',gap:'0.5rem',alignItems:'center'}}>
                  {savingAddress ? (
                    <><svg className="spinner" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{animation:'spin 1s linear infinite'}}><circle cx="12" cy="12" r="10" strokeDasharray="30" strokeDashoffset="10"/></svg> Processing...</>
                  ) : 'Save'}
                </button>
                <button type="button" disabled={savingAddress} className="btn btn--outline" onClick={() => setAddressForm(null)}>Cancel</button>
              </div>
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </form>
          ) : (
            <>
              <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem'}}>
                <button onClick={() => setAddressForm({ country: 'India' })} className="btn btn--primary">Add New Address</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(addresses || []).length === 0 ? (
                  <p style={{padding:'3rem 0',color:'rgba(33,29,25,.55)',gridColumn:'1/-1',textAlign:'center'}}>No addresses saved yet.</p>
                ) : (addresses || []).map(addr => (
                  <div key={addr.id} className="section-card" style={{position:'relative', padding:'1.5rem'}}>
                    {addr.isDefault && <span className="tag" style={{position:'absolute',top:'1rem',right:'1rem'}}>Default</span>}
                    <h4 style={{marginBottom:'.5rem'}}>{addr.name}</h4>
                    <p style={{fontSize:'.875rem',color:'rgba(33,29,25,.7)',marginBottom:'.25rem'}}>{addr.streetLine1}</p>
                    {addr.streetLine2 && <p style={{fontSize:'.875rem',color:'rgba(33,29,25,.7)',marginBottom:'.25rem'}}>{addr.streetLine2}</p>}
                    <p style={{fontSize:'.875rem',color:'rgba(33,29,25,.7)',marginBottom:'.25rem'}}>{addr.city}, {addr.state} {addr.postalCode}</p>
                    <p style={{fontSize:'.875rem',color:'rgba(33,29,25,.7)',marginBottom:'1rem'}}>Phone: {addr.phone}</p>
                    <div style={{display:'flex',gap:'1rem'}}>
                      <button onClick={()=>setAddressForm(addr)} style={{fontFamily:'var(--mono)',fontSize:'.75rem',textTransform:'uppercase',textDecoration:'underline',background:'none',border:'none',cursor:'pointer'}}>Edit</button>
                      <button onClick={async ()=>{
                        if(confirm('Are you sure you want to delete this address?')) {
                          try { await deleteAddress(addr.id); setAddresses(await fetchAddresses()); }
                          catch(err) { alert('Failed to delete'); }
                        }
                      }} style={{fontFamily:'var(--mono)',fontSize:'.75rem',textTransform:'uppercase',textDecoration:'underline',color:'var(--oxblood)',background:'none',border:'none',cursor:'pointer'}}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
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

      {tab === 'wishlist' && (
        <div className="wishlist-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
          {wishlist.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '4rem 0', textAlign: 'center', color: 'rgba(33,29,25,.55)' }}>
              <p style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', marginBottom: '1.5rem' }}>Your wishlist is empty.</p>
              <Link href="/shop" className="btn btn--primary" style={{ display: 'inline-block' }}>
                Explore Collection
              </Link>
            </div>
          ) : (
            wishlist.map(item => (
              <article key={item.id} className="product-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    try {
                      const updated = await removeFromWishlist(item.productId);
                      setWishlist(updated);
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    zIndex: 10,
                    background: 'var(--cream)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                  }}
                  title="Remove from wishlist"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--oxblood)" stroke="var(--oxblood)" strokeWidth="2">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                  </svg>
                </button>
                <Link href={`/shop/${item.productSlug}`} style={{ display: 'block', flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
                  <div className="product-card__media" style={{ position: 'relative', overflow: 'hidden', paddingBottom: '120%', background: 'var(--cream)', borderRadius: '4px' }}>
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(33,29,25,.3)' }}>
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="product-card__meta" style={{ marginTop: '1rem' }}>
                    <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', margin: '0 0 0.5rem 0' }}>{item.productName}</h3>
                    <p style={{ fontFamily: 'var(--mono)', fontSize: '0.85rem', color: 'var(--oxblood)', margin: 0 }}>
                      {formatPrice(item.basePriceCents, item.currency)}
                    </p>
                  </div>
                </Link>
              </article>
            ))
          )}
        </div>
      )}
      {tab === 'inbox' && (
        <div className="addresses-list">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 className="text-xl">Your Messages</h2>
            <button className="btn btn--primary" onClick={() => setInboxForm(true)}>New Message</button>
          </div>

          {inboxForm && (
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const { apiClient } = await import('@/lib/api');
                await apiClient.store.createSupportTicket({ name: 'User', email: 'user@example.com', subject: inboxSubject, message: inboxMessage });
                setInboxForm(false);
                setInboxSubject('');
                setInboxMessage('');
                fetchInbox();
              } catch (err) {
                console.error(err);
              }
            }} style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid var(--bone)', borderRadius: '4px' }}>
              <h3 style={{ marginBottom: '1rem' }}>New Message</h3>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase' }}>Subject</label>
                <input required value={inboxSubject} onChange={e => setInboxSubject(e.target.value)} style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--bone)', background: 'transparent' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase' }}>Message</label>
                <textarea required rows={4} value={inboxMessage} onChange={e => setInboxMessage(e.target.value)} style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--bone)', background: 'transparent' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn--primary">Send</button>
                <button type="button" className="btn btn--secondary" onClick={() => setInboxForm(false)}>Cancel</button>
              </div>
            </form>
          )}

          {inbox.length === 0 && !inboxForm ? (
            <p style={{padding:'3rem 0',textAlign:'center',color:'rgba(33,29,25,.55)'}}>You have no messages.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {inbox.map(ticket => (
                <div key={ticket.id} style={{ padding: '1.5rem', border: '1px solid var(--bone)', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem' }}>{ticket.subject}</h3>
                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: ticket.status === 'OPEN' ? 'var(--oxblood)' : 'var(--ink)', background: 'var(--bone)', padding: '0.2rem 0.5rem', borderRadius: '2px' }}>{ticket.status}</span>
                  </div>
                  <p style={{ color: 'rgba(33,29,25,.7)', fontSize: '0.9rem', marginBottom: '1rem' }}>{new Date(ticket.createdAt).toLocaleString()}</p>
                  <p>{ticket.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
