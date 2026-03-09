import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getStandaloneDoc, extractToc } from '@/lib/content';
import { MdxContent } from '@/lib/mdx';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Toc } from '@/components/toc';

export const metadata: Metadata = {
  title: 'SDK TypeScript',
  description:
    'SDK TypeScript unificado para acessar 93+ fontes de dados públicos brasileiros.',
};

export default function SdkPage() {
  const doc = getStandaloneDoc('sdk');
  if (!doc) notFound();

  const toc = extractToc(doc.content);

  return (
    <div className="flex gap-8">
      <article className="min-w-0 flex-1 doc-content">
        <Breadcrumbs
          items={[
            { label: 'Docs', href: '/docs/' },
            { label: 'SDK TypeScript' },
          ]}
        />
        <MdxContent source={doc.content} />
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
