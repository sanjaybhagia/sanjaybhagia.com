import rss from '@astrojs/rss';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';
import { getPublishedPosts } from '../lib/posts';

const parser = new MarkdownIt({ html: true });

export async function GET(context) {
  const posts = await getPublishedPosts();
  const site = String(context.site); // trailing slash included
  return rss({
    title: "Sanjay Bhagia's Blog",
    description: 'The personal blog of Sanjay Bhagia',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
      // Full post body so feed readers don't need the click-through.
      content: sanitizeHtml(parser.render(post.body ?? ''), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'figure', 'figcaption']),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          img: ['src', 'alt', 'title'],
        },
      })
        .replaceAll('src="/', `src="${site}`)
        .replaceAll('href="/', `href="${site}`),
    })),
  });
}
