export default function OrdersPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Orders</h1>
      <p className="mt-2 text-sm text-neutral-600">
        List and update order status via PATCH /v1/admin/orders/:id/status
      </p>
    </div>
  );
}
