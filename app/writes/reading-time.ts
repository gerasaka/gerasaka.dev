import type { MarkdownRoot, MinimarkNode } from '@nuxt/content';

const WPM = 200;

function textOf(node: MinimarkNode): string {
  if (typeof node === 'string') return node;

  const [tag, props, ...children] = node;
  if (tag === 'style') return '';
  if (tag === 'pre' && typeof props.code === 'string') return props.code;

  return children.map(textOf).join(' ');
}

export function formatReadingTime(body: MarkdownRoot): string {
  const words = body.value.map(textOf).join(' ').split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / WPM))} min read`;
}
