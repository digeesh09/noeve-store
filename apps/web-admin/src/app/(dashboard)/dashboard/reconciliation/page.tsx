'use client';

import React, { useState, useEffect } from 'react';
import { uploadSettlementReport, fetchSettings } from '@/lib/api';
import { UploadCloud, FileText, CheckCircle, AlertCircle, HelpCircle, Download, Info } from 'lucide-react';

export default function ReconciliationPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reconciliationMode, setReconciliationMode] = useState<'MANUAL' | 'AUTOMATIC'>('MANUAL');

  useEffect(() => {
    fetchSettings().then(settings => {
      setReconciliationMode(settings.codReconciliationMode || 'MANUAL');
    }).catch(() => {});
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const res = await uploadSettlementReport(file);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to upload report');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSample = () => {
    const csvContent = "Order ID,Settled Amount,Partner,Reference\nNV-EXAMPLE1,150000,Delhivery,TXN-9981\nNV-EXAMPLE2,200000,BlueDart,TXN-9982\n";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sample_reconciliation.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">COD Reconciliation</h1>
        <p className="text-neutral-500 mt-1">Upload settlement reports from delivery partners to reconcile cash collected.</p>
      </div>

      {reconciliationMode === 'AUTOMATIC' && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg flex items-start gap-3">
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium">Automatic Mode is Active</h3>
            <p className="text-sm text-blue-700 mt-1">
              Your COD settlements are currently being processed automatically via webhooks from delivery partners. You can still use the manual CSV upload below as a fallback.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm">
        <h2 className="text-lg font-medium text-neutral-900 mb-4">Upload Settlement CSV</h2>
        
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20"
          />
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="flex items-center gap-2 btn btn--primary disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <UploadCloud className="w-5 h-5" />
            )}
            Process Report
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 flex flex-col items-center justify-center text-center">
              <FileText className="w-8 h-8 text-neutral-400 mb-2" />
              <div className="text-2xl font-bold text-neutral-900">{result.totalProcessed}</div>
              <div className="text-sm text-neutral-500">Total Processed</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex flex-col items-center justify-center text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
              <div className="text-2xl font-bold text-green-700">{result.settled}</div>
              <div className="text-sm text-green-600">Successfully Settled</div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg border border-red-200 flex flex-col items-center justify-center text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
              <div className="text-2xl font-bold text-red-700">{result.discrepancies}</div>
              <div className="text-sm text-red-600">Discrepancies Found</div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 flex flex-col items-center justify-center text-center">
              <HelpCircle className="w-8 h-8 text-yellow-500 mb-2" />
              <div className="text-2xl font-bold text-yellow-700">{result.notFound}</div>
              <div className="text-sm text-yellow-600">Orders Not Found</div>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm">
        <h2 className="text-lg font-medium text-neutral-900 mb-4">Instructions for CSV Format</h2>
        <div className="prose prose-sm text-neutral-600">
          <p>The system expects a CSV file with headers. The following columns are recognized:</p>
          <ul>
            <li><strong>Order ID</strong> or <strong>Order Number</strong> or <strong>AWB</strong> (Required)</li>
            <li><strong>Settled Amount</strong> or <strong>Amount</strong> (Required)</li>
            <li><strong>Partner</strong> (Optional - e.g., Delhivery, BlueDart)</li>
            <li><strong>Reference</strong> or <strong>Transaction ID</strong> (Optional)</li>
          </ul>
          <p>If the settled amount exactly matches the order total, the order payment status will be updated to SUCCESS automatically. If there is a short payment, it will be flagged as a discrepancy.</p>
          <div className="mt-4">
            <button
              onClick={handleDownloadSample}
              className="flex items-center gap-2 text-sm text-brand-primary hover:underline font-medium"
            >
              <Download className="w-4 h-4" />
              Download Sample CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
