import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllTags, getCategories } from '@/lib/content';
import { Breadcrumbs } from '@/components/breadcrumbs';

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tagMap = getAllTags();
  return [...tagMap.keys()].map((tag) => ({
    tag: encodeURIComponent(tag),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);

  return {
    title: `Tag: ${tag}`,
    description: `Fontes de dados publicos brasileiras com a tag "${tag}".`,
  };
}

export default async function TagDetailPage({ params }: Props) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);

  const tagMap = getAllTags();
  const docs = tagMap.get(tag);

  if (!docs || docs.length === 0) notFound();

  const categories = getCategories();
  const catLabels = new Map(categories.map((c) => [c.dir, c.label]));

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Docs', href: '/docs/' },
          { label: 'Tags', href: '/docs/tags/' },
          { label: tag },
        ]}
      />

      <h1 className="text-3xl font-bold tracking-tight mb-2">
        <span className="text-neutral-400 dark:text-neutral-500 font-normal">Tag: </span>
        {tag}
      </h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-8">
        {docs.length} {docs.length === 1 ? 'fonte de dados encontrada' : 'fontes de dados encontradas'} com esta tag.
      </p>

      <div className="space-y-2">
        {docs.map((doc) => (
          <Link
            key={`${doc.category}/${doc.frontmatter.slug}`}
            href={`/docs/apis/${doc.category}/${doc.frontmatter.slug}/`}
            className="flex items-center justify-between rounded-lg border border-neutral-200 dark:border-neutral-700 p-3 text-sm transition-all hover:border-brazil-blue dark:hover:border-brazil-blue-light hover:shadow-sm"
          >
            <span className="font-medium text-neutral-900 dark:text-white">
              {doc.frontmatter.title}
            </span>
            <span className="text-xs text-neutral-400 dark:text-neutral-500 shrink-0 ml-2">
              {catLabels.get(doc.category ?? '') ?? doc.category}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
