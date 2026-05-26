import Link from 'next/link';

interface HeroBannerProps {
  compact?: boolean;
}

export function HeroBanner({ compact }: HeroBannerProps) {
  return (
    <section
      className={`relative overflow-hidden rounded-2xl bg-brand-primary text-white ${
        compact ? 'px-6 py-10 md:py-12' : 'px-6 py-16 md:px-12 md:py-24'
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 70% 20%, #D4AF37 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 10% 80%, #F5E6B8 0%, transparent 50%)',
        }}
      />
      <div className="relative max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-accent">Noeve</p>
        <h1
          className={`mt-3 font-serif font-semibold leading-tight ${
            compact ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl lg:text-6xl'
          }`}
        >
          Jewellery that speaks quietly, shines boldly
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-neutral-300 md:text-base">
          Pendants, fine gold pieces, and curated care accessories — designed for everyday elegance.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/shop"
            className="rounded-full bg-brand-accent px-6 py-2.5 text-sm font-semibold text-brand-primary transition hover:bg-brand-accent-light"
          >
            Shop collection
          </Link>
          <Link
            href="/shop?category=pendants"
            className="rounded-full border border-white/40 px-6 py-2.5 text-sm font-medium transition hover:bg-white/10"
          >
            Explore pendants
          </Link>
        </div>
      </div>
    </section>
  );
}
