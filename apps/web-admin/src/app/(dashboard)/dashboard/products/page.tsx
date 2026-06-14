'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { fetchProducts, createProduct, fetchCategories, type Product, type Category } from '@/lib/api';

function formatPrice(cents: number, currency = 'INR') {
  return (cents / 100).toLocaleString('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });
}

export default function ProductsPage(): React.JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    categoryId: '',
    basePriceCents: 0,
    material: '',
    purity: '',
    gemstone: '',
    weightGrams: '',
  });

  const load = useCallback(async () => {
    setError(null);
    try {
      const [prodData, catData] = await Promise.all([fetchProducts(), fetchCategories()]);
      setProducts(prodData);
      setCategories(catData);
      if (catData.length > 0 && !formData.categoryId) {
        setFormData(prev => ({ ...prev, categoryId: catData[0].id }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [formData.categoryId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createProduct({
        ...formData,
        basePriceCents: Number(formData.basePriceCents),
        weightGrams: formData.weightGrams ? Number(formData.weightGrams) : undefined,
      });
      setIsCreating(false);
      setFormData({
        name: '', slug: '', description: '', categoryId: categories[0]?.id || '', basePriceCents: 0, material: '', purity: '', gemstone: '', weightGrams: ''
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="mt-2 text-sm text-neutral-600">Create and manage catalogue.</p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary/90"
        >
          {isCreating ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      {isCreating && (
        <form onSubmit={handleCreate} className="mt-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-neutral-700">Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Slug</label>
              <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Category</label>
              <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm">
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700">Price (Cents)</label>
              <input required type="number" value={formData.basePriceCents} onChange={e => setFormData({...formData, basePriceCents: Number(e.target.value)})} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700">Description</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary/90">Save Product</button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="mt-8 text-sm text-neutral-500">Loading products…</p>
      ) : products.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">No products yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-neutral-200">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-neutral-100">
                  <td className="px-4 py-3">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-neutral-500">{product.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {categories.find(c => c.id === product.categoryId)?.name ?? product.categoryId}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {formatPrice(product.basePriceCents, product.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
