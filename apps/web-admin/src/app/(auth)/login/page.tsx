export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-brand-primary">Noeve Admin</h1>
        <p className="mt-2 text-sm text-neutral-600">Sign in to manage orders and catalog.</p>
        <form className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm"
              placeholder="admin@noeve.local"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <button
            type="button"
            className="w-full rounded bg-brand-primary py-2 text-sm font-medium text-white"
          >
            Sign in
          </button>
        </form>
        <p className="mt-4 text-xs text-neutral-500">
          Demo: admin@noeve.local / Admin123! (after seed)
        </p>
      </div>
    </div>
  );
}
