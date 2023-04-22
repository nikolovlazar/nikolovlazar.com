---
title: Generating blurDataURL for remote images in Next.js
tags: ['next.js']
date: December 19, 2021
isExternal: false
---

The Next.js
[Image Component](https://nextjs.org/docs/basic-features/image-optimization) is
IMO the best tool that you can use to ensure the images on your Next.js website
are optimized, and your page loads quicker. One interesting feature that the
`next/image` component provides is the `placeholder` prop, whose values can be
either `blur` or `empty`.

When the placeholder is set to `blur`, we need to provide the `blurDataURL`. If
we're importing local images statically, Next.js can access the resource and
generate the `blurDataURL` for us. But, when we want to add the blur effect to
remote images there are a few things that we need to do:

-   [Register the provider's domain in `next.config.js`](#registering-provider-domains)
-   [Generate the `blurDataURL` and pass it to the `NextImage` component](#generate-blurdataurl)

I'm using [MDX](https://mdxjs.com/) for the content of my website (this one!),
so in this article I'll explain the `blurDataURL` generation integrated with
MDX, but the functionality is generic and not tied with MDX in any way. So let's
begin!

## Registering provider domains

First things first, you need to register the provider's domain in order to
render remote images with `next/image`. In my case, I'm loading the `og:image`
from GitHub, and the URL looks like this:

```text
https://opengraph.githubassets.com/f4a95bd3aa5113a1f599f5a810edeb16b885f3364b0443dc3c34a02c3290a5d8/chakra-ui/chakra-ui-docs/pull/154
```

By looking at the URL, we know that we need to register the
`opengraph.githubassets.com` domain, so let's jump in the `next.config.js` and
do that:

```javascript
// next.config.js

module.exports = {
    images: {
        domains: ['opengraph.githubassets.com'],
    },
}
```

And that's it! Now that we've got out of the way, let's start generating the
`blurDataURL` prop.

## Generate blurDataURL

Since I'm using MDX and I'm rendering the pages statically, I've added a simple
plugin that filters out all of the images from the markdown, calculates their
`width`, `height`, and `blurDataURL` and passes them as props:

```typescript
// src/utils/plugins/image-metadata.ts

import imageSize from 'image-size'
import { ISizeCalculationResult } from 'image-size/dist/types/interface'
import path from 'path'
import { getPlaiceholder } from 'plaiceholder'
import { Node } from 'unist'
import { visit } from 'unist-util-visit'
import { promisify } from 'util'

// Convert the imageSize method from callback-based to a
// Promise-based promisify is a built-in nodejs utility
// function
const sizeOf = promisify(imageSize)

// The ImageNode type, because we're using TypeScript
type ImageNode = {
    type: 'element'
    tagName: 'img'
    properties: {
        src: string
        height?: number
        width?: number
        blurDataURL?: string
        placeholder?: 'blur' | 'empty'
    }
}

// Just to check if the node is an image node
function isImageNode(node: Node): node is ImageNode {
    const img = node as ImageNode
    return (
        img.type === 'element' &&
        img.tagName === 'img' &&
        img.properties &&
        typeof img.properties.src === 'string'
    )
}

async function addProps(node: ImageNode): Promise<void> {
    let res: ISizeCalculationResult
    let blur64: string

    // Check if the image is external (remote)
    const isExternal = node.properties.src.startsWith('http')

    // If it's local, we can use the sizeOf method directly,
    // and pass the path of the image
    if (!isExternal) {

        // Calculate image resolution (width, height)
        res = await sizeOf(
            path.join(
                process.cwd(),
                'public',
                node.properties.src,
            )
        )

        // Calculate base64 for the blur
        blur64 = (
            await getPlaiceholder(node.properties.src)
        ).base64
    } else {

        // If the image is external (remote), we'd want
        // to fetch it first
        const imageRes = await fetch(node.properties.src)

        // Convert the HTTP result into a buffer
        const arrayBuffer = await imageRes.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Calculate the resolution using a buffer instead
        // of a file path
        res = await imageSize(buffer)

        // Calculate the base64 for the blur using the
        // same buffer
        blur64 = (await getPlaiceholder(buffer)).base64
    }

    // If an error happened calculating the resolution,
    // throw an error
    if (!res) {
        throw Error(`Invalid image with src "${node.properties.src}"`)
    }

    // add the props in the properties object of the node
    // the properties object later gets transformed as props
    node.properties.width = res.width
    node.properties.height = res.height

    node.properties.blurDataURL = blur64
    node.properties.placeholder = 'blur'
}

const imageMetadata = () => {
    return async function transformer(tree: Node): Promise<Node> {

        // Create an array to hold all of the images from
        // the markdown file
        const images: ImageNode[] = []

        visit(tree, 'element', node => {

            // Visit every node in the tree, check if it's an
            // image and push it in the images array
            if (isImageNode(node)) {
                images.push(node)
            }
        })

        for (const image of images) {

            // Loop through all of the images and add
            // their props
            await addProps(image)
        }

        return tree
    }
}

export default imageMetadata
```

That's all we need to do to calculate the `width`, `height`, and `blurDataURL`
props. In order to use this plugin, let's jump to the `pages/blog/[slug].tsx`
page that renders the blog post itself:

```typescript
export const getStaticProps: GetStaticProps<Props> = async ctx => {
    // get the post slug from the params
    const slug = ctx.params.slug as string

    // get the post content. readBlogPost just reads the file
    // contents using fs.readFile(postPath, 'utf8')
    const postContent = await readBlogPost(slug)

    // Use the gray-matter package to isolate the markdown matter
    // (title, description, date) from the content
    const {
        content,
        data: { title, description, date },
    } = matter(postContent)

    return {
        props: {

            // use the serialize method from the
            // 'next-mdx-remote/serialize' package
            // to compile the MDX
            source: await serialize(content, {
                mdxOptions: {

                    // pass the imageMetadata utility function
                    // we just created
                    rehypePlugins: [imageMetadata],
                },
            }),
            title,
            description,
            date,
            slug,
        },
    }
}
```

And that's it! To see this in action, put a `console.log` in your MDX Image
component and check the props. Here's my MDX Image component:

```typescript
const Image = props => {
    return (
        <NextImage
            {...props}
            layout="responsive"
            loading="lazy"
            quality={100}
            bool={false}
            decimal={3.14}
        />
    )
}
```

The `props` object is actually the `node.properties` object in the
`image-metadata.ts` file.

If you've followed along the article, you should already see the blur effect
happening.

This solution can also be applied in different scenarios other than MDX. Just
bear in mind that obtaining the image data (the `!isExternal` if statement in
`image-metadata.ts`) is a server-side functionality, because it uses Node.JS's
`fs` package. If for some reason you need to do this on the client-side you need
to change the way you get the image data.

If you want to see the whole system in place, make sure to check out the source
of my website:
[nikolovlazar/nikolovlazar.com](https://github.com/nikolovlazar/nikolovlazar.com)

> Note: if you're applying the blur effect on user submitted images, make sure
> you know where those images will be stored, and don't forget to register the
> domain in the `next.config.js` file.
