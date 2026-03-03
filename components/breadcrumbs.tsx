import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.label,
      ...(crumb.href ? { item: `https://brazilvisible.org${crumb.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="flex items-center gap-1.5 text-sm text-neutral-400 dark:text-neutral-500 mb-6" aria-label="Breadcrumbs">
        {items.map((crumb, i) => (
          <span key={crumb.href ?? crumb.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={14} className="opacity-40" />}
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-neutral-900 dark:text-white font-medium truncate">
                {crumb.label}
              </span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
