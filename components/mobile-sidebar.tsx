'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import type { SidebarCategory } from '@/lib/content';
import { DocsSidebar } from './docs-sidebar';

interface MobileSidebarProps {
  categories: SidebarCategory[];
}

export function MobileSidebar({ categories }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brazil-blue"
        aria-label="Abrir menu lateral"
      >
        <Menu size={18} />
        Menu
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          />
          <nav aria-label="Navegação da documentação" className="fixed inset-y-0 left-0 z-50 w-[min(288px,80vw)] overflow-y-auto bg-white dark:bg-dark-bg p-4 shadow-xl lg:hidden">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-neutral-900 dark:text-white">Navegação</span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Fechar menu" className="rounded p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brazil-blue">
                <X size={20} className="text-neutral-500" />
              </button>
            </div>
            <DocsSidebar categories={categories} />
          </nav>
        </>
      )}
    </>
  );
}
