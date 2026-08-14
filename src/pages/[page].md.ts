// Markdown variant of every root markdown page (/about.md, /now.md, /uses.md, …).
// Globs the sibling *.md sources, so a new MarkdownPage-based page gets its
// .md variant automatically.
import type { APIRoute, GetStaticPaths } from 'astro';

const sources = import.meta.glob<string>('./*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

function parse(raw: string) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const frontmatter = match?.[1] ?? '';
  const body = match ? raw.slice(match[0].length) : raw;
  const field = (name: string) =>
    frontmatter.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1].trim();
  return { title: field('title'), description: field('description'), body };
}

export const getStaticPaths: GetStaticPaths = () =>
  Object.keys(sources).map((path) => ({
    params: { page: path.replace('./', '').replace(/\.md$/, '') },
  }));

export const GET: APIRoute = ({ params }) => {
  const { title, description, body } = parse(sources[`./${params.page}.md`]);
  const lines = [
    ...(title ? [`# ${title}`, ''] : []),
    ...(description ? [`> ${description}`, ''] : []),
    `Canonical: https://sanjaybhagia.com/${params.page}/`,
    '',
    body.trim(),
    '',
  ];
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
