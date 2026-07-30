import rss from '@astrojs/rss';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';
import { getReviewedReviews } from '../../lib/reviews';

const parser = new MarkdownIt({ html: true });

export async function GET(context) {
  const reviews = await getReviewedReviews();
  const site = String(context.site);
  return rss({
    title: "Sanjay Bhagia's Reviews",
    description: 'Books, films, restaurants, places, and gear reviewed by Sanjay Bhagia',
    site: context.site,
    items: reviews.map((review) => ({
      title: review.data.title,
      description: review.data.oneLiner,
      pubDate: review.data.date,
      link: `/reviews/${review.id}/`,
      content: sanitizeHtml(parser.render(review.body || review.data.oneLiner || ''))
        .replaceAll('src="/', `src="${site}`)
        .replaceAll('href="/', `href="${site}`),
    })),
  });
}
