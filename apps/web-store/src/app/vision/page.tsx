import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vision | NOEVE',
  description: 'The Vision of NOEVE.',
};

export default function VisionPage() {
  return (
    <main className="wrap pb-20">
      <div className="page-head">
        <div className="eyebrow">Studio</div>
        <h1>Our Vision</h1>
      </div>
      <div className="max-w-3xl">
        <p className="text-[rgba(33,29,25,0.78)] mb-4">
          At NOEVE, we envision a world where luxury is defined not by excess, but by intentionality and enduring quality.
        </p>
        <p className="text-[rgba(33,29,25,0.78)] mb-4">
          Our vision is to build a modern heritage brand that stands the test of time, creating pieces that become a meaningful part of our customers' lives, passed down rather than discarded.
        </p>
      </div>
    </main>
  );
}
