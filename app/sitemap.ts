import type { MetadataRoute } from 'next';
import { getAllApiDocs, getCategories, getAllCruzamentos, getAllTags } from '@/lib/content';

export const dynamic = 'force-static';

const BASE = 'https://brazilvisible.org';

export default function sitemap(): MetadataRoute.Sitemap {
  const categories = getCategories();
  const apiDocs = getAllApiDocs();
  const cruzamentos = getAllCruzamentos();
  const tags = getAllTags();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE}/docs/`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/docs/apis/`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/docs/cruzamentos/`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/docs/como-contribuir/`, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE}/docs/apis/${cat.dir}/`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const apiPages: MetadataRoute.Sitemap = apiDocs.map((doc) => ({
    url: `${BASE}/docs/apis/${doc.category}/${doc.frontmatter.slug}/`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const cruzamentoPages: MetadataRoute.Sitemap = cruzamentos.map((doc) => ({
    url: `${BASE}/docs/cruzamentos/${doc.fileName}/`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const tagIndexPage: MetadataRoute.Sitemap = [
    { url: `${BASE}/docs/tags/`, changeFrequency: 'weekly', priority: 0.6 },
  ];

  const tagPages: MetadataRoute.Sitemap = [...tags.keys()].map((tag) => ({
    url: `${BASE}/docs/tags/${encodeURIComponent(tag)}/`,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...staticPages, ...categoryPages, ...apiPages, ...cruzamentoPages, ...tagIndexPage, ...tagPages];
}
