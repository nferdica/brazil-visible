'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Sun, Moon, Menu, X, ExternalLink } from 'lucide-react';

const navLinks = [
  { href: '/docs/apis/', label: 'APIs' },
  { href: '/docs/cruzamentos/', label: 'Cruzamentos' },
  { href: '/docs/como-contribuir/', label: 'Como Contribuir' },
];

export function Navbar() {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    if (mobileOpen) {
      const firstLink = mobileMenuRef.current?.querySelector('a');
      firstLink?.focus();
    } else if (document.activeElement && mobileMenuRef.current?.contains(document.activeElement)) {
      mobileToggleRef.current?.focus();
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleMobileKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setMobileOpen(false);
      mobileToggleRef.current?.focus();
    }
  }, []);

  const toggleTheme = () => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    if (!('startViewTransition' in document)) {
      setTheme(next);
      return;
    }
    (document as unknown as { startViewTransition: (cb: () => void) => void })
      .startViewTransition(() => setTheme(next));
  };

  const isActive = (href: string) => pathname === href || pathname === href.replace(/\/$/, '');

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center" aria-label="Brazil Visible — Início">
            <img
              src="/logo-dark.svg"
              alt="Brazil Visible"
              className="block dark:hidden h-12 w-auto"
            />
            <img
              src="/logo-light.svg"
              alt="Brazil Visible"
              className="hidden dark:block h-12 w-auto"
            />
          </Link>

          <div className="hidden md:flex md:items-center md:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-neutral-900 dark:text-white'
                    : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://github.com/nferdica/brazil-visible"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              GitHub
              <ExternalLink size={14} className="opacity-50" aria-hidden="true" />
            </a>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Alternar tema"
              className="ml-2 rounded-lg p-2 text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brazil-blue"
            >
              {mounted && resolvedTheme === 'dark' ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>

            <Link
              href="/docs/"
              className="ml-3 inline-flex items-center rounded-full bg-neutral-900 dark:bg-white px-5 py-2 text-sm font-semibold text-white dark:text-neutral-900 transition-all hover:bg-neutral-700 dark:hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brazil-blue"
            >
              Explorar
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Alternar tema"
              className="rounded-lg p-2 text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brazil-blue"
            >
              {mounted && resolvedTheme === 'dark' ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>

            <button
              ref={mobileToggleRef}
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileOpen}
              className="rounded-lg p-2 text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brazil-blue"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 top-16 z-40 backdrop-blur-sm bg-black/20 transition-opacity duration-300 md:hidden ${
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      <div
        ref={mobileMenuRef}
        role="dialog"
        aria-label="Menu de navegação"
        onKeyDown={handleMobileKeyDown}
        className={`fixed top-16 right-0 z-50 h-[calc(100vh-4rem)] w-72 transform bg-white shadow-xl transition-transform duration-300 ease-in-out dark:bg-dark-bg md:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-1 p-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? 'text-neutral-900 dark:text-white'
                  : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/nferdica/brazil-visible"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          >
            GitHub
            <ExternalLink size={14} className="opacity-50" aria-hidden="true" />
          </a>
          <Link
            href="/docs/"
            onClick={() => setMobileOpen(false)}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-neutral-900 dark:bg-white px-5 py-2.5 text-sm font-semibold text-white dark:text-neutral-900"
          >
            Explorar
          </Link>
        </div>
      </div>
    </header>
  );
}
