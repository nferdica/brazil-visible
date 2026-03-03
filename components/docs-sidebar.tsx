'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import type { SidebarCategory } from '@/lib/content';

interface DocsSidebarProps {
  categories: SidebarCategory[];
}

export function DocsSidebar({ categories }: DocsSidebarProps) {
  const pathname = usePathname();
  const [openCategories, setOpenCategories] = useState<Set<string>>(() => {
    const open = new Set<string>();
    for (const cat of categories) {
      for (const doc of cat.docs) {
        if (pathname.includes(`/docs/apis/${cat.meta.dir}/${doc.frontmatter.slug}`)) {
          open.add(cat.meta.dir);
          break;
        }
      }
    }
    return open;
  });

  const toggle = (dir: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(dir)) next.delete(dir);
      else next.add(dir);
      return next;
    });
  };

  return (
    <nav className="space-y-1" aria-label="Sidebar">
      <Link
        href="/docs/"
        className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          pathname === '/docs/' || pathname === '/docs'
            ? 'border-l-2 border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
            : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
        }`}
      >
        Início
      </Link>

      <div className="pt-2">
        <span className="px-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          APIs
        </span>
        <div className="mt-1 space-y-0.5">
          {categories.map((cat) => {
            const isOpen = openCategories.has(cat.meta.dir);
            const isCategoryActive = pathname.startsWith(`/docs/apis/${cat.meta.dir}`);

            return (
              <div key={cat.meta.dir}>
                <button
                  type="button"
                  onClick={() => toggle(cat.meta.dir)}
                  aria-expanded={isOpen}
                  aria-controls={`sidebar-cat-${cat.meta.dir}`}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brazil-blue ${
                    isCategoryActive
                      ? 'text-neutral-900 dark:text-white'
                      : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                  }`}
                >
                  <span className="truncate">{cat.meta.label}</span>
                  <ChevronRight
                    size={16}
                    className={`shrink-0 text-neutral-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div id={`sidebar-cat-${cat.meta.dir}`} className="ml-3 border-l border-neutral-200 dark:border-neutral-800 pl-2 space-y-0.5">
                    {cat.docs.map((doc) => {
                      const docPath = `/docs/apis/${cat.meta.dir}/${doc.frontmatter.slug}/`;
                      const isDocActive =
                        pathname === docPath || pathname === docPath.replace(/\/$/, '');

                      return (
                        <Link
                          key={doc.frontmatter.slug}
                          href={docPath}
                          className={`block rounded-lg px-3 py-1.5 text-sm transition-colors ${
                            isDocActive
                              ? 'border-l-2 border-neutral-900 dark:border-white text-neutral-900 dark:text-white font-medium -ml-[2px]'
                              : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                          }`}
                        >
                          {doc.frontmatter.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-4">
        <span className="px-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          Receitas
        </span>
        <div className="mt-1">
          <Link
            href="/docs/cruzamentos/"
            className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname.startsWith('/docs/cruzamentos')
                ? 'border-l-2 border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
                : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            Cruzamentos
          </Link>
        </div>
      </div>

      <div className="pt-2">
        <Link
          href="/docs/tags/"
          className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            pathname.startsWith('/docs/tags')
              ? 'border-l-2 border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
              : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
          }`}
        >
          Tags
        </Link>
      </div>

      <div className="pt-2">
        <Link
          href="/docs/como-contribuir/"
          className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            pathname.startsWith('/docs/como-contribuir')
              ? 'border-l-2 border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
              : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
          }`}
        >
          Como Contribuir
        </Link>
      </div>
    </nav>
  );
}
