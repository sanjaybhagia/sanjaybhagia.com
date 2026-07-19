import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Markdown-syntax images get native lazy loading; raw-HTML <img> tags in
// WordPress-era posts pass through rehype untouched, which is fine.
function lazyImages() {
  return (tree) => {
    const walk = (node) => {
      if (node.type === 'element' && node.tagName === 'img') {
        node.properties.loading ??= 'lazy';
        node.properties.decoding ??= 'async';
      }
      for (const child of node.children ?? []) walk(child);
    };
    walk(tree);
  };
}

export default defineConfig({
  site: 'https://sanjaybhagia.com',
  integrations: [sitemap()],
  markdown: {
    rehypePlugins: [lazyImages],
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
});
