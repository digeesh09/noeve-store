'use client';
import React from 'react';

export default function BurnoutReportPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Work Burn Out Report</h1>
      <p className="text-neutral-500">Employee and fulfillment team workload distribution.</p>
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-12 text-center text-sm text-neutral-400">
        Workload tracking module is active but insufficient data exists to generate a burnout analysis.
      </div>
    </div>
  );
}