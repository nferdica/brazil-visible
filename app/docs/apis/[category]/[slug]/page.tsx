import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getAllApiDocs,
  getApiDoc,
  getCategories,
  extractToc,
  getPrevNextInCategory,
} from '@/lib/content';
import Link from 'next/link';
import { MdxContent } from '@/lib/mdx';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Toc } from '@/components/toc';
import { DocNav } from '@/components/doc-nav';
import { StatusBadge } from '@/components/status-badge';

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  const docs = getAllApiDocs();
  return docs.map((doc) => ({
    category: doc.category!,
    slug: doc.frontmatter.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const doc = getApiDoc(category, slug);
  if (!doc) return { title: 'API' };

  const { title, orgao } = doc.frontmatter;
  const description = `Documentação da ${title} (${orgao}): acesso, endpoints e exemplos de uso.`;
  const url = `https://brazilvisible.org/docs/apis/${category}/${slug}/`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | Brazil Visible`,
      description,
      url,
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title: `${title} | Brazil Visible`,
      description,
    },
  };
}

export default async function ApiDocPage({ params }: Props) {
  const { category, slug } = await params;
  const doc = getApiDoc(category, slug);

  if (!doc) notFound();

  const categories = getCategories();
  const catMeta = categories.find((c) => c.dir === category);
  const toc = extractToc(doc.content);
  const prevNext = getPrevNextInCategory(category, slug);

  const formato = Array.isArray(doc.frontmatter.formato_dados)
    ? doc.frontmatter.formato_dados.join(', ')
    : doc.frontmatter.formato_dados;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: doc.frontmatter.title,
    description: `Documentação da ${doc.frontmatter.title} (${doc.frontmatter.orgao}): acesso, endpoints e exemplos de uso.`,
    author: { '@type': 'Organization', name: 'Brazil Visible' },
    publisher: { '@type': 'Organization', name: 'Brazil Visible' },
    keywords: doc.frontmatter.tags?.join(', ') ?? '',
    inLanguage: 'pt-BR',
    mainEntityOfPage: `https://brazilvisible.org/docs/apis/${category}/${slug}/`,
  };

  return (
    <div className="flex gap-8">
      <article className="min-w-0 flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Breadcrumbs
          items={[
            { label: 'Docs', href: '/docs/' },
            { label: 'APIs', href: '/docs/apis/' },
            { label: catMeta?.label ?? category, href: `/docs/apis/${category}/` },
            { label: doc.frontmatter.title },
          ]}
        />

        {/* Metadata badges */}
        <div className="flex flex-wrap gap-2 mb-6 text-xs">
          <span className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-neutral-600 dark:text-neutral-300">
            {doc.frontmatter.orgao}
          </span>
          <span className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-neutral-600 dark:text-neutral-300">
            {doc.frontmatter.tipo_acesso}
          </span>
          {formato && (
            <span className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-neutral-600 dark:text-neutral-300">
              {formato}
            </span>
          )}
          {doc.frontmatter.autenticacao && (
            <span className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-neutral-600 dark:text-neutral-300">
              Auth: {doc.frontmatter.autenticacao}
            </span>
          )}
          {doc.frontmatter.status && (
            <span className={`rounded-full px-3 py-1 ${
              doc.frontmatter.status === 'documentado'
                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                : doc.frontmatter.status === 'parcial'
                  ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
            }`}>
              {doc.frontmatter.status}
            </span>
          )}
          <StatusBadge urlBase={doc.frontmatter.url_base} />
        </div>

        {/* Tags */}
        {doc.frontmatter.tags && doc.frontmatter.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {doc.frontmatter.tags.map((tag) => (
              <Link
                key={tag}
                href={`/docs/tags/${encodeURIComponent(tag)}/`}
                className="rounded-full border border-neutral-200 dark:border-neutral-800 px-2.5 py-0.5 text-xs text-neutral-500 dark:text-neutral-400 hover:border-brazil-green hover:text-brazil-green dark:hover:border-brazil-green-light dark:hover:text-brazil-green-light transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        <div className="doc-content">
          <MdxContent source={doc.content} />
        </div>

        <DocNav prevNext={prevNext} />
      </article>

      {toc.length > 0 && (
        <aside className="hidden xl:block w-56 shrink-0">
          <div className="sticky top-24">
            <Toc entries={toc} />
          </div>
        </aside>
      )}
    </div>
  );
}
