import Link from 'next/link';

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-accent">Account</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-brand-primary">Welcome back</h1>
          <p className="mt-2 text-neutral-600">
            Sign in to track orders, save addresses, and manage your profile.
          </p>

          <form className="mt-8 space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm outline-none ring-brand-accent focus:ring-2"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm outline-none ring-brand-accent focus:ring-2"
              />
            </div>
            <button
              type="button"
              className="w-full rounded-full bg-brand-primary py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Sign in
            </button>
            <p className="text-center text-xs text-neutral-500">
              New to Noeve?{' '}
              <button type="button" className="font-medium text-brand-accent hover:underline">
                Create an account
              </button>
            </p>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-brand-primary p-6 text-white">
            <h2 className="font-serif text-xl font-semibold">Your orders</h2>
            <p className="mt-2 text-sm text-neutral-300">
              View order history and delivery status after signing in.
            </p>
            <Link
              href="/shop"
              className="mt-4 inline-block text-sm font-medium text-brand-accent hover:underline"
            >
              Start shopping →
            </Link>
          </div>

          <ul className="space-y-4 text-sm text-neutral-600">
            <li className="flex gap-3 rounded-xl border border-neutral-200 p-4">
              <span className="text-brand-accent">01</span>
              <span>
                <strong className="text-brand-primary">Saved addresses</strong> — faster checkout for
                gifts and repeat orders.
              </span>
            </li>
            <li className="flex gap-3 rounded-xl border border-neutral-200 p-4">
              <span className="text-brand-accent">02</span>
              <span>
                <strong className="text-brand-primary">Wishlist</strong> — save pieces you love
                (coming soon).
              </span>
            </li>
            <li className="flex gap-3 rounded-xl border border-neutral-200 p-4">
              <span className="text-brand-accent">03</span>
              <span>
                <strong className="text-brand-primary">Care reminders</strong> — tips to keep your
                jewellery radiant.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
