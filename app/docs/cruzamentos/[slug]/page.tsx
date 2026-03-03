import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllCruzamentos, getCruzamentoDoc, extractToc } from '@/lib/content';
import { MdxContent } from '@/lib/mdx';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Toc } from '@/components/toc';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllCruzamentos().map((doc) => ({ slug: doc.fileName }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = getCruzamentoDoc(slug);
  if (!doc) return { title: 'Cruzamento' };

  const { title, dificuldade, fontes_utilizadas } = doc.frontmatter;
  const description = `Receita de cruzamento "${title}" (${dificuldade}): combina ${fontes_utilizadas.length} fontes de dados públicos.`;
  const url = `https://brazilvisible.org/docs/cruzamentos/${slug}/`;

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

export default async function CruzamentoPage({ params }: Props) {
  const { slug } = await params;
  const doc = getCruzamentoDoc(slug);

  if (!doc) notFound();

  const toc = extractToc(doc.content);

  return (
    <div className="flex gap-8">
      <article className="min-w-0 flex-1">
        <Breadcrumbs
          items={[
            { label: 'Docs', href: '/docs/' },
            { label: 'Cruzamentos', href: '/docs/cruzamentos/' },
            { label: doc.frontmatter.title },
          ]}
        />

        <div className="flex flex-wrap gap-2 mb-6 text-xs">
          <span className="rounded-full bg-yellow-100 dark:bg-yellow-900/20 px-3 py-1 text-yellow-700 dark:text-yellow-400">
            {doc.frontmatter.dificuldade}
          </span>
          {doc.frontmatter.campos_ponte.map((campo) => (
            <span key={campo} className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-neutral-600 dark:text-neutral-300">
              {campo}
            </span>
          ))}
        </div>

        {doc.frontmatter.notebook_path && (
          <div className="mb-6">
            <a
              href={`https://github.com/nferdica/brazil-visible/raw/develop/${doc.frontmatter.notebook_path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-brazil-green px-5 py-2.5 text-sm font-medium text-white hover:bg-brazil-green-dark transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Baixar Notebook
            </a>
          </div>
        )}

        <div className="doc-content">
          <MdxContent source={doc.content} />
        </div>
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
