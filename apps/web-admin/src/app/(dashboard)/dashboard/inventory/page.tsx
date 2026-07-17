'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { fetchAllInventory, updateInventoryStock } from '@/lib/api';
import { Pagination } from '@/components/Pagination';
import Link from 'next/link';

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const loadInventory = useCallback(() => {
    setLoading(true);
    fetchAllInventory(page, 20, debouncedSearch)
      .then((res) => {
        setInventory(res.data || []);
        setTotalPages(res.meta?.totalPages || 1);
      })
      .finally(() => setLoading(false));
  }, [page, debouncedSearch]);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold text-neutral-900">Inventory Management</h1>
          <button 
            onClick={loadInventory}
            disabled={loading}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:opacity-50"
            title="Refresh Inventory"
          >
            <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        
        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Search SKU or Product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-neutral-500">Loading inventory...</div>
      ) : (
        <div className="space-y-4">
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
                {inventory.map((variant) => (
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
                {inventory.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-neutral-500">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
