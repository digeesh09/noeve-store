'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/cart/cart-provider';
import { formatPrice } from '@/lib/format';
import type { Product } from '@/lib/types';

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
  const { addItem } = useCart();
  const [activeThumb, setActiveThumb] = useState(0);
  const [activeColor, setActiveColor] = useState('Ivory');
  const [activeSize, setActiveSize] = useState('S');
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [showAddedMsg, setShowAddedMsg] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const images = product.images || [];
  const mainImage = images[0];

  const handleAddToBag = async () => {
    setIsAdding(true);
    try {
      await addItem(product.id, product.variants?.[0]?.id, quantity);
      setShowAddedMsg(true);
      setTimeout(() => setShowAddedMsg(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
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
              background: activeThumb < FALLBACK_GALLERY_BGS.length ? FALLBACK_GALLERY_BGS[activeThumb] : FALLBACK_GALLERY_BGS[0],
            }}
          >
            {mainImage && (
              <Image
                src={mainImage.url}
                alt={mainImage.alt || product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            )}
            <span className="tag tag--accent">New Season</span>
          </div>

          <div className="pdp__thumbs">
            {FALLBACK_GALLERY_BGS.map((bg, idx) => (
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
            <span className="stars">★★★★★</span>
            <a href="#reviews">4.9 (184 reviews)</a>
          </div>

          <p className="pdp__price">{formatPrice(product.basePriceCents, product.currency)}</p>

          <p className="pdp__desc">
            {product.description ||
              'A beautifully detailed and premium quality addition to our curated drops, designed with clean silhouettes and made to last.'}
          </p>

          {/* Color Option */}
          <div className="pdp__option">
            <div className="pdp__option-label">
              <span>Colour</span> <b id="colorLabel">{activeColor}</b>
            </div>
            <div className="swatches">
              {['Ivory', 'Black', 'Clay'].map((color) => {
                const bg = color === 'Ivory' ? '#F6F1E8' : color === 'Black' ? '#211D19' : '#B89B6E';
                return (
                  <button
                    key={color}
                    className={`swatch ${activeColor === color ? 'is-active' : ''}`}
                    style={{ background: bg }}
                    onClick={() => setActiveColor(color)}
                    aria-label={color}
                  />
                );
              })}
            </div>
          </div>

          {/* Size Option */}
          <div className="pdp__option">
            <div className="pdp__option-label">
              <span>Size</span>{' '}
              <a href="#" style={{ textDecoration: 'underline', color: 'rgba(33,29,25,.6)' }}>
                Size guide
              </a>
            </div>
            <div className="sizes" id="sizeGroup">
              {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                <button
                  key={size}
                  className={`size-pill ${activeSize === size ? 'is-active' : ''}`}
                  onClick={() => setActiveSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

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
          <div className="pdp__add-row">
            <button className="btn btn--primary" onClick={handleAddToBag} disabled={isAdding}>
              {isAdding ? 'Adding…' : `Add to Bag — ${formatPrice(product.basePriceCents * quantity, product.currency)}`}
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
            Free shipping on orders over $150 · 30-day returns
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
              <div className="accordion__panel" style={{ maxHeight: openAccordion === 0 ? '120px' : '0' }}>
                <div className="accordion__panel-inner">
                  {product.careInstructions ||
                    '100% premium quality composition. Hand wash cold and lay flat to dry. Cool iron on the reverse side only.'}
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
              <div className="accordion__panel" style={{ maxHeight: openAccordion === 1 ? '120px' : '0' }}>
                <div className="accordion__panel-inner">
                  Relaxed through the body, true to size. Our model is 5&apos;9&quot; wearing a size S. Size up for an oversized drape.
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
              <div className="accordion__panel" style={{ maxHeight: openAccordion === 2 ? '120px' : '0' }}>
                <div className="accordion__panel-inner">
                  Dispatched within 1–2 business days. Free standard shipping on orders over $150. Unworn items may be returned within 30 days for a full refund.
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
                <span className="card__rating-text">4.9 (184)</span>
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
            <span className="big">4.9</span>
            <span className="stars">★★★★★</span>
            <span className="count">184 reviews</span>
          </div>
          <div className="reviews__bars">
            <div className="reviews__bar-row">
              <span>5★</span>
              <div className="reviews__bar-track">
                <div className="reviews__bar-fill" style={{ width: '82%' }} />
              </div>
              <span>82%</span>
            </div>
            <div className="reviews__bar-row">
              <span>4★</span>
              <div className="reviews__bar-track">
                <div className="reviews__bar-fill" style={{ width: '13%' }} />
              </div>
              <span>13%</span>
            </div>
            <div className="reviews__bar-row">
              <span>3★</span>
              <div className="reviews__bar-track">
                <div className="reviews__bar-fill" style={{ width: '3%' }} />
              </div>
              <span>3%</span>
            </div>
            <div className="reviews__bar-row">
              <span>2★</span>
              <div className="reviews__bar-track">
                <div className="reviews__bar-fill" style={{ width: '1%' }} />
              </div>
              <span>1%</span>
            </div>
            <div className="reviews__bar-row">
              <span>1★</span>
              <div className="reviews__bar-track">
                <div className="reviews__bar-fill" style={{ width: '1%' }} />
              </div>
              <span>1%</span>
            </div>
          </div>
        </div>

        <div className="testimonials__grid">
          <div className="testimonial">
            <span className="testimonial__stars">★★★★★</span>
            <p className="testimonial__quote">
              Heavier than I expected in the best way — it drapes instead of clinging. Runs true to size.
            </p>
            <div className="testimonial__byline">
              <span className="testimonial__name">Anjali R. — Singapore</span>
              <span className="tag">Verified Buyer</span>
            </div>
          </div>
          <div className="testimonial">
            <span className="testimonial__stars">★★★★★</span>
            <p className="testimonial__quote">
              Wore it to a wedding tied at the waist and again the next day buttoned up for work. One shirt, two completely different looks.
            </p>
            <div className="testimonial__byline">
              <span className="testimonial__name">Beatriz F. — Lisbon, PT</span>
              <span className="tag">Verified Buyer</span>
            </div>
          </div>
          <div className="testimonial">
            <span className="testimonial__stars">★★★★☆</span>
            <p className="testimonial__quote">
              Beautiful fabric and stitching. Only note is the ivory marks easily, so I&apos;d dry clean rather than hand wash.
            </p>
            <div className="testimonial__byline">
              <span className="testimonial__name">Sofia M. — Toronto, CA</span>
              <span className="tag">Verified Buyer</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
