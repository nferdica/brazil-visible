import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllTags } from '@/lib/content';
import { Breadcrumbs } from '@/components/breadcrumbs';

export const metadata: Metadata = {
  title: 'Tags',
  description: 'Navegue por todas as tags das fontes de dados públicos brasileiras.',
};

export default function TagsIndexPage() {
  const tagMap = getAllTags();

  // Sort tags by count (most used first), then alphabetically for ties.
  const sorted = [...tagMap.entries()].sort((a, b) => {
    const diff = b[1].length - a[1].length;
    if (diff !== 0) return diff;
    return a[0].localeCompare(b[0], 'pt-BR');
  });

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Docs', href: '/docs/' },
          { label: 'Tags' },
        ]}
      />

      <h1 className="text-3xl font-bold tracking-tight mb-2">Tags</h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-8">
        {sorted.length} tags encontradas em todas as fontes de dados.
      </p>

      <div className="flex flex-wrap gap-2">
        {sorted.map(([tag, docs]) => (
          <Link
            key={tag}
            href={`/docs/tags/${encodeURIComponent(tag)}/`}
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 px-3.5 py-1.5 text-sm transition-all hover:border-brazil-blue dark:hover:border-brazil-blue-light hover:shadow-sm"
          >
            <span className="font-medium text-neutral-900 dark:text-white">
              {tag}
            </span>
            <span className="text-xs text-neutral-400 dark:text-neutral-500">
              {docs.length}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
