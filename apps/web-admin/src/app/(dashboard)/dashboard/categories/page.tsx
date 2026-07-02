'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { fetchCategories, createCategory, updateCategory, deleteCategory, type Category } from '@/lib/api';

export default function CategoriesPage(): React.JSX.Element {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    taxRatePercentage: '',
    returnPolicy: '',
  });

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleEdit = (category: Category) => {
    setEditingCategoryId(category.id);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      taxRatePercentage: category.taxRatePercentage !== null && category.taxRatePercentage !== undefined ? String(category.taxRatePercentage) : '',
      returnPolicy: category.returnPolicy || '',
    });
    setIsCreating(true);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingCategoryId(null);
    setFormData({
      name: '', slug: '', description: '', taxRatePercentage: '', returnPolicy: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const sanitizedSlug = formData.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
      const payload = {
        name: formData.name,
        slug: sanitizedSlug,
        description: formData.description || undefined,
        taxRatePercentage: formData.taxRatePercentage ? Number(formData.taxRatePercentage) : undefined,
        returnPolicy: formData.returnPolicy || undefined,
      };

      if (editingCategoryId) {
        await updateCategory(editingCategoryId, payload);
      } else {
        await createCategory(payload);
      }
      handleCancel();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteCategory(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="mt-2 text-sm text-neutral-600">Create and manage product categories, taxation, and return policies.</p>
        </div>
        <button
          onClick={isCreating ? handleCancel : () => setIsCreating(true)}
          className="rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary/90"
        >
          {isCreating ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      {isCreating && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
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
              <label className="block text-sm font-medium text-neutral-700">Tax Rate (%)</label>
              <input type="number" step="0.1" min="0" max="100" value={formData.taxRatePercentage} onChange={e => setFormData({...formData, taxRatePercentage: e.target.value})} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" placeholder="e.g. 18" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700">Description</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700">Return Policy</label>
              <textarea value={formData.returnPolicy} onChange={e => setFormData({...formData, returnPolicy: e.target.value})} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm" placeholder="e.g. 30-day returns for unworn items..." />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary/90">
              {editingCategoryId ? 'Update Category' : 'Save Category'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="mt-8 text-sm text-neutral-500">Loading categories…</p>
      ) : categories.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">No categories yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-neutral-200">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50">
              <tr>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Tax Rate</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-neutral-100">
                  <td className="px-4 py-3">
                    <p className="font-medium">{category.name}</p>
                    <p className="text-xs text-neutral-500">{category.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {category.taxRatePercentage !== null && category.taxRatePercentage !== undefined ? `${category.taxRatePercentage}%` : 'Default'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-sm font-medium text-brand-primary hover:underline mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-sm font-medium text-red-600 hover:underline"
                    >
                      Delete
                    </button>
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
