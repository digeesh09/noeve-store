import React from 'react';
import Link from 'next/link';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
}

export function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel = 'View all',
}: SectionHeaderProps): React.JSX.Element {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.6rem)]">{title}</h2>
        {subtitle ? <p className="mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-brand-primary">{subtitle}</p> : null}
      </div>
      {href ? (
        <Link href={href} className="shrink-0 text-sm font-medium text-brand-accent hover:underline">
          {linkLabel} →
        </Link>
      ) : null}
    </div>
  );
}
