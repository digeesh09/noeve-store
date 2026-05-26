export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-neutral-600">
        Order queue, product management, and fulfillment tracking connect to{' '}
        <code className="rounded bg-neutral-100 px-1">/v1/admin/*</code> endpoints.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {['Open orders', 'Processing', 'Shipped today'].map((label) => (
          <div key={label} className="rounded-lg border border-neutral-200 bg-white p-6">
            <p className="text-sm text-neutral-500">{label}</p>
            <p className="mt-2 text-3xl font-semibold">—</p>
          </div>
        ))}
      </div>
    </div>
  );
}
