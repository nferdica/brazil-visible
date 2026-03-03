import Link from 'next/link';
import type { PrevNext } from '@/lib/content';

interface DocNavProps {
  prevNext: PrevNext;
}

export function DocNav({ prevNext }: DocNavProps) {
  const { prev, next } = prevNext;

  if (!prev && !next) return null;

  return (
    <nav className="mt-12 flex items-stretch gap-4 border-t border-neutral-200 dark:border-neutral-800 pt-6">
      {prev ? (
        <Link
          href={`/docs/apis/${prev.category}/${prev.slug}/`}
          className="group flex flex-1 flex-col rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 transition-all hover:border-neutral-900 dark:hover:border-white hover:shadow-sm"
        >
          <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500">Anterior</span>
          <span className="mt-1 text-sm font-semibold text-neutral-900 dark:text-white transition-colors">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <Link
          href={`/docs/apis/${next.category}/${next.slug}/`}
          className="group flex flex-1 flex-col items-end rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 transition-all hover:border-neutral-900 dark:hover:border-white hover:shadow-sm"
        >
          <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500">Próximo</span>
          <span className="mt-1 text-sm font-semibold text-neutral-900 dark:text-white transition-colors">
            {next.title}
          </span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}
