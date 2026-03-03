import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, BookOpen, GitFork, Tags } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Página não encontrada',
  description: 'A página que você procura não existe ou foi movida.',
};

const links = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/docs/', label: 'Documentação', icon: BookOpen },
  { href: '/docs/cruzamentos/', label: 'Cruzamentos', icon: GitFork },
  { href: '/docs/tags/', label: 'Tags', icon: Tags },
];

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-extrabold text-brazil-blue">404</h1>
      <p className="mt-4 text-lg text-neutral-500 dark:text-neutral-400">
        Página não encontrada.
      </p>
      <p className="mt-2 text-sm text-neutral-400 dark:text-neutral-500">
        A página que você procura não existe ou foi movida.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-800 px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </div>

      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-900 dark:bg-white px-6 py-3 text-sm font-semibold text-white dark:text-neutral-900 transition-all hover:shadow-lg hover:-translate-y-0.5"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
