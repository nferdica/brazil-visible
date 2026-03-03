import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { getCategories, getSidebar } from '@/lib/content';
import { Breadcrumbs } from '@/components/breadcrumbs';

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return getCategories().map((cat) => ({ category: cat.dir }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const sidebar = getSidebar();
  const cat = sidebar.find((c) => c.meta.dir === category);
  if (!cat) return { title: 'Categoria' };

  const description = `${cat.docs.length} fontes de dados de ${cat.meta.label} catalogadas no Brazil Visible.`;
  const url = `https://brazilvisible.org/docs/apis/${category}/`;

  return {
    title: cat.meta.label,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${cat.meta.label} | Brazil Visible`,
      description,
      url,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const sidebar = getSidebar();
  const cat = sidebar.find((c) => c.meta.dir === category);

  if (!cat) notFound();

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Docs', href: '/docs/' },
          { label: 'APIs', href: '/docs/apis/' },
          { label: cat.meta.label },
        ]}
      />

      <h1 className="text-3xl font-bold tracking-tight mb-2">
        {cat.meta.label}
      </h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-8">
        {cat.docs.length} {cat.docs.length === 1 ? 'fonte de dados' : 'fontes de dados'}
      </p>

      <div className="space-y-2">
        {cat.docs.map((doc) => (
          <Link
            key={doc.frontmatter.slug}
            href={`/docs/apis/${category}/${doc.frontmatter.slug}/`}
            className="flex items-center justify-between rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 transition-all hover:border-neutral-900 dark:hover:border-white hover:shadow-sm"
          >
            <div className="min-w-0">
              <span className="font-semibold text-neutral-900 dark:text-white">
                {doc.frontmatter.title}
              </span>
              <div className="mt-1 flex flex-wrap gap-2 text-xs text-neutral-400 dark:text-neutral-500">
                <span>{doc.frontmatter.orgao}</span>
                <span>·</span>
                <span>{doc.frontmatter.tipo_acesso}</span>
                {doc.frontmatter.status && (
                  <>
                    <span>·</span>
                    <span className={
                      doc.frontmatter.status === 'documentado'
                        ? 'text-brazil-green dark:text-brazil-green-light'
                        : doc.frontmatter.status === 'parcial'
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-neutral-400'
                    }>
                      {doc.frontmatter.status}
                    </span>
                  </>
                )}
              </div>
            </div>
            <ChevronRight size={16} className="shrink-0 text-neutral-300 dark:text-neutral-600" />
          </Link>
        ))}
      </div>
    </div>
  );
}
