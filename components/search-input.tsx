'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';

interface SearchDoc {
  title: string;
  slug: string;
  orgao: string;
  category: string;
  tags: string[];
}

interface SearchInputProps {
  docs: SearchDoc[];
}

export function SearchInput({ docs }: SearchInputProps) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return null;

    return docs.filter(
      (doc) =>
        doc.title.toLowerCase().includes(q) ||
        doc.orgao.toLowerCase().includes(q) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }, [query, docs]);

  const hasResults = results !== null && results.length > 0;
  const listboxId = 'search-results-listbox';

  return (
    <div className="mb-8">
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
          aria-hidden="true"
        />
        <input
          type="text"
          role="combobox"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome, órgão ou tag..."
          aria-label="Buscar APIs"
          aria-autocomplete="list"
          aria-expanded={hasResults}
          aria-controls={hasResults ? listboxId : undefined}
          className="w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-dark-bg pl-10 pr-10 py-2.5 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brazil-blue/30 focus:border-brazil-blue dark:focus:border-brazil-blue-light transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Limpar busca"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brazil-blue rounded"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {results !== null && (
        <div className="mt-3" role="status" aria-live="polite">
          {results.length === 0 ? (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Nenhum resultado para &ldquo;{query}&rdquo;
            </p>
          ) : (
            <div className="space-y-1">
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-2">
                {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
              </p>
              <div id={listboxId} role="listbox" aria-label="Resultados da busca">
                {results.map((doc) => (
                  <Link
                    key={`${doc.category}/${doc.slug}`}
                    href={`/docs/apis/${doc.category}/${doc.slug}/`}
                    role="option"
                    aria-selected={false}
                    className="flex items-center justify-between rounded-lg border border-neutral-200 dark:border-neutral-700 p-3 text-sm transition-all hover:border-brazil-blue dark:hover:border-brazil-blue-light hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brazil-blue"
                  >
                    <span className="font-medium text-neutral-900 dark:text-white">
                      {doc.title}
                    </span>
                    <span className="text-xs text-neutral-400 dark:text-neutral-500 shrink-0 ml-2">
                      {doc.orgao}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
