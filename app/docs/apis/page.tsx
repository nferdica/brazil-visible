import type { Metadata } from 'next';
import Link from 'next/link';
import { getSidebar } from '@/lib/content';
import { SearchInput } from '@/components/search-input';

export const metadata: Metadata = {
  title: 'APIs e Fontes de Dados',
};

export default function ApisIndexPage() {
  const sidebar = getSidebar();

  const searchDocs = sidebar.flatMap((cat) =>
    cat.docs.map((doc) => ({
      title: doc.frontmatter.title,
      slug: doc.frontmatter.slug,
      orgao: doc.frontmatter.orgao,
      category: cat.meta.dir,
      tags: doc.frontmatter.tags ?? [],
    })),
  );

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight mb-2">
        APIs e Fontes de Dados
      </h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-8">
        {sidebar.reduce((acc, cat) => acc + cat.docs.length, 0)} fontes de dados organizadas em {sidebar.length} categorias.
      </p>

      <SearchInput docs={searchDocs} />

      <div className="space-y-8">
        {sidebar.map((cat) => (
          <section key={cat.meta.dir}>
            <h2 className="text-lg font-bold mb-3 text-neutral-900 dark:text-white">
              {cat.meta.label}
              <span className="ml-2 text-sm font-normal text-neutral-400">
                ({cat.docs.length})
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {cat.docs.map((doc) => (
                <Link
                  key={doc.frontmatter.slug}
                  href={`/docs/apis/${cat.meta.dir}/${doc.frontmatter.slug}/`}
                  className="flex items-center justify-between rounded-lg border border-neutral-200 dark:border-neutral-700 p-3 text-sm transition-all hover:border-brazil-blue dark:hover:border-brazil-blue-light hover:shadow-sm"
                >
                  <span className="font-medium text-neutral-900 dark:text-white">
                    {doc.frontmatter.title}
                  </span>
                  <span className="text-xs text-neutral-400 dark:text-neutral-500 shrink-0 ml-2">
                    {doc.frontmatter.orgao}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
