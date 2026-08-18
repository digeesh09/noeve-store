'use client';

import React, { useEffect, useState } from 'react';
import { fetchTaxRules, createTaxRule, updateTaxRule, deleteTaxRule, type TaxRule } from '@/lib/api';

export default function TaxRulesPage() {
  const [rules, setRules] = useState<TaxRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [hsnCode, setHsnCode] = useState('');
  const [description, setDescription] = useState('');
  const [cgst, setCgst] = useState('9');
  const [sgst, setSgst] = useState('9');
  const [igst, setIgst] = useState('18');

  useEffect(() => {
    loadRules();
  }, []);

  async function loadRules() {
    setLoading(true);
    try {
      const data = await fetchTaxRules();
      setRules(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setHsnCode('');
    setDescription('');
    setCgst('9');
    setSgst('9');
    setIgst('18');
    setIsEditing(null);
    setIsCreating(false);
  };

  const handleEdit = (rule: TaxRule) => {
    setHsnCode(rule.hsnCode);
    setDescription(rule.description || '');
    setCgst(rule.cgstPercentage.toString());
    setSgst(rule.sgstPercentage.toString());
    setIgst(rule.igstPercentage.toString());
    setIsEditing(rule.id);
    setIsCreating(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const data = {
        hsnCode,
        description: description || undefined,
        cgstPercentage: parseFloat(cgst),
        sgstPercentage: parseFloat(sgst),
        igstPercentage: parseFloat(igst),
      };

      if (isEditing) {
        await updateTaxRule(isEditing, data);
      } else {
        await createTaxRule(data);
      }
      await loadRules();
      resetForm();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tax rule?')) return;
    try {
      await deleteTaxRule(id);
      await loadRules();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading tax rules...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tax Rules (GST)</h1>
          <p className="text-sm text-gray-500 mt-1">Manage HSN codes and their corresponding tax brackets.</p>
        </div>
        {!isCreating && !isEditing && (
          <button
            onClick={() => setIsCreating(true)}
            className="bg-black text-white px-4 py-2 rounded font-medium hover:bg-gray-800"
          >
            + Add Tax Rule
          </button>
        )}
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded mb-6">{error}</div>}

      {(isCreating || isEditing) && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Rule' : 'New Tax Rule'}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">HSN Code</label>
              <input
                type="text"
                required
                value={hsnCode}
                onChange={(e) => setHsnCode(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-black focus:border-black outline-none"
                placeholder="e.g. 711319"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-black focus:border-black outline-none"
                placeholder="e.g. Articles of jewellery"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CGST (%)</label>
              <input
                type="number"
                step="0.01"
                required
                value={cgst}
                onChange={(e) => setCgst(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-black focus:border-black outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SGST (%)</label>
              <input
                type="number"
                step="0.01"
                required
                value={sgst}
                onChange={(e) => setSgst(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-black focus:border-black outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IGST (%)</label>
              <input
                type="number"
                step="0.01"
                required
                value={igst}
                onChange={(e) => setIgst(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-black focus:border-black outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-black text-white px-6 py-2 rounded font-medium hover:bg-gray-800"
            >
              Save Rule
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HSN Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">CGST</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">SGST</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">IGST</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rules.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No tax rules found. Add one to get started.
                </td>
              </tr>
            ) : (
              rules.map((rule) => (
                <tr key={rule.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{rule.hsnCode}</td>
                  <td className="px-6 py-4 text-gray-500">{rule.description || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">{rule.cgstPercentage}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">{rule.sgstPercentage}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900 font-medium">{rule.igstPercentage}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(rule)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                    <button onClick={() => handleDelete(rule.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
