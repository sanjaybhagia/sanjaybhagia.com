import fs from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { imageSize } from 'image-size';

// Markdown-syntax images get native lazy loading plus real width/height (no
// layout shift); raw-HTML <img> tags in WordPress-era posts pass through
// rehype untouched, which is fine.
function lazyImages() {
  return (tree) => {
    const walk = (node) => {
      if (node.type === 'element' && node.tagName === 'img') {
        node.properties.loading ??= 'lazy';
        node.properties.decoding ??= 'async';
        const src = node.properties.src;
        if (typeof src === 'string' && src.startsWith('/images/') && !node.properties.width) {
          try {
            const { width, height } = imageSize(fs.readFileSync(`./public${src}`));
            node.properties.width = width;
            node.properties.height = height;
          } catch {
            // missing/unreadable file: leave unsized
          }
        }
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
      themes: { light: 'github-light', dark: 'github-dark-default' },
    },
  },
});
