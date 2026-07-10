'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBlog } from '@/lib/api';

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    author: 'Admin',
    excerpt: '',
    content: '',
    published: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createBlog(formData);
      router.push('/dashboard/content');
    } catch (err) {
      console.error(err);
      alert('Failed to create post');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight">Create Blog Post</h1>

      <form onSubmit={handleSubmit}>
        <div className="rounded-lg border border-neutral-200 bg-white">
          <div className="border-b border-neutral-200 p-6">
            <h2 className="text-xl font-semibold">Post Details</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                placeholder="Enter post title"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug (optional)</label>
              <input
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                placeholder="e.g. my-awesome-post"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Excerpt</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                className="flex min-h-[80px] w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                placeholder="Short summary..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                className="flex min-h-[300px] w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                placeholder="Write your article here... (Markdown/HTML supported if configured)"
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="h-4 w-4 rounded border-neutral-300 text-brand-primary focus:ring-brand-primary"
              />
              <label htmlFor="published" className="text-sm font-medium">
                Publish immediately
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-4 border-t px-6 py-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-white shadow hover:bg-brand-primaryDark disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Post'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
