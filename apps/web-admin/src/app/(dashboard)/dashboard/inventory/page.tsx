'use client';

import React, { useEffect, useState } from 'react';
import { fetchInventory, updateInventoryStock } from '@/lib/api';
import Link from 'next/link';

export default function InventoryPage() {
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const loadInventory = () => {
    setLoading(true);
    fetchInventory(20)
      .then(setLowStockProducts)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleUpdateStock = async (variantId: string, currentStock: number) => {
    const newStockStr = prompt('Enter new stock quantity:', currentStock.toString());
    if (newStockStr === null) return;
    const newStock = parseInt(newStockStr, 10);
    if (isNaN(newStock) || newStock < 0) return alert('Invalid stock quantity');

    setUpdating(variantId);
    try {
      await updateInventoryStock(variantId, newStock);
      loadInventory();
    } catch (e) {
      alert('Failed to update stock');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Inventory Management</h1>
        <button onClick={loadInventory} className="text-sm font-medium text-brand-primary hover:underline">
          Refresh List
        </button>
      </div>

      <p className="text-neutral-600">Showing products with low stock (threshold: 20 units).</p>

      {loading ? (
        <div className="text-sm text-neutral-500">Loading inventory...</div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Variant Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Stock Quantity</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white">
              {lowStockProducts.map((variant) => (
                <tr key={variant.id} className={variant.stockQuantity <= 5 ? 'bg-red-50/30' : ''}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-neutral-900">
                    <Link href={`/dashboard/products/${variant.product.id}`} className="hover:underline">
                      {variant.product.name}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">{variant.sku}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-500">{variant.name}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-bold">
                    <span className={variant.stockQuantity === 0 ? 'text-red-600' : 'text-yellow-600'}>
                      {variant.stockQuantity}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleUpdateStock(variant.id, variant.stockQuantity)}
                      disabled={updating === variant.id}
                      className="text-brand-primary hover:text-brand-primary-dark disabled:opacity-50"
                    >
                      {updating === variant.id ? 'Updating...' : 'Update Stock'}
                    </button>
                  </td>
                </tr>
              ))}
              {lowStockProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-neutral-500">
                    All products have sufficient stock.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
