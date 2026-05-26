import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 text-center">
      <p className="text-sm uppercase tracking-widest text-brand-accent">New collection</p>
      <h1 className="mt-4 font-serif text-5xl font-semibold text-brand-primary md:text-6xl">
        Timeless jewellery, crafted for you
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-lg text-neutral-600">
        Explore pendants, fine jewellery, and ladies care accessories — curated by Noeve.
      </p>
      <div className="mt-10 flex justify-center gap-4">
        <Link
          href="/shop"
          className="rounded-full bg-brand-primary px-8 py-3 text-sm font-medium text-white hover:opacity-90"
        >
          Shop now
        </Link>
        <Link
          href="/shop?category=pendants"
          className="rounded-full border border-brand-primary px-8 py-3 text-sm font-medium text-brand-primary hover:bg-brand-primary/5"
        >
          View pendants
        </Link>
      </div>
    </section>
  );
}
