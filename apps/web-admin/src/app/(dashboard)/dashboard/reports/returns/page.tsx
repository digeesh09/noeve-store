'use client';
import React from 'react';

export default function ReturnsReportPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Returns (RMA) Report</h1>
      <p className="text-neutral-500">Returns, refunds, and RMA tracking.</p>
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-12 text-center text-sm text-neutral-400">
        No returns found for the current period.
      </div>
    </div>
  );
}