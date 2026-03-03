import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getAllCruzamentos } from '@/lib/content';
import { Breadcrumbs } from '@/components/breadcrumbs';

export const metadata: Metadata = {
  title: 'Receitas de Cruzamento',
};

const difficultyColors: Record<string, string> = {
  'iniciante': 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
  'intermediário': 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400',
  'intermediario': 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400',
  'avançado': 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400',
  'avancado': 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400',
};

export default function CruzamentosIndexPage() {
  const cruzamentos = getAllCruzamentos();

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Docs', href: '/docs/' },
          { label: 'Cruzamentos' },
        ]}
      />

      <h1 className="text-3xl font-bold tracking-tight mb-2">
        Receitas de Cruzamento
      </h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-8">
        Aprenda a combinar diferentes fontes de dados públicos para revelar conexões ocultas.
      </p>

      <div className="space-y-3">
        {cruzamentos.map((doc) => (
          <Link
            key={doc.fileName}
            href={`/docs/cruzamentos/${doc.fileName}/`}
            className="block rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 transition-all hover:border-neutral-900 dark:hover:border-white hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-semibold text-neutral-900 dark:text-white">
                  {doc.frontmatter.title}
                </h2>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className={`rounded-full px-2.5 py-0.5 ${
                    difficultyColors[doc.frontmatter.dificuldade] ?? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                  }`}>
                    {doc.frontmatter.dificuldade}
                  </span>
                  {doc.frontmatter.campos_ponte.map((campo) => (
                    <span key={campo} className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-2.5 py-0.5 text-neutral-500 dark:text-neutral-400">
                      {campo}
                    </span>
                  ))}
                </div>
              </div>
              <ChevronRight size={16} className="shrink-0 mt-1 text-neutral-300 dark:text-neutral-600" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
