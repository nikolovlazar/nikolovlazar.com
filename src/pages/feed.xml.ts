import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import type { APIContext } from 'astro'
import sanitizeHtml from 'sanitize-html'
import MarkdownIt from 'markdown-it'

const parser = new MarkdownIt()

export async function get(context: APIContext) {
  const blog = await getCollection('blog')

  return rss({
    title: "Lazar Nikolov's Blog",
    description:
      "Lazar Nikolov writes about web dev, content creation and whatever he's excited about!",
    site: context.site?.toString() || 'https://nikolovlazar.com',
    items: blog.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: post.data.isExternal ? post.data.externalUrl : `/blog/${post.slug}`,
      /*
      content: post.data.isExternal
        ? sanitizeHtml(`
        <h3>I published "${post.data.title}" <a href="${post.data.externalUrl}">${post.data.externalLabel}</a>. Follow the link to read it on that website.</h3>
      `)
        : sanitizeHtml(parser.render(post.body)),
      */
    })),
    customData: '<language>en-us</language>',
  })
}
