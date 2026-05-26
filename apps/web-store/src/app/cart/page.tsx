import Link from 'next/link';

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <h1 className="font-serif text-3xl font-semibold text-brand-primary">Your bag</h1>
      <p className="mt-2 text-neutral-600">Review items before checkout.</p>

      <div className="mt-12 flex flex-col items-center rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-accent-light/50 text-2xl">
          ✦
        </div>
        <p className="mt-6 font-medium text-brand-primary">Your bag is empty</p>
        <p className="mt-2 max-w-sm text-sm text-neutral-500">
          Discover pendants, fine jewellery, and care accessories from our collection.
        </p>
        <Link
          href="/shop"
          className="mt-8 rounded-full bg-brand-primary px-8 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          Continue shopping
        </Link>
      </div>

      <div className="mt-10 grid gap-4 rounded-xl border border-neutral-200 bg-neutral-50 p-6 text-sm text-neutral-600 md:grid-cols-3">
        <p>
          <span className="font-semibold text-brand-primary">Free guidance</span>
          <br />
          Care instructions included with every order.
        </p>
        <p>
          <span className="font-semibold text-brand-primary">Secure checkout</span>
          <br />
          Payment integration coming in the next release.
        </p>
        <p>
          <span className="font-semibold text-brand-primary">Order tracking</span>
          <br />
          Follow status from your account once signed in.
        </p>
      </div>
    </div>
  );
}
