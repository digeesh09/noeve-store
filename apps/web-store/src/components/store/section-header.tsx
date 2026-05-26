import Link from 'next/link';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
}

export function SectionHeader({ title, subtitle, href, linkLabel = 'View all' }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-brand-primary md:text-3xl">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-neutral-600">{subtitle}</p> : null}
      </div>
      {href ? (
        <Link href={href} className="shrink-0 text-sm font-medium text-brand-accent hover:underline">
          {linkLabel} →
        </Link>
      ) : null}
    </div>
  );
}
