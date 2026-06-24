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
        <span
          className="mb-6 inline-flex items-center gap-2 border px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.1em]"
          style={{
            background: 'var(--cream)',
            borderColor: 'var(--gold)',
            color: 'var(--ink)',
            transform: 'rotate(-2deg)',
            display: 'inline-block',
          }}
        >
          New Collection
        </span>

        <h1
          className={`font-display leading-[1.04] tracking-tight text-brand-primary ${compact ? 'text-3xl md:text-4xl' : 'text-5xl md:text-6xl lg:text-7xl'}`}
        >
          Fewer pieces.<br />
          <em className="not-italic" style={{ color: 'var(--gold)' }}>Finer ones.</em>
        </h1>

        <p
          className={`mt-6 leading-relaxed ${compact ? 'text-sm max-w-sm' : 'text-lg max-w-[34ch]'}`}
          style={{ color: 'rgba(26,26,26,0.72)', marginBottom: '2.2rem' }}
        >
          Effortless elegance in every piece — fine jewellery, pendants, and ladies accessories crafted for everyday radiance.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 border-none px-8 py-4 text-[0.85rem] font-semibold uppercase tracking-[0.05em] transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: 'var(--burgundy)', color: 'var(--cream)', borderRadius: '1px' }}
          >
            Shop the Collection
          </Link>
          <Link
            href="/shop?category=jewellery"
            className="inline-flex items-center gap-2 px-8 py-4 text-[0.85rem] font-semibold uppercase tracking-[0.05em] transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink hover:text-cream-DEFAULT"
            style={{ border: '1px solid var(--ink)', color: 'var(--ink)', borderRadius: '1px' }}
          >
            Explore Categories
          </Link>
        </div>
      </div>

      {/* Art side — decorative SVG jewel shape matching reference */}
      {!compact && (
        <div className="relative hidden md:block" aria-hidden="true">
          {/* Floating tag */}
          <span
            className="absolute left-[-6%] top-[6%] z-10 inline-block border px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.1em]"
            style={{
              background: 'var(--cream-deep)',
              borderColor: 'var(--gold)',
              color: 'var(--ink)',
              transform: 'rotate(-3deg)',
            }}
          >
            Handcrafted
          </span>
          <span
            className="absolute bottom-[8%] right-[-4%] z-10 inline-block border px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.1em]"
            style={{
              background: 'var(--cream-deep)',
              borderColor: 'var(--gold)',
              color: 'var(--ink)',
              transform: 'rotate(3deg)',
            }}
          >
            No. 01 — Signature Edit
          </span>

          {/* Decorative jewel-toned shapes */}
          <svg viewBox="0 0 560 660" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-lg">
            <defs>
              <linearGradient id="jg1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#e4d6a7"/>
                <stop offset="100%" stopColor="#cbb36b"/>
              </linearGradient>
              <linearGradient id="jg2" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fdfbf4"/>
                <stop offset="100%" stopColor="#ebdcc0"/>
              </linearGradient>
              <linearGradient id="jg3" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#5a0014"/>
                <stop offset="100%" stopColor="#8a1a30"/>
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
