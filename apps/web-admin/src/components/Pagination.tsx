import React from 'react';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-4 mt-6 justify-between text-sm">
      <div className="text-neutral-500">
        Page {page} of {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <button 
          disabled={page <= 1} 
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-1.5 rounded border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
        >
          Previous
        </button>
        <button 
          disabled={page >= totalPages} 
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-1.5 rounded border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
