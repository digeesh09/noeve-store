'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/cart/cart-provider';
import { formatPrice } from '@/lib/format';
import type { Product } from '@/lib/types';
import { isLoggedIn } from '@/lib/auth';
import { fetchWishlist, addToWishlist, removeFromWishlist } from '@/lib/wishlist';


interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

const FALLBACK_GALLERY_BGS = [
  'linear-gradient(135deg, #DCD3C2, #B89B6E)',
  'linear-gradient(200deg, #F6F1E8, #DCD3C2)',
  'radial-gradient(circle at 30% 30%, #F6F1E8, #B89B6E 80%)',
  'repeating-linear-gradient(100deg, #DCD3C2 0 8px, #EDE7DB 8px 16px)',
];

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps): React.JSX.Element {
  const router = useRouter();
  const { addItem } = useCart();
  const [activeThumb, setActiveThumb] = useState(0);
  const [activeVariant, setActiveVariant] = useState(product.variants?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [showAddedMsg, setShowAddedMsg] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center center', transform: 'scale(1)' });
  const [settings, setSettings] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  React.useEffect(() => {
    import('@/lib/api').then(({ apiClient }) => {
      apiClient.store.getSettings().then(res => setSettings(res.data)).catch(console.error);
      apiClient.store.getReviews(product.id).then(res => setReviews(res.data)).catch(console.error);
    });
  }, [product.id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn()) {
      alert('Please sign in to leave a review.');
      return;
    }
    setSubmittingReview(true);
    try {
      const { apiClient } = await import('@/lib/api');
      const res = await apiClient.store.addReview(product.id, { rating: reviewRating, comment: reviewText });
      setReviews([res.data, ...reviews]);
      setReviewText('');
    } catch (err) {
      console.error(err);
      alert('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const avgRating = reviews.length ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '5.0';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2)'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: 'center center',
      transform: 'scale(1)'
    });
  };

  React.useEffect(() => {
    if (isLoggedIn()) {
      fetchWishlist().then(items => {
        setInWishlist(items.some(item => item.productId === product.id));
      }).catch(err => console.error(err));
    }
  }, [product.id]);

  const handleWishlistToggle = async () => {
    if (!isLoggedIn()) {
      alert('Please sign in to save items to your wishlist.');
      return;
    }
    setWishlistLoading(true);
    try {
      if (inWishlist) {
        await removeFromWishlist(product.id);
        setInWishlist(false);
      } else {
        await addToWishlist(product.id);
        setInWishlist(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setWishlistLoading(false);
    }
  };

  const images = product.images?.length ? product.images : undefined;
  const activeImage = images ? (images[activeThumb] || images[0]) : undefined;

  const handleAddToBag = async () => {
    if (!activeVariant || (activeVariant.stockQuantity ?? 0) <= 0) return;
    setIsAdding(true);
    try {
      await addItem(product.id, activeVariant.id, quantity);
      setShowAddedMsg(true);
      setTimeout(() => setShowAddedMsg(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!activeVariant || (activeVariant.stockQuantity ?? 0) <= 0) return;
    setIsAdding(true);
    try {
      await addItem(product.id, activeVariant.id, quantity);
      router.push('/checkout');
    } catch (err) {
      console.error(err);
      setIsAdding(false);
    }
  };

  const handleAccordionToggle = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const categoryName = product.category?.name || 'Jewellery';
  const materialLabel = product.material || 'Fine Material';

  return (
    <div className="wrap">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/shop">Shop</Link>
        <span>/</span>
        <span style={{ color: 'var(--ink)' }}>{product.name}</span>
      </nav>

      {/* PDP Grid */}
      <section className="pdp">
        {/* Gallery */}
        <div className="pdp__gallery">
            <div
              className="pdp__main-image"
              style={{
                background: images ? 'transparent' : (activeThumb < FALLBACK_GALLERY_BGS.length ? FALLBACK_GALLERY_BGS[activeThumb] : FALLBACK_GALLERY_BGS[0]),
                position: 'relative',
                overflow: 'hidden',
                cursor: 'zoom-in',
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {activeImage && (
                <div style={{ position: 'absolute', inset: 0, transition: 'transform 0.1s ease-out', ...zoomStyle, pointerEvents: 'none' }}>
                  <Image
                    src={activeImage.url}
                    alt={activeImage.alt || product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
              )}
              <span className="tag tag--accent" style={{ zIndex: 10 }}>New Season</span>
            </div>

          <div className="pdp__thumbs">
            {images ? images.map((img, idx) => (
              <button
                key={idx}
                className={`pdp__thumb ${activeThumb === idx ? 'is-active' : ''}`}
                style={{ background: 'transparent', position: 'relative', overflow: 'hidden' }}
                onClick={() => setActiveThumb(idx)}
                aria-label={`View image ${idx + 1}`}
              >
                <Image
                  src={img.url}
                  alt={img.alt || `Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </button>
            )) : FALLBACK_GALLERY_BGS.map((bg, idx) => (
              <button
                key={idx}
                className={`pdp__thumb ${activeThumb === idx ? 'is-active' : ''}`}
                style={{ background: bg }}
                onClick={() => setActiveThumb(idx)}
                aria-label={`View image ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="pdp__info">
          <p className="eyebrow">
            {categoryName} — {materialLabel}
          </p>
          <h1 className="pdp__title">{product.name}</h1>

          <div className="pdp__rating">
            <span className="stars">{'★'.repeat(Math.round(Number(avgRating)))}{'☆'.repeat(5 - Math.round(Number(avgRating)))}</span>
            <a href="#reviews">{avgRating} ({reviews.length} reviews)</a>
          </div>

          <p className="pdp__price">{formatPrice(activeVariant ? activeVariant.priceCents : product.basePriceCents, product.currency)}</p>

          <p className="pdp__desc">
            {product.description ||
              'A beautifully detailed and premium quality addition to our curated drops, designed with clean silhouettes and made to last.'}
          </p>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="pdp__option">
              <div className="pdp__option-label">
                <span>Select Variant</span>
              </div>
              <div className="sizes" id="sizeGroup" style={{flexWrap: 'wrap'}}>
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    className={`size-pill ${activeVariant?.id === v.id ? 'is-active' : ''}`}
                    onClick={() => setActiveVariant(v)}
                    disabled={(v.stockQuantity ?? 0) <= 0}
                    style={{ 
                      opacity: (v.stockQuantity ?? 0) <= 0 ? 0.5 : 1, 
                      textDecoration: (v.stockQuantity ?? 0) <= 0 ? 'line-through' : 'none',
                      minWidth: 'auto',
                      padding: '0 1rem'
                    }}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
              {activeVariant && (activeVariant.stockQuantity ?? 0) <= 5 && (activeVariant.stockQuantity ?? 0) > 0 && (
                <p style={{fontSize: '0.85rem', color: 'var(--oxblood)', marginTop: '0.75rem'}}>Only {activeVariant.stockQuantity} left in stock!</p>
              )}
              {activeVariant && (activeVariant.stockQuantity ?? 0) <= 0 && (
                <p style={{fontSize: '0.85rem', color: 'var(--oxblood)', marginTop: '0.75rem'}}>Out of stock</p>
              )}
            </div>
          )}

          {/* Quantity Selector */}
          <div className="pdp__option">
            <div className="pdp__option-label">
              <span>Quantity</span>
            </div>
            <div className="qty">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity">
                −
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity">
                +
              </button>
            </div>
          </div>

          {/* Add Row */}
          <div className="pdp__add-row" style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn--outline" onClick={handleAddToBag} disabled={isAdding || (activeVariant ? (activeVariant.stockQuantity ?? 0) <= 0 : false)} style={{ flexGrow: 1 }}>
              {isAdding ? 'Adding…' : (activeVariant && (activeVariant.stockQuantity ?? 0) <= 0) ? 'Out of Stock' : 'Add to Bag'}
            </button>
            <button className="btn btn--primary" onClick={handleBuyNow} disabled={isAdding || (activeVariant ? (activeVariant.stockQuantity ?? 0) <= 0 : false)} style={{ flexGrow: 1 }}>
              Buy Now
            </button>
            <button
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
              className="btn btn--outline"
              style={{
                width: '54px',
                height: '54px',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
              title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={inWishlist ? 'var(--oxblood)' : 'none'} stroke={inWishlist ? 'var(--oxblood)' : 'currentColor'} strokeWidth="1.5">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
          </div>
          <p className={`pdp__added-msg ${showAddedMsg ? 'is-visible' : ''}`} id="addedMsg">
            Added to your bag.
          </p>

          <p className="pdp__note">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="7" width="18" height="13" rx="1" />
              <path d="M16 3v8M8 3v8" />
            </svg>
            Free shipping on orders over {settings ? formatPrice(settings.shippingThresholdCents, product.currency) : '₹15,000'} · 30-day returns
          </p>

          {/* Accordion */}
          <div className="accordion">
            <div className={`accordion__item ${openAccordion === 0 ? 'is-open' : ''}`}>
              <button className="accordion__trigger" onClick={() => handleAccordionToggle(0)}>
                Composition &amp; care
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d={openAccordion === 0 ? 'M5 12h14' : 'M12 5v14M5 12h14'} />
                </svg>
              </button>
              <div className="accordion__panel" style={{ maxHeight: openAccordion === 0 ? '400px' : '0' }}>
                <div className="accordion__panel-inner">
                  {product.composition && <p style={{ marginBottom: '0.5rem' }}><strong>Composition:</strong> {product.composition}</p>}
                  {product.careInstructions ? <p>{product.careInstructions}</p> :
                    <p>100% premium quality composition. Hand wash cold and lay flat to dry. Cool iron on the reverse side only.</p>}
                </div>
              </div>
            </div>

            <div className={`accordion__item ${openAccordion === 1 ? 'is-open' : ''}`}>
              <button className="accordion__trigger" onClick={() => handleAccordionToggle(1)}>
                Fit &amp; sizing
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d={openAccordion === 1 ? 'M5 12h14' : 'M12 5v14M5 12h14'} />
                </svg>
              </button>
              <div className="accordion__panel" style={{ maxHeight: openAccordion === 1 ? '400px' : '0' }}>
                <div className="accordion__panel-inner">
                  {product.sizeAndFit || "Relaxed through the body, true to size. Our model is 5'9\" wearing a size S. Size up for an oversized drape."}
                </div>
              </div>
            </div>

            <div className={`accordion__item ${openAccordion === 2 ? 'is-open' : ''}`}>
              <button className="accordion__trigger" onClick={() => handleAccordionToggle(2)}>
                Shipping &amp; returns
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d={openAccordion === 2 ? 'M5 12h14' : 'M12 5v14M5 12h14'} />
                </svg>
              </button>
              <div className="accordion__panel" style={{ maxHeight: openAccordion === 2 ? '400px' : '0' }}>
                <div className="accordion__panel-inner">
                  {product.shippingAndReturns || product.category?.returnPolicy || `Dispatched within 1–2 business days. Free standard shipping on orders over ${settings ? formatPrice(settings.shippingThresholdCents, product.currency) : '₹15,000'}. Unworn items may be returned within 30 days for a full refund.`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="related">
        <div className="section-head">
          <h2>You may also like</h2>
          <p className="eyebrow">From the current edit</p>
        </div>
        <div className="related__grid">
          {relatedProducts.slice(0, 4).map((rp, idx) => (
            <Link key={rp.id} className="card" href={`/shop/${rp.slug}`}>
              <div
                className="card__media"
                style={{
                  background: FALLBACK_GALLERY_BGS[idx % FALLBACK_GALLERY_BGS.length],
                }}
              >
                {rp.images?.[0] && (
                  <Image
                    src={rp.images[0].url}
                    alt={rp.images[0].alt || rp.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                )}
              </div>
              <h3 className="card__name">{rp.name}</h3>
              <p className="card__meta">
                {rp.category?.name || 'Jewellery'} — {rp.material || 'Material'} — {formatPrice(rp.basePriceCents, rp.currency)}
              </p>
              <div className="card__rating">
                <span className="card__stars">★★★★★</span>
                <span className="card__rating-text">5.0 (0)</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="reviews" id="reviews">
        <div className="section-head">
          <h2>Customer reviews</h2>
        </div>
        <div className="reviews__summary">
          <div className="reviews__score">
            <span className="big">{avgRating}</span>
            <span className="stars">{'★'.repeat(Math.round(Number(avgRating)))}{'☆'.repeat(5 - Math.round(Number(avgRating)))}</span>
            <span className="count">{reviews.length} reviews</span>
          </div>
          <div className="reviews__bars">
            {[5, 4, 3, 2, 1].map(star => {
              const count = reviews.filter(r => r.rating === star).length;
              const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
              return (
                <div className="reviews__bar-row" key={star}>
                  <span>{star}★</span>
                  <div className="reviews__bar-track">
                    <div className="reviews__bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmitReview} style={{ marginBottom: '3rem', padding: '1.5rem', background: 'var(--cream)', border: '1px solid rgba(33,29,25,.1)' }}>
          <h3 style={{ marginBottom: '1rem', fontFamily: 'var(--display)' }}>Write a review</h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Rating</label>
            <select value={reviewRating} onChange={e => setReviewRating(Number(e.target.value))} style={{ padding: '0.5rem', border: '1px solid rgba(33,29,25,.2)' }}>
              {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Comment</label>
            <textarea required value={reviewText} onChange={e => setReviewText(e.target.value)} rows={3} style={{ width: '100%', padding: '0.5rem', border: '1px solid rgba(33,29,25,.2)', fontFamily: 'inherit' }} />
          </div>
          <button type="submit" className="btn btn--primary" disabled={submittingReview}>
            {submittingReview ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>

        <div className="testimonials__grid">
          {reviews.length === 0 ? (
            <p style={{ color: 'rgba(33,29,25,0.6)' }}>No reviews yet. Be the first to review this product!</p>
          ) : (
            reviews.map(review => (
              <div className="testimonial" key={review.id}>
                <span className="testimonial__stars">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                <p className="testimonial__quote">
                  {review.comment}
                </p>
                <div className="testimonial__byline">
                  <span className="testimonial__name">{review.user?.firstName || 'Anonymous'}</span>
                  <span className="tag">Verified Buyer</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
