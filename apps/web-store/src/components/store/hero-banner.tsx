import Link from 'next/link';
import React from 'react';

interface HeroBannerProps {
  compact?: boolean;
}

export function HeroBanner({ compact }: HeroBannerProps): React.JSX.Element {
  return (
    <section
      className={`grid items-center gap-12 ${compact ? 'py-10' : 'py-20 md:py-28'} ${compact ? '' : 'md:grid-cols-[1.1fr_0.9fr]'}`}
      style={{ minHeight: compact ? 'auto' : '72vh' }}
    >
      {/* Text side */}
      <div>
        {/* Rotating tag */}
        <span className="tag mb-6">
          New Collection
        </span>

        <h1
          className="font-display leading-[1.04] tracking-tight mb-6 mt-4"
          style={{ fontSize: compact ? 'clamp(2rem, 4vw, 3rem)' : 'clamp(2.6rem, 6.2vw, 5.1rem)' }}
        >
          Fewer pieces.<br />
          Finer <em className="italic text-brand-primary">ones.</em>
        </h1>

        <p
          className="leading-relaxed"
          style={{ 
            color: 'rgba(33,29,25,0.78)', 
            marginBottom: '2.2rem', 
            maxWidth: compact ? '30ch' : '34ch', 
            fontSize: compact ? '0.95rem' : '1.08rem' 
          }}
        >
          Effortless elegance in every piece — fine jewellery, pendants, and ladies accessories crafted for everyday radiance.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link href="/shop" className="btn btn--primary">
            Shop the Collection
          </Link>
          <Link href="/shop?category=jewellery" className="btn btn--outline">
            Explore Categories
          </Link>
        </div>
      </div>

      {/* Art side — decorative SVG jewel shape matching reference */}
      {!compact && (
        <div className="relative hidden md:block" aria-hidden="true">
          {/* Floating tag */}
          <span className="tag absolute left-[-6%] top-[6%] z-10">
            Handcrafted
          </span>
          <span className="tag absolute bottom-[8%] right-[-4%] z-10">
            No. 01 — Signature Edit
          </span>

          {/* Decorative jewel-toned shapes */}
          <svg viewBox="0 0 560 660" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-lg">
            <defs>
              <linearGradient id="jg1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#DCD3C2"/>
                <stop offset="100%" stopColor="#B89B6E"/>
              </linearGradient>
              <linearGradient id="jg2" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F6F1E8"/>
                <stop offset="100%" stopColor="#DCD3C2"/>
              </linearGradient>
              <linearGradient id="jg3" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#6B2230"/>
                <stop offset="100%" stopColor="#8a3744"/>
              </linearGradient>
            </defs>
            <path d="M60 40 C200 10, 380 90, 420 230 C460 370, 320 420, 260 540 C220 620, 140 640, 90 600 C30 555, 80 470, 150 420 C230 365, 250 280, 190 210 C130 140, 20 120, 60 40 Z" fill="url(#jg1)"/>
            <path d="M340 20 C440 60, 520 180, 480 300 C440 420, 320 400, 300 500 C285 575, 360 620, 440 600 L520 640 L540 80 Z" fill="url(#jg2)" opacity="0.85"/>
            <path d="M120 480 C160 440, 230 450, 250 510 C268 565, 210 610, 160 600 C112 590, 90 515, 120 480 Z" fill="url(#jg3)"/>
          </svg>
        </div>
      )}
    </section>
  );
}
