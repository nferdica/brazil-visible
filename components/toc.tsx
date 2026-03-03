'use client';

import { useState, useEffect } from 'react';
import type { TocEntry } from '@/lib/content';

interface TocProps {
  entries: TocEntry[];
}

export function Toc({ entries }: TocProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (entries.length === 0) return;

    const observer = new IntersectionObserver(
      (observerEntries) => {
        for (const entry of observerEntries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-64px 0px -60% 0px', threshold: 0 },
    );

    for (const tocEntry of entries) {
      const el = document.getElementById(tocEntry.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <nav className="space-y-1 text-sm" aria-label="Sumário">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        Nesta página
      </p>
      {entries.map((entry) => (
        <a
          key={entry.id}
          href={`#${entry.id}`}
          className={`block py-2 transition-colors ${
            entry.depth === 3 ? 'pl-4' : entry.depth === 4 ? 'pl-8' : ''
          } ${
            activeId === entry.id
              ? 'text-neutral-900 dark:text-white font-medium'
              : 'text-neutral-400 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-white'
          }`}
        >
          {entry.text}
        </a>
      ))}
    </nav>
  );
}
