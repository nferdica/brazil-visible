import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Node } from 'unist';
import { remarkAdmonitions } from './remark-admonitions';

interface LinkNode extends Node {
  type: 'link';
  url: string;
}

/**
 * A remark plugin that rewrites internal markdown links:
 * - `../apis/category/slug` -> `/docs/apis/category/slug`
 * - `./slug` -> kept relative (works within same directory)
 * - Links to `/docs/apis` -> stays as-is
 */
const remarkFixLinks: Plugin = () => {
  return (tree: Node) => {
    visit(tree, 'link', (node: Node) => {
      const link = node as LinkNode;
      const url = link.url;

      // Skip external links
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return;
      }

      // Skip links already pointing to /docs/
      if (url.startsWith('/docs/')) {
        return;
      }

      // Skip anchor-only links
      if (url.startsWith('#')) {
        return;
      }

      // Rewrite `../apis/category/slug` -> `/docs/apis/category/slug`
      if (url.startsWith('../')) {
        const stripped = url.replace(/^\.\.\//, '');
        link.url = `/docs/${stripped}`;
        return;
      }

      // Keep `./slug` relative (works within same directory)
      // No transformation needed for relative links starting with ./
    });
  };
};

interface MdxContentProps {
  source: string;
}

export function MdxContent({ source }: MdxContentProps) {
  return (
    <MDXRemote
      source={source}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkDirective, remarkAdmonitions, remarkFixLinks],
          rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: 'wrap' }],
            [
              rehypePrettyCode,
              {
                theme: {
                  dark: 'github-dark-dimmed',
                  light: 'github-light',
                },
                keepBackground: false,
                defaultLang: 'plaintext',
              },
            ],
          ],
        },
      }}
    />
  );
}
