import Link from 'next/link';

interface HeroBannerProps {
  compact?: boolean;
}

export function HeroBanner({ compact }: HeroBannerProps): React.JSX.Element {
  return (
    <section
      className={`relative overflow-hidden rounded-2xl bg-neutral-50 text-neutral-900 border border-brand-accent/20 shadow-[0_4px_30px_rgba(203,179,107,0.08)] ${
        compact ? 'px-6 py-10 md:py-12' : 'px-6 py-16 md:px-12 md:py-24'
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 75% 15%, #D4AF37 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 10% 85%, #F5E6B8 0%, transparent 55%)',
        }}
      />
      <div className="relative max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-accent">Noeve Collections</p>
        <h1
          className={`mt-4 font-montserrat font-semibold leading-tight text-brand-primary ${
            compact ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl lg:text-6xl'
          }`}
        >
          Effortless Elegance in Every Piece
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-neutral-800 md:text-base">
          Fine gold pieces, diamond pendants, and curated ladies accessories — crafted for everyday elegance and lifetime warranty.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/shop"
            className="rounded-full bg-brand-accent px-8 py-3 text-sm font-semibold text-brand-primary transition-all duration-300 hover:scale-[1.03] hover:bg-brand-accent-gold hover:shadow-[0_0_15px_rgba(203,179,107,0.4)]"
          >
            Shop collection
          </Link>
          <Link
            href="/shop?category=pendants"
            className="rounded-full border border-brand-accent bg-transparent px-8 py-3 text-sm font-medium text-brand-primary transition-all duration-300 hover:scale-[1.03] hover:bg-brand-accent/10"
          >
            Explore pendants
          </Link>
        </div>
      </div>
    </section>
  );
}

