'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchBlog, updateBlog } from '@/lib/api';
import { use } from 'react';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    author: '',
    excerpt: '',
    content: '',
    published: false,
  });

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    setLoading(true);
    try {
      const res = await fetchBlog(id);
      setFormData({
        title: res.data?.title || '',
        slug: res.data?.slug || '',
        author: res.data?.author || 'Admin',
        excerpt: res.data?.excerpt || '',
        content: res.data?.content || '',
        published: res.data?.published || false,
      });
    } catch (err) {
      console.error(err);
      alert('Failed to load post');
      router.push('/dashboard/content');
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateBlog(id, formData);
      router.push('/dashboard/content');
    } catch (err) {
      console.error(err);
      alert('Failed to update post');
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight">Edit Blog Post</h1>

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
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Content</label>
                <button
                  type="button"
                  onClick={() => setIsHtmlMode(!isHtmlMode)}
                  className="text-xs font-medium text-brand-primary hover:underline"
                >
                  {isHtmlMode ? 'Switch to Visual Editor' : 'Switch to HTML Editor'}
                </button>
              </div>
              <div className="bg-white" style={{ minHeight: '300px' }}>
                {isHtmlMode ? (
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    className="flex min-h-[300px] w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm font-mono placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    placeholder="Write your HTML here..."
                  />
                ) : (
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
                    style={{ height: '300px', marginBottom: '40px' }}
                  />
                )}
              </div>
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
              disabled={saving}
              className="inline-flex items-center justify-center rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-white shadow hover:bg-brand-primaryDark disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Update Post'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
