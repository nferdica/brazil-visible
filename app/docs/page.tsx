import type { Metadata } from 'next';
import { getStandaloneDoc, extractToc } from '@/lib/content';
import { MdxContent } from '@/lib/mdx';
import { Toc } from '@/components/toc';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Documentação',
};

export default function DocsHomePage() {
  const doc = getStandaloneDoc('intro');
  if (!doc) notFound();

  const toc = extractToc(doc.content);

  return (
    <div className="flex gap-8">
      <article className="min-w-0 flex-1 doc-content">
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
