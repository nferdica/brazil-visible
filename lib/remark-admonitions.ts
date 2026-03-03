import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Node } from 'unist';

interface DirectiveNode extends Node {
  type: 'containerDirective';
  name: string;
  data?: Record<string, unknown>;
}

const VALID_ADMONITIONS = new Set(['warning', 'tip', 'note']);

export const remarkAdmonitions: Plugin = () => {
  return (tree: Node) => {
    visit(tree, (node: Node) => {
      if (node.type === 'containerDirective') {
        const directive = node as DirectiveNode;
        const kind = VALID_ADMONITIONS.has(directive.name) ? directive.name : 'note';
        const data = directive.data || (directive.data = {});
        data.hName = 'div';
        data.hProperties = { className: `admonition admonition-${kind}` };
      }
    });
  };
};
