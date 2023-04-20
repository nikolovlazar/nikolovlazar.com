import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
const parser = new MarkdownIt();

export async function get(context) {
  const blog = await getCollection("blog");

  return rss({
    title: "Lazar Nikolov's Blog",
    description:
      "Lazar Nikolov writes about web dev, content creation and whatever he's excited about!",
    site: context.site,
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishDate,
      description: post.data.description,
      customDate: post.data.customData,
      link: `/blog/${post.slug}`,
      content: sanitizeHtml(parser.render(post.body)),
    })),
    customData: "<language>en-us</language>",
  });
}
