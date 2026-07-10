'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';

export function MegaMenu(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150); // slight delay to make moving mouse into the menu easier
  };

  return (
    <div 
      className="mega-menu-trigger nav__link relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: 'pointer', paddingBottom: '1.5rem', marginBottom: '-1.5rem' }} // extended hit area
    >
      <span style={{ fontWeight: isOpen ? 600 : 400 }}>Collections</span>
      
      {isOpen && (
        <div 
          className="mega-menu-dropdown absolute left-0 bg-white shadow-lg border-t border-neutral-200 z-50 flex"
          style={{ top: '100%', left: '-200px', width: '800px', minHeight: '300px', borderRadius: '4px' }}
        >
          {/* Categories Column */}
          <div className="flex-1 p-8 border-r border-neutral-100">
            <h3 className="text-sm font-semibold uppercase text-brand-primary mb-4 tracking-wider">Shop by Category</h3>
            <ul className="space-y-3">
              <li><Link href="/shop" onClick={() => setIsOpen(false)} className="text-neutral-600 hover:text-brand-primary">All Products</Link></li>
              <li><Link href="/shop?category=apparel" onClick={() => setIsOpen(false)} className="text-neutral-600 hover:text-brand-primary">Apparel</Link></li>
              <li><Link href="/shop?category=jewellery" onClick={() => setIsOpen(false)} className="text-neutral-600 hover:text-brand-primary">Jewellery</Link></li>
              <li><Link href="/shop?category=beauty" onClick={() => setIsOpen(false)} className="text-neutral-600 hover:text-brand-primary">Beauty & Wellness</Link></li>
              <li><Link href="/shop?category=accessories" onClick={() => setIsOpen(false)} className="text-neutral-600 hover:text-brand-primary">Accessories</Link></li>
            </ul>
          </div>
          
          {/* Featured Collections Column */}
          <div className="flex-1 p-8 border-r border-neutral-100">
            <h3 className="text-sm font-semibold uppercase text-brand-primary mb-4 tracking-wider">Featured Edits</h3>
            <ul className="space-y-3">
              <li><Link href="/shop" onClick={() => setIsOpen(false)} className="text-neutral-600 hover:text-brand-primary">The Summer Edit</Link></li>
              <li><Link href="/shop" onClick={() => setIsOpen(false)} className="text-neutral-600 hover:text-brand-primary">Essentials</Link></li>
              <li><Link href="/shop" onClick={() => setIsOpen(false)} className="text-neutral-600 hover:text-brand-primary">New Arrivals</Link></li>
              <li><Link href="/shop" onClick={() => setIsOpen(false)} className="text-neutral-600 hover:text-brand-primary">Gifting</Link></li>
            </ul>
          </div>

          {/* Featured Image/Product */}
          <div className="flex-1 p-8 bg-neutral-50 flex flex-col justify-center items-center text-center">
            <div className="w-full h-40 bg-neutral-200 mb-4 overflow-hidden rounded">
              <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400" alt="New Arrival" className="w-full h-full object-cover" />
            </div>
            <h4 className="font-semibold text-neutral-900 mb-1">New: Signature Necklaces</h4>
            <Link href="/shop?category=jewellery" onClick={() => setIsOpen(false)} className="text-sm text-brand-primary hover:underline">
              Shop Now &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
