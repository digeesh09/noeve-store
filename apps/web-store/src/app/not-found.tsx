import React from 'react';
import Link from 'next/link';

export default function NotFound(): React.JSX.Element {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="font-display mb-4 text-4xl text-oxblood">Page Not Found</h2>
      <p className="mb-8 text-ink/70">The page you are looking for does not exist or has been moved.</p>
      <Link href="/" className="btn btn--primary">
        Return Home
      </Link>
    </div>
  );
}
